// The pluggable transports Arti dials to reach a bridge, built from
// native/iptproxy.
//
// Arti would normally run obfs4 and Snowflake as child processes, which iOS
// forbids, so both platforms run them in-process behind a SOCKS5 listener each.
// This owns their lifecycle and reports the ports they landed on.
//
// Mirrors ios/Airhop/AirhopIPtProxy.swift.
package org.onemindlabs.airhop.tor

import IPtProxy.Controller
import android.content.Context
import android.util.Log
import java.io.File

enum class AirhopTransport(val id: String) {
    OBFS4("obfs4"),
    SNOWFLAKE("snowflake"),
    ;

    companion object {
        // The transports named by a newline-separated list of bridge lines.
        //
        // Reads the first word of each line, where the Tor bridge format puts
        // the transport name. Not a parser: Arti parses the lines
        // authoritatively in start, so a line this misreads is refused there
        // because its transport's port will be 0.
        fun namedIn(bridgeLines: String): Set<AirhopTransport> {
            val found = mutableSetOf<AirhopTransport>()
            for (raw in bridgeLines.lineSequence()) {
                val line = raw.trim()
                if (line.isEmpty() || line.startsWith("#")) continue
                val words = line.split(" ").filter { it.isNotEmpty() }.toMutableList()
                // The word `Bridge` may lead the line; the transport follows it.
                if (words.firstOrNull()?.lowercase() == "bridge") words.removeAt(0)
                when (words.firstOrNull()) {
                    OBFS4.id -> found.add(OBFS4)
                    SNOWFLAKE.id -> found.add(SNOWFLAKE)
                }
            }
            return found
        }
    }
}

object AirhopIPtProxy {

    private const val TAG = "AirhopIPtProxy"

    // Beside Arti's directory rather than inside it: the panic wipe deletes
    // both, and Arti owns the layout of its own.
    private const val STATE_DIR = "iptproxy"

    // Null until something asks for a transport: the controller writes to its
    // state directory on construction, so it is not built for a user who never
    // turns bridges on.
    private var controller: Controller? = null
    private val running = mutableSetOf<AirhopTransport>()

    fun stateDir(context: Context): File = File(context.filesDir, STATE_DIR)

    // Start [transports], returning the loopback port each landed on, or null if
    // any could not start.
    //
    // A null is fatal to the caller: Arti would otherwise be asked for a bridge
    // whose transport is missing, and a user who asked for a bridge is likely
    // somewhere a direct connection is unsafe.
    @Synchronized
    fun start(context: Context, transports: Set<AirhopTransport>): Map<AirhopTransport, Int>? {
        if (transports.isEmpty()) return emptyMap()
        val controller = ensureController(context) ?: return null

        val ports = mutableMapOf<AirhopTransport, Int>()
        for (transport in transports) {
            if (!running.contains(transport)) {
                try {
                    // No upstream proxy: Arti is the only thing dialling these.
                    controller.start(transport.id, "")
                } catch (e: Exception) {
                    Log.w(TAG, "${transport.id} did not start: ${e.message}")
                    stopLocked()
                    return null
                }
                running.add(transport)
            }
            // Ports are assigned by the library, never chosen. A zero means the
            // listener is not up despite start having returned.
            val port = controller.port(transport.id).toInt()
            if (port !in 1..65535) {
                Log.w(TAG, "${transport.id} reported port $port")
                stopLocked()
                return null
            }
            ports[transport] = port
        }
        return ports
    }

    @Synchronized
    fun stop() = stopLocked()

    // Panic wipe only: the state directory records which transports ran.
    @Synchronized
    fun wipeState(context: Context) {
        stopLocked()
        controller = null
        if (!stateDir(context).deleteRecursively()) {
            Log.w(TAG, "transport state directory was not fully removed")
        }
    }

    private fun stopLocked() {
        val controller = this.controller ?: return
        for (transport in running) {
            controller.stop(transport.id)
        }
        running.clear()
    }

    private fun ensureController(context: Context): Controller? {
        controller?.let { return it }

        val dir = stateDir(context)
        dir.mkdirs()

        // Logging off. The log records bridge addresses, which is the most
        // incriminating thing this device could write down, and nothing reads it.
        //
        // gomobile exposes the Go constructor as a Java one, so a Go-side nil
        // cannot surface as null here. It throws instead, and a failure to build
        // the controller has to stop the start rather than reach Arti.
        val created = try {
            Controller(dir.absolutePath, false, false, "ERROR", null)
        } catch (e: Exception) {
            Log.w(TAG, "controller did not initialise: ${e.message}")
            return null
        }


        controller = created
        return created
    }
}

