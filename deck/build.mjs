// Builds the pitch deck. See README.md.
//
//   node deck/build.mjs                  out/airhop-deck.pptx
//   node deck/build.mjs --core           the ten slides, no appendix
//   node deck/build.mjs --anim           add fade transitions and entrance builds
//   node deck/build.mjs --out=path.pptx  somewhere else
//   DECK_MONO="JetBrains Mono" node deck/build.mjs
//
// Device screens come from tools/render-screens.mjs and are optional: without
// them the product slide draws placeholders and everything else is unchanged.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import PptxGenJS from "pptxgenjs";

import { META } from "./lib/content.mjs";
import { footer } from "./lib/draw.mjs";
import { animate, repack, verify } from "./lib/motion.mjs";
import { DECK } from "./lib/slides.mjs";
import { C, SLIDE } from "./lib/tokens.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const SCREEN_DIR = join(ROOT, "assets", "screens");
const SCREEN_FILES = ["radar", "thread", "wallet"];

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

function screens() {
  const files = {};
  for (const id of SCREEN_FILES) {
    const path = join(SCREEN_DIR, `${id}.png`);
    if (existsSync(path)) files[id] = path;
  }
  // Width over height of what tools/render-screens.mjs writes.
  return { files, ratio: 0.489 };
}

async function main() {
  const out = resolve(ROOT, value("out", join("out", "airhop-deck.pptx")));
  // Off by default: a deck that animates is a deck that fights the presenter.
  const withMotion = flag("anim");
  const coreOnly = flag("core");
  const assets = screens();

  const pptx = new PptxGenJS();
  // LAYOUT_16x9 is 10 x 5.625in. The deck is drawn at 13.333 x 7.5, which is
  // LAYOUT_WIDE, so declare the canvas rather than inheriting a smaller one.
  pptx.defineLayout({ name: "AIRHOP_WIDE", width: SLIDE.w, height: SLIDE.h });
  pptx.layout = "AIRHOP_WIDE";
  pptx.title = "Airhop";
  pptx.subject = "Private, offline-first messaging over Bluetooth mesh";
  pptx.company = "Airhop";
  pptx.author = "Areeb Ahmed";

  pptx.defineSlideMaster({
    title: "AIRHOP",
    background: { color: C.canvas },
  });

  // The appendix is numbered A1 to A3 rather than continuing the main count, so
  // the deck reads as ten slides with reference material behind it.
  const deck = coreOnly ? DECK.filter((entry) => !entry.appendix) : DECK;
  const core = deck.filter((entry) => !entry.appendix);
  const extra = deck.filter((entry) => entry.appendix);
  let n = 0;
  let a = 0;

  deck.forEach((entry) => {
    const slide = pptx.addSlide({ masterName: "AIRHOP" });
    entry.draw(slide, { screens: assets });
    if (entry.appendix) {
      a += 1;
      footer(slide, { index: a, total: extra.length, appendix: true });
    } else {
      n += 1;
      if (!entry.bare) footer(slide, { index: n, total: core.length });
    }
  });

  let buffer = await pptx.write({ outputType: "nodebuffer" });
  let applied = 0;

  if (withMotion) {
    const result = await animate(buffer);
    buffer = result.buffer;
    applied = result.applied;
    if (result.skipped) console.warn(`  ! ${result.skipped}`);

    const check = await verify(buffer);
    if (!check.ok) {
      console.error("  x motion self-check failed, writing without it");
      check.problems.slice(0, 8).forEach((p) => console.error(`    ${p}`));
      buffer = await pptx.write({ outputType: "nodebuffer" });
      applied = 0;
    }
  } else {
    buffer = await repack(buffer);
  }

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, buffer);

  const missing = SCREEN_FILES.filter((id) => !assets.files[id]);
  console.log(
    `  ${core.length} slides${extra.length ? ` + ${extra.length} appendix` : ""}   ${META.version} ${META.codename}`,
  );
  console.log(`  ${applied ? `motion on ${applied} slides` : "no motion"}`);
  if (missing.length) {
    console.log(
      `  device screens missing (${missing.join(", ")}): run npm run screens`,
    );
  }
  console.log(`  ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
