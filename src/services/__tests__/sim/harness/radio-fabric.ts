// The Bluetooth medium: the air between the phones.
//
// Everything above this line in the stack is the real Airhop. Everything below
// it is physics. The fabric owns exactly the facts a radio cannot know about
// itself - who is close enough to hear whom, how long a packet takes to arrive,
// whether it arrives at all - and nothing else. It has no idea what a packet
// means, which is the point: a medium that understood the protocol could not
// find a protocol bug.
//
// Behaviours modelled here because they are real and they break things:
//
//   * Discovery is not instant. A scanner takes a while to see an advertiser,
//     and a GATT connection takes longer still. Code that assumes a peer is
//     reachable the moment it is visible is wrong on hardware.
//   * A backgrounded iPhone is invisible to an Android scanner. CoreBluetooth
//     moves the service UUID into the advertisement overflow area and drops the
//     local name; only another iOS device scanning for that UUID can read it.
//     Established links keep working. This asymmetry is the single most
//     surprising thing about the real network and it is enforced here.
//   * Links are ordered but lossy. GATT delivers in order on a given link, so
//     reordering is OFF by default and has to be asked for; loss, duplication
//     and corruption are all real and all off by default too.
//   * Range is not symmetric in general, but it is here unless a scenario says
//     otherwise, because asymmetric range is a rabbit hole and the bugs we are
//     hunting do not need it.

import { MAX_BLE_FRAME } from "@core/mesh/routing/fragment-manager";
import type { RadioPort } from "../../lifecycle/harness/android-native";
import type { Platform } from "../../lifecycle/harness/os";
import type { Prng } from "./prng";
import type { World } from "./world";

// What the medium needs from anything plugged into it.
//
// Deliberately narrower than SimDevice. The air does not know what software a
// phone is running, and neither should this: a bitchat node and an Airhop node
// are the same kind of object here, which is the only way a mixed mesh can be
// tested honestly.
export interface RadioNode {
  readonly id: string;
  readonly platform: Platform;
  readonly peerID: string;
  // Some Android chipsets have no peripheral role at all.
  readonly spec: { canAdvertise?: boolean };
  readonly os: { appForeground: boolean };
  readonly native: {
    readonly canScan: boolean;
    readonly discoverable: boolean;
    // iOS only: false once the app is backgrounded and the service UUID moves
    // into the advertisement overflow area.
    readonly discoverableToAndroid?: boolean;
    radioPort: RadioPort | null;
    fabricLinkUp(
      linkID: string,
      role: "central" | "peripheral",
      rssi: number,
    ): void;
    fabricLinkDown(linkID: string): void;
    fabricDeliver(linkID: string, dataBase64: string): void;
    fabricRssi(linkID: string, rssi: number): void;
  };
  attachRadioPort(port: RadioPort): void;
}

export interface LinkConditions {
  // One-way delivery time for a packet already on an open link.
  latencyMs: number;
  jitterMs: number;
  // Probability a packet is silently dropped.
  loss: number;
  // Probability a packet is delivered twice.
  duplicate: number;
  // Probability a packet's bytes are mangled in flight. The decoder must reject
  // it; the app must not crash.
  corrupt: number;
  // Allow a packet to overtake the one before it on the same link. Off by
  // default because GATT does not do this.
  reorder: number;
  // How long a scanner takes to notice a visible advertiser and complete a
  // connection.
  discoveryMs: number;
}

const DEFAULT_CONDITIONS: LinkConditions = {
  latencyMs: 25,
  jitterMs: 15,
  loss: 0,
  duplicate: 0,
  corrupt: 0,
  reorder: 0,
  discoveryMs: 300,
};

interface Link {
  a: string;
  b: string;
  // The link handle each side holds. Distinct, as they are on real devices:
  // neither phone knows the other's identifier for the connection.
  aLinkID: string;
  bLinkID: string;
  rssi: number;
  // Delivery time of the last packet queued on this link, so ordering is
  // preserved without a real queue.
  aLastDeliveryAt: number;
  bLastDeliveryAt: number;
}

