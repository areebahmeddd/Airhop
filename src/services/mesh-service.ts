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

import { x25519 } from "@noble/curves/ed25519.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import {
  getPublicKey,
  verifyEvent,
  type Event as NostrEvent,
} from "nostr-tools";
import { DeviceEventEmitter, type EmitterSubscription } from "react-native";
import AirhopBLE from "../bridge/NativeAirhopBLE";
import NativeAirhopWiFi from "../bridge/NativeAirhopWiFi";
import type { ContactCard } from "../core/crypto/contact-exchange";
import {
  initReceiver,
  initSender,
  ratchetDecrypt,
  ratchetEncrypt,
  type RatchetState,
} from "../core/crypto/double-ratchet";
import type { Identity } from "../core/crypto/identity";
import { noiseXOpen, noiseXSeal } from "../core/crypto/noise-x";
import { NoiseHandshake, type NoiseSession } from "../core/crypto/noise-xx";
import {
  ANNOUNCE_TTL,
  AnnounceManager,
  Capability,
  decodeAnnouncePayload,
} from "../core/mesh/announce-manager";
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
} from "../core/mesh/board-packet";
import {
  openChannelMessage,
  sealChannelMessage,
} from "../core/mesh/channel-crypto";
import {
  computeRecipientTag,
  CourierStore,
  decodeEnvelopePayload,
  encodeEnvelopePayload,
  ENVELOPE_TTL_MS,
} from "../core/mesh/courier-store";
import {
  decodeDmPayload,
  DmPayloadType,
  encodeDmMessage,
  encodeDmReceipt,
} from "../core/mesh/dm-payload";
import { FloodRouter } from "../core/mesh/flood-router";
import {
  FRAG_DATA_SIZE,
  FragmentManager,
  type FragmentProgress,
} from "../core/mesh/fragment-manager";
import { GossipSync } from "../core/mesh/gossip-sync";
import {
  decodeGroupEnvelope,
  decodeGroupState,
  encodeGroupState,
  GROUP_KEY_LENGTH,
  GROUP_MAX_MEMBERS,
  groupFingerprint,
  newGroupID,
  newGroupKey,
  openGroupMessage,
  sealGroupMessage,
  signGroupState,
  verifyGroupState,
  type BitchatGroup,
  type GroupMember,
} from "../core/mesh/group-protocol";
import {
  decodeMeshPing,
  encodeMeshPing,
  newPingNonce,
  pingHopCount,
} from "../core/mesh/mesh-ping";
import {
  decodePrivateMessagePacket,
  NoisePayloadType,
  type NoisePayloadTypeValue,
} from "../core/mesh/noise-payload";
import {
  CarrierDirection,
  decodeNostrCarrier,
  encodeNostrCarrier,
} from "../core/mesh/nostr-carrier";
import {
  BROADCAST_ID,
  decodePacket,
  encodePacket,
  Flags,
  PacketType,
  signPacket,
  verifyPacket,
  type Packet,
} from "../core/mesh/packet-codec";
import {
  decodePrekeyBundle,
  encodePrekeyBundle,
  verifyPrekeyBundle,
} from "../core/mesh/prekey-bundle";
import { LocalPrekeyStore, PeerPrekeyStore } from "../core/mesh/prekey-store";
import { VoiceCaptureSession } from "../core/mesh/voice-capture";
import { VoicePlayer } from "../core/mesh/voice-player";
import {
  decodeBitchatEnvelope,
  encodeBitchatAckEnvelope,
  encodeBitchatDmEnvelope,
} from "../core/nostr/bitchat-envelope";
import { bridgeStableID } from "../core/nostr/bridge-event";
import { deriveNostrPrivKey, unwrapDm, wrapDm } from "../core/nostr/gift-wrap";
import { NostrClient } from "../core/nostr/nostr-client";
import {
  decodeChannelMsgPayload,
  MessageRouter,
  newMessageId,
  PeerRegistry,
  type NostrSendFn,
  type RouterIdentity,
} from "../core/router/message-router";
import { useActivityStore } from "../store/activity-store";
import { useBlockedStore } from "../store/blocked-store";
import { useBoardStore } from "../store/board-store";
import { useChatStore } from "../store/chat-store";
import { useContactsStore } from "../store/contacts-store";
import { groupChannel, useGroupStore } from "../store/group-store";
import { useMeshStateStore } from "../store/mesh-state-store";
import { useOutboxStore } from "../store/outbox-store";
import { usePeerStore } from "../store/peer-store";
import { useSettingsStore } from "../store/settings-store";
import { useTransferStore } from "../store/transfer-store";
import { channelDisplayName, resolveDisplayName } from "../utils/display-name";
import { canSendMedia } from "../utils/media-policy";
import { BridgeService } from "./bridge-service";
import {
  FileTransferService,
  type AttachmentMeta,
} from "./file-transfer-service";
import {
  geohashChannel,
  GeohashChannelService,
  isGeoChannel,
  isManualGeoChannel,
  type GeoParticipant,
} from "./geohash-channel-service";
import { PrivateChannelService } from "./private-channel-service";
import {
  isLiveVoiceAvailable,
  NativeAudioCapture,
  NativeAudioPlayback,
} from "./voice-audio";

// ---- Constants --------------------------------------------------------------

const BLE_SERVICE_UUID = "F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C";

// HKDF info string used to derive the Double Ratchet root key from the
// Noise XX static ECDH result. Airhop-to-Airhop only: bitchat nodes never
// receive DR_ENCRYPTED packets.
const DR_SEED_INFO = new TextEncoder().encode("airhop-dr-seed-v1");

// How often to sweep the outbox for queued DMs that can now go over Nostr.
// Slow on purpose: it is a safety net behind the event-driven flush, not the
// primary delivery path, so it stays cheap and never spams relays.
const OUTBOX_SWEEP_INTERVAL_MS = 45_000;

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
  nostr: boolean;
}

// Round-trip result of a mesh ping: latency and the number of links crossed.
export interface MeshPingResult {
  rttMs: number;
  hops: number | null;
}

// TTL a ping launches with (also the hop-count reference for the pong).
const MESH_PING_TTL = 7;
// How long to wait for a pong before resolving the probe as unreachable.
const MESH_PING_TIMEOUT_MS = 10_000;

