/**
 * @jest-environment node
 */
// Round-trip + structural tests for bitchat's nip44-v2 Nostr DM encryption.
// Full byte-parity with a real bitchat ciphertext needs a captured vector; these
// lock in the scheme's shape and self-consistency.
import { secp256k1 } from "@noble/curves/secp256k1.js";
import {
  bitchatNip44Decrypt,
  bitchatNip44Encrypt,
  normalizeSecretKeyEvenY,
  xOnlyPublicKey,
} from "../bitchat-nostr-crypto";

describe("bitchat-nostr-crypto", () => {
  it("round-trips a message between sender and recipient", () => {
    const senderPriv = secp256k1.utils.randomSecretKey();
    const recipPriv = secp256k1.utils.randomSecretKey();
    const senderX = xOnlyPublicKey(senderPriv);
    const recipX = xOnlyPublicKey(recipPriv);

    const ct = bitchatNip44Encrypt("hello bitchat", recipX, senderPriv);
    expect(ct.startsWith("v2:")).toBe(true);
    const pt = bitchatNip44Decrypt(ct, senderX, recipPriv);
    expect(pt).toBe("hello bitchat");
  });

  it("round-trips UTF-8 and longer content", () => {
    const a = secp256k1.utils.randomSecretKey();
    const b = secp256k1.utils.randomSecretKey();
    const msg = "café ☕ 日本語 " + "x".repeat(500);
    const ct = bitchatNip44Encrypt(msg, xOnlyPublicKey(b), a);
    expect(bitchatNip44Decrypt(ct, xOnlyPublicKey(a), b)).toBe(msg);
  });

  it("produces a fresh nonce each time (different ciphertexts)", () => {
    const a = secp256k1.utils.randomSecretKey();
    const b = secp256k1.utils.randomSecretKey();
    const bx = xOnlyPublicKey(b);
    expect(bitchatNip44Encrypt("same", bx, a)).not.toBe(
      bitchatNip44Encrypt("same", bx, a),
    );
  });

  it("fails to decrypt with the wrong recipient key", () => {
    const a = secp256k1.utils.randomSecretKey();
    const b = secp256k1.utils.randomSecretKey();
    const wrong = secp256k1.utils.randomSecretKey();
    const ct = bitchatNip44Encrypt("secret", xOnlyPublicKey(b), a);
    expect(bitchatNip44Decrypt(ct, xOnlyPublicKey(a), wrong)).toBeNull();
  });

  it("returns null for a non-v2 ciphertext", () => {
    const b = secp256k1.utils.randomSecretKey();
    expect(bitchatNip44Decrypt("garbage", xOnlyPublicKey(b), b)).toBeNull();
  });

  it("normalizeSecretKeyEvenY yields an even-Y public key", () => {
    for (let i = 0; i < 8; i++) {
      const priv = normalizeSecretKeyEvenY(secp256k1.utils.randomSecretKey());
      expect(secp256k1.getPublicKey(priv, true)[0]).toBe(0x02);
    }
  });
});
