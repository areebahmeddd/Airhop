// Tests for the Nostr geo-relay directory.
// geo-relay.ts has no native or network dependencies; fully testable in CI.

import {
  DEFAULT_DM_RELAYS,
  GeoRelayDirectory,
  haversineKm,
  mergeGeoRelays,
  parseRelaysCsv,
  relayDisplayHost,
  validateRelayUrl,
} from "../geo-relay";

describe("validateRelayUrl", () => {
  test("accepts a bare host and normalizes to wss://", () => {
    expect(validateRelayUrl("relay.example.com")).toBe(
      "wss://relay.example.com",
    );
    expect(validateRelayUrl("  relay.damus.io ")).toBe("wss://relay.damus.io");
  });

  test("accepts wss:// and https:// input, normalizing to wss://", () => {
    expect(validateRelayUrl("wss://nos.lol")).toBe("wss://nos.lol");
    expect(validateRelayUrl("https://relay.primal.net")).toBe(
      "wss://relay.primal.net",
    );
  });

  test("keeps a non-standard port, drops an explicit 443", () => {
    expect(validateRelayUrl("relay.example.com:8443")).toBe(
      "wss://relay.example.com:8443",
    );
    expect(validateRelayUrl("relay.example.com:443")).toBe(
      "wss://relay.example.com",
    );
  });

  test("allows a trailing slash but no other path", () => {
    expect(validateRelayUrl("wss://relay.example.com/")).toBe(
      "wss://relay.example.com",
    );
    expect(validateRelayUrl("wss://relay.example.com/path")).toBeNull();
  });

  test("rejects unsupported schemes", () => {
    expect(validateRelayUrl("ws://relay.example.com")).toBeNull();
    expect(validateRelayUrl("http://relay.example.com")).toBeNull();
    expect(validateRelayUrl("ftp://relay.example.com")).toBeNull();
  });

  test("rejects IPs, single-label, and loopback/private names", () => {
    expect(validateRelayUrl("192.168.1.10")).toBeNull();
    expect(validateRelayUrl("localhost")).toBeNull();
    expect(validateRelayUrl("mybox.local")).toBeNull();
    expect(validateRelayUrl("service.internal")).toBeNull();
    expect(validateRelayUrl("relay")).toBeNull();
  });

  test("rejects credentials, query, fragment, spaces, and junk", () => {
    expect(validateRelayUrl("wss://user:pass@relay.example.com")).toBeNull();
    expect(validateRelayUrl("relay.example.com?x=1")).toBeNull();
    expect(validateRelayUrl("relay.example.com#f")).toBeNull();
    expect(validateRelayUrl("relay example.com")).toBeNull();
    expect(validateRelayUrl("hello world")).toBeNull();
    expect(validateRelayUrl("")).toBeNull();
  });

  test("rejects bad DNS labels", () => {
    expect(validateRelayUrl("-bad.example.com")).toBeNull();
    expect(validateRelayUrl("bad-.example.com")).toBeNull();
    expect(validateRelayUrl("a..example.com")).toBeNull();
  });
});

describe("mergeGeoRelays", () => {
  const near = ["wss://n1", "wss://n2", "wss://n3"];
  const custom = ["wss://c1", "wss://c2"];

  test("discovery on, no custom: just the nearest (capped)", () => {
    expect(mergeGeoRelays(near, [], true, 2)).toEqual(["wss://n1", "wss://n2"]);
  });

  test("discovery on, with custom: nearest kept (interop) plus custom, deduped", () => {
    const out = mergeGeoRelays(near, custom, true, 3);
    expect(out).toContain("wss://n1"); // interop relays never dropped
    expect(out).toContain("wss://n2");
    expect(out).toContain("wss://n3");
    expect(out).toContain("wss://c1");
    expect(out).toContain("wss://c2");
  });

  test("discovery on: a custom relay that is also nearest is not duplicated", () => {
    expect(
      mergeGeoRelays(["wss://a", "wss://b"], ["wss://a"], true, 2),
    ).toEqual(["wss://a", "wss://b"]);
  });

  test("discovery off, with custom: only the custom relays", () => {
    expect(mergeGeoRelays(near, custom, false, 5)).toEqual(custom);
  });

  test("discovery off, no custom: falls back to nearest so it is never empty", () => {
    expect(mergeGeoRelays(near, [], false, 2)).toEqual([
      "wss://n1",
      "wss://n2",
    ]);
  });
});

