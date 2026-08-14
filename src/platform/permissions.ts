// One way to ask for a runtime permission, so camera and photo access behave
// the same everywhere in the app.
//
// The three states people actually hit are distinct and want distinct
// treatment, and treating them as one boolean is where permission flows usually
// go wrong:
//
//   undetermined  the OS prompt has never been shown. Show it. Saying anything
//                 of our own first is a second dialog nobody asked for.
//   deniable      denied once, but the OS will still prompt. Ask again, because
//                 the user is now in the flow that needs it and the ask finally
//                 has context.
//   blocked       denied for good ("Don't allow" twice on Android, any denial on
//                 iOS). Prompting again is a silent no-op, so this is the only
//                 case that deserves a message from us - and that message has to
//                 include the way out, which is the Settings app.
//
// Callers get a plain boolean and can stay linear.

import { t } from "@i18n";
import { showAlert } from "@store/alert-store";
import { Linking } from "react-native";

// The shape every Expo permission response shares (expo-camera,
// expo-image-picker, expo-media-library).
export interface PermissionLike {
  granted: boolean;
  canAskAgain: boolean;
}

interface Copy {
  // Sentence-case name of the permission, e.g. "Camera access".
  label: string;
  // What the app wanted it for, phrased so it still reads well after "to".
  purpose: string;
}

// Tell the user their only remaining option and take them there. Deep-linking
// into Settings rather than describing where to tap is the difference between a
// dead end and a two-tap fix.
export function showBlockedAlert({ label, purpose }: Copy): void {
  showAlert(
    t("permission.blocked_title", { label }),
    t("permission.blocked_body", { purpose }),
    [
      {
        text: t("permission.open_settings"),
        onPress: () => void Linking.openSettings(),
      },
      { text: t("permission.not_now"), style: "cancel" },
    ],
  );
}

// Resolve a permission to a single yes/no, prompting or explaining as the state
// requires. `get` is checked first so an already-granted permission never costs
// a round trip through the OS prompt machinery.
export async function ensurePermission(
  get: () => Promise<PermissionLike>,
  request: () => Promise<PermissionLike>,
  copy: Copy,
): Promise<boolean> {
  const current = await get();
  if (current.granted) return true;

  if (current.canAskAgain) {
    const asked = await request();
    if (asked.granted) return true;
    // Declining the OS prompt is an answer, not an error: the user just said
    // no to a dialog they were looking at. Only nag once they've locked it off
    // entirely and would otherwise be stuck.
    if (asked.canAskAgain) return false;
  }

  showBlockedAlert(copy);
  return false;
}
