import PageHeader from "@/components/ui/PageHeader";
import TextLink from "@/components/ui/TextLink";
import { useSEO } from "@/hooks/useSEO";
import { useT, type Translator } from "@/i18n";
import { AUTHOR_NAME, REPO_LINKS, SITE_URL } from "@/lib/links";
import { LAST_UPDATED, LAST_UPDATED_DISPLAY, SEO } from "@/lib/seo";
import { useEffect, useMemo, useState } from "react";
import {
  FloodPropagation,
  Fragmentation,
  GiftWrap,
  GossipSync,
  IdentityTree,
  InternetGateway,
  MeshBridge,
  ModuleMap,
  NoiseHandshake,
  PacketFrame,
  PresenceStates,
  ProtectionStack,
  RoomTypes,
  RouterLadder,
  SystemOverview,
  VoiceBurst,
  WalletStates,
} from "./diagrams";

const CODE = "rounded-[6px] bg-inner px-1 py-0.5 text-[0.85em] text-ink";

const TOC = [
  {
    act: "Orientation",
    items: [
      { id: "overview", label: "One canvas" },
      { id: "message", label: "Follow one message" },
      { id: "concepts", label: "Concepts" },
    ],
  },
  {
    act: "The system",
    items: [
      { id: "identity", label: "Identity" },
      { id: "transports", label: "Transports" },
      { id: "mesh", label: "The mesh" },
      { id: "lifecycle", label: "Status and lifecycle" },
      { id: "encryption", label: "Encryption" },
      { id: "rooms", label: "Rooms" },
      { id: "attachments", label: "Attachments" },
      { id: "voice", label: "Live voice" },
    ],
  },
  {
    act: "Beyond the mesh",
    items: [
      { id: "bridge", label: "Internet layer" },
      { id: "tor", label: "The onion router" },
    ],
  },
  {
    act: "Optional features",
    items: [
      { id: "wallet", label: "The wallet" },
      { id: "ai", label: "The AI assistant" },
      { id: "social", label: "Social bridges" },
    ],
  },
  {
    act: "For developers",
    items: [
      { id: "modules", label: "Module map" },
      { id: "wire", label: "Wire format" },
      { id: "threat", label: "Threat model" },
    ],
  },
];

const SECTION_IDS = TOC.flatMap((g) => g.items.map((i) => i.id));

function useActiveSection(): string {
  const [active, setActive] = useState(SECTION_IDS[0]);

  useEffect(() => {
    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting);
        const current = SECTION_IDS.find((id) => seen.get(id));
        if (current !== undefined) setActive(current);
      },
      { rootMargin: "-88px 0px -65% 0px" },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el !== null) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}

function C({ children }: { children: React.ReactNode }) {
  return <code className={CODE}>{children}</code>;
}

function NUT({ n }: { n: string }) {
  return <TextLink href={`https://github.com/cashubtc/nuts/blob/main/${n}.md`}>NUT-{n}</TextLink>;
}

function NIP({ n }: { n: string }) {
  return (
    <TextLink href={`https://github.com/nostr-protocol/nips/blob/master/${n}.md`}>NIP-{n}</TextLink>
  );
}

