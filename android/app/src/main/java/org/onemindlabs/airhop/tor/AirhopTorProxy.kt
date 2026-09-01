// Points the app's outbound traffic at Arti's SOCKS5 proxy, or direct.
//
// React Native on Android is OkHttp end to end, so one factory installed into
// OkHttpClientProvider covers every socket the app opens: `fetch` through
// NetworkingModule and WebSocket through WebSocketModule both build from that
// client. iOS has no equivalent hook and wraps the Nostr WebSocket by hand,
// which is why a Cashu mint call is refused there and needs no refusal here.
package org.onemindlabs.airhop.tor

import com.facebook.react.modules.network.OkHttpClientProvider
import okhttp3.OkHttpClient
import java.io.IOException
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.Proxy
import java.net.ProxySelector
import java.net.SocketAddress
import java.net.URI

object AirhopTorProxy {

    // Written from the module's worker, read on whichever thread OkHttp opens a
    // connection on.
    @Volatile
    private var proxy: Proxy? = null

    // Held so the connection pool can be emptied when the route changes.
    // OkHttp pools by address, the selector is part of that address and does not
    // change identity when its answer does, so without an eviction a connection
    // opened on the clear net stays eligible for reuse after Tor comes on.
    @Volatile
    private var client: OkHttpClient? = null

    private val selector = object : ProxySelector() {
        override fun select(uri: URI?): List<Proxy> = listOf(proxy ?: Proxy.NO_PROXY)

        // There is one route and no fallback. While Tor is on, a failure has to
        // stay a failure.
        override fun connectFailed(uri: URI?, sa: SocketAddress?, ioe: IOException?) = Unit
    }

    // Call once from Application.onCreate, before React Native builds its first
    // client: OkHttpClientProvider caches that client and offers no way to
    // replace it, so a factory installed later applies to nothing.
    fun install() {
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
