// Single source of truth for the selectable monospace fonts.
//
// Adding a new font is a one-line entry here (plus loading its file in App.tsx).
// Both the Appearance picker and the FontFamily.mono resolver (ui/theme.ts) read
// from this table, so the family string is never duplicated and a new option can
// never be silently mismapped the way a hand-written ternary would.

import type { Feather } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { MonoFont } from "../store/settings-store";

export interface MonoFontSpec {
  // The React Native `fontFamily` value. "monospace" is the OS built-in; the
  // others must be loaded via useFonts in App.tsx under this exact name.
  family: string;
  // Shown in the Appearance picker.
  label: string;
  description: string;
  icon: ComponentProps<typeof Feather>["name"];
}

export const MONO_FONTS: Record<MonoFont, MonoFontSpec> = {
  system: {
    family: "monospace",
    label: "System",
    description: "Uses your device's default monospace font",
    icon: "type",
  },
  firacode: {
    family: "FiraCode_400Regular",
    label: "Fira Code",
    description: "Clean with distinctive characters",
    icon: "code",
  },
  jetbrains: {
    family: "JetBrainsMono_400Regular",
    label: "JetBrains Mono",
    description: "Modern and easy to read",
    icon: "code",
  },
};

// The order the Appearance picker lists the fonts in.
export const MONO_FONT_ORDER: MonoFont[] = ["system", "firacode", "jetbrains"];
