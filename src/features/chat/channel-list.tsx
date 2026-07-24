// Channel list screen.
// Two sections: Default Channels (bitchat-compatible, cannot be left) and
// Your Rooms (user-created channels and private groups, joinable / leaveable).
// Tap a channel to open its message thread. Swipe left on any row for More:
// chat info, and for Your Rooms also pin and delete.
//
// The header "+" (App.tsx) opens a chooser: channel or group. Both are private
// and both are encrypted, so the difference (a shareable link and no member cap
// versus a fixed signed roster that stays on Bluetooth) has to be stated where
// the choice is made. Picking one closes the chooser and opens that form.

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { generateChannelKey } from "../../core/mesh/channel-crypto";
import {
  geohashLevelName,
  isGeoChannel,
  isManualGeoChannel,
  manualGeohashOf,
} from "../../services/geohash-channel-service";
import { getMeshService } from "../../services/mesh-service";
import { showAlert } from "../../store/alert-store";
import { useChatStore } from "../../store/chat-store";
import { useGroupStore } from "../../store/group-store";
import { usePeerStore } from "../../store/peer-store";
import { usePlaceNamesStore } from "../../store/place-names-store";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { sortConversationsByActivity } from "../../utils/conversation-order";
import { messagePreviewText } from "../../utils/message-preview";
import ChannelInfoSheet from "./channel-info-sheet";
import { GeohashJumpSheet } from "./geohash-jump-sheet";
import { NewGroupSheet } from "./new-group-sheet";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// How long the pull-to-refresh spinner stays up. The refresh itself (BLE
// rescan kick) returns instantly, but a flash-then-gone spinner reads as
// broken, so hold it briefly for legible feedback.
const REFRESH_SPINNER_MS = 700;

// How often to re-read geohash channel participant counts. They change off a
// Nostr subscription, so a slow poll keeps the list live without a per-event
// re-render of the whole screen.
const GEO_COUNT_POLL_MS = 5000;

// Per-channel transport and visibility options used to live here. They were
// removed because nothing in the send path ever read them. See the note in the
// create-channel modal below.

// The 6 bitchat-compatible default channels. Always present, cannot be
// removed: they are part of the mesh protocol.
const DEFAULT_CHANNEL_NAMES = new Set([
  "#bluetooth",
  "#block",
  "#neighborhood",
  "#city",
  "#province",
  "#region",
]);

// Default Channels is collapsed to this many rows until the user expands it.
const DEFAULT_VISIBLE_COUNT = 3;

// Single shared left/right inset used by BOTH the section headers and the
// channel rows, so their leading text ("DEFAULT CHANNELS" / "#bluetooth")
// starts at the same x position, one constant referenced twice rather than
// two separate `Spacing.base` reads that could drift apart later.
const ROW_INSET = Spacing.base;

