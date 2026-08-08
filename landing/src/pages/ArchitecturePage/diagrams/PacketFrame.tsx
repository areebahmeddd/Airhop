import { Caption, FILL, INK, LINE, MONO, MUTED, SOFT } from "./primitives";

export function PacketFrame() {
  const fixed = [
    { w: 44, label: "ver", sub: "1" },
    { w: 44, label: "type", sub: "1" },
    { w: 44, label: "ttl", sub: "1" },
    { w: 116, label: "timestamp", sub: "8, ms" },
    { w: 52, label: "flags", sub: "1" },
    { w: 100, label: "payloadLen", sub: "4" },
  ];
  const variable = [
    { w: 104, label: "senderID", sub: "8", solid: true },
    { w: 116, label: "recipientID", sub: "8, optional" },
    { w: 96, label: "route", sub: "optional" },
    { w: 150, label: "payload", sub: "payloadLen", solid: true },
    { w: 118, label: "signature", sub: "64, Ed25519" },
  ];
  let fx = 16;
  let vx = 16;
  return (
    <svg
      viewBox="0 0 920 250"
      className="h-auto w-full"
      role="img"
      aria-label="Packet frame byte layout"
    >
      <Caption x={16} y={22}>
        FIXED HEADER · 16 BYTES
      </Caption>
      {fixed.map((f, i) => {
        const x = fx;
        fx += f.w + 4;
        return (
          <g key={i}>
            <rect
              x={x}
              y={32}
              width={f.w}
              height={54}
              rx={2}
              fill={SOFT}
              stroke={INK}
              strokeWidth={1.2}
            />
            <text
              x={x + f.w / 2}
              y={56}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={11}
              fontWeight={600}
              fill={INK}
            >
              {f.label}
            </text>
            <text
              x={x + f.w / 2}
              y={72}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={9.5}
              fill={MUTED}
            >
              {f.sub}
            </text>
          </g>
        );
      })}
      <Caption x={16} y={124}>
        VARIABLE SECTIONS · IN THIS ORDER
      </Caption>
      {variable.map((v, i) => {
        const x = vx;
        vx += v.w + 4;
        return (
          <g key={i}>
            <rect
              x={x}
              y={134}
              width={v.w}
              height={54}
              rx={2}
              fill={v.solid ? SOFT : FILL}
              stroke={v.solid ? INK : LINE}
              strokeWidth={v.solid ? 1.2 : 1}
              strokeDasharray={v.solid ? undefined : "4 3"}
            />
            <text
              x={x + v.w / 2}
              y={158}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={11}
              fontWeight={600}
              fill={INK}
            >
              {v.label}
            </text>
            <text
              x={x + v.w / 2}
              y={174}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={9.5}
              fill={MUTED}
            >
              {v.sub}
            </text>
          </g>
        );
      })}
      <text x={16} y={218} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Solid boxes are always present. Dashed boxes appear only when the matching flag bit is set.
      </text>
      <text x={16} y={236} fontFamily={MONO} fontSize={10} fill={MUTED}>
        The signature is computed over the packet re-encoded with ttl=0, so any relay can decrement
        the hop count without breaking it.
      </text>
    </svg>
  );
}
