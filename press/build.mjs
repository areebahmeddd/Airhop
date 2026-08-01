// Renders every store, social and press image. See README.md.
//
//   node press/build.mjs                everything, light and dark
//   node press/build.mjs --light        light only
//   node press/build.mjs --only=social  one group (screens|social|icon)
//   node press/build.mjs --fastlane=DIR also write an F-Droid fastlane tree
//
// Each asset is an HTML page screenshot by headless Chrome at 2x. Pages are
// kept in press/.build/ and can be opened in a browser.

import { execFile } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { brandCard, brandIcon } from "./lib/brand.mjs";
import { FEATURE, PANELS } from "./lib/copy.mjs";
import { pixelBird } from "./lib/icons.mjs";
import { SCREEN_CSS, SCREEN_H, SCREEN_W, SCREENS } from "./lib/screens.mjs";
import { cssVars, DARK, LIGHT } from "./lib/theme.mjs";
import {
  GLOBE_SIZE,
  GRATICULE_PATH,
  LAND_PATH,
  RELAY_ARCS,
  RELAY_DOTS_BACK,
  RELAY_DOTS_FRONT,
} from "./lib/world.mjs";

const execFileAsync = promisify(execFile);
const ROOT = dirname(fileURLToPath(import.meta.url));
const BUILD = join(ROOT, ".build");
const OUT = join(ROOT, "out");

const SANS = `'Segoe UI Variable Display','Segoe UI',-apple-system,'Helvetica Neue',Arial,sans-serif`;

// ---------------------------------------------------------------------------
// Canvases
// ---------------------------------------------------------------------------

// One size per platform. Apple scales the 6.9in shot down to every smaller
// iPhone; Play and F-Droid take the same 1080x1920.
const PHONE_TARGETS = [
  { id: "ios", px: [1290, 2796], platform: "ios" },
  { id: "android", px: [1080, 1920], platform: "android" },
];

const SOCIAL_TARGETS = [
  { id: "og-1200x630", px: [1200, 630] },
  { id: "x-header-1500x500", px: [1500, 500] },
  { id: "linkedin-banner-1584x396", px: [1584, 396] },
  { id: "instagram-square-1080x1080", px: [1080, 1080] },
  { id: "instagram-story-1080x1920", px: [1080, 1920] },
  { id: "github-social-1280x640", px: [1280, 640] },
];

const FEATURE_GRAPHIC_PX = [1024, 500];
const ICON_PX = 512;

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

function findChrome() {
  if (process.env.CHROME_PATH !== undefined) return process.env.CHROME_PATH;
  const hit = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (hit === undefined) {
    throw new Error("No Chrome or Edge found. Set CHROME_PATH and re-run.");
  }
  return hit;
}

// ---------------------------------------------------------------------------
// Page composition
// ---------------------------------------------------------------------------

function page({ w, h, tokens, css, body }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="../lib/fonts.css">
<style>
:root{${cssVars(tokens)}--sans:${SANS};--mono:'JetBrains Mono',ui-monospace,monospace}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:var(--panelBg);font-family:var(--sans);-webkit-font-smoothing:antialiased}
${css}
</style></head><body>${body}</body></html>`;
}

function dotGrid(w) {
  const step = Math.max(12, Math.round(w * 0.037));
  return `background-image:radial-gradient(var(--panelDot) 1.5px,transparent 1.5px);
    background-size:${step}px ${step}px;`;
}

// Derived from the canvas so both aspect ratios park the device in the same
// place optically.
function phoneMetrics(w, h) {
  const bezel = Math.round(w * 0.014);
  let frameH = h * 0.715;
  let scale = (frameH - bezel * 2) / SCREEN_H;
  const maxFrameW = w * 0.79;
  if (SCREEN_W * scale + bezel * 2 > maxFrameW) {
    scale = (maxFrameW - bezel * 2) / SCREEN_W;
    frameH = SCREEN_H * scale + bezel * 2;
  }
  return {
    bezel,
    scale,
    frameW: SCREEN_W * scale + bezel * 2,
    frameH,
    bleed: Math.round(h * 0.03),
  };
}

function phoneCss(w, h, m, { rotate, right, top } = {}) {
  const placed =
    right === undefined
      ? `left:50%;transform:translateX(-50%);bottom:${-m.bleed}px`
      : `right:${right}px;top:${top}px;transform:rotate(${rotate}deg)`;
  return `
