/**
 * @jest-environment node
 */
// Global chat search, focused on attachment filenames: sending a file should
// make it findable by its exact name in a DM or a channel.

import type { ChatMessage } from "@store/chat-store";
import {
  messageMatchesFilter,
  searchableMessageText,
  searchMessages,
  searchNotices,
  type SearchableNotice,
} from "../chat-search";

function msg(overrides: Partial<ChatMessage>): ChatMessage {
  return {
    id: "m1",
    channel: "#city",
    senderID: "aabbccdd00112233",
    senderNickname: "alice",
    text: "",
    timestampMs: 1000,
    isMine: false,
    ...overrides,
  };
}

describe("searchableMessageText", () => {
  it("includes an image filename so it is searchable", () => {
    const text = searchableMessageText(
      msg({ attachment: { type: "image", uri: "x", name: "example.png" } }),
    );
    expect(text.toLowerCase()).toContain("example.png");
  });

  it("includes a document filename", () => {
    const text = searchableMessageText(
      msg({ attachment: { type: "document", uri: "x", name: "report.pdf" } }),
    );
    expect(text.toLowerCase()).toContain("report.pdf");
  });

  it("keeps both the caption and the filename", () => {
    const text = searchableMessageText(
      msg({
        text: "beach trip",
        attachment: { type: "image", uri: "x", name: "IMG_1234.png" },
      }),
    ).toLowerCase();
    expect(text).toContain("beach trip");
    expect(text).toContain("img_1234.png");
  });

  it("falls back to a kind word when there is no name", () => {
    expect(
      searchableMessageText(msg({ attachment: { type: "video", uri: "x" } })),
    ).toContain("Video");
  });
});

describe("searchMessages finds attachments by name", () => {
  const messages: Record<string, ChatMessage[]> = {
    "#city": [
      msg({
        id: "a",
        channel: "#city",
        attachment: { type: "image", uri: "x", name: "example.png" },
      }),
    ],
    "dm:aaa": [
      msg({
        id: "b",
        channel: "dm:aaa",
        text: "here you go",
        attachment: { type: "document", uri: "y", name: "invoice-2026.pdf" },
      }),
    ],
  };

  it("matches an exact image name in a channel", () => {
    const hits = searchMessages("example.png", messages);
    expect(hits.map((h) => h.messageId)).toContain("a");
  });

  it("matches a document name in a DM", () => {
    const hits = searchMessages("invoice-2026.pdf", messages);
    expect(hits.map((h) => h.messageId)).toContain("b");
  });

  it("does not match an unrelated query", () => {
    expect(searchMessages("nonsense.zip", messages)).toHaveLength(0);
  });
});

describe("searchNotices", () => {
  const notices: SearchableNotice[] = [
    {
      id: "n1",
      channel: "#bluetooth",
      content: "Lost dog near the park, please help",
      author: "sam",
      timestampMs: 2000,
      isUrgent: true,
    },
    {
      id: "n2",
      channel: "geohash:9q8yy",
      content: "Farmers market this Saturday",
      author: "dana",
      timestampMs: 1000,
      isUrgent: false,
    },
  ];

  it("matches notice content and points at its room", () => {
    const hits = searchNotices("dog", notices);
    expect(hits).toHaveLength(1);
    expect(hits[0].id).toBe("n1");
    expect(hits[0].channel).toBe("#bluetooth");
    expect(hits[0].isUrgent).toBe(true);
  });

  it("falls back to matching the author's name", () => {
    const hits = searchNotices("dana", notices);
    expect(hits.map((h) => h.id)).toEqual(["n2"]);
  });

  it("returns nothing for an unrelated query", () => {
    expect(searchNotices("spaceship", notices)).toHaveLength(0);
  });
});

