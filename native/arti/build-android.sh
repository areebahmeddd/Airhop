#!/usr/bin/env bash
#
# Build libarti_airhop.so for every Android ABI Airhop ships, verify it, and
# install it into android/app/src/main/jniLibs/.
#
# The supported way to run this is the pinned container, which fixes the
# compiler, the NDK and the system packages:
#
#     native/arti/build-in-container.sh
#
# Running it directly works for a development build, and refuses if the local
# toolchain does not match TOOLCHAIN.env, because a native library built with a
# different compiler is not the artifact CI will check.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
JNI_LIBS_DIR="$REPO_ROOT/android/app/src/main/jniLibs"
LIB_NAME="libarti_airhop.so"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/TOOLCHAIN.env"

# The three ABIs in android/gradle.properties reactNativeArchitectures. An App
# Bundle delivers only the one the device needs, so this is repository weight
# rather than install size.
declare -A ABI_FOR_TARGET=(
  [aarch64-linux-android]=arm64-v8a
  [armv7-linux-androideabi]=armeabi-v7a
  [x86_64-linux-android]=x86_64
)

info() { printf '\033[0;36m==>\033[0m %s\n' "$*"; }
fail() { printf '\033[0;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

# ---- Preconditions --------------------------------------------------------
#
# Checked rather than assumed, because every one of these silently changes the
# bytes we ship and none of them announces itself.

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
# Absolute paths from this machine end up in panic messages and debug records,
# so they are remapped to stable names. Without this the same source produces a
# different binary on every developer's machine and the checksum manifest is
# meaningless.

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

# ---- Build ----------------------------------------------------------------

for target in "${!ABI_FOR_TARGET[@]}"; do
  abi="${ABI_FOR_TARGET[$target]}"
  out="$JNI_LIBS_DIR/$abi"
  info "Building $abi ($target)"
  mkdir -p "$out"

  # From the crate directory, not wherever the caller happened to be. cargo-ndk
  # runs `cargo metadata` against the working directory before it looks at any
  # argument, so `--manifest-path` alone is not enough: in the container the
  # working directory is the repository root, which has no Cargo.toml.
  #
  # --locked so the build fails rather than quietly resolving a dependency
  # differently from Cargo.lock.
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

# The JNI entry points ArtiNative.kt declares. A missing symbol is an
# UnsatisfiedLinkError at run time on a user's phone, which is the worst place
# to discover a rename.
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

  # Google Play rejects an app whose 64-bit native libraries are not 16 KiB
  # aligned. Read it back rather than trusting the toolchain default or the
  # linker flag.
  #
  # 64-bit only, and that is Google's rule rather than a shortcut here: every
  # device with 16 KiB pages is 64-bit, so a 32-bit library cannot run on one.
  # armeabi-v7a therefore links at 4 KiB, which is correct for it and which an
  # unconditional check would reject on every build.
  case "$abi" in
    arm64-v8a | x86_64)
      alignment="$("$READELF" --program-headers --wide "$lib" | awk '$1 == "LOAD" { print $NF; exit }')"
      case "$alignment" in
        0x4000 | 16384) ;;
        *) fail "$abi: LOAD segment alignment is $alignment, need $REQUIRED_LOAD_ALIGNMENT" ;;
      esac
      ;;
  esac

  # A path from the build machine inside a shipped binary is both a
  # reproducibility failure and a small privacy leak about whoever built it.
  #
  # The Windows branch requires a second separator, so it matches `C:\Users\me\`
  # and not a bare drive-colon-backslash. Several megabytes of machine code
  # contain that three-byte sequence by chance: the x86_64 library trips it three
  # times on `G:\G`, which is instruction bytes rather than anything anybody
  # typed. A check that cries wolf on a clean build gets switched off, which
  # costs more than the check is worth.
  if strings "$lib" | grep -Eq '/home/[a-z]|/Users/|[A-Za-z]:\\\\[^\\ ]+\\\\'; then
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
