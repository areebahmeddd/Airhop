import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
    ],
  },
  {
    heading: "Privacy & security",
    questions: [
      {
        q: "Do I need an account?",
        a: "No. Your identity is an Ed25519 key pair generated on-device and stored in iOS Keychain or Android Keystore. There is no sign-up, no email, no phone number, and nothing that registers with any server.",
      },
      {
        q: "How is encryption handled?",
        a: "Every direct session uses the Noise XX protocol for the handshake and key exchange. All stored messages use Double Ratchet forward secrecy, meaning past messages stay protected even if keys are later compromised. No plaintext ever touches disk.",
      },
      {
        q: "What is panic wipe?",
        a: "Triple-tapping the logo triggers an immediate wipe of all identity keys and message data in under one second. It is designed for high-stakes situations where you need to destroy the app's contents instantly.",
      },
      {
        q: "Does Airhop use Tor?",
        a: "Tor is available as an optional transport on both platforms. iOS uses Arti, Android uses Orbot. When enabled, all Nostr relay traffic is routed over Tor.",
      },
    ],
  },
  {
    heading: "Mesh network",
    questions: [
      {
        q: "Does Airhop require internet?",
        a: "No. The core mesh works entirely over Bluetooth Low Energy. As long as devices have Airhop installed and Bluetooth enabled, they can communicate. No SIM card, no Wi-Fi, no data plan required.",
      },
      {
        q: "How far can messages travel?",
        a: "Messages relay automatically across nearby nodes up to 7 hops. In a dense mesh, this can cover a surprisingly large area. Each hop is a participating device in Bluetooth range of the previous one.",
      },
      {
        q: "Is Airhop compatible with bitchat?",
        a: "Yes. Airhop uses the same BLE wire protocol and service UUIDs as bitchat. An Airhop device and a bitchat device on the same mesh discover each other automatically and can exchange messages with zero configuration.",
      },
    ],
  },
  {
    heading: "Nostr & internet bridge",
    questions: [
      {
        q: "What is the Nostr bridge?",
        a: "When you and a contact are out of Bluetooth range and internet is available, Airhop uses Nostr relays as an optional internet bridge to continue the conversation. Messages are sent as NIP-17 gift-wrapped direct messages, so relay operators cannot read them.",
      },
      {
        q: "Does the Nostr bridge compromise privacy?",
        a: "No. NIP-17 gift-wrapping encrypts the message content and hides the sender and recipient identities from relay operators. Metadata is minimal. You can also route Nostr traffic through Tor for additional network-level privacy.",
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
        q: "How do offline payments work?",
        a: "Airhop includes built-in offline ecash payments. Tokens travel the same BLE mesh as messages. You send tokens directly to a contact over Bluetooth with no internet and no payment processor involved. The recipient can redeem them when back online.",
      },
      {
        q: "Are there transaction fees?",
        a: "There are no fees at the point of transfer over the mesh. Normal ecash mint fees may apply when a recipient redeems tokens online.",
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
            under the MIT license. Protocol specifications are in the docs/ directory.
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

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white font-sans antialiased">
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
