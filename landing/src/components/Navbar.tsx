import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Explore", href: "/#explore" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white/95 px-6 py-4 backdrop-blur-sm md:px-12">
      <Link
        to="/"
        className="text-2xl font-black tracking-tighter text-black select-none"
        onClick={() => setIsOpen(false)}
      >
        AIRHOP
      </Link>

      <div className="hidden items-center space-x-8 md:flex">
        {navItems.map((item, index) => (
          <span key={item.label} className="flex items-center">
            <a
              href={item.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-black"
            >
              {item.label}
            </a>
            {index < navItems.length - 1 && (
              <span className="ml-8 font-normal text-gray-300">|</span>
            )}
          </span>
        ))}
      </div>

      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded p-1 text-black transition-colors hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 left-0 z-40 flex flex-col space-y-4 border-b border-gray-100 bg-white p-6 shadow-lg md:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-gray-50 py-2 text-base font-semibold text-gray-800 transition-colors hover:text-black"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
