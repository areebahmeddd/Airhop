# Native

The two compiled dependencies Airhop ships. Both are built from source here rather than pulled in as prebuilt binaries, and both outputs are committed.

## Directory layout

| Directory                     | Holds                                                            |
| ----------------------------- | ---------------------------------------------------------------- |
| [`arti/`](arti)               | The embedded Tor client, in Rust. One crate, two FFI faces       |
| [`iptproxy/`](iptproxy)       | obfs4 and Snowflake, in Go, as a library rather than processes   |

`arti/` puts a SOCKS5 listener on loopback; `iptproxy/` runs the transports that reach a bridge and hands `arti/` the ports they landed on. Each directory has its own README covering its build, what that build verifies, and how to update it.

Both builds read their pins from [`arti/TOOLCHAIN.env`](arti/TOOLCHAIN.env), and share an NDK and a container image.

## Building

Android runs in a pinned Linux container, which is the supported path and what CI checks against. Apple slices need a Mac, because `lipo` and `xcodebuild` are macOS only.

```sh
# Android
native/arti/build-in-container.sh          # or --clean
native/iptproxy/build-in-container.sh      # or --clean

# Apple
native/arti/build-apple.sh
native/iptproxy/fetch-sources.sh && native/iptproxy/build-apple.sh

# Record the binaries, in the same commit as the binaries themselves
node scripts/verify-vendored.js --write
npm run verify:vendored
```

Output is written straight into `android/` and `ios/`. [`scripts/verify-vendored.js`](../scripts/verify-vendored.js) hashes it, so CI fails a build whose binaries moved without the source that claims to produce them moving too.

## Tests

Only `arti/` has them. `iptproxy/` is upstream Go behind a generated binding, so what it needs checking is the binding surface and the packaged slices, which its build does.

```sh
# The first step of either arti build script, before any cross compiling
native/arti/build-in-container.sh

# Directly, when the host toolchain matches TOOLCHAIN.env
cd native/arti && cargo test
```

| File         | Covered                                                        |
| ------------ | -------------------------------------------------------------- |
| `lib.rs`     | Start and stop, status packing, circuit isolation, panic guard |
| `bridges.rs` | Bridge line parsing, and refusing a transport that is not up   |
| `socks.rs`   | The SOCKS5 handshake and every refusal in it                   |
| `ffi_c.rs`   | Summary truncation on a character boundary                     |

They share one process-global client, so they serialize on `test_lock()` rather than needing `--test-threads=1`. None needs a network: a working circuit is the one thing only a device can prove.

## Formatting

The container image carries neither `rustfmt` nor `clippy`, so run both on a host toolchain matching `RUST_VERSION`.

```sh
cd native/arti
cargo fmt
cargo fmt --check          # what CI expects
cargo clippy --all-targets
```
