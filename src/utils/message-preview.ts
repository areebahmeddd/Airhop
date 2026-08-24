// Shared last-message preview text for channel and DM list rows, so an
// attachment-only message (no caption) never renders as a blank line.
//
// Two shapes of one answer. A list row re-renders on a language change and takes
// the text; the bell persists what it logs and takes the key as well, the same
// contract as `systemKey` on ChatMessage.

import {
  stripIsolates,
  t,
  type TranslationKey,
  type TranslationVars,
} from "@i18n";
import type { ChatAttachment, ChatMessage } from "@store/chat-store";

export interface MessagePreview {
  preview: string;
  // Absent when the preview is a person's own words (a caption, a filename),
  // which are never re-translated.
  previewKey?: TranslationKey;
  previewVars?: TranslationVars;
}

// The catalog key standing in for an attachment with no caption, or undefined
// when the attachment supplies its own words. A document is previewed by its
// filename where it has one, and that is the sender's text, not Airhop's.
function attachmentPreviewKey(
  attachment: ChatAttachment,
): TranslationKey | undefined {
  switch (attachment.type) {
    case "voice":
      return "transfer.kind.voice_preview";
    case "image":
      return "transfer.kind.photo_preview";
    case "video":
      return "transfer.kind.video_preview";
    case "document":
      return attachment.name === undefined
        ? "transfer.kind.document_preview"
        : undefined;
  }
}

// Whether the preview is Airhop's words, named by a key, or a person's, taken
// verbatim. Both exports are views of this.
function resolve(message: ChatMessage): {
  key?: TranslationKey;
  vars?: TranslationVars;
  literal: string;
} {
  // A row Airhop wrote already carries its key.
  if (message.systemKey !== undefined) {
    return { key: message.systemKey, vars: message.systemVars, literal: "" };
  }
  if (message.text) return { literal: message.text };
  if (message.attachment) {
    const key = attachmentPreviewKey(message.attachment);
    return key === undefined
      ? { literal: message.attachment.name ?? "" }
      : { key, literal: "" };
  }
  return { literal: "" };
}

// For a row on screen, isolates included: they keep a right-to-left name from
// reordering the line it sits in.
export function messagePreviewText(message: ChatMessage): string {
  const { key, vars, literal } = resolve(message);
  return key === undefined ? literal : t(key, vars);
}

// For the bell, which persists what it is given. Same contract as `systemRow`,
// down to the plain fallback: display machinery does not belong in storage.
export function messagePreviewEntry(message: ChatMessage): MessagePreview {
  const { key, vars } = resolve(message);
  return {
    preview: stripIsolates(messagePreviewText(message)),
    previewKey: key,
    previewVars: vars,
  };
}
