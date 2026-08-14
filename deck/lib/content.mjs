// Every word and number in the deck. Nothing else in deck/ writes copy.
//
// House style, same as press/lib/copy.mjs: plain words, short lines, no em
// dashes, no exclamation marks, no claim the slide beside it cannot back up.
// Read it out loud before committing it. If it sounds like a brochure, rewrite.
//
// External figures are dated and linked to the report they came from. Internal
// figures are countable from this repository, and deck/README.md says how.

const REPO = "https://github.com/areebahmeddd/airhop";

export const META = {
  version: "v1.0.0",
  codename: "Albatross",
  site: "airhop.1mindlabs.org",
  siteUrl: "https://airhop.1mindlabs.org",
  repo: "github.com/areebahmeddd/airhop",
  repoUrl: REPO,
  license: "MIT",
};

export const DOCS = {
  architecture: `${REPO}/blob/main/docs/spec/ARCHITECTURE.md`,
  protocols: `${REPO}/blob/main/docs/spec/PROTOCOLS.md`,
  roadmap: `${REPO}/blob/main/docs/design/ROADMAP.md`,
  progress: `${REPO}/blob/main/docs/dev/PROGRESS.md`,
};

export const STORES = [
  { label: "App Store", url: "https://apps.apple.com/app/airhop/id000000000" },
  {
    label: "Google Play",
    url: "https://play.google.com/store/apps/details?id=org.onemindlabs.airhop",
  },
  {
    label: "F-Droid",
    url: "https://f-droid.org/en/packages/org.onemindlabs.airhop",
  },
  { label: "APK", url: `${REPO}/releases/latest` },
];

// Short label for the slide, full citation for the speaker notes, and the link
// so nobody has to take a number on trust.
export const SOURCES = {
  accessnow: {
    label: "Access Now, Internet Shutdowns in 2025",
    url: "https://www.accessnow.org/campaign/keepiton/",
    cite: "Access Now and the #KeepItOn coalition, Internet Shutdowns in 2025, published 31 March 2026",
  },
  top10vpn: {
    label: "Top10VPN, Cost of Internet Shutdowns 2025",
    url: "https://www.top10vpn.com/research/cost-of-internet-shutdowns/",
    cite: "Top10VPN, The Global Cost of Internet Shutdowns 2025. 120,095 hours of disruption, $19.7bn",
  },
  itu: {
    label: "ITU, Facts and Figures 2025",
    url: "https://www.itu.int/itu-d/reports/statistics/facts-figures-2025/",
    cite: "ITU, Measuring Digital Development: Facts and Figures 2025, November 2025. 6.0bn online, 2.2bn offline",
  },
  nepal: {
    label: "BeInCrypto and Forbes, September 2025",
    url: "https://beincrypto.com/nepal-bitchat-downloads-protests-2025/",
    cite: "BeInCrypto and Forbes, September 2025, on bitchat installs during Nepal's social media ban. 48,781 on 8 September against fewer than 3,500 before it",
  },
  india: {
    label: "CoinDesk and MediaNama, July 2026",
    url: "https://www.coindesk.com/tech/2026/07/24/india-orders-takedown-of-jack-dorsey-s-bitcoin-linked-messaging-app-bitchat",
    cite: "CoinDesk and MediaNama, 24 July 2026, on the I4C notice covering bitchat, Briar and Bridgefy, and the GitHub takedown order",
  },
  fcc: {
    label: "FCC DIRS, 2024 hurricane reports",
    url: "https://www.fcc.gov/general/disaster-information-reporting-system-dirs-0",
    cite: "FCC Disaster Information Reporting System, Hurricane Helene and Milton communications status reports, 2024",
  },
  mesh: {
    label: "Research Nester, wireless mesh market",
    url: "https://www.researchnester.com/reports/wireless-mesh-network-market/5024",
    cite: "Research Nester and Business Research Insights, wireless mesh network market, 2026 to 2035",
  },
};

// Full citations appended to the note, so a question about a number is answered
// from the notes rather than from memory.
export function cite(note, keys) {
  return `${note}\n\nSources:\n${keys.map((k) => `- ${SOURCES[k].cite}. ${SOURCES[k].url}`).join("\n")}`;
}

// ---------------------------------------------------------------------------
// 01 Cover
// ---------------------------------------------------------------------------

