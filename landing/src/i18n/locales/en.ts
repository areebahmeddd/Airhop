export const strings = {
  "common.back_to_home": "Back to home",
  "common.last_updated": "Last updated: {date}",

  "nav.aria": "Main",
  "nav.home": "Airhop home",
  "nav.skip": "Skip to content",
  "nav.menu.open": "Open menu",
  "nav.menu.close": "Close menu",
  "nav.how_it_works": "How it works",
  "nav.architecture": "Architecture",
  "nav.faq": "FAQ",

  "footer.aria": "Footer",
  "footer.tagline": "Private mesh communication",
  "footer.credit": "© Made with {heart} by {author}",
  "footer.group.download": "Download",
  "footer.group.resources": "Resources",
  "footer.group.social": "Social",
  "footer.group.legal": "Legal",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Architecture",
  "footer.link.blogs": "Blogs",
  "footer.link.faq": "FAQ",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Terms of Service",
  "footer.link.privacy": "Privacy Policy",
  "footer.link.license": "Project License",

  "settings.theme.group": "Color theme",
  "settings.theme.light": "Light theme",
  "settings.theme.dark": "Dark theme",
  "settings.language.label": "Language",
  "settings.language.suggestion": "View this page in English",
  "settings.language.dismiss": "Dismiss",

  "home.hero.release": "Latest release",
  "home.hero.title": "Messaging that works without the internet.",
  "home.hero.body":
    "Nearby phones form a Bluetooth mesh and relay your messages up to seven hops, end to end encrypted. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "No servers",
  "home.hero.body.no_accounts": "no accounts",
  "home.hero.body.no_tracking": "no tracking",
  "home.hero.download": "Download the app",
  "home.hero.badges": "MIT licensed · Free and open source · Works with bitchat",
  "home.hero.group.mobile": "Mobile",
  "home.hero.group.desktop": "Desktop",
  "home.hero.option.f_droid": "Open source catalog",
  "home.hero.option.apk": "Direct download",
  "home.hero.option.soon": "Coming soon",

  "home.about.eyebrow": "What is Airhop",
  "home.about.title": "Most apps depend on a central server.",
  "home.about.sub":
    "A server can be surveilled, shut down, or blocked. Airhop does not have one, so there is no company to pressure and no service to close.",
  "home.about.card": "Technical overview",
  "home.about.link.mesh": "Bluetooth Low Energy mesh",
  "home.about.link.wire_protocol": "wire protocol",
  "home.about.body.built":
    "Airhop is an open-source iOS and Android app for private, peer-to-peer messaging over {mesh}. It is built on the foundation of {bitchat}, reusing its {wire_protocol} and security model, then extending it with offline {ecash} payments and offline AI. It works with zero internet connectivity, and messages relay automatically across nearby devices (roughly 10 to 30 meters per hop indoors, further in the open), up to 7 hops.",
  "home.about.body.identity":
    "Your identity is an {ed25519} key pair generated on your device and stored in {ios_keychain} or {android_keystore}. There are no accounts, no registrations, and nothing that touches any server, i.e. it can be used as a burner app that leaves nothing linking back to you once deleted.",
  "home.about.body.crypto":
    "Every session uses the {noise} protocol for an authenticated handshake. Stored messages use the {ratchet} algorithm, i.e. even if your device is compromised later, your past messages stay unreadable. Panic wipe destroys all keys and messages in under one second.",
  "home.about.body.internet":
    "When you and a contact are out of Bluetooth range, {nostr} relays serve as an internet bridge, using {nip17}-shaped gift-wrapped direct messages, so the mesh extends globally whenever both of you are online. {tor} support is also available on both iOS (via {arti}) and Android (via {orbot}).",
  "home.about.optional.title": "Airhop has optional features you can enable:",
  "home.about.optional.payments.label": "Offline Payments:",
  "home.about.optional.payments.body":
    "Send and receive payments over the mesh using the {cashu} protocol (Bitcoin only).",
  "home.about.optional.ai.label": "Offline AI:",
  "home.about.optional.ai.body":
    "A small on-device AI assistant that can answer important questions. All processing and data stay on your device.",
  "home.about.body.compatible":
    "Airhop is wire-compatible with bitchat. An Airhop device and a bitchat device on the same mesh discover each other automatically and can exchange messages and direct messages with zero configuration.",

  "home.situations.eyebrow": "When you need it",
  "home.situations.title": "For the day the network goes down.",
  "home.situations.sub":
    "Natural disasters, internet blackouts, mass protests, or an ordinary weekend out of range.",
  "home.situations.disaster.label": "Disaster",
  "home.situations.disaster.line":
    "Towers are down. A notice on the board reaches whoever walks past.",
  "home.situations.offgrid.label": "Off-grid",
  "home.situations.offgrid.line": "Two days into the trail. The last bar disappeared yesterday.",
  "home.situations.protest.label": "Protest",
  "home.situations.protest.line": "A QR code on a flyer opens an encrypted channel for the march.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "No signal at the grounds. Messages hop through strangers' phones.",

  "home.showcase.eyebrow": "See the app",
  "home.showcase.title": "An ordinary messenger, offline.",
  "home.showcase.sub":
    "Chats, channels, a wallet, and an identity. Familiar on the surface, with a mesh underneath doing the work.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Everyone in range, placed by how close they are. Nobody has to be added first.",
  "home.showcase.mesh.alt":
    "The Mesh screen of the Airhop app, showing four nearby peers arranged on a radar by signal strength.",
  "home.showcase.chats.title": "Chats",
  "home.showcase.chats.caption":
    "Ordinary conversations. The phones that pass each message along cannot open it.",
  "home.showcase.chats.alt":
    "A direct message conversation in Airhop during a power cut, relayed across three phones.",
  "home.showcase.channels.title": "Channels",
  "home.showcase.channels.caption":
    "Public rooms as small as one block or as wide as a region, open to anyone there.",
  "home.showcase.channels.alt":
    "The Chats screen of the Airhop app, listing public channels scoped to a block, neighborhood, city, and region.",
  "home.showcase.wallet.title": "Wallet",
  "home.showcase.wallet.caption":
    "Hand ecash to the person beside you over Bluetooth, with neither phone online.",
  "home.showcase.wallet.alt":
    "The wallet screen of the Airhop app, showing an ecash balance that can be sent over Bluetooth.",
  "home.showcase.identity.title": "Identity",
  "home.showcase.identity.caption":
    "No sign up, no phone number, no email. Just a key that never leaves this phone.",
  "home.showcase.identity.alt":
    "The profile screen of the Airhop app, showing an identity generated on the device with no account.",

  "home.how.eyebrow": "How it works",
  "home.how.title": "The mesh forms itself.",
  "home.how.sub":
    "Nearby nodes form a self-healing mesh over Bluetooth. When there is internet, Nostr relays extend it, with no infrastructure anyone controls.",
  "home.how.cta": "Read the full architecture",
  "home.how.discover.title": "Discover",
  "home.how.discover.line":
    "Phones running Airhop or bitchat find each other automatically over Bluetooth. No pairing, no setup.",
  "home.how.relay.title": "Relay",
  "home.how.relay.line":
    "A message hops phone to phone, up to seven hops. The phones in between never see what they carry.",
  "home.how.reach.title": "Reach further",
  "home.how.reach.line":
    "When there is internet, Nostr relays carry the same conversation further, optionally routed through Tor.",
  "home.how.swipe": "swipe to explore",
  "home.how.diagram": "BLE mesh · local peer-to-peer network",
  "home.how.legend.node": "BLE mesh node (offline)",
  "home.how.legend.relay": "Multi-hop relay (Noise XX encrypted)",
  "home.how.legend.bitchat": "bitchat compatible on the same mesh",
  "home.how.legend.nostr": "Nostr bridge (internet, when online)",

  "home.map.aria": "World map of Nostr relay locations",
  "home.map.summary": "Nostr bridge · {relays} across {locations} worldwide",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "What it does",
  "home.features.title": "A real messenger, not a demo.",
  "home.features.sub":
    "Chat, identity, networking, and money. All of it built to work with no signal, no account, and nothing in the middle.",

  "home.features.messaging.title": "Messaging",
  "home.features.messaging.summary":
    "Everything a messenger has, with zero infrastructure behind it.",
  "home.features.messaging.dms.name": "Private DMs",
  "home.features.messaging.dms.line": "End to end encrypted, with delivery and read receipts.",
  "home.features.messaging.location.name": "Location channels",
  "home.features.messaging.location.line": "Rooms tied to a place, from one block to a region.",
  "home.features.messaging.groups.name": "Private channels and groups",
  "home.features.messaging.groups.line": "Invite links for a room, or a signed list of up to 16.",
  "home.features.messaging.board.name": "Bulletin board",
  "home.features.messaging.board.line": "Notices pinned to an area for up to seven days.",
  "home.features.messaging.voice.name": "Live voice",
  "home.features.messaging.voice.line":
    "Hold the mic and talk to anyone in range, walkie-talkie style.",
  "home.features.messaging.notes.name": "Voice notes",
  "home.features.messaging.notes.line": "Recorded audio, faster than typing directions.",
  "home.features.messaging.files.name": "Photos, video and files",
  "home.features.messaging.files.line": "Any format, up to 1 MB, with no signal needed.",
  "home.features.messaging.forward.name": "Store-and-forward",
  "home.features.messaging.forward.line":
    "Sealed and carried by a nearby phone until it reaches them.",

  "home.features.identity.title": "Identity",
  "home.features.identity.summary": "Nothing to register, nothing to seize.",
  "home.features.identity.keys.name": "Key pair identity",
  "home.features.identity.keys.line": "Made on this phone, stored in the OS keychain.",
  "home.features.identity.names.name": "Human-readable names",
  "home.features.identity.names.line": "Derived from your key, so nobody can take yours.",
  "home.features.identity.qr.name": "QR contacts",
  "home.features.identity.qr.line": "One scan carries their keys, not just their name.",
  "home.features.identity.panic.name": "Panic wipe",
  "home.features.identity.panic.line": "Every key and message destroyed in under a second.",

  "home.features.networking.title": "Networking",
  "home.features.networking.summary": "The phones are the network.",
  "home.features.networking.mesh.name": "Bluetooth mesh",
  "home.features.networking.mesh.line": "No internet, no router, on phones people already own.",
  "home.features.networking.bridge.name": "Mesh bridge",
  "home.features.networking.bridge.line":
    "Links your public chat with a nearby crowd out of range.",
  "home.features.networking.wifi.name": "WiFi fast path",
  "home.features.networking.wifi.line": "Faster transfers between two Androids or two iPhones.",
  "home.features.networking.bitchat.name": "bitchat compatible",
  "home.features.networking.bitchat.line": "Both apps join the same mesh with no setup.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "An extension, never a requirement.",
  "home.features.internet.nostr.name": "Nostr fallback",
  "home.features.internet.nostr.line": "DMs and location channels keep flowing beyond radio range.",
  "home.features.internet.relays.name": "Geo-relay discovery",
  "home.features.internet.relays.line": "300+ independent public relays, none of them ours.",
  "home.features.internet.gateway.name": "Internet gateway",
  "home.features.internet.gateway.line":
    "Lend your connection so a nearby offline phone reaches location channels.",
  "home.features.internet.tor.name": "Tor integration",
  "home.features.internet.tor.line": "Routed on both platforms, so relays never see your IP.",

  "home.features.optional.title": "Optional",
  "home.features.optional.summary": "Off by default. On when you want it.",
  "home.features.optional.cashu.name": "Cashu ecash",
  "home.features.optional.cashu.line": "Pay the person beside you with neither phone online.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line":
    "Top up or cash out in bitcoin over the Lightning network.",
  "home.features.optional.ai.name": "Local AI",
  "home.features.optional.ai.line": "On-device answers, nothing leaves the phone.",
  "home.features.optional.social.name": "Social bridges",
  "home.features.optional.social.line": "Bluesky and Mastodon with the same identity.",

  "home.compare.eyebrow": "How it compares",
  "home.compare.title": "Offline, hardware-free, and open.",
  "home.compare.sub":
    "Every app here is good at something. Only some of them still work when the network does not.",
  "home.compare.col.project": "Project",
  "home.compare.col.transport": "Transport",
  "home.compare.col.encryption": "Encryption",
  "home.compare.col.offline": "Works offline",
  "home.compare.col.hardware_free": "Hardware-free",
  "home.compare.col.open_source": "Open source",
  "home.compare.mark.yes": "Yes",
  "home.compare.mark.no": "No",
  "home.compare.mark.partial": "Partial, clients are open source, servers are not",
  "home.compare.mark.partial_hint": "Clients are open source, servers are not",
  "home.compare.transport.servers": "Centralized servers",
  "home.compare.transport.onion": "Onion routing (service nodes)",
  "home.compare.transport.nostr": "Nostr relays",
  "home.compare.transport.lora": "LoRa radio",
  "home.compare.transport.sub_ghz": "Proprietary sub-GHz radio",

  "home.explore.eyebrow": "Open and honest",
  "home.explore.title": "Every claim here is checkable.",
  "home.explore.sub":
    "The code, protocol, and plans are public. So are the limitations. Check them yourself before taking our word for it.",
  "home.explore.audit.chip": "Audit pending",
  "home.explore.audit.headline": "Airhop has not yet had an external security audit.",
  "home.explore.audit.body":
    "{headline} All code is personally reviewed and run through a {review} before shipping, and the cryptographic library it uses is Cure53 audited, but that is not a substitute for a formal audit of the app itself. One is planned for {version}. Do not rely on it for sensitive use cases until then.",
  "home.explore.audit.link.review": "security review agent",
  "home.explore.source.title": "Source code",
  "home.explore.source.desc":
    "Everything on GitHub under MIT. Issues, pull requests, and discussions open.",
  "home.explore.protocol.title": "Protocol spec",
  "home.explore.protocol.desc":
    "The exact wire format, BLE UUIDs, and constants, shared with bitchat.",
  "home.explore.architecture.title": "Architecture",
  "home.explore.architecture.desc":
    "The full technical breakdown, from tapping send to the bytes on the radio.",
  "home.explore.roadmap.title": "Roadmap",
  "home.explore.roadmap.desc":
    "Version targets from v0.5.0 to v2.0.0, including the planned audit.",
  "home.explore.vision.title": "Vision",
  "home.explore.vision.desc":
    "Why Airhop exists, and the principles that do not change under pressure.",
  "home.explore.brand.title": "Brand kit",
  "home.explore.brand.desc": "The pixel bird, color and type tokens, press assets and boilerplate.",

  "home.contribute.eyebrow": "Support this project",
  "home.contribute.title": "Independent, and in the open.",
  "home.contribute.sub":
    "There are no investors, no ads, and no paid tier. Every feature stays free either way, and the work is funded by the people who find it useful.",
  "home.contribute.contribute.chip": "Contribute",
  "home.contribute.contribute.body":
    "Star the repo, open issues, and submit pull requests. Bug reports, feature proposals, and code contributions are all welcome.",
  "home.contribute.contribute.cta": "View on GitHub",
  "home.contribute.sponsor.chip": "Sponsor",
  "home.contribute.sponsor.body":
    "If Airhop is useful to you, a one-time donation or a recurring sponsorship goes a long way toward keeping development active.",
  "home.contribute.sponsor.donate": "Donate once",
  "home.contribute.sponsor.github": "Sponsor on GitHub",

  "page.architecture.eyebrow": "Documentation",
  "page.architecture.title": "Architecture",
  "page.architecture.toc": "On this page",

  "page.faq.eyebrow": "FAQ",
  "page.faq.title": "Frequently asked questions",
  "page.faq.meta": "Common questions about Airhop.",
  "page.faq.contact":
    "Questions not answered here can be sent to {email} or raised by opening a discussion on {github}.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Coming soon",
  "page.blogs.body": "Writing on mesh networking, privacy, and offline-first software.",

  "page.brand.eyebrow": "Brand",
  "page.brand.title": "Brand Kit",
  "page.brand.meta":
    "Assets and rules for putting Airhop in an article, a store listing, a talk or a README. Free to use for reference and press.",

  "page.legal.eyebrow": "Legal",
  "page.privacy.title": "Privacy Policy",
  "page.terms.title": "Terms of Service",

  "page.notfound.title": "Page not found",
  "page.notfound.body": "The page you are looking for does not exist or has been moved.",

  "page.english_only": "This page is available in English only.",

  "seo.breadcrumb.home": "Home",

  "seo.home.title": "Airhop — Private, offline-first messenger",
  "seo.home.description":
    "Private peer-to-peer messaging for iOS and Android. No internet, no servers, no accounts. Communicate over Bluetooth mesh anywhere.",

  "seo.architecture.title": "Architecture — Airhop",
  "seo.architecture.description":
    "How Airhop works, top to bottom: identity, transport selection, the Bluetooth mesh, encryption, the internet layer, Tor, offline ecash, on-device AI, and the bitchat-compatible wire format.",
  "seo.architecture.breadcrumb": "Architecture",
  "seo.architecture.headline": "Airhop Architecture",
  "seo.architecture.summary":
    "A full technical breakdown of Airhop: identity, transports, the Bluetooth mesh, encryption, the Nostr internet layer, Tor, the Cashu wallet, the on-device AI assistant, and the wire format.",

  "seo.faq.title": "Frequently Asked Questions — Airhop",
  "seo.faq.description":
    "Answers about Airhop's Bluetooth mesh messaging, encryption, offline payments, the Nostr internet layer, and bitchat compatibility.",
  "seo.faq.breadcrumb": "FAQ",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description": "Writing on mesh networking, privacy, and offline-first software.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Brand Kit — Airhop",
  "seo.brand.description":
    "The Airhop brand kit: the pixel bird mark, the wordmark, colour and type tokens, press assets and boilerplate.",
  "seo.brand.breadcrumb": "Brand Kit",

  "seo.privacy.title": "Privacy Policy — Airhop",
  "seo.privacy.description":
    "How Airhop handles data: no accounts, no servers, no tracking. Your identity and messages stay on your device.",
  "seo.privacy.breadcrumb": "Privacy Policy",

  "seo.terms.title": "Terms of Service — Airhop",
  "seo.terms.description": "Terms governing use of the Airhop app and website.",
  "seo.terms.breadcrumb": "Terms of Service",

  "seo.notfound.title": "Page Not Found — Airhop",
  "seo.notfound.description": "The page you are looking for does not exist or has been moved.",
};

export const plurals = {
  "home.map.relays": {
    one: "{count} relay",
    other: "{count} relays",
  },
  "home.map.locations": {
    one: "{count} location",
    other: "{count} locations",
  },
};

export const en = { strings, plurals };
