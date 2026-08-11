import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import { t } from "../src/i18n/index.ts";
import { SITE_URL } from "../src/lib/links.ts";
import { breadcrumbSchema, PAGES, type PageSeo } from "../src/lib/seo.ts";

const BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function headBlock(page: PageSeo): string {
  const url = page.path === "/" ? SITE_URL : `${SITE_URL}${page.path}`;
  const title = escapeAttr(t(page.titleKey));
  const description = escapeAttr(t(page.descriptionKey));
  const crumbs = breadcrumbSchema(page);

  const lines = [
    "<!-- seo:start -->",
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.type}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ];

  if (crumbs) {
    lines.push(
      `<script type="application/ld+json">${JSON.stringify(crumbs).replace(/</g, "\\u003c")}</script>`,
    );
  }

  lines.push("<!-- seo:end -->");
  return lines.map((line, i) => (i === 0 ? line : `    ${line}`)).join("\n");
}

function sitemap(pages: PageSeo[]): string {
  const entries = pages
    .map((page) => {
      const url = page.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${page.path}`;
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

const STYLESHEET = /<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/;

async function inlineStylesheet(root: string, shell: string): Promise<string> {
  const match = STYLESHEET.exec(shell);
  if (!match) return shell;

  const css = await readFile(path.join(root, match[1].replace(/^\//, "")), "utf8");
  return shell.replace(match[0], `<style>${css}</style>`);
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

      const shell = await inlineStylesheet(root, built);

      for (const page of PAGES) {
        const html = shell.replace(BLOCK, headBlock(page));
        if (page.path === "/") {
          await writeFile(path.join(root, "index.html"), html, "utf8");
          continue;
        }
        const dir = path.join(root, page.path);
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, "index.html"), html, "utf8");
      }

      await writeFile(path.join(root, "sitemap.xml"), sitemap(PAGES), "utf8");
    },
  };
}
