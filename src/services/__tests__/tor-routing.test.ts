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
const mockStartTor = jest.fn<Promise<void>, [string]>();
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
let mockBridgeMode = "off";
let mockBridgeLines = "";
const mockSetTorBridgeMode = jest.fn((next: string) => {
  mockBridgeMode = next;
});
const mockSetTorBridgeLines = jest.fn((next: string) => {
  mockBridgeLines = next;
});

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

// Bare, and that is the assertion, not a shortcut. Nothing in the Tor path may
// reach for the BLE module, and a `default: {}` that never gets called is how
// this file proves it.
jest.mock("@bridge/NativeAirhopBLE", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("@bridge/NativeAirhopTor", () => ({
  __esModule: true,
  default: {
    startTor: (lines: string) => mockStartTor(lines),
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
      get torBridgeMode() {
        return mockBridgeMode;
      },
      get torBridgeLines() {
        return mockBridgeLines;
      },
      setTorBridgeMode: mockSetTorBridgeMode,
      setTorBridgeLines: mockSetTorBridgeLines,
    }),
  },
}));

import {
  applyInternetAvailability,
  isTorRoutingActive,
  notifyTorAppForeground,
  primeTorRoutingOnStartup,
  revalidateTorRouting,
  setTorBridgeMode,
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
  mockBridgeMode = "off";
  mockBridgeLines = "";
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

  test("a start that cannot run at all is reported, not left spinning", async () => {
    // The native side rejects only when Tor cannot run rather than merely being
    // slow: no library for this ABI, or an unwritable state directory. Neither
    // improves by waiting, and swallowing it left the banner on "Starting Tor"
    // for the whole session with nothing behind it.
    mockTorEnabled = true;
    mockStartTor.mockRejectedValue(new Error("no library"));

    primeTorRoutingOnStartup();
    await Promise.resolve();
    await Promise.resolve();

    expect(mockSetTorBootstrap).toHaveBeenLastCalledWith("blocked");
    expect(isTorRoutingActive()).toBe(false);
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
    // Nothing in the Tor path may reach through AirhopBLE; the bare mock above throws if it does.
    mockTorEnabled = true;
    await expect(revalidateTorRouting()).resolves.toBeUndefined();
  });
});

describe("the master internet switch", () => {
  test("stops Tor when the internet is switched off, keeping the preference", () => {
    // The confirm sheet tells the user that turning the internet off disables
    // Tor. Leaving Arti running would make that untrue, and would hold guards
    // and refresh a consensus for a relay pool that no longer exists.
    mockTorEnabled = true;

    applyInternetAvailability(false);

    expect(mockStopTor).toHaveBeenCalledTimes(1);
    expect(isTorRoutingActive()).toBe(false);
    // Untouched: the user turned the internet off, not Tor.
    expect(mockSetTorEnabled).not.toHaveBeenCalled();
  });

  test("starts Tor again when the internet comes back", () => {
    mockTorEnabled = true;
    applyInternetAvailability(false);
    jest.clearAllMocks();

    applyInternetAvailability(true);

    expect(mockStartTor).toHaveBeenCalledTimes(1);
    expect(mockSetTorBootstrap).toHaveBeenCalledWith("starting");
  });

  test("does nothing either way when Tor was never asked for", () => {
    mockTorEnabled = false;

    applyInternetAvailability(false);
    applyInternetAvailability(true);

    expect(mockStopTor).not.toHaveBeenCalled();
    expect(mockStartTor).not.toHaveBeenCalled();
  });

  test("releases the gate, so the internet half is not held down by a stopped Tor", () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    emitStatus({ isReady: false, isStarting: false });
    expect(mockNostrBlocked).toBe(true);

    applyInternetAvailability(false);

    expect(mockNostrBlocked).toBe(false);
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

describe("bridge modes", () => {
  test("off starts the client with no bridge lines", async () => {
    await setTorRouting(true);
    expect(mockStartTor).toHaveBeenCalledWith("");
  });

  test("snowflake starts with lines carrying the rendezvous and utls", async () => {
    mockBridgeMode = "snowflake";
    await setTorRouting(true);

    const lines = mockStartTor.mock.calls[0][0] as string;
    expect(lines.split("\n")).toHaveLength(2);
    for (const line of lines.split("\n")) {
      expect(line.startsWith("snowflake ")).toBe(true);
      // Dropping any of these leaves a connection that works but is easier to
      // pick out, which is the whole point of the mode.
      expect(line).toContain("url=");
      expect(line).toContain("fronts=");
      expect(line).toContain("ice=");
      expect(line).toContain("utls-imitate=hellorandomizedalpn");
    }
  });

  test("custom passes the pasted lines through, trimmed", async () => {
    mockBridgeMode = "custom";
    mockBridgeLines = "  obfs4 192.0.2.1:443 ABCD cert=x iat-mode=0  ";
    await setTorRouting(true);
    expect(mockStartTor).toHaveBeenCalledWith(
      "obfs4 192.0.2.1:443 ABCD cert=x iat-mode=0",
    );
  });

  test("a slower mode gets a longer bootstrap deadline", async () => {
    await setTorRouting(true);
    const direct = mockAwaitTorReady.mock.calls[0][0];

    jest.clearAllMocks();
    mockTorEnabled = false;
    mockBridgeMode = "snowflake";
    await setTorRouting(true);
    const snowflake = mockAwaitTorReady.mock.calls[0][0];

    // Snowflake finds a volunteer proxy through a broker before any Tor traffic
    // moves. Held to the direct deadline it would be reported as blocked while
    // still working.
    expect(snowflake).toBeGreaterThan(direct);
  });

  test("changing mode while Tor runs restarts the client on the new lines", async () => {
    await setTorRouting(true);
    jest.clearAllMocks();

    await setTorBridgeMode("snowflake");

    // Bridges are fixed when the client is built, so the only way to apply a
    // change is to take the old client down first.
    expect(mockStopTor).toHaveBeenCalled();
    expect(mockStartTor).toHaveBeenCalledWith(
      expect.stringContaining("snowflake "),
    );
    expect(mockSetTorBridgeMode).toHaveBeenCalledWith("snowflake");
  });

  test("changing mode while Tor is off persists without starting anything", async () => {
    mockTorEnabled = false;
    await setTorBridgeMode("custom", "obfs4 192.0.2.1:443 ABCD");

    expect(mockSetTorBridgeMode).toHaveBeenCalledWith("custom");
    expect(mockSetTorBridgeLines).toHaveBeenCalledWith(
      "obfs4 192.0.2.1:443 ABCD",
    );
    expect(mockStartTor).not.toHaveBeenCalled();
  });
});

describe("a bridge mode with nothing to apply", () => {
  test("refuses to start rather than connecting directly", async () => {
    mockBridgeMode = "custom";
    mockBridgeLines = "";

    const result = await setTorRouting(true);

    // Starting here would give a direct connection while the screen says
    // bridges are on, which is the failure this whole path exists to prevent.
    expect(result.ok).toBe(false);
    // Its own reason, so the screen can say which bridges are missing rather
    // than blaming the network.
    expect(result.reason).toBe("no-bridges");
    expect(mockStartTor).not.toHaveBeenCalled();
  });

  test("selecting it while Tor runs reveals its input without a restart", async () => {
    await setTorRouting(true);
    jest.clearAllMocks();

    await setTorBridgeMode("custom", "");

    expect(mockSetTorBridgeMode).toHaveBeenCalledWith("custom");
    expect(mockStopTor).not.toHaveBeenCalled();
    expect(mockStartTor).not.toHaveBeenCalled();
  });
});
