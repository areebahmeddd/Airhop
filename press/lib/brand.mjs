// The centred card behind the title panel, the feature graphic, every social
// size and the store icon. One layout at any aspect ratio.

import { icon, pixelBird } from "./icons.mjs";

const HEADLINE_WIDE = `Private<span class="dim">.</span> Offline<span class="dim">.</span> Free<span class="dim">.</span>`;
const HEADLINE_TALL = `Private<span class="dim">.</span><br>Offline<span class="dim">.</span> Free<span class="dim">.</span>`;
const SUB = "Peer-to-peer messaging over Bluetooth mesh";

// Wide enough that height, not width, caps the type size.
function isWide(w, h) {
  return w / h >= 1.4;
}

// Ghosted feature glyphs behind the mark. Fixed seed: two builds must produce
// the same image.
function glyphField(w, h) {
  const names = [
    "radio",
    "lock",
    "message-circle",
    "zap",
    "map-pin",
    "users",
    "mic",
    "credit-card",
    "hash",
    "paperclip",
    "key",
    "database",
  ];
  let seed = 20260801;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const cell = Math.max(52, Math.round(Math.min(w, h) * 0.155));
  const out = [];
  for (let y = -cell * 0.5; y < h + cell; y += cell) {
    for (let x = -cell * 0.5; x < w + cell; x += cell) {
      const name = names[Math.floor(rnd() * names.length)];
      const size = cell * (0.36 + rnd() * 0.22);
      const jx = (rnd() - 0.5) * cell * 0.45;
      const jy = (rnd() - 0.5) * cell * 0.45;
      const rot = (rnd() - 0.5) * 26;
      out.push(
        `<span class="glyph" style="left:${(x + jx).toFixed(1)}px;top:${(y + jy).toFixed(1)}px;transform:rotate(${rot.toFixed(1)}deg)">${icon(name, size, "currentColor", 1.6)}</span>`,
      );
    }
  }
  return `<div class="glyphs">${out.join("")}</div>`;
}

export function brandCard(w, h) {
  const wide = isWide(w, h);
  const base = wide ? h : w;
  const m = {
    bird: base * (wide ? 0.22 : 0.145),
    word: base * (wide ? 0.06 : 0.038),
    head: base * (wide ? 0.135 : 0.085),
    sub: base * (wide ? 0.046 : 0.031),
    gap: base * (wide ? 0.07 : 0.045),
  };

  const body = `<div class="brand">
    ${glyphField(w, h)}
    <div class="brand-inner">
      <div class="lockup">${pixelBird(m.bird, "var(--panelText)")}<span class="word">AIRHOP</span></div>
      <div class="head">${wide ? HEADLINE_WIDE : HEADLINE_TALL}</div>
      <div class="sub">${SUB}</div>
    </div>
  </div>`;

  const css = `
.brand{position:relative;width:${w}px;height:${h}px;display:flex;align-items:center;
  justify-content:center;overflow:hidden}
.glyphs{position:absolute;inset:0;color:var(--panelText);opacity:0.06;overflow:hidden}
.glyph{position:absolute;display:block}
.brand-inner{position:relative;display:flex;flex-direction:column;align-items:center;
  text-align:center;padding:0 ${Math.round(w * 0.07)}px}
.lockup{display:flex;align-items:center;gap:${(m.bird * 0.28).toFixed(1)}px;
  margin-bottom:${m.gap.toFixed(1)}px}
.word{font-family:var(--mono);font-size:${m.word.toFixed(1)}px;font-weight:700;
  letter-spacing:0.34em;text-indent:0.34em;color:var(--panelText)}
.head{font-size:${m.head.toFixed(1)}px;font-weight:700;letter-spacing:-0.028em;line-height:1.1;
  color:var(--panelText)${wide ? ";white-space:nowrap" : ""}}
.head .dim{color:var(--panelMuted)}
.sub{margin-top:${(m.gap * 0.62).toFixed(1)}px;max-width:${Math.round(w * (wide ? 0.6 : 0.78))}px;
  font-size:${m.sub.toFixed(1)}px;line-height:1.45;color:var(--panelSub)}
`;

  return { body, css };
}

// Same grid as assets/images/icon.png, redrawn at size rather than resampled.
export function brandIcon(size) {
  const cell = Math.round((size * 0.6) / 11);
  const body = `<div class="icon-canvas">${pixelBird(cell * 11, "#111111")}</div>`;
  const css = `
.icon-canvas{width:${size}px;height:${size}px;background:#FFFFFF;display:flex;
  align-items:center;justify-content:center}
`;
  return { body, css };
}
