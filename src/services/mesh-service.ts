// BLE mesh wiring service.
//
// Bridges the native AirhopBLE TurboModule to the core TypeScript engine.
// One singleton instance is created after identity generation and lives for
// the app's lifetime.
//
// Responsibilities:
//   - Start BLE advertising (peripheral) + scanning (central)
//   - Start WiFi direct transport (MC on iOS, WiFi Aware on Android)
//   - Send periodic ANNOUNCE packets via AnnounceManager
//   - Receive raw bytes, reassemble fragments, and route inner packets
//   - Dispatch ANNOUNCE payloads to PeerStore (UI layer)
//   - Dispatch CHANNEL_MSG, NOISE_ENCRYPTED, DR_ENCRYPTED to ChatStore
//   - Expose sendChannelMessage(), sendDm(), sendAttachment() for feature layer

import AirhopBLE from "@bridge/NativeAirhopBLE";
import NativeAirhopWiFi from "@bridge/NativeAirhopWiFi";
import {
  decodeContactCard,
  encodeContactCard,
  type ContactCard,
} from "@core/crypto/contact-exchange";
import {
  canEncrypt,
  initReceiver,
  initSender,
  ratchetDecrypt,
  ratchetEncrypt,
  type RatchetState,
} from "@core/crypto/double-ratchet";
import type { Identity } from "@core/crypto/identity";
import { noiseXOpen, noiseXSeal } from "@core/crypto/noise-x";
import { NoiseHandshake, type NoiseSession } from "@core/crypto/noise-xx";
import { base64ToBytes, bytesToBase64 } from "@core/encoding/base64";
import {
  computeRecipientTag,
  CourierStore,
  decodeEnvelopePayload,
  encodeEnvelopePayload,
  ENVELOPE_TTL_MS,
} from "@core/mesh/courier/courier-store";
import {
  LocalPrekeyStore,
  PeerPrekeyStore,
} from "@core/mesh/courier/prekey-store";
import {
  ANNOUNCE_TTL,
  AnnounceManager,
  Capability,
  decodeAnnouncePayload,
  isAnnounceFresh,
} from "@core/mesh/discovery/announce-manager";
import {
  openChannelMessage,
  sealChannelMessage,
} from "@core/mesh/rooms/channel-crypto";
import {
  decodeGroupEnvelope,
  decodeGroupState,
  encodeGroupState,
  GROUP_KEY_LENGTH,
  GROUP_MAX_MEMBERS,
  groupFingerprint,
  groupStateAction,
  newGroupID,
  newGroupKey,
  openGroupMessage,
  sealGroupMessage,
  signGroupState,
  verifyGroupState,
  type BitchatGroup,
  type GroupMember,
} from "@core/mesh/rooms/group-protocol";
import { FloodRouter } from "@core/mesh/routing/flood-router";
import {
  FRAG_DATA_SIZE,
  FragmentManager,
  type FragmentProgress,
} from "@core/mesh/routing/fragment-manager";
import { nextHopFor } from "@core/mesh/routing/source-route";
import { GossipSync } from "@core/mesh/sync/gossip-sync";
import { RequestSyncManager } from "@core/mesh/sync/request-sync-manager";
import { VoiceCaptureSession } from "@core/mesh/voice/voice-capture";
import { VoicePlayer } from "@core/mesh/voice/voice-player";
import {
  decodeBoardWire,
  encodeBoardWire,
  isUrgent,
  newPostID,
  signBoardPost,
  signBoardTombstone,
  URGENT,
  verifyBoardWire,
  type BoardPost,
  type BoardWire,
} from "@core/mesh/wire/board-packet";
import {
  decodeDmPayload,
  DmPayloadType,
  encodeDmMessage,
  encodeDmReceipt,
} from "@core/mesh/wire/dm-payload";
import {
  decodeLocationPin,
  encodeLocationPin,
  type LocationPin,
} from "@core/mesh/wire/location-pin";
import {
  decodeMeshPing,
  encodeMeshPing,
  newPingNonce,
  pingHopCount,
} from "@core/mesh/wire/mesh-ping";
import {
  decodeNoisePayload,
  decodePrivateMessagePacket,
  encodeNoisePrivateMessage,
  NoisePayloadType,
  type NoisePayloadTypeValue,
} from "@core/mesh/wire/noise-payload";
import {
  CarrierDirection,
  decodeNostrCarrier,
  encodeNostrCarrier,
} from "@core/mesh/wire/nostr-carrier";
import {
  BROADCAST_ID,
  decodePacket,
  encodePacket,
  Flags,
  isBroadcast,
  isForMe,
  PacketType,
  signPacket,
  verifyPacket,
  type Packet,
} from "@core/mesh/wire/packet-codec";
import {
  decodePeerStatePacket,
  encodePeerStatePacket,
} from "@core/mesh/wire/peer-state-packet";
import {
  decodePrekeyBundle,
  encodePrekeyBundle,
  verifyPrekeyBundle,
} from "@core/mesh/wire/prekey-bundle";
import {
  decodeBitchatEnvelope,
  encodeBitchatAckEnvelope,
  encodeBitchatDmEnvelope,
} from "@core/nostr/bitchat-envelope";
import { bridgeStableID } from "@core/nostr/bridge-event";
import { deriveNostrPrivKey, unwrapDm, wrapDm } from "@core/nostr/gift-wrap";
import { NostrClient } from "@core/nostr/nostr-client";
import {
  decodeAirhopChannelPayload,
  decodeMeshPublicPayload,
  MessageRouter,
  newMessageId,
  PeerRegistry,
  type NostrSendFn,
  type RouterIdentity,
} from "@core/router/message-router";
import { t } from "@i18n";
import { x25519 } from "@noble/curves/ed25519.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { useActivityStore } from "@store/activity-store";
import { useBlockedStore } from "@store/blocked-store";
import { useBoardStore } from "@store/board-store";
import { useChannelMembersStore } from "@store/channel-members-store";
import { useChatStore } from "@store/chat-store";
import { useContactsStore } from "@store/contacts-store";
import {
  evictExpiredOwedGroupStates,
  queueOwedGroupState,
  takeOwedGroupStates,
} from "@store/group-invite-outbox-store";
import { groupChannel, useGroupStore } from "@store/group-store";
import { useMeshStateStore } from "@store/mesh-state-store";
import { useOutboxStore, type PendingMessage } from "@store/outbox-store";
import { usePeerStore } from "@store/peer-store";
import { useSettingsStore } from "@store/settings-store";
import { useTransferStore } from "@store/transfer-store";
import { geohashChannel, isManualGeoChannel } from "@utils/channel-key";
import { BRIDGE_CHANNEL, canSendMedia } from "@utils/media-policy";
import {
  channelSenderName,
  resolveDisplayName,
} from "@utils/peer-display-name";
import {
  getPublicKey,
  verifyEvent,
  type Event as NostrEvent,
} from "nostr-tools";
import { DeviceEventEmitter, type EventSubscription } from "react-native";
import { setAudioForPlayback } from "./audio-session";
import { BridgeService } from "./bridge-service";
import {
  FileTransferService,
  type AttachmentMeta,
  type SendOutcome,
} from "./file-transfer-service";
import {
  GeohashChannelService,
  isGeoChannel,
  type GeoParticipant,
} from "./geohash-channel-service";
import { rebindNutzapWatcher } from "./nutzap-watcher-handle";
import { PrivateChannelService } from "./private-channel-service";
import { RadioController } from "./radio-controller";
import {
  isLiveVoiceAvailable,
  NativeAudioCapture,
  NativeAudioPlayback,
} from "./voice-audio-backend";
import { WiFiController } from "./wifi-controller";

// ---- Constants ----

// HKDF info string used to derive the Double Ratchet root key from the Noise XX
// handshake transcript hash. Airhop-to-Airhop only: bitchat nodes never receive
// DR_ENCRYPTED packets.
const DR_SEED_INFO = new TextEncoder().encode("airhop-dr-seed-v1");

// How often to sweep the outbox for queued DMs that can now go over Nostr.
// Slow on purpose: it is a safety net behind the event-driven flush, not the
// primary delivery path, so it stays cheap and never spams relays.
const OUTBOX_SWEEP_INTERVAL_MS = 45_000;

// Floor between outbox retries, however many events ask for one. Retries are
// event-driven now, and events arrive in bursts: a foreground round trip alone
// raises several.
const OUTBOX_RETRY_MIN_INTERVAL_MS = 10_000;

// A board notice only counts as "new" for the notification bell if it was
// created within this window. It keeps a channel's history replay on subscribe,
// and a gossip backfill of old-but-unexpired posts, from flooding the bell with
// notices the user has effectively already had the chance to see.
const NOTICE_BELL_WINDOW_MS = 5 * 60 * 1000;

// Where a channel message actually went. `bleLinks === 0 && !nostr` means it
// reached nobody. The UI must say so rather than render a normal sent bubble.
export interface ChannelSendResult {
  msgId: string;
  bleLinks: number;
  // A relay was live when the publish went out. Not the channel's capability to
  // reach Nostr, which holds whether or not the phone has internet: a region
  // message carried by Bluetooth alone would report "sent" having reached nobody.
  nostr: boolean;
  // No relay was live, but a nearby peer advertises the internet-gateway
  // capability and took the signed event to publish on our behalf. Not delivered,
  // but on its way, which is worth telling the user apart from "nobody got this".
  gateway: boolean;
}

// What a group send actually achieved. Groups have no delivery receipts on
// either client, so this is the only honest signal the UI ever gets.
export interface GroupSendResult {
  // We held the group and its key, and the packet was built and handed to the
  // radio.
  sealed: boolean;
  // How many Bluetooth/Wi-Fi links it went out on. Zero means it reached nobody:
  // a group is Bluetooth-only, so there is no internet path to fall back on.
  bleLinks: number;
}

// Round-trip result of a mesh ping: latency and the number of links crossed.
export interface MeshPingResult {
  rttMs: number;
  hops: number | null;
}

// How loud the live voice moving through this device is, 0 to 1.
//
// `outbound` is the microphone while a burst of yours is open; `inbound` is
// whoever currently holds the speaker. Both are raw RMS, deliberately not
// shaped for display: speech sits low on a linear scale, and the curve that
// makes a meter read well belongs beside the bars it draws.
export interface VoiceLevel {
  outbound: number;
  inbound: number;
}

// TTL a ping launches with (also the hop-count reference for the pong).
const MESH_PING_TTL = 7;
// How long to wait for a pong before resolving the probe as unreachable.
const MESH_PING_TIMEOUT_MS = 10_000;

// Minimum spacing between pong replies on one ingress link (anti-amplification).
const MESH_PONG_MIN_INTERVAL_MS = 100;

// A Noise handshake with no reply within this window is treated as dead and
// dropped lazily on the next send, so a lost msg2/msg3 (or a peer that went away
// mid-handshake) never wedges future mesh DMs to that peer. bitchat gets the same
// recovery from event-driven session clears (decrypt failure, stale-link
// announce); an age check is the equivalent safety net here. Generous enough to
// cover a multi-hop round trip.
const HANDSHAKE_TIMEOUT_MS = 30_000;

// How stale a live-voice frame may be before it is treated as a straggler or a
// replay rather than something anyone should start hearing. Matches bitchat's
// TransportConfig.pttPublicFrameMaxAgeSeconds (30s).
const PTT_FRAME_MAX_AGE_MS = 30_000;

// How far a packet's timestamp may sit from our clock before we refuse to carry
// or act on it. Matches bitchat's 2-minute window (REQUEST_SYNC_MANAGER.md).
//
// This is the general replay bound. The deduplicator cannot be it: its window is
// five minutes and its state is per device, so it says nothing about a phone
// that never heard the original. Freshness is the part that travels.
//
// Two minutes is generous. Phones are NTP-synced and an offline RTC drifts by
// seconds a day, not minutes, so the failure is rare and visible (a peer whose
// clock is out cannot talk to anyone) rather than silent.
//
// Not applied to solicited sync responses, which are old by definition.
const PACKET_MAX_SKEW_MS = 2 * 60 * 1000;

// How many different peers must look out of time before we blame our own clock.
// Two separates "that peer is replaying" from "everyone disagrees with us", and
// is low enough to catch it in a room with only a couple of neighbours.
const CLOCK_SKEW_PEER_THRESHOLD = 2;

interface PendingHandshake {
  handshake: NoiseHandshake;
  role: "initiator" | "responder";
  // Messages queued while the handshake is in progress. The id is carried so the
  // eventual send keeps the same message id the UI is showing, which is what lets
  // a delivery receipt find the right bubble. Carried across an initiator->
  // responder reset so a simultaneous-initiation flip does not drop queued DMs.
  pendingText: { messageID: string; text: string }[];
  // When this handshake attempt began (ms epoch), for the staleness check above.
  startedAt: number;
}

// Gateway downlink limits, matching bitchat GatewayService.Limits. The geohash
// channel kind (ephemeral note) is the only kind ferried onto the mesh; events
// older than the freshness window are dropped (receivers drop them too); and no
// more than N ferries ride the mesh in any rolling minute (BLE airtime is scarce).
const GEOHASH_CHANNEL_KIND = 20000;
export const CARRIER_MAX_EVENT_AGE_SECONDS = 15 * 60;
export const DOWNLINK_EVENTS_PER_MINUTE = 30;
// Uplink deposits accepted per depositor per rolling minute, matching bitchat
// GatewayService.Limits.uplinkEventsPerMinutePerDepositor. Bounds how much a
// single mesh peer can make our gateway publish to relays on its behalf.
export const UPLINK_EVENTS_PER_MINUTE_PER_DEPOSITOR = 10;
// Deposits held while relays are unreachable, matching bitchat
// GatewayService.Limits. Bounded twice: in total, so a busy island cannot make
// the gateway hold unbounded memory, and per depositor, so one peer cannot fill
// the bag and crowd everyone else out.
export const MAX_QUEUED_UPLINKS = 20;
export const MAX_QUEUED_UPLINKS_PER_DEPOSITOR = 5;

// Trim a nickname to the board's 64-byte cap (bitchat BoardWireConstants), by
// UTF-8 length rather than character count so multibyte names cannot overflow.
function clampNickname(nickname: string): string {
  let n = nickname;
  while (new TextEncoder().encode(n).length > 64) n = n.slice(0, -1);
  return n;
}

// ---- MeshService ----

export class MeshService {
  private readonly identity: Identity;
  // secp256k1 key pair for Nostr DMs, derived deterministically from the
  // Ed25519 signing key.
  private readonly nostrPrivKey: Uint8Array;
  private readonly nostrPubKeyHex: string;
  // A remote peer's Nostr pubkey hex to their peerID, filled as ANNOUNCEs arrive.
  private readonly nostrPubkeyToPeerID = new Map<string, string>();

  // Relay jitter adapts to how many peers we can hear (BLE + WiFi links).
  private readonly floodRouter = new FloodRouter(
    () => this.connectedLinks.size + this.wifiConnectedLinks.size,
  );
  private readonly registry = new PeerRegistry();
  private readonly announceManager = new AnnounceManager();
  private readonly router: MessageRouter;
  private nostrClient: NostrClient | null = null;
  // Location-scoped channels bridged over Nostr. Null until the Nostr client
  // exists; inert when location permission is unavailable.
  private geoChannels: GeohashChannelService | null = null;
  private privateChannels: PrivateChannelService | null = null;
  // Mesh bridge: stitches public #bluetooth chat across mesh islands over Nostr.
  private bridgeService: BridgeService | null = null;
  // Broadcast a packet over every connected BLE link. Captured from the
  // constructor's broadcastFn so board posts reach the mesh like any broadcast.
  private broadcastPacket!: (packet: Packet) => void;
  // Bridged Nostr event ids by board postID hex, for merged deletes. In-memory
  // only: after a relaunch a delete still tombstones the board copy, but the
  // Nostr copy is left to expire with relay retention (matches bitchat).
  private readonly bridgedBoardEventIDs = new Map<string, string>();
  // Outstanding mesh pings by nonce hex, awaiting a pong (RTT/hops probe).
  private readonly pendingPings = new Map<
    string,
    {
      peerID: string;
      sentAtMs: number;
      resolve: (result: MeshPingResult | null) => void;
      timer: ReturnType<typeof setTimeout>;
    }
  >();
  // Last time we answered a ping on a given ingress link, for anti-amplification
  // rate limiting keyed on the physical link (pings are unsigned, so the claimed
  // sender is untrusted).
  private readonly lastPongAtByLink = new Map<string, number>();
  // Nostr event ids seen via gateway carriers, to break rebroadcast loops and
  // drop duplicate ferries. Insertion-ordered; capped.
  private readonly seenCarrierEventIDs = new Set<string>();
  // Gateway loop prevention, mirroring bitchat GatewayService's ID sets:
  //   publishedEventIDs  - events we (as a gateway) published to relays on a
  //                        mesh peer's behalf; never rebroadcast their relay echo.
  //   rebroadcastEventIDs - relay events we already ferried to the mesh; ferry once.
  private readonly publishedEventIDs = new Set<string>();
  // Deposits accepted while the relays were down, waiting for a connection.
  // Without this a mesh-only peer that hands its message to a gateway during a
  // momentary outage loses it silently: the deposit is directed, so no other
  // peer ever saw it, and the sender has no way to know it went nowhere.
  private queuedUplinks: {
    depositor: string;
    geohash: string;
    event: NostrEvent;
  }[] = [];
  private readonly rebroadcastEventIDs = new Set<string>();
  // Sliding 60s window of downlink-rebroadcast timestamps, bounding BLE airtime.
  private downlinkSendTimes: number[] = [];
  // Per-depositor sliding 60s windows of uplink-deposit timestamps, so one mesh
  // peer cannot make our gateway spam relays (bitchat uplinkDepositTimes).
  private readonly uplinkDepositTimes = new Map<string, number[]>();
  // Unsubscribe for the chat-store listener that re-syncs private Nostr channels.
  private chatUnsub: (() => void) | null = null;
  // Unsubscribe for the settings listener that re-announces on a gateway toggle.
  private gatewayUnsub: (() => void) | null = null;
  // Unsubscribe for the settings listener that toggles the bridge on/off.
  private bridgeUnsub: (() => void) | null = null;
  private internetUnsub: (() => void) | null = null;
  private relayPrefsUnsub: (() => void) | null = null;
  // Unsubscribe for the settings listener that tears live voice down when the
  // user switches it off mid-burst.
  private liveVoiceUnsub: (() => void) | null = null;
  private backgroundPrefUnsub: (() => void) | null = null;
  // Unsubscribe for the contacts-store listener that binds a peer's durable
  // Nostr pubkey from the registry when a contact is created.
  private contactsUnsub: (() => void) | null = null;
  // Periodic sweep that retries queued DMs over Nostr for recipients the mesh
  // can no longer promptly reach. Mirrors bitchat's retryBridgeCourierDeposits:
  // a peer stays "reachable" for a minute after its radio disappears, so the
  // original send trusted the mesh and never tried the internet, and nothing
  // else retried it. Null when the service is stopped.
  private outboxSweepTimer: ReturnType<typeof setInterval> | null = null;
  private lastOutboxRetryMs = 0;

  // Currently connected BLE link IDs.
  private readonly connectedLinks = new Set<string>();
  // peerID (16 hex) -> linkID for unicast to direct neighbours.
  private readonly peerToLink = new Map<string, string>();
  // linkID to peerID (16 hex): used to clean up on disconnect.
  private readonly linkToPeer = new Map<string, string>();
  // In-progress Noise XX handshakes keyed by remote peerID.
  private readonly pendingHandshakes = new Map<string, PendingHandshake>();

  // Double Ratchet states keyed by peerID. Only set for Airhop-to-Airhop
  // sessions (peers who announced a Nostr pubkey). bitchat peers continue
  // using plain NOISE_ENCRYPTED transport.
  private readonly drStates = new Map<string, RatchetState>();

  // Creator-signed group states owed to a member we could not reach yet, keyed
  // by peerID. A group invite travels inside a Noise session, but you can pick
  // a member from their announce alone, long before any handshake has happened.
  // Without this the invite was dropped in silence: the creator saw a working
  // group and the member never learned it existed. Flushed when the session
  // comes up.
  // Owed group states live in group-invite-outbox, persisted: in memory only, an
  // app restart lost every invite and rotation a member had not collected yet.

  // Wire message ids received from a peer over the DR path that still owe a read
  // receipt, sent when the user opens that conversation. Ephemeral: read
  // receipts are best-effort and need not survive a restart.
  private readonly pendingReadAcks = new Map<string, Set<string>>();
  // Read receipts owed over Nostr, keyed by the sender's Nostr pubkey hex.
  // Flushed when the user opens that conversation.
  private readonly pendingNostrReadAcks = new Map<string, Set<string>>();

  // Fragment reassembly: collects FRAGMENT packets into full packets.
  private readonly fragmentManager = new FragmentManager();

  // Store-and-forward courier. Holds sealed envelopes addressed to OTHER peers
  // and hands them on when we meet someone new, the mesh equivalent of
  // carrying a letter. Complements the outbox: the outbox retries when the
  // recipient comes back to us, the courier lets a third party carry it to them.
  private readonly courier = new CourierStore();
  // One-time prekeys: ours (published in a signed bundle, opened + consumed on
  // receipt) and peers' (assigned when we courier-seal to them). Forward secrecy
  // for asynchronous first contact.
  private readonly localPrekeys = new LocalPrekeyStore();
  private readonly peerPrekeys = new PeerPrekeyStore();

  // Gossip reconciliation. Peers periodically broadcast a compact GCS filter of
  // the packet IDs they've seen; anyone holding something absent from that
  // filter replays it. This is how a peer that was out of range catches up on
  // channel traffic it missed, instead of that history being lost forever.
  private readonly gossip = new GossipSync();

  // The sync requests we currently have outstanding, by peer. This is the only
  // thing that makes the freshness window below survivable: gossip sync exists
  // to replay old packets, so without a way to attribute a replay to a request
  // we actually made, "old" and "replayed by an attacker" are the same packet.
  private readonly requestSync = new RequestSyncManager();

  // File transfer pipeline: chunk encoding/reassembly and cache writing.
  // Initialized in the constructor so it can share broadcastFn / unicastFn.
  private readonly fileXfer!: FileTransferService;

  // Live push-to-talk. Both sides are built on first use rather than at
  // startup: a mesh that never carries a voice burst should never have opened
  // the microphone or the speaker, and a device without the native audio
  // module should not pay for machinery it cannot drive.
  private pttCapture: VoiceCaptureSession | null = null;
  private pttPlayer: VoicePlayer | null = null;
  private pttPlayback: NativeAudioPlayback | null = null;
  // Called when a burst starts or ends, so the UI can show who is talking.
  private onPttActivity: ((talkers: string[]) => void) | null = null;
  // Called about fifteen times a second while voice is moving, so the meter in
  // the recording bar and the one in the incoming banner show the actual voice
  // rather than a decorative animation.
  //
  // Both directions in one report because a listener needs both and they can
  // overlap: somebody can key up while another burst is still playing. Each is
  // 0 whenever that pipeline is not running, so a UI reading only one of them
  // never has to know about the other.
  private onPttLevel: ((level: VoiceLevel) => void) | null = null;
  private pttLevel: VoiceLevel = { outbound: 0, inbound: 0 };
  // The conversation the user is looking at right now, with the app in front of
  // them, or null. A burst is only played when it belongs to THIS channel. See
  // setLiveVoiceAudible.
  private audibleChannel: string | null = null;

  // WiFi direct links (MC on iOS, WiFi Aware on Android). Separate maps
  // because WiFi IDs must never collide with BLE link IDs.
  private readonly wifiConnectedLinks = new Set<string>();
  private readonly wifiPeerToLink = new Map<string, string>();
  private readonly wifiLinkToPeer = new Map<string, string>();

  // Stored closure so sendDRMessage can unicast DR_ENCRYPTED packets without
  // duplicating the WiFi-vs-BLE preference logic.
  private unicastFn!: (recipientPeerID: string, packet: Packet) => void;

  private subs: EventSubscription[] = [];
  private nickname = "";
  // Whether start() has run without a matching stop(). Guards the recovery
  // paths (see retryRadios) so a late event - a permission granted in Settings,
  // Bluetooth switched back on - can never bring the radios up behind a user
  // who deliberately went Away.
  private running = false;
  // Owns the BLE radios: what they should be doing, what is stopping them, and
  // the retries in between. See radio-controller.ts.
  private readonly radio: RadioController;
  // The same job for the same-platform WiFi fast path. Separate from `radio`
  // because the two answer to different facts and, crucially, to different
  // stakes: a blocked BLE radio is a broken mesh and gets a red banner, a
  // blocked WiFi Aware attach is a slower attachment and gets a retry plus, at
  // most, a neutral note. See wifi-controller.ts.
  private readonly wifi = new WiFiController((state) =>
    useMeshStateStore.getState().setWifiFastPath(state),
  );

  // Cumulative bytes moved over BLE/WiFi this session, for the Storage &
  // Data screen's Network Usage row. Resets when the app restarts.
  private bytesSent = 0;
  private bytesReceived = 0;

  getByteCounters(): { sent: number; received: number } {
    return { sent: this.bytesSent, received: this.bytesReceived };
  }

  // Live radio links, split by transport, for the Diagnostics screen.
  //
  // A link is a socket we hold, which is a different question from how many
  // peers we can reach: one link can carry a dozen relayed peers, and a peer we
  // announce to may be several hops away with no link of ours anywhere near it.
  // Reporting them separately is what makes "nobody is nearby" and "the radio is
  // not connecting" distinguishable in a bug report.
  getLinkCounts(): { ble: number; wifi: number } {
    return {
      ble: this.connectedLinks.size,
      wifi: this.wifiConnectedLinks.size,
    };
  }

  // Every outgoing write goes through one of these two so bytesSent stays
  // accurate no matter which transport carried the packet.
  private sendBle(linkID: string, dataBase64: string): Promise<void> {
    this.bytesSent += Math.ceil((dataBase64.length * 3) / 4);
    return AirhopBLE.writeToLink(linkID, dataBase64);
  }

  private sendWifi(linkID: string, dataBase64: string): Promise<void> {
    if (!NativeAirhopWiFi) return Promise.resolve();
    this.bytesSent += Math.ceil((dataBase64.length * 3) / 4);
    return NativeAirhopWiFi.writeToWiFiLink(linkID, dataBase64);
  }

  constructor(identity: Identity) {
    this.identity = identity;
    this.nostrPrivKey = deriveNostrPrivKey(identity.signingPrivKey);
    this.nostrPubKeyHex = getPublicKey(this.nostrPrivKey);
    this.radio = new RadioController(identity.peerID);

    const routerIdentity: RouterIdentity = {
      peerID: identity.peerID,
      signingPrivKey: identity.signingPrivKey,
      noiseStaticPrivKey: identity.noiseStaticPrivKey,
    };

    // Resolves to whether at least one link took the packet. Callers that do not
    // care (most of them) can ignore it; the fragment pacer cannot, because a
    // refused write it does not retry is a file the far side can never finish.
    const broadcastFn = async (packet: Packet): Promise<boolean> => {
      this.floodRouter.originate(packet);
      // Our own broadcasts are gossipable too: a peer who arrives later should
      // be able to catch up on messages we originated, not just relayed ones.
      this.gossip.track(packet);
      const b64 = bytesToBase64(encodePacket(packet));
      // Every open link, both radios.
      //
      // This iterated `connectedLinks` alone, so a broadcast reached Bluetooth
      // peers and nobody on the WiFi fast path, while `unicastFn` just below
      // correctly preferred WiFi. Two phones joined only over WiFi Aware
      // discovered each other (announces are unicast on
      // link-up) and then never saw one another's public messages, board posts
      // or group traffic. The transport looked connected and carried nothing.
      const results = await Promise.all([
        ...[...this.connectedLinks].map((linkID) =>
          this.sendBle(linkID, b64).then(
            () => true,
            () => {
              // A link that refuses a write is not necessarily gone: the stack
              // says the same thing when its queue is simply full. Dropping it
              // from connectedLinks on the first refusal tore down healthy links
              // mid-transfer. Link teardown belongs to the disconnect event.
              return false;
            },
          ),
        ),
        ...[...this.wifiConnectedLinks].map((linkID) =>
          this.sendWifi(linkID, b64).then(
            () => true,
            () => false,
          ),
        ),
      ]);
      return results.some(Boolean);
    };
    this.broadcastPacket = broadcastFn;

    const unicastFn = async (
      recipientPeerID: string,
      packet: Packet,
    ): Promise<boolean> => {
      // Prefer WiFi direct (higher throughput for large attachments).
      const wifiLink = this.wifiPeerToLink.get(recipientPeerID);
      if (wifiLink && this.wifiConnectedLinks.has(wifiLink)) {
        return this.sendWifi(
          wifiLink,
          bytesToBase64(encodePacket(packet)),
        ).then(
          () => true,
          () => {
            this.wifiConnectedLinks.delete(wifiLink);
            this.wifiPeerToLink.delete(recipientPeerID);
            this.wifiLinkToPeer.delete(wifiLink);
            return false;
          },
        );
      }
      // Fall back to a direct BLE link.
      const linkID = this.peerToLink.get(recipientPeerID);
      if (linkID) {
        this.floodRouter.originate(packet);
        return this.sendBle(linkID, bytesToBase64(encodePacket(packet))).then(
          () => true,
          () => false,
        );
      }
      // No direct link: flood the recipient-addressed, TTL-bounded packet over
      // the mesh so an intermediate node relays it to the recipient. This is
      // bitchat's multi-hop delivery for directed packets: the recipientID and
      // TTL are already on the packet, every node relays it (handleRaw), and
      // only the addressee's handler claims it. File transfers are excluded:
      // they are far too large to flood and stay a direct-link feature. No-op
      // when we have no neighbour to relay through.
      if (
        this.connectedLinks.size > 0 &&
        packet.type !== PacketType.FILE_TRANSFER &&
        packet.type !== PacketType.FRAGMENT
      ) {
        return broadcastFn(packet);
      }
      // Nothing carried it. For a fragment this is the signal to hold on to it
      // and try again rather than counting it as gone.
      return false;
    };

    // Store the unicast closure so sendDRMessage can use it without
    // duplicating the WiFi-vs-BLE preference logic.
    this.unicastFn = unicastFn;

    this.fileXfer = new FileTransferService(
      { peerID: identity.peerID, signingPrivKey: identity.signingPrivKey },
      broadcastFn,
      unicastFn,
      (peerID) => this.registry.get(peerID)?.nickname,
      (recipientPeerID, fileTlv) =>
        this.sealFileForPeer(recipientPeerID, fileTlv),
    );

    const nostrSendFn: NostrSendFn = async (
      recipientNostrPubkey: string,
      text: string,
    ): Promise<void> => {
      // Route through the one envelope-building path so a Nostr DM is always
      // bitchat-parseable. (This router tier is superseded by trySendDm's own
      // Nostr priority, but kept consistent for safety.)
      this.publishNostrDm(recipientNostrPubkey, newMessageId(), text);
    };

    this.router = new MessageRouter(
      routerIdentity,
      this.registry,
      broadcastFn,
      unicastFn,
      nostrSendFn,
    );
  }

  // The identity this instance was built for. Lets a caller tell "the mesh
  // this app already has" from "a wipe re-onboarded as someone else".
  get peerID(): string {
    return this.identity.peerID;
  }

