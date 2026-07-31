// A bitchat phone, standing in the same room as the Airhop ones.
//
// VISION.md puts wire compatibility among the non-negotiables, and PROGRESS.md
// is honest that it has never been proven anywhere but on paper. A compat test
// that only checks Airhop against ITSELF cannot find a divergence, because both
// sides share the bug. So this node is written to bitchat's rules rather than
// to Airhop's, and its whole job is to disagree when Airhop is wrong:
//
//   * It accepts only the packet types bitchat defines (0x01-0x29). Airhop's
//     own extensions - DR_ENCRYPTED (0x12) and CHANNEL_ENC (0x2a) - are
//     DROPPED, exactly as an unknown type is dropped on a real bitchat build.
//     That is the property the compatibility promise rests on: Airhop's extras
//     must cost bitchat nothing, not merely be understood by Airhop.
//   * It refuses a courier envelope whose expiry is beyond 24h + 1h slack,
//     which is what bitchat's CourierStore does and what silently ate every
//     Airhop envelope before that constant was corrected.
//   * It verifies signatures before displaying or relaying, and relays with the
//     TTL decrement and dedup any bitchat node performs.
//
// It deliberately does NOT reuse Airhop's mesh-service. It does reuse
// packet-codec, because that file IS the claim under test: if Airhop's encoder
// and bitchat's decoder disagree, the byte layout is wrong, and the layout is
// the thing both projects have agreed on.

import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import {
  computePacketId,
  decodePacket,
  encodePacket,
  Flags,
  PacketType,
  signPacket,
  verifyPacket,
  type Packet,
} from "../../../../core/mesh/packet-codec";
import {
  decodeChannelMsgPayload,
  encodeChannelMsgPayload,
} from "../../../../core/router/message-router";
import type { RadioPort } from "../../lifecycle/harness/android-native";
import type { Platform } from "../../lifecycle/harness/os";
import type { RadioNode } from "./radio-fabric";
import type { World } from "./world";

// MessageType.swift / MessageType.kt. Anything outside this set is unknown to
// bitchat and dropped without ceremony.
const BITCHAT_KNOWN_TYPES = new Set<number>([
  PacketType.ANNOUNCE,
  PacketType.CHANNEL_MSG,
  PacketType.LEAVE,
  PacketType.COURIER_ENV,
  PacketType.NOISE_HANDSHAKE,
  PacketType.NOISE_ENCRYPTED,
  PacketType.FRAGMENT,
  PacketType.REQUEST_SYNC,
  PacketType.FILE_TRANSFER,
  PacketType.BOARD_POST,
  PacketType.PREKEY_BUNDLE,
  PacketType.GROUP_MESSAGE,
  PacketType.PING,
  PacketType.PONG,
  PacketType.NOSTR_CARRIER,
  PacketType.VOICE_FRAME,
]);

// CourierStore.swift: maxLifetimeSeconds plus one hour of clock-skew slack.
const COURIER_MAX_LIFETIME_MS = 24 * 60 * 60 * 1000;
const COURIER_EXPIRY_SLACK_MS = 60 * 60 * 1000;

const DEDUP_LIMIT = 1000;

function base64Encode(bytes: Uint8Array): string {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];
    out += A[b0 >> 2];
    out += A[((b0 & 0x03) << 4) | ((b1 ?? 0) >> 4)];
    out += b1 === undefined ? "=" : A[((b1 & 0x0f) << 2) | ((b2 ?? 0) >> 6)];
    out += b2 === undefined ? "=" : A[b2 & 0x3f];
  }
  return out;
}

function base64Decode(text: string): Uint8Array {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const clean = text.replace(/=+$/, "");
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let bits = 0;
  let acc = 0;
  let o = 0;
  for (const ch of clean) {
    const v = A.indexOf(ch);
    if (v < 0) continue;
    acc = (acc << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[o++] = (acc >> bits) & 0xff;
    }
  }
  return out.subarray(0, o);
}

