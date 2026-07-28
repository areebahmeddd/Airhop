// Message thread screen for a single channel.
// Shows messages with sender and timestamp. Text input to compose and PTT button.

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import * as Clipboard from "expo-clipboard";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as ScreenCapture from "expo-screen-capture";
import * as Sharing from "expo-sharing";
import { useVideoPlayer, VideoView } from "expo-video";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AppState,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  findTokensInText,
  mayContainToken,
  type EmbeddedToken,
} from "../../core/payments/cashu";
import {
  describeRoute,
  reportWalletError,
  sendEcashToPeer,
} from "../../services/ecash-transfer";
import { AttachmentTooLargeError } from "../../services/file-transfer-service";
import {
  isGeoChannel,
  isManualGeoChannel,
  manualGeohashOf,
  type GeoParticipant,
} from "../../services/geohash-channel-service";
import { prepareImageForSend } from "../../services/image-compress";
import { hasLocationPermission } from "../../services/location-service";
import { getMeshService } from "../../services/mesh-service";
import { hostOf, receiveToken } from "../../services/wallet-service";
import { useActivityStore } from "../../store/activity-store";
import { showAlert } from "../../store/alert-store";
import {
  useChatStore,
  type ChatAttachment,
  type ChatMessage,
} from "../../store/chat-store";
import { useContactsStore } from "../../store/contacts-store";
import { useGroupStore } from "../../store/group-store";
import { useMeshStateStore } from "../../store/mesh-state-store";
import { usePeerStore } from "../../store/peer-store";
import { usePlaceNamesStore } from "../../store/place-names-store";
import {
  UPLOAD_QUALITY_VALUES,
  useSettingsStore,
} from "../../store/settings-store";
import {
  transferEtaSec,
  transferSpeedBps,
  useTransferStore,
} from "../../store/transfer-store";
import { useWalletStore } from "../../store/wallet-store";
import Avatar from "../../ui/components/avatar";
import BottomSheet from "../../ui/components/bottom-sheet";
import Toast from "../../ui/components/toast";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { useKeyboardInset } from "../../ui/use-keyboard";
import { channelInviteLink } from "../../utils/deep-link";
import { resolveDisplayName } from "../../utils/display-name";
import { canSendMedia } from "../../utils/media-policy";
import { activeMentionQuery, applyMention } from "../../utils/mentions";
import { ensurePermission } from "../../utils/permissions";
import { resolveThreadScroll } from "../../utils/thread-scroll";
import {
  isNostrId,
  NOSTR_ID_PREFIX,
  peerIDToUsername,
} from "../../utils/username";
import ChannelInfoSheet from "./channel-info-sheet";
import ContactInfoSheet from "./contact-info-sheet";
import ForwardSheet from "./forward-sheet";
import MessageActionSheet from "./message-action-sheet";
import MessageBubble from "./message-bubble";
import MessageInfoSheet from "./message-info-sheet";
import { NoticesSheet } from "./notices-sheet";

type AttachAction = "camera" | "library" | "document" | "voice" | "ecash";

// A picked attachment staged for the caption composer before it is sent.
interface PendingAttachment {
  type: ChatAttachment["type"];
  uri: string;
  name?: string;
  mimeType?: string;
  sizeBytes?: number;
}

const ATTACH_OPTIONS: {
  action: AttachAction;
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  desc: string;
  // Only offered inside a DM: sending ecash to a broadcast channel isn't
  // a peer-to-peer payment, so it doesn't belong in a public channel's
  // attach sheet.
  dmOnly?: boolean;
}[] = [
  {
    action: "camera",
    icon: "camera",
    label: "Camera",
    desc: "Take a photo or video",
  },
  {
    action: "library",
    icon: "image",
    label: "Photo Library",
    desc: "Choose from your library",
  },
  {
    action: "document",
    icon: "file-text",
    label: "Document",
    desc: "Send any file or PDF",
  },
  {
    action: "voice",
    icon: "mic",
    label: "Voice Note",
    desc: "Record and send a voice message",
  },
  {
    action: "ecash",
    icon: "zap",
    label: "Send ecash",
    desc: "Send Cashu sats from your wallet",
    dmOnly: true,
  },
];

interface Props {
  channel: string;
  localNickname: string;
  localPeerID: string;
  onBack: () => void;
  // Set together (id + an incrementing counter) when opening this thread
  // from a search result, so the thread scrolls to and flashes that one
  // message. The counter, not just the id, is what actually triggers the
  // effect, so re-tapping the same search result while already here still
  // re-scrolls (an id-only dependency wouldn't re-fire on an unchanged id).
  targetMessageId?: string;
  targetMessageTrigger?: number;
  // Ask the parent to switch the active chat to this channel, used both
  // right after forwarding a message (land where it went, not silently stay
  // put) and when picking "Message" on a channel sender's profile sheet
  // (jump straight into the DM with them).
  onNavigateToChannel: (channel: string) => void;
  // Unread waiting on the list this thread was opened from, so the back button
  // can say what is behind it. Scoped by the parent to the matching side:
  // Direct while in a DM, Rooms while in a channel or group. The thread you
  // are reading is the active channel, so it never counts toward its own badge.
  backUnreadCount?: number;
}

// Broadcast wire format for a screenshot notice, matching bitchat's action
// message convention so both platforms recognize it and render it inline
// instead of as a regular chat bubble.

// How close to the end of the thread still counts as "at the bottom", in points.
// Roughly one bubble: near enough that following a new message reads as the list
// staying put, far enough that a deliberate scroll up is never mistaken for it.
const AT_BOTTOM_TOLERANCE = 80;

// Long enough for a bottom sheet to finish sliding out before the next one
// slides in. Matches BottomSheet's own close duration with a little slack.
const SHEET_HANDOFF_MS = 250;

// The attachment-review sheet darkens the screen further than the standard
// scrim: the point of that sheet is to look at one photo, and the thread behind
// it competing for attention defeats that.
const COMPOSER_SCRIM = "rgba(0,0,0,0.85)";

// Photo and video bubbles are all one width, so a run of them lines up down the
// thread instead of each bubble taking the width of whatever caption happens to
// sit under it. The height follows the photo's own shape, clamped: unclamped, a
// phone screenshot (about 0.45 wide-to-tall) would be a column half the screen
// high, and a panorama would be a letterbox slit. Beyond the clamp the photo is
// centre-cropped to fit, which is what every messenger does, and tapping still
// opens the untouched original full screen.
// A voice note is speech on a ~22 KB/s radio, so it is recorded as speech:
// mono, 16 kHz (the band a voice actually occupies), 32 kbps. The stock
// HIGH_QUALITY preset is 44.1 kHz stereo at 128 kbps, four times the bytes for
// nothing anyone can hear on a phone speaker, which put a one-minute note over
// the 512 KiB wire cap and spent a minute of Bluetooth getting there. Still AAC
// in an .m4a container, so bitchat and any ordinary player read it unchanged.
const VOICE_RECORDING = {
  ...RecordingPresets.HIGH_QUALITY,
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 32000,
};

// Attachments leave one at a time on one paced queue, so at most this many
// transfer cards can be telling the user anything; the rest are at 0% and get
// counted on a single line instead.
const TRANSFER_CARD_LIMIT = 2;

// How often to re-check whether the mic button would go live. Slow on purpose:
// this only changes when peers arrive or leave, and the answer drives an icon,
// not a decision.
const LIVE_AVAILABILITY_POLL_MS = 3000;

// A burst shorter than this is a mis-tap, not a message. Nothing is kept for
// it: the room may have heard a click, and a quarter-second bubble in the
// thread afterwards is worse than nothing.
const MIN_BURST_KEEP_MS = 500;

const MEDIA_BUBBLE_WIDTH = 220;
const MEDIA_MIN_ASPECT = 0.75; // portrait floor: 220 x 293
const MEDIA_MAX_ASPECT = 1.9; // landscape ceiling: 220 x 116
// Until the real dimensions are read, 4:3 keeps the row from jumping far.
const MEDIA_DEFAULT_ASPECT = 4 / 3;

function mediaHeightForAspect(aspect: number | null): number {
  const ratio = Math.min(
    MEDIA_MAX_ASPECT,
    Math.max(MEDIA_MIN_ASPECT, aspect ?? MEDIA_DEFAULT_ASPECT),
  );
  return Math.round(MEDIA_BUBBLE_WIDTH / ratio);
}

function screenshotNoticeText(nickname: string): string {
  return `* ${nickname} took a screenshot *`;
}

// Whole calendar days between two instants, in local time.
//
// Counting elapsed milliseconds would be wrong here: a message sent at 23:50 and
// read at 00:10 is twenty minutes old but belongs to yesterday, which is the
// only thing a date separator cares about. Both sides are flattened to local
// midnight first, so the result is a day count and never a fraction.
function daysBetween(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

// Slash commands offered by the "/" quick-picker. Only the ones handleSend
// actually acts on appear here, so the list never advertises a command that does
// nothing. Both are IRC-style emotes: in a DM they target the peer, in a channel
// they take a trailing @name.
const SLASH_COMMANDS: { cmd: string; emoji: string; hint: string }[] = [
  { cmd: "hug", emoji: "🫂", hint: "Send a warm hug" },
  { cmd: "slap", emoji: "🐟", hint: "Slap with a large trout" },
];

// The partial command while typing "/…" at the very start of the draft, before
// any space ("/hu" -> "hu", "/hug foo" -> null, "not /hug" -> null). Null when
// the draft is not a command being composed. Mirrors activeMentionQuery for "@".
function activeSlashQuery(draft: string): string | null {
  const m = /^\/(\w*)$/.exec(draft);
  return m ? m[1]!.toLowerCase() : null;
}

// (A previous isScreenshotNotice() text-sniffer was removed: matching on user
// text let any peer forge a system row and destroyed the real message content.)

// Fixed bar heights for the voice-note waveform. A constant, not a literal in
// the render, so the playhead maths below has one length to divide by.
const VOICE_WAVE_BARS = [6, 12, 8, 16, 10, 14, 8, 6, 12, 10, 8, 14];

interface VoiceNoteBubbleProps {
  uri: string;
  durationMs: number;
  isPlaying: boolean;
  isMine: boolean;
  onToggle: () => void;
  onFinished: () => void;
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Inline video player for a received (or sent) video attachment.
//
// This replaced a static film-icon placeholder: the bytes arrived and
// reassembled correctly, but there was no way to actually watch the video.
function VideoAttachment({ uri }: { uri: string }): React.JSX.Element {
  const player = useVideoPlayer(uri, (p) => {
    // Don't autoplay: a thread can hold several videos and they would all
    // start at once when the list renders.
    p.loop = false;
  });

  return (
    <VideoView
      style={videoAttachmentStyles.video}
      player={player}
      contentFit="contain"
      fullscreenOptions={{ enable: true }}
      nativeControls
    />
  );
}

const videoAttachmentStyles = StyleSheet.create({
  video: {
    width: 220,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#000",
  },
});

// Undo Send pill: shown just above the compose bar while a message is held in
// its brief send window. A thin line drains left-to-right over the window as a
// countdown; tapping Undo pulls the message back into the input.
function UndoSendPill({
  onUndo,
  Colors,
  durationMs,
}: {
  onUndo: () => void;
  Colors: ReturnType<typeof useThemeColors>;
  durationMs: number;
}): React.JSX.Element {
  const styles = useMemo(() => createUndoStyles(Colors), [Colors]);
  const progress = useSharedValue(1);
  useEffect(() => {
    progress.value = 1;
    progress.value = withTiming(0, {
      duration: durationMs,
      easing: Easing.linear,
    });
  }, [progress, durationMs]);
  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.pill}>
      <Feather name="clock" size={14} color={Colors.textSecondary} />
      <Text style={styles.label}>Sending…</Text>
      <Pressable
        onPress={onUndo}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Undo send"
      >
        <Text style={styles.undo}>Undo</Text>
      </Pressable>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

function createUndoStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      marginHorizontal: Spacing.base,
      marginBottom: Spacing.sm,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
    },
    label: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
    },
    undo: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: Colors.accent,
    },
    // Countdown line pinned to the bottom edge, draining as the window elapses.
    track: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 2,
    },
    fill: {
      height: 2,
      backgroundColor: Colors.accent,
    },
  });
}

