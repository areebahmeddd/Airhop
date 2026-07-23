// Aggregate unread counting, muted-aware.
//
// The per-row unread badge always shows a conversation's own count, muted or
// not. But every *aggregate* badge (the Chats tab icon, the Channels/Direct
// segments, a section header) should stay quiet for muted conversations: a
// muted chat is deliberately not demanding attention at the app level. Keeping
// this rule in one function means all those badges agree.

export function sumUnread(
  unreadCounts: Record<string, number>,
  mutedChannels: string[],
  filter?: (channel: string) => boolean,
): number {
  const muted = new Set(mutedChannels);
  let total = 0;
  for (const [channel, count] of Object.entries(unreadCounts)) {
    if (muted.has(channel)) continue;
    if (filter && !filter(channel)) continue;
    total += count;
  }
  return total;
}
