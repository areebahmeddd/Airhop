import { Arrow, FILL, INK, LINE, MONO, MUTED, SOFT } from "./primitives";

export function ModuleMap() {
  const layers = [
    { label: "src/ui", sub: "shared components, theme tokens. Renders, decides nothing." },
    { label: "src/features", sub: "chat · discovery · wallet · contacts · settings · onboarding" },
    {
      label: "src/store",
      sub: "Zustand slices persisted to MMKV. wallet-store is AES-256 encrypted.",
    },
    {
      label: "src/services",
      sub: "mesh-service owns the radios. wallet-service is the only caller of a mint.",
    },
    {
      label: "src/core",
      sub: "crypto · mesh · nostr · payments · router. Pure TypeScript, no native imports.",
    },
    { label: "src/bridge", sub: "TurboModule specs. The only place native and TypeScript meet." },
    {
      label: "ios/ · android/",
      sub: "Swift and Kotlin. Advertise, scan, read bytes, write bytes. Nothing else.",
    },
  ];
  return (
    <svg viewBox="0 0 920 416" className="h-auto w-full" role="img" aria-label="Module layering">
      <Arrow id="mm-arrow" />
      {layers.map((l, i) => {
        const y = 16 + i * 54;
        const core = l.label === "src/core";
        return (
          <g key={i}>
            <rect
              x={70}
              y={y}
              width={790}
              height={44}
              rx={2}
              fill={core ? SOFT : FILL}
              stroke={core ? INK : LINE}
              strokeWidth={core ? 1.5 : 1}
            />
            <text x={90} y={y + 27} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
              {l.label}
            </text>
            <text x={250} y={y + 27} fontFamily={MONO} fontSize={10} fill={MUTED}>
              {l.sub}
            </text>
          </g>
        );
      })}
      <line
        x1={40}
        y1={24}
        x2={40}
        y2={380}
        stroke={LINE}
        strokeWidth={1.2}
        markerEnd="url(#mm-arrow)"
      />
      <text
        x={30}
        y={200}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={9}
        fontWeight={700}
        fill={MUTED}
        letterSpacing="0.18em"
        transform="rotate(-90 30 200)"
      >
        DEPENDS ON
      </text>
      <text x={70} y={404} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Every arrow points down and none point back up. A layer never imports from the one above it.
      </text>
    </svg>
  );
}
