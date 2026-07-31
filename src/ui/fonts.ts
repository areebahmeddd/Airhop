// Single source of truth for the selectable monospace fonts.
//
// Adding a new font is a one-line entry here (plus loading its file in App.tsx).
// Both the Appearance picker and the FontFamily.mono resolver (ui/theme.ts) read
// from this table, so the family string is never duplicated and a new option can
// never be silently mismapped the way a hand-written ternary would.

import type { Feather } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { TranslationKey } from "../i18n";
import type { MonoFont } from "../store/settings-store";

export interface MonoFontSpec {
  // The React Native `fontFamily` value. "monospace" is the OS built-in; the
  // others must be loaded via useFonts in App.tsx under this exact name.
  family: string;
  // Shown in the Appearance picker.
  // Keys, not text: this is a module constant, so translated strings would
  // freeze in the language the app started in. The picker translates them on
  // render. "Fira Code" and "JetBrains Mono" are product names and stay put.
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: ComponentProps<typeof Feather>["name"];
}

export const MONO_FONTS: Record<MonoFont, MonoFontSpec> = {
  system: {
    family: "monospace",
    labelKey: "settings.font.system",
    descriptionKey: "settings.font.system_desc",
    icon: "type",
  },
  firacode: {
    family: "FiraCode_400Regular",
    labelKey: "settings.font.firacode",
    descriptionKey: "settings.font.firacode_desc",
    icon: "code",
  },
  jetbrains: {
    family: "JetBrainsMono_400Regular",
    labelKey: "settings.font.jetbrains",
    descriptionKey: "settings.font.jetbrains_desc",
    icon: "terminal",
  },
};

// The order the Appearance picker lists the fonts in.
export const MONO_FONT_ORDER: MonoFont[] = ["system", "firacode", "jetbrains"];
