// Wallet screen: Cashu ecash balance and proof management.
// Shows total balance, per-mint breakdown, and quick send/receive actions.
// All proofs are stored locally in MMKV; no server or account required.

import { Mint, Wallet } from "@cashu/cashu-ts";
import { Feather } from "@expo/vector-icons";
import { nip19 } from "nostr-tools";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  buildOfflineToken,
  decodeToken,
  selectProofsForAmount,
} from "../../core/payments/cashu";
import { fetchWalletInfo, publishNutzap } from "../../core/payments/nutzap";
import { getMeshService } from "../../services/mesh-service";
import { showAlert } from "../../store/alert-store";
import { useChatStore } from "../../store/chat-store";
import { usePeerStore } from "../../store/peer-store";
import {
  useWalletStore,
  type MintBalance,
  type StoredProof,
} from "../../store/wallet-store";
import Avatar from "../../ui/components/avatar";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";

// The four quick actions, triggered from icon buttons in the App-level
// header (styled to match the Mesh tab's "add contact" pill) rather than
// from a row inside the balance card.
export type WalletAction = "receive" | "send" | "zap" | "addMint";

interface Props {
  // Set together (action + an incrementing counter) when a header icon is
  // tapped, so the right modal opens here, the same fire-once-per-increment
  // pattern used for ChannelList's join modal / PeerList's scanner.
  action?: WalletAction | null;
  actionTrigger?: number;
}

