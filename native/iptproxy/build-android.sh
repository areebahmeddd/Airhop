#!/usr/bin/env bash
#
# Build IPtProxy.aar for all Android ABIs and install it into android/app/libs/.
#
# The supported build runs through build-in-container.sh, which pins Go, the NDK
# and the Android platform jar. Direct builds are allowed for development but
# require the local toolchain to match TOOLCHAIN.env. Sources come from
# fetch-sources.sh.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
FETCHED="$REPO_ROOT/.native-build/iptproxy-src/iptproxy"
LIBS_DIR="$REPO_ROOT/android/app/libs"
AAR="$LIBS_DIR/IPtProxy.aar"

# Go records the main module and every local `replace` target in the binary's
# build info by absolute path, and -trimpath does not reach those. Built from
# the checkout, that bakes in whoever built it and makes the output differ
# between machines. Building from a fixed path outside the repository is what
# keeps the result identical everywhere and free of anyone's home directory.
BUILD_ROOT=/tmp/airhop-iptproxy
SRC_DIR="$BUILD_ROOT/IPtProxy.go"

# shellcheck disable=SC1091
source "$REPO_ROOT/native/arti/TOOLCHAIN.env"

# The ABIs android/app/src/main/jniLibs ships. Upstream also builds android/386,
# which Airhop does not package.
GOMOBILE_TARGETS=android/arm64,android/arm,android/amd64
EXPECTED_ABIS=(arm64-v8a armeabi-v7a x86_64)

