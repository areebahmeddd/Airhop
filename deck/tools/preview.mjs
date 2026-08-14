// Renders the built .pptx back to PNG, by reading the file rather than the code
// that wrote it. A layout bug that only exists in the output shows up here.
//
//   node deck/tools/preview.mjs                 out/preview/slide-01.png ...
//   node deck/tools/preview.mjs --only=7        one slide
//   node deck/tools/preview.mjs --contact       a single contact sheet
//
// This is an approximation: the browser is not PowerPoint and wraps text on its
// own metrics. It is accurate about geometry, order, colour and overflow, which
// is what a layout pass needs. Needs Chrome or Edge, same as press.

import { execFile } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const require = createRequire(import.meta.url);
const JSZip = require("jszip");
const execFileAsync = promisify(execFile);

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BUILD = join(ROOT, ".build", "preview");
const OUT = join(ROOT, "out", "preview");
const PPTX = join(ROOT, "out", "airhop-deck.pptx");

const EMU = 914400;
const DPI = 96;
const W = 1280;
const H = 720;

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

function findChrome() {
  if (process.env.CHROME_PATH !== undefined) return process.env.CHROME_PATH;
  const hit = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (hit === undefined)
    throw new Error("No Chrome or Edge found. Set CHROME_PATH and re-run.");
  return hit;
}

const px = (emu) => (Number(emu) / EMU) * DPI;
const pt = (hundredths) => (Number(hundredths) / 100) * (DPI / 72);
const esc = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");
const html = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function attr(xml, name) {
  const m = xml.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : null;
}

// Splits a slide's spTree into its top-level <p:sp> and <p:pic> blocks. Depth
// counting rather than a regex, so a nested tag cannot end a block early.
function blocks(xml) {
  const out = [];
  const re = /<p:(sp|pic)>/g;
  let m;
  while ((m = re.exec(xml))) {
    const tag = m[1];
    const open = new RegExp(`<p:${tag}>`, "g");
    const close = new RegExp(`</p:${tag}>`, "g");
    let depth = 0;
    let i = m.index;
    let end = -1;
    while (i < xml.length) {
      open.lastIndex = i;
      close.lastIndex = i;
      const o = open.exec(xml);
      const c = close.exec(xml);
      if (!c) break;
      if (o && o.index < c.index) {
        depth += 1;
        i = o.index + o[0].length;
      } else {
        depth -= 1;
        i = c.index + c[0].length;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end < 0) break;
    out.push({ tag, xml: xml.slice(m.index, end) });
    re.lastIndex = end;
  }
  return out;
}

function geometry(block) {
  const off = block.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
  const ext = block.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
  if (!off || !ext) return null;
  return {
    x: px(off[1]),
    y: px(off[2]),
    w: px(ext[1]),
    h: px(ext[2]),
    prst: attr(block.match(/<a:prstGeom[^>]*>/)?.[0] ?? "", "prst"),
  };
}

function fillOf(block) {
  const spPr = block.slice(
    block.indexOf("<p:spPr>"),
    block.indexOf("</p:spPr>"),
  );
  const beforeLn = spPr.split("<a:ln")[0];
  const m = beforeLn.match(/<a:solidFill>\s*<a:srgbClr val="([0-9A-Fa-f]{6})"/);
  return m ? `#${m[1]}` : null;
}

function strokeOf(block) {
  const ln = block.match(/<a:ln[^>]*>[\s\S]*?<\/a:ln>/);
  if (!ln) return null;
  const color = ln[0].match(/<a:srgbClr val="([0-9A-Fa-f]{6})"/);
  const w = attr(ln[0].match(/<a:ln[^>]*>/)[0], "w");
  const dash = attr(ln[0].match(/<a:prstDash[^>]*>/)?.[0] ?? "", "val");
  if (!color) return null;
  return { color: `#${color[1]}`, w: w ? Math.max(1, px(w)) : 1, dash };
}

function paragraphs(block) {
  const body = block.slice(
    block.indexOf("<p:txBody>"),
    block.indexOf("</p:txBody>"),
  );
  if (!body) return { anchor: "t", paras: [] };
  const anchor =
    attr(body.match(/<a:bodyPr[^>]*>/)?.[0] ?? "", "anchor") ?? "t";
  const paras = [];
  for (const p of body.match(/<a:p>[\s\S]*?<\/a:p>/g) ?? []) {
    const algn = attr(p.match(/<a:pPr[^>]*>/)?.[0] ?? "", "algn") ?? "l";
    const lnSpc = p.match(/<a:lnSpc>\s*<a:spcPct val="(\d+)"\/>/);
    const runs = [];
    for (const r of p.match(/<a:r>[\s\S]*?<\/a:r>/g) ?? []) {
      const rPr = r.match(/<a:rPr[^>]*>/)?.[0] ?? "";
      const t = r.match(/<a:t>([\s\S]*?)<\/a:t>/);
      runs.push({
        text: t ? esc(t[1]) : "",
        size: pt(attr(rPr, "sz") ?? 1800),
        bold: attr(rPr, "b") === "1",
        spc: pt(attr(rPr, "spc") ?? 0),
        color: `#${r.match(/<a:srgbClr val="([0-9A-Fa-f]{6})"/)?.[1] ?? "000000"}`,
        face: r.match(/<a:latin typeface="([^"]*)"/)?.[1] ?? "Segoe UI",
        br: r.includes("<a:br/>"),
      });
    }
    paras.push({ algn, runs, line: lnSpc ? Number(lnSpc[1]) / 100000 : 1.2 });
  }
  return { anchor, paras };
}

