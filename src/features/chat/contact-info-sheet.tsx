// Contact info sheet: the single source of truth for "who is this DM with".
//
// Shown from two places, and intentionally the SAME component in both so they
// never drift: tapping the header inside a DM thread, and the "Contact info"
// action on the DM list's More sheet. Shows identity, how long you have been
// chatting, reachability, verification, and the encryption guarantee, plus the
// Remove contact / Block actions.

import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useT } from "../../i18n";
import { useChatStore } from "../../store/chat-store";
import { useContactsStore } from "../../store/contacts-store";
import { usePeerStore } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
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
  const T = useT();
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

  // The identifier under the name is the one string in this sheet nobody can
  // retype, and for a Nostr contact it is the only handle they have at all.
  // Selecting it by hand fights the sheet's pan-to-dismiss gesture, so copying
  // is a tap. The check replaces the glyph in place: no dialog on top of a
  // sheet for something this small.
  const [copied, setCopied] = useState(false);
  const idValue =
    peerID === null
      ? ""
      : isNostrId(peerID)
        ? peerID.slice(NOSTR_ID_PREFIX.length)
        : peerID;

  function handleCopyID(): void {
    void Clipboard.setStringAsync(idValue).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  // The info card's rows, top to bottom. Relationship leads, then verification
  // (the trust signal), then the always-on encryption guarantee.
  const infoRows: {
    key: string;
    icon: React.ComponentProps<typeof Feather>["name"];
    iconColor: string;
    label: string;
    sub?: string;
  }[] = [];
  if (firstMessage) {
    infoRows.push({
      key: "since",
      icon: "clock",
      iconColor: Colors.textSecondary,
      label: `Chatting since ${formatDate(firstMessage.timestampMs)}`,
    });
  }
  infoRows.push(
    isAnonymous
      ? {
          key: "verify",
          icon: "shield-off",
          iconColor: Colors.danger,
          label: T("chat.contact.anonymous"),
          sub: T("chat.contact.anonymous_desc"),
        }
      : verified
        ? {
            key: "verify",
            icon: "shield",
            iconColor: Colors.verified,
            label: contact
              ? `Verified since ${formatDate(contact.addedAtMs)}`
              : T("chat.contact.verified"),
            sub: T("chat.contact.verified_desc"),
          }
        : {
            key: "verify",
            icon: "shield-off",
            iconColor: Colors.danger,
            label: T("chat.contact.not_verified"),
            sub: T("chat.contact.not_verified_desc"),
          },
  );
  // The guarantee is the same either way, but the mechanism is not, and naming
  // the wrong one is the kind of small inaccuracy that costs trust in the
  // things around it. A relay-only contact has no mesh identity to run a Noise
  // handshake against, so their messages are NIP-17 gift-wrapped instead. On
  // the mesh it is Noise XX, and Double Ratchet on top of it when both ends are
  // Airhop; a bitchat peer gets Noise alone, which is why that half is stated
  // as a condition rather than a promise.
  infoRows.push({
    key: "enc",
    icon: "lock",
    iconColor: Colors.e2ee,
    label: T("chat.contact.e2ee"),
    sub: isAnonymous
      ? T("chat.contact.e2ee_nostr")
      : T("chat.contact.e2ee_mesh"),
  });

  return (
    <>
      <BottomSheet
        visible={channel !== null}
        onClose={onClose}
        sheetStyle={styles.sheet}
      >
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
                <Pressable
                  style={styles.keyBox}
                  onPress={handleCopyID}
                  accessibilityRole="button"
                  accessibilityLabel={T("chat.contact.copy_nostr")}
                >
                  <Text style={styles.keyBoxLabel}>
                    {T("chat.contact.nostr_key")}
                  </Text>
                  <View style={styles.keyBoxRow}>
                    <Text style={styles.keyBoxValue}>{idValue}</Text>
                    <Feather
                      name={copied ? "check" : "copy"}
                      size={15}
                      color={copied ? Colors.online : Colors.textMuted}
                    />
                  </View>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.peerIDRow}
                  onPress={handleCopyID}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel={T("chat.contact.copy_peer_id")}
                >
                  <Text style={styles.peerID}>{peerID}</Text>
                  <Feather
                    name={copied ? "check" : "copy"}
                    size={13}
                    color={copied ? Colors.online : Colors.textMuted}
                  />
                </Pressable>
              )}

              <View style={styles.infoCard}>
                {infoRows.map((r, i) => (
                  <React.Fragment key={r.key}>
                    {i > 0 && <View style={styles.infoDivider} />}
                    <View style={styles.infoRow}>
                      <View style={styles.infoIcon}>
                        <Feather name={r.icon} size={16} color={r.iconColor} />
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
                  accessibilityLabel={T("chat.contact.verify")}
                >
                  <Feather name="shield" size={16} color={Colors.textInverse} />
                  <Text style={styles.verifyText}>
                    {T("chat.contact.verify")}
                  </Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </BottomSheet>
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
    sheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.lg,
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
    // Mesh peer ID + its copy glyph, kept on one centered line.
    peerIDRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
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
    // The key wraps to two lines, so the glyph centers against the block
    // rather than sitting on the first line.
    keyBoxRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    keyBoxValue: {
      flex: 1,
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
      marginStart: Spacing.base + 18 + Spacing.md,
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
