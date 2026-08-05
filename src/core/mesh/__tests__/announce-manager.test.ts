/**
 * @jest-environment node
 *
 * Capability advertisement in the ANNOUNCE packet (TLV 0x05). The byte layout
 * must match bitchat PeerCapabilities.encoded() exactly, so a bitchat gateway
 * reads our advertisement and we read its. See PeerCapabilities.swift.
 */
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import type { Identity } from "../../crypto/identity";
import {
  ANNOUNCE_MAX_SKEW_MS,
  AnnounceManager,
  Capability,
  decodeAnnouncePayload,
  decodeCapabilities,
  encodeAnnouncePayload,
  encodeCapabilities,
  isAnnounceFresh,
} from "../announce-manager";

function makeIdentity(): Identity {
  const noiseStaticPrivKey = x25519.utils.randomSecretKey();
  const noiseStaticPubKey = x25519.getPublicKey(noiseStaticPrivKey);
  const signingPrivKey = ed25519.utils.randomSecretKey();
  const signingPubKey = ed25519.getPublicKey(signingPrivKey);
  const peerID = bytesToHex(sha256(noiseStaticPubKey)).slice(0, 16);
  return {
    noiseStaticPrivKey,
    noiseStaticPubKey,
    signingPrivKey,
    signingPubKey,
    peerID,
    nostrPubKey: bytesToHex(signingPubKey),
  };
}

// bitchat PeerCapabilities.localSupported = [.vouch, .prekeys, .groups]
//   prekeys 1<<0 | groups 1<<3 | vouch 1<<5 = 0x01 | 0x08 | 0x20 = 0x29
const BITCHAT_LOCAL_SUPPORTED = 0x29;

// Walk the announce payload and return the value of one TLV, or null if that
// type is absent.
//
// Asking the structure rather than searching the hex dump. `makeIdentity`
// generates fresh random keys on every run, so a payload carries 64 bytes of
// noise that any short hex needle will eventually appear inside. A "0501" found
// two thirds of the way through a public key says nothing about whether a
// capabilities TLV was written, and a test that reads it that way fails roughly
// once in every few hundred CI runs for no reason.
function readTlv(payload: Uint8Array, wantType: number): Uint8Array | null {
  let off = 0;
  while (off + 2 <= payload.length) {
    const type = payload[off];
    const len = payload[off + 1];
    if (off + 2 + len > payload.length) return null;
    if (type === wantType) return payload.slice(off + 2, off + 2 + len);
    off += 2 + len;
  }
  return null;
}

const TLV_CAPABILITIES = 0x05;

describe("isAnnounceFresh", () => {
  // Well past the guard window so the real comparison is what is being tested.
  const NOW = 10 * ANNOUNCE_MAX_SKEW_MS;

  test("accepts an announce stamped now", () => {
    expect(isAnnounceFresh(NOW, NOW)).toBe(true);
  });

  test("accepts clock skew in both directions up to the bound", () => {
    expect(isAnnounceFresh(NOW - ANNOUNCE_MAX_SKEW_MS, NOW)).toBe(true);
    expect(isAnnounceFresh(NOW + ANNOUNCE_MAX_SKEW_MS, NOW)).toBe(true);
  });

  test("refuses a replayed announce from beyond the bound", () => {
    expect(isAnnounceFresh(NOW - ANNOUNCE_MAX_SKEW_MS - 1, NOW)).toBe(false);
    // An hour-old capture is the actual attack: still signed, still key-bound.
    expect(isAnnounceFresh(NOW - 60 * 60 * 1000, NOW)).toBe(false);
  });

  test("refuses a far-future timestamp", () => {
    // The forward half, which iOS does not check. Parking a timestamp in the
    // future is how you build a packet that never becomes stale.
    expect(isAnnounceFresh(NOW + ANNOUNCE_MAX_SKEW_MS + 1, NOW)).toBe(false);
  });

  test("accepts everything when the clock has not been set yet", () => {
    // A device early in the epoch must still be able to join a mesh. Without
    // the guard this underflows and drops every announce instead.
    expect(isAnnounceFresh(0, 0)).toBe(true);
    expect(isAnnounceFresh(ANNOUNCE_MAX_SKEW_MS * 5, 1000)).toBe(true);
  });

  test("is never tighter than either upstream in the direction it checks", () => {
    // iOS BLEPacketFreshnessPolicy: 900s, backwards only.
    // Android AnnouncementIdentityValidator: 600s, symmetric.
    // Anything either upstream accepts, we must accept, or we drop legitimate
    // bitchat traffic.
    expect(ANNOUNCE_MAX_SKEW_MS).toBeGreaterThanOrEqual(900 * 1000);
    expect(ANNOUNCE_MAX_SKEW_MS).toBeGreaterThanOrEqual(600 * 1000);
  });
});

