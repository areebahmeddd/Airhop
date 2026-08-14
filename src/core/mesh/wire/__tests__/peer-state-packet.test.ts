/**
 * @jest-environment node
 */
// AuthenticatedPeerStatePacket (Noise payload 0x21): the identity proof that
// travels inside a completed session. See peer-state-packet.ts for why it is
// the difference between a peer saying something and a peer proving it.
import { ed25519 } from "@noble/curves/ed25519.js";
import { Capability } from "../../discovery/announce-manager";
import { NoisePayloadType } from "../noise-payload";
import {
  decodePeerStatePacket,
  encodePeerStatePacket,
} from "../peer-state-packet";

const KEY = ed25519.getPublicKey(new Uint8Array(32).fill(7));

describe("wire values", () => {
  // These are fixed by bitchat. Changing one silently makes every private
  // transfer with a bitchat peer take the unencrypted fallback path instead.
  test("authenticatedPeerState is 0x21", () => {
    expect(NoisePayloadType.AUTHENTICATED_PEER_STATE).toBe(0x21);
  });
  test("privateFile is 0x20, with 0x09 accepted from prerelease iOS", () => {
    expect(NoisePayloadType.PRIVATE_FILE).toBe(0x20);
    expect(NoisePayloadType.PRIVATE_FILE_LEGACY_ALIAS).toBe(0x09);
  });
  test("privateMedia is capability bit 8 and receipts bit 9", () => {
    expect(Capability.privateMedia).toBe(1 << 8);
    expect(Capability.privateMediaReceipts).toBe(1 << 9);
  });
});

describe("encode / decode", () => {
  test("round-trips capabilities and the signing key", () => {
    const state = { capabilities: Capability.privateMedia, signingPubKey: KEY };
    const decoded = decodePeerStatePacket(encodePeerStatePacket(state))!;
    expect(decoded.capabilities).toBe(Capability.privateMedia);
    expect(Array.from(decoded.signingPubKey)).toEqual(Array.from(KEY));
  });

  test("version byte is 1 and the two required TLVs follow", () => {
    const encoded = encodePeerStatePacket({
      capabilities: 0,
      signingPubKey: KEY,
    });
    expect(encoded[0]).toBe(0x01);
    expect(encoded[1]).toBe(0x01); // capabilities TLV
    expect(encoded[3 + encoded[2]]).toBe(0x02); // signing key TLV
  });

  test("an empty capability set still encodes one byte", () => {
    // "Always at least one byte so an empty set is distinguishable from an
    // absent TLV." A zero-length value would be a different statement.
    const encoded = encodePeerStatePacket({
      capabilities: 0,
      signingPubKey: KEY,
    });
    expect(encoded[2]).toBe(1);
    expect(decodePeerStatePacket(encoded)!.capabilities).toBe(0);
  });

  test("a high bit widens the field and survives the round trip", () => {
    const bits = Capability.privateMedia | Capability.privateMediaReceipts;
    const decoded = decodePeerStatePacket(
      encodePeerStatePacket({ capabilities: bits, signingPubKey: KEY }),
    )!;
    expect(decoded.capabilities).toBe(bits);
  });
});

// Every case below must change NO state. A half-understood identity proof is
// worth less than none: acting on part of one is how a downgrade gets through.
describe("malformed input is refused whole", () => {
  const valid = encodePeerStatePacket({
    capabilities: Capability.privateMedia,
    signingPubKey: KEY,
  });

  test("an unknown version is ignored", () => {
    const bad = Uint8Array.from(valid);
    bad[0] = 0x02;
    expect(decodePeerStatePacket(bad)).toBeNull();
  });

  test("an empty packet is ignored", () => {
    expect(decodePeerStatePacket(new Uint8Array(0))).toBeNull();
  });

  test("a missing signing key is ignored", () => {
    const capsOnly = new Uint8Array([0x01, 0x01, 0x01, 0x00]);
    expect(decodePeerStatePacket(capsOnly)).toBeNull();
  });

  test("a missing capability field is ignored", () => {
    const keyOnly = new Uint8Array([0x01, 0x02, 32, ...KEY]);
    expect(decodePeerStatePacket(keyOnly)).toBeNull();
  });

  test("a duplicated required field is ignored", () => {
    const doubled = new Uint8Array([...valid, 0x01, 0x01, 0xff]);
    expect(decodePeerStatePacket(doubled)).toBeNull();
  });

  test("a wrong-length signing key is ignored", () => {
    const short = new Uint8Array([
      0x01,
      0x01,
      1,
      0x00,
      0x02,
      31,
      ...KEY.slice(0, 31),
    ]);
    expect(decodePeerStatePacket(short)).toBeNull();
  });

  // Two byte strings meaning one value is a fingerprinting handle and a place
  // for implementations to disagree, so the packet is refused rather than the
  // field quietly normalised.
  test("a non-minimal capability encoding is ignored", () => {
    const nonMinimal = new Uint8Array([
      0x01,
      0x01,
      2,
      0x01,
      0x00,
      0x02,
      32,
      ...KEY,
    ]);
    expect(decodePeerStatePacket(nonMinimal)).toBeNull();
  });

  test("a TLV whose length runs off the end is ignored", () => {
    expect(
      decodePeerStatePacket(new Uint8Array([0x01, 0x02, 32, 1, 2, 3])),
    ).toBeNull();
  });

  test("trailing bytes that are not a whole TLV are ignored", () => {
    expect(decodePeerStatePacket(new Uint8Array([...valid, 0x07]))).toBeNull();
  });

  test("truncating a valid packet at every length never throws", () => {
    for (let i = 0; i < valid.length; i++) {
      expect(() => decodePeerStatePacket(valid.slice(0, i))).not.toThrow();
    }
  });
});

// Forward compatibility: a field we do not know about must not invalidate a
// packet we otherwise fully understand, or the next protocol addition breaks
// every client that shipped before it.
describe("unknown TLVs are skipped", () => {
  test("a future field between the required ones is ignored", () => {
    const withExtra = new Uint8Array([
      0x01,
      0x01,
      1,
      0x00,
      0x7f,
      3,
      0xaa,
      0xbb,
      0xcc,
      0x02,
      32,
      ...KEY,
    ]);
    const decoded = decodePeerStatePacket(withExtra)!;
    expect(decoded).not.toBeNull();
    expect(Array.from(decoded.signingPubKey)).toEqual(Array.from(KEY));
  });
});
