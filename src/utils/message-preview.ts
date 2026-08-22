// Shared last-message preview text for channel and DM list rows, so an
// attachment-only message (no caption) never renders as a blank line.

import { t } from "@i18n";
import type { ChatAttachment, ChatMessage } from "@store/chat-store";
import { messageText } from "./message-text";

function attachmentPreviewText(attachment: ChatAttachment): string {
  switch (attachment.type) {
    case "voice":
      return t("transfer.kind.voice_preview");
    case "image":
      return t("transfer.kind.photo_preview");
    case "video":
      return t("transfer.kind.video_preview");
    case "document":
      return attachment.name ?? t("transfer.kind.document_preview");
  }
}

export function messagePreviewText(message: ChatMessage): string {
  const text = messageText(message);
  if (text) return text;
  if (message.attachment) return attachmentPreviewText(message.attachment);
  return "";
}
