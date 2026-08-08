import { Arrow, Box, LINE, MONO, MUTED } from "./primitives";

export function WalletStates() {
  return (
    <svg
      viewBox="0 0 920 340"
      className="h-auto w-full"
      role="img"
      aria-label="Where a coin can be in the wallet"
    >
      <Arrow id="ws-arrow" />
      <Box x={330} y={124} w={220} h={72} label="Spendable" sub="yours, confirmed, ready" strong />

      <Box x={16} y={24} w={200} h={64} label="Deposit" sub="NUT-04 Lightning invoice" />
      <line x1={218} y1={56} x2={326} y2={140} stroke={LINE} markerEnd="url(#ws-arrow)" />

      <Box x={16} y={232} w={200} h={64} label="Withdraw" sub="NUT-05, reserve refunded" />
      <line x1={326} y1={182} x2={220} y2={252} stroke={LINE} markerEnd="url(#ws-arrow)" />

      <Box x={664} y={24} w={240} h={64} label="Reserved" sub="sent, not yet claimed" />
      <line x1={554} y1={140} x2={660} y2={60} stroke={LINE} markerEnd="url(#ws-arrow)" />
      <line
        x1={660}
        y1={72}
        x2={556}
        y2={148}
        stroke={LINE}
        strokeDasharray="4 3"
        markerEnd="url(#ws-arrow)"
      />
      <text x={604} y={112} fontFamily={MONO} fontSize={9} fill={MUTED}>
        reclaim
      </text>

      <Box
        x={664}
        y={232}
        w={240}
        h={64}
        label="Unconfirmed"
        sub="received offline, DLEQ checked"
      />
      <line x1={554} y1={182} x2={660} y2={256} stroke={LINE} markerEnd="url(#ws-arrow)" />
      <line
        x1={660}
        y1={244}
        x2={556}
        y2={174}
        stroke={LINE}
        strokeDasharray="4 3"
        markerEnd="url(#ws-arrow)"
      />
      <text x={596} y={216} fontFamily={MONO} fontSize={9} fill={MUTED}>
        Refresh, NUT-07
      </text>

      <text x={16} y={318} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Sending never deletes a coin, it moves it to Reserved. A crash, a closed app, or a message
        that never routes all leave the money recoverable.
      </text>
    </svg>
  );
}
