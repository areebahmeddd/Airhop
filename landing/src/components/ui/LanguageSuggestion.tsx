import {
  getT,
  LANGUAGES,
  loadCatalog,
  localizedPath,
  useLanguage,
  type LanguageCode,
} from "@/i18n";
import { rememberLanguage, suggestLanguage } from "@/lib/language-hint";
import { ArrowRight, Languages, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function LanguageSuggestion() {
  const current = useLanguage();
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const [suggested, setSuggested] = useState<LanguageCode | null>(null);

  useEffect(() => {
    const next = suggestLanguage(current);
    if (next === null) return;

    let cancelled = false;
    void loadCatalog(next).then(() => {
      if (!cancelled) setSuggested(next);
    });

    return () => {
      cancelled = true;
    };
  }, [current]);

  function dismiss() {
    rememberLanguage(current);
    setSuggested(null);
  }

  const spec = suggested === null ? null : LANGUAGES[suggested];
  const T = getT(suggested ?? current);

  return (
    <AnimatePresence>
      {suggested !== null && spec !== null && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
        >
          <div
            lang={spec.code}
            dir={spec.direction}
            className="border-line bg-card text-secondary pointer-events-auto flex max-w-full items-center gap-2 rounded-full border py-1.5 ps-4 pe-1.5 text-[13px]"
          >
            <Languages size={14} className="text-mute shrink-0" aria-hidden="true" />
            <a
              href={localizedPath(suggested, pathname)}
              hrefLang={suggested}
              onClick={() => rememberLanguage(suggested)}
              className="hover:text-ink group inline-flex min-w-0 items-center gap-1.5 truncate transition-colors duration-150"
            >
              <span className="truncate">{T("settings.language.suggestion")}</span>
              <ArrowRight
                size={13}
                aria-hidden="true"
                className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
              />
            </a>
            <button
              type="button"
              onClick={dismiss}
              aria-label={T("settings.language.dismiss")}
              className="text-mute hover:bg-inner hover:text-ink flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-150"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
