/**
 * @jest-environment node
 */
// The LAN transport differs from the other two in a way worth pinning down: it
// does not run because the mesh is running, it runs because somebody asked for
// it. Publishing an mDNS record tells everyone on the network, and whoever runs
// the network, that this phone is carrying Airhop, so consent is a precondition
// rather than a preference.
//
// The properties that matter:
//   * Nothing is published until the user turns it on AND the mesh is up.
//   * Turning it off stops publishing, not just dialling.
//   * Who gets dialled is the ring's answer, capped, and never dialled twice.
//   * A device that cannot run it is asked once, not polled forever.

const mockStartLAN = jest.fn<Promise<void>, [string]>();
const mockStopLAN = jest.fn<Promise<void>, []>();
const mockConnectToPeer = jest.fn<Promise<void>, [string]>();

jest.mock("@bridge/NativeAirhopLAN", () => ({
  __esModule: true,
  default: {
    startLAN: (name: string) => mockStartLAN(name),
    stopLAN: () => mockStopLAN(),
    connectToPeer: (name: string) => mockConnectToPeer(name),
    writeToLANLink: () => Promise.resolve(),
    addListener: () => undefined,
    removeListeners: () => undefined,
  },
}));

import { LANController } from "../lan-controller";

const SELF = "5000000000000000";

function rejectWith(code: string): Promise<never> {
  const error = new Error(code) as Error & { code: string };
  error.code = code;
  return Promise.reject(error);
}

// Let every pending microtask and every expired timer run, repeatedly, so a
// retry that schedules another retry is followed to its conclusion.
async function settle(ms = 0): Promise<void> {
  for (let i = 0; i < 8; i++) {
    jest.advanceTimersByTime(ms);
    await Promise.resolve();
    await Promise.resolve();
  }
}

// Long enough to clear the discovery settle window.
const SETTLED = 600;

function running(): LANController {
  const lan = new LANController(() => SELF);
  lan.start();
  lan.setEnabled(true);
  return lan;
}

