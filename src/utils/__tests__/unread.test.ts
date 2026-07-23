/**
 * @jest-environment node
 */
// Aggregate unread counting, muted-aware.

import { sumUnread } from "../unread";

const counts = {
  "#bluetooth": 3,
  "#city": 5,
  "dm:aaa": 2,
  "dm:bbb": 4,
};

describe("sumUnread", () => {
  it("totals everything when nothing is muted", () => {
    expect(sumUnread(counts, [])).toBe(14);
  });

  it("excludes muted conversations from the total", () => {
    expect(sumUnread(counts, ["#city", "dm:bbb"])).toBe(5);
  });

  it("filters to channels only (no dm: prefix), still muted-aware", () => {
    expect(sumUnread(counts, ["#city"], (c) => !c.startsWith("dm:"))).toBe(3);
  });

  it("filters to DMs only, still muted-aware", () => {
    expect(sumUnread(counts, ["dm:aaa"], (c) => c.startsWith("dm:"))).toBe(4);
  });

  it("is zero when every counted conversation is muted", () => {
    expect(sumUnread({ "#a": 2 }, ["#a"])).toBe(0);
  });
});
