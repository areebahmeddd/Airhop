// Channel list screen.
// Two sections: Default channels (bitchat-compatible, cannot be left) and
// Your channels (user-created channels and private groups, joinable/leaveable).
// Tap a channel to open its thread. Swipe left for More: channel info, and for
// Your channels also pin and delete.
//
// Creating a channel lives in start-new-sheet, not here: the header "+" is on
// both Chats sub-tabs, so App.tsx mounts the chooser alongside this list.

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { t, tPlural, type TranslationKey, useT, useTPlural } from "@i18n";
import { useRichText } from "@i18n/rich-text";
import { held } from "@platform/haptics";
import {
  geohashLevelName,
  isGeoChannel,
} from "@services/geohash-channel-service";
import { getMeshService } from "@services/mesh-service";
import { showAlert } from "@store/alert-store";
import { useChatStore } from "@store/chat-store";
import { useGroupStore } from "@store/group-store";
import { usePeerStore } from "@store/peer-store";
import { placeNameKey, usePlaceNamesStore } from "@store/place-names-store";
import BottomSheet from "@ui/components/bottom-sheet";
import EmptyState from "@ui/components/empty-state";
import { usePullRefreshColors } from "@ui/hooks/use-pull-refresh";
import {
  Duration,
  FontSize,
  FontWeight,
  MaxFontScale,
  MIN_TOUCH,
  Radius,
  Spacing,
  TAB_BAR_CLEARANCE,
  useThemeColors,
} from "@ui/theme";
import { isManualGeoChannel, manualGeohashOf } from "@utils/channel-key";
import { sortConversationsByActivity } from "@utils/conversation-order";
import { formatListTimestamp } from "@utils/format";
import { messagePreviewText } from "@utils/message-preview";
import { sumUnread } from "@utils/unread";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import ChannelInfoSheet from "./channel-info-sheet";

// ---- Constants ----

// How often to re-read geohash channel participant counts. They change off a
// Nostr subscription, so a slow poll keeps the list live without a per-event
// re-render of the whole screen.
const GEO_COUNT_POLL_MS = 5000;

// There are deliberately no per-channel transport or visibility options here:
// nothing in the send path reads them. See the note in the create-channel modal
// below.

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

// Default channels is collapsed to this many rows until the user expands it.
const DEFAULT_VISIBLE_COUNT = 3;

// Module-level, not component state: opening a channel or switching tabs
// unmounts this list, so a useState would reset the expansion every time.
let persistedShowAllDefault = false;

// Same reason as persistedShowAllDefault, for collapsed section headers.
let persistedCollapsedSections = new Set<string>();

// Single shared left/right inset used by BOTH the section headers and the
// channel rows, so their leading text ("DEFAULT CHANNELS" / "#bluetooth")
// starts at the same x position, one constant referenced twice rather than
// two separate `Spacing.base` reads that could drift apart later.
const ROW_INSET = Spacing.base;

// Scope info for built-in bitchat-compatible channels.
//
// Keys, not text: a module constant is evaluated once at import, so holding
// translated strings here would freeze them in whichever language the app
// started in. The component translates on render.
const CHANNEL_SCOPE: Record<
  string,
  { tagKey: TranslationKey; descriptionKey: TranslationKey }
> = {
  "#bluetooth": {
    tagKey: "chat.scope.mesh",
    descriptionKey: "chat.scope.mesh_desc",
  },
  "#block": {
    tagKey: "chat.scope.block",
    descriptionKey: "chat.scope.block_desc",
  },
  "#neighborhood": {
    tagKey: "chat.scope.neighborhood",
    descriptionKey: "chat.scope.neighborhood_desc",
  },
  "#city": {
    tagKey: "chat.scope.city",
    descriptionKey: "chat.scope.city_desc",
  },
  "#province": {
    tagKey: "chat.scope.province",
    descriptionKey: "chat.scope.province_desc",
  },
  "#region": {
    tagKey: "chat.scope.country",
    descriptionKey: "chat.scope.country_desc",
  },
};

