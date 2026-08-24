// The one tap-to-copy in the app: clipboard, haptic, and the tick that stands
// in for the copy glyph while it lasts.
//
// The timer is reffed and cleared on unmount because every control that offers
// this sits inside a bottom sheet, and dismissing the sheet is the likeliest
// thing to happen in the second after a copy.
//
// The visual half lives in ui/components/copy-glyph.tsx.

import { acknowledged } from "@platform/haptics";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useRef, useState } from "react";

// Long enough to register without watching for it, short enough that the
// control is back to rest before the eye returns.
export const COPIED_MS = 1500;

export function useCopy(): {
  copied: boolean;
  copy: (value: string) => void;
} {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback((value: string): void => {
    void Clipboard.setStringAsync(value).catch(() => {});
    // The glyph that changes is under the thumb that just covered it, so the
    // confirmation is felt as well as seen.
    acknowledged();
    setCopied(true);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  }, []);

  return { copied, copy };
}
