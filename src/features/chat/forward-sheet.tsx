// "Forward to…" target picker. Reuses the existing send pipeline: a forward
// is just composing a new message with the original content in a different
// channel/DM, so it needs no protocol changes at all.
//
// Targets are grouped by kind so a long chat list stays scannable, each kind in
// its own bordered box (matching the Appearance sheet): public Channels, private
// Groups, Location (geohash) cells, and Direct messages.

import { Feather } from "@expo/vector-icons";
import { t, useT, type TranslationKey } from "@i18n";
import { isManualGeoChannel } from "@services/geohash-channel-service";
import { showAlert } from "@store/alert-store";
import { useChatStore } from "@store/chat-store";
import Avatar from "@ui/components/avatar";
import BottomSheet from "@ui/components/bottom-sheet";
import {
  DISABLED_OPACITY,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "@ui/theme";
import { channelLabel } from "@utils/conversation-display-name";
import { mediaBlockedReason } from "@utils/media-policy";
import { resolveDisplayName } from "@utils/peer-display-name";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  excludeChannel: string;
  onClose: () => void;
  // Returns whether anything was actually sent. A selection whose files have
  // aged out of the cache sends nothing and says so in its own alert, and the
  // sheet must not answer that with a tick.
  onForward: (targetChannel: string) => boolean;
  // Whether the selection carries an attachment. Media only travels where
  // canSendMedia allows, so a room that refuses it cannot be a target: the
  // send would leave a bubble here and reach nobody, and in a mixed selection
  // the text would arrive without it.
  //
  // Blocked rooms stay on screen, greyed, and say why when tapped. Same rule
  // as the composer's attach button: a target that vanishes leaves people
  // wondering whether they are in the wrong place.
  carriesMedia?: boolean;
}

type ForwardKind = "channel" | "group" | "location" | "dm";

// One source of truth for what a channel key is, its section, and its icon.
function kindOf(channel: string): ForwardKind {
  if (channel.startsWith("dm:")) return "dm";
  if (channel.startsWith("group:")) return "group";
  if (isManualGeoChannel(channel)) return "location";
  return "channel";
}

// Section order top-to-bottom. Only non-empty sections render.
const SECTION_ORDER: { kind: ForwardKind; titleKey: TranslationKey }[] = [
  { kind: "channel", titleKey: "chat.forward.channels" },
  { kind: "group", titleKey: "chat.forward.groups" },
  { kind: "location", titleKey: "chat.forward.locations" },
  { kind: "dm", titleKey: "chat.forward.dms" },
];

const ICON_FOR: Record<
  Exclude<ForwardKind, "dm">,
  React.ComponentProps<typeof Feather>["name"]
> = {
  channel: "hash",
  group: "users",
  location: "map-pin",
};

export default function ForwardSheet({
  visible,
  excludeChannel,
  onClose,
  onForward,
  carriesMedia = false,
}: Props): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const channels = useChatStore((s) => s.channels);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const sections = useMemo(() => {
    const targets = channels.filter((c) => c !== excludeChannel);
    return SECTION_ORDER.map(({ kind, titleKey }) => ({
      kind,
      titleKey,
      data: targets.filter((c) => kindOf(c) === kind),
    })).filter((s) => s.data.length > 0);
  }, [channels, excludeChannel]);

  // The half-second before the sheet closes is there to let the checkmark
  // register as confirmation. It has to be cancellable: the sheet is draggable,
  // so the user can dismiss it inside that window, and a timer that outlived it
  // would fire onClose() at whatever is on screen half a second later.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  // Why this room cannot take the selection, or null when it can.
  function blockedReason(channel: string): string | null {
    return carriesMedia ? mediaBlockedReason(channel) : null;
  }

  function handlePick(channel: string): void {
    if (closeTimer.current) return; // Already confirming; ignore a double tap.
    const blocked = blockedReason(channel);
    if (blocked !== null) {
      showAlert(t("chat.forward.cant_send_here"), blocked);
      return;
    }
    // Nothing left: the caller has already explained why, and the sheet stays
    // open on the target list so the tap can be spent on something else.
    if (!onForward(channel)) return;
    setSentTo(channel);
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setSentTo(null);
      onClose();
    }, 500);
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      sheetStyle={styles.sheet}
      scrollable
    >
      <Text style={styles.title}>{T("chat.forward.title")}</Text>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {sections.length === 0 ? (
          <Text style={styles.empty}>{T("chat.forward.none")}</Text>
        ) : (
          sections.map((section) => (
            <View key={section.kind} style={styles.section}>
              <Text style={styles.sectionHeader}>{T(section.titleKey)}</Text>
              <View style={styles.group}>
                {section.data.map((item, i) => {
                  const kind = kindOf(item);
                  const label =
                    kind === "dm"
                      ? resolveDisplayName(item.slice(3))
                      : channelLabel(item);
                  const justSent = sentTo === item;
                  const blocked = blockedReason(item) !== null;
                  return (
                    <React.Fragment key={item}>
                      {i > 0 && <View style={styles.divider} />}
                      <Pressable
                        style={[styles.row, blocked && styles.rowBlocked]}
                        onPress={() => handlePick(item)}
                        disabled={sentTo !== null}
                        accessibilityRole="button"
                        accessibilityState={{ disabled: blocked }}
                        accessibilityLabel={
                          blocked
                            ? t("chat.forward.cant_send_to", { name: label })
                            : T("chat.forward.to", { name: label })
                        }
                      >
                        {kind === "dm" ? (
                          <Avatar
                            username={label}
                            peerID={item.slice(3)}
                            size={36}
                          />
                        ) : (
                          <View style={styles.channelIcon}>
                            <Feather
                              name={ICON_FOR[kind]}
                              size={16}
                              color={Colors.textSecondary}
                            />
                          </View>
                        )}
                        <Text style={styles.rowLabel} numberOfLines={1}>
                          {label}
                        </Text>
                        {justSent && (
                          <Feather
                            name="check-circle"
                            size={18}
                            color={Colors.success}
                          />
                        )}
                      </Pressable>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </BottomSheet>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    sheet: {
      width: "100%",
      maxHeight: "70%",
      paddingBottom: Spacing.xl,
    },
    title: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.sm,
    },
    list: {
      paddingHorizontal: Spacing.base,
    },
    listContent: {
      paddingBottom: Spacing.sm,
    },
    section: {
      marginBottom: Spacing.md,
    },
    sectionHeader: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      paddingHorizontal: Spacing.sm,
      paddingBottom: Spacing.xs,
    },
    // One bordered box per section; rows inside are separated by dividers.
    group: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      overflow: "hidden",
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginStart: 60,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.sm + 2,
    },
    // A room that cannot take this selection. Still tappable, so the tap can
    // explain; the same treatment the composer's attach button gets.
    rowBlocked: {
      opacity: DISABLED_OPACITY,
    },
    channelIcon: {
      width: 36,
      height: 36,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    rowLabel: {
      flex: 1,
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    empty: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
      paddingVertical: Spacing.xl,
    },
  });
}
