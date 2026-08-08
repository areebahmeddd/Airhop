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

[Lighthouse](https://developer.chrome.com/docs/lighthouse) 13.4.1 against a production build of `/`
(`npm run build && npm run start`), headless Chrome, simulated throttling. Values are the **median of
4 mobile and 3 desktop runs**, since single runs vary by 50 ms on paint metrics and by more than 2x on
Total Blocking Time.

| Category         | Mobile | Desktop |
| ---------------- | ------ | ------- |
| Performance      | 90     | 99      |
| Accessibility    | 100    | 100     |
| Best Practices   | 100    | 100     |
| SEO              | 100    | 100     |
| Agentic Browsing | 100    | 100     |

| Metric                         | Mobile | Desktop | Good         |
| ------------------------------ | ------ | ------- | ------------ |
| First Contentful Paint (FCP)   | 2.11 s | 0.49 s  | under 1.8 s  |
| Speed Index                    | 2.11 s | 0.49 s  | n/a          |
| Largest Contentful Paint (LCP) | 3.29 s | 0.85 s  | under 2.5 s  |
| Total Blocking Time (TBT)      | 98 ms  | 0 ms    | under 200 ms |
| Cumulative Layout Shift (CLS)  | 0.000  | 0.000   | under 0.1    |

Notes on what these numbers do and do not say:

- **TTFB and INP are field metrics and are not in this table.** A local `vite preview` server says
  nothing about time to first byte on Cloudflare's edge, and INP needs real interactions. Read both
  from [CrUX](https://developer.chrome.com/docs/crux) or the Search Console Core Web Vitals report
  once the site has traffic. TBT above is the lab proxy for responsiveness, not INP itself.
- **CLS is 0.** Every lazily loaded region reserves its space: the screenshot frame is an
  `aspect-ratio` box, the relay map has a sized placeholder, and the release badge has a fixed
  height so the version pill cannot reflow the hero.
- **Mobile LCP is over budget at 3.29 s.** The page is client-rendered, so nothing paints until the
  ~132 KB (gzipped) entry chunk downloads and executes under 4x CPU throttling. Inlining the
  stylesheet removed the one render-blocking request and cut FCP by ~150 ms, but it did not move LCP,
  which confirms the bottleneck is script execution rather than the critical request chain. The fix
  is to prerender the hero and hydrate it, or to defer below-the-fold sections behind sized
  placeholders. Both are real changes and neither is done yet. Desktop LCP is 0.85 s.

## SEO and crawlers

Route metadata lives in one place, [`src/lib/seo.ts`](src/lib/seo.ts). It is read twice:

- at runtime by `useSEO`, which updates the title, description, canonical and social tags on
  client-side navigation;
- at build time by [`plugins/static-html.ts`](plugins/static-html.ts), which writes a real
  `dist/<route>/index.html` per entry with that page's tags baked in, plus `BreadcrumbList`
  structured data, and generates `sitemap.xml`.

The per-route files matter because the site is a SPA behind a `/* /index.html 200` rewrite. Without
them every URL serves the homepage's `<head>`, so any crawler that does not execute JavaScript, which
includes most AI crawlers, sees seven pages all claiming `airhop.1mindlabs.org` as their canonical.
Static files take priority over the rewrite on Cloudflare Pages, so `/faq` resolves to
`dist/faq/index.html`. Note that `vite preview` does not reproduce this and serves the SPA fallback
instead, so verify the emitted files rather than the preview server.

Adding a route means adding it to `SEO` in `src/lib/seo.ts` and to `ROUTES` in `src/App.tsx`.
`public/llms.txt` is maintained by hand and is checked by Lighthouse's `llms-txt` audit, which
requires Markdown links rather than bare URLs.

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
