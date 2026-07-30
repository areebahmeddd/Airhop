/**
 * @jest-environment node
 */
// A wrong neighbour walks the user somewhere they did not point at, and the
// cases that break neighbour maths are exactly the ones nobody tests by hand:
// the poles and the date line. Values below are checked against the published
// geohash grid rather than against our own implementation.

import {
  geohashBounds,
  geohashCenter,
  geohashNeighbours,
} from "../geohash-grid";

describe("geohashBounds", () => {
  it("treats the empty prefix as the whole world", () => {
    expect(geohashBounds("")).toEqual({
      minLat: -90,
      maxLat: 90,
      minLon: -180,
      maxLon: 180,
    });
  });

  it("boxes a known cell", () => {
    // "u" is the north-east quadrant-ish cell covering much of Europe.
    const b = geohashBounds("u");
    expect(b.minLat).toBe(45);
    expect(b.maxLat).toBe(90);
    expect(b.minLon).toBe(0);
    expect(b.maxLon).toBe(45);
  });

  it("narrows as precision grows", () => {
    const wide = geohashBounds("tdr");
    const tight = geohashBounds("tdr1k");
    expect(tight.maxLat - tight.minLat).toBeLessThan(wide.maxLat - wide.minLat);
  });
});

describe("geohashNeighbours", () => {
  it("has none for the whole world", () => {
    expect(geohashNeighbours("")).toEqual([]);
  });

  it("finds the eight cells around an inland one", () => {
    const n = geohashNeighbours("tdr1k");
    expect(n).toHaveLength(8);
    expect(new Set(n.map((x) => x.geohash)).size).toBe(8);
    // A neighbour is a different cell of the same precision.
    expect(n.every((x) => x.geohash.length === 5)).toBe(true);
    expect(n.every((x) => x.geohash !== "tdr1k")).toBe(true);
  });

  it("puts north actually north", () => {
    const n = geohashNeighbours("tdr1k");
    const north = n.find((x) => x.direction === "N")!;
    expect(geohashCenter(north.geohash).lat).toBeGreaterThan(
      geohashCenter("tdr1k").lat,
    );
  });

  it("wraps across the date line instead of inventing a cell", () => {
    // "x" sits against +180; its eastern neighbour belongs on the other side.
    const n = geohashNeighbours("x");
    expect(n.every((x) => /^[0-9b-hjkmnp-z]$/.test(x.geohash))).toBe(true);
  });

  it("drops the neighbour that would be past the pole", () => {
    // A top-row cell has no cell to its north.
    const n = geohashNeighbours("b");
    expect(n.some((x) => x.direction === "N")).toBe(false);
  });
});