export const COVER = {
  wordmark: "AIRHOP",
  title: "Messaging that works\nwithout the internet.",
  sub: "Nearby phones form a Bluetooth mesh and pass your messages along, up to seven hops, encrypted the whole way. No servers, no accounts, no tracking.",
  chips: ["Offline first", "No accounts", "No servers", "Open source"],
  foot: `${META.version} ${META.codename}  ·  iOS and Android  ·  ${META.license} licensed  ·  `,
};

// ---------------------------------------------------------------------------
// 02 Problem
// ---------------------------------------------------------------------------

export const PROBLEM = {
  eyebrow: "The problem",
  title: "Every messenger on your phone\nhas the same point of failure.",
  sub: "Signal, WhatsApp and Telegram are very good at what they do. None of them is built to work without a network, and all of them go quiet when one disappears. Governments switch it off, wars take it out, and storms knock it down.",
  stats: [
    {
      n: "313",
      unit: "shutdowns",
      line: "across 52 countries in 2025, with at least one running on any given day",
    },
    {
      n: "$19.7B",
      unit: "lost",
      line: "to deliberate shutdowns in 2025, up 156% on the year before",
    },
    {
      n: "2.2B",
      unit: "people",
      line: "have never been online at all, most of them rural and poor",
    },
  ],
  kicker:
    "Myanmar ordered 95 shutdowns last year. India ordered 65. Conflict caused another 125. Hurricane Helene took one Tennessee cell site in eight off the air.",
  sources: ["accessnow", "top10vpn", "itu", "fcc"],
};

// ---------------------------------------------------------------------------
// 03 Demand
// ---------------------------------------------------------------------------

export const DEMAND = {
  eyebrow: "Demand",
  title: "When it happens, people install\na mesh app the same day.",
  sub: "Nobody markets this category. There is no referral loop and no growth team. There are events, and the installs all arrive inside a day.",
  spike: {
    label: "bitchat installs in Nepal, September 2025",
    before: "3,500",
    beforeLabel: "before the ban",
    after: "48,781",
    afterLabel: "on 8 September, one day",
    note: "Roughly 39% of everything the app installed worldwide that day came from one country of 30 million people, four days after 26 platforms were blocked.",
  },
  proof: [
    { k: "360,000+", v: "installs worldwide by late September 2025" },
    { k: "53%", v: "of installs came from India in the 30 days to July 2026" },
    {
      k: "3 apps",
      v: "pulled from the Indian stores at once, and their repositories with them",
    },
  ],
  kicker:
    "On 24 July 2026 India's I4C gave GitHub three hours to take the bitchat repositories down, naming the app's ability to work during a shutdown as the reason. A category is real once someone tries to remove it.",
  sources: ["nepal", "india"],
};

// ---------------------------------------------------------------------------
// 04 Landscape
// ---------------------------------------------------------------------------

export const LANDSCAPE = {
  eyebrow: "Landscape",
  title: "Offline, hardware free and open\nis a short list.",
  sub: "Every app here is good at something. Only some keep working when the network stops, and fewer still run on a phone with nothing extra plugged into it.",
  head: [
    "Project",
    "Transport",
    "Encryption",
    "Offline",
    "No hardware",
    "Open",
  ],
  rows: [
    ["Signal", "Centralized servers", "Signal protocol", 0, 1, 1],
    ["Session", "Onion routing", "Session protocol", 0, 1, 1],
    ["Meshtastic", "LoRa radio", "AES-256 + Curve25519", 1, 0, 1],
    ["goTenna", "Proprietary sub-GHz radio", "AES-256 + ECC-384", 1, 0, 0],
    ["Bridgefy", "Bluetooth + WiFi", "Signal (libsignal)", 1, 1, 0],
    ["Briar", "Bluetooth + WiFi + Tor", "Bramble", 1, 1, 1],
    ["bitchat", "Bluetooth + Nostr", "Noise XX", 1, 1, 1],
    [
      "Airhop",
      "Bluetooth + WiFi + Nostr",
      "Noise XX + Double Ratchet",
      1,
      1,
      1,
    ],
  ],
  links: [
    "https://signal.org",
    "https://getsession.org",
    "https://meshtastic.org",
    "https://gotenna.com",
    "https://bridgefy.me",
    "https://briarproject.org",
    "https://bitchat.free",
    META.repoUrl,
  ],
  kicker:
    "Briar is Android and desktop only. Bridgefy is closed. bitchat is the one that is alive and growing, which is why Airhop joins its mesh instead of starting a second one.",
};

