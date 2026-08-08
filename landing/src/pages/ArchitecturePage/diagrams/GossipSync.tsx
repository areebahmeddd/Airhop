import { Arrow, Box, INK, LINE, MONO, MUTED, SOFT } from "./primitives";

export function GossipSync() {
  return (
    <svg
      viewBox="0 0 920 280"
      className="h-auto w-full"
      role="img"
      aria-label="Gossip sync reconciliation using a GCS filter"
    >
      <Arrow id="gs-arrow" />
      <Box x={16} y={40} w={190} h={62} label="Phone A" sub="was out of range" strong />
      <Box x={714} y={40} w={190} h={62} label="Phone B" sub="stayed in the mesh" strong />

      <line x1={210} y1={132} x2={710} y2={132} stroke={LINE} markerEnd="url(#gs-arrow)" />
      <rect
        x={330}
        y={112}
        width={260}
        height={40}
        rx={2}
        fill="var(--dg-fill)"
        stroke={INK}
        strokeWidth={1.2}
      />
      <text
        x={460}
        y={130}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={11}
        fontWeight={600}
        fill={INK}
      >
        REQUEST_SYNC + GCS filter
      </text>
      <text x={460} y={144} textAnchor="middle" fontFamily={MONO} fontSize={9.5} fill={MUTED}>
        ~400 bytes describing 1000 packets
      </text>

      <line x1={710} y1={206} x2={214} y2={206} stroke={LINE} markerEnd="url(#gs-arrow)" />
      <rect
        x={330}
        y={186}
        width={260}
        height={40}
        rx={2}
        fill={SOFT}
        stroke={INK}
        strokeWidth={1.2}
      />
      <text
        x={460}
        y={204}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={11}
        fontWeight={600}
        fill={INK}
      >
        only what A is missing
      </text>
      <text x={460} y={218} textAnchor="middle" fontFamily={MONO} fontSize={9.5} fill={MUTED}>
        1% false positive rate, never a full resend
      </text>

      <text x={16} y={262} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Runs every 15 seconds, and 5 seconds after meeting a new peer. Never relayed, so it stays a
        conversation between neighbors.
      </text>
    </svg>
  );
}
