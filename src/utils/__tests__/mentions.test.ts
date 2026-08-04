/**
 * @jest-environment node
 */
// @-mention parsing: the composer picker and the "was I mentioned" check both
// hinge on these, so token boundaries and edge cases are pinned here.

import {
  activeMentionQuery,
  applyMention,
  mentionsNickname,
} from "../mentions";

describe("activeMentionQuery", () => {
  it("returns the partial while typing a mention at the end", () => {
    expect(activeMentionQuery("@an")).toBe("an");
    expect(activeMentionQuery("hey @an")).toBe("an");
    expect(activeMentionQuery("@")).toBe("");
  });

  it("returns null when the caret is not in a mention", () => {
    expect(activeMentionQuery("hello")).toBeNull();
    expect(activeMentionQuery("@ana done")).toBeNull(); // space closed it
    expect(activeMentionQuery("email@host")).toBeNull(); // not a word-start @
  });
});

describe("applyMention", () => {
  it("completes the mention with a trailing space", () => {
    expect(applyMention("@an", "anabelle")).toBe("@anabelle ");
    expect(applyMention("hey @an", "anabelle")).toBe("hey @anabelle ");
    expect(applyMention("@", "anabelle")).toBe("@anabelle ");
  });

  it("handles nicknames with regex-special characters safely", () => {
    expect(applyMention("@sw", "swift.otter")).toBe("@swift.otter ");
  });
});

describe("mentionsNickname", () => {
  it("detects a whole-token mention, case-insensitively", () => {
    expect(mentionsNickname("hey @ana how are you", "ana")).toBe(true);
    expect(mentionsNickname("@Ana!", "ana")).toBe(true);
    expect(mentionsNickname("ping @ana", "ana")).toBe(true);
  });

  it("does not match a prefix of a longer name", () => {
    expect(mentionsNickname("hey @anabelle", "ana")).toBe(false);
  });

  it("ignores a non-word-start @ and an empty nickname", () => {
    expect(mentionsNickname("mail me at ana@host", "ana")).toBe(false);
    expect(mentionsNickname("@ana", "")).toBe(false);
  });
});

// The cross-platform case. One keyboard produces the composed form, another the
// decomposed form, and the two render identically. Before normalization the
// mention simply never fired: the mentioned peer was never notified and neither
// side had any way to see why.
describe("mentionsNickname across Unicode encodings", () => {
  const COMPOSED = "José";
  const DECOMPOSED = "José";

  it("the two encodings differ, so this is a real case", () => {
    expect(COMPOSED).not.toBe(DECOMPOSED);
  });

  it("a decomposed nickname matches a composed mention", () => {
    expect(mentionsNickname(`hey @${COMPOSED} here`, DECOMPOSED)).toBe(true);
  });

  it("a composed nickname matches a decomposed mention", () => {
    expect(mentionsNickname(`hey @${DECOMPOSED} here`, COMPOSED)).toBe(true);
  });

  it("still refuses a prefix of a longer accented name", () => {
    expect(mentionsNickname(`hey @${COMPOSED}fina`, DECOMPOSED)).toBe(false);
  });
});
