import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

export default function PrivacyPage() {
  useSEO({
    title: "Privacy Policy - Airhop",
    description:
      "How Airhop handles data: no accounts, no servers, no tracking. Your identity and messages stay on your device.",
    path: "/privacy-policy",
  });

  return (
    <main id="main-content" className="min-h-screen bg-white font-sans antialiased">
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
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: July 22, 2026</p>
        </div>

        <div className="mt-10 space-y-10 text-gray-700">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Summary</h2>
            <ul className="space-y-1.5 text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                <span>No project-operated accounts or messaging servers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                <span>No analytics, advertising, telemetry, or tracking of any kind.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                <span>No sale of user data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                <span>
                  Your identity is a cryptographic key pair that never leaves your device.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                <span>
                  All source code is{" "}
                  <a
                    href="https://github.com/areebahmeddd/Airhop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 transition-colors hover:text-gray-900"
                  >
                    open source
                  </a>
                  . The storage, networking, and cryptography described here can be verified in the
                  code.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">
              What Airhop stores on your device
            </h2>
            <p className="text-sm leading-relaxed">
              Airhop stores data only on your device. None of it is transmitted to us.
            </p>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Identity keys.</strong> An Ed25519 signing key and Noise static key are
                generated locally on first launch. Both are stored in your device's secure storage
                (iOS Keychain or Android Keystore). Your public key is shared with peers you
                communicate with. <strong>Private keys never leave your device.</strong>
              </li>
              <li>
                <strong>Nickname and preferences.</strong> Your chosen display name and app settings
                are stored locally.
              </li>
              <li>
                <strong>Message history.</strong> Conversation content is stored encrypted on your
                device using ChaCha20-Poly1305. You can delete it at any time, or wipe everything
                instantly with panic wipe.
              </li>
              <li>
                <strong>Queued outgoing messages.</strong> A private message that has not yet been
                delivered may remain in an encrypted local queue. It is{" "}
                <strong>dropped after 24 hours</strong> if unacknowledged.
              </li>
              <li>
                <strong>Courier envelopes.</strong> If your device acts as a mesh courier for
                another user, it may hold an opaque end-to-end encrypted envelope for up to 24
                hours. <strong>The courier cannot read the contents.</strong>
              </li>
              <li>
                <strong>Cashu tokens.</strong> Ecash tokens are stored locally and transferred
                directly between devices. No payment backend is involved.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">
              What is shared with nearby peers
            </h2>
            <p className="text-sm leading-relaxed">
              When the app is running, nearby mesh devices can receive:
            </p>
            <ul className="space-y-1.5 text-sm leading-relaxed">
              <li>Your chosen nickname and public identity keys.</li>
              <li>Messages you send to public channels or directly to another peer.</li>
              <li>
                Approximate Bluetooth signal strength (radio metadata visible to any nearby
                receiver).
              </li>
            </ul>
            <p className="text-sm leading-relaxed">
              Private messages are encrypted end-to-end and readable only by the intended recipient.
              Public channel messages are visible to all participants in that channel.
            </p>
            <p className="text-sm leading-relaxed">
              Nearby mesh devices are not limited to Airhop.{" "}
              <a
                href="https://bitchat.free"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-gray-900"
              >
                bitchat
              </a>{" "}
              is a separate, compatible app that can join the same mesh and receive this same data.
              bitchat is an independent project with its own codebase, not operated or audited by
              us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">
              Nostr internet bridge (optional)
            </h2>
            <p className="text-sm leading-relaxed">
              When the Nostr bridge is enabled, Airhop connects to public or user-selected Nostr
              relays to extend conversations beyond Bluetooth range. This feature is optional and
              off by default.
            </p>
            <p className="text-sm leading-relaxed">
              Private fallback messages use NIP-17 gift wraps. Relay operators can observe event
              timestamps and network metadata but not message content. Public channel messages
              include a channel identifier, timestamp, and your public key. Nostr relays are
              operated by third parties whose retention and privacy practices are outside this
              project's control.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Tor routing (optional)</h2>
            <p className="text-sm leading-relaxed">
              Airhop supports routing Nostr traffic through Tor using Arti on iOS or Orbot on
              Android. When enabled,{" "}
              <strong>relay operators cannot observe your IP address.</strong> Tor is off by
              default.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Cryptography</h2>
            <p className="text-sm leading-relaxed">
              Private sessions use Noise XX with X25519 and ChaCha20-Poly1305. Forward secrecy is
              provided by Double Ratchet. All cryptographic operations use the{" "}
              <a
                href="https://github.com/paulmillr/noble-curves"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-gray-900"
              >
                @noble
              </a>{" "}
              library suite, which has been independently audited by Cure53.{" "}
              <strong>
                No cryptographic protection prevents a recipient from copying, screenshotting, or
                forwarding a message after reading it.
              </strong>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Your controls</h2>
            <ul className="space-y-1.5 text-sm leading-relaxed">
              <li>
                <strong>Panic wipe.</strong> Triple-tap the logo to instantly erase all local keys,
                messages, queued mail, and app data.
              </li>
              <li>
                <strong>Feature controls.</strong> The Nostr bridge, Tor routing, and internet
                features can be disabled in settings.
              </li>
              <li>
                <strong>System permissions.</strong> Bluetooth and microphone access can be revoked
                in your device settings at any time.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">This website</h2>
            <p className="text-sm leading-relaxed">
              airhop.1mindlabs.org is a static informational site deployed on{" "}
              <a
                href="https://pages.cloudflare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-gray-900"
              >
                Cloudflare Pages
              </a>
              . It has no user accounts, no cookies, and no analytics.{" "}
              <strong>We have no interest in your personal data and collect none of it.</strong>
            </p>
            <p className="text-sm leading-relaxed">
              Cloudflare's infrastructure may log standard request metadata (IP address, browser,
              page path) for security and availability purposes. We do not access these logs for
              analytics or share them with any third party. The site makes two browser-side requests
              to the GitHub API: one for the latest release tag and one for the public star count.
              No user data is included in either request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Children's privacy</h2>
            <p className="text-sm leading-relaxed">
              Airhop has no account registration or age-verification system. The project does not
              knowingly collect personal data from children. Public channel messages and mesh
              traffic are visible to other nearby participants.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Changes to this policy</h2>
            <p className="text-sm leading-relaxed">
              Material changes will be reflected in this document and its updated date. Because no
              personal data is held on project servers, a policy change cannot affect data that
              exists only on your device.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions or concerns can be sent to{" "}
              <a
                href="mailto:hi@areeb.dev"
                className="underline underline-offset-2 transition-colors hover:text-gray-900"
              >
                hi@areeb.dev
              </a>{" "}
              or raised by opening an issue on{" "}
              <a
                href="https://github.com/areebahmeddd/Airhop/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-gray-900"
              >
                GitHub
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