function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-line scroll-mt-24 border-t pt-12 first:border-t-0 first:pt-0"
    >
      <div className="text-mute font-mono text-[10px] font-semibold tracking-[0.25em] uppercase">
        {eyebrow}
      </div>
      <h2 className="text-ink mt-3 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {lede && <p className="text-secondary mt-3 text-sm leading-relaxed">{lede}</p>}
      <div className="text-secondary mt-6 space-y-5 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Figure({ caption, children }: { caption: React.ReactNode; children: React.ReactNode }) {
  return (
    <figure className="my-7">
      <div className="border-line bg-card-subtle rounded-2xl border p-4">
        <div className="overflow-x-auto [contain:layout]">
          <div className="min-w-[680px]">{children}</div>
        </div>
      </div>
      <figcaption className="text-mute mt-2 font-mono text-[11px] leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="border-line bg-card my-6 overflow-x-auto rounded-2xl border [contain:layout]">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-line bg-card-subtle border-b">
            {head.map((h) => (
              <th
                key={h}
                className="text-secondary px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-line border-b last:border-b-0">
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 align-top text-[13px] leading-relaxed ${
                    j === 0 ? "text-ink font-medium" : "text-secondary"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Note({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-ink bg-card-subtle my-6 rounded-r-2xl border-l-2 py-4 pr-4 pl-5">
      <div className="text-mute font-mono text-[10px] font-semibold tracking-[0.18em] uppercase">
        {label}
      </div>
      <div className="text-secondary mt-2 text-[13px] leading-relaxed">{children}</div>
    </div>
  );
}

function articleSchema(T: Translator) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: T("seo.architecture.headline"),
    description: T("seo.architecture.summary"),
    dateModified: LAST_UPDATED,
    author: { "@type": "Person", name: AUTHOR_NAME },
    url: `${SITE_URL}/architecture`,
  };
}

export default function ArchitecturePage() {
  const T = useT();
  const active = useActiveSection();
  const schema = useMemo(() => JSON.stringify(articleSchema(T)).replace(/</g, "\\u003c"), [T]);

  useSEO(SEO["/architecture"]);

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <PageHeader
          eyebrow={T("page.architecture.eyebrow")}
          title={T("page.architecture.title")}
          meta={T("common.last_updated", { date: LAST_UPDATED_DISPLAY })}
        />

        <div className="mt-14 lg:grid lg:grid-cols-[176px_1fr] lg:gap-14">
          <nav aria-label={T("page.architecture.toc")} className="mb-12 lg:mb-0">
            <div className="-mx-1 px-1 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <div className="text-mute font-mono text-[10px] font-semibold tracking-[0.18em] uppercase">
                {T("page.architecture.toc")}
              </div>
              <ul className="mt-3 space-y-3.5">
                {TOC.map((group) => (
                  <li key={group.act}>
                    <div className="text-ink font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
                      {group.act}
                    </div>
                    <ul className="border-line mt-1.5 border-l">
                      {group.items.map((item) => {
                        const isActive = item.id === active;
                        return (
                          <li key={item.id} className="-ml-px">
                            <a
                              href={`#${item.id}`}
                              aria-current={isActive ? "true" : undefined}
                              className={`block border-l py-1.5 pl-3 text-[13px] leading-4 transition-colors ${
                                isActive
                                  ? "border-ink text-ink font-medium"
                                  : "text-secondary hover:border-line-strong hover:text-ink border-transparent"
                              }`}
                            >
                              {item.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="min-w-0 space-y-14">
            <Section
              id="overview"
              eyebrow="Orientation · 01"
              title="The whole thing on one canvas"
              lede="Airhop is a protocol written almost entirely in TypeScript, wrapped in the smallest native shell the operating systems will accept. Everything below is a zoom into one region of this picture."
            >
              <Figure caption="The app in three columns: what runs on your phone, what carries a message off it, and who that reaches. Only the bottom row needs the internet.">
                <SystemOverview />
              </Figure>

              <p>
                The deliberate choice here is the split. The whole protocol, every packet, every
                handshake, every routing decision, lives in <C>src/core/</C> as pure TypeScript with
                no native imports. The Swift and Kotlin code does four things: advertise, scan, hand
                raw bytes up, and write raw bytes out.{" "}
                <strong className="text-ink">It has no concept of a packet.</strong>
              </p>
              <p>
                That constraint buys two things. The entire protocol is testable in CI without a
                phone, which is why over a thousand tests can cover the wire format, the handshakes
                and whole multi-device scenarios before a radio is ever involved. And a bug fixed in
                gossip sync is fixed on both platforms at once, because there is only one
                implementation of it.
              </p>

              <Table
                head={["Layer", "What lives there", "Native?"]}
                rows={[
                  ["src/ui/", "shared components and theme tokens", "No"],
                  ["src/features/", "chat, discovery, wallet, contacts, settings", "No"],
                  ["src/store/", "Zustand slices persisted to MMKV", "No"],
                  ["src/services/", "mesh-service, wallet-service, ecash-transfer", "No"],
                  ["src/core/", "crypto, mesh, nostr, payments, router", "No"],
                  ["src/bridge/", "TurboModule specs, the only meeting point", "Interface only"],
                  [
                    "ios/ · android/",
                    "CoreBluetooth, GATT server, Arti, foreground service",
                    "Yes",
                  ],
                ]}
              />
            </Section>

            <Section
              id="message"
              eyebrow="Orientation · 02"
              title="Follow one message"
              lede="You type something and press send. From there the router picks a tier, and it is the only part of the system that gets to make that choice."
            >
              <Figure
                caption={
                  <>
                    The three tiers in{" "}
                    <TextLink href={REPO_LINKS.messageRouter}>message-router.ts</TextLink>, which
                    holds the entire routing decision. Each tier is tried in order and the first one
                    that can carry the message wins.
                  </>
                }
              >
                <RouterLadder />
              </Figure>

              <p>
                Reachability is not a guess. The router keeps a live registry of peers with two
                different expiry windows, because a directly connected radio link and a peer heard
                about second-hand are not the same kind of knowledge.
              </p>

              <Table
                head={["Peer kind", "Expiry", "Why"]}
                rows={[
                  [
                    "Direct",
                    "15 seconds",
                    "A phone you hold a radio link with goes quiet fast when it leaves. Matches bitchat's link timeout.",
                  ],
                  [
                    "Mesh",
                    "60 seconds",
                    "Learned from a relayed ANNOUNCE. Multi-hop packets arrive late, so the window has to be generous.",
                  ],
                ]}
              />

              <p>
                Two cases fall through tier 1 that the diagram cannot show.{" "}
                <strong className="text-ink">
                  A Noise session can only be established over a direct BLE link, never across
                  relays.
                </strong>{" "}
                So a peer four hops away that you have never messaged has no session to use, and
                first contact goes over Nostr or courier even though the mesh could physically reach
                them. Once a session exists it relays across the mesh normally, so this only ever
                affects the first message.
              </p>
              <p>
                The second is size. A direct message longer than one 255-byte PrivateMessagePacket
                is not split across the Noise session, it goes to courier instead. Sending a
                truncated packet that bitchat cannot parse would be worse than taking the slower
                route.
              </p>

              <Note label="The choice is automatic">
                <strong className="text-ink">Airhop picks a tier for you on every message,</strong>{" "}
                and picks again on the next one, because peers move in and out of range between the
                two. There is one send button and the ladder runs underneath it, so a message
                carried by courier and one that went over WiFi look identical to whoever sent it.
              </Note>
            </Section>

            <Section
              id="concepts"
              eyebrow="Orientation · 03"
              title="Concepts"
              lede="This page draws on Bluetooth LE, the Noise protocol family, Nostr and Cashu. Most readers know one or two of them. Here is the vocabulary, and what each idea is doing in this app specifically."
            >
              <h3 className="text-ink pt-2 text-base font-bold">Radio and mesh</h3>
              <Table
                head={["Concept", "What it is", "In Airhop"]}
                rows={[
                  [
                    "BLE",
                    "Low-power Bluetooth. Devices announce and listen in short bursts instead of holding a connection open",
                    "The only transport that needs no internet and works across iOS and Android",
                  ],
                  [
                    "GATT central and peripheral",
                    "The scanning role and the advertising role",
                    "Every phone runs both at once, which is what makes this a mesh rather than a star",
                  ],
                  [
                    "TTL",
                    "A hop budget stamped on a packet, reduced by one at each relay",
                    "Starts at 7, and the packet stops when it reaches zero",
                  ],
                  [
                    "Flooding",
                    "Rebroadcasting to everyone in range rather than routing along one chosen path",
                    "The default, because a mesh of strangers cannot agree on a map",
                  ],
                  [
                    "LRU cache",
                    "A fixed-size cache that discards whatever was used least recently",
                    "1000 packet IDs over a 5 minute window, so a looped copy is dropped instead of forwarded",
                  ],
                  [
                    "TLV",
                    "Type-length-value, a self-describing byte layout that older readers can skip past",
                    "ANNOUNCE payloads, file transfers and courier envelopes",
                  ],
                  [
                    "Golomb-Coded Set",
                    "A compressed probabilistic set, smaller than a Bloom filter",
                    "Packs 1000 packet IDs into about 400 bytes so two phones can compare histories cheaply",
                  ],
                  [
                    "Store-and-forward",
                    "Holding a message until a route to the recipient appears",
                    "Courier envelopes, 40 at a time, discarded after 24 hours",
                  ],
                ]}
              />

              <h3 className="text-ink pt-2 text-base font-bold">Cryptography</h3>
              <Table
                head={["Concept", "What it is", "In Airhop"]}
                rows={[
                  [
                    "Ed25519",
                    "A signature scheme",
                    "Signs every packet. Relays verify before forwarding, so a forgery dies at the first hop",
                  ],
                  [
                    "X25519",
                    "Diffie-Hellman key agreement on Curve25519",
                    "The key exchange inside both Noise patterns",
                  ],
                  [
                    "Noise XX",
                    "A handshake where both sides prove who they are",
                    "Live direct-message sessions, and the reason bitchat and Airhop can talk",
                  ],
                  [
                    "Noise X",
                    "A one-way handshake, sender to recipient, with no reply",
                    "Sealing a courier envelope to someone who is not there to answer",
                  ],
                  [
                    "Forward secrecy",
                    "Past messages stay unreadable even if a key leaks later",
                    "Noise XX gives it once per session, Double Ratchet gives it once per message",
                  ],
                  [
                    "AEAD",
                    "Encryption that also detects tampering",
                    "ChaCha20-Poly1305, and XChaCha20-Poly1305 where a longer nonce is safer",
                  ],
                  [
                    "HKDF",
                    "Derives many keys from one secret, deterministically",
                    "Turns the signing key into the Nostr identity and every per-cell identity",
                  ],
                  [
                    "Prekey",
                    "A single-use public key published ahead of time",
                    "Gossiped as 0x24, so a message to a stranger is forward-secret before you ever meet",
                  ],
                ]}
              />

              <h3 className="text-ink pt-2 text-base font-bold">Nostr</h3>
              <Table
                head={["Concept", "What it is", "In Airhop"]}
                rows={[
                  [
                    "Relay",
                    "A simple server that accepts signed events and hands them out again",
                    "Over 350 independent ones, several queried at once, and none of them ours",
                  ],
                  [
                    "Event kind",
                    "A number declaring what an event is for",
                    "Eight are used, listed in the internet layer section",
                  ],
                  [
                    "Gift wrap",
                    "Nested encryption that hides who sent a message and who it is for",
                    "Every internet DM, so a relay operator sees only ciphertext from a throwaway key",
                  ],
                  [
                    "Rumor",
                    "The innermost event, deliberately left unsigned",
                    "Gives deniability: a leaked message cannot be proven to have come from you",
                  ],
                  [
                    "Geohash",
                    "Coordinates encoded as a short string, which gets coarser as you shorten it",
                    "Scopes location channels, and presence is only broadcast at precision 5 or coarser",
                  ],
                  [
                    "secp256k1",
                    "The elliptic curve Bitcoin and Nostr both use",
                    "Your Nostr identity, derived from the signing key rather than stored separately",
                  ],
                ]}
              />

              <h3 className="text-ink pt-2 text-base font-bold">Payments</h3>
              <Table
                head={["Concept", "What it is", "In Airhop"]}
                rows={[
                  [
                    "Chaumian ecash",
                    "Bearer tokens a mint signs without being able to see what it signed",
                    "The mint cannot connect the coins it issued to the coins it later redeems",
                  ],
                  [
                    "Blind signature",
                    "The mechanism that makes the above possible",
                    "Why a mint can hold your bitcoin without learning who you pay",
                  ],
                  [
                    "DLEQ",
                    "A proof that a signature really came from a particular key",
                    "Lets a phone with no internet confirm a coin is genuine, though never that it is unspent",
                  ],
                  [
                    "P2PK",
                    "Locking a coin so only one public key can spend it",
                    "Nutzaps, so the payment event can be public while the money stays private",
                  ],
                  [
                    "BIP-39",
                    "Twelve words that encode a seed",
                    "The opt-in recovery phrase, off unless you turn it on",
                  ],
                  [
                    "bolt11",
                    "The Lightning invoice format",
                    "How value moves in and out, the only part that needs the internet",
                  ],
                ]}
              />
            </Section>

            <Section
              id="identity"
              eyebrow="The system · 04"
              title="Identity"
              lede="There is no account, no server that knows you exist, and nothing to sign up for. Your identity is two key pairs generated on your phone the first time you open the app."
            >
              <Figure caption="Two roots, everything else derived. One identity across the mesh, the internet and payments, with no phone number, email or registration anywhere in the chain.">
                <IdentityTree />
              </Figure>

              <p>
                The Nostr key is <strong className="text-ink">derived, not separate</strong>. Nostr
                uses <TextLink href="https://en.bitcoin.it/wiki/Secp256k1">secp256k1</TextLink> and
                the signing key is <TextLink href="https://ed25519.cr.yp.to">Ed25519</TextLink>, so
                the two cannot be the same key. Running the signing key through{" "}
                <TextLink href="https://datatracker.ietf.org/doc/html/rfc5869">HKDF</TextLink> with
                the label <C>airhop-nostr-key-v1</C> yields one stable Nostr identity that survives
                a reinstall from the same keys, without linking to anything real.
              </p>
              <p>
                Location channels go one step further and derive a fresh secp256k1 identity per
                geohash cell. Being present in one cell therefore cannot be correlated with being
                present in another, which is the whole point of the exercise.
              </p>

              <Table
                head={["Secret", "Where it is stored", "Survives reinstall?"]}
                rows={[
                  [
                    "Noise static private key",
                    <>
                      <TextLink href="https://developer.apple.com/documentation/security/storing-keys-in-the-keychain">
                        Keychain
                      </TextLink>{" "}
                      /{" "}
                      <TextLink href="https://developer.android.com/privacy-and-security/keystore">
                        Keystore
                      </TextLink>
                    </>,
                    "No",
                  ],
                  ["Ed25519 signing private key", "Keychain / Keystore", "No"],
                  ["Wallet AES-256 key", "Keychain / Keystore", "No"],
                  [
                    "Recovery phrase (opt-in)",
                    "Keychain / Keystore",
                    "No, unless you wrote it down",
                  ],
                  ["Cashu proofs", "MMKV, AES-256 encrypted", "No"],
                  ["Message history", "MMKV, encrypted at rest", "No"],
                ]}
              />

              <p>
                Display names are not chosen and cannot be registered. The peer ID is{" "}
                <C>hex(SHA-256(noiseStaticPub)).slice(0, 16)</C>, and the readable name is a
                deterministic function of it, so <C>swift-falcon-3a9f</C> belongs to exactly one key
                pair and nobody can squat it. To bind a name to a person you actually know, scan
                their QR code: the card carries their real public keys, and the peer ID is checked
                against the Noise key it claims to derive from.
              </p>
            </Section>

            <Section
              id="transports"
              eyebrow="The system · 05"
              title="Transports"
              lede="Four ways a message can move. Only one of them works with no internet and across both platforms, which is why it is the default."
            >
              <Table
                head={["", "BLE mesh", "WiFi direct", "Nostr relays", "Courier"]}
                rows={[
                  [
                    "Carries",
                    "Everything, including live voice",
                    "DMs and files",
                    "DMs, location channels",
                    "Text envelopes",
                  ],
                  ["Needs internet", "No", "No", "Yes", "No"],
                  ["iPhone to Android", "Yes", "No", "Yes", "Yes"],
                  ["Range", "10 to 100 m per hop", "~30 m", "Global", "Wherever people walk"],
                  ["Max hops", "7", "1", "1", "Unbounded in time"],
                  ["Speed", "~19 KB/s", "~19 KB/s", "Not used for files", "n/a"],
                ]}
              />

              <p>
                The WiFi column needs two caveats. WiFi direct is Android{" "}
                <TextLink href="https://wi-fi.org/discover-wi-fi/wi-fi-aware">WiFi Aware</TextLink>{" "}
                on one side and iOS{" "}
                <TextLink href="https://developer.apple.com/documentation/multipeerconnectivity">
                  MultipeerConnectivity
                </TextLink>{" "}
                on the other.{" "}
                <strong className="text-ink">
                  They are different protocols on different radios and cannot talk to each other,
                </strong>{" "}
                so this path is Android-to-Android or iPhone-to-iPhone only, or at least until a
                standards-based option exists on both.
              </p>
              <p>
                And WiFi currently shares the same paced send queue as Bluetooth, so it runs at
                Bluetooth speed today. Lifting that cap is planned, and nothing in the protocol
                stands in the way.
              </p>

              <Note label="Why Nostr never carries files">
                Relays carry small signed events, not file bytes. The usual workaround is to upload
                the file to an HTTP host and post a link. That host is a central server that can
                log, throttle or take down your files, which is precisely the thing this project
                exists to avoid. So attachments travel over Bluetooth or WiFi, or they do not
                travel.
              </Note>
            </Section>

            <Section
              id="mesh"
              eyebrow="The system · 06"
              title="The mesh"
              lede="Every phone is a scanner and an advertiser at the same time. There is no coordinator and no phone that matters more than another."
            >
              <p>
                A message is broadcast, and every phone that hears it re-broadcasts it with one hop
                spent. <strong className="text-ink">That is the entire routing algorithm.</strong>{" "}
                It is deliberately simple, because a cleverer one would need state that a mesh of
                strangers cannot agree on. Four mechanisms stop the obvious failure modes.
              </p>

              <Figure caption="A message crossing four hops of the seven it is allowed. Both arms of each loop deliver a copy, but a phone forwards only the first one it sees.">
                <FloodPropagation />
              </Figure>

              <Table
                head={["Mechanism", "Value", "The failure it prevents"]}
                rows={[
                  ["TTL", "7 hops", "A packet circulating forever"],
                  [
                    "Relay jitter",
                    "10 to 220 ms, random",
                    "Every phone in a room answering in the same millisecond and colliding",
                  ],
                  [
                    "Deduplication",
                    "1000-entry LRU, 5 minute window",
                    "The same packet being re-forwarded every time it loops back",
                  ],
                  [
                    "Fanout",
                    "about ⌈√n⌉ peers",
                    "Traffic growing with crowd size instead of staying flat",
                  ],
                ]}
              />

              <p>
                The packet ID used for deduplication is{" "}
                <C>SHA-256(type | senderID | timestamp | payload)[0:16]</C>. There is no nonce
                field, because the content plus its millisecond timestamp is already unique enough
                to identify a packet across the mesh.
              </p>

              <h3 className="text-ink pt-2 text-base font-bold">Fragments</h3>
              <p>
                A BLE write is small. Anything larger than one fragment is split, paced and
                reassembled on the far side.
              </p>

              <Figure caption="Fragmentation of a file at the 1 MiB cap. The cap exists to stay compatible with bitchat's decoder and to keep a transfer to something a person will actually wait for.">
                <Fragmentation />
              </Figure>

              <h3 className="text-ink pt-2 text-base font-bold">Gossip sync</h3>
              <p>
                Flooding only helps if you were there when it happened. Someone who walks back into
                range has missed everything in between, and re-broadcasting the world at them would
                be enormously wasteful. Instead, phones exchange a compact probabilistic summary of
                what they have seen and send back only the difference.
              </p>

              <Figure
                caption={
                  <>
                    <TextLink href="https://en.wikipedia.org/wiki/Golomb_coding">
                      Golomb-Coded Set
                    </TextLink>{" "}
                    reconciliation. The filter is a compressed description of a set, not the set
                    itself, which is how 1000 packet IDs fit in around 400 bytes.
                  </>
                }
              >
                <GossipSync />
              </Figure>

              <Table
                head={["Constant", "Value", "Note"]}
                rows={[
                  ["Sync interval", "15 seconds", "Broadcast to direct neighbors only"],
                  [
                    "New-peer sync",
                    "5 seconds after first ANNOUNCE",
                    "Lets a joiner catch up fast",
                  ],
                  ["Gossip cache", "1000 packets", "Rolling window the filter describes"],
                  ["False positive rate", "1%", "A missed packet, never a wrong one"],
                  ["Filter budget", "~400 bytes", "Fits comfortably inside one exchange"],
                  ["Relayed?", "Never", "REQUEST_SYNC stays between neighbors"],
                ]}
              />

              <h3 className="text-ink pt-2 text-base font-bold">Courier</h3>
              <p>
                When there is no path at all, the message waits on other people&rsquo;s phones. A
                sealed envelope is handed to peers you have some trust relationship with, and they
                carry it until they meet the recipient.{" "}
                <strong className="text-ink">The carrier cannot read it:</strong> it is encrypted to
                the recipient before it ever leaves the sender, using a one-way Noise X seal to a
                one-time prekey so that even a later key compromise does not expose it.
              </p>

              <Table
                head={["Limit", "Value", "Why"]}
                rows={[
                  ["Pool size", "40 envelopes", "Bounded storage cost for the carrier"],
                  ["Verified-tier sub-cap", "20 envelopes", "Strangers cannot crowd out favorites"],
                  [
                    "Per-peer quota",
                    "5 favorite, 2 verified",
                    "One depositor cannot fill the pool",
                  ],
                  ["Envelope size", "16 KiB", "Text only, media is never couriered"],
                  ["Lifetime", "24 hours", "The value bitchat carriers enforce"],
                  ["Expiry slack", "1 hour", "Clock skew only, longer is refused outright"],
                ]}
              />

              <Note label="A carrier judges by its own limits">
                An envelope stamped with a longer expiry than the carrier allows is not clamped down
                to the limit, it is refused. A sender that asks for more carriage does not get more,
                it gets none. That is what closes the storage-pinning vector.
              </Note>
            </Section>

            <Section
              id="lifecycle"
              eyebrow="The system · 07"
              title="Status and lifecycle"
              lede="A mesh only exists while the radios are on. Phones are built to switch radios off, so most of this section is about staying alive without wasting your battery."
            >
              <Figure caption="Three presence states, and exactly what each one does to the radios.">
                <PresenceStates />
              </Figure>

              <Table
                head={["Behavior", "Interval", "Why"]}
                rows={[
                  [
                    "Presence broadcast",
                    "4 s alone, then 15 to 30 s",
                    "Fast while alone so devices meet quickly, then it backs off",
                  ],
                  ["Gossip sync", "15 s", "Lets a returning peer catch up"],
                  ["Direct peer timeout", "45 s", "Handles unreported link drops beyond broadcast"],
                  ["Mesh peer timeout", "60 s", "Relayed peers get longer, packets arrive late"],
                  ["Geohash heartbeat", "40 to 80 s, randomized", "Avoids lockstep announcements"],
                  ["Participant window", "5 min", "How long a key stays listed as present"],
                ]}
              />

              <p>
                On Android the mesh survives backgrounding through a foreground service, which is
                what the notification you cannot swipe away actually is. Without it the system would
                suspend the app within minutes. It carries a Stop mesh button that shuts the radios
                down cleanly, which is the same thing as switching to Away.
              </p>

              <Note label="A backgrounded iPhone is invisible to Android">
                Once the app leaves the foreground, CoreBluetooth moves the service UUID into the
                advertisement&rsquo;s overflow area and drops the local name. Only another iOS
                device scanning for that exact UUID can see it there. iPhone-to-iPhone discovery
                keeps working, an already connected link keeps carrying traffic, but
                iPhone-to-Android discovery stops until the app is reopened. This is a platform
                behavior and cannot be fixed in application code.
              </Note>

              <p>
                <strong className="text-ink">Panic wipe is the terminal transition.</strong>{" "}
                Triple-tapping the logo zeroizes keys in memory, deletes every Keychain and Keystore
                entry, clears all MMKV partitions, and deletes the app sandbox, in under a second.
                The wallet partition is removed with a full delete rather than a clear, because a
                file whose key has just been destroyed cannot be reliably reopened.
              </p>
            </Section>

            <Section
              id="encryption"
              eyebrow="The system · 08"
              title="Encryption"
              lede="Different things get different protection. Two rows in the grid below say no, and both are deliberate trade-offs."
            >
              <p>
                Live sessions use{" "}
                <TextLink href="https://noiseprotocol.org/noise.html">Noise XX</TextLink>, the same
                pattern and the same cipher suite bitchat uses, which is what makes cross-app DMs
                possible at all.
              </p>

              <Figure caption="The Noise XX handshake. Both sides prove who they are, and the ephemeral keys mean a later compromise of a static key does not decrypt this session.">
                <NoiseHandshake />
              </Figure>

              <p>
                <strong className="text-ink">
                  Noise XX gives forward secrecy per session. It does not give it per message.
                </strong>{" "}
                So a second layer sits on top:{" "}
                <TextLink href="https://signal.org/docs/specifications/doubleratchet/">
                  Double Ratchet
                </TextLink>
                , the same algorithm Signal uses, ratcheting a new key for every message. Its root
                key is seeded from the completed handshake's transcript hash, which is why Airhop
                does not need X3DH: the key agreement has already happened. The transcript matters
                rather than the two static keys, because Noise XX mixes in ephemeral keys that are
                destroyed when the handshake ends, so the root key cannot be recomputed later from
                long-lived keys alone.
              </p>

              <Figure caption="Every message type and what actually protects it. The two no rows are real trade-offs, not oversights.">
                <ProtectionStack />
              </Figure>

              <Note label="Why attachments are signed but not encrypted">
                Encrypting them would break the file transfer format bitchat already decodes, and
                cross-app compatibility was judged worth more than confidentiality on media that is
                usually sent to a room anyway. Nobody can forge or alter an attachment, because the
                signature covers it, but{" "}
                <strong className="text-ink">any device relaying it can open it.</strong>
              </Note>

              <Table
                head={["Primitive", "Algorithm", "Used for"]}
                rows={[
                  ["Handshake", "Noise_XX_25519_ChaChaPoly_SHA256", "Live DM sessions"],
                  ["One-way seal", "Noise_X_25519_ChaChaPoly_SHA256", "Courier envelopes"],
                  ["Signatures", "Ed25519", "Every packet, boards, prekeys, groups"],
                  ["Key agreement", "X25519", "Inside both Noise patterns"],
                  ["AEAD", "ChaCha20-Poly1305", "Noise transport, group messages"],
                  ["AEAD, long nonce", "XChaCha20-Poly1305", "Private channels, NIP-44"],
                  ["Hash", "SHA-256", "Peer IDs, packet IDs, HKDF, GCS"],
                ]}
              />
            </Section>

            <Section
              id="rooms"
              eyebrow="The system · 09"
              title="Rooms"
              lede="Four kinds of room, and what separates them is entirely a question of who holds the key."
            >
              <Figure caption="The four room types. The two on the right are encrypted; the two on the left are readable by anyone in range, by design.">
                <RoomTypes />
              </Figure>

              <p>
                <strong className="text-ink">Private channels</strong> put the key inside the invite
                link. There is no roster and no member cap, which sounds careless until you consider
                the use case: a link has to spread faster than anyone could add people by hand.
                Messages are sealed with XChaCha20-Poly1305 and broadcast as type <C>0x50</C>, and
                nothing on the wire names the channel, so an outsider cannot even tell which channel
                a message belongs to.
              </p>
              <p>
                <strong className="text-ink">Private groups</strong> are the opposite trade. The
                creator signs a roster of up to 16 and hands the key to each member individually
                inside their Noise session, so no link exists and nobody can forward their way in.
                Messages go out as <C>0x25</C> with the group ID and key epoch in the clear, so
                relays can carry them without being members, and rotating the key bumps the epoch so
                an old key cannot be replayed.
              </p>

              <Note label="Why not relay-hosted groups">
                <NIP n="29" /> was considered and dropped.{" "}
                <strong className="text-ink">
                  It puts membership enforcement on a relay, which means a server decides who may
                  speak.
                </strong>{" "}
                Both models above keep that decision on the devices holding the keys, which is the
                whole premise of the project.
              </Note>
            </Section>

            <Section
              id="attachments"
              eyebrow="The system · 10"
              title="Attachments"
              lede="A photo taken on a modern phone is five megabytes. The mesh takes half a megabyte and moves it at about 19 KB/s. Something has to give, and it should not be the send button."
            >
              <p>
                Every attachment is <strong className="text-ink">one packet</strong>, not a stream
                of chunks. The whole file goes into a single TLV payload and the fragment layer
                splits it for the radio, which is the same path a long text message takes. An
                earlier plan to chunk large files ourselves was dropped: bitchat enforces its size
                cap when it <em>decodes</em> a packet, so anything larger is refused outright and
                interop breaks in both directions.
              </p>

              <Table
                head={["", "Photo", "Voice note", "Video", "Anything else"]}
                rows={[
                  ["Cap", "512 KB", "512 KB", "1 MB", "1 MB"],
                  ["Resized first", "Yes", "No", "No", "No"],
                  ["Sent as", "JPEG", "AAC", "MP4 or MOV", "As-is"],
                ]}
              />

              <p>
                Photos are fitted before they leave. The longest edge comes down to 1600 pixels,
                which is still worth looking at full screen, and the file is re-encoded until it
                fits the budget: quality first, then resolution once quality alone stops helping.
                Most photos need one pass. A photo already under the cap is left untouched rather
                than re-encoded for nothing.
              </p>

              <Note label="What the quality setting actually does">
                Low, Medium and High do not choose a file size, because every photo lands under the
                same 512 KB either way.{" "}
                <strong className="text-ink">They choose where the compression starts.</strong> Low
                starts lower and reaches a sendable file in one pass, so it gets moving sooner on a
                weak link. High starts high, keeps more detail, and may take a pass or two to fit.
                There is a floor below which JPEG artefacts show on a phone screen; past that point
                the resolution comes down instead.
              </Note>

              <p>
                Two things are checked that sound pedantic and are not. The MIME type is resolved
                rather than passed through, because pickers routinely return nothing and a file with
                no type is dropped on arrival by both apps, which looks exactly like a successful
                send from the other end. And on receive, the declared type is checked against the
                file's magic bytes, so a file cannot claim to be a photo and arrive as something
                else.
              </p>
              <p>
                Received files live in the app's own cache, not your gallery, and Settings shows
                what they cost with a button that actually frees it. Saving one to the gallery is a
                deliberate act, from the photo viewer or the long-press menu.
              </p>
            </Section>

            <Section
              id="voice"
              eyebrow="The system · 11"
              title="Live voice"
              lede="Holding the mic is a walkie-talkie, not a recording. Audio leaves as you speak and arrives about half a second later."
            >
              <p>
                A voice note is a file: you record it, it sends, they play it. Live voice takes the
                same gesture and makes it immediate. Speech is encoded to AAC-LC at 16 kHz mono, one
                frame per 64 ms, and each frame goes out as it is produced. About{" "}
                <strong className="text-ink">15 packets a second, roughly 2 KB/s</strong> against a
                link that carries about 19 KB/s, so talking leaves most of it free for everything
                else.
              </p>
              <p>
                Staying out of the fragment scheduler is the hard part, and it is solved with size.
                A burst is capped at 210 bytes, comfortably under the 467 bytes a fragment carries,
                so live audio is never split and never queues behind somebody&rsquo;s file transfer.
              </p>

              <Figure caption="Live frames on top, the reliable copy underneath. Both rows carry the same audio; only the timing is different.">
                <VoiceBurst />
              </Figure>

              <Table
                head={["", "Public room", "Direct message"]}
                rows={[
                  ["Packet", "0x29, broadcast", "0x08 inside Noise"],
                  ["Who hears it", "Everyone in range", "One person"],
                  ["Protected by", "Ed25519 signature", "The Noise session"],
                  ["Relayed", "Yes, up to 5 to 7 hops", "Yes, like any DM"],
                ]}
              />

              <p>
                Latency is a budget, and the jitter buffer spends most of it. A frame takes 64 ms to
                accumulate, a few milliseconds to encode, and 30 to 60 ms to cross one radio hop.
                The receiver then holds 350 ms of audio before starting, which is what turns an
                irregular stream of packets into a voice.{" "}
                <strong className="text-ink">
                  Mouth to ear is about 470 ms on one hop, and stays under a second across three.
                </strong>{" "}
                Relaying voice uses a tighter jitter window than ordinary traffic (8 to 25 ms rather
                than up to 220) for exactly this reason: the ordinary window would spend the whole
                buffer before the third hop.
              </p>
              <p>
                Loss is handled by carrying on. A missing packet becomes 64 ms of silence and
                playback continues, because a retransmit that arrives after the moment has passed is
                worth nothing. For the same reason a burst can begin at any packet: if the opening
                packet is lost, or you walk into range mid-sentence, the receiver starts from
                whatever it hears first.
              </p>

              <Note label="Every burst is also a voice note">
                People in range hear you live. Everyone else{" "}
                <strong className="text-ink">
                  gets the same audio as an ordinary voice note when you let go
                </strong>
                , so someone who was out of range, or who arrived later, still has the message. It
                is also what puts the conversation in the chat history, since live audio by itself
                leaves nothing behind.
              </Note>

              <p>
                It is a delivery strategy rather than a mode: the same hold on the same button
                streams live where the mesh can carry it and records a voice note where it cannot,
                and the button says which one you are about to get. One setting turns the whole
                thing off, in both directions at once, and voice goes back to behaving exactly as it
                did before.
              </p>
              <p>
                Live voice is offered only where unencrypted media already is: public mesh rooms and
                direct messages. A private channel or group would have its audio broadcast in the
                clear, which would quietly undo the thing that makes it private, so holding the mic
                there records a voice note instead. Location channels are excluded too, since that
                would put your voice on public relays.
              </p>
            </Section>

            <Section
              id="bridge"
              eyebrow="Beyond the mesh · 12"
              title="The internet layer"
              lede="When Bluetooth range runs out and there is a connection available, the same conversation continues over Nostr relays. No infrastructure anyone here controls. Two features ride this layer: the internet gateway and the mesh bridge."
            >
              <p>
                <TextLink href="https://nostr.org">Nostr</TextLink> relays are chosen
                geographically. The app ships a bundled list of over 350 public relays and picks the
                nearest by{" "}
                <TextLink href="https://en.wikipedia.org/wiki/Haversine_formula">
                  Haversine
                </TextLink>{" "}
                distance, connecting to several at once so no single operator is load-bearing.
              </p>

              <Figure
                caption={
                  <>
                    <NIP n="17" /> gift wrap, built on <NIP n="59" /> and encrypted with{" "}
                    <NIP n="44" />. Three nested layers, of which the relay can read exactly none.
                  </>
                }
              >
                <GiftWrap />
              </Figure>

              <p>
                The inner rumor is deliberately unsigned.{" "}
                <strong className="text-ink">That is not an oversight, it is deniability:</strong>{" "}
                because nothing inside carries your signature, a leaked message cannot be
                cryptographically proven to have come from you.
              </p>

              <Table
                head={["Nostr kind", "What it is"]}
                rows={[
                  ["14", "Rumor, the unsigned inner message"],
                  ["13", "Seal, signed by you, encrypted to them"],
                  ["1059", "Gift wrap, signed by a throwaway key"],
                  ["20000", "Location channel message"],
                  ["20001", "Location channel presence heartbeat"],
                  ["1401", "Courier drop parked on a relay"],
                  [
                    "9321",
                    <>
                      Nutzap, ecash locked to a public key (<NIP n="61" />)
                    </>,
                  ],
                  ["10019", "Wallet info, where to send nutzaps"],
                ]}
              />

              <h3 className="text-ink pt-2 text-base font-bold">Presence and its limits</h3>
              <p>
                Location channels show how many people are around. Broadcasting that is a location
                leak, so it is restricted on purpose: heartbeats are only sent for coarse cells at
                geohash precision 5 or less, roughly a 5 km square and upward. Finer channels get no
                presence broadcast at all, and the app shows <C>[? people]</C> rather than{" "}
                <C>[0 people]</C> so nobody mistakes silence for an empty room. Heartbeats go out
                every 40 to 80 seconds, randomized so devices in one cell do not announce in
                lockstep, and a key stays listed for 5 minutes after its last event.
              </p>

              <h3 className="text-ink pt-2 text-base font-bold">The internet gateway</h3>
              <Figure caption="A phone with a connection carrying a nearby offline phone's public location traffic. Never applied to private messages.">
                <InternetGateway />
              </Figure>
              <p>
                A phone with no signal can still reach the location channels if someone beside it
                lends their connection. Turn the gateway on and your phone relays that offline
                peer's public geohash traffic to Nostr and carries the channel back over Bluetooth,
                riding packet type <C>0x28</C> and verified against each event's own Schnorr
                signature first. It only ever touches public location chat, never a private message,
                which it could not read anyway. Off by default: it spends your data and battery on a
                neighbor's behalf.
              </p>

              <h3 className="text-ink pt-2 text-base font-bold">The mesh bridge</h3>
              <Figure caption="Two Bluetooth crowds, out of radio range, sharing one public channel through a rendezvous cell on Nostr. Public channel only, never DMs.">
                <MeshBridge />
              </Figure>
              <p>
                Where the gateway carries one offline phone, the mesh bridge links two whole
                Bluetooth crowds that are out of radio range of each other. Turn it on and your
                public <C>#bluetooth</C> messages get a second, signed copy published to a
                rendezvous for your ~1.2 km neighborhood, tagged with a distinct <C>r</C> so it
                never mixes with the location channels. Another crowd in the same cell, also
                bridging, sees them, marked with a network glyph. No phone becomes a server: every
                bridging device signs with an unlinkable per-cell key, duplicates collapse on a
                content-derived ID whether they arrive by radio or relay, and a per-message{" "}
                <C>nearby only</C> switch keeps any single message off the internet. Off by default,
                public channel only, never DMs.
              </p>
            </Section>

            <Section
              id="tor"
              eyebrow="Beyond the mesh · 13"
              title="The onion router"
              lede="Gift wrap hides who is talking to whom. It does not hide your IP address from the relay. Tor closes that gap, and the two platforms close it differently."
            >
              <Table
                head={["", "iOS", "Android"]}
                rows={[
                  [
                    "Implementation",
                    <>
                      <TextLink href="https://arti.torproject.org">Arti</TextLink>, compiled into
                      the app binary
                    </>,
                    <>
                      <TextLink href="https://guardianproject.info/apps/org.torproject.android/">
                        Orbot
                      </TextLink>
                      , a separate app you install
                    </>,
                  ],
                  ["Covers", "The Nostr WebSocket only", "Every connection, as a system VPN"],
                  ["Mint traffic", "Blocked while Tor is on, unless you opt in", "Covered"],
                  ["Third-party app needed", "No", "Yes"],
                ]}
              />

              <Note label="The iOS asymmetry is a design decision, not a bug">
                Arti on iOS wraps the Nostr socket, so an HTTP call to a mint would go around it and
                expose your IP alongside your coins. Rather than leak that quietly, Airhop refuses
                mint requests entirely while Tor is on and tells you why, with a switch in Settings
                if you decide the trade is acceptable. Sending and receiving ecash over Bluetooth
                never touches a mint, so that keeps working either way.
              </Note>

              <p>
                <strong className="text-ink">
                  Tor has no effect on the Bluetooth mesh, and cannot.
                </strong>{" "}
                Mesh traffic is radio-local: it never reaches an IP network, so there is nothing to
                route.
              </p>
            </Section>

            <Section
              id="wallet"
              eyebrow="Optional features · 14"
              title="The wallet"
              lede="Cashu ecash, chosen because it is the only payment system where the transfer itself needs no network at all. A coin is a bearer instrument, and handing one over is just a message, or a QR code on a screen."
            >
              <Figure caption="Where a coin can be. The design is built around the fact that sending never deletes anything.">
                <WalletStates />
              </Figure>

              <p>
                <TextLink href="https://cashu.space">Cashu</TextLink> is a Chaumian ecash protocol
                backed by Bitcoin.{" "}
                <strong className="text-ink">
                  The mint is the one trusted party in the entire application,
                </strong>{" "}
                which is why Airhop ships with no default mint and never picks one for you. It
                issues coins against Lightning sats and redeems them later, and thanks to blind
                signatures it cannot link the coins it issued to the coins it later sees spent.
              </p>

              <Table
                head={["Operation", "Spec", "Needs internet"]}
                rows={[
                  ["Hand a coin to someone", "none, a message or a QR code", "No"],
                  [
                    "Verify a coin is genuine",
                    <>
                      <NUT n="12" /> (DLEQ)
                    </>,
                    "No",
                  ],
                  ["Deposit from Lightning", <NUT n="04" />, "Yes"],
                  ["Withdraw to Lightning", <NUT n="05" />, "Yes"],
                  ["Check if a coin is spent", <NUT n="07" />, "Yes"],
                  ["Lock a coin to a public key", <NUT n="11" />, "Yes"],
                  [
                    "Recovery phrase",
                    <>
                      <NUT n="13" /> and <NUT n="09" />
                    </>,
                    "Yes, to restore",
                  ],
                ]}
              />

              <Note label="Two limits the wallet cannot design around">
                <strong className="text-ink">DLEQ proves origin, not freshness.</strong> A valid
                proof shows the mint really signed that coin. It can never show the sender did not
                already spend it, because only the mint knows that. So a coin received offline is
                shown as unconfirmed on its own line rather than folded silently into your balance.
                <br />
                <br />
                <strong className="text-ink">Reclaiming is a race.</strong> An undelivered send can
                be reclaimed because the coins were reserved rather than deleted, but if the
                recipient already holds the token string, whoever reaches the mint first keeps the
                money. The app says so before you tap.
              </Note>

              <p>
                Balances are kept per mint and never pooled, so one mint failing cannot take the
                rest. That is also why a balance can be split in a way that looks strange: a token
                names exactly one mint, so 60 sats at two different mints cannot combine into a
                single 100 sat payment. Moving value between mints means one mint paying a Lightning
                invoice issued by the other.
              </p>
              <p>
                Proofs are bearer secrets, so they get their own MMKV partition opened with an
                explicit AES-256 key held in the Keychain or Keystore. If that key cannot be read,
                the wallet reports itself locked rather than falling back to writing coins in
                plaintext.
              </p>
            </Section>

            <Section
              id="ai"
              eyebrow="Optional features · 15"
              title="The AI assistant"
              lede="A small language model running on the phone itself, for when there is no signal and nobody nearby to ask."
            >
              <p>
                Airhop ships no model of its own. The app lists a few small open-weight models,
                roughly 1 to 3 billion parameters in GGUF format, with the memory and storage each
                one needs, and downloads the one you pick from{" "}
                <TextLink href="https://huggingface.co">Hugging Face</TextLink>.{" "}
                <strong className="text-ink">
                  That download is the only moment the assistant touches a network.
                </strong>{" "}
                Everything after it runs locally.
              </p>
              <p>
                There is no API key and no server, so nothing sees the question or the answer.
                Conversation history stays in the same encrypted local store as your messages, and
                the app refuses a download outright if the device cannot hold that model in memory.
              </p>
            </Section>

            <Section
              id="social"
              eyebrow="Optional features · 16"
              title="Social bridges"
              lede="An Ed25519 key pair is already enough to be a Bluesky account or a Fediverse actor. Airhop can lend yours to either, without registering anywhere and without touching the mesh."
            >
              <p>
                Both networks build identity out of keys rather than usernames, which is why this
                works at all. The <TextLink href="https://atproto.com">AT Protocol</TextLink>, which
                Bluesky runs on, derives a <C>did:key</C> from your signing key.{" "}
                <TextLink href="https://w3.org/TR/activitypub/">ActivityPub</TextLink>, the W3C
                standard behind <TextLink href="https://joinmastodon.org">Mastodon</TextLink>,
                Pixelfed and PeerTube, builds an Actor from the same key. Neither asks you to create
                an account, because you already hold the only thing either of them needs.
              </p>

              <Table
                head={["Network", "Protocol", "What the bridge does"]}
                rows={[
                  [
                    "Bluesky",
                    "AT Protocol",
                    "Reads your home and discovery feeds into a tab, cross-posts channel messages as feed records, and cross-references DIDs to show which of your Bluesky contacts are also on Airhop. Point it at your own PDS if you would rather host the data yourself.",
                  ],
                  [
                    "Mastodon and the wider Fediverse",
                    "ActivityPub",
                    "Receives mentions and DMs from any compliant server, publishes public channel messages as Notes, and answers WebFinger lookups so someone can find you by handle.",
                  ],
                ]}
              />

              <Note label="What a plugin is not allowed to do">
                <strong className="text-ink">Mesh traffic is never exposed to a plugin.</strong> A
                plugin sees only content you have explicitly marked as shareable, it cannot read
                private keys, and it cannot contact the network on your behalf without a
                confirmation for that specific action. Enabling one does not change the wire format,
                the mesh, or any encryption described above.
              </Note>

              <p>
                One integration was deliberately kept out of the core.{" "}
                <TextLink href="https://en.wikipedia.org/wiki/Unified_Payments_Interface">
                  UPI
                </TextLink>
                , India&rsquo;s payment rail, settles bank to bank with full KYC linkage visible to
                NPCI, which is structurally incompatible with everything on this page. It exists as
                an opt-in plugin for people who want to pay in rupees while online, gated behind a
                disclosure that says exactly that, and it never touches the offline path. Cashu
                remains the payment system Airhop is built around.
              </p>

              <h3 className="text-ink pt-2 text-base font-bold">
                Everything that is off until you turn it on
              </h3>
              <Table
                head={["Feature", "State on a fresh install"]}
                rows={[
                  ["Tor", "Off. iOS has Arti built in, Android needs Orbot installed separately"],
                  [
                    "Internet gateway",
                    "Off. Carries a nearby offline phone's public location traffic, never anyone's private messages",
                  ],
                  [
                    "Mesh bridge",
                    "Off. Links your area's public #bluetooth chat with another out-of-range Bluetooth crowd over the internet, never your DMs",
                  ],
                  ["The wallet", "Off. Nothing happens until you add a mint yourself"],
                  [
                    "Recovery phrase",
                    "Off, and one-way once enabled, because a deleted phrase is indistinguishable from deleted coins",
                  ],
                  ["AI assistant", "Off. Nothing downloads until you pick a model"],
                  ["Social bridges", "Off. Individually, per plugin"],
                ]}
              />
            </Section>

            <Section
              id="modules"
              eyebrow="For developers · 17"
              title="Module map"
              lede="About 157 TypeScript files across core, services, store and features, arranged so that dependencies only ever point one direction."
            >
              <Figure caption="The layering rule. src/core is the whole protocol and imports nothing native, which is what makes it testable in CI without a phone.">
                <ModuleMap />
              </Figure>

              <Table
                head={["Directory", "Owns"]}
                rows={[
                  ["core/crypto/", "identity, noise-xx, noise-x, double-ratchet, contact-exchange"],
                  [
                    "core/mesh/",
                    "packet-codec, flood-router, deduplicator, fragment-manager, gossip-sync, courier-store, announce-manager, group-protocol, channel-crypto, prekey-store, board-packet",
                  ],
                  [
                    "core/nostr/",
                    "nostr-client, gift-wrap, geo-relay, presence, courier-relay, geohash-identity, tor-routing, tor-websocket",
                  ],
                  ["core/payments/", "cashu, nutzap, wallet-seed"],
                  ["core/router/", "message-router, the transport ladder and peer registry"],
                  [
                    "services/",
                    "mesh-service, wallet-service, ecash-transfer, geohash-channel-service",
                  ],
                ]}
              />

              <h3 className="text-ink pt-2 text-base font-bold">The native contract</h3>
              <p>
                <strong className="text-ink">The bridge is deliberately tiny</strong>, because
                anything richer would mean protocol knowledge on the native side, which is the one
                thing this design exists to prevent. TypeScript calls down to start and stop
                advertising, start and stop scanning, and write bytes to a link. Native calls back
                up with four events: a packet arrived, a link connected, a link disconnected, a
                signal reading changed. Bytes cross base64-encoded, because that is the only
                representation both runtimes agree on safely.
              </p>
            </Section>

            <Section
              id="wire"
              eyebrow="For developers · 18"
              title="Wire format"
              lede="Byte-for-byte identical to bitchat v2. This is what makes an Airhop phone and a bitchat phone join the same mesh with no translation layer and no configuration."
            >
              <Figure caption="The v2 packet frame. Version 2 widened the payload length field from 2 bytes to 4, which is what allows large file transfers.">
                <PacketFrame />
              </Figure>

              <Table
                head={["Identifier", "Value"]}
                rows={[
                  ["Service UUID", <C>F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C</C>],
                  ["Characteristic UUID", <C>A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D</C>],
                  ["Protocol version", <C>2</C>],
                  ["Peer ID in advert", "iOS local name, Android scan-response service data"],
                ]}
              />

              <p>
                The two platforms cannot carry the peer ID the same way. Android puts the first 8
                bytes in scan-response service data; CoreBluetooth has no service-data API, so iOS
                advertises the full 16-character peer ID as the local name. Neither can read the
                other&rsquo;s placement, so a cross-platform link simply skips advert-level dedup
                and identifies the peer from its first ANNOUNCE.
              </p>

              <h3 className="text-ink pt-2 text-base font-bold">Packet types</h3>
              <p>
                Everything up to <C>0x29</C> is bitchat-defined and shared. bitchat allocates
                forward and has reached <C>0x2c</C>, so Airhop&rsquo;s own types start at{" "}
                <C>0x50</C>, well clear of the values bitchat is still handing out. A type one side
                does not recognise is relayed rather than read, so an Airhop extension crosses a
                mesh of bitchat phones without ever being shown to their users.
              </p>

              <Table
                head={["Type", "Hex", "Purpose"]}
                rows={[
                  ["ANNOUNCE", "0x01", "Signed presence, TLV: nickname, keys, direct neighbors"],
                  ["CHANNEL_MSG", "0x02", "Public channel message, signed plaintext"],
                  ["LEAVE", "0x03", "Peer departing"],
                  ["COURIER_ENV", "0x04", "Sealed store-and-forward envelope"],
                  ["NOISE_HANDSHAKE", "0x10", "Noise XX handshake message"],
                  ["NOISE_ENCRYPTED", "0x11", "Post-handshake encrypted payload"],
                  ["DR_ENCRYPTED", "0x12", "Double Ratchet DM · Airhop extension"],
                  ["FRAGMENT", "0x20", "One piece of a larger message, 467 bytes of data"],
                  ["REQUEST_SYNC", "0x21", "GCS gossip filter, never relayed"],
                  ["FILE_TRANSFER", "0x22", "File, image, voice note, 1 MiB cap"],
                  ["BOARD_POST", "0x23", "Signed bulletin post, 1 to 7 day expiry"],
                  ["PREKEY_BUNDLE", "0x24", "One-time prekeys for forward-secret first contact"],
                  ["GROUP_MESSAGE", "0x25", "Private group message under an epoch key"],
                  ["PING / PONG", "0x26 / 0x27", "Directed mesh echo, measures hop distance"],
                  ["NOSTR_CARRIER", "0x28", "Gateway-ferried Nostr event"],
                  ["VOICE_FRAME", "0x29", "Live push-to-talk burst"],
                  ["CHANNEL_ENC", "0x50", "Private channel · Airhop extension"],
                  [
                    "CHANNEL_MSG_AIRHOP",
                    "0x51",
                    "Named location channel over Bluetooth · Airhop extension",
                  ],
                ]}
              />

              <Note label="How the signature survives relaying">
                A relay has to decrement the TTL, which would invalidate a naive signature over the
                whole packet. So{" "}
                <strong className="text-ink">
                  the signature is computed over the packet re-encoded with <C>ttl=0</C>
                </strong>{" "}
                and the signature field absent. Relays can decrement freely and tag solicited sync
                responses, and the original signature still verifies at every hop.
              </Note>
            </Section>

            <Section
              id="threat"
              eyebrow="For developers · 19"
              title="Threat model"
              lede="What the design defends against, and the six things it does not."
            >
              <Table
                head={["Threat", "Countermeasure"]}
                rows={[
                  [
                    "Impersonation",
                    "A peer ID is the hash of its own public key, so claiming someone else's means producing their key",
                  ],
                  [
                    "Key substitution",
                    "The first signing key seen for a peer is pinned. Only an in-person QR scan can replace it",
                  ],
                  [
                    "Message forgery",
                    "Ed25519 checked against the key bound to the claimed sender, before anything is shown. A missing key fails the check rather than skipping it",
                  ],
                  ["Man in the middle", "Noise XX mutual authentication on every session"],
                  [
                    "Relay tampering",
                    "The signature covers the route field, so any edit invalidates it",
                  ],
                  [
                    "Replay",
                    "Content-derived packet ID, deduplicated for 5 minutes, plus a freshness window where staleness is itself the attack",
                  ],
                  [
                    "Reading someone else's mail",
                    "A directed packet is forwarded by relays but only opened by the peer it is addressed to",
                  ],
                  [
                    "Traffic analysis on Nostr",
                    "NIP-17 gift wrap hides both ends, Tor hides the IP",
                  ],
                  [
                    "Relay censorship",
                    "Several relays queried in parallel, any one failing is invisible",
                  ],
                  [
                    "Sybil flooding",
                    "TTL bounds propagation, and peer tables are capped with eviction that never drops a real BLE neighbour",
                  ],
                  [
                    "Misbehaving BLE devices",
                    "Connection slots reclaimed from peers that never announce",
                  ],
                  ["Device seizure", "Panic wipe, keys in hardware-backed storage"],
                  [
                    "Double spend",
                    "Mint-enforced, and a received coin is unconfirmed until checked",
                  ],
                ]}
              />

              <Note label="What it does not protect against">
                <strong className="text-ink">Physical proximity.</strong> Being on a Bluetooth mesh
                reveals that you are physically near certain people. That is inherent to the medium.
                <br />
                <br />
                <strong className="text-ink">A linkable device.</strong> Your peer ID comes from
                your long-term key, so it does not rotate. The same phone is recognisable across
                sessions until you regenerate the identity. Only the per-area location identities
                are throwaway.
                <br />
                <br />
                <strong className="text-ink">Attachments in the clear.</strong> Photos, files and
                voice notes are signed but not encrypted, so that bitchat can read them. They are
                therefore kept to the public Bluetooth room and direct mesh messages, and never sent
                over the internet.
                <br />
                <br />
                <strong className="text-ink">Timing correlation.</strong> An observer watching
                several radios at once can infer patterns from when packets move, even without
                reading them.
                <br />
                <br />
                <strong className="text-ink">A compromised operating system.</strong> If the OS is
                owned, every guarantee above is void.
                <br />
                <br />
                <strong className="text-ink">Mint trust.</strong> Ecash requires trusting a mint to
                hold the bitcoin and keep an honest list of what has been spent.
              </Note>
            </Section>

            <div className="border-line border-t pt-10">
              <div className="text-mute font-mono text-[10px] font-semibold tracking-[0.25em] uppercase">
                Go deeper
              </div>
              <p className="text-secondary mt-3 text-sm leading-relaxed">
                This page is the readable version. The specifications it is drawn from live in the
                repository: <TextLink href={REPO_LINKS.architectureDoc}>ARCHITECTURE.md</TextLink>{" "}
                for design decisions,{" "}
                <TextLink href={REPO_LINKS.protocolsDoc}>PROTOCOLS.md</TextLink> for exact byte
                layouts and constants,{" "}
                <TextLink href={REPO_LINKS.glossaryDoc}>GLOSSARY.md</TextLink> for terminology, and{" "}
                <TextLink href={REPO_LINKS.progressDoc}>PROGRESS.md</TextLink> for build status and
                milestones.
              </p>
              <p className="text-secondary mt-4 text-sm leading-relaxed">
                For the protocol Airhop inherits, read the{" "}
                <TextLink href="https://github.com/permissionlesstech/bitchat/blob/main/WHITEPAPER.md">
                  bitchat protocol whitepaper
                </TextLink>
                . It covers the mesh layer, the store-and-forward stack and the Noise session model,
                and is released into the public domain under the{" "}
                <TextLink href="https://github.com/permissionlesstech/bitchat/blob/main/LICENSE">
                  Unlicense
                </TextLink>
                .
              </p>
              <p className="text-secondary mt-4 text-sm leading-relaxed">
                Shorter answers to most of this are in the <TextLink href="/faq">FAQ</TextLink>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
