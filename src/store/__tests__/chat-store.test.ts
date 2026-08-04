/**
 * @jest-environment node
 */
// Focused tests for the message-action primitives (star) added on top of the
// existing chat store. Uses the in-memory MMKV mock: no native module required.

import {
  dropPendingChatPersistence,
  flushChatPersistence,
  subscribeInboundMessages,
  useChatStore,
  type ChatMessage,
} from "../chat-store";

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

// The inbound observer is how notifications learn a message arrived without the
// store depending on them. It must fire once per genuinely-new message from
// someone else, and never for my own messages or mesh-flood duplicates.
describe("subscribeInboundMessages", () => {
  it("fires once for a new message from someone else", () => {
    const seen: string[] = [];
    const unsub = subscribeInboundMessages((m) => seen.push(m.id));
    state().addMessage(makeMessage({ id: "in1", isMine: false }));
    unsub();
    expect(seen).toEqual(["in1"]);
  });

  it("does not fire for my own message", () => {
    const seen: string[] = [];
    const unsub = subscribeInboundMessages((m) => seen.push(m.id));
    state().addMessage(makeMessage({ id: "mine", isMine: true }));
    unsub();
    expect(seen).toEqual([]);
  });

  it("does not fire again for a duplicate id", () => {
    const seen: string[] = [];
    const unsub = subscribeInboundMessages((m) => seen.push(m.id));
    state().addMessage(makeMessage({ id: "dup", text: "first" }));
    state().addMessage(makeMessage({ id: "dup", text: "flooded copy" }));
    unsub();
    expect(seen).toEqual(["dup"]);
  });

  it("stops firing after unsubscribe", () => {
    const seen: string[] = [];
    const unsub = subscribeInboundMessages((m) => seen.push(m.id));
    unsub();
    state().addMessage(makeMessage({ id: "after", isMine: false }));
    expect(seen).toEqual([]);
  });
});

describe("setMessageStatus", () => {
  it("advances the delivery lifecycle and stamps times", () => {
    state().addMessage(makeMessage({ id: "m1", isMine: true, status: "sent" }));
    state().setMessageStatus("#test", "m1", "delivered", 1000);
    state().setMessageStatus("#test", "m1", "read", 2000);
    const m = state().messages["#test"][0];
    expect(m.status).toBe("read");
    expect(m.deliveredAtMs).toBe(1000);
    expect(m.readAtMs).toBe(2000);
  });

  it("never downgrades (a late delivered cannot undo read)", () => {
    state().addMessage(makeMessage({ id: "m1", isMine: true, status: "read" }));
    state().setMessageStatus("#test", "m1", "delivered", 9999);
    expect(state().messages["#test"][0].status).toBe("read");
  });

  it("is a no-op for an unknown message", () => {
    state().addMessage(makeMessage({ id: "m1", status: "sent" }));
    state().setMessageStatus("#test", "does-not-exist", "read");
    expect(state().messages["#test"][0].status).toBe("sent");
  });

  // An ecash send that never found a route sits at "sending"/"queued" until the
  // user takes the money back, which is the one thing the sender can still do
  // about it. That has to be reachable from the low ranks.
  it("reclaimed can be set on a send that never left the device", () => {
    state().addMessage(
      makeMessage({ id: "m1", isMine: true, status: "sending" }),
    );
    state().setMessageStatus("#test", "m1", "reclaimed");
    expect(state().messages["#test"][0].status).toBe("reclaimed");
  });

  // Terminal on purpose: the proofs are back in the sender's wallet, so a
  // receipt that wanders in afterwards must not relabel the bubble "delivered"
  // and imply the recipient was paid.
  it("reclaimed is terminal: a later receipt cannot override it", () => {
    state().addMessage(
      makeMessage({ id: "m1", isMine: true, status: "reclaimed" }),
    );
    state().setMessageStatus("#test", "m1", "delivered", 9999);
    state().setMessageStatus("#test", "m1", "read", 9999);
    state().setMessageStatus("#test", "m1", "sent");
    expect(state().messages["#test"][0].status).toBe("reclaimed");
  });
});

