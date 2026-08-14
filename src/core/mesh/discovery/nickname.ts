// Unicode normalization for nicknames.
//
// A nickname arrives over the wire as UTF-8 in ANNOUNCE TLV 0x01, and the same
// visible name has more than one valid encoding: "José" is either U+00E9 or
// U+0065 followed by the combining acute U+0301. The two render identically and
// compare unequal, so without a single canonical form the mesh sees two people.
//
// The failure this prevents is silent. Mentions match on the nickname string,
// so a mention typed on one platform against a name announced by another simply
// does not fire: no error, no notification, no way for either side to tell why.
// The same mismatch splits autocomplete into duplicate entries and lets one peer
// occupy two rows of a participant list.
//
// NFC (composed) is the form chosen here because it is what the web platform,
// Swift's `precomposedStringWithCanonicalMapping` and bitchat all settle on, so
// normalizing here agrees with what the other implementations store.
//
// This is a local canonicalization, not a wire change. The packet still carries
// whatever bytes the sender chose, peer IDs derive from keys rather than names,
// and no signature covers the normalized form. A peer that normalizes
// differently, or not at all, stays fully interoperable.

// The canonical form of a nickname, for storage and for comparison.
//
// Also trims surrounding whitespace: a trailing space is invisible in a name and
// would defeat the comparison this exists to make reliable.
export function normalizeNickname(nickname: string): string {
  return nickname.normalize("NFC").trim();
}

// Whether two nicknames name the same person, ignoring encoding and case.
//
// Case folding uses toLowerCase() on the normalized form, matching the
// case-insensitive matching the mention helpers already do.
export function sameNickname(a: string, b: string): boolean {
  return (
    normalizeNickname(a).toLowerCase() === normalizeNickname(b).toLowerCase()
  );
}

// The key to compare or de-duplicate a nickname by. Use this rather than
// calling toLowerCase() on a raw string: the whole point is that a raw string
// may be in either encoding.
export function nicknameKey(nickname: string): string {
  return normalizeNickname(nickname).toLowerCase();
}
