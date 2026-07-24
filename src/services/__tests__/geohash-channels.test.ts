/**
 * @jest-environment node
 */
// Geohash channel mapping + relay selection.
//
// Two properties decide whether location channels work at all:
//
//  1. Everyone in a cell must compute the SAME geohash for a channel, or they
//     end up in different rooms while believing they share one.
//  2. Everyone must converge on the SAME relay set for that cell, or messages
//     get published to relays nobody is subscribed to and vanish silently.
//
// Both failures are invisible in local testing, since the sender sees their own
// message fine, so they're pinned here.

import { GeoRelayDirectory } from "../../core/nostr/geo-relay";
import { decodeGeohash, encodeGeohash } from "../../core/nostr/presence";
import { GEO_RELAYS } from "../../data/relays";
import {
  GEO_CHANNEL_PRECISION,
  geohashChannel,
  geohashLevelName,
  isGeoChannel,
  isManualGeoChannel,
  isValidGeohash,
  manualGeohashOf,
  normalizeGeohash,
} from "../geohash-channel-service";

jest.mock("expo-location", () => ({}));

// Two points ~1km apart in central London, and one far away.
const LONDON = { lat: 51.5074, lng: -0.1278 };
const LONDON_NEARBY = { lat: 51.5145, lng: -0.127 };
const TOKYO = { lat: 35.6762, lng: 139.6503 };

describe("channel → precision mapping", () => {
  it("matches bitchat's level table", () => {
    // block=7, neighborhood=6, city=5, province=4, region=2.
    expect(GEO_CHANNEL_PRECISION["#block"]).toBe(7);
    expect(GEO_CHANNEL_PRECISION["#neighborhood"]).toBe(6);
    expect(GEO_CHANNEL_PRECISION["#city"]).toBe(5);
    expect(GEO_CHANNEL_PRECISION["#province"]).toBe(4);
    expect(GEO_CHANNEL_PRECISION["#region"]).toBe(2);
  });

  it("never bridges #bluetooth", () => {
    // #bluetooth is the offline-only channel; bridging it to the internet
    // would break the one guarantee it makes.
    expect(isGeoChannel("#bluetooth")).toBe(false);
  });

  it("treats unknown channels as non-geo", () => {
    expect(isGeoChannel("#my-custom-room")).toBe(false);
    expect(isGeoChannel("dm:aabbccdd00112233")).toBe(false);
  });

  it("treats a teleported cell as a geo channel", () => {
    expect(isGeoChannel("geohash:tdr1k")).toBe(true);
    expect(isManualGeoChannel("geohash:tdr1k")).toBe(true);
    // A named location channel is not a manual/teleported one.
    expect(isManualGeoChannel("#city")).toBe(false);
  });

  it("produces coarser cells as the scope widens", () => {
    const lengths = [
      "#block",
      "#neighborhood",
      "#city",
      "#province",
      "#region",
    ].map(
      (c) =>
        encodeGeohash(LONDON.lat, LONDON.lng, GEO_CHANNEL_PRECISION[c]).length,
    );
    // Strictly decreasing precision from block out to region.
    expect(lengths).toEqual([...lengths].sort((a, b) => b - a));
  });
});

describe("teleport: manual geohash channels", () => {
  it("round-trips a geohash through the channel key", () => {
    const channel = geohashChannel("tdr1k");
    expect(channel).toBe("geohash:tdr1k");
    expect(manualGeohashOf(channel)).toBe("tdr1k");
  });

  it("returns null geohash for a non-manual channel", () => {
    expect(manualGeohashOf("#city")).toBeNull();
    expect(manualGeohashOf("group:abcd")).toBeNull();
  });

  it("normalises user input the way bitchat does", () => {
    // Lowercase, drop a leading #, discard out-of-alphabet chars, cap at 12.
    expect(normalizeGeohash("#TDR1K")).toBe("tdr1k");
    expect(normalizeGeohash("  u4pruy  ")).toBe("u4pruy");
    // a, i, l, o are not in the geohash alphabet and are stripped.
    expect(normalizeGeohash("taile")).toBe("te");
    expect(normalizeGeohash("bcdefghjkmnpqrstuvwxyz")).toHaveLength(12);
  });

  it("accepts geohashes of 2 to 12 valid chars", () => {
    expect(isValidGeohash("td")).toBe(true);
    expect(isValidGeohash("tdr1k")).toBe(true);
    expect(isValidGeohash("u4pruydqqvj8")).toBe(true); // 12
  });

  it("rejects too short, too long, or out-of-alphabet geohashes", () => {
    expect(isValidGeohash("t")).toBe(false); // 1 char
    expect(isValidGeohash("u4pruydqqvj8x")).toBe(false); // 13 chars
    expect(isValidGeohash("tail")).toBe(false); // a, i, l not allowed
    expect(isValidGeohash("")).toBe(false);
  });

  it("maps geohash length to the same coverage level as bitchat", () => {
    // bitchat GeohashChannelLevel.level(forLength:): 0-2 region, 3-4 province,
    // 5 city, 6 neighborhood, 7 block, 8+ building.
    expect(geohashLevelName("t")).toBe("Region");
    expect(geohashLevelName("td")).toBe("Region");
    expect(geohashLevelName("tdr")).toBe("Province");
    expect(geohashLevelName("tdr1")).toBe("Province");
    expect(geohashLevelName("tdr1k")).toBe("City");
    expect(geohashLevelName("tdr1ke")).toBe("Neighborhood");
    expect(geohashLevelName("tdr1ke7")).toBe("Block");
    expect(geohashLevelName("tdr1ke7x")).toBe("Building");
  });
});