describe("joinPrivateChannel", () => {
  it("adds the channel and stores its key and reach", () => {
    state().joinPrivateChannel("#secret", "key-abc", false);
    expect(state().channels).toContain("#secret");
    expect(state().channelKeys["#secret"]).toBe("key-abc");
    expect(state().channelReach["#secret"]).toBe("ble");
  });

  it("records ble+nostr reach when opted in", () => {
    state().joinPrivateChannel("#secret", "k", true);
    expect(state().channelReach["#secret"]).toBe("ble+nostr");
  });

  it("does not duplicate the channel when the same room is joined twice", () => {
    state().joinPrivateChannel("#secret", "k1", false);
    state().joinPrivateChannel("#secret", "k1", false);
    expect(state().channels.filter((c) => c === "#secret")).toHaveLength(1);
    expect(state().channelKeys["#secret"]).toBe("k1");
  });

  it("drops the key and reach when the channel is removed", () => {
    state().joinPrivateChannel("#secret", "k", true);
    state().removeChannel("#secret");
    expect(state().channelKeys["#secret"]).toBeUndefined();
    expect(state().channelReach["#secret"]).toBeUndefined();
  });

  it("clears all keys and reach on clearAll", () => {
    state().joinPrivateChannel("#secret", "k", true);
    state().clearAll();
    expect(state().channelKeys).toEqual({});
    expect(state().channelReach).toEqual({});
  });

  it("keeps the key when clearing messages (still a member)", () => {
    state().joinPrivateChannel("#secret", "k", true);
    state().addMessage(makeMessage({ id: "m", channel: "#secret" }));
    state().clearChannelMessages("#secret");
    expect(state().channelKeys["#secret"]).toBe("k");
    expect(state().messages["#secret"] ?? []).toHaveLength(0);
  });

  it("migrates the key and reach when the channel is renamed", () => {
    state().joinPrivateChannel("#old", "k", true);
    expect(state().renameChannel("#old", "new")).toBe(true);
    expect(state().channelKeys["#new"]).toBe("k");
    expect(state().channelReach["#new"]).toBe("ble+nostr");
    expect(state().channelKeys["#old"]).toBeUndefined();
    expect(state().channelReach["#old"]).toBeUndefined();
  });
});

describe("removeMessage", () => {
  it("removes a single message (Undo Send)", () => {
    state().addMessage(makeMessage({ id: "a", timestampMs: 1000 }));
    state().addMessage(makeMessage({ id: "b", timestampMs: 2000 }));
    state().removeMessage("#test", "a");
    expect(state().messages["#test"].map((m) => m.id)).toEqual(["b"]);
  });

  it("is a no-op for an unknown id or channel", () => {
    state().addMessage(makeMessage({ id: "a" }));
    state().removeMessage("#test", "nope");
    state().removeMessage("#missing", "a");
    expect(state().messages["#test"]).toHaveLength(1);
  });
});

