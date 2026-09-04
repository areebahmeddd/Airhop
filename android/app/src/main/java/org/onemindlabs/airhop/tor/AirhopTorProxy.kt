// Points the app's outbound traffic at Arti's SOCKS5 proxy, or direct.
//
// React Native on Android is OkHttp end to end, so one factory installed into
// OkHttpClientProvider covers every socket the app opens: `fetch` through
// NetworkingModule and WebSocket through WebSocketModule both build from that
// client. iOS has no equivalent hook and wraps the Nostr WebSocket by hand,
// which is why a Cashu mint call is refused there and needs no refusal here.
package org.onemindlabs.airhop.tor

import android.content.Context
import com.facebook.react.modules.network.OkHttpClientProvider
import com.facebook.react.modules.systeminfo.AndroidInfoHelpers
import okhttp3.OkHttpClient
import org.onemindlabs.airhop.BuildConfig
import java.io.IOException
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.Proxy
import java.net.ProxySelector
import java.net.SocketAddress
import java.net.URI

object AirhopTorProxy {

    private val DIRECT = listOf(Proxy.NO_PROXY)

    // Written from the module's worker, read on whichever thread OkHttp opens a
    // connection on.
    @Volatile
    private var proxy: Proxy? = null

    // "host:port" of the Metro dev server on a debug build, null on release.
    //
    // React Native's dev support builds its HTTP and inspector clients from the
    // same provider this factory is installed into, so with Tor on the bundle
    // loader, hot reload and the debugger would all dial the developer's machine
    // through a circuit that cannot reach it. BuildConfig.DEBUG is a compile-time
    // constant, so no shipped build can carry the exemption.
    @Volatile
    private var devServerAuthority: String? = null

    // Held so the connection pool can be emptied when the route changes.
    // OkHttp pools by address, the selector is part of that address and does not
    // change identity when its answer does, so without an eviction a connection
    // opened on the clear net stays eligible for reuse after Tor comes on.
    @Volatile
    private var client: OkHttpClient? = null

    private val selector = object : ProxySelector() {
        override fun select(uri: URI?): List<Proxy> {
            val proxy = this@AirhopTorProxy.proxy ?: return DIRECT
            if (uri != null && authorityOf(uri) == devServerAuthority) return DIRECT
            return listOf(proxy)
        }

        // There is one route and no fallback. While Tor is on, a failure has to
        // stay a failure.
        override fun connectFailed(uri: URI?, sa: SocketAddress?, ioe: IOException?) = Unit
    }

    // "host:port" with the scheme's default port filled in, so a URI compares
    // against what AndroidInfoHelpers reports. Null rather than a partial match.
    private fun authorityOf(uri: URI): String? {
        val host = uri.host ?: return null
        val port = if (uri.port != -1) {
            uri.port
        } else {
            when (uri.scheme?.lowercase()) {
                "https", "wss" -> 443
                "http", "ws" -> 80
                else -> return null
            }
        }
        return "$host:$port"
    }

    // Call once from Application.onCreate, before React Native builds its first
    // client: OkHttpClientProvider caches that client and offers no way to
    // replace it, so a factory installed later applies to nothing.
    fun install(context: Context) {
        devServerAuthority =
            if (BuildConfig.DEBUG) AndroidInfoHelpers.getServerHost(context) else null
        OkHttpClientProvider.setOkHttpClientFactory {
            OkHttpClientProvider.createClientBuilder()
                .proxySelector(selector)
                .build()
                .also { client = it }
        }
    }

    // Called when the Tor preference changes, not when a circuit comes up. A
    // request made while Tor is starting fails rather than falling back.
    fun route(socksPort: Int?) {
        proxy = socksPort?.let {
            // The proxy address is resolved; the destination deliberately is not.
            // OkHttp hands an unresolved host to a SOCKS proxy, so the lookup
            // happens at the exit rather than leaking a DNS query for the host
            // the user is trying to reach privately.
            Proxy(Proxy.Type.SOCKS, InetSocketAddress(InetAddress.getLoopbackAddress(), it))
        }
        client?.connectionPool?.evictAll()
    }
}
