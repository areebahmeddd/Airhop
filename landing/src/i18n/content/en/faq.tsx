import TextLink from "@/components/ui/TextLink";
import { REPO_LINKS, REPO_URL } from "@/lib/links";

export interface FaqSection {
  heading: string;
  questions: { q: string; a: React.ReactNode }[];
}

export const FAQ_SECTIONS: FaqSection[] = [
  {
    heading: "Basics",
    questions: [
      {
        q: "What is Airhop?",
        a: (
          <>
            Airhop is an open-source iOS and Android app for private, peer-to-peer messaging over
            Bluetooth mesh. There are no central servers. Messages relay automatically across nearby
            devices up to 7 hops. <strong>It works with zero internet connectivity.</strong>
          </>
        ),
      },
      {
        q: "Who is it for?",
        a: "Anyone who needs to communicate when normal networks are unavailable or untrustworthy. Journalists, activists, people in disaster zones, protestors, hikers, and anyone who values communication that cannot be shut down by a third party.",
      },
      {
        q: "Is it free?",
        a: (
          <>
            Yes. Airhop is completely free, open-source under the{" "}
            <TextLink href={REPO_LINKS.license}>MIT license</TextLink>, and has{" "}
            <strong>no ads, no subscriptions, and no paywall of any kind.</strong>
          </>
        ),
      },
      {
        q: "Which phones does it work on?",
        a: "Android 8.0 or later, and iPhones on iOS 16.0 or later. A handful of older Android models ship Bluetooth chips that can receive but never advertise; those phones can still join a mesh and read everything, they just will not show up in anyone else's peer list. Everything else works the same on both platforms, because the protocol itself is shared code.",
      },
      {
        q: "How is it different from bitchat and other apps?",
        a: (
          <>
            Most private messengers fall into three groups. Apps like Signal and Session are strong
            on privacy but need the internet, so they go down when the network does. Meshtastic and
            goTenna work offline but only with a separate radio you have to buy and carry. Briar,
            Berty, Bridgefy and <TextLink href="https://bitchat.free">bitchat</TextLink> run phone
            to phone on hardware you already own, and that is where Airhop sits.
            <br />
            <br />
            Against bitchat specifically, Airhop is built on top of it and stays wire-compatible,
            but adds Double Ratchet forward secrecy, Tor on both iOS and Android, offline ecash
            payments, and an offline AI assistant, none of which bitchat has today. Beyond the
            protocol itself, <strong>user experience is everything to us</strong>. Great privacy
            tools should be easy to use, not something people have to figure out.
          </>
        ),
      },
      {
        q: "What does Airhop deliberately not do?",
        a: (
          <>
            Some things are missing because they are still being built, and some because they cannot
            work without breaking something that matters more. The second kind:
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>
                <strong>No voice or video calling.</strong> The fast transports that could carry a
                call are different protocols on iPhone and Android with no bridge between them, so
                it could never work across the two. Holding the mic to talk live is what replaces
                it.
              </li>
              <li>
                <strong>Only text crosses the internet.</strong> Photos, files, and voice notes ride
                Bluetooth, so sending one needs the other person in range.
              </li>
              <li>
                <strong>1 MB per file.</strong> bitchat refuses anything larger the moment it
                decodes the packet, so a bigger file would be dropped outright by half the mesh.
              </li>
              <li>
                <strong>Attachments do not queue.</strong> A text message waits on your phone until
                a route appears. A file has to leave while a link exists, so it fails and offers a
                retry rather than sitting in a queue that may never drain.
              </li>
              <li>
                <strong>No cloud backup.</strong> Nothing is stored off your phone, so losing the
                phone loses the history. That is the trade for having nothing to seize or subpoena.
              </li>
            </ul>
            Desktop, browser, terminal, and watch clients are not here yet, but those are planned
            rather than ruled out. The <TextLink href={REPO_LINKS.roadmapDoc}>roadmap</TextLink>{" "}
            tracks what is next.
          </>
        ),
      },
    ],
  },
  {
    heading: "Messaging",
    questions: [
      {
        q: "What is the difference between channels, groups, and location channels?",
        a: (
          <>
            There are four kinds of room, and what separates them is who can get in.
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Public channels:</strong> anyone in Bluetooth range who types the name is in
                it. Nothing is registered anywhere, nobody owns it, and it stays on the local mesh.
              </li>
              <li>
                <strong>Location channels:</strong> public as well, but scoped to a map cell instead
                of a name, from a single block up to a whole region. Your own cell opens
                automatically, and entering a geohash takes you to any other. These bridge over the
                internet, so you can read a place you are not standing in.
              </li>
              <li>
                <strong>Private channels:</strong> invite-only. The key travels inside the invite
                link, so anyone holding the link can read, and there is no member limit. Built for a
                crowd that has to grow faster than anyone could add people by hand.
              </li>
              <li>
                <strong>Private groups:</strong> a fixed roster instead of a link. The creator signs
                a member list of up to 16 and hands the key to each person individually, so nobody
                can forward their way in. Bluetooth only.
              </li>
            </ul>
          </>
        ),
      },
      {
        q: "Can I block someone?",
        a: (
          <>
            Yes. Open the direct conversation from your chat list and pick Block contact. Everything
            from that peer is then dropped at a single point before it can reach any chat: channel
            messages, direct messages, files, and anything arriving over Nostr. They also stop
            appearing on your Mesh tab. The block is saved, so it survives restarting the app, and
            you can lift it later under Settings then Security.
            <br />
            <br />
            <strong>Blocking is one-sided and local to your phone</strong>, so it hides them from
            you rather than announcing anything to them. Your device also keeps relaying mesh
            traffic that happens to route through it, theirs included, because refusing would
            degrade the network for everyone else routing through you. None of that relayed traffic
            is ever shown to you.
          </>
        ),
      },
      {
        q: "Can people tell when I have read their message?",
        a: "In a direct message, yes, the same way most messengers work. The receipt is only sent when the app is actually open in front of you, so a message that arrives while Airhop is in your pocket stays unread until you look at it. Public and location channels have no receipts at all.",
      },
      {
        q: "Can I talk instead of typing?",
        a: (
          <>
            Yes. Hold the mic button and it behaves like a walkie-talkie: your voice leaves as you
            speak and arrives about half a second later, instead of being recorded and sent when you
            let go. When you release it, the same audio also lands in the chat as an ordinary voice
            note, so anyone who was out of range or joined late still gets it.
            <br />
            <br />
            It is offered in the public Bluetooth channel and in direct messages.{" "}
            <strong>Private channels and groups are excluded on purpose</strong>: a live burst in a
            room is broadcast unencrypted, so streaming one into a room whose text is encrypted
            would quietly undo the thing that makes it private. Location channels are excluded too,
            since that would put your voice on public relays. Holding the mic in any of them records
            a voice note instead, and it does the same when nobody is in range to hear you live, so
            the same gesture always produces something.
            <br />
            <br />
            Live voice can be switched off entirely in Settings, and incoming audio only plays while
            you have that conversation open in front of you. The{" "}
            <TextLink href="/architecture">architecture page</TextLink> describes how the frames
            travel.
          </>
        ),
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
            For communication beyond Bluetooth range, Airhop automatically uses the{" "}
            <TextLink href="https://fiatjaf.com/nostr.html">Nostr</TextLink> internet fallback to
            reach a contact who is online but out of range. Location channels also require a
            connection.
          </>
        ),
      },
      {
        q: "What is the difference between Classic Bluetooth and Bluetooth Low Energy?",
        a: (
          <>
            They are two modes of the same Bluetooth chip in your phone.{" "}
            <TextLink href="https://en.wikipedia.org/wiki/Bluetooth">Classic Bluetooth</TextLink> is
            the one you already use every day. It pairs two devices and holds the connection open,
            which is what wireless headphones, car audio, and file transfers rely on. It moves data
            quickly, but it drains the battery and only talks to what you have paired.{" "}
            <TextLink href="https://en.wikipedia.org/wiki/Bluetooth_Low_Energy">
              Bluetooth Low Energy
            </TextLink>{" "}
            is the lighter mode. Devices announce themselves and listen in short bursts instead of
            pairing, so one phone can see many nearby devices at once and the radio sleeps between
            packets.
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
      {
        q: "How does the mesh relay messages?",
        a: "Every phone listens and announces at the same time, so each one is both a receiver and a relay. When a message arrives, your phone checks its signature, drops it if it has already seen it, and passes it on with one of its 7 hops used up. It waits a random fraction of a second first, somewhere between 10 and 220 milliseconds, so that a room full of phones does not all speak at once and drown each other out. Each phone forwards to a sample of nearby devices rather than everyone in range, which is why a crowded mesh does not carry more traffic than a quiet one.",
      },
      {
        q: "How far can messages travel?",
        a: "Each hop covers roughly 10 to 30 meters indoors and up to 100 in the open, and a message is allowed 7 of them, so it can cross a few hundred meters before it stops. The more people around you have Airhop, the further it reaches, because every one of their phones is another relay. Messages held for someone who is not around have no range limit at all: your phone simply carries them until a path to that person exists, however long that takes. That applies to text. An attachment is not carried this way and needs a live link at the moment you send it.",
      },
      {
        q: "What media can I send?",
        a: "Images, voice notes, videos, and any other file format, all over Bluetooth using chunked streaming. Large files are split into fragments, paced so the radio is not overrun, and reassembled on the other side. Videos are sent as files and play inline; they are not live streams. The 1 MB ceiling is bitchat's, enforced the moment it decodes a packet, so raising it would mean every bitchat peer silently dropping the file; photos and voice notes are capped tighter at 512 KB for the same reason. Bluetooth carries roughly 19 KB/s, so a file near the 1 MB limit takes about 56 seconds, but it works with no internet at all. On Android to Android or iPhone to iPhone, a faster direct WiFi link is used automatically when both devices support it.",
      },
      {
        q: "Why is there no video or voice calling?",
        a: (
          <>
            Two reasons, and neither of them is a to-do.
            <br />
            <br />
            <strong>Bandwidth.</strong> Bluetooth Low Energy moves roughly 19 KB/s on a link. Live
            voice fits inside that at about 2 KB/s, which is exactly why holding the mic works.
            Video does not fit at any quality worth watching, so a call would have to ride the fast
            transports instead.
            <br />
            <br />
            <strong>The fast transports cannot talk to each other.</strong> They are WiFi Aware on
            Android and MultipeerConnectivity on iPhone: different protocols, with no bridge between
            them. A call built on either could only ever connect Android to Android, or iPhone to
            iPhone. A calling feature that fails on half the pairs is worse than none, so the video
            packet type was removed from the protocol rather than shipped half working.
            <br />
            <br />
            What you get instead is live push-to-talk voice, which covers what a call on a mesh is
            usually for, and video as a file that plays inline in the chat.
          </>
        ),
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
            is documented in <TextLink href={REPO_LINKS.protocolsDoc}>PROTOCOLS.md</TextLink>.
          </>
        ),
      },
    ],
  },
  {
    heading: "Nostr & the internet",
    questions: [
      {
        q: "What is the internet fallback?",
        a: (
          <>
            When you and a contact are out of Bluetooth range and internet is available, Airhop uses{" "}
            <TextLink href="https://fiatjaf.com/nostr.html">Nostr</TextLink> relays as an optional
            internet fallback to continue the conversation. Messages are sent as{" "}
            <TextLink href="https://github.com/nostr-protocol/nips/blob/master/17.md">
              NIP-17
            </TextLink>{" "}
            gift-wrapped direct messages, so relay operators cannot read them.
          </>
        ),
      },
      {
        q: "Why can't I send a photo or file over the internet?",
        a: (
          <>
            Because the fallback carries text, not media. Attachments travel on the Bluetooth
            file-transfer path and are never bridged to Nostr, so the attach button is offered only
            where the file can actually arrive: the public Bluetooth channel, and direct messages
            with someone reachable over the mesh. It is missing in location channels, in a cell you
            have teleported into, and in a conversation with someone you only know through a relay,
            because everyone there is reached over the internet and the file would go nowhere.
            <br />
            <br />
            It is missing in private channels and groups for a different reason. An attachment is
            signed but not encrypted, for bitchat compatibility, so broadcasting one into a room
            whose text is encrypted would quietly undo the privacy of that room. bitchat draws the
            same line in the same places, which is part of how the two apps stay predictable to each
            other.
            <br />
            <br />
            In practice:{" "}
            <strong>text reaches anyone, anywhere; media waits until you are near</strong>. And
            unlike a text message, an attachment does not sit in a queue and send itself later. The
            send fails while nobody is in range, and you retry it when somebody is.
          </>
        ),
      },
      {
        q: "Do I have to use Nostr?",
        a: "No. The internet fallback is optional. If you prefer to stay purely on the BLE mesh, you can. The app works fully offline without any Nostr configuration.",
      },
      {
        q: "Is Nostr centralized, web3, or decentralized?",
        a: (
          <>
            Neither{" "}
            <TextLink href="https://en.wikipedia.org/wiki/Centralisation">centralized</TextLink> nor{" "}
            <TextLink href="https://en.wikipedia.org/wiki/Web3">web3</TextLink>. There is no
            blockchain, no token, and no company that owns it. Nostr relays are just servers run by
            independent operators on any hosting provider, not only a couple of big cloud platforms,
            so no single relay can lock you out or control the network. You are not tied to one
            relay either. If an operator disappears or blocks you, you move to another. That is what
            makes it{" "}
            <TextLink href="https://en.wikipedia.org/wiki/Decentralization">decentralized</TextLink>
            : not a blockchain consensus mechanism, just nobody being able to own the whole network.
          </>
        ),
      },
      {
        q: "Why Nostr, and what else did you consider?",
        a: (
          <>
            <p>
              Nostr is a plain publish-and-relay protocol over WebSockets: your identity is just a
              keypair, there are no accounts or phone numbers, and relays only forward encrypted
              data they cannot read. Airhop already carries a keypair for the mesh, so it reuses
              that with nothing extra to set up. Hundreds of public relays already run on
              independent hosts, so there is nothing for us to operate and no single server to
              trust, and it is the same protocol bitchat uses, so the two apps meet on the same
              relays and stay interoperable.
            </p>
            <p className="mt-3">
              Every alternative pulled the design back toward a single point of control. The
              traditional approach, plain{" "}
              <TextLink href="https://en.wikipedia.org/wiki/Transmission_Control_Protocol">
                TCP
              </TextLink>{" "}
              or{" "}
              <TextLink href="https://en.wikipedia.org/wiki/User_Datagram_Protocol">UDP</TextLink>{" "}
              connections to a server we run, means one machine at a fixed address that everyone
              must trust and anyone can block or seize, on top of firewall and NAT hurdles.
              Federated servers like <TextLink href="https://matrix.org">Matrix</TextLink> or{" "}
              <TextLink href="https://xmpp.org">XMPP</TextLink> soften that but still need accounts
              and a homeserver you run or trust. Fully peer-to-peer stacks like{" "}
              <TextLink href="https://waku.org">Waku</TextLink> or{" "}
              <TextLink href="https://libp2p.io">libp2p</TextLink> match the spirit but carry a
              heavy peer-discovery layer with far fewer ready public nodes.{" "}
              <TextLink href="https://scuttlebutt.nz">Secure Scuttlebutt</TextLink> keeps a
              permanent, fully replicated log of everything, the opposite of an ephemeral messenger.
              Nostr is the smallest option that stays serverless in practice, asks nothing of us,
              and already interoperates with bitchat.
            </p>
          </>
        ),
      },
      {
        q: "Does the internet fallback compromise privacy?",
        a: "No. NIP-17 gift-wrapping encrypts the message content and hides the sender and recipient identities from relay operators. Metadata is minimal. You can also route Nostr traffic through Tor for additional network-level privacy.",
      },
      {
        q: "What is the difference between the internet gateway and the mesh bridge?",
        a: "Both use the internet to extend the mesh, but they do different jobs. The internet gateway lends your connection to a nearby offline phone so it can still reach the location channels. The mesh bridge links your area's public #bluetooth chat with another Bluetooth crowd that is out of radio range, over the internet, so two separated groups share one conversation. Both are off by default, both only ever touch public traffic and never your DMs, and each has its own switch in Settings. A per-message 'nearby only' control keeps any single bridged message off the internet.",
      },
      {
        q: "Can I run my own Nostr relay?",
        a: (
          <>
            Yes, and Airhop's custom relay support is built for it. A relay is just a small
            always-on server, and a 1 GB VPS runs a personal or small-community one for a few
            dollars a month. Popular open-source options are{" "}
            <TextLink href="https://github.com/hoytech/strfry">strfry</TextLink> (fast, C++),
            nostr-rs-relay (lightweight, Rust and SQLite), and{" "}
            <TextLink href="https://github.com/fiatjaf/khatru">khatru</TextLink> (a Go framework
            from Nostr's creator, for building your own). If you would rather not touch a terminal,
            the <TextLink href="https://apps.umbrel.com/app/nostr-relay">Umbrel</TextLink> and
            Start9 app stores install a relay in one click on a home server. One requirement: Airhop
            accepts only secure public relays, so put yours behind a domain with TLS (a reverse
            proxy like Caddy, or a Cloudflare Tunnel) and reach it at wss://your-relay.example.com.
            Plain ws://, IP addresses, and local names are rejected, the same bar other Nostr
            clients and bitchat use. Then add the URL under Network &amp; Relays → Custom relays.
          </>
        ),
      },
      {
        q: "Does Airhop use Tor?",
        a: (
          <>
            Yes, optionally, on both platforms.{" "}
            <TextLink href="https://torproject.org">Tor</TextLink> covers Nostr traffic
            specifically. iOS uses <TextLink href="https://arti.torproject.org">Arti</TextLink>,
            Android uses{" "}
            <TextLink href="https://guardianproject.info/apps/org.torproject.android/">
              Orbot
            </TextLink>
            . When enabled, all Nostr relay traffic is routed over Tor. It has no effect on the BLE
            mesh itself, which never touches the internet either way.
          </>
        ),
      },
    ],
  },
  {
    heading: "Privacy & security",
    questions: [
      {
        q: "Is Airhop end-to-end encrypted, peer-to-peer, and anonymous?",
        a: (
          <>
            <strong>
              <TextLink href="https://en.wikipedia.org/wiki/Peer-to-peer">Peer-to-peer</TextLink>:
              yes.
            </strong>{" "}
            The Bluetooth mesh needs no server at all, and the optional Nostr relays are swappable
            and store nothing you depend on.
            <br />
            <br />
            <strong>
              <TextLink href="https://en.wikipedia.org/wiki/End-to-end_encryption">
                End-to-end encrypted
              </TextLink>
              : yes.
            </strong>
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Direct messages:</strong>{" "}
                <TextLink href="https://noiseprotocol.org/noise.html">Noise XX</TextLink> with{" "}
                <TextLink href="https://signal.org/docs/specifications/doubleratchet/">
                  Double Ratchet
                </TextLink>{" "}
                forward secrecy, plus{" "}
                <TextLink href="https://github.com/nostr-protocol/nips/blob/master/17.md">
                  NIP-17
                </TextLink>{" "}
                gift-wrapping when they travel over the internet.
              </li>
              <li>
                <strong>Private channels:</strong>{" "}
                <TextLink href="https://en.wikipedia.org/wiki/ChaCha20-Poly1305">
                  XChaCha20-Poly1305
                </TextLink>{" "}
                under a random 32-byte key that only members hold. Nothing on the wire names the
                channel, so an outsider cannot tell which channel a message belongs to, or that they
                are missing one.
              </li>
              <li>
                <strong>Private groups:</strong> a shared epoch key that is handed out one member at
                a time inside an authenticated Noise session, never broadcast. Every message is
                bound to its group and key epoch, so an older key cannot be replayed after the key
                rotates.
              </li>
            </ul>
            The exceptions are attachments, which are signed rather than encrypted for bitchat
            compatibility (nobody can forge or alter one, but any device relaying it can open it),
            live voice in a public room, which is broadcast the same way while you hold the mic (a
            burst inside a direct message is sealed in the same Noise session as your text), and
            public geohash channels, which are readable by design since anyone nearby can join them.
            That is why neither media nor live voice is offered in a private channel or group.
            <br />
            <br />
            <strong>Anonymous: partially.</strong>
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Fully anonymous:</strong> no phone number, email, or sign-up. Your identity
                is a key pair generated on-device, and nothing registers anywhere.
              </li>
              <li>
                <strong>Not anonymous:</strong> location channels reveal a coarse area, and Nostr
                relays can see which cells you are active in.
              </li>
              <li>
                <strong>Anonymous once Tor is on:</strong> when messages travel beyond the Bluetooth
                mesh, your IP is visible to Nostr relays, though the messages themselves stay NIP-17
                gift wrapped. Turning Tor on closes that gap.
              </li>
            </ul>
            The location and metadata trade-offs are inherent to any location-aware mesh.
          </>
        ),
      },
      {
        q: "Why are public channels not encrypted?",
        a: (
          <>
            Because there is nobody to keep them secret from.{" "}
            <strong>
              A public channel is one anyone nearby can join with no invite and no setup
            </strong>
            , so any key that lets you join is a key everyone has, and a key everyone has is not a
            secret. Encrypting with it would look like protection while providing none, which is
            worse than being plain about it.
            <br />
            <br />
            Public messages are still <strong>signed</strong>, so nobody can forge a message in your
            name or alter one on its way across the mesh. What you do not get is privacy: assume
            anyone in range can read a public channel, because that is exactly what it is for.
            <br />
            <br />
            <strong>
              When it matters, use a private channel, a private group, or a direct message.
            </strong>{" "}
            All three are end-to-end encrypted, and all three are one tap away in the same app.
            Public channels behave the same way in bitchat, which is part of how the two stay
            compatible.
          </>
        ),
      },
      {
        q: "Do I need an account?",
        a: (
          <>
            No. Your identity is an <TextLink href="https://ed25519.cr.yp.to">Ed25519</TextLink> key
            pair generated on-device and stored in{" "}
            <TextLink href="https://developer.apple.com/documentation/security/storing-keys-in-the-keychain">
              iOS Keychain
            </TextLink>{" "}
            or{" "}
            <TextLink href="https://developer.android.com/privacy-and-security/keystore">
              Android Keystore
            </TextLink>
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
        q: "Is anything stored unencrypted on my phone?",
        a: (
          <>
            Your private keys never sit in ordinary app storage. They live in the{" "}
            <TextLink href="https://developer.apple.com/documentation/security/storing-keys-in-the-keychain">
              iOS Keychain
            </TextLink>{" "}
            or{" "}
            <TextLink href="https://developer.android.com/privacy-and-security/keystore">
              Android Keystore
            </TextLink>
            , hardware-backed on modern devices.
            <br />
            <br />
            <strong>Message history is different.</strong> It sits in the app's own storage,
            protected by the operating system sandbox and whole-device encryption rather than a
            separate app-level cipher, so somebody holding your unlocked phone can read your chats
            the way they could read any other app's. Delete a conversation at any time, or empty
            everything with panic wipe.
            <br />
            <br />
            The wallet is stricter still, because coins are bearer instruments: its storage is a
            separate partition locked with its own AES-256 key, and that key is itself held in the
            Keychain or Keystore. If it cannot be read, the wallet reports itself locked rather than
            falling back to writing coins in the clear.
            <br />
            <br />
            None of it syncs to a cloud backup, because there is no account to sync to, and panic
            wipe destroys the lot in under a second.
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
            much any one person can leave with you depends on whether you have verified them. It
            costs you a little storage, and it is the reason the network keeps working when people
            are not in the same place at the same time.
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
            chats, or contacts. The payments section has the full picture.
            <br />
            <br />
            Losing a phone is not the same as replacing one. If you still have the old device and
            are simply switching, see the next question.
          </>
        ),
      },
      {
        q: "Can I move Airhop to a new phone?",
        a: (
          <>
            Yes.{" "}
            <strong>
              Device migration moves your identity, messages, contacts, and wallet to the new phone
            </strong>{" "}
            over a direct link between the two devices. It works in either direction between iPhone
            and Android, and nothing passes through a server, because there is none to pass through.
            <br />
            <br />
            <strong>It is a move, not a copy.</strong> The moment the new phone confirms it has
            everything, the old one erases its copy. You finish with exactly one active device,
            which is the only arrangement that works.
            <br />
            <br />
            Two phones cannot share one identity at the same time. Your identity is a single key
            pair with a single ID on the mesh, so two devices answering to it would leave peers with
            no way to tell which is which. Direct messages make it stricter still: their encryption
            ratchets forward one step per message, and two phones stepping the same conversation
            fall out of sync immediately, after which messages stop decrypting on one or both.
            Signal and every other messenger with forward secrecy live with the same constraint.
          </>
        ),
      },
      {
        q: "What is panic wipe?",
        a: (
          <>
            Triple-tapping the logo destroys every identity key and all message data in under a
            second, for a situation where you need the app emptied right now.{" "}
            <strong>This cannot be undone.</strong>
            <br />
            <br />
            Because your peer ID and your Nostr key are both derived from the keys it destroys,
            wiping them ends both identities at once. The next launch generates fresh ones, so you
            come back as a different username with no cryptographic link to the old one.
            <br />
            <br />
            <strong>What it cannot reach:</strong>
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>Messages already delivered. Those are on other people's phones.</li>
              <li>
                Anything you published over the internet. Your old identity and its messages stay on
                the relays that carried them.
              </li>
              <li>
                Your IP address, if you were not using Tor. Relays saw it alongside what you
                published, and that link outlives the wipe.
              </li>
              <li>
                Contacts who scanned your QR code. They still hold your old keys on their device.
              </li>
            </ul>
            So a wipe makes you unlinkable <strong>from here on</strong>, because the new identity
            shares nothing with the old one. It cannot retract the past. It is an escape hatch, not
            a time machine.
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
        a: (
          <>
            It uses more than an app sitting idle and far less than maps or video. Airhop stays on
            Bluetooth Low Energy, which listens and announces in short bursts and lets the radio
            sleep in between, and it slows its own announcements down once it can hear other
            devices. Relaying for other people costs a little more.{" "}
            <strong>It also works less hard when you are not watching:</strong> put your phone in
            your pocket and Airhop drops to a short look around every half a minute instead of
            listening continuously, and it turns down further as the battery gets low. Plug the
            phone in and it goes back to full speed. That is where almost all of a day's saving
            comes from, and none of it changes how the mesh works: messages still arrive, people are
            still found, the radio just looks less often.{" "}
            <strong>If you want it to stop entirely, set your status to Away in Profile:</strong>{" "}
            that stops scanning and announcing, and nothing runs until you set it back.
          </>
        ),
      },
      {
        q: "Why does the Mesh tab say Battery saver?",
        a: (
          <>
            Because your battery is low and Airhop has turned the Bluetooth scan down to short
            bursts rather than draining what is left. Nothing is broken: people nearby will still
            appear, they can just take up to half a minute to show up instead of a few seconds. The
            note exists only so that slowness is explainable, because a radar that takes a while to
            fill looks identical to one that is not working.{" "}
            <strong>Charging the phone clears it,</strong> and it disappears on its own once the
            battery recovers. There is nothing to tap and nothing to fix.
          </>
        ),
      },
      {
        q: "Why is there a notification I cannot dismiss?",
        a: "On Android, that notification is what keeps the mesh alive after you leave the app. Without it the system would suspend Airhop within minutes and you would stop receiving anything. It has a Stop mesh button that shuts the radios down cleanly and takes the notification with it; reopening the app then shows the mesh paused, with a Resume button. iPhones have no equivalent notification, because iOS keeps Bluetooth apps alive differently.",
      },
      {
        q: "Why does a messenger ask for my location?",
        a: (
          <>
            Android ties Bluetooth scanning to the location permission at the system level, so any
            app that looks for nearby devices has to ask for it, whether or not it cares where you
            are. Airhop does not read your position for the mesh. The one place it genuinely uses
            location is the optional location channels, which need a rough area to work out which
            cell you are in, and you can decline that and still use everything else.{" "}
            <strong>
              Nothing about your position is ever sent to us, because there is no server to send it
              to.
            </strong>
          </>
        ),
      },
      {
        q: "What else does it ask permission for?",
        a: (
          <>
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Bluetooth and nearby devices:</strong> to find and talk to peers. The one it
                cannot work without.
              </li>
              <li>
                <strong>Notifications:</strong> so a message can reach you when the app is closed.
              </li>
              <li>
                <strong>Camera:</strong> only to scan a contact's QR code, or to take a photo or
                video you are attaching.
              </li>
              <li>
                <strong>Photos:</strong> only when you attach or save one.
              </li>
              <li>
                <strong>Microphone:</strong> only when you record a voice note or hold the mic to
                talk live.
              </li>
            </ul>
            Every one of them can be refused or revoked later in your device settings, and the app
            keeps working with whatever is left.
          </>
        ),
      },
      {
        q: "Does it work in airplane mode?",
        a: "Yes, as long as you switch Bluetooth back on, which both iOS and Android let you do without leaving airplane mode. The mesh then works in full: discovery, channels, direct messages, files, and ecash transfers, none of which touch the internet. The internet features stop, so messages to people who are not nearby queue up and send themselves when a route appears, and cashing ecash out to Lightning has to wait until you are back online.",
      },
    ],
  },
  {
    heading: "Payments & wallet",
    questions: [
      {
        q: "Do I need Bitcoin or a Lightning wallet to use Airhop?",
        a: (
          <>
            No. <strong>Payments are entirely optional</strong> and every other feature works
            without them. A{" "}
            <TextLink href="https://en.wikipedia.org/wiki/Lightning_Network">Lightning</TextLink>{" "}
            wallet is only needed to move money in or out. Once you have a balance, paying someone
            next to you needs nothing but Bluetooth.
          </>
        ),
      },
      {
        q: "What is ecash?",
        a: (
          <>
            <TextLink href="https://en.wikipedia.org/wiki/Ecash">Ecash</TextLink> is bearer digital
            cash. A mint issues cryptographically signed coins worth a fixed amount, with no account
            and no balance sitting on a server.{" "}
            <strong>Whoever holds a coin can spend it, like a banknote.</strong> Airhop uses{" "}
            <TextLink href="https://cashu.space">Cashu</TextLink>
            , an ecash protocol backed by Bitcoin, so value moves device to device over the mesh
            with no internet in the middle.
            <br />
            <br />
            Three words come up throughout this section.
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Coins:</strong> the money sitting in your wallet.
              </li>
              <li>
                <strong>Token:</strong> the string you hand over when you pay, carrying one or more
                coins inside it.
              </li>
              <li>
                <strong>Sat:</strong> the unit, one hundred millionth of a bitcoin, small enough
                that everyday amounts are whole numbers.
              </li>
            </ul>
          </>
        ),
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
            Any Cashu-compatible mint. You add one by pasting its address into the wallet, and
            Airhop checks it is a real mint before saving it.
            <br />
            <ul className="my-2 list-disc space-y-1 pl-5">
              <li>
                <strong>To try it out:</strong>{" "}
                <TextLink href="https://testnut.cashu.space">testnut.cashu.space</TextLink> is the
                community test mint. It issues free play-money sats, so you can walk through every
                flow with nothing at risk. The sats are not real and the mint is wiped periodically,
                so never keep anything there you would miss.
              </li>
              <li>
                <strong>For real sats:</strong> pick a publicly run mint with a track record.{" "}
                <TextLink href="https://bitcoinmints.com">bitcoinmints.com</TextLink> tracks who is
                running what.
              </li>
              <li>
                <strong>To trust nobody:</strong> run your own with{" "}
                <TextLink href="https://github.com/cashubtc/nutshell">Nutshell</TextLink>. A
                Raspberry Pi is enough.
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
            <TextLink href="https://en.wikipedia.org/wiki/Lightning_Network">Lightning</TextLink>{" "}
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
            Send from the Wallet tab, from a chat, or from a peer on the Mesh tab. Airhop turns the
            amount into a token and hands it over as an encrypted Bluetooth message.{" "}
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
        q: "What if they are not on Airhop, or Bluetooth is off?",
        a: (
          <>
            Show the payment as a QR code and let them scan it. Every send screen offers one, and a
            payment you have already made can be shown again from its Pending card.
            <br />
            <br />
            <strong>
              The QR holds a plain Cashu token, so any Cashu wallet can read it, not only Airhop.
            </strong>{" "}
            That covers paying someone across a table, someone whose Bluetooth is off, and someone
            who has never heard of Airhop.
            <br />
            <br />
            It works the other way too. Airhop scans a QR with the camera, or reads one out of a
            saved screenshot, which is how most tokens arrive when they are sent through another
            chat app.
          </>
        ),
      },
      {
        q: "What happens if I receive a payment while offline?",
        a: (
          <>
            The money is really yours, but Airhop cannot yet confirm nobody spent it first, so it
            shows up as unconfirmed on a separate line rather than being folded silently into your
            balance.
            <br />
            <br />
            Offline, Airhop still checks the mint's signature on every token it receives (a{" "}
            <TextLink href="https://github.com/cashubtc/nuts/blob/main/12.md">DLEQ proof</TextLink>
            ), so a forged token is rejected outright. That proves the mint issued it.{" "}
            <strong>It can never prove it is unspent, because only the mint knows that.</strong> Tap
            Refresh once you are online and the unconfirmed line clears.
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
        q: "What happens if I send a payment and it never arrives?",
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
            Yes, two of them, and neither goes to this project. Handing a payment to someone costs
            nothing in itself.
            <br />
            <br />
            <strong>Mints:</strong> usually a small fee when coins are swapped. Airhop covers it on
            your behalf when you send, so "send 100" means they can claim 100, not 97.
            <br />
            <br />
            <strong>Lightning:</strong> deposits and withdrawals pay normal routing fees. You see
            the estimate before confirming, and any unused reserve is returned.
          </>
        ),
      },
      {
        q: "Why does Airhop say my balance is split across mints?",
        a: (
          <>
            <strong>
              A token names exactly one mint, so ecash from two different mints can never be
              combined into a single payment.
            </strong>{" "}
            With 60 sats at one and 60 at another you cannot send 100, even though the total says
            120. That is how Cashu works, not something an app can code around.
            <br />
            <br />
            You can send two separate payments, or use Move to one mint, which has one mint pay a
            Lightning invoice issued by the other so the balance ends up in one place. It costs a
            small routing fee and needs internet.
          </>
        ),
      },
      {
        q: "What is a nutzap?",
        a: (
          <>
            Paying someone by their Nostr identity over the internet, using{" "}
            <TextLink href="https://github.com/nostr-protocol/nips/blob/master/61.md">
              NIP-61
            </TextLink>
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
    ],
  },
  {
    heading: "AI assistant",
    questions: [
      {
        q: "What is the offline AI assistant?",
        a: (
          <>
            The assistant is optional, and nothing happens until you choose a model. It is a small
            language model that runs entirely on your phone, so you can ask it things when there is
            no signal at all: first aid, navigation, general knowledge. Nothing is sent anywhere,
            there is no API key, and no server sees the question or the answer. Conversation history
            stays on the device with everything else.
            <br />
            <br />
            <strong>Airhop does not ship a model of its own.</strong> The app lists a few small
            open-weight models (roughly 1 to 3 billion parameters, in GGUF format) with the size and
            memory each one needs, and downloads the one you pick from{" "}
            <TextLink href="https://huggingface.co">Hugging Face</TextLink>. That download is the
            only part that needs internet, and it happens once. The flow is the same on iOS and
            Android, and the app blocks a download outright if the device does not have the memory
            or storage to run it.
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
            Yes. The full source code is on <TextLink href={REPO_URL}>GitHub</TextLink> under the{" "}
            <TextLink href={REPO_LINKS.license}>MIT license</TextLink>. Protocol specifications are
            in the docs/ directory.
          </>
        ),
      },
      {
        q: "Can I contribute?",
        a: (
          <>
            Yes. Open issues, submit pull requests, or start a discussion. Read the{" "}
            <TextLink href={REPO_LINKS.contributing}>contributing guide</TextLink> before opening a
            PR.
          </>
        ),
      },
    ],
  },
];
