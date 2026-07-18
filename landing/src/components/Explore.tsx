import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

const sections = [
  {
    category: "DOWNLOAD",
    items: [
      {
        title: "iOS",
        desc: "Requires iOS 16 or later. Bluetooth background mode enabled.",
        href: "https://apps.apple.com/app/airhop/id000000000",
      },
      {
        title: "Android",
        desc: "Requires Android 10 or later. Needs Bluetooth and nearby devices permissions.",
        href: "https://play.google.com/store/apps/details?id=org.onemindlabs.airhop",
      },
      {
        title: "Build from Source",
        desc: "Clone the repo, run npm install, then npx expo run:ios or run:android.",
        href: "https://github.com/areebahmeddd/Airhop#getting-started",
      },
    ],
  },
  {
    category: "PROTOCOL",
    items: [
      {
        title: "Wire Format",
        desc: "Full BLE packet spec shared with bitchat. Airhop and bitchat nodes interoperate automatically.",
        href: "https://github.com/areebahmeddd/Airhop/blob/main/docs/spec/PROTOCOLS.md",
      },
      {
        title: "Session Encryption",
        desc: "Noise XX with X25519 and ChaCha20-Poly1305 for authenticated key exchange and transport.",
        href: "https://noiseprotocol.org/noise.html",
      },
      {
        title: "Forward Secrecy",
        desc: "Double Ratchet ensures past messages stay protected even if current keys are compromised.",
        href: "https://signal.org/docs/specifications/doubleratchet/",
      },
    ],
  },
  {
    category: "SOURCE & DOCS",
    items: [
      {
        title: "GitHub",
        desc: "All source code under MIT. Issues, pull requests, and discussions welcome.",
        href: "https://github.com/areebahmeddd/Airhop",
      },
      {
        title: "Documentation",
        desc: "Architecture, wire format, Nostr bridge, and offline payment specs.",
        href: "https://github.com/areebahmeddd/Airhop/tree/main/docs",
      },
      {
        title: "Contributing",
        desc: "Read CONTRIBUTING.md before opening your first pull request.",
        href: "https://github.com/areebahmeddd/Airhop/blob/main/CONTRIBUTING.md",
      },
    ],
  },
];

export default function Explore() {
  return (
    <section
      id="explore"
      className="border-t border-gray-100 bg-white px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="space-y-4">
          <div className="font-mono text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase">
            EXPLORE AIRHOP
          </div>
          <h2 className="max-w-2xl text-xl leading-tight font-extrabold text-black sm:text-2xl md:text-3xl">
            Open by design. Documented from the start.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 pt-2 md:grid-cols-3">
          {sections.map((section, sectionIdx) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: sectionIdx * 0.1 }}
              className="space-y-5"
            >
              <div className="border-b border-gray-100 pb-3 font-mono text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                {section.category}
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-2 border border-gray-100 bg-white p-3 transition-all duration-200 hover:border-black"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="font-sans text-sm font-semibold text-black">{item.title}</div>
                      <div className="font-mono text-xs leading-snug text-gray-500">
                        {item.desc}
                      </div>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="mt-0.5 flex-shrink-0 text-gray-300 transition-colors group-hover:text-black"
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
