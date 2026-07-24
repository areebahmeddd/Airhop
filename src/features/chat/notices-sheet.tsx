// Notices: the bulletin board for a channel.
//
// A notice is a signed, persistent post that outlives chat. It rides the mesh as
// a BOARD_POST (0x23) and, on a location channel, is also bridged to Nostr as a
// kind-1 note so people who are online but out of Bluetooth range see it.
//
// Two scopes, mirroring bitchat:
//   Here  - this location cell (geo board posts + Nostr location notes)
//   Mesh  - the Bluetooth-local board (geohash "", BLE-only)
//
// The two feeds are merged with the board copy winning over its own bridged
// Nostr note (it carries urgency and supports deletion). Urgent posts sort
// first, then newest. You can delete your own posts; a signed tombstone
// outruns stale copies across the mesh and retracts the bridged note.

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { bytesToHex } from "@noble/hashes/utils.js";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { isUrgent, type BoardPost } from "../../core/mesh/board-packet";
import { getMeshService } from "../../services/mesh-service";
import { useBoardStore } from "../../store/board-store";
import { useNoticesStore, type LocationNote } from "../../store/notices-store";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";

const CONTENT_MAX = 512;
// days: 0 is the permanent (∞) option, offered only in a location cell (it is a
// standalone Nostr note with no expiry; the mesh board always expires <= 7 days).
const EXPIRY_OPTIONS = [
  { label: "1 day", days: 1 },
  { label: "3 days", days: 3 },
  { label: "7 days", days: 7 },
  { label: "∞", days: 0 },
] as const;

// A board post's Nostr bridge arrives as a same-content note signed by an
// unlinkable key; match heuristically within this window and drop the copy.
const BRIDGE_DEDUPE_MS = 15 * 60 * 1000;

interface NoticeRow {
  id: string;
  author: string;
  content: string;
  createdAtMs: number;
  urgent: boolean;
  expiresAtMs?: number;
  isBoard: boolean;
  post?: BoardPost;
}

function boardAuthor(nickname: string): string {
  const n = nickname.trim();
  return n.length > 0 ? n : "anon";
}

// Merge board posts and location notes for one cell. A note that looks like the
// bridged copy of a board post is dropped; the board copy wins.
function mergeNotices(posts: BoardPost[], notes: LocationNote[]): NoticeRow[] {
  const rows: NoticeRow[] = posts.map((post) => ({
    id: bytesToHex(post.postID),
    author: boardAuthor(post.authorNickname),
    content: post.content,
    createdAtMs: post.createdAt,
    urgent: isUrgent(post),
    expiresAtMs: post.expiresAt,
    isBoard: true,
    post,
  }));

  for (const note of notes) {
    const noteNick = (note.nickname ?? "").trim() || "anon";
    const isBridged = posts.some(
      (post) =>
        post.geohash === note.geohash &&
        post.content === note.content &&
        boardAuthor(post.authorNickname) === noteNick &&
        Math.abs(post.createdAt - note.createdAtMs) <= BRIDGE_DEDUPE_MS,
    );
    if (isBridged) continue;
    rows.push({
      id: note.id,
      author: noteNick,
      content: note.content,
      createdAtMs: note.createdAtMs,
      urgent: note.isUrgent,
      expiresAtMs: note.expiresAtMs,
      isBoard: false,
    });
  }

  return rows.sort((a, b) => {
    if (a.urgent !== b.urgent) return a.urgent ? -1 : 1;
    return b.createdAtMs - a.createdAtMs;
  });
}

