import { LANGUAGES, PLANNED_LANGUAGES, useT, type LanguageSpec } from "@/i18n";
import { Check, ChevronDown, Languages } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

function Row({ language, active }: { language: LanguageSpec; active?: boolean }) {
  const T = useT();

  return (
    <li
      className={`flex items-center gap-3 rounded-[10px] px-2.5 py-2 ${active ? "bg-inner" : ""}`}
    >
      <span
        className={`w-5 shrink-0 font-mono text-[10px] font-semibold tracking-[0.14em] ${
          active ? "text-ink" : "text-mute"
        }`}
      >
        {language.shortCode}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[13px] ${active ? "text-ink" : "text-secondary"}`}>
          {T(language.nameKey)}
        </span>
        <span className="text-mute block truncate text-[11px]" lang={language.code}>
          {language.endonym}
        </span>
      </span>
      {active ? (
        <Check size={14} className="text-ink shrink-0" aria-hidden="true" />
      ) : (
        <span className="text-mute shrink-0 font-mono text-[9px] tracking-[0.16em] uppercase">
          {T("settings.language.soon")}
        </span>
      )}
    </li>
  );
}

export default function LanguagePicker() {
  const T = useT();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function isOutside(target: EventTarget | null) {
      return !wrapper.current?.contains(target as Node);
    }

    function onPointerDown(e: PointerEvent) {
      if (isOutside(e.target)) setOpen(false);
    }

    function onFocusIn(e: FocusEvent) {
      if (isOutside(e.target)) setOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapper} className="relative shrink-0">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={T("settings.language.label")}
        className="border-line bg-inner text-secondary hover:border-line-strong hover:text-ink flex h-7 items-center gap-1.5 rounded-full border pr-1.5 pl-2.5 font-mono text-[10px] font-semibold tracking-[0.18em] transition-colors duration-150"
      >
        <Languages size={12} aria-hidden="true" />
        {LANGUAGES.en.shortCode}
        <ChevronDown
          size={12}
          aria-hidden="true"
          className={`text-mute transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="border-line bg-card absolute right-0 bottom-full z-40 mb-2 w-64 rounded-2xl border p-1.5"
          >
            <ul className="no-scrollbar max-h-60 overflow-y-auto">
              <Row language={LANGUAGES.en} active />
              {PLANNED_LANGUAGES.map((language) => (
                <Row key={language.code} language={language} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
