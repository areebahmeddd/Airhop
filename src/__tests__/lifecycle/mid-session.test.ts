/**
 * @jest-environment node
 */
// Scenarios 11-20: what happens to a running app when the world changes under
// it, radios toggled, conversations in flight, the app put away and reopened.

jest.mock("expo-location", () => ({}));
jest.mock("@bridge/NativeAirhopBLE", () => ({
  __esModule: true,
  get default() {
    return require("../harness/bridge-shim").bleBridge;
  },
}));
jest.mock("@bridge/NativeAirhopWiFi", () => ({
  __esModule: true,
  get default() {
    return require("../harness/bridge-shim").wifiBridge;
  },
}));

import { getMeshService } from "@services/mesh-service";
import { applyPresence } from "@services/presence-service";
import { computeMeshBanners, useMeshStateStore } from "@store/mesh-state-store";
import { useOutboxStore } from "@store/outbox-store";
import { usePeerStore } from "@store/peer-store";
import { AndroidBleModule } from "../harness/android-native";
import { AppShell } from "../harness/app-shell";
import { installNativeBle } from "../harness/bridge-shim";
import { IosBleModule } from "../harness/ios-native";
import { installOfflineWebSocket } from "../harness/offline-socket";
import { DeviceOS } from "../harness/os";
import { Verdict } from "../harness/verdict";

// No test here needs a relay; without this the pool opens real sockets to public
// relays from CI and leaves them open when the test ends.
installOfflineWebSocket();

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
  useOutboxStore.setState({ pending: [] });
}

// Bring an Android device up to a healthy, running mesh.
async function healthyAndroid(
  os: DeviceOS,
): Promise<{ app: AppShell; native: AndroidBleModule }> {
  const native = new AndroidBleModule(os);
  installNativeBle(native);
  native.initialize();
  const app = new AppShell({ os });
  app.bootJsRuntime();
  app.wireMeshStopListener();
  await app.startMeshWithPermissions();
  await os.advance(200);
  return { app, native };
}

