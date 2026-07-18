import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-32 text-center md:px-12">
      <div className="font-mono text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase">
        404
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
        Page not found
      </h1>
      <p className="mx-auto max-w-md font-mono text-sm leading-relaxed font-light text-gray-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block bg-black px-6 py-3 font-mono text-xs font-bold tracking-widest text-white transition-all hover:bg-black/90"
      >
        BACK TO HOME
      </Link>
    </main>
  );
}
