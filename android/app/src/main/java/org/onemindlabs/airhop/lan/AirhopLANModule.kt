package org.onemindlabs.airhop.lan

// The LAN transport: mDNS discovery over ordinary TCP.
//
// The only transport that reaches an iPhone from an Android phone over
// something other than Bluetooth. WiFi Aware cannot, because Apple demands a
// paired data path Android has no way to complete. This is plain IP, so it does
// not care which phone anyone owns.
//
// Framing, the accept loop, the read loop and the link registry are the same
// shapes AirhopWiFiModule uses, deliberately: both carry the same length-
// prefixed Airhop packets, so a bug fixed in one is recognisable in the other.
// What differs is above the socket. Aware connects to whatever it finds; this
// connects only where it is told to, because mDNS returns everyone and
// connecting to everyone is a full mesh. That decision lives in TypeScript
// (services/lan-dial-policy.ts).
//
// The instance name comes from TypeScript and is never the peer ID. See
// services/lan-controller.ts for why it rotates.

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.ConnectivityManager
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.net.wifi.WifiManager
import android.os.Build
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.InputStream
import java.io.OutputStream
import java.net.Inet4Address
import java.net.InetAddress
import java.net.NetworkInterface
import java.net.ServerSocket
import java.net.Socket
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicInteger

private const val TAG = "AirhopLANModule"

// The service type every Airhop device publishes and browses for. Matches the
// `NSBonjourServices` entry in the iOS Info.plist byte for byte; a mismatch is
// two apps that cannot see each other.
//
// Not Wi-Fi Aware's `_airhop-mesh-v1._tcp`. Two services, named apart so neither
// reads as a typo of the other: Aware is a radio protocol needing no network,
// this is mDNS over an ordinary one.
private const val SERVICE_TYPE = "_airhop-lan-v1._tcp"

// Interface names that can carry local peers: WiFi joined or served, ethernet,
// USB tethering. Cellular (rmnet, ccmni) is absent because nobody else is on it.
// Android identifies its own access point the same way, by name
// (config_tether_wifi_regexs).
private val LOCAL_IFACE_PREFIXES =
    arrayOf("wlan", "softap", "ap", "swlan", "eth", "rndis", "usb")

private const val EVT_PEER_DISCOVERED = "AirhopLAN.peerDiscovered"
private const val EVT_PEER_LOST = "AirhopLAN.peerLost"
private const val EVT_LINK_CONNECTED = "AirhopLAN.linkConnected"
private const val EVT_LINK_DISCONNECTED = "AirhopLAN.linkDisconnected"
private const val EVT_PACKET_RECEIVED = "AirhopLAN.packetReceived"
private const val EVT_AVAILABILITY_CHANGED = "AirhopLAN.availabilityChanged"

// Matches AirhopWiFiModule and the iOS side: 64 KiB of payload plus the prefix.
private const val MAX_FRAME = 65544

// A read deadline is what turns a half-open link into a closed one. Without it
// a socket whose far side vanished without a FIN sits in `links` until a write
// happens to fail, and the courier counts links to decide whether it has anyone
// to hand mail to. Same value and same reason as the WiFi module.
private const val READ_TIMEOUT_MS = 90_000
private const val MAX_IDLE_TIMEOUTS = 3

// How long to wait for a dial before giving up. Client isolation, which most
// guest networks enable, shows up here as a connect that never completes rather
// than as a refusal, so an unbounded connect would hold a thread forever.
private const val CONNECT_TIMEOUT_MS = 5_000

