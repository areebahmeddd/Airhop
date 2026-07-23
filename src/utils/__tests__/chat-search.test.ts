/**
 * @jest-environment node
 */
// Global chat search, focused on attachment filenames: sending a file should
// make it findable by its exact name in a DM or a channel.

import type { ChatMessage } from "../../store/chat-store";
import { searchableMessageText, searchMessages } from "../chat-search";

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
