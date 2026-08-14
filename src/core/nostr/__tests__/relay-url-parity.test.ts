// validateRelayUrl (app) and canonicalRelayUrl (CI, scripts/relay-url.js) are
// two copies of one rule that cannot share a module across the Metro/node
// boundary. If they disagree, the directory CI builds is not the one the app
// loads: relays silently double-counted or dropped, changing which relays a
// geohash cell converges on.

import { GEO_RELAYS } from "@data/relays";
import { validateRelayUrl } from "../geo-relay";

const { canonicalRelayUrl } = require("../../../../scripts/relay-url.js") as {
  canonicalRelayUrl: (raw: string) => string | null;
};

// One case per branch, since that is where two copies drift.
const EDGE_CASES: string[] = [
  "relay.example.com",
  "RELAY.EXAMPLE.COM",
  "  relay.example.com  ",
  "wss://relay.example.com",
  "https://relay.example.com",
  "ws://relay.example.com",
  "http://relay.example.com",
  "relay.example.com:443",
  "wss://relay.example.com:443",
  "relay.example.com:444",
  "relay.example.com:0",
  "relay.example.com:65536",
  "relay.example.com:notaport",
  "relay.example.com/",
  "relay.example.com/path",
  "relay.example.com?q=1",
  "relay.example.com#frag",
  "user:pass@relay.example.com",
  "localhost",
  "foo.localhost",
  "foo.local",
  "foo.internal",
  "127.0.0.1",
  "192.168.1.1",
  "10.0.0.1:443",
  "singlelabel",
  "relay.example.com.",
  "-bad.example.com",
  "bad-.example.com",
  "réläy.example.com",
  "relay .example.com",
  "",
  "   ",
  `${"a".repeat(64)}.example.com`,
  `${"a".repeat(63)}.example.com`,
];

describe("relay URL canonicalization parity", () => {
  test("agrees with the runtime validator on edge cases", () => {
    for (const input of EDGE_CASES) {
      // Paired with the input so a failure names the case that broke.
      expect([input, canonicalRelayUrl(input)]).toEqual([
        input,
        validateRelayUrl(input),
      ]);
    }
  });

  // Real hostnames, in the three shapes the feed writes them in.
  test("agrees on every shipped relay, bare and with an explicit :443", () => {
    expect(GEO_RELAYS.length).toBeGreaterThan(100);

    for (const relay of GEO_RELAYS) {
      const bare = relay.url.replace(/^wss:\/\//, "");
      for (const shape of [relay.url, bare, `${bare}:443`]) {
        expect([shape, canonicalRelayUrl(shape)]).toEqual([
          shape,
          validateRelayUrl(shape),
        ]);
      }
    }
  });

  // If this fails, a cell's five slots are spent on fewer than five machines.
  test("collapses the shapes of a shipped relay to a single canonical URL", () => {
    for (const relay of GEO_RELAYS) {
      const bare = relay.url.replace(/^wss:\/\//, "");
      // Relays on a non-default port keep it, so :443 is not theirs to append.
      if (bare.includes(":")) continue;
      expect(canonicalRelayUrl(bare)).toBe(relay.url);
      expect(canonicalRelayUrl(`${bare}:443`)).toBe(relay.url);
      expect(canonicalRelayUrl(`wss://${bare}:443`)).toBe(relay.url);
    }
  });
});
