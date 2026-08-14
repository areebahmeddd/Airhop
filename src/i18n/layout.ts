// Right-to-left layout helpers.
//
// Most of the work of supporting Arabic and Persian is not translation, it is
// making sure nothing in the stylesheet is nailed to a physical side. React
// Native already does the bulk of that: `flexDirection: "row"` flips on its
// own, and the logical box properties (`marginStart`, `marginEnd`, `start`,
// `end`) resolve per direction. Those are what the codebase uses. The physical
// `marginLeft` and `right` forms do not flip, so a badge pinned to the trailing
// corner stays on the visual right in Arabic and covers the wrong thing.
//
// The two cases the platform has no logical form for are here.
//
// Direction is fixed for the lifetime of the process: I18nManager reads it at
// startup, and `applyLayoutDirection` in ./index.ts pins it to the active
// language there. So these are module constants rather than hooks. Nothing
// here re-renders, and nothing needs to.
//
// They resolve to their left-to-right values while English is the language
// shipping. They are what makes the first right-to-left language a catalog
// rather than a sweep of every stylesheet in the app, and a physical
// `marginLeft` added meanwhile would not be noticed until then.

import { I18nManager } from "react-native";

// Whether the app is currently laid out right to left.
export const isRTLLayout: boolean = I18nManager.isRTL;

// `textAlign` for text that should sit at the trailing edge: a timestamp on a
// conversation row, an amount in a ledger.
//
// React Native's `textAlign` accepts only physical values plus "auto", with no
// logical "end", so this is the standard stand-in. Note that "auto" already
// covers the leading-edge case correctly, which is why there is no
// `textAlignStart` here: use `textAlign: "auto"` and let the text direction
// decide.
export const textAlignEnd: "left" | "right" = isRTLLayout ? "left" : "right";

// Directional glyphs.
//
// Neither platform mirrors icon artwork, and Feather has no logical
// equivalents, so a chevron meaning "forward" has to be picked per direction.
// Getting this wrong is subtle and awful: in Arabic every drill-in row would
// point back the way you came.
//
// Only the glyphs that encode reading direction are here. `arrow-up-right`,
// which marks a row that leaves the app, is deliberately not: it means
// "outward", not "rightward", and both platforms leave it alone.
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

// Mirrors a horizontal offset, for the rare value that has to stay a number.
//
// Use a logical property instead wherever one exists. This is for things like a
// translateX in an animation, where there is no `start`/`end` form and the sign
// is the direction.
/**
 * @public No call site yet: every current animation has a logical form. Kept as
 * the escape hatch for the first one that does not. The tag is load-bearing:
 * knip reads it and stops proposing this as dead code, so it must stay a JSDoc
 * block rather than a line comment.
 */
export function mirrorX(value: number): number {
  return isRTLLayout ? -value : value;
}
