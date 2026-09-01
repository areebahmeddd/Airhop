// The iOS half of the Tor decision, where Airhop owns Arti.
//
// A separate file from tor-routing.test.ts because `Platform.OS` is read at
// module import time, so one registry cannot hold both platforms.
//
// The gap these cover: `enableTorRouting` awaits `awaitTorReady` before it
// claims anything, so a user toggling Tor on gets an honest answer. But
// `primeTorRoutingOnStartup` cannot wait, since it runs before the mesh exists.
// It installs the Tor socket, claims active, and lets Arti bootstrap behind it.
//
// That is right for traffic and was wrong for the banner. Every relay socket
// goes through Arti's SOCKS, so a bootstrap that has not finished means relays
// fail rather than falling back to clear net, which is the correct direction.
// But a bootstrap that never finishes left `torActive` true forever: the banner
// read "Tor on" over a Nostr layer that silently never connected, and nothing
// revisited it. The module's own comment claimed status arrived over
// `TorStatusChanged`; nothing subscribes to that event.
//
// Revalidation now runs on iOS too, off the same app-foreground trigger as
// Android, using the status snapshot the native module already exposes.

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
const mockSetTorActive = jest.fn();
const mockSetTorBootstrap = jest.fn();
// Tracks the value, so the real "skip when nothing moves" guard in
// setNostrBlocked is exercised rather than bypassed by a mock that always
// reports undefined and therefore always looks like a change.
let mockNostrBlocked = false;
const mockSetNostrBlockedByTor = jest.fn((next: boolean) => {
  mockNostrBlocked = next;
});
let mockTorEnabled = false;

// Writes back, the way the real store does. A mock that lets code persist a
// preference and then read the old value hides exactly the bug this suite is
// meant to catch: the enable path sets torEnabled before awaiting the bootstrap
// and re-reads it afterwards to confirm the user still wants Tor.
const mockSetTorEnabled = jest.fn((next: boolean) => {
  mockTorEnabled = next;
});
const mockRestartNostr = jest.fn();

let torStatusListener: ((s: unknown) => void) | null = null;
const mockRemoveListener = jest.fn();
const mockSetAppForeground = jest.fn<Promise<void>, [boolean]>();

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
  NativeModules: {},
  NativeEventEmitter: class {},
}));

jest.mock("nostr-tools/pool", () => ({
  useWebSocketImplementation: jest.fn(),
}));

// Deliberately bare, and that is the assertion. The Tor path must never reach
// for the radio module, and a `default: {}` that is never called is how this
// file proves it.
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
  // The live bootstrap feed. Captured here so a test can push a status through
  // whatever subscription the module under test opened.
  subscribeTorStatus: (fn: (s: unknown) => void) => {
    torStatusListener = fn;
    return { remove: mockRemoveListener };
  },
}));

