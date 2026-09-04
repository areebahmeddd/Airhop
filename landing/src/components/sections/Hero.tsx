import { formatShortDate, useLanguage, useT, type LanguageCode, type TranslationKey } from "@/i18n";
import { useRichText } from "@/i18n/rich-text";
import { REPO_LINKS, STORE_LINKS } from "@/lib/links";
import {
  ArrowRight,
  ChevronDown,
  Download,
  Globe,
  Laptop,
  Monitor,
  Play,
  Smartphone,
  Terminal,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

interface DownloadOption {
  label: string;
  description?: string;
  descriptionKey?: TranslationKey;
  icon: LucideIcon;
  href?: string;
}

interface DownloadGroup {
  headingKey: TranslationKey;
  options: DownloadOption[];
}

const DOWNLOAD_GROUPS: DownloadGroup[] = [
  {
    headingKey: "home.hero.group.mobile",
    options: [
      {
        label: "App Store",
        description: "iOS 16.0+",
        icon: Smartphone,
        href: STORE_LINKS.appStore,
      },
      {
        label: "Google Play",
        description: "Android 8.0+",
        icon: Play,
        href: STORE_LINKS.playStore,
      },
      {
        label: "Zapstore",
        descriptionKey: "home.hero.option.zapstore",
        icon: Zap,
        href: STORE_LINKS.zapstore,
      },
      {
        label: "APK",
        descriptionKey: "home.hero.option.apk",
        icon: Download,
        href: REPO_LINKS.apk,
      },
    ],
  },
  {
    headingKey: "home.hero.group.desktop",
    options: [
      { label: "macOS", descriptionKey: "home.hero.option.soon", icon: Laptop },
      { label: "Windows", descriptionKey: "home.hero.option.soon", icon: Monitor },
      { label: "Web", descriptionKey: "home.hero.option.soon", icon: Globe },
      { label: "CLI", descriptionKey: "home.hero.option.soon", icon: Terminal },
    ],
  },
];

const DOWNLOAD_ROW =
  "flex min-h-13 items-center gap-2.5 rounded-lg px-2 py-2 text-start sm:gap-3 sm:rounded-sm sm:px-3";

const RELEASE_BIRDS: Record<string, string> = {
  "1": "Albatross",
};

const RELEASES_URL = REPO_LINKS.releases;

interface GitHubRelease {
  tag_name?: unknown;
  name?: unknown;
  published_at?: unknown;
  html_url?: unknown;
}

interface Release {
  version: string;
  bird: string | null;
  date: string | null;
  url: string;
}

const RELEASE_FALLBACK: Release = {
  version: "v0.9.12",
  bird: null,
  date: null,
  url: RELEASES_URL,
};

function buildRelease(
  tag: string,
  publishedAt: string | null,
  url: string | null,
  language: LanguageCode,
): Release | null {
  const version = tag.replace(/^v/, "").trim();
  if (!version) return null;

  const date = publishedAt ? new Date(publishedAt) : null;
  const hasDate = date && !Number.isNaN(date.getTime());

  return {
    version: `v${version}`,
    bird: RELEASE_BIRDS[version.split(".")[0]] || null,
    date: hasDate ? formatShortDate(language, date) : null,
    url: url || RELEASES_URL,
  };
}

function Underlined({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <span className="text-ink relative whitespace-nowrap">
      {children}
      <svg
        className="absolute right-0 -bottom-1 left-0 h-[5px] w-full"
        viewBox="0 0 100 6"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 2 3 L 98 3"
          pathLength={100}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="hero-underline"
          style={{ animationDelay: `${delay}s` }}
        />
      </svg>
    </span>
  );
}

const DOWNLOAD_PANEL_ID = "download-options";

function DownloadDropdown() {
  const T = useT();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={DOWNLOAD_PANEL_ID}
        className="bg-ink text-canvas flex h-12 items-center gap-3 rounded-full ps-7 pe-2 text-sm font-medium transition-opacity duration-150 select-none hover:opacity-90 active:opacity-80"
      >
        {T("home.hero.download")}
        <span className="bg-canvas/15 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <ChevronDown
            size={14}
            strokeWidth={2.25}
            className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </span>
      </button>

      {open ? (
        <motion.div
          id={DOWNLOAD_PANEL_ID}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="border-line bg-card absolute top-full left-1/2 z-20 mt-2 grid max-h-[min(70vh,32rem)] w-[22rem] max-w-[calc(100vw-3rem)] -translate-x-1/2 grid-cols-[1.15fr_0.85fr] gap-2 overflow-y-auto overscroll-contain rounded-2xl border p-2 sm:w-[32rem] sm:gap-4 sm:p-3"
        >
          {DOWNLOAD_GROUPS.map((group, gi) => (
            <div
              key={group.headingKey}
              className={`min-w-0 ${gi > 0 ? "border-line border-s ps-2 sm:ps-4" : ""}`}
            >
              <p className="label text-secondary px-2 pt-1.5 pb-2 text-start text-[10px] font-semibold tracking-[0.18em] sm:px-3">
                {T(group.headingKey)}
              </p>
              {group.options.map((option) => {
                const Icon = option.icon;
                const description = option.descriptionKey
                  ? T(option.descriptionKey)
                  : (option.description ?? "");
                const body = (
                  <>
                    <Icon
                      size={16}
                      strokeWidth={1.75}
                      className={option.href ? "text-secondary shrink-0" : "text-mute shrink-0"}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span
                        className={`block truncate text-sm leading-5 font-medium ${option.href ? "text-ink" : "text-secondary"}`}
                      >
                        {option.label}
                      </span>
                      <span
                        className={`mono block truncate text-[11px] leading-4 ${option.href ? "text-secondary" : "text-mute"}`}
                      >
                        {description}
                      </span>
                    </span>
                  </>
                );

                return option.href ? (
                  <a
                    key={option.label}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={`${DOWNLOAD_ROW} hover:bg-inner active:bg-hover transition-colors duration-150`}
                  >
                    {body}
                  </a>
                ) : (
                  <div key={option.label} className={`${DOWNLOAD_ROW} select-none`}>
                    {body}
                  </div>
                );
              })}
            </div>
          ))}
        </motion.div>
      ) : null}
    </div>
  );
}

