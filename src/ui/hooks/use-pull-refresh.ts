// How a pull-to-refresh spinner is coloured, in one place for every list.
//
// RefreshControl takes a different prop per platform for the same thing and
// silently ignores the other:
//
//   tintColor                the spinner, iOS only
//   colors                   the spinner, Android only, and an ARRAY
//   progressBackgroundColor  the puck behind it, Android only
//
// So `tintColor` alone themes iOS and leaves Android on its stock blue-ish
// spinner. Setting `colors: [accent]` is worse than nothing in the dark theme,
// where the accent is near-white and the puck defaults to white: a white spinner
// on a white disc reads as a blank circle.
//
// Deliberately a hook and NOT a wrapper component. On Android, ScrollView
// renders `refreshControl` as the PARENT of the scroll view, via
// `cloneElement(refreshControl, {style}, <NativeScrollView/>)`. A wrapper that
// did not forward both the injected style and the children would drop the entire
// scrollable content. Spreading props keeps a real RefreshControl at each call
// site, which is the only shape that clone is safe with.

import { useMemo } from "react";
import { useThemeColors } from "../theme";

export interface PullRefreshColors {
  tintColor: string;
  colors: string[];
  progressBackgroundColor: string;
}

export function usePullRefreshColors(): PullRefreshColors {
  const Colors = useThemeColors();
  return useMemo(
    () => ({
      // `surface`, not `surfaceRaised`: the puck floats over the screen
      // background, which is what `surface` is the token for.
      progressBackgroundColor: Colors.surface,
      // A spinner is a meaningful indicator, so it owes 3:1 against its own
      // background (WCAG 1.4.11). On the puck above, textSecondary measures ~7:1
      // in both themes where textMuted is ~3.6:1 in the dark one, which clears
      // the floor with no headroom on a shape this thin.
      tintColor: Colors.textSecondary,
      colors: [Colors.textSecondary],
    }),
    [Colors],
  );
}
