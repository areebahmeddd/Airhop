/**
 * @jest-environment node
 */
// Conversation ordering: pinned first, then most recent activity.

import type { ChatMessage } from "../../store/chat-store";
import {
  lastActivityMs,
  sortConversationsByActivity,
} from "../conversation-order";

function msg(channel: string, ts: number): ChatMessage {
  return {
    id: `${channel}-${String(ts)}`,
    channel,
    senderID: "aabbccdd00112233",
    senderNickname: "alice",
    text: "hi",
    timestampMs: ts,
    isMine: false,
  };
}

const messages: Record<string, ChatMessage[]> = {
  "dm:aaa": [msg("dm:aaa", 100)],
  "dm:bbb": [msg("dm:bbb", 300)],
  "dm:ccc": [msg("dm:ccc", 200)],
  "dm:empty": [],
};

describe("lastActivityMs", () => {
  it("returns the newest message timestamp", () => {
    expect(lastActivityMs("dm:bbb", messages)).toBe(300);
  });

  it("returns 0 for a conversation with no messages", () => {
    expect(lastActivityMs("dm:empty", messages)).toBe(0);
    expect(lastActivityMs("dm:missing", messages)).toBe(0);
  });
});

describe("sortConversationsByActivity", () => {
  it("orders by most recent activity, empty threads last", () => {
    const order = sortConversationsByActivity(
      ["dm:aaa", "dm:bbb", "dm:ccc", "dm:empty"],
      messages,
      [],
    );
    expect(order).toEqual(["dm:bbb", "dm:ccc", "dm:aaa", "dm:empty"]);
  });

  it("floats pinned threads to the top regardless of activity", () => {
    const order = sortConversationsByActivity(
      ["dm:aaa", "dm:bbb", "dm:ccc"],
      messages,
      ["dm:aaa"],
    );
    // dm:aaa is the least recent but pinned, so it leads; the rest follow by
    // recency.
    expect(order).toEqual(["dm:aaa", "dm:bbb", "dm:ccc"]);
  });

  it("keeps a pinned empty thread above active unpinned ones", () => {
    const order = sortConversationsByActivity(
      ["dm:bbb", "dm:empty"],
      messages,
      ["dm:empty"],
    );
    expect(order).toEqual(["dm:empty", "dm:bbb"]);
  });

  it("does not mutate the input array", () => {
    const input = ["dm:aaa", "dm:bbb"];
    sortConversationsByActivity(input, messages, []);
    expect(input).toEqual(["dm:aaa", "dm:bbb"]);
  });
});
