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
package tech.permissionless.airhop.ble

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
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.os.Build
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

    private var listenerCount = 0

    // MARK: - Advertising (Peripheral role)

    @ReactMethod
    fun startAdvertising(serviceUUID: String, localName: String, promise: Promise) {
        try {
            setupGattServer()

            val settings = AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
                .setConnectable(true)
                .setTimeout(0)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                .build()

            val data = AdvertiseData.Builder()
                .setIncludeDeviceName(false) // name goes in scan response
                .addServiceUuid(ParcelUuid(SERVICE_UUID))
                .build()

            val scanResponse = AdvertiseData.Builder()
                .setIncludeDeviceName(true)
                .build()

            adapter.setName(localName)
            adapter.bluetoothLeAdvertiser?.startAdvertising(settings, data, scanResponse, advertiseCallback)
            promise.resolve(null)
        } catch (e: SecurityException) {
            promise.reject("PERMISSION_DENIED", "BLE advertising requires BLUETOOTH_ADVERTISE permission", e)
        } catch (e: Exception) {
            promise.reject("BLE_ERROR", "Failed to start advertising: ${e.message}", e)
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
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    gatt.writeCharacteristic(char, data, BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE)
                } else {
                    @Suppress("DEPRECATION")
                    char.value = data
                    @Suppress("DEPRECATION")
                    gatt.writeCharacteristic(char)
                }
                promise.resolve(null)
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

            try {
                val gatt = device.connectGatt(reactContext, false, gattClientCallback)
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
                peripheralLinks[linkID] = device
                emitEvent(EVT_LINK_CONNECTED, WritableNativeMap().apply {
                    putString("linkID", linkID)
                    putString("role", "peripheral")
                    putInt("rssi", -99)
                })
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
            if (responseNeeded) {
                gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0, null)
            }
        }
    }

    private val gattClientCallback = object : BluetoothGattCallback() {
        override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
            val linkID = "c:${gatt.device.address}"
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                try {
                    gatt.discoverServices()
                } catch (e: SecurityException) {
                    Log.e(TAG, "BLUETOOTH_CONNECT permission missing", e)
                }
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                centralLinks.remove(linkID)
                emitEvent(EVT_LINK_DISCONNECTED, WritableNativeMap().apply {
                    putString("linkID", linkID)
                })
            }
        }

        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            if (status != BluetoothGatt.GATT_SUCCESS) return
            val char = gatt.getService(SERVICE_UUID)?.getCharacteristic(CHARACTERISTIC_UUID) ?: return

            // Enable notifications
            try {
                gatt.setCharacteristicNotification(char, true)
                val descriptor = char.getDescriptor(CCCD_UUID)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    gatt.writeDescriptor(descriptor, BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE)
                } else {
                    @Suppress("DEPRECATION")
                    descriptor.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                    @Suppress("DEPRECATION")
                    gatt.writeDescriptor(descriptor)
                }

                val linkID = "c:${gatt.device.address}"
                emitEvent(EVT_LINK_CONNECTED, WritableNativeMap().apply {
                    putString("linkID", linkID)
                    putString("role", "central")
                    putInt("rssi", -99)
                })
            } catch (e: SecurityException) {
                Log.e(TAG, "BLUETOOTH_CONNECT permission missing", e)
            }
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
