// tor-routing.test.ts
//
// Guards the Android Tor decision, which is a privacy claim rather than a
// convenience. The bug these cover: the old check asked "is Orbot installed"
// and "is any VPN up", so an installed-but-idle Orbot sitting beside an
// unrelated VPN (corporate, commercial) satisfied both and the Mesh banner read
// "Tor on - internet traffic routed" over clear-net traffic.
//
// Overstating protection is worse than offering none, so these assert the
// refusal, not just the happy path.

const mockGetTorProxyPort = jest.fn<Promise<number>, []>();
const mockGetTorAvailability = jest.fn<
  Promise<{ orbotInstalled: boolean; vpnActive: boolean }>,
  []
>();
const mockRestartNostr = jest.fn();
const mockSetTorActive = jest.fn();
const mockSetTorEnabled = jest.fn();

let mockTorEnabled = false;

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
jest.mock("../../../bridge/NativeAirhopBLE", () => ({
  __esModule: true,
  default: {
    getTorProxyPort: () => mockGetTorProxyPort(),
    getTorAvailability: () => mockGetTorAvailability(),
  },
}));

// Android has no embedded Arti yet, which is what this module must cope with.
jest.mock("../../../bridge/NativeAirhopTor", () => ({
  __esModule: true,
  default: null,
}));

jest.mock("../../../bridge/NativeAirhopTorSocket", () => ({
  __esModule: true,
  isTorSocketNativeAvailable: () => false,
  AirhopTorSocketNative: undefined,
  subscribeTorSocket: jest.fn(),
}));

jest.mock("../../../services/mesh-service", () => ({
  getMeshService: () => ({ restartNostr: mockRestartNostr }),
}));

jest.mock("../../../store/mesh-state-store", () => ({
  useMeshStateStore: {
    getState: () => ({ setTorActive: mockSetTorActive }),
  },
}));

jest.mock("../../../store/settings-store", () => ({
  useSettingsStore: {
    getState: () => ({
      get torEnabled() {
        return mockTorEnabled;
      },
      setTorEnabled: mockSetTorEnabled,
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
// the event loop rather than counting microtasks, which is brittle.
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
  mockGetTorProxyPort.mockResolvedValue(options.port);
  mockGetTorAvailability.mockResolvedValue({
    orbotInstalled: options.orbotInstalled,
    vpnActive: options.vpnActive,
  });
}

beforeEach(async () => {
  jest.clearAllMocks();
  mockTorEnabled = false;
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

  it("enables only when the proxy answers and a VPN is up", async () => {
    device({ port: 9050, orbotInstalled: true, vpnActive: true });

    const result = await setTorRouting(true);

    expect(result).toEqual({ ok: true });
    expect(isTorRoutingActive()).toBe(true);
    expect(mockSetTorActive).toHaveBeenCalledWith(true);
    expect(mockSetTorEnabled).toHaveBeenCalledWith(true);
    expect(mockRestartNostr).toHaveBeenCalled();
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

describe("revalidating mid-session", () => {
  it("stands the claim down when the proxy disappears", async () => {
    device({ port: 9050, orbotInstalled: true, vpnActive: true });
    await setTorRouting(true);
    expect(isTorRoutingActive()).toBe(true);
    jest.clearAllMocks();

    // The user switched to Orbot and stopped it, then came back.
    device({ port: 0, orbotInstalled: true, vpnActive: true });
    await revalidateTorRouting();

    expect(isTorRoutingActive()).toBe(false);
    expect(mockSetTorActive).toHaveBeenCalledWith(false);
    expect(mockSetTorEnabled).toHaveBeenCalledWith(false);
    // Deliberately no transport rebuild: if the VPN dropped, traffic is already
    // on the clear net, and reconnecting would only open fresh clear-net
    // sockets we did not have to open.
    expect(mockRestartNostr).not.toHaveBeenCalled();
  });

  it("leaves a healthy session alone", async () => {
    device({ port: 9050, orbotInstalled: true, vpnActive: true });
    await setTorRouting(true);
    jest.clearAllMocks();

    await revalidateTorRouting();

    expect(isTorRoutingActive()).toBe(true);
    expect(mockSetTorEnabled).not.toHaveBeenCalled();
  });

  it("does nothing when Tor was never on, without probing", async () => {
    await revalidateTorRouting();

    expect(mockGetTorProxyPort).not.toHaveBeenCalled();
    expect(mockSetTorActive).not.toHaveBeenCalled();
  });
});

describe("priming the persisted preference at startup", () => {
  // Relaunching after Orbot was uninstalled must not restore a green switch.
  it("clears a stale preference when nothing is routing", async () => {
    mockTorEnabled = true;
    device({ port: 0, orbotInstalled: false, vpnActive: false });

    primeTorRoutingOnStartup();
    await settle();

    expect(mockSetTorActive).toHaveBeenLastCalledWith(false);
    expect(mockSetTorEnabled).toHaveBeenCalledWith(false);
  });

  it("restores the claim when Tor really is routing", async () => {
    mockTorEnabled = true;
    device({ port: 9050, orbotInstalled: true, vpnActive: true });

    primeTorRoutingOnStartup();
    await settle();

    expect(mockSetTorActive).toHaveBeenLastCalledWith(true);
    expect(mockSetTorEnabled).not.toHaveBeenCalledWith(false);
  });
});
