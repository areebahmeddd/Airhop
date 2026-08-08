import { Arrow, Box, INK, LINE, MONO, MUTED } from "./primitives";

export function MeshBridge() {
  return (
    <svg
      viewBox="0 0 920 280"
      className="h-auto w-full"
      role="img"
      aria-label="Two Bluetooth mesh islands linked over the internet by the mesh bridge"
    >
      <Arrow id="mb-arrow" />
      {/* Two crowds, out of Bluetooth range of each other. */}
      <Box x={16} y={132} w={220} h={76} label="Island A" sub="a Bluetooth crowd" strong />
      <Box x={684} y={132} w={220} h={76} label="Island B" sub="a Bluetooth crowd" strong />
      <line x1={240} y1={170} x2={680} y2={170} stroke={LINE} strokeDasharray="5 4" />
      <text
        x={460}
        y={162}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={9}
        fontWeight={700}
        fill={MUTED}
        letterSpacing="0.14em"
      >
        NO BLUETOOTH
      </text>
      {/* Both meet at one rendezvous cell on Nostr. */}
      <Box x={350} y={20} w={220} h={76} label="Rendezvous cell" sub="geohash #r on Nostr" />
      <line
        x1={150}
        y1={132}
        x2={378}
        y2={96}
        stroke={INK}
        strokeWidth={1.3}
        markerEnd="url(#mb-arrow)"
      />
      <line
        x1={770}
        y1={132}
        x2={542}
        y2={96}
        stroke={INK}
        strokeWidth={1.3}
        markerEnd="url(#mb-arrow)"
      />
      <text x={16} y={244} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Off by default. Each island publishes its public #bluetooth chat to the shared neighborhood
        cell and subscribes to the same cell,
      </text>
      <text x={16} y={262} fontFamily={MONO} fontSize={10} fill={MUTED}>
        signed by an unlinkable per-cell key. A mesh-only phone rides through a bridge peer. DMs
        never cross the bridge.
      </text>
    </svg>
  );
}
