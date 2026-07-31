// Peer list screen: Mesh tab.
// Shows nearby peers discovered via signed ANNOUNCE broadcasts, on either
// the radar view (default) or a flat list. Tap a peer to open their detail
// sheet (message / send sats), with no separate "add contact" step, since a
// visible peer is already reachable. Peer data is populated from the BLE
// service (wired in v0.7+).

import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { t, useT } from "../../i18n";
import { arrowForward } from "../../i18n/layout";
import { describeRoute, sendEcashToPeer } from "../../services/ecash-transfer";
import { showAlert } from "../../store/alert-store";
import { useBlockedStore } from "../../store/blocked-store";
import { useChatStore } from "../../store/chat-store";
import { useContactsStore } from "../../store/contacts-store";
import { usePeerStore, type NearbyPeer } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
import BottomSheet from "../../ui/components/bottom-sheet";
import EmptyState from "../../ui/components/empty-state";
import StatusDot from "../../ui/components/status-dot";
import {
  DISABLED_OPACITY,
  FontFamily,
  FontSize,
  FontWeight,
  HIT_SLOP,
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
  const T = useT();
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
  const [copiedPeerID, setCopiedPeerID] = useState(false);
  // Held so the "copied" tick can be cancelled if the sheet closes first.
  // Without this the timer fired into an unmounted component.
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (copyResetRef.current !== null) clearTimeout(copyResetRef.current);
    };
  }, []);

  function handleCopyPeerID(id: string): void {
    void Clipboard.setStringAsync(id).catch(() => {});
    // A copy is silent and the glyph swap is easy to miss mid-tap, so the
    // confirmation is also felt. Matches how the wallet confirms a copied token.
    void Haptics.selectionAsync().catch(() => {});
    setCopiedPeerID(true);
    if (copyResetRef.current !== null) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setCopiedPeerID(false), 1500);
  }

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
    if (diffSec < 5) return t("mesh.peer.just_now");
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
    const amount = parsedSats;
    if (amount === null || sendingSats) return;

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

  // The typed amount as a number, or null when it is not a spendable one.
  //
  // handleSendSats used to parse this itself and silently `return` on anything
  // invalid, while the confirm button only greyed out on an EMPTY field. So a
  // "0", a stray "-" or a pasted "12.5" left an enabled arrow that did nothing
  // at all when tapped: the worst class of dead control, because the user has
  // no way to tell it from a failed send. One source of validity now drives
  // both the button's disabled state and the send.
  const parsedSats = useMemo(() => {
    const trimmed = sendSatsAmount.trim();
    if (!/^\d+$/.test(trimmed)) return null;
    const value = Number.parseInt(trimmed, 10);
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }, [sendSatsAmount]);

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
            <EmptyState
              icon="radio"
              title={T("mesh.peer.none")}
              subtitle={T("mesh.peer.none_desc")}
            />
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
              {/* Same copy affordance as the contact sheet: one tap, and the
                  glyph turns into a check in place. Hand-selecting the ID
                  would fight this sheet's pan-to-dismiss gesture. */}
              <Pressable
                style={styles.sheetPeerIDRow}
                onPress={() => handleCopyPeerID(selectedPeer.peerID)}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
                // The ID itself is 16 characters of hex, which a screen reader
                // spells out one character at a time. The label states the
                // action; the value is not something anyone listens to.
                accessibilityLabel={
                  copiedPeerID
                    ? T("mesh.peer.id_copied")
                    : T("mesh.peer.copy_id")
                }
              >
                <Text style={styles.sheetPeerID}>{selectedPeer.peerID}</Text>
                <Feather
                  name={copiedPeerID ? "check" : "copy"}
                  size={13}
                  color={copiedPeerID ? Colors.online : Colors.textMuted}
                />
              </Pressable>
              <View style={styles.sheetStatusRow}>
                <StatusDot
                  status={isOnline(selectedPeer) ? "online" : "offline"}
                  size={8}
                />
                <Text style={styles.sheetStatusText}>
                  {isOnline(selectedPeer)
                    ? T("mesh.peer.in_range")
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
                accessibilityLabel={T("mesh.peer.send_dm")}
              >
                <Feather
                  name="message-circle"
                  size={18}
                  color={Colors.textInverse}
                />
                <Text style={styles.sheetMessageBtnText}>
                  {T("mesh.peer.message")}
                </Text>
              </Pressable>

              {!showSendSats ? (
                <Pressable
                  style={styles.sheetSatsBtn}
                  onPress={() => setShowSendSats(true)}
                  accessibilityRole="button"
                  accessibilityLabel={T("mesh.peer.send_sats")}
                >
                  <Feather name="zap" size={16} color={Colors.textSecondary} />
                  <Text style={styles.sheetSatsBtnText}>
                    {T("mesh.peer.send_sats")}
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.sendSatsRow}>
                  <TextInput
                    style={styles.sendSatsInput}
                    value={sendSatsAmount}
                    onChangeText={setSendSatsAmount}
                    placeholder={T("mesh.peer.amount_placeholder")}
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
                      (parsedSats === null || sendingSats) &&
                        styles.sendSatsConfirmDisabled,
                    ]}
                    onPress={() => void handleSendSats(selectedPeer)}
                    disabled={parsedSats === null || sendingSats}
                    accessibilityRole="button"
                    accessibilityLabel={
                      parsedSats === null
                        ? T("mesh.peer.amount_first")
                        : `Send ${String(parsedSats)} sats`
                    }
                    accessibilityState={{
                      disabled: parsedSats === null || sendingSats,
                      busy: sendingSats,
                    }}
                  >
                    {/* Quoting the token is a network round trip, so a send can
                        sit for a second or two. A frozen arrow gave no sign the
                        tap had registered, which is what invites the double tap
                        the `sendingSats` guard exists to survive. */}
                    {sendingSats ? (
                      <ActivityIndicator
                        size="small"
                        color={Colors.textInverse}
                      />
                    ) : (
                      <Feather
                        name={arrowForward}
                        size={16}
                        color={Colors.textInverse}
                      />
                    )}
                  </Pressable>
                  <Pressable
                    style={styles.sendSatsCancel}
                    onPress={() => {
                      setShowSendSats(false);
                      setSendSatsAmount("");
                    }}
                    disabled={sendingSats}
                    accessibilityRole="button"
                    accessibilityLabel={T("mesh.peer.cancel_send")}
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
    // No row background. The header comment claims these rows match dm-list and
    // channel-list, and in every respect but this they did: those two are flat
    // on the screen background with only a hairline between them, while this one
    // filled each row with `surface`. On the same screen as the radar the two
    // Mesh views therefore had different canvases, and switching Radar/List
    // changed the page colour as well as the content.
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      gap: Spacing.md,
      minHeight: 72,
    },
    avatarWrapper: {
      position: "relative",
      flexShrink: 0,
    },
    rowStatusBadge: {
      position: "absolute",
      end: -1,
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
      // Aligned to the text, past the avatar: avatar (46) + gap (16). Same
      // inset the DM list uses, so the two read as one list style.
      marginStart: 62,
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
    // Peer ID + its copy glyph, kept on one centered line.
    sheetPeerIDRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
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
    sendSatsConfirmDisabled: {
      opacity: DISABLED_OPACITY,
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
