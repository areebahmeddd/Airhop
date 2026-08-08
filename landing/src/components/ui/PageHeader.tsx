import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PageHeader({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta?: string;
}) {
  return (
    <header className="max-w-3xl">
      <Link
        to="/"
        className="group text-secondary hover:text-ink inline-flex min-h-11 items-center gap-1.5 text-sm transition-colors duration-150"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back to home
      </Link>

      <p className="text-mute mt-6 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase">
        {eyebrow}
      </p>
      <h1 className="text-ink mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
      {meta ? <p className="text-secondary mt-2 text-sm">{meta}</p> : null}
    </header>
  );
}
