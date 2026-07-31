/**
 * @jest-environment node
 */
// Scenarios 21-28: the paths where something is being torn down, replaced, or
// raced. These are where a lifecycle bug is most expensive, because the state
// being handled is either about to stop existing (a wipe) or has to survive
// (a conversation, a queued message).

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

import { useMeshStateStore } from "../../../store/mesh-state-store";
import { usePeerStore } from "../../../store/peer-store";
import {
  destroyMeshService,
  getMeshService,
  initMeshService,
} from "../../mesh-service";
import { applyPresence } from "../../presence";
import { AndroidBleModule } from "./harness/android-native";
import { AppShell, makeIdentity } from "./harness/app-shell";
import { installNativeBle } from "./harness/bridge-shim";
import { installOfflineWebSocket } from "./harness/offline-socket";
import { DeviceOS } from "./harness/os";
import { Verdict } from "./harness/verdict";

// No test here needs a relay; without this the pool opens real sockets to public
// relays from CI and leaves them open when the test ends.
installOfflineWebSocket();

function resetStores(): void {
  useMeshStateStore.setState({
    bleBlocker: "starting",
    blePermissionBlocked: false,
    locationGranted: true,
    nostrConnected: false,
    torActive: false,
    bridgeActive: false,
    bridgePeopleAcross: 0,
    presenceStatus: "online",
  });
  usePeerStore.getState().clearAll();
}

function androidDevice(os: DeviceOS): AndroidBleModule {
  const native = new AndroidBleModule(os);
  installNativeBle(native);
  native.initialize();
  return native;
}

