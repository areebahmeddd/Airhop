// How a pull-to-refresh spinner is coloured, in one place for every list.
//
// RefreshControl takes a different prop per platform for the same thing, and
// silently ignores the other one:
//
//   tintColor              the spinner, iOS only
//   colors                 the spinner, Android only, and an ARRAY
//   progressBackgroundColor the puck behind it, Android only
//
// So `tintColor` alone, which is what the chat lists carried, themes iOS and
// leaves Android on its stock colours: a blue-ish spinner on a white puck, in a
// monochrome app. The wallet had `tintColor` plus `colors: [accent]`, which is
// worse in the dark theme than doing nothing at all, because the dark accent is
// near-white (#F5F5F5) and the puck defaults to white: a white spinner on a
// white disc, showing as the blank white circle it looked like.
//
// Hence a hook rather than three hand-written sets of props. Three lists, one
// appearance, and adding a fourth cannot get it half right.
//
// NOT a wrapper component, deliberately. On Android, ScrollView renders the
// `refreshControl` element as the PARENT of the scroll view, via
// `cloneElement(refreshControl, {style}, <NativeScrollView/>)`. A wrapper that
// did not forward both the injected style and children would drop the entire
// scrollable content on Android. Spreading props keeps a real RefreshControl at
// each call site, which is the only shape that clone is safe with.

import { useMemo } from "react";
import { useThemeColors } from "./theme";

export interface PullRefreshColors {
  tintColor: string;
  colors: string[];
  progressBackgroundColor: string;
}

export function usePullRefreshColors(): PullRefreshColors {
  const Colors = useThemeColors();
  return useMemo(
    () => ({
      // `surface` for the puck, not `surfaceRaised`: the puck floats over the
      // screen background, which is what `surface` is the token for, and it
      // keeps the light theme's familiar white disc while giving the dark theme
      // one that is actually darker than white.
      progressBackgroundColor: Colors.surface,
      // `textSecondary` over `textMuted` for the spinner. A spinner is a
      // meaningful indicator, so it owes 3:1 against its own background (WCAG
      // 1.4.11), the same floor the palette darkened its status dots to clear.
      // On the puck above, textSecondary measures ~7:1 in both themes, where
      // textMuted is ~3.6:1 in the dark one: clearing it, but with no headroom
      // on a shape this thin.
      tintColor: Colors.textSecondary,
      colors: [Colors.textSecondary],
    }),
    [Colors],
  );
}
