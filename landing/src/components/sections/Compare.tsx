import SectionHeader from "@/components/ui/SectionHeader";
import { useT, type TranslationKey, type Translator } from "@/i18n";
import { REPO_URL } from "@/lib/links";
import { motion } from "motion/react";

function Yes({ T }: { T: Translator }) {
  return (
    <span className="text-ink font-mono text-sm">
      <span aria-hidden="true">&#10003;</span>
      <span className="sr-only">{T("home.compare.mark.yes")}</span>
    </span>
  );
}

function No({ T }: { T: Translator }) {
  return (
    <span className="text-mute font-mono text-sm">
      <span aria-hidden="true">&#10005;</span>
      <span className="sr-only">{T("home.compare.mark.no")}</span>
    </span>
  );
}

function Partial({ T }: { T: Translator }) {
  return (
    <span className="text-secondary font-mono text-sm" title={T("home.compare.mark.partial_hint")}>
      <span aria-hidden="true">~</span>
      <span className="sr-only">{T("home.compare.mark.partial")}</span>
    </span>
  );
}

type Support = boolean | "partial";

function Mark({ value, T }: { value: Support; T: Translator }) {
  if (value === "partial") return <Partial T={T} />;
  return value ? <Yes T={T} /> : <No T={T} />;
}

const ROWS: {
  name: string;
  href: string;
  transportKey?: TranslationKey;
  transport?: string;
  encryption: string;
  offline: Support;
  hardwareFree: Support;
  openSource: Support;
  self?: boolean;
}[] = [
  {
    name: "Signal",
    href: "https://signal.org",
    transportKey: "home.compare.transport.servers",
    encryption: "Signal protocol",
    offline: false,
    hardwareFree: true,
    openSource: true,
  },
  {
    name: "Threema",
    href: "https://threema.ch",
    transportKey: "home.compare.transport.servers",
    encryption: "NaCl + Ibex",
    offline: false,
    hardwareFree: true,
    openSource: "partial",
  },
  {
    name: "Session",
    href: "https://getsession.org",
    transportKey: "home.compare.transport.onion",
    encryption: "Session protocol",
    offline: false,
    hardwareFree: true,
    openSource: true,
  },
  {
    name: "White Noise",
    href: "https://whitenoise.chat",
    transportKey: "home.compare.transport.nostr",
    encryption: "MLS (Marmot)",
    offline: false,
    hardwareFree: true,
    openSource: true,
  },
  {
    name: "Meshtastic",
    href: "https://meshtastic.org",
    transportKey: "home.compare.transport.lora",
    encryption: "AES-256 + Curve25519 PKI",
    offline: true,
    hardwareFree: false,
    openSource: true,
  },
  {
    name: "goTenna",
    href: "https://gotenna.com",
    transportKey: "home.compare.transport.sub_ghz",
    encryption: "AES-256 + ECC-384 PKI",
    offline: true,
    hardwareFree: false,
    openSource: false,
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

const HEAD: TranslationKey[] = [
  "home.compare.col.project",
  "home.compare.col.transport",
  "home.compare.col.encryption",
  "home.compare.col.offline",
  "home.compare.col.hardware_free",
  "home.compare.col.open_source",
];

export default function Compare() {
  const T = useT();

  return (
    <section id="compare" className="scroll-mt-8 px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={T("home.compare.eyebrow")}
          title={T("home.compare.title")}
          sub={T("home.compare.sub")}
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
              <table className="w-full min-w-[720px] border-collapse text-start">
                <thead>
                  <tr className="border-line border-b">
                    {HEAD.map((key) => (
                      <th
                        key={key}
                        scope="col"
                        className="label text-secondary px-5 py-3.5 text-[10px] font-semibold tracking-[0.14em] whitespace-nowrap"
                      >
                        {T(key)}
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
                      <th scope="row" className="px-5 py-3.5 text-start font-normal">
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
                      <td className="text-secondary px-5 py-3.5 text-[13px]">
                        {row.transportKey ? T(row.transportKey) : row.transport}
                      </td>
                      <td className="text-secondary px-5 py-3.5 font-mono text-xs" dir="ltr">
                        {row.encryption}
                      </td>
                      <td className="px-5 py-3.5">
                        <Mark value={row.offline} T={T} />
                      </td>
                      <td className="px-5 py-3.5">
                        <Mark value={row.hardwareFree} T={T} />
                      </td>
                      <td className="px-5 py-3.5">
                        <Mark value={row.openSource} T={T} />
                      </td>
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
