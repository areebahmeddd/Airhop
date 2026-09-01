#!/usr/bin/env bash
#
# Build the Android Tor libraries in the pinned container, then verify them.
# This is the supported way to produce the binaries that ship.
#
#     native/arti/build-in-container.sh [--clean]
#
# A local build with your own Rust and your own NDK is fine while developing,
# but it is not what CI checks: build-android.sh refuses to run outside this
# container unless your toolchain happens to match TOOLCHAIN.env exactly.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/TOOLCHAIN.env"

IMAGE="airhop-arti-builder:${ARTI_CLIENT_VERSION}"

command -v docker >/dev/null 2>&1 || {
  echo "error: Docker is required to build the native Tor libraries" >&2
  exit 1
}

# Docker on Windows is a Windows binary reached through a POSIX shell, so it
# cannot resolve the `/c/Users/...` paths that shell hands out, and the shell in
# turn rewrites anything that looks like a path, including the container-side
# half of a volume mount. Both halves have to be handled, and neither matters
# anywhere else.
#
# `cygpath -m` produces `C:/Users/...`, which Docker accepts. On Linux and macOS
# there is no cygpath and this is the identity function.
host_path() {
  if command -v cygpath >/dev/null 2>&1; then
    cygpath -m "$1"
  else
    printf '%s' "$1"
  fi
}

# Stops the shell rewriting `/workspace` into a path inside the Git install.
export MSYS_NO_PATHCONV=1

# Ownership is a real concern on Linux, where a container writing as root leaves
# root-owned libraries in the working tree. Windows bind mounts carry no Unix
# ownership at all, and the UID the shell reports there is not one the image
# knows, so mapping it only breaks the build.
USER_ARGS=()
if [ "$(host_path /)" = "/" ]; then
  USER_ARGS=(--user "$(id -u):$(id -g)")
fi

[[ "$NATIVE_SOURCE_DATE_EPOCH" =~ ^[0-9]+$ ]] || {
  echo "error: NATIVE_SOURCE_DATE_EPOCH must be an integer" >&2
  exit 1
}

# Cargo's registry and build cache live in the repository rather than in the
# container, so a rebuild does not re-download the whole dependency graph. Kept
# out of git by .gitignore.
mkdir -p "$REPO_ROOT/.native-build/cargo-home"

# Context is the crate directory, not the repository root. The image needs one
# file; sending node_modules and the git history to the daemon on every run buys
# nothing and costs minutes.
docker build \
  --platform linux/amd64 \
  --file "$(host_path "$SCRIPT_DIR/Dockerfile")" \
  --tag "$IMAGE" \
  "$(host_path "$SCRIPT_DIR")"

# Runs as the invoking user so the libraries it writes into android/ are owned
# by that user rather than by root.
docker run --rm \
  --platform linux/amd64 \
  "${USER_ARGS[@]}" \
  --env CARGO_HOME=/workspace/.native-build/cargo-home \
  --env HOME=/workspace/.native-build \
  --env SOURCE_DATE_EPOCH="$NATIVE_SOURCE_DATE_EPOCH" \
  --volume "$(host_path "$REPO_ROOT"):/workspace" \
  "$IMAGE" \
  ${1:+"$1"}

echo
echo "Next, in the same commit:"
echo "  node scripts/verify-vendored.js --write"
echo "  npm run verify:vendored"
