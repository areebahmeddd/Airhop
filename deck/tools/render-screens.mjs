// Renders the device screens the product slide uses, straight from the press
// renderer, so a screen in the deck is the same screen the stores show.
//
//   node deck/tools/render-screens.mjs
//
// Output: deck/assets/screens/{radar,thread,wallet}.png, one phone each on the
// deck's card colour, no headline. Needs Chrome or Edge, same as press.

import { execFile } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import {
  SCREEN_CSS,
  SCREEN_H,
  SCREEN_W,
  SCREENS,
} from "../../press/lib/screens.mjs";
import { cssVars, LIGHT } from "../../press/lib/theme.mjs";

const execFileAsync = promisify(execFile);
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BUILD = join(ROOT, ".build");
const OUT = join(ROOT, "assets", "screens");

const WANTED = [
  { id: "radar", screen: "radar" },
  { id: "thread", screen: "thread" },
  { id: "wallet", screen: "wallet" },
];

const SANS = `'Segoe UI Variable Display','Segoe UI',-apple-system,'Helvetica Neue',Arial,sans-serif`;
const CARD = "#FCFCFD"; // deck/lib/tokens.mjs C.card
const BEZEL = 9;
const PAD = 14;
const FRAME_W = SCREEN_W + BEZEL * 2;
const FRAME_H = SCREEN_H + BEZEL * 2;

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

function page(screenHtml) {
  const w = FRAME_W + PAD * 2;
  const h = FRAME_H + PAD * 2;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="../../press/lib/fonts.css">
<style>
:root{${cssVars(LIGHT)}--sans:${SANS};--mono:'JetBrains Mono',ui-monospace,monospace}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:${CARD};font-family:var(--sans);-webkit-font-smoothing:antialiased}
.phone{position:absolute;left:${PAD}px;top:${PAD}px;width:${FRAME_W}px;height:${FRAME_H}px;
  background:var(--bezel);border-radius:${BEZEL * 4}px;padding:${BEZEL}px;
  box-shadow:0 0 0 1px var(--bezelEdge)}
.phone-clip{width:100%;height:100%;overflow:hidden;border-radius:${BEZEL * 3}px}
${SCREEN_CSS}
</style></head><body>
<div class="phone"><div class="phone-clip">${screenHtml}</div></div>
</body></html>`;
}

async function shoot(chrome, name, html) {
  const src = join(BUILD, `${name}.html`);
  writeFileSync(src, html);
  await execFileAsync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=3",
      `--window-size=${FRAME_W + PAD * 2},${FRAME_H + PAD * 2}`,
      `--screenshot=${join(OUT, `${name}.png`)}`,
      `--user-data-dir=${join(BUILD, ".chrome-profile")}`,
      `file://${src.replace(/\\/g, "/")}`,
    ],
    { maxBuffer: 1 << 26 },
  );
  console.log(`  ${name}.png`);
}

async function main() {
  const chrome = findChrome();
  rmSync(BUILD, { recursive: true, force: true });
  mkdirSync(BUILD, { recursive: true });
  mkdirSync(OUT, { recursive: true });

  for (const { id, screen } of WANTED) {
    await shoot(chrome, id, page(SCREENS[screen]("ios")));
  }

  console.log(
    `  ratio ${(FRAME_W + PAD * 2) / (FRAME_H + PAD * 2)} (deck/build.mjs expects ~0.47)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
