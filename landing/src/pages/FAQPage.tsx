import { ArrowLeft } from "lucide-react";
import { isValidElement } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

const SECTIONS: {
  heading: string;
  questions: { q: string; a: React.ReactNode }[];
}[] = [
  {
    heading: "The basics",
    questions: [
      {
        q: "What is Airhop?",
        a: "Airhop is an open-source iOS and Android app for private, peer-to-peer messaging over Bluetooth mesh. There are no central servers. Messages relay automatically across nearby devices up to 7 hops. It works with zero internet connectivity.",
      },
      {
        q: "Is it free?",
        a: "Yes. Airhop is completely free, open-source under MIT, and has no ads, no subscriptions, and no paywall of any kind.",
      },
      {
        q: "Who is it for?",
        a: "Anyone who needs to communicate when normal networks are unavailable or untrustworthy. Journalists, activists, people in disaster zones, protestors, hikers, and anyone who values communication that cannot be shut down by a third party.",
      },
      {
        q: "How is it different from bitchat and other players?",
        a: "Airhop is built on top of bitchat, but extends it with things bitchat doesn't have at the time of writing, like Double Ratchet forward secrecy, Tor on both iOS and Android, offline Cashu payments, and an offline AI assistant. Beyond the protocol itself, a big part of the focus is the app people actually use day to day: a clean, simple interface that makes the whole thing easy to pick up, not just something that works well under the hood.",
      },
    ],
  },
  {
    heading: "Mesh network",
    questions: [
      {
        q: "Does Airhop require internet?",
        a: (
          <>
            Not for core offline messaging, since it relies on Bluetooth. Chatting, relaying across
            the mesh, voice notes, images, file transfers, and store-and-forward delivery all work
            with zero internet.
            <br />
            <br />
            For communication beyond Bluetooth range, Airhop automatically uses the Nostr internet
            bridge to reach a contact who is online but out of range. Location channels also require
            a connection.
          </>
        ),
      },
      {
        q: "How does the mesh relay messages?",
        a: "Every device acts as both a Bluetooth scanner and advertiser simultaneously. Incoming messages are verified, deduplicated against a 1,000-entry recent-seen cache, and re-broadcast with the hop counter decremented. Relay timing is randomized between 10 and 220 milliseconds to prevent collisions. Each node forwards to a deterministic subset of peers rather than every peer in range, which keeps network traffic flat regardless of mesh density.",
      },
      {
        q: "How far can messages travel?",
        a: "Each Bluetooth hop covers roughly 30 to 50 meters. With a 7-hop maximum, a message can traverse 105 to 350 meters in open conditions. Range scales naturally with user density: every additional device running Airhop in the area is a relay node. Store-and-forward courier messages have no hard range limit and deliver whenever a mesh path eventually exists between sender and recipient.",
      },
      {
        q: "What media can I send?",
        a: "Images, voice notes, videos, and any other file format, all over Bluetooth using chunked streaming. Large files are split into fragments, paced so the radio is not overrun, and reassembled on the other side. Videos are sent as files and play inline; they are not live streams. Bluetooth bandwidth is roughly 15 KB/s, so a large attachment takes time, but it works with no internet at all. On Android to Android or iPhone to iPhone, a faster direct WiFi link is used automatically when both devices support it.",
      },
      {
        q: "Is Airhop compatible with bitchat?",
        a: (
          <>
            Yes. Wire compatibility means both apps agree on the exact binary format of every byte
            sent over the radio, so no translation layer is needed. Airhop and bitchat share the
            same BLE service identifiers, the same packet byte layout, the same peer identity
            derivation, and the same Noise XX parameters.
            <br />
            <br />
            Place an Airhop device and a bitchat device in the same room and they automatically join
            one mesh, relay each other's messages, and exchange direct messages with no
            configuration and no awareness that different software is running. The full wire format
            is documented in{" "}
            <a
              href="https://github.com/areebahmeddd/Airhop/blob/main/docs/spec/PROTOCOLS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              PROTOCOLS.md
            </a>
            .
          </>
        ),
      },
    ],
  },
  {
    heading: "Privacy & security",
    questions: [
      {
        q: "Do I need an account?",
        a: (
          <>
            No. Your identity is an{" "}
            <a
              href="https://ed25519.cr.yp.to"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Ed25519
            </a>{" "}
            key pair generated on-device and stored in{" "}
            <a
              href="https://developer.apple.com/documentation/security/storing-keys-in-the-keychain"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              iOS Keychain
            </a>{" "}
            or{" "}
            <a
              href="https://developer.android.com/privacy-and-security/keystore"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Android Keystore
            </a>
            .{" "}
            <strong>
              There is no sign-up, no email, no phone number, and nothing that registers with any
              server.
            </strong>
          </>
        ),
      },
      {
        q: "Can someone impersonate me?",
        a: (
          <>
            No. Your identity is your private key, and every packet you send is Ed25519-signed.
            Nodes on the mesh verify signatures before relaying anything, so a forged packet
            claiming to be from you is dropped at every hop. Display names are derived
            deterministically from your public key and cannot be registered or squatted by anyone
            else. Noise XX mutual authentication prevents man-in-the-middle attacks on direct
            message sessions.
            <br />
            <br />
            For contacts you want to fully trust, QR code or NFC verification pins their key
            fingerprint to a human name, the same model Signal uses with safety numbers.
          </>
        ),
      },
      {
        q: "How is encryption handled?",
        a: (
          <>
            Every direct session uses the{" "}
            <a
              href="https://noiseprotocol.org/noise.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Noise XX
            </a>{" "}
            protocol for a mutual handshake and key exchange.
            <br />
            <br />
            All stored messages use{" "}
            <a
              href="https://signal.org/docs/specifications/doubleratchet/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Double Ratchet
            </a>{" "}
            forward secrecy, meaning past messages stay protected even if keys are later
            compromised. <strong>No plaintext ever touches disk.</strong>
          </>
        ),
      },
      {
        q: "What happens if I lose my phone or uninstall the app?",
        a: (
          <>
            <strong>Your identity and message history are permanently gone.</strong> The key pair is
            stored only on your device and cannot be recovered from any server because no server has
            it. There is no account recovery and no backup mechanism. This is intentional: there is
            nothing for a third party to hand over, subpoena, or breach.
          </>
        ),
      },
      {
        q: "What is panic wipe?",
        a: (
          <>
            Triple-tapping the logo triggers an immediate wipe of all identity keys and message data
            in under one second, for high-stakes situations where you need to destroy the app's
            contents right away. <strong>This cannot be undone.</strong>
          </>
        ),
      },
    ],
  },
  {
    heading: "Nostr & internet bridge",
    questions: [
      {
        q: "What is the Nostr bridge?",
        a: (
          <>
            When you and a contact are out of Bluetooth range and internet is available, Airhop uses{" "}
            <a
              href="https://fiatjaf.com/nostr.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Nostr
            </a>{" "}
            relays as an optional internet bridge to continue the conversation. Messages are sent as{" "}
            <a
              href="https://github.com/nostr-protocol/nips/blob/master/17.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              NIP-17
            </a>{" "}
            gift-wrapped direct messages, so relay operators cannot read them.
          </>
        ),
      },
      {
        q: "Is Nostr centralized, web3, or decentralized?",
        a: "Neither centralized nor web3. There is no blockchain, no token, and no company that owns it. Nostr relays are just servers run by independent operators on any hosting provider, not only a couple of big cloud platforms, so no single relay can lock you out or control the network. You are not tied to one relay either. If an operator disappears or blocks you, you move to another. That is what makes it decentralized: not a blockchain consensus mechanism, just nobody being able to own the whole network.",
      },
      {
        q: "Does the Nostr bridge compromise privacy?",
        a: "No. NIP-17 gift-wrapping encrypts the message content and hides the sender and recipient identities from relay operators. Metadata is minimal. You can also route Nostr traffic through Tor for additional network-level privacy.",
      },
      {
        q: "Does Airhop use Tor?",
        a: (
          <>
            <a
              href="https://torproject.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Tor
            </a>{" "}
            is available as an optional transport on both platforms for the Nostr bridge
            specifically. iOS uses{" "}
            <a
              href="https://arti.torproject.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Arti
            </a>
            , Android uses{" "}
            <a
              href="https://guardianproject.info/apps/org.torproject.android/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Orbot
            </a>
            . When enabled, all Nostr relay traffic is routed over Tor. It has no effect on the BLE
            mesh itself, which never touches the internet either way.
          </>
        ),
      },
      {
        q: "Do I have to use Nostr?",
        a: "No. The Nostr bridge is optional. If you prefer to stay purely on the BLE mesh, you can. The app works fully offline without any Nostr configuration.",
      },
    ],
  },
  {
    heading: "Offline payments",
    questions: [
      {
        q: "Do I need Bitcoin or a Lightning wallet to use Airhop?",
        a: "No. Payments are entirely optional, and Airhop works fully without them. A Lightning wallet is only needed once, to load Cashu tokens onto your device before going offline. See the next question for how that works.",
      },
      {
        q: "How do offline payments work?",
        a: (
          <>
            Before going offline, you load tokens from a{" "}
            <a
              href="https://cashu.space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Cashu
            </a>{" "}
            mint by depositing via{" "}
            <a
              href="https://en.wikipedia.org/wiki/Lightning_Network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Lightning Network
            </a>
            . The mint returns cryptographically signed token blobs worth the deposited amount,
            which live on your device like digital cash.
            <br />
            <br />
            To pay a contact offline, you select tokens and send them as a BLE mesh message.{" "}
            <strong>
              The recipient holds them and redeems with the mint later when back online.
            </strong>{" "}
            No internet is involved in the transfer itself.
          </>
        ),
      },
      {
        q: "What stops someone from spending the same tokens twice?",
        a: (
          <>
            The Cashu mint keeps a record of all redeemed token signatures. When a recipient
            redeems, the mint checks whether those exact signatures have been spent before. If they
            have, the redemption fails, and the first person to redeem wins.{" "}
            <strong>This requires trusting the mint to maintain an honest ledger</strong>, similar
            to trusting a bank not to miscount withdrawals. Fedimint, a variant, distributes that
            trust across multiple operators so no single party controls the ledger.
          </>
        ),
      },
      {
        q: "Are there transaction fees?",
        a: "There are no fees at the point of transfer over the mesh. Normal Cashu mint fees may apply when a recipient redeems tokens online.",
      },
    ],
  },
  {
    heading: "Open source",
    questions: [
      {
        q: "Is Airhop open source?",
        a: (
          <>
            Yes. The full source code is on{" "}
            <a
              href="https://github.com/areebahmeddd/Airhop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              GitHub
            </a>{" "}
            under the{" "}
            <a
              href="https://github.com/areebahmeddd/Airhop/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              MIT license
            </a>
            . Protocol specifications are in the docs/ directory.
          </>
        ),
      },
      {
        q: "Can I contribute?",
        a: (
          <>
            Yes. Open issues, submit pull requests, or start a discussion. Read the{" "}
            <a
              href="https://github.com/areebahmeddd/Airhop/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              contributing guide
            </a>{" "}
            before opening a large PR.
          </>
        ),
      },
    ],
  },
];

