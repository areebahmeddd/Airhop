import PageHeader from "@/components/ui/PageHeader";
import Mark from "@/components/ui/PixelBird";
import TextLink from "@/components/ui/TextLink";
import { useSEO } from "@/hooks/useSEO";
import { useT } from "@/i18n";
import { REPO_LINKS, REPO_URL, SITE_URL } from "@/lib/links";
import { SEO } from "@/lib/seo";
import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";

const CORE_COLORS = [
  { name: "Ink", hex: "#1C2024", use: "Text, the mark, every interactive surface" },
  { name: "Body", hex: "#60646C", use: "Supporting copy" },
  { name: "Mute", hex: "#6E7178", use: "Timestamps, labels, placeholders" },
  { name: "Line", hex: "#D9D9E0", use: "Hairline dividers and card borders" },
  { name: "Border", hex: "#CDCED6", use: "Emphasised borders and focus edges" },
  { name: "Raised", hex: "#F0F0F3", use: "Inputs, segmented controls, pills" },
  { name: "Hover", hex: "#E8E8EC", use: "Hover and pressed fills" },
  { name: "Surface", hex: "#FCFCFD", use: "Cards, rows, sheets" },
  { name: "Paper", hex: "#FFFFFF", use: "App background" },
];

const DARK_COLORS = [
  { name: "Ink Inverse", hex: "#EDEEF0", use: "Text and the mark on dark" },
  { name: "Body Dark", hex: "#B0B4BA", use: "Supporting copy on dark" },
  { name: "Mute Dark", hex: "#878B94", use: "Timestamps, labels, placeholders on dark" },
  { name: "Line Dark", hex: "#363A3F", use: "Dividers on dark" },
  { name: "Border Dark", hex: "#43484E", use: "Emphasised borders on dark" },
  { name: "Raised Dark", hex: "#282A2D", use: "Inputs, segmented controls, pills on dark" },
  { name: "Hover Dark", hex: "#2F3134", use: "Hover and pressed fills on dark" },
  { name: "Surface Dark", hex: "#17181A", use: "Cards on dark" },
  { name: "Paper Dark", hex: "#0C0D0E", use: "App background, dark" },
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
  { label: "Mark", detail: "SVG, white", href: "/brand/airhop-mark-inverse.svg" },
  { label: "Mark", detail: "SVG, black", href: "/brand/airhop-mark.svg" },
  { label: "Mark", detail: "PNG, 512px", href: "/brand/airhop-mark-512.png" },
  { label: "Lockup", detail: "SVG, white", href: "/brand/airhop-lockup-inverse.svg" },
  { label: "Lockup", detail: "SVG, black", href: "/brand/airhop-lockup.svg" },
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
  { k: "Site", v: SITE_URL.replace("https://", "") },
  { k: "Source", v: REPO_URL.replace("https://", "") },
  { k: "Press contact", v: "hi@areeb.dev" },
];

const BOILERPLATE_SHORT =
  "Airhop is a free, open-source messenger that works with no internet: nearby phones form a Bluetooth mesh and relay messages for each other.";

const BOILERPLATE_LONG =
  "Airhop is a free, open-source messenger for iOS and Android that keeps working when the network does not. Phones near each other form a Bluetooth mesh and pass messages along, up to seven hops deep, with no towers, no servers and no accounts. Identity is a key pair generated on the device, direct messages are end-to-end encrypted with Noise XX and Double Ratchet, and Cashu ecash can move device to device with neither phone online. When the internet is available, Nostr relays extend location channels beyond Bluetooth range. Airhop is wire-compatible with bitchat and is maintained independently by Areeb Ahmed under the MIT licence.";

