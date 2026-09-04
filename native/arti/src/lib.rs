//! Airhop's embedded Tor client.
//!
//! One Rust crate, two FFI faces. iOS links it as a static library and calls the
//! C ABI in `ffi_c`; Android loads it as a shared object and calls the JNI surface
//! in `ffi_jni`. Everything above those two files is identical on both
//! platforms, so "Tor is on" means the same thing on an iPhone and on a Pixel,
//! and there is one place to fix when it does not.
//!
//! What the app gets is a SOCKS5 listener on loopback and nothing else. No
//! control port, no torrc, no configuration surface. The app points its sockets
//! at the port and reads a status snapshot to draw a banner.
//!
//! Three properties are load-bearing, and each is a decision, not an
//! accident.
//!
//! **It cannot leak.** `arti_client` has no clearnet path. Every byte that
//! enters the listener leaves through a circuit or does not leave at all. So
//! failing closed is a property of the design rather than of timing: there is no
//! window, however short, in which a request takes a direct route because the
//! circuit was not up yet.
//!
//! **The listener binds before bootstrap.** `start` returns only once the port
//! is accepting, so a caller that gets `AIRHOP_TOR_OK` may dial immediately. A dial made
//! during bootstrap waits for a circuit; a dial made after a bootstrap that
//! never completed fails. Binding after bootstrap instead would leave the app
//! unable to tell "starting" from "broken" for the whole bootstrap, and leave
//! callers probing the port to find out.
//!
//! **Progress is real.** `TorClient::bootstrap_events()` is the client's own
//! view of how far along it is and why it is stuck. Nothing here infers state
//! from log text.
//!
//! Panics never cross the FFI boundary. Every entry point goes through
//! [`catch_panic`], which returns an error code instead of aborting: Tor is the
//! app's optional internet half, and a bug in it must not take the mesh down.

use std::collections::HashMap;
use std::net::SocketAddr;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex, OnceLock, RwLock};

use arti_client::config::TorClientConfigBuilder;
use arti_client::{DormantMode, IsolationToken, TorClient};
use futures::StreamExt;
use tokio::net::TcpListener;
use tokio::runtime::Runtime;
use tokio::sync::oneshot;
use tor_rtcompat::PreferredRuntime;

mod bridges;
mod socks;

pub use bridges::TransportPorts;

pub mod ffi_c;

#[cfg(target_os = "android")]
pub mod ffi_jni;

/// Return codes shared by both FFI surfaces.
///
/// Plain integers because that is all a C ABI and a JNI `jint` can carry. Both
/// the Swift and the Kotlin module mirror these by name, so no call site ever
/// compares against a bare number.
pub const AIRHOP_TOR_OK: i32 = 0;
/// A client is already running. Stop it first.
pub const AIRHOP_TOR_ERR_ALREADY_RUNNING: i32 = -1;
/// The data directory was not valid UTF-8, or could not be created.
pub const AIRHOP_TOR_ERR_DATA_DIR: i32 = -2;
/// The async runtime could not be created.
pub const AIRHOP_TOR_ERR_RUNTIME: i32 = -3;
/// The Tor client could not be constructed. Usually a locked or unwritable
/// state directory.
pub const AIRHOP_TOR_ERR_CLIENT: i32 = -4;
/// The SOCKS port could not be bound. Usually something else holds it.
pub const AIRHOP_TOR_ERR_BIND: i32 = -5;
/// Nothing is running, so there was nothing to do.
pub const AIRHOP_TOR_ERR_NOT_RUNNING: i32 = -6;
/// A bridge line could not be parsed.
pub const AIRHOP_TOR_ERR_BRIDGE_LINE: i32 = -7;
/// A bridge line names a transport Airhop does not ship, or one whose local
/// proxy is not running, or carries more settings than a SOCKS5 handshake
/// can pass to it.
pub const AIRHOP_TOR_ERR_BRIDGE_TRANSPORT: i32 = -8;
/// A panic was caught at the FFI boundary. The call did nothing; the reason is
/// in the status summary.
pub const AIRHOP_TOR_ERR_PANIC: i32 = -9;

