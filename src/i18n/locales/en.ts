// English: the source of truth for every other locale.
//
// This file declares the keys. `locales/types.ts` derives `TranslationKey` and
// `PluralKey` from it, and any locale added later is annotated with those
// types, so adding a key here is a compile error in that locale until it is
// filled in. There is no runtime fallback because a partial locale cannot be
// constructed.
//
// English is the language shipping today; ten land in v1.3.0. This file earns
// its place either way: it is what makes every string in the app greppable,
// reviewable in one diff, and consistent in wording, and it is the reason a
// second language is a new file rather than a sweep of ninety screens.
//
// Key naming
// ----------
// Flat dotted keys, `<area>.<screen>.<thing>`. Where a concept also exists in
// bitchat, the key deliberately matches the one in
// `bitchat/ios/bitchat/Localizable.xcstrings`. bitchat is public domain and
// ships 30 languages, so a matching key is a translation that can be lifted
// rather than commissioned, and it lets the @upstream-sync agent diff the two
// key sets when bitchat ships new copy.
//
// What must never appear here
// ---------------------------
// Anything that crosses the wire or derives an identity. See
// `docs/spec/ARCHITECTURE.md` and the guard in `__tests__/catalog.test.ts`:
//   - the adjective/noun word lists in utils/username.ts (identity derivation)
//   - the transmitted `/hug` and `/slap` emote text (bitchat matches it as an
//     English substring on receipt)
//   - slash command tokens, channel names, geohashes
//   - user content of any kind
//   - licence texts
// Localise the hint that describes a command, never the command.

