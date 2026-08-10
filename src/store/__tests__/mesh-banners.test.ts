import { computeMeshBanners, type MeshBannerInputs } from "../mesh-state-store";

// A healthy, fully-online baseline. Individual tests override one field.
const HEALTHY: MeshBannerInputs = {
  presenceStatus: "online",
  bleBlocker: "none",
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
      bleBlocker: "adapter-off", // would otherwise raise a Bluetooth banner
      locationGranted: false,
      torActive: true,
      peerCount: 0,
    });
    expect(banners).toEqual([
      {
        key: "paused",
        label: "Mesh paused · you're away",
        tone: "neutral",
        action: { label: "Resume", kind: "resume" },
      },
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
      bleBlocker: "adapter-off",
      locationGranted: false,
      peerCount: 0,
    });
    expect(banners.map((b) => b.key)).toEqual(["ble-adapter-off", "location"]);
    expect(banners[0].tone).toBe("danger");
    expect(banners[1].tone).toBe("caution");
  });

  // Each blocker has to be nameable on its own, because each sends the user
  // somewhere different. Collapsing them into one boolean pair is what produced
  // "Bluetooth permission needed" over a granted permission.
  it("gives every blocker its own banner and its own way out", () => {
    const cases: [
      MeshBannerInputs["bleBlocker"],
      string,
      string | undefined,
    ][] = [
      ["adapter-off", "ble-adapter-off", "enable-bluetooth"],
      ["permission-denied", "ble-permission", "open-app-settings"],
      ["permission-blocked", "ble-permission-blocked", "open-app-settings"],
      ["location-permission", "ble-location-permission", "open-app-settings"],
      [
        "location-services-off",
        "ble-location-services",
        "open-location-settings",
      ],
      ["unsupported", "ble-unsupported", undefined],
      ["starting", "ble-starting", undefined],
    ];
    for (const [blocker, key, action] of cases) {
      const banner = computeMeshBanners({ ...HEALTHY, bleBlocker: blocker })[0];
      expect(banner.key).toBe(key);
      expect(banner.action?.kind).toBe(action);
    }
  });

  it("shows no blocker banner when nothing is in the way", () => {
    expect(
      computeMeshBanners({ ...HEALTHY, bleBlocker: "none", peerCount: 0 }).map(
        (b) => b.key,
      ),
    ).not.toContain("ble-adapter-off");
  });

  it("offers a way back from the paused state", () => {
    const paused = computeMeshBanners({ ...HEALTHY, presenceStatus: "away" });
    expect(paused[0].key).toBe("paused");
    expect(paused[0].action?.kind).toBe("resume");
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
      bleBlocker: "adapter-off",
    });
    expect(banners.map((b) => b.key)).toEqual([
      "ble-adapter-off",
      "internet-off",
    ]);
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

  // Aggressive OEM background management is advice, not a blocker: the mesh is
  // running fine right now, it just may not survive being backgrounded. So it
  // is a caution, it is dismissible, and it never suppresses anything else.
  it("shows the background-limits advisory only when a brand is supplied", () => {
    expect(computeMeshBanners(HEALTHY).map((b) => b.key)).not.toContain(
      "background-limits",
    );
    const withBrand = computeMeshBanners({
      ...HEALTHY,
      backgroundLimitsBrand: "Xiaomi",
    });
    const advisory = withBrand.find((b) => b.key === "background-limits");
    expect(advisory).toBeDefined();
    expect(advisory?.tone).toBe("caution");
    expect(advisory?.dismissible).toBe(true);
    expect(advisory?.action?.kind).toBe("open-background-limits");
    // Named, because "your phone" is not something a user can act on and the
    // OEM screen they need is brand-specific.
    expect(advisory?.label).toContain("Xiaomi");
  });

  it("treats an empty brand as nothing to say", () => {
    expect(
      computeMeshBanners({ ...HEALTHY, backgroundLimitsBrand: "" }).map(
        (b) => b.key,
      ),
    ).not.toContain("background-limits");
  });

  it("ranks the background advisory above the location note", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      backgroundLimitsBrand: "Samsung",
      locationGranted: false,
      peerCount: 0,
    });
    const keys = banners.map((b) => b.key);
    expect(keys.indexOf("background-limits")).toBeLessThan(
      keys.indexOf("location"),
    );
  });

  it("stays silent about background limits while Away", () => {
    // Away short-circuits everything: the mesh is stopped on purpose, so how it
    // would behave in the background is not a useful thing to say.
    expect(
      computeMeshBanners({
        ...HEALTHY,
        presenceStatus: "away",
        backgroundLimitsBrand: "Oppo",
      }).map((b) => b.key),
    ).toEqual(["paused"]);
  });

  // Blockers must never be dismissible: hiding "Bluetooth is off" would leave
  // an empty radar with nothing explaining it, which is the exact state this
  // whole system exists to eliminate.
  it("never lets a hard blocker be dismissed away", () => {
    for (const blocker of [
      "adapter-off",
      "permission-denied",
      "permission-blocked",
      "location-permission",
      "location-services-off",
      "unsupported",
    ] as const) {
      const banner = computeMeshBanners({ ...HEALTHY, bleBlocker: blocker })[0];
      expect(banner.dismissible).toBeUndefined();
    }
  });

  // The battery-saver note is informational, not a fault: the mesh is working,
  // just looking around less often. It exists because the visible symptom - a
  // peer taking half a minute to appear - is otherwise indistinguishable from
  // the app being broken.
  it("explains a reduced scan the user would otherwise read as broken", () => {
    const banners = computeMeshBanners({ ...HEALTHY, powerSaving: true });
    const note = banners.find((b) => b.key === "power-saving");
    expect(note).toBeDefined();
    // Muted, not amber: nothing is wrong.
    expect(note?.tone).toBe("neutral");
    // No button - charging the phone is the fix, and it clears itself.
    expect(note?.action).toBeUndefined();
    // Not dismissible either: it is transient, so hiding it would only mean
    // hiding it again next time.
    expect(note?.dismissible).toBeUndefined();
  });

  it("says nothing about power when the scan is running normally", () => {
    expect(computeMeshBanners(HEALTHY).map((b) => b.key)).not.toContain(
      "power-saving",
    );
    expect(
      computeMeshBanners({ ...HEALTHY, powerSaving: false }).map((b) => b.key),
    ).not.toContain("power-saving");
  });

  it("still explains the reduced scan when the internet is switched off", () => {
    // Internet-off short-circuits the relay/Tor/gateway notes because none of
    // them can apply. Battery is not an internet concern, so it must survive.
    const keys = computeMeshBanners({
      ...HEALTHY,
      internetEnabled: false,
      powerSaving: true,
    }).map((b) => b.key);
    expect(keys).toContain("power-saving");
    expect(keys).toContain("internet-off");
  });

  it("stays quiet about power while Away", () => {
    // Away stopped the radios on purpose. How hard they would have scanned is
    // not a useful thing to say about a mesh that is not running.
    expect(
      computeMeshBanners({
        ...HEALTHY,
        presenceStatus: "away",
        powerSaving: true,
      }).map((b) => b.key),
    ).toEqual(["paused"]);
  });

  it("ranks below the blockers, which are the reason to act", () => {
    const keys = computeMeshBanners({
      ...HEALTHY,
      bleBlocker: "adapter-off",
      powerSaving: true,
    }).map((b) => b.key);
    expect(keys.indexOf("ble-adapter-off")).toBeLessThan(
      keys.indexOf("power-saving"),
    );
  });
});