// ---- Types ----

interface ChannelSection {
  title: string;
  isDefault: boolean;
  unread: number;
  data: string[];
}

interface Props {
  onSelectChannel: (channel: string) => void;
}

// Human-readable label for a channel key, for dialogs and sheet headers that
// would otherwise print the raw store key. Named channels (#city) already read
// fine; groups and teleported cells are keyed group:<id> / geohash:<gh>, so
// show the group's name or #<geohash> instead.
function channelLabel(channel: string): string {
  if (isManualGeoChannel(channel)) return `#${manualGeohashOf(channel)}`;
  if (channel.startsWith("group:")) {
    return (
      useGroupStore.getState().nameForChannel(channel) ?? t("chat.group_badge")
    );
  }
  return channel;
}

// ---- Component ----

export default function ChannelList({
  onSelectChannel,
}: Props): React.JSX.Element {
  const T = useT();
  const TP = useTPlural();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const pullRefreshColors = usePullRefreshColors();
  // Here rather than in renderSectionFooter: useRichText is a hook, and that
  // footer renders conditionally.
  const ownEmptyHint = useRichText("chat.channels.none_hint", {
    plus: <Text style={styles.ownEmptyAccent}>+</Text>,
  });
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

  const [infoChannel, setInfoChannel] = useState<string | null>(null);
  // Seed from the module-level set so returning to Chats restores which sections
  // the user had collapsed instead of snapping them all back open.
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () => new Set(persistedCollapsedSections),
  );
  useEffect(() => {
    persistedCollapsedSections = collapsedSections;
  }, [collapsedSections]);
  // Seed from the module-level flag so returning to Chats restores the last
  // expand/collapse choice instead of snapping back to collapsed.
  const [showAllDefault, setShowAllDefault] = useState(persistedShowAllDefault);
  useEffect(() => {
    persistedShowAllDefault = showAllDefault;
  }, [showAllDefault]);
  const [refreshing, setRefreshing] = useState(false);
  // Which "Your channels" row currently has its swipe-revealed More sheet open.
  const [moreOptionsChannel, setMoreOptionsChannel] = useState<string | null>(
    null,
  );
  // Open Swipeable rows, keyed by channel, so tapping an action can close its
  // own row instead of leaving it hanging open.
  const swipeableRefs = useRef(new Map<string, SwipeableMethods>()).current;

  function closeSwipeable(channel: string): void {
    swipeableRefs.get(channel)?.close();
  }

  // ---- Derived channel lists ----

  // Public channels only (exclude dm: and group: prefixed channels).
  const publicChannels = channels.filter(
    (c) => !c.startsWith("dm:") && !c.startsWith("group:"),
  );
  // Private groups the user belongs to, keyed as group:<id>.
  const groupChannels = channels.filter((c) => c.startsWith("group:"));
  const defaultChannels = publicChannels.filter((c) =>
    DEFAULT_CHANNEL_NAMES.has(c),
  );
  // Your channels: user-created channels and private groups, pinned
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

  // Section-level unread totals, computed from the FULL channel list (not the
  // possibly-collapsed/sliced `data` below) so the badge stays accurate even
  // while a section is collapsed or showing only its top rows.
  //
  // Delegates to utils/unread rather than re-implementing the muted rule, which
  // is what this had been doing: the same "a muted channel keeps its own row
  // count but adds to no header" decision written out twice, in two shapes, in
  // two files that both have to change together.
  function sectionUnread(list: string[]): number {
    const inSection = new Set(list);
    return sumUnread(unreadCounts, mutedChannels, (channel) =>
      inSection.has(channel),
    );
  }

  const sections: ChannelSection[] = [
    {
      title: T("chat.channels.default"),
      isDefault: true,
      unread: sectionUnread(defaultChannels),
      data: collapsedSections.has(T("chat.channels.default"))
        ? []
        : showAllDefault
          ? defaultChannels
          : defaultChannels.slice(0, DEFAULT_VISIBLE_COUNT),
    },
    {
      title: T("chat.channels.yours"),
      isDefault: false,
      unread: sectionUnread(ownChannels),
      data: collapsedSections.has(T("chat.channels.yours")) ? [] : ownChannels,
    },
  ];

  // ---- Handlers ----

  function handleRefresh(): void {
    setRefreshing(true);
    getMeshService()?.refresh();
    setTimeout(() => setRefreshing(false), Duration.refreshSpinner);
  }

  function toggleSection(title: string): void {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  // ---- Your channels swipe / more-options actions ----

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
      t("chat.clear_messages"),
      t("chat.channels.clear_body", { name: channelLabel(channel) }),
      [
        { text: T("common.cancel"), style: "cancel" },
        {
          text: t("chat.clear_confirm"),
          style: "destructive",
          onPress: () => clearChannelMessages(channel),
        },
      ],
    );
  }

  function handleLeaveChannel(channel: string): void {
    setMoreOptionsChannel(null);
    showAlert(
      t("chat.channels.leave"),
      t("chat.channels.leave_body", { name: channelLabel(channel) }),
      [
        { text: T("common.cancel"), style: "cancel" },
        {
          text: t("chat.channels.leave_confirm"),
          style: "destructive",
          onPress: () => removeChannel(channel),
        },
      ],
    );
  }

  // ---- Row rendering ----

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
      ? t("chat.channels.teleported_tag", {
          level: geohashLevelName(manualGh),
        })
      : (() => {
          const scope = CHANNEL_SCOPE[item];
          return scope === undefined ? undefined : T(scope.tagKey);
        })();
    // Reverse-geocoded place name for this cell, e.g. "~Kumaraswamy Layout",
    // shown between the coverage tag and the active count. Only present once the
    // cell has a geohash (teleported always; named only with location on).
    const rowGeohash = isManualGeo ? manualGh : geoHashes[item];
    const placeName =
      rowGeohash !== undefined
        ? placeNames[placeNameKey(rowGeohash)]
        : undefined;
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
    // Count yourself. A member count answers "who is in this room", and you are
    // one of them, which is how the member sheet has always counted (it renders
    // a You row) and how every messenger counts a participant list. Applied to
    // both kinds so the row, the thread header and the sheet agree.
    //
    // Not the same question the Mesh tab answers: "peers in range" is a count
    // of other devices this radio can reach, and it stays exclusive.
    const presenceCount = (isGeo ? (geoCounts[item] ?? 0) : peerCount) + 1;
    const presenceText = TP(
      isGeo ? "chat.presence.active" : "chat.presence.nearby",
      presenceCount,
    );

    // Formatted once and used by both the visible timestamp and the label
    // below. Calling the formatter twice per row meant building three Date
    // objects per row per render, on the app's longest list.
    const timeLabel =
      last === undefined ? null : formatListTimestamp(last.timestampMs);

    // Everything the row shows, as one sentence, in the order the eye takes it.
    // The label was just "Open channel #city", so the unread count, last
    // speaker, muted state and time were all on screen and none were spoken.
    const rowLabel = [
      isGroup
        ? t("chat.a11y.group", { name: groupName ?? t("chat.group_badge") })
        : t("chat.a11y.channel", { name: channelLabel(item) }),
      unread > 0 ? tPlural("chat.a11y.unread", unread) : null,
      isMuted ? t("chat.a11y.muted") : null,
      isPinned ? t("chat.a11y.pinned") : null,
      last
        ? `${last.isMine ? t("chat.you") : last.senderNickname}: ${messagePreviewText(last)}`
        : t("chat.no_messages"),
      timeLabel,
    ]
      .filter((part) => part !== null)
      .join(", ");

    const row = (
      <Pressable
        style={styles.channelRow}
        onPress={() => onSelectChannel(item)}
        // Long-press opens the same sheet the swipe does. Swipe alone is both
        // unfamiliar as the only route and unreachable with a screen reader,
        // since ReanimatedSwipeable exposes no accessibility actions.
        onLongPress={() => {
          held();
          handleSwipeMore(item);
        }}
        accessibilityRole="button"
        accessibilityLabel={rowLabel}
        accessibilityHint={t("chat.channels.row_hint")}
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
                  {groupName ?? t("chat.group_badge")}
                </Text>
              ) : (
                <Text style={styles.channelName} numberOfLines={1}>
                  <Text style={styles.channelHash}>#</Text>
                  {isManualGeo ? manualGh : item.replace(/^#/, "")}
                </Text>
              )}
            </View>
            <View style={styles.channelRowMeta}>
              {last && <Text style={styles.channelTimestamp}>{timeLabel}</Text>}
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
              {(isDefault || isManualGeo) && `  ·  ${presenceText}`}
            </Text>
          )}

          {/* Foot line: preview + unread badge */}
          <View style={styles.channelRowFoot}>
            {last ? (
              <Text style={styles.channelPreview} numberOfLines={1}>
                <Text style={styles.channelPreviewSender}>
                  {last.isMine ? t("chat.you") : last.senderNickname}:{" "}
                </Text>
                {messagePreviewText(last)}
              </Text>
            ) : (
              <Text style={styles.channelPreviewEmpty}>
                {T("chat.no_messages")}
              </Text>
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

    // Every row (Your channels and Default channels alike) swipes left to
    // reveal More, the single consistent way to reach chat info, so
    // there's no separate inline info icon anywhere.
    return (
      <Animated.View
        layout={LinearTransition.duration(Duration.slow)}
        entering={FadeIn.duration(Duration.base)}
      >
        <ReanimatedSwipeable
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
                accessibilityLabel={t("chat.channels.more_options", {
                  name: item,
                })}
              >
                <Feather
                  name="more-horizontal"
                  size={18}
                  color={Colors.textSecondary}
                />
                <Text style={styles.swipeActionText}>{T("chat.more")}</Text>
              </Pressable>
            </View>
          )}
        >
          {row}
        </ReanimatedSwipeable>
      </Animated.View>
    );
  }

  // ---- Render ----

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
              accessibilityLabel={
                section.unread > 0
                  ? TP("a11y.unread_count", section.unread, {
                      label: section.title,
                    })
                  : section.title
              }
              // `expanded` is what makes the chevron mean something to a screen
              // reader. Naming the action instead ("Collapse Your channels")
              // stated the next tap but never the current state.
              accessibilityState={{ expanded: !isCollapsed }}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.unread > 0 && (
                <View
                  style={styles.sectionBadge}
                  importantForAccessibility="no-hide-descendants"
                  accessibilityElementsHidden
                >
                  <Text
                    style={styles.sectionBadgeText}
                    maxFontSizeMultiplier={MaxFontScale.badge}
                  >
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
                    ? t("chat.channels.show_fewer")
                    : TP("chat.channels.show_more_a11y", hiddenCount)
                }
              >
                <Text style={styles.showMoreText}>
                  {showAllDefault
                    ? t("chat.channels.show_less")
                    : TP("chat.channels.show_more", hiddenCount)}
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
            <EmptyState
              compact
              icon="hash"
              title={t("chat.channels.none")}
              subtitle={<Text style={styles.ownEmptyHint}>{ownEmptyHint}</Text>}
              accessibilityLabel={t("chat.channels.none_desc")}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            {...pullRefreshColors}
          />
        }
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
      />

      {/* Your channels: swipe "More" sheet with info, pin, clear, delete */}
      <BottomSheet
        visible={moreOptionsChannel !== null}
        onClose={() => setMoreOptionsChannel(null)}
        sheetStyle={styles.modalSheet}
      >
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
                <Feather name="info" size={18} color={Colors.textSecondary} />
                <Text style={styles.moreRowText}>
                  {T("chat.channels.info")}
                </Text>
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
                        ? T("chat.channels.unpin")
                        : T("chat.channels.pin")}
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
                    ? T("chat.channels.unmute")
                    : T("chat.channels.mute")}
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
                <Text style={styles.moreRowText}>
                  {T("chat.clear_messages")}
                </Text>
              </Pressable>
            </View>

            {/* Destructive action in its own red box. Default channels are
                    built-in and can't be left, so they have no red group. */}
            {!DEFAULT_CHANNEL_NAMES.has(moreOptionsChannel) && (
              <View style={styles.moreRowsGroup}>
                <Pressable
                  style={styles.moreRow}
                  onPress={() => handleLeaveChannel(moreOptionsChannel)}
                  accessibilityRole="button"
                >
                  <Feather name="log-out" size={18} color={Colors.danger} />
                  <Text style={[styles.moreRowText, styles.moreRowTextDanger]}>
                    {T("chat.channels.leave")}
                  </Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </BottomSheet>

      {/* Channel info sheet (shared component) */}
      <ChannelInfoSheet
        channel={infoChannel}
        onClose={() => setInfoChannel(null)}
      />
    </View>
  );
}