function renderShape(block, media) {
  const g = geometry(block);
  if (!g) return "";

  const style = [
    "position:absolute",
    `left:${g.x.toFixed(2)}px`,
    `top:${g.y.toFixed(2)}px`,
    `width:${g.w.toFixed(2)}px`,
    `height:${g.h.toFixed(2)}px`,
  ];

  if (block.startsWith("<p:pic>")) {
    const embed = block.match(/r:embed="([^"]+)"/)?.[1];
    const file = embed ? media[embed] : null;
    return `<img src="${file ?? ""}" style="${style.join(";")};object-fit:contain">`;
  }

  const fill = fillOf(block);
  const stroke = strokeOf(block);
  if (fill) style.push(`background:${fill}`);
  if (g.prst === "ellipse") style.push("border-radius:50%");
  if (g.prst === "roundRect") {
    // PowerPoint's adj is 100000ths of the shorter side.
    const adj =
      Number(
        block.match(/<a:gd name="adj" fmla="val (\d+)"\/>/)?.[1] ?? 16667,
      ) / 100000;
    style.push(`border-radius:${(Math.min(g.w, g.h) * adj).toFixed(2)}px`);
  }

  if (g.prst === "line" || g.h < 1.5) {
    const s = stroke ?? { color: "#000", w: 1 };
    if (g.h < 1.5) {
      style.push(
        `border-top:${s.w}px ${s.dash && s.dash !== "solid" ? "dotted" : "solid"} ${s.color}`,
      );
      style.push("height:0");
    } else {
      style.push(`border-left:${s.w}px solid ${s.color}`, "width:0");
    }
  } else if (stroke) {
    style.push(
      `box-sizing:border-box;border:${stroke.w}px solid ${stroke.color}`,
    );
  }

  const { anchor, paras } = paragraphs(block);
  const hasText = paras.some((p) => p.runs.some((r) => r.text));
  if (!hasText) return `<div style="${style.join(";")}"></div>`;

  style.push("display:flex;flex-direction:column;overflow:visible");
  style.push(
    `justify-content:${anchor === "ctr" ? "center" : anchor === "b" ? "flex-end" : "flex-start"}`,
  );

  const inner = paras
    .map((p) => {
      const align =
        p.algn === "ctr" ? "center" : p.algn === "r" ? "right" : "left";
      const runs = p.runs
        .map(
          (r) =>
            `<span style="font-size:${r.size.toFixed(2)}px;font-weight:${r.bold ? 700 : 400};` +
            `letter-spacing:${r.spc.toFixed(2)}px;color:${r.color};font-family:'${r.face}',sans-serif">` +
            `${html(r.text)}</span>${r.br ? "<br>" : ""}`,
        )
        .join("");
      return `<div style="text-align:${align};line-height:${p.line}">${runs}</div>`;
    })
    .join("");

  return `<div style="${style.join(";")}">${inner}</div>`;
}

