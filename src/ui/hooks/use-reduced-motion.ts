// Whether the OS "reduce motion" accessibility setting is on.
//
// WCAG 2.3.3 asks that motion which is not essential to the content can be
// switched off. Vestibular disorders are why the setting exists, and a ring that
// expands forever is close to the textbook trigger.
//
// SCOPE: React Native `Animated` only. Anything driven by Reanimated is already
// covered and must NOT be gated a second time here. Every Reanimated config
// defaults to `ReduceMotion.System`, so `withSpring`, `withTiming` and the layout
// animations become instant on their own, which covers the bottom sheet's
// spring, the toast fade and every list reorder. The radar's sonar sweep is the
// one case left, since it runs on `Animated.loop`.
//
// Reanimated exports its own `useReducedMotion()`, but per its docs that reads
// the value once at app start and never re-renders on change. The radar loops
// for as long as the Mesh tab is open, so a user who flips the switch and comes
// back would still be watching it sweep. `AccessibilityInfo` has both the query
// and the change event, so this hook stays live.

import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduced(enabled);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
