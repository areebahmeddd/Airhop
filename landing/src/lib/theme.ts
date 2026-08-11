export type Theme = "light" | "dark";

const STORAGE_KEY = "airhop-theme";

const THEME_COLOR: Record<Theme, string> = {
  light: "#ffffff",
  dark: "#0c0d0e",
};

const listeners = new Set<() => void>();
const query = window.matchMedia("(prefers-color-scheme: dark)");

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function writeStored(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    return;
  }
}

let pinned = readStored();
let current: Theme = pinned ?? (query.matches ? "dark" : "light");

function paint(theme: Theme) {
  const root = document.documentElement;

  if (pinned) {
    root.dataset.theme = theme;
  } else {
    delete root.dataset.theme;
  }

  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((tag) => {
    tag.content = THEME_COLOR[theme];
  });
}

function publish(theme: Theme) {
  current = theme;
  paint(theme);
  listeners.forEach((notify) => notify());
}

query.addEventListener("change", (event) => {
  if (!pinned) publish(event.matches ? "dark" : "light");
});

paint(current);

export function getTheme(): Theme {
  return current;
}

export function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

export function setTheme(theme: Theme) {
  if (pinned === theme) return;

  pinned = theme;
  writeStored(theme);

  const root = document.documentElement;
  const clear = () => {
    delete root.dataset.themeSwitching;
    delete root.dataset.themeSweep;
  };

  root.dataset.themeSwitching = "";

  const sweepable =
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!sweepable) {
    publish(theme);
    root.getBoundingClientRect();
    clear();
    return;
  }

  root.dataset.themeSweep = "";
  const transition = document.startViewTransition(() => {
    publish(theme);
  });
  void transition.finished.then(clear, clear);
}
