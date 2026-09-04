#!/usr/bin/env bash
#
# Build libarti_airhop.so for all Android ABIs and install it into
# android/app/src/main/jniLibs/.
#
# The supported build runs through build-in-container.sh, which pins the
# compiler, NDK, and system packages. Direct builds are allowed for development
# but require the local toolchain to match TOOLCHAIN.env.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
JNI_LIBS_DIR="$REPO_ROOT/android/app/src/main/jniLibs"
LIB_NAME="libarti_airhop.so"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/TOOLCHAIN.env"

# ABIs listed in android/gradle.properties.
declare -A ABI_FOR_TARGET=(
  [aarch64-linux-android]=arm64-v8a
  [armv7-linux-androideabi]=armeabi-v7a
  [x86_64-linux-android]=x86_64
)

info() { printf '\033[0;36m==>\033[0m %s\n' "$*"; }
fail() { printf '\033[0;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

# ---- Preconditions --------------------------------------------------------
#
# Verify the toolchain before building so a mismatched compiler or NDK cannot
# produce an artifact that differs from CI.

command -v cargo >/dev/null || fail "cargo is not on PATH"
command -v cargo-ndk >/dev/null || fail "cargo-ndk is not installed: cargo install cargo-ndk --version $CARGO_NDK_VERSION --locked"

actual_rust="$(rustc --version | awk '{print $2}')"
[ "$actual_rust" = "$RUST_VERSION" ] || fail "rustc is $actual_rust, TOOLCHAIN.env pins $RUST_VERSION"

actual_ndk_tool="$(cargo ndk --version | awk '{print $2}')"
[ "$actual_ndk_tool" = "$CARGO_NDK_VERSION" ] || fail "cargo-ndk is $actual_ndk_tool, TOOLCHAIN.env pins $CARGO_NDK_VERSION"

[ -n "${ANDROID_NDK_HOME:-}" ] || fail "ANDROID_NDK_HOME is not set"
ndk_revision="$(sed -n 's/^Pkg.Revision *= *//p' "$ANDROID_NDK_HOME/source.properties" | tr -d '\r')"
[ "$ndk_revision" = "$ANDROID_NDK_VERSION" ] || fail "NDK at ANDROID_NDK_HOME is $ndk_revision, TOOLCHAIN.env pins $ANDROID_NDK_VERSION"

READELF="$(ls "$ANDROID_NDK_HOME"/toolchains/llvm/prebuilt/*/bin/llvm-readelf 2>/dev/null | head -1 || true)"
[ -x "$READELF" ] || fail "llvm-readelf not found under the NDK; cannot verify segment alignment"

# ---- Reproducibility ------------------------------------------------------
#
# Remap local paths and fix build metadata so the same source produces the same
# artifact across build machines.

export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-$NATIVE_SOURCE_DATE_EPOCH}"
export CARGO_INCREMENTAL=0
export TZ=UTC
export LC_ALL=C.UTF-8

CARGO_HOME_PATH="${CARGO_HOME:-$HOME/.cargo}"
RUSTFLAGS="${RUSTFLAGS:-}"
RUSTFLAGS+=" --remap-path-prefix=$SCRIPT_DIR=/usr/src/arti-airhop"
RUSTFLAGS+=" --remap-path-prefix=$CARGO_HOME_PATH=/usr/local/cargo"
export RUSTFLAGS

if [ "${1:-}" = "--clean" ]; then
  info "Removing previous build output"
  rm -rf "$SCRIPT_DIR/target"
fi

# ---- Test -----------------------------------------------------------------
#
# Before the ABIs: a client that cannot start is not worth cross compiling three
# times. The checks after the build read the finished library rather than calling
# it, so a crate that aborts on its first `start` passes every one of them.
#
# The dev profile, because cargo compiles test harnesses with unwinding whatever
# the profile says.

info "Running the crate's tests on the host"
(
  cd "$SCRIPT_DIR"
  cargo test --locked
)

# ---- Build ----------------------------------------------------------------

for target in "${!ABI_FOR_TARGET[@]}"; do
  abi="${ABI_FOR_TARGET[$target]}"
  out="$JNI_LIBS_DIR/$abi"
  info "Building $abi ($target)"
  mkdir -p "$out"

  # Run from the crate directory because cargo-ndk resolves the workspace from
  # the current directory before processing --manifest-path.
  (
    cd "$SCRIPT_DIR"
    cargo ndk \
      --target "$target" \
      --platform "$ANDROID_MIN_SDK" \
      --output-dir "$JNI_LIBS_DIR" \
      build --release --locked
  )

  [ -f "$out/$LIB_NAME" ] || fail "$abi: cargo-ndk produced no $LIB_NAME"
done

# ---- Verify ---------------------------------------------------------------

# JNI entry points declared by ArtiNative.kt.
EXPECTED_SYMBOLS=(
  Java_org_onemindlabs_airhop_tor_ArtiNative_nativeStart
  Java_org_onemindlabs_airhop_tor_ArtiNative_nativeStop
  Java_org_onemindlabs_airhop_tor_ArtiNative_nativeSetDormant
  Java_org_onemindlabs_airhop_tor_ArtiNative_nativeStatus
  Java_org_onemindlabs_airhop_tor_ArtiNative_nativeSummary
)

for abi in "${ABI_FOR_TARGET[@]}"; do
  lib="$JNI_LIBS_DIR/$abi/$LIB_NAME"
  info "Verifying $abi"

  symbols="$("$READELF" --dyn-syms --wide "$lib")"
  for symbol in "${EXPECTED_SYMBOLS[@]}"; do
    grep -q " $symbol\$" <<<"$symbols" || fail "$abi: missing exported symbol $symbol"
  done

  # Verify 16 KiB load alignment on 64-bit ABIs.
  case "$abi" in
    arm64-v8a | x86_64)
      alignment="$("$READELF" --program-headers --wide "$lib" | awk '$1 == "LOAD" { print $NF; exit }')"
      case "$alignment" in
        0x4000 | 16384) ;;
        *) fail "$abi: LOAD segment alignment is $alignment, need $REQUIRED_LOAD_ALIGNMENT" ;;
      esac
      ;;
  esac

  # Ensure build-machine paths were not embedded in the library.
  if strings "$lib" | grep -Eq '/home/[a-z]|/Users/|[A-Za-z]:[\][^ ]+[\]'; then
    fail "$abi: a build-machine path survived into the library"
  fi
done

# ---- Record ---------------------------------------------------------------

info "Writing SHA256SUMS"
(
  cd "$REPO_ROOT"
  for abi in "${ABI_FOR_TARGET[@]}"; do
    printf 'android/app/src/main/jniLibs/%s/%s\n' "$abi" "$LIB_NAME"
  done | sort | xargs sha256sum
) > "$SCRIPT_DIR/SHA256SUMS.android"

info "Done. Sizes:"
for abi in "${ABI_FOR_TARGET[@]}"; do
  printf '  %-14s %s\n' "$abi" "$(du -h "$JNI_LIBS_DIR/$abi/$LIB_NAME" | cut -f1)"
done
