import type { LucideIcon } from "lucide-react";

const GHOST =
  "text-ink pointer-events-none absolute opacity-[0.07] transition-all duration-300 group-hover:scale-105 group-hover:opacity-[0.12]";

export default function CardTexture({
  Icon,
  numeral,
  corner = "top",
}: {
  Icon?: LucideIcon;
  numeral?: string;
  corner?: "top" | "bottom";
}) {
  return (
    <>
      <span
        className={`pointer-events-none absolute inset-x-0 opacity-30 transition-opacity duration-300 group-hover:opacity-60 ${
          corner === "top" ? "dot-field top-0 h-48" : "dot-field-up bottom-0 h-32"
        }`}
        aria-hidden="true"
      />
      {Icon ? (
        <span
          className={`${GHOST} -right-5 ${corner === "top" ? "-top-5" : "-bottom-5"}`}
          aria-hidden="true"
        >
          <Icon size={112} strokeWidth={1} />
        </span>
      ) : null}
      {numeral ? (
        <span
          className={`${GHOST} -top-8 -right-4 font-mono text-[140px] leading-none font-semibold`}
          aria-hidden="true"
        >
          {numeral}
        </span>
      ) : null}
    </>
  );
}
