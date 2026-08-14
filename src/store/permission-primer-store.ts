// Backing store for the one-time permission primer.
//
// The primer is the screen that explains why a chat app is about to ask for
// Bluetooth and Location, shown once, immediately before the OS dialog.
//
// It has to be awaitable, which is the only reason this is a store rather than
// a prop: the thing that needs to wait is startMeshWithPermissions(), a
// module-level async function with no access to React state. So it follows the
// same shape as alert-store - transient state here, a component reading it, and
// a plain function callers can await.
//
// Deliberately NOT a gate. It resolves whether the user reads it or not, it is
// shown at most once per install (see settings-store.permissionPrimerSeen), and
// nothing downstream branches on what they chose. Its only job is to make the
// OS prompt make sense, because a denial there is expensive: two refusals on
// Android and the permission is blocked for good, leaving the Settings
// deep-link as the only way back.

import { create } from "zustand";

interface PrimerState {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

export const usePermissionPrimerStore = create<PrimerState>((set) => ({
  visible: false,
  show() {
    set({ visible: true });
  },
  hide() {
    set({ visible: false });
  },
}));

// Resolved when the user dismisses the primer. Held at module scope so a second
// caller cannot strand the first one's promise.
let pending: (() => void) | null = null;

// Show the primer and resolve once it has been acknowledged.
//
// Never rejects and never hangs: if the primer is somehow already up, this
// resolves immediately rather than queueing behind it, because the caller is
// startup and startup must not be blocked by a screen the user is already
// looking at.
export function showPermissionPrimer(): Promise<void> {
  if (usePermissionPrimerStore.getState().visible) return Promise.resolve();
  return new Promise<void>((resolve) => {
    pending = resolve;
    usePermissionPrimerStore.getState().show();
  });
}

// Called by the primer screen's single button, and by anything that tears the
// screen down. Safe to call when nothing is waiting.
export function acknowledgePermissionPrimer(): void {
  usePermissionPrimerStore.getState().hide();
  const resolve = pending;
  pending = null;
  resolve?.();
}
