// Peer list screen: Mesh tab.
// Shows nearby peers discovered via signed ANNOUNCE broadcasts, on either
// the radar view (default) or a flat list. Tap a peer to open their detail
// sheet (message / send sats), with no separate "add contact" step, since a
// visible peer is already reachable. Peer data is populated from the BLE
// service (wired in v0.7+).

import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
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
import { showAlert } from "../../store/alert-store";
import { useBlockedStore } from "../../store/blocked-store";
import { useChatStore } from "../../store/chat-store";
import { useContactsStore } from "../../store/contacts-store";
import { usePeerStore, type NearbyPeer } from "../../store/peer-store";
import { useWalletStore } from "../../store/wallet-store";
import Avatar from "../../ui/components/avatar";
import StatusDot from "../../ui/components/status-dot";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { resolveDisplayName } from "../../utils/display-name";
import QrScanScreen from "../contacts/qr-scan-screen";
import RadarView from "./radar-view";

type ViewMode = "list" | "radar";

interface Props {
  onOpenDM?: (channel: string) => void;
  viewMode: ViewMode;
  // Increment this to programmatically open the add-contact QR scanner (e.g.
  // from the App.tsx header's add-contact button). Counter pattern avoids
  // boolean edge cases.
  addContactTrigger?: number;
}

export default function PeerList({
  onOpenDM,
  viewMode,
  addContactTrigger,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const { peers, evictStale } = usePeerStore();
  const { addChannel } = useChatStore();
  const isBlocked = useBlockedStore((s) => s.isBlocked);
  const [now, setNow] = useState(() => Date.now());
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

  // Watch the trigger counter from App.tsx header button.
  const prevAddTrigger = useRef(addContactTrigger ?? 0);
  useEffect(() => {
    if (
      addContactTrigger !== undefined &&
      addContactTrigger > prevAddTrigger.current
    ) {
      prevAddTrigger.current = addContactTrigger;
      setShowQRScan(true);
    }
  }, [addContactTrigger]);

  // Belt-and-suspenders: mesh-service already keeps a blocked peer's
  // announces out of the store, but filtering here too means a peer
  // blocked mid-session (already cached before the block) disappears
  // immediately instead of waiting for TTL eviction.
  const peerList = [...peers.values()]
    .filter((p) => !isBlocked(p.peerID))
    .sort((a, b) => b.lastSeenMs - a.lastSeenMs);

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
    // Messaging someone saves them as a contact (Signal-style: people you talk
    // to are kept), so the thread and their identity survive them going out of
    // range. Unverified until a QR card confirms the keys.
    useContactsStore
      .getState()
      .saveIfAbsent(peer.peerID, peer.nickname, peer.noisePubKeyHex);
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
      showAlert("Mesh offline", "Mesh service is not running.");
      return;
    }

    const totalBalance = Object.values(proofsByMint).reduce(
      (s, ps) => s + ps.reduce((a, p) => a + p.amount, 0),
      0,
    );
    if (amount > totalBalance) {
      showAlert(
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
      showAlert(
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
      {viewMode === "radar" ? (
        <RadarView peers={peerList} now={now} onSelectPeer={setSelectedPeer} />
      ) : (
        <FlatList
          data={peerList}
          keyExtractor={(item) => item.peerID}
          renderItem={({ item }) => {
            const online = isOnline(item);
            const username = resolveDisplayName(item.peerID);

            return (
              <Pressable
                style={styles.row}
                onPress={() => setSelectedPeer(item)}
                accessibilityRole="button"
                accessibilityLabel={`View peer ${username}${online ? ", online" : ""}`}
              >
                <View style={styles.avatarWrapper}>
                  <Avatar username={username} peerID={item.peerID} size={46} />
                  <View style={styles.rowStatusBadge}>
                    <StatusDot
                      status={online ? "online" : "offline"}
                      size={10}
                    />
                  </View>
                </View>

                <View style={styles.rowContent}>
                  <Text style={styles.rowUsername} numberOfLines={1}>
                    {username}
                  </Text>
                  <Text style={styles.rowPeerID}>
                    {item.peerID.slice(0, 8)}
                    {" · "}
                    {item.peerID.slice(8)}
                  </Text>
                </View>

                <View style={styles.rowRight}>
                  <Text
                    style={[
                      styles.rowLastSeen,
                      online && { color: Colors.online },
                    ]}
                  >
                    {online ? "now" : formatLastSeen(item.lastSeenMs)}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
          ListEmptyComponent={
            <View style={styles.listEmptyState}>
              <Feather
                name="radio"
                size={36}
                color={Colors.textMuted}
                style={{ opacity: 0.4 }}
              />
              <Text style={styles.listEmptyTitle}>No peers nearby</Text>
              <Text style={styles.listEmptySubtitle}>
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
          <View style={styles.sheetOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
            <View style={styles.sheet}>
              {/* Drag handle */}
              <View style={styles.handle} />

              {/* Identity */}
              <View style={styles.sheetIdentity}>
                <Avatar
                  username={resolveDisplayName(selectedPeer.peerID)}
                  peerID={selectedPeer.peerID}
                  size={64}
                />
                <Text style={styles.sheetUsername}>
                  {resolveDisplayName(selectedPeer.peerID)}
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

              {/* Message + Send sats: a tight pair of actions, not spread
                  apart by the sheet's larger identity/actions rhythm. */}
              <View style={styles.sheetActions}>
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

                {!showSendSats ? (
                  <Pressable
                    style={styles.sheetSatsBtn}
                    onPress={() => setShowSendSats(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Send sats"
                  >
                    <Feather
                      name="zap"
                      size={16}
                      color={Colors.textSecondary}
                    />
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
                      <Feather
                        name="x"
                        size={16}
                        color={Colors.textSecondary}
                      />
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </View>
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

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    // Add-contact button and the list/radar toggle both live in App.tsx's
    // shared header.
    // List view: rows match dm-list.tsx / channel-list.tsx's shape so all
    // three list surfaces in the app feel like one consistent system.
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
      backgroundColor: Colors.surface,
    },
    avatarWrapper: {
      position: "relative",
      flexShrink: 0,
    },
    rowStatusBadge: {
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
    rowUsername: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    rowPeerID: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontFamily: "monospace",
      letterSpacing: 0.8,
    },
    rowLastSeen: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    rowSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginLeft: 62,
    },
    listEmptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Spacing["4xl"],
      gap: Spacing.md,
    },
    listEmptyTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textSecondary,
    },
    listEmptySubtitle: {
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
    sheetActions: {
      width: "100%",
      gap: Spacing.sm,
    },
    sheetMessageBtn: {
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
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
      borderRadius: Radius.full,
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
}
