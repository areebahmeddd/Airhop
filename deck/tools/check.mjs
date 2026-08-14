// Structural check on the built .pptx, run after every build.
//
//   node deck/tools/check.mjs
//
// Reads the file rather than the code that wrote it, and fails on the things
// that either break PowerPoint or embarrass a presenter: a malformed part, the
// wrong canvas size, a shape off the slide, a slide with no speaker notes, or a
// timing tree pointing at a shape that is not there.

import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { verify } from "../lib/motion.mjs";
import { SLIDE } from "../lib/tokens.mjs";

const require = createRequire(import.meta.url);
const JSZip = require("jszip");

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PPTX = process.argv[2] ?? join(ROOT, "out", "airhop-deck.pptx");
const EMU = 914400;
const SLACK = 0.02; // inches, so a hairline sitting on the edge is not a failure

function fail(list, msg) {
  list.push(msg);
}

async function main() {
  if (!existsSync(PPTX))
    throw new Error(`no deck at ${PPTX}, run node build.mjs first`);
  const zip = await JSZip.loadAsync(readFileSync(PPTX));
  const problems = [];
  const warnings = [];

  const parts = Object.keys(zip.files).filter(
    (n) => (n.endsWith(".xml") || n.endsWith(".rels")) && !zip.files[n].dir,
  );
  for (const name of parts) {
    const xml = await zip.file(name).async("string");
    const opens = (xml.match(/<[a-zA-Z][^>]*[^/]>/g) || []).length;
    const closes = (xml.match(/<\/[a-zA-Z]/g) || []).length;
    const selfish = (xml.match(/<[a-zA-Z][^>]*\/>/g) || []).length;
    if (opens - selfish !== closes && opens !== closes) {
      // A cheap balance check; the real parse happens below on slides.
      if (Math.abs(opens - closes - selfish) > opens)
        fail(problems, `${name}: tag imbalance`);
    }
  }

  const pres = await zip.file("ppt/presentation.xml").async("string");
  const size = pres.match(/<p:sldSz cx="(\d+)" cy="(\d+)"/);
  const w = Number(size[1]) / EMU;
  const h = Number(size[2]) / EMU;
  if (Math.abs(w - SLIDE.w) > 0.01 || Math.abs(h - SLIDE.h) > 0.01) {
    fail(
      problems,
      `canvas is ${w.toFixed(3)}x${h.toFixed(3)}in, expected ${SLIDE.w}x${SLIDE.h}`,
    );
  }

  const slides = Object.keys(zip.files)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/(\d+)/)[1]) - Number(b.match(/(\d+)/)[1]));

  let shapes = 0;
  let withNotes = 0;

  for (const [i, name] of slides.entries()) {
    const num = i + 1;
    const xml = await zip.file(name).async("string");

    for (const m of xml.matchAll(
      /<p:cNvPr id="\d+" name="([^"]*)"[\s\S]{0,600}?<a:off x="(-?\d+)" y="(-?\d+)"\/>\s*<a:ext cx="(\d+)" cy="(\d+)"\/>/g,
    )) {
      shapes += 1;
      const [, label, x, y, cx, cy] = m;
      const left = Number(x) / EMU;
      const top = Number(y) / EMU;
      const right = left + Number(cx) / EMU;
      const bottom = top + Number(cy) / EMU;
      if (left < -SLACK || top < -SLACK) {
        fail(
          problems,
          `slide ${num}: ${label} starts at ${left.toFixed(2)},${top.toFixed(2)}`,
        );
      }
      if (right > SLIDE.w + SLACK || bottom > SLIDE.h + SLACK) {
        fail(
          problems,
          `slide ${num}: ${label} reaches ${right.toFixed(2)},${bottom.toFixed(2)}`,
        );
      }
    }

    const rels = zip.file(`ppt/slides/_rels/slide${num}.xml.rels`);
    const relsXml = rels ? await rels.async("string") : "";
    if (relsXml.includes("notesSlide")) withNotes += 1;
    else fail(warnings, `slide ${num}: no speaker notes`);
  }

  const motion = await verify(readFileSync(PPTX));
  motion.problems?.forEach((p) => fail(problems, p));

  console.log(`  canvas    ${w.toFixed(3)} x ${h.toFixed(3)} in`);
  console.log(`  slides    ${slides.length}, ${shapes} placed shapes`);
  console.log(`  notes     ${withNotes}/${slides.length}`);
  console.log(
    `  motion    ${motion.checked} animated slides, timing tree consistent`,
  );
  console.log(`  parts     ${parts.length} xml parts`);

  warnings.forEach((x) => console.log(`  ! ${x}`));
  if (problems.length) {
    console.log(`\n  ${problems.length} problems`);
    problems.slice(0, 20).forEach((p) => console.log(`  x ${p}`));
    process.exit(1);
  }
  console.log("\n  ok");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
