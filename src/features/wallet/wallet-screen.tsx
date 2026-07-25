// Wallet screen: Cashu ecash balance, mints, transfers and history.
//
// Every operation goes through `services/wallet-service`, which owns proof
// selection, reservations and mint calls. This file is presentation: it decides
// what to ask, what to show, and how to describe what happened. It deliberately
// does no proof arithmetic of its own, because the same logic also runs from
// the DM thread and the peer sheet and the three must not drift.
//
// Three ideas drive the layout:
//
//   * Money that is not fully yours yet is shown as such. Proofs received over
//     the mesh are real value, but the mint has not confirmed they are unspent,
//     so they get an "unconfirmed" line rather than being folded silently into
//     the headline number.
//   * A send in flight is a first-class object. Building a token reserves the
//     proofs; until the user says it landed, the token stays here to re-share
//     or reclaim. Closing a sheet can no longer destroy value.
//   * Anything that needs the internet says so before it is tapped, and says
//     why when it cannot run (offline, Tor, or a mint that lacks the NUT).

import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { nip19 } from "nostr-tools";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  isValidRecoveryPhrase,
  pickVerificationPositions,
  unknownWordsIn,
  verifyPositions,
} from "../../core/payments/wallet-seed";
import {
  deliverTokenToPeer,
  describeRoute,
} from "../../services/ecash-transfer";
import { getMeshService } from "../../services/mesh-service";
import {
  addMint as addMintService,
  claimLightningDeposit,
  confirmSend,
  consolidateMints,
  createLightningDeposit,
  enableWalletBackup,
  getRecoveryPhrase,
  hostOf,
  isMintNetworkBlocked,
  markBackupVerified,
  payLightningInvoice,
  prepareSend,
  quoteLightningWithdrawal,
  quoteSend,
  receiveToken,
  reclaimSend,
  refreshAccount,
  restoreFromRecoveryPhrase,
  sendNutzap,
  WalletError,
  type LightningDeposit,
  type MeltQuote,
  type PreparedSend,
  type RestoreResult,
} from "../../services/wallet-service";
import { showAlert, useAlertStore } from "../../store/alert-store";
import { usePeerStore } from "../../store/peer-store";
import {
  isWalletStorageReady,
  selectAccounts,
  useWalletStore,
  whenWalletHydrated,
  type AccountBalance,
  type WalletTx,
} from "../../store/wallet-store";
import Avatar from "../../ui/components/avatar";
import BottomSheet from "../../ui/components/bottom-sheet";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  TAB_BAR_CLEARANCE,
  useThemeColors,
} from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";

// The four quick actions triggered from the App-level header.
export type WalletAction = "receive" | "send" | "zap" | "addMint";

// How often to poll a pending Lightning deposit while its sheet is open.
const DEPOSIT_POLL_MS = 3000;

// A peer counts as reachable for a hand-off if it was heard from this recently.
const PEER_ONLINE_WINDOW_MS = 60_000;

interface Props {
  action?: WalletAction | null;
  actionTrigger?: number;
}

