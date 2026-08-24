import { useTheme } from "@/hooks/useTheme";
import { useT, type TranslationKey } from "@/i18n";
import { setTheme, type Theme } from "@/lib/theme";
import { useRef, type ReactNode } from "react";

const SPIN_DEG_PER_MS = 180 / 1300;

const SUN = (
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
    <path d="m6.34 17.66-1.41 1.41" />
  </>
);

const MOON = <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />;

const OPTIONS: {
  value: Theme;
  labelKey: TranslationKey;
  active: string;
  mark: string;
  glyph: ReactNode;
}[] = [
  {
    value: "light",
    labelKey: "settings.theme.light",
    active: "text-sun",
    mark: "theme-mark-light",
    glyph: SUN,
  },
  {
    value: "dark",
    labelKey: "settings.theme.dark",
    active: "text-moon",
    mark: "theme-mark-dark",
    glyph: MOON,
  },
];

function spin(node: SVGGElement | null) {
  if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const step = getComputedStyle(node).getPropertyValue("--spin-step").trim();
  const easing = getComputedStyle(document.documentElement)
    .getPropertyValue("--ease-settle")
    .trim();
  const degrees = Number.parseFloat(step);
  if (!degrees || !easing) return;

  node.animate(
    { rotate: ["0deg", step] },
    { duration: degrees / SPIN_DEG_PER_MS, easing, composite: "add" },
  );
}

export default function ThemeToggle() {
  const T = useT();
  const theme = useTheme();
  const marks = useRef<Record<Theme, SVGGElement | null>>({ light: null, dark: null });

  const pick = (value: Theme) => {
    spin(marks.current[value]);
    setTheme(value);
  };

  return (
    <div
      role="group"
      aria-label={T("settings.theme.group")}
      className="border-line bg-inner relative flex h-7 shrink-0 items-center rounded-full border p-px"
    >
      <span
        aria-hidden="true"
        className={`theme-knob bg-canvas pointer-events-none absolute start-px top-px h-6 w-6 rounded-full transition-transform duration-200 ease-out ${
          theme === "dark" ? "translate-x-6 rtl:-translate-x-6" : "translate-x-0"
        }`}
      />
      {OPTIONS.map(({ value, labelKey, active, mark, glyph }) => (
        <button
          key={value}
          type="button"
          onClick={() => pick(value)}
          aria-pressed={theme === value}
          aria-label={T(labelKey)}
          className={`theme-option relative flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-150 after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] ${
            theme === value ? active : "text-mute hover:text-secondary"
          }`}
        >
          <svg
            className={mark}
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <g
              className="theme-spin"
              ref={(node) => {
                marks.current[value] = node;
              }}
            >
              {glyph}
            </g>
          </svg>
        </button>
      ))}
    </div>
  );
}
