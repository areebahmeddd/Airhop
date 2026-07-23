// Shared channel detail bottom sheet.
// Used by both channel-list (info icon tap) and message-thread (header tap).
// Shows About, Visibility, Transport, and Members sections.
// Own channels have an edit mode for the name and About text.
// Default channels are read-only with a protocol lock notice.

import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { isGeoChannel } from "../../services/geohash-channel-service";
import { getMeshService } from "../../services/mesh-service";
import { useChatStore } from "../../store/chat-store";
import { usePeerStore } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
import StatusDot from "../../ui/components/status-dot";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";

// Protocol-defined default channels. Read-only, cannot be left.
const DEFAULT_CHANNEL_NAMES = new Set([
  "#bluetooth",
  "#block",
  "#neighborhood",
  "#city",
  "#province",
  "#region",
]);

// Static metadata for each default channel.
const CHANNEL_SCOPE: Record<
  string,
  { tag: string; description: string; transport: string }
> = {
  "#bluetooth": {
    tag: "Local mesh · BLE only",
    description:
      "Reaches devices within BLE range (roughly 10 to 100 metres). No internet required. Ideal for local coordination.",
    transport: "BLE only",
  },
  "#block": {
    tag: "City block · ~100m",
    description:
      "City-block level coverage. Messages are bridged over Nostr so peers outside BLE range but nearby can participate.",
    transport: "BLE + Nostr",
  },
  "#neighborhood": {
    tag: "Neighborhood · ~1km",
    description:
      "Neighborhood coverage. Relay-assisted so peers across the area are reachable even without a direct BLE link.",
    transport: "BLE + Nostr",
  },
  "#city": {
    tag: "City · ~10km",
    description:
      "City-wide channel. Uses geo-located Nostr relays to reach peers across the metro area.",
    transport: "BLE + Nostr",
  },
  "#province": {
    tag: "Province or state · ~100km",
    description:
      "Provincial or state coverage. Bridged over Nostr for regional reach across hundreds of kilometres.",
    transport: "BLE + Nostr",
  },
  "#region": {
    tag: "Country or region · ~1000km",
    description:
      "Country-wide coverage. Any Airhop or bitchat user in the region can join and read messages.",
    transport: "BLE + Nostr",
  },
};

// Transport / visibility option lists lived here. Removed alongside the store
// fields they fed, since nothing in the send path ever read them.

interface Props {
  channel: string | null;
  onClose: () => void;
  // Called after leaving so the parent can navigate away if needed.
  onLeave?: () => void;
  // Called after a rename so the parent can track the new channel name.
  onRename?: (newName: string) => void;
}

