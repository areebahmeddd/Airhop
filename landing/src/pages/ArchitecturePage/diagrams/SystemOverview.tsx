import { Arrow, Box, Caption, LINE } from "./primitives";

export function SystemOverview() {
  return (
    <svg
      viewBox="0 0 920 440"
      className="h-auto w-full"
      role="img"
      aria-label="Airhop system overview"
    >
      <Arrow id="ov-arrow" />
      <Caption x={20} y={26}>
        YOUR PHONE
      </Caption>
      <rect
        x={16}
        y={38}
        width={276}
        height={368}
        rx={2}
        fill="none"
        stroke={LINE}
        strokeDasharray="4 3"
      />
      <Box x={32} y={54} w={244} h={44} label="src/ui" sub="passive screens, theme tokens" />
      <Box
        x={32}
        y={110}
        w={244}
        h={44}
        label="src/features"
        sub="chats · mesh · wallet · profile"
      />
      <Box
        x={32}
        y={166}
        w={244}
        h={44}
        label="src/store"
        sub="Zustand + MMKV, encrypted at rest"
      />
      <Box x={32} y={222} w={244} h={44} label="src/services" sub="mesh-service · wallet-service" />
      <Box
        x={32}
        y={278}
        w={244}
        h={56}
        label="src/core"
        sub="crypto · mesh · nostr · payments"
        strong
      />
      <Box
        x={32}
        y={346}
        w={244}
        h={44}
        label="native module"
        sub="Swift + Kotlin, raw bytes only"
      />

      <Caption x={352} y={26}>
        TRANSPORT
      </Caption>
      <Box x={348} y={54} w={200} h={56} label="BLE mesh" sub="no internet · 7 hops" strong />
      <Box x={348} y={126} w={200} h={56} label="WiFi direct" sub="no internet · same OS only" />
      <Box x={348} y={198} w={200} h={56} label="Nostr relays" sub="internet · optional Tor" />
      <Box x={348} y={270} w={200} h={56} label="Courier" sub="no internet · carried by peers" />
      <Box
        x={348}
        y={342}
        w={200}
        h={48}
        label="Mint HTTPS"
        sub="internet · payments only"
        dashed
      />

      <Caption x={628} y={26}>
        REACHES
      </Caption>
      <Box
        x={624}
        y={54}
        w={272}
        h={56}
        label="Nearby devices"
        sub="Airhop and bitchat, one mesh"
        strong
      />
      <Box
        x={624}
        y={126}
        w={272}
        h={56}
        label="Nearby same-platform device"
        sub="faster path for large files"
      />
      <Box
        x={624}
        y={198}
        w={272}
        h={56}
        label="Anyone online, anywhere"
        sub="DMs and location channels"
      />
      <Box
        x={624}
        y={270}
        w={272}
        h={56}
        label="Someone not here yet"
        sub="delivered when paths meet"
      />
      <Box
        x={624}
        y={342}
        w={272}
        h={48}
        label="Your ecash balance"
        sub="top up, cash out, confirm"
        dashed
      />

      {[82, 154, 226, 298, 366].map((y, i) => (
        <line
          key={`l-${i}`}
          x1={280}
          y1={306}
          x2={344}
          y2={y}
          stroke={LINE}
          strokeWidth={1}
          markerEnd="url(#ov-arrow)"
        />
      ))}
      {[82, 154, 226, 298, 366].map((y, i) => (
        <line
          key={`r-${i}`}
          x1={552}
          y1={y}
          x2={620}
          y2={y}
          stroke={LINE}
          strokeWidth={1}
          markerEnd="url(#ov-arrow)"
        />
      ))}
    </svg>
  );
}
