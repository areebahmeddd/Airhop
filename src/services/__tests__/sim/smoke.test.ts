/**
 * @jest-environment node
 */
// The first thing the simulation has to prove: two phones, one air, and they
// find each other on their own. Everything else in this directory depends on
// this working, so it is kept small and read as the harness's own unit test.

jest.mock("expo-location", () => ({}));
// Every phone needs its own event emitter. See harness/event-router.ts: this is
// the only interception point that reliably catches every resolution path.
jest.mock("react-native/Libraries/EventEmitter/RCTDeviceEventEmitter", () =>
  (
    require("./harness/event-router") as { routerModule: () => unknown }
  ).routerModule(),
);
// The factory bodies must be EAGER, not a lazy `get default()`. A getter fires
// at call time, which for a sandboxed device is after jest.isolateModules has
// already closed - so every phone would resolve the OUTER registry's shim and
// share one native module. Resolving here binds each sandbox to its own.
jest.mock("@bridge/NativeAirhopBLE", () => {
  const shim = require("../lifecycle/harness/bridge-shim");
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("@bridge/NativeAirhopWiFi", () => {
  const shim = require("../lifecycle/harness/bridge-shim");
  return { __esModule: true, default: shim.wifiBridge };
});

import { SimDevice } from "./harness/device";
import { eventRouter } from "./harness/event-router";
import { RadioFabric } from "./harness/radio-fabric";
import { RelayFabric } from "./harness/relay-fabric";
import { World } from "./harness/world";

describe("simulation harness", () => {
  let world: World;

  beforeEach(() => {
    jest.useFakeTimers();
    world = new World({ seed: 1, name: "smoke" });
  });

  afterEach(() => {
    world.close();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("two Android phones discover each other and exchange announces", async () => {
    const radio = new RadioFabric(world);
    const alice = SimDevice.create(world, {
      id: "alice",
      platform: "android",
      seedByte: 11,
    });
    const bob = SimDevice.create(world, {
      id: "bob",
      platform: "android",
      seedByte: 22,
    });
    radio.add(alice);
    radio.add(bob);

    expect(alice.peerID).not.toBe(bob.peerID);

    alice.launch();
    bob.launch();
    await world.advance(3000);

    if (radio.linkCount() === 0 || alice.peerCount() === 0) {
      throw new Error(
        [
          "",
          `links: ${radio.linkCount()} ${radio.linkedPairs().join(",")}`,
          `alice peers: ${alice.peers().join(",")}`,
          `bob peers: ${bob.peers().join(",")}`,
          `delivered: ${radio.packetsDelivered}`,
          "",
          world.formatTimeline(),
        ].join("\n"),
      );
    }

    expect(radio.linkCount()).toBe(1);
    expect(alice.peers()).toContain(bob.peerID);
    expect(bob.peers()).toContain(alice.peerID);
  });

  test("a phone with internet on reaches the virtual relays", async () => {
    const radio = new RadioFabric(world);
    const relay = new RelayFabric(world);
    const a = SimDevice.create(
      world,
      {
        id: "a",
        platform: "android",
        seedByte: 31,
        internetEnabled: true,
      },
      relay,
    );
    radio.add(a);
    a.launch();
    await world.advance(4000);

    if (relay.connectionCount("a") === 0) {
      throw new Error(`no relay connections\n${world.formatTimeline()}`);
    }
    expect(relay.connectionCount("a")).toBeGreaterThan(0);
    expect(relay.relayUrls().length).toBeGreaterThan(0);
  });

  // The load-bearing assumption of this whole directory. If two phones shared a
  // DeviceEventEmitter, each would receive the other's native events directly:
  // a relayed delivery would appear to work with nothing relaying it, and every
  // multi-hop and isolation scenario would pass for the wrong reason.
  test("phones do not share an event emitter", async () => {
    const radio = new RadioFabric(world);
    const a = SimDevice.create(world, {
      id: "a",
      platform: "android",
      seedByte: 3,
    });
    const b = SimDevice.create(world, {
      id: "b",
      platform: "android",
      seedByte: 4,
    });
    const c = SimDevice.create(world, {
      id: "c",
      platform: "android",
      seedByte: 5,
    });
    for (const d of [a, b, c]) radio.add(d);
    for (const d of [a, b, c]) d.launch();
    await world.advance(3000);

    // There is deliberately ONE router object; what must be separate is the
    // listener set behind it. Each phone's subscriptions are filed under its own
    // id, and nothing may be registered without a device context - an unowned
    // listener would receive every phone's events.
    const router = eventRouter();
    expect(router.unownedCount()).toBe(0);
    for (const d of [a, b, c]) {
      expect(router.eventNamesFor(d.id)).toContain("AirhopBLE.packetReceived");
    }

    // Three phones in range form three links, but each phone is only in two of
    // them, so no phone's service may believe it holds more than two.
    expect(radio.linkCount()).toBe(3);
    for (const d of [a, b, c]) {
      if (d.bleLinkCount() > 2) {
        throw new Error(
          `${d.id} believes it holds ${d.bleLinkCount()} links out of 3 in the world; ` +
            `it is only party to 2. service=[${d.bleLinkIDs().join(",")}] ` +
            `native=[${(d.native as unknown as { liveLinkIDs: () => string[] }).liveLinkIDs().join(",")}] ` +
            `fabric=[${radio.linkedPairs().join(" ")}]`,
        );
      }
    }
  });

  test("each phone has its own storage", async () => {
    const radio = new RadioFabric(world);
    const a = SimDevice.create(world, {
      id: "a",
      platform: "android",
      seedByte: 3,
    });
    const b = SimDevice.create(world, {
      id: "b",
      platform: "android",
      seedByte: 4,
    });
    radio.add(a);
    radio.add(b);
    a.launch();
    b.launch();
    await world.advance(2000);

    a.joinChannel("#solo");
    expect(a.channels()).toContain("#solo");
    expect(b.channels()).not.toContain("#solo");
  });
});
