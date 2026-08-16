import SectionHeader from "@/components/ui/SectionHeader";
import { useTheme } from "@/hooks/useTheme";
import { useT, type TranslationKey } from "@/i18n";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const SCREENS: {
  base: string;
  titleKey: TranslationKey;
  captionKey: TranslationKey;
  altKey: TranslationKey;
}[] = [
  {
    base: "01-offline-mesh",
    titleKey: "home.showcase.mesh.title",
    captionKey: "home.showcase.mesh.caption",
    altKey: "home.showcase.mesh.alt",
  },
  {
    base: "02-encrypted",
    titleKey: "home.showcase.chats.title",
    captionKey: "home.showcase.chats.caption",
    altKey: "home.showcase.chats.alt",
  },
  {
    base: "03-channels",
    titleKey: "home.showcase.channels.title",
    captionKey: "home.showcase.channels.caption",
    altKey: "home.showcase.channels.alt",
  },
  {
    base: "05-payments",
    titleKey: "home.showcase.wallet.title",
    captionKey: "home.showcase.wallet.caption",
    altKey: "home.showcase.wallet.alt",
  },
  {
    base: "04-no-accounts",
    titleKey: "home.showcase.identity.title",
    captionKey: "home.showcase.identity.caption",
    altKey: "home.showcase.identity.alt",
  },
];

export default function AppShowcase() {
  const T = useT();
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
          eyebrow={T("home.showcase.eyebrow")}
          title={T("home.showcase.title")}
          sub={T("home.showcase.sub")}
        />

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-2 lg:col-span-5">
            {SCREENS.map((screen, i) => (
              <button
                key={screen.base}
                type="button"
                aria-pressed={i === active}
                onClick={() => select(i)}
                className={`relative flex min-h-11 flex-col items-start gap-1 rounded-2xl border p-5 text-start transition-colors duration-200 ${
                  i === active
                    ? "border-line bg-inner"
                    : "hover:bg-card-subtle border-transparent bg-transparent"
                }`}
              >
                {i === active ? (
                  <motion.span
                    layoutId="showcase-indicator"
                    aria-hidden="true"
                    className="bg-ink absolute start-0 top-5 bottom-5 w-[3px] rounded-full"
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
                    }
                  />
                ) : null}
                <span className="label text-ink text-[11px] font-semibold tracking-widest">
                  {T(screen.titleKey)}
                </span>
                <span className="text-secondary text-sm leading-snug">{T(screen.captionKey)}</span>
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
                    alt={i === active ? T(screen.altKey) : ""}
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