/// Run an FFI entry point, returning `fallback` if it panics.
///
/// Unwinding across an FFI boundary is undefined behaviour. Aborting prevents
/// that too and is the wrong trade here: an abort takes the Bluetooth mesh, the
/// wallet and the courier store with it, none of which depend on Tor.
///
/// Reported, not swallowed. `blocked` accompanies the message so the app stops
/// waiting on a client that will not make progress.
pub(crate) fn catch_panic<T>(fallback: T, f: impl FnOnce() -> T) -> T {
    match std::panic::catch_unwind(std::panic::AssertUnwindSafe(f)) {
        Ok(value) => value,
        Err(payload) => {
            let message = panic_text(payload.as_ref()).to_owned();
            update_status(|s| {
                s.ready = false;
                s.blocked = true;
                s.summary = format!("Internal error: {message}");
            });
            fallback
        }
    }
}

/// The message from a panic payload. `panic!` produces one of these two types.
fn panic_text(payload: &(dyn std::any::Any + Send)) -> &str {
    if let Some(s) = payload.downcast_ref::<&'static str>() {
        s
    } else if let Some(s) = payload.downcast_ref::<String>() {
        s.as_str()
    } else {
        "panic"
    }
}

/// How far along Tor is, and whether it is going anywhere.
///
/// One struct behind one lock, not a handful of atomics, because the app
/// reads all of it at once to draw a single banner. Read piecemeal, a caller can
/// catch `ready` from one instant beside `progress` from another and render
/// "connected" next to 40%.
#[derive(Clone, Debug, Default)]
pub struct Status {
    /// A client exists and its listener is accepting.
    pub running: bool,
    /// Bootstrapped and carrying traffic. The only flag the app may use to
    /// claim the user's traffic is onion routed.
    pub ready: bool,
    /// 0 to 100. Arti's own estimate, not ours.
    pub progress: u8,
    /// Arti reports it cannot make forward progress. This is the state a network
    /// that blocks Tor produces, and it is deliberately distinct from "still at
    /// 30%": without it the app cannot tell a slow start from a dead one, and
    /// says "starting" forever.
    pub blocked: bool,
    /// Arti's own description of the current stage, for display and logs. Never
    /// parsed.
    pub summary: String,
    /// Circuits are being built through a bridge rather than a public relay.
    /// Reported so the app can say which of the two it has, since they differ in
    /// what an observer on this network can see.
    pub bridged: bool,
}

/// Bit layout of the packed status word both FFI surfaces return.
///
/// ```text
///   bit  0      running
///   bit  1      ready
///   bit  2      blocked
///   bit  3      bridged
///   bits 8..15  progress, 0 to 100
/// ```
///
/// One integer, not a struct, for two reasons. It is the only shape both
/// a C ABI and a JNI `jint` express natively, so Swift needs no assumption about
/// how a Rust struct is laid out and Kotlin needs no class lookup. And a single
/// return value is a single consistent snapshot by construction, where a struct
/// filled field by field is only as atomic as the lock around it.
///
/// `AirhopTorManager.swift` and `ArtiNative.kt` hold the matching decoders, so
/// no call site on either platform does bit arithmetic.
pub const AIRHOP_TOR_STATUS_RUNNING: i32 = 1 << 0;
pub const AIRHOP_TOR_STATUS_READY: i32 = 1 << 1;
pub const AIRHOP_TOR_STATUS_BLOCKED: i32 = 1 << 2;
pub const AIRHOP_TOR_STATUS_BRIDGED: i32 = 1 << 3;
pub const AIRHOP_TOR_STATUS_PROGRESS_SHIFT: i32 = 8;

/// The current status, packed for the FFI. See [`AIRHOP_TOR_STATUS_RUNNING`].
pub fn packed_status() -> i32 {
    let status = status();
    let mut packed = 0;
    if status.running {
        packed |= AIRHOP_TOR_STATUS_RUNNING;
    }
    if status.ready {
        packed |= AIRHOP_TOR_STATUS_READY;
    }
    if status.blocked {
        packed |= AIRHOP_TOR_STATUS_BLOCKED;
    }
    if status.bridged {
        packed |= AIRHOP_TOR_STATUS_BRIDGED;
    }
    packed | ((status.progress as i32) << AIRHOP_TOR_STATUS_PROGRESS_SHIFT)
}

fn status_cell() -> &'static RwLock<Status> {
    static STATUS: OnceLock<RwLock<Status>> = OnceLock::new();
    STATUS.get_or_init(|| RwLock::new(Status::default()))
}

