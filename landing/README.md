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

## SEO and crawlers

Route metadata is defined in `src/lib/seo.ts` and used in two places:

- `useSEO` updates the title, description, canonical URL, and social tags during client-side navigation.
- `plugins/static-html.ts` generates a static `dist/<route>/index.html` for each route with the correct metadata, `BreadcrumbList` structured data, and generates `sitemap.xml`.

The static route files are required because the site is a SPA using a `/* /index.html 200` rewrite. Without them, every route would serve the homepage's `<head>`, causing crawlers that do not execute JavaScript to see the same canonical URL for every page.

When adding a route:

1. Add its metadata to `SEO` in `src/lib/seo.ts`.
2. Add the route to `ROUTES` in `src/App.tsx`.
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
