// Slide primitives. Every shape the deck draws comes from here, so the card
// radius, the hairline weight and the eyebrow tracking are decided once.
//
// The vocabulary mirrors landing/src/components/ui: SectionHeader, LeaderLabel,
// Chip, CardTexture. Same idiom, different renderer.

import { BIRD, C, FONT, G, HAIRLINE, radius, SLIDE, T } from "./tokens.mjs";

// PowerPoint counts a text box's inset in its box, so every text primitive is
// placed with inset zeroed and the caller positions the glyph, not the frame.
const NO_INSET = { margin: 0 };

export function sans(extra = {}) {
  return { fontFace: FONT.sans, color: C.ink, ...NO_INSET, ...extra };
}

export function mono(extra = {}) {
  return { fontFace: FONT.mono, color: C.secondary, ...NO_INSET, ...extra };
}

// PowerPoint sets a line at roughly 1.2 em before the spacing multiple is
// applied. Guessing this wrong is what puts a subhead through a title, so every
// stacked text block measures with it rather than with a constant.
export function lineHeight(sizePt, multiple = 1) {
  return (sizePt / 72) * 1.2 * multiple;
}

// ---------------------------------------------------------------------------
// Chrome
// ---------------------------------------------------------------------------

export function eyebrow(
  s,
  text,
  { x = G.mx, y = G.eyebrowY, color = C.secondary } = {},
) {
  s.addText(text.toUpperCase(), {
    x,
    y,
    w: G.w,
    h: 0.2,
    ...mono({
      fontSize: T.eyebrow,
      bold: true,
      charSpacing: 1.6,
      color,
      valign: "middle",
    }),
  });
}

// A title is authored with \n where the line should break, so the break is a
// decision in content.mjs rather than an accident of box width.
export function title(
  s,
  text,
  { x = G.mx, y = G.titleY, w = G.w, size = T.title, align = "left" } = {},
) {
  const lines = text.split("\n");
  const h = lines.length * lineHeight(size, T.titleLead);
  s.addText(
    lines.map((line, i) => ({
      text: line,
      options: { breakLine: i < lines.length - 1 },
    })),
    {
      x,
      y,
      w,
      h,
      ...sans({
        fontSize: size,
        bold: true,
        lineSpacingMultiple: T.titleLead,
        valign: "top",
        align,
      }),
    },
  );
  return y + h;
}

export function sub(s, text, { x = G.mx, y, w = 9.9, size = T.sub } = {}) {
  s.addText(text, {
    x,
    y,
    w,
    h: 2 * lineHeight(size, T.subLead),
    ...sans({
      fontSize: size,
      color: C.secondary,
      lineSpacingMultiple: T.subLead,
      valign: "top",
    }),
  });
}

// Eyebrow, title, subhead. The subhead is placed under whatever the title
// actually measured, so a one-line and a two-line title both clear it.
export function header(s, { eyebrow: eb, title: tt, sub: sb, subWidth }) {
  if (eb) eyebrow(s, eb);
  const bottom = tt ? title(s, tt) : G.titleY;
  if (sb) sub(s, sb, { y: bottom + G.titleGap, w: subWidth });
}

export function pixelBird(s, { x, y, cell = 0.032, color = C.ink, name }) {
  BIRD.forEach((row, ry) =>
    row.forEach((on, rx) => {
      if (!on) return;
      s.addShape("rect", {
        x: x + rx * cell,
        y: y + ry * cell,
        // A hair of overlap, as PixelBird.tsx does, so adjacent pixels do not
        // show an antialiased seam between them.
        w: cell * 1.04,
        h: cell * 1.04,
        fill: { color },
        line: { color, width: 0 },
        ...(name ? { objectName: `${name}-${rx}-${ry}` } : {}),
      });
    }),
  );
}

