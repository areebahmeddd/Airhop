# Airhop's embedded Tor client

One Rust crate, compiled twice: a static library linked into the iOS app and a shared object loaded by the Android app. Both expose the same operations, so "Tor is on" means the same thing on either phone and there is one implementation to fix when it does not.

The app gets a SOCKS5 listener on `127.0.0.1:39050` and a status word. There is no `tor` binary, no `torrc`, no control port, and no third-party app to install.

## Layout

```text
src/lib.rs             client lifecycle, bootstrap events, dormancy, isolation
src/socks.rs           the SOCKS5 server
src/ffi_c.rs           C ABI, consumed by ios/Airhop/AirhopTorManager.swift
src/ffi_jni.rs         JNI, consumed by android .../tor/ArtiNative.kt

TOOLCHAIN.env          every pinned version, read by the scripts and the image
rust-toolchain.toml    the same compiler pin, for cargo run outside them
Dockerfile             the pinned Linux image the Android build runs in
build-in-container.sh  Android, in that image; the supported path
build-android.sh       Android, directly; refuses a mismatched toolchain
build-apple.sh         iOS, on a Mac
cbindgen.toml          how arti.h is generated from src/ffi_c.rs
```

Nothing above `ffi_c.rs` and `ffi_jni.rs` is platform-specific.

## Building

Android, in the pinned container. This is the supported path and what CI checks against:

```bash
native/arti/build-in-container.sh          # or --clean
```

iOS, device and simulator. Requires a Mac because `lipo` and `xcodebuild` are macOS-only:

```bash
native/arti/build-apple.sh                 # or --clean
```

Both write their output into the app source trees (`android/app/src/main/jniLibs/`, `ios/Frameworks/arti.xcframework`). Record the result in the same commit:

```bash
git add android/app/src/main/jniLibs ios/Frameworks
node scripts/verify-vendored.js --write
npm run verify:vendored
```

The `git add` is not optional on a first build. `verify-vendored.js` hashes tracked files, so a binary that has never been added is invisible to it and `--write` would record a manifest that silently omits it.

A local Android build without Docker works for development, but `build-android.sh` refuses unless your Rust, cargo-ndk and NDK match `TOOLCHAIN.env` exactly, because a library built with a different compiler is not the artifact CI will check.

## What the build verifies

Neither script trusts its toolchain:

- **Exported symbols.** Every entry point the Swift and Kotlin sides bind, in every slice. A symbol present in one architecture and missing from another is what a partial rebuild produces, and the linker only catches it when somebody happens to build for that architecture.
- **16 KiB page alignment** (Android). Google Play requires it. Read back with `llvm-readelf`, never assumed from the toolchain default.
- **No build-machine paths.** An absolute path from a developer's disk inside a shipped binary is both a reproducibility failure and a small leak about whoever built it.

## Updating Arti

1. Bump `arti-client` and `tor-rtcompat` in `Cargo.toml` and `ARTI_CLIENT_VERSION` in `TOOLCHAIN.env`.
2. Regenerate `Cargo.lock` and **review every dependency change**. This is a Tor client; the dependency graph is part of the security review.
3. Rebuild both platforms, re-record the hashes, and update the `arti` entry in `src/data/licenses.ts`.
4. Read the upstream changelog for API and cargo-feature breaks. Both happen, and a dropped feature fails at resolve time with a list of what is available, which is the easy case; an API change fails at compile time in `lib.rs`.

A compiler bump moves `RUST_VERSION` in `TOOLCHAIN.env` and the channel in `rust-toolchain.toml` together. The build asserts they agree.

Run the container build twice from clean and confirm `SHA256SUMS.android` does not move. If it does, something unpinned leaked into the build.

## Deliberate choices

**Features.** `rustls`, not `native-tls`, so there is no OpenSSL and no dependence on the platform trust store beneath the circuit. `compression` is an upstream default that `default-features = false` would otherwise drop, and it matters on mobile: uncompressed directory downloads cost bandwidth.

**Bridges are an argument to `start`, not a setter beside it.** They are fixed when the client is constructed, so a setter could be called afterwards and silently do nothing, and anything that cleared it would let a later start take a direct route for a user who asked not to have one. The transports themselves live in [`native/iptproxy`](../iptproxy); this crate only receives the loopback ports they landed on.

**Panics abort.** Unwinding across an FFI boundary is undefined behaviour, and aborting is the one option that is sound without wrapping every entry point in `catch_unwind`. A panic in a Tor client is a bug worth a crash report.

**The listener binds before bootstrap.** `start` returns only once the port is accepting, so a caller that gets `AIRHOP_TOR_OK` may dial immediately. This is also why neither platform needs to probe the port to find out whether it is up.

**Failing closed is structural, not timed.** `arti_client` has no clearnet path, so a request made before a circuit exists fails instead of falling back. There is no window in which traffic could take a direct route because the circuit was not ready.

## References

- [Arti](https://gitlab.torproject.org/tpo/core/arti)
- [`arti-client` docs](https://docs.rs/arti-client)
- [Compiling Arti for iOS](https://arti.torproject.org/integrating-arti/custom-wrappers/iOS/)
- [Android 16 KB page sizes](https://developer.android.com/guide/practices/page-sizes)
