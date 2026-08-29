/**
 * @jest-environment node
 */
// The WiFi fast path used to be one unretried call with its error thrown away.
// These cases are the three field reports that produced the reconciler, plus
// the two ways a reconciler can be worse than nothing if it gets the
// permanent/transient split wrong.
//
// The properties that matter:
//   * A device that CAN run the fast path eventually does, whatever order the
//     radio and the permission arrive in.
//   * A device that CANNOT is asked exactly once. The BLE side learned this the
//     expensive way, retrying an unsupported advertiser every five seconds for
//     the life of the process.
//   * Losing the radio is recoverable. This is the one the old code could not
//     do at all: native latched itself "started" over a dead session and every
//     later start resolved instantly having done nothing.

const mockStartWiFi = jest.fn<Promise<void>, []>();
const mockStopWiFi = jest.fn<Promise<void>, []>();

jest.mock("@bridge/NativeAirhopWiFi", () => ({
  __esModule: true,
  default: {
    startWiFi: () => mockStartWiFi(),
    stopWiFi: () => mockStopWiFi(),
    writeToWiFiLink: () => Promise.resolve(),
    addListener: () => undefined,
    removeListeners: () => undefined,
  },
}));

import { WiFiController } from "../wifi-controller";

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

beforeEach(() => {
  jest.useFakeTimers();
  mockStartWiFi.mockReset();
  mockStopWiFi.mockReset();
  mockStopWiFi.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("a device that can run the fast path", () => {
  test("starts once and does not restart while it is already up", async () => {
    mockStartWiFi.mockResolvedValue(undefined);
    const wifi = new WiFiController();

    wifi.start();
    await settle();
    expect(wifi.isStarted).toBe(true);
    expect(mockStartWiFi).toHaveBeenCalledTimes(1);

    // A resume, a pull-to-refresh, a permission grant: all land here, and none
    // of them should tear down a working transport.
    wifi.refresh();
    wifi.refresh();
    await settle();
    expect(mockStartWiFi).toHaveBeenCalledTimes(1);
  });
});

describe("WiFi switched off when the mesh starts", () => {
  test("keeps retrying, and comes up when the radio returns", async () => {
    mockStartWiFi.mockImplementation(() =>
      rejectWith("WIFI_AWARE_UNAVAILABLE"),
    );
    const wifi = new WiFiController();

    wifi.start();
    await settle();
    expect(wifi.isStarted).toBe(false);
    expect(wifi.failure).toBe("unavailable");

    // This is the whole bug: the old code stopped here forever.
    await settle(1_000);
    expect(mockStartWiFi.mock.calls.length).toBeGreaterThan(1);

    mockStartWiFi.mockResolvedValue(undefined);
    await settle(30_000);
    expect(wifi.isStarted).toBe(true);
  });

  test("recovers immediately when native reports the radio back", async () => {
    mockStartWiFi.mockImplementation(() =>
      rejectWith("WIFI_AWARE_UNAVAILABLE"),
    );
    const wifi = new WiFiController();
    wifi.start();
    await settle();
    expect(wifi.isStarted).toBe(false);

    mockStartWiFi.mockResolvedValue(undefined);
    wifi.onAvailabilityChanged(true);
    await settle();
    expect(wifi.isStarted).toBe(true);
  });
});

describe("the permission arriving after the mesh started", () => {
  test("is retried rather than being a one-shot refusal", async () => {
    mockStartWiFi.mockImplementation(() => rejectWith("PERMISSION_DENIED"));
    const wifi = new WiFiController();

    wifi.start();
    await settle();
    expect(wifi.failure).toBe("permission");

    // Nothing asks the user to fix this - the fast path has no banner - so the
    // retry is the only route back, unlike Bluetooth.
    mockStartWiFi.mockResolvedValue(undefined);
    await settle(30_000);
    expect(wifi.isStarted).toBe(true);
  });
});

describe("a device with no fast path at all", () => {
  test("is asked exactly once and never polled again", async () => {
    mockStartWiFi.mockImplementation(() =>
      rejectWith("WIFI_AWARE_UNSUPPORTED"),
    );
    const wifi = new WiFiController();

    wifi.start();
    await settle();
    expect(wifi.isUnsupported).toBe(true);
    expect(mockStartWiFi).toHaveBeenCalledTimes(1);

    // Neither a resume nor the radio appearing may reopen the question: no
    // chipset grows a WiFi Aware radio, and no phone downgrades its API level.
    wifi.refresh();
    wifi.onAvailabilityChanged(true);
    await settle(120_000);
    expect(mockStartWiFi).toHaveBeenCalledTimes(1);
  });
});

describe("losing the radio mid-session", () => {
  test("releases the native handle and re-attaches when it returns", async () => {
    mockStartWiFi.mockResolvedValue(undefined);
    const wifi = new WiFiController();
    wifi.start();
    await settle();
    expect(wifi.isStarted).toBe(true);

    wifi.onAvailabilityChanged(false);
    await settle();
    // Forgetting we are started is what makes the next attach real work rather
    // than an instant resolve over a dead session.
    expect(wifi.isStarted).toBe(false);
    expect(mockStopWiFi).toHaveBeenCalled();

    wifi.onAvailabilityChanged(true);
    await settle();
    expect(wifi.isStarted).toBe(true);
    expect(mockStartWiFi).toHaveBeenCalledTimes(2);
  });
});

describe("stopping", () => {
  test("going Away brings the transport down and cancels the retry ladder", async () => {
    mockStartWiFi.mockImplementation(() =>
      rejectWith("WIFI_AWARE_UNAVAILABLE"),
    );
    const wifi = new WiFiController();
    wifi.start();
    await settle();
    const attemptsWhileRunning = mockStartWiFi.mock.calls.length;

    wifi.stop();
    await settle(60_000);
    // A user who chose to be offline must not have the transport brought back
    // by a timer they never saw.
    expect(mockStartWiFi).toHaveBeenCalledTimes(attemptsWhileRunning);
    expect(wifi.isStarted).toBe(false);
  });

  test("going Away mid-attach releases the session native did open", async () => {
    // The attach is in flight when the user chooses Away. Native completes it
    // regardless, so the handle exists and something has to hand it back;
    // returning early on the flipped intent would leave a live WiFi Aware
    // session over a mesh the user just stopped.
    let finishAttach: () => void = () => undefined;
    mockStartWiFi.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishAttach = resolve;
        }),
    );
    const wifi = new WiFiController();
    wifi.start();
    await settle();

    wifi.stop();
    finishAttach();
    await settle();

    expect(mockStopWiFi).toHaveBeenCalled();
    expect(wifi.isStarted).toBe(false);
  });

  test("disposing mid-attach also releases it", async () => {
    // Same race, but through a panic wipe. The reconcile loop does not run again
    // once disposed, so the release cannot be left to it.
    let finishAttach: () => void = () => undefined;
    mockStartWiFi.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishAttach = resolve;
        }),
    );
    const wifi = new WiFiController();
    wifi.start();
    await settle();

    wifi.dispose();
    finishAttach();
    await settle();

    expect(mockStopWiFi).toHaveBeenCalled();
    expect(wifi.isStarted).toBe(false);
  });

  test("a disposed controller never issues another start", async () => {
    mockStartWiFi.mockImplementation(() =>
      rejectWith("WIFI_AWARE_UNAVAILABLE"),
    );
    const wifi = new WiFiController();
    wifi.start();
    await settle();
    const before = mockStartWiFi.mock.calls.length;

    // A panic wipe disposes the mesh. A retry landing after it would open a
    // socket under an identity that no longer exists.
    wifi.dispose();
    await settle(60_000);
    expect(mockStartWiFi).toHaveBeenCalledTimes(before);
  });
});

