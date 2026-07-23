/**
 * @jest-environment node
 */
// Activity feed store: the bell-screen history of inbound messages.

import { useActivityStore, type ActivityEntry } from "../activity-store";

beforeEach(() => {
  useActivityStore.getState().clearAll();
});

function state() {
  return useActivityStore.getState();
}

function entry(
  overrides: Partial<ActivityEntry> = {},
): Omit<ActivityEntry, "seen"> {
  return {
    id: "m1",
    channel: "dm:aaa",
    isDM: true,
    senderID: "aabbccdd00112233",
    senderNickname: "alice",
    preview: "hello",
    timestampMs: 1000,
    ...overrides,
  };
}

describe("record", () => {
  it("prepends newest first and marks unseen", () => {
    state().record(entry({ id: "a", timestampMs: 1 }));
    state().record(entry({ id: "b", timestampMs: 2 }));
    expect(state().entries.map((e) => e.id)).toEqual(["b", "a"]);
    expect(state().entries.every((e) => !e.seen)).toBe(true);
  });

  it("dedupes by message id", () => {
    state().record(entry({ id: "dup" }));
    state().record(entry({ id: "dup", preview: "flooded" }));
    expect(state().entries).toHaveLength(1);
  });

  it("caps the history so a busy channel cannot grow it forever", () => {
    for (let i = 0; i < 130; i++) {
      state().record(entry({ id: `m${String(i)}`, timestampMs: i }));
    }
    expect(state().entries.length).toBe(100);
    // Newest kept, oldest dropped.
    expect(state().entries[0].id).toBe("m129");
    expect(state().entries.some((e) => e.id === "m0")).toBe(false);
  });
});

describe("seen tracking", () => {
  it("counts unseen entries and clears them on markAllSeen", () => {
    state().record(entry({ id: "a" }));
    state().record(entry({ id: "b" }));
    expect(state().unseenCount()).toBe(2);
    state().markAllSeen();
    expect(state().unseenCount()).toBe(0);
    expect(state().entries.every((e) => e.seen)).toBe(true);
  });

  it("counts a freshly recorded entry as unseen even after a prior markAllSeen", () => {
    state().record(entry({ id: "a" }));
    state().markAllSeen();
    state().record(entry({ id: "b" }));
    expect(state().unseenCount()).toBe(1);
  });
});

describe("clearAll", () => {
  it("empties the feed", () => {
    state().record(entry({ id: "a" }));
    state().clearAll();
    expect(state().entries).toEqual([]);
  });
});
