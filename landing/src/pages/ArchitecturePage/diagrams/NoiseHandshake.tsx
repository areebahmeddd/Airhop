import { Arrow, Box, INK, LINE, MONO, MUTED, SOFT } from "./primitives";

export function NoiseHandshake() {
  const msgs = [
    { y: 96, dir: 1, label: "e", note: "initiator ephemeral, in the clear" },
    { y: 152, dir: -1, label: "e, ee, s, es", note: "responder ephemeral + its static, encrypted" },
    { y: 208, dir: 1, label: "s, se", note: "initiator static, encrypted" },
  ];
  return (
    <svg
      viewBox="0 0 920 320"
      className="h-auto w-full"
      role="img"
      aria-label="Noise XX handshake, three messages"
    >
      <Arrow id="nh-arrow" />
      <Box x={90} y={20} w={180} h={48} label="Initiator" strong />
      <Box x={650} y={20} w={180} h={48} label="Responder" strong />
      <line x1={180} y1={72} x2={180} y2={268} stroke={LINE} strokeDasharray="3 4" />
      <line x1={740} y1={72} x2={740} y2={268} stroke={LINE} strokeDasharray="3 4" />
      {msgs.map((m, i) => (
        <g key={i}>
          <line
            x1={m.dir === 1 ? 184 : 736}
            y1={m.y}
            x2={m.dir === 1 ? 736 : 184}
            y2={m.y}
            stroke={INK}
            strokeWidth={1.3}
            markerEnd="url(#nh-arrow)"
          />
          <rect x={370} y={m.y - 30} width={180} height={26} rx={2} fill="var(--dg-fill)" />
          <text
            x={460}
            y={m.y - 12}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={12}
            fontWeight={700}
            fill={INK}
          >
            {m.label}
          </text>
          <text
            x={460}
            y={m.y + 16}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={9.5}
            fill={MUTED}
          >
            {m.note}
          </text>
        </g>
      ))}
      <rect
        x={280}
        y={252}
        width={360}
        height={40}
        rx={2}
        fill={SOFT}
        stroke={INK}
        strokeWidth={1.2}
      />
      <text
        x={460}
        y={270}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={11}
        fontWeight={600}
        fill={INK}
      >
        two directional keys, both sides authenticated
      </text>
      <text x={460} y={284} textAnchor="middle" fontFamily={MONO} fontSize={9.5} fill={MUTED}>
        Noise_XX_25519_ChaChaPoly_SHA256
      </text>
    </svg>
  );
}