/// The current status. Safe to call from any thread at any time, including
/// before `start` and after `stop`.
pub fn status() -> Status {
    status_cell().read().map(|s| s.clone()).unwrap_or_default()
}

fn update_status(f: impl FnOnce(&mut Status)) {
    if let Ok(mut s) = status_cell().write() {
        f(&mut s);
    }
}

/// Everything one running client owns.
///
/// Held together so `stop` cannot half-tear-down. Dropping this drops the
/// client, which is what ends Tor's background directory activity, and shuts the
/// runtime down, which is what ends the accept loop. A user who switches Tor off
/// has withdrawn consent, and keeping a client alive to fetch consensus
/// documents behind that switch would not match it.
struct Running {
    runtime: Runtime,
    client: Arc<TorClient<PreferredRuntime>>,
    shutdown: Option<oneshot::Sender<()>>,
}

fn state() -> &'static Mutex<Option<Running>> {
    static STATE: OnceLock<Mutex<Option<Running>>> = OnceLock::new();
    STATE.get_or_init(|| Mutex::new(None))
}

/// Choose the rustls cryptographic provider, once per process.
///
/// arti does not choose one: `tor-rtcompat` takes rustls with no provider
/// feature and requires the application to install one. Without it rustls
/// panics inside `TorClient::builder` rather than returning an error.
///
/// Called from `start` rather than exported as an initializer, so the FFI
/// surface stays as it is and neither platform has to remember it. The `Err`
/// means a provider is already installed, which is the outcome wanted.
fn install_crypto_provider() {
    static ONCE: std::sync::Once = std::sync::Once::new();
    ONCE.call_once(|| {
        let _already_installed = rustls::crypto::ring::default_provider().install_default();
    });
}

/// Create a directory only this app can read.
///
/// arti refuses a state or cache directory that is group- or world-readable.
/// The mode is explicit because the umask is not: an app's 0077 gives 0700 by
/// accident, a host's 0022 gives 0755 and fails the check. Applied on every
/// call, so a loose directory from an earlier build is tightened.
fn create_private_dir(path: &Path) -> std::io::Result<()> {
    #[cfg(unix)]
    {
        use std::os::unix::fs::{DirBuilderExt, PermissionsExt};
        std::fs::DirBuilder::new()
            .recursive(true)
            .mode(0o700)
            .create(path)?;
        std::fs::set_permissions(path, std::fs::Permissions::from_mode(0o700))
    }
    #[cfg(not(unix))]
    {
        std::fs::create_dir_all(path)
    }
}

