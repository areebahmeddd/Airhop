import SectionHeader from "@/components/ui/SectionHeader";
import { useTheme } from "@/hooks/useTheme";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const SCREENS = [
  {
    base: "01-offline-mesh",
    title: "Mesh",
    caption: "Everyone in range, placed by how close they are. Nobody has to be added first.",
    alt: "The Mesh screen of the Airhop app, showing four nearby peers arranged on a radar by signal strength.",
  },
  {
    base: "02-encrypted",
    title: "Chats",
    caption: "Ordinary conversations. The phones that pass each message along cannot open it.",
    alt: "A direct message conversation in Airhop during a power cut, relayed across three phones.",
  },
  {
    base: "03-channels",
    title: "Channels",
    caption: "Public rooms as small as one block or as wide as a region, open to anyone there.",
    alt: "The Chats screen of the Airhop app, listing public channels scoped to a block, neighborhood, city, and region.",
  },
  {
    base: "05-payments",
    title: "Wallet",
    caption: "Hand ecash to the person beside you over Bluetooth, with neither phone online.",
    alt: "The wallet screen of the Airhop app, showing an ecash balance that can be sent over Bluetooth.",
  },
  {
    base: "04-no-accounts",
    title: "Identity",
    caption: "No sign up, no phone number, no email. Just a key that never leaves this phone.",
    alt: "The profile screen of the Airhop app, showing an identity generated on the device with no account.",
  },
];

export default function AppShowcase() {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<number[]>([0]);
  const reduceMotion = useReducedMotion();
  const theme = useTheme();

  function select(index: number) {
    setActive(index);
    setLoaded((prev) => (prev.includes(index) ? prev : [...prev, index]));
  }

  return (
    <section id="app" className="scroll-mt-8 px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="See the app"
          title="An ordinary messenger, offline."
          sub="Chats, channels, a wallet, and an identity. Familiar on the surface, with a mesh underneath doing the work."
        />

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-2 lg:col-span-5">
            {SCREENS.map((screen, i) => (
              <button
                key={screen.base}
                type="button"
                aria-pressed={i === active}
                onClick={() => select(i)}
                className={`relative flex min-h-11 flex-col items-start gap-1 rounded-2xl border p-5 text-left transition-colors duration-200 ${
                  i === active
                    ? "border-line bg-inner"
                    : "hover:bg-card-subtle border-transparent bg-transparent"
                }`}
              >
                {i === active ? (
                  <motion.span
                    layoutId="showcase-indicator"
                    aria-hidden="true"
                    className="bg-ink absolute top-5 bottom-5 left-0 w-[3px] rounded-full"
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
                    }
                  />
                ) : null}
                <span className="text-ink font-mono text-[11px] font-semibold tracking-widest uppercase">
                  {screen.title}
                </span>
                <span className="text-secondary text-sm leading-snug">{screen.caption}</span>
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div
              className="border-line bg-card-subtle relative mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border"
              style={{ aspectRatio: "1290 / 2000" }}
            >
              {SCREENS.map((screen, i) =>
                loaded.includes(i) ? (
                  <img
                    key={screen.base}
                    src={`/screens/${screen.base}-${theme}.png`}
                    alt={i === active ? screen.alt : ""}
                    width={1290}
                    height={2796}
                    loading="lazy"
                    decoding="async"
                    aria-hidden={i === active ? undefined : true}
                    className={`absolute inset-x-0 bottom-0 w-full transition-opacity duration-300 ease-out ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ) : null,
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
