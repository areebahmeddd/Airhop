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
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getMeshService } from "../../services/mesh-service";
import { groupChannel } from "../../store/group-store";
import { usePeerStore } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
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

export function NewGroupSheet({ visible, onClose, onBack, onCreated }: Props) {
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
      else next.add(peerID);
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
      setError("Could not reach every member. Try again while they're nearby.");
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
          <Text style={styles.title}>New group</Text>
          {/* Same scannable card as the create-channel sheet, so the two sides
              of the chooser stay comparable: what it protects, who can get in,
              how far it reaches. */}
          <View style={styles.privacyNote}>
            <View style={styles.privacyNoteRow}>
              <Feather name="lock" size={14} color={Colors.online} />
              <Text style={styles.privacyNoteText}>
                End-to-end encrypted. Only members can read the messages.
              </Text>
            </View>
            <View style={styles.privacyNoteRow}>
              <Feather name="users" size={14} color={Colors.textMuted} />
              <Text style={styles.privacyNoteText}>
                Up to 16 people, chosen by you. There is no invite link, so
                nobody joins by being forwarded one.
              </Text>
            </View>
            <View style={styles.privacyNoteRow}>
              <Feather name="bluetooth" size={14} color={Colors.textMuted} />
              <Text style={styles.privacyNoteText}>
                Bluetooth only. Members out of range receive messages once they
                are back.
              </Text>
            </View>
          </View>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Group name"
            placeholderTextColor={Colors.textMuted}
            selectionColor={Colors.accent}
            maxLength={64}
          />

          {/* Label and list are one block: the sheet's own gap would otherwise
              push the heading away from the thing it labels. */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              MEMBERS{selected.size > 0 ? ` · ${selected.size}` : ""}
            </Text>

            {reachable.length === 0 ? (
              <Text style={styles.empty}>
                No one is in range. Members must be nearby when you create the
                group.
              </Text>
            ) : (
              <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
              >
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
              <Text style={styles.cancelText}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.confirm, !canCreate && styles.confirmDisabled]}
              onPress={handleCreate}
              disabled={!canCreate}
            >
              <Text style={styles.confirmText}>Create</Text>
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
      maxHeight: "85%",
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
    input: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.md,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      color: Colors.textPrimary,
      fontSize: FontSize.base,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    section: { gap: Spacing.sm },
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
    list: { flexGrow: 0 },
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
