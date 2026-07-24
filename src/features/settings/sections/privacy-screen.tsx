// Privacy Policy, rendered in-app. Mirrors the content AND structure
// published at airhop.1mindlabs.org/privacy-policy, with the same bullets and
// bold emphasis, minus the one section ("This website") that only applies
// to the landing site itself.

import React from "react";
import LegalDocScreen, { type LegalSection } from "./legal-doc-screen";

interface Props {
  onBack: () => void;
}

const SECTIONS: LegalSection[] = [
  {
    heading: "Summary",
    paragraphs: [
      {
        bullets: [
          "No project-operated accounts or messaging servers.",
          "No analytics, advertising, telemetry, or tracking of any kind.",
          "No sale of user data.",
          "Your identity is a cryptographic key pair that never leaves your device.",
          "All source code is [open source](https://github.com/areebahmeddd/Airhop). The storage, networking, and cryptography described here can be verified in the code.",
        ],
      },
    ],
  },
  {
    heading: "What Airhop stores on your device",
    paragraphs: [
      "Airhop stores data only on your device. None of it is transmitted to us.",
      {
        bullets: [
          "**Identity keys.** An Ed25519 signing key and a Noise static key are generated locally on first launch and stored in your device's secure storage (iOS Keychain or Android Keystore). A Nostr key, a separate identity for each location cell you use, and one-time prekeys are all derived from that signing key rather than stored separately. Your public keys are shared with peers you communicate with. **Private keys never leave your device.**",
          "**Nickname and preferences.** Your chosen display name and app settings are stored locally.",
          "**Message history.** Conversations are stored locally on your device and are never sent to us. They are protected by the operating system's app sandbox and whole-device encryption, not by a separate app-level cipher, so a person with access to an unlocked device can read them. Delete a conversation at any time, or wipe everything instantly with panic wipe.",
          "**Private group state.** Group names, member lists, and the current group key are stored locally so you can keep reading the group. They are removed by panic wipe or by removing the app.",
          "**Bulletin board notices.** Signed public notices, and the deletion markers that retract them, persist until the author's chosen expiry, at most seven days. These are public to the mesh or area they were posted to, not private messages.",
          "**Media attachments.** Photos, videos, and voice notes you send or receive are written to the app's cache so they stay viewable. They are deleted by panic wipe, by clearing the cache in settings, or by removing the app.",
          "**Queued outgoing messages.** A private message that has not yet been delivered may remain in an encrypted local queue. It is **dropped after 24 hours** if unacknowledged.",
          "**Courier envelopes.** If your device acts as a mesh courier for another user, it may hold an opaque end-to-end encrypted envelope for up to 24 hours. **The courier cannot read the contents.**",
          "**Cashu tokens.** Ecash tokens are stored locally and transferred directly between devices. No payment backend is involved.",
        ],
      },
    ],
  },
  {
    heading: "What is shared with nearby peers",
    paragraphs: [
      "When the app is running, nearby mesh devices can receive:",
      {
        bullets: [
          "Your chosen nickname and public identity keys.",
          "Messages you send to public channels or directly to another peer.",
          "Public notices you post to the bulletin board, which stay readable until they expire.",
          "A batch of single-use public keys, so someone can leave you a protected message while you are offline. These contain no private information.",
          "Encrypted group traffic, which nearby devices relay but cannot read unless they are members of that group.",
          "Approximate Bluetooth signal strength (radio metadata visible to any nearby receiver).",
        ],
      },
      "Private text messages are encrypted end-to-end and readable only by the intended recipient. Public channel messages are visible to all participants in that channel.",
      "**Attachments are an exception: photos, videos, voice notes, and files are signed but not encrypted.** This is the format bitchat uses, and matching it is what lets the two apps exchange media at all. Because attachments relay hop by hop, any device carrying one can read it. Treat an attachment as visible to the mesh, not private.",
      "Nearby mesh devices are not limited to Airhop. [bitchat](https://bitchat.free) is a separate, compatible app that can join the same mesh and receive this same data. bitchat is an independent project with its own codebase, not operated or audited by us.",
    ],
  },
  {
    heading: "Nostr internet bridge (optional)",
    paragraphs: [
      "When the Nostr bridge is enabled, Airhop connects to public or user-selected Nostr relays to extend conversations beyond Bluetooth range.",
      {
        bullets: [
          "**Private messages.** Fallback messages use NIP-17 gift wraps. Relay operators can observe event timestamps and network metadata, but not message content.",
          "**Public channel messages.** These include a channel identifier, timestamp, and your public key.",
          "**Third-party relays.** Nostr relays are operated by third parties whose retention and privacy practices are outside this project's control.",
        ],
      },
    ],
  },
  {
    heading: "Location channels (optional)",
    paragraphs: [
      "Location channels let you talk to people in the same area. Location permission is optional and only requested when you use them.",
      {
        bullets: [
          "**Exact coordinates never leave your device** and are never stored. Your position is truncated to a grid cell, and the smallest cell we ever publish is roughly 150 metres across.",
          "A cell still reveals an approximate area to peers and relays. A finer cell reveals a smaller area.",
          "Each cell uses a separate identity derived on your device, so your activity in one area cannot be linked to another, or to your main identity.",
          "Revoking location permission stops the app resolving your cell. Location channels then fall back to Bluetooth range only.",
        ],
      },
    ],
  },
  {
    heading: "Internet gateway (optional)",
    paragraphs: [
      "A device with the gateway setting enabled relays location-channel messages on behalf of nearby devices that have no internet connection. The relayed messages are already public to that channel and are signed by their original author, so a gateway cannot read private content or alter what it carries. Enabling it uses your own data connection and battery. Internet gateway is off by default.",
    ],
  },
  {
    heading: "Tor routing (optional)",
    paragraphs: [
      "Airhop supports routing Nostr traffic through Tor using Arti on iOS or Orbot on Android. When enabled, **relay operators cannot observe your IP address.** Tor is off by default.",
    ],
  },
  {
    heading: "Cryptography",
    paragraphs: [
      {
        bullets: [
          "**Private sessions.** Noise XX with X25519 and ChaCha20-Poly1305.",
          "**Forward secrecy.** Provided by Double Ratchet for live conversations, and by single-use prekeys for messages left for someone who is offline, so an undelivered message stays protected even if a long-term key is compromised later.",
          "**Private groups.** Group messages use ChaCha20-Poly1305 under a shared group key. The member list is signed by the group's creator with Ed25519.",
          "**Public notices.** Bulletin-board posts are Ed25519-signed so their author cannot be forged. They are deliberately public, not confidential.",
          "**Nostr events.** secp256k1 Schnorr signatures, with private messages sealed using key agreement, HKDF-SHA256, and XChaCha20-Poly1305.",
          "**Implementation.** All cryptographic operations use the [@noble](https://github.com/paulmillr/noble-curves) library suite, which has been independently audited by Cure53.",
        ],
      },
      "**No cryptographic protection prevents a recipient from copying, screenshotting, or forwarding a message after reading it.**",
    ],
  },
  {
    heading: "How long data is kept",
    paragraphs: [
      {
        bullets: [
          "**Undelivered private messages:** until acknowledged, or 24 hours, whichever comes first.",
          "**Courier envelopes carried for others:** until handed over, or 24 hours.",
          "**Public bulletin-board notices:** until the author's chosen expiry, at most seven days.",
          "**Conversations, groups, contacts, keys, and media:** until you delete them, run a panic wipe, or remove the app.",
          "**Anything sent to a Nostr relay:** according to that relay operator's own policy, which is outside our control.",
        ],
      },
    ],
  },
  {
    heading: "Your controls",
    paragraphs: [
      {
        bullets: [
          "**Panic wipe.** Instantly erase all local keys, messages, queued mail, and app data from the Profile screen.",
          "**Feature controls.** The Nostr bridge, Tor routing, location channels, and the internet gateway can each be disabled in settings. Anything already published to a relay cannot be recalled.",
          "**System permissions.** Bluetooth, location, microphone, camera, photo library, and notification access can each be revoked in your device settings at any time. Camera access is used only to scan a contact's QR code.",
        ],
      },
    ],
  },
  {
    heading: "Children's privacy",
    paragraphs: [
      "Airhop has no account registration or age-verification system. The project does not knowingly collect personal data from children. Public channel messages, location channels, bulletin-board notices, and mesh traffic are visible to other participants and may be relayed onward by their devices.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "Material changes will be reflected in this document and its updated date. Because no personal data is held on project servers, a policy change cannot affect data that exists only on your device.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "Questions or concerns can be sent to [hi@areeb.dev](mailto:hi@areeb.dev) or raised by opening an issue on [GitHub](https://github.com/areebahmeddd/Airhop/issues).",
    ],
  },
];

export default function PrivacyScreen({ onBack }: Props): React.JSX.Element {
  return (
    <LegalDocScreen
      title="Privacy Policy"
      lastUpdated="September 01, 2026"
      sections={SECTIONS}
      onBack={onBack}
    />
  );
}
