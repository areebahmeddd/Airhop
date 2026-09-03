/* Airhop KT manual: shared navigation.
   One manifest, injected into every page, so a chapter is added in one place. */

const KT_MANIFEST = [
  {
    part: "Orientation",
    items: [
      {
        n: "00",
        f: "index.html",
        t: "Start here",
        d: "How to read this manual, and the sixty second version of Airhop.",
      },
      {
        n: "01",
        f: "01-what-is-airhop.html",
        t: "What Airhop is",
        d: "The mission, the three layers, and the whole feature inventory.",
      },
      {
        n: "02",
        f: "02-repo-map.html",
        t: "Repository map",
        d: "Every folder and every important file, and what owns what.",
      },
      {
        n: "03",
        f: "03-user-flows.html",
        t: "User flows",
        d: "First launch to panic wipe, traced end to end.",
      },
    ],
  },
  {
    part: "Foundations",
    items: [
      {
        n: "04",
        f: "04-networking.html",
        t: "Networking from scratch",
        d: "Bits to the internet: IP, TCP, ports, DNS, mDNS, LAN, WAN, NAT.",
      },
      {
        n: "05",
        f: "05-keys.html",
        t: "Keys, from zero",
        d: "What a public key actually is, and how signing and agreement work.",
      },
      {
        n: "06",
        f: "06-algorithms.html",
        t: "The algorithm graveyard",
        d: "AES, RSA, SHA-1, ECDSA and the rest. What broke, and what replaced it.",
      },
    ],
  },
  {
    part: "The physical layer",
    items: [
      {
        n: "07",
        f: "07-radio.html",
        t: "Radio, from scratch",
        d: "Waves, spectrum, power, range, antennas, interference.",
      },
      {
        n: "08",
        f: "08-ble.html",
        t: "Bluetooth Low Energy",
        d: "GAP, GATT, ATT, advertising, MTU, dual role, platform quirks.",
      },
    ],
  },
  {
    part: "The protocol",
    items: [
      {
        n: "09",
        f: "09-wire-format.html",
        t: "Wire format",
        d: "The packet frame, TLV, padding, compression, packet IDs, signing.",
      },
      {
        n: "10",
        f: "10-fragmentation.html",
        t: "Fragmentation",
        d: "Splitting a file into 467 byte frames and putting it back together.",
      },
      {
        n: "11",
        f: "11-routing.html",
        t: "Flood routing",
        d: "TTL, dedup, jitter, fanout, source routes, and why seven hops.",
      },
      {
        n: "12",
        f: "12-gossip-sync.html",
        t: "Gossip sync",
        d: "Golomb coded sets, set reconciliation, and catching up after a gap.",
      },
      {
        n: "13",
        f: "13-courier.html",
        t: "Courier and DTN",
        d: "Store and forward, spray and wait, recipient tags, prekeys.",
      },
      {
        n: "14",
        f: "14-peers-queues.html",
        t: "Peers, sessions and queues",
        d: "The registry, reachability versus identity, the outbox, every store.",
      },
      {
        n: "15",
        f: "15-mesh-service.html",
        t: "The mesh service",
        d: "The composition root: what it owns, its lifecycle, one packet traced.",
      },
    ],
  },
  {
    part: "Cryptography and identity",
    items: [
      {
        n: "16",
        f: "16-primitives.html",
        t: "Crypto primitives",
        d: "Curves, AEAD, hashes, HKDF, nonces, and what each one buys.",
      },
      {
        n: "17",
        f: "17-noise.html",
        t: "The Noise protocol",
        d: "XX and X, message by message, with the state machine spelled out.",
      },
      {
        n: "18",
        f: "18-forward-secrecy.html",
        t: "Forward secrecy",
        d: "Double Ratchet, X3DH, prekeys, and what each property really means.",
      },
      {
        n: "19",
        f: "19-protocol-comparison.html",
        t: "Messaging protocols compared",
        d: "Signal, MLS, Bramble, Scuttlebutt, OTR, Megolm, Session, MTProto.",
      },
      {
        n: "20",
        f: "20-identity.html",
        t: "Identity and trust",
        d: "Peer IDs, TOFU, QR, safety numbers, and impersonation in practice.",
      },
      {
        n: "21",
        f: "21-contacts.html",
        t: "Contacts, cards and codes",
        d: "Three QR formats, five ways a contact arrives, and the merge policy.",
      },
    ],
  },
  {
    part: "Rooms and places",
    items: [
      {
        n: "22",
        f: "22-rooms-board.html",
        t: "Rooms and the board",
        d: "Four kinds of room, and signed notices that outlive the conversation.",
      },
      {
        n: "23",
        f: "23-location.html",
        t: "Location and geohash",
        d: "Cells, precision, teleport, presence, place names, and the privacy line.",
      },
    ],
  },
  {
    part: "The internet layer",
    items: [
      {
        n: "24",
        f: "24-nostr.html",
        t: "Nostr",
        d: "Events, relays, NIPs, gift wrap, geohash rooms, proof of work.",
      },
      {
        n: "25",
        f: "25-tor.html",
        t: "Tor",
        d: "One embedded Arti client on both platforms, and why it cannot leak.",
      },
      {
        n: "26",
        f: "26-bridges.html",
        t: "Bridges and pluggable transports",
        d: "obfs4, Snowflake, and working where the network blocks Tor.",
      },
      {
        n: "27",
        f: "27-gateway-bridge.html",
        t: "Gateway and bridge",
        d: "Lending a connection, and stitching two mesh islands together.",
      },
    ],
  },
  {
    part: "Media and transports",
    items: [
      {
        n: "28",
        f: "28-transports.html",
        t: "Transport selection",
        d: "Bluetooth, WiFi Aware, LAN, Nostr, courier, and how one is picked.",
      },
      {
        n: "29",
        f: "29-lan.html",
        t: "The LAN transport",
        d: "mDNS discovery, the dial ring, rotating names, and consent.",
      },
      {
        n: "30",
        f: "30-media.html",
        t: "Files and media",
        d: "Caps, MIME, magic bytes, pacing, private media, retention.",
      },
      {
        n: "31",
        f: "31-voice.html",
        t: "Live voice",
        d: "AAC, burst packets, jitter buffers, and walkie talkie over a mesh.",
      },
    ],
  },
  {
    part: "Money",
    items: [
      {
        n: "32",
        f: "32-cashu.html",
        t: "Cashu ecash",
        d: "Blind signatures, BDHKE, proofs, DLEQ, mints, and the NUTs.",
      },
      {
        n: "33",
        f: "33-wallet-ops.html",
        t: "Wallet operations",
        d: "Mint, melt, swap, send, reclaim, recover, nutzap, consolidate.",
      },
      {
        n: "34",
        f: "34-custody.html",
        t: "Custody and the nutzap flow",
        d: "Custodial or not, answered precisely. NIP-60, NIP-61, traced.",
      },
    ],
  },
  {
    part: "The device",
    items: [
      {
        n: "35",
        f: "35-storage-panic.html",
        t: "Storage and panic wipe",
        d: "Keychain, Keystore, MMKV, and destroying everything in one second.",
      },
      {
        n: "36",
        f: "36-platform.html",
        t: "Platform and native",
        d: "Native modules, background execution, permissions, power policy.",
      },
      {
        n: "37",
        f: "37-permissions.html",
        t: "Permissions and consent",
        d: "Six permissions, three states, and why the mesh never waits on a dialog.",
      },
      {
        n: "38",
        f: "38-power-radiation.html",
        t: "Battery, power and radiation",
        d: "Four power modes, hysteresis, OEM battery killers, and what BLE emits.",
      },
      {
        n: "39",
        f: "39-build-system.html",
        t: "The build system",
        d: "Expo, Metro, knip, lockfiles, scripts, CI, release, test vectors.",
      },
      {
        n: "40",
        f: "40-i18n.html",
        t: "Localization",
        d: "Thirty five languages, plural rules, RTL, and bidi isolation.",
      },
      {
        n: "41",
        f: "41-ui-ux.html",
        t: "Interface and UX",
        d: "The tab machine, honest status, and the rules behind the screens.",
      },
      {
        n: "42",
        f: "42-design-system.html",
        t: "The design system",
        d: "Tokens, the laws behind every value, and the apps this borrows from.",
      },
    ],
  },
  {
    part: "Adversaries and proof",
    items: [
      {
        n: "43",
        f: "43-threat-model.html",
        t: "Threat model",
        d: "Sybil, flooding, replay, impersonation, seizure, traffic analysis.",
      },
      {
        n: "44",
        f: "44-testing.html",
        t: "Testing and simulation",
        d: "The multi device simulator, invariants, chaos seeds, coverage.",
      },
      {
        n: "45",
        f: "45-scaling.html",
        t: "Scale and chaos",
        d: "Airtime maths, crowd density, capacity curves, failure behaviour.",
      },
    ],
  },
  {
    part: "The wider world",
    items: [
      {
        n: "46",
        f: "46-bitchat.html",
        t: "Airhop vs bitchat",
        d: "Shared wire, deliberate divergences, and the compatibility contract.",
      },
      {
        n: "47",
        f: "47-lora-hardware.html",
        t: "LoRa and hardware",
        d: "Meshtastic, Bitle, ESP32, chirp spread spectrum, antennas, law.",
      },
      {
        n: "48",
        f: "48-fediverse.html",
        t: "Fediverse and AT Protocol",
        d: "How federation works, and what bridging Airhop into it means.",
      },
    ],
  },
  {
    part: "Verdict",
    items: [
      {
        n: "49",
        f: "49-review.html",
        t: "Engineering review",
        d: "Is it doable, does it make sense, is it worth it. Findings and risks.",
      },
      {
        n: "50",
        f: "50-drills.html",
        t: "Glossary and drills",
        d: "Every term, and the questions you should be able to answer cold.",
      },
    ],
  },
];

