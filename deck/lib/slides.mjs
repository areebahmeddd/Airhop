// The deck, one function per slide, in order.
//
// Ten slides carry the argument. Three appendix slides carry the detail that
// gets asked for afterwards rather than during. Copy and numbers come from
// lib/content.mjs, shapes from lib/draw.mjs. Nothing here invents either.

import {
  ARCH,
  ASK,
  COVER,
  DEMAND,
  HOW,
  LANDSCAPE,
  MARKET,
  META,
  NOTES,
  PROBLEM,
  PRODUCT,
  RISKS,
  ROADMAP,
  SECURITY,
  SOURCES,
  STORES,
  WEDGE,
  cite,
} from "./content.mjs";
import {
  body,
  card,
  cardHead,
  chip,
  cols,
  dotField,
  group,
  header,
  leaderLabel,
  link,
  linkRow,
  mono,
  pixelBird,
  pointCard,
  sans,
  sourceLine,
  statTile,
  table,
  title,
} from "./draw.mjs";
import { C, G, HAIRLINE, SLIDE, T, radius } from "./tokens.mjs";

const CENTER = { align: "center" };

function band(s, { y, h = 0.9, fill = C.ink, x = G.mx, w = G.w }) {
  s.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: radius(w, h),
    fill: { color: fill },
    line: { color: fill, width: 0 },
  });
}

function inkBand(s, { y, text, h = 0.86 }) {
  band(s, { y, h });
  s.addText(text, {
    x: G.mx + 0.5,
    y,
    w: G.w - 1,
    h,
    ...sans({
      fontSize: 12.5,
      color: C.canvas,
      bold: true,
      valign: "middle",
      ...CENTER,
    }),
  });
}

// Every appendix slide points at the document it summarises, parked on the
// eyebrow line so it never competes with the title.
function docLink(s, doc) {
  link(s, {
    x: G.mx + G.w - 4,
    y: G.eyebrowY,
    w: 4,
    h: 0.2,
    text: doc.label,
    url: doc.url,
    size: T.micro,
    color: C.mute,
    align: "right",
  });
}

function sources(keys) {
  return keys.map((k) => SOURCES[k]);
}

// ---------------------------------------------------------------------------
// 01 Cover
// ---------------------------------------------------------------------------

export function cover(s) {
  group(s, "bg", () => {
    dotField(s, { x: 0, y: 0, w: SLIDE.w, h: 2.1 });
    dotField(s, { x: 0, y: 5.6, w: SLIDE.w, h: 1.9 });
  });

  group(s, "mark", () => {
    pixelBird(s, { x: (SLIDE.w - 11 * 0.075) / 2, y: 1.18, cell: 0.075 });
    s.addText(COVER.wordmark, {
      x: 0,
      y: 1.9,
      w: SLIDE.w,
      h: 0.32,
      ...mono({
        fontSize: 15,
        bold: true,
        color: C.ink,
        charSpacing: 6,
        valign: "middle",
        ...CENTER,
      }),
    });
  });

  group(s, "title", () =>
    title(s, COVER.title, {
      x: 0,
      y: 2.46,
      w: SLIDE.w,
      size: T.display,
      align: "center",
    }),
  );

  group(s, "sub", () =>
    s.addText(COVER.sub, {
      x: (SLIDE.w - 8.2) / 2,
      y: 4.06,
      w: 8.2,
      h: 0.8,
      ...sans({
        fontSize: 13.5,
        color: C.secondary,
        lineSpacingMultiple: 1.34,
        ...CENTER,
      }),
    }),
  );

  group(s, "chips", () => {
    const widths = COVER.chips.map((t) => 0.34 + t.length * 0.075);
    const total =
      widths.reduce((a, b) => a + b, 0) + 0.18 * (COVER.chips.length - 1);
    let x = (SLIDE.w - total) / 2;
    COVER.chips.forEach((t, i) => {
      chip(s, { x, y: 5.08, text: t, w: widths[i] });
      x += widths[i] + 0.18;
    });
  });

  group(s, "foot", () => {
    s.addShape("line", {
      x: (SLIDE.w - 6) / 2,
      y: 5.98,
      w: 6,
      h: 0,
      line: HAIRLINE,
    });
    s.addText(
      [
        { text: COVER.foot, options: { color: C.mute } },
        {
          text: META.site,
          options: {
            color: C.ink,
            bold: true,
            hyperlink: { url: META.siteUrl },
          },
        },
      ],
      {
        x: 0,
        y: 6.14,
        w: SLIDE.w,
        h: 0.3,
        ...mono({
          fontSize: T.small,
          color: C.mute,
          valign: "middle",
          ...CENTER,
        }),
      },
    );
  });

  s.addNotes(NOTES.cover);
}

