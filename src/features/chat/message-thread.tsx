// Message thread screen for a single channel.
// Shows messages with sender and timestamp. Text input to compose and PTT button.

import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  findTokensInText,
  mayContainToken,
  type EmbeddedToken,
} from "../../core/payments/cashu";
import { getMeshService } from "../../services/mesh-service";
import {
  useChatStore,
  type ChatAttachment,
  type ChatMessage,
} from "../../store/chat-store";
import { usePeerStore } from "../../store/peer-store";
import { useWalletStore } from "../../store/wallet-store";
import Avatar from "../../ui/components/avatar";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";
import ChannelInfoSheet from "./channel-info-sheet";

type AttachAction = "camera" | "library" | "document" | "voice";

const ATTACH_OPTIONS: {
  action: AttachAction;
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  desc: string;
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
];

interface Props {
  channel: string;
  localNickname: string;
  localPeerID: string;
  onBack: () => void;
}

export default function MessageThread({
  channel,
  localNickname,
  localPeerID,
  onBack,
}: Props): React.JSX.Element {
  const { messages, addMessage } = useChatStore();
  // Live peer count, real data from BLE discovery, not a stub.
  // Reachable peer list, evaluated inside the store module to keep Date.now() off render.
  const onlinePeers = usePeerStore((s) => s.reachablePeers());
  const peerCount = onlinePeers.length;
  const dmPeerID = channel.startsWith("dm:") ? channel.slice(3) : null;
  const isDMPeerOnline =
    dmPeerID !== null && onlinePeers.some((p) => p.peerID === dmPeerID);
  const [draft, setDraft] = useState("");
  const [isPTTActive, setIsPTTActive] = useState(false);
  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSecs, setRecordingSecs] = useState(0);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingUri, setPlayingUri] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [showDMInfo, setShowDMInfo] = useState(false);
  // Brief delivery status hint shown below the compose bar for DMs.
  // "queued" = no route available; cleared after 4 seconds.
  const [dmStatus, setDmStatus] = useState<"queued" | null>(null);
  const dmStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  // Clean up recording timer, DM status timer, and any active sound on unmount.
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (dmStatusTimerRef.current) clearTimeout(dmStatusTimerRef.current);
      if (soundRef.current) void soundRef.current.unloadAsync();
      if (recordingRef.current)
        void recordingRef.current.stopAndUnloadAsync().catch(() => {});
    };
  }, []);

  const msgs = messages[channel] ?? [];
  const isDM = channel.startsWith("dm:");

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
    Alert.alert(
      `+${embedded.info.amount.toLocaleString()} ${embedded.info.unit}`,
      `Token added to your wallet from ${embedded.info.mintUrl.replace(/https?:\/\//, "")}.`,
    );
  }

  // Show a brief "queued" status hint, then auto-clear after 4 seconds.
  function showQueuedStatus(): void {
    if (dmStatusTimerRef.current) clearTimeout(dmStatusTimerRef.current);
    setDmStatus("queued");
    dmStatusTimerRef.current = setTimeout(() => {
      setDmStatus(null);
    }, 4000);
  }

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
        const result = service.sendDm(channel.slice(3), text);
        if (result === "needs-courier") showQueuedStatus();
      } else {
        service.sendChannelMessage(channel, text);
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
    }
  }

  // Build a local attachment message immediately (instant feedback), then read
  // the file bytes and transmit them over the mesh asynchronously.
  function sendAttachmentMessage(
    type: ChatAttachment["type"],
    uri: string,
    name?: string,
    mimeType?: string,
    durationMs?: number,
  ): void {
    const msg: ChatMessage = {
      // eslint-disable-next-line react-hooks/purity
      id: `${localPeerID}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      channel,
      senderID: localPeerID,
      senderNickname: localNickname,
      text: "",
      // eslint-disable-next-line react-hooks/purity
      timestampMs: Date.now(),
      isMine: true,
      attachment: { type, uri, name, mimeType, durationMs },
    };
    addMessage(msg);

    const service = getMeshService();
    if (!service) return;

    // Read the file bytes and push them through the file-transfer pipeline.
    void (async () => {
      try {
        const b64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // Convert base64 to Uint8Array in Hermes (no Buffer available).
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        service.sendAttachment(channel, bytes, {
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
        Alert.alert("Attachment not sent", reason);
      }
    })();
  }

  async function handleCameraAttach(): Promise<void> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Grant camera access in Settings to take photos.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.85,
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
      Alert.alert(
        "Permission needed",
        "Grant photo library access in Settings.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.85,
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
    sendAttachmentMessage("document", asset.uri, asset.name, asset.mimeType);
  }

  async function startRecording(): Promise<void> {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Grant microphone access in Settings to record voice notes.",
      );
      return;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingSecs(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSecs((s) => s + 1);
      }, 1000);
    } catch {
      Alert.alert(
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
    setIsRecording(false);
    setRecordingSecs(0);

    const rec = recordingRef.current;
    recordingRef.current = null;
    if (!rec || duration < 1) return;

    try {
      await rec.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = rec.getURI();
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
    setIsRecording(false);
    setRecordingSecs(0);
    const rec = recordingRef.current;
    recordingRef.current = null;
    if (rec) await rec.stopAndUnloadAsync().catch(() => {});
  }

  async function playVoiceNote(uri: string): Promise<void> {
    if (!uri) return;
    // Toggle playback off if already playing this clip.
    if (playingUri === uri) {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setPlayingUri(null);
      return;
    }
    // Stop any previous clip.
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        (status) => {
          if ("isLoaded" in status && status.isLoaded && status.didJustFinish) {
            setPlayingUri(null);
            sound.unloadAsync().catch(() => {});
            soundRef.current = null;
          }
        },
      );
      soundRef.current = sound;
      setPlayingUri(uri);
    } catch {
      setPlayingUri(null);
    }
  }

  function formatDuration(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function handleInvite(): void {
    void Share.share({
      message: `Join me in ${channel} on Airhop - offline-first, private mesh messaging.`,
    });
  }

  function renderAttachmentBubble(
    attachment: ChatAttachment,
  ): React.JSX.Element {
    switch (attachment.type) {
      case "image":
        return attachment.uri ? (
          <Image
            source={{ uri: attachment.uri }}
            style={styles.attachImage}
            resizeMode="cover"
            accessibilityLabel="Attached image"
          />
        ) : (
          <View style={styles.attachImagePlaceholder}>
            <Feather name="image" size={28} color={Colors.textMuted} />
            <Text style={styles.attachImagePlaceholderText}>
              {attachment.name ?? "Image"}
            </Text>
          </View>
        );
      case "voice": {
        const isPlaying = playingUri === attachment.uri;
        return (
          <View style={styles.attachVoice}>
            <Pressable
              style={styles.attachVoicePlay}
              onPress={() => void playVoiceNote(attachment.uri)}
              accessibilityRole="button"
              accessibilityLabel={
                isPlaying ? "Pause voice note" : "Play voice note"
              }
            >
              <Feather
                name={isPlaying ? "pause" : "play"}
                size={16}
                color={Colors.textPrimary}
              />
            </Pressable>
            {/* Static waveform bars */}
            <View style={styles.attachVoiceWave}>
              {[6, 12, 8, 16, 10, 14, 8, 6, 12, 10, 8, 14].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.attachVoiceBar,
                    { height: h, opacity: isPlaying ? 1 : 0.5 },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.attachVoiceDuration}>
              {formatDuration(Math.round((attachment.durationMs ?? 0) / 1000))}
            </Text>
          </View>
        );
      }
      case "document":
        return (
          <View style={styles.attachDoc}>
            <View style={styles.attachDocIcon}>
              <Feather
                name="file-text"
                size={20}
                color={Colors.textSecondary}
              />
            </View>
            <Text style={styles.attachDocName} numberOfLines={2}>
              {attachment.name ?? "Document"}
            </Text>
          </View>
        );
      case "video":
        return (
          <View style={styles.attachVideoPlaceholder}>
            <Feather name="film" size={28} color={Colors.textMuted} />
            <Text style={styles.attachImagePlaceholderText}>
              {attachment.name ?? "Video"}
            </Text>
          </View>
        );
    }
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
          {isDM ? (
            <Feather name="lock" size={12} color={Colors.textMuted} />
          ) : (
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
              <View
                style={[
                  styles.messageRow,
                  item.isMine ? styles.messageRowMine : styles.messageRowTheirs,
                ]}
              >
                {/* Avatar placeholder for alignment */}
                {showAvatar ? (
                  isFirstFromSender ? (
                    <Avatar
                      username={item.senderNickname}
                      peerID={item.senderID}
                      size={32}
                    />
                  ) : (
                    <View style={styles.avatarSpacer} />
                  )
                ) : null}

                <View
                  style={[
                    styles.bubbleWrapper,
                    item.isMine
                      ? styles.bubbleWrapperMine
                      : styles.bubbleWrapperTheirs,
                  ]}
                >
                  {showAvatar && isFirstFromSender && (
                    <Text style={styles.senderName}>{item.senderNickname}</Text>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      item.isMine ? styles.bubbleMine : styles.bubbleTheirs,
                      // Tail shape: square the corner closest to avatar/edge
                      !item.isMine &&
                        isFirstFromSender &&
                        styles.bubbleTailLeft,
                      item.isMine && styles.bubbleTailRight,
                    ]}
                  >
                    {item.attachment && renderAttachmentBubble(item.attachment)}
                    {/* Compute token list once and suppress raw text when the
                        entire message is a Cashu token (no extra prose). */}
                    {(() => {
                      const tokens = mayContainToken(item.text)
                        ? findTokensInText(item.text)
                        : [];
                      // If the trimmed message equals the first token's raw
                      // string, it's a pure token DM; skip the raw text.
                      const isPureToken =
                        tokens.length > 0 &&
                        tokens[0]!.raw.trim() === item.text.trim();
                      return (
                        <>
                          {item.text.length > 0 && !isPureToken && (
                            <Text
                              style={[
                                styles.messageText,
                                item.isMine
                                  ? styles.messageTextMine
                                  : styles.messageTextTheirs,
                              ]}
                            >
                              {item.text}
                            </Text>
                          )}
                          {tokens.map((embedded) => (
                            <View key={embedded.raw} style={styles.paymentCard}>
                              <View style={styles.paymentCardHeader}>
                                <Feather
                                  name="zap"
                                  size={14}
                                  color={Colors.accent}
                                />
                                <Text style={styles.paymentCardAmount}>
                                  {embedded.info.amount.toLocaleString()}{" "}
                                  {embedded.info.unit}
                                </Text>
                              </View>
                              <Text
                                style={styles.paymentCardMint}
                                numberOfLines={1}
                              >
                                {embedded.info.mintUrl.replace(
                                  /https?:\/\//,
                                  "",
                                )}
                              </Text>
                              {embedded.info.memo ? (
                                <Text style={styles.paymentCardMemo}>
                                  {embedded.info.memo}
                                </Text>
                              ) : null}
                              {!item.isMine && (
                                <Pressable
                                  style={({ pressed }) => [
                                    styles.paymentCardClaim,
                                    pressed && { opacity: 0.75 },
                                  ]}
                                  onPress={() => claimToken(embedded)}
                                  accessibilityRole="button"
                                  accessibilityLabel={`Claim ${embedded.info.amount.toLocaleString()} ${embedded.info.unit}`}
                                >
                                  <Text style={styles.paymentCardClaimText}>
                                    Claim
                                  </Text>
                                </Pressable>
                              )}
                            </View>
                          ))}
                        </>
                      );
                    })()}
                    <Text
                      style={[
                        styles.timestamp,
                        item.isMine && styles.timestampMine,
                      ]}
                    >
                      {formatTime(item.timestampMs)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
        onContentSizeChange={() => {
          if (msgs.length > 0)
            listRef.current?.scrollToEnd({ animated: false });
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

      {/* Queued DM hint: shown briefly when there is no route to deliver the message. */}
      {isDM && dmStatus === "queued" && (
        <View style={styles.dmStatusBar}>
          <Feather name="clock" size={12} color={Colors.textMuted} />
          <Text style={styles.dmStatusText}>
            Peer not reachable - message queued for delivery
          </Text>
        </View>
      )}

      {/* Compose bar */}
      <View style={styles.composeBar}>
        <Pressable
          style={styles.attachButton}
          onPress={handleAttach}
          accessibilityRole="button"
          accessibilityLabel="Attach a file"
        >
          <Feather name="paperclip" size={18} color={Colors.textMuted} />
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
        <Pressable
          style={styles.attachOverlay}
          onPress={() => setShowAttachMenu(false)}
          accessible={false}
        >
          <View style={styles.attachSheet}>
            <View style={styles.handle} />
            <Text style={styles.attachSheetTitle}>Attach</Text>
            {ATTACH_OPTIONS.map(({ action, icon, label, desc }, i) => (
              <React.Fragment key={action}>
                {i > 0 && <View style={styles.attachSeparator} />}
                <Pressable
                  style={({ pressed }) => [
                    styles.attachOption,
                    pressed && styles.attachOptionPressed,
                  ]}
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
            ))}
            <Pressable
              style={styles.attachCancel}
              onPress={() => setShowAttachMenu(false)}
              accessibilityRole="button"
            >
              <Text style={styles.attachCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      {/* Channel info sheet: opens when user taps the header center */}
      {!isDM && (
        <ChannelInfoSheet
          channel={showChannelInfo ? channel : null}
          onClose={() => setShowChannelInfo(false)}
          onLeave={onBack}
        />
      )}

      {/* DM peer info sheet: opens when user taps the DM header */}
      {isDM && (
        <Modal
          visible={showDMInfo}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDMInfo(false)}
        >
          <Pressable
            style={styles.dmInfoOverlay}
            onPress={() => setShowDMInfo(false)}
          >
            <View style={styles.dmInfoSheet}>
              <View style={styles.handle} />
              <View style={styles.dmInfoBody}>
                <Avatar
                  username={displayName}
                  peerID={channel.slice(3)}
                  size={64}
                />
                <Text style={styles.dmInfoName}>{displayName}</Text>
                <Text style={styles.dmInfoPeerID}>{channel.slice(3)}</Text>
                {/* Peer online status — same 60s freshness window as the offline banner */}
                {isDMPeerOnline && (
                  <View style={styles.dmInfoStatus}>
                    <View style={styles.dmInfoDot} />
                    <Text style={styles.dmInfoStatusText}>In BLE range</Text>
                  </View>
                )}
                <View style={styles.dmInfoEncNote}>
                  <Feather name="lock" size={12} color={Colors.textMuted} />
                  <Text style={styles.dmInfoEncText}>
                    End-to-end encrypted via Noise XX and Double Ratchet
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    alignItems: "center",
    justifyContent: "flex-end",
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
  messageRow: {
    flexDirection: "row",
    marginVertical: 2,
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  messageRowMine: {
    justifyContent: "flex-end",
  },
  messageRowTheirs: {
    justifyContent: "flex-start",
  },
  avatarSpacer: {
    width: 32,
    flexShrink: 0,
  },
  bubbleWrapper: {
    maxWidth: "75%",
    gap: 2,
  },
  bubbleWrapperMine: {
    alignItems: "flex-end",
  },
  bubbleWrapperTheirs: {
    alignItems: "flex-start",
  },
  senderName: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginLeft: Spacing.md,
    marginBottom: 2,
  },
  bubble: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.lg,
  },
  bubbleMine: {
    backgroundColor: Colors.myBubble,
  },
  bubbleTheirs: {
    backgroundColor: Colors.theirBubble,
  },
  // Flatten the corner that points "at" the sender
  bubbleTailLeft: {
    borderBottomLeftRadius: Radius.sm,
  },
  bubbleTailRight: {
    borderBottomRightRadius: Radius.sm,
  },
  messageText: {
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.5,
  },
  messageTextMine: {
    color: Colors.textInverse,
  },
  messageTextTheirs: {
    color: Colors.textPrimary,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  timestampMine: {
    color: "rgba(255,255,255,0.55)",
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
  attachOptionPressed: {
    backgroundColor: Colors.surfaceRaised,
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
  attachVoice: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 160,
  },
  attachVoicePlay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
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
  attachVoiceBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  attachVoiceDuration: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.7)",
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
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  attachDocName: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: FontSize.sm,
    color: Colors.textInverse,
    fontWeight: FontWeight.medium,
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
  dmInfoEncNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  dmInfoEncText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: "center",
    flex: 1,
  },
  // Cashu payment cards rendered inside message bubbles.
  paymentCard: {
    marginTop: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceRaised,
    gap: 3,
    minWidth: 180,
  },
  paymentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  paymentCardAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
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
});
