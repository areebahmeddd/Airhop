// Contact info sheet: the single source of truth for "who is this DM with".
//
// Shown from two places, and intentionally the SAME component in both so they
// never drift: tapping the header inside a DM thread, and the "Contact info"
// action on the DM list's More sheet. Shows identity, how long you have been
// chatting, reachability, verification, and the encryption guarantee, plus the
// Remove contact / Block actions.

import { Feather } from "@expo/vector-icons";
import { useT } from "@i18n";
import { acknowledged } from "@platform/haptics";
import { getMeshService } from "@services/mesh-service";
import { useChatStore } from "@store/chat-store";
import { useContactsStore } from "@store/contacts-store";
import { useMeshStateStore } from "@store/mesh-state-store";
import { REACHABLE_TTL_MS, usePeerStore } from "@store/peer-store";
import Avatar from "@ui/components/avatar";
import BottomSheet from "@ui/components/bottom-sheet";
import {
  FontFamily,
  FontSize,
  FontWeight,
  HIT_SLOP,
  hitSlopFor,
  MIN_TOUCH,
  Radius,
  Spacing,
  useThemeColors,
} from "@ui/theme";
import { formatLongDate } from "@utils/format";
import {
  resolveDisplayName,
  resolvePeerOwnName,
} from "@utils/peer-display-name";
import { isNostrId, NOSTR_ID_PREFIX, peerIDToUsername } from "@utils/username";
import * as Clipboard from "expo-clipboard";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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

  // What they call themselves, which the sheet keeps showing after a rename so
  // the identity that was verified never disappears behind a label.
  const ownName = peerID ? resolvePeerOwnName(peerID) : "";
  // The pencil is offered to any mesh peer, verified or not, and says why when
  // it cannot be used.
  //
  // Hiding it from unverified contacts made the feature invisible to exactly
  // the people who would want it: you cannot discover that renaming exists, or
  // that verifying is what unlocks it, from a control that is not there. Shown
  // and explained, the same tap teaches both - and the Verify button that fixes
  // it is already on screen underneath.
  //
  // Offered on a location-channel pseudonym too, where it cannot be used either
  // - a per-cell name changes when someone moves, so a label pinned to it would
  // outlive the thing it names. But hiding it there left the sheet with no
  // answer to "can I call them something else", and the answer is a real path
  // rather than a no: keep them, verify them when you meet, then rename. The
  // note below names whichever step comes next.
  const canRename = peerID !== null;
  // Held as "which peer is this about" rather than a bare boolean, and derived
  // back below.
  //
  // This sheet is mounted once and reused for everyone, so plain flags leaked
  // between people: opening an unverified contact showed the blocked note before
  // anything was tapped, and - the one that mattered - a half-typed name for one
  // person was still in the field when the sheet reopened on another, one tap
  // away from being saved to the wrong contact. Comparing against the peer makes
  // that impossible rather than merely unlikely.
  const [editingFor, setEditingFor] = useState<string | null>(null);
  const [blockedFor, setBlockedFor] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const editingName = peerID !== null && editingFor === peerID;
  const renameBlocked = peerID !== null && blockedFor === peerID;

  function commitRename(): void {
    if (peerID !== null) {
      // An empty field clears the label and hands them their own name back,
      // which is the only "undo" this needs.
      useContactsStore.getState().setLocalNickname(peerID, draftName);
    }
    setEditingFor(null);
  }

  // Whether we can offer to hand this person our durable contact card.
  //
  // Only for a location-channel pseudonym we still have a cell bound to, since
  // that cell is the encrypted channel the card travels over. A cell key works
  // only in its own cell, so both sides lose the thread as soon as either moves.
  // What the card hands over is the KEYS (see sendGeoDm for what the envelope
  // already carried), which is what makes them reachable anywhere.
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
    acknowledged();
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
            {/* Rename, for a contact verified in person only. Same corner slot
                the channel sheet uses for its bookmark, so the sheets share one
                place for "the action about this thing itself". */}
            {canRename && !editingName && (
              <Pressable
                style={styles.cornerBtn}
                onPress={() => {
                  if (!verified) {
                    setBlockedFor(peerID);
                    return;
                  }
                  setBlockedFor(null);
                  setDraftName(contact?.localNickname ?? "");
                  setEditingFor(peerID);
                }}
                hitSlop={hitSlopFor(28)}
                accessibilityRole="button"
                accessibilityLabel={T("chat.contact.rename")}
              >
                <Feather name="edit-2" size={17} color={Colors.textMuted} />
              </Pressable>
            )}
            <View style={styles.body}>
              <Avatar
                username={name}
                peerID={peerID}
                size={64}
                presence={isOnline ? "online" : "offline"}
                ringColor={Colors.surface}
              />
              {editingName ? (
                <View style={styles.renameRow}>
                  <TextInput
                    style={styles.renameInput}
                    value={draftName}
                    onChangeText={setDraftName}
                    placeholder={ownName}
                    placeholderTextColor={Colors.textMuted}
                    maxLength={32}
                    autoFocus
                    selectionColor={Colors.selection}
                    onSubmitEditing={commitRename}
                    returnKeyType="done"
                    accessibilityLabel={T("chat.contact.rename")}
                  />
                  <Pressable
                    onPress={commitRename}
                    hitSlop={hitSlopFor(28)}
                    accessibilityRole="button"
                    accessibilityLabel={T("common.done")}
                  >
                    <Feather name="check" size={18} color={Colors.accent} />
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.name}>{name}</Text>
              )}
              {/* Only when the two differ, so an unrenamed contact is not told
                  their name twice. Blank is the clear action. */}
              {!editingName && contact?.localNickname !== undefined && (
                <Text style={styles.renameHint}>
                  {T("chat.contact.renamed_by_you")}
                </Text>
              )}
              {/* The reason, on the tap that asked for it. Verify sits a few
                  rows below, so the explanation and the fix are on one screen. */}
              {renameBlocked && !verified && (
                <Text style={styles.renameBlockedNote}>
                  {/* A pseudonym cannot be verified at all, so pointing at the
                      scanner there would be a dead end. Name the step that
                      actually comes first. */}
                  {isAnonymous
                    ? T("chat.contact.rename_needs_contact")
                    : T("chat.contact.rename_needs_verify")}
                </Text>
              )}
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
                  {/* Why this key is not a lasting handle. Said here, under the
                      key itself, because that is where somebody decides whether
                      to treat it as a contact. */}
                  <Text style={styles.keyBoxNote}>
                    {T("chat.contact.cell_key_note")}
                  </Text>
                </Pressable>
              ) : (
                /* Who they are, in the two forms that matter: the name they
                   go by, and the ID that is actually bound to their keys. Both
                   stay visible after a rename, so a label the user chose can
                   never hide the identity they verified. */
                <View style={styles.identityBox}>
                  <View style={styles.identityRow}>
                    <Text style={styles.identityLabel}>
                      {T("chat.contact.peer_name")}
                    </Text>
                    <Text style={styles.identityValue} numberOfLines={1}>
                      {ownName}
                    </Text>
                  </View>
                  <View style={styles.infoDivider} />
                  <Pressable
                    style={styles.identityRow}
                    onPress={handleCopyID}
                    hitSlop={HIT_SLOP}
                    accessibilityRole="button"
                    accessibilityLabel={T("chat.contact.copy_peer_id")}
                  >
                    <Text style={styles.identityLabel}>
                      {T("chat.contact.peer_id")}
                    </Text>
                    <Text style={styles.identityMono} numberOfLines={1}>
                      {peerID}
                    </Text>
                    <Feather
                      name={copied ? "check" : "copy"}
                      size={13}
                      color={copied ? Colors.online : Colors.textMuted}
                    />
                  </Pressable>
                </View>
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
    // Top-right corner, matching the channel sheet's bookmark: one slot per
    // sheet for the action about the thing itself.
    cornerBtn: {
      position: "absolute",
      top: Spacing.base,
      end: Spacing.base,
      zIndex: 1,
      padding: Spacing.xs,
    },
    renameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      alignSelf: "stretch",
      marginTop: Spacing.sm,
    },
    renameInput: {
      flex: 1,
      minHeight: MIN_TOUCH,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.md,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.borderStrong,
      fontSize: FontSize.md,
      color: Colors.textPrimary,
      textAlign: "center",
    },
    renameBlockedNote: {
      fontSize: FontSize.xs,
      lineHeight: FontSize.xs * 1.5,
      color: Colors.textMuted,
      textAlign: "center",
      paddingHorizontal: Spacing.md,
    },
    renameHint: {
      fontSize: FontSize["2xs"],
      color: Colors.textMuted,
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },
    // Name and ID together, so a label the user chose can never hide the
    // identity underneath it.
    identityBox: {
      alignSelf: "stretch",
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      marginTop: Spacing.xs,
    },
    identityRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm + 2,
    },
    identityLabel: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    identityValue: {
      flex: 1,
      textAlign: "right",
      fontSize: FontSize.sm,
      color: Colors.textPrimary,
    },
    identityMono: {
      flex: 1,
      textAlign: "right",
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
      fontFamily: FontFamily.mono,
      letterSpacing: 0.6,
    },
    keyBoxNote: {
      fontSize: FontSize["2xs"],
      lineHeight: FontSize["2xs"] * 1.5,
      color: Colors.textMuted,
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