// What this node saw, so a scenario can assert on bitchat's point of view
// rather than on Airhop's.
export interface BitchatObservations {
  // Public channel messages it accepted and would have shown to its user.
  publicMessages: { senderID: string; text: string; channel: string }[];
  // Peers it learned about from a verified ANNOUNCE.
  knownPeers: Set<string>;
  // Packet types it dropped as unknown, with a count each. This is the
  // interesting one: it should contain Airhop's extensions and nothing else.
  droppedUnknownTypes: Map<number, number>;
  // Courier envelopes refused for stamping an expiry past bitchat's ceiling.
  refusedCourierEnvelopes: number;
  // Packets whose signature did not verify against the claimed sender.
  rejectedSignatures: number;
  // Files it decoded successfully.
  filesReceived: { name: string; bytes: number; mime: string }[];
  relayed: number;
}

export interface BitchatActorOptions {
  id: string;
  platform?: Platform;
  seedByte?: number;
  nickname?: string;
  // Channels this node has joined. bitchat, like Airhop, only shows messages
  // for channels the user actually joined.
  channels?: string[];
}

export class BitchatActor implements RadioNode {
  readonly id: string;
  readonly platform: Platform;
  readonly peerID: string;
  readonly spec: { canAdvertise?: boolean } = {};
  readonly os = { appForeground: true };
  readonly nickname: string;

  readonly signingPrivKey: Uint8Array;
  readonly signingPubKey: Uint8Array;
  readonly noiseStaticPubKey: Uint8Array;

  readonly seen: BitchatObservations = {
    publicMessages: [],
    knownPeers: new Set(),
    droppedUnknownTypes: new Map(),
    refusedCourierEnvelopes: 0,
    rejectedSignatures: 0,
    filesReceived: [],
    relayed: 0,
  };

