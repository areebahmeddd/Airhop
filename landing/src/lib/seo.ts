import { SITE_URL } from "./links.ts";

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  type: "website" | "article";
  breadcrumb?: string;
  lastmod: string;
}

export const SEO: Record<string, PageSeo> = {
  "/": {
    path: "/",
    title: "Airhop - Private, offline-first messenger",
    description:
      "Private peer-to-peer messaging for iOS and Android. No internet, no servers, no accounts. Communicate over Bluetooth mesh anywhere.",
    type: "website",
    lastmod: "2026-08-01",
  },
  "/architecture": {
    path: "/architecture",
    title: "Architecture - Airhop",
    description:
      "How Airhop works, top to bottom: identity, transport selection, the Bluetooth mesh, encryption, the internet layer, Tor, offline ecash, on-device AI, and the bitchat-compatible wire format.",
    type: "article",
    breadcrumb: "Architecture",
    lastmod: "2026-08-01",
  },
  "/faq": {
    path: "/faq",
    title: "Frequently Asked Questions - Airhop",
    description:
      "Answers about Airhop's Bluetooth mesh messaging, encryption, offline payments, the Nostr internet layer, and bitchat compatibility.",
    type: "website",
    breadcrumb: "FAQ",
    lastmod: "2026-08-01",
  },
  "/blogs": {
    path: "/blogs",
    title: "Blog - Airhop",
    description: "Writing on mesh networking, privacy, and offline-first software.",
    type: "website",
    breadcrumb: "Blog",
    lastmod: "2026-08-01",
  },
  "/brand": {
    path: "/brand",
    title: "Brand Kit - Airhop",
    description:
      "The Airhop brand kit: the pixel bird mark, the wordmark, colour and type tokens, press assets and boilerplate.",
    type: "website",
    breadcrumb: "Brand Kit",
    lastmod: "2026-08-01",
  },
  "/privacy-policy": {
    path: "/privacy-policy",
    title: "Privacy Policy - Airhop",
    description:
      "How Airhop handles data: no accounts, no servers, no tracking. Your identity and messages stay on your device.",
    type: "website",
    breadcrumb: "Privacy Policy",
    lastmod: "2026-08-01",
  },
  "/terms-of-service": {
    path: "/terms-of-service",
    title: "Terms of Service - Airhop",
    description: "Terms governing use of the Airhop app and website.",
    type: "website",
    breadcrumb: "Terms of Service",
    lastmod: "2026-08-01",
  },
};

export const PAGES: PageSeo[] = Object.values(SEO);

export function breadcrumbSchema(page: PageSeo) {
  if (!page.breadcrumb) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: page.breadcrumb, item: `${SITE_URL}${page.path}` },
    ],
  };
}
