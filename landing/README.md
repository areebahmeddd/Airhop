# Landing

React landing page for [airhop.1mindlabs.org](https://airhop.1mindlabs.org).

## Tech Stack

| Layer                 | Choice                     |
| --------------------- | -------------------------- |
| Framework             | React 19 + Vite            |
| Language              | TypeScript                 |
| Styling               | Tailwind CSS v4            |
| Animation             | Motion                     |
| Map                   | d3-geo + topojson-client   |
| Icons                 | Lucide                     |
| Routing               | React Router v7            |
| Linting               | ESLint + typescript-eslint |
| Formatting            | Prettier                   |
| Dependency Management | npm                        |
| Deployment            | Cloudflare Pages           |

## Performance Metrics

[Lighthouse](https://developer.chrome.com/docs/lighthouse) 13.4.1 against the deployed site
(`https://airhop.1mindlabs.org/`), using headless Chrome with simulated throttling. Values are the **median of 3 mobile and 2 desktop runs**.

| Category         | Mobile | Desktop |
| ---------------- | ------ | ------- |
| Performance      | 96     | 99      |
| Accessibility    | 100    | 100     |
| Best Practices   | 92     | 92      |
| SEO              | 100    | 100     |
| Agentic Browsing | 100    | 100     |

| Metric                         | Mobile | Desktop | Good         |
| ------------------------------ | ------ | ------- | ------------ |
| Time to First Byte (TTFB)      | 456 ms | 166 ms  | under 800 ms |
| First Contentful Paint (FCP)   | 1.74 s | 0.56 s  | under 1.8 s  |
| Speed Index                    | 1.74 s | 0.56 s  | n/a          |
| Largest Contentful Paint (LCP) | 3.28 s | 0.92 s  | under 2.5 s  |
| Total Blocking Time (TBT)      | 78 ms  | 0 ms    | under 200 ms |
| Cumulative Layout Shift (CLS)  | 0.001  | 0.001   | under 0.1    |

### Notes

- **TTFB and INP are not measured here.** TTFB depends on the deployed Cloudflare edge, while INP requires real user interactions. Use [CrUX](https://developer.chrome.com/docs/crux) or Search Console Core Web Vitals once the site has traffic. TBT is a lab metric and does not replace INP.
- **CLS is effectively zero.** Lazy-loaded sections reserve their space using sized placeholders, including the screenshot frame, relay map, and release badge.
- **Mobile LCP is above the 2.5 s target at 3.28 s.** The page is client-rendered and the main entry chunk must download and execute before the hero can paint. Cloudflare improved FCP from 2.11 s to 1.74 s, but LCP remained almost unchanged at 3.28 s. The current bottleneck is client-side execution. Prerendering the hero or deferring below-the-fold sections would address this, but neither is currently implemented. Desktop LCP is 0.92 s.
- **Best Practices is 92 because of Cloudflare Bot Fight Mode.** Its injected bot-detection script is blocked by the site's `script-src 'self'` CSP, producing a console error. The script uses a per-request token, so it cannot be safely allowlisted with a fixed hash. Disabling Bot Fight Mode restores the score to 100. Adding `'unsafe-inline'` to the CSP is not recommended.

## Internationalization

Thirty languages, alphabetically: Amharic, Arabic, Burmese, Chinese (Simplified), Chinese (Traditional), Dutch, English, Filipino, French, German, Hindi, Indonesian, Italian, Japanese, Korean, Malay, Nepali, Persian, Polish, Portuguese (Brazil), Russian, Spanish, Swahili, Swedish, Tamil, Thai, Turkish, Ukrainian, Urdu, Vietnamese. No library: catalogs are TypeScript modules in `src/i18n/locales/`, and `en.ts` is the source of truth. Same design as the app, in [`.github/skills/i18n.md`](../.github/skills/i18n.md).

- **Completeness is a type.** Every locale is annotated `Strings`, derived from `en.ts`, so a missing or stray key fails `tsc` and nothing falls back at runtime. Adding a language is a catalog plus entries in `languages.ts` and `LOADERS`; the compiler names whatever is left out.
- **Language names come from `Intl.DisplayNames`**, not the catalogs. Hand-writing every language's name in every language is CLDR data the platform already ships, and the cost is quadratic in the number of languages.
- **The URL is the language.** English at the root, the rest behind a prefix (`/es`, `/pt-br`, `/zh-hans`). `main.tsx` reads it once and hands it to `BrowserRouter` as a `basename`, so links stay in-locale and each route is declared once. Switching is a full page load, so only one catalog is ever downloaded.
- **The device language is suggested, never forced.** Redirecting on a perceived language hides the other versions from users and crawlers, so `LanguageSuggestion` offers a dismissible strip instead. A pick or a dismissal is remembered and it never returns.
- **Plurals go through `useTPlural`.** `Intl.PluralRules` selects the CLDR category, so Arabic gets six categories, Polish and Ukrainian four, and Japanese one. Appending a suffix is correct in English and wrong everywhere else.
- **Logical properties only**: `ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `text-start`. Physical ones do not flip, and nothing catches that until an Arabic build. Diagrams, the relay map and version strings are pinned `dir="ltr"`; they are data, not prose.
- **Mono is Latin-only.** JetBrains Mono carries no Arabic, Devanagari or Han, and letter-spacing breaks Arabic joining, so translated labels take `.label` and translated mono text takes `.mono`, both falling back to sans for every script except Latin and Cyrillic. Written that way round, a new script needs no stylesheet change. Raw `font-mono` is for machine data. Arabic, Persian, Urdu, Burmese and Nepali pin `Intl` to Latin digits so counts read against neighbouring version strings.
- **Deep pages stay English.** Architecture, FAQ, brand and legal bodies are wrapped in `EnglishContent`: legal text is authoritative in English and the specs track `docs/spec/`. Their chrome and metadata are still translated.

## SEO and crawlers

Route metadata lives once in `src/lib/seo.ts` and is emitted twice: by `useSEO` during client-side navigation, and by `plugins/static-html.ts` at build time. Neither owns the data, because the two have to agree.

- **The static files are not optional.** The site is a SPA behind a `/* /index.html 200` rewrite, so without a real file per route every route serves the homepage's `<head>`, and crawlers that do not execute JavaScript see one canonical URL for the whole site. The build therefore writes `dist/<locale>/<route>/index.html` for every route in every language.
- **`hreflang` is generated, never hand-kept.** Google discards annotations that are not reciprocal, so every page has to name every other. `x-default` points at the English root for readers no version matches.

When adding a route:

1. Add its metadata to `SEO` in `src/lib/seo.ts`. It is emitted in every language, so its `titleKey` and `descriptionKey` must exist in every catalog, which `tsc` enforces.
2. Add the route to `ROUTES` in `src/App.tsx`. If its body is English, wrap that body in `EnglishContent`.
3. Update `public/llms.txt` if the route should be included there.

## Getting Started

### Prerequisites

- Node.js 22+
- npm 12+

### Installation

```bash
git clone https://github.com/areebahmeddd/airhop
cd airhop/landing
npm install
```

### Running Locally

```bash
npm run dev
```

Available at `http://localhost:5173`
