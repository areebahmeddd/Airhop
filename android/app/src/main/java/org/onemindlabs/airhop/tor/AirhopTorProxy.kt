// Routes the app's outbound traffic through Arti's SOCKS5 proxy, or directly.
//
// This is the whole reason Android needs no per-socket Tor shim of the kind iOS
// carries. React Native on Android is OkHttp end to end: `fetch` goes through
// NetworkingModule and WebSocket goes through WebSocketModule, and both build
// their client from OkHttpClientProvider. Installing one factory here therefore
// covers every socket the app opens, including the ones TypeScript never sees.
//
// That matters more than it sounds. iOS wraps only the Nostr WebSocket, which is
// why a Cashu mint call there has to be refused rather than routed. Here the
// mint call, the release check and the relay sockets are all covered by the same
// switch, so there is no traffic left over to make an exception for.
//
// It also replaces what Orbot used to do. Orbot's VPN captured every socket at
// the OS level; losing that when Tor moved in-process would have quietly put
// mint traffic back on the clear net while the toggle still read on.
package org.onemindlabs.airhop.tor

import com.facebook.react.modules.network.OkHttpClientProvider
import okhttp3.OkHttpClient
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.Proxy
import java.net.ProxySelector
import java.net.SocketAddress
import java.net.URI

object AirhopTorProxy {

    /**
     * The proxy every request currently takes, or null for a direct connection.
     *
     * Volatile because it is written from the module's coroutine and read on
     * whichever thread OkHttp happens to be opening a connection on.
     */
    @Volatile
    private var proxy: Proxy? = null

    /**
     * The client React Native builds everything else from.
     *
     * Held so the connection pool can be emptied when the route changes. Without
     * that this is a leak rather than a switch: OkHttp pools connections by
     * address, the selector object is part of that address and does not change
     * identity when its answer does, so a connection opened on the clear net
     * stays eligible for reuse after Tor is turned on. The request would go out
     * over the socket it already had, and nothing would look wrong.
     */
    @Volatile
    private var client: OkHttpClient? = null

    /**
     * Answers per connection rather than per client, so turning Tor on does not
     * require rebuilding a client React Native has already cached and handed to
     * its modules.
     */
    private val selector = object : ProxySelector() {
        override fun select(uri: URI?): List<Proxy> = listOf(proxy ?: Proxy.NO_PROXY)

        override fun connectFailed(uri: URI?, sa: SocketAddress?, ioe: java.io.IOException?) {
            // Nothing to fail over to. There is exactly one route and the answer
            // to it being unreachable is to fail, not to find another way out,
            // which is the whole point while Tor is on.
        }
    }

    /**
     * Install the factory. Call once, from Application.onCreate, before React
     * Native builds its first client.
     *
     * Ordering is load-bearing: OkHttpClientProvider caches the client it builds
     * and offers no way to replace it afterwards, so a factory installed later
     * would apply to nothing.
     */
    fun install() {
        OkHttpClientProvider.setOkHttpClientFactory {
            OkHttpClientProvider.createClientBuilder()
                .proxySelector(selector)
                .build()
                .also { client = it }
        }
    }

    /**
     * Send everything through the SOCKS5 proxy on [socksPort], or pass null to
     * go direct.
     *
     * Called when the Tor preference changes, not when a circuit comes up. A
     * request made while Tor is starting fails rather than falling back, which
     * is the same fail-closed behaviour iOS gets from installing its Tor socket
     * before the first circuit exists.
     */
    fun route(socksPort: Int?) {
        proxy = socksPort?.let {
            // The proxy address is resolved (it is a loopback literal); the
            // destination deliberately is not. OkHttp hands an unresolved host to
            // a SOCKS proxy, so the name is looked up at the exit rather than by
            // this device, which is what stops a plaintext DNS query going out
            // for exactly the host the user is trying to reach privately.
            Proxy(Proxy.Type.SOCKS, InetSocketAddress(InetAddress.getLoopbackAddress(), it))
        }
        // Drop every pooled connection, so nothing opened under the old route can
        // be reused under the new one.
        client?.connectionPool?.evictAll()
    }

    /** Whether traffic is currently pointed at the proxy. */
    fun isRouting(): Boolean = proxy != null
}
