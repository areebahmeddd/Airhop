// "Forward to…" target picker. Reuses the existing send pipeline: a forward
// is just composing a new message with the original content in a different
// channel/DM, so it needs no protocol changes at all.
//
// Targets are grouped by kind so a long chat list stays scannable, each kind in
// its own bordered box (matching the Appearance sheet): public Channels, private
// Groups, Location (geohash) cells, and Direct messages.

import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { isManualGeoChannel } from "../../services/geohash-channel-service";
import { useChatStore } from "../../store/chat-store";
import Avatar from "../../ui/components/avatar";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { channelLabel } from "../../utils/chat-display-name";
import { peerIDToUsername } from "../../utils/username";

interface Props {
  visible: boolean;
  excludeChannel: string;
  onClose: () => void;
  onForward: (targetChannel: string) => void;
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
const SECTION_ORDER: { kind: ForwardKind; title: string }[] = [
  { kind: "channel", title: "Channels" },
  { kind: "group", title: "Groups" },
  { kind: "location", title: "Locations" },
  { kind: "dm", title: "Direct messages" },
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
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const channels = useChatStore((s) => s.channels);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const sections = useMemo(() => {
    const targets = channels.filter((c) => c !== excludeChannel);
    return SECTION_ORDER.map(({ kind, title }) => ({
      title,
      data: targets.filter((c) => kindOf(c) === kind),
    })).filter((s) => s.data.length > 0);
  }, [channels, excludeChannel]);

  function handlePick(channel: string): void {
    onForward(channel);
    setSentTo(channel);
    setTimeout(() => {
      setSentTo(null);
      onClose();
    }, 500);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Forward to…</Text>
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {sections.length === 0 ? (
              <Text style={styles.empty}>No other chats yet.</Text>
            ) : (
              sections.map((section) => (
                <View key={section.title} style={styles.section}>
                  <Text style={styles.sectionHeader}>{section.title}</Text>
                  <View style={styles.group}>
                    {section.data.map((item, i) => {
                      const kind = kindOf(item);
                      const label =
                        kind === "dm"
                          ? peerIDToUsername(item.slice(3))
                          : channelLabel(item);
                      const justSent = sentTo === item;
                      return (
                        <React.Fragment key={item}>
                          {i > 0 && <View style={styles.divider} />}
                          <Pressable
                            style={styles.row}
                            onPress={() => handlePick(item)}
                            disabled={sentTo !== null}
                            accessibilityRole="button"
                            accessibilityLabel={`Forward to ${label}`}
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
      width: "100%",
      maxHeight: "70%",
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      paddingTop: Spacing.base,
      paddingBottom: Spacing.xl,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.borderStrong,
      alignSelf: "center",
      marginBottom: Spacing.base,
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
      marginLeft: 60,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.sm + 2,
    },
    channelIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
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
