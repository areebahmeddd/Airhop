// Join with a link: paste an Airhop invite instead of tapping one.
//
// Tapping a link only works when the link is somewhere tappable. An invite read
// off another phone, copied out of a message that arrived over the mesh, or
// written down, had nowhere to go. This is that door, and it goes through the
// same parseAirhopLink + applyAirhopLink pair the OS deep link uses, so a
// pasted invite and a tapped one land in exactly the same place.
//
// It accepts every Airhop link rather than only channel invites: rejecting a
// valid peer or contact link because the sheet is named "join" would be a
// dead end for no reason. What the link will do is stated before you commit.

import { isValidChannelKey } from "@core/mesh/channel-crypto";
import { Feather } from "@expo/vector-icons";
import { t, useT } from "@i18n";
import { applyAirhopLink } from "@services/link-router";
import { showAlert } from "@store/alert-store";
import BottomSheet from "@ui/components/bottom-sheet";
import {
  FontFamily,
  FontSize,
  FontWeight,
  HIT_SLOP,
  Radius,
  Spacing,
  useThemeColors,
} from "@ui/theme";
import { parseAirhopLink } from "@utils/deep-link";
import { resolveDisplayName } from "@utils/peer-display-name";
import * as Clipboard from "expo-clipboard";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  visible: boolean;
  /** Dismiss entirely: backdrop tap or system back. */
  onClose: () => void;
  /** Step back to whatever opened this sheet, for the Back button. */
  onBack: () => void;
  onJoined: (channel: string) => void;
}

export function JoinLinkSheet({
  visible,
  onClose,
  onBack,
  onJoined,
}: Props): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  const [input, setInput] = useState("");

  // Parsed live, so the sheet can say what the link is before it is used. A
  // private invite whose key is malformed is treated as unusable rather than
  // joined as a public channel: that would build a room that silently drops
  // every message it receives.
  const link = useMemo(() => {
    const trimmed = input.trim();
    if (trimmed.length === 0) return null;
    const parsed = parseAirhopLink(trimmed);
    if (parsed === null) return null;
    if (
      parsed.kind === "channel" &&
      parsed.key !== undefined &&
      !isValidChannelKey(parsed.key)
    ) {
      return null;
    }
    return parsed;
  }, [input]);

  // One line describing what Join will do. Only shown once something has been
  // typed, so an empty sheet is not already complaining.
  const preview = useMemo(() => {
    if (input.trim().length === 0) return null;
    if (link === null) {
      return { ok: false, text: t("chat.join.not_airhop") };
    }
    if (link.kind === "channel") {
      if (link.key === undefined) {
        return {
          ok: true,
          text: t("chat.join.public_channel", { name: link.channel }),
        };
      }
      return {
        ok: true,
        text: t("chat.join.private_channel", {
          name: link.channel,
          reach: link.overNostr
            ? t("chat.join.reach_internet")
            : t("chat.join.reach_mesh"),
        }),
      };
    }
    if (link.kind === "peer") {
      return {
        ok: true,
        text: t("chat.join.dm_with", {
          name: resolveDisplayName(link.peerID),
        }),
      };
    }
    return {
      ok: true,
      text: t("chat.join.contact_card"),
    };
  }, [input, link]);

  function reset(): void {
    setInput("");
  }

  async function handlePaste(): Promise<void> {
    const text = await Clipboard.getStringAsync().catch(() => "");
    if (text.length > 0) setInput(text.trim());
  }

  function handleJoin(): void {
    if (link === null) return;
    const channel = applyAirhopLink(link);
    if (channel === null) {
      // Only a contact card can be refused, and only because its peer ID is not
      // the fingerprint of its own key, which means it was tampered with.
      showAlert(t("chat.join.unverified"), t("chat.join.unverified_body"));
      return;
    }
    // A private channel is identified by its key, not its name, so this invite
    // may be a different channel that happens to share a name with one already
    // joined. It lands in its own channel; say so, because the name in the list
    // will not be the name in the link.
    if (link.kind === "channel" && channel !== link.channel) {
      showAlert(
        t("chat.join.joined_as", { name: channel }),
        t("chat.join.name_clash_body", { name: link.channel }),
      );
    }
    reset();
    onJoined(channel);
  }

  function handleClose(): void {
    reset();
    onClose();
  }

  function handleBack(): void {
    reset();
    onBack();
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      sheetStyle={styles.sheet}
    >
      <Text style={styles.title}>{T("chat.join.title")}</Text>

      {/* Same scannable card as the other chooser destinations. */}
      <View style={styles.privacyNote}>
        <View style={styles.privacyNoteRow}>
          <Feather
            name="lock"
            size={14}
            color={Colors.e2ee}
            style={styles.noteIcon}
          />
          <Text style={styles.privacyNoteText}>{T("chat.join.key_note")}</Text>
        </View>
        <View style={styles.privacyNoteRow}>
          <Feather
            name="link"
            size={14}
            color={Colors.textMuted}
            style={styles.noteIcon}
          />
          <Text style={styles.privacyNoteText}>
            {T("chat.join.paste_hint")}
          </Text>
        </View>
        <View style={styles.privacyNoteRow}>
          <Feather
            name="bluetooth"
            size={14}
            color={Colors.textMuted}
            style={styles.noteIcon}
          />
          <Text style={styles.privacyNoteText}>
            {T("chat.join.offline_note")}
          </Text>
        </View>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="airhop://channel/..."
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={handleJoin}
          selectionColor={Colors.selection}
        />
        <Pressable
          onPress={() => void handlePaste()}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={T("chat.join.paste")}
        >
          <Feather name="clipboard" size={16} color={Colors.textMuted} />
        </Pressable>
      </View>

      {preview !== null && (
        <Text style={preview.ok ? styles.hint : styles.error}>
          {preview.text}
        </Text>
      )}

      <View style={styles.actions}>
        <Pressable
          style={styles.cancel}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={T("common.back")}
        >
          <Text style={styles.cancelText}>{T("common.back")}</Text>
        </Pressable>
        <Pressable
          style={[styles.confirm, link === null && styles.confirmDisabled]}
          onPress={handleJoin}
          disabled={link === null}
          accessibilityRole="button"
          accessibilityLabel={T("chat.join.join")}
          // Without this the button announces as plain text and a
          // reader user taps into nothing.
          accessibilityState={{ disabled: link === null }}
        >
          <Text style={styles.confirmText}>{T("chat.join.join")}</Text>
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
      gap: Spacing.sm,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
    },
    input: {
      flex: 1,
      paddingVertical: Spacing.md,
      color: Colors.textPrimary,
      fontSize: FontSize.sm,
      fontFamily: FontFamily.mono,
    },
    hint: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      marginTop: -Spacing.xs,
      lineHeight: 17,
    },
    error: {
      fontSize: FontSize.xs,
      color: Colors.danger,
      marginTop: -Spacing.xs,
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
