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
import { getMeshService } from "../../services/mesh-service";
import { useChatStore } from "../../store/chat-store";
import { useContactsStore } from "../../store/contacts-store";
import { useMeshStateStore } from "../../store/mesh-state-store";
import { REACHABLE_TTL_MS, usePeerStore } from "../../store/peer-store";
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
import { formatLongDate } from "../../utils/format";
import {
  isNostrId,
  NOSTR_ID_PREFIX,
  peerIDToUsername,
} from "../../utils/username";
import VerifyContactScanner from "../contacts/verify-contact-scanner";
import SendEcashSheet from "../wallet/send-ecash-sheet";

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
  const [paying, setPaying] = useState(false);

  // Our own name, for the echo in the thread. Derived the same way the thread
  // derives it, so a payment started here and one started from the composer put
  // an identically labelled bubble in the same conversation.
  const localNickname = useMemo(() => {
    const id = getMeshService()?.getPeerID();
    return id !== undefined && id.length >= 4
      ? peerIDToUsername(id)
      : undefined;
  }, []);

  const name = peerID ? resolveDisplayName(peerID) : "";
  const isOnline =
    peer !== undefined && nowMs - peer.lastSeenMs < REACHABLE_TTL_MS;
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

  // Whether we can offer to hand this person our durable contact card.
  //
  // Only for a location-channel pseudonym we still have a cell bound to, since
  // that cell is the encrypted channel the card travels over. It is the one way
  // across the gap those pseudonyms create on purpose: their cell key and our
  // peer ID are unlinkable by design, so nothing but the person saying "this is
  // also me" can join them, and this is that.
  const geoDmPubkey = isAnonymous
    ? (peerID?.slice("nostr_".length) ?? null)
    : null;
  const geoDmCell = useChatStore((s) =>
    geoDmPubkey !== null ? s.geoDmCells[geoDmPubkey] : undefined,
  );
  // A relay has to be able to carry the card. Without one the send is a silent
  // no-op that would still flip the button to "Shared", which is worse than the
  // button not being there: it would claim we had told them who we are.
  //
  // `nostrConnected` is the whole condition, not just a network check. It is
  // reset when the mesh stops (Away) and when the internet toggle goes off, so
  // one subscription covers every way this can be unavailable. The thread's own
  // notice explains the state; this only decides whether to offer the action.
  const nostrConnected = useMeshStateStore((s) => s.nostrConnected);
  const canKeep =
    geoDmPubkey !== null && geoDmCell !== undefined && nostrConnected;
  // Read from the store rather than held locally, so "already shared" survives
  // closing the sheet and relaunching the app. Giving away a durable identity
  // twice because the button forgot is exactly the mistake worth designing out.
  const kept = useChatStore((s) =>
    geoDmPubkey !== null
      ? s.geoCardExchange[geoDmPubkey]?.sentMine === true
      : false,
  );

  function handleKeepPerson(): void {
    if (geoDmPubkey === null || kept) return;
    getMeshService()?.shareContactCardOverGeoDm(geoDmPubkey);
  }

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
  // The info card's rows, top to bottom. Relationship leads, then the
  // always-on encryption guarantee, then verification (the trust signal).
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
      label: T("chat.contact.chatting_since", {
        date: formatLongDate(firstMessage.timestampMs),
      }),
    });
  }
  infoRows.push({
    key: "enc",
    icon: "lock",
    iconColor: Colors.e2ee,
    label: T("chat.contact.e2ee"),
    sub: isAnonymous
      ? T("chat.contact.e2ee_nostr")
      : T("chat.contact.e2ee_mesh"),
  });
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
              ? T("chat.contact.verified_since", {
                  date: formatLongDate(contact.addedAtMs),
                })
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

            <View style={styles.actions}>
              {/* Paying is the one thing you can do with any correspondent,
                  mesh or Nostr, near or far: the rail is chosen for you. It
                  sits below verification because trust comes before money. */}
              {canVerify && (
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
              )}
              {/* The counterpart to Verify for someone met in a location
                  channel, where Verify cannot apply: there is no lasting
                  identity to check yet, and this is what creates one. Disabled
                  rather than hidden once tapped, so the screen confirms the send
                  instead of the button quietly vanishing. */}
              {canKeep && (
                <Pressable
                  style={[styles.verifyBtn, kept && styles.keepBtnDone]}
                  onPress={handleKeepPerson}
                  disabled={kept}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: kept }}
                  accessibilityLabel={T("chat.geo.keep_person")}
                  accessibilityHint={T("chat.geo.keep_person_desc")}
                >
                  <Feather
                    name={kept ? "check" : "user-plus"}
                    size={16}
                    color={Colors.textInverse}
                  />
                  <Text style={styles.verifyText}>
                    {kept ? T("chat.geo.card_sent") : T("chat.geo.keep_person")}
                  </Text>
                </Pressable>
              )}
              <Pressable
                style={styles.payBtn}
                onPress={() => setPaying(true)}
                accessibilityRole="button"
                accessibilityLabel={T("wallet.pay.action")}
              >
                <Feather name="zap" size={16} color={Colors.textPrimary} />
                <Text style={styles.payText}>{T("wallet.pay.action")}</Text>
              </Pressable>
            </View>
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
      {peerID && (
        <SendEcashSheet
          visible={paying}
          onClose={() => setPaying(false)}
          peerID={peerID}
          {...(contact?.nostrPubkeyHex !== undefined
            ? { nostrPubkey: contact.nostrPubkeyHex }
            : {})}
          displayName={name}
          {...(localNickname !== undefined
            ? { senderNickname: localNickname }
            : {})}
        />
      )}
    </>
  );
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
    // Sent. Dimmed rather than recoloured: the action is spent, not failed, and
    // a second hue here would read as a new state to interpret.
    keepBtnDone: {
      opacity: 0.6,
    },
    verifyText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
    },
    // Secondary to Verify: an outlined pill, so the two never read as equally
    // urgent when both are on screen.
    payBtn: {
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    payText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
  });
}
