import SectionHeader from "@/components/ui/SectionHeader";
import { REPO_URL } from "@/lib/links";
import { motion } from "motion/react";

function Yes() {
  return (
    <span className="text-ink font-mono text-sm">
      <span aria-hidden="true">&#10003;</span>
      <span className="sr-only">Yes</span>
    </span>
  );
}

function No() {
  return (
    <span className="text-mute font-mono text-sm">
      <span aria-hidden="true">&#10005;</span>
      <span className="sr-only">No</span>
    </span>
  );
}

const ROWS: {
  name: string;
  href: string;
  transport: string;
  encryption: string;
  offline: boolean;
  hardwareFree: boolean;
  openSource: boolean;
  self?: boolean;
}[] = [
  {
    name: "Signal",
    href: "https://signal.org",
    transport: "Centralized servers",
    encryption: "Signal protocol",
    offline: false,
    hardwareFree: true,
    openSource: true,
  },
  {
    name: "Meshtastic",
    href: "https://meshtastic.org",
    transport: "LoRa radio",
    encryption: "AES-256 + Curve25519 PKI",
    offline: true,
    hardwareFree: false,
    openSource: true,
  },
  {
    name: "Session",
    href: "https://getsession.org",
    transport: "Onion routing (service nodes)",
    encryption: "Session protocol",
    offline: false,
    hardwareFree: true,
    openSource: true,
  },
  {
    name: "White Noise",
    href: "https://whitenoise.chat",
    transport: "Nostr relays",
    encryption: "MLS (Marmot)",
    offline: false,
    hardwareFree: true,
    openSource: true,
  },
  {
    name: "Bridgefy",
    href: "https://bridgefy.me",
    transport: "Bluetooth + WiFi",
    encryption: "Signal (libsignal)",
    offline: true,
    hardwareFree: true,
    openSource: false,
  },
  {
    name: "Briar",
    href: "https://briarproject.org",
    transport: "Bluetooth + WiFi + Tor",
    encryption: "Bramble",
    offline: true,
    hardwareFree: true,
    openSource: true,
  },
  {
    name: "Berty",
    href: "https://berty.tech",
    transport: "Bluetooth + mDNS",
    encryption: "Scuttlebutt + Ratchet",
    offline: true,
    hardwareFree: true,
    openSource: true,
  },
  {
    name: "bitchat",
    href: "https://bitchat.free",
    transport: "Bluetooth + Nostr",
    encryption: "Noise XX",
    offline: true,
    hardwareFree: true,
    openSource: true,
  },
  {
    name: "Airhop",
    href: REPO_URL,
    transport: "Bluetooth + WiFi + Nostr",
    encryption: "Noise XX + Double Ratchet",
    offline: true,
    hardwareFree: true,
    openSource: true,
    self: true,
  },
];

const HEAD = [
  "Project",
  "Transport",
  "Encryption",
  "Works offline",
  "Hardware-free",
  "Open source",
];

export default function Compare() {
  return (
    <section id="compare" className="scroll-mt-8 px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="How it compares"
          title="Offline, hardware-free, and open."
          sub="Every app here is good at something. Only some of them still work when the network does not."
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-6xl"
        >
          <div className="border-line bg-card overflow-hidden rounded-2xl border">
            <div className="overflow-x-auto [contain:layout]">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-line border-b">
                    {HEAD.map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="text-secondary px-5 py-3.5 font-mono text-[10px] font-semibold tracking-[0.14em] whitespace-nowrap uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, i) => (
                    <tr
                      key={row.name}
                      className={i % 2 === 1 ? "bg-card-subtle" : "bg-transparent"}
                    >
                      <th scope="row" className="px-5 py-3.5 text-left font-normal">
                        {row.self ? (
                          <a
                            href={row.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-ink text-canvas inline-flex h-6 items-center rounded-full px-2.5 font-mono text-[10px] font-semibold tracking-[0.18em] uppercase transition-opacity duration-150 hover:opacity-90"
                          >
                            {row.name}
                          </a>
                        ) : (
                          <a
                            href={row.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary hover:text-ink text-sm font-medium transition-colors duration-150"
                          >
                            {row.name}
                          </a>
                        )}
                      </th>
                      <td className="text-secondary px-5 py-3.5 text-[13px]">{row.transport}</td>
                      <td className="text-secondary px-5 py-3.5 font-mono text-xs">
                        {row.encryption}
                      </td>
                      <td className="px-5 py-3.5">{row.offline ? <Yes /> : <No />}</td>
                      <td className="px-5 py-3.5">{row.hardwareFree ? <Yes /> : <No />}</td>
                      <td className="px-5 py-3.5">{row.openSource ? <Yes /> : <No />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
