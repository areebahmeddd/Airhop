// What a message list should do when its content size changes.
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
  // specific message. Until they do, we are still placing them at the newest
  // message and every measurement is another chance to land it.
  landing: boolean;
  // The reader is at (or within a bubble of) the newest message.
  atBottom: boolean;
  // The thread gained or lost a message since the last measurement.
  countChanged: boolean;
}

// "instant" for placing the reader, "animated" for a message arriving under
// one who is already reading the end, "none" for everyone else.
export type ThreadScroll = "none" | "instant" | "animated";

export function resolveThreadScroll({
  landing,
  atBottom,
  countChanged,
}: ThreadScrollInput): ThreadScroll {
  // Scrolling up is a deliberate act: reading back, quoting something, looking
  // at an old photo. Yanking someone to the bottom because a peer typed, or
  // because an image two screens up finished loading, is the single most
  // disruptive thing a chat list can do. The jump-to-latest pill offers the
  // trip instead, and the choice stays theirs.
  if (!landing && !atBottom) return "none";
  return countChanged ? "animated" : "instant";
}
