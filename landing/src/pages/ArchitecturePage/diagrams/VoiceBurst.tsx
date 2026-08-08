import { Arrow, Box, Caption, INK, LINE, MONO, MUTED, SOFT } from "./primitives";

export function VoiceBurst() {
  return (
    <svg
      viewBox="0 0 920 300"
      className="h-auto w-full"
      role="img"
      aria-label="Live voice frames batched into bursts and played through a jitter buffer"
    >
      <Arrow id="vb-arrow" />
      <Caption x={16} y={24}>
        WHILE YOU ARE STILL TALKING
      </Caption>
      <Box x={16} y={36} w={128} h={60} label="mic" sub="AAC-LC 16 kHz" strong />
      <line x1={148} y1={66} x2={186} y2={66} stroke={LINE} markerEnd="url(#vb-arrow)" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={190 + i * 34}
            y={48}
            width={26}
            height={36}
            rx={2}
            fill={SOFT}
            stroke={INK}
            strokeWidth={1.2}
          />
        </g>
      ))}
      <text x={332} y={70} fontFamily={MONO} fontSize={13} fontWeight={700} fill={MUTED}>
        ...
      </text>
      <text x={190} y={104} fontFamily={MONO} fontSize={9.5} fill={MUTED}>
        64 ms each, about 130 bytes
      </text>
      <line x1={360} y1={66} x2={398} y2={66} stroke={LINE} markerEnd="url(#vb-arrow)" />
      <Box x={402} y={36} w={186} h={60} label="burst packet" sub="210 bytes, never fragmented" />
      <line x1={592} y1={66} x2={630} y2={66} stroke={LINE} markerEnd="url(#vb-arrow)" />
      <Box x={634} y={36} w={140} h={60} label="jitter buffer" sub="350 ms" />
      <line x1={778} y1={66} x2={816} y2={66} stroke={LINE} markerEnd="url(#vb-arrow)" />
      <Box x={820} y={36} w={86} h={60} label="ear" strong />

      <Caption x={16} y={166}>
        WHEN YOU LET GO
      </Caption>
      <Box
        x={16}
        y={178}
        w={200}
        h={60}
        label="finalized voice note"
        sub="the same audio as a file"
        strong
      />
      <line x1={220} y1={208} x2={402} y2={208} stroke={LINE} markerEnd="url(#vb-arrow)" />
      <Box
        x={406}
        y={178}
        w={228}
        h={60}
        label="sent every time"
        sub="even if the live burst worked"
      />
      <line x1={638} y1={208} x2={676} y2={208} stroke={LINE} markerEnd="url(#vb-arrow)" />
      <Box
        x={680}
        y={178}
        w={226}
        h={60}
        label="late joiners catch up"
        sub="and old clients still hear it"
      />

      <text x={16} y={272} fontFamily={MONO} fontSize={10} fill={MUTED}>
        The two paths are not alternatives. Live frames give you sub-second audio; the note that
        follows is what makes delivery
      </text>
      <text x={16} y={288} fontFamily={MONO} fontSize={10} fill={MUTED}>
        reliable. If the note arrives after a complete burst it silently replaces the partial file,
        with no second message.
      </text>
    </svg>
  );
}