export default function ChannelInfoSheet({
  channel,
  onClose,
  onLeave,
  onRename,
}: Props): React.JSX.Element | null {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const {
    removeChannel,
    renameChannel,
    channelDescriptions,
    setChannelDescription,
  } = useChatStore();
  const { peers, removePeer } = usePeerStore();
  const peerList = [...peers.values()];

  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  if (channel === null) return null;

  const isDefault = DEFAULT_CHANNEL_NAMES.has(channel);
  const scopeData = CHANNEL_SCOPE[channel];

  // Location-channel state, read live from the mesh service.
  const isGeo = isGeoChannel(channel);
  const geohash = isGeo
    ? (getMeshService()?.getChannelGeohash(channel) ?? null)
    : null;
  const geoParticipants = isGeo
    ? (getMeshService()?.getGeoParticipants(channel) ?? [])
    : [];

  // Resolved description: user-saved > protocol default > custom fallback.
  const resolvedDescription =
    channelDescriptions[channel] ??
    scopeData?.description ??
    "A custom channel. Anyone who knows the name can join from any Airhop or bitchat device.";

  function startEdit(): void {
    setDraftName(channel!.replace(/^#/, ""));
    setDraftDescription(channelDescriptions[channel!] ?? "");
    setNameError(null);
    setIsEditing(true);
  }

  function saveEdit(): void {
    const cleanName = "#" + draftName.trim().replace(/^#+/, "");
    const wantsRename = cleanName !== channel && cleanName.length > 1;

    // renameChannel reports whether it actually happened. Trusting a rename
    // that silently no-opped (name already taken) meant the follow-up edits
    // below were applied to the OTHER channel, overwriting its description.
    const renamed = wantsRename ? renameChannel(channel!, cleanName) : false;
    if (wantsRename && !renamed) {
      setNameError("A channel with that name already exists.");
      return;
    }

    const targetChannel = renamed ? cleanName : channel!;
    setChannelDescription(targetChannel, draftDescription.trim());
    setIsEditing(false);
    if (renamed) {
      if (onRename) {
        onRename(cleanName);
      } else {
        onClose();
      }
    }
  }

  function cancelEdit(): void {
    setIsEditing(false);
  }

  function handleLeave(): void {
    removeChannel(channel!);
    onClose();
    onLeave?.();
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Centered header: icon + name + scope tag. Pencil sits in the bottom-right corner. */}
          <View style={styles.headerCenter}>
            <View style={styles.iconWrap}>
              <Feather name="hash" size={22} color={Colors.textPrimary} />
            </View>

            <View style={styles.nameRow}>
              {isEditing ? (
                <TextInput
                  style={styles.nameInput}
                  value={draftName}
                  onChangeText={(text) => {
                    setDraftName(text);
                    // Clear the collision warning as soon as they edit.
                    if (nameError !== null) setNameError(null);
                  }}
                  placeholder="channel-name"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="none"
                  selectionColor={Colors.accent}
                  textAlign="center"
                />
              ) : (
                <Text style={styles.channelName}>
                  {channel.replace(/^#/, "")}
                </Text>
              )}
              {isEditing && (
                <View style={styles.editControls}>
                  <Pressable
                    onPress={cancelEdit}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel"
                  >
                    <Feather name="x" size={15} color={Colors.textMuted} />
                  </Pressable>
                  <Pressable
                    onPress={saveEdit}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel="Save"
                  >
                    <Feather name="check" size={15} color={Colors.accent} />
                  </Pressable>
                </View>
              )}
            </View>

            {nameError !== null && (
              <Text style={styles.nameError}>{nameError}</Text>
            )}

            <Text style={styles.scopeTag}>
              {scopeData?.tag ?? "Custom channel"}
            </Text>

            {/* Edit pencil: bottom-right of the header section */}
            {!isDefault && !isEditing && (
              <Pressable
                style={styles.pencilCorner}
                onPress={startEdit}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Edit channel"
              >
                <Feather name="edit-2" size={14} color={Colors.textMuted} />
              </Pressable>
            )}
          </View>

          <View style={styles.divider} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            {/* About */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>About</Text>
              {isEditing ? (
                <TextInput
                  style={styles.descriptionInput}
                  value={draftDescription}
                  onChangeText={setDraftDescription}
                  placeholder="Describe this channel…"
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  selectionColor={Colors.accent}
                  autoFocus
                />
              ) : (
                <Text style={styles.description}>{resolvedDescription}</Text>
              )}
            </View>

            {/* Privacy: states what actually happens on the wire. The old
                Visibility / Transport rows showed stored values that no send
                path ever consulted, so a channel could read "Private" while being
                broadcast in the clear. */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Privacy</Text>
              <View style={styles.infoRow}>
                <Feather name="globe" size={14} color={Colors.textSecondary} />
                <Text style={styles.infoValue}>
                  Public · unencrypted broadcast
                </Text>
              </View>
              <Text style={styles.infoHint}>
                Everyone in range who joins this channel can read every message.
                Use a direct message for private conversation. DMs are
                end-to-end encrypted.
              </Text>
            </View>

            {/* Reach: how far this channel actually travels right now.
                A location channel spans BLE *and* its Nostr geohash cell, but
                only once a position has been resolved. With location denied it
                is BLE-only, and saying so beats silently behaving differently
                from the description above. */}
            {isGeo && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Reach</Text>
                {geohash !== null ? (
                  <>
                    <View style={styles.infoRow}>
                      <Feather
                        name="map-pin"
                        size={14}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.infoValue}>
                        Bluetooth + Nostr · {geohash}
                      </Text>
                    </View>
                    <Text style={styles.infoHint}>
                      {`Anyone in this area cell can take part, even out of Bluetooth range. ${
                        geoParticipants.length > 0
                          ? `${String(geoParticipants.length)} active over the internet in the last few minutes.`
                          : "Nobody active over the internet right now."
                      }`}
                    </Text>
                  </>
                ) : (
                  <>
                    <View style={styles.infoRow}>
                      <Feather
                        name="bluetooth"
                        size={14}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.infoValue}>Bluetooth only</Text>
                    </View>
                    <Text style={styles.infoHint}>
                      Location is unavailable, so this channel can&apos;t reach
                      its area cell over the internet. It still works normally
                      with nearby devices over Bluetooth.
                    </Text>
                  </>
                )}
              </View>
            )}

            {/* Members: live BLE peer data */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                {`Members · ${peerList.length}`}
              </Text>
              {peerList.length > 0 ? (
                <View style={styles.memberList}>
                  {peerList.map((peer) => {
                    const name = peer.nickname || peerIDToUsername(peer.peerID);
                    return (
                      <View key={peer.peerID} style={styles.memberRow}>
                        <Avatar
                          username={name}
                          peerID={peer.peerID}
                          size={30}
                        />
                        <Text style={styles.memberName} numberOfLines={1}>
                          {name}
                        </Text>
                        <StatusDot status="online" size={8} />
                        <Pressable
                          style={styles.removeBtn}
                          onPress={() => removePeer(peer.peerID)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityRole="button"
                          accessibilityLabel={`Remove ${name} from local view`}
                        >
                          <Feather
                            name="x"
                            size={14}
                            color={Colors.textMuted}
                          />
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.noMembers}>
                  No peers detected via BLE yet.
                </Text>
              )}
            </View>

            {/* Share */}
            {/* (removed: channel name visible in every screen header) */}

            {/* Actions: leave */}
            {!isDefault ? (
              <View style={styles.actions}>
                <Pressable
                  style={styles.leaveBtn}
                  onPress={handleLeave}
                  accessibilityRole="button"
                  accessibilityLabel="Leave channel"
                >
                  <Feather name="log-out" size={15} color={Colors.danger} />
                  <Text style={styles.leaveBtnText}>Leave</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.defaultNotice}>
                <Feather name="lock" size={13} color={Colors.textMuted} />
                <Text style={styles.defaultNoticeText}>
                  Default channels cannot be left. They are part of the Airhop
                  mesh protocol.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      maxHeight: "85%",
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.borderStrong,
      alignSelf: "center",
      marginTop: Spacing.md,
      marginBottom: Spacing.sm,
    },
    // ---- Header (centered) ----------------------------------------------------
    headerCenter: {
      alignItems: "center",
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.lg,
      gap: Spacing.sm,
    },
    pencilCorner: {
      position: "absolute",
      right: Spacing.sm,
      bottom: Spacing.sm,
    },
    iconWrap: {
      width: 52,
      height: 52,
      borderRadius: Radius.lg,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
      paddingHorizontal: Spacing.xl,
      gap: Spacing.xs,
    },
    channelName: {
      flex: 1,
      fontSize: FontSize.xl,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      textAlign: "center",
    },
    scopeTag: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
    },
    editControls: {
      flexDirection: "row",
      gap: Spacing.sm,
      marginLeft: Spacing.xs,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginHorizontal: Spacing.xl,
      marginBottom: Spacing.xs,
    },
    // ---- Header name input (edit mode) ----------------------------------------
    nameInput: {
      flex: 1,
      fontSize: FontSize.xl,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.sm,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      textAlign: "center",
    },
    // ---- Body ------------------------------------------------------------------
    body: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing["3xl"],
      gap: Spacing.xl,
    },
    section: {
      gap: Spacing.sm,
    },
    sectionLabel: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    description: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      lineHeight: 22,
    },
    descriptionInput: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      lineHeight: 22,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      minHeight: 72,
      textAlignVertical: "top",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    infoValue: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    // Explanatory line under a value, e.g. what "Public" actually means.
    infoHint: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      marginTop: Spacing.xs,
      lineHeight: 18,
    },
    nameError: {
      fontSize: FontSize.sm,
      color: Colors.danger,
      textAlign: "center",
      marginTop: Spacing.xs,
    },
    // Visibility / Transport pickers in edit mode, the same chip pattern as
    // the create-channel modal (channel-list.tsx).
    chipRow: {
      flexDirection: "row",
      gap: Spacing.sm,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: Spacing.md,
      paddingVertical: 7,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.bg,
    },
    chipActive: {
      borderColor: Colors.accent,
      backgroundColor: Colors.surface,
    },
    chipText: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontWeight: FontWeight.medium,
    },
    chipTextActive: {
      fontSize: FontSize.sm,
      color: Colors.textPrimary,
      fontWeight: FontWeight.semibold,
    },
    // ---- Members ---------------------------------------------------------------
    memberList: {
      gap: 2,
    },
    memberRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingVertical: 6,
    },
    memberName: {
      flex: 1,
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    removeBtn: {
      width: 28,
      height: 28,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center",
    },
    noMembers: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontStyle: "italic",
    },
    // ---- Actions ---------------------------------------------------------------
    actions: {
      marginTop: Spacing.sm,
    },
    leaveBtn: {
      width: "100%",
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
    },
    leaveBtnText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.danger,
    },
    // ---- Default channel notice -----------------------------------------------
    defaultNotice: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.sm,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.md,
      padding: Spacing.md,
      marginTop: Spacing.sm,
    },
    defaultNoticeText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: 18,
    },
  });
}
