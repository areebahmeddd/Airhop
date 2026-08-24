// Design tokens.
//
// Monochromatic light palette. One interactive accent (near-black). Semantic
// colors used strictly for meaning, never decoration.
//
// Rule: if a color does not communicate information, it should not exist.

import { useSettingsStore, type ThemePreference } from "@store/settings-store";
import { useMemo } from "react";
import { useColorScheme, type ColorSchemeName } from "react-native";
import { MONO_FONTS } from "./fonts";

export const Colors = {
  // ---- Backgrounds ----
  bg: "#F8F8F8", // off-white screen background
  surface: "#FFFFFF", // cards, list rows, sheets
  surfaceRaised: "#F0F0F0", // inputs, segmented controls
  surfacePressed: "#E8E8E8", // pressed state background

  // ---- Borders ----
  border: "#E4E4E4", // subtle dividers
  borderStrong: "#C8C8C8", // prominent borders

  // ---- Text ----
  // The three greys are contrast-checked against both light surfaces they ever
  // sit on (bg #F8F8F8 and surface #FFFFFF) at the smallest size each is used
  // at, so every one of them clears WCAG 2.2 AA (4.5:1) for normal text.
  // Ratios against #F8F8F8, the worse of the two:
  //   textPrimary   #111111  ->  17.4:1  (AAA)
  //   textSecondary #565656  ->   7.0:1  (AAA)
  //   textMuted     #6F6F6F  ->   4.8:1  (AA)
  // Lighter greys fail: a #666666 / #8A8A8A pair puts every timestamp, scope
  // line, placeholder and section label at 3.2:1, under AA. Darken rather than
  // restructure, keeping the same hue and the same three-step hierarchy.
  textPrimary: "#111111", // headings, primary content
  textSecondary: "#565656", // supporting text
  textMuted: "#6F6F6F", // timestamps, placeholders, labels
  textInverse: "#FFFFFF", // text on near-black (accent) surfaces
  //
  // A dismiss action (Cancel, Close) uses textPrimary, never textMuted: a
  // muted label on a filled pill reads as disabled rather than as the quieter
  // of two choices. Applies to every sheet, the scanner and the alert buttons.

  // ---- Interactive accent ----
  // One accent only. Buttons, active tabs, send, CTAs. Near-black is maximally
  // legible on a light canvas and unambiguous.
  accent: "#111111",
  accentGhost: "rgba(17,17,17,0.05)", // subtle pressed/hover bg

  // ---- Selection ----
  // Highlight behind selected text in an input. Never `accent`: that is a solid
  // near-black, and a text field paints the selection as an opaque block behind
  // the glyphs, so selecting a whole message hid the text under a slab. Enough
  // alpha to show the run, little enough to keep every glyph readable.
  selection: "rgba(17,17,17,0.18)",

  // ---- Message bubbles ----
  // My messages: near-black with white text (iMessage-style inversion).
  myBubble: "#111111",
  myBubbleText: "#FFFFFF",
  theirBubble: "#EBEBEB",

  // ---- Semantic ----
  // Only where meaning is conveyed, never for decoration.
  online: "#16A34A", // peer is reachable
  // A status dot is a meaningful UI indicator, so it owes 3:1 against its own
  // background (WCAG 1.4.11). A pale #CCCCCC measures 1.6:1 on a white row and
  // cannot be seen, which makes "this peer has gone quiet" unreadable at exactly
  // the size it matters most.
  offline: "#909090", // peer timed out
  syncing: "#D97706", // BLE scanning / Nostr reconnecting
  syncingDim: "rgba(217,119,6,0.10)", // caution banner bg (location off)
  danger: "#DC2626", // destructive actions, panic wipe
  dangerDim: "rgba(220,38,38,0.08)",
  success: "#16A34A",

  // ---- Trust indicators ----
  // The only two colors security UI may use. Green means end-to-end encrypted
  // and blue means a verified contact, never anything else, so a green padlock
  // always reads as "encrypted" and a blue shield as "verified".
  e2ee: "#16A34A", // padlock + "end-to-end encrypted" text
  verified: "#2563EB", // verified-contact shield/badge

  // ---- Mesh-status banner accents ----
  // Each hue names a distinct network state so the Mesh tab reads at a glance.
  // Every -Dim is the same hue at low alpha.
  relay: "#2563EB", // traffic carried over the internet (Nostr relay)
  relayDim: "rgba(37,99,235,0.09)",
  tor: "#7C3AED", // onion-routed internet traffic (Tor)
  torDim: "rgba(124,58,237,0.09)",
  gateway: "#0D9488", // this device relaying for offline peers (gateway)
  gatewayDim: "rgba(13,148,136,0.09)",
  bridge: "#4F46E5", // public mesh chat stitched across islands (bridge)
  bridgeDim: "rgba(79,70,229,0.09)",

  // ---- Overlays ----
  overlay: "rgba(0,0,0,0.45)",
} as const;

