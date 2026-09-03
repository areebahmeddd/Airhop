#!/usr/bin/env bash
#
# Build the Android pluggable transport library in the pinned container.
#
#     native/iptproxy/build-in-container.sh [--clean]
#
# Reuses the image native/arti/Dockerfile defines, because both builds share an
# NDK and a second image would be a second place for the pins to drift.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ARTI_DIR="$REPO_ROOT/native/arti"

# shellcheck disable=SC1091
source "$ARTI_DIR/TOOLCHAIN.env"

TOOLCHAIN_DIGEST="$(sha256sum "$ARTI_DIR/TOOLCHAIN.env" | cut -c1-12)"
IMAGE="airhop-arti-builder:${TOOLCHAIN_DIGEST}"

command -v docker >/dev/null 2>&1 || {
  echo "error: Docker is required to build the native transport library" >&2
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

# Avoid root-owned files on Linux. Windows bind mounts do not use Unix ownership.
USER_ARGS=()
if [ "$(host_path /)" = "/" ]; then
  USER_ARGS=(--user "$(id -u):$(id -g)")
fi

# Fetched before MSYS_NO_PATHCONV is set: that variable stops MSYS rewriting
# container paths such as /workspace, and git on Windows needs the rewriting.
bash "$SCRIPT_DIR/fetch-sources.sh" "$@"

export MSYS_NO_PATHCONV=1

if ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
  echo "==> Builder image is missing; building it through native/arti"
  bash "$ARTI_DIR/build-in-container.sh" --image-only
fi

mkdir -p "$REPO_ROOT/.native-build/go-mod" "$REPO_ROOT/.native-build/go-build"

# Mount the repository so the container can build and write the aar.
docker run --rm \
  --platform linux/amd64 \
  "${USER_ARGS[@]}" \
  --entrypoint /bin/bash \
  --env HOME=/workspace/.native-build \
  --env GOMODCACHE=/workspace/.native-build/go-mod \
  --env GOCACHE=/workspace/.native-build/go-build \
  --env SOURCE_DATE_EPOCH="$NATIVE_SOURCE_DATE_EPOCH" \
  --volume "$(host_path "$REPO_ROOT"):/workspace" \
  "$IMAGE" \
  /workspace/native/iptproxy/build-android.sh

echo
echo "Next, in the same commit:"
echo "  git add android/app/libs"
echo "  node scripts/verify-vendored.js --write"
echo "  npm run verify:vendored"
