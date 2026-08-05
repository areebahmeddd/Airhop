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
import { decodeFilePacket } from "../../../../core/mesh/bitchat-file-packet";
import {
  CarrierDirection,
  decodeNostrCarrier,
  encodeNostrCarrier,
} from "../../../../core/mesh/nostr-carrier";
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
  encodeBurstData,
  encodeBurstEnd,
  encodeBurstStart,
  VoiceCodec,
} from "../../../../core/mesh/voice-capture";
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

// BLEFragmentAssemblyBuffer.swift. The header is 8 + 2 + 2 + 1; a total above
// 10,000 or an index past it is refused; 128 streams may be open at once.
const FRAG_HEADER_LEN = 13;
const FRAG_MAX_TOTAL = 10_000;
const FRAG_MAX_CONCURRENT = 128;

// bleFragmentLifetimeSeconds. Counted from the FIRST fragment of a stream, not
// the last, because `timestamp` is stamped once in startAssemblyIfNeeded and
// never refreshed. Airhop's own reassembler times out on idle instead, which is
// the better policy and precisely why this has to be modelled here: our
// behaviour cannot stand in for theirs.
const FRAG_LIFETIME_MS = 30_000;

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
  // Files it reassembled and decoded successfully, with the bytes that actually
  // arrived so a scenario can compare them against what was sent.
  filesReceived: {
    name: string;
    bytes: number;
    mime: string;
    content: Uint8Array;
  }[];
  // Fragment streams abandoned because they did not complete inside bitchat's
  // assembly window. The window runs from the FIRST fragment, so this is what a
  // sender that paces too slowly, or sends too much, looks like from here.
  expiredAssemblies: number;
  relayed: number;
  // Gateway downlinks it accepted: a `fromGateway` carrier broadcast by an
  // Airhop gateway, decoded and verified the way bitchat's GatewayService does
  // before handing the event to its geohash timeline.
  gatewayDownlinks: { geohash: string; eventID: string }[];
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
    expiredAssemblies: 0,
    relayed: 0,
    gatewayDownlinks: [],
  };

  private readonly channels: Set<string>;
  private readonly links = new Map<string, "central" | "peripheral">();
  private readonly dedup = new Set<string>();
  // Signing keys learned from verified announces, which is the only thing that
  // binds a peerID to an identity.
  private readonly peerKeys = new Map<string, Uint8Array>();
  // In-progress fragment reassembly, keyed by sender and stream. Modelled on
  // BLEFragmentAssemblyBuffer.swift, including the detail that matters most:
  // `startedAtMs` is stamped once and never refreshed, so the window is measured
  // from the first fragment rather than the last. That is bitchat's real
  // behaviour and the reason a large Airhop transfer used to be dropped on
  // arrival however well the radio was doing.
  private readonly assemblies = new Map<
    string,
    {
      chunks: Map<number, Uint8Array>;
      total: number;
      innerType: number;
      startedAtMs: number;
    }
  >();
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
    return peerIDToBytes(this.peerID);
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

  // Hold the push-to-talk button, the way a bitchat user does: START, a run of
  // DATA packets, then END. Sent as one burst rather than paced over real time,
  // because what this exercises is acceptance, not the jitter buffer.
  //
  // Every frame goes out with the all-0xFF recipient sentinel that
  // bitchat-Android writes with HAS_RECIPIENT set, which is the encoding a
  // receiver has to recognise as broadcast on top of the omitted-field form
  // that bitchat-iOS and Airhop emit.
  sendVoiceBurst(dataPackets = 3): void {
    const burstID = new Uint8Array(8).fill(0xa0 + (dataPackets & 0x0f));
    const frame = new Uint8Array(60).fill(0x5a);
    const payloads = [encodeBurstStart(burstID, VoiceCodec.AAC_LC_16KHZ_MONO)];
    for (let seq = 1; seq <= dataPackets; seq++) {
      payloads.push(encodeBurstData(burstID, seq, [frame]));
    }
    payloads.push(
      encodeBurstEnd(burstID, dataPackets + 1, dataPackets, dataPackets * 100),
    );

    this.world.say("BITCHAT_SEND", `${this.id}: voice burst`);
    for (const payload of payloads) {
      this.broadcast(
        this.sign({
          type: PacketType.VOICE_FRAME,
          ttl: 3,
          flags: Flags.SIGNED,
          senderID: this.peerIDBytes(),
          recipientID: new Uint8Array(8).fill(0xff),
          timestamp: Date.now(),
          signature: new Uint8Array(64),
          payload,
        }),
      );
    }
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
        case PacketType.FRAGMENT:
          this.onFragment(packet, senderID);
          break;
        case PacketType.NOSTR_CARRIER:
          this.onNostrCarrier(packet);
          break;
        case PacketType.FILE_TRANSFER:
          // Small enough to have needed no fragmenting.
          this.onFileTransfer(packet);
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

  // Deposit a signed geohash event with a gateway, as a mesh-only bitchat phone
  // does when it has no internet of its own.
  //
  // Directed at the gateway, carrying a `toGateway` carrier. The event is
  // Schnorr-signed by the caller (the scenario supplies it), because a gateway
  // that published unsigned events on a neighbour's say-so would be an open
  // proxy: bitchat verifies before publishing and so must Airhop.
  depositWithGateway(
    gatewayPeerID: string,
    geohash: string,
    eventJSON: string,
  ): void {
    const payload = encodeNostrCarrier({
      direction: CarrierDirection.TO_GATEWAY,
      geohash,
      eventJSON: new TextEncoder().encode(eventJSON),
    });
    if (payload === null) return;
    this.world.say(
      "BITCHAT_UPLINK",
      `${this.id} -> ${gatewayPeerID.slice(0, 8)}`,
    );
    this.broadcast(
      this.sign({
        type: PacketType.NOSTR_CARRIER,
        ttl: 7,
        flags: Flags.SIGNED | Flags.HAS_RECIPIENT,
        senderID: this.peerIDBytes(),
        recipientID: peerIDToBytes(gatewayPeerID),
        timestamp: Date.now(),
        payload,
        signature: new Uint8Array(64),
      }),
    );
  }

  // A carrier arrived. bitchat's GatewayService switches on direction and
  // requires the packet shape to match: `toGateway` must be directed, and
  // `fromGateway` must be a broadcast. A mismatch is malformed and dropped.
  private onNostrCarrier(packet: Packet): void {
    const carrier = decodeNostrCarrier(packet.payload);
    if (carrier === null) return;
    const directed = (packet.flags & Flags.HAS_RECIPIENT) !== 0;

    if (carrier.direction === CarrierDirection.FROM_GATEWAY) {
      if (directed) return; // a directed downlink is malformed
      // Receivers verify the carried event themselves rather than trusting the
      // gateway that ferried it, which is the whole reason the carrier adds no
      // encryption: a gateway can drop but never forge.
      let parsed: { id?: unknown } | null = null;
      try {
        parsed = JSON.parse(new TextDecoder().decode(carrier.eventJSON)) as {
          id?: unknown;
        };
      } catch {
        return;
      }
      if (typeof parsed?.id !== "string") return;
      this.seen.gatewayDownlinks.push({
        geohash: carrier.geohash,
        eventID: parsed.id,
      });
      return;
    }
    // toGateway/toBridge deposits are for a gateway to act on. This node runs
    // no gateway, so it does nothing beyond the relay every node performs.
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

  // Reassembly, to bitchat's rules rather than Airhop's.
  //
  // BLEFragmentAssemblyBuffer.swift:
  //   [0..8)   stream ID
  //   [8..10)  index, u16 big-endian
  //   [10..12) total, u16 big-endian
  //   [12]     the inner packet's type
  // and it rejects a payload shorter than the header, a total above 10,000, and
  // an index at or past the total.
  //
  // The frame SIZE rule is not enforced here: the radio fabric drops an
  // oversized frame before it reaches any node, which is what a real link does.
  // So a sender that frames too large shows up as a stream that never completes,
  // exactly as it did in the field.
  private onFragment(packet: Packet, senderID: string): void {
    const p = packet.payload;
    if (p.length <= FRAG_HEADER_LEN) return;
    const index = (p[8] << 8) | p[9];
    const total = (p[10] << 8) | p[11];
    if (total === 0 || total > FRAG_MAX_TOTAL || index >= total) return;

    const key = `${senderID}:${bytesToHex(p.subarray(0, 8))}`;
    this.expireStaleAssemblies();

    let entry = this.assemblies.get(key);
    if (entry === undefined) {
      if (this.assemblies.size >= FRAG_MAX_CONCURRENT) return;
      entry = {
        chunks: new Map(),
        total,
        innerType: p[12],
        startedAtMs: this.world.now,
      };
      this.assemblies.set(key, entry);
    }
    entry.chunks.set(index, p.subarray(FRAG_HEADER_LEN));
    if (entry.chunks.size < entry.total) return;

    this.assemblies.delete(key);
    const parts: Uint8Array[] = [];
    for (let i = 0; i < entry.total; i++) {
      const chunk = entry.chunks.get(i);
      if (chunk === undefined) return; // cannot happen; a gap means no delivery
      parts.push(chunk);
    }
    const joined = joinChunks(parts);
    let inner: Packet | null;
    try {
      inner = decodePacket(joined);
    } catch {
      return;
    }
    if (inner === null) return;
    this.world.say(
      "BITCHAT_REASSEMBLED",
      `${this.id} rebuilt ${String(entry.total)} fragments into type 0x${inner.type.toString(16)}`,
    );
    if (inner.type === PacketType.FILE_TRANSFER) this.onFileTransfer(inner);
  }

  // Drop any stream that has been open longer than the window. Measured from the
  // first fragment, per the comment on `assemblies`.
  private expireStaleAssemblies(): void {
    for (const [key, entry] of this.assemblies) {
      if (this.world.now - entry.startedAtMs <= FRAG_LIFETIME_MS) continue;
      this.assemblies.delete(key);
      this.seen.expiredAssemblies++;
      this.world.say(
        "BITCHAT_ASSEMBLY_EXPIRED",
        `${this.id} gave up on a stream after ${String(FRAG_LIFETIME_MS / 1000)}s with ${String(entry.chunks.size)}/${String(entry.total)} fragments`,
      );
    }
  }

  // A whole file packet, reassembled or small enough to have arrived intact.
  // The TLV parse is Airhop's, deliberately: the layout is the thing both
  // projects agreed on, so reusing it is the same reasoning that has this file
  // reuse packet-codec. What is written by hand above is bitchat's POLICY, which
  // is where the two actually diverge.
  private onFileTransfer(packet: Packet): void {
    const file = decodeFilePacket(packet.payload);
    if (file === null) return;
    this.seen.filesReceived.push({
      name: file.fileName ?? "",
      bytes: file.content.length,
      mime: file.mimeType ?? "",
      content: file.content,
    });
    this.world.say(
      "BITCHAT_FILE",
      `${this.id} decoded ${file.fileName ?? "(unnamed)"} (${String(file.content.length)}B ${file.mimeType ?? "?"})`,
    );
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

function joinChunks(parts: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const part of parts) total += part.length;
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
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

// A 16-hex peer ID as the 8 bytes a packet header carries.
function peerIDToBytes(peerID: string): Uint8Array {
  const out = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    out[i] = parseInt(peerID.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}