// ---------------------------------------------------------------------------
// 02 Problem
// ---------------------------------------------------------------------------

export function problem(s) {
  group(s, "head", () => header(s, PROBLEM));

  const c = cols(3);
  PROBLEM.stats.forEach((stat, i) => {
    group(s, `stat${i}`, () =>
      statTile(s, {
        x: c[i].x,
        y: G.bodyY,
        w: c[i].w,
        h: 2.16,
        n: stat.n,
        unit: stat.unit,
        line: stat.line,
      }),
    );
  });

  group(s, "kicker", () => {
    card(s, { x: G.mx, y: 4.94, w: G.w, h: 0.92, fill: C.cardSubtle });
    body(s, PROBLEM.kicker, {
      x: G.mx + 0.4,
      y: 5.12,
      w: G.w - 0.8,
      h: 0.6,
      size: T.body,
      color: C.ink,
    });
  });

  group(s, "src", () => sourceLine(s, sources(PROBLEM.sources), { y: 6.24 }));
  s.addNotes(cite(NOTES.problem, PROBLEM.sources));
}

// ---------------------------------------------------------------------------
// 03 Demand
// ---------------------------------------------------------------------------

export function demand(s) {
  group(s, "head", () => header(s, DEMAND));

  const leftW = 6.5;
  const top = G.bodyY;

  group(s, "spike", () => {
    card(s, { x: G.mx, y: top, w: leftW, h: 2.45 });
    cardHead(s, { x: G.mx, y: top, w: leftW, text: DEMAND.spike.label });

    s.addText(DEMAND.spike.before, {
      x: G.mx + 0.36,
      y: top + 0.62,
      w: 1.9,
      h: 0.5,
      ...sans({
        fontSize: T.statSm,
        bold: true,
        color: C.lineStrong,
        valign: "middle",
      }),
    });
    s.addText(DEMAND.spike.beforeLabel.toUpperCase(), {
      x: G.mx + 0.36,
      y: top + 1.1,
      w: 1.9,
      h: 0.22,
      ...mono({
        fontSize: T.micro,
        color: C.mute,
        charSpacing: 1.2,
        valign: "middle",
      }),
    });

    s.addText("→", {
      x: G.mx + 2.34,
      y: top + 0.62,
      w: 0.6,
      h: 0.5,
      ...sans({
        fontSize: 20,
        color: C.lineStrong,
        valign: "middle",
        ...CENTER,
      }),
    });

    s.addText(DEMAND.spike.after, {
      x: G.mx + 3.0,
      y: top + 0.56,
      w: 3.1,
      h: 0.62,
      ...sans({ fontSize: T.stat, bold: true, valign: "middle" }),
    });
    s.addText(DEMAND.spike.afterLabel.toUpperCase(), {
      x: G.mx + 3.0,
      y: top + 1.1,
      w: 3.1,
      h: 0.22,
      ...mono({
        fontSize: T.micro,
        color: C.mute,
        charSpacing: 1.2,
        valign: "middle",
      }),
    });

    s.addShape("line", {
      x: G.mx + 0.36,
      y: top + 1.48,
      w: leftW - 0.72,
      h: 0,
      line: HAIRLINE,
    });
    body(s, DEMAND.spike.note, {
      x: G.mx + 0.36,
      y: top + 1.62,
      w: leftW - 0.72,
      h: 0.7,
      size: T.small,
    });
  });

  const rightX = G.mx + leftW + 0.24;
  const rightW = G.w - leftW - 0.24;

  group(s, "proof", () => {
    card(s, { x: rightX, y: top, w: rightW, h: 2.45 });
    DEMAND.proof.forEach((row, i) => {
      const y = top + 0.22 + i * 0.73;
      s.addText(row.k, {
        x: rightX + 0.34,
        y,
        w: 1.5,
        h: 0.4,
        ...sans({ fontSize: 16, bold: true, valign: "middle" }),
      });
      body(s, row.v, {
        x: rightX + 1.94,
        y: y + 0.02,
        w: rightW - 2.3,
        h: 0.6,
        size: T.small,
      });
      if (i < DEMAND.proof.length - 1) {
        s.addShape("line", {
          x: rightX + 0.34,
          y: y + 0.58,
          w: rightW - 0.68,
          h: 0,
          line: HAIRLINE,
        });
      }
    });
  });

  group(s, "kicker", () =>
    inkBand(s, { y: 5.18, text: DEMAND.kicker, h: 0.92 }),
  );
  group(s, "src", () => sourceLine(s, sources(DEMAND.sources), { y: 6.34 }));
  s.addNotes(cite(NOTES.demand, DEMAND.sources));
}

