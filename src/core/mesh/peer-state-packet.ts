// AuthenticatedPeerStatePacket: the inner payload of NoisePayloadType 0x21.
//
// An ANNOUNCE is signed with the Ed25519 key carried inside it, so its
// signature only proves internal consistency. An attacker can copy a victim's
// public Noise key off the air, supply their own signing key and capability
// bits, self-sign, and pass every check: the peer ID still derives from the
// Noise key, and the signature still verifies. Trust-on-first-use holds the
// first key seen, so whoever announces first wins the pin and the real peer
// can never correct it. bitchat reaches the same conclusion about its own
// peer-ID binding: announced capability bits are hints, not proof of
// Noise-key possession.
//
// 0x21 travels inside a completed Noise XX session, and a session only
// completes when the remote static key hashes to the claimed peer ID (see
// mesh-service.sessionBindsTo). Receiving one therefore proves possession of
// the Noise private key, so a signing key learned this way may correct a TOFU
// pin. The reverse never applies: no announce overwrites authenticated state.
//
// Wire format, fixed by bitchat (PRIVATE-MEDIA-MIGRATION.md):
//
//   [version: u8 = 0x01][TLV...]
//   TLV = [type: u8][length: u8][value]
//     0x01  capabilities  1-8 bytes, minimal little-endian   required
//     0x02  signing key   32 bytes Ed25519                   required
//
// Decoding is all-or-nothing: duplicate required fields, non-minimal
// capabilities, malformed lengths, missing fields and unknown versions all
// change no state. Acting on half an identity proof is how a downgrade gets
// through.

const VERSION_1 = 0x01;

const TLV_CAPABILITIES = 0x01;
const TLV_SIGNING_KEY = 0x02;

const SIGNING_KEY_SIZE = 32;

export interface AuthenticatedPeerState {
  capabilities: number;
  signingPubKey: Uint8Array; // 32 bytes Ed25519
}

// Minimal little-endian: trailing zero bytes dropped, always at least one byte
// so an empty set stays distinct from an absent field. Same encoding as the
// announce capability TLV, so there is one representation to get wrong.
function encodeCapabilities(bits: number): Uint8Array {
  let value = bits >>> 0;
  const bytes: number[] = [];
  do {
    bytes.push(value & 0xff);
    value = Math.floor(value / 256);
  } while (value !== 0);
  return new Uint8Array(bytes);
}

// Decode with a canonicality check: a trailing zero byte is a non-minimal
// encoding of the same number. Two byte strings meaning one value is a
// fingerprinting handle and something implementations can disagree on, so the
// packet is refused rather than the field normalised.
function decodeCapabilities(value: Uint8Array): number | null {
  if (value.length < 1 || value.length > 8) return null;
  if (value.length > 1 && value[value.length - 1] === 0) return null;
  let bits = 0;
  const n = Math.min(value.length, 6); // stay inside 2^48, well clear of float loss
  for (let i = 0; i < n; i++) bits += value[i] * 2 ** (8 * i);
  return bits;
}

export function encodePeerStatePacket(
  state: AuthenticatedPeerState,
): Uint8Array {
  const caps = encodeCapabilities(state.capabilities);
  const out = new Uint8Array(1 + 2 + caps.length + 2 + SIGNING_KEY_SIZE);
  let o = 0;
  out[o++] = VERSION_1;
  out[o++] = TLV_CAPABILITIES;
  out[o++] = caps.length;
  out.set(caps, o);
  o += caps.length;
  out[o++] = TLV_SIGNING_KEY;
  out[o++] = SIGNING_KEY_SIZE;
  out.set(state.signingPubKey.slice(0, SIGNING_KEY_SIZE), o);
  return out;
}

// Returns null for anything not a complete, canonical, version-1 packet. The
// caller must treat null as "change no state" rather than "assume defaults".
export function decodePeerStatePacket(
  data: Uint8Array,
): AuthenticatedPeerState | null {
  if (data.length < 1) return null;
  if (data[0] !== VERSION_1) return null;

  let capabilities: number | null = null;
  let signingPubKey: Uint8Array | null = null;

  let off = 1;
  while (off + 2 <= data.length) {
    const type = data[off];
    const len = data[off + 1];
    off += 2;
    if (off + len > data.length) return null; // truncated value
    const value = data.slice(off, off + len);
    off += len;

    switch (type) {
      case TLV_CAPABILITIES: {
        if (capabilities !== null) return null; // duplicate required field
        const bits = decodeCapabilities(value);
        if (bits === null) return null;
        capabilities = bits;
        break;
      }
      case TLV_SIGNING_KEY:
        if (signingPubKey !== null) return null; // duplicate required field
        if (value.length !== SIGNING_KEY_SIZE) return null;
        signingPubKey = value;
        break;
      default:
        // Unknown TLVs are skipped, so a future field never invalidates a
        // packet an older client can otherwise fully understand.
        break;
    }
  }

  // Trailing bytes that are not a whole TLV mean the packet was cut short.
  if (off !== data.length) return null;
  if (capabilities === null || signingPubKey === null) return null;

  return { capabilities, signingPubKey };
}
