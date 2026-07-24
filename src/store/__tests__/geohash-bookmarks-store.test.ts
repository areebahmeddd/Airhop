/**
 * @jest-environment node
 */
// Geohash bookmarks: the saved cells a user can reopen from the "Go to a place"
// sheet. Small store, but the properties that matter are that toggling is
// idempotent per cell, newest saves come first, and a wipe leaves nothing.

import { useGeohashBookmarksStore } from "../geohash-bookmarks-store";

beforeEach(() => {
  useGeohashBookmarksStore.getState().clearAll();
});

function state() {
  return useGeohashBookmarksStore.getState();
}

describe("geohash bookmarks", () => {
  it("starts empty and reports unknown cells as not bookmarked", () => {
    expect(state().bookmarks).toEqual([]);
    expect(state().isBookmarked("tdr1k")).toBe(false);
  });

  it("toggles a cell on and off", () => {
    state().toggle("tdr1k");
    expect(state().isBookmarked("tdr1k")).toBe(true);
    expect(state().bookmarks).toEqual(["tdr1k"]);

    state().toggle("tdr1k");
    expect(state().isBookmarked("tdr1k")).toBe(false);
    expect(state().bookmarks).toEqual([]);
  });

  it("keeps the most recently saved cell first", () => {
    state().toggle("td");
    state().toggle("tdr1k");
    state().toggle("u4pruy");
    expect(state().bookmarks).toEqual(["u4pruy", "tdr1k", "td"]);
  });

  it("never stores a cell twice", () => {
    state().toggle("tdr1k");
    state().toggle("tdr1k"); // off
    state().toggle("tdr1k"); // on again
    expect(state().bookmarks).toEqual(["tdr1k"]);
  });

  it("removes a specific cell without touching the rest", () => {
    state().toggle("td");
    state().toggle("tdr1k");
    state().remove("td");
    expect(state().bookmarks).toEqual(["tdr1k"]);
    expect(state().isBookmarked("td")).toBe(false);
  });

  it("clears everything on wipe", () => {
    state().toggle("td");
    state().toggle("tdr1k");
    state().clearAll();
    expect(state().bookmarks).toEqual([]);
  });
});
