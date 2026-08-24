export default function Chip({ label, as: Tag = "span" }: { label: string; as?: "span" | "h3" }) {
  return (
    <Tag className="label bg-ink text-canvas inline-flex h-6 shrink-0 items-center rounded-full ps-[0.625rem] pe-[calc(0.625rem-0.18em)] text-[10px] font-semibold tracking-[0.18em]">
      {label}
    </Tag>
  );
}