// ---------------------------------------------------------------------------
// 04 Landscape
// ---------------------------------------------------------------------------

export function landscape(s) {
  group(s, "head", () => header(s, LANDSCAPE));

  group(s, "table", () => {
    card(s, { x: G.mx, y: G.bodyY, w: G.w, h: 3.72 });
    table(s, {
      x: G.mx,
      y: G.bodyY + 0.14,
      w: G.w,
      head: LANDSCAPE.head,
      rows: LANDSCAPE.rows,
      colW: [0.15, 0.24, 0.27, 0.113, 0.113, 0.114],
      rowH: 0.39,
      headH: 0.38,
      marks: [3, 4, 5],
      links: LANDSCAPE.links,
      highlight: "Airhop",
    });
  });

  group(s, "kicker", () =>
    body(s, LANDSCAPE.kicker, {
      x: G.mx,
      y: 6.44,
      w: G.w,
      h: 0.3,
      size: T.small,
    }),
  );
  s.addNotes(NOTES.landscape);
}

// ---------------------------------------------------------------------------
// 05 Product
// ---------------------------------------------------------------------------

export function product(s, { screens }) {
  group(s, "head", () => header(s, PRODUCT));

  const c = cols(3);
  PRODUCT.screens.forEach((screen, i) => {
    group(s, `screen${i}`, () => {
      const { x, w } = c[i];
      const imgH = 2.86;
      const imgW = imgH * (screens.ratio ?? 0.489);
      const imgX = x + (w - imgW) / 2;

      const file = screens.files?.[screen.file];
      if (file) {
        s.addImage({ path: file, x: imgX, y: G.bodyY, w: imgW, h: imgH });
      } else {
        card(s, { x: imgX, y: G.bodyY, w: imgW, h: imgH, fill: C.inner });
        s.addText("run npm run screens", {
          x: imgX,
          y: G.bodyY,
          w: imgW,
          h: imgH,
          ...mono({
            fontSize: T.micro,
            color: C.mute,
            valign: "middle",
            ...CENTER,
          }),
        });
      }

      leaderLabel(s, { x, y: 5.5, w, n: null, label: screen.label });
      body(s, screen.line, { x, y: 5.86, w, h: 0.3, size: T.small });
    });
  });

  group(s, "strip", () => {
    const y = 6.16;
    const h = 0.56;
    card(s, { x: G.mx, y, w: G.w, h, fill: C.cardSubtle });
    s.addText("DOWNLOAD", {
      x: G.mx + 0.32,
      y,
      w: 1.0,
      h,
      ...mono({
        fontSize: T.micro,
        bold: true,
        color: C.mute,
        charSpacing: 1.3,
        valign: "middle",
      }),
    });
    linkRow(s, {
      x: G.mx + 1.42,
      y,
      w: 5.6,
      h,
      items: STORES,
      size: T.small,
    });
    s.addText(PRODUCT.next, {
      x: G.mx + 7.2,
      y,
      w: G.w - 7.52,
      h,
      ...mono({
        fontSize: T.small,
        color: C.secondary,
        align: "right",
        valign: "middle",
      }),
    });
  });

  s.addNotes(NOTES.product);
}

// ---------------------------------------------------------------------------
// 06 How it works
// ---------------------------------------------------------------------------

