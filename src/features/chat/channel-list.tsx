// Channel list screen.
// Two sections: Default Channels (bitchat-compatible, cannot be left) and
// Your Channels (user-created, joinable / leaveable).
// Tap a channel to open its message thread.
// Tap the info icon (top-right of each row) to see channel details.
// FAB at bottom-right to join or create a new channel.

import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useChatStore } from "../../store/chat-store";
import { usePeerStore } from "../../store/peer-store";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";
import ChannelInfoSheet from "./channel-info-sheet";

// Transport options for new channels.
const TRANSPORT_OPTIONS = ["BLE", "Nostr", "BLE + Nostr"] as const;
type TransportOption = (typeof TRANSPORT_OPTIONS)[number];

// Visibility options for new channels.
const VISIBILITY_OPTIONS = ["Public", "Private"] as const;
type VisibilityOption = (typeof VISIBILITY_OPTIONS)[number];

// The 6 bitchat-compatible default channels. These are always present and
// cannot be removed; they are part of the mesh protocol.
const DEFAULT_CHANNEL_NAMES = new Set([
  "#bluetooth",
  "#block",
  "#neighborhood",
  "#city",
  "#province",
  "#region",
]);

// Scope info for built-in bitchat-compatible channels.
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

interface ChannelSection {
  title: string;
  isDefault: boolean;
  isArchived: boolean;
  data: string[];
}

interface Props {
  onSelectChannel: (channel: string) => void;
  // Increment this to programmatically open the join/create modal (e.g. from
  // the App.tsx header + New button). Counter pattern avoids boolean edge cases.
  newChannelTrigger?: number;
}