/// Start Tor and bind a SOCKS5 listener on `127.0.0.1:socks_port`, reaching the
/// network through `bridge_lines` when any are given, and a public relay
/// directly when there are none.
///
/// Returns once the listener is accepting, which is before bootstrap completes.
/// Poll [`status`] for the rest.
///
/// Bridges are fixed when the client is constructed, so they are an argument
/// rather than a setter beside it: a setter could be called afterwards and
/// silently do nothing, and anything clearing it would let the next start take a
/// direct route for a user who asked not to have one.
///
/// Fails rather than falling back. A line that does not parse, names a transport
/// Airhop does not ship, or names one whose port is 0 stops the start before
/// anything binds or bootstraps.
pub fn start(
    data_dir: &str,
    socks_port: u16,
    bridge_lines: &str,
    transport_ports: TransportPorts,
) -> i32 {
    // Before the client is built, where rustls would otherwise panic.
    install_crypto_provider();

    let mut guard = match state().lock() {
        Ok(g) => g,
        // A previous panic poisoned the lock. There is no safe way to reason
        // about the client it was holding, so refuse instead of starting a
        // second one beside it.
        Err(_) => return AIRHOP_TOR_ERR_RUNTIME,
    };
    if guard.is_some() {
        return AIRHOP_TOR_ERR_ALREADY_RUNNING;
    }

    let data_dir = PathBuf::from(data_dir);
    let cache_dir = data_dir.join("cache");
    let state_dir = data_dir.join("state");
    if create_private_dir(&cache_dir).is_err() || create_private_dir(&state_dir).is_err() {
        return AIRHOP_TOR_ERR_DATA_DIR;
    }

    // Two worker threads, not one per core. This runs on a phone beside the BLE
    // stack, two WiFi transports and a JavaScript engine, and a mostly idle Tor
    // client has no use for eight threads and their stacks.
    let runtime = match tokio::runtime::Builder::new_multi_thread()
        .worker_threads(2)
        .thread_name("airhop-tor")
        .enable_all()
        .build()
    {
        Ok(rt) => rt,
        Err(_) => return AIRHOP_TOR_ERR_RUNTIME,
    };

    let mut config_builder = TorClientConfigBuilder::from_directories(state_dir, cache_dir);
    // Before the runtime is spent on anything: a bad line is the caller's to fix
    // and there is nothing to tear down yet.
    let bridged = match bridges::apply(&mut config_builder, bridge_lines, transport_ports) {
        Ok(bridged) => bridged,
        Err(code) => return code,
    };
    let config = match config_builder.build() {
        Ok(c) => c,
        Err(_) => return AIRHOP_TOR_ERR_CLIENT,
    };

    let addr = SocketAddr::from(([127, 0, 0, 1], socks_port));

    // Build the client and bind the port together, on the runtime, before
    // anything is reported as running. Either both succeed or nothing is left
    // behind for `stop` to find.
    let built = runtime.block_on(async {
        // `TorClient::builder` reads the ambient runtime, so it has to be called
        // from inside `block_on` rather than beside it.
        let client = TorClient::builder()
            .config(config)
            .create_unbootstrapped_async()
            .await
            .map_err(|_| AIRHOP_TOR_ERR_CLIENT)?;
        let listener = TcpListener::bind(addr)
            .await
            .map_err(|_| AIRHOP_TOR_ERR_BIND)?;
        Ok::<_, i32>((client, listener))
    });
    let (client, listener) = match built {
        Ok(pair) => pair,
        Err(code) => return code,
    };

    let (shutdown_tx, shutdown_rx) = oneshot::channel();

    update_status(|s| {
        *s = Status {
            running: true,
            ready: false,
            progress: 0,
            blocked: false,
            summary: "Starting".to_owned(),
            bridged,
        };
    });

    // Serving before the first circuit exists is the point: a caller may dial
    // the moment `start` returns, and arti holds that stream until a circuit can
    // carry it.
    runtime.spawn(socks::serve(listener, client.clone(), shutdown_rx));

    // The bootstrap, and the reporting of it, as two tasks over one client.
    //
    // `bootstrap()` drives the work and resolves once. The event stream reports
    // every step of it and keeps reporting afterwards, because circuits are lost
    // and rebuilt for the life of the process and a client that stops being
    // ready has to be able to say so.
    runtime.spawn(watch_bootstrap(client.clone()));
    let bootstrapping = client.clone();
    runtime.spawn(async move {
        if let Err(e) = bootstrapping.bootstrap().await {
            update_status(|s| {
                if !s.running {
                    return;
                }
                s.ready = false;
                s.blocked = true;
                s.summary = e.to_string();
            });
        }
    });

    *guard = Some(Running {
        runtime,
        client,
        shutdown: Some(shutdown_tx),
    });
    AIRHOP_TOR_OK
}

/// Mirror Arti's own view of the bootstrap into [`Status`].
///
/// The alternative is printing fixed strings from Rust and pattern matching
/// them above, which reports 0 and then 100 with nothing in between and cannot
/// report being stuck at all.
async fn watch_bootstrap(client: Arc<TorClient<PreferredRuntime>>) {
    let mut events = client.bootstrap_events();
    while let Some(event) = events.next().await {
        let progress = (event.as_frac() * 100.0).round().clamp(0.0, 100.0) as u8;
        let ready = event.ready_for_traffic();
        let blockage = event.blocked();
        let summary = match &blockage {
            Some(b) => b.to_string(),
            None => event.to_string(),
        };
        update_status(|s| {
            // A late event from a client that has already been stopped must not
            // resurrect the flags the stop cleared.
            if !s.running {
                return;
            }
            s.progress = progress;
            s.ready = ready;
            s.blocked = blockage.is_some();
            s.summary = summary;
        });
    }
}

