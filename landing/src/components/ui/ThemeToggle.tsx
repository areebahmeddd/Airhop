import { useTheme } from "@/hooks/useTheme";
import { setTheme, type Theme } from "@/lib/theme";
import type { LucideIcon } from "lucide-react";
import { Moon, Sun } from "lucide-react";

const OPTIONS: { value: Theme; label: string; Icon: LucideIcon; active: string }[] = [
  { value: "light", label: "Light", Icon: Sun, active: "text-sun" },
  { value: "dark", label: "Dark", Icon: Moon, active: "text-moon" },
];

export default function ThemeToggle() {
  const theme = useTheme();

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="border-line bg-inner relative flex h-7 shrink-0 items-center rounded-full border p-px"
    >
      <span
        aria-hidden="true"
        className={`bg-canvas pointer-events-none absolute top-px left-px h-6 w-6 rounded-full transition-transform duration-200 ease-out ${
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        }`}
      />
      {OPTIONS.map(({ value, label, Icon, active }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-pressed={theme === value}
          aria-label={`${label} theme`}
          className={`relative flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-150 ${
            theme === value ? active : "text-mute hover:text-secondary"
          }`}
        >
          <Icon size={12} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
