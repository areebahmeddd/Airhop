// Backing store for the custom alert modal (src/ui/components/alert-modal.tsx),
// a drop-in replacement for React Native's native `Alert.alert` so every
// notice/confirm dialog in the app matches its own design language instead
// of the OS-default alert box. Not persisted, purely transient UI state.

import { t } from "@i18n";
import { create } from "zustand";

export interface AlertButtonConfig {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

interface AlertState {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AlertButtonConfig[];
  show: (
    title: string,
    message?: string,
    buttons?: AlertButtonConfig[],
  ) => void;
  hide: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  title: "",
  message: undefined,
  buttons: [],

  show(title, message, buttons) {
    set({
      visible: true,
      title,
      message,
      // Translated here rather than held as a module constant, because `show`
      // runs at the moment the alert is raised and `t` resolves the language
      // then. A default button built once at import would freeze in whichever
      // language the app started in.
      //
      // This was a hardcoded "OK" and shipped English into every alert that
      // does not pass its own buttons, in all thirty languages. `i18n:audit`
      // could not see it: its copy heuristic wants a capitalised word or a run
      // of words, and "OK" is two characters. Found by running the
      // pseudolocale, where every string around it was bracketed and this one
      // was not.
      buttons:
        buttons && buttons.length > 0 ? buttons : [{ text: t("common.ok") }],
    });
  },

  hide() {
    set({ visible: false });
  },
}));

// Same call shape as RN's `Alert.alert(title, message?, buttons?)`, so
// existing call sites swap over by only changing the import.
export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButtonConfig[],
): void {
  useAlertStore.getState().show(title, message, buttons);
}