export default function WalletScreen({
  action,
  actionTrigger,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  // Narrow subscriptions: the whole store changes on every history write, and
  // this screen re-renders a list of peers on a timer as it is.
  const proofs = useWalletStore((s) => s.proofs);
  const mints = useWalletStore((s) => s.mints);
  const reserved = useWalletStore((s) => s.reserved);
  const history = useWalletStore((s) => s.history);
  const backupEnabled = useWalletStore((s) => s.backupEnabled);
  const backupVerified = useWalletStore((s) => s.backupVerified);

  const accounts = useMemo<AccountBalance[]>(
    () => selectAccounts({ proofs, mints, reserved, backupEnabled }),
    [proofs, mints, reserved, backupEnabled],
  );

  const [locked, setLocked] = useState(() => !isWalletStorageReady());
  useEffect(() => {
    // The encrypted store opens and hydrates asynchronously at app start, so
    // the banner clears itself rather than needing a tab switch. Settles once:
    // when the keychain is unavailable the wallet stays locked for good, and
    // polling for a state that will never change just burns battery.
    if (!locked) return;
    let cancelled = false;
    void whenWalletHydrated().then(() => {
      if (!cancelled) setLocked(!isWalletStorageReady());
    });
    return () => {
      cancelled = true;
    };
  }, [locked]);

  const peers = usePeerStore((s) => s.peers);
  const [peerClock, setPeerClock] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setPeerClock(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);
  const onlinePeers = useMemo(() => {
    const cutoff = peerClock - PEER_ONLINE_WINDOW_MS;
    return [...peers.values()].filter((peer) => peer.lastSeenMs >= cutoff);
  }, [peerClock, peers]);

  // ---- Sheet state ----
  const [showReceive, setShowReceive] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showZap, setShowZap] = useState(false);
  const [showAddMint, setShowAddMint] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showPeerPicker, setShowPeerPicker] = useState(false);
  const [showConsolidate, setShowConsolidate] = useState(false);
  const [showRestore, setShowRestore] = useState(false);

  // Recovery-phrase sheet. One sheet, three steps, because they have to happen
  // in order: understand the risk, read the words, prove you wrote them down.
  // "view" is the read-only variant shown once backup is already on.
  const [backupStep, setBackupStep] = useState<
    "warn" | "show" | "verify" | "view" | null
  >(null);
  const [phrase, setPhrase] = useState("");
  const [verifyPositionList, setVerifyPositionList] = useState<number[]>([]);
  const [verifyAnswers, setVerifyAnswers] = useState<Record<number, string>>(
    {},
  );
  const [verifyError, setVerifyError] = useState(false);

  const [restoreInput, setRestoreInput] = useState("");
  const [restoreResult, setRestoreResult] = useState<RestoreResult | null>(
    null,
  );
  const [restoreProgress, setRestoreProgress] = useState<string | null>(null);
  const [consolidateTarget, setConsolidateTarget] = useState<string | null>(
    null,
  );

  const [tokenInput, setTokenInput] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendMemo, setSendMemo] = useState("");
  const [zapNpub, setZapNpub] = useState("");
  const [zapAmount, setZapAmount] = useState("");
  const [zapNote, setZapNote] = useState("");
  const [mintUrlInput, setMintUrlInput] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  // Which mint the Lightning sheets act on. Both deposit and withdraw work
  // against a single mint at a time, since ecash cannot be pooled across them.
  const [activeMint, setActiveMint] = useState<string | null>(null);
  const [withdrawInvoice, setWithdrawInvoice] = useState("");
  const [withdrawQuote, setWithdrawQuote] = useState<MeltQuote | null>(null);

  // The token produced by the most recent send, still reserved and reclaimable.
  const [pending, setPending] = useState<PreparedSend | null>(null);
  const [deposit, setDeposit] = useState<LightningDeposit | null>(null);

  // One busy flag per long-running action, so a spinner sits on the button that
  // caused it instead of blocking the whole screen.
  const [busy, setBusy] = useState<string | null>(null);
  const [refreshingMint, setRefreshingMint] = useState<string | null>(null);

  const networkBlocked = isMintNetworkBlocked();

  // ---- Header action handoff ----
  const prevActionTrigger = useRef(actionTrigger ?? 0);
  useEffect(() => {
    if (
      actionTrigger === undefined ||
      actionTrigger <= prevActionTrigger.current
    ) {
      return;
    }
    prevActionTrigger.current = actionTrigger;
    // Imperative one-shot handoff from a header button press, guarded above so
    // it fires at most once per press.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (action === "receive") setShowReceive(true);
    else if (action === "send") setShowSend(true);
    else if (action === "zap") setShowZap(true);
    else if (action === "addMint") setShowAddMint(true);
  }, [action, actionTrigger]);

  // ---- Derived balances ----

  // Units are separate currencies and are never summed. Sats lead because it is
  // the only unit Airhop mints into; anything else appears as its own row.
  const unitTotals = useMemo(() => {
    const totals = new Map<
      string,
      { balance: number; unverified: number; reserved: number }
    >();
    for (const account of accounts) {
      const current = totals.get(account.unit) ?? {
        balance: 0,
        unverified: 0,
        reserved: 0,
      };
      current.balance += account.balance;
      current.unverified += account.unverified;
      current.reserved += account.reserved;
      totals.set(account.unit, current);
    }
    return [...totals.entries()]
      .map(([unit, v]) => ({ unit, ...v }))
      .sort((a, b) => (a.unit === "sat" ? -1 : b.unit === "sat" ? 1 : 0));
  }, [accounts]);

  const primary = unitTotals.find((u) => u.unit === "sat") ??
    unitTotals[0] ?? { unit: "sat", balance: 0, unverified: 0, reserved: 0 };

  // Sends whose proofs are still held: the token exists, delivery is unproven.
  // Anything still owed to somebody and still holding a token the user can
  // hand over.
  //
  // Two shapes end up here. A normal send has its proofs reserved and can be
  // reclaimed. A nutzap whose relay publish failed has no reservation, because
  // its proofs are already locked to the recipient's key and are not ours to
  // take back, but it still carries a token that needs delivering. Leaving that
  // second case out would strand the value with no way to reach it.
  const pendingSends = useMemo(
    () =>
      history.filter(
        (tx) =>
          tx.status === "pending" &&
          (tx.kind === "send" || tx.kind === "nutzap-out") &&
          (reserved[tx.id] !== undefined || Boolean(tx.token)),
      ),
    [history, reserved],
  );

  const pendingDeposits = useMemo(
    () => history.filter((tx) => tx.kind === "mint" && tx.status === "pending"),
    [history],
  );

  const recent = useMemo(() => history.slice(0, 12), [history]);

  const mintList = useMemo(() => Object.values(mints), [mints]);

  // How much of the primary unit the recovery phrase could actually rebuild.
  // Coins received from other people carry their secrets, so they sit outside
  // the phrase until a swap re-issues them under ours.
  const coverage = useMemo(() => {
    const forUnit = accounts.filter((a) => a.unit === primary.unit);
    const unbacked = forUnit.reduce((sum, a) => sum + a.unbacked, 0);
    const total = forUnit.reduce((sum, a) => sum + a.balance, 0);
    return { covered: total - unbacked, unbacked };
  }, [accounts, primary.unit]);

  // Mints holding spendable value in the primary unit. Two or more means the
  // balance cannot pay any amount larger than the biggest single mint holds.
  const splitAccounts = useMemo(
    () => accounts.filter((a) => a.unit === primary.unit && a.balance > 0),
    [accounts, primary.unit],
  );

  // ---- Error surface ----

  // One place that turns a WalletError into something a person can act on. The
  // service already carries the "why" in `detail`; this only decides the title
  // and whether there is a follow-up action worth offering.
  const reportError = useCallback((err: unknown, fallbackTitle: string) => {
    if (err instanceof WalletError) {
      const titles: Record<string, string> = {
        locked: "Wallet locked",
        offline: "Mint unreachable",
        "tor-blocked": "Blocked while Tor is on",
        insufficient: "Not enough balance",
        inexact: "Can't send that exact amount",
        "no-mint": "No mint",
        unsupported: "Mint can't do that",
        "mint-error": "Mint refused",
        "invalid-token": "Unreadable token",
        "forged-token": "Token rejected",
        "already-spent": "Already spent",
      };
      showAlert(
        titles[err.code] ?? fallbackTitle,
        err.detail ? `${err.message}\n\n${err.detail}` : err.message,
      );
      return;
    }
    showAlert(fallbackTitle, String(err));
  }, []);

  // ---- Receive ----

  async function handleReceive(): Promise<void> {
    const raw = tokenInput.trim();
    if (!raw) return;
    setBusy("receive");
    try {
      const result = await receiveToken(raw);
      setShowReceive(false);
      setTokenInput("");

      if (result.outcome === "duplicate") {
        showAlert(
          "Already in your wallet",
          "Every proof in this token is already stored here, so nothing was added. Balances are unchanged.",
        );
        return;
      }
      const where = hostOf(result.mintUrl);
      if (result.outcome === "swapped") {
        showAlert(
          `+${result.amount.toLocaleString()} ${result.unit}`,
          `Redeemed at ${where}. These proofs are now yours alone: the sender's copy no longer works.` +
            (result.memo ? `\n\n"${result.memo}"` : ""),
        );
      } else {
        showAlert(
          `+${result.amount.toLocaleString()} ${result.unit}`,
          `Stored from ${where}, but not yet confirmed with the mint (${result.offlineReason ?? "offline"}).` +
            (result.dleq === "valid"
              ? " The mint's signature checks out, so the token is genuine."
              : " The mint's keys are not cached here, so the signature could not be checked offline.") +
            " Until you refresh online, the sender could in principle have spent it elsewhere." +
            (result.memo ? `\n\n"${result.memo}"` : ""),
        );
      }
    } catch (err) {
      reportError(err, "Could not receive");
    } finally {
      setBusy(null);
    }
  }

  // ---- Send ----

  async function handleSend(): Promise<void> {
    const amount = Number.parseInt(sendAmount, 10);
    if (!amount || amount <= 0) return;
    setBusy("send");
    try {
      // Quote first so an inexact amount is explained before anything is
      // reserved, rather than after the proofs have already moved.
      const quote = await quoteSend({ amount, unit: primary.unit });
      const commit = async (allowInexact: boolean): Promise<void> => {
        const prepared = await prepareSend({
          amount,
          unit: primary.unit,
          memo: sendMemo.trim() || undefined,
          allowInexact,
        });
        setShowSend(false);
        setSendAmount("");
        setSendMemo("");
        setPending(prepared);
      };

      if (!quote.exact) {
        showAlert(
          "Can't send that exact amount",
          `Your proofs can't make exactly ${amount.toLocaleString()} ${quote.unit} offline. The smallest token you can build is ${quote.spend.toLocaleString()} ${quote.unit}, and offline there is no change: the extra ${(quote.spend - amount).toLocaleString()} ${quote.unit} goes to the recipient.\n\nRefreshing at the mint while online would split your proofs into denominations that make this exact.`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: `Send ${quote.spend.toLocaleString()}`,
              style: "destructive",
              onPress: () => void commit(true),
            },
          ],
        );
        return;
      }
      await commit(false);
    } catch (err) {
      reportError(err, "Could not build the token");
    } finally {
      setBusy(null);
    }
  }

  // The user confirmed the token reached its destination. Drops the reservation.
  function markDelivered(txId: string): void {
    confirmSend(txId);
    setPending(null);
    setShowPeerPicker(false);
  }

  // The transfer never landed. Puts the proofs back into the balance.
  function handleReclaim(tx: WalletTx | PreparedSend): void {
    // WalletTx keys the transaction as `id`, PreparedSend as `txId`; they are
    // the same value, and both carry amount and unit.
    const txId = "txId" in tx ? tx.txId : tx.id;
    showAlert(
      "Reclaim this token?",
      `The ${tx.amount.toLocaleString()} ${tx.unit} goes back into your balance. Only do this if the token never reached anyone: if they already have the string, whoever redeems it at the mint first keeps the money, and that could be them.`,
      [
        { text: "Keep pending", style: "cancel" },
        {
          text: "Reclaim",
          style: "destructive",
          onPress: () => {
            reclaimSend(txId);
            setPending(null);
          },
        },
      ],
    );
  }

  function handleShareToken(token: string): void {
    void Share.share({ message: token });
  }

  async function handleCopyToken(token: string): Promise<void> {
    await Clipboard.setStringAsync(token);
    showAlert(
      "Copied",
      "The token is on your clipboard. It stays reserved here until you mark it delivered, so you can paste it again if the first attempt fails.",
    );
  }

  // Copying a seed phrase is a real risk: clipboards are readable by other apps
  // and sync across devices on some setups. But refusing to offer it just
  // pushes people to screenshot instead, which is worse and permanent. Offer
  // it, and say plainly why it needs cleaning up afterwards.
  async function handleCopyPhrase(): Promise<void> {
    await Clipboard.setStringAsync(phrase);
    showAlert(
      "Copied",
      "Paste it into a password manager, then clear your clipboard. Other apps can read the clipboard, and on some setups it syncs to your other devices.",
    );
  }

  // Hands the token the user already built to a nearby peer. Uses the shared
  // delivery helper rather than posting the DM here, so the message id, the
  // delivery status and the pending transaction line up exactly as they do
  // when the send starts from a chat or the Mesh tab.
  function handleSendTokenToPeer(peerID: string): void {
    if (!pending) return;
    if (!getMeshService()) {
      showAlert(
        "Mesh offline",
        "The mesh service is not running, so there is nothing to hand the token to. It stays reserved under Pending.",
      );
      return;
    }
    const route = deliverTokenToPeer({ peerID, prepared: pending });
    const amount = pending.amount;
    const unit = pending.unit;
    // Handed off, not proven delivered. The transaction stays pending so it can
    // still be reclaimed if it never lands.
    setShowPeerPicker(false);
    setPending(null);
    showAlert(
      `${amount.toLocaleString()} ${unit} sent to ${peerIDToUsername(peerID)}`,
      `${describeRoute(route)} It stays reclaimable under Pending until you confirm they got it, or until the mint tells us the proofs were redeemed.`,
    );
  }

  // ---- Zap ----

  async function handleZap(): Promise<void> {
    const npubRaw = zapNpub.trim();
    const amount = Number.parseInt(zapAmount, 10);
    if (!npubRaw || !amount || amount <= 0) return;

    let recipientPubkey: string;
    try {
      if (npubRaw.startsWith("npub")) {
        const decoded = nip19.decode(npubRaw);
        if (decoded.type !== "npub") throw new Error("not an npub");
        recipientPubkey = decoded.data;
      } else if (/^[0-9a-f]{64}$/i.test(npubRaw)) {
        recipientPubkey = npubRaw.toLowerCase();
      } else {
        throw new Error("bad key");
      }
    } catch {
      showAlert(
        "Invalid pubkey",
        "Enter an npub1… or a 64-character hex Nostr pubkey.",
      );
      return;
    }

    setBusy("zap");
    setShowZap(false);
    try {
      const service = getMeshService();
      const result = await sendNutzap({
        recipientPubkey,
        amount,
        comment: zapNote.trim() || undefined,
        client: service?.getNostrClient() ?? null,
        senderPrivKey: service?.getNostrPrivKey() ?? null,
        unit: primary.unit,
      });
      setZapNpub("");
      setZapAmount("");
      setZapNote("");

      if (result.method === "nutzap") {
        showAlert(
          "Nutzap sent",
          `${result.amount.toLocaleString()} ${result.unit} locked to their key and published. Only they can redeem it.`,
        );
      } else if (result.method === "dm") {
        showAlert(
          "Sent as an encrypted token",
          `${result.amount.toLocaleString()} ${result.unit} sent in a Nostr DM, because ${result.fallbackReason}.\n\nThis is a bearer token: once they decrypt the message, whoever holds that string can redeem it.`,
        );
      } else {
        setPending({
          txId: result.txId,
          token: result.token ?? "",
          amount: result.amount,
          spend: result.amount,
          fee: 0,
          exact: true,
          unit: result.unit,
          mintUrl: result.mintUrl,
          proofs: [],
        });
        showAlert(
          "Couldn't reach the network",
          `${result.fallbackReason}. A token was built instead: share it however you like, or reclaim it under Pending.`,
        );
      }
    } catch (err) {
      reportError(err, "Zap failed");
    } finally {
      setBusy(null);
    }
  }

  // ---- Mints ----

  async function handleAddMint(): Promise<void> {
    const raw = mintUrlInput.trim();
    if (!raw) return;
    setBusy("addMint");
    try {
      const { mint, units } = await addMintService(raw);
      setShowAddMint(false);
      setMintUrlInput("");
      showAlert(
        mint.name ? `Added ${mint.name}` : "Mint added",
        `${hostOf(mint.url)} issues ${units.join(", ")}. Its keys are cached on this device, so tokens from it can now be verified even with no internet.`,
      );
    } catch (err) {
      reportError(err, "Could not add mint");
    } finally {
      setBusy(null);
    }
  }

  async function handleRefreshMint(
    mintUrl: string,
    unit: string,
  ): Promise<void> {
    setRefreshingMint(mintUrl);
    try {
      const result = await refreshAccount(mintUrl, unit);
      const parts: string[] = [];
      if (result.swapped > 0) {
        parts.push(
          `${result.swapped.toLocaleString()} ${unit} confirmed and swapped for fresh proofs.`,
        );
      }
      if (result.spentRemoved > 0) {
        parts.push(
          `${result.spentRemoved} proof${result.spentRemoved === 1 ? " was" : "s were"} already spent and ${result.spentRemoved === 1 ? "has" : "have"} been removed.`,
        );
      }
      // Worth naming separately: this value was never in doubt, it was just
      // outside the recovery phrase until the swap re-issued it.
      if (result.securedForBackup > 0) {
        parts.push(
          `${result.securedForBackup.toLocaleString()} ${unit} is now covered by your recovery phrase.`,
        );
      }
      showAlert(
        "Refreshed",
        parts.length > 0
          ? parts.join("\n\n")
          : "Everything here was already confirmed with the mint.",
      );
    } catch (err) {
      reportError(err, "Refresh failed");
    } finally {
      setRefreshingMint(null);
    }
  }

  function handleRemoveMint(account: AccountBalance): void {
    const hasValue = account.balance > 0 || account.reserved > 0;
    showAlert(
      hasValue ? "Remove mint with a balance?" : "Remove mint",
      hasValue
        ? `${hostOf(account.mintUrl)} holds ${account.balance.toLocaleString()} ${account.unit} in ${account.proofCount} proof${account.proofCount === 1 ? "" : "s"}. Removing it deletes those proofs from this device permanently and there is no backup. Withdraw or send the balance first.`
        : `Remove ${hostOf(account.mintUrl)} from your wallet? Its cached keys go too, so tokens from it can no longer be verified offline.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: hasValue ? "Delete anyway" : "Remove",
          style: "destructive",
          onPress: () => useWalletStore.getState().removeMint(account.mintUrl),
        },
      ],
    );
  }

  // ---- Backup ----

  // Step 1 of setup. Deliberately starts on a warning rather than on the words:
  // showing twelve words with no context invites a screenshot, and a screenshot
  // in a photo library is the most common way seed phrases get stolen.
  function handleStartBackup(): void {
    setBackupStep("warn");
  }

  // Step 2. Generates (or re-reads) the phrase and switches new proofs over to
  // deterministic secrets straight away, so anything minted from here on is
  // covered even if the user abandons the verification step.
  async function handleRevealPhrase(): Promise<void> {
    setBusy("backup");
    try {
      const setup = await enableWalletBackup();
      setPhrase(setup.phrase);
      setVerifyPositionList(pickVerificationPositions());
      setVerifyAnswers({});
      setVerifyError(false);
      setBackupStep("show");
    } catch (err) {
      reportError(err, "Could not set up backup");
      setBackupStep(null);
    } finally {
      setBusy(null);
    }
  }

  // Step 3. Two words, chosen at random each time, so passing once does not
  // teach anyone how to pass again.
  function handleVerifyPhrase(): void {
    if (verifyPositions(phrase, verifyAnswers)) {
      markBackupVerified();
      closeBackupSheet();
      showAlert(
        "Backup on",
        `Your balance can now be rebuilt from those twelve words.\n\nAnything you were given by someone else stays outside the phrase until you refresh at the mint, and recovery needs your mint list, so keep it written down beside the words.`,
      );
      return;
    }
    setVerifyError(true);
  }

  async function handleViewPhrase(): Promise<void> {
    setBusy("backup");
    try {
      const stored = await getRecoveryPhrase();
      if (stored === null) {
        showAlert(
          "No phrase stored",
          "The recovery phrase could not be read from the device keychain. Unlock the device and try again.",
        );
        return;
      }
      setPhrase(stored);
      // Someone who set the phrase up but never confirmed a written copy gets
      // the full write-it-down flow again rather than a read-only view, so the
      // unconfirmed state has an obvious way out.
      if (backupVerified) {
        setBackupStep("view");
      } else {
        setVerifyPositionList(pickVerificationPositions());
        setVerifyAnswers({});
        setVerifyError(false);
        setBackupStep("show");
      }
    } finally {
      setBusy(null);
    }
  }

  // Wraps the callback-based alert so the restore flow reads as a straight
  // line. Backdrop dismissal counts as cancel, which is why this watches the
  // store's visibility rather than relying on a button firing.
  function confirmReplacePhrase(): Promise<boolean> {
    return new Promise((resolve) => {
      let settled = false;
      const finish = (value: boolean): void => {
        if (settled) return;
        settled = true;
        unsubscribe();
        resolve(value);
      };
      const unsubscribe = useAlertStore.subscribe((state) => {
        if (state.visible) return;
        setTimeout(() => finish(false), 0);
      });
      showAlert(
        "Replace your current phrase?",
        "You already have a recovery phrase. Restoring a different one replaces it. Coins already covered by the old phrase stay spendable on this device, but they stop being restorable, so make sure the old words are written down before you continue.",
        [
          { text: "Cancel", style: "cancel", onPress: () => finish(false) },
          {
            text: "Replace",
            style: "destructive",
            onPress: () => finish(true),
          },
        ],
      );
    });
  }

  function closeBackupSheet(): void {
    setBackupStep(null);
    // The phrase is the money. Do not leave it sitting in component state after
    // the sheet closes.
    setPhrase("");
    setVerifyAnswers({});
    setVerifyError(false);
  }

  async function handleRestore(): Promise<void> {
    const input = restoreInput.trim();
    // Restoring replaces the stored phrase. Coins already derived from the old
    // one stay spendable here, but they stop being restorable, so this is the
    // one place a wrong tap can quietly cost someone their backup.
    if (backupEnabled && !(await confirmReplacePhrase())) return;
    if (!isValidRecoveryPhrase(input)) {
      const unknown = unknownWordsIn(input);
      showAlert(
        "That phrase is not valid",
        unknown.length > 0
          ? `These are not BIP-39 words: ${unknown.slice(0, 4).join(", ")}. Check the spelling.`
          : "The phrase has a built-in checksum and this one does not pass. Check for a mistyped, missing or swapped word.",
      );
      return;
    }
    if (mintList.length === 0) {
      showAlert(
        "Add a mint first",
        "Recovery works by asking a mint which coins it signed for you, so it needs to know which mint to ask. Add the mints you were using, then restore.",
      );
      return;
    }

    setBusy("restore");
    setRestoreResult(null);
    try {
      const result = await restoreFromRecoveryPhrase({
        phrase: input,
        mintUrls: mintList.map((m) => m.url),
        unit: primary.unit,
        onProgress: (progress) =>
          setRestoreProgress(
            `${hostOf(progress.mintUrl)} · keyset ${String(progress.step)} of ${String(progress.total)}`,
          ),
      });
      setRestoreResult(result);
      setRestoreInput("");
    } catch (err) {
      reportError(err, "Restore failed");
    } finally {
      setBusy(null);
      setRestoreProgress(null);
    }
  }

  // ---- Consolidate ----

  async function handleConsolidate(): Promise<void> {
    const target = consolidateTarget;
    if (!target) return;
    const sources = splitAccounts.filter((a) => a.mintUrl !== target);
    if (sources.length === 0) return;

    setBusy("consolidate");
    let moved = 0;
    let fees = 0;
    const failures: string[] = [];
    try {
      for (const source of sources) {
        try {
          const result = await consolidateMints({
            fromMintUrl: source.mintUrl,
            toMintUrl: target,
            unit: primary.unit,
          });
          moved += result.received;
          fees += result.fee;
        } catch (err) {
          failures.push(
            `${hostOf(source.mintUrl)}: ${err instanceof WalletError ? err.message : String(err)}`,
          );
        }
      }
      setShowConsolidate(false);
      showAlert(
        moved > 0 ? "Moved" : "Nothing moved",
        [
          moved > 0
            ? `${moved.toLocaleString()} ${primary.unit} now sits at ${hostOf(target)}, after ${fees.toLocaleString()} ${primary.unit} in Lightning routing fees.`
            : null,
          failures.length > 0 ? failures.join("\n") : null,
        ]
          .filter(Boolean)
          .join("\n\n"),
      );
    } finally {
      setBusy(null);
    }
  }

  // ---- Lightning deposit ----

  async function handleCreateDeposit(): Promise<void> {
    const amount = Number.parseInt(depositAmount, 10);
    const mintUrl = activeMint ?? mintList[0]?.url;
    if (!amount || amount <= 0 || !mintUrl) return;
    setBusy("deposit");
    try {
      const created = await createLightningDeposit({
        amount,
        mintUrl,
        unit: "sat",
        description: "Airhop wallet top-up",
      });
      setDeposit(created);
      setDepositAmount("");
    } catch (err) {
      reportError(err, "Could not create the invoice");
    } finally {
      setBusy(null);
    }
  }

  // Poll the open deposit until the invoice is paid. Stops as soon as the sheet
  // closes; an unclaimed deposit is picked up by `reconcile` on next launch, so
  // nothing is lost by giving up here.
  useEffect(() => {
    if (!deposit || !showDeposit) return;
    let cancelled = false;
    // A mint round trip can outlast the poll interval. Without this guard two
    // claims race for the same quote, and the loser reports a spurious error on
    // a deposit that actually succeeded.
    let inFlight = false;
    const timer = setInterval(() => {
      if (inFlight) return;
      inFlight = true;
      void (async () => {
        try {
          const minted = await claimLightningDeposit(
            deposit.mintUrl,
            deposit.unit,
            deposit.quoteId,
          );
          if (cancelled || minted <= 0) return;
          setDeposit(null);
          setShowDeposit(false);
          showAlert(
            `+${minted.toLocaleString()} ${deposit.unit}`,
            `Invoice paid and ${minted.toLocaleString()} ${deposit.unit} issued by ${hostOf(deposit.mintUrl)}. This balance is confirmed: you can spend it offline right away.`,
          );
        } catch {
          // Still unpaid, or the mint blinked. Keep polling.
        } finally {
          inFlight = false;
        }
      })();
    }, DEPOSIT_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [deposit, showDeposit]);

  // ---- Lightning withdrawal ----

  async function handleQuoteWithdraw(): Promise<void> {
    const invoice = withdrawInvoice.trim();
    const mintUrl = activeMint ?? mintList[0]?.url;
    if (!invoice || !mintUrl) return;
    setBusy("withdrawQuote");
    try {
      setWithdrawQuote(
        await quoteLightningWithdrawal({ invoice, mintUrl, unit: "sat" }),
      );
    } catch (err) {
      reportError(err, "Could not price this invoice");
    } finally {
      setBusy(null);
    }
  }

  async function handlePayWithdraw(): Promise<void> {
    if (!withdrawQuote) return;
    setBusy("withdrawPay");
    try {
      const result = await payLightningInvoice(withdrawQuote);
      setShowWithdraw(false);
      setWithdrawQuote(null);
      setWithdrawInvoice("");
      showAlert(
        "Paid",
        `${result.paid.toLocaleString()} sats paid over Lightning. The mint charged ${result.fee.toLocaleString()} sats in routing fees` +
          (result.changeReturned > 0
            ? `, and returned ${result.changeReturned.toLocaleString()} sats of the reserve to your balance.`
            : "."),
      );
    } catch (err) {
      reportError(err, "Payment failed");
    } finally {
      setBusy(null);
    }
  }

  // ---- Render ----

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {locked && (
        <View style={[styles.banner, styles.bannerDanger]}>
          <Feather name="lock" size={16} color={Colors.danger} />
          <Text style={styles.bannerText}>
            Wallet storage is locked. Ecash proofs are kept in an encrypted file
            whose key lives in the device keychain, and it could not be opened.
            Unlock your device and reopen Airhop.
          </Text>
        </View>
      )}

      {networkBlocked && !locked && (
        <View style={[styles.banner, styles.bannerWarn]}>
          <Feather name="shield" size={16} color={Colors.textSecondary} />
          <Text style={styles.bannerText}>
            Tor is on, so mint requests are blocked: they would go out over the
            clear net and link your IP to your proofs. Sending and receiving
            over the mesh still works. Allow mint traffic under Settings,
            Security.
          </Text>
        </View>
      )}

      {/* Balance */}
      <View style={styles.section}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Spendable</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>
              {primary.balance.toLocaleString()}
            </Text>
            <Text style={styles.balanceUnit}>{primary.unit}</Text>
          </View>

          {/* Everything that is not plain spendable balance is stated
              explicitly rather than folded into the number above. */}
          {primary.unverified > 0 && (
            <View style={styles.balanceNote}>
              <Feather name="clock" size={12} color={Colors.textMuted} />
              <Text style={styles.balanceNoteText}>
                {primary.unverified.toLocaleString()} {primary.unit} not yet
                confirmed with the mint
              </Text>
            </View>
          )}
          {primary.reserved > 0 && (
            <View style={styles.balanceNote}>
              <Feather
                name="arrow-up-right"
                size={12}
                color={Colors.textMuted}
              />
              <Text style={styles.balanceNoteText}>
                {primary.reserved.toLocaleString()} {primary.unit} reserved for
                a send in flight
              </Text>
            </View>
          )}

          {unitTotals
            .filter((u) => u.unit !== primary.unit && u.balance > 0)
            .map((u) => (
              <Text key={u.unit} style={styles.balanceNoteText}>
                {u.balance.toLocaleString()} {u.unit} at a separate mint account
              </Text>
            ))}

          <Text style={styles.balanceSubtitle}>
            {mintList.length} mint{mintList.length === 1 ? "" : "s"}
            {" · "}
            {accounts.reduce((s, a) => s + a.proofCount, 0)} proofs
          </Text>
        </View>
      </View>

      {/* Pending sends: reserved proofs the user can still recover. */}
      {pendingSends.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending</Text>
          {pendingSends.map((tx) => {
            // Reclaim is only meaningful while the proofs are still ours. A
            // nutzap that failed to publish is already locked to the
            // recipient's key, so offering to pull it back would be a lie.
            const reclaimable = reserved[tx.id] !== undefined;
            return (
              <View key={tx.id} style={styles.pendingCard}>
                <View style={styles.pendingHeader}>
                  <Feather
                    name="clock"
                    size={15}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.pendingAmount}>
                    {tx.amount.toLocaleString()} {tx.unit}
                  </Text>
                  <Text style={styles.pendingTime}>
                    {relativeTime(tx.createdAtMs)}
                  </Text>
                </View>
                <Text style={styles.pendingBody}>
                  {reclaimable
                    ? "Built and reserved, delivery unconfirmed. The proofs are held out of your balance so they cannot be spent twice."
                    : "Already locked to the recipient's key, so only they can spend it. It just has not reached them yet. Share the token to finish."}
                  {tx.error ? `\n\n${tx.error}` : ""}
                </Text>
                <View style={styles.pendingActions}>
                  <Pressable
                    style={styles.pendingBtn}
                    onPress={() => void handleCopyToken(tx.token ?? "")}
                    accessibilityRole="button"
                    accessibilityLabel="Copy the token again"
                  >
                    <Text style={styles.pendingBtnText}>Copy</Text>
                  </Pressable>
                  <Pressable
                    style={styles.pendingBtn}
                    onPress={() => handleShareToken(tx.token ?? "")}
                    accessibilityRole="button"
                    accessibilityLabel="Share the token again"
                  >
                    <Text style={styles.pendingBtnText}>Share</Text>
                  </Pressable>
                  <Pressable
                    style={styles.pendingBtn}
                    onPress={() => markDelivered(tx.id)}
                    accessibilityRole="button"
                    accessibilityLabel="Mark this token as delivered"
                  >
                    <Text style={styles.pendingBtnText}>Delivered</Text>
                  </Pressable>
                  {reclaimable && (
                    <Pressable
                      style={[styles.pendingBtn, styles.pendingBtnDanger]}
                      onPress={() => handleReclaim(tx)}
                      accessibilityRole="button"
                      accessibilityLabel="Reclaim this token into your balance"
                    >
                      <Text style={styles.pendingBtnDangerText}>Reclaim</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Mint accounts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mints</Text>
        {accounts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No mint yet</Text>
            <Text style={styles.emptyBody}>
              A mint issues and redeems your ecash. Add one to deposit over
              Lightning, or just receive a token and its mint is added for you.
            </Text>
            {/* The header has an Add mint icon, but an empty screen should
                offer the next step rather than expect it to be found. */}
            <Pressable
              style={styles.emptyCta}
              onPress={() => setShowAddMint(true)}
              accessibilityRole="button"
              accessibilityLabel="Add a mint"
            >
              <Feather name="plus" size={15} color={Colors.accent} />
              <Text style={styles.emptyCtaText}>Add a mint</Text>
            </Pressable>
          </View>
        ) : (
          accounts.map((account) => {
            const record = mints[account.mintUrl];
            return (
              <Pressable
                key={account.key}
                style={styles.mintRow}
                onLongPress={() => handleRemoveMint(account)}
                accessibilityRole="button"
                accessibilityLabel={`${hostOf(account.mintUrl)}, ${account.balance.toLocaleString()} ${account.unit}. Long press to remove.`}
              >
                <View style={styles.mintLeft}>
                  <View style={styles.mintIconCircle}>
                    <Feather
                      name="database"
                      size={16}
                      color={Colors.textSecondary}
                    />
                  </View>
                  <View style={styles.mintInfo}>
                    <Text style={styles.mintName} numberOfLines={1}>
                      {record?.name ?? hostOf(account.mintUrl)}
                    </Text>
                    <Text style={styles.mintMeta}>
                      {account.proofCount} proof
                      {account.proofCount === 1 ? "" : "s"}
                      {account.unverified > 0
                        ? ` · ${account.unverified.toLocaleString()} unconfirmed`
                        : ""}
                    </Text>
                  </View>
                </View>
                <View style={styles.mintRight}>
                  <Text style={styles.mintBalance}>
                    {account.balance.toLocaleString()}
                  </Text>
                  <Text style={styles.mintUnit}>{account.unit}</Text>
                  <Pressable
                    style={[
                      styles.smallBtn,
                      networkBlocked && styles.smallBtnDisabled,
                    ]}
                    disabled={networkBlocked || refreshingMint !== null}
                    onPress={() =>
                      void handleRefreshMint(account.mintUrl, account.unit)
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Confirm proofs with ${hostOf(account.mintUrl)}`}
                  >
                    {refreshingMint === account.mintUrl ? (
                      <ActivityIndicator
                        size="small"
                        color={Colors.textSecondary}
                      />
                    ) : (
                      <Text style={styles.smallBtnText}>Refresh</Text>
                    )}
                  </Pressable>
                </View>
              </Pressable>
            );
          })
        )}

        {/* Ecash from two mints can never become one token, so a split balance
            is a real wall. Moving it is possible over Lightning, and this is
            the only place that says so. */}
        {splitAccounts.length > 1 && (
          <Pressable
            style={[
              styles.inlineAction,
              networkBlocked && styles.smallBtnDisabled,
            ]}
            disabled={networkBlocked}
            onPress={() => {
              setConsolidateTarget(splitAccounts[0].mintUrl);
              setShowConsolidate(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Move all balances to one mint"
          >
            <Feather name="git-merge" size={15} color={Colors.accent} />
            <Text style={styles.inlineActionText}>
              Balance split across {splitAccounts.length} mints. Move it to one
            </Text>
          </Pressable>
        )}
      </View>

      {/* Lightning: the only way value enters or leaves without a token. */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lightning</Text>
        <View style={styles.lightningCard}>
          <Text style={styles.lightningBody}>
            Turn Lightning sats into ecash you can spend offline, or cash ecash
            back out to any Lightning invoice. Both need internet and a mint.
          </Text>
          <View style={styles.lightningActions}>
            <Pressable
              style={[
                styles.lightningBtn,
                (networkBlocked || mintList.length === 0) &&
                  styles.smallBtnDisabled,
              ]}
              disabled={networkBlocked || mintList.length === 0}
              onPress={() => {
                setActiveMint(mintList[0]?.url ?? null);
                setDeposit(null);
                setShowDeposit(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="Deposit sats over Lightning"
            >
              <Feather name="download" size={16} color={Colors.accent} />
              <Text style={styles.lightningBtnText}>Deposit</Text>
            </Pressable>
            <Pressable
              style={[
                styles.lightningBtn,
                (networkBlocked || primary.balance === 0) &&
                  styles.smallBtnDisabled,
              ]}
              disabled={networkBlocked || primary.balance === 0}
              onPress={() => {
                setActiveMint(splitAccounts[0]?.mintUrl ?? null);
                setWithdrawQuote(null);
                setShowWithdraw(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="Withdraw to a Lightning invoice"
            >
              <Feather name="upload" size={16} color={Colors.accent} />
              <Text style={styles.lightningBtnText}>Withdraw</Text>
            </Pressable>
          </View>
          {pendingDeposits.length > 0 && (
            <Text style={styles.lightningPending}>
              {pendingDeposits.length} deposit
              {pendingDeposits.length === 1 ? "" : "s"} waiting on payment.
              Checked again each time the app opens.
            </Text>
          )}
        </View>
      </View>

      {/* Backup. Off by default, because turning it on is a commitment: the
          user has to write twelve words down and keep them, and a phrase
          nobody wrote down is worse than none at all (it implies a safety net
          that is not there). */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Backup</Text>
        <View style={styles.backupCard}>
          <View style={styles.backupHeader}>
            <Feather
              name={backupEnabled ? "shield" : "shield-off"}
              size={16}
              color={backupEnabled ? Colors.online : Colors.textMuted}
            />
            <Text style={styles.backupTitle}>Recovery phrase</Text>
            <View
              style={[
                styles.pill,
                backupEnabled && backupVerified && styles.pillOn,
                backupEnabled && !backupVerified && styles.pillWarn,
              ]}
              accessibilityLabel={
                backupEnabled
                  ? backupVerified
                    ? "Backup on"
                    : "Backup on but not confirmed"
                  : "Backup off"
              }
            >
              <Text
                style={[
                  styles.pillText,
                  backupEnabled && backupVerified && styles.pillTextOn,
                  backupEnabled && !backupVerified && styles.pillTextWarn,
                ]}
              >
                {backupEnabled
                  ? backupVerified
                    ? "On"
                    : "Unconfirmed"
                  : "Off"}
              </Text>
            </View>
          </View>

          {backupEnabled ? (
            <>
              <Text style={styles.backupBody}>
                {coverage.covered.toLocaleString()} {primary.unit} can be
                rebuilt on a new device from your twelve words.
              </Text>
              {/* A phrase that exists but was never copied out is the most
                  dangerous state of all: the card would otherwise read as
                  protected while the words live only on the phone that is
                  about to be lost. */}
              {!backupVerified && (
                <View style={styles.backupWarnRow}>
                  <Feather
                    name="alert-triangle"
                    size={13}
                    color={Colors.danger}
                  />
                  <Text style={styles.backupWarnText}>
                    You never confirmed a written copy. Right now the words
                    exist only on this phone, which is the one thing a backup is
                    supposed to survive. View the phrase and write it down.
                  </Text>
                </View>
              )}
              {coverage.unbacked > 0 && (
                <View style={styles.backupWarnRow}>
                  <Feather
                    name="alert-circle"
                    size={13}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.backupWarnText}>
                    {coverage.unbacked.toLocaleString()} {primary.unit} is not
                    covered yet. Coins you were given carry the secrets of
                    whoever sent them, so they only come under your phrase once
                    they are swapped. Refresh a mint to secure them.
                  </Text>
                </View>
              )}
              {mintList.length > 0 && (
                <Text style={styles.backupHint}>
                  Recovery has to ask a mint which coins it signed, so keep this
                  list with your words:{"\n"}
                  {mintList.map((m) => hostOf(m.url)).join("\n")}
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.backupBody}>
              Your ecash exists only on this phone. If you lose it, nobody can
              recover the money, including you. A recovery phrase is twelve
              words that can rebuild your balance anywhere.
            </Text>
          )}

          <View style={styles.backupActions}>
            <Pressable
              style={styles.backupBtn}
              onPress={() => {
                if (backupEnabled) void handleViewPhrase();
                else void handleStartBackup();
              }}
              accessibilityRole="button"
              accessibilityLabel={
                backupEnabled
                  ? "View recovery phrase"
                  : "Set up recovery phrase"
              }
            >
              <Feather
                name={backupEnabled ? "eye" : "key"}
                size={16}
                color={Colors.accent}
              />
              <Text style={styles.backupBtnText}>
                {backupEnabled ? "View phrase" : "Set up"}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.backupBtn,
                networkBlocked && styles.smallBtnDisabled,
              ]}
              disabled={networkBlocked}
              onPress={() => {
                setRestoreInput("");
                setRestoreResult(null);
                setShowRestore(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="Restore a wallet from a recovery phrase"
            >
              <Feather name="download-cloud" size={16} color={Colors.accent} />
              <Text style={styles.backupBtnText}>Restore</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Activity */}
      {recent.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.historyCard}>
            {recent.map((tx, index) => (
              <View key={tx.id}>
                {index > 0 && <View style={styles.historyDivider} />}
                <View style={styles.historyRow}>
                  <Feather
                    name={txIcon(tx)}
                    size={15}
                    color={
                      tx.status === "failed"
                        ? Colors.danger
                        : Colors.textSecondary
                    }
                    style={styles.historyIcon}
                  />
                  <View style={styles.historyText}>
                    <Text style={styles.historyTitle}>{txTitle(tx)}</Text>
                    <Text style={styles.historySub}>
                      {relativeTime(tx.createdAtMs)}
                      {" · "}
                      {hostOf(tx.mintUrl)}
                      {tx.status !== "completed" ? ` · ${tx.status}` : ""}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.historyAmount,
                      isCredit(tx) ? styles.historyCredit : undefined,
                    ]}
                  >
                    {isCredit(tx) ? "+" : "−"}
                    {tx.amount.toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* What each header action does, and whether it needs internet. */}
      <View style={styles.section}>
        <View style={styles.infoPanel}>
          {[
            {
              icon: "help-circle" as const,
              title: "What is Cashu?",
              body: "Cashu is ecash for Bitcoin. A token is a string that is worth money to whoever holds it, signed blindly by a mint so the mint cannot tell who spent what. No accounts, no logins.",
            },
            {
              icon: "arrow-up" as const,
              title: "Send",
              body: "Turns an amount into a token you can hand to a nearby peer over Bluetooth, or share as text. Works with no internet. The proofs stay reserved until you confirm it landed.",
            },
            {
              icon: "arrow-down" as const,
              title: "Receive",
              body: "Paste a token to add it. Online it is swapped at the mint immediately, which makes it provably yours. Offline it is stored and marked unconfirmed until you refresh.",
            },
            {
              icon: "zap" as const,
              title: "Zap",
              body: "Pays a Nostr identity. If they publish NIP-61 nutzap info, the ecash is locked to their key so only they can spend it. Otherwise it falls back to an encrypted DM. Needs internet.",
            },
            {
              icon: "plus" as const,
              title: "Add mint",
              body: "Saves the mint that issues and redeems your ecash, and caches its public keys so tokens from it can be verified offline. Choose a mint you would trust with the balance you keep there.",
            },
            {
              icon: "shield" as const,
              title: "Recovery phrase",
              body: "Off by default. Turn it on and your coins are derived from twelve words instead of random numbers, so a new phone can rebuild the balance by asking your mints which coins they signed. Without it, losing the phone loses the money.",
            },
          ].map((row, index) => (
            <View key={row.title}>
              {index > 0 && <View style={styles.infoPanelDivider} />}
              <View style={styles.infoPanelRow}>
                <Feather
                  name={row.icon}
                  size={16}
                  color={Colors.textMuted}
                  style={styles.infoPanelIcon}
                />
                <View style={styles.infoPanelText}>
                  <Text style={styles.infoPanelTitle}>{row.title}</Text>
                  <Text style={styles.infoPanelBody}>{row.body}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ---- Sheets ---- */}

      <BottomSheet
        visible={showReceive}
        onClose={() => setShowReceive(false)}
        sheetStyle={styles.modalSheet}
      >
        <Text style={styles.modalTitle}>Receive ecash</Text>
        <Text style={styles.modalSubtitle}>
          Paste a Cashu token. Online it is redeemed at the mint straight away;
          offline it is stored and confirmed the next time you refresh.
        </Text>
        <TextInput
          style={styles.tokenInput}
          value={tokenInput}
          onChangeText={setTokenInput}
          placeholder="cashuB..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={3}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={Colors.accent}
        />
        <SheetActions
          styles={styles}
          confirmLabel={busy === "receive" ? "Receiving…" : "Receive"}
          confirmDisabled={!tokenInput.trim() || busy !== null || locked}
          onConfirm={() => void handleReceive()}
          onCancel={() => setShowReceive(false)}
        />
      </BottomSheet>

      <BottomSheet
        visible={showSend}
        onClose={() => setShowSend(false)}
        sheetStyle={styles.modalSheet}
      >
        <Text style={styles.modalTitle}>Send ecash</Text>
        <Text style={styles.modalSubtitle}>
          Built offline from proofs you already hold. Nothing leaves your
          balance for good until you confirm the token was delivered.
        </Text>
        <TextInput
          style={styles.tokenInput}
          value={sendAmount}
          onChangeText={setSendAmount}
          placeholder={`Amount in ${primary.unit}`}
          placeholderTextColor={Colors.textMuted}
          keyboardType="number-pad"
          returnKeyType="next"
          selectionColor={Colors.accent}
        />
        <TextInput
          style={[styles.tokenInput, styles.tokenInputCompact]}
          value={sendMemo}
          onChangeText={setSendMemo}
          placeholder="Memo (optional, travels with the token)"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="sentences"
          selectionColor={Colors.accent}
        />
        <SheetActions
          styles={styles}
          confirmLabel={busy === "send" ? "Building…" : "Build token"}
          confirmDisabled={!sendAmount.trim() || busy !== null || locked}
          onConfirm={() => void handleSend()}
          onCancel={() => {
            setShowSend(false);
            setSendAmount("");
            setSendMemo("");
          }}
        />
      </BottomSheet>

      <BottomSheet
        visible={showZap}
        onClose={() => setShowZap(false)}
        sheetStyle={styles.modalSheet}
      >
        <Text style={styles.modalTitle}>Zap a Nostr identity</Text>
        <Text style={styles.modalSubtitle}>
          If they publish NIP-61 nutzap info, the ecash is locked to their key
          so nobody else can spend it. If not, it goes as an encrypted DM
          instead and you will be told which happened.
        </Text>
        <TextInput
          style={styles.tokenInput}
          value={zapNpub}
          onChangeText={setZapNpub}
          placeholder="npub1… or 64-char hex"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={Colors.accent}
        />
        <TextInput
          style={[styles.tokenInput, styles.tokenInputCompact]}
          value={zapAmount}
          onChangeText={setZapAmount}
          placeholder={`Amount in ${primary.unit}`}
          placeholderTextColor={Colors.textMuted}
          keyboardType="number-pad"
          selectionColor={Colors.accent}
        />
        <TextInput
          style={[styles.tokenInput, styles.tokenInputCompact]}
          value={zapNote}
          onChangeText={setZapNote}
          placeholder="Note (optional, public)"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="sentences"
          selectionColor={Colors.accent}
        />
        <SheetActions
          styles={styles}
          confirmLabel={busy === "zap" ? "Sending…" : "Zap"}
          confirmDisabled={
            !zapNpub.trim() || !zapAmount.trim() || busy !== null || locked
          }
          onConfirm={() => void handleZap()}
          onCancel={() => {
            setShowZap(false);
            setZapNpub("");
            setZapAmount("");
            setZapNote("");
          }}
        />
      </BottomSheet>

      <BottomSheet
        visible={showAddMint}
        onClose={() => setShowAddMint(false)}
        sheetStyle={styles.modalSheet}
      >
        <Text style={styles.modalTitle}>Add mint</Text>
        <Text style={styles.modalSubtitle}>
          A mint holds the Bitcoin backing your ecash, so pick one you would
          trust with the balance you keep there. The URL is checked before it is
          saved. Run your own with Nutshell if you would rather not trust
          anyone.
        </Text>
        <TextInput
          style={styles.tokenInput}
          value={mintUrlInput}
          onChangeText={setMintUrlInput}
          placeholder="https://mint.example.com"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="done"
          selectionColor={Colors.accent}
        />
        <SheetActions
          styles={styles}
          confirmLabel={busy === "addMint" ? "Checking…" : "Add"}
          confirmDisabled={!mintUrlInput.trim() || busy !== null || locked}
          onConfirm={() => void handleAddMint()}
          onCancel={() => {
            setShowAddMint(false);
            setMintUrlInput("");
          }}
        />
      </BottomSheet>

      {/* Generated token: the send has reserved proofs but not spent them. */}
      <BottomSheet
        visible={pending !== null}
        onClose={() => setPending(null)}
        sheetStyle={styles.modalSheet}
      >
        <View style={styles.generatedHeader}>
          <Feather name="check-circle" size={28} color={Colors.online} />
          <View style={styles.generatedAmountRow}>
            <Text style={styles.generatedAmount}>
              {pending?.amount.toLocaleString()}
            </Text>
            <Text style={styles.generatedUnit}>{pending?.unit}</Text>
          </View>
          <Text style={styles.generatedMint} numberOfLines={1}>
            {pending ? hostOf(pending.mintUrl) : ""}
          </Text>
          {pending && pending.fee > 0 && (
            <Text style={styles.generatedMint}>
              {pending.spend.toLocaleString()} {pending.unit} leaves your
              balance; the extra {pending.fee.toLocaleString()} covers the mint
              fee they would otherwise pay
            </Text>
          )}
        </View>
        <TextInput
          style={[styles.tokenInput, styles.tokenInputMono]}
          value={pending?.token ?? ""}
          editable={false}
          multiline
          numberOfLines={3}
          selectionColor={Colors.accent}
        />
        <Text style={styles.generatedHint}>
          Whoever holds this string owns the money. The proofs are reserved, not
          spent: if it never reaches anyone you can reclaim them under Pending.
        </Text>
        <View style={styles.generatedActions}>
          <Pressable
            style={styles.generatedActionBtn}
            onPress={() => pending && void handleCopyToken(pending.token)}
            accessibilityRole="button"
            accessibilityLabel="Copy token"
          >
            <Feather name="copy" size={18} color={Colors.accent} />
            <Text style={styles.generatedActionText}>Copy</Text>
          </Pressable>
          <Pressable
            style={styles.generatedActionBtn}
            onPress={() => pending && handleShareToken(pending.token)}
            accessibilityRole="button"
            accessibilityLabel="Share token"
          >
            <Feather name="share" size={18} color={Colors.accent} />
            <Text style={styles.generatedActionText}>Share</Text>
          </Pressable>
          <Pressable
            style={styles.generatedActionBtn}
            onPress={() => setShowPeerPicker(true)}
            accessibilityRole="button"
            accessibilityLabel="Send token to a nearby peer"
          >
            <Feather name="radio" size={18} color={Colors.accent} />
            <Text style={styles.generatedActionText}>Send to peer</Text>
          </Pressable>
        </View>
        <View style={styles.modalActions}>
          <Pressable
            style={styles.modalConfirm}
            onPress={() => pending && markDelivered(pending.txId)}
            accessibilityRole="button"
            accessibilityLabel="Mark delivered and finish"
          >
            <Text style={styles.modalConfirmText}>They got it</Text>
          </Pressable>
          <Pressable
            style={styles.modalCancel}
            onPress={() => setPending(null)}
            accessibilityRole="button"
            accessibilityLabel="Keep this send pending"
          >
            <Text style={styles.modalCancelText}>Decide later</Text>
          </Pressable>
        </View>
      </BottomSheet>

      {/* Lightning deposit */}
      <BottomSheet
        visible={showDeposit}
        onClose={() => {
          setShowDeposit(false);
          setDeposit(null);
        }}
        sheetStyle={styles.modalSheet}
      >
        <Text style={styles.modalTitle}>Deposit over Lightning</Text>
        {deposit === null ? (
          <>
            <Text style={styles.modalSubtitle}>
              The mint gives you an invoice. Pay it from any Lightning wallet
              and the sats come back as ecash you can spend offline.
            </Text>
            <TextInput
              style={styles.tokenInput}
              value={depositAmount}
              onChangeText={setDepositAmount}
              placeholder="Amount in sats"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              selectionColor={Colors.accent}
            />
            <MintPicker
              styles={styles}
              Colors={Colors}
              label="Issued by"
              options={mintList.map((m) => ({
                mintUrl: m.url,
                sub: m.name ?? hostOf(m.url),
              }))}
              selected={activeMint}
              onSelect={setActiveMint}
            />
            <SheetActions
              styles={styles}
              confirmLabel={busy === "deposit" ? "Requesting…" : "Get invoice"}
              confirmDisabled={!depositAmount.trim() || busy !== null}
              onConfirm={() => void handleCreateDeposit()}
              onCancel={() => setShowDeposit(false)}
            />
          </>
        ) : (
          <>
            <Text style={styles.modalSubtitle}>
              Pay this invoice for {deposit.amount.toLocaleString()}{" "}
              {deposit.unit}. The wallet is watching for the payment and will
              issue your ecash automatically.
            </Text>
            <TextInput
              style={[styles.tokenInput, styles.tokenInputMono]}
              value={deposit.invoice}
              editable={false}
              multiline
              numberOfLines={4}
              selectionColor={Colors.accent}
            />
            <View style={styles.generatedActions}>
              <Pressable
                style={styles.generatedActionBtn}
                onPress={() => void Clipboard.setStringAsync(deposit.invoice)}
                accessibilityRole="button"
                accessibilityLabel="Copy invoice"
              >
                <Feather name="copy" size={18} color={Colors.accent} />
                <Text style={styles.generatedActionText}>Copy invoice</Text>
              </Pressable>
              <Pressable
                style={styles.generatedActionBtn}
                onPress={() =>
                  void Share.share({ message: `lightning:${deposit.invoice}` })
                }
                accessibilityRole="button"
                accessibilityLabel="Open in a Lightning wallet"
              >
                <Feather name="external-link" size={18} color={Colors.accent} />
                <Text style={styles.generatedActionText}>Open in wallet</Text>
              </Pressable>
            </View>
            <View style={styles.waitingRow}>
              <ActivityIndicator size="small" color={Colors.textMuted} />
              <Text style={styles.waitingText}>Waiting for payment…</Text>
            </View>
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => setShowDeposit(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Text style={styles.modalCancelText}>Close</Text>
              </Pressable>
            </View>
          </>
        )}
      </BottomSheet>

      {/* Lightning withdrawal */}
      <BottomSheet
        visible={showWithdraw}
        onClose={() => {
          setShowWithdraw(false);
          setWithdrawQuote(null);
        }}
        sheetStyle={styles.modalSheet}
      >
        <Text style={styles.modalTitle}>Withdraw to Lightning</Text>
        <Text style={styles.modalSubtitle}>
          Paste a bolt11 invoice and the mint pays it from your ecash. You are
          quoted the routing reserve first; whatever routing does not use comes
          back to your balance.
        </Text>
        <TextInput
          style={[styles.tokenInput, styles.tokenInputMono]}
          value={withdrawInvoice}
          onChangeText={(text) => {
            setWithdrawInvoice(text);
            setWithdrawQuote(null);
          }}
          placeholder="lnbc..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={3}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={Colors.accent}
        />
        <MintPicker
          styles={styles}
          Colors={Colors}
          label="Paid from"
          options={splitAccounts.map((a) => ({
            mintUrl: a.mintUrl,
            sub: `${a.balance.toLocaleString()} ${a.unit} available`,
          }))}
          selected={activeMint}
          onSelect={(url) => {
            setActiveMint(url);
            // A quote is priced against one mint's fee schedule, so switching
            // mints invalidates it.
            setWithdrawQuote(null);
          }}
        />
        {withdrawQuote && (
          <View style={styles.quoteBox}>
            <QuoteRow
              styles={styles}
              label="Invoice"
              value={`${withdrawQuote.amount.toLocaleString()} ${withdrawQuote.unit}`}
            />
            <QuoteRow
              styles={styles}
              label="Routing reserve"
              value={`up to ${withdrawQuote.feeReserve.toLocaleString()} ${withdrawQuote.unit}`}
            />
            <QuoteRow
              styles={styles}
              label="Reserved from balance"
              value={`${withdrawQuote.total.toLocaleString()} ${withdrawQuote.unit}`}
            />
          </View>
        )}
        <SheetActions
          styles={styles}
          confirmLabel={
            withdrawQuote
              ? busy === "withdrawPay"
                ? "Paying…"
                : `Pay ${withdrawQuote.amount.toLocaleString()} ${withdrawQuote.unit}`
              : busy === "withdrawQuote"
                ? "Checking…"
                : "Get quote"
          }
          confirmDisabled={!withdrawInvoice.trim() || busy !== null}
          onConfirm={() =>
            void (withdrawQuote ? handlePayWithdraw() : handleQuoteWithdraw())
          }
          onCancel={() => {
            setShowWithdraw(false);
            setWithdrawQuote(null);
            setWithdrawInvoice("");
          }}
        />
      </BottomSheet>

      {/* Recovery phrase: warn -> show -> verify, or view when already set up */}
      <BottomSheet
        visible={backupStep !== null}
        onClose={closeBackupSheet}
        sheetStyle={styles.modalSheet}
        scrollable
      >
        {backupStep === "warn" && (
          <>
            <Text style={styles.modalTitle}>Set up a recovery phrase</Text>
            <Text style={styles.modalSubtitle}>
              You are about to see twelve words. They are the money.
            </Text>
            {[
              "Anyone who reads them can take your balance. Do not screenshot them and do not store them on this phone.",
              "Write them on paper and keep them somewhere safe. Airhop cannot show them to you again if the phone is gone.",
              "They rebuild your ecash only. Your identity, chats and contacts are not covered.",
              "Recovery has to ask a mint which coins it signed, so write your mint list down beside the words.",
            ].map((line) => (
              <View key={line} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{line}</Text>
              </View>
            ))}
            <SheetActions
              styles={styles}
              confirmLabel={busy === "backup" ? "Preparing…" : "Show my phrase"}
              confirmDisabled={busy !== null}
              onConfirm={() => void handleRevealPhrase()}
              onCancel={closeBackupSheet}
            />
          </>
        )}

        {(backupStep === "show" || backupStep === "view") && (
          <>
            <Text style={styles.modalTitle}>
              {backupStep === "view"
                ? "Your recovery phrase"
                : "Write these down"}
            </Text>
            <Text style={styles.modalSubtitle}>
              Twelve words, in this exact order. Anyone who has them has your
              balance.
            </Text>
            <View style={styles.phraseGrid}>
              {phrase.split(" ").map((word, index) => (
                <View
                  key={`${String(index)}-${word}`}
                  style={styles.phraseCell}
                >
                  <Text style={styles.phraseIndex}>{index + 1}</Text>
                  <Text style={styles.phraseWord}>{word}</Text>
                </View>
              ))}
            </View>
            <Pressable
              style={styles.generatedActionBtn}
              onPress={() => void handleCopyPhrase()}
              accessibilityRole="button"
              accessibilityLabel="Copy recovery phrase to the clipboard"
            >
              <Feather name="copy" size={18} color={Colors.accent} />
              <Text style={styles.generatedActionText}>Copy to clipboard</Text>
            </Pressable>
            {backupStep === "show" ? (
              <SheetActions
                styles={styles}
                confirmLabel="I have written them down"
                confirmDisabled={false}
                onConfirm={() => setBackupStep("verify")}
                onCancel={closeBackupSheet}
              />
            ) : (
              <Pressable style={styles.modalCancel} onPress={closeBackupSheet}>
                <Text style={styles.modalCancelText}>Done</Text>
              </Pressable>
            )}
          </>
        )}

        {backupStep === "verify" && (
          <>
            <Text style={styles.modalTitle}>Check your copy</Text>
            <Text style={styles.modalSubtitle}>
              A phrase nobody wrote down is worse than no phrase, because it
              looks like a safety net that is not there. Two words to confirm.
            </Text>
            {verifyPositionList.map((position) => (
              <View key={position} style={styles.verifyRow}>
                <Text style={styles.verifyLabel}>Word {position}</Text>
                <TextInput
                  style={[styles.tokenInput, styles.tokenInputCompact]}
                  value={verifyAnswers[position] ?? ""}
                  onChangeText={(text) => {
                    setVerifyAnswers((prev) => ({ ...prev, [position]: text }));
                    setVerifyError(false);
                  }}
                  placeholder="word"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  selectionColor={Colors.accent}
                />
              </View>
            ))}
            {verifyError && (
              <Text style={styles.verifyError}>
                That does not match. Check your written copy.
              </Text>
            )}
            <SheetActions
              styles={styles}
              confirmLabel="Confirm"
              confirmDisabled={
                verifyPositionList.some(
                  (p) => (verifyAnswers[p] ?? "").trim().length === 0,
                ) || busy !== null
              }
              onConfirm={handleVerifyPhrase}
              onCancel={() => setBackupStep("show")}
            />
          </>
        )}
      </BottomSheet>

      {/* Restore from a phrase */}
      <BottomSheet
        visible={showRestore}
        onClose={() => setShowRestore(false)}
        sheetStyle={styles.modalSheet}
        scrollable
      >
        <Text style={styles.modalTitle}>Restore from a phrase</Text>
        {restoreResult === null ? (
          <>
            <Text style={styles.modalSubtitle}>
              Enter the twelve words. Airhop re-derives your coins and asks each
              mint which of them it signed, so the balance comes back from the
              records the mint keeps.
            </Text>
            <TextInput
              style={styles.tokenInput}
              value={restoreInput}
              onChangeText={setRestoreInput}
              placeholder="twelve words, separated by spaces"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              selectionColor={Colors.accent}
            />
            <Text style={styles.modalSubtitle}>
              {mintList.length === 0
                ? "No mints added yet. Recovery has to ask a specific mint, so add the ones you were using first."
                : `Will scan: ${mintList.map((m) => hostOf(m.url)).join(", ")}. A mint you have not added is never asked, so its balance stays invisible.`}
            </Text>
            {restoreProgress !== null && (
              <View style={styles.waitingRow}>
                <ActivityIndicator size="small" color={Colors.textMuted} />
                <Text style={styles.waitingText}>{restoreProgress}</Text>
              </View>
            )}
            <SheetActions
              styles={styles}
              confirmLabel={busy === "restore" ? "Scanning…" : "Restore"}
              confirmDisabled={
                !restoreInput.trim() || busy !== null || mintList.length === 0
              }
              onConfirm={() => void handleRestore()}
              onCancel={() => setShowRestore(false)}
            />
          </>
        ) : (
          <>
            <View style={styles.generatedHeader}>
              <Feather
                name={restoreResult.proofCount > 0 ? "check-circle" : "info"}
                size={28}
                color={
                  restoreResult.proofCount > 0
                    ? Colors.online
                    : Colors.textMuted
                }
              />
              <View style={styles.generatedAmountRow}>
                <Text style={styles.generatedAmount}>
                  {(
                    restoreResult.recovered[primary.unit] ?? 0
                  ).toLocaleString()}
                </Text>
                <Text style={styles.generatedUnit}>{primary.unit}</Text>
              </View>
            </View>
            <Text style={styles.modalSubtitle}>
              {restoreResult.proofCount > 0
                ? `Recovered ${String(restoreResult.proofCount)} unspent proof${restoreResult.proofCount === 1 ? "" : "s"} from ${restoreResult.mintsScanned.map(hostOf).join(", ")}.`
                : "Nothing was recovered from the mints scanned."}
            </Text>
            {restoreResult.alreadySpent > 0 && (
              <Text style={styles.modalSubtitle}>
                {restoreResult.alreadySpent} coin
                {restoreResult.alreadySpent === 1 ? " was" : "s were"} found but
                already spent, so nothing was credited for them. That is normal:
                every coin you have ever spent still appears in the records the
                mint keeps.
              </Text>
            )}
            {restoreResult.mintsFailed.length > 0 && (
              <Text style={styles.modalSubtitle}>
                Could not reach:{" "}
                {restoreResult.mintsFailed
                  .map((f) => hostOf(f.mintUrl))
                  .join(", ")}
                . Any balance there is still out there. Try again when you have
                a better connection.
              </Text>
            )}
            <Pressable
              style={styles.modalCancel}
              onPress={() => {
                setShowRestore(false);
                setRestoreResult(null);
              }}
            >
              <Text style={styles.modalCancelText}>Done</Text>
            </Pressable>
          </>
        )}
      </BottomSheet>

      {/* Consolidate across mints */}
      <BottomSheet
        visible={showConsolidate}
        onClose={() => setShowConsolidate(false)}
        sheetStyle={styles.modalSheet}
        scrollable
      >
        <Text style={styles.modalTitle}>Move to one mint</Text>
        <Text style={styles.modalSubtitle}>
          A token can only ever name one mint, so a balance spread across
          several cannot pay an amount larger than the biggest one holds. Airhop
          can move it: each other mint pays a Lightning invoice issued by the
          one you pick. Costs a small routing fee and needs internet.
        </Text>
        {splitAccounts.map((account) => {
          const isTarget = account.mintUrl === consolidateTarget;
          return (
            <Pressable
              key={account.key}
              style={[styles.pickRow, isTarget && styles.pickRowSelected]}
              onPress={() => setConsolidateTarget(account.mintUrl)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isTarget }}
              accessibilityLabel={`Move everything to ${hostOf(account.mintUrl)}`}
            >
              <Feather
                name={isTarget ? "check-circle" : "circle"}
                size={18}
                color={isTarget ? Colors.accent : Colors.textMuted}
              />
              <View style={styles.pickInfo}>
                <Text style={styles.pickTitle}>{hostOf(account.mintUrl)}</Text>
                <Text style={styles.pickSub}>
                  {account.balance.toLocaleString()} {account.unit}
                  {isTarget ? " · destination" : " · will be moved"}
                </Text>
              </View>
            </Pressable>
          );
        })}
        <SheetActions
          styles={styles}
          confirmLabel={busy === "consolidate" ? "Moving…" : "Move"}
          confirmDisabled={consolidateTarget === null || busy !== null}
          onConfirm={() => void handleConsolidate()}
          onCancel={() => setShowConsolidate(false)}
        />
      </BottomSheet>

      {/* Peer picker for a mesh hand-off */}
      <BottomSheet
        visible={showPeerPicker}
        onClose={() => setShowPeerPicker(false)}
        sheetStyle={styles.modalSheet}
      >
        <Text style={styles.modalTitle}>Send to peer</Text>
        <Text style={styles.modalSubtitle}>
          The token goes out as an encrypted DM over the mesh. No internet
          needed.
        </Text>
        {onlinePeers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No peers in range</Text>
            <Text style={styles.emptyBody}>
              Open the Mesh tab to find nearby devices, or share the token
              another way.
            </Text>
          </View>
        ) : (
          onlinePeers.map((peer) => {
            const username = peerIDToUsername(peer.peerID);
            return (
              <Pressable
                key={peer.peerID}
                style={styles.peerPickerRow}
                onPress={() => handleSendTokenToPeer(peer.peerID)}
                accessibilityRole="button"
                accessibilityLabel={`Send to ${username}`}
              >
                <Avatar username={username} peerID={peer.peerID} size={40} />
                <View style={styles.peerPickerInfo}>
                  <Text style={styles.peerPickerName}>{username}</Text>
                  <Text style={styles.peerPickerID}>
                    {peer.peerID.slice(0, 8)}
                  </Text>
                </View>
                <Feather name="send" size={16} color={Colors.textMuted} />
              </Pressable>
            );
          })
        )}
        <View style={styles.modalActions}>
          <Pressable
            style={styles.modalCancel}
            onPress={() => setShowPeerPicker(false)}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </ScrollView>
  );
}

// ---- Small presentational pieces --------------------------------------------

type Styles = ReturnType<typeof createStyles>;

// The stacked confirm/cancel pair every sheet in the app uses.
function SheetActions({
  styles,
  confirmLabel,
  confirmDisabled,
  onConfirm,
  onCancel,
}: {
  styles: Styles;
  confirmLabel: string;
  confirmDisabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}): React.JSX.Element {
  return (
    <View style={styles.modalActions}>
      <Pressable
        style={[
          styles.modalConfirm,
          confirmDisabled && styles.modalConfirmDisabled,
        ]}
        onPress={onConfirm}
        disabled={confirmDisabled}
        accessibilityRole="button"
        accessibilityLabel={confirmLabel}
      >
        <Text style={styles.modalConfirmText}>{confirmLabel}</Text>
      </Pressable>
      <Pressable style={styles.modalCancel} onPress={onCancel}>
        <Text style={styles.modalCancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

// Choose which mint an operation acts on. Renders nothing for a single option,
// because a picker with one row is just noise.
function MintPicker({
  styles,
  Colors,
  label,
  options,
  selected,
  onSelect,
}: {
  styles: Styles;
  Colors: ReturnType<typeof useThemeColors>;
  label: string;
  options: { mintUrl: string; sub: string }[];
  selected: string | null;
  onSelect: (mintUrl: string) => void;
}): React.JSX.Element | null {
  if (options.length === 0) return null;
  if (options.length === 1) {
    return (
      <Text style={styles.modalSubtitle}>
        {label} {hostOf(options[0].mintUrl)}
      </Text>
    );
  }
  return (
    <>
      <Text style={styles.modalSubtitle}>{label}</Text>
      {options.map((option) => {
        const active = option.mintUrl === selected;
        return (
          <Pressable
            key={option.mintUrl}
            style={[styles.pickRow, active && styles.pickRowSelected]}
            onPress={() => onSelect(option.mintUrl)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${label} ${hostOf(option.mintUrl)}`}
          >
            <Feather
              name={active ? "check-circle" : "circle"}
              size={18}
              color={active ? Colors.accent : Colors.textMuted}
            />
            <View style={styles.pickInfo}>
              <Text style={styles.pickTitle}>{hostOf(option.mintUrl)}</Text>
              <Text style={styles.pickSub}>{option.sub}</Text>
            </View>
          </Pressable>
        );
      })}
    </>
  );
}

function QuoteRow({
  styles,
  label,
  value,
}: {
  styles: Styles;
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <View style={styles.quoteRow}>
      <Text style={styles.quoteLabel}>{label}</Text>
      <Text style={styles.quoteValue}>{value}</Text>
    </View>
  );
}

// ---- Transaction formatting -------------------------------------------------

function isCredit(tx: WalletTx): boolean {
  return tx.kind === "receive" || tx.kind === "mint" || tx.kind === "nutzap-in";
}

function txIcon(tx: WalletTx): React.ComponentProps<typeof Feather>["name"] {
  switch (tx.kind) {
    case "receive":
      return "arrow-down-left";
    case "send":
      return "arrow-up-right";
    case "mint":
      return "download";
    case "melt":
      return "upload";
    case "nutzap-in":
    case "nutzap-out":
      return "zap";
    case "swap":
      return "refresh-cw";
  }
}

function txTitle(tx: WalletTx): string {
  switch (tx.kind) {
    case "receive":
      return tx.status === "pending" ? "Received, unconfirmed" : "Received";
    case "send":
      return tx.status === "reclaimed" ? "Send reclaimed" : "Sent";
    case "mint":
      return "Lightning deposit";
    case "melt":
      return "Lightning withdrawal";
    case "nutzap-in":
      return "Nutzap received";
    case "nutzap-out":
      return "Nutzap sent";
    case "swap":
      return tx.status === "failed"
        ? "Spent proofs removed"
        : "Proofs refreshed";
  }
}

function relativeTime(ms: number): string {
  const delta = Date.now() - ms;
  if (delta < 60_000) return "just now";
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 60) return `${String(minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${String(hours)}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${String(days)}d ago`;
  return new Date(ms).toLocaleDateString();
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    content: {
      padding: Spacing.base,
      gap: Spacing.base,
      paddingBottom: TAB_BAR_CLEARANCE,
    },
    section: {
      gap: Spacing.sm,
    },
    sectionTitle: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      paddingHorizontal: Spacing.xs,
    },
    // Banners
    banner: {
      flexDirection: "row",
      gap: Spacing.md,
      alignItems: "flex-start",
      borderRadius: Radius.lg,
      borderWidth: 1,
      padding: Spacing.base,
    },
    bannerDanger: {
      backgroundColor: Colors.dangerDim,
      borderColor: Colors.danger,
    },
    bannerWarn: {
      backgroundColor: Colors.surfaceRaised,
      borderColor: Colors.border,
    },
    bannerText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.5,
    },
    // Balance
    balanceCard: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.lg,
      gap: Spacing.sm,
    },
    balanceLabel: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    balanceRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: Spacing.sm,
    },
    balanceAmount: {
      fontSize: FontSize["3xl"],
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      lineHeight: FontSize["3xl"] * 1.1,
    },
    balanceUnit: {
      fontSize: FontSize.lg,
      color: Colors.textMuted,
      fontWeight: FontWeight.medium,
      marginBottom: 4,
    },
    balanceNote: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
    },
    balanceNoteText: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      flex: 1,
    },
    balanceSubtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      marginTop: Spacing.xs,
    },
    // Pending sends
    pendingCard: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.borderStrong,
      padding: Spacing.base,
      gap: Spacing.sm,
    },
    pendingHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    pendingAmount: {
      flex: 1,
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
      fontFamily: FontFamily.mono,
    },
    pendingTime: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    pendingBody: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: FontSize.sm * 1.5,
    },
    pendingActions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.sm,
    },
    pendingBtn: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    pendingBtnText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    pendingBtnDanger: {
      backgroundColor: Colors.dangerDim,
      borderColor: Colors.danger,
    },
    pendingBtnDangerText: {
      fontSize: FontSize.sm,
      color: Colors.danger,
      fontWeight: FontWeight.medium,
    },
    // Empty state
    emptyCard: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.xl,
      alignItems: "center",
      gap: Spacing.sm,
    },
    emptyTitle: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    emptyBody: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: FontSize.sm * 1.6,
    },
    emptyCta: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      marginTop: Spacing.xs,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceRaised,
    },
    emptyCtaText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: Colors.accent,
    },
    // Mint rows
    mintRow: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    mintLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      flex: 1,
    },
    mintIconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    mintInfo: {
      flex: 1,
      gap: 2,
    },
    mintName: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
      fontFamily: FontFamily.mono,
    },
    mintMeta: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    mintRight: {
      alignItems: "flex-end",
      gap: 1,
    },
    mintBalance: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      fontFamily: FontFamily.mono,
    },
    mintUnit: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    smallBtn: {
      marginTop: 4,
      minWidth: 64,
      alignItems: "center",
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    smallBtnDisabled: {
      opacity: 0.4,
    },
    smallBtnText: {
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    // Inline call to action inside a section (e.g. the split-balance prompt).
    inlineAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceRaised,
    },
    inlineActionText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.accent,
      fontWeight: FontWeight.medium,
    },
    // Backup
    backupCard: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.base,
      gap: Spacing.md,
    },
    backupHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    backupTitle: {
      flex: 1,
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    pill: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceRaised,
    },
    pillOn: {
      borderColor: Colors.online,
    },
    pillWarn: {
      borderColor: Colors.danger,
      backgroundColor: Colors.dangerDim,
    },
    pillText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontWeight: FontWeight.semibold,
    },
    pillTextOn: {
      color: Colors.online,
    },
    pillTextWarn: {
      color: Colors.danger,
    },
    backupBody: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: FontSize.sm * 1.5,
    },
    backupWarnRow: {
      flexDirection: "row",
      gap: Spacing.sm,
      alignItems: "flex-start",
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      padding: Spacing.md,
    },
    backupWarnText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.5,
    },
    backupHint: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      lineHeight: FontSize.xs * 1.7,
      fontFamily: FontFamily.mono,
    },
    backupActions: {
      flexDirection: "row",
      gap: Spacing.sm,
    },
    backupBtn: {
      flex: 1,
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    backupBtnText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: Colors.accent,
    },
    // Recovery phrase sheet
    bulletRow: {
      flexDirection: "row",
      gap: Spacing.md,
      alignItems: "flex-start",
    },
    bulletDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: Colors.textMuted,
      marginTop: 7,
      flexShrink: 0,
    },
    bulletText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.5,
    },
    // Two columns of six, so the numbering reads down each column the way it
    // is written on paper.
    phraseGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.sm,
    },
    phraseCell: {
      width: "47%",
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceRaised,
    },
    phraseIndex: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontFamily: FontFamily.mono,
      minWidth: 16,
      textAlign: "right",
    },
    phraseWord: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textPrimary,
      fontFamily: FontFamily.mono,
      fontWeight: FontWeight.medium,
    },
    verifyRow: {
      gap: Spacing.xs,
    },
    verifyLabel: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    verifyError: {
      fontSize: FontSize.sm,
      color: Colors.danger,
    },
    // Radio-style picker rows (consolidate destination).
    pickRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceRaised,
    },
    pickRowSelected: {
      borderColor: Colors.accent,
    },
    pickInfo: {
      flex: 1,
      gap: 2,
    },
    pickTitle: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
      fontFamily: FontFamily.mono,
    },
    pickSub: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    // Lightning
    lightningCard: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.base,
      gap: Spacing.md,
    },
    lightningBody: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: FontSize.sm * 1.5,
    },
    lightningActions: {
      flexDirection: "row",
      gap: Spacing.sm,
    },
    lightningBtn: {
      flex: 1,
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    lightningBtnText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: Colors.accent,
    },
    lightningPending: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    // History
    historyCard: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
    },
    historyRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.md,
    },
    historyIcon: {
      flexShrink: 0,
    },
    historyText: {
      flex: 1,
      gap: 2,
    },
    historyTitle: {
      fontSize: FontSize.sm,
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
    },
    historySub: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    historyAmount: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontFamily: FontFamily.mono,
      fontWeight: FontWeight.semibold,
    },
    historyCredit: {
      color: Colors.online,
    },
    historyDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
    },
    // Info panel
    infoPanel: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.base,
      gap: Spacing.md,
    },
    infoPanelRow: {
      flexDirection: "row",
      gap: Spacing.md,
      alignItems: "flex-start",
      paddingVertical: Spacing.xs,
    },
    infoPanelIcon: {
      marginTop: 2,
      flexShrink: 0,
    },
    infoPanelText: {
      flex: 1,
      gap: 3,
    },
    infoPanelTitle: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    infoPanelBody: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: FontSize.sm * 1.5,
    },
    infoPanelDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
    },
    // Sheets
    modalSheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.md,
    },
    modalTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    modalSubtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: FontSize.sm * 1.5,
    },
    tokenInput: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      color: Colors.textPrimary,
      fontSize: FontSize.sm,
      fontFamily: FontFamily.mono,
      minHeight: 80,
      textAlignVertical: "top",
    },
    tokenInputCompact: {
      minHeight: 0,
      fontFamily: undefined,
    },
    tokenInputMono: {
      fontFamily: FontFamily.mono,
      fontSize: FontSize.xs,
      letterSpacing: 0.3,
    },
    // Stacked, full-width pill actions, same shape and rhythm as every other
    // sheet in the app (see `settings/shared` sheetActions): the group owns the
    // spacing between its buttons so it does not compound with the sheet's own
    // gap, and a lone button carries no stray margin.
    modalActions: {
      width: "100%",
      marginTop: Spacing.xs,
      gap: Spacing.sm,
    },
    modalCancel: {
      width: "100%",
      minHeight: 50,
      paddingVertical: Spacing.md,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    modalCancelText: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.semibold,
    },
    modalConfirm: {
      width: "100%",
      minHeight: 50,
      paddingVertical: Spacing.md,
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    modalConfirmDisabled: {
      opacity: 0.4,
    },
    modalConfirmText: {
      fontSize: FontSize.base,
      color: Colors.textInverse,
      fontWeight: FontWeight.bold,
    },
    // Quote breakdown
    quoteBox: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.base,
      gap: Spacing.xs,
    },
    quoteRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    quoteLabel: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    quoteValue: {
      fontSize: FontSize.sm,
      color: Colors.textPrimary,
      fontFamily: FontFamily.mono,
    },
    waitingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.sm,
    },
    waitingText: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    // Generated token
    generatedHeader: {
      alignItems: "center",
      gap: Spacing.xs,
      paddingBottom: Spacing.sm,
    },
    generatedAmountRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: Spacing.sm,
    },
    generatedAmount: {
      fontSize: FontSize["2xl"],
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    generatedUnit: {
      fontSize: FontSize.base,
      color: Colors.textMuted,
      fontWeight: FontWeight.medium,
      marginBottom: 3,
    },
    generatedMint: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
    },
    generatedHint: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: FontSize.xs * 1.6,
      paddingHorizontal: Spacing.sm,
    },
    generatedActions: {
      width: "100%",
      gap: Spacing.sm,
    },
    generatedActionBtn: {
      width: "100%",
      minHeight: 50,
      paddingVertical: Spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    generatedActionText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: Colors.accent,
    },
    // Peer picker
    peerPickerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },
    peerPickerInfo: {
      flex: 1,
      gap: 2,
    },
    peerPickerName: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    peerPickerID: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontFamily: FontFamily.mono,
    },
  });
}
