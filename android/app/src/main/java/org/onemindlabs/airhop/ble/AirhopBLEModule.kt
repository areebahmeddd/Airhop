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
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.ParcelUuid
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
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

// Orbot SOCKS5 proxy defaults (Tor via Orbot, per ARCHITECTURE.md section 9).
// Phase 1: detect existing Orbot session. Phase 2: embedded tor binary.
private const val ORBOT_SOCKS5_PORT       = 9050
private const val ORBOT_PROBE_TIMEOUT_MS  = 500

class AirhopBLEModule(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AirhopBLE"

    private val bluetoothManager: BluetoothManager =
        reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
    private val adapter: BluetoothAdapter = bluetoothManager.adapter

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
    private val adapterStateReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action != BluetoothAdapter.ACTION_STATE_CHANGED) return
            val state = intent.getIntExtra(
                BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR,
            )
            // Only ON/OFF are reported; the TURNING_* transitions would make
            // the banner flicker mid-toggle.
            when (state) {
                BluetoothAdapter.STATE_ON -> emitAdapterState(true)
                BluetoothAdapter.STATE_OFF -> emitAdapterState(false)
            }
        }
    }

    init {
        try {
            reactContext.registerReceiver(
                adapterStateReceiver,
                IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED),
            )
        } catch (e: Exception) {
            Log.e(TAG, "Could not register Bluetooth state receiver", e)
        }
    }

    override fun invalidate() {
        try {
            reactContext.unregisterReceiver(adapterStateReceiver)
        } catch (e: Exception) {
            // Already unregistered, or context torn down first.
        }
        stopRssiPolling()
        super.invalidate()
    }

    private fun emitAdapterState(enabled: Boolean) {
        emitEvent(EVT_ADAPTER_STATE, WritableNativeMap().apply {
            putBoolean("enabled", enabled)
        })
    }

    // Report the current radio state on demand, so JS has a value before the
    // first ACTION_STATE_CHANGED broadcast ever fires.
    @ReactMethod
    fun isAdapterEnabled(promise: Promise) {
        try {
            promise.resolve(adapter.isEnabled)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    // Periodic RSSI polling. onReadRemoteRssi only fires in response to an
    // explicit readRemoteRssi() call, so without this poller the rssiUpdated
    // event could never be emitted and signal strength stayed unavailable to
    // the UI. 5s cadence matches the iOS module.
    private val rssiIntervalMs = 5_000L
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
            if (rssiPollingActive) mainHandler.postDelayed(this, rssiIntervalMs)
        }
    }

    private fun startRssiPolling() {
        if (rssiPollingActive) return
        rssiPollingActive = true
        mainHandler.postDelayed(rssiPoller, rssiIntervalMs)
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
        try {
            localPeerIDHex = localName
            setupGattServer()

            val settings = AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
                .setConnectable(true)
                .setTimeout(0)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                .build()

            val data = AdvertiseData.Builder()
                .setIncludeDeviceName(false)
                .setIncludeTxPowerLevel(false)
                .addServiceUuid(ParcelUuid(SERVICE_UUID))
                .build()

            val scanResponseBuilder = AdvertiseData.Builder()
                .setIncludeDeviceName(false)
                .setIncludeTxPowerLevel(false)
            hexToPeerIDBytes(localName)?.let { peerIDBytes ->
                scanResponseBuilder.addServiceData(ParcelUuid(SERVICE_UUID), peerIDBytes)
            }
            val scanResponse = scanResponseBuilder.build()

            adapter.bluetoothLeAdvertiser?.startAdvertising(settings, data, scanResponse, advertiseCallback)
            promise.resolve(null)
        } catch (e: SecurityException) {
            promise.reject("PERMISSION_DENIED", "BLE advertising requires BLUETOOTH_ADVERTISE permission", e)
        } catch (e: Exception) {
            promise.reject("BLE_ERROR", "Failed to start advertising: ${e.message}", e)
        }
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
            adapter.bluetoothLeAdvertiser?.stopAdvertising(advertiseCallback)
            gattServer?.close()
            gattServer = null
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("BLE_ERROR", "Failed to stop advertising: ${e.message}", e)
        }
    }

    // MARK: - Scanning (Central role)

    @ReactMethod
    fun startScanning(serviceUUIDs: ReadableArray, promise: Promise) {
        try {
            val filter = ScanFilter.Builder()
                .setServiceUuid(ParcelUuid(SERVICE_UUID))
                .build()

            val settings = ScanSettings.Builder()
                .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                .build()

            adapter.bluetoothLeScanner?.startScan(listOf(filter), settings, scanCallback)
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
            adapter.bluetoothLeScanner?.stopScan(scanCallback)
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

    // MARK: - GATT server setup

    private fun setupGattServer() {
        if (gattServer != null) return

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

        gattServer = bluetoothManager.openGattServer(reactContext, gattServerCallback)
        gattServer?.addService(service)
    }

    // MARK: - Event emitter helpers

    private fun emitEvent(name: String, body: WritableNativeMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(name, body)
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
