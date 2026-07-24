/**
 * @jest-environment node
 */
// Private group wire + crypto (0x25 messages, creator-signed state over Noise).
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import {
  decodeGroupEnvelope,
  decodeGroupState,
  decodeRoster,
  encodeGroupState,
  encodeRoster,
  groupFingerprint,
  newGroupID,
  newGroupKey,
  openGroupMessage,
  sealGroupMessage,
  signGroupState,
  verifyGroupState,
  type BitchatGroup,
  type GroupMember,
} from "../group-protocol";

function member(nick: string): {
  member: GroupMember;
  signPriv: Uint8Array;
} {
  const signPriv = ed25519.utils.randomSecretKey();
  const noisePub = x25519.getPublicKey(
    crypto.getRandomValues(new Uint8Array(32)),
  );
  return {
    member: {
      fingerprint: groupFingerprint(noisePub),
      signingKey: ed25519.getPublicKey(signPriv),
      nickname: nick,
    },
    signPriv,
  };
}

describe("group roster", () => {
  it("round-trips through encode/decode", () => {
    const a = member("alice").member;
    const b = member("bob").member;
    const decoded = decodeRoster(encodeRoster([a, b])!)!;
    expect(decoded).toHaveLength(2);
    expect(decoded[0].nickname).toBe("alice");
    expect(decoded[1].fingerprint).toBe(b.fingerprint);
  });
});

describe("group state (invite/key update)", () => {
  it("signs, encodes, decodes and verifies against the creator key", () => {
    const creator = member("creator");
    const other = member("member");
    const group: BitchatGroup = {
      groupID: newGroupID(),
      name: "trip planning",
      epoch: 0,
      members: [creator.member, other.member],
      creatorFingerprint: creator.member.fingerprint,
    };
    const key = newGroupKey();
    const state = signGroupState(group, key, creator.signPriv)!;
    expect(verifyGroupState(state)).toBe(true);

    const decoded = decodeGroupState(encodeGroupState(state)!)!;
    expect(decoded.name).toBe("trip planning");
    expect(decoded.members).toHaveLength(2);
    expect([...decoded.key]).toEqual([...key]);
    expect(verifyGroupState(decoded)).toBe(true);
  });

  it("fails verification if the roster is tampered", () => {
    const creator = member("creator");
    const group: BitchatGroup = {
      groupID: newGroupID(),
      name: "g",
      epoch: 1,
      members: [creator.member],
      creatorFingerprint: creator.member.fingerprint,
    };
    const state = signGroupState(group, newGroupKey(), creator.signPriv)!;
    const intruder = member("intruder").member;
    const forged = { ...state, members: [...state.members, intruder] };
    expect(verifyGroupState(forged)).toBe(false);
  });
});

describe("group message (0x25)", () => {
  it("seals and opens with the epoch key, verifying the sender signature", () => {
    const groupID = newGroupID();
    const key = newGroupKey();
    const sender = member("sender");
    const payload = sealGroupMessage({
      content: "meet at 8",
      messageID: "m1",
      senderNickname: "sender",
      senderSigningKey: sender.member.signingKey,
      senderSigningPrivKey: sender.signPriv,
      timestampMs: 1_700_000_000_000,
      groupID,
      epoch: 2,
      key,
    })!;

    const env = decodeGroupEnvelope(payload)!;
    expect(env.epoch).toBe(2);
    const opened = openGroupMessage(env, key)!;
    expect(opened.content).toBe("meet at 8");
    expect(opened.messageID).toBe("m1");
    expect([...opened.senderSigningKey]).toEqual([...sender.member.signingKey]);
  });

  it("cannot be opened with the wrong key", () => {
    const groupID = newGroupID();
    const sender = member("s");
    const payload = sealGroupMessage({
      content: "x",
      messageID: "m",
      senderNickname: "s",
      senderSigningKey: sender.member.signingKey,
      senderSigningPrivKey: sender.signPriv,
      timestampMs: 1,
      groupID,
      epoch: 0,
      key: newGroupKey(),
    })!;
    const env = decodeGroupEnvelope(payload)!;
    expect(openGroupMessage(env, newGroupKey())).toBeNull();
  });

  it("rejects a message replayed under a different epoch (AAD binding)", () => {
    const groupID = newGroupID();
    const key = newGroupKey();
    const sender = member("s");
    const payload = sealGroupMessage({
      content: "x",
      messageID: "m",
      senderNickname: "s",
      senderSigningKey: sender.member.signingKey,
      senderSigningPrivKey: sender.signPriv,
      timestampMs: 1,
      groupID,
      epoch: 3,
      key,
    })!;
    const env = decodeGroupEnvelope(payload)!;
    // Flip the epoch: the AEAD additional data no longer matches, so decrypt
    // fails outright.
    expect(openGroupMessage({ ...env, epoch: 4 }, key)).toBeNull();
  });
});
