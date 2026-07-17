// Tests for the Nostr geo-relay directory.
// geo-relay.ts has no native or network dependencies; fully testable in CI.

import { GeoRelayDirectory, haversineKm, parseRelaysCsv } from "../geo-relay";

describe("geo-relay", () => {
  describe("haversineKm", () => {
    it("returns zero for identical coordinates", () => {
      expect(haversineKm(52.5, 13.4, 52.5, 13.4)).toBe(0);
    });

    it("calculates Berlin to London correctly (~930 km)", () => {
      const km = haversineKm(52.52, 13.405, 51.5074, -0.1278);
      expect(km).toBeGreaterThan(900);
      expect(km).toBeLessThan(960);
    });

    it("calculates New York to Los Angeles correctly (~3940 km)", () => {
      const km = haversineKm(40.7128, -74.006, 34.0522, -118.2437);
      expect(km).toBeGreaterThan(3900);
      expect(km).toBeLessThan(4000);
    });
  });

  describe("parseRelaysCsv", () => {
    it("parses a well-formed CSV correctly", () => {
      const csv = [
        "Relay URL,Latitude,Longitude",
        "relay.damus.io,37.7749,-122.4194",
        "wss://nos.lol,40.7128,-74.006",
      ].join("\n");

      const entries = parseRelaysCsv(csv);
      expect(entries).toHaveLength(2);
      expect(entries[0].url).toBe("wss://relay.damus.io");
      expect(entries[0].lat).toBeCloseTo(37.7749);
      expect(entries[1].url).toBe("wss://nos.lol");
    });

    it("skips header row", () => {
      const csv = "Relay URL,Latitude,Longitude\nrelay.test.com,0,0";
      const entries = parseRelaysCsv(csv);
      expect(entries).toHaveLength(1);
      expect(entries[0].url).toBe("wss://relay.test.com");
    });

    it("skips malformed rows silently", () => {
      const csv = [
        "Relay URL,Latitude,Longitude",
        "bad-row",
        "relay.test.com,notanumber,0",
        "relay2.test.com,91,0", // lat out of range
        "relay3.test.com,45,200", // lng out of range
        "relay4.test.com,45,90",
      ].join("\n");

      const entries = parseRelaysCsv(csv);
      expect(entries).toHaveLength(1);
      expect(entries[0].url).toBe("wss://relay4.test.com");
    });

    it("handles empty CSV", () => {
      expect(parseRelaysCsv("Relay URL,Latitude,Longitude")).toHaveLength(0);
      expect(parseRelaysCsv("")).toHaveLength(0);
    });
  });

  describe("GeoRelayDirectory", () => {
    const csv = [
      "Relay URL,Latitude,Longitude",
      "relay.berlin.de,52.52,13.405",
      "relay.london.uk,51.507,-0.128",
      "relay.tokyo.jp,35.689,139.692",
      "relay.nyc.us,40.713,-74.006",
      "relay.sydney.au,-33.869,151.209",
    ].join("\n");

    it("loads CSV and returns correct relay count", () => {
      const dir = new GeoRelayDirectory();
      dir.load(csv);
      expect(dir.size).toBe(5);
    });

    it("returns nearest relay for Berlin", () => {
      const dir = new GeoRelayDirectory();
      dir.load(csv);
      const nearest = dir.nearestRelays(52.52, 13.405, 1);
      expect(nearest[0]).toBe("wss://relay.berlin.de");
    });

    it("returns nearest relay for Tokyo", () => {
      const dir = new GeoRelayDirectory();
      dir.load(csv);
      const nearest = dir.nearestRelays(35.689, 139.692, 1);
      expect(nearest[0]).toBe("wss://relay.tokyo.jp");
    });

    it("respects count limit", () => {
      const dir = new GeoRelayDirectory();
      dir.load(csv);
      const nearest = dir.nearestRelays(0, 0, 3);
      expect(nearest).toHaveLength(3);
    });

    it("falls back to default relays when directory is empty", () => {
      const dir = new GeoRelayDirectory();
      const nearest = dir.nearestRelays(0, 0, 2);
      expect(nearest).toHaveLength(2);
      expect(nearest[0]).toMatch(/^wss:\/\//);
    });

    it("de-duplicates relays on load", () => {
      const dupCsv = [
        "Relay URL,Latitude,Longitude",
        "relay.test.com,10,20",
        "relay.test.com,10,20",
        "wss://relay.test.com,10,20",
      ].join("\n");
      const dir = new GeoRelayDirectory();
      dir.load(dupCsv);
      expect(dir.size).toBe(1);
    });
  });
});
