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
          "All source code is open source. The storage, networking, and cryptography described here can be verified in the code.",
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
          "**Identity keys.** An Ed25519 signing key and Noise static key are generated locally on first launch. Both are stored in your device's secure storage (iOS Keychain or Android Keystore). Your public key is shared with peers you communicate with. **Private keys never leave your device.**",
          "**Nickname and preferences.** Your chosen display name and app settings are stored locally.",
          "**Message history.** Conversation content is stored encrypted on your device using ChaCha20-Poly1305. You can delete it at any time, or wipe everything instantly with panic wipe.",
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
          "Approximate Bluetooth signal strength (radio metadata visible to any nearby receiver).",
        ],
      },
      "Private messages are encrypted end-to-end and readable only by the intended recipient. Public channel messages are visible to all participants in that channel.",
      "Nearby mesh devices are not limited to Airhop. bitchat is a separate, compatible app that can join the same mesh and receive this same data. bitchat is an independent project with its own codebase, not operated or audited by us.",
    ],
  },
  {
    heading: "Nostr internet bridge (optional)",
    paragraphs: [
      "When the Nostr bridge is enabled, Airhop connects to public or user-selected Nostr relays to extend conversations beyond Bluetooth range. This feature is optional and off by default.",
      "Private fallback messages use NIP-17 gift wraps. Relay operators can observe event timestamps and network metadata but not message content. Public channel messages include a channel identifier, timestamp, and your public key. Nostr relays are operated by third parties whose retention and privacy practices are outside this project's control.",
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
      "Private sessions use Noise XX with X25519 and ChaCha20-Poly1305. Forward secrecy is provided by Double Ratchet. All cryptographic operations use the @noble library suite, which has been independently audited by Cure53. **No cryptographic protection prevents a recipient from copying, screenshotting, or forwarding a message after reading it.**",
    ],
  },
  {
    heading: "Your controls",
    paragraphs: [
      {
        bullets: [
          "**Panic wipe.** Instantly erase all local keys, messages, queued mail, and app data from the Profile screen.",
          "**Feature controls.** The Nostr bridge, Tor routing, and internet features can be disabled in settings.",
          "**System permissions.** Bluetooth and microphone access can be revoked in your device settings at any time.",
        ],
      },
    ],
  },
  {
    heading: "Children's privacy",
    paragraphs: [
      "Airhop has no account registration or age-verification system. The project does not knowingly collect personal data from children. Public channel messages and mesh traffic are visible to other nearby participants.",
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
      "Questions or concerns can be sent to hi@areeb.dev, or raised by opening an issue on GitHub.",
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