// The media/content filters above search. Each answers one question about a
// message, and the answer must not depend on anything else about it.
describe("messageMatchesFilter", () => {
  const kinds = [
    ["photos", "image"],
    ["videos", "video"],
    ["audio", "voice"],
    ["documents", "document"],
  ] as const;

  for (const [filter, type] of kinds) {
    it(`${filter} matches only its own attachment kind`, () => {
      expect(
        messageMatchesFilter(
          msg({ attachment: { type, uri: "file:///a" } }),
          filter,
        ),
      ).toBe(true);
      for (const [, other] of kinds) {
        if (other === type) continue;
        expect(
          messageMatchesFilter(
            msg({ attachment: { type: other, uri: "file:///a" } }),
            filter,
          ),
        ).toBe(false);
      }
    });
  }

  // A caption lives on the message text, so a photo with a link in its caption
  // is genuinely both.
  it("finds a link in a photo's caption", () => {
    const photo = msg({
      text: "see https://example.com/gallery",
      attachment: { type: "image", uri: "file:///a" },
    });
    expect(messageMatchesFilter(photo, "photos")).toBe(true);
    expect(messageMatchesFilter(photo, "links")).toBe(true);
  });

  describe("links", () => {
    for (const text of [
      "https://example.com",
      "http://example.com/x?y=1",
      "www.example.com",
      "read example.com/posts/1 later",
    ]) {
      it(`matches ${text}`, () => {
        expect(messageMatchesFilter(msg({ text }), "links")).toBe(true);
      });
    }

    // A bare host is indistinguishable from a filename, and matching it would
    // fill the filter with attachments.
    for (const text of ["photo.jpg", "voice_a1.m4a", "just some words"]) {
      it(`does not match ${text}`, () => {
        expect(messageMatchesFilter(msg({ text }), "links")).toBe(false);
      });
    }
  });

  it("matches a message carrying an ecash token", () => {
    expect(
      messageMatchesFilter(
        msg({ text: "here you go cashuAeyJ0b2tlbiI" }),
        "ecash",
      ),
    ).toBe(true);
    expect(messageMatchesFilter(msg({ text: "no money here" }), "ecash")).toBe(
      false,
    );
  });
});

// A snippet is shown to the reader, so it is cut from the text as written.
// Matching folds case and normalizes encoding; showing must not. Cutting from
// the folded string renders every result lowercase, which a test that only
// checks the hit was found cannot see.
describe("snippets read as written", () => {
  it("keeps the capitals of the message it came from", () => {
    const hits = searchMessages("north", {
      "#city": [msg({ id: "a", text: "Meet at the North Gate at 8" })],
    });
    expect(hits).toHaveLength(1);
    expect(hits[0].snippet).toContain("North Gate");
    expect(hits[0].snippet).not.toContain("north gate");
  });

  it("highlights the characters it says it does", () => {
    const text = "Meet at the North Gate at 8";
    const hits = searchMessages("north", { "#city": [msg({ id: "a", text })] });
    const { snippet, matchStart, matchEnd } = hits[0];
    // The offsets are into the snippet and must land on the match.
    expect(snippet.slice(matchStart, matchEnd).toLowerCase()).toBe("north");
  });

  it("finds a decomposed message from a composed query", () => {
    // Vietnamese and Korean have two encodings for nearly every syllable, and
    // which arrives depends on the sender's keyboard.
    const composed = "café at noon";
    const decomposed = "café at noon";
    const hits = searchMessages(composed.slice(0, 4), {
      "#city": [msg({ id: "a", text: decomposed })],
    });
    expect(hits).toHaveLength(1);
  });

  it("still highlights correctly when folding changes the length", () => {
    // Turkish "İ" folds to two code points, so the folded string is longer and
    // an offset into one is wrong in the other. The snippet is cut from
    // whichever form the match ran in.
    //
    // Not claimed: that "istanbul" finds "İSTANBUL". Unicode default case
    // folding says otherwise, and `toLocaleLowerCase` would make two devices
    // disagree about whether a message matched.
    const hits = searchMessages("stanbul", {
      "#city": [msg({ id: "a", text: "İSTANBUL plan" })],
    });
    expect(hits).toHaveLength(1);
    const { snippet, matchStart, matchEnd } = hits[0];
    expect(snippet.slice(matchStart, matchEnd)).toBe("stanbul");
  });
});
