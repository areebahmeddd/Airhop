// Message thread screen for a single channel.
// Shows messages with sender and timestamp. Text input to compose and PTT button.

import { Feather } from "@expo/vector-icons";
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
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  buildOfflineToken,
  findTokensInText,
  mayContainToken,
  selectProofsForAmount,
  type EmbeddedToken,
} from "../../core/payments/cashu";
import { getMeshService } from "../../services/mesh-service";
import { showAlert } from "../../store/alert-store";
import {
  useChatStore,
  type ChatAttachment,
  type ChatMessage,
} from "../../store/chat-store";
import { usePeerStore } from "../../store/peer-store";
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
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";
import ChannelInfoSheet from "./channel-info-sheet";
import ContactInfoSheet from "./contact-info-sheet";
import ForwardSheet from "./forward-sheet";
import MessageActionSheet from "./message-action-sheet";
import MessageBubble from "./message-bubble";

type AttachAction = "camera" | "library" | "document" | "voice" | "ecash";

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
  // Ask the parent to switch the active chat to this channel — used both
  // right after forwarding a message (land where it went, not silently stay
  // put) and when picking "Message" on a channel sender's profile sheet
  // (jump straight into the DM with them).
  onNavigateToChannel: (channel: string) => void;
}

// Broadcast wire format for a screenshot notice, matching bitchat's action
// message convention so both platforms recognize it and render it inline
// instead of as a regular chat bubble.
function screenshotNoticeText(nickname: string): string {
  return `* ${nickname} took a screenshot *`;
}

