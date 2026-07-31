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
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import {
  canEncodeTokenQr,
  formatAmount,
  isLikelyTestMint,
  TOKEN_QR_ERROR_CORRECTION,
  TOKEN_QR_MAX_CHARS,
  TOKEN_QR_SIZE,
  tokenQrPayload,
} from "../../core/payments/cashu";
import {
  isValidRecoveryPhrase,
  pickVerificationPositions,
  unknownWordsIn,
  verifyPositions,
} from "../../core/payments/wallet-seed";
import { t, tPlural, useT, useTPlural } from "../../i18n";
import { textAlignEnd } from "../../i18n/layout";
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
  reconcile,
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
import { useContactsStore } from "../../store/contacts-store";
import { usePeerStore } from "../../store/peer-store";
import { useSettingsStore } from "../../store/settings-store";
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
  DISABLED_OPACITY,
  FontFamily,
  FontSize,
  FontWeight,
  hitSlopFor,
  MIN_TOUCH,
  Radius,
  Spacing,
  TAB_BAR_CLEARANCE,
  useThemeColors,
} from "../../ui/theme";
import { usePullRefreshColors } from "../../ui/use-pull-refresh";
import { formatNumber } from "../../utils/format";
import { peerIDToUsername } from "../../utils/username";
import TokenScanner, { type ScanTarget } from "./token-scanner";

// The four quick actions triggered from the App-level header.
export type WalletAction = "receive" | "send" | "zap" | "addMint";

// How long a bottom sheet takes to slide out. Presenting the camera before it
// has gone would stack two modals, which iOS refuses.
const SHEET_EXIT_MS = 260;

// How often to poll a pending Lightning deposit while its sheet is open.
const DEPOSIT_POLL_MS = 3000;

// A peer counts as reachable for a hand-off if it was heard from this recently.
const PEER_ONLINE_WINDOW_MS = 60_000;

// Activity rows shown before the list has to be asked for. Three is enough to
// answer "did that go through", which is the only question this section gets
// asked on the way past; the rest is history and can wait for a tap.
const ACTIVITY_COLLAPSED_COUNT = 3;

// Drawn size of the per-mint icon buttons (confirm proofs, remove mint). Small
// on purpose so a mint row stays a row rather than a card, with hitSlopFor()
// making the target up to MIN_TOUCH. One of the two deletes proofs permanently,
// so it is not a target to leave at 28pt.
const MINT_ICON_SIZE = 28;

interface Props {
  action?: WalletAction | null;
  actionTrigger?: number;
}

