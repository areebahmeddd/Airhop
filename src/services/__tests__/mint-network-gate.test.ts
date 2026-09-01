/**
 * @jest-environment node
 */
// When Airhop refuses to talk to a mint, and why it is platform-specific.
//
// Tor on iOS wraps nostr-tools' WebSockets. It does NOT wrap `fetch`. Every mint
// call is a fetch, so a deposit made while the user believes their traffic is
// anonymised would leave the device in the clear, carrying their mint, their
// amounts and their IP. Refusing is the only honest answer, and the Wallet
// screen greys its buttons off exactly this predicate.
//
// Android refuses nothing, and that is a stronger position rather than a laxer
// one. The proxy is installed into the OkHttp client `fetch` is built from, so a
// mint call is inside the tunnel whenever Tor is on, and simply fails when no
// circuit exists yet. There is no state in which it can leak, so there is
// nothing for a gate to catch.
//
// That distinction is the whole reason these tests exist: the gate has to fire
// on iOS and must not fire anywhere else.
//
// The branch is a few lines in `assertMintNetworkAllowed` and it cannot be
// covered in the simulator, where `Platform.OS` is a single global shared by
// every simulated phone. So it is covered here, where the platform can be
// moved.

jest.mock("@bridge/NativeAirhopBLE", () => ({
  __esModule: true,
  default: {},
}));
jest.mock("@bridge/NativeAirhopWiFi", () => ({
  __esModule: true,
  default: {},
}));

import { useMeshStateStore } from "@store/mesh-state-store";
import { useSettingsStore } from "@store/settings-store";
import { Platform } from "react-native";
import { isMintNetworkBlocked } from "../wallet-service";

function setPlatform(os: "ios" | "android"): void {
  Object.defineProperty(Platform, "OS", { value: os, configurable: true });
}

const originalOS = Platform.OS;

beforeEach(() => {
  useMeshStateStore.getState().setTorActive(false);
  useMeshStateStore.getState().setNostrBlockedByTor(false);
  useSettingsStore.getState().setTorEnabled(false);
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

  it("does NOT block on Android, where the proxy carries the whole socket", () => {
    setPlatform("android");
    useMeshStateStore.getState().setTorActive(true);
    // The regression this guards: a well-meaning "block mint traffic under Tor"
    // that forgets the platform check takes deposits and withdrawals away from
    // every Android user, to prevent a leak that cannot happen there.
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

  // Tor wanted, no circuit yet. The request is pointed at a port that is either
  // tunnelling or not answering, so it cannot reach the mint in the clear, and
  // refusing it would only take the wallet away from someone whose Tor is slow
  // to start.
  it("does not block on Android while Tor is on but not yet connected", () => {
    setPlatform("android");
    useSettingsStore.getState().setTorEnabled(true);
    useMeshStateStore.getState().setTorActive(false);
    useMeshStateStore.getState().setNostrBlockedByTor(true);

    expect(isMintNetworkBlocked()).toBe(false);
  });

  it("does not block on Android in any Tor state", () => {
    // Swept rather than enumerated, because the invariant is about the platform
    // and not about which combination of flags happens to be set.
    setPlatform("android");
    for (const torEnabled of [false, true]) {
      for (const torActive of [false, true]) {
        for (const blocked of [false, true]) {
          useSettingsStore.getState().setTorEnabled(torEnabled);
          useMeshStateStore.getState().setTorActive(torActive);
          useMeshStateStore.getState().setNostrBlockedByTor(blocked);
          expect(isMintNetworkBlocked()).toBe(false);
        }
      }
    }
  });

  // The gate must not fire on a device that never asked for Tor. `nostrBlocked`
  // cannot be set without the preference, but reading only the flag would let a
  // stale value take the wallet offline for someone with Tor switched off.
  it("stays open on iOS when Tor was never asked for", () => {
    setPlatform("ios");
    useMeshStateStore.getState().setNostrBlockedByTor(true);
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
