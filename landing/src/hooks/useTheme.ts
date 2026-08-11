import { getTheme, subscribe, type Theme } from "@/lib/theme";
import { useSyncExternalStore } from "react";

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, getTheme);
}
