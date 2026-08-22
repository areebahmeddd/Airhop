import { Arrow, Box, INK, LINE, MONO, MUTED } from "./primitives";

export function InternetGateway() {
  return (
    <svg
      viewBox="0 0 920 260"
      className="h-auto w-full"
      role="img"
      aria-label="Internet gateway carrying traffic for offline peers"
    >
      <Arrow id="gw-arrow" />
      <Box x={16} y={92} w={186} h={72} label="Offline phone" sub="no SIM, no WiFi" strong />
      <line
        x1={206}
        y1={128}
        x2={272}
        y2={128}
        stroke={INK}
        strokeWidth={1.3}
        markerEnd="url(#gw-arrow)"
      />
      <text
        x={239}
        y={116}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={9}
        fontWeight={700}
        fill={MUTED}
        letterSpacing="0.14em"
      >
        BLE
      </text>
      <Box
        x={276}
        y={80}
        w={210}
        h={96}
        label="Gateway phone"
        sub="has internet, opted in"
        strong
      />
      <line
        x1={490}
        y1={128}
        x2={556}
        y2={128}
        stroke={INK}
        strokeWidth={1.3}
        markerEnd="url(#gw-arrow)"
      />
      <text
        x={523}
        y={116}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={9}
        fontWeight={700}
        fill={MUTED}
        letterSpacing="0.14em"
      >
        TOR
      </text>
      <Box x={560} y={92} w={160} h={72} label="Nostr relays" sub="chosen by distance" />
      <line x1={724} y1={128} x2={766} y2={128} stroke={LINE} markerEnd="url(#gw-arrow)" />
      <Box x={770} y={92} w={136} h={72} label="The world" sub="location channels" />
      <text x={16} y={216} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Off by default. When you turn it on, your phone carries a neighbor's public location traffic
        to Nostr as packet type 0x28,
      </text>
      <text x={16} y={234} fontFamily={MONO} fontSize={10} fill={MUTED}>
        verified against its own Schnorr signature first. It never carries anyone's private
        messages, because it could not read them anyway.
      </text>
    </svg>
  );
}
