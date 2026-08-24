// The Android Tor decision, which is a privacy claim rather than a convenience,
// and the gate that backs it.
//
// Two things have to hold. The claim is only true when Orbot's daemon answers
// AND a VPN transport is capturing traffic: an installed-but-idle Orbot beside
// an unrelated corporate VPN satisfies either test alone and routes nothing.
// And the response to losing it has to be a teardown, because lowering the
// claim while the relay pool stays connected keeps geohash presence, DM
// metadata and bridge events leaving the phone in the clear. Android has no
// per-socket SOCKS shim to fail at, so it fails closed one layer up: no Nostr
// transport at all while Tor is wanted and not routing.
//
// Overstating protection is worse than offering none, so these assert the
// refusals and the teardowns, not just the happy path.

const mockGetTorProxyPort = jest.fn<Promise<number>, []>();
const mockGetTorAvailability = jest.fn<
  Promise<{ orbotInstalled: boolean; vpnActive: boolean }>,
  []
>();
const mockStartVpnWatch = jest.fn<Promise<void>, []>();
const mockStopVpnWatch = jest.fn<Promise<void>, []>();
const mockRestartNostr = jest.fn();
const mockSetTorActive = jest.fn();
const mockSetTorBootstrap = jest.fn();
const mockSetTorEnabled = jest.fn();

let mockTorEnabled = false;
// The gate, as the store would hold it. Read back by writeTorGate, so a
// re-assert is a no-op here exactly as it is on a device.
let mockNostrBlockedByTor = false;
const mockSetNostrBlockedByTor = jest.fn((blocked: boolean) => {
  mockNostrBlockedByTor = blocked;
});

// The two VPN listeners the module registers, so a test can fire the edges the
// framework would.
let vpnLostListener: (() => void) | null = null;
let vpnAvailableListener: (() => void) | null = null;

jest.mock("react-native", () => ({
  Platform: { OS: "android" },
  NativeModules: {},
  NativeEventEmitter: class {},
}));

jest.mock("nostr-tools/pool", () => ({
  useWebSocketImplementation: jest.fn(),
}));

// Delegating wrappers rather than the mocks themselves: this factory runs when
// tor-routing is first imported, and imports are hoisted above the `const`
// declarations above, so referencing them directly would capture `undefined`.
jest.mock("@bridge/NativeAirhopBLE", () => ({
  __esModule: true,
  default: {
    getTorProxyPort: () => mockGetTorProxyPort(),
    getTorAvailability: () => mockGetTorAvailability(),
    startVpnWatch: () => mockStartVpnWatch(),
    stopVpnWatch: () => mockStopVpnWatch(),
  },
  subscribeVpnLost: (fn: () => void) => {
    vpnLostListener = fn;
    return {
      remove: () => {
        vpnLostListener = null;
      },
    };
  },
  subscribeVpnAvailable: (fn: () => void) => {
    vpnAvailableListener = fn;
    return {
      remove: () => {
        vpnAvailableListener = null;
      },
    };
  },
}));

// Android has no embedded Arti yet, which is what this module must cope with.
jest.mock("@bridge/NativeAirhopTor", () => ({
  __esModule: true,
  default: null,
}));

jest.mock("@bridge/NativeAirhopTorSocket", () => ({
  __esModule: true,
  isTorSocketNativeAvailable: () => false,
  AirhopTorSocketNative: undefined,
  subscribeTorSocket: jest.fn(),
}));

jest.mock("../mesh-service", () => ({
  getMeshService: () => ({ restartNostr: mockRestartNostr }),
}));

jest.mock("@store/mesh-state-store", () => ({
  useMeshStateStore: {
    getState: () => ({
      setTorActive: mockSetTorActive,
      setTorBootstrap: mockSetTorBootstrap,
      get nostrBlockedByTor() {
        return mockNostrBlockedByTor;
      },
      setNostrBlockedByTor: mockSetNostrBlockedByTor,
    }),
  },
}));

jest.mock("@store/settings-store", () => ({
  useSettingsStore: {
    getState: () => ({
      get torEnabled() {
        return mockTorEnabled;
      },
      // Writes through, unlike a bare spy: the watch is bound to this
      // preference and every probe re-checks it before writing, so a setter
      // that only records calls would leave the module reasoning about a state
      // no device is ever in.
      setTorEnabled: (next: boolean) => {
        mockTorEnabled = next;
        mockSetTorEnabled(next);
      },
    }),
  },
}));