// Mark, wordmark, page number. No section label: the eyebrow at the top of the
// slide already says which section this is. Appendix pages count separately, so
// nobody reads slide 12 of 13 and wonders what they missed.
export function footer(s, { index, total, appendix = false }) {
  const pad = (n) => (appendix ? `A${n}` : String(n).padStart(2, "0"));
  s.addShape("line", { x: G.mx, y: G.ruleY, w: G.w, h: 0, line: HAIRLINE });
  pixelBird(s, { x: G.mx, y: G.footY + 0.055, cell: 0.026, color: C.ink });
  s.addText("AIRHOP", {
    x: G.mx + 0.38,
    y: G.footY,
    w: 2,
    h: 0.24,
    ...mono({
      fontSize: T.micro,
      bold: true,
      color: C.secondary,
      charSpacing: 1.2,
      valign: "middle",
    }),
  });
  s.addText(`${pad(index)} / ${pad(total)}`, {
    x: SLIDE.w - G.mx - 2,
    y: G.footY,
    w: 2,
    h: 0.24,
    ...mono({
      fontSize: T.micro,
      color: C.mute,
      align: "right",
      valign: "middle",
    }),
  });
}

// One line of provenance, every entry clickable. A number nobody can check is
// a number nobody should believe.
export function sourceLine(s, sources, { y = G.bodyBottom + 0.06 } = {}) {
  const runs = [{ text: "Source:  ", options: { color: C.mute } }];
  sources.forEach((src, i) => {
    if (i > 0) runs.push({ text: "   ·   ", options: { color: C.line } });
    runs.push({
      text: src.label,
      options: {
        color: C.mute,
        hyperlink: { url: src.url, tooltip: src.label },
      },
    });
  });
  s.addText(runs, {
    x: G.mx,
    y,
    w: G.w,
    h: 0.2,
    ...mono({ fontSize: T.micro, color: C.mute, valign: "middle" }),
  });
}

// Several links on one line, separated by a dot. One text box, so the spacing
// is the font's rather than something measured by hand.
export function linkRow(
  s,
  { x, y, w, h, items, size = T.small, color = C.ink, align = "left" },
) {
  const runs = [];
  items.forEach((item, i) => {
    if (i > 0) runs.push({ text: "   ·   ", options: { color: C.line } });
    runs.push({
      text: item.label,
      options: {
        color,
        bold: true,
        hyperlink: { url: item.url, tooltip: item.label },
      },
    });
  });
  s.addText(runs, {
    x,
    y,
    w,
    h,
    ...mono({ fontSize: size, color, align, valign: "middle" }),
  });
}

// One hyperlink. The run carries its own colour, which is what stops PowerPoint
// repainting it theme blue on a black band.
export function link(
  s,
  { x, y, w, h, text, url, size = 12, color = C.ink, align = "center" },
) {
  s.addText(
    [
      {
        text,
        options: { hyperlink: { url, tooltip: text }, color, bold: true },
      },
    ],
    {
      x,
      y,
      w,
      h,
      ...mono({ fontSize: size, color, align, valign: "middle" }),
    },
  );
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export function card(s, { x, y, w, h, fill = C.card, line = HAIRLINE, name }) {
  s.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: radius(w, h),
    fill: { color: fill },
    line,
    ...(name ? { objectName: name } : {}),
  });
}

// The landing's card header strip: a hairline-separated bar with a mono label.
export function cardHead(s, { x, y, w, text }) {
  s.addText(`●  ${text.toUpperCase()}`, {
    x: x + 0.26,
    y: y + 0.1,
    w: w - 0.52,
    h: 0.28,
    ...mono({
      fontSize: T.micro,
      bold: true,
      charSpacing: 1.3,
      valign: "middle",
    }),
  });
  s.addShape("line", {
    x: x + 0.16,
    y: y + 0.46,
    w: w - 0.32,
    h: 0,
    line: HAIRLINE,
  });
}

export function chip(
  s,
  { x, y, text, w, fill = C.inner, color = C.ink, name, url },
) {
  const width = w ?? 0.26 + text.length * 0.075;
  s.addShape("roundRect", {
    x,
    y,
    w: width,
    h: 0.26,
    rectRadius: 0.13,
    fill: { color: fill },
    line: { color: fill === C.inner ? C.line : fill, width: 0.75 },
    ...(name ? { objectName: name } : {}),
  });
  s.addText(
    url
      ? [
          {
            text: text.toUpperCase(),
            options: { color, bold: true, hyperlink: { url, tooltip: text } },
          },
        ]
      : text.toUpperCase(),
    {
      x,
      y,
      w: width,
      h: 0.26,
      ...mono({
        fontSize: T.micro,
        bold: true,
        color,
        align: "center",
        valign: "middle",
        charSpacing: 0.8,
      }),
    },
  );
  return width;
}