// How long to let the Bluetooth switch settle before restarting the radios.
// Long enough for the Android stack to finish coming up after it broadcasts
// STATE_ON, and to swallow a burst of flips, short enough that a deliberate
// toggle feels immediate. See scheduleRadioRestart.
const ADAPTER_SETTLE_MS = 700;
// Minimum spacing between pong replies on one ingress link (anti-amplification).
const MESH_PONG_MIN_INTERVAL_MS = 100;

// A Noise handshake with no reply within this window is treated as dead and
// dropped lazily on the next send, so a lost msg2/msg3 (or a peer that went away
// mid-handshake) never wedges future mesh DMs to that peer. bitchat gets the same
// recovery from event-driven session clears (decrypt failure, stale-link
// announce); an age check is the equivalent safety net here. Generous enough to
// cover a multi-hop round trip.
const HANDSHAKE_TIMEOUT_MS = 30_000;

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
const CARRIER_MAX_EVENT_AGE_SECONDS = 15 * 60;
const DOWNLINK_EVENTS_PER_MINUTE = 30;
// The public BLE broadcast channel the mesh bridge ferries across islands. The
// direct analogue of bitchat's single public "#mesh" channel.
const BRIDGE_CHANNEL = "#bluetooth";
// Uplink deposits accepted per depositor per rolling minute, matching bitchat
// GatewayService.Limits.uplinkEventsPerMinutePerDepositor. Bounds how much a
// single mesh peer can make our gateway publish to relays on its behalf.
const UPLINK_EVENTS_PER_MINUTE_PER_DEPOSITOR = 10;

// ---- Base64 helpers ---------------------------------------------------------
// These avoid adding a dependency on base64-js; atob/btoa are part of the
// Hermes global scope in React Native 0.64+.

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary);
}

// Trim a nickname to the board's 64-byte cap (bitchat BoardWireConstants), by
// UTF-8 length rather than character count so multibyte names cannot overflow.
function clampNickname(nickname: string): string {
  let n = nickname;
  while (new TextEncoder().encode(n).length > 64) n = n.slice(0, -1);
  return n;
}

// ---- MeshService ------------------------------------------------------------

export class MeshService {
  private readonly identity: Identity;
  // Derived secp256k1 key pair for Nostr DMs, deterministically derived from the Ed25519 signing key.
  private readonly nostrPrivKey: Uint8Array;
  private readonly nostrPubKeyHex: string;
  // Maps a remote peer's Nostr pubkey hex to their peerID, populated as ANNOUNCEs arrive.
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
  // Unsubscribe for the settings listener that tears live voice down when the
  // user switches it off mid-burst.
  private liveVoiceUnsub: (() => void) | null = null;
  // Unsubscribe for the contacts-store listener that binds a peer's durable
  // Nostr pubkey from the registry when a contact is created.
  private contactsUnsub: (() => void) | null = null;
  // Periodic sweep that retries queued DMs over Nostr for recipients the mesh
  // can no longer promptly reach. Mirrors bitchat's retryBridgeCourierDeposits:
  // a peer stays "reachable" for a minute after its radio disappears, so the
  // original send trusted the mesh and never tried the internet, and nothing
  // else retried it. Null when the service is stopped.
  private outboxSweepTimer: ReturnType<typeof setInterval> | null = null;

  // Currently connected BLE link IDs.
  private readonly connectedLinks = new Set<string>();
  // peerID (16 hex) → linkID for unicast to direct neighbours.
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
  private readonly pendingGroupInvites = new Map<string, Uint8Array[]>();

  // Wire message ids received from a peer over the DR path that still owe a read
  // receipt, sent when the user opens that conversation. Ephemeral: read
  // receipts are best-effort and need not survive a restart.
  private readonly pendingReadAcks = new Map<string, Set<string>>();
  // Read receipts owed over Nostr, keyed by the sender's Nostr pubkey hex.
  // Flushed when the user opens that conversation.
  private readonly pendingNostrReadAcks = new Map<string, Set<string>>();

  // Fragment reassembly: collects 469-byte FRAGMENT packets into full packets.
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
  // Whether the user is actually looking at the conversation a burst belongs
  // to, with the app in front of them. See setLiveVoiceAudible.
  private liveVoiceAudible = false;

  // WiFi direct links (MC on iOS, WiFi Aware on Android). Separate maps
  // because WiFi IDs must never collide with BLE link IDs.
  private readonly wifiConnectedLinks = new Set<string>();
  private readonly wifiPeerToLink = new Map<string, string>();
  private readonly wifiLinkToPeer = new Map<string, string>();

  // Stored closure so sendDRMessage can unicast DR_ENCRYPTED packets without
  // duplicating the WiFi-vs-BLE preference logic.
  private unicastFn!: (recipientPeerID: string, packet: Packet) => void;

  private subs: EmitterSubscription[] = [];
  private nickname = "";
  // Whether start() has run without a matching stop(). Guards the recovery
  // paths (see retryRadios) so a late event - a permission granted in Settings,
  // Bluetooth switched back on - can never bring the radios up behind a user
  // who deliberately went Away.
  private running = false;
  // Pending debounced radio restart, see scheduleRadioRestart.
  private radioRestartTimer: ReturnType<typeof setTimeout> | null = null;

  // Cumulative bytes moved over BLE/WiFi this session, for the Storage &
  // Data screen's Network Usage row. Resets when the app restarts.
  private bytesSent = 0;
  private bytesReceived = 0;

