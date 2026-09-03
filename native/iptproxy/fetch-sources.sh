#!/usr/bin/env bash
#
# Fetch the pluggable transport sources at the commits TOOLCHAIN.env pins.
#
#     native/iptproxy/fetch-sources.sh [--clean]
#
# Runs on the host because the builder image carries no git, and because both
# platforms need the same checkout before their own build script.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SRC_DIR="$REPO_ROOT/.native-build/iptproxy-src"

# shellcheck disable=SC1091
source "$REPO_ROOT/native/arti/TOOLCHAIN.env"

IPTPROXY_REPO=https://github.com/tladesignz/IPtProxy.git
DNSTT_REPO=https://github.com/tladesignz/dnstt.git

info() { printf '\033[0;36m==>\033[0m %s\n' "$*"; }
fail() { printf '\033[0;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

command -v git >/dev/null || fail "git is not on PATH"

if [ "${1:-}" = "--clean" ]; then
  info "Removing previous checkouts"
  rm -rf "$SRC_DIR"
fi

# Re-reading HEAD after the fetch is what makes this a pin rather than a
# download: a redirected or substituted remote would otherwise go unnoticed.
fetch_at() {
  local name="$1" url="$2" commit="$3"
  # Separate statement: bash expands every word of a `local` before assigning
  # any, so $name on the same line reads as unset.
  local dir="$SRC_DIR/$name"

  [ "${#commit}" -eq 40 ] || fail "$name: need a full 40-character commit, got '$commit'"

  if [ -d "$dir/.git" ] && [ "$(git -C "$dir" rev-parse HEAD 2>/dev/null)" = "$commit" ]; then
    info "$name already at $commit"
    return
  fi

  info "Fetching $name at $commit"
  rm -rf "$dir"
  mkdir -p "$dir"
  git -C "$dir" init -q
  git -C "$dir" fetch -q --depth 1 "$url" "$commit"
  git -C "$dir" checkout -q FETCH_HEAD

  local actual
  actual="$(git -C "$dir" rev-parse HEAD)"
  [ "$actual" = "$commit" ] || fail "$name: checked out $actual, expected $commit"
}

fetch_at iptproxy "$IPTPROXY_REPO" "$IPTPROXY_COMMIT"
fetch_at dnstt "$DNSTT_REPO" "$DNSTT_COMMIT"

# IPtProxy reaches dnstt through `replace ... => ../dnstt`, so it has to sit
# beside IPtProxy.go rather than come from the module proxy.
info "Placing dnstt beside IPtProxy.go"
rm -rf "$SRC_DIR/iptproxy/dnstt"
cp -a "$SRC_DIR/dnstt" "$SRC_DIR/iptproxy/dnstt"
rm -rf "$SRC_DIR/iptproxy/dnstt/.git"

# Upstream commits a prebuilt xcframework, and their build script skips the
# build when one is present. Airhop ships only what it compiled.
rm -rf "$SRC_DIR/iptproxy/IPtProxy.xcframework"

info "Sources ready in $SRC_DIR"
