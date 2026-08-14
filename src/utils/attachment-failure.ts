// Why an incoming attachment was refused, and whether to say so.
//
// The receive path drops a bad attachment in four places, all of them silently.
// From the outside that is indistinguishable from the file never being sent: the
// sender's bubble says "sent", the recipient sees nothing, and telling the two
// apart means reading the decoder.
//
// Two rules decide whether a refusal becomes a visible line:
//
//   - Direct messages only. A DM has one counterparty who deliberately sent
//     something, so "that didn't arrive" is actionable. Anyone in radio range
//     can put a malformed packet on the air, so a line per bad packet in a
//     public room is a spam vector. Same boundary bitchat drew in #1609.
//   - One line per sender per minute. A directed packet is also something
//     anyone in range can send repeatedly. A real failure repeats on retry, and
//     one line conveys that as well as twenty.

import { t } from "@i18n";

export type AttachmentFailure =
  // The TLV did not parse: truncated, bad lengths, or a length field that
  // disagrees with the bytes behind it.
  | "malformed"
  // A type outside the allow-list both clients share. Usually a client sending
  // something we do not render rather than an attack.
  | "unsupported-type"
  // The declared type and the file's leading bytes disagree, so the file is
  // lying about what it is. Refused before anything reaches disk.
  | "type-mismatch"
  // Decoded and validated fine; the device could not write it.
  | "storage";

// One line, in the reader's language, saying what happened without inviting
// them to debug it. Deliberately does not name the sender: the line appears
// inside that sender's thread, so naming them again is noise.
export function attachmentFailureMessage(reason: AttachmentFailure): string {
  switch (reason) {
    case "malformed":
      return t("transfer.failed.malformed");
    case "unsupported-type":
      return t("transfer.failed.unsupported_type");
    case "type-mismatch":
      return t("transfer.failed.type_mismatch");
    case "storage":
      return t("transfer.failed.storage");
  }
}

// How long a sender waits before another refusal from them is worth a line.
export const ATTACHMENT_FAILURE_NOTICE_INTERVAL_MS = 60_000;

// Per-sender throttle for the notices above.
//
// Bounded, since peer IDs are cheap to mint and this must not become a place to
// put unbounded state. Eviction is oldest-first: at worst an evicted sender gets
// one extra line, and the interval still holds for everyone else.
export class AttachmentFailureNotifier {
  private readonly lastNotifiedMs = new Map<string, number>();

  constructor(private readonly maxSenders = 64) {}

  // True when this sender's failure should be surfaced now. Records the
  // decision, so a caller must not ask twice for one event.
  shouldNotify(senderPeerID: string, nowMs: number): boolean {
    const last = this.lastNotifiedMs.get(senderPeerID);
    if (
      last !== undefined &&
      nowMs - last < ATTACHMENT_FAILURE_NOTICE_INTERVAL_MS
    ) {
      return false;
    }
    if (
      !this.lastNotifiedMs.has(senderPeerID) &&
      this.lastNotifiedMs.size >= this.maxSenders
    ) {
      const oldest = this.lastNotifiedMs.keys().next().value;
      if (oldest !== undefined) this.lastNotifiedMs.delete(oldest);
    }
    // Delete first so re-insertion moves the key to the end and the map stays
    // in least-recently-notified order for the eviction above.
    this.lastNotifiedMs.delete(senderPeerID);
    this.lastNotifiedMs.set(senderPeerID, nowMs);
    return true;
  }

  reset(): void {
    this.lastNotifiedMs.clear();
  }
}