export default function ChannelList({
  onSelectChannel,
  newChannelTrigger,
}: Props): React.JSX.Element {
  const {
    channels,
    messages,
    addChannel,
    removeChannel,
    unreadCounts,
    setChannelTransport,
    setChannelVisibility,
    archivedChannels,
  } = useChatStore();
  // Live peer count, real BLE data, not a stub.
  const peerCount = usePeerStore((s) => s.peers.size);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  const [newTransport, setNewTransport] =
    useState<TransportOption>("BLE + Nostr");
  const [newVisibility, setNewVisibility] =
    useState<VisibilityOption>("Public");
  const [infoChannel, setInfoChannel] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );

  // Watch the trigger counter from App.tsx header button.
  // Initialise with the current counter value so a component remount (e.g.
  // after navigating back from a thread) does not reopen the modal.
  const prevTrigger = useRef(newChannelTrigger ?? 0);
  useEffect(() => {
    if (
      newChannelTrigger !== undefined &&
      newChannelTrigger > prevTrigger.current
    ) {
      prevTrigger.current = newChannelTrigger;
      setShowJoinModal(true);
    }
  }, [newChannelTrigger]);

  function toggleSection(title: string): void {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  function handleAdd(): void {
    const name = newChannel.trim().replace(/^#*/, "#");
    if (name.length < 2) return;
    // Duplicate guard: normalise for case-insensitive comparison.
    if (publicChannels.some((c) => c.toLowerCase() === name.toLowerCase()))
      return;
    addChannel(name);
    setChannelTransport(name, newTransport);
    setChannelVisibility(name, newVisibility);
    setNewChannel("");
    setNewTransport("BLE + Nostr");
    setNewVisibility("Public");
    setShowJoinModal(false);
  }

  function handleLeave(channel: string): void {
    removeChannel(channel);
    setInfoChannel(null);
  }
  void handleLeave;

  // Public channels only (filter out dm: prefixed channels).
  const publicChannels = channels.filter((c) => !c.startsWith("dm:"));
  const defaultChannels = publicChannels.filter((c) =>
    DEFAULT_CHANNEL_NAMES.has(c),
  );
  const ownChannels = publicChannels.filter(
    (c) => !DEFAULT_CHANNEL_NAMES.has(c) && !archivedChannels.includes(c),
  );
  const archivedList = publicChannels.filter(
    (c) => !DEFAULT_CHANNEL_NAMES.has(c) && archivedChannels.includes(c),
  );

  // Normalised input for duplicate detection (shown while typing).
  const normalizedInput = newChannel.trim().replace(/^#*/, "#").toLowerCase();
  const nameAlreadyExists =
    normalizedInput.length > 1 &&
    publicChannels.some((c) => c.toLowerCase() === normalizedInput);

  // Pass empty data array for collapsed sections.
  const sections: ChannelSection[] = [
    {
      title: "Default Channels",
      isDefault: true,
      isArchived: false,
      data: collapsedSections.has("Default Channels") ? [] : defaultChannels,
    },
    {
      title: "Your Channels",
      isDefault: false,
      isArchived: false,
      data: collapsedSections.has("Your Channels") ? [] : ownChannels,
    },
    ...(archivedList.length > 0
      ? [
          {
            title: "Archived",
            isDefault: false,
            isArchived: true,
            data: collapsedSections.has("Archived") ? [] : archivedList,
          },
        ]
      : []),
  ];

  const isDefaultChannel =
    infoChannel !== null && DEFAULT_CHANNEL_NAMES.has(infoChannel);
  void isDefaultChannel;

  function renderChannelRow(
    item: string,
    isArchived: boolean,
  ): React.JSX.Element {
    const msgs = messages[item] ?? [];
    const last = msgs[msgs.length - 1];
    const unread = unreadCounts[item] ?? 0;
    const scopeTag = CHANNEL_SCOPE[item]?.tag;
    const isDefault = DEFAULT_CHANNEL_NAMES.has(item);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.row,
          isArchived && styles.rowArchived,
          pressed && styles.rowPressed,
        ]}
        onPress={() => {
          if (isArchived) {
            setInfoChannel(item);
          } else {
            onSelectChannel(item);
          }
        }}
        accessibilityRole="button"
        accessibilityLabel={
          isArchived ? `Archived channel ${item}` : `Open channel ${item}`
        }
      >
        <View style={styles.rowContent}>
          {/* Top row: channel name + timestamp + info icon */}
          <View style={styles.rowTop}>
            <View style={styles.rowNameWrap}>
              {isArchived && (
                <Feather
                  name="archive"
                  size={12}
                  color={Colors.textMuted}
                  style={styles.rowArchiveIcon}
                />
              )}
              <Text
                style={[
                  styles.channelName,
                  isArchived && styles.channelNameMuted,
                ]}
                numberOfLines={1}
              >
                <Text style={styles.channelHash}>#</Text>
                {item.replace(/^#/, "")}
              </Text>
            </View>
            <View style={styles.rowTopRight}>
              {last && !isArchived ? (
                <Text style={styles.timestamp}>
                  {formatTime(last.timestampMs)}
                </Text>
              ) : null}
              {!isArchived && (
                <Pressable
                  style={styles.infoBtn}
                  onPress={() => setInfoChannel(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={`Info for channel ${item}`}
                >
                  <Feather name="info" size={14} color={Colors.textMuted} />
                </Pressable>
              )}
            </View>
          </View>

          {/* Scope tag + live peer count for default channels */}
          {scopeTag !== undefined ? (
            <Text style={styles.channelScope} numberOfLines={1}>
              {scopeTag}
              {isDefault
                ? peerCount > 0
                  ? `  \u00b7  ${peerCount} nearby`
                  : "  \u00b7  0 nearby"
                : null}
            </Text>
          ) : null}

          {/* Bottom row: preview + badge (hidden when archived) */}
          {!isArchived && (
            <View style={styles.rowBottom}>
              {last ? (
                <Text style={styles.preview} numberOfLines={1}>
                  <Text style={styles.previewSender}>
                    {last.isMine ? "You" : last.senderNickname}:{" "}
                  </Text>
                  {last.text}
                </Text>
              ) : (
                <Text style={styles.previewEmpty}>No messages yet</Text>
              )}
              {unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unread > 99 ? "99+" : unread}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList<string, ChannelSection>
        sections={sections}
        keyExtractor={(item) => item}
        renderItem={({ item, section }) =>
          renderChannelRow(item, section.isArchived)
        }
        renderSectionHeader={({ section }) => {
          const isCollapsed = collapsedSections.has(section.title);
          return (
            <Pressable
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.title)}
              accessibilityRole="button"
              accessibilityLabel={`${isCollapsed ? "Expand" : "Collapse"} ${section.title}`}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionChevron}>
                <Feather
                  name={isCollapsed ? "chevron-right" : "chevron-down"}
                  size={14}
                  color={Colors.textMuted}
                />
              </View>
            </Pressable>
          );
        }}
        renderSectionFooter={({ section }) => {
          if (section.isDefault || collapsedSections.has(section.title))
            return null;
          if (section.isArchived) return null;
          if (ownChannels.length > 0) return null;
          return (
            <View style={styles.ownEmpty}>
              <Text style={styles.ownEmptyText}>
                No custom channels yet. Tap{" "}
                <Text style={styles.ownEmptyAccent}>New</Text> above to join or
                create one.
              </Text>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
      />

      {/* Join or create channel modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowJoinModal(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Create a channel</Text>
            <Text style={styles.modalHint}>
              Choose a name, visibility, and transport for your channel. Anyone
              with the same name can find and join it.
            </Text>
            <View>
              <TextInput
                style={[
                  styles.modalInput,
                  nameAlreadyExists && styles.modalInputError,
                ]}
                value={newChannel}
                onChangeText={setNewChannel}
                placeholder="#channel-name"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoFocus
                onSubmitEditing={handleAdd}
                returnKeyType="done"
                selectionColor={Colors.accent}
              />
              {nameAlreadyExists && (
                <Text style={styles.inputError}>
                  A channel with this name already exists.
                </Text>
              )}
            </View>

            {/* Visibility */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Visibility</Text>
              <View style={styles.optionRow}>
                {VISIBILITY_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt}
                    style={[
                      styles.optionChip,
                      newVisibility === opt && styles.optionChipActive,
                    ]}
                    onPress={() => setNewVisibility(opt)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: newVisibility === opt }}
                  >
                    <Feather
                      name={opt === "Private" ? "lock" : "globe"}
                      size={13}
                      color={
                        newVisibility === opt
                          ? Colors.textPrimary
                          : Colors.textMuted
                      }
                    />
                    <Text
                      style={
                        newVisibility === opt
                          ? styles.optionChipTextActive
                          : styles.optionChipText
                      }
                    >
                      {opt}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Transport */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Transport</Text>
              <View style={styles.optionRow}>
                {TRANSPORT_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt}
                    style={[
                      styles.optionChip,
                      newTransport === opt && styles.optionChipActive,
                    ]}
                    onPress={() => setNewTransport(opt)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: newTransport === opt }}
                  >
                    <Text
                      style={
                        newTransport === opt
                          ? styles.optionChipTextActive
                          : styles.optionChipText
                      }
                    >
                      {opt}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => {
                  setNewChannel("");
                  setNewTransport("BLE + Nostr");
                  setNewVisibility("Public");
                  setShowJoinModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalConfirm,
                  nameAlreadyExists && styles.modalConfirmDisabled,
                ]}
                onPress={handleAdd}
                disabled={nameAlreadyExists}
              >
                <Text style={styles.modalConfirmText}>Create</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Channel info sheet (shared component) */}
      <ChannelInfoSheet
        channel={infoChannel}
        onClose={() => setInfoChannel(null)}
        onRename={(newName) => setInfoChannel(newName)}
      />
    </View>
  );
}

function formatTime(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  if (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  ) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 88,
  },
  // ---- Section headers -------------------------------------------------------
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.bg,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionChevron: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  // ---- Channel rows ----------------------------------------------------------
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    gap: Spacing.md,
    minHeight: 72,
    backgroundColor: Colors.surface,
  },
  rowPressed: {
    backgroundColor: Colors.surfacePressed,
  },
  rowContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowTopRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    flexShrink: 0,
  },
  rowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  channelName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  channelHash: {
    color: Colors.textMuted,
    fontWeight: FontWeight.regular,
  },
  channelScope: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 0.1,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  infoBtn: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
  },
  preview: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  previewSender: {
    color: Colors.textMuted,
  },
  previewEmpty: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  badge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: Spacing.base,
  },
  // ---- Option chips (create modal) ------------------------------------------
  optionGroup: {
    gap: Spacing.xs,
  },
  optionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  optionRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  optionChip: {
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
  optionChipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.surface,
  },
  optionChipText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  optionChipTextActive: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  // ---- Your Channels empty state ---------------------------------------------
  ownEmpty: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  ownEmptyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: "italic",
    lineHeight: 18,
  },
  ownEmptyAccent: {
    color: Colors.accent,
    fontStyle: "normal",
    fontWeight: FontWeight.semibold,
  },
  // ---- Modals ----------------------------------------------------------------
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
  modalHint: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 19,
  },
  modalInput: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalInputError: {
    borderColor: Colors.danger,
  },
  inputError: {
    fontSize: FontSize.xs,
    color: Colors.danger,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
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
    backgroundColor: Colors.border,
  },
  modalConfirmText: {
    fontSize: FontSize.base,
    color: Colors.textInverse,
    fontWeight: FontWeight.semibold,
  },
  // ---- Archived channel rows -------------------------------------------------
  rowArchived: {
    opacity: 0.55,
  },
  rowNameWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    marginRight: Spacing.sm,
    overflow: "hidden",
  },
  rowArchiveIcon: {
    flexShrink: 0,
  },
  channelNameMuted: {
    color: Colors.textMuted,
  },
});
