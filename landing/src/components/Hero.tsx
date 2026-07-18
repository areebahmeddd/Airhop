import { motion } from "motion/react";
import { useEffect, useState } from "react";

function SpiderIllustration() {
  return (
    <svg
      viewBox="0 0 480 460"
      className="h-auto w-full max-w-[400px] select-none"
      aria-hidden="true"
    >
      {/* Right legs — front to back */}
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

      {/* Left legs — mirror */}
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

      {/* Chelicerae (fangs) */}
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

      {/* Pedipalps */}
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

      {/* Abdomen */}
      <ellipse cx="240" cy="272" rx="56" ry="62" fill="black" />

      {/* Pedicel (waist) */}
      <ellipse cx="240" cy="207" rx="9" ry="7" fill="black" />

      {/* Cephalothorax */}
      <ellipse cx="240" cy="179" rx="42" ry="35" fill="black" />

      {/* Primary eyes */}
      <circle cx="231" cy="165" r="5.5" fill="white" />
      <circle cx="249" cy="165" r="5.5" fill="white" />

      {/* Secondary eyes */}
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
    <section className="dot-grid relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden px-6 py-12 md:px-12 md:py-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="z-10 flex flex-col space-y-6"
        >
          <div className="inline-flex w-fit items-center space-x-2 border border-gray-200 bg-gray-100 px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="font-mono text-xs font-semibold tracking-widest text-gray-600 uppercase">
              {latestRelease ? `${latestRelease} released` : "v1.0.0 released"}
            </span>
          </div>

          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-black select-none sm:text-5xl lg:text-6xl">
            Offline<span className="text-gray-300">.</span> Private
            <span className="text-gray-300">.</span> Free<span className="text-gray-300">.</span>
          </h1>

          <p className="max-w-xl text-base font-medium text-gray-700 sm:text-lg">
            Peer-to-peer messaging over Bluetooth mesh. No internet, no servers, no accounts. Works
            during blackouts, protests, and disasters.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <a
              href="https://apps.apple.com/app/airhop/id000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black px-6 py-3.5 text-center text-sm font-bold tracking-widest text-white shadow-sm transition-all select-none hover:bg-black/90 hover:shadow"
            >
              APP STORE
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=org.onemindlabs.airhop"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-black/20 bg-white px-6 py-3.5 text-center text-sm font-bold tracking-widest text-black transition-all select-none hover:border-black hover:bg-gray-50"
            >
              GOOGLE PLAY
            </a>
            <a
              href="https://github.com/areebahmeddd/Airhop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-black/20 bg-white px-6 py-3.5 text-sm font-bold tracking-widest text-black transition-all select-none hover:border-black hover:bg-gray-50"
            >
              GITHUB
              <span className="font-mono text-xs font-normal text-yellow-500">
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
