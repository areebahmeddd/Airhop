---
description: >
  Reference for the design system and the interaction rules behind it. Read this
  before adding a component, a style block, or any tappable surface. The
  mistakes that compile are a tap that reports nothing, a target smaller than
  the thing it represents, a nested radius that ignores its own padding, and
  contrast measured against the page rather than the surface an element sits
  on.
---

# UI and UX

Tokens: `src/ui/theme.ts`. Shared components: `src/ui/components/`. Hooks: `src/ui/hooks/`.

| Fact              | Value                                                |
| ----------------- | ---------------------------------------------------- |
| Spacing           | 4pt grid: 4, 8, 12, 16, 20, 24, 32, 48, 64           |
| Type              | 10, 11, 13, 15, 17, 20, 24, 30, 38; 10 is glyph-only |
| Radius            | 2, 6, 10, 14, 20, 28, `full`                         |
| Motion            | `Duration.base` 180ms, `Duration.slow` 220ms         |
| Touch floor       | `MIN_TOUCH` 44                                       |
| Full-width button | `BUTTON_HEIGHT` 50                                   |
| Long press        | `LONG_PRESS_MS` 320                                  |
| Press, disabled   | `PRESSED_OPACITY` 0.85, `DISABLED_OPACITY` 0.4       |
| Palette           | `useThemeColors()`, never `Colors` directly          |

## The Rule

A value is right when a rule produced it and wrong when somebody picked it.

Quality lives in the relationships between elements, not in any element: radius against padding, target against the thing it represents, one gesture's timing against the same gesture elsewhere. None of it shows in a screenshot; all of it shows in the hand.

Corollary: solving something once is half the job. It is finished when the answer is a token, a shared component, or a lint rule. Every drift in this codebase was a correct decision that never propagated.

## Every Tap Reports

Nielsen's first heuristic, and both platforms require it: UIKit highlights a selected cell, Material draws a ripple. A tap that changes nothing until the next screen arrives reads as broken on a slow push, and gets tapped twice.

Two treatments, chosen by what the surface already is:

```tsx
// A neutral fill of its own (row, raised pill): darken.
style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
// rowPressed: { backgroundColor: Colors.surfacePressed }

// An accent fill, or no fill at all (tab, segment): dim.
style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
// ctaPressed: { opacity: PRESSED_OPACITY }
```

A row cannot dim: a white row on an off-white page loses nothing visible. An accent button cannot darken: its fill is the accent, so darkening means recolouring the label, which reads as a state change. Always the `style={({ pressed }) => ...}` callback, never component state, which re-renders twice per tap.

Feedback under 400ms is the point (Doherty). Anything slower needs its own progress.

## Targets Match Their Meaning

Fitts's Law. If a row means "this message", the whole row acts like it. A one-word bubble is a 40pt target inside a full-width row, and the rest of that row must not be inert.

```ts
hitSlopFor(32); // a 32pt glyph stays 32pt on screen and 44pt to a thumb
padding: (MIN_TOUCH - SIZE) / 2, margin: -(MIN_TOUCH - SIZE) / 2; // where hitSlop cannot reach
```

Grow **height only** when targets are adjacent. Two 44pt-wide targets whose centres are 24pt apart overlap, and view order decides the winner rather than the finger, which is worse than the small target was.

## Concentric Radius

```
inner radius = outer radius - padding
```

A rounded box inside a rounded box holds a constant gap around the corner only at that value. Too large and the corners bulge toward each other, too small and they pinch. The eye registers it without naming it.

The scales are built to compose. `Radius.lg` minus `Spacing.xs`, `sm` or `md` lands exactly on `Radius.md`, `sm` or `xs`. Above `lg` they stop lining up, so compute the value rather than reaching for the nearest token.

A hand-typed radius sitting next to a token is the tell that someone eyeballed it.

## Optical, Not Mathematical

