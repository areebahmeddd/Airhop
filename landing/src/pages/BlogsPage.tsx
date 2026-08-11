import { useSEO } from "@/hooks/useSEO";
import { useT } from "@/i18n";
import { SEO } from "@/lib/seo";

export default function BlogsPage() {
  const T = useT();

  useSEO(SEO["/blogs"]);

  return (
    <main
      id="main-content"
      className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="text-secondary font-mono text-[11px] font-semibold tracking-[0.25em] uppercase">
          {T("page.blogs.eyebrow")}
        </span>
        <h1 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">
          {T("page.blogs.title")}
        </h1>
        <p className="text-secondary mx-auto max-w-sm text-sm leading-relaxed">
          {T("page.blogs.body")}
        </p>
      </div>
    </main>
  );
}
