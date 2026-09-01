// The Android half of the Tor decision, now that Airhop owns Arti there too.
//
// A separate file from tor-routing-ios.test.ts because `Platform.OS` is read at
// module import time, so one registry cannot hold both platforms. The model
// under test is the same on both: start the embedded client, point the app's
// sockets at it, report honestly, fail closed. What this file exists to pin
// down is the one place they still differ.
//
// **Android installs no WebSocket shim.** iOS swaps nostr-tools' WebSocket for
// TorWebSocket, because React Native's own cannot speak SOCKS5. Android needs no
// such swap: the proxy is installed one layer lower, into the OkHttp client that
// `fetch` and WebSocket are both built from, so every socket the app opens is
// already covered. Asserting that here is what stops somebody "fixing" the
// asymmetry by installing a shim that would do nothing but break relay traffic.
//
// This replaces the Orbot suite. Nothing here probes a SOCKS port, counts VPN
// transports, or distinguishes an installed-but-idle Orbot from a running one,
// because none of that exists any more: the app owns the Tor process and can
// simply ask it.

const mockGetTorStatus = jest.fn<
  Promise<{
    isReady: boolean;
    isStarting: boolean;
    port: number;
    progress: number;
    bootstrapSummary: string;
  }>,
  []
>();
const mockStartTor = jest.fn<Promise<void>, []>();
const mockStopTor = jest.fn<Promise<void>, []>();
const mockAwaitTorReady = jest.fn<Promise<boolean>, [number]>();
const mockSetAppForeground = jest.fn<Promise<void>, [boolean]>();
const mockSetTorActive = jest.fn();
const mockSetTorBootstrap = jest.fn();
// Tracks the value, so the real "skip when nothing moves" guard in
// setNostrBlocked is exercised rather than bypassed by a mock that always
// reports undefined and therefore always looks like a change.
let mockNostrBlocked = false;
const mockSetNostrBlockedByTor = jest.fn((next: boolean) => {
  mockNostrBlocked = next;
});
const mockRestartNostr = jest.fn();
const mockUseWebSocketImplementation = jest.fn();
let mockTorEnabled = false;

// Writes back, the way the real store does. A mock that lets code persist a
// preference and then read the old value hides exactly the bug this suite is
// meant to catch: the enable path sets torEnabled before awaiting the bootstrap
// and re-reads it afterwards to confirm the user still wants Tor.
const mockSetTorEnabled = jest.fn((next: boolean) => {
  mockTorEnabled = next;
});

let torStatusListener: ((s: unknown) => void) | null = null;
const mockRemoveListener = jest.fn();

jest.mock("react-native", () => ({
  Platform: { OS: "android" },
  NativeModules: {},
  NativeEventEmitter: class {},
}));

jest.mock("nostr-tools/pool", () => ({
  useWebSocketImplementation: (impl: unknown) =>
    mockUseWebSocketImplementation(impl),
}));

// Bare, and that is the assertion rather than a shortcut. The BLE module used to
// carry Orbot detection and the VPN watch; nothing in the Tor path may reach for
// it now, and a `default: {}` that never gets called is how this file proves it.
jest.mock("@bridge/NativeAirhopBLE", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("@bridge/NativeAirhopTor", () => ({
  __esModule: true,
  default: {
    startTor: () => mockStartTor(),
    stopTor: () => mockStopTor(),
    getTorStatus: () => mockGetTorStatus(),
    awaitTorReady: (s: number) => mockAwaitTorReady(s),
    setAppForeground: (f: boolean) => mockSetAppForeground(f),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  subscribeTorStatus: (fn: (s: unknown) => void) => {
    torStatusListener = fn;
    return { remove: mockRemoveListener };
  },
}));

// Absent, as it is in every Android build. The per-socket shim is an iOS
// workaround and there is nothing here for it to attach to.
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
      setNostrBlockedByTor: mockSetNostrBlockedByTor,
      get nostrBlockedByTor() {
        return mockNostrBlocked;
      },
    }),
  },
}));

jest.mock("@store/settings-store", () => ({
  useSettingsStore: {
    getState: () => ({
      get torEnabled() {
        return mockTorEnabled;
      },
      setTorEnabled: mockSetTorEnabled,
    }),
  },
}));

import {
  isTorRoutingActive,
  notifyTorAppForeground,
  primeTorRoutingOnStartup,
  revalidateTorRouting,
  setTorRouting,
} from "../tor-routing";

function status(over: Partial<{ isReady: boolean; isStarting: boolean }> = {}) {
  return {
    isReady: false,
    isStarting: false,
    port: 0,
    progress: 0,
    bootstrapSummary: "",
    ...over,
  };
}

