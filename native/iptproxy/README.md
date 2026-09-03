# Airhop's pluggable transports

[IPtProxy](https://github.com/tladesignz/IPtProxy), built from source and compiled twice: an `.aar` loaded by the Android app and an `.xcframework` linked into the iOS app. It packages [Lyrebird](https://gitlab.torproject.org/tpo/anti-censorship/pluggable-transports/lyrebird) (which provides obfs4) and [Snowflake](https://snowflake.torproject.org) as a library rather than the executables they normally are.

The app gets local SOCKS5 listeners on ports the library chooses, and hands those ports to the Tor client in [`native/arti`](../arti), which dials them to reach a bridge.

Arti would normally run a transport as a child process. iOS forbids an app spawning an executable, so that mode is unavailable on a phone and the transport has to be compiled in and reached over loopback instead. `TransportConfigBuilder::proxy_addr` is the setting for it.

## Layout

```text
fetch-sources.sh       pinned checkouts of IPtProxy and dnstt, on the host
build-android.sh       the aar, in the pinned container
build-apple.sh         the xcframework, on a Mac
build-in-container.sh  Android, end to end; the supported path
```

Pins live in [`../arti/TOOLCHAIN.env`](../arti/TOOLCHAIN.env). One file for both native builds, because they share an NDK and a container.

## Building

Android, in the pinned container. This is the supported path and what CI checks against:

```bash
native/iptproxy/build-in-container.sh          # or --clean
```

iOS, device and simulator. Requires a Mac because gomobile shells out to `xcodebuild` and `lipo`:

```bash
native/iptproxy/fetch-sources.sh
native/iptproxy/build-apple.sh                 # or --clean
```

Record the result in the same commit:

```bash
git add android/app/libs ios/Frameworks
node scripts/verify-vendored.js --write
npm run verify:vendored
```

The `git add` is not optional on a first build. `verify-vendored.js` hashes tracked files, so a binary that has never been added is invisible to it and `--write` would record a manifest that silently omits it.

## What the build verifies

- **Exactly the ABIs and slices the app packages.** A missing one is what a partial target list produces, and it only surfaces on a user's phone. An extra one is upstream's default list creeping back in, which would commit a macOS slice nothing links.
- **16 KiB page alignment** (Android). Google Play requires it. Read back with `llvm-readelf`, never assumed from the toolchain default.
- **The generated binding surface.** gomobile derives class and symbol names from the Go package, so a rename upstream would otherwise surface as a crash on a phone or a compile error in the app.
- **No build-machine paths.** An absolute path from a developer's disk inside a shipped binary is both a reproducibility failure and a small leak about whoever built it.

## Deliberate choices

**Built here, not vendored.** Upstream commits a prebuilt xcframework and publishes an aar on Maven, and their CocoaPod installs the committed binary. Either route puts a large binary nobody here compiled into the app, which is what [`scripts/verify-vendored.js`](../../scripts/verify-vendored.js) exists to prevent. `fetch-sources.sh` deletes the committed xcframework so their "already built" shortcut cannot ship it.

**Pinned by commit, and gomobile taken from `go.mod`.** Upstream resolves dnstt by a name that moves and gomobile with `@latest`, so the same script run twice can produce different binaries. An unversioned `go install` resolves through IPtProxy's own module instead, where their `tool` directive already pins it.

**Three ABIs and two slices.** Upstream builds android/386 and a macOS slice as well. Airhop packages neither.

**dnstt is built but unused.** It is compiled in and there is no build tag to leave it out. Excluding it would mean forking, which costs more than the bytes do.

**No `sdkmanager`.** gomobile needs an `android.jar` to compile its generated bindings. The platform package is unpacked directly in the [Dockerfile](../arti/Dockerfile), because `sdkmanager` resolves versions when it runs and would decide at build time what the pin is meant to decide.

## Updating IPtProxy

1. Move `IPTPROXY_VERSION` and `IPTPROXY_COMMIT` in `TOOLCHAIN.env` together, and `DNSTT_COMMIT` if their submodule moved.
2. Check `GOMOBILE_VERSION` against the `golang.org/x/mobile` line in their `go.mod`. The build fails loudly if it drifts.
3. Rebuild both platforms, re-record the hashes, and update the entries in [`src/data/licenses.ts`](../../src/data/licenses.ts).
4. Read their changelog for renames in the binding surface. The build checks the names the app binds, but not a behaviour change.

Run the container build twice from clean and confirm `SHA256SUMS.android` does not move. If it does, something unpinned leaked into the build.

## References

- [IPtProxy](https://github.com/tladesignz/IPtProxy)
- [Pluggable transport specification](https://spec.torproject.org/pt-spec/)
- [Snowflake](https://snowflake.torproject.org)
- [Arti bridge configuration](https://tpo.pages.torproject.net/core/doc/rust/arti_client/config/struct.BridgeConfigBuilder.html)
