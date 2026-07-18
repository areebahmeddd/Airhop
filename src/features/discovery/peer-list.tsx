// Peer list screen — Mesh tab.
// Shows nearby peers discovered via signed ANNOUNCE broadcasts.
// Tapping a peer opens a detail sheet with DM and contact actions.
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

interface Props {
  onOpenDM?: (channel: string) => void;
}

export default function PeerList({ onOpenDM }: Props): React.JSX.Element {
  const { peers, evictStale } = usePeerStore();
  const { addChannel } = useChatStore();
  const [now, setNow] = useState(() => Date.now());
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

  return (
    <View style={styles.container}>
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
                  <StatusDot status={online ? "online" : "offline"} size={10} />
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
                  style={[styles.lastSeen, online && { color: Colors.online }]}
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
              Other Airhop or bitchat devices{"\n"}within BLE range appear here.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

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

              {/* Actions */}
              <View style={styles.sheetActions}>
                <Pressable
                  style={styles.sheetAction}
                  onPress={() => handleSendDM(selectedPeer)}
                  accessibilityRole="button"
                  accessibilityLabel="Send a direct message"
                >
                  <View style={styles.sheetActionIcon}>
                    <Feather
                      name="message-circle"
                      size={22}
                      color={Colors.textSecondary}
                    />
                  </View>
                  <Text style={styles.sheetActionLabel}>Message</Text>
                </Pressable>

                <Pressable
                  style={styles.sheetAction}
                  onPress={() => setSelectedPeer(null)}
                  accessibilityRole="button"
                  accessibilityLabel="Add contact via QR"
                >
                  <View style={styles.sheetActionIcon}>
                    <Feather
                      name="user-plus"
                      size={22}
                      color={Colors.textSecondary}
                    />
                  </View>
                  <Text style={styles.sheetActionLabel}>Add contact</Text>
                </Pressable>
              </View>

              {/* Tech detail */}
              <View style={styles.sheetMeta}>
                <Text style={styles.sheetMetaLabel}>Noise public key</Text>
                <Text style={styles.sheetMetaValue} numberOfLines={2}>
                  {selectedPeer.noisePubKeyHex}
                </Text>
              </View>
            </Pressable>
          </Pressable>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  // Stats bar styles removed — counts surfaced in App.tsx header.
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
  sheetActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xl,
  },
  sheetAction: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  sheetActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetActionLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  sheetMeta: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  sheetMetaLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sheetMetaValue: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
});
