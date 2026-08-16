import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { basenameFor, LanguageContext, LANGUAGES, loadCatalog, resolveLanguage } from "./i18n";
import "./index.css";

const language = resolveLanguage(window.location.pathname);
const spec = LANGUAGES[language];

const root = document.documentElement;
root.lang = language;
root.dir = spec.direction;
root.dataset.script = spec.script;

void loadCatalog(language).then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter basename={basenameFor(language)}>
        <LanguageContext value={language}>
          <App />
        </LanguageContext>
      </BrowserRouter>
    </StrictMode>,
  );
});
