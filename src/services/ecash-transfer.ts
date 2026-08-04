// Sending ecash to a mesh peer, in one place.
//
// Three screens can hand ecash to a peer: the Wallet tab's peer picker, the DM
// thread's attach menu, and the Mesh tab's peer sheet. They used to each
// open-code the same sequence and each got it slightly wrong: one used a
// hard-coded "local" sender id, none of them warned about inexact amounts, none
// of them attached a message id so the DM could report delivery, and all three
// deleted the proofs before the DM had left the device.
//
// The flow here is the same one the Wallet tab uses for a manual token, with
// the delivery step filled in:
//
//   1. Quote. If the denominations held cannot make the amount exactly, ask
//      first, because offline there is no change and the difference is a gift.
//   2. Prepare. Proofs move to the reserved bucket and a pending transaction is
//      opened holding the token string.
//   3. Post the token into the DM thread and hand it to the mesh.
//   4. Leave the transaction pending. Delivery over a multi-hop mesh is not
//      instant and not guaranteed, so the user keeps the ability to reclaim
//      until either they confirm it landed or the mint tells us the proofs were
//      redeemed (which `reconcile` checks).

import { t } from "../i18n";
import { showAlert, useAlertStore } from "../store/alert-store";
import { useChatStore, type ChatMessage } from "../store/chat-store";
import { useOutboxStore } from "../store/outbox-store";
import { useWalletStore } from "../store/wallet-store";
import { getMeshService, type MeshService } from "./mesh-service";
import {
  failSend,
  prepareSend,
  quoteSend,
  reclaimSend,
  WalletError,
  type PreparedSend,
} from "./wallet-service";

export interface SendEcashParams {
  peerID: string;
  amount: number;
  memo?: string;
  unit?: string;
  // Sender display name for the local echo. The DM thread has the user's real
  // nickname; the peer sheet and wallet picker only need "You".
  senderNickname?: string;
}

// How the DM actually left the device. `sendDm` already works this out; before
// this was surfaced, every screen said "sent over the mesh" even when there was
// no route and the token had merely been queued, which is the difference
// between "they have it" and "they might get it tomorrow".
export type DeliveryRoute = ReturnType<MeshService["sendDm"]>;

export interface SendEcashResult {
  prepared: PreparedSend;
  route: DeliveryRoute;
}

// One sentence describing where the token went, for the confirmation the user
// sees. Deliberately honest about the queued cases: the money is reserved and
// reclaimable either way, but "on its way" and "waiting for a route" are very
// different things to the person who just paid.
export function describeRoute(route: DeliveryRoute): string {
  switch (route) {
    case "sent":
      return t("wallet.xfer.route_mesh");
    case "sent-nostr":
      return t("wallet.xfer.route_nostr");
    case "needs-courier":
      return t("wallet.xfer.route_courier");
    case "queued":
      return t("wallet.xfer.route_queued");
  }
}

// Returns the prepared send and its delivery route, or null when the user
// cancelled or the wallet refused. Errors are reported to the user here so the
// call sites do not each need their own copy of the message mapping.
export async function sendEcashToPeer(
  params: SendEcashParams,
): Promise<SendEcashResult | null> {
  const amount = Math.floor(params.amount);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const unit = params.unit ?? "sat";
  const service = getMeshService();
  if (!service) {
    showAlert(
      t("wallet.xfer.mesh_offline"),
      t("wallet.xfer.mesh_offline_body"),
    );
    return null;
  }

  try {
    const quote = await quoteSend({ amount, unit });
    if (!quote.exact) {
      // Ask before reserving anything. An inexact offline send overpays and
      // cannot be undone once the recipient redeems.
      const confirmed = await confirm(
        t("wallet.err.exact_amount"),
        t("wallet.xfer.inexact_body", {
          amount: amount.toLocaleString(),
          unit,
          spend: quote.spend.toLocaleString(),
          extra: (quote.spend - amount).toLocaleString(),
        }),
        t("wallet.xfer.send_amount", { amount: quote.spend.toLocaleString() }),
      );
      if (!confirmed) return null;
    }

    const prepared = await prepareSend({
      amount,
      unit,
      memo: params.memo,
      counterparty: params.peerID,
      allowInexact: true,
    });

    const route = deliverTokenToPeer({
      peerID: params.peerID,
      prepared,
      senderNickname: params.senderNickname,
    });
    return { prepared, route };
  } catch (err) {
    reportWalletError(err);
    return null;
  }
}

// Post an already-prepared token into a DM thread and hand it to the mesh.
//
// Split out from `sendEcashToPeer` because the Wallet tab's peer picker acts on
// a token that was built earlier (the user chose Share, changed their mind, and
// picked a peer instead). Preparing a second one there would reserve a second
// set of proofs for the same payment.
export function deliverTokenToPeer(params: {
  peerID: string;
  prepared: PreparedSend;
  senderNickname?: string;
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
  // showing an unexplained pending entry days later.
  if (route === "queued" || route === "needs-courier") {
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