describe("cell membership", () => {
  it("puts two nearby people in the same city cell", () => {
    const a = encodeGeohash(LONDON.lat, LONDON.lng, 5);
    const b = encodeGeohash(LONDON_NEARBY.lat, LONDON_NEARBY.lng, 5);
    expect(a).toBe(b);
  });

  it("separates distant people at city scope", () => {
    expect(encodeGeohash(LONDON.lat, LONDON.lng, 5)).not.toBe(
      encodeGeohash(TOKYO.lat, TOKYO.lng, 5),
    );
  });

  it("nests finer cells inside coarser ones", () => {
    // A block cell must be a prefix-extension of its city cell, otherwise the
    // scope hierarchy the UI describes would be a lie.
    const block = encodeGeohash(LONDON.lat, LONDON.lng, 7);
    const city = encodeGeohash(LONDON.lat, LONDON.lng, 5);
    expect(block.startsWith(city)).toBe(true);
  });

  it("round-trips a geohash back to within its own cell", () => {
    const gh = encodeGeohash(LONDON.lat, LONDON.lng, 5);
    const center = decodeGeohash(gh);
    expect(encodeGeohash(center.lat, center.lng, 5)).toBe(gh);
  });
});

describe("relay selection determinism", () => {
  function directory() {
    const d = new GeoRelayDirectory();
    d.loadEntries(GEO_RELAYS);
    return d;
  }

  it("loads the generated relay table", () => {
    expect(directory().size).toBeGreaterThan(100);
  });

  it("returns the same relays for the same cell every time", () => {
    const gh = encodeGeohash(LONDON.lat, LONDON.lng, 5);
    const a = directory().closestRelaysToGeohash(gh, decodeGeohash, 5);
    const b = directory().closestRelaysToGeohash(gh, decodeGeohash, 5);
    expect(a).toEqual(b);
    expect(a).toHaveLength(5);
  });

  it("gives two people in one cell an identical relay set", () => {
    // The load-bearing interop property. Both users decode the CELL CENTRE,
    // not their own position, so their relay sets must match exactly.
    const gh = encodeGeohash(LONDON.lat, LONDON.lng, 5);
    const ghOther = encodeGeohash(LONDON_NEARBY.lat, LONDON_NEARBY.lng, 5);
    expect(ghOther).toBe(gh); // same cell, precondition

    expect(directory().closestRelaysToGeohash(gh, decodeGeohash, 5)).toEqual(
      directory().closestRelaysToGeohash(ghOther, decodeGeohash, 5),
    );
  });

  it("breaks distance ties deterministically by URL", () => {
    const d = new GeoRelayDirectory();
    // Same coordinates: pure tie. Insertion order is deliberately reversed
    // from sort order to prove ordering isn't accidental.
    d.loadEntries([
      { url: "wss://zzz.example", lat: 10, lng: 10 },
      { url: "wss://aaa.example", lat: 10, lng: 10 },
      { url: "wss://mmm.example", lat: 10, lng: 10 },
    ]);
    expect(d.nearestRelays(10, 10, 3)).toEqual([
      "wss://aaa.example",
      "wss://mmm.example",
      "wss://zzz.example",
    ]);
  });

  it("picks geographically closer relays first", () => {
    const d = new GeoRelayDirectory();
    d.loadEntries([
      { url: "wss://far.example", lat: -40, lng: 170 },
      { url: "wss://near.example", lat: 51.5, lng: -0.12 },
    ]);
    expect(d.nearestRelays(LONDON.lat, LONDON.lng, 1)).toEqual([
      "wss://near.example",
    ]);
  });

  it("gives different cells different relay sets", () => {
    const d = directory();
    const london = d.closestRelaysToGeohash(
      encodeGeohash(LONDON.lat, LONDON.lng, 5),
      decodeGeohash,
      5,
    );
    const tokyo = d.closestRelaysToGeohash(
      encodeGeohash(TOKYO.lat, TOKYO.lng, 5),
      decodeGeohash,
      5,
    );
    expect(london).not.toEqual(tokyo);
  });
});
