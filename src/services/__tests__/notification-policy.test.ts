/**
 * @jest-environment node
 */
// Notification policy: the pure rules for whether and how to notify.
//
// These decide when a message pulls the user out of whatever they are doing, so
// the truth table matters: notify in the background, stay quiet on the chat you
// are reading, never notify for your own messages or local system notices.

import type { ChatMessage } from "../../store/chat-store";
import {
  attachmentSummary,
  isDirectMessage,
  messagePreview,
  notificationContentFor,
  shouldHapticPing,
  shouldSystemNotify,
} from "../notification-policy";

function msg(overrides: Partial<ChatMessage>): ChatMessage {
  return {
    id: "m1",
    channel: "dm:abc",
    senderID: "abc",
    senderNickname: "alice",
    text: "hello",
    timestampMs: 1000,
    isMine: false,
    ...overrides,
  };
}

describe("isDirectMessage", () => {
  it("recognises the dm: prefix", () => {
    expect(isDirectMessage("dm:abc")).toBe(true);
    expect(isDirectMessage("#city")).toBe(false);
  });
});

describe("shouldSystemNotify", () => {
  it("notifies for an inbound message while backgrounded", () => {
    expect(shouldSystemNotify({ isMine: false, appActive: false })).toBe(true);
  });

  it("stays quiet while the app is foregrounded", () => {
    expect(shouldSystemNotify({ isMine: false, appActive: true })).toBe(false);
  });

  it("never notifies for my own message", () => {
    expect(shouldSystemNotify({ isMine: true, appActive: false })).toBe(false);
  });

  it("never notifies for a local system notice", () => {
    expect(
      shouldSystemNotify({ isMine: false, isSystem: true, appActive: false }),
    ).toBe(false);
  });
});

describe("shouldHapticPing", () => {
  const base = {
    isMine: false,
    appActive: true,
    channel: "#city",
    activeChannel: "#other",
  };

  it("pings when foregrounded on a different conversation", () => {
    expect(shouldHapticPing(base)).toBe(true);
  });

  it("stays silent on the conversation you are reading", () => {
    expect(shouldHapticPing({ ...base, activeChannel: "#city" })).toBe(false);
  });

  it("does not ping while backgrounded (a banner handles that)", () => {
    expect(shouldHapticPing({ ...base, appActive: false })).toBe(false);
  });

  it("never pings for my own message", () => {
    expect(shouldHapticPing({ ...base, isMine: true })).toBe(false);
  });
});

describe("notificationContentFor", () => {
  it("shows sender as the title for a DM", () => {
    expect(notificationContentFor(msg({ text: "yo" }))).toEqual({
      title: "alice",
      body: "yo",
    });
  });

  it("leads with the channel and names the sender in the body", () => {
    expect(
      notificationContentFor(msg({ channel: "#city", text: "hi all" })),
    ).toEqual({ title: "#city", body: "alice: hi all" });
  });

  it("uses the resolved channel label for the title when provided", () => {
    expect(
      notificationContentFor(
        msg({ channel: "group:abc123", text: "meet up" }),
        "Weekend Crew",
      ),
    ).toEqual({ title: "Weekend Crew", body: "alice: meet up" });
  });

  it("falls back to the raw channel key when no label is given", () => {
    expect(
      notificationContentFor(msg({ channel: "group:abc123", text: "hi" }))
        .title,
    ).toBe("group:abc123");
  });

  it("summarises an attachment when there is no text", () => {
    const content = notificationContentFor(
      msg({ text: "", attachment: { type: "image", uri: "x" } }),
    );
    expect(content.body).toBe("📷 Photo");
  });
});

describe("attachment previews", () => {
  it("labels each media type the way a chat app does", () => {
    expect(attachmentSummary({ type: "image", uri: "x" })).toBe("📷 Photo");
    expect(attachmentSummary({ type: "voice", uri: "x" })).toBe(
      "🎤 Voice message",
    );
    expect(attachmentSummary({ type: "video", uri: "x" })).toBe("🎥 Video");
    expect(
      attachmentSummary({ type: "document", uri: "x", name: "spec.pdf" }),
    ).toBe("📄 spec.pdf");
  });

  it("prefers an attachment summary over empty text", () => {
    expect(
      messagePreview(
        msg({ text: "", attachment: { type: "voice", uri: "x" } }),
      ),
    ).toBe("🎤 Voice message");
  });
});
