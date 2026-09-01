#!/usr/bin/env bash
#
# Build arti.xcframework for iOS device, iOS simulator and macOS, and install it
# into ios/Frameworks/.
#
# macOS only: lipo and xcodebuild have no equivalent elsewhere, and Apple's
# static libraries cannot be produced by a cross-compiler on another platform.
# This is the one part of the native build that cannot run in the Linux
# container, so it runs on a developer's Mac or on the macOS CI runner.
#
#     native/arti/build-apple.sh [--clean]
#
# The three slices match the layout the existing framework already has, so
# ios/Arti.podspec and the Xcode target need no change when this replaces it.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
FRAMEWORKS_DIR="$REPO_ROOT/ios/Frameworks"
XCFRAMEWORK="$FRAMEWORKS_DIR/arti.xcframework"
LIB_NAME="libarti_airhop.a"
BUILD_DIR="$SCRIPT_DIR/target/apple"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/TOOLCHAIN.env"

info() { printf '\033[0;36m==>\033[0m %s\n' "$*"; }
fail() { printf '\033[0;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

[ "$(uname -s)" = "Darwin" ] || fail "build-apple.sh requires macOS"
command -v cargo >/dev/null || fail "cargo is not on PATH"
command -v cbindgen >/dev/null || fail "cbindgen is not installed: cargo install cbindgen --locked"
command -v xcodebuild >/dev/null || fail "xcodebuild is not on PATH"

actual_rust="$(rustc --version | awk '{print $2}')"
[ "$actual_rust" = "$RUST_VERSION" ] || fail "rustc is $actual_rust, TOOLCHAIN.env pins $RUST_VERSION"

export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-$NATIVE_SOURCE_DATE_EPOCH}"
export CARGO_INCREMENTAL=0
export TZ=UTC
export LC_ALL=C
export IPHONEOS_DEPLOYMENT_TARGET="$IOS_MIN_VERSION"
export MACOSX_DEPLOYMENT_TARGET="$MACOS_MIN_VERSION"

CARGO_HOME_PATH="${CARGO_HOME:-$HOME/.cargo}"
RUSTFLAGS="${RUSTFLAGS:-}"
RUSTFLAGS+=" --remap-path-prefix=$SCRIPT_DIR=/usr/src/arti-airhop"
RUSTFLAGS+=" --remap-path-prefix=$CARGO_HOME_PATH=/usr/local/cargo"
export RUSTFLAGS

if [ "${1:-}" = "--clean" ]; then
  info "Removing previous build output"
  rm -rf "$SCRIPT_DIR/target"
fi
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

DEVICE_TARGET=aarch64-apple-ios
SIM_TARGETS=(aarch64-apple-ios-sim x86_64-apple-ios)
MAC_TARGETS=(aarch64-apple-darwin x86_64-apple-darwin)

# The header is generated from src/ffi.rs, never edited. See cbindgen.toml.
#
# Generated FIRST, before any compiling. It takes seconds and depends on nothing
# the builds produce, so putting it here turns a cbindgen misconfiguration into
# an immediate failure instead of one discovered after the better part of an hour
# of cross-compiling.
info "Generating arti.h"
mkdir -p "$BUILD_DIR/include"
cbindgen --config "$SCRIPT_DIR/cbindgen.toml" \
  --crate arti-airhop \
  --output "$BUILD_DIR/include/arti.h" \
  "$SCRIPT_DIR"
grep -q "airhop_tor_start" "$BUILD_DIR/include/arti.h" \
  || fail "cbindgen produced a header with no entry points"

build_target() {
  local target="$1"
  info "Building $target"
  rustup target add "$target" >/dev/null 2>&1 || true
  cargo build --release --locked --target "$target" --manifest-path "$SCRIPT_DIR/Cargo.toml"
  local produced="$SCRIPT_DIR/target/$target/release/$LIB_NAME"
  [ -f "$produced" ] || fail "$target: no $LIB_NAME was produced"
}

build_target "$DEVICE_TARGET"
for target in "${SIM_TARGETS[@]}" "${MAC_TARGETS[@]}"; do
  build_target "$target"
done