function ageLabel(ms: number, now: number): string {
  const s = Math.max(0, Math.floor((now - ms) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fadeLabel(
  expiresAtMs: number | undefined,
  now: number,
): string | null {
  if (expiresAtMs === undefined) return null;
  const s = Math.max(0, Math.floor((expiresAtMs - now) / 1000));
  if (s <= 0) return "fading";
  const h = Math.floor(s / 3600);
  if (h < 1) return "fades soon";
  if (h < 24) return `fades in ${h}h`;
  return `fades in ${Math.floor(h / 24)}d`;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  channel: string;
}

export function NoticesSheet({ visible, onClose, channel }: Props) {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  const mesh = getMeshService();
  const geohash = visible ? (mesh?.getChannelGeohash(channel) ?? null) : null;
  const myKey = mesh?.boardAuthorKey ?? new Uint8Array(0);

  // Scope tab. Derived, not stored: default to the location cell when one is
  // resolved, else the mesh board, and let an explicit tab tap override that.
  // (Avoids a setState-in-effect just to seed the default.)
  const [scopeOverride, setScopeOverride] = useState<"here" | "mesh" | null>(
    null,
  );
  const scope: "here" | "mesh" =
    scopeOverride ?? (geohash !== null ? "here" : "mesh");

  // Compose state.
  const [draft, setDraft] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [expiryDays, setExpiryDays] = useState(1);

  // The permanent (∞ = 0) option only exists in a location cell. If it is picked
  // and the user then switches to the mesh board, treat it as 1 day so the chips
  // never show an impossible selection and the mesh post gets a valid expiry.
  const effectiveExpiryDays =
    scope !== "here" && expiryDays === 0 ? 1 : expiryDays;

  // Re-render on a slow tick so relative times and fade labels stay fresh.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, [visible]);

  const posts = useBoardStore((s) => s.posts);
  const notesByGeohash = useNoticesStore((s) => s.notesByGeohash);

  const scopeGeohash = scope === "here" && geohash !== null ? geohash : "";
  // Derived directly; the React Compiler memoizes it from the reads below.
  const livePosts = posts.filter(
    (p) => p.geohash === scopeGeohash && p.expiresAt > now,
  );
  const liveNotes = (
    scopeGeohash.length > 0 ? (notesByGeohash[scopeGeohash] ?? []) : []
  ).filter((n) => n.expiresAtMs === undefined || n.expiresAtMs > now);
  const rows = mergeNotices(livePosts, liveNotes);

  const draftBytes = new TextEncoder().encode(draft.trim()).length;
  const canPost = draftBytes > 0 && draftBytes <= CONTENT_MAX;

  function handlePost() {
    if (!canPost) return;
    // Permanent (∞) is a location-only, Nostr-only note: no mesh board post and
    // no NIP-40 expiry, matching bitchat's geo "∞" option. It needs a relay, so
    // it resolves async and only clears the draft once it is actually published.
    if (
      scope === "here" &&
      effectiveExpiryDays === 0 &&
      scopeGeohash.length > 0
    ) {
      void mesh?.createPermanentNote(draft, scopeGeohash).then((ok) => {
        if (ok) setDraft("");
      });
      return;
    }
    // Urgency is a mesh-board concept in bitchat: a location cell can be huge, so
    // an "urgent" geohash notice would let anyone shout across a whole city. Only
    // the local mesh board can carry urgency, so we drop the flag off-mesh even
    // if it was toggled before the user switched scope.
    const ok = mesh?.createBoardPost(
      draft,
      scopeGeohash,
      scope === "mesh" && urgent,
      effectiveExpiryDays,
    );
    if (ok === true) {
      setDraft("");
      setUrgent(false);
    }
  }

  function handleDelete(post: BoardPost) {
    mesh?.deleteBoardPost(post);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.titleRow}>
            <MaterialCommunityIcons
              name="bulletin-board"
              size={18}
              color={Colors.textPrimary}
            />
            <Text style={styles.title}>Notices</Text>
          </View>

          {/* Scope tabs: only offer "Here" when a location cell is resolved. */}
          {geohash !== null && (
            <View style={styles.tabs}>
              <Pressable
                style={[styles.tab, scope === "here" && styles.tabActive]}
                onPress={() => setScopeOverride("here")}
                accessibilityRole="button"
              >
                <Feather
                  name="map-pin"
                  size={13}
                  color={
                    scope === "here" ? Colors.textPrimary : Colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    scope === "here" && styles.tabTextActive,
                  ]}
                >
                  Here
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, scope === "mesh" && styles.tabActive]}
                onPress={() => setScopeOverride("mesh")}
                accessibilityRole="button"
              >
                <Feather
                  name="bluetooth"
                  size={13}
                  color={
                    scope === "mesh" ? Colors.textPrimary : Colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    scope === "mesh" && styles.tabTextActive,
                  ]}
                >
                  Mesh
                </Text>
              </Pressable>
            </View>
          )}

          {/* Compose */}
          <View style={styles.composer}>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder={
                scope === "here"
                  ? "Post a notice to this area"
                  : "Post a notice to the mesh"
              }
              placeholderTextColor={Colors.textMuted}
              multiline
              maxLength={CONTENT_MAX * 2}
            />
            <View style={styles.composerControls}>
              {/* Urgent is mesh-only, matching bitchat: the toggle simply is not
                  offered in a location cell. */}
              {scope === "mesh" && (
                <Pressable
                  style={[styles.urgentToggle, urgent && styles.urgentToggleOn]}
                  onPress={() => setUrgent((u) => !u)}
                  accessibilityRole="button"
                  accessibilityLabel="Mark urgent"
                >
                  <Feather
                    name="alert-triangle"
                    size={13}
                    color={urgent ? Colors.textInverse : Colors.textSecondary}
                  />
                  <Text
                    style={[styles.urgentText, urgent && styles.urgentTextOn]}
                  >
                    Urgent
                  </Text>
                </Pressable>
              )}

              <View style={styles.expiryChips}>
                {EXPIRY_OPTIONS.filter(
                  (opt) => opt.days !== 0 || scope === "here",
                ).map((opt) => (
                  <Pressable
                    key={opt.days}
                    style={[
                      styles.chip,
                      effectiveExpiryDays === opt.days && styles.chipActive,
                    ]}
                    onPress={() => setExpiryDays(opt.days)}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.chipText,
                        effectiveExpiryDays === opt.days &&
                          styles.chipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <Pressable
              style={[styles.postBtn, !canPost && styles.postBtnDisabled]}
              onPress={handlePost}
              disabled={!canPost}
              accessibilityRole="button"
              accessibilityLabel="Post notice"
            >
              <Text style={styles.postBtnText}>Post</Text>
            </Pressable>
          </View>

          {/* List */}
          {rows.length === 0 ? (
            <Text style={styles.empty}>
              No notices yet. Post one so it stays here for others.
            </Text>
          ) : (
            <ScrollView
              style={styles.list}
              showsVerticalScrollIndicator={false}
            >
              {rows.map((row) => {
                const mine =
                  row.post !== undefined &&
                  myKey.length > 0 &&
                  bytesToHex(row.post.authorSigningKey) === bytesToHex(myKey);
                const fade = fadeLabel(row.expiresAtMs, now);
                return (
                  <View key={row.id} style={styles.row}>
                    <View style={styles.rowHead}>
                      {row.urgent && (
                        <View style={styles.urgentBadge}>
                          <Feather
                            name="alert-triangle"
                            size={10}
                            color={Colors.textInverse}
                          />
                          <Text style={styles.urgentBadgeText}>URGENT</Text>
                        </View>
                      )}
                      <Text style={styles.rowAuthor} numberOfLines={1}>
                        {row.author}
                      </Text>
                      {!row.isBoard && (
                        <Feather
                          name="globe"
                          size={11}
                          color={Colors.textMuted}
                        />
                      )}
                      <Text style={styles.rowTime}>
                        {ageLabel(row.createdAtMs, now)}
                      </Text>
                    </View>
                    <Text style={styles.rowContent}>{row.content}</Text>
                    <View style={styles.rowFoot}>
                      {fade !== null && (
                        <Text style={styles.rowFade}>{fade}</Text>
                      )}
                      {mine && row.post !== undefined && (
                        <Pressable
                          onPress={() => handleDelete(row.post as BoardPost)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityRole="button"
                          accessibilityLabel="Delete notice"
                        >
                          <Text style={styles.rowDelete}>Delete</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
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
      borderTopLeftRadius: Radius.xl,
      borderTopRightRadius: Radius.xl,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing["2xl"],
      maxHeight: "88%",
    },
    handle: {
      alignSelf: "center",
      width: 36,
      height: 4,
      borderRadius: Radius.full,
      backgroundColor: Colors.borderStrong,
      marginTop: Spacing.md,
      marginBottom: Spacing.base,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    title: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    tabs: {
      flexDirection: "row",
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.md,
      padding: 3,
      marginBottom: Spacing.base,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      gap: 6,
      paddingVertical: Spacing.sm,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Radius.sm,
    },
    tabActive: { backgroundColor: Colors.surface },
    tabText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.textSecondary,
    },
    tabTextActive: { color: Colors.textPrimary },
    composer: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.base,
    },
    input: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      minHeight: 40,
      maxHeight: 120,
      padding: 0,
    },
    composerControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: Spacing.md,
      gap: Spacing.sm,
    },
    urgentToggle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 6,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
    },
    urgentToggleOn: { backgroundColor: Colors.danger },
    urgentText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textSecondary,
    },
    urgentTextOn: { color: Colors.textInverse },
    expiryChips: { flexDirection: "row", gap: 4 },
    chip: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 6,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
    },
    chipActive: { backgroundColor: Colors.accent },
    chipText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.medium,
      color: Colors.textSecondary,
    },
    chipTextActive: { color: Colors.textInverse },
    postBtn: {
      marginTop: Spacing.md,
      backgroundColor: Colors.accent,
      borderRadius: Radius.md,
      paddingVertical: Spacing.md,
      alignItems: "center",
    },
    postBtnDisabled: { opacity: 0.4 },
    postBtnText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textInverse,
    },
    empty: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
      paddingVertical: Spacing["2xl"],
    },
    list: { flexGrow: 0 },
    row: {
      paddingVertical: Spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },
    rowHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      marginBottom: 4,
    },
    urgentBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      backgroundColor: Colors.danger,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: Radius.sm,
    },
    urgentBadgeText: {
      fontSize: 9,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
      letterSpacing: 0.5,
    },
    rowAuthor: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
      flexShrink: 1,
    },
    rowTime: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      marginLeft: "auto",
    },
    rowContent: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      lineHeight: 21,
    },
    rowFoot: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 6,
    },
    rowFade: { fontSize: FontSize.xs, color: Colors.textMuted },
    rowDelete: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.danger,
      marginLeft: "auto",
    },
  });
}
