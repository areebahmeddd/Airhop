// Backing store for the custom alert modal (src/ui/components/custom-alert.tsx),
// a drop-in replacement for React Native's native `Alert.alert` so every
// notice/confirm dialog in the app matches its own design language instead
// of the OS-default alert box. Not persisted, purely transient UI state.

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
      buttons: buttons && buttons.length > 0 ? buttons : [{ text: "OK" }],
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
