import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import {
  getT,
  LANGUAGE_ORDER,
  LANGUAGES,
  loadCatalog,
  localizedPath,
  type LanguageCode,
} from "../src/i18n/index.ts";
import {
  alternates,
  breadcrumbSchema,
  canonicalUrl,
  NOT_FOUND_SEO,
  PAGES,
  type PageSeo,
} from "../src/lib/seo.ts";

const BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

const ROOT_TAG = /<html[^>]*>/;

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rootTag(language: LanguageCode): string {
  const spec = LANGUAGES[language];
  return `<html lang="${spec.code}" dir="${spec.direction}" data-script="${spec.script}">`;
}

function headBlock(page: PageSeo, language: LanguageCode): string {
  const T = getT(language);
  const spec = LANGUAGES[language];
  const url = canonicalUrl(language, page.path);
  const title = escapeAttr(T(page.titleKey));
  const description = escapeAttr(T(page.descriptionKey));
  const crumbs = breadcrumbSchema(page, language);

  const lines = [
    "<!-- seo:start -->",
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    page.noIndex
      ? `<meta name="robots" content="noindex, nofollow" />`
      : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.type}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${spec.ogLocale}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ];

  for (const code of LANGUAGE_ORDER) {
    if (code === language) continue;
    lines.push(`<meta property="og:locale:alternate" content="${LANGUAGES[code].ogLocale}" />`);
  }

  if (!page.noIndex) {
    for (const link of alternates(page.path)) {
      lines.push(
        `<link rel="alternate" hreflang="${link.hrefLang}" href="${escapeAttr(link.href)}" />`,
      );
    }
  }

  if (crumbs) {
    lines.push(
      `<script type="application/ld+json">${JSON.stringify(crumbs).replace(/</g, "\\u003c")}</script>`,
    );
  }

  lines.push("<!-- seo:end -->");
  return lines.map((line, i) => (i === 0 ? line : `    ${line}`)).join("\n");
}

function sitemap(pages: PageSeo[]): string {
  const entries = pages.flatMap((page) =>
    LANGUAGE_ORDER.map((language) => {
      const loc = canonicalUrl(language, page.path);
      const links = alternates(page.path)
        .map(
          (link) =>
            `    <xhtml:link rel="alternate" hreflang="${link.hrefLang}" href="${escapeAttr(link.href)}" />`,
        )
        .join("\n");
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n${links}\n  </url>`;
    }),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`;
}

const HEAD_END = "</head>";

const MANIFEST = path.join(".vite", "manifest.json");

async function catalogPreloads(root: string): Promise<Map<LanguageCode, string>> {
  const file = path.join(root, MANIFEST);
  const manifest = JSON.parse(await readFile(file, "utf8")) as Record<string, { file: string }>;
  const preloads = new Map<LanguageCode, string>();

  for (const language of LANGUAGE_ORDER) {
    const entry = manifest[`src/i18n/locales/${language}.ts`];
    if (entry) preloads.set(language, `/${entry.file}`);
  }

  await rm(path.join(root, ".vite"), { recursive: true, force: true });
  return preloads;
}

const STYLESHEET = /<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/;

const BOOT_SCRIPT = /<script src="(\/[^"]+\.js)"><\/script>/;

const CSP_SCRIPT_SRC = "script-src 'self'";

async function inlineStylesheet(root: string, shell: string): Promise<string> {
  const match = STYLESHEET.exec(shell);
  if (!match) return shell;

  const css = await readFile(path.join(root, match[1].replace(/^\//, "")), "utf8");
  return shell.replace(match[0], `<style>${css}</style>`);
}

async function inlineBootScript(
  root: string,
  shell: string,
): Promise<{ shell: string; hash: string | null }> {
  const match = BOOT_SCRIPT.exec(shell);
  if (!match) return { shell, hash: null };

  const js = await readFile(path.join(root, match[1].replace(/^\//, "")), "utf8");
  const hash = createHash("sha256").update(js, "utf8").digest("base64");
  return { shell: shell.replace(match[0], `<script>${js}</script>`), hash: `sha256-${hash}` };
}

async function allowInlineBoot(root: string, hash: string) {
  const file = path.join(root, "_headers");
  const headers = await readFile(file, "utf8");
  if (!headers.includes(CSP_SCRIPT_SRC)) {
    throw new Error(`static-html: _headers has no "${CSP_SCRIPT_SRC}" to extend`);
  }
  await writeFile(file, headers.replace(CSP_SCRIPT_SRC, `${CSP_SCRIPT_SRC} '${hash}'`), "utf8");
}

export function staticHtml(): Plugin {
  let outDir = "dist";

  return {
    name: "airhop-static-html",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      const root = path.resolve(outDir);
      const built = await readFile(path.join(root, "index.html"), "utf8");

      if (!BLOCK.test(built)) {
        this.error("static-html: index.html is missing the <!-- seo:start --> block");
      }

      if (!ROOT_TAG.test(built)) {
        this.error("static-html: index.html is missing an <html> tag to localize");
      }

      await Promise.all(LANGUAGE_ORDER.map((code) => loadCatalog(code)));

      const preloads = await catalogPreloads(root);
      const withStyles = await inlineStylesheet(root, built);
      const { shell, hash } = await inlineBootScript(root, withStyles);

      if (hash) await allowInlineBoot(root, hash);

      for (const language of LANGUAGE_ORDER) {
        const preload = preloads.get(language);
        const localized = preload
          ? shell.replace(
              HEAD_END,
              `  <link rel="modulepreload" crossorigin href="${preload}" />\n  ${HEAD_END}`,
            )
          : shell;

        for (const page of PAGES) {
          const html = localized
            .replace(ROOT_TAG, rootTag(language))
            .replace(BLOCK, headBlock(page, language));
          const route = localizedPath(language, page.path);

          if (route === "/") {
            await writeFile(path.join(root, "index.html"), html, "utf8");
            continue;
          }

          const dir = path.join(root, route);
          await mkdir(dir, { recursive: true });
          await writeFile(path.join(dir, "index.html"), html, "utf8");
        }

        const notFound = localized
          .replace(ROOT_TAG, rootTag(language))
          .replace(BLOCK, headBlock(NOT_FOUND_SEO, language));
        const base = localizedPath(language, "/");
        const notFoundDir = base === "/" ? root : path.join(root, base);
        await mkdir(notFoundDir, { recursive: true });
        await writeFile(path.join(notFoundDir, "404.html"), notFound, "utf8");
      }

      await writeFile(path.join(root, "sitemap.xml"), sitemap(PAGES), "utf8");
    },
  };
}