/// Stop Tor and release the port.
///
/// Blocks briefly while the runtime winds down, bounded so a wedged task cannot
/// hang the caller. Both platforms call this from a promise, so the bound
/// matters.
pub fn stop() -> i32 {
    // The guard is held for the whole function.
    //
    // Taking the value and releasing the lock first would let a start racing
    // this one find an empty slot and bind the SOCKS port while the runtime
    // being torn down still holds it, which fails with "address already in use"
    // for no reason a user could act on. Toggling Tor off and straight back on
    // is all it takes. Holding the lock makes that start wait for the teardown
    // instead, bounded by the timeout below.
    //
    // Android serialises these calls on one thread anyway; iOS does not, which
    // is exactly why the fix belongs here rather than in either app.
    let mut guard = match state().lock() {
        Ok(g) => g,
        Err(_) => return AIRHOP_TOR_ERR_RUNTIME,
    };
    let Some(mut running) = guard.take() else {
        return AIRHOP_TOR_ERR_NOT_RUNNING;
    };

    // Cleared first, so anything still in flight sees the stop and declines to
    // write over it.
    update_status(|s| *s = Status::default());

    if let Some(tx) = running.shutdown.take() {
        let _ = tx.send(());
    }
    drop(running.client);
    running
        .runtime
        .shutdown_timeout(std::time::Duration::from_secs(2));

    // A new session should not inherit the last one's circuit grouping. The
    // tokens are only unique markers, so keeping them would not leak anything,
    // but a panic wipe is meant to leave nothing of the old identity behind and
    // this is part of it.
    if let Ok(mut map) = isolation_map().lock() {
        map.clear();
    }
    AIRHOP_TOR_OK
}

/// Put Tor to sleep, or wake it.
///
/// Called when the app leaves and re-enters the foreground. Soft dormancy stops
/// the background work that keeps a client warm, which on a phone is the
/// difference between a Tor client that idles and one that keeps a consensus
/// fresh all day on a battery.
///
/// Deliberately not a stop. A stop drops circuits and guards, so reconnecting on
/// every foreground would cost the user half a minute each time and would make
/// this device look like a brand new client to a guard on every resume.
pub fn set_dormant(dormant: bool) -> i32 {
    let guard = match state().lock() {
        Ok(g) => g,
        Err(_) => return AIRHOP_TOR_ERR_RUNTIME,
    };
    let Some(running) = guard.as_ref() else {
        return AIRHOP_TOR_ERR_NOT_RUNNING;
    };
    running.client.set_dormant(if dormant {
        DormantMode::Soft
    } else {
        DormantMode::Normal
    });
    AIRHOP_TOR_OK
}

/// Per-destination circuit isolation, shared with the SOCKS server.
///
/// Keyed by whatever identifies the caller: the SOCKS credentials when they are
/// given, which is Tor's own convention, and otherwise the destination. Airhop's
/// relay sockets carry no credentials, so the destination key is what puts each
/// Nostr relay on its own circuit. Without it, one guard sees this client
/// talking to five named relays at once, which is a correlatable shape even
/// though every byte is opaque.
fn isolation_map() -> &'static Mutex<HashMap<String, IsolationToken>> {
    static MAP: OnceLock<Mutex<HashMap<String, IsolationToken>>> = OnceLock::new();
    MAP.get_or_init(|| Mutex::new(HashMap::new()))
}

pub(crate) fn isolation_for(key: &str) -> IsolationToken {
    let mut map = match isolation_map().lock() {
        Ok(m) => m,
        // Isolation is a hardening property, not a correctness one. A poisoned
        // map yields a fresh token, which over-isolates rather than under.
        Err(_) => return IsolationToken::new(),
    };
    *map.entry(key.to_owned())
        .or_insert_with(IsolationToken::new)
}

/// Serializes the tests that touch the process-global client. A poisoned lock is
/// recovered, so one failure does not cascade into the tests after it.
#[cfg(test)]
pub(crate) fn test_lock() -> std::sync::MutexGuard<'static, ()> {
    static LOCK: Mutex<()> = Mutex::new(());
    LOCK.lock().unwrap_or_else(|poisoned| poisoned.into_inner())
}

#[cfg(test)]
mod test {
    use super::*;

