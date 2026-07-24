// Notification policy: the pure decisions behind message notifications.
//
// Kept free of any native import so it is trivially unit-testable and so the
// rules live in one obvious place. notification-service.ts owns the side
// effects (presenting, dismissing, badging); this file only answers "should we,
// and with what text".

import type { ChatAttachment, ChatMessage } from "../store/chat-store";

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
      return "📷 Photo";
    case "voice":
      return "🎤 Voice message";
    case "video":
      return "🎥 Video";
    case "document":
      return attachment.name ? `📄 ${attachment.name}` : "📄 Document";
  }
}

// What a message reduces to in a notification body: its text, or a media
// summary when there is no text.
export function messagePreview(msg: ChatMessage): string {
  if (msg.attachment) return attachmentSummary(msg.attachment);
  return msg.text;
}

// Title/body for a message notification. DMs read as "<sender>: <preview>";
// channels lead with the room name and name the sender inside the body, so a
// busy channel is still attributable at a glance. `channelLabel` is the resolved
// display name for the channel (group name, "#<geohash>", "#city"); the caller
// passes it because resolving it needs store access, and this file stays pure.
// It falls back to the raw channel key so the title is never blank.
export function notificationContentFor(
  msg: ChatMessage,
  channelLabel?: string,
): {
  title: string;
  body: string;
} {
  const preview = messagePreview(msg);
  if (isDirectMessage(msg.channel)) {
    return { title: msg.senderNickname, body: preview };
  }
  return {
    title: channelLabel ?? msg.channel,
    body: `${msg.senderNickname}: ${preview}`,
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
