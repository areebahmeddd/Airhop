/**
 * @jest-environment node
 */
// A refused attachment used to leave no trace at all: the sender's bubble said
// "sent", the recipient saw nothing, and the two were indistinguishable from a
// file that was never sent. Saying so is the fix, but the saying itself is a
// surface anyone in radio range can reach, so the throttle around it is as
// load-bearing as the message.

import { t } from "@i18n";
import {
  ATTACHMENT_FAILURE_NOTICE_INTERVAL_MS,
  AttachmentFailureNotifier,
  attachmentFailureKey,
  type AttachmentFailure,
} from "../attachment-failure";

// The receive path stores the key and the reader sees the rendering, so the
// line under test is the key resolved through the catalog.
const lineFor = (reason: AttachmentFailure): string =>
  t(attachmentFailureKey(reason));

const REASONS: AttachmentFailure[] = [
  "malformed",
  "unsupported-type",
  "type-mismatch",
  "storage",
];

describe("attachmentFailureKey", () => {
  it("has a distinct, non-empty line for every reason", () => {
    const lines = REASONS.map(lineFor);
    for (const line of lines) expect(line.length).toBeGreaterThan(0);
    // Distinct, or the reasons collapse into one unhelpful string and the
    // enum stops earning its keep.
    expect(new Set(lines).size).toBe(REASONS.length);
  });

  it("never names a raw reason code", () => {
    // The reader gets a sentence, not an enum. A line that leaks
    // "type-mismatch" is a log line that escaped into the UI.
    for (const reason of REASONS) {
      expect(lineFor(reason)).not.toContain(reason);
    }
  });
});

describe("AttachmentFailureNotifier", () => {
  const ALICE = "aabbccdd00112233";
  const BOB = "1122334455667788";

  it("lets the first failure from a sender through", () => {
    const n = new AttachmentFailureNotifier();
    expect(n.shouldNotify(ALICE, 0)).toBe(true);
  });

  it("throttles a burst from the same sender to one line", () => {
    // The abuse case: a directed packet is something anyone in range can send,
    // so without this a stranger fills a thread with notices.
    const n = new AttachmentFailureNotifier();
    expect(n.shouldNotify(ALICE, 0)).toBe(true);
    for (let t = 1; t < ATTACHMENT_FAILURE_NOTICE_INTERVAL_MS; t += 1_000) {
      expect(n.shouldNotify(ALICE, t)).toBe(false);
    }
  });

  it("lets a genuine retry through once the interval has passed", () => {
    const n = new AttachmentFailureNotifier();
    expect(n.shouldNotify(ALICE, 0)).toBe(true);
    expect(n.shouldNotify(ALICE, ATTACHMENT_FAILURE_NOTICE_INTERVAL_MS)).toBe(
      true,
    );
  });

  it("throttles per sender, so one flooder cannot mute everyone else", () => {
    const n = new AttachmentFailureNotifier();
    expect(n.shouldNotify(ALICE, 0)).toBe(true);
    expect(n.shouldNotify(ALICE, 10)).toBe(false);
    // Bob's first failure is still worth a line.
    expect(n.shouldNotify(BOB, 10)).toBe(true);
  });

  it("stays bounded against fabricated sender IDs", () => {
    // Peer IDs are cheap to mint, so the throttle map must not be a place to
    // put unbounded state.
    const n = new AttachmentFailureNotifier(8);
    for (let i = 0; i < 500; i++) {
      n.shouldNotify(`peer-${i}`, i);
    }
    // The most recent sender is still throttled, which is the property that
    // matters: eviction cannot be used to escape the interval on demand.
    expect(n.shouldNotify("peer-499", 499)).toBe(false);
  });

  it("forgets everything on reset", () => {
    const n = new AttachmentFailureNotifier();
    expect(n.shouldNotify(ALICE, 0)).toBe(true);
    n.reset();
    expect(n.shouldNotify(ALICE, 1)).toBe(true);
  });
});
