// Message thread screen for a single channel.
// Shows messages with sender and timestamp. Text input to compose and PTT button.

import {
  MAX_BITCHAT_TRANSFER_BYTES,
  MAX_VIDEO_SECONDS,
  maxBytesForType,
  wireMediaName,
} from "@core/mesh/bitchat-file-packet";
import { nicknameKey, normalizeNickname } from "@core/mesh/nickname";
import { PRIVATE_MESSAGE_MAX_CONTENT_BYTES } from "@core/mesh/noise-payload";
import { MAX_BURST_MS } from "@core/mesh/voice-capture";
import {
  findTokensInText,
  mayContainToken,
  type EmbeddedToken,
} from "@core/payments/cashu";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { t, useT, useTPlural, type TranslationKey } from "@i18n";
import { chevronBack, isRTLLayout, textAlignEnd } from "@i18n/layout";
import { acknowledged, held } from "@platform/haptics";
import { ensurePermission } from "@platform/permissions";
import {
  setAudioForPlayback,
  setAudioForRecording,
} from "@services/audio-session";
import {
  adoptIntoAttachmentCache,
  AttachmentTooLargeError,
  CACHE_FILE_PREFIX,
  sizeLabel,
} from "@services/file-transfer-service";
import {
  isGeoChannel,
  isManualGeoChannel,
  manualGeohashOf,
  type GeoParticipant,
} from "@services/geohash-channel-service";
import { prepareImageForSend } from "@services/image-compression";
import { hasLocationPermission } from "@services/location-service";
import { getMeshService } from "@services/mesh-service";
import { reportWalletError } from "@services/payment-router";
import { hostOf, receiveToken } from "@services/wallet-service";
import { useActivityStore } from "@store/activity-store";
import { showAlert } from "@store/alert-store";
import { useChannelMembersStore } from "@store/channel-members-store";
import {
  useChatStore,
  type ChatAttachment,
  type ChatMessage,
} from "@store/chat-store";
import { useContactsStore } from "@store/contacts-store";
import { useGroupStore } from "@store/group-store";
import { useMeshStateStore } from "@store/mesh-state-store";
import { REACHABLE_TTL_MS, usePeerStore } from "@store/peer-store";
import { usePlaceNamesStore } from "@store/place-names-store";
import { UPLOAD_QUALITY_VALUES, useSettingsStore } from "@store/settings-store";
import {
  transferEtaSec,
  transferSpeedBps,
  useTransferStore,
} from "@store/transfer-store";
import { useWalletStore } from "@store/wallet-store";
import Avatar from "@ui/components/avatar";
import BottomSheet from "@ui/components/bottom-sheet";
import Toast from "@ui/components/toast";
import { useKeyboardInset } from "@ui/hooks/use-keyboard";
import {
  DISABLED_OPACITY,
  Duration,
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
} from "@ui/theme";
import { channelInviteLink } from "@utils/deep-link";
import { unconfirmedSince } from "@utils/delivery-silence";
import {
  formatBytes,
  formatClockTime,
  formatDateSeparator,
  formatDuration,
  formatLongDate,
} from "@utils/format";
import {
  BRIDGE_CHANNEL,
  canSendMedia,
  mediaBlockedReason,
  notifiesOnScreenshot,
} from "@utils/media-policy";
import { activeMentionQuery, applyMention } from "@utils/mentions";
import { resolveDisplayName } from "@utils/peer-display-name";
import {
  resolveLandingSettle,
  resolveThreadScroll,
} from "@utils/thread-scroll";
import { isNostrId, NOSTR_ID_PREFIX, peerIDToUsername } from "@utils/username";
import { truncateToUtf8Bytes, utf8ByteLength } from "@utils/utf8-budget";
import {
  AudioModule,
  RecordingPresets,
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
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
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
  // Puts a loudness reading on the recorder's status, which is what draws the
  // meter for a plain voice note. The live path gets the same number from its
  // own frames; this is the only way to get it for this one.
  isMeteringEnabled: true,
};

// How often the voice-note meter reads the recorder. The live path reports
// about fifteen times a second on its own clock; this is deliberately slower,
// because every read is a call across the bridge and ten a second is already
// past what the eye resolves in a twelve-bar meter.
const VOICE_METER_POLL_MS = 100;

// Attachments leave one at a time on one paced queue, so at most this many
// transfer cards can be telling the user anything; the rest are at 0% and get
// counted on a single line instead.
const TRANSFER_CARD_LIMIT = 2;

// How often to re-check whether the mic button would go live. Slow on purpose:
// this only changes when peers arrive or leave, and the answer drives an icon,
// not a decision.
const LIVE_AVAILABILITY_POLL_MS = 3000;

// How far the finger travels toward the start of the compose row before letting
// go discards the hold instead of sending it. Sized to the hint text: past the
// drift of a hand held up to speak, within one flick of a thumb already there.
const CANCEL_SLIDE_DISTANCE = 110;

// Where it disarms again. Hysteresis: a single threshold flips state every time
// a resting thumb drifts across it, and each flip is a haptic and a re-render.
const CANCEL_SLIDE_DISARM = 70;

// How far the finger lifts before a held recording becomes a hands-free one.
//
// Shorter than the cancel slide because the two must never be ambiguous: a
// diagonal drag has to resolve to one of them, and cancel is the destructive
// answer, so it takes the longer, more deliberate travel.
const LOCK_SLIDE_DISTANCE = 64;

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
// Header action circles. Same 32pt as the app header's pills, so a circular
// icon button is one size everywhere it appears in chrome.
const HEADER_ICON_SIZE = 32;

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

// What to call the attachment inside a resend request. Its own map rather than
// the transfer labels, which are capitalised for a progress card; this is a
// word mid-sentence.
const RESEND_KIND_KEY: Record<ChatAttachment["type"], TranslationKey> = {
  image: "chat.media.kind_photo",
  video: "chat.media.kind_video",
  voice: "chat.media.kind_voice",
  document: "chat.media.kind_file",
};

interface VoiceNoteBubbleProps {
  uri: string;
  durationMs: number;
  isPlaying: boolean;
  isMine: boolean;
  onToggle: () => void;
  onFinished: () => void;
  onAskResend?: () => void;
}

