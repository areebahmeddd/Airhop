/**
 * @jest-environment node
 */
// When Airhop refuses to talk to a mint, and why it is platform-specific.
//
// Tor on iOS is Arti, which wraps WebSockets. It does NOT wrap `fetch`. Every
// mint call is a fetch, so a deposit made while the user believes their traffic
// is anonymised would leave the device in the clear, carrying their mint, their
// amounts and their IP. Refusing is the only honest answer, and the Wallet
// screen greys its buttons off exactly this predicate.
//
// Tor on Android is Orbot, which takes the whole socket, so there is nothing to
// leak and mint calls must keep working. Blocking there would break deposits and
// withdrawals for every Android user running Orbot, which is a large fraction of
// the people who care most about this app.
//
// The branch is one line in `assertMintNetworkAllowed` and it cannot be covered
// in the simulator, where `Platform.OS` is a single global shared by every
// simulated phone. So it is covered here, where the platform can be moved.

jest.mock("../../bridge/NativeAirhopBLE", () => ({
  __esModule: true,
  default: {},
}));
jest.mock("../../bridge/NativeAirhopWiFi", () => ({
  __esModule: true,
  default: {},
}));

import { Platform } from "react-native";
import { useMeshStateStore } from "../../store/mesh-state-store";
import { useSettingsStore } from "../../store/settings-store";
import { isMintNetworkBlocked } from "../wallet-service";

function setPlatform(os: "ios" | "android"): void {
  Object.defineProperty(Platform, "OS", { value: os, configurable: true });
}

const originalOS = Platform.OS;

beforeEach(() => {
  useMeshStateStore.getState().setTorActive(false);
  useSettingsStore.getState().setAllowMintOverClearnet(false);
});

afterAll(() => {
  setPlatform(originalOS as "ios" | "android");
});

describe("mint network gate", () => {
  it("allows mint calls with Tor down, on either platform", () => {
    for (const os of ["ios", "android"] as const) {
      setPlatform(os);
      expect(isMintNetworkBlocked()).toBe(false);
    }
  });

  it("blocks mint calls on iOS while Tor is up", () => {
    setPlatform("ios");
    useMeshStateStore.getState().setTorActive(true);
    expect(isMintNetworkBlocked()).toBe(true);
  });

  it("does NOT block on Android, because Orbot carries the whole socket", () => {
    setPlatform("android");
    useMeshStateStore.getState().setTorActive(true);
    // The regression this guards: a well-meaning "block mint traffic under Tor"
    // that forgets the platform check takes deposits and withdrawals away from
    // every Android user running Orbot.
    expect(isMintNetworkBlocked()).toBe(false);
  });

  it("lets an iOS user opt in to clearnet mint traffic knowingly", () => {
    setPlatform("ios");
    useMeshStateStore.getState().setTorActive(true);
    expect(isMintNetworkBlocked()).toBe(true);

    // Settings carries the explanation; this is the informed override, not a
    // silent default.
    useSettingsStore.getState().setAllowMintOverClearnet(true);
    expect(isMintNetworkBlocked()).toBe(false);
  });

  it("re-blocks the moment Tor comes back up", () => {
    setPlatform("ios");
    useMeshStateStore.getState().setTorActive(true);
    expect(isMintNetworkBlocked()).toBe(true);
    useMeshStateStore.getState().setTorActive(false);
    expect(isMintNetworkBlocked()).toBe(false);
    useMeshStateStore.getState().setTorActive(true);
    expect(isMintNetworkBlocked()).toBe(true);
  });
});