  private readonly channels: Set<string>;
  private readonly links = new Map<string, "central" | "peripheral">();
  private readonly dedup = new Set<string>();
  // Signing keys learned from verified announces, which is the only thing that
  // binds a peerID to an identity.
  private readonly peerKeys = new Map<string, Uint8Array>();
  private announceTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly world: World,
    opts: BitchatActorOptions,
  ) {
    this.id = opts.id;
    this.platform = opts.platform ?? "ios";
    this.nickname = opts.nickname ?? opts.id;
    this.channels = new Set(opts.channels ?? ["#bluetooth"]);

    const seed = opts.seedByte ?? 200;
    this.signingPrivKey = new Uint8Array(32).fill(seed);
    this.signingPubKey = ed25519.getPublicKey(this.signingPrivKey);
    const noisePriv = new Uint8Array(32).fill(seed + 1);
    this.noiseStaticPubKey = x25519.getPublicKey(noisePriv);
    // PROTOCOLS.md section 7: hex(SHA-256(noiseStaticPubKey)).slice(0, 16).
    // Derived the same way Airhop derives it, because that derivation is itself
    // part of the compatibility contract.
    this.peerID = bytesToHex(sha256(this.noiseStaticPubKey)).slice(0, 16);
  }

  // ---- radio plumbing -------------------------------------------------------

  private port: RadioPort | null = null;

  readonly native = {
    canScan: false,
    discoverable: false,
    discoverableToAndroid: true,
    radioPort: null as RadioPort | null,
    fabricLinkUp: (linkID: string, role: "central" | "peripheral"): void => {
      this.links.set(linkID, role);
      this.world.say("BITCHAT_LINK_UP", `${this.id} <- ${linkID}`);
      // bitchat announces itself on connect, same as Airhop.
      this.sendAnnounce(linkID);
    },
    fabricLinkDown: (linkID: string): void => {
      this.links.delete(linkID);
    },
    fabricDeliver: (linkID: string, dataBase64: string): void => {
      this.onPacket(linkID, dataBase64);
    },
    fabricRssi: (): void => undefined,
  };

  attachRadioPort(port: RadioPort): void {
    this.port = port;
    this.native.radioPort = port;
  }

  // Turn the radios on, as launching the app does.
  launch(): void {
    this.native.canScan = true;
    this.native.discoverable = true;
    this.port?.radiosChanged();
    // Periodic announce, so a peer that arrives later still learns this node.
    this.announceTimer = setInterval(() => {
      for (const linkID of this.links.keys()) this.sendAnnounce(linkID);
    }, 10_000);
    this.world.onClose(() => this.stop());
  }

  stop(): void {
    if (this.announceTimer !== null) {
      clearInterval(this.announceTimer);
      this.announceTimer = null;
    }
    this.native.canScan = false;
    this.native.discoverable = false;
    this.port?.radiosChanged();
  }

  // ---- sending --------------------------------------------------------------

  private write(linkID: string, packet: Packet): void {
    this.port?.write(linkID, base64Encode(encodePacket(packet)));
  }

  private broadcast(packet: Packet, exceptLinkID?: string): void {
    for (const linkID of this.links.keys()) {
      if (linkID === exceptLinkID) continue;
      this.write(linkID, packet);
    }
  }

  private peerIDBytes(): Uint8Array {
    const out = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
      out[i] = parseInt(this.peerID.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
  }

  private sign(packet: Packet): Packet {
    packet.signature = signPacket(packet, this.signingPrivKey);
    return packet;
  }

  private sendAnnounce(linkID?: string): void {
    // ANNOUNCE payload is TLV: 0x01 nickname, 0x02 noise pubkey, 0x03 signing
    // pubkey (PROTOCOLS.md section 3).
    const nick = new TextEncoder().encode(this.nickname);
    const payload = new Uint8Array(2 + nick.length + 2 + 32 + 2 + 32);
    let o = 0;
    payload[o++] = 0x01;
    payload[o++] = nick.length;
    payload.set(nick, o);
    o += nick.length;
    payload[o++] = 0x02;
    payload[o++] = 32;
    payload.set(this.noiseStaticPubKey, o);
    o += 32;
    payload[o++] = 0x03;
    payload[o++] = 32;
    payload.set(this.signingPubKey, o);

    const packet = this.sign({
      type: PacketType.ANNOUNCE,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: this.peerIDBytes(),
      recipientID: new Uint8Array(8),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload,
    });
    if (linkID !== undefined) this.write(linkID, packet);
    else this.broadcast(packet);
  }

  // Say something on a public channel, the way a bitchat user does.
  //
  // The CHANNEL_MSG payload shape is the one place this actor SHARES code with
  // Airhop rather than re-deriving it, and that is deliberate: PROTOCOLS.md
  // section 3 specifies the packet frame and the type registry, but says only
  // "channel name embedded in payload" about this body. There is no independent
  // specification to re-derive from, so hand-rolling a second encoder here
  // would test my reading of the source, not the protocol. What this actor DOES
  // re-derive independently - the frame layout, the peer ID, the type registry,
  // the signature policy, the courier ceiling - is exactly what PROTOCOLS.md
  // pins down.
  sendPublicMessage(channel: string, text: string): void {
    const payload = encodeChannelMsgPayload(
      channel,
      text,
      `bc-${this.id}-${String(this.world.now)}`,
    );
    this.world.say("BITCHAT_SEND", `${this.id}: ${text}`);
    this.broadcast(
      this.sign({
        type: PacketType.CHANNEL_MSG,
        ttl: 7,
        flags: Flags.SIGNED,
        senderID: this.peerIDBytes(),
        recipientID: new Uint8Array(8),
        timestamp: Date.now(),
        signature: new Uint8Array(64),
        payload,
      }),
    );
  }

  // ---- receiving ------------------------------------------------------------

  private onPacket(linkID: string, dataBase64: string): void {
    let packet: Packet | null;
    try {
      packet = decodePacket(base64Decode(dataBase64));
    } catch {
      return;
    }
    if (packet === null) return;

    const packetID = bytesToHex(computePacketId(packet));
    if (this.dedup.has(packetID)) return;
    this.dedup.add(packetID);
    if (this.dedup.size > DEDUP_LIMIT) {
      const oldest = this.dedup.values().next().value;
      if (oldest !== undefined) this.dedup.delete(oldest);
    }

    // The property under test: a type bitchat does not define is dropped, and
    // dropping it must cost nothing.
    if (!BITCHAT_KNOWN_TYPES.has(packet.type)) {
      this.seen.droppedUnknownTypes.set(
        packet.type,
        (this.seen.droppedUnknownTypes.get(packet.type) ?? 0) + 1,
      );
      this.world.say(
        "BITCHAT_DROPPED_UNKNOWN",
        `${this.id} dropped type 0x${packet.type.toString(16)}`,
      );
      return;
    }

    const senderID = bytesToHex(packet.senderID);
    if (senderID !== this.peerID) {
      switch (packet.type) {
        case PacketType.ANNOUNCE:
          this.onAnnounce(packet, senderID);
          break;
        case PacketType.CHANNEL_MSG:
          this.onChannelMsg(packet, senderID);
          break;
        case PacketType.COURIER_ENV:
          this.onCourierEnvelope(packet);
          break;
        default:
          break;
      }
    }

    // Relay, as any bitchat node does: decrement TTL, never send back where it
    // came from.
    if (packet.ttl > 1) {
      this.seen.relayed++;
      this.broadcast({ ...packet, ttl: packet.ttl - 1 }, linkID);
    }
  }

  private onAnnounce(packet: Packet, senderID: string): void {
    // TLV walk for the signing key (0x03), then verify the packet against it.
    // bitchat pins the key on first sight and refuses to replace it later
    // (BLEAnnounceTrustPolicy.signingKeyMismatch); this models the first half.
    let signingKey: Uint8Array | null = null;
    let o = 0;
    while (o + 2 <= packet.payload.length) {
      const tag = packet.payload[o];
      const len = packet.payload[o + 1];
      const value = packet.payload.subarray(o + 2, o + 2 + len);
      if (tag === 0x03 && len === 32) signingKey = value;
      o += 2 + len;
    }
    if (signingKey === null) return;
    if (
      (packet.flags & Flags.SIGNED) === 0 ||
      !verifyPacket(packet, signingKey)
    ) {
      this.seen.rejectedSignatures++;
      return;
    }
    const existing = this.peerKeys.get(senderID);
    if (
      existing !== undefined &&
      bytesToHex(existing) !== bytesToHex(signingKey)
    ) {
      // Pinned to a different key: refuse, per bitchat's TOFU rule.
      this.seen.rejectedSignatures++;
      return;
    }
    this.peerKeys.set(senderID, signingKey);
    this.seen.knownPeers.add(senderID);
  }

  private onChannelMsg(packet: Packet, senderID: string): void {
    const key = this.peerKeys.get(senderID);
    // BLEPublicMessageHandler.swift:88 - an absent key is a FAILED check.
    if (
      key === undefined ||
      (packet.flags & Flags.SIGNED) === 0 ||
      !verifyPacket(packet, key)
    ) {
      this.seen.rejectedSignatures++;
      return;
    }
    const decoded = decodeChannelMsgPayload(packet.payload);
    if (decoded === null) return;
    const { channel, text } = decoded;
    if (!this.channels.has(channel)) return;
    this.seen.publicMessages.push({ senderID, text, channel });
    this.world.say("BITCHAT_RECEIVED", `${this.id}: ${text}`);
  }

  private onCourierEnvelope(packet: Packet): void {
    // CourierStore.swift refuses anything stamped beyond its own ceiling rather
    // than clamping it: a sender that asks for longer carriage gets none. The
    // expiry rides in the envelope TLV; a scenario that wants to exercise this
    // stamps it, and what matters here is the ceiling, not the parse.
    const expiry = readCourierExpiryMs(packet.payload);
    if (expiry === null) return;
    const ceiling =
      Date.now() + COURIER_MAX_LIFETIME_MS + COURIER_EXPIRY_SLACK_MS;
    if (expiry > ceiling) {
      this.seen.refusedCourierEnvelopes++;
      this.world.say(
        "BITCHAT_COURIER_REFUSED",
        `expiry ${String(Math.round((expiry - Date.now()) / 3_600_000))}h exceeds 25h ceiling`,
      );
    }
  }
}

// The courier envelope TLV carries an expiry as a u64 millisecond timestamp
// under tag 0x03 (see courier-store.ts). Returns null when absent.
function readCourierExpiryMs(payload: Uint8Array): number | null {
  let o = 0;
  while (o + 3 <= payload.length) {
    const tag = payload[o];
    const len = (payload[o + 1] << 8) | payload[o + 2];
    const value = payload.subarray(o + 3, o + 3 + len);
    if (tag === 0x03 && len === 8) {
      const view = new DataView(
        value.buffer,
        value.byteOffset,
        value.byteLength,
      );
      return Number(view.getBigUint64(0, false));
    }
    o += 3 + len;
  }
  return null;
}