// ---------------------------------------------------------------------------
// 05 Product
// ---------------------------------------------------------------------------

export const PRODUCT = {
  eyebrow: "The product",
  title: "Shipped, on both stores,\nas an ordinary app.",
  sub: "Four tabs, no pairing screen, and no keys for anyone to get wrong. Install it and it is already looking for people.",
  screens: [
    {
      file: "radar",
      label: "Mesh",
      line: "Who is in range right now, placed by signal rather than distance.",
    },
    {
      file: "thread",
      label: "Direct message",
      line: "Encrypted by default. The phones relaying it carry it blind.",
    },
    {
      file: "wallet",
      label: "Wallet",
      line: "Hand ecash to the person beside you, neither phone online.",
    },
  ],
  next: "Next: v1.1 offline AI  ·  v1.8 SDK  ·  v1.9 external audit",
};

// ---------------------------------------------------------------------------
// 06 How it works
// ---------------------------------------------------------------------------

export const HOW = {
  eyebrow: "How it works",
  title: "The mesh forms itself.",
  sub: "Phones nearby find each other and pass messages along. Where there is internet, public Nostr relays carry the same conversation further, and not one of those relays is ours.",
  steps: [
    {
      n: "01",
      label: "Discover",
      line: "Phones running Airhop or bitchat find each other over Bluetooth. No pairing, no setup, no code to type.",
    },
    {
      n: "02",
      label: "Relay",
      line: "A message hops phone to phone, up to seven times, 30 to 50 m a hop. The phones in between never see what they carry.",
    },
    {
      n: "03",
      label: "Reach further",
      line: "With internet the same conversation carries over public Nostr relays, through Tor if you want it to.",
    },
  ],
  diagram: {
    caption: "BLE mesh · local peer to peer network",
    hop: "BLE RELAY, UP TO 7 HOPS",
    legend: [
      "Mesh node, offline",
      "Multi-hop relay, Noise XX encrypted",
      "bitchat on the same mesh",
      "Nostr bridge, when online",
    ],
  },
  facts:
    "One TypeScript protocol core with two thin native radios, so a fix lands on iOS and Android in the same commit. 189 source files, 125 test files, and no server anywhere in the delivery path.",
};

// ---------------------------------------------------------------------------
// 07 Security
// ---------------------------------------------------------------------------

export const SECURITY = {
  eyebrow: "Security",
  title: "Written against an attacker\nstanding next to you.",
  sub: "Assume the stranger in range is hostile. They can forge any header, replay anything they captured, invent as many identities as they like, and quietly drop whatever passes through their phone. All of this is built for that.",
  items: [
    {
      label: "Sessions",
      line: "Noise XX for mutual authentication and forward secrecy per session, the same handshake WireGuard uses.",
    },
    {
      label: "Messages",
      line: "Double Ratchet for forward secrecy per message, seeded from a secret only the two parties hold.",
    },
    {
      label: "Identity",
      line: "Every packet signed and checked before it is shown. A name comes from the key, so it cannot be taken.",
    },
    {
      label: "Seizure",
      line: "Nothing readable on disk, keys in the OS keychain, and a panic wipe that clears the phone in under a second.",
    },
  ],
  proof: {
    caption: "Tested by attacking it",
    stats: [
      { k: "70+", v: "scenarios across 11 tiers" },
      { k: "25", v: "phones in one simulated room" },
      { k: "17", v: "findings, 16 fixed, 1 accepted" },
    ],
    attacks: [
      ["Forged sender on a public channel", "Refused"],
      ["Announce rebinding a known peer's key", "Refused at three layers"],
      ["Sybil flood of invented peers", "Real neighbours never dropped"],
      ["Same ecash token spent twice", "Refused by a real mint"],
    ],
  },
  honest:
    "No outside audit yet, and no simulation can prove how a real radio behaves on real silicon. Both are what the ask is for.",
};

// ---------------------------------------------------------------------------
// 08 Wedge
// ---------------------------------------------------------------------------

