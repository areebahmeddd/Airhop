#!/usr/bin/env bash
#
# Build arti.xcframework for iOS device and simulator and install it into
# ios/Frameworks/.
#
# macOS only. Apple device and simulator static libraries are linked into the
# app by Xcode, so this part of the native build cannot run in the Linux
# container.
#
#     native/arti/build-apple.sh [--clean]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
FRAMEWORKS_DIR="$REPO_ROOT/ios/Frameworks"
XCFRAMEWORK="$FRAMEWORKS_DIR/arti.xcframework"
LIB_NAME="libarti_airhop.a"
BUILD_DIR="$SCRIPT_DIR/target/xcframework-staging"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/TOOLCHAIN.env"

info() { printf '\033[0;36m==>\033[0m %s\n' "$*"; }
fail() { printf '\033[0;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

# ---- Preconditions --------------------------------------------------------

[ "$(uname -s)" = "Darwin" ] || fail "build-apple.sh requires macOS"
command -v cargo >/dev/null || fail "cargo is not on PATH"
command -v cbindgen >/dev/null || fail "cbindgen is not installed: cargo install cbindgen --version $CBINDGEN_VERSION --locked"
command -v xcodebuild >/dev/null || fail "xcodebuild is not on PATH"

actual_rust="$(rustc --version | awk '{print $2}')"
[ "$actual_rust" = "$RUST_VERSION" ] || fail "rustc is $actual_rust, TOOLCHAIN.env pins $RUST_VERSION"

# arti.h is a build output, so the generator affects the shipped artifact.
# A different cbindgen can change formatting/type rendering, moving the hash without Rust changes.
actual_cbindgen="$(cbindgen --version | awk '{print $2}')"
[ "$actual_cbindgen" = "$CBINDGEN_VERSION" ] || fail "cbindgen is $actual_cbindgen, TOOLCHAIN.env pins $CBINDGEN_VERSION"

# ---- Reproducibility ------------------------------------------------------
#
# Keep build paths, timestamps, and locale stable across build machines.

export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-$NATIVE_SOURCE_DATE_EPOCH}"
export CARGO_INCREMENTAL=0
export TZ=UTC
export LC_ALL=C
export IPHONEOS_DEPLOYMENT_TARGET="$IOS_MIN_VERSION"

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

# ---- Targets --------------------------------------------------------------

DEVICE_TARGET=aarch64-apple-ios
SIM_TARGETS=(aarch64-apple-ios-sim x86_64-apple-ios)

# ---- Header ---------------------------------------------------------------
#
# Generate the C header before compiling so cbindgen failures stop the build
# immediately.

info "Generating arti.h"
mkdir -p "$BUILD_DIR/include"
cbindgen --config "$SCRIPT_DIR/cbindgen.toml" \
  --crate arti-airhop \
  --output "$BUILD_DIR/include/arti.h" \
  "$SCRIPT_DIR"
grep -q "airhop_tor_start" "$BUILD_DIR/include/arti.h" \
  || fail "cbindgen produced a header with no entry points"

# ---- Build ----------------------------------------------------------------

# Rust's llvm-nm can read the LLVM bitcode embedded by the matching Rust toolchain.
# Apple's nm may reject that bitcode when its LLVM version is older.
find_llvm_nm() {
  local sysroot host candidate
  sysroot="$(rustc --print sysroot)"
  host="$(rustc -vV | awk '/^host: /{ print $2 }')"
  candidate="$sysroot/lib/rustlib/$host/bin/llvm-nm"
  if [ -x "$candidate" ]; then
    printf '%s' "$candidate"
  else
    printf 'nm'
  fi
}
NM="$(find_llvm_nm)"

# C entry points bound by AirhopTorManager.swift.
EXPECTED_SYMBOLS=(
  _airhop_tor_start
  _airhop_tor_stop
  _airhop_tor_set_dormant
  _airhop_tor_status
  _airhop_tor_summary
)

