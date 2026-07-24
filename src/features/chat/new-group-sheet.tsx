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
  onClose: () => void;
  onCreated: (channel: string) => void;
}

export function NewGroupSheet({ visible, onClose, onCreated }: Props) {
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
          <Text style={styles.subtitle}>
            End-to-end encrypted. Only members can read the messages.
          </Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Group name"
            placeholderTextColor={Colors.textMuted}
            selectionColor={Colors.accent}
            maxLength={64}
          />

          <Text style={styles.sectionLabel}>
            MEMBERS{selected.size > 0 ? ` · ${selected.size}` : ""}
          </Text>

          {reachable.length === 0 ? (
            <Text style={styles.empty}>
              No one is in range. Group members must be nearby when you create
              the group.
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

          {error !== null && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
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
    subtitle: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
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
    sectionLabel: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      letterSpacing: 0.8,
    },
    empty: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      paddingVertical: Spacing.lg,
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
