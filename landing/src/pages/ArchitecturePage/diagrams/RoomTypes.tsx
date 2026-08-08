import { Caption, FILL, INK, LINE, MONO, MUTED, SOFT } from "./primitives";

export function RoomTypes() {
  const rooms = [
    { t: "Public channel", k: "no key", w: "anyone in range", r: "mesh only" },
    { t: "Location channel", k: "no key", w: "anyone in the cell", r: "mesh + internet" },
    {
      t: "Private channel",
      k: "key in the invite link",
      w: "anyone with the link",
      r: "mesh, optionally internet",
    },
    { t: "Private group", k: "epoch key over Noise", w: "signed roster, max 16", r: "mesh only" },
  ];
  return (
    <svg
      viewBox="0 0 920 250"
      className="h-auto w-full"
      role="img"
      aria-label="The four room types compared"
    >
      {rooms.map((r, i) => {
        const x = 12 + i * 228;
        return (
          <g key={i}>
            <rect
              x={x}
              y={16}
              width={212}
              height={196}
              rx={2}
              fill={i > 1 ? SOFT : FILL}
              stroke={INK}
              strokeWidth={i > 1 ? 1.5 : 1}
            />
            <text x={x + 16} y={44} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
              {r.t}
            </text>
            <line x1={x + 16} y1={56} x2={x + 196} y2={56} stroke={LINE} />
            <Caption x={x + 16} y={78}>
              KEY
            </Caption>
            <text x={x + 16} y={98} fontFamily={MONO} fontSize={10} fill={MUTED}>
              {r.k}
            </text>
            <Caption x={x + 16} y={128}>
              WHO GETS IN
            </Caption>
            <text x={x + 16} y={148} fontFamily={MONO} fontSize={10} fill={MUTED}>
              {r.w}
            </text>
            <Caption x={x + 16} y={178}>
              REACH
            </Caption>
            <text x={x + 16} y={198} fontFamily={MONO} fontSize={10} fill={MUTED}>
              {r.r}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