describe("encodeCapabilities / decodeCapabilities", () => {
  test("gateway bit is a single 0x04 byte", () => {
    expect([...encodeCapabilities(Capability.gateway)]).toEqual([0x04]);
  });

  test("empty set encodes to a single zero byte (distinct from absent)", () => {
    // Mirrors bitchat's repeat/while: at least one byte even for rawValue 0.
    expect([...encodeCapabilities(0)]).toEqual([0x00]);
  });

  test("bitchat localSupported encodes to 0x29", () => {
    expect([...encodeCapabilities(BITCHAT_LOCAL_SUPPORTED)]).toEqual([0x29]);
  });

  test("bridge bit (1<<7) fits one byte, trailing zeros dropped", () => {
    expect([...encodeCapabilities(Capability.bridge)]).toEqual([0x80]);
  });

  test("multi-byte value is little-endian with trailing zeros dropped", () => {
    // 0x0100 -> [0x00, 0x01]; the high zero byte is dropped after that.
    expect([...encodeCapabilities(0x0100)]).toEqual([0x00, 0x01]);
  });

  test("decode is the inverse and ignores bytes beyond the low bits", () => {
    expect(decodeCapabilities(new Uint8Array([0x04]))).toBe(Capability.gateway);
    expect(decodeCapabilities(new Uint8Array([0x29]))).toBe(
      BITCHAT_LOCAL_SUPPORTED,
    );
    expect(decodeCapabilities(new Uint8Array([]))).toBe(0);
    // A future client advertising unknown high bits still decodes its low bits.
    expect(
      decodeCapabilities(new Uint8Array([0x04, 0x00, 0x00, 0x00])) &
        Capability.gateway,
    ).toBe(Capability.gateway);
  });
});

describe("ANNOUNCE capabilities TLV", () => {
  test("gateway-on announce carries the exact bytes 05 01 04", () => {
    const id = makeIdentity();
    const payload = encodeAnnouncePayload(
      id,
      "alice",
      [],
      undefined,
      Capability.gateway,
    );
    // Type 0x05, length 1, value 0x04, read as a TLV rather than matched as
    // text, so a chance collision inside a key cannot answer for it.
    expect(readTlv(payload, TLV_CAPABILITIES)).toEqual(
      new Uint8Array([Capability.gateway]),
    );
  });

  test("gateway-off announce omits the capabilities TLV", () => {
    const id = makeIdentity();
    const withCap = encodeAnnouncePayload(id, "alice", [], undefined, 0);
    const decoded = decodeAnnouncePayload(withCap, new Uint8Array(8));
    expect(decoded?.capabilities).toBe(0);
    // Absent entirely, not merely decoding to zero: a peer with no bits has to
    // look like an old client on the wire (old-client shape).
    expect(readTlv(withCap, TLV_CAPABILITIES)).toBeNull();
  });

  test("round-trips the gateway capability through decode", () => {
    const id = makeIdentity();
    const payload = encodeAnnouncePayload(
      id,
      "bob",
      [],
      undefined,
      Capability.gateway | Capability.groups,
    );
    const info = decodeAnnouncePayload(payload, new Uint8Array(8));
    expect(info).not.toBeNull();
    expect(info!.capabilities & Capability.gateway).toBe(Capability.gateway);
    expect(info!.capabilities & Capability.groups).toBe(Capability.groups);
  });

  test("buildPacket signs an announce whose capabilities survive validation", () => {
    const id = makeIdentity();
    const mgr = new AnnounceManager();
    const pkt = mgr.buildPacket(id, "carol", [], undefined, Capability.gateway);
    const info = mgr.validateAndParse(pkt);
    expect(info).not.toBeNull();
    expect(info!.capabilities & Capability.gateway).toBe(Capability.gateway);
  });
});

describe("ANNOUNCE bridge geohash TLV (0x06)", () => {
  test("round-trips the advertised rendezvous cell", () => {
    const id = makeIdentity();
    const payload = encodeAnnouncePayload(
      id,
      "dave",
      [],
      undefined,
      Capability.bridge,
      "u4pruy",
    );
    // TLV on the wire: type 0x06, len 0x06, "u4pruy" = 75 34 70 72 75 79.
    expect(bytesToHex(payload)).toContain("0606753470727579");
    const info = decodeAnnouncePayload(payload, new Uint8Array(8));
    expect(info?.bridgeGeohash).toBe("u4pruy");
    expect(info!.capabilities & Capability.bridge).toBe(Capability.bridge);
  });

  test("omits the TLV when no cell is set (non-bridging peer)", () => {
    const id = makeIdentity();
    const payload = encodeAnnouncePayload(
      id,
      "eve",
      [],
      undefined,
      0,
      undefined,
    );
    const info = decodeAnnouncePayload(payload, new Uint8Array(8));
    expect(info?.bridgeGeohash).toBeUndefined();
  });

  test("a bridge advertises both the capability bit and the cell", () => {
    const id = makeIdentity();
    const mgr = new AnnounceManager();
    const pkt = mgr.buildPacket(
      id,
      "frank",
      [],
      undefined,
      Capability.bridge | Capability.gateway,
      "9q8yyk",
    );
    const info = mgr.validateAndParse(pkt);
    expect(info).not.toBeNull();
    expect(info!.capabilities & Capability.bridge).toBe(Capability.bridge);
    expect(info!.bridgeGeohash).toBe("9q8yyk");
  });
});
