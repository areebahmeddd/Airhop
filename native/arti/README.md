# Airhop's embedded Tor client

One Rust crate, compiled twice: a static library linked into the iOS app and a
shared object loaded by the Android app. Both expose the same five operations, so
"Tor is on" means the same thing on either phone and there is one implementation
to fix when it does not.

The app gets a SOCKS5 listener on `127.0.0.1:39050` and a status word. There is
no `tor` binary, no `torrc`, no control port, and no third-party app to install.

## Layout

```text
src/lib.rs      client lifecycle, bootstrap events, dormancy, isolation
src/socks.rs    the SOCKS5 server
src/ffi.rs      C ABI, consumed by ios/Airhop/AirhopTorManager.swift
src/jni_api.rs  JNI, consumed by android .../tor/ArtiNative.kt
```

Nothing above `ffi.rs` and `jni_api.rs` is platform-specific.

## Building

Android, in the pinned container. This is the supported path and what CI checks
against:

```bash
native/arti/build-in-container.sh          # or --clean
```

iOS and macOS. Requires a Mac, because `lipo` and `xcodebuild` have no
equivalent elsewhere:

```bash
native/arti/build-apple.sh                 # or --clean
```

Both write their output into the app source trees
(`android/app/src/main/jniLibs/`, `ios/Frameworks/arti.xcframework`). Record the
result in the same commit:

```bash
git add android/app/src/main/jniLibs ios/Frameworks
node scripts/verify-vendored.js --write
npm run verify:vendored
```

The `git add` is not optional on a first build. `verify-vendored.js` hashes
tracked files, so a binary that has never been added is invisible to it and
`--write` would record a manifest that silently omits it.

A local Android build without Docker works for development, but
`build-android.sh` refuses unless your Rust, cargo-ndk and NDK match
`TOOLCHAIN.env` exactly, because a library built with a different compiler is not
the artifact CI will check.

## What the build verifies

Neither script trusts its toolchain:

- **Exported symbols.** Every entry point the Swift and Kotlin sides bind, in
  every slice. A symbol present in one architecture and missing from another is
  what a partial rebuild produces, and the linker only catches it when somebody
  happens to build for that architecture.
- **16 KiB page alignment** (Android). Google Play requires it. Read back with
  `llvm-readelf` rather than assumed from the toolchain default.
- **No build-machine paths.** An absolute path from a developer's disk inside a
  shipped binary is both a reproducibility failure and a small leak about
  whoever built it.

## Updating Arti

1. Bump `arti-client` and `tor-rtcompat` in `Cargo.toml` and
   `ARTI_CLIENT_VERSION` in `TOOLCHAIN.env`.
2. Regenerate `Cargo.lock` and **review every dependency change**. This is a Tor
   client; the dependency graph is part of the security review.
3. Rebuild both platforms, re-record the hashes, and update the `arti` entry in
   `src/data/licenses.ts`.
4. Read the upstream changelog for `arti-client` API breaks. The one that has
   bitten us so far: Arti 2.4.0 made every `TorClient` constructor return an
   `Arc`.

Run the container build twice from clean and confirm `SHA256SUMS.android` does
not move. If it does, something unpinned leaked into the build.

## Deliberate choices

**Features.** `rustls` rather than `native-tls`, so there is no OpenSSL and no
dependence on the platform trust store beneath the circuit. `compression` and
`flowctl-cc` are upstream defaults that `default-features = false` would
otherwise drop, and both matter on mobile: uncompressed directory downloads cost
bandwidth, and congestion control costs latency.

**`bridge-client` and `pt-client` are compiled in but never configured.** Bridges
are a later phase; having the code present means that phase is a configuration
and UI change rather than another binary rebuild across six architecture slices.

**Panics abort.** Unwinding across an FFI boundary is undefined behaviour, and
aborting is the one option that is sound without wrapping every entry point in
`catch_unwind`. A panic in a Tor client is a bug worth a crash report.

**The listener binds before bootstrap.** `start` returns only once the port is
accepting, so a caller that gets `AIRHOP_TOR_OK` may dial immediately. This is
also why neither platform needs to probe the port to find out whether it is up.

**Failing closed is structural, not timed.** `arti_client` has no clearnet path,
so a request made before a circuit exists fails rather than falling back. There
is no window in which traffic could take a direct route because the circuit was
not ready.

## Known gap

No bridges and no pluggable transports, so the first hop is a direct connection
to a publicly listed relay and an observer can see that Tor is in use, even
though they cannot see what is carried. This is why Tor is off by default. See
the Tor section of `docs/spec/ARCHITECTURE.md`.

## References

- [Arti](https://gitlab.torproject.org/tpo/core/arti)
- [`arti-client` docs](https://docs.rs/arti-client)
- [Compiling Arti for iOS](https://arti.torproject.org/integrating-arti/custom-wrappers/iOS/)
- [Android 16 KB page sizes](https://developer.android.com/guide/practices/page-sizes)
