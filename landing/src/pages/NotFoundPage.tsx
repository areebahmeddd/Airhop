import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

export default function NotFoundPage() {
  useSEO({
    title: "Page Not Found - Airhop",
    description: "The page you are looking for does not exist or has been moved.",
    path: "/404",
    noIndex: true,
  });

  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 text-center"
    >
      <div className="space-y-4">
        <div className="font-mono text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase">
          404
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto max-w-sm font-mono text-sm leading-relaxed font-light text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-block bg-black px-6 py-3 font-mono text-xs font-bold tracking-widest text-white transition-all hover:bg-black/90"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    </main>
  );
}