// Dark variant, same keys as Colors so a screen swaps the whole palette by
// swapping which object it reads. Screens reach it through useThemeColors()
// below rather than importing either palette directly, which is what makes the
// theme setting apply everywhere.
export const DarkColors = {
  // ---- Backgrounds ----
  bg: "#0B0B0B",
  surface: "#161616",
  surfaceRaised: "#1F1F1F",
  surfacePressed: "#2A2A2A",

  // ---- Borders ----
  border: "#2A2A2A",
  borderStrong: "#3D3D3D",

  // ---- Text ----
  textPrimary: "#F5F5F5",
  textSecondary: "#A6A6A6",
  textMuted: "#787878",
  textInverse: "#111111",

  // ---- Interactive accent ----
  accent: "#F5F5F5",
  accentGhost: "rgba(245,245,245,0.08)",
  // ---- Selection ----
  // Heavier than the light palette's: a pale wash on a near-black canvas reads
  // fainter than the same alpha of black on white.
  selection: "rgba(245,245,245,0.24)",

  // ---- Message bubbles ----
  myBubble: "#F5F5F5",
  myBubbleText: "#111111",
  theirBubble: "#232323",

  // ---- Semantic ----
  online: "#22C55E",
  // Same 3:1 non-text floor as the light palette (see Colors.offline).
  offline: "#6A6A6A",
  syncing: "#F59E0B",
  syncingDim: "rgba(245,158,11,0.16)",
  danger: "#EF4444",
  dangerDim: "rgba(239,68,68,0.15)",
  success: "#22C55E",

  // ---- Trust indicators ----
  // Same meanings as the light palette: green = e2ee, blue = verified.
  e2ee: "#22C55E",
  verified: "#3B82F6",

  // ---- Mesh-status banner accents ----
  // Brighter hues for the dark canvas, and every -Dim carries more alpha to stay
  // visible on near-black.
  relay: "#3B82F6",
  relayDim: "rgba(59,130,246,0.16)",
  tor: "#8B5CF6",
  torDim: "rgba(139,92,246,0.16)",
  gateway: "#14B8A6",
  gatewayDim: "rgba(20,184,166,0.16)",
  bridge: "#6366F1",
  bridgeDim: "rgba(99,102,241,0.16)",

  // ---- Overlays ----
  overlay: "rgba(0,0,0,0.6)",
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

// Bottom clearance a scrollable tab screen must leave so its last rows clear the
// floating (absolutely positioned) tab bar instead of scrolling under it. Sized
// to the pill's height + its bottom margin + a little breathing room. Screens
// apply it as contentContainer paddingBottom.
export const TAB_BAR_CLEARANCE = 96;

export const FontSize = {
  // Floor of the scale. Only for glyph-sized text inside a fixed circle or
  // track: unread counts, the radar's ring labels. Anything a user has to READ
  // starts at `xs`. Nothing goes below this: a 9pt digit is illegible on a
  // dense screen and has no token to justify itself.
  "2xs": 10,
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  "2xl": 30,
  "3xl": 38,
} as const;

// Caps for OS text scaling, applied via `maxFontSizeMultiplier`.
//
// Body copy is left uncapped: someone who has turned text size up wants their
// messages bigger, and every list row in this app grows to fit. The caps exist
// only for text living inside a fixed-size container that cannot grow with it,
// where uncapped scaling does not aid legibility, it clips the glyph or bursts
// the shape. Each one names the container it is protecting.
export const MaxFontScale = {
  // Labels inside fixed chrome: tab bar labels, segmented-control text.
  chrome: 1.4,
  // Digits inside a 15-18pt badge circle, and the radar's ring labels.
  badge: 1.2,
} as const;

// Shared motion durations, in ms. One vocabulary so a list reorder, a sheet
// dismissal and a toast fade read as the same app moving rather than three
// components each guessing.
//
// Anything built on these must also respect the OS "reduce motion" switch. Use
// reanimated's `useReducedMotion()` at the call site (WCAG 2.3.3).
export const Duration = {
  base: 180, // fades, enters
  slow: 220, // sheet dismiss, list reorder
  // How long a pull-to-refresh spinner is held. The refresh itself (a BLE
  // rescan kick) returns instantly, and a flash-then-gone spinner reads as
  // broken, so it is held briefly for legible feedback.
  refreshSpinner: 700,
} as const;

export const FontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

// Monospace family for keys, geohashes, IDs, and wallet amounts. Points at the
// bundled JetBrains Mono (loaded in App.tsx); if the font ever fails to load,
// the platform substitutes its own monospace, so text never disappears.
export const FontFamily = {
  // Resolved live from the user's Appearance choice via the single MONO_FONTS
  // table (one source of truth, so adding a font can't mismap here). Read at
  // style-build time; useThemeColors below recomputes styles when it changes.
  get mono(): string {
    return MONO_FONTS[useSettingsStore.getState().monoFont].family;
  },
};

export const Radius = {
  // The cap on a hairline track: progress bars, waveform bars, the sheet's grab
  // handle. Named so a dozen call sites cannot each pick their own. Anything
  // meant to be a CIRCLE uses `full`, never a hand-halved size.
  xs: 2,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  "2xl": 28,
  full: 999,
} as const;

// One value for "this control is inactive", so header pills, sheet confirms and
// settings switches cannot drift apart. 0.4 is the floor at which a glyph still
// reads as a shape
// (so the control's affordance survives) while clearly not inviting a tap.
// WCAG exempts inactive controls from the 4.5:1 text rule (1.4.3), which is why
// this is allowed to be a dim rather than a colour change, but every disabled
// control also carries accessibilityState.disabled so it is never dim ALONE.
export const DISABLED_OPACITY = 0.4;

// The press treatment for a surface with nothing neutral to darken: an accent
// button, whose fill IS the accent so darkening it would mean recolouring the
// label too, and a bare icon and label such as a tab or a segment. Everything
// else darkens to Colors.surfacePressed instead. Applied through Pressable's
// style callback.
export const PRESSED_OPACITY = 0.85;

// Under RN's 500ms default, which is tuned for a rare secondary menu rather
// than the message actions this opens. Callers pair it with haptics.held(): a
// hold is the only gesture with no visible progress.
export const LONG_PRESS_MS = 320;

// The smallest tappable square either platform accepts: 44pt (Apple HIG) and
// 48dp (Material) round to the same practical floor, and WCAG 2.2 AA asks for
// 24x24 minimum with 44x44 as the AAA target. Every Pressable in the app either
// measures at least this, or carries `hitSlopFor(visualSize)` to reach it.
export const MIN_TOUCH = 44;

// Full-width buttons: sheet confirm/cancel pairs, alert actions, the onboarding
// CTA. Past MIN_TOUCH because these are stacked commitments, several of them
// destructive, so there is no adjacency to resolve and the height is free.
export const BUTTON_HEIGHT = 50;

// The default padding around a control that is already comfortably sized and
// only wants a little forgiveness (a row's trailing glyph, an inline link).
export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;

// Grow a deliberately small control's touch area to MIN_TOUCH without changing
// how it looks. A 32pt header icon stays 32pt on screen and 44pt to a thumb.
export function hitSlopFor(visualSize: number): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  const pad = Math.max(0, Math.round((MIN_TOUCH - visualSize) / 2));
  return { top: pad, bottom: pad, left: pad, right: pad };
}

