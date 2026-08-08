import { REPO_LINKS, STORE_LINKS } from "@/lib/links";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface DownloadOption {
  label: string;
  description: string;
  href: string;
}

interface DownloadGroup {
  heading: string;
  options: DownloadOption[];
}

const DOWNLOAD_GROUPS: DownloadGroup[] = [
  {
    heading: "iOS",
    options: [
      {
        label: "App Store",
        description: "iOS 16.0+",
        href: STORE_LINKS.appStore,
      },
      {
        label: "TestFlight",
        description: "Public beta",
        href: STORE_LINKS.testFlight,
      },
    ],
  },
  {
    heading: "Android",
    options: [
      {
        label: "Google Play",
        description: "Android 8.0+",
        href: STORE_LINKS.playStore,
      },
      {
        label: "F-Droid",
        description: "F-Droid catalog",
        href: STORE_LINKS.fDroid,
      },
      {
        label: "APK",
        description: "Direct download",
        href: REPO_LINKS.apk,
      },
    ],
  },
];

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
  meta: string | null;
  url: string;
}

const RELEASE_FALLBACK: Release = {
  version: "v0.9.12",
  meta: null,
  url: RELEASES_URL,
};

function buildRelease(tag: string, publishedAt: string | null, url: string | null): Release | null {
  const version = tag.replace(/^v/, "").trim();
  if (!version) return null;

  const parts: string[] = [];

  const bird = RELEASE_BIRDS[version.split(".")[0]];
  if (bird) parts.push(bird);

  const date = publishedAt ? new Date(publishedAt) : null;
  if (date && !Number.isNaN(date.getTime())) {
    parts.push(
      date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    );
  }

  return {
    version: `v${version}`,
    meta: parts.length ? parts.join(" · ") : null,
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
        className="bg-ink text-canvas flex h-12 items-center gap-3 rounded-full pr-2 pl-7 text-sm font-medium transition-opacity duration-150 select-none hover:opacity-90"
      >
        Download the app
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
          className="border-line bg-card absolute top-full left-1/2 z-20 mt-2 w-80 max-w-[calc(100vw-2.5rem)] -translate-x-1/2 rounded-2xl border p-2"
        >
          {DOWNLOAD_GROUPS.map((group, gi) => (
            <div key={group.heading} className={gi > 0 ? "border-line mt-2 border-t pt-2" : ""}>
              <p className="text-secondary px-3 pt-1.5 pb-1 text-left font-mono text-[10px] font-semibold tracking-[0.18em] uppercase">
                {group.heading}
              </p>
              {group.options.map((option) => (
                <a
                  key={option.label}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="hover:bg-inner flex min-h-11 items-center justify-between gap-6 rounded-[10px] px-3 transition-colors duration-150"
                >
                  <span className="text-ink text-sm font-medium whitespace-nowrap">
                    {option.label}
                  </span>
                  <span className="text-secondary font-mono text-[11px] whitespace-nowrap">
                    {option.description}
                  </span>
                </a>
              ))}
            </div>
          ))}
        </motion.div>
      ) : null}
    </div>
  );
}

export default function Hero() {
  const [release, setRelease] = useState<Release>(RELEASE_FALLBACK);

  useEffect(() => {
    fetch(REPO_LINKS.releasesApi)
      .then((res) => (res.ok ? (res.json() as Promise<GitHubRelease>) : null))
      .then((data) => {
        if (!data) return;
        const tag = data.tag_name || data.name;
        if (typeof tag !== "string" || !tag) return;
        const next = buildRelease(
          tag,
          typeof data.published_at === "string" ? data.published_at : null,
          typeof data.html_url === "string" ? data.html_url : null,
        );
        if (next) setRelease(next);
      })
      .catch(() => {});
  }, []);

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
            className="group border-line bg-card-subtle hover:border-line-strong flex h-7 items-center gap-2 rounded-full border pr-2.5 pl-1 transition-colors duration-150"
          >
            <span className="sr-only">Latest release</span>
            <span className="bg-inner text-ink flex h-[22px] items-center gap-1.5 rounded-full px-2.5 font-mono text-[10px] font-medium">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="bg-ok absolute inline-flex h-full w-full animate-ping rounded-full opacity-50" />
                <span className="bg-ok relative inline-flex h-1.5 w-1.5 rounded-full" />
              </span>
              {release.version}
            </span>
            {release.meta ? (
              <span className="text-secondary font-mono text-[10px] tracking-wide whitespace-nowrap">
                {release.meta}
              </span>
            ) : null}
            <ArrowRight
              size={11}
              strokeWidth={2}
              className="text-mute flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>

        <h1 className="text-ink text-4xl leading-[1.06] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[64px]">
          Messaging that works without the internet.
        </h1>

        <p className="text-secondary mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
          Nearby phones form a Bluetooth mesh and relay your messages up to seven hops, end to end
          encrypted. <Underlined delay={0.7}>No servers</Underlined>,{" "}
          <Underlined delay={1.0}>no accounts</Underlined>,{" "}
          <Underlined delay={1.3}>no tracking</Underlined>.
        </p>

        <div className="mt-8 flex justify-center">
          <DownloadDropdown />
        </div>

        <p className="text-secondary mt-7 font-mono text-[11px] tracking-wider uppercase">
          MIT licensed · Free and open source · Works with bitchat
        </p>
      </motion.div>
    </section>
  );
}
