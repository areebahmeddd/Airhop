import { Caption, FILL, INK, LINE, MONO, MUTED } from "./primitives";

export function ProtectionStack() {
  const rows = [
    ["Direct message", "Noise XX + Double Ratchet", "yes", "yes"],
    ["DM over the internet", "NIP-17 gift wrap", "yes", "yes"],
    ["Courier envelope", "Noise X to a one-time prekey", "yes", "yes"],
    ["Private channel", "XChaCha20-Poly1305, key in the link", "yes", "yes"],
    ["Private group", "ChaCha20-Poly1305 under an epoch key", "yes", "yes"],
    ["Public channel", "signed only, readable by design", "no", "yes"],
    ["Location channel", "signed only, readable by design", "no", "yes"],
    ["Attachment", "signed only, for bitchat compatibility", "no", "yes"],
  ];
  return (
    <svg
      viewBox="0 0 920 340"
      className="h-auto w-full"
      role="img"
      aria-label="What is encrypted and what is only signed"
    >
      <Caption x={16} y={22}>
        WHAT IT IS
      </Caption>
      <Caption x={250} y={22}>
        HOW IT IS PROTECTED
      </Caption>
      <Caption x={686} y={22}>
        ENCRYPTED
      </Caption>
      <Caption x={810} y={22}>
        SIGNED
      </Caption>
      {rows.map((r, i) => {
        const y = 38 + i * 36;
        const enc = r[2] === "yes";
        return (
          <g key={i}>
            <rect
              x={12}
              y={y}
              width={896}
              height={32}
              rx={2}
              fill={i % 2 === 0 ? FILL : "var(--dg-fill)"}
              stroke={LINE}
              strokeWidth={0.8}
            />
            <text x={24} y={y + 21} fontFamily={MONO} fontSize={11} fontWeight={600} fill={INK}>
              {r[0]}
            </text>
            <text x={250} y={y + 21} fontFamily={MONO} fontSize={10.5} fill={MUTED}>
              {r[1]}
            </text>
            <text
              x={706}
              y={y + 21}
              fontFamily={MONO}
              fontSize={11}
              fontWeight={700}
              fill={enc ? INK : MUTED}
            >
              {enc ? "yes" : "no"}
            </text>
            <text x={826} y={y + 21} fontFamily={MONO} fontSize={11} fontWeight={700} fill={INK}>
              yes
            </text>
          </g>
        );
      })}
    </svg>
  );
}