export const strings = {
  // ---- Common vocabulary --------------------------------------------------
  // Words that appear on more than one screen. A word used once belongs in its
  // screen's namespace instead: "common" is not a dumping ground, it is the
  // set of terms that must read identically everywhere.
  //
  // Defining the shared vocabulary in one place is what stops "Cancel" being
  // keyed five different ways in five files. Every key here is referenced;
  // `npm run i18n:audit -- --unused` reports any that stop being, and an
  // orphan should be deleted rather than left for a translator to work on.
  "common.cancel": "Cancel",
  "common.done": "Done",
  "common.ok": "OK",
  "common.close": "Close",
  "common.back": "Back",
  "common.delete": "Delete",
  "common.remove": "Remove",
  "common.add": "Add",
  "common.copy": "Copy",
  "common.copied": "Copied",
  "common.share": "Share",
  "common.continue": "Continue",
  "common.settings": "Settings",
  "common.off": "Off",

  // ---- Dates and times ----------------------------------------------------
  // Used by utils/format.ts. The rest of a timestamp comes from Intl, which
  // gets the month and weekday names right for every locale on its own; only
  // these two are words rather than calendar data.
  "format.today": "Today",
  "format.yesterday": "Yesterday",

  // ---- App shell: tabs, headers, search -----------------------------------
  "nav.tab.chats": "Chats",
  "nav.tab.mesh": "Mesh",
  "nav.tab.wallet": "Wallet",
  // The profile tab. "You" rather than "Profile" or "Settings": it is the one
  // tab that is about the person holding the phone.
  "nav.tab.profile": "You",
  "nav.notifications": "Notifications",

  "chat.subtab.rooms": "Rooms",
  "chat.subtab.dms": "Direct messages",
  "chat.search.placeholder": "Search chats",
  // The placeholder disappears the moment there is a query, so the field needs
  // a label of its own for a screen reader landing on a half-typed search.
  "chat.search.a11y": "Search chats and messages",
  "chat.search.close": "Close search",
  "chat.search.clear": "Clear search",

  "mesh.view.radar": "Radar view",
  "mesh.view.list": "List view",

  // ---- Legal document names -----------------------------------------------
  // Named once because they appear as a settings row, an inline link in the
  // consent line, and a screen title, and must read identically in all three.
  "legal.terms": "Terms of Service",
  "legal.privacy": "Privacy Policy",

  // ---- Onboarding: welcome ------------------------------------------------
  // The wordmark itself ("airhop") is never translated or transliterated: it is
  // the product name, and it is drawn as part of the brand mark.
  "onboarding.welcome.tagline": "Private mesh communication.",
  "onboarding.welcome.cta": "Get started",
  // Read out when focus lands on a disabled button. A dimmed control with no
  // stated reason is a dead end for a screen-reader user.
  "onboarding.welcome.cta_hint": "Agree to the terms below to continue",
  "onboarding.welcome.consent_a11y":
    "Agree to the Terms of Service and Privacy Policy",
  "onboarding.welcome.open_terms": "Open Terms of Service",
  "onboarding.welcome.open_privacy": "Open Privacy Policy",
  // One sentence with three substitutions, not three concatenated fragments:
  // word order moves in every language, and the two links have to be able to
  // move with it. `{cta}` is the button's own label, so the two stay in step.
  // See i18n/rich-text.tsx.
  "onboarding.welcome.consent":
    "By tapping {cta}, you agree to our {terms} and {privacy}.",

  // ---- Onboarding: identity generation ------------------------------------
  "onboarding.identity.heading": "Generating your identity",
  // The line break is deliberate: two short statements, the second of which is
  // the reassuring one and should not be buried mid-paragraph. Translators may
  // move it, and may drop it if their wording does not need it.
  "onboarding.identity.body":
    "Creating an Ed25519 key pair on this device.\nNothing is sent anywhere.",
  // The four steps are read as one element rather than four stops. `{steps}` is
  // the joined list.
  "onboarding.identity.steps_a11y": "Steps: {steps}",
  // These render in the monospace face, which is a deliberate terminal-log
  // look. Cryptosystem names (X25519, Ed25519) stay Latin in every language,
  // and the surrounding words fall back per glyph on both platforms where the
  // bundled font has no coverage. Worth knowing if this screen is ever
  // redesigned: it is the one place translated prose is set in mono.
  "onboarding.identity.step.x25519": "Generating X25519 static key pair",
  "onboarding.identity.step.ed25519": "Generating Ed25519 signing key pair",
  "onboarding.identity.step.keychain": "Storing keys in OS Keychain",
  "onboarding.identity.step.peer_id": "Deriving peer ID",

  // ---- Onboarding: your identity ------------------------------------------
  "onboarding.username.label": "Your name on the mesh",
  "onboarding.username.peer_id": "Peer ID",
  // The card is read as one element rather than ten stops. `{props}` is the
  // joined "label: value" list below it.
  "onboarding.username.card_a11y":
    "Your name on the mesh is {username}. Peer ID {peerID}. {props}",
  "onboarding.username.explanation":
    "This username is deterministically derived from your public key. It is the same on every device that sees your peer ID.",
  "onboarding.username.cta": "Enter Airhop",
  // Property rows. The values that are cryptosystem names ("Ed25519 + X25519")
  // or a product term ("OS Keychain") stay as they are in every language; only
  // the labels and the one prose value are translated.
  "onboarding.username.prop.algorithm": "Algorithm",
  "onboarding.username.prop.storage": "Storage",
  "onboarding.username.prop.storage_value": "OS Keychain only",
  "onboarding.username.prop.account": "Account required",
  "onboarding.username.prop.account_value": "None",

  // ---- Onboarding: the author's note --------------------------------------
  // First person on purpose: this is one person speaking, not the product. Keep
  // that voice in translation rather than formalising it into product copy.
  // The links are substituted as nodes, so each language puts them where its
  // own word order needs them. "GitHub", the email address and the store names
  // are proper nouns and stay as they are.
  "onboarding.hello.title": "Welcome to Airhop",
  "onboarding.hello.p1":
    "Hey there. Airhop is built on top of bitchat as an independent, open source side project. It's not affiliated with or endorsed by the bitchat project or permissionless tech, just something I enjoy building and sharing with the community.",
  "onboarding.hello.p2":
    "This is the first iOS and Android release, so while I've tested it with friends, you'll probably run into a few bugs. If you do, or if you have an idea for a feature, I'd love to hear from you. Open an issue on {github} or send me an email at {email}.",
  "onboarding.hello.p3":
    "If Airhop is useful to you, consider leaving a star on {github} or a review on the {store}. It helps more people discover the project. Thanks for giving it a try!",

  // ---- Onboarding: permission primer --------------------------------------
  // Shown once, before the OS asks. The Location row only appears on Android,
  // where BLE scanning is coupled to it; saying "Android needs this" on an
  // iPhone would be both wrong and alarming.
  "onboarding.primer.title": "Two permissions",
  "onboarding.primer.lede":
    "Your phone is about to ask. Here is what each one is for.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Finds phones near you and carries messages between them. This is the mesh.",
  "onboarding.primer.location.title": "Location",
  // The denial in the second sentence is the whole point of this row. Keep it
  // as direct in translation: "does not track you" must not soften into
  // "aims to respect your privacy".
  "onboarding.primer.location.body":
    "Android will not return Bluetooth scan results without it. Airhop does not track you: your exact position never leaves this device.",
  "onboarding.primer.footnote":
    "You can say no. Messages still travel over the internet, and you can change your mind later in Settings.",
  "onboarding.primer.cta_a11y": "Continue to the permission prompts",

  // ---- Permissions --------------------------------------------------------
  // `label` names the permission, `purpose` completes the sentence "Airhop
  // needs <label> to <purpose>", so the two halves must be translated as a
  // pair. Keeping the purpose a verb phrase is what makes that sentence work
  // in every language rather than only in English.
  "permission.bluetooth.label": "Bluetooth access",
  "permission.bluetooth.purpose": "discover nearby devices over the mesh",

  // ---- Wallet notices -----------------------------------------------------
  // A Nostr-locked payment that arrived and was redeemed while the app was up.
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap received from {from}… and redeemed into your wallet.",

  // ---- Settings: shared chrome --------------------------------------------
  "settings.back": "Go back",
  "settings.coming_soon": "Coming soon",
  // Appended to a row that leaves the app for a browser or mail client, so a
  // screen reader announces the departure before the tap rather than after.
  "settings.opens_externally": "{label}, opens outside the app",

  // ---- Settings: hub rows -------------------------------------------------
  "settings.section.general": "General",
  "settings.section.general_desc": "Optional features, undo send, media, reset",
  "settings.section.privacy": "Privacy & Security",
  "settings.section.privacy_desc":
    "Forward secrecy, signed packets, blocked peers",
  "settings.section.network": "Network & Relays",
  "settings.section.network_desc":
    "Internet fallback, nostr relays, bitchat compatibility",
  "settings.section.permissions": "Permissions",
  "settings.section.permissions_desc":
    "Bluetooth, location, notifications, camera, mic",
  "settings.section.storage": "Storage & Data",
  "settings.section.storage_desc": "Usage and cache",
  "settings.section.appearance": "Appearance",
  "settings.section.appearance_desc": "Theme and font",
  "settings.section.help": "Help and feedback",
  "settings.section.help_desc": "Contact us, report a bug, or read the FAQ",
  "settings.section.support": "Support",
  "settings.section.support_desc": "Help keep development active",
  "settings.section.about": "About",
  "settings.section.about_desc": "Version, changelog, and source",

  // ---- Settings: about ----------------------------------------------------
  "settings.about.version": "Version",
  "settings.about.version_desc": "Current release",
  "settings.about.version_a11y": "View version and check for updates",
  "settings.about.release_notes": "Release notes",
  "settings.about.release_notes_desc": "What's new in the latest release",
  "settings.about.release_notes_a11y":
    "Open the latest release notes on GitHub",
  "settings.about.source": "Source Code",
  "settings.about.source_a11y": "Open source code on GitHub",
  "settings.about.licenses": "Open source licenses",
  "settings.about.licenses_desc": "Third-party open source packages",
  "settings.about.licenses_a11y": "View third-party licenses",

  // ---- Settings: help and feedback ----------------------------------------
  "settings.help.contact": "Contact us",
  "settings.help.contact_a11y": "Email {address}",
  "settings.help.bug": "Report a bug",
  "settings.help.bug_desc": "Open an issue on GitHub",
  "settings.help.bug_a11y": "Report a bug on GitHub",
  "settings.help.faq": "Frequently asked questions",
  "settings.help.faq_desc": "Answers to common questions",
  "settings.help.faq_a11y": "Open FAQ",
  "settings.help.terms_desc": "How Airhop can be used",
  "settings.help.terms_a11y": "Open Terms of Service",
  "settings.help.privacy_desc": "What we don't collect",
  "settings.help.privacy_a11y": "Open Privacy Policy",

  // ---- Settings: support --------------------------------------------------
  // "Card or UPI" names real payment rails. UPI is India-specific and keeps its
  // name everywhere; a translator should localise "Card" and leave "UPI".
  "settings.support.card": "Card or UPI",
  "settings.support.card_desc": "Netbanking and wallets too, worldwide",
  "settings.support.card_a11y": "Support by card, UPI, netbanking, or wallet",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc": "Monthly or one-time, no platform fee",
  "settings.support.sponsors_a11y": "Support through GitHub Sponsors",
  // First person, like the welcome note: this is the author speaking.
  "settings.support.note":
    "I build Airhop in my free time. There are no investors and no ads. If it is useful to you, a contribution goes a long way toward keeping development active. Every feature stays free either way.",

  // System-tray notifications we post ourselves. Translated at the moment the
  // notification is built, never at the moment the message is stored: a
  // notification is display, and the message behind it stays untranslated.
  "notif.channel.messages": "Messages",
  "notif.channel.nearby": "Nearby peers",
  "notif.channel.nearby_desc":
    "An occasional notice when the mesh finds people in Bluetooth range.",
  "notif.nearby.body": "In Bluetooth range now. Tap to open the mesh.",
  // "<sender>: <message>" on a channel notification. A colon is not universal
  // punctuation for this, so the whole line is a key rather than a join.
  "notif.channel_message": "{sender}: {preview}",

  // Strings the OS renders are not in this catalog. The iOS permission dialogs
  // live in app.json's infoPlist and the Android foreground-service
  // notification lives in Kotlin. Routing them through here means generating
  // per-locale InfoPlist files or pushing text across the bridge, and both
  // arrive with the second language. See .github/skills/localization.md.

  // ---- Settings: permissions ----------------------------------------------
  // Each row says what the permission buys and, plainly, what breaks without
  // it. Keep that second half in translation: a list of permissions with no
  // consequences attached is what makes people deny all of them.
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Finds nearby phones and carries your messages between them. Without it the mesh cannot run.",
  "settings.permissions.location": "Location",
  // The parenthetical is the point of the row, not a footnote. It answers the
  // question the user is actually asking.
  "settings.permissions.location_desc":
    "Opens the channels for where you are, and on Android it is what lets Bluetooth scan. Without it those channels stay closed. (Airhop does not track your location.)",
  "settings.permissions.notifications": "Notifications",
  "settings.permissions.notifications_desc":
    "Tells you about a message that arrives while Airhop is closed. Without it you see it the next time you open the app.",
  "settings.permissions.camera": "Camera",
  "settings.permissions.camera_desc":
    "Scans a contact's QR code, and takes a photo or video to send. Without it you can still send from your library.",
  "settings.permissions.photos": "Photos",
  "settings.permissions.photos_desc":
    "Attaches a photo from your library, and saves one you were sent. Without it you can still take one with the camera.",
  "settings.permissions.microphone": "Microphone",
  "settings.permissions.microphone_desc":
    "Records a voice note, and carries live voice when you hold the mic. Without it neither can be sent.",
  "settings.permissions.allow": "Allow this permission",
  "settings.permissions.open_settings":
    "Open system settings to change this permission",
  // The value shown for a permission Airhop cannot prompt for, so the answer to
  // "who controls this" is the OS. A noun here, not the adjective "system" that
  // a settings picker would use, so translators do not share a word across two
  // different senses.
  "settings.permissions.system": "System",

  // ---- Settings: privacy and security -------------------------------------
  "settings.security.forward_secrecy": "Forward secrecy",
  "settings.security.forward_secrecy_desc":
    "Double Ratchet is always on for DMs",
  "settings.security.signed_packets": "Signed packets",
  "settings.security.signed_packets_desc": "Every packet is Ed25519-signed",
  "settings.security.no_blocked": "No blocked peers",
  "settings.security.no_blocked_desc":
    "Blocked peers can't message you or appear on the Mesh tab",
  "settings.security.unblock_title": "Unblock this peer",
  "settings.security.unblock": "Unblock",
  "settings.security.unblock_body":
    "{name} will be able to message you again and will reappear on the Mesh tab when nearby.",

  // ---- Settings: storage and data -----------------------------------------
  "settings.storage.network_usage": "Network usage",
  "settings.storage.storage_usage": "Storage usage",
  "settings.storage.storage_usage_desc":
    "Messages, wallet proofs, and cached attachments",
  "settings.storage.cache": "Cache",
  "settings.storage.clear_cache": "Clear attachment cache",
  "settings.storage.clear": "Clear",
  "settings.storage.clear_title": "Clear cached media?",
  "settings.storage.clear_body":
    "Received photos, videos, and voice notes will be removed from this device and may need re-downloading. Messages and wallet are untouched.",
  "settings.storage.cleared": "Cache cleared",
  "settings.storage.freed": "Freed {size}.",

  // ---- Settings: general ----------------------------------------------- -------
  "settings.general.undo": "Undo send",
  "settings.general.feature_ai": "AI",
  "settings.general.feature_wallet": "Wallet",
  "settings.general.undo_seconds": "{count} seconds",
  "settings.general.undo_a11y": "Undo send: {value}",
  "settings.general.quality_a11y": "Set upload quality to {value}",
  "settings.general.undo_desc":
    "Hold a sent message briefly so you can take it back before it goes out.",
  "settings.general.undo_off_desc": "Send right away, no undo",
  "settings.general.undo_2": "2 seconds",
  "settings.general.undo_2_desc": "A quick chance to take it back",
  "settings.general.undo_5": "5 seconds",
  "settings.general.undo_5_desc": "A longer window",
  "settings.general.undo_10": "10 seconds",
  "settings.general.undo_10_desc": "The longest window",
  "settings.general.quality": "Upload quality",
  "settings.general.quality_low": "Low",
  "settings.general.quality_low_desc": "Smallest photos, quickest to send",
  "settings.general.quality_medium": "Medium",
  "settings.general.quality_medium_desc": "Balanced detail and speed",
  "settings.general.quality_high": "High",
  "settings.general.quality_high_desc": "Keeps the most detail",
  "settings.general.feature_wallet_desc":
    "Send Cashu ecash peer to peer over the mesh",
  "settings.general.feature_wallet_a11y": "Wallet (always on)",
  "settings.general.feature_ai_desc":
    "Private on-device assistant, no network calls",
  "settings.general.feature_feeds": "Feeds",
  "settings.general.feature_feeds_desc":
    "Read and post to Bluesky and Mastodon feeds",
  "settings.general.show_media": "Show media automatically",
  "settings.general.show_media_desc":
    "Photos and videos appear in the chat. Turn off to keep them behind a tap",
  "settings.general.reset": "Reset settings",
  "settings.general.reset_desc":
    "Put every preference back to its default. Your identity, messages, contacts, and wallet are untouched.",
  "settings.general.reset_title": "Reset settings?",
  "settings.general.reset_body":
    "Every preference goes back to its default: appearance, undo send, and connectivity (internet, Tor, gateway, bridge, relays). Your identity, messages, contacts, and wallet are untouched.",
  "settings.general.reset_confirm": "Reset",

  // ---- Settings: network and relays ------------------------------------ -------
  "settings.network.internet": "Internet fallback",
  "settings.network.internet_desc":
    "Continue over Nostr relays when mesh peers are out of range.",
  "settings.network.internet_off_title": "Turn off the internet?",
  "settings.network.internet_off_body":
    "Airhop will run on Bluetooth only. It stops contacting any Nostr relay, and Tor, the internet gateway, and the mesh bridge all turn off. Nearby Bluetooth chat keeps working.",
  "settings.network.turn_off": "Turn off",
  "settings.network.discovery": "Geo-relay discovery",
  "settings.network.discovery_desc":
    "Auto-select the nearest relays for a location cell from 350+ distributed relays.",
  "settings.network.discovery_needs_relay": "Add a custom relay first",
  "settings.network.discovery_needs_relay_body":
    "Auto-discovery is what points Airhop at the nearest relays. Turning it off only makes sense once you have pinned your own relays below, so add at least one first.",
  "settings.network.custom_only_title": "Use only your custom relays?",
  "settings.network.custom_only_body":
    "Location channels and the mesh bridge will stop auto-selecting the nearest relays and use only the ones you added. This can reduce reach, and you may stop meeting bitchat users, who converge on the nearest relays.",
  "settings.network.custom": "Custom relays",
  "settings.network.custom_desc": "Add your own Nostr relays",
  "settings.network.add_relay": "Add relay",
  "settings.network.bitchat": "bitchat compatibility",
  "settings.network.bitchat_desc":
    "Same BLE mesh as bitchat, fully interoperable. This is always on, and cannot be disabled.",

  // ---- Settings: connectivity toggles ------------------------------------------
  "settings.conn.live_voice": "Live voice",
  "settings.conn.live_voice_desc":
    "Walkie-talkie over Bluetooth: hold the mic and people in range hear you as you speak.",
  "settings.conn.live_voice_on_title": "Turn on live voice?",
  "settings.conn.live_voice_on_body":
    "Holding the mic sends your voice to everyone in Bluetooth range as you speak, and their voice plays on your phone. Nothing is recorded.",
  "settings.conn.live_voice_off_title": "Turn off live voice?",
  "settings.conn.live_voice_off_body":
    "Holding the mic records a voice note instead. It sends when you let go, and nobody hears it until they play it.",
  // The alert title when Tor could not start. Shorter than the row label
  // above it, which names the setting rather than the subject of the alert.
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Tor routing",
  "settings.conn.tor_desc": "Route Nostr traffic through Tor for extra privacy",
  "settings.conn.tor_on_title": "Route Nostr traffic through Tor?",
  "settings.conn.tor_on_body":
    "Relays stop seeing your IP address. Connecting takes longer and messages arrive slower. Bluetooth is unaffected.",
  "settings.conn.tor_off_title": "Turn off Tor routing?",
  "settings.conn.tor_off_body":
    "Nostr traffic goes back over your ordinary connection, so relays see your IP address again. Bluetooth is unaffected either way.",
  "settings.conn.tor_orbot_idle":
    "Orbot is installed but not connected. Open Orbot, start its VPN, then turn this on.",
  "settings.conn.tor_unavailable":
    "Tor routing is not available in this build.",
  "settings.conn.tor_timeout":
    "Could not connect through Tor within 60 seconds. Check your network connection and try again.",
  "settings.conn.tor_failed":
    "Could not start Tor. Ensure the app has network access.",
  "settings.conn.mint_clearnet": "Allow mint traffic over clear net",
  "settings.conn.mint_clearnet_desc":
    "Tor on iOS only covers Nostr. Leave off to block mint requests; ecash over the mesh keeps working either way.",
  "settings.conn.gateway": "Internet gateway",
  "settings.conn.gateway_desc":
    "Lend your connection to a nearby offline phone so it can still reach the location channels.",
  "settings.conn.gateway_on_title": "Turn on the internet gateway?",
  "settings.conn.gateway_on_body":
    "Nearby phones with no connection of their own will send and receive location-channel messages through yours. It uses your mobile data and battery, and their messages stay encrypted end to end, so you cannot read what passes through.",
  "settings.conn.gateway_off_title": "Turn off the internet gateway?",
  "settings.conn.gateway_off_body":
    "Nearby offline phones stop reaching the location channels through yours. Your own messages are unaffected.",
  "settings.conn.bridge": "Mesh bridge",
  "settings.conn.bridge_desc":
    "Link this area's public #bluetooth chat with another out-of-range Bluetooth crowd over the internet.",
  "settings.conn.bridge_on_title": "Turn on the mesh bridge?",
  "settings.conn.bridge_on_body":
    "Your public #bluetooth messages will be published to your neighborhood over the internet, so people beyond Bluetooth range can read them. Private messages are never bridged, and 'nearby only' keeps any single message local.",
  "settings.conn.bridge_off_title": "Turn off the mesh bridge?",
  "settings.conn.bridge_off_body":
    "Your public #bluetooth messages stay in Bluetooth range again, and messages from the bridged crowd stop arriving here.",
  "settings.conn.bridge_needs_location": "Mesh bridge needs location",
  "settings.conn.bridge_needs_location_desc":
    "It finds your neighborhood from a location fix. Grant location to start bridging.",
  "settings.conn.grant_location": "Grant location permission",
  "settings.conn.internet_off": "Internet is off",
  "settings.conn.internet_off_desc":
    "Tor, the gateway, and the bridge all use the internet. Turn on Internet fallback under Network to use them.",
  "settings.conn.turn_on": "Turn on",
  "settings.conn.turn_off": "Turn off",
  "settings.conn.get_orbot": "Get Orbot",
  "settings.conn.later": "Later",

  // ---- Settings: version -------------------------------------------------------
  "settings.version.codename": "Codename",
  "settings.version.checking": "Checking",
  "settings.version.check": "Check for updates",
  "settings.version.checking_title": "Checking for updates",
  "settings.version.up_to_date": "You are on the latest version.",
  "settings.version.release_notes": "View release notes",
  "settings.version.made_with": "Made with",

  // ---- Mesh status banner ------------------------------------------------------
  "mesh.banner.starting": "Starting the mesh…",
  "mesh.banner.no_bluetooth": "No Bluetooth on this device · internet only",
  "mesh.banner.bluetooth_off": "Bluetooth off · mesh unavailable",
  "mesh.banner.permission_needed": "Bluetooth permission needed",
  "mesh.banner.blocked": "Bluetooth blocked · allow it in Settings",
  "mesh.banner.precise_location": "Precise location needed to find peers",
  "mesh.banner.location_off_android":
    "Location off · Android needs it to find peers",
  "mesh.banner.paused": "Mesh paused · You're away",
  "mesh.banner.location_off": "Location off · location channels unavailable",
  "mesh.banner.battery_saver": "Battery saver · scanning less often",
  "mesh.banner.internet_off": "Internet off · Bluetooth only",
  "mesh.banner.relaying": "No local peers · relaying via Nostr",
  "mesh.banner.tor": "Tor on · internet traffic routed",
  "mesh.banner.gateway": "Internet gateway on · relaying nearby peers",
  "mesh.banner.bridge": "Mesh bridge on · public chat linked",
  "mesh.banner.action.turn_on": "Turn on",
  "mesh.banner.action.allow": "Allow",
  "mesh.banner.action.resume": "Resume",
  "mesh.banner.action.fix": "Fix",

  // ---- Mesh status banner: accessibility hints ---------------------------------
  "mesh.banner.hint.resume": "Turns Bluetooth advertising and scanning back on",
  "mesh.banner.hint.enable_bluetooth": "Asks Android to switch Bluetooth on",
  "mesh.banner.hint.location_settings": "Opens the system location settings",
  "mesh.banner.hint.app_settings":
    "Opens Airhop's permissions in system settings",
  "mesh.banner.hint.battery_settings":
    "Opens this phone's background activity settings",
  "mesh.banner.hint.dismiss": "Hides this note for good",

  // ---- Chat: room list and coverage levels -------------------------------------
  "chat.scope.mesh": "Local mesh · Bluetooth only",
  "chat.scope.mesh_desc":
    "Reaches devices within Bluetooth range (roughly 10 to 100 metres). No internet required. Ideal for local coordination.",
  "chat.scope.block": "City block · ~100m",
  "chat.scope.block_desc":
    "City-block level coverage. Messages are bridged over the internet so peers outside Bluetooth range but nearby can participate.",
  "chat.scope.neighborhood": "Neighborhood · ~1km",
  "chat.scope.neighborhood_desc":
    "Neighborhood coverage. Relay-assisted so peers across the area are reachable even without a direct Bluetooth link.",
  "chat.scope.city": "City · ~10km",
  "chat.scope.city_desc":
    "City-wide channel. Uses geo-located internet relays to reach peers across the metro area.",
  "chat.scope.province": "Province or state · ~100km",
  "chat.scope.province_desc":
    "Provincial or state coverage. Bridged over the internet for regional reach across hundreds of kilometres.",
  "chat.scope.country": "Country or region · ~1000km",
  "chat.scope.country_desc":
    "Country-wide coverage. Any Airhop or bitchat user in the region can join and read messages.",
  "chat.rooms.default": "Default Rooms",
  "chat.rooms.yours": "Your Rooms",
  "chat.rooms.none": "No rooms yet",
  "chat.rooms.none_desc":
    "No rooms yet. Use the add button in the header to join or create one",
  "chat.rooms.show_fewer": "Show fewer default rooms",
  "chat.rooms.show_less": "Show less",
  "chat.rooms.info": "Room info",
  "chat.rooms.pin": "Pin room",
  "chat.rooms.unpin": "Unpin room",
  "chat.rooms.mute": "Mute room",
  "chat.rooms.unmute": "Unmute room",
  "chat.rooms.leave": "Leave room",
  "chat.rooms.leave_confirm": "Leave",
  "chat.clear_messages": "Clear messages",
  "chat.clear_confirm": "Clear",
  "chat.group_badge": "Group",
  "chat.more": "More",
  "chat.no_messages": "No messages yet",
  "chat.you": "You",

  // ---- Chat: direct message list -----------------------------------------------
  "chat.dm.clear": "Clear chat",
  "chat.dm.remove_contact": "Remove contact",
  "chat.dm.block": "Block this peer",
  "chat.dm.block_confirm": "Block",
  "chat.dm.delete": "Delete chat",
  "chat.dm.delete_body":
    "This removes the conversation from your list and deletes its messages. The contact is kept, and a new message from them starts a fresh chat.",
  "chat.dm.in_range": "in range",
  "chat.dm.you_prefix": "You:",
  "chat.dm.none": "No direct messages",
  "chat.dm.none_desc":
    "Go to the Mesh tab and tap a peer to start an encrypted DM.",
  "chat.dm.contact_info": "Contact info",
  "chat.dm.pin": "Pin chat",
  "chat.dm.unpin": "Unpin chat",
  "chat.dm.mute": "Mute chat",
  "chat.dm.unmute": "Unmute chat",

  // ---- Chat: start something new -----------------------------------------------
  "chat.new.title": "Start something new",
  "chat.new.channel": "Create a private channel",
  "chat.new.channel_label": "Private Channel",
  "chat.new.group": "Create a private group",
  "chat.new.group_label": "Private Group",
  "chat.new.place": "Go to a place by geohash",
  "chat.new.place_label": "Go to a place",
  "chat.new.reach": "Reach",
  "chat.new.private": "Private",
  "chat.new.reach_internet": "Reaches members over Bluetooth and the internet.",
  "chat.new.reach_mesh": "Works over Bluetooth range, not the internet.",
  "chat.new.reach_internet_desc":
    "Reaches members over the internet too. Relays can see the channel is active, never its messages or who is in it.",
  "chat.new.reach_mesh_desc":
    "Stays on the local mesh. Most private, nothing leaves Bluetooth range.",
  "chat.new.join_link": "Join a private channel with an invite link",
  "chat.new.back_to_chooser": "Back to the chooser",
  "chat.new.create_channel": "Create channel",
  "chat.new.name_required": "Enter a channel name first",
  "chat.new.name_taken": "That name is already taken",
  "chat.new.create": "Create",

  // ---- Chat: bulletin board notices --------------------------------------------
  "chat.notices.title": "Notices",
  "chat.notices.here": "Here",
  "chat.notices.post_area": "Post a notice to this area",
  "chat.notices.post_mesh": "Post a notice to the mesh",
  "chat.notices.mark_urgent": "Mark urgent",
  "chat.notices.post": "Post notice",
  "chat.notices.post_short": "Post",
  "chat.notices.delete": "Delete notice",
  "chat.notices.just_now": "just now",
  "chat.notices.fades_soon": "fades soon",
  "chat.notices.1_day": "1 day",
  "chat.notices.3_days": "3 days",
  "chat.notices.7_days": "7 days",

  // ---- Chat: contact info ------------------------------------------------------
  "chat.contact.anonymous": "Anonymous",
  "chat.contact.anonymous_desc":
    "A geohash pseudonym with no lasting identity to verify.",
  "chat.contact.verified": "Verified",
  "chat.contact.verified_desc": "Scanned their QR code",
  "chat.contact.not_verified": "Not verified",
  "chat.contact.not_verified_desc":
    "Scan their QR code to confirm this is really them.",
  "chat.contact.e2ee": "End-to-end encrypted",
  "chat.contact.e2ee_nostr": "NIP-17 gift-wrapped, so relays cannot read it",
  "chat.contact.e2ee_mesh":
    "Noise XX, plus Double Ratchet between Airhop devices",
  "chat.contact.copy_nostr": "Copy Nostr public key",
  "chat.contact.nostr_key": "Nostr public key",
  "chat.contact.copy_peer_id": "Copy peer ID",
  "chat.contact.verify": "Verify contact",

  // ---- Chat: search results ----------------------------------------------------
  "chat.search.photos": "Photos",
  "chat.search.videos": "Videos",
  "chat.search.audio": "Audio",
  "chat.search.documents": "Documents",
  "chat.search.links": "Links",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Filter by {filter}",
  // `{filter}` arrives lowercased by the caller, which works in English and in
  // most languages. A language where a mid-sentence noun must stay capitalised
  // should reword so the filter name leads the sentence.
  "chat.search.no_matches": "No {filter} matching “{query}”",
  "chat.search.no_media": "No {filter} yet",
  "chat.search.result_a11y": "{chat}, {kind} from {sender}",
  "chat.search.you": "you",
  "chat.search.section_chats": "Chats",
  "chat.search.section_messages": "Messages",
  "chat.search.section_notices": "Notices",

  // ---- Chat: join by link ------------------------------------------------------
  "chat.join.title": "Join with a link",
  "chat.join.not_airhop": "That is not an Airhop link.",
  "chat.join.reach_internet":
    "Reaches members over Bluetooth and the internet.",
  "chat.join.reach_mesh": "Stays on Bluetooth range.",
  "chat.join.contact_card":
    "A contact card. Adds them to your contacts and opens the chat.",
  "chat.join.unverified": "That link could not be verified",
  "chat.join.unverified_body":
    "The contact card does not match its own keys, so it was not added. Ask them to send a fresh one.",
  "chat.join.paste": "Paste from clipboard",
  "chat.join.join": "Join",

  // ---- Chat: message info ------------------------------------------------------
  "chat.info.title": "Message info",
  "chat.info.sending": "Sending…",
  "chat.info.failed": "Failed to send",
  "chat.info.courier": "Carried by a friend",
  "chat.info.courier_desc": "Handed to the mesh for best-effort delivery",
  "chat.info.sent": "Sent",
  "chat.info.queued": "Waiting to send",
  "chat.info.queued_desc": "Held on this phone until there is a route to them",
  "chat.info.waiting": "Waiting…",

  // ---- Chat: notification centre -----------------------------------------------
  "chat.notif.clear": "Clear notifications",
  "chat.notif.clear_short": "Clear",
  "chat.notif.close": "Close notifications",
  "chat.notif.none": "No notifications yet",
  "chat.notif.none_desc":
    "Messages, mentions, and notices from your channels and chats show up here.",
  "chat.notif.new": "New",

  // ---- Chat: forward -----------------------------------------------------------
  "chat.forward.title": "Forward to…",
  "chat.forward.channels": "Channels",
  "chat.forward.groups": "Groups",
  "chat.forward.locations": "Locations",
  "chat.forward.dms": "Direct messages",
  "chat.forward.none": "No other chats yet.",

  // ---- Chat: jump to a place ---------------------------------------------------
  "chat.jump.failed": "Could not open that cell. Try again in a moment.",

  // ---- Wallet ------------------------------------------------------------------
  "wallet.err.locked": "Wallet locked",
  "wallet.err.mint_unreachable": "Mint unreachable",
  "wallet.err.tor_blocked": "Blocked while Tor is on",
  "wallet.err.insufficient": "Not enough balance",
  "wallet.err.exact_amount": "Can't send that exact amount",
  "wallet.err.no_mint": "No mint",
  "wallet.err.mint_unsupported": "Mint can't do that",
  "wallet.err.mint_refused": "Mint refused",
  "wallet.err.unreadable": "Unreadable token",
  "wallet.err.rejected": "Token rejected",
  "wallet.err.already_spent": "Already spent",
  "wallet.receive.own_payment": "This is your own payment",
  "wallet.receive.own_payment_body":
    "These coins are still reserved for a send you have not settled, so there is nothing to claim. Use Reclaim on that payment to put them straight back in your balance.",
  "wallet.receive.already_have": "Already in your wallet",
  "wallet.receive.already_have_body":
    "Every proof in this token is already stored here, so nothing was added. Balances are unchanged.",
  // Assembled with the three sentences below into one alert body. `{reason}`
  // is why it could not be confirmed (usually "offline").
  "wallet.receive.stored_unconfirmed":
    "Stored from {mint}, but not yet confirmed with the mint ({reason}).",
  "wallet.receive.offline": "offline",
  "wallet.receive.dleq_ok":
    "The mint's signature checks out, so the token is genuine.",
  "wallet.receive.dleq_uncached":
    "The mint's keys are not cached here, so the signature could not be checked offline.",
  "wallet.receive.dleq_warning":
    "Until you refresh online, the sender could in principle have spent it elsewhere.",
  "wallet.receive.failed": "Could not receive",
  "wallet.receive.title": "Receive ecash",
  "wallet.receive.scan": "Scan an ecash QR code",
  "wallet.receive.scan_short": "Scan QR",
  "wallet.receive.receiving": "Receiving…",
  "wallet.send.build_failed": "Could not build the token",
  "wallet.send.title": "Send ecash",
  "wallet.send.memo": "Memo (optional, travels with the token)",
  "wallet.send.building": "Building…",
  "wallet.send.build": "Build token",
  "wallet.send.copy_token": "Copy token",
  "wallet.send.share_token": "Share token",
  "wallet.send.to_peer": "Send token to a nearby peer",
  "wallet.send.to_peer_short": "Send to peer",
  "wallet.send.mark_delivered": "Mark delivered and finish",
  "wallet.send.they_got_it": "They got it",
  "wallet.send.keep_pending": "Keep this send pending",
  "wallet.send.decide_later": "Decide later",
  "wallet.send.no_peers": "No peers in range",
  "wallet.reclaim.title": "Reclaim this token?",
  "wallet.reclaim.keep": "Keep pending",
  "wallet.reclaim.confirm": "Reclaim",
  "wallet.copied.token_body":
    "The token is on your clipboard. It stays reserved here until you mark it delivered, so you can paste it again if the first attempt fails.",
  "wallet.copied.phrase_body":
    "Paste it into a password manager, then clear your clipboard. Other apps can read the clipboard, and on some setups it syncs to your other devices.",
  "wallet.mesh_offline": "Mesh offline",
  "wallet.mesh_offline_body":
    "The mesh service is not running, so there is nothing to hand the token to. It stays reserved under Pending.",
  "wallet.zap.title": "Zap a Nostr identity",
  "wallet.zap.not_npub": "not an npub",
  "wallet.zap.bad_key": "bad key",
  "wallet.zap.invalid_pubkey": "Invalid pubkey",
  "wallet.zap.invalid_pubkey_body":
    "Enter an npub1… or a 64-character hex Nostr pubkey.",
  "wallet.zap.sent": "Nutzap sent",
  "wallet.zap.sent_encrypted": "Sent as an encrypted token",
  "wallet.zap.no_network": "Couldn't reach the network",
  "wallet.zap.failed": "Zap failed",
  "wallet.zap.pubkey_placeholder": "npub1… or 64-char hex",
  "wallet.zap.note": "Note (optional, public)",
  "wallet.zap.sending": "Sending…",
  "wallet.mint.added": "Mint added",
  "wallet.mint.add_failed": "Could not add mint",
  "wallet.mint.title": "Mints",
  "wallet.mint.none": "No mint yet",
  "wallet.mint.add": "Add a mint",
  "wallet.mint.add_short": "Add mint",
  "wallet.mint.checking": "Checking…",
  "wallet.mint.remove_with_balance": "Remove mint with a balance?",
  "wallet.mint.remove": "Remove mint",
  "wallet.mint.delete_anyway": "Delete anyway",
  "wallet.mint.consolidate": "Move all balances to one mint",
  "wallet.mint.consolidate_title": "Move to one mint",
  "wallet.mint.moving": "Moving…",
  "wallet.mint.move": "Move",
  "wallet.mint.moved": "Moved",
  "wallet.mint.nothing_moved": "Nothing moved",
  "wallet.mint.destination": "· destination",
  "wallet.mint.will_move": "· will be moved",
  "wallet.mint.issued_by": "Issued by",
  "wallet.refresh.failed": "Refresh failed",
  "wallet.refresh.partly": "Partly refreshed",
  "wallet.refresh.done": "Refreshed",
  "wallet.refresh.all_confirmed":
    "Everything here was already confirmed with the mint.",
  "wallet.backup.title": "Backup",
  "wallet.backup.setup_failed": "Could not set up backup",
  "wallet.backup.on": "Backup on",
  "wallet.backup.on_body":
    "Your balance can now be rebuilt from those twelve words.\n\nAnything you were given by someone else stays outside the phrase until you refresh at the mint, and recovery needs your mint list, so keep it written down beside the words.",
  "wallet.backup.no_phrase": "No phrase stored",
  "wallet.backup.no_phrase_body":
    "The recovery phrase could not be read from the device keychain. Unlock the device and try again.",
  "wallet.backup.replace_title": "Replace your current phrase?",
  "wallet.backup.replace_body":
    "You already have a recovery phrase. Restoring a different one replaces it. Coins already covered by the old phrase stay spendable on this device, but they stop being restorable, so make sure the old words are written down before you continue.",
  "wallet.backup.replace": "Replace",
  "wallet.backup.invalid_phrase": "That phrase is not valid",
  "wallet.backup.invalid_phrase_body":
    "The phrase has a built-in checksum and this one does not pass. Check for a mistyped, missing or swapped word.",
  "wallet.backup.add_mint_first": "Add a mint first",
  "wallet.backup.add_mint_first_body":
    "Recovery works by asking a mint which coins it signed for you, so it needs to know which mint to ask. Add the mints you were using, then restore.",
  "wallet.backup.restore_failed": "Restore failed",
  "wallet.backup.phrase": "Recovery phrase",
  "wallet.backup.state_unconfirmed": "Backup on but not confirmed",
  "wallet.backup.state_off": "Backup off",
  "wallet.backup.badge_on": "On",
  "wallet.backup.badge_unconfirmed": "Unconfirmed",
  "wallet.backup.badge_off": "Off",
  "wallet.backup.view": "View recovery phrase",
  "wallet.backup.setup": "Set up recovery phrase",
  "wallet.backup.view_short": "View phrase",
  "wallet.backup.setup_short": "Set up",
  "wallet.backup.restore": "Restore a wallet from a recovery phrase",
  "wallet.backup.restore_short": "Restore",
  "wallet.backup.setup_title": "Set up a recovery phrase",
  "wallet.backup.warn_secret":
    "Anyone who reads them can take your balance. Do not screenshot them and do not store them on this phone.",
  "wallet.backup.warn_paper":
    "Write them on paper and keep them somewhere safe. Airhop cannot show them to you again if the phone is gone.",
  "wallet.backup.warn_scope":
    "They rebuild your ecash only. Your identity, chats and contacts are not covered.",
  "wallet.backup.warn_mints":
    "Recovery has to ask a mint which coins it signed, so write your mint list down beside the words.",
  "wallet.backup.preparing": "Preparing…",
  "wallet.backup.show_phrase": "Show my phrase",
  "wallet.backup.your_phrase": "Your recovery phrase",
  "wallet.backup.write_down": "Write these down",
  "wallet.backup.copy_phrase": "Copy recovery phrase to the clipboard",
  "wallet.backup.copy_clipboard": "Copy to clipboard",
  "wallet.backup.written_down": "I have written them down",
  "wallet.backup.check_copy": "Check your copy",
  "wallet.backup.confirm": "Confirm",
  "wallet.backup.restore_title": "Restore from a phrase",
  "wallet.backup.phrase_placeholder": "twelve words, separated by spaces",
  "wallet.backup.no_mints_yet":
    "No mints added yet. Recovery has to ask a specific mint, so add the ones you were using first.",
  "wallet.backup.scanning": "Scanning…",
  "wallet.backup.unreachable_mints":
    "Could not reach: {mints}. Any balance there is still out there. Try again when you have a better connection.",
  "wallet.backup.nothing_recovered":
    "Nothing was recovered from the mints scanned.",
  "wallet.ln.deposit_memo": "Airhop wallet top-up",
  "wallet.ln.invoice_failed": "Could not create the invoice",
  "wallet.ln.price_failed": "Could not price this invoice",
  "wallet.ln.paid": "Paid",
  "wallet.ln.payment_failed": "Payment failed",
  "wallet.ln.title": "Lightning",
  "wallet.ln.deposit": "Deposit sats over Lightning",
  "wallet.ln.deposit_short": "Deposit",
  "wallet.ln.withdraw": "Withdraw to a Lightning invoice",
  "wallet.ln.withdraw_short": "Withdraw",
  "wallet.ln.deposit_title": "Deposit over Lightning",
  "wallet.ln.amount_placeholder": "Amount in sats",
  "wallet.ln.requesting": "Requesting…",
  "wallet.ln.get_invoice": "Get invoice",
  "wallet.ln.copy_invoice": "Copy invoice",
  "wallet.ln.open_wallet": "Open in a Lightning wallet",
  "wallet.ln.open_wallet_short": "Open in wallet",
  "wallet.ln.waiting": "Waiting for payment…",
  "wallet.ln.new_invoice": "Create a new invoice",
  "wallet.ln.new_invoice_short": "New invoice",
  "wallet.ln.withdraw_title": "Withdraw to Lightning",
  "wallet.ln.scan_invoice": "Scan a Lightning invoice QR code",
  "wallet.ln.paid_from": "Paid from",
  "wallet.ln.invoice": "Invoice",
  "wallet.ln.routing_reserve": "Routing reserve",
  "wallet.ln.reserved": "Reserved from balance",
  "wallet.ln.paying": "Paying…",
  "wallet.ln.get_quote": "Get quote",
  "wallet.balance.spendable": "Spendable",
  "wallet.balance.unit_hint": "Switches between satoshis and bitcoin",
  "wallet.pending.title": "Pending",
  "wallet.pending.reserved_desc":
    "Built and reserved, delivery unconfirmed. The proofs are held out of your balance so they cannot be spent twice.",
  "wallet.pending.locked_desc":
    "Already locked to the recipient's key, so only they can spend it. It just has not reached them yet. Share the token to finish.",
  "wallet.pending.show_qr": "Show this token as a QR code",
  "wallet.pending.copy_again": "Copy the token again",
  "wallet.pending.share_again": "Share the token again",
  "wallet.pending.mark_delivered": "Mark this token as delivered",
  "wallet.pending.delivered": "Delivered",
  "wallet.pending.reclaim_into": "Reclaim this token into your balance",
  "wallet.activity.title": "Activity",
  "wallet.activity.none": "Nothing yet",
  "wallet.activity.show_fewer": "Show fewer payments",
  "wallet.activity.show_less": "Show less",
  "wallet.activity.received_unconfirmed": "Received, unconfirmed",
  "wallet.activity.received": "Received",
  "wallet.activity.send_reclaimed": "Send reclaimed",
  "wallet.activity.sent": "Sent",
  "wallet.activity.ln_deposit": "Lightning deposit",
  "wallet.activity.ln_withdrawal": "Lightning withdrawal",
  "wallet.activity.nutzap_received": "Nutzap received",
  "wallet.activity.spent_removed": "Spent proofs removed",
  "wallet.activity.refreshed": "Proofs refreshed",
  "wallet.activity.just_now": "just now",
  "wallet.nostr.copied_body":
    "Give this to someone and they can zap you from Airhop or any other Nostr wallet, with no Bluetooth needed.",
  "wallet.nostr.copy_key": "Copy your Nostr key so people can zap you",
  "wallet.nostr.your_key": "Your Nostr key",
  "wallet.explain.title": "What is Cashu?",
  "wallet.explain.intro":
    "Cashu is ecash for Bitcoin. A token is a string that is worth money to whoever holds it, signed blindly by a mint so the mint cannot tell who spent what. No accounts, no logins.",
  "wallet.explain.send": "Send",
  "wallet.explain.send_desc":
    "Turns an amount into a token you can hand to a nearby peer over Bluetooth, or share as text. Works with no internet. The proofs stay reserved until you confirm it landed.",
  "wallet.explain.receive": "Receive",
  "wallet.explain.receive_desc":
    "Paste a token to add it. Online it is swapped at the mint immediately, which makes it provably yours. Offline it is stored and marked unconfirmed until you refresh.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Pays a Nostr identity. If they publish NIP-61 nutzap info, the ecash is locked to their key so only they can spend it. Otherwise it falls back to an encrypted DM. Needs internet.",
  "wallet.explain.add_mint": "Add mint",
  "wallet.explain.add_mint_desc":
    "Saves the mint that issues and redeems your ecash, and caches its public keys so tokens from it can be verified offline. Choose a mint you would trust with the balance you keep there.",
  "wallet.explain.phrase": "Recovery phrase",
  "wallet.explain.phrase_desc":
    "Off by default. Turn it on and your coins are derived from twelve words instead of random numbers, so a new phone can rebuild the balance by asking your mints which coins they signed. Without it, losing the phone loses the money.",
  "wallet.token": "Token",

  // ---- Chat: channel info ------------------------------------------------------
  "chat.transport.bluetooth": "Bluetooth only",
  "chat.transport.both": "Bluetooth + Internet",
  "chat.transport.internet": "Internet only",
  "chat.info.about": "About",
  "chat.info.group_desc":
    "A private group. Only the members the creator added can read it, and it stays on Bluetooth.",
  "chat.info.teleported_desc":
    "A public location channel for this geohash cell. Anyone in the cell, on Airhop or bitchat, shares it over the internet. You are teleported, not physically here.",
  "chat.info.custom_desc":
    "A custom channel. Anyone who knows the name can join from any Airhop or bitchat device.",
  "chat.info.private_e2ee": "Private · end-to-end encrypted",
  "chat.info.public_plain": "Public · unencrypted",
  "chat.info.group_privacy":
    "Only the members shown below can read this group. Messages stay on Bluetooth, so members out of range receive them once they are back.",
  "chat.info.teleport_privacy":
    "A place you teleported to. It reaches everyone in this cell over the internet, and nobody in Bluetooth range.",
  "chat.info.location_off_privacy":
    "Location is off, so this channel reaches nearby devices over Bluetooth only. Turn on location to reach its area cell over the internet.",
  "chat.info.invite_privacy":
    "Only people you invite via the link can read it. It stays hidden from everyone else, even peers nearby.",
  "chat.info.public_privacy":
    "Anyone who joins can read every message. Use a direct message for private conversation; DMs are end-to-end encrypted.",
  "chat.info.remove_member": "Remove member",
  "chat.info.active": "Active",
  "chat.info.members": "Members",
  "chat.info.bookmark": "Bookmark this place",
  "chat.info.remove_bookmark": "Remove bookmark",
  "chat.info.custom_channel": "Custom channel",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Copy geohash",
  "chat.info.search_members": "Search members",
  "chat.info.search_members_placeholder": "Search members...",
  "chat.info.teleported": "Teleported",
  "chat.info.creator": "Creator",
  "chat.info.no_matches": "No matches.",
  "chat.info.no_one_here": "No one here yet.",
  "chat.info.add_members": "Add members",
  "chat.info.add_selected": "Add selected members",
  "chat.info.add": "Add",
  "chat.info.leave_group": "Leave group",
  "chat.info.leave_channel": "Leave channel",
  "chat.info.leave": "Leave",

  // ---- Settings: profile and identity ------------------------------------------
  "settings.status.online": "Online",
  "settings.status.online_desc": "Discoverable, advertising and scanning",
  "settings.status.away": "Away",
  "settings.status.away_desc": "Mesh paused, not scanning or advertising",
  "settings.status.invisible": "Invisible",
  "settings.status.invisible_desc": "Scanning, but hidden from discovery",
  "settings.status.title": "Status",
  "settings.status.set_a11y": "Set status to {value}",
  "settings.theme.set_a11y": "Set appearance to {value}",
  "settings.font.set_a11y": "Set monospace font to {value}",
  "settings.font.system": "System",
  "settings.font.system_desc": "Uses your device's default monospace font",
  // Typeface names are product names and stay as they are in every language.
  "settings.font.firacode": "Fira Code",
  "settings.font.firacode_desc": "Clean with distinctive characters",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Modern and easy to read",
  "settings.status.edit": "Edit status",
  "settings.theme.light": "Light",
  "settings.theme.light_desc": "Always use the light palette",
  "settings.theme.dark": "Dark",
  "settings.theme.dark_desc": "Always use the dark palette",
  "settings.theme.system": "System default",
  "settings.theme.system_desc": "Uses your device's appearance setting",
  "settings.transfer.identity": "Identity and keys",
  "settings.transfer.identity_desc": "Your peer ID, username, and contacts",
  "settings.transfer.chats": "Chats and history",
  "settings.transfer.chats_desc":
    "Conversations, groups, and the channels you have joined",
  "settings.transfer.wallet": "Wallet balance",
  "settings.transfer.wallet_desc": "Cashu proofs and transaction history",
  "settings.transfer.title": "Transfer to a new phone",
  "settings.transfer.desc":
    "Move your identity, chats, and wallet to another device",
  "settings.transfer.coming_soon_a11y": "Transfer to a new phone, coming soon",
  "settings.transfer.leaving": "I am leaving this device",
  "settings.qr.permission_label": "Photo access",
  "settings.qr.permission_purpose": "save your QR code",
  "settings.qr.saved": "Saved",
  "settings.qr.saved_body": "QR code saved to your photo library.",
  "settings.qr.save_failed": "Couldn't save",
  "settings.qr.save_failed_body": "The QR code could not be saved. Try again.",
  "settings.qr.share_message": "Add me on Airhop",
  "settings.qr.title": "Your QR Code",
  "settings.qr.share": "Share QR code",
  "settings.qr.share_short": "Share QR",
  "settings.qr.download": "Download QR code",
  "settings.qr.download_short": "Download QR",
  "settings.qr.show": "Show QR code",
  "settings.peer_id": "Peer ID",
  "settings.share_peer_id": "Share your Peer ID",
  "settings.wipe.trigger": "Trigger panic wipe",
  "settings.wipe.trigger_desc":
    "Triple-tap to wipe immediately without confirming",
  "settings.wipe.title": "Panic wipe",
  "settings.wipe.now": "Wipe now",
  "settings.wipe.done": "Wiped",
  "settings.wipe.got_it": "Got it",

  // ---- Mesh: radar -------------------------------------------------------------
  "mesh.radar.scanning": "Scanning for nearby peers…",
  "mesh.radar.starting": "Starting the mesh…",
  "mesh.radar.no_bluetooth": "No Bluetooth on this device",
  "mesh.radar.bluetooth_off": "Bluetooth off · not scanning",
  "mesh.radar.permission_needed": "Bluetooth permission needed",
  "mesh.radar.blocked": "Bluetooth blocked",
  "mesh.radar.precise_location": "Precise location needed",
  "mesh.radar.location_off": "Location off · not scanning",
  "mesh.radar.hint_rings": "Rings show BLE signal strength, not distance",
  "mesh.radar.hint_checking": "Checking Bluetooth and permissions",
  "mesh.radar.hint_internet": "Messages still travel over the internet",
  "mesh.radar.hint_turn_on": "Turn Bluetooth on to discover peers",
  "mesh.radar.hint_allow": "Allow Bluetooth to discover peers",
  "mesh.radar.hint_allow_settings":
    "Allow Bluetooth in Settings to discover peers",
  "mesh.radar.hint_precise":
    "Switch location from Approximate to Precise in Settings",
  "mesh.radar.hint_android_location":
    "Android needs location on to return Bluetooth scan results",
  "mesh.radar.signal_strong": "Strong",
  "mesh.radar.signal_medium": "Medium",
  "mesh.radar.signal_weak": "Weak",
  "mesh.radar.you_centre": "You, at the centre of the mesh",
  "mesh.radar.sonar_hint":
    "Plays a sonar sweep. Scanning is already continuous",
  "mesh.radar.paused": "Mesh paused · You're away",
  "mesh.radar.ring_hint":
    "Ring position reflects signal strength, not distance",
  "mesh.radar.set_online":
    "Set your status to Online in Profile to discover peers",
  "mesh.radar.in_range": "in range",
  "mesh.radar.recently_seen": "recently seen",
  "mesh.radar.peer_hint": "Opens options to message or pay this peer",

  // ---- Mesh: peer list ---------------------------------------------------------
  "mesh.peer.just_now": "just now",
  "mesh.peer.none": "No peers nearby",
  "mesh.peer.none_desc":
    "Other Airhop or bitchat devices within Bluetooth range appear here.",
  "mesh.peer.id_copied": "Peer ID copied",
  "mesh.peer.copy_id": "Copy peer ID",
  "mesh.peer.in_range": "In range",
  "mesh.peer.send_dm": "Send a direct message",
  "mesh.peer.message": "Message",
  "mesh.peer.send_sats": "Send sats",
  "mesh.peer.amount_placeholder": "Amount in sats",
  "mesh.peer.amount_first": "Send sats, enter an amount first",
  "mesh.peer.cancel_send": "Cancel send sats",

  // ---- Contacts: QR scanning ---------------------------------------------------
  "contacts.scan.invalid_id":
    "Enter a valid 16-character peer ID or paste an airhop://peer/… link.",
  "contacts.scan.camera_label": "Camera access",
  "contacts.scan.camera_purpose": "scan a contact's QR code",
  "contacts.scan.camera_needed":
    "Camera access is needed to scan. You can still add by peer ID.",
  "contacts.scan.camera_failed":
    "Couldn't start the camera. Close other camera apps and try again.",
  "contacts.scan.photo_label": "Photo access",
  "contacts.scan.photo_purpose": "scan a QR code you've saved",
  "contacts.scan.photo_needed":
    "Photo access is needed to pick an image. You can still add by peer ID.",
  "contacts.scan.no_qr": "No Airhop QR code found in that image.",
  "contacts.scan.unreadable": "Couldn't read a QR code from that image.",
  "contacts.scan.tampered":
    "This QR code is invalid: its peer ID doesn't match its keys. It may have been tampered with.",
  "contacts.scan.already_added": "Already in your contacts",

  // ---- Chat: message thread ----------------------------------------------------
  "chat.attach.camera": "Camera",
  "chat.attach.camera_desc": "Take a photo or video",
  "chat.attach.library": "Photo Library",
  "chat.attach.library_desc": "Choose from your library",
  "chat.attach.document": "Document",
  "chat.attach.document_desc": "Send any file or PDF",
  "chat.attach.voice": "Voice Note",
  "chat.attach.voice_desc": "Record and send a voice message",
  "chat.attach.ecash": "Send ecash",
  "chat.attach.ecash_desc": "Send Cashu sats from your wallet",
  "chat.attach.title": "Attach",
  "chat.attach.file": "Attach a file",
  "chat.attach.unavailable": "Attachments not available here",
  "chat.attach.not_sent": "Attachment not sent",
  "chat.attach.read_failed":
    "Something went wrong reading that file. Try another one.",
  "chat.attach.caption": "Add a caption…",
  "chat.attach.send": "Send attachment",
  "chat.attach.generic": "Attachment",
  // `{cmd}` is the untranslated command token, so a screen reader announces
  // exactly what the user must type.
  "chat.cmd.a11y": "Command /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Send a warm hug",
  "chat.cmd.slap_hint": "Slap with a large trout",
  "chat.status.sending": "Sending…",
  "chat.status.undo_send": "Undo send",
  "chat.status.undo": "Undo",
  "chat.status.sent": "Sent",
  "chat.status.received": "Received",
  "chat.status.failed": "Failed",
  "chat.status.cancelled": "Cancelled",
  "chat.status.waiting": "Waiting",
  "chat.status.sending_short": "Sending",
  "chat.status.receiving": "Receiving",
  "chat.media.view_full": "View photo full screen",
  "chat.media.pause_voice": "Pause voice note",
  "chat.media.play_voice": "Play voice note",
  "chat.media.playing": "this is playing",
  "chat.media.remaining": "this much is left",
  "chat.media.voice_position": "Voice note position",
  "chat.media.voice_scrub": "Tap along the bars to jump to that point",
  "chat.media.image": "Image",
  "chat.media.tap_load_photo": "Tap to load photo",
  "chat.media.tap_load_video": "Tap to load video",
  "chat.media.video": "Video",
  "chat.media.photo": "Photo",
  "chat.media.close_photo": "Close photo",
  "chat.media.save_photo": "Save photo to your photos",
  "chat.media.share_photo": "Share photo",
  "chat.media.saved_videos": "Saved to your videos",
  "chat.media.saved_photos": "Saved to your photos",
  "chat.media.not_saved": "Not saved",
  "chat.media.not_saved_body":
    "The file could not be saved. It may have been cleared from the cache.",
  "chat.media.cant_open": "Can't open file",
  "chat.media.no_app":
    "This device has no app available to open or share this file.",
  "chat.media.open_failed":
    "The file could not be opened. It may have been cleared from the cache.",
  "chat.perm.camera_label": "Camera access",
  "chat.perm.camera_purpose": "take a photo to send",
  "chat.perm.photo_label": "Photo access",
  "chat.perm.photo_purpose": "pick a photo or video to send",
  "chat.perm.photo_save_purpose": "save this to your photos",
  "chat.perm.mic_label": "Microphone access",
  "chat.perm.mic_live_purpose": "talk to people nearby",
  "chat.perm.mic_note_purpose": "record a voice note",
  "chat.perm.recording_stopped": "Recording stopped",
  "chat.perm.record_failed":
    "Could not start recording. Check microphone permissions.",
  "chat.thread.not_available": "Not available here",
  "chat.thread.private_channel": "Private channel",
  "chat.thread.location_channel": "Location channel",
  "chat.thread.public_channel": "Public channel",
  "chat.thread.notices": "Notices for this channel",
  "chat.thread.invite": "Invite someone to this channel",
  "chat.thread.not_in_range":
    "Not in Bluetooth range. Delivering over the internet.",
  "chat.thread.not_nearby":
    "Not nearby. We'll deliver when they're back in range or online.",
  "chat.thread.no_route":
    "Can't reach them right now. Message will send when a route is available.",
  "chat.thread.empty": "No messages yet",
  "chat.thread.empty_desc": "Start an encrypted conversation.",
  "chat.thread.jump_latest": "Jump to latest message",
  "chat.thread.contact_info": "Contact info",
  "chat.thread.back_to_members": "Back to members",
  "chat.thread.nostr_key": "Nostr public key",
  "chat.thread.in_ble_range": "In BLE range",
  "chat.thread.message": "Message",
  "chat.thread.message_placeholder": "Message…",
  "chat.thread.send": "Send message",
  "chat.thread.group": "Group",
  "chat.bridge.nearby_only":
    "Nearby only: keep this message off the mesh bridge",
  "chat.bridge.nearby_label": "Nearby only · stays on Bluetooth",
  "chat.bridge.bridging_label":
    "Bridging to nearby areas · tap for nearby only",
  "chat.voice.unavailable": "Voice notes not available here",
  "chat.voice.hold_live": "Hold to talk live",
  "chat.voice.hold_record": "Hold to record a voice note",
  "chat.voice.live_available": "live is available",
  "chat.voice.someone_talking": "somebody else is talking",
  "chat.voice.stop_discard": "Stop talking and discard",
  "chat.voice.cancel_recording": "Cancel recording",
  "chat.voice.limit_reached": "Two minute limit reached, release to send",
  "chat.voice.stop_send": "Stop recording and send",
  "chat.voice.the_mesh": "the mesh",
  "chat.ecash.title": "Send ecash",
  "chat.ecash.amount": "Amount in sats",
  "chat.ecash.memo": "Memo (optional)",
  "chat.ecash.send": "Send",
  "chat.ecash.claimed": "Claimed",
  "chat.ecash.claiming": "Claiming…",
  "chat.ecash.claim": "Claim",
  "chat.ecash.already_claimed": "Already claimed",
  "chat.ecash.already_claimed_body":
    "Every proof in this token is already in your wallet, so nothing was added.",
  "chat.screenshot.you_took": "You took a screenshot",
  "chat.screenshot.heads_up": "Heads up",
  "chat.screenshot.notified":
    "Everyone in this channel was notified that you took a screenshot.",

  // ---- Wallet: mint and Lightning failures -------------------------------------
  "wallet.svc.mint_unreachable": "Could not reach the mint.",
  "wallet.svc.tor_ios": "Mint requests do not go through Tor on iOS.",
  "wallet.svc.tor_ios_body":
    "Arti only wraps Nostr WebSockets, so this request would reach the mint over the clear net and link your IP to these proofs. Allow it under Settings > Security, or turn Tor off first. Sending and receiving ecash over the mesh still works.",
  "wallet.svc.keys_uncached": "This mint's keys are not cached on this device.",
  "wallet.svc.keys_uncached_body":
    "Open the wallet once while online to fetch them.",
  "wallet.svc.phrase_invalid": "That recovery phrase is not valid.",
  "wallet.svc.phrase_invalid_body":
    "Check for a mistyped or missing word. The phrase has a built-in checksum, so a single wrong word makes the whole thing invalid.",
  "wallet.svc.need_mint": "Add at least one mint first.",
  "wallet.svc.need_mint_body":
    "Recovery works by asking a mint which coins it signed for you, so it needs to know which mint to ask.",
  "wallet.svc.restored": "Restored from recovery phrase",
  "wallet.svc.storage_locked": "Wallet storage is locked.",
  "wallet.svc.storage_locked_body":
    "Airhop keeps ecash proofs in an encrypted file whose key lives in the device keychain. Unlock the device and reopen the app.",
  "wallet.svc.bad_url": "That is not a valid URL.",
  "wallet.svc.needs_https": "A mint URL must start with https://.",
  "wallet.svc.refuse_http": "Refusing to use a mint over plain http.",
  "wallet.svc.refuse_http_body":
    "Anyone on the network path could read or alter your proofs. Use an https:// mint.",
  "wallet.svc.mint_not_saved": "Mint could not be saved.",
  "wallet.svc.unreadable_token": "That is not a readable Cashu token.",
  "wallet.svc.unreadable_token_body":
    "Tokens start with cashuA or cashuB. Check nothing was cut off when it was copied.",
  "wallet.svc.wrong_mint": "This token was not signed by the mint it names.",
  "wallet.svc.already_spent": "These proofs have already been spent.",
  "wallet.svc.already_spent_body":
    "Whoever sent this token redeemed it first, or sent the same token to someone else.",
  "wallet.svc.receiving_offline": "receiving offline",
  "wallet.svc.amount_positive": "Enter an amount greater than zero.",
  "wallet.svc.coins_raced": "Those coins were just used by another payment.",
  "wallet.svc.coins_raced_body":
    "Nothing was deducted. Try again and the wallet will pick a different set.",
  "wallet.svc.no_ecash": "No ecash yet.",
  "wallet.svc.no_ecash_body":
    "Add a mint and deposit over Lightning, or receive a token from someone.",
  "wallet.svc.split_across_mints": "Your balance is split across mints.",
  "wallet.svc.mint_says_spent": "Mint reported these proofs as already spent.",
  "wallet.svc.issue_against_invoice": "issue ecash against a Lightning invoice",
  "wallet.svc.pay_invoice": "pay a Lightning invoice",
  "wallet.svc.unknown_deposit": "Unknown deposit.",
  "wallet.svc.invoice_expired_before":
    "The invoice expired before it was paid.",
  "wallet.svc.invoice_expired": "That invoice expired.",
  "wallet.svc.invoice_unpaid": "The invoice has not been paid yet.",
  "wallet.svc.mint_did_not_pay":
    "The mint did not pay this invoice. Your balance is unchanged.",
  "wallet.svc.not_an_invoice": "That is not a Lightning invoice.",
  "wallet.svc.not_an_invoice_body":
    "Paste a bolt11 invoice starting with lnbc.",
  "wallet.svc.insufficient_for_invoice": "Not enough balance for this invoice.",
  "wallet.svc.coins_raced_invoice_body":
    "Nothing was deducted and the invoice was not paid. Try again.",
  "wallet.svc.same_mint": "Pick a different destination mint.",
  "wallet.svc.same_mint_body":
    "The source and destination are the same mint, so there is nothing to move.",
  "wallet.svc.quote_failed_retried": "Quote failed, consolidation retried",
  "wallet.svc.amount_unfit_retried":
    "Amount did not fit, consolidation retried",
  "wallet.svc.cannot_size": "Could not size this transfer.",
  "wallet.svc.unknown_mint": "That payment names a mint you do not use.",
  "wallet.svc.unknown_mint_body":
    "Add the mint yourself first if you trust it; nothing is redeemed from a mint you have not chosen.",
  "wallet.svc.no_relay": "no relay connection",
  "wallet.svc.no_shared_mint": "no shared mint with enough balance",
  "wallet.svc.no_nutzap_info":
    "recipient has not published nutzap info (NIP-61 kind 10019)",
  "wallet.svc.relay_publish_failed":
    "the nutzap relay publish failed, so the locked token went as an encrypted message instead",
  "wallet.svc.locked_undelivered":
    "Locked to their key but not yet delivered. Share the token from this transaction to complete it.",
  "wallet.svc.locked_unpublished":
    "the payment is already locked to their key, but nothing could be published. Share the token to finish delivering it",

  // ---- Wallet: peer-to-peer ecash transfer -------------------------------------
  "wallet.xfer.route_mesh": "Handed straight to their device over the mesh.",
  "wallet.xfer.route_nostr":
    "They were out of Bluetooth range, so it went over the internet instead.",
  "wallet.xfer.route_courier":
    "No route to them right now. It will be carried by other devices and delivered when one reaches them.",
  "wallet.xfer.route_queued":
    "They are not reachable yet. It is queued and will send as soon as they are.",
  "wallet.xfer.mesh_offline_body":
    "The mesh service is not running, so there is no way to hand the token over. Nothing has been deducted.",
  "wallet.xfer.could_not_send": "Could not send",

  // ---- Wallet: QR scanner ------------------------------------------------------
  "wallet.scan.camera_label": "Camera access",
  "wallet.scan.camera_purpose": "scan an ecash QR code",
  "wallet.scan.photo_label": "Photo access",
  "wallet.scan.photo_purpose": "read an ecash QR from an image",
  "wallet.scan.no_token": "No ecash token found in that image.",
  "wallet.scan.no_invoice": "No Lightning invoice found in that image.",
  "wallet.scan.unreadable": "Could not read that image.",
  "wallet.scan.camera_failed":
    "Couldn't start the camera. Close other camera apps and try again.",
  "wallet.scan.close": "Close scanner",
  "wallet.scan.aim_token": "Point at an ecash QR code.",
  "wallet.scan.aim_invoice": "Point at a Lightning invoice QR code.",
  "wallet.scan.title_token": "Scan ecash",
  "wallet.scan.title_invoice": "Scan invoice",
  "wallet.scan.desc_token":
    "Read a Cashu token from another wallet. Works with any Cashu wallet, not only Airhop.",
  "wallet.scan.desc_invoice":
    "Read a Lightning invoice to pay it from your balance.",
  "wallet.scan.use_camera_a11y": "Scan with the camera",
  "wallet.scan.use_camera": "Use camera",
  "wallet.scan.pick_image_a11y": "Read a QR code from a saved image",
  "wallet.scan.pick_image": "Pick from photos",

  // ---- Contacts: add a contact -------------------------------------------------
  "contacts.qr.verified": "Verified via QR",
  "contacts.qr.not_verified": "Not verified yet",
  "contacts.qr.message": "Message",
  "contacts.qr.add": "Add Contact",
  "contacts.qr.scan_title": "Scan QR code",
  "contacts.qr.peer_id": "Peer ID",
  "contacts.qr.peer_id_placeholder": "Paste or type a peer ID",
  "contacts.qr.start_new": "Start something new",
  "contacts.qr.scan_camera_a11y": "Scan QR code with camera",
  "contacts.qr.scan_camera_desc": "Use your camera",
  "contacts.qr.upload_a11y": "Upload QR image from gallery",
  "contacts.qr.upload": "Upload from gallery",
  "contacts.qr.upload_desc": "Pick a saved QR image",

  // ---- Contacts: verify by QR --------------------------------------------------
  "contacts.verify.waiting_camera": "Waiting for camera access…",
  "contacts.verify.camera_off": "Camera is off",
  "contacts.verify.open_settings": "Open Settings",
  "contacts.verify.verified": "Verified",
  "contacts.verify.different": "Different contact",
  "contacts.verify.scan_again": "Scan again",
  "contacts.verify.failed": "Couldn't verify",

  // ---- Mesh service: notification copy -----------------------------------------
  "notif.someone": "Someone",
  // The middot separates the label from the notice body, so it belongs inside
  // the key: some languages use a different separator, or none.
  "notif.notice_urgent": "Urgent notice · {content}",
  "notif.notice": "Notice · {content}",
  "notif.incoming_file": "Incoming file",

  // ---- Transfers: attachment kinds ---------------------------------------------
  "transfer.kind.photo": "Photo",
  "transfer.kind.video": "Video",
  "transfer.kind.voice": "Voice note",
  "transfer.kind.file": "File",
  "transfer.this.photo": "This photo",
  "transfer.this.video": "This video",
  "transfer.this.voice": "This voice note",
  "transfer.this.file": "This file",

  // ---- Location channels: coverage level names ---------------------------------
  "mesh.level.region": "Region",
  "mesh.level.province": "Province",
  "mesh.level.city": "City",
  "mesh.level.neighborhood": "Neighborhood",
  "mesh.level.block": "City block",
  "mesh.level.building": "Building",

  // ---- App shell: wallet quick actions -----------------------------------------
  "wallet.action.send": "Send ecash token",
  "wallet.action.send_disabled":
    "Send ecash token, unavailable with an empty balance",
  "wallet.action.receive": "Receive ecash token",
  "wallet.action.zap": "Zap a Nostr contact",
  "wallet.action.zap_disabled":
    "Zap a Nostr contact, unavailable with an empty balance",
  "wallet.action.add_mint": "Add a Cashu mint",
  "wallet.action.no_balance": "not enough balance",
  "contacts.qr.scan_a11y": "Add contact by scanning a QR code",

  // ---- Wallet: transfer failure labels -----------------------------------------
  "wallet.xfer.mesh_offline": "Mesh offline",

  // ---- Chat: teleport and errors -----------------------------------------------
  "chat.thread.error": "Error",
  "chat.thread.go_back": "Go back",
  "chat.teleport.stayed": "we left you where you were",
  "chat.teleport.stranded": "we stranded you",
  "chat.teleport.nothing": "nothing happened",
  "chat.teleport.moved": "you moved",

  // ---- Contacts: verify remaining ----------------------------------------------
  "contacts.verify.done": "Done",

  // ---- Chat: message actions ---------------------------------------------------
  "chat.action.info": "Message info",
  "chat.action.save_photos": "Save to photos",
  "chat.action.save_copy": "Save a copy",
  "chat.action.forward": "Forward",

  // ---- Chat: new private group -------------------------------------------------
  "chat.group.unreachable":
    "Could not reach every member. Try again while they're nearby.",
  "chat.group.create_title": "Create a group",
  "chat.group.name_placeholder": "Group name",
  "chat.group.create": "Create",

  // ---- Notifications: attachment previews --------------------------------------
  "notif.preview.photo": "📷 Photo",
  "notif.preview.voice": "🎤 Voice message",
  "notif.preview.video": "🎥 Video",
  "notif.preview.document": "📄 Document",

  // ---- Voice: capture errors ---------------------------------------------------
  "voice.unavailable": "Live voice not available",
  "voice.recording_stopped": "Recording stopped",

  // ---- Search: media kind labels -----------------------------------------------
  "transfer.kind.document": "Document",

  // ---- Chat: message preview kinds ---------------------------------------------
  "transfer.kind.voice_preview": "Voice note",
  "transfer.kind.photo_preview": "Photo",
  "transfer.kind.video_preview": "Video",
  "transfer.kind.document_preview": "Document",

  // ---- Permissions: blocked dialog ---------------------------------------------
  "permission.open_settings": "Open Settings",
  "permission.not_now": "Not now",

  // ---- Chat: jump to a place remaining -----------------------------------------
  "chat.jump.title": "Go to a place",
  "chat.jump.saved": "SAVED PLACES",
  "chat.jump.how":
    "To find a geohash: open a location channel > tap its name > copy it from there.",

  // ---- Chat: message bubble ----------------------------------------------------
  "chat.bubble.via_bridge": "via the mesh bridge",
  "chat.bubble.failed_retry": "Failed to send. Tap to retry.",

  // ---- Search: urgent marker ---------------------------------------------------
  "chat.search.urgent": "Urgent ·",

  // ---- Media: why an attachment cannot be sent ---------------------------------
  "media.blocked.nostr_only":
    "You only know this person through a relay, and photos, files and voice notes travel over Bluetooth. Text reaches them anywhere, media needs them nearby.",
  "media.blocked.location_channel":
    "A location channel reaches people over the internet, and photos, files and voice notes travel over Bluetooth, so they would never arrive.",
} as const;

