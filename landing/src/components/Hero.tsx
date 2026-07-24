import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface DownloadOption {
  label: string;
  description: string;
  href: string;
}

const RELEASE_BIRDS: Record<string, string> = {
  "1": "Albatross",
};

function formatRelease(tag: string, publishedAt: string | null): string {
  const version = tag.replace(/^v/, "");
  const parts = [`v${version}`];

  const bird = RELEASE_BIRDS[version.split(".")[0]];
  if (bird) parts.push(bird);

  if (publishedAt) {
    const date = new Date(publishedAt);
    if (!Number.isNaN(date.getTime())) {
      parts.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      );
    }
  }

  return parts.join(" · ");
}

function DownloadDropdown({
  label,
  variant,
  options,
}: {
  label: string;
  variant: "primary" | "secondary";
  options: DownloadOption[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const triggerClass =
    variant === "primary"
      ? "border border-transparent bg-black text-white hover:bg-black/90"
      : "border border-black/20 bg-white text-black hover:border-black hover:bg-gray-50";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`flex w-full items-center gap-2 px-6 py-3.5 text-sm font-bold tracking-widest shadow-sm transition-all select-none sm:w-auto ${triggerClass}`}
      >
        <span className="w-3.5 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1 text-center">{label}</span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute top-full left-0 z-20 mt-2 w-full border border-black/20 bg-white shadow-lg"
        >
          {options.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block border-b border-gray-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50"
            >
              <div className="font-mono text-xs font-bold tracking-widest text-black uppercase">
                {option.label}
              </div>
              <div className="mt-0.5 font-mono text-[11px] font-normal text-gray-500">
                {option.description}
              </div>
            </a>
          ))}
        </motion.div>
      ) : null}
    </div>
  );
}

const BIRD_PIXELS = [
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
];

function PixelBird() {
  const cols = BIRD_PIXELS[0].length;
  const rows = BIRD_PIXELS.length;
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      className="h-auto w-full max-w-[360px] select-none"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {BIRD_PIXELS.flatMap((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill="black" />
          ) : null,
        ),
      )}
    </svg>
  );
}

export default function Hero() {
  const [stars, setStars] = useState<number | null>(null);
  const [latestRelease, setLatestRelease] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/areebahmeddd/Airhop")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});

    fetch("https://api.github.com/repos/areebahmeddd/Airhop/releases/latest")
      .then((res) => res.json())
      .then((data) => {
        const tag = data.tag_name || data.name;
        if (typeof tag === "string" && tag) {
          setLatestRelease(
            formatRelease(tag, typeof data.published_at === "string" ? data.published_at : null),
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="dot-grid relative flex min-h-[calc(100vh-64px)] items-center overflow-hidden px-6 py-12 md:px-12 md:py-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="z-10 flex flex-col space-y-6"
        >
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-black select-none sm:text-5xl lg:text-6xl">
            Offline<span className="text-gray-300">.</span> Private
            <span className="text-gray-300">.</span> Free<span className="text-gray-300">.</span>
          </h1>

          <p className="max-w-xl text-base font-medium text-gray-700 sm:text-lg">
            Peer-to-peer messaging over Bluetooth mesh. No internet, no servers, no accounts. Works
            during blackouts, protests, and disasters.
          </p>

          <div className="inline-flex w-fit items-center space-x-2 border border-gray-200 bg-gray-100 px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="font-mono text-xs font-semibold tracking-widest text-gray-600 uppercase">
              {latestRelease ?? "v1.0.0 · Albatross"}
            </span>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <DownloadDropdown
              label="APPLE"
              variant="primary"
              options={[
                {
                  label: "App Store",
                  description: "Download from the iOS App Store",
                  href: "https://apps.apple.com/app/airhop/id000000000",
                },
                {
                  label: "TestFlight",
                  description: "Join the public beta",
                  href: "https://testflight.apple.com/join/airhop",
                },
              ]}
            />
            <DownloadDropdown
              label="ANDROID"
              variant="secondary"
              options={[
                {
                  label: "Google Play",
                  description: "Download from the Play Store",
                  href: "https://play.google.com/store/apps/details?id=org.onemindlabs.airhop",
                },
                {
                  label: "F-Droid",
                  description: "Install from the F-Droid catalog",
                  href: "https://f-droid.org/en/packages/org.onemindlabs.airhop",
                },
                {
                  label: "APK",
                  description: "Direct download, latest version",
                  href: "https://github.com/areebahmeddd/Airhop/releases/latest/download/airhop.apk",
                },
              ]}
            />
            <a
              href="https://github.com/areebahmeddd/Airhop"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex w-full items-center justify-center border border-black/20 bg-white px-6 py-3.5 text-sm font-bold tracking-widest text-black shadow-sm transition-all select-none hover:border-black hover:bg-gray-50 sm:w-auto sm:gap-2"
            >
              GITHUB
              <span className="absolute right-6 font-mono text-xs font-normal text-amber-700 sm:static">
                &#9733; {stars !== null ? stars.toLocaleString() : "—"}
              </span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="flex items-center justify-center py-4 lg:py-0"
        >
          <PixelBird />
        </motion.div>
      </div>
    </section>
  );
}