export function how(s) {
  group(s, "head", () => header(s, HOW));

  const c = cols(3);
  HOW.steps.forEach((step, i) => {
    group(s, `step${i}`, () =>
      pointCard(s, {
        x: c[i].x,
        y: G.bodyY,
        w: c[i].w,
        h: 1.44,
        n: step.n,
        label: step.label,
        line: step.line,
      }),
    );
  });

  group(s, "diagram", () => {
    const y0 = 4.14;
    card(s, { x: G.mx, y: y0, w: G.w, h: 2.22 });
    cardHead(s, { x: G.mx, y: y0, w: G.w, text: HOW.diagram.caption });

    const cy = 5.32;
    const r = 0.3;
    const nodes = [
      { cx: 2.5, label: "Node 1" },
      { cx: 5.1, label: "Node 2" },
      { cx: 7.7, label: "Node 3" },
    ];

    nodes.slice(0, -1).forEach((n, i) => {
      const next = nodes[i + 1];
      s.addShape("line", {
        x: n.cx + r + 0.1,
        y: cy,
        w: next.cx - n.cx - 2 * r - 0.2,
        h: 0,
        line: { color: C.ink, width: 1, dashType: "sysDot" },
      });
    });

    s.addShape("line", {
      x: nodes[2].cx + r + 0.1,
      y: cy,
      w: 10.55 - nodes[2].cx - r - 0.4,
      h: 0,
      line: { color: C.relay, width: 1, dashType: "sysDot" },
    });

    nodes.forEach((n) => {
      s.addShape("ellipse", {
        x: n.cx - r,
        y: cy - r,
        w: r * 2,
        h: r * 2,
        fill: { color: C.canvas },
        line: { color: C.ink, width: 1.25 },
      });
      s.addShape("roundRect", {
        x: n.cx - 0.075,
        y: cy - 0.14,
        w: 0.15,
        h: 0.24,
        rectRadius: 0.03,
        fill: { color: C.canvas },
        line: { color: C.ink, width: 1 },
      });
      s.addText(n.label, {
        x: n.cx - 0.7,
        y: cy + 0.36,
        w: 1.4,
        h: 0.22,
        ...mono({
          fontSize: T.micro,
          bold: true,
          color: C.ink,
          valign: "middle",
          ...CENTER,
        }),
      });
    });

    s.addShape("ellipse", {
      x: 10.85 - r,
      y: cy - r,
      w: r * 2,
      h: r * 2,
      fill: { color: C.canvas },
      line: { color: C.relay, width: 1.25 },
    });
    s.addText("Nostr relay", {
      x: 10.15,
      y: cy + 0.36,
      w: 1.4,
      h: 0.22,
      ...mono({
        fontSize: T.micro,
        bold: true,
        color: C.relay,
        valign: "middle",
        ...CENTER,
      }),
    });

    chip(s, { x: 5.1 - 1.28, y: 4.72, text: HOW.diagram.hop, w: 2.56 });

    const legendY = 6.06;
    const legendW = G.w / 4;
    HOW.diagram.legend.forEach((item, i) => {
      const x = G.mx + i * legendW;
      if (i === 0) {
        s.addShape("ellipse", {
          x: x + 0.34,
          y: legendY + 0.045,
          w: 0.14,
          h: 0.14,
          fill: { color: C.canvas },
          line: { color: C.ink, width: 1.25 },
        });
      } else {
        s.addShape("line", {
          x: x + 0.28,
          y: legendY + 0.11,
          w: 0.24,
          h: 0,
          line: {
            color: i === 3 ? C.relay : C.mute,
            width: 1,
            dashType: "sysDot",
          },
        });
      }
      s.addText(item, {
        x: x + 0.62,
        y: legendY,
        w: legendW - 0.7,
        h: 0.22,
        ...mono({ fontSize: T.micro, color: C.secondary, valign: "middle" }),
      });
    });
  });

  group(s, "facts", () =>
    body(s, HOW.facts, {
      x: G.mx,
      y: 6.48,
      w: G.w,
      h: 0.3,
      size: T.small,
      color: C.ink,
    }),
  );
  s.addNotes(NOTES.how);
}

// ---------------------------------------------------------------------------
// 07 Security
// ---------------------------------------------------------------------------