// Plural forms live apart from the flat strings because plural categories are
// per-language: English needs one/other, Russian one/few/many/other, Arabic all
// six. A locale supplies only the categories its language uses; `other` is
// required everywhere. See `locales/types.ts`.
export const plurals = {
  // Accessibility labels that fold a count into the thing it counts. Read on
  // its own a trailing "3" is ambiguous, and TalkBack merges the row into one
  // node either way, so the count belongs in the label rather than in a
  // separate badge node. `{label}` is the tab or row name.
  "a11y.unread_count": {
    one: "{label}, {count} unread",
    other: "{label}, {count} unread",
  },
  "a11y.new_count": {
    one: "{label}, {count} new",
    other: "{label}, {count} new",
  },
  // The nearby-peers notification title. English reads "Someone nearby" for
  // one and "3 people nearby" for the rest, which a plural handles cleanly;
  // languages that need the count in the singular form can put it there.
  // Recovery results. Both were built by concatenating an English plural
  // suffix ("proof" + "s", "coin" + "s were"), which is the shape that cannot
  // be translated at all: no other language pluralises by appending to the
  // stem, and Russian and Arabic need four and six forms.
  "wallet.backup.recovered": {
    one: "Recovered {count} unspent proof from {mints}.",
    other: "Recovered {count} unspent proofs from {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "{count} coin was found but already spent, so nothing was credited for it. That is normal: every coin you have ever spent still appears in the records the mint keeps.",
    other:
      "{count} coins were found but already spent, so nothing was credited for them. That is normal: every coin you have ever spent still appears in the records the mint keeps.",
  },
  // Counts that used to be built by appending an English suffix to the stem
  // ("member" + "s", "proof" + "s were"). That shape cannot be translated at
  // all: no other language pluralises that way, and Russian needs four forms
  // while Arabic needs six.
  "chat.group_members": {
    one: "Private group  ·  {count} member",
    other: "Private group  ·  {count} members",
  },
  "mesh.peers_in_range": {
    one: "{count} peer in range",
    other: "{count} peers in range",
  },
  "wallet.mint_count": {
    one: "{count} mint",
    other: "{count} mints",
  },
  "wallet.proof_count": {
    one: "{count} proof",
    other: "{count} proofs",
  },
  "wallet.spent_removed_detail": {
    one: "{count} proof was already spent and has been removed.",
    other: "{count} proofs were already spent and have been removed.",
  },
  "wallet.mint.remove_body": {
    one: "{mint} holds {balance} {unit} in {count} proof. Removing it deletes that proof from this device permanently and there is no backup. Withdraw or send the balance first.",
    other:
      "{mint} holds {balance} {unit} in {count} proofs. Removing it deletes those proofs from this device permanently and there is no backup. Withdraw or send the balance first.",
  },
  "wallet.ln.pending_deposits": {
    one: "{count} deposit waiting on payment. Checked again each time the app opens.",
    other:
      "{count} deposits waiting on payment. Checked again each time the app opens.",
  },
  "notif.nearby.title": {
    one: "Someone nearby",
    other: "{count} people nearby",
  },
} as const;

export const en = { strings, plurals };
