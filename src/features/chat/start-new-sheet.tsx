// The Chats header "+" flow: pick what to start, then fill in that form.
//
// This used to live inside channel-list, which meant the "+" only worked on the
// Channels sub-tab: on Direct the list is unmounted, so there was nothing to
// open. Lifting the whole flow to one component that App.tsx mounts alongside
// the Chats list gives both sub-tabs the same button and the same sheets, with
// no second copy of the chooser to keep in sync.
//
// The chooser comes first so a channel and a group are seen side by side at the
// moment of deciding: both are private and both are encrypted, so the actual
// difference (a shareable link and no member cap versus a fixed signed roster
// that stays on Bluetooth) has to be stated where the choice is made. Picking
// one closes the chooser and opens that form; its Back button returns here.

import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { generateChannelKey } from "../../core/mesh/channel-crypto";
import { useChatStore } from "../../store/chat-store";
import BottomSheet from "../../ui/components/bottom-sheet";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { GeohashJumpSheet } from "./geohash-jump-sheet";
import { JoinLinkSheet } from "./join-link-sheet";
import { NewGroupSheet } from "./new-group-sheet";

interface Props {
  // Increment this to open the chooser (from the App.tsx header + button).
  // Counter pattern avoids the boolean edge cases of an open/close flag.
  trigger: number;
  // Open a room once it has been created or joined.
  onOpenChannel: (channel: string) => void;
}