info() { printf '\033[0;36m==>\033[0m %s\n' "$*"; }
fail() { printf '\033[0;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

# ---- Preconditions --------------------------------------------------------
#
# Verify the toolchain before building so a mismatched compiler or NDK cannot
# produce an artifact that differs from CI.

command -v go >/dev/null || fail "go is not on PATH"
command -v javac >/dev/null || fail "javac is not on PATH"

# Set before the version check: left on its default, Go silently downloads
# whatever compiler a go directive asks for, and the check below would then be
# reading a version that is not the one doing the building.
export GOTOOLCHAIN=local

actual_go="$(go env GOVERSION)"
[ "$actual_go" = "go$GO_VERSION" ] || fail "go is $actual_go, TOOLCHAIN.env pins go$GO_VERSION"

[ -n "${ANDROID_NDK_HOME:-}" ] || fail "ANDROID_NDK_HOME is not set"
ndk_revision="$(sed -n 's/^Pkg.Revision *= *//p' "$ANDROID_NDK_HOME/source.properties" | tr -d '\r')"
[ "$ndk_revision" = "$ANDROID_NDK_VERSION" ] || fail "NDK is $ndk_revision, TOOLCHAIN.env pins $ANDROID_NDK_VERSION"

# gomobile compiles the Java bindings it generates, so it needs a platform jar
# that the Rust build beside it does not.
[ -n "${ANDROID_HOME:-}" ] || fail "ANDROID_HOME is not set"
[ -f "$ANDROID_HOME/platforms/android-$ANDROID_PLATFORM_API/android.jar" ] \
  || fail "no android.jar for API $ANDROID_PLATFORM_API under $ANDROID_HOME"

[ -d "$FETCHED" ] || fail "sources are missing; run native/iptproxy/fetch-sources.sh first"

READELF="$(ls "$ANDROID_NDK_HOME"/toolchains/llvm/prebuilt/*/bin/llvm-readelf 2>/dev/null | head -1 || true)"
[ -x "$READELF" ] || fail "llvm-readelf not found under the NDK; cannot verify segment alignment"

# ---- Toolchain ------------------------------------------------------------

export TZ=UTC
export LC_ALL=C.UTF-8

# `go tool gomobile` runs from the build cache and never installs gobind, which
# bind then cannot find. `go install` without a version resolves through this
# module, so the pin comes from go.mod rather than the network.
GOBIN="$REPO_ROOT/.native-build/go-bin"
export GOBIN
export PATH="$GOBIN:$PATH"

rm -rf "$BUILD_ROOT"
mkdir -p "$BUILD_ROOT"
cp -R "$FETCHED/." "$BUILD_ROOT/"
# Dropped so Go cannot stamp VCS information from a checkout that is not ours.
rm -rf "$BUILD_ROOT/.git"

cd "$SRC_DIR"

resolved="$(go list -m golang.org/x/mobile)"
info "gomobile: $resolved"
grep -q "$GOMOBILE_VERSION" <<<"$resolved" \
  || fail "gomobile resolved to '$resolved', TOOLCHAIN.env pins $GOMOBILE_VERSION"

info "Installing gomobile and gobind"
go install golang.org/x/mobile/cmd/gomobile golang.org/x/mobile/cmd/gobind
gomobile init

# ---- Build ----------------------------------------------------------------

info "Building $GOMOBILE_TARGETS"
mkdir -p "$LIBS_DIR"
rm -f "$AAR"

# -s -w drop the symbol table and DWARF, halving the result. -checklinkname=0 is
# required because Snowflake's dependencies reach into Go runtime internals with
# //go:linkname. -trimpath keeps build-machine paths out, verified below.
gomobile bind \
  -target="$GOMOBILE_TARGETS" \
  -androidapi="$ANDROID_MIN_SDK" \
  -ldflags="-s -w -checklinkname=0" \
  -tags=netcgo \
  -trimpath \
  -o "$AAR" \
  .

[ -f "$AAR" ] || fail "gomobile produced no aar"

# gomobile also emits a sources jar for IDE navigation. It is not part of what
# ships, and this directory is hashed wholesale, so leaving it would commit a
# second artifact nothing links.
rm -f "$LIBS_DIR/IPtProxy-sources.jar"

# ---- Verify ---------------------------------------------------------------

STAGING="$REPO_ROOT/.native-build/iptproxy-verify"
rm -rf "$STAGING"
mkdir -p "$STAGING"
unzip -q "$AAR" -d "$STAGING"

info "Verifying"

# Exactly what the app packages. A missing ABI is what a partial target list
# produces and only surfaces on a user's phone; an extra one is upstream's
# default list creeping back in.
for abi in "${EXPECTED_ABIS[@]}"; do
  [ -f "$STAGING/jni/$abi/libgojni.so" ] || fail "$abi: missing libgojni.so"
done
for dir in "$STAGING"/jni/*/; do
  abi="$(basename "$dir")"
  case " ${EXPECTED_ABIS[*]} " in
    *" $abi "*) ;;
    *) fail "unexpected ABI in the aar: $abi" ;;
  esac
done

# gomobile names the generated class after the Go package, so a rename upstream
# would otherwise surface as a NoClassDefFoundError on a phone.
#
# Listed into a variable rather than piped: `grep -q` exits at the first match,
# which hands unzip a SIGPIPE that pipefail then reports as a failed check.
classes="$(unzip -l "$STAGING/classes.jar")"
grep -q "IPtProxy/Controller.class" <<<"$classes" \
  || fail "classes.jar has no IPtProxy/Controller; the binding surface moved"

for abi in "${EXPECTED_ABIS[@]}"; do
  lib="$STAGING/jni/$abi/libgojni.so"

  # 16 KiB load alignment on the 64-bit ABIs, read back rather than assumed
  # from the NDK default.
  case "$abi" in
    arm64-v8a | x86_64)
      alignment="$("$READELF" --program-headers --wide "$lib" | awk '$1 == "LOAD" { print $NF; exit }')"
      case "$alignment" in
        0x4000 | 16384) ;;
        *) fail "$abi: LOAD segment alignment is $alignment, need $REQUIRED_LOAD_ALIGNMENT" ;;
      esac
      ;;
  esac

  # An absolute path from a developer's disk is both a reproducibility failure
  # and a small leak about whoever built it.
  leaked="$(strings "$lib" | grep -E '/home/[a-z]|/Users/' | sort -u | head -5 || true)"
  if [ -n "$leaked" ]; then
    printf '%s\n' "$leaked" >&2
    fail "$abi: a build-machine path survived into the library"
  fi

  info "  $abi: aligned, no build-machine paths"
done

rm -rf "$STAGING"

# ---- Record ---------------------------------------------------------------

info "Writing SHA256SUMS"
# Relative to the repository root, matching native/arti's manifests.
(cd "$REPO_ROOT" && sha256sum android/app/libs/IPtProxy.aar) > "$SCRIPT_DIR/SHA256SUMS.android"

info "Done. Size:"
printf '  %-16s %s\n' "IPtProxy.aar" "$(du -h "$AAR" | cut -f1)"
