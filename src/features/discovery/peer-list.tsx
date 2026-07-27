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
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { describeRoute, sendEcashToPeer } from "../../services/ecash-transfer";
import { showAlert } from "../../store/alert-store";
import { useBlockedStore } from "../../store/blocked-store";
import { useChatStore } from "../../store/chat-store";
import { useContactsStore } from "../../store/contacts-store";
import { usePeerStore, type NearbyPeer } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
import BottomSheet from "../../ui/components/bottom-sheet";
import StatusDot from "../../ui/components/status-dot";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  TAB_BAR_CLEARANCE,
  useThemeColors,
} from "../../ui/theme";
import { resolveDisplayName } from "../../utils/display-name";
import QrScanScreen from "../contacts/qr-scan-screen";
import RadarView from "./radar-view";

type ViewMode = "list" | "radar";

// One height for every control in the send-sats row: the amount field and both
// icon buttons. Referenced once each, so the row cannot drift out of alignment.
const SEND_SATS_ROW_HEIGHT = 44;

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
  // Set while a send is in flight. Quoting involves an await, so without this a
  // double tap starts two sends; the second now loses the reservation race and
  // reports a confusing "those coins were just used" instead of doing nothing.
  const [sendingSats, setSendingSats] = useState(false);

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

  // Ecash hand-off to a peer standing next to you. All of the proof handling
  // (selection, fees, reserving so an undelivered token can be reclaimed) lives
  // in the shared transfer service; this only supplies who and how much.
  async function handleSendSats(peer: NearbyPeer): Promise<void> {
    const amount = parseInt(sendSatsAmount, 10);
    if (!amount || amount <= 0 || sendingSats) return;

    setSendingSats(true);
    let result;
    try {
      result = await sendEcashToPeer({ peerID: peer.peerID, amount });
    } finally {
      setSendingSats(false);
    }
    if (!result) return;

    setSendSatsAmount("");
    setShowSendSats(false);
    closeSheet();
    onOpenDM?.(`dm:${peer.peerID}`);
    // The thread we just opened shows the bubble, so only speak up when the
    // token did not go straight out.
    if (result.route !== "sent") {
      showAlert(
        `${result.prepared.amount.toLocaleString()} ${result.prepared.unit} on its way`,
        `${describeRoute(result.route)} It stays reclaimable from the Wallet tab until you confirm it arrived, so nothing is lost if it never lands.`,
      );
    }
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
      <BottomSheet
        visible={selectedPeer !== null}
        onClose={closeSheet}
        sheetStyle={styles.sheet}
      >
        {selectedPeer && (
          <>
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
                    onSubmitEditing={() => void handleSendSats(selectedPeer)}
                  />
                  <Pressable
                    style={[
                      styles.sendSatsConfirm,
                      (!sendSatsAmount.trim() || sendingSats) && {
                        opacity: 0.4,
                      },
                    ]}
                    onPress={() => void handleSendSats(selectedPeer)}
                    disabled={!sendSatsAmount.trim() || sendingSats}
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
            </View>
          </>
        )}
      </BottomSheet>

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
      // Clear the floating tab bar so the last peer row can scroll above it.
      paddingBottom: TAB_BAR_CLEARANCE,
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
      fontFamily: FontFamily.mono,
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
    sheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.xl,
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
      fontFamily: FontFamily.mono,
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
    // The amount row replaces the Message/Send sats pills in place, so it keeps
    // their shape: everything in it is fully rounded and one height, which makes
    // the two 40x40 icon buttons circles rather than the rounded squares that
    // read as a different control set from the pills above them.
    sendSatsInput: {
      flex: 1,
      height: SEND_SATS_ROW_HEIGHT,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: 0,
      fontSize: FontSize.base,
      color: Colors.textPrimary,
    },
    sendSatsConfirm: {
      width: SEND_SATS_ROW_HEIGHT,
      height: SEND_SATS_ROW_HEIGHT,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    sendSatsCancel: {
      width: SEND_SATS_ROW_HEIGHT,
      height: SEND_SATS_ROW_HEIGHT,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
