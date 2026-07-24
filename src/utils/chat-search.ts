// Global chat search: ranks channel/DM name matches ("Chats") and message
// content matches ("Messages") for the search bar above the chat list.
//
// Deterministic scoring only: prefix match > word-boundary match > any
// substring match, recency as the tiebreaker within a score tier. No fuzzy
// matching, no external dependency: this is what the query actually needs
// to read as "top hits" instead of a raw chronological dump.

import {
  findTokensInText,
  formatTokenSummary,
  mayContainToken,
} from "../core/payments/cashu";
import type { AttachmentType, ChatMessage } from "../store/chat-store";
import { chatDisplayName } from "./chat-display-name";
import { messagePreviewText } from "./message-preview";

// Message results are capped so the results view never renders an unbounded
// list. The underlying scan is cheap (messages are capped per-channel at
// the store level already), so this cap is purely a display concern.
const MAX_MESSAGE_RESULTS = 40;
// Characters of context shown on each side of the match in a snippet.
const SNIPPET_RADIUS = 30;

export interface ChatHit {
  channel: string;
  displayName: string;
  score: number;
}

export interface MessageHit {
  channel: string;
  messageId: string;
  senderNickname: string;
  isMine: boolean;
  timestampMs: number;
  snippet: string;
  // Offsets into `snippet` (not the original message) bounding the match,
  // for highlighting.
  matchStart: number;
  matchEnd: number;
  score: number;
  // Local file URI of an image/video attachment, so the media filter can show
  // a thumbnail instead of a generic icon. Undefined for other kinds.
  thumbnailUri?: string;
}

// The media/content filters offered above search, matching the attachment
// kinds Airhop supports plus links and ecash tokens carried inside text.
export type MediaFilter =
  "photos" | "videos" | "audio" | "documents" | "links" | "ecash";

const URL_RE = /https?:\/\/[^\s]+/i;

export function messageMatchesFilter(
  message: ChatMessage,
  filter: MediaFilter,
): boolean {
  switch (filter) {
    case "photos":
      return message.attachment?.type === "image";
    case "videos":
      return message.attachment?.type === "video";
    case "audio":
      return message.attachment?.type === "voice";
    case "documents":
      return message.attachment?.type === "document";
    case "links":
      return URL_RE.test(message.text);
    case "ecash":
      return message.text.length > 0 && mayContainToken(message.text);
  }
}

// Messages matching a media filter, optionally narrowed by a text query.
// Filter-only results are newest first; when a query is present they rank by
// match quality then recency, the same as the plain message search.
export function filterMessages(
  filter: MediaFilter,
  query: string,
  messages: Record<string, ChatMessage[]>,
): MessageHit[] {
  const q = query.trim().toLowerCase();
  const hits: MessageHit[] = [];
  for (const [channel, list] of Object.entries(messages)) {
    for (const message of list) {
      if (message.isSystem) continue;
      if (!messageMatchesFilter(message, filter)) continue;

      const searchable = searchableMessageText(message);
      let snippet = searchable;
      let matchStart = 0;
      let matchEnd = 0;
      let score = 0;

      if (q) {
        const index = searchable.toLowerCase().indexOf(q);
        if (index === -1) continue; // must also match the typed text
        const built = buildSnippet(searchable, index, q.length);
        snippet = built.snippet;
        matchStart = built.matchStart;
        matchEnd = built.matchEnd;
        score = scoreMatch(searchable, index);
      }

      hits.push({
        channel,
        messageId: message.id,
        senderNickname: message.senderNickname,
        isMine: message.isMine,
        timestampMs: message.timestampMs,
        snippet,
        matchStart,
        matchEnd,
        score,
        thumbnailUri:
          filter === "photos" || filter === "videos"
            ? message.attachment?.uri
            : undefined,
      });
    }
  }
  hits.sort((a, b) =>
    q
      ? b.score - a.score || b.timestampMs - a.timestampMs
      : b.timestampMs - a.timestampMs,
  );
  return hits.slice(0, MAX_MESSAGE_RESULTS);
}

// Human word for an attachment kind, so "photo"/"video" match even when a media
// message has no caption or filename.
function attachmentKindWord(type: AttachmentType): string {
  switch (type) {
    case "image":
      return "Photo";
    case "video":
      return "Video";
    case "voice":
      return "Voice note";
    case "document":
      return "Document";
  }
}

// The text a message is matched (and snippeted) against. Beyond the caption,
// this folds in the attachment's filename and kind, so searching an exact name
// like "example.png" or "report.pdf" finds the message that carried it, in a
// DM or a channel, even when the file was sent with a caption.
//
// Cashu-token messages embed an opaque encoded blob in `text`, so those match
// the memo / amount summary instead, never the raw token.
export function searchableMessageText(message: ChatMessage): string {
  if (message.text && mayContainToken(message.text)) {
    const tokens = findTokensInText(message.text);
    if (tokens.length > 0) {
      return tokens.map((t) => formatTokenSummary(t.info)).join(" ");
    }
  }

  const parts: string[] = [];
  if (message.text) parts.push(message.text);
  if (message.attachment) {
    if (message.attachment.name) parts.push(message.attachment.name);
    parts.push(attachmentKindWord(message.attachment.type));
  }
  return parts.join(" ").trim() || messagePreviewText(message);
}

// matchIndex === 0: prefix match. Match starts right after whitespace: word
// boundary. Anything else: mid-word substring match.
function scoreMatch(text: string, matchIndex: number): number {
  if (matchIndex === 0) return 3;
  const precedingChar = text[matchIndex - 1];
  if (precedingChar !== undefined && /\s/.test(precedingChar)) return 2;
  return 1;
}

function buildSnippet(
  text: string,
  matchIndex: number,
  matchLength: number,
): { snippet: string; matchStart: number; matchEnd: number } {
  const start = Math.max(0, matchIndex - SNIPPET_RADIUS);
  const end = Math.min(text.length, matchIndex + matchLength + SNIPPET_RADIUS);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  const snippet = prefix + text.slice(start, end) + suffix;
  const matchStart = prefix.length + (matchIndex - start);
  return { snippet, matchStart, matchEnd: matchStart + matchLength };
}

export function searchChats(query: string, channels: string[]): ChatHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: ChatHit[] = [];
  for (const channel of channels) {
    const name = chatDisplayName(channel);
    const index = name.toLowerCase().indexOf(q);
    if (index === -1) continue;
    hits.push({ channel, displayName: name, score: scoreMatch(name, index) });
  }
  return hits.sort(
    (a, b) => b.score - a.score || a.displayName.localeCompare(b.displayName),
  );
}

export function searchMessages(
  query: string,
  messages: Record<string, ChatMessage[]>,
): MessageHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: MessageHit[] = [];
  for (const [channel, list] of Object.entries(messages)) {
    for (const message of list) {
      if (message.isSystem) continue;
      const text = searchableMessageText(message);
      if (!text) continue;
      const index = text.toLowerCase().indexOf(q);
      if (index === -1) continue;
      const { snippet, matchStart, matchEnd } = buildSnippet(
        text,
        index,
        q.length,
      );
      hits.push({
        channel,
        messageId: message.id,
        senderNickname: message.senderNickname,
        isMine: message.isMine,
        timestampMs: message.timestampMs,
        snippet,
        matchStart,
        matchEnd,
        score: scoreMatch(text, index),
      });
    }
  }
  hits.sort((a, b) => b.score - a.score || b.timestampMs - a.timestampMs);
  return hits.slice(0, MAX_MESSAGE_RESULTS);
}
