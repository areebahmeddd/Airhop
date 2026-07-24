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
          <p className="mt-2 text-sm text-gray-500">Last updated: September 01, 2026</p>
        </div>

        <div className="mt-10 space-y-10 text-gray-700">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Summary</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-gray-400">
              <li>No project-operated accounts or messaging servers.</li>
              <li>No analytics, advertising, telemetry, or tracking of any kind.</li>
              <li>No sale of user data.</li>
              <li>Your identity is a cryptographic key pair that never leaves your device.</li>
              <li>
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
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed marker:text-gray-400">
              <li>
                <strong>Identity keys.</strong> An Ed25519 signing key and a Noise static key are
                generated locally on first launch and stored in your device's secure storage (iOS
                Keychain or Android Keystore). A Nostr key, a separate identity for each location
                cell you use, and one-time prekeys are all derived from that signing key rather than
                stored separately. Your public keys are shared with peers you communicate with.{" "}
                <strong>Private keys never leave your device.</strong>
              </li>
              <li>
                <strong>Nickname and preferences.</strong> Your chosen display name and app settings
                are stored locally.
              </li>
              <li>
                <strong>Message history.</strong> Conversations are stored locally on your device
                and are never sent to us. They are protected by the operating system's app sandbox
                and whole-device encryption, not by a separate app-level cipher, so a person with
                access to an unlocked device can read them. Delete a conversation at any time, or
                wipe everything instantly with panic wipe.
              </li>
              <li>
                <strong>Private group state.</strong> Group names, member lists, and the current
                group key are stored locally so you can keep reading the group. They are removed by
                panic wipe or by removing the app.
              </li>
              <li>
                <strong>Bulletin board notices.</strong> Signed public notices, and the deletion
                markers that retract them, persist until the author's chosen expiry, at most seven
                days. These are public to the mesh or area they were posted to, not private
                messages.
              </li>
              <li>
                <strong>Media attachments.</strong> Photos, videos, and voice notes you send or
                receive are written to the app's cache so they stay viewable. They are deleted by
                panic wipe, by clearing the cache in settings, or by removing the app.
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
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-gray-400">
              <li>Your chosen nickname and public identity keys.</li>
              <li>Messages you send to public channels or directly to another peer.</li>
              <li>
                Public notices you post to the bulletin board, which stay readable until they
                expire.
              </li>
              <li>
                A batch of single-use public keys, so someone can leave you a protected message
                while you are offline. These contain no private information.
              </li>
              <li>
                Encrypted group traffic, which nearby devices relay but cannot read unless they are
                members of that group.
              </li>
              <li>
                Approximate Bluetooth signal strength (radio metadata visible to any nearby
                receiver).
              </li>
            </ul>
            <p className="text-sm leading-relaxed">
              Private text messages are encrypted end-to-end and readable only by the intended
              recipient. Public channel messages are visible to all participants in that channel.
            </p>
            <p className="text-sm leading-relaxed">
              <strong>
                Attachments are an exception: photos, videos, voice notes, and files are signed but
                not encrypted.
              </strong>{" "}
              This is the format bitchat uses, and matching it is what lets the two apps exchange
              media at all. Because attachments relay hop by hop, any device carrying one can read
              it. Treat an attachment as visible to the mesh, not private.
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
              relays to extend conversations beyond Bluetooth range.
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-gray-400">
              <li>
                <strong>Private messages.</strong> Fallback messages use NIP-17 gift wraps. Relay
                operators can observe event timestamps and network metadata, but not message
                content.
              </li>
              <li>
                <strong>Public channel messages.</strong> These include a channel identifier,
                timestamp, and your public key.
              </li>
              <li>
                <strong>Third-party relays.</strong> Nostr relays are operated by third parties
                whose retention and privacy practices are outside this project's control.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Location channels (optional)</h2>
            <p className="text-sm leading-relaxed">
              Location channels let you talk to people in the same area. Location permission is
              optional and only requested when you use them.
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-gray-400">
              <li>
                <strong>Exact coordinates never leave your device</strong> and are never stored.
                Your position is truncated to a grid cell, and the smallest cell we ever publish is
                roughly 150 metres across.
              </li>
              <li>
                A cell still reveals an approximate area to peers and relays. A finer cell reveals a
                smaller area.
              </li>
              <li>
                Each cell uses a separate identity derived on your device, so your activity in one
                area cannot be linked to another, or to your main identity.
              </li>
              <li>
                Revoking location permission stops the app resolving your cell. Location channels
                then fall back to Bluetooth range only.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Internet gateway (optional)</h2>
            <p className="text-sm leading-relaxed">
              A device with the gateway setting enabled relays location-channel messages on behalf
              of nearby devices that have no internet connection. The relayed messages are already
              public to that channel and are signed by their original author, so a gateway cannot
              read private content or alter what it carries. Enabling it uses your own data
              connection and battery. Internet gateway is off by default.
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
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-gray-400">
              <li>
                <strong>Private sessions.</strong> Noise XX with X25519 and ChaCha20-Poly1305.
              </li>
              <li>
                <strong>Forward secrecy.</strong> Provided by Double Ratchet for live conversations,
                and by single-use prekeys for messages left for someone who is offline, so an
                undelivered message stays protected even if a long-term key is compromised later.
              </li>
              <li>
                <strong>Private groups.</strong> Group messages use ChaCha20-Poly1305 under a shared
                group key. The member list is signed by the group's creator with Ed25519.
              </li>
              <li>
                <strong>Public notices.</strong> Bulletin-board posts are Ed25519-signed so their
                author cannot be forged. They are deliberately public, not confidential.
              </li>
              <li>
                <strong>Nostr events.</strong> secp256k1 Schnorr signatures, with private messages
                sealed using key agreement, HKDF-SHA256, and XChaCha20-Poly1305.
              </li>
              <li>
                <strong>Implementation.</strong> All cryptographic operations use the{" "}
                <a
                  href="https://github.com/paulmillr/noble-curves"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 transition-colors hover:text-gray-900"
                >
                  @noble
                </a>{" "}
                library suite, which has been independently audited by Cure53.
              </li>
            </ul>
            <p className="text-sm leading-relaxed">
              <strong>
                No cryptographic protection prevents a recipient from copying, screenshotting, or
                forwarding a message after reading it.
              </strong>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">How long data is kept</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-gray-400">
              <li>
                <strong>Undelivered private messages:</strong> until acknowledged, or 24 hours,
                whichever comes first.
              </li>
              <li>
                <strong>Courier envelopes carried for others:</strong> until handed over, or 24
                hours.
              </li>
              <li>
                <strong>Public bulletin-board notices:</strong> until the author's chosen expiry, at
                most seven days.
              </li>
              <li>
                <strong>Conversations, groups, contacts, keys, and media:</strong> until you delete
                them, run a panic wipe, or remove the app.
              </li>
              <li>
                <strong>Anything sent to a Nostr relay:</strong> according to that relay operator's
                own policy, which is outside our control.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Your controls</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-gray-400">
              <li>
                <strong>Panic wipe.</strong> Instantly erase all local keys, messages, queued mail,
                and app data from the Profile screen.
              </li>
              <li>
                <strong>Feature controls.</strong> The Nostr bridge, Tor routing, location channels,
                and the internet gateway can each be disabled in settings. Anything already
                published to a relay cannot be recalled.
              </li>
              <li>
                <strong>System permissions.</strong> Bluetooth, location, microphone, camera, photo
                library, and notification access can each be revoked in your device settings at any
                time. Camera access is used only to scan a contact's QR code.
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
              <strong>
                We have no interest in your personal data and collect none of it (and never will!).
              </strong>
            </p>
            <p className="text-sm leading-relaxed">Two things happen outside our control:</p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-gray-400">
              <li>
                <strong>Hosting logs.</strong> Cloudflare's infrastructure may log standard request
                metadata (IP address, browser, page path) for security and availability purposes. We
                do not access these logs for analytics or share them with any third party.
              </li>
              <li>
                <strong>GitHub API.</strong> The site makes two browser-side requests to GitHub: one
                for the latest release tag and one for the public star count. No user data is
                included in either request.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Children's privacy</h2>
            <p className="text-sm leading-relaxed">
              Airhop has no account registration or age-verification system. The project does not
              knowingly collect personal data from children. Public channel messages, location
              channels, bulletin-board notices, and mesh traffic are visible to other participants
              and may be relayed onward by their devices.
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