- **Letter-spacing** is applied after the last glyph too, so a tracked string measures wider than it draws and centring that box leaves the glyphs half a track short. Cancel it with `marginEnd: -TRACKING`, or by trimming the trailing padding on a pill.
- **`includeFontPadding: false`** on any digit centred in a circle. Android-only and on by default, it reserves ascender and descender room a digit never uses, so a numeral that centres on iOS sits low on Android.
- **An optical nudge on one side needs its mirror on the other**, or the box it centres in is asymmetric and the centred text lands off by half the nudge.
- **Display figures** want leading pulled in to the font size and slight negative tracking. Default 1.1 leading at 38pt leaves a band of dead space under the digits.

## Grouping

Common Region, Proximity, Similarity.

A group's hairline insets to where the **label** starts, never to the row's padding. Inset to the padding it slices the icon column; inset to the label the column reads as a clean channel. UIKit's `separatorInset` and Material's divider keyline agree.

```ts
const ROW_LABEL_INSET = ICON_WIDTH + Spacing.base + Spacing.sm; // derived, not typed
```

Things that are the same object must match in **every** property. Three badges at the same size with three different line heights are three objects to the eye.

## Contrast Floors

| What                                          | Floor   | Source                                |
| --------------------------------------------- | ------- | ------------------------------------- |
| Body text                                     | 4.5:1   | WCAG 1.4.3                            |
| Non-text UI: checkbox ring, status dot, thumb | 3:1     | WCAG 1.4.11                           |
| Touch target                                  | 24 x 24 | WCAG 2.5.8, 44 is the practical floor |

Measure against the surface the element **actually sits on**, not the page. Text on a selection wash is on the wash.

Shadows do not read on a dark canvas, so anything relying on one for separation carries a hairline too. Check that a raised surface is still lighter than its track in dark mode: `surface` is darker than `surfaceRaised` there, so a naive lift inverts.

## Speak the User's Language

Nielsen's second heuristic. Never surface protocol vocabulary. "0 mints, 0 proofs" is the wallet describing its own plumbing in the most prominent slot on the screen.

Say nothing rather than something empty. A card with nothing to report reports nothing; the conditional notes that appear only when relevant are the ones that read as personal.

An alert demands a tap for news nobody needs to acknowledge. Use `Toast` or an in-place tick for confirmations, and keep an alert only where it carries information the user must act on. Never delete real information just to remove a dialog.

## Motion and Haptics

Durations come from `Duration`, so a list reorder, a sheet dismissal and a toast fade read as one app moving. Reanimated defaults to `ReduceMotion.System` and needs no second gate; `Animated.loop` does, via `useReducedMotion()`.

Haptics come from `@platform/haptics` by name, never `expo-haptics` directly. This is lint-enforced. A gesture threshold that changes the outcome earns a tick, because a threshold is otherwise invisible: the scrim fades continuously and says nothing about where the line is.

## What Not to Do

| Mistake                                     | Correct approach                                                    |
| ------------------------------------------- | ------------------------------------------------------------------- |
| A `Pressable` with no pressed style         | Add the treatment for its surface kind                              |
| A literal `50`, `320` or `0.85` in a style  | `BUTTON_HEIGHT`, `LONG_PRESS_MS`, `PRESSED_OPACITY`                 |
| A hand-picked inner radius                  | `outer - padding`                                                   |
| Contrast checked against the page           | Check against the surface the element sits on                       |
| The same object styled in two files         | One shared component, or one token                                  |
| A count or an ID the user has no word for   | Say what it means, or say nothing                                   |
| `setState` on a timer with no cleanup       | Ref it and clear on unmount; sheets close fastest right after a tap |
| Importing `Colors` or `DarkColors` directly | `useThemeColors()`, or the screen ignores the theme setting         |
| A hand-rolled `Modal` for a sheet           | `BottomSheet`; it owns the drag, scrim and keyboard avoidance       |

## Where to Read More

- [Laws of UX](https://lawsofux.com/) for the named laws: Fitts, Hick, Jakob, Doherty, Prägnanz, Common Region, Similarity
- [Nielsen's 10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) for 1.4.3, 1.4.11, 2.3.3 and 2.5.8
- Apple Human Interface Guidelines and Material Design 3, for the conventions the two agree on
