import EnglishContent from "@/components/ui/EnglishContent";
import PageHeader from "@/components/ui/PageHeader";
import TextLink from "@/components/ui/TextLink";
import { useSEO } from "@/hooks/useSEO";
import { formatDate, useLanguage, useT } from "@/i18n";
import { REPO_LINKS, REPO_URL } from "@/lib/links";
import { LAST_UPDATED, SEO } from "@/lib/seo";

export default function PrivacyPage() {
  const T = useT();
  const language = useLanguage();

  useSEO(SEO["/privacy-policy"]);

  return (
    <main id="main-content">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <PageHeader
          eyebrow={T("page.legal.eyebrow")}
          title={T("page.privacy.title")}
          meta={T("common.last_updated", { date: formatDate(language, LAST_UPDATED) })}
        />

        <EnglishContent className="text-secondary mt-14">
          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Summary</h2>
            <ul className="marker:text-mute list-disc space-y-2 pl-5 text-[15px] leading-[1.75]">
              <li>No project-operated accounts or messaging servers.</li>
              <li>No analytics, advertising, telemetry, or tracking of any kind.</li>
              <li>No sale of user data.</li>
              <li>Your identity is a cryptographic key pair that never leaves your device.</li>
              <li>
                All source code is{" "}
                <TextLink href={REPO_URL} tone="quiet">
                  open source
                </TextLink>
                . The storage, networking, and cryptography described here can be verified in the
                code.
              </li>
            </ul>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">What Airhop stores on your device</h2>
            <p className="text-[15px] leading-[1.75]">
              Airhop stores data only on your device. None of it is transmitted to us.
            </p>
            <ul className="marker:text-mute list-disc space-y-2.5 pl-5 text-[15px] leading-[1.75]">
              <li>
                <strong>Identity keys.</strong> An Ed25519 signing key and a Noise static key are
                generated locally on first launch and stored in your device's secure storage (iOS
                Keychain or Android Keystore). A Nostr key, a separate identity for each location
                cell you use, and one-time prekeys are all derived from that signing key rather than
                stored separately. Your public keys are shared with peers you communicate with.{" "}
                <strong>Private keys never leave your device.</strong>
              </li>
              <li>
                <strong>Display name and preferences.</strong> Your generated display name and app
                settings are stored locally.
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
                receive are written to the app's cache so they stay viewable. They are deleted
                automatically once they pass the retention window set in Privacy (seven days by
                default), and also by panic wipe, by clearing the cache in settings, or by removing
                the app.
              </li>
              <li>
                <strong>Queued outgoing messages.</strong> A private message that has not yet been
                delivered stays in a local queue on your device so it can be sent once the recipient
                is reachable again. It is <strong>dropped after seven days</strong> if it never goes
                through.
              </li>
              <li>
                <strong>Courier envelopes.</strong> If your device acts as a mesh courier for
                another user, it may hold an opaque end-to-end encrypted envelope for up to 24
                hours. <strong>The courier cannot read the contents.</strong>
              </li>
              <li>
                <strong>Ecash wallet.</strong> Cashu tokens are bearer instruments, so they are kept
                in a separate file encrypted with AES-256 under a key held in your device's secure
                storage. The same file holds the mints you added, their public keys, and your
                transaction history (amounts, timestamps, and the mint involved). If a recovery
                phrase is set up, the twelve words live in secure storage alongside your identity
                keys, never in the wallet file.{" "}
                <strong>
                  No payment backend is involved and none of this is transmitted to us.
                </strong>
              </li>
            </ul>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">What is shared with nearby peers</h2>
            <p className="text-[15px] leading-[1.75]">
              When the app is running, nearby mesh devices can receive:
            </p>
            <ul className="marker:text-mute list-disc space-y-2 pl-5 text-[15px] leading-[1.75]">
              <li>
                Your display name, which the app generates from your public key, and your public
                identity keys.
              </li>
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
                Live voice, if you turn it on. Holding the mic streams your voice to everyone in
                Bluetooth range as you speak. A public burst is signed but not encrypted, the same
                as an attachment. In a direct message it stays inside that peer's encrypted session.
                Nothing is recorded on either device.
              </li>
              <li>
                A screenshot notice, in private conversations only. Taking a screenshot in a direct
                message, private group, or private channel tells the people in it that you did,
                under your display name. In the public mesh room and location channels nothing is
                sent, because announcing it there would record that you were present. The screenshot
                itself is never sent.
              </li>
              <li>
                Approximate Bluetooth signal strength (radio metadata visible to any nearby
                receiver).
              </li>
            </ul>
            <p className="text-[15px] leading-[1.75]">
              Private text messages are encrypted end-to-end and readable only by the intended
              recipient. Public channel messages are visible to all participants in that channel.
            </p>
            <p className="text-[15px] leading-[1.75]">
              <strong>
                Attachments are an exception: photos, videos, voice notes, and files are signed but
                not encrypted.
              </strong>{" "}
              This is the format bitchat uses, and matching it is what lets the two apps exchange
              media at all. Because attachments relay hop by hop, any device carrying one can read
              it. Treat an attachment as visible to the mesh, not private.
            </p>
            <p className="text-[15px] leading-[1.75]">
              Nearby mesh devices are not limited to Airhop.{" "}
              <TextLink href="https://bitchat.free" tone="quiet">
                bitchat
              </TextLink>{" "}
              is a separate, compatible app that can join the same mesh and receive this same data.
              bitchat is an independent project with its own codebase, not operated or audited by
              us.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Nostr and the internet (optional)</h2>
            <p className="text-[15px] leading-[1.75]">
              When Airhop uses the internet, it connects to public or user-selected Nostr relays to
              extend conversations beyond Bluetooth range.
            </p>
            <ul className="marker:text-mute list-disc space-y-2 pl-5 text-[15px] leading-[1.75]">
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

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Location channels (optional)</h2>
            <p className="text-[15px] leading-[1.75]">
              Location channels let you talk to people in the same area. Location permission is
              optional and only requested when you use them.
            </p>
            <ul className="marker:text-mute list-disc space-y-2 pl-5 text-[15px] leading-[1.75]">
              <li>
                <strong>Exact coordinates never leave your device</strong> and are never stored.
                Your position is truncated to a grid cell, and the smallest cell we ever publish is
                roughly 150 meters across.
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

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Ecash payments (optional)</h2>
            <p className="text-[15px] leading-[1.75]">
              Payments are off until you add a mint. Sending and receiving ecash over Bluetooth
              involves no server, no relay, and no mint: the two devices do it themselves, and
              nothing about the payment leaves them.
            </p>
            <p className="text-[15px] leading-[1.75]">
              Talking to a mint is different, and only happens when you deposit, withdraw, refresh,
              or claim a token while online.
            </p>
            <ul className="marker:text-mute list-disc space-y-2 pl-5 text-[15px] leading-[1.75]">
              <li>
                <strong>What a mint can see.</strong> Your IP address, the amounts you deposit and
                withdraw, and when. Mints are third parties whose retention and privacy practices
                are outside this project's control.
              </li>
              <li>
                <strong>What a mint cannot see.</strong> Who you are, who you paid, or which coins
                you deposited became which coins you spent. Cashu signs tokens blindly, so that link
                is severed by the maths rather than by policy.
              </li>
              <li>
                <strong>Tor.</strong> On Android, Orbot covers mint traffic along with everything
                else. On iOS, Tor only wraps Nostr connections, so{" "}
                <strong>mint requests are blocked while Tor is on</strong> unless you opt in beside
                the Tor switch in Settings. Mesh payments are unaffected either way.
              </li>
              <li>
                <strong>Nutzaps are public.</strong> A NIP-61 nutzap is an unencrypted Nostr event.
                The ecash is locked to the recipient so nobody else can spend it, but relays and
                observers can see that one public key paid another, and the amount. The
                encrypted-message fallback does not have this property.
              </li>
              <li>
                <strong>Recovery phrase.</strong> Optional and off by default. It is stored only in
                your device's secure storage, is never transmitted, and is never shown to a mint.
                Anyone who obtains it can spend your balance.
              </li>
            </ul>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Tor routing (optional)</h2>
            <p className="text-[15px] leading-[1.75]">
              Airhop supports routing Nostr traffic through Tor using Arti on iOS or Orbot on
              Android. When enabled,{" "}
              <strong>relay operators cannot observe your IP address.</strong> Tor is off by
              default.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Mesh bridge (optional)</h2>
            <p className="text-[15px] leading-[1.75]">
              A device with the mesh bridge enabled links your area's public #bluetooth channel with
              another Bluetooth crowd out of radio range, carrying that public chat between them
              over the internet. It only ever touches public #bluetooth traffic, never your private
              messages, and every bridged message stays signed by its original author, so the bridge
              cannot read private content or alter what it carries. A per-message "nearby only"
              control keeps any single message off the internet. Enabling it uses your own data
              connection and battery. Mesh bridge is off by default.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Internet gateway (optional)</h2>
            <p className="text-[15px] leading-[1.75]">
              A device with the gateway setting enabled relays location-channel messages on behalf
              of nearby devices that have no internet connection. The relayed messages are already
              public to that channel and are signed by their original author, so a gateway cannot
              read private content or alter what it carries. Enabling it uses your own data
              connection and battery. Internet gateway is off by default.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Cryptography</h2>
            <ul className="marker:text-mute list-disc space-y-2 pl-5 text-[15px] leading-[1.75]">
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
                <strong>Ecash.</strong> Cashu blind signatures, which stop a mint linking issuance
                to redemption, plus DLEQ proofs that let your device verify a token was genuinely
                signed by its mint with no network connection.
              </li>
              <li>
                <strong>Implementation.</strong> All cryptographic operations use the{" "}
                <TextLink href="https://github.com/paulmillr/noble-curves" tone="quiet">
                  @noble
                </TextLink>{" "}
                library suite, which has been independently audited by Cure53.
              </li>
            </ul>
            <p className="text-[15px] leading-[1.75]">
              <strong>
                No cryptographic protection prevents a recipient from copying, screenshotting, or
                forwarding a message after reading it.
              </strong>{" "}
              Airhop tells the other side when you screenshot a private conversation, but that is a
              courtesy notice, not a control.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">How long data is kept</h2>
            <ul className="marker:text-mute list-disc space-y-2 pl-5 text-[15px] leading-[1.75]">
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
                <strong>Media attachments:</strong> deleted automatically after the window you
                choose in Privacy (7 days by default, or 14 or 30). There is no keep-forever option.
                Also removed by clearing the cache, a panic wipe, or removing the app.
              </li>
              <li>
                <strong>Conversations, groups, contacts, and keys:</strong> until you delete them,
                run a panic wipe, or remove the app.
              </li>
              <li>
                <strong>Wallet transaction history:</strong> the most recent 500 entries, until you
                run a panic wipe or remove the app.
              </li>
              <li>
                <strong>Anything sent to a Nostr relay:</strong> according to that relay operator's
                own policy, which is outside our control.
              </li>
            </ul>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Your controls</h2>
            <ul className="marker:text-mute list-disc space-y-2 pl-5 text-[15px] leading-[1.75]">
              <li>
                <strong>Panic wipe.</strong> Instantly erase all local keys, messages, queued mail,
                and app data from the Profile screen.
              </li>
              <li>
                <strong>Feature controls.</strong> Tor routing, the mesh bridge, and the internet
                gateway can each be turned on or off in settings, and location channels left
                unjoined. Anything already published to a relay cannot be recalled.
              </li>
              <li>
                <strong>Wallet.</strong> Remove a mint at any time from the Wallet tab. Removing one
                deletes the coins held there from this device, so withdraw or send them first. A
                panic wipe destroys the wallet file and its encryption key together.
              </li>
              <li>
                <strong>System permissions.</strong> Bluetooth, location, microphone, camera, photo
                library, and notification access can each be revoked in your device settings at any
                time. Camera access is used to scan QR codes and to take photos or videos you choose
                to send.
              </li>
            </ul>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">This website</h2>
            <p className="text-[15px] leading-[1.75]">
              airhop.1mindlabs.org is a static informational site deployed on{" "}
              <TextLink href="https://pages.cloudflare.com" tone="quiet">
                Cloudflare Pages
              </TextLink>
              . It has no user accounts, no cookies, and no analytics.{" "}
              <strong>
                We have no interest in your personal data and collect none of it (and never will!).
              </strong>
            </p>
            <p className="text-[15px] leading-[1.75]">
              The relay map is drawn from data bundled into the site at build time. Viewing it
              contacts no one.
            </p>
            <p className="text-[15px] leading-[1.75]">Two things happen outside our control:</p>
            <ul className="marker:text-mute list-disc space-y-2 pl-5 text-[15px] leading-[1.75]">
              <li>
                <strong>Hosting logs.</strong> Cloudflare's infrastructure may log standard request
                metadata (IP address, browser, page path) for security and availability purposes. We
                do not access these logs for analytics or share them with any third party.
              </li>
              <li>
                <strong>GitHub API.</strong> The site makes one browser-side request to GitHub, for
                the latest release tag shown in the header. No user data is included in it.
              </li>
            </ul>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Children's privacy</h2>
            <p className="text-[15px] leading-[1.75]">
              Airhop has no account registration or age-verification system. The project does not
              knowingly collect personal data from children. Public channel messages, location
              channels, bulletin-board notices, and mesh traffic are visible to other participants
              and may be relayed onward by their devices.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Changes to this policy</h2>
            <p className="text-[15px] leading-[1.75]">
              Material changes will be reflected in this document and its updated date. Because no
              personal data is held on project servers, a policy change cannot affect data that
              exists only on your device.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Contact</h2>
            <p className="text-[15px] leading-[1.75]">
              Questions about this policy can be sent to{" "}
              <TextLink href="mailto:hi@areeb.dev" tone="quiet">
                hi@areeb.dev
              </TextLink>{" "}
              or raised by opening an issue on{" "}
              <TextLink href={REPO_LINKS.issues} tone="quiet">
                GitHub
              </TextLink>
              .
            </p>
          </section>
        </EnglishContent>
      </div>
    </main>
  );
}