.phone{position:absolute;${placed};width:${m.frameW}px;height:${m.frameH}px;
  background:var(--bezel);border-radius:${(m.frameW * 0.125).toFixed(1)}px;padding:${m.bezel}px;
  box-shadow:0 ${Math.round(w * 0.02)}px ${Math.round(w * 0.06)}px rgba(0,0,0,0.22),
             0 0 0 1px var(--bezelEdge)}
.phone-clip{width:100%;height:100%;overflow:hidden;
  border-radius:${(m.frameW * 0.125 - m.bezel).toFixed(1)}px}
.phone-scale{transform:scale(${m.scale.toFixed(5)});transform-origin:top left}
${SCREEN_CSS}`;
}

// Headline and subhead, shared by every panel.
function copyCss(w, h) {
  return `
body{${dotGrid(w)}}
.panel{position:relative;width:${w}px;height:${h}px;overflow:hidden}
.copy{padding:${Math.round(h * 0.075)}px ${Math.round(w * 0.085)}px 0;text-align:center;
  display:flex;flex-direction:column;align-items:center}
h1{font-size:${(w * 0.0685).toFixed(1)}px;font-weight:700;
  line-height:1.14;letter-spacing:-0.025em;color:var(--panelText)}
p{margin-top:${Math.round(h * 0.016)}px;max-width:${Math.round(w * 0.8)}px;
  font-size:${(w * 0.0295).toFixed(1)}px;line-height:1.45;color:var(--panelSub)}`;
}

function copyBody(panel) {
  return `<div class="copy">
    <h1>${panel.headline.join("<br>")}</h1>
    <p>${panel.sub}</p>
  </div>`;
}

function screenshotPanel(panel, w, h, platform) {
  const m = phoneMetrics(w, h);
  const css = `${copyCss(w, h)}
${phoneCss(w, h, m)}`;

  const body = `<div class="panel">
  ${copyBody(panel)}
  <div class="phone"><div class="phone-clip"><div class="phone-scale">${SCREENS[panel.screen](platform)}</div></div></div>
</div>`;

  return { css, body };
}

// A globe where the device would be. Geometry comes from lib/world.mjs.
function globePanel(panel, w, h) {
  const r = GLOBE_SIZE / 2;
  // Fits inside both edges with a margin, and capped against the canvas height
  // so the shorter Play ratio does not push the sphere up into the subhead.
  const globeD = Math.min(w * 0.96, h * 0.52);
  const centreY = h * 0.6;
  const dots = (list, cls) =>
    list.map(([x, y, d]) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${d}"/>`).join("");

  const css = `${copyCss(w, h)}
.globe{position:absolute;left:50%;top:${centreY.toFixed(1)}px;
  transform:translate(-50%,-50%);width:${globeD.toFixed(1)}px;height:${globeD.toFixed(1)}px}
.sphere{fill:var(--surface);stroke:var(--panelMuted);stroke-opacity:0.45;stroke-width:1.2}
.grat{fill:none;stroke:var(--panelText);stroke-opacity:0.09;stroke-width:0.7}
.land{fill:var(--panelText);fill-opacity:0.14;stroke:var(--panelText);stroke-opacity:0.22;
  stroke-width:0.6}
.arc{fill:none;stroke:var(--panelText);stroke-opacity:0.3;stroke-width:1;
  stroke-dasharray:3 5;stroke-linecap:round}
.dot{fill:var(--panelText);fill-opacity:0.85}
.dot-back{fill:var(--panelText);fill-opacity:0.14}`;

  const body = `<div class="panel">
  ${copyBody(panel)}
  <svg class="globe" viewBox="0 0 ${GLOBE_SIZE} ${GLOBE_SIZE}">
    <circle class="sphere" cx="${r}" cy="${r}" r="${r - 6}"/>
    <path class="grat" d="${GRATICULE_PATH}"/>
    <path class="land" d="${LAND_PATH}"/>
    ${dots(RELAY_DOTS_BACK, "dot-back")}
    ${RELAY_ARCS.map((d) => `<path class="arc" d="${d}"/>`).join("")}
    ${dots(RELAY_DOTS_FRONT, "dot")}
  </svg>
</div>`;

  return { css, body };
}