// Imported after the jest.mock calls on purpose: the module under test reads
// Platform.OS and the bridge modules at import time, so the mocks have to be
// registered first.

import {
  isTorRoutingActive,
  primeTorRoutingOnStartup,
  revalidateTorRouting,
  setTorRouting,
} from "../tor-routing";

// primeTorRoutingOnStartup is deliberately fire-and-forget: the mesh has not
// started yet, so it kicks the probe and returns. Give the chain a full turn of
// the event loop rather than counting microtasks, which is brittle. The VPN
// edges are the same shape, since the listener void-s an async probe.
function settle(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

// Put the device in a named state. `port` is what a real TCP probe of Orbot's
// SOCKS port would return: 9050 when Orbot's Tor daemon is listening, 0 when
// nothing answers.
function device(options: {
  port: number;
  orbotInstalled: boolean;
  vpnActive: boolean;
}): void {
  mockStartVpnWatch.mockResolvedValue(undefined);
  mockStopVpnWatch.mockResolvedValue(undefined);
  mockGetTorProxyPort.mockResolvedValue(options.port);
  mockGetTorAvailability.mockResolvedValue({
    orbotInstalled: options.orbotInstalled,
    vpnActive: options.vpnActive,
  });
}

const ORBOT_ROUTING = { port: 9050, orbotInstalled: true, vpnActive: true };
const ORBOT_STOPPED = { port: 0, orbotInstalled: true, vpnActive: false };

// Whether the transport is allowed to exist, as mesh-service would read it.
function transportBlocked(): boolean {
  return mockNostrBlockedByTor;
}

beforeEach(async () => {
  jest.clearAllMocks();
  mockTorEnabled = false;
  mockNostrBlockedByTor = false;
  vpnLostListener = null;
  vpnAvailableListener = null;
  // Land on a known-off state without asserting on the teardown itself.
  device({ port: 0, orbotInstalled: false, vpnActive: false });
  await setTorRouting(false);
  jest.clearAllMocks();
});

describe("enabling Tor on Android", () => {
  // The reported bug, verbatim.
  it("refuses when Orbot is installed but idle beside an unrelated VPN", async () => {
    device({ port: 0, orbotInstalled: true, vpnActive: true });

    const result = await setTorRouting(true);

    expect(result).toEqual({ ok: false, reason: "orbot-inactive" });
    expect(isTorRoutingActive()).toBe(false);
    expect(mockSetTorEnabled).not.toHaveBeenCalledWith(true);
    expect(mockRestartNostr).not.toHaveBeenCalled();
  });

  it("refuses when Orbot is not installed at all", async () => {
    device({ port: 0, orbotInstalled: false, vpnActive: false });

    const result = await setTorRouting(true);

    expect(result).toEqual({ ok: false, reason: "orbot-missing" });
    expect(isTorRoutingActive()).toBe(false);
  });

  // Tor running but nothing captured is just as much a false claim: Orbot's
  // daemon is up, but without the VPN transport no app traffic reaches it.
  it("refuses when Tor is listening but no VPN is capturing traffic", async () => {
    device({ port: 9050, orbotInstalled: true, vpnActive: false });

    const result = await setTorRouting(true);

    expect(result).toEqual({ ok: false, reason: "orbot-inactive" });
    expect(isTorRoutingActive()).toBe(false);
  });

  // A refusal is not the blocked state. Nothing the user was relying on stops:
  // the sheet offers the install or the nudge to start Orbot, and the internet
  // half keeps working meanwhile, because they never got the protection to lose.
  it("leaves the transport alone when it refuses", async () => {
    device({ port: 0, orbotInstalled: true, vpnActive: true });

    await setTorRouting(true);

    expect(transportBlocked()).toBe(false);
    expect(mockRestartNostr).not.toHaveBeenCalled();
  });

  it("enables only when the proxy answers and a VPN is up", async () => {
    device(ORBOT_ROUTING);

    const result = await setTorRouting(true);

    expect(result).toEqual({ ok: true });
    expect(isTorRoutingActive()).toBe(true);
    expect(mockSetTorActive).toHaveBeenCalledWith(true);
    expect(mockSetTorEnabled).toHaveBeenCalledWith(true);
    expect(transportBlocked()).toBe(false);
    expect(mockRestartNostr).toHaveBeenCalled();
  });

  // Enabling rebuilds once, not twice. The gate writer and the toggle both used
  // to reach for restartNostr, and the second call dropped every relay socket
  // the first had just re-opened.
  it("rebuilds the transport exactly once", async () => {
    device(ORBOT_ROUTING);

    await setTorRouting(true);

    expect(mockRestartNostr).toHaveBeenCalledTimes(1);
  });

  // A rejecting native module must read as "not routing", never as "routing".
  it("treats a native failure as not routing", async () => {
    mockGetTorProxyPort.mockRejectedValue(new Error("bridge is gone"));
    mockGetTorAvailability.mockRejectedValue(new Error("bridge is gone"));

    const result = await setTorRouting(true);

    expect(result.ok).toBe(false);
    expect(isTorRoutingActive()).toBe(false);
  });
});

describe("Orbot going away mid-session", () => {
  async function enableThenLoseOrbot(): Promise<void> {
    device(ORBOT_ROUTING);
    await setTorRouting(true);
    jest.clearAllMocks();
    device(ORBOT_STOPPED);
    vpnLostListener?.();
    await settle();
  }

  it("stands the claim down", async () => {
    await enableThenLoseOrbot();

    expect(isTorRoutingActive()).toBe(false);
    expect(mockSetTorActive).toHaveBeenCalledWith(false);
  });

  // The whole point: with the sockets left open, the traffic a user turned Tor
  // on to protect keeps leaving the phone, just without an indicator saying so.
  it("takes the Nostr transport down with it", async () => {
    await enableThenLoseOrbot();

    expect(transportBlocked()).toBe(true);
    expect(mockRestartNostr).toHaveBeenCalled();
  });

  it("says why, rather than going quiet", async () => {
    await enableThenLoseOrbot();

    expect(mockSetTorBootstrap).toHaveBeenLastCalledWith("blocked");
  });

  // The preference is the user's intent; Orbot stopping is a fact about the
  // world, not a decision they made. Clearing it reverts them to the clear net
  // and leaves them to notice.
  it("keeps the preference on, so the next launch retries", async () => {
    await enableThenLoseOrbot();

    expect(mockSetTorEnabled).not.toHaveBeenCalledWith(false);
    expect(mockTorEnabled).toBe(true);
  });

  // Bound to the claim, the watch is torn down at the moment it becomes
  // load-bearing and nothing can report Orbot coming back.
  it("keeps watching the VPN through the blocked state", async () => {
    await enableThenLoseOrbot();

    expect(mockStopVpnWatch).not.toHaveBeenCalled();
    expect(vpnAvailableListener).not.toBeNull();
  });

  // A corporate or commercial VPN dropping is not Orbot dropping. The event is
  // a prompt to re-probe, never a conclusion.
  it("ignores an unrelated VPN dropping while Orbot still routes", async () => {
    device(ORBOT_ROUTING);
    await setTorRouting(true);
    jest.clearAllMocks();

    vpnLostListener?.();
    await settle();

    expect(isTorRoutingActive()).toBe(true);
    expect(transportBlocked()).toBe(false);
    expect(mockRestartNostr).not.toHaveBeenCalled();
  });
});

describe("Orbot coming back", () => {
  async function blocked(): Promise<void> {
    device(ORBOT_ROUTING);
    await setTorRouting(true);
    device(ORBOT_STOPPED);
    vpnLostListener?.();
    await settle();
    jest.clearAllMocks();
  }

  // The recovery a user gets without leaving Airhop: Orbot is stopped and
  // started again from its own notification shade, so app foreground never
  // fires and the arrival edge is the only signal there is.
  it("restores the claim and the transport on the VPN arrival edge", async () => {
    await blocked();
    device(ORBOT_ROUTING);

    vpnAvailableListener?.();
    await settle();

    expect(isTorRoutingActive()).toBe(true);
    expect(transportBlocked()).toBe(false);
    expect(mockRestartNostr).toHaveBeenCalled();
    expect(mockSetTorBootstrap).toHaveBeenLastCalledWith("idle");
  });

  // Any VPN raises the edge. One that is not Orbot must leave the gate shut.
  it("stays blocked when the VPN that arrived is not Orbot", async () => {
    await blocked();
    device({ port: 0, orbotInstalled: true, vpnActive: true });

    vpnAvailableListener?.();
    await settle();

    expect(isTorRoutingActive()).toBe(false);
    expect(transportBlocked()).toBe(true);
    expect(mockRestartNostr).not.toHaveBeenCalled();
  });

  // The other way out, and the one that matters when Orbot has been
  // uninstalled for good: turning Tor off releases the transport at once rather
  // than leaving the user with a permanently paused internet half.
  it("releases the transport when the user turns Tor off instead", async () => {
    await blocked();
    device({ port: 0, orbotInstalled: false, vpnActive: false });

    await setTorRouting(false);

    expect(transportBlocked()).toBe(false);
    expect(isTorRoutingActive()).toBe(false);
    expect(mockRestartNostr).toHaveBeenCalled();
    expect(mockStopVpnWatch).toHaveBeenCalled();
  });

  // App foreground has to work as well as the edges, because a native binary
  // older than the arrival event emits nothing and this is all it has.
  it("recovers on an app foreground even with no edge", async () => {
    await blocked();
    device(ORBOT_ROUTING);

    await revalidateTorRouting();

    expect(isTorRoutingActive()).toBe(true);
    expect(transportBlocked()).toBe(false);
  });
});

describe("revalidating mid-session", () => {
  it("blocks when the proxy disappears", async () => {
    device(ORBOT_ROUTING);
    await setTorRouting(true);
    expect(isTorRoutingActive()).toBe(true);
    jest.clearAllMocks();

    // The user switched to Orbot and stopped it, then came back.
    device({ port: 0, orbotInstalled: true, vpnActive: true });
    await revalidateTorRouting();

    expect(isTorRoutingActive()).toBe(false);
    expect(mockSetTorActive).toHaveBeenCalledWith(false);
    expect(transportBlocked()).toBe(true);
  });

  it("leaves a healthy session alone", async () => {
    device(ORBOT_ROUTING);
    await setTorRouting(true);
    jest.clearAllMocks();

    await revalidateTorRouting();

    expect(isTorRoutingActive()).toBe(true);
    expect(transportBlocked()).toBe(false);
    expect(mockRestartNostr).not.toHaveBeenCalled();
  });

  it("does nothing when Tor was never on, without probing", async () => {
    await revalidateTorRouting();

    expect(mockGetTorProxyPort).not.toHaveBeenCalled();
    expect(mockSetTorActive).not.toHaveBeenCalled();
    expect(transportBlocked()).toBe(false);
  });
});

describe("priming the persisted preference at startup", () => {
  // The window this closes: the probe takes up to half a second, and assuming
  // Tor is routing for that half second is a clear-net window in the one state
  // that must not have one. The mesh has not started yet, so a shut gate simply
  // means it builds no transport until the probe says it may.
  it("shuts the gate synchronously, before the probe answers", () => {
    mockTorEnabled = true;
    device(ORBOT_ROUTING);

    primeTorRoutingOnStartup();

    expect(transportBlocked()).toBe(true);
    expect(mockSetTorBootstrap).toHaveBeenCalledWith("starting");
  });

  it("opens it once the probe confirms Orbot is routing", async () => {
    mockTorEnabled = true;
    device(ORBOT_ROUTING);

    primeTorRoutingOnStartup();
    await settle();

    expect(mockSetTorActive).toHaveBeenLastCalledWith(true);
    expect(transportBlocked()).toBe(false);
  });

  // Relaunching after Orbot was uninstalled: the claim stays down and so does
  // the transport. Clearing the preference here would reopen the internet half
  // on the clear net without saying so.
  it("stays blocked when nothing is routing, keeping the preference", async () => {
    mockTorEnabled = true;
    device({ port: 0, orbotInstalled: false, vpnActive: false });

    primeTorRoutingOnStartup();
    await settle();

    expect(mockSetTorActive).toHaveBeenLastCalledWith(false);
    expect(mockSetTorBootstrap).toHaveBeenLastCalledWith("blocked");
    expect(transportBlocked()).toBe(true);
    expect(mockSetTorEnabled).not.toHaveBeenCalledWith(false);
  });

  // Orbot finishing its own start during ours: a phone that launches both at
  // once. The watch goes up before the probe precisely so this lands as a
  // recovery rather than a wait for the next foreground.
  it("recovers when Orbot finishes starting after the probe", async () => {
    mockTorEnabled = true;
    device({ port: 0, orbotInstalled: true, vpnActive: false });

    primeTorRoutingOnStartup();
    await settle();
    expect(transportBlocked()).toBe(true);

    device(ORBOT_ROUTING);
    vpnAvailableListener?.();
    await settle();

    expect(isTorRoutingActive()).toBe(true);
    expect(transportBlocked()).toBe(false);
  });

  it("does nothing at all when Tor is off", () => {
    mockTorEnabled = false;

    primeTorRoutingOnStartup();

    expect(transportBlocked()).toBe(false);
    expect(mockStartVpnWatch).not.toHaveBeenCalled();
  });
});

// A drop, an arrival and a foreground can land inside one another, and each
// probe takes up to the native 500 ms connect timeout, so answers can come back
// out of order. A stale "not routing" must never close the gate over a session
// that has already recovered.
describe("overlapping probes", () => {
  it("lets the newest answer win, whichever resolves first", async () => {
    device(ORBOT_ROUTING);
    await setTorRouting(true);
    jest.clearAllMocks();

    // A slow probe that will report Orbot gone...
    let releaseStale: (port: number) => void = () => {};
    mockGetTorProxyPort.mockReturnValueOnce(
      new Promise<number>((resolve) => {
        releaseStale = resolve;
      }),
    );
    mockGetTorAvailability.mockResolvedValue({
      orbotInstalled: true,
      vpnActive: true,
    });
    vpnLostListener?.();

    // ...overtaken by a fresh one that finds it routing.
    device(ORBOT_ROUTING);
    vpnAvailableListener?.();
    await settle();

    // The stale probe now answers "gone". It must not be believed.
    releaseStale(0);
    await settle();

    expect(isTorRoutingActive()).toBe(true);
    expect(transportBlocked()).toBe(false);
  });

  // Consent can move while a probe is in flight - a toggle off, or a panic
  // wipe. An answer about a question nobody is asking any more must not hold
  // the transport down.
  it("does not block on an answer that lands after Tor is switched off", async () => {
    device(ORBOT_ROUTING);
    await setTorRouting(true);
    jest.clearAllMocks();

    let releaseProbe: (port: number) => void = () => {};
    mockGetTorProxyPort.mockReturnValueOnce(
      new Promise<number>((resolve) => {
        releaseProbe = resolve;
      }),
    );
    vpnLostListener?.();

    await setTorRouting(false);
    releaseProbe(0);
    await settle();

    expect(transportBlocked()).toBe(false);
  });
});

// The watch has to be live for exactly as long as the user is ASKING for Tor,
// which is a longer window than the claim: it spans the blocked state, where
// the arrival edge is the only thing that can recover the session.
describe("the VPN watch tracks the preference", () => {
  it("starts watching when Tor actually comes on", async () => {
    device(ORBOT_ROUTING);
    await setTorRouting(true);
    expect(mockStartVpnWatch).toHaveBeenCalled();
  });

  it("does not watch when Tor was refused", async () => {
    device({ port: 0, orbotInstalled: true, vpnActive: true });
    await setTorRouting(true);
    expect(mockStartVpnWatch).not.toHaveBeenCalled();
  });

  it("stops watching when Tor is turned off", async () => {
    device(ORBOT_ROUTING);
    await setTorRouting(true);
    jest.clearAllMocks();
    device({ port: 0, orbotInstalled: false, vpnActive: false });
    await setTorRouting(false);
    expect(mockStopVpnWatch).toHaveBeenCalled();
    expect(vpnLostListener).toBeNull();
    expect(vpnAvailableListener).toBeNull();
  });

  it("keeps watching when a revalidation finds Tor gone", async () => {
    device(ORBOT_ROUTING);
    await setTorRouting(true);
    jest.clearAllMocks();
    device(ORBOT_STOPPED);
    await revalidateTorRouting();
    expect(mockStopVpnWatch).not.toHaveBeenCalled();
    expect(mockSetTorActive).toHaveBeenCalledWith(false);
  });
});