describe("relayDisplayHost", () => {
  test("drops the scheme, which is identical on every relay", () => {
    expect(relayDisplayHost("wss://relay.damus.io")).toBe("relay.damus.io");
  });

  test("leaves a bare host alone", () => {
    expect(relayDisplayHost("relay.damus.io")).toBe("relay.damus.io");
  });

  test("keeps a port, which is what distinguishes two relays on one host", () => {
    expect(relayDisplayHost("wss://relay.example.com:8443")).toBe(
      "relay.example.com:8443",
    );
  });
});

describe("DEFAULT_DM_RELAYS", () => {
  // The DM pool and the geo fallback are two roles over one list. They used to
  // be two hand-maintained literals of the same four hosts in two files, so an
  // edit could land on one and leave the other behind with nothing to catch it.
  test("is the set the directory itself falls back on", () => {
    const empty = new GeoRelayDirectory();
    const fallback = empty.nearestRelays(0, 0, DEFAULT_DM_RELAYS.length);
    expect([...fallback].sort()).toEqual([...DEFAULT_DM_RELAYS].sort());
  });

  test("every entry passes the bar custom relays are held to", () => {
    for (const url of DEFAULT_DM_RELAYS) {
      expect(validateRelayUrl(url)).toBe(url);
    }
  });

  // The Settings list renders this array as-is rather than sorting a copy, so
  // the order here IS the order on screen. Sorting in the UI instead would hide
  // an out-of-order addition; failing here points at the line that caused it.
  test("stays alphabetical by host, since none of this is a ranking", () => {
    const hosts = DEFAULT_DM_RELAYS.map(relayDisplayHost);
    expect(hosts).toEqual([...hosts].sort());
  });
});

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

    // The upstream feed lists ~100 hosts twice, bare and with :443. One machine.
    it("treats host and host:443 as the same relay", () => {
      const dupCsv = [
        "Relay URL,Latitude,Longitude",
        "relay.test.com,10,20",
        "relay.test.com:443,10,20",
      ].join("\n");
      const dir = new GeoRelayDirectory();
      dir.load(dupCsv);
      expect(dir.size).toBe(1);
      expect(dir.nearestRelays(10, 20, 5)).toEqual(["wss://relay.test.com"]);
    });

    // A duplicate must not take a selection slot and push out a distinct relay,
    // which is how two clients in one cell end up on different relays.
    it("does not let a :443 twin displace a distinct relay from the top N", () => {
      const csvWithTwin = [
        "Relay URL,Latitude,Longitude",
        "a.test.com,10,20",
        "b.test.com,10.1,20",
        "b.test.com:443,10.1,20",
        "c.test.com,10.2,20",
      ].join("\n");
      const dir = new GeoRelayDirectory();
      dir.load(csvWithTwin);

      expect(dir.nearestRelays(10, 20, 3)).toEqual([
        "wss://a.test.com",
        "wss://b.test.com",
        "wss://c.test.com",
      ]);
    });

    // A non-standard port is a different endpoint.
    it("keeps a relay on a non-standard port distinct from the bare host", () => {
      const csvWithPort = [
        "Relay URL,Latitude,Longitude",
        "relay.test.com,10,20",
        "relay.test.com:444,10,20",
      ].join("\n");
      const dir = new GeoRelayDirectory();
      dir.load(csvWithPort);
      expect(dir.size).toBe(2);
    });

    it("rejects plaintext ws:// directory rows", () => {
      const csv = [
        "Relay URL,Latitude,Longitude",
        "ws://insecure.test.com,10,20",
        "relay.test.com,10,20",
      ].join("\n");
      const dir = new GeoRelayDirectory();
      dir.load(csv);
      expect(dir.size).toBe(1);
      expect(dir.nearestRelays(10, 20, 5)).toEqual(["wss://relay.test.com"]);
    });
  });
});
