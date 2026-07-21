# Landing

React landing page for [airhop.1mindlabs.org](https://airhop.1mindlabs.org).

## Tech Stack

| Layer                 | Choice                   |
| --------------------- | ------------------------ |
| Framework             | React 19 + Vite          |
| Language              | TypeScript               |
| Styling               | Tailwind CSS v4          |
| Animation             | Motion                   |
| Map                   | d3-geo + topojson-client |
| Icons                 | Lucide                   |
| Routing               | React Router v7          |
| Dependency Management | npm                      |
| Deployment            | Cloudflare Pages         |

## Performance Metrics

Measured with [Lighthouse](https://developer.chrome.com/docs/lighthouse) (mobile, simulated throttling) against a production build (`npm run build && npm run start`).

| Metric                                 | Current |
| -------------------------------------- | ------- |
| Performance Score                      | 92      |
| Largest Contentful Paint (LCP)         | 2.76 s  |
| First Contentful Paint (FCP)           | 2.71 s  |
| Cumulative Layout Shift (CLS)          | 0.005   |
| Total Blocking Time (TBT)              | 56 ms   |
| Accessibility Score                    | 100     |
| Search Engine Optimization (SEO) Score | 100     |
| Best Practices Score                   | 100     |

## Getting Started

### Prerequisites

- Node.js 22+
- npm 12+

### Installation

```bash
git clone https://github.com/areebahmeddd/Airhop
cd Airhop/landing
npm install
```

### Running Locally

```bash
npm run dev
```

Available at `http://localhost:5173`
