import { Link } from "react-router-dom";

function GithubIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.021C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white px-6 py-12 font-mono text-gray-500 md:px-12 md:py-16">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center space-y-3 text-center md:items-start md:text-left">
            <span className="text-xl font-extrabold tracking-tighter text-black select-none">
              AIRHOP
            </span>
            <p className="text-xs text-gray-400 select-none sm:text-sm">offline. private. free.</p>
          </div>

          <div className="flex flex-col items-center space-y-4 md:items-end">
            <div className="flex items-center space-x-6 text-gray-400">
              <a
                href="https://github.com/areebahmeddd/Airhop"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 transition-colors hover:text-black"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
            </div>
            <p className="text-center text-[10px] text-gray-400 select-none sm:text-xs md:text-right">
              &copy; {currentYear} Areeb Ahmed. Released under MIT.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-gray-100 pt-6 text-xs text-gray-400">
          <Link to="/faq" className="transition-colors hover:text-black">
            FAQ
          </Link>
          <Link to="/privacy-policy" className="transition-colors hover:text-black">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="transition-colors hover:text-black">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
