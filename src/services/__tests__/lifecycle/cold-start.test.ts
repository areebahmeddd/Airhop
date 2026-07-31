/**
 * @jest-environment node
 */
// Scenarios 1-10: what happens between tapping the icon and having a mesh.
//
// Every check asserts what a CORRECT app does. These all failed before the
// radio-controller rewrite; the traces printed on failure are the evidence for
// why, and are worth reading if one ever goes red again.

jest.mock("expo-location", () => ({}));
jest.mock("../../../bridge/NativeAirhopBLE", () => ({
  __esModule: true,
  get default() {
    return require("./harness/bridge-shim").bleBridge;
  },
}));
jest.mock("../../../bridge/NativeAirhopWiFi", () => ({
  __esModule: true,
  get default() {
    return require("./harness/bridge-shim").wifiBridge;
  },
}));

import {
  computeMeshBanners,
  useMeshStateStore,
} from "../../../store/mesh-state-store";
import { usePeerStore } from "../../../store/peer-store";
import { useSettingsStore } from "../../../store/settings-store";
import { AndroidBleModule } from "./harness/android-native";
import { AppShell } from "./harness/app-shell";
import { installNativeBle } from "./harness/bridge-shim";
import { IosBleModule } from "./harness/ios-native";
import { installOfflineWebSocket } from "./harness/offline-socket";
import { DeviceOS } from "./harness/os";
import { Verdict } from "./harness/verdict";

// No test here needs a relay; without this the pool opens real sockets to public
// relays from CI and leaves them open when the test ends.
installOfflineWebSocket();

// How long a fresh grant takes to become effective in the Bluetooth stack.
// bitchat-android waits a flat 1000ms for exactly this and says so: "This
// solves the issue where app needs restart to work on first install"
// (MainActivity.kt:684). Airhop retries until the stack accepts instead, which
// is correct on a slow device and instant on a fast one.
const REAL_GRANT_SETTLE_MS = 600;

function resetStores(): void {
  useMeshStateStore.setState({
    bleBlocker: "starting",
    locationGranted: true,
    nostrConnected: false,
    torActive: false,
    bridgeActive: false,
    bridgePeopleAcross: 0,
    presenceStatus: "online",
  });
  usePeerStore.getState().clearAll();
}

// The banner the Mesh tab would be showing right now, if any.
function currentBlockerBanner(): { key: string; action?: string } | null {
  const s = useMeshStateStore.getState();
  const banners = computeMeshBanners({
    presenceStatus: s.presenceStatus,
    bleBlocker: s.bleBlocker,
    locationGranted: s.locationGranted,
    nostrConnected: s.nostrConnected,
    torActive: s.torActive,
    gatewayEnabled: useSettingsStore.getState().gatewayEnabled,
    bridgeActive: s.bridgeActive,
    bridgePeopleAcross: s.bridgePeopleAcross,
    internetEnabled: useSettingsStore.getState().internetEnabled,
    peerCount: usePeerStore.getState().peers.size,
  });
  const blocked = banners.find((b) => b.key.startsWith("ble-"));
  if (blocked === undefined) return null;
  return { key: blocked.key, action: blocked.action?.kind };
}

function androidDevice(os: DeviceOS): AndroidBleModule {
  const native = new AndroidBleModule(os);
  installNativeBle(native);
  // RN calls initialize() once the catalyst instance exists. Constructing the
  // module no longer registers anything on its own.
  native.initialize();
  return native;
}