(function () {
  const flat = KT_MANIFEST.flatMap((g) => g.items);
  const here = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();
  const idx = flat.findIndex((i) => i.f.toLowerCase() === here);

  const side = document.querySelector(".kt-side");
  if (side) {
    const brandHref = here === "index.html" ? "#top" : "index.html";
    side.innerHTML =
      '<a class="kt-brand" href="' +
      brandHref +
      '"><span class="kt-brand-mark">/\\_\n\\__)</span><span><span class="kt-brand-name">Airhop KT</span><span class="kt-brand-sub">Maintainer manual</span></span></a>' +
      '<button class="kt-toggle" type="button" aria-expanded="true">Contents</button>' +
      '<input class="kt-search" type="search" placeholder="Filter chapters" aria-label="Filter chapters" />' +
      '<nav class="kt-nav" aria-label="Chapters">' +
      KT_MANIFEST.map(
        (g) =>
          '<div class="kt-nav-part">' +
          g.part +
          "</div><ol>" +
          g.items
            .map(
              (i) =>
                '<li><a href="' +
                i.f +
                '"' +
                (i.f.toLowerCase() === here ? ' aria-current="page"' : "") +
                '><span class="kt-num">' +
                i.n +
                "</span><span>" +
                i.t +
                "</span></a></li>",
            )
            .join("") +
          "</ol>",
      ).join("") +
      "</nav>";

    const toggle = side.querySelector(".kt-toggle");
    toggle.addEventListener("click", function () {
      const collapsed = side.getAttribute("data-collapsed") === "true";
      side.setAttribute("data-collapsed", collapsed ? "false" : "true");
      toggle.setAttribute("aria-expanded", collapsed ? "true" : "false");
    });
    if (window.matchMedia("(max-width: 980px)").matches) {
      side.setAttribute("data-collapsed", "true");
      toggle.setAttribute("aria-expanded", "false");
    }

    const search = side.querySelector(".kt-search");
    search.addEventListener("input", function () {
      const q = search.value.trim().toLowerCase();
      side.querySelectorAll(".kt-nav li").forEach(function (li) {
        const text = li.textContent.toLowerCase();
        li.style.display = q === "" || text.indexOf(q) !== -1 ? "" : "none";
      });
      side.querySelectorAll(".kt-nav ol").forEach(function (ol) {
        const any = Array.from(ol.children).some(function (li) {
          return li.style.display !== "none";
        });
        ol.style.display = any ? "" : "none";
        const head = ol.previousElementSibling;
        if (head && head.classList.contains("kt-nav-part"))
          head.style.display = any ? "" : "none";
      });
    });
  }

  const main = document.querySelector(".kt-main");
  if (main && idx >= 0 && !main.querySelector(".chapter-nav")) {
    const prev = flat[idx - 1];
    const next = flat[idx + 1];
    if (prev || next) {
      const nav = document.createElement("div");
      nav.className = "chapter-nav";
      nav.innerHTML =
        (prev
          ? '<a href="' +
            prev.f +
            '"><span class="dir">Previous</span><span class="ttl">' +
            prev.n +
            " " +
            prev.t +
            "</span></a>"
          : "<span></span>") +
        (next
          ? '<a class="next" href="' +
            next.f +
            '"><span class="dir">Next</span><span class="ttl">' +
            next.n +
            " " +
            next.t +
            "</span></a>"
          : "<span></span>");
      main.appendChild(nav);
    }
  }

  const cards = document.querySelector("[data-kt-cards]");
  if (cards) {
    cards.innerHTML = KT_MANIFEST.map(
      (g) =>
        '<h3 id="part-' +
        g.part.toLowerCase().replace(/[^a-z]+/g, "-") +
        '">' +
        g.part +
        '</h3><div class="card-grid">' +
        g.items
          .map(
            (i) =>
              '<a class="card" href="' +
              i.f +
              '"><span class="n">' +
              i.n +
              '</span><div class="t">' +
              i.t +
              '</div><div class="d">' +
              i.d +
              "</div></a>",
          )
          .join("") +
        "</div>",
    ).join("");
  }
})();