export function security(s) {
  group(s, "head", () => header(s, SECURITY));

  const c = cols(4);
  SECURITY.items.forEach((item, i) => {
    group(s, `sec${i}`, () => {
      const { x, w } = c[i];
      const y = G.bodyY;
      card(s, { x, y, w, h: 1.58 });
      s.addText(item.label, {
        x: x + 0.32,
        y: y + 0.22,
        w: w - 0.64,
        h: 0.26,
        ...mono({
          fontSize: T.small,
          bold: true,
          color: C.ink,
          charSpacing: 0.9,
          valign: "middle",
        }),
      });
      s.addShape("line", {
        x: x + 0.32,
        y: y + 0.56,
        w: w - 0.64,
        h: 0,
        line: HAIRLINE,
      });
      body(s, item.line, {
        x: x + 0.32,
        y: y + 0.68,
        w: w - 0.64,
        h: 0.84,
        size: T.small,
      });
    });
  });

  group(s, "proof", () => {
    const y = 4.28;
    const h = 1.98;
    card(s, { x: G.mx, y, w: G.w, h });
    cardHead(s, { x: G.mx, y, w: G.w, text: SECURITY.proof.caption });

    SECURITY.proof.stats.forEach((stat, i) => {
      const ry = y + 0.62 + i * 0.42;
      s.addText(stat.k, {
        x: G.mx + 0.36,
        y: ry,
        w: 0.9,
        h: 0.34,
        ...sans({ fontSize: 15, bold: true, valign: "middle" }),
      });
      s.addText(stat.v, {
        x: G.mx + 1.32,
        y: ry,
        w: 2.9,
        h: 0.34,
        ...sans({ fontSize: T.small, color: C.secondary, valign: "middle" }),
      });
    });

    s.addShape("line", {
      x: G.mx + 4.5,
      y: y + 0.62,
      w: 0,
      h: h - 0.9,
      line: HAIRLINE,
    });

    SECURITY.proof.attacks.forEach((row, i) => {
      const ry = y + 0.6 + i * 0.34;
      s.addText(row[0], {
        x: G.mx + 4.78,
        y: ry,
        w: 4.3,
        h: 0.32,
        ...sans({ fontSize: T.small, color: C.ink, valign: "middle" }),
      });
      s.addText(row[1], {
        x: G.mx + 9.1,
        y: ry,
        w: G.w - 9.44,
        h: 0.32,
        ...mono({
          fontSize: T.micro,
          color: C.secondary,
          align: "right",
          valign: "middle",
        }),
      });
      if (i < SECURITY.proof.attacks.length - 1) {
        s.addShape("line", {
          x: G.mx + 4.78,
          y: ry + 0.34,
          w: G.w - 5.12,
          h: 0,
          line: HAIRLINE,
        });
      }
    });
  });

  group(s, "honest", () =>
    body(s, SECURITY.honest, {
      x: G.mx,
      y: 6.42,
      w: G.w,
      h: 0.3,
      size: T.small,
      color: C.ink,
    }),
  );
  s.addNotes(NOTES.security);
}

// ---------------------------------------------------------------------------
// 08 Wedge
// ---------------------------------------------------------------------------

export function wedge(s) {
  group(s, "head", () => header(s, WEDGE));

  group(s, "compat", () => {
    const y = G.bodyY;
    const h = 0.8;
    card(s, { x: G.mx, y, w: G.w, h, fill: C.cardSubtle });
    const cy = y + h / 2;
    chip(s, {
      x: 1.9,
      y: cy - 0.13,
      text: "Airhop",
      fill: C.ink,
      color: C.canvas,
      w: 1.2,
      url: META.repoUrl,
    });
    chip(s, {
      x: 10.2,
      y: cy - 0.13,
      text: "bitchat",
      fill: C.canvas,
      color: C.ink,
      w: 1.2,
      url: "https://bitchat.free",
    });
    s.addShape("line", { x: 3.28, y: cy, w: 0.92, h: 0, line: HAIRLINE });
    s.addShape("line", { x: 9.2, y: cy, w: 0.92, h: 0, line: HAIRLINE });
    link(s, {
      x: 4.3,
      y: cy - 0.15,
      w: 4.8,
      h: 0.3,
      text: WEDGE.spec,
      url: `${META.repoUrl}/blob/main/docs/spec/PROTOCOLS.md`,
      size: T.micro,
      color: C.secondary,
    });
  });

  const y = 3.5;
  const h = 2.84;
  const c = cols(2);

  group(s, "inherits", () => {
    const { x, w } = c[0];
    card(s, { x, y, w, h });
    cardHead(s, { x, y, w, text: WEDGE.inherits.caption });
    WEDGE.inherits.points.forEach((point, i) => {
      const ry = y + 0.66 + i * 0.72;
      body(s, point, {
        x: x + 0.34,
        y: ry,
        w: w - 0.68,
        h: 0.58,
        size: T.small,
      });
      if (i < WEDGE.inherits.points.length - 1) {
        s.addShape("line", {
          x: x + 0.34,
          y: ry + 0.6,
          w: w - 0.68,
          h: 0,
          line: HAIRLINE,
        });
      }
    });
  });

  group(s, "adds", () => {
    const { x, w } = c[1];
    card(s, { x, y, w, h });
    cardHead(s, { x, y, w, text: WEDGE.adds.caption });
    WEDGE.adds.items.forEach((item, i) => {
      const ry = y + 0.66 + i * 0.54;
      s.addText(item.label, {
        x: x + 0.34,
        y: ry,
        w: w - 1.5,
        h: 0.24,
        ...sans({ fontSize: T.small, bold: true, valign: "middle" }),
      });
      chip(s, { x: x + w - 1.06, y: ry, text: item.tag, w: 0.72 });
      s.addText(item.line, {
        x: x + 0.34,
        y: ry + 0.24,
        w: w - 0.68,
        h: 0.24,
        ...sans({ fontSize: T.small, color: C.secondary, valign: "middle" }),
      });
      if (i < WEDGE.adds.items.length - 1) {
        s.addShape("line", {
          x: x + 0.34,
          y: ry + 0.5,
          w: w - 0.68,
          h: 0,
          line: HAIRLINE,
        });
      }
    });
  });

  group(s, "kicker", () =>
    body(s, WEDGE.kicker, {
      x: G.mx,
      y: 6.48,
      w: G.w,
      h: 0.3,
      size: T.small,
      color: C.ink,
    }),
  );
  s.addNotes(NOTES.wedge);
}