// Arti is present in this build, which is what makes the iOS path reachable.
jest.mock("@bridge/NativeAirhopTorSocket", () => ({
  __esModule: true,
  isTorSocketNativeAvailable: () => true,
  AirhopTorSocketNative: {},
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
  mockGetTorStatus.mockResolvedValue(status({ isReady: true }));
  // Land every test on a known-off baseline.
  await setTorRouting(false);
  torStatusListener = null;
  jest.clearAllMocks();
});

// Push a native status event through whatever subscription is live.
function emitStatus(over: Partial<{ isReady: boolean; isStarting: boolean }>) {
  torStatusListener?.(status(over));
}

describe("enabling Tor on iOS", () => {
  it("waits for Arti to bootstrap before claiming Tor is on", async () => {
    mockAwaitTorReady.mockResolvedValue(true);

    const result = await setTorRouting(true);

    expect(result.ok).toBe(true);
    expect(mockStartTor).toHaveBeenCalled();
    expect(mockAwaitTorReady).toHaveBeenCalled();
    expect(isTorRoutingActive()).toBe(true);
  });

  it("stays fail-closed, and keeps Arti, when the bootstrap times out", async () => {
    mockAwaitTorReady.mockResolvedValue(false);

    const result = await setTorRouting(true);

    // The deadline is a UI answer, not a verdict on the circuit. Arti polls for
    // longer than this wait allows, so stopping it here used to kill a circuit
    // that was nearly up, and reverting the socket would have put the user back
    // on the clear net they had just opted out of. Both are left alone.
    expect(result).toEqual({ ok: false, reason: "timeout" });
    expect(mockStopTor).not.toHaveBeenCalled();
    // Claiming Tor here would be the whole failure this path exists to avoid.
    expect(isTorRoutingActive()).toBe(false);
  });

  it("falls back to the direct socket when Arti throws", async () => {
    mockAwaitTorReady.mockRejectedValue(new Error("arti exploded"));

    const result = await setTorRouting(true);

    expect(result).toEqual({ ok: false, reason: "error" });
    expect(isTorRoutingActive()).toBe(false);
  });
});

describe("revalidating on iOS", () => {
  async function bringTorUp(): Promise<void> {
    mockAwaitTorReady.mockResolvedValue(true);
    await setTorRouting(true);
    jest.clearAllMocks();
  }

  it("stands the claim down when Arti is no longer bootstrapped", async () => {
    await bringTorUp();
    mockGetTorStatus.mockResolvedValue(status({ isReady: false }));

    await revalidateTorRouting();

    expect(isTorRoutingActive()).toBe(false);
    expect(mockSetTorActive).toHaveBeenCalledWith(false);
  });

  it("leaves a bootstrapping circuit alone rather than flickering", async () => {
    await bringTorUp();
    // The normal state for the first seconds after a cold start.
    mockGetTorStatus.mockResolvedValue(status({ isStarting: true }));

    await revalidateTorRouting();

    expect(isTorRoutingActive()).toBe(true);
  });

  it("leaves a healthy circuit alone", async () => {
    await bringTorUp();
    mockGetTorStatus.mockResolvedValue(status({ isReady: true }));

    await revalidateTorRouting();

    expect(isTorRoutingActive()).toBe(true);
  });

  it("treats a native error as not routing rather than as fine", async () => {
    await bringTorUp();
    mockGetTorStatus.mockRejectedValue(new Error("no answer"));

    await revalidateTorRouting();

    expect(isTorRoutingActive()).toBe(false);
  });

  it("keeps the saved preference, unlike Android", async () => {
    await bringTorUp();
    mockGetTorStatus.mockResolvedValue(status({ isReady: false }));

    await revalidateTorRouting();

    // A failed bootstrap is usually transient, so the preference stays on and
    // the next launch retries rather than silently reverting the user to the
    // clear net. Both platforms behave the same way.
    expect(mockSetTorEnabled).not.toHaveBeenCalledWith(false);
  });

  it("does nothing when Tor was never on, without asking the module", async () => {
    await revalidateTorRouting();
    expect(mockGetTorStatus).not.toHaveBeenCalled();
  });
});

describe("startup priming on iOS", () => {
  it("installs the Tor socket without waiting for the bootstrap", async () => {
    mockTorEnabled = true;

    primeTorRoutingOnStartup();
    await Promise.resolve();

    // Deliberately not awaited: the mesh has not started, and every relay
    // socket goes through Arti either way, so a bootstrap still in progress
    // fails closed rather than leaking to clear net.
    expect(mockStartTor).toHaveBeenCalled();
    expect(mockSetTorBootstrap).toHaveBeenCalledWith("starting");
  });

  it("does not claim Tor before a circuit exists", async () => {
    mockTorEnabled = true;

    primeTorRoutingOnStartup();
    await Promise.resolve();

    // The claim drives the "internet traffic onion routed" banner. Asserting it
    // here asserted it before a single circuit had formed, which is true within
    // seconds on a good network and never true at all on one that blocks Tor,
    // where it used to sit green for the whole session.
    expect(isTorRoutingActive()).toBe(false);
  });

  it("claims Tor the moment Arti reports ready", async () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    await Promise.resolve();

    emitStatus({ isReady: true });

    // The first instant the claim is actually true.
    expect(isTorRoutingActive()).toBe(true);
  });

  it("reports a stalled bootstrap as blocked rather than claiming Tor", async () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    await Promise.resolve();

    // Neither ready nor starting, with the preference on, is what a network
    // that blocks Tor looks like. The native side now emits this terminally;
    // before, the poll loop simply ended and left `isStarting` true forever, so
    // this branch was unreachable and the banner was dead code.
    emitStatus({ isReady: false, isStarting: false });

    expect(isTorRoutingActive()).toBe(false);
    expect(mockSetTorBootstrap).toHaveBeenCalledWith("blocked");
  });
});

