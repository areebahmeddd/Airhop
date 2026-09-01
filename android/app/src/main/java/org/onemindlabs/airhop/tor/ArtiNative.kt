// Kotlin bindings for Airhop's embedded Tor client.
//
// The native side is native/arti, one Rust crate shared with iOS. Every method
// here has an exact counterpart in the C ABI that AirhopTorManager.swift binds,
// so "Tor is on" means the same thing on both platforms and there is one
// implementation to fix when it does not.
//
// Nothing above this file knows about JNI, and nothing below it knows about
// React Native.
package org.onemindlabs.airhop.tor

/**
 * What Arti reports about itself.
 *
 * Decoded from the packed word `nativeStatus` returns. The native side owns
 * this state and nothing here caches it: asking is a lock and a few bit shifts,
 * which is cheaper than the bookkeeping a mirror would need to stay honest.
 */
data class ArtiStatus(
    /** A client exists and its SOCKS listener is accepting. */
    val running: Boolean,
    /**
     * Bootstrapped and carrying traffic. The only flag that may be used to claim
     * the user's traffic is onion routed.
     */
    val ready: Boolean,
    /**
     * Arti cannot make forward progress. This is what a network that blocks Tor
     * produces, and it is deliberately distinct from "still at 30%": without it
     * the app cannot tell a slow start from a dead one and says "starting"
     * forever.
     */
    val blocked: Boolean,
    /** 0 to 100. Arti's own estimate. */
    val progress: Int,
) {
    companion object {
        /** Mirrors AIRHOP_TOR_STATUS_* in native/arti/src/lib.rs. */
        private const val BIT_RUNNING = 1 shl 0
        private const val BIT_READY = 1 shl 1
        private const val BIT_BLOCKED = 1 shl 2
        private const val PROGRESS_SHIFT = 8

        fun decode(packed: Int): ArtiStatus = ArtiStatus(
            running = packed and BIT_RUNNING != 0,
            ready = packed and BIT_READY != 0,
            blocked = packed and BIT_BLOCKED != 0,
            progress = (packed shr PROGRESS_SHIFT) and 0xFF,
        )

        val STOPPED = ArtiStatus(running = false, ready = false, blocked = false, progress = 0)
    }
}

object ArtiNative {

    /** Return codes, mirroring AIRHOP_TOR_* in native/arti/src/lib.rs. */
    const val OK = 0
    const val ERR_ALREADY_RUNNING = -1
    const val ERR_DATA_DIR = -2
    const val ERR_RUNTIME = -3
    const val ERR_CLIENT = -4
    const val ERR_BIND = -5
    const val ERR_NOT_RUNNING = -6

    /**
     * Whether the native library loaded.
     *
     * An ABI without `libarti_airhop.so`, or a build where it was not packaged,
     * must degrade to "Tor unavailable" rather than taking the process down with
     * an UnsatisfiedLinkError the first time somebody opens Settings.
     */
    @JvmStatic
    val isAvailable: Boolean = try {
        System.loadLibrary("arti_airhop")
        true
    } catch (_: UnsatisfiedLinkError) {
        false
    } catch (_: SecurityException) {
        false
    }

    /**
     * Start Tor and bind its SOCKS5 listener on `127.0.0.1:socksPort`.
     *
     * Returns [OK] once the listener is accepting, which is before the first
     * circuit exists. Blocks while the client is constructed and the port is
     * bound, so callers keep it off the main thread.
     */
    @JvmStatic
    fun start(dataDir: String, socksPort: Int): Int =
        if (isAvailable) nativeStart(dataDir, socksPort) else ERR_CLIENT

    /** Stop Tor, drop the client and release the port. */
    @JvmStatic
    fun stop(): Int = if (isAvailable) nativeStop() else ERR_NOT_RUNNING

    /**
     * Put Tor to sleep or wake it, for the app leaving and re-entering the
     * foreground.
     *
     * Not a stop. Android does not suspend the process the way iOS does, and the
     * foreground service keeps it alive, so without this a backgrounded Airhop
     * would keep a consensus fresh all day on a battery.
     */
    @JvmStatic
    fun setDormant(dormant: Boolean): Int =
        if (isAvailable) nativeSetDormant(dormant) else ERR_NOT_RUNNING

    /** Safe to call at any time, including before a start and after a stop. */
    @JvmStatic
    fun status(): ArtiStatus =
        if (isAvailable) ArtiStatus.decode(nativeStatus()) else ArtiStatus.STOPPED

    /** Arti's own description of the current stage. Display and logs only. */
    @JvmStatic
    fun summary(): String = if (isAvailable) nativeSummary().orEmpty() else ""

    private external fun nativeStart(dataDir: String, socksPort: Int): Int
    private external fun nativeStop(): Int
    private external fun nativeSetDormant(dormant: Boolean): Int
    private external fun nativeStatus(): Int
    private external fun nativeSummary(): String?
}
