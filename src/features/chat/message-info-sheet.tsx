// Message info: the delivery timeline for one of your own outgoing messages,
// the "i" / "Message info" action from the long-press menu. Mirrors WhatsApp's
// info screen: a preview of the message, then when it was sent, delivered and
// read.
//
// What each scope can honestly say differs, so each gets its own answer:
//
//   DM      sent, delivered, read. One recipient, so "who saw it" is a name.
//   Group   sent, plus how much of the roster is reachable. No read receipts
//           (see utils/group-reach.ts for why they are not coming).
//   Channel sent, and nothing more. A public room has no roster to count
//           against and no membership to confirm anything with.

import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { t, useT, useTPlural } from "../../i18n";
import { useBlockedStore } from "../../store/blocked-store";
import type { ChatMessage } from "../../store/chat-store";
import { useGroupStore } from "../../store/group-store";
import { reachablePeerIDs, usePeerStore } from "../../store/peer-store";
import BottomSheet from "../../ui/components/bottom-sheet";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { resolveDisplayName } from "../../utils/display-name";
import { formatClockTime, formatShortDate } from "../../utils/format";
import { groupReach, type GroupReach } from "../../utils/group-reach";
import { messagePreviewText } from "../../utils/message-preview";

interface Props {
  message: ChatMessage | null;
  // This device's peer ID, so it can be excluded from the group roster count.
  localPeerID: string;
  onClose: () => void;
}

export default function MessageInfoSheet({
  message,
  localPeerID,
  onClose,
}: Props): React.JSX.Element {
  const T = useT();
  const TP = useTPlural();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  const isDM = message?.channel.startsWith("dm:") ?? false;
  const isGroup = message?.channel.startsWith("group:") ?? false;
  const status = message?.status;
  // In a DM there is exactly one recipient, so "who saw it" is simply them.
  const peerName =
    message && isDM ? resolveDisplayName(message.channel.slice(3)) : "";

  // Live rather than sampled at send time: people walk in and out of range, and
  // the sheet is opened to ask the question now. All three stores are
  // subscribed, so an open sheet updates as the mesh changes.
  const groupRoster = useGroupStore((s) => {
    const c = message?.channel ?? "";
    if (!c.startsWith("group:")) return undefined;
    return s.groups.find((g) => g.groupID === c.slice("group:".length));
  });
  const peers = usePeerStore((s) => s.peers);
  const blockedPeerIDs = useBlockedStore((s) => s.blockedPeerIDs);
  const reach = useMemo<GroupReach | null>(() => {
    if (groupRoster === undefined) return null;
    return groupReach(
      groupRoster.members.map((m) => m.fingerprint),
      localPeerID,
      reachablePeerIDs(peers),
      new Set(blockedPeerIDs),
    );
  }, [groupRoster, localPeerID, blockedPeerIDs, peers]);

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

            {/* The sender took an ecash payment back. Terminal, so it replaces
                the Sent/Delivered/Read lines below rather than adding to them:
                those would describe a payment that no longer exists. */}
            {status === "reclaimed" && (
              <InfoLine
                styles={styles}
                icon="undo-variant"
                color={Colors.textSecondary}
                label={T("chat.info.reclaimed")}
                sub={T("chat.info.reclaimed_desc")}
              />
            )}

            {status !== undefined &&
              status !== "sending" &&
              status !== "failed" &&
              status !== "carried" &&
              status !== "queued" &&
              status !== "reclaimed" && (
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
                        label={T("chat.info.delivered_to", { name: peerName })}
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
                        label={T("chat.info.read_by", { name: peerName })}
                        time={
                          message.readAtMs !== undefined
                            ? formatDateTime(message.readAtMs)
                            : undefined
                        }
                        pending={message.readAtMs === undefined}
                      />
                    </>
                  )}
                  {/* A group can say how much of its roster is within reach,
                      which is the question that matters on a mesh: not "did
                      they read it" but "did it get out". Deliberately not
                      dressed up as delivery, since nothing confirmed it. */}
                  {isGroup && reach !== null && (
                    <InfoLine
                      styles={styles}
                      icon="account-group"
                      color={
                        reach.reachable > 0
                          ? Colors.textSecondary
                          : Colors.textMuted
                      }
                      label={
                        reach.total === 0
                          ? T("chat.info.group_alone")
                          : TP("chat.info.group_reach", reach.total, {
                              reachable: reach.reachable,
                            })
                      }
                      sub={
                        reach.total === 0
                          ? undefined
                          : T("chat.info.group_reach_desc")
                      }
                    />
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

// Every line here is an event on one message, so the time is the point and the
// date only disambiguates. Formatted through utils/format so it follows the
// app's language; this called `toLocale*String([])`, which asks the device.
function formatDateTime(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const time = formatClockTime(ms);
  if (sameDay) return t("chat.info.today_at", { time });
  return `${formatShortDate(ms)} ${time}`;
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
