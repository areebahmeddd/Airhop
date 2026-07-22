import { useId } from "react";
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
      className="mx-1 inline-block h-[9px] w-[10.5px] -translate-y-px align-middle"
      aria-hidden="true"
    >
      <style>
        {FILLED_PIXELS.map((_, i) => {
          const flip = FILL_START + (i * (FILL_END - FILL_START)) / steps;
          const unflip = UNFILL_START + (i * (UNFILL_END - UNFILL_START)) / steps;
          return `@keyframes ${uid}-${i} { 0%, ${flip.toFixed(1)}% { fill: #000; } ${(flip + 0.6).toFixed(1)}%, ${unflip.toFixed(1)}% { fill: #ef4444; } ${(unflip + 0.6).toFixed(1)}%, 100% { fill: #000; } }`;
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

const NAV_COLUMNS = [
  {
    heading: "Download",
    links: [
      { label: "App Store", href: "https://apps.apple.com/app/airhop/id000000000", external: true },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=org.onemindlabs.airhop",
        external: true,
      },
      {
        label: "F-Droid",
        href: "https://f-droid.org/en/packages/org.onemindlabs.airhop",
        external: true,
      },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Source Code", href: "https://github.com/areebahmeddd/Airhop", external: true },
      { label: "Blog", href: "/blogs", external: false },
      { label: "FAQ", href: "/faq", external: false },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy", external: false },
      { label: "Terms of Service", href: "/terms-of-service", external: false },
      {
        label: "Project License",
        href: "https://github.com/areebahmeddd/Airhop/blob/main/LICENSE",
        external: true,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white px-6 py-12 md:px-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 space-y-3 sm:col-span-2 md:col-span-1">
            <Link
              to="/"
              className="inline-block text-xl font-extrabold tracking-tighter text-black select-none"
              aria-label="Airhop home"
            >
              AIRHOP
            </Link>
            <p className="font-mono text-xs leading-relaxed text-gray-500 select-none">
              Offline peer-to-peer messaging
              <br />
              over Bluetooth mesh.
            </p>
            <p className="font-mono text-[10px] text-gray-500 select-none">
              No internet. No servers. No accounts.
            </p>
          </div>

          {NAV_COLUMNS.map((col) => (
            <div key={col.heading} className="space-y-3">
              <p className="font-mono text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-gray-500 transition-colors hover:text-black"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="font-mono text-xs text-gray-500 transition-colors hover:text-black"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6">
          <p className="text-center font-mono text-[10px] text-gray-500 select-none">
            &copy; Made with
            <PixelHeart />
            by{" "}
            <a
              href="https://areeb.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline hover:text-black"
            >
              Areeb Ahmed
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