// A wrong clock is the one failure the freshness window can cause, and it is
// completely silent from inside the app: every packet is held to a two-minute
// window, so a drifted phone rejects everyone and is rejected by everyone. The
// radio is fine, the links are up, and the room is empty - which reads as
// "nobody is here" rather than "your clock is wrong".
describe("clock skew banner", () => {
  it("says what is wrong and what to do about it", () => {
    const banners = computeMeshBanners({ ...HEALTHY, clockSkewed: true });
    expect(banners).toHaveLength(1);
    expect(banners[0].key).toBe("clock-skew");
    expect(banners[0].tone).toBe("caution");
    // No action button: nothing in the app can set the system clock, and a
    // button that cannot fix the thing it names is worse than prose.
    expect(banners[0].action).toBeUndefined();
  });

  it("ranks above the informational notes, since none of them can be trusted", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      clockSkewed: true,
      locationGranted: false,
      powerSaving: true,
    });
    expect(banners[0].key).toBe("clock-skew");
  });

  // A hard blocker still outranks it: if Bluetooth is off there is no mesh to
  // be out of time with, and telling someone their clock is wrong while their
  // radio is off sends them to the wrong settings screen.
  it("stays below a hard Bluetooth blocker", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      clockSkewed: true,
      bleBlocker: "adapter-off",
    });
    expect(banners[0].key).not.toBe("clock-skew");
    expect(banners.some((b) => b.key === "clock-skew")).toBe(true);
  });

  it("is absent by default, so a caller with no evidence says nothing", () => {
    expect(computeMeshBanners(HEALTHY)).toEqual([]);
    expect(computeMeshBanners({ ...HEALTHY, clockSkewed: false })).toEqual([]);
  });

  // Going Away stops the whole mesh, so nothing else is worth saying.
  it("is suppressed while the user has deliberately paused", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      clockSkewed: true,
      presenceStatus: "away",
    });
    expect(banners.map((b) => b.key)).toEqual(["paused"]);
  });
});

