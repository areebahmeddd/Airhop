// Peer list screen: Mesh tab.
// Shows nearby peers discovered via signed ANNOUNCE broadcasts.
// Toggle between list and radar view. Tap a peer to open their detail sheet.
// Peer data is populated from the BLE service (wired in v0.7+).

import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useChatStore } from "../../store/chat-store";
import { usePeerStore, type NearbyPeer } from "../../store/peer-store";
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
    setSelectedPeer(null);
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
      {/* Controls row: view toggle + add contact */}
      <View style={styles.controlsRow}>
        <Pressable
          style={styles.addContactBtn}
          onPress={() => setShowQRScan(true)}
          accessibilityRole="button"
          accessibilityLabel="Add contact by peer ID"
        >
          <Feather name="user-plus" size={14} color={Colors.textSecondary} />
          <Text style={styles.addContactText}>Add</Text>
        </Pressable>

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
        onRequestClose={() => setSelectedPeer(null)}
      >
        {selectedPeer && (
          <Pressable
            style={styles.sheetOverlay}
            onPress={() => setSelectedPeer(null)}
          >
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

              {/* Message action: full width */}
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
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  addContactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: Spacing.md,
    height: 32,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
  },
  addContactText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
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
});