function CopyRow({ value, children }: { value: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    if (!navigator.clipboard) return;
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
      className="group border-line hover:bg-card-subtle flex w-full items-center gap-3 border-b py-2.5 text-left transition-colors"
      aria-label={`Copy ${value}`}
    >
      {children}
      <span className="text-mute group-hover:text-secondary shrink-0 transition-colors">
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

function Swatch({ name, hex, use }: { name: string; hex: string; use: string }) {
  return (
    <CopyRow value={hex}>
      <span
        className="border-line h-8 w-8 shrink-0 border"
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        <span className="text-ink block text-xs font-semibold">{name}</span>
        <span className="text-secondary block truncate text-[11px]">{use}</span>
      </span>
      <span className="text-mute w-20 shrink-0 text-right text-[11px] tracking-wider uppercase">
        {hex}
      </span>
    </CopyRow>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line border-t pt-10">
      <h2 className="text-ink text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function BrandPage() {
  const T = useT();

  useSEO(SEO["/brand"]);

  return (
    <main id="main-content">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <PageHeader
          eyebrow={T("page.brand.eyebrow")}
          title={T("page.brand.title")}
          meta={T("page.brand.meta")}
        />

        <div className="mt-14 space-y-12">
          <Panel title="The mark">
            <div className="grid grid-cols-2 gap-3">
              <div
                className="border-line flex aspect-[4/3] items-center justify-center rounded-2xl border"
                style={{ backgroundColor: "#ffffff" }}
              >
                <Mark className="h-auto w-32" fill="#1C2024" />
              </div>
              <div
                className="border-line flex aspect-[4/3] items-center justify-center rounded-2xl border"
                style={{ backgroundColor: "#0C0D0E" }}
              >
                <Mark className="h-auto w-32" fill="#EDEEF0" />
              </div>
            </div>
            <p className="text-secondary mt-4 text-sm leading-relaxed">
              A bird on an eleven by six pixel grid. The only mark Airhop has. Black on light, white
              on dark.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="border-line rounded-2xl border p-4">
                <p className="text-mute text-[10px] font-bold tracking-[0.18em] uppercase">
                  Clear space
                </p>
                <p className="text-secondary mt-2 text-xs leading-relaxed">
                  Two grid cells on every side. At a 110px mark, 20px. Nothing crosses it, including
                  the wordmark.
                </p>
              </div>
              <div className="border-line rounded-2xl border p-4">
                <p className="text-mute text-[10px] font-bold tracking-[0.18em] uppercase">
                  Minimum size
                </p>
                <p className="text-secondary mt-2 text-xs leading-relaxed">
                  22px on screen, 6mm in print. Below that the single-pixel tail closes up.
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="The lockup">
            <div className="border-line bg-canvas flex items-center justify-center rounded-2xl border px-6 py-10">
              <div className="flex items-center gap-5">
                <Mark className="text-ink h-auto w-16" />
                <span className="text-ink font-mono text-xl font-bold tracking-[0.34em]">
                  AIRHOP
                </span>
              </div>
            </div>
            <p className="text-secondary mt-4 text-sm leading-relaxed">
              Mark left, wordmark right, centred on the wordmark's cap height, gap about a quarter
              of the mark's width. The wordmark is always capitals, JetBrains Mono Bold, 0.34em
              tracking. Where the mark alone is understood, use the mark alone.
            </p>
          </Panel>

          <Panel title="Colour">
            <p className="text-secondary text-sm leading-relaxed">
              Slightly cool layered neutrals, shared by the app and this site: one ramp, light and
              dark, with depth from stepping surfaces rather than shadows. These values are the
              source of truth for both. Semantic hues are never decorative, and every value is
              contrast-checked against its surface.
            </p>
            <div className="mt-6 space-y-8">
              <div>
                <p className="text-mute mb-1 text-[10px] font-bold tracking-[0.18em] uppercase">
                  Core
                </p>
                <div className="border-line border-t">
                  {CORE_COLORS.map((c) => (
                    <Swatch key={c.hex} {...c} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-mute mb-1 text-[10px] font-bold tracking-[0.18em] uppercase">
                  Dark
                </p>
                <div className="border-line border-t">
                  {DARK_COLORS.map((c) => (
                    <Swatch key={c.hex} {...c} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-mute mb-1 text-[10px] font-bold tracking-[0.18em] uppercase">
                  Semantic
                </p>
                <div className="border-line border-t">
                  {SEMANTIC_COLORS.map((c) => (
                    <Swatch key={c.hex} {...c} />
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Type">
            <div className="space-y-4">
              <div className="border-line rounded-2xl border p-5">
                <p className="text-mute text-[10px] font-bold tracking-[0.18em] uppercase">
                  Primary
                </p>
                <p className="text-ink mt-2 font-sans text-2xl font-bold tracking-tight">
                  Platform system sans
                </p>
                <p className="text-secondary mt-2 text-xs leading-relaxed">
                  SF Pro on iOS, Roboto on Android. All in-product text and every store headline.
                  The app ships no custom UI face: it should read like the phone it runs on.
                </p>
              </div>
              <div className="border-line rounded-2xl border p-5">
                <p className="text-mute text-[10px] font-bold tracking-[0.18em] uppercase">
                  Secondary
                </p>
                <p className="text-ink mt-2 font-mono text-2xl font-bold tracking-tight">
                  JetBrains Mono
                </p>
                <p className="text-secondary mt-2 text-xs leading-relaxed">
                  The wordmark, every label, and anything a machine produced: peer IDs, geohashes,
                  keys, mint URLs, sat amounts. Also the face of this site. SIL Open Font License.
                </p>
              </div>
            </div>
            <div className="border-line mt-4 rounded-2xl border p-5">
              <p className="text-mute text-[10px] font-bold tracking-[0.18em] uppercase">Scale</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-3">
                {[
                  ["Display", "38 / 30"],
                  ["Title", "24 / 20"],
                  ["Body", "17 / 15"],
                  ["Small", "13 / 11"],
                  ["Micro", "10"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-secondary">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Panel>

          <Panel title="Downloads">
            <div className="grid gap-2 sm:grid-cols-2">
              {DOWNLOADS.map((d, i) => (
                <a
                  key={`${d.label}-${d.detail}`}
                  href={d.href}
                  download
                  className={`group border-line hover:bg-card-subtle hover:border-line-strong flex items-center gap-3 rounded-[10px] border px-4 py-3 transition-colors ${
                    i === DOWNLOADS.length - 1 ? "sm:col-span-2 sm:justify-center" : ""
                  }`}
                >
                  <Download className="text-mute group-hover:text-ink h-3.5 w-3.5 shrink-0 transition-colors" />
                  <span className="min-w-0">
                    <span className="text-ink block text-xs font-semibold">{d.label}</span>
                    <span className="text-secondary block text-[11px]">{d.detail}</span>
                  </span>
                </a>
              ))}
            </div>
            <p className="text-secondary mt-4 text-xs leading-relaxed">
              Store screenshots, the feature graphic and the social banners are in{" "}
              <TextLink href={REPO_LINKS.pressAssets}>press/out</TextLink> in the repository, light
              and dark.
            </p>
          </Panel>

          <Panel title="Facts and boilerplate">
            <dl className="border-line border-t">
              {FACTS.map((f) => (
                <div key={f.k} className="border-line flex gap-4 border-b py-2.5">
                  <dt className="text-secondary w-32 shrink-0 text-xs">{f.k}</dt>
                  <dd className="text-ink text-xs">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 space-y-3">
              <CopyRow value={BOILERPLATE_SHORT}>
                <span className="min-w-0 flex-1">
                  <span className="text-mute block text-[10px] font-bold tracking-[0.18em] uppercase">
                    One line
                  </span>
                  <span className="text-secondary mt-1 block text-xs leading-relaxed">
                    {BOILERPLATE_SHORT}
                  </span>
                </span>
              </CopyRow>
              <CopyRow value={BOILERPLATE_LONG}>
                <span className="min-w-0 flex-1">
                  <span className="text-mute block text-[10px] font-bold tracking-[0.18em] uppercase">
                    Full paragraph
                  </span>
                  <span className="text-secondary mt-1 block text-xs leading-relaxed">
                    {BOILERPLATE_LONG}
                  </span>
                </span>
              </CopyRow>
            </div>
          </Panel>

          <Panel title="Using these">
            <p className="text-secondary text-sm leading-relaxed">
              The code is MIT licensed. The assets here may be used to write about, link to or
              review Airhop, including in app directories and store listings. They may not imply
              endorsement or a partnership that does not exist, or sit on a modified build presented
              as the original. Airhop is independent and is not affiliated with permissionlesstech
              or the bitchat project.
            </p>
            <p className="text-secondary mt-4 text-sm leading-relaxed">
              For anything not covered here, or if you need an asset that isn't included, contact{" "}
              <TextLink href="mailto:hi@areeb.dev">hi@areeb.dev</TextLink>.
            </p>
          </Panel>
        </div>
      </div>
    </main>
  );
}
