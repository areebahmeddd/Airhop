import { Arrow, Box, INK, LINE, MONO, MUTED, SOFT } from "./primitives";

export function RouterLadder() {
  const rungs = [
    {
      n: "1",
      label: "Direct link",
      note: "BLE mesh, or WiFi if a link exists",
      cond: "a Noise session with them is already open",
      res: "encrypted and sent straight to them",
    },
    {
      n: "2",
      label: "Nostr DM",
      note: "NIP-17 gift wrap",
      cond: "their Nostr key is known and you are online",
      res: "goes over the internet, shown as pending",
    },
    {
      n: "3",
      label: "Courier",
      note: "sealed envelope, 24 hours",
      cond: "nothing above could carry it",
      res: "handed to peers until it reaches them",
    },
  ];
  return (
    <svg
      viewBox="0 0 920 330"
      className="h-auto w-full"
      role="img"
      aria-label="The three transport tiers the router chooses between"
    >
      <Arrow id="rl-arrow" />
      <Box x={16} y={116} w={130} h={56} label="You tap send" strong />
      <line x1={148} y1={144} x2={196} y2={144} stroke={LINE} markerEnd="url(#rl-arrow)" />
      {rungs.map((r, i) => {
        const y = 26 + i * 88;
        return (
          <g key={r.n}>
            <rect
              x={200}
              y={y}
              width={64}
              height={64}
              rx={2}
              fill={SOFT}
              stroke={INK}
              strokeWidth={1.5}
            />
            <text
              x={232}
              y={y + 39}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={18}
              fontWeight={700}
              fill={INK}
            >
              {r.n}
            </text>
            <Box x={284} y={y} w={244} h={64} label={r.label} sub={r.note} />
            <text x={552} y={y + 28} fontFamily={MONO} fontSize={10.5} fill={MUTED}>
              {r.cond}
            </text>
            <text x={552} y={y + 47} fontFamily={MONO} fontSize={10.5} fill={INK}>
              {r.res}
            </text>
            {i < 2 && (
              <line
                x1={232}
                y1={y + 64}
                x2={232}
                y2={y + 88}
                stroke={LINE}
                markerEnd="url(#rl-arrow)"
              />
            )}
          </g>
        );
      })}
      <text x={16} y={306} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Bluetooth is the path that always exists. The transport layer owns the link maps and takes
        WiFi instead when one is up, and both
      </text>
      <text x={16} y={322} fontFamily={MONO} fontSize={10} fill={MUTED}>
        carry the same Noise session, so the router never has to know which radio it got.
      </text>
    </svg>
  );
}
