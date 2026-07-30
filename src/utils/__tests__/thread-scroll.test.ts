/**
 * @jest-environment node
 */
// What a message list does when its content size changes.

import { resolveLandingSettle, resolveThreadScroll } from "../thread-scroll";

describe("resolveThreadScroll", () => {
  describe("opening a thread", () => {
    it("lands instantly on the first measurement", () => {
      expect(
        resolveThreadScroll({
          landing: true,
          atBottom: true,
          countChanged: false,
          ownMessage: false,
        }),
      ).toBe("instant");
    });

    it("stays instant for every later batch the list measures", () => {
      // The bug this exists for: FlatList reports its size once per batch, so a
      // reopened thread produced a run of these. Animating them replayed the
      // same landing as two or three visible scrolls.
      for (let batch = 0; batch < 4; batch++) {
        expect(
          resolveThreadScroll({
            landing: true,
            atBottom: true,
            countChanged: false,
            ownMessage: false,
          }),
        ).toBe("instant");
      }
    });

    it("still lands when a mid-settle measurement reported the reader off the bottom", () => {
      // Content that grows between the scroll and the throttled scroll event it
      // triggers reads as "not at the bottom" for a moment. Nobody moved, so
      // the landing must not be abandoned half way.
      expect(
        resolveThreadScroll({
          landing: true,
          atBottom: false,
          countChanged: false,
          ownMessage: false,
        }),
      ).toBe("instant");
    });
  });

  describe("reading the newest message", () => {
    it("follows a new message with an animation", () => {
      expect(
        resolveThreadScroll({
          landing: false,
          atBottom: true,
          countChanged: true,
          ownMessage: false,
        }),
      ).toBe("animated");
    });

    it("re-pins silently when layout shifts under it", () => {
      expect(
        resolveThreadScroll({
          landing: false,
          atBottom: true,
          countChanged: false,
          ownMessage: false,
        }),
      ).toBe("instant");
    });
  });

  describe("reading further up the thread", () => {
    it("leaves the reader alone when a message arrives", () => {
      expect(
        resolveThreadScroll({
          landing: false,
          atBottom: false,
          countChanged: true,
          ownMessage: false,
        }),
      ).toBe("none");
    });

    it("leaves the reader alone when an image finishes loading", () => {
      expect(
        resolveThreadScroll({
          landing: false,
          atBottom: false,
          countChanged: false,
          ownMessage: false,
        }),
      ).toBe("none");
    });
  });

  describe("sending your own message", () => {
    it("goes to it from anywhere in the thread", () => {
      // The defect this closes: reading back through history and sending a
      // message left the reader in history, with what they just sent off screen
      // below. Sending is the request to be at the end.
      expect(
        resolveThreadScroll({
          landing: false,
          atBottom: false,
          countChanged: true,
          ownMessage: true,
        }),
      ).toBe("animated");
    });

    it("animates rather than jumps, so the message is seen arriving", () => {
      expect(
        resolveThreadScroll({
          landing: false,
          atBottom: true,
          countChanged: true,
          ownMessage: true,
        }),
      ).toBe("animated");
    });

    it("outranks every other signal", () => {
      // Deliberately contradictory inputs: whatever else the list reports about
      // a measurement carrying the reader's own message, they still go to it.
      for (const landing of [true, false]) {
        for (const atBottom of [true, false]) {
          for (const countChanged of [true, false]) {
            expect(
              resolveThreadScroll({
                landing,
                atBottom,
                countChanged,
                ownMessage: true,
              }),
            ).toBe("animated");
          }
        }
      }
    });
  });
});

describe("resolveLandingSettle", () => {
  // Points, matching LANDED_TOLERANCE in message-thread.
  const tolerance = 2;

  it("finishes when the placement arrived", () => {
    expect(resolveLandingSettle({ distanceFromBottom: 0, tolerance })).toBe(
      "finish",
    );
  });

  it("forgives sub-pixel layout rounding", () => {
    expect(resolveLandingSettle({ distanceFromBottom: 1.5, tolerance })).toBe(
      "finish",
    );
  });

  it("corrects a landing left short of the newest message", () => {
    // The reopened-thread bug: a list that is not inverted mounts its oldest
    // rows first and walks down as batches render, and losing the last of those
    // scrolls left the reader a partial row from the end. Well inside the
    // generous at-bottom tolerance, which is why nothing caught it.
    expect(resolveLandingSettle({ distanceFromBottom: 46, tolerance })).toBe(
      "correct",
    );
  });

  it("corrects rather than assume when no scroll event came back", () => {
    // Nothing has reported a position since the last placement, so there is no
    // evidence of arriving. Scrolling to an end we already hold costs nothing.
    expect(resolveLandingSettle({ distanceFromBottom: null, tolerance })).toBe(
      "correct",
    );
  });

  it("does not treat overscroll as short", () => {
    // A rubber-band bounce past the end reports a negative distance. That is
    // past the newest message, not short of it.
    expect(resolveLandingSettle({ distanceFromBottom: -30, tolerance })).toBe(
      "finish",
    );
  });
});