beforeEach(async () => {
  jest.clearAllMocks();
  mockTorEnabled = false;
  mockNostrBlocked = false;
  mockStartTor.mockResolvedValue(undefined);
  mockStopTor.mockResolvedValue(undefined);
  mockAwaitTorReady.mockResolvedValue(true);
  // Resolves rather than returning undefined, because a @ReactMethod taking a
  // Promise always hands JS a promise back. A mock that returns undefined would
  // make the caller's `.catch` look unsafe when it is not.
  mockSetAppForeground.mockResolvedValue(undefined);
  mockGetTorStatus.mockResolvedValue(status({ isReady: true }));
  // Land every test on a known-off baseline.
  await setTorRouting(false);
  torStatusListener = null;
  jest.clearAllMocks();
});

function emitStatus(over: Partial<{ isReady: boolean; isStarting: boolean }>) {
  torStatusListener?.(status(over));
}

describe("enabling Tor on Android", () => {
  test("starts the embedded client and claims only once it is ready", async () => {
    const result = await setTorRouting(true);

    expect(result).toEqual({ ok: true });
    expect(mockStartTor).toHaveBeenCalledTimes(1);
    expect(mockSetTorEnabled).toHaveBeenCalledWith(true);
    expect(mockSetTorActive).toHaveBeenLastCalledWith(true);
    expect(isTorRoutingActive()).toBe(true);
  });

  test("rebuilds the Nostr transport so relays reconnect over Tor", async () => {
    await setTorRouting(true);
    expect(mockRestartNostr).toHaveBeenCalled();
  });

  test("never swaps the WebSocket implementation", async () => {
    // The whole point of the Android design. A shim here would replace working
    // relay sockets with ones dialling a native module that does not exist.
    await setTorRouting(true);
    expect(mockUseWebSocketImplementation).not.toHaveBeenCalled();
  });

  test("persists the preference before awaiting the circuit", async () => {
    // A relaunch during a slow bootstrap has to come back on Tor, not on the
    // clear net, so the preference cannot wait for readiness.
    let enabledWhenAwaited = false;
    mockAwaitTorReady.mockImplementation(async () => {
      enabledWhenAwaited = mockTorEnabled;
      return true;
    });

    await setTorRouting(true);

    expect(enabledWhenAwaited).toBe(true);
  });

  test("a bootstrap that runs out its deadline is reported, not undone", async () => {
    mockAwaitTorReady.mockResolvedValue(false);

    const result = await setTorRouting(true);

    expect(result).toEqual({ ok: false, reason: "timeout" });
    // Deliberately still running and still routed. The circuit may yet land, and
    // reverting would put the user back on the clear net they just left.
    expect(mockStopTor).not.toHaveBeenCalled();
    expect(mockSetTorEnabled).not.toHaveBeenCalledWith(false);
    expect(isTorRoutingActive()).toBe(false);
  });

  test("a client that fails to start unwinds completely", async () => {
    mockStartTor.mockRejectedValue(new Error("no"));

    const result = await setTorRouting(true);

    expect(result).toEqual({ ok: false, reason: "error" });
    expect(mockStopTor).toHaveBeenCalled();
    expect(mockSetTorEnabled).toHaveBeenLastCalledWith(false);
    expect(isTorRoutingActive()).toBe(false);
  });

  test("consent withdrawn during the bootstrap is not overridden", async () => {
    // Sixty seconds is long enough to toggle Tor back off, or to panic wipe. An
    // enable resolving afterwards must not assert routing over sockets that are
    // back on the clear net.
    mockAwaitTorReady.mockImplementation(async () => {
      mockTorEnabled = false;
      return true;
    });

    const result = await setTorRouting(true);

    expect(result).toEqual({ ok: false, reason: "error" });
    expect(isTorRoutingActive()).toBe(false);
  });
});

describe("disabling Tor on Android", () => {
  test("stops the client, clears the claim and rebuilds the transport", async () => {
    await setTorRouting(true);
    jest.clearAllMocks();

    await setTorRouting(false);

    expect(mockStopTor).toHaveBeenCalledTimes(1);
    expect(mockSetTorEnabled).toHaveBeenCalledWith(false);
    expect(mockSetTorActive).toHaveBeenLastCalledWith(false);
    expect(mockRestartNostr).toHaveBeenCalled();
    expect(isTorRoutingActive()).toBe(false);
  });

  test("lowers the preference before stopping the client", async () => {
    // Anything still racing has to see consent withdrawn and stand down rather
    // than writing over the disable.
    await setTorRouting(true);
    let enabledWhenStopped = true;
    mockStopTor.mockImplementation(async () => {
      enabledWhenStopped = mockTorEnabled;
    });

    await setTorRouting(false);

    expect(enabledWhenStopped).toBe(false);
  });
});

