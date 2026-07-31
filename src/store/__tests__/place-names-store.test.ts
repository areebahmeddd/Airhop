/**
 * @jest-environment node
 */
// Place names are a best-effort nicety layered on top of a feature that must
// work with no network at all. These pin the failure behaviour, because that is
// the behaviour that actually ships in a blackout: a lookup that cannot happen
// must leave the cell unnamed and silent, never throw, never block, and never
// cache a wrong answer that would stick around after connectivity returns.

import * as Location from "expo-location";
import { placeNameKey, usePlaceNamesStore } from "../place-names-store";

jest.mock("expo-location", () => ({ reverseGeocodeAsync: jest.fn() }));

const reverseGeocodeAsync = Location.reverseGeocodeAsync as jest.Mock;

// Cache keys fold in the device language the name came back in (see
// placeNameKey), so the tests read through the same helper the store and the UI
// use rather than assuming a bare geohash key.
function cached(geohash: string): string | undefined {
  return usePlaceNamesStore.getState().names[placeNameKey(geohash)];
}

// The store's lookup is fire-and-forget, so tests wait for its microtasks.
async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

beforeEach(() => {
  usePlaceNamesStore.getState().clearAll();
  reverseGeocodeAsync.mockReset();
});

describe("offline and failure handling", () => {
  it("leaves the cell unnamed when the geocoder throws", async () => {
    reverseGeocodeAsync.mockRejectedValue(new Error("no network"));

    expect(() => usePlaceNamesStore.getState().resolve("tdr1k")).not.toThrow();
    await settle();

    expect(cached("tdr1k")).toBeUndefined();
  });

  it("leaves the cell unnamed when the geocoder knows nothing (open water)", async () => {
    reverseGeocodeAsync.mockResolvedValue([]);

    usePlaceNamesStore.getState().resolve("td");
    await settle();

    expect(cached("td")).toBeUndefined();
  });

  it("retries on a later call, so coming back online resolves it", async () => {
    reverseGeocodeAsync.mockRejectedValueOnce(new Error("no network"));
    usePlaceNamesStore.getState().resolve("tdr1k");
    await settle();

    reverseGeocodeAsync.mockResolvedValueOnce([{ city: "Bengaluru" }]);
    usePlaceNamesStore.getState().resolve("tdr1k");
    await settle();

    expect(cached("tdr1k")).toBe("Bengaluru");
  });

  it("collapses concurrent lookups for the same cell into one round trip", async () => {
    reverseGeocodeAsync.mockResolvedValue([{ city: "Bengaluru" }]);

    usePlaceNamesStore.getState().resolve("tdr1k");
    usePlaceNamesStore.getState().resolve("tdr1k");
    usePlaceNamesStore.getState().resolve("tdr1k");
    await settle();

    expect(reverseGeocodeAsync).toHaveBeenCalledTimes(1);
  });

  it("never asks twice for a cell it already knows", async () => {
    reverseGeocodeAsync.mockResolvedValue([{ city: "Bengaluru" }]);
    usePlaceNamesStore.getState().resolve("tdr1k");
    await settle();

    usePlaceNamesStore.getState().resolve("tdr1k");
    await settle();

    expect(reverseGeocodeAsync).toHaveBeenCalledTimes(1);
  });

  it("picks a label that suits how much ground the cell covers", async () => {
    // A 2-char cell is a region, a 5-char one a city. Naming a region after a
    // street would be worse than leaving it unnamed.
    reverseGeocodeAsync.mockResolvedValue([
      { region: "Karnataka", city: "Bengaluru", street: "MG Road" },
    ]);

    usePlaceNamesStore.getState().resolve("td");
    usePlaceNamesStore.getState().resolve("tdr1k");
    await settle();

    expect(cached("td")).toBe("Karnataka");
    expect(cached("tdr1k")).toBe("Bengaluru");
  });
});
