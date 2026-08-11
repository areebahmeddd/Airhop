import PixelBird from "@/components/ui/PixelBird";
import { useT, type TranslationKey } from "@/i18n";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const NAV_ITEMS: { labelKey: TranslationKey; href: string }[] = [
  { labelKey: "nav.how_it_works", href: "/#how-it-works" },
  { labelKey: "nav.architecture", href: "/architecture" },
  { labelKey: "nav.faq", href: "/faq" },
];

const MENU_ID = "primary-navigation";

export default function Navbar() {
  const T = useT();
  const [isOpen, setIsOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onScroll() {
      setCondensed(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const linkClass =
    "flex min-h-11 items-center rounded-full px-3 text-[13px] font-medium text-secondary transition-colors duration-150 hover:text-ink";

  return (
    <header className="sticky top-0 z-50 px-3 pt-2">
      <nav
        aria-label={T("nav.aria")}
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-4 transition-[padding,background-color,border-color] duration-200 ease-out md:px-6 ${
          condensed
            ? "border-line bg-canvas/85 py-1.5 backdrop-blur-md"
            : "bg-canvas border-transparent py-2.5"
        }`}
      >
        <Link
          to="/"
          className="flex min-h-11 w-fit items-center gap-3 select-none"
          aria-label={T("nav.home")}
          onClick={() => setIsOpen(false)}
        >
          <PixelBird className="text-ink h-4 w-auto" />
          <span className="text-ink font-mono text-sm font-bold tracking-[0.34em]">AIRHOP</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} to={item.href} className={linkClass}>
              {T(item.labelKey)}
            </Link>
          ))}
        </div>

        <button
          ref={toggleRef}
          onClick={() => setIsOpen(!isOpen)}
          className="text-ink hover:bg-inner flex h-11 w-11 items-center justify-center justify-self-end rounded-full transition-colors duration-150 md:hidden"
          aria-label={isOpen ? T("nav.menu.close") : T("nav.menu.open")}
          aria-expanded={isOpen}
          aria-controls={MENU_ID}
        >
          {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={MENU_ID}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="border-line bg-card absolute top-full right-3 left-3 z-40 mt-2 flex flex-col rounded-2xl border p-3 md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="text-ink hover:bg-inner flex min-h-11 items-center rounded-[10px] px-3 text-[15px] font-medium transition-colors duration-150"
              >
                {T(item.labelKey)}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
