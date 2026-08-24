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
// While Orbot is routing, though. When it stops, that socket is covered by
// nothing and the request egresses in the clear with the real IP. tor-routing
// publishes that state as `nostrBlockedByTor` and holds the Nostr transport
// down for it; this gate answers to the same fact, or it protects the smaller
// half of the traffic.
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

  // The preference stays on through a dropped Orbot and the banner says Tor
  // could not connect, so the switch reads ON across a window this gate has to
  // hold rather than wave mint traffic through.
  it("blocks on Android once Orbot stops carrying the socket", () => {
    setPlatform("android");
    useSettingsStore.getState().setTorEnabled(true);
    useMeshStateStore.getState().setTorActive(true);
    expect(isMintNetworkBlocked()).toBe(false);

    // Orbot goes away: tor-routing stands the claim down and shuts the gate.
    useMeshStateStore.getState().setTorActive(false);
    useMeshStateStore.getState().setNostrBlockedByTor(true);
    expect(isMintNetworkBlocked()).toBe(true);
  });

  it("unblocks on Android the moment Orbot is carrying it again", () => {
    setPlatform("android");
    useSettingsStore.getState().setTorEnabled(true);
    useMeshStateStore.getState().setNostrBlockedByTor(true);
    expect(isMintNetworkBlocked()).toBe(true);

    useMeshStateStore.getState().setNostrBlockedByTor(false);
    useMeshStateStore.getState().setTorActive(true);
    expect(isMintNetworkBlocked()).toBe(false);
  });

  // Turning Tor off is the documented way out of the blocked state, and it has
  // to release the wallet along with the transport. Otherwise a user whose
  // Orbot is gone for good cannot deposit at all, whatever they do.
  it("releases Android when the user turns Tor off", () => {
    setPlatform("android");
    useSettingsStore.getState().setTorEnabled(true);
    useMeshStateStore.getState().setNostrBlockedByTor(true);
    expect(isMintNetworkBlocked()).toBe(true);

    useSettingsStore.getState().setTorEnabled(false);
    useMeshStateStore.getState().setNostrBlockedByTor(false);
    expect(isMintNetworkBlocked()).toBe(false);
  });

  // The same informed override iOS has. Whichever platform refuses, the
  // preference means the same thing and is read before either refusal.
  it("lets an Android user opt in while Orbot is down", () => {
    setPlatform("android");
    useSettingsStore.getState().setTorEnabled(true);
    useMeshStateStore.getState().setNostrBlockedByTor(true);
    expect(isMintNetworkBlocked()).toBe(true);

    useSettingsStore.getState().setAllowMintOverClearnet(true);
    expect(isMintNetworkBlocked()).toBe(false);
  });

  // The gate must not fire on a device that never asked for Tor. `nostrBlocked`
  // cannot be set without the preference, but reading only the flag would let a
  // stale value take the wallet offline for someone with Tor switched off.
  it("stays open on Android when Tor was never asked for", () => {
    setPlatform("android");
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
