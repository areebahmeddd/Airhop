import { Arrow, Box, INK, LINE, MONO, MUTED, SOFT } from "./primitives";

export function Fragmentation() {
  return (
    <svg
      viewBox="0 0 920 260"
      className="h-auto w-full"
      role="img"
      aria-label="File fragmentation and reassembly"
    >
      <Arrow id="fr-arrow" />
      <Box x={16} y={96} w={150} h={64} label="1 MiB file" sub="image, voice, any type" strong />
      <line x1={170} y1={128} x2={214} y2={128} stroke={LINE} markerEnd="url(#fr-arrow)" />
      <Box x={218} y={96} w={140} h={64} label="split" sub="467 bytes each" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={392 + i * 34}
          y={110}
          width={26}
          height={36}
          rx={2}
          fill={SOFT}
          stroke={INK}
          strokeWidth={1.2}
        />
      ))}
      <text x={568} y={132} fontFamily={MONO} fontSize={15} fontWeight={700} fill={MUTED}>
        ...
      </text>
      <line x1={362} y1={128} x2={388} y2={128} stroke={LINE} markerEnd="url(#fr-arrow)" />
      <line x1={596} y1={128} x2={640} y2={128} stroke={LINE} markerEnd="url(#fr-arrow)" />
      <Box x={644} y={96} w={140} h={64} label="reassemble" sub="128 slots, 30 s timeout" />
      <line x1={788} y1={128} x2={824} y2={128} stroke={LINE} markerEnd="url(#fr-arrow)" />
      <Box x={828} y={96} w={78} h={64} label="file" strong />
      <text
        x={392}
        y={94}
        fontFamily={MONO}
        fontSize={9}
        fontWeight={700}
        fill={MUTED}
        letterSpacing="0.18em"
      >
        ONE FRAGMENT EVERY 25 ms
      </text>
      <text x={16} y={210} fontFamily={MONO} fontSize={10} fill={MUTED}>
        The 25 ms pacing is not a throttle for politeness. Without it the radio drops fragments and
        the transfer never completes.
      </text>
      <text x={16} y={230} fontFamily={MONO} fontSize={10} fill={MUTED}>
        467 payload bytes every 25 ms is where the ~18 KiB/s figure comes from, so 1 MiB takes 56
        seconds.
      </text>
    </svg>
  );
}
