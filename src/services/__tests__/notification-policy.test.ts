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
  NEARBY_COOLDOWN_MS,
  nearbyNotificationContent,
  notificationContentFor,
  shouldHapticPing,
  shouldNotifyNearby,
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

// The lock screen renders these without the phone being unlocked, so with
// previews hidden nothing identifying may appear in either field.
describe("notificationContentFor with previews hidden", () => {
  it("a DM names neither the sender nor the message", () => {
    const content = notificationContentFor(
      msg({ senderNickname: "alice", text: "meet at the north gate" }),
      undefined,
      true,
    );
    expect(content.title).not.toContain("alice");
    expect(content.body).not.toContain("alice");
    expect(content.body).not.toContain("north gate");
  });

  it("a DM still says something arrived", () => {
    const content = notificationContentFor(
      msg({ text: "yo" }),
      undefined,
      true,
    );
    expect(content.title.length).toBeGreaterThan(0);
    expect(content.body.length).toBeGreaterThan(0);
  });

  it("a channel keeps its name but drops the sender and the message", () => {
    const content = notificationContentFor(
      msg({ channel: "group:abc123", senderNickname: "alice", text: "hi all" }),
      "Weekend Crew",
      true,
    );
    // The room is worth keeping: without it no notification is worth tapping.
    expect(content.title).toBe("Weekend Crew");
    expect(content.body).not.toContain("alice");
    expect(content.body).not.toContain("hi all");
  });

  it("an attachment is not summarised either", () => {
    // A "📷 Photo" body still discloses that a photo arrived, and from whom
    // once combined with the title.
    const content = notificationContentFor(
      msg({ text: "", attachment: { type: "image", uri: "x" } }),
      undefined,
      true,
    );
    expect(content.body).not.toBe("📷 Photo");
  });

  it("hiding is off unless asked for, so the default call is unchanged", () => {
    expect(notificationContentFor(msg({ text: "yo" }))).toEqual({
      title: "alice",
      body: "yo",
    });
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

describe("shouldNotifyNearby", () => {
  const base = {
    appActive: false,
    peerCount: 1,
    previousPeerCount: 0,
    nowMs: 10_000_000,
    lastNotifiedAtMs: null,
    cooldownMs: NEARBY_COOLDOWN_MS,
  };

  it("notifies when an empty mesh comes alive in the background", () => {
    expect(shouldNotifyNearby(base)).toBe(true);
  });

  it("stays quiet in the foreground, where the Mesh tab already shows them", () => {
    expect(shouldNotifyNearby({ ...base, appActive: true })).toBe(false);
  });

  it("stays quiet when peers join a mesh that already had someone", () => {
    expect(
      shouldNotifyNearby({ ...base, peerCount: 3, previousPeerCount: 2 }),
    ).toBe(false);
  });

  it("stays quiet when the last peer leaves", () => {
    expect(
      shouldNotifyNearby({ ...base, peerCount: 0, previousPeerCount: 1 }),
    ).toBe(false);
  });

  it("holds the cooldown when a radio flaps", () => {
    // Peer drops out and comes back: a genuine 0 -> 1 edge, twice, minutes
    // apart. The second one must not buzz.
    expect(
      shouldNotifyNearby({
        ...base,
        lastNotifiedAtMs: base.nowMs - 5 * 60 * 1000,
      }),
    ).toBe(false);
  });

  it("notifies again once the cooldown has passed", () => {
    expect(
      shouldNotifyNearby({
        ...base,
        lastNotifiedAtMs: base.nowMs - NEARBY_COOLDOWN_MS - 1,
      }),
    ).toBe(true);
  });
});

describe("nearbyNotificationContent", () => {
  it("counts people and never names them", () => {
    expect(nearbyNotificationContent(1).title).toBe("Someone nearby");
    expect(nearbyNotificationContent(4).title).toBe("4 people nearby");
    expect(nearbyNotificationContent(1).body).toBe(
      "In Bluetooth range now. Tap to open the mesh.",
    );
  });
});
