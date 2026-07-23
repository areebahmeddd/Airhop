// Deterministic human-readable usernames derived from a peer's public key.
//
// Format: <adjective>-<noun>-<4-hex-suffix>
// Example: "swift-falcon-3a9f"
//
// Both word lists are exactly 128 entries (power of 2) so the byte-modulo
// mapping is perfectly uniform. The first byte of the peer ID selects the
// adjective; the second byte selects the noun. The suffix is the first
// 4 hex characters of the peer ID for visual disambiguation.
//
// Properties:
//   - Deterministic: same peerID always gives the same username.
//   - Collision-resistant: 128 × 128 × 65536 ≈ 1 billion unique names.
//   - Human-readable: common English words, no offensive terms.
//   - Consistent with ARCHITECTURE.md §3 ("Adjective + Noun + 4-digit suffix").

// 128 adjectives. Selection: byte[0] % 128.
const ADJECTIVES: readonly string[] = [
  "amber",
  "ancient",
  "arctic",
  "atomic",
  "azure",
  "binary",
  "bold",
  "brief",
  "bright",
  "calm",
  "clear",
  "cold",
  "cosmic",
  "crimson",
  "crystal",
  "cyan",
  "dark",
  "deep",
  "digital",
  "distant",
  "dual",
  "dusty",
  "early",
  "east",
  "echo",
  "electric",
  "emerald",
  "empty",
  "even",
  "faint",
  "fast",
  "fierce",
  "fixed",
  "flat",
  "fleet",
  "free",
  "fresh",
  "frozen",
  "gentle",
  "glowing",
  "golden",
  "grand",
  "gray",
  "green",
  "grey",
  "hard",
  "high",
  "hollow",
  "inner",
  "jade",
  "keen",
  "kind",
  "late",
  "light",
  "liquid",
  "lone",
  "lost",
  "low",
  "lunar",
  "micro",
  "muted",
  "mystic",
  "nano",
  "neon",
  "night",
  "noble",
  "north",
  "nova",
  "null",
  "odd",
  "open",
  "pale",
  "plain",
  "polar",
  "prime",
  "pure",
  "quick",
  "quiet",
  "radiant",
  "rapid",
  "raw",
  "remote",
  "rough",
  "royal",
  "rust",
  "safe",
  "serene",
  "sharp",
  "silent",
  "silver",
  "slim",
  "slow",
  "small",
  "smart",
  "solar",
  "solid",
  "south",
  "sparse",
  "stable",
  "stark",
  "static",
  "still",
  "stone",
  "storm",
  "subtle",
  "swift",
  "tall",
  "thin",
  "tidal",
  "tiny",
  "tough",
  "true",
  "twin",
  "ultra",
  "vast",
  "void",
  "warm",
  "west",
  "wild",
  "wise",
  "zero",
  "zen",
  "zonal",
  "crisp",
  "cool",
  "vivid",
  "dense",
  "dim",
] as const;

// 128 nouns. Selection: byte[1] % 128.
const NOUNS: readonly string[] = [
  "anvil",
  "arc",
  "ash",
  "atlas",
  "atom",
  "beam",
  "bit",
  "blade",
  "bolt",
  "bone",
  "boom",
  "brace",
  "bridge",
  "brook",
  "cache",
  "chain",
  "cliff",
  "cloud",
  "coil",
  "cord",
  "core",
  "cove",
  "crane",
  "crest",
  "cube",
  "curve",
  "cycle",
  "dawn",
  "deck",
  "delta",
  "dome",
  "drift",
  "dusk",
  "dust",
  "echo",
  "edge",
  "ember",
  "falcon",
  "field",
  "flame",
  "flare",
  "flash",
  "fleet",
  "flint",
  "flow",
  "flux",
  "forge",
  "fork",
  "frame",
  "frost",
  "gate",
  "glow",
  "grid",
  "grove",
  "gulf",
  "halo",
  "hash",
  "helm",
  "hive",
  "hook",
  "horn",
  "hull",
  "iris",
  "isle",
  "key",
  "lamp",
  "lane",
  "lark",
  "leaf",
  "ledge",
  "lens",
  "link",
  "loop",
  "lure",
  "lynx",
  "maze",
  "mesh",
  "mill",
  "mint",
  "mist",
  "moat",
  "moon",
  "moss",
  "node",
  "null",
  "orb",
  "path",
  "peak",
  "pine",
  "pipe",
  "plane",
  "plate",
  "port",
  "probe",
  "pulse",
  "rack",
  "rail",
  "range",
  "reef",
  "relay",
  "rim",
  "ring",
  "rock",
  "rod",
  "root",
  "route",
  "sail",
  "scout",
  "seed",
  "shell",
  "signal",
  "slate",
  "slope",
  "spine",
  "spool",
  "spring",
  "stack",
  "star",
  "stem",
  "stone",
  "storm",
  "stream",
  "surge",
  "sweep",
  "sync",
  "tide",
  "torch",
  "trace",
] as const;

// Verify both lists are exactly 128 entries at module load time (caught in tests).
// Cast to number to avoid TS const-narrowing on .length comparisons.
const _adjLen = ADJECTIVES.length as number;
const _nounLen = NOUNS.length as number;
if (_adjLen !== 128 || _nounLen !== 128) {
  throw new Error(
    `username: word lists must be exactly 128 entries each (got ${_adjLen} adjectives, ${_nounLen} nouns)`,
  );
}

// ---- Nostr identities -------------------------------------------------------

// A peer reachable only over the Nostr internet bridge is keyed by its Nostr
// public key, prefixed to distinguish it from a 16-hex mesh peer ID.
export const NOSTR_ID_PREFIX = "nostr_";

export function isNostrId(id: string): boolean {
  return id.startsWith(NOSTR_ID_PREFIX);
}

// Short, honest label for a Nostr-only correspondent. They have no Noise-key
// fingerprint to derive an adjective-noun name from, so we show the tail of
// their public key, npub-style. The last 6 chars disambiguate plenty and this
// is the single formatting used everywhere a Nostr peer is named.
export function nostrShortLabel(id: string): string {
  return `npub…${id.slice(-6)}`;
}

// ---- Public API -------------------------------------------------------------

// Derive a human-readable username from a 16-hex-char peer ID.
//
// peerID is the first 16 hex chars of SHA-256(noiseStaticPubKey), as produced
// by identity.ts. A Nostr id ("nostr_<pubkey>") has no such fingerprint, so it
// returns its npub-style label instead of running the byte math (which would
// otherwise index the word lists with NaN and yield "undefined-undefined-...").
export function peerIDToUsername(peerID: string): string {
  // Nostr-only peer: no mesh fingerprint to map. Name it by its key tail.
  if (isNostrId(peerID)) return nostrShortLabel(peerID);
  if (peerID.length < 4) {
    throw new Error("username: peerID must be at least 4 hex characters");
  }
  const b0 = parseInt(peerID.slice(0, 2), 16);
  const b1 = parseInt(peerID.slice(2, 4), 16);
  // Defensive: an id whose leading chars are not hex. Never emit "undefined".
  if (Number.isNaN(b0) || Number.isNaN(b1)) {
    return `peer-${peerID.slice(0, 6).toLowerCase()}`;
  }
  const adj = ADJECTIVES[b0 % ADJECTIVES.length];
  const noun = NOUNS[b1 % NOUNS.length];
  const suffix = peerID.slice(0, 4).toLowerCase();
  return `${adj}-${noun}-${suffix}`;
}