describe("toggleMuteChannel", () => {
  it("mutes and unmutes a conversation", () => {
    state().toggleMuteChannel("dm:aaa");
    expect(state().mutedChannels).toContain("dm:aaa");
    state().toggleMuteChannel("dm:aaa");
    expect(state().mutedChannels).not.toContain("dm:aaa");
  });

  it("drops the mute when the channel is removed", () => {
    state().addChannel("#temp");
    state().toggleMuteChannel("#temp");
    state().removeChannel("#temp");
    expect(state().mutedChannels).not.toContain("#temp");
  });

  it("restores the default mutes on clearAll", () => {
    // clearAll returns first-run state: user-added mutes are dropped and the
    // default location channels (#city, #province, #region) go back to muted.
    state().toggleMuteChannel("dm:aaa");
    state().clearAll();
    expect(state().mutedChannels).toEqual(["#city", "#province", "#region"]);
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

// A private channel is identified by its KEY, never its name: the name is a
// local label that never touches the wire, so two unrelated rooms can both be
// called "#team". Joining the second under the same label used to overwrite the
// first one's key, which silently orphaned a room the user was still in (its
// traffic no longer decrypted). These pin the rule that a clash gets its own
// room and that re-joining one you already hold is idempotent.
describe("joinPrivateChannel key clashes", () => {
  const KEY_A = "a".repeat(43);
  const KEY_B = "b".repeat(43);

  it("keeps the asked-for name when it is free", () => {
    expect(state().joinPrivateChannel("#team", KEY_A, false)).toBe("#team");
    expect(state().channelKeys["#team"]).toBe(KEY_A);
  });

  it("is idempotent for the same name and key", () => {
    state().joinPrivateChannel("#team", KEY_A, false);
    expect(state().joinPrivateChannel("#team", KEY_A, true)).toBe("#team");
    expect(state().channels.filter((c) => c === "#team")).toHaveLength(1);
    // Reach still follows the newer invite.
    expect(state().channelReach["#team"]).toBe("ble+nostr");
  });

  it("gives a different key its own room instead of stealing the label", () => {
    state().joinPrivateChannel("#team", KEY_A, false);
    const landed = state().joinPrivateChannel("#team", KEY_B, false);

    expect(landed).toBe("#team-2");
    // The room already joined is untouched: same label, same key.
    expect(state().channelKeys["#team"]).toBe(KEY_A);
    expect(state().channelKeys["#team-2"]).toBe(KEY_B);
    expect(state().channels).toContain("#team");
    expect(state().channels).toContain("#team-2");
  });

  it("returns the existing room when that key is already held elsewhere", () => {
    state().joinPrivateChannel("#team", KEY_A, false);
    state().joinPrivateChannel("#team", KEY_B, false); // lands in #team-2
    // The same invite again, under its original name: go back to #team-2
    // rather than minting #team-3 on every re-tap.
    expect(state().joinPrivateChannel("#team", KEY_B, false)).toBe("#team-2");
    expect(state().channels.filter((c) => c.startsWith("#team"))).toHaveLength(
      2,
    );
  });

  it("keeps a suffixed label short enough to survive an invite link", () => {
    // 30 chars is the parser's ceiling; a name at the limit must still fit
    // once "-2" is appended, or the room could never be shared onwards.
    const long = "#" + "x".repeat(30);
    state().joinPrivateChannel(long, KEY_A, false);
    const landed = state().joinPrivateChannel(long, KEY_B, false);
    expect(landed.length - 1).toBeLessThanOrEqual(30);
    expect(landed.endsWith("-2")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Persistence throttling.
//
// Writes are coalesced because zustand/persist serialises the WHOLE store on
// every set(), so one arriving message costs a full JSON encode of every
// thread. The throttle makes that once per window instead of once per message.
// What it introduces is a window in which a complete plaintext snapshot lives
// in a module variable, armed to be written - so the two escape hatches below
// are part of the feature, not extras.
describe("chat persistence window", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Switching timer implementations orphans any handle armed under the old
    // one, and an orphaned handle would make the throttle believe a write is
    // already scheduled and silently drop every later one. Dropping the window
    // first is the same primitive the panic wipe uses, and it is what makes
    // these tests independent of whatever ran before them.
    dropPendingChatPersistence();
    useChatStore.getState().clearAll();
    jest.runOnlyPendingTimers();
  });
  afterEach(() => {
    dropPendingChatPersistence();
    jest.useRealTimers();
  });

  function readFile(): string {
    const { createMMKV } = require("react-native-mmkv") as {
      createMMKV: (o: { id: string }) => {
        getString(k: string): string | undefined;
      };
    };
    return createMMKV({ id: "chat-store" }).getString("airhop-chat") ?? "";
  }

  function say(text: string): void {
    useChatStore.getState().addMessage({
      id: `m-${text}`,
      channel: "#bluetooth",
      senderID: "aabbccdd00112233",
      senderNickname: "alice",
      text,
      timestampMs: Date.now(),
      isMine: false,
    });
  }

  test("a burst of messages produces one write, not one per message", () => {
    for (let i = 0; i < 20; i++) say(`msg-${String(i)}`);
    // Nothing on disk yet: the window is still open.
    expect(readFile()).not.toContain("msg-19");
    jest.advanceTimersByTime(500);
    // And when it closes, the LAST state lands - not the first, and not each
    // of the twenty in turn.
    expect(readFile()).toContain("msg-19");
    expect(readFile()).toContain("msg-0");
  });

  test("flush forces the window shut, for backgrounding", () => {
    say("about to background");
    expect(readFile()).not.toContain("about to background");
    flushChatPersistence();
    expect(readFile()).toContain("about to background");
  });

  // The panic-wipe primitive. Without it a wipe can complete while a write
  // holding the wiped plaintext is still armed.
  test("drop throws the window away without writing it", () => {
    say("the meeting is at four");
    dropPendingChatPersistence();
    jest.advanceTimersByTime(5_000);
    expect(readFile()).not.toContain("the meeting is at four");
  });

  test("dropping once does not stop later writes from persisting", () => {
    say("discarded");
    dropPendingChatPersistence();
    say("kept");
    jest.advanceTimersByTime(500);
    expect(readFile()).toContain("kept");
  });
});
