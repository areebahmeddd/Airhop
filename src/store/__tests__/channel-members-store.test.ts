/**
 * @jest-environment node
 */
// Who counts as a member of a private channel.
//
// A private channel has no roster on the wire, so membership is possession of
// the key and the only proof of it is a message that opened with it. Nearby
// peers are the right answer for `#bluetooth`, where radio range is the room,
// and the wrong one here.
import { useChannelMembersStore } from "../channel-members-store";

const CHANNEL = "#treehouse";
const PEER = "aabbccdd00112233";

beforeEach(() => {
  useChannelMembersStore.getState().clearAll();
});

describe("channel members", () => {
  it("records a peer whose message opened with the channel key", () => {
    useChannelMembersStore.getState().noteMember(CHANNEL, PEER, "sam");
    const members = useChannelMembersStore.getState().membersFor(CHANNEL);
    expect(members).toHaveLength(1);
    expect(members[0].peerID).toBe(PEER);
    expect(members[0].nickname).toBe("sam");
  });

  it("knows nobody in a channel where nobody has spoken", () => {
    expect(useChannelMembersStore.getState().membersFor(CHANNEL)).toEqual([]);
  });

  it("counts a member once however many messages they send", () => {
    const s = useChannelMembersStore.getState();
    s.noteMember(CHANNEL, PEER, "sam");
    s.noteMember(CHANNEL, PEER, "sam");
    s.noteMember(CHANNEL, PEER, "sam");
    expect(useChannelMembersStore.getState().membersFor(CHANNEL)).toHaveLength(
      1,
    );
  });

  it("follows a rename rather than listing the person twice", () => {
    const s = useChannelMembersStore.getState();
    s.noteMember(CHANNEL, PEER, "sam");
    s.noteMember(CHANNEL, PEER, "sam-2");
    const members = useChannelMembersStore.getState().membersFor(CHANNEL);
    expect(members).toHaveLength(1);
    expect(members[0].nickname).toBe("sam-2");
  });

  it("keeps each channel's roster to itself", () => {
    const s = useChannelMembersStore.getState();
    s.noteMember(CHANNEL, PEER, "sam");
    s.noteMember("#other", "1122334455667788", "kim");
    expect(useChannelMembersStore.getState().membersFor(CHANNEL)).toHaveLength(
      1,
    );
    expect(useChannelMembersStore.getState().membersFor("#other")).toHaveLength(
      1,
    );
  });

  // Leaving takes the key with it, so the evidence of who else held it is no
  // longer ours to keep. chat-store's removeChannel calls this.
  it("forgets a channel's roster when you leave it", () => {
    const s = useChannelMembersStore.getState();
    s.noteMember(CHANNEL, PEER, "sam");
    s.clearChannel(CHANNEL);
    expect(useChannelMembersStore.getState().membersFor(CHANNEL)).toEqual([]);
  });
});