    /// The lifecycle the app drives. The build's other gates read the finished
    /// library; this one calls it, which is where a missing crypto provider or
    /// an unusable state directory surfaces. No network needed.
    ///
    /// Port 0 so the kernel picks a free one. Only callers above the FFI must
    /// name a real port.
    #[test]
    fn the_client_starts_and_stops() {
        let _serial = test_lock();
        let dir = std::env::temp_dir().join(format!(
            "airhop-tor-test-{}-{:?}",
            std::process::id(),
            std::thread::current().id()
        ));
        let _ = std::fs::remove_dir_all(&dir);
        let path = dir.to_str().expect("temp dir is not UTF-8");

        assert!(!status().running, "nothing should be running yet");
        assert_eq!(stop(), AIRHOP_TOR_ERR_NOT_RUNNING);

        assert_eq!(
            start(path, 0, "", TransportPorts::default()),
            AIRHOP_TOR_OK,
            "start failed; if this is a panic, the summary says why: {}",
            status().summary
        );

        let running = status();
        assert!(running.running);
        assert!(!running.ready, "ready must not be claimed before a circuit");
        assert!(!running.bridged, "no bridge lines were given");

        assert_eq!(
            start(path, 0, "", TransportPorts::default()),
            AIRHOP_TOR_ERR_ALREADY_RUNNING
        );

        assert_eq!(set_dormant(true), AIRHOP_TOR_OK);
        assert_eq!(set_dormant(false), AIRHOP_TOR_OK);

        assert_eq!(stop(), AIRHOP_TOR_OK);
        assert!(!status().running);
        assert_eq!(set_dormant(false), AIRHOP_TOR_ERR_NOT_RUNNING);

        let _ = std::fs::remove_dir_all(&dir);
    }

    /// Fail-closed end to end: a user who asked for a bridge must never be given
    /// a direct connection instead.
    #[test]
    fn a_bridge_without_its_transport_refuses_to_start() {
        let _serial = test_lock();
        let dir = std::env::temp_dir().join(format!(
            "airhop-tor-test-{}-{:?}",
            std::process::id(),
            std::thread::current().id()
        ));
        let _ = std::fs::remove_dir_all(&dir);
        let path = dir.to_str().expect("temp dir is not UTF-8");

        let line = "obfs4 192.0.2.1:443 0123456789ABCDEF0123456789ABCDEF01234567 \
            cert=abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ012345 iat-mode=0";
        assert_eq!(
            start(path, 0, line, TransportPorts::default()),
            AIRHOP_TOR_ERR_BRIDGE_TRANSPORT
        );
        assert!(!status().running, "a refused start leaves nothing behind");

        let _ = std::fs::remove_dir_all(&dir);
    }

    /// Both platform decoders read this layout by hand; nothing else pins it.
    #[test]
    fn every_status_field_survives_packing() {
        let _serial = test_lock();
        update_status(|s| {
            *s = Status {
                running: true,
                ready: true,
                progress: 100,
                blocked: true,
                summary: String::new(),
                bridged: true,
            };
        });
        let packed = packed_status();
        assert_eq!(
            packed & AIRHOP_TOR_STATUS_RUNNING,
            AIRHOP_TOR_STATUS_RUNNING
        );
        assert_eq!(packed & AIRHOP_TOR_STATUS_READY, AIRHOP_TOR_STATUS_READY);
        assert_eq!(
            packed & AIRHOP_TOR_STATUS_BLOCKED,
            AIRHOP_TOR_STATUS_BLOCKED
        );
        assert_eq!(
            packed & AIRHOP_TOR_STATUS_BRIDGED,
            AIRHOP_TOR_STATUS_BRIDGED
        );
        assert_eq!((packed >> AIRHOP_TOR_STATUS_PROGRESS_SHIFT) & 0xFF, 100);

        update_status(|s| *s = Status::default());
        assert_eq!(
            packed_status(),
            0,
            "a stopped client packs to no bits at all"
        );
    }

    /// A privacy property, not bookkeeping: one guard seeing this client talk to
    /// five named relays is a correlatable shape even with every byte opaque.
    #[test]
    fn isolation_is_stable_per_key_and_distinct_between_keys() {
        let _serial = test_lock();
        let first = isolation_for("relay.example");
        assert_eq!(first, isolation_for("relay.example"));
        assert_ne!(first, isolation_for("other.example"));
    }

    /// A panic returns the fallback rather than unwinding into a C or JNI frame.
    #[test]
    fn a_panic_becomes_an_error_code() {
        let _serial = test_lock();
        let rc = catch_panic(AIRHOP_TOR_ERR_PANIC, || -> i32 {
            panic!("deliberate test panic");
        });
        assert_eq!(rc, AIRHOP_TOR_ERR_PANIC);
        assert!(
            status().summary.contains("deliberate test panic"),
            "the panic message must reach the summary, got: {}",
            status().summary
        );
        // Left as it was found, so ordering between tests cannot matter.
        update_status(|s| *s = Status::default());
    }
}
