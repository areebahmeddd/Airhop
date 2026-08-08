import { Box, Caption, FILL, INK, MONO, MUTED, SOFT } from "./primitives";

export function GiftWrap() {
  return (
    <svg
      viewBox="0 0 920 280"
      className="h-auto w-full"
      role="img"
      aria-label="NIP-17 gift wrap nesting"
    >
      <rect
        x={16}
        y={30}
        width={560}
        height={220}
        rx={2}
        fill={FILL}
        stroke={INK}
        strokeWidth={1.5}
      />
      <text x={36} y={58} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
        kind 1059 · gift wrap
      </text>
      <text x={36} y={76} fontFamily={MONO} fontSize={10} fill={MUTED}>
        signed by a throwaway key, so the relay cannot see who sent it
      </text>

      <rect
        x={56}
        y={94}
        width={480}
        height={136}
        rx={2}
        fill="var(--dg-fill)"
        stroke={INK}
        strokeWidth={1.2}
      />
      <text x={76} y={122} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
        kind 13 · seal
      </text>
      <text x={76} y={140} fontFamily={MONO} fontSize={10} fill={MUTED}>
        signed by your real key, encrypted to the recipient
      </text>

      <rect
        x={96}
        y={158}
        width={400}
        height={54}
        rx={2}
        fill={SOFT}
        stroke={INK}
        strokeWidth={1.2}
      />
      <text x={116} y={182} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
        kind 14 · rumor
      </text>
      <text x={116} y={200} fontFamily={MONO} fontSize={10} fill={MUTED}>
        the actual message, never signed, so it cannot be proven
      </text>

      <Caption x={624} y={44}>
        WHAT THE RELAY SEES
      </Caption>
      <Box
        x={620}
        y={58}
        w={286}
        h={44}
        label="an event"
        sub="from a key it has never seen before"
      />
      <Box x={620} y={114} w={286} h={44} label="a timestamp" sub="randomized to blur timing" />
      <Box x={620} y={170} w={286} h={44} label="ciphertext" sub="NIP-44, XChaCha20-Poly1305" />
      <text x={620} y={238} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Not your identity, not theirs,
      </text>
      <text x={620} y={254} fontFamily={MONO} fontSize={10} fill={MUTED}>
        and not a word of the message.
      </text>
    </svg>
  );
}
