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
// The user tapped "Stop mesh" on the background notification. Handled in JS so
// the shutdown is the same one the Status picker performs.
private const val EVT_MESH_STOP_REQUESTED = "AirhopBLE.meshStopRequested"

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

    // Advertised peerIDs (hex) we already have (or are opening) a central link
    // to, so a repeated scan callback, or the same peer under a rotated MAC,
    // never opens a duplicate link. Mirrors bitchat's peerID-in-scan-response
    // dedup (BluetoothGattClientManager.handleScanResult).
    private val centralPeerIDs = ConcurrentHashMap.newKeySet<String>()
    private val linkToAdvertisedPeerID = ConcurrentHashMap<String, String>()

    // Our own peerID hex (16 chars), advertised as 8-byte scan-response service
    // data so remote scanners can identify and de-dup us before connecting.
    private var localPeerIDHex: String = ""

    // Used to post the MTU request off the GATT callback thread after a short
    // settle delay (a request issued synchronously inside onConnectionStateChange
    // is unreliable on many controllers).
    private val mainHandler = Handler(Looper.getMainLooper())

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
        // Anyone still waiting on the enable dialog will never hear back
        // otherwise, and an unresolved promise is a UI stuck on a spinner.
        resolvePendingEnable(false)
        stopRssiPolling()
        stopScanCycle()
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
    // On Android the other three quarters are what actually bite: a granted
    // BLUETOOTH_SCAN with the OS location toggle off, or with "Approximate"
    // chosen instead of "Precise", produces a scan that starts cleanly, reports
    // no error, and returns results to nobody. That was indistinguishable from
    // "nobody is nearby" and had no banner, so the radar span forever.
    @ReactMethod
    fun getRadioState(promise: Promise) {
        val result = WritableNativeMap()
        val bt = adapter

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
        result.putBoolean("locationServicesEnabled", locationServicesEnabled())
        result.putBoolean("preciseLocation", hasPermission(Manifest.permission.ACCESS_FINE_LOCATION))
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
    private fun currentAuthorization(): String {
        // Below API 31 the BLUETOOTH_* permissions are install-time normal
        // permissions and are always held.
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return "granted"
        val needed = listOf(
            Manifest.permission.BLUETOOTH_SCAN,
            Manifest.permission.BLUETOOTH_ADVERTISE,
            Manifest.permission.BLUETOOTH_CONNECT,
        )
        return if (needed.all(::hasPermission)) "granted" else "denied"
    }

    // The OS-wide location toggle, which is NOT the location permission.
    //
    // Airhop does not declare usesPermissionFlags="neverForLocation" on
    // BLUETOOTH_SCAN (matching bitchat), so BLE scanning stays coupled to
    // location and Android withholds every scan result while this is off. From
    // API 28 there is a direct query; below that the provider list is the
    // only signal.
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
        // Every precondition the platform will not tell us about.
        //
        // startScan() succeeds and returns nothing when the OS location toggle
        // is off, or when the user chose "Approximate" instead of "Precise" -
        // Airhop does not declare neverForLocation on BLUETOOTH_SCAN, so
        // scanning stays coupled to location on every API level. Both cases are
        // indistinguishable from an empty room unless we check for them, and an
        // empty room is what the radar showed, forever.
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
            !hasPermission(Manifest.permission.BLUETOOTH_SCAN)
        ) {
            promise.reject("PERMISSION_DENIED", "BLUETOOTH_SCAN not granted yet")
            return
        }
        if (!hasPermission(Manifest.permission.ACCESS_FINE_LOCATION)) {
            promise.reject(
                "PERMISSION_DENIED",
                "Precise location is required for BLE scan results",
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
                val accepted: Boolean
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    accepted = gatt.writeCharacteristic(
                        char, data, BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE,
                    ) == BluetoothStatusCodes.SUCCESS
                } else {
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
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    gattServer?.notifyCharacteristicChanged(device, char, false, data)
                } else {
                    @Suppress("DEPRECATION")
                    char.value = data
                    @Suppress("DEPRECATION")
                    gattServer?.notifyCharacteristicChanged(device, char, false)
                }
                promise.resolve(null)
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
                module.adapter?.bluetoothLeScanner?.stopScan(module.scanCallback)
                module.adapter?.bluetoothLeAdvertiser?.stopAdvertising(module.advertiseCallback)
                module.gattServer?.close()
                module.gattServer = null
                module.characteristic = null
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
        }
    }

    private val gattServerCallback = object : BluetoothGattServerCallback() {
        override fun onConnectionStateChange(device: BluetoothDevice, status: Int, newState: Int) {
            val linkID = "p:${device.address}"
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                // Track the device but DON'T announce the link yet: the central
                // hasn't enabled notifications, so anything we notify now is lost.
                // linkConnected fires from onDescriptorWriteRequest (CCCD enable).
                peripheralLinks[linkID] = device
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                peripheralLinks.remove(linkID)
                emitEvent(EVT_LINK_DISCONNECTED, WritableNativeMap().apply {
                    putString("linkID", linkID)
                })
            }
        }

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
            emitEvent(EVT_PACKET_RECEIVED, WritableNativeMap().apply {
                putString("linkID", linkID)
                putString("dataBase64", Base64.encodeToString(value, Base64.DEFAULT))
            })
            if (responseNeeded) {
                gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0, null)
            }
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
                linkToAdvertisedPeerID.remove(linkID)?.let { centralPeerIDs.remove(it) }
                try { gatt.close() } catch (e: Exception) { /* already closed */ }
                emitEvent(EVT_LINK_DISCONNECTED, WritableNativeMap().apply {
                    putString("linkID", linkID)
                })
            }
        }

        override fun onMtuChanged(gatt: BluetoothGatt, mtu: Int, status: Int) {
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
            emitEvent(EVT_PACKET_RECEIVED, WritableNativeMap().apply {
                putString("linkID", linkID)
                putString("dataBase64", Base64.encodeToString(value, Base64.DEFAULT))
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
            emitEvent(EVT_PACKET_RECEIVED, WritableNativeMap().apply {
                putString("linkID", linkID)
                putString("dataBase64", Base64.encodeToString(value, Base64.DEFAULT))
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
