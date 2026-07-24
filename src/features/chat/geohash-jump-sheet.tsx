// Teleport to a geohash: open a public location channel for a cell you are not
// physically in. The user types a geohash, we normalise and validate it exactly
// as bitchat does, then hand it to mesh-service, which joins the cell as a
// `geohash:<gh>` channel and brings up its Nostr subscription. The channel then
// appears under Your Rooms and interoperates with bitchat clients in the same
// cell.

import { Feather } from "@expo/vector-icons";
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
import {
  geohashLevelName,
  isValidGeohash,
  normalizeGeohash,
} from "../../services/geohash-channel-service";
import { getMeshService } from "../../services/mesh-service";
import { useGeohashBookmarksStore } from "../../store/geohash-bookmarks-store";
import { usePlaceNamesStore } from "../../store/place-names-store";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";

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
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const bookmarks = useGeohashBookmarksStore((s) => s.bookmarks);
  const placeNames = usePlaceNamesStore((s) => s.names);
  // Resolve names for saved places so the list reads "~Kumaraswamy Layout"
  // rather than a bare geohash. Best-effort and cached in the store.
  useEffect(() => {
    if (!visible) return;
    for (const gh of bookmarks) usePlaceNamesStore.getState().resolve(gh);
  }, [visible, bookmarks]);

  const valid = isValidGeohash(input);
  const level = valid ? geohashLevelName(input) : null;
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
      setError("Could not open that cell. Try again in a moment.");
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Go to a place</Text>
          {/* Same scannable card as the other create sheets, so all three
              chooser destinations read alike. */}
          <View style={styles.privacyNote}>
            <View style={styles.privacyNoteRow}>
              <Feather name="map-pin" size={14} color={Colors.textMuted} />
              <Text style={styles.privacyNoteText}>
                Open a public location channel anywhere, even a place you are
                not.
              </Text>
            </View>
            <View style={styles.privacyNoteRow}>
              <Feather name="hash" size={14} color={Colors.textMuted} />
              <Text style={styles.privacyNoteText}>
                Enter its geohash. Everyone whose location falls in that cell
                shares the channel.
              </Text>
            </View>
            <View style={styles.privacyNoteRow}>
              <Feather name="globe" size={14} color={Colors.online} />
              <Text style={styles.privacyNoteText}>
                You show as teleported, not nearby. It reaches over the internet
                only.
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
              placeholder="geohash, e.g. tdr1k"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleGo}
              selectionColor={Colors.accent}
            />
          </View>
          <Text style={styles.hint}>
            {localChannel !== null
              ? `You are already here. Go opens your ${localChannel} channel.`
              : level !== null
                ? `${level} cell`
                : "2 to 12 letters and digits (no a, i, l or o)"}
          </Text>
          {error !== null && <Text style={styles.error}>{error}</Text>}

          {bookmarks.length > 0 && (
            <View style={styles.saved}>
              <Text style={styles.savedLabel}>SAVED PLACES</Text>
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
                      accessibilityLabel={`Open ${name ?? gh}`}
                    >
                      <Feather
                        name="map-pin"
                        size={15}
                        color={Colors.textMuted}
                      />
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
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${name ?? gh} from saved places`}
                      >
                        <Feather name="x" size={15} color={Colors.textMuted} />
                      </Pressable>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={handleBack}>
              <Text style={styles.cancelText}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.confirm, !valid && styles.confirmDisabled]}
              onPress={handleGo}
              disabled={!valid}
            >
              <Text style={styles.confirmText}>Go</Text>
            </Pressable>
          </View>
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
      padding: Spacing.xl,
      gap: Spacing.md,
      maxHeight: "88%",
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.borderStrong,
      alignSelf: "center",
      marginBottom: Spacing.xs,
    },
    title: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
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
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
    },
    inputPrefix: {
      fontSize: FontSize.base,
      color: Colors.textMuted,
      fontFamily: "monospace",
      marginRight: Spacing.xs,
    },
    input: {
      flex: 1,
      paddingVertical: Spacing.md,
      color: Colors.textPrimary,
      fontSize: FontSize.base,
      fontFamily: "monospace",
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
    saved: {
      gap: Spacing.sm,
    },
    savedLabel: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      letterSpacing: 0.8,
    },
    savedList: {
      maxHeight: 168,
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
      fontFamily: "monospace",
    },
    savedSub: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
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
    cancelText: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
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
