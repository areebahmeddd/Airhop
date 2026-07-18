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
import {
  initReceiver,
  initSender,
  ratchetDecrypt,
  ratchetEncrypt,
  type RatchetState,
} from "../core/crypto/double-ratchet";
import type { Identity } from "../core/crypto/identity";
import { NoiseHandshake } from "../core/crypto/noise-xx";
import {
  AnnounceManager,
  decodeAnnouncePayload,
} from "../core/mesh/announce-manager";
import { FloodRouter } from "../core/mesh/flood-router";
import { FragmentManager } from "../core/mesh/fragment-manager";
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
  PeerRegistry,
  type NostrSendFn,
  type RouterIdentity,
} from "../core/router/message-router";
import { useChatStore } from "../store/chat-store";
import { usePeerStore } from "../store/peer-store";
import {
  FileTransferService,
  type AttachmentMeta,
} from "./file-transfer-service";

// ---- Constants --------------------------------------------------------------

const BLE_SERVICE_UUID = "F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C";

// HKDF info string used to derive the Double Ratchet root key from the
// Noise XX static ECDH result. Airhop-to-Airhop only — bitchat nodes never
// receive DR_ENCRYPTED packets.
const DR_SEED_INFO = new TextEncoder().encode("airhop-dr-seed-v1");

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
      const b64 = bytesToBase64(encodePacket(packet));
      for (const linkID of this.connectedLinks) {
        AirhopBLE.writeToLink(linkID, b64).catch(() => {
          this.connectedLinks.delete(linkID);
        });
      }
    };

    const unicastFn = (recipientPeerID: string, packet: Packet): void => {
      // Prefer WiFi direct (higher throughput for large attachments).
      const wifiLink = this.wifiPeerToLink.get(recipientPeerID);
      if (wifiLink && this.wifiConnectedLinks.has(wifiLink)) {
        NativeAirhopWiFi?.writeToWiFiLink(
          wifiLink,
          bytesToBase64(encodePacket(packet)),
        ).catch(() => {
          this.wifiConnectedLinks.delete(wifiLink);
          this.wifiPeerToLink.delete(recipientPeerID);
          this.wifiLinkToPeer.delete(wifiLink);
        });
        return;
      }
      // Fall back to BLE.
      const linkID = this.peerToLink.get(recipientPeerID);
      if (!linkID) return;
      this.floodRouter.originate(packet);
      AirhopBLE.writeToLink(linkID, bytesToBase64(encodePacket(packet))).catch(
        () => {},
      );
    };

    // Store the unicast closure so sendDRMessage can use it without
    // duplicating the WiFi-vs-BLE preference logic.
    this.unicastFn = unicastFn;

    this.fileXfer = new FileTransferService(
      { peerID: identity.peerID, signingPrivKey: identity.signingPrivKey },
      broadcastFn,
      unicastFn,
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

    // Central: discover other Airhop / bitchat devices.
    AirhopBLE.startScanning([BLE_SERVICE_UUID]).catch(() => {});

    // Use the bitchat- local name prefix so bitchat-iOS and bitchat-Android
    // nodes recognise us in their scan results (per PROTOCOLS.md section 1).
    AirhopBLE.startAdvertising(BLE_SERVICE_UUID, `bitchat-${nickname}`).catch(
      () => {},
    );

    // Periodic ANNOUNCE so nearby peers learn our identity.
    const sendFn = (packet: Packet): void => {
      const b64 = bytesToBase64(encodePacket(packet));
      for (const linkID of this.connectedLinks) {
        AirhopBLE.writeToLink(linkID, b64).catch(() => {
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

    // Connect to Nostr relays for internet-bridged DMs.
    this.nostrClient = new NostrClient({ relays: [] });
    // Subscribe to gift-wrap events addressed to our Nostr pubkey.
    this.nostrClient.subscribe(
      [{ kinds: [1059], "#p": [this.nostrPubKeyHex] }],
      (event) => {
        try {
          const dm = unwrapDm(event, this.nostrPrivKey);
          // Map sender Nostr pubkey back to their peerID if we know them.
          const peerID = this.nostrPubkeyToPeerID.get(dm.senderPubkey);
          const shortID = dm.senderPubkey.slice(0, 16);
          const channel = `dm:${peerID ?? shortID}`;
          const peer = peerID ? this.registry.get(peerID) : undefined;
          useChatStore.getState().addChannel(channel);
          useChatStore.getState().addMessage({
            id: `nostr-${event.id}`,
            channel,
            senderID: peerID ?? shortID,
            senderNickname: peer?.nickname ?? shortID.slice(0, 8),
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
          AirhopBLE.writeToLink(linkID, bytesToBase64(encodePacket(pkt))).catch(
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
          NativeAirhopWiFi?.writeToWiFiLink(
            linkID,
            bytesToBase64(encodePacket(pkt)),
          ).catch(() => {});
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
          AirhopBLE.writeToLink(lid, b64).catch(() => {
            this.connectedLinks.delete(lid);
          });
        }
        for (const wlid of this.wifiConnectedLinks) {
          if (wlid === linkID) continue;
          NativeAirhopWiFi?.writeToWiFiLink(wlid, b64).catch(() => {
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
        AirhopBLE.writeToLink(lid, b64).catch(() => {
          this.connectedLinks.delete(lid);
        });
      }
      for (const wlid of this.wifiConnectedLinks) {
        if (wlid === linkID) continue;
        NativeAirhopWiFi?.writeToWiFiLink(wlid, b64).catch(() => {
          this.wifiConnectedLinks.delete(wlid);
        });
      }
    });
    if (!isNew) return;

    this.routePacket(packet, linkID);
  }

  // Dispatch a decoded (and flood-deduped) packet to the correct handler.
  // Also called for reassembled inner packets from the fragment pipeline.
  private routePacket(packet: Packet, linkID: string): void {
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
        AirhopBLE.writeToLink(lid, bytesToBase64(encodePacket(reply))).catch(
          () => {},
        );
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
        AirhopBLE.writeToLink(lid, bytesToBase64(encodePacket(msg3Pkt))).catch(
          () => {},
        );
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
    if (!peer?.nostrPubkey || !peer.noisePubKey) return;

    // Both parties derive the same ECDH secret from each other's Noise static
    // public keys. This is identical to the static-static DH in Noise_XX and
    // requires no extra round-trips.
    const dhSeed = x25519.getSharedSecret(
      this.identity.noiseStaticPrivKey,
      peer.noisePubKey,
    );
    const rootKey = hkdf(sha256, dhSeed, undefined, DR_SEED_INFO, 32);

    const state =
      role === "initiator"
        ? initSender(rootKey, peer.noisePubKey)
        : initReceiver(rootKey, this.identity.noiseStaticPrivKey);

    this.drStates.set(peerID, state);
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

    // Associate this link with the peer ID for unicast routing.
    // WiFi links are tracked separately so the unicast function can prefer
    // the higher-throughput transport for attachments and DR messages.
    if (this.wifiConnectedLinks.has(linkID)) {
      this.wifiPeerToLink.set(peerID, linkID);
      this.wifiLinkToPeer.set(linkID, peerID);
    } else {
      this.peerToLink.set(peerID, linkID);
      this.linkToPeer.set(linkID, peerID);
    }

    // Update the core registry (used by MessageRouter for transport selection).
    const nostrPubkeyHex = info.nostrPubKey
      ? bytesToHex(info.nostrPubKey)
      : undefined;
    if (nostrPubkeyHex) {
      this.nostrPubkeyToPeerID.set(nostrPubkeyHex, peerID);
    }
    this.registry.update({
      peerID,
      noisePubKey: info.noisePubKey,
      signingPubKey: info.signingPubKey,
      nickname: info.nickname,
      nostrPubkey: nostrPubkeyHex,
      isDirect: true,
    });
    this.registry.markDirect(peerID);

    // Update the Zustand peer store (drives the Mesh tab UI).
    usePeerStore.getState().upsertPeer({
      peerID,
      nickname: info.nickname,
      lastSeenMs: Date.now(),
      noisePubKeyHex: bytesToHex(info.noisePubKey),
    });
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

    const { channel, text } = decoded;
    const nickname = peer?.nickname ?? senderID.slice(0, 8);

    // Ensure the channel exists in the store before adding the message.
    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      id: `${senderID}-${String(packet.timestamp)}-${channel}`,
      channel,
      senderID,
      senderNickname: nickname,
      text,
      timestampMs: packet.timestamp * 1000,
      isMine: false,
    });
  }

  // ---- Public API -----------------------------------------------------------

  sendChannelMessage(channel: string, text: string): void {
    this.router.sendChannelMessage(channel, text);
  }

  sendDm(
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

    // Priority 2: Noise XX — initiate handshake if BLE-direct but no session yet.
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
        AirhopBLE.writeToLink(linkID, bytesToBase64(encodePacket(pkt))).catch(
          () => {},
        );
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

  stop(): void {
    this.announceManager.stop();
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
