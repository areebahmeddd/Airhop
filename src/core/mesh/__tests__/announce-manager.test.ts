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
  AnnounceManager,
  Capability,
  decodeAnnouncePayload,
  decodeCapabilities,
  encodeAnnouncePayload,
  encodeCapabilities,
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
    const hex = bytesToHex(payload);
    expect(hex).toContain("050104");
  });

  test("gateway-off announce omits the capabilities TLV", () => {
    const id = makeIdentity();
    const withCap = encodeAnnouncePayload(id, "alice", [], undefined, 0);
    const decoded = decodeAnnouncePayload(withCap, new Uint8Array(8));
    expect(decoded?.capabilities).toBe(0);
    // No 05-01 TLV header present at all (old-client shape).
    expect(bytesToHex(withCap)).not.toContain("0501");
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