// Exact decoded length of a base64 string. `ceil(len * 3 / 4)` over-reports by
// up to two bytes, because it ignores the "=" padding, and a frame sitting
// exactly on the 512-byte limit was reported as 513 and dropped.
function base64ByteLength(b64: string): number {
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return (b64.length / 4) * 3 - pad;
}

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

// Simultaneous central-role links a phone can hold. A radio limit, not a policy
// one: Android controllers manage roughly seven GATT client connections and
// refuse the rest with status 133. Mirrors bitchat-ios
// TransportConfig.bleMaxCentralLinks and the cap now enforced in both Airhop
// native modules. Without this the simulation would let 25 phones hold 300
// simultaneous connections, which is not a network any of this code will ever
// meet, and would hide the crowd behaviour that actually matters.
const MAX_CENTRAL_LINKS = 6;

export class RadioFabric {
  private readonly devices = new Map<string, RadioNode>();
  private readonly links = new Map<string, Link>();
  // Which pairs are physically close enough. Absent means "everybody hears
  // everybody", which is what a small scenario wants.
  private adjacency: Map<string, Set<string>> | null = null;
  private conditions: LinkConditions = { ...DEFAULT_CONDITIONS };
  private readonly perPair = new Map<string, Partial<LinkConditions>>();
  private readonly rng: Prng;
  // Pending discovery timers, so a device that stops advertising mid-discovery
  // does not connect anyway.
  private readonly pendingDiscovery = new Map<string, () => void>();
  private disposed = false;

  // Counters a scenario can assert on.
  packetsDelivered = 0;
  packetsDropped = 0;
  packetsCorrupted = 0;
  packetsDuplicated = 0;
  bytesOnAir = 0;
  // Frames a sender offered that no BLE link could carry whole.
  framesOversized = 0;
  // Airtime by packet type. The medium does not decode packets - it reads byte
  // [1] of the frame, which is the type, and nothing else. That is enough to
  // answer "what is this room actually spending its radio on", which is the
  // question a crowded mesh lives or dies by.
  readonly typeCounts = new Map<number, number>();

  constructor(private readonly world: World) {
    this.rng = world.rng.fork("radio");
    world.onClose(() => {
      this.disposed = true;
    });
  }

  // ---- membership -----------------------------------------------------------

  add(device: RadioNode): void {
    this.devices.set(device.id, device);
    const port: RadioPort = {
      write: (linkID, dataBase64) =>
        this.onWrite(device.id, linkID, dataBase64),
      radiosChanged: () => this.recompute(),
    };
    device.attachRadioPort(port);
    this.recompute();
  }

  remove(deviceID: string): void {
    for (const [key, link] of [...this.links]) {
      if (link.a === deviceID || link.b === deviceID) this.dropLink(key);
    }
    this.devices.delete(deviceID);
  }

  // ---- topology -------------------------------------------------------------

  // Explicit adjacency. Pass a list of pairs that CAN hear each other; anything
  // not listed cannot. This is how a multi-hop chain is built: a-b, b-c, c-d
  // means a can only reach d through the phones in between.
  setTopology(pairs: [string, string][]): void {
    const map = new Map<string, Set<string>>();
    for (const id of this.devices.keys()) map.set(id, new Set());
    for (const [a, b] of pairs) {
      if (!map.has(a)) map.set(a, new Set());
      if (!map.has(b)) map.set(b, new Set());
      map.get(a)?.add(b);
      map.get(b)?.add(a);
    }
    this.adjacency = map;
    this.world.say("TOPOLOGY", pairs.map(([a, b]) => `${a}-${b}`).join(" "));
    this.recompute();
  }

  // Everybody in range of everybody.
  setFullMesh(): void {
    this.adjacency = null;
    this.recompute();
  }

  // A chain: 0-1-2-...-n. The classic multi-hop test bed.
  setChain(ids: string[]): void {
    const pairs: [string, string][] = [];
    for (let i = 0; i + 1 < ids.length; i++) pairs.push([ids[i], ids[i + 1]]);
    this.setTopology(pairs);
  }