export function StartNewSheet({
  trigger,
  onOpenChannel,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const channels = useChatStore((s) => s.channels);
  const joinPrivateChannel = useChatStore((s) => s.joinPrivateChannel);

  const [showChooser, setShowChooser] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showGeohash, setShowGeohash] = useState(false);
  const [showJoinLink, setShowJoinLink] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  // Reach for a new channel. Defaults to Bluetooth-only, the most private
  // option; the user opts into internet reach.
  const [newChannelOverNostr, setNewChannelOverNostr] = useState(false);

  // Watch the trigger counter from the App.tsx header button. Initialise with
  // the current value so a remount (e.g. coming back from a thread) does not
  // reopen the chooser.
  const prevTrigger = useRef(trigger);
  useEffect(() => {
    if (trigger > prevTrigger.current) {
      prevTrigger.current = trigger;
      setShowChooser(true);
    }
  }, [trigger]);

  // Normalised input for duplicate detection (shown while typing). Groups and
  // DMs are keyed by prefix and can't collide with a #channel name.
  const normalizedInput = newChannel.trim().replace(/^#*/, "#").toLowerCase();
  const nameAlreadyExists =
    normalizedInput.length > 1 &&
    channels.some(
      (c) =>
        !c.startsWith("dm:") &&
        !c.startsWith("group:") &&
        c.toLowerCase() === normalizedInput,
    );
  // A name needs at least one character after the "#".
  //
  // handleAdd already refused anything shorter, but it refused it by returning
  // silently while Create sat there at full contrast. So an empty field, or a
  // lone "#", gave a live button that did nothing: the user cannot tell that
  // from a broken app. Both reasons a name is unusable now gate the same button,
  // and both say so.
  const nameTooShort = normalizedInput.length < 2;
  const canCreate = !nameTooShort && !nameAlreadyExists;

  // Close the channel form and clear its inputs. `backToChooser` reopens the
  // step before it, so Back reads as "go back" rather than "lose my place": the
  // user came here from a choice and may have picked the wrong one. Dismissing
  // by backdrop or system back leaves entirely, as usual.
  function resetJoinModal(backToChooser = false): void {
    setNewChannel("");
    setNewChannelOverNostr(false);
    setShowJoinModal(false);
    if (backToChooser) setShowChooser(true);
  }

  function handleAdd(): void {
    const name = newChannel.trim().replace(/^#*/, "#");
    if (!canCreate) return;
    // Every custom channel is private and end-to-end encrypted: it gets a fresh
    // key here, shared only with people you send the invite link to. Reach is
    // the creator's choice: local mesh only, or also bridged over Nostr.
    joinPrivateChannel(name, generateChannelKey(), newChannelOverNostr);
    // Created, so there is nothing to go back to.
    resetJoinModal();
    // Land in the new room, like the group and geohash paths do. Without this a
    // channel started from the Direct sub-tab would appear on the other one and
    // read as nothing having happened.
    onOpenChannel(name);
  }

  return (
    <>
      {/* Step 1: what are we starting? */}
      <BottomSheet
        visible={showChooser}
        onClose={() => setShowChooser(false)}
        sheetStyle={styles.modalSheet}
      >
        <Text style={styles.modalTitle}>Start something new</Text>

        <View style={styles.chooserGroup}>
          <Pressable
            style={styles.chooserRow}
            onPress={() => {
              setShowChooser(false);
              setShowJoinModal(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Create a private channel"
          >
            <View style={styles.chooserIcon}>
              <Feather name="hash" size={18} color={Colors.textPrimary} />
            </View>
            <View style={styles.chooserText}>
              <Text style={styles.chooserTitle}>Private Channel</Text>
              <Text style={styles.chooserDesc}>
                A room anyone with the link can join. Create one, or join with a
                link you were sent.
              </Text>
            </View>
          </Pressable>

          <View style={styles.chooserDivider} />

          <Pressable
            style={styles.chooserRow}
            onPress={() => {
              setShowChooser(false);
              setShowNewGroup(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Create a private group"
          >
            <View style={styles.chooserIcon}>
              <Feather name="users" size={18} color={Colors.textPrimary} />
            </View>
            <View style={styles.chooserText}>
              <Text style={styles.chooserTitle}>Private Group</Text>
              <Text style={styles.chooserDesc}>
                Pick specific people. Up to 16. Stays on Bluetooth.
              </Text>
            </View>
          </Pressable>

          <View style={styles.chooserDivider} />

          <Pressable
            style={styles.chooserRow}
            onPress={() => {
              setShowChooser(false);
              setShowGeohash(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Go to a place by geohash"
          >
            <View style={styles.chooserIcon}>
              <Feather name="map-pin" size={18} color={Colors.textPrimary} />
            </View>
            <View style={styles.chooserText}>
              <Text style={styles.chooserTitle}>Go to a place</Text>
              <Text style={styles.chooserDesc}>
                Open a location channel anywhere by its geohash.
              </Text>
            </View>
          </Pressable>
        </View>

        <Pressable
          style={styles.modalCancel}
          onPress={() => setShowChooser(false)}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
        >
          <Text style={styles.modalCancelText}>Cancel</Text>
        </Pressable>
      </BottomSheet>

      {/* Step 2a: the private channel form. */}
      <BottomSheet
        visible={showJoinModal}
        onClose={() => resetJoinModal()}
        sheetStyle={styles.modalSheet}
      >
        <Text style={styles.modalTitle}>Create a private channel</Text>
        <View style={styles.privacyNote}>
          <View style={styles.privacyNoteRow}>
            <Feather name="lock" size={14} color={Colors.e2ee} />
            <Text style={styles.privacyNoteText}>
              End-to-end encrypted. Only members can read the messages.
            </Text>
          </View>
          <View style={styles.privacyNoteRow}>
            <Feather name="link" size={14} color={Colors.textMuted} />
            <Text style={styles.privacyNoteText}>
              Invite only. Anyone you share the link with can join. It stays
              hidden from everyone else, even peers nearby.
            </Text>
          </View>
          <View style={styles.privacyNoteRow}>
            <Feather
              name={newChannelOverNostr ? "globe" : "bluetooth"}
              size={14}
              color={Colors.textMuted}
            />
            <Text style={styles.privacyNoteText}>
              {newChannelOverNostr
                ? "Reaches members over Bluetooth and the internet."
                : "Works over Bluetooth range, not the internet."}
            </Text>
          </View>
        </View>
        <View>
          <TextInput
            style={[
              styles.modalInput,
              nameAlreadyExists && styles.modalInputError,
            ]}
            value={newChannel}
            onChangeText={setNewChannel}
            placeholder="#channel-name"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoFocus
            onSubmitEditing={handleAdd}
            returnKeyType="done"
            selectionColor={Colors.accent}
          />
          {nameAlreadyExists && (
            <Text style={styles.inputError} accessibilityLiveRegion="polite">
              A channel with this name already exists.
            </Text>
          )}
        </View>

        {/* Reach. Encryption is always on (the removed "Private"/"Nostr"
            pickers only set unread labels); this choice actually changes the
            send path: local mesh only, or also sealed and published over
            Nostr for out-of-range members. */}
        <View style={styles.optionGroup}>
          <Text style={styles.optionLabel}>Reach</Text>
          <View style={styles.optionRow}>
            <Pressable
              style={[
                styles.optionChip,
                !newChannelOverNostr && styles.optionChipActive,
              ]}
              onPress={() => setNewChannelOverNostr(false)}
              accessibilityRole="button"
              accessibilityState={{ selected: !newChannelOverNostr }}
            >
              <Feather
                name="bluetooth"
                size={13}
                color={
                  newChannelOverNostr ? Colors.textMuted : Colors.textPrimary
                }
              />
              <Text
                style={
                  newChannelOverNostr
                    ? styles.optionChipText
                    : styles.optionChipTextActive
                }
              >
                Bluetooth only
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.optionChip,
                newChannelOverNostr && styles.optionChipActive,
              ]}
              onPress={() => setNewChannelOverNostr(true)}
              accessibilityRole="button"
              accessibilityState={{ selected: newChannelOverNostr }}
            >
              <Feather
                name="globe"
                size={13}
                color={
                  newChannelOverNostr ? Colors.textPrimary : Colors.textMuted
                }
              />
              <Text
                style={
                  newChannelOverNostr
                    ? styles.optionChipTextActive
                    : styles.optionChipText
                }
              >
                Bluetooth + Internet
              </Text>
            </Pressable>
          </View>
          <Text style={styles.reachHint}>
            {newChannelOverNostr
              ? "Reaches members over the internet too. Relays can see the channel is active, never its messages or who is in it."
              : "Stays on the local mesh. Most private, nothing leaves Bluetooth range."}
          </Text>
        </View>

        {/* The other half of this sheet: a private channel is either one you
            start or one you were invited to, and both belong to the same
            decision. It sits below the form rather than beside it because
            creating is the common case and joining is the answer to "I already
            have a link". The typed name is kept, so Back lands where it left. */}
        <Pressable
          style={styles.joinLinkRow}
          onPress={() => {
            setShowJoinModal(false);
            setShowJoinLink(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Join a private channel with an invite link"
        >
          <Feather name="link" size={14} color={Colors.accent} />
          <Text style={styles.joinLinkText}>
            Have an invite link? Join with it
          </Text>
        </Pressable>

        <View style={styles.modalActions}>
          <Pressable
            style={styles.modalCancel}
            onPress={() => resetJoinModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Back to the chooser"
          >
            <Text style={styles.modalCancelText}>Back</Text>
          </Pressable>
          <Pressable
            style={[
              styles.modalConfirm,
              !canCreate && styles.modalConfirmDisabled,
            ]}
            onPress={handleAdd}
            disabled={!canCreate}
            accessibilityRole="button"
            accessibilityLabel="Create channel"
            accessibilityState={{ disabled: !canCreate }}
            accessibilityHint={
              nameTooShort
                ? "Enter a channel name first"
                : nameAlreadyExists
                  ? "That name is already taken"
                  : undefined
            }
          >
            <Text style={styles.modalConfirmText}>Create</Text>
          </Pressable>
        </View>
      </BottomSheet>

      {/* Step 2b and 2c: the group roster and the geohash jump. */}
      <NewGroupSheet
        visible={showNewGroup}
        onClose={() => setShowNewGroup(false)}
        onBack={() => {
          setShowNewGroup(false);
          setShowChooser(true);
        }}
        onCreated={(channel) => {
          setShowNewGroup(false);
          onOpenChannel(channel);
        }}
      />

      <GeohashJumpSheet
        visible={showGeohash}
        onClose={() => setShowGeohash(false)}
        onBack={() => {
          setShowGeohash(false);
          setShowChooser(true);
        }}
        onJoined={(channel) => {
          setShowGeohash(false);
          onOpenChannel(channel);
        }}
      />

      {/* Step 3: paste an invite. Reached from the private-channel form, so
          Back returns there rather than to the chooser. Opens whatever the link
          points at, which is usually a channel but may be a DM or a card. */}
      <JoinLinkSheet
        visible={showJoinLink}
        onClose={() => setShowJoinLink(false)}
        onBack={() => {
          setShowJoinLink(false);
          setShowJoinModal(true);
        }}
        onJoined={(channel) => {
          setShowJoinLink(false);
          // Joined, so the half-typed create form behind this is finished with.
          resetJoinModal();
          onOpenChannel(channel);
        }}
      />
    </>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    modalSheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.base,
    },
    modalTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    // Privacy note in the create sheet: a short, scannable list of what a
    // channel actually is (encrypted, invite-only, Bluetooth range) rather than
    // one dense paragraph.
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
    privacyNoteText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 19,
    },
    modalInput: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.xl,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      color: Colors.textPrimary,
      fontSize: FontSize.base,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    modalInputError: {
      borderColor: Colors.danger,
    },
    inputError: {
      fontSize: FontSize.xs,
      color: Colors.danger,
      marginTop: 4,
    },
    optionGroup: {
      gap: Spacing.xs,
    },
    optionLabel: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    optionRow: {
      flexDirection: "row",
      gap: Spacing.sm,
    },
    // paddingVertical 9, not 7: at 7 the chip measured ~30pt and these two sit
    // side by side, so hitSlop would overlap and blur the boundary between
    // "Bluetooth only" and "Bluetooth + Internet". Same fix, and the same
    // number, as the header's segmented control.
    optionChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: Spacing.md,
      paddingVertical: 9,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.bg,
    },
    optionChipActive: {
      borderColor: Colors.accent,
      backgroundColor: Colors.surface,
    },
    optionChipText: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontWeight: FontWeight.medium,
    },
    optionChipTextActive: {
      fontSize: FontSize.sm,
      color: Colors.textPrimary,
      fontWeight: FontWeight.semibold,
    },
    reachHint: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      lineHeight: 17,
    },
    // The "join instead" escape hatch under the create form. Quiet: it is the
    // second reason to be here, not a competing button, so it reads as a line
    // of text with the accent doing the work of saying it is tappable.
    joinLinkRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      paddingVertical: Spacing.xs,
    },
    joinLinkText: {
      fontSize: FontSize.sm,
      color: Colors.accent,
      fontWeight: FontWeight.medium,
    },
    modalActions: {
      flexDirection: "row",
      gap: Spacing.sm,
      marginTop: Spacing.xs,
    },
    modalCancel: {
      flex: 1,
      minHeight: 50,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.full,
      paddingVertical: Spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    // Dismiss actions read at full contrast, matching the wallet sheets,
    // the scanner and the alert buttons: a muted label on a filled pill
    // reads as disabled rather than as the quieter of two choices.
    modalCancelText: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.semibold,
    },
    modalConfirm: {
      flex: 1,
      minHeight: 50,
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      paddingVertical: Spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    modalConfirmDisabled: {
      opacity: 0.4,
    },
    modalConfirmText: {
      fontSize: FontSize.base,
      color: Colors.textInverse,
      fontWeight: FontWeight.semibold,
    },
    // Chooser rows: icon, then a title over a one-line explanation of what
    // makes this option different from the others.
    chooserGroup: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      overflow: "hidden",
    },
    chooserDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginLeft: Spacing.base,
    },
    chooserRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.base,
      paddingHorizontal: Spacing.base,
    },
    chooserIcon: {
      width: 38,
      height: 38,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    chooserText: {
      flex: 1,
      gap: 2,
    },
    chooserTitle: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    chooserDesc: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 18,
    },
  });
}
