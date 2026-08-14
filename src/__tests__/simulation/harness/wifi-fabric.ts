// The same-platform fast path, as a fabric.
//
// WiFi Aware (Android) and MultipeerConnectivity (iOS) are two different
// protocols behind one TypeScript interface. Airhop treats them as one optional
// transport that beats BLE when it exists, which is the whole reason it is worth
// simulating: the mesh engine is supposed to not care which radio carried a
// packet, and that claim has never been exercised.
//
// Deliberately far simpler than RadioFabric. A BLE link is the interesting one
// to model badly-behaved: it has an MTU ceiling, RSSI, loss and jitter, and the
// app's correctness depends on coping with all of it. A WiFi link is a socket:
// it is either up or it is not, it carries a whole frame, and it is orders of
// magnitude faster. Modelling loss and MTU here would be inventing failure modes
// the transport does not have.
//
// The one rule it DOES model, because it is a real constraint and an easy thing
// to get wrong: the two protocols cannot talk to each other. An Android phone
// and an iPhone never form a WiFi link, however close they stand.

import type { Platform } from "../../harness/os";
import type { World } from "./world";

// What the fabric needs from a device to wire it up. Structural, so a SimDevice
// satisfies it without the fabric importing one.
export interface WifiNode {
  readonly id: string;
  readonly platform: Platform;
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

  // Bring a link up between two devices, as discovery would.
  //
  // Refuses and says so rather than failing quietly, in two cases. An iPhone has
  // no fast path at all: MultipeerConnectivity was removed, so iOS registers no
  // WiFi module and the controller latches "unsupported" on its first pass. And
  // two different platforms cannot see each other even in principle. A scenario
  // that expected either link is asserting something that cannot happen in the
  // field.
  link(aID: string, bID: string): boolean {
    if (this.disposed) return false;
    const a = this.nodes.get(aID);
    const b = this.nodes.get(bID);
    if (a === undefined || b === undefined) return false;
    const noFastPath = [a, b].find((n) => n.platform !== "android");
    if (noFastPath !== undefined) {
      this.refusedCrossPlatform++;
      this.world.say(
        "WIFI_NO_FAST_PATH",
        `${noFastPath.platform} has no WiFi transport, so ${aID} <-> ${bID} stays on Bluetooth`,
      );
      return false;
    }
    if (a.platform !== b.platform) {
      this.refusedCrossPlatform++;
      this.world.say(
        "WIFI_CROSS_PLATFORM",
        `${aID} (${a.platform}) and ${bID} (${b.platform}) cannot see each other`,
      );
      return false;
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
