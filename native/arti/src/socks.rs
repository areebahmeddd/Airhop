//! A SOCKS5 server whose only exit is a Tor circuit.
//!
//! RFC 1928 for the protocol and RFC 1929 for the username/password
//! subnegotiation. Only CONNECT is offered: BIND and UDP ASSOCIATE have no
//! meaning over Tor and are refused rather than half-implemented.
//!
//! Two things here are deliberately unlike the implementations this replaces.
//!
//! **Every field is read with `read_exact`.** TCP is a byte stream, so a
//! greeting and a request may arrive in one segment, in two, or split down the
//! middle of an address. Reading each phase with a single `read` into a fixed
//! buffer works on a loopback socket on a developer's desk and fails under load
//! or behind an unusual client, and it fails by hanging rather than by erroring.
//!
//! **Hostnames are never resolved here.** For `ATYP=DOMAINNAME` the name is
//! handed to arti as a name, so the lookup happens at the exit rather than on
//! this device. Resolving locally would send a plaintext DNS query for exactly
//! the host the user is trying to reach privately, which is the classic proxy
//! leak. Both platform HTTP stacks cooperate: Foundation and OkHttp both pass an
//! unresolved host to a SOCKS5 proxy.

use std::io;
use std::sync::Arc;
use std::time::Duration;

use arti_client::{ErrorKind, HasKind, StreamPrefs, TorClient};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::oneshot;
use tor_rtcompat::PreferredRuntime;

const VERSION_5: u8 = 0x05;
const AUTH_NONE: u8 = 0x00;
const AUTH_USERPASS: u8 = 0x02;
const AUTH_UNACCEPTABLE: u8 = 0xFF;
const CMD_CONNECT: u8 = 0x01;
const ATYP_IPV4: u8 = 0x01;
const ATYP_DOMAIN: u8 = 0x03;
const ATYP_IPV6: u8 = 0x04;

const REPLY_OK: u8 = 0x00;
const REPLY_GENERAL_FAILURE: u8 = 0x01;
const REPLY_NOT_ALLOWED: u8 = 0x02;
const REPLY_HOST_UNREACHABLE: u8 = 0x04;
const REPLY_REFUSED: u8 = 0x05;
const REPLY_CMD_UNSUPPORTED: u8 = 0x07;
const REPLY_ATYP_UNSUPPORTED: u8 = 0x08;

/// How long a client has to finish the handshake and send its request.
///
/// Bounds the cost of a connection that opens and then says nothing. Generous,
/// because the peer is always a local process on the same device and the only
/// thing this protects against is a task leak, never a real client.
const HANDSHAKE_TIMEOUT: Duration = Duration::from_secs(30);

/// Accept SOCKS connections until `shutdown` fires.
pub async fn serve(
    listener: TcpListener,
    client: Arc<TorClient<PreferredRuntime>>,
    mut shutdown: oneshot::Receiver<()>,
) {
    loop {
        tokio::select! {
            accepted = listener.accept() => {
                let Ok((stream, _peer)) = accepted else {
                    // A transient accept error (a descriptor limit, a connection
                    // reset between the SYN and the accept) must not end the
                    // listener. Only the shutdown signal does that, or the
                    // runtime going away underneath us.
                    continue;
                };
                let client = client.clone();
                tokio::spawn(async move {
                    let _ = handle(stream, client).await;
                });
            }
            _ = &mut shutdown => return,
        }
    }
}

/// One SOCKS conversation, from greeting to teardown.
async fn handle(mut stream: TcpStream, client: Arc<TorClient<PreferredRuntime>>) -> io::Result<()> {
    // Nagle off. Every reply here is a handful of bytes that the peer is
    // blocking on, so a coalescing delay is pure latency on connection setup.
    let _ = stream.set_nodelay(true);

    let request = match tokio::time::timeout(HANDSHAKE_TIMEOUT, negotiate(&mut stream)).await {
        Ok(Ok(request)) => request,
        // A refusal has already been written by `negotiate` where one was owed.
        Ok(Err(e)) => return Err(e),
        Err(_) => return Ok(()),
    };

    // Credentials identify the caller when they are given, which is Tor's own
    // convention for asking a proxy to isolate. Airhop's own sockets send none,
    // so the destination stands in, giving every relay its own circuit.
    let isolation_key = match &request.credentials {
        Some((user, pass)) => format!("u\u{0}{user}\u{0}{pass}"),
        None => format!("h\u{0}{}\u{0}{}", request.host, request.port),
    };
    let mut prefs = StreamPrefs::new();
    prefs.set_isolation(crate::isolation_for(&isolation_key));

    let tor_stream = match client
        .connect_with_prefs((request.host.as_str(), request.port), &prefs)
        .await
    {
        Ok(s) => s,
        Err(e) => {
            reply(&mut stream, reply_code_for(e.kind())).await?;
            return Ok(());
        }
    };

    // BND.ADDR and BND.PORT are meaningless for a CONNECT through Tor, since
    // this device never learns which address the exit used. All-zero is what
    // Tor itself answers and what every client accepts.
    reply(&mut stream, REPLY_OK).await?;

    let mut tor_stream = tor_stream;
    // Copies both directions and, on EOF in either, shuts down the matching
    // write half rather than tearing the whole thing down. A relay that stops
    // sending has not stopped listening.
    let _ = tokio::io::copy_bidirectional(&mut stream, &mut tor_stream).await;
    Ok(())
}

