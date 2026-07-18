// Peer list screen: Mesh tab.
// Shows nearby peers discovered via signed ANNOUNCE broadcasts.
// Toggle between list and radar view. Tap a peer to open their detail sheet.
// Peer data is populated from the BLE service (wired in v0.7+).

import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  buildOfflineToken,
  selectProofsForAmount,
} from "../../core/payments/cashu";
import { getMeshService } from "../../services/mesh-service";
import { useChatStore } from "../../store/chat-store";
import { usePeerStore, type NearbyPeer } from "../../store/peer-store";
import { useWalletStore } from "../../store/wallet-store";
import Avatar from "../../ui/components/avatar";
import StatusDot from "../../ui/components/status-dot";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";
import QrScanScreen from "../contacts/qr-scan-screen";
import RadarView from "./radar-view";

type ViewMode = "list" | "radar";

interface Props {
  onOpenDM?: (channel: string) => void;
}

export default function PeerList({ onOpenDM }: Props): React.JSX.Element {
  const { peers, evictStale } = usePeerStore();
  const { addChannel } = useChatStore();
  const [now, setNow] = useState(() => Date.now());
  const [viewMode, setViewMode] = useState<ViewMode>("radar");
  const [showQRScan, setShowQRScan] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState<NearbyPeer | null>(null);
  const [sendSatsAmount, setSendSatsAmount] = useState("");
  const [showSendSats, setShowSendSats] = useState(false);

  // Refresh "last seen" every 10 seconds and evict stale peers.
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      evictStale();
    }, 10_000);
    return () => clearInterval(timer);
  }, [evictStale]);

  const peerList = [...peers.values()].sort(
    (a, b) => b.lastSeenMs - a.lastSeenMs,
  );

  function formatLastSeen(ms: number): string {
    const diffSec = Math.floor((now - ms) / 1000);
    if (diffSec < 5) return "just now";
    if (diffSec < 60) return `${diffSec}s`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
    return `${Math.floor(diffSec / 3600)}h`;
  }

  function isOnline(peer: NearbyPeer): boolean {
    return now - peer.lastSeenMs < 60_000;
  }

  function handleSendDM(peer: NearbyPeer): void {
    const channel = `dm:${peer.peerID}`;
    addChannel(channel);
    closeSheet();
    onOpenDM?.(channel);
  }

  // Reset all peer-detail sheet state and close.
  function closeSheet(): void {
    setSelectedPeer(null);
    setShowSendSats(false);
    setSendSatsAmount("");
  }

  function handleSendSats(peer: NearbyPeer): void {
    const amount = parseInt(sendSatsAmount, 10);
    if (!amount || amount <= 0) return;

    const { proofsByMint, unit, removeProofs } = useWalletStore.getState();
    const { addMessage } = useChatStore.getState();
    const service = getMeshService();

    if (!service) {
      Alert.alert("Mesh offline", "Mesh service is not running.");
      return;
    }

    const totalBalance = Object.values(proofsByMint).reduce(
      (s, ps) => s + ps.reduce((a, p) => a + p.amount, 0),
      0,
    );
    if (amount > totalBalance) {
      Alert.alert(
        "Insufficient balance",
        `You have ${totalBalance.toLocaleString()} sats but tried to send ${amount.toLocaleString()}.`,
      );
      return;
    }

    const mintEntry = Object.entries(proofsByMint)
      .map(([url, ps]) => ({
        url,
        ps,
        balance: ps.reduce((s, p) => s + p.amount, 0),
      }))
      .find((m) => m.balance >= amount);

    if (!mintEntry) {
      Alert.alert(
        "Balance split across mints",
        "No single mint holds the full amount. Use the Wallet tab to consolidate.",
      );
      return;
    }

    const selection = selectProofsForAmount(mintEntry.ps, amount);
    if (!selection) return;

    const tokenStr = buildOfflineToken(mintEntry.url, selection.selected, unit);
    removeProofs(
      mintEntry.url,
      selection.selected.map((p) => p.secret),
    );

    const channel = `dm:${peer.peerID}`;
    addChannel(channel);
    addMessage({
      id: `wallet-sats-${peer.peerID}-${Date.now()}`,
      channel,
      senderID: "local",
      senderNickname: "You",
      text: tokenStr,
      timestampMs: Date.now(),
      isMine: true,
    });
    service.sendDm(peer.peerID, tokenStr);

    setSendSatsAmount("");
    setShowSendSats(false);
    closeSheet();
    onOpenDM?.(channel);
  }

  function handleQRScanned(peerID: string): void {
    const channel = `dm:${peerID}`;
    addChannel(channel);
    setShowQRScan(false);
    setSelectedPeer(null);
    onOpenDM?.(channel);
  }

  return (
    <View style={styles.container}>
      {/* Controls row: view toggle left, add contact circular button right */}
      <View style={styles.controlsRow}>
        <View style={styles.viewToggle}>
          <Pressable
            style={[
              styles.toggleBtn,
              viewMode === "list" && styles.toggleBtnActive,
            ]}
            onPress={() => setViewMode("list")}
            accessibilityRole="button"
            accessibilityLabel="List view"
            accessibilityState={{ selected: viewMode === "list" }}
          >
            <Feather
              name="list"
              size={16}
              color={viewMode === "list" ? Colors.accent : Colors.textMuted}
            />
          </Pressable>
          <Pressable
            style={[
              styles.toggleBtn,
              viewMode === "radar" && styles.toggleBtnActive,
            ]}
            onPress={() => setViewMode("radar")}
            accessibilityRole="button"
            accessibilityLabel="Radar view"
            accessibilityState={{ selected: viewMode === "radar" }}
          >
            <Feather
              name="radio"
              size={16}
              color={viewMode === "radar" ? Colors.accent : Colors.textMuted}
            />
          </Pressable>
        </View>

        <Pressable
          style={styles.addContactBtn}
          onPress={() => setShowQRScan(true)}
          accessibilityRole="button"
          accessibilityLabel="Add contact"
        >
          <Feather name="user-plus" size={16} color={Colors.textSecondary} />
        </Pressable>
      </View>

      {viewMode === "radar" ? (
        <RadarView peers={peerList} now={now} onSelectPeer={setSelectedPeer} />
      ) : (
        <FlatList
          data={peerList}
          keyExtractor={(item) => item.peerID}
          renderItem={({ item }) => {
            const online = isOnline(item);
            const username = peerIDToUsername(item.peerID);

            return (
              <Pressable
                style={({ pressed }) => [
                  styles.row,
                  pressed && styles.rowPressed,
                ]}
                onPress={() => setSelectedPeer(item)}
                accessibilityRole="button"
                accessibilityLabel={`View peer ${username}`}
              >
                {/* Avatar with status */}
                <View style={styles.avatarWrapper}>
                  <Avatar username={username} peerID={item.peerID} size={46} />
                  <View style={styles.statusBadge}>
                    <StatusDot
                      status={online ? "online" : "offline"}
                      size={10}
                    />
                  </View>
                </View>

                {/* Info */}
                <View style={styles.rowContent}>
                  <Text style={styles.username} numberOfLines={1}>
                    {username}
                  </Text>
                  <Text style={styles.peerID}>
                    {item.peerID.slice(0, 8)}\u2009\u00b7\u2009
                    {item.peerID.slice(8)}
                  </Text>
                </View>

                {/* Last seen */}
                <View style={styles.rowRight}>
                  <Text
                    style={[
                      styles.lastSeen,
                      online && { color: Colors.online },
                    ]}
                  >
                    {online ? "now" : formatLastSeen(item.lastSeenMs)}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <View style={styles.emptyRing2} />
                <View style={styles.emptyRing1} />
                <View style={styles.emptyDot} />
              </View>
              <Text style={styles.emptyTitle}>Scanning for peers</Text>
              <Text style={styles.emptySubtitle}>
                Other Airhop or bitchat devices{"\n"}within BLE range appear
                here.
              </Text>
            </View>
          }
          contentContainerStyle={styles.list}
        />
      )}

      {/* Peer detail sheet */}
      <Modal
        visible={selectedPeer !== null}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}
      >
        {selectedPeer && (
          <Pressable style={styles.sheetOverlay} onPress={closeSheet}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              {/* Drag handle */}
              <View style={styles.handle} />

              {/* Identity */}
              <View style={styles.sheetIdentity}>
                <Avatar
                  username={peerIDToUsername(selectedPeer.peerID)}
                  peerID={selectedPeer.peerID}
                  size={64}
                />
                <Text style={styles.sheetUsername}>
                  {peerIDToUsername(selectedPeer.peerID)}
                </Text>
                <Text style={styles.sheetPeerID}>{selectedPeer.peerID}</Text>
                <View style={styles.sheetStatusRow}>
                  <StatusDot
                    status={isOnline(selectedPeer) ? "online" : "offline"}
                    size={8}
                  />
                  <Text style={styles.sheetStatusText}>
                    {isOnline(selectedPeer)
                      ? "In range"
                      : `Last seen ${formatLastSeen(selectedPeer.lastSeenMs)} ago`}
                  </Text>
                </View>
              </View>

              {/* Message action */}
              <Pressable
                style={styles.sheetMessageBtn}
                onPress={() => handleSendDM(selectedPeer)}
                accessibilityRole="button"
                accessibilityLabel="Send a direct message"
              >
                <Feather
                  name="message-circle"
                  size={18}
                  color={Colors.textInverse}
                />
                <Text style={styles.sheetMessageBtnText}>Message</Text>
              </Pressable>

              {/* Send sats inline block */}
              {!showSendSats ? (
                <Pressable
                  style={styles.sheetSatsBtn}
                  onPress={() => setShowSendSats(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Send sats"
                >
                  <Feather name="zap" size={16} color={Colors.textSecondary} />
                  <Text style={styles.sheetSatsBtnText}>Send sats</Text>
                </Pressable>
              ) : (
                <View style={styles.sendSatsRow}>
                  <TextInput
                    style={styles.sendSatsInput}
                    value={sendSatsAmount}
                    onChangeText={setSendSatsAmount}
                    placeholder="Amount in sats"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                    returnKeyType="send"
                    autoFocus
                    selectionColor={Colors.accent}
                    onSubmitEditing={() => handleSendSats(selectedPeer)}
                  />
                  <Pressable
                    style={[
                      styles.sendSatsConfirm,
                      !sendSatsAmount.trim() && { opacity: 0.4 },
                    ]}
                    onPress={() => handleSendSats(selectedPeer)}
                    disabled={!sendSatsAmount.trim()}
                    accessibilityRole="button"
                    accessibilityLabel="Confirm send sats"
                  >
                    <Feather
                      name="arrow-right"
                      size={16}
                      color={Colors.textInverse}
                    />
                  </Pressable>
                  <Pressable
                    style={styles.sendSatsCancel}
                    onPress={() => {
                      setShowSendSats(false);
                      setSendSatsAmount("");
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel send sats"
                  >
                    <Feather name="x" size={16} color={Colors.textSecondary} />
                  </Pressable>
                </View>
              )}
            </Pressable>
          </Pressable>
        )}
      </Modal>

      {/* QR scanner */}
      <QrScanScreen
        visible={showQRScan}
        onClose={() => setShowQRScan(false)}
        onPeerFound={handleQRScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.sm,
    marginRight: Spacing.base,
    marginLeft: Spacing.base,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  addContactBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceRaised,
  },
  // View toggle
  viewToggle: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    padding: 2,
    gap: 2,
  },
  toggleBtn: {
    width: 32,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleBtnActive: {
    backgroundColor: Colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
  },
  // Stats bar styles removed: counts surfaced in App.tsx header.
  // List
  list: {
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    minHeight: 72,
  },
  rowPressed: {
    backgroundColor: Colors.surface,
  },
  avatarWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  statusBadge: {
    position: "absolute",
    right: -1,
    bottom: -1,
    backgroundColor: Colors.bg,
    borderRadius: Radius.full,
    padding: 1,
  },
  rowContent: {
    flex: 1,
    gap: 3,
  },
  rowRight: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  username: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  peerID: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontFamily: "monospace",
    letterSpacing: 0.8,
  },
  lastSeen: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 62,
  },
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: "center",
    paddingTop: Spacing["4xl"],
    gap: Spacing.base,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.textMuted,
    opacity: 0.7,
  },
  emptyRing1: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    opacity: 0.45,
  },
  emptyRing2: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.textMuted,
    opacity: 0.25,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: FontSize.sm * 1.6,
  },
  // Peer detail sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius["2xl"],
    borderTopRightRadius: Radius["2xl"],
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderStrong,
    alignSelf: "center",
    marginBottom: Spacing.xs,
  },
  sheetIdentity: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  sheetUsername: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  sheetPeerID: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontFamily: "monospace",
    letterSpacing: 0.8,
  },
  sheetStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  sheetStatusText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  sheetMessageBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  sheetMessageBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textInverse,
  },
  sheetSatsBtn: {
    marginTop: Spacing.sm,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sheetSatsBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  sendSatsRow: {
    marginTop: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  sendSatsInput: {
    flex: 1,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  sendSatsConfirm: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sendSatsCancel: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
