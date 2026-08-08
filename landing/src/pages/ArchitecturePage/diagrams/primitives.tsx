export const INK = "var(--dg-ink)";
export const MUTED = "var(--dg-mute)";
export const LINE = "var(--dg-line)";
export const FILL = "var(--dg-fill)";
export const SOFT = "var(--dg-soft)";
export const MONO = "JetBrains Mono, ui-monospace, monospace";

export function Arrow({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
      </marker>
    </defs>
  );
}

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  strong?: boolean;
  dashed?: boolean;
}

export function Box({ x, y, w, h, label, sub, strong, dashed }: BoxProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={2}
        fill={strong ? SOFT : FILL}
        stroke={strong ? INK : LINE}
        strokeWidth={strong ? 1.5 : 1}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 4 : y + h / 2 + 4}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={11.5}
        fontWeight={600}
        fill={INK}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 12}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={9.5}
          fill={MUTED}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export function Caption({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={MONO}
      fontSize={9}
      fontWeight={700}
      fill={MUTED}
      letterSpacing="0.18em"
    >
      {children}
    </text>
  );
}
