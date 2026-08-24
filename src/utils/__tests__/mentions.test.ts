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

// Every script's full stop, not ASCII's. A mention closed by one of the marks
// below has to count, or it does not pass a mute and raises no mention
// notification, in a third of the languages Airhop ships.
describe("mentionsNickname across scripts", () => {
  const TERMINATORS: [string, string][] = [
    ["Japanese full stop", "。"],
    ["Japanese comma", "、"],
    ["fullwidth question mark", "？"],
    ["fullwidth exclamation", "！"],
    ["Arabic comma", "،"],
    ["Arabic question mark", "؟"],
    ["Devanagari danda", "।"],
    ["Burmese section mark", "။"],
    ["Ethiopic full stop", "።"],
    ["ASCII full stop", "."],
  ];

  it.each(TERMINATORS)("closes a mention on a %s", (_name, mark) => {
    expect(mentionsNickname(`@areeb${mark} hello`, "areeb")).toBe(true);
  });

  it("matches a nickname written in a non-Latin script", () => {
    // A nickname is arbitrary UTF-8 off the wire, so the pattern has to hold
    // for one sharing no characters with the boundary class.
    expect(mentionsNickname("こんばんは @あさひ です", "あさひ")).toBe(true);
    expect(mentionsNickname("مرحبا @أحمد،", "أحمد")).toBe(true);
  });

  it("still refuses a prefix, since a letter is not a boundary", () => {
    expect(mentionsNickname("@あさひこ hello", "あさひ")).toBe(false);
    expect(mentionsNickname("hey @anabelle", "ana")).toBe(false);
  });

  it("keeps refusing an email, which is why the OPENING boundary stayed strict", () => {
    // Relaxing the leading side would read the host out of "ali@example.com" as
    // a mention of "example". The cost is that Chinese and Japanese, which write
    // no spaces, need the mention at a word start.
    expect(mentionsNickname("mail me at ali@example.com", "example")).toBe(
      false,
    );
  });
});