// Progress cards for the attachments currently moving through this thread.
// Files crawl over Bluetooth (~22 KB/s), so a large one can take many minutes;
// showing live percent, speed and ETA is the difference between "working" and
// "frozen" from the user's side.
function TransferProgressList({
  channel,
}: {
  channel: string;
}): React.JSX.Element | null {
  const Colors = useThemeColors();
  const styles = useMemo(() => createTransferStyles(Colors), [Colors]);
  // Subscribe to the whole map, then filter, so any advance() re-renders us.
  const transfers = useTransferStore((s) => s.transfers);
  const mine = Object.values(transfers)
    .filter((t) => t.channel === channel)
    .sort((a, b) => a.startedAtMs - b.startedAtMs);

  if (mine.length === 0) return null;

  // Only the front of the queue gets a card. Attachments go out one at a time
  // over one paced radio queue, so everything behind the first is sitting at 0%
  // by definition: five voice notes fired off in a row produced five near
  // identical cards, four of them reporting nothing, shoving the thread and the
  // compose bar up the screen. One card for what is moving, one line for what
  // is waiting.
  const shown = mine.slice(0, TRANSFER_CARD_LIMIT);
  const queued = mine.length - shown.length;

  return (
    <View style={styles.wrap}>
      {shown.map((t) => {
        const pct =
          t.totalBytes > 0
            ? Math.min(
                100,
                Math.round((t.transferredBytes / t.totalBytes) * 100),
              )
            : 0;
        const speed = transferSpeedBps(t);
        const eta = transferEtaSec(t);

        const verb =
          t.status === "done"
            ? t.direction === "send"
              ? "Sent"
              : "Received"
            : t.status === "failed"
              ? "Failed"
              : t.status === "cancelled"
                ? "Cancelled"
                : t.status === "stalled"
                  ? "Waiting"
                  : t.direction === "send"
                    ? "Sending"
                    : "Receiving";

        const detail =
          t.status === "active"
            ? [
                formatBytes(t.transferredBytes) +
                  " / " +
                  formatBytes(t.totalBytes),
                speed > 0 ? formatBytes(speed) + "/s" : null,
                eta !== null && eta > 0 ? formatEta(eta) + " left" : null,
              ]
                .filter(Boolean)
                .join(" · ")
            : t.status === "stalled"
              ? `Waiting for ${t.peerLabel || "peer"} to return · ${pct}%`
              : formatBytes(t.totalBytes);

        return (
          <View key={t.id} style={styles.card}>
            <Feather
              name={
                t.status === "failed"
                  ? "alert-circle"
                  : t.status === "done"
                    ? "check-circle"
                    : t.status === "stalled"
                      ? "clock"
                      : t.direction === "send"
                        ? "arrow-up-circle"
                        : "arrow-down-circle"
              }
              size={18}
              color={
                t.status === "failed"
                  ? Colors.danger
                  : t.status === "stalled"
                    ? Colors.syncing
                    : Colors.textSecondary
              }
            />
            <View style={styles.body}>
              <View style={styles.topRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {verb} {t.name}
                  {t.peerLabel ? ` · ${t.peerLabel}` : ""}
                </Text>
                {t.status === "active" || t.status === "stalled" ? (
                  <View style={styles.transferRight}>
                    <Text style={styles.pct}>{pct}%</Text>
                    <Pressable
                      onPress={() => getMeshService()?.cancelTransfer(t.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityRole="button"
                      accessibilityLabel={`Cancel ${t.name}`}
                    >
                      <Feather name="x" size={16} color={Colors.textMuted} />
                    </Pressable>
                  </View>
                ) : null}
              </View>
              <Text style={styles.detail} numberOfLines={1}>
                {detail}
              </Text>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${t.status === "active" || t.status === "stalled" ? pct : 100}%`,
                      backgroundColor:
                        t.status === "failed"
                          ? Colors.danger
                          : t.status === "stalled"
                            ? Colors.syncing
                            : Colors.accent,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
      {queued > 0 && (
        <Text style={styles.queued}>{queued} more waiting to send</Text>
      )}
    </View>
  );
}

// Document subtitle in the WhatsApp style, e.g. "PDF · 2.3 MB". Returns null
// when neither an extension nor a size is known.
function docSubtitle(attachment: ChatAttachment): string | null {
  const parts: string[] = [];
  const ext = fileExtension(attachment.name, attachment.mimeType);
  if (ext !== null) parts.push(ext);
  if (attachment.sizeBytes !== undefined && attachment.sizeBytes > 0) {
    parts.push(formatBytes(attachment.sizeBytes));
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}

// Uppercase file-type tag from the filename extension, falling back to the MIME
// subtype (e.g. "report.pdf" or "application/pdf" -> "PDF").
function fileExtension(name?: string, mimeType?: string): string | null {
  if (name !== undefined) {
    const dot = name.lastIndexOf(".");
    if (dot > 0 && dot < name.length - 1) {
      return name
        .slice(dot + 1)
        .toUpperCase()
        .slice(0, 5);
    }
  }
  if (mimeType !== undefined) {
    const sub = mimeType.split("/")[1];
    if (sub) return sub.toUpperCase().slice(0, 5);
  }
  return null;
}

// Compact byte formatter: 512 B, 21 KB, 1.4 MB.
function formatBytes(n: number): string {
  if (n < 1024) return `${Math.round(n)} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

// Rounded human ETA: 12s, 3m, 1h 4m.
function formatEta(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function createTransferStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    wrap: {
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing.xs,
      gap: Spacing.xs,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
    },
    // The tail of the queue, as one muted line rather than a stack of cards
    // that all say 0%.
    queued: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      paddingHorizontal: Spacing.md,
    },
    body: { flex: 1, gap: 3 },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing.sm,
    },
    name: {
      flex: 1,
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    transferRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    pct: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: Colors.textSecondary,
      fontVariant: ["tabular-nums"],
    },
    detail: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontVariant: ["tabular-nums"],
    },
    track: {
      height: 3,
      borderRadius: 2,
      backgroundColor: Colors.border,
      overflow: "hidden",
      marginTop: 2,
    },
    fill: { height: 3, borderRadius: 2 },
  });
}

// A photo in a bubble, sized to its own shape.
//
// The dimensions are read off the file rather than carried in the attachment:
// a photo that arrived from a peer has no metadata beyond its bytes, so this is
// the one path that works for both what we sent and what we received.
function ImageAttachment({
  uri,
  onPress,
}: {
  uri: string;
  onPress: () => void;
}): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [aspect, setAspect] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    Image.getSize(
      uri,
      (w, h) => {
        if (alive && h > 0) setAspect(w / h);
      },
      () => {
        // Unreadable file: the default shape below still renders the frame, and
        // the Image itself shows its own failure state.
      },
    );
    return () => {
      alive = false;
    };
  }, [uri]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="imagebutton"
      accessibilityLabel="View photo full screen"
    >
      <Image
        source={{ uri }}
        style={[styles.attachImage, { height: mediaHeightForAspect(aspect) }]}
        resizeMode="cover"
      />
    </Pressable>
  );
}

function VoiceNoteBubble({
  uri,
  durationMs,
  isPlaying,
  isMine,
  onToggle,
  onFinished,
}: VoiceNoteBubbleProps): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (isPlaying) {
      player.play();
      return;
    }

    player.pause();
  }, [isPlaying, player]);

  useEffect(() => {
    if (status.didJustFinish && isPlaying) {
      player.pause();
      void player.seekTo(0).catch(() => {});
      onFinished();
    }
  }, [isPlaying, onFinished, player, status.didJustFinish]);

  // How long the clip runs. The sender's own figure is authoritative when it is
  // there, but a voice note from bitchat has none: bitchat's file packet has no
  // duration field, so those arrived reading 0:00. The player knows the real
  // answer once the file is loaded, which covers every source.
  const totalSecs =
    durationMs > 0
      ? Math.round(durationMs / 1000)
      : Math.round(status.duration);
  // Elapsed while playing, total when idle, the way every messenger does it.
  const shownSecs = isPlaying ? Math.floor(status.currentTime) : totalSecs;
  // How far through, for the waveform fill. Guarded against a duration of 0,
  // which is what an unloaded or unreadable file reports.
  const progress =
    isPlaying && status.duration > 0
      ? Math.min(1, status.currentTime / status.duration)
      : 0;

  // The play button sits on a neutral surface circle (same pattern as every
  // other icon-in-a-circle in this app), so its icon is always readable
  // regardless of theme. The waveform bars and duration text sit directly
  // on the bubble itself, so those still need to track isMine like the
  // message text next to them does.
  const barColor = isMine ? styles.barOnMyBubble : styles.barOnTheirBubble;
  const textColor = isMine ? styles.textOnMyBubble : styles.textOnTheirBubble;

  return (
    <View style={styles.attachVoice}>
      <Pressable
        style={styles.attachVoicePlay}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? "Pause voice note" : "Play voice note"}
      >
        <Feather
          name={isPlaying ? "pause" : "play"}
          size={16}
          color={Colors.textPrimary}
        />
      </Pressable>
      {/* The bars are decorative, not a real waveform (the file is not
          analysed), but they carry the one thing that is real: how far in you
          are. Bars behind the playhead are solid, the rest stay faded, so a
          glance says both "this is playing" and "this much is left". */}
      <View style={styles.attachVoiceWave}>
        {VOICE_WAVE_BARS.map((h, i) => {
          const played = isPlaying && i / VOICE_WAVE_BARS.length < progress;
          return (
            <View
              key={i}
              style={[
                styles.attachVoiceBar,
                barColor,
                { height: h, opacity: played ? 1 : 0.4 },
              ]}
            />
          );
        })}
      </View>
      <Text style={[styles.attachVoiceDuration, textColor]}>
        {formatDuration(shownSecs)}
      </Text>
    </View>
  );
}

