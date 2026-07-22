/**
 * @jest-environment node
 */
// Focused tests for the message-action primitives (star) added on top of the
// existing chat store. Uses the in-memory MMKV mock: no native module required.

import { useChatStore, type ChatMessage } from "../chat-store";

beforeEach(() => {
  useChatStore.getState().clearAll();
});

function state() {
  return useChatStore.getState();
}

function makeMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: "aabbccdd00112233-1700000000-deadbeef",
    channel: "#test",
    senderID: "aabbccdd00112233",
    senderNickname: "alice",
    text: "hello",
    timestampMs: 1_700_000_000_000,
    isMine: false,
    ...overrides,
  };
}

describe("toggleStar", () => {
  it("stars and unstars a message", () => {
    const msg = makeMessage();
    state().addMessage(msg);

    state().toggleStar("#test", msg.id);
    expect(state().messages["#test"][0].isStarred).toBe(true);

    state().toggleStar("#test", msg.id);
    expect(state().messages["#test"][0].isStarred).toBe(false);
  });
});

// Mesh messages do not arrive in send order: a multi-hop relay is slower than a
// direct link but still carries the ORIGINAL sender timestamp. The store is the
// only place that can put them back in order.
describe("addMessage ordering", () => {
  const T = 1_700_000_000_000;

  function at(ms: number, id: string): ChatMessage {
    return makeMessage({ id, timestampMs: ms });
  }

  it("orders a late-arriving relayed message by its timestamp, not arrival", () => {
    state().addMessage(at(T, "first"));
    state().addMessage(at(T + 2000, "third"));
    // Arrives last, but was sent between the other two.
    state().addMessage(at(T + 1000, "second"));

    expect(state().messages["#test"].map((m) => m.id)).toEqual([
      "first",
      "second",
      "third",
    ]);
  });

  it("keeps messages sorted regardless of insertion order", () => {
    const order = [5, 1, 4, 2, 3];
    for (const n of order)
      state().addMessage(at(T + n * 1000, `m${String(n)}`));

    const times = state().messages["#test"].map((m) => m.timestampMs);
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it("appends a genuinely newest message to the end", () => {
    state().addMessage(at(T, "a"));
    state().addMessage(at(T + 1000, "b"));
    expect(state().messages["#test"].at(-1)?.id).toBe("b");
  });

  it("still dedupes by id", () => {
    state().addMessage(at(T, "dup"));
    state().addMessage(at(T + 5000, "dup"));
    expect(state().messages["#test"]).toHaveLength(1);
  });

  it("preserves relative order for identical timestamps", () => {
    state().addMessage(at(T, "x"));
    state().addMessage(at(T, "y"));
    expect(state().messages["#test"].map((m) => m.id)).toEqual(["x", "y"]);
  });
});

describe("renameChannel", () => {
  it("reports success and migrates messages", () => {
    state().addChannel("#old");
    state().addMessage(makeMessage({ id: "m1", channel: "#old" }));

    expect(state().renameChannel("#old", "new")).toBe(true);
    expect(state().channels).toContain("#new");
    expect(state().channels).not.toContain("#old");
    expect(state().messages["#new"]).toHaveLength(1);
    expect(state().messages["#new"][0].channel).toBe("#new");
  });

  it("refuses a rename onto an existing channel and leaves both intact", () => {
    // Regression: this used to no-op silently while the caller carried on, so
    // the TARGET channel's description got overwritten with the source's.
    state().addChannel("#foo");
    state().addChannel("#bar");
    state().setChannelDescription("#bar", "bar's own description");

    expect(state().renameChannel("#foo", "bar")).toBe(false);
    expect(state().channels).toEqual(expect.arrayContaining(["#foo", "#bar"]));
    expect(state().channelDescriptions["#bar"]).toBe("bar's own description");
  });

  it("refuses a no-op rename to the same name", () => {
    state().addChannel("#same");
    expect(state().renameChannel("#same", "same")).toBe(false);
  });

  it("moves lastThread with the rename so restore doesn't break", () => {
    state().addChannel("#old");
    state().setLastThread("#old");
    state().renameChannel("#old", "new");
    expect(state().lastThread).toBe("#new");
  });
});

describe("removeChannel", () => {
  it("clears activeChannel instead of reassigning it", () => {
    // Reassigning to an arbitrary surviving channel silently suppressed that
    // channel's unread badge, because addMessage skips the unread bump for
    // whatever activeChannel points at.
    state().addChannel("#a");
    state().setActiveChannel("#a");
    state().removeChannel("#a");
    expect(state().activeChannel).toBe("");
  });

  it("leaves an unrelated activeChannel alone", () => {
    state().addChannel("#a");
    state().addChannel("#b");
    state().setActiveChannel("#b");
    state().removeChannel("#a");
    expect(state().activeChannel).toBe("#b");
  });
});

describe("mergeChannel", () => {
  const T = 1_700_000_000_000;

  it("folds a Nostr-keyed thread into the real peer thread, in time order", () => {
    const from = "dm:nostr_abc";
    const to = "dm:aabbccdd00112233";
    state().addChannel(from);
    state().addMessage(
      makeMessage({ id: "n1", channel: from, timestampMs: T }),
    );
    state().addChannel(to);
    state().addMessage(
      makeMessage({ id: "b1", channel: to, timestampMs: T + 1000 }),
    );

    state().mergeChannel(from, to);

    expect(state().channels).not.toContain(from);
    expect(state().messages[from]).toBeUndefined();
    expect(state().messages[to].map((m) => m.id)).toEqual(["n1", "b1"]);
    // Moved messages must be re-keyed to their new channel.
    expect(state().messages[to].every((m) => m.channel === to)).toBe(true);
  });

  it("combines unread counts", () => {
    const from = "dm:nostr_abc";
    const to = "dm:aabbccdd00112233";
    state().setActiveChannel("");
    state().addMessage(makeMessage({ id: "n1", channel: from }));
    state().addMessage(makeMessage({ id: "b1", channel: to }));

    state().mergeChannel(from, to);

    expect(state().unreadCounts[to]).toBe(2);
    expect(state().unreadCounts[from]).toBeUndefined();
  });

  it("is a no-op when merging a channel into itself", () => {
    state().addMessage(makeMessage({ id: "m1", channel: "#test" }));
    state().mergeChannel("#test", "#test");
    expect(state().messages["#test"]).toHaveLength(1);
  });
});
