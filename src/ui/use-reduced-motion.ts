// Whether the OS "reduce motion" accessibility setting is on.
//
// WCAG 2.3.3 (Animation from Interactions) asks that motion which is not
// essential to the content can be switched off. The app has three kinds worth
// honouring: the radar's continuous sonar sweep, the bottom sheet's spring, and
// the list reorder/fade transitions. None of them carry information a static
// frame does not, so all three should stop when the setting is on. Vestibular
// disorders are the reason this setting exists; a looping ring that expands
// forever is close to the textbook trigger.
//
// SCOPE: this is only for animations built on React Native's own `Animated`
// API. Anything driven by Reanimated is already covered and must NOT be gated a
// second time here.
//
// Every Reanimated animation config defaults to `ReduceMotion.System`, and its
// `getReduceMotionForAnimation` treats a missing config as exactly that, so
// `withSpring`, `withTiming` and the layout animations (`FadeIn`,
// `LinearTransition`) all become instant on their own when the setting is on.
// That covers the bottom sheet's spring, the toast fade, and every list
// reorder. The radar's sonar sweep is the one thing left, because it predates
// that and uses `Animated.loop`.
//
// Reanimated also exports a `useReducedMotion()`, but its own docs note it reads
// the value once at app start and never re-renders on change. The radar loops
// for as long as the Mesh tab is open, so a user who flips the switch in system
// settings and comes back would still be watching it sweep. React Native's
// `AccessibilityInfo` has both the query and the change event, so this hook is
// live and there is no second source of truth to drift from.

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