// Elevation, as three steps rather than a hand-tuned shadow per component.
//
// Shadows are near-invisible on a dark canvas (black on #0B0B0B), so anything
// that relies on one for separation must also carry a hairline border. Both the
// tab bar and the transfer pill do.
export const Shadow = {
  // A control lifted off the track it sits in (segmented-control thumb).
  low: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  // A pill floating over content (transfer badge, jump-to-latest).
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  // Persistent floating chrome (the tab bar).
  high: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;

// Identity circles only. Deep enough for adequate contrast on light surfaces.
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

// Tint an opaque #RRGGBB token with an alpha, e.g. withAlpha(accent, 0.08).
//
// Never by string concatenation (`color + "22"`): a magic hex pair reads as
// nothing, and it produces garbage when the input is shorthand or already
// carries an alpha channel.
export function withAlpha(hex: string, alpha: number): string {
  const clamped = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
  return `${hex}${clamped.toString(16).padStart(2, "0")}`;
}

export function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

// The two palettes the app actually has. The preference can also be "system",
// which is not a palette but the absence of a choice; everything downstream of
// resolveTheme() deals in this pair only.
export type ResolvedTheme = "light" | "dark";

// Shared by useThemeColors() and useResolvedTheme() so both always agree on
// which mode is active. "system" is the absence of a choice, resolved here.
function resolveTheme(
  preference: ThemePreference,
  systemScheme: ColorSchemeName,
): ResolvedTheme {
  return preference === "system"
    ? systemScheme === "dark"
      ? "dark"
      : "light"
    : preference;
}

// The palette for the active mode. Re-renders when the preference, the OS
// scheme, or the mono-font choice changes.
export function useThemeColors(): Record<keyof typeof Colors, string> {
  const preference = useSettingsStore((s) => s.theme);
  // Part of the identity on purpose: it does not change the palette, but a fresh
  // object forces every memoized style to recompute and re-read FontFamily.mono,
  // so a font change applies live like a theme switch.
  const monoFont = useSettingsStore((s) => s.monoFont);
  const systemScheme = useColorScheme();
  const base =
    resolveTheme(preference, systemScheme) === "dark" ? DarkColors : Colors;
  return useMemo(() => {
    void monoFont;
    return { ...base };
  }, [base, monoFont]);
}

// Same resolution as useThemeColors(), but returns just "light" | "dark",
// for callers that need the mode itself (e.g. StatusBar's `style` prop)
// rather than the palette.
export function useResolvedTheme(): ResolvedTheme {
  const preference = useSettingsStore((s) => s.theme);
  const systemScheme = useColorScheme();
  return resolveTheme(preference, systemScheme);
}
