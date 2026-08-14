// Paying a person, in one place.
//
// Four screens can pay someone: the DM thread's attach menu, the contact info
// sheet, the Mesh tab's peer sheet, and the Wallet tab's Zap. They used to reach
// two different implementations depending on which door the user walked through,
// and the two disagreed about almost everything that matters. The chat door sent
// a reclaimable bearer token and never tried NIP-61 even when the recipient had
// published how to be paid properly; the Zap door tried NIP-61 first but, when
// it fell back to a DM, published that DM straight to the relays, so it left no
// message in the conversation, could not be retried when a relay dropped it, and
// on a publish timeout reserved a second set of proofs for the same payment.
//
// So there is one entry point now, `payPerson`, and it owns the whole ladder:
//
//   1. Radio, when a direct link exists. Instant, local, needs no internet, and
//      reclaimable. Someone standing in front of you should not wait on a mint.
//   2. Nutzap (NIP-61), when there is no radio link but we know their Nostr key,
//      they have published a kind 10019, and we hold value at a mint they
//      accept. The proofs are locked to their key, so this is the only rail
//      where the money is definitively theirs whether or not they ever come
//      online. It is also the only rail that cannot be taken back.
//   3. An ordinary token, delivered by `MeshService.sendDm`, which picks its own
//      best transport (Nostr gift-wrap, courier, or the outbox). Reclaimable.
//   4. A token string the user hands over themselves. Reclaimable.
//
// Rails 3 and 4 keep the guarantee the wallet service was built around: proofs
// are reserved, not spent, and a send that never lands can be pulled back.
//
// Every rail reports which one it was and whether it can be undone. That is not
// decoration: "locked to them forever" and "queued, take it back whenever" are
// the same gesture to the user and completely different facts about their money.

import { t } from "@i18n";
import { showAlert, useAlertStore } from "@store/alert-store";
import { useChatStore, type ChatMessage } from "@store/chat-store";
import { useContactsStore } from "@store/contacts-store";
import { useOutboxStore } from "@store/outbox-store";
import { useWalletStore } from "@store/wallet-store";
import { isNostrId, NOSTR_ID_PREFIX } from "@utils/username";
import { getMeshService, type MeshService } from "./mesh-service";
import {
  failNutzapDelivery,
  failSend,
  findNutzapTarget,
  lockProofsForNutzap,
  prepareSend,
  publishLockedNutzap,
  quoteSend,
  reclaimSend,
  settleNutzap,
  WalletError,
  type NutzapTarget,
} from "./wallet-service";

// How the DM actually left the device. `sendDm` already works this out; before
// this was surfaced, every screen said "sent over the mesh" even when there was
// no route and the token had merely been queued, which is the difference
// between "they have it" and "they might get it tomorrow".
export type DeliveryRoute = ReturnType<MeshService["sendDm"]>;

// Which rail carried the payment. Ordered best to worst in the header above.
export type PayRail =
  | "mesh"
  | "nutzap"
  // Locked proofs the relay would not take, delivered as a message instead.
  | "nutzap-dm"
  // Locked proofs that nothing could carry at all. The money is committed to the
  // recipient and the token comes back with the result as the only way to it.
  | "nutzap-undelivered"
  | "nostr"
  | "courier"
  // Nothing carried it. The token comes back with the result for the user to
  // hand over however they like, and stays reserved until they say it landed.
  | "queued";

export interface PayResult {
  rail: PayRail;
  amount: number;
  unit: string;
  // The mint the coins came from. A token names exactly one, and the Wallet tab
  // shows it beside a token the user has to deliver by hand.
  mintUrl: string;
  txId: string;
  // Only set when nothing could carry it and the user must deliver by hand.
  token?: string;
  // True when the money is committed and Pending will not offer it back. Only
  // the nutzap rails are final: their proofs are locked to the recipient's key
  // and are not ours to reclaim.
  final: boolean;
  // Why a better rail was not used, when one was not. User-facing.
  fallbackReason?: string;
}

export interface PayPersonParams {
  // Mesh peer ID, or a `nostr_<pubkey>` id for a Nostr-only correspondent.
  // Either this or nostrPubkey is required; both is better.
  peerID?: string;
  // Hex x-only Nostr pubkey. The Zap sheet has only this.
  nostrPubkey?: string;
  amount: number;
  memo?: string;
  unit?: string;
  // Sender display name for the local echo. The DM thread has the user's real
  // nickname; the peer sheet and wallet picker only need "You".
  senderNickname?: string;
}