// The WiFi Aware fast path, which is an accelerator and never a blocker. It gets
// a note only when the user could act on it, and never a colour that suggests
// something is broken: every message still sends over Bluetooth.
describe("the WiFi fast-path note", () => {
  it("says nothing when the fast path is running", () => {
    expect(computeMeshBanners({ ...HEALTHY, wifiFastPath: "active" })).toEqual(
      [],
    );
  });

  it("says nothing on hardware that never had it, or before the first pass", () => {
    for (const state of ["unsupported", "unknown"] as const) {
      expect(computeMeshBanners({ ...HEALTHY, wifiFastPath: state })).toEqual(
        [],
      );
    }
  });

  // The app never requests NEARBY_WIFI_DEVICES, so a note about it would name a
  // problem with no way to act on it.
  it("says nothing about a permission it never asks for", () => {
    expect(
      computeMeshBanners({ ...HEALTHY, wifiFastPath: "permission" }),
    ).toEqual([]);
  });

  it("raises a neutral, actionless note when WiFi is switched off", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      wifiFastPath: "unavailable",
    });
    expect(banners).toEqual([
      {
        key: "wifi-fast-path",
        label: "Wi-Fi off · large files send slower",
        tone: "neutral",
      },
    ]);
  });

  // Aware is a direct phone-to-phone radio, so it has nothing to do with the
  // internet toggle and must survive the early return that toggle triggers.
  it("still shows in pure-Bluetooth mode", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      wifiFastPath: "unavailable",
      internetEnabled: false,
    });
    expect(banners.map((b) => b.key)).toEqual([
      "wifi-fast-path",
      "internet-off",
    ]);
  });

  it("is suppressed while the user has deliberately paused", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      wifiFastPath: "unavailable",
      presenceStatus: "away",
    });
    expect(banners.map((b) => b.key)).toEqual(["paused"]);
  });
});

// A panic wipe that did not commit. The only banner about data at rest rather
// than about the mesh, and the only one that outranks Away.
describe("the incomplete-wipe banner", () => {
  it("is absent by default, so a caller with no evidence says nothing", () => {
    expect(computeMeshBanners(HEALTHY)).toEqual([]);
    expect(computeMeshBanners({ ...HEALTHY, wipeIncomplete: false })).toEqual(
      [],
    );
  });

  it("says data may remain, with no button, since the retry is automatic", () => {
    const banners = computeMeshBanners({ ...HEALTHY, wipeIncomplete: true });
    expect(banners).toEqual([
      {
        key: "wipe-incomplete",
        label: "Wipe incomplete · some data may remain, reopening retries",
        tone: "danger",
      },
    ]);
  });

  // Away short-circuits every other banner because a paused mesh makes them
  // moot. This one is not about the mesh, so it has to survive that.
  it("survives the Away short-circuit, and leads it", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      wipeIncomplete: true,
      presenceStatus: "away",
    });
    expect(banners.map((b) => b.key)).toEqual(["wipe-incomplete", "paused"]);
  });

  it("outranks even a hard Bluetooth blocker", () => {
    const banners = computeMeshBanners({
      ...HEALTHY,
      wipeIncomplete: true,
      bleBlocker: "adapter-off",
      peerCount: 0,
    });
    expect(banners[0].key).toBe("wipe-incomplete");
  });
});
