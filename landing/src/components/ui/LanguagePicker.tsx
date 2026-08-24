import {
  LANGUAGE_ORDER,
  languageName,
  LANGUAGES,
  localizedPath,
  useLanguage,
  useT,
  type LanguageSpec,
} from "@/i18n";
import { rememberLanguage } from "@/lib/language-hint";
import { Check, ChevronDown, Languages } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const ROW = "flex w-full items-center gap-3 rounded-[10px] px-2.5 py-2";

function Label({ language, active }: { language: LanguageSpec; active: boolean }) {
  const current = useLanguage();

  return (
    <>
      <span
        className={`w-8 shrink-0 font-mono text-[10px] font-semibold tracking-[0.14em] ${
          active ? "text-ink" : "text-mute"
        }`}
      >
        {language.shortCode}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[13px] ${active ? "text-ink" : "text-secondary"}`}>
          {languageName(current, language.code)}
        </span>
        <span className="text-mute block truncate text-[11px]">
          <bdi lang={language.code}>{language.endonym}</bdi>
        </span>
      </span>
      {active ? <Check size={14} className="text-ink shrink-0" aria-hidden="true" /> : null}
    </>
  );
}

export default function LanguagePicker() {
  const T = useT();
  const language = useLanguage();
  const { pathname } = useLocation();
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
        className="border-line bg-inner text-secondary hover:border-line-strong hover:text-ink active:bg-hover flex h-7 items-center gap-1.5 rounded-full border ps-2.5 pe-1.5 font-mono text-[10px] font-semibold tracking-[0.18em] transition-colors duration-150"
      >
        <Languages size={12} aria-hidden="true" />
        <span className="sr-only">{T("settings.language.label")}</span>
        {LANGUAGES[language].shortCode}
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
            className="border-line bg-card absolute end-0 bottom-full z-40 mb-2 w-64 overflow-hidden rounded-2xl border p-1.5"
          >
            <ul className="no-scrollbar max-h-60 space-y-0.5 overflow-x-hidden overflow-y-auto">
              {LANGUAGE_ORDER.map((code) => {
                const spec = LANGUAGES[code];
                const active = code === language;
                return (
                  <li key={code}>
                    {active ? (
                      <span className={`${ROW} bg-inner`} aria-current="true">
                        <Label language={spec} active />
                      </span>
                    ) : (
                      <a
                        href={localizedPath(code, pathname)}
                        hrefLang={code}
                        onClick={() => rememberLanguage(code)}
                        className={`${ROW} hover:bg-inner active:bg-hover transition-colors duration-150`}
                      >
                        <Label language={spec} active={false} />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