// landing/src/components/ui/LeaderLabel.tsx: numeral, hairline, label.
export function leaderLabel(s, { x, y, w, n, label }) {
  let cursor = x;
  if (n) {
    s.addText(n, {
      x,
      y,
      w: 0.28,
      h: 0.26,
      ...mono({
        fontSize: T.small,
        color: C.mute,
        valign: "middle",
        charSpacing: 0.8,
      }),
    });
    cursor = x + 0.34;
  }
  const labelW = 0.1 + label.length * 0.095;
  const labelX = x + w - labelW;
  s.addShape("line", {
    x: cursor,
    y: y + 0.13,
    w: Math.max(0.1, labelX - cursor - 0.12),
    h: 0,
    line: HAIRLINE,
  });
  s.addText(label.toUpperCase(), {
    x: labelX,
    y,
    w: labelW,
    h: 0.26,
    ...mono({
      fontSize: T.small,
      bold: true,
      color: C.ink,
      align: "right",
      valign: "middle",
      charSpacing: 0.9,
    }),
  });
}

export function body(
  s,
  text,
  { x, y, w, h = 0.9, size = T.body, color = C.secondary } = {},
) {
  s.addText(text, {
    x,
    y,
    w,
    h,
    ...sans({
      fontSize: size,
      color,
      lineSpacingMultiple: 1.34,
      valign: "top",
    }),
  });
}

// ---------------------------------------------------------------------------
// Composites
// ---------------------------------------------------------------------------

// A number, its unit, and one line under a hairline. No chart: a single value
// has no shape to plot, so it is set as type.
export function statTile(s, { x, y, w, h, n, unit, line, name }) {
  card(s, { x, y, w, h, name });
  s.addText(n, {
    x: x + 0.34,
    y: y + 0.26,
    w: w - 0.68,
    h: 0.62,
    ...sans({ fontSize: T.stat, bold: true, valign: "middle" }),
  });
  if (unit) {
    s.addText(unit.toUpperCase(), {
      x: x + 0.34,
      y: y + 0.9,
      w: w - 0.68,
      h: 0.22,
      ...mono({
        fontSize: T.micro,
        bold: true,
        color: C.mute,
        charSpacing: 1.4,
        valign: "middle",
      }),
    });
  }
  s.addShape("line", {
    x: x + 0.34,
    y: y + 1.24,
    w: w - 0.68,
    h: 0,
    line: HAIRLINE,
  });
  body(s, line, {
    x: x + 0.34,
    y: y + 1.38,
    w: w - 0.68,
    h: h - 1.6,
    size: T.small,
  });
}

// A card with a leader label at the top and prose under it.
export function pointCard(s, { x, y, w, h, n, label, line, tag, name }) {
  card(s, { x, y, w, h, name });
  leaderLabel(s, { x: x + 0.34, y: y + 0.3, w: w - 0.68, n, label });
  body(s, line, {
    x: x + 0.34,
    y: y + 0.78,
    w: w - 0.68,
    h: h - 1.1,
    size: T.small,
  });
  if (tag) chip(s, { x: x + 0.34, y: y + h - 0.58, text: tag });
}