// Pay someone. Returns null when the user cancelled or the wallet refused;
// errors are reported here so call sites do not each repeat the message mapping.
export async function payPerson(
  params: PayPersonParams,
): Promise<PayResult | null> {
  const amount = Math.floor(params.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const unit = params.unit ?? "sat";

  const service = getMeshService();
  if (!service) {
    // Without the service there is no transport and no Nostr client, so there
    // is no rail at all. Nothing has been deducted.
    showAlert(
      t("wallet.xfer.mesh_offline"),
      t("wallet.xfer.mesh_offline_body"),
    );
    return null;
  }

  const payee = resolvePayee(params, service);
  if (payee === null) return null;

  try {
    // Rail 1. A direct radio link means they are right here: hand it over now
    // rather than spending a mint round trip to build a fancier instrument.
    // This also keeps the in-person case working with no internet at all, which
    // is the case the whole app exists for.
    const nearby = service.hasDirectLink(payee.peerID);

    if (!nearby && payee.nostrPubkey !== undefined) {
      const client = service.getNostrClient();
      const privKey = service.getNostrPrivKey();
      if (client) {
        // Rail 2. Never throws for "not this rail" reasons, so a miss here just
        // falls through to the token rails with nothing spent.
        const lookup = await findNutzapTarget({
          recipientPubkey: payee.nostrPubkey,
          amount,
          unit,
          client,
        });
        if (lookup.ok) {
          const paid = await payAsNutzap({
            target: lookup.target,
            recipientPubkey: payee.nostrPubkey,
            peerID: payee.peerID,
            amount,
            unit,
            comment: params.memo,
            senderNickname: params.senderNickname,
            client,
            privKey,
          });
          if (paid !== null) return paid;
        } else {
          // Remember why, so the confirmation can say "sent as a token
          // because they have not published nutzap info" rather than leaving
          // the user to wonder why this payment differed from the last.
          payee.fallbackReason = lookup.reason;
        }
      } else {
        payee.fallbackReason = t("wallet.svc.no_relay");
      }
    }

    // Rails 3 and 4.
    return await payAsToken({
      peerID: payee.peerID,
      amount,
      unit,
      memo: params.memo,
      senderNickname: params.senderNickname,
      fallbackReason: payee.fallbackReason,
    });
  } catch (err) {
    reportWalletError(err);
    return null;
  }
}

interface ResolvedPayee {
  // Always present: the id both the chat thread and `sendDm` are keyed by.
  peerID: string;
  nostrPubkey?: string;
  fallbackReason?: string;
}

// Work out who is being paid, from whichever half the caller happens to hold.
//
// Both halves matter. The peer ID names the conversation the receipt belongs in
// and is what `sendDm` routes on; the Nostr key is what makes rail 2 possible.
// Filling in the missing half is what stops a payment started from the Wallet
// tab landing in a second, parallel thread with the same person.
function resolvePayee(
  params: PayPersonParams,
  service: MeshService,
): ResolvedPayee | null {
  if (params.peerID !== undefined && params.peerID.length > 0) {
    const peerID = params.peerID;
    // A `nostr_` id carries its own key. Otherwise ask the live registry (their
    // last ANNOUNCE) and then the durable contact record, which is the one that
    // survives them walking out of Bluetooth range.
    const nostrPubkey = isNostrId(peerID)
      ? peerID.slice(NOSTR_ID_PREFIX.length)
      : (params.nostrPubkey ??
        service.getPeerNostrPubkey(peerID) ??
        useContactsStore.getState().getContact(peerID)?.nostrPubkeyHex);
    return {
      peerID,
      ...(nostrPubkey !== undefined && nostrPubkey.length > 0
        ? { nostrPubkey }
        : {}),
    };
  }

  const nostrPubkey = params.nostrPubkey;
  if (nostrPubkey === undefined || nostrPubkey.length === 0) return null;

  // Only a key. If it belongs to someone already in contacts, pay them under
  // the peer ID we know them by, so the receipt lands in the thread the user
  // already has with them and the radio rail stays available.
  const known = Object.values(useContactsStore.getState().contacts).find(
    (c) => c.nostrPubkeyHex === nostrPubkey,
  );
  return {
    peerID: known?.peerID ?? `${NOSTR_ID_PREFIX}${nostrPubkey}`,
    nostrPubkey,
  };
}

// Rail 2. Lock proofs to their key and publish the kind 9321.
//
// Returns null when nothing was spent and the caller should try a lesser rail.
// Once proofs are locked it never returns null, because the value has left the
// wallet for good: from that point every branch is about delivery, and falling
// through would pay the same person twice and strand the first payment.
async function payAsNutzap(params: {
  target: NutzapTarget;
  recipientPubkey: string;
  peerID: string;
  amount: number;
  unit: string;
  comment?: string;
  senderNickname?: string;
  client: NonNullable<ReturnType<MeshService["getNostrClient"]>>;
  privKey: Uint8Array;
}): Promise<PayResult | null> {
  // Locking and publishing fail very differently, so they cannot share a catch.
  // A failed lock spends nothing, because the mint's swap is atomic. A failed
  // publish means the value is already committed.
  let locked;
  try {
    locked = await lockProofsForNutzap({
      amount: params.amount,
      mintUrl: params.target.mintUrl,
      unit: params.unit,
      recipientPubkey: params.target.p2pkPubkey,
    });
  } catch {
    // Mint unreachable, Tor blocking, denominations short. Nothing left the
    // wallet, so the token rails below are safe to try.
    return null;
  }

  const { published, token } = await publishLockedNutzap({
    locked: locked.locked,
    txId: locked.txId,
    mintUrl: params.target.mintUrl,
    unit: params.unit,
    recipientPubkey: params.recipientPubkey,
    senderPrivKey: params.privKey,
    client: params.client,
    comment: params.comment,
    // Their relays, not ours. See NutzapTarget in wallet-service.
    relays: params.target.relays,
  });

  const base = {
    amount: params.amount,
    unit: params.unit,
    mintUrl: params.target.mintUrl,
    txId: locked.txId,
    final: true,
  };
  if (published) {
    noteNutzapInThread(params.peerID, locked.txId, params.amount, params.unit);
    return { rail: "nutzap", ...base };
  }

  // The relay would not take it. The token is worthless to anyone but the
  // recipient, so it can travel over any channel without the bearer risk an
  // ordinary token carries: hand it to the DM ladder, which will retry it from
  // the outbox if the internet is what failed.
  const route = deliverTokenToPeer({
    peerID: params.peerID,
    prepared: { txId: locked.txId, token },
    senderNickname: params.senderNickname,
    final: true,
  });
  if (route === "sent" || route === "sent-nostr") {
    settleNutzap(locked.txId);
    // No `fallbackReason`: the rail sentence for this case already says the
    // relay refused it and that a message went instead. Repeating it under
    // "sent this way because…" says the same thing twice.
    return { rail: "nutzap-dm", ...base };
  }

  // Queued or handed to a courier. Still theirs, still not reclaimable, so the
  // transaction records why it is sitting there instead of looking abandoned,
  // and `reconcile` closes it out if the outbox delivers it later.
  failNutzapDelivery(locked.txId, t("wallet.svc.locked_undelivered"));
  return { rail: "nutzap-undelivered", ...base, token };
}

// Leave a note in the conversation when a nutzap went out of it.
//
// A nutzap is not a message: nothing is sent to the peer over any transport we
// control, so there is no bubble to render and no delivery status to track. But
// paying someone from inside their thread and having the thread show absolutely
// nothing reads as a payment that vanished, which is the last thing money should
// do. A system notice is the honest shape for this: local-only, centered, never
// transmitted, exactly like the screenshot notice.
//
// Only for a conversation that already exists. Zapping a stranger's npub from
// the Wallet tab should not manufacture a DM thread with them; that belongs in
// the wallet's own history, which already has it.
function noteNutzapInThread(
  peerID: string,
  txId: string,
  amount: number,
  unit: string,
): void {
  const chat = useChatStore.getState();
  const channel = `dm:${peerID}`;
  if (chat.messages[channel] === undefined) return;
  chat.addMessage({
    // Keyed by the transaction, not the clock. Two nutzaps inside the same
    // millisecond would otherwise collide on id and the store would keep one.
    id: `nutzap-note-${txId}`,
    channel,
    senderID: getMeshService()?.getPeerID() ?? "",
    senderNickname: "",
    text: t("wallet.pay.thread_receipt", {
      amount: amount.toLocaleString(),
      unit,
    }),
    timestampMs: Date.now(),
    isMine: true,
    isSystem: true,
  });
}

// Rails 3 and 4. Build an ordinary reserved token and let `sendDm` route it.
async function payAsToken(params: {
  peerID: string;
  amount: number;
  unit: string;
  memo?: string;
  senderNickname?: string;
  fallbackReason?: string;
}): Promise<PayResult | null> {
  const quote = await quoteSend({ amount: params.amount, unit: params.unit });
  if (!quote.exact) {
    // Ask before reserving anything. An inexact offline send overpays and
    // cannot be undone once the recipient redeems.
    const confirmed = await confirm(
      t("wallet.err.exact_amount"),
      t("wallet.xfer.inexact_body", {
        amount: params.amount.toLocaleString(),
        unit: params.unit,
        spend: quote.spend.toLocaleString(),
        extra: (quote.spend - params.amount).toLocaleString(),
      }),
      t("wallet.xfer.send_amount", { amount: quote.spend.toLocaleString() }),
    );
    if (!confirmed) return null;
  }

  const prepared = await prepareSend({
    amount: params.amount,
    unit: params.unit,
    memo: params.memo,
    counterparty: params.peerID,
    allowInexact: true,
  });

  const route = deliverTokenToPeer({
    peerID: params.peerID,
    prepared,
    senderNickname: params.senderNickname,
  });

  return {
    rail: railForRoute(route),
    amount: prepared.amount,
    unit: prepared.unit,
    mintUrl: prepared.mintUrl,
    txId: prepared.txId,
    // The user only needs the string in their hands when nothing carried it.
    ...(route === "queued" ? { token: prepared.token } : {}),
    final: false,
    ...(params.fallbackReason !== undefined
      ? { fallbackReason: params.fallbackReason }
      : {}),
  };
}

function railForRoute(route: DeliveryRoute): PayRail {
  switch (route) {
    case "sent":
      return "mesh";
    case "sent-nostr":
      return "nostr";
    case "needs-courier":
      return "courier";
    case "queued":
      return "queued";
  }
}

// One sentence describing where the token went, for the confirmation the user
// sees. Deliberately honest about the queued cases: the money is reserved and
// reclaimable either way, but "on its way" and "waiting for a route" are very
// different things to the person who just paid.
export function describeRoute(route: DeliveryRoute): string {
  return describeRail(railForRoute(route));
}

// The same sentence, for a rail. Paired with `describeFinality`: between them
// they answer the only two questions the user actually has, which are where the
// money went and whether they can still stop it. Both are assembled by
// `describePayResult`, which is what the screens call.
function describeRail(rail: PayRail): string {
  switch (rail) {
    case "mesh":
      return t("wallet.xfer.route_mesh");
    case "nutzap":
      return t("wallet.pay.rail_nutzap");
    case "nutzap-dm":
      return t("wallet.pay.rail_nutzap_dm");
    case "nutzap-undelivered":
      return t("wallet.pay.rail_nutzap_undelivered");
    case "nostr":
      return t("wallet.xfer.route_nostr");
    case "courier":
      return t("wallet.xfer.route_courier");
    case "queued":
      return t("wallet.xfer.route_queued");
  }
}

function describeFinality(final: boolean): string {
  return final ? t("wallet.pay.final") : t("wallet.pay.reclaimable");
}

// The whole confirmation body: rail, then why it was that rail, then whether it
// can be undone. Built here so all four doors say the same thing in the same
// order rather than each assembling their own version.
export function describePayResult(result: PayResult): string {
  const why =
    result.fallbackReason !== undefined && result.fallbackReason.length > 0
      ? ` ${t("wallet.pay.why", { reason: result.fallbackReason })}`
      : "";
  return `${describeRail(result.rail)}${why} ${describeFinality(result.final)}`;
}

// A token that is ready to be handed to someone. `PreparedSend` satisfies this,
// and so does a locked nutzap that the relay refused, which is the reason this
// is structural rather than just taking a `PreparedSend`.
export interface DeliverableToken {
  txId: string;
  token: string;
}

// Post a token into a DM thread and hand it to the mesh.
//
// Split out from the rails above because the Wallet tab's peer picker acts on a
// token that was built earlier (the user chose Share, changed their mind, and
// picked a peer instead). Preparing a second one there would reserve a second
// set of proofs for the same payment.
export function deliverTokenToPeer(params: {
  peerID: string;
  prepared: DeliverableToken;
  senderNickname?: string;
  // Locked nutzap proofs, which are not ours to take back. Only changes how a
  // failed delivery is recorded; the message and routing are identical.
  final?: boolean;
}): DeliveryRoute {
  const service = getMeshService();
  if (!service) return "queued";

  const channel = `dm:${params.peerID}`;
  const chat = useChatStore.getState();
  chat.addChannel(channel);

  // The transaction id doubles as the message id, so the DM's delivery status
  // and the wallet's pending send refer to the same thing and a later
  // "delivered" receipt can settle the transaction.
  const message: ChatMessage = {
    id: params.prepared.txId,
    channel,
    senderID: service.getPeerID(),
    senderNickname: params.senderNickname ?? t("chat.you"),
    text: params.prepared.token,
    timestampMs: Date.now(),
    isMine: true,
    status: "sending",
  };
  chat.addMessage(message);
  const route = service.sendDm(
    params.peerID,
    params.prepared.token,
    params.prepared.txId,
  );

  // Report the route on the bubble, the same mapping a text DM uses. Without
  // this the token card sat on "sending" forever: a send that found no route has
  // nothing to acknowledge it, so no receipt was ever coming.
  chat.setMessageStatus(
    channel,
    params.prepared.txId,
    route === "needs-courier"
      ? "carried"
      : route === "queued"
        ? "queued"
        : "sent",
  );

  // Record the awkward routes on the transaction itself, so the Pending card in
  // the Wallet tab explains why a send is still sitting there instead of just
  // showing an unexplained pending entry days later. A locked nutzap is recorded
  // by the caller, which knows it must not be offered back.
  if ((route === "queued" || route === "needs-courier") && !params.final) {
    failSend(params.prepared.txId, describeRoute(route));
  }
  return route;
}

// Reclaim a pending ecash send, cancelling every copy of it.
//
// `reclaimSend` on its own only moves proofs. A token send is also a message in
// a DM thread and, when it found no route, an entry in the outbox. The outbox is
// a promise to deliver: leaving the entry there put the proofs back in the
// spendable balance while the mesh still held a copy to hand over, so the next
// route to appear delivered a token the sender had already taken back.
//
// A locked nutzap has no reservation, so `reclaimSend` returns false and this
// stops before touching the thread or the outbox. That is the correct answer:
// those proofs are the recipient's, and the queued copy is the only way they
// will ever see them.
export function reclaimTokenSend(txId: string): boolean {
  // Read the counterparty before reclaiming, since it names the DM thread. A
  // token built by hand and never addressed to anyone has none, and no bubble to
  // update.
  const peerID = useWalletStore
    .getState()
    .history.find((tx) => tx.id === txId)?.counterparty;
  if (!reclaimSend(txId)) return false;
  useOutboxStore.getState().resolve(txId);
  if (peerID !== undefined && peerID.length > 0) {
    useChatStore.getState().setMessageStatus(`dm:${peerID}`, txId, "reclaimed");
  }
  return true;
}

// Map a WalletError onto the alert the user sees. Kept here rather than in each
// screen so the wording for "not enough balance" is identical everywhere.
export function reportWalletError(err: unknown): void {
  if (err instanceof WalletError) {
    const titles: Record<string, string> = {
      locked: t("wallet.err.locked"),
      offline: t("wallet.err.mint_unreachable"),
      "tor-blocked": t("wallet.err.tor_blocked"),
      insufficient: t("wallet.err.insufficient"),
      inexact: t("wallet.err.exact_amount"),
      "no-mint": t("wallet.err.no_mint"),
      unsupported: t("wallet.err.mint_unsupported"),
      "mint-error": t("wallet.err.mint_refused"),
      "invalid-token": t("wallet.err.unreadable"),
      "forged-token": t("wallet.err.rejected"),
      "already-spent": t("wallet.err.already_spent"),
    };
    showAlert(
      titles[err.code] ?? t("wallet.xfer.could_not_send"),
      err.detail ? `${err.message}\n\n${err.detail}` : err.message,
    );
    return;
  }
  showAlert(t("wallet.xfer.could_not_send"), String(err));
}

// The app's alert store is callback-based; this wraps it so the send flow above
// reads as a straight line rather than a nest of continuations.
//
// Tapping the backdrop closes the alert without invoking any button's onPress,
// so a button-only promise would never settle and the send would hang holding
// no proofs but also never returning. Watching `visible` catches that: any
// dismissal that was not an explicit confirm resolves false.
function confirm(
  title: string,
  message: string,
  confirmLabel: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: boolean): void => {
      if (settled) return;
      settled = true;
      unsubscribe();
      resolve(value);
    };
    // custom-alert calls `hide()` and *then* the button's onPress, both
    // synchronously, so this listener fires on a confirm too. Deferring by a
    // tick lets the onPress that follows settle the promise first; if none
    // does, the dismissal was a backdrop tap and cancel is the right answer.
    const unsubscribe = useAlertStore.subscribe((state) => {
      if (state.visible) return;
      setTimeout(() => finish(false), 0);
    });
    showAlert(title, message, [
      {
        text: t("common.cancel"),
        style: "cancel",
        onPress: () => finish(false),
      },
      {
        text: confirmLabel,
        style: "destructive",
        onPress: () => finish(true),
      },
    ]);
  });
}
