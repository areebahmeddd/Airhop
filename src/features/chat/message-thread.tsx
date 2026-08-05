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
import * as Haptics from "expo-haptics";
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
  type GestureResponderEvent,
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
  MAX_BITCHAT_TRANSFER_BYTES,
  MAX_VIDEO_SECONDS,
  maxBytesForType,
  wireMediaName,
} from "../../core/mesh/bitchat-file-packet";
import { nicknameKey, normalizeNickname } from "../../core/mesh/nickname";
import { MAX_BURST_MS } from "../../core/mesh/voice-capture";
import {
  findTokensInText,
  mayContainToken,
  type EmbeddedToken,
} from "../../core/payments/cashu";
import { t, useT, useTPlural, type TranslationKey } from "../../i18n";
import { chevronBack, textAlignEnd } from "../../i18n/layout";
import { reportWalletError } from "../../services/ecash-transfer";
import {
  AttachmentTooLargeError,
  sizeLabel,
} from "../../services/file-transfer-service";
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
  HIT_SLOP,
  hitSlopFor,
  MaxFontScale,
  MIN_TOUCH,
  Radius,
  Shadow,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { useKeyboardInset } from "../../ui/use-keyboard";
import { channelInviteLink } from "../../utils/deep-link";
import { resolveDisplayName } from "../../utils/display-name";
import {
  formatBytes,
  formatClockTime,
  formatDateSeparator,
  formatDuration,
} from "../../utils/format";
import {
  BRIDGE_CHANNEL,
  canSendMedia,
  mediaBlockedReason,
} from "../../utils/media-policy";
import { activeMentionQuery, applyMention } from "../../utils/mentions";
import { ensurePermission } from "../../utils/permissions";
import {
  resolveLandingSettle,
  resolveThreadScroll,
} from "../../utils/thread-scroll";
import {
  isNostrId,
  NOSTR_ID_PREFIX,
  peerIDToUsername,
} from "../../utils/username";
import SendEcashSheet from "../wallet/send-ecash-sheet";
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
  labelKey: TranslationKey;
  descKey: TranslationKey;
  // Only offered inside a DM: sending ecash to a broadcast channel isn't
  // a peer-to-peer payment, so it doesn't belong in a public channel's
  // attach sheet.
  dmOnly?: boolean;
}[] = [
  {
    action: "camera",
    icon: "camera",
    labelKey: "chat.attach.camera",
    descKey: "chat.attach.camera_desc",
  },
  {
    action: "library",
    icon: "image",
    labelKey: "chat.attach.library",
    descKey: "chat.attach.library_desc",
  },
  {
    action: "document",
    icon: "file-text",
    labelKey: "chat.attach.document",
    descKey: "chat.attach.document_desc",
  },
  {
    action: "voice",
    icon: "mic",
    labelKey: "chat.attach.voice",
    descKey: "chat.attach.voice_desc",
  },
  {
    action: "ecash",
    icon: "zap",
    labelKey: "chat.attach.ecash",
    descKey: "chat.attach.ecash_desc",
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

// How far off the end still counts as having landed, in points. Sub-pixel, so
// only a real gap fails it: see resolveLandingSettle for why placing the reader
// is held to a far tighter standard than noticing they moved.
const LANDED_TOLERANCE = 2;

// How long the content must hold still before the landing is treated as over.
// FlatList reports its size once per rendered batch, so this needs to outlast the
// gap between two batches (updateCellsBatchingPeriod, 50ms) or the landing would
// declare itself finished part way down a thread still rendering itself.
const LANDING_SETTLE_MS = 150;

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

// The live-burst ceiling in seconds, for the HUD. Derived from the value the
// capture layer actually enforces, so the badge cannot claim a burst is still
// going out after the encoder has stopped feeding it.
const BURST_MAX_SECS = Math.floor(MAX_BURST_MS / 1000);

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
  return t("chat.screenshot.notice", { name: nickname });
}

// Drawn sizes for the compose row's three controls and the jump-to-latest pill.
// All four sit below the 44pt floor on purpose, because the compose bar has to
// stay slim and the pill has to stay out of the way of the messages under it;
// each one carries hitSlopFor() to make the target up. Named so the size and the
// slop cannot fall out of step, which is exactly how a 40pt button ends up with
// a 36pt button's padding.
const COMPOSE_ATTACH_SIZE = 36;
const COMPOSE_BUTTON_SIZE = 40;
const JUMP_BUTTON_SIZE = 36;

// Slash commands offered by the "/" quick-picker. Only the ones handleSend
// actually acts on appear here, so the list never advertises a command that does
// nothing. Both are IRC-style emotes: in a DM they target the peer, in a channel
// they take a trailing @name.
// Keys, not text: a module constant is evaluated once at import, so translated
// strings here would freeze in whichever language the app started in.
//
// `cmd` is NOT a key and is never translated: it is the token the parser
// matches, and the text these emotes transmit is recognised as an English
// substring by bitchat on receipt. Only the hint describing it is localised.
const SLASH_COMMANDS: {
  cmd: string;
  emoji: string;
  hintKey: TranslationKey;
}[] = [
  { cmd: "hug", emoji: "🫂", hintKey: "chat.cmd.hug_hint" },
  { cmd: "slap", emoji: "🐟", hintKey: "chat.cmd.slap_hint" },
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
    borderRadius: Radius.md,
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
  const T = useT();
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
      <Text style={styles.label}>{T("chat.status.sending")}</Text>
      <Pressable
        onPress={onUndo}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={T("chat.status.undo_send")}
      >
        <Text style={styles.undo}>{T("chat.status.undo")}</Text>
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
  const T = useT();
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

        // `t` here is the Transfer, which shadows the module translator, so
        // this reads through the component's `T` instead.
        const verb =
          t.status === "done"
            ? t.direction === "send"
              ? T("chat.status.sent")
              : T("chat.status.received")
            : t.status === "failed"
              ? T("chat.status.failed")
              : t.status === "cancelled"
                ? T("chat.status.cancelled")
                : t.status === "stalled"
                  ? T("chat.status.waiting")
                  : t.direction === "send"
                    ? T("chat.status.sending_short")
                    : T("chat.status.receiving");

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
              ? T("chat.thread.waiting_for", {
                  name: t.peerLabel || T("chat.thread.peer"),
                  percent: pct,
                })
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
                      hitSlop={HIT_SLOP}
                      accessibilityRole="button"
                      accessibilityLabel={T("chat.thread.cancel_transfer", {
                        name: t.name,
                      })}
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
        <Text style={styles.queued}>
          {t("chat.thread.queued_more", { count: queued })}
        </Text>
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
      borderRadius: Radius.xs,
      backgroundColor: Colors.border,
      overflow: "hidden",
      marginTop: 2,
    },
    fill: { height: 3, borderRadius: Radius.xs },
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
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [aspect, setAspect] = useState<number | null>(null);
  // The uri that failed to load, rather than a boolean. A new uri makes the
  // stored one stale on its own, so nothing has to reset state in the effect
  // body and trigger a second render on every image.
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const gone = failedUri === uri;

  useEffect(() => {
    let alive = true;
    Image.getSize(
      uri,
      (w, h) => {
        if (alive && h > 0) setAspect(w / h);
      },
      () => {
        // The file is not readable. Overwhelmingly this means the retention
        // sweep removed it: attachments are deleted after seven days, so every
        // thread eventually scrolls back into this state. Rendering the frame
        // anyway left a blank grey box with nothing to explain it, which reads
        // as the app being broken rather than as the photo having expired.
        if (alive) setFailedUri(uri);
      },
    );
    return () => {
      alive = false;
    };
  }, [uri]);

  if (gone) {
    return (
      <View style={styles.attachImagePlaceholder}>
        <Feather name="clock" size={20} color={Colors.textMuted} />
        <Text style={styles.attachImagePlaceholderText}>
          {T("chat.media.expired")}
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="imagebutton"
      accessibilityLabel={T("chat.media.view_full")}
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
  const T = useT();
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
  // Paused partway through still counts as "in the middle of this clip", so the
  // readout and the fill both stay where the audio actually is. Only a clip
  // sitting at its start reads as the whole duration, the way every messenger
  // does it.
  const partWayIn = status.currentTime > 0 && status.currentTime < totalSecs;
  const shownSecs =
    isPlaying || partWayIn ? Math.floor(status.currentTime) : totalSecs;
  // How far through, for the waveform fill. Guarded against a duration of 0,
  // which is what an unloaded or unreadable file reports.
  const progress =
    status.duration > 0 ? Math.min(1, status.currentTime / status.duration) : 0;

  // Tap anywhere on the bars to jump there, the same gesture bitchat supports
  // and the one people expect from a voice note. Deliberately a tap and not a
  // drag: these bubbles live inside a scrolling list, and a scrubber that
  // swallows vertical movement would make the thread feel stuck.
  const [waveWidth, setWaveWidth] = useState(0);
  function handleSeek(e: GestureResponderEvent): void {
    if (waveWidth <= 0 || status.duration <= 0) return;
    const fraction = Math.min(
      1,
      Math.max(0, e.nativeEvent.locationX / waveWidth),
    );
    void player.seekTo(fraction * status.duration).catch(() => {});
  }

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
        accessibilityLabel={
          isPlaying ? T("chat.media.pause_voice") : T("chat.media.play_voice")
        }
      >
        <Feather
          name={isPlaying ? "pause" : "play"}
          size={16}
          color={Colors.textPrimary}
        />
      </Pressable>
      {/* Decorative bars, not a real waveform: the file is never analysed.
          They carry position only. Solid behind the playhead, faded ahead. */}
      <Pressable
        style={styles.attachVoiceWave}
        onPress={handleSeek}
        onLayout={(e) => setWaveWidth(e.nativeEvent.layout.width)}
        accessibilityRole="adjustable"
        accessibilityLabel={T("chat.media.voice_position")}
        accessibilityHint={T("chat.media.voice_scrub")}
      >
        {VOICE_WAVE_BARS.map((h, i) => {
          const played = i / VOICE_WAVE_BARS.length < progress;
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
      </Pressable>
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
  const T = useT();
  const TP = useTPlural();
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
  // Non-null exactly when media is off here. The attach and mic buttons stay on
  // screen but greyed, and say this when tapped: a control that vanishes leaves
  // people wondering whether the app is broken or they are in the wrong place.
  const mediaBlocked = mediaBlockedReason(channel);
  function explainMediaBlocked(): void {
    if (mediaBlocked !== null)
      showAlert(t("chat.thread.not_available"), mediaBlocked);
  }
  // Teleported cells are keyed `geohash:<gh>`; the header shows them as `#<gh>`,
  // matching bitchat's location-channel badge, not the raw internal key.
  const isManualGeo = isManualGeoChannel(channel);
  const channelLabel = isManualGeo ? `#${manualGeohashOf(channel)}` : channel;
  // Private group channels (`group:<id>`): messages are ChaCha20-Poly1305
  // sealed under the group's epoch key and broadcast as 0x25, not plaintext.
  const isGroup = channel.startsWith("group:");
  const groupName = useGroupStore((s) => s.nameForChannel(channel));
  // A private channel is exactly one that holds an encryption key: the same test
  // the info sheet makes as `isPrivate`, so the header and the sheet you reach
  // by tapping it cannot disagree about the room. One predicate, two uses.
  //
  // It also decides who is worth inviting. The public mesh channel and the
  // location channels are already on everyone's list, so a link to one hands
  // over nothing they do not have; a teleported cell is keyed `geohash:<gh>`,
  // which the invite format cannot carry at all.
  const isPrivate = useChatStore((s) => s.channelKeys[channel] !== undefined);
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
  const nostrConnected = useMeshStateStore((s) => s.nostrConnected);
  // A location channel is a Nostr cell, so with no relay up it reaches only the
  // people in Bluetooth range. A teleported cell is a place nobody nearby is in
  // and never goes out over Bluetooth, so it reaches nobody at all. Both are
  // worth saying before the user types, not after a message goes quiet.
  const needsInternet = isGeo && !nostrConnected;

  // Header subtitle for a channel (not a group/DM): what kind of room this is,
  // then its place name and/or live count.
  const channelSubtitleParts: string[] = [];
  // Kind first, and only the encrypted kind is named. A private channel used to
  // fall through to the "Public channel" default whenever nobody was nearby, so
  // it claimed the opposite of the truth while sitting next to its own invite
  // button; of everything on this line that is the one thing that must not
  // mislead, since it is a claim about who can read the room. Public stays
  // unmarked because it is the default the rest of the app already assumes, and
  // leading with the kind means a narrow screen ellipsizes the live count
  // rather than the label that carries the privacy.
  if (isPrivate) {
    channelSubtitleParts.push(T("chat.thread.private_channel"));
  }
  if (isGeo && geoPlaceName !== undefined) {
    channelSubtitleParts.push(`~${geoPlaceName}`);
  }
  if (memberCount > 0) {
    channelSubtitleParts.push(`${memberCount} ${isGeo ? "active" : "nearby"}`);
  }
  // On the public mesh channel, show that it is bridged (and how many are
  // reachable across the bridge) so people in the thread know their messages
  // are reaching beyond Bluetooth, not just the Mesh-tab banner.
  if (channel === BRIDGE_CHANNEL && bridgeActive) {
    channelSubtitleParts.push(
      bridgePeopleAcross > 0
        ? t("chat.thread.across_bridge", { count: bridgePeopleAcross })
        : t("chat.thread.bridged"),
    );
  }
  // Nothing live to report: name the kind rather than guess. A location channel
  // whose cell has not resolved yet is still a location channel, not the plain
  // public room the old single fallback called it.
  const channelSubtitle =
    channelSubtitleParts.length > 0
      ? channelSubtitleParts.join("  ·  ")
      : isGeo
        ? T("chat.thread.location_channel")
        : T("chat.thread.public_channel");

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
    // Matching, de-duplication and the self-check all run on the normalized
    // key. A group roster and a geohash participant list carry nicknames that
    // never passed through the announce decoder, so they can still arrive in
    // either Unicode encoding; comparing raw strings showed one person twice.
    const q = nicknameKey(mentionQuery);
    const self = nicknameKey(localNickname);
    const seen = new Set<string>();
    const out: { id: string; nickname: string }[] = [];
    for (const c of mentionCandidates) {
      const nick = normalizeNickname(c.nickname);
      const key = nicknameKey(nick);
      if (nick.length === 0 || key === self) continue;
      if (!key.includes(q)) continue;
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
  // A live burst stops going out at the ceiling while the button is still held,
  // so the HUD has to say so. Derived from the same elapsed count the HUD
  // already shows rather than a second timer, so the two can never disagree.
  // Only meaningful for a live burst: a recording is a local file with no
  // airtime to spend, and it is capped by the attachment size limit instead.
  const burstEnded = isTalkingLive && recordingSecs >= BURST_MAX_SECS;
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
  // Raw string of the token currently being claimed, so its button can show
  // progress and a double tap cannot start two swaps for the same proofs.
  const [claimingToken, setClaimingToken] = useState<string | null>(null);
  // Tokens already taken into the wallet, so their cards read "Claimed".
  const claimedTokens = useWalletStore((s) => s.claimedTokens);
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
  // Copy affordance for the sender profile sheet's Nostr key, same tap-to-copy
  // behavior as the contact-info sheet.
  const [senderKeyCopied, setSenderKeyCopied] = useState(false);
  function handleCopySenderKey(peerID: string): void {
    void Clipboard.setStringAsync(peerID.slice(NOSTR_ID_PREFIX.length)).catch(
      () => {},
    );
    setSenderKeyCopied(true);
    setTimeout(() => setSenderKeyCopied(false), 1500);
  }
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
  const [dmStatus, setDmStatus] = useState<
    "queued" | "no-reach" | "gateway" | "no-group-key" | "group-queued" | null
  >(null);
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
  // Selection mode: the ids picked for a bulk forward, entered from the
  // long-press menu. Empty set means not selecting, so there is one source of
  // truth rather than a flag that can disagree with the set.
  const [pickedIds, setPickedIds] = useState<Set<string>>(new Set());
  const [showBulkForward, setShowBulkForward] = useState(false);
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

  // The live selection, narrowed to messages actually in this thread. Derived
  // rather than reset on navigation: this component is reused across
  // conversations, so picks from the previous chat would otherwise keep the
  // selection bar up over messages that are no longer on screen. An empty set
  // means not selecting, so there is no separate flag to disagree with it.
  const selectedIds = useMemo(
    () => new Set(msgs.filter((m) => pickedIds.has(m.id)).map((m) => m.id)),
    [msgs, pickedIds],
  );
  const selecting = selectedIds.size > 0;

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
  // How far the last scroll event put us from the end. The settle pass below
  // reads it to tell an arrival from a near miss, so it is the evidence that
  // the landing worked rather than an assumption that it did.
  const distanceFromBottomRef = useRef<number | null>(null);
  // Pending confirmation that the landing arrived, armed by each content-size
  // change and therefore only reached once the list holds still.
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Set when the reader sends into the thread they are looking at, and consumed
  // by the content-size change their message causes. See followOwnMessage.
  const ownSendRef = useRef(false);
  // The one piece of it the UI needs, so the jump-to-latest pill can appear.
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  // msgs.length when the reader last left the end, so the pill can say how many
  // messages have arrived while they were reading back. Null while they are at
  // the end, where nothing is waiting by definition.
  const [awayAtCount, setAwayAtCount] = useState<number | null>(null);

  function handleListScroll(e: NativeSyntheticEvent<NativeScrollEvent>): void {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);
    distanceFromBottomRef.current = distanceFromBottom;
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
    // Mark where they left, once, and forget it the moment they are back. Only
    // the first step away counts: re-marking on every scroll event while they
    // read would keep resetting the tally to zero.
    setAwayAtCount((at) => {
      if (atBottom) return null;
      return at ?? msgs.length;
    });
  }

  // How many messages have arrived since the reader left the end. Clamped at
  // zero so history trimming, which shortens the list without anything new
  // arriving, cannot show a negative tally.
  const newWhileAway =
    awayAtCount === null ? 0 : Math.max(0, msgs.length - awayAtCount);

  // Take the reader to their own message.
  //
  // The one case that overrides "leave someone who scrolled up where they are",
  // because they asked for it by sending: the message went to the end of the
  // thread, and leaving them in history with it off screen reads as a send that
  // did not work. Only for sends into the thread on screen; forwarding into
  // another conversation must not move this one.
  function followOwnMessage(): void {
    ownSendRef.current = true;
    // We are deliberately putting them at the end, so that is the truth from
    // here. Without it, a photo settling its real height a moment later would
    // read the stale "scrolled away" position and decline to follow it down.
    atBottomRef.current = true;
    setShowJumpToLatest(false);
    setAwayAtCount(null);
  }

  // Confirm the landing once the list stops resizing under it, then give the
  // list back to the reader.
  //
  // Re-armed by every content-size change, so it fires once, after the last
  // batch, rather than part way down a thread still rendering itself. Ending the
  // landing is the other half of the fix: the jump-to-latest pill is suppressed
  // for its whole duration, and since the landing previously only ended on a
  // drag, a thread that came to rest short of the end offered nothing to escape
  // with. From here the ordinary at-bottom rule takes over, which re-pins on
  // layout shifts just the same, so nothing that relied on landing loses it.
  function scheduleLandingSettle(): void {
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = setTimeout(() => {
      settleTimerRef.current = null;
      // The reader took hold while we were waiting. Their position is theirs.
      if (!landingRef.current) return;
      const settle = resolveLandingSettle({
        distanceFromBottom: distanceFromBottomRef.current,
        tolerance: LANDED_TOLERANCE,
      });
      if (settle === "correct") {
        listRef.current?.scrollToEnd({ animated: false });
      }
      landingRef.current = false;
    }, LANDING_SETTLE_MS);
  }

  useEffect(
    () => () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    },
    [],
  );

  function jumpToLatest(): void {
    atBottomRef.current = true;
    setShowJumpToLatest(false);
    setAwayAtCount(null);
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
          t("chat.ecash.already_claimed"),
          t("chat.ecash.already_claimed_body"),
        );
        return;
      }
      showAlert(
        `+${result.amount.toLocaleString()} ${result.unit}`,
        result.outcome === "swapped"
          ? t("wallet.receive.redeemed_at", { mint: hostOf(result.mintUrl) })
          : t("wallet.receive.stored_pending", {
              mint: hostOf(result.mintUrl),
              dleq:
                result.dleq === "valid" ? t("wallet.receive.dleq_inline") : "",
            }),
      );
    } catch (err) {
      reportWalletError(err);
    } finally {
      setClaimingToken(null);
    }
  }

  // Show a brief status hint, then auto-clear after 4 seconds.
  function showStatus(
    kind: "queued" | "no-reach" | "gateway" | "no-group-key" | "group-queued",
  ): void {
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
        text: t("chat.screenshot.you_took"),
        timestampMs: Date.now(),
        isMine: true,
        isSystem: true,
      });
      showAlert(
        t("chat.screenshot.heads_up"),
        isDM
          ? t("chat.screenshot.notified_dm", {
              name: resolveDisplayName(channel.slice(3)),
            })
          : t("chat.screenshot.notified"),
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
      //
      // A group is Bluetooth-only, so reach is the same question a channel
      // broadcast faces, and it gets the same three answers. The status used to
      // be "sent" whenever the packet was merely sealed, which is why a message
      // to a group nobody was in range of still showed a tick. Groups have no
      // delivery receipts on either client, so this tick is all the user gets and
      // it has to be true.
      const sent = service.sendGroupMessage(
        msgChannel.slice("group:".length),
        msg.text,
        msg.id,
      );
      if (!sent.sealed) {
        // We no longer hold the group's key, so the creator removed us. Terminal:
        // unlike every other failure here, walking around does not fix it.
        setStatus(msgChannel, msg.id, "failed");
        showStatus("no-group-key");
      } else if (sent.bleLinks > 0) {
        setStatus(msgChannel, msg.id, "sent");
      } else {
        // Sealed but nobody in range. NOT a failure: the packet is now a gossip
        // candidate for fifteen minutes, so the first member to come into range
        // and ask for a sync gets it. "queued" is exactly that, and it is the
        // common case for a group, whose members are specific people who are
        // usually not all nearby. Marking it failed would paint most group
        // messages red for something that is about to work.
        setStatus(msgChannel, msg.id, "queued");
        showStatus("group-queued");
      }
    } else {
      // Three outcomes: it reached a link or a live relay ("sent"), a gateway
      // peer took it to publish for us ("carried"), or it went nowhere. The
      // middle two used to collapse into the first, because the old result flag
      // meant "this channel can use the internet" rather than "the internet was
      // there", so a location channel on Bluetooth alone showed a sent tick.
      const sent = service.sendChannelMessage(msgChannel, msg.text, nearbyOnly);
      if (sent.bleLinks > 0 || sent.nostr) {
        setStatus(msgChannel, msg.id, "sent");
      } else if (sent.gateway) {
        setStatus(msgChannel, msg.id, "carried");
        showStatus("gateway");
      } else if (isGeo) {
        // A location cell's audience is everyone in it, reached over the
        // internet. A Bluetooth neighbour arriving later will sync the packet,
        // but the cell itself never sees it, so this is as far as it goes.
        setStatus(msgChannel, msg.id, "failed");
        showNoReachStatus();
      } else {
        // A mesh channel's audience IS whoever is in range, and the packet stays
        // a gossip candidate for fifteen minutes, so the next neighbour to turn
        // up gets it. Same reasoning as the group branch above: this is waiting,
        // not broken, and painting it red would be the harsher of two lies.
        setStatus(msgChannel, msg.id, "queued");
        showNoReachStatus();
      }
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
          const reached = service.sendAttachment(
            item.channel,
            bytes,
            {
              type: att.type,
              name: att.name ?? "",
              mimeType: att.mimeType ?? "",
              durationMs: att.durationMs ?? 0,
              // The caption lives on the message text. Without it a retried
              // photo arrived stripped of the words that went with it.
              caption: item.text || undefined,
            },
            // Same rule as a first send: the outcome is known when the radio has
            // taken every fragment, not when the transfer is queued.
            (delivered) => {
              setStatus(item.channel, item.id, delivered ? "sent" : "failed");
            },
          );
          if (!reached) {
            setStatus(item.channel, item.id, "failed");
            showNoReachStatus();
          }
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
    //
    // A DM uses the second person, matching bitchat: its handleEmote sends
    // "slaps you around a bit with a large trout" on the private-chat branch,
    // and its reader matches that literal string. We sent the recipient's
    // nickname instead, which read as a third-person line about them in their
    // own DM. English, never translated: this text crosses the wire and bitchat
    // matches it as a substring.
    const emote = /^\/(hug|slap)(?:\s+(.*))?$/i.exec(text);
    if (emote) {
      const kind = emote[1].toLowerCase();
      // A DM has exactly one recipient, so a trailing @name cannot redirect it
      // and is ignored: the target is always "you".
      const target = isDM ? "you" : (emote[2] ?? "").trim().replace(/^@/, "");
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
    followOwnMessage();
    addMessage(msg);
    setDraft("");

    // Capture nearby-only at send time (only meaningful on the bridged public
    // channel), then reset the composer flag for the next message.
    const nearby = nearbyOnly && channel === BRIDGE_CHANNEL;
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
      // An attachment used to carry no status at all, so a photo sat with no
      // mark beside a text message that had ticks. It starts as "sending"
      // (reading the file and pacing it over the radio is not instant) and
      // settles below once the transfer either leaves or finds no route.
      status: "sending",
    };
    // Same follow as a text send, and it also covers this path's own quirk: a
    // photo's height is not known when its bubble mounts, because
    // ImageAttachment reads the file with Image.getSize and grows the row once
    // it answers. The scroll for the new message therefore lands on a bubble
    // that is still short. followOwnMessage marks the reader as being at the
    // end, so the growth afterwards - a content-size change with no new message
    // in it - re-pins under the ordinary at-bottom rule instead of being
    // declined. Only for the thread on screen: forwarding sends into another
    // one, and that must not move the list the user is looking at.
    if (targetChannel === channel) followOwnMessage();
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
        const reached = service.sendAttachment(
          targetChannel,
          bytes,
          {
            type,
            name: name ?? "",
            mimeType: mimeType ?? "",
            durationMs: durationMs ?? 0,
            caption: caption || undefined,
          },
          // Settled once every fragment has actually been taken by the radio,
          // or once the transfer has given up or been cancelled. The bubble
          // stays on its clock face until then: a photo is thousands of paced
          // writes, not one, and calling it sent the moment it is queued is
          // what let a transfer the radio never carried look delivered.
          (delivered) => {
            useChatStore
              .getState()
              .setMessageStatus(
                targetChannel,
                msg.id,
                delivered ? "sent" : "failed",
              );
            // After the file, not before: the caption should land under the
            // photo it belongs to, and a transfer that never left should not
            // leave a stray line of commentary about a photo that never came.
            if (delivered) sendCaptionForBitchat(targetChannel, caption);
          },
        );
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
          t("chat.attach.not_sent"),
          err instanceof AttachmentTooLargeError
            ? err.message
            : t("chat.attach.read_failed"),
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
    // Forwarding into the thread on screen is a send like any other; forwarding
    // out of it must leave this list exactly where the reader had it.
    if (targetChannel === channel) followOwnMessage();
    addMessage(msg);
    const service = getMeshService();
    if (!service) return;
    if (targetChannel.startsWith("dm:")) {
      service.sendDm(targetChannel.slice(3), source.text);
    } else {
      service.sendChannelMessage(targetChannel, source.text);
    }
  }

  // Bulk forward. Sent oldest-first so the target thread reads in the same order
  // the reader saw them here, and one at a time through the same single-message
  // path, so an attachment forwards exactly as it does on its own.
  function forwardSelected(targetChannel: string): void {
    const picked = msgs
      .filter((m) => selectedIds.has(m.id))
      .sort((a, b) => a.timestampMs - b.timestampMs);
    for (const m of picked) forwardMessage(m, targetChannel);
    // Only the picks: the sheet closes itself after its confirmation tick, and
    // pulling it out from under that would drop the one bit of feedback the
    // forward gives.
    setPickedIds(new Set());
  }

  function clearSelection(): void {
    setPickedIds(new Set());
    setShowBulkForward(false);
  }

  function toggleSelected(item: ChatMessage): void {
    setPickedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
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

  // Refuse an attachment the mesh cannot carry, at the moment it is picked.
  //
  // Only video and documents: those go out as they are, so the cap is final
  // here. A photo does not, because `prepareImageForSend` resizes it under the
  // budget, and a 6 MB camera shot is the ordinary case rather than an error.
  //
  // Without this the file was accepted, a caption sheet opened, a bubble
  // appeared, and only then did reading the bytes throw, leaving a failed
  // message for something that was never sendable. `fileSize` is absent on some
  // platforms, in which case this waves it through and the read-time check in
  // `sendBytes` still catches it.
  function rejectIfTooLarge(
    type: ChatAttachment["type"],
    sizeBytes: number | undefined,
  ): boolean {
    if (sizeBytes === undefined) return false;
    if (type !== "video" && type !== "document") return false;
    const cap = maxBytesForType(type);
    if (sizeBytes <= cap) return false;
    showAlert(
      t("chat.attach.not_sent"),
      t("transfer.too_large", {
        kind: sizeLabel(type),
        size: (sizeBytes / 1024).toFixed(0),
        cap: (cap / 1024).toFixed(0),
      }),
    );
    return true;
  }

  async function handleCameraAttach(): Promise<void> {
    const granted = await ensurePermission(
      () => ImagePicker.getCameraPermissionsAsync(),
      () => ImagePicker.requestCameraPermissionsAsync(),
      {
        label: t("chat.perm.camera_label"),
        purpose: t("chat.perm.camera_purpose"),
      },
    );
    if (!granted) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      // `quality` applies to stills only. A recording is sent as it comes off
      // the camera, and the mesh takes 1 MiB, so the length is the only lever
      // there is: 15 seconds keeps a low-resolution clip in range, and a longer
      // one would be refused after the user had already shot it.
      videoMaxDuration: MAX_VIDEO_SECONDS,
      quality: UPLOAD_QUALITY_VALUES[useSettingsStore.getState().uploadQuality],
      allowsEditing: false,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const type: ChatAttachment["type"] =
      asset.type === "video" ? "video" : "image";
    if (rejectIfTooLarge(type, asset.fileSize)) return;
    setCaptionDraft("");
    setPendingAttachment({
      type,
      uri: asset.uri,
      sizeBytes: asset.fileSize,
      // An image goes out under bitchat's stable-ID name so the far side can
      // dedup it and acknowledge it; video has no such shape and keeps the
      // picker's name.
      name:
        type === "video"
          ? (asset.fileName ?? "video.mp4")
          : wireMediaName("image", "jpg"),
      mimeType: asset.mimeType,
    });
  }

  async function handleLibraryAttach(): Promise<void> {
    const granted = await ensurePermission(
      () => ImagePicker.getMediaLibraryPermissionsAsync(),
      () => ImagePicker.requestMediaLibraryPermissionsAsync(),
      {
        label: t("chat.perm.photo_label"),
        purpose: t("chat.perm.photo_purpose"),
      },
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
    if (rejectIfTooLarge(type, asset.fileSize)) return;
    setCaptionDraft("");
    setPendingAttachment({
      type,
      uri: asset.uri,
      sizeBytes: asset.fileSize,
      // An image goes out under bitchat's stable-ID name so the far side can
      // dedup it and acknowledge it; video has no such shape and keeps the
      // picker's name.
      name:
        type === "video"
          ? (asset.fileName ?? "video.mp4")
          : wireMediaName("image", "jpg"),
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
    if (rejectIfTooLarge("document", asset.size ?? undefined)) return;
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
  // What to warn about before sending this to the peer in this DM, or null when
  // there is nothing to say.
  //
  // Two separate problems, both only with a bitchat recipient:
  //
  //   size  bitchat expires a half-built file 30 seconds after the FIRST piece
  //         arrives, not the last, so anything past that window is dropped on
  //         arrival however well the transfer went.
  //   kind  bitchat accepts a video or a document and stores the bytes, but only
  //         knows how to display images and voice notes, so it shows an
  //         unopenable "[file] name.ext" line.
  //
  // Channels and groups are skipped: they have many recipients of unknown kinds,
  // so a warning there would fire almost always and mean almost nothing.
  function bitchatMediaCaution(
    type: ChatAttachment["type"],
    sizeBytes: number | undefined,
  ): { title: string; body: string } | null {
    if (!isDM) return null;
    if (getMeshService()?.peerRunsAirhop(channel.slice(3)) !== false)
      return null;
    if (sizeBytes !== undefined && sizeBytes > MAX_BITCHAT_TRANSFER_BYTES) {
      return {
        title: t("chat.attach.bitchat_too_big"),
        body: t("chat.attach.bitchat_too_big_body", {
          name: resolveDisplayName(channel.slice(3)),
        }),
      };
    }
    if (type === "video" || type === "document") {
      return {
        title: t("chat.attach.bitchat_unopenable"),
        body: t("chat.attach.bitchat_unopenable_body", {
          name: resolveDisplayName(channel.slice(3)),
        }),
      };
    }
    return null;
  }

  // A caption rides the file packet as an Airhop TLV (0x07) that bitchat skips
  // as an unknown tag, so a bitchat recipient gets the photo and none of the
  // words. Rather than warn about it, send the caption after the file as an
  // ordinary DM: bitchat renders that natively, so the intent survives even
  // though the representation cannot.
  //
  // No local echo. The caption is already on the attachment bubble, and a
  // second bubble would show the sender their own words twice for a difference
  // that is not theirs to care about.
  //
  // DMs only, and only to a peer we KNOW is bitchat. `peerRunsAirhop` returns
  // undefined for a peer we have not identified, and a channel has recipients
  // of both kinds: sending there would double the caption for every Airhop
  // reader to fix it for some bitchat ones.
  function sendCaptionForBitchat(targetChannel: string, caption: string): void {
    if (caption.length === 0) return;
    if (!targetChannel.startsWith("dm:")) return;
    const service = getMeshService();
    const peerID = targetChannel.slice(3);
    if (service?.peerRunsAirhop(peerID) !== false) return;
    service.sendDm(peerID, caption);
  }

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
      // A bitchat recipient handles a video or a document very differently from
      // an Airhop one, and neither difference is visible from this screen, so say
      // it before the send rather than leaving the user with a sent tick and a
      // confused friend. Images never get here: they are always resized under the
      // send budget, and bitchat renders them.
      const caution = bitchatMediaCaution(p.type, p.sizeBytes);
      if (caution !== null) {
        showAlert(caution.title, caution.body, [
          { text: T("common.cancel"), style: "cancel" },
          {
            text: T("chat.attach.send_anyway"),
            onPress: () => {
              sendAttachmentMessage(
                p.type,
                p.uri,
                p.name,
                p.mimeType,
                undefined,
                { sizeBytes: p.sizeBytes, caption },
              );
            },
          },
        ]);
        return;
      }
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
      {
        label: t("chat.perm.mic_label"),
        purpose: t("chat.perm.mic_live_purpose"),
      },
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
      setToast(t("chat.perm.recording_stopped"));
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

  // Inbound bursts only make sound while THIS conversation is what the user is
  // looking at, with the app in front of them. The service compares the burst's
  // own channel against what we report here, so a burst keyed up in the public
  // room never plays over a DM the user is reading, and vice versa. Cleared on
  // unmount, which covers leaving the thread entirely.
  useEffect(() => {
    const service = getMeshService();
    if (!service) return;
    service.setLiveVoiceAudible(appActive ? channel : null);
    return () => service.setLiveVoiceAudible(null);
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
      {
        label: t("chat.perm.mic_label"),
        purpose: t("chat.perm.mic_note_purpose"),
      },
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
      showAlert(T("chat.thread.error"), t("chat.perm.record_failed"));
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
        wireMediaName("voice", "m4a"),
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
    // A tappable deep link that opens Airhop and joins this exact channel,
    // carrying the encryption key so the invitee can both join and read. Only
    // reachable from a private channel: see isPrivate.
    const chat = useChatStore.getState();
    const key = chat.channelKeys[channel];
    const overNostr = chat.channelReach[channel] === "ble+nostr";
    void Share.share({
      message: `${t("chat.thread.invite_body", { channel })}\n\n${channelInviteLink(channel, key, overNostr)}`,
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
                {attachment.name ?? t("chat.media.image")}
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
              accessibilityLabel={t("chat.media.tap_load_photo")}
            >
              <Feather name="image" size={28} color={Colors.textMuted} />
              <Text style={styles.attachImagePlaceholderText}>
                {t("chat.media.tap_load_photo")}
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
            accessibilityLabel={t("chat.media.open_document", {
              name: attachment.name ?? t("chat.media.document"),
            })}
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
                {attachment.name ?? t("chat.attach.document")}
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
              accessibilityLabel={t("chat.media.tap_load_video")}
            >
              <View style={styles.attachVideoPlayBadge}>
                <Feather name="play" size={20} color={Colors.textPrimary} />
              </View>
              <Text style={styles.attachImagePlaceholderText}>
                {t("chat.media.tap_load_video")}
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
      {
        label: t("chat.perm.photo_label"),
        purpose: t("chat.perm.photo_save_purpose"),
      },
    );
    if (!granted) return;
    try {
      await MediaLibrary.saveToLibraryAsync(attachment.uri);
      setToast(
        attachment.type === "video"
          ? t("chat.media.saved_videos")
          : t("chat.media.saved_photos"),
      );
    } catch {
      showAlert(t("chat.media.not_saved"), t("chat.media.not_saved_body"));
    }
  }

  async function openAttachment(attachment: ChatAttachment): Promise<void> {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        showAlert(t("chat.media.cant_open"), t("chat.media.no_app"));
        return;
      }
      await Sharing.shareAsync(attachment.uri, {
        mimeType: attachment.mimeType,
        dialogTitle: attachment.name ?? t("chat.attach.generic"),
      });
    } catch {
      showAlert(t("chat.media.cant_open"), t("chat.media.open_failed"));
    }
  }

  function renderTokenCard(
    token: EmbeddedToken,
    isMine: boolean,
    reclaimed: boolean,
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
        {/* A send the user pulled back. On the card, not just in the message
            info: the amount is printed right above, so without this the card
            still reads as money the recipient can take. */}
        {isMine && reclaimed && (
          <View style={styles.paymentCardVoid}>
            <Feather name="rotate-ccw" size={13} color={Colors.textMuted} />
            <Text style={styles.paymentCardVoidText}>
              {T("chat.ecash.reclaimed")}
            </Text>
          </View>
        )}
        {/* Nothing to claim on a token you sent: your copy of those proofs is
            already reserved against the pending send. */}
        {!isMine &&
          (isTokenClaimed(token) ? (
            <View style={styles.paymentCardClaimed}>
              <Feather name="check" size={13} color={Colors.online} />
              <Text style={styles.paymentCardClaimedText}>
                {t("chat.ecash.claimed")}
              </Text>
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
              accessibilityLabel={t("chat.ecash.claim_amount", {
                amount: token.info.amount.toLocaleString(),
                unit: token.info.unit,
              })}
            >
              <Text style={styles.paymentCardClaimText}>
                {claimingToken === token.raw
                  ? t("chat.ecash.claiming")
                  : t("chat.ecash.claim")}
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
  const displayName = channel.startsWith("dm:")
    ? resolveDisplayName(channel.slice(3))
    : isGroup
      ? (groupName ?? T("chat.thread.group"))
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
          onPress={selecting ? clearSelection : onBack}
          style={styles.backButton}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={
            selecting
              ? T("chat.select.cancel")
              : backUnreadCount > 0
                ? t("chat.thread.go_back_unread", { count: backUnreadCount })
                : T("chat.thread.go_back")
          }
        >
          <Feather
            name={selecting ? "x" : chevronBack}
            size={24}
            color={Colors.textPrimary}
          />
          {!selecting && backUnreadCount > 0 && (
            <View
              style={styles.backBadge}
              importantForAccessibility="no-hide-descendants"
              accessibilityElementsHidden
            >
              <Text
                style={styles.backBadgeText}
                maxFontSizeMultiplier={MaxFontScale.badge}
              >
                {backUnreadCount > 99 ? "99+" : String(backUnreadCount)}
              </Text>
            </View>
          )}
        </Pressable>

        {/* While selecting, the header states the count instead of the chat's
            identity: the title is the one place with room for it, and opening
            the info sheet mid-selection would lose the picks. */}
        {selecting ? (
          <View style={styles.headerCenter}>
            <Text style={styles.channelTitle} numberOfLines={1}>
              {TP("chat.select.count", selectedIds.size)}
            </Text>
          </View>
        ) : (
          <Pressable
            style={styles.headerCenter}
            onPress={() => {
              if (!isDM) setShowChannelInfo(true);
              else setShowDMInfo(true);
            }}
            accessibilityRole="button"
            accessibilityLabel={t("chat.thread.view_info", {
              name: isDM ? displayName : channel,
            })}
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
                {/* A group is always sealed under its epoch key, so it is named
                  the same way and in the same words as the info sheet's scope
                  tag: a bare member count said nothing about who can read it. */}
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {isGroup
                    ? TP("chat.group_members", memberCount)
                    : channelSubtitle}
                </Text>
              </>
            )}
          </Pressable>
        )}

        {/* Channel actions, on one track: the same pill the notice composer's
            expiry steps sit in, so a row of icon buttons is spaced and shaped
            the way every other cluster of small controls in the app is. Only
            channels have these, so the pill is absent (not empty) elsewhere.
            Notices apply to every channel; inviting does not, so a public or
            location channel shows the pill with the one button in it. */}
        {!isDM && !isGroup && !selecting && (
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerAction}
              onPress={openNotices}
              hitSlop={hitSlopFor(32)}
              accessibilityRole="button"
              accessibilityLabel={
                unseenNotices > 0
                  ? t("chat.thread.notices_new", { count: unseenNotices })
                  : T("chat.thread.notices")
              }
            >
              <MaterialCommunityIcons
                name="bulletin-board"
                size={18}
                color={Colors.textSecondary}
              />
              {unseenNotices > 0 && <View style={styles.noticeDot} />}
            </Pressable>
            {/* Invite, only where an invite means something. In a private
                channel the link carries the key, so it is the only way in. */}
            {isPrivate && (
              <>
                {/* Hairline between the two, so the track reads as two buttons
                    rather than one wide one. */}
                <View style={styles.headerActionDivider} />
                <Pressable
                  style={styles.headerAction}
                  onPress={handleInvite}
                  hitSlop={hitSlopFor(32)}
                  accessibilityRole="button"
                  accessibilityLabel={T("chat.thread.invite")}
                >
                  <Feather
                    name="user-plus"
                    size={18}
                    color={Colors.textSecondary}
                  />
                </Pressable>
              </>
            )}
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
              ? T("chat.thread.not_in_range")
              : T("chat.thread.not_nearby")}
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
                  renderToken={(token) =>
                    renderTokenCard(
                      token,
                      item.isMine,
                      item.status === "reclaimed",
                    )
                  }
                  renderAttachment={(attachment) =>
                    renderAttachmentBubble(attachment, item.id, item.isMine)
                  }
                  formatTime={formatClockTime}
                  onLongPress={handleLongPressMessage}
                  selecting={selecting}
                  selected={selectedIds.has(item.id)}
                  onToggleSelect={toggleSelected}
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
            // Consumed here, not left set: it describes this one measurement,
            // and a send that has already been followed must not also claim the
            // next image that finishes loading.
            const ownMessage = ownSendRef.current;
            ownSendRef.current = false;

            const scroll = resolveThreadScroll({
              landing: landingRef.current,
              atBottom: atBottomRef.current,
              countChanged,
              ownMessage,
            });
            if (scroll === "none") return;
            listRef.current?.scrollToEnd({ animated: scroll === "animated" });
            // Keep the flag honest: content that grew between our scroll and
            // the throttled scroll event it triggers would otherwise report the
            // reader as having moved away from a bottom they never left.
            if (landingRef.current) {
              atBottomRef.current = true;
              // This event is the only thing driving the landing, so the landing
              // would otherwise end wherever the last one happened to leave it.
              // Re-arm the check instead: it runs once the batches stop coming.
              scheduleLandingSettle();
            }
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
              <Text style={styles.emptyTitle}>{T("chat.thread.empty")}</Text>
              <Text style={styles.emptySubtitle}>
                {isDM
                  ? T("chat.thread.empty_desc")
                  : t("chat.thread.say_something", {
                      // Never the raw store key: a group's key is
                      // "group:<id>", which read as "Say something in
                      // group:7920…". Same label the header shows.
                      channel: isGroup ? displayName : channelLabel,
                    })}
              </Text>
            </View>
          }
          contentContainerStyle={styles.list}
        />

        {/* Jump to latest, shown only while the reader is away from the end:
            the other half of not auto-scrolling. Badged with what has arrived
            since, because "nine people replied" is the reason to take the trip
            and a bare chevron makes you guess. Hidden at zero. */}
        {showJumpToLatest && msgs.length > 0 && (
          <Pressable
            style={styles.jumpToLatest}
            onPress={jumpToLatest}
            hitSlop={hitSlopFor(JUMP_BUTTON_SIZE)}
            accessibilityRole="button"
            accessibilityLabel={
              newWhileAway > 0
                ? t("chat.thread.jump_latest_new", { count: newWhileAway })
                : T("chat.thread.jump_latest")
            }
          >
            <Feather name="chevron-down" size={20} color={Colors.textPrimary} />
            {newWhileAway > 0 && (
              <View
                style={styles.jumpBadge}
                importantForAccessibility="no-hide-descendants"
                accessibilityElementsHidden
              >
                <Text
                  style={styles.jumpBadgeText}
                  maxFontSizeMultiplier={MaxFontScale.badge}
                >
                  {newWhileAway > 99 ? "99+" : String(newWhileAway)}
                </Text>
              </View>
            )}
          </Pressable>
        )}
      </View>

      {/* Standing notice rather than a per-send one, so the limit is clear
          before anything is typed. Hidden while a per-send hint is up, so the
          two never stack. */}
      {needsInternet && dmStatus === null && !selecting && (
        <View style={styles.dmStatusBar}>
          <Feather name="wifi-off" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>
            {isManualGeo
              ? T("chat.thread.cell_needs_internet")
              : T("chat.thread.channel_needs_internet")}
          </Text>
        </View>
      )}

      {/* Per-send hints. "queued": a DM is held for later retry. "gateway": a
          nearby peer is taking a channel post to the internet for us.
          "no-reach": no peers, no live cell and no gateway, so it went
          nowhere. */}
      {isDM && dmStatus === "queued" && (
        <View style={styles.dmStatusBar}>
          <Feather name="clock" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>{T("chat.thread.no_route")}</Text>
        </View>
      )}
      {!isDM && dmStatus === "gateway" && (
        <View style={styles.dmStatusBar}>
          <Feather name="radio" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>
            {T("chat.thread.via_gateway")}
          </Text>
        </View>
      )}
      {/* Sealed, held, and waiting for a member to come into range. */}
      {!isDM && dmStatus === "group-queued" && (
        <View style={styles.dmStatusBar}>
          <Feather name="clock" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>
            {T("chat.thread.group_queued")}
          </Text>
        </View>
      )}

      {/* We no longer hold this group's key, so nothing can be sent or read.
          Distinct from "nobody nearby": walking around will not fix it. */}
      {!isDM && dmStatus === "no-group-key" && (
        <View style={styles.dmStatusBar}>
          <Feather name="lock" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>
            {T("chat.thread.no_group_key")}
          </Text>
        </View>
      )}
      {!isDM && dmStatus === "no-reach" && (
        <View style={styles.dmStatusBar}>
          <Feather name="alert-circle" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>
            {needsInternet
              ? T("chat.thread.no_reach_offline")
              : T("chat.thread.no_reach")}
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
              accessibilityLabel={T("chat.media.photo")}
            />
          )}
          <Pressable
            style={styles.fullscreenClose}
            onPress={() => setFullscreenImage(null)}
            hitSlop={hitSlopFor(20)}
            accessibilityRole="button"
            accessibilityLabel={T("chat.media.close_photo")}
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
                hitSlop={hitSlopFor(20)}
                accessibilityRole="button"
                accessibilityLabel={T("chat.media.save_photo")}
              >
                <Feather name="download" size={22} color="#FFFFFF" />
              </Pressable>
              <Pressable
                style={styles.fullscreenAction}
                onPress={() =>
                  void openAttachment({ type: "image", uri: fullscreenImage })
                }
                hitSlop={hitSlopFor(20)}
                accessibilityRole="button"
                accessibilityLabel={T("chat.media.share_photo")}
              >
                <Feather name="share" size={22} color="#FFFFFF" />
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
      {!selecting && slashMatches.length > 0 && (
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
                accessibilityLabel={T("chat.cmd.a11y", {
                  cmd: c.cmd,
                  hint: T(c.hintKey),
                })}
              >
                <Text style={styles.slashEmoji}>{c.emoji}</Text>
                <View style={styles.slashText}>
                  <Text style={styles.slashCmd}>/{c.cmd}</Text>
                  <Text style={styles.slashHint}>{T(c.hintKey)}</Text>
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
                accessibilityLabel={t("chat.thread.mention", {
                  name: c.nickname,
                })}
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
      {channel === BRIDGE_CHANNEL && bridgeEnabled && !selecting && (
        <Pressable
          style={styles.nearbyOnlyRow}
          onPress={() => setNearbyOnly((v) => !v)}
          accessibilityRole="switch"
          accessibilityState={{ checked: nearbyOnly }}
          accessibilityLabel={T("chat.bridge.nearby_only")}
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
              ? T("chat.bridge.nearby_label")
              : T("chat.bridge.bridging_label")}
          </Text>
        </Pressable>
      )}

      {/* Selection bar, in place of the compose bar. Bottom of the screen so
          Forward is under the thumb, the same reach the send button has. */}
      {selecting && (
        <View style={styles.selectBar}>
          <Pressable
            style={styles.selectForward}
            onPress={() => setShowBulkForward(true)}
            accessibilityRole="button"
            accessibilityLabel={TP("chat.select.forward", selectedIds.size)}
          >
            <Feather
              name="corner-up-right"
              size={17}
              color={Colors.textInverse}
            />
            <Text style={styles.selectForwardText}>
              {TP("chat.select.forward", selectedIds.size)}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Compose bar */}
      {!selecting && (
        <View style={styles.composeBar}>
          {/* Attach. Always present, greyed where media cannot be delivered, so
            the bar keeps its shape and the reason is one tap away. */}
          <Pressable
            style={[
              styles.attachButton,
              !mediaAllowed && styles.composeDisabled,
            ]}
            onPress={mediaAllowed ? handleAttach : explainMediaBlocked}
            hitSlop={hitSlopFor(COMPOSE_ATTACH_SIZE)}
            accessibilityRole="button"
            accessibilityLabel={
              mediaAllowed
                ? T("chat.attach.file")
                : T("chat.attach.unavailable")
            }
            accessibilityState={{ disabled: !mediaAllowed }}
          >
            <Feather name="plus" size={20} color={Colors.textMuted} />
          </Pressable>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder={T("chat.thread.message_placeholder")}
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={2000}
            returnKeyType="send"
            blurOnSubmit
            onSubmitEditing={handleSend}
            selectionColor={Colors.accent}
            // The placeholder is the only thing naming this field, and it vanishes
            // the moment there is a draft.
            accessibilityLabel={T("chat.thread.message")}
          />

          {draft.trim().length > 0 ? (
            // Send button: shown when there is text
            <Pressable
              style={styles.sendButton}
              onPress={handleSend}
              hitSlop={hitSlopFor(COMPOSE_BUTTON_SIZE)}
              accessibilityRole="button"
              accessibilityLabel={T("chat.thread.send")}
            >
              <Feather name="arrow-up" size={18} color={Colors.textInverse} />
            </Pressable>
          ) : !mediaAllowed ? (
            // Voice is media, so it is off wherever attachments are, and it says
            // so the same way rather than leaving a gap in the bar.
            <Pressable
              style={[styles.pttButton, styles.composeDisabled]}
              onPress={explainMediaBlocked}
              hitSlop={hitSlopFor(COMPOSE_BUTTON_SIZE)}
              accessibilityRole="button"
              accessibilityLabel={T("chat.voice.unavailable")}
              accessibilityState={{ disabled: true }}
            >
              <Feather name="mic" size={16} color={Colors.textMuted} />
            </Pressable>
          ) : (
            // PTT button: hold to talk.
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
                onPressIn={() => {
                  // Push-to-talk is the one control in the app used without
                  // looking at it: you hold the phone up and speak. A haptic on
                  // open and on close is how every walkie-talkie app confirms the
                  // channel without asking for your eyes. Medium on start (the
                  // mic is live now), light on release (it closed cleanly).
                  void Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Medium,
                  ).catch(() => {});
                  void handleTalkStart();
                }}
                onPressOut={() => {
                  void Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Light,
                  ).catch(() => {});
                  void handleTalkEnd();
                }}
                hitSlop={hitSlopFor(COMPOSE_BUTTON_SIZE)}
                accessibilityRole="button"
                accessibilityLabel={
                  liveTalker !== null
                    ? T("chat.thread.someone_talking", {
                        hold: liveAvailable
                          ? T("chat.voice.hold_live")
                          : T("chat.voice.hold_record"),
                        name: liveTalker,
                      })
                    : liveAvailable
                      ? T("chat.voice.hold_live")
                      : T("chat.voice.hold_record")
                }
              >
                {/* Always the mic. The radio glyph already means "the mesh"
                  elsewhere (peer list, radar, network settings), so state is
                  carried by colour instead:

                    muted  hold records a voice note
                    accent hold goes out live
                    danger you are live right now

                  Busy is the border, a separate property, so "live available"
                  and "someone else is talking" can both show at once. */}
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
      )}

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
              isTalkingLive
                ? T("chat.voice.stop_discard")
                : T("chat.voice.cancel_recording")
            }
          >
            <Feather name="x" size={18} color={Colors.textMuted} />
          </Pressable>
          {/* LIVE is not decoration. A voice note can be cancelled before
              anyone hears it; a live burst cannot, because it already played
              on the other phone. The sender has to be able to tell which one
              they are in without thinking about it. */}
          {/* Past the ceiling the burst has stopped going out, so the badge
              must stop claiming otherwise. It says ENDED and drops the red,
              which is the only signal the sender gets that letting go is now
              the only thing left to do. */}
          {isTalkingLive && (
            <View style={[styles.liveBadge, burstEnded && styles.endedBadge]}>
              {!burstEnded && <View style={styles.liveDot} />}
              <Text
                style={[styles.liveBadgeText, burstEnded && styles.endedText]}
              >
                {burstEnded ? "ENDED" : "LIVE"}
              </Text>
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
                  isTalkingLive && !burstEnded && styles.recordingBarLive,
                ]}
              />
            ))}
          </View>
          {/* Elapsed throughout, so it reads the same as a recording. The
              colour is the warning: muted once the burst is over, and only in
              the last seconds before that does it turn red. */}
          <Text
            style={[
              styles.recordingTimer,
              burstEnded && styles.recordingTimerEnded,
            ]}
            accessibilityLabel={
              burstEnded
                ? T("chat.voice.limit_reached")
                : formatDuration(recordingSecs)
            }
          >
            {formatDuration(burstEnded ? BURST_MAX_SECS : recordingSecs)}
          </Text>
          {/* A live burst ends by letting go, so there is nothing to "send".
              Showing a send button would imply the audio is still waiting on
              this device when it left as it was spoken. */}
          {!isTalkingLive && (
            <Pressable
              style={styles.recordingStop}
              onPress={() => void stopRecording()}
              accessibilityRole="button"
              accessibilityLabel={T("chat.voice.stop_send")}
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
        <Text style={styles.attachSheetTitle}>{T("chat.attach.title")}</Text>
        {ATTACH_OPTIONS.filter((o) => !o.dmOnly || isDM).map(
          ({ action, icon, labelKey, descKey }, i) => (
            <React.Fragment key={action}>
              {i > 0 && <View style={styles.attachSeparator} />}
              <Pressable
                style={styles.attachOption}
                onPress={() => handleAttachAction(action)}
                accessibilityRole="button"
                accessibilityLabel={T(labelKey)}
              >
                <View style={styles.attachOptionIcon}>
                  <Feather name={icon} size={20} color={Colors.textSecondary} />
                </View>
                <View style={styles.attachOptionBody}>
                  <Text style={styles.attachOptionLabel}>{T(labelKey)}</Text>
                  <Text style={styles.attachOptionDesc}>{T(descKey)}</Text>
                </View>
              </Pressable>
            </React.Fragment>
          ),
        )}
        <View style={styles.attachNote}>
          <Feather name="bluetooth" size={12} color={Colors.textMuted} />
          <Text style={styles.attachNoteText}>
            {T("chat.thread.attach_note")}
          </Text>
        </View>
        <Pressable
          style={styles.attachCancel}
          onPress={() => setShowAttachMenu(false)}
          accessibilityRole="button"
        >
          <Text style={styles.attachCancelText}>{T("common.cancel")}</Text>
        </Pressable>
      </BottomSheet>

      {/* Send ecash: DM-only attach option. The sheet is shared with the
          contact sheet, the Mesh tab and the Wallet tab, so the rail chosen and
          the words used to describe it are the same wherever you start from. */}
      {isDM && dmPeerID !== null && (
        <SendEcashSheet
          visible={showSendEcash}
          onClose={() => setShowSendEcash(false)}
          peerID={dmPeerID}
          {...(dmContactNostr !== undefined
            ? { nostrPubkey: dmContactNostr }
            : {})}
          displayName={displayName}
          senderNickname={localNickname}
        />
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
          sheet the DM list's contact-info action uses, so the two never diverge. */}
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
                (pendingAttachment?.type === "video"
                  ? T("chat.media.video")
                  : T("chat.attach.document"))}
            </Text>
          </View>
        )}
        <View style={styles.composerInputRow}>
          <TextInput
            style={styles.composerInput}
            placeholder={T("chat.attach.caption")}
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
            accessibilityLabel={T("chat.attach.send")}
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
                  hitSlop={hitSlopFor(28)}
                  accessibilityRole="button"
                  accessibilityLabel={T("chat.thread.back_to_members")}
                >
                  <Feather
                    name={chevronBack}
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
                  <Pressable
                    style={styles.keyBox}
                    onPress={() => handleCopySenderKey(senderInfoTarget.peerID)}
                    accessibilityRole="button"
                    accessibilityLabel={T("chat.contact.copy_nostr")}
                  >
                    <Text style={styles.keyBoxLabel}>
                      {T("chat.thread.nostr_key")}
                    </Text>
                    <View style={styles.keyBoxRow}>
                      <Text style={styles.keyBoxValue}>
                        {senderInfoTarget.peerID.slice(NOSTR_ID_PREFIX.length)}
                      </Text>
                      <Feather
                        name={senderKeyCopied ? "check" : "copy"}
                        size={15}
                        color={
                          senderKeyCopied ? Colors.online : Colors.textMuted
                        }
                      />
                    </View>
                  </Pressable>
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
                    <Text style={styles.dmInfoStatusText}>
                      {T("chat.thread.in_ble_range")}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.dmInfoActions}>
                <Pressable
                  style={styles.senderInfoMessageBtn}
                  onPress={handleMessageSender}
                  accessibilityRole="button"
                  accessibilityLabel={t("chat.thread.message_peer", {
                    name: resolveDisplayName(senderInfoTarget.peerID),
                  })}
                >
                  <Feather
                    name="message-circle"
                    size={16}
                    color={Colors.textInverse}
                  />
                  <Text style={styles.senderInfoMessageText}>
                    {T("chat.thread.message")}
                  </Text>
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
        onSelect={() => {
          const target = actionSheet;
          if (target) setPickedIds(new Set([target.id]));
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

      {/* Same picker for a bulk forward. A separate instance rather than a
          shared one, so its own close animation is not tangled with the
          single-message path's. */}
      <ForwardSheet
        visible={showBulkForward}
        excludeChannel={channel}
        onClose={() => setShowBulkForward(false)}
        onForward={(target) => {
          forwardSelected(target);
          onNavigateToChannel(target);
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
      end: 0,
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
      fontSize: FontSize["2xs"],
      fontVariant: ["tabular-nums"],
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
      fontSize: FontSize["2xs"],
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
      end: Spacing.base,
      bottom: Spacing.md,
      width: JUMP_BUTTON_SIZE,
      height: JUMP_BUTTON_SIZE,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
      ...Shadow.medium,
    },
    // Same badge as the back button's unread count, so a number over a circular
    // control means one thing throughout the thread. Ringed in the list's own
    // background rather than the button's, because it straddles that edge.
    jumpBadge: {
      position: "absolute",
      top: -2,
      end: -2,
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
    jumpBadgeText: {
      fontSize: FontSize["2xs"],
      fontVariant: ["tabular-nums"],
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
      lineHeight: 12,
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
    // Selection bar: one full-width action in the compose bar's slot, so the
    // row keeps the same height and border as the bar it stands in for.
    selectBar: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      backgroundColor: Colors.bg,
    },
    selectForward: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      minHeight: MIN_TOUCH,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
    },
    selectForwardText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textInverse,
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
      width: COMPOSE_ATTACH_SIZE,
      height: COMPOSE_ATTACH_SIZE,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginBottom: 3,
    },
    // A compose control that is present but cannot act here. Dimmed rather
    // than recoloured, the same treatment SettingSwitch gives a locked switch,
    // so it still reads as itself and plainly not available.
    composeDisabled: {
      opacity: 0.4,
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
      width: COMPOSE_BUTTON_SIZE,
      height: COMPOSE_BUTTON_SIZE,
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginBottom: 1,
    },
    pttButton: {
      width: COMPOSE_BUTTON_SIZE,
      height: COMPOSE_BUTTON_SIZE,
      borderRadius: Radius.full,
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
      borderRadius: Radius.xs,
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
    // The ended state of the LIVE badge: same shape, none of the urgency.
    endedBadge: {
      backgroundColor: Colors.surfaceRaised,
    },
    endedText: {
      color: Colors.textMuted,
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
      borderRadius: Radius.full,
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
      marginStart: 40 + Spacing.base + Spacing.sm,
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
    // Dismiss actions read at full contrast, matching the wallet sheets,
    // the scanner and the alert buttons: a muted label on a filled pill
    // reads as disabled rather than as the quieter of two choices.
    attachCancelText: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.semibold,
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
      borderRadius: Radius.xs,
      backgroundColor: Colors.danger,
    },
    recordingTimer: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.danger,
      minWidth: 32,
      textAlign: textAlignEnd,
      flexShrink: 0,
    },
    recordingTimerEnded: {
      color: Colors.textMuted,
    },
    recordingStop: {
      width: 40,
      height: 40,
      backgroundColor: Colors.danger,
      borderRadius: Radius.full,
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
      borderRadius: Radius.full,
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
      end: 20,
      width: 40,
      height: 40,
      borderRadius: Radius.full,
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
      borderRadius: Radius.full,
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
      borderRadius: Radius.full,
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
      borderRadius: Radius.xs,
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
      start: Spacing.base,
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
    dmInfoStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      marginTop: Spacing.xs,
    },
    dmInfoDot: {
      width: 8,
      height: 8,
      borderRadius: Radius.full,
      backgroundColor: Colors.online,
    },
    // Unseen-notices dot on the header's board icon.
    // Sits inside the icon button now that it lives on a track: hung off the
    // corner it would straddle the pill's border. Ringed in the track's own
    // colour so it reads as a cutout, the same trick the back badge uses.
    noticeDot: {
      position: "absolute",
      top: 5,
      end: 5,
      width: 8,
      height: 8,
      borderRadius: Radius.full,
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
      borderRadius: Radius.full,
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
    // Same row as "Claimed", muted rather than green: the absence of a payment
    // rather than the completion of one.
    paymentCardVoid: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      alignSelf: "flex-start",
      marginTop: Spacing.xs,
    },
    paymentCardVoidText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontWeight: FontWeight.semibold,
    },
    paymentCardClaimText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textInverse,
    },
  });
}