export const WEDGE = {
  eyebrow: "Distribution",
  title: "The hard part of a mesh is the\nfirst user. We skip it.",
  sub: "Airhop speaks bitchat's wire protocol in both directions: the same Bluetooth service UUID, the same packet frame, the same peer ID, the same handshake.",
  spec: "SAME SERVICE UUID  ·  SAME PACKET FRAME  ·  SAME PEER ID",
  inherits: {
    caption: "What we inherit",
    points: [
      "The first Airhop install lands in a mesh that already has bitchat phones in it. It relays for them, they relay for it, and neither side is configured.",
      "Airhop's own packet types are ones bitchat forwards without reading, so a new feature never splits the network in two.",
      "Fixes found here have gone back upstream. A bigger shared mesh beats a larger slice of a small one.",
    ],
  },
  // Live voice and the bulletin board are bitchat's too, so they belong on the
  // left. What sits here is only what bitchat does not have.
  adds: {
    caption: "What we add",
    items: [
      {
        label: "User experience",
        line: "Nielsen's heuristics, Fitts, Hick and Jakob, on Apple HIG and Material",
        tag: "Shipped",
      },
      {
        label: "Offline money",
        line: "Cashu ecash phone to phone, with neither one online",
        tag: "Shipped",
      },
      {
        label: "Offline AI",
        line: "A small model on the device, no network call of any kind",
        tag: "v1.1.0",
      },
      {
        label: "Feature parity",
        line: "One core, so both platforms ship the same thing on the same day",
        tag: "Shipped",
      },
    ],
  },
  kicker:
    "Every other mesh messenger opens to an empty room. This one opens a door into a mesh that is already running.",
};

// ---------------------------------------------------------------------------
// 09 Market and model
// ---------------------------------------------------------------------------

export const MARKET = {
  eyebrow: "Market and model",
  title: "Sized from events,\nnot from a percentage.",
  sub: "There is no incumbent revenue here to take a slice of. What there is: a trigger that keeps recurring, a hardware market next door that is already funded, and almost nothing it costs to serve a user.",
  tiers: [
    {
      label: "Next door, funded",
      n: "$11.1B",
      line: "wireless mesh networking in 2026, reaching $27.0B by 2035 at 10.4% a year. Nearly all of it hardware. Airhop is the software half of the same problem.",
    },
    {
      label: "Reachable by an app",
      n: "6.0B",
      line: "people online, each already carrying the radio this needs. Nothing to buy, no plan to change, one install.",
    },
    {
      label: "Trigger, measured",
      n: "313",
      line: "shutdowns across 52 countries in 2025, before counting disasters, crowds and dead zones where the same thing happens with nobody ordering it.",
    },
  ],
  model: {
    caption: "How it pays for itself",
    streams: [
      {
        label: "SDK and custom builds",
        line: "@airhop/core on npm, PyPI and crates.io, plus paid builds for groups that need their own profile",
        tag: "v1.8.0",
      },
      {
        label: "Resilience deployments",
        line: "Response teams and municipalities, supported and configured rather than sold a licence",
        tag: "Pilot",
      },
      {
        label: "Sponsorship and grants",
        line: "Digital rights and press freedom funders already pay for work in this space",
        tag: "Now",
      },
    ],
    never:
      "No ads, no data to sell, no KYC, no telemetry. There is no infrastructure bill either, so one user and a million cost the same to serve.",
  },
  kicker:
    "The straight answer: nobody is paying $50 a year for this. The value sits in the protocol layer, and in being the app already on the phone when the network drops.",
  sources: ["mesh", "itu", "accessnow"],
};

// ---------------------------------------------------------------------------
// 10 Ask
// ---------------------------------------------------------------------------

export const ASK = {
  eyebrow: "The ask",
  title: "Fund the audit.\nOpen the distribution.",
  sub: "The product is shipped. What it needs next is the verification it cannot give itself, and reach that one person cannot buy.",
  items: [
    {
      n: "01",
      label: "Two audits",
      line: "Cure53 or equivalent on the crypto and the key handling, a second firm on the radio and the Nostr bridge. Findings published whatever they say.",
    },
    {
      n: "02",
      label: "Hardware matrix",
      line: "A device lab across Pixel, Samsung and Xiaomi classes, plus iPhones, to prove on silicon what the simulation only models.",
    },
    {
      n: "03",
      label: "Distribution",
      line: "Response organizations, digital rights groups and press freedom funders already working in the 52 countries that went dark.",
    },
    {
      n: "04",
      label: "Contributors",
      line: "Ten language catalogs, the desktop and web targets, and the SDK. All of it scoped, none of it blocked.",
    },
  ],
  close: "When the network goes down, the mesh is still up.",
};