  // Start BLE advertising, scanning, and the periodic ANNOUNCE timer.
  start(nickname: string): void {
    this.nickname = nickname;
    this.running = true;
    // A stop inside the last 150 ms left a teardown scheduled. Coming back
    // online cancels it: the user tapping Away and then Online again must not
    // have their radios taken down a moment later by the previous decision.
    // A stop inside the last 150 ms left a teardown scheduled. Coming back
    // online cancels it: the user tapping Away and then Online again must not
    // have their radios taken down a moment later by the previous decision.
    this.clearRadioStopGrace();

    // Hand the radios to the reconciler.
    //
    // Not three fire-and-forget calls (read adapter state, start scanning, start
    // advertising) with their errors discarded. On a fresh install all three race
    // the permission grant becoming effective in the Bluetooth stack, and three
    // swallowed failures leave two dead radios behind a UI that has no idea. The
    // controller reads the device first, publishes the one reason it cannot run,
    // and retries with backoff until it can.
    this.radio.start();

    // Periodic ANNOUNCE so nearby peers learn our identity.
    const sendFn = (packet: Packet): void => {
      const b64 = bytesToBase64(encodePacket(packet));
      for (const linkID of this.connectedLinks) {
        this.sendBle(linkID, b64).catch(() => {
          // A refused write is NOT a disconnect, and must not be treated as
          // one. The stack refuses for ordinary reasons - its queue is full,
          // the GATT server is mid-setup, another transfer has the link busy -
          // and the link is fine a moment later.
          //
          // Never `connectedLinks.delete(linkID)`, which is unrecoverable:
          // nothing re-adds a link except a fresh linkConnected event, and that
          // never comes for a link that stayed up. One transient refusal would
          // remove a healthy neighbour permanently, leaving the phone believing
          // it had no neighbours at all,
          // so sendChannelMessage reported bleLinks: 0 and the composer marked
          // every subsequent message FAILED - on a radio that was working, next
          // to a peer that was listening. Found by a scenario where one phone
          // panic-wiped and the two bystanders silently stopped being able to
          // talk to each other.
          //
          // The disconnect event owns teardown. This is the same rule the
          // fragment relay path already follows, for the same reason.
        });
      }
    };
    this.announceManager.start(
      this.identity,
      nickname,
      sendFn,
      undefined,
      hexToBytes(this.nostrPubKeyHex),
      () => this.connectedLinks.size + this.wifiConnectedLinks.size,
      // Advertise the gateway capability while the user has it enabled, so
      // offline peers can find us as an uplink, and the bridge capability while
      // we are actively bridging a rendezvous cell (online with a known cell), so
      // mesh-only peers can deposit through us. Read per-tick so a toggle rides
      // the next announce (announceNow below also pushes it out immediately).
      () => this.localCapabilities(),
      // The rendezvous cell we serve (ANNOUNCE TLV 0x06), only while bridging.
      () => this.bridgeService?.advertisedBridgeGeohash(),
    );
    // Re-announce immediately whenever the gateway or bridge toggle flips, so
    // nearby peers learn the capability change without waiting a full cycle.
    this.gatewayUnsub?.();
    this.gatewayUnsub = useSettingsStore.subscribe((state, prev) => {
      if (state.gatewayEnabled === prev.gatewayEnabled) return;
      // Turning the gateway off drops whatever is parked for it.
      //
      // These are other people's messages, accepted on the promise of putting
      // them on the internet. The queue survived the toggle, so a user who
      // switched the gateway off and later came back online had that batch
      // published anyway, minutes after they withdrew consent. flushQueuedUplinks
      // re-checks the toggle, but only its value at flush time, which does not
      // help a queue that outlives the decision.
      if (!state.gatewayEnabled) this.queuedUplinks.length = 0;
      this.announceManager.announceNow();
    });
    this.bridgeUnsub?.();
    this.bridgeUnsub = useSettingsStore.subscribe((state, prev) => {
      if (state.bridgeEnabled !== prev.bridgeEnabled) {
        this.bridgeService?.setEnabled(state.bridgeEnabled);
        this.announceManager.announceNow();
      }
    });

    // The internet master switch, watched here rather than trusted to whoever
    // writes it.
    //
    // It was the one settings flag with no subscription: the Network screen's
    // handler called applyInternetEnabled by hand immediately after setting it,
    // and that hand-wiring was the only thing that made the toggle do anything.
    // Every other writer - the "reset settings" path, a panic wipe restoring
    // defaults, any screen added later - flipped a flag that the transport never
    // read again, so the app reported one state and behaved as the other.
    // gatewayEnabled and bridgeEnabled are watched two blocks up for exactly
    // this reason; this one was the odd one out.
    //
    // applyInternetEnabled is idempotent, so the existing hand call and this
    // subscription both firing is a no-op the second time.
    this.internetUnsub?.();
    this.internetUnsub = useSettingsStore.subscribe((state, prev) => {
      if (state.internetEnabled !== prev.internetEnabled) {
        this.applyInternetEnabled(state.internetEnabled);
      }
    });

    // The relay preferences. The publish path re-reads them per event, a
    // subscription only as it opens, so without this the two drift: after adding
    // a relay you publish to it and never hear it. customRelays compares by
    // reference, which the store guarantees by never mutating it in place.
    this.relayPrefsUnsub?.();
    this.relayPrefsUnsub = useSettingsStore.subscribe((state, prev) => {
      if (
        state.customRelays === prev.customRelays &&
        state.geoRelayDiscovery === prev.geoRelayDiscovery
      ) {
        return;
      }
      this.geoChannels?.applyRelayChange();
      this.bridgeService?.applyRelayChange();
    });

    // Turning live voice off has to take effect now, not at the end of whatever
    // is currently being said. The per-burst checks elsewhere stop the NEXT
    // burst in either direction; this stops the one in progress: the microphone
    // closes with a proper END so the far side hears a finish rather than a
    // timeout, and any incoming burst goes quiet immediately instead of
    // draining the jitter buffer first.
    //
    // Only the off edge does anything. Turning it back on needs no work: the
    // next hold opens a fresh burst and the next inbound START opens a fresh
    // session, so flipping the switch repeatedly settles wherever it lands.
    this.liveVoiceUnsub?.();
    this.liveVoiceUnsub = useSettingsStore.subscribe((state, prev) => {
      if (state.liveVoiceEnabled === prev.liveVoiceEnabled) return;
      if (!state.liveVoiceEnabled) this.closeVoice();
    });

    // Periodic gossip filter, so peers can tell us what they're missing.
    //
    // Unicast per connected peer rather than broadcast. That is what lets the
    // receive path tell a solicited replay apart from a stranger replaying
    // recorded traffic: every request is registered against the peer it went
    // to, and only that peer's IS_RSR packets skip the freshness window. A
    // broadcast round has no peer to register against, so it is kept only as
    // the discovery-phase fallback inside GossipSync.
    this.gossip.start(
      {
        peerID: this.identity.peerID,
        signingPrivKey: this.identity.signingPrivKey,
      },
      {
        send: sendFn,
        sendToPeer: (peerID, packet) => {
          this.unicastFn(peerID, packet);
        },
        // Direct neighbours only. A peer reachable across three hops cannot
        // answer a link-local (ttl 0) request, so asking it wastes a write and
        // registers a pending request that can never be satisfied.
        getPeers: () => [
          ...new Set([
            ...this.peerToLink.keys(),
            ...this.wifiPeerToLink.keys(),
          ]),
        ],
        onRequest: (peerID) => {
          this.requestSync.registerRequest(peerID);
        },
      },
    );

    // Connect to Nostr relays and stand up the channel services that ride them,
    // unless the user turned internet connectivity off (pure Bluetooth mode).
    // Everything downstream is null-guarded, so leaving the transport unbuilt is
    // safe; the Internet fallback toggle builds it later via applyInternetEnabled.
    if (useSettingsStore.getState().internetEnabled) {
      this.buildNostrTransport();
    }
    this.chatUnsub = useChatStore.subscribe((state, prev) => {
      if (
        state.channels !== prev.channels ||
        state.channelReach !== prev.channelReach
      ) {
        this.privateChannels?.refresh();
        // Same trigger keeps geohash subscriptions in step: teleporting into a
        // cell subscribes it, and leaving one drops its subscription instead of
        // quietly receiving a cell the user left.
        void this.geoChannels?.refresh();
      }
    });

    // Rebuild the inbound routing map from durable contacts so a Nostr DM from
    // someone we know lands in their existing dm:<peerID> thread even before we
    // hear their ANNOUNCE this session. Presence is NOT seeded from contacts:
    // being a saved contact is not evidence of being nearby.
    this.hydrateContactNostrKeys();
    // When a contact is created (typically the moment you first DM a nearby
    // peer), bind their npub from the registry if we already heard it. Closes
    // the race where their ANNOUNCE arrived before the contact existed, so it
    // was never persisted and they later left range unreachable over Nostr.
    this.contactsUnsub = useContactsStore.subscribe((state, prev) => {
      if (state.contacts === prev.contacts) return;
      for (const peerID of Object.keys(state.contacts)) {
        const c = state.contacts[peerID];
        if (c.nostrPubkeyHex === undefined || c.nostrPubkeyHex.length === 0) {
          const known = this.registry.get(peerID)?.nostrPubkey;
          if (known) useContactsStore.getState().setNostrPubkey(peerID, known);
        } else {
          this.nostrPubkeyToPeerID.set(c.nostrPubkeyHex, peerID);
        }
      }
    });
    // Retry queued DMs over the internet on a slow cadence. flushOutbox routes
    // through trySendDm, whose Nostr tier uses the durable contact npub, so a
    // message parked for someone who has left Bluetooth range gets delivered
    // once we have their npub and relays are up, without waiting for them to
    // reappear on BLE (the only trigger that existed before).
    this.outboxSweepTimer = setInterval(() => {
      this.expireQueuedMail();
    }, OUTBOX_SWEEP_INTERVAL_MS);

    // Subscribe to gift-wrap events addressed to our Nostr pubkey.
    this.subscribeNostrInbox();
    // And re-attach the nutzap watcher to the client just built. Coming back
    // from Away builds a fresh transport, and without this the watcher stayed
    // pointed at the destroyed one, so incoming payments silently stopped being
    // redeemed for the rest of the session.
    rebindNutzapWatcher();

    // BLE event listeners.
    this.subs = [
      DeviceEventEmitter.addListener(
        "AirhopBLE.linkConnected",
        ({ linkID }: { linkID: string; role: string; rssi: number }) => {
          this.connectedLinks.add(linkID);
          // Immediately send our ANNOUNCE (with Nostr pubkey) to the newly
          // connected peer, throttling how often a NEW one is minted.
          //
          // bitchat-ios has an explicit BLEAnnounceThrottle for this, with
          // bleForceAnnounceMinIntervalSeconds = 0.15 (TransportConfig.swift)
          // gating even forced announces. Airhop had no equivalent: every
          // link-up built a freshly timestamped packet, and since the packet ID
          // covers the timestamp, each one was a distinct packet that every
          // relay in the mesh flood-filled at TTL 7. Twelve phones forming a
          // room put 9,211 ANNOUNCE packets on the air in half a second.
          //
          // The packet is still sent on the new link every time, so a new
          // neighbour always learns us immediately - only the re-origination is
          // throttled. Inside the window the SAME bytes go out, so every relay's
          // deduplicator suppresses the flood instead of amplifying it.
          this.sendBle(
            linkID,
            bytesToBase64(encodePacket(this.currentAnnouncePacket())),
          ).catch(() => {});
          // Publish our prekey bundle to the new peer so they can seal
          // forward-secret courier mail to us while we are offline.
          //
          // To the NEW LINK only, and reusing the current bundle packet rather
          // than minting a fresh one. A full-mesh broadcast of a freshly
          // timestamped packet on every link-up is quadratic in a crowded room
          // and, because each copy carries a distinct packet ID, no deduplicator
          // can suppress it: every emission flood-fills the mesh at TTL 7. Twelve
          // phones walking
          // into range of each other put 6,597 PREKEY_BUNDLE packets on the air
          // in 400ms against 669 ANNOUNCE - 90% of all airtime, before anyone
          // had said a word. The bundle still reaches the wider mesh, because
          // the new peer relays it and gossip sync reconciles it; what stops is
          // re-originating it N times per peer.
          const bundle = this.currentPrekeyBundlePacket();
          if (bundle !== null) {
            this.sendBle(linkID, bytesToBase64(encodePacket(bundle))).catch(
              () => {},
            );
          }
        },
      ),

      DeviceEventEmitter.addListener(
        "AirhopBLE.linkDisconnected",
        ({ linkID }: { linkID: string }) => {
          this.connectedLinks.delete(linkID);
          const peerID = this.linkToPeer.get(linkID);
          if (peerID !== undefined) {
            this.peerToLink.delete(peerID);
            this.registry.markIndirect(peerID);
            // The link is gone, so the peer is no longer a direct neighbour and
            // loses the protection that came with it.
            usePeerStore.getState().setDirect(peerID, false);
            // Sync state is per link session. Forget the outstanding request so
            // a device reconnecting under this ID cannot inherit the previous
            // session's freshness exemption, and clear its response budget so a
            // genuine reconnect is not throttled by traffic that is now gone.
            this.requestSync.forget(peerID);
            this.gossip.forgetPeer(peerID);
            // The echo budget is per session too. A reconnect negotiates a
            // fresh Noise session and both sides prove themselves again, so a
            // peer that has been away must be answerable again - and without
            // this the set only ever grows.
            this.peerStateEchoed.delete(peerID);
          }
          this.linkToPeer.delete(linkID);
        },
      ),

      DeviceEventEmitter.addListener(
        "AirhopBLE.packetReceived",
        ({ linkID, dataBase64 }: { linkID: string; dataBase64: string }) => {
          this.handleRaw(linkID, dataBase64);
        },
      ),

      // OS Bluetooth toggle. Handed straight to the reconciler, which owns both
      // the banner text and the decision about what to do next. Doing either of
      // those here is what produced the iOS restart loop: this handler restarted
      // the radios, the restart built a new CBManager, and the new manager
      // reported its state right back into this handler.
      DeviceEventEmitter.addListener(
        "AirhopBLE.adapterStateChanged",
        ({ enabled }: { enabled: boolean }) => {
          this.radio.onAdapterChanged(enabled);
        },
      ),

      // Battery moved enough to possibly change how hard the radios should run.
      // Android only, and deliberately infrequent - native filters out the
      // per-percent noise before it reaches the bridge.
      DeviceEventEmitter.addListener("AirhopBLE.powerStateChanged", () => {
        this.radio.onPowerStateChanged();
      }),

      // The platform refused a scan after accepting the request. Handed to the
      // reconciler, which owns both the belief and the retry that corrects it.
      DeviceEventEmitter.addListener(
        "AirhopBLE.scanFailed",
        ({ errorCode }: { errorCode: number }) => {
          this.radio.onScanFailed(errorCode);
        },
      ),

      // Signal strength for the Mesh tab. Native emits this per link, so it has
      // to be mapped back to a peerID, which is only known once that peer's
      // ANNOUNCE has arrived, hence the silent drop for unmapped links.
      DeviceEventEmitter.addListener(
        "AirhopBLE.rssiUpdated",
        ({ linkID, rssi }: { linkID: string; rssi: number }) => {
          const peerID = this.linkToPeer.get(linkID);
          if (peerID === undefined) return;
          usePeerStore.getState().updateRssi(peerID, rssi);
        },
      ),
    ];

    this.subs.push(
      // The fast path became unusable, or usable again.
      //
      // Android reports both edges, off the framework's WiFi Aware state
      // broadcast, so turning WiFi back on recovers immediately. iOS registers
      // no WiFi module, so this never fires there and the controller latches
      // "unsupported" on its first pass.
      DeviceEventEmitter.addListener(
        "AirhopWiFi.availabilityChanged",
        ({ available }: { available: boolean }) => {
          this.wifi.onAvailabilityChanged(available);
          if (!available) {
            // The sockets are gone with the radio. Forget them here rather than
            // discovering it one failed write at a time: the native disconnect
            // events cover an orderly close, not a radio pulled out from under
            // the transport.
            this.wifiConnectedLinks.clear();
            this.wifiPeerToLink.clear();
            this.wifiLinkToPeer.clear();
          }
        },
      ),
      DeviceEventEmitter.addListener(
        "AirhopWiFi.linkConnected",
        ({ linkID }: { linkID: string }) => {
          this.wifiConnectedLinks.add(linkID);
          // Immediately announce ourselves over the new WiFi link.
          //
          // A FRESH packet, deliberately, unlike the BLE link-up beside it which
          // reuses the held greeting. The two links reach the same peer, and the
          // deduplicator keys on the packet ID, so sending the same bytes down
          // both means whichever arrives second is dropped - and it is that
          // second announce that tells onAnnounce which link to map the peer to.
          // Reusing the held packet here silently cost the WiFi fast path: the
          // peer was never bound to its WiFi link, so attachments fell back to
          // BLE and fragmented a 64 KiB file the fast path was there to carry.
          //
          // Capabilities and the bridge cell are passed for the reason described
          // in currentAnnouncePacket: omitting them is a withdrawal, not a
          // smaller packet.
          const pkt = this.announceManager.buildPacket(
            this.identity,
            this.nickname,
            [],
            hexToBytes(this.nostrPubKeyHex),
            this.localCapabilities(),
            this.bridgeService?.advertisedBridgeGeohash(),
          );
          this.sendWifi(linkID, bytesToBase64(encodePacket(pkt))).catch(
            () => {},
          );
        },
      ),
      DeviceEventEmitter.addListener(
        "AirhopWiFi.linkDisconnected",
        ({ linkID }: { linkID: string }) => {
          this.wifiConnectedLinks.delete(linkID);
          const peerID = this.wifiLinkToPeer.get(linkID);
          if (peerID !== undefined) {
            this.wifiPeerToLink.delete(peerID);
          }
          this.wifiLinkToPeer.delete(linkID);
        },
      ),
      DeviceEventEmitter.addListener(
        "AirhopWiFi.packetReceived",
        ({ linkID, dataBase64 }: { linkID: string; dataBase64: string }) => {
          this.handleRaw(linkID, dataBase64);
        },
      ),
    );

    // Start WiFi Aware (Android only) through its reconciler, for the same
    // reasons the radios go through theirs:
    // one attempt with its error discarded could not survive WiFi being off at
    // launch, a permission landing a moment late, or the adapter being toggled.
    // See wifi-controller.ts.
    //
    // After the listeners, not before, so an availability report that lands
    // while the attach is in flight is heard rather than dropped into a gap.
    //
    // Never gated on a preference. The fast path is chosen per message by the
    // router, which treats a WiFi link as one more link, and it degrades to
    // Bluetooth on its own when there is none. There is nothing here a user
    // could usefully decide.
    this.wifi.start();

    // The radio controller reads the background preference during reconcile, so
    // the switch has to ask for one. Without this the foreground service would
    // keep running until something else happened to trigger a pass, which on a
    // phone left alone can be a long time.
    this.backgroundPrefUnsub?.();
    this.backgroundPrefUnsub = useSettingsStore.subscribe((state, prev) => {
      if (state.backgroundMeshEnabled === prev.backgroundMeshEnabled) return;
      this.radio.refresh();
    });
  }

  // Peers whose packets we have rejected as stale since the last one we
  // accepted. Its size is the signal, not its contents.
  private readonly staleFromPeers = new Set<string>();

  // Whether our own clock is the thing out of step, reported to the Mesh tab.
  //
  // The freshness window has one failure mode that is invisible from inside the
  // app: if our clock is wrong we reject everything we hear and everyone
  // rejects everything we send. Radio healthy, links up, room empty, which
  // reads as "nobody is here".
  //
  // The inference stays conservative. One peer sending stale packets is that
  // peer replaying or that peer's clock, and blaming ourselves would be wrong.
  // Several different peers disagreeing at once points at what they have in
  // common. Any accepted packet clears it, so a burst of stale traffic cannot
  // leave the banner stuck on.
  private noteStale(fromPeerID: string | undefined): void {
    if (fromPeerID === undefined) return;
    this.staleFromPeers.add(fromPeerID);
    if (this.staleFromPeers.size >= CLOCK_SKEW_PEER_THRESHOLD) {
      useMeshStateStore.getState().setClockSkewed(true);
    }
  }

  private noteFresh(): void {
    if (this.staleFromPeers.size === 0) return;
    this.staleFromPeers.clear();
    if (useMeshStateStore.getState().clockSkewed) {
      useMeshStateStore.getState().setClockSkewed(false);
    }
  }

  // The replay bound, applied at ingress so a stale packet is neither relayed
  // nor acted on. Relaying one costs everyone downstream airtime and re-seeds
  // an attacker's recording into a mesh that had already forgotten it.
  //
  // A packet may be older than the window only when it carries IS_RSR and comes
  // from a peer we asked for a sync, inside the 30s response window. Both halves
  // are needed: the flag alone is a claim anyone can make.
  //
  // The ttl-0 clause covers clients from before IS_RSR existed, which answered a
  // sync with link-local packets and no flag; bitchat keeps the same allowance.
  // It still requires a pending request to that peer, so it grants nothing to a
  // peer we never asked.
  private isFreshOrSolicited(packet: Packet, linkID: string): boolean {
    const now = Date.now();
    if (Math.abs(now - packet.timestamp) <= PACKET_MAX_SKEW_MS) {
      this.noteFresh();
      return true;
    }

    const claimsSolicited = packet.isRSR === true || packet.ttl === 0;
    if (!claimsSolicited) {
      this.noteStale(
        this.linkToPeer.get(linkID) ?? this.wifiLinkToPeer.get(linkID),
      );
      return false;
    }

    // Attribute against the peer bound to the link it arrived on rather than
    // the packet's senderID header, which is plaintext and forgeable. A
    // solicited response can only come from the peer we asked, and that peer is
    // the one on the far end of this link.
    const linkPeer =
      this.linkToPeer.get(linkID) ?? this.wifiLinkToPeer.get(linkID);
    if (linkPeer === undefined) return false;

    return this.requestSync.isValidResponse(linkPeer, true, now);
  }

  // Relay one packet onward, following a source route when the sender planned
  // one through us and flooding when they did not.
  //
  // `ingressLinkID` is never written back to: a packet does not need to be sent
  // to the peer it just came from, and doing so is how a two-node mesh spins.
  //
  // Returns nothing; a refused write is not a dead link (the stack says the
  // same thing when its queue is simply full), so teardown stays with the
  // disconnect event.
  private relayPacket(relay: Packet, ingressLinkID: string): void {
    const b64 = bytesToBase64(encodePacket(relay));

    // Someone upstream computed a path that names us. Honour it: one unicast
    // write instead of a write to every neighbour. We never plan routes
    // ourselves (see core/mesh/source-route.ts for why), but a bitchat peer
    // that has is owed the hop it asked for.
    const nextHop = nextHopFor(relay, this.identity.peerID);
    if (nextHop !== null) {
      const wifiLink = this.wifiPeerToLink.get(nextHop);
      if (wifiLink !== undefined && wifiLink !== ingressLinkID) {
        void this.sendWifi(wifiLink, b64).catch(() => {});
        return;
      }
      const bleLink = this.peerToLink.get(nextHop);
      if (bleLink !== undefined && bleLink !== ingressLinkID) {
        void this.sendBle(bleLink, b64).catch(() => {});
        return;
      }
      // Next hop is not reachable from here. Fall through to flooding rather
      // than dropping: a routed unicast rides one path and loses the packet
      // where a flood would heal around the break. This is the fallback both
      // other implementations specify.
    }

    for (const lid of this.connectedLinks) {
      if (lid === ingressLinkID) continue;
      void this.sendBle(lid, b64).catch(() => {});
    }
    for (const wlid of this.wifiConnectedLinks) {
      if (wlid === ingressLinkID) continue;
      void this.sendWifi(wlid, b64).catch(() => {});
    }
  }

  private handleRaw(linkID: string, dataBase64: string): void {
    let bytes: Uint8Array;
    try {
      bytes = base64ToBytes(dataBase64);
    } catch {
      return;
    }
    this.bytesReceived += bytes.length;

    const packet = decodePacket(bytes);
    if (!packet) return;

    if (!this.isFreshOrSolicited(packet, linkID)) return;

    // FRAGMENT packets are flood-routed (so multi-hop file transfers work),
    // then fed into the assembler. When all fragments arrive the reassembled
    // inner packet is routed through routePacket without another flood cycle.
    if (packet.type === PacketType.FRAGMENT) {
      // A fragment addressed to us has nowhere further to go, so relaying it is
      // pure cost, and for a file that cost is the whole file.
      //
      // Fragments carry their parent's recipientID, so a DM attachment is
      // directed at exactly one device. Relaying anyway meant the RECEIVER
      // re-fragmented every byte it had just been handed and pushed it back out
      // over its other links: a photo takes the WiFi link one way and is then
      // echoed over Bluetooth at ~22 KB/s, spending seconds of radio time and
      // both devices' battery on a copy for the sender. Scenario W-F09 measures
      // each radio rather than assuming the faster one was chosen.
      //
      // Narrow on purpose: only the addressee stops, so middle nodes still relay
      // and multi-hop is untouched; broadcasts still flood; only FRAGMENT is
      // affected. Nothing on the wire changes.
      const addressedToUs =
        !isBroadcast(packet) &&
        isForMe(packet, hexToBytes(this.identity.peerID));

      // Fragments inherit the parent packet's version and route, so a routed
      // file crosses the mesh on the same path its parent planned rather than
      // falling back to flooding the moment it is split.
      this.floodRouter.receive(packet, (relay) => {
        if (addressedToUs) return;
        this.relayPacket(relay, linkID);
      });
      this.fragmentManager.receive(
        packet.senderID,
        packet.payload,
        (inner) => {
          this.routePacket(inner, linkID);
        },
        (progress) => this.onFragmentProgress(progress),
      );
      return;
    }

    // LEAVE is verified BEFORE the relay, unlike every other type.
    //
    // Relaying first and checking later is the right default: a relay carries
    // traffic for peers whose signing keys it has never seen, and demanding a
    // key before forwarding would break multi-hop delivery for exactly the
    // strangers the mesh exists to reach. LEAVE is the one exception. It is an
    // eviction instruction rather than content, it costs nothing to forge for
    // any peer ID in earshot, and forwarding one we have already decided to
    // refuse spends the room's airtime and carries the attack onward to any
    // node that checks less strictly than we do.
    //
    // Dropping the relay costs a legitimate LEAVE that reaches us from a peer
    // we cannot verify. That is bounded: LEAVE rides ttl 3 while announces
    // flood at ttl 7 every 15-30s once connected (4s while isolated) and on
    // every link-up, so a peer close enough for their LEAVE to arrive is a peer
    // whose announce almost certainly already did. Worst case their row lingers
    // until it ages out, which is what happens for an ungraceful departure
    // anyway.
    if (packet.type === PacketType.LEAVE && !this.leaveIsAuthentic(packet)) {
      return;
    }

    // All other packet types go through flood routing first.
    // Returns false if already seen: drop silently to prevent loops.
    const isNew = this.floodRouter.receive(packet, (relay) => {
      this.relayPacket(relay, linkID);
    });
    if (!isNew) return;

    // Remember gossipable packets (ANNOUNCE / CHANNEL_MSG) so we can replay
    // them to a peer that missed them. track() ignores other types.
    this.gossip.track(packet);

    this.routePacket(packet, linkID);
  }

  // Dispatch a decoded (and flood-deduped) packet to the correct handler.
  // Also called for reassembled inner packets from the fragment pipeline.
  private routePacket(packet: Packet, linkID: string): void {
    // Single chokepoint for blocking. Enforced per-handler it is easy to miss
    // CHANNEL_MSG, NOISE_ENCRYPTED, FILE_TRANSFER or Nostr, and a blocked peer
    // that can still post in channels, DM, send files and resurrect a deleted
    // conversation is not blocked. Everything carrying peer content drops here.
    //
    // ANNOUNCE is deliberately exempt: it is still needed to maintain relay
    // topology so blocking someone doesn't degrade the mesh for everyone
    // routing through us. onAnnounce keeps them out of the peer store itself.
    // Relaying already happened in handleRaw before this point, so a blocked
    // peer's traffic still forwards for third parties. We never surface it.
    if (packet.type !== PacketType.ANNOUNCE) {
      const senderID = bytesToHex(packet.senderID);
      if (useBlockedStore.getState().isBlocked(senderID)) return;
    }

    switch (packet.type) {
      case PacketType.ANNOUNCE:
        this.onAnnounce(packet, linkID);
        break;
      case PacketType.CHANNEL_MSG:
        this.onChannelMsg(packet);
        break;
      case PacketType.CHANNEL_MSG_AIRHOP:
        this.onAirhopChannelMsg(packet);
        break;
      case PacketType.CHANNEL_ENC:
        this.onChannelEnc(packet);
        break;
      case PacketType.NOISE_HANDSHAKE:
        this.onNoiseHandshake(packet);
        break;
      case PacketType.NOISE_ENCRYPTED:
        this.onNoiseEncrypted(packet);
        break;
      case PacketType.DR_ENCRYPTED:
        this.onDREncrypted(packet);
        break;
      case PacketType.LEAVE:
        this.onLeave(packet);
        break;
      case PacketType.COURIER_ENV:
        this.onCourierEnvelope(packet);
        break;
      case PacketType.REQUEST_SYNC:
        this.onRequestSync(packet, linkID);
        break;
      case PacketType.FILE_TRANSFER:
        // An attachment is authenticated exactly like a public message, and for
        // the same reason: handleIncoming attributes the file to packet.senderID
        // and renders it in that peer's thread. Without this, the signature rule
        // that onChannelMsg enforces for text was simply absent for media, so
        // anyone in range could drop a photo into a DM thread the UI badges as
        // verified and end-to-end encrypted, attributed to that contact.
        //
        // Safe for interop in both directions: we always set SIGNED and sign on
        // the send path, and bitchat already refuses the unsigned case
        // ("Dropping raw file transfer with missing/invalid signature",
        // BLEFileTransferHandler.swift). Fragmented files are covered too -
        // fragmentPacket carries the whole signed inner packet as its data, so a
        // reassembled packet arrives back here still carrying its signature.
        if (!this.senderIsAuthentic(packet, bytesToHex(packet.senderID)))
          return;
        this.fileXfer.onFileTransfer(packet);
        break;
      case PacketType.BOARD_POST:
        this.onBoardPost(packet);
        break;
      case PacketType.PREKEY_BUNDLE:
        this.onPrekeyBundle(packet);
        break;
      case PacketType.GROUP_MESSAGE:
        this.onGroupMessage(packet);
        break;
      case PacketType.NOSTR_CARRIER:
        this.onNostrCarrier(packet);
        break;
      case PacketType.PING:
        this.onPing(packet, linkID);
        break;
      case PacketType.PONG:
        this.onPong(packet);
        break;
      case PacketType.VOICE_FRAME:
        this.onVoiceFrame(packet);
        break;
      default:
        break;
    }
  }

  // ---- Live push-to-talk ----

