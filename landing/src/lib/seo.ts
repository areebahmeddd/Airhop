import {
  getT,
  LANGUAGE_ORDER,
  LANGUAGES,
  localizedPath,
  type LanguageCode,
} from "../i18n/index.ts";
import type { TranslationKey } from "../i18n/locales/types.ts";
import { SITE_URL } from "./links.ts";

export const LAST_UPDATED = "2026-08-01";

export interface PageSeo {
  path: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  type: "website" | "article";
  breadcrumbKey?: TranslationKey;
  lastmod: string;
  noIndex?: boolean;
}

export const SEO: Record<string, PageSeo> = {
  "/": {
    path: "/",
    titleKey: "seo.home.title",
    descriptionKey: "seo.home.description",
    type: "website",
    lastmod: LAST_UPDATED,
  },
  "/architecture": {
    path: "/architecture",
    titleKey: "seo.architecture.title",
    descriptionKey: "seo.architecture.description",
    type: "article",
    breadcrumbKey: "seo.architecture.breadcrumb",
    lastmod: LAST_UPDATED,
  },
  "/faq": {
    path: "/faq",
    titleKey: "seo.faq.title",
    descriptionKey: "seo.faq.description",
    type: "website",
    breadcrumbKey: "seo.faq.breadcrumb",
    lastmod: LAST_UPDATED,
  },
  "/blogs": {
    path: "/blogs",
    titleKey: "seo.blogs.title",
    descriptionKey: "seo.blogs.description",
    type: "website",
    breadcrumbKey: "seo.blogs.breadcrumb",
    lastmod: LAST_UPDATED,
  },
  "/brand": {
    path: "/brand",
    titleKey: "seo.brand.title",
    descriptionKey: "seo.brand.description",
    type: "website",
    breadcrumbKey: "seo.brand.breadcrumb",
    lastmod: LAST_UPDATED,
  },
  "/privacy-policy": {
    path: "/privacy-policy",
    titleKey: "seo.privacy.title",
    descriptionKey: "seo.privacy.description",
    type: "website",
    breadcrumbKey: "seo.privacy.breadcrumb",
    lastmod: LAST_UPDATED,
  },
  "/terms-of-service": {
    path: "/terms-of-service",
    titleKey: "seo.terms.title",
    descriptionKey: "seo.terms.description",
    type: "website",
    breadcrumbKey: "seo.terms.breadcrumb",
    lastmod: LAST_UPDATED,
  },
};

export const NOT_FOUND_SEO: PageSeo = {
  path: "/404",
  titleKey: "seo.notfound.title",
  descriptionKey: "seo.notfound.description",
  type: "website",
  lastmod: LAST_UPDATED,
  noIndex: true,
};

export const PAGES: PageSeo[] = Object.values(SEO);

export function canonicalUrl(language: LanguageCode, path: string): string {
  const localized = localizedPath(language, path);
  return localized === "/" ? SITE_URL : `${SITE_URL}${localized}`;
}

export interface Alternate {
  hrefLang: string;
  href: string;
}

export function alternates(path: string): Alternate[] {
  const links = LANGUAGE_ORDER.map((code) => ({
    hrefLang: LANGUAGES[code].code,
    href: canonicalUrl(code, path),
  }));
  return [...links, { hrefLang: "x-default", href: canonicalUrl("en", path) }];
}

export function breadcrumbSchema(page: PageSeo, language: LanguageCode) {
  if (!page.breadcrumbKey) return null;
  const T = getT(language);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: T("seo.breadcrumb.home"),
        item: canonicalUrl(language, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: T(page.breadcrumbKey),
        item: canonicalUrl(language, page.path),
      },
    ],
  };
}
