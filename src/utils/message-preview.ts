// Shared last-message preview text for channel and DM list rows, so an
// attachment-only message (no caption) never renders as a blank line.

import type { ChatAttachment, ChatMessage } from "../store/chat-store";

function attachmentPreviewText(attachment: ChatAttachment): string {
  switch (attachment.type) {
    case "voice":
      return "Voice note";
    case "image":
      return "Photo";
    case "video":
      return "Video";
    case "document":
      return attachment.name ?? "Document";
  }
}

export function messagePreviewText(message: ChatMessage): string {
  if (message.text) return message.text;
  if (message.attachment) return attachmentPreviewText(message.attachment);
  return "";
}