// (A previous isScreenshotNotice() text-sniffer was removed: matching on user
// text let any peer forge a system row and destroyed the real message content.)

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

  return (
    <View style={styles.wrap}>
      {mine.map((t) => {
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

  // The play button sits on a neutral surface circle (same pattern as every
  // other icon-in-a-circle in this app), so its icon is always readable
  // regardless of theme. The waveform bars and duration text sit directly
  // on the bubble itself, so those still need to track isMine like the
  // message text next to them does.
  const onBubbleColor = isMine ? styles.onMyBubble : styles.onTheirBubble;

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
      <View style={styles.attachVoiceWave}>
        {[6, 12, 8, 16, 10, 14, 8, 6, 12, 10, 8, 14].map((h, i) => (
          <View
            key={i}
            style={[
              styles.attachVoiceBar,
              onBubbleColor,
              { height: h, opacity: isPlaying ? 1 : 0.5 },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.attachVoiceDuration, onBubbleColor]}>
        {formatDuration(Math.round(durationMs / 1000))}
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
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const { messages, addMessage, addChannel, toggleStar } = useChatStore();
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
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const dmPeerID = channel.startsWith("dm:") ? channel.slice(3) : null;
  const isDMPeerOnline =
    dmPeerID !== null && onlinePeers.some((p) => p.peerID === dmPeerID);
  const [draft, setDraft] = useState("");
  const [isPTTActive, setIsPTTActive] = useState(false);
  const isRecording = recorderState.isRecording;
  // Voice recording
  const [recordingSecs, setRecordingSecs] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playingUri, setPlayingUri] = useState<string | null>(null);
  const [revealedAttachments, setRevealedAttachments] = useState<Set<string>>(
    new Set(),
  );
  // URI of the photo currently shown in the full-screen viewer, or null.
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const autoDownloadMedia = useSettingsStore((s) => s.autoDownloadMedia);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showSendEcash, setShowSendEcash] = useState(false);
  const [ecashAmount, setEcashAmount] = useState("");
  const [ecashMemo, setEcashMemo] = useState("");
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [showDMInfo, setShowDMInfo] = useState(false);
  // Channel-message sender profile sheet — tap a message's avatar/name to
  // see who they are and message them, same as tapping a peer on the Mesh
  // tab. Not used in a DM thread (only one other participant there,
  // already reachable via the header).
  const [senderInfoTarget, setSenderInfoTarget] = useState<{
    peerID: string;
    nickname: string;
  } | null>(null);
  // Channel members list — currently-reachable peers, tap one to open the
  // same profile sheet as tapping their avatar on a message.
  const [showMembersList, setShowMembersList] = useState(false);
  const [showScreenshotWarning, setShowScreenshotWarning] = useState(false);
  // Brief delivery status hint shown below the compose bar for DMs.
  // "queued" = no route available; cleared after 4 seconds.
  const [dmStatus, setDmStatus] = useState<"queued" | "no-reach" | null>(null);
  const dmStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  // Long-press action sheet target.
  const [actionSheet, setActionSheet] = useState<ChatMessage | null>(null);
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

  const msgs = messages[channel] ?? [];
  const isDM = channel.startsWith("dm:");

  // Scroll to and flash a message opened from a search result. Guarded by
  // the same fire-once-per-increment counter pattern used elsewhere in this
  // app (e.g. ChannelList's join-modal trigger) so remounts/re-renders
  // don't re-fire it, but re-tapping the same search result does.
  useEffect(() => {
    if (
      targetMessageTrigger === undefined ||
      targetMessageTrigger <= prevScrollTrigger.current ||
      !targetMessageId
    ) {
      return;
    }
    prevScrollTrigger.current = targetMessageTrigger;

    const index = msgs.findIndex((m) => m.id === targetMessageId);
    if (index === -1) return;

    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.3,
    });
    // Flash the message a search result pointed at. Driven by an incrementing
    // trigger prop, so this runs once per result tap, an imperative scroll-and-
    // highlight command from the parent, not state derived from props.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHighlightedMessageId(targetMessageId);
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(
      () => setHighlightedMessageId(null),
      1500,
    );
  }, [targetMessageTrigger, targetMessageId, msgs]);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  // Claim an ecash token found inside a received message.
  // Proofs are stored offline without a mint call; user can redeem later.
  function claimToken(embedded: EmbeddedToken): void {
    const { addMint, addProofs } = useWalletStore.getState();
    const stored = embedded.info.token.proofs.map((p) => ({
      id: p.id,
      amount: p.amount.toNumber(),
      secret: p.secret,
      C: p.C,
    }));
    addMint(embedded.info.mintUrl);
    addProofs(embedded.info.mintUrl, stored);
    showAlert(
      `+${embedded.info.amount.toLocaleString()} ${embedded.info.unit}`,
      `Token added to your wallet from ${embedded.info.mintUrl.replace(/https?:\/\//, "")}.`,
    );
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
      setShowScreenshotWarning(true);
    });
    return () => subscription.remove();
  }, [channel, isDM, localNickname, localPeerID, addMessage]);

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text) return;

    const msg: ChatMessage = {
      id: `${localPeerID}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      channel,
      senderID: localPeerID,
      senderNickname: localNickname,
      text,
      timestampMs: Date.now(),
      isMine: true,
    };
    addMessage(msg);
    setDraft("");

    // Broadcast over BLE mesh (channel) or route as DM.
    const service = getMeshService();
    if (service) {
      if (isDM) {
        // Pass the message id so a message that can't go out now is queued
        // against this exact bubble and retried when the peer is reachable.
        const result = service.sendDm(channel.slice(3), text, msg.id);
        if (result === "needs-courier") showQueuedStatus();
      } else {
        // A channel broadcast with nobody connected and no Nostr cell reaches
        // no one, it used to render as a normal sent bubble regardless. Say so
        // instead, since the user can act on it (move closer, enable location).
        const sent = service.sendChannelMessage(channel, text);
        if (sent.bleLinks === 0 && !sent.nostr) showNoReachStatus();
      }
    }
    // showQueuedStatus is defined in the same scope and is stable across renders.
  }, [draft, channel, localPeerID, localNickname, addMessage, isDM]);

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

  // Send a Cashu token to this DM peer, the same offline build-and-deduct flow
  // as the Wallet tab's Send, just with the recipient already fixed to
  // whoever this thread is with.
  function handleSendEcash(): void {
    const amount = parseInt(ecashAmount, 10);
    if (!amount || amount <= 0 || !dmPeerID) return;

    const { proofsByMint, unit, removeProofs } = useWalletStore.getState();
    const totalBalance = Object.values(proofsByMint).reduce(
      (sum, ps) => sum + ps.reduce((s, p) => s + p.amount, 0),
      0,
    );
    if (amount > totalBalance) {
      showAlert(
        "Insufficient balance",
        `You have ${totalBalance.toLocaleString()} sats but tried to send ${amount.toLocaleString()} sats.`,
      );
      return;
    }

    const mintEntry = Object.entries(proofsByMint)
      .map(([url, ps]) => ({
        url,
        ps,
        balance: ps.reduce((s, p) => s + p.amount, 0),
      }))
      .find((m) => m.balance >= amount);
    if (!mintEntry) {
      showAlert(
        "Balance split across mints",
        "No single mint holds the full amount. Use the Wallet tab to consolidate.",
      );
      return;
    }

    const selection = selectProofsForAmount(mintEntry.ps, amount);
    if (!selection) return;

    const tokenStr = buildOfflineToken(
      mintEntry.url,
      selection.selected,
      unit,
      ecashMemo.trim() || undefined,
    );
    removeProofs(
      mintEntry.url,
      selection.selected.map((p) => p.secret),
    );

    addMessage({
      id: `${localPeerID}-${Date.now()}-ecash`,
      channel,
      senderID: localPeerID,
      senderNickname: localNickname,
      text: tokenStr,

      timestampMs: Date.now(),
      isMine: true,
    });
    getMeshService()?.sendDm(dmPeerID, tokenStr);

    setShowSendEcash(false);
    setEcashAmount("");
    setEcashMemo("");
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
    },
  ): void {
    const targetChannel = options?.targetChannel ?? channel;
    const msg: ChatMessage = {
      // eslint-disable-next-line react-hooks/purity
      id: `${localPeerID}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      channel: targetChannel,
      senderID: localPeerID,
      senderNickname: localNickname,
      text: "",
      // eslint-disable-next-line react-hooks/purity
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
        service.sendAttachment(targetChannel, bytes, {
          type,
          name: name ?? "",
          mimeType: mimeType ?? "",
          durationMs: durationMs ?? 0,
        });
      } catch (err) {
        // File too large or URI unreadable. Alert the sender with a reason
        // so they know the attachment did not reach the other device.
        const reason =
          err instanceof Error ? err.message : "Could not read the file.";
        showAlert("Attachment not sent", reason);
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
        { targetChannel, forwarded: true },
      );
      return;
    }
    const msg: ChatMessage = {
      // eslint-disable-next-line react-hooks/purity
      id: `${localPeerID}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      channel: targetChannel,
      senderID: localPeerID,
      senderNickname: localNickname,
      text: source.text,
      // eslint-disable-next-line react-hooks/purity
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
    const dmChannel = `dm:${senderInfoTarget.peerID}`;
    addChannel(dmChannel);
    setSenderInfoTarget(null);
    onNavigateToChannel(dmChannel);
  }

  async function handleCameraAttach(): Promise<void> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      showAlert(
        "Permission needed",
        "Grant camera access in Settings to take photos.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      quality: UPLOAD_QUALITY_VALUES[useSettingsStore.getState().uploadQuality],
      allowsEditing: false,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const type: ChatAttachment["type"] =
      asset.type === "video" ? "video" : "image";
    sendAttachmentMessage(
      type,
      asset.uri,
      asset.fileName ?? (type === "video" ? "video.mp4" : "photo.jpg"),
      asset.mimeType,
    );
  }

  async function handleLibraryAttach(): Promise<void> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showAlert("Permission needed", "Grant photo library access in Settings.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: UPLOAD_QUALITY_VALUES[useSettingsStore.getState().uploadQuality],
      allowsEditing: false,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const type: ChatAttachment["type"] =
      asset.type === "video" ? "video" : "image";
    sendAttachmentMessage(
      type,
      asset.uri,
      asset.fileName ?? (type === "video" ? "video.mp4" : "photo.jpg"),
      asset.mimeType,
    );
  }

  async function handleDocumentAttach(): Promise<void> {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    sendAttachmentMessage(
      "document",
      asset.uri,
      asset.name,
      asset.mimeType,
      undefined,
      { sizeBytes: asset.size ?? undefined },
    );
  }

  async function startRecording(): Promise<void> {
    const { granted } = await AudioModule.requestRecordingPermissionsAsync();
    if (!granted) {
      showAlert(
        "Permission needed",
        "Grant microphone access in Settings to record voice notes.",
      );
      return;
    }
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
      await setAudioModeAsync({ allowsRecording: false });
      const uri = audioRecorder.uri;
      if (!uri) return;
      sendAttachmentMessage(
        "voice",
        uri,
        "voice.m4a",
        "audio/x-m4a",
        duration * 1000,
      );
    } catch {
      // Discard on error.
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
    void Share.share({
      message: `Join me in ${channel} on Airhop - offline-first, private mesh messaging.`,
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
          <Pressable
            onPress={() => setFullscreenImage(attachment.uri)}
            accessibilityRole="imagebutton"
            accessibilityLabel="View photo full screen"
          >
            <Image
              source={{ uri: attachment.uri }}
              style={styles.attachImage}
              resizeMode="cover"
            />
          </Pressable>
        );
      }
      case "voice": {
        const isPlaying = playingUri === attachment.uri;
        return (
          <VoiceNoteBubble
            uri={attachment.uri}
            durationMs={attachment.durationMs ?? 0}
            isPlaying={isPlaying}
            isMine={isMine}
            onToggle={() =>
              setPlayingUri((current) =>
                current === attachment.uri ? null : attachment.uri,
              )
            }
            onFinished={() => setPlayingUri(null)}
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
                  isMine ? styles.onMyBubble : styles.onTheirBubble,
                ]}
                numberOfLines={2}
              >
                {attachment.name ?? "Document"}
              </Text>
              {docSubtitle(attachment) !== null && (
                <Text
                  style={[
                    styles.attachDocMeta,
                    isMine ? styles.onMyBubble : styles.onTheirBubble,
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
        {!isMine && (
          <Pressable
            style={styles.paymentCardClaim}
            onPress={() => claimToken(token)}
            accessibilityRole="button"
            accessibilityLabel={`Claim ${token.info.amount.toLocaleString()} ${token.info.unit}`}
          >
            <Text style={styles.paymentCardClaimText}>Claim</Text>
          </Pressable>
        )}
      </View>
    );
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

  function formatDateSeparator(ms: number): string {
    const d = new Date(ms);
    const now = new Date();
    if (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    ) {
      return "Today";
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }
    return d.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  const displayName = channel.startsWith("dm:")
    ? peerIDToUsername(channel.slice(3))
    : channel;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
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
          <Text style={styles.channelTitle} numberOfLines={1}>
            {isDM ? displayName : channel}
          </Text>
          {!isDM && (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {peerCount > 0 ? `${peerCount} nearby` : "Public channel"}
            </Text>
          )}
        </Pressable>

        <View style={styles.headerRight}>
          {isDM ? (
            <Avatar
              username={peerIDToUsername(channel.slice(3))}
              peerID={channel.slice(3)}
              size={28}
            />
          ) : (
            <>
              <Pressable
                style={styles.memberCountBtn}
                onPress={() => setShowMembersList(true)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel={`${peerCount} member${peerCount !== 1 ? "s" : ""} nearby`}
              >
                <Feather name="users" size={14} color={Colors.textSecondary} />
                <Text style={styles.memberCountText}>{peerCount}</Text>
              </Pressable>
              <Pressable
                onPress={handleInvite}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Invite someone to this channel"
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
      </View>

      {/* Peer offline notice: shown in DM threads when the peer has not been seen recently. */}
      {isDM && !isDMPeerOnline && (
        <View style={styles.peerOfflineBanner}>
          <Feather name="wifi-off" size={12} color={Colors.textMuted} />
          <Text style={styles.peerOfflineBannerText}>
            Peer not in range · messages will be delivered when nearby
          </Text>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const showAvatar = !item.isMine;
          const isFirstFromSender =
            index === 0 || (msgs[index - 1]?.senderID ?? "") !== item.senderID;
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
                onPressSender={isDM ? undefined : handlePressSender}
                highlighted={item.id === highlightedMessageId}
              />
            </View>
          );
        }}
        onContentSizeChange={() => {
          // Suppressed while a search-result message is flashed: a stray
          // content-size event (e.g. an image finishing layout) would
          // otherwise yank the view back to the bottom mid-flash.
          if (highlightedMessageId) return;
          if (msgs.length > 0)
            listRef.current?.scrollToEnd({ animated: false });
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

      {/* Delivery hints. "queued" means a DM is held for later retry; "no-reach"
          means a channel broadcast found no peers and no internet cell, so it
          genuinely went nowhere. */}
      {isDM && dmStatus === "queued" && (
        <View style={styles.dmStatusBar}>
          <Feather name="clock" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>
            Peer not reachable - message queued for delivery
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
        </Pressable>
      </Modal>

      {/* Live attachment transfers for this thread: one card each, sending or
          receiving, with percent, speed and time remaining. */}
      <TransferProgressList channel={channel} />

      {/* Compose bar */}
      <View style={styles.composeBar}>
        <Pressable
          style={styles.attachButton}
          onPress={handleAttach}
          accessibilityRole="button"
          accessibilityLabel="Attach a file"
        >
          <Feather name="plus" size={20} color={Colors.textMuted} />
        </Pressable>
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
          // PTT button: hold to talk. onPressIn starts recording; onPressOut stops and sends.
          <Pressable
            style={[styles.pttButton, isPTTActive && styles.pttButtonActive]}
            onPressIn={() => {
              setIsPTTActive(true);
              void startRecording();
            }}
            onPressOut={() => {
              setIsPTTActive(false);
              void stopRecording();
            }}
            accessibilityRole="button"
            accessibilityLabel="Hold to talk"
          >
            <Feather
              name="mic"
              size={16}
              color={isPTTActive ? Colors.danger : Colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      {/* In-compose voice recording bar: replaces compose row while recording */}
      {isRecording && (
        <View style={styles.recordingBar}>
          <Pressable
            style={styles.recordingCancel}
            onPress={() => void cancelRecording()}
            accessibilityRole="button"
            accessibilityLabel="Cancel recording"
          >
            <Feather name="x" size={18} color={Colors.textMuted} />
          </Pressable>
          {/* Animated-look waveform (static bars that suggest audio) */}
          <View style={styles.recordingWave}>
            {[5, 10, 7, 14, 9, 12, 6, 11, 8, 13, 7, 10].map((h, i) => (
              <View key={i} style={[styles.recordingBar_bar, { height: h }]} />
            ))}
          </View>
          <Text style={styles.recordingTimer}>
            {formatDuration(recordingSecs)}
          </Text>
          <Pressable
            style={styles.recordingStop}
            onPress={() => void stopRecording()}
            accessibilityRole="button"
            accessibilityLabel="Stop recording and send"
          >
            <Feather name="send" size={16} color={Colors.textInverse} />
          </Pressable>
        </View>
      )}

      {/* Attachment picker */}
      <Modal
        visible={showAttachMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachMenu(false)}
      >
        <View style={styles.attachOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowAttachMenu(false)}
            accessible={false}
          />
          <View style={styles.attachSheet}>
            <View style={styles.handle} />
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
                      <Feather
                        name={icon}
                        size={20}
                        color={Colors.textSecondary}
                      />
                    </View>
                    <View style={styles.attachOptionBody}>
                      <Text style={styles.attachOptionLabel}>{label}</Text>
                      <Text style={styles.attachOptionDesc}>{desc}</Text>
                    </View>
                  </Pressable>
                </React.Fragment>
              ),
            )}
            <Pressable
              style={styles.attachCancel}
              onPress={() => setShowAttachMenu(false)}
              accessibilityRole="button"
            >
              <Text style={styles.attachCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Send ecash: DM-only attach option, builds an offline Cashu token
          from the wallet and sends it straight to this peer. */}
      {isDM && (
        <Modal
          visible={showSendEcash}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSendEcash(false)}
        >
          <View style={styles.ecashOverlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setShowSendEcash(false)}
            />
            <View style={styles.ecashSheet}>
              <View style={styles.handle} />
              <Text style={styles.ecashTitle}>Send ecash</Text>
              <Text style={styles.ecashSubtitle}>
                Built offline from your wallet and sent as a token to{" "}
                {displayName}.
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
                    !ecashAmount.trim() && styles.ecashConfirmDisabled,
                  ]}
                  onPress={handleSendEcash}
                  disabled={!ecashAmount.trim()}
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
            </View>
          </View>
        </Modal>
      )}

      {/* Channel info sheet: opens when user taps the header center */}
      {!isDM && (
        <ChannelInfoSheet
          channel={showChannelInfo ? channel : null}
          onClose={() => setShowChannelInfo(false)}
          onLeave={onBack}
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

      {/* Members list: currently-reachable peers, tap the header count. */}
      {!isDM && (
        <Modal
          visible={showMembersList}
          transparent
          animationType="slide"
          onRequestClose={() => setShowMembersList(false)}
        >
          <View style={styles.membersOverlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setShowMembersList(false)}
            />
            <View style={styles.membersSheet}>
              <View style={styles.handle} />
              <Text style={styles.membersTitle}>
                {peerCount} member{peerCount !== 1 ? "s" : ""}
              </Text>
              {onlinePeers.length === 0 ? (
                <Text style={styles.membersEmpty}>
                  No one else is currently in range.
                </Text>
              ) : (
                <ScrollView
                  style={styles.membersList}
                  showsVerticalScrollIndicator={false}
                >
                  {onlinePeers.map((peer) => (
                    <Pressable
                      key={peer.peerID}
                      style={styles.memberRow}
                      onPress={() => {
                        setShowMembersList(false);
                        setSenderInfoTarget({
                          peerID: peer.peerID,
                          nickname: peer.nickname,
                        });
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`View ${peerIDToUsername(peer.peerID)}'s profile`}
                    >
                      <Avatar
                        username={peerIDToUsername(peer.peerID)}
                        peerID={peer.peerID}
                        size={40}
                      />
                      <View style={styles.memberRowInfo}>
                        <Text style={styles.memberRowName} numberOfLines={1}>
                          {peerIDToUsername(peer.peerID)}
                        </Text>
                        <View style={styles.memberRowStatus}>
                          <View style={styles.memberRowDot} />
                          <Text style={styles.memberRowStatusText}>
                            In range
                          </Text>
                        </View>
                      </View>
                      <Feather
                        name="message-circle"
                        size={16}
                        color={Colors.textMuted}
                      />
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* Channel sender profile sheet: tap a message's avatar/name. */}
      {!isDM && (
        <Modal
          visible={senderInfoTarget !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setSenderInfoTarget(null)}
        >
          {senderInfoTarget && (
            <View style={styles.dmInfoOverlay}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setSenderInfoTarget(null)}
              />
              <View style={styles.dmInfoSheet}>
                <View style={styles.handle} />
                <View style={styles.dmInfoBody}>
                  <Avatar
                    username={peerIDToUsername(senderInfoTarget.peerID)}
                    peerID={senderInfoTarget.peerID}
                    size={64}
                  />
                  <Text style={styles.dmInfoName}>
                    {peerIDToUsername(senderInfoTarget.peerID)}
                  </Text>
                  <Text style={styles.dmInfoPeerID}>
                    {senderInfoTarget.peerID}
                  </Text>
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
                    accessibilityLabel={`Message ${peerIDToUsername(senderInfoTarget.peerID)}`}
                  >
                    <Feather
                      name="message-circle"
                      size={16}
                      color={Colors.textInverse}
                    />
                    <Text style={styles.senderInfoMessageText}>Message</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </Modal>
      )}

      {/* Screenshot privacy notice: shown right after a screenshot is taken,
          confirming the other side has been told. */}
      <Modal
        visible={showScreenshotWarning}
        transparent
        animationType="fade"
        onRequestClose={() => setShowScreenshotWarning(false)}
      >
        <View style={styles.screenshotOverlay}>
          <View style={styles.screenshotCard}>
            <Text style={styles.screenshotTitle}>Heads up</Text>
            <Text style={styles.screenshotMessage}>
              {isDM
                ? `${displayName} was notified that you took a screenshot of this conversation.`
                : "Everyone in this channel was notified that you took a screenshot."}
            </Text>
            <Pressable
              style={styles.screenshotButton}
              onPress={() => setShowScreenshotWarning(false)}
              accessibilityRole="button"
              accessibilityLabel="OK"
            >
              <Text style={styles.screenshotButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Long-press action sheet: forward/copy/star. */}
      <MessageActionSheet
        message={actionSheet}
        onClose={() => setActionSheet(null)}
        onForward={() => {
          // Let the action sheet's own close animation finish before the
          // forward sheet slides up: opening both at once reads as a glitch
          // rather than a handoff between two bottom sheets.
          const target = actionSheet;
          if (target) setTimeout(() => setForwardSource(target), 250);
        }}
        onCopy={() =>
          actionSheet &&
          void Clipboard.setStringAsync(actionSheet.text).catch(() => {})
        }
        onToggleStar={() =>
          actionSheet && toggleStar(actionSheet.channel, actionSheet.id)
        }
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
    </KeyboardAvoidingView>
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
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: Spacing.md,
    },
    memberCountBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
    },
    memberCountText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textSecondary,
    },
    // Messages
    list: {
      flexGrow: 1,
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.base,
      paddingBottom: Spacing.sm,
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
    pttButtonActive: {
      backgroundColor: Colors.dangerDim,
      borderColor: Colors.danger,
    },
    // Attachment picker sheet
    attachOverlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      justifyContent: "flex-end",
    },
    attachSheet: {
      width: "100%",
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.base,
      paddingBottom: Spacing["2xl"],
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.borderStrong,
      alignSelf: "center",
      marginBottom: Spacing.md,
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
    attachCancel: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.md,
      paddingVertical: Spacing.base,
      alignItems: "center",
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
    ecashOverlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      justifyContent: "flex-end",
    },
    ecashSheet: {
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      padding: Spacing.xl,
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
      borderRadius: Radius.md,
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
    attachImage: {
      width: "100%",
      height: 180,
      borderRadius: Radius.md,
      marginBottom: Spacing.xs,
      backgroundColor: Colors.surfaceRaised,
    },
    attachImagePlaceholder: {
      width: 200,
      height: 120,
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
      width: 200,
      height: 120,
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
    onMyBubble: {
      color: Colors.textInverse,
      backgroundColor: Colors.textInverse,
    },
    onTheirBubble: {
      color: Colors.textPrimary,
      backgroundColor: Colors.textPrimary,
    },
    // DM peer info sheet
    dmInfoOverlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      justifyContent: "flex-end",
    },
    dmInfoSheet: {
      width: "100%",
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      paddingBottom: Spacing["2xl"],
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
      fontFamily: "monospace",
      letterSpacing: 0.8,
      textAlign: "center",
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
    // Channel sender profile sheet's single action — solid pill, same
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
    // Members list sheet
    membersOverlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      justifyContent: "flex-end",
    },
    membersSheet: {
      width: "100%",
      maxHeight: "70%",
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      padding: Spacing.xl,
      gap: Spacing.md,
    },
    membersTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    membersEmpty: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      paddingVertical: Spacing.lg,
      textAlign: "center",
    },
    membersList: {
      width: "100%",
    },
    memberRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      padding: Spacing.sm,
      borderRadius: Radius.lg,
      backgroundColor: Colors.surfaceRaised,
      marginBottom: Spacing.xs,
    },
    memberRowInfo: {
      flex: 1,
      gap: 2,
    },
    memberRowName: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    memberRowStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    memberRowDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.online,
    },
    memberRowStatusText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    // Cashu payment cards rendered inside message bubbles. Deliberately distinct
    // from grey file attachments: an accent-tinted card with a hero amount, so
    // money reads as money at a glance (the WhatsApp / GPay payment convention).
    paymentCard: {
      marginTop: Spacing.xs,
      padding: Spacing.md,
      borderRadius: Radius.md,
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
    paymentCardClaimText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textInverse,
    },
    // Screenshot privacy notice modal: centered card, single action.
    screenshotOverlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.xl,
    },
    screenshotCard: {
      width: "100%",
      maxWidth: 340,
      backgroundColor: Colors.surface,
      borderRadius: Radius.xl,
      padding: Spacing.xl,
      gap: Spacing.sm,
    },
    screenshotTitle: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    screenshotMessage: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      lineHeight: 21,
      marginBottom: Spacing.sm,
    },
    screenshotButton: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.full,
      paddingVertical: Spacing.md,
      alignItems: "center",
    },
    screenshotButtonText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
  });
}