function toPlainText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toPlainText).join(" ");
  if (isValidElement(node)) {
    return toPlainText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

function faqAnswerText(node: React.ReactNode): string {
  return toPlainText(node).replace(/\s+/g, " ").trim();
}

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SECTIONS.flatMap((section) =>
    section.questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqAnswerText(item.a),
      },
    })),
  ),
};

export default function FAQPage() {
  useSEO({
    title: "Frequently Asked Questions - Airhop",
    description:
      "Answers about Airhop's Bluetooth mesh messaging, encryption, offline payments, the Nostr internet bridge, and bitchat compatibility.",
    path: "/faq",
  });

  return (
    <main id="main-content" className="min-h-screen bg-white font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to home
        </Link>

        <div className="mt-10">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-sm text-gray-500">Common questions about Airhop.</p>
        </div>

        <div className="mt-10 space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.heading} className="space-y-1">
              <h2 className="mb-3 text-base font-semibold text-gray-900">{section.heading}</h2>
              {section.questions.map((item) => (
                <details key={item.q} className="group border-b border-gray-100 py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="text-sm font-medium text-gray-900">{item.q}</span>
                    <span className="shrink-0 text-sm text-gray-500 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-6 text-sm leading-relaxed text-gray-600">{item.a}</p>
                </details>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-gray-100 pt-8">
          <p className="text-sm text-gray-500">
            {"Can't find what you're looking for?"}{" "}
            <a
              href="mailto:hi@areeb.dev"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Email us
            </a>{" "}
            or{" "}
            <a
              href="https://github.com/areebahmeddd/Airhop/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              open a GitHub discussion
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
