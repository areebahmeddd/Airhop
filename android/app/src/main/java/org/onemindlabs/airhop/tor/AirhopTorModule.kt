// React Native module exposing Airhop's embedded Tor client to TypeScript.
//
// Mirrors ios/Airhop/AirhopTorModule.swift method for method and event for
// event, so src/services/tor-routing.ts needs no platform branch.
//
// Protocol logic lives in TypeScript. This file knows about a proxy port and a
// bootstrap percentage, and nothing about packets, relays or encryption.
package org.onemindlabs.airhop.tor

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.File
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger

class AirhopTorModule(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "AirhopTorModule"
        const val NAME = "AirhopTorModule"

        // The single JS event, matching the iOS module.
        private const val EVT_STATUS = "TorStatusChanged"

        // The same port iOS uses. Not 9050, the standard Tor port: a Tor client
        // the user runs for something else must not be captured by us, or ours
        // by it.
        private const val SOCKS_PORT = 39050

        // Where Arti keeps its cached consensus, chosen guards and state.
        private const val DATA_DIR = "arti"

        // Ready is quiet but not final: circuits are lost and rebuilt, so a claim
        // that stops being true has to be withdrawn rather than left standing
        // until the user next opens the app.
        private const val POLL_ACTIVE_MS = 1_000L
        private const val POLL_IDLE_MS = 10_000L
    }

    override fun getName(): String = NAME

    // Start, stop and wipe are serialised onto one thread. Each blocks (a start
    // builds the client and binds the port, a stop waits for the runtime to wind
    // down) and running two at once is never meaningful.
    private val worker = Executors.newSingleThreadExecutor { r ->
        Thread(r, "airhop-tor-control").apply { isDaemon = true }
    }
    private val scheduler = Executors.newSingleThreadScheduledExecutor { r ->
        Thread(r, "airhop-tor-poll").apply { isDaemon = true }
    }

    // awaitTorReady gets its own thread instead of sharing the scheduler.
    //
    // It blocks for the caller's whole timeout, up to a minute, and the
    // scheduler has one thread: sharing them starved the status poll, so
    // TorStatusChanged went quiet during the window the Mesh banner exists to
    // narrate. Cached, not fixed, since waits are rare and overlap briefly.
    private val waiters = Executors.newCachedThreadPool { r ->
        Thread(r, "airhop-tor-await").apply { isDaemon = true }
    }

    // Both cross threads. `pollTask` is written by the scheduler thread as it
    // reschedules itself and by the JS thread when a stop cancels it;
    // `listenerCount` is written by the JS thread and read by the scheduler
    // thread before every emit.
    @Volatile
    private var pollTask: ScheduledFuture<*>? = null

    @Volatile
    private var listenerCount = 0

    // A poll belonging to a superseded attempt can still be scheduled, and
    // would otherwise report a stopped client as if it were the live one.
    private val attemptEpoch = AtomicInteger(0)

    // The last payload sent to JS, so an unchanged status is not re-sent.
    @Volatile
    private var lastEmitted: String? = null

    private fun dataDir(): File = File(reactContext.filesDir, DATA_DIR)

    // MARK: - JS-callable methods

    // Resolves once startup has been initiated, not once Tor is usable; use
    // awaitTorReady for that.
    //
    // The proxy is pointed at Tor before the client is built. A request made in
    // that window fails because nothing is listening yet, which is the point:
    // the alternative is traffic going out in the clear after the user asked
    // for Tor.
    @ReactMethod
    fun startTor(bridgeLines: String, promise: Promise) {
        AirhopTorProxy.route(SOCKS_PORT)
        val epoch = attemptEpoch.incrementAndGet()
        worker.execute {
            val dir = dataDir()
            dir.mkdirs()

            // Transports first: Arti needs the ports they landed on, and they
            // are assigned by the library rather than chosen.
            val wanted = AirhopTransport.namedIn(bridgeLines)
            val ports = AirhopIPtProxy.start(reactContext, wanted)
            if (ports == null) {
                // Fail closed. Starting Arti now would drop the bridge and take
                // a direct route for a user who asked not to have one.
                Log.w(TAG, "pluggable transports did not start")
                emitStatus()
                promise.reject("tor_transport_failed", "pluggable transports did not start")
                return@execute
            }

            val rc = ArtiNative.start(
                dir.absolutePath,
                SOCKS_PORT,
                bridgeLines,
                ports[AirhopTransport.OBFS4] ?: 0,
                ports[AirhopTransport.SNOWFLAKE] ?: 0,
            )
            if (rc != ArtiNative.OK && rc != ArtiNative.ERR_ALREADY_RUNNING) {
                Log.w(TAG, "arti start failed (rc=$rc)")
                AirhopIPtProxy.stop()
                emitStatus()
                // Rejected, not resolved, so the caller learns now.
                //
                // A start that fails outright will not succeed by waiting: the
                // library is missing for this ABI, or the state directory is
                // unwritable. Resolving would send JS into its 60-second
                // readiness wait to learn what this line already knows, and the
                // user would watch a spinner for a minute. The error path
                // instead unwinds and puts traffic back on a direct route.
                promise.reject("tor_start_failed", "arti start failed (rc=$rc)")
                return@execute
            }
            startPolling(epoch)
            promise.resolve(null)
        }
    }

    // Stop Arti and put traffic back on a direct connection.
    @ReactMethod
    fun stopTor(promise: Promise) {
        attemptEpoch.incrementAndGet()
        stopPolling()
        worker.execute {
            ArtiNative.stop()
            AirhopIPtProxy.stop()
            // Ordered after the stop, so there is no instant in which the proxy
            // is gone while something might still believe it is covered.
            AirhopTorProxy.route(null)
            emitStatus()
            promise.resolve(null)
        }
    }

    // Panic wipe only. The data directory holds a cached consensus, chosen
    // guards and timestamps, which together are evidence of the shape "this
    // device used Tor, from around here, at around this time".
    //
    // Stopping first, because a directory deleted under a running client is one
    // the client is free to write again.
    @ReactMethod
    fun wipeTorState(promise: Promise) {
        attemptEpoch.incrementAndGet()
        stopPolling()
        worker.execute {
            ArtiNative.stop()
            AirhopIPtProxy.wipeState(reactContext)
            AirhopTorProxy.route(null)
            val removed = dataDir().deleteRecursively()
            if (!removed) Log.w(TAG, "Arti data directory was not fully removed")
            lastEmitted = null
            emitStatus()
            promise.resolve(null)
        }
    }

    // Dormancy, not a stop. The foreground service keeps the process
    // alive, so without this a backgrounded Airhop refreshes a consensus all
    // day on a battery. A stop would drop the guards and cost a fresh bootstrap
    // on every return.
    @ReactMethod
    fun setAppForeground(foreground: Boolean, promise: Promise) {
        worker.execute {
            ArtiNative.setDormant(!foreground)
            promise.resolve(null)
        }
    }

    // The current status, in the same shape the iOS module resolves.
    @ReactMethod
    fun getTorStatus(promise: Promise) {
        promise.resolve(statusMap())
    }

    // Polls instead of waiting on a condition, because readiness lives in the
    // native client and is not ours to signal.
    @ReactMethod
    fun awaitTorReady(timeoutSeconds: Double, promise: Promise) {
        val deadline = System.nanoTime() + (timeoutSeconds * 1e9).toLong()
        waiters.execute {
            while (System.nanoTime() < deadline) {
                val status = ArtiNative.status()
                if (status.ready) {
                    promise.resolve(true)
                    return@execute
                }
                // Give up as soon as the answer is known. A bridge deadline runs
                // to three minutes, and Arti reporting a blockage, or a client
                // that is gone, is that answer already. startTor resolves only
                // after the client is running, so neither is a startup window.
                if (status.blocked || !status.running) {
                    promise.resolve(false)
                    return@execute
                }
                try {
                    Thread.sleep(200)
                } catch (_: InterruptedException) {
                    Thread.currentThread().interrupt()
                    break
                }
            }
            promise.resolve(ArtiNative.status().ready)
        }
    }

    // Required by the RCTEventEmitter contract the TypeScript spec declares.
    @ReactMethod
    fun addListener(eventName: String) {
        listenerCount += 1
    }

    @ReactMethod
    fun removeListeners(count: Double) {
        listenerCount = maxOf(0, listenerCount - count.toInt())
    }

    // MARK: - Status reporting

    private fun statusMap(): WritableNativeMap {
        val status = ArtiNative.status()
        return WritableNativeMap().apply {
            putBoolean("isReady", status.ready)
            // Running, not yet carrying traffic, and not stuck. Blocked is
            // not "starting": the banner has to be able to say the
            // network refused rather than spinning forever.
            putBoolean("isStarting", status.running && !status.ready && !status.blocked)
            // Matches iOS: the port is reported only once it is usable, so a
            // caller cannot read a port out of a status and dial into a circuit
            // that does not exist.
            putInt("port", if (status.ready) SOCKS_PORT else 0)
            putInt("progress", status.progress)
            putString("bootstrapSummary", ArtiNative.summary())
        }
    }

    private fun startPolling(epoch: Int) {
        stopPolling()
        schedulePoll(epoch, POLL_ACTIVE_MS)
    }

    private fun schedulePoll(epoch: Int, delayMs: Long) {
        pollTask = scheduler.schedule({
            if (epoch != attemptEpoch.get()) return@schedule
            val status = ArtiNative.status()
            emitStatus()
            // Nothing more will change on its own once Arti has given up, and a
            // timer that keeps asking a dead client is battery spent to learn
            // the same answer. The next start reschedules.
            if (status.blocked || !status.running) return@schedule
            schedulePoll(epoch, if (status.ready) POLL_IDLE_MS else POLL_ACTIVE_MS)
        }, delayMs, TimeUnit.MILLISECONDS)
    }

    private fun stopPolling() {
        pollTask?.cancel(false)
        pollTask = null
    }

    // Only when it has actually moved: a poll every second that emits every
    // second is a bridge crossing and a React render for an unchanged banner.
    private fun emitStatus() {
        if (listenerCount == 0) return
        val map = statusMap()
        val fingerprint = buildString {
            append(map.getBoolean("isReady"))
            append(map.getBoolean("isStarting"))
            append(map.getInt("progress"))
            append(map.getString("bootstrapSummary"))
        }
        if (fingerprint == lastEmitted) return
        lastEmitted = fingerprint
        if (!reactContext.hasActiveReactInstance()) return
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(EVT_STATUS, map)
        } catch (e: Exception) {
            // The JS runtime is going away underneath us. Nothing to report to.
            Log.w(TAG, "Could not emit Tor status: ${e.message}")
        }
    }

    override fun invalidate() {
        stopPolling()
        scheduler.shutdownNow()
        waiters.shutdownNow()
        worker.shutdown()
        super.invalidate()
    }
}
