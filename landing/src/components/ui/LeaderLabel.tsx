import Chip from "./Chip";

export default function LeaderLabel({
  label,
  index,
  as,
}: {
  label: string;
  index?: number;
  as?: "span" | "h3";
}) {
  return (
    <div className="flex items-center gap-3">
      {index !== undefined ? (
        <span className="text-mute font-mono text-[11px] tracking-[0.1em] tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      <span className="bg-line group-hover:bg-line-strong h-px flex-1 transition-colors duration-200" />
      <Chip as={as} label={label} />
    </div>
  );
}
