// AirhopBLEModule: dual-role BLE GATT server + central for Airhop mesh.
//
// Mirrors the iOS AirhopBLEModule.swift contract exactly. Four operations:
//   1. Advertise as a GATT Server with the Airhop service UUID.
//   2. Scan as a GATT Central for peers advertising the same UUID.
//   3. Accept incoming writes and emit them to TypeScript as events.
//   4. Write raw bytes from TypeScript to connected GATT peripherals.
//
// Protocol logic lives in TypeScript (src/core/). This file has no knowledge
// of packet types, routing, or encryption.
package org.onemindlabs.airhop.ble

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCallback
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothGattDescriptor
import android.bluetooth.BluetoothGattServer
import android.bluetooth.BluetoothGattServerCallback
import android.bluetooth.BluetoothGattService
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.bluetooth.BluetoothStatusCodes
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.app.Activity
import android.content.pm.PackageManager
import android.location.LocationManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.BatteryManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.ParcelUuid
import android.provider.Settings
import android.util.Base64
import android.util.Log
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.onemindlabs.airhop.service.AirhopForegroundService
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

private const val TAG = "AirhopBLEModule"

// BLE constants per PROTOCOLS.md - must never change without a version bump.
private val SERVICE_UUID         = UUID.fromString("F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C")
private val CHARACTERISTIC_UUID  = UUID.fromString("A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D")
// Standard CCCD descriptor UUID required for BLE notifications
private val CCCD_UUID            = UUID.fromString("00002902-0000-1000-8000-00805F9B34FB")

// Event names emitted to TypeScript
private const val EVT_PACKET_RECEIVED   = "AirhopBLE.packetReceived"
private const val EVT_LINK_CONNECTED    = "AirhopBLE.linkConnected"
private const val EVT_LINK_DISCONNECTED = "AirhopBLE.linkDisconnected"
private const val EVT_RSSI_UPDATED      = "AirhopBLE.rssiUpdated"
// Bluetooth radio turned on/off at the OS level. Without this the UI cannot
// tell "Bluetooth is off" apart from "nobody is nearby". Both look like an
// empty peer list, which is impossible for a user to diagnose.
private const val EVT_ADAPTER_STATE     = "AirhopBLE.adapterStateChanged"
// The platform refused a scan after startScan() returned cleanly. Without it
// the reconciler believes it is scanning and never retries.
private const val EVT_SCAN_FAILED       = "AirhopBLE.scanFailed"
// The user tapped "Stop mesh" on the background notification. Handled in JS so
// the shutdown is the same one the Status picker performs.
private const val EVT_MESH_STOP_REQUESTED = "AirhopBLE.meshStopRequested"

// The VPN transport went away, or came back. Emitted only while Tor is on (see
// startVpnWatch). Unprefixed, unlike the events above, because JS subscribes to
// them by these exact names.
private const val EVT_VPN_LOST      = "onVpnLost"
private const val EVT_VPN_AVAILABLE = "onVpnAvailable"

// Orbot SOCKS5 proxy defaults (Tor via Orbot, per ARCHITECTURE.md section 9).
// Phase 1: detect existing Orbot session. Phase 2: embedded tor binary.
private const val ORBOT_SOCKS5_PORT       = 9050
private const val ORBOT_PROBE_TIMEOUT_MS  = 500

// Request code for the system "turn Bluetooth on?" dialog, so the Mesh banner
// can offer a button rather than instructions.
private const val REQUEST_ENABLE_BT = 0xB1E

// Ceiling on simultaneous central-role (GATT client) links.
//
// Matches bitchat-ios TransportConfig.bleMaxCentralLinks = 6. This is a
// hardware limit dressed up as a policy: an Android controller typically
// supports around seven concurrent GATT client connections, and connectGatt
// past that fails with status 133. Without a cap, a phone in a crowded room
// tries to dial every advertiser it sees, fails most of them, and retries on
// every scan callback - which burns the radio, drains the battery and
// destabilises the links that DID connect. Refusing the dial is strictly better
// than making it and losing it.
//
// The mesh does not need every peer to be a direct neighbour: flood routing
// with TTL 7 reaches the rest of the room through the six it has.
private const val MAX_CENTRAL_LINKS = 6

// How hard to run the radios.
//
// Mechanism only - the decision lives in TypeScript (services/power-policy.ts),
// which is where "whether to run the radios at all" already lives and where it
// can be unit tested. This enum is the vocabulary the two sides share, and the
// numbers are the ones bitchat-android's PowerProfileResolver arrived at.
//
// The five knobs move together on purpose. A duty-cycled LOW_POWER scan next to
// a LOW_LATENCY advertise at full TX power saves almost nothing: the advertiser
// is transmitting continuously either way. Battery is only won by turning all of
// them down at once.
private enum class PowerMode(
    val scanMode: Int,
    val advertiseMode: Int,
    val txPower: Int,
    val rssiIntervalMs: Long,
    // Zero means "scan continuously". Otherwise the scanner runs for scanOnMs
    // and then sleeps for scanOffMs, which is where nearly all of the saving in
    // the background comes from.
    val scanOnMs: Long,
    val scanOffMs: Long,
) {
    PERFORMANCE(
        ScanSettings.SCAN_MODE_LOW_LATENCY,
        AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY,
        AdvertiseSettings.ADVERTISE_TX_POWER_HIGH,
        5_000L, 0L, 0L,
    ),
    BALANCED(
        ScanSettings.SCAN_MODE_BALANCED,
        AdvertiseSettings.ADVERTISE_MODE_BALANCED,
        AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM,
        10_000L, 0L, 0L,
    ),
    POWER_SAVER(
        ScanSettings.SCAN_MODE_LOW_POWER,
        AdvertiseSettings.ADVERTISE_MODE_LOW_POWER,
        AdvertiseSettings.ADVERTISE_TX_POWER_LOW,
        30_000L, 2_000L, 28_000L,
    ),
    ULTRA_LOW_POWER(
        ScanSettings.SCAN_MODE_LOW_POWER,
        AdvertiseSettings.ADVERTISE_MODE_LOW_POWER,
        AdvertiseSettings.ADVERTISE_TX_POWER_ULTRA_LOW,
        60_000L, 1_000L, 29_000L,
    );

    companion object {
        // Unknown names fall back to BALANCED rather than throwing. A bad string
        // is a bug in the caller, and taking the mesh down over it would turn a
        // typo into an outage.
        fun fromName(name: String): PowerMode = when (name) {
            "performance" -> PERFORMANCE
            "balanced" -> BALANCED
            "power-saver" -> POWER_SAVER
            "ultra-low-power" -> ULTRA_LOW_POWER
            else -> BALANCED
        }
    }
}

// The ATT MTU every BLE connection starts on, before negotiation. Only 20 bytes
// of it are usable by an unacknowledged write, so before onMtuChanged answers
// nothing but the smallest frames go out unacknowledged.
private const val DEFAULT_ATT_MTU = 23

// ATT write-command header: one byte opcode plus a two-byte handle. The usable
// payload of a write without response is MTU minus this.
private const val ATT_WRITE_OVERHEAD = 3

// The largest frame this app puts on the radio, mirroring MAX_BLE_FRAME in
// core/mesh/fragment-manager.ts. Ceiling on long-write reassembly: a peer that
// keeps preparing chunks past this must not grow the buffer to meet it.
private const val MAX_BLE_FRAME = 512

// How far the battery must move before it is worth telling JS about. Android
// delivers ACTION_BATTERY_CHANGED on every 1% step; forwarding all of them would
// be a bridge crossing per percent for a decision whose thresholds are ten
// points apart.
private const val BATTERY_REPORT_STEP = 5

// The OS Bluetooth radio state, and now also the battery.
private const val EVT_POWER_STATE = "AirhopBLE.powerStateChanged"

