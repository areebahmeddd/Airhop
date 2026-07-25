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
import { isNostrId, NOSTR_ID_PREFIX } from "../../utils/username";
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
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const peerID = channel?.startsWith("dm:") ? channel.slice(3) : null;

  const messages = useChatStore((s) =>
    channel ? s.messages[channel] : undefined,
  );
  const contact = useContactsStore((s) =>
    peerID ? s.contacts[peerID] : undefined,
  );
  const peer = usePeerStore((s) => (peerID ? s.peers.get(peerID) : undefined));
  // Snapshot on open, so the reachability line is honest without a live timer.
  const [nowMs] = useState(() => Date.now());
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
  // A Nostr/geohash peer is an anonymous, per-cell pseudonym — there is no
  // lasting identity to verify, so the sheet says "Anonymous" rather than the
  // "Not verified · scan their QR" line that a mesh peer gets.
  const isAnonymous = peerID !== null && isNostrId(peerID);
  // The info card's rows, top to bottom. Verification leads (the trust signal),
  // then relationship, reachability, and the always-on encryption guarantee.
  const infoRows: {
    key: string;
    icon: React.ComponentProps<typeof Feather>["name"];
    iconColor: string;
    label: string;
    sub?: string;
  }[] = [
    isAnonymous
      ? {
          key: "verify",
          icon: "shield-off",
          iconColor: Colors.danger,
          label: "Anonymous",
          sub: "A geohash pseudonym with no lasting identity to verify.",
        }
      : verified
        ? {
            key: "verify",
            icon: "shield",
            iconColor: Colors.verified,
            label: contact
              ? `Verified since ${formatDate(contact.addedAtMs)}`
              : "Verified",
            sub: "Scanned their QR code",
          }
        : {
            key: "verify",
            icon: "shield-off",
            iconColor: Colors.danger,
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
    iconColor: Colors.e2ee,
    label: "End-to-end encrypted",
    sub: "Noise XX and Double Ratchet",
  });

  return (
    <>
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
                  <Avatar
                    username={name}
                    peerID={peerID}
                    size={64}
                    presence={isOnline ? "online" : "offline"}
                    ringColor={Colors.surface}
                  />
                  <Text style={styles.name}>{name}</Text>
                  {/* A Nostr peer has no short mesh ID — its identifier IS a
                      64-hex public key. Box and label it so it reads as a
                      deliberate credential, not a stray string. */}
                  {isNostrId(peerID) ? (
                    <View style={styles.keyBox}>
                      <Text style={styles.keyBoxLabel}>Nostr public key</Text>
                      <Text style={styles.keyBoxValue} selectable>
                        {peerID.slice(NOSTR_ID_PREFIX.length)}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.peerID}>{peerID}</Text>
                  )}

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

                {canVerify && (
                  <View style={styles.actions}>
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
                  </View>
                )}
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
      fontFamily: FontFamily.mono,
      color: Colors.textMuted,
      letterSpacing: 0.3,
    },
    // Boxed, labeled Nostr public key (see the render note above).
    keyBox: {
      alignSelf: "stretch",
      marginTop: Spacing.sm,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      gap: 4,
    },
    keyBoxLabel: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    keyBoxValue: {
      fontSize: FontSize.xs,
      fontFamily: FontFamily.mono,
      color: Colors.textSecondary,
      letterSpacing: 0.3,
      lineHeight: 16,
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
  });
}
