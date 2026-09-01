// Kotlin bindings for the embedded Tor client in native/arti.
//
// One Rust crate backs both platforms, and every method here has a counterpart
// in the C ABI that AirhopTorManager.swift binds, so "Tor is on" means the same
// thing on either phone.
package org.onemindlabs.airhop.tor

// Decoded from the packed word nativeStatus returns. The native side owns this
// state and nothing here caches it: asking is a lock and a few bit shifts,
// cheaper than the bookkeeping a mirror needs to stay honest.
data class ArtiStatus(
    val running: Boolean,
    // Bootstrapped and carrying traffic. The only flag that may back a claim
    // that the user's traffic is onion routed.
    val ready: Boolean,
    // Arti cannot make forward progress, which is what a network blocking Tor
    // produces. Deliberately distinct from "still at 30%", or the app cannot
    // tell a slow start from a dead one.
    val blocked: Boolean,
    // 0 to 100, Arti's own estimate.
    val progress: Int,
) {
    companion object {
        // Mirrors AIRHOP_TOR_STATUS_* in native/arti/src/lib.rs.
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

    // Mirrors AIRHOP_TOR_* in native/arti/src/lib.rs.
    const val OK = 0
    const val ERR_ALREADY_RUNNING = -1
    const val ERR_DATA_DIR = -2
    const val ERR_RUNTIME = -3
    const val ERR_CLIENT = -4
    const val ERR_BIND = -5
    const val ERR_NOT_RUNNING = -6

    // An ABI the library was not packaged for must degrade to "Tor unavailable"
    // rather than taking the process down the first time somebody opens Settings.
    @JvmStatic
    val isAvailable: Boolean = try {
        System.loadLibrary("arti_airhop")
        true
    } catch (_: UnsatisfiedLinkError) {
        false
    } catch (_: SecurityException) {
        false
    }

    // Returns once the SOCKS listener is accepting, which is before the first
    // circuit exists. Blocks while the client is built and the port bound, so
    // callers keep it off the main thread.
    @JvmStatic
    fun start(dataDir: String, socksPort: Int): Int =
        if (isAvailable) nativeStart(dataDir, socksPort) else ERR_CLIENT

    @JvmStatic
    fun stop(): Int = if (isAvailable) nativeStop() else ERR_NOT_RUNNING

    // Dormancy, not a stop, for the app leaving the foreground. Android
    // keeps the process alive through the foreground service, so without this a
    // backgrounded Airhop refreshes a consensus all day on a battery.
    @JvmStatic
    fun setDormant(dormant: Boolean): Int =
        if (isAvailable) nativeSetDormant(dormant) else ERR_NOT_RUNNING

    // Safe at any time, including before a start and after a stop.
    @JvmStatic
    fun status(): ArtiStatus =
        if (isAvailable) ArtiStatus.decode(nativeStatus()) else ArtiStatus.STOPPED

    // Arti's own description of the current stage. Display and logs only.
    @JvmStatic
    fun summary(): String = if (isAvailable) nativeSummary().orEmpty() else ""

    private external fun nativeStart(dataDir: String, socksPort: Int): Int
    private external fun nativeStop(): Int
    private external fun nativeSetDormant(dormant: Boolean): Int
    private external fun nativeStatus(): Int
    private external fun nativeSummary(): String?
}