// ---------------------------------------------------------------------------
// Appendix
// ---------------------------------------------------------------------------

export const ARCH = {
  eyebrow: "Appendix · Architecture",
  title: "One protocol core.\nTwo thin native radios.",
  sub: "bitchat runs two native codebases that drift apart. Airhop keeps the whole protocol in TypeScript and lets the native side own nothing but the hardware.",
  doc: { label: "docs/spec/ARCHITECTURE.md", url: DOCS.architecture },
  layers: [
    {
      label: "Screens",
      items: ["Chats", "Mesh", "Wallet", "Profile"],
      note: "Hand-rolled four-tab shell, no navigation library",
    },
    {
      label: "Message router",
      items: ["Both radios", "Nostr", "Courier"],
      note: "Picks the transport, names the one it used, never assumes delivery",
    },
    {
      label: "Crypto engine",
      items: ["Noise XX", "Double Ratchet", "Ed25519", "HKDF"],
      note: "@noble primitives, Cure53 audited, pure TypeScript",
    },
    {
      label: "Transports",
      items: ["BLE mesh", "WiFi fast path", "Nostr relays"],
      note: "Bluetooth is the only one that needs no internet and the only one that crosses iOS and Android",
    },
    {
      label: "Native modules",
      items: ["BLE", "Voice", "WiFi Aware", "Tor"],
      note: "Swift and Kotlin, hardware only. None of them knows what a packet is",
    },
  ],
  facts: [
    { k: "189", v: "source files outside tests" },
    { k: "125", v: "test files, the protocol runs in CI with no phone" },
    { k: "0", v: "servers, ours or anyone's, in the delivery path" },
  ],
};

export const ROADMAP = {
  eyebrow: "Appendix · Roadmap",
  title: "Six versions done.\nTen written down.",
  sub: "The version targets have been in the repository since before the first line of code, and the audit at v1.9.0 is deliberately after the SDK, so the public API is inside its scope.",
  doc: { label: "docs/design/ROADMAP.md", url: DOCS.roadmap },
  done: [
    "v0.5 Foundation",
    "v0.6 Messaging",
    "v0.7 Nostr + voice",
    "v0.8 Ratchet",
    "v0.9 Wallet",
    "v1.0 Release",
  ],
  next: [
    {
      v: "v1.1",
      label: "Offline AI",
      line: "On-device model, no network call",
    },
    { v: "v1.2", label: "Plugins", line: "Bluesky, Mastodon, UPI, opt-in" },
    {
      v: "v1.3",
      label: "Ten languages",
      line: "Persian, Arabic, Hindi and more",
    },
    { v: "v1.4", label: "Web", line: "Nostr-only browser companion" },
    { v: "v1.5", label: "CLI", line: "Headless relay on a Raspberry Pi" },
    {
      v: "v1.6",
      label: "Watch",
      line: "watchOS and Wear OS, wipe on the wrist",
    },
    { v: "v1.7", label: "Desktop", line: "macOS first, Windows after" },
    { v: "v1.8", label: "SDK", line: "@airhop/core published, API frozen" },
    {
      v: "v1.9",
      label: "Audit",
      line: "Two firms, separate scopes, published",
    },
    { v: "v2.0", label: "Flagship", line: "Redesign, WCAG 2.1 AA, all public" },
  ],
  facts:
    "1,526 catalog strings with none hardcoded, 398 bundled relays, 125 test files, every security finding published. One maintainer, no company, no funding.",
};

export const RISKS = {
  eyebrow: "Appendix · Risks",
  title: "What could stop this,\nand what is already done about it.",
  sub: "Written the way the repository writes them, plainly and with the mitigation attached.",
  doc: { label: "docs/dev/PROGRESS.md", url: DOCS.progress },
  rows: [
    {
      risk: "Platform limits",
      detail:
        "A backgrounded iPhone is invisible to Android scanners. CoreBluetooth moves the service UUID into the advertisement overflow area and drops the name.",
      answer:
        "No app can fix that, so the UI says it rather than hiding it. Android keeps advertising through a foreground service, and links already open keep carrying traffic.",
    },
    {
      risk: "Regulatory pressure",
      detail:
        "Three mesh messengers were ordered off the Indian stores in July 2026, and the code repositories with them.",
      answer:
        "MIT source, F-Droid and a direct APK, and no company to serve a notice on. Delisting an app does not uninstall it, and it does not touch a mesh already running.",
    },
    {
      risk: "Unaudited crypto",
      detail:
        "The Noise state machine, the ratchet and the key boundaries have not been read by anyone outside this project.",
      answer:
        "Two independent audits scoped for v1.9.0, one for crypto and one for the radio and the bridge, with both reports published in full.",
    },
    {
      risk: "Density",
      detail:
        "A mesh with nobody else in it is an empty room, and that is the honest failure mode of every app in this category.",
      answer:
        "Wire compatibility with bitchat shares the installed base from the first day, and the Nostr bridge covers the case where nobody is nearby at all.",
    },
  ],
};