// Rows inside a card. Bands and rules are inset from the card edge, so nothing
// squares off a rounded corner, and the last row has no rule under it because
// the card border is already there.
export function table(
  s,
  {
    x,
    y,
    w,
    head,
    rows,
    colW,
    rowH = 0.42,
    headH = 0.4,
    marks = [],
    links = [],
    pad = 0.18,
    highlight,
  },
) {
  const inner = w - pad * 2;
  const left = x + pad;
  const widths = colW.map((f) => f * inner);
  const xs = widths.reduce(
    (acc, cw) => [...acc, acc[acc.length - 1] + cw],
    [left],
  );

  head.forEach((h, i) => {
    if (!h) return;
    s.addText(h.toUpperCase(), {
      x: xs[i] + 0.14,
      y,
      w: widths[i] - 0.2,
      h: headH,
      ...mono({
        fontSize: T.micro,
        bold: true,
        charSpacing: 1.1,
        valign: "middle",
        align: marks.includes(i) ? "center" : "left",
      }),
    });
  });
  s.addShape("line", { x: left, y: y + headH, w: inner, h: 0, line: HAIRLINE });

  rows.forEach((row, r) => {
    const ry = y + headH + r * rowH;
    if (r % 2 === 1) {
      s.addShape("rect", {
        x: left,
        y: ry,
        w: inner,
        h: rowH,
        fill: { color: C.cardSubtle },
        line: { color: C.cardSubtle, width: 0 },
      });
    }
    const url = links[r];
    row.forEach((cell, i) => {
      const isMark = marks.includes(i);
      const first = i === 0;
      // The landing marks its own row with an ink pill. Same here.
      if (first && cell === highlight) {
        chip(s, {
          x: xs[i] + 0.12,
          y: ry + rowH / 2 - 0.13,
          text: String(cell),
          fill: C.ink,
          color: C.canvas,
          url,
        });
        return;
      }
      if (first && url) {
        s.addText(
          [
            {
              text: String(cell),
              options: {
                color: C.ink,
                bold: true,
                hyperlink: { url, tooltip: String(cell) },
              },
            },
          ],
          {
            x: xs[i] + 0.14,
            y: ry,
            w: widths[i] - 0.2,
            h: rowH,
            ...sans({
              fontSize: T.small,
              color: C.ink,
              bold: true,
              valign: "middle",
            }),
          },
        );
        return;
      }
      s.addText(isMark ? (cell ? "✓" : "✕") : String(cell), {
        x: xs[i] + 0.14,
        y: ry,
        w: widths[i] - 0.2,
        h: rowH,
        ...(isMark
          ? sans({
              fontSize: T.body,
              color: cell ? C.ink : C.lineStrong,
              align: "center",
              valign: "middle",
            })
          : sans({
              fontSize: T.small,
              color: first ? C.ink : C.secondary,
              bold: first,
              valign: "middle",
            })),
      });
    });
    if (r < rows.length - 1) {
      s.addShape("line", {
        x: left,
        y: ry + rowH,
        w: inner,
        h: 0,
        line: HAIRLINE,
      });
    }
  });

  return y + headH + rows.length * rowH;
}

// A coarse dot field, the landing's .dot-field at a density a slide can afford.
// One shape per dot, so the step is a file-size decision as much as a visual
// one. Coarse enough to stay a texture, not a pattern.
export function dotField(s, { x, y, w, h, step = 0.4, color = C.line }) {
  const cols = Math.floor(w / step);
  const rows = Math.floor(h / step);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      s.addShape("ellipse", {
        x: x + c * step,
        y: y + r * step,
        w: 0.022,
        h: 0.022,
        fill: { color },
        line: { color, width: 0 },
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Animation grouping
// ---------------------------------------------------------------------------

// Everything drawn inside one group() call shares a name prefix, and lib/motion
// reveals a prefix as a unit. Motion is off by default; the grouping stays so
// --anim remains one flag rather than a rewrite.
let stamp = 0;

export function group(s, id, fn) {
  const prev = {
    addShape: s.addShape,
    addText: s.addText,
    addImage: s.addImage,
  };
  const tag = () => ({ objectName: `${id}#${stamp++}` });
  s.addShape = (type, opts = {}) =>
    prev.addShape.call(s, type, { ...opts, ...tag() });
  s.addText = (text, opts = {}) =>
    prev.addText.call(s, text, { ...opts, ...tag() });
  s.addImage = (opts = {}) => prev.addImage.call(s, { ...opts, ...tag() });
  try {
    fn();
  } finally {
    Object.assign(s, prev);
  }
}

export const CARD_GAP = 0.24;

// Even columns across the content width.
export function cols(count, gap = CARD_GAP, width = G.w, left = G.mx) {
  const w = (width - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, i) => ({
    x: left + i * (w + gap),
    w,
  }));
}
