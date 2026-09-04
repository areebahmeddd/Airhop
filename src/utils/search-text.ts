// How a query is normalized, and how good a match is once found. Split out of
// chat-search so settings search ranks identically.

import { stripIsolates } from "@i18n";

// NFC first: the same word typed on two keyboards can arrive composed or
// decomposed, and those are different strings to indexOf. Isolates are the bidi
// marks the app wraps user content in; they are never typed.
export function searchKey(text: string): string {
  return stripIsolates(text.normalize("NFC")).toLowerCase();
}

// matchIndex === 0: prefix match. Match starts right after whitespace: word
// boundary. Anything else: mid-word substring match.
export function scoreMatch(text: string, matchIndex: number): number {
  if (matchIndex === 0) return 3;
  const precedingChar = text[matchIndex - 1];
  if (precedingChar !== undefined && /\s/.test(precedingChar)) return 2;
  return 1;
}