  // Move one device out of everyone's range without turning its radio off, as
  // walking away does.
  setIsolated(deviceID: string, isolated: boolean): void {
    if (this.adjacency === null) {
      // Materialise the implicit full mesh so one device can be cut from it.
      const ids = [...this.devices.keys()];
      const pairs: [string, string][] = [];
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) pairs.push([ids[i], ids[j]]);
      }
      this.setTopology(pairs);
    }
    const map = this.adjacency;
    if (map === null) return;
    if (isolated) {
      const neighbours = map.get(deviceID);
      if (neighbours !== undefined) {
        for (const other of neighbours) map.get(other)?.delete(deviceID);
        neighbours.clear();
      }
      this.world.say("WALKED_AWAY", deviceID);
    } else {
      for (const other of this.devices.keys()) {
        if (other === deviceID) continue;
        map.get(deviceID)?.add(other);
        map.get(other)?.add(deviceID);
      }
      this.world.say("WALKED_BACK", deviceID);
    }
    this.recompute();
  }

  private canHear(a: string, b: string): boolean {
    if (this.adjacency === null) return a !== b;
    return this.adjacency.get(a)?.has(b) ?? false;
  }

  // ---- conditions -----------------------------------------------------------

  setConditions(partial: Partial<LinkConditions>): void {
    this.conditions = { ...this.conditions, ...partial };
    this.world.say(
      "LINK_CONDITIONS",
      Object.entries(partial)
        .map(([k, v]) => `${k}=${String(v)}`)
        .join(" "),
    );
  }

  setPairConditions(
    a: string,
    b: string,
    partial: Partial<LinkConditions>,
  ): void {
    this.perPair.set(pairKey(a, b), partial);
  }

  private conditionsFor(a: string, b: string): LinkConditions {
    return { ...this.conditions, ...(this.perPair.get(pairKey(a, b)) ?? {}) };
  }

  // ---- visibility -----------------------------------------------------------

  // Can `scanner` currently see `advertiser`? This is where the platform
  // asymmetry lives.
  //
  // Public so a scenario can assert on DISCOVERY DIRECTION rather than on
  // whether a link exists. Those are different questions, and conflating them
  // gets the backgrounded-iPhone case wrong: Android cannot discover a
  // backgrounded iPhone, but the iPhone can still discover Android and dial
  // out, so a link reappears anyway. Asserting "no link" would be asserting
  // something false about the platform.
  canDiscover(scannerID: string, advertiserID: string): boolean {
    return this.visible(scannerID, advertiserID);
  }

  private visible(scannerID: string, advertiserID: string): boolean {
    const scanner = this.devices.get(scannerID);
    const advertiser = this.devices.get(advertiserID);
    if (scanner === undefined || advertiser === undefined) return false;
    if (!this.canHear(scannerID, advertiserID)) return false;

    if (!scanner.native.canScan) return false;
    if (!advertiser.native.discoverable) return false;
    if (advertiser.spec.canAdvertise === false) return false;

    // The rule that costs iPhone-to-Android discovery. An iPhone whose app is
    // backgrounded still advertises, but only into the overflow area, which
    // only another iPhone reads.
    if (
      advertiser.platform === "ios" &&
      scanner.platform === "android" &&
      advertiser.native.discoverableToAndroid === false
    ) {
      return false;
    }
    return true;
  }

  // ---- link management ------------------------------------------------------

  // Idempotent: work out which links should exist, open the missing ones, close
  // the ones that should not. Called on every radio change from any device.
  recompute(): void {
    if (this.disposed) return;
    const ids = [...this.devices.keys()];

    // Close links that can no longer exist.
    for (const [key, link] of [...this.links]) {
      const stillUp =
        (this.visible(link.a, link.b) || this.visible(link.b, link.a)) &&
        this.devices.has(link.a) &&
        this.devices.has(link.b);
      if (!stillUp) this.dropLink(key);
    }

    // Open links that should.
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i];
        const b = ids[j];
        const key = pairKey(a, b);
        if (this.links.has(key)) continue;
        if (this.pendingDiscovery.has(key)) continue;
        // Either side scanning and seeing the other is enough: the link is
        // symmetric once open, whoever initiated it.
        const aSeesB = this.visible(a, b);
        const bSeesA = this.visible(b, a);
        if (!aSeesB && !bSeesA) continue;
        // The scanner is whichever side could see the other. If both, the
        // lower id wins, deterministically.
        let scanner = aSeesB ? a : b;
        let advertiser = aSeesB ? b : a;
        // If the natural scanner is at its central-link ceiling, the other side
        // may still be able to dial in.
        if (this.centralLinkCount(scanner) >= MAX_CENTRAL_LINKS) {
          if (
            this.visible(advertiser, scanner) &&
            this.centralLinkCount(advertiser) < MAX_CENTRAL_LINKS
          ) {
            const swap = scanner;
            scanner = advertiser;
            advertiser = swap;
          } else {
            continue;
          }
        }
        this.scheduleDiscovery(key, scanner, advertiser);
      }
    }
  }

  // How much slower discovery is for a scanner whose app is in the background.
  // iOS keeps scanning under the bluetooth-central background mode, but the
  // scan is throttled and coalesced rather than continuous, so a connection
  // that takes a moment in the foreground takes a long time behind it.
  private static readonly BACKGROUND_SCAN_PENALTY = 10;

  private scheduleDiscovery(
    key: string,
    scanner: string,
    advertiser: string,
  ): void {
    const cond = this.conditionsFor(scanner, advertiser);
    const scannerDevice = this.devices.get(scanner);
    const throttled =
      scannerDevice !== undefined &&
      scannerDevice.platform === "ios" &&
      !scannerDevice.os.appForeground;
    const base = throttled
      ? cond.discoveryMs * RadioFabric.BACKGROUND_SCAN_PENALTY
      : cond.discoveryMs;
    const delay = Math.max(
      1,
      base + this.rng.int(-Math.floor(base / 4), Math.floor(base / 4)),
    );
    const handle = setTimeout(() => {
      this.pendingDiscovery.delete(key);
      // Re-check: the world may have moved during the connect.
      if (
        !this.visible(scanner, advertiser) &&
        !this.visible(advertiser, scanner)
      ) {
        return;
      }
      this.openLink(key, scanner, advertiser);
    }, delay);
    this.pendingDiscovery.set(key, () => clearTimeout(handle));
  }

  // How many links this device holds in the central (GATT client) role.
  // Counted live rather than tracked, so it can never drift from the truth.
  private centralLinkCount(deviceID: string): number {
    let n = 0;
    for (const link of this.links.values()) {
      if (link.a === deviceID) n++;
    }
    for (const [, pending] of this.pendingDiscovery) {
      void pending;
    }
    return n;
  }

  private openLink(key: string, scanner: string, advertiser: string): void {
    if (this.links.has(key)) return;
    // Re-check at connect time: five other discoveries may have completed while
    // this one was in flight, which is exactly how a real controller ends up
    // over its limit.
    if (this.centralLinkCount(scanner) >= MAX_CENTRAL_LINKS) return;
    const s = this.devices.get(scanner);
    const a = this.devices.get(advertiser);
    if (s === undefined || a === undefined) return;

    const rssi = this.rng.int(-90, -40);
    const link: Link = {
      a: scanner,
      b: advertiser,
      aLinkID: `link:${advertiser}`,
      bLinkID: `link:${scanner}`,
      rssi,
      aLastDeliveryAt: this.world.now,
      bLastDeliveryAt: this.world.now,
    };
    this.links.set(key, link);
    this.world.say("LINK_UP", `${scanner} <-> ${advertiser} (${rssi}dBm)`);

    // The scanner is GATT central; the advertiser is peripheral. Each side is
    // told about its own handle only.
    s.native.fabricLinkUp(link.aLinkID, "central", rssi);
    a.native.fabricLinkUp(link.bLinkID, "peripheral", rssi);
  }

  private dropLink(key: string): void {
    const link = this.links.get(key);
    if (link === undefined) return;
    this.links.delete(key);
    this.world.say("LINK_DOWN", `${link.a} <-> ${link.b}`);
    const a = this.devices.get(link.a);
    const b = this.devices.get(link.b);
    a?.native.fabricLinkDown(link.aLinkID);
    b?.native.fabricLinkDown(link.bLinkID);
  }

  // ---- carriage -------------------------------------------------------------

  private onWrite(fromID: string, linkID: string, dataBase64: string): void {
    if (this.disposed) return;
    // linkID is the SENDER's handle, which names the far side.
    const toID = linkID.startsWith("link:") ? linkID.slice("link:".length) : "";
    const key = pairKey(fromID, toID);
    const link = this.links.get(key);
    if (link === undefined) return;

    const to = this.devices.get(toID);
    if (to === undefined) return;

    for (const tap of this.taps) tap(fromID, linkID, dataBase64);

    const cond = this.conditionsFor(fromID, toID);
    const bytes = base64ByteLength(dataBase64);
    this.bytesOnAir += bytes;
    this.countType(dataBase64);

    // A real link cannot carry a frame past the ATT attribute ceiling. Android
    // truncates the write to MTU-3 and the far side's decoder rejects what is
    // left; iOS refuses it outright. Either way nothing arrives, so the fabric
    // drops it and counts it.
    //
    // The fabric used to accept any size, which is why a 557-byte fragment
    // passed every simulation while every attachment vanished on real hardware.
    // `framesOversized` exists so a scenario can assert it never happened.
    if (bytes > MAX_BLE_FRAME) {
      this.framesOversized++;
      this.world.say(
        "FRAME_OVERSIZED",
        `${fromID} -> ${toID} ${String(bytes)}B exceeds the ${String(MAX_BLE_FRAME)}B link limit, dropped`,
      );
      return;
    }

    if (this.rng.chance(cond.loss)) {
      this.packetsDropped++;
      this.world.say("PACKET_LOST", `${fromID} -> ${toID} (${bytes}B)`);
      return;
    }

    const receiverLinkID = link.a === toID ? link.aLinkID : link.bLinkID;

    // Ordering: a packet cannot arrive before the previous one on the same
    // link, unless the scenario explicitly asked for reordering.
    const base =
      this.world.now + cond.latencyMs + this.rng.int(0, cond.jitterMs);
    const floorKey = link.a === toID ? "aLastDeliveryAt" : "bLastDeliveryAt";
    let at = base;
    if (!this.rng.chance(cond.reorder)) {
      at = Math.max(base, link[floorKey] + 1);
    }
    link[floorKey] = Math.max(link[floorKey], at);

    const payload = this.rng.chance(cond.corrupt)
      ? this.mangle(dataBase64)
      : dataBase64;
    if (payload !== dataBase64) {
      this.packetsCorrupted++;
      this.world.say("PACKET_CORRUPTED", `${fromID} -> ${toID}`);
    }

    this.deliverAt(at - this.world.now, to, receiverLinkID, payload);
    this.packetsDelivered++;

    if (this.rng.chance(cond.duplicate)) {
      this.packetsDuplicated++;
      this.world.say("PACKET_DUPLICATED", `${fromID} -> ${toID}`);
      this.deliverAt(
        at - this.world.now + this.rng.int(1, 40),
        to,
        receiverLinkID,
        payload,
      );
    }
  }

  private deliverAt(
    delay: number,
    to: RadioNode,
    linkID: string,
    dataBase64: string,
  ): void {
    setTimeout(
      () => {
        if (this.disposed) return;
        to.native.fabricDeliver(linkID, dataBase64);
      },
      Math.max(1, delay),
    );
  }

  // Flip one byte of the base64. The decoder must reject the result; the app
  // must not die.
  private mangle(dataBase64: string): string {
    if (dataBase64.length < 8) return dataBase64;
    const alphabet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const i = this.rng.int(0, dataBase64.length - 1);
    const replacement = alphabet[this.rng.int(0, alphabet.length - 1)];
    return dataBase64.slice(0, i) + replacement + dataBase64.slice(i + 1);
  }

  // Byte [1] of a v2 frame is the packet type. Base64 encodes 3 bytes per 4
  // characters, so the first four characters carry bytes 0-2 and byte [1] is
  // bits 6-13 of that group.
  private countType(dataBase64: string): void {
    if (dataBase64.length < 4) return;
    const A =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const c1 = A.indexOf(dataBase64[1]);
    const c2 = A.indexOf(dataBase64[2]);
    if (c1 < 0 || c2 < 0) return;
    const type = ((c1 & 0x0f) << 4) | (c2 >> 2);
    this.typeCounts.set(type, (this.typeCounts.get(type) ?? 0) + 1);
  }

  // ---- adversary ------------------------------------------------------------

  // Listen to everything on the air.
  //
  // This is not a test hook so much as a capability anybody within thirty
  // metres already has: BLE is a broadcast medium, and a passive listener
  // records whatever is transmitted. Scenarios use it to capture traffic and
  // replay it later. Returns an unsubscribe.
  private readonly taps: ((
    fromID: string,
    linkID: string,
    dataBase64: string,
  ) => void)[] = [];

  tapWrites(
    fn: (fromID: string, linkID: string, dataBase64: string) => void,
  ): () => void {
    this.taps.push(fn);
    return () => {
      const i = this.taps.indexOf(fn);
      if (i >= 0) this.taps.splice(i, 1);
    };
  }

  // Put arbitrary bytes on the wire toward a device, as a hostile phone in the
  // room would.
  //
  // Deliberately NOT routed through a SimDevice: an attacker is not running
  // Airhop, and modelling one as a device would lend it Airhop's own restraint.
  // This writes straight into the victim's radio over a link it already holds,
  // which is exactly the capability anybody within thirty metres has.
  injectTo(victimID: string, viaPeerID: string, dataBase64: string): boolean {
    const key = pairKey(victimID, viaPeerID);
    const link = this.links.get(key);
    if (link === undefined) return false;
    const victim = this.devices.get(victimID);
    if (victim === undefined) return false;
    const victimLinkID = link.a === victimID ? link.aLinkID : link.bLinkID;
    this.world.say("INJECT", `hostile bytes -> ${victimID} via ${viaPeerID}`);
    victim.native.fabricDeliver(victimLinkID, dataBase64);
    return true;
  }

  // ---- introspection --------------------------------------------------------

  // Human-readable airtime breakdown, most expensive first.
  airtimeReport(): string {
    const names: Record<number, string> = {
      0x01: "ANNOUNCE",
      0x02: "CHANNEL_MSG",
      0x03: "LEAVE",
      0x04: "COURIER_ENV",
      0x10: "NOISE_HANDSHAKE",
      0x11: "NOISE_ENCRYPTED",
      0x12: "DR_ENCRYPTED",
      0x20: "FRAGMENT",
      0x21: "REQUEST_SYNC",
      0x22: "FILE_TRANSFER",
      0x23: "BOARD_POST",
      0x24: "PREKEY_BUNDLE",
      0x25: "GROUP_MESSAGE",
      0x26: "PING",
      0x27: "PONG",
      0x28: "NOSTR_CARRIER",
      0x29: "VOICE_FRAME",
      0x50: "CHANNEL_ENC",
    };
    return [...this.typeCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([t, n]) => `${names[t] ?? `0x${t.toString(16)}`}=${n}`)
      .join(" ");
  }

  countOfType(type: number): number {
    return this.typeCounts.get(type) ?? 0;
  }

  linkCount(): number {
    return this.links.size;
  }

  linkedPairs(): string[] {
    return [...this.links.values()].map((l) => `${l.a}-${l.b}`).sort();
  }

  isLinked(a: string, b: string): boolean {
    return this.links.has(pairKey(a, b));
  }

  // Nudge RSSI on every open link, as a phone in a pocket in a crowd does.
  churnRssi(): void {
    for (const link of this.links.values()) {
      const rssi = this.rng.int(-95, -35);
      link.rssi = rssi;
      const a = this.devices.get(link.a);
      const b = this.devices.get(link.b);
      a?.native.fabricRssi(link.aLinkID, rssi);
      b?.native.fabricRssi(link.bLinkID, rssi);
    }
  }
}