export default function WalletScreen({
  action,
  actionTrigger,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const { proofsByMint, unit, addMint, addProofs, removeProofs, clearMint } =
    useWalletStore();
  // Subscribe to the stable peer map and derive the reachable list locally.
  const peers = usePeerStore((s) => s.peers);
  const [peerClock, setPeerClock] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setPeerClock(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);
  const onlinePeers = useMemo(() => {
    const cutoff = peerClock - 60_000;
    return [...peers.values()].filter((peer) => peer.lastSeenMs >= cutoff);
  }, [peerClock, peers]);
  const [showReceive, setShowReceive] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showZap, setShowZap] = useState(false);
  const [showAddMint, setShowAddMint] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendMemo, setSendMemo] = useState("");
  const [zapNpub, setZapNpub] = useState("");
  const [zapAmount, setZapAmount] = useState("");
  const [zapNote, setZapNote] = useState("");
  const [mintUrlInput, setMintUrlInput] = useState("");
  // Generated token: shown after offline send completes.
  const [generatedToken, setGeneratedToken] = useState<{
    token: string;
    amount: number;
    mintUrl: string;
  } | null>(null);
  const [showGenerated, setShowGenerated] = useState(false);
  // Peer picker: shown when user taps "Send to peer" on a generated token.
  const [showPeerPicker, setShowPeerPicker] = useState(false);
  // Zap status.
  const [isZapping, setIsZapping] = useState(false);

  const prevActionTrigger = useRef(actionTrigger ?? 0);
  useEffect(() => {
    if (
      actionTrigger === undefined ||
      actionTrigger <= prevActionTrigger.current
    ) {
      return;
    }
    prevActionTrigger.current = actionTrigger;
    // Opening a sheet in response to a one-shot command from the parent (a
    // header button press arriving as an incrementing counter). The guard above
    // makes this fire at most once per press, so it cannot cascade. This is an
    // imperative event handoff, not derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (action === "receive") setShowReceive(true);
    else if (action === "send") setShowSend(true);
    else if (action === "zap") setShowZap(true);
    else if (action === "addMint") setShowAddMint(true);
  }, [action, actionTrigger]);

  const mintBalances = useMemo<MintBalance[]>(() => {
    return Object.entries(proofsByMint).map(([mintUrl, proofs]) => ({
      mintUrl,
      unit,
      balance: proofs.reduce((sum, p) => sum + p.amount, 0),
      proofCount: proofs.length,
    }));
  }, [proofsByMint, unit]);

  const totalSats = mintBalances.reduce((sum, m) => sum + m.balance, 0);

  function shortenMintUrl(url: string): string {
    try {
      const u = new URL(url);
      return u.hostname;
    } catch {
      return url.slice(0, 24) + "\u2026";
    }
  }

  function handleReceive(): void {
    const raw = tokenInput.trim();
    if (!raw) return;

    // Decode the token using the cashu core module (offline, no network call).
    const info = decodeToken(raw);
    if (!info) {
      showAlert(
        "Invalid token",
        "Could not decode this token. Check that it starts with cashuA or cashuB.",
      );
      return;
    }

    // Convert cashu-ts Proof objects to our StoredProof schema.
    const stored: StoredProof[] = info.token.proofs.map((p) => ({
      id: p.id,
      amount: p.amount.toNumber(),
      secret: p.secret,
      C: p.C,
      dleq: p.dleq as StoredProof["dleq"],
    }));

    // Register the mint and store proofs (offline, no mint network call).
    // Full redemption (proof swap) must happen when the user has internet access.
    addMint(info.mintUrl);
    addProofs(info.mintUrl, stored);

    setShowReceive(false);
    setTokenInput("");
    showAlert(
      `+${info.amount.toLocaleString()} ${info.unit}`,
      `Proofs stored from ${info.mintUrl.replace(/https?:\/\//, "")}.` +
        (info.memo ? `\n\n"${info.memo}"` : "") +
        "\n\nRedemption at the mint is required to confirm they are unspent.",
    );
  }

  function handleSend(): void {
    const amount = parseInt(sendAmount, 10);
    if (!amount || amount <= 0) return;

    if (amount > totalSats) {
      showAlert(
        "Insufficient balance",
        `You have ${totalSats.toLocaleString()} sats but tried to send ${amount.toLocaleString()} sats.`,
      );
      return;
    }

    // Find the first mint that can cover the full amount.
    const mintEntry = Object.entries(proofsByMint)
      .map(([url, ps]) => ({
        url,
        ps,
        balance: ps.reduce((s, p) => s + p.amount, 0),
      }))
      .find((m) => m.balance >= amount);

    if (!mintEntry) {
      showAlert(
        "Balance split across mints",
        "No single mint holds the full amount. Consolidate proofs at one mint first.",
      );
      return;
    }

    const selection = selectProofsForAmount(mintEntry.ps, amount);
    if (!selection) return;

    const finalize = (): void => {
      // Build the token offline (pure serialization, no network call).
      const tokenStr = buildOfflineToken(
        mintEntry.url,
        selection.selected,
        unit,
        sendMemo.trim() || undefined,
      );

      // Remove the spent proofs from local storage immediately.
      removeProofs(
        mintEntry.url,
        selection.selected.map((p) => p.secret),
      );

      setShowSend(false);
      setSendAmount("");
      setSendMemo("");
      setGeneratedToken({
        token: tokenStr,
        amount: selection.total,
        mintUrl: mintEntry.url,
      });
      setShowGenerated(true);
    };

    // No exact denomination match: the token would carry more than the user
    // asked for, and offline there is no way to get change back. Never spend
    // the difference silently, so make it an explicit decision.
    if (!selection.exact) {
      showAlert(
        "Can't send that exact amount",
        `Your proofs can't make exactly ${amount} ${unit} offline. The smallest token you can send is ${selection.total} ${unit}, and the extra ${selection.total - amount} ${unit} goes to the recipient and can't be recovered without swapping at the mint first.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: `Send ${selection.total} ${unit}`,
            style: "destructive",
            onPress: finalize,
          },
        ],
      );
      return;
    }

    finalize();
  }

  async function handleZapConfirm(): Promise<void> {
    const npubRaw = zapNpub.trim();
    const amount = parseInt(zapAmount, 10);
    if (!npubRaw || !amount || amount <= 0) return;

    if (amount > totalSats) {
      showAlert(
        "Insufficient balance",
        `You have ${totalSats.toLocaleString()} sats but tried to zap ${amount.toLocaleString()} sats.`,
      );
      return;
    }

    // Decode npub or accept bare hex.
    let recipientPubkey: string;
    try {
      if (npubRaw.startsWith("npub")) {
        const decoded = nip19.decode(npubRaw);
        if (decoded.type !== "npub") throw new Error("not npub");
        recipientPubkey = decoded.data;
      } else {
        recipientPubkey = npubRaw;
      }
    } catch {
      showAlert(
        "Invalid pubkey",
        "Enter a valid npub1\u2026 or 64-char hex pubkey.",
      );
      return;
    }

    setIsZapping(true);
    setShowZap(false);

    const service = getMeshService();
    const nostrClient = service?.getNostrClient() ?? null;

    // Build an offline token to send regardless of Nostr connectivity.
    const mintEntry = Object.entries(proofsByMint)
      .map(([url, ps]) => ({
        url,
        ps,
        balance: ps.reduce((s, p) => s + p.amount, 0),
      }))
      .find((m) => m.balance >= amount);

    if (!mintEntry) {
      setIsZapping(false);
      showAlert(
        "Balance split across mints",
        "No single mint holds the full amount.",
      );
      return;
    }

    const selection = selectProofsForAmount(mintEntry.ps, amount);
    if (!selection) {
      setIsZapping(false);
      return;
    }

    // Try NIP-61 nutzap (online path) if we have Nostr connectivity.
    if (nostrClient) {
      try {
        const walletInfo = await fetchWalletInfo(recipientPubkey, nostrClient);

        if (walletInfo) {
          // Full NIP-61: swap proofs for P2PK-locked ones at recipient's mint.
          const targetMintUrl =
            walletInfo.mintUrls.find((u) =>
              Object.keys(proofsByMint).includes(u),
            ) ?? walletInfo.mintUrls[0];

          try {
            const cashuMint = new Mint(targetMintUrl);
            const cashuWallet = new Wallet(cashuMint, { unit });
            await cashuWallet.loadMint();

            // Re-select proofs compatible with this mint if needed.
            const mintProofs = proofsByMint[targetMintUrl] ?? [];
            const mintSelection = selectProofsForAmount(mintProofs, amount);

            if (mintSelection) {
              const { keep, send: lockedProofs } = await cashuWallet.send(
                amount,
                mintSelection.selected,
                undefined,
                // P2PK output: locked to recipient's declared pubkey.
                {
                  send: {
                    type: "p2pk",
                    pubkey: walletInfo.p2pkPubkey,
                  } as unknown as import("@cashu/cashu-ts").OutputType,
                },
              );

              // Store change proofs.
              removeProofs(
                targetMintUrl,
                mintSelection.selected.map((p) => p.secret),
              );
              if (keep.length > 0) {
                addProofs(
                  targetMintUrl,
                  keep.map((p) => ({
                    id: p.id,
                    amount: p.amount.toNumber(),
                    secret: p.secret,
                    C: p.C,
                  })),
                );
              }

              const nostrPrivKey = service!.getNostrPrivKey();
              await publishNutzap(
                lockedProofs,
                targetMintUrl,
                unit,
                recipientPubkey,
                nostrPrivKey,
                nostrClient,
                zapNote.trim() || undefined,
              );

              setIsZapping(false);
              setZapNpub("");
              setZapAmount("");
              setZapNote("");
              showAlert(
                "Nutzap sent",
                `${amount.toLocaleString()} sats sent to ${npubRaw.slice(0, 20)}\u2026`,
              );
              return;
            }
          } catch (mintErr) {
            // Mint swap failed; fall through to offline token via Nostr DM.
            void mintErr;
          }
        }

        // Fallback: send unlocked offline token via Nostr gift-wrap DM.
        const tokenStr = buildOfflineToken(
          mintEntry.url,
          selection.selected,
          unit,
          zapNote.trim() || `${amount} sats`,
        );
        removeProofs(
          mintEntry.url,
          selection.selected.map((p) => p.secret),
        );

        const nostrPrivKey = service!.getNostrPrivKey();
        const { event } = await import("../../core/nostr/gift-wrap").then((m) =>
          m.wrapDm(tokenStr, nostrPrivKey, recipientPubkey),
        );
        await nostrClient.publish(event);

        setIsZapping(false);
        setZapNpub("");
        setZapAmount("");
        setZapNote("");
        showAlert(
          "Token sent via Nostr",
          `${amount.toLocaleString()} sats sent to ${npubRaw.slice(0, 20)}\u2026 as an encrypted Cashu token.`,
        );
        return;
      } catch (e) {
        void e;
        // Nostr send failed: fall through to manual token.
      }
    }

    // No Nostr connectivity: build token for manual sharing.
    const tokenStr = buildOfflineToken(
      mintEntry.url,
      selection.selected,
      unit,
      zapNote.trim() || undefined,
    );
    removeProofs(
      mintEntry.url,
      selection.selected.map((p) => p.secret),
    );
    setIsZapping(false);
    setZapNpub("");
    setZapAmount("");
    setZapNote("");
    setGeneratedToken({
      token: tokenStr,
      amount: selection.total,
      mintUrl: mintEntry.url,
    });
    setShowGenerated(true);
  }

  async function handleRedeem(mintUrl: string): Promise<void> {
    const mintProofs = proofsByMint[mintUrl];
    if (!mintProofs || mintProofs.length === 0) {
      showAlert("Nothing to redeem", "This mint has no proofs stored.");
      return;
    }

    try {
      const cashuMint = new Mint(mintUrl);
      const cashuWallet = new Wallet(cashuMint, { unit });
      await cashuWallet.loadMint();

      // Build the full token from existing proofs and redeem (swap) them.
      const tokenStr = buildOfflineToken(mintUrl, mintProofs, unit);
      const newProofs = await cashuWallet.receive(tokenStr);

      // Replace old proofs with freshly swapped ones.
      removeProofs(
        mintUrl,
        mintProofs.map((p) => p.secret),
      );
      addProofs(
        mintUrl,
        newProofs.map((p) => ({
          id: p.id,
          amount: p.amount.toNumber(),
          secret: p.secret,
          C: p.C,
        })),
      );
      showAlert(
        "Redeemed",
        `Proofs refreshed at ${mintUrl.replace(/https?:\/\//, "")}.`,
      );
    } catch (err) {
      showAlert(
        "Redemption failed",
        `Could not reach the mint. Make sure you have internet access.\n\n${String(err)}`,
      );
    }
  }

  function handleAddMintConfirm(): void {
    const raw = mintUrlInput.trim();
    if (!raw) return;

    // Basic URL validation: must be http(s). Also strip trailing slash so that
    // "https://mint.example.com/" and "https://mint.example.com" are the same mint.
    let url: string;
    try {
      const parsed = new URL(raw);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        showAlert(
          "Invalid URL",
          "Mint URL must start with http:// or https://",
        );
        return;
      }
      // Normalise: remove trailing slash from pathname.
      parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";
      url = parsed.toString().replace(/\/$/, "");
    } catch {
      showAlert("Invalid URL", "Please enter a valid mint URL.");
      return;
    }

    addMint(url);
    setShowAddMint(false);
    setMintUrlInput("");
  }

  function handleSendTokenToPeer(peerID: string): void {
    if (!generatedToken) return;
    const service = getMeshService();
    if (!service) {
      showAlert("Mesh offline", "Mesh service is not running.");
      return;
    }
    const localPeerID = service.getPeerID();
    const channel = `dm:${peerID}`;
    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      // eslint-disable-next-line react-hooks/purity
      id: `wallet-${peerID}-${Date.now()}`,
      channel,
      senderID: localPeerID,
      senderNickname: "You",
      text: generatedToken.token,
      // eslint-disable-next-line react-hooks/purity
      timestampMs: Date.now(),
      isMine: true,
    });
    service.sendDm(peerID, generatedToken.token);
    setShowPeerPicker(false);
    setShowGenerated(false);
    setGeneratedToken(null);
    showAlert(
      "Token sent",
      `${generatedToken.amount} sats sent. Open the Chats tab to see the message.`,
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Balance section */}
      <View style={styles.section}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>
              {totalSats.toLocaleString()}
            </Text>
            <Text style={styles.balanceUnit}>sats</Text>
          </View>
          <Text style={styles.balanceSubtitle}>
            {mintBalances.length} mint{mintBalances.length !== 1 ? "s" : ""}
            {"\u2009\u00b7\u2009"}
            {mintBalances.reduce((s, m) => s + m.proofCount, 0)} proofs
          </Text>
        </View>
      </View>

      {/* Mint balances */}
      <View style={styles.section}>
        {mintBalances.length === 0 ? (
          <View style={styles.emptyMints}>
            <Text style={styles.emptyMintsText}>No mints added yet.</Text>
            <Text style={styles.emptyMintsSubtext}>
              Receive a Cashu token to automatically add a mint.
            </Text>
          </View>
        ) : (
          mintBalances.map((m) => (
            <Pressable
              key={m.mintUrl}
              style={styles.mintRow}
              onLongPress={() => {
                const hasBalance = m.balance > 0;
                showAlert(
                  hasBalance ? "Remove mint (has balance)" : "Remove mint",
                  hasBalance
                    ? `${shortenMintUrl(m.mintUrl)} has ${m.balance.toLocaleString()} sats in ${m.proofCount} proof${m.proofCount !== 1 ? "s" : ""}. Removing it deletes those proofs permanently. Transfer or redeem first.`
                    : `Remove ${shortenMintUrl(m.mintUrl)} from your wallet?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: hasBalance ? "Remove anyway" : "Remove",
                      style: "destructive",
                      onPress: () => clearMint(m.mintUrl),
                    },
                  ],
                );
              }}
              accessibilityRole="button"
              accessibilityLabel={`${shortenMintUrl(m.mintUrl)}, ${m.balance.toLocaleString()} sats. Long press to remove.`}
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
                    {shortenMintUrl(m.mintUrl)}
                  </Text>
                  <Text style={styles.mintProofs}>
                    {m.proofCount} proof{m.proofCount !== 1 ? "s" : ""}
                  </Text>
                </View>
              </View>
              <View style={styles.mintRight}>
                <Text style={styles.mintBalance}>
                  {m.balance.toLocaleString()}
                </Text>
                <Text style={styles.mintUnit}>sats</Text>
                {/* Refresh proofs at mint: confirms they are unspent. */}
                <Pressable
                  style={styles.redeemBtn}
                  onPress={() => void handleRedeem(m.mintUrl)}
                  accessibilityRole="button"
                  accessibilityLabel={`Refresh proofs at ${shortenMintUrl(m.mintUrl)}`}
                >
                  <Text style={styles.redeemBtnText}>Refresh</Text>
                </Pressable>
              </View>
            </Pressable>
          ))
        )}
      </View>

      {/* About: what ecash is, then one row per header action. The four icons
          sit in the App-level header with no labels, so this is where they are
          named and where each one states whether it needs internet. */}
      <View style={styles.section}>
        {/* Info panel */}
        <View style={styles.infoPanel}>
          <View style={styles.infoPanelRow}>
            <Feather
              name="help-circle"
              size={16}
              color={Colors.textMuted}
              style={styles.infoPanelIcon}
            />
            <View style={styles.infoPanelText}>
              <Text style={styles.infoPanelTitle}>What is Cashu?</Text>
              <Text style={styles.infoPanelBody}>
                Cashu is an open ecash protocol for Bitcoin. Tokens are
                cryptographic bearer instruments. No accounts, no logins, just
                proofs.
              </Text>
            </View>
          </View>
          <View style={styles.infoPanelDivider} />
          <View style={styles.infoPanelRow}>
            <Feather
              name="arrow-up"
              size={16}
              color={Colors.textMuted}
              style={styles.infoPanelIcon}
            />
            <View style={styles.infoPanelText}>
              <Text style={styles.infoPanelTitle}>Send</Text>
              <Text style={styles.infoPanelBody}>
                Turns an amount into a token and hands it to a nearby peer over
                the mesh, or shares it as text. Works offline.
              </Text>
            </View>
          </View>
          <View style={styles.infoPanelDivider} />
          <View style={styles.infoPanelRow}>
            <Feather
              name="arrow-down"
              size={16}
              color={Colors.textMuted}
              style={styles.infoPanelIcon}
            />
            <View style={styles.infoPanelText}>
              <Text style={styles.infoPanelTitle}>Receive</Text>
              <Text style={styles.infoPanelBody}>
                Paste a token to store its proofs on this device. Works offline.
                Refresh at the mint once you are online to confirm they are
                unspent.
              </Text>
            </View>
          </View>
          <View style={styles.infoPanelDivider} />
          <View style={styles.infoPanelRow}>
            <Feather
              name="zap"
              size={16}
              color={Colors.textMuted}
              style={styles.infoPanelIcon}
            />
            <View style={styles.infoPanelText}>
              <Text style={styles.infoPanelTitle}>Zap</Text>
              <Text style={styles.infoPanelBody}>
                Sends sats to a Nostr contact by npub. Needs internet, since it
                is delivered over relays.
              </Text>
            </View>
          </View>
          <View style={styles.infoPanelDivider} />
          <View style={styles.infoPanelRow}>
            <Feather
              name="plus"
              size={16}
              color={Colors.textMuted}
              style={styles.infoPanelIcon}
            />
            <View style={styles.infoPanelText}>
              <Text style={styles.infoPanelTitle}>Add mint</Text>
              <Text style={styles.infoPanelBody}>
                Saves the mint that issues and redeems your tokens. Saving is
                offline. Redeeming and Lightning cash-out need internet.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Receive modal */}
      <Modal
        visible={showReceive}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReceive(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowReceive(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Receive ecash</Text>
            <Text style={styles.modalSubtitle}>
              Paste a Cashu token to add proofs to your wallet.
            </Text>
            <TextInput
              style={styles.tokenInput}
              value={tokenInput}
              onChangeText={setTokenInput}
              placeholder="cashuAeyJ0..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor={Colors.accent}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[
                  styles.modalConfirm,
                  !tokenInput.trim() && styles.modalConfirmDisabled,
                ]}
                onPress={handleReceive}
                disabled={!tokenInput.trim()}
              >
                <Text style={styles.modalConfirmText}>Receive</Text>
              </Pressable>
              <Pressable
                style={styles.modalCancel}
                onPress={() => setShowReceive(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Send modal */}
      <Modal
        visible={showSend}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSend(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowSend(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Send ecash</Text>
            <Text style={styles.modalSubtitle}>
              Token is built offline from your proofs. No mint connection
              needed. Share it in a DM or paste it anywhere.
            </Text>
            <TextInput
              style={styles.tokenInput}
              value={sendAmount}
              onChangeText={setSendAmount}
              placeholder="Amount in sats"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              returnKeyType="next"
              selectionColor={Colors.accent}
            />
            <TextInput
              style={[styles.tokenInput, styles.tokenInputCompact]}
              value={sendMemo}
              onChangeText={setSendMemo}
              placeholder="Memo (optional)"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="sentences"
              selectionColor={Colors.accent}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[
                  styles.modalConfirm,
                  !sendAmount.trim() && styles.modalConfirmDisabled,
                ]}
                onPress={handleSend}
                disabled={!sendAmount.trim()}
              >
                <Text style={styles.modalConfirmText}>Generate token</Text>
              </Pressable>
              <Pressable
                style={styles.modalCancel}
                onPress={() => {
                  setShowSend(false);
                  setSendAmount("");
                  setSendMemo("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Zap modal */}
      <Modal
        visible={showZap}
        transparent
        animationType="slide"
        onRequestClose={() => setShowZap(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowZap(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Nutzap</Text>
            <Text style={styles.modalSubtitle}>
              Send ecash to any Nostr contact via NIP-61. Requires internet
              connectivity to publish the zap event.
            </Text>
            <TextInput
              style={styles.tokenInput}
              value={zapNpub}
              onChangeText={setZapNpub}
              placeholder="npub1... or hex pubkey"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor={Colors.accent}
            />
            <TextInput
              style={[styles.tokenInput, styles.tokenInputCompact]}
              value={zapAmount}
              onChangeText={setZapAmount}
              placeholder="Amount in sats"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              returnKeyType="next"
              selectionColor={Colors.accent}
            />
            <TextInput
              style={[styles.tokenInput, styles.tokenInputCompact]}
              value={zapNote}
              onChangeText={setZapNote}
              placeholder="Note (optional)"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="sentences"
              selectionColor={Colors.accent}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[
                  styles.modalConfirm,
                  (!zapNpub.trim() || !zapAmount.trim() || isZapping) &&
                    styles.modalConfirmDisabled,
                ]}
                onPress={() => void handleZapConfirm()}
                disabled={!zapNpub.trim() || !zapAmount.trim() || isZapping}
              >
                <Text style={styles.modalConfirmText}>
                  {isZapping ? "Sending…" : "Zap"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.modalCancel}
                onPress={() => {
                  setShowZap(false);
                  setZapNpub("");
                  setZapAmount("");
                  setZapNote("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add mint modal */}
      <Modal
        visible={showAddMint}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddMint(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowAddMint(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Add mint</Text>
            <Text style={styles.modalSubtitle}>
              Enter any Cashu-compatible mint URL. Try mint.minibits.cash or run
              your own with Nutshell.
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
            <View style={styles.modalActions}>
              <Pressable
                style={[
                  styles.modalConfirm,
                  !mintUrlInput.trim() && styles.modalConfirmDisabled,
                ]}
                onPress={handleAddMintConfirm}
                disabled={!mintUrlInput.trim()}
              >
                <Text style={styles.modalConfirmText}>Add</Text>
              </Pressable>
              <Pressable
                style={styles.modalCancel}
                onPress={() => {
                  setShowAddMint(false);
                  setMintUrlInput("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Generated token modal: shown after offline send completes. */}
      <Modal
        visible={showGenerated}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenerated(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowGenerated(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.handle} />
            <View style={styles.generatedHeader}>
              <Feather name="check-circle" size={28} color={Colors.online} />
              <View style={styles.generatedAmountRow}>
                <Text style={styles.generatedAmount}>
                  {generatedToken?.amount.toLocaleString()}
                </Text>
                <Text style={styles.generatedUnit}>sats</Text>
              </View>
              <Text style={styles.generatedMint} numberOfLines={1}>
                {generatedToken ? shortenMintUrl(generatedToken.mintUrl) : ""}
              </Text>
            </View>
            <TextInput
              style={[styles.tokenInput, styles.tokenInputMono]}
              value={generatedToken?.token ?? ""}
              editable={false}
              multiline
              numberOfLines={3}
              selectionColor={Colors.accent}
            />
            <Text style={styles.generatedHint}>
              This token is live. Send it quickly. The proofs have been removed
              from your wallet.
            </Text>
            <View style={styles.generatedActions}>
              <Pressable
                style={styles.generatedActionBtn}
                onPress={() => {
                  if (generatedToken) {
                    void Share.share({ message: generatedToken.token });
                  }
                }}
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
                accessibilityLabel="Send token to a mesh peer"
              >
                <Feather name="radio" size={18} color={Colors.accent} />
                <Text style={styles.generatedActionText}>Send to peer</Text>
              </Pressable>
            </View>
            <Pressable
              style={styles.modalCancel}
              onPress={() => {
                setShowGenerated(false);
                setGeneratedToken(null);
              }}
            >
              <Text style={styles.modalCancelText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Peer picker: send the generated token to a nearby mesh peer. */}
      <Modal
        visible={showPeerPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPeerPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowPeerPicker(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Send to peer</Text>
            <Text style={styles.modalSubtitle}>
              Choose a nearby peer to receive the token via DM.
            </Text>
            {onlinePeers.length === 0 ? (
              <View style={styles.emptyMints}>
                <Text style={styles.emptyMintsText}>No peers in range.</Text>
                <Text style={styles.emptyMintsSubtext}>
                  Scan the Mesh tab to find nearby peers.
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
                    <Avatar
                      username={username}
                      peerID={peer.peerID}
                      size={40}
                    />
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
            <Pressable
              style={styles.modalCancel}
              onPress={() => setShowPeerPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
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
      paddingBottom: Spacing["3xl"],
    },
    // Quick actions: bordered pill buttons, matching the profile screen's
    // Share ID / Share QR pills (icon + text side by side). Raised fill
    // (not plain `surface`) so the pill reads against the white card
    // instead of blending into it.
    // Balance card
    balanceCard: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.lg,
      gap: Spacing.md,
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
    balanceSubtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    // Mints section
    section: {
      gap: Spacing.sm,
    },
    emptyMints: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.xl,
      alignItems: "center",
      gap: Spacing.sm,
    },
    emptyMintsText: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    emptyMintsSubtext: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: FontSize.sm * 1.6,
    },
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
    mintProofs: {
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
    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      padding: Spacing.xl,
      gap: Spacing.base,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.borderStrong,
      alignSelf: "center",
      marginBottom: Spacing.xs,
    },
    modalTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    modalSubtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    tokenInput: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.md,
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
      marginTop: Spacing.sm,
    },
    // Stacked full-width pills, primary action on top, the same pattern as
    // every other confirm sheet fixed this session (panic wipe, Tor, etc.).
    modalActions: {
      width: "100%",
      marginTop: Spacing.xs,
    },
    modalCancel: {
      width: "100%",
      minHeight: 50,
      marginTop: Spacing.sm,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    modalCancelText: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    modalConfirm: {
      width: "100%",
      minHeight: 50,
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
    tokenInputMono: {
      fontFamily: FontFamily.mono,
      fontSize: FontSize.xs,
      letterSpacing: 0.3,
    },
    // Redeem button on mint rows.
    redeemBtn: {
      marginTop: 4,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
      borderRadius: Radius.sm,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    redeemBtnText: {
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    // Generated token modal.
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
      marginVertical: Spacing.sm,
    },
    generatedActionBtn: {
      width: "100%",
      minHeight: 50,
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
    // Peer picker modal.
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
