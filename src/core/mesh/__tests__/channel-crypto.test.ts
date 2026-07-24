/**
 * @jest-environment node
 */
// Private-channel encryption: only a key-holder can read a message, a wrong key
// never throws (so trial-decryption is safe), the content round-trips exactly,
// and every member derives the same unlinkable Nostr identity from the key.

import {
  deriveChannelNostrIdentity,
  generateChannelKey,
  isValidChannelKey,
  openChannelMessage,
  sealChannelMessage,
  type ChannelPlaintext,
} from "../channel-crypto";

function msg(overrides: Partial<ChannelPlaintext> = {}): ChannelPlaintext {
  return {
    msgId: "m1",
    senderID: "aabbccdd00112233",
    senderNickname: "alice",
    text: "hello 🎉 私",
    ...overrides,
  };
}

describe("channel key", () => {
  it("generates a valid 32-byte key", () => {
    expect(isValidChannelKey(generateChannelKey())).toBe(true);
  });

  it("rejects malformed keys", () => {
    expect(isValidChannelKey("not-a-key")).toBe(false);
    expect(isValidChannelKey("")).toBe(false);
  });
});

describe("seal / open round-trip", () => {
  it("recovers every field with the right key", () => {
    const key = generateChannelKey();
    const blob = sealChannelMessage(key, msg());
    expect(openChannelMessage(key, blob)).toEqual(msg());
  });

  it("handles empty text", () => {
    const key = generateChannelKey();
    const blob = sealChannelMessage(key, msg({ text: "" }));
    expect(openChannelMessage(key, blob)?.text).toBe("");
  });
});

describe("only a key-holder can read", () => {
  it("returns null (never throws) for the wrong key", () => {
    const blob = sealChannelMessage(generateChannelKey(), msg());
    expect(openChannelMessage(generateChannelKey(), blob)).toBeNull();
  });

  it("returns null for a tampered blob", () => {
    const key = generateChannelKey();
    const blob = sealChannelMessage(key, msg());
    blob[blob.length - 1] ^= 0xff;
    expect(openChannelMessage(key, blob)).toBeNull();
  });

  it("returns null for a garbage blob", () => {
    expect(
      openChannelMessage(generateChannelKey(), new Uint8Array(4)),
    ).toBeNull();
  });

  it("actually encrypts (ciphertext hides the text and sender)", () => {
    const key = generateChannelKey();
    const raw = new TextDecoder().decode(
      sealChannelMessage(
        key,
        msg({ text: "topsecret", senderNickname: "bob" }),
      ),
    );
    expect(raw).not.toContain("topsecret");
    expect(raw).not.toContain("bob");
  });
});

describe("channel Nostr identity", () => {
  it("is deterministic (all members converge on one keypair)", () => {
    const key = generateChannelKey();
    const a = deriveChannelNostrIdentity(key);
    const b = deriveChannelNostrIdentity(key);
    expect(a?.pubKeyHex).toBe(b?.pubKeyHex);
    expect(a?.pubKeyHex).toMatch(/^[0-9a-f]{64}$/);
  });

  it("differs per channel key", () => {
    expect(
      deriveChannelNostrIdentity(generateChannelKey())?.pubKeyHex,
    ).not.toBe(deriveChannelNostrIdentity(generateChannelKey())?.pubKeyHex);
  });

  it("returns null for a bad key", () => {
    expect(deriveChannelNostrIdentity("nope")).toBeNull();
  });
});