describe("mid-session radio chaos and lifecycle", () => {
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

  test("S11 Bluetooth toggled off then on from quick settings, app in front", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S11",
      "Android: BT off then on while looking at the app",
      os,
    );
    const started = await healthyAndroid(os);
    app = started.app;
    const native = started.native;

    native.simulatePeerConnect("c:AA:BB:CC:DD:EE:01");
    await os.advance(100);

    os.setBluetooth(false);
    await os.advance(500);
    v.check(
      "process survived the switch-off",
      os.crashed === null,
      os.crashed ?? undefined,
    );
    v.check(
      "banner reports Bluetooth off",
      useMeshStateStore.getState().bleBlocker === "adapter-off",
      `blocker: ${useMeshStateStore.getState().bleBlocker}`,
    );

    os.setBluetooth(true);
    await os.advance(3000);

    v.check(
      "process survived the switch-on",
      os.crashed === null,
      os.crashed ?? undefined,
    );
    v.check("scanning came back on its own", native.scanning);
    v.check("advertising came back on its own", native.advertising);
    v.check(
      "banner is clear again",
      useMeshStateStore.getState().bleBlocker === "none",
      `blocker: ${useMeshStateStore.getState().bleBlocker}`,
    );
    v.assert();
  });

  test("S12 Bluetooth toggled while the JS runtime is not available", async () => {
    // Two real windows in one: the receiver is live from initialize(), which
    // runs before the JS bundle has finished loading, and Android leaves the app
    // in the same state when it destroys the Activity while the foreground
    // service keeps the process, the case the app's mount path describes.
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S12",
      "BT toggled during launch, before the JS bundle has loaded",
      os,
    );
    const native = new AndroidBleModule(os);
    installNativeBle(native);
    native.initialize();
    // Note: bootJsRuntime() has NOT been called. The app is on the splash screen.

    os.setBluetooth(false);
    await os.advance(300);

    v.check(
      "toggling Bluetooth during launch does not kill the app",
      os.crashed === null,
      os.crashed !== null
        ? `emitEvent() reached JS with no runtime attached. It must return early (hasActiveReactInstance) and catch, because BroadcastReceiver.onReceive is the main thread and an uncaught throw there is process death. ${os.crashed}`
        : undefined,
    );
    v.assert();
  });

  test("S12b Bluetooth toggled after the React instance is destroyed", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S12b",
      "Activity destroyed, foreground service holds the process, then BT toggled",
      os,
    );
    const started = await healthyAndroid(os);
    app = started.app;
    const native = started.native;
    native.simulatePeerConnect("c:AA:BB:CC:DD:EE:01");
    await os.advance(100);

    await app.setAppState("background");
    // Android destroys the Activity and tears the React instance down; the
    // foreground service keeps the process (and this native module) alive.
    os.jsRuntimeReady = false;
    os.log("os", "REACT_INSTANCE_DESTROYED", "process kept alive by FGS");

    os.setBluetooth(false);
    await os.advance(300);

    v.check(
      "the process survives a Bluetooth toggle with no JS attached",
      os.crashed === null,
      os.crashed !== null
        ? `releaseRadioState() emits linkDisconnected for every live link; each of those must go through the guarded emitEvent(). ${os.crashed}`
        : undefined,
    );
    v.assert();
  });

  test("S13 Bluetooth flipped five times in two seconds", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S13",
      "impatient user flips the switch repeatedly",
      os,
    );
    const started = await healthyAndroid(os);
    app = started.app;
    const native = started.native;

    for (let i = 0; i < 5; i++) {
      os.setBluetooth(false);
      await os.advance(200);
      os.setBluetooth(true);
      await os.advance(200);
    }
    await os.advance(4000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check("settles with scanning on", native.scanning);
    v.check("settles with advertising on", native.advertising);
    v.check(
      "settles with an accurate banner",
      useMeshStateStore.getState().bleBlocker === "none",
      `blocker: ${useMeshStateStore.getState().bleBlocker}`,
    );
    v.assert();
  });

  test("S14 Bluetooth dies mid-conversation while a DM is being sent", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S14",
      "BT off mid-DM, nothing may be silently lost",
      os,
    );
    const started = await healthyAndroid(os);
    app = started.app;
    const native = started.native;

    native.simulatePeerConnect("c:AA:BB:CC:DD:EE:01");
    await os.advance(200);

    const mesh = getMeshService();
    const peer = "1122334455667788";

    os.setBluetooth(false);
    await os.advance(400);

    const result = mesh?.sendDm(peer, "are you still there?");
    await os.advance(500);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the message is not reported as delivered over a dead radio",
      result !== "sent",
      `sendDm returned ${String(result)}`,
    );
    v.check(
      "the message is held for retry rather than dropped",
      result === "queued" ||
        result === "needs-courier" ||
        useOutboxStore.getState().pending.length > 0,
      `outbox holds ${useOutboxStore.getState().pending.length} message(s)`,
    );
    v.assert();
  });

  test("S15 Bluetooth cycled while sitting inside a chat thread", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S15",
      "BT off then on inside a thread, link maps must be honest",
      os,
    );
    const started = await healthyAndroid(os);
    app = started.app;
    const native = started.native;

    native.simulatePeerConnect("c:AA:BB:CC:DD:EE:01");
    native.simulatePeerConnect("c:AA:BB:CC:DD:EE:02");
    await os.advance(200);

    os.setBluetooth(false);
    await os.advance(500);
    os.setBluetooth(true);
    await os.advance(3000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the peer list does not still show peers from before the outage",
      usePeerStore.getState().peers.size === 0,
      `${usePeerStore.getState().peers.size} peer(s) still listed`,
    );
    v.check("radios are back", native.scanning && native.advertising);
    v.assert();
  });

  test("S16 internet dropped (airplane mode) with Bluetooth still on", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict("S16", "WiFi/data off, Bluetooth on", os);
    const started = await healthyAndroid(os);
    app = started.app;
    const native = started.native;

    useMeshStateStore.getState().setNostrConnected(false);
    await os.advance(1000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the BLE mesh is untouched by losing the internet",
      native.scanning && native.advertising,
    );
    v.check(
      "the banner does not claim Bluetooth is off",
      useMeshStateStore.getState().bleBlocker === "none",
    );
    v.assert();
  });

  test("S17 airplane mode on then off, both transports recover unattended", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict("S17", "airplane mode round trip", os);
    const started = await healthyAndroid(os);
    app = started.app;
    const native = started.native;

    // Airplane mode takes the radio down with it.
    os.setBluetooth(false);
    useMeshStateStore.getState().setNostrConnected(false);
    await os.advance(1000);

    os.setBluetooth(true);
    await os.advance(4000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "BLE recovered without user action",
      native.scanning && native.advertising,
    );
    v.check(
      "banner is accurate",
      useMeshStateStore.getState().bleBlocker === "none",
      `blocker: ${useMeshStateStore.getState().bleBlocker}`,
    );
    v.assert();
  });

  test("S18 'Stop mesh' from the notification, then the user reopens the app", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S18",
      "Stop mesh, then reopen, there must be a way back",
      os,
    );
    const started = await healthyAndroid(os);
    app = started.app;
    const native = started.native;

    await app.setAppState("background");
    native.requestMeshStop();
    await os.advance(500);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the radios actually stopped",
      !native.scanning && !native.advertising,
    );

    // The user taps the icon again.
    await app.setAppState("active");
    await app.mount();
    await os.advance(3000);

    const presence = useMeshStateStore.getState().presenceStatus;
    // Stopping the mesh was a deliberate choice, made from outside the app.
    // Reopening must NOT quietly undo it - that would be the app overruling a
    // decision the user just made, from an event they did not trigger.
    v.check(
      "reopening does not silently restart a mesh the user stopped",
      presence === "away" && !native.scanning,
      `presence=${presence}, scanning=${native.scanning}`,
    );
    v.check(
      "the background service is released, so no notification outlives the mesh",
      !os.foregroundServiceRunning,
    );
    // What it must do instead is offer the way back where the user is looking.
    const paused = computeMeshBanners({
      presenceStatus: presence,
      bleBlocker: useMeshStateStore.getState().bleBlocker,
      locationGranted: true,
      nostrConnected: false,
      torActive: false,
      gatewayEnabled: false,
      bridgeActive: false,
      bridgePeopleAcross: 0,
      internetEnabled: true,
      peerCount: 0,
    });
    v.check(
      "the Mesh tab offers a one-tap Resume rather than burying it in Profile",
      paused[0]?.key === "paused" && paused[0]?.action?.kind === "resume",
      `banner: ${JSON.stringify(paused[0])}`,
    );

    // And that button works.
    applyPresence("online", "tester");
    await os.advance(3000);
    v.check(
      "tapping Resume brings the mesh back",
      native.scanning && native.advertising,
    );
    v.check("and the background service with it", os.foregroundServiceRunning);
    v.assert();
  });

  test("S19 Invisible presence must keep relaying in the background", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S19",
      "Invisible: scan and relay, just don't advertise",
      os,
    );
    const started = await healthyAndroid(os);
    app = started.app;
    const native = started.native;

    applyPresence("invisible", "tester");
    await os.advance(500);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check("advertising stopped, as Invisible means", !native.advertising);
    v.check("scanning continues, as Invisible means", native.scanning);
    v.check(
      "the mesh still survives backgrounding while Invisible",
      os.foregroundServiceRunning,
      "setDiscoverable(false) calls stopAdvertising(), and AirhopBLEModule.kt:346 tears the foreground service down inside it, so choosing Invisible silently gives up background operation for a mesh that is still meant to be scanning and relaying",
    );

    applyPresence("online", "tester");
    await os.advance(500);
    v.check("coming back to Online restores advertising", native.advertising);
    v.assert();
  });

  test("S20 Activity destroyed and remounted while the mesh is healthy", async () => {
    const os = new DeviceOS({ platform: "android", apiLevel: 34 });
    const v = new Verdict(
      "S20",
      "Activity recreated, mesh must not be disturbed",
      os,
    );
    const started = await healthyAndroid(os);
    app = started.app;
    const native = started.native;
    native.simulatePeerConnect("c:AA:BB:CC:DD:EE:01");
    await os.advance(200);

    // Configuration change / Activity recreation: React remounts, the mesh
    // singleton and the native module survive.
    await app.mount();
    await os.advance(1000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "the healthy mesh was not torn down and rebuilt",
      native.scanning && native.advertising,
    );
    v.check(
      "no duplicate foreground service churn",
      os.foregroundServiceRunning,
    );
    v.assert();
  });

  // iOS: the same chaos, against CoreBluetooth.

  test("S11i iOS: Bluetooth toggled off then on", async () => {
    const os = new DeviceOS({ platform: "ios" });
    const v = new Verdict("S11i", "iOS: BT off then on mid-session", os);
    const native = new IosBleModule(os);
    installNativeBle(native);
    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();
    await os.advance(300);

    native.simulatePeerConnect("c:PERIPHERAL-UUID-1");
    await os.advance(100);
    const advertisingBefore = native.advertising;

    os.setBluetooth(false);
    await os.advance(600);
    os.setBluetooth(true);
    await os.advance(5000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check("was advertising before the toggle", advertisingBefore);
    v.check(
      "advertising comes back after Bluetooth returns",
      native.advertising,
      "peripheralManagerDidUpdateState (AirhopBLEModule.swift:467) returns early for every state that is not poweredOn, so poweredOff never clears isAdvertising. When poweredOn arrives, `if isAdvertising { return }` at :469 skips rebuilding the service, the device is invisible to every peer until the app is force-quit",
    );
    v.check("scanning comes back after Bluetooth returns", native.scanning);
    v.check(
      "stale links from before the outage were retired",
      native.staleLinkCount() === 0,
      `${native.staleLinkCount()} link(s) still in centralLinks referencing a dead manager; JS was never told, so writes to them are silently discarded by CoreBluetooth`,
    );
    v.assert();
  });

  test("S21i iOS: CoreBluetooth managers must not be reallocated forever", async () => {
    // Not one of the twenty; found by the harness while running S07i and worth
    // its own case.
    const os = new DeviceOS({ platform: "ios" });
    const v = new Verdict(
      "S21i",
      "an idle, perfectly healthy iPhone left alone for ten seconds",
      os,
    );
    const native = new IosBleModule(os);
    installNativeBle(native);
    app = new AppShell({ os });
    app.bootJsRuntime();
    await app.startMeshWithPermissions();

    // Nothing happens. Nobody touches the phone.
    await os.advance(10_000);

    v.check("process survived", os.crashed === null, os.crashed ?? undefined);
    v.check(
      "a quiet device allocates a bounded number of CBCentralManagers",
      native.centralManagersCreated <= 2,
      `${native.centralManagersCreated} created in 10s. Every centralManagerDidUpdateState emits adapterStateChanged (AirhopBLEModule.swift:314); mesh-service treats that as a radio change and schedules retryRadios (mesh-service.ts:813); retryRadios calls startScanning, which constructs ANOTHER CBCentralManager (:130), which fires didUpdateState... The loop runs every ADAPTER_SETTLE_MS (700ms) for as long as the app is open`,
    );
    v.check(
      "a quiet device allocates a bounded number of CBPeripheralManagers",
      native.peripheralManagersCreated <= 2,
      `${native.peripheralManagersCreated} created in 10s, each reusing the same CBPeripheralManagerOptionRestoreIdentifierKey`,
    );
    v.assert();
  });
});
