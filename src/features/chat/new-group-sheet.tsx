// Create a private group: pick a name and members from the peers currently in
// range, then hand it to mesh-service, which signs the roster + epoch key and
// invites each member over their Noise session. The group then appears as a
// `group:<id>` channel.
//
// Members must be reachable now (we need their Noise + signing keys to build the
// roster and deliver the invite). Peers we lack keys for cannot be added yet.

import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { t, useT } from "../../i18n";
import { getMeshService } from "../../services/mesh-service";
import { groupChannel } from "../../store/group-store";
import { usePeerStore } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
import BottomSheet from "../../ui/components/bottom-sheet";
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
  onCreated: (channel: string) => void;
}

// A group holds at most 16 members (matching bitchat); the creator is always
// one of them, so the picker offers up to 15 others.
const MAX_OTHER_MEMBERS = 15;

export function NewGroupSheet({ visible, onClose, onBack, onCreated }: Props) {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  const peers = usePeerStore((s) => s.peers);
  const reachable = useMemo(
    () => [...peers.values()].filter((p) => p.noisePubKeyHex),
    [peers],
  );

  const [name, setName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  function toggle(peerID: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(peerID)) next.delete(peerID);
      // Cap at 15 others (creator makes 16). Silently ignore taps past the cap
      // rather than letting createGroup fail later with a misleading error.
      else if (next.size < MAX_OTHER_MEMBERS) next.add(peerID);
      return next;
    });
  }

  function reset() {
    setName("");
    setSelected(new Set());
    setError(null);
  }

  function handleCreate() {
    const trimmed = name.trim();
    if (trimmed.length === 0 || selected.size === 0) return;
    const id = getMeshService()?.createGroup(trimmed, [...selected]);
    if (id === undefined || id === null) {
      setError(t("chat.group.unreachable"));
      return;
    }
    reset();
    onCreated(groupChannel(id));
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleBack() {
    reset();
    onBack();
  }

  const canCreate = name.trim().length > 0 && selected.size > 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      sheetStyle={styles.sheet}
      scrollable
    >
      <Text style={styles.title}>{T("chat.group.create_title")}</Text>
      {/* Same scannable card as the create-channel sheet, so the two sides
              of the chooser stay comparable: what it protects, who can get in,
              how far it reaches. */}
      <View style={styles.privacyNote}>
        <View style={styles.privacyNoteRow}>
          <Feather
            name="lock"
            size={14}
            color={Colors.e2ee}
            style={styles.noteIcon}
          />
          <Text style={styles.privacyNoteText}>{T("chat.group.e2ee")}</Text>
        </View>
        <View style={styles.privacyNoteRow}>
          <Feather
            name="users"
            size={14}
            color={Colors.textMuted}
            style={styles.noteIcon}
          />
          <Text style={styles.privacyNoteText}>{T("chat.group.cap")}</Text>
        </View>
        <View style={styles.privacyNoteRow}>
          <Feather
            name="bluetooth"
            size={14}
            color={Colors.textMuted}
            style={styles.noteIcon}
          />
          <Text style={styles.privacyNoteText}>
            {T("chat.group.bluetooth")}
          </Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={T("chat.group.name_placeholder")}
        placeholderTextColor={Colors.textMuted}
        selectionColor={Colors.accent}
        maxLength={40}
      />

      {/* Label and list are one block: the sheet's own gap would otherwise
              push the heading away from the thing it labels. */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          {T("chat.group.members_label")}
          {selected.size > 0 ? ` · ${String(selected.size)}` : ""}
        </Text>

        {reachable.length === 0 ? (
          <Text style={styles.empty}>{T("chat.group.none_in_range")}</Text>
        ) : (
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {reachable.map((peer) => {
              const isSel = selected.has(peer.peerID);
              return (
                <Pressable
                  key={peer.peerID}
                  style={styles.row}
                  onPress={() => toggle(peer.peerID)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSel }}
                >
                  <Avatar
                    username={peer.nickname}
                    peerID={peer.peerID}
                    size={36}
                  />
                  <Text style={styles.rowName} numberOfLines={1}>
                    {peer.nickname}
                  </Text>
                  <View style={[styles.check, isSel && styles.checkOn]}>
                    {isSel && (
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
      </View>

      {error !== null && <Text style={styles.error}>{error}</Text>}

      <View style={styles.actions}>
        <Pressable style={styles.cancel} onPress={handleBack}>
          <Text style={styles.cancelText}>{T("common.back")}</Text>
        </Pressable>
        <Pressable
          style={[styles.confirm, !canCreate && styles.confirmDisabled]}
          onPress={handleCreate}
          disabled={!canCreate}
        >
          <Text style={styles.confirmText}>{T("chat.group.create")}</Text>
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
      maxHeight: "85%",
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
    // Nudge the leading icon down so it optically centers on the first text
    // line (the text's lineHeight otherwise leaves the icon sitting high).
    noteIcon: {
      marginTop: 2,
    },
    privacyNoteText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 19,
    },
    input: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.xl,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      color: Colors.textPrimary,
      fontSize: FontSize.base,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    // flexShrink so the member list gives up height when the sheet is squeezed
    // (keyboard up on a short screen) instead of pushing the Back/Create row off
    // the bottom of a maxHeight-clipped sheet. RN defaults flexShrink to 0, so
    // without this the list keeps its full height and the actions - the only way
    // to finish or leave - are what gets cut.
    section: { gap: Spacing.sm, flexShrink: 1 },
    sectionLabel: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      letterSpacing: 0.8,
    },
    empty: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: 19,
    },
    list: { flexGrow: 0, flexShrink: 1 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.sm,
    },
    rowName: {
      flex: 1,
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
    },
    check: {
      width: 22,
      height: 22,
      borderRadius: Radius.full,
      borderWidth: 1.5,
      borderColor: Colors.borderStrong,
      alignItems: "center",
      justifyContent: "center",
    },
    checkOn: {
      backgroundColor: Colors.accent,
      borderColor: Colors.accent,
    },
    error: {
      fontSize: FontSize.sm,
      color: Colors.danger,
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
