/**
 * @jest-environment node
 */
// Prekey bundle wire format + signing (0x24), byte-compatible with bitchat.
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import {
  decodePrekeyBundle,
  encodePrekeyBundle,
  PREKEY_MAX_PREKEYS,
  signPrekeyBundle,
  verifyPrekeyBundle,
  type Prekey,
} from "../prekey-bundle";

function makePrekeys(n: number): Prekey[] {
  return Array.from({ length: n }, (_, i) => ({
    id: 1000 + i,
    publicKey: x25519.getPublicKey(crypto.getRandomValues(new Uint8Array(32))),
  }));
}

describe("prekey bundle", () => {
  const signPriv = ed25519.utils.randomSecretKey();
  const signPub = ed25519.getPublicKey(signPriv);
  const noisePub = x25519.getPublicKey(
    crypto.getRandomValues(new Uint8Array(32)),
  );

  it("round-trips through encode/decode and verifies", () => {
    const bundle = signPrekeyBundle(
      {
        noiseStaticPublicKey: noisePub,
        prekeys: makePrekeys(4),
        generatedAt: 1_700_000_000_000,
      },
      signPriv,
    );
    expect(verifyPrekeyBundle(bundle, signPub)).toBe(true);

    const encoded = encodePrekeyBundle(bundle)!;
    const decoded = decodePrekeyBundle(encoded)!;
    expect(decoded.prekeys).toHaveLength(4);
    expect(decoded.generatedAt).toBe(1_700_000_000_000);
    expect([...decoded.noiseStaticPublicKey]).toEqual([...noisePub]);
    expect(decoded.prekeys[0].id).toBe(1000);
    expect(verifyPrekeyBundle(decoded, signPub)).toBe(true);
  });

  it("fails verification when a prekey is tampered", () => {
    const bundle = signPrekeyBundle(
      {
        noiseStaticPublicKey: noisePub,
        prekeys: makePrekeys(2),
        generatedAt: 1,
      },
      signPriv,
    );
    const forged = {
      ...bundle,
      prekeys: [
        { ...bundle.prekeys[0], id: bundle.prekeys[0].id + 1 },
        bundle.prekeys[1],
      ],
    };
    expect(verifyPrekeyBundle(forged, signPub)).toBe(false);
  });

  it("fails verification under a different signing key", () => {
    const bundle = signPrekeyBundle(
      {
        noiseStaticPublicKey: noisePub,
        prekeys: makePrekeys(1),
        generatedAt: 1,
      },
      signPriv,
    );
    const otherPub = ed25519.getPublicKey(ed25519.utils.randomSecretKey());
    expect(verifyPrekeyBundle(bundle, otherPub)).toBe(false);
  });

  it("rejects a bundle with more than the max prekeys on encode", () => {
    const bundle = signPrekeyBundle(
      {
        noiseStaticPublicKey: noisePub,
        prekeys: makePrekeys(PREKEY_MAX_PREKEYS + 1),
        generatedAt: 1,
      },
      signPriv,
    );
    expect(encodePrekeyBundle(bundle)).toBeNull();
  });

  it("rejects duplicate prekey IDs on decode", () => {
    const dup = makePrekeys(2);
    dup[1] = { ...dup[1], id: dup[0].id };
    const bundle = signPrekeyBundle(
      { noiseStaticPublicKey: noisePub, prekeys: dup, generatedAt: 1 },
      signPriv,
    );
    const encoded = encodePrekeyBundle(bundle)!;
    expect(decodePrekeyBundle(encoded)).toBeNull();
  });

  it("skips unknown TLVs for forward compatibility", () => {
    const bundle = signPrekeyBundle(
      {
        noiseStaticPublicKey: noisePub,
        prekeys: makePrekeys(1),
        generatedAt: 42,
      },
      signPriv,
    );
    const encoded = encodePrekeyBundle(bundle)!;
    const extended = new Uint8Array([...encoded, 0x7f, 0x00, 0x02, 0xaa, 0xbb]);
    const decoded = decodePrekeyBundle(extended);
    expect(decoded).not.toBeNull();
    expect(decoded!.generatedAt).toBe(42);
  });
});
