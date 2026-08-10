// How long a conversation has been going unanswered by the transport.
//
// A DM that was published but never delivered looks exactly like one sent a
// minute ago: a single tick, and nothing else. Over weeks that is far too quiet
// to notice, and it is the shape of every permanent disappearance - a peer who
// uninstalled, lost their phone, or panic-wiped and came back as a new identity
// (which is unlinkable by design, so no app can ever say which).
//
// Two rules keep this honest.
//
// It is INFORMATIONAL, never a status. Marking these failed would be wrong:
// gift wraps sit on relays and the inbox asks for them with no lower time bound,
// so a peer who returns after three weeks genuinely does receive everything. The
// message is not lost; it is unconfirmed, and those are different claims.
//
// It keys on DELIVERY, never on replies. Someone reading and choosing not to
// answer is a normal conversation, and nagging about it would be the app
// commenting on a relationship. What is worth saying is that nothing has
// reached them.

import type { ChatMessage } from "../store/chat-store";

// How long without any confirmation before it is worth saying.
//
// Matched to the outbox's own TTL, which is the app's existing judgement about
// when a message stops being worth chasing ("a week-old 'hi' is noise, not a
// message"). Shorter would fire on an ordinary holiday; much longer and the
// answer arrives too late to act on. A week of sending into silence is a fact
// about the transport rather than about the other person, which is why it can
// be said plainly without guessing why.
export const DELIVERY_SILENCE_MS = 7 * 24 * 60 * 60 * 1000;

// Whether this message is itself proof the other side received something.
function isConfirmed(msg: ChatMessage): boolean {
  return (
    msg.deliveredAtMs !== undefined ||
    msg.readAtMs !== undefined ||
    msg.status === "delivered" ||
    msg.status === "read"
  );
}

// The point after which nothing we sent has been confirmed, or null when there
// is nothing worth saying: a healthy conversation, one with no outgoing messages
// at all, or one whose silence is still inside the window.
//
// Returning the OLDEST unconfirmed send rather than the newest is what makes the
// date mean something. It answers "since when has this been going nowhere",
// which is the question a reader has, instead of "when did you last try".
export function unconfirmedSince(
  messages: readonly ChatMessage[],
  nowMs: number,
): number | null {
  // The most recent evidence they are reachable at all. An inbound message
  // counts as much as a receipt: they cannot answer without having received.
  let lastConfirmed = 0;
  for (const msg of messages) {
    if (msg.isSystem === true) continue;
    if (!msg.isMine) {
      lastConfirmed = Math.max(lastConfirmed, msg.timestampMs);
      continue;
    }
    if (isConfirmed(msg)) {
      lastConfirmed = Math.max(
        lastConfirmed,
        msg.readAtMs ?? msg.deliveredAtMs ?? msg.timestampMs,
      );
    }
  }

  let oldest: number | null = null;
  for (const msg of messages) {
    if (!msg.isMine || msg.isSystem === true) continue;
    // Already surfaced in the bubble itself, so counting it here would say the
    // same thing twice - and a reclaimed payment was withdrawn on purpose.
    if (msg.status === "failed" || msg.status === "reclaimed") continue;
    if (isConfirmed(msg)) continue;
    if (msg.timestampMs <= lastConfirmed) continue;
    if (oldest === null || msg.timestampMs < oldest) oldest = msg.timestampMs;
  }

  if (oldest === null) return null;
  return nowMs - oldest >= DELIVERY_SILENCE_MS ? oldest : null;
}
