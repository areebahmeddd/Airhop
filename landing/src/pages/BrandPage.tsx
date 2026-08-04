import { ArrowLeft, Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

const BIRD_PIXELS = [
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
];

function Mark({ className, fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 11 6" className={className} shapeRendering="crispEdges" aria-hidden="true">
      {BIRD_PIXELS.flatMap((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={fill} />
          ) : null,
        ),
      )}
    </svg>
  );
}

const CORE_COLORS = [
  { name: "Ink", hex: "#111111", use: "Text, the mark, every interactive surface" },
  { name: "Body", hex: "#565656", use: "Supporting copy" },
  { name: "Mute", hex: "#6F6F6F", use: "Timestamps, labels, placeholders" },
  { name: "Line", hex: "#E4E4E4", use: "Dividers and card borders" },
  { name: "Raised", hex: "#F0F0F0", use: "Inputs, segmented controls, pills" },
  { name: "Surface", hex: "#FFFFFF", use: "Cards, rows, sheets" },
  { name: "Paper", hex: "#F8F8F8", use: "App background" },
];

const DARK_COLORS = [
  { name: "Ink Inverse", hex: "#F5F5F5", use: "Text and the mark on dark" },
  { name: "Line Dark", hex: "#2A2A2A", use: "Dividers on dark" },
  { name: "Surface Dark", hex: "#161616", use: "Cards on dark" },
  { name: "Paper Dark", hex: "#0B0B0B", use: "App background, dark" },
];

const SEMANTIC_COLORS = [
  { name: "Green", hex: "#16A34A", use: "In range, and end-to-end encrypted" },
  { name: "Blue", hex: "#2563EB", use: "Verified contact, and traffic over a relay" },
  { name: "Violet", hex: "#7C3AED", use: "Onion-routed traffic (Tor)" },
  { name: "Teal", hex: "#0D9488", use: "This device is acting as an internet gateway" },
  { name: "Indigo", hex: "#4F46E5", use: "Mesh bridge is linking two crowds" },
  { name: "Amber", hex: "#D97706", use: "Scanning, reconnecting, degraded" },
  { name: "Red", hex: "#DC2626", use: "Destructive actions and the panic wipe" },
];

const DOWNLOADS = [
  { label: "Mark", detail: "SVG, black", href: "/brand/airhop-mark.svg" },
  { label: "Mark", detail: "SVG, white", href: "/brand/airhop-mark-inverse.svg" },
  { label: "Mark", detail: "PNG, 512px", href: "/brand/airhop-mark-512.png" },
  { label: "Lockup", detail: "SVG, black", href: "/brand/airhop-lockup.svg" },
  { label: "Lockup", detail: "SVG, white", href: "/brand/airhop-lockup-inverse.svg" },
  { label: "App icon", detail: "SVG, 1024px", href: "/brand/airhop-icon.svg" },
  { label: "Social card", detail: "PNG, 1200x630", href: "/brand/airhop-og.png" },
];

const FACTS = [
  { k: "Name", v: "Airhop" },
  { k: "Category", v: "Messaging" },
  { k: "Platforms", v: "iOS 16.0 and later, Android 8.0 and later" },
  { k: "Price", v: "Free. No ads, no subscriptions, no in-app purchases" },
  { k: "Licence", v: "MIT" },
  { k: "Maintainer", v: "Areeb Ahmed, independent" },
  { k: "Site", v: "airhop.1mindlabs.org" },
  { k: "Source", v: "github.com/areebahmeddd/airhop" },
  { k: "Press contact", v: "hi@areeb.dev" },
];

const BOILERPLATE_SHORT =
  "Airhop is a free, open-source messenger that works with no internet: nearby phones form a Bluetooth mesh and relay messages for each other.";

const BOILERPLATE_LONG =
  "Airhop is a free, open-source messenger for iOS and Android that keeps working when the network does not. Phones near each other form a Bluetooth mesh and pass messages along, up to seven hops deep, with no towers, no servers and no accounts. Identity is a key pair generated on the device, direct messages are end-to-end encrypted with Noise XX and Double Ratchet, and Cashu ecash can move device to device with neither phone online. When the internet is available, Nostr relays extend location channels beyond Bluetooth range. Airhop is wire-compatible with bitchat and is maintained independently by Areeb Ahmed under the MIT licence.";

function CopyRow({ value, children }: { value: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    void navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      })
      .catch(() => {});
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex w-full items-center gap-3 border-b border-gray-100 py-2.5 text-left transition-colors hover:bg-gray-50"
      aria-label={`Copy ${value}`}
    >
      {children}
      <span className="shrink-0 text-gray-300 transition-colors group-hover:text-gray-500">
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

