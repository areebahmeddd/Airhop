// BLE mesh wiring service.
//
// Bridges the native AirhopBLE TurboModule to the core TypeScript engine.
// One singleton instance is created after identity generation and lives for
// the app's lifetime.
//
// Responsibilities:
//   - Start BLE advertising (peripheral) and scanning (central)
//   - Send periodic ANNOUNCE packets via AnnounceManager
//   - Receive raw BLE bytes, decode them, and route through FloodRouter
//   - Dispatch ANNOUNCE payloads to PeerStore (UI layer)
//   - Dispatch CHANNEL_MSG payloads to ChatStore (UI layer)
//   - Expose sendChannelMessage() and sendDm() for the feature layer

import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { getPublicKey } from "nostr-tools";
import { DeviceEventEmitter, type EmitterSubscription } from "react-native";
import AirhopBLE from "../bridge/NativeAirhopBLE";
import type { Identity } from "../core/crypto/identity";
import {
  AnnounceManager,
  decodeAnnouncePayload,
} from "../core/mesh/announce-manager";
import { FloodRouter } from "../core/mesh/flood-router";
import {
  decodePacket,
  encodePacket,
  Flags,
  PacketType,
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

// ---- Constants --------------------------------------------------------------

const BLE_SERVICE_UUID = "F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C";

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
      const linkID = this.peerToLink.get(recipientPeerID);
      if (!linkID) return;
      this.floodRouter.originate(packet);
      AirhopBLE.writeToLink(linkID, bytesToBase64(encodePacket(packet))).catch(
        () => {},
      );
    };

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

    // Peripheral: make this device visible.
    AirhopBLE.startAdvertising(BLE_SERVICE_UUID, `Airhop-${nickname}`).catch(
      () => {},
    );

    // Central: discover other Airhop / bitchat devices.
    AirhopBLE.startScanning([BLE_SERVICE_UUID]).catch(() => {});

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

    // Feed through the flood router.
    // Returns false if already seen: drop silently.
    const isNew = this.floodRouter.receive(packet, (relay) => {
      const b64 = bytesToBase64(encodePacket(relay));
      for (const lid of this.connectedLinks) {
        if (lid === linkID) continue; // never relay back on the same link
        AirhopBLE.writeToLink(lid, b64).catch(() => {
          this.connectedLinks.delete(lid);
        });
      }
    });
    if (!isNew) return;

    switch (packet.type) {
      case PacketType.ANNOUNCE:
        this.onAnnounce(packet, linkID);
        break;
      case PacketType.CHANNEL_MSG:
        this.onChannelMsg(packet);
        break;
      case PacketType.NOISE_ENCRYPTED:
        // DM decryption requires a completed Noise XX session.
        // Dropped silently until Noise session wiring is complete (v1.1).
        break;
      default:
        break;
    }
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
    this.peerToLink.set(peerID, linkID);
    this.linkToPeer.set(linkID, peerID);

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
    return this.router.sendDm(recipientPeerID, text);
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
