// Design tokens for Airhop v1.0.
//
// Monochromatic light palette. One interactive accent (near-black). Semantic
// colors used strictly for meaning, never decoration.
//
// Rule: if a color does not communicate information, it should not exist.

export const Colors = {
  // ---- Backgrounds ----------------------------------------------------------
  bg: "#F8F8F8", // off-white — screen background
  surface: "#FFFFFF", // cards, list rows, sheets
  surfaceRaised: "#F0F0F0", // inputs, segmented controls
  surfacePressed: "#E8E8E8", // pressed state background

  // ---- Borders --------------------------------------------------------------
  border: "#E4E4E4", // subtle dividers
  borderStrong: "#C8C8C8", // prominent borders

  // ---- Text -----------------------------------------------------------------
  textPrimary: "#111111", // headings, primary content
  textSecondary: "#666666", // supporting text
  textMuted: "#8A8A8A", // timestamps, placeholders, labels
  textInverse: "#FFFFFF", // text on near-black (accent) surfaces

  // ---- Interactive accent (single: near-black) ------------------------------
  // Everything interactive — buttons, active tabs, send, CTAs — uses near-black.
  // On a light canvas this is maximally legible and unambiguous.
  accent: "#111111",
  accentGhost: "rgba(17,17,17,0.05)", // subtle pressed/hover bg

  // ---- Message bubbles ------------------------------------------------------
  // My messages: near-black with white text (iMessage-style inversion).
  myBubble: "#111111",
  myBubbleText: "#FFFFFF",
  theirBubble: "#EBEBEB",

  // ---- Semantic (use only where meaning is conveyed) -----------------------
  online: "#16A34A", // peer is reachable
  offline: "#CCCCCC", // peer timed out
  syncing: "#D97706", // BLE scanning / Nostr reconnecting
  danger: "#DC2626", // destructive actions, panic wipe
  dangerDim: "rgba(220,38,38,0.08)",
  success: "#16A34A",

  // ---- Overlays -------------------------------------------------------------
  overlay: "rgba(0,0,0,0.45)",
} as const;

// Legacy shims so existing component references compile without change.
// These will be cleaned up in v2.0.
export const LegacyColors = {
  blue: Colors.accent,
  blueDim: Colors.accentGhost,
  indigo: Colors.textSecondary,
  indigoDim: Colors.surfaceRaised,
  green: Colors.online,
  greenDim: "rgba(22,163,74,0.10)",
  amber: Colors.syncing,
  amberDim: "rgba(217,119,6,0.10)",
  red: Colors.danger,
  redDim: Colors.dangerDim,
  purple: Colors.textSecondary,
  purpleDim: Colors.surfaceRaised,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
  "4xl": 64,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  "2xl": 30,
  "3xl": 38,
} as const;

export const FontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  "2xl": 28,
  full: 999,
} as const;

// Muted avatar colors — used only for identity circles.
// Deeper palette for adequate contrast on light backgrounds.
const AVATAR_PALETTE = [
  "#3B5CE0", // indigo
  "#0D8FA3", // teal
  "#1A8C63", // sage
  "#C67830", // sand
  "#9B44C2", // purple
  "#B83232", // rose
  "#4A6EC4", // cornflower
  "#4A7840", // olive
] as const;

export function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}