  // A burst packet from a nearby talker. Signed like any public message, so an
  // unsigned or forged frame is dropped before a decoder ever sees it: the
  // audio path is the last place to be lenient about who sent something.
  //
  // Blocked senders never reach here (filtered in the dispatch above), and a
  // device with no audio module simply never builds a player, so a burst it
  // cannot play costs it one signature check and nothing else.
  private onVoiceFrame(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;

    // Off means off in both directions: no live sending, and nothing plays
    // unprompted either. Someone who turned live voice off should not have a
    // stranger's audio come out of their phone.
    if (!useSettingsStore.getState().liveVoiceEnabled) return;

    // A public burst belongs to the Bluetooth room. Ignore it unless that is
    // what the user is looking at, so it neither plays nor claims the floor in
    // some other thread. Whoever spoke also sends the same audio as a voice
    // note, which is what carries it to anyone who was not watching.
    if (this.audibleChannel !== BRIDGE_CHANNEL) return;

    // Live means live. A signature proves who spoke, never when: the signing
    // preimage normalises ttl and isRSR, so a burst captured off the air
    // replays byte-for-byte and verifies perfectly. The deduplicator is not a
    // defence here - its window is five minutes and its state is per device, so
    // it does nothing at all for a phone that never heard the original. Without
    // this, someone could record Alice in one room and play her voice out of
    // strangers' phones days later, attributed to her and presented as live.
    //
    // 30s matches bitchat's TransportConfig.pttPublicFrameMaxAgeSeconds, and
    // the broadcast requirement matches BLEPacketFreshnessPolicy
    // .isBroadcastRecipient; BLEService.handleVoiceFrame applies both before it
    // even checks the signature. Generous next to the couple of seconds a frame
    // needs to cross the mesh, and tight enough that a burst cannot outlive the
    // moment it was spoken.
    if (!isBroadcast(packet)) return;
    if (Math.abs(Date.now() - packet.timestamp) > PTT_FRAME_MAX_AGE_MS) return;

    const signingKey = this.registry.get(senderID)?.signingPubKey;
    if (signingKey === undefined || !verifyPacket(packet, signingKey)) return;

    const player = this.ensurePttPlayer();
    if (player === null) return;
    player.handlePacket(packet, senderID);
    this.reportPttActivity();
  }

  private ensurePttPlayer(): VoicePlayer | null {
    if (this.pttPlayer !== null) return this.pttPlayer;
    if (!isLiveVoiceAvailable()) return null;
    // The gate is read per batch of frames, not captured once: someone can
    // background the app or leave the thread in the middle of a burst, and the
    // audio should stop there rather than play on to the end.
    this.pttPlayback = new NativeAudioPlayback(
      () => this.audibleChannel !== null,
      (level) => this.reportPttLevel({ inbound: level }),
      () => {
        // The speaker is quiet, so hand the audio session back - the same
        // ending a released microphone gets, for the listener who never
        // pressed anything. Without it a burst heard once leaves the session
        // recording-capable and ducking for the rest of the run.
        //
        // Only when the microphone is genuinely free. Playback ending under a
        // live hold is ordinary, not exotic: the other talker simply finished
        // first. Restoring there would reconfigure the session beneath our own
        // capture engine, which reads that as the microphone being taken away
        // and ends the burst the user is still holding. This guard is the
        // reason the call lives here rather than beside the stopPlayback() that
        // prompts it.
        if (this.pttCapture !== null) return;
        // A burst arriving in this same instant can land after this and pay for
        // one engine rebuild. The player recovers from that on its own, and
        // sequencing it exactly would cost a state machine out of all
        // proportion to a category being set twice.
        void setAudioForPlayback();
      },
    );
    // The player tells us when a burst ends on its own clock rather than on a
    // packet, which is the only way the floor can be given up without us being
    // handed something to notice it by.
    this.pttPlayer = new VoicePlayer(this.pttPlayback, () => {
      this.reportPttActivity();
    });
    return this.pttPlayer;
  }

  private reportPttActivity(): void {
    if (this.onPttActivity === null) return;
    const talkers = (this.pttPlayer?.activeSessions ?? []).map(
      (s) => s.senderPeerID,
    );
    this.onPttActivity(talkers);
  }

  // Subscribe to "who is talking right now", for the floor-courtesy hint on the
  // mic button. Returns an unsubscribe.
  setPttActivityListener(fn: (talkers: string[]) => void): () => void {
    this.onPttActivity = fn;
    return () => {
      this.onPttActivity = null;
    };
  }

  // How loud the voice moving through this device is, in either direction.
  // Reported only when it changes something, which for a meter is every frame
  // while audio flows and then once more at zero. Returns an unsubscribe.
  setPttLevelListener(fn: (level: VoiceLevel) => void): () => void {
    this.onPttLevel = fn;
    return () => {
      this.onPttLevel = null;
    };
  }

  private reportPttLevel(next: Partial<VoiceLevel>): void {
    const level = { ...this.pttLevel, ...next };
    if (
      level.outbound === this.pttLevel.outbound &&
      level.inbound === this.pttLevel.inbound
    ) {
      return;
    }
    this.pttLevel = level;
    this.onPttLevel?.(level);
  }

  // Whether live voice can be offered at all: the native audio module has to
  // exist, and there has to be somebody in Bluetooth range to hear it. Without
  // a link a burst would be shouted into an empty room, and the voice note that
  // the same gesture produces is the better answer.
  // `channel` decides the scope: a "dm:<peerID>" channel streams to that one
  // peer inside their Noise session; anything else broadcasts to the room.
  canSendLiveVoice(channel: string): boolean {
    if (!isLiveVoiceAvailable()) return false;
    if (!useSettingsStore.getState().liveVoiceEnabled) return false;
    // Live voice is media, and it goes where media goes. In particular it must
    // never reach a private channel or group: a public burst is broadcast
    // signed but unencrypted, so streaming one into a room whose text is
    // encrypted would quietly undo the thing that makes it private. The mic
    // button is already hidden there; this is the guard that means it stays
    // true even if something else calls this.
    if (!canSendMedia(channel)) return false;

    if (channel.startsWith("dm:")) {
      // A DM burst needs an established session: live audio cannot queue
      // behind a handshake, because by the time the handshake finishes the
      // words are already stale. Same rule bitchat applies.
      const peerID = channel.slice(3);
      return (
        this.registry.get(peerID)?.session !== undefined &&
        (this.peerToLink.has(peerID) || this.wifiPeerToLink.has(peerID))
      );
    }
    // Public: somebody has to be in range, or the burst is shouted at nobody.
    return this.connectedLinks.size + this.wifiConnectedLinks.size > 0;
  }

  // Which conversation the user is watching, or null when none is (the app is
  // backgrounded, or they are on a list rather than in a thread).
  //
  // Set by the open thread. A burst only makes sound when it belongs to this
  // exact channel, so live audio can never arrive from a room the user is not
  // looking at: reading a DM should not play whatever somebody keyed up in the
  // public room, and vice versa. Defaults to null, so a burst can never surprise
  // someone whose UI has not told us they are watching. Matches bitchat's
  // liveVoiceEnabled && isAppActive && isViewing.
  setLiveVoiceAudible(channel: string | null): void {
    this.audibleChannel = channel;
  }

  // Open the mic and start streaming a burst to everyone in range. Returns
  // false when live voice is not available right now, in which case the caller
  // falls back to recording a voice note.
  async startVoiceBurst(
    channel: string,
    onFailure: () => void,
  ): Promise<boolean> {
    if (!this.canSendLiveVoice(channel)) return false;
    // Any existing capture, not just an active one: a session that is still
    // opening its microphone counts as the burst in progress.
    //
    // The press that lands here is told it is live, because it is - on the
    // burst that is already open, not on one of its own. There is one
    // microphone, so there is one burst, and the caller that adopts it also
    // owns its ending: whoever started it must not close it afterwards. See
    // handleTalkStart.
    if (this.pttCapture !== null) return true;

    const capture = new VoiceCaptureSession(
      {
        senderPeerID: this.identity.peerID,
        signingPrivKey: this.identity.signingPrivKey,
        onPacket: (packet) => {
          // broadcastPacket marks the packet as originated here, so our own
          // burst is never relayed back to us. It is deliberately not gossiped:
          // live audio is worthless once it is late, and gossip only carries
          // announces, messages, and board posts anyway.
          this.broadcastPacket(packet);
        },
        // A DM burst is sealed to the one peer instead. Same burst bytes, so
        // the two scopes share every line of the wire format above this.
        onDmPayload: channel.startsWith("dm:")
          ? (payload) => {
              // The return value is deliberately dropped: a frame that finds no
              // session is gone, and the burst keeps recording either way. See
              // VoiceCaptureSession.emit.
              this.router.sendNoisePayload(
                channel.slice(3),
                NoisePayloadType.VOICE_FRAME,
                payload,
              );
            }
          : undefined,
      },
      new NativeAudioCapture(
        () => {
          // Capture died on its own: a call took the mic, or the encoder gave
          // up. End the burst so the far side gets an END rather than silence.
          void this.stopVoiceBurst();
          onFailure();
        },
        (level) => this.reportPttLevel({ outbound: level }),
      ),
    );
    // Claimed before opening the mic, not after. Two presses landing together
    // would otherwise both pass the guard above, and the second would overwrite
    // the first, leaving a capture session running that nothing could stop.
    this.pttCapture = capture;
    try {
      await capture.startPtt();
    } catch {
      // The microphone never opened. Close the session rather than drop it:
      // START is only sent with the first frame, so this normally puts nothing
      // on the wire at all, but a burst that managed one frame before failing
      // has been announced and has to be taken back.
      await capture.cancelPtt().catch(() => undefined);
      // Only give up the slot if it is still ours: a release during startPtt
      // has already cleared it, and clobbering that would resurrect a burst
      // the user let go of.
      if (this.pttCapture === capture) this.pttCapture = null;
      return false;
    }
    return true;
  }

  // Close the burst: flush the tail, send END, and hand back the same audio as
  // a finished file.
  //
  // Everyone in range already heard this as it was spoken. The file is for
  // everyone else: a peer who was out of range, one who arrived late, and the
  // chat itself, which would otherwise have no record that anything was said.
  // Returns null when nothing was captured or the burst was cancelled.
  async stopVoiceBurst(): Promise<{
    bytes: Uint8Array;
    durationMs: number;
    // Which burst this recording is of. The note is named after it, which is
    // what lets a listener's live bubble and this file be recognised as the
    // same thing rather than shown twice. See sendLiveBurstAsNote.
    burstIDHex: string;
  } | null> {
    const capture = this.pttCapture;
    this.pttCapture = null;
    if (!capture) return null;
    await capture.stopPtt().catch(() => undefined);
    const bytes = capture.finalizedRecording();
    if (bytes === null) return null;
    return {
      bytes,
      durationMs: capture.recordedDurationMs,
      burstIDHex: capture.burstIDHex,
    };
  }

  // Abandon the burst: send CANCELED so receivers drop what they buffered.
  // Whatever already played on the far side cannot be unheard, which is why
  // the UI has to make "you are live" unmistakable.
  async cancelVoiceBurst(): Promise<void> {
    const capture = this.pttCapture;
    this.pttCapture = null;
    await capture?.cancelPtt().catch(() => undefined);
  }

  get isTalking(): boolean {
    return this.pttCapture?.isActive === true;
  }

  // Drop every live-voice resource. Called when the mesh stops, so a burst
  // cannot outlive the radios that were carrying it.
  private closeVoice(): void {
    // END, not CANCELED. The words already spoken were real and have already
    // been heard on the other side; CANCELED would tell receivers to throw away
    // audio they have played, which is both wrong and pointless. END closes the
    // burst cleanly so the far side hears a finish rather than waiting out a
    // timeout.
    void this.stopVoiceBurst();
    this.pttPlayer?.close();
    this.pttPlayback?.close();
    this.pttPlayer = null;
    this.pttPlayback = null;
    // Tell the UI the floor is free. Without this the mic button would keep
    // saying somebody is talking after the sessions that said so are gone,
    // because the activity report is normally driven by inbound frames and
    // those have just stopped arriving.
    this.reportPttActivity();
  }

  // ---- Noise XX handshake handlers ----

  // Dispatch an incoming NOISE_HANDSHAKE packet through the correct leg of
  // the three-message Noise XX exchange, then call split() once the handshake
  // is complete and flush any messages that were queued in the interim.
  // The in-flight handshake for a peer, or undefined if none OR if it has gone
  // stale (older than HANDSHAKE_TIMEOUT_MS). A stale entry is dropped here so the
  // caller re-initiates cleanly instead of appending to a dead handshake. Used on
  // the SEND path only; incoming msg2/msg3 use the raw map so a slow multi-hop
  // reply can still complete.
  private activeHandshake(peerID: string): PendingHandshake | undefined {
    const p = this.pendingHandshakes.get(peerID);
    if (p === undefined) return undefined;
    if (Date.now() - p.startedAt > HANDSHAKE_TIMEOUT_MS) {
      this.pendingHandshakes.delete(peerID);
      return undefined;
    }
    return p;
  }

  // Whether a completed Noise session's authenticated remote static key derives
  // to the peerID it claims to be. peerID = first 16 hex of SHA-256(staticPub),
  // the same derivation used everywhere else (identity.ts, prekey ownership). An
  // attacker cannot forge a key that hashes to a victim's peerID, so this binds
  // the session to a real identity (bitchat NoiseSessionManager identity binding).
  private sessionBindsTo(
    session: NoiseSession,
    claimedPeerID: string,
  ): boolean {
    return (
      bytesToHex(sha256(session.remoteStaticPubKey)).slice(0, 16) ===
      claimedPeerID
    );
  }

  private onNoiseHandshake(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;

    // Only the intended recipient should process this. Relay nodes see these
    // packets too (via flood routing) but must not act on them.
    if (bytesToHex(packet.recipientID) !== this.identity.peerID) return;

    // A 32-byte payload is a fresh msg1 (the remote ephemeral key). Answer it as
    // responder REGARDLESS of any handshake already in flight with this peer.
    // This mirrors bitchat NoiseSessionManager.handleIncomingHandshake: a new
    // initiation while we are mid-handshake (a simultaneous mutual initiation, or
    // the peer restarted) tears down our stale attempt and restarts as responder,
    // so a first-contact DM can never wedge behind a half-open handshake. Any DMs
    // we had queued as the initiator are carried across the flip so they still go
    // out once the (now responder) session completes.
    if (packet.payload.length === 32) {
      const prior = this.pendingHandshakes.get(senderID);
      // Crossed-initiation tiebreak, matching bitchat (lower peerID stays
      // initiator). If we already hold a LIVE initiator handshake to this peer and
      // our peerID sorts lower, keep our initiator role and ignore this msg1: the
      // peer will yield and answer our msg1, so exactly one session forms instead
      // of both sides flipping to responder and deadlocking. Otherwise fall
      // through and (re)start as responder (peer restart, a stale attempt of ours,
      // or we are the higher-sorting ID and must yield).
      if (
        prior?.role === "initiator" &&
        Date.now() - prior.startedAt <= HANDSHAKE_TIMEOUT_MS &&
        this.identity.peerID < senderID
      ) {
        return;
      }
      const carriedText = prior?.pendingText ?? [];
      try {
        const hs = NoiseHandshake.createResponder(
          this.identity.noiseStaticPrivKey,
        );
        hs.readMsg1(packet.payload);
        const msg2 = hs.writeMsg2(); // 96 bytes
        this.pendingHandshakes.set(senderID, {
          handshake: hs,
          role: "responder",
          pendingText: carriedText,
          startedAt: Date.now(),
        });
        // Flood the reply back the same way bitchat does: a recipient-addressed
        // TTL-7 packet through unicastFn (direct link if we have one, else flood)
        // so it routes back even to a peer we only reach multi-hop.
        const reply = this.makeHandshakePacket(packet.senderID.slice(), msg2);
        this.unicastFn(senderID, reply);
      } catch {
        this.pendingHandshakes.delete(senderID);
      }
      return;
    }

    // A 96/64-byte payload is a msg2/msg3 continuation; it is only meaningful
    // against a handshake we already have in flight. (No staleness check here:
    // a late-but-valid reply over several hops should still complete.)
    const pending = this.pendingHandshakes.get(senderID);
    if (!pending) return;

    if (pending.role === "initiator") {
      // Initiator path: this is msg2 (96 bytes) from the responder.
      if (packet.payload.length !== 96) return;
      try {
        pending.handshake.readMsg2(packet.payload);
        const msg3 = pending.handshake.writeMsg3(); // 64 bytes
        const session = pending.handshake.split();
        // Identity binding (bitchat NoiseSessionManager, #1432): the completed
        // session's static key MUST derive to the claimed senderID. Otherwise a
        // peer that answered under someone else's ID could bind a session to an
        // identity it does not own. Abort without sending msg3 or touching state.
        if (!this.sessionBindsTo(session, senderID)) {
          this.pendingHandshakes.delete(senderID);
          return;
        }
        this.registry.setSession(senderID, session);

        // msg3 FIRST. Nothing encrypted under this session may go out before
        // it, because until msg3 lands the far side has no session to decrypt
        // with and will silently drop whatever arrives.
        //
        // We complete on msg2, one message earlier than the responder does, so
        // there is a window where we believe the session is live and they do
        // not. Anything sent into that window is lost without a trace: no
        // error, no receipt, nothing to retry against. The queued-text flush
        // below was already ordered correctly for this reason; what was not was
        // tryInitDR (which flushes the OUTBOX) and flushPendingGroupInvites,
        // both of which ran before msg3 was even written to the radio. That is
        // why a first-contact DM to someone who had walked away never arrived
        // when they came back, and why a group invite needed an existing
        // conversation to land reliably.
        const msg3Pkt = this.makeHandshakePacket(packet.senderID.slice(), msg3);
        this.unicastFn(senderID, msg3Pkt);

        // Now that the far side can decrypt, prove who we are before anything
        // else rides the session. Order matters: the proof is what binds our
        // signing key to this peer ID for the far side, so sending content
        // first would have it arrive attributed only by trust-on-first-use.
        this.sendPeerState(senderID);

        // Then seed the ratchet and release everything that was waiting.
        this.tryInitDR(senderID, "initiator", session.exporterSecret);
        this.flushPendingGroupInvites(senderID);
        // Flush queued messages. Use this.sendDm so they go through DR if ready.
        const queued = pending.pendingText.slice();
        this.pendingHandshakes.delete(senderID);
        for (const q of queued) this.sendDm(senderID, q.text, q.messageID);
      } catch {
        this.pendingHandshakes.delete(senderID);
      }
      return;
    }

    if (pending.role === "responder") {
      // Responder path: this is msg3 (64 bytes) from the initiator.
      if (packet.payload.length !== 64) return;
      try {
        pending.handshake.readMsg3(packet.payload);
        const session = pending.handshake.split();
        // Identity binding (bitchat #1432): reject a completed handshake whose
        // static key does not derive to the claimed senderID, so a forged msg1
        // claiming a victim's peerID cannot complete with the attacker's own key
        // and evict/hijack the victim's real session. Drop without touching the
        // existing session.
        if (!this.sessionBindsTo(session, senderID)) {
          this.pendingHandshakes.delete(senderID);
          return;
        }
        this.registry.setSession(senderID, session);
        // Prove our identity first, for the same reason as the initiator path.
        this.sendPeerState(senderID);
        // Seed the Double Ratchet for Airhop-to-Airhop sessions.
        this.tryInitDR(senderID, "responder", session.exporterSecret);
        this.flushPendingGroupInvites(senderID);
        // Flush any DMs carried over from an initiator->responder reset. Normal
        // responders have none; only a simultaneous-initiation flip queues them.
        const queued = pending.pendingText.slice();
        this.pendingHandshakes.delete(senderID);
        for (const q of queued) this.sendDm(senderID, q.text, q.messageID);
        return;
      } catch {
        this.pendingHandshakes.delete(senderID);
      }
    }
  }

  // Start a Noise XX handshake with a peer we have a direct link to but no
  // session for. No-op when a session or an in-flight handshake already exists,
  // so it is safe to call speculatively.
  private ensureNoiseSession(peerID: string): void {
    if (this.registry.get(peerID)?.session !== undefined) return;
    if (this.activeHandshake(peerID) !== undefined) return;
    const linkID = this.peerToLink.get(peerID);
    if (linkID === undefined) return;
    try {
      const hs = NoiseHandshake.createInitiator(
        this.identity.noiseStaticPrivKey,
      );
      const msg1 = hs.writeMsg1();
      this.pendingHandshakes.set(peerID, {
        handshake: hs,
        role: "initiator",
        pendingText: [],
        startedAt: Date.now(),
      });
      const pkt = this.makeHandshakePacket(hexToBytes(peerID), msg1);
      this.sendBle(linkID, bytesToBase64(encodePacket(pkt))).catch(() => {});
    } catch {
      this.pendingHandshakes.delete(peerID);
    }
  }

  // Deliver any group states owed to a peer now that a session exists, each under
  // the type it was queued with. A send that fails re-queues through the normal
  // path, so nothing is lost by taking them out of the store first.
  private flushPendingGroupInvites(peerID: string): void {
    evictExpiredOwedGroupStates();
    for (const { type, stateBytes } of takeOwedGroupStates(peerID)) {
      this.sendGroupStateQueued(
        peerID,
        type as NoisePayloadTypeValue,
        stateBytes,
      );
    }
  }

  // Initialize a Double Ratchet state from the Noise XX handshake that just
  // completed. Only activated for Airhop peers (those that announced a Nostr
  // pubkey); bitchat nodes don't understand DR_ENCRYPTED and must keep using
  // NOISE_ENCRYPTED.
  private tryInitDR(
    peerID: string,
    role: "initiator" | "responder",
    exporterSecret: Uint8Array,
  ): void {
    const peer = this.registry.get(peerID);
    // The nostrPubkey field is only populated from ANNOUNCE TLV 0x07, which
    // bitchat iOS and Android never send (0x05 and 0x06 are their capabilities
    // and bridge-cell tags, which we decode and ignore). It is a reliable
    // Airhop indicator.
    // A peer without it keeps the plain Noise transport, still a valid route,
    // hence the flush below runs either way.
    if (peer?.nostrPubkey && peer.noisePubKey) {
      // The root key comes from the handshake's EXPORTER SECRET: a value that
      // descends from the Noise chaining key, so it depends on the ephemeral DH
      // outputs and no observer can reconstruct it.
      //
      // It must not come from the transcript hash. The tempting reasoning is
      // wrong in a specific way worth recording: Noise XX does mix both
      // parties' ephemeral keys into the
      // handshake, but it mixes the ephemeral PUBLIC keys into the hash `h` via
      // mixHash, while the secret DH outputs go into the chaining key `ck` via
      // mixKey. Every input to `h` is a byte that was transmitted in the clear,
      // so anyone who captured the three handshake packets - which flood the
      // mesh at TTL 7, so that is anyone in the room, not just the two peers -
      // could recompute the root key exactly, derive the receiving chain, and
      // forge or read DR messages. `ck` is the half that is actually secret.
      //
      // The original goal still holds and is still met: a static-static seed
      // would have been recoverable forever from long-term keys alone, and the
      // exporter secret is not, because the ephemeral private keys that shaped
      // `ck` are destroyed when the handshake splits.
      const rootKey = hkdf(sha256, exporterSecret, undefined, DR_SEED_INFO, 32);

      this.drStates.set(
        peerID,
        role === "initiator"
          ? initSender(rootKey, peer.noisePubKey)
          : initReceiver(rootKey, this.identity.noiseStaticPrivKey),
      );
    }

    // The handshake just completed, so an encrypted route now exists where
    // there wasn't one, so deliver anything queued for this peer immediately
    // rather than waiting up to 30s for their next ANNOUNCE.
    this.flushOutbox(peerID);
  }

  // Decrypt an incoming NOISE_ENCRYPTED DM. This is the path a bitchat peer's
  // messages and receipts arrive on: a bitchat NoisePayload (typed) rather than
  // raw text. Dispatches private messages to the chat store and delivery/read
  // receipts to message status, mirroring the Double Ratchet path.
  // The capability bits we currently support, read fresh so a toggle takes
  // effect on the next announce and the next session proof alike.
  //
  // One function for both consumers: the ANNOUNCE TLV (a public hint anyone can
  // forge) and the authenticated 0x21 proof must never disagree about what this
  // device does. Two copies would drift, and the drift would read as a
  // downgrade attack.
  private localCapabilities(): number {
    const settings = useSettingsStore.getState();
    // Only advertise gateway when we can actually serve: internet on and the
    // toggle enabled. The bridge self-gates (advertisedBridgeGeohash is
    // undefined unless online with a cell, and null once torn down).
    // Live relay connectivity is part of "can actually serve", not just the two
    // settings. A gateway exists to put someone else's message on the internet,
    // so a phone whose every relay is down is not one, however its toggles are
    // set. Advertising anyway meant offline peers picked it, deposited into its
    // 20-slot queue, and were told nothing - while a gateway that could have
    // published sat one hop further away, unchosen.
    //
    // This matches the bridge bit beside it, which has always self-gated on
    // relaysConnected, and it is what the gateway-recovery scenario already
    // says the behaviour is. Withdrawal is not left to the next 15-30s tick
    // either: buildNostrTransport re-announces on the falling edge now.
    const gateway =
      settings.internetEnabled &&
      settings.gatewayEnabled &&
      this.relaysConnected
        ? Capability.gateway
        : 0;
    const bridge =
      this.bridgeService?.advertisedBridgeGeohash() !== undefined
        ? Capability.bridge
        : 0;
    // Unconditional: we always accept and always send encrypted private media
    // to a peer that has proven the same. It is a property of the build, not a
    // user setting.
    return gateway | bridge | Capability.privateMedia;
  }

  // Peers we have already answered with our own state this session, so the
  // echo below happens at most once per peer and two clients cannot bounce
  // proofs off each other forever.
  private readonly peerStateEchoed = new Set<string>();

  // Whether an attachment to this peer would be sealed rather than sent as
  // signed cleartext, which is the precondition sealFileForPeer gates on below.
  //
  // The proof arrives in the peer's 0x21 state after the handshake, so this
  // stays false for a short window at the start of a conversation even though
  // the peer does support sealing.
  canSealPrivateMedia(recipientPeerID: string): boolean {
    return this.registry.hasAuthenticatedCapability(
      recipientPeerID,
      Capability.privateMedia,
    );
  }

  // Seal a whole file inside a peer's Noise session as payload 0x20.
  //
  // Returns null, meaning send it the cleartext way, unless a live session
  // exists and the peer has proven capability bit 8 inside it. Announced bits
  // do not qualify; see the call site in file-transfer-service for why gating
  // on them would be a downgrade attack anyone in radio range could run.
  //
  // Returns the packet rather than sending it, so fragmentation and pacing stay
  // with the file-transfer service: a 512 KiB photo is one Noise ciphertext
  // that still has to be split into 469-byte frames.
  private sealFileForPeer(
    recipientPeerID: string,
    fileTlv: Uint8Array,
  ): Packet | null {
    if (
      !this.registry.hasAuthenticatedCapability(
        recipientPeerID,
        Capability.privateMedia,
      )
    ) {
      return null;
    }
    return this.router.buildNoisePayloadPacket(
      recipientPeerID,
      NoisePayloadType.PRIVATE_FILE,
      fileTlv,
    );
  }