// Scope info for built-in bitchat-compatible channels.
const CHANNEL_SCOPE: Record<string, { tag: string; description: string }> = {
  "#bluetooth": {
    tag: "Local mesh · Bluetooth only",
    description:
      "Reaches devices within Bluetooth range (roughly 10 to 100 metres). No internet required. Ideal for local coordination.",
  },
  "#block": {
    tag: "City block · ~100m",
    description:
      "City-block level coverage. Messages are bridged over the internet so peers outside Bluetooth range but nearby can participate.",
  },
  "#neighborhood": {
    tag: "Neighborhood · ~1km",
    description:
      "Neighborhood coverage. Relay-assisted so peers across the area are reachable even without a direct Bluetooth link.",
  },
  "#city": {
    tag: "City · ~10km",
    description:
      "City-wide channel. Uses geo-located internet relays to reach peers across the metro area.",
  },
  "#province": {
    tag: "Province or state · ~100km",
    description:
      "Provincial or state coverage. Bridged over the internet for regional reach across hundreds of kilometres.",
  },
  "#region": {
    tag: "Country or region · ~1000km",
    description:
      "Country-wide coverage. Any Airhop or bitchat user in the region can join and read messages.",
  },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChannelSection {
  title: string;
  isDefault: boolean;
  unread: number;
  data: string[];
}

interface Props {
  onSelectChannel: (channel: string) => void;
  // Increment this to programmatically open the join/create modal (e.g. from
  // the App.tsx header + button). Counter pattern avoids boolean edge cases.
  newChannelTrigger?: number;
}

// Human-readable label for a channel key, for dialogs and sheet headers that
// would otherwise print the raw store key. Named channels (#city) already read
// fine; groups and teleported cells are keyed group:<id> / geohash:<gh>, so
// show the group's name or #<geohash> instead.
function channelLabel(channel: string): string {
  if (isManualGeoChannel(channel)) return `#${manualGeohashOf(channel)}`;
  if (channel.startsWith("group:")) {
    return useGroupStore.getState().nameForChannel(channel) ?? "Group";
  }
  return channel;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChannelList({
  onSelectChannel,
  newChannelTrigger,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const {
    channels,
    messages,
    removeChannel,
    unreadCounts,
    pinnedChannels,
    togglePinChannel,
    mutedChannels,
    toggleMuteChannel,
    clearChannelMessages,
    joinPrivateChannel,
  } = useChatStore();
  // Live BLE peer count. This is the right number ONLY for #bluetooth, the
  // local-mesh channel; the geohash channels are populated over Nostr, not BLE.
  const peerCount = usePeerStore((s) => s.peers.size);
  // Live participant count per geohash channel, from Nostr presence + recent
  // posts in the cell (kind 20000/20001), polled since it updates off a network
  // subscription rather than a store. #bluetooth is absent here: it is BLE-only
  // and uses peerCount instead. Empty until location resolves and relays answer,
  // in which case a geo channel is genuinely running BLE-only and shows 0.
  const [geoCounts, setGeoCounts] = useState<Record<string, number>>({});
  // Channel -> the geohash it currently resolves to, so a row can look up the
  // cell's place name. A named channel's cell depends on location (null when
  // off); a teleported cell is fixed.
  const [geoHashes, setGeoHashes] = useState<Record<string, string>>({});
  const placeNames = usePlaceNamesStore((s) => s.names);
  useEffect(() => {
    function sample(): void {
      const service = getMeshService();
      if (!service) return;
      const next: Record<string, number> = {};
      const hashes: Record<string, string> = {};
      for (const ch of channels) {
        if (!isGeoChannel(ch)) continue;
        next[ch] = service.getGeoParticipants(ch).length;
        const gh = manualGeohashOf(ch) ?? service.getChannelGeohash(ch);
        if (gh !== null) {
          hashes[ch] = gh;
          // Best-effort, cached and de-duped inside the store.
          usePlaceNamesStore.getState().resolve(gh);
        }
      }
      setGeoCounts((prev) => {
        const keys = Object.keys(next);
        const same =
          keys.length === Object.keys(prev).length &&
          keys.every((k) => prev[k] === next[k]);
        return same ? prev : next;
      });
      setGeoHashes((prev) => {
        const keys = Object.keys(hashes);
        const same =
          keys.length === Object.keys(prev).length &&
          keys.every((k) => prev[k] === hashes[k]);
        return same ? prev : hashes;
      });
    }
    sample();
    const timer = setInterval(sample, GEO_COUNT_POLL_MS);
    return () => clearInterval(timer);
  }, [channels]);

  // The "+" opens a chooser first, so a channel and a group are seen side by
  // side at the moment of deciding. Picking one closes it and opens that form.
  const [showChooser, setShowChooser] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showGeohash, setShowGeohash] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  // Reach for a new channel. Defaults to Bluetooth-only, the most private
  // option; the user opts into internet reach.
  const [newChannelOverNostr, setNewChannelOverNostr] = useState(false);
  const [infoChannel, setInfoChannel] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );
  const [showAllDefault, setShowAllDefault] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // Which "Your Rooms" row currently has its swipe-revealed More sheet open.
  const [moreOptionsChannel, setMoreOptionsChannel] = useState<string | null>(
    null,
  );
  // Open Swipeable rows, keyed by channel, so tapping an action can close its
  // own row instead of leaving it hanging open.
  const swipeableRefs = useRef(new Map<string, Swipeable>()).current;

  function closeSwipeable(channel: string): void {
    swipeableRefs.get(channel)?.close();
  }

  // Watch the trigger counter from App.tsx header button. Initialise with the
  // current counter value so a component remount (e.g. after navigating back
  // from a thread) does not reopen the modal.
  const prevTrigger = useRef(newChannelTrigger ?? 0);
  useEffect(() => {
    if (
      newChannelTrigger !== undefined &&
      newChannelTrigger > prevTrigger.current
    ) {
      prevTrigger.current = newChannelTrigger;
      setShowChooser(true);
    }
  }, [newChannelTrigger]);

  // ---- Derived channel lists ----------------------------------------------

  // Public channels only (exclude dm: and group: prefixed channels).
  const publicChannels = channels.filter(
    (c) => !c.startsWith("dm:") && !c.startsWith("group:"),
  );
  // Private groups the user belongs to, keyed as group:<id>.
  const groupChannels = channels.filter((c) => c.startsWith("group:"));
  const defaultChannels = publicChannels.filter((c) =>
    DEFAULT_CHANNEL_NAMES.has(c),
  );
  // Your Rooms: user-created channels and private groups, pinned
  // first, then most recent activity first. Default channels keep their curated
  // protocol order (below) and are deliberately not reordered by activity.
  const ownChannels = sortConversationsByActivity(
    [
      ...publicChannels.filter((c) => !DEFAULT_CHANNEL_NAMES.has(c)),
      ...groupChannels,
    ],
    messages,
    pinnedChannels,
  );

  // Normalised input for duplicate detection (shown while typing).
  const normalizedInput = newChannel.trim().replace(/^#*/, "#").toLowerCase();
  const nameAlreadyExists =
    normalizedInput.length > 1 &&
    publicChannels.some((c) => c.toLowerCase() === normalizedInput);

  // Section-level unread totals, computed from the FULL channel list (not the
  // possibly-collapsed/sliced `data` below) so the badge stays accurate even
  // while a section is collapsed or showing only its top rows.
  // Section badge totals exclude muted channels, matching the app-level badges:
  // a muted channel keeps its own per-row count but does not add to any header.
  function sumUnread(list: string[]): number {
    return list.reduce(
      (sum, c) =>
        sum + (mutedChannels.includes(c) ? 0 : (unreadCounts[c] ?? 0)),
      0,
    );
  }

  const sections: ChannelSection[] = [
    {
      title: "Default Channels",
      isDefault: true,
      unread: sumUnread(defaultChannels),
      data: collapsedSections.has("Default Channels")
        ? []
        : showAllDefault
          ? defaultChannels
          : defaultChannels.slice(0, DEFAULT_VISIBLE_COUNT),
    },
    {
      title: "Your Rooms",
      isDefault: false,
      unread: sumUnread(ownChannels),
      data: collapsedSections.has("Your Rooms") ? [] : ownChannels,
    },
  ];

  // ---- Handlers ------------------------------------------------------------

  function handleRefresh(): void {
    setRefreshing(true);
    getMeshService()?.refresh();
    setTimeout(() => setRefreshing(false), REFRESH_SPINNER_MS);
  }

  function toggleSection(title: string): void {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  // Close the channel form and clear its inputs. `backToChooser` reopens the
  // step before it, so Cancel reads as "go back" rather than "lose my place":
  // the user came here from a choice and may have picked the wrong one.
  // Dismissing by backdrop or system back leaves entirely, as usual.
  function resetJoinModal(backToChooser = false): void {
    setNewChannel("");
    setNewChannelOverNostr(false);
    setShowJoinModal(false);
    if (backToChooser) setShowChooser(true);
  }

  function handleAdd(): void {
    const name = newChannel.trim().replace(/^#*/, "#");
    if (name.length < 2 || nameAlreadyExists) return;
    // Every custom channel is private and end-to-end encrypted: it gets a fresh
    // key here, shared only with people you send the invite link to. Reach is
    // the creator's choice: local mesh only, or also bridged over Nostr.
    joinPrivateChannel(name, generateChannelKey(), newChannelOverNostr);
    // Created, so there is nothing to go back to.
    resetJoinModal();
  }

  // ---- Your Rooms swipe / more-options actions -----------------------------

  function handleSwipeMore(channel: string): void {
    closeSwipeable(channel);
    setMoreOptionsChannel(channel);
  }

  function handleMuteChat(channel: string): void {
    setMoreOptionsChannel(null);
    toggleMuteChannel(channel);
  }

  function handleClearChat(channel: string): void {
    setMoreOptionsChannel(null);
    showAlert(
      "Clear messages",
      `Delete all messages in ${channelLabel(channel)}? This can't be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => clearChannelMessages(channel),
        },
      ],
    );
  }

  function handleLeaveChannel(channel: string): void {
    setMoreOptionsChannel(null);
    showAlert(
      "Leave room",
      `Leave ${channelLabel(channel)}? You will stop receiving its messages, and its history is removed from this device.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => removeChannel(channel),
        },
      ],
    );
  }

  // ---- Row rendering ---------------------------------------------------

  function renderChannelRow(
    item: string,
    isYourChannel: boolean,
  ): React.JSX.Element {
    const msgs = messages[item] ?? [];
    const last = msgs[msgs.length - 1];
    const unread = unreadCounts[item] ?? 0;
    // A teleported cell (geohash:<gh>) is a location channel keyed by a fixed
    // geohash. It has no CHANNEL_SCOPE entry, so its scope line is derived from
    // the geohash length (its coverage level) and marked teleported.
    const isManualGeo = isManualGeoChannel(item);
    const manualGh = isManualGeo ? (manualGeohashOf(item) ?? "") : "";
    const scopeTag = isManualGeo
      ? `${geohashLevelName(manualGh)}  ·  teleported`
      : CHANNEL_SCOPE[item]?.tag;
    // Reverse-geocoded place name for this cell, e.g. "~Kumaraswamy Layout",
    // shown between the coverage tag and the active count. Only present once the
    // cell has a geohash (teleported always; named only with location on).
    const rowGeohash = isManualGeo ? manualGh : geoHashes[item];
    const placeName =
      rowGeohash !== undefined ? placeNames[rowGeohash] : undefined;
    const isDefault = DEFAULT_CHANNEL_NAMES.has(item);
    const isPinned = isYourChannel && pinnedChannels.includes(item);
    const isMuted = mutedChannels.includes(item);
    // Presence count and its label depend on the channel's transport:
    // #bluetooth counts BLE peers in range; a geohash channel counts people
    // active in its cell over Nostr. Showing the BLE count on a geo channel is
    // what made #region read "0 nearby" while a city's worth of people were on
    // it over the internet.
    const isGeo = isGeoChannel(item);
    const isGroup = item.startsWith("group:");
    const groupName = isGroup
      ? useGroupStore.getState().nameForChannel(item)
      : undefined;
    const presenceCount = isGeo ? (geoCounts[item] ?? 0) : peerCount;
    const presenceLabel = isGeo ? "active" : "nearby";

    const row = (
      <Pressable
        style={styles.channelRow}
        onPress={() => onSelectChannel(item)}
        accessibilityRole="button"
        accessibilityLabel={`Open ${isGroup ? "group" : "channel"} ${groupName ?? item}`}
      >
        <View style={styles.channelRowBody}>
          {/* Head line: channel name + timestamp + pin indicator */}
          <View style={styles.channelRowHead}>
            <View style={styles.channelNameGroup}>
              {isGroup && (
                <Feather name="users" size={13} color={Colors.textMuted} />
              )}
              {isManualGeo && (
                <Feather name="map-pin" size={13} color={Colors.textMuted} />
              )}
              {isGroup ? (
                <Text style={styles.channelName} numberOfLines={1}>
                  {groupName ?? "Group"}
                </Text>
              ) : (
                <Text style={styles.channelName} numberOfLines={1}>
                  <Text style={styles.channelHash}>#</Text>
                  {isManualGeo ? manualGh : item.replace(/^#/, "")}
                </Text>
              )}
            </View>
            <View style={styles.channelRowMeta}>
              {last && (
                <Text style={styles.channelTimestamp}>
                  {formatTime(last.timestampMs)}
                </Text>
              )}
              {isMuted && (
                <Feather name="bell-off" size={13} color={Colors.textMuted} />
              )}
              {isPinned && (
                <MaterialCommunityIcons
                  name="pin"
                  size={13}
                  color={Colors.textMuted}
                />
              )}
            </View>
          </View>

          {/* Scope tag + place name + live count for location channels */}
          {scopeTag !== undefined && (
            <Text style={styles.channelScope} numberOfLines={1}>
              {scopeTag}
              {placeName !== undefined && `  ·  ~${placeName}`}
              {(isDefault || isManualGeo) &&
                `  ·  ${presenceCount} ${presenceLabel}`}
            </Text>
          )}

          {/* Foot line: preview + unread badge */}
          <View style={styles.channelRowFoot}>
            {last ? (
              <Text style={styles.channelPreview} numberOfLines={1}>
                <Text style={styles.channelPreviewSender}>
                  {last.isMine ? "You" : last.senderNickname}:{" "}
                </Text>
                {messagePreviewText(last)}
              </Text>
            ) : (
              <Text style={styles.channelPreviewEmpty}>No messages yet</Text>
            )}
            {unread > 0 && (
              <View style={styles.channelUnreadBadge}>
                <Text style={styles.channelUnreadBadgeText}>
                  {unread > 99 ? "99+" : unread}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );

    // Every row (Your Rooms and Default Channels alike) swipes left to
    // reveal More, the single consistent way to reach chat info, so
    // there's no separate inline info icon anywhere.
    return (
      <Animated.View
        layout={LinearTransition.duration(220)}
        entering={FadeIn.duration(180)}
      >
        <Swipeable
          ref={(ref) => {
            if (ref) swipeableRefs.set(item, ref);
            else swipeableRefs.delete(item);
          }}
          overshootRight={false}
          renderRightActions={() => (
            <View style={styles.swipeActions}>
              <Pressable
                style={styles.swipeAction}
                onPress={() => handleSwipeMore(item)}
                accessibilityRole="button"
                accessibilityLabel={`More options for ${item}`}
              >
                <Feather
                  name="more-horizontal"
                  size={18}
                  color={Colors.textSecondary}
                />
                <Text style={styles.swipeActionText}>More</Text>
              </Pressable>
            </View>
          )}
        >
          {row}
        </Swipeable>
      </Animated.View>
    );
  }

  // ---- Render ---------------------------------------------------------

  return (
    <View style={styles.container}>
      <SectionList<string, ChannelSection>
        sections={sections}
        keyExtractor={(item) => item}
        renderItem={({ item, section }) =>
          renderChannelRow(item, !section.isDefault)
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
              {section.unread > 0 && (
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>
                    {section.unread > 99 ? "99+" : section.unread}
                  </Text>
                </View>
              )}
              <View style={styles.sectionHeaderSpacer} />
              <View style={styles.trailingIconBtn}>
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
          if (collapsedSections.has(section.title)) return null;

          if (section.isDefault) {
            const hiddenCount = defaultChannels.length - DEFAULT_VISIBLE_COUNT;
            if (hiddenCount <= 0) return null;
            return (
              <Pressable
                style={styles.showMoreBtn}
                onPress={() => setShowAllDefault((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={
                  showAllDefault
                    ? "Show fewer default channels"
                    : `Show ${hiddenCount} more default channels`
                }
              >
                <Text style={styles.showMoreText}>
                  {showAllDefault ? "Show less" : `Show ${hiddenCount} more`}
                </Text>
                <Feather
                  name={showAllDefault ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={Colors.textMuted}
                />
              </Pressable>
            );
          }

          if (ownChannels.length > 0) return null;
          return (
            <View style={styles.ownEmpty}>
              <Feather
                name="hash"
                size={26}
                color={Colors.textMuted}
                style={styles.ownEmptyIcon}
              />
              <Text style={styles.ownEmptyText}>No rooms yet</Text>
              <Text style={styles.ownEmptyHint}>
                Tap <Text style={styles.ownEmptyAccent}>+</Text> above to join
                or create one
              </Text>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.textMuted}
          />
        }
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
      />

      {/* Join or create channel modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => resetJoinModal()}
      >
        <Pressable style={styles.modalOverlay} onPress={() => resetJoinModal()}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Create a channel</Text>
            <View style={styles.privacyNote}>
              <View style={styles.privacyNoteRow}>
                <Feather name="lock" size={14} color={Colors.online} />
                <Text style={styles.privacyNoteText}>
                  End-to-end encrypted. Only members can read the messages.
                </Text>
              </View>
              <View style={styles.privacyNoteRow}>
                <Feather name="link" size={14} color={Colors.textMuted} />
                <Text style={styles.privacyNoteText}>
                  Invite only. Anyone you share the link with can join. It stays
                  hidden from everyone else, even peers nearby.
                </Text>
              </View>
              <View style={styles.privacyNoteRow}>
                <Feather
                  name={newChannelOverNostr ? "globe" : "bluetooth"}
                  size={14}
                  color={Colors.textMuted}
                />
                <Text style={styles.privacyNoteText}>
                  {newChannelOverNostr
                    ? "Reaches members over Bluetooth and the internet."
                    : "Works over Bluetooth range, not the internet."}
                </Text>
              </View>
            </View>
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

            {/* Reach. Encryption is always on (the removed "Private"/"Nostr"
                pickers only set unread labels); this choice actually changes the
                send path: local mesh only, or also sealed and published over
                Nostr for out-of-range members. */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Reach</Text>
              <View style={styles.optionRow}>
                <Pressable
                  style={[
                    styles.optionChip,
                    !newChannelOverNostr && styles.optionChipActive,
                  ]}
                  onPress={() => setNewChannelOverNostr(false)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: !newChannelOverNostr }}
                >
                  <Feather
                    name="bluetooth"
                    size={13}
                    color={
                      newChannelOverNostr
                        ? Colors.textMuted
                        : Colors.textPrimary
                    }
                  />
                  <Text
                    style={
                      newChannelOverNostr
                        ? styles.optionChipText
                        : styles.optionChipTextActive
                    }
                  >
                    Bluetooth only
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.optionChip,
                    newChannelOverNostr && styles.optionChipActive,
                  ]}
                  onPress={() => setNewChannelOverNostr(true)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: newChannelOverNostr }}
                >
                  <Feather
                    name="globe"
                    size={13}
                    color={
                      newChannelOverNostr
                        ? Colors.textPrimary
                        : Colors.textMuted
                    }
                  />
                  <Text
                    style={
                      newChannelOverNostr
                        ? styles.optionChipTextActive
                        : styles.optionChipText
                    }
                  >
                    Bluetooth + Internet
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.reachHint}>
                {newChannelOverNostr
                  ? "Reaches members over the internet too. Relays can see the channel is active, never its messages or who is in it."
                  : "Stays on the local mesh. Most private, nothing leaves Bluetooth range."}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => resetJoinModal(true)}
              >
                <Text style={styles.modalCancelText}>Back</Text>
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

      {/* Pick the concept before the details. A channel and a group are both
          private and both encrypted, so the only way to choose sensibly is to
          see how they differ, side by side, at the moment of deciding. */}
      <Modal
        visible={showChooser}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChooser(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowChooser(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Start something new</Text>

            <View style={styles.moreRowsGroup}>
              <Pressable
                style={styles.chooserRow}
                onPress={() => {
                  setShowChooser(false);
                  setShowJoinModal(true);
                }}
                accessibilityRole="button"
                accessibilityLabel="Create a channel"
              >
                <View style={styles.chooserIcon}>
                  <Feather name="hash" size={18} color={Colors.textPrimary} />
                </View>
                <View style={styles.chooserText}>
                  <Text style={styles.chooserTitle}>Channel</Text>
                  <Text style={styles.chooserDesc}>
                    A room anyone with the link can join.
                  </Text>
                </View>
              </Pressable>

              <View style={styles.moreDivider} />

              <Pressable
                style={styles.chooserRow}
                onPress={() => {
                  setShowChooser(false);
                  setShowNewGroup(true);
                }}
                accessibilityRole="button"
                accessibilityLabel="Create a private group"
              >
                <View style={styles.chooserIcon}>
                  <Feather name="users" size={18} color={Colors.textPrimary} />
                </View>
                <View style={styles.chooserText}>
                  <Text style={styles.chooserTitle}>Group</Text>
                  <Text style={styles.chooserDesc}>
                    Pick specific people. Up to 16. Stays on Bluetooth.
                  </Text>
                </View>
              </Pressable>

              <View style={styles.moreDivider} />

              <Pressable
                style={styles.chooserRow}
                onPress={() => {
                  setShowChooser(false);
                  setShowGeohash(true);
                }}
                accessibilityRole="button"
                accessibilityLabel="Go to a place by geohash"
              >
                <View style={styles.chooserIcon}>
                  <Feather
                    name="map-pin"
                    size={18}
                    color={Colors.textPrimary}
                  />
                </View>
                <View style={styles.chooserText}>
                  <Text style={styles.chooserTitle}>Go to a place</Text>
                  <Text style={styles.chooserDesc}>
                    Open a location channel anywhere by its geohash.
                  </Text>
                </View>
              </Pressable>
            </View>

            <Pressable
              style={styles.modalCancel}
              onPress={() => setShowChooser(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <NewGroupSheet
        visible={showNewGroup}
        onClose={() => setShowNewGroup(false)}
        onBack={() => {
          setShowNewGroup(false);
          setShowChooser(true);
        }}
        onCreated={(channel) => {
          setShowNewGroup(false);
          onSelectChannel(channel);
        }}
      />

      <GeohashJumpSheet
        visible={showGeohash}
        onClose={() => setShowGeohash(false)}
        onBack={() => {
          setShowGeohash(false);
          setShowChooser(true);
        }}
        onJoined={(channel) => {
          setShowGeohash(false);
          onSelectChannel(channel);
        }}
      />

      {/* Your Rooms: swipe "More" sheet with chat info, pin, clear, delete */}
      <Modal
        visible={moreOptionsChannel !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setMoreOptionsChannel(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMoreOptionsChannel(null)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.handle} />
            {moreOptionsChannel && (
              <>
                <Text style={styles.modalTitle}>
                  {channelLabel(moreOptionsChannel)}
                </Text>

                {/* Everyday actions, grouped in one box. */}
                <View style={styles.moreRowsGroup}>
                  <Pressable
                    style={styles.moreRow}
                    onPress={() => {
                      setInfoChannel(moreOptionsChannel);
                      setMoreOptionsChannel(null);
                    }}
                    accessibilityRole="button"
                  >
                    <Feather
                      name="info"
                      size={18}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.moreRowText}>Room info</Text>
                  </Pressable>

                  {!DEFAULT_CHANNEL_NAMES.has(moreOptionsChannel) && (
                    <>
                      <View style={styles.moreDivider} />
                      <Pressable
                        style={styles.moreRow}
                        onPress={() => {
                          togglePinChannel(moreOptionsChannel);
                          setMoreOptionsChannel(null);
                        }}
                        accessibilityRole="button"
                      >
                        <MaterialCommunityIcons
                          name={
                            pinnedChannels.includes(moreOptionsChannel)
                              ? "pin-off"
                              : "pin"
                          }
                          size={18}
                          color={Colors.textSecondary}
                        />
                        <Text style={styles.moreRowText}>
                          {pinnedChannels.includes(moreOptionsChannel)
                            ? "Unpin room"
                            : "Pin room"}
                        </Text>
                      </Pressable>
                    </>
                  )}

                  <View style={styles.moreDivider} />
                  <Pressable
                    style={styles.moreRow}
                    onPress={() => handleMuteChat(moreOptionsChannel)}
                    accessibilityRole="button"
                  >
                    <Feather
                      name={
                        mutedChannels.includes(moreOptionsChannel)
                          ? "bell"
                          : "bell-off"
                      }
                      size={18}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.moreRowText}>
                      {mutedChannels.includes(moreOptionsChannel)
                        ? "Unmute room"
                        : "Mute room"}
                    </Text>
                  </Pressable>

                  <View style={styles.moreDivider} />
                  <Pressable
                    style={styles.moreRow}
                    onPress={() => handleClearChat(moreOptionsChannel)}
                    accessibilityRole="button"
                  >
                    <Feather
                      name="x-circle"
                      size={18}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.moreRowText}>Clear messages</Text>
                  </Pressable>
                </View>

                {/* Destructive action in its own red box. Default channels are
                    built-in and can't be left, so they have no red group. */}
                {!DEFAULT_CHANNEL_NAMES.has(moreOptionsChannel) && (
                  <View style={styles.moreRowsGroupDanger}>
                    <Pressable
                      style={styles.moreRowDanger}
                      onPress={() => handleLeaveChannel(moreOptionsChannel)}
                      accessibilityRole="button"
                    >
                      <Feather name="log-out" size={18} color={Colors.danger} />
                      <Text
                        style={[styles.moreRowText, styles.moreRowTextDanger]}
                      >
                        Leave room
                      </Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Channel info sheet (shared component) */}
      <ChannelInfoSheet
        channel={infoChannel}
        onClose={() => setInfoChannel(null)}
      />
    </View>
  );
}

function formatTime(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  return isToday
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    list: {
      flexGrow: 1,
      paddingBottom: 88,
    },

    // ---- Section headers -------------------------------------------------

    // No justifyContent: "space-between". With a variable number of children
    // (title, optional badge, chevron) space-between would spread space across
    // ALL of them instead of just pushing the chevron to the far edge.
    // sectionHeaderSpacer (flex: 1) does that job instead, so the title always
    // sits flush at the same left inset (ROW_INSET) as a channel row's "#".
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: ROW_INSET,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.sm,
      backgroundColor: Colors.bg,
    },
    sectionTitle: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      textTransform: "uppercase",
    },
    sectionHeaderSpacer: {
      flex: 1,
    },
    // Section-level unread aggregate, same visual language as the per-row badge.
    sectionBadge: {
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      minWidth: 16,
      height: 16,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
      marginLeft: Spacing.xs,
    },
    sectionBadgeText: {
      fontSize: 10,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
    },
    // Shared 20x20 trailing-icon slot for the section collapse chevron.
    trailingIconBtn: {
      width: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
    },

    // ---- Channel rows ------------------------------------------------------

    // Same ROW_INSET as sectionHeader (above), applied directly on this
    // full-bleed Pressable so its background spans edge to edge while its
    // content still starts flush with the section title above it.
    // No per-row background, just flat rows directly on the screen background,
    // divided only by the hairline separator below. Matches the WhatsApp
    // chat-list look rather than a "card per row" treatment.
    channelRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: ROW_INSET,
      paddingVertical: Spacing.md + 2,
      minHeight: 72,
    },
    // Single child of channelRow, so no `gap` here: it would be a no-op.
    channelRowBody: {
      flex: 1,
      gap: Spacing.xs + 2,
    },
    channelRowHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    channelNameGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      flex: 1,
      marginRight: Spacing.sm,
      overflow: "hidden",
    },
    channelRowMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      flexShrink: 0,
    },
    channelRowFoot: {
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
    channelTimestamp: {
      fontSize: FontSize.xs,
      color: Colors.textPrimary,
    },
    channelPreview: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      flex: 1,
    },
    channelPreviewSender: {
      color: Colors.textMuted,
    },
    channelPreviewEmpty: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontStyle: "italic",
    },
    channelUnreadBadge: {
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      minWidth: 18,
      height: 18,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 5,
    },
    channelUnreadBadgeText: {
      fontSize: 10,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
    },

    // ---- Your Rooms: swipe actions ------------------------------------------

    swipeActions: {
      flexDirection: "row",
      height: "100%",
    },
    swipeAction: {
      width: 72,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      backgroundColor: Colors.border,
    },
    swipeActionText: {
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },

    // ---- Your Rooms: "More" sheet --------------------------------------------

    // Tight, boxed group, not spread out with the sheet's default gap,
    // which reads as loose and disconnected for a same-purpose action list.
    // Two grouped boxes: neutral actions in one card, destructive in a solid
    // red card. Rows are transparent; the card owns the background and the
    // rounded corners (overflow clips the rows to the radius).
    moreRowsGroup: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      overflow: "hidden",
    },
    moreRowsGroupDanger: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      overflow: "hidden",
    },
    moreRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.base,
    },
    moreRowDanger: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.base,
    },
    moreDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginLeft: Spacing.base,
    },
    moreRowText: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
    },
    moreRowTextDanger: {
      color: Colors.danger,
    },

    // ---- Default Channels show more/less -----------------------------------

    showMoreBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      paddingVertical: Spacing.md,
      backgroundColor: Colors.bg,
    },
    showMoreText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.textMuted,
    },

    // ---- Your Rooms empty state ---------------------------------------------

    ownEmpty: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing["2xl"],
      gap: Spacing.xs,
    },
    ownEmptyIcon: {
      marginBottom: Spacing.xs,
      opacity: 0.6,
    },
    ownEmptyText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textSecondary,
      textAlign: "center",
    },
    ownEmptyHint: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
    },
    ownEmptyAccent: {
      color: Colors.accent,
      fontWeight: FontWeight.semibold,
    },

    // ---- Create/join modal ---------------------------------------------------

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
    // Privacy note in the create sheet: a short, scannable list of what a
    // channel actually is (encrypted, invite-only, Bluetooth range) rather than
    // one dense paragraph.
    privacyNote: {
      gap: Spacing.sm,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.md,
      padding: Spacing.md,
    },
    privacyNoteRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.sm,
    },
    privacyNoteText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
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
    reachHint: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      lineHeight: 17,
    },
    modalActions: {
      flexDirection: "row",
      gap: Spacing.sm,
      marginTop: Spacing.xs,
    },
    modalCancel: {
      flex: 1,
      minHeight: 50,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.full,
      paddingVertical: Spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    modalCancelText: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    modalConfirm: {
      flex: 1,
      minHeight: 50,
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      paddingVertical: Spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    modalConfirmDisabled: {
      opacity: 0.4,
    },
    modalConfirmText: {
      fontSize: FontSize.base,
      color: Colors.textInverse,
      fontWeight: FontWeight.semibold,
    },
    // Chooser rows: icon, then a title over a one-line explanation of what
    // makes this option different from the other one.
    chooserRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.base,
      paddingHorizontal: Spacing.base,
    },
    chooserIcon: {
      width: 38,
      height: 38,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    chooserText: {
      flex: 1,
      gap: 2,
    },
    chooserTitle: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    chooserDesc: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 18,
    },
  });
}
