/**
 * @jest-environment node
 */
// Group store: persistence, epoch replacement, and the two-party state->message
// flow (creator signs state, member ingests it and opens a sealed message).
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { createMMKV } from "react-native-mmkv";
import {
  decodeGroupEnvelope,
  groupFingerprint,
  newGroupID,
  newGroupKey,
  openGroupMessage,
  sealGroupMessage,
  signGroupState,
  type BitchatGroup,
  type GroupMember,
} from "../../core/mesh/group-protocol";
import { groupChannel, useGroupStore } from "../group-store";

function member(nick: string): { member: GroupMember; signPriv: Uint8Array } {
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

describe("group store", () => {
  beforeEach(() => {
    useGroupStore.setState({ groups: [] });
    createMMKV({ id: "group-store" }).clearAll();
  });

  it("stores a local group and returns it in runtime (bytes) form", () => {
    const creator = member("me");
    const group: BitchatGroup = {
      groupID: newGroupID(),
      name: "crew",
      epoch: 0,
      members: [creator.member],
      creatorFingerprint: creator.member.fingerprint,
    };
    const key = newGroupKey();
    useGroupStore.getState().upsertLocal(group, key);

    const rt = useGroupStore.getState().getByID(group.groupID)!;
    expect(rt.name).toBe("crew");
    expect([...rt.key]).toEqual([...key]);
    expect(rt.members[0].signingKey).toBeInstanceOf(Uint8Array);
    const channel = groupChannel(bytesToHexLocal(group.groupID));
    expect(useGroupStore.getState().nameForChannel(channel)).toBe("crew");
  });

  it("adopts a newer epoch and ignores an older one", () => {
    const creator = member("me");
    const groupID = newGroupID();
    const base: BitchatGroup = {
      groupID,
      name: "g",
      epoch: 1,
      members: [creator.member],
      creatorFingerprint: creator.member.fingerprint,
    };
    useGroupStore.getState().upsertLocal(base, newGroupKey());
    // Older epoch: ignored.
    useGroupStore.getState().upsertLocal({ ...base, epoch: 0 }, newGroupKey());
    expect(useGroupStore.getState().get(bytesToHexLocal(groupID))!.epoch).toBe(
      1,
    );
    // Newer epoch: adopted.
    const newKey = newGroupKey();
    useGroupStore.getState().upsertLocal({ ...base, epoch: 2 }, newKey);
    const rt = useGroupStore.getState().get(bytesToHexLocal(groupID))!;
    expect(rt.epoch).toBe(2);
    expect([...rt.key]).toEqual([...newKey]);
  });

  it("carries a signed state from creator to member, who opens a message", () => {
    const creator = member("creator");
    const me = member("me");
    const groupID = newGroupID();
    const key = newGroupKey();
    const group: BitchatGroup = {
      groupID,
      name: "trip",
      epoch: 0,
      members: [creator.member, me.member],
      creatorFingerprint: creator.member.fingerprint,
    };
    const state = signGroupState(group, key, creator.signPriv)!;

    // Member ingests the verified state.
    useGroupStore.getState().upsertFromState(state);
    const rt = useGroupStore.getState().getByID(groupID)!;

    // Creator seals a message; member opens it with the stored key.
    const payload = sealGroupMessage({
      content: "wheels up",
      messageID: "g1",
      senderNickname: "creator",
      senderSigningKey: creator.member.signingKey,
      senderSigningPrivKey: creator.signPriv,
      timestampMs: 1_700_000_000_000,
      groupID,
      epoch: 0,
      key,
    })!;
    const opened = openGroupMessage(decodeGroupEnvelope(payload)!, rt.key)!;
    expect(opened.content).toBe("wheels up");
  });

  it("clears everything on wipe", () => {
    const creator = member("me");
    useGroupStore.getState().upsertLocal(
      {
        groupID: newGroupID(),
        name: "g",
        epoch: 0,
        members: [creator.member],
        creatorFingerprint: creator.member.fingerprint,
      },
      newGroupKey(),
    );
    useGroupStore.getState().clearAll();
    expect(useGroupStore.getState().groups).toHaveLength(0);
    expect(
      createMMKV({ id: "group-store" }).getString("groups"),
    ).toBeUndefined();
  });
});

function bytesToHexLocal(b: Uint8Array): string {
  let s = "";
  for (const x of b) s += x.toString(16).padStart(2, "0");
  return s;
}