function Swatch({ name, hex, use }: { name: string; hex: string; use: string }) {
  return (
    <CopyRow value={hex}>
      <span
        className="h-8 w-8 shrink-0 border border-gray-200"
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-gray-900">{name}</span>
        <span className="block truncate text-[11px] text-gray-500">{use}</span>
      </span>
      <span className="w-20 shrink-0 text-right text-[11px] tracking-wider text-gray-400 uppercase">
        {hex}
      </span>
    </CopyRow>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-gray-100 pt-10">
      <h2 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function BrandPage() {
  useSEO({
    title: "Brand Kit | Airhop",
    description:
      "The Airhop brand kit: the pixel bird mark, the wordmark, colour and type tokens, press assets and boilerplate.",
    path: "/brand",
  });

  return (
    <main id="main-content" className="min-h-screen bg-white font-sans antialiased">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to home
        </Link>

        <div className="mt-10">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Brand Kit</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Assets and rules for putting Airhop in an article, a store listing, a talk or a README.
            Free to use for reference and press.
          </p>
        </div>

        <div className="mt-14 space-y-12">
          <Section title="The mark">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex aspect-[4/3] items-center justify-center border border-gray-200 bg-white">
                <Mark className="h-auto w-32 text-black" />
              </div>
              <div className="flex aspect-[4/3] items-center justify-center border border-gray-200 bg-black">
                <Mark className="h-auto w-32 text-white" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              A bird on an eleven by six pixel grid. The only mark Airhop has. Black on light, white
              on dark.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="border border-gray-200 p-4">
                <p className="text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                  Clear space
                </p>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Two grid cells on every side. At a 110px mark, 20px. Nothing crosses it, including
                  the wordmark.
                </p>
              </div>
              <div className="border border-gray-200 p-4">
                <p className="text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                  Minimum size
                </p>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  22px on screen, 6mm in print. Below that the single-pixel tail closes up.
                </p>
              </div>
            </div>
          </Section>

          <Section title="The lockup">
            <div className="flex items-center justify-center border border-gray-200 bg-white px-6 py-10">
              <div className="flex items-center gap-5">
                <Mark className="h-auto w-16 text-black" />
                <span className="text-xl font-bold tracking-[0.34em] text-black">AIRHOP</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Mark left, wordmark right, centred on the wordmark's cap height, gap about a quarter
              of the mark's width. The wordmark is always capitals, JetBrains Mono Bold, 0.34em
              tracking. Where the mark alone is understood, use the mark alone.
            </p>
          </Section>

          <Section title="Colour">
            <p className="text-sm leading-relaxed text-gray-600">
              Monochrome. Every colour carries meaning. Semantic hues are never decorative, and
              every value is contrast-checked against its surface.
            </p>
            <div className="mt-6 space-y-8">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                  Core
                </p>
                <div className="border-t border-gray-100">
                  {CORE_COLORS.map((c) => (
                    <Swatch key={c.hex} {...c} />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                  Dark
                </p>
                <div className="border-t border-gray-100">
                  {DARK_COLORS.map((c) => (
                    <Swatch key={c.hex} {...c} />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                  Semantic
                </p>
                <div className="border-t border-gray-100">
                  {SEMANTIC_COLORS.map((c) => (
                    <Swatch key={c.hex} {...c} />
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Type">
            <div className="space-y-4">
              <div className="border border-gray-200 p-5">
                <p className="text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                  Primary
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                  JetBrains Mono
                </p>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  The wordmark, every label, and anything a machine produced: peer IDs, geohashes,
                  keys, mint URLs, sat amounts. Also the face of this site. SIL Open Font License.
                </p>
              </div>
              <div className="border border-gray-200 p-5">
                <p className="text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                  Secondary
                </p>
                <p
                  className="mt-2 text-2xl font-bold tracking-tight text-gray-900"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  Platform system sans
                </p>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  SF Pro on iOS, Roboto on Android. All in-product text and every store headline.
                  The app ships no custom UI face: it should read like the phone it runs on.
                </p>
              </div>
            </div>
            <div className="mt-4 border border-gray-200 p-5">
              <p className="text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                Scale
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-3">
                {[
                  ["Display", "38 / 30"],
                  ["Title", "24 / 20"],
                  ["Body", "17 / 15"],
                  ["Small", "13 / 11"],
                  ["Micro", "10"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="text-gray-900">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Section>

          <Section title="Downloads">
            <div className="grid gap-2 sm:grid-cols-2">
              {DOWNLOADS.map((d) => (
                <a
                  key={`${d.label}-${d.detail}`}
                  href={d.href}
                  download
                  className="group flex items-center gap-3 border border-gray-200 px-4 py-3 transition-colors hover:border-black hover:bg-gray-50"
                >
                  <Download className="h-3.5 w-3.5 shrink-0 text-gray-400 transition-colors group-hover:text-black" />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-gray-900">{d.label}</span>
                    <span className="block text-[11px] text-gray-500">{d.detail}</span>
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              Store screenshots, the feature graphic and the social banners are in{" "}
              <a
                href="https://github.com/areebahmeddd/airhop/tree/main/press/out"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
              >
                press/out
              </a>{" "}
              in the repository, light and dark.
            </p>
          </Section>

          <Section title="Facts and boilerplate">
            <dl className="border-t border-gray-100">
              {FACTS.map((f) => (
                <div key={f.k} className="flex gap-4 border-b border-gray-100 py-2.5">
                  <dt className="w-32 shrink-0 text-xs text-gray-500">{f.k}</dt>
                  <dd className="text-xs text-gray-900">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 space-y-3">
              <CopyRow value={BOILERPLATE_SHORT}>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                    One line
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-gray-700">
                    {BOILERPLATE_SHORT}
                  </span>
                </span>
              </CopyRow>
              <CopyRow value={BOILERPLATE_LONG}>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                    Full paragraph
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-gray-700">
                    {BOILERPLATE_LONG}
                  </span>
                </span>
              </CopyRow>
            </div>
          </Section>

          <Section title="Using these">
            <p className="text-sm leading-relaxed text-gray-600">
              The code is MIT licensed. The assets here may be used to write about, link to or
              review Airhop, including in app directories and store listings. They may not imply
              endorsement or a partnership that does not exist, or sit on a modified build presented
              as the original. Airhop is independent and is not affiliated with permissionlesstech
              or the bitchat project.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Anything not covered here, or a missing asset, goes to{" "}
              <a
                href="mailto:hi@areeb.dev"
                className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
              >
                hi@areeb.dev
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