// ---------------------------------------------------------------------------
// 09 Market and model
// ---------------------------------------------------------------------------

export function market(s) {
  group(s, "head", () => header(s, MARKET));

  const leftW = 7.1;
  const rightX = G.mx + leftW + 0.24;
  const rightW = G.w - leftW - 0.24;

  MARKET.tiers.forEach((tier, i) => {
    group(s, `tier${i}`, () => {
      const y = G.bodyY + i * 1.2;
      const h = 1.08;
      card(s, { x: G.mx, y, w: leftW, h });
      s.addText(tier.label.toUpperCase(), {
        x: G.mx + 0.32,
        y: y + 0.22,
        w: 2.4,
        h: 0.24,
        ...mono({
          fontSize: T.micro,
          bold: true,
          color: C.mute,
          charSpacing: 1.3,
          valign: "middle",
        }),
      });
      s.addText(tier.n, {
        x: G.mx + 0.32,
        y: y + 0.5,
        w: 2.4,
        h: 0.42,
        ...sans({ fontSize: T.statSm, bold: true, valign: "middle" }),
      });
      s.addShape("line", {
        x: G.mx + 2.9,
        y: y + 0.2,
        w: 0,
        h: h - 0.4,
        line: HAIRLINE,
      });
      body(s, tier.line, {
        x: G.mx + 3.16,
        y: y + 0.24,
        w: leftW - 3.5,
        h: 0.68,
        size: T.small,
      });
    });
  });

  group(s, "model", () => {
    const y = G.bodyY;
    const h = 3.48;
    card(s, { x: rightX, y, w: rightW, h });
    cardHead(s, { x: rightX, y, w: rightW, text: MARKET.model.caption });
    MARKET.model.streams.forEach((stream, i) => {
      const ry = y + 0.62 + i * 0.78;
      s.addText(stream.label, {
        x: rightX + 0.32,
        y: ry,
        w: rightW - 1.5,
        h: 0.26,
        ...sans({ fontSize: T.small, bold: true, valign: "middle" }),
      });
      chip(s, {
        x: rightX + rightW - 1.06,
        y: ry + 0.01,
        text: stream.tag,
        w: 0.74,
      });
      body(s, stream.line, {
        x: rightX + 0.32,
        y: ry + 0.28,
        w: rightW - 0.64,
        h: 0.42,
        size: T.small,
      });
      s.addShape("line", {
        x: rightX + 0.32,
        y: ry + 0.68,
        w: rightW - 0.64,
        h: 0,
        line: HAIRLINE,
      });
    });
    body(s, MARKET.model.never, {
      x: rightX + 0.32,
      y: y + 2.96,
      w: rightW - 0.64,
      h: 0.44,
      size: T.small,
      color: C.ink,
    });
  });

  group(s, "kicker", () =>
    body(s, MARKET.kicker, {
      x: G.mx,
      y: 6.18,
      w: G.w,
      h: 0.3,
      size: T.small,
      color: C.ink,
    }),
  );
  group(s, "src", () => sourceLine(s, sources(MARKET.sources), { y: 6.52 }));
  s.addNotes(cite(NOTES.market, MARKET.sources));
}