describe("an availability drop during an attach", () => {
  test("does not latch the transport started against a radio that has gone", async () => {
    // The failure this whole reconciler exists to remove, on the one edge that
    // still had it. The drop forgets `started` and schedules a retry, then the
    // stale attach resolves and re-asserts `started` - and from then on every
    // retry and every refresh returns early at the "already started" guard,
    // leaving the fast path dead for the rest of the session.
    let finishAttach: () => void = () => undefined;
    mockStartWiFi.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishAttach = resolve;
        }),
    );
    const wifi = new WiFiController();
    wifi.start();
    await settle();

    wifi.onAvailabilityChanged(false);
    finishAttach();
    await settle();

    expect(wifi.isStarted).toBe(false);

    // And the transport can still come back, which is the point of forgetting.
    mockStartWiFi.mockResolvedValue(undefined);
    wifi.onAvailabilityChanged(true);
    await settle();
    expect(wifi.isStarted).toBe(true);
  });
});

// What the controller TELLS the rest of the app. The Mesh tab shows a neutral
// note when the fast path is off, so the reporting has to be honest about which
// of "off", "never had it" and "we don't know" applies - and quiet when nothing
// has changed, since the reconciler runs on a retry ladder.
describe("reporting the fast path's state", () => {
  test("reports it live once native attaches", async () => {
    mockStartWiFi.mockResolvedValue(undefined);
    const seen: string[] = [];
    const wifi = new WiFiController((state) => seen.push(state));

    wifi.start();
    await settle();

    expect(seen).toEqual(["active"]);
  });

  test("reports WiFi being off, and only once across a ladder of retries", async () => {
    mockStartWiFi.mockImplementation(() =>
      rejectWith("WIFI_AWARE_UNAVAILABLE"),
    );
    const seen: string[] = [];
    const wifi = new WiFiController((state) => seen.push(state));

    wifi.start();
    await settle(60_000);

    expect(mockStartWiFi.mock.calls.length).toBeGreaterThan(1);
    expect(seen).toEqual(["unavailable"]);
  });

  // Switching WiFi off mid-session, which is the banner's real trigger. Native
  // reports the drop, the retry re-reads the radio, and THAT is what names it.
  test("reports WiFi off once the retry confirms the radio is the reason", async () => {
    mockStartWiFi.mockResolvedValue(undefined);
    const seen: string[] = [];
    const wifi = new WiFiController((state) => seen.push(state));

    wifi.start();
    await settle();
    expect(seen).toEqual(["active"]);

    mockStartWiFi.mockImplementation(() =>
      rejectWith("WIFI_AWARE_UNAVAILABLE"),
    );
    wifi.onAvailabilityChanged(false);
    await settle(1_000);

    expect(seen).toEqual(["active", "unavailable"]);
  });

  // The same `available: false` also arrives when discovery is refused on a
  // device whose WiFi is on (AirhopWiFiModule.reportDiscoveryRefused). Calling
  // that "WiFi off" would send the user to a toggle that is already on.
  test("does not blame WiFi for a drop that turns out to be a refusal", async () => {
    mockStartWiFi.mockResolvedValue(undefined);
    const seen: string[] = [];
    const wifi = new WiFiController((state) => seen.push(state));

    wifi.start();
    await settle();

    mockStartWiFi.mockImplementation(() => rejectWith("PERMISSION_DENIED"));
    wifi.onAvailabilityChanged(false);
    await settle(1_000);

    expect(seen).toEqual(["active", "permission"]);
  });

  // "Attach failed for some other reason" is not "WiFi is off". Saying so would
  // send someone to a toggle that is already on, so it reports no reading -
  // which from a cold start means saying nothing at all.
  test("stays silent on an unnameable failure rather than blaming WiFi", async () => {
    mockStartWiFi.mockImplementation(() =>
      rejectWith("WIFI_AWARE_ATTACH_FAILED"),
    );
    const seen: string[] = [];
    const wifi = new WiFiController((state) => seen.push(state));

    wifi.start();
    await settle(60_000);

    expect(seen).toEqual([]);
  });

  // And it retracts a stale claim: a transport that WAS up and then failed for
  // an unnameable reason must stop being reported as live.
  test("retracts a live claim when a later attach fails unnameably", async () => {
    mockStartWiFi.mockResolvedValue(undefined);
    const seen: string[] = [];
    const wifi = new WiFiController((state) => seen.push(state));

    wifi.start();
    await settle();

    mockStartWiFi.mockImplementation(() =>
      rejectWith("WIFI_AWARE_ATTACH_FAILED"),
    );
    // Losing the radio clears `started`, so the next pass really re-attaches.
    // The drop itself says nothing - only the re-attach knows why - and what it
    // finds is a failure it cannot name, so the live claim is retracted to "no
    // reading" rather than upgraded into a WiFi-off banner.
    wifi.onAvailabilityChanged(false);
    wifi.onAvailabilityChanged(true);
    await settle(60_000);

    expect(seen).toEqual(["active", "unknown"]);
  });

  test("reports hardware that will never have it, so the note is never shown there", async () => {
    mockStartWiFi.mockImplementation(() =>
      rejectWith("WIFI_AWARE_UNSUPPORTED"),
    );
    const seen: string[] = [];
    const wifi = new WiFiController((state) => seen.push(state));

    wifi.start();
    await settle(60_000);

    expect(seen).toEqual(["unsupported"]);
  });
});

