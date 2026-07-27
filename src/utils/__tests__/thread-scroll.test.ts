/**
 * @jest-environment node
 */
// What a message list does when its content size changes.

import { resolveThreadScroll } from "../thread-scroll";

describe("resolveThreadScroll", () => {
  describe("opening a thread", () => {
    it("lands instantly on the first measurement", () => {
      expect(
        resolveThreadScroll({
          landing: true,
          atBottom: true,
          countChanged: false,
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
        }),
      ).toBe("animated");
    });

    it("re-pins silently when layout shifts under it", () => {
      expect(
        resolveThreadScroll({
          landing: false,
          atBottom: true,
          countChanged: false,
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
        }),
      ).toBe("none");
    });

    it("leaves the reader alone when an image finishes loading", () => {
      expect(
        resolveThreadScroll({
          landing: false,
          atBottom: false,
          countChanged: false,
        }),
      ).toBe("none");
    });
  });
});