# Verify each target before merging architectures so a missing symbol is tied
# to the target that produced it.
verify_target() {
  local target="$1" lib symbols
  lib="$SCRIPT_DIR/target/$target/apple/$LIB_NAME"
  if ! symbols="$("$NM" --defined-only -g "$lib" 2>&1)"; then
    printf '%s\n' "$symbols" | head -5 >&2
    fail "$target: could not read $LIB_NAME with $NM"
  fi

  local symbol
  for symbol in "${EXPECTED_SYMBOLS[@]}"; do
    if ! grep -q "[[:space:]]$symbol\$" <<<"$symbols"; then
      grep "airhop_tor" <<<"$symbols" | head -10 >&2 || echo "  (no airhop symbols at all)" >&2
      fail "$target: missing $symbol"
    fi
  done
  info "  $target: all ${#EXPECTED_SYMBOLS[@]} entry points present"
}

# Strip local symbols and normalize archive metadata for reproducible output.
normalize_archive() {
  local lib="$1"
  strip -x "$lib" 2>/dev/null || true
  local tmp="$lib.normalized"
  xcrun libtool -static -D -no_warning_for_no_symbols "$lib" -o "$tmp"
  mv "$tmp" "$lib"
}

build_target() {
  local target="$1"
  info "Building $target"
  rustup target add "$target" >/dev/null 2>&1 || true
  cargo build --profile apple --locked --target "$target" --manifest-path "$SCRIPT_DIR/Cargo.toml"

  local produced="$SCRIPT_DIR/target/$target/apple/$LIB_NAME"
  [ -f "$produced" ] || fail "$target: no $LIB_NAME was produced"

  local before after
  before=$(du -m "$produced" | cut -f1)
  normalize_archive "$produced"
  after=$(du -m "$produced" | cut -f1)
  info "  $target: ${before} MB -> ${after} MB"

  verify_target "$target"
}

info "Reading symbols with $NM"
build_target "$DEVICE_TARGET"
for target in "${SIM_TARGETS[@]}"; do
  build_target "$target"
done

# ---- Package --------------------------------------------------------------

# Device and simulator are separate xcframework slices. Simulator targets can
# share one universal archive because they use the same platform variant.
info "Merging architectures"
mkdir -p "$BUILD_DIR/ios" "$BUILD_DIR/ios-sim"

lib_for() { printf '%s/target/%s/apple/%s' "$SCRIPT_DIR" "$1" "$LIB_NAME"; }

merge_slice() {
  local out="$1"
  shift
  local libs=()
  local target
  for target in "$@"; do libs+=("$(lib_for "$target")"); done
  lipo -create -output "$out" "${libs[@]}"
  normalize_archive "$out"
}

cp "$(lib_for "$DEVICE_TARGET")" "$BUILD_DIR/ios/$LIB_NAME"
merge_slice "$BUILD_DIR/ios-sim/$LIB_NAME" "${SIM_TARGETS[@]}"

for slice in ios ios-sim; do
  mkdir -p "$BUILD_DIR/$slice/Headers"
  cp "$BUILD_DIR/include/arti.h" "$BUILD_DIR/$slice/Headers/arti.h"
done

info "Assembling arti.xcframework"
rm -rf "$XCFRAMEWORK"
mkdir -p "$FRAMEWORKS_DIR"
xcodebuild -create-xcframework \
  -library "$BUILD_DIR/ios/$LIB_NAME" -headers "$BUILD_DIR/ios/Headers" \
  -library "$BUILD_DIR/ios-sim/$LIB_NAME" -headers "$BUILD_DIR/ios-sim/Headers" \
  -output "$XCFRAMEWORK"

# ---- Record ---------------------------------------------------------------

info "Recording hashes"
(
  cd "$REPO_ROOT"
  find ios/Frameworks/arti.xcframework -type f | sort | xargs shasum -a 256
) > "$SCRIPT_DIR/SHA256SUMS.apple"

cat <<MSG

Built. Next steps, in the same commit:

  node scripts/verify-vendored.js --write
  npm run verify:vendored

MSG

du -sh "$XCFRAMEWORK"
