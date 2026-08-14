// Design tokens for the deck. Light half of landing/src/index.css, verbatim.
// Move a token there, move it here. PowerPoint takes hex without the hash.

export const C = {
  canvas: "FFFFFF",
  card: "FCFCFD",
  cardSubtle: "F9F9FB",
  inner: "F0F0F3",
  hover: "E8E8EC",
  line: "D9D9E0",
  lineStrong: "CDCED6",
  mute: "6E7178",
  secondary: "60646C",
  ink: "1C2024",
  relay: "2563EB",
  ok: "16A34A",
  alert: "DC2626",
};

// Segoe UI matches press/build.mjs. JetBrains Mono is the brand mono face but
// ships with the app and the site rather than with Windows, so the deck falls
// back to Consolas, which is installed everywhere PowerPoint is. Override with
// --sans and --mono if the presenting machine has the real face.
export const FONT = {
  sans: process.env.DECK_SANS || "Segoe UI",
  mono: process.env.DECK_MONO || "Consolas",
};

// 16:9, the only ratio a projector agrees with.
export const SLIDE = { w: 13.333, h: 7.5 };

export const G = {
  mx: 0.62, // side margin
  get w() {
    return SLIDE.w - this.mx * 2;
  },
  eyebrowY: 0.44,
  titleY: 0.72,
  titleGap: 0.16, // air between the title's last line and the subhead
  bodyY: 2.5, // fixed, so every slide's content starts on the same line
  bodyBottom: 6.72,
  ruleY: 6.92,
  footY: 6.99,
};

export const T = {
  display: 42,
  title: 27,
  titleLead: 1.06,
  sub: 13,
  subLead: 1.3,
  eyebrow: 9,
  body: 11,
  small: 9.5,
  micro: 8,
  stat: 33,
  statSm: 25,
};

// 1px at projector scale. Everything hairline, nothing heavy.
export const HAIRLINE = { color: C.line, width: 0.75 };
export const HAIRLINE_STRONG = { color: C.lineStrong, width: 0.75 };

// The landing's rounded-2xl in inches. PptxGenJS takes rectRadius in inches and
// converts it to the fraction of the shorter side that PowerPoint stores, so
// this is a length, not a ratio. A pill passes half its height.
const CORNER_IN = 0.11;
export function radius(w, h) {
  return Math.min(CORNER_IN, Math.min(w, h) / 2);
}

// landing/src/components/ui/PixelBird.tsx, same grid.
export const BIRD = [
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
];
