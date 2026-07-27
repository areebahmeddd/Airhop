import { computeMeshBanners, type MeshBannerInputs } from "../mesh-state-store";

// A healthy, fully-online baseline. Individual tests override one field.
const HEALTHY: MeshBannerInputs = {
  presenceStatus: "online",
  adapterEnabled: true,
  permissionGranted: true,
  locationGranted: true,
  nostrConnected: false,
  torActive: false,
  gatewayEnabled: false,
  bridgeActive: false,
  bridgePeopleAcross: 0,
  internetEnabled: true,
  peerCount: 3,
};

describe("computeMeshBanners", () => {
  it("shows nothing when the mesh is healthy with peers", () => {
    expect(computeMeshBanners(HEALTHY)).toEqual([]);
  });

  it("shows only the paused banner when Away, ignoring everything else", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      presenceStatus: "away",
      adapterEnabled: false, // would otherwise raise a Bluetooth banner
      locationGranted: false,
      torActive: true,
      peerCount: 0,
    });
    expect(banners).toEqual([
      { key: "paused", label: "Mesh paused · You're away", tone: "neutral" },
    ]);
  });

  it("does NOT special-case Invisible (still scans and relays)", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      presenceStatus: "invisible",
    });
    expect(banners).toEqual([]);
  });

  it("stacks Bluetooth-off and location-off, severity first", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      adapterEnabled: false,
      locationGranted: false,
      peerCount: 0,
    });
    expect(banners.map((b) => b.key)).toEqual(["bluetooth", "location"]);
    expect(banners[0].tone).toBe("danger");
    expect(banners[1].tone).toBe("caution");
  });

  it("distinguishes adapter-off from permission-denied", () => {
    expect(
      computeMeshBanners({ ...HEALTHY, adapterEnabled: false })[0].key,
    ).toBe("bluetooth");
    expect(
      computeMeshBanners({ ...HEALTHY, permissionGranted: false })[0].key,
    ).toBe("ble-permission");
  });

  it("shows the Nostr relay note only with no peers and a live relay", () => {
    expect(
      computeMeshBanners({
        ...HEALTHY,
        peerCount: 0,
        nostrConnected: true,
      }).map((b) => b.key),
    ).toContain("nostr");
    // With peers present, the relay note is suppressed.
    expect(
      computeMeshBanners({
        ...HEALTHY,
        peerCount: 2,
        nostrConnected: true,
      }).map((b) => b.key),
    ).not.toContain("nostr");
  });

  it("shows the Tor note whenever Tor is active", () => {
    const banners = computeMeshBanners({ ...HEALTHY, torActive: true });
    expect(banners.map((b) => b.key)).toEqual(["tor"]);
  });

  it("shows the gateway note whenever the gateway is enabled", () => {
    const banners = computeMeshBanners({ ...HEALTHY, gatewayEnabled: true });
    expect(banners.map((b) => b.key)).toEqual(["gateway"]);
  });

  it("shows the bridge note when bridging, with the across-count when known", () => {
    const none = computeMeshBanners({ ...HEALTHY, bridgeActive: true });
    expect(none).toEqual([
      {
        key: "bridge",
        label: "Mesh bridge on · public chat linked",
        tone: "bridge",
      },
    ]);
    const withCount = computeMeshBanners({
      ...HEALTHY,
      bridgeActive: true,
      bridgePeopleAcross: 4,
    });
    expect(withCount[0].label).toBe("Mesh bridge on · 4 across the bridge");
  });

  it("shows only the internet-off note and suppresses relay/tor/gateway/bridge", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      internetEnabled: false,
      peerCount: 0,
      nostrConnected: true, // would normally raise the relay note
      torActive: true,
      gatewayEnabled: true,
      bridgeActive: true,
    });
    expect(banners).toEqual([
      {
        key: "internet-off",
        label: "Internet off · Bluetooth only",
        tone: "neutral",
      },
    ]);
  });

  it("still shows hard blockers alongside internet-off", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      internetEnabled: false,
      adapterEnabled: false,
    });
    expect(banners.map((b) => b.key)).toEqual(["bluetooth", "internet-off"]);
  });

  it("does not show the bridge note when inactive even if people are cached", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      bridgeActive: false,
      bridgePeopleAcross: 4,
    });
    expect(banners.map((b) => b.key)).toEqual([]);
  });

  it("stacks location, Nostr and Tor together when all apply", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      locationGranted: false,
      peerCount: 0,
      nostrConnected: true,
      torActive: true,
    });
    expect(banners.map((b) => b.key)).toEqual(["location", "nostr", "tor"]);
  });
});