function brandPanel(w, h) {
  const card = brandCard(w, h);
  return { css: `body{${dotGrid(w)}}\n${card.css}`, body: card.body };
}

// Alternate feature graphic, carrying a device instead of the centred mark.
function featureGraphicDevice(w, h) {
  const scale = 0.235;
  const bezel = 5;
  const m = {
    bezel,
    scale,
    frameW: SCREEN_W * scale + bezel * 2,
    frameH: SCREEN_H * scale + bezel * 2,
  };
  const css = `
body{${dotGrid(w * 2)}}
.fg{position:relative;width:${w}px;height:${h}px;display:flex;align-items:center;
  padding:0 44px;overflow:hidden}
.fg-left{display:flex;flex-direction:column;gap:12px;max-width:350px}
.fg-mark{display:flex;align-items:center;gap:12px}
.fg-word{font-family:var(--mono);font-size:15px;font-weight:700;letter-spacing:0.34em;
  color:var(--panelText)}
.fg-head{font-size:37px;font-weight:700;letter-spacing:-0.028em;line-height:1.1;
  color:var(--panelText);white-space:nowrap}
.fg-head .dim{color:var(--panelMuted)}
.fg-sub{font-size:14px;line-height:1.4;color:var(--panelSub);max-width:340px;white-space:nowrap}
${phoneCss(w, h, m, { rotate: -7, right: 38, top: 26 })}`;

  const body = `<div class="fg">
  <div class="fg-left">
    <div class="fg-mark">${pixelBird(30, "var(--panelText)")}<span class="fg-word">${FEATURE.wordmark}</span></div>
    <div class="fg-head">${FEATURE.headline}</div>
    <div class="fg-sub">${FEATURE.sub}</div>
  </div>
  <div class="phone"><div class="phone-clip"><div class="phone-scale">${SCREENS[FEATURE.screen]("android")}</div></div></div>
</div>`;

  return { css, body };
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

let shotCount = 0;

async function shoot(chrome, name, html, [pxW, pxH], scale = 2) {
  const htmlPath = join(BUILD, `${name.replace(/[\\/]/g, "-")}.html`);
  writeFileSync(htmlPath, html);
  const outPath = join(OUT, name);
  mkdirSync(dirname(outPath), { recursive: true });
  await execFileAsync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      "--disable-lcd-text",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=3000",
      `--user-data-dir=${join(BUILD, ".chrome-profile")}`,
      `--force-device-scale-factor=${scale}`,
      `--window-size=${pxW / scale},${pxH / scale}`,
      `--screenshot=${outPath}`,
      `file:///${resolve(htmlPath).replace(/\\/g, "/")}`,
    ],
    { maxBuffer: 1024 * 1024 * 32 },
  );
  shotCount += 1;
  console.log(`  ${name}`);
  return outPath;
}

