// The same-platform fast path, as a fabric.
//
// Both platforms run WiFi Aware, the same NAN protocol, behind one TypeScript
// interface. Airhop treats it as one optional transport that beats BLE when it
// exists, which is the whole reason it is worth simulating: the mesh engine is
// supposed to not care which radio carried a packet.
//
// Deliberately far simpler than RadioFabric. A BLE link is the interesting one
// to model badly-behaved: it has an MTU ceiling, RSSI, loss and jitter, and the
// app's correctness depends on coping with all of it. A WiFi link is a socket:
// it is either up or it is not, it carries a whole frame, and it is orders of
// magnitude faster. Modelling loss and MTU here would be inventing failure modes
// the transport does not have.
//
// Two rules it DOES model, because both are real constraints and both are easy
// things to get wrong:
//
//   1. An Android phone and an iPhone never form a WiFi link, however close they
//      stand. Both speak NAN, but Apple requires a paired device for every data
//      path and refuses an open one, and Android cannot complete Apple's
//      pairing. Same protocol, still not a cross-platform path.
//   2. Two iPhones only link once they are paired. Pairing is the whole shape of
//      Apple's API, so a scenario that forgets it is asserting something the
//      field will never do. Android has no such gate and needs none.

import type { Platform } from "../../harness/os";
import type { World } from "./world";

// What the fabric needs from a device to wire it up. Structural, so a SimDevice
// satisfies it without the fabric importing one.
export interface WifiNode {
  readonly id: string;
  readonly platform: Platform;
  // Ignored on Android. On iOS it is the paired-device gate: two iPhones form a
  // link only once each has paired the other, the way Apple's framework works.
  readonly wifiPairedWith?: Set<string>;
  // Install the fabric's native module into this device's sandbox, and hand
  // back a way to push events onto the emitter its mesh-service listens on.
  attachWifiPort(port: WifiPort): void;
}

export interface WifiPort {
  // Called when this device writes to a link.
  write(linkID: string, dataBase64: string): void;
  // Raise one of the three `AirhopWiFi.*` events on this device.
  emit(event: string, body: Record<string, unknown>): void;
}

// A link is named by the far side, matching how mesh-service treats a linkID as
// an opaque handle it writes back to.
function handleFor(farSideID: string): string {
  return `wifi:${farSideID}`;
}

export class WifiFabric {
  private readonly nodes = new Map<string, WifiNode>();
  private readonly ports = new Map<string, WifiPort>();
  // Undirected pairs currently linked, keyed a|b with a < b.
  private readonly links = new Set<string>();
  private disposed = false;

  // Counters a scenario can assert on.
  framesCarried = 0;
  bytesCarried = 0;
  refusedCrossPlatform = 0;
  refusedUnpaired = 0;

  constructor(private readonly world: World) {
    world.onClose(() => {
      this.disposed = true;
    });
  }

  add(node: WifiNode): void {
    this.nodes.set(node.id, node);
    const port: WifiPort = {
      write: (linkID, dataBase64) => this.onWrite(node.id, linkID, dataBase64),
      // Replaced by the device when it attaches; this default keeps the type
      // honest for a node that never wires an emitter.
      emit: () => undefined,
    };
    node.attachWifiPort(port);
    this.ports.set(node.id, port);
  }

  // Pair two iPhones, as the system pairing sheet would.
  //
  // Symmetric because Apple's pairing is: each side ends up with the other in
  // its own list, and a one-sided call would model a state the sheet cannot
  // produce. A no-op for Android nodes, which have no pairing to record.
  pair(aID: string, bID: string): void {
    this.nodes.get(aID)?.wifiPairedWith?.add(bID);
    this.nodes.get(bID)?.wifiPairedWith?.add(aID);
    this.world.say("WIFI_PAIRED", `${aID} <-> ${bID}`);
  }

  // Bring a link up between two devices, as discovery would.
  //
  // Refuses and says so rather than failing quietly, in two cases. Two different
  // platforms cannot reach each other even though both speak NAN, because Apple
  // demands a paired data path that Android cannot complete. And two iPhones
  // that have not paired have nothing to discover, since Apple's browser only
  // ever names devices already in the paired list. A scenario that expected
  // either link is asserting something that cannot happen in the field.
  link(aID: string, bID: string): boolean {
    if (this.disposed) return false;
    const a = this.nodes.get(aID);
    const b = this.nodes.get(bID);
    if (a === undefined || b === undefined) return false;
    if (a.platform !== b.platform) {
      this.refusedCrossPlatform++;
      this.world.say(
        "WIFI_CROSS_PLATFORM",
        `${aID} (${a.platform}) and ${bID} (${b.platform}) cannot see each other`,
      );
      return false;
    }
    if (a.platform === "ios") {
      const paired =
        a.wifiPairedWith?.has(bID) === true &&
        b.wifiPairedWith?.has(aID) === true;
      if (!paired) {
        this.refusedUnpaired++;
        this.world.say(
          "WIFI_UNPAIRED",
          `${aID} and ${bID} are not paired, so there is nothing to discover`,
        );
        return false;
      }
    }
    const key = pairKey(aID, bID);
    if (this.links.has(key)) return true;
    this.links.add(key);
    this.world.say("WIFI_LINK_UP", `${aID} <-> ${bID}`);
    // Each side learns a handle naming the other, which is what it will write
    // back to.
    this.ports.get(aID)?.emit("AirhopWiFi.linkConnected", {
      linkID: handleFor(bID),
    });
    this.ports.get(bID)?.emit("AirhopWiFi.linkConnected", {
      linkID: handleFor(aID),
    });
    return true;
  }

  // Drop a link, as walking out of range does.
  unlink(aID: string, bID: string): void {
    const key = pairKey(aID, bID);
    if (!this.links.delete(key)) return;
    this.world.say("WIFI_LINK_DOWN", `${aID} <-> ${bID}`);
    this.ports.get(aID)?.emit("AirhopWiFi.linkDisconnected", {
      linkID: handleFor(bID),
    });
    this.ports.get(bID)?.emit("AirhopWiFi.linkDisconnected", {
      linkID: handleFor(aID),
    });
  }

  linkCount(): number {
    return this.links.size;
  }

  isLinked(aID: string, bID: string): boolean {
    return this.links.has(pairKey(aID, bID));
  }

  private onWrite(fromID: string, linkID: string, dataBase64: string): void {
    if (this.disposed) return;
    const toID = linkID.startsWith("wifi:") ? linkID.slice("wifi:".length) : "";
    if (!this.links.has(pairKey(fromID, toID))) return;
    const to = this.ports.get(toID);
    if (to === undefined) return;

    this.framesCarried++;
    this.bytesCarried += base64ByteLength(dataBase64);

    // A whole frame, in one piece. There is no MTU here: the point of the fast
    // path is that a payload BLE would have to fragment into hundreds of writes
    // crosses in a single one. Still delivered on a later tick, so nothing in
    // the app can depend on a synchronous write.
    setTimeout(() => {
      if (this.disposed) return;
      to.emit("AirhopWiFi.packetReceived", {
        linkID: handleFor(fromID),
        dataBase64,
      });
    }, 1);
  }
}

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

function base64ByteLength(b64: string): number {
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, (b64.length * 3) / 4 - padding);
}
