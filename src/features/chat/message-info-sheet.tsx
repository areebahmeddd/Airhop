// Message info: the delivery timeline for one of your own outgoing messages,
// the "i" / "Message info" action from the long-press menu. Mirrors WhatsApp's
// info screen: a preview of the message, then when it was sent, delivered and
// read. Delivered/read only apply to DMs (a public channel has no roster to
// confirm against), so a channel message shows just "Sent".

import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useT } from "../../i18n";
import type { ChatMessage } from "../../store/chat-store";
import BottomSheet from "../../ui/components/bottom-sheet";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { resolveDisplayName } from "../../utils/display-name";
import { messagePreviewText } from "../../utils/message-preview";

interface Props {
  message: ChatMessage | null;
  onClose: () => void;
}

export default function MessageInfoSheet({
  message,
  onClose,
}: Props): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  const isDM = message?.channel.startsWith("dm:") ?? false;
  const status = message?.status;
  // In a DM there is exactly one recipient, so "who saw it" is simply them.
  const peerName =
    message && isDM ? resolveDisplayName(message.channel.slice(3)) : "";

  return (
    <BottomSheet
      visible={message !== null}
      onClose={onClose}
      sheetStyle={styles.sheet}
    >
      <Text style={styles.title}>{T("chat.info.title")}</Text>

      {message && (
        <>
          <View style={styles.preview}>
            <Text style={styles.previewText} numberOfLines={3}>
              {messagePreviewText(message)}
            </Text>
          </View>

          <View style={styles.rows}>
            {status === "sending" && (
              <InfoLine
                styles={styles}
                icon="clock-outline"
                color={Colors.textMuted}
                label={T("chat.info.sending")}
              />
            )}
            {status === "failed" && (
              <InfoLine
                styles={styles}
                icon="alert-circle-outline"
                color={Colors.danger}
                label={T("chat.info.failed")}
              />
            )}
            {status === "carried" && (
              <InfoLine
                styles={styles}
                icon="account-arrow-right"
                color={Colors.textSecondary}
                label={T("chat.info.courier")}
                time={formatDateTime(message.timestampMs)}
                sub={T("chat.info.courier_desc")}
              />
            )}
            {/* Queued has not left the device, so it gets its own line rather
                than falling through to "Sent" below. Same glyph and wording as
                the bubble's hourglass, so the two never disagree about the
                same message. */}
            {status === "queued" && (
              <InfoLine
                styles={styles}
                icon="timer-sand"
                color={Colors.textSecondary}
                label={T("chat.info.queued")}
                sub={T("chat.info.queued_desc")}
              />
            )}

            {status !== undefined &&
              status !== "sending" &&
              status !== "failed" &&
              status !== "carried" &&
              status !== "queued" && (
                <>
                  <InfoLine
                    styles={styles}
                    icon="check"
                    color={Colors.textSecondary}
                    label={T("chat.info.sent")}
                    time={formatDateTime(message.timestampMs)}
                  />
                  {isDM && (
                    <>
                      <InfoLine
                        styles={styles}
                        icon="check-all"
                        color={
                          message.deliveredAtMs !== undefined
                            ? Colors.textSecondary
                            : Colors.textMuted
                        }
                        label={`Delivered to ${peerName}`}
                        time={
                          message.deliveredAtMs !== undefined
                            ? formatDateTime(message.deliveredAtMs)
                            : undefined
                        }
                        pending={message.deliveredAtMs === undefined}
                      />
                      <InfoLine
                        styles={styles}
                        icon="check-all"
                        color={
                          message.readAtMs !== undefined
                            ? Colors.accent
                            : Colors.textMuted
                        }
                        label={`Read by ${peerName}`}
                        time={
                          message.readAtMs !== undefined
                            ? formatDateTime(message.readAtMs)
                            : undefined
                        }
                        pending={message.readAtMs === undefined}
                      />
                    </>
                  )}
                </>
              )}
          </View>
        </>
      )}
    </BottomSheet>
  );
}

function InfoLine({
  styles,
  icon,
  color,
  label,
  time,
  sub,
  pending,
}: {
  styles: ReturnType<typeof createStyles>;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  label: string;
  time?: string;
  sub?: string;
  pending?: boolean;
}): React.JSX.Element {
  const T = useT();
  return (
    <View style={styles.line}>
      <MaterialCommunityIcons name={icon} size={18} color={color} />
      <View style={styles.lineText}>
        <Text style={styles.lineLabel}>{label}</Text>
        {sub && <Text style={styles.lineSub}>{sub}</Text>}
      </View>
      <Text style={styles.lineTime}>
        {time ?? (pending ? T("chat.info.waiting") : "")}
      </Text>
    </View>
  );
}

function formatDateTime(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return `Today ${time}`;
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })} ${time}`;
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    sheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.base,
    },
    title: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    preview: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      padding: Spacing.md,
    },
    previewText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.5,
    },
    rows: {
      gap: Spacing.xs,
    },
    line: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.sm,
    },
    lineText: {
      flex: 1,
      gap: 1,
    },
    lineLabel: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
    },
    lineSub: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    lineTime: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontVariant: ["tabular-nums"],
    },
  });
}
