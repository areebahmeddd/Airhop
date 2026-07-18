// AirhopWiFiModule: WiFi Aware high-bandwidth transport for Airhop.
//
// Uses Android's WiFi Aware (NAN) API (API 26+) to create peer-to-peer data
// channels without a router or internet connection. Range: ~30 m, ~250 Mbps.
//
// Architecture contract: no protocol or routing logic here. This module
// exposes raw bytes to TypeScript exactly as AirhopBLEModule does.
//
// Three operations:
//   1. Publish: advertise this device as an Airhop WiFi Aware peer.
//   2. Subscribe: discover peers advertising the same service.
//   3. Connect: open a socket once WifiAwareNetworkSpecifier is available.
//
// Events emitted to TypeScript (same names as BLE module for symmetry):
//   AirhopWiFi.packetReceived   { linkID, dataBase64 }
//   AirhopWiFi.linkConnected    { linkID }
//   AirhopWiFi.linkDisconnected { linkID }
package org.onemindlabs.airhop.wifi

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.net.wifi.aware.AttachCallback
import android.net.wifi.aware.DiscoverySession
import android.net.wifi.aware.DiscoverySessionCallback
import android.net.wifi.aware.PeerHandle
import android.net.wifi.aware.PublishConfig
import android.net.wifi.aware.PublishDiscoverySession
import android.net.wifi.aware.SubscribeConfig
import android.net.wifi.aware.SubscribeDiscoverySession
import android.net.wifi.aware.WifiAwareManager
import android.net.wifi.aware.WifiAwareNetworkSpecifier
import android.net.wifi.aware.WifiAwareSession
import android.os.Build
import android.util.Base64
import android.util.Log
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.InputStream
import java.io.OutputStream
import java.net.ServerSocket
import java.net.Socket
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicInteger

private const val TAG = "AirhopWiFiModule"

// Airhop WiFi Aware service name. Not a UUID; must be < 255 bytes ASCII.
private const val SERVICE_NAME = "airhop-mesh-v1"

// Events emitted to TypeScript.
private const val EVT_PACKET_RECEIVED   = "AirhopWiFi.packetReceived"
private const val EVT_LINK_CONNECTED    = "AirhopWiFi.linkConnected"
private const val EVT_LINK_DISCONNECTED = "AirhopWiFi.linkDisconnected"

// Port used for the socket-over-WiFi-Aware data channel.
private const val AWARE_PORT = 8765

// Maximum raw frame size for a single write. Matches the chunked file transfer
// chunk size in file-transfer.ts (64 KiB) plus an 8-byte length prefix.
private const val MAX_FRAME = 65544

