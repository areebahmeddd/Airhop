/**
 * @jest-environment node
 */
// Bearing, distance and the words the location card puts on them.

import {
  bearingDegrees,
  compassPoint,
  distanceMeters,
  roundedDistance,
} from "../geo";

const BENGALURU = { lat: 12.9716, lng: 77.5946 };
const DELHI = { lat: 28.6139, lng: 77.209 };

describe("distanceMeters", () => {
  it("is zero for the same point", () => {
    expect(distanceMeters(BENGALURU, BENGALURU)).toBe(0);
  });

  it("matches a known long distance", () => {
    // Bengaluru to Delhi is about 1740 km. Within 1%.
    const km = distanceMeters(BENGALURU, DELHI) / 1000;
    expect(km).toBeGreaterThan(1720);
    expect(km).toBeLessThan(1760);
  });

  // The range the card is for: two people at a festival.
  it("is accurate at festival range", () => {
    const near = { lat: BENGALURU.lat + 0.0018, lng: BENGALURU.lng };
    // 0.0018 degrees of latitude is about 200 m anywhere on Earth.
    expect(distanceMeters(BENGALURU, near)).toBeGreaterThan(190);
    expect(distanceMeters(BENGALURU, near)).toBeLessThan(210);
  });

  it("is symmetric", () => {
    expect(distanceMeters(BENGALURU, DELHI)).toBeCloseTo(
      distanceMeters(DELHI, BENGALURU),
      6,
    );
  });
});

describe("bearingDegrees", () => {
  it("points north for a point due north", () => {
    expect(
      bearingDegrees(BENGALURU, {
        lat: BENGALURU.lat + 0.01,
        lng: BENGALURU.lng,
      }),
    ).toBeCloseTo(0, 1);
  });

  it("points east for a point due east", () => {
    expect(
      bearingDegrees(BENGALURU, {
        lat: BENGALURU.lat,
        lng: BENGALURU.lng + 0.01,
      }),
    ).toBeCloseTo(90, 1);
  });

  it("points south and west correspondingly", () => {
    expect(
      bearingDegrees(BENGALURU, {
        lat: BENGALURU.lat - 0.01,
        lng: BENGALURU.lng,
      }),
    ).toBeCloseTo(180, 1);
    expect(
      bearingDegrees(BENGALURU, {
        lat: BENGALURU.lat,
        lng: BENGALURU.lng - 0.01,
      }),
    ).toBeCloseTo(270, 1);
  });

  it("always answers in 0 to 360", () => {
    const bearing = bearingDegrees(DELHI, BENGALURU);
    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThan(360);
  });
});

describe("compassPoint", () => {
  // Sectors are centred on their labels, so due north reads "n" from either
  // side of 0.
  it("centres each sector on its label", () => {
    expect(compassPoint(0)).toBe("n");
    expect(compassPoint(20)).toBe("n");
    expect(compassPoint(340)).toBe("n");
    expect(compassPoint(45)).toBe("ne");
    expect(compassPoint(90)).toBe("e");
    expect(compassPoint(180)).toBe("s");
    expect(compassPoint(315)).toBe("nw");
  });

  it("handles a bearing outside one turn", () => {
    expect(compassPoint(365)).toBe("n");
    expect(compassPoint(-90)).toBe("w");
  });
});

describe("roundedDistance", () => {
  // A phone fix is good to tens of metres, so "183 m" claims confidence the
  // reading does not have.
  it("rounds to ten metres under a kilometre", () => {
    expect(roundedDistance(183)).toEqual({ value: 180, unit: "m" });
    expect(roundedDistance(7)).toEqual({ value: 10, unit: "m" });
    expect(roundedDistance(0)).toEqual({ value: 0, unit: "m" });
  });

  it("switches to kilometres at a kilometre", () => {
    expect(roundedDistance(1000)).toEqual({ value: 1, unit: "km" });
    expect(roundedDistance(1740000)).toEqual({ value: 1740, unit: "km" });
  });

  it("keeps one decimal place in kilometres", () => {
    expect(roundedDistance(1250)).toEqual({ value: 1.3, unit: "km" });
  });
});