async function renderScreens(chrome, themes) {
  for (const [themeId, tokens] of themes) {
    for (const target of PHONE_TARGETS) {
      const [pxW, pxH] = target.px;
      const w = pxW / 2;
      const h = pxH / 2;
      const dir = `screenshots/${target.id}/${themeId}`;

      const brand = brandPanel(w, h);
      await shoot(chrome, `${dir}/00-brand.png`, page({ w, h, tokens, ...brand }), target.px);

      for (const panel of PANELS) {
        const built =
          panel.kind === "globe"
            ? globePanel(panel, w, h)
            : screenshotPanel(panel, w, h, target.platform);
        await shoot(chrome, `${dir}/${panel.id}.png`, page({ w, h, tokens, ...built }), target.px);
      }
    }
  }
}

async function renderFeatureGraphics(chrome, themes) {
  const [pxW, pxH] = FEATURE_GRAPHIC_PX;
  const w = pxW / 2;
  const h = pxH / 2;
  for (const [themeId, tokens] of themes) {
    const dir = `graphics/feature-graphic/${themeId}`;
    const centred = brandPanel(w, h);
    await shoot(chrome, `${dir}/feature-graphic.png`, page({ w, h, tokens, ...centred }), FEATURE_GRAPHIC_PX);
    const device = featureGraphicDevice(w, h);
    await shoot(
      chrome,
      `${dir}/feature-graphic-device.png`,
      page({ w, h, tokens, ...device }),
      FEATURE_GRAPHIC_PX,
    );
  }
}

async function renderSocial(chrome, themes) {
  for (const [themeId, tokens] of themes) {
    for (const target of SOCIAL_TARGETS) {
      const [pxW, pxH] = target.px;
      const w = pxW / 2;
      const h = pxH / 2;
      const built = brandPanel(w, h);
      await shoot(chrome, `social/${themeId}/${target.id}.png`, page({ w, h, tokens, ...built }), target.px);
    }
  }
}

// One file, not one per theme: a store shows exactly one icon.
async function renderIcon(chrome) {
  const built = brandIcon(ICON_PX);
  const html = page({ w: ICON_PX, h: ICON_PX, tokens: LIGHT, ...built });
  await shoot(chrome, "graphics/icon-512.png", html, [ICON_PX, ICON_PX], 1);
}

// F-Droid wants the Android set under fastlane's own numbered filenames.
// Written on request rather than kept as a second copy in the repo.
function writeFastlaneTree(dest) {
  const dst = join(dest, "en-US/images");
  const shots = join(dst, "phoneScreenshots");
  mkdirSync(shots, { recursive: true });

  const ordered = ["00-brand", ...PANELS.map((p) => p.id)];
  ordered.forEach((id, i) => {
    copyFileSync(
      join(OUT, "screenshots/android/light", `${id}.png`),
      join(shots, `${i + 1}.png`),
    );
  });
  copyFileSync(
    join(OUT, "graphics/feature-graphic/light/feature-graphic.png"),
    join(dst, "featureGraphic.png"),
  );
  copyFileSync(join(OUT, "graphics/icon-512.png"), join(dst, "icon.png"));
  console.log(`\nfastlane tree written to ${dst}`);
}

// ---------------------------------------------------------------------------

async function main() {
  const lightOnly = process.argv.includes("--light");
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg === undefined ? null : onlyArg.slice("--only=".length);
  const fastlaneArg = process.argv.find((a) => a.startsWith("--fastlane="));
  const themes = lightOnly
    ? [["light", LIGHT]]
    : [
      ["light", LIGHT],
      ["dark", DARK],
    ];

  rmSync(BUILD, { recursive: true, force: true });
  mkdirSync(BUILD, { recursive: true });
  if (only === null) rmSync(OUT, { recursive: true, force: true });
  const chrome = findChrome();
  console.log(`renderer: ${chrome}\n`);

  if (only === null || only === "screens") {
    await renderScreens(chrome, themes);
    await renderFeatureGraphics(chrome, themes);
  }
  if (only === null || only === "social") await renderSocial(chrome, themes);
  if (only === null || only === "icon") await renderIcon(chrome);

  console.log(`\n${shotCount} images rendered into press/out/`);
  if (fastlaneArg !== undefined) writeFastlaneTree(fastlaneArg.slice("--fastlane=".length));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