  getByteCounters(): { sent: number; received: number } {
    return { sent: this.bytesSent, received: this.bytesReceived };
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

    const routerIdentity: RouterIdentity = {
      peerID: identity.peerID,
      signingPrivKey: identity.signingPrivKey,
      noiseStaticPrivKey: identity.noiseStaticPrivKey,
    };

    const broadcastFn = (packet: Packet): void => {
      this.floodRouter.originate(packet);
      // Our own broadcasts are gossipable too: a peer who arrives later should
      // be able to catch up on messages we originated, not just relayed ones.
      this.gossip.track(packet);
      const b64 = bytesToBase64(encodePacket(packet));
      for (const linkID of this.connectedLinks) {
        this.sendBle(linkID, b64).catch(() => {
          this.connectedLinks.delete(linkID);
        });
      }
    };
    this.broadcastPacket = broadcastFn;

    const unicastFn = (recipientPeerID: string, packet: Packet): void => {
      // Prefer WiFi direct (higher throughput for large attachments).
      const wifiLink = this.wifiPeerToLink.get(recipientPeerID);
      if (wifiLink && this.wifiConnectedLinks.has(wifiLink)) {
        this.sendWifi(wifiLink, bytesToBase64(encodePacket(packet))).catch(
          () => {
            this.wifiConnectedLinks.delete(wifiLink);
            this.wifiPeerToLink.delete(recipientPeerID);
            this.wifiLinkToPeer.delete(wifiLink);
          },
        );
        return;
      }
      // Fall back to a direct BLE link.
      const linkID = this.peerToLink.get(recipientPeerID);
      if (linkID) {
        this.floodRouter.originate(packet);
        this.sendBle(linkID, bytesToBase64(encodePacket(packet))).catch(
          () => {},
        );
        return;
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
        broadcastFn(packet);
      }
    };

    // Store the unicast closure so sendDRMessage can use it without
    // duplicating the WiFi-vs-BLE preference logic.
    this.unicastFn = unicastFn;

    this.fileXfer = new FileTransferService(
      { peerID: identity.peerID, signingPrivKey: identity.signingPrivKey },
      broadcastFn,
      unicastFn,
      (peerID) => this.registry.get(peerID)?.nickname,
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

    // Seed the radio state before any change event fires. Otherwise launching
    // with Bluetooth already off would look like "scanning, no peers yet".
    // Implemented on both platforms; adapterStateChanged then keeps it current.
    AirhopBLE.isAdapterEnabled()
      .then((enabled) => {
        useMeshStateStore.getState().setAdapterEnabled(enabled);
      })
      .catch(() => {
        // Radio unreadable at this instant. The banner's optimistic default
        // stands and the next adapterStateChanged settles it either way.
      });

    // Central: discover other Airhop / bitchat devices.
    AirhopBLE.startScanning([BLE_SERVICE_UUID]).catch(() => {});

    // Advertise our peerID (native puts its first 8 bytes in scan-response
    // service data, matching bitchat) so scanners can identify and de-dup us
    // before connecting. The nickname is exchanged later via ANNOUNCE, not the
    // advertisement, which has no room for it alongside the 128-bit UUID.
    AirhopBLE.startAdvertising(BLE_SERVICE_UUID, this.identity.peerID).catch(
      () => {},
    );

    // Periodic ANNOUNCE so nearby peers learn our identity.
    const sendFn = (packet: Packet): void => {
      const b64 = bytesToBase64(encodePacket(packet));
      for (const linkID of this.connectedLinks) {
        this.sendBle(linkID, b64).catch(() => {
          this.connectedLinks.delete(linkID);
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
      () => {
        const settings = useSettingsStore.getState();
        // Only advertise gateway when we can actually serve: internet on and the
        // toggle enabled. The bridge self-gates (advertisedBridgeGeohash is
        // undefined unless online with a cell, and null once torn down).
        const gateway =
          settings.internetEnabled && settings.gatewayEnabled
            ? Capability.gateway
            : 0;
        const bridge =
          this.bridgeService?.advertisedBridgeGeohash() !== undefined
            ? Capability.bridge
            : 0;
        return gateway | bridge;
      },
      // The rendezvous cell we serve (ANNOUNCE TLV 0x06), only while bridging.
      () => this.bridgeService?.advertisedBridgeGeohash(),
    );
    // Re-announce immediately whenever the gateway or bridge toggle flips, so
    // nearby peers learn the capability change without waiting a full cycle.
    this.gatewayUnsub?.();
    this.gatewayUnsub = useSettingsStore.subscribe((state, prev) => {
      if (state.gatewayEnabled !== prev.gatewayEnabled) {
        this.announceManager.announceNow();
      }
    });
    this.bridgeUnsub?.();
    this.bridgeUnsub = useSettingsStore.subscribe((state, prev) => {
      if (state.bridgeEnabled !== prev.bridgeEnabled) {
        this.bridgeService?.setEnabled(state.bridgeEnabled);
        this.announceManager.announceNow();
      }
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
    this.gossip.start(
      {
        peerID: this.identity.peerID,
        signingPrivKey: this.identity.signingPrivKey,
      },
      sendFn,
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
      this.retryQueuedOverInternet();
    }, OUTBOX_SWEEP_INTERVAL_MS);

    // Subscribe to gift-wrap events addressed to our Nostr pubkey.
    this.subscribeNostrInbox();

    // BLE event listeners.
    this.subs = [
      DeviceEventEmitter.addListener(
        "AirhopBLE.linkConnected",
        ({ linkID }: { linkID: string; role: string; rssi: number }) => {
          this.connectedLinks.add(linkID);
          // Immediately send our ANNOUNCE (with Nostr pubkey) to the newly connected peer.
          const pkt = this.announceManager.buildPacket(
            this.identity,
            this.nickname,
            [],
            hexToBytes(this.nostrPubKeyHex),
          );
          this.sendBle(linkID, bytesToBase64(encodePacket(pkt))).catch(
            () => {},
          );
          // Publish our prekey bundle to the new peer so they can seal
          // forward-secret courier mail to us while we are offline.
          this.emitPrekeyBundle();
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
          }
          this.linkToPeer.delete(linkID);
          this.endBurstIfUnreachable();
        },
      ),

      DeviceEventEmitter.addListener(
        "AirhopBLE.packetReceived",
        ({ linkID, dataBase64 }: { linkID: string; dataBase64: string }) => {
          this.handleRaw(linkID, dataBase64);
        },
      ),

      // OS Bluetooth toggle. Drives the "Bluetooth off" banner so an empty mesh
      // is explainable rather than mysterious.
      DeviceEventEmitter.addListener(
        "AirhopBLE.adapterStateChanged",
        ({ enabled }: { enabled: boolean }) => {
          // The banner tracks the switch with no delay: that is a statement
          // about the radio, and it is true the moment the event lands.
          useMeshStateStore.getState().setAdapterEnabled(enabled);
          this.scheduleRadioRestart(enabled);
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

    // Start WiFi direct (MultipeerConnectivity on iOS, WiFi Aware on Android).
    // The native module may not be present on all devices; fails silently.
    NativeAirhopWiFi?.startWiFi().catch(() => {});

    this.subs.push(
      DeviceEventEmitter.addListener(
        "AirhopWiFi.linkConnected",
        ({ linkID }: { linkID: string }) => {
          this.wifiConnectedLinks.add(linkID);
          // Immediately announce ourselves over the new WiFi link.
          const pkt = this.announceManager.buildPacket(
            this.identity,
            this.nickname,
            [],
            hexToBytes(this.nostrPubKeyHex),
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
  }

  // ---------------------------------------------------------------------------

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

    // FRAGMENT packets are flood-routed (so multi-hop file transfers work),
    // then fed into the assembler. When all fragments arrive the reassembled
    // inner packet is routed through routePacket without another flood cycle.
    if (packet.type === PacketType.FRAGMENT) {
      this.floodRouter.receive(packet, (relay) => {
        const b64 = bytesToBase64(encodePacket(relay));
        for (const lid of this.connectedLinks) {
          if (lid === linkID) continue;
          this.sendBle(lid, b64).catch(() => {
            this.connectedLinks.delete(lid);
          });
        }
        for (const wlid of this.wifiConnectedLinks) {
          if (wlid === linkID) continue;
          this.sendWifi(wlid, b64).catch(() => {
            this.wifiConnectedLinks.delete(wlid);
          });
        }
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

    // All other packet types go through flood routing first.
    // Returns false if already seen: drop silently to prevent loops.
    const isNew = this.floodRouter.receive(packet, (relay) => {
      const b64 = bytesToBase64(encodePacket(relay));
      for (const lid of this.connectedLinks) {
        if (lid === linkID) continue; // never relay back on the incoming link
        this.sendBle(lid, b64).catch(() => {
          this.connectedLinks.delete(lid);
        });
      }
      for (const wlid of this.wifiConnectedLinks) {
        if (wlid === linkID) continue;
        this.sendWifi(wlid, b64).catch(() => {
          this.wifiConnectedLinks.delete(wlid);
        });
      }
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
    // Single chokepoint for blocking. Enforcing this per-handler previously
    // missed CHANNEL_MSG, NOISE_ENCRYPTED, FILE_TRANSFER and Nostr, so a
    // blocked peer could still post in channels, DM you, send you files, and
    // resurrect a deleted conversation. Everything that carries content from a
    // peer is dropped here.
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

  // ---------------------------------------------------------------------------
  // Live push-to-talk
  // ---------------------------------------------------------------------------

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
    this.pttPlayback = new NativeAudioPlayback(() => this.liveVoiceAudible);
    this.pttPlayer = new VoicePlayer(this.pttPlayback);
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

  // Whether inbound bursts should actually make sound right now.
  //
  // Set by the open thread: audio plays only when the app is in front of the
  // user and they are looking at the conversation the burst belongs to. Anything
  // else and the burst is still tracked (so "X is talking" stays accurate) but
  // stays silent. Defaults to false, so a burst can never surprise someone
  // whose UI has not told us they are watching. Matches bitchat's
  // liveVoiceEnabled && isAppActive && isViewing.
  setLiveVoiceAudible(audible: boolean): void {
    this.liveVoiceAudible = audible;
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
          ? (payload) =>
              this.router.sendNoisePayload(
                channel.slice(3),
                NoisePayloadType.VOICE_FRAME,
                payload,
              )
          : undefined,
      },
      new NativeAudioCapture(() => {
        // Capture died on its own: a call took the mic, or the encoder gave
        // up. End the burst so the far side gets an END rather than silence.
        void this.stopVoiceBurst();
        onFailure();
      }),
    );
    // Claimed before opening the mic, not after. Two presses landing together
    // would otherwise both pass the guard above, and the second would overwrite
    // the first, leaving a capture session running that nothing could stop.
    this.pttCapture = capture;
    try {
      await capture.startPtt();
    } catch {
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
  } | null> {
    const capture = this.pttCapture;
    this.pttCapture = null;
    if (!capture) return null;
    await capture.stopPtt().catch(() => undefined);
    const bytes = capture.finalizedRecording();
    if (bytes === null) return null;
    return { bytes, durationMs: capture.recordedDurationMs };
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

  // The last peer in range walked off (or Bluetooth dropped) while somebody was
  // still talking. Close the microphone rather than keep encoding audio that
  // now reaches nobody: a walkie-talkie with no one on the other end should
  // stop, not carry on burning battery. The finished recording is still sent
  // as a voice note once a route returns, so nothing said is lost.
  private endBurstIfUnreachable(): void {
    if (this.pttCapture === null) return;
    if (this.connectedLinks.size + this.wifiConnectedLinks.size > 0) return;
    void this.stopVoiceBurst();
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

  // ---------------------------------------------------------------------------
  // Noise XX handshake handlers
  // ---------------------------------------------------------------------------

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
        // Seed the Double Ratchet for Airhop-to-Airhop sessions.
        this.tryInitDR(senderID, "initiator");
        this.flushPendingGroupInvites(senderID);

        const msg3Pkt = this.makeHandshakePacket(packet.senderID.slice(), msg3);
        this.unicastFn(senderID, msg3Pkt);
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
        // Seed the Double Ratchet for Airhop-to-Airhop sessions.
        this.tryInitDR(senderID, "responder");
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

  // Deliver any group invites owed to a peer now that a session exists.
  private flushPendingGroupInvites(peerID: string): void {
    const owed = this.pendingGroupInvites.get(peerID);
    if (owed === undefined || owed.length === 0) return;
    this.pendingGroupInvites.delete(peerID);
    for (const stateBytes of owed) {
      this.router.sendNoisePayload(
        peerID,
        NoisePayloadType.GROUP_INVITE,
        stateBytes,
      );
    }
  }

  // Initialize a Double Ratchet state from the Noise XX static ECDH.
  // Only activated for Airhop peers (those that announced a Nostr pubkey);
  // bitchat nodes don't understand DR_ENCRYPTED and must keep using NOISE_ENCRYPTED.
  private tryInitDR(peerID: string, role: "initiator" | "responder"): void {
    const peer = this.registry.get(peerID);
    // The nostrPubkey field is only populated from ANNOUNCE TLV 0x07, which
    // bitchat iOS and Android never send (0x05 and 0x06 are their capabilities
    // and bridge-cell tags, which we decode and ignore). It is a reliable
    // Airhop indicator.
    // A peer without it keeps the plain Noise transport, still a valid route,
    // hence the flush below runs either way.
    if (peer?.nostrPubkey && peer.noisePubKey) {
      // Both parties derive the same ECDH secret from each other's Noise static
      // public keys. This is identical to the static-static DH in Noise_XX and
      // requires no extra round-trips.
      const dhSeed = x25519.getSharedSecret(
        this.identity.noiseStaticPrivKey,
        peer.noisePubKey,
      );
      const rootKey = hkdf(sha256, dhSeed, undefined, DR_SEED_INFO, 32);

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
  private onNoiseEncrypted(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;

    // Drop packets not addressed to us (relay nodes see everything in the mesh).
    if (bytesToHex(packet.recipientID) !== this.identity.peerID) return;
    if (useBlockedStore.getState().isBlocked(senderID)) return;

    const payload = this.router.decryptDm(packet, senderID);
    if (payload === null) return;
    const channel = `dm:${senderID}`;

    // A live burst from this peer. Confidentiality and authenticity both come
    // from the Noise session it arrived in, so unlike a public burst there is
    // no separate signature to check: getting here at all proves the sender.
    if (payload.type === NoisePayloadType.VOICE_FRAME) {
      if (!useSettingsStore.getState().liveVoiceEnabled) return;
      const player = this.ensurePttPlayer();
      if (player === null) return;
      player.handleBurstPayload(payload.body, senderID);
      this.reportPttActivity();
      return;
    }
    if (payload.type === NoisePayloadType.DELIVERED) {
      const messageId = new TextDecoder().decode(payload.body);
      if (messageId)
        useChatStore
          .getState()
          .setMessageStatus(channel, messageId, "delivered", Date.now());
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
    if (state !== undefined) {
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
    // pubkey (nostr_… thread) or by a real peerID whose contact carries an npub.
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

    // ANNOUNCE packets are self-authenticating: the signing pubkey is in
    // the TLV payload (0x03). Decode first, then verify.
    if ((packet.flags & Flags.SIGNED) !== 0) {
      if (!verifyPacket(packet, info.signingPubKey)) return;
    }

    const peerID = bytesToHex(packet.senderID);
    // Ignore echoes of our own announcements.
    if (peerID === this.identity.peerID) return;
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
    const isDirectAnnounce = packet.ttl === ANNOUNCE_TTL;

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
    const missing = this.gossip.handleFilter(packet);
    if (missing.length === 0) return;

    const isWifi = this.wifiConnectedLinks.has(linkID);
    for (const pkt of missing) {
      const b64 = bytesToBase64(encodePacket(pkt));
      if (isWifi) this.sendWifi(linkID, b64).catch(() => {});
      else this.sendBle(linkID, b64).catch(() => {});
    }
  }

  // ---------------------------------------------------------------------------
  // Courier: store-and-forward for peers we can't reach directly
  // ---------------------------------------------------------------------------

  // Initial spray budget: how many peers may carry a copy.
  private static readonly COURIER_COPIES = 4;

  // Seal a DM to a peer we can't currently reach and hand it to the mesh.
  // Returns false when we can't seal (no Noise key for them yet), so the caller
  // can fall back to the local outbox.
  private sendViaCourier(recipientPeerID: string, text: string): boolean {
    const peer = this.registry.get(recipientPeerID);
    const noisePub = peer?.noisePubKey;
    // Sealing is to their static Noise key; without it there is no envelope to
    // build. (Known from a prior ANNOUNCE or a scanned contact card.)
    if (!noisePub) return false;

    try {
      // Prefer a forward-secret v2 seal when we hold a prekey bundle for them:
      // target a one-time prekey instead of their long-lived static key. Falls
      // back to a v1 static seal when we have no bundle.
      const prekey = this.peerPrekeys.assign(noisePub) ?? undefined;
      const ciphertext = noiseXSeal(
        this.identity.noiseStaticPrivKey,
        prekey?.publicKey ?? noisePub,
        new TextEncoder().encode(text),
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
        copies: MeshService.COURIER_COPIES,
        ciphertext,
        prekeyID: prekey?.id,
      });
      this.broadcastCourierPayload(payload);
      return true;
    } catch {
      return false;
    }
  }

  private broadcastCourierPayload(payload: Uint8Array): void {
    const packet: Packet = {
      type: PacketType.COURIER_ENV,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: new Uint8Array(8), // broadcast: anyone may carry it
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, this.identity.signingPrivKey);

    const b64 = bytesToBase64(encodePacket(packet));
    this.floodRouter.originate(packet);
    for (const linkID of this.connectedLinks) {
      this.sendBle(linkID, b64).catch(() => {});
    }
    for (const linkID of this.wifiConnectedLinks) {
      this.sendWifi(linkID, b64).catch(() => {});
    }
  }

  // An envelope arrived. Either it's addressed to us (open and deliver), or we
  // carry it onward for whoever it belongs to.
  private onCourierEnvelope(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;

    // Is it ours? Check today's tag and yesterday's: an envelope sealed just
    // before a UTC day boundary carries the previous day's tag, and dropping
    // those would silently lose messages once a day.
    const myPub = x25519.getPublicKey(this.identity.noiseStaticPrivKey);
    const now = Date.now();
    const tags = [
      computeRecipientTag(myPub, now),
      computeRecipientTag(myPub, now - 86_400_000),
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

        const text = new TextDecoder().decode(plaintext);
        const channel = `dm:${fromPeerID}`;
        useChatStore.getState().addChannel(channel);
        useChatStore.getState().addMessage({
          id: `courier-${fromPeerID}-${String(packet.timestamp)}`,
          channel,
          senderID: fromPeerID,
          senderNickname: resolveDisplayName(fromPeerID),
          text,
          timestampMs: packet.timestamp,
          isMine: false,
        });

        // Burn the one-time prekey now that it has opened a message, then
        // publish a fresh bundle so senders stop using the spent key.
        if (env.prekeyID !== undefined) {
          this.localPrekeys.consume(env.prekeyID);
          this.emitPrekeyBundle();
        }
      } catch {
        // Not actually decryptable by us: a tag collision. Drop it.
      }
      return;
    }

    // Not ours: carry it. Contacts get the larger quota; everyone else the
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
    for (const env of this.courier.sprayTo(peer.noisePubKey)) {
      this.broadcastCourierPayload(encodeEnvelopePayload(env));
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
  private onLeave(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;

    const signingKey = this.registry.get(senderID)?.signingPubKey;
    if (signingKey === undefined || !verifyPacket(packet, signingKey)) return;

    const linkID = this.peerToLink.get(senderID);
    if (linkID !== undefined) this.linkToPeer.delete(linkID);
    this.peerToLink.delete(senderID);
    this.registry.markIndirect(senderID);
    usePeerStore.getState().removePeer(senderID);
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

  private onChannelMsg(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);

    // Drop our own messages echoed back (shouldn't happen, but guard anyway).
    if (senderID === this.identity.peerID) return;

    // Verify signature against the known sender signing key, if available.
    const peer = this.registry.get(senderID);
    if (
      (packet.flags & Flags.SIGNED) !== 0 &&
      peer?.signingPubKey !== undefined
    ) {
      if (!verifyPacket(packet, peer.signingPubKey)) return;
    }

    const decoded = decodeChannelMsgPayload(packet.payload);
    if (!decoded) return;

    const { channel, text, msgId } = decoded;
    // Public channels are open to anyone in range, so a nickname there is
    // self-asserted and two peers can claim the same one. Suffixing with the
    // peer ID makes impersonation visible, and matches how names are rendered
    // in geohash channels so one person looks the same on both transports.
    const nickname = channelDisplayName(senderID, peer?.nickname);

    // Only accept traffic for channels the user has actually joined.
    //
    // This used to call addChannel() unconditionally, which meant any peer in
    // radio range could inject arbitrary channels into someone's list just by
    // broadcasting one message to a name of their choosing, with no consent, no
    // filtering. Joining is an explicit act (bitchat works the same way: you
    // join a channel by name), so a message for an unknown channel is dropped.
    if (!useChatStore.getState().channels.includes(channel)) return;

    // On the bridged public channel, key the row on the content-stable ID so a
    // radio copy and a bridged copy of the same message collapse to one bubble in
    // either arrival order, and tell the bridge this message is present on the
    // radio so it never re-bridges a local-origin message (loop rule 3).
    const isBridgeChannel = channel === BRIDGE_CHANNEL;
    if (isBridgeChannel) {
      this.bridgeService?.noteRadioMessage(senderID, packet.timestamp, text);
    }

    useChatStore.getState().addMessage({
      // The sender's own ID, shared across BLE and Nostr. Two copies of one
      // message arriving over different transports collapse to a single bubble
      // via the chat store's id dedupe. Falls back to the old scheme for a
      // peer running a build that predates message IDs.
      id: isBridgeChannel
        ? `mesh-${bridgeStableID(senderID, packet.timestamp, text)}`
        : msgId.length > 0
          ? `ch-${msgId}`
          : `${senderID}-${String(packet.timestamp)}-${channel}`,
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

    const peer = this.registry.get(senderID);
    if (
      (packet.flags & Flags.SIGNED) !== 0 &&
      peer?.signingPubKey !== undefined
    ) {
      if (!verifyPacket(packet, peer.signingPubKey)) return;
    }

    const channelKeys = useChatStore.getState().channelKeys;
    for (const [channel, keyB64] of Object.entries(channelKeys)) {
      const opened = openChannelMessage(keyB64, packet.payload);
      if (opened === null) continue;
      const nickname = channelDisplayName(senderID, peer?.nickname);
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

  // ---- Public API -----------------------------------------------------------

  // Broadcast to a channel over every transport that channel spans.
  //
  // BLE always carries it (that's the offline guarantee). Location-scoped
  // channels ALSO publish to their geohash cell over Nostr, so someone in the
  // same city but out of Bluetooth range actually receives it, which is what
  // "#city" claimed to do all along. #bluetooth is never bridged.
  // Returns where the message actually went, so the UI can tell the user when
  // it reached nobody. Previously this returned void and a broadcast with zero
  // connected links was dropped on the floor while the bubble looked sent.
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
      return { msgId, bleLinks, nostr: overNostr };
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

    return { msgId, bleLinks: teleported ? 0 : bleLinks, nostr: viaGeo };
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

  // Nearby geohash channel participants, for the channel info sheet.
  getGeoParticipants(channel: string): GeoParticipant[] {
    return this.geoChannels?.participantsFor(channel) ?? [];
  }

  // Start (or resume) an encrypted geohash DM with a channel participant. Binds
  // their per-cell pubkey to this channel's geohash so a reply is sent from our
  // matching per-cell identity. The caller then opens dm:nostr_<pubkey>.
  openGeoDm(channel: string, pubkey: string): void {
    const geohash = this.geoChannels?.geohashFor(channel);
    if (geohash) this.geoChannels?.registerGeoDmPeer(pubkey, geohash);
  }

  // The geohash a location channel currently resolves to, or null when
  // location is unavailable and the channel is therefore BLE-only.
  getChannelGeohash(channel: string): string | null {
    return this.geoChannels?.geohashFor(channel) ?? null;
  }

  // ---- Bulletin board -------------------------------------------------------

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
    if (geohash.length === 0) return "#bluetooth";
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
      post.authorNickname.length > 0 ? post.authorNickname : "Someone";
    useActivityStore.getState().record({
      id: bytesToHex(post.postID),
      channel: this.channelForNoticeGeohash(post.geohash),
      isDM: false,
      senderID: bytesToHex(post.authorSigningKey),
      senderNickname: nickname,
      preview: `${isUrgent(post) ? "Urgent notice · " : "Notice · "}${post.content}`,
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

  // ---- One-time prekeys (0x24) ----------------------------------------------

  // Publish our signed prekey bundle so senders can seal forward-secret courier
  // mail to a one-time key. Broadcast + gossiped; idempotent to call often.
  private emitPrekeyBundle(): void {
    const bundle = this.localPrekeys.buildBundle(
      this.identity.noiseStaticPubKey,
      this.identity.signingPrivKey,
    );
    if (bundle === null) return;
    const payload = encodePrekeyBundle(bundle);
    if (payload === null) return;
    const packet: Packet = {
      type: PacketType.PREKEY_BUNDLE,
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

  // ---- Private groups (0x25) ------------------------------------------------

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
        const owed = this.pendingGroupInvites.get(peerID) ?? [];
        owed.push(stateBytes);
        this.pendingGroupInvites.set(peerID, owed);
        this.ensureNoiseSession(peerID);
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
    const owed = this.pendingGroupInvites.get(peerID) ?? [];
    owed.push(stateBytes);
    this.pendingGroupInvites.set(peerID, owed);
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

    // A creator-signed roster that no longer lists us is a removal: drop the
    // group's key and its chat locally so it disappears from Your Rooms. (The
    // notice carries a throwaway zero key, so there is nothing to keep anyway.)
    if (!state.members.some((m) => m.fingerprint === myFingerprint)) {
      if (useGroupStore.getState().get(groupIDHex) !== undefined) {
        useGroupStore.getState().remove(groupIDHex);
        useChatStore.getState().removeChannel(channel);
      }
      return;
    }

    // First time we see this group is a genuine "you were added" — surface it
    // as a local system notice so the new room isn't a silent surprise.
    const wasNew = useGroupStore.getState().get(groupIDHex) === undefined;
    useGroupStore.getState().upsertFromState(state);
    useChatStore.getState().addChannel(channel);
    if (wasNew) {
      const nowMs = Date.now();
      useChatStore.getState().addMessage({
        id: `sys-group-join-${groupIDHex}`,
        channel,
        senderID: "",
        senderNickname: "",
        text: `You were added to ${state.name}.`,
        timestampMs: nowMs,
        isMine: false,
        isSystem: true,
      });
      // Ring the bell too, so the invite is discoverable without opening the room.
      const creator = state.members.find(
        (m) => m.fingerprint === state.creatorFingerprint,
      );
      useActivityStore.getState().record({
        id: `group-join-${groupIDHex}`,
        channel,
        isDM: false,
        senderID: state.creatorFingerprint.slice(0, 16),
        senderNickname: creator?.nickname ?? state.name,
        preview: `Added you to ${state.name}`,
        timestampMs: nowMs,
      });
    }
  }

  // Seal a message under the group's current epoch key and broadcast it as a
  // 0x25 packet. The caller supplies the messageID (shared with the optimistic
  // UI echo) and renders the local copy itself, so this does not echo. Returns
  // false when we do not hold the group.
  sendGroupMessage(
    groupIDHex: string,
    text: string,
    messageID: string,
  ): boolean {
    const group = useGroupStore.getState().get(groupIDHex);
    if (group === undefined) return false;
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
    if (payload === null) return false;

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
    return true;
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

    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return; // our own echo
    if (useBlockedStore.getState().isBlocked(senderID)) return;

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
        name: "Incoming file",
        totalBytes: p.total * FRAG_DATA_SIZE,
        startedAtMs: Date.now(),
      });
    }
    if (p.received >= p.total) store.finish(id);
    else store.advance(id, p.receivedBytes);
  }

  // ---- Gateway carrier (0x28) -----------------------------------------------

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

    // Per-depositor rate limit so one peer cannot make us flood relays.
    if (!this.allowUplinkDeposit(depositor)) return;

    // Record it as ours before publishing: when our own relay subscription
    // echoes it back, the downlink rebroadcaster must not push it onto the mesh
    // again (the originating peer and its neighbours already hold the BLE copy).
    this.rememberEventID(this.publishedEventIDs, event.id);
    this.geoChannels?.publishCarriedEvent(event, carrier.geohash);
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

  // ---- Gateway origination (0x28) -------------------------------------------

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

  // ---- Mesh diagnostics (ping / pong) ---------------------------------------

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

    const result = this.trySendDm(recipientPeerID, text, msgID);
    if (result === "needs-courier") {
      // No direct route. Hand a sealed copy to the mesh so any peer that meets
      // the recipient can deliver it, AND keep our own copy queued in case they
      // simply walk back to us. The two paths are complementary, and the
      // recipient dedupes by message id if both arrive.
      const carried = this.sendViaCourier(recipientPeerID, text);
      // Genuinely queue it. This used to be dropped while the UI said
      // "queued for delivery" while the message was gone for good, even if the
      // peer reappeared moments later.
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
  ): "sent" | "sent-nostr" | "needs-courier" {
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
    const canReachMesh = hasDirectLink || this.connectedLinks.size > 0;
    if (drState !== undefined && canReachMesh) {
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
      return "sent";
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
  ): boolean {
    const reached = channel.startsWith("dm:")
      ? this.peerToLink.has(channel.slice(3)) ||
        this.wifiPeerToLink.has(channel.slice(3))
      : this.connectedLinks.size + this.wifiConnectedLinks.size > 0;
    if (!reached) return false;
    this.fileXfer.sendBytes(bytes, meta, channel);
    return true;
  }

  // ---- Payment helpers (used by wallet feature layer) ----------------------

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
  addVerifiedContact(card: {
    peerID: string;
    noisePubKey: Uint8Array;
    signingPubKey: Uint8Array;
    nickname: string;
    nostrPubKey?: Uint8Array;
  }): boolean {
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
  private flushOutbox(peerID: string): void {
    const outbox = useOutboxStore.getState();
    outbox.evictExpired();
    const queued = outbox.forPeer(peerID);
    if (queued.length === 0) return;

    for (const msg of queued) {
      // Reuse the queued id so the retried send keeps the same message id, and
      // a delivery receipt still lands on the original bubble.
      const result = this.trySendDm(peerID, msg.text, msg.id);
      if (result === "needs-courier") {
        // Still no route, so leave it queued and record the attempt.
        outbox.markAttempted(msg.id);
        // A peer with no route now won't have one for the rest of this batch
        // either; stop rather than burning attempts on every queued message.
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
      outbox.resolve(msg.id);
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
  private retryQueuedOverInternet(): void {
    const outbox = useOutboxStore.getState();
    outbox.evictExpired();
    const peerIDs = new Set(outbox.pending.map((m) => m.recipientPeerID));
    for (const peerID of peerIDs) {
      const hasDirectLink =
        this.peerToLink.has(peerID) || this.wifiPeerToLink.has(peerID);
      if (hasDirectLink) continue;
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
  // broadcast our own presence.
  setDiscoverable(enabled: boolean): void {
    if (enabled) {
      AirhopBLE.startAdvertising(BLE_SERVICE_UUID, this.identity.peerID).catch(
        () => {},
      );
    } else {
      AirhopBLE.stopAdvertising().catch(() => {});
    }
  }

  // Bring the radios back after the Bluetooth switch settles.
  //
  // Two reasons this waits instead of acting on the event. Android broadcasts
  // STATE_ON as the adapter comes up, not once it is usable, and a scan or
  // advertise issued in that window is quietly dropped by the stack, leaving the
  // app idle with Bluetooth apparently on. And someone flipping the switch back
  // and forth generates a burst of events, each of which would otherwise kick
  // off a full scan + advertise + GATT server + foreground service cycle.
  //
  // One pending restart at a time, re-armed on every event, so a burst collapses
  // into a single restart driven by wherever the switch ended up. Turning it off
  // just cancels the pending work; there is nothing to start.
  private scheduleRadioRestart(enabled: boolean): void {
    if (this.radioRestartTimer !== null) {
      clearTimeout(this.radioRestartTimer);
      this.radioRestartTimer = null;
    }
    if (!enabled) return;
    this.radioRestartTimer = setTimeout(() => {
      this.radioRestartTimer = null;
      // Re-read rather than trusting the event that armed this: the switch may
      // have gone off again while we waited.
      if (!useMeshStateStore.getState().adapterEnabled) return;
      this.retryRadios();
    }, ADAPTER_SETTLE_MS);
  }

  // Re-issue the BLE calls that a missing permission (or a radio that was off)
  // silently swallowed. Both native calls are idempotent, so calling this when
  // the radios are already up costs nothing - which is what makes it safe to
  // fire from a resume handler that cannot know whether it is needed.
  //
  // Not the same as refresh(): that assumes a working mesh and re-scans for
  // peers. This is the recovery path for a mesh that never got off the ground.
  retryRadios(): void {
    if (!this.running) return;
    AirhopBLE.startScanning([BLE_SERVICE_UUID]).catch(() => {});
    // Invisible is a deliberate choice to not advertise, so honour it: coming
    // back with a fresh permission must not quietly make someone discoverable.
    if (useMeshStateStore.getState().presenceStatus !== "invisible") {
      AirhopBLE.startAdvertising(BLE_SERVICE_UUID, this.identity.peerID).catch(
        () => {},
      );
    }
  }

  // Pull-to-refresh hook: kick the BLE scan again, drop stale peers, and
  // re-resolve the geohash channels (picks up a moved location cell and
  // re-subscribes). Safe to call repeatedly: startScanning is idempotent on the
  // native side, the Nostr relay pool auto-reconnects, and geoChannels.refresh
  // only re-subscribes cells that actually changed.
  refresh(): void {
    usePeerStore.getState().evictStale();
    AirhopBLE.startScanning([BLE_SERVICE_UUID]).catch(() => {});
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
        // Relays coming up while bridging turns us into a serving bridge (we can
        // now publish + advertise a cell): refresh presence/subscription and push
        // a fresh announce so mesh-only peers discover us.
        if (connected && this.bridgeService !== null) {
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
          const dm = unwrapDm(event, this.nostrPrivKey);
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
      }
    } else {
      this.teardownNostr();
    }
    // The gateway capability we advertise depends on internet being on, so push
    // a fresh announce now rather than waiting for the next cycle.
    this.announceManager.announceNow();
  }

  stop(): void {
    this.running = false;
    // Drop any pending radio restart: a Bluetooth flip a moment before Away (or
    // a panic wipe) must not bring the radios back up after the mesh is down.
    if (this.radioRestartTimer !== null) {
      clearTimeout(this.radioRestartTimer);
      this.radioRestartTimer = null;
    }
    // Say goodbye while the links are still up, before tearing anything down.
    try {
      this.sendLeave();
    } catch {
      // Never let a courtesy broadcast block shutdown.
    }
    this.announceManager.stop();
    this.gossip.stop();
    this.floodRouter.flush();
    for (const sub of this.subs) sub.remove();
    this.subs = [];
    this.chatUnsub?.();
    this.chatUnsub = null;
    this.gatewayUnsub?.();
    this.gatewayUnsub = null;
    this.liveVoiceUnsub?.();
    this.liveVoiceUnsub = null;
    this.bridgeUnsub?.();
    this.bridgeUnsub = null;
    this.contactsUnsub?.();
    this.contactsUnsub = null;
    if (this.outboxSweepTimer !== null) {
      clearInterval(this.outboxSweepTimer);
      this.outboxSweepTimer = null;
    }
    this.privateChannels?.stop();
    this.privateChannels = null;
    this.geoChannels?.stop();
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
    // The relay pool is gone, so the internet bridge is down. Reset explicitly
    // rather than relying on close() to fire per-relay failure callbacks.
    useMeshStateStore.getState().setNostrConnected(false);
    AirhopBLE.stopScanning().catch(() => {});
    AirhopBLE.stopAdvertising().catch(() => {});
    NativeAirhopWiFi?.stopWiFi().catch(() => {});
    // A burst cannot outlive the radios carrying it: close the mic and the
    // speaker before the links go, so nothing is left recording into a mesh
    // that is no longer there.
    this.closeVoice();
    // The radios are down, so anyone in the peer list is now stale. Clear it so
    // a stopped mesh (Away, or a wipe) shows an empty radar instead of lingering
    // peers that imply a live mesh. Peers repopulate from ANNOUNCE on restart.
    usePeerStore.getState().clearAll();
  }
}

// ---- Singleton access -------------------------------------------------------

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
  _instance?.stop();
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
  _instance?.stop();
  _instance = null;
}
