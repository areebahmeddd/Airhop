// Right-to-left layout helpers: the cases React Native has no logical form for.
//
// Everywhere else the codebase uses `marginStart`/`marginEnd`/`start`/`end`,
// which resolve per direction on their own. The physical forms do not flip, so
// a badge pinned with `right` stays on the visual right in Arabic.
//
// Module constants, not hooks: I18nManager reads direction at startup and
// `applyLayoutDirection` pins it there, so nothing here re-renders.

import { I18nManager } from "react-native";

// Whether the app is currently laid out right to left.
export const isRTLLayout: boolean = I18nManager.isRTL;

// `textAlign` for the trailing edge: a row timestamp, a ledger amount. React
// Native offers no logical "end". There is no `textAlignStart` because "auto"
// already resolves the leading edge correctly.
export const textAlignEnd: "left" | "right" = isRTLLayout ? "left" : "right";

// Neither platform mirrors icon artwork and Feather has no logical names, so a
// chevron meaning "forward" is picked per direction: otherwise every drill-in
// row in Arabic points back the way you came. Only glyphs that encode reading
// direction belong here. `arrow-up-right` does not, since it means "outward".
export const chevronForward: "chevron-left" | "chevron-right" = isRTLLayout
  ? "chevron-left"
  : "chevron-right";

export const chevronBack: "chevron-left" | "chevron-right" = isRTLLayout
  ? "chevron-right"
  : "chevron-left";

export const arrowBack: "arrow-left" | "arrow-right" = isRTLLayout
  ? "arrow-right"
  : "arrow-left";

export const arrowForward: "arrow-left" | "arrow-right" = isRTLLayout
  ? "arrow-left"
  : "arrow-right";

// Mirrors a horizontal offset, for a value that has to stay a number: a
// translateX, where the sign is the direction and there is no `start`/`end`.
/**
 * @public No call site yet, kept as the escape hatch for the first animation
 * without a logical form. knip reads the tag, so it stays a JSDoc block.
 */
export function mirrorX(value: number): number {
  return isRTLLayout ? -value : value;
}

// Row swipe actions on the trailing edge. ReanimatedSwipeable names its panels
// by physical side, so `renderRightActions` opens from the right in every
// language, which on a mirrored row is the leading edge.
export function trailingSwipeActions<T>(
  render: T,
):
  | { renderLeftActions: T; overshootLeft: false }
  | { renderRightActions: T; overshootRight: false } {
  return isRTLLayout
    ? { renderLeftActions: render, overshootLeft: false }
    : { renderRightActions: render, overshootRight: false };
}
