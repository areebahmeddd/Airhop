export default function Chip({ label, as: Tag = "span" }: { label: string; as?: "span" | "h3" }) {
  return (
    <Tag className="bg-ink text-canvas inline-flex h-6 shrink-0 items-center rounded-full px-2.5 font-mono text-[10px] font-semibold tracking-[0.18em] uppercase">
      {label}
    </Tag>
  );
}
