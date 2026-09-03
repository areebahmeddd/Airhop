#!/usr/bin/env bash
#
# Build IPtProxy.xcframework for iOS device and simulator and install it into
# ios/Frameworks/.
#
# macOS only, because gomobile shells out to xcodebuild and lipo, so this part
# cannot run in the Linux container the Android side uses. Sources come from
# fetch-sources.sh.
#
#     native/iptproxy/build-apple.sh [--clean]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SRC_DIR="$REPO_ROOT/.native-build/iptproxy-src/iptproxy/IPtProxy.go"
FRAMEWORKS_DIR="$REPO_ROOT/ios/Frameworks"
XCFRAMEWORK="$FRAMEWORKS_DIR/IPtProxy.xcframework"

# shellcheck disable=SC1091
source "$REPO_ROOT/native/arti/TOOLCHAIN.env"

# No macOS slice, matching arti's build-apple.sh. Upstream's default target list
# adds one that would be committed, hashed and never linked.
GOMOBILE_TARGETS=ios,iossimulator
EXPECTED_SLICES=(ios-arm64 ios-arm64_x86_64-simulator)

info() { printf '\033[0;36m==>\033[0m %s\n' "$*"; }
fail() { printf '\033[0;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

# ---- Preconditions --------------------------------------------------------

[ "$(uname -s)" = "Darwin" ] || fail "build-apple.sh requires macOS"
command -v go >/dev/null || fail "go is not on PATH"
command -v xcodebuild >/dev/null || fail "xcodebuild is not on PATH"

# Set before the version check: left on its default, Go silently downloads
# whatever compiler a go directive asks for, and the check below would then be
# reading a version that is not the one doing the building.
export GOTOOLCHAIN=local

actual_go="$(go env GOVERSION)"
[ "$actual_go" = "go$GO_VERSION" ] || fail "go is $actual_go, TOOLCHAIN.env pins go$GO_VERSION"

[ -d "$SRC_DIR" ] || fail "sources are missing; run native/iptproxy/fetch-sources.sh first"

# ---- Toolchain ------------------------------------------------------------

export TZ=UTC
export LC_ALL=C
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-$NATIVE_SOURCE_DATE_EPOCH}"

# See build-android.sh: `go tool gomobile` never installs the gobind that bind
# then looks for, and an unversioned `go install` takes the pin from go.mod.
GOBIN="$REPO_ROOT/.native-build/go-bin"
export GOBIN
export PATH="$GOBIN:$PATH"

if [ "${1:-}" = "--clean" ]; then
  info "Removing previous build output"
  rm -rf "$XCFRAMEWORK" "$GOBIN"
fi

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
mkdir -p "$FRAMEWORKS_DIR"
rm -rf "$XCFRAMEWORK"

# Flags match build-android.sh, which explains each. Both platforms must get the
# same transport behaviour, and one set of flags is what keeps that true.
gomobile bind \
  -target="$GOMOBILE_TARGETS" \
  -iosversion="$IOS_MIN_VERSION" \
  -ldflags="-s -w -checklinkname=0" \
  -tags=netcgo \
  -trimpath \
  -o "$XCFRAMEWORK" \
  .

[ -d "$XCFRAMEWORK" ] || fail "gomobile produced no xcframework"

# ---- Verify ---------------------------------------------------------------

info "Verifying"

for slice in "${EXPECTED_SLICES[@]}"; do
  [ -d "$XCFRAMEWORK/$slice" ] || fail "missing slice $slice"
done

# An extra slice means the target list drifted back to upstream's default.
for dir in "$XCFRAMEWORK"/*/; do
  slice="$(basename "$dir")"
  case " ${EXPECTED_SLICES[*]} " in
    *" $slice "*) ;;
    *) fail "unexpected slice in the xcframework: $slice" ;;
  esac
done

# gomobile derives these names from the Go package, so a rename upstream would
# otherwise surface as a compile error in the app rather than here.
header="$XCFRAMEWORK/ios-arm64/IPtProxy.framework/Headers/IPtProxy.objc.h"
[ -f "$header" ] || fail "no generated Objective-C header in the device slice"
for symbol in IPtProxyController IPtProxyObfs4 IPtProxySnowflake; do
  grep -q "$symbol" "$header" || fail "generated header has no $symbol; the binding surface moved"
done

for slice in "${EXPECTED_SLICES[@]}"; do
  binary="$XCFRAMEWORK/$slice/IPtProxy.framework/IPtProxy"
  [ -f "$binary" ] || fail "$slice: no framework binary"
  if strings "$binary" | grep -Eq '/Users/[a-z]'; then
    fail "$slice: a build-machine path survived into the binary"
  fi
  info "  $slice: $(du -h "$binary" | cut -f1), no build-machine paths"
done

# ---- Record ---------------------------------------------------------------

info "Recording hashes"
(
  cd "$REPO_ROOT"
  find ios/Frameworks/IPtProxy.xcframework -type f | sort | xargs shasum -a 256
) > "$SCRIPT_DIR/SHA256SUMS.apple"

cat <<MSG

Built. Next steps, in the same commit:

  git add ios/Frameworks
  node scripts/verify-vendored.js --write
  npm run verify:vendored

MSG

du -sh "$XCFRAMEWORK"