export default function MessageThread({
  channel,
  localNickname,
  localPeerID,
  onBack,
  targetMessageId,
  targetMessageTrigger,
  onNavigateToChannel,
  backUnreadCount = 0,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  // How far the compose bar has to lift to clear the on-screen keyboard.
  const keyboardInset = useKeyboardInset();
  const { messages, addMessage, addChannel } = useChatStore();
  // Live peer count, real data from BLE discovery, not a stub.
  // Subscribe to the stable peer map and derive the reachable list locally.
  const peers = usePeerStore((s) => s.peers);
  const [peerClock, setPeerClock] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setPeerClock(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);
  const onlinePeers = useMemo(() => {
    const cutoff = peerClock - 60_000;
    return [...peers.values()].filter((peer) => peer.lastSeenMs >= cutoff);
  }, [peerClock, peers]);
  const peerCount = onlinePeers.length;

  // Geohash channels live over Nostr, keyed by the user's location cell. The
  // location prompt itself happens once at mesh startup (alongside the Bluetooth
  // permissions); here we just re-resolve the cell when the channel opens, in
  // case the user has moved. No-op without permission.
  const isGeo = isGeoChannel(channel);
  // Media (photos, files, voice) rides BLE only, so it is offered only where it
  // can actually deliver: the Bluetooth mesh channel and direct mesh DMs. Off in
  // location/teleported cells (Nostr-scoped) and private channels/groups
  // (encrypted text; media would broadcast in the clear). Matches bitchat.
  const mediaAllowed = canSendMedia(channel);
  // Teleported cells are keyed `geohash:<gh>`; the header shows them as `#<gh>`,
  // matching bitchat's location-channel badge, not the raw internal key.
  const isManualGeo = isManualGeoChannel(channel);
  const channelLabel = isManualGeo ? `#${manualGeohashOf(channel)}` : channel;
  // Private group channels (`group:<id>`): messages are ChaCha20-Poly1305
  // sealed under the group's epoch key and broadcast as 0x25, not plaintext.
  const isGroup = channel.startsWith("group:");
  const groupName = useGroupStore((s) => s.nameForChannel(channel));
  useEffect(() => {
    if (!isGeo) return;
    let cancelled = false;
    void (async () => {
      if (!cancelled && (await hasLocationPermission())) {
        getMeshService()?.refreshGeoChannels();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isGeo, channel]);

  // Live participant list for a geohash channel, from Nostr presence + recent
  // posts in the cell. Polled since it updates off a network subscription, not a
  // store. Drives the member pill and members sheet; #bluetooth and private
  // channels have no such roster and fall back to nearby BLE peers.
  const [geoMembers, setGeoMembers] = useState<GeoParticipant[]>([]);
  useEffect(() => {
    // Only polled for geo channels; geoMembers is never read otherwise, so a
    // stale value on a non-geo channel is harmless and needs no reset.
    if (!isGeo) return;
    function sample(): void {
      const list = getMeshService()?.getGeoParticipants(channel) ?? [];
      setGeoMembers((prev) =>
        prev.length === list.length &&
        prev.every((p, i) => p.pubkey === list[i]?.pubkey)
          ? prev
          : list,
      );
    }
    sample();
    const timer = setInterval(sample, 5000);
    return () => clearInterval(timer);
  }, [isGeo, channel]);

  // Member count and roster resolve by transport: a geohash channel counts
  // people active in its cell over the internet; every other channel counts
  // nearby BLE peers.
  const memberCount = isGroup
    ? (getMeshService()?.groupMemberCount(channel.slice("group:".length)) ?? 0)
    : isGeo
      ? // Count yourself: you are an active participant in the cell too, and the
        // member list shows a "You" row, so the pill/subtitle must match it.
        geoMembers.length + 1
      : peerCount;

  // Reverse-geocoded name for a location channel's cell, shown in the header
  // subtitle as "~Kumaraswamy Layout". Present once the cell has a geohash
  // (teleported always; named only with location on) and geocoding succeeds.
  const channelGeohash = isGeo
    ? (manualGeohashOf(channel) ??
      getMeshService()?.getChannelGeohash(channel) ??
      null)
    : null;
  const geoPlaceName = usePlaceNamesStore((s) =>
    channelGeohash !== null ? s.names[channelGeohash] : undefined,
  );

  // Unseen board notices for this room, driving a dot on the header's notices
  // icon. A non-geo public channel (#bluetooth) uses the mesh board (""); a geo
  // channel uses its own cell. Opening the sheet clears both, since it shows the
  // "Here" and "Mesh" tabs together.
  const noticeGeohash = channelGeohash ?? "";
  const unseenNotices = useActivityStore((s) =>
    s.entries.reduce(
      (n, e) =>
        e.kind === "notice" && (e.geohash ?? "") === noticeGeohash && !e.seen
          ? n + 1
          : n,
      0,
    ),
  );
  function openNotices(): void {
    setShowNotices(true);
    useActivityStore.getState().markNoticesSeen(noticeGeohash);
    if (noticeGeohash !== "") useActivityStore.getState().markNoticesSeen("");
  }
  useEffect(() => {
    if (channelGeohash !== null) {
      usePlaceNamesStore.getState().resolve(channelGeohash);
    }
  }, [channelGeohash]);

  const bridgeActive = useMeshStateStore((s) => s.bridgeActive);
  const bridgePeopleAcross = useMeshStateStore((s) => s.bridgePeopleAcross);

  // Header subtitle for a channel (not a group/DM): place name and/or live
  // count, falling back to a plain label.
  const channelSubtitleParts: string[] = [];
  if (isGeo && geoPlaceName !== undefined) {
    channelSubtitleParts.push(`~${geoPlaceName}`);
  }
  if (memberCount > 0) {
    channelSubtitleParts.push(`${memberCount} ${isGeo ? "active" : "nearby"}`);
  }
  // On the public mesh channel, show that it is bridged (and how many are
  // reachable across the bridge) so people in the thread know their messages
  // are reaching beyond Bluetooth, not just the Mesh-tab banner.
  if (channel === "#bluetooth" && bridgeActive) {
    channelSubtitleParts.push(
      bridgePeopleAcross > 0
        ? `${bridgePeopleAcross} across bridge`
        : "bridged",
    );
  }
  const channelSubtitle =
    channelSubtitleParts.length > 0
      ? channelSubtitleParts.join("  ·  ")
      : "Public channel";

  const audioRecorder = useAudioRecorder(VOICE_RECORDING);
  const recorderState = useAudioRecorderState(audioRecorder);
  const dmPeerID = channel.startsWith("dm:") ? channel.slice(3) : null;
  const isDMPeerOnline =
    dmPeerID !== null && onlinePeers.some((p) => p.peerID === dmPeerID);
  // Whether this DM can still be delivered when the peer is out of Bluetooth
  // range: either they are a Nostr-only correspondent, or we hold their durable
  // Nostr pubkey (from a v2 QR card or a past ANNOUNCE). Drives honest banner
  // copy: an offline peer we can still reach over the internet must not be shown
  // the same "we'll deliver when they're nearby" line as an unreachable one.
  const dmContactNostr = useContactsStore((s) =>
    dmPeerID !== null ? s.contacts[dmPeerID]?.nostrPubkeyHex : undefined,
  );
  const dmInternetReachable =
    dmPeerID !== null &&
    (dmPeerID.startsWith("nostr_") ||
      (dmContactNostr !== undefined && dmContactNostr.length > 0));
  const [draft, setDraft] = useState("");

  // @-mention suggestions. Who can be tagged depends on the thread: a group's
  // roster, a location cell's active participants, or a channel's nearby peers.
  // A DM has only one other person, so mentions there add nothing.
  const mentionCandidates = useMemo<{ id: string; nickname: string }[]>(() => {
    if (channel.startsWith("dm:")) return [];
    if (channel.startsWith("group:")) {
      const members =
        useGroupStore.getState().get(channel.slice("group:".length))?.members ??
        [];
      return members.map((m) => ({ id: m.fingerprint, nickname: m.nickname }));
    }
    if (isGeo) {
      return geoMembers.map((m) => ({ id: m.pubkey, nickname: m.nickname }));
    }
    return [...peers.values()].map((p) => ({
      id: p.peerID,
      nickname: p.nickname || peerIDToUsername(p.peerID),
    }));
  }, [isGeo, channel, geoMembers, peers]);

  // The candidates matching what the user is typing after "@", minus yourself.
  const mentionQuery = activeMentionQuery(draft);
  const mentionMatches = useMemo(() => {
    if (mentionQuery === null) return [];
    const q = mentionQuery.toLowerCase();
    const seen = new Set<string>();
    const out: { id: string; nickname: string }[] = [];
    for (const c of mentionCandidates) {
      const nick = c.nickname.trim();
      if (nick.length === 0 || nick === localNickname) continue;
      if (!nick.toLowerCase().includes(q)) continue;
      const key = nick.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ id: c.id, nickname: nick });
      if (out.length >= 6) break;
    }
    return out;
  }, [mentionQuery, mentionCandidates, localNickname]);

  // Slash commands matching what is typed after "/". Independent of mentions, so
  // it also shows in DMs (where there is no one to @-mention but you can still
  // /hug the peer). The two pickers never show at once: one needs "@…", the
  // other a leading "/…".
  const slashQuery = activeSlashQuery(draft);
  const slashMatches = useMemo(
    () =>
      slashQuery === null
        ? []
        : SLASH_COMMANDS.filter((c) => c.cmd.startsWith(slashQuery)),
    [slashQuery],
  );

  const [isPTTActive, setIsPTTActive] = useState(false);
  // Whether this hold is streaming live or recording a note to send on
  // release. Decided per press, not per app: see handleTalkStart.
  const [isTalkingLive, setIsTalkingLive] = useState(false);
  // Display name of whoever is talking right now, or null. Drives the floor
  // courtesy hint on the mic button.
  const [liveTalker, setLiveTalker] = useState<string | null>(null);
  // Which press of the mic button we are on, and whether that press went live.
  // Refs rather than state because the gesture handlers are async and read
  // these after awaits, where a render-old closure would lie to them.
  const holdSeqRef = useRef(0);
  const liveHoldRef = useRef(false);
  const liveVoiceEnabled = useSettingsStore((s) => s.liveVoiceEnabled);
  const isRecording = recorderState.isRecording;
  // Voice recording
  const [recordingSecs, setRecordingSecs] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Which voice note is playing, by message id. One at a time: starting a
  // second pauses the first, since two clips over one speaker is noise.
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [revealedAttachments, setRevealedAttachments] = useState<Set<string>>(
    new Set(),
  );
  // URI of the photo currently shown in the full-screen viewer, or null.
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const autoDownloadMedia = useSettingsStore((s) => s.autoDownloadMedia);
  const bridgeEnabled = useSettingsStore((s) => s.bridgeEnabled);
  const undoSendSeconds = useSettingsStore((s) => s.undoSendSeconds);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showSendEcash, setShowSendEcash] = useState(false);
  const [sendingEcash, setSendingEcash] = useState(false);
  // Raw string of the token currently being claimed, so its button can show
  // progress and a double tap cannot start two swaps for the same proofs.
  const [claimingToken, setClaimingToken] = useState<string | null>(null);
  // Tokens already taken into the wallet, so their cards read "Claimed".
  const claimedTokens = useWalletStore((s) => s.claimedTokens);
  const [ecashAmount, setEcashAmount] = useState("");
  const [ecashMemo, setEcashMemo] = useState("");
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [showDMInfo, setShowDMInfo] = useState(false);
  // Channel-message sender profile sheet: tap a message's avatar/name to
  // see who they are and message them, same as tapping a peer on the Mesh
  // tab. Not used in a DM thread (only one other participant there,
  // already reachable via the header).
  const [senderInfoTarget, setSenderInfoTarget] = useState<{
    peerID: string;
    nickname: string;
    // True when opened from the members list, so the sheet shows a back arrow
    // that returns to the list (still open behind it) instead of dismissing.
    fromMembers?: boolean;
  } | null>(null);
  // Channel members list: currently-reachable peers, tap one to open the
  // same profile sheet as tapping their avatar on a message.
  // Notices (bulletin board) sheet for this channel.
  const [showNotices, setShowNotices] = useState(false);
  // A picked attachment held for review before sending, so the user can add a
  // caption (WhatsApp-style) instead of it firing off the instant it is chosen.
  const [pendingAttachment, setPendingAttachment] =
    useState<PendingAttachment | null>(null);
  const [captionDraft, setCaptionDraft] = useState("");
  // Brief delivery status hint shown below the compose bar for DMs.
  // "queued" = no route available; cleared after 4 seconds.
  const [dmStatus, setDmStatus] = useState<"queued" | "no-reach" | null>(null);
  // Brief confirmation pill. Separate from dmStatus: that strip explains why a
  // message has not arrived and belongs above the compose bar; this confirms
  // something the user just did and has to show up wherever they did it,
  // including over the full-screen photo viewer.
  const [toast, setToast] = useState<string | null>(null);
  const dmStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  // Long-press action sheet target.
  const [actionSheet, setActionSheet] = useState<ChatMessage | null>(null);
  // Id of the message whose delivery-info sheet is open (null when closed).
  // Kept as an id, not a snapshot, so the sheet updates live as delivered/read
  // receipts arrive while it is on screen.
  const [infoMessageId, setInfoMessageId] = useState<string | null>(null);
  // Undo Send: a just-sent message is held briefly before it actually
  // transmits, so it can be recalled. The ref holds the live pending record
  // (and its timer) for commit/flush; the state drives the Undo pill.
  const pendingSendRef = useRef<{
    msg: ChatMessage;
    timer: ReturnType<typeof setTimeout>;
    nearbyOnly: boolean;
  } | null>(null);
  const [heldMessage, setHeldMessage] = useState<ChatMessage | null>(null);
  // "Nearby only": keep the next public #bluetooth message off the internet
  // bridge (radio-only), even while bridging is on. Reset after each send.
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [forwardSource, setForwardSource] = useState<ChatMessage | null>(null);
  // Set right after scrolling to a search result, cleared after a brief
  // flash. Not persisted (unlike isStarred), purely a transient UI cue.
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevScrollTrigger = useRef(targetMessageTrigger ?? 0);

  // Clean up recording timer, DM status timer, and any active sound on unmount.
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (dmStatusTimerRef.current) clearTimeout(dmStatusTimerRef.current);
      void audioRecorder.stop().catch(() => {});
    };
  }, [audioRecorder]);

  const msgs = useMemo(() => messages[channel] ?? [], [messages, channel]);
  const isDM = channel.startsWith("dm:");

  // Read receipts for this DM. Best-effort, and a no-op for channels (there is
  // no per-recipient receipt for a broadcast).
  //
  // Gated on the app actually being in the foreground. The thread stays mounted
  // when you switch away, so without this a message arriving while the app is in
  // your pocket would be reported back as "read" - telling the other person you
  // saw something you have not seen. A read receipt is a claim about a human,
  // not about a process, and it is the one piece of presence people notice being
  // wrong. Re-runs when we come back, so opening the app does send the receipts
  // that were correctly withheld.
  const [appActive, setAppActive] = useState(
    () => AppState.currentState === "active",
  );
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) =>
      setAppActive(next === "active"),
    );
    return () => sub.remove();
  }, []);
  useEffect(() => {
    if (isDM && appActive) getMeshService()?.sendReadReceipts(channel.slice(3));
  }, [isDM, channel, msgs, appActive]);

  // Where the reader is in the thread. Refs, not state: these are read inside
  // scroll handlers on every frame and must never themselves cause a render.
  const atBottomRef = useRef(true);
  // True until the reader takes hold of the list, by dragging it or by being
  // sent to a specific message. Until then we are still placing them at the
  // newest message, and every layout measurement the list reports is another
  // chance to do that: opening a thread is not one event, it is one per batch
  // FlatList renders. Treating those as the reader's own position is what made
  // reopening a thread scroll itself down two or three times over.
  const landingRef = useRef(true);
  // Message count the list has already been scrolled for, seeded with what is
  // on screen at mount so the first measurement counts as landing, not as new
  // content. This is what separates "a message arrived" from "the list is still
  // measuring itself".
  const msgCountRef = useRef(msgs.length);
  // The one piece of it the UI needs, so the jump-to-latest pill can appear.
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

  function handleListScroll(e: NativeSyntheticEvent<NativeScrollEvent>): void {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);
    // A tolerance rather than an exact match: momentum, a keyboard resize or a
    // half-pixel layout rounding all leave you a few points short of the true
    // end, and none of them mean the reader has scrolled away.
    const atBottom = distanceFromBottom <= AT_BOTTOM_TOLERANCE;
    atBottomRef.current = atBottom;
    // While still landing, a scroll event is our own placement caught mid-way
    // through the list settling, not the reader moving. Offering to jump to
    // the latest message at that point flashes a pill they never earned.
    if (landingRef.current) return;
    setShowJumpToLatest((shown) => (shown === !atBottom ? shown : !atBottom));
  }

  function jumpToLatest(): void {
    atBottomRef.current = true;
    setShowJumpToLatest(false);
    listRef.current?.scrollToEnd({ animated: true });
  }

  // Open a second bottom sheet once the first has finished sliding out. One
  // pending handoff at a time, and cancelled when the thread goes away: two of
  // these racing would open the wrong sheet, or open one over a thread the user
  // has already left. The action sheet's own close is what this is waiting on,
  // so the delay tracks that animation.
  const handoffTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (handoffTimer.current) clearTimeout(handoffTimer.current);
    },
    [],
  );
  function scheduleSheetHandoff(open: () => void): void {
    if (handoffTimer.current) clearTimeout(handoffTimer.current);
    handoffTimer.current = setTimeout(() => {
      handoffTimer.current = null;
      open();
    }, SHEET_HANDOFF_MS);
  }

  // Opening the keyboard shortens the list without changing its content, so no
  // content-size event fires and the newest messages end up hidden behind the
  // compose bar. Follow the keyboard down to the latest message: you almost
  // always start typing in reply to what you were just reading.
  //
  // Keyed on the keyboard alone. Adding the message count would re-run this for
  // every message that arrives while the keyboard is open, racing the animated
  // scroll against the instant one onContentSizeChange already does for new
  // content - two scrollers fighting over the same list reads as a stutter.
  //
  // Only for a reader already at the bottom, which is the case this exists for:
  // the list got shorter under them and took the newest messages with it. Someone
  // reading further up tapped the composer on purpose and expects to keep looking
  // at what they were looking at.
  useEffect(() => {
    if (keyboardInset <= 0 || !atBottomRef.current) return;
    const id = setTimeout(
      () => listRef.current?.scrollToEnd({ animated: true }),
      50,
    );
    return () => clearTimeout(id);
  }, [keyboardInset]);

  // Scroll to a message and briefly flash it. Shared by search-result jumps
  // and the pinned-messages sheet so both behave identically.
  const scrollToMessage = useCallback(
    (id: string) => {
      const index = msgs.findIndex((m) => m.id === id);
      if (index === -1) return;
      // Being sent to a message ends the landing: the reader is looking at a
      // specific point in the thread now, so nothing may pull them off it.
      landingRef.current = false;
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.3,
      });
      setHighlightedMessageId(id);
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = setTimeout(
        () => setHighlightedMessageId(null),
        1500,
      );
    },
    [msgs],
  );

  // Scroll to a message opened from a search result. Guarded by the same
  // fire-once-per-increment counter pattern used elsewhere in this app (e.g.
  // ChannelList's join-modal trigger) so remounts/re-renders don't re-fire it,
  // but re-tapping the same search result does.
  useEffect(() => {
    if (
      targetMessageTrigger === undefined ||
      targetMessageTrigger <= prevScrollTrigger.current ||
      !targetMessageId
    ) {
      return;
    }
    prevScrollTrigger.current = targetMessageTrigger;
    scrollToMessage(targetMessageId);
  }, [targetMessageTrigger, targetMessageId, scrollToMessage]);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  // Claim an ecash token found inside a received message.
  //
  // This goes through the wallet service rather than writing proofs straight
  // into the store, which is the difference between "the card said 500 sats so
  // we added 500 sats" and actually checking. The service verifies the mint's
  // DLEQ signature offline and refuses a forgery outright, swaps at the mint
  // when there is internet (the only thing that proves the token has not
  // already been spent elsewhere), and otherwise stores it as unconfirmed so
  // the balance stays honest about what it does and does not know.
  async function claimToken(embedded: EmbeddedToken): Promise<void> {
    if (claimingToken !== null) return;
    setClaimingToken(embedded.raw);
    try {
      const result = await receiveToken(embedded.raw, {
        counterparty: dmPeerID ?? channel,
      });
      if (result.outcome === "duplicate") {
        showAlert(
          "Already claimed",
          "Every proof in this token is already in your wallet, so nothing was added.",
        );
        return;
      }
      showAlert(
        `+${result.amount.toLocaleString()} ${result.unit}`,
        result.outcome === "swapped"
          ? `Redeemed at ${hostOf(result.mintUrl)}. It is provably yours now: the sender's copy of this token no longer works.`
          : `Stored from ${hostOf(result.mintUrl)}, but the mint has not confirmed it is unspent yet${result.dleq === "valid" ? " (its signature does check out, so the token is genuine)" : ""}. Refresh from the Wallet tab once you are online.`,
      );
    } catch (err) {
      reportWalletError(err);
    } finally {
      setClaimingToken(null);
    }
  }

  // Show a brief status hint, then auto-clear after 4 seconds.
  function showStatus(kind: "queued" | "no-reach"): void {
    if (dmStatusTimerRef.current) clearTimeout(dmStatusTimerRef.current);
    setDmStatus(kind);
    dmStatusTimerRef.current = setTimeout(() => {
      setDmStatus(null);
    }, 4000);
  }

  function showQueuedStatus(): void {
    showStatus("queued");
  }

  // A channel broadcast that reached no transport at all.
  function showNoReachStatus(): void {
    showStatus("no-reach");
  }

  // Screenshot detection: notify the other side of this conversation (like
  // bitchat) so nobody can silently capture a DM or channel. The notice is a
  // real chat message so it survives even if the recipient is offline right
  // now; our own copy is a local-only system row, never re-broadcast.
  useEffect(() => {
    const subscription = ScreenCapture.addScreenshotListener(() => {
      const text = screenshotNoticeText(localNickname);
      const service = getMeshService();
      if (service) {
        if (isDM) {
          service.sendDm(channel.slice(3), text);
        } else if (isGroup) {
          // Seal the notice under the group key rather than leaking it as a
          // plaintext channel broadcast to everyone in range.
          service.sendGroupMessage(
            channel.slice("group:".length),
            text,
            `${localPeerID}-${Date.now()}`,
          );
        } else {
          service.sendChannelMessage(channel, text);
        }
      }
      addMessage({
        id: `${localPeerID}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        channel,
        senderID: localPeerID,
        senderNickname: localNickname,
        text: "You took a screenshot",
        timestampMs: Date.now(),
        isMine: true,
        isSystem: true,
      });
      showAlert(
        "Heads up",
        isDM
          ? `${resolveDisplayName(channel.slice(3))} was notified that you took a screenshot of this conversation.`
          : "Everyone in this channel was notified that you took a screenshot.",
      );
    });
    return () => subscription.remove();
  }, [channel, isDM, isGroup, localNickname, localPeerID, addMessage]);

  // The real transmission, run when the hold window elapses or is committed.
  // Reads everything from the message and from live getters, so it is safe to
  // call from a stale closure (a fired timer, or the unmount flush).
  function transmit(msg: ChatMessage, nearbyOnly = false): void {
    const setStatus = useChatStore.getState().setMessageStatus;
    const msgChannel = msg.channel;
    const service = getMeshService();
    if (!service) {
      setStatus(msgChannel, msg.id, "failed");
      return;
    }
    if (msgChannel.startsWith("dm:")) {
      const dmPeerID = msgChannel.slice(3);
      // Sending to someone saves them as a contact too, so replying to a DM
      // that started inbound keeps them, not just DMs you initiated.
      useContactsStore
        .getState()
        .saveIfAbsent(
          dmPeerID,
          usePeerStore.getState().getPeer(dmPeerID)?.nickname ??
            resolveDisplayName(dmPeerID),
          usePeerStore.getState().getPeer(dmPeerID)?.noisePubKeyHex ?? "",
        );
      const result = service.sendDm(dmPeerID, msg.text, msg.id);
      // "sent"/"sent-nostr" upgrade to delivered/read via receipts. When no
      // route exists now it is either "carried" (a courier took a sealed copy)
      // or "queued" (held locally for retry); both surface the queued notice.
      setStatus(
        msgChannel,
        msg.id,
        result === "needs-courier"
          ? "carried"
          : result === "queued"
            ? "queued"
            : "sent",
      );
      if (result === "needs-courier" || result === "queued") {
        showQueuedStatus();
      }
    } else if (msgChannel.startsWith("group:")) {
      // Private group: seal under the epoch key and broadcast (0x25).
      const ok = service.sendGroupMessage(
        msgChannel.slice("group:".length),
        msg.text,
        msg.id,
      );
      setStatus(msgChannel, msg.id, ok ? "sent" : "failed");
      if (!ok) showNoReachStatus();
    } else {
      // A channel broadcast that reaches no link and no Nostr cell reaches no
      // one; say so rather than rendering a confident sent bubble.
      const sent = service.sendChannelMessage(msgChannel, msg.text, nearbyOnly);
      const reached = sent.bleLinks > 0 || sent.nostr;
      setStatus(msgChannel, msg.id, reached ? "sent" : "failed");
      if (!reached) showNoReachStatus();
    }
  }

  // Latest transmit, so the unmount flush uses current closures without
  // re-running its effect on every render.
  const transmitRef = useRef(transmit);
  useEffect(() => {
    transmitRef.current = transmit;
  });

  // Commit the held message now: its timer elapsed, a new send started, or the
  // thread is closing.
  function commitHeld(): void {
    const pending = pendingSendRef.current;
    if (!pending) return;
    clearTimeout(pending.timer);
    pendingSendRef.current = null;
    setHeldMessage(null);
    transmit(pending.msg, pending.nearbyOnly);
  }

  // Resend a failed message: flip it back to sending and run the send path,
  // which resets the status on the outcome. Reached by tapping the red failed
  // mark on the bubble. An attachment re-reads its file and re-sends the bytes;
  // a text message runs the same transmit path.
  function handleRetryMessage(item: ChatMessage): void {
    if (item.status !== "failed") return;
    const setStatus = useChatStore.getState().setMessageStatus;
    setStatus(item.channel, item.id, "sending");
    if (item.attachment) {
      const service = getMeshService();
      const att = item.attachment;
      if (!service) {
        setStatus(item.channel, item.id, "failed");
        return;
      }
      void (async () => {
        try {
          const bytes = await new FileSystem.File(att.uri).bytes();
          const reached = service.sendAttachment(item.channel, bytes, {
            type: att.type,
            name: att.name ?? "",
            mimeType: att.mimeType ?? "",
            durationMs: att.durationMs ?? 0,
            // The caption lives on the message text. Without it a retried photo
            // arrived stripped of the words that went with it.
            caption: item.text || undefined,
          });
          setStatus(item.channel, item.id, reached ? "sent" : "failed");
          if (!reached) showNoReachStatus();
        } catch {
          setStatus(item.channel, item.id, "failed");
        }
      })();
      return;
    }
    transmit(item);
  }

  function handleSend(): void {
    let text = draft.trim();
    if (!text) return;
    // Fun IRC-style emotes, matching bitchat: /hug and /slap become an action
    // message both sides see. In a DM the target defaults to the peer; in a
    // channel it comes from a trailing @name.
    const emote = /^\/(hug|slap)(?:\s+(.*))?$/i.exec(text);
    if (emote) {
      const kind = emote[1].toLowerCase();
      const target =
        (emote[2] ?? "").trim().replace(/^@/, "") ||
        (isDM ? resolveDisplayName(channel.slice(3)) : "");
      if (target.length === 0) return; // a channel emote needs a @name
      const emoji = kind === "hug" ? "🫂" : "🐟";
      const action = kind === "hug" ? "hugs" : "slaps";
      const suffix = kind === "slap" ? " around a bit with a large trout" : "";
      text = `* ${emoji} ${localNickname} ${action} ${target}${suffix} *`;
    }
    // At most one message is ever held: commit the previous one first.
    commitHeld();

    const msg: ChatMessage = {
      id: `${localPeerID}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      channel,
      senderID: localPeerID,
      senderNickname: localNickname,
      text,
      timestampMs: Date.now(),
      isMine: true,
      status: "sending",
    };
    // Sending is what creates the conversation. Inbound messages already call
    // addChannel before addMessage; without the same call here, a thread you
    // started yourself (tapping a member in a channel, say) held its messages
    // but never appeared in the DM list, which renders from `channels`.
    // Idempotent, so re-sending in an existing thread is a no-op.
    useChatStore.getState().addChannel(channel);
    addMessage(msg);
    setDraft("");

    // Capture nearby-only at send time (only meaningful on the bridged public
    // channel), then reset the composer flag for the next message.
    const nearby = nearbyOnly && channel === "#bluetooth";
    if (nearbyOnly) setNearbyOnly(false);

    // Undo send is a preference (General settings). When it is off, there is no
    // hold window: transmit right away with no pill. Otherwise hold the message
    // for the chosen number of seconds behind the undo pill.
    if (undoSendSeconds <= 0) {
      transmit(msg, nearby);
      return;
    }
    const timer = setTimeout(commitHeld, undoSendSeconds * 1000);
    pendingSendRef.current = {
      msg,
      timer,
      nearbyOnly: nearby,
    };
    setHeldMessage(msg);
  }

  // Pull the held message back before it transmits, returning its text to the
  // input so it can be edited or discarded.
  function undoSend(): void {
    const pending = pendingSendRef.current;
    if (!pending) return;
    clearTimeout(pending.timer);
    pendingSendRef.current = null;
    setHeldMessage(null);
    useChatStore.getState().removeMessage(pending.msg.channel, pending.msg.id);
    // Only pull the recalled text back into the input when it is empty, so an
    // undo never clobbers a new message the user has started typing since.
    if (draft.trim().length === 0) setDraft(pending.msg.text);
  }

  // Flush a held message when the thread unmounts, so leaving a chat still sends
  // what you typed and never leaves an orphaned timer.
  useEffect(() => {
    return () => {
      const pending = pendingSendRef.current;
      if (pending) {
        clearTimeout(pending.timer);
        pendingSendRef.current = null;
        transmitRef.current(pending.msg, pending.nearbyOnly);
      }
    };
  }, []);

  function handleAttach(): void {
    setShowAttachMenu(true);
  }

  function handleAttachAction(action: AttachAction): void {
    setShowAttachMenu(false);
    switch (action) {
      case "camera":
        void handleCameraAttach();
        break;
      case "library":
        void handleLibraryAttach();
        break;
      case "document":
        void handleDocumentAttach();
        break;
      case "voice":
        void startRecording();
        break;
      case "ecash":
        setShowSendEcash(true);
        break;
    }
  }

  // Send a Cashu token to this DM peer. Identical to the Wallet tab's send and
  // the Mesh tab's peer sheet, because all three call the same transfer
  // service: proof selection, mint fees, and the reservation that makes an
  // undelivered token reclaimable all live there rather than being re-derived
  // per screen.
  async function handleSendEcash(): Promise<void> {
    const amount = parseInt(ecashAmount, 10);
    if (!amount || amount <= 0 || !dmPeerID || sendingEcash) return;

    // Quoting awaits the mint, so a double tap would otherwise start two sends.
    setSendingEcash(true);
    let result;
    try {
      result = await sendEcashToPeer({
        peerID: dmPeerID,
        amount,
        memo: ecashMemo.trim() || undefined,
        senderNickname: localNickname,
      });
    } finally {
      setSendingEcash(false);
    }
    if (!result) return;

    setShowSendEcash(false);
    setEcashAmount("");
    setEcashMemo("");
    // The bubble and its delivery status are already on screen, so the happy
    // path needs no modal. Only the routes that are not immediate delivery are
    // worth interrupting for, because "queued" looks identical to "sent" in the
    // thread and means something quite different.
    if (result.route !== "sent") {
      showAlert(
        `${result.prepared.amount.toLocaleString()} ${result.prepared.unit} on its way`,
        `${describeRoute(result.route)} It stays reclaimable from the Wallet tab until you confirm it arrived.`,
      );
    }
  }

  // Build a local attachment message immediately (instant feedback), then read
  // the file bytes and transmit them over the mesh asynchronously. Defaults to
  // the open thread; forwardMessage() below passes a different target.
  function sendAttachmentMessage(
    type: ChatAttachment["type"],
    uri: string,
    name?: string,
    mimeType?: string,
    durationMs?: number,
    options?: {
      targetChannel?: string;
      forwarded?: boolean;
      sizeBytes?: number;
      caption?: string;
    },
  ): void {
    const targetChannel = options?.targetChannel ?? channel;
    const caption = options?.caption?.trim() ?? "";
    const msg: ChatMessage = {
      id: `${localPeerID}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      channel: targetChannel,
      senderID: localPeerID,
      senderNickname: localNickname,
      // The caption is the message text, so the bubble shows media + caption
      // together and search indexes it, exactly as a received one does.
      text: caption,
      timestampMs: Date.now(),
      isMine: true,
      attachment: {
        type,
        uri,
        name,
        mimeType,
        durationMs,
        sizeBytes: options?.sizeBytes,
      },
      forwarded: options?.forwarded,
    };
    addMessage(msg);

    const service = getMeshService();
    if (!service) return;

    // Read the file bytes and push them through the file-transfer pipeline.
    void (async () => {
      try {
        // expo-file-system 57 removed the legacy readAsStringAsync (it now
        // throws at runtime). The File API reads raw bytes directly, which also
        // drops the base64 -> binary-string -> Uint8Array round-trip this used
        // to do, and that was ~2.4x peak memory for every attachment.
        const bytes = await new FileSystem.File(uri).bytes();
        const reached = service.sendAttachment(targetChannel, bytes, {
          type,
          name: name ?? "",
          mimeType: mimeType ?? "",
          durationMs: durationMs ?? 0,
          caption: caption || undefined,
        });
        // No route right now: mark it failed so the bubble shows the same red,
        // tap-to-retry mark a text message would, rather than a confident card.
        if (!reached) {
          useChatStore
            .getState()
            .setMessageStatus(targetChannel, msg.id, "failed");
          showNoReachStatus();
        }
      } catch (err) {
        // The bubble is already on screen, so mark it failed the way an
        // unreachable send is: the thread should not show a message as sent
        // when nothing left the device.
        useChatStore
          .getState()
          .setMessageStatus(targetChannel, msg.id, "failed");
        // Only our own size messages are fit to show: anything else is a
        // runtime error, and "Maximum call stack size exceeded" tells the
        // sender nothing they can act on.
        showAlert(
          "Attachment not sent",
          err instanceof AttachmentTooLargeError
            ? err.message
            : "Something went wrong reading that file. Try another one.",
        );
      }
    })();
  }

  // Forwarding reuses the existing send pipeline: it's just composing a new
  // message with the original content in a different channel/DM. No protocol
  // changes needed.
  function forwardMessage(source: ChatMessage, targetChannel: string): void {
    if (source.attachment) {
      sendAttachmentMessage(
        source.attachment.type,
        source.attachment.uri,
        source.attachment.name,
        source.attachment.mimeType,
        source.attachment.durationMs,
        // Carry the caption (it lives on the message text) so a forwarded photo
        // keeps its caption, the way it arrived.
        { targetChannel, forwarded: true, caption: source.text || undefined },
      );
      return;
    }
    const msg: ChatMessage = {
      id: `${localPeerID}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      channel: targetChannel,
      senderID: localPeerID,
      senderNickname: localNickname,
      text: source.text,
      timestampMs: Date.now(),
      isMine: true,
      forwarded: true,
    };
    addMessage(msg);
    const service = getMeshService();
    if (!service) return;
    if (targetChannel.startsWith("dm:")) {
      service.sendDm(targetChannel.slice(3), source.text);
    } else {
      service.sendChannelMessage(targetChannel, source.text);
    }
  }

  function handleLongPressMessage(item: ChatMessage): void {
    setActionSheet(item);
  }

  function handlePressSender(item: ChatMessage): void {
    setSenderInfoTarget({
      peerID: item.senderID,
      nickname: item.senderNickname,
    });
  }

  function handleMessageSender(): void {
    if (!senderInfoTarget) return;
    const { peerID, nickname } = senderInfoTarget;
    // Messaging someone from a channel saves them as a contact, the same as
    // messaging a peer from the Mesh tab. Unverified until a QR card confirms.
    useContactsStore
      .getState()
      .saveIfAbsent(
        peerID,
        nickname,
        usePeerStore.getState().getPeer(peerID)?.noisePubKeyHex ?? "",
      );
    const dmChannel = `dm:${peerID}`;
    addChannel(dmChannel);
    setSenderInfoTarget(null);
    onNavigateToChannel(dmChannel);
  }

  async function handleCameraAttach(): Promise<void> {
    const granted = await ensurePermission(
      () => ImagePicker.getCameraPermissionsAsync(),
      () => ImagePicker.requestCameraPermissionsAsync(),
      { label: "Camera access", purpose: "take a photo to send" },
    );
    if (!granted) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      quality: UPLOAD_QUALITY_VALUES[useSettingsStore.getState().uploadQuality],
      allowsEditing: false,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const type: ChatAttachment["type"] =
      asset.type === "video" ? "video" : "image";
    setCaptionDraft("");
    setPendingAttachment({
      type,
      uri: asset.uri,
      name: asset.fileName ?? (type === "video" ? "video.mp4" : "photo.jpg"),
      mimeType: asset.mimeType,
    });
  }

  async function handleLibraryAttach(): Promise<void> {
    const granted = await ensurePermission(
      () => ImagePicker.getMediaLibraryPermissionsAsync(),
      () => ImagePicker.requestMediaLibraryPermissionsAsync(),
      { label: "Photo access", purpose: "pick a photo or video to send" },
    );
    if (!granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: UPLOAD_QUALITY_VALUES[useSettingsStore.getState().uploadQuality],
      allowsEditing: false,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const type: ChatAttachment["type"] =
      asset.type === "video" ? "video" : "image";
    setCaptionDraft("");
    setPendingAttachment({
      type,
      uri: asset.uri,
      name: asset.fileName ?? (type === "video" ? "video.mp4" : "photo.jpg"),
      mimeType: asset.mimeType,
    });
  }

  async function handleDocumentAttach(): Promise<void> {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setCaptionDraft("");
    setPendingAttachment({
      type: "document",
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType,
      sizeBytes: asset.size ?? undefined,
    });
  }

  // Send the staged attachment with its (optional) caption, then clear the
  // composer. The caption rides the file packet, so media + caption arrive as
  // one message.
  //
  // A photo is resized first. A camera file is measured in megabytes and the
  // mesh takes 512 KiB, so without this step the common case (open camera, take
  // a picture, send it) could not work at all. The sheet closes straight away
  // and the bubble appears when the resize lands, which is the ordering every
  // messenger uses; the resize never throws, so a photo it cannot read simply
  // goes on as it was.
  function confirmPendingAttachment(): void {
    const p = pendingAttachment;
    if (p === null) return;
    const caption = captionDraft;
    setPendingAttachment(null);
    setCaptionDraft("");

    if (p.type !== "image") {
      sendAttachmentMessage(p.type, p.uri, p.name, p.mimeType, undefined, {
        sizeBytes: p.sizeBytes,
        caption,
      });
      return;
    }
    void (async () => {
      const ready = await prepareImageForSend(
        p.uri,
        p.name,
        p.mimeType,
        UPLOAD_QUALITY_VALUES[useSettingsStore.getState().uploadQuality],
      );
      sendAttachmentMessage(
        "image",
        ready.uri,
        ready.name,
        ready.mimeType,
        undefined,
        { sizeBytes: ready.sizeBytes, caption },
      );
    })();
  }

  function cancelPendingAttachment(): void {
    setPendingAttachment(null);
    setCaptionDraft("");
  }

  // Hold the mic. One gesture, and the app picks the delivery that the mesh can
  // actually manage right now:
  //
  //   live burst   when the native audio module exists, somebody is in
  //                Bluetooth range to hear it, and live voice is switched on
  //   voice note   otherwise, exactly as before
  //
  // The choice is made per press rather than once at startup, because the thing
  // it depends on (is anyone in range) changes as people walk around.
  // Write the finished burst to the attachment cache and send it the way any
  // voice note is sent. Best-effort throughout: the live audio already went
  // out, so a failure here costs the record of the message, not the message.
  async function sendLiveBurstAsNote(
    bytes: Uint8Array,
    durationMs: number,
  ): Promise<void> {
    try {
      const file = new FileSystem.File(
        FileSystem.Paths.cache,
        `airhop_${String(Date.now())}_voice.aac`,
      );
      file.create({ overwrite: true, intermediates: true });
      file.write(bytes);
      sendAttachmentMessage(
        "voice",
        file.uri,
        "voice.aac",
        "audio/aac",
        durationMs,
      );
    } catch {
      // Cache full or unwritable. Nothing to tell the user: they were heard.
    }
  }

  async function handleTalkStart(): Promise<void> {
    // Opening the mic is not instant: a permission prompt can sit on screen for
    // seconds, and the audio session itself takes a moment. A finger can be
    // long gone by the time either finishes, so every press takes a number and
    // anything that resolves against an older one is discarded. Without this, a
    // quick tap left the microphone open and streaming with nothing held down.
    const hold = holdSeqRef.current + 1;
    holdSeqRef.current = hold;
    setIsPTTActive(true);

    const service = getMeshService();
    const canGoLive = service?.canSendLiveVoice(channel) === true;
    if (!canGoLive) {
      await startRecording();
      return;
    }
    const granted = await ensurePermission(
      () => AudioModule.getRecordingPermissionsAsync(),
      () => AudioModule.requestRecordingPermissionsAsync(),
      { label: "Microphone access", purpose: "talk to people nearby" },
    );
    if (hold !== holdSeqRef.current) return; // let go while the prompt was up
    if (!granted) {
      setIsPTTActive(false);
      return;
    }
    const live = await service.startVoiceBurst(channel, () => {
      // Capture died under us (a call took the mic). Close the burst and drop
      // the live state so the HUD does not claim to still be transmitting.
      liveHoldRef.current = false;
      setIsTalkingLive(false);
      setIsPTTActive(false);
      setToast("Recording stopped");
    });
    if (hold !== holdSeqRef.current) {
      // Released while the mic was opening. Close it now rather than leaving a
      // burst running that nobody is holding.
      if (live) await service.stopVoiceBurst();
      return;
    }
    if (live) {
      liveHoldRef.current = true;
      setIsTalkingLive(true);
      setRecordingSecs(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSecs((s) => s + 1);
      }, 1000);
      return;
    }
    // Live was offered and could not start. Fall back rather than dropping the
    // press: the user held the button and expects to have said something.
    await startRecording();
  }

  async function handleTalkEnd(): Promise<void> {
    // Invalidate any start still in flight, so a burst that opens after this
    // point closes itself instead of running on.
    holdSeqRef.current += 1;
    setIsPTTActive(false);
    // The ref, not the state: this handler can be a render behind, and being
    // wrong here means either a stuck microphone or a voice note that never
    // sends.
    if (!liveHoldRef.current) {
      await stopRecording();
      return;
    }
    liveHoldRef.current = false;
    setIsTalkingLive(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecordingSecs(0);
    const finalized = await getMeshService()?.stopVoiceBurst();
    // The same audio, now as an ordinary voice note. People in range heard it
    // live; this is what reaches anyone who was not, and what stays in the
    // thread afterwards. It rides the existing attachment path, so it is a
    // normal message row with a normal bubble and needs no special handling on
    // either end. Too short to be worth sending is treated as a slip of the
    // finger rather than a message.
    if (finalized && finalized.durationMs >= MIN_BURST_KEEP_MS) {
      await sendLiveBurstAsNote(finalized.bytes, finalized.durationMs);
    }
  }

  // Who is talking right now, for the floor-courtesy hint. Resolved to a
  // display name here so the button can say it.
  useEffect(() => {
    const service = getMeshService();
    if (!service) return;
    return service.setPttActivityListener((talkers) => {
      const first = talkers[0];
      setLiveTalker(first === undefined ? null : resolveDisplayName(first));
    });
  }, []);

  // Whether the next hold will go live, so the button can show which it is.
  // Re-checked as peers come and go: in a DM it depends on that peer having a
  // session and a link, in a room on anyone being in range at all.
  const [liveAvailable, setLiveAvailable] = useState(false);
  useEffect(() => {
    function sample(): void {
      setLiveAvailable(getMeshService()?.canSendLiveVoice(channel) === true);
    }
    sample();
    const timer = setInterval(sample, LIVE_AVAILABILITY_POLL_MS);
    return () => clearInterval(timer);
  }, [channel, liveVoiceEnabled]);

  // Inbound bursts only make sound while this conversation is what the user is
  // actually looking at, with the app in front of them. Anything else and the
  // burst is tracked but silent, so audio never starts from a screen nobody is
  // on. Cleared on unmount, which covers leaving the thread entirely.
  useEffect(() => {
    const service = getMeshService();
    if (!service) return;
    service.setLiveVoiceAudible(appActive);
    return () => service.setLiveVoiceAudible(false);
  }, [appActive, channel]);

  // Nothing may keep the microphone open once this screen is not in front of
  // the user. Backgrounding the app, taking a call, or navigating away while
  // still holding the button all land here, and all of them end the burst with
  // a proper END so the far side hears a finish rather than the audio simply
  // stopping and timing out. Live voice is foreground-only by design.
  useEffect(() => {
    if (appActive) return;
    if (!liveHoldRef.current) return;
    holdSeqRef.current += 1;
    liveHoldRef.current = false;
    setIsTalkingLive(false);
    setIsPTTActive(false);
    void getMeshService()?.stopVoiceBurst();
  }, [appActive]);

  useEffect(
    () => () => {
      // Unmount: the thread is gone, so there is nobody to finalize a note for.
      // End the burst anyway rather than leaving a live microphone behind.
      if (liveHoldRef.current) {
        liveHoldRef.current = false;
        void getMeshService()?.stopVoiceBurst();
      }
    },
    [],
  );

  async function startRecording(): Promise<void> {
    const granted = await ensurePermission(
      () => AudioModule.getRecordingPermissionsAsync(),
      () => AudioModule.requestRecordingPermissionsAsync(),
      { label: "Microphone access", purpose: "record a voice note" },
    );
    if (!granted) return;
    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setRecordingSecs(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSecs((s) => s + 1);
      }, 1000);
    } catch {
      // Hand the session back before bailing out. Leaving allowsRecording on
      // keeps iOS in play-and-record, which routes playback to the earpiece:
      // one failed recording and every voice note afterwards sounds broken,
      // with nothing on screen to explain why.
      await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
      showAlert(
        "Error",
        "Could not start recording. Check microphone permissions.",
      );
    }
  }

  async function stopRecording(): Promise<void> {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    const duration = recordingSecs;
    setRecordingSecs(0);
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      if (!uri) return;
      // audio/mp4 is bitchat's name for AAC-in-MP4, which is what the recorder
      // produces. The old "audio/x-m4a" is not on either client's allow-list,
      // so every voice note was refused on arrival while looking sent here.
      sendAttachmentMessage(
        "voice",
        uri,
        "voice.m4a",
        "audio/mp4",
        duration * 1000,
      );
    } catch {
      // Discard on error.
    } finally {
      // Always, even if stop() threw: an audio session left in record mode
      // sends every later playback to the earpiece instead of the speaker.
      await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
    }
  }

  async function cancelRecording(): Promise<void> {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecordingSecs(0);
    await audioRecorder.stop().catch(() => {});
    await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
  }

  function handleInvite(): void {
    // A tappable deep link that opens Airhop and joins this exact channel. For a
    // private channel the link carries its encryption key, so the invitee can
    // both join and read; a public channel's link has no key.
    const chat = useChatStore.getState();
    const key = chat.channelKeys[channel];
    const overNostr = chat.channelReach[channel] === "ble+nostr";
    void Share.share({
      message: `Join me in ${channel} on Airhop - offline-first, private mesh messaging.\n\n${channelInviteLink(channel, key, overNostr)}`,
    });
  }

  function renderAttachmentBubble(
    attachment: ChatAttachment,
    messageId: string,
    isMine: boolean,
  ): React.JSX.Element {
    switch (attachment.type) {
      case "image": {
        if (!attachment.uri) {
          return (
            <View style={styles.attachImagePlaceholder}>
              <Feather name="image" size={28} color={Colors.textMuted} />
              <Text style={styles.attachImagePlaceholderText}>
                {attachment.name ?? "Image"}
              </Text>
            </View>
          );
        }
        // Auto-download off: incoming photos stay collapsed behind a tap
        // instead of rendering inline immediately. Own sent photos always
        // show since they're already local.
        const revealed =
          isMine || autoDownloadMedia || revealedAttachments.has(messageId);
        if (!revealed) {
          return (
            <Pressable
              style={styles.attachImagePlaceholder}
              onPress={() =>
                setRevealedAttachments((prev) => {
                  const next = new Set(prev);
                  next.add(messageId);
                  return next;
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Tap to load photo"
            >
              <Feather name="image" size={28} color={Colors.textMuted} />
              <Text style={styles.attachImagePlaceholderText}>
                Tap to load photo
              </Text>
            </Pressable>
          );
        }
        // Tap a loaded photo to view it full-screen, the standard gesture in
        // WhatsApp / Signal / Telegram.
        return (
          <ImageAttachment
            uri={attachment.uri}
            onPress={() => setFullscreenImage(attachment.uri)}
          />
        );
      }
      case "voice": {
        // Keyed by the message, not the file. Forwarding a voice note reuses
        // the same cached file, so two bubbles could share a uri and both play
        // at once off a single tap.
        const isPlaying = playingMessageId === messageId;
        return (
          <VoiceNoteBubble
            uri={attachment.uri}
            durationMs={attachment.durationMs ?? 0}
            isPlaying={isPlaying}
            isMine={isMine}
            onToggle={() =>
              setPlayingMessageId((current) =>
                current === messageId ? null : messageId,
              )
            }
            onFinished={() => setPlayingMessageId(null)}
          />
        );
      }
      case "document":
        // Tapping opens the OS share/open sheet. Without this a received
        // document was a dead label: the bytes arrived and there was no way
        // to reach them.
        return (
          <Pressable
            style={styles.attachDoc}
            onPress={() => void openAttachment(attachment)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${attachment.name ?? "document"}`}
          >
            <View style={styles.attachDocIcon}>
              <Feather
                name="file-text"
                size={20}
                color={Colors.textSecondary}
              />
            </View>
            <View style={styles.attachDocInfo}>
              <Text
                style={[
                  styles.attachDocName,
                  isMine ? styles.textOnMyBubble : styles.textOnTheirBubble,
                ]}
                numberOfLines={2}
              >
                {attachment.name ?? "Document"}
              </Text>
              {docSubtitle(attachment) !== null && (
                <Text
                  style={[
                    styles.attachDocMeta,
                    isMine ? styles.textOnMyBubble : styles.textOnTheirBubble,
                  ]}
                  numberOfLines={1}
                >
                  {docSubtitle(attachment)}
                </Text>
              )}
            </View>
            <Feather name="external-link" size={14} color={Colors.textMuted} />
          </Pressable>
        );
      case "video": {
        // Same reveal pattern as images: a received video shows a poster with a
        // play badge and only mounts the (heavy) player once tapped. Own videos
        // and auto-download show the player straight away. There is no thumbnail
        // generation, so the poster is a neutral surface plus the universal play
        // affordance rather than a frame grab.
        const videoRevealed =
          isMine || autoDownloadMedia || revealedAttachments.has(messageId);
        if (!videoRevealed) {
          return (
            <Pressable
              style={styles.attachVideoPoster}
              onPress={() =>
                setRevealedAttachments((prev) => new Set(prev).add(messageId))
              }
              accessibilityRole="button"
              accessibilityLabel="Tap to load video"
            >
              <View style={styles.attachVideoPlayBadge}>
                <Feather name="play" size={20} color={Colors.textPrimary} />
              </View>
              <Text style={styles.attachImagePlaceholderText}>
                Tap to load video
              </Text>
            </Pressable>
          );
        }
        return <VideoAttachment uri={attachment.uri} />;
      }
    }
  }

  // Hand a received file to the OS so the user can view or save it.
  // expo-sharing is used rather than Linking.openURL because Android blocks
  // direct file:// URIs from other apps. Sharing goes through a FileProvider
  // and works on both platforms.
  // Get an attachment out of Airhop and onto the device.
  //
  // Received files live in the app's private cache: cleared with the cache,
  // gone on uninstall, and invisible to every other app. Documents already had
  // a way out (the share sheet, below); a photo or video did not, so the one
  // thing people actually want to keep was the one thing trapped in here.
  //
  // Photos and videos go to the system gallery, which is where someone looks
  // for them. Everything else has no gallery to go to, so it gets the share
  // sheet, which can hand it to Files, a mail app, or anything else installed.
  async function saveAttachmentToDevice(
    attachment: ChatAttachment,
  ): Promise<void> {
    if (attachment.type !== "image" && attachment.type !== "video") {
      await openAttachment(attachment);
      return;
    }
    const granted = await ensurePermission(
      () => MediaLibrary.getPermissionsAsync(true),
      () => MediaLibrary.requestPermissionsAsync(true),
      { label: "Photo access", purpose: "save this to your photos" },
    );
    if (!granted) return;
    try {
      await MediaLibrary.saveToLibraryAsync(attachment.uri);
      setToast(
        attachment.type === "video"
          ? "Saved to your videos"
          : "Saved to your photos",
      );
    } catch {
      showAlert(
        "Not saved",
        "The file could not be saved. It may have been cleared from the cache.",
      );
    }
  }

  async function openAttachment(attachment: ChatAttachment): Promise<void> {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        showAlert(
          "Can't open file",
          "This device has no app available to open or share this file.",
        );
        return;
      }
      await Sharing.shareAsync(attachment.uri, {
        mimeType: attachment.mimeType,
        dialogTitle: attachment.name ?? "Attachment",
      });
    } catch {
      showAlert(
        "Can't open file",
        "The file could not be opened. It may have been cleared from the cache.",
      );
    }
  }

  function renderTokenCard(
    token: EmbeddedToken,
    isMine: boolean,
  ): React.JSX.Element {
    return (
      <View style={styles.paymentCard}>
        <View style={styles.paymentCardHeader}>
          <Feather name="zap" size={17} color={Colors.accent} />
          <Text style={styles.paymentCardAmount}>
            {token.info.amount.toLocaleString()} {token.info.unit}
          </Text>
        </View>
        <Text style={styles.paymentCardMint} numberOfLines={1}>
          {token.info.mintUrl.replace(/https?:\/\//, "")}
        </Text>
        {token.info.memo ? (
          <Text style={styles.paymentCardMemo}>{token.info.memo}</Text>
        ) : null}
        {/* Nothing to claim on a token you sent: your copy of those proofs is
            already reserved against the pending send. */}
        {!isMine &&
          (isTokenClaimed(token) ? (
            <View style={styles.paymentCardClaimed}>
              <Feather name="check" size={13} color={Colors.online} />
              <Text style={styles.paymentCardClaimedText}>Claimed</Text>
            </View>
          ) : (
            <Pressable
              style={[
                styles.paymentCardClaim,
                claimingToken !== null && styles.paymentCardClaimBusy,
              ]}
              disabled={claimingToken !== null}
              onPress={() => void claimToken(token)}
              accessibilityRole="button"
              accessibilityLabel={`Claim ${token.info.amount.toLocaleString()} ${token.info.unit}`}
            >
              <Text style={styles.paymentCardClaimText}>
                {claimingToken === token.raw ? "Claiming…" : "Claim"}
              </Text>
            </Pressable>
          ))}
      </View>
    );
  }

  // A token is "claimed" once its proofs have been taken into the wallet.
  // Matched on the first proof's secret, which the store records on claim,
  // because after an online swap the proofs themselves are replaced and can no
  // longer be found in the balance.
  function isTokenClaimed(token: EmbeddedToken): boolean {
    const first = token.info.token.proofs[0]?.secret;
    return first !== undefined && claimedTokens.includes(first);
  }

  function formatTime(ms: number): string {
    const d = new Date(ms);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Show a date separator when consecutive messages are from different days.
  function needsDateSeparator(idx: number): boolean {
    if (idx === 0) return true;
    const cur = new Date(msgs[idx].timestampMs);
    const prev = new Date(msgs[idx - 1].timestampMs);
    return (
      cur.getDate() !== prev.getDate() ||
      cur.getMonth() !== prev.getMonth() ||
      cur.getFullYear() !== prev.getFullYear()
    );
  }

  // Date separator label, following what every messenger settles on: the two
  // days people think of by name, then the weekday while "last Tuesday" is
  // still a useful handle, then a plain date.
  //
  // The date always carries the year. Without it a thread from last July and one
  // from this July render identically, which is the one case a separator exists
  // to prevent.
  function formatDateSeparator(ms: number): string {
    const d = new Date(ms);
    const now = new Date();
    const days = daysBetween(d, now);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    // Inside the last week a weekday name still locates the message. Past that
    // it stops meaning anything, since "Monday" could be any Monday.
    if (days < 7) return d.toLocaleDateString([], { weekday: "long" });
    return d.toLocaleDateString([], {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  const displayName = channel.startsWith("dm:")
    ? resolveDisplayName(channel.slice(3))
    : isGroup
      ? (groupName ?? "Group")
      : channel;

  return (
    // Padding, not KeyboardAvoidingView: Android is edge-to-edge, so the window
    // never shrinks for the IME and KAV's Android path (which waits for that
    // resize) left the compose bar buried under the keyboard. Measuring the IME
    // and padding by it works identically on both platforms. The inset is the
    // keyboard height minus the bottom safe-area, because the thread already
    // sits above the nav bar inside the app's root SafeAreaView.
    <View style={[styles.container, { paddingBottom: keyboardInset }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={
            backUnreadCount > 0
              ? `Go back, ${backUnreadCount} unread`
              : "Go back"
          }
        >
          <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
          {backUnreadCount > 0 && (
            <View style={styles.backBadge}>
              <Text style={styles.backBadgeText}>
                {backUnreadCount > 99 ? "99+" : String(backUnreadCount)}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={styles.headerCenter}
          onPress={() => {
            if (!isDM) setShowChannelInfo(true);
            else setShowDMInfo(true);
          }}
          accessibilityRole="button"
          accessibilityLabel={
            isDM ? `View info for ${displayName}` : `View info for ${channel}`
          }
        >
          {isDM ? (
            // DM: avatar + name, left-aligned right after the back arrow.
            <View style={styles.headerDmId}>
              <Avatar
                username={resolveDisplayName(channel.slice(3))}
                peerID={channel.slice(3)}
                size={28}
                presence={isDMPeerOnline ? "online" : "offline"}
              />
              <Text style={styles.channelTitle} numberOfLines={1}>
                {displayName}
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.channelTitle} numberOfLines={1}>
                {isGroup ? displayName : channelLabel}
              </Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {isGroup
                  ? `${memberCount} member${memberCount !== 1 ? "s" : ""}`
                  : channelSubtitle}
              </Text>
            </>
          )}
        </Pressable>

        {/* Channel actions, on one track: the same pill the notice composer's
            expiry steps sit in, so a row of icon buttons is spaced and shaped
            the way every other cluster of small controls in the app is. Only
            channels have these, so the pill is absent (not empty) elsewhere. */}
        {!isDM && !isGroup && (
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerAction}
              onPress={openNotices}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityRole="button"
              accessibilityLabel={
                unseenNotices > 0
                  ? `Notices for this channel, ${String(unseenNotices)} new`
                  : "Notices for this channel"
              }
            >
              <MaterialCommunityIcons
                name="bulletin-board"
                size={18}
                color={Colors.textSecondary}
              />
              {unseenNotices > 0 && <View style={styles.noticeDot} />}
            </Pressable>
            {/* Hairline between the two, so the track reads as two buttons
                rather than one wide one. */}
            <View style={styles.headerActionDivider} />
            <Pressable
              style={styles.headerAction}
              onPress={handleInvite}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityRole="button"
              accessibilityLabel="Invite someone to this channel"
            >
              <Feather
                name="user-plus"
                size={18}
                color={Colors.textSecondary}
              />
            </Pressable>
          </View>
        )}
      </View>

      {/* Peer offline notice: shown in DM threads when the peer is not in
          Bluetooth range. The copy is transport-honest: if we can still reach
          them over the internet, say so, rather than implying delivery waits on
          them coming back into range. */}
      {isDM && !isDMPeerOnline && (
        <View style={styles.peerOfflineBanner}>
          <Feather
            name={dmInternetReachable ? "globe" : "wifi-off"}
            size={12}
            color={Colors.textMuted}
          />
          <Text style={styles.peerOfflineBannerText}>
            {dmInternetReachable
              ? "Not in Bluetooth range. Delivering over the internet."
              : "Not nearby. We'll deliver when they're back in range or online."}
          </Text>
        </View>
      )}

      {/* Messages. Wrapped so the jump-to-latest pill can float over the end of
          the list rather than taking a row in the column and shoving the
          compose bar around as it comes and goes. */}
      <View style={styles.listWrap}>
        <FlatList
          ref={listRef}
          data={msgs}
          keyExtractor={(item) => item.id}
          // Keep a long thread cheap to update: render fewer rows per batch and
          // keep a smaller window mounted, so a keyboard toggle or a new message
          // doesn't churn the whole list. The bubble itself is memoized.
          initialNumToRender={20}
          maxToRenderPerBatch={12}
          windowSize={11}
          updateCellsBatchingPeriod={50}
          renderItem={({ item, index }) => {
            const showAvatar = !item.isMine;
            const isFirstFromSender =
              index === 0 ||
              (msgs[index - 1]?.senderID ?? "") !== item.senderID;
            // Only LOCALLY generated notices render as a system row.
            //
            // This used to also sniff the text for "took a screenshot", which
            // meant any peer could forge a system row just by typing that phrase
            // and worse, the branch below substitutes a canned string for
            // non-mine messages, so an ordinary sentence like "I took a
            // screenshot of the map" had its real content silently replaced.
            // A peer's screenshot notice now renders as the normal message it
            // actually is; a trustworthy version needs a protocol signal, not a
            // substring match on user text.
            const isSystemRow = item.isSystem === true;

            if (isSystemRow) {
              return (
                <View>
                  {needsDateSeparator(index) && (
                    <View style={styles.dateSeparator}>
                      <View style={styles.dateLine} />
                      <Text style={styles.dateLabel}>
                        {formatDateSeparator(item.timestampMs)}
                      </Text>
                      <View style={styles.dateLine} />
                    </View>
                  )}
                  <View style={styles.systemRow}>
                    <Feather name="camera" size={12} color={Colors.textMuted} />
                    <Text style={styles.systemRowText}>{item.text}</Text>
                  </View>
                </View>
              );
            }

            // IRC-style emote (/hug, /slap): a real message wrapped in "* … *",
            // rendered centered and italic like an action rather than a bubble.
            const isEmoteRow =
              item.isSystem !== true &&
              item.attachment === undefined &&
              /^\* .+ \*$/.test(item.text);
            if (isEmoteRow) {
              return (
                <View>
                  {needsDateSeparator(index) && (
                    <View style={styles.dateSeparator}>
                      <View style={styles.dateLine} />
                      <Text style={styles.dateLabel}>
                        {formatDateSeparator(item.timestampMs)}
                      </Text>
                      <View style={styles.dateLine} />
                    </View>
                  )}
                  <View style={styles.systemRow}>
                    <Text style={styles.emoteText}>
                      {item.text.replace(/^\* /, "").replace(/ \*$/, "")}
                    </Text>
                  </View>
                </View>
              );
            }

            // Compute the token list once and suppress raw text when the
            // entire message is a Cashu token (no extra prose).
            const tokens = mayContainToken(item.text)
              ? findTokensInText(item.text)
              : [];
            const isPureToken =
              tokens.length > 0 && tokens[0]!.raw.trim() === item.text.trim();

            return (
              <View>
                {needsDateSeparator(index) && (
                  <View style={styles.dateSeparator}>
                    <View style={styles.dateLine} />
                    <Text style={styles.dateLabel}>
                      {formatDateSeparator(item.timestampMs)}
                    </Text>
                    <View style={styles.dateLine} />
                  </View>
                )}
                <MessageBubble
                  item={item}
                  showAvatar={showAvatar}
                  isFirstFromSender={isFirstFromSender}
                  tokens={tokens}
                  isPureToken={isPureToken}
                  renderToken={(token) => renderTokenCard(token, item.isMine)}
                  renderAttachment={(attachment) =>
                    renderAttachmentBubble(attachment, item.id, item.isMine)
                  }
                  formatTime={formatTime}
                  onLongPress={handleLongPressMessage}
                  onRetry={handleRetryMessage}
                  onPressSender={isDM ? undefined : handlePressSender}
                  highlighted={item.id === highlightedMessageId}
                />
              </View>
            );
          }}
          onScroll={handleListScroll}
          // The reader taking hold of the list ends the landing: from here on
          // their position is theirs, and only being at the bottom brings the
          // thread along with new messages.
          onScrollBeginDrag={() => {
            landingRef.current = false;
          }}
          // 16ms would fire this every frame; 100 is plenty to know which end of
          // the thread someone is reading, and costs a fraction as much.
          scrollEventThrottle={100}
          onContentSizeChange={() => {
            // Suppressed while a search-result message is flashed: a stray
            // content-size event (e.g. an image finishing layout) would
            // otherwise yank the view back to the bottom mid-flash.
            if (highlightedMessageId || msgs.length === 0) return;

            // Did the thread gain a message, or is the list only measuring
            // itself? That is the whole question here, and the rule that
            // answers it lives in resolveThreadScroll.
            const countChanged = msgs.length !== msgCountRef.current;
            msgCountRef.current = msgs.length;

            const scroll = resolveThreadScroll({
              landing: landingRef.current,
              atBottom: atBottomRef.current,
              countChanged,
            });
            if (scroll === "none") return;
            listRef.current?.scrollToEnd({ animated: scroll === "animated" });
            // Keep the flag honest: content that grew between our scroll and
            // the throttled scroll event it triggers would otherwise report the
            // reader as having moved away from a bottom they never left.
            if (landingRef.current) atBottomRef.current = true;
          }}
          onScrollToIndexFailed={(info) => {
            // Bubble heights vary (attachments/tokens/multi-line text), so
            // scrollToIndex can fail before layout has measured that far.
            // Jump to the estimated offset, then retry once layout catches up.
            listRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: false,
            });
            setTimeout(() => {
              const index = msgs.findIndex((m) => m.id === targetMessageId);
              if (index !== -1) {
                listRef.current?.scrollToIndex({
                  index,
                  animated: true,
                  viewPosition: 0.3,
                });
              }
            }, 100);
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySubtitle}>
                {isDM
                  ? "Start an encrypted conversation."
                  : `Say something in ${channel}.`}
              </Text>
            </View>
          }
          contentContainerStyle={styles.list}
        />

        {/* Jump to latest: only while the reader is away from the end, so it is
            an offer rather than permanent chrome. This is the other half of not
            auto-scrolling - without a way back, "we left you where you were"
            turns into "we stranded you". */}
        {showJumpToLatest && msgs.length > 0 && (
          <Pressable
            style={styles.jumpToLatest}
            onPress={jumpToLatest}
            accessibilityRole="button"
            accessibilityLabel="Jump to latest message"
          >
            <Feather name="chevron-down" size={20} color={Colors.textPrimary} />
          </Pressable>
        )}
      </View>

      {/* Delivery hints. "queued" means a DM is held for later retry; "no-reach"
          means a channel broadcast found no peers and no internet cell, so it
          genuinely went nowhere. */}
      {isDM && dmStatus === "queued" && (
        <View style={styles.dmStatusBar}>
          <Feather name="clock" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>
            {
              "Can't reach them right now. Message will send when a route is available."
            }
          </Text>
        </View>
      )}
      {!isDM && dmStatus === "no-reach" && (
        <View style={styles.dmStatusBar}>
          <Feather name="alert-circle" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>
            No peers nearby - nobody received this yet
          </Text>
        </View>
      )}

      {/* Full-screen photo viewer. Tap anywhere or the close button to dismiss. */}
      <Modal
        visible={fullscreenImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenImage(null)}
      >
        <Pressable
          style={styles.fullscreenBackdrop}
          onPress={() => setFullscreenImage(null)}
        >
          {fullscreenImage !== null && (
            <Image
              source={{ uri: fullscreenImage }}
              style={styles.fullscreenImage}
              resizeMode="contain"
              accessibilityLabel="Photo"
            />
          )}
          <Pressable
            style={styles.fullscreenClose}
            onPress={() => setFullscreenImage(null)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Close photo"
          >
            <Feather name="x" size={24} color="#FFFFFF" />
          </Pressable>
          {/* Save and share, where someone is already looking at the photo.
              Both act on the file as it arrived, untouched. */}
          {fullscreenImage !== null && (
            <View style={styles.fullscreenActions}>
              <Pressable
                style={styles.fullscreenAction}
                onPress={() =>
                  void saveAttachmentToDevice({
                    type: "image",
                    uri: fullscreenImage,
                  })
                }
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Save photo to your photos"
              >
                <Feather name="download" size={22} color="#FFFFFF" />
              </Pressable>
              <Pressable
                style={styles.fullscreenAction}
                onPress={() =>
                  void openAttachment({ type: "image", uri: fullscreenImage })
                }
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Share photo"
              >
                <Feather name="share-2" size={22} color="#FFFFFF" />
              </Pressable>
            </View>
          )}
          {/* Inside the Modal on purpose: a toast mounted in the thread below
              would be behind this viewer, so saving from here would look like
              it did nothing. Lifted clear of the action row. */}
          <Toast
            message={toast}
            onHide={() => setToast(null)}
            bottomOffset={112}
          />
        </Pressable>
      </Modal>

      {/* Same pill for a save made from the thread itself (the long-press
          menu), floated above the compose bar. */}
      <Toast message={toast} onHide={() => setToast(null)} bottomOffset={88} />

      {/* Live attachment transfers for this thread: one card each, sending or
          receiving, with percent, speed and time remaining. */}
      <TransferProgressList channel={channel} />

      {/* Undo Send window for the message currently being held. Keyed by message
          id so a rapid second send remounts the pill and its countdown restarts
          fresh, in sync with the new hold window, instead of continuing the
          previous (already-drained) animation. */}
      {heldMessage && (
        <UndoSendPill
          key={heldMessage.id}
          onUndo={undoSend}
          Colors={Colors}
          durationMs={undoSendSeconds * 1000}
        />
      )}

      {/* "/" command picker: appears while typing a slash command, tap to
          insert it (with a trailing space, so a DM can send straight away and a
          channel is ready for the @name). Same shell as the @-mention picker. */}
      {slashMatches.length > 0 && (
        <View style={styles.mentionBar}>
          <ScrollView
            style={styles.mentionList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {slashMatches.map((c) => (
              <Pressable
                key={c.cmd}
                style={styles.slashRow}
                onPress={() => setDraft(`/${c.cmd} `)}
                accessibilityRole="button"
                accessibilityLabel={`Command /${c.cmd}: ${c.hint}`}
              >
                <Text style={styles.slashEmoji}>{c.emoji}</Text>
                <View style={styles.slashText}>
                  <Text style={styles.slashCmd}>/{c.cmd}</Text>
                  <Text style={styles.slashHint}>{c.hint}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* @-mention picker: appears while typing "@", tap to insert. */}
      {mentionMatches.length > 0 && (
        <View style={styles.mentionBar}>
          <ScrollView
            style={styles.mentionList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {mentionMatches.map((c) => (
              <Pressable
                key={c.id}
                style={styles.mentionRow}
                onPress={() => setDraft(applyMention(draft, c.nickname))}
                accessibilityRole="button"
                accessibilityLabel={`Mention ${c.nickname}`}
              >
                <Avatar username={c.nickname} peerID={c.id} size={28} />
                <Text style={styles.mentionName} numberOfLines={1}>
                  {c.nickname}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Nearby-only control: only on the bridged public channel while bridging.
          Lets the user keep a single message radio-only. */}
      {channel === "#bluetooth" && bridgeEnabled && (
        <Pressable
          style={styles.nearbyOnlyRow}
          onPress={() => setNearbyOnly((v) => !v)}
          accessibilityRole="switch"
          accessibilityState={{ checked: nearbyOnly }}
          accessibilityLabel="Nearby only: keep this message off the mesh bridge"
        >
          <Feather
            name={nearbyOnly ? "bluetooth" : "globe"}
            size={13}
            color={nearbyOnly ? Colors.textPrimary : Colors.textMuted}
          />
          <Text
            style={[
              styles.nearbyOnlyText,
              nearbyOnly && { color: Colors.textPrimary },
            ]}
          >
            {nearbyOnly
              ? "Nearby only · stays on Bluetooth"
              : "Bridging to nearby areas · tap for nearby only"}
          </Text>
        </Pressable>
      )}

      {/* Compose bar */}
      <View style={styles.composeBar}>
        {/* Attach: only where media can actually be delivered (see mediaAllowed). */}
        {mediaAllowed && (
          <Pressable
            style={styles.attachButton}
            onPress={handleAttach}
            accessibilityRole="button"
            accessibilityLabel="Attach a file"
          >
            <Feather name="plus" size={20} color={Colors.textMuted} />
          </Pressable>
        )}
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder={"Message\u2026"}
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={2000}
          returnKeyType="send"
          blurOnSubmit
          onSubmitEditing={handleSend}
          selectionColor={Colors.accent}
        />

        {draft.trim().length > 0 ? (
          // Send button: shown when there is text
          <Pressable
            style={styles.sendButton}
            onPress={handleSend}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Feather name="arrow-up" size={18} color={Colors.textInverse} />
          </Pressable>
        ) : (
          // PTT button: hold to talk. Voice is media, so it appears only where
          // media is allowed; otherwise the bar is just text + send.
          mediaAllowed && (
            <Pressable
              style={[
                styles.pttButton,
                isPTTActive && styles.pttButtonActive,
                // Somebody else has the floor. The button still works: a mesh
                // has no floor arbiter, and refusing to send would desync the
                // moment the network partitions. It just says so first.
                liveTalker !== null && !isPTTActive && styles.pttButtonBusy,
              ]}
              onPressIn={() => void handleTalkStart()}
              onPressOut={() => void handleTalkEnd()}
              accessibilityRole="button"
              accessibilityLabel={
                liveTalker !== null
                  ? `${liveAvailable ? "Hold to talk live" : "Hold to record a voice note"}. ${liveTalker} is talking`
                  : liveAvailable
                    ? "Hold to talk live"
                    : "Hold to record a voice note"
              }
            >
              {/* Always the mic: that is this app's icon for voice, and the
                  radio glyph already means "the mesh" everywhere else (peer
                  list, radar, network settings), so borrowing it here would
                  say the wrong thing. State is carried by colour instead,
                  which is how the rest of the app shows it:

                    muted  hold records a voice note
                    accent hold goes out live
                    danger you are live right now

                  The busy ring is a separate property (the border), so
                  "live is available" and "somebody else is talking" can be
                  true at once and both remain readable. */}
              <Feather
                name="mic"
                size={16}
                color={
                  isPTTActive
                    ? Colors.danger
                    : liveAvailable
                      ? Colors.accent
                      : Colors.textMuted
                }
              />
            </Pressable>
          )
        )}
      </View>

      {/* In-compose voice recording bar: replaces compose row while recording */}
      {(isRecording || isTalkingLive) && (
        <View style={styles.recordingBar}>
          <Pressable
            style={styles.recordingCancel}
            onPress={() => {
              if (isTalkingLive) {
                setIsTalkingLive(false);
                setIsPTTActive(false);
                void getMeshService()?.cancelVoiceBurst();
                return;
              }
              void cancelRecording();
            }}
            accessibilityRole="button"
            accessibilityLabel={
              isTalkingLive ? "Stop talking and discard" : "Cancel recording"
            }
          >
            <Feather name="x" size={18} color={Colors.textMuted} />
          </Pressable>
          {/* LIVE is not decoration. A voice note can be cancelled before
              anyone hears it; a live burst cannot, because it already played
              on the other phone. The sender has to be able to tell which one
              they are in without thinking about it. */}
          {isTalkingLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          )}
          {/* Animated-look waveform (static bars that suggest audio) */}
          <View style={styles.recordingWave}>
            {[5, 10, 7, 14, 9, 12, 6, 11, 8, 13, 7, 10].map((h, i) => (
              <View
                key={i}
                style={[
                  styles.recordingBar_bar,
                  { height: h },
                  isTalkingLive && styles.recordingBarLive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.recordingTimer}>
            {formatDuration(recordingSecs)}
          </Text>
          {/* A live burst ends by letting go, so there is nothing to "send".
              Showing a send button would imply the audio is still waiting on
              this device when it left as it was spoken. */}
          {!isTalkingLive && (
            <Pressable
              style={styles.recordingStop}
              onPress={() => void stopRecording()}
              accessibilityRole="button"
              accessibilityLabel="Stop recording and send"
            >
              <Feather name="send" size={16} color={Colors.textInverse} />
            </Pressable>
          )}
        </View>
      )}

      {/* Attachment picker */}
      <BottomSheet
        visible={showAttachMenu}
        onClose={() => setShowAttachMenu(false)}
        sheetStyle={styles.attachSheet}
      >
        <Text style={styles.attachSheetTitle}>Attach</Text>
        {ATTACH_OPTIONS.filter((o) => !o.dmOnly || isDM).map(
          ({ action, icon, label, desc }, i) => (
            <React.Fragment key={action}>
              {i > 0 && <View style={styles.attachSeparator} />}
              <Pressable
                style={styles.attachOption}
                onPress={() => handleAttachAction(action)}
                accessibilityRole="button"
                accessibilityLabel={label}
              >
                <View style={styles.attachOptionIcon}>
                  <Feather name={icon} size={20} color={Colors.textSecondary} />
                </View>
                <View style={styles.attachOptionBody}>
                  <Text style={styles.attachOptionLabel}>{label}</Text>
                  <Text style={styles.attachOptionDesc}>{desc}</Text>
                </View>
              </Pressable>
            </React.Fragment>
          ),
        )}
        <View style={styles.attachNote}>
          <Feather name="bluetooth" size={12} color={Colors.textMuted} />
          <Text style={styles.attachNoteText}>
            Files send over Bluetooth range only. Text and payments reach
            internet contacts; attachments do not.
          </Text>
        </View>
        <Pressable
          style={styles.attachCancel}
          onPress={() => setShowAttachMenu(false)}
          accessibilityRole="button"
        >
          <Text style={styles.attachCancelText}>Cancel</Text>
        </Pressable>
      </BottomSheet>

      {/* Send ecash: DM-only attach option, builds an offline Cashu token
          from the wallet and sends it straight to this peer. */}
      {isDM && (
        <BottomSheet
          visible={showSendEcash}
          onClose={() => setShowSendEcash(false)}
          sheetStyle={styles.ecashSheet}
        >
          <Text style={styles.ecashTitle}>Send ecash</Text>
          <Text style={styles.ecashSubtitle}>
            Built offline from your wallet and sent as a token to {displayName}.
          </Text>
          <TextInput
            style={styles.ecashInput}
            value={ecashAmount}
            onChangeText={setEcashAmount}
            placeholder="Amount in sats"
            placeholderTextColor={Colors.textMuted}
            keyboardType="number-pad"
            returnKeyType="next"
            selectionColor={Colors.accent}
          />
          <TextInput
            style={[styles.ecashInput, styles.ecashInputCompact]}
            value={ecashMemo}
            onChangeText={setEcashMemo}
            placeholder="Memo (optional)"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="sentences"
            selectionColor={Colors.accent}
          />
          <View style={styles.ecashActions}>
            <Pressable
              style={[
                styles.ecashConfirm,
                (!ecashAmount.trim() || sendingEcash) &&
                  styles.ecashConfirmDisabled,
              ]}
              onPress={() => void handleSendEcash()}
              disabled={!ecashAmount.trim() || sendingEcash}
            >
              <Text style={styles.ecashConfirmText}>Send</Text>
            </Pressable>
            <Pressable
              style={styles.ecashCancel}
              onPress={() => {
                setShowSendEcash(false);
                setEcashAmount("");
                setEcashMemo("");
              }}
            >
              <Text style={styles.ecashCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </BottomSheet>
      )}

      {/* Channel info sheet: opens when user taps the header center */}
      {!isDM && (
        <ChannelInfoSheet
          channel={showChannelInfo ? channel : null}
          onClose={() => setShowChannelInfo(false)}
          onLeave={onBack}
          onNavigateToChannel={onNavigateToChannel}
          localNickname={localNickname}
          localPeerID={localPeerID}
        />
      )}

      {/* DM peer info: opens when the user taps the DM header. The same shared
          sheet the DM list's "Contact info" action uses, so the two never
          diverge. */}
      {isDM && (
        <ContactInfoSheet
          channel={showDMInfo ? channel : null}
          onClose={() => setShowDMInfo(false)}
          onAfterRemove={onBack}
        />
      )}

      {/* Notices: the channel's signed bulletin board (mesh + this cell). */}
      {!isDM && (
        <NoticesSheet
          visible={showNotices}
          onClose={() => setShowNotices(false)}
          channel={channel}
        />
      )}

      {/* Attachment composer: review the picked media and add a caption before
          sending, the way WhatsApp/Signal do. The caption rides the file packet
          so media + caption land as one message. */}
      <BottomSheet
        visible={pendingAttachment !== null}
        onClose={cancelPendingAttachment}
        sheetStyle={styles.composerSheet}
        scrimColor={COMPOSER_SCRIM}
      >
        {pendingAttachment?.type === "image" ? (
          <Image
            source={{ uri: pendingAttachment.uri }}
            style={styles.composerPreview}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.composerFilePreview}>
            <Feather
              name={pendingAttachment?.type === "video" ? "film" : "file"}
              size={40}
              color={Colors.textSecondary}
            />
            <Text style={styles.composerFileName} numberOfLines={1}>
              {pendingAttachment?.name ??
                (pendingAttachment?.type === "video" ? "Video" : "Document")}
            </Text>
          </View>
        )}
        <View style={styles.composerInputRow}>
          <TextInput
            style={styles.composerInput}
            placeholder="Add a caption…"
            placeholderTextColor={Colors.textMuted}
            value={captionDraft}
            onChangeText={setCaptionDraft}
            multiline
            maxLength={512}
          />
          <Pressable
            style={styles.composerSend}
            onPress={confirmPendingAttachment}
            accessibilityRole="button"
            accessibilityLabel="Send attachment"
          >
            <Feather name="send" size={18} color={Colors.textInverse} />
          </Pressable>
        </View>
      </BottomSheet>

      {/* Channel sender profile sheet: tap a message's avatar/name. */}
      {!isDM && (
        <BottomSheet
          visible={senderInfoTarget !== null}
          onClose={() => setSenderInfoTarget(null)}
          sheetStyle={styles.dmInfoSheet}
        >
          {senderInfoTarget && (
            <>
              {senderInfoTarget.fromMembers && (
                <Pressable
                  style={styles.dmInfoBack}
                  onPress={() => setSenderInfoTarget(null)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel="Back to members"
                >
                  <Feather
                    name="chevron-left"
                    size={24}
                    color={Colors.textPrimary}
                  />
                </Pressable>
              )}
              <View style={styles.dmInfoBody}>
                <Avatar
                  username={resolveDisplayName(senderInfoTarget.peerID)}
                  peerID={senderInfoTarget.peerID}
                  size={64}
                />
                <Text style={styles.dmInfoName}>
                  {resolveDisplayName(senderInfoTarget.peerID)}
                </Text>
                {isNostrId(senderInfoTarget.peerID) ? (
                  <View style={styles.keyBox}>
                    <Text style={styles.keyBoxLabel}>Nostr public key</Text>
                    <Text style={styles.keyBoxValue} selectable>
                      {senderInfoTarget.peerID.slice(NOSTR_ID_PREFIX.length)}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.dmInfoPeerID}>
                    {senderInfoTarget.peerID}
                  </Text>
                )}
                {onlinePeers.some(
                  (p) => p.peerID === senderInfoTarget.peerID,
                ) && (
                  <View style={styles.dmInfoStatus}>
                    <View style={styles.dmInfoDot} />
                    <Text style={styles.dmInfoStatusText}>In BLE range</Text>
                  </View>
                )}
              </View>
              <View style={styles.dmInfoActions}>
                <Pressable
                  style={styles.senderInfoMessageBtn}
                  onPress={handleMessageSender}
                  accessibilityRole="button"
                  accessibilityLabel={`Message ${resolveDisplayName(senderInfoTarget.peerID)}`}
                >
                  <Feather
                    name="message-circle"
                    size={16}
                    color={Colors.textInverse}
                  />
                  <Text style={styles.senderInfoMessageText}>Message</Text>
                </Pressable>
              </View>
            </>
          )}
        </BottomSheet>
      )}

      {/* Long-press action sheet: forward/copy/star. */}
      <MessageActionSheet
        message={actionSheet}
        onClose={() => setActionSheet(null)}
        onForward={() => {
          // Let the action sheet's own close animation finish before the
          // forward sheet slides up: opening both at once reads as a glitch
          // rather than a handoff between two bottom sheets.
          const target = actionSheet;
          if (target) scheduleSheetHandoff(() => setForwardSource(target));
        }}
        onCopy={() =>
          actionSheet &&
          void Clipboard.setStringAsync(actionSheet.text).catch(() => {})
        }
        onInfo={() => {
          // Same close-then-open handoff as Forward, so the two sheets don't
          // fight for the screen.
          const target = actionSheet;
          if (target) scheduleSheetHandoff(() => setInfoMessageId(target.id));
        }}
        onSave={() => {
          const attachment = actionSheet?.attachment;
          if (attachment) void saveAttachmentToDevice(attachment);
        }}
      />

      <MessageInfoSheet
        message={msgs.find((m) => m.id === infoMessageId) ?? null}
        onClose={() => setInfoMessageId(null)}
      />

      {/* Forward target picker */}
      <ForwardSheet
        visible={forwardSource !== null}
        excludeChannel={channel}
        onClose={() => setForwardSource(null)}
        onForward={(target) => {
          if (forwardSource) {
            forwardMessage(forwardSource, target);
            onNavigateToChannel(target);
          }
        }}
      />
    </View>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
      gap: Spacing.sm,
      minHeight: 56,
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    // Same badge as the tab bar and the Channels/Direct segments: accent fill,
    // inverse text, hairline ring in the surface behind it so it reads as a
    // cutout rather than a sticker. Sits on the chevron so "what is behind this
    // button" is answered by the button itself.
    backBadge: {
      position: "absolute",
      top: 0,
      right: 0,
      minWidth: 16,
      height: 16,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 3,
      borderWidth: 1.5,
      borderColor: Colors.bg,
    },
    backBadgeText: {
      fontSize: 9,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
      lineHeight: 12,
    },
    headerCenter: {
      flex: 1,
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 1,
    },
    channelTitle: {
      color: Colors.textPrimary,
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      flexShrink: 1,
    },
    headerSubtitle: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    encryptedBadge: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.sm,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    encryptedBadgeText: {
      fontSize: 9,
      fontWeight: FontWeight.bold,
      color: Colors.textMuted,
      letterSpacing: 0.5,
    },
    // Channel actions: a connected track (surface + hairline border) holding
    // fully-rounded icon buttons, matching the notice composer's expiry steps.
    // The 3pt inset is what keeps a button's own rounding clear of the track's.
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Radius.full,
      padding: 3,
    },
    headerAction: {
      width: 32,
      height: 32,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    // Short of the track's full height, so it divides the buttons without
    // touching the border and reading as a second edge.
    headerActionDivider: {
      width: 1,
      height: 20,
      backgroundColor: Colors.borderStrong,
    },
    // DM header: avatar + name row, left-aligned after the back arrow.
    headerDmId: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    // Messages
    listWrap: {
      flex: 1,
    },
    list: {
      flexGrow: 1,
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.base,
      paddingBottom: Spacing.sm,
    },
    // Floats at the end of the list, clear of the compose bar below it.
    jumpToLatest: {
      position: "absolute",
      right: Spacing.base,
      bottom: Spacing.md,
      width: 36,
      height: 36,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    dateSeparator: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: Spacing.md,
      gap: Spacing.sm,
    },
    dateLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
    },
    dateLabel: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },
    // System row (e.g. screenshot notices): centered, muted, no bubble.
    systemRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      marginVertical: Spacing.sm,
    },
    systemRowText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontStyle: "italic",
    },
    // Centered, italic emote line (/hug, /slap) — a touch stronger than a system
    // notice so it reads as a playful action, not a status message.
    emoteText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontStyle: "italic",
      textAlign: "center",
    },
    // Empty state
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Spacing["3xl"],
      gap: Spacing.sm,
    },
    emptyTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textSecondary,
    },
    emptySubtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
    },
    // Peer offline notice
    peerOfflineBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      paddingHorizontal: Spacing.base,
      paddingVertical: 6,
      backgroundColor: Colors.surfaceRaised,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },
    peerOfflineBannerText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      flex: 1,
    },
    // Compose bar
    dmStatusBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.xs,
      backgroundColor: Colors.surfaceRaised,
    },
    dmStatusText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    // ---- @-mention picker (above the compose bar) ------------------------------
    mentionBar: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
      backgroundColor: Colors.bg,
    },
    mentionList: {
      maxHeight: 176,
    },
    mentionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
    },
    mentionName: {
      flex: 1,
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    // ---- "/" command picker (shares mentionBar/mentionList) --------------------
    slashRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
    },
    slashEmoji: {
      fontSize: FontSize.lg,
      width: 28,
      textAlign: "center",
    },
    slashText: {
      flex: 1,
      gap: 1,
    },
    slashCmd: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
      fontFamily: FontFamily.mono,
    },
    slashHint: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    composeBar: {
      flexDirection: "row",
      alignItems: "flex-end",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      gap: Spacing.sm,
      backgroundColor: Colors.bg,
    },
    nearbyOnlyRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.xs,
      backgroundColor: Colors.bg,
    },
    nearbyOnlyText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    attachButton: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginBottom: 3,
    },
    input: {
      flex: 1,
      backgroundColor: Colors.surface,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm + 2,
      color: Colors.textPrimary,
      fontSize: FontSize.base,
      maxHeight: 120,
      lineHeight: FontSize.base * 1.4,
    },
    sendButton: {
      width: 40,
      height: 40,
      backgroundColor: Colors.accent,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginBottom: 1,
    },
    pttButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: Colors.borderStrong,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginBottom: 1,
    },
    // Somebody else has the floor: an accent ring, not a disabled state. The
    // button still sends; the tint is a courtesy, not a lock.
    pttButtonBusy: {
      borderColor: Colors.accent,
    },
    // LIVE badge on the recording bar. Danger-tinted like the recording dot
    // everywhere else in the app, in the same pill idiom as the rest.
    liveBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
      borderRadius: Radius.full,
      backgroundColor: Colors.dangerDim,
    },
    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.danger,
    },
    liveBadgeText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.danger,
      letterSpacing: 0.5,
    },
    recordingBarLive: {
      backgroundColor: Colors.danger,
    },
    pttButtonActive: {
      backgroundColor: Colors.dangerDim,
      borderColor: Colors.danger,
    },
    // Attachment picker sheet
    attachSheet: {
      width: "100%",
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing["2xl"],
    },
    attachSheetTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
      paddingHorizontal: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    attachOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.base,
      paddingVertical: Spacing.base,
      paddingHorizontal: Spacing.sm,
      borderRadius: Radius.md,
    },
    attachOptionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    attachOptionBody: {
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 0,
    },
    attachOptionLabel: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    attachOptionDesc: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      marginTop: 2,
    },
    attachSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginLeft: 40 + Spacing.base + Spacing.sm,
    },
    attachNote: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.xs,
      paddingHorizontal: Spacing.xs,
      paddingTop: Spacing.md,
    },
    attachNoteText: {
      flex: 1,
      fontSize: FontSize.xs,
      lineHeight: 16,
      color: Colors.textMuted,
    },
    attachCancel: {
      minHeight: 50,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.full,
      paddingVertical: Spacing.md,
      alignItems: "center",
      justifyContent: "center",
      marginTop: Spacing.base,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    attachCancelText: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    // Send ecash modal (DM-only attach option)
    ecashSheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.base,
    },
    ecashTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    ecashSubtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: FontSize.sm * 1.5,
    },
    ecashInput: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      color: Colors.textPrimary,
      fontSize: FontSize.base,
    },
    ecashInputCompact: {
      marginTop: -Spacing.xs,
    },
    ecashActions: {
      width: "100%",
      marginTop: Spacing.xs,
    },
    ecashConfirm: {
      width: "100%",
      minHeight: 50,
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    ecashConfirmDisabled: {
      opacity: 0.4,
    },
    ecashConfirmText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
    },
    ecashCancel: {
      width: "100%",
      minHeight: 50,
      marginTop: Spacing.sm,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    ecashCancelText: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    // Voice recording bar (shown when isRecording = true)
    recordingBar: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      gap: Spacing.sm,
      backgroundColor: Colors.bg,
      minHeight: 56,
    },
    recordingCancel: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    recordingWave: {
      flexGrow: 1,
      flexShrink: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingHorizontal: Spacing.sm,
    },
    recordingBar_bar: {
      width: 3,
      borderRadius: 2,
      backgroundColor: Colors.danger,
    },
    recordingTimer: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.danger,
      minWidth: 32,
      textAlign: "right",
      flexShrink: 0,
    },
    recordingStop: {
      width: 40,
      height: 40,
      backgroundColor: Colors.danger,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    // Attachment bubbles (rendered inside the chat bubble)
    // Height comes from the photo's own aspect at render time; see
    // mediaHeightForAspect. A percentage width was what made these render as
    // slivers: the bubble's width is decided by its caption, so "100%" of a
    // two-character caption is a two-character-wide photo.
    attachImage: {
      width: MEDIA_BUBBLE_WIDTH,
      borderRadius: Radius.md,
      marginBottom: Spacing.xs,
      backgroundColor: Colors.surfaceRaised,
    },
    attachImagePlaceholder: {
      width: MEDIA_BUBBLE_WIDTH,
      height: mediaHeightForAspect(MEDIA_DEFAULT_ASPECT),
      borderRadius: Radius.md,
      backgroundColor: Colors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    attachImagePlaceholderText: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    attachVideoPlaceholder: {
      width: 200,
      height: 120,
      borderRadius: Radius.md,
      backgroundColor: Colors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    // Video poster shown before the player is mounted: a neutral surface with a
    // centered play badge, matching the image "tap to load" gate.
    attachVideoPoster: {
      width: MEDIA_BUBBLE_WIDTH,
      height: mediaHeightForAspect(MEDIA_DEFAULT_ASPECT),
      borderRadius: Radius.md,
      backgroundColor: Colors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      marginBottom: Spacing.xs,
    },
    attachVideoPlayBadge: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: Colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    // Full-screen photo viewer.
    fullscreenBackdrop: {
      flex: 1,
      backgroundColor: "#000000",
      alignItems: "center",
      justifyContent: "center",
    },
    fullscreenImage: {
      width: "100%",
      height: "100%",
    },
    fullscreenClose: {
      position: "absolute",
      top: 48,
      right: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
    // Bottom of the viewer, opposite the close button, so neither covers the
    // photo's middle. Same scrim-on-black circles as the close.
    fullscreenActions: {
      position: "absolute",
      bottom: 48,
      flexDirection: "row",
      gap: Spacing.base,
    },
    fullscreenAction: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
    attachVoice: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.xs,
      minWidth: 160,
    },
    // Icon-in-a-circle, same neutral-surface pattern used everywhere else
    // in the app (channel/DM row icons, etc.), always readable regardless
    // of which bubble color it happens to sit on, unlike a translucent
    // overlay tuned for only one specific bubble/theme combination.
    attachVoicePlay: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: Colors.surface,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    attachVoiceWave: {
      flexGrow: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    // Bars and duration sit directly on the bubble (not a neutral circle),
    // so, like the message text right next to them, they need to track
    // which bubble color they're on. See onMyBubble/onTheirBubble below.
    attachVoiceBar: {
      width: 3,
      borderRadius: 2,
    },
    attachVoiceDuration: {
      fontSize: FontSize.xs,
      flexShrink: 0,
    },
    attachDoc: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.xs,
      minWidth: 160,
    },
    attachDocIcon: {
      width: 36,
      height: 36,
      borderRadius: Radius.sm,
      backgroundColor: Colors.surface,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    attachDocInfo: {
      flexGrow: 1,
      flexShrink: 1,
      gap: 1,
    },
    attachDocName: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
    },
    attachDocMeta: {
      fontSize: FontSize.xs,
      opacity: 0.7,
    },
    // Shared "text/fill on top of a message bubble" pair, the same tokens
    // messageTextMine/messageTextTheirs use, so anything sitting directly
    // on a bubble (not a neutral surface) stays correctly readable through
    // both themes. Sets both `color` and `backgroundColor`; each consumer
    // (Text vs. View) only reads the property it cares about.
    // Anything drawn directly on a bubble has to flip with it, the way the
    // message text next to it does. Text flips its colour and a waveform bar
    // flips its fill, so they are two styles: one that set both painted the
    // duration a solid block, the bars' backgroundColor landing behind digits
    // that were already the same colour.
    textOnMyBubble: { color: Colors.textInverse },
    textOnTheirBubble: { color: Colors.textPrimary },
    barOnMyBubble: { backgroundColor: Colors.textInverse },
    barOnTheirBubble: { backgroundColor: Colors.textPrimary },
    // DM peer info sheet
    dmInfoSheet: {
      width: "100%",
      paddingBottom: Spacing["2xl"],
    },
    dmInfoBack: {
      position: "absolute",
      top: Spacing.base,
      left: Spacing.base,
      zIndex: 1,
      padding: Spacing.xs,
    },
    dmInfoBody: {
      alignItems: "center",
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.xl,
      gap: Spacing.sm,
    },
    dmInfoName: {
      fontSize: FontSize.xl,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      marginTop: Spacing.xs,
    },
    dmInfoPeerID: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontFamily: FontFamily.mono,
      letterSpacing: 0.8,
      textAlign: "center",
    },
    // Boxed, labeled Nostr public key, consistent with the contact-info sheet.
    keyBox: {
      alignSelf: "stretch",
      marginTop: Spacing.xs,
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
    dmInfoStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      marginTop: Spacing.xs,
    },
    dmInfoDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.online,
    },
    // Unseen-notices dot on the header's board icon.
    // Sits inside the icon button now that it lives on a track: hung off the
    // corner it would straddle the pill's border. Ringed in the track's own
    // colour so it reads as a cutout, the same trick the back badge uses.
    noticeDot: {
      position: "absolute",
      top: 5,
      right: 5,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.accent,
      borderWidth: 1,
      borderColor: Colors.surface,
    },
    // Attachment composer (caption before send).
    composerSheet: {
      backgroundColor: Colors.bg,
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing.xl,
      gap: Spacing.md,
    },
    composerPreview: {
      width: "100%",
      height: 320,
      borderRadius: Radius.md,
      backgroundColor: Colors.surface,
    },
    composerFilePreview: {
      width: "100%",
      height: 140,
      borderRadius: Radius.md,
      backgroundColor: Colors.surface,
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
    },
    composerFileName: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      maxWidth: "80%",
    },
    composerInputRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: Spacing.sm,
    },
    composerInput: {
      flex: 1,
      maxHeight: 120,
      minHeight: 44,
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.sm,
      borderRadius: Radius.xl,
      backgroundColor: Colors.surface,
      color: Colors.textPrimary,
      fontSize: FontSize.base,
    },
    composerSend: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: Colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    dmInfoStatusText: {
      fontSize: FontSize.sm,
      color: Colors.online,
      fontWeight: FontWeight.medium,
    },
    dmInfoActions: {
      width: "100%",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
    },
    // Channel sender profile sheet's single action: solid pill, same
    // primary-button shape used everywhere else this session.
    senderInfoMessageBtn: {
      width: "100%",
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
    },
    senderInfoMessageText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
    },
    // Cashu payment cards rendered inside message bubbles. Deliberately distinct
    // from grey file attachments: an accent-tinted card with a hero amount, so
    // money reads as money at a glance (the WhatsApp / GPay payment convention).
    paymentCard: {
      marginTop: Spacing.xs,
      padding: Spacing.md,
      borderRadius: Radius.lg,
      backgroundColor: Colors.accentGhost,
      borderWidth: 1,
      borderColor: Colors.accent,
      gap: 4,
      minWidth: 190,
    },
    paymentCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
    },
    paymentCardAmount: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      letterSpacing: -0.3,
    },
    paymentCardMint: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    paymentCardMemo: {
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
      fontStyle: "italic",
    },
    paymentCardClaim: {
      marginTop: Spacing.xs,
      borderRadius: Radius.sm,
      backgroundColor: Colors.accent,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      alignSelf: "flex-start",
    },
    paymentCardClaimBusy: {
      opacity: 0.5,
    },
    paymentCardClaimed: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      alignSelf: "flex-start",
      marginTop: Spacing.xs,
    },
    paymentCardClaimedText: {
      fontSize: FontSize.xs,
      color: Colors.online,
      fontWeight: FontWeight.semibold,
    },
    paymentCardClaimText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textInverse,
    },
  });
}