// ---- Styles ----

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    list: {
      flexGrow: 1,
      paddingBottom: TAB_BAR_CLEARANCE,
    },

    // No justifyContent: "space-between". With a variable number of children
    // (title, optional badge, chevron) space-between would spread space across
    // ALL of them instead of just pushing the chevron to the far edge.
    // sectionHeaderSpacer (flex: 1) does that job instead, so the title always
    // sits flush at the same left inset (ROW_INSET) as a channel row's "#".
    // paddingBottom raised from sm to md: the header is tappable (it collapses
    // the section) and at 8 it measured ~39pt tall. hitSlop is not usable here
    // because it would reach into the first row beneath it.
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: ROW_INSET,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.md,
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
    sectionBadge: {
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      minWidth: 16,
      height: 16,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
      marginStart: Spacing.xs,
    },
    sectionBadgeText: {
      fontSize: FontSize["2xs"],
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
      fontVariant: ["tabular-nums"],
    },
    trailingIconBtn: {
      width: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
    },

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
      marginEnd: Spacing.sm,
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
      fontSize: FontSize["2xs"],
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
      fontVariant: ["tabular-nums"],
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
    },

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

    // Tight, boxed group, not spread out with the sheet's default gap, which
    // reads as loose and disconnected for a same-purpose action list. Rows are
    // transparent; the card owns the background and the rounded corners
    // (overflow clips the rows to the radius).
    //
    // There were four styles here, not two: `moreRowsGroupDanger` was
    // byte-identical to `moreRowsGroup` and `moreRowDanger` to `moreRow`. The
    // comment they carried promised "destructive in a solid red card", which
    // was never true and had drifted away from the code long ago. What actually
    // separates the destructive group is that it is a SEPARATE box (so a
    // mis-tap cannot cross from Mute into Leave) with red content inside, and
    // that reads correctly. So: one box style, one row style, and the red lives
    // where it belongs, on the icon and the label.
    moreRowsGroup: {
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
      // At 12pt padding around a 15pt label the row measured 39pt. Every action
      // in this sheet is a one-tap commitment, several destructive.
      minHeight: MIN_TOUCH,
    },
    moreDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginStart: Spacing.base,
    },
    moreRowText: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
    },
    moreRowTextDanger: {
      color: Colors.danger,
    },

    showMoreBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      paddingVertical: Spacing.md,
      minHeight: MIN_TOUCH,
      backgroundColor: Colors.bg,
    },
    showMoreText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.textMuted,
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

    modalSheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.base,
    },
    modalTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
  });
}
