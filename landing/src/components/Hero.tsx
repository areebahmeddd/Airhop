import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface DownloadOption {
  label: string;
  description: string;
  href: string;
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

function SpiderIllustration() {
  return (
    <svg
      viewBox="0 0 480 460"
      className="h-auto w-full max-w-[400px] select-none"
      aria-hidden="true"
    >
      <path
        d="M 274,162 L 330,115 L 398,122"
        stroke="black"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 280,175 L 352,152 L 428,160"
        stroke="black"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 278,190 L 355,210 L 428,225"
        stroke="black"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 265,200 L 325,250 L 365,308"
        stroke="black"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M 206,162 L 150,115 L 82,122"
        stroke="black"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 200,175 L 128,152 L 52,160"
        stroke="black"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 202,190 L 125,210 L 52,225"
        stroke="black"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 215,200 L 155,250 L 115,308"
        stroke="black"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M 232,147 L 227,132 L 220,123"
        stroke="black"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 248,147 L 253,132 L 260,123"
        stroke="black"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M 213,168 L 200,150 L 193,141"
        stroke="black"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 267,168 L 280,150 L 287,141"
        stroke="black"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <ellipse cx="240" cy="272" rx="56" ry="62" fill="black" />

      <ellipse cx="240" cy="207" rx="9" ry="7" fill="black" />

      <ellipse cx="240" cy="179" rx="42" ry="35" fill="black" />

      <circle cx="231" cy="165" r="5.5" fill="white" />
      <circle cx="249" cy="165" r="5.5" fill="white" />

      <circle cx="221" cy="175" r="3.5" fill="white" opacity="0.55" />
      <circle cx="259" cy="175" r="3.5" fill="white" opacity="0.55" />
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
        if (typeof data.tag_name === "string") {
          setLatestRelease(data.tag_name);
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
              {latestRelease ? `${latestRelease} released` : "v1.0.0 released"}
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
          <SpiderIllustration />
        </motion.div>
      </div>
    </section>
  );
}
