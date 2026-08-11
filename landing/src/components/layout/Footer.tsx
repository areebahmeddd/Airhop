import LanguagePicker from "@/components/ui/LanguagePicker";
import PixelBird from "@/components/ui/PixelBird";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useT, type TranslationKey } from "@/i18n";
import { useRichText } from "@/i18n/rich-text";
import { AUTHOR_NAME, AUTHOR_URL, REPO_LINKS, SOCIAL_LINKS, STORE_LINKS } from "@/lib/links";
import { useId, useMemo } from "react";
import { Link } from "react-router-dom";

const HEART_PIXELS = [
  [0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
];

function hashPixel(x: number, y: number) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  return (h ^ (h >>> 16)) >>> 0;
}

const FILLED_PIXELS = HEART_PIXELS.flatMap((row, y) =>
  row.flatMap((cell, x) => (cell === 1 ? [{ x, y }] : [])),
).sort((a, b) => hashPixel(a.x, a.y) - hashPixel(b.x, b.y));

const FILL_START = 4;
const FILL_END = 42;
const UNFILL_START = 54;
const UNFILL_END = 92;

function PixelHeart() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const steps = FILLED_PIXELS.length - 1;

  return (
    <svg
      viewBox="0 0 7 6"
      className="inline-block h-[9px] w-[10.5px] -translate-y-px align-middle"
      aria-hidden="true"
    >
      <style>
        {FILLED_PIXELS.map((_, i) => {
          const flip = FILL_START + (i * (FILL_END - FILL_START)) / steps;
          const unflip = UNFILL_START + (i * (UNFILL_END - UNFILL_START)) / steps;
          return `@keyframes ${uid}-${i} { 0%, ${flip.toFixed(1)}% { fill: var(--t-ink); } ${(flip + 0.6).toFixed(1)}%, ${unflip.toFixed(1)}% { fill: var(--alert); } ${(unflip + 0.6).toFixed(1)}%, 100% { fill: var(--t-ink); } }`;
        }).join("\n")}
      </style>
      {FILLED_PIXELS.map((p, i) => (
        <rect
          key={`${p.x}-${p.y}`}
          x={p.x}
          y={p.y}
          width={1}
          height={1}
          className="heart-pixel"
          style={{ animationName: `${uid}-${i}` }}
        />
      ))}
    </svg>
  );
}

const NAV_COLUMNS: {
  headingKey: TranslationKey;
  links: { labelKey: TranslationKey; href: string; external: boolean }[];
}[] = [
  {
    headingKey: "footer.group.download",
    links: [
      { labelKey: "footer.link.app_store", href: STORE_LINKS.appStore, external: true },
      { labelKey: "footer.link.play_store", href: STORE_LINKS.playStore, external: true },
      { labelKey: "footer.link.f_droid", href: STORE_LINKS.fDroid, external: true },
    ],
  },
  {
    headingKey: "footer.group.resources",
    links: [
      { labelKey: "footer.link.architecture", href: "/architecture", external: false },
      { labelKey: "footer.link.blogs", href: "/blogs", external: false },
      { labelKey: "footer.link.faq", href: "/faq", external: false },
    ],
  },
  {
    headingKey: "footer.group.social",
    links: [
      { labelKey: "footer.link.x", href: SOCIAL_LINKS.x, external: true },
      { labelKey: "footer.link.instagram", href: SOCIAL_LINKS.instagram, external: true },
      { labelKey: "footer.link.linkedin", href: SOCIAL_LINKS.linkedin, external: true },
    ],
  },
  {
    headingKey: "footer.group.legal",
    links: [
      { labelKey: "footer.link.terms", href: "/terms-of-service", external: false },
      { labelKey: "footer.link.privacy", href: "/privacy-policy", external: false },
      { labelKey: "footer.link.license", href: REPO_LINKS.license, external: true },
    ],
  },
];

function Credit() {
  const nodes = useMemo(
    () => ({
      heart: <PixelHeart />,
      author: (
        <a
          href={AUTHOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-ink underline underline-offset-2 transition-colors duration-150"
        >
          {AUTHOR_NAME}
        </a>
      ),
    }),
    [],
  );

  return <>{useRichText("footer.credit", nodes)}</>;
}

export default function Footer() {
  const T = useT();
  const headingId = useId();

  return (
    <footer className="border-line bg-card rounded-t-3xl border-t">
      <div className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="space-y-3 lg:col-span-4">
            <Link
              to="/"
              className="inline-flex items-center gap-3 select-none"
              aria-label={T("nav.home")}
            >
              <PixelBird className="text-ink h-4 w-auto" />
              <span className="text-ink font-mono text-sm font-bold tracking-[0.34em]">AIRHOP</span>
            </Link>
            <p className="text-secondary max-w-xs text-sm leading-relaxed select-none">
              {T("footer.tagline")}
            </p>
          </div>

          <nav
            aria-label={T("footer.aria")}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8 lg:mt-0 lg:gap-6"
          >
            {NAV_COLUMNS.map((col) => (
              <div key={col.headingKey} className="min-w-0">
                <p
                  id={`${headingId}-${col.headingKey}`}
                  className="text-secondary mb-4 flex h-4 items-center font-mono text-[10px] leading-4 font-semibold tracking-[0.18em] uppercase"
                >
                  {T(col.headingKey)}
                </p>
                <ul className="space-y-1" aria-labelledby={`${headingId}-${col.headingKey}`}>
                  {col.links.map((link) => (
                    <li key={link.labelKey} className="flex">
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary hover:text-ink inline-flex min-h-7 items-center text-[13px] leading-normal transition-colors duration-150"
                        >
                          {T(link.labelKey)}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-secondary hover:text-ink inline-flex min-h-7 items-center text-[13px] leading-normal transition-colors duration-150"
                        >
                          {T(link.labelKey)}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-line mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t py-4">
          <p className="text-secondary font-mono text-[10px] select-none">
            <Credit />
          </p>

          <div className="flex items-center gap-2">
            <LanguagePicker />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