// ---------------------------------------------------------------------------
// 10 Ask
// ---------------------------------------------------------------------------

export function ask(s) {
  group(s, "head", () => header(s, ASK));

  const c = cols(4);
  ASK.items.forEach((item, i) => {
    group(s, `ask${i}`, () =>
      pointCard(s, {
        x: c[i].x,
        y: G.bodyY,
        w: c[i].w,
        h: 2.4,
        n: item.n,
        label: item.label,
        line: item.line,
      }),
    );
  });

  group(s, "close", () => {
    const y = 5.16;
    const h = 1.26;
    band(s, { y, h });
    s.addText(ASK.close, {
      x: G.mx,
      y: y + 0.22,
      w: G.w,
      h: 0.36,
      ...sans({
        fontSize: 15,
        bold: true,
        color: C.canvas,
        valign: "middle",
        ...CENTER,
      }),
    });
    linkRow(s, {
      x: G.mx,
      y: y + 0.68,
      w: G.w,
      h: 0.3,
      items: [
        { label: META.site, url: META.siteUrl },
        { label: META.repo, url: META.repoUrl },
      ],
      size: T.small,
      color: C.canvas,
      align: "center",
    });
  });

  s.addNotes(NOTES.ask);
}

// ---------------------------------------------------------------------------
// A1 Architecture
// ---------------------------------------------------------------------------

export function architecture(s) {
  group(s, "head", () => {
    header(s, { ...ARCH, subWidth: 8.4 });
    docLink(s, ARCH.doc);
  });

  ARCH.layers.forEach((layer, i) => {
    group(s, `layer${i}`, () => {
      const y = G.bodyY + i * 0.72;
      const h = 0.62;
      card(s, { x: G.mx, y, w: G.w, h, fill: i === 4 ? C.cardSubtle : C.card });
      s.addText(layer.label, {
        x: G.mx + 0.34,
        y,
        w: 2.1,
        h,
        ...sans({ fontSize: 12, bold: true, valign: "middle" }),
      });
      s.addShape("line", {
        x: G.mx + 2.6,
        y: y + 0.1,
        w: 0,
        h: h - 0.2,
        line: HAIRLINE,
      });
      s.addText(layer.items.join("   ·   "), {
        x: G.mx + 2.84,
        y,
        w: 3.9,
        h,
        ...mono({ fontSize: T.small, color: C.ink, valign: "middle" }),
      });
      s.addText(layer.note, {
        x: G.mx + 6.9,
        y,
        w: G.w - 7.24,
        h,
        ...sans({ fontSize: T.small, color: C.secondary, valign: "middle" }),
      });
    });
  });

  group(s, "facts", () => {
    const c = cols(3);
    ARCH.facts.forEach((f, i) => {
      s.addText(f.k, {
        x: c[i].x,
        y: 6.24,
        w: 1.0,
        h: 0.3,
        ...sans({ fontSize: 15, bold: true, valign: "middle" }),
      });
      s.addText(f.v, {
        x: c[i].x + 1.02,
        y: 6.24,
        w: c[i].w - 1.02,
        h: 0.3,
        ...sans({ fontSize: T.small, color: C.secondary, valign: "middle" }),
      });
    });
  });

  s.addNotes(NOTES.arch);
}

// ---------------------------------------------------------------------------
// A2 Roadmap
// ---------------------------------------------------------------------------