  // Hand one place to one person, once. Returns the message id, or null when no
  // session can carry it.
  //
  // Narrower than `sendDm`, which falls back to Nostr, a courier and the outbox.
  // A position is worth something only while it is current, and one delivered
  // six hours later by a passing carrier points at where somebody used to be:
  // the reasoning the spec gives for never gossiping voice frames. A pin that
  // cannot go now does not go at all, and the sheet says so.
  sendLocationPin(peerID: string, pin: LocationPin): string | null {
    let body: Uint8Array;
    try {
      body = encodeLocationPin(pin);
    } catch {
      // A coordinate outside the world. Never from the OS geocoder, so this
      // guards the caller rather than an expected path.
      return null;
    }
    const sent = this.router.sendNoisePayload(
      peerID,
      NoisePayloadType.LOCATION_PIN,
      body,
    );
    if (!sent) {
      // Still not queued, for the reason above, but the handshake starts so a
      // retry a few seconds later succeeds. Without it, a pin as the first act
      // in a fresh conversation fails until the user sends a text, which does
      // start one, and nothing on screen explains the difference.
      this.ensureNoiseSession(peerID);
      return null;
    }

    const id = newMessageId();
    const channel = `dm:${peerID}`;
    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      id,
      channel,
      senderID: this.identity.peerID,
      senderNickname: this.nickname,
      // The card carries the place. The text is what a notification and a
      // conversation row show, where there is no room for one.
      text: t("chat.location.sent_summary"),
      timestampMs: Date.now(),
      isMine: true,
      locationPin: pin,
      status: "sent",
    });
    return id;
  }

  // A place arrived from a peer we have a session with.
  private onLocationPin(
    senderID: string,
    channel: string,
    body: Uint8Array,
  ): void {
    const pin = decodeLocationPin(body);
    // Malformed, wrong version, or a coordinate that is not on Earth. Rendering
    // nothing beats an arrow pointing at a place that cannot exist.
    if (pin === null) return;

    const peer = this.registry.get(senderID);
    const nickname = peer?.nickname ?? senderID.slice(0, 8);
    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      // Derived from the sender and the fix rather than random, so a pin that
      // arrives over two links collapses to one card instead of stacking.
      id: `pin-${senderID}-${pin.takenAtMs}`,
      channel,
      senderID,
      senderNickname: nickname,
      text: t("chat.location.received_summary"),
      timestampMs: Date.now(),
      isMine: false,
      locationPin: pin,
    });
  }

  // Send our capabilities and signing key inside an established session.
  //
  // Emitted after every completed handshake by both roles. The initiator
  // completes on msg2 and the responder on msg3, so whichever is ready first
  // sends first and the other answers. The echo below covers msg3 and the proof
  // racing each other across different mesh links.
  private sendPeerState(peerID: string): void {
    const body = encodePeerStatePacket({
      capabilities: this.localCapabilities(),
      signingPubKey: this.identity.signingPubKey,
    });
    // Plain Noise, never the ratchet. A peer's first proof has to be readable
    // by anything that completed the handshake, including bitchat, which has no
    // Double Ratchet at all.
    this.router.sendNoisePayload(
      peerID,
      NoisePayloadType.AUTHENTICATED_PEER_STATE,
      body,
    );
  }

  // A peer proved its signing key and capabilities inside the session.
  //
  // Getting here means the packet decrypted under a session whose remote static
  // key hashes to this peer ID (sessionBindsTo). That proves possession of the
  // Noise private key, which is stronger than the self-signed announce that
  // TOFU pins from.
  private onAuthenticatedPeerState(peerID: string, body: Uint8Array): void {
    const state = decodePeerStatePacket(body);
    // Malformed, non-canonical, duplicated or unknown-version: change nothing.
    // A half-understood identity proof is worth less than none.
    if (state === null) return;

    const accepted = this.registry.setAuthenticatedState(
      peerID,
      state.signingPubKey,
      state.capabilities,
    );
    // Two different proven keys for one peer ID cannot both be real. The first
    // stands; this session is talking to something that is not who it was.
    if (!accepted) return;

    // Answer once, so a peer whose own proof crossed ours on a different link
    // still ends up holding ours. Bounded to one echo per peer: without that,
    // two clients that both echo on receipt trade proofs indefinitely.
    if (!this.peerStateEchoed.has(peerID)) {
      this.peerStateEchoed.add(peerID);
      this.sendPeerState(peerID);
    }
  }

  private onNoiseEncrypted(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;

    // Drop packets not addressed to us (relay nodes see everything in the mesh).
    if (bytesToHex(packet.recipientID) !== this.identity.peerID) return;
    if (useBlockedStore.getState().isBlocked(senderID)) return;

    const payload = this.router.decryptDm(packet, senderID);
    if (payload === null) return;
    const channel = `dm:${senderID}`;

    // Identity proof. Handled before anything else in this method, because
    // every other branch below is content and this one decides who the content
    // is FROM. See core/mesh/peer-state-packet.ts.
    if (payload.type === NoisePayloadType.AUTHENTICATED_PEER_STATE) {
      this.onAuthenticatedPeerState(senderID, payload.body);
      return;
    }

    // A whole file, sealed to us. The two accepted values are canonicalised
    // here: 0x20 is what every current client sends and what we emit, and 0x09
    // is the value prerelease bitchat-iOS builds shipped. Accepting the alias
    // costs nothing and those builds exist; emitting it is what we never do.
    if (
      payload.type === NoisePayloadType.PRIVATE_FILE ||
      payload.type === NoisePayloadType.PRIVATE_FILE_LEGACY_ALIAS
    ) {
      this.fileXfer.onSealedFile(senderID, payload.body);
      return;
    }

    // A live burst from this peer. Confidentiality and authenticity both come
    // from the Noise session it arrived in, so unlike a public burst there is
    // no separate signature to check: getting here at all proves the sender.
    if (payload.type === NoisePayloadType.VOICE_FRAME) {
      if (!useSettingsStore.getState().liveVoiceEnabled) return;
      // Same rule as a public burst: only audible in the thread it belongs to.
      if (this.audibleChannel !== channel) return;
      const player = this.ensurePttPlayer();
      if (player === null) return;
      player.handleBurstPayload(payload.body, senderID);
      this.reportPttActivity();
      return;
    }
    if (payload.type === NoisePayloadType.DELIVERED) {
      const messageId = new TextDecoder().decode(payload.body);
      if (messageId) {
        useChatStore
          .getState()
          .setMessageStatus(channel, messageId, "delivered", Date.now());
        // The recipient has it, so stop owing it to them. This is the
        // acknowledgement the outbox has been waiting for: without it, a
        // message delivered by a blind flood would be retried on every sweep
        // until it aged out a week later.
        useOutboxStore.getState().resolve(messageId);
        this.courieredTo.delete(messageId);
      }
      return;
    }
    if (payload.type === NoisePayloadType.READ_RECEIPT) {
      const messageId = new TextDecoder().decode(payload.body);
      if (messageId)
        useChatStore
          .getState()
          .setMessageStatus(channel, messageId, "read", Date.now());
      return;
    }
    if (
      payload.type === NoisePayloadType.GROUP_INVITE ||
      payload.type === NoisePayloadType.GROUP_KEY_UPDATE
    ) {
      this.onGroupState(payload.body, senderID);
      return;
    }
    if (payload.type === NoisePayloadType.LOCATION_PIN) {
      this.onLocationPin(senderID, channel, payload.body);
      return;
    }
    if (payload.type !== NoisePayloadType.PRIVATE_MESSAGE) return;

    const pm = decodePrivateMessagePacket(payload.body);
    if (pm === null) return;

    const peer = this.registry.get(senderID);
    const nickname = peer?.nickname ?? senderID.slice(0, 8);
    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      // Use the sender's message id so a delivery/read receipt we send back, and
      // any duplicate copy, resolves to this exact bubble on both sides.
      id: pm.messageID,
      channel,
      senderID,
      senderNickname: nickname,
      text: pm.content,
      timestampMs: packet.timestamp,
      isMine: false,
    });

    // Acknowledge delivery now; queue the read receipt until the user opens the
    // conversation. Both ride back over the same Noise session.
    this.sendReceipt(senderID, DmPayloadType.DELIVERED, pm.messageID);
    const pending = this.pendingReadAcks.get(senderID) ?? new Set<string>();
    pending.add(pm.messageID);
    this.pendingReadAcks.set(senderID, pending);
  }

  // Decrypt an incoming DR_ENCRYPTED DM (Airhop-to-Airhop only).
  // Double Ratchet provides per-message forward secrecy beyond what Noise
  // transport offers: compromising one message key does not expose past or
  // future messages.
  private onDREncrypted(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;
    if (bytesToHex(packet.recipientID) !== this.identity.peerID) return;
    // Blocked: drop silently, before spending a ratchet step on it. A
    // block means "stop hearing from this peer," not just "hide them."
    if (useBlockedStore.getState().isBlocked(senderID)) return;

    const state = this.drStates.get(senderID);
    if (!state) return;

    let plaintext: Uint8Array;
    try {
      plaintext = ratchetDecrypt(state, packet.payload);
    } catch {
      // Decryption failure: wrong session key, replayed message, or out-of-order
      // beyond the skipped-message window. Drop silently.
      return;
    }

    const channel = `dm:${senderID}`;

    // The decrypted payload is either a message or a receipt (see dm-payload).
    // Backward-compatible: a legacy raw-text DM decodes as a message with no id.
    const payload = decodeDmPayload(plaintext);

    if (payload.type === DmPayloadType.DELIVERED) {
      if (payload.messageId) {
        useChatStore
          .getState()
          .setMessageStatus(
            channel,
            payload.messageId,
            "delivered",
            Date.now(),
          );
        // Acknowledged, so stop owing it. Same rule on every transport.
        useOutboxStore.getState().resolve(payload.messageId);
        this.courieredTo.delete(payload.messageId);
      }
      return;
    }
    if (payload.type === DmPayloadType.READ_RECEIPT) {
      if (payload.messageId) {
        useChatStore
          .getState()
          .setMessageStatus(channel, payload.messageId, "read", Date.now());
      }
      return;
    }

    const peer = this.registry.get(senderID);
    const nickname = peer?.nickname ?? senderID.slice(0, 8);
    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      id: `${senderID}-${String(packet.timestamp)}-dr`,
      channel,
      senderID,
      senderNickname: nickname,
      text: payload.text,
      timestampMs: packet.timestamp,
      isMine: false,
    });

    // Tell the sender it arrived, and remember to send a read receipt when the
    // user opens this conversation. Both are best-effort over the same DR link.
    if (payload.messageId) {
      this.sendReceipt(senderID, DmPayloadType.DELIVERED, payload.messageId);
      const pending = this.pendingReadAcks.get(senderID) ?? new Set<string>();
      pending.add(payload.messageId);
      this.pendingReadAcks.set(senderID, pending);
    }
  }

  // Send a delivery/read receipt back to a message's sender over the Double
  // Ratchet link. Silently no-ops without a session or a message id, so it is
  // safe to call optimistically.
  private sendReceipt(
    peerID: string,
    type: typeof DmPayloadType.DELIVERED | typeof DmPayloadType.READ_RECEIPT,
    messageId: string,
  ): void {
    if (!messageId) return;
    // Airhop-to-Airhop: the Double Ratchet link carries receipts with forward
    // secrecy. bitchat (and any Noise-only peer) has no ratchet, so fall back to
    // a receipt over the plain Noise session in bitchat's format. The type-byte
    // values are shared (0x02 read, 0x03 delivered), so no remapping is needed.
    const state = this.drStates.get(peerID);
    // canEncrypt, not merely "a ratchet exists". The side that ANSWERED the
    // Noise handshake is initialised as a receiver and has no sending chain
    // until the initiator's first ratchet message arrives, so encrypting would
    // throw. Read receipts are sent the moment a thread is opened, which made
    // this the likeliest way to hit it: open a DM you were invited into, before
    // replying, and the send path raised.
    if (state !== undefined && canEncrypt(state)) {
      this.sendDRMessage(peerID, encodeDmReceipt(type, messageId), state);
      return;
    }
    this.router.sendNoiseReceipt(peerID, type, messageId);
  }

  // Flush queued read receipts for a conversation, called when the user opens
  // it. Best-effort: a peer we can't reach simply never sees the blue ticks.
  // Covers both the BLE (Double Ratchet / Noise) queue and the Nostr queue, so a
  // DM that arrived over the internet is acknowledged over the internet.
  sendReadReceipts(peerID: string): void {
    const pending = this.pendingReadAcks.get(peerID);
    if (pending !== undefined && pending.size > 0) {
      for (const messageId of pending) {
        this.sendReceipt(peerID, DmPayloadType.READ_RECEIPT, messageId);
      }
      pending.clear();
    }

    // Nostr read acks: the conversation is keyed either by the sender's Nostr
    // pubkey (nostr_... thread) or by a real peerID whose contact carries an npub.
    const nostrPubkey = peerID.startsWith("nostr_")
      ? peerID.slice("nostr_".length)
      : useContactsStore.getState().getContact(peerID)?.nostrPubkeyHex;
    if (nostrPubkey !== undefined) {
      // Geohash DMs ack from the per-cell identity; everything else from the
      // main Nostr identity. The two ack queues are disjoint, so flushing both
      // is safe.
      this.geoChannels?.sendGeoReadReceipts(nostrPubkey);
      const nostrPending = this.pendingNostrReadAcks.get(nostrPubkey);
      if (nostrPending !== undefined && nostrPending.size > 0) {
        for (const messageId of nostrPending) {
          this.publishNostrAck(
            nostrPubkey,
            NoisePayloadType.READ_RECEIPT,
            messageId,
          );
        }
        nostrPending.clear();
      }
    }
  }

  // Build a NOISE_HANDSHAKE unicast packet from our identity.
  //
  // Unsigned at the packet layer, byte-for-byte with bitchat (BLEService
  // sendNoiseHandshake / BLENoisePacketHandler both build with `signature: nil`).
  // The Noise XX handshake authenticates each side by its static key inside
  // msg2/msg3, so an outer Ed25519 signature is redundant. It is also actively
  // unhelpful at first contact: the recipient may not have processed our ANNOUNCE
  // yet, so it may lack our signing key. Keeping these unsigned matches bitchat
  // and avoids a peer dropping a SIGNED packet whose signer it cannot verify.
  private makeHandshakePacket(
    recipientID: Uint8Array,
    payload: Uint8Array,
  ): Packet {
    return {
      type: PacketType.NOISE_HANDSHAKE,
      ttl: 7,
      flags: Flags.HAS_RECIPIENT, // directed, unsigned (matches bitchat)
      senderID: hexToBytes(this.identity.peerID),
      recipientID,
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload,
    };
  }

  private onAnnounce(packet: Packet, linkID: string): void {
    const info = decodeAnnouncePayload(packet.payload, packet.senderID);
    if (!info) return;

    // A correctly signed, correctly key-bound announce is still replayable
    // forever if nothing bounds its age: capture one and rebroadcast it, and a
    // peer who left keeps reappearing. Both upstreams bound it (see
    // ANNOUNCE_MAX_SKEW_MS). Cheapest check here, so it goes first.
    if (!isAnnounceFresh(packet.timestamp, Date.now())) return;

    const peerID = bytesToHex(packet.senderID);

    // The claimed senderID must be the one this announce's Noise key derives
    // to. peerID = first 16 hex of SHA-256(noiseStaticPubKey), the same
    // derivation identity.ts uses to mint it and sessionBindsTo uses to bind a
    // completed Noise session. Without this, senderID is just an unchecked
    // header field: anyone could announce under a victim's peerID and have the
    // registry file their own keys under it. Preimage resistance is what makes
    // the check meaningful - an attacker cannot produce a Noise key hashing to
    // someone else's ID. bitchat rejects the same case by name in
    // BLEAnnouncePreflightPolicy: .senderMismatch(derivedPeerID:).
    if (bytesToHex(sha256(info.noisePubKey)).slice(0, 16) !== peerID) return;

    // Ignore echoes of our own announcements.
    if (peerID === this.identity.peerID) return;

    // ANNOUNCE packets are self-authenticating: the signing pubkey is in the
    // TLV payload (0x03), so decode first, then verify against it.
    //
    // The signature is MANDATORY. Verifying only when the sender happened to
    // set the SIGNED flag let the sender opt out of being checked, which is no
    // check at all - an unsigned announce sailed straight through and wrote its
    // keys into the registry. verifyPacket already returns false when SIGNED is
    // clear, so one unconditional call covers both "no signature" and "bad
    // signature". bitchat treats these as two distinct rejections
    // (.missingSignature / .invalidSignature) and refuses both.
    if (!verifyPacket(packet, info.signingPubKey)) return;

    // A blocked peer's announces still resolve transport-level routing
    // (below) so a Block doesn't itself break the mesh for other peers
    // relaying through us, but they're kept out of the peer store entirely
    // so the Mesh tab never learns they're nearby.
    const isBlocked = useBlockedStore.getState().isBlocked(peerID);

    // ANNOUNCE is flood-broadcast with TTL 7, so `linkID` is the link the packet
    // ARRIVED on, which is the relay's link, not the originator's, for anything
    // more than one hop away. Only a packet still carrying the full TTL came
    // straight from its sender.
    //
    // Binding a link to a relayed announce was actively harmful: linkToPeer is
    // 1:1, so each relayed announce overwrote that link's real owner (breaking
    // disconnect cleanup and mis-attributing RSSI), and peerToLink made sendDm
    // take the "direct BLE, start a Noise handshake" branch for a peer that
    // isn't on that link at all, so the handshake was unicast into the void and
    // silently never completed. bitchat applies the same max-TTL rule before
    // binding an address to a peer.
    // A BLE link has exactly ONE remote peer, and that fact is the only thing
    // making "direct" mean anything.
    //
    // An undecremented TTL says "this came straight from its author", but TTL
    // is a plaintext header field an attacker sets to whatever it likes. Taking
    // it at face value meant one hostile peer, over one real link, could
    // announce unlimited identities that all looked directly connected. Each
    // one overwrote `linkToPeer` for that link - breaking RSSI attribution and
    // disconnect handling for the genuine peer on it - and, because direct
    // peers are the ones worth protecting from eviction, every one of them was
    // also immune to being trimmed. 500 invented peers survived a flood that
    // the caps were specifically there to bound.
    //
    // So a link binds to the first peer that announces directly on it, and a
    // later claim from a different peer ID on that same link is treated as
    // relayed rather than direct. bitchat rejects this case outright, by name:
    // BLEIngressRejection.directSenderMismatch(boundPeerID:claimedSenderID:).
    // Downgrading rather than dropping is the gentler equivalent - the announce
    // is still useful topology, it simply does not earn direct standing.
    const boundPeer =
      this.linkToPeer.get(linkID) ?? this.wifiLinkToPeer.get(linkID);
    const isDirectAnnounce =
      packet.ttl === ANNOUNCE_TTL &&
      (boundPeer === undefined || boundPeer === peerID);

    if (isDirectAnnounce) {
      // WiFi links are tracked separately so the unicast function can prefer
      // the higher-throughput transport for attachments and DR messages.
      if (this.wifiConnectedLinks.has(linkID)) {
        this.wifiPeerToLink.set(peerID, linkID);
        this.wifiLinkToPeer.set(linkID, peerID);
      } else {
        this.peerToLink.set(peerID, linkID);
        this.linkToPeer.set(linkID, peerID);
      }
      // Direct standing follows the LINK, not the announce that revealed it.
      // Inferring it from packet.ttl alone made it depend on which announce
      // happened to arrive first, so a genuine neighbour could be recorded as
      // indirect and then trimmed out of the radar by a flood of invented
      // peers. A held link is physical and cannot be claimed by anybody else.
      usePeerStore.getState().setDirect(peerID, true);
    }

    // Update the core registry (used by MessageRouter for transport selection).
    const nostrPubkeyHex = info.nostrPubKey
      ? bytesToHex(info.nostrPubKey)
      : undefined;
    if (nostrPubkeyHex) {
      this.nostrPubkeyToPeerID.set(nostrPubkeyHex, peerID);
      // Persist the npub onto their contact (if we have one) so it survives this
      // peer leaving Bluetooth range: the registry entry above expires 60s after
      // their radio goes quiet, but a durable contact keeps the key so a later
      // DM can still fall back to Nostr. No-op for strangers we haven't saved.
      useContactsStore.getState().setNostrPubkey(peerID, nostrPubkeyHex);
      // We may already have a thread keyed by their Nostr pubkey, from before
      // we knew who they were. Now that the ANNOUNCE ties the two identities
      // together, fold it into the real peer thread so the user sees one
      // conversation instead of the same person twice.
      useChatStore
        .getState()
        .mergeChannel(`dm:nostr_${nostrPubkeyHex}`, `dm:${peerID}`);
      // Re-key anything still queued against the pubkey-form identifier so it
      // now goes out over the (cheaper, offline-capable) mesh route.
      const outbox = useOutboxStore.getState();
      for (const msg of outbox.forPeer(`nostr_${nostrPubkeyHex}`)) {
        outbox.resolve(msg.id);
        outbox.enqueue({
          ...msg,
          recipientPeerID: peerID,
          channel: `dm:${peerID}`,
        });
      }
    }
    this.registry.update({
      peerID,
      noisePubKey: info.noisePubKey,
      signingPubKey: info.signingPubKey,
      nickname: info.nickname,
      nostrPubkey: nostrPubkeyHex,
      capabilities: info.capabilities,
      bridgeGeohash: info.bridgeGeohash,
      // undefined preserves whatever the registry already knows. A relayed
      // announce must never *demote* a genuinely direct peer. Only an actual
      // link drop does that, via markIndirect on linkDisconnected. (The flood
      // router delivers whichever copy arrives first, so a relayed copy can
      // easily precede the direct one.)
      isDirect: isDirectAnnounce ? true : undefined,
    });
    if (isDirectAnnounce) this.registry.markDirect(peerID);

    // Update the Zustand peer store (drives the Mesh tab UI), skipped for a
    // blocked peer so they never appear in the list/radar view.
    if (!isBlocked) {
      usePeerStore.getState().upsertPeer({
        peerID,
        nickname: info.nickname,
        lastSeenMs: Date.now(),
        noisePubKeyHex: bytesToHex(info.noisePubKey),
        // Carried through so the radar can protect real neighbours when it has
        // to trim: an announce relayed across the mesh is cheap to fake in
        // bulk, one that arrived over a link we hold is not.
        isDirect: isDirectAnnounce,
        // Relay nodes announce like anyone else, so without this they sit in
        // the Mesh tab as a person who never replies.
        isInfrastructure: info.isInfrastructure,
      });
      // This peer is reachable again: deliver anything we owe them. Covers the
      // ordinary case of someone walking back into range.
      this.flushOutbox(peerID);
      // And hand them any envelopes we're carrying for third parties.
      this.sprayCourierTo(peerID);
    }
  }

  // A peer published the set of packet IDs it already has. Replay anything we
  // hold that's missing from their filter, so a peer returning from out of
  // range catches up instead of silently missing that history.
  //
  // Replies go ONLY down the link the request arrived on: the requester is the
  // one catching up, and broadcasting replays to everyone would turn one
  // rejoining peer into a mesh-wide storm. The flood router's dedupe drops any
  // replay the requester turns out to already hold (GCS filters allow false
  // positives, never false negatives, so we may over-send slightly, never
  // under-send).
  private onRequestSync(packet: Packet, linkID: string): void {
    const senderID = bytesToHex(packet.senderID);

    // Verify when we can, never require. A REQUEST_SYNC carries no content and
    // every packet it draws back is independently verified by the requester, so
    // a forged request cannot inject anything. The risk is amplification, which
    // the rate limiter below bounds.
    //
    // Requiring a signature would break first contact, where a peer's sync
    // round arrives before its ANNOUNCE and we hold no key to check it with.
    // bitchat does not gate on it either. A signature that is present and wrong
    // is a different matter, and is refused.
    const signingKey = this.registry.get(senderID)?.signingPubKey;
    if (signingKey !== undefined && (packet.flags & Flags.SIGNED) !== 0) {
      if (!verifyPacket(packet, signingKey)) return;
    }

    // Attribute the request to the link's bound peer, not the claimed senderID:
    // the budget must be per physical neighbour, or one peer minting sender IDs
    // gets an unbounded number of budgets over a single link.
    const linkPeer =
      this.linkToPeer.get(linkID) ?? this.wifiLinkToPeer.get(linkID) ?? linkID;

    // Packets come back ttl 0 and IS_RSR-tagged (set by handleFilter), so they
    // stop at the requester instead of being re-flooded mesh-wide, and so the
    // requester can tell they are the answer to its own question.
    const missing = this.gossip.handleFilter(packet, linkPeer);
    if (missing.length === 0) return;

    const isWifi = this.wifiConnectedLinks.has(linkID);
    for (const pkt of missing) {
      const b64 = bytesToBase64(encodePacket(pkt));
      if (isWifi) this.sendWifi(linkID, b64).catch(() => {});
      else this.sendBle(linkID, b64).catch(() => {});
    }
  }

  // Courier: store-and-forward for peers we can't reach directly

  // Initial spray budget: how many peers may carry a copy.
  private static readonly COURIER_COPIES = 4;

  // Message IDs already opened out of a courier envelope, so the redundant
  // copies spray-and-wait exists to create collapse into one message. Bounded by
  // rememberEventID, and per session: an envelope cannot outlive its 24h expiry,
  // and a duplicate arriving after a relaunch is collapsed by the chat store on
  // the same id instead.
  private readonly openedCourierIDs = new Set<string>();

  // Couriers we have already given each outgoing message to, keyed by message
  // id. Sealing is randomised and CourierStore.deposit has no content dedupe, so
  // without this the retry sweep handed a FRESH envelope for the same message to
  // the same carriers every pass - exhausting their per-depositor quota (2 for a
  // non-contact) within a couple of sweeps, after which every later deposit from
  // this device was refused for every recipient.
  private readonly courieredTo = new Map<string, Set<string>>();

  // Seal a DM to a peer we can't currently reach and hand it to the mesh.
  // Returns false when nothing actually took a copy, so the caller can fall back
  // to the local outbox and the composer does not claim a carrier it never had.
  private sendViaCourier(
    recipientPeerID: string,
    text: string,
    messageID: string,
  ): boolean {
    const peer = this.registry.get(recipientPeerID);
    const noisePub = peer?.noisePubKey;
    // Sealing is to their static Noise key; without it there is no envelope to
    // build. (Known from a prior ANNOUNCE or a scanned contact card.)
    if (!noisePub) return false;

    // Refuse when nobody can carry it, rather than reporting success.
    //
    // An envelope is held by peers; with no courier to address it to there is
    // nothing to hold it, and nothing re-originates it later. Returning true
    // here showed "carried by a friend" for a message no friend received.
    // bitchat filters couriers to connected peers and refuses the same way
    // (BLEService.sendCourierMessage).
    const already = this.courieredTo.get(messageID) ?? new Set<string>();
    const couriers = this.courierCandidates()
      .filter((p) => !already.has(p))
      .slice(0, MeshService.COURIER_COPIES);
    if (couriers.length === 0) return false;

    // The envelope carries a typed private message, not raw text.
    //
    // This is a wire-format correction, not a preference. bitchat opens a
    // courier envelope, requires the plaintext to be
    // NoisePayloadType.privateMessage, and refuses anything else outright
    // ("Courier envelope carried unsupported payload type"). Sealing bare UTF-8
    // meant every envelope Airhop sent was dropped by every bitchat recipient,
    // and every bitchat envelope Airhop received rendered a binary TLV as the
    // message body, while courier-store.ts claimed compatibility in its header.
    //
    // It also carries the message ID, which is what makes the rest work: the
    // recipient can dedupe the redundant copies spray-and-wait exists to create,
    // and the outbox entry can be resolved by an ordinary receipt.
    const inner = encodeNoisePrivateMessage(messageID, text);
    // A PrivateMessagePacket caps content at 255 bytes, and bitchat's does too,
    // so an oversized message has no courier representation on either side.
    // Refusing leaves it queued, which is honest, rather than sealing something
    // no recipient can read.
    if (inner === null) return false;

    try {
      // Prefer a forward-secret v2 seal when we hold a prekey bundle for them:
      // target a one-time prekey instead of their long-lived static key. Falls
      // back to a v1 static seal when we have no bundle.
      const prekey = this.peerPrekeys.assign(noisePub) ?? undefined;
      const ciphertext = noiseXSeal(
        this.identity.noiseStaticPrivKey,
        prekey?.publicKey ?? noisePub,
        inner,
      );
      const payload = encodeEnvelopePayload({
        // Tag is derived from the recipient's STATIC key + today's epoch day, so
        // carriers can match deliveries without learning who it is for (v1 and
        // v2 share the same routing tag).
        recipientTag: computeRecipientTag(noisePub),
        // The envelope's expiry is on the wire, and every carrier applies its
        // own policy to it. bitchat rejects anything past 24h + 1h slack, so a
        // longer stamp is not a longer life, it is an envelope no bitchat device
        // will carry at all. The outbox keeps retrying for 7 days regardless;
        // this only bounds how long a third party holds a copy for us.
        expiryMs: Date.now() + ENVELOPE_TTL_MS,
        // Split across the couriers below, not replicated. Each gets its own
        // directed envelope, so seeding all of them with the full budget would
        // put four times the intended number of copies on the mesh, each of
        // which then sprays half of ITS budget onward.
        copies: Math.max(
          1,
          Math.floor(MeshService.COURIER_COPIES / couriers.length),
        ),
        ciphertext,
        prekeyID: prekey?.id,
      });
      // One directed copy per courier, and remember each so a later sweep hands
      // this message to somebody new rather than to the same carriers again.
      for (const courier of couriers) {
        this.sendCourierPayloadTo(payload, courier);
        already.add(courier);
      }
      this.courieredTo.set(messageID, already);
      return true;
    } catch {
      return false;
    }
  }

  // Hand one envelope to ONE named peer.
  //
  // Directed, not broadcast, for three reasons: bitchat refuses any envelope not
  // addressed to it, the deposit quota is per depositor so a broadcast charges
  // one deposit against every peer in range, and a broadcast reveals to everyone
  // in earshot that this device is couriering.
  //
  // Flood-originated as well as written down the direct link, because a courier
  // may be several hops away. The recipient field stops relays depositing it.
  private sendCourierPayloadTo(payload: Uint8Array, peerID: string): void {
    const packet: Packet = {
      type: PacketType.COURIER_ENV,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: hexToBytes(peerID),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, this.identity.signingPrivKey);
    const b64 = bytesToBase64(encodePacket(packet));
    this.floodRouter.originate(packet);

    // Straight down the link when we hold one, so the common case is one write
    // rather than a flood.
    const bleLink = this.peerToLink.get(peerID);
    const wifiLink = this.wifiPeerToLink.get(peerID);
    if (wifiLink !== undefined) {
      this.sendWifi(wifiLink, b64).catch(() => {});
      return;
    }
    if (bleLink !== undefined) {
      this.sendBle(bleLink, b64).catch(() => {});
      return;
    }
    // No direct link: let the flood carry it to them.
    for (const linkID of this.connectedLinks) {
      this.sendBle(linkID, b64).catch(() => {});
    }
    for (const linkID of this.wifiConnectedLinks) {
      this.sendWifi(linkID, b64).catch(() => {});
    }
  }

  // Peers that could carry mail for someone else right now: directly linked,
  // announced, and with a Noise key we can charge a deposit against.
  private courierCandidates(): string[] {
    const peers: string[] = [];
    for (const linkID of this.connectedLinks) {
      const peerID = this.linkToPeer.get(linkID);
      if (peerID !== undefined) peers.push(peerID);
    }
    for (const linkID of this.wifiConnectedLinks) {
      const peerID = this.wifiLinkToPeer.get(linkID);
      if (peerID !== undefined && !peers.includes(peerID)) peers.push(peerID);
    }
    return peers.filter((p) => this.registry.get(p)?.noisePubKey !== undefined);
  }

  // An envelope arrived. Either it's addressed to us (open and deliver), or we
  // carry it onward for whoever it belongs to.
  private onCourierEnvelope(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;

    // Addressed to us, or it is not ours to open OR to carry.
    //
    // Envelopes are directed now (see sendCourierPayloadTo), and relays see them
    // in passing because they are flooded. Without this check every peer along
    // the path deposited a copy: the same deposit charged against the depositor
    // once per listener, the pool filled with mail nobody chose to carry, and
    // the sender's metadata went to everyone in earshot rather than to the
    // couriers it picked. bitchat gates identically, at the top of its own
    // handler.
    if (bytesToHex(packet.recipientID) !== this.identity.peerID) return;

    // Is it ours? Check today's tag and yesterday's: an envelope sealed just
    // before a UTC day boundary carries the previous day's tag, and dropping
    // those would silently lose messages once a day.
    const myPub = x25519.getPublicKey(this.identity.noiseStaticPrivKey);
    const now = Date.now();
    // Three days, not two: yesterday, today, and TOMORROW.
    //
    // The tag is derived from a UTC epoch day, so a sender whose clock runs
    // ahead across the boundary seals with tomorrow's tag. Checking only
    // backwards meant that envelope was silently unmatchable and we carried our
    // own mail around instead of opening it. bitchat's candidateTags spans the
    // same three days for the same reason.
    const tags = [
      computeRecipientTag(myPub, now),
      computeRecipientTag(myPub, now - 86_400_000),
      computeRecipientTag(myPub, now + 86_400_000),
    ];
    const env = decodeEnvelopePayload(packet.payload);
    if (env === null) return;

    const isForUs = tags.some((tag) =>
      tag.every((b, i) => b === env.recipientTag[i]),
    );

    if (isForUs) {
      // v2 envelopes seal to one of our one-time prekeys; v1 to our static key.
      const openKey =
        env.prekeyID !== undefined
          ? this.localPrekeys.privForId(env.prekeyID)
          : this.identity.noiseStaticPrivKey;
      if (openKey === null) return; // prekey unknown/expired: cannot open
      try {
        const { plaintext, senderStaticPubKey } = noiseXOpen(
          openKey,
          env.ciphertext,
        );
        // Identify the sender from the key the envelope authenticates, not from
        // the packet header, which names whoever relayed it to us.
        const fromPeerID = bytesToHex(sha256(senderStaticPubKey)).slice(0, 16);
        if (useBlockedStore.getState().isBlocked(fromPeerID)) return;

        // The plaintext is a typed Noise payload, exactly as bitchat seals it.
        // Anything else is from a build that predates this or is not a private
        // message at all, and there is nothing useful to render either way.
        const typed = decodeNoisePayload(plaintext);
        if (typed === null || typed.type !== NoisePayloadType.PRIVATE_MESSAGE) {
          return;
        }
        const pm = decodePrivateMessagePacket(typed.body);
        if (pm === null) return;

        // Dedupe on the message ID the SENDER chose, not on anything about this
        // envelope.
        //
        // Spray-and-wait deliberately puts several copies on the mesh, each
        // resealed by its carrier with a fresh timestamp, so no envelope-derived
        // identity can collapse them. Building the id from the relaying
        // carrier's clock gives four carriers four identical bubbles for one
        // message, and never collapses a courier copy against the direct copy,
        // which arrives under the sender's id. Both are one comparison here.
        if (this.openedCourierIDs.has(pm.messageID)) return;
        this.rememberEventID(this.openedCourierIDs, pm.messageID);

        const channel = `dm:${fromPeerID}`;
        useChatStore.getState().addChannel(channel);
        useChatStore.getState().addMessage({
          id: pm.messageID,
          channel,
          senderID: fromPeerID,
          senderNickname: resolveDisplayName(fromPeerID),
          text: pm.content,
          timestampMs: packet.timestamp,
          isMine: false,
        });
        // Acknowledge it.
        //
        // Couriered mail is the one path that could never resolve its sender's
        // outbox entry, because there was no id to name in a receipt, so a
        // message that really did arrive kept being re-sent on every sweep for
        // as long as the entry lived. Both routes are tried because neither is
        // reliable here: the mesh receipt needs a session with someone who is by
        // definition out of range, and the Nostr one needs their npub and a
        // relay. Whichever lands clears the sender's hourglass.
        this.sendReceipt(fromPeerID, DmPayloadType.DELIVERED, pm.messageID);
        const senderNpub =
          this.registry.get(fromPeerID)?.nostrPubkey ??
          useContactsStore.getState().getContact(fromPeerID)?.nostrPubkeyHex;
        if (senderNpub !== undefined && senderNpub.length > 0) {
          this.publishNostrAck(
            senderNpub,
            NoisePayloadType.DELIVERED,
            pm.messageID,
          );
        }

        // Burn the one-time prekey now that it has opened a message, then
        // publish a fresh bundle so senders stop using the spent key.
        if (env.prekeyID !== undefined) {
          this.localPrekeys.consume(env.prekeyID);
          // The held bundle now advertises a spent key, so this is the one path
          // that must mint a new packet rather than re-send the current one.
          this.emitPrekeyBundle(true);
        }
      } catch {
        // Not actually decryptable by us: a tag collision. Drop it.
      }
      return;
    }

    // Not ours: carry it, but only for a depositor who has proven who they are.
    //
    // The quota is charged to `packet.senderID`, which is an unauthenticated
    // header field, and nothing was verifying it. Any peer in range could put a
    // known peer's ID on an envelope and spend that peer's storage allowance -
    // or, at the favourite tier, a contact's larger one. FILE_TRANSFER and
    // public messages already go through this check; the courier is the path
    // where skipping it actually costs somebody else something.
    //
    // bitchat gates the same way in acceptCourierDeposit before its store is
    // touched.
    if (!this.senderIsAuthentic(packet, senderID)) return;

    // Contacts get the larger quota; everyone else the
    // smaller one, so an unknown peer can't fill our storage.
    const depositorPub = this.registry.get(senderID)?.noisePubKey;
    if (!depositorPub) return; // unknown depositor: no quota to charge
    const isContact =
      useContactsStore.getState().getContact(senderID) !== undefined;
    this.courier.deposit(
      packet.payload,
      depositorPub,
      isContact ? "favorite" : "verified",
    );
  }

  // Hand carried envelopes to a peer we just met. Spray-and-wait: each transfer
  // gives away half the remaining copy budget, so delivery probability rises
  // without the mesh being flooded by one message.
  private sprayCourierTo(peerID: string): void {
    const peer = this.registry.get(peerID);
    if (!peer?.noisePubKey) return;
    this.courier.evictExpired();

    // FIRST: is any of this mail actually for them?
    //
    // This is the handover spray-and-wait exists to end with, and nothing was
    // calling it. `deliverMatching` was written, tested, and wired to nothing,
    // so the only way a carried envelope ever reached its recipient was if that
    // recipient happened to overhear a spray meant for someone else, and an
    // envelope whose budget reached 1 stopped being sprayed at all - so a
    // carrier could sit next to the recipient holding mail it would never hand
    // over, until the 24h expiry threw it away.
    //
    // Destructive and budget-independent, like bitchat's handoverEnvelopes: the
    // recipient is the destination, not another carrier, so there is nothing
    // left to spray afterwards and no reason to require copies >= 2.
    // All three days, matching the receive gate. The tag is stamped by the
    // SENDER at seal time and rotates on the UTC epoch day, while an envelope
    // lives 24h - so any envelope carried across midnight carries yesterday's
    // tag and would never match a today-only comparison. Checking one day meant
    // the handover missed most of what a carrier actually holds.
    const now = Date.now();
    for (const dayOffset of [0, -86_400_000, 86_400_000]) {
      const tag = computeRecipientTag(peer.noisePubKey, now + dayOffset);
      for (const env of this.courier.deliverMatching(tag)) {
        this.sendCourierPayloadTo(encodeEnvelopePayload(env), peerID);
      }
    }

    for (const env of this.courier.sprayTo(peer.noisePubKey)) {
      this.sendCourierPayloadTo(encodeEnvelopePayload(env), peerID);
    }
  }

  // A peer announced it is leaving the mesh (app closing, panic wipe, radio
  // off). Drop it from the UI immediately instead of waiting out the 60s
  // reachability TTL. Otherwise someone who has clearly gone still shows as
  // "in range" for a full minute.
  //
  // Authenticate the leave first: bitchat now requires a verified signature on
  // LEAVE, and without one a third party could forge a leave carrying a victim's
  // senderID and force-drop them from everyone's Mesh tab. We can only verify
  // once the peer has announced (so we hold its signing key); an unverifiable
  // leave is ignored, which is safe because a peer we never saw announce is not
  // in our UI to drop. Still presence-only: a verified leave updates routing/UI
  // but never tears down crypto, so a stale-but-authenticated leave cannot strand
  // an active session.
  // Whether a LEAVE really came from the peer it names.
  //
  // Checked against the announce-pinned signing key first, then against a saved
  // contact's key. The second source matters after a restart: the live registry
  // is empty until the next announce arrives, and without the fallback a
  // departure from someone already in the address book would be unverifiable
  // for that window.
  private leaveIsAuthentic(packet: Packet): boolean {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return false;
    if ((packet.flags & Flags.SIGNED) === 0) return false;

    // Deliberately the pinned key rather than registry.get(), which applies a
    // reachability TTL. A LEAVE arrives exactly when a peer has stopped
    // announcing, so resolving it through that window refuses the genuine ones.
    const pinned = this.registry.pinnedSigningKey(senderID);
    if (pinned !== undefined) return verifyPacket(packet, pinned);

    const saved =
      useContactsStore.getState().contacts[senderID]?.signingPubKeyHex;
    if (saved === undefined || saved.length !== 64) return false;
    try {
      return verifyPacket(packet, hexToBytes(saved));
    } catch {
      // A stored key that is not valid hex. Treat as no key rather than throw.
      return false;
    }
  }

  private onLeave(packet: Packet): void {
    // Checked here as well as before the relay in handleRaw. The two guards
    // answer different questions ("may this be forwarded" and "may this evict
    // someone") and a signature check on a packet sent once per departure is
    // free, so neither has to trust the other's discipline to stay correct.
    if (!this.leaveIsAuthentic(packet)) return;
    const senderID = bytesToHex(packet.senderID);

    const linkID = this.peerToLink.get(senderID);
    if (linkID !== undefined) this.linkToPeer.delete(linkID);
    this.peerToLink.delete(senderID);
    this.registry.markIndirect(senderID);
    usePeerStore.getState().removePeer(senderID);

    // Retire the Noise session too.
    //
    // A LEAVE is a deliberate shutdown, not a link that dropped. The peer tears
    // its own session down on the way out, so keeping ours means the next DM is
    // sealed under a session that no longer exists on the other side: it is
    // encrypted, transmitted, silently discarded on arrival, and reported as
    // sent. Clearing it makes the next message re-handshake, or fall through to
    // the courier if they are really gone.
    //
    // Only on an explicit LEAVE. An ordinary disconnect keeps the session on
    // purpose, because resuming one is far cheaper than a fresh handshake and
    // radios drop links constantly.
    this.registry.clearSession(senderID);
  }

  // Tell nearby peers we're going away, so we disappear from their Mesh tab at
  // once rather than lingering until our announce expires.
  private sendLeave(): void {
    const packet: Packet = {
      type: PacketType.LEAVE,
      ttl: 3, // presence news is local; no need to flood the whole mesh
      flags: Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: new Uint8Array(8), // broadcast
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload: new Uint8Array(0),
    };
    packet.signature = signPacket(packet, this.identity.signingPrivKey);

    const b64 = bytesToBase64(encodePacket(packet));
    for (const linkID of this.connectedLinks) {
      this.sendBle(linkID, b64).catch(() => {});
    }
    for (const linkID of this.wifiConnectedLinks) {
      this.sendWifi(linkID, b64).catch(() => {});
    }
  }

  // Is this broadcast packet genuinely from the peer it claims to be from?
  //
  // `senderID` is attacker-controlled: it is a plaintext header field on an
  // unauthenticated broadcast, and anyone in radio range can put any value in
  // it. The ONLY thing that binds a packet to an identity is an Ed25519
  // signature that verifies against a signing key already bound to that peer ID
  // by an earlier, signature-checked ANNOUNCE.
  //
  // This is stricter than what was here before, and deliberately so. The
  // previous form was:
  //
  //     if (SIGNED && peer?.signingPubKey !== undefined) {
  //       if (!verifyPacket(...)) return;
  //     }
  //
  // which skipped verification entirely in two cases that both matter. An
  // UNSIGNED packet was accepted, so anyone could impersonate a peer already in
  // your registry - a contact you trust - simply by not setting the signature
  // flag. And a packet from a peer NOT in the registry was accepted with no
  // check at all. Random single-byte corruption of a senderID in flight was
  // enough to make four devices render a message attributed to a peer that does
  // not exist, which is how this was found.
  //
  // bitchat-ios does not have either hole: BLEPublicMessageHandler.swift
  // computes `verifiedViaRegistry` as `key.map { verify } ?? false` - an absent
  // key is a FAILED check, not a skipped one - and drops anything that neither
  // verifies against the registry nor against a persisted identity, logging
  // "Dropping public message with missing/invalid signature for claimed sender".
  // ARCHITECTURE.md section 2 (Identity) says the same thing: "Receivers verify
  // signatures before displaying or acting on a message" and "unsigned and
  // invalid-signature packets are dropped before display". Relaying is the
  // separate case: a node forwards bytes it may not yet be able to check.
  //
  // The cost is that a public message can arrive before its author's ANNOUNCE
  // and be dropped. That is bitchat's tradeoff too, it is bounded (announces
  // flood on every link-up, and gossip sync re-serves the message), and losing a
  // message is a far smaller failure than rendering a forged one.
  private senderIsAuthentic(packet: Packet, senderID: string): boolean {
    if ((packet.flags & Flags.SIGNED) === 0) return false;
    const signingPubKey = this.registry.get(senderID)?.signingPubKey;
    if (signingPubKey === undefined) return false;
    return verifyPacket(packet, signingPubKey);
  }

  // A message in the public mesh room (0x02). The payload is the text; the room
  // is not on the wire because there is only one.
  private onChannelMsg(packet: Packet): void {
    const text = decodeMeshPublicPayload(packet.payload);
    if (text === null) return;
    // Key the row on the content-stable ID (bitchat's MeshMessageIdentity
    // .stableID over the same fields) so a radio copy and a bridged copy
    // collapse to one bubble in either arrival order, and tell the bridge the
    // message is already on the radio so it never re-bridges it (loop rule 3).
    this.acceptPublicMessage(packet, BRIDGE_CHANNEL, text, (senderID) => {
      this.bridgeService?.noteRadioMessage(senderID, packet.timestamp, text);
      return `mesh-${bridgeStableID(senderID, packet.timestamp, text)}`;
    });
  }

  // A message in a named Airhop channel (0x51), i.e. a location cell.
  private onAirhopChannelMsg(packet: Packet): void {
    const decoded = decodeAirhopChannelPayload(packet.payload);
    if (decoded === null) return;
    const { channel, text, msgId } = decoded;
    // The mesh room never travels under this type. Accepting it would give a
    // peer two ways into the same room, only one of which bitchat can see.
    if (channel === BRIDGE_CHANNEL) return;
    this.acceptPublicMessage(packet, channel, text, (senderID) =>
      msgId.length > 0
        ? `ch-${msgId}`
        : `${senderID}-${String(packet.timestamp)}-${channel}`,
    );
  }

  // Shared tail of both public-message paths: authenticate, check the room is
  // joined, file it.
  private acceptPublicMessage(
    packet: Packet,
    channel: string,
    text: string,
    rowID: (senderID: string) => string,
  ): void {
    const senderID = bytesToHex(packet.senderID);

    // Drop our own messages echoed back (shouldn't happen, but guard anyway).
    if (senderID === this.identity.peerID) return;
    if (!this.senderIsAuthentic(packet, senderID)) return;

    // Only accept traffic for channels the user has actually joined.
    //
    // Never addChannel() unconditionally: that lets any peer in radio range
    // inject arbitrary channels into someone's list by broadcasting one message
    // to a name of their choosing. Joining is an explicit act, as it is in
    // bitchat, so a message for an unknown channel is dropped.
    if (!useChatStore.getState().channels.includes(channel)) return;

    // Public channels are open to anyone in range, so a nickname there is
    // self-asserted and two peers can claim the same one. Suffixing with the
    // peer ID makes impersonation visible, and matches how names are rendered
    // in geohash channels so one person looks the same on both transports.
    const nickname = channelSenderName(
      senderID,
      this.registry.get(senderID)?.nickname,
    );

    useChatStore.getState().addMessage({
      // Shared across BLE and Nostr, so two copies of one message arriving over
      // different transports collapse to a single bubble via the chat store's
      // id dedupe.
      id: rowID(senderID),
      channel,
      senderID,
      senderNickname: nickname,
      text,
      timestampMs: packet.timestamp,
      isMine: false,
    });
  }

  // Incoming private-channel message: trial-decrypt against every channel key
  // we hold. The key that opens it identifies the channel; membership and the
  // "was I invited" check are one and the same (no key, no read). Non-members'
  // decrypt fails silently, so nothing is injected and nothing leaks.
  private onChannelEnc(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;

    // Same authenticity rule as the plaintext channel path. The sealed body
    // proves the sender holds the CHANNEL key, which every member does, so it
    // says nothing about WHICH member sent it; only the signature does.
    if (!this.senderIsAuthentic(packet, senderID)) return;
    const peer = this.registry.get(senderID);

    const channelKeys = useChatStore.getState().channelKeys;
    for (const [channel, keyB64] of Object.entries(channelKeys)) {
      const opened = openChannelMessage(keyB64, packet.payload);
      if (opened === null) continue;
      const nickname = channelSenderName(senderID, peer?.nickname);
      // The decrypt succeeding IS the membership proof, and this is the only
      // place it exists: a private channel has no roster on the wire, so who is
      // in the room can only be learned from who can open its messages.
      useChannelMembersStore.getState().noteMember(channel, senderID, nickname);
      useChatStore.getState().addMessage({
        id:
          opened.msgId.length > 0
            ? `ch-${opened.msgId}`
            : `${senderID}-${String(packet.timestamp)}-${channel}`,
        channel,
        senderID,
        senderNickname: nickname,
        text: opened.text,
        timestampMs: packet.timestamp,
        isMine: false,
      });
      return;
    }
  }

  // ---- Public API ----

  // Broadcast to a channel over every transport that channel spans.
  //
  // BLE always carries it (that's the offline guarantee). Location-scoped
  // channels ALSO publish to their geohash cell over Nostr, so someone in the
  // same city but out of Bluetooth range actually receives it, which is what
  // "#city" claimed to do all along. #bluetooth is never bridged.
  // Returns where the message actually went, so the UI can tell the user when
  // it reached nobody. Returning void hides a broadcast with zero connected
  // links behind a bubble that looks sent.
  // `nearbyOnly` keeps a public #bluetooth message radio-only: it is broadcast
  // over Bluetooth but never bridged to the internet, even while bridging is on.
  sendChannelMessage(
    channel: string,
    text: string,
    nearbyOnly = false,
  ): ChannelSendResult {
    // One ID shared by the local echo, the BLE packet and the Nostr event, so
    // a receiver on both transports sees one message rather than two.
    const msgId = newMessageId();
    const bleLinks = this.connectedLinks.size + this.wifiConnectedLinks.size;

    // Private (custom) channel: seal with its key and broadcast encrypted over
    // BLE. There is no plaintext CHANNEL_MSG path, so the content never leaves
    // the mesh in clear. If the channel's reach is "ble+nostr", the SAME sealed
    // blob is also published to Nostr so out-of-range members receive it.
    const chatState = useChatStore.getState();
    const channelKey = chatState.channelKeys[channel];
    if (channelKey !== undefined) {
      const blob = sealChannelMessage(channelKey, {
        msgId,
        senderID: this.identity.peerID,
        senderNickname: this.nickname,
        text,
      });
      this.router.sendChannelEnc(blob);
      const overNostr = chatState.channelReach[channel] === "ble+nostr";
      if (overNostr) {
        this.privateChannels?.publish(channel, channelKey, blob, msgId);
      }
      // `overNostr` is the channel's configured reach. Whether a relay is up is
      // a separate question.
      return {
        msgId,
        bleLinks,
        nostr: overNostr && this.relaysConnected,
        gateway: false,
      };
    }

    // Public channel: plaintext CHANNEL_MSG over BLE, and its geohash cell over
    // Nostr for the built-in location channels.
    //
    // A teleported cell (geohash:<gh>) is a REMOTE place: nobody in Bluetooth
    // range is in it, so a BLE broadcast would only leak the cell to neighbours
    // for no reach. It goes over Nostr only, matching bitchat's Nostr-only
    // location channels.
    const teleported = isManualGeoChannel(channel);
    // Share one timestamp with the radio packet so the bridge can derive the
    // same content-stable ID on both transports (radio-copy dedup).
    const timestampMs = Date.now();
    if (!teleported) {
      this.router.sendChannelMessage(channel, text, msgId, timestampMs);
    }
    const viaGeo =
      this.geoChannels !== null &&
      isGeoChannel(channel) &&
      this.geoChannels.geohashFor(channel) !== null;
    if (viaGeo) void this.geoChannels?.publish(channel, text, msgId);
    // `viaGeo` only says the channel resolves to a cell. Reaching the internet
    // also needs a relay up; with none, `publish` hands the signed event to a
    // gateway peer instead, and that hand-off is what to report.
    const relaysLive = viaGeo && this.relaysConnected;
    const viaGateway =
      viaGeo &&
      !relaysLive &&
      this.registry.firstReachableGateway() !== undefined;

    // Bridge the public mesh channel across islands (its own signed rendezvous
    // copy), unless the user marked this message nearby-only.
    if (channel === BRIDGE_CHANNEL) {
      this.bridgeService?.bridgeOutgoing(
        text,
        this.identity.peerID,
        timestampMs,
        nearbyOnly,
      );
    }

    return {
      msgId,
      bleLinks: teleported ? 0 : bleLinks,
      nostr: relaysLive,
      gateway: viaGateway,
    };
  }

  // Whether this peer is running Airhop rather than bitchat.
  //
  // Every Airhop announce carries a Nostr pubkey (TLV 0x07); bitchat's never
  // does, so the presence of one is the signal. Falls back to the contact record,
  // which persists the key after the registry entry expires 60 seconds behind
  // their radio going quiet.
  //
  // Used to warn before sending media bitchat cannot make use of. Deliberately
  // conservative in the useful direction: an unknown peer reads as bitchat, so
  // the warning appears rather than being silently skipped.
  peerRunsAirhop(peerID: string): boolean {
    if (this.registry.get(peerID)?.nostrPubkey !== undefined) return true;
    const contact = useContactsStore.getState().contacts[peerID];
    return contact?.nostrPubkeyHex !== undefined;
  }

  // Whether any Nostr relay is live. The channels that need the internet (region
  // and the other location cells) check this before claiming reach.
  get relaysConnected(): boolean {
    return this.nostrClient?.isConnected ?? false;
  }

  // Teleport into a geohash cell the user chose, wherever they physically are.
  // Adds it as a joined channel (persisted, and it shows under Your Rooms), then
  // refreshes so its Nostr subscription comes up immediately. Returns the
  // channel key so the caller can open the thread. The geohash is assumed
  // already validated/normalised by the caller.
  joinGeohash(geohash: string): string {
    const channel = geohashChannel(geohash);
    useChatStore.getState().addChannel(channel);
    void this.geoChannels?.refresh();
    return channel;
  }

  // If `geohash` is the cell one of the user's own location channels currently
  // resolves to, return that named channel (#city etc.). The teleport flow uses
  // this to open the existing room instead of duplicating it. Null otherwise.
  localGeoChannelFor(geohash: string): string | null {
    return this.geoChannels?.namedChannelForGeohash(geohash) ?? null;
  }

  // Our own card, ready to hand to someone we met under a location pseudonym.
  // Returns false when there is no cell bound to them (so nothing to send it
  // over) - which is the same condition the UI uses to offer the action at all.
  shareContactCardOverGeoDm(pubkey: string): boolean {
    const geohash = this.geoChannels?.geohashForGeoDmPeer(pubkey);
    if (geohash === undefined || this.geoChannels === null) return false;
    this.geoChannels.sendContactCard(
      geohash,
      pubkey,
      encodeContactCard(this.getContactCard()),
    );
    useChatStore.getState().noteGeoCardExchange(pubkey, { sentMine: true });
    this.mergeGeoThreadIfMutual(pubkey);
    return true;
  }

  // Fold a location DM into the durable conversation, but only once BOTH cards
  // have crossed.
  //
  // Merging is what moves our replies off the pseudonymous per-cell rail and
  // onto the durable one, and the durable inbox files a message by the Nostr key
  // it came from. Until they hold our card they have no way to know that key is
  // us, so crossing over early puts our messages in a second, unattributed
  // thread on their side - the very split this exists to heal. Both halves means
  // both people cross at the same moment and neither sees a fork.
  private mergeGeoThreadIfMutual(pubkey: string): void {
    const chat = useChatStore.getState();
    const exchange = chat.geoCardExchange[pubkey];
    const peerID = exchange?.theirPeerID;
    if (peerID === undefined || exchange?.sentMine !== true) return;

    const to = `dm:${peerID}`;
    chat.addChannel(to);
    // Carries the history over rather than stranding it in a thread that has
    // stopped working.
    chat.mergeChannel(`dm:nostr_${pubkey}`, to);
    // And any thread their durable key opened on its own.
    //
    // Our card takes a relay round trip to reach them, so for a few seconds
    // after we merge they are still on the pseudonymous rail while we are on the
    // durable one. A message we send in that window arrives at a client that
    // cannot yet attribute our key, and theirs can do the same to us. Folding
    // the durable-keyed thread in here is the same repair the announce path
    // already performs, applied at the moment we learn the two are one person.
    const durableKey =
      useContactsStore.getState().contacts[peerID]?.nostrPubkeyHex;
    if (durableKey !== undefined && durableKey.length > 0) {
      chat.mergeChannel(`dm:nostr_${durableKey}`, to);
    }
    chat.addMessage({
      id: `card-done-${pubkey}`,
      channel: to,
      senderID: peerID,
      senderNickname: resolveDisplayName(peerID),
      text: t("chat.geo.exchange_complete"),
      timestampMs: Date.now(),
      isMine: false,
      isSystem: true,
    });
    // The bookkeeping and the cell we met in have nobody left to serve.
    chat.clearGeoCardExchange(pubkey);
    // Anything queued against the pseudonym now has a durable route.
    this.flushOutbox(peerID);
  }

  // A contact card that arrived inside a location-channel DM.
  //
  // Routed through addVerifiedContact so it faces exactly the checks a scanned
  // one does - above all that the peer ID equals SHA-256 of the Noise key it
  // ships with. That binding is the only reason a peer ID means anything, and a
  // card is entirely attacker-shaped input: whoever we are talking to chose
  // every byte of it.
  //
  // `inPerson: false`, and the distinction matters here more than anywhere. We
  // are not looking at the other phone; we are trusting a pseudonym in a public
  // channel. So this may introduce someone new, and may never RE-PIN keys
  // already bound to a peer ID - otherwise anyone who could open a geohash DM
  // could overwrite a contact the user verified in person.
  private acceptGeoContactCard(
    card: Uint8Array,
    senderPubkey: string,
  ): string | null {
    let decoded;
    try {
      decoded = decodeContactCard(card);
    } catch {
      return null;
    }
    if (!this.addVerifiedContact(decoded, { inPerson: false })) return null;

    // A geo card is always one of ours, so this is present; the guard follows
    // the type rather than the path.
    const nostrPubkeyHex =
      decoded.nostrPubKey !== undefined
        ? bytesToHex(decoded.nostrPubKey)
        : undefined;
    const chat = useChatStore.getState();
    // Durable record, so they survive this session and are reachable over the
    // internet from anywhere. Written with `source: "geo-card"` so the contact
    // sheet can say how we came to know them.
    useContactsStore.getState().addContact({
      peerID: decoded.peerID,
      noisePubKeyHex: bytesToHex(decoded.noisePubKey),
      signingPubKeyHex: bytesToHex(decoded.signingPubKey),
      nickname: decoded.nickname,
      addedAtMs: Date.now(),
      // "link", not a source of its own: the trust is identical. The keys are
      // real and self-consistent, and nothing proves the sender owns them, since
      // a card forwards as easily as a URL.
      //
      // Safe to state flatly for someone already verified: addContact merges
      // and refuses to lower a source.
      source: "link",
      nostrPubkeyHex,
    });
    if (nostrPubkeyHex !== undefined) {
      this.nostrPubkeyToPeerID.set(nostrPubkeyHex, decoded.peerID);
    }
    chat.noteGeoCardExchange(senderPubkey, { theirPeerID: decoded.peerID });

    // Said in the pseudonymous thread, which is still where this conversation
    // lives until we answer in kind. It names the next step rather than
    // announcing a success, because half an exchange is not one: they can reach
    // us now, and we still cannot be reached back.
    chat.addMessage({
      id: `card-${senderPubkey}`,
      // Resolved for the same reason handleGeoDm resolves: this thread may
      // already have been folded away by an exchange that completed first.
      channel: chat.resolveChannel(`dm:nostr_${senderPubkey}`),
      senderID: `nostr_${senderPubkey}`,
      senderNickname: decoded.nickname,
      text: t("chat.geo.card_received", {
        name: resolveDisplayName(decoded.peerID),
      }),
      timestampMs: Date.now(),
      isMine: false,
      isSystem: true,
    });
    // A no-op unless we had already sent ours, in which case this completes it.
    this.mergeGeoThreadIfMutual(senderPubkey);
    return decoded.peerID;
  }

  // Nearby geohash channel participants, for the channel info sheet.
  getGeoParticipants(channel: string): GeoParticipant[] {
    return this.geoChannels?.participantsFor(channel) ?? [];
  }

  // Start (or resume) an encrypted geohash DM with a channel participant. Binds
  // their per-cell pubkey to this channel's geohash so a reply is sent from our
  // matching per-cell identity. The caller then opens dm:nostr_<pubkey>.
  // `displayName` is the `nick#last4` the channel renders, which is the only
  // place that name exists: a geo DM carries no nickname of its own, so without
  // carrying it over the conversation would read as "anon#last4" everywhere.
  openGeoDm(channel: string, pubkey: string, displayName?: string): void {
    const geohash = this.geoChannels?.geohashFor(channel);
    if (geohash) {
      this.geoChannels?.registerGeoDmPeer(pubkey, geohash, displayName);
    }
  }

  // The geohash a location channel currently resolves to, or null when
  // location is unavailable and the channel is therefore BLE-only.
  getChannelGeohash(channel: string): string | null {
    return this.geoChannels?.geohashFor(channel) ?? null;
  }

  // The relays carrying a cell, for the channel info sheet. Empty when the
  // Nostr transport is down (internet off), which is the honest answer: nothing
  // is carrying the cell over the internet at that point.
  getGeohashRelays(geohash: string): string[] {
    return this.geoChannels?.relaysForGeohash(geohash) ?? [];
  }

  // ---- Bulletin board ----

  // Our Ed25519 signing public key: the author key stamped on board posts, so
  // the UI can tell which notices are ours (and therefore deletable).
  get boardAuthorKey(): Uint8Array {
    return this.identity.signingPubKey;
  }

  // Ingest an incoming board post or tombstone. Flood relay already happened in
  // handleRaw, so here we verify the wire signature (the real author check,
  // since a relayed post's author is not a known peer) and hand it to the store,
  // which owns quota, expiry and de-duplication.
  private onBoardPost(packet: Packet): void {
    const wire = decodeBoardWire(packet.payload);
    if (wire === null || !verifyBoardWire(wire)) return;
    const result = useBoardStore.getState().ingest(wire);
    // Surface a genuinely new post from someone else on the notification bell
    // (and, via the bell, the room's board-icon badge). "accepted" means it was
    // not a duplicate or a rejected/expired post, so this fires once per notice.
    if (wire.kind === "post" && result === "accepted") {
      this.recordNoticeActivity(wire.post);
    }
  }

  // The channel a notice belongs to, for a tap on its bell row. The mesh board
  // (empty geohash) lives on #bluetooth; a cell maps to its named channel if the
  // user has one, else the teleport channel form.
  private channelForNoticeGeohash(geohash: string): string {
    if (geohash.length === 0) return BRIDGE_CHANNEL;
    return (
      this.geoChannels?.namedChannelForGeohash(geohash) ??
      geohashChannel(geohash)
    );
  }

  // Log a board notice on the activity feed (the bell), unless it is our own or
  // stale. The recency window keeps a fresh subscription's history replay (or a
  // gossip backfill of old posts) from flooding the bell: only notices created
  // in the last few minutes count as "new", matching how the mesh delivers a
  // live post the instant it is broadcast.
  private recordNoticeActivity(post: BoardPost): void {
    if (
      bytesToHex(post.authorSigningKey) ===
      bytesToHex(this.identity.signingPubKey)
    ) {
      return;
    }
    if (Date.now() - post.createdAt > NOTICE_BELL_WINDOW_MS) return;
    const nickname =
      post.authorNickname.length > 0 ? post.authorNickname : t("notif.someone");
    useActivityStore.getState().record({
      id: bytesToHex(post.postID),
      channel: this.channelForNoticeGeohash(post.geohash),
      isDM: false,
      senderID: bytesToHex(post.authorSigningKey),
      senderNickname: nickname,
      preview: t(isUrgent(post) ? "notif.notice_urgent" : "notif.notice", {
        content: post.content,
      }),
      timestampMs: post.createdAt,
      kind: "notice",
      geohash: post.geohash,
    });
  }

  // Post a permanent, standalone Nostr note (bitchat's geo "∞" option): a
  // location note with NO NIP-40 expiry and NO mesh board copy. It reaches
  // online readers of the cell only (there is no mesh board post to flood), and
  // is added optimistically to the local notices so the author sees it. Returns
  // false when the content is empty/oversized or no relay carried it.
  async createPermanentNote(
    content: string,
    geohash: string,
  ): Promise<boolean> {
    const trimmed = content.trim();
    if (trimmed.length === 0 || geohash.length === 0) return false;
    if (new TextEncoder().encode(trimmed).length > 512) return false;
    if (this.geoChannels === null) return false;
    const id = await this.geoChannels.publishBoardNote(
      geohash,
      trimmed,
      clampNickname(this.nickname),
      null,
      false,
    );
    return id !== null;
  }

  // Create, sign, and broadcast a board post. Returns false when the content is
  // empty or oversized. A geohash post also bridges to Nostr as a kind-1 note so
  // users who are online but out of BLE range see it.
  createBoardPost(
    content: string,
    geohash: string,
    urgent: boolean,
    expiryDays: number,
  ): boolean {
    const trimmed = content.trim();
    if (trimmed.length === 0) return false;
    if (new TextEncoder().encode(trimmed).length > 512) return false;

    const nickname = clampNickname(this.nickname);
    const createdAt = Date.now();
    const lifetimeMs = Math.min(
      Math.max(1, expiryDays) * 24 * 60 * 60 * 1000,
      7 * 24 * 60 * 60 * 1000,
    );
    const post = signBoardPost(
      {
        postID: newPostID(),
        geohash,
        content: trimmed,
        authorSigningKey: this.identity.signingPubKey,
        authorNickname: nickname,
        createdAt,
        expiresAt: createdAt + lifetimeMs,
        flags: urgent ? URGENT : 0,
      },
      this.identity.signingPrivKey,
    );

    this.broadcastBoardWire({ kind: "post", post });
    useBoardStore.getState().ingest({ kind: "post", post });

    if (geohash.length > 0 && this.geoChannels !== null) {
      void this.geoChannels
        .publishBoardNote(geohash, trimmed, nickname, post.expiresAt, urgent)
        .then((eventID) => {
          if (eventID !== null) {
            this.bridgedBoardEventIDs.set(bytesToHex(post.postID), eventID);
          }
        });
    }
    return true;
  }

  // Sign and broadcast a tombstone for one of our own posts, and retract the
  // bridged Nostr copy when we still know its event id.
  deleteBoardPost(post: BoardPost): boolean {
    if (
      !useBoardStore.getState().isOwnPost(post, this.identity.signingPubKey)
    ) {
      return false;
    }
    const deletedAt = Date.now();
    const tombstone = signBoardTombstone(
      post.postID,
      post.authorSigningKey,
      deletedAt,
      this.identity.signingPrivKey,
    );
    this.broadcastBoardWire({ kind: "tombstone", tombstone });
    useBoardStore.getState().ingest({ kind: "tombstone", tombstone });

    if (post.geohash.length > 0) {
      const idHex = bytesToHex(post.postID);
      const eventID = this.bridgedBoardEventIDs.get(idHex);
      if (eventID !== undefined) {
        this.bridgedBoardEventIDs.delete(idHex);
        void this.geoChannels?.deleteBoardNote(post.geohash, eventID);
      }
    }
    return true;
  }

  private broadcastBoardWire(wire: BoardWire): void {
    const packet: Packet = {
      type: PacketType.BOARD_POST,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: new Uint8Array(BROADCAST_ID),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload: encodeBoardWire(wire),
    };
    packet.signature = signPacket(packet, this.identity.signingPrivKey);
    this.broadcastPacket(packet);
  }

  // ---- One-time prekeys (0x24) ----

  // The greeting ANNOUNCE we are currently handing to new links, and when it
  // was minted. See the linkConnected handler for why it is held rather than
  // rebuilt.
  private greetingAnnounce: { packet: Packet; builtAtMs: number } | null = null;

  // bitchat-ios TransportConfig.swift, bleForceAnnounceMinIntervalSeconds.
  // The floor on how often a forced announce may be re-originated.
  private static readonly FORCE_ANNOUNCE_MIN_INTERVAL_MS = 150;

  private currentAnnouncePacket(): Packet {
    const held = this.greetingAnnounce;
    const now = Date.now();
    if (
      held !== null &&
      now - held.builtAtMs < MeshService.FORCE_ANNOUNCE_MIN_INTERVAL_MS
    ) {
      return held.packet;
    }
    const packet = this.announceManager.buildPacket(
      this.identity,
      this.nickname,
      [],
      hexToBytes(this.nostrPubKeyHex),
      // Capabilities and the bridge cell, exactly as the periodic announce
      // carries them.
      //
      // Omitting them here was not a smaller announce, it was a capability
      // WITHDRAWAL. An absent TLV 0x05 decodes as capabilities = 0, and the
      // registry's `entry.capabilities ?? existing` keeps 0 rather than falling
      // back, so every receiver zeroed this device's gateway and bridge bits.
      // This packet goes out on every link-up at TTL 7, so one link flap
      // anywhere in the room erased those bits mesh-wide until the next periodic
      // announce, 15 to 30 seconds later.
      //
      // Inside that window firstReachableGateway and firstReachableBridge find
      // nobody, and the cost is silent: a geohash post gives up with no retry,
      // and a bridge crossing has already stamped its dedup sets before it
      // discovers there is no bridge, so it can never cross afterwards. That is
      // the "works about half the time" in the one-phone bridge-and-gateway
      // report, and it is why the failure looked nondeterministic.
      this.localCapabilities(),
      this.bridgeService?.advertisedBridgeGeohash(),
    );
    this.greetingAnnounce = { packet, builtAtMs: now };
    return packet;
  }

  // The prekey bundle packet we are currently advertising.
  //
  // Held rather than rebuilt per send, and this is the whole point: a packet ID
  // is SHA-256 over (type | senderID | timestamp | payload), so re-minting the
  // same bundle with a fresh timestamp produces a packet that every relay in
  // the mesh treats as new and floods again. Reusing one packet makes repeated
  // emission idempotent - the second copy to reach any node is dropped by its
  // deduplicator, exactly as a re-broadcast should be.
  private prekeyBundlePacket: { packet: Packet; builtAtMs: number } | null =
    null;

  // How long one bundle packet stays current. Long enough that a room forming
  // shares a single packet ID, short enough that the dedup window (5 minutes)
  // never expires underneath it and lets an old copy re-flood.
  private static readonly PREKEY_BUNDLE_TTL_MS = 60_000;

  private currentPrekeyBundlePacket(): Packet | null {
    const held = this.prekeyBundlePacket;
    const now = Date.now();
    if (
      held !== null &&
      now - held.builtAtMs < MeshService.PREKEY_BUNDLE_TTL_MS
    ) {
      return held.packet;
    }
    const bundle = this.localPrekeys.buildBundle(
      this.identity.noiseStaticPubKey,
      this.identity.signingPrivKey,
    );
    if (bundle === null) return null;
    const payload = encodePrekeyBundle(bundle);
    if (payload === null) return null;
    const packet: Packet = {
      type: PacketType.PREKEY_BUNDLE,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: new Uint8Array(BROADCAST_ID),
      timestamp: now,
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, this.identity.signingPrivKey);
    this.prekeyBundlePacket = { packet, builtAtMs: now };
    return packet;
  }

  // Publish our signed prekey bundle so senders can seal forward-secret courier
  // mail to a one-time key. Broadcast + gossiped.
  //
  // Callers that have INVALIDATED the current bundle - a one-time key was spent
  // and senders must stop using it - pass `refresh`, which is the only case
  // that needs a new packet ID on the wire.
  private emitPrekeyBundle(refresh = false): void {
    if (refresh) this.prekeyBundlePacket = null;
    const packet = this.currentPrekeyBundlePacket();
    if (packet === null) return;
    this.broadcastPacket(packet);
  }

  // Store a peer's prekey bundle after verifying it against their
  // announce-bound signing key. Bundles from peers we have not heard announce
  // (no signing key) cannot be verified and are ignored (still relayed by the
  // flood layer for third parties).
  private onPrekeyBundle(packet: Packet): void {
    const bundle = decodePrekeyBundle(packet.payload);
    if (bundle === null) return;
    const ownerPeerID = bytesToHex(sha256(bundle.noiseStaticPublicKey)).slice(
      0,
      16,
    );
    const signingPub = this.registry.get(ownerPeerID)?.signingPubKey;
    if (signingPub === undefined) return;
    if (!verifyPrekeyBundle(bundle, signingPub)) return;
    this.peerPrekeys.ingest(bundle);
  }

  // ---- Private groups (0x25) ----

  // The GroupMember for a peer we can build a roster entry from (needs their
  // Noise + signing keys, learned from an announce or a scanned card).
  private memberFor(peerID: string): GroupMember | null {
    if (peerID === this.identity.peerID) {
      return {
        fingerprint: groupFingerprint(this.identity.noiseStaticPubKey),
        signingKey: this.identity.signingPubKey,
        nickname: this.nickname,
      };
    }
    const peer = this.registry.get(peerID);
    if (peer?.noisePubKey === undefined || peer.signingPubKey === undefined) {
      return null;
    }
    return {
      fingerprint: groupFingerprint(peer.noisePubKey),
      signingKey: peer.signingPubKey,
      nickname: peer.nickname ?? peerID.slice(0, 8),
    };
  }

  // Create a private group with the given members, store it, and send each
  // member a creator-signed invite over their Noise session. Returns the group
  // ID hex, or null when a member's keys are unknown (no session/announce yet).
  createGroup(name: string, memberPeerIDs: string[]): string | null {
    const trimmed = name.trim();
    if (trimmed.length === 0) return null;
    const self = this.memberFor(this.identity.peerID);
    if (self === null) return null;

    const members: GroupMember[] = [self];
    for (const peerID of memberPeerIDs) {
      if (peerID === this.identity.peerID) continue;
      const m = this.memberFor(peerID);
      if (m === null) return null; // cannot roster a peer we lack keys for
      members.push(m);
    }

    const group: BitchatGroup = {
      groupID: newGroupID(),
      name: trimmed,
      // Epoch starts at 1, matching bitchat's GroupStore (0 is never used on the
      // wire), so a rotation always lands on a strictly higher epoch.
      epoch: 1,
      members,
      creatorFingerprint: self.fingerprint,
    };
    const key = newGroupKey();
    const state = signGroupState(group, key, this.identity.signingPrivKey);
    if (state === null) return null;
    const stateBytes = encodeGroupState(state);
    if (stateBytes === null) return null;

    const groupIDHex = bytesToHex(group.groupID);
    useGroupStore.getState().upsertLocal(group, key);
    useChatStore.getState().addChannel(groupChannel(groupIDHex));

    // Distribute the invite to every other member over Noise. Picking a member
    // only needs their announce keys, so there may be no session yet: queue the
    // invite and start a handshake rather than dropping it, and the flush on
    // session establishment delivers it.
    for (const peerID of memberPeerIDs) {
      if (peerID === this.identity.peerID) continue;
      const delivered = this.router.sendNoisePayload(
        peerID,
        NoisePayloadType.GROUP_INVITE,
        stateBytes,
      );
      if (!delivered) {
        this.queueGroupState(peerID, NoisePayloadType.GROUP_INVITE, stateBytes);
      }
    }
    return groupIDHex;
  }

  // Route a group-state blob to a roster member by fingerprint (its first 16 hex
  // ARE the peer ID). Sends over their Noise session; if none is up yet, queues
  // it and starts a handshake so the update lands once they reconnect.
  private sendGroupStateQueued(
    peerID: string,
    type: NoisePayloadTypeValue,
    stateBytes: Uint8Array,
  ): void {
    if (this.router.sendNoisePayload(peerID, type, stateBytes)) return;
    this.queueGroupState(peerID, type, stateBytes);
  }

  // Hold a group state for a peer we cannot reach yet and start a handshake, so
  // the flush above has a session to send it on.
  private queueGroupState(
    peerID: string,
    type: NoisePayloadTypeValue,
    stateBytes: Uint8Array,
  ): void {
    queueOwedGroupState(peerID, type, stateBytes);
    this.ensureNoiseSession(peerID);
  }

  // Creator-side: add members to a group. Rotates the key (epoch + 1) on every
  // roster change, invites the new members (0x06) and key-updates the existing
  // ones (0x07), mirroring bitchat's inviteMember. Returns false when we are not
  // the creator, no valid new member remains, or the 16 cap would be exceeded.
  addGroupMembers(groupIDHex: string, memberPeerIDs: string[]): boolean {
    const group = useGroupStore.getState().get(groupIDHex);
    if (group === undefined) return false;
    const myFingerprint = groupFingerprint(this.identity.noiseStaticPubKey);
    if (group.creatorFingerprint !== myFingerprint) return false; // creator only

    const existing = new Set(group.members.map((m) => m.fingerprint));
    const additions: GroupMember[] = [];
    for (const peerID of memberPeerIDs) {
      const m = this.memberFor(peerID);
      if (m === null) continue; // keys unknown
      if (existing.has(m.fingerprint)) continue; // already a member
      if (additions.some((x) => x.fingerprint === m.fingerprint)) continue;
      additions.push(m);
    }
    if (additions.length === 0) return false;
    if (group.members.length + additions.length > GROUP_MAX_MEMBERS) {
      return false;
    }

    const members = [...group.members, ...additions];
    const updated: BitchatGroup = {
      groupID: group.groupID,
      name: group.name,
      epoch: group.epoch + 1,
      members,
      creatorFingerprint: group.creatorFingerprint,
    };
    const key = newGroupKey();
    const state = signGroupState(updated, key, this.identity.signingPrivKey);
    if (state === null) return false;
    const stateBytes = encodeGroupState(state);
    if (stateBytes === null) return false;

    useGroupStore.getState().upsertLocal(updated, key);

    const added = new Set(additions.map((m) => m.fingerprint));
    for (const m of members) {
      if (m.fingerprint === myFingerprint) continue;
      this.sendGroupStateQueued(
        m.fingerprint.slice(0, 16),
        added.has(m.fingerprint)
          ? NoisePayloadType.GROUP_INVITE
          : NoisePayloadType.GROUP_KEY_UPDATE,
        stateBytes,
      );
    }
    return true;
  }

  // Creator-side: remove a member by fingerprint. Rotates the key so the removed
  // member can no longer decrypt, key-updates every remaining member (0x07), and
  // sends the removee a creator-signed state (roster without them) carrying an
  // all-zero throwaway key so their client deactivates the group. Mirrors
  // bitchat's removeMember + notifyRemovedMember.
  removeGroupMember(groupIDHex: string, fingerprint: string): boolean {
    const group = useGroupStore.getState().get(groupIDHex);
    if (group === undefined) return false;
    const myFingerprint = groupFingerprint(this.identity.noiseStaticPubKey);
    if (group.creatorFingerprint !== myFingerprint) return false; // creator only
    if (fingerprint === group.creatorFingerprint) return false; // never the creator
    if (!group.members.some((m) => m.fingerprint === fingerprint)) return false;

    const remaining = group.members.filter(
      (m) => m.fingerprint !== fingerprint,
    );
    const rotated: BitchatGroup = {
      groupID: group.groupID,
      name: group.name,
      epoch: group.epoch + 1,
      members: remaining,
      creatorFingerprint: group.creatorFingerprint,
    };
    const key = newGroupKey();
    const state = signGroupState(rotated, key, this.identity.signingPrivKey);
    if (state === null) return false;
    const stateBytes = encodeGroupState(state);
    if (stateBytes === null) return false;

    useGroupStore.getState().upsertLocal(rotated, key);

    for (const m of remaining) {
      if (m.fingerprint === myFingerprint) continue;
      this.sendGroupStateQueued(
        m.fingerprint.slice(0, 16),
        NoisePayloadType.GROUP_KEY_UPDATE,
        stateBytes,
      );
    }

    // Removal notice, throwaway zero key: best-effort over a live session only,
    // never chasing a handshake just to tell them they're out.
    const zeroState = signGroupState(
      rotated,
      new Uint8Array(GROUP_KEY_LENGTH),
      this.identity.signingPrivKey,
    );
    const zeroBytes = zeroState === null ? null : encodeGroupState(zeroState);
    if (zeroBytes !== null) {
      this.router.sendNoisePayload(
        fingerprint.slice(0, 16),
        NoisePayloadType.GROUP_KEY_UPDATE,
        zeroBytes,
      );
    }
    return true;
  }

  // Whether we created (and can therefore administer) the given group.
  isGroupCreator(groupIDHex: string): boolean {
    const group = useGroupStore.getState().get(groupIDHex);
    if (group === undefined) return false;
    return (
      group.creatorFingerprint ===
      groupFingerprint(this.identity.noiseStaticPubKey)
    );
  }

  // A creator-signed group invite / key update arrived over Noise. Verify the
  // signature AND that the Noise peer who sent it is the group's creator, then
  // store the group and surface its channel.
  private onGroupState(body: Uint8Array, senderPeerID: string): void {
    const state = decodeGroupState(body);
    if (state === null || !verifyGroupState(state)) return;

    // The sender must be the creator: bind the state to the peer we have an
    // authenticated Noise session with, so a member cannot rebroadcast another
    // roster under a creator signature they merely relayed.
    const senderNoise = this.registry.get(senderPeerID)?.noisePubKey;
    if (senderNoise === undefined) return;
    if (groupFingerprint(senderNoise) !== state.creatorFingerprint) return;

    const myFingerprint = groupFingerprint(this.identity.noiseStaticPubKey);
    const groupIDHex = bytesToHex(state.groupID);
    const channel = groupChannel(groupIDHex);

    // What this state means for us, and in which order the questions are
    // asked. See groupStateAction: the creator pin has to come before the
    // removal branch, or anyone who has seen a group ID can evict its members.
    const held = useGroupStore.getState().get(groupIDHex);
    const action = groupStateAction(state, {
      heldCreatorFingerprint: held?.creatorFingerprint,
      myFingerprint,
    });
    if (action === "reject") return;

    // A creator-signed roster that no longer lists us is a removal: drop the
    // group's key so nothing further can be read. (The notice carries a throwaway
    // zero key, so there is nothing to keep anyway.)
    //
    // Say so before the room goes. `removeChannel` takes the whole message
    // history with it, so a silent removal makes a conversation and every
    // message in it vanish with no explanation. bitchat tells the user
    // (system.group.removed_from); this keeps
    // the thread in place, marks it read-only by virtue of having no key, and
    // leaves a system line saying what happened. The user can then delete it
    // themselves, which is the one thing they could not do before.
    if (action === "remove") {
      const name = held?.name ?? state.name;
      useGroupStore.getState().remove(groupIDHex);
      const nowMs = Date.now();
      useChatStore.getState().addMessage({
        id: `sys-group-removed-${groupIDHex}`,
        channel,
        senderID: "",
        senderNickname: "",
        text: t("chat.group.you_were_removed", { name }),
        timestampMs: nowMs,
        isMine: false,
        isSystem: true,
      });
      useActivityStore.getState().record({
        id: `group-removed-${groupIDHex}`,
        channel,
        isDM: false,
        senderID: state.creatorFingerprint.slice(0, 16),
        senderNickname: name,
        preview: t("chat.group.removed_you", { name }),
        timestampMs: nowMs,
      });
      return;
    }

    // First time we see this group is a genuine "you were added", surface it
    // as a local system notice so the new room isn't a silent surprise.
    const wasNew = held === undefined;
    useGroupStore.getState().upsertFromState(state);
    useChatStore.getState().addChannel(channel);
    if (wasNew) {
      const nowMs = Date.now();
      useChatStore.getState().addMessage({
        id: `sys-group-join-${groupIDHex}`,
        channel,
        senderID: "",
        senderNickname: "",
        text: t("chat.group.you_were_added", { name: state.name }),
        timestampMs: nowMs,
        isMine: false,
        isSystem: true,
      });
      // Ring the bell too, so the invite is found without opening the channel.
      const creator = state.members.find(
        (m) => m.fingerprint === state.creatorFingerprint,
      );
      useActivityStore.getState().record({
        id: `group-join-${groupIDHex}`,
        channel,
        isDM: false,
        senderID: state.creatorFingerprint.slice(0, 16),
        senderNickname: creator?.nickname ?? state.name,
        preview: t("chat.group.added_you", { name: state.name }),
        timestampMs: nowMs,
      });
    }
  }

  // Seal a message under the group's current epoch key and broadcast it as a
  // 0x25 packet. The caller supplies the messageID (shared with the optimistic
  // UI echo) and renders the local copy itself, so this does not echo.
  //
  // `sealed` is false only when we cannot build the packet at all: we do not hold
  // the group, or its key is gone because the creator removed us. `bleLinks` is
  // how many radios it actually went out on, which is the difference between
  // "sent" and "nobody was there".
  sendGroupMessage(
    groupIDHex: string,
    text: string,
    messageID: string,
  ): GroupSendResult {
    const group = useGroupStore.getState().get(groupIDHex);
    if (group === undefined) return { sealed: false, bleLinks: 0 };
    const payload = sealGroupMessage({
      content: text,
      messageID,
      senderNickname: this.nickname,
      senderSigningKey: this.identity.signingPubKey,
      senderSigningPrivKey: this.identity.signingPrivKey,
      timestampMs: Date.now(),
      groupID: group.groupID,
      epoch: group.epoch,
      key: group.key,
    });
    if (payload === null) return { sealed: false, bleLinks: 0 };

    const packet: Packet = {
      type: PacketType.GROUP_MESSAGE,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: new Uint8Array(BROADCAST_ID),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, this.identity.signingPrivKey);
    this.broadcastPacket(packet);
    // Report reach, not just that we sealed it. A group message is a broadcast
    // over Bluetooth only, so it faces exactly the question a channel broadcast
    // does: was anybody there. Returning a bare `true` meant the bubble showed a
    // sent tick for a group nobody was in range of, and since there are no group
    // receipts on either client (bitchat shows no delivery state for groups at
    // all) that tick was the only thing the user ever saw.
    return {
      sealed: true,
      bleLinks: this.connectedLinks.size + this.wifiConnectedLinks.size,
    };
  }

  // Group roster size, for the group chat header.
  groupMemberCount(groupIDHex: string): number {
    return useGroupStore.getState().get(groupIDHex)?.members.length ?? 0;
  }

  // Decrypt and render an incoming group message, if we hold the group and the
  // author is in its roster.
  private onGroupMessage(packet: Packet): void {
    const env = decodeGroupEnvelope(packet.payload);
    if (env === null) return;
    const group = useGroupStore.getState().getByID(env.groupID);
    if (group === undefined || group.epoch !== env.epoch) return;

    const plain = openGroupMessage(env, group.key);
    if (plain === null) return;

    // The author must be a roster member (openGroupMessage only proved they
    // hold the signing key, not that they belong to this group).
    const senderKeyHex = bytesToHex(plain.senderSigningKey);
    const member = group.members.find(
      (m) => bytesToHex(m.signingKey) === senderKeyHex,
    );
    if (member === undefined) return;

    // Both checks key off the AUTHENTICATED identity, never the outer packet's
    // senderID. A GROUP_MESSAGE is deliberately unsigned on the wire (bitchat
    // sends it that way and authenticates the signature inside the ciphertext),
    // so its senderID is attacker-controlled: keying off it let a blocked member
    // back into a group by forging the header, and made the self-echo guard
    // spoofable too. The roster fingerprint and the inner signing key are the two
    // things the crypto above actually proved.
    if (
      bytesToHex(plain.senderSigningKey) ===
      bytesToHex(this.identity.signingPubKey)
    ) {
      return; // our own echo
    }
    if (useBlockedStore.getState().isBlocked(member.fingerprint.slice(0, 16))) {
      return;
    }

    const channel = groupChannel(bytesToHex(env.groupID));
    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      id: plain.messageID,
      channel,
      senderID: member.fingerprint.slice(0, 16),
      senderNickname: plain.senderNickname || member.nickname,
      text: plain.content,
      timestampMs: Math.min(plain.timestampMs, Date.now()),
      isMine: false,
    });
  }

  // Surface an incoming FILE_TRANSFER as a receive card while its fragments
  // reassemble, so a slow transfer shows exact progress instead of appearing
  // out of nowhere. Attributed to the sender's DM thread (the common case for
  // files); the completed message still routes to its true channel. The
  // reported total is fragment-estimated and snaps to exact on finish.
  private onFragmentProgress(p: FragmentProgress): void {
    if (p.originalType !== PacketType.FILE_TRANSFER) return;
    const id = `rx-${p.key}`;
    const store = useTransferStore.getState();
    const senderHex = p.key.split("_")[0];
    if (p.received === 1 && store.transfers[id] === undefined) {
      store.begin({
        id,
        direction: "receive",
        channel: `dm:${senderHex}`,
        peerLabel:
          this.registry.get(senderHex)?.nickname ?? senderHex.slice(0, 8),
        // Real type/name are unknown until the file's TLV decodes on completion.
        type: "document",
        name: t("notif.incoming_file"),
        totalBytes: p.total * FRAG_DATA_SIZE,
        startedAtMs: Date.now(),
      });
    }
    if (p.received >= p.total) store.finish(id);
    else store.advance(id, p.receivedBytes);
  }

  // ---- Gateway carrier (0x28) ----

  // A Nostr event ferried over the mesh by a gateway. Two flows:
  //   fromGateway (broadcast): a gateway with internet rebroadcast a geohash
  //     event; surface it so mesh-only users see the channel.
  //   toGateway (directed to us): a mesh-only peer asks us to publish its event
  //     to Nostr. Only honored when this device is a gateway.
  // Either way the event is verified against its own Schnorr signature first,
  // so a relay or gateway cannot forge or alter it. The BRIDGE variants belong to
  // bitchat's mesh-island bridge subsystem (BridgeService), which Airhop does not
  // implement; they are ignored below so a bridge's fromBridge broadcast is never
  // mis-rendered as geohash chat and a toBridge deposit is never published.
  private onNostrCarrier(packet: Packet): void {
    const carrier = decodeNostrCarrier(packet.payload);
    if (carrier === null) return;
    // Bridge carriers (toBridge/fromBridge) belong to the BridgeService, which
    // does its own event verification, dedup, and rate limiting.
    if (
      carrier.direction === CarrierDirection.TO_BRIDGE ||
      carrier.direction === CarrierDirection.FROM_BRIDGE
    ) {
      this.bridgeService?.handleMeshCarrier(
        carrier,
        bytesToHex(packet.senderID),
        bytesToHex(packet.recipientID) === this.identity.peerID,
      );
      return;
    }
    // The remainder handles only the gateway directions.
    if (
      carrier.direction !== CarrierDirection.TO_GATEWAY &&
      carrier.direction !== CarrierDirection.FROM_GATEWAY
    ) {
      return;
    }

    let event: NostrEvent;
    try {
      event = JSON.parse(
        new TextDecoder().decode(carrier.eventJSON),
      ) as NostrEvent;
    } catch {
      return;
    }
    if (typeof event.id !== "string" || !verifyEvent(event)) return;

    // Loop / duplicate break: a carried event is only acted on once.
    if (this.seenCarrierEventIDs.has(event.id)) return;
    this.seenCarrierEventIDs.add(event.id);
    if (this.seenCarrierEventIDs.size > 2000) {
      const oldest = this.seenCarrierEventIDs.values().next().value;
      if (oldest !== undefined) this.seenCarrierEventIDs.delete(oldest);
    }

    if (carrier.direction === CarrierDirection.FROM_GATEWAY) {
      // Downlink: render the ferried geohash chat into its channel.
      //
      // The same three structural gates the uplink applies below, for the same
      // reason. A downlink carrier is unsigned at the packet layer by design
      // (it is a broadcast), so the only thing vouching for the payload is the
      // inner event's own Nostr signature - and that proves who wrote it, not
      // that it belongs in this room, this cell, or this moment. Without these,
      // anyone in BLE range could take any correctly signed event off a public
      // relay and have it rendered as live chat here: a months-old message
      // replayed as current, or a kind-1 note the author never posted as chat.
      // BridgeService.handleDownlink already gates its own path this way.
      if (event.kind !== GEOHASH_CHANNEL_KIND) return;
      if (!this.isFreshCarrierEvent(event)) return;
      const inCell = event.tags.some(
        (t) => t.length >= 2 && t[0] === "g" && t[1] === carrier.geohash,
      );
      if (!inCell) return;
      this.geoChannels?.ingestCarriedEvent(event);
      return;
    }

    // Uplink: publish on the sender's behalf, but only if we are a gateway and
    // the carrier is directed at us.
    if (bytesToHex(packet.recipientID) !== this.identity.peerID) return;
    if (!useSettingsStore.getState().gatewayEnabled) return;

    // Structural gate, mirroring bitchat GatewayService.structurallyValidEvent:
    // only ever publish a fresh geohash-channel note whose own #g tag matches the
    // carrier's cell. Without this the gateway is an open proxy that would relay
    // any kind, any content, to any cell on a mesh peer's say-so.
    const depositor = bytesToHex(packet.senderID);
    if (event.kind !== GEOHASH_CHANNEL_KIND) return;
    if (!this.isFreshCarrierEvent(event)) return;
    const taggedCell = event.tags.some(
      (t) => t.length >= 2 && t[0] === "g" && t[1] === carrier.geohash,
    );
    if (!taggedCell) return;

    // Authenticate the depositor: the carrier packet is signed by the mesh peer
    // that deposited it (bitchat requires this too, BLEService.handleNostrCarrier),
    // so the rate limit below keys to a real identity rather than a spoofable ID.
    // Drop if we cannot verify (no announced signing key yet, or bad signature).
    const depositorKey = this.registry.get(depositor)?.signingPubKey;
    if (depositorKey === undefined || !verifyPacket(packet, depositorKey))
      return;

    // Absorb a repeat of something already handled, before the rate limit
    // spends a token on it. bitchat guards the same cases in
    // GatewayService.handleUplinkDeposit: already published by us, or already
    // waiting in the bag.
    //
    // Deliberately NOT `seenCarrierEventIDs`. That set is bitchat's
    // `meshBroadcastEventIDs` only in spirit: theirs holds events learned from a
    // `fromGateway` BROADCAST, ours is added to at ingress for every carried
    // event in either direction, including the deposit being handled right now.
    // Checking it here rejected every uplink as a duplicate of itself and took
    // the whole gateway offline, silently, for anyone relying on it.
    if (
      this.publishedEventIDs.has(event.id) ||
      this.queuedUplinks.some((q) => q.event.id === event.id)
    ) {
      return;
    }

    // Per-depositor rate limit so one peer cannot make us flood relays.
    if (!this.allowUplinkDeposit(depositor)) return;

    // No connection right now: hold it rather than dropping it. The deposit was
    // directed at us, so nobody else is carrying a copy.
    if (!this.relaysConnected) {
      this.enqueueUplink(depositor, carrier.geohash, event);
      return;
    }

    // Record it as ours before publishing: when our own relay subscription
    // echoes it back, the downlink rebroadcaster must not push it onto the mesh
    // again (the originating peer and its neighbours already hold the BLE copy).
    this.rememberEventID(this.publishedEventIDs, event.id);
    this.geoChannels?.publishCarriedEvent(event, carrier.geohash);
  }

  // Hold a deposit for a gateway whose relays are down, within both bounds.
  // Drop-oldest rather than refuse-newest: the freshest message is the one most
  // likely to still matter when the connection returns.
  private enqueueUplink(
    depositor: string,
    geohash: string,
    event: NostrEvent,
  ): void {
    const mine = this.queuedUplinks.filter((q) => q.depositor === depositor);
    if (mine.length >= MAX_QUEUED_UPLINKS_PER_DEPOSITOR) {
      const oldest = this.queuedUplinks.findIndex(
        (q) => q.depositor === depositor,
      );
      if (oldest >= 0) this.queuedUplinks.splice(oldest, 1);
    }
    if (this.queuedUplinks.length >= MAX_QUEUED_UPLINKS) {
      this.queuedUplinks.shift();
    }
    this.queuedUplinks.push({ depositor, geohash, event });
  }

  // Publish everything held while the relays were unreachable. Called when the
  // pool reports a connection, matching bitchat's `flushQueuedUplinks` on the
  // same trigger. Events that went out by another route in the meantime are
  // skipped rather than published twice.
  flushQueuedUplinks(): void {
    if (!useSettingsStore.getState().gatewayEnabled) return;
    if (!this.relaysConnected || this.queuedUplinks.length === 0) return;
    const queued = this.queuedUplinks;
    this.queuedUplinks = [];
    for (const item of queued) {
      if (this.publishedEventIDs.has(item.event.id)) continue;
      this.rememberEventID(this.publishedEventIDs, item.event.id);
      this.geoChannels?.publishCarriedEvent(item.event, item.geohash);
    }
  }

  // Consume a per-depositor token from a 60s sliding window. Returns false when
  // the depositor is over quota. Mirrors bitchat GatewayService.allowUplinkDeposit.
  private allowUplinkDeposit(depositor: string): boolean {
    const now = Date.now();
    const times = (this.uplinkDepositTimes.get(depositor) ?? []).filter(
      (t) => now - t < 60_000,
    );
    if (times.length >= UPLINK_EVENTS_PER_MINUTE_PER_DEPOSITOR) {
      this.uplinkDepositTimes.set(depositor, times);
      return false;
    }
    times.push(now);
    this.uplinkDepositTimes.set(depositor, times);
    // Bound the tracker against a churn of spoofed/one-shot depositor IDs.
    if (this.uplinkDepositTimes.size > 512) {
      for (const [id, ts] of this.uplinkDepositTimes) {
        const live = ts.filter((t) => now - t < 60_000);
        if (live.length === 0) this.uplinkDepositTimes.delete(id);
        else this.uplinkDepositTimes.set(id, live);
      }
    }
    return true;
  }

  // ---- Gateway origination (0x28) ----

  // Uplink: relays were unreachable for one of our own geohash posts. If a
  // nearby peer advertises the gateway capability, ferry the signed event to it
  // in a directed, signed toGateway carrier so it can publish on our behalf. The
  // carrier floods toward the gateway (it may be several hops away), matching
  // bitchat's sendNostrCarrier -> broadcastPacket.
  private uplinkGeohashEvent(event: NostrEvent, geohash: string): void {
    const gateway = this.registry.firstReachableGateway();
    if (gateway === undefined) return;
    // Never re-uplink an event we learned over the mesh: only our own fresh
    // posts should be ferried. (Our posts are not in seenCarrierEventIDs.)
    if (this.seenCarrierEventIDs.has(event.id)) return;
    const payload = encodeNostrCarrier({
      direction: CarrierDirection.TO_GATEWAY,
      geohash,
      eventJSON: new TextEncoder().encode(JSON.stringify(event)),
    });
    if (payload === null) return;
    // Directed + signed: the gateway keys its uplink quotas to an authenticated
    // depositor, so bitchat gateways require the packet signature to verify. The
    // inner event carries its own Schnorr signature.
    this.sendDirectedCarrier(payload, gateway.peerID);
  }

  // Downlink: every event our own geohash-channel relay subscription delivers is
  // offered here. When this device is a gateway we wrap fresh, genuinely inbound
  // relay events in a fromGateway broadcast carrier so mesh-only peers see the
  // channel. Mirrors bitchat GatewayService.rebroadcastRelayEvent, including its
  // loop rules. The per-minute airtime budget is a simple sliding window; on
  // overflow the event is dropped, NOT queued (bitchat queues + drains on a
  // timer). Because kind-20000 is ephemeral, relays generally do not redeliver,
  // so an overflow drop is a genuine loss for mesh-only peers in that cell. This
  // is an accepted trade-off: it only bites a single cell sustaining more than
  // DOWNLINK_EVENTS_PER_MINUTE, and it keeps BLE airtime bounded without a queue.
  private rebroadcastRelayEvent(event: NostrEvent, geohash: string): void {
    if (!useSettingsStore.getState().gatewayEnabled) return;
    if (event.kind !== GEOHASH_CHANNEL_KIND) return;
    // Freshness + geohash gate before spending any budget: a (re)subscribe
    // backfills up to an hour, but receivers drop anything older than the same
    // window, so ferrying backfill would burn airtime on events no one accepts.
    if (!this.isFreshCarrierEvent(event)) return;
    const tagged = event.tags.some(
      (t) => t.length >= 2 && t[0] === "g" && t[1] === geohash,
    );
    if (!tagged) return;
    // Loop rules: never ferry a mesh-carried event (seenCarrierEventIDs), an
    // event we ourselves uplinked (publishedEventIDs), or one already ferried
    // (rebroadcastEventIDs).
    if (
      this.seenCarrierEventIDs.has(event.id) ||
      this.publishedEventIDs.has(event.id) ||
      this.rebroadcastEventIDs.has(event.id)
    ) {
      return;
    }
    if (!verifyEvent(event)) return;

    // Airtime budget: at most DOWNLINK_EVENTS_PER_MINUTE ferries in any 60s.
    const now = Date.now();
    this.downlinkSendTimes = this.downlinkSendTimes.filter(
      (t) => now - t < 60_000,
    );
    if (this.downlinkSendTimes.length >= DOWNLINK_EVENTS_PER_MINUTE) {
      // Over budget: drop, leaving the event unmarked. It is not requeued, so on
      // an ephemeral cell this is a loss (see the note above); leaving it unmarked
      // only preserves the rare chance a relay redelivers it while budget is free.
      return;
    }

    const payload = encodeNostrCarrier({
      direction: CarrierDirection.FROM_GATEWAY,
      geohash,
      eventJSON: new TextEncoder().encode(JSON.stringify(event)),
    });
    if (payload === null) return;
    this.broadcastCarrier(payload);
    // Mark only after an actual send, so an over-budget drop above is never
    // recorded as rebroadcast.
    this.rememberEventID(this.rebroadcastEventIDs, event.id);
    this.downlinkSendTimes.push(now);
  }

  private isFreshCarrierEvent(event: NostrEvent): boolean {
    return (
      Math.abs(Date.now() / 1000 - event.created_at) <=
      CARRIER_MAX_EVENT_AGE_SECONDS
    );
  }

  // Insertion-ordered, capped id set (drop-oldest), matching seenCarrierEventIDs.
  private rememberEventID(set: Set<string>, id: string): void {
    set.add(id);
    if (set.size > 2000) {
      const oldest = set.values().next().value;
      if (oldest !== undefined) set.delete(oldest);
    }
  }

  // ---- Mesh diagnostics (ping / pong) ----

  // Send a directed echo request to a peer and resolve with its round-trip
  // latency and hop count, or null if no pong arrives within the timeout. The
  // ping floods toward the target (it may be several hops away); only the named
  // recipient answers.
  sendMeshPing(peerID: string): Promise<MeshPingResult | null> {
    return new Promise((resolve) => {
      const nonce = newPingNonce();
      const nonceHex = bytesToHex(nonce);
      const packet: Packet = {
        type: PacketType.PING,
        ttl: MESH_PING_TTL,
        flags: Flags.HAS_RECIPIENT, // unsigned, directed
        senderID: hexToBytes(this.identity.peerID),
        recipientID: hexToBytes(peerID),
        timestamp: Date.now(),
        signature: new Uint8Array(64),
        payload: encodeMeshPing({ nonce, originTTL: MESH_PING_TTL }),
      };
      const timer = setTimeout(() => {
        const pending = this.pendingPings.get(nonceHex);
        if (pending !== undefined) {
          this.pendingPings.delete(nonceHex);
          pending.resolve(null);
        }
      }, MESH_PING_TIMEOUT_MS);
      this.pendingPings.set(nonceHex, {
        peerID,
        sentAtMs: Date.now(),
        resolve,
        timer,
      });
      this.broadcastPacket(packet);
    });
  }

  // Answer a ping addressed to us with a pong echoing its nonce. Pings addressed
  // elsewhere are already flood-relayed toward their target in handleRaw.
  private onPing(packet: Packet, linkID: string): void {
    if (bytesToHex(packet.recipientID) !== this.identity.peerID) return;
    const ping = decodeMeshPing(packet.payload);
    if (ping === null) return;

    // Anti-amplification: cap the pong rate per physical link. Pings are
    // unsigned, so keying on the claimed sender would let one link forge sender
    // IDs to emit unbounded pongs; the ingress link is the real identity.
    const now = Date.now();
    const last = this.lastPongAtByLink.get(linkID) ?? 0;
    if (now - last < MESH_PONG_MIN_INTERVAL_MS) return;
    this.lastPongAtByLink.set(linkID, now);

    const pong: Packet = {
      type: PacketType.PONG,
      ttl: MESH_PING_TTL,
      flags: Flags.HAS_RECIPIENT,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: packet.senderID.slice(),
      timestamp: now,
      signature: new Uint8Array(64),
      payload: encodeMeshPing({ nonce: ping.nonce, originTTL: MESH_PING_TTL }),
    };
    this.broadcastPacket(pong);
  }

  // Resolve a pong against its outstanding probe. The unguessable echoed nonce
  // plus the sender check bind the reply to the peer we probed; hops come from
  // the pong's TTL decrements on the return path.
  private onPong(packet: Packet): void {
    if (bytesToHex(packet.recipientID) !== this.identity.peerID) return;
    const pong = decodeMeshPing(packet.payload);
    if (pong === null) return;
    const nonceHex = bytesToHex(pong.nonce);
    const pending = this.pendingPings.get(nonceHex);
    if (pending === undefined) return;
    if (pending.peerID !== bytesToHex(packet.senderID)) return;
    this.pendingPings.delete(nonceHex);
    clearTimeout(pending.timer);
    pending.resolve({
      rttMs: Math.max(0, Date.now() - pending.sentAtMs),
      hops: pingHopCount(pong.originTTL, packet.ttl),
    });
  }

  // Re-resolve position and re-subscribe geo channels. Called on pull-to-refresh
  // and after the user joins a new location channel.
  refreshGeoChannels(): void {
    void this.geoChannels?.refresh();
  }

  // Cancel an in-flight attachment transfer (sending or receiving) by its id.
  cancelTransfer(transferId: string): void {
    this.fileXfer.cancel(transferId);
  }

  // Send a DM, queueing it for later delivery if no route exists right now.
  //
  // `messageID` ties the queued copy back to the ChatMessage the UI already
  // rendered, so a later flush can mark that exact bubble delivered. Omit it for
  // internal resends (flushOutbox passes the original id back in).
  sendDm(
    recipientPeerID: string,
    text: string,
    messageID?: string,
  ): "sent" | "sent-nostr" | "needs-courier" | "queued" {
    // A stable id for this message, reused across the mesh envelope, the outbox,
    // and any retry, so a delivery receipt can always be matched to it.
    const msgID = messageID ?? newMessageId();
    // A Nostr-only correspondent (we've never heard their ANNOUNCE, so we have
    // no peerID for them). There is no mesh route to look up, so reply over the
    // same transport their message arrived on.
    if (recipientPeerID.startsWith("nostr_")) {
      const pubkey = recipientPeerID.slice("nostr_".length);
      // A geohash-DM peer is reached from our per-cell identity over the cell's
      // relays; everyone else over our main Nostr identity.
      const geohash = this.geoChannels?.geohashForGeoDmPeer(pubkey);
      const sent =
        geohash !== undefined
          ? (this.geoChannels?.sendGeoDm(geohash, pubkey, msgID, text) ?? false)
          : this.publishNostrDm(pubkey, msgID, text, recipientPeerID);
      if (sent) {
        return "sent-nostr";
      }
      // Offline: queue it, keyed by the same identifier so a later flush
      // resolves to this branch again once relays are reachable. A Nostr-only
      // peer has no mesh key, so nothing can courier it: it is queued, not
      // carried.
      useOutboxStore.getState().enqueue({
        id: msgID,
        recipientPeerID,
        channel: `dm:${recipientPeerID}`,
        text,
        createdAtMs: Date.now(),
      });
      return "queued";
    }

    // Whether the mesh could deliver this without guessing. A flood has no
    // acknowledgement, so "we sent it into the mesh" and "they got it" are not
    // the same claim.
    const hadDirectLink =
      this.peerToLink.has(recipientPeerID) ||
      this.wifiPeerToLink.has(recipientPeerID);

    const result = this.trySendDm(recipientPeerID, text, msgID);

    // A DM with no direct link is FLOODED and hoped for: any neighbour makes
    // `canReachMesh` true, so the packet goes out at TTL 7 and trySendDm
    // reports "sent". If the recipient is not actually within those seven hops
    // - they walked out of the building, they are asleep in a bag - nothing
    // ever says so. The message was reported sent, was never queued, and was
    // gone for good the moment it failed to land.
    //
    // Queue it as well. A flood that DID land is resolved by the delivery
    // receipt, and if a retry goes out anyway the recipient collapses it by
    // message id, which is the same dedupe the courier path already relies on.
    // The cost of a redundant queue entry is nothing; the cost of the old
    // behaviour was a lost message under a confident tick.
    // Queue whenever delivery is not established. Two cases, one rule:
    //
    //   handshaking  nothing has gone out yet; the session does not exist
    //   sent + no direct link  it was FLOODED at TTL 7 with nothing to
    //                          acknowledge it, so "sent" means "it left the
    //                          device", not "they have it"
    //
    // A delivery receipt resolves the entry, so a message that really did land
    // stops being retried the moment the recipient says so.
    if (result === "handshaking" || (result === "sent" && !hadDirectLink)) {
      useOutboxStore.getState().enqueue({
        id: msgID,
        recipientPeerID,
        channel: `dm:${recipientPeerID}`,
        text,
        createdAtMs: Date.now(),
      });
    }
    if (result === "handshaking") return "queued";

    if (result === "needs-courier") {
      // No direct route. Hand a sealed copy to the mesh so any peer that meets
      // the recipient can deliver it, AND keep our own copy queued in case they
      // simply walk back to us. The two paths are complementary, and the
      // recipient dedupes by message id if both arrive.
      const carried = this.sendViaCourier(recipientPeerID, text, msgID);
      // Genuinely queue it. Dropping it here while the UI says "queued for
      // delivery" loses the message for good, even if the peer reappears
      // moments later.
      useOutboxStore.getState().enqueue({
        id: msgID,
        recipientPeerID,
        channel: `dm:${recipientPeerID}`,
        text,
        createdAtMs: Date.now(),
      });
      // "carried" only when a courier actually took a sealed copy (we hold the
      // recipient's Noise key); otherwise it is merely queued locally.
      return carried ? "needs-courier" : "queued";
    }
    return result;
  }

  // Attempt delivery over the best available transport, without queueing.
  private trySendDm(
    recipientPeerID: string,
    text: string,
    msgID: string,
  ): "sent" | "sent-nostr" | "needs-courier" | "handshaking" {
    // Priority 1: Double Ratchet over a direct link (Airhop-to-Airhop only).
    // DR adds per-message forward secrecy on top of the Noise transport. Every
    // path carries the message id and supports delivery/read receipts: DR via
    // its own envelope, Noise via the bitchat PrivateMessagePacket, and Nostr
    // via the bitchat1 envelope. DR is preferred purely for the extra secrecy.
    const drState = this.drStates.get(recipientPeerID);
    const hasDirectLink =
      this.peerToLink.has(recipientPeerID) ||
      this.wifiPeerToLink.has(recipientPeerID);
    // A directed encrypted packet reaches the peer over the mesh either by a
    // direct link (unicast) or, lacking one, by flooding through a neighbour who
    // relays it on (multi-hop, bitchat-style). With no direct link AND no
    // neighbour to relay through, the mesh cannot help, so we fall to Nostr.
    // Both radios. This counted the BLE set alone, so a phone whose only
    // neighbours were on the WiFi fast path skipped all three mesh priorities:
    // priority 3 spent the internet on a hop it could make itself, and priority
    // 2 never started a Noise handshake, so a first-contact DM to a WiFi-only
    // neighbour could not establish a session. Same shape as the bug recorded in
    // broadcastFn; every other link test in this file sums the two.
    const canReachMesh =
      hasDirectLink ||
      this.connectedLinks.size + this.wifiConnectedLinks.size > 0;
    // Same gate as the receipt path: a ratchet that has not yet been given a
    // sending chain cannot encrypt, and the Noise transport below is a fully
    // valid route in the meantime. Falling through costs this one message its
    // per-message forward secrecy; throwing would cost the user their message
    // and surface as an exception inside the composer.
    if (drState !== undefined && canEncrypt(drState) && canReachMesh) {
      this.sendDRMessage(
        recipientPeerID,
        encodeDmMessage(msgID, text),
        drState,
      );
      return "sent";
    }

    // Priority 2: Noise XX handshake when we can reach the peer over the mesh
    // but have no session yet. Gated on canReachMesh (not a direct link), so a
    // peer reachable only multi-hop still gets a handshake: msg1 is a
    // recipient-addressed, TTL-7 packet FLOODED via unicastFn, exactly as
    // bitchat does (BLEService.broadcastPacket for the handshake init). Every
    // relay forwards it and only the addressee acts on it; the msg2/msg3 replies
    // flood back the same way (see onNoiseHandshake).
    const peer = this.registry.get(recipientPeerID);
    if (peer !== undefined && peer.session === undefined && canReachMesh) {
      const existing = this.activeHandshake(recipientPeerID);
      if (existing) {
        existing.pendingText.push({ messageID: msgID, text });
      } else {
        const hs = NoiseHandshake.createInitiator(
          this.identity.noiseStaticPrivKey,
        );
        const msg1 = hs.writeMsg1();
        this.pendingHandshakes.set(recipientPeerID, {
          handshake: hs,
          role: "initiator",
          pendingText: [{ messageID: msgID, text }],
          startedAt: Date.now(),
        });
        const pkt = this.makeHandshakePacket(hexToBytes(recipientPeerID), msg1);
        this.unicastFn(recipientPeerID, pkt);
      }
      // NOT "sent". Nothing carrying the user's words has left the device: a
      // handshake has been started and the text is being held against it.
      //
      // Reporting "sent" here was how a first-contact DM went missing. The text
      // lived only in `pendingHandshakes[peer].pendingText`, which is in-memory
      // and is discarded when a stuck handshake is reaped after 30s or when the
      // process restarts. If the peer walked away before answering, the message
      // was gone and the sender had been shown a confident tick.
      //
      // The caller enqueues on this, so the handshake keeps its fast path (the
      // pending text goes out the moment the session completes) and the outbox
      // is the durable backstop. Both carry the same message id, so the
      // recipient collapses them if both arrive.
      return "handshaking";
    }

    // Priority 3: an established Noise session over the mesh. Comes BEFORE the
    // internet on purpose: when a radio already reaches this peer (directly, or
    // multi-hop through a neighbour), using a relay instead would spend data and
    // hand a third party the metadata for a hop we can make ourselves. The
    // messageID rides inside the bitchat PrivateMessagePacket so receipts resolve
    // to the right bubble.
    //
    // Gated on `canReachMesh` like Priority 1: the packet is recipient-addressed
    // and TTL-bounded, so with no direct link the unicast floods it for a relay
    // to carry (multi-hop). With no direct link AND no neighbour, the mesh can't
    // help, so this is skipped and Nostr takes over.
    if (peer?.session !== undefined && canReachMesh) {
      // Only "sent" means it actually went out. A payload too long for one
      // PrivateMessagePacket falls through to the options below.
      if (this.router.sendDm(recipientPeerID, text, msgID) === "sent") {
        return "sent";
      }
    }

    // Priority 4: Nostr gift-wrap DM over the internet, for a peer no radio
    // reaches. Use the registry npub if the peer is still fresh, else the
    // DURABLE contact npub, which is the whole point: reach someone the
    // registry has already forgotten (they left Bluetooth range, or we met them
    // only by QR and never over BLE at all). Doing this here, in the service
    // layer, is what makes both a first send and an outbox flush use the
    // internet fallback, since the router only ever sees the ephemeral registry.
    const nostrPubkey = recipientPeerID.startsWith("nostr_")
      ? recipientPeerID.slice("nostr_".length)
      : (this.registry.get(recipientPeerID)?.nostrPubkey ??
        useContactsStore.getState().getContact(recipientPeerID)
          ?.nostrPubkeyHex);
    if (
      nostrPubkey !== undefined &&
      nostrPubkey.length > 0 &&
      this.publishNostrDm(nostrPubkey, msgID, text, recipientPeerID)
    ) {
      return "sent-nostr";
    }

    // Priority 5: nothing reached them now, so hand it to the courier layer.
    return "needs-courier";
  }

  // Publish a gift-wrapped DM to relays, wrapped in bitchat's `bitchat1:`
  // envelope so a bitchat client can parse it (and we can parse theirs). Returns
  // false when there is no Nostr client (offline) or the content is longer than
  // one PrivateMessagePacket, so callers fall back to queueing. The single place
  // the service seals a DM for Nostr, so the nostr_ reply path, the durable
  // fallback, and any future caller stay identical.
  private publishNostrDm(
    recipientPubkeyHex: string,
    messageID: string,
    text: string,
    outboxPeerID?: string,
  ): boolean {
    if (this.nostrClient === null) return false;
    // No embedded recipient peer ID: we only know the Nostr pubkey, not the
    // peer's mesh ID, exactly as bitchat's geohash DMs do.
    const envelope = encodeBitchatDmEnvelope(
      this.identity.peerID,
      null,
      messageID,
      text,
    );
    if (envelope === null) return false;
    const { event } = wrapDm(envelope, this.nostrPrivKey, recipientPubkeyHex);
    void this.nostrClient.publish(event).catch(() => {
      // No relay accepted it (all rejected, or timed out with no ACK). We
      // already returned an optimistic "sent-nostr", so park it in the outbox
      // for the internet-retry sweep instead of losing it. On success this
      // never runs, so a delivered message is not re-queued; the receiver
      // dedupes by message id if a later resend does land twice.
      if (outboxPeerID !== undefined) {
        useOutboxStore.getState().enqueue({
          id: messageID,
          recipientPeerID: outboxPeerID,
          channel: `dm:${outboxPeerID}`,
          text,
          createdAtMs: Date.now(),
        });
      }
    });
    return true;
  }

  // Publish a delivery/read receipt for a Nostr DM back to the sender's pubkey,
  // in bitchat's envelope format.
  private publishNostrAck(
    recipientPubkeyHex: string,
    type:
      typeof NoisePayloadType.DELIVERED | typeof NoisePayloadType.READ_RECEIPT,
    messageID: string,
  ): void {
    if (this.nostrClient === null) return;
    const envelope = encodeBitchatAckEnvelope(
      this.identity.peerID,
      null,
      type,
      messageID,
    );
    const { event } = wrapDm(envelope, this.nostrPrivKey, recipientPubkeyHex);
    void this.nostrClient.publish(event).catch(() => {});
  }

  // Encrypt and send a Double Ratchet message to a peer with a direct link.
  private sendDRMessage(
    peerID: string,
    payload: Uint8Array,
    state: RatchetState,
  ): void {
    const ciphertext = ratchetEncrypt(state, payload);
    const pkt: Packet = {
      type: PacketType.DR_ENCRYPTED,
      ttl: 7,
      flags: Flags.HAS_RECIPIENT | Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: hexToBytes(peerID),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload: ciphertext,
    };
    pkt.signature = signPacket(pkt, this.identity.signingPrivKey);
    this.unicastFn(peerID, pkt);
  }

  // Send a file attachment over the mesh. Chunks the bytes into 64 KB FILE_TRANSFER
  // packets, fragments each to 469 bytes, and routes via unicast (DM) or broadcast
  // (channel). The receiver reconstructs, saves to cache, and adds a ChatMessage.
  //
  // Media rides BLE only (never Nostr), so returns whether a route exists right
  // now: for a DM, a direct link to that peer; for a channel, any live link.
  // The reach is checked BEFORE starting the transfer, so an unreachable send
  // never spins up a progress card that would falsely reach 100%. False means it
  // went nowhere, so the caller surfaces that instead of a confident "sent"
  // (the text path reports reach the same way); the user can retry when a link
  // returns.
  sendAttachment(
    channel: string,
    bytes: Uint8Array,
    meta: AttachmentMeta,
    onOutcome?: SendOutcome,
  ): boolean {
    const reached = channel.startsWith("dm:")
      ? this.peerToLink.has(channel.slice(3)) ||
        this.wifiPeerToLink.has(channel.slice(3))
      : this.connectedLinks.size + this.wifiConnectedLinks.size > 0;
    if (!reached) return false;
    this.fileXfer.sendBytes(bytes, meta, channel, onOutcome);
    return true;
  }

  // ---- Payment helpers (used by wallet feature layer) ----

  // The local peer ID derived from the noise public key.
  getPeerID(): string {
    return this.identity.peerID;
  }

  // Expose the active Nostr client so the wallet can publish nutzap events
  // and query recipient wallet info without duplicating the client.
  getNostrClient(): NostrClient | null {
    return this.nostrClient;
  }

  // The secp256k1 private key used to sign Nostr events (DMs, nutzaps).
  getNostrPrivKey(): Uint8Array {
    return this.nostrPrivKey;
  }

  // Our Nostr public key hex (secp256k1), announced in ANNOUNCE packets.
  getNostrPubKeyHex(): string {
    return this.nostrPubKeyHex;
  }

  // Return the Nostr pubkey of a known peer (populated from their ANNOUNCE),
  // or undefined if the peer has not announced one.
  getPeerNostrPubkey(peerID: string): string | undefined {
    return this.registry.get(peerID)?.nostrPubkey;
  }

  // Whether a radio link to this peer exists right now.
  //
  // Deliberately the strict test (`peerToLink`/`wifiPeerToLink`), not the looser
  // `canReachMesh` that `trySendDm` uses to decide whether flooding is worth
  // attempting. A flood is a hope; a direct link is a route. The payment layer
  // uses this to decide whether the person is near enough that the radio is
  // plainly the right rail, so guessing in either direction is worse than the
  // narrow answer: a false positive would route money at a peer we cannot
  // actually reach, and a false negative only costs a mint round trip.
  hasDirectLink(peerID: string): boolean {
    return this.peerToLink.has(peerID) || this.wifiPeerToLink.has(peerID);
  }

  // The local identity as a shareable contact card, for QR exchange.
  // Includes the public keys so a scanner can verify the peerID binding and
  // start an encrypted session without first hearing our ANNOUNCE.
  getContactCard(): ContactCard {
    return {
      peerID: this.identity.peerID,
      noisePubKey: this.identity.noiseStaticPubKey,
      signingPubKey: this.identity.signingPubKey,
      nickname: this.nickname,
      // Every card carries our Nostr pubkey so a scanner can reach us over the
      // internet without ever having met us on Bluetooth.
      nostrPubKey: hexToBytes(this.nostrPubKeyHex),
    };
  }

  // Register an identity learned out-of-band (QR) so a DM route can be
  // set up without waiting to hear the peer's ANNOUNCE.
  //
  // Returns false if the card is self-inconsistent. The peerID MUST equal
  // SHA-256(noisePubKey)[0:8]. That binding is the whole reason a peer ID is
  // trustworthy, and bitchat-iOS rejects announces on exactly this check
  // (`senderMismatch`). Without it a forged QR could claim someone else's peer
  // ID while supplying attacker-controlled keys, and every DM the user then
  // "sent to that contact" would be encrypted to the attacker instead.
  // `inPerson` says the card came off a camera, i.e. the user was physically
  // looking at the other phone. Only that earns the right to re-pin keys, so it
  // defaults to false: a card that arrived some other way (an airhop:// link
  // tapped in a browser or a message) proves nothing about who sent it, and
  // must not be able to overwrite a key already bound to that peer.
  //
  // Without the distinction the TOFU pin in PeerRegistry.update was bypassable
  // by anyone who could get a link in front of the user. A peer ID is
  // SHA-256(noise pubkey), and that key is public, so an attacker can build a
  // card carrying a victim's real peer ID and noise key - passing the binding
  // check below - while substituting their own SIGNING key. Announce-level
  // pinning refuses exactly that; a "trusted" link would have waved it through.
  addVerifiedContact(
    card: {
      peerID: string;
      noisePubKey: Uint8Array;
      signingPubKey: Uint8Array;
      nickname: string;
      nostrPubKey?: Uint8Array;
    },
    opts: { inPerson?: boolean } = {},
  ): boolean {
    const derived = bytesToHex(sha256(card.noisePubKey)).slice(0, 16);
    if (derived !== card.peerID.toLowerCase()) return false;

    const nostrPubkeyHex = card.nostrPubKey
      ? bytesToHex(card.nostrPubKey)
      : undefined;

    // Seed the routing registry so sendDm can pick a transport immediately.
    // Note this does NOT touch peer-store: being a contact is not evidence of
    // being nearby, and the Mesh tab must keep meaning "in range right now".
    this.registry.update({
      peerID: card.peerID,
      noisePubKey: card.noisePubKey,
      signingPubKey: card.signingPubKey,
      nickname: card.nickname,
      nostrPubkey: nostrPubkeyHex,
      // A SCANNED contact card is an in-person, out-of-band exchange, so it
      // outranks the TOFU pin an over-the-air announce established and is
      // allowed to re-pin. Without this, a peer whose keys were first learned
      // from a spoofed announce could never be corrected by meeting them. A
      // card that arrived any other way gets no such standing.
      trusted: opts.inPerson === true,
    });

    // A v2 card carries the peer's Nostr pubkey. Map it for inbound replies now,
    // so a gift-wrapped answer folds into this thread even before any ANNOUNCE.
    // (The contact record itself is written by the QR flow with the same key.)
    if (nostrPubkeyHex) {
      this.nostrPubkeyToPeerID.set(nostrPubkeyHex, card.peerID);
    }

    // They may already be in range, and if so anything queued goes now.
    this.flushOutbox(card.peerID);
    return true;
  }

  // Retry everything queued for a peer that just became reachable.
  //
  // Called from onAnnounce (they're back in radio range or newly known) and
  // after a Noise/Double-Ratchet session is established (an encrypted route
  // now exists where there wasn't one). Each message is dequeued optimistically
  // and re-queued only if delivery still fails, so a flush can never duplicate
  // a message that did go out.
  // Tell the composer about mail the queue has given up on.
  //
  // Eviction is never silent. An entry vanishing past its TTL while its bubble
  // keeps the "waiting to send" hourglass forever is exactly the silent-loss
  // shape the outbox exists to prevent. A message that is never
  // going out has to say so, the same way a refused send does, so the user can
  // decide to try another way.
  private reportDroppedMail(dropped: PendingMessage[]): void {
    // Anything leaving the queue takes its courier record with it, so the map
    // cannot grow for the life of the process.
    for (const msg of dropped) this.courieredTo.delete(msg.id);
    if (dropped.length === 0) return;
    const chat = useChatStore.getState();
    for (const msg of dropped) {
      chat.setMessageStatus(msg.channel, msg.id, "failed");
    }
  }

  private flushOutbox(peerID: string): void {
    const outbox = useOutboxStore.getState();
    this.reportDroppedMail(outbox.evictExpired());
    const queued = outbox.forPeer(peerID);
    if (queued.length === 0) return;

    for (const msg of queued) {
      // Reuse the queued id so the retried send keeps the same message id, and
      // a delivery receipt still lands on the original bubble.
      const hadDirectLink =
        this.peerToLink.has(peerID) || this.wifiPeerToLink.has(peerID);
      const result = this.trySendDm(peerID, msg.text, msg.id);
      // A blind flood is not a delivery. Without a direct link the packet goes
      // out at TTL 7 with nothing to acknowledge it, so treat this exactly like
      // "no route": record the attempt and KEEP it queued. Resolving here on a
      // hopeful "sent" is what made the queue useless - the periodic sweep
      // would flood into an empty room, clear the entry, and the message was
      // gone before the recipient ever came back.
      // Keep it queued whenever the retry did not establish delivery:
      //
      //   handshaking  the session still does not exist; the text is only
      //                being held against a handshake that may never answer
      //   sent + no direct link  it was flooded at TTL 7 with nothing to
      //                          acknowledge it
      //
      // Resolving on either of these is what made the queue useless: the sweep
      // would flood into an empty room, clear the entry, and the message was
      // gone before the recipient ever came back. A delivery receipt is what
      // clears it now.
      if (result === "handshaking" || (result === "sent" && !hadDirectLink)) {
        outbox.markAttempted(msg.id);
        continue;
      }
      if (result === "needs-courier") {
        // No route, so nothing left the device. Deliberately NOT counted as an
        // attempt.
        //
        // An attempt has to mean "this went on a wire and nobody acknowledged
        // it", not "the sweep ran". Counting this branch tied the budget to the
        // 45-second timer instead of to delivery opportunities, which turned the
        // seven-day retry window into about eighteen minutes: someone who walked
        // out of range for twenty minutes had their message dropped, and the
        // counter persists across relaunches so the budget was cumulative too.
        //
        // Try to courier it again before giving up on this pass.
        //
        // sendViaCourier ran once, at compose time, and that was the only call
        // site. A message written with no couriers in range therefore returned
        // false and was NEVER couriered again, even if a carrier walked in five
        // seconds later - only the direct and Nostr retries survived, and
        // neither reaches a recipient who is out of range of both. bitchat
        // solves this with courierBecameAvailable; the sweep is our equivalent
        // hook, and it already runs on exactly the events that matter (a peer
        // appearing, a resume, a reconnect).
        //
        // Cheap when it cannot help: it returns false immediately with no
        // couriers, and the recipient dedupes redundant copies by message id.
        this.sendViaCourier(peerID, msg.text, msg.id);
        // A peer with no route now will not have one for the rest of this batch
        // either, so stop walking it.
        break;
      }
      // The bubble has been showing the queued hourglass since the original
      // send. It has now genuinely left the device, so say so here rather than
      // leaving the correction to a delivery receipt: a receipt that never
      // arrives (older peer, dropped ack, a slow relay round trip) would leave
      // "waiting to send" on a message that went out an hour ago. "sent" and
      // "queued" share a rank, so this advances the bubble without ever
      // overwriting a delivered or read ack that raced ahead of it.
      useChatStore.getState().setMessageStatus(msg.channel, msg.id, "sent");
      // The bubble advances, but the message STAYS QUEUED until the recipient
      // acknowledges it.
      //
      // Handing a packet to the radio is not proof of receipt, and on a
      // multi-hop path it is not even proof of ordering: relays re-broadcast
      // with 10-220ms of jitter, so a message sent immediately after the
      // handshake's msg3 can overtake it, reach a peer whose session is not
      // ready yet, and be dropped with nothing to say so. Resolving here made
      // that loss permanent.
      //
      // A DELIVERED receipt clears the entry (see the three receipt handlers),
      // and every retry reuses the same message id, so a redundant resend
      // collapses on the recipient rather than showing twice. Anything never
      // acknowledged ages out of the queue after OUTBOX_TTL_MS.
      outbox.markAttempted(msg.id);
    }
  }

  // Seed the inbound Nostr routing map from durable contacts on startup, so a
  // gift-wrapped reply from a known contact folds into their dm:<peerID> thread
  // even before we hear their ANNOUNCE this session. Deliberately does NOT touch
  // the registry: a saved contact is not proof of being nearby, and the Mesh tab
  // must keep meaning "in range right now".
  private hydrateContactNostrKeys(): void {
    for (const c of useContactsStore.getState().all()) {
      if (c.nostrPubkeyHex !== undefined && c.nostrPubkeyHex.length > 0) {
        this.nostrPubkeyToPeerID.set(c.nostrPubkeyHex, c.peerID);
      }
    }
  }

  // Retry queued DMs over the internet for recipients the mesh cannot promptly
  // reach. flushOutbox routes each through trySendDm, whose Nostr tier consults
  // the durable contact npub, so a message parked for someone now out of BLE
  // range (or reachable only over the internet) goes out without waiting for a
  // BLE reappearance. Skips peers that still have a live direct link: those are
  // the mesh's job and will flush on their own events. Safe to call often, since
  // a successful send resolves the outbox entry and the recipient dedupes by id.
  // Drop anything past its TTL and tell the sender. Cleanup only: no sends.
  //
  // bitchat separates these too (cleanupExpiredMessages vs flushOutbox), and the
  // separation is what makes an attempt mean something. A timer that re-sends is
  // a timer that manufactures "attempts" out of elapsed time, which is how a
  // seven-day queue turned into eighteen minutes and how an unreachable peer got
  // re-flooded ten thousand times.
  private expireQueuedMail(): void {
    const outbox = useOutboxStore.getState();
    const dropped = outbox.evictExpired();
    for (const d of dropped) this.courieredTo.delete(d.id);
    this.reportDroppedMail(dropped);
  }

  // Retry everything owed, over whatever route now exists.
  //
  // Called on real delivery opportunities only - a peer announcing, the app
  // coming forward, relays reconnecting - never on a bare timer. That is
  // bitchat's model: flushOutbox fires from peer key events and startup, and
  // there is no periodic send sweep anywhere in MessageRouter.
  private retryQueuedOverInternet(): void {
    // One retry per window, however many events land.
    //
    // iOS raises "inactive" for the app switcher, Control Center and every
    // permission dialog, and emits it on both edges of a background round trip,
    // so without this a single pull-down of Control Center re-publishes the
    // whole pending outbox to relays three times. Relay reconnects flap similarly.
    const now = Date.now();
    if (now - this.lastOutboxRetryMs < OUTBOX_RETRY_MIN_INTERVAL_MS) return;
    this.lastOutboxRetryMs = now;

    const outbox = useOutboxStore.getState();
    this.reportDroppedMail(outbox.evictExpired());
    const peerIDs = new Set(outbox.pending.map((m) => m.recipientPeerID));
    for (const peerID of peerIDs) {
      // Retry for EVERY peer with mail owed, including directly linked ones.
      //
      // Does not skip peers we hold a link to. That would be right only if the
      // queue were cleared optimistically on send; an entry survives until the
      // recipient acknowledges it, so one still sitting here against a connected
      // peer is precisely the case worth retrying: it went out and
      // was never acknowledged, which is what happens when it overtook the
      // handshake's msg3 and was dropped by a session that was not ready.
      //
      // Anything genuinely delivered has already been resolved by its receipt,
      // so this re-sends only what is actually outstanding, and the recipient
      // collapses a duplicate by message id either way.
      this.flushOutbox(peerID);
    }
  }

  // Drop all cached session state for a peer. Called when the user blocks or
  // deletes them: without this the Noise session, Double Ratchet state and
  // link mappings survive, so unblocking (or a stale handshake) could resume
  // an encrypted session the user believes they destroyed.
  //
  // The radio link itself is left alone, as it may still relay traffic for
  // other peers, but nothing addressed to us from this peer stays decryptable.
  forgetPeer(peerID: string): void {
    this.drStates.delete(peerID);
    this.pendingHandshakes.delete(peerID);
    const linkID = this.peerToLink.get(peerID);
    if (linkID !== undefined) this.linkToPeer.delete(linkID);
    this.peerToLink.delete(peerID);
    const wifiLink = this.wifiPeerToLink.get(peerID);
    if (wifiLink !== undefined) this.wifiLinkToPeer.delete(wifiLink);
    this.wifiPeerToLink.delete(peerID);
    for (const [nostrPub, mapped] of this.nostrPubkeyToPeerID) {
      if (mapped === peerID) this.nostrPubkeyToPeerID.delete(nostrPub);
    }
    // Drop anything still queued for them: blocking someone must not leave
    // messages that get delivered the moment they come back into range.
    const outbox = useOutboxStore.getState();
    for (const msg of outbox.forPeer(peerID)) outbox.resolve(msg.id);
    usePeerStore.getState().removePeer(peerID);
  }

  // Toggle BLE advertising only, leaving scanning untouched. Used for
  // "Invisible" status: peers can still be discovered, but we no longer
  // broadcast our own presence - and, importantly, we keep relaying and keep
  // the background service, which a direct call to stopAdvertising() silently
  // gives up.
  setDiscoverable(enabled: boolean): void {
    this.radio.setDiscoverable(enabled);
  }

  // Re-check the device and close any gap between what we want and what the
  // radios are doing.
  //
  // Safe to call from anywhere that suspects the world moved - a resume, a
  // permission grant, a banner tap - because the controller is a reconciler: it
  // reads the device, computes the one blocker, and issues only the calls that
  // are actually needed. Callers do not have to know whether it is necessary,
  // which is what lets the resume handler stop trying to guess.
  retryRadios(): void {
    if (!this.running) return;
    this.radio.refresh();
    // Every reason to re-read the Bluetooth stack is a reason to re-try the
    // WiFi attach: both are refused by a permission that has just been granted,
    // and both are refused by a radio the user has just switched on. If the two
    // diverge here, turning WiFi on and returning to the app fixes Bluetooth and
    // leaves the fast path dead until a relaunch.
    this.wifi.refresh();
  }

  // The app moved between foreground and background. Passed straight through to
  // the radio controller, which is where it decides how hard to scan: off
  // screen there is nobody waiting on discovery latency, and that is where a
  // phone spends nearly all of its day.
  setAppForeground(foreground: boolean): void {
    this.radio.setAppForeground(foreground);
    if (!foreground) return;
    // Coming back to the app is the strongest signal we get that the world may
    // have moved, because the usual reason someone left was to change it:
    // Settings is where Bluetooth, WiFi, mobile data and airplane mode live.
    //
    // The radios have their own reconciler for that. Queued mail did not - it
    // waited on a peer's ANNOUNCE or on the 45-second sweep - so the sequence
    // "send a DM, watch it queue, go and turn the internet on, come back" left
    // the message sitting there while everything it needed was in place. The
    // user's read of that is that the app has to be restarted to notice, which
    // is how it was reported.
    //
    // Cheap and idempotent: it walks only the peers with mail actually
    // outstanding, an entry survives until the recipient acknowledges it, and a
    // redundant resend is collapsed by message id at the far end.
    this.retryQueuedOverInternet();
  }

  // Pull-to-refresh hook: drop stale peers, re-check the radios, and re-resolve
  // the geohash channels (picks up a moved location cell and re-subscribes).
  // Safe to call repeatedly: the radio controller only issues calls that change
  // something, the Nostr relay pool auto-reconnects, and geoChannels.refresh
  // only re-subscribes cells that actually changed.
  refresh(): void {
    usePeerStore.getState().evictStale();
    this.radio.refresh();
    this.wifi.refresh();
    void this.geoChannels?.refresh();
  }

  // Build (or rebuild) the Nostr transport: the relay pool plus the geohash and
  // private-channel services that ride it. Extracted so the Tor toggle can tear
  // the pool down and stand it back up on the newly selected WebSocket transport
  // (Tor or direct) without disturbing BLE or the durable store subscriptions.
  private buildNostrTransport(): void {
    this.nostrClient = new NostrClient({
      relays: [],
      // Reflect real relay connectivity in the mesh banner: with no BLE peers
      // but a live relay, the Mesh tab can say it is relaying over the internet
      // instead of implying nothing is reachable.
      onConnectionChange: (connected) => {
        useMeshStateStore.getState().setNostrConnected(connected);
        if (!connected) {
          // Withdraw the gateway claim now rather than at the next tick.
          //
          // The capability is gated on live relays, so losing them changes what
          // we advertise - but only the falling edge was unhandled, so an
          // offline gateway went on being chosen by its neighbours for up to
          // thirty seconds. The connect path below has always re-announced; this
          // is the other half of that.
          this.announceManager.announceNow();
          // And the bridge banner, whose "active" now depends on live relays but
          // which nothing recomputed on this edge.
          this.bridgeService?.onRelayConnectivityChanged();
          return;
        }
        // Anything a mesh-only peer handed us while we were offline goes out
        // now. Same trigger bitchat uses (ChatViewModelBootstrapper watches
        // NostrRelayManager.isConnected and flushes both services).
        this.flushQueuedUplinks();
        // And our own mail. The DM outbox had no connectivity trigger at all:
        // its only routes out were a peer's ANNOUNCE arriving over Bluetooth
        // and a 45-second sweep. So a message queued as "will retry when a
        // route is available" sat there after the user turned their internet
        // back on, for up to three quarters of a minute, with the relay it
        // needed already live. Long enough that reopening the app looked like
        // the thing that fixed it, which is how this was reported.
        //
        // Relays coming up IS a new route appearing, and it is the exact
        // trigger bitchat flushes on. Safe to call often: an entry survives
        // until the recipient acknowledges it, and the recipient collapses a
        // duplicate by message id.
        this.retryQueuedOverInternet();
        // Relays coming up while bridging turns us into a serving bridge (we can
        // now publish + advertise a cell): refresh presence/subscription and push
        // a fresh announce so mesh-only peers discover us.
        if (this.bridgeService !== null) {
          void this.bridgeService.refresh();
          this.announceManager.announceNow();
        }
      },
    });

    // Location-scoped channels. Constructed unconditionally: it resolves its
    // own position and stays inert if permission was never granted, so the
    // location prompt is never forced on someone who only wants BLE.
    // Signed with per-geohash derived keys, NOT our main Nostr identity. See
    // geohash-identity.ts. Passing the Ed25519 signing key lets the service
    // derive its own seed without a second stored secret.
    this.geoChannels = new GeohashChannelService(
      this.nostrClient,
      this.identity.signingPrivKey,
      this.nickname,
      this.identity.peerID,
      {
        uplink: (event, geohash) => this.uplinkGeohashEvent(event, geohash),
        onRelayEvent: (event, geohash) =>
          this.rebroadcastRelayEvent(event, geohash),
        onContactCard: (card, senderPubkey) =>
          this.acceptGeoContactCard(card, senderPubkey),
      },
    );
    void this.geoChannels.refresh();

    // Private channels bridged over Nostr (the "Bluetooth + Internet" reach).
    // Subscribes to every joined ble+nostr private channel and re-syncs whenever
    // the channel set changes (a create, join, leave, or reach change).
    this.privateChannels = new PrivateChannelService(
      this.nostrClient,
      this.identity.peerID,
    );
    this.privateChannels.refresh();

    // Mesh bridge: stitches public #bluetooth chat across mesh islands over a
    // geohash-cell rendezvous. Reuses the shared Nostr client and per-cell
    // geohash identities; carriers ride the same 0x28 packet as the gateway.
    // Inert until the user enables it.
    this.bridgeService = new BridgeService(
      this.nostrClient,
      this.identity.signingPrivKey,
      {
        injectMessage: (msg) =>
          useChatStore.getState().addMessage({
            id: msg.id,
            channel: BRIDGE_CHANNEL,
            senderID: msg.senderKey,
            senderNickname: msg.nickname,
            text: msg.text,
            timestampMs: msg.timestampMs,
            isMine: false,
            viaBridge: true,
          }),
        firstReachableBridge: () => this.registry.firstReachableBridge(),
        advertisedBridgeCell: () =>
          this.registry.firstReachableBridge()?.bridgeGeohash,
        sendCarrierToBridge: (payload, peerID) =>
          this.sendDirectedCarrier(payload, peerID),
        broadcastCarrierFromBridge: (payload) => this.broadcastCarrier(payload),
        relaysConnected: () => this.nostrClient?.isConnected ?? false,
        nickname: () => this.nickname,
        onStatus: (status) =>
          useMeshStateStore
            .getState()
            .setBridgeState(status.active, status.peopleAcross),
      },
    );
    this.bridgeService.setEnabled(useSettingsStore.getState().bridgeEnabled);
  }

  // Wrap an encoded carrier payload in a directed, signed NOSTR_CARRIER packet
  // and flood it toward the recipient (direct link if any, else broadcast) like
  // a DM. Shared by the gateway uplink and the bridge deposit.
  private sendDirectedCarrier(payload: Uint8Array, peerID: string): void {
    const pkt: Packet = {
      type: PacketType.NOSTR_CARRIER,
      ttl: 7,
      flags: Flags.HAS_RECIPIENT | Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: hexToBytes(peerID),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload,
    };
    pkt.signature = signPacket(pkt, this.identity.signingPrivKey);
    this.unicastFn(peerID, pkt);
  }

  // Wrap an encoded carrier payload in a broadcast NOSTR_CARRIER packet (unsigned
  // at the packet layer; receivers verify the carried event's own Schnorr
  // signature). Shared by the gateway downlink and the bridge rebroadcast.
  private broadcastCarrier(payload: Uint8Array): void {
    const pkt: Packet = {
      type: PacketType.NOSTR_CARRIER,
      ttl: 7,
      flags: 0,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: new Uint8Array(8),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload,
    };
    this.broadcastPacket(pkt);
  }

  // Subscribe to gift-wrap DMs (kind 1059) addressed to our Nostr pubkey. Split
  // out so it can be re-run after the pool is rebuilt for a Tor toggle: the old
  // subscription dies with the old pool, so a fresh one must be opened.
  private subscribeNostrInbox(): void {
    if (this.nostrClient === null) return;
    this.nostrClient.subscribe(
      [{ kinds: [1059], "#p": [this.nostrPubKeyHex] }],
      (event) => {
        try {
          // No `since` on this subscription, so only the future bound applies: a
          // relay may hold a genuinely old DM from while we were away.
          const dm = unwrapDm(
            event,
            this.nostrPrivKey,
            Number.POSITIVE_INFINITY,
          );
          // Map sender Nostr pubkey back to their peerID if we know them.
          const peerID = this.nostrPubkeyToPeerID.get(dm.senderPubkey);
          // Blocking has to be honoured on the internet path too, otherwise a
          // blocked peer simply switches to Nostr and keeps reaching you (and
          // re-creates the conversation you deleted).
          if (
            peerID !== undefined &&
            useBlockedStore.getState().isBlocked(peerID)
          ) {
            return;
          }
          // When we don't know this sender's peerID yet, key the thread by
          // their FULL Nostr pubkey rather than a 16-char slice of it. The old
          // slice looked like a peerID but wasn't one: replying fed it to
          // sendDm, which could never resolve a route, so the conversation was
          // un-repliable. `nostr_` keeps it unambiguous and routable, and
          // onAnnounce merges the thread once their real peerID shows up.
          const senderKey = peerID ?? `nostr_${dm.senderPubkey}`;
          const channel = `dm:${senderKey}`;

          // The rumor content is a bitchat `bitchat1:` envelope: a private
          // message or a delivery/read receipt. Decode and dispatch.
          const env = decodeBitchatEnvelope(dm.content);
          if (env === null) return;

          if (env.type === NoisePayloadType.DELIVERED) {
            useChatStore
              .getState()
              .setMessageStatus(
                channel,
                env.messageID,
                "delivered",
                Date.now(),
              );
            // Acknowledged over the internet counts just as much as over the
            // radio: the recipient has it, so it leaves the queue.
            useOutboxStore.getState().resolve(env.messageID);
            return;
          }
          if (env.type === NoisePayloadType.READ_RECEIPT) {
            useChatStore
              .getState()
              .setMessageStatus(channel, env.messageID, "read", Date.now());
            return;
          }
          if (env.type !== NoisePayloadType.PRIVATE_MESSAGE) return;

          const peer = peerID ? this.registry.get(peerID) : undefined;
          useChatStore.getState().addChannel(channel);
          useChatStore.getState().addMessage({
            id: env.messageID,
            channel,
            senderID: senderKey,
            senderNickname:
              peer?.nickname ?? `npub…${dm.senderPubkey.slice(-6)}`,
            text: env.content,
            timestampMs: dm.timestamp * 1000,
            isMine: false,
          });

          // Acknowledge delivery over Nostr, and remember to send a read receipt
          // when the user opens this conversation.
          this.publishNostrAck(
            dm.senderPubkey,
            NoisePayloadType.DELIVERED,
            env.messageID,
          );
          const pending =
            this.pendingNostrReadAcks.get(dm.senderPubkey) ?? new Set<string>();
          pending.add(env.messageID);
          this.pendingNostrReadAcks.set(dm.senderPubkey, pending);
        } catch {
          // Invalid or misdirected gift wrap: drop silently.
        }
      },
    );
  }

  // Rebuild the Nostr transport on whatever WebSocket implementation nostr-tools
  // currently has installed. Called when Tor routing is toggled at runtime: the
  // old relay pool is closed and a fresh one opened, so every relay connection
  // re-establishes over the selected path (Tor or direct). BLE links and the
  // durable store subscriptions are deliberately left untouched, because Tor is
  // an internet-only concern and must not disturb nearby Bluetooth chat.
  restartNostr(): void {
    // Before the first start(), or with internet off, there is nothing to
    // rebuild: start() (or applyInternetEnabled) will build the transport.
    if (!this.running) return;
    this.teardownNostr();
    if (!useSettingsStore.getState().internetEnabled) return;
    // Fresh pool + channel services on the current socket factory, then re-open
    // the DM inbox. The chat/contacts store subscriptions and the outbox sweep
    // keep working: they reach the new instances through `this.` fields.
    this.buildNostrTransport();
    this.subscribeNostrInbox();
    // The nutzap watcher captured the client we just replaced, so it is now
    // subscribed to a closed pool. See nutzap-watcher-handle.
    rebindNutzapWatcher();
  }

  // Stop and null every Nostr transport + channel service, leaving all the
  // `this.nostrClient?.` / `this.geoChannels?.` call sites as safe no-ops. BLE
  // links and durable store subscriptions are untouched, so nearby Bluetooth
  // chat keeps working.
  private teardownNostr(): void {
    this.geoChannels?.stop();
    this.geoChannels = null;
    this.privateChannels?.stop();
    this.privateChannels = null;
    this.bridgeService?.stop();
    this.bridgeService = null;
    this.nostrClient?.close();
    this.nostrClient = null;
    useMeshStateStore.getState().setNostrConnected(false);
  }

  // Master internet switch (the Internet fallback toggle). Build the Nostr
  // transport when enabled if it is not already up; tear it down when disabled,
  // dropping every relay connection so the device is pure Bluetooth.
  applyInternetEnabled(enabled: boolean): void {
    if (!this.running) return;
    if (enabled) {
      if (this.nostrClient === null) {
        this.buildNostrTransport();
        this.subscribeNostrInbox();
        rebindNutzapWatcher();
      }
    } else {
      this.teardownNostr();
      // No client to watch on. Drop the subscription rather than leaving it
      // against a pool that has just been destroyed.
      rebindNutzapWatcher();
      // Same reasoning as the gateway toggle: parked uplinks are other people's
      // messages held against an internet connection the user has just switched
      // off, and they must not be published when it comes back.
      this.queuedUplinks.length = 0;
    }
    // The gateway capability we advertise depends on internet being on, so push
    // a fresh announce now rather than waiting for the next cycle.
    this.announceManager.announceNow();
  }

  stop(): void {
    this.running = false;

    // Say goodbye first, then take the radios down, with a short grace between
    // the two so the farewell actually leaves.
    //
    // Order matters here. `radio.stop()` is not just a flag: it reconciles on
    // the same tick and
    // reaches the native "stop scanning, stop advertising" call before it
    // returns, so the LEAVE and the voice END were handed to a transport that
    // had already been told to shut. A peer going Away vanished from everyone
    // else's list by 60-second timeout instead of instantly, and an open voice
    // burst ended in a stall rather than a finish. In a crowded room that is a
    // list full of people who already left.
    //
    // `suspend()` records the decision without touching the radios, so nothing
    // can restart them behind a user who just chose to go offline. That was the
    // real reason the stop came first, and it is preserved.
    this.radio.suspend();
    try {
      this.sendLeave();
    } catch {
      // Never let a courtesy broadcast block shutdown.
    }
    // Close live voice while the links are still up, for the same reason the
    // LEAVE goes first: closeVoice() ends an open burst with an END packet so
    // the far side hears a finish rather than waiting out a timeout, and that
    // packet needs a radio to leave on.
    //
    // This was missing entirely. stop() took down the radios, the announce
    // timer, gossip, every event subscription, the outbox sweep, the channel
    // services, the bridge, pending pings and the Nostr pool - and left the
    // microphone open and every inbound VoiceSession holding its jitter-buffer
    // and session-timeout timers. On a device that is worse than a leak: going
    // Away, or triple-tapping to panic wipe, left a stranger's audio still
    // coming out of the speaker of a phone whose mesh had just been stopped.
    this.closeVoice();

    // Apply the teardown once the farewells have had time to reach the wire.
    // A GATT write clears within a connection interval, so this is a handful
    // of milliseconds of radio, invisible to the user and worth far more than
    // it costs: it is the difference between disappearing from a room at once
    // and lingering in it as a ghost for a minute.
    //
    // Best-effort by design. If the timer never fires because the service is
    // disposed first, dispose() applies the teardown immediately instead.
    this.clearRadioStopGrace();
    this.radioStopTimer = setTimeout(() => {
      this.radioStopTimer = null;
      // Re-check rather than trust the schedule. Anything that brings the mesh
      // back inside the window (Away then Online, a relaunch) means the radios
      // are wanted again and this teardown is a stale decision. start() also
      // cancels the timer; this covers every other way running could flip.
      if (this.running) return;
      this.radio.stop();
    }, MeshService.LEAVE_GRACE_MS);

    this.announceManager.stop();
    this.gossip.stop();
    // Outstanding sync requests do not survive the mesh stopping. Whatever the
    // reason (Away, panic wipe, radio off), a response arriving after this
    // would be answering a question from a session that no longer exists, and
    // must be held to the ordinary freshness window like anything else.
    this.requestSync.reset();
    // Echo bookkeeping is per session, and every session dies with the mesh. A
    // fresh handshake after a restart must be able to answer a proof again.
    this.peerStateEchoed.clear();
    // A clock-skew claim is evidence about a mesh we are no longer part of.
    // Leaving the banner up after the radios come down would blame the clock
    // for an empty room that is empty because we stopped listening.
    this.staleFromPeers.clear();
    useMeshStateStore.getState().setClockSkewed(false);
    this.floodRouter.flush();
    for (const sub of this.subs) sub.remove();
    this.subs = [];
    this.chatUnsub?.();
    this.chatUnsub = null;
    this.gatewayUnsub?.();
    this.gatewayUnsub = null;
    this.liveVoiceUnsub?.();
    this.liveVoiceUnsub = null;
    this.backgroundPrefUnsub?.();
    this.backgroundPrefUnsub = null;
    this.bridgeUnsub?.();
    this.bridgeUnsub = null;
    this.internetUnsub?.();
    this.internetUnsub = null;
    this.relayPrefsUnsub?.();
    this.relayPrefsUnsub = null;
    this.contactsUnsub?.();
    this.contactsUnsub = null;
    if (this.outboxSweepTimer !== null) {
      clearInterval(this.outboxSweepTimer);
      this.outboxSweepTimer = null;
    }
    this.privateChannels?.stop();
    this.privateChannels = null;
    this.geoChannels?.stop();
    // Nulled, like every other Nostr-riding service beside it.
    //
    // This was the one left behind, and it is not a dangling reference: the
    // service holds its OWN handle on the client, and pool.destroy() empties the
    // relay map without latching anything, so the pool lazily REBUILDS a relay
    // on the next call. So a stopped mesh plus one pull-to-refresh - or a
    // foreground resume, or a location grant - re-subscribed every geohash cell,
    // reopened those sockets, and restarted the presence heartbeat, announcing
    // this device's cell over a mesh the user had switched off.
    this.geoChannels = null;
    this.bridgeService?.stop();
    this.bridgeService = null;
    // Resolve any outstanding pings as unreachable and drop their timers.
    for (const [nonce, pending] of this.pendingPings) {
      clearTimeout(pending.timer);
      pending.resolve(null);
      this.pendingPings.delete(nonce);
    }
    this.nostrClient?.close();
    this.nostrClient = null;
    // The watcher captured the client that just died. Drop it here rather than
    // leaving it subscribed to a destroyed pool while holding this identity's
    // Nostr key; start() rebinds it against the fresh client.
    rebindNutzapWatcher();
    // Other people's messages, parked for a gateway that is now off. The
    // settings subscription that normally clears these is unsubscribed a few
    // lines below, and presence sets gatewayEnabled false AFTER calling stop(),
    // so nothing else would ever reach them and they would be published on the
    // next return to Online.
    this.queuedUplinks.length = 0;
    // The relay pool is gone, so the internet bridge is down. Reset explicitly
    // rather than relying on close() to fire per-relay failure callbacks.
    useMeshStateStore.getState().setNostrConnected(false);
    // The radios were already brought down by this.radio.stop() at the top,
    // through the one path that also cancels retries and releases the background
    // service. Calling the native stops again here would race that.
    this.wifi.stop();
    // And forget the links it just closed. Unlike a BLE central link, which
    // survives a stopped scan, a WiFi link is a socket stopWiFi() destroys, and
    // link IDs are never reissued. The native disconnect events cannot clean up
    // either: the subscriptions were removed a few lines earlier. Left
    // populated, `wifiPeerToLink` routed a peer down a dead socket after Away
    // and back, and DMs failed silently until their next ANNOUNCE re-mapped it.
    this.wifiConnectedLinks.clear();
    this.wifiPeerToLink.clear();
    this.wifiLinkToPeer.clear();
    // A burst cannot outlive the radios carrying it: close the mic and the
    // speaker before the links go, so nothing is left recording into a mesh
    // that is no longer there.
    this.closeVoice();
    // The radios are down, so anyone in the peer list is now stale. Clear it so
    // a stopped mesh (Away, or a wipe) shows an empty radar instead of lingering
    // peers that imply a live mesh. Peers repopulate from ANNOUNCE on restart.
    usePeerStore.getState().clearAll();
  }

  // Permanent teardown, for a wipe or a re-onboard. stop() is reversible - Away
  // is a stop, and the user can come back from it - so it deliberately leaves
  // the controller able to run again. This does not: nothing this instance owns
  // may fire afterwards, because the identity it holds is about to stop existing
  // and a retry landing after a wipe would rebuild the radios under the old keys.
  // How long the radios stay up after a stop, so the LEAVE and any voice END
  // reach the wire before the transport goes. A GATT write flushes within one
  // connection interval (7.5-50 ms on the profiles both platforms negotiate),
  // so this is generous without being noticeable.
  private static readonly LEAVE_GRACE_MS = 150;
  private radioStopTimer: ReturnType<typeof setTimeout> | null = null;

  private clearRadioStopGrace(): void {
    if (this.radioStopTimer !== null) {
      clearTimeout(this.radioStopTimer);
      this.radioStopTimer = null;
    }
  }

  dispose(): void {
    this.stop();
    // The grace is a courtesy to peers, and a disposed service has no business
    // holding radios open for one. Whatever stop() scheduled is dropped and the
    // teardown applied now, so a panic wipe is never waiting on a timer.
    this.clearRadioStopGrace();
    this.radio.stop();
    this.radio.dispose();
    // stop() above already asked the WiFi transport to come down; this is what
    // stops its retry ladder, so a pending attach cannot land after a panic wipe
    // and reopen a socket under an identity that no longer exists.
    this.wifi.dispose();
  }
}

// ---- Singleton access ----

let _instance: MeshService | null = null;

// Returns the active MeshService, or null if not yet started.
export function getMeshService(): MeshService | null {
  return _instance;
}

// Create (or replace) the singleton MeshService with the given identity.
// Called once from App.tsx after identity is ready.
export function initMeshService(
  identity: Identity,
  nickname: string,
): MeshService {
  // dispose(), not stop(): the outgoing instance is being replaced wholesale
  // (a re-onboard, or a wipe followed by a fresh identity), so nothing it owns
  // may fire against the new one.
  _instance?.dispose();
  _instance = new MeshService(identity);
  _instance.start(nickname);
  return _instance;
}

// Stop the mesh and drop the singleton. For the panic wipe: stop() alone takes
// the radios down but leaves this module holding a MeshService that still has
// the wiped identity's private keys on its `identity` field, which would keep
// them reachable in memory for the rest of the process. JS gives no way to zero
// the bytes, so releasing the last reference to them is the strongest thing
// available - and it also guarantees the next launch builds a mesh from the new
// identity rather than finding a stale one.
export function destroyMeshService(): void {
  _instance?.dispose();
  _instance = null;
}