// The pairing gate, which only iOS arms.
//
// Apple's WiFi Aware has no unpaired mode, so an attach with nothing paired
// stands up a listener and a browser that can never find anybody. The gate is
// also the only thing that can tear the transport back down when the user
// removes their last pairing in the Settings app, which is a state change native
// has no other way to report.
describe("the pairing gate", () => {
  test("does not exist until something reports a count, so Android is untouched", async () => {
    mockStartWiFi.mockResolvedValue(undefined);
    const wifi = new WiFiController();

    wifi.start();
    await settle();

    // Nothing called setPairedCount, which is every Android build.
    expect(wifi.isStarted).toBe(true);
    expect(mockStartWiFi).toHaveBeenCalledTimes(1);
  });

  test("refuses to attach while nothing is paired", async () => {
    mockStartWiFi.mockResolvedValue(undefined);
    const seen: string[] = [];
    const wifi = new WiFiController((state) => seen.push(state));

    wifi.setPairedCount(0);
    wifi.start();
    await settle(60_000);

    expect(mockStartWiFi).not.toHaveBeenCalled();
    expect(wifi.isStarted).toBe(false);
    // Reported once, and NOT retried on the ladder: no amount of asking again
    // changes it, and the pairing module runs a pass the moment it does.
    expect(seen).toEqual(["unpaired"]);
  });

  test("attaches as soon as the first device is paired", async () => {
    mockStartWiFi.mockResolvedValue(undefined);
    const seen: string[] = [];
    const wifi = new WiFiController((state) => seen.push(state));

    wifi.setPairedCount(0);
    wifi.start();
    await settle();
    expect(mockStartWiFi).not.toHaveBeenCalled();

    wifi.setPairedCount(1);
    await settle();

    expect(mockStartWiFi).toHaveBeenCalledTimes(1);
    expect(wifi.isStarted).toBe(true);
    expect(seen).toEqual(["unpaired", "active"]);
  });

  test("brings a running transport down when the last pairing is removed", async () => {
    mockStartWiFi.mockResolvedValue(undefined);
    const seen: string[] = [];
    const wifi = new WiFiController((state) => seen.push(state));

    wifi.setPairedCount(1);
    wifi.start();
    await settle();
    expect(wifi.isStarted).toBe(true);

    // Unpaired in Settings, which nothing else would ever tell us about.
    wifi.setPairedCount(0);
    await settle();

    expect(mockStopWiFi).toHaveBeenCalled();
    expect(wifi.isStarted).toBe(false);
    expect(seen).toEqual(["active", "unpaired"]);
  });

  test("treats a native unpaired refusal the same way, without a retry ladder", async () => {
    // Defence in depth: the gate above should have caught this, so reaching
    // native at all means the two disagreed. The response is the same either
    // way, and it must not become a poll.
    mockStartWiFi.mockImplementation(() => rejectWith("WIFI_AWARE_UNPAIRED"));
    const seen: string[] = [];
    const wifi = new WiFiController((state) => seen.push(state));

    wifi.start();
    await settle(60_000);

    expect(mockStartWiFi).toHaveBeenCalledTimes(1);
    expect(seen).toEqual(["unpaired"]);
  });
});