describe("startup priming on Android", () => {
  test("does nothing when the preference is off", () => {
    mockTorEnabled = false;
    primeTorRoutingOnStartup();
    expect(mockStartTor).not.toHaveBeenCalled();
  });

  test("starts the client but does not claim routing yet", () => {
    mockTorEnabled = true;

    primeTorRoutingOnStartup();

    expect(mockStartTor).toHaveBeenCalledTimes(1);
    expect(mockSetTorBootstrap).toHaveBeenCalledWith("starting");
    // The claim drives the "internet traffic onion routed" banner. Asserting it
    // here would assert it before a single circuit existed, and on a network
    // that blocks Tor it would stay green for the whole session.
    expect(mockSetTorActive).not.toHaveBeenCalledWith(true);
    expect(isTorRoutingActive()).toBe(false);
  });

  test("raises the claim only when Arti reports it is ready", () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();

    emitStatus({ isReady: true });

    expect(mockSetTorActive).toHaveBeenCalledWith(true);
  });
});

describe("bootstrap reporting on Android", () => {
  test("a network that blocks Tor is reported as blocked, not as starting", () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    jest.clearAllMocks();

    // Neither ready nor starting, with the preference on, is Arti saying it has
    // given up. Without this the banner says "starting" forever and the user
    // cannot tell a slow network from a censoring one.
    emitStatus({ isReady: false, isStarting: false });

    expect(mockSetTorBootstrap).toHaveBeenCalledWith("blocked");
    expect(mockSetTorActive).toHaveBeenCalledWith(false);
  });

  test("a bootstrap still in progress stays starting", () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    jest.clearAllMocks();

    emitStatus({ isStarting: true });

    expect(mockSetTorBootstrap).toHaveBeenCalledWith("starting");
    expect(mockSetTorActive).not.toHaveBeenCalledWith(true);
  });

  test("a stall that resolves itself raises the claim", () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    emitStatus({ isReady: false, isStarting: false });
    jest.clearAllMocks();

    emitStatus({ isReady: true });

    expect(mockSetTorActive).toHaveBeenCalledWith(true);
    expect(mockSetTorBootstrap).toHaveBeenCalledWith("idle");
  });

  test("a status arriving after Tor is switched off claims nothing", () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    mockTorEnabled = false;
    jest.clearAllMocks();

    emitStatus({ isReady: true });

    expect(mockSetTorActive).not.toHaveBeenCalledWith(true);
  });
});

describe("revalidating on Android", () => {
  test("does nothing while the preference is off", async () => {
    mockTorEnabled = false;
    await revalidateTorRouting();
    expect(mockGetTorStatus).not.toHaveBeenCalled();
  });

  test("a client that is still ready keeps the claim", async () => {
    mockTorEnabled = true;
    mockGetTorStatus.mockResolvedValue(status({ isReady: true }));

    await revalidateTorRouting();

    expect(mockSetTorActive).toHaveBeenLastCalledWith(true);
  });

  test("a client that stopped being ready stands the claim down", async () => {
    // Guarded on the preference rather than the claim, so this still runs while
    // the claim is already false. Otherwise foreground becomes the one trigger
    // that can never recover a session.
    mockTorEnabled = true;
    mockGetTorStatus.mockResolvedValue(
      status({ isReady: false, isStarting: false }),
    );

    await revalidateTorRouting();

    expect(mockSetTorActive).toHaveBeenLastCalledWith(false);
    expect(mockSetTorBootstrap).toHaveBeenLastCalledWith("blocked");
  });

  test("a bootstrap in progress is left alone", async () => {
    // Normal for the first seconds after a cold start. Standing the claim down
    // here would flicker the banner on every launch.
    mockTorEnabled = true;
    mockGetTorStatus.mockResolvedValue(status({ isStarting: true }));

    await revalidateTorRouting();

    expect(mockSetTorBootstrap).toHaveBeenLastCalledWith("starting");
    expect(mockSetTorActive).not.toHaveBeenCalledWith(false);
  });

  test("a module that errors is treated as not routing", async () => {
    mockTorEnabled = true;
    mockGetTorStatus.mockRejectedValue(new Error("gone"));

    await revalidateTorRouting();

    expect(mockSetTorActive).toHaveBeenLastCalledWith(false);
  });

  test("never reaches for the BLE module", async () => {
    // The old Android path probed a SOCKS port and counted VPN transports
    // through AirhopBLE. If anything still did, the bare mock above would throw.
    mockTorEnabled = true;
    await expect(revalidateTorRouting()).resolves.toBeUndefined();
  });
});

describe("app foreground on Android", () => {
  test("both edges reach the native client", () => {
    // Dormancy, not a stop. Android keeps the process alive through the
    // foreground service, so without this a backgrounded Airhop keeps a
    // consensus fresh all day on a battery.
    notifyTorAppForeground(false);
    expect(mockSetAppForeground).toHaveBeenCalledWith(false);

    notifyTorAppForeground(true);
    expect(mockSetAppForeground).toHaveBeenCalledWith(true);
  });

  test("is safe to call with Tor off", () => {
    mockTorEnabled = false;
    expect(() => notifyTorAppForeground(false)).not.toThrow();
  });
});
