import { INK, LINE, MONO, MUTED, SOFT } from "./primitives";

export function FloodPropagation() {
  const nodes = [
    { x: 70, y: 150, ttl: "7", label: "you", sub: "" },
    { x: 250, y: 80, ttl: "6", label: "", sub: "" },
    { x: 250, y: 220, ttl: "6", label: "", sub: "" },
    { x: 440, y: 150, ttl: "5", label: "", sub: "" },
    { x: 630, y: 80, ttl: "4", label: "", sub: "" },
    { x: 630, y: 220, ttl: "4", label: "", sub: "" },
    { x: 820, y: 150, ttl: "", label: "them", sub: "arrives with 4 unspent" },
  ];
  const edges = [
    { a: 0, b: 1, dup: false },
    { a: 0, b: 2, dup: false },
    { a: 1, b: 3, dup: false },
    { a: 2, b: 3, dup: true },
    { a: 3, b: 4, dup: false },
    { a: 3, b: 5, dup: false },
    { a: 4, b: 6, dup: false },
    { a: 5, b: 6, dup: true },
  ];
  return (
    <svg
      viewBox="0 0 900 320"
      className="h-auto w-full"
      role="img"
      aria-label="A message flooding across the mesh, spending one hop at each phone, with duplicate copies dropped where paths rejoin"
    >
      <style>{`
        @keyframes floodPulse { 0%,100% { opacity: .25 } 50% { opacity: 1 } }
        .flood-edge { animation: floodPulse 3s ease-in-out infinite; }
      `}</style>
      {edges.map((e, i) => {
        const from = nodes[e.a];
        const to = nodes[e.b];
        const t = 0.74;
        const mx = from.x + (to.x - from.x) * t;
        const my = from.y + (to.y - from.y) * t;
        return (
          <g key={i}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={e.dup ? LINE : INK}
              strokeWidth={1.2}
              strokeDasharray="4 4"
              className="flood-edge"
              style={{ animationDelay: `${i * 0.22}s` }}
            />
            {e.dup && (
              <g stroke={MUTED} strokeWidth={1.4} strokeLinecap="round">
                <line x1={mx - 5} y1={my - 5} x2={mx + 5} y2={my + 5} />
                <line x1={mx - 5} y1={my + 5} x2={mx + 5} y2={my - 5} />
              </g>
            )}
          </g>
        );
      })}
      {nodes.map((n, i) => {
        const isEnd = i === 6;
        return (
          <g key={i}>
            <circle
              cx={n.x}
              cy={n.y}
              r={26}
              fill={isEnd ? INK : i === 0 ? SOFT : "var(--dg-fill)"}
              stroke={INK}
              strokeWidth={i === 0 || isEnd ? 1.8 : 1.2}
            />
            {n.ttl && (
              <text
                x={n.x}
                y={n.y + 5}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize={13}
                fontWeight={700}
                fill={INK}
              >
                {n.ttl}
              </text>
            )}
            {n.label && (
              <text
                x={n.x}
                y={n.y + 46}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize={10}
                fill={MUTED}
              >
                {n.label}
              </text>
            )}
            {n.sub && (
              <text
                x={n.x}
                y={n.y + 61}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize={9}
                fill={MUTED}
              >
                {n.sub}
              </text>
            )}
          </g>
        );
      })}
      <text x={450} y={286} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={MUTED}>
        The number is the hop budget stamped on the packet as it leaves that phone.
      </text>
      <text x={450} y={302} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={MUTED}>
        ✕ is a second copy reaching a phone that already forwarded, so it is dropped.
      </text>
    </svg>
  );
}
