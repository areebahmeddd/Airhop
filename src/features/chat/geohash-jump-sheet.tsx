// Teleport to a geohash: open a public location channel for a cell you are not
// physically in. The user types a geohash, we normalise and validate it exactly
// as bitchat does, then hand it to mesh-service, which joins the cell as a
// `geohash:<gh>` channel and brings up its Nostr subscription. The channel then
// appears under Your Rooms and interoperates with bitchat clients in the same
// cell.

import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { t, useT } from "../../i18n";
import {
  geohashLevelName,
  isValidGeohash,
  normalizeGeohash,
} from "../../services/geohash-channel-service";
import { getMeshService } from "../../services/mesh-service";
import { useGeohashBookmarksStore } from "../../store/geohash-bookmarks-store";
import { usePlaceNamesStore } from "../../store/place-names-store";
import BottomSheet from "../../ui/components/bottom-sheet";
import {
  FontFamily,
  FontSize,
  FontWeight,
  HIT_SLOP,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { geohashNeighbours } from "../../utils/geohash-grid";

// How long typing has to stop before the cell's name is looked up. Long enough
// that a six-character geohash costs one lookup rather than six.
const NAME_LOOKUP_DEBOUNCE_MS = 500;

interface Props {
  visible: boolean;
  /** Dismiss entirely: backdrop tap or system back. */
  onClose: () => void;
  /** Step back to whatever opened this sheet, for the Back button. */
  onBack: () => void;
  onJoined: (channel: string) => void;
}

export function GeohashJumpSheet({
  visible,
  onClose,
  onBack,
  onJoined,
}: Props) {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // The cell this phone is standing in, at neighbourhood precision. Null with
  // no location grant, which is why every part of this sheet that uses it is
  // conditional rather than assumed.
  const homeCell = visible
    ? (getMeshService()?.getChannelGeohash("#neighborhood") ?? null)
    : null;

  // The eight cells touching yours. This is the "where do I actually want to
  // go" case: people ask for the next street or the next town, not for a
  // geohash they have memorised. Typing one is still there for anyone who has.
  const neighbours = useMemo(
    () => (homeCell ? geohashNeighbours(homeCell) : []),
    [homeCell],
  );

  const bookmarks = useGeohashBookmarksStore((s) => s.bookmarks);
  const placeNames = usePlaceNamesStore((s) => s.names);
  // Resolve names for saved places so the list reads "~Kumaraswamy Layout"
  // rather than a bare geohash. Best-effort and cached in the store.
  useEffect(() => {
    if (!visible) return;
    for (const gh of bookmarks) usePlaceNamesStore.getState().resolve(gh);
  }, [visible, bookmarks]);

  // And for the cells around you, which is what makes Nearby readable: "N ·
  // Jayanagar" is a place, "N · #tdr1kz" is a string. Eight lookups on open,
  // once ever, since the store caches a cell's name forever.
  useEffect(() => {
    if (!visible) return;
    for (const n of neighbours)
      usePlaceNamesStore.getState().resolve(n.geohash);
  }, [visible, neighbours]);

  // The typed cell, once it is long enough to mean somewhere. Debounced:
  // resolving on every keystroke would geocode "r", "rd", "rdr" and so on,
  // which is five wasted round trips and five prefixes of your destination
  // handed to the platform geocoder for no reason.
  useEffect(() => {
    if (!visible || !isValidGeohash(input)) return;
    const timer = setTimeout(() => {
      usePlaceNamesStore.getState().resolve(input);
    }, NAME_LOOKUP_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [visible, input]);

  const valid = isValidGeohash(input);
  const level = valid ? geohashLevelName(input) : null;
  // Undefined until the lookup lands, or forever if it cannot: the hint reads
  // fine either way.
  const typedName = valid ? placeNames[input] : undefined;
  // If the entered cell is one the user is already standing in, "Go" opens that
  // existing channel rather than a duplicate teleported room. Read live from the
  // mesh service; it only changes when the user physically moves.
  const localChannel = valid
    ? (getMeshService()?.localGeoChannelFor(input) ?? null)
    : null;

  function reset() {
    setInput("");
    setError(null);
  }

  // Open a saved cell: reuse the channel the user is already in if this is their
  // current cell, otherwise teleport into it. Same redirect rule as typing it.
  function openGeohash(geohash: string) {
    const svc = getMeshService();
    const channel =
      svc?.localGeoChannelFor(geohash) ?? svc?.joinGeohash(geohash);
    if (channel === undefined) return;
    reset();
    onJoined(channel);
  }

  function handleGo() {
    if (!valid) return;
    // Already in this cell: open the named channel, don't teleport onto it.
    if (localChannel !== null) {
      reset();
      onJoined(localChannel);
      return;
    }
    const channel = getMeshService()?.joinGeohash(input);
    if (channel === undefined) {
      setError(t("chat.jump.failed"));
      return;
    }
    reset();
    onJoined(channel);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleBack() {
    reset();
    onBack();
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      sheetStyle={styles.sheet}
      scrollable
    >
      <Text style={styles.title}>{T("chat.jump.title")}</Text>
      {/* Same scannable card as the other create sheets, so all three
              chooser destinations read alike. */}
      <View style={styles.privacyNote}>
        <View style={styles.privacyNoteRow}>
          <Feather
            name="map-pin"
            size={14}
            color={Colors.textMuted}
            style={styles.noteIcon}
          />
          <Text style={styles.privacyNoteText}>{T("chat.jump.anywhere")}</Text>
        </View>
        <View style={styles.privacyNoteRow}>
          <Feather
            name="hash"
            size={14}
            color={Colors.textMuted}
            style={styles.noteIcon}
          />
          <Text style={styles.privacyNoteText}>
            {T("chat.jump.geohash_note")}
          </Text>
        </View>
        <View style={styles.privacyNoteRow}>
          <Feather
            name="globe"
            size={14}
            color={Colors.textMuted}
            style={styles.noteIcon}
          />
          <Text style={styles.privacyNoteText}>
            {T("chat.jump.teleport_note")}
          </Text>
        </View>
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.inputPrefix}>#</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={(v) => {
            setInput(normalizeGeohash(v));
            setError(null);
          }}
          placeholder="geohash"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={handleGo}
          selectionColor={Colors.accent}
        />
      </View>
      {/* Only speak when there is something to say about what was typed. The
          length rule is enforced by the disabled Go button, so stating it up
          front is noise. */}
      {(localChannel !== null || level !== null) && (
        <Text style={styles.hint}>
          {localChannel !== null
            ? T("chat.jump.already_here", { name: localChannel })
            : // The name is appended, never substituted: the level is always
              // true, and the name is a best-effort lookup that is simply
              // absent offline or where the geocoder has nothing to say.
              `${t("chat.jump.level_cell", { level: level ?? "" })}${
                typedName !== undefined ? ` · ~${typedName}` : ""
              }`}
        </Text>
      )}
      {error !== null && <Text style={styles.error}>{error}</Text>}

      {/* Nearby: the cells around yours, one tap each. Only when we know where
          you are, since "nearby" is meaningless otherwise. */}
      {neighbours.length > 0 && (
        <View style={styles.saved}>
          <Text style={styles.savedLabel}>NEARBY</Text>
          <View style={styles.nearbyWrap}>
            {neighbours.map((n) => (
              <Pressable
                key={n.geohash}
                style={styles.nearbyChip}
                onPress={() => openGeohash(n.geohash)}
                accessibilityRole="button"
                accessibilityLabel={T("chat.jump.open_direction", {
                  direction: n.direction,
                })}
              >
                <Text style={styles.nearbyDir}>{n.direction}</Text>
                <Text style={styles.nearbyHash} numberOfLines={1}>
                  {placeNames[n.geohash] ?? `#${n.geohash}`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {bookmarks.length > 0 && (
        <View style={styles.saved}>
          <Text style={styles.savedLabel}>{T("chat.jump.saved")}</Text>
          <ScrollView
            style={styles.savedList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {bookmarks.map((gh) => {
              const name = placeNames[gh];
              return (
                <Pressable
                  key={gh}
                  style={styles.savedRow}
                  onPress={() => openGeohash(gh)}
                  accessibilityRole="button"
                  accessibilityLabel={T("chat.jump.open_place", {
                    name: name ?? gh,
                  })}
                >
                  <Feather name="map-pin" size={15} color={Colors.textMuted} />
                  <View style={styles.savedText}>
                    <Text style={styles.savedGeohash} numberOfLines={1}>
                      #{gh}
                    </Text>
                    <Text style={styles.savedSub} numberOfLines={1}>
                      {name !== undefined
                        ? `~${name}  ·  ${geohashLevelName(gh)}`
                        : geohashLevelName(gh)}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      useGeohashBookmarksStore.getState().remove(gh)
                    }
                    hitSlop={HIT_SLOP}
                    accessibilityRole="button"
                    accessibilityLabel={T("chat.jump.remove_place", {
                      name: name ?? gh,
                    })}
                  >
                    <Feather name="x" size={15} color={Colors.textMuted} />
                  </Pressable>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Where a geohash comes from. Every location channel shows its own with
          a copy button, so the answer is one tap away inside the app rather
          than something to look up elsewhere. Written as ">"-separated steps:
          it is a route to follow, not a sentence to parse. */}
      <Text style={styles.footNote}>{T("chat.jump.how")}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.cancel} onPress={handleBack}>
          <Text style={styles.cancelText}>{t("common.back")}</Text>
        </Pressable>
        <Pressable
          style={[styles.confirm, !valid && styles.confirmDisabled]}
          onPress={handleGo}
          disabled={!valid}
        >
          <Text style={styles.confirmText}>{T("chat.jump.go")}</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    sheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.md,
      maxHeight: "88%",
    },
    title: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    privacyNote: {
      gap: Spacing.sm,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      padding: Spacing.md,
    },
    privacyNoteRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.sm,
    },
    // Nudge the leading icon down so it optically centers on the first text line.
    noteIcon: {
      marginTop: 2,
    },
    privacyNoteText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 19,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
    },
    inputPrefix: {
      fontSize: FontSize.base,
      color: Colors.textMuted,
      fontFamily: FontFamily.mono,
      marginEnd: Spacing.xs,
    },
    input: {
      flex: 1,
      paddingVertical: Spacing.md,
      color: Colors.textPrimary,
      fontSize: FontSize.base,
      fontFamily: FontFamily.mono,
      letterSpacing: 1,
    },
    hint: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      marginTop: -Spacing.xs,
    },
    error: {
      fontSize: FontSize.sm,
      color: Colors.danger,
    },
    // ---- Saved places (bookmarks) ----------------------------------------------
    // flexShrink so the saved-places list yields height when the sheet is
    // squeezed (keyboard up on a short screen) rather than pushing the Back/Go
    // row past the sheet's maxHeight, where it would be clipped and unreachable.
    saved: {
      gap: Spacing.sm,
      flexShrink: 1,
    },
    savedLabel: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      letterSpacing: 0.8,
    },
    savedList: {
      maxHeight: 168,
      flexShrink: 1,
    },
    savedRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.sm,
    },
    savedText: {
      flex: 1,
      gap: 1,
    },
    savedGeohash: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
      fontFamily: FontFamily.mono,
    },
    savedSub: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    // Nearby cells: a wrapped row of small chips, direction over geohash, so
    // eight of them fit without a horizontal scroller to discover.
    nearbyWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.xs,
    },
    nearbyChip: {
      minWidth: 76,
      maxWidth: 132,
      alignItems: "center",
      gap: 1,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceRaised,
    },
    nearbyDir: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textSecondary,
      letterSpacing: 0.5,
    },
    nearbyHash: {
      fontSize: FontSize.xs,
      fontFamily: FontFamily.mono,
      color: Colors.textMuted,
    },
    footNote: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      lineHeight: 17,
    },
    actions: {
      flexDirection: "row",
      gap: Spacing.sm,
      marginTop: Spacing.xs,
    },
    cancel: {
      flex: 1,
      minHeight: 50,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    // Dismiss actions read at full contrast, matching the wallet sheets,
    // the scanner and the alert buttons: a muted label on a filled pill
    // reads as disabled rather than as the quieter of two choices.
    cancelText: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.semibold,
    },
    confirm: {
      flex: 1,
      minHeight: 50,
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    confirmDisabled: { opacity: 0.4 },
    confirmText: {
      fontSize: FontSize.base,
      color: Colors.textInverse,
      fontWeight: FontWeight.semibold,
    },
  });
}
