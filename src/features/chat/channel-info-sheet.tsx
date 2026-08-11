// Shared channel detail bottom sheet.
// Used by both channel-list (info icon tap) and message-thread (header tap).
// Shows About, an at-a-glance facts card (privacy, reach, geohash), and Members.
// Read-only: it describes what a channel is and who is in it. Default channels
// add a protocol lock notice; a location channel adds a bookmark toggle.

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GROUP_MAX_MEMBERS } from "../../core/mesh/group-protocol";
import { relayDisplayHost } from "../../core/nostr/geo-relay";
import { t, useT, useTPlural, type TranslationKey } from "../../i18n";
import {
  geohashLevelName,
  isGeoChannel,
  isManualGeoChannel,
  manualGeohashOf,
  type GeoParticipant,
} from "../../services/geohash-channel-service";
import { getMeshService } from "../../services/mesh-service";
import { showAlert } from "../../store/alert-store";
import { useChannelMembersStore } from "../../store/channel-members-store";
import { useChatStore } from "../../store/chat-store";
import { useGeohashBookmarksStore } from "../../store/geohash-bookmarks-store";
import { useGroupStore } from "../../store/group-store";
import { usePeerStore } from "../../store/peer-store";
import {
  placeNameKey,
  usePlaceNamesStore,
} from "../../store/place-names-store";
import { useSettingsStore } from "../../store/settings-store";
import Avatar from "../../ui/components/avatar";
import BottomSheet from "../../ui/components/bottom-sheet";
import {
  DISABLED_OPACITY,
  FontFamily,
  FontSize,
  FontWeight,
  HIT_SLOP,
  hitSlopFor,
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
// Keys, not text: a module constant is evaluated once at import, so translated
// strings here would freeze in whichever language the app started in. The
// component translates them on render. Guarded by `npm run i18n:audit`.
const CHANNEL_SCOPE: Record<
  string,
  {
    tagKey: TranslationKey;
    descriptionKey: TranslationKey;
    transportKey: TranslationKey;
  }
> = {
  "#bluetooth": {
    tagKey: "chat.scope.mesh",
    descriptionKey: "chat.scope.mesh_desc",
    transportKey: "chat.transport.bluetooth",
  },
  "#block": {
    tagKey: "chat.scope.block",
    descriptionKey: "chat.scope.block_desc",
    transportKey: "chat.transport.both",
  },
  "#neighborhood": {
    tagKey: "chat.scope.neighborhood",
    descriptionKey: "chat.scope.neighborhood_desc",
    transportKey: "chat.transport.both",
  },
  "#city": {
    tagKey: "chat.scope.city",
    descriptionKey: "chat.scope.city_desc",
    transportKey: "chat.transport.both",
  },
  "#province": {
    tagKey: "chat.scope.province",
    descriptionKey: "chat.scope.province_desc",
    transportKey: "chat.transport.both",
  },
  "#region": {
    tagKey: "chat.scope.country",
    descriptionKey: "chat.scope.country_desc",
    transportKey: "chat.transport.both",
  },
};

// Transport / visibility option lists lived here. Removed alongside the store
// fields they fed, since nothing in the send path ever read them.

interface Props {
  channel: string | null;
  onClose: () => void;
  // Called after leaving so the parent can navigate away if needed.
  onLeave?: () => void;
  // Open a DM (or other channel) from a tapped member; navigates the app.
  onNavigateToChannel?: (channel: string) => void;
  // The local user, so the member list can show a "You" row.
  localNickname?: string;
  localPeerID?: string;
}

export default function ChannelInfoSheet({
  channel,
  onClose,
  onLeave,
  onNavigateToChannel,
  localNickname,
  localPeerID,
}: Props): React.JSX.Element | null {
  const T = useT();
  const TP = useTPlural();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const { removeChannel, channelKeys, channelReach, addChannel } =
    useChatStore();
  const { peers } = usePeerStore();
  const peerList = [...peers.values()];
  // Proven key-holders, for a private channel's roster. A store rather than a
  // polled subscription, so it updates the moment a member's message decrypts.
  const privateMembersByChannel = useChannelMembersStore((s) => s.byChannel);
  const privateMembers =
    channel !== null ? (privateMembersByChannel[channel] ?? []) : [];

  const [copied, setCopied] = useState(false);
  // Member-list search, revealed by the search icon next to the section label.
  const [memberSearch, setMemberSearch] = useState("");
  const [searching, setSearching] = useState(false);
  // Creator-only "add members" picker.
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [addSelected, setAddSelected] = useState<Set<string>>(new Set());

  // Members is the last section in this sheet, so its search field sits near the
  // bottom of a long scroll. Opening it raises the keyboard, which shortens the
  // sheet from below - and the field the user just asked for can end up under
  // the fold. Riding to the end of the scroll puts the field and the list it
  // filters back in view, which is where someone who just tapped Search is
  // looking. Deferred a frame so the layout has already shrunk.
  const bodyRef = useRef<ScrollView>(null);
  useEffect(() => {
    if (!searching) return;
    const id = setTimeout(
      () => bodyRef.current?.scrollToEnd({ animated: true }),
      120,
    );
    return () => clearTimeout(id);
  }, [searching]);

  // Private group (`group:<id>`): its name and roster come from group-store, not
  // the chat-store fields a public/custom channel uses.
  const isGroup = (channel ?? "").startsWith("group:");
  const groupName = useGroupStore((s) =>
    channel !== null ? s.nameForChannel(channel) : undefined,
  );
  // Reactive roster snapshot, so add/remove-member updates refresh this sheet
  // live (the roster is mutable now, unlike the earlier read-once assumption).
  const groupRaw = useGroupStore((s) => {
    const c = channel ?? "";
    if (!c.startsWith("group:")) return undefined;
    const gid = c.slice("group:".length);
    return s.groups.find((g) => g.groupID === gid);
  });

  // Bookmark state and place name for a location channel. The channel's geohash
  // is resolved below (null when a named channel has no location fix), and both
  // key off it: you can only bookmark or name a cell you actually have.
  const channelGeohash = isGeoChannel(channel ?? "")
    ? (manualGeohashOf(channel ?? "") ??
      getMeshService()?.getChannelGeohash(channel ?? "") ??
      null)
    : null;
  const bookmarked = useGeohashBookmarksStore((s) =>
    channelGeohash !== null ? s.bookmarks.includes(channelGeohash) : false,
  );
  const placeName = usePlaceNamesStore((s) =>
    channelGeohash !== null ? s.names[placeNameKey(channelGeohash)] : undefined,
  );
  useEffect(() => {
    if (channelGeohash !== null) {
      usePlaceNamesStore.getState().resolve(channelGeohash);
    }
  }, [channelGeohash]);

  // Which relays carry this cell, and which of them the user added in
  // Settings. Listed nearest-first, which is how the directory returns them:
  // unlike the fixed Message relays list, distance is what actually chose these,
  // so the order carries real information and is left alone.
  //
  // Collapsed by default: the count answers "is this reaching the
  // internet at all", and the list answers "did my own relay get used", which
  // is the question the Network screen cannot answer on its own because the set
  // is chosen per cell rather than once.
  const [relaysExpanded, setRelaysExpanded] = useState(false);
  const customRelays = useSettingsStore((s) => s.customRelays);
  const geoRelayDiscovery = useSettingsStore((s) => s.geoRelayDiscovery);
  const cellRelays = useMemo(
    () =>
      channelGeohash === null
        ? []
        : (getMeshService()?.getGeohashRelays(channelGeohash) ?? []),
    // The service reads both relay settings out of the store rather than taking
    // them as arguments, so they are real inputs here even though this closure
    // does not name them: without them the list would keep showing the relays
    // from before the user edited the setting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channelGeohash, customRelays, geoRelayDiscovery],
  );
  const customRelaySet = useMemo(() => new Set(customRelays), [customRelays]);

  // For a location channel, "members" are the people active in its cell over
  // the internet, not the nearby BLE peers. Polled off a Nostr subscription,
  // matching the thread header and the channel row. Non-geo channels keep the
  // live BLE peer list below.
  const [geoParticipants, setGeoParticipants] = useState<GeoParticipant[]>([]);
  useEffect(() => {
    if (channel === null || !isGeoChannel(channel)) return;
    const ch = channel;
    function sample(): void {
      const list = getMeshService()?.getGeoParticipants(ch) ?? [];
      setGeoParticipants((prev) =>
        prev.length === list.length &&
        prev.every((p, i) => p.pubkey === list[i]?.pubkey)
          ? prev
          : list,
      );
    }
    sample();
    const timer = setInterval(sample, 5000);
    return () => clearInterval(timer);
  }, [channel]);

  if (channel === null) return null;

  const isDefault = DEFAULT_CHANNEL_NAMES.has(channel);
  const scopeData = CHANNEL_SCOPE[channel];
  // A channel with a key is private and end-to-end encrypted (custom channels);
  // the built-in location channels have none and are public plaintext.
  const isPrivate = channelKeys[channel] !== undefined;
  const overNostr = channelReach[channel] === "ble+nostr";
  // A private group is also end-to-end encrypted (a signed roster + epoch key),
  // just via group-store rather than a chat-store channel key.
  const encrypted = isPrivate || isGroup;
  // Group roster, read once: it only changes on an epoch update, which replaces
  // the whole sheet's channel anyway.
  const groupIDHex = isGroup ? channel.slice("group:".length) : "";
  const groupMembers = groupRaw?.members ?? [];
  const groupCreatorFp = groupRaw?.creatorFingerprint;
  // Only the creator can add or remove members (matching bitchat).
  const isGroupCreator =
    isGroup && getMeshService()?.isGroupCreator(groupIDHex) === true;
  const canAddMembers =
    isGroupCreator && groupMembers.length < GROUP_MAX_MEMBERS;

  // Location-channel state. The geohash was resolved above (channelGeohash),
  // preferring the fixed key of a teleported cell over the service's live map.
  const isGeo = isGeoChannel(channel);
  const geohash = channelGeohash;
  // A teleported cell (geohash:<gh>): a location channel keyed by a fixed
  // geohash the user jumped to, rather than a named or custom channel. It has
  // no CHANNEL_SCOPE entry, so its label and description are derived here.
  const isManualGeo = isManualGeoChannel(channel);
  const manualGh = isManualGeo ? (manualGeohashOf(channel) ?? "") : "";
  // Description: protocol default for a named channel, else a per-type line.
  const resolvedDescription =
    (scopeData === undefined ? undefined : T(scopeData.descriptionKey)) ??
    (isGroup
      ? T("chat.info.group_desc")
      : isManualGeo
        ? T("chat.info.teleported_desc")
        : T("chat.info.custom_desc"));

  // The three at-a-glance facts, computed once so the card below stays declarative:
  // privacy (is it encrypted), reach (which transports carry it), and location
  // (the geohash, for geo channels). The old sheet spread these across two
  // paragraph-heavy sections that restated the same thing.
  type IconName = React.ComponentProps<typeof Feather>["name"];
  // "unlock" for public (unencrypted), distinct from the reach row's "globe".
  const privacyIcon: IconName = encrypted ? "lock" : "unlock";
  const privacyColor = encrypted ? Colors.e2ee : Colors.danger;
  const privacyLabel = encrypted
    ? T("chat.info.private_e2ee")
    : T("chat.info.public_plain");

  let reachIcon: IconName = "bluetooth";
  let reachLabel = T("chat.transport.bluetooth");
  if (isGroup) {
    reachIcon = "bluetooth";
    reachLabel = T("chat.transport.bluetooth");
  } else if (isManualGeo) {
    reachIcon = "globe";
    reachLabel = T("chat.transport.internet");
  } else if (isPrivate) {
    reachIcon = overNostr ? "globe" : "bluetooth";
    reachLabel = overNostr
      ? T("chat.transport.both")
      : T("chat.transport.bluetooth");
  } else if (isGeo && geohash !== null) {
    reachIcon = "globe";
    reachLabel = T("chat.transport.both");
  }

  // One adaptive caveat under the card: whichever nuance actually matters for
  // this channel, rather than three stacked explanations.
  const detailHint = isGroup
    ? T("chat.info.group_privacy")
    : isManualGeo
      ? T("chat.info.teleport_privacy")
      : isGeo && geohash === null
        ? T("chat.info.location_off_privacy")
        : isPrivate
          ? T("chat.info.invite_privacy")
          : T("chat.info.public_privacy");

  function handleCopyGeohash(): void {
    if (geohash === null) return;
    void Clipboard.setStringAsync(geohash).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleLeave(): void {
    // Leaving a group also drops its epoch key from group-store, not just the
    // chat-store channel row, so no group key material lingers after leaving.
    if (isGroup) {
      useGroupStore.getState().remove(channel!.slice("group:".length));
    }
    removeChannel(channel!);
    onClose();
    onLeave?.();
  }

  function handleRemoveMember(fingerprint: string, memberName: string): void {
    showAlert(
      t("chat.info.remove_member"),
      t("chat.info.remove_member_body", { name: memberName }),
      [
        { text: T("common.cancel"), style: "cancel" },
        {
          text: T("common.remove"),
          style: "destructive",
          onPress: () => {
            // The result used to be discarded, so a refusal (not the creator,
            // roster already changed) closed the sheet looking like a success.
            const ok =
              getMeshService()?.removeGroupMember(groupIDHex, fingerprint) ===
              true;
            if (!ok) {
              showAlert(
                t("chat.group.remove_failed"),
                t("chat.group.remove_failed_body"),
              );
            }
          },
        },
      ],
    );
  }

  function toggleAddMember(peerID: string): void {
    setAddSelected((prev) => {
      const next = new Set(prev);
      if (next.has(peerID)) next.delete(peerID);
      else if (groupMembers.length + next.size < GROUP_MAX_MEMBERS)
        next.add(peerID);
      return next;
    });
  }

  function handleAddMembers(): void {
    if (addSelected.size === 0) return;
    // Same as remove: this returns false when we are not the creator, when none
    // of the picked peers has usable keys, or when the roster would pass 16, and
    // all three used to look identical to success. Success needs nothing said:
    // the roster below is a live subscription, so the new members appear in it.
    const ok =
      getMeshService()?.addGroupMembers(groupIDHex, [...addSelected]) === true;
    setAddSelected(new Set());
    setShowAddMembers(false);
    if (!ok) {
      showAlert(t("chat.group.add_failed"), t("chat.group.add_failed_body"));
    }
  }

  // One unified member list for all channel kinds. A group's signed roster, a
  // geo cell's active participants, a private channel's proven key-holders, or
  // the nearby BLE peers all normalise to the same shape and render identically
  // (You row, chat action, search). Self is counted the way bitchat counts it —
  // included in the total. A group roster already lists you, so it is not
  // re-added; the other lists are others-only, so you appear as a "You" row and
  // add one to the count.
  //
  // The nearby-peers fallback is right for `#bluetooth`, where radio range is
  // the room, and wrong for anything invite-only, where membership is
  // possession of the key. See channel-members-store.
  type MemberItem = {
    id: string;
    name: string;
    teleported: boolean;
    onChat?: () => void;
    onRemove?: () => void;
  };
  function openDmWith(peerID: string): void {
    addChannel(`dm:${peerID}`);
    onNavigateToChannel?.(`dm:${peerID}`);
    onClose();
  }
  const members: MemberItem[] = isGroup
    ? groupMembers.map((m) => ({
        id: m.fingerprint,
        name: m.nickname,
        teleported: false,
        // The creator can remove anyone but themselves.
        onRemove:
          isGroupCreator && m.fingerprint !== groupCreatorFp
            ? () => handleRemoveMember(m.fingerprint, m.nickname)
            : undefined,
      }))
    : isGeo
      ? geoParticipants.map((p) => ({
          id: p.pubkey,
          name: p.nickname,
          teleported: p.teleported,
          onChat: () => {
            getMeshService()?.openGeoDm(channel, p.pubkey, p.nickname);
            onNavigateToChannel?.(`dm:nostr_${p.pubkey}`);
            onClose();
          },
        }))
      : isPrivate
        ? privateMembers.map((m) => ({
            id: m.peerID,
            name: m.nickname || peerIDToUsername(m.peerID),
            teleported: false,
            onChat: () => openDmWith(m.peerID),
          }))
        : peerList.map((peer) => ({
            id: peer.peerID,
            name: peer.nickname || peerIDToUsername(peer.peerID),
            teleported: false,
            onChat: () => openDmWith(peer.peerID),
          }));
  const memberSectionTitle = isGeo
    ? T("chat.info.active")
    : T("chat.info.members");
  const showYouRow =
    !isGroup && localNickname !== undefined && localPeerID !== undefined;
  const memberTotal = members.length + (showYouRow ? 1 : 0);
  // You only show as teleported in a cell you jumped to, not a named one.
  const selfTeleported = isManualGeo;
  const query = memberSearch.trim().toLowerCase();
  const filteredMembers =
    query.length > 0
      ? members.filter((m) => m.name.toLowerCase().includes(query))
      : members;
  const youMatches =
    query.length === 0 || (localNickname ?? "").toLowerCase().includes(query);
  const visibleCount =
    filteredMembers.length + (showYouRow && youMatches ? 1 : 0);

  // Peers the creator can add: reachable (announced Noise key) and not already
  // in the roster. The 16 cap is enforced in toggleAddMember.
  const groupMemberPeerIDs = new Set(
    groupMembers.map((m) => m.fingerprint.slice(0, 16)),
  );
  const addablePeers = isGroup
    ? peerList.filter(
        (p) => p.noisePubKeyHex && !groupMemberPeerIDs.has(p.peerID),
      )
    : [];

  return (
    <BottomSheet visible onClose={onClose} sheetStyle={styles.sheet} scrollable>
      {/* Top-right corner action, mirroring the pencil on the contact sheet:
              a location channel with a resolved cell gets a bookmark toggle. */}
      {isGeo && geohash !== null && (
        <Pressable
          style={styles.cornerBtn}
          onPress={() => useGeohashBookmarksStore.getState().toggle(geohash)}
          hitSlop={hitSlopFor(28)}
          accessibilityRole="button"
          accessibilityLabel={
            bookmarked
              ? T("chat.info.remove_bookmark")
              : T("chat.info.bookmark")
          }
        >
          <MaterialCommunityIcons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={20}
            color={bookmarked ? Colors.accent : Colors.textMuted}
          />
        </Pressable>
      )}

      {/* Centered header: icon + name + scope tag, with an optional corner
              action (bookmark, for location channels). */}
      <View style={styles.headerCenter}>
        <View style={styles.iconWrap}>
          <Feather
            name={isGroup ? "users" : isManualGeo ? "map-pin" : "hash"}
            size={22}
            color={Colors.textPrimary}
          />
        </View>

        <Text style={styles.channelName} numberOfLines={1}>
          {isGroup
            ? (groupName ?? T("chat.group_badge"))
            : isManualGeo
              ? manualGh
              : channel.replace(/^#/, "")}
        </Text>

        <Text style={styles.scopeTag}>
          {isGroup
            ? TP("chat.group_members", groupMembers.length)
            : ((scopeData === undefined ? undefined : T(scopeData.tagKey)) ??
              (isManualGeo
                ? T("chat.info.teleported_tag", {
                    level: geohashLevelName(manualGh),
                  })
                : T("chat.info.custom_channel")))}
          {placeName !== undefined && `  ·  ~${placeName}`}
        </Text>
      </View>

      <View style={styles.divider} />

      <ScrollView
        ref={bodyRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}
        // So tapping a member row registers on the first tap while the member
        // search has focus, instead of being eaten dismissing the keyboard.
        keyboardShouldPersistTaps="handled"
      >
        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{T("chat.info.about")}</Text>
          <Text style={styles.description}>{resolvedDescription}</Text>
        </View>

        {/* At a glance: privacy, reach, and (for a location channel) the
                geohash, as one compact card. This states what actually happens
                on the wire; the caveat that matters sits just below it. */}
        <View style={styles.factsWrap}>
          <View style={styles.factsCard}>
            <View style={styles.factRow}>
              <Feather name={privacyIcon} size={16} color={privacyColor} />
              <Text style={styles.factValue}>{privacyLabel}</Text>
            </View>
            <View style={styles.factDivider} />
            <View style={styles.factRow}>
              <Feather
                name={reachIcon}
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.factValue}>{reachLabel}</Text>
            </View>
            {isGeo && geohash !== null && (
              <>
                <View style={styles.factDivider} />
                <View style={styles.factRow}>
                  <Feather
                    name="map-pin"
                    size={16}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.factValue} numberOfLines={1}>
                    <Text style={styles.factGeohashLabel}>
                      {T("chat.info.geohash")}{" "}
                    </Text>
                    <Text style={styles.factGeohash}>{geohash}</Text>
                  </Text>
                  <Pressable
                    style={styles.copyBtn}
                    onPress={handleCopyGeohash}
                    hitSlop={HIT_SLOP}
                    accessibilityRole="button"
                    accessibilityLabel={T("chat.info.copy_geohash")}
                  >
                    <Feather
                      name={copied ? "check" : "copy"}
                      size={15}
                      color={copied ? Colors.online : Colors.textMuted}
                    />
                  </Pressable>
                </View>
                {/* Relays carrying this cell. Same disclosure idiom as Custom
                    relays in Settings > Network, so the two screens that talk
                    about relays behave the same way. */}
                <View style={styles.factDivider} />
                <Pressable
                  style={styles.factRow}
                  onPress={() => setRelaysExpanded((v) => !v)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: relaysExpanded }}
                  accessibilityLabel={T("chat.info.show_relays")}
                >
                  <Feather
                    name="server"
                    size={16}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.factValue}>{T("chat.info.relays")}</Text>
                  <Text style={styles.factCount}>{cellRelays.length}</Text>
                  <Feather
                    name={relaysExpanded ? "chevron-up" : "chevron-down"}
                    size={15}
                    color={Colors.textMuted}
                  />
                </Pressable>
                {relaysExpanded && (
                  <View style={styles.relayList}>
                    {cellRelays.length === 0 ? (
                      <Text style={styles.relayEmpty}>
                        {T("chat.info.relays_none")}
                      </Text>
                    ) : (
                      cellRelays.map((url) => (
                        <View key={url} style={styles.relayRow}>
                          <Text style={styles.relayHost} numberOfLines={1}>
                            {relayDisplayHost(url)}
                          </Text>
                          {customRelaySet.has(url) && (
                            <Text style={styles.relayTag}>
                              {T("chat.info.relay_custom")}
                            </Text>
                          )}
                        </View>
                      ))
                    )}
                  </View>
                )}
              </>
            )}
          </View>
          <Text style={styles.factHint}>{detailHint}</Text>
        </View>

        {/* Members: a group's signed roster, a geo cell's active
                participants, or the nearby BLE peers — one layout for all three,
                with a "You" row, a search toggle, and a chat action per member. */}
        <View style={styles.section}>
          <View style={styles.memberHeaderRow}>
            <Text style={styles.sectionLabel}>
              {`${memberSectionTitle} · ${memberTotal}`}
            </Text>
            <Pressable
              onPress={() => {
                setSearching((s) => !s);
                setMemberSearch("");
              }}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={T("chat.info.search_members")}
            >
              <Feather
                name="search"
                size={15}
                color={searching ? Colors.textPrimary : Colors.textMuted}
              />
            </Pressable>
          </View>

          {searching && (
            <TextInput
              style={styles.memberSearchInput}
              value={memberSearch}
              onChangeText={setMemberSearch}
              placeholder={T("chat.info.search_members_placeholder")}
              placeholderTextColor={Colors.textMuted}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor={Colors.selection}
            />
          )}

          <View style={styles.memberList}>
            {/* You: your own row, no chat action (you can't DM yourself);
                    the right side reads "You". */}
            {showYouRow && youMatches && (
              <View style={styles.memberRow}>
                <Avatar
                  username={localNickname}
                  peerID={localPeerID}
                  size={30}
                />
                <Text style={styles.memberName} numberOfLines={1}>
                  {localNickname}
                </Text>
                {selfTeleported && (
                  <Text style={styles.memberTag}>
                    {T("chat.info.teleported")}
                  </Text>
                )}
                <Text style={styles.memberYou}>{T("chat.you")}</Text>
              </View>
            )}

            {filteredMembers.map((m) => (
              <View key={m.id} style={styles.memberRow}>
                <Avatar username={m.name} peerID={m.id} size={30} />
                <Text style={styles.memberName} numberOfLines={1}>
                  {m.name}
                </Text>
                {isGroup && m.id === groupCreatorFp && (
                  <Text style={styles.memberTag}>{t("chat.info.creator")}</Text>
                )}
                {m.teleported && (
                  <Text style={styles.memberTag}>
                    {t("chat.info.teleported")}
                  </Text>
                )}
                {m.onChat && (
                  <Pressable
                    onPress={m.onChat}
                    hitSlop={HIT_SLOP}
                    accessibilityRole="button"
                    accessibilityLabel={T("chat.info.message_member", {
                      name: m.name,
                    })}
                  >
                    <Feather
                      name="message-circle"
                      size={18}
                      color={Colors.textSecondary}
                    />
                  </Pressable>
                )}
                {m.onRemove && (
                  <Pressable
                    onPress={m.onRemove}
                    hitSlop={HIT_SLOP}
                    accessibilityRole="button"
                    accessibilityLabel={T("chat.info.remove_member_a11y", {
                      name: m.name,
                    })}
                  >
                    <Feather name="user-x" size={17} color={Colors.danger} />
                  </Pressable>
                )}
              </View>
            ))}

            {visibleCount === 0 && (
              <Text style={styles.noMembers}>
                {query.length > 0
                  ? T("chat.info.no_matches")
                  : T("chat.info.no_one_here")}
              </Text>
            )}
          </View>
        </View>

        {/* Share */}
        {/* (removed: channel name visible in every screen header) */}

        {/* Actions: add members (creator only), then leave. Both full-width
            pills in one stack, so a group's two management actions read as a
            pair instead of one sitting under the roster and one below it. */}
        {!isDefault ? (
          <View style={styles.actions}>
            {canAddMembers && (
              <Pressable
                style={styles.actionBtn}
                onPress={() => {
                  setAddSelected(new Set());
                  setShowAddMembers(true);
                }}
                accessibilityRole="button"
                accessibilityLabel={T("chat.info.add_members")}
              >
                <Feather
                  name="user-plus"
                  size={15}
                  color={Colors.textSecondary}
                />
                <Text style={styles.addMembersText}>
                  {T("chat.info.add_members")}
                </Text>
              </Pressable>
            )}
            <Pressable
              style={[
                styles.actionBtn,
                canAddMembers && styles.actionBtnStacked,
              ]}
              onPress={handleLeave}
              accessibilityRole="button"
              accessibilityLabel={
                isGroup
                  ? T("chat.info.leave_group")
                  : T("chat.info.leave_channel")
              }
            >
              <Feather name="log-out" size={15} color={Colors.danger} />
              <Text style={styles.leaveBtnText}>
                {isGroup ? T("chat.info.leave_group") : T("chat.info.leave")}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.defaultNotice}>
            <Feather name="lock" size={13} color={Colors.textMuted} />
            <Text style={styles.defaultNoticeText}>
              {T("chat.info.default_notice")}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Creator-only add-members picker. A sibling of the body rather than a
          child, since a zero-height sheet host inside the body's flex column
          still claimed one of its `gap` slots. */}
      {showAddMembers && (
        <BottomSheet
          visible
          onClose={() => setShowAddMembers(false)}
          sheetStyle={styles.addSheet}
          scrollable
        >
          <Text style={styles.addTitle}>{T("chat.info.add_members")}</Text>
          {addablePeers.length === 0 ? (
            <Text style={styles.noMembers}>{T("chat.info.no_addable")}</Text>
          ) : (
            <ScrollView
              style={styles.addList}
              showsVerticalScrollIndicator={false}
            >
              {addablePeers.map((peer) => {
                const sel = addSelected.has(peer.peerID);
                return (
                  <Pressable
                    key={peer.peerID}
                    style={styles.addRow}
                    onPress={() => toggleAddMember(peer.peerID)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: sel }}
                  >
                    <Avatar
                      username={peer.nickname}
                      peerID={peer.peerID}
                      size={36}
                    />
                    <Text style={styles.memberName} numberOfLines={1}>
                      {peer.nickname}
                    </Text>
                    <View style={[styles.addCheck, sel && styles.addCheckOn]}>
                      {sel && (
                        <Feather
                          name="check"
                          size={14}
                          color={Colors.textInverse}
                        />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
          <Pressable
            style={[
              styles.addConfirm,
              addSelected.size === 0 && styles.addConfirmDisabled,
            ]}
            onPress={handleAddMembers}
            disabled={addSelected.size === 0}
            accessibilityRole="button"
            accessibilityLabel={T("chat.info.add_selected")}
          >
            <Text style={styles.addConfirmText}>
              {addSelected.size > 0
                ? T("chat.info.add_count", { count: addSelected.size })
                : T("chat.info.add")}
            </Text>
          </Pressable>
        </BottomSheet>
      )}
    </BottomSheet>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    sheet: {
      maxHeight: "85%",
    },
    // ---- Header (centered) ----------------------------------------------------
    headerCenter: {
      alignItems: "center",
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.lg,
      gap: Spacing.sm,
    },
    cornerBtn: {
      // Top-right corner of the sheet, mirroring the pencil on the contact sheet.
      position: "absolute",
      top: Spacing.base,
      end: Spacing.base,
      zIndex: 1,
      padding: Spacing.xs,
    },
    iconWrap: {
      width: 52,
      height: 52,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    channelName: {
      alignSelf: "stretch",
      paddingHorizontal: Spacing.xl,
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
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginHorizontal: Spacing.xl,
      marginBottom: Spacing.xs,
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
    // ---- At-a-glance facts card ------------------------------------------------
    factsWrap: {
      gap: Spacing.sm,
    },
    factsCard: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      paddingHorizontal: Spacing.base,
    },
    factRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.md,
    },
    factDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
    },
    factValue: {
      flex: 1,
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    factGeohashLabel: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textMuted,
    },
    factGeohash: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
      fontFamily: FontFamily.mono,
      letterSpacing: 1,
    },
    // Relay count on the disclosure row, muted so the label leads.
    factCount: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textMuted,
    },
    // Relay hosts sit inside the facts card, indented to start under the row's
    // label rather than its icon: a fact row is a 16px icon plus a Spacing.md
    // gap, so the hosts hang off the same left edge as "Relays" above them.
    relayList: {
      paddingBottom: Spacing.md,
      paddingLeft: 16 + Spacing.md,
      gap: 6,
    },
    relayRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    // Mono, matching how the geohash above is treated: both are technical
    // identifiers the user may want to read character by character.
    relayHost: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontFamily: FontFamily.mono,
    },
    // "custom" marker, same weight as the member row's "teleported" tag.
    relayTag: {
      fontSize: FontSize.xs,
      lineHeight: 16,
      color: Colors.textMuted,
    },
    relayEmpty: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: 18,
    },
    copyBtn: {
      width: 30,
      height: 30,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    // Single adaptive caveat under the facts card.
    factHint: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: 18,
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
    // "Teleported" tag and the "You" marker sit on the right of a member row;
    // matching size + lineHeight keeps them on one clean baseline.
    memberTag: {
      fontSize: FontSize.xs,
      lineHeight: 16,
      color: Colors.textMuted,
    },
    // "You" marker on your own member row.
    memberYou: {
      fontSize: FontSize.xs,
      lineHeight: 16,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
    },
    // Section label + search icon share one row.
    memberHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    // Matches the app's top search bar: a pill with a border, same padding.
    memberSearchInput: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm + 2,
      fontSize: FontSize.sm,
      color: Colors.textPrimary,
    },
    noMembers: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontStyle: "italic",
    },
    // ---- Add members (creator only) --------------------------------------------
    addMembersText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.textSecondary,
    },
    // The picker needs its own sheet style. It used to share `sheet`, which is
    // only a height cap: the info sheet pads its inner scroll body instead, and
    // this sheet has no inner body to pad, so its content sat flush to the edges.
    addSheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.md,
      maxHeight: "85%",
    },
    addTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    addList: {
      maxHeight: 320,
    },
    addRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.sm,
    },
    addCheck: {
      width: 24,
      height: 24,
      borderRadius: Radius.full,
      borderWidth: 1.5,
      borderColor: Colors.borderStrong,
      alignItems: "center",
      justifyContent: "center",
    },
    addCheckOn: {
      backgroundColor: Colors.accent,
      borderColor: Colors.accent,
    },
    addConfirm: {
      width: "100%",
      minHeight: 50,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    addConfirmDisabled: {
      opacity: DISABLED_OPACITY,
    },
    addConfirmText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textInverse,
    },
    // ---- Actions ---------------------------------------------------------------
    // One stack of identical full-width pills, a single marginTop apart. Same
    // pattern as the Wipe now / Cancel pair in the profile screen.
    actions: {
      width: "100%",
      marginTop: Spacing.sm,
    },
    actionBtn: {
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
    actionBtnStacked: {
      marginTop: Spacing.sm,
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
      borderRadius: Radius.lg,
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