function HeroBody() {
  const T = useT();
  const nodes = useMemo(
    () => ({
      no_servers: <Underlined delay={0.7}>{T("home.hero.body.no_servers")}</Underlined>,
      no_accounts: <Underlined delay={1.0}>{T("home.hero.body.no_accounts")}</Underlined>,
      no_tracking: <Underlined delay={1.3}>{T("home.hero.body.no_tracking")}</Underlined>,
    }),
    [T],
  );

  return <>{useRichText("home.hero.body", nodes)}</>;
}

export default function Hero() {
  const T = useT();
  const language = useLanguage();
  const [release, setRelease] = useState<Release>(RELEASE_FALLBACK);

  useEffect(() => {
    let cancelled = false;

    fetch(REPO_LINKS.releasesApi)
      .then((res) => (res.ok ? (res.json() as Promise<GitHubRelease>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        const tag = data.tag_name || data.name;
        if (typeof tag !== "string" || !tag) return;
        const next = buildRelease(
          tag,
          typeof data.published_at === "string" ? data.published_at : null,
          typeof data.html_url === "string" ? data.html_url : null,
          language,
        );
        if (next) setRelease(next);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [language]);

  return (
    <section className="px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mx-auto flex max-w-3xl flex-col items-center pt-10 pb-16 text-center md:pt-14 md:pb-20"
      >
        <div className="mb-7 flex h-7 items-center">
          <a
            href={release.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group border-line bg-card-subtle hover:border-line-strong active:bg-inner flex h-7 items-center gap-2 rounded-full border ps-0.5 pe-2.5 transition-colors duration-150"
          >
            <span className="sr-only">{T("home.hero.release")}</span>
            <span
              className="bg-inner text-ink flex h-[22px] items-center gap-1.5 rounded-full px-2.5 font-mono text-[10px] font-medium"
              dir="ltr"
            >
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="bg-ok absolute inline-flex h-full w-full animate-ping rounded-full opacity-50" />
                <span className="bg-ok relative inline-flex h-1.5 w-1.5 rounded-full" />
              </span>
              {release.version}
              {release.bird ? <span className="text-secondary">{release.bird}</span> : null}
            </span>
            {release.date ? (
              <span className="text-secondary mono text-[10px] tracking-wide whitespace-nowrap">
                {release.date}
              </span>
            ) : null}
            <ArrowRight
              size={11}
              strokeWidth={2}
              className="text-mute flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>

        <h1 className="text-ink text-4xl leading-[1.06] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[64px]">
          {T("home.hero.title")}
        </h1>

        <p className="text-secondary mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
          <HeroBody />
        </p>

        <div className="mt-8 flex justify-center">
          <DownloadDropdown />
        </div>

        <p className="label text-secondary mt-7 text-[11px] tracking-wider">
          {T("home.hero.badges")}
        </p>
      </motion.div>
    </section>
  );
}