beforeEach(() => {
  jest.useFakeTimers();
  mockStartLAN.mockReset();
  mockStartLAN.mockResolvedValue(undefined);
  mockStopLAN.mockReset();
  mockStopLAN.mockResolvedValue(undefined);
  mockConnectToPeer.mockReset();
  mockConnectToPeer.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("consent", () => {
  test("publishes nothing until the user turns it on", async () => {
    const lan = new LANController(() => SELF);

    lan.start();
    await settle();

    expect(mockStartLAN).not.toHaveBeenCalled();
    expect(lan.isStarted).toBe(false);
  });

  test("publishes nothing while it is on but the mesh is not running", async () => {
    const lan = new LANController(() => SELF);

    lan.setEnabled(true);
    await settle();

    expect(mockStartLAN).not.toHaveBeenCalled();
  });

  test("publishes once both are true, under the name it was given", async () => {
    const lan = running();
    await settle();

    expect(mockStartLAN).toHaveBeenCalledWith(SELF);
    expect(lan.isStarted).toBe(true);
  });

  test("turning it off stops publishing, not just dialling", async () => {
    const lan = running();
    await settle();

    lan.setEnabled(false);
    await settle();

    expect(mockStopLAN).toHaveBeenCalled();
    expect(lan.isStarted).toBe(false);
  });

  test("going Away stops it even while the switch is still on", async () => {
    const lan = running();
    await settle();

    lan.stop();
    await settle();

    expect(lan.isStarted).toBe(false);
  });
});

// The privacy policy claims records from two networks cannot be matched to the
// same phone. That is only true while the published name changes, so it is
// pinned here rather than left to the comment.
describe("the published name", () => {
  test("is minted fresh for every publishing session", async () => {
    let n = 0;
    const lan = new LANController(() => `name-${String(++n)}`);

    lan.start();
    lan.setEnabled(true);
    await settle();
    expect(mockStartLAN).toHaveBeenLastCalledWith("name-1");

    // Walking out of the office and into a cafe: the transport comes down and
    // goes back up.
    lan.setEnabled(false);
    await settle();
    lan.setEnabled(true);
    await settle();

    expect(mockStartLAN).toHaveBeenLastCalledWith("name-2");
  });

  test("forgets peers found under the previous name", async () => {
    let n = 0;
    const lan = new LANController(() => `name-${String(++n)}`);
    lan.start();
    lan.setEnabled(true);
    await settle();

    lan.onPeerDiscovered("9000000000000000");
    expect(lan.discoveredCount).toBe(1);

    lan.setEnabled(false);
    await settle();
    lan.setEnabled(true);
    await settle();

    // A peer seen on the old network is not a peer on this one.
    expect(lan.discoveredCount).toBe(0);
  });
});

describe("dialling", () => {
  function discover(lan: LANController, names: readonly string[]): void {
    for (const serviceName of names) lan.onPeerDiscovered(serviceName);
  }

  test("dials nobody before the discovery burst settles", async () => {
    const lan = running();
    await settle();

    discover(lan, ["6000000000000000"]);
    await settle();

    expect(mockConnectToPeer).not.toHaveBeenCalled();
  });

  test("dials the peers the ring says are ours to open", async () => {
    const lan = running();
    await settle();

    // One below us and one above. Only the one above is ours to dial.
    discover(lan, ["1000000000000000", "9000000000000000"]);
    await settle(SETTLED);

    expect(mockConnectToPeer).toHaveBeenCalledTimes(1);
    expect(mockConnectToPeer).toHaveBeenCalledWith("9000000000000000");
  });

  test("never dials the same peer twice", async () => {
    const lan = running();
    await settle();

    discover(lan, ["9000000000000000"]);
    await settle(SETTLED);
    discover(lan, ["9000000000000000"]);
    await settle(SETTLED);

    expect(mockConnectToPeer).toHaveBeenCalledTimes(1);
  });

  test("dials a peer again after a refused connect", async () => {
    mockConnectToPeer.mockRejectedValue(new Error("CONNECT_FAILED"));
    const lan = running();
    await settle();

    discover(lan, ["9000000000000000"]);
    await settle(SETTLED);
    expect(mockConnectToPeer).toHaveBeenCalledTimes(1);

    lan.onPeerLost("9000000000000000");
    discover(lan, ["9000000000000000"]);
    await settle(SETTLED);

    expect(mockConnectToPeer).toHaveBeenCalledTimes(2);
  });

  // A TCP link can drop while the peer's mDNS record stays perfectly visible.
  // Nothing about that is a discovery change, so without the periodic pass the
  // peer would be lost until it restarted.
  test("walks the plan again on a timer, so a dropped link is reopened", async () => {
    const lan = running();
    await settle();

    discover(lan, ["9000000000000000"]);
    await settle(SETTLED);
    expect(mockConnectToPeer).toHaveBeenCalledTimes(1);

    // No discovery change at all: just time passing.
    await settle(16_000);

    expect(mockConnectToPeer.mock.calls.length).toBeGreaterThan(1);
  });

  test("stops reviewing once the transport is off", async () => {
    const lan = running();
    await settle();
    discover(lan, ["9000000000000000"]);
    await settle(SETTLED);
    const dialled = mockConnectToPeer.mock.calls.length;

    lan.setEnabled(false);
    await settle(60_000);

    expect(mockConnectToPeer.mock.calls.length).toBe(dialled);
  });

  test("ignores our own record coming back off the network", async () => {
    const lan = running();
    await settle();

    discover(lan, [SELF]);
    await settle(SETTLED);

    expect(mockConnectToPeer).not.toHaveBeenCalled();
    expect(lan.discoveredCount).toBe(0);
  });

  test("does not dial while the transport is not running", async () => {
    const lan = new LANController(() => SELF);
    lan.start();

    discover(lan, ["9000000000000000"]);
    await settle(SETTLED);

    expect(mockConnectToPeer).not.toHaveBeenCalled();
  });
});

describe("failures", () => {
  test("asks once on a device that will never support it", async () => {
    mockStartLAN.mockImplementation(() => rejectWith("LAN_UNSUPPORTED"));
    const lan = running();

    await settle(60_000);

    expect(mockStartLAN).toHaveBeenCalledTimes(1);
    expect(lan.isUnsupported).toBe(true);
  });

  test("keeps trying while the network is merely missing", async () => {
    mockStartLAN.mockImplementation(() => rejectWith("LAN_UNAVAILABLE"));
    const lan = running();

    await settle(10_000);

    expect(mockStartLAN.mock.calls.length).toBeGreaterThan(1);
    expect(lan.isUnsupported).toBe(false);
  });

  test("keeps trying after a refused permission, since it can be granted", async () => {
    mockStartLAN.mockImplementation(() => rejectWith("PERMISSION_DENIED"));
    const lan = running();

    await settle(10_000);

    expect(mockStartLAN.mock.calls.length).toBeGreaterThan(1);
    expect(lan.failure).toBe("permission");
  });

  test("recovers when the network goes away and comes back", async () => {
    const lan = running();
    await settle();
    expect(lan.isStarted).toBe(true);

    lan.onAvailabilityChanged(false);
    await settle();
    expect(lan.isStarted).toBe(false);

    lan.onAvailabilityChanged(true);
    await settle();
    expect(lan.isStarted).toBe(true);
  });

  test("forgets the network it was on when that network goes away", async () => {
    const lan = running();
    await settle();
    lan.onPeerDiscovered("9000000000000000");
    expect(lan.discoveredCount).toBe(1);

    lan.onAvailabilityChanged(false);

    expect(lan.discoveredCount).toBe(0);
  });
});

describe("reported state", () => {
  test("says searching while running with nobody found", async () => {
    const seen: string[] = [];
    const lan = new LANController(
      () => SELF,
      (s) => seen.push(s),
    );

    lan.start();
    lan.setEnabled(true);
    await settle();

    expect(seen).toContain("searching");
  });

  test("says active once a link is up, and searching again when it drops", async () => {
    const seen: string[] = [];
    const lan = new LANController(
      () => SELF,
      (s) => seen.push(s),
    );
    lan.start();
    lan.setEnabled(true);
    await settle();

    lan.setLinkCount(1);
    expect(seen).toContain("active");

    lan.setLinkCount(0);
    expect(seen[seen.length - 1]).toBe("searching");
  });
});
