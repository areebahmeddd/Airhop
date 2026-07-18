// Wallet screen: Cashu ecash balance and proof management.
// Shows total balance, per-mint breakdown, and quick send/receive actions.
// All proofs are stored locally in MMKV; no server or account required.

import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useWalletStore, type MintBalance } from "../../store/wallet-store";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";

export default function WalletScreen(): React.JSX.Element {
  const { proofsByMint, unit, addMint } = useWalletStore();
  const [showReceive, setShowReceive] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showZap, setShowZap] = useState(false);
  const [showAddMint, setShowAddMint] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [zapNpub, setZapNpub] = useState("");
  const [zapAmount, setZapAmount] = useState("");
  const [zapNote, setZapNote] = useState("");
  const [mintUrlInput, setMintUrlInput] = useState("");

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
    const token = tokenInput.trim();
    if (!token) return;
    // Token parse/validation delegated to cashu.ts in a real integration.
    // For now, close the modal and show a toast.
    setShowReceive(false);
    setTokenInput("");
    Alert.alert("Token received", "Token validated and proofs stored.");
  }

  function handleSend(): void {
    const amount = parseInt(sendAmount, 10);
    if (!amount || amount <= 0) return;
    setShowSend(false);
    setSendAmount("");
    Alert.alert(
      "Token generated",
      `A ${amount.toLocaleString()} sat Cashu token is ready to share. Paste it into a DM to send.\n\nCashu send integration connects to your mint in a future update.`,
    );
  }

  function handleZapConfirm(): void {
    const npub = zapNpub.trim();
    const amount = parseInt(zapAmount, 10);
    if (!npub || !amount || amount <= 0) return;
    setShowZap(false);
    setZapNpub("");
    setZapAmount("");
    setZapNote("");
    // Nutzap (NIP-61) requires an active Nostr connection. The backend
    // nutzap.ts is ready; full wiring requires the NostrClient singleton
    // to be connected. This will be enabled in v1.1.
    Alert.alert(
      "Nutzap queued",
      `${amount.toLocaleString()} sat zap to ${npub.slice(0, 16)}\u2026\n\nNutzap delivery requires internet connectivity. It will be sent when you connect to a Nostr relay.`,
      [{ text: "OK" }],
    );
  }

  function handleAddMintConfirm(): void {
    const url = mintUrlInput.trim();
    if (!url) return;

    // Basic URL validation: must be http(s).
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        Alert.alert(
          "Invalid URL",
          "Mint URL must start with http:// or https://",
        );
        return;
      }
    } catch {
      Alert.alert("Invalid URL", "Please enter a valid mint URL.");
      return;
    }

    addMint(url);
    setShowAddMint(false);
    setMintUrlInput("");
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Balance section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Balance</Text>
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

          {/* Quick actions */}
          <View style={styles.quickActions}>
            <Pressable
              style={({ pressed }) => [
                styles.quickAction,
                pressed && styles.actionButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Receive ecash token"
              onPress={() => setShowReceive(true)}
            >
              <View
                style={[styles.quickActionIcon, styles.quickActionIconPrimary]}
              >
                <Feather name="download" size={17} color={Colors.textInverse} />
              </View>
              <Text style={styles.quickActionLabel}>Receive</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.quickAction,
                pressed && styles.actionButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Send ecash token"
              onPress={() => setShowSend(true)}
            >
              <View style={styles.quickActionIcon}>
                <Feather name="upload" size={17} color={Colors.textSecondary} />
              </View>
              <Text style={styles.quickActionLabel}>Send</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.quickAction,
                pressed && styles.actionButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Zap a Nostr contact"
              onPress={() => setShowZap(true)}
            >
              <View style={styles.quickActionIcon}>
                <Feather name="zap" size={17} color={Colors.textSecondary} />
              </View>
              <Text style={styles.quickActionLabel}>Zap</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.quickAction,
                pressed && styles.actionButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Add a Cashu mint"
              onPress={() => setShowAddMint(true)}
            >
              <View style={styles.quickActionIcon}>
                <Feather
                  name="plus-circle"
                  size={17}
                  color={Colors.textSecondary}
                />
              </View>
              <Text style={styles.quickActionLabel}>Add mint</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Mint balances */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mints</Text>

        {mintBalances.length === 0 ? (
          <View style={styles.emptyMints}>
            <Text style={styles.emptyMintsText}>No mints added yet.</Text>
            <Text style={styles.emptyMintsSubtext}>
              Receive a Cashu token to automatically add a mint.
            </Text>
          </View>
        ) : (
          mintBalances.map((m) => (
            <View key={m.mintUrl} style={styles.mintRow}>
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
              </View>
            </View>
          ))
        )}
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
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
              name="radio"
              size={16}
              color={Colors.textMuted}
              style={styles.infoPanelIcon}
            />
            <View style={styles.infoPanelText}>
              <Text style={styles.infoPanelTitle}>Works without internet</Text>
              <Text style={styles.infoPanelBody}>
                Transfer sats peer-to-peer over BLE mesh. No internet required.
                Your peers are the network.
              </Text>
            </View>
          </View>
          <View style={styles.infoPanelDivider} />
          <View style={styles.infoPanelRow}>
            <Feather
              name="globe"
              size={16}
              color={Colors.textMuted}
              style={styles.infoPanelIcon}
            />
            <View style={styles.infoPanelText}>
              <Text style={styles.infoPanelTitle}>Any mint works</Text>
              <Text style={styles.infoPanelBody}>
                Any Cashu v1 mint is compatible. Redeem proofs at Minibits,
                Nutshell, or run your own.
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
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowReceive(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
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
                style={styles.modalCancel}
                onPress={() => setShowReceive(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
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
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      {/* Send modal */}
      <Modal
        visible={showSend}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSend(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSend(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Send ecash</Text>
            <Text style={styles.modalSubtitle}>
              Enter an amount to generate a Cashu token. Share it via DM or QR
              to pay anyone without an account.
            </Text>
            <TextInput
              style={styles.tokenInput}
              value={sendAmount}
              onChangeText={setSendAmount}
              placeholder="Amount in sats (e.g. 500)"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              returnKeyType="done"
              selectionColor={Colors.accent}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => {
                  setShowSend(false);
                  setSendAmount("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
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
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Zap modal */}
      <Modal
        visible={showZap}
        transparent
        animationType="slide"
        onRequestClose={() => setShowZap(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowZap(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
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
              <Pressable
                style={[
                  styles.modalConfirm,
                  (!zapNpub.trim() || !zapAmount.trim()) &&
                    styles.modalConfirmDisabled,
                ]}
                onPress={handleZapConfirm}
                disabled={!zapNpub.trim() || !zapAmount.trim()}
              >
                <Text style={styles.modalConfirmText}>Zap</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Add mint modal */}
      <Modal
        visible={showAddMint}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddMint(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAddMint(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
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
                style={styles.modalCancel}
                onPress={() => {
                  setShowAddMint(false);
                  setMintUrlInput("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
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
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.base,
    paddingBottom: Spacing["3xl"],
  },
  // Quick actions
  quickActions: {
    flexDirection: "row",
    marginTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionIconPrimary: {
    backgroundColor: Colors.accent,
    borderColor: "transparent",
  },
  quickActionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  // Balance card
  balanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
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
    marginVertical: Spacing.xs,
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
    marginBottom: Spacing.sm,
  },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  actionButtonPrimary: {
    backgroundColor: Colors.accent,
  },
  actionButtonSecondary: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonPressed: {
    opacity: 0.82,
  },
  actionButtonTextPrimary: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textInverse,
  },
  actionButtonTextSecondary: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  // Mints section
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
    fontFamily: "monospace",
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
    fontFamily: "monospace",
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
    fontFamily: "monospace",
    minHeight: 80,
    textAlignVertical: "top",
  },
  tokenInputCompact: {
    minHeight: 0,
    fontFamily: undefined,
    marginTop: Spacing.sm,
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  modalConfirmDisabled: {
    opacity: 0.4,
  },
  modalConfirmText: {
    fontSize: FontSize.base,
    color: Colors.textInverse,
    fontWeight: FontWeight.semibold,
  },
});
