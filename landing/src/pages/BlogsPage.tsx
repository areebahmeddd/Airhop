import { useSEO } from "../hooks/useSEO";

export default function BlogsPage() {
  useSEO({
    title: "Blog - Airhop",
    description: "Writing on mesh networking, privacy, and offline-first software. Coming soon.",
    path: "/blogs",
    noIndex: true,
  });

  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 text-center"
    >
      <div className="space-y-4">
        <div className="font-mono text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase">
          BLOG
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
          Coming soon
        </h1>
        <p className="mx-auto max-w-sm font-mono text-sm leading-relaxed font-light text-gray-500">
          Writing on mesh networking, privacy, and offline-first software.
        </p>
      </div>
    </main>
  );
}