class AirhopBLEModule(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AirhopBLE"

    // Both of these are nullable and both are resolved lazily.
    //
    // They used to be non-null `val`s initialised in the constructor. The module
    // is built eagerly by AirhopBLEPackage.createNativeModules, i.e. during
    // ReactHost construction, so on a device with no Bluetooth radio - or an
    // adapter mid-reset - Kotlin's intrinsic null check threw there, before any
    // Airhop code ran and with nothing above it to catch. The app did not fail
    // to find peers; it failed to launch.
    private val bluetoothManager: BluetoothManager? by lazy {
        try {
            reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
        } catch (e: Exception) {
            Log.w(TAG, "BluetoothManager unavailable: ${e.message}")
            null
        }
    }

    private val adapter: BluetoothAdapter?
        get() = try {
            bluetoothManager?.adapter
        } catch (e: Exception) {
            null
        }

    // GATT server (peripheral role)
    private var gattServer: BluetoothGattServer? = null
    private var characteristic: BluetoothGattCharacteristic? = null

    // link maps: linkID -> connection object
    // Peripheral-role links are remote devices that connected to our GATT server.
    private val peripheralLinks = ConcurrentHashMap<String, BluetoothDevice>()
    // Central-role links are GATT clients we connected to as central.
    private val centralLinks    = ConcurrentHashMap<String, BluetoothGatt>()
    // Negotiated ATT MTU per central link. A write without response cannot
    // exceed MTU-3, and the stack truncates rather than refusing, so a frame
    // over that budget used to leave the link silently mangling every fragment
    // of a transfer. Recorded here so the write path can pick a type that can
    // actually carry the frame. Absent means negotiation has not answered yet,
    // in which case the BLE default applies.
    private val centralMtu = ConcurrentHashMap<String, Int>()

    // Advertised peerIDs (hex) we already have (or are opening) a central link
    // to, so a repeated scan callback, or the same peer under a rotated MAC,
    // never opens a duplicate link. Mirrors bitchat's peerID-in-scan-response
    // dedup (BluetoothGattClientManager.handleScanResult).
    private val centralPeerIDs = ConcurrentHashMap.newKeySet<String>()
    private val linkToAdvertisedPeerID = ConcurrentHashMap<String, String>()

    // In-flight ATT long writes, one per peripheral-role link. Only the EXECUTE
    // turns the accumulated bytes into a packet.
    private val preparedWrites = ConcurrentHashMap<String, PreparedWrite>()

    private class PreparedWrite {
        val buffer = java.io.ByteArrayOutputStream(MAX_BLE_FRAME)
        // Sticky: once a chunk is refused the reassembly is unusable and the
        // EXECUTE must not commit a frame with a hole in it.
        var failed = false
        val length: Int get() = buffer.size()
    }

    // Our own peerID hex (16 chars), advertised as 8-byte scan-response service
    // data so remote scanners can identify and de-dup us before connecting.
    private var localPeerIDHex: String = ""

    // Used to post the MTU request off the GATT callback thread after a short
    // settle delay (a request issued synchronously inside onConnectionStateChange
    // is unreliable on many controllers).
    private val mainHandler = Handler(Looper.getMainLooper())

    // ---- Device monitoring ---------------------------------------------------
    //
    // BLE connection slots are scarce: an Android controller manages roughly
    // seven simultaneous GATT client connections and refuses the rest with
    // status 133. A slot held by something that will not talk is a neighbour we
    // cannot reach.
    //
    // Three failure modes from bitchat-android's DeviceMonitoringManager
    // (docs/device_manager.md), each of which looks healthy to the adapter:
    // a device that connects and never speaks, one that goes silent mid-session
    // (BLE supervision timeouts are long), and one that disconnects with an
    // error repeatedly.
    //
    // Lives in native rather than TypeScript because it is about connection
    // lifetime and needs no knowledge of packets. "Did any byte arrive" is
    // enough to tell a peer from a prober, so no protocol logic moves down
    // here.

    // Silence allowed after a link comes up before we conclude nothing is
    // coming. A real peer announces within a few seconds (announce-manager's
    // isolated interval is ~4s), so 15s is generous.
    private val firstTrafficDeadlineMs = 15_000L

    // Silence allowed mid-session. Matches the mesh's 60s reachability window:
    // past it the peer is already considered gone upstairs, so the slot is held
    // for a peer nobody believes in.
    private val inactivityTimeoutMs = 60_000L

    // Error disconnects, and the window they must fall inside, before a device
    // is refused. Five in five minutes is not a flaky radio but a device that
    // cannot hold a link, and each retry costs a slot.
    private val errorLimit = 5
    private val errorWindowMs = 5 * 60_000L
    private val blockDurationMs = 15 * 60_000L

    // linkID -> last moment we heard anything from that device. Seeded when the
    // link opens, so silence is measured from connect rather than from a first
    // byte that may never come.
    private val lastHeardAt = ConcurrentHashMap<String, Long>()
    // Links that have produced at least one inbound frame. The distinction
    // matters: a device that has never spoken gets the short deadline, and one
    // that spoke and then stopped gets the long one.
    private val everSpoke = ConcurrentHashMap.newKeySet<String>()
    // MAC -> timestamps of recent error disconnects, newest last.
    private val errorHistory = ConcurrentHashMap<String, MutableList<Long>>()
    // MAC -> when the block expires.
    private val blockedUntil = ConcurrentHashMap<String, Long>()

    private var monitorTask: Runnable? = null

    private fun isBlocked(address: String): Boolean {
        val until = blockedUntil[address] ?: return false
        if (System.currentTimeMillis() >= until) {
            // Blocks expire on their own. A device broken an hour ago may be
            // fine now, and a permanent blocklist would shrink the mesh for
            // reasons nobody can see.
            blockedUntil.remove(address)
            errorHistory.remove(address)
            return false
        }
        return true
    }

    private fun noteTraffic(linkID: String) {
        lastHeardAt[linkID] = System.currentTimeMillis()
        everSpoke.add(linkID)
    }

    private fun noteLinkOpened(linkID: String) {
        // Seeded at open so the first-traffic deadline is measured from the
        // moment the link came up, not from the first byte that never arrives.
        lastHeardAt[linkID] = System.currentTimeMillis()
        everSpoke.remove(linkID)
    }

    private fun noteLinkClosed(linkID: String, status: Int) {
        lastHeardAt.remove(linkID)
        everSpoke.remove(linkID)
        if (status == BluetoothGatt.GATT_SUCCESS) return
        val address = linkID.substringAfter(':')
        val now = System.currentTimeMillis()
        val history = errorHistory.getOrPut(address) { mutableListOf() }
        synchronized(history) {
            history.removeAll { now - it > errorWindowMs }
            history.add(now)
            if (history.size >= errorLimit) {
                blockedUntil[address] = now + blockDurationMs
                history.clear()
                Log.w(TAG, "Blocking $address: $errorLimit error disconnects in window")
            }
        }
    }

    // Drop links that have gone quiet. Runs on the main handler rather than a
    // timer of its own so it stops with the module.
    private fun startDeviceMonitor() {
        if (monitorTask != null) return
        val task = object : Runnable {
            override fun run() {
                val now = System.currentTimeMillis()
                for ((linkID, heardAt) in lastHeardAt) {
                    val silentFor = now - heardAt
                    // A device that has never spoken is a prober and gets the
                    // short window. One that spoke and then stopped is a peer
                    // that walked away, and gets the 60s reachability window
                    // before its slot is reclaimed.
                    val limit =
                        if (everSpoke.contains(linkID)) inactivityTimeoutMs
                        else firstTrafficDeadlineMs
                    if (silentFor > limit) {
                        Log.d(TAG, "Reaping $linkID after ${silentFor}ms of silence")
                        disconnectLink(linkID)
                    }
                }
                mainHandler.postDelayed(this, 5_000L)
            }
        }
        monitorTask = task
        mainHandler.postDelayed(task, 5_000L)
    }

    private fun stopDeviceMonitor() {
        monitorTask?.let { mainHandler.removeCallbacks(it) }
        monitorTask = null
        // Silence timers are meaningless with nothing watching them; the error
        // history and blocklist are NOT cleared here, so a device that has been
        // misbehaving does not get a clean slate from a scan restart.
        lastHeardAt.clear()
        everSpoke.clear()
    }

    private fun disconnectLink(linkID: String) {
        lastHeardAt.remove(linkID)
        // Or a device that spoke once, went quiet, was reaped, and reconnected
        // would inherit the long deadline instead of proving itself again.
        everSpoke.remove(linkID)
        preparedWrites.remove(linkID)
        try {
            centralLinks.remove(linkID)?.let {
                it.disconnect()
                it.close()
            }
            peripheralLinks.remove(linkID)?.let { device ->
                gattServer?.cancelConnection(device)
            }
        } catch (e: SecurityException) {
            Log.e(TAG, "BLUETOOTH_CONNECT permission missing", e)
        }
        linkToAdvertisedPeerID.remove(linkID)?.let { centralPeerIDs.remove(it) }
        emitEvent(EVT_LINK_DISCONNECTED, WritableNativeMap().apply {
            putString("linkID", linkID)
        })
    }

    // Everything the monitor knows is per session. The panic wipe clears it
    // along with the rest, so a blocked device is not remembered across one.
    private fun resetDeviceMonitoring() {
        lastHeardAt.clear()
        everSpoke.clear()
        errorHistory.clear()
        blockedUntil.clear()
    }

    private var listenerCount = 0

    // Watches the OS Bluetooth toggle so the UI can report "Bluetooth off"
    // instead of silently showing an empty mesh forever.
    // The last state we told JS about, so an unchanged report is never sent
    // twice. On its own this is a small economy; combined with the reconciler in
    // radio-controller.ts it is what makes an adapter event unable to trigger a
    // restart that triggers another adapter event.
    @Volatile
    private var lastReportedEnabled: Boolean? = null

    // Current radio effort. Starts BALANCED so a mesh that comes up before JS
    // has said anything is already not running flat out.
    @Volatile
    private var powerMode: PowerMode = PowerMode.BALANCED

    // Latest battery reading, and the last one we reported.
    @Volatile
    private var batteryPercent: Int = -1
    @Volatile
    private var charging: Boolean = false
    @Volatile
    private var lastReportedBattery: Int = -1
    @Volatile
    private var lastReportedCharging: Boolean? = null

    private val batteryReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action != Intent.ACTION_BATTERY_CHANGED) return
            val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
            val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
            if (level < 0 || scale <= 0) return
            val percent = (level * 100) / scale
            val status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
            val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                status == BatteryManager.BATTERY_STATUS_FULL

            batteryPercent = percent
            charging = isCharging

            // Only speak up when the number has moved enough to possibly change
            // a decision, or the charger went in or out. No policy here - the
            // thresholds that matter live in TypeScript - only a filter on how
            // chatty this gets.
            val movedEnough =
                lastReportedBattery < 0 ||
                    kotlin.math.abs(percent - lastReportedBattery) >= BATTERY_REPORT_STEP
            if (!movedEnough && lastReportedCharging == isCharging) return
            lastReportedBattery = percent
            lastReportedCharging = isCharging
            emitEvent(EVT_POWER_STATE, WritableNativeMap().apply {
                putInt("batteryPercent", percent)
                putBoolean("charging", isCharging)
            })
        }
    }

    private val adapterStateReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action != BluetoothAdapter.ACTION_STATE_CHANGED) return
            val state = intent.getIntExtra(
                BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR,
            )
            when (state) {
                BluetoothAdapter.STATE_ON -> emitAdapterState(true)
                // Tear down on TURNING_OFF rather than waiting for OFF. By the
                // time OFF arrives the stack has already invalidated every
                // handle we hold, and any call we make in between is rejected
                // as API misuse. Getting our own state retired first means JS
                // stops addressing dead links immediately.
                BluetoothAdapter.STATE_TURNING_OFF -> {
                    releaseRadioState()
                    emitAdapterState(false)
                }
                BluetoothAdapter.STATE_OFF -> {
                    releaseRadioState()
                    emitAdapterState(false)
                }
                // STATE_TURNING_ON is deliberately not reported: the radio
                // cannot accept work yet, and saying "on" here would invite a
                // scan the stack silently drops.
            }
        }
    }

    // Registered in initialize(), NOT in init{}.
    //
    // init{} runs inside createNativeModules, during ReactHost construction,
    // before the JS bundle has loaded. A Bluetooth toggle in that window reached
    // emitEvent() with no runtime to receive it, which threw
    // IllegalStateException on the main thread - the thread a BroadcastReceiver
    // is delivered on, with nothing above it to catch. That was a hard crash on
    // the splash screen, and the same path fired again whenever Android
    // destroyed the Activity while the foreground service kept the process.
    //
    // initialize() runs once the catalyst instance exists. The guards in
    // emitEvent() cover the rest, because "a runtime exists" can stop being true
    // between the check and the call.
    override fun initialize() {
        super.initialize()
        registerAdapterReceiver()
        reactContext.addActivityEventListener(activityEventListener)
        live = this
    }

    // Outstanding requestEnableBluetooth() promise, resolved from the activity
    // result below. Held under `synchronized(this)` because the promise is
    // created on the native-modules thread and settled on the main thread.
    private var pendingEnablePromise: Promise? = null

    private val activityEventListener: ActivityEventListener =
        object : BaseActivityEventListener() {
            // `activity` is non-null in this overload: BaseActivityEventListener
            // declares it that way, and the nullable-Activity variant is the
            // deprecated two-arg form. Getting this wrong is a silent no-op at
            // runtime rather than a crash - the method simply never overrides
            // anything and is never called - so the compiler catching it is the
            // only signal there would have been.
            override fun onActivityResult(
                activity: Activity,
                requestCode: Int,
                resultCode: Int,
                data: Intent?,
            ) {
                if (requestCode != REQUEST_ENABLE_BT) return
                // Trust the adapter, not the result code. Some OEM dialogs
                // report RESULT_CANCELED while still enabling the radio, and a
                // "no" that actually turned Bluetooth on would leave the banner
                // telling the user to do something they have already done.
                resolvePendingEnable(adapter?.isEnabled == true)
            }
        }

    @Volatile
    private var receiverRegistered = false

    private fun registerAdapterReceiver() {
        if (receiverRegistered) return
        try {
            // NOT_EXPORTED: this only ever listens to a protected system
            // broadcast, so nothing outside the app has any business reaching
            // it. Required to be explicit from API 34 on, and ContextCompat
            // makes it a no-op below that.
            ContextCompat.registerReceiver(
                reactContext,
                adapterStateReceiver,
                IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED),
                ContextCompat.RECEIVER_NOT_EXPORTED,
            )
            // ACTION_BATTERY_CHANGED is a protected system broadcast and is
            // sticky, so registering returns the current level immediately -
            // no first-reading gap to work around.
            ContextCompat.registerReceiver(
                reactContext,
                batteryReceiver,
                IntentFilter(Intent.ACTION_BATTERY_CHANGED),
                ContextCompat.RECEIVER_NOT_EXPORTED,
            )
            receiverRegistered = true
        } catch (e: Exception) {
            Log.e(TAG, "Could not register Bluetooth state receiver", e)
        }
    }

    // Apply a radio effort level. Restarts the scan, because ScanSettings are
    // fixed for the life of a scan and there is no way to retune one in place.
    // Only ever called on an actual change (PowerPolicy sees to that), so the
    // restart is rare rather than per-battery-tick.
    @ReactMethod
    fun setPowerMode(mode: String, promise: Promise) {
        val next = PowerMode.fromName(mode)
        if (next == powerMode) {
            promise.resolve(null)
            return
        }
        powerMode = next
        Log.d(TAG, "Power mode -> $next")
        try {
            // Re-advertise at the new rate/power, if we were advertising.
            if (advertisingActive) {
                adapter?.bluetoothLeAdvertiser?.stopAdvertising(advertiseCallback)
                beginAdvertising()
            }
            // Re-scan under the new settings and duty cycle, if we were scanning.
            if (scanningRequested) {
                stopScanCycle()
                beginScanCycle()
            }
            promise.resolve(null)
        } catch (e: SecurityException) {
            promise.reject("PERMISSION_DENIED", "Bluetooth permission missing", e)
        } catch (e: Exception) {
            promise.reject("BLE_ERROR", "Failed to apply power mode: ${e.message}", e)
        }
    }

    // ---- Duty-cycled scanning -------------------------------------------------
    //
    // In the low-power modes the scanner runs in bursts instead of continuously:
    // a couple of seconds on, half a minute off. That is where nearly all of the
    // background saving comes from, and it is invisible above this line - JS
    // asked for "scanning", and scanning is what it gets, at whatever rate the
    // current mode affords.
    //
    // Deliberately NOT reported as a link or adapter change: a peer discovered
    // in the next burst behaves exactly as one discovered a moment later under a
    // continuous scan, and telling JS the radio stopped would have the
    // reconciler try to "fix" a state that is working as intended.

    @Volatile
    private var scanningRequested = false
    @Volatile
    private var scanBurstActive = false

    private val scanBurstToggle = object : Runnable {
        override fun run() {
            if (!scanningRequested) return
            if (scanBurstActive) {
                stopPlatformScan()
                mainHandler.postDelayed(this, powerMode.scanOffMs)
            } else {
                startPlatformScan()
                mainHandler.postDelayed(this, powerMode.scanOnMs)
            }
        }
    }

    private fun beginScanCycle() {
        // Idempotent: the same Runnable can sit in the queue twice, and two
        // toggles run the scanner at double rate, which is the fastest way to
        // reach the platform scan-start throttle.
        mainHandler.removeCallbacks(scanBurstToggle)
        scanningRequested = true
        startPlatformScan()
        // Continuous modes never schedule a toggle, so there is no timer to pay
        // for when the app is on screen.
        if (powerMode.scanOnMs > 0L) {
            mainHandler.postDelayed(scanBurstToggle, powerMode.scanOnMs)
        }
    }

    private fun stopScanCycle() {
        scanningRequested = false
        mainHandler.removeCallbacks(scanBurstToggle)
        stopPlatformScan()
    }

    private fun startPlatformScan() {
        if (scanBurstActive) return
        val scanner = adapter?.bluetoothLeScanner ?: return
        try {
            val filter = ScanFilter.Builder()
                .setServiceUuid(ParcelUuid(SERVICE_UUID))
                .build()
            val settings = ScanSettings.Builder()
                .setScanMode(powerMode.scanMode)
                .build()
            scanner.startScan(listOf(filter), settings, scanCallback)
            scanBurstActive = true
        } catch (e: SecurityException) {
            Log.e(TAG, "BLUETOOTH_SCAN permission missing", e)
        } catch (e: Exception) {
            Log.w(TAG, "startScan failed: ${e.message}")
        }
    }

    private fun stopPlatformScan() {
        if (!scanBurstActive) return
        scanBurstActive = false
        try {
            adapter?.bluetoothLeScanner?.stopScan(scanCallback)
        } catch (e: Exception) {
            // Adapter went away underneath us; the scan is gone either way.
        }
    }

    // The JS runtime backing this module is going away (the app is being torn
    // down, or Metro is reloading). Everything below is driven from TypeScript,
    // so without JS the radios have nobody to hand packets to and the "mesh
    // active" notification is claiming something that is no longer true. Leaving
    // them up burns battery and, worse, makes the app look wedged on reopen -
    // an ongoing notification over a mesh that can't answer.
    override fun invalidate() {
        if (receiverRegistered) {
            try {
                reactContext.unregisterReceiver(adapterStateReceiver)
            } catch (e: Exception) {
                // Already unregistered, or context torn down first.
            }
            try {
                reactContext.unregisterReceiver(batteryReceiver)
            } catch (e: Exception) {
                // Already unregistered, or context torn down first.
            }
            receiverRegistered = false
        }
        try {
            reactContext.removeActivityEventListener(activityEventListener)
        } catch (e: Exception) {
            // Context already torn down.
        }
        // Otherwise the callback outlives the module and eventually trips the
        // per-app callback limit.
        stopVpnWatch()
        // Anyone still waiting on the enable dialog will never hear back
        // otherwise, and an unresolved promise is a UI stuck on a spinner.
        resolvePendingEnable(false)
        stopRssiPolling()
        stopScanCycle()
        // Blocklists and silence timers are per session. A module going away
        // takes them with it, so a wiped or restarted app starts clean.
        stopDeviceMonitor()
        resetDeviceMonitoring()
        preparedWrites.clear()
        advertisingActive = false
        try {
            adapter?.bluetoothLeScanner?.stopScan(scanCallback)
            adapter?.bluetoothLeAdvertiser?.stopAdvertising(advertiseCallback)
            gattServer?.close()
            gattServer = null
            characteristic = null
            AirhopForegroundService.stop(reactContext)
        } catch (e: Exception) {
            Log.w(TAG, "BLE teardown on invalidate failed: ${e.message}")
        }
        lastReportedEnabled = null
        if (live === this) live = null
        super.invalidate()
    }

    // Drop everything the OS has already invalidated when Bluetooth is switched
    // off, so a re-enable starts from a clean slate.
    //
    // Android tears the GATT server and every connection down with the adapter,
    // but our handles stay non-null and look alive. Without this, `startAdvertising`
    // on the way back would hit `setupGattServer`'s `gattServer != null` guard,
    // return early, and advertise against a server that no longer exists: peers
    // discover us and every write then fails. That is the "Bluetooth came back
    // but nothing works until I restart the app" case.
    //
    // Links are announced as disconnected before the maps are cleared, so JS
    // stops addressing them immediately rather than discovering they are gone
    // one failed write at a time.
    private fun releaseRadioState() {
        for (linkID in peripheralLinks.keys + centralLinks.keys) {
            emitEvent(EVT_LINK_DISCONNECTED, WritableNativeMap().apply {
                putString("linkID", linkID)
            })
        }
        stopRssiPolling()
        // The adapter took the scan and the advertiser down with it, so the
        // duty-cycle timer has nothing left to toggle. Cancelling it here is
        // what stops a burst firing against a dead radio on the way out.
        stopScanCycle()
        advertisingActive = false
        for (gatt in centralLinks.values) {
            try {
                gatt.close()
            } catch (e: Exception) {
                Log.w(TAG, "GATT close during adapter-off failed: ${e.message}")
            }
        }
        centralLinks.clear()
        peripheralLinks.clear()
        centralPeerIDs.clear()
        linkToAdvertisedPeerID.clear()
        preparedWrites.clear()
        try {
            gattServer?.close()
        } catch (e: Exception) {
            Log.w(TAG, "GATT server close during adapter-off failed: ${e.message}")
        }
        gattServer = null
        characteristic = null
    }

    // Only ever announce a CHANGE. Re-announcing the current state is what let a
    // state callback become a restart become another state callback.
    private fun emitAdapterState(enabled: Boolean) {
        if (lastReportedEnabled == enabled) return
        lastReportedEnabled = enabled
        emitEvent(EVT_ADAPTER_STATE, WritableNativeMap().apply {
            putBoolean("enabled", enabled)
        })
    }

    // Everything the device will tell us about whether BLE can run right now.
    //
    // Replaces isAdapterEnabled(), which answered one quarter of the question.
    // On Android the rest is what actually bites: on API <=30 a granted scan
    // permission with the OS location toggle off produces a scan that starts
    // cleanly, reports no error, and returns results to nobody. That was
    // indistinguishable from "nobody is nearby" and had no banner, so the radar
    // span forever.
    @ReactMethod
    fun getRadioState(promise: Promise) {
        val result = WritableNativeMap()
        val bt = adapter
        val locationGates = locationRequiredForScan()

        result.putBoolean("supported", bt != null)
        result.putBoolean(
            "poweredOn",
            try {
                bt?.isEnabled == true
            } catch (e: SecurityException) {
                false
            } catch (e: Exception) {
                false
            },
        )
        result.putString("authorization", currentAuthorization())
        // Both reported literally. Whether the toggle matters is a separate
        // fact, so blockerFor decides rather than receiving a decision. Same
        // split as the power policy, and for the same reason.
        result.putBoolean("locationRequiredForScan", locationGates)
        result.putBoolean("locationServicesEnabled", locationServicesEnabled())
        result.putInt("batteryPercent", batteryPercent)
        result.putBoolean("charging", charging)
        promise.resolve(result)
    }

    private fun hasPermission(permission: String): Boolean =
        ContextCompat.checkSelfPermission(reactContext, permission) ==
            PackageManager.PERMISSION_GRANTED

    // "granted" / "denied" only. We cannot distinguish "denied once" from
    // "denied for good" without an Activity (shouldShowRequestPermissionRationale),
    // so that split is made in JS where the request result is available, and
    // reported back through the same BleBlocker the banner reads.
    //
    // Answers for what the mesh needs at this API level, which is the same list
    // utils/ble-permissions.ts requests. The two must stay in step.
    private fun currentAuthorization(): String {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // neverForLocation means location is not part of this from API 31:
            // the three Bluetooth runtime permissions are the requirement.
            val needed = listOf(
                Manifest.permission.BLUETOOTH_SCAN,
                Manifest.permission.BLUETOOTH_ADVERTISE,
                Manifest.permission.BLUETOOTH_CONNECT,
            )
            return if (needed.all(::hasPermission)) "granted" else "denied"
        }
        // API <=30: BLUETOOTH and BLUETOOTH_ADMIN are install-time normal
        // permissions and are always held, but a scan is a location access with
        // no way to say otherwise, so ACCESS_FINE_LOCATION is the runtime
        // permission the mesh is really waiting on.
        return if (hasPermission(Manifest.permission.ACCESS_FINE_LOCATION)) "granted"
        else "denied"
    }

    // Whether a BLE scan on this device counts as a location access.
    //
    // The manifest declares neverForLocation on BLUETOOTH_SCAN, which from API
    // 31 releases scanning from both the location permission and the OS toggle.
    // Neither the flag nor BLUETOOTH_SCAN exists below that, so on API <=30 a
    // scan is a location access and results are withheld without both.
    //
    // Reported to JS rather than acted on here, so services/radio-controller.ts
    // keeps deciding what blocks the mesh and stays testable without a device.
    private fun locationRequiredForScan(): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.S

    // The OS-wide location toggle, which is NOT the location permission. Only
    // load-bearing while locationRequiredForScan() is true. From API 28 there is
    // a direct query; below that the provider list is the only signal.
    private fun locationServicesEnabled(): Boolean =
        try {
            val lm = reactContext.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
            when {
                lm == null -> true
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.P -> lm.isLocationEnabled
                else ->
                    lm.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
                        lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
            }
        } catch (e: Exception) {
            // Unreadable: assume it is on rather than accusing the user of a
            // setting we could not check.
            true
        }

    // Ask the OS to turn Bluetooth on, so the Mesh banner offers a button
    // instead of instructions. Resolves true only once the adapter is actually
    // on, so the caller never reports success over a radio the user declined to
    // enable.
    @ReactMethod
    fun requestEnableBluetooth(promise: Promise) {
        val bt = adapter
        if (bt == null) {
            promise.resolve(false)
            return
        }
        if (bt.isEnabled) {
            promise.resolve(true)
            return
        }
        // From API 31 the enable dialog itself requires BLUETOOTH_CONNECT.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
            !hasPermission(Manifest.permission.BLUETOOTH_CONNECT)
        ) {
            promise.resolve(false)
            return
        }
        // Read through the context, not the module. `currentActivity` is a
        // property of ReactContext; the module does not re-expose it. Null when
        // the app has no Activity in front (backgrounded, or the Activity was
        // destroyed while a foreground service kept the process), and there is
        // nothing to show a dialog on top of in that case.
        val activity = reactContext.currentActivity
        if (activity == null) {
            promise.resolve(false)
            return
        }
        synchronized(this) {
            if (pendingEnablePromise != null) {
                // A dialog is already up; a second request would strand the
                // first promise unresolved.
                promise.resolve(false)
                return
            }
            pendingEnablePromise = promise
        }
        try {
            activity.startActivityForResult(
                Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE),
                REQUEST_ENABLE_BT,
            )
        } catch (e: Exception) {
            Log.w(TAG, "Could not show the Bluetooth enable dialog: ${e.message}")
            resolvePendingEnable(false)
        }
    }

    private fun resolvePendingEnable(enabled: Boolean) {
        val promise = synchronized(this) {
            val p = pendingEnablePromise
            pendingEnablePromise = null
            p
        }
        try {
            promise?.resolve(enabled)
        } catch (e: Exception) {
            // Already settled.
        }
    }

    // Take the user to the OS location settings. The banner offering this is the
    // only place the app can explain why an Android phone with Bluetooth on and
    // every permission granted still finds nobody.
    @ReactMethod
    fun openLocationSettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            Log.w(TAG, "Could not open location settings: ${e.message}")
            promise.resolve(false)
        }
    }

    // Hold the process up while the mesh is running.
    //
    // Split out of startAdvertising/stopAdvertising, which is where it used to
    // live. Tying it to advertising meant "Invisible" - which stops advertising
    // and keeps scanning and relaying - also ended background operation, and it
    // meant a foreground notification reading "Airhop mesh active" was raised
    // from a startAdvertising() call that had not actually started anything.
    @ReactMethod
    fun setBackgroundServiceEnabled(enabled: Boolean, promise: Promise) {
        try {
            if (enabled) {
                AirhopForegroundService.start(reactContext)
            } else {
                AirhopForegroundService.stop(reactContext)
            }
            promise.resolve(null)
        } catch (e: Exception) {
            // Typically a background-start restriction on Android 12+. The mesh
            // runs fine in the foreground either way; the reconciler retries on
            // the next resume.
            Log.w(TAG, "Foreground service ${if (enabled) "start" else "stop"} refused: ${e.message}")
            promise.reject("FGS_REFUSED", e.message, e)
        }
    }

    // Periodic RSSI polling. onReadRemoteRssi only fires in response to an
    // explicit readRemoteRssi() call, so without this poller the rssiUpdated
    // event could never be emitted and signal strength stayed unavailable to
    // the UI. The cadence comes from the current power mode: signal strength
    // only feeds the radar's ring placement, so polling every link every five
    // seconds on a pocketed phone was paying a radio round trip per peer for a
    // screen nobody is looking at.
    private var rssiPollingActive = false
    private val rssiPoller = object : Runnable {
        override fun run() {
            for (gatt in centralLinks.values) {
                try {
                    gatt.readRemoteRssi()
                } catch (e: SecurityException) {
                    Log.e(TAG, "BLUETOOTH_CONNECT permission missing", e)
                }
            }
            if (rssiPollingActive) mainHandler.postDelayed(this, powerMode.rssiIntervalMs)
        }
    }

    private fun startRssiPolling() {
        if (rssiPollingActive) return
        rssiPollingActive = true
        mainHandler.postDelayed(rssiPoller, powerMode.rssiIntervalMs)
    }

    private fun stopRssiPolling() {
        rssiPollingActive = false
        mainHandler.removeCallbacks(rssiPoller)
    }

    // MARK: - Advertising (Peripheral role)

    // `localName` carries our 16-hex-char peerID (Airhop passes identity.peerID).
    // We advertise its first 8 bytes as scan-response service data rather than
    // mutating the global Bluetooth adapter name, which matches bitchat-android and
    // lets scanners identify/de-dup us before connecting.
    @ReactMethod
    fun startAdvertising(serviceUUID: String, localName: String, promise: Promise) {
        // Refuse loudly when we cannot actually advertise.
        //
        // The platform advertiser accepts startAdvertising() against an adapter
        // that is off or a permission that has not settled, reports nothing, and
        // does nothing. Resolving the promise there told the caller the mesh was
        // up when it was not - and since the caller swallowed errors anyway,
        // there was no state in which anyone noticed. The reconciler now retries
        // on rejection, so an honest refusal is what makes recovery automatic.
        val bt = adapter
        if (bt == null) {
            promise.reject("UNSUPPORTED", "This device has no Bluetooth adapter")
            return
        }
        if (!bt.isEnabled) {
            promise.reject("RADIO_OFF", "Bluetooth is switched off")
            return
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
            !hasPermission(Manifest.permission.BLUETOOTH_ADVERTISE)
        ) {
            promise.reject("PERMISSION_DENIED", "BLUETOOTH_ADVERTISE not granted yet")
            return
        }
        if (bt.bluetoothLeAdvertiser == null) {
            // Some devices support BLE central but not peripheral. Scanning still
            // works, so this is a partial capability, not a dead mesh.
            promise.reject("UNSUPPORTED", "This device cannot advertise over BLE")
            return
        }
        try {
            localPeerIDHex = localName
            setupGattServer()
            beginAdvertising()
            // The foreground service is NOT started here any more. It is tied to
            // the mesh running, not to advertising, and is driven explicitly
            // through setBackgroundServiceEnabled() - see the note there.
            promise.resolve(null)
        } catch (e: SecurityException) {
            promise.reject("PERMISSION_DENIED", "BLE advertising requires BLUETOOTH_ADVERTISE permission", e)
        } catch (e: Exception) {
            promise.reject("BLE_ERROR", "Failed to start advertising: ${e.message}", e)
        }
    }

    // Whether the platform advertiser is currently running, so a power-mode
    // change knows whether there is anything to restart.
    @Volatile
    private var advertisingActive = false

    // Start (or restart) advertising at the current power mode's rate and TX
    // power. Split out of startAdvertising so setPowerMode can re-apply it
    // without repeating the precondition checks, which have already passed.
    private fun beginAdvertising() {
        val advertiser = adapter?.bluetoothLeAdvertiser ?: return

        val settings = AdvertiseSettings.Builder()
            .setAdvertiseMode(powerMode.advertiseMode)
            .setConnectable(true)
            .setTimeout(0)
            .setTxPowerLevel(powerMode.txPower)
            .build()

        val data = AdvertiseData.Builder()
            .setIncludeDeviceName(false)
            .setIncludeTxPowerLevel(false)
            .addServiceUuid(ParcelUuid(SERVICE_UUID))
            .build()

        val scanResponseBuilder = AdvertiseData.Builder()
            .setIncludeDeviceName(false)
            .setIncludeTxPowerLevel(false)
        hexToPeerIDBytes(localPeerIDHex)?.let { peerIDBytes ->
            scanResponseBuilder.addServiceData(ParcelUuid(SERVICE_UUID), peerIDBytes)
        }

        advertiser.startAdvertising(settings, data, scanResponseBuilder.build(), advertiseCallback)
        advertisingActive = true
    }

    // First 8 raw bytes of a 16-hex-char peerID, or null if malformed.
    private fun hexToPeerIDBytes(hex: String): ByteArray? {
        val clean = hex.trim()
        if (clean.length < 16) return null
        return try {
            ByteArray(8) { i -> clean.substring(i * 2, i * 2 + 2).toInt(16).toByte() }
        } catch (e: Exception) {
            null
        }
    }

    @ReactMethod
    fun stopAdvertising(promise: Promise) {
        try {
            advertisingActive = false
            adapter?.bluetoothLeAdvertiser?.stopAdvertising(advertiseCallback)
            gattServer?.close()
            gattServer = null
            characteristic = null
            // Closing the server may not run the per-link disconnect callback,
            // so half-written long writes are dropped here.
            preparedWrites.clear()
            // Deliberately does NOT touch the foreground service. This is also
            // the path "Invisible" takes, and that state still scans and relays,
            // so tearing the service down here silently ended background
            // operation for a mesh that was very much still working.
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("BLE_ERROR", "Failed to stop advertising: ${e.message}", e)
        }
    }

    // MARK: - Scanning (Central role)

    @ReactMethod
    fun startScanning(serviceUUIDs: ReadableArray, promise: Promise) {
        // Every precondition the platform will not report. startScan() succeeds
        // and returns nothing when a location prerequisite is missing, which is
        // indistinguishable from an empty room. Those prerequisites exist only
        // below API 31. See locationRequiredForScan().
        val bt = adapter
        if (bt == null) {
            promise.reject("UNSUPPORTED", "This device has no Bluetooth adapter")
            return
        }
        if (!bt.isEnabled) {
            promise.reject("RADIO_OFF", "Bluetooth is switched off")
            return
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (!hasPermission(Manifest.permission.BLUETOOTH_SCAN)) {
                promise.reject("PERMISSION_DENIED", "BLUETOOTH_SCAN not granted yet")
                return
            }
        } else {
            if (!hasPermission(Manifest.permission.ACCESS_FINE_LOCATION)) {
                promise.reject(
                    "PERMISSION_DENIED",
                    "Location permission is required for BLE scan results below API 31",
                )
                return
            }
            if (!locationServicesEnabled()) {
                promise.reject(
                    "LOCATION_SERVICES_OFF",
                    "Android withholds BLE scan results while location services are off",
                )
                return
            }
        }
        val scanner = bt.bluetoothLeScanner
        if (scanner == null) {
            promise.reject("RADIO_OFF", "BLE scanner unavailable (adapter still coming up)")
            return
        }
        try {
            // Hands off to the duty cycle, which decides whether that means a
            // continuous scan or bursts, per the current power mode.
            beginScanCycle()
            startRssiPolling()
            // Slots only need protecting once we are opening links.
            startDeviceMonitor()
            promise.resolve(null)
        } catch (e: SecurityException) {
            promise.reject("PERMISSION_DENIED", "BLE scanning requires BLUETOOTH_SCAN permission", e)
        } catch (e: Exception) {
            promise.reject("BLE_ERROR", "Failed to start scanning: ${e.message}", e)
        }
    }

    @ReactMethod
    fun stopScanning(promise: Promise) {
        try {
            stopRssiPolling()
            stopScanCycle()
            stopDeviceMonitor()
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("BLE_ERROR", "Failed to stop scanning: ${e.message}", e)
        }
    }

    // MARK: - I/O

    @ReactMethod
    fun writeToLink(linkID: String, dataBase64: String, promise: Promise) {
        val data = try {
            Base64.decode(dataBase64, Base64.DEFAULT)
        } catch (e: Exception) {
            promise.reject("INVALID_DATA", "Invalid base64 payload", e)
            return
        }

        // Central role: write to a connected GATT peripheral
        centralLinks[linkID]?.let { gatt ->
            val char = gatt.getService(SERVICE_UUID)
                ?.getCharacteristic(CHARACTERISTIC_UUID)
            if (char == null) {
                promise.reject("NO_CHARACTERISTIC", "Characteristic not found for link $linkID")
                return
            }
            try {
                // Surface a refused write instead of resolving regardless. The
                // stack rejects writes once its internal queue is full, and
                // silently resolving there meant whole fragments vanished
                // mid-transfer with the sender believing they went out.
                // An unacknowledged write is capped at MTU-3 and the stack
                // TRUNCATES past it rather than reporting an error, so anything
                // that does not fit goes as a default (acknowledged) write, which
                // the stack splits into a long write. Matches what the iOS module
                // already does with maximumWriteValueLength.
                val mtu = centralMtu[linkID] ?: DEFAULT_ATT_MTU
                val fitsUnacked = data.size <= mtu - ATT_WRITE_OVERHEAD
                val writeType =
                    if (fitsUnacked) BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE
                    else BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT

                val accepted: Boolean
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    accepted = gatt.writeCharacteristic(
                        char, data, writeType,
                    ) == BluetoothStatusCodes.SUCCESS
                } else {
                    @Suppress("DEPRECATION")
                    char.writeType = writeType
                    @Suppress("DEPRECATION")
                    char.value = data
                    @Suppress("DEPRECATION")
                    accepted = gatt.writeCharacteristic(char)
                }
                if (accepted) {
                    promise.resolve(null)
                } else {
                    promise.reject("WRITE_BUSY", "GATT write queue full for link $linkID")
                }
            } catch (e: SecurityException) {
                promise.reject("PERMISSION_DENIED", "BLUETOOTH_CONNECT required", e)
            }
            return
        }

        // Peripheral role: notify all subscribed centrals or a specific device
        peripheralLinks[linkID]?.let { device ->
            val char = characteristic
            if (char == null) {
                promise.reject("NOT_READY", "GATT server not initialized")
                return
            }
            try {
                // Report a refused notify instead of resolving regardless, for
                // the same reason the central path above does: the stack rejects
                // a notification when its queue is full, and swallowing that
                // meant whole fragments vanished mid-transfer with the sender
                // believing they had gone out. WRITE_BUSY is the same code the
                // central path returns, so the caller needs no second branch.
                val accepted =
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        gattServer?.notifyCharacteristicChanged(device, char, false, data) ==
                            BluetoothStatusCodes.SUCCESS
                    } else {
                        @Suppress("DEPRECATION")
                        char.value = data
                        @Suppress("DEPRECATION")
                        gattServer?.notifyCharacteristicChanged(device, char, false) == true
                    }
                if (accepted) {
                    promise.resolve(null)
                } else {
                    promise.reject("WRITE_BUSY", "GATT notify queue full for link $linkID")
                }
            } catch (e: SecurityException) {
                promise.reject("PERMISSION_DENIED", "BLUETOOTH_CONNECT required", e)
            }
            return
        }

        promise.reject("UNKNOWN_LINK", "No active link with ID $linkID")
    }

    // MARK: - Background notification hand-off

    companion object {
        // The module instance backing the live JS runtime, or null if there
        // isn't one. The background notification's "Stop mesh" action is
        // handled by a Service, which has no bridge of its own; this is how it
        // reaches JS so the teardown runs through the one code path that knows
        // how to shut a mesh down (see services/presence.ts).
        @Volatile
        private var live: AirhopBLEModule? = null

        // Ask JS to stop the mesh. Returns false when there is no JS to ask -
        // the process outlived its React context - and the caller then has to
        // clean up on its own rather than waiting for a reply that can't come.
        fun requestMeshStop(): Boolean {
            val module = live
            if (module == null || !module.reactContext.hasActiveReactInstance()) {
                // No JS to ask. The notification is about to disappear either
                // way, so the radios have to come down here or they keep
                // scanning and advertising with nothing behind them - a
                // "stopped" mesh that is still draining the battery, and no
                // remaining UI anywhere that can stop it.
                forceStopRadios()
                return false
            }
            return try {
                module.emitEvent(EVT_MESH_STOP_REQUESTED, WritableNativeMap())
                true
            } catch (e: Exception) {
                Log.w(TAG, "Could not reach JS to stop the mesh: ${e.message}")
                forceStopRadios()
                false
            }
        }

        // Last-resort teardown, straight against the adapter. Deliberately does
        // not touch the link maps or emit anything: there is no JS to tell, and
        // if a runtime does come back it re-reads the device from scratch.
        private fun forceStopRadios() {
            val module = live ?: return
            try {
                module.stopRssiPolling()
                // stopScanCycle(), not a bare stopScan: the latter leaves
                // scanningRequested true with the duty-cycle toggle queued, and
                // restarts the scanner seconds later with the notification gone
                // and no UI left to stop it. Called from onStartCommand, so
                // removeCallbacks is on the main thread as required.
                module.stopScanCycle()
                // No timer on the advertiser, but the flag must come down too or
                // a later setPowerMode restarts it.
                module.advertisingActive = false
                module.adapter?.bluetoothLeAdvertiser?.stopAdvertising(module.advertiseCallback)
                module.gattServer?.close()
                module.gattServer = null
                module.characteristic = null
                module.preparedWrites.clear()
            } catch (e: Exception) {
                Log.w(TAG, "Force stop failed: ${e.message}")
            }
        }
    }

    // MARK: - NativeEventEmitter contract

    @ReactMethod
    fun addListener(eventName: String) {
        listenerCount++
    }

    @ReactMethod
    fun removeListeners(count: Double) {
        listenerCount = maxOf(0, listenerCount - count.toInt())
    }

    // MARK: - Tor proxy detection (Orbot)

    // Probe whether a SOCKS5 proxy is reachable at localhost:port (Orbot default: 9050).
    // Runs a non-blocking TCP connect attempt on a background thread. The promise
    // resolves with the port number if reachable, or 0 if not.
    //
    // This does NOT start Orbot; it only detects whether it is already running.
    // TypeScript callers use the returned port to configure the Nostr WebSocket proxy.
    @ReactMethod
    fun getTorProxyPort(promise: Promise) {
        Thread {
            val port = ORBOT_SOCKS5_PORT
            try {
                java.net.Socket().use { socket ->
                    socket.connect(java.net.InetSocketAddress("127.0.0.1", port), ORBOT_PROBE_TIMEOUT_MS)
                    promise.resolve(port)
                }
            } catch (_: Exception) {
                promise.resolve(0)
            }
        }.start()
    }

    // Watch the VPN transport while Tor is on, so a Tor claim cannot outlive the
    // thing carrying it, and can be reinstated the moment that thing returns.
    //
    // getTorAvailability only answers when asked, and app foreground is its only
    // other caller. A dropped VPN does not fail the app's sockets - they
    // reconnect directly - so without these edges the relay pool comes back on
    // the clear net while the UI still says Tor is on.
    //
    // BOTH edges matter. Loss is the safety edge. Arrival is the recovery edge,
    // and load-bearing because JS holds the Nostr transport down until Tor
    // routes again: someone who stops and restarts Orbot from its own
    // notification shade never leaves Airhop, so nothing else would ever ask.
    //
    // Neither edge is a conclusion. Any VPN raises them - a corporate tunnel
    // dropping is not Orbot stopping - so both say only "the VPN transport
    // moved, ask again" and JS re-probes before changing anything.
    //
    // Registered only while Tor is on: a permanent callback watching a feature
    // few enable is battery cost with no reader.
    private var vpnCallback: ConnectivityManager.NetworkCallback? = null

    private fun connectivityManager(): ConnectivityManager? =
        try {
            reactContext.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
        } catch (_: Exception) {
            null
        }

    @ReactMethod
    fun startVpnWatch() {
        if (vpnCallback != null) return
        val cm = connectivityManager() ?: return
        val callback = object : ConnectivityManager.NetworkCallback() {
            override fun onLost(network: android.net.Network) {
                emitEvent(EVT_VPN_LOST, WritableNativeMap())
            }

            // onAvailable fires for a transport already up when the callback
            // registers, not only for one arriving afterwards. That replay is
            // what re-opens the gate on a relaunch into the blocked state,
            // without waiting for Orbot to be cycled.
            override fun onAvailable(network: android.net.Network) {
                emitEvent(EVT_VPN_AVAILABLE, WritableNativeMap())
            }
        }
        try {
            val request = android.net.NetworkRequest.Builder()
                .addTransportType(NetworkCapabilities.TRANSPORT_VPN)
                // Without this the default filter drops the very transport we
                // are trying to watch.
                .removeCapability(NetworkCapabilities.NET_CAPABILITY_NOT_VPN)
                .build()
            cm.registerNetworkCallback(request, callback)
            vpnCallback = callback
        } catch (e: Exception) {
            // Keeps the old behaviour: the foreground re-check catches a drop
            // later.
            Log.w(TAG, "Could not watch the VPN transport: ${e.message}")
        }
    }

    @ReactMethod
    fun stopVpnWatch() {
        val callback = vpnCallback ?: return
        vpnCallback = null
        try {
            connectivityManager()?.unregisterNetworkCallback(callback)
        } catch (_: Exception) {
            // Already unregistered, or the service is gone with the context.
        }
    }

    // Report whether Tor routing can actually work on this device, so the UI
    // never flips the Tor toggle "on" when nothing is routing traffic. We cannot
    // start Orbot ourselves, so we surface the two things we *can* observe:
    //   - orbotInstalled: the Orbot package is present (PackageManager query;
    //     needs the <package> entry in AndroidManifest's <queries> on API 30+).
    //   - vpnActive: a VPN transport is currently up. Orbot's VPN mode captures
    //     app traffic transparently, so an active VPN is our best signal that
    //     traffic is being routed. It cannot prove the VPN is *Orbot* (only that
    //     one exists), which is why we report it alongside orbotInstalled and let
    //     the caller require both.
    @ReactMethod
    fun getTorAvailability(promise: Promise) {
        val result = WritableNativeMap()

        val orbotInstalled = try {
            reactContext.packageManager.getPackageInfo("org.torproject.android", 0)
            true
        } catch (_: PackageManager.NameNotFoundException) {
            false
        } catch (_: Exception) {
            false
        }

        val vpnActive = try {
            val cm = reactContext.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
            cm?.allNetworks?.any { network ->
                cm.getNetworkCapabilities(network)
                    ?.hasTransport(NetworkCapabilities.TRANSPORT_VPN) == true
            } ?: false
        } catch (_: Exception) {
            false
        }

        result.putBoolean("orbotInstalled", orbotInstalled)
        result.putBoolean("vpnActive", vpnActive)
        promise.resolve(result)
    }

    // MARK: - GATT server setup

    private fun setupGattServer() {
        if (gattServer != null) return
        // Nullable since the adapter became lazy: no Bluetooth service on this
        // device means no GATT server, and the callers above have already
        // rejected with UNSUPPORTED by the time we could get here.
        val manager = bluetoothManager ?: return

        val char = BluetoothGattCharacteristic(
            CHARACTERISTIC_UUID,
            BluetoothGattCharacteristic.PROPERTY_READ or
                    BluetoothGattCharacteristic.PROPERTY_WRITE or
                    BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE or
                    BluetoothGattCharacteristic.PROPERTY_NOTIFY,
            BluetoothGattCharacteristic.PERMISSION_READ or
                    BluetoothGattCharacteristic.PERMISSION_WRITE
        )

        val cccd = BluetoothGattDescriptor(
            CCCD_UUID,
            BluetoothGattDescriptor.PERMISSION_READ or BluetoothGattDescriptor.PERMISSION_WRITE
        )
        char.addDescriptor(cccd)
        characteristic = char

        val service = BluetoothGattService(SERVICE_UUID, BluetoothGattService.SERVICE_TYPE_PRIMARY)
        service.addCharacteristic(char)

        gattServer = manager.openGattServer(reactContext, gattServerCallback)
        gattServer?.addService(service)
    }

    // MARK: - Event emitter helpers

    // Reaching JS from native, safely.
    //
    // This is the single most important guard in the file. Every caller below
    // runs on a thread the OS owns and we do not: BroadcastReceiver.onReceive is
    // the main thread, the GATT callbacks are binder threads, and none of them
    // has an exception handler above it. An uncaught throw on any of them kills
    // the process.
    //
    // Under bridgeless React Native (newArchEnabled=true) getJSModule throws
    // IllegalStateException whenever no runtime is attached, and there are three
    // ordinary windows where that is true: before the JS bundle has finished
    // loading, after Android destroys the Activity while the foreground service
    // keeps the process, and during a dev reload. Previously this method had
    // neither a check nor a catch, so a Bluetooth toggle in any of those windows
    // was a crash rather than a dropped event.
    //
    // Both a check AND a catch, deliberately: hasActiveReactInstance() can stop
    // being true between the test and the call, so the check saves the common
    // case and the catch covers the race. A dropped event is always the right
    // outcome here - there is by definition nobody to deliver it to, and the
    // reconciler re-reads the real state on the next resume.
    private fun emitEvent(name: String, body: WritableNativeMap) {
        if (!reactContext.hasActiveReactInstance()) return
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(name, body)
        } catch (e: Exception) {
            Log.w(TAG, "Dropped $name: no JS runtime to receive it (${e.message})")
        }
    }

    // MARK: - Callbacks

    private val advertiseCallback = object : AdvertiseCallback() {
        override fun onStartSuccess(settings: AdvertiseSettings?) {
            Log.d(TAG, "Advertising started")
        }
        override fun onStartFailure(errorCode: Int) {
            Log.e(TAG, "Advertising failed: $errorCode")
        }
    }

    private val scanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            val device = result.device
            val linkID = "c:${device.address}"
            if (centralLinks.containsKey(linkID)) return

            // A device that repeatedly disconnects with an error is refused
            // before we spend a connection slot on it. Every retry costs one of
            // the six or seven this radio has.
            if (isBlocked(device.address)) return

            // At capacity: stay a peripheral to this one. It can still dial us,
            // and we still hear it relayed through the neighbours we do have.
            if (centralLinks.size >= MAX_CENTRAL_LINKS) return

            // Identify the remote by its advertised peerID (scan-response service
            // data) and skip if we already have a link to that peer. This dedups
            // MAC rotation and repeated scan callbacks for the same device.
            val serviceData = result.scanRecord?.getServiceData(ParcelUuid(SERVICE_UUID))
            val advertisedPeerID = if (serviceData != null && serviceData.size >= 8) {
                serviceData.take(8).joinToString("") { "%02x".format(it) }
            } else null
            if (advertisedPeerID != null && centralPeerIDs.contains(advertisedPeerID)) return

            try {
                if (advertisedPeerID != null) {
                    centralPeerIDs.add(advertisedPeerID)
                    linkToAdvertisedPeerID[linkID] = advertisedPeerID
                }
                // TRANSPORT_LE forces a BLE (not BR/EDR) connection; omitting it
                // is a common source of spurious GATT status 133 failures.
                val gatt = device.connectGatt(
                    reactContext, false, gattClientCallback, BluetoothDevice.TRANSPORT_LE,
                )
                centralLinks[linkID] = gatt
            } catch (e: SecurityException) {
                Log.e(TAG, "BLUETOOTH_CONNECT permission missing", e)
            }
        }

        override fun onScanFailed(errorCode: Int) {
            Log.e(TAG, "Scan failed: $errorCode")
            // Stand down rather than note the burst died. The duty-cycle toggle
            // is still queued and would restart the scan within seconds, which
            // against SCAN_FAILED_SCANNING_TOO_FREQUENTLY spends the next window
            // being refused again while JS holds a backoff it believes it is
            // enforcing. The restart belongs to the reconciler.
            scanBurstActive = false
            stopScanCycle()
            emitEvent(EVT_SCAN_FAILED, WritableNativeMap().apply {
                putInt("errorCode", errorCode)
            })
        }
    }

    private val gattServerCallback = object : BluetoothGattServerCallback() {
        override fun onConnectionStateChange(device: BluetoothDevice, status: Int, newState: Int) {
            val linkID = "p:${device.address}"
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                // Refused at the server as well as when we dial out, or it
                // simply connects to us instead and keeps the slot it lost.
                if (isBlocked(device.address)) {
                    try {
                        gattServer?.cancelConnection(device)
                    } catch (e: SecurityException) {
                        Log.e(TAG, "BLUETOOTH_CONNECT permission missing", e)
                    }
                    return
                }
                // Track the device but DON'T announce the link yet: the central
                // hasn't enabled notifications, so anything we notify now is lost.
                // linkConnected fires from onDescriptorWriteRequest (CCCD enable).
                peripheralLinks[linkID] = device
                noteLinkOpened(linkID)
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                peripheralLinks.remove(linkID)
                // A long write abandoned mid-transaction. Dropped, or the next
                // connection from the same MAC resumes into a half-written frame.
                preparedWrites.remove(linkID)
                noteLinkClosed(linkID, status)
                emitEvent(EVT_LINK_DISCONNECTED, WritableNativeMap().apply {
                    putString("linkID", linkID)
                })
            }
        }

        // Handles both shapes of inbound write. A frame over MTU-3 cannot go
        // unacknowledged, so the sender falls back to an acknowledged write and
        // the stack turns that into the ATT long-write procedure: PREPARE
        // requests at successive offsets, then one EXECUTE. iOS does the same.
        // Treating each PREPARE as a whole packet corrupted every attachment
        // fragment on any controller granting under a 515-byte MTU.
        override fun onCharacteristicWriteRequest(
            device: BluetoothDevice,
            requestId: Int,
            characteristic: BluetoothGattCharacteristic,
            preparedWrite: Boolean,
            responseNeeded: Boolean,
            offset: Int,
            value: ByteArray,
        ) {
            if (characteristic.uuid != CHARACTERISTIC_UUID) return
            val linkID = "p:${device.address}"

            if (preparedWrite) {
                // computeIfAbsent, not getOrPut: the extension is get-then-put,
                // so two chunks on different binder threads would each build a
                // buffer and one would be discarded.
                val state = preparedWrites.computeIfAbsent(linkID) { PreparedWrite() }
                val status = synchronized(state) {
                    when {
                        // A gap means the reassembly cannot be trusted. Refusing
                        // makes the client abort the transaction, which is a
                        // retry; accepting delivers a corrupt frame as valid.
                        offset != state.length -> {
                            state.failed = true
                            BluetoothGatt.GATT_INVALID_OFFSET
                        }
                        state.length + value.size > MAX_BLE_FRAME -> {
                            state.failed = true
                            BluetoothGatt.GATT_INVALID_ATTRIBUTE_LENGTH
                        }
                        else -> {
                            state.buffer.write(value)
                            BluetoothGatt.GATT_SUCCESS
                        }
                    }
                }
                // A prepare response echoes offset and bytes verbatim; the
                // client compares and aborts on mismatch, so the previous
                // (0, null) reply failed every long write on its own.
                if (responseNeeded) {
                    gattServer?.sendResponse(device, requestId, status, offset, value)
                }
                return
            }

            // A plain write. Offset is always 0 for one of these; anything else
            // is a client doing something we have no way to reassemble.
            if (offset != 0) {
                if (responseNeeded) {
                    gattServer?.sendResponse(
                        device, requestId, BluetoothGatt.GATT_INVALID_OFFSET, offset, null,
                    )
                }
                return
            }
            noteTraffic(linkID)
            emitEvent(EVT_PACKET_RECEIVED, WritableNativeMap().apply {
                putString("linkID", linkID)
                putString("dataBase64", Base64.encodeToString(value, Base64.NO_WRAP))
            })
            if (responseNeeded) {
                gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0, null)
            }
        }

        // The commit half of a long write. Only here is the reassembled frame a
        // packet; `execute` false is the client abandoning the transaction,
        // which discards it.
        override fun onExecuteWrite(device: BluetoothDevice, requestId: Int, execute: Boolean) {
            val linkID = "p:${device.address}"
            val state = preparedWrites.remove(linkID)
            // Read under the same lock the chunks were written under: these
            // callbacks arrive on a binder pool and the EXECUTE need not land on
            // the thread that wrote the last PREPARE.
            val data = if (state == null) null else synchronized(state) {
                if (state.failed) null else state.buffer.toByteArray()
            }
            if (execute && data != null && data.isNotEmpty()) {
                noteTraffic(linkID)
                emitEvent(EVT_PACKET_RECEIVED, WritableNativeMap().apply {
                    putString("linkID", linkID)
                    putString("dataBase64", Base64.encodeToString(data, Base64.NO_WRAP))
                })
            }
            gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0, null)
        }

        override fun onDescriptorWriteRequest(
            device: BluetoothDevice,
            requestId: Int,
            descriptor: BluetoothGattDescriptor,
            preparedWrite: Boolean,
            responseNeeded: Boolean,
            offset: Int,
            value: ByteArray,
        ) {
            // A CCCD write whose first byte is 0x01 = ENABLE_NOTIFICATION_VALUE.
            // Only now is it safe to notify this central, so surface the link.
            if (descriptor.uuid == CCCD_UUID && value.isNotEmpty() && value[0].toInt() == 0x01) {
                val linkID = "p:${device.address}"
                if (peripheralLinks.containsKey(linkID)) {
                    emitEvent(EVT_LINK_CONNECTED, WritableNativeMap().apply {
                        putString("linkID", linkID)
                        putString("role", "peripheral")
                        putInt("rssi", -99)
                    })
                }
            }
            if (responseNeeded) {
                gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0, null)
            }
        }
    }

    private val gattClientCallback = object : BluetoothGattCallback() {
        override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
            val linkID = "c:${gatt.device.address}"
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                noteLinkOpened(linkID)
                // Negotiate a larger MTU BEFORE service discovery or any I/O.
                // At the default 23-byte MTU, ANNOUNCE/handshake writes silently
                // truncate and nothing works. Service discovery is deferred to
                // onMtuChanged. The 200 ms settle matches bitchat and improves
                // MTU-request reliability across controllers.
                mainHandler.postDelayed({
                    try {
                        gatt.requestMtu(517)
                    } catch (e: SecurityException) {
                        Log.e(TAG, "BLUETOOTH_CONNECT permission missing", e)
                    }
                }, 200)
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                centralLinks.remove(linkID)
                centralMtu.remove(linkID)
                linkToAdvertisedPeerID.remove(linkID)?.let { centralPeerIDs.remove(it) }
                noteLinkClosed(linkID, status)
                try { gatt.close() } catch (e: Exception) { /* already closed */ }
                emitEvent(EVT_LINK_DISCONNECTED, WritableNativeMap().apply {
                    putString("linkID", linkID)
                })
            }
        }

        override fun onMtuChanged(gatt: BluetoothGatt, mtu: Int, status: Int) {
            val linkID = "c:${gatt.device.address}"
            // Record what the controller actually granted, which is often less
            // than the 517 we asked for. The write path needs it to choose
            // between an unacknowledged write and a long write.
            if (status == BluetoothGatt.GATT_SUCCESS && mtu > 0) {
                centralMtu[linkID] = mtu
            }
            // Proceed regardless of status: on a failed negotiation we keep the
            // default MTU rather than stranding the peer (there is no reconnect
            // state machine to fall back on).
            try {
                gatt.discoverServices()
            } catch (e: SecurityException) {
                Log.e(TAG, "BLUETOOTH_CONNECT permission missing", e)
            }
        }

        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            if (status != BluetoothGatt.GATT_SUCCESS) return
            val char = gatt.getService(SERVICE_UUID)?.getCharacteristic(CHARACTERISTIC_UUID) ?: return

            // Subscribe to notifications. linkConnected is emitted only once the
            // CCCD write confirms (onDescriptorWrite), so we never send on a link
            // before the far side can actually receive.
            try {
                gatt.setCharacteristicNotification(char, true)
                val descriptor = char.getDescriptor(CCCD_UUID)
                if (descriptor == null) {
                    // No CCCD => can't receive notifications => unusable link.
                    gatt.disconnect()
                    return
                }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    gatt.writeDescriptor(descriptor, BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE)
                } else {
                    @Suppress("DEPRECATION")
                    descriptor.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                    @Suppress("DEPRECATION")
                    gatt.writeDescriptor(descriptor)
                }
            } catch (e: SecurityException) {
                Log.e(TAG, "BLUETOOTH_CONNECT permission missing", e)
            }
        }

        override fun onDescriptorWrite(
            gatt: BluetoothGatt,
            descriptor: BluetoothGattDescriptor,
            status: Int,
        ) {
            if (descriptor.uuid != CCCD_UUID) return
            // Notifications active: the central link is now fully usable.
            val linkID = "c:${gatt.device.address}"
            emitEvent(EVT_LINK_CONNECTED, WritableNativeMap().apply {
                putString("linkID", linkID)
                putString("role", "central")
                putInt("rssi", -99)
            })
        }

        override fun onCharacteristicChanged(
            gatt: BluetoothGatt,
            characteristic: BluetoothGattCharacteristic,
            value: ByteArray,
        ) {
            if (characteristic.uuid != CHARACTERISTIC_UUID) return
            val linkID = "c:${gatt.device.address}"
            noteTraffic(linkID)
            emitEvent(EVT_PACKET_RECEIVED, WritableNativeMap().apply {
                putString("linkID", linkID)
                putString("dataBase64", Base64.encodeToString(value, Base64.NO_WRAP))
            })
        }

        // Deprecated version for API < 33
        @Suppress("DEPRECATION")
        override fun onCharacteristicChanged(
            gatt: BluetoothGatt,
            characteristic: BluetoothGattCharacteristic,
        ) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) return
            if (characteristic.uuid != CHARACTERISTIC_UUID) return
            val value = characteristic.value ?: return
            val linkID = "c:${gatt.device.address}"
            noteTraffic(linkID)
            emitEvent(EVT_PACKET_RECEIVED, WritableNativeMap().apply {
                putString("linkID", linkID)
                putString("dataBase64", Base64.encodeToString(value, Base64.NO_WRAP))
            })
        }

        override fun onReadRemoteRssi(gatt: BluetoothGatt, rssi: Int, status: Int) {
            if (status != BluetoothGatt.GATT_SUCCESS) return
            val linkID = "c:${gatt.device.address}"
            emitEvent(EVT_RSSI_UPDATED, WritableNativeMap().apply {
                putString("linkID", linkID)
                putInt("rssi", rssi)
            })
        }
    }
}