async function main() {
  const args = process.argv.slice(2);
  const only = args.find((a) => a.startsWith("--only="))?.split("=")[1];
  const contact = args.includes("--contact");

  const chrome = findChrome();
  const zip = await JSZip.loadAsync(readFileSync(PPTX));

  rmSync(BUILD, { recursive: true, force: true });
  mkdirSync(BUILD, { recursive: true });
  mkdirSync(join(BUILD, "media"), { recursive: true });
  mkdirSync(OUT, { recursive: true });

  const names = Object.keys(zip.files)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/(\d+)/)[1]) - Number(b.match(/(\d+)/)[1]));

  const mediaFiles = Object.keys(zip.files).filter(
    (f) => f.startsWith("ppt/media/") && !zip.files[f].dir,
  );
  for (const n of mediaFiles) {
    writeFileSync(
      join(BUILD, "media", n.split("/").pop()),
      await zip.file(n).async("nodebuffer"),
    );
  }

  const pages = [];
  for (const [i, name] of names.entries()) {
    const num = i + 1;
    if (only && Number(only) !== num) continue;

    const xml = await zip.file(name).async("string");
    const relsPath = name.replace("slides/", "slides/_rels/") + ".rels";
    const media = {};
    if (zip.file(relsPath)) {
      const rels = await zip.file(relsPath).async("string");
      for (const m of rels.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)) {
        if (m[2].includes("media/")) {
          media[m[1]] = `media/${m[2].split("/").pop()}`;
        }
      }
    }

    const shapes = blocks(xml.slice(xml.indexOf("<p:spTree>")))
      .map((b) => renderShape(b.xml, media))
      .join("\n");

    const page = `<!doctype html><html><head><meta charset="utf-8">
<style>*{margin:0;padding:0;box-sizing:content-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#fff}
.slide{position:relative;width:${W}px;height:${H}px;background:#FFFFFF;
  font-family:'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}</style></head>
<body><div class="slide">${shapes}</div></body></html>`;

    const file = join(BUILD, `slide-${String(num).padStart(2, "0")}.html`);
    writeFileSync(file, page);
    pages.push({ num, file });
  }

  for (const { num, file } of pages) {
    const out = join(OUT, `slide-${String(num).padStart(2, "0")}.png`);
    await execFileAsync(
      chrome,
      [
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        `--window-size=${W},${H}`,
        `--screenshot=${out}`,
        `--user-data-dir=${join(BUILD, ".chrome-profile")}`,
        `file://${file.replace(/\\/g, "/")}`,
      ],
      { maxBuffer: 1 << 26 },
    );
    console.log(`  slide-${String(num).padStart(2, "0")}.png`);
  }

  if (contact) {
    const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0}body{background:#E8E8EC;display:grid;grid-template-columns:repeat(4,320px);
gap:12px;padding:12px;width:${4 * 320 + 5 * 12}px}
img{width:320px;height:180px;display:block;background:#fff;outline:1px solid #CDCED6}</style></head><body>
${pages.map(({ num }) => `<img src="../../out/preview/slide-${String(num).padStart(2, "0")}.png">`).join("")}
</body></html>`;
    const file = join(BUILD, "contact.html");
    writeFileSync(file, sheet);
    const rows = Math.ceil(pages.length / 4);
    await execFileAsync(chrome, [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      `--window-size=${4 * 320 + 5 * 12},${rows * 192 + 12}`,
      `--screenshot=${join(OUT, "contact.png")}`,
      `--user-data-dir=${join(BUILD, ".chrome-profile")}`,
      `file://${file.replace(/\\/g, "/")}`,
    ]);
    console.log("  contact.png");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
