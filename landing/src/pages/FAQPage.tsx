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
        q: "Is Airhop end-to-end encrypted, peer-to-peer, and anonymous?",
        a: (
          <>
            <strong>Peer-to-peer: yes.</strong> The Bluetooth mesh needs no server at all, and the
            optional Nostr relays are swappable and store nothing you depend on.
            <br />
            <br />
            <strong>End-to-end encrypted: yes.</strong>
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>
                Direct messages:{" "}
                <a
                  href="https://noiseprotocol.org/noise.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  Noise XX
                </a>{" "}
                with{" "}
                <a
                  href="https://signal.org/docs/specifications/doubleratchet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  Double Ratchet
                </a>{" "}
                forward secrecy, plus{" "}
                <a
                  href="https://github.com/nostr-protocol/nips/blob/master/17.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  NIP-17
                </a>{" "}
                gift-wrapping when they travel over the internet.
              </li>
              <li>
                Private channels:{" "}
                <a
                  href="https://en.wikipedia.org/wiki/ChaCha20-Poly1305"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  XChaCha20-Poly1305
                </a>{" "}
                under a random 32-byte key that only members hold. Nothing on the wire names the
                channel, so an outsider cannot tell which channel a message belongs to, or that they
                are missing one.
              </li>
              <li>
                Groups: a shared{" "}
                <a
                  href="https://github.com/areebahmeddd/Airhop/blob/main/docs/spec/ARCHITECTURE.md#private-groups-bitchat-compatible"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  epoch key
                </a>{" "}
                that is handed out one member at a time inside an authenticated Noise session, never
                broadcast. Every message is bound to its group and key epoch, so an older key cannot
                be replayed after the key rotates.
              </li>
            </ul>
            The two exceptions are attachments, which are signed rather than encrypted for bitchat
            compatibility (nobody can forge or alter one, but any device relaying it can open it),
            and public geohash channels, which are readable by design since anyone nearby can join
            them.
            <br />
            <br />
            <strong>Anonymous: partially.</strong>
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>
                No phone number, email, or sign-up. Your identity is a key pair generated on-device,
                and nothing registers anywhere (fully anonymous).
              </li>
              <li>
                Geohash channels reveal coarse location, and Nostr relays can see which cells you
                are active in (not anonymous).
              </li>
              <li>
                When messages travel beyond the Bluetooth mesh, only your IP is visible to Nostr
                relays (messages are NIP-17 gift wrapped) until you turn Tor on, which closes that
                gap (anonymous once Tor is on).
              </li>
            </ul>
            The location and metadata trade-offs are inherent to any location-aware mesh.
          </>
        ),
      },
      {
        q: "Is it free?",
        a: "Yes. Airhop is completely free, open-source under MIT, and has no ads, no subscriptions, and no paywall of any kind.",
      },
      {
        q: "Which phones does it work on?",
        a: "Android 8.0 or later, and iPhones on iOS 16.0 or later. A handful of older Android models ship Bluetooth chips that can receive but never advertise; those phones can still join a mesh and read everything, they just will not show up in anyone else's peer list. Everything else works the same on both platforms, because the protocol itself is shared code.",
      },
      {
        q: "Who is it for?",
        a: "Anyone who needs to communicate when normal networks are unavailable or untrustworthy. Journalists, activists, people in disaster zones, protestors, hikers, and anyone who values communication that cannot be shut down by a third party.",
      },
      {
        q: "How is it different from bitchat and other players?",
        a: "Airhop is built on top of bitchat, but extends it with things bitchat doesn't have at the time of writing, like Double Ratchet forward secrecy, Tor on both iOS and Android, offline ecash payments, and an offline AI assistant. Beyond the protocol itself, a big part of the focus is the app people actually use day to day: a clean, simple interface that makes the whole thing easy to pick up, not just something that works well under the hood.",
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
        a: "Images, voice notes, videos, and any other file format, all over Bluetooth using chunked streaming. Large files are split into fragments, paced so the radio is not overrun, and reassembled on the other side. Videos are sent as files and play inline; they are not live streams. Bluetooth carries roughly 22 KB/s, so a file near the 1 MB limit takes about 45 seconds, but it works with no internet at all. On Android to Android or iPhone to iPhone, a faster direct WiFi link is used automatically when both devices support it.",
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
      {
        q: "What is the difference between Classic Bluetooth and Bluetooth Low Energy?",
        a: (
          <>
            They are two modes of the same Bluetooth chip in your phone. Classic Bluetooth is the
            one you already use every day. It pairs two devices and holds the connection open, which
            is what wireless headphones, car audio, and file transfers rely on. It moves data
            quickly, but it drains the battery and only talks to what you have paired. Bluetooth Low
            Energy is the lighter mode. Devices announce themselves and listen in short bursts
            instead of pairing, so one phone can see many nearby devices at once and the radio
            sleeps between packets.
            <br />
            <br />
            Airhop uses Low Energy. Pairing does not work for a mesh where you have never met the
            people around you, and an always-open Classic connection would flatten your battery long
            before the network was useful. Low Energy lets Airhop find peers with no setup and keep
            relaying quietly in the background. The trade is speed, so messages and voice notes
            arrive immediately while a large file takes its time.
          </>
        ),
      },
    ],
  },
  {
    heading: "Everyday use",
    questions: [
      {
        q: "Will it drain my battery?",
        a: "It uses more than an app sitting idle and far less than maps or video. Airhop stays on Bluetooth Low Energy, which listens and announces in short bursts and lets the radio sleep in between, and it slows its own announcements down once it can hear other devices. Relaying for other people costs a little more. If you want it to stop entirely, set your status to Away in Profile: that stops scanning and announcing, and nothing runs until you set it back.",
      },
      {
        q: "Why does a messenger ask for my location?",
        a: "Android ties Bluetooth scanning to the location permission at the system level, so any app that looks for nearby devices has to ask for it, whether or not it cares where you are. Airhop does not read your position for the mesh. The one place it genuinely uses location is the optional location channels, which need a rough area to work out which cell you are in, and you can decline that and still use everything else. Nothing about your position is ever sent to us, because there is no server to send it to.",
      },
      {
        q: "What else does it ask permission for?",
        a: "Bluetooth and nearby devices, to find and talk to peers, which is the one it cannot work without. Notifications, so a message can reach you when the app is closed. Camera, only to scan a contact's QR code. Photos, only when you attach or save one. Microphone, only when you record a voice note. Every one of them can be refused or revoked later in your device settings, and the app keeps working with whatever is left.",
      },
      {
        q: "Does it work in airplane mode?",
        a: "Yes, as long as you switch Bluetooth back on, which both iOS and Android let you do without leaving airplane mode. The mesh then works in full: discovery, channels, direct messages, files, and ecash transfers, none of which touch the internet. The internet features stop, so messages to people who are not nearby queue up and send themselves when a route appears, and cashing ecash out to Lightning has to wait until you are back online.",
      },
      {
        q: "What is the notification that will not swipe away?",
        a: "On Android, that notification is what keeps the mesh alive after you leave the app. Without it the system would suspend Airhop within minutes and you would stop receiving anything. It has a Stop mesh button that shuts the radios down cleanly and takes the notification with it; reopening the app then shows the mesh paused, with a Resume button. iPhones have no equivalent notification, because iOS keeps Bluetooth apps alive differently.",
      },
      {
        q: "Can people tell when I have read their message?",
        a: "In a direct message, yes, the same way most messengers work. The receipt is only sent when the app is actually open in front of you, so a message that arrives while Airhop is in your pocket stays unread until you look at it. Public and location channels have no receipts at all.",
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
            </strong>{" "}
            This means Airhop can be used as a burner app. Your identity lives only on your device,
            so deleting the app erases it, and the next identity you generate has no link to the old
            one.
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
            For contacts you want to fully trust, QR code verification pins their key fingerprint to
            a human name, the same model Signal uses with safety numbers.
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
            it. There is no account recovery for your identity. This is intentional: there is
            nothing for a third party to hand over, subpoena, or breach.
            <br />
            <br />
            <strong>Your ecash balance is the one exception, and only if you opt in.</strong> The
            wallet has a recovery phrase you can turn on, which lets a new device rebuild the
            balance from your mints. It is off by default and covers money only, not your identity,
            chats, or contacts.
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
      {
        q: "Does my phone hold other people's messages?",
        a: (
          <>
            Sometimes, and only ever as sealed ciphertext. This is how a message reaches someone who
            was not around when it was sent: your phone carries it until it meets them, then hands
            it over. <strong>You cannot read anything you carry</strong>, and neither can anyone
            else who touches it, because it is encrypted to the recipient's key before it leaves the
            sender.
            <br />
            <br />
            The limits are deliberately small. At most 40 envelopes at a time, none larger than 16
            KB, and every one is discarded after 24 hours whether or not it was ever delivered. How
            many any single person can leave with you depends on whether you have verified them. It
            costs you a little storage, and it is the reason the network keeps working when people
            are not in the same place at the same time.
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
    heading: "Payments & wallet",
    questions: [
      {
        q: "What is ecash?",
        a: (
          <>
            <a
              href="https://en.wikipedia.org/wiki/Ecash"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Ecash
            </a>{" "}
            is bearer digital cash. A mint issues cryptographically signed tokens worth a fixed
            amount, with no account and no balance sitting on a server.{" "}
            <strong>Whoever holds a token can spend it, like a banknote.</strong> Airhop uses{" "}
            <a
              href="https://cashu.space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Cashu
            </a>
            , an ecash protocol backed by Bitcoin, so tokens move device to device over the mesh
            with no internet in the middle.
          </>
        ),
      },
      {
        q: "Do I need Bitcoin or a Lightning wallet to use Airhop?",
        a: "No. Payments are entirely optional and every other feature works without them. A Lightning wallet is only needed to move sats in or out. Once you have a balance, paying someone next to you needs nothing but Bluetooth.",
      },
      {
        q: "What is a mint, and why do I have to add one?",
        a: (
          <>
            A mint is the server that issues and redeems your ecash. Think of it as a casino
            cashier's desk: you hand over Lightning sats and get chips, the chips move around the
            floor with nobody watching, and anyone can bring them back to the desk for cash.
            <br />
            <br />
            <strong>Airhop is a wallet, not a bank.</strong> It holds your coins; it does not issue
            them. Somebody has to be holding the actual bitcoin, and that is the mint. This is the
            one trust assumption in the whole system, so Airhop ships with no default mint and never
            picks one for you.
            <br />
            <br />
            What you get in exchange is payments that work with no internet, no account, no ID
            check, and no way for the mint to see who you paid.
          </>
        ),
      },
      {
        q: "Which mint should I use?",
        a: (
          <>
            Any Cashu-compatible mint. Airhop checks the URL is a real mint before saving it.
            <br />
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>
                <strong>To try it out:</strong> the community test mints issue free play-money sats,
                so you can walk through every flow with nothing at risk.
              </li>
              <li>
                <strong>For real sats:</strong> pick a publicly run mint with a track record.{" "}
                <a
                  href="https://bitcoinmints.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  bitcoinmints.com
                </a>{" "}
                tracks who is running what.
              </li>
              <li>
                <strong>To trust nobody:</strong> run your own with Nutshell. A Raspberry Pi is
                enough.
              </li>
            </ul>
            Treat the balance like cash in a jacket pocket, not a savings account. Keep small
            amounts, and spread them across mints if you hold more.
          </>
        ),
      },
      {
        q: "How do I get sats in and out?",
        a: (
          <>
            <strong>In:</strong> tap Deposit, enter an amount, and the mint gives you a{" "}
            <a
              href="https://en.wikipedia.org/wiki/Lightning_Network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              Lightning
            </a>{" "}
            invoice. Pay it from any Lightning wallet and the sats arrive as ecash. If you close the
            app mid-payment, Airhop picks the deposit back up next time it opens.
            <br />
            <br />
            <strong>Out:</strong> paste any Lightning invoice into Withdraw. You are quoted the
            amount plus a routing reserve before anything is spent, and whatever routing does not
            use comes back to your balance.
            <br />
            <br />
            These two are the only parts that need the internet, and the only parts that involve
            another app, because Airhop is not a Lightning node.
          </>
        ),
      },
      {
        q: "How do I pay someone with no internet?",
        a: (
          <>
            Send from the Wallet tab, from a chat, or by tapping a peer on the Mesh tab. Airhop
            turns the amount into a token and hands it over as an encrypted Bluetooth message.{" "}
            <strong>
              No server, no relay, no mint. The two phones do the whole thing themselves.
            </strong>
            <br />
            <br />
            The recipient sees a payment card with the amount and a Claim button, not a wall of
            characters.
          </>
        ),
      },
      {
        q: "What happens if I receive a payment while offline?",
        a: (
          <>
            The money is really yours, but Airhop cannot yet confirm nobody spent it first, so it
            shows up as <strong>unconfirmed</strong> on a separate line rather than being folded
            silently into your balance.
            <br />
            <br />
            Offline, Airhop still checks the mint's signature on every token it receives (a{" "}
            <a
              href="https://github.com/cashubtc/nuts/blob/main/12.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              DLEQ proof
            </a>
            ), so a forged token is rejected outright. That proves the mint issued it. It can never
            prove it is unspent, because only the mint knows that. Tap Refresh once you are online
            and the unconfirmed line clears.
          </>
        ),
      },
      {
        q: "What stops someone spending the same token twice?",
        a: (
          <>
            The mint keeps a list of spent tokens, and <strong>whoever redeems first wins.</strong>{" "}
            When you claim a token online, Airhop immediately swaps it for fresh coins only you know
            the secrets to, which kills the sender's copy.
            <br />
            <br />
            Offline there is no way to check, which is inherent to bearer money: a genuine banknote
            can also have been promised to somebody else. In practice, redeem before handing over
            goods to a stranger. With a friend it does not matter.
            <br />
            <br />
            This does mean trusting the mint to keep an honest list, in the same way you trust a
            bank not to miscount withdrawals.
          </>
        ),
      },
      {
        q: "What if I send a payment and it never arrives?",
        a: (
          <>
            Nothing is lost. Building a token does not delete your coins, it{" "}
            <strong>reserves</strong> them: they leave your spendable balance so you cannot spend
            them twice, and sit under Pending until you confirm delivery or reclaim them. Closing
            the app, a crash, or a Bluetooth message that never routes all leave the money
            recoverable.
            <br />
            <br />
            One caveat the app also states before you tap: if the recipient already has the token
            string, reclaiming is a race, and whoever reaches the mint first keeps the money.
          </>
        ),
      },
      {
        q: "Are there fees?",
        a: (
          <>
            Nothing is charged for the transfer itself, and nothing goes to this project.
            <br />
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>
                Mints usually charge a small fee when coins are swapped. Airhop covers it on your
                behalf when you send, so{" "}
                <strong>&ldquo;send 100&rdquo; means they can claim 100</strong>, not 97.
              </li>
              <li>
                Lightning deposits and withdrawals pay normal Lightning routing fees. You see the
                estimate before confirming, and any unused reserve is returned.
              </li>
            </ul>
          </>
        ),
      },
      {
        q: "What happens to my ecash if I lose my phone?",
        a: (
          <>
            By default it is gone. Coins are secrets stored only on that device, so the bitcoin
            stays at the mint and nobody can ever claim it again.
            <br />
            <br />
            <strong>Turn on the recovery phrase to change that.</strong> Airhop generates twelve
            words and derives your coins from them instead of from random numbers, so a new phone
            can rebuild the balance by asking your mints which coins they signed. Write the words on
            paper, keep your mint list beside them, and never store them on the phone they protect.
            <br />
            <br />
            Two things it does not cover: your identity, chats and contacts, which have no backup at
            all; and coins somebody gave you that you never refreshed, since those carry the
            sender's secrets until they are swapped. The wallet shows exactly how much falls into
            that second category.
          </>
        ),
      },
      {
        q: "Why does Airhop say my balance is split across mints?",
        a: (
          <>
            A token names exactly one mint, so ecash from two different mints can never be combined
            into a single payment. With 60 sats at one and 60 at another you cannot send 100, even
            though the total says 120. That is how Cashu works, not something an app can code
            around.
            <br />
            <br />
            You can send two separate payments, or use <strong>Move to one mint</strong>, which has
            one mint pay a Lightning invoice issued by the other so the balance ends up in one
            place. It costs a small routing fee and needs internet.
          </>
        ),
      },
      {
        q: "What is a nutzap?",
        a: (
          <>
            Paying someone by their Nostr identity over the internet, using{" "}
            <a
              href="https://github.com/nostr-protocol/nips/blob/master/61.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
            >
              NIP-61
            </a>
            . The ecash is locked to their public key, so only they can spend it even though the
            event is public.
            <br />
            <br />
            Worth knowing: <strong>a nutzap is a public event.</strong> The money is safe, but
            relays and anyone watching can see that one identity paid another, and how much. If they
            have not published nutzap details, Airhop falls back to an encrypted Nostr message
            instead and tells you which of the two happened.
          </>
        ),
      },
      {
        q: "Does Tor cover payments?",
        a: (
          <>
            On Android, yes. Orbot runs as a VPN and covers every connection, mint traffic included.
            <br />
            <br />
            On iPhone, not yet. Tor there only wraps the Nostr connection, so a mint request would
            reveal your IP address alongside your coins. Rather than leak that quietly,{" "}
            <strong>Airhop blocks mint requests while Tor is on</strong> and explains why, with an
            opt-in switch under Settings if you decide you do not mind.
            <br />
            <br />
            Sending and receiving over Bluetooth never touches a mint, so that keeps working with
            Tor on either way.
          </>
        ),
      },
      {
        q: "What happens if the mint disappears or steals the money?",
        a: (
          <>
            You lose whatever was at that mint. A mint is a custodian, and this is the honest
            trade-off for offline, account-free, private payments.
            <br />
            <br />
            It is a limited custodian, though. It cannot see who you are, who you pay, or link the
            coins you deposited to the ones you spend, so it cannot single you out or freeze one
            person's funds. And balances in Airhop are kept per mint and never pooled, so one mint
            failing cannot take the rest. Keep small amounts, and run your own mint if the trade is
            not acceptable to you.
          </>
        ),
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
                  <div className="mt-3 pr-6 text-sm leading-relaxed text-gray-600">{item.a}</div>
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
