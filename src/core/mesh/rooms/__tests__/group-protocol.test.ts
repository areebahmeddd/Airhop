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
  groupStateAction,
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

// groupStateAction: which question gets asked first.
//
// By the time this runs the caller has verified the state's signature and
// confirmed the Noise peer who sent it is the creator the state names. Both are
// satisfied by an attacker naming themselves creator, since verifyGroupState
// looks the signing key up inside the roster it is checking. Neither says
// anything about the group we already hold, which is what this decides.
describe("groupStateAction", () => {
  const ME = "a".repeat(64);
  const CREATOR = "c".repeat(64);
  const ATTACKER = "e".repeat(64);

  const member = (fingerprint: string) => ({
    fingerprint,
    nickname: "x",
    noiseKey: new Uint8Array(32),
    signingKey: new Uint8Array(32),
  });

  const state = (creatorFingerprint: string, memberFps: string[]) => ({
    creatorFingerprint,
    members: memberFps.map(member),
  });

  test("a first-contact invite that includes us is applied", () => {
    expect(
      groupStateAction(state(CREATOR, [CREATOR, ME]), { myFingerprint: ME }),
    ).toBe("apply");
  });

  test("a new epoch from the same creator is applied", () => {
    expect(
      groupStateAction(state(CREATOR, [CREATOR, ME]), {
        heldCreatorFingerprint: CREATOR,
        myFingerprint: ME,
      }),
    ).toBe("apply");
  });

  test("the real creator dropping us from the roster is a removal", () => {
    expect(
      groupStateAction(state(CREATOR, [CREATOR]), {
        heldCreatorFingerprint: CREATOR,
        myFingerprint: ME,
      }),
    ).toBe("remove");
  });

  // The regression. A group ID rides in the clear on every group message, so
  // anyone who has seen one can craft this. If it returns "remove", the
  // victim's own client destroys its group key and drops the room - a silent
  // eviction that needs no group key and shows the victim nothing.
  test("an attacker naming themselves creator cannot evict us", () => {
    expect(
      groupStateAction(state(ATTACKER, [ATTACKER]), {
        heldCreatorFingerprint: CREATOR,
        myFingerprint: ME,
      }),
    ).toBe("reject");
  });

  test("an attacker naming themselves creator cannot replace the roster", () => {
    expect(
      groupStateAction(state(ATTACKER, [ATTACKER, ME]), {
        heldCreatorFingerprint: CREATOR,
        myFingerprint: ME,
      }),
    ).toBe("reject");
  });

  // A roster we were never in, for a group we do not hold, is not an eviction -
  // it is somebody else's group. Treating it as a removal would be harmless
  // today but would make the removal branch reachable without a held group,
  // which is the shape the bug had.
  test("a roster for a group we do not hold is refused, not removed", () => {
    expect(
      groupStateAction(state(CREATOR, [CREATOR]), { myFingerprint: ME }),
    ).toBe("reject");
  });

  test("the creator check runs before the roster check", () => {
    // Same input differing only in the held creator. If the roster check ran
    // first, both of these would come back "remove".
    const hostile = state(ATTACKER, [ATTACKER]);
    expect(
      groupStateAction(hostile, {
        heldCreatorFingerprint: CREATOR,
        myFingerprint: ME,
      }),
    ).toBe("reject");
    expect(
      groupStateAction(hostile, {
        heldCreatorFingerprint: ATTACKER,
        myFingerprint: ME,
      }),
    ).toBe("remove");
  });
});
