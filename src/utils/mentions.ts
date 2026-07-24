// @-mentions: detecting them in message text, and driving the composer's inline
// suggestion picker.
//
// Mentions are by nickname (the display name), the only stable human-readable
// identifier the mesh exposes. Matching is case-insensitive and token-bounded,
// so "@ana" does not match a message addressed to "@anabelle".

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// The mention the user is in the middle of typing: an "@" that starts a word,
// with the caret at the end of the draft. Returns the partial nickname (without
// the "@"), or null when the caret is not in a mention. Only the end of the
// draft is considered, which is where an inline picker is useful.
export function activeMentionQuery(draft: string): string | null {
  const m = /(?:^|\s)@([^\s@]*)$/.exec(draft);
  return m ? m[1] : null;
}

// Replace the mention being typed with "@<nickname> ", ready to keep typing.
export function applyMention(draft: string, nickname: string): string {
  return draft.replace(
    /(^|\s)@[^\s@]*$/,
    (_full, lead: string) => `${lead}@${nickname} `,
  );
}

// Whether `text` mentions `nickname` as a whole @token (case-insensitive). The
// token must end at whitespace, punctuation, or end of string, so a mention of
// a longer name does not count as a mention of a prefix of it.
export function mentionsNickname(text: string, nickname: string): boolean {
  if (nickname.trim().length === 0) return false;
  const re = new RegExp(
    `(?:^|\\s)@${escapeRegExp(nickname)}(?=$|[\\s.,!?;:])`,
    "i",
  );
  return re.test(text);
}
