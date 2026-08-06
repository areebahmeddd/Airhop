// Canonical relay address for the build-time scripts.
//
// A second copy of validateRelayUrl (src/core/nostr/geo-relay.ts): that one is
// TypeScript bundled by Metro, this runs in plain node under CI, and nothing
// can share a module across that boundary. relay-url-parity.test.ts asserts the
// two agree so they cannot drift.
//
// The upstream feed lists many hosts twice, bare and with an explicit :443.
// Those are one relay, and bitchat collapses them before picking a cell's
// relays, so we do too or our picks diverge from theirs.

// Returns "wss://host[:port]" or null. Mirrors bitchat's
// GeoRelayDirectory.validatedDirectoryAddress: ASCII only, wss/https scheme,
// no credentials/query/fragment/path, a real DNS hostname (>= 2 labels, each
// 1-63 chars of [a-z0-9-] with no leading/trailing dash), not a bare IP, not a
// loopback or private name. An explicit :443 is dropped as the wss default;
// any other port is kept, being a different endpoint.
function canonicalRelayUrl(raw) {
  const value = String(raw).trim();
  // Printable ASCII only (no spaces, no control characters).
  if (value.length === 0 || !/^[!-~]+$/.test(value)) return null;

  let rest = value;
  const scheme = /^([a-z][a-z0-9+.-]*):\/\//i.exec(value);
  if (scheme !== null) {
    const s = scheme[1].toLowerCase();
    if (s !== "wss" && s !== "https") return null;
    rest = value.slice(scheme[0].length);
  }
  // No userinfo, query, or fragment.
  if (rest.includes("@") || rest.includes("?") || rest.includes("#")) {
    return null;
  }
  // Only an empty path or "/" is allowed.
  const slash = rest.indexOf("/");
  let authority = rest;
  if (slash !== -1) {
    if (rest.slice(slash) !== "/") return null;
    authority = rest.slice(0, slash);
  }

  let host = authority;
  let port;
  const colon = authority.lastIndexOf(":");
  if (colon !== -1) {
    const portStr = authority.slice(colon + 1);
    if (!/^[0-9]+$/.test(portStr)) return null;
    port = parseInt(portStr, 10);
    if (port < 1 || port > 65535) return null;
    host = authority.slice(0, colon);
  }

  host = host.toLowerCase();
  if (
    host.length === 0 ||
    host.length > 253 ||
    host.endsWith(".") ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return null;
  }

  const labels = host.split(".");
  // At least two labels, and not a bare IPv4 (all-numeric labels).
  if (labels.length < 2 || labels.every((l) => /^[0-9]+$/.test(l))) return null;
  const labelOk = (l) =>
    l.length >= 1 &&
    l.length <= 63 &&
    !l.startsWith("-") &&
    !l.endsWith("-") &&
    /^[a-z0-9-]+$/.test(l);
  if (!labels.every(labelOk)) return null;

  const hostPort =
    port !== undefined && port !== 443 ? `${host}:${port}` : host;
  return `wss://${hostPort}`;
}

module.exports = { canonicalRelayUrl };
