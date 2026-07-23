// Contact info sheet: the single source of truth for "who is this DM with".
//
// Shown from two places, and intentionally the SAME component in both so they
// never drift: tapping the header inside a DM thread, and the "Contact info"
// action on the DM list's More sheet. Shows identity, how long you have been
// chatting, reachability, verification, and the encryption guarantee, plus the
// Remove contact / Block actions.

import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { getMeshService } from "../../services/mesh-service";
import { showAlert } from "../../store/alert-store";
import { useBlockedStore } from "../../store/blocked-store";
import { useChatStore } from "../../store/chat-store";
import { useContactsStore } from "../../store/contacts-store";
import { usePeerStore } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { resolveDisplayName } from "../../utils/display-name";

interface Props {
  // "dm:<peerID>" of the conversation, or null when closed.
  channel: string | null;
  onClose: () => void;
  // Called after the conversation is removed or the peer blocked, so a caller
  // that lives inside the thread can navigate back out of it. The DM list has
  // nothing to do here: the row simply disappears.
  onAfterRemove?: () => void;
}

export default function ContactInfoSheet({
  channel,
  onClose,
  onAfterRemove,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const peerID = channel?.startsWith("dm:") ? channel.slice(3) : null;

  const messages = useChatStore((s) =>
    channel ? s.messages[channel] : undefined,
  );
  const removeChannel = useChatStore((s) => s.removeChannel);
  const contact = useContactsStore((s) =>
    peerID ? s.contacts[peerID] : undefined,
  );
  const removeContact = useContactsStore((s) => s.removeContact);
  const addContact = useContactsStore((s) => s.addContact);
  const blockPeer = useBlockedStore((s) => s.blockPeer);
  const peer = usePeerStore((s) => (peerID ? s.peers.get(peerID) : undefined));
  // Snapshot on open, so the reachability line is honest without a live timer.
  const [nowMs] = useState(() => Date.now());

  const name = peerID ? resolveDisplayName(peerID) : "";
  const isOnline = peer !== undefined && nowMs - peer.lastSeenMs < 60_000;
  const firstMessage =
    messages && messages.length > 0 ? messages[0] : undefined;
  // Someone you started a DM with from a channel is not necessarily a saved
  // contact. The primary action reflects that: add them if they are not saved,
  // remove them if they are. Deleting the conversation itself lives in the
  // chat's own Clear/Delete actions, not here.
  const isContact = contact !== undefined;

  function handleAddContact(): void {
    if (!peerID) return;
    const nearby = usePeerStore.getState().getPeer(peerID);
    addContact({
      peerID,
      // We keep whatever key we already have from their ANNOUNCE; a manually
      // saved contact is unverified until a signed card confirms it.
      noisePubKeyHex: nearby?.noisePubKeyHex ?? "",
      signingPubKeyHex: "",
      nickname: name,
      addedAtMs: Date.now(),
      source: "manual",
    });
  }

  function handleRemoveContact(): void {
    if (!peerID) return;
    showAlert(
      "Remove contact",
      `Remove ${name} from your contacts? Your conversation stays; they are just no longer saved.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeContact(peerID),
        },
      ],
    );
  }

  function handleBlock(): void {
    if (!peerID || !channel) return;
    showAlert(
      "Block this peer",
      `Block ${name}? You won't see them on the Mesh tab or receive messages from them, even if they're nearby.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: () => {
            blockPeer(peerID);
            // Tear down the live crypto session and link maps too, not just the
            // UI entry (forgetPeer also drops them from the peer store).
            getMeshService()?.forgetPeer(peerID);
            removeContact(peerID);
            removeChannel(channel);
            onClose();
            onAfterRemove?.();
          },
        },
      ],
    );
  }

  return (
    <Modal
      visible={channel !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {peerID && (
            <>
              <View style={styles.body}>
                <Avatar username={name} peerID={peerID} size={64} />
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.peerID}>{peerID}</Text>

                {firstMessage && (
                  <Text style={styles.since}>
                    Chatting since {formatDate(firstMessage.timestampMs)}
                  </Text>
                )}

                {isOnline && (
                  <View style={styles.status}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>In BLE range</Text>
                  </View>
                )}

                <View style={styles.encNote}>
                  <Feather name="lock" size={12} color={Colors.textMuted} />
                  <Text style={styles.encText}>
                    End-to-end encrypted via Noise XX and Double Ratchet
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  style={styles.removeBtn}
                  onPress={isContact ? handleRemoveContact : handleAddContact}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isContact ? "Remove contact" : "Add to contacts"
                  }
                >
                  <Feather
                    name={isContact ? "user-x" : "user-plus"}
                    size={16}
                    color={Colors.textPrimary}
                  />
                  <Text style={styles.removeText}>
                    {isContact ? "Remove contact" : "Add to contacts"}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.blockBtn}
                  onPress={handleBlock}
                  accessibilityRole="button"
                  accessibilityLabel="Block this peer"
                >
                  <Feather name="slash" size={16} color={Colors.danger} />
                  <Text style={styles.blockText}>Block contact</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
      gap: Spacing.lg,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.borderStrong,
      alignSelf: "center",
    },
    body: {
      alignItems: "center",
      gap: Spacing.xs,
    },
    name: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
      marginTop: Spacing.sm,
    },
    peerID: {
      fontSize: FontSize.xs,
      fontFamily: "monospace",
      color: Colors.textMuted,
      letterSpacing: 0.3,
    },
    since: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      marginTop: 2,
    },
    status: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 2,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: Colors.online,
    },
    statusText: {
      fontSize: FontSize.sm,
      color: Colors.online,
      fontWeight: FontWeight.medium,
    },
    encNote: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: Spacing.sm,
      paddingHorizontal: Spacing.md,
    },
    encText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      textAlign: "center",
    },
    actions: {
      gap: Spacing.sm,
    },
    removeBtn: {
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
    },
    removeText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    blockBtn: {
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
    },
    blockText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.danger,
    },
  });
}
