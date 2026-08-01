// Mirror of src/ui/theme.ts, copied verbatim. Move a token there, move it here.

export const LIGHT = {
  bg: "#F8F8F8",
  surface: "#FFFFFF",
  surfaceRaised: "#F0F0F0",
  surfacePressed: "#E8E8E8",
  border: "#E4E4E4",
  borderStrong: "#C8C8C8",
  textPrimary: "#111111",
  textSecondary: "#565656",
  textMuted: "#6F6F6F",
  textInverse: "#FFFFFF",
  accent: "#111111",
  myBubble: "#111111",
  myBubbleText: "#FFFFFF",
  theirBubble: "#EBEBEB",
  online: "#16A34A",
  offline: "#909090",
  danger: "#DC2626",
  dangerDim: "rgba(220,38,38,0.08)",
  e2ee: "#16A34A",
  verified: "#2563EB",
  relay: "#2563EB",
  relayDim: "rgba(37,99,235,0.09)",
  // Panel chrome. Not app tokens: the canvas the phone sits on.
  panelBg: "#EDEDED",
  panelDot: "#E1E1E1",
  panelText: "#111111",
  panelSub: "#565656",
  panelMuted: "#8A8A8A",
  bezel: "#111111",
  bezelEdge: "#2E2E2E",
};

export const DARK = {
  bg: "#0B0B0B",
  surface: "#161616",
  surfaceRaised: "#1F1F1F",
  surfacePressed: "#2A2A2A",
  border: "#2A2A2A",
  borderStrong: "#3D3D3D",
  textPrimary: "#F5F5F5",
  textSecondary: "#A6A6A6",
  textMuted: "#787878",
  textInverse: "#111111",
  accent: "#F5F5F5",
  myBubble: "#F5F5F5",
  myBubbleText: "#111111",
  theirBubble: "#232323",
  online: "#22C55E",
  offline: "#6A6A6A",
  danger: "#EF4444",
  dangerDim: "rgba(239,68,68,0.15)",
  e2ee: "#22C55E",
  verified: "#3B82F6",
  relay: "#3B82F6",
  relayDim: "rgba(59,130,246,0.16)",
  panelBg: "#0B0B0B",
  panelDot: "#1A1A1A",
  panelText: "#F5F5F5",
  panelSub: "#A6A6A6",
  panelMuted: "#787878",
  // Lifted off the app's border token: on a near-black canvas the device
  // silhouette has to be visible or the screen looks like it is floating.
  bezel: "#1C1C1C",
  bezelEdge: "#4F4F4F",
};

const AVATAR_PALETTE = [
  "#3B5CE0",
  "#0D8FA3",
  "#1A8C63",
  "#C67830",
  "#9B44C2",
  "#B83232",
  "#4A6EC4",
  "#4A7840",
];

// Same hash as src/ui/theme.ts, so a peer ID lands on the app's colour for it.
export function avatarColor(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

export function withAlpha(hex, alpha) {
  const clamped = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
  return `${hex}${clamped.toString(16).padStart(2, "0")}`;
}

export function cssVars(tokens) {
  return Object.entries(tokens)
    .map(([k, v]) => `--${k}:${v};`)
    .join("");
}