describe("teardown, replacement and races", () => {
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

  test("S21 going Away while a reconcile is mid-flight must not revive the radios", async () => {
    // The controller reads the device before touching a radio, and that read is
    // async. Presence changes are synchronous, so "Away" can land in exactly
    // that window - and without a re-check afterwards the pass would go on to
    // start the radios the user just asked to stop.
    const os = new DeviceOS({
      platform: "android",
      apiLevel: 34,
      permissionSettleMs: 400,
    });
    const v = new Verdict(
      "S21",
      "Away lands during an in-flight device read",
      os,
    );
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();

    // Mid-backoff, before the grant has settled: a reconcile is in flight or
    // about to be.
    await os.advance(250);
    applyPresence("away", "tester");
    // Let every pending retry and settle timer fire.
    await os.advance(6000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "scanning stayed off",
      !native.scanning,
      "a retry scheduled before Away resolved after it and restarted the radio",
    );
    v.check("advertising stayed off", !native.advertising);
    v.check(
      "the background service was released",
      !os.foregroundServiceRunning,
    );
    v.check(
      "presence still reads Away",
      useMeshStateStore.getState().presenceStatus === "away",
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S22 'Stop mesh' tapped when the JS runtime is already gone", async () => {
    // Android can destroy the React instance while the foreground service keeps
    // the process. The notification is still on screen, and its Stop button is
    // still tappable - but there is no JS left to hand the shutdown to.
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict("S22", "Stop mesh with no JS to ask", os);
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    app.wireMeshStopListener();
    await app.startMeshWithPermissions();
    await os.advance(500);
    v.check("radios were running", native.scanning && native.advertising);

    await app.setAppState("background");
    os.jsRuntimeReady = false;
    os.log("os", "REACT_INSTANCE_DESTROYED", "process kept alive by FGS");

    native.requestMeshStop();
    await os.advance(500);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the radios come down anyway rather than scanning for nobody",
      !native.scanning && !native.advertising,
      "with no JS to ask, the native module has to stop them itself — otherwise the notification disappears and the radios keep draining the battery with no UI left that can stop them",
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S23 panic wipe: nothing the old identity owned may fire afterwards", async () => {
    const os = new DeviceOS({
      platform: "android",
      apiLevel: 34,
      // A settle delay guarantees a retry is pending when the wipe lands.
      permissionSettleMs: 800,
    });
    const v = new Verdict("S23", "wipe with retries in flight", os);
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(300);

    // Panic: the mesh is destroyed before the keys are cleared.
    destroyMeshService();
    await os.advance(8000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check("the singleton is gone", getMeshService() === null);
    v.check(
      "no pending retry brought the radios back under the wiped identity",
      !native.scanning && !native.advertising,
    );
    v.check(
      "the background service went with it",
      !os.foregroundServiceRunning,
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S24 re-onboarding as a new identity replaces the mesh cleanly", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict("S24", "wipe, then onboard as someone else", os);
    const native = androidDevice(os);

    const first = makeIdentity(7);
    app = new AppShell({ os, identity: first });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(500);
    const firstPeerID = getMeshService()?.peerID;

    destroyMeshService();
    await os.advance(200);

    // A fresh identity from onboarding.
    const second = makeIdentity(21);
    initMeshService(second, "tester2");
    await os.advance(2000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the mesh belongs to the new identity",
      getMeshService()?.peerID === second.peerID &&
        second.peerID !== firstPeerID,
      `now ${getMeshService()?.peerID}, was ${firstPeerID}`,
    );
    v.check("radios are up under the new identity", native.scanning);
    v.check(
      "and the background service with them",
      os.foregroundServiceRunning,
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S25 app remounted repeatedly (config changes) does not stack radios", async () => {
    // Rotation, theme change, font-scale change: Android recreates the Activity
    // and React remounts. The mesh singleton survives, and remounting must not
    // start a second one or churn the foreground service.
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict("S25", "five remounts over a live mesh", os);
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(500);
    const meshAfterFirst = getMeshService();

    for (let i = 0; i < 5; i++) {
      await app.mount();
      await os.advance(200);
    }
    await os.advance(2000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the same mesh instance is still in place",
      getMeshService() === meshAfterFirst,
      "a remount rebuilt the mesh, which says goodbye to every peer and drops the relay pool to arrive back where it started",
    );
    v.check("radios still up", native.scanning && native.advertising);
    v.check("background service still up", os.foregroundServiceRunning);
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S26 Invisible survives a Bluetooth outage without becoming discoverable", async () => {
    // Invisible is a deliberate privacy choice. Coming back from any recovery
    // path must not quietly re-advertise the user.
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict("S26", "Invisible through a BT power cycle", os);
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(500);

    applyPresence("invisible", "tester");
    await os.advance(500);
    v.check("advertising stopped", !native.advertising);
    v.check("scanning continues", native.scanning);
    v.check(
      "background operation is retained while Invisible",
      os.foregroundServiceRunning,
    );

    os.setBluetooth(false);
    await os.advance(600);
    os.setBluetooth(true);
    await os.advance(4000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check("scanning recovered", native.scanning);
    v.check(
      "the user was NOT quietly made discoverable again",
      !native.advertising,
      "recovery re-advertised someone who chose to be invisible",
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S27 backgrounded for a long time, then resumed", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S27",
      "app left in the background for ten minutes",
      os,
    );
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(500);

    await app.setAppState("background");
    await os.advance(600_000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the mesh kept running in the background",
      native.scanning && native.advertising,
    );

    await app.setAppState("active");
    await os.advance(2000);
    v.check("still healthy on resume", native.scanning && native.advertising);
    v.check(
      "no blocker banner",
      useMeshStateStore.getState().bleBlocker === "none",
    );
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S28 the radios are never left half-up", async () => {
    // Scanning without advertising is legitimate (Invisible). Advertising
    // without scanning is not: it makes the device discoverable while unable to
    // discover, which reads to peers as an unresponsive node.
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S28",
      "no half-open radio state across transitions",
      os,
    );
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();

    const violations: string[] = [];
    const sample = (label: string): void => {
      if (native.advertising && !native.scanning) {
        violations.push(
          `${label}: advertising without scanning (blocker=${useMeshStateStore.getState().bleBlocker})`,
        );
      }
    };

    for (let i = 0; i < 8; i++) {
      await os.advance(137);
      sample(`t=${os.now}`);
    }
    os.setBluetooth(false);
    for (let i = 0; i < 8; i++) {
      await os.advance(97);
      sample(`off t=${os.now}`);
    }
    os.setBluetooth(true);
    for (let i = 0; i < 20; i++) {
      await os.advance(211);
      sample(`on t=${os.now}`);
    }

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "never advertising while unable to scan",
      violations.length === 0,
      violations.join("; "),
    );
    v.check("settles healthy", native.scanning && native.advertising);
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S29 a pocketed phone stops scanning flat out", async () => {
    // The unit tests in power-policy.test.ts prove the decision. This proves the
    // wiring: that the decision actually reaches native, through the reconciler,
    // on the events that should trigger it.
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S29",
      "power mode follows foreground and battery",
      os,
    );
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(500);

    v.check(
      "on screen on battery, the radios run balanced rather than flat out",
      native.powerMode === "balanced",
      `mode=${native.powerMode}`,
    );

    // Into a pocket.
    getMeshService()?.setAppForeground(false);
    await os.advance(1000);
    v.check(
      "backgrounding drops the radios to power-saver",
      native.powerMode === "power-saver",
      `mode=${native.powerMode}`,
    );
    v.check(
      "and the mesh is still scanning - quieter, not stopped",
      native.scanning && native.advertising,
      "a duty cycle is invisible above the native boundary; JS asked for scanning and must still have it",
    );

    // Battery falls to critical while pocketed.
    native.batteryPercent = 6;
    getMeshService()?.retryRadios();
    await os.advance(1000);
    v.check(
      "a critical battery in the background drops further still",
      native.powerMode === "ultra-low-power",
      `mode=${native.powerMode}`,
    );

    // Picked up and plugged in.
    native.batteryPercent = 90;
    native.charging = true;
    getMeshService()?.setAppForeground(true);
    await os.advance(1000);
    v.check(
      "charging in the foreground earns full performance",
      native.powerMode === "performance",
      `mode=${native.powerMode}`,
    );

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.assert();
  });

  // ---------------------------------------------------------------------------

  test("S30 the battery-saver note appears only when the user would notice", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S30",
      "battery-saver banner follows what is visible",
      os,
    );
    const native = androidDevice(os);

    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(500);
    v.check(
      "a healthy battery says nothing",
      !useMeshStateStore.getState().powerSaving,
    );

    // Pocketed on a good battery: reduced, but nobody is waiting on it.
    getMeshService()?.setAppForeground(false);
    await os.advance(1000);
    v.check(
      "backgrounded, the reduction is silent",
      !useMeshStateStore.getState().powerSaving,
      "a slower scan nobody is looking at is not worth a banner",
    );

    // Picked up on a low battery: now the slowness is visible.
    native.batteryPercent = 15;
    getMeshService()?.setAppForeground(true);
    await os.advance(1000);
    v.check(
      "on screen with a low battery, the reduction is explained",
      useMeshStateStore.getState().powerSaving,
      `mode=${native.powerMode}`,
    );

    // Plugged in: back to full speed, note clears.
    native.charging = true;
    getMeshService()?.retryRadios();
    await os.advance(1000);
    v.check(
      "charging clears the note",
      !useMeshStateStore.getState().powerSaving,
      `mode=${native.powerMode}`,
    );

    // Away: the mesh is off, and the battery is not the reason.
    applyPresence("away", "tester");
    await os.advance(1000);
    v.check(
      "a stopped mesh reports no battery note",
      !useMeshStateStore.getState().powerSaving,
    );

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.assert();
  });
});