// Inline video player for a received (or sent) video attachment.
//
// This replaced a static film-icon placeholder: the bytes arrived and
// reassembled correctly, but there was no way to actually watch the video.
function VideoAttachment({
  uri,
  onAskResend,
}: {
  uri: string;
  onAskResend?: () => void;
}): React.JSX.Element {
  const present = useAttachmentPresent(uri);
  const player = useVideoPlayer(uri, (p) => {
    // Don't autoplay: a thread can hold several videos and they would all
    // start at once when the list renders.
    p.loop = false;
  });

  if (!present) {
    return <AttachmentUnavailable kind="video" onAskResend={onAskResend} />;
  }

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

// Whether an attachment's bytes are still on this device.
//
// They go for two ordinary reasons: the seven-day retention sweep, or the user
// clearing the cache. The message row survives either way, and nothing on the
// wire brings the file back, since neither Airhop nor bitchat has a resend
// request. So the bubble says so and offers to ask the sender in words.
//
// Answered during render rather than in an effect: `exists` is a synchronous
// stat, and an effect would render one frame of a working bubble first. Only
// the bubbles on screen are mounted, and the answer is memoised per file.
function useAttachmentPresent(uri: string): boolean {
  return useMemo(() => attachmentPresent(uri), [uri]);
}

// The same question outside a render, for the actions that need an answer at
// the moment they are taken rather than at the moment a bubble was drawn.
function attachmentPresent(uri: string): boolean {
  try {
    return new FileSystem.File(uri).exists;
  } catch {
    // An unreadable path is a missing file to anyone looking at it.
    return false;
  }
}

// The one way the app says a file is no longer here. Shared by every kind, so a
// lost photo, voice note, video and document all read the same.
function AttachmentUnavailable({
  kind,
  onAskResend,
}: {
  kind: ChatAttachment["type"];
  onAskResend?: () => void;
}): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const label =
    kind === "image"
      ? T("chat.media.gone_photo")
      : kind === "video"
        ? T("chat.media.gone_video")
        : kind === "voice"
          ? T("chat.media.gone_voice")
          : T("chat.media.gone_file");
  return (
    <View style={styles.attachGone}>
      <Feather name="clock" size={18} color={Colors.textMuted} />
      <View style={styles.attachGoneBody}>
        <Text style={styles.attachGoneTitle}>{label}</Text>
        <Text style={styles.attachGoneNote}>{T("chat.media.gone_note")}</Text>
      </View>
      {onAskResend && (
        <Pressable
          style={styles.attachGoneAction}
          onPress={onAskResend}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={T("chat.media.ask_resend")}
        >
          <Text style={styles.attachGoneActionText}>
            {T("chat.media.ask_resend")}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// A document row. Tapping opens the OS share/open sheet. The presence check is
// what keeps a missing file from opening an OS error sheet naming a path.
function DocumentAttachment({
  attachment,
  isMine,
  onOpen,
  onAskResend,
}: {
  attachment: ChatAttachment;
  isMine: boolean;
  onOpen: () => void;
  onAskResend?: () => void;
}): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const present = useAttachmentPresent(attachment.uri);
  const subtitle = docSubtitle(attachment);

  if (!present) {
    return <AttachmentUnavailable kind="document" onAskResend={onAskResend} />;
  }

  return (
    <Pressable
      style={styles.attachDoc}
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={t("chat.media.open_document", {
        name: attachment.name ?? t("chat.media.document"),
      })}
    >
      <View style={styles.attachDocIcon}>
        <Feather name="file-text" size={20} color={Colors.textSecondary} />
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
        {subtitle !== null && (
          <Text
            style={[
              styles.attachDocMeta,
              isMine ? styles.textOnMyBubble : styles.textOnTheirBubble,
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <Feather name="external-link" size={14} color={Colors.textMuted} />
    </Pressable>
  );
}

// The collapsed state of a received photo or video, before it is tapped open.
// Checks the file is still there rather than waiting to be tapped: "tap to
// load" on something that cannot load reads as a failed download.
function CollapsedMediaPlaceholder({
  uri,
  kind,
  onReveal,
  onAskResend,
}: {
  uri: string;
  kind: "image" | "video";
  onReveal: () => void;
  onAskResend?: () => void;
}): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const present = useAttachmentPresent(uri);

  if (!present) {
    return <AttachmentUnavailable kind={kind} onAskResend={onAskResend} />;
  }
  if (kind === "video") {
    return (
      <Pressable
        style={styles.attachVideoPoster}
        onPress={onReveal}
        accessibilityRole="button"
        accessibilityLabel={T("chat.media.tap_load_video")}
      >
        <View style={styles.attachVideoPlayBadge}>
          <Feather name="play" size={20} color={Colors.textPrimary} />
        </View>
        <Text style={styles.attachImagePlaceholderText}>
          {T("chat.media.tap_load_video")}
        </Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      style={styles.attachImagePlaceholder}
      onPress={onReveal}
      accessibilityRole="button"
      accessibilityLabel={T("chat.media.tap_load_photo")}
    >
      <Feather name="image" size={28} color={Colors.textMuted} />
      <Text style={styles.attachImagePlaceholderText}>
        {T("chat.media.tap_load_photo")}
      </Text>
    </Pressable>
  );
}

// A photo in a bubble, sized to its own shape.
//
// The dimensions are read off the file rather than carried in the attachment:
// a photo that arrived from a peer has no metadata beyond its bytes, so this is
// the one path that works for both what we sent and what we received.
function ImageAttachment({
  uri,
  onPress,
  onAskResend,
}: {
  uri: string;
  onPress: () => void;
  onAskResend?: () => void;
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
    return <AttachmentUnavailable kind="image" onAskResend={onAskResend} />;
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
  onAskResend,
}: VoiceNoteBubbleProps): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const present = useAttachmentPresent(uri);
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    // A file that is gone cannot play; asking anyway just toggles the button.
    if (isPlaying && present) {
      player.play();
      return;
    }

    player.pause();
  }, [isPlaying, present, player]);

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

  if (!present) {
    return <AttachmentUnavailable kind="voice" onAskResend={onAskResend} />;
  }

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

// The live voice meter: the last WAVE_BARS loudness readings, oldest first, so
// the newest sample enters at the end and the shape scrolls left as somebody
// speaks. Replaces twelve hardcoded heights that never moved and had never
// touched the audio.
//
// One reading arrives roughly fifteen times a second from whichever pipeline is
// running, which is fast enough to read as speech and far too fast to put
// through React. The whole history therefore lives in one shared value and the
// bars animate on the UI thread, the same reason the slide-to-cancel travel
// does: a thread of hundreds of bubbles must not re-render for a meter.
const WAVE_BARS = 12;

// The floor. A bar never disappears, so an idle meter reads as a quiet line
// rather than a gap where a control used to be.
const WAVE_MIN_HEIGHT = 3;

// The ceilings, one per row. The sending bar is its own strip and can afford
// the taller meter the old static bars already used; the incoming banner is a
// single thin line above the composer, so its meter is sized to sit inside that
// without pushing the row taller when somebody shouts.
const WAVE_MAX_HEIGHT = 16;
const WAVE_INCOMING_MAX_HEIGHT = 11;

// Speech RMS lands around 0.05 to 0.25 of full scale, so a bar drawn straight
// from it would barely leave the floor. The square root opens up the quiet end
// where speech actually lives, and the gain puts an ordinary talking voice near
// the top of the track without pinning it there.
const WAVE_GAIN = 1.8;

// Long enough to smooth the step between samples, short enough that the meter
// still lands on the syllable that caused it.
const WAVE_SETTLE_MS = 90;

function WaveBar({
  levels,
  index,
  maxHeight,
  color,
}: {
  levels: SharedValue<number[]>;
  index: number;
  maxHeight: number;
  color: string;
}): React.ReactElement {
  const style = useAnimatedStyle(() => {
    const raw = levels.value[index] ?? 0;
    const shaped = Math.min(1, Math.sqrt(raw) * WAVE_GAIN);
    return {
      height: withTiming(
        WAVE_MIN_HEIGHT + (maxHeight - WAVE_MIN_HEIGHT) * shaped,
        { duration: WAVE_SETTLE_MS },
      ),
    };
  });
  return (
    <Animated.View
      style={[
        { width: 3, borderRadius: Radius.xs, backgroundColor: color },
        style,
      ]}
    />
  );
}

// Decorative in the sense that it carries no text, but not in the sense the old
// bars were: every height here is a measurement of the voice being sent or
// heard. Hidden from screen readers, which are told who is talking in words by
// the row this sits in.
function VoiceWave({
  levels,
  maxHeight,
  color,
  style,
}: {
  levels: SharedValue<number[]>;
  maxHeight: number;
  color: string;
  style: StyleProp<ViewStyle>;
}): React.ReactElement {
  return (
    <View
      style={style}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: WAVE_BARS }, (_, i) => (
        <WaveBar
          key={i}
          levels={levels}
          index={i}
          maxHeight={maxHeight}
          color={color}
        />
      ))}
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
    const cutoff = peerClock - REACHABLE_TTL_MS;
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

  // Membership means something different per room: a geohash channel counts
  // people active in its cell, a private channel counts proven key-holders, and
  // `#bluetooth` counts nearby peers, since radio range is what that room is.
  // Must stay in step with the roster in channel-info-sheet.
  const privateMemberCount = useChannelMembersStore(
    (s) => (s.byChannel[channel] ?? []).length,
  );
  // Every kind counts yourself, so the subtitle, the chat-list row and the
  // member sheet report the same number. A group's roster already lists you; the
  // others are others-only lists, so they add one, matching the "You" row the
  // sheet renders.
  const memberCount = isGroup
    ? (getMeshService()?.groupMemberCount(channel.slice("group:".length)) ?? 0)
    : isGeo
      ? geoMembers.length + 1
      : isPrivate
        ? privateMemberCount + 1
        : peerCount + 1;

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
  //
  // A DM with a location-channel pseudonym is the third case, and it said
  // nothing at all: that conversation has no Bluetooth half to fall back on -
  // their per-cell key is the only address we hold - so with no relay it reaches
  // nobody, and the thread looked perfectly ordinary while doing so.
  const needsInternet =
    (isGeo || channel.startsWith("dm:nostr_")) && !nostrConnected;

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
    channelSubtitleParts.push(
      TP(isGeo ? "chat.presence.active" : "chat.presence.nearby", memberCount),
    );
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
  // A contact we hold NO keys for: added from a bare peer ID (typed, pasted, or
  // an airhop://peer link) and never met.
  //
  // A peer ID is SHA-256 of their Noise key, so it identifies them and encrypts
  // nothing. With no Noise key there is no session and no courier envelope
  // (both are sealed TO that key), and with no Nostr pubkey there is no
  // gift-wrap either - so nothing can carry a message until we are physically
  // near them or they hand us a card.
  //
  // Worth its own line because the composer's ordinary "we'll deliver when a
  // route appears" is, for this one case, a promise that waiting cannot keep:
  // it queues hopefully for a week and then fails. See the notice below.
  const dmContactNoise = useContactsStore((s) =>
    dmPeerID !== null ? s.contacts[dmPeerID]?.noisePubKeyHex : undefined,
  );
  // Heard their announce this session, so the registry holds their keys even if
  // no contact record does.
  const dmPeerHasKeys = usePeerStore((s) =>
    dmPeerID !== null
      ? (s.peers.get(dmPeerID)?.noisePubKeyHex ?? "").length > 0
      : false,
  );
  const dmKeyless =
    dmPeerID !== null &&
    !dmPeerID.startsWith("nostr_") &&
    !dmPeerHasKeys &&
    (dmContactNoise ?? "").length === 0 &&
    (dmContactNostr ?? "").length === 0;

  // A conversation with someone met in a location channel, after we have moved
  // out of the cell it happened in.
  //
  // We can still write to them - the per-cell key is derived from the cell, not
  // from where we are standing - but our inbox for that cell is no longer
  // subscribed, so nothing they send comes back. A thread that half works, with
  // nothing on screen to say which half, reads as the app being broken.
  //
  // Both halves are store-derived, so this is plain render-time state rather
  // than a poll: the cell a conversation belongs to is persisted beside the
  // conversation, and the cells we are listening in are republished whenever
  // the mesh re-resolves them.
  //
  // `liveGeoCells === null` means we cannot tell (no position fix, or the mesh
  // is stopped) and must read exactly like "fine": telling someone a
  // conversation has been left behind because a location fix has not landed
  // would be the same kind of lie as saying nothing at all.
  const geoDmPubkey =
    dmPeerID !== null && dmPeerID.startsWith("nostr_")
      ? dmPeerID.slice("nostr_".length)
      : null;
  const geoDmCell = useChatStore((s) =>
    geoDmPubkey !== null ? s.geoDmCells[geoDmPubkey] : undefined,
  );
  const liveGeoCells = useMeshStateStore((s) => s.liveGeoCells);
  const leftGeoCell =
    geoDmCell !== undefined &&
    liveGeoCells !== null &&
    !liveGeoCells.includes(geoDmCell);
  const [draft, setDraft] = useState("");
  // Focused when something else drafts into the composer, so the text is not
  // left behind a closed keyboard.
  const composerRef = useRef<TextInput>(null);

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
  // Display names of whoever is talking right now, newest floor first. Drives
  // the receiving pill and the ring on the mic button.
  const [liveTalkers, setLiveTalkers] = useState<string[]>([]);
  const liveTalker = liveTalkers[0] ?? null;
  // Whether anyone held the floor at the last report, so the view follows the
  // start of a burst rather than every packet in it.
  const liveTalkingRef = useRef(false);
  // Which press of the mic button we are on, and whether that press went live.
  // Refs rather than state because the gesture handlers are async and read
  // these after awaits, where a render-old closure would lie to them.
  const holdSeqRef = useRef(0);
  const liveHoldRef = useRef(false);
  // How a press ended, for the window where it ended before the microphone had
  // finished opening.
  //
  // Nothing else knows. Opening the mic takes long enough for a whole hold to
  // come and go inside it, and until it resolves the press that started it is
  // the only thing holding the burst - the release handlers cannot close a
  // burst that does not exist yet, and calling into the service mid-open would
  // leave a live microphone behind whatever they did. So they record the verdict
  // and the start applies it. Keyed by press, so a second press landing in the
  // same window cannot inherit the first one's ending - which is also why it is
  // never cleared: press numbers only ever go up, so a stale verdict matches
  // nothing.
  const holdOutcomeRef = useRef<{ hold: number; canceled: boolean } | null>(
    null,
  );
  // The voice meter's history, and the plain array behind it.
  //
  // The ref is the one that gets shifted; the shared value is handed a copy, so
  // the UI thread always reads a settled array rather than one being mutated
  // underneath it. See WaveBar.
  const waveLevels = useSharedValue<number[]>(
    new Array<number>(WAVE_BARS).fill(0),
  );
  const waveHistory = useRef<number[]>(new Array<number>(WAVE_BARS).fill(0));
  const pushWaveLevel = useCallback(
    (level: number): void => {
      waveHistory.current.shift();
      waveHistory.current.push(level);
      waveLevels.value = [...waveHistory.current];
    },
    [waveLevels],
  );
  // Flatten it. The meter is shared by the sending bar and the receiving
  // banner, and whichever appears next must not open showing the tail of the
  // last thing that was said.
  const resetWave = useCallback((): void => {
    waveHistory.current.fill(0);
    waveLevels.value = [...waveHistory.current];
  }, [waveLevels]);
  // How far the finger has slid back from the mic, 0 to CANCEL_SLIDE_DISTANCE.
  // A shared value, not state: it moves every frame of the drag and must not
  // re-render a thread of hundreds of bubbles.
  const cancelSlide = useSharedValue(0);
  // Whether letting go now cancels. Decided on the UI thread beside the travel
  // it derives from; the React copy is for the hint's text, glyph and colour and
  // flips at most twice per hold.
  const cancelArmedShared = useSharedValue(false);
  // Whether THIS hold can be locked, and whether it already was.
  //
  // Read from the gesture worklet, so both are shared values rather than the
  // refs the rest of the hold uses. Locking is offered only once the press has
  // settled on the recording path: a live burst is a floor, and leaving one open
  // with no finger on the button would broadcast the room a microphone nobody
  // is holding.
  const lockAvailableShared = useSharedValue(false);
  const lockedShared = useSharedValue(false);
  const [cancelArmed, setCancelArmed] = useState(false);
  // Whether the recording was started by tap ("Voice note" in the attach sheet,
  // or the accessibility toggle) rather than by holding the mic.
  //
  // Decides what the recording bar offers. On a hold, a finger is on the mic and
  // nothing in the bar is reachable: lifting to reach a button IS the release,
  // which sends. That is why its X appeared to discard and sent instead. Started
  // by tap there is no held finger, so the bar's own controls are the way out.
  const [handsFreeRecording, setHandsFreeRecording] = useState(false);
  const liveVoiceEnabled = useSettingsStore((s) => s.liveVoiceEnabled);
  // Whether a note recording is open right now, for the unmount cleanup. That
  // cleanup is created once, so it cannot read `isRecording` from a render.
  const recordingRef = useRef(false);
  const isRecording = recorderState.isRecording;
  recordingRef.current = isRecording;
  // Voice recording
  const [recordingSecs, setRecordingSecs] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Seconds elapsed, counted beside the state rather than from it. The tick
  // needs to compare against the ceiling in the same pass that increments, and
  // a state updater is the wrong place to decide anything.
  const elapsedRef = useRef(0);
  // A live burst stops going out at the ceiling while the button is still held,
  // so the HUD has to say so. Derived from the same elapsed count the HUD
  // already shows rather than a second timer, so the two can never disagree.
  // Only meaningful for a live burst: a recording is a local file with no
  // airtime to spend, and it is capped by the attachment size limit instead.
  // The recording ceiling, and it applies to both paths for different reasons.
  //
  // Live: the capture layer already stops adding frames past MAX_BURST_MS, so
  // this is the UI catching up with a burst that has already ended.
  // Note: nothing was stopping it. At 32 kbps a recording crosses the 512 KiB
  // voice cap at about 128 s, and `rejectIfTooLarge` deliberately skips voice,
  // so an over-long note was refused by the transport at send with the audio
  // already gone. Same number for both, which is also the one the UI shows.
  const atRecordingLimit = recordingSecs >= BURST_MAX_SECS;
  const burstEnded = isTalkingLive && atRecordingLimit;
  // Read from inside the level listener, which is subscribed once and would
  // otherwise keep driving the meter after the burst it belongs to has ended.
  const atLimitRef = useRef(false);
  atLimitRef.current = atRecordingLimit;
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
    acknowledged();
    setSenderKeyCopied(true);
    // Reffed and cleared on unmount, like every other timer in this file. A bare
    // setTimeout here fires setState against a thread the user has already left.
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setSenderKeyCopied(false), 1500);
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
  //
  // The glyph travels with the line. The pill defaults to a tick, so "Not saved"
  // and "Can't open file" went out under a checkmark.
  const [toast, setToast] = useState<{
    message: string;
    icon: React.ComponentProps<typeof Feather>["name"];
  } | null>(null);
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
  // Set right after scrolling to a search result, cleared after a brief flash.
  // Purely a transient UI cue: nothing about it is persisted.
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevScrollTrigger = useRef(targetMessageTrigger ?? 0);
  // Clears the "copied" pill on the sender-key row.
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up recording timer, DM status timer, and any active sound on unmount.
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (dmStatusTimerRef.current) clearTimeout(dmStatusTimerRef.current);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      void audioRecorder.stop().catch(() => {});
    };
  }, [audioRecorder]);

  const msgs = useMemo(() => messages[channel] ?? [], [messages, channel]);
  const isDM = channel.startsWith("dm:");

  // How long this conversation has been going out with nothing coming back.
  //
  // Stated, never scored: the messages are unconfirmed, not failed, and a peer
  // who returns weeks later really does receive them. It is also the only
  // visible trace of someone who wiped and came back as a new identity - which
  // is unlinkable on purpose, so this says what is true of the transport and
  // guesses nothing about the person. See utils/delivery-silence.
  //
  // Recomputed on the peer clock so it appears without needing the thread
  // reopened; the value changes once a week at most, so the cost is a compare.
  const unconfirmedFrom = useMemo(
    () => (isDM ? unconfirmedSince(msgs, peerClock) : null),
    [isDM, msgs, peerClock],
  );

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
  // One attachment anywhere in the selection blocks every room that refuses
  // media. Blocking the whole target rather than dropping the odd message is
  // the point: a partial forward is worse than none, because the recipient gets
  // a conversation with a hole in it and nobody is told.
  const selectedCarriesMedia = useMemo(
    () => msgs.some((m) => selectedIds.has(m.id) && m.attachment !== undefined),
    [msgs, selectedIds],
  );

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

  // Take the reader to the end and treat them as being there from now on.
  //
  // Three callers, and they are the whole of the rule: the jump-to-latest pill
  // (they asked), keying up (see handleTalkStart), and someone else taking the
  // floor (see the PTT activity listener). Only refs and setters, so its
  // identity is stable and the listener below subscribes once.
  const jumpToLatest = useCallback((): void => {
    atBottomRef.current = true;
    setShowJumpToLatest(false);
    setAwayAtCount(null);
    listRef.current?.scrollToEnd({ animated: true });
  }, []);

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

  // ---- Composer length budget -------------------------------------------------
  //
  // A DM rides a TLV with a one-byte length field, so its budget is 255 UTF-8
  // bytes and belongs to the wire. Channel and group messages carry text as the
  // rest of the payload with no such field, so they keep the 2000-character
  // composer. The budget is per-conversation, not global.
  //
  // Enforced while typing rather than on send. A send-time refusal is the wrong
  // shape for a hard protocol limit: the text is already written, and the only
  // thing left to say is "delete some of that". This is what `maxLength` would
  // do if it could count bytes.
  const draftBudget = isDM ? PRIVATE_MESSAGE_MAX_CONTENT_BYTES : null;
  const draftBytesLeft =
    draftBudget === null ? null : draftBudget - utf8ByteLength(draft);

  // Only near the end. An always-on counter turns a one-line reply into a
  // metered exercise; this explains the stop before it happens, then leaves.
  const DRAFT_COUNTER_FROM = 40;
  const showDraftCounter =
    draftBytesLeft !== null && draftBytesLeft <= DRAFT_COUNTER_FROM;

  function handleDraftChange(next: string): void {
    setDraft(
      draftBudget === null ? next : truncateToUtf8Bytes(next, draftBudget),
    );
  }

  // A channel broadcast that reached no transport at all.
  function showNoReachStatus(): void {
    showStatus("no-reach");
  }

  // Screenshot detection. Who gets told, and why, lives in `media-policy` beside
  // the other per-channel capability rules; the short version is that a notice
  // goes out only where it is encrypted to a bounded set, never onto a public
  // room or a location cell that would publish it to relays.
  const tellsPeersOnScreenshot = notifiesOnScreenshot(channel, isPrivate);
  useEffect(() => {
    const subscription = ScreenCapture.addScreenshotListener(() => {
      const text = screenshotNoticeText(localNickname);
      const service = getMeshService();
      if (service && tellsPeersOnScreenshot) {
        if (isDM) {
          service.sendDm(channel.slice(3), text);
        } else if (isGroup) {
          service.sendGroupMessage(
            channel.slice("group:".length),
            text,
            `${localPeerID}-${Date.now()}`,
          );
        } else {
          // Private channel: sealed under the channel key, so this reaches
          // holders of the invite link and nobody else in radio range.
          service.sendChannelMessage(channel, text);
        }
      }
      addMessage({
        id: `${localPeerID}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        channel,
        senderID: localPeerID,
        senderNickname: localNickname,
        // Say which of the two happened. Claiming the room was told when it was
        // not is the same class of mistake as the broadcast itself.
        text: tellsPeersOnScreenshot
          ? t("chat.screenshot.you_took")
          : t("chat.screenshot.you_took_private"),
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
          : tellsPeersOnScreenshot
            ? t("chat.screenshot.notified")
            : t("chat.screenshot.not_notified"),
      );
    });
    return () => subscription.remove();
  }, [
    channel,
    isDM,
    isGroup,
    tellsPeersOnScreenshot,
    localNickname,
    localPeerID,
    addMessage,
  ]);

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
      // An emote expands a short command into a whole sentence, so it is the
      // one way text can pass the composer budget and still overrun it. Clamp
      // again rather than refuse: the emote is decoration, and a trimmed trout
      // beats a message that encodes to null and vanishes.
      if (draftBudget !== null) text = truncateToUtf8Bytes(text, draftBudget);
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
        // Started by tap, so the recording bar keeps its own cancel and send
        // buttons: there is no held finger for slide-to-cancel to work with.
        void startRecording().then((started) => {
          if (started) setHandsFreeRecording(true);
        });
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
    // Media only travels where canSendMedia allows, and the receiver enforces
    // that too (file-transfer-service drops a packet tagged for a room that
    // refuses media). Sending anyway would leave a bubble here that reaches
    // nobody, so refuse at the source. The composer disables its attach button
    // and the forward sheet greys the target, both with the reason; this is the
    // backstop that keeps any future caller from reopening the hole.
    if (!canSendMedia(targetChannel)) return;
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
  // Returns false when there was nothing to forward, so the caller can leave
  // the reader where they are instead of walking them into a thread to look at
  // a message that never arrived.
  function forwardMessage(source: ChatMessage, targetChannel: string): boolean {
    if (source.attachment) {
      // Attachments live in a cache that is swept after a week and can be
      // cleared by hand. The bubble already reads "no longer available"; say
      // the same thing here rather than starting a send whose only outcome is
      // a red mark in a room the reader was not in a moment ago.
      if (!attachmentPresent(source.attachment.uri)) {
        // The same sentence the bubble is already showing, so the answer to
        // "why not" is one the reader has seen before.
        showAlert(t("chat.attach.not_sent"), t("chat.media.gone_note"));
        return false;
      }
      sendAttachmentMessage(
        source.attachment.type,
        source.attachment.uri,
        source.attachment.name,
        source.attachment.mimeType,
        source.attachment.durationMs,
        // Carry the caption (it lives on the message text) so a forwarded photo
        // keeps its caption, the way it arrived. The size comes along too, or
        // the copy loses the "PDF · 412 KB" line the original had for no reason
        // the reader can see.
        {
          targetChannel,
          forwarded: true,
          caption: source.text || undefined,
          sizeBytes: source.attachment.sizeBytes,
        },
      );
      return true;
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
    if (!service) return true;
    if (targetChannel.startsWith("dm:")) {
      service.sendDm(targetChannel.slice(3), source.text);
    } else {
      service.sendChannelMessage(targetChannel, source.text);
    }
    return true;
  }

  // Bulk forward. Sent oldest-first so the target thread reads in the same order
  // the reader saw them here, and one at a time through the same single-message
  // path, so an attachment forwards exactly as it does on its own.
  //
  // True when any of them went, which is what decides whether the reader is
  // taken to the target thread. A selection where every attachment has aged out
  // of the cache moves nobody anywhere.
  function forwardSelected(targetChannel: string): boolean {
    const picked = msgs
      .filter((m) => selectedIds.has(m.id))
      .sort((a, b) => a.timestampMs - b.timestampMs);
    let sent = false;
    for (const m of picked) sent = forwardMessage(m, targetChannel) || sent;
    // Nothing went, so nothing has changed: the sheet stays open on the target
    // list and the selection stays made, ready for a room that can take it.
    if (!sent) return false;
    // Only the picks: the sheet closes itself after its confirmation tick, and
    // pulling it out from under that would drop the one bit of feedback the
    // forward gives.
    setPickedIds(new Set());
    return true;
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

  // How the sender sheet names whoever it was opened for.
  //
  // The sheet is opened FROM a message, so it has to say what the label above
  // that bubble says. For a location peer that carried name is the only source
  // there is: their nickname rides the `n` tag on channel messages, and nothing
  // records it until a conversation with them opens - so resolving from the
  // pubkey alone produced "anon#last4" beneath a bubble clearly labelled
  // "NeverDie#0c08".
  //
  // A mesh peer still resolves normally, because there a local nickname the user
  // chose outranks whatever name was stored with an old message.
  const senderDisplayName =
    senderInfoTarget === null
      ? ""
      : isNostrId(senderInfoTarget.peerID) &&
          senderInfoTarget.nickname.length > 0
        ? senderInfoTarget.nickname
        : resolveDisplayName(senderInfoTarget.peerID);

  function handleMessageSender(): void {
    if (!senderInfoTarget) return;
    const { peerID, nickname } = senderInfoTarget;
    // Bind the cell before opening the thread, exactly as the members list does.
    //
    // This was missing, and it is not only a lost button. The binding is what
    // tells the send path to write from our PER-CELL identity; without it a
    // reply falls through to our durable Nostr key, so a person we met under a
    // pseudonym is handed our permanent identity - the very leak the per-cell
    // scheme exists to prevent - and "Keep this person" never appears, because
    // there is no cell for the card to travel over.
    //
    // Two doors into the same conversation had different behaviour: tapping
    // someone in the members list was safe, tapping their avatar in the message
    // list was not.
    if (isNostrId(peerID)) {
      // `nickname` is the `nick#last4` this very message list rendered, so the
      // conversation carries the name the channel showed rather than falling
      // back to "anon#last4" the moment it leaves the channel.
      getMeshService()?.openGeoDm(
        channel,
        peerID.slice(NOSTR_ID_PREFIX.length),
        nickname,
      );
    }
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
    burstIDHex: string,
  ): Promise<void> {
    try {
      // Named after the burst it is a recording of, in bitchat's
      // `voice_<16 hex>` shape.
      //
      // That name is the only thing tying this file to the live bubble a
      // listener already has on screen. bitchat matches the two by burst ID and
      // swaps the finished audio into the existing row; a name it cannot parse
      // matches nothing, and the same few seconds of speech arrive twice - once
      // as the burst they heard, once as a note repeating it. See
      // ChatLiveVoiceCoordinator.burstID(fromVoiceFileName:) on iOS and
      // LiveVoiceManager.burstIDFromVoiceFileName on Android; both take the 16
      // characters after `voice_` and require every one of them to be hex.
      //
      // The extension stays `.aac`, because that is what the bytes are: a live
      // burst finalizes as ADTS AAC, not an MP4 container. Only the stem is
      // load-bearing here.
      const wireName = `voice_${burstIDHex}.aac`;
      // Written straight into the attachment cache, under the prefix a recorded
      // note is adopted into, so both are swept and cleared alike.
      const file = new FileSystem.File(
        FileSystem.Paths.cache,
        `${CACHE_FILE_PREFIX}${String(Date.now())}_${wireName}`,
      );
      file.create({ overwrite: true, intermediates: true });
      file.write(bytes);
      sendAttachmentMessage(
        "voice",
        file.uri,
        wireName,
        "audio/aac",
        durationMs,
      );
    } catch {
      // Cache full or unwritable. Nothing to tell the user: they were heard.
    }
  }

  // The recording bar's elapsed-seconds ticker, restarted rather than stacked.
  // Two mic paths used to assign the interval straight into the ref, so starting
  // a hold during a hands-free recording orphaned the first one for the life of
  // the screen and counted up at double speed.
  function startRecordingTimer(): void {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setRecordingSecs(0);
    elapsedRef.current = 0;
    recordingTimerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setRecordingSecs(elapsedRef.current);
      if (elapsedRef.current < BURST_MAX_SECS) return;

      // The ceiling, and it lands here so both paths reach it through one
      // clock. Stopping the timer is what freezes the display, and the meter
      // goes flat beside it: a bar still counting over audio nobody is
      // recording is the app lying about what it is doing.
      clearInterval(recordingTimerRef.current ?? undefined);
      recordingTimerRef.current = null;
      resetWave();

      // The ref, not the state: this fires from a timer that can be a render
      // ahead of it, and being wrong here either sends a live burst as a note
      // or leaves a note recording past its own size cap.
      if (liveHoldRef.current) return;

      // A note is ended rather than parked, because the file is what breaches
      // the cap: at 32 kbps it crosses the 512 KiB voice limit at about this
      // point, and `rejectIfTooLarge` skips voice, so the transport used to
      // refuse it at send with the audio already gone.
      //
      // Sent rather than left under a Send button, which over a recorder that
      // has already stopped would read as though more could still be said. The
      // toast is what stops the send looking spontaneous.
      setToast({ message: t("chat.voice.limit_sent"), icon: "mic-off" });
      void stopRecording();
    }, 1000);
  }

  function stopRecordingTimer(): void {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecordingSecs(0);
    // Every path that closes the sending bar comes through here, so this is
    // where the meter goes flat.
    resetWave();
  }

  // Return the audio session to playback. Every path that closes the microphone
  // must end here.
  //
  // Live voice opens the mic through the native module, not expo-audio, so on
  // iOS the session sits in `.playAndRecord` and expo-audio does not know. Left
  // there, every later playback routes to the earpiece and reads as a broken
  // play button. Three paths skipped it: backgrounding mid-burst, leaving the
  // thread mid-burst, and capture dying - all unwatched, so the symptom
  // surfaced later on an unrelated message.
  async function releaseAudioSession(): Promise<void> {
    await setAudioForPlayback().catch(() => {});
  }

  async function handleTalkStart(): Promise<void> {
    setHandsFreeRecording(false);
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
      // A microphone that never opened leaves the button armed and red with
      // nothing behind it until the finger lifts. The permission itself is
      // already explained by ensurePermission; this is only the button telling
      // the truth about what it is doing, which is nothing.
      if (!(await startRecording(hold))) setIsPTTActive(false);
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
    lockAvailableShared.value = false;
    const live = await service.startVoiceBurst(channel, () => {
      // Capture died under us (a call took the mic). Close the burst and drop
      // the live state so the HUD does not claim to still be transmitting.
      liveHoldRef.current = false;
      setIsTalkingLive(false);
      setIsPTTActive(false);
      void releaseAudioSession();
      setToast({ message: t("chat.perm.recording_stopped"), icon: "mic-off" });
    });
    if (hold !== holdSeqRef.current) {
      // The hold ended while the mic was opening. Close the burst the way the
      // user closed it, rather than merely closing it: a swipe has to retract,
      // or the far side keeps playing audio the talker took back, and a release
      // has to deliver its note, or the words are heard live by everyone in
      // range and exist nowhere afterwards. Same two endings the held path has;
      // this is only the case where the finger got there first.
      //
      // Unless a newer press is already holding this burst. `startVoiceBurst`
      // hands the press that arrives mid-open the burst that is already open
      // rather than a second one, so there is exactly one microphone and one
      // ending, and the ending belongs to whoever has the button now. Closing
      // it here would take the burst out from under a finger that is still
      // down.
      if (live && !liveHoldRef.current) {
        if (
          holdOutcomeRef.current?.hold === hold &&
          holdOutcomeRef.current.canceled
        ) {
          await service.cancelVoiceBurst();
        } else {
          const finalized = await service.stopVoiceBurst();
          if (finalized) {
            await sendLiveBurstAsNote(
              finalized.bytes,
              finalized.durationMs,
              finalized.burstIDHex,
            );
          }
        }
        await releaseAudioSession();
      }
      return;
    }
    if (live) {
      liveHoldRef.current = true;
      setIsTalkingLive(true);
      // Live is not composing: the words are leaving the phone as they are
      // spoken, so the view goes to the end now rather than when the burst
      // finalizes into a voice note. A recorded note is composing and follows
      // the same rule as text, moving the view only on send.
      jumpToLatest();
      startRecordingTimer();
      return;
    }
    // Live was offered and could not start. Fall back rather than dropping the
    // press: the user held the button and expects to have said something.
    if (!(await startRecording(hold))) setIsPTTActive(false);
  }

  async function handleTalkEnd(): Promise<void> {
    // Invalidate any start still in flight, so a burst that opens after this
    // point closes itself instead of running on, and leave it the verdict to
    // close with. See holdOutcomeRef.
    holdOutcomeRef.current = { hold: holdSeqRef.current, canceled: false };
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
    stopRecordingTimer();
    const finalized = await getMeshService()?.stopVoiceBurst();
    await releaseAudioSession();
    // The same audio, now as an ordinary voice note. People in range heard it
    // live; this is what reaches anyone who was not, and what stays in the
    // thread afterwards. It rides the existing attachment path, so it is a
    // normal message row with a normal bubble and needs no special handling on
    // either end.
    //
    // Null for a hold too short to be a message: that decision belongs beside
    // the frame count that makes it, and the burst was retracted rather than
    // ended so nobody is left holding it either. See MIN_BURST_KEEP_MS.
    if (finalized) {
      await sendLiveBurstAsNote(
        finalized.bytes,
        finalized.durationMs,
        finalized.burstIDHex,
      );
    }
  }

  // Released past the slide threshold: discard the hold instead of sending it.
  //
  // A recorded note never left the device, so the discard is complete. A live
  // burst already played in range: CANCELED drops what receivers buffered and
  // removes the bubble, and the note for out-of-range peers is never written.
  // The bar states which case is running before the finger lifts.
  async function handleTalkCancel(): Promise<void> {
    // Same invalidation as handleTalkEnd, so a burst still opening its mic
    // closes itself instead of running on unheld - and the same verdict, which
    // here is what stops a swipe caught inside that window from being delivered
    // as an ordinary release. See holdOutcomeRef.
    holdOutcomeRef.current = { hold: holdSeqRef.current, canceled: true };
    holdSeqRef.current += 1;
    setIsPTTActive(false);
    if (!liveHoldRef.current) {
      await cancelRecording();
      return;
    }
    liveHoldRef.current = false;
    setIsTalkingLive(false);
    stopRecordingTimer();
    await getMeshService()?.cancelVoiceBurst();
    await releaseAudioSession();
  }

  // The handlers are re-declared every render (they close over the channel and
  // the send path), and a gesture rebuilt mid-hold would drop the finger already
  // on it. The gesture is built once and reaches them through this.
  const talkRef = useRef({
    start: handleTalkStart,
    end: handleTalkEnd,
    cancel: handleTalkCancel,
  });
  useEffect(() => {
    talkRef.current = {
      start: handleTalkStart,
      end: handleTalkEnd,
      cancel: handleTalkCancel,
    };
  });

  // The three moments the gesture hands back to React. Stable identities, so
  // the gesture below is built once.
  //
  // Push-to-talk is used without looking at it, so each carries a haptic:
  // medium on open (the mic is live), rigid at the cancel threshold (releasing
  // now does something different), light on close.
  const beginTalk = useCallback((): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
      () => {},
    );
    void talkRef.current.start();
  }, []);

  const reportCancelArmed = useCallback((armed: boolean): void => {
    setCancelArmed(armed);
    void Haptics.impactAsync(
      armed
        ? Haptics.ImpactFeedbackStyle.Rigid
        : Haptics.ImpactFeedbackStyle.Light,
    ).catch(() => {});
  }, []);

  // The hold became hands-free. The microphone is already open and stays open;
  // all that changes is who is holding it, which is now the bar rather than a
  // finger. `handsFreeRecording` is the state that swap has always been made of,
  // so the X and Send appear exactly as they do for a tapped voice note.
  const lockTalk = useCallback((): void => {
    held();
    setCancelArmed(false);
    setIsPTTActive(false);
    setHandsFreeRecording(true);
  }, []);

  const finishTalk = useCallback((cancelled: boolean): void => {
    setCancelArmed(false);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    void (cancelled ? talkRef.current.cancel() : talkRef.current.end());
  }, []);

  // Hold the mic to talk, slide back to cancel.
  //
  // A Pan with no minimum distance: a press that also reports movement.
  // `onBegin` fires as the finger lands; `onFinalize` fires on every ending
  // there is - release, system cancellation, an incoming call - which is what
  // stops a live microphone outliving the touch that opened it.
  //
  // The callbacks are worklets, so the button tracks the finger on the UI thread
  // and crosses to JS three times per hold. During a live burst the JS thread is
  // packetizing and signing audio frames several times a second, and a drag
  // paced by it would stutter in exactly the case this serves.
  const talkGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        // A cancel takes the finger off the button immediately; the hold has to
        // survive that.
        .shouldCancelWhenOutside(false)
        .onBegin(() => {
          cancelSlide.value = 0;
          cancelArmedShared.value = false;
          lockedShared.value = false;
          lockAvailableShared.value = false;
          scheduleOnRN(beginTalk);
        })
        .onUpdate((e) => {
          // Locked: the finger no longer steers anything. The bar's own X and
          // Send are the way out from here.
          if (lockedShared.value) return;
          // Lift to lock, but only on a hold that is recording a note and only
          // while it is not already sliding toward cancel. Checking the slide
          // is what keeps a diagonal drag from doing both.
          if (
            lockAvailableShared.value &&
            cancelSlide.value === 0 &&
            -e.translationY >= LOCK_SLIDE_DISTANCE
          ) {
            lockedShared.value = true;
            cancelSlide.value = withTiming(0, { duration: Duration.base });
            scheduleOnRN(lockTalk);
            return;
          }
          // Toward the start of the row, whichever side that is under RTL.
          const travel = isRTLLayout ? e.translationX : -e.translationX;
          const slid = Math.min(Math.max(travel, 0), CANCEL_SLIDE_DISTANCE);
          cancelSlide.value = slid;
          // Arming takes the full distance, disarming needs most of the way
          // back. See CANCEL_SLIDE_DISARM.
          const armed = cancelArmedShared.value
            ? slid > CANCEL_SLIDE_DISARM
            : slid >= CANCEL_SLIDE_DISTANCE;
          if (armed === cancelArmedShared.value) return;
          cancelArmedShared.value = armed;
          scheduleOnRN(reportCancelArmed, armed);
        })
        .onFinalize(() => {
          // A locked hold has already handed the recording to the bar, so
          // lifting is not a release: ending it here is what would send a note
          // the user has not finished.
          if (lockedShared.value) {
            lockedShared.value = false;
            return;
          }
          const cancelled = cancelArmedShared.value;
          cancelArmedShared.value = false;
          cancelSlide.value = withTiming(0, { duration: Duration.base });
          scheduleOnRN(finishTalk, cancelled);
        }),
    [
      cancelSlide,
      cancelArmedShared,
      lockAvailableShared,
      lockedShared,
      beginTalk,
      reportCancelArmed,
      lockTalk,
      finishTalk,
    ],
  );

  // The button follows the finger, so the slide reads as dragging the recording
  // away rather than as missing the button. It also shrinks, which is the same
  // progress again for a thumb covering the hint text.
  const micSlideStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: (isRTLLayout ? 1 : -1) * cancelSlide.value },
      { scale: 1 - 0.15 * (cancelSlide.value / CANCEL_SLIDE_DISTANCE) },
    ],
  }));

  // The hint fades as the mic closes on it; the armed copy replaces it.
  // Whether to offer the lock. Mirrors the gesture's own condition, minus the
  // travel: a note recording is running, nothing is sliding toward cancel, and
  // the bar is not already hands-free.
  const lockHintVisible =
    isRecording && !isTalkingLive && !handsFreeRecording && !cancelArmed;

  const cancelHintStyle = useAnimatedStyle(() => ({
    opacity: 1 - 0.5 * (cancelSlide.value / CANCEL_SLIDE_DISTANCE),
  }));

  // Who is talking right now, resolved to display names for the receiving pill
  // and the mic button ring. The whole list, not just the first: a mesh has no
  // floor arbiter, so two people keying up at once is ordinary.
  //
  // Only fires for the thread on screen. A burst is audible only in the channel
  // it belongs to (mesh-service gates both the broadcast and the DM path on
  // audibleChannel), and the report follows the audio.
  useEffect(() => {
    const service = getMeshService();
    if (!service) return;
    return service.setPttActivityListener((talkers) => {
      const names = talkers.map(resolveDisplayName);
      setLiveTalkers((prev) =>
        prev.length === names.length && prev.every((n, i) => n === names[i])
          ? prev
          : names,
      );
      // Someone taking the floor moves the view, where an arriving message does
      // not. Their audio is already playing out of this phone, so the
      // interruption has happened either way; following it puts the voice note
      // it finalizes into, and the mic to answer with, where they belong.
      // Only on the transition into talking, not once per burst packet.
      const talking = names.length > 0;
      if (talking && !liveTalkingRef.current) jumpToLatest();
      // Nobody is holding the floor any more, so the banner is about to go and
      // its meter must not be left showing the last thing that was said.
      if (!talking) resetWave();
      liveTalkingRef.current = talking;
    });
  }, [jumpToLatest, resetWave]);

  // The meter, fed from whichever pipeline is actually moving audio.
  //
  // One meter, owned by whichever bar is on screen. Sending wins: while the
  // microphone is open the recording bar is up and the incoming banner is
  // hidden behind it, so the bars have to be the user's own voice.
  //
  // The two directions really can overlap, and not only in the obvious way. A
  // DM burst reaches you over any number of hops, but sending one needs a
  // direct link to that peer, so a peer two hops away streams to you while your
  // own hold falls back to a voice note - which is metered by the poll below,
  // off a different clock. Both pushing into one history is a meter that
  // matches neither voice.
  useEffect(() => {
    const service = getMeshService();
    if (!service) return;
    return service.setPttLevelListener(({ outbound, inbound }) => {
      if (liveHoldRef.current) {
        // Past the ceiling the capture layer is dropping these frames, so the
        // bars would be showing a voice that is no longer going anywhere.
        if (!atLimitRef.current) pushWaveLevel(outbound);
        return;
      }
      // Recording a note: the poll owns the meter, and the banner is hidden.
      if (isRecording) return;
      pushWaveLevel(inbound);
    });
  }, [pushWaveLevel, isRecording]);

  // The same meter for an ordinary voice note, which is recorded by expo-audio
  // rather than by the live pipeline and so has no frames to ride along on.
  //
  // Polled off the recorder rather than read from `recorderState`, whose every
  // sample is a re-render of the whole thread. Metering is in decibels; the
  // conversion turns that back into the same 0-to-1 amplitude the live path
  // reports, so both feed one curve and the two bars look alike.
  useEffect(() => {
    if (!isRecording || isTalkingLive || atRecordingLimit) return;
    const timer = setInterval(() => {
      const db = audioRecorder.getStatus().metering;
      pushWaveLevel(
        typeof db === "number" && Number.isFinite(db)
          ? Math.min(1, 10 ** (db / 20))
          : 0,
      );
    }, VOICE_METER_POLL_MS);
    return () => clearInterval(timer);
  }, [
    isRecording,
    isTalkingLive,
    atRecordingLimit,
    audioRecorder,
    pushWaveLevel,
  ]);

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
  // the user. Backgrounding the app or taking a call while still holding the
  // button lands here, and live voice is foreground-only by design.
  //
  // Ended, not abandoned: the release path, exactly. Whatever was said has
  // already been heard by everyone in range, so it is a message, and a message
  // has to leave a record - the far side gets its END, the thread gets its
  // voice note, and anyone who was out of range still receives it. Ending the
  // burst without the note left listeners holding audio that existed nowhere
  // else, including in the talker's own thread.
  //
  // Only for a live hold. A voice note being recorded was heard by nobody, so
  // an interruption can discard it; that path is unchanged.
  useEffect(() => {
    if (appActive) return;
    if (!liveHoldRef.current) return;
    void talkRef.current.end();
  }, [appActive]);

  // Leaving the thread mid-hold. The same ending as backgrounding, for the same
  // reason: the words were already heard, so they get their END and their note.
  //
  // Through the ref, not a copy of the work. The cleanup is created once and
  // would otherwise close over the first render's channel and nickname, and
  // send the note into whichever conversation this screen opened on. Everything
  // it needs - the store write, the transfer, the audio session - outlives the
  // component, so the send completes after the screen is gone.
  useEffect(
    () => () => {
      if (liveHoldRef.current) {
        void talkRef.current.end();
        return;
      }
      // A note recording nobody is holding: hands-free, or a hold that was
      // locked. Discarded rather than sent, which is what the interruption
      // rule above already says about audio nobody has heard - and unlike a
      // live burst there is no far side waiting on a close.
      //
      // Left running, this outlived the screen: the microphone stayed open and
      // the audio session stayed in record mode, which routes every later
      // playback to the earpiece. Reachable before this through the attach
      // sheet's Voice note; lift-to-lock makes it ordinary.
      if (recordingRef.current) void talkRef.current.cancel();
    },
    [],
  );

  // Returns whether the microphone opened. The hands-free callers gate
  // `handsFreeRecording` on it, so a denied permission cannot leave the flag on
  // describing a bar that is not on screen.
  //
  // `hold` is the press this belongs to; everything after an await is checked
  // against it. Opening the mic is not instant (a permission prompt can sit for
  // seconds), so a quick tap released first used to start recording unheld,
  // leaving a bar only another full hold could dismiss. Same rule the live path
  // has always had. Omitted by hands-free callers, which have no release to race.
  async function startRecording(hold?: number): Promise<boolean> {
    const stillHeld = (): boolean =>
      hold === undefined || hold === holdSeqRef.current;
    const granted = await ensurePermission(
      () => AudioModule.getRecordingPermissionsAsync(),
      () => AudioModule.requestRecordingPermissionsAsync(),
      {
        label: t("chat.perm.mic_label"),
        purpose: t("chat.perm.mic_note_purpose"),
      },
    );
    if (!granted || !stillHeld()) return false;
    await setAudioForRecording();
    try {
      await audioRecorder.prepareToRecordAsync();
      // Re-checked before the call that opens the mic: preparing is the slow
      // half on both platforms.
      if (!stillHeld()) {
        await releaseAudioSession();
        return false;
      }
      audioRecorder.record();
      startRecordingTimer();
      // A recording is running, so the hold can be locked. Set here rather than
      // where the path was chosen: a denied permission or a failed prepare
      // would otherwise leave the lift-to-lock gesture offered over a recorder
      // that never opened, and locking it would raise a bar with nothing behind
      // it. Also covers the live path falling back to a note.
      lockAvailableShared.value = true;
      return true;
    } catch {
      // Hand the session back before bailing out. Leaving allowsRecording on
      // keeps iOS in play-and-record, which routes playback to the earpiece:
      // one failed recording and every voice note afterwards sounds broken,
      // with nothing on screen to explain why.
      await releaseAudioSession();
      showAlert(T("chat.thread.error"), t("chat.perm.record_failed"));
      return false;
    }
  }

  async function stopRecording(): Promise<void> {
    setHandsFreeRecording(false);
    const duration = recordingSecs;
    stopRecordingTimer();
    try {
      // Only when a note is actually being recorded. Every other ending -
      // permission denied, a live capture that died under the hold, a live
      // start that never got off the ground - lands here too, because the
      // release handler reads "not a live hold" as "a note, then", and none of
      // those has a recorder running.
      //
      // Nothing below is safe on one that is not: expo-audio's stop() returns
      // silently when the recorder was never started (AudioRecorder.swift
      // guards on its own state), while `uri` keeps pointing at the last note
      // this screen recorded, which adoptIntoAttachmentCache has already MOVED
      // into the cache. So the branch would adopt a path with no file behind
      // it and post a voice message that plays nothing - or, if that file is
      // somehow still there, send the same note a second time.
      //
      // Read through getStatus() rather than `recorderState`, for the reason
      // the meter poll gives: the hook's value can be a render behind, and
      // this handler is the one place that must not be.
      if (!audioRecorder.getStatus().isRecording) return;
      await audioRecorder.stop();
      const recorded = audioRecorder.uri;
      if (!recorded) {
        // The recorder produced nothing. Say so: the bar closes either way, and
        // a hold-to-record that silently vanishes reads as the message having
        // been sent. The start path already alerts on failure; this is the other
        // half of the same feature.
        setToast({ message: t("chat.voice.not_recorded"), icon: "mic-off" });
        return;
      }
      // expo-audio writes to a directory of its own, outside the attachment
      // cache: a note left there escapes the retention sweep, the Storage total
      // and Clear cache. Photos already go through this.
      const uri = await adoptIntoAttachmentCache(
        recorded,
        wireMediaName("voice", "m4a"),
      );
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
      // Same reasoning as the empty-recording branch above: never fail mute.
      setToast({ message: t("chat.voice.not_recorded"), icon: "mic-off" });
    } finally {
      // Always, even if stop() threw: an audio session left in record mode
      // sends every later playback to the earpiece instead of the speaker.
      await releaseAudioSession();
    }
  }

  async function cancelRecording(): Promise<void> {
    setHandsFreeRecording(false);
    stopRecordingTimer();
    await audioRecorder.stop().catch(() => {});
    await releaseAudioSession();
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

  // Offered on a lost attachment somebody else sent. Drafts a message rather
  // than sending one, since a silent send in a room is a surprise everybody
  // sees. Plain text, so a bitchat peer can act on it too.
  function askResendFor(attachment: ChatAttachment, isMine: boolean) {
    if (isMine) return undefined;
    return () => {
      setDraft((current) =>
        current.trim().length > 0
          ? current
          : t("chat.media.resend_draft", {
              kind: t(RESEND_KIND_KEY[attachment.type]),
            }),
      );
      composerRef.current?.focus();
    };
  }

  function renderAttachmentBubble(
    attachment: ChatAttachment,
    messageId: string,
    isMine: boolean,
  ): React.JSX.Element {
    const onAskResend = askResendFor(attachment, isMine);
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
            <CollapsedMediaPlaceholder
              uri={attachment.uri}
              kind="image"
              onReveal={() =>
                setRevealedAttachments((prev) => new Set(prev).add(messageId))
              }
              onAskResend={onAskResend}
            />
          );
        }
        // Tap a loaded photo to view it full-screen, the standard gesture in
        // WhatsApp / Signal / Telegram.
        return (
          <ImageAttachment
            uri={attachment.uri}
            onPress={() => setFullscreenImage(attachment.uri)}
            onAskResend={onAskResend}
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
            onAskResend={onAskResend}
          />
        );
      }
      case "document":
        // Tapping opens the OS share/open sheet. Without this a received
        // document was a dead label: the bytes arrived and there was no way
        // to reach them.
        return (
          <DocumentAttachment
            attachment={attachment}
            isMine={isMine}
            onOpen={() => void openAttachment(attachment)}
            onAskResend={onAskResend}
          />
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
            <CollapsedMediaPlaceholder
              uri={attachment.uri}
              kind="video"
              onReveal={() =>
                setRevealedAttachments((prev) => new Set(prev).add(messageId))
              }
              onAskResend={onAskResend}
            />
          );
        }
        return (
          <VideoAttachment uri={attachment.uri} onAskResend={onAskResend} />
        );
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
  //
  // `insideViewer`: the photo viewer is a Modal and every dialog is a
  // BottomSheet, which is another Modal at the app root. Two cannot present at
  // once (iOS shows neither, Android puts the second behind), so anything
  // needing buttons closes the viewer first, before the ask rather than after.
  // The toast is exempt: a copy of it is mounted inside the viewer.
  async function saveAttachmentToDevice(
    attachment: ChatAttachment,
    insideViewer = false,
  ): Promise<void> {
    if (attachment.type !== "image" && attachment.type !== "video") {
      await openAttachment(attachment);
      return;
    }
    if (
      insideViewer &&
      !(await MediaLibrary.getPermissionsAsync(true)).granted
    ) {
      setFullscreenImage(null);
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
      // Asset.create, not saveToLibraryAsync.
      //
      // The old call is not merely deprecated in expo-media-library 57: the
      // exported symbol is a stub that throws unconditionally. Both call sites
      // were wrapped in a try/catch, so the failure was invisible - the app
      // asked for photo permission, the user granted it, and Save always
      // reported "not saved". The feature had been dead since the SDK bump.
      await MediaLibrary.Asset.create(attachment.uri);
      setToast({
        message:
          attachment.type === "video"
            ? t("chat.media.saved_videos")
            : t("chat.media.saved_photos"),
        icon: "check",
      });
    } catch {
      // A toast reaches the user in both places; the adjacent share button is
      // the way out either way.
      setToast({ message: t("chat.media.not_saved"), icon: "x-circle" });
    }
  }

  // `insideViewer`: as saveAttachmentToDevice. The native share sheet presents
  // fine over the viewer; only our own failure dialog cannot.
  async function openAttachment(
    attachment: ChatAttachment,
    insideViewer = false,
  ): Promise<void> {
    function fail(body: TranslationKey): void {
      if (insideViewer) {
        setToast({ message: t("chat.media.cant_open"), icon: "x-circle" });
        return;
      }
      showAlert(t("chat.media.cant_open"), t(body));
    }
    try {
      if (!(await Sharing.isAvailableAsync())) {
        fail("chat.media.no_app");
        return;
      }
      await Sharing.shareAsync(attachment.uri, {
        mimeType: attachment.mimeType,
        dialogTitle: attachment.name ?? t("chat.attach.generic"),
      });
    } catch {
      fail("chat.media.open_failed");
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

        {/* Channel actions: separate filled circles, one per action, the same
            as the bell and + on the Chats header. A connected track read as a
            single wide control and hid that these do two unrelated things.
            Only channels have these, so the row is absent (not empty)
            elsewhere. Notices apply to every channel; inviting does not, so a
            public or location channel shows the one circle. */}
        {!isDM && !isGroup && !selecting && (
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerAction}
              onPress={openNotices}
              hitSlop={hitSlopFor(HEADER_ICON_SIZE)}
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
              <Pressable
                style={styles.headerAction}
                onPress={handleInvite}
                hitSlop={hitSlopFor(HEADER_ICON_SIZE)}
                accessibilityRole="button"
                accessibilityLabel={T("chat.thread.invite")}
              >
                <Feather
                  name="user-plus"
                  size={18}
                  color={Colors.textSecondary}
                />
              </Pressable>
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
          // Hold the reader's place when rows are removed above them. A thread
          // keeps 200 messages (chat-store MAX_PER_CHANNEL) and trims the
          // oldest, so in a busy room someone reading back has the ground move
          // under them every time a message arrives. Pinning the first visible
          // row is React Native's own answer for chat lists.
          //
          // `autoscrollToTopThreshold` is deliberately unset: that is the part
          // that scrolls on its own, and where the view goes is decided by
          // resolveThreadScroll. This prop only stops content shifting.
          maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
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

            // What the render props below will draw for this row beyond the
            // message itself; see MessageBubble's `renderState`. `claimingToken`
            // is not compared per-token, since every claim button is disabled
            // while any swap is in flight.
            const renderState = [
              revealedAttachments.has(item.id) ? "reveal" : "",
              playingMessageId === item.id ? "play" : "",
              autoDownloadMedia ? "auto" : "",
              tokens.length === 0
                ? ""
                : `${claimingToken ?? ""}#${tokens.filter(isTokenClaimed).length}`,
            ].join("|");

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
                  renderState={renderState}
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

      {/* Remaining room in a DM, shown only once the end is in sight. Sits in
          the same strip as the other composer notices so nothing new appears in
          the layout, and outranks them while it is up: a stop the reader is
          about to hit is more urgent than why the last message queued. */}
      {showDraftCounter && !selecting && (
        <View style={styles.dmStatusBar}>
          <Feather name="edit-3" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>
            {draftBytesLeft! > 0
              ? TP("chat.thread.length_left", draftBytesLeft!)
              : T("chat.thread.length_full")}
          </Text>
        </View>
      )}

      {/* Nothing we hold can carry a message to this person, and no amount of
          waiting changes that. Said BEFORE the first send, because the only way
          to learn it today is to type something and watch it sit: the queue
          keeps it hopefully for a week and then calls it failed. Outranks every
          other notice in a DM - the others explain a slow route, this one says
          there is no route to be had - and names both ways out. */}
      {dmKeyless && !showDraftCounter && !selecting && (
        <View style={styles.dmStatusBar}>
          <Feather name="alert-circle" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>{T("chat.thread.no_keys")}</Text>
        </View>
      )}

      {/* Met in a location channel, and we have since left it. Sending still
          works; receiving does not, so the honest line is about them reaching
          us, not about the message going. The second half is the way out:
          swapping codes replaces the per-cell pseudonym with durable keys. */}
      {leftGeoCell && !dmKeyless && !showDraftCounter && !selecting && (
        <View style={styles.dmStatusBar}>
          <Feather name="map-pin" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>{T("chat.thread.left_cell")}</Text>
        </View>
      )}

      {/* Weeks of sending with nothing confirmed. Ranked below the three above
          because each of those names a reason and this one deliberately does
          not: it reports the transport's silence and leaves the cause alone. */}
      {unconfirmedFrom !== null &&
        !dmKeyless &&
        !leftGeoCell &&
        !needsInternet &&
        !showDraftCounter &&
        !selecting && (
          <View style={styles.dmStatusBar}>
            <Feather name="clock" size={12} color={Colors.textMuted} />
            <Text style={styles.dmStatusText}>
              {T("chat.thread.unconfirmed_since", {
                date: formatLongDate(unconfirmedFrom),
              })}
            </Text>
          </View>
        )}

      {/* Standing notice rather than a per-send one, so the limit is clear
          before anything is typed. Hidden while a per-send hint is up, so the
          two never stack. */}
      {!dmKeyless &&
        !leftGeoCell &&
        needsInternet &&
        dmStatus === null &&
        !showDraftCounter &&
        !selecting && (
          <View style={styles.dmStatusBar}>
            <Feather name="wifi-off" size={12} color={Colors.textMuted} />
            <Text style={styles.dmStatusText}>
              {/* Three cases, and the DM needs its own line: the channel
                  wording promises a Bluetooth fallback, which a conversation
                  with a per-cell pseudonym does not have. */}
              {isDM
                ? T("chat.thread.geo_dm_needs_internet")
                : isManualGeo
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
                  void saveAttachmentToDevice(
                    { type: "image", uri: fullscreenImage },
                    true,
                  )
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
                  void openAttachment(
                    { type: "image", uri: fullscreenImage },
                    true,
                  )
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
            message={toast?.message ?? null}
            icon={toast?.icon}
            onHide={() => setToast(null)}
            bottomOffset={112}
          />
          {/* Its own window, so the app-root cover does not reach it. A photo
              at full screen is the last thing that should survive into the app
              switcher. */}
        </Pressable>
      </Modal>

      {/* Same pill for a save made from the thread itself (the long-press
          menu), floated above the compose bar. */}
      <Toast
        message={toast?.message ?? null}
        icon={toast?.icon}
        onHide={() => setToast(null)}
        bottomOffset={88}
      />

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

      {/* Someone else has the floor. The transmitting pill, in the strip the
          recording bar occupies, so both halves of a conversation read alike.
          Red in both directions: the accent is a plain near-black or near-white,
          so an accent-tinted LIVE read as ordinary chrome. The two states never
          appear at once, so nothing needs a second colour. */}
      {!selecting &&
        liveTalker !== null &&
        !isPTTActive &&
        !isRecording &&
        !isTalkingLive && (
          <View
            style={styles.liveIncomingRow}
            accessibilityRole="alert"
            accessibilityLabel={
              liveTalkers.length > 1
                ? TP("chat.voice.live_speaking_count", liveTalkers.length)
                : T("chat.voice.live_speaking", { name: liveTalker })
            }
          >
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              {/* Untranslated, like the transmitting badge: a broadcast marker
                  read the same everywhere. */}
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
            <Text style={styles.liveIncomingName} numberOfLines={1}>
              {liveTalkers.length > 1
                ? TP("chat.voice.live_speaking_count", liveTalkers.length)
                : T("chat.voice.live_speaking", { name: liveTalker })}
            </Text>
            {/* The talker's own voice, measured as it leaves the speaker. A
                still badge looks identical whether somebody is speaking or the
                link died mid-sentence; this is the difference. Shorter than the
                sending meter because the row it sits in is, and it shows one
                voice however many people are named: only the burst holding the
                floor is being played. */}
            <VoiceWave
              levels={waveLevels}
              maxHeight={WAVE_INCOMING_MAX_HEIGHT}
              color={Colors.danger}
              style={styles.liveIncomingWave}
            />
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
            ref={composerRef}
            style={styles.input}
            value={draft}
            onChangeText={handleDraftChange}
            placeholder={T("chat.thread.message_placeholder")}
            placeholderTextColor={Colors.textMuted}
            multiline
            // A character ceiling over every conversation, on top of the byte
            // budget that additionally clamps DMs in handleDraftChange. Kept so
            // a runaway paste cannot build a packet nothing will carry.
            maxLength={2000}
            // Autocorrect, spellcheck and capitalisation stay at the platform
            // defaults. The Privacy switch that used to gate them promised more
            // than it delivered: the learned dictionary belongs to the OS, so
            // turning it off only stopped future learning in this one field.
            returnKeyType="send"
            submitBehavior="blurAndSubmit"
            onSubmitEditing={handleSend}
            selectionColor={Colors.selection}
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
            // PTT button: hold to talk, slide back to cancel.
            mediaAllowed && (
              <GestureDetector gesture={talkGesture}>
                {/* Attached to a padded wrapper, not the drawn button:
                    `hitSlop` is honoured by the responder system and ignored by
                    gesture handlers, so the 44pt target must be a real view. The
                    negative margin returns those points to the layout, keeping
                    the row the same width as with the send button. */}
                <View
                  style={styles.pttTarget}
                  // Inert while the bar owns the recording. A press here would
                  // otherwise start a second recorder over the one already
                  // running and, worse, send it on release: the gesture's
                  // finalize has no way to tell a press that did nothing from a
                  // release that meant something. The bar's Send and X are the
                  // controls in this state, under a screen reader too.
                  pointerEvents={handsFreeRecording ? "none" : "auto"}
                  accessible
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
                  // A hold-and-slide cannot be performed with a screen reader
                  // on, so this is a start/stop toggle there. No cancel: a
                  // gesture that exists only as a distance has no accessible
                  // form.
                  accessibilityHint={T("chat.voice.a11y_toggle")}
                  onAccessibilityTap={() => {
                    if (isPTTActive) {
                      void talkRef.current.end();
                      return;
                    }
                    // Nothing is held, so the bar's buttons are the way out and
                    // the slide hint would be unusable advice. Set after
                    // start(), which clears the flag for the held case, and only
                    // for a note: a live burst has no buttons to offer.
                    void talkRef.current.start().then(() => {
                      if (!liveHoldRef.current) setHandsFreeRecording(true);
                    });
                  }}
                >
                  <Animated.View
                    style={[
                      styles.pttButton,
                      isPTTActive && styles.pttButtonActive,
                      // Somebody else has the floor. The button still works: a
                      // mesh has no floor arbiter, and refusing to send would
                      // desync the moment the network partitions. It just says
                      // so first.
                      liveTalker !== null &&
                        !isPTTActive &&
                        styles.pttButtonBusy,
                      // Past the threshold the button is a discard.
                      cancelArmed && styles.pttButtonCancel,
                      micSlideStyle,
                    ]}
                  >
                    {/* The mic, until the slide turns it into a discard. The
                      radio glyph already means "the mesh" elsewhere (peer list,
                      radar, network settings), so state is carried by colour:

                        muted  hold records a voice note
                        accent hold goes out live
                        danger you are live right now

                      Busy is the border, a separate property, so "live
                      available" and "someone else is talking" can both show at
                      once. */}
                    <Feather
                      name={cancelArmed ? "trash-2" : "mic"}
                      size={16}
                      color={
                        cancelArmed || isPTTActive
                          ? Colors.danger
                          : liveAvailable
                            ? Colors.accent
                            : Colors.textMuted
                      }
                    />
                  </Animated.View>
                </View>
              </GestureDetector>
            )
          )}
        </View>
      )}

      {/* Recording bar, below the compose row while the mic is open: elapsed
          time, whether this is going out live, and the way out. */}
      {(isRecording || isTalkingLive) && (
        <View style={styles.recordingBar}>
          {/* Two ways in, two ways out. Started by tap, no finger is held, so an
              ordinary button ends it. Started by holding the mic, lifting to
              reach anything here IS the release: a tap in this bar could only
              land after the recording had been sent, which is what the X used to
              do. That path gets slide-to-cancel instead. */}
          {handsFreeRecording ? (
            <Pressable
              style={styles.recordingCancel}
              onPress={() => void cancelRecording()}
              hitSlop={hitSlopFor(36)}
              accessibilityRole="button"
              accessibilityLabel={T("chat.voice.cancel_recording")}
            >
              <Feather name="x" size={18} color={Colors.textMuted} />
            </Pressable>
          ) : (
            <Animated.View
              style={[styles.recordingCancelHint, cancelHintStyle]}
              accessibilityLiveRegion="polite"
            >
              <Feather
                name={cancelArmed ? "trash-2" : chevronBack}
                size={16}
                color={cancelArmed ? Colors.danger : Colors.textMuted}
              />
              <Text
                style={[
                  styles.recordingCancelText,
                  cancelArmed && styles.recordingCancelTextArmed,
                ]}
                numberOfLines={1}
                maxFontSizeMultiplier={MaxFontScale.chrome}
              >
                {cancelArmed
                  ? T("chat.voice.release_cancel")
                  : T("chat.voice.slide_cancel")}
              </Text>
            </Animated.View>
          )}
          {/* Lift-to-lock, shown only while the hold can actually take it: a
              live burst is a floor and is never locked, and a hands-free
              recording is already there. Icon rather than a second sentence,
              because the cancel hint beside it owns the one line the bar has,
              and a chevron over a padlock is the idiom people arrive with. */}
          {lockHintVisible && (
            <View
              style={styles.recordingLockHint}
              accessible
              accessibilityLabel={T("chat.voice.lift_lock")}
            >
              <Feather name="chevron-up" size={12} color={Colors.textMuted} />
              <Feather name="lock" size={13} color={Colors.textMuted} />
            </View>
          )}
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
          {/* The voice actually being captured, live or recorded. Once the
              burst has hit its ceiling nothing is going out any more, so the
              meter stops claiming otherwise the same way the badge does: it
              keeps its shape but goes muted and flat. */}
          <VoiceWave
            levels={waveLevels}
            maxHeight={WAVE_MAX_HEIGHT}
            color={burstEnded ? Colors.textMuted : Colors.danger}
            style={styles.recordingWave}
          />
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
          {/* Only the hands-free path has anything to press. A held recording
              ends by letting go, and a live burst has nothing to send: the audio
              left as it was spoken. */}
          {handsFreeRecording && (
            <Pressable
              style={styles.recordingStop}
              onPress={() => void stopRecording()}
              hitSlop={hitSlopFor(40)}
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
                  username={senderDisplayName}
                  peerID={senderInfoTarget.peerID}
                  size={64}
                />
                <Text style={styles.dmInfoName}>{senderDisplayName}</Text>
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
                    {/* The same note the contact sheet carries. Both are places
                        somebody decides whether to treat a pseudonym as a
                        person they can keep, so both have to say it. */}
                    <Text style={styles.keyBoxNote}>
                      {T("chat.contact.cell_key_note")}
                    </Text>
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
                      {T("chat.thread.in_range")}
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
                    name: senderDisplayName,
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
        onCopy={() => {
          if (!actionSheet) return;
          void Clipboard.setStringAsync(actionSheet.text).catch(() => {});
          acknowledged();
        }}
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
        localPeerID={localPeerID}
        onClose={() => setInfoMessageId(null)}
      />

      {/* Forward target picker */}
      <ForwardSheet
        visible={forwardSource !== null}
        excludeChannel={channel}
        carriesMedia={forwardSource?.attachment !== undefined}
        onClose={() => setForwardSource(null)}
        onForward={(target) => {
          if (!forwardSource) return false;
          if (!forwardMessage(forwardSource, target)) return false;
          onNavigateToChannel(target);
          return true;
        }}
      />

      {/* Same picker for a bulk forward. A separate instance rather than a
          shared one, so its own close animation is not tangled with the
          single-message path's. */}
      <ForwardSheet
        visible={showBulkForward}
        excludeChannel={channel}
        carriesMedia={selectedCarriesMedia}
        onClose={() => setShowBulkForward(false)}
        onForward={(target) => {
          if (!forwardSelected(target)) return false;
          onNavigateToChannel(target);
          return true;
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
    // Channel actions: one filled circle per action, the same shape, size and
    // fill as the header pills on Chats, Mesh and Wallet.
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      // The same gap the app header puts between its bell and + (headerControls
      // in App.tsx), so two adjacent header circles sit the same distance apart
      // wherever they appear.
      gap: Spacing.sm,
    },
    headerAction: {
      width: HEADER_ICON_SIZE,
      height: HEADER_ICON_SIZE,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.surfaceRaised,
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
      opacity: DISABLED_OPACITY,
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
    // The mic's touch target: MIN_TOUCH square, occupying only the drawn
    // button's footprint. Padding rather than hitSlop; see the wrapper.
    pttTarget: {
      padding: (MIN_TOUCH - COMPOSE_BUTTON_SIZE) / 2,
      margin: -(MIN_TOUCH - COMPOSE_BUTTON_SIZE) / 2,
      flexShrink: 0,
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
    // Slid past the threshold: letting go discards. Same danger tint as the live
    // state; the glyph inside tells them apart.
    pttButtonCancel: {
      backgroundColor: Colors.dangerDim,
      borderColor: Colors.danger,
    },
    // Receiving live audio. Sits above the compose bar, in the strip the
    // recording bar takes over when this device is the one talking.
    liveIncomingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.xs,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
      backgroundColor: Colors.bg,
    },
    liveIncomingName: {
      flexShrink: 1,
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
    },
    // Pushed to the end of the row, so the badge and the name keep their place
    // as the meter takes whatever width is left. Same bar width, gap and
    // alignment as the sending meter: one voice indicator, two rows.
    liveIncomingWave: {
      flexGrow: 1,
      flexShrink: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 3,
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
    // Slide-to-cancel, on the held path. Shrinks before the waveform, which
    // carries no information.
    recordingCancelHint: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      flexShrink: 1,
    },
    recordingCancelText: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      flexShrink: 1,
    },
    recordingCancelTextArmed: {
      color: Colors.danger,
      fontWeight: FontWeight.medium,
    },
    // Centred on the row rather than sitting on a baseline, so a bar grows in
    // both directions from the middle and the meter reads as a waveform instead
    // of a bar chart.
    recordingLockHint: {
      alignItems: "center",
      gap: -2,
      paddingHorizontal: Spacing.xs,
    },
    recordingWave: {
      flexGrow: 1,
      flexShrink: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 3,
      paddingHorizontal: Spacing.sm,
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
    // A file no longer on the device: one shape for every attachment kind.
    attachGone: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.sm,
      borderRadius: Radius.md,
      backgroundColor: Colors.surface,
      minWidth: 200,
      maxWidth: 260,
    },
    attachGoneBody: {
      flexShrink: 1,
      gap: 1,
    },
    attachGoneTitle: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.textSecondary,
    },
    attachGoneNote: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    attachGoneAction: {
      marginStart: "auto",
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
    },
    attachGoneActionText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.medium,
      color: Colors.accent,
    },
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
    // Matches the contact sheet's note under the same box, so the two places a
    // pseudonym is inspected read identically.
    keyBoxNote: {
      fontSize: FontSize["2xs"],
      lineHeight: FontSize["2xs"] * 1.5,
      color: Colors.textMuted,
      marginTop: Spacing.sm,
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
    // Straddles the circle's edge, ringed in the header's own background, the
    // same cutout the back button's unread badge and the bell's count use.
    noticeDot: {
      position: "absolute",
      top: -2,
      end: -2,
      width: 10,
      height: 10,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
      borderWidth: 2,
      borderColor: Colors.bg,
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
