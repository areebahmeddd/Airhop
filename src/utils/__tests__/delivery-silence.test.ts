/**
 * @jest-environment node
 */
// When a conversation is worth telling the user has gone unconfirmed.
//
// The case that produced this: a peer who panic-wiped is, by design, unlinkable
// to whoever they came back as - so from the other side they are simply gone
// forever, and every message keeps publishing to relays that accept it happily.
// The bubble said "sent" and never moved. That is also what an uninstall, a lost
// phone and a permanent silence look like, so one honest rule covers them all.
//
// What must NOT happen is calling it failure. Gift wraps sit on relays and the
// inbox asks for them with no lower time bound, so a peer returning after three
// weeks really does receive everything.

import type { ChatMessage } from "../../store/chat-store";
import { DELIVERY_SILENCE_MS, unconfirmedSince } from "../delivery-silence";

const NOW = 1_700_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

function mine(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: `m-${String(overrides.timestampMs ?? NOW)}`,
    channel: "dm:aabbccdd00112233",
    senderID: "self",
    senderNickname: "me",
    text: "hello",
    timestampMs: NOW,
    isMine: true,
    ...overrides,
  };
}

function theirs(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return mine({ isMine: false, senderNickname: "them", ...overrides });
}

describe("unconfirmedSince", () => {
  it("says nothing about a conversation with no outgoing messages", () => {
    expect(
      unconfirmedSince([theirs({ timestampMs: NOW - 30 * DAY })], NOW),
    ).toBeNull();
  });

  it("says nothing while the silence is still inside the window", () => {
    expect(
      unconfirmedSince([mine({ timestampMs: NOW - 6 * DAY })], NOW),
    ).toBeNull();
  });

  it("reports the oldest unconfirmed send once the window passes", () => {
    const oldest = NOW - 20 * DAY;
    const result = unconfirmedSince(
      [mine({ timestampMs: oldest }), mine({ timestampMs: NOW - 2 * DAY })],
      NOW,
    );
    // The oldest, not the newest: the question is "since when has this been
    // going nowhere", not "when did you last try".
    expect(result).toBe(oldest);
  });

  // A delivery receipt is proof they received something, so the clock restarts.
  it("restarts from a delivery receipt", () => {
    const messages = [
      mine({ timestampMs: NOW - 20 * DAY, deliveredAtMs: NOW - 19 * DAY }),
      mine({ timestampMs: NOW - 2 * DAY }),
    ];
    expect(unconfirmedSince(messages, NOW)).toBeNull();
  });

  // So is a reply. Someone reading and not answering is a normal conversation;
  // what matters is whether anything reaches them.
  it("restarts from an inbound message", () => {
    const messages = [
      mine({ timestampMs: NOW - 30 * DAY }),
      theirs({ timestampMs: NOW - 3 * DAY }),
      mine({ timestampMs: NOW - 2 * DAY }),
    ];
    expect(unconfirmedSince(messages, NOW)).toBeNull();
  });

  it("reports again once the silence AFTER a reply passes the window", () => {
    const firstUnanswered = NOW - 9 * DAY;
    const messages = [
      theirs({ timestampMs: NOW - 10 * DAY }),
      mine({ timestampMs: firstUnanswered }),
      mine({ timestampMs: NOW - 8 * DAY }),
    ];
    expect(unconfirmedSince(messages, NOW)).toBe(firstUnanswered);
  });

  // Already surfaced in the bubble, so counting them would say it twice.
  it("ignores messages that already failed or were reclaimed", () => {
    const messages = [
      mine({ timestampMs: NOW - 30 * DAY, status: "failed" }),
      mine({ timestampMs: NOW - 29 * DAY, status: "reclaimed" }),
    ];
    expect(unconfirmedSince(messages, NOW)).toBeNull();
  });

  it("ignores system lines, which nobody was ever going to receive", () => {
    const messages = [
      mine({ timestampMs: NOW - 30 * DAY, isSystem: true }),
      theirs({ timestampMs: NOW - 30 * DAY, isSystem: true }),
    ];
    expect(unconfirmedSince(messages, NOW)).toBeNull();
  });

  it("treats a read status without timestamps as confirmation", () => {
    const messages = [mine({ timestampMs: NOW - 30 * DAY, status: "read" })];
    expect(unconfirmedSince(messages, NOW)).toBeNull();
  });

  it("fires exactly at the boundary, not before it", () => {
    const at = NOW - DELIVERY_SILENCE_MS;
    expect(unconfirmedSince([mine({ timestampMs: at })], NOW)).toBe(at);
    expect(unconfirmedSince([mine({ timestampMs: at + 1 })], NOW)).toBeNull();
  });
});
