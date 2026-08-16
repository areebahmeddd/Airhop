import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import LanguageSuggestion from "@/components/ui/LanguageSuggestion";
import { useT } from "@/i18n";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { NavigationType, Route, Routes, useLocation, useNavigationType } from "react-router-dom";

const ROUTES = [
  { path: "/", Component: HomePage },
  { path: "/architecture", Component: lazy(() => import("@/pages/ArchitecturePage")) },
  { path: "/faq", Component: lazy(() => import("@/pages/FAQPage")) },
  { path: "/blogs", Component: lazy(() => import("@/pages/BlogsPage")) },
  { path: "/brand", Component: lazy(() => import("@/pages/BrandPage")) },
  { path: "/privacy-policy", Component: lazy(() => import("@/pages/PrivacyPage")) },
  { path: "/terms-of-service", Component: lazy(() => import("@/pages/TermsPage")) },
];

function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef<string | null>(null);

  useLayoutEffect(() => {
    const samePage = previousPath.current === pathname;
    previousPath.current = pathname;

    if (hash) {
      const id = hash.slice(1);
      let frames = 0;
      let pending = 0;
      const findTarget = () => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ block: "start" });
          return;
        }
        if (frames++ < 60) pending = requestAnimationFrame(findTarget);
      };
      findTarget();
      return () => cancelAnimationFrame(pending);
    }

    if (navigationType === NavigationType.Pop) return;

    window.scrollTo({ top: 0, behavior: samePage ? "smooth" : "instant" });
  }, [pathname, hash, key, navigationType]);

  return null;
}

export default function App() {
  const T = useT();

  return (
    <div className="bg-canvas text-ink selection:bg-line selection:text-ink flex min-h-screen flex-col font-sans">
      <ScrollManager />
      <a
        href="#main-content"
        className="focus:bg-ink focus:text-canvas sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
      >
        {T("nav.skip")}
      </a>
      <LanguageSuggestion />
      <Navbar />
      <div className="flex flex-1 flex-col">
        <Suspense fallback={<div className="bg-canvas flex-1" />}>
          <Routes>
            {ROUTES.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