@RequiresApi(Build.VERSION_CODES.O)
class AirhopWiFiModule(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AirhopWiFi"

    private val wifiAwareManager: WifiAwareManager? =
        reactContext.getSystemService(Context.WIFI_AWARE_SERVICE) as? WifiAwareManager

    private var awareSession: WifiAwareSession? = null
    private var publishSession: PublishDiscoverySession? = null
    private var subscribeSession: SubscribeDiscoverySession? = null
    private val connectivityManager: ConnectivityManager =
        reactContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    // Active bidirectional socket links. Key = linkID (generated on connect).
    private val links = ConcurrentHashMap<String, LinkState>()
    private val linkCounter = AtomicInteger(0)
    private val ioExecutor = Executors.newCachedThreadPool()

    private var listenerCount = 0

    private data class LinkState(
        val id: String,
        val socket: Socket,
        val output: OutputStream,
    )

    // ---- Start / Stop --------------------------------------------------------

    @ReactMethod
    fun startWiFi(promise: Promise) {
        val manager = wifiAwareManager
        if (manager == null) {
            promise.reject("WIFI_AWARE_UNAVAILABLE", "WiFi Aware not supported on this device")
            return
        }

        manager.attach(object : AttachCallback() {
            override fun onAttached(session: WifiAwareSession) {
                awareSession = session
                Log.d(TAG, "WiFi Aware attached")
                startPublish(session)
                startSubscribe(session)
                promise.resolve(null)
            }

            override fun onAttachFailed() {
                promise.reject("WIFI_AWARE_ATTACH_FAILED", "Failed to attach to WiFi Aware")
            }
        }, null)
    }

    @ReactMethod
    fun stopWiFi(promise: Promise) {
        publishSession?.close()
        subscribeSession?.close()
        awareSession?.close()
        publishSession = null
        subscribeSession = null
        awareSession = null
        for ((_, link) in links) {
            runCatching { link.socket.close() }
        }
        links.clear()
        promise.resolve(null)
    }

    // ---- Write to a connected peer -------------------------------------------

    @ReactMethod
    fun writeToWiFiLink(linkID: String, dataBase64: String, promise: Promise) {
        val link = links[linkID]
        if (link == null) {
            promise.reject("LINK_NOT_FOUND", "No active WiFi link: $linkID")
            return
        }
        ioExecutor.execute {
            try {
                val data = Base64.decode(dataBase64, Base64.NO_WRAP)
                // Length-prefixed frame: [4-byte BE length][data]
                val frame = ByteArray(4 + data.size)
                val len = data.size
                frame[0] = (len shr 24).toByte()
                frame[1] = (len shr 16).toByte()
                frame[2] = (len shr 8).toByte()
                frame[3] = len.toByte()
                data.copyInto(frame, 4)
                link.output.write(frame)
                link.output.flush()
                promise.resolve(null)
            } catch (e: Exception) {
                Log.e(TAG, "Write failed on $linkID: ${e.message}")
                handleLinkClose(linkID)
                promise.reject("WRITE_FAILED", e.message, e)
            }
        }
    }

    // ---- Required NativeEventEmitter contract --------------------------------

    @ReactMethod
    fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
        listenerCount++
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        listenerCount = maxOf(0, listenerCount - count)
    }

    // ---- Publish (advertiser role) -------------------------------------------

    private fun startPublish(session: WifiAwareSession) {
        val config = PublishConfig.Builder()
            .setServiceName(SERVICE_NAME)
            .build()

        session.publish(config, object : DiscoverySessionCallback() {
            override fun onPublishStarted(publishSession: PublishDiscoverySession) {
                this@AirhopWiFiModule.publishSession = publishSession
                Log.d(TAG, "WiFi Aware publish started")
                // Start server socket to accept incoming connections from subscribers.
                startServerSocket(publishSession)
            }

            override fun onSessionTerminated() {
                Log.d(TAG, "Publish session terminated")
                publishSession = null
            }

            override fun onMessageReceived(peerHandle: PeerHandle, message: ByteArray) {
                // Subscriber sent a connection initiation message. Open a network
                // to their peer handle and establish a socket.
                openNetworkToSubscriber(publishSession!!, peerHandle)
            }
        }, null)
    }

    // ---- Subscribe (discoverer role) -----------------------------------------

    private fun startSubscribe(session: WifiAwareSession) {
        val config = SubscribeConfig.Builder()
            .setServiceName(SERVICE_NAME)
            .build()

        session.subscribe(config, object : DiscoverySessionCallback() {
            override fun onSubscribeStarted(subscribeSession: SubscribeDiscoverySession) {
                this@AirhopWiFiModule.subscribeSession = subscribeSession
                Log.d(TAG, "WiFi Aware subscribe started")
            }

            override fun onServiceDiscovered(
                peerHandle: PeerHandle,
                serviceSpecificInfo: ByteArray?,
                matchFilter: List<ByteArray>?,
            ) {
                Log.d(TAG, "Discovered WiFi Aware peer: $peerHandle")
                // Send a connection initiation message so the publisher opens a socket.
                subscribeSession?.sendMessage(peerHandle, 0, byteArrayOf(0x01))
                openNetworkToPublisher(subscribeSession!!, peerHandle)
            }

            override fun onSessionTerminated() {
                Log.d(TAG, "Subscribe session terminated")
                subscribeSession = null
            }
        }, null)
    }

    // ---- Network / socket helpers --------------------------------------------

    // Publisher side: open a server socket and wait for the subscriber to connect.
    private fun startServerSocket(publishSession: PublishDiscoverySession) {
        ioExecutor.execute {
            try {
                val serverSocket = ServerSocket(AWARE_PORT)
                Log.d(TAG, "Publisher server socket listening on $AWARE_PORT")
                while (!serverSocket.isClosed) {
                    val client = serverSocket.accept()
                    val id = "wifi-pub-${linkCounter.incrementAndGet()}"
                    registerLink(id, client)
                }
            } catch (e: Exception) {
                Log.d(TAG, "Server socket closed: ${e.message}")
            }
        }
    }

    // Subscriber side: request a network to the publisher's peer handle.
    private fun openNetworkToPublisher(
        session: SubscribeDiscoverySession,
        peerHandle: PeerHandle,
    ) {
        val specifier = WifiAwareNetworkSpecifier.Builder(session, peerHandle)
            .setPskPassphrase("airhop-aware-psk")
            .setPort(AWARE_PORT)
            .build()

        requestAwareNetwork(specifier) { network ->
            ioExecutor.execute {
                try {
                    val socket = network.socketFactory.createSocket(
                        network.getByName("192.168.49.1"), AWARE_PORT
                    )
                    val id = "wifi-sub-${linkCounter.incrementAndGet()}"
                    registerLink(id, socket)
                } catch (e: Exception) {
                    Log.e(TAG, "Subscriber connect failed: ${e.message}")
                }
            }
        }
    }

    // Publisher side: open an outbound network to the subscriber after receiving their message.
    private fun openNetworkToSubscriber(
        session: PublishDiscoverySession,
        peerHandle: PeerHandle,
    ) {
        val specifier = WifiAwareNetworkSpecifier.Builder(session, peerHandle)
            .setPskPassphrase("airhop-aware-psk")
            .build()

        requestAwareNetwork(specifier) { _ ->
            // The subscriber connects to our ServerSocket; nothing more needed here.
        }
    }

    private fun requestAwareNetwork(
        specifier: WifiAwareNetworkSpecifier,
        onAvailable: (Network) -> Unit,
    ) {
        val request = NetworkRequest.Builder()
            .addTransportType(NetworkCapabilities.TRANSPORT_WIFI_AWARE)
            .setNetworkSpecifier(specifier)
            .build()

        connectivityManager.requestNetwork(request, object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                onAvailable(network)
            }
            override fun onLost(network: Network) {
                Log.d(TAG, "WiFi Aware network lost")
            }
        })
    }

    // Register a connected socket as a named link and start its read loop.
    private fun registerLink(id: String, socket: Socket) {
        val output = socket.getOutputStream()
        val link = LinkState(id, socket, output)
        links[id] = link
        emitEvent(EVT_LINK_CONNECTED, WritableNativeMap().apply { putString("linkID", id) })
        Log.d(TAG, "WiFi Aware link connected: $id")
        startReadLoop(id, socket.getInputStream())
    }

    // Read length-prefixed frames from the socket and emit them as events.
    private fun startReadLoop(linkID: String, input: InputStream) {
        ioExecutor.execute {
            val lenBuf = ByteArray(4)
            try {
                while (true) {
                    // Read 4-byte BE length prefix.
                    var read = 0
                    while (read < 4) {
                        val n = input.read(lenBuf, read, 4 - read)
                        if (n < 0) throw java.io.EOFException("EOF in length prefix")
                        read += n
                    }
                    val len = ((lenBuf[0].toInt() and 0xff) shl 24) or
                              ((lenBuf[1].toInt() and 0xff) shl 16) or
                              ((lenBuf[2].toInt() and 0xff) shl 8) or
                              (lenBuf[3].toInt() and 0xff)

                    if (len <= 0 || len > MAX_FRAME) {
                        throw Exception("WiFi link $linkID: invalid frame length $len")
                    }

                    val data = ByteArray(len)
                    var received = 0
                    while (received < len) {
                        val n = input.read(data, received, len - received)
                        if (n < 0) throw java.io.EOFException("EOF in frame body")
                        received += n
                    }

                    val dataBase64 = Base64.encodeToString(data, Base64.NO_WRAP)
                    emitEvent(EVT_PACKET_RECEIVED, WritableNativeMap().apply {
                        putString("linkID", linkID)
                        putString("dataBase64", dataBase64)
                    })
                }
            } catch (e: Exception) {
                Log.d(TAG, "Read loop ended for $linkID: ${e.message}")
                handleLinkClose(linkID)
            }
        }
    }

    private fun handleLinkClose(linkID: String) {
        val link = links.remove(linkID) ?: return
        runCatching { link.socket.close() }
        emitEvent(EVT_LINK_DISCONNECTED, WritableNativeMap().apply { putString("linkID", linkID) })
    }

    private fun emitEvent(name: String, params: WritableNativeMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit(name, params)
    }
}
