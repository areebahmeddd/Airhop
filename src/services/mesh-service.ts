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
import { getPublicKey } from "nostr-tools";
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
import { NoiseHandshake } from "../core/crypto/noise-xx";
import {
  ANNOUNCE_TTL,
  AnnounceManager,
  decodeAnnouncePayload,
} from "../core/mesh/announce-manager";
import {
  computeRecipientTag,
  CourierStore,
  decodeEnvelopePayload,
  encodeEnvelopePayload,
} from "../core/mesh/courier-store";
import { FloodRouter } from "../core/mesh/flood-router";
import { FragmentManager } from "../core/mesh/fragment-manager";
import { GossipSync } from "../core/mesh/gossip-sync";
import {
  decodePacket,
  encodePacket,
  Flags,
  PacketType,
  signPacket,
  verifyPacket,
  type Packet,
} from "../core/mesh/packet-codec";
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
import { useBlockedStore } from "../store/blocked-store";
import { useChatStore } from "../store/chat-store";
import { useContactsStore } from "../store/contacts-store";
import { useMeshStateStore } from "../store/mesh-state-store";
import { useOutboxStore } from "../store/outbox-store";
import { usePeerStore } from "../store/peer-store";
import { channelDisplayName, resolveDisplayName } from "../utils/display-name";
import {
  FileTransferService,
  type AttachmentMeta,
} from "./file-transfer-service";
import {
  GeohashChannelService,
  isGeoChannel,
  type GeoParticipant,
} from "./geohash-channel-service";

// ---- Constants --------------------------------------------------------------

const BLE_SERVICE_UUID = "F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C";

// HKDF info string used to derive the Double Ratchet root key from the
// Noise XX static ECDH result. Airhop-to-Airhop only: bitchat nodes never
// receive DR_ENCRYPTED packets.
const DR_SEED_INFO = new TextEncoder().encode("airhop-dr-seed-v1");

// Where a channel message actually went. `bleLinks === 0 && !nostr` means it
// reached nobody. The UI must say so rather than render a normal sent bubble.
export interface ChannelSendResult {
  msgId: string;
  bleLinks: number;
  nostr: boolean;
}

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

// ---- MeshService ------------------------------------------------------------

export class MeshService {
  private readonly identity: Identity;
  // Derived secp256k1 key pair for Nostr DMs, deterministically derived from the Ed25519 signing key.
  private readonly nostrPrivKey: Uint8Array;
  private readonly nostrPubKeyHex: string;
  // Maps a remote peer's Nostr pubkey hex to their peerID, populated as ANNOUNCEs arrive.
  private readonly nostrPubkeyToPeerID = new Map<string, string>();

  private readonly floodRouter = new FloodRouter();
  private readonly registry = new PeerRegistry();
  private readonly announceManager = new AnnounceManager();
  private readonly router: MessageRouter;
  private nostrClient: NostrClient | null = null;
  // Location-scoped channels bridged over Nostr. Null until the Nostr client
  // exists; inert when location permission is unavailable.
  private geoChannels: GeohashChannelService | null = null;

  // Currently connected BLE link IDs.
  private readonly connectedLinks = new Set<string>();
  // peerID (16 hex) → linkID for unicast to direct neighbours.
  private readonly peerToLink = new Map<string, string>();
  // linkID to peerID (16 hex): used to clean up on disconnect.
  private readonly linkToPeer = new Map<string, string>();
  // In-progress Noise XX handshakes keyed by remote peerID.
  private readonly pendingHandshakes = new Map<
    string,
    {
      handshake: NoiseHandshake;
      role: "initiator" | "responder";
      pendingText: string[]; // messages queued while handshake is in progress
    }
  >();

  // Double Ratchet states keyed by peerID. Only set for Airhop-to-Airhop
  // sessions (peers who announced a Nostr pubkey). bitchat peers continue
  // using plain NOISE_ENCRYPTED transport.
  private readonly drStates = new Map<string, RatchetState>();

