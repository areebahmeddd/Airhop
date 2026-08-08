import { Arrow, Box, LINE, MONO, MUTED } from "./primitives";

export function PresenceStates() {
  return (
    <svg
      viewBox="0 0 920 240"
      className="h-auto w-full"
      role="img"
      aria-label="Presence states and what each does to the radios"
    >
      <Arrow id="ps-arrow" />
      <Box x={40} y={72} w={220} h={80} label="Online" sub="scanning + announcing" strong />
      <Box x={350} y={72} w={220} h={80} label="Invisible" sub="scanning, not announcing" />
      <Box x={660} y={72} w={220} h={80} label="Away" sub="radios off entirely" />
      <line x1={264} y1={100} x2={346} y2={100} stroke={LINE} markerEnd="url(#ps-arrow)" />
      <line x1={346} y1={126} x2={264} y2={126} stroke={LINE} markerEnd="url(#ps-arrow)" />
      <line x1={574} y1={100} x2={656} y2={100} stroke={LINE} markerEnd="url(#ps-arrow)" />
      <line x1={656} y1={126} x2={574} y2={126} stroke={LINE} markerEnd="url(#ps-arrow)" />
      <text x={40} y={190} fontFamily={MONO} fontSize={10} fill={MUTED}>
        You see others
      </text>
      <text x={350} y={190} fontFamily={MONO} fontSize={10} fill={MUTED}>
        You see others, they do not see you
      </text>
      <text x={660} y={190} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Nothing runs, nothing relays
      </text>
      <text x={40} y={222} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Away is also what the Stop mesh button on the Android notification reaches. Panic wipe is
        the one transition with no way back.
      </text>
    </svg>
  );
}