export function roadmap(s) {
  group(s, "head", () => {
    header(s, { ...ROADMAP, subWidth: 8.4 });
    docLink(s, ROADMAP.doc);
  });

  group(s, "done", () => {
    const y = G.bodyY;
    card(s, { x: G.mx, y, w: G.w, h: 0.6, fill: C.cardSubtle });
    s.addText("SHIPPED", {
      x: G.mx + 0.3,
      y,
      w: 1.0,
      h: 0.6,
      ...mono({
        fontSize: T.micro,
        bold: true,
        color: C.mute,
        charSpacing: 1.4,
        valign: "middle",
      }),
    });
    let x = G.mx + 1.36;
    ROADMAP.done.forEach((d) => {
      const w = 0.3 + d.length * 0.072;
      chip(s, { x, y: y + 0.17, text: d, w, fill: C.canvas });
      x += w + 0.16;
    });
  });

  const c = cols(5);
  ROADMAP.next.forEach((n, i) => {
    const row = Math.floor(i / 5);
    const col = i % 5;
    group(s, `rm${i}`, () => {
      const { x, w } = c[col];
      const y = 3.4 + row * 1.44;
      card(s, { x, y, w, h: 1.3 });
      s.addText(n.v, {
        x: x + 0.26,
        y: y + 0.18,
        w: w - 0.52,
        h: 0.24,
        ...mono({
          fontSize: T.small,
          bold: true,
          color: C.mute,
          valign: "middle",
        }),
      });
      s.addText(n.label, {
        x: x + 0.26,
        y: y + 0.44,
        w: w - 0.52,
        h: 0.28,
        ...sans({ fontSize: 12.5, bold: true, valign: "middle" }),
      });
      s.addShape("line", {
        x: x + 0.26,
        y: y + 0.76,
        w: w - 0.52,
        h: 0,
        line: HAIRLINE,
      });
      body(s, n.line, {
        x: x + 0.26,
        y: y + 0.86,
        w: w - 0.52,
        h: 0.36,
        size: T.small,
      });
    });
  });

  group(s, "facts", () =>
    body(s, ROADMAP.facts, {
      x: G.mx,
      y: 6.4,
      w: G.w,
      h: 0.3,
      size: T.small,
      color: C.ink,
    }),
  );
  s.addNotes(NOTES.roadmap);
}

// ---------------------------------------------------------------------------
// A3 Risks
// ---------------------------------------------------------------------------

export function risks(s) {
  group(s, "frame", () => {
    card(s, { x: G.mx, y: G.bodyY, w: G.w, h: 4.0 });
    ["Risk", "What it is", "What is already done"].forEach((h, i) => {
      s.addText(h.toUpperCase(), {
        x: G.mx + [0.34, 3.1, 7.7][i],
        y: G.bodyY + 0.14,
        w: 3.5,
        h: 0.26,
        ...mono({
          fontSize: T.micro,
          bold: true,
          charSpacing: 1.2,
          valign: "middle",
        }),
      });
    });
    s.addShape("line", {
      x: G.mx + 0.18,
      y: G.bodyY + 0.48,
      w: G.w - 0.36,
      h: 0,
      line: HAIRLINE,
    });
  });

  group(s, "head", () => {
    header(s, { ...RISKS, subWidth: 8.4 });
    docLink(s, RISKS.doc);
  });

  RISKS.rows.forEach((row, i) => {
    group(s, `risk${i}`, () => {
      const y = G.bodyY + 0.6 + i * 0.86;
      s.addText(row.risk, {
        x: G.mx + 0.34,
        y,
        w: 2.5,
        h: 0.34,
        ...sans({ fontSize: T.body, bold: true, valign: "top" }),
      });
      body(s, row.detail, {
        x: G.mx + 3.1,
        y,
        w: 4.34,
        h: 0.76,
        size: T.small,
      });
      body(s, row.answer, {
        x: G.mx + 7.7,
        y,
        w: G.w - 8.04,
        h: 0.76,
        size: T.small,
        color: C.ink,
      });
      if (i < RISKS.rows.length - 1) {
        s.addShape("line", {
          x: G.mx + 0.18,
          y: y + 0.78,
          w: G.w - 0.36,
          h: 0,
          line: HAIRLINE,
        });
      }
    });
  });

  s.addNotes(NOTES.risks);
}

// Order is the deck. Ten slides carry it; the appendix is numbered separately
// so nobody reads "12 of 13" and wonders what they missed.
export const DECK = [
  { id: "cover", draw: cover, bare: true },
  { id: "problem", draw: problem },
  { id: "demand", draw: demand },
  { id: "landscape", draw: landscape },
  { id: "product", draw: product },
  { id: "how", draw: how },
  { id: "security", draw: security },
  { id: "wedge", draw: wedge },
  { id: "market", draw: market },
  { id: "ask", draw: ask },
  { id: "architecture", draw: architecture, appendix: true },
  { id: "roadmap", draw: roadmap, appendix: true },
  { id: "risks", draw: risks, appendix: true },
];
