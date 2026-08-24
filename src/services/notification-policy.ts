// Notification policy: the pure decisions behind message notifications.
//
// Free of any platform API so it is trivially unit-testable and so the rules
// live in one obvious place. notification-service.ts owns the side effects
// (presenting, dismissing, badging); this file only answers "should we, and
// with what text".
//
// "With what text" is why the translation runtime is imported here. That is a
// pure catalog lookup, not a platform call: the strings are plain TypeScript
// compiled into the bundle, and the one native read behind it (the device's
// language list) is mocked in tests and falls back to English if it throws. The
// decisions above it stay independent of it either way.

import { t, tPlural } from "@i18n";
import type { ChatAttachment, ChatMessage } from "@store/chat-store";
import { messageText } from "@utils/message-text";

// A DM channel is keyed "dm:<peerID>" (see chat-store). Everything else is a
// public channel like "#city".
export function isDirectMessage(channel: string): boolean {
  return channel.startsWith("dm:");
}

// One-line preview of an attachment, mirroring how WhatsApp/Signal summarise a
// media message in the notification and chat list.
export function attachmentSummary(attachment: ChatAttachment): string {
  switch (attachment.type) {
    case "image":
      return t("notif.preview.photo");
    case "voice":
      return t("notif.preview.voice");
    case "video":
      return t("notif.preview.video");
    case "document":
      return attachment.name
        ? `📄 ${attachment.name}`
        : t("notif.preview.document");
  }
}

// What a message reduces to in a notification body: its text, or a media
// summary when there is no text.
export function messagePreview(msg: ChatMessage): string {
  if (msg.attachment) return attachmentSummary(msg.attachment);
  return messageText(msg);
}

// Title/body for a message notification. DMs read as "<sender>: <preview>";
// channels lead with the room name and name the sender inside the body, so a
// busy channel is still attributable at a glance. `channelLabel` is the resolved
// display name for the channel (group name, "#<geohash>", "#city"); the caller
// passes it because resolving it needs store access, and this file stays pure.
// It falls back to the raw channel key so the title is never blank.
//
// `hidePreviews` redacts both the sender and the body, saying only that
// something arrived. The system renders a notification on the lock screen
// without the phone being unlocked, so a full preview is readable by anyone who
// can see the screen. It is a caller-supplied argument rather than a store read
// so this file stays pure and each case is directly testable.
//
// Redaction never touches the routing data the caller attaches separately, so a
// hidden notification still opens the right thread when tapped.
export function notificationContentFor(
  msg: ChatMessage,
  channelLabel?: string,
  hidePreviews = false,
  mentionsMe = false,
): {
  title: string;
  body: string;
} {
  if (isDirectMessage(msg.channel)) {
    if (hidePreviews) {
      return { title: t("notif.hidden.title"), body: t("notif.hidden.dm") };
    }
    return { title: msg.senderNickname, body: messagePreview(msg) };
  }
  // A mention is the one message in a busy room actually addressed to you, and
  // it is already the only thing allowed past a mute. Reading identically to
  // every other line defeated that: the notification the user most needed to
  // pick out was the one hardest to. Names the sender rather than the room,
  // since who is asking is the useful half. Matches bitchat's
  // sendMentionNotification.
  if (mentionsMe) {
    if (hidePreviews) {
      return {
        title: t("notif.hidden.title"),
        body: t("notif.hidden.mention"),
      };
    }
    return {
      title: t("notif.mention.title", { sender: msg.senderNickname }),
      body: messagePreview(msg),
    };
  }
  // A redacted channel notification keeps the room name. The channel a person
  // is in is not the secret the body is, and without it every notification
  // would be identical and none would be worth tapping.
  const title = channelLabel ?? msg.channel;
  if (hidePreviews) {
    return { title, body: t("notif.hidden.channel") };
  }
  return {
    title,
    // The sender's nickname is user content and stays exactly as they set it;
    // only the punctuation joining it to the preview is translated.
    body: t("notif.channel_message", {
      sender: msg.senderNickname,
      preview: messagePreview(msg),
    }),
  };
}

// A system-tray notification is raised only for an inbound message that arrives
// while the app is not in the foreground. In the foreground the live unread
// badges already tell the story, so a banner would just be noise. Local system
// notices (isSystem) are never externalised.
export function shouldSystemNotify(p: {
  isMine: boolean;
  isSystem?: boolean;
  appActive: boolean;
}): boolean {
  return !p.isMine && !p.isSystem && !p.appActive;
}

// A soft haptic replaces the banner while the app is open and the user is on a
// different conversation: enough of a nudge to notice, without stacking system
// notifications on top of an app you are already looking at.
export function shouldHapticPing(p: {
  isMine: boolean;
  isSystem?: boolean;
  appActive: boolean;
  channel: string;
  activeChannel: string;
}): boolean {
  return (
    !p.isMine && !p.isSystem && p.appActive && p.channel !== p.activeChannel
  );
}

// Nearby peers

// The floor between two nearby notices. The mesh finding someone is worth
// knowing about; it is not worth knowing about every time a radio flaps or a
// peer walks in and out of a doorway, and a phone in a pocket in a room full of
// Airhop users would otherwise buzz all afternoon. An hour makes this an
// occasional "the mesh is alive around you", which is all it is meant to be.
export const NEARBY_COOLDOWN_MS = 60 * 60 * 1000;

// Whether the mesh coming alive nearby is worth a notification right now.
//
// Three rules, and all of them exist to keep this rare:
//
//   * Foreground is never notified. The Mesh tab is showing the same peers
//     live, so a banner would be telling the user what is already on screen.
//   * Only the rising edge from an empty mesh. Peers joining a mesh that
//     already had someone in it change nothing worth interrupting for: you have
//     been told the mesh is alive.
//   * A cooldown on top, because the edge itself can repeat.
export function shouldNotifyNearby(p: {
  appActive: boolean;
  peerCount: number;
  previousPeerCount: number;
  nowMs: number;
  lastNotifiedAtMs: number | null;
  cooldownMs: number;
}): boolean {
  if (p.appActive) return false;
  if (p.peerCount === 0 || p.previousPeerCount > 0) return false;
  if (
    p.lastNotifiedAtMs !== null &&
    p.nowMs - p.lastNotifiedAtMs < p.cooldownMs
  ) {
    return false;
  }
  return true;
}

// Deliberately says nothing about who. A lock screen is the most public surface
// the app has, peers are pseudonymous anyway, and the useful fact is only that
// there is a mesh around you.
export function nearbyNotificationContent(peerCount: number): {
  title: string;
  body: string;
} {
  return {
    title: tPlural("notif.nearby.title", peerCount),
    body: t("notif.nearby.body"),
  };
}
