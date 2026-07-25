// Shared channel detail bottom sheet.
// Used by both channel-list (info icon tap) and message-thread (header tap).
// Shows About, an at-a-glance facts card (privacy, reach, geohash), and Members.
// Read-only: it describes what a room is and who is in it. Default channels add
// a protocol lock notice; a location channel adds a bookmark toggle.

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GROUP_MAX_MEMBERS } from "../../core/mesh/group-protocol";
import {
  type GeoParticipant,
  geohashLevelName,
  isGeoChannel,
  isManualGeoChannel,
  manualGeohashOf,
} from "../../services/geohash-channel-service";
import { getMeshService } from "../../services/mesh-service";
import { showAlert } from "../../store/alert-store";
import { useChatStore } from "../../store/chat-store";
import { useGeohashBookmarksStore } from "../../store/geohash-bookmarks-store";
import { useGroupStore } from "../../store/group-store";
import { usePeerStore } from "../../store/peer-store";
import { usePlaceNamesStore } from "../../store/place-names-store";
import Avatar from "../../ui/components/avatar";
import {
  FontFamily,
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
    tag: "Local mesh · Bluetooth only",
    description:
      "Reaches devices within Bluetooth range (roughly 10 to 100 metres). No internet required. Ideal for local coordination.",
    transport: "Bluetooth only",
  },
  "#block": {
    tag: "City block · ~100m",
    description:
      "City-block level coverage. Messages are bridged over the internet so peers outside Bluetooth range but nearby can participate.",
    transport: "Bluetooth + Internet",
  },
  "#neighborhood": {
    tag: "Neighborhood · ~1km",
    description:
      "Neighborhood coverage. Relay-assisted so peers across the area are reachable even without a direct Bluetooth link.",
    transport: "Bluetooth + Internet",
  },
  "#city": {
    tag: "City · ~10km",
    description:
      "City-wide channel. Uses geo-located internet relays to reach peers across the metro area.",
    transport: "Bluetooth + Internet",
  },
  "#province": {
    tag: "Province or state · ~100km",
    description:
      "Provincial or state coverage. Bridged over the internet for regional reach across hundreds of kilometres.",
    transport: "Bluetooth + Internet",
  },
  "#region": {
    tag: "Country or region · ~1000km",
    description:
      "Country-wide coverage. Any Airhop or bitchat user in the region can join and read messages.",
    transport: "Bluetooth + Internet",
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
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const { removeChannel, channelKeys, channelReach, addChannel } =
    useChatStore();
  const { peers } = usePeerStore();
  const peerList = [...peers.values()];

  const [copied, setCopied] = useState(false);
  // Member-list search, revealed by the search icon next to the section label.
  const [memberSearch, setMemberSearch] = useState("");
  const [searching, setSearching] = useState(false);
  // Creator-only "add members" picker.
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [addSelected, setAddSelected] = useState<Set<string>>(new Set());

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
    channelGeohash !== null ? s.names[channelGeohash] : undefined,
  );
  useEffect(() => {
    if (channelGeohash !== null) {
      usePlaceNamesStore.getState().resolve(channelGeohash);
    }
  }, [channelGeohash]);

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
    scopeData?.description ??
    (isGroup
      ? "A private group. Only the members the creator added can read it, and it stays on Bluetooth."
      : isManualGeo
        ? "A public location channel for this geohash cell. Anyone in the cell, on Airhop or bitchat, shares it over the internet. You are teleported, not physically here."
        : "A custom channel. Anyone who knows the name can join from any Airhop or bitchat device.");

  // The three at-a-glance facts, computed once so the card below stays declarative:
  // privacy (is it encrypted), reach (which transports carry it), and location
  // (the geohash, for geo channels). The old sheet spread these across two
  // paragraph-heavy sections that restated the same thing.
  type IconName = React.ComponentProps<typeof Feather>["name"];
  // "unlock" for public (unencrypted), distinct from the reach row's "globe".
  const privacyIcon: IconName = encrypted ? "lock" : "unlock";
  const privacyColor = encrypted ? Colors.e2ee : Colors.danger;
  const privacyLabel = encrypted
    ? "Private · end-to-end encrypted"
    : "Public · unencrypted";

  let reachIcon: IconName = "bluetooth";
  let reachLabel = "Bluetooth only";
  if (isGroup) {
    reachIcon = "bluetooth";
    reachLabel = "Bluetooth only";
  } else if (isManualGeo) {
    reachIcon = "globe";
    reachLabel = "Internet only";
  } else if (isPrivate) {
    reachIcon = overNostr ? "globe" : "bluetooth";
    reachLabel = overNostr ? "Bluetooth + Internet" : "Bluetooth only";
  } else if (isGeo && geohash !== null) {
    reachIcon = "globe";
    reachLabel = "Bluetooth + Internet";
  }

  // One adaptive caveat under the card: whichever nuance actually matters for
  // this channel, rather than three stacked explanations.
  const detailHint = isGroup
    ? "Only the members shown below can read this group. Messages stay on Bluetooth, so members out of range receive them once they are back."
    : isManualGeo
      ? "A place you teleported to. It reaches everyone in this cell over the internet, and nobody in Bluetooth range."
      : isGeo && geohash === null
        ? "Location is off, so this channel reaches nearby devices over Bluetooth only. Turn on location to reach its area cell over the internet."
        : isPrivate
          ? "Only people you invite via the link can read it. It stays hidden from everyone else, even peers nearby."
          : "Anyone who joins can read every message. Use a direct message for private conversation; DMs are end-to-end encrypted.";

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
      "Remove member",
      `Remove ${memberName} from the group? The group key rotates so they can no longer read new messages.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            getMeshService()?.removeGroupMember(groupIDHex, fingerprint);
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
    getMeshService()?.addGroupMembers(groupIDHex, [...addSelected]);
    setAddSelected(new Set());
    setShowAddMembers(false);
  }

  // One unified member list for all channel kinds. A group's signed roster, a
  // geo cell's active participants, or the nearby BLE peers all normalise to the
  // same shape and render identically (You row, chat action, search). Self is
  // counted the way bitchat counts it — included in the total. A group roster
  // already lists you, so it is not re-added; geo/BLE lists are others-only, so
  // you appear as a "You" row and add one to the count.
  type MemberItem = {
    id: string;
    name: string;
    teleported: boolean;
    onChat?: () => void;
    onRemove?: () => void;
  };
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
            getMeshService()?.openGeoDm(channel, p.pubkey);
            onNavigateToChannel?.(`dm:nostr_${p.pubkey}`);
            onClose();
          },
        }))
      : peerList.map((peer) => ({
          id: peer.peerID,
          name: peer.nickname || peerIDToUsername(peer.peerID),
          teleported: false,
          onChat: () => {
            addChannel(`dm:${peer.peerID}`);
            onNavigateToChannel?.(`dm:${peer.peerID}`);
            onClose();
          },
        }));
  const memberSectionTitle = isGeo ? "Active" : "Members";
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
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Top-right corner action, mirroring the pencil on the contact sheet:
              a location channel with a resolved cell gets a bookmark toggle. */}
          {isGeo && geohash !== null && (
            <Pressable
              style={styles.cornerBtn}
              onPress={() =>
                useGeohashBookmarksStore.getState().toggle(geohash)
              }
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={
                bookmarked ? "Remove bookmark" : "Bookmark this place"
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
                ? (groupName ?? "Group")
                : isManualGeo
                  ? manualGh
                  : channel.replace(/^#/, "")}
            </Text>

            <Text style={styles.scopeTag}>
              {isGroup
                ? `Private group  ·  ${groupMembers.length} member${groupMembers.length !== 1 ? "s" : ""}`
                : (scopeData?.tag ??
                  (isManualGeo
                    ? `${geohashLevelName(manualGh)}  ·  teleported`
                    : "Custom channel"))}
              {placeName !== undefined && `  ·  ~${placeName}`}
            </Text>
          </View>

          <View style={styles.divider} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            {/* About */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>About</Text>
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
                        <Text style={styles.factGeohashLabel}>Geohash </Text>
                        <Text style={styles.factGeohash}>{geohash}</Text>
                      </Text>
                      <Pressable
                        style={styles.copyBtn}
                        onPress={handleCopyGeohash}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel="Copy geohash"
                      >
                        <Feather
                          name={copied ? "check" : "copy"}
                          size={15}
                          color={copied ? Colors.online : Colors.textMuted}
                        />
                      </Pressable>
                    </View>
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
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Search members"
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
                  placeholder="Search members..."
                  placeholderTextColor={Colors.textMuted}
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor={Colors.accent}
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
                      <Text style={styles.memberTag}>Teleported</Text>
                    )}
                    <Text style={styles.memberYou}>You</Text>
                  </View>
                )}

                {filteredMembers.map((m) => (
                  <View key={m.id} style={styles.memberRow}>
                    <Avatar username={m.name} peerID={m.id} size={30} />
                    <Text style={styles.memberName} numberOfLines={1}>
                      {m.name}
                    </Text>
                    {isGroup && m.id === groupCreatorFp && (
                      <Text style={styles.memberTag}>Creator</Text>
                    )}
                    {m.teleported && (
                      <Text style={styles.memberTag}>Teleported</Text>
                    )}
                    {m.onChat && (
                      <Pressable
                        onPress={m.onChat}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel={`Message ${m.name}`}
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
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${m.name}`}
                      >
                        <Feather
                          name="user-x"
                          size={17}
                          color={Colors.danger}
                        />
                      </Pressable>
                    )}
                  </View>
                ))}

                {visibleCount === 0 && (
                  <Text style={styles.noMembers}>
                    {query.length > 0 ? "No matches." : "No one here yet."}
                  </Text>
                )}
              </View>

              {isGroupCreator && groupMembers.length < GROUP_MAX_MEMBERS && (
                <Pressable
                  style={styles.addMembersBtn}
                  onPress={() => {
                    setAddSelected(new Set());
                    setShowAddMembers(true);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Add members"
                >
                  <Feather
                    name="user-plus"
                    size={16}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.addMembersText}>Add members</Text>
                </Pressable>
              )}
            </View>

            {/* Creator-only add-members picker. */}
            {showAddMembers && (
              <Modal
                transparent
                animationType="slide"
                onRequestClose={() => setShowAddMembers(false)}
              >
                <View style={styles.overlay}>
                  <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => setShowAddMembers(false)}
                  />
                  <View style={styles.sheet}>
                    <View style={styles.handle} />
                    <Text style={styles.addTitle}>Add members</Text>
                    {addablePeers.length === 0 ? (
                      <Text style={styles.noMembers}>
                        No reachable peers to add. Members must be nearby.
                      </Text>
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
                              style={styles.memberRow}
                              onPress={() => toggleAddMember(peer.peerID)}
                              accessibilityRole="checkbox"
                              accessibilityState={{ checked: sel }}
                            >
                              <Avatar
                                username={peer.nickname}
                                peerID={peer.peerID}
                                size={30}
                              />
                              <Text style={styles.memberName} numberOfLines={1}>
                                {peer.nickname}
                              </Text>
                              <View
                                style={[
                                  styles.addCheck,
                                  sel && styles.addCheckOn,
                                ]}
                              >
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
                      accessibilityLabel="Add selected members"
                    >
                      <Text style={styles.addConfirmText}>
                        {addSelected.size > 0
                          ? `Add ${addSelected.size}`
                          : "Add"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            )}

            {/* Share */}
            {/* (removed: channel name visible in every screen header) */}

            {/* Actions: leave */}
            {!isDefault ? (
              <View style={styles.actions}>
                <Pressable
                  style={styles.leaveBtn}
                  onPress={handleLeave}
                  accessibilityRole="button"
                  accessibilityLabel={isGroup ? "Leave group" : "Leave channel"}
                >
                  <Feather name="log-out" size={15} color={Colors.danger} />
                  <Text style={styles.leaveBtnText}>
                    {isGroup ? "Leave group" : "Leave"}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.defaultNotice}>
                <Feather name="lock" size={13} color={Colors.textMuted} />
                <Text style={styles.defaultNoticeText}>
                  Default rooms cannot be left. They are part of the Airhop mesh
                  protocol.
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
    cornerBtn: {
      // Top-right corner of the sheet, mirroring the pencil on the contact sheet.
      position: "absolute",
      top: Spacing.base,
      right: Spacing.base,
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
    addMembersBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      marginTop: Spacing.sm,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceRaised,
    },
    addMembersText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.textSecondary,
    },
    addTitle: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      marginBottom: Spacing.sm,
    },
    addList: {
      maxHeight: 320,
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
      marginTop: Spacing.md,
      minHeight: 50,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    addConfirmDisabled: {
      opacity: 0.4,
    },
    addConfirmText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textInverse,
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
