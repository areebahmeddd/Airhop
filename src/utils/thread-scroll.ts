// What a message list should do when its content size changes.
//
// The whole scroll policy, of which this function is the larger half:
//
//   the view follows        anything live, and anything the reader sends
//   the view does not       anything a peer sends, and anything being composed
//
// Live means audio playing right now, in either direction: keying up, and a
// peer taking the floor. Both are handled in message-thread by calling
// jumpToLatest directly, because a burst adds no message and so produces no
// content-size change for this function to see. Everything else arrives here.
//
// A peer's message never moves the reader. The jump-to-latest pill offers the
// trip with a count of what has arrived, and the choice stays theirs.
//
// A chat list is told "your content is now this tall" for two very different
// reasons, and it cannot tell them apart from the event alone:
//
//   * the list is measuring itself - FlatList reports once per batch it
//     renders, so opening a thread produces a run of these before anything has
//     changed, and an image finishing layout produces another later,
//   * a message actually arrived.
//
// Treating the first kind as the second is what makes a thread appear to scroll
// itself down several times when you reopen it: the same landing, performed
// once per batch, animated. So the decision is made here, from the reader's
// position and whether the message count moved, and it is the same rule for
// every caller.

export interface ThreadScrollInput {
  // The reader has not taken hold of the list yet: no drag, no jump to a
  // specific message. Until they do, the list is still landing on the newest
  // message and every measurement is another chance to complete that.
  landing: boolean;
  // The reader is at (or within a bubble of) the newest message.
  atBottom: boolean;
  // The thread gained or lost a message since the last measurement.
  countChanged: boolean;
  // This measurement is the reader's own outgoing message arriving in the
  // thread they are looking at.
  ownMessage: boolean;
}

// "instant" for placing the reader, "animated" for a message arriving under
// one who is already reading the end, "none" for everyone else.
export type ThreadScroll = "none" | "instant" | "animated";

export function resolveThreadScroll({
  landing,
  atBottom,
  countChanged,
  ownMessage,
}: ThreadScrollInput): ThreadScroll {
  // Your own message is the one thing that earns the trip regardless of where
  // you were reading, because sending IS the request to be at the end: the
  // message went to the bottom of the thread, and a composer that files your
  // words somewhere off screen reads as a failed send. Every chat app answers a
  // send the same way, and it is the only exception to the rule below.
  if (ownMessage) return "animated";
  // Scrolling up is a deliberate act: reading back, quoting something, looking
  // at an old photo. Yanking someone to the bottom because a peer typed, or
  // because an image two screens up finished loading, is the single most
  // disruptive thing a chat list can do. The jump-to-latest pill offers the
  // trip instead, and the choice stays theirs.
  if (!landing && !atBottom) return "none";
  return countChanged ? "animated" : "instant";
}

//
// The landing above is driven entirely by content-size events, so it ends the
// moment the content stops changing height - whether or not it actually arrived.
// A list that is not inverted mounts its OLDEST rows first and walks down as
// later batches render, so "open at the newest message" is a run of scrolls, and
// losing the last one leaves the reader a row short of the end. Nothing measured
// that, and the jump-to-latest pill is suppressed for the whole landing, so a
// near miss stranded them with no way back.
//
// So once the content holds still, check the placement rather than assume it,
// then hand the list back to the reader.

export type LandingSettle = "correct" | "finish";

export interface LandingSettleInput {
  // Distance from the end the last scroll event reported, or null if none has
  // come back since the last placement.
  distanceFromBottom: number | null;
  // How far off the end still counts as arrived. Deliberately much tighter than
  // the "has the reader wandered off" tolerance: those are different questions.
  // Deciding somebody drifted away can afford to be generous, because being
  // wrong only shows a pill they can ignore. Deciding our own placement landed
  // cannot, because being wrong is the bug - a gap of well under one bubble is
  // exactly what this exists to close, and a generous threshold would call it
  // arrived and walk away.
  tolerance: number;
}

export function resolveLandingSettle({
  distanceFromBottom,
  tolerance,
}: LandingSettleInput): LandingSettle {
  // No scroll event since the last placement means no evidence of arriving.
  // Correct rather than assume: scrolling to an end you are already at costs
  // nothing, while skipping it is the whole defect.
  if (distanceFromBottom === null) return "correct";
  return distanceFromBottom > tolerance ? "correct" : "finish";
}