  // Fragment reassembly: collects 469-byte FRAGMENT packets into full packets.
  private readonly fragmentManager = new FragmentManager();

  // Store-and-forward courier. Holds sealed envelopes addressed to OTHER peers
  // and hands them on when we meet someone new, the mesh equivalent of
  // carrying a letter. Complements the outbox: the outbox retries when the
  // recipient comes back to us, the courier lets a third party carry it to them.
  private readonly courier = new CourierStore();

  // Gossip reconciliation. Peers periodically broadcast a compact GCS filter of
  // the packet IDs they've seen; anyone holding something absent from that
  // filter replays it. This is how a peer that was out of range catches up on
  // channel traffic it missed, instead of that history being lost forever.
  private readonly gossip = new GossipSync();

  // File transfer pipeline: chunk encoding/reassembly and cache writing.
  // Initialized in the constructor so it can share broadcastFn / unicastFn.
  private readonly fileXfer!: FileTransferService;

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
      // Fall back to BLE.
      const linkID = this.peerToLink.get(recipientPeerID);
      if (!linkID) return;
      this.floodRouter.originate(packet);
      this.sendBle(linkID, bytesToBase64(encodePacket(packet))).catch(() => {});
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
      if (!this.nostrClient) return;
      const { event } = wrapDm(text, this.nostrPrivKey, recipientNostrPubkey);
      await this.nostrClient.publish(event);
    };

    this.router = new MessageRouter(
      routerIdentity,
      this.registry,
      broadcastFn,
      unicastFn,
      nostrSendFn,
    );
  }

  // Start BLE advertising, scanning, and the periodic ANNOUNCE timer.
  start(nickname: string): void {
    this.nickname = nickname;

    // Seed the radio state before any change event fires. Otherwise launching
    // with Bluetooth already off would look like "scanning, no peers yet".
    AirhopBLE.isAdapterEnabled()
      .then((enabled) => {
        useMeshStateStore.getState().setAdapterEnabled(enabled);
      })
      .catch(() => {
        // iOS has no such method; CoreBluetooth reports via adapterStateChanged.
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
    );

    // Periodic gossip filter, so peers can tell us what they're missing.
    this.gossip.start(
      {
        peerID: this.identity.peerID,
        signingPrivKey: this.identity.signingPrivKey,
      },
      sendFn,
    );

    // Connect to Nostr relays for internet-bridged DMs.
    this.nostrClient = new NostrClient({ relays: [] });

    // Location-scoped channels. Constructed unconditionally: it resolves its
    // own position and stays inert if permission was never granted, so the
    // location prompt is never forced on someone who only wants BLE.
    // Signed with per-geohash derived keys, NOT our main Nostr identity. See
    // geohash-identity.ts. Passing the Ed25519 signing key lets the service
    // derive its own seed without a second stored secret.
    this.geoChannels = new GeohashChannelService(
      this.nostrClient,
      this.identity.signingPrivKey,
      nickname,
    );
    void this.geoChannels.refresh();
    // Subscribe to gift-wrap events addressed to our Nostr pubkey.
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
          const peer = peerID ? this.registry.get(peerID) : undefined;
          useChatStore.getState().addChannel(channel);
          useChatStore.getState().addMessage({
            id: `nostr-${event.id}`,
            channel,
            senderID: senderKey,
            senderNickname:
              peer?.nickname ?? `npub…${dm.senderPubkey.slice(-6)}`,
            text: dm.content,
            timestampMs: dm.timestamp * 1000,
            isMine: false,
          });
        } catch {
          // Invalid or misdirected gift wrap: drop silently.
        }
      },
    );

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
          useMeshStateStore.getState().setAdapterEnabled(enabled);
          // Radio came back: restart scan/advertise, which the OS dropped when
          // it was switched off.
          if (enabled) {
            AirhopBLE.startScanning([BLE_SERVICE_UUID]).catch(() => {});
            AirhopBLE.startAdvertising(
              BLE_SERVICE_UUID,
              this.identity.peerID,
            ).catch(() => {});
          }
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
      this.fragmentManager.receive(packet.senderID, packet.payload, (inner) => {
        this.routePacket(inner, linkID);
      });
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
      case PacketType.NOISE_HANDSHAKE:
        this.onNoiseHandshake(packet, linkID);
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
      default:
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Noise XX handshake handlers
  // ---------------------------------------------------------------------------

  // Dispatch an incoming NOISE_HANDSHAKE packet through the correct leg of
  // the three-message Noise XX exchange, then call split() once the handshake
  // is complete and flush any messages that were queued in the interim.
  private onNoiseHandshake(packet: Packet, incomingLinkID: string): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;

    // Only the intended recipient should process this. Relay nodes see these
    // packets too (via flood routing) but must not act on them.
    if (bytesToHex(packet.recipientID) !== this.identity.peerID) return;

    const pending = this.pendingHandshakes.get(senderID);

    if (!pending) {
      // Responder path: first message is msg1 (32 bytes: remote ephemeral key).
      if (packet.payload.length !== 32) return;
      try {
        const hs = NoiseHandshake.createResponder(
          this.identity.noiseStaticPrivKey,
        );
        hs.readMsg1(packet.payload);
        const msg2 = hs.writeMsg2(); // 96 bytes
        this.pendingHandshakes.set(senderID, {
          handshake: hs,
          role: "responder",
          pendingText: [],
        });
        const reply = this.makeHandshakePacket(packet.senderID.slice(), msg2);
        const lid = this.peerToLink.get(senderID) ?? incomingLinkID;
        this.sendBle(lid, bytesToBase64(encodePacket(reply))).catch(() => {});
      } catch {
        this.pendingHandshakes.delete(senderID);
      }
      return;
    }

    if (pending.role === "initiator") {
      // Initiator path: this is msg2 (96 bytes) from the responder.
      if (packet.payload.length !== 96) return;
      try {
        pending.handshake.readMsg2(packet.payload);
        const msg3 = pending.handshake.writeMsg3(); // 64 bytes
        const session = pending.handshake.split();
        this.registry.setSession(senderID, session);
        // Seed the Double Ratchet for Airhop-to-Airhop sessions.
        this.tryInitDR(senderID, "initiator");

        const msg3Pkt = this.makeHandshakePacket(packet.senderID.slice(), msg3);
        const lid = this.peerToLink.get(senderID) ?? incomingLinkID;
        this.sendBle(lid, bytesToBase64(encodePacket(msg3Pkt))).catch(() => {});
        // Flush queued messages. Use this.sendDm so they go through DR if ready.
        const queued = pending.pendingText.slice();
        this.pendingHandshakes.delete(senderID);
        for (const text of queued) this.sendDm(senderID, text);
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
        this.registry.setSession(senderID, session);
        // Seed the Double Ratchet for Airhop-to-Airhop sessions.
        this.tryInitDR(senderID, "responder");
      } catch {}
      this.pendingHandshakes.delete(senderID);
    }
  }

  // Initialize a Double Ratchet state from the Noise XX static ECDH.
  // Only activated for Airhop peers (those that announced a Nostr pubkey);
  // bitchat nodes don't understand DR_ENCRYPTED and must keep using NOISE_ENCRYPTED.
  private tryInitDR(peerID: string, role: "initiator" | "responder"): void {
    const peer = this.registry.get(peerID);
    // The nostrPubkey field is only populated from ANNOUNCE TLV 0x05, which
    // bitchat iOS and Android never send. It is a reliable Airhop indicator.
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

  // Decrypt an incoming NOISE_ENCRYPTED DM and push it to the chat store.
  private onNoiseEncrypted(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;

    // Drop packets not addressed to us (relay nodes see everything in the mesh).
    if (bytesToHex(packet.recipientID) !== this.identity.peerID) return;

    const text = this.router.decryptDm(packet, senderID);
    if (text === null) return;

    const peer = this.registry.get(senderID);
    const nickname = peer?.nickname ?? senderID.slice(0, 8);
    const channel = `dm:${senderID}`;
    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      id: `${senderID}-${String(packet.timestamp)}-ble`,
      channel,
      senderID,
      senderNickname: nickname,
      text,
      timestampMs: packet.timestamp * 1000,
      isMine: false,
    });
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

    const text = new TextDecoder().decode(plaintext);
    const peer = this.registry.get(senderID);
    const nickname = peer?.nickname ?? senderID.slice(0, 8);
    const channel = `dm:${senderID}`;
    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      id: `${senderID}-${String(packet.timestamp)}-dr`,
      channel,
      senderID,
      senderNickname: nickname,
      text,
      timestampMs: packet.timestamp * 1000,
      isMine: false,
    });
  }

  // Build and sign a NOISE_HANDSHAKE unicast packet from our identity.
  private makeHandshakePacket(
    recipientID: Uint8Array,
    payload: Uint8Array,
  ): Packet {
    const packet: Packet = {
      type: PacketType.NOISE_HANDSHAKE,
      ttl: 7,
      flags: Flags.HAS_RECIPIENT | Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID,
      timestamp: Math.floor(Date.now() / 1000),
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, this.identity.signingPrivKey);
    return packet;
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

  // How long a sealed envelope stays worth carrying. Matches the outbox TTL so
  // the two delivery mechanisms give up at the same time.
  private static readonly COURIER_TTL_MS = 7 * 24 * 60 * 60 * 1000;
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
      const ciphertext = noiseXSeal(
        this.identity.noiseStaticPrivKey,
        noisePub,
        new TextEncoder().encode(text),
      );
      const payload = encodeEnvelopePayload({
        // Tag is derived from the recipient's key + today's epoch day, so
        // carriers can match deliveries without learning who it is for.
        recipientTag: computeRecipientTag(noisePub),
        expiryMs: Date.now() + MeshService.COURIER_TTL_MS,
        copies: MeshService.COURIER_COPIES,
        ciphertext,
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
      timestamp: Math.floor(Date.now() / 1000),
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
      try {
        const { plaintext, senderStaticPubKey } = noiseXOpen(
          this.identity.noiseStaticPrivKey,
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
          timestampMs: packet.timestamp * 1000,
          isMine: false,
        });
      } catch {
        // Not actually decryptable by us: a tag collision. Fall through and
        // carry it like any other envelope.
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
  // Deliberately does NOT tear down crypto state: LEAVE is unauthenticated
  // relative to a session (any relay forwards it), so acting on it beyond
  // presence would let a third party force-drop other peers' sessions.
  private onLeave(packet: Packet): void {
    const senderID = bytesToHex(packet.senderID);
    if (senderID === this.identity.peerID) return;

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
      timestamp: Math.floor(Date.now() / 1000),
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

    useChatStore.getState().addMessage({
      // The sender's own ID, shared across BLE and Nostr. Two copies of one
      // message arriving over different transports collapse to a single bubble
      // via the chat store's id dedupe. Falls back to the old scheme for a
      // peer running a build that predates message IDs.
      id:
        msgId.length > 0
          ? `ch-${msgId}`
          : `${senderID}-${String(packet.timestamp)}-${channel}`,
      channel,
      senderID,
      senderNickname: nickname,
      text,
      timestampMs: packet.timestamp * 1000,
      isMine: false,
    });
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
  sendChannelMessage(channel: string, text: string): ChannelSendResult {
    // One ID shared by the local echo, the BLE packet and the Nostr event, so
    // a receiver on both transports sees one message rather than two.
    const msgId = newMessageId();
    this.router.sendChannelMessage(channel, text, msgId);

    const bleLinks = this.connectedLinks.size + this.wifiConnectedLinks.size;
    const viaGeo =
      this.geoChannels !== null &&
      isGeoChannel(channel) &&
      this.geoChannels.geohashFor(channel) !== null;

    if (viaGeo) void this.geoChannels?.publish(channel, text, msgId);

    return { msgId, bleLinks, nostr: viaGeo };
  }

  // Nearby geohash channel participants, for the channel info sheet.
  getGeoParticipants(channel: string): GeoParticipant[] {
    return this.geoChannels?.participantsFor(channel) ?? [];
  }

  // The geohash a location channel currently resolves to, or null when
  // location is unavailable and the channel is therefore BLE-only.
  getChannelGeohash(channel: string): string | null {
    return this.geoChannels?.geohashFor(channel) ?? null;
  }

  // Re-resolve position and re-subscribe geo channels. Called on pull-to-refresh
  // and after the user joins a new location channel.
  refreshGeoChannels(): void {
    void this.geoChannels?.refresh();
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
  ): "sent" | "sent-nostr" | "needs-courier" {
    // A Nostr-only correspondent (we've never heard their ANNOUNCE, so we have
    // no peerID for them). There is no mesh route to look up, so reply over the
    // same transport their message arrived on.
    if (recipientPeerID.startsWith("nostr_")) {
      const pubkey = recipientPeerID.slice("nostr_".length);
      if (this.nostrClient !== null) {
        const { event } = wrapDm(text, this.nostrPrivKey, pubkey);
        void this.nostrClient.publish(event).catch(() => {});
        return "sent-nostr";
      }
      // Offline: queue it, keyed by the same identifier so a later flush
      // resolves to this branch again once relays are reachable.
      useOutboxStore.getState().enqueue({
        id: messageID ?? `outbox-${recipientPeerID}-${String(Date.now())}`,
        recipientPeerID,
        channel: `dm:${recipientPeerID}`,
        text,
        createdAtMs: Date.now(),
      });
      return "needs-courier";
    }

    const result = this.trySendDm(recipientPeerID, text);
    if (result === "needs-courier") {
      // No direct route. Hand a sealed copy to the mesh so any peer that meets
      // the recipient can deliver it, AND keep our own copy queued in case they
      // simply walk back to us. The two paths are complementary, and the
      // recipient dedupes by message id if both arrive.
      this.sendViaCourier(recipientPeerID, text);
      // Genuinely queue it. This used to be dropped while the UI said
      // "queued for delivery" while the message was gone for good, even if the
      // peer reappeared moments later.
      useOutboxStore.getState().enqueue({
        id: messageID ?? `outbox-${recipientPeerID}-${String(Date.now())}`,
        recipientPeerID,
        channel: `dm:${recipientPeerID}`,
        text,
        createdAtMs: Date.now(),
      });
    }
    return result;
  }

  // Attempt delivery over the best available transport, without queueing.
  private trySendDm(
    recipientPeerID: string,
    text: string,
  ): "sent" | "sent-nostr" | "needs-courier" {
    // Priority 1: Double Ratchet over a direct link (Airhop-to-Airhop only).
    // DR provides per-message forward secrecy beyond Noise transport.
    const drState = this.drStates.get(recipientPeerID);
    const hasDirectLink =
      this.peerToLink.has(recipientPeerID) ||
      this.wifiPeerToLink.has(recipientPeerID);
    if (drState !== undefined && hasDirectLink) {
      this.sendDRMessage(recipientPeerID, text, drState);
      return "sent";
    }

    // Priority 2: Noise XX handshake if BLE-direct but no session yet.
    const peer = this.registry.get(recipientPeerID);
    if (
      peer !== undefined &&
      peer.session === undefined &&
      this.peerToLink.has(recipientPeerID)
    ) {
      const existing = this.pendingHandshakes.get(recipientPeerID);
      if (existing) {
        existing.pendingText.push(text);
      } else {
        const hs = NoiseHandshake.createInitiator(
          this.identity.noiseStaticPrivKey,
        );
        const msg1 = hs.writeMsg1();
        this.pendingHandshakes.set(recipientPeerID, {
          handshake: hs,
          role: "initiator",
          pendingText: [text],
        });
        const pkt = this.makeHandshakePacket(hexToBytes(recipientPeerID), msg1);
        const linkID = this.peerToLink.get(recipientPeerID)!;
        this.sendBle(linkID, bytesToBase64(encodePacket(pkt))).catch(() => {});
      }
      return "sent";
    }

    // Priority 3: Nostr internet bridge or courier relay.
    return this.router.sendDm(recipientPeerID, text);
  }

  // Encrypt and send a Double Ratchet message to a peer with a direct link.
  private sendDRMessage(
    peerID: string,
    text: string,
    state: RatchetState,
  ): void {
    const ciphertext = ratchetEncrypt(state, new TextEncoder().encode(text));
    const pkt: Packet = {
      type: PacketType.DR_ENCRYPTED,
      ttl: 7,
      flags: Flags.HAS_RECIPIENT | Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: hexToBytes(peerID),
      timestamp: Math.floor(Date.now() / 1000),
      signature: new Uint8Array(64),
      payload: ciphertext,
    };
    pkt.signature = signPacket(pkt, this.identity.signingPrivKey);
    this.unicastFn(peerID, pkt);
  }

  // Send a file attachment over the mesh. Chunks the bytes into 64 KB FILE_TRANSFER
  // packets, fragments each to 469 bytes, and routes via unicast (DM) or broadcast
  // (channel). The receiver reconstructs, saves to cache, and adds a ChatMessage.
  sendAttachment(
    channel: string,
    bytes: Uint8Array,
    meta: AttachmentMeta,
  ): void {
    this.fileXfer.sendBytes(bytes, meta, channel);
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

  // The local identity as a shareable contact card, for QR and NFC exchange.
  // Includes the public keys so a scanner can verify the peerID binding and
  // start an encrypted session without first hearing our ANNOUNCE.
  getContactCard(): ContactCard {
    return {
      peerID: this.identity.peerID,
      noisePubKey: this.identity.noiseStaticPubKey,
      signingPubKey: this.identity.signingPubKey,
      nickname: this.nickname,
    };
  }

  // Register an identity learned out-of-band (QR / NFC) so a DM route can be
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
  }): boolean {
    const derived = bytesToHex(sha256(card.noisePubKey)).slice(0, 16);
    if (derived !== card.peerID.toLowerCase()) return false;

    // Seed the routing registry so sendDm can pick a transport immediately.
    // Note this does NOT touch peer-store: being a contact is not evidence of
    // being nearby, and the Mesh tab must keep meaning "in range right now".
    this.registry.update({
      peerID: card.peerID,
      noisePubKey: card.noisePubKey,
      signingPubKey: card.signingPubKey,
      nickname: card.nickname,
    });

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
      const result = this.trySendDm(peerID, msg.text);
      if (result === "needs-courier") {
        // Still no route, so leave it queued and record the attempt.
        outbox.markAttempted(msg.id);
        // A peer with no route now won't have one for the rest of this batch
        // either; stop rather than burning attempts on every queued message.
        break;
      }
      outbox.resolve(msg.id);
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

  // Pull-to-refresh hook: kick the BLE scan again and drop stale peers.
  // Safe to call repeatedly: startScanning is idempotent on the native side,
  // and the Nostr relay pool already auto-reconnects on its own, so nothing
  // there needs to be re-created.
  refresh(): void {
    usePeerStore.getState().evictStale();
    AirhopBLE.startScanning([BLE_SERVICE_UUID]).catch(() => {});
  }

  stop(): void {
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
    this.nostrClient?.close();
    this.nostrClient = null;
    AirhopBLE.stopScanning().catch(() => {});
    AirhopBLE.stopAdvertising().catch(() => {});
    NativeAirhopWiFi?.stopWiFi().catch(() => {});
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
