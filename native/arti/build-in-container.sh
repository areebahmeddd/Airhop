#!/usr/bin/env bash
#
# Build the Android Tor libraries in the pinned container, then verify them.
#
#     native/arti/build-in-container.sh [--clean]
#
# Direct builds are allowed for development, but this is the supported path for
# producing release artifacts.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/TOOLCHAIN.env"

# Tag the image with the pin file's digest so toolchain changes produce a new
# image instead of reusing one built from older pins.
TOOLCHAIN_DIGEST="$(sha256sum "$SCRIPT_DIR/TOOLCHAIN.env" | cut -c1-12)"
IMAGE="airhop-arti-builder:${TOOLCHAIN_DIGEST}"

command -v docker >/dev/null 2>&1 || {
  echo "error: Docker is required to build the native Tor libraries" >&2
  exit 1
}

# Convert paths for Docker on Windows. On Linux and macOS this is a no-op.
host_path() {
  if command -v cygpath >/dev/null 2>&1; then
    cygpath -m "$1"
  else
    printf '%s' "$1"
  fi
}

# Prevent MSYS from rewriting container paths such as /workspace.
export MSYS_NO_PATHCONV=1

# Avoid root-owned files on Linux. Windows bind mounts do not use Unix ownership.
USER_ARGS=()
if [ "$(host_path /)" = "/" ]; then
  USER_ARGS=(--user "$(id -u):$(id -g)")
fi

[[ "$NATIVE_SOURCE_DATE_EPOCH" =~ ^[0-9]+$ ]] || {
  echo "error: NATIVE_SOURCE_DATE_EPOCH must be an integer" >&2
  exit 1
}

# Keep Cargo's registry and build cache in the repository for faster rebuilds.
mkdir -p "$REPO_ROOT/.native-build/cargo-home"

# Pass only the pins consumed by the Dockerfile as build arguments.
#
# Passing them individually keeps Docker layers cached when an unrelated pin
# changes. Pins used only by the build scripts are not passed to the image.
BUILD_ARGS=()
for pin in \
  DEBIAN_SNAPSHOT \
  ANDROID_NDK_ARCHIVE ANDROID_NDK_SHA256 ANDROID_NDK_VERSION \
  ANDROID_PLATFORM_ARCHIVE ANDROID_PLATFORM_SHA1 ANDROID_PLATFORM_API \
  RUST_VERSION CARGO_NDK_VERSION \
  GO_ARCHIVE GO_SHA256 GO_VERSION; do
  [ -n "${!pin:-}" ] || {
    echo "error: $pin is not set in TOOLCHAIN.env" >&2
    exit 1
  }
  BUILD_ARGS+=(--build-arg "$pin=${!pin}")
done

# The image build context is only the native/arti directory. The source tree is
# mounted when the container runs.
docker build \
  --platform linux/amd64 \
  --file "$(host_path "$SCRIPT_DIR/Dockerfile")" \
  "${BUILD_ARGS[@]}" \
  --tag "$IMAGE" \
  "$(host_path "$SCRIPT_DIR")"

# The transport build next door reuses this image and needs a way to ask for it
# without also rebuilding the Tor client.
if [ "${1:-}" = "--image-only" ]; then
  echo "==> Built $IMAGE"
  exit 0
fi

# Mount the repository so the container can build and write the Android outputs.
docker run --rm \
  --platform linux/amd64 \
  "${USER_ARGS[@]}" \
  --env CARGO_HOME=/workspace/.native-build/cargo-home \
  --env HOME=/workspace/.native-build \
  --env SOURCE_DATE_EPOCH="$NATIVE_SOURCE_DATE_EPOCH" \
  --volume "$(host_path "$REPO_ROOT"):/workspace" \
  "$IMAGE" \
  "$@"

echo
echo "Next, in the same commit:"
echo "  node scripts/verify-vendored.js --write"
echo "  npm run verify:vendored"