// The live bootstrap signal, which is what iOS has instead of Android's probe.
//
// bitchat/ios reports the same three moments as system messages in
// ChatViewModel+Tor: starting, started, and "tor could not connect - this
// network may be blocking it. mesh messaging still works". Airhop's surface is
// the Mesh banner, but the states and the honesty are the same.
describe("bootstrap reporting on iOS", () => {
  it("reports starting while a circuit is forming", async () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    await Promise.resolve();

    expect(mockSetTorBootstrap).toHaveBeenCalledWith("starting");
  });

  it("reports blocked, and drops the claim, when Arti gives up", async () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    await Promise.resolve();
    jest.clearAllMocks();

    // Neither ready nor starting, with the preference still on: Arti is done
    // trying. This is what a network that filters Tor looks like.
    emitStatus({ isReady: false, isStarting: false });

    expect(mockSetTorBootstrap).toHaveBeenCalledWith("blocked");
    expect(isTorRoutingActive()).toBe(false);
  });

  it("claims Tor the moment a late circuit comes up", async () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    await Promise.resolve();
    emitStatus({ isReady: false, isStarting: false });
    expect(isTorRoutingActive()).toBe(false);

    // Bootstrap recovered on its own, which is the common case after a network
    // change. The banner should go back to the real Tor claim without the user
    // touching anything.
    emitStatus({ isReady: true });

    expect(isTorRoutingActive()).toBe(true);
    expect(mockSetTorBootstrap).toHaveBeenLastCalledWith("idle");
  });

  it("says nothing about a bootstrap the user has already cancelled", async () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    await Promise.resolve();
    jest.clearAllMocks();

    // Tor switched off mid-bootstrap. A "blocked" banner here would be alarming
    // about something the user just chose. bitchat guards the same case with
    // its persisted-preference check before announcing.
    mockTorEnabled = false;
    emitStatus({ isReady: false, isStarting: false });

    expect(mockSetTorBootstrap).toHaveBeenCalledWith("idle");
    expect(mockSetTorBootstrap).not.toHaveBeenCalledWith("blocked");
  });

  it("stops watching when Tor is turned off", async () => {
    mockTorEnabled = true;
    primeTorRoutingOnStartup();
    await Promise.resolve();
    jest.clearAllMocks();

    await setTorRouting(false);

    expect(mockRemoveListener).toHaveBeenCalled();
    expect(mockSetTorBootstrap).toHaveBeenCalledWith("idle");
  });
});

// iOS suspends the process in the background, so Arti's circuits and guard
// connections do not survive it. Nothing in the manager notices: the bootstrap
// poll stops at 100% and the SOCKS probe never runs again, so readiness stays
// latched and both the status re-check and the restart path decline on the
// strength of it. The two edges are what break that latch. bitchat drives the
// same pair from its scene-phase handler.
describe("app lifecycle on iOS", () => {
  beforeEach(() => {
    mockSetAppForeground.mockResolvedValue(undefined);
  });

  it("tells Arti about both edges", () => {
    notifyTorAppForeground(false);
    expect(mockSetAppForeground).toHaveBeenLastCalledWith(false);

    notifyTorAppForeground(true);
    expect(mockSetAppForeground).toHaveBeenLastCalledWith(true);
  });

  // Ungated on the preference: the native side revokes auto-start consent on an
  // explicit stop, so the restart half is already a no-op for someone with Tor
  // off, and gating here would only add a second source of truth.
  it("reports the edge whether or not Tor is on", async () => {
    await setTorRouting(false);
    mockSetAppForeground.mockClear();

    notifyTorAppForeground(true);

    expect(mockSetAppForeground).toHaveBeenCalledWith(true);
  });

  // A resume runs this and revalidateTorRouting on the same tick. The native
  // restart marks itself starting as it claims, so the re-check sees a forming
  // circuit and leaves the claim alone rather than reporting a stall.
  it("does not stand the claim down while a resume restart is forming", async () => {
    mockAwaitTorReady.mockResolvedValue(true);
    await setTorRouting(true);
    expect(isTorRoutingActive()).toBe(true);

    notifyTorAppForeground(true);
    mockGetTorStatus.mockResolvedValue(
      status({ isReady: false, isStarting: true }),
    );
    await revalidateTorRouting();

    expect(isTorRoutingActive()).toBe(true);
  });

  // An older native binary without the method must not take the resume down
  // with it.
  it("survives a native module that does not implement it", () => {
    mockSetAppForeground.mockRejectedValue(new Error("unrecognized selector"));
    expect(() => {
      notifyTorAppForeground(true);
    }).not.toThrow();
  });
});