class AirhopLANModule(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AirhopLAN"

    // Resolved per call, never cached: a service not yet ready when the module
    // is constructed would otherwise latch null for the life of the process.
    // Same reasoning as AirhopWiFiModule.awareManager().
    private fun nsdManager(): NsdManager? =
        try {
            reactContext.applicationContext.getSystemService(NsdManager::class.java)
        } catch (_: Exception) {
            null
        }

    private fun wifiManager(): WifiManager? =
        try {
            reactContext.applicationContext.getSystemService(WifiManager::class.java)
        } catch (_: Exception) {
            null
        }

    private val ioExecutor = Executors.newCachedThreadPool()
    private val linkCounter = AtomicInteger(0)

    private class LinkState(
        val id: String,
        val socket: Socket,
        val output: OutputStream,
        val writeLock: Any = Any(),
    )

    private val links = ConcurrentHashMap<String, LinkState>()

    // Peers mDNS has resolved, keyed by the name they publish. Held because a
    // dial arrives from TypeScript naming a peer, not an address.
    private class Resolved(val host: InetAddress, val port: Int)

    private val discovered = ConcurrentHashMap<String, Resolved>()

    // Which peer each open link belongs to, and the reverse.
    //
    // Held so a repeat dial for a peer already linked can resolve without
    // opening a second socket. TypeScript walks its dial plan on a timer, since
    // a link can drop while the peer's mDNS record stays visible, and it does
    // not track which names are linked: that is this module's knowledge.
    private val linkByName = ConcurrentHashMap<String, String>()
    private val nameByLink = ConcurrentHashMap<String, String>()

    private var serverSocket: ServerSocket? = null
    private var serverPort: Int = 0
    private var instanceName: String? = null

    private var registrationListener: NsdManager.RegistrationListener? = null
    private var discoveryListener: NsdManager.DiscoveryListener? = null
    private var networkReceiver: BroadcastReceiver? = null

    // Multicast is dropped by WiFi power save unless something holds this lock,
    // which is why the app can find peers while the screen is on and silently
    // stops the moment it is off. Held for as long as the transport runs.
    private var multicastLock: WifiManager.MulticastLock? = null

    // Which set of listeners is current. Bumped by teardown, so one we stopped
    // ourselves is told apart from one dropped under us: both arrive as the same
    // callback, and only the second is a reason to restart.
    private val sessionGeneration = AtomicInteger(0)

    // Resolves run one at a time below API 34.
    //
    // NsdManager.resolveService is documented as one outstanding resolve per
    // manager, and issuing a second while the first is in flight fails both with
    // FAILURE_ALREADY_ACTIVE. mDNS answers arrive as a burst, one per device, so
    // this is the ordinary case rather than a race. API 34 added
    // registerServiceInfoCallback, which has no such limit, but the floor here
    // is lower than that.
    private val resolveQueue = ArrayDeque<NsdServiceInfo>()
    private var resolving = false
    private val resolveLock = Any()

    // ---- Lifecycle -----------------------------------------------------------

    @ReactMethod
    fun startLAN(instanceName: String, promise: Promise) {
        val nsd = nsdManager()
        if (nsd == null) {
            promise.reject("LAN_UNSUPPORTED", "This device has no mDNS service")
            return
        }
        if (this.instanceName != null) {
            // Already running under some name. Idempotent, as the reconciler
            // expects: it calls start whenever it is unsure.
            promise.resolve(null)
            return
        }
        if (!hasLocalNetwork()) {
            promise.reject("LAN_UNAVAILABLE", "No local network to publish on")
            return
        }
        if (!ensureServerSocket()) {
            promise.reject("LAN_LISTEN_FAILED", "Could not open the LAN server socket")
            return
        }

        this.instanceName = instanceName
        acquireMulticastLock()
        registerNetworkReceiver()

        try {
            registerService(nsd, instanceName)
            startDiscovery(nsd)
        } catch (e: SecurityException) {
            // Android 16 opts in and Android 17 enforces ACCESS_LOCAL_NETWORK.
            // A refusal here is the user's answer, not a fault, and it clears
            // if they grant it later.
            teardown()
            promise.reject("PERMISSION_DENIED", "Local network access refused", e)
            return
        } catch (e: Exception) {
            teardown()
            promise.reject("LAN_LISTEN_FAILED", e.message, e)
            return
        }
        promise.resolve(null)
    }

    @ReactMethod
    fun stopLAN(promise: Promise) {
        teardown()
        promise.resolve(null)
    }

    // Synchronized because reporting a dead publish or browse calls this from an
    // NsdManager callback, which can meet stopLAN arriving on the bridge thread.
    // Reentrant, so the call in startLAN's own failure path is unaffected.
    @Synchronized
    private fun teardown() {
        sessionGeneration.incrementAndGet()
        val nsd = nsdManager()
        registrationListener?.let { runCatching { nsd?.unregisterService(it) } }
        registrationListener = null
        discoveryListener?.let { runCatching { nsd?.stopServiceDiscovery(it) } }
        discoveryListener = null

        networkReceiver?.let { runCatching { reactContext.unregisterReceiver(it) } }
        networkReceiver = null

        multicastLock?.let { runCatching { if (it.isHeld) it.release() } }
        multicastLock = null

        runCatching { serverSocket?.close() }
        serverSocket = null
        serverPort = 0
        instanceName = null

        for (id in links.keys.toList()) handleLinkClose(id)
        links.clear()
        discovered.clear()
        linkByName.clear()
        nameByLink.clear()
        synchronized(resolveLock) {
            resolveQueue.clear()
            resolving = false
        }
    }

    // Whether there is anywhere for mDNS to run. Not ConnectivityManager's
    // active network: a phone sharing its connection serves a network rather
    // than joining one, so it has no Network object and, with mobile data off,
    // no active network at all. A link-local 169.254 address does not count.
    //
    // Not gated on whether Android serves mDNS on a tethering interface (13 and
    // up does). That ships through Play system updates, so the OS version does
    // not answer it, and a host nobody answers reads the same as an empty
    // network, which this transport already reports honestly.
    private fun hasLocalNetwork(): Boolean =
        try {
            NetworkInterface.getNetworkInterfaces().asSequence().any { iface ->
                iface.isUp &&
                    !iface.isLoopback &&
                    LOCAL_IFACE_PREFIXES.any { iface.name.startsWith(it) } &&
                    iface.inetAddresses.asSequence().any {
                        it is Inet4Address && !it.isLinkLocalAddress
                    }
            }
        } catch (_: Exception) {
            // Saying no costs one backoff step and the reconciler asks again.
            // Saying yes opens a listener with nowhere to listen.
            false
        }

    // mDNS stopped working under us: the publish was refused, or the system
    // dropped the browse. Torn down here rather than waiting for the
    // controller's stopLAN, which is a bridge hop away: a start landing in that
    // window would find `instanceName` still set and resolve as already running
    // over a dead transport.
    //
    // Ignored once the generation has moved, since teardown stops these
    // listeners itself and gets the same callbacks for it.
    private fun reportUnavailable(reason: String, generation: Int) {
        if (generation != sessionGeneration.get()) return
        Log.w(TAG, "LAN $reason")
        teardown()
        emitEvent(
            EVT_AVAILABILITY_CHANGED,
            WritableNativeMap().apply { putBoolean("available", false) },
        )
    }

    private fun acquireMulticastLock() {
        if (multicastLock != null) return
        multicastLock = try {
            wifiManager()?.createMulticastLock("airhop-lan")?.apply {
                setReferenceCounted(false)
                acquire()
            }
        } catch (e: Exception) {
            // Not fatal. Discovery still works with the screen on, which is
            // when most of it happens, so a missing lock is a degradation
            // rather than a reason to refuse the transport.
            Log.w(TAG, "No multicast lock: ${e.message}")
            null
        }
    }

    // The interface going away is the case that is otherwise unrecoverable: the
    // listener and the browser are dead while this module still believes it is
    // running, so every later start resolves instantly having done nothing.
    private fun registerNetworkReceiver() {
        if (networkReceiver != null) return
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                emitEvent(
                    EVT_AVAILABILITY_CHANGED,
                    WritableNativeMap().apply { putBoolean("available", hasLocalNetwork()) },
                )
            }
        }
        val filter = IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION).apply {
            // A hotspot starting or stopping does not reliably raise
            // CONNECTIVITY_ACTION. Named rather than referenced: the constant is
            // on TetheringManager (API 30) and ConnectivityManager's copy is
            // hidden.
            addAction("android.net.conn.TETHER_STATE_CHANGED")
        }
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                reactContext.registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED)
            } else {
                @Suppress("UnspecifiedRegisterReceiverFlag")
                reactContext.registerReceiver(receiver, filter)
            }
            networkReceiver = receiver
        } catch (e: Exception) {
            Log.w(TAG, "Could not watch the network state: ${e.message}")
        }
    }

    // ---- Discovery -----------------------------------------------------------

    private fun registerService(nsd: NsdManager, name: String) {
        val generation = sessionGeneration.get()
        val info = NsdServiceInfo().apply {
            serviceName = name
            serviceType = SERVICE_TYPE
            port = serverPort
        }
        val listener = object : NsdManager.RegistrationListener {
            override fun onServiceRegistered(info: NsdServiceInfo) {
                Log.d(TAG, "Published as ${info.serviceName}")
            }

            override fun onRegistrationFailed(info: NsdServiceInfo, errorCode: Int) {
                reportUnavailable("publish refused: $errorCode", generation)
            }

            override fun onServiceUnregistered(info: NsdServiceInfo) = Unit
            override fun onUnregistrationFailed(info: NsdServiceInfo, errorCode: Int) = Unit
        }
        registrationListener = listener
        nsd.registerService(info, NsdManager.PROTOCOL_DNS_SD, listener)
    }

    private fun startDiscovery(nsd: NsdManager) {
        val generation = sessionGeneration.get()
        val listener = object : NsdManager.DiscoveryListener {
            override fun onDiscoveryStarted(serviceType: String) = Unit

            override fun onServiceFound(info: NsdServiceInfo) {
                // Our own record comes back off the network like anyone else's.
                if (info.serviceName == instanceName) return
                enqueueResolve(info)
            }

            override fun onServiceLost(info: NsdServiceInfo) {
                discovered.remove(info.serviceName)
                emitEvent(
                    EVT_PEER_LOST,
                    WritableNativeMap().apply { putString("serviceName", info.serviceName) },
                )
            }

            override fun onDiscoveryStopped(serviceType: String) {
                reportUnavailable("browse stopped", generation)
            }

            override fun onStartDiscoveryFailed(serviceType: String, errorCode: Int) {
                reportUnavailable("browse refused: $errorCode", generation)
            }

            override fun onStopDiscoveryFailed(serviceType: String, errorCode: Int) = Unit
        }
        discoveryListener = listener
        nsd.discoverServices(SERVICE_TYPE, NsdManager.PROTOCOL_DNS_SD, listener)
    }

    private fun enqueueResolve(info: NsdServiceInfo) {
        synchronized(resolveLock) {
            resolveQueue.addLast(info)
            if (resolving) return
            resolving = true
        }
        drainResolves()
    }

    private fun drainResolves() {
        val next = synchronized(resolveLock) {
            val head = resolveQueue.removeFirstOrNull()
            if (head == null) resolving = false
            head
        } ?: return

        val nsd = nsdManager()
        if (nsd == null) {
            synchronized(resolveLock) { resolving = false }
            return
        }

        @Suppress("DEPRECATION")
        nsd.resolveService(
            next,
            object : NsdManager.ResolveListener {
                override fun onResolveFailed(info: NsdServiceInfo, errorCode: Int) {
                    Log.d(TAG, "Resolve failed for ${info.serviceName}: $errorCode")
                    drainResolves()
                }

                override fun onServiceResolved(info: NsdServiceInfo) {
                    val host = info.host
                    if (host != null && info.serviceName != instanceName) {
                        discovered[info.serviceName] = Resolved(host, info.port)
                        // The name only. The address stays here, in
                        // `discovered`, because it is this module's business to
                        // dial and nobody above needs it.
                        emitEvent(
                            EVT_PEER_DISCOVERED,
                            WritableNativeMap().apply {
                                putString("serviceName", info.serviceName)
                            },
                        )
                    }
                    drainResolves()
                }
            },
        )
    }

    // ---- Links ---------------------------------------------------------------

    @ReactMethod
    fun connectToPeer(serviceName: String, promise: Promise) {
        val peer = discovered[serviceName]
        if (peer == null) {
            promise.reject("UNKNOWN_PEER", "No resolved peer named $serviceName")
            return
        }
        // Idempotent. The caller re-walks its plan on a timer to heal a dropped
        // link, and asking for one that is already up must cost a resolve, not
        // a second socket.
        val existing = linkByName[serviceName]
        if (existing != null && links.containsKey(existing)) {
            promise.resolve(null)
            return
        }
        try {
            ioExecutor.execute {
                try {
                    val socket = Socket()
                    socket.connect(
                        java.net.InetSocketAddress(peer.host, peer.port),
                        CONNECT_TIMEOUT_MS,
                    )
                    registerLink(
                        "lan-out-${linkCounter.incrementAndGet()}",
                        socket,
                        serviceName,
                    )
                    promise.resolve(null)
                } catch (e: Exception) {
                    // Most often client isolation, which every guest network
                    // enables and which cannot be detected before trying.
                    Log.d(TAG, "Dial to $serviceName failed: ${e.message}")
                    promise.reject("CONNECT_FAILED", e.message, e)
                }
            }
        } catch (e: Exception) {
            promise.reject("CONNECT_FAILED", "LAN transport is shutting down", e)
        }
    }

    private fun ensureServerSocket(): Boolean {
        if (serverSocket != null) return true
        return try {
            val socket = ServerSocket(0)
            serverSocket = socket
            serverPort = socket.localPort
            ioExecutor.execute { acceptLoop(socket) }
            true
        } catch (e: Exception) {
            Log.e(TAG, "Could not open the LAN server socket: ${e.message}")
            false
        }
    }

    private fun acceptLoop(socket: ServerSocket) {
        while (!socket.isClosed) {
            val client = try {
                socket.accept()
            } catch (e: Exception) {
                Log.d(TAG, "Accept loop ended: ${e.message}")
                return
            }
            registerLink("lan-in-${linkCounter.incrementAndGet()}", client)
        }
    }

    // `serviceName` is known only for a dial we made. An accepted connection is
    // anonymous until its peer announces, and nothing here needs to know: the
    // name is used solely to answer "already connected" for an outbound dial.
    private fun registerLink(id: String, socket: Socket, serviceName: String? = null) {
        try {
            socket.tcpNoDelay = true
            socket.soTimeout = READ_TIMEOUT_MS
            val output = socket.getOutputStream()
            links[id] = LinkState(id, socket, output)
            if (serviceName != null) {
                linkByName[serviceName] = id
                nameByLink[id] = serviceName
            }
            emitEvent(EVT_LINK_CONNECTED, WritableNativeMap().apply { putString("linkID", id) })
            Log.d(TAG, "LAN link connected: $id")
            startReadLoop(id, socket.getInputStream())
        } catch (e: Exception) {
            Log.e(TAG, "Could not register link $id: ${e.message}")
            runCatching { socket.close() }
        }
    }

    @ReactMethod
    fun writeToLANLink(linkID: String, dataBase64: String, promise: Promise) {
        val link = links[linkID]
        if (link == null) {
            promise.reject("UNKNOWN_LINK", "No active LAN link: $linkID")
            return
        }
        val data = try {
            Base64.decode(dataBase64, Base64.NO_WRAP)
        } catch (e: Exception) {
            promise.reject("INVALID_DATA", "Invalid base64 payload", e)
            return
        }
        if (data.size > MAX_FRAME - 4) {
            promise.reject("FRAME_TOO_LARGE", "Frame of ${data.size} exceeds the peer's read limit")
            return
        }
        try {
            ioExecutor.execute {
                try {
                    val frame = ByteArray(4 + data.size)
                    val len = data.size
                    frame[0] = (len shr 24).toByte()
                    frame[1] = (len shr 16).toByte()
                    frame[2] = (len shr 8).toByte()
                    frame[3] = len.toByte()
                    data.copyInto(frame, 4)
                    synchronized(link.writeLock) {
                        link.output.write(frame)
                        link.output.flush()
                    }
                    promise.resolve(null)
                } catch (e: Exception) {
                    Log.e(TAG, "Write failed on $linkID: ${e.message}")
                    handleLinkClose(linkID)
                    promise.reject("WRITE_FAILED", e.message, e)
                }
            }
        } catch (e: Exception) {
            promise.reject("LINK_CLOSED", "LAN transport is shutting down", e)
        }
    }

    private fun startReadLoop(linkID: String, input: InputStream) {
        ioExecutor.execute {
            val lenBuf = ByteArray(4)
            var idleTimeouts = 0
            while (true) {
                try {
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
                        throw Exception("LAN link $linkID: invalid frame length $len")
                    }
                    val payload = ByteArray(len)
                    var got = 0
                    while (got < len) {
                        val n = input.read(payload, got, len - got)
                        if (n < 0) throw java.io.EOFException("EOF in payload")
                        got += n
                    }
                    idleTimeouts = 0
                    emitEvent(
                        EVT_PACKET_RECEIVED,
                        WritableNativeMap().apply {
                            putString("linkID", linkID)
                            putString("dataBase64", Base64.encodeToString(payload, Base64.NO_WRAP))
                        },
                    )
                } catch (e: java.net.SocketTimeoutException) {
                    // A quiet link is not a dead one. Only a run of deadlines
                    // with nothing in between says the far side is gone.
                    idleTimeouts++
                    if (idleTimeouts >= MAX_IDLE_TIMEOUTS) {
                        Log.d(TAG, "Link $linkID idle past the deadline, closing")
                        handleLinkClose(linkID)
                        return@execute
                    }
                } catch (e: Exception) {
                    Log.d(TAG, "Read loop ended for $linkID: ${e.message}")
                    handleLinkClose(linkID)
                    return@execute
                }
            }
        }
    }

    private fun handleLinkClose(linkID: String) {
        val link = links.remove(linkID) ?: return
        val name = nameByLink.remove(linkID)
        // Only if it still points here: a newer link may have claimed the name,
        // and clearing it would make the live one look absent.
        if (name != null && linkByName[name] == linkID) linkByName.remove(name)
        runCatching { link.socket.close() }
        emitEvent(EVT_LINK_DISCONNECTED, WritableNativeMap().apply { putString("linkID", linkID) })
    }

    // ---- Required NativeEventEmitter contract --------------------------------

    @ReactMethod
    fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
        // Subscriptions are tracked on the JS side.
    }

    @ReactMethod
    fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Double) {
        // Subscriptions are tracked on the JS side.
    }

    override fun invalidate() {
        teardown()
        ioExecutor.shutdownNow()
        super.invalidate()
    }

    private fun emitEvent(name: String, params: WritableNativeMap) {
        if (!reactContext.hasActiveReactInstance()) return
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(name, params)
        } catch (e: Exception) {
            Log.w(TAG, "Dropped $name: no JS runtime to receive it (${e.message})")
        }
    }
}
