// Contact info sheet: the single source of truth for "who is this DM with".
//
// Shown from two places, and intentionally the SAME component in both so they
// never drift: tapping the header inside a DM thread, and the "Contact info"
// action on the DM list's More sheet. Shows identity, how long you have been
// chatting, reachability, verification, and the encryption guarantee, plus the
// Remove contact / Block actions.

import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getMeshService } from "../../services/mesh-service";
import { showAlert } from "../../store/alert-store";
import { useBlockedStore } from "../../store/blocked-store";
import { useChatStore } from "../../store/chat-store";
import { useContactsStore } from "../../store/contacts-store";
import { usePeerStore } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { resolveDisplayName } from "../../utils/display-name";
import VerifyContactScanner from "../contacts/verify-contact-scanner";

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
  const renameContact = useContactsStore((s) => s.renameContact);
  const blockPeer = useBlockedStore((s) => s.blockPeer);
  const peer = usePeerStore((s) => (peerID ? s.peers.get(peerID) : undefined));
  // Snapshot on open, so the reachability line is honest without a live timer.
  const [nowMs] = useState(() => Date.now());
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [verifying, setVerifying] = useState(false);

  const name = peerID ? resolveDisplayName(peerID) : "";
  const isOnline = peer !== undefined && nowMs - peer.lastSeenMs < 60_000;
  const firstMessage =
    messages && messages.length > 0 ? messages[0] : undefined;
  const verified = contact?.source === "qr";
  // Verifying is an in-person act, so it only applies to a peer you could meet:
  // one with a real mesh identity (a 16-hex peer ID). A remote, nostr-only
  // contact has no scannable in-person code, so we don't offer it there.
  const canVerify = !!peerID && !verified && /^[0-9a-f]{16}$/i.test(peerID);
  // Only verified contacts can be renamed: for those you have actually
  // confirmed who they are, so a name you assign is trustworthy.
  const canRename = verified;

  function startEdit(): void {
    setDraftName(contact?.nickname ?? name);
    setIsEditing(true);
  }

  // The pencil is always shown; tapping it on an unverified contact explains
  // why the name is locked instead of silently doing nothing.
  function handleEditPress(): void {
    if (!canRename) {
      showAlert(
        "Not verified",
        "You can rename this contact once you have verified them by scanning their QR code.",
      );
      return;
    }
    startEdit();
  }

  function saveEdit(): void {
    if (!peerID) return;
    const trimmed = draftName.trim();
    if (trimmed.length > 0) renameContact(peerID, trimmed);
    setIsEditing(false);
  }

  // Reset edit mode on dismiss so reopening never lands mid-edit.
  function handleClose(): void {
    setIsEditing(false);
    onClose();
  }
  // Mirrors the DM menu's Remove contact: forget the person and delete the
  // conversation, then leave the thread. Not a block, they can reach you again.
  function handleRemoveContact(): void {
    if (!peerID || !channel) return;
    showAlert(
      "Remove contact",
      `Remove ${name}? This deletes the conversation and forgets the contact. They can still reach you if they message again.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeChannel(channel);
            removeContact(peerID);
            usePeerStore.getState().removePeer(peerID);
            onClose();
            onAfterRemove?.();
          },
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

  // The info card's rows, top to bottom. Verification leads (the trust signal),
  // then relationship, reachability, and the always-on encryption guarantee.
  const infoRows: {
    key: string;
    icon: React.ComponentProps<typeof Feather>["name"];
    iconColor: string;
    label: string;
    sub?: string;
  }[] = [
    verified
      ? {
          key: "verify",
          icon: "shield",
          iconColor: Colors.online,
          label: contact
            ? `Verified since ${formatDate(contact.addedAtMs)}`
            : "Verified",
          sub: "Scanned their QR code",
        }
      : {
          key: "verify",
          icon: "shield-off",
          iconColor: Colors.textMuted,
          label: "Not verified",
          sub: "Scan their QR code to confirm this is really them.",
        },
  ];
  if (firstMessage) {
    infoRows.push({
      key: "since",
      icon: "clock",
      iconColor: Colors.textSecondary,
      label: `Chatting since ${formatDate(firstMessage.timestampMs)}`,
    });
  }
  infoRows.push({
    key: "enc",
    icon: "lock",
    iconColor: Colors.textMuted,
    label: "End-to-end encrypted",
    sub: "Noise XX and Double Ratchet",
  });

  return (
    <>
      <Modal
        visible={channel !== null}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            {peerID && !isEditing && (
              <Pressable
                style={styles.editBtn}
                onPress={handleEditPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Edit nickname"
              >
                <Feather name="edit-2" size={16} color={Colors.textMuted} />
              </Pressable>
            )}
            {peerID && (
              <>
                <View style={styles.body}>
                  <Avatar
                    username={name}
                    peerID={peerID}
                    size={64}
                    presence={isOnline ? "online" : "offline"}
                    ringColor={Colors.surface}
                  />
                  {isEditing ? (
                    <View style={styles.editRow}>
                      <TextInput
                        style={styles.nameInput}
                        value={draftName}
                        onChangeText={setDraftName}
                        autoFocus
                        maxLength={40}
                        placeholder="Nickname"
                        placeholderTextColor={Colors.textMuted}
                        selectionColor={Colors.accent}
                        textAlign="center"
                        returnKeyType="done"
                        onSubmitEditing={saveEdit}
                      />
                      <View style={styles.editControls}>
                        <Pressable
                          onPress={() => setIsEditing(false)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityRole="button"
                          accessibilityLabel="Cancel"
                        >
                          <Feather
                            name="x"
                            size={18}
                            color={Colors.textMuted}
                          />
                        </Pressable>
                        <Pressable
                          onPress={saveEdit}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityRole="button"
                          accessibilityLabel="Save nickname"
                        >
                          <Feather
                            name="check"
                            size={18}
                            color={Colors.accent}
                          />
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.name}>{name}</Text>
                  )}
                  <Text style={styles.peerID}>{peerID}</Text>

                  <View style={styles.infoCard}>
                    {infoRows.map((r, i) => (
                      <React.Fragment key={r.key}>
                        {i > 0 && <View style={styles.infoDivider} />}
                        <View style={styles.infoRow}>
                          <View style={styles.infoIcon}>
                            <Feather
                              name={r.icon}
                              size={16}
                              color={r.iconColor}
                            />
                          </View>
                          <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>{r.label}</Text>
                            {r.sub ? (
                              <Text style={styles.infoSub}>{r.sub}</Text>
                            ) : null}
                          </View>
                        </View>
                      </React.Fragment>
                    ))}
                  </View>
                </View>

                <View style={styles.actions}>
                  {canVerify && (
                    <Pressable
                      style={styles.verifyBtn}
                      onPress={() => setVerifying(true)}
                      accessibilityRole="button"
                      accessibilityLabel="Verify contact"
                    >
                      <Feather
                        name="shield"
                        size={16}
                        color={Colors.textInverse}
                      />
                      <Text style={styles.verifyText}>Verify contact</Text>
                    </Pressable>
                  )}
                  <Pressable
                    style={styles.removeBtn}
                    onPress={handleRemoveContact}
                    accessibilityRole="button"
                    accessibilityLabel="Remove contact"
                  >
                    <Feather
                      name="user-x"
                      size={16}
                      color={Colors.textPrimary}
                    />
                    <Text style={styles.removeText}>Remove contact</Text>
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
      {peerID && (
        <VerifyContactScanner
          visible={verifying}
          peerID={peerID}
          name={name}
          onClose={() => setVerifying(false)}
        />
      )}
    </>
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
    editBtn: {
      position: "absolute",
      top: Spacing.base,
      right: Spacing.base,
      zIndex: 1,
      padding: Spacing.xs,
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
    editRow: {
      alignItems: "center",
      gap: Spacing.sm,
      marginTop: Spacing.sm,
    },
    nameInput: {
      minWidth: 160,
      fontSize: FontSize.lg,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
      textAlign: "center",
      paddingVertical: 2,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    editControls: {
      flexDirection: "row",
      gap: Spacing.lg,
    },
    peerID: {
      fontSize: FontSize.xs,
      fontFamily: FontFamily.mono,
      color: Colors.textMuted,
      letterSpacing: 0.3,
    },
    // Structured info card: one bordered box, each fact its own icon row.
    infoCard: {
      alignSelf: "stretch",
      marginTop: Spacing.sm,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      overflow: "hidden",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
    },
    infoIcon: {
      width: 18,
      alignItems: "center",
    },
    infoText: {
      flex: 1,
      gap: 2,
    },
    infoLabel: {
      fontSize: FontSize.sm,
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
    },
    infoSub: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      lineHeight: FontSize.xs * 1.4,
    },
    infoDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginLeft: Spacing.base + 18 + Spacing.md,
    },
    actions: {
      gap: Spacing.sm,
    },
    verifyBtn: {
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
    },
    verifyText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
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
