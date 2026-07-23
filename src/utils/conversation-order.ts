// Conversation ordering shared by the DM list and the channel list.
//
// Chat apps order a conversation list two ways at once: pinned threads sit at
// the top, and within each group the most recently active thread comes first.
// Keeping this in one pure, tested function means both lists stay consistent and
// neither drifts its own subtly different rule.

import type { ChatMessage } from "../store/chat-store";

// Timestamp of the newest message in a conversation, or 0 when it has none.
// Messages are stored oldest-first (see chat-store addMessage), so the last
// element is the newest.
export function lastActivityMs(
  channel: string,
  messages: Record<string, ChatMessage[]>,
): number {
  const list = messages[channel];
  if (list === undefined || list.length === 0) return 0;
  return list[list.length - 1].timestampMs;
}

// Pinned first, then most-recent-activity first. Non-mutating; ties keep their
// incoming relative order (Array.sort is stable on our engines), so an empty
// thread stays put rather than jittering around.
export function sortConversationsByActivity(
  channels: string[],
  messages: Record<string, ChatMessage[]>,
  pinnedChannels: string[],
): string[] {
  const pinned = new Set(pinnedChannels);
  return [...channels].sort((a, b) => {
    const aPinned = pinned.has(a);
    const bPinned = pinned.has(b);
    if (aPinned !== bPinned) return aPinned ? -1 : 1;
    return lastActivityMs(b, messages) - lastActivityMs(a, messages);
  });
}
