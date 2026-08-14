// A bare relay node: an ESP32 on solar power, as bitle.org and bitchat-esp32
// build them.
//
// No identity, no keys, no announces. It reads the packet header, decrements
// TTL, and re-broadcasts on every link but the one the packet arrived on.
//
// Deliberately dumber than BitchatActor, which is a peer: it announces, signs,
// keeps a roster, reassembles files. A relay needs none of that, and this file
// exists to hold Airhop to that. See PROTOCOLS.md section 10.

import {
  computePacketId,
  decodePacket,
  encodePacket,
  type Packet,
} from "@core/mesh/packet-codec";
import { bytesToHex } from "@noble/hashes/utils.js";
import type { RadioPort } from "../../lifecycle/harness/android-native";
import type { Platform } from "../../lifecycle/harness/os";
import type { RadioNode } from "./radio-fabric";
import type { World } from "./world";

// Matches the app and BitchatActor. A relay's dedup set is the only state it
// holds, and it is what stops two relays trading one packet until its TTL runs
// out.
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

export interface RelayNodeOptions {
  id: string;
  // A relay is not a phone, but the fabric models links per platform. Android
  // is the closer analogue: always discoverable, no foreground rules.
  platform?: Platform;
}

export class RelayNode implements RadioNode {
  readonly id: string;
  readonly platform: Platform;
  // The fabric keys links on this. A real relay has no peer ID at all, which is
  // the point being tested: nothing in Airhop's relay path ever looks it up.
  readonly peerID: string;
  readonly spec: { canAdvertise?: boolean } = {};
  readonly os = { appForeground: true };

  readonly seen = {
    received: 0,
    relayed: 0,
    droppedExpired: 0,
    droppedDuplicate: 0,
    // Distinct packets forwarded. A ring is safe only if each node forwards a
    // given packet once, so this against `relayed` states that directly.
    // A raw counter cannot: announce traffic never stops.
    relayedIDs: new Set<string>(),
  };

  private readonly links = new Map<string, "central" | "peripheral">();
  private readonly dedup = new Set<string>();
  private port: RadioPort | null = null;

  constructor(
    private readonly world: World,
    opts: RelayNodeOptions,
  ) {
    this.id = opts.id;
    this.platform = opts.platform ?? "android";
    // Not derived from any key, because there is no key. A label for the
    // fabric, and nothing Airhop will ever verify or address.
    this.peerID = `relay${opts.id}`.padEnd(16, "0").slice(0, 16);
  }

  readonly native = {
    canScan: false,
    discoverable: false,
    discoverableToAndroid: true,
    radioPort: null as RadioPort | null,
    fabricLinkUp: (linkID: string, role: "central" | "peripheral"): void => {
      this.links.set(linkID, role);
      // No announce on connect, unlike a phone or BitchatActor. A relay that
      // announced would appear in every peer list as a person nobody can
      // message.
      this.world.say("RELAY_LINK_UP", `${this.id} <- ${linkID}`);
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

  // Power on. A solar node does this once.
  launch(): void {
    this.native.canScan = true;
    this.native.discoverable = true;
    this.port?.radiosChanged();
    this.world.onClose(() => this.stop());
  }

  stop(): void {
    this.native.canScan = false;
    this.native.discoverable = false;
    this.port?.radiosChanged();
  }

  private onPacket(linkID: string, dataBase64: string): void {
    let packet: Packet | null;
    try {
      packet = decodePacket(base64Decode(dataBase64));
    } catch {
      // The header is all a relay parses, so a malformed frame is the only
      // thing it can fail on. Dropped, never thrown: nobody restarts a node on
      // a pole.
      return;
    }
    if (packet === null) return;
    this.seen.received++;

    const packetID = bytesToHex(computePacketId(packet));
    if (this.dedup.has(packetID)) {
      this.seen.droppedDuplicate++;
      return;
    }
    this.dedup.add(packetID);
    if (this.dedup.size > DEDUP_LIMIT) {
      const oldest = this.dedup.values().next().value;
      if (oldest !== undefined) this.dedup.delete(oldest);
    }

    // Forwarding at 1 hands the next node a packet at 0, and a mesh of relays
    // never settles.
    if (packet.ttl <= 1) {
      this.seen.droppedExpired++;
      return;
    }

    this.seen.relayed++;
    this.seen.relayedIDs.add(packetID);
    const forwarded: Packet = { ...packet, ttl: packet.ttl - 1 };
    const encoded = base64Encode(encodePacket(forwarded));
    for (const id of this.links.keys()) {
      // Never back where it came from: two nodes sharing one link would
      // otherwise trade the same packet down to ttl 0.
      if (id === linkID) continue;
      this.port?.write(id, encoded);
    }
  }
}