export default function WalletScreen({
  action,
  actionTrigger,
}: Props): React.JSX.Element {
  const T = useT();
  const TP = useTPlural();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const pullRefreshColors = usePullRefreshColors();

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
  const [scannerTarget, setScannerTarget] = useState<ScanTarget | null>(null);
  const [pullRefreshing, setPullRefreshing] = useState(false);
  // A pending send re-shown as a QR, for handing it over after the fact.
  const [qrToken, setQrToken] = useState<WalletTx | null>(null);
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

  // Zapping addresses an identity, so both halves need one on screen: theirs to
  // send to, and ours to hand out. Without this the Zap sheet asked for
  // something the app never showed you anywhere.
  const myNpub = useMemo(() => {
    const hex = getMeshService()?.getNostrPubKeyHex();
    if (hex === undefined || hex.length === 0) return null;
    try {
      return nip19.npubEncode(hex);
    } catch {
      return null;
    }
  }, []);

  // Contacts learned from a QR card or an ANNOUNCE already carry a Nostr key.
  // Typing 63 characters by hand when the app knows them is a self-inflicted
  // wound, so offer them instead.
  const contacts = useContactsStore((c) => c.contacts);
  const zapContacts = useMemo(
    () =>
      Object.values(contacts)
        .filter((c) => c.nostrPubkeyHex !== undefined)
        .sort((a, b) => a.nickname.localeCompare(b.nickname))
        .slice(0, 8),
    [contacts],
  );
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
  const [depositClock, setDepositClock] = useState(0);
  const depositExpiresAtMs = deposit?.expiresAtMs;
  const depositExpired =
    depositExpiresAtMs !== undefined && depositClock >= depositExpiresAtMs;

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

  const [showAllActivity, setShowAllActivity] = useState(false);
  const visibleActivity = showAllActivity
    ? recent
    : recent.slice(0, ACTIVITY_COLLAPSED_COUNT);

  const mintList = useMemo(() => Object.values(mints), [mints]);

  // A mint that advertises several currencies produces one account per
  // currency, so adding a single mint can spill four near-identical rows that
  // all read as separate mints and all hold nothing. Show the accounts that
  // actually hold something, and for a mint holding nothing anywhere keep one
  // row so it stays visible after being added. Preferring the sat row for that
  // placeholder matches what the rest of the wallet is denominated in.
  // Test mints hand out fake sats. Nothing stops you using one, but a balance
  // that cannot be cashed out should never look like one that can.
  const holdsTestMoney = useMemo(
    () =>
      accounts.some(
        (a) =>
          (a.balance > 0 || a.reserved > 0) &&
          isLikelyTestMint({
            url: a.mintUrl,
            name: mints[a.mintUrl]?.name,
            description: mints[a.mintUrl]?.description,
          }),
      ),
    [accounts, mints],
  );

  const visibleAccounts = useMemo(() => {
    const funded = accounts.filter(
      (a) => a.balance > 0 || a.reserved > 0 || a.proofCount > 0,
    );
    const covered = new Set(funded.map((a) => a.mintUrl));
    const placeholders = new Map<string, AccountBalance>();
    for (const account of accounts) {
      if (covered.has(account.mintUrl)) continue;
      const current = placeholders.get(account.mintUrl);
      if (
        current === undefined ||
        (current.unit !== "sat" && account.unit === "sat")
      ) {
        placeholders.set(account.mintUrl, account);
      }
    }
    return [...funded, ...placeholders.values()];
  }, [accounts]);

  // How much of the primary unit the recovery phrase could NOT rebuild. Coins
  // received from other people carry their secrets, so they sit outside the
  // phrase until a swap re-issues them under ours. Only the shortfall is
  // counted: the card states the guarantee in general terms and names an
  // amount only where the guarantee does not hold.
  const unbackedBalance = useMemo(
    () =>
      accounts
        .filter((a) => a.unit === primary.unit)
        .reduce((sum, a) => sum + a.unbacked, 0),
    [accounts, primary.unit],
  );

  // Denomination the user last chose. Purely a display preference: sats and
  // bitcoin are the same number scaled by a constant, so nothing here touches a
  // balance, a quote, or anything that gets sent.
  const bitcoinUnit = useSettingsStore((s) => s.bitcoinUnit);
  const setBitcoinUnit = useSettingsStore((s) => s.setBitcoinUnit);

  const headline = useMemo(
    () => formatAmount(primary.balance, primary.unit, bitcoinUnit),
    [primary.balance, primary.unit, bitcoinUnit],
  );

  // Only sat balances have a bitcoin denomination to switch to; a mint issuing
  // usd is already quoting a currency, so the toggle is inert there.
  function toggleBitcoinUnit(): void {
    if (primary.unit !== "sat") return;
    setBitcoinUnit(bitcoinUnit === "sat" ? "btc" : "sat");
  }

  // "21,500 sat" / "0.000215 BTC", for the lines that sit under the headline
  // and must agree with it.
  function showAmount(amount: number, unit: string): string {
    const formatted = formatAmount(amount, unit, bitcoinUnit);
    return `${formatted.value} ${formatted.label}`;
  }

  // How big a hand-off QR is drawn. TOKEN_QR_SIZE is the size its character
  // ceiling was budgeted against, clamped to what the sheet actually has: the
  // sheet's own padding plus the white frame's takes 80, and on a narrow phone
  // the full size would be clipped, which reads as a broken code rather than a
  // small one.
  const { width: windowWidth } = useWindowDimensions();
  const qrSize = Math.min(
    TOKEN_QR_SIZE,
    windowWidth - Spacing.xl * 2 - Spacing.base * 2,
  );

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

      if (result.outcome === "own-pending") {
        showAlert(
          t("wallet.receive.own_payment"),
          t("wallet.receive.own_payment_body"),
        );
        return;
      }
      if (result.outcome === "duplicate") {
        showAlert(
          t("wallet.receive.already_have"),
          t("wallet.receive.already_have_body"),
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
          // Three sentences assembled at runtime, each its own key so a
          // translator can reword or reorder them. The joining space lives
          // here rather than being baked onto the front of the copy.
          [
            t("wallet.receive.stored_unconfirmed", {
              mint: where,
              reason: result.offlineReason ?? t("wallet.receive.offline"),
            }),
            result.dleq === "valid"
              ? t("wallet.receive.dleq_ok")
              : t("wallet.receive.dleq_uncached"),
            t("wallet.receive.dleq_warning"),
          ].join(" ") + (result.memo ? `\n\n"${result.memo}"` : ""),
        );
      }
    } catch (err) {
      reportError(err, t("wallet.receive.failed"));
    } finally {
      setBusy(null);
    }
  }

  // The camera is presented from inside the Receive sheet, and iOS shows one
  // modal at a time: opening the scanner while the sheet is still on screen
  // silently does nothing. So the sheet closes first, its exit animation is
  // allowed to finish, and only then does the camera come up. Every path back
  // restores the sheet the same way, so the scanner always feels like a
  // detour rather than somewhere the user got dropped.
  function reopenSheetFor(target: ScanTarget): void {
    setTimeout(() => {
      if (target === "token") setShowReceive(true);
      else setShowWithdraw(true);
    }, SHEET_EXIT_MS);
  }

  function openScanner(target: ScanTarget): void {
    if (target === "token") setShowReceive(false);
    else setShowWithdraw(false);
    setTimeout(() => setScannerTarget(target), SHEET_EXIT_MS);
  }

  function closeScanner(): void {
    if (scannerTarget === null) return;
    const target = scannerTarget;
    setScannerTarget(null);
    reopenSheetFor(target);
  }

  // A scan fills the field rather than acting on the spot. The sheet already
  // shows what is about to happen, and silently claiming or paying whatever the
  // camera saw would remove the last chance to check it.
  function handleScanned(value: string): void {
    if (scannerTarget === null) return;
    const target = scannerTarget;
    if (target === "token") {
      setTokenInput(value);
    } else {
      setWithdrawInvoice(value);
      setWithdrawQuote(null);
    }
    setScannerTarget(null);
    reopenSheetFor(target);
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
          t("wallet.err.exact_amount"),
          `Your proofs can't make exactly ${amount.toLocaleString()} ${quote.unit} offline. The smallest token you can build is ${quote.spend.toLocaleString()} ${quote.unit}, and offline there is no change: the extra ${(quote.spend - amount).toLocaleString()} ${quote.unit} goes to the recipient.\n\nRefreshing at the mint while online would split your proofs into denominations that make this exact.`,
          [
            { text: T("common.cancel"), style: "cancel" },
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
      reportError(err, t("wallet.send.build_failed"));
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
      t("wallet.reclaim.title"),
      `The ${tx.amount.toLocaleString()} ${tx.unit} goes back into your balance. Only do this if the token never reached anyone: if they already have the string, whoever redeems it at the mint first keeps the money, and that could be them.`,
      [
        { text: t("wallet.reclaim.keep"), style: "cancel" },
        {
          text: t("wallet.reclaim.confirm"),
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
    showAlert(T("common.copied"), t("wallet.copied.token_body"));
  }

  // Copying a seed phrase is a real risk: clipboards are readable by other apps
  // and sync across devices on some setups. But refusing to offer it just
  // pushes people to screenshot instead, which is worse and permanent. Offer
  // it, and say plainly why it needs cleaning up afterwards.
  async function handleCopyPhrase(): Promise<void> {
    await Clipboard.setStringAsync(phrase);
    showAlert(T("common.copied"), t("wallet.copied.phrase_body"));
  }

  // Hands the token the user already built to a nearby peer. Uses the shared
  // delivery helper rather than posting the DM here, so the message id, the
  // delivery status and the pending transaction line up exactly as they do
  // when the send starts from a chat or the Mesh tab.
  function handleSendTokenToPeer(peerID: string): void {
    if (!pending) return;
    if (!getMeshService()) {
      showAlert(t("wallet.mesh_offline"), t("wallet.mesh_offline_body"));
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
        if (decoded.type !== "npub") throw new Error(t("wallet.zap.not_npub"));
        recipientPubkey = decoded.data;
      } else if (/^[0-9a-f]{64}$/i.test(npubRaw)) {
        recipientPubkey = npubRaw.toLowerCase();
      } else {
        throw new Error(t("wallet.zap.bad_key"));
      }
    } catch {
      showAlert(
        t("wallet.zap.invalid_pubkey"),
        t("wallet.zap.invalid_pubkey_body"),
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
          t("wallet.zap.sent"),
          `${result.amount.toLocaleString()} ${result.unit} locked to their key and published. Only they can redeem it.`,
        );
      } else if (result.method === "dm") {
        showAlert(
          t("wallet.zap.sent_encrypted"),
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
          t("wallet.zap.no_network"),
          `${result.fallbackReason}. A token was built instead: share it however you like, or reclaim it under Pending.`,
        );
      }
    } catch (err) {
      reportError(err, t("wallet.zap.failed"));
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
        mint.name ? `Added ${mint.name}` : t("wallet.mint.added"),
        `${hostOf(mint.url)} issues ${units.join(", ")}. Its keys are cached on this device, so tokens from it can now be verified even with no internet.`,
      );
    } catch (err) {
      reportError(err, t("wallet.mint.add_failed"));
    } finally {
      setBusy(null);
    }
  }

  // The global counterpart to the per-mint buttons. Pull is the standard
  // gesture for "bring this up to date", so it does the whole job: settle
  // anything left hanging first, then reconcile every funded account with its
  // mint.
  //
  // Deliberately silent on success. The gesture is its own feedback and the
  // numbers changing is the result, so an alert per mint would turn a routine
  // pull into a stack of dialogs to dismiss. Only trouble is worth speaking up
  // about, and then once, not once per mint.
  async function handlePullRefresh(): Promise<void> {
    // Empty accounts exist purely because a mint advertises the currency, and
    // there is nothing at the mint to reconcile them against.
    const funded = accounts.filter((a) => a.proofCount > 0 || a.reserved > 0);
    if (locked) return;
    setPullRefreshing(true);
    try {
      // Sequenced, not raced: this claims paid deposits and recovers melt
      // change, so it adds proofs to the very accounts the refresh below is
      // about to swap. Running both at once would have them treading on each
      // other for no gain, since neither is slow enough to be worth it.
      try {
        await reconcile();
      } catch {
        // Best effort. A mint that cannot be reached here gets another chance
        // on the next pull, and the refresh below is still worth attempting.
      }
      const results = await Promise.allSettled(
        funded.map((a) => refreshAccount(a.mintUrl, a.unit)),
      );
      const failed = funded.filter((_, i) => results[i]?.status === "rejected");
      if (failed.length === 0) return;
      const hosts = [...new Set(failed.map((a) => hostOf(a.mintUrl)))];
      if (failed.length === funded.length) {
        reportError(
          (results[0] as PromiseRejectedResult | undefined)?.reason,
          t("wallet.refresh.failed"),
        );
      } else {
        showAlert(
          t("wallet.refresh.partly"),
          `Could not reach ${hosts.join(", ")}. Everything else is up to date.`,
        );
      }
    } finally {
      setPullRefreshing(false);
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
        parts.push(tPlural("wallet.spent_removed_detail", result.spentRemoved));
      }
      // Worth naming separately: this value was never in doubt, it was just
      // outside the recovery phrase until the swap re-issued it.
      if (result.securedForBackup > 0) {
        parts.push(
          `${result.securedForBackup.toLocaleString()} ${unit} is now covered by your recovery phrase.`,
        );
      }
      showAlert(
        t("wallet.refresh.done"),
        parts.length > 0
          ? parts.join("\n\n")
          : t("wallet.refresh.all_confirmed"),
      );
    } catch (err) {
      reportError(err, t("wallet.refresh.failed"));
    } finally {
      setRefreshingMint(null);
    }
  }

  function handleRemoveMint(account: AccountBalance): void {
    const hasValue = account.balance > 0 || account.reserved > 0;
    showAlert(
      hasValue ? t("wallet.mint.remove_with_balance") : t("wallet.mint.remove"),
      hasValue
        ? tPlural("wallet.mint.remove_body", account.proofCount, {
            mint: hostOf(account.mintUrl),
            balance: formatNumber(account.balance),
            unit: account.unit,
          })
        : `Remove ${hostOf(account.mintUrl)} from your wallet? Its cached keys go too, so tokens from it can no longer be verified offline.`,
      [
        { text: T("common.cancel"), style: "cancel" },
        {
          text: hasValue ? t("wallet.mint.delete_anyway") : T("common.remove"),
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
      reportError(err, t("wallet.backup.setup_failed"));
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
      showAlert(t("wallet.backup.on"), t("wallet.backup.on_body"));
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
          t("wallet.backup.no_phrase"),
          t("wallet.backup.no_phrase_body"),
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
        t("wallet.backup.replace_title"),
        t("wallet.backup.replace_body"),
        [
          {
            text: T("common.cancel"),
            style: "cancel",
            onPress: () => finish(false),
          },
          {
            text: t("wallet.backup.replace"),
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
        t("wallet.backup.invalid_phrase"),
        unknown.length > 0
          ? `These are not BIP-39 words: ${unknown.slice(0, 4).join(", ")}. Check the spelling.`
          : t("wallet.backup.invalid_phrase_body"),
      );
      return;
    }
    if (mintList.length === 0) {
      showAlert(
        t("wallet.backup.add_mint_first"),
        t("wallet.backup.add_mint_first_body"),
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
      reportError(err, t("wallet.backup.restore_failed"));
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
        moved > 0 ? t("wallet.mint.moved") : t("wallet.mint.nothing_moved"),
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
        description: t("wallet.ln.deposit_memo"),
      });
      setDeposit(created);
      setDepositClock(Date.now());
      setDepositAmount("");
    } catch (err) {
      reportError(err, t("wallet.ln.invoice_failed"));
    } finally {
      setBusy(null);
    }
  }

  // A bolt11 invoice is only good for a few minutes. Without a clock the sheet
  // would sit on "Waiting for payment…" forever against an invoice nobody can
  // pay any more, which reads as a hang rather than an expiry.
  useEffect(() => {
    if (!showDeposit || depositExpiresAtMs === undefined) return;
    const timer = setInterval(() => setDepositClock(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [showDeposit, depositExpiresAtMs]);

  // Poll the open deposit until the invoice is paid. Stops as soon as the sheet
  // closes or the invoice expires; an unclaimed deposit is picked up by
  // `reconcile` on next launch, so nothing is lost by giving up here.
  useEffect(() => {
    if (!deposit || !showDeposit || depositExpired) return;
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
  }, [deposit, showDeposit, depositExpired]);

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
      reportError(err, t("wallet.ln.price_failed"));
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
        t("wallet.ln.paid"),
        `${result.paid.toLocaleString()} sats paid over Lightning. The mint charged ${result.fee.toLocaleString()} sats in routing fees` +
          (result.changeReturned > 0
            ? `, and returned ${result.changeReturned.toLocaleString()} sats of the reserve to your balance.`
            : "."),
      );
    } catch (err) {
      reportError(err, t("wallet.ln.payment_failed"));
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
      refreshControl={
        <RefreshControl
          refreshing={pullRefreshing}
          onRefresh={() => void handlePullRefresh()}
          {...pullRefreshColors}
        />
      }
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
          <Text style={styles.balanceLabel}>
            {T("wallet.balance.spendable")}
          </Text>
          {/* Tapping the balance switches between sats and bitcoin. No
              animation on purpose: a balance that morphs is a balance people
              stop trusting. Same place, same size, instant. */}
          <Pressable
            style={styles.balanceRow}
            onPress={toggleBitcoinUnit}
            disabled={primary.unit !== "sat"}
            accessibilityRole="button"
            accessibilityLabel={`Balance ${headline.value} ${headline.label}`}
            accessibilityHint={
              primary.unit === "sat" ? T("wallet.balance.unit_hint") : undefined
            }
          >
            {/* 38pt digits, so a seven-figure balance or a large OS text size
                used to run off the edge of the card and get clipped: the one
                number in the app that must never be half-visible. Shrinking to
                fit keeps it on one line and keeps the unit beside it. */}
            <Text
              style={styles.balanceAmount}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              {headline.value}
            </Text>
            <Text style={styles.balanceUnit}>{headline.label}</Text>
          </Pressable>

          {/* Everything that is not plain spendable balance is stated
              explicitly rather than folded into the number above. */}
          {primary.unverified > 0 && (
            <View style={styles.balanceNote}>
              <Feather name="clock" size={12} color={Colors.textMuted} />
              <Text style={styles.balanceNoteText}>
                {showAmount(primary.unverified, primary.unit)} not yet confirmed
                with the mint
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
                {showAmount(primary.reserved, primary.unit)} reserved for a send
                in flight
              </Text>
            </View>
          )}

          {unitTotals
            .filter((u) => u.unit !== primary.unit && u.balance > 0)
            .map((u) => (
              <Text key={u.unit} style={styles.balanceNoteText}>
                {showAmount(u.balance, u.unit)} at a separate mint account
              </Text>
            ))}

          {holdsTestMoney && (
            <Text style={styles.testNote}>
              Includes play money from a test mint. It is not bitcoin and cannot
              be cashed out.
            </Text>
          )}

          <Text style={styles.balanceSubtitle}>
            {TP("wallet.mint_count", mintList.length)}
            {" · "}
            {TP(
              "wallet.proof_count",
              accounts.reduce((s, a) => s + a.proofCount, 0),
            )}
          </Text>
        </View>
      </View>

      {/* Pending sends: reserved proofs the user can still recover. */}
      {pendingSends.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{T("wallet.pending.title")}</Text>
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
                    ? t("wallet.pending.reserved_desc")
                    : t("wallet.pending.locked_desc")}
                  {tx.error ? `\n\n${tx.error}` : ""}
                </Text>
                <View style={styles.pendingActions}>
                  <Pressable
                    style={styles.pendingBtn}
                    onPress={() => setQrToken(tx)}
                    accessibilityRole="button"
                    accessibilityLabel={t("wallet.pending.show_qr")}
                  >
                    <Text style={styles.pendingBtnText}>QR</Text>
                  </Pressable>
                  <Pressable
                    style={styles.pendingBtn}
                    onPress={() => void handleCopyToken(tx.token ?? "")}
                    accessibilityRole="button"
                    accessibilityLabel={t("wallet.pending.copy_again")}
                  >
                    <Text style={styles.pendingBtnText}>
                      {T("common.copy")}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.pendingBtn}
                    onPress={() => handleShareToken(tx.token ?? "")}
                    accessibilityRole="button"
                    accessibilityLabel={t("wallet.pending.share_again")}
                  >
                    <Text style={styles.pendingBtnText}>
                      {T("common.share")}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.pendingBtn}
                    onPress={() => markDelivered(tx.id)}
                    accessibilityRole="button"
                    accessibilityLabel={t("wallet.pending.mark_delivered")}
                  >
                    <Text style={styles.pendingBtnText}>
                      {t("wallet.pending.delivered")}
                    </Text>
                  </Pressable>
                  {reclaimable && (
                    <Pressable
                      style={[styles.pendingBtn, styles.pendingBtnDanger]}
                      onPress={() => handleReclaim(tx)}
                      accessibilityRole="button"
                      accessibilityLabel={t("wallet.pending.reclaim_into")}
                    >
                      <Text style={styles.pendingBtnDangerText}>
                        {T("wallet.reclaim.confirm")}
                      </Text>
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
        <Text style={styles.sectionTitle}>{T("wallet.mint.title")}</Text>
        {visibleAccounts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{T("wallet.mint.none")}</Text>
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
              accessibilityLabel={T("wallet.mint.add")}
            >
              <Feather name="plus" size={15} color={Colors.accent} />
              <Text style={styles.emptyCtaText}>{T("wallet.mint.add")}</Text>
            </Pressable>
          </View>
        ) : (
          visibleAccounts.map((account) => {
            const record = mints[account.mintUrl];
            return (
              <View key={account.key} style={styles.mintRow}>
                <View style={styles.mintLeft}>
                  <View style={styles.mintIconCircle}>
                    <Feather
                      name="database"
                      size={16}
                      color={Colors.textSecondary}
                    />
                  </View>
                  <View style={styles.mintInfo}>
                    <View style={styles.mintNameRow}>
                      <Text style={styles.mintName} numberOfLines={1}>
                        {record?.name ?? hostOf(account.mintUrl)}
                      </Text>
                      {isLikelyTestMint({
                        url: account.mintUrl,
                        name: record?.name,
                        description: record?.description,
                      }) && (
                        <View style={styles.testBadge}>
                          <Text style={styles.testBadgeText}>TEST</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.mintMeta} numberOfLines={1}>
                      {[
                        record?.name !== undefined
                          ? hostOf(account.mintUrl)
                          : null,
                        TP("wallet.proof_count", account.proofCount),
                        account.unverified > 0
                          ? `${account.unverified.toLocaleString()} unconfirmed`
                          : null,
                      ]
                        .filter((part) => part !== null)
                        .join(" · ")}
                    </Text>
                  </View>
                </View>
                <View style={styles.mintRight}>
                  <Text style={styles.mintBalance}>
                    {
                      formatAmount(account.balance, account.unit, bitcoinUnit)
                        .value
                    }
                  </Text>
                  <Text style={styles.mintUnit}>
                    {
                      formatAmount(account.balance, account.unit, bitcoinUnit)
                        .label
                    }
                  </Text>
                  <View style={styles.mintActions}>
                    <Pressable
                      style={[
                        styles.iconBtn,
                        networkBlocked && styles.smallBtnDisabled,
                      ]}
                      disabled={networkBlocked || refreshingMint !== null}
                      onPress={() =>
                        void handleRefreshMint(account.mintUrl, account.unit)
                      }
                      hitSlop={hitSlopFor(MINT_ICON_SIZE)}
                      accessibilityRole="button"
                      accessibilityLabel={`Confirm proofs with ${hostOf(account.mintUrl)}`}
                    >
                      {refreshingMint === account.mintUrl ? (
                        <ActivityIndicator
                          size="small"
                          color={Colors.textSecondary}
                        />
                      ) : (
                        <Feather
                          name="refresh-cw"
                          size={13}
                          color={Colors.textSecondary}
                        />
                      )}
                    </Pressable>
                    <Pressable
                      style={styles.iconBtn}
                      onPress={() => handleRemoveMint(account)}
                      hitSlop={hitSlopFor(MINT_ICON_SIZE)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${hostOf(account.mintUrl)}`}
                    >
                      <Feather
                        name="x"
                        size={14}
                        color={Colors.textSecondary}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
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
            accessibilityLabel={T("wallet.mint.consolidate")}
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
        <Text style={styles.sectionTitle}>{T("wallet.ln.title")}</Text>
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
              accessibilityLabel={T("wallet.ln.deposit")}
            >
              <Feather name="download" size={16} color={Colors.accent} />
              <Text style={styles.lightningBtnText}>
                {T("wallet.ln.deposit_short")}
              </Text>
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
              accessibilityLabel={T("wallet.ln.withdraw")}
            >
              <Feather name="upload" size={16} color={Colors.accent} />
              <Text style={styles.lightningBtnText}>
                {T("wallet.ln.withdraw_short")}
              </Text>
            </Pressable>
          </View>
          {pendingDeposits.length > 0 && (
            <Text style={styles.lightningPending}>
              {TP("wallet.ln.pending_deposits", pendingDeposits.length)}
            </Text>
          )}
        </View>
      </View>

      {/* Backup. Off by default, because turning it on is a commitment: the
          user has to write twelve words down and keep them, and a phrase
          nobody wrote down is worse than none at all (it implies a safety net
          that is not there). */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{T("wallet.backup.title")}</Text>
        <View style={styles.backupCard}>
          <View style={styles.backupHeader}>
            {/* Only a finished backup earns an intact shield, and the calm
                color is the blue this app reserves for verified, never the
                green that means end-to-end encrypted.

                Both unsafe states are a struck shield in red: no phrase at all,
                and a phrase whose written copy was never confirmed. The second
                is the more dangerous of the two, so it must not borrow the
                reassuring glyph while the setup is still half-done. */}
            <Feather
              name={backupEnabled && backupVerified ? "shield" : "shield-off"}
              size={16}
              color={
                backupEnabled && backupVerified
                  ? Colors.verified
                  : Colors.danger
              }
            />
            <Text style={styles.backupTitle}>{T("wallet.explain.phrase")}</Text>
            <View
              style={[
                styles.pill,
                backupEnabled && backupVerified && styles.pillOn,
                backupEnabled && !backupVerified && styles.pillWarn,
              ]}
              accessibilityLabel={
                backupEnabled
                  ? backupVerified
                    ? T("wallet.backup.on")
                    : T("wallet.backup.state_unconfirmed")
                  : T("wallet.backup.state_off")
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
                    ? T("wallet.backup.badge_on")
                    : T("wallet.backup.badge_unconfirmed")
                  : T("wallet.backup.badge_off")}
              </Text>
            </View>
          </View>

          {backupEnabled ? (
            <>
              <Text style={styles.backupBody}>
                Your balance can be rebuilt on a new device from your twelve
                words.
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
              {unbackedBalance > 0 && (
                <View style={styles.backupWarnRow}>
                  <Feather
                    name="alert-circle"
                    size={13}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.backupWarnText}>
                    {unbackedBalance.toLocaleString()} {primary.unit} is not
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
                  ? T("wallet.backup.view")
                  : T("wallet.backup.setup")
              }
            >
              <Feather
                name={backupEnabled ? "eye" : "key"}
                size={16}
                color={Colors.accent}
              />
              <Text style={styles.backupBtnText}>
                {backupEnabled
                  ? T("wallet.backup.view_short")
                  : T("wallet.backup.setup_short")}
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
              accessibilityLabel={T("wallet.backup.restore")}
            >
              <Feather name="download-cloud" size={16} color={Colors.accent} />
              <Text style={styles.backupBtnText}>
                {T("wallet.backup.restore_short")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Activity. Always shown: a section that disappears when empty leaves
          people wondering whether the app forgot their payments or never had
          them, and it makes the tab reflow as soon as the first one lands. */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{T("wallet.activity.title")}</Text>
        {recent.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{T("wallet.activity.none")}</Text>
            <Text style={styles.emptyBody}>
              Payments you send and receive show up here, newest first, with the
              mint and the fee for each one.
            </Text>
          </View>
        ) : (
          <View style={styles.historyCard}>
            {visibleActivity.map((tx, index) => (
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
                      isCredit(tx) ? styles.historyCredit : styles.historyDebit,
                    ]}
                  >
                    {isCredit(tx) ? "+" : "−"}
                    {tx.amount.toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
            {recent.length > ACTIVITY_COLLAPSED_COUNT && (
              <>
                <View style={styles.historyDivider} />
                <Pressable
                  style={styles.historyMoreRow}
                  onPress={() => setShowAllActivity((v) => !v)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: showAllActivity }}
                  accessibilityLabel={
                    showAllActivity
                      ? T("wallet.activity.show_fewer")
                      : `Show ${String(recent.length - ACTIVITY_COLLAPSED_COUNT)} more payments`
                  }
                >
                  <Text style={styles.historyMoreText}>
                    {showAllActivity
                      ? T("wallet.activity.show_less")
                      : `Show ${String(recent.length - ACTIVITY_COLLAPSED_COUNT)} more`}
                  </Text>
                  <Feather
                    name={showAllActivity ? "chevron-up" : "chevron-down"}
                    size={14}
                    color={Colors.textMuted}
                  />
                </Pressable>
              </>
            )}
          </View>
        )}
      </View>

      {/* What each header action does, and whether it needs internet. */}
      <View style={styles.section}>
        <View style={styles.infoPanel}>
          {[
            {
              icon: "help-circle" as const,
              title: T("wallet.explain.title"),
              body: T("wallet.explain.intro"),
            },
            {
              icon: "arrow-up" as const,
              title: T("wallet.explain.send"),
              body: T("wallet.explain.send_desc"),
            },
            {
              icon: "arrow-down" as const,
              title: T("wallet.explain.receive"),
              body: T("wallet.explain.receive_desc"),
            },
            {
              icon: "zap" as const,
              title: T("wallet.explain.zap"),
              body: T("wallet.explain.zap_desc"),
            },
            {
              icon: "plus" as const,
              title: T("wallet.mint.add_short"),
              body: T("wallet.explain.add_mint_desc"),
            },
            {
              icon: "shield" as const,
              title: T("wallet.backup.phrase"),
              body: T("wallet.explain.phrase_desc"),
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
        <Text style={styles.modalTitle}>{T("wallet.receive.title")}</Text>
        <Text style={styles.modalSubtitle}>
          Paste a Cashu token. Online it is redeemed at the mint straight away;
          offline it is stored and confirmed the next time you refresh.
        </Text>
        {myNpub !== null && (
          <Pressable
            style={styles.npubRow}
            onPress={() => {
              void Clipboard.setStringAsync(myNpub);
              showAlert(T("common.copied"), t("wallet.nostr.copied_body"));
            }}
            accessibilityRole="button"
            accessibilityLabel={T("wallet.nostr.copy_key")}
          >
            <View style={styles.npubText}>
              <Text style={styles.npubLabel}>{T("wallet.nostr.your_key")}</Text>
              <Text style={styles.npubValue} numberOfLines={1}>
                {myNpub}
              </Text>
            </View>
            <Feather name="copy" size={16} color={Colors.accent} />
          </Pressable>
        )}
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
        <Pressable
          style={styles.generatedActionBtn}
          onPress={() => openScanner("token")}
          accessibilityRole="button"
          accessibilityLabel={T("wallet.receive.scan")}
        >
          <Feather name="camera" size={18} color={Colors.accent} />
          <Text style={styles.generatedActionText}>
            {T("wallet.receive.scan_short")}
          </Text>
        </Pressable>
        <SheetActions
          styles={styles}
          confirmLabel={
            busy === "receive"
              ? T("wallet.receive.receiving")
              : T("wallet.explain.receive")
          }
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
        <Text style={styles.modalTitle}>{T("wallet.send.title")}</Text>
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
          placeholder={T("wallet.send.memo")}
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="sentences"
          selectionColor={Colors.accent}
        />
        <SheetActions
          styles={styles}
          confirmLabel={
            busy === "send" ? T("wallet.send.building") : T("wallet.send.build")
          }
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
        <Text style={styles.modalTitle}>{T("wallet.zap.title")}</Text>
        <Text style={styles.modalSubtitle}>
          If they publish NIP-61 nutzap info, the ecash is locked to their key
          so nobody else can spend it. If not, it goes as an encrypted DM
          instead and you will be told which happened.
        </Text>
        {zapContacts.length > 0 && (
          <View style={styles.zapContacts}>
            {zapContacts.map((contact) => {
              const hex = contact.nostrPubkeyHex;
              if (hex === undefined) return null;
              const selected = zapNpub === hex;
              return (
                <Pressable
                  key={contact.peerID}
                  style={[
                    styles.zapContactChip,
                    selected && styles.zapContactChipOn,
                  ]}
                  onPress={() => setZapNpub(selected ? "" : hex)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Zap ${contact.nickname}`}
                >
                  <Text
                    style={[
                      styles.zapContactText,
                      selected && styles.zapContactTextOn,
                    ]}
                    numberOfLines={1}
                  >
                    {contact.nickname}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
        <TextInput
          style={styles.tokenInput}
          value={zapNpub}
          onChangeText={setZapNpub}
          placeholder={T("wallet.zap.pubkey_placeholder")}
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
          placeholder={T("wallet.zap.note")}
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="sentences"
          selectionColor={Colors.accent}
        />
        <SheetActions
          styles={styles}
          confirmLabel={
            busy === "zap" ? T("wallet.zap.sending") : T("wallet.explain.zap")
          }
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
        <Text style={styles.modalTitle}>{T("wallet.explain.add_mint")}</Text>
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
          confirmLabel={
            busy === "addMint" ? T("wallet.mint.checking") : T("common.add")
          }
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
        {/* A QR rather than the raw string: nobody reads 400 characters of
            base64, and this is the one form every Cashu wallet can take. Falls
            back to the text for a token too large to encode, which needs an
            unusually fragmented balance. */}
        {pending !== null && canEncodeTokenQr(pending.token) ? (
          <View style={styles.qrFrame}>
            <QRCode
              value={tokenQrPayload(pending.token)}
              size={qrSize}
              ecl={TOKEN_QR_ERROR_CORRECTION}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          </View>
        ) : (
          <>
            <View style={styles.readonlyValueBox}>
              <Text
                style={styles.readonlyValue}
                selectable
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {pending?.token ?? ""}
              </Text>
            </View>
            <Text style={styles.generatedHint}>
              This token is split across too many coins to fit in a QR code.
              Share or copy it instead, or refresh at the mint to consolidate.
            </Text>
          </>
        )}
        <Text style={styles.generatedHint}>
          Whoever holds this string owns the money. The proofs are reserved, not
          spent: if it never reaches anyone you can reclaim them under Pending.
        </Text>
        <View style={styles.generatedActions}>
          <Pressable
            style={styles.generatedActionBtn}
            onPress={() => pending && void handleCopyToken(pending.token)}
            accessibilityRole="button"
            accessibilityLabel={T("wallet.send.copy_token")}
          >
            <Feather name="copy" size={18} color={Colors.accent} />
            <Text style={styles.generatedActionText}>{T("common.copy")}</Text>
          </Pressable>
          <Pressable
            style={styles.generatedActionBtn}
            onPress={() => pending && handleShareToken(pending.token)}
            accessibilityRole="button"
            accessibilityLabel={T("wallet.send.share_token")}
          >
            <Feather name="share-2" size={18} color={Colors.accent} />
            <Text style={styles.generatedActionText}>{T("common.share")}</Text>
          </Pressable>
          <Pressable
            style={styles.generatedActionBtn}
            onPress={() => setShowPeerPicker(true)}
            accessibilityRole="button"
            accessibilityLabel={T("wallet.send.to_peer")}
          >
            <Feather name="radio" size={18} color={Colors.accent} />
            <Text style={styles.generatedActionText}>
              {T("wallet.send.to_peer_short")}
            </Text>
          </Pressable>
        </View>
        <View style={styles.modalActions}>
          <Pressable
            style={styles.modalConfirm}
            onPress={() => pending && markDelivered(pending.txId)}
            accessibilityRole="button"
            accessibilityLabel={T("wallet.send.mark_delivered")}
          >
            <Text style={styles.modalConfirmText}>
              {T("wallet.send.they_got_it")}
            </Text>
          </Pressable>
          <Pressable
            style={styles.modalCancel}
            onPress={() => setPending(null)}
            accessibilityRole="button"
            accessibilityLabel={T("wallet.send.keep_pending")}
          >
            <Text style={styles.modalCancelText}>
              {T("wallet.send.decide_later")}
            </Text>
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
        <Text style={styles.modalTitle}>{T("wallet.ln.deposit_title")}</Text>
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
              placeholder={T("wallet.ln.amount_placeholder")}
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              selectionColor={Colors.accent}
            />
            <MintPicker
              styles={styles}
              Colors={Colors}
              label={T("wallet.mint.issued_by")}
              options={mintList.map((m) => ({
                mintUrl: m.url,
                sub: m.name ?? hostOf(m.url),
              }))}
              selected={activeMint}
              onSelect={setActiveMint}
            />
            <SheetActions
              styles={styles}
              confirmLabel={
                busy === "deposit"
                  ? T("wallet.ln.requesting")
                  : T("wallet.ln.get_invoice")
              }
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
            {/* bolt11 is bech32, so the all-uppercase form is equivalent and
                encodes in the QR alphanumeric mode: same invoice, denser code,
                easier scan. Length is checked so an unusually long invoice
                degrades to the text field instead of throwing. */}
            {deposit.invoice.length <= TOKEN_QR_MAX_CHARS && (
              <View style={styles.qrFrame}>
                <QRCode
                  value={deposit.invoice.toUpperCase()}
                  size={qrSize}
                  ecl={TOKEN_QR_ERROR_CORRECTION}
                  backgroundColor="#FFFFFF"
                  color="#000000"
                />
              </View>
            )}
            {/* Head first, truncated at the end: the `lnbc` prefix and the
                amount are the only part of an invoice a person can check by
                eye, and Copy sits right below for the rest. */}
            <View style={styles.readonlyValueBox}>
              <Text
                style={styles.readonlyValue}
                selectable
                numberOfLines={4}
                ellipsizeMode="tail"
              >
                {deposit.invoice}
              </Text>
            </View>
            <View style={styles.generatedActions}>
              <Pressable
                style={styles.generatedActionBtn}
                onPress={() => void Clipboard.setStringAsync(deposit.invoice)}
                accessibilityRole="button"
                accessibilityLabel={T("wallet.ln.copy_invoice")}
              >
                <Feather name="copy" size={18} color={Colors.accent} />
                <Text style={styles.generatedActionText}>
                  {T("wallet.ln.copy_invoice")}
                </Text>
              </Pressable>
              <Pressable
                style={styles.generatedActionBtn}
                onPress={() =>
                  void Share.share({ message: `lightning:${deposit.invoice}` })
                }
                accessibilityRole="button"
                accessibilityLabel={T("wallet.ln.open_wallet")}
              >
                <Feather name="external-link" size={18} color={Colors.accent} />
                <Text style={styles.generatedActionText}>
                  {T("wallet.ln.open_wallet_short")}
                </Text>
              </Pressable>
            </View>
            {depositExpired ? (
              <View style={styles.waitingRow}>
                <Feather name="clock" size={16} color={Colors.textMuted} />
                <Text style={styles.waitingText}>
                  This invoice expired. If you already paid it, the balance is
                  credited automatically.
                </Text>
              </View>
            ) : (
              <View style={styles.waitingRow}>
                <ActivityIndicator size="small" color={Colors.textMuted} />
                <Text style={styles.waitingText}>
                  {depositExpiresAtMs === undefined
                    ? T("wallet.ln.waiting")
                    : `Waiting for payment · expires in ${formatCountdown(
                        depositExpiresAtMs - depositClock,
                      )}`}
                </Text>
              </View>
            )}
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => setShowDeposit(false)}
                accessibilityRole="button"
                accessibilityLabel={T("common.close")}
              >
                <Text style={styles.modalCancelText}>{T("common.close")}</Text>
              </Pressable>
              {depositExpired && (
                <Pressable
                  style={styles.modalConfirm}
                  disabled={busy !== null}
                  onPress={() => {
                    setDeposit(null);
                    void handleCreateDeposit();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={T("wallet.ln.new_invoice")}
                >
                  <Text style={styles.modalConfirmText}>
                    {T("wallet.ln.new_invoice_short")}
                  </Text>
                </Pressable>
              )}
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
        <Text style={styles.modalTitle}>{T("wallet.ln.withdraw_title")}</Text>
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
        <Pressable
          style={styles.generatedActionBtn}
          onPress={() => openScanner("invoice")}
          accessibilityRole="button"
          accessibilityLabel={T("wallet.ln.scan_invoice")}
        >
          <Feather name="camera" size={18} color={Colors.accent} />
          <Text style={styles.generatedActionText}>
            {T("wallet.receive.scan_short")}
          </Text>
        </Pressable>
        <MintPicker
          styles={styles}
          Colors={Colors}
          label={T("wallet.ln.paid_from")}
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
              label={T("wallet.ln.invoice")}
              value={`${withdrawQuote.amount.toLocaleString()} ${withdrawQuote.unit}`}
            />
            <QuoteRow
              styles={styles}
              label={T("wallet.ln.routing_reserve")}
              value={`up to ${withdrawQuote.feeReserve.toLocaleString()} ${withdrawQuote.unit}`}
            />
            <QuoteRow
              styles={styles}
              label={T("wallet.ln.reserved")}
              value={`${withdrawQuote.total.toLocaleString()} ${withdrawQuote.unit}`}
            />
          </View>
        )}
        <SheetActions
          styles={styles}
          confirmLabel={
            withdrawQuote
              ? busy === "withdrawPay"
                ? T("wallet.ln.paying")
                : `Pay ${withdrawQuote.amount.toLocaleString()} ${withdrawQuote.unit}`
              : busy === "withdrawQuote"
                ? T("wallet.mint.checking")
                : T("wallet.ln.get_quote")
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
            <Text style={styles.modalTitle}>
              {T("wallet.backup.setup_title")}
            </Text>
            <Text style={styles.modalSubtitle}>
              You are about to see twelve words. They are the money.
            </Text>
            {[
              T("wallet.backup.warn_secret"),
              T("wallet.backup.warn_paper"),
              T("wallet.backup.warn_scope"),
              T("wallet.backup.warn_mints"),
            ].map((line) => (
              <View key={line} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{line}</Text>
              </View>
            ))}
            <SheetActions
              styles={styles}
              confirmLabel={
                busy === "backup"
                  ? T("wallet.backup.preparing")
                  : T("wallet.backup.show_phrase")
              }
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
                ? T("wallet.backup.your_phrase")
                : T("wallet.backup.write_down")}
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
              accessibilityLabel={T("wallet.backup.copy_phrase")}
            >
              <Feather name="copy" size={18} color={Colors.accent} />
              <Text style={styles.generatedActionText}>
                {T("wallet.backup.copy_clipboard")}
              </Text>
            </Pressable>
            {backupStep === "show" ? (
              <SheetActions
                styles={styles}
                confirmLabel={T("wallet.backup.written_down")}
                confirmDisabled={false}
                onConfirm={() => setBackupStep("verify")}
                onCancel={closeBackupSheet}
              />
            ) : (
              <Pressable style={styles.modalCancel} onPress={closeBackupSheet}>
                <Text style={styles.modalCancelText}>{T("common.done")}</Text>
              </Pressable>
            )}
          </>
        )}

        {backupStep === "verify" && (
          <>
            <Text style={styles.modalTitle}>
              {T("wallet.backup.check_copy")}
            </Text>
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
              confirmLabel={T("wallet.backup.confirm")}
              confirmDisabled={
                verifyPositionList.some(
                  (p) => (verifyAnswers[p] ?? "").trim().length === 0,
                ) || busy !== null
              }
              onConfirm={handleVerifyPhrase}
              onCancel={() => setBackupStep("show")}
              cancelLabel={T("common.back")}
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
        <Text style={styles.modalTitle}>
          {T("wallet.backup.restore_title")}
        </Text>
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
              placeholder={T("wallet.backup.phrase_placeholder")}
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
                ? T("wallet.backup.no_mints_yet")
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
              confirmLabel={
                busy === "restore"
                  ? T("wallet.backup.scanning")
                  : T("wallet.backup.restore_short")
              }
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
                ? TP("wallet.backup.recovered", restoreResult.proofCount, {
                    mints: restoreResult.mintsScanned.map(hostOf).join(", "),
                  })
                : T("wallet.backup.nothing_recovered")}
            </Text>
            {restoreResult.alreadySpent > 0 && (
              <Text style={styles.modalSubtitle}>
                {TP("wallet.backup.already_spent", restoreResult.alreadySpent)}
              </Text>
            )}
            {restoreResult.mintsFailed.length > 0 && (
              <Text style={styles.modalSubtitle}>
                {T("wallet.backup.unreachable_mints", {
                  mints: restoreResult.mintsFailed
                    .map((f) => hostOf(f.mintUrl))
                    .join(", "),
                })}
              </Text>
            )}
            <Pressable
              style={styles.modalCancel}
              onPress={() => {
                setShowRestore(false);
                setRestoreResult(null);
              }}
            >
              <Text style={styles.modalCancelText}>{T("common.done")}</Text>
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
        <Text style={styles.modalTitle}>
          {T("wallet.mint.consolidate_title")}
        </Text>
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
                  {isTarget
                    ? ` ${t("wallet.mint.destination")}`
                    : ` ${t("wallet.mint.will_move")}`}
                </Text>
              </View>
            </Pressable>
          );
        })}
        <SheetActions
          styles={styles}
          confirmLabel={
            busy === "consolidate"
              ? T("wallet.mint.moving")
              : T("wallet.mint.move")
          }
          confirmDisabled={consolidateTarget === null || busy !== null}
          onConfirm={() => void handleConsolidate()}
          onCancel={() => setShowConsolidate(false)}
        />
      </BottomSheet>

      <TokenScanner
        visible={scannerTarget !== null}
        target={scannerTarget ?? "token"}
        onClose={closeScanner}
        onScanned={handleScanned}
      />

      {/* Re-show a pending token as a QR, for handing it over later. */}
      <BottomSheet
        visible={qrToken !== null}
        onClose={() => setQrToken(null)}
        sheetStyle={styles.modalSheet}
      >
        <Text style={styles.modalTitle}>
          {qrToken
            ? `${qrToken.amount.toLocaleString()} ${qrToken.unit}`
            : T("wallet.token")}
        </Text>
        <Text style={styles.modalSubtitle}>
          Have them scan this from their wallet. Still reclaimable until you
          mark it delivered.
        </Text>
        {qrToken?.token !== undefined && canEncodeTokenQr(qrToken.token) ? (
          <View style={styles.qrFrame}>
            <QRCode
              value={tokenQrPayload(qrToken.token)}
              size={qrSize}
              ecl={TOKEN_QR_ERROR_CORRECTION}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          </View>
        ) : (
          <Text style={styles.modalSubtitle}>
            This token is split across too many coins to fit in a QR code. Share
            or copy it instead.
          </Text>
        )}
        <Pressable style={styles.modalCancel} onPress={() => setQrToken(null)}>
          <Text style={styles.modalCancelText}>{T("common.done")}</Text>
        </Pressable>
      </BottomSheet>

      {/* Peer picker for a mesh hand-off */}
      <BottomSheet
        visible={showPeerPicker}
        onClose={() => setShowPeerPicker(false)}
        sheetStyle={styles.modalSheet}
      >
        <Text style={styles.modalTitle}>{T("wallet.send.to_peer_short")}</Text>
        <Text style={styles.modalSubtitle}>
          The token goes out as an encrypted DM over the mesh. No internet
          needed.
        </Text>
        {onlinePeers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{T("wallet.send.no_peers")}</Text>
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
            accessibilityLabel={T("common.cancel")}
          >
            <Text style={styles.modalCancelText}>{T("common.cancel")}</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </ScrollView>
  );
}

// ---- Small presentational pieces --------------------------------------------

type Styles = ReturnType<typeof createStyles>;

// The stacked confirm/cancel pair every sheet in the app uses. The secondary
// label is overridable because a step in the middle of a flow goes back rather
// than out, and "Cancel" there reads as "throw away what I just did".
function SheetActions({
  styles,
  confirmLabel,
  confirmDisabled,
  onConfirm,
  onCancel,
  cancelLabel = t("common.cancel"),
}: {
  styles: Styles;
  confirmLabel: string;
  confirmDisabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  cancelLabel?: string;
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
      <Pressable
        style={styles.modalCancel}
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel={cancelLabel}
      >
        <Text style={styles.modalCancelText}>{cancelLabel}</Text>
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
      return tx.status === "pending"
        ? t("wallet.activity.received_unconfirmed")
        : t("wallet.activity.received");
    case "send":
      return tx.status === "reclaimed"
        ? t("wallet.activity.send_reclaimed")
        : t("wallet.activity.sent");
    case "mint":
      return t("wallet.activity.ln_deposit");
    case "melt":
      return t("wallet.activity.ln_withdrawal");
    case "nutzap-in":
      return t("wallet.activity.nutzap_received");
    case "nutzap-out":
      return t("wallet.zap.sent");
    case "swap":
      return tx.status === "failed"
        ? t("wallet.activity.spent_removed")
        : t("wallet.activity.refreshed");
  }
}

function relativeTime(ms: number): string {
  const delta = Date.now() - ms;
  if (delta < 60_000) return t("wallet.activity.just_now");
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 60) return `${String(minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${String(hours)}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${String(days)}d ago`;
  return new Date(ms).toLocaleDateString();
}

// Whole seconds under a minute, m:ss above it. Never negative: the expired
// branch takes over at zero, but a clock that ticks past the deadline between
// renders should not flash "-1s".
function formatCountdown(remainingMs: number): string {
  const total = Math.max(0, Math.ceil(remainingMs / 1000));
  if (total < 60) return `${total}s`;
  return `${Math.floor(total / 60)}m ${String(total % 60).padStart(2, "0")}s`;
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
    // The five pending-send actions (QR, Copy, Share, Delivered, Reclaim) were
    // the smallest targets in the app: 4pt of padding around 13pt of text made
    // each one ~21pt tall, in a tight horizontal row, and one of them moves
    // money back into the balance. They sit in a flexWrap row, so giving them a
    // real height costs a wrap on a narrow screen and nothing else.
    pendingBtn: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      minHeight: MIN_TOUCH,
      justifyContent: "center",
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
      minHeight: MIN_TOUCH,
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
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    mintInfo: {
      flexShrink: 1,
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
    npubRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.lg,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    npubText: {
      flex: 1,
      gap: 1,
    },
    npubLabel: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    npubValue: {
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
      fontFamily: FontFamily.mono,
    },
    zapContacts: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.xs,
    },
    zapContactChip: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    zapContactChipOn: {
      borderColor: Colors.accent,
    },
    zapContactText: {
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
    },
    zapContactTextOn: {
      color: Colors.accent,
      fontWeight: FontWeight.semibold,
    },
    mintActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      marginTop: Spacing.xs,
    },
    iconBtn: {
      width: MINT_ICON_SIZE,
      height: MINT_ICON_SIZE,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    mintNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
    },
    testBadge: {
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: Radius.sm,
      borderWidth: 1,
      borderColor: Colors.borderStrong,
    },
    testBadgeText: {
      fontSize: FontSize["2xs"],
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      letterSpacing: 0.5,
    },
    testNote: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: FontSize.sm * 1.4,
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
      opacity: DISABLED_OPACITY,
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
      minHeight: MIN_TOUCH,
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
      borderColor: Colors.verified,
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
      color: Colors.verified,
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
      borderRadius: Radius.full,
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
      textAlign: textAlignEnd,
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
    // Money leaving is worth reading at a glance, the same way money arriving
    // already was. Failed and reclaimed sends never got here: nothing left.
    historyDebit: {
      color: Colors.danger,
    },
    historyDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
    },
    historyMoreRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      paddingVertical: Spacing.md,
    },
    historyMoreText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.textMuted,
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
    // A long machine string the user reads but never types: a bolt11 invoice, a
    // cashu token. Same box as `tokenInput` so the sheets keep one shape, but a
    // Text and not a disabled TextInput, because on Android `numberOfLines`
    // pins a multiline TextInput to that many lines and then scrolls the
    // overflow to the cursor, which sits at the end of a programmatic value.
    // The box showed the tail of the string with the `lnbc`/`cashuB` head, the
    // part that says what the thing even is, scrolled out of sight above, and
    // left a row of half-glyphs along the top edge that reads as a rendering
    // fault. Text lays out from the top and never scrolls, so the head is
    // always what you see and the ellipsis reads as deliberate. Copy stays the
    // way to get the whole string; nobody transcribes 300 characters by eye.
    readonlyValueBox: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      minHeight: 80,
    },
    readonlyValue: {
      color: Colors.textSecondary,
      fontSize: FontSize.xs,
      fontFamily: FontFamily.mono,
      letterSpacing: 0.3,
      lineHeight: 16,
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
    qrFrame: {
      alignSelf: "center",
      padding: Spacing.base,
      borderRadius: Radius.lg,
      backgroundColor: "#FFFFFF",
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