// Speaker notes. Written to be read out loud: what to say in an investor room,
// and what to say in a room that has never heard of Nostr.
export const NOTES = {
  cover:
    "Open cold. Airhop is a messenger that works with no internet at all. Nearby phones relay for each other over Bluetooth. Shipped, on both stores, MIT licensed, no company behind it yet.\n\nOne sentence if asked: it is what your phone does when the tower is gone.",
  problem:
    "Land the single point of failure. Signal is excellent and stops when the network stops. That is a design boundary, not a criticism, and this is the product for the other side of it.\n\nThe three numbers are 2025 and from primary sources, all linked on the slide. Do not round them up. The line at the bottom is there so nobody hears this as one country's politics.",
  demand:
    "The slide investors care about. Demand is real, measurable and event driven. Nepal went from three and a half thousand installs to nearly forty nine thousand in a day.\n\nThen the takedown. A government moving to remove the whole category is the strongest signal that the category works.",
  landscape:
    "Do not read the table row by row. Say the shape: internet-only apps stop when the internet stops, radio meshes need hardware nobody owns, and what is left is Bluetooth mesh on the phone people already carry.\n\nEvery project name is a link if someone wants to check.",
  product:
    "Hand the room something concrete after four slides of argument. These are real screens from the shipped build, and the download links work.\n\nIf you have the app on your phone, open the Mesh tab now.",
  how: "Three steps and one picture. Discover, relay, reach further. Seven hops at thirty to fifty metres, so roughly three hundred and fifty metres through a crowd.\n\nThe phones in between cannot read what they carry. That is the whole trust story in a sentence.",
  security:
    "Say the threat model out loud: anyone in range can transmit anything. Then the four answers, then the evidence underneath them.\n\nFinish on the honest line. No outside audit yet. Never soften that in a room, it is exactly what the ask pays for.",
  wedge:
    "The strategic slide, and the one they will remember. Every mesh app dies of the cold start. This one speaks bitchat's wire protocol, so install number one already has a network to join, and the right column is what it adds once it is in there.\n\nLive voice and the bulletin board are bitchat's work too. They are on the left for that reason, and saying so out loud is what makes the right column believable.\n\nOn user experience, if pushed: a privacy tool nobody can use protects nobody. Names are words rather than hex, the mesh shows you who is in range and how strong the signal is, a payment says which route carried it and whether you can take it back, and delivery is never claimed without an acknowledgement. Nielsen's heuristics, Fitts, Hick and Jakob, checked against Apple's HIG and Material, with an accessibility pass in v1.0 and WCAG 2.1 AA scheduled for v2.0.\n\nIf someone asks why not just contribute to bitchat: compatibility means we do not have to choose.",
  market:
    "Do not size this top down. Anchor on the mesh hardware market that is already funded, then point out the software half is unserved.\n\nCost first on the right: no infrastructure bill, so runway is engineer time and an audit. Leave the straight answer at the bottom on screen, it buys more credibility than a bigger number would.",
  ask: "Be specific and short. Two audits, a device lab, distribution partners, contributors. Name the audit first because everything after it is blocked on it.\n\nStop talking after the closing line. Leave the links up.",
  arch: "Appendix. Only open this if the room is technical or somebody asks how it is built.\n\nThe point in one line: bitchat runs two native codebases that drift, this runs one TypeScript core, so a protocol fix reaches both platforms in the same commit.",
  roadmap:
    "Appendix. Open it if someone asks what comes after v1.0.\n\nPoint at v1.8 and v1.9 in that order. The SDK ships first so that the public API is inside the audit scope rather than after it.",
  risks:
    "Appendix, and the one worth volunteering unprompted in a diligence conversation.\n\nLead with the platform limit nobody can fix. Volunteering that first is what makes the other three believable. Density is the real risk, and the answer is the wedge slide.",
};