/// What the client asked for, once the handshake is done.
struct Request {
    host: String,
    port: u16,
    credentials: Option<(String, String)>,
}

async fn negotiate(stream: &mut TcpStream) -> io::Result<Request> {
    // Greeting: VER, NMETHODS, METHODS...
    let mut head = [0u8; 2];
    stream.read_exact(&mut head).await?;
    if head[0] != VERSION_5 {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "not SOCKS5",
        ));
    }
    let mut methods = vec![0u8; head[1] as usize];
    stream.read_exact(&mut methods).await?;

    // Prefer username/password when it is offered, because it is the only way a
    // caller can ask for a specific isolation, and fall back to no auth. There
    // is nothing to authenticate against: the listener is on loopback and any
    // credentials are read as an isolation label, never checked.
    let credentials = if methods.contains(&AUTH_USERPASS) {
        stream.write_all(&[VERSION_5, AUTH_USERPASS]).await?;
        Some(read_credentials(stream).await?)
    } else if methods.contains(&AUTH_NONE) {
        stream.write_all(&[VERSION_5, AUTH_NONE]).await?;
        None
    } else {
        stream.write_all(&[VERSION_5, AUTH_UNACCEPTABLE]).await?;
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "no acceptable SOCKS auth method",
        ));
    };

    // Request: VER, CMD, RSV, ATYP
    let mut head = [0u8; 4];
    stream.read_exact(&mut head).await?;
    if head[0] != VERSION_5 {
        return Err(io::Error::new(io::ErrorKind::InvalidData, "not SOCKS5"));
    }
    if head[1] != CMD_CONNECT {
        reply(stream, REPLY_CMD_UNSUPPORTED).await?;
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "only CONNECT is supported",
        ));
    }

    let host = match head[3] {
        ATYP_IPV4 => {
            let mut octets = [0u8; 4];
            stream.read_exact(&mut octets).await?;
            std::net::Ipv4Addr::from(octets).to_string()
        }
        ATYP_IPV6 => {
            let mut octets = [0u8; 16];
            stream.read_exact(&mut octets).await?;
            std::net::Ipv6Addr::from(octets).to_string()
        }
        ATYP_DOMAIN => {
            let mut len = [0u8; 1];
            stream.read_exact(&mut len).await?;
            let mut name = vec![0u8; len[0] as usize];
            stream.read_exact(&mut name).await?;
            // Hostnames are ASCII on the wire. Anything else is a malformed
            // request rather than something to guess at.
            String::from_utf8(name)
                .map_err(|_| io::Error::new(io::ErrorKind::InvalidData, "hostname is not UTF-8"))?
        }
        _ => {
            reply(stream, REPLY_ATYP_UNSUPPORTED).await?;
            return Err(io::Error::new(
                io::ErrorKind::InvalidData,
                "unsupported address type",
            ));
        }
    };

    let mut port = [0u8; 2];
    stream.read_exact(&mut port).await?;

    Ok(Request {
        host,
        port: u16::from_be_bytes(port),
        credentials,
    })
}

/// RFC 1929 username/password subnegotiation.
async fn read_credentials(stream: &mut TcpStream) -> io::Result<(String, String)> {
    let mut version = [0u8; 1];
    stream.read_exact(&mut version).await?;
    if version[0] != 0x01 {
        // Refuse before returning, so the client sees a failure rather than a
        // silent close it has to time out on.
        stream.write_all(&[0x01, 0x01]).await?;
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "unsupported SOCKS auth subnegotiation version",
        ));
    }

    let mut len = [0u8; 1];
    stream.read_exact(&mut len).await?;
    let mut user = vec![0u8; len[0] as usize];
    stream.read_exact(&mut user).await?;

    stream.read_exact(&mut len).await?;
    let mut pass = vec![0u8; len[0] as usize];
    stream.read_exact(&mut pass).await?;

    stream.write_all(&[0x01, 0x00]).await?;

    // Credentials are an opaque isolation label, so bytes that are not UTF-8 are
    // still a perfectly good label. Lossy rather than an error.
    Ok((
        String::from_utf8_lossy(&user).into_owned(),
        String::from_utf8_lossy(&pass).into_owned(),
    ))
}

/// Write a reply with an all-zero bound address.
async fn reply(stream: &mut TcpStream, code: u8) -> io::Result<()> {
    stream
        .write_all(&[VERSION_5, code, 0x00, ATYP_IPV4, 0, 0, 0, 0, 0, 0])
        .await
}

/// Translate an arti failure into the nearest SOCKS reply code.
///
/// Worth the match rather than answering `REPLY_GENERAL_FAILURE` to everything:
/// the platform HTTP stacks surface these as distinguishable errors, so a
/// refused connection and an unreachable relay reach the app as different
/// things instead of one indistinguishable failure.
fn reply_code_for(kind: ErrorKind) -> u8 {
    match kind {
        ErrorKind::RemoteHostNotFound | ErrorKind::RemoteHostResolutionFailed => {
            REPLY_HOST_UNREACHABLE
        }
        ErrorKind::RemoteConnectionRefused => REPLY_REFUSED,
        ErrorKind::ExitPolicyRejected | ErrorKind::ForbiddenStreamTarget => REPLY_NOT_ALLOWED,
        ErrorKind::LocalNetworkError | ErrorKind::RemoteNetworkFailed => REPLY_HOST_UNREACHABLE,
        _ => REPLY_GENERAL_FAILURE,
    }
}