describe("cold start and permissions", () => {
  let app: AppShell | null = null;

  beforeEach(() => {
    jest.useFakeTimers();
    resetStores();
  });

  afterEach(() => {
    app?.teardown();
    app = null;
    installNativeBle(null);
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  // ---------------------------------------------------------------------------

  test("S01 first install, all permissions granted, real grant latency", async () => {
    const os = new DeviceOS({
      platform: "android",
      apiLevel: 34,
      permissionSettleMs: REAL_GRANT_SETTLE_MS,
    });
    const v = new Verdict(
      "S01",
      "first install, everything allowed, stack honours the grant 600ms later",
      os,
    );
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(5000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check("scanning is running after the grant settles", native.scanning);
    v.check(
      "advertising is running after the grant settles",
      native.advertising,
    );
    v.check(
      "no blocker banner over a working mesh",
      currentBlockerBanner() === null,
      `banner: ${JSON.stringify(currentBlockerBanner())}`,
    );
    v.check(
      "the background service is up so the mesh survives backgrounding",
      os.foregroundServiceRunning,
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S02 first install, BLE denied once, granted later in Settings", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict("S02", "denied once, then granted in Settings", os);
    const native = androidDevice(os);

    app = new AppShell({ os, answer: () => "denied" });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(500);

    v.check(
      "the banner names the missing permission and offers a way to fix it",
      currentBlockerBanner()?.key === "ble-permission" &&
        currentBlockerBanner()?.action === "open-app-settings",
      `banner: ${JSON.stringify(currentBlockerBanner())}`,
    );
    v.check(
      "a re-askable denial does not also throw a modal at the user",
      app.alerts.length === 0,
      `${app.alerts.length} alert(s) shown on top of the banner`,
    );

    // User goes to Settings, grants everything, comes back.
    await app.setAppState("background");
    for (const p of [
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.BLUETOOTH_SCAN",
      "android.permission.BLUETOOTH_ADVERTISE",
      "android.permission.BLUETOOTH_CONNECT",
    ] as const) {
      os.setPermission(p, "granted");
    }
    await os.advance(100);
    await app.setAppState("active");
    await os.advance(2000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "radios come up on resume without a relaunch",
      native.scanning && native.advertising,
    );
    v.check("the banner clears itself", currentBlockerBanner() === null);
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S03 first install, permission blocked forever", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S03",
      "'Don't allow' twice — only Settings can fix it",
      os,
    );
    androidDevice(os);

    app = new AppShell({ os, answer: () => "blocked" });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(2000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the user is offered the only route that works (Settings)",
      currentBlockerBanner()?.key === "ble-permission-blocked" &&
        currentBlockerBanner()?.action === "open-app-settings",
      `banner: ${JSON.stringify(currentBlockerBanner())}`,
    );
    v.check(
      "no foreground-service notification claiming an active mesh",
      !os.foregroundServiceRunning,
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S04 Android 12+ user picks Approximate instead of Precise location", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S04",
      "location downgraded to coarse — scanning cannot work, and the app must say exactly why",
      os,
    );
    androidDevice(os);

    app = new AppShell({
      os,
      answer: (p) =>
        p === "android.permission.ACCESS_FINE_LOCATION" ? "denied" : "granted",
    });
    // The coarse grant the dialog actually produced.
    os.setPermission("android.permission.ACCESS_COARSE_LOCATION", "granted");
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(2000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the banner names PRECISE location specifically, not 'Bluetooth permission'",
      currentBlockerBanner()?.key === "ble-precise-location",
      `banner: ${JSON.stringify(currentBlockerBanner())}`,
    );
    v.check(
      "and sends the user to Settings, since re-prompting cannot re-offer Precise",
      currentBlockerBanner()?.action === "open-app-settings",
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S05 permission granted in Settings while backgrounded", async () => {
    const os = new DeviceOS({
      platform: "android",
      apiLevel: 34,
      permissionSettleMs: REAL_GRANT_SETTLE_MS,
    });
    const v = new Verdict("S05", "granted while away, recovers on resume", os);
    const native = androidDevice(os);

    app = new AppShell({ os, answer: () => "denied" });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(100);
    await app.setAppState("background");

    for (const p of [
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.BLUETOOTH_SCAN",
      "android.permission.BLUETOOTH_ADVERTISE",
      "android.permission.BLUETOOTH_CONNECT",
    ] as const) {
      os.setPermission(p, "granted");
    }
    await os.advance(3000);
    await app.setAppState("active");
    await os.advance(2000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check("scanning recovered", native.scanning);
    v.check("advertising recovered", native.advertising);
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S06 permission revoked in Settings — process killed, relaunch is clean", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S06",
      "revoke kills the process; next launch must be clean",
      os,
    );
    let native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(500);

    app.killProcess();
    native.invalidate();
    for (const p of [
      "android.permission.BLUETOOTH_SCAN",
      "android.permission.BLUETOOTH_ADVERTISE",
      "android.permission.BLUETOOTH_CONNECT",
      "android.permission.ACCESS_FINE_LOCATION",
    ] as const) {
      os.setPermission(p, "denied");
    }

    // Cold relaunch.
    native = androidDevice(os);
    app = new AppShell({ os, answer: () => "granted" });
    app.bootJsRuntime();
    await app.mount();
    await os.advance(2000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "radios up after a clean relaunch",
      native.scanning && native.advertising,
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S07 Bluetooth switched off before the app is even opened", async () => {
    const os = new DeviceOS({
      platform: "android",
      apiLevel: 34,
      adapter: "off",
    });
    const v = new Verdict("S07", "Bluetooth off at launch", os);
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(1000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the banner says Bluetooth is off AND offers to turn it on",
      currentBlockerBanner()?.key === "ble-adapter-off" &&
        currentBlockerBanner()?.action === "enable-bluetooth",
      `banner: ${JSON.stringify(currentBlockerBanner())}`,
    );
    v.check(
      "no foreground-service notification claiming an active mesh",
      !os.foregroundServiceRunning,
    );

    // The user taps the banner's button; Android shows the system dialog and
    // they accept.
    const enabled = await native.requestEnableBluetooth();
    await os.advance(3000);

    v.check("the in-app button actually turned Bluetooth on", enabled);
    v.check("radios follow", native.scanning && native.advertising);
    v.check("the banner clears", currentBlockerBanner() === null);
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S08 location SERVICES off while the location permission is granted", async () => {
    const os = new DeviceOS({
      platform: "android",
      apiLevel: 34,
      locationServicesEnabled: false,
    });
    const v = new Verdict(
      "S08",
      "permission granted, OS location toggle off — the one case that looks like an empty room",
      os,
    );
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(3000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the banner distinguishes 'location services off' from 'nobody nearby'",
      currentBlockerBanner()?.key === "ble-location-services",
      `banner: ${JSON.stringify(currentBlockerBanner())}`,
    );
    v.check(
      "and offers to open the location settings",
      currentBlockerBanner()?.action === "open-location-settings",
    );
    v.check(
      "the radar is not claiming to scan",
      !native.scanning,
      "a scan that the OS withholds every result from is not a scan",
    );

    // The user turns location services on and comes back.
    os.locationServicesEnabled = true;
    await app.setAppState("active");
    await os.advance(2000);
    v.check("scanning starts once location services return", native.scanning);
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S09 device without a Bluetooth adapter", async () => {
    const os = new DeviceOS({
      platform: "android",
      apiLevel: 34,
      hasBluetooth: false,
    });
    const v = new Verdict("S09", "no Bluetooth radio on the device", os);

    let constructed = true;
    let constructionError: string | null = null;
    try {
      androidDevice(os);
    } catch (e) {
      constructed = false;
      constructionError = (e as Error).message;
    }
    v.check(
      "the app starts at all on a device with no Bluetooth",
      constructed,
      constructionError ?? undefined,
    );
    if (!constructed) {
      v.assert();
      return;
    }

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(3000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the app explains it calmly rather than alarming anyone",
      currentBlockerBanner()?.key === "ble-unsupported",
      `banner: ${JSON.stringify(currentBlockerBanner())}`,
    );
    v.check(
      "and does not poll a radio that will never exist",
      currentBlockerBanner()?.action === undefined,
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S10 foreground service killed by an aggressive OEM while backgrounded", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S10",
      "OEM battery manager reaps the mesh service",
      os,
    );
    androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(500);
    v.check("the service was up to begin with", os.foregroundServiceRunning);

    await app.setAppState("background");
    // Xiaomi/Oppo/Samsung style: the service is reaped, the process lingers,
    // and there is no callback for it.
    os.stopForegroundService();
    await os.advance(5000);
    await app.setAppState("active");
    await os.advance(2000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "coming back to the foreground restores the background service",
      os.foregroundServiceRunning,
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------
  // iOS variants of the launch path.

  test("S07i iOS cold launch with a perfectly healthy radio", async () => {
    const os = new DeviceOS({ platform: "ios" });
    const v = new Verdict("S07i", "iOS cold launch, Bluetooth healthy", os);
    const native = new IosBleModule(os);
    installNativeBle(native);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();

    // Sample the banner in the window a user actually sees on launch.
    await os.advance(20);
    const earlyBanner = currentBlockerBanner();
    await os.advance(3000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the launch banner never claims Bluetooth is off when it is on",
      earlyBanner === null || earlyBanner.key === "ble-starting",
      `banner during launch: ${JSON.stringify(earlyBanner)}`,
    );
    v.check("scanning starts", native.scanning);
    v.check("advertising starts", native.advertising);
    v.check("and settles with no banner", currentBlockerBanner() === null);
    v.assert();
  });

  test("S03i iOS user denies the Bluetooth prompt", async () => {
    const os = new DeviceOS({ platform: "ios" });
    const v = new Verdict("S03i", "iOS Bluetooth permission denied", os);
    const native = new IosBleModule(os);
    native.authorized = false;
    installNativeBle(native);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(3000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the banner reports a denied permission, not an absent radio",
      currentBlockerBanner()?.key === "ble-permission-blocked",
      `banner: ${JSON.stringify(currentBlockerBanner())} — iOS never re-prompts once denied, so Settings is the only route and the copy has to say so`,
    );
    v.assert();
  });
});
