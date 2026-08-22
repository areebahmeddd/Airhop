// The words a message row shows, resolved at the moment it is displayed.
//
// Almost every message in the store is user content: somebody typed it, and it
// is stored and shown exactly as typed, in whatever language they used.
// Translating it would be absurd and lossy.
//
// A handful are not. Airhop writes rows of its own into the same store: the
// one-line summary under a location card, the notice saying who added you to a
// group, the receipt for a payment you sent. Those are the app talking, so
// those are the app's words, and they should be in the language the reader has
// chosen right now rather than the one that happened to be active when the row
// was saved.
//
// A store row outlives the moment it was written by design, which is what makes
// the difference matter. `t()` at write time bakes a language into MMKV; a user
// who switches to Hindi keeps a conversation history in English forever, and no
// amount of switching back and forth will fix it, because the English is not a
// rendering any more, it is the data.
//
// So the write sites store the key and its variables alongside the rendered
// text, and this function does the rendering instead. See `systemKey` in
// `@store/chat-store`.
//
// Rule for callers: anything putting a message on a screen, into a
// notification, or into a search haystack goes through here. Reading `.text`
// directly is correct only where the bytes themselves are the point, which is
// the wire: `sendDm`, `sendChannelMessage`, the retry and forward paths. Those
// carry what the author wrote, and a system row never reaches them.

import { t } from "@i18n";
import type { ActivityEntry } from "@store/activity-store";
import type { ChatMessage } from "@store/chat-store";

export function messageText(message: ChatMessage): string {
  // No key means user content, or a row written before the field existed.
  // Either way `text` is the answer.
  if (message.systemKey === undefined) return message.text;
  return t(message.systemKey, message.systemVars);
}

// The same rule for the bell. An entry sits in the notification center until a
// hundred newer ones push it out, so it has the same freezing problem and takes
// the same treatment.
export function activityPreview(entry: ActivityEntry): string {
  if (entry.previewKey === undefined) return entry.preview;
  return t(entry.previewKey, entry.previewVars);
}