# One universal archive per xcframework slice. A slice may hold several
# architectures but only one per platform-variant, which is why device and
# simulator cannot be merged even though both are arm64.
info "Merging architectures"
mkdir -p "$BUILD_DIR/ios" "$BUILD_DIR/ios-sim" "$BUILD_DIR/macos"

# Where cargo leaves one target's static library.
lib_for() { printf '%s/target/%s/release/%s' "$SCRIPT_DIR" "$1" "$LIB_NAME"; }

# Merge every target in an array into one universal archive.
merge_slice() {
  local out="$1"
  shift
  local libs=()
  local target
  for target in "$@"; do libs+=("$(lib_for "$target")"); done
  lipo -create -output "$out" "${libs[@]}"
}

cp "$(lib_for "$DEVICE_TARGET")" "$BUILD_DIR/ios/$LIB_NAME"
merge_slice "$BUILD_DIR/ios-sim/$LIB_NAME" "${SIM_TARGETS[@]}"
merge_slice "$BUILD_DIR/macos/$LIB_NAME" "${MAC_TARGETS[@]}"

for slice in ios ios-sim macos; do
  mkdir -p "$BUILD_DIR/$slice/Headers"
  cp "$BUILD_DIR/include/arti.h" "$BUILD_DIR/$slice/Headers/arti.h"
done

info "Assembling arti.xcframework"
rm -rf "$XCFRAMEWORK"
mkdir -p "$FRAMEWORKS_DIR"
xcodebuild -create-xcframework \
  -library "$BUILD_DIR/ios/$LIB_NAME" -headers "$BUILD_DIR/ios/Headers" \
  -library "$BUILD_DIR/ios-sim/$LIB_NAME" -headers "$BUILD_DIR/ios-sim/Headers" \
  -library "$BUILD_DIR/macos/$LIB_NAME" -headers "$BUILD_DIR/macos/Headers" \
  -output "$XCFRAMEWORK"

# ---- Verify ---------------------------------------------------------------

# The C entry points AirhopTorManager.swift binds with @_silgen_name. A missing
# one links fine and traps the first time Tor is switched on.
EXPECTED_SYMBOLS=(
  _airhop_tor_start
  _airhop_tor_stop
  _airhop_tor_set_dormant
  _airhop_tor_status
  _airhop_tor_summary
)

info "Verifying exported symbols"

# `-arch all` matters here and its absence is why this check first failed on the
# macOS slice. Two of the three slices are universal archives, and Apple's nm
# reads only the host architecture out of a fat file unless told otherwise, so on
# an arm64 runner an x86_64 member is simply not looked at. Asking for every
# architecture is both the honest check and the portable one.
#
# Errors are no longer sent to /dev/null. An nm that fails outright used to
# produce an empty symbol list, which reads exactly like a missing symbol and
# sends you looking for a compiler problem that is not there.
while IFS= read -r -d '' lib; do
  slice="$(basename "$(dirname "$lib")")"
  if ! symbols="$(nm -gU -arch all "$lib" 2>&1)"; then
    printf '%s\n' "$symbols" | head -5 >&2
    fail "$slice: nm could not read the archive"
  fi
  for symbol in "${EXPECTED_SYMBOLS[@]}"; do
    if ! grep -q "[[:space:]]$symbol\$" <<<"$symbols"; then
      # Say what was actually found. A bare "missing X" gives a reader no way to
      # tell a renamed symbol from an unreadable file.
      printf 'Found %s exported symbol(s); airhop ones:\n' \
        "$(grep -c . <<<"$symbols")" >&2
      grep "airhop" <<<"$symbols" | head -10 >&2 || echo "  (none)" >&2
      fail "$slice: missing $symbol"
    fi
  done
  info "  $slice: all ${#EXPECTED_SYMBOLS[@]} entry points present"
done < <(find "$XCFRAMEWORK" -name "$LIB_NAME" -print0)

info "Recording hashes"
(
  cd "$REPO_ROOT"
  find ios/Frameworks/arti.xcframework -type f | sort | xargs shasum -a 256
) > "$SCRIPT_DIR/SHA256SUMS.apple"

cat <<MSG

Built. Next steps, in the same commit:

  node scripts/verify-vendored.js --write   # re-record the pinned binary hashes
  npm run verify:vendored                   # confirm CI will agree

MSG
du -sh "$XCFRAMEWORK"
