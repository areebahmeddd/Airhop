import { useSEO } from "@/hooks/useSEO";
import { SEO } from "@/lib/seo";

export default function BlogsPage() {
  useSEO(SEO["/blogs"]);

  return (
    <main
      id="main-content"
      className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="text-secondary font-mono text-[11px] font-semibold tracking-[0.25em] uppercase">
          Blog
        </span>
        <h1 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">Coming soon</h1>
        <p className="text-secondary mx-auto max-w-sm text-sm leading-relaxed">
          Writing on mesh networking, privacy, and offline-first software.
        </p>
      </div>
    </main>
  );
}
