// The one bottom sheet in the app.
//
// Every sheet - channel info, contact info, the attach picker, the wallet's
// send/receive panels - used to be a hand-rolled `<Modal animationType="slide">`
// with its own overlay and a decorative grab handle that did nothing. They all
// behaved slightly differently and none of them could be dragged, which reads as
// broken: a grabber is an affordance, and an affordance that ignores your finger
// is worse than no affordance at all.
//
// This owns the parts that should never differ between sheets:
//
//   * the scrim, whose opacity tracks the sheet's position so a half-dragged
//     sheet shows a half-lit backdrop rather than a full one,
//   * a real drag: the sheet follows your finger and dismisses on either a long
//     enough pull or a fast enough flick, springing back otherwise,
//   * keyboard avoidance, since a sheet with a text field in it is the single
//     most common place for the keyboard to swallow the thing you're typing in,
//   * back-button / backdrop-tap dismissal, and the slide-out animation that
//     goes with them.
//
// Callers keep their own `sheetStyle`, so converting a sheet is a matter of
// deleting its Modal/overlay/handle boilerplate, not restyling it.
//
// The two rules disabled below model plain React values, where writing to
// something an effect or a callback captured is a real bug. Reanimated's shared
// values are the opposite: a `.value` write is the entire mechanism, it runs on
// the UI thread, and it deliberately does not go through React. There is no way
// to drive a finger-following drag without one, so the rules are off for this
// file only - every other file in the app keeps them.
/* eslint-disable react-hooks/immutability, react-hooks/refs */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Duration, Radius, Spacing, useThemeColors } from "../theme";
import { useKeyboardHeight } from "../use-keyboard";

// Pull further than this share of the sheet's own height and letting go
// dismisses instead of springing back. A third is the familiar iOS/Material
// threshold: far enough that a stray drag doesn't close anything, near enough
// that a deliberate pull never feels like it was ignored.
const DISMISS_DISTANCE_RATIO = 0.33;
// ...or flick faster than this (points/second), whichever happens first, so a
// quick flick from the top of the sheet closes it without a full-height drag.
const DISMISS_VELOCITY = 900;

// Crisp, barely-bouncy settle. Sheets are utilitarian here; an overshoot that
// reads as playful on a photo app reads as sloppy on a messenger.
const OPEN_SPRING = { damping: 26, stiffness: 280, mass: 0.9 } as const;
const CLOSE_TIMING = {
  duration: Duration.slow,
  easing: Easing.out(Easing.cubic),
} as const;

interface Props {
  visible: boolean;
  // Called once the sheet has finished sliding out, never mid-animation, so a
  // parent that unmounts on close doesn't cut the animation short. Only fired
  // for dismissals the sheet itself initiated (drag, backdrop, back button):
  // when the parent flips `visible` to false it already knows.
  onClose: () => void;
  children: React.ReactNode;
  // The caller's existing sheet style (background, padding, radius, maxHeight).
  // Applied over the shared base, so anything it sets wins.
  sheetStyle?: StyleProp<ViewStyle>;
  // Set on sheets whose body scrolls. The drag then lives on the grab handle
  // alone, so a downward swipe inside a list scrolls the list instead of
  // fighting it for the gesture.
  scrollable?: boolean;
  // Override the scrim colour. Only for sheets that review media, where the
  // standard scrim isn't dark enough to stop the screen behind competing with
  // the photo being previewed.
  scrimColor?: string;
}

export default function BottomSheet({
  visible,
  onClose,
  children,
  sheetStyle,
  scrollable = false,
  scrimColor,
}: Props): React.JSX.Element | null {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const { height: screenHeight } = useWindowDimensions();
  const keyboardHeight = useKeyboardHeight();

  // Kept mounted across the slide-out so the exit animation can play even when
  // the parent flips `visible` to false.
  const [mounted, setMounted] = useState(visible);

  // Distance the sheet sits below its resting position: 0 is fully open.
  const translateY = useSharedValue(screenHeight);
  // Measured on layout; the scrim's opacity and the dismiss threshold are both
  // expressed relative to it.
  const sheetHeight = useSharedValue(screenHeight);
  const dragStart = useSharedValue(0);
  // Whether the open animation has already run for this presentation. The sheet
  // can't animate in until layout has told us how tall it is.
  const openedRef = useRef(false);
  // Who started the current slide-out. A dismissal the user performed (drag,
  // backdrop, back button) has to tell the parent; one the parent asked for
  // does not, and telling it again would re-run an onClose that often resets
  // state.
  const userDismissedRef = useRef(false);

  function finishClose(): void {
    openedRef.current = false;
    translateY.value = screenHeight;
    setMounted(false);
    if (userDismissedRef.current) onClose();
  }

  // Slide out, then hand control back to the parent.
  function slideOut(byUser: boolean): void {
    userDismissedRef.current = byUser;
    Keyboard.dismiss();
    translateY.value = withTiming(sheetHeight.value, CLOSE_TIMING, (done) => {
      if (done) runOnJS(finishClose)();
    });
  }

  // Every dismissal the user performs - drag, backdrop tap, system back.
  function dismiss(): void {
    slideOut(true);
  }

  useEffect(() => {
    if (visible) {
      // Mounting in response to the parent opening us. Not derived state: the
      // unmount is deferred until the slide-out finishes, so the two can't be
      // the same value.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      // Reopened while still sliding out (a sheet closed and immediately shown
      // again). Layout won't fire a second time, so nothing else would bring it
      // back up; springing here also cancels the pending slide-out, whose
      // completion callback then sees `finished: false` and leaves us alone.
      if (openedRef.current) translateY.value = withSpring(0, OPEN_SPRING);
    } else if (mounted) {
      // Parent closed us (an action row was tapped, say) rather than the user
      // dragging: play the same slide-out so both paths look identical.
      slideOut(false);
    }
    // `mounted` and `slideOut` are deliberately not dependencies: reacting to
    // either would re-run this on the render the branches above cause.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // First real layout: drop the sheet to just below the screen edge and spring
  // it up. Measuring first is what keeps the travel distance equal to the
  // sheet's own height, so a short sheet doesn't fly in from the far bottom.
  function handleLayout(height: number): void {
    if (height <= 0) return;
    sheetHeight.value = height;
    if (openedRef.current) return;
    openedRef.current = true;
    translateY.value = height;
    translateY.value = withSpring(0, OPEN_SPRING);
  }

  // Rebuilt each render rather than memoized: a sheet renders a handful of
  // times in its life, and memoizing it would mean mutating shared values from
  // inside a memo closure, which the compiler rules (rightly) disallow for
  // ordinary values.
  const pan = Gesture.Pan()
    // Downward only, and only past a deliberate 10pt: taps on the rows inside
    // the sheet must still register as taps.
    .activeOffsetY(10)
    .failOffsetX([-24, 24])
    .onStart(() => {
      dragStart.value = translateY.value;
    })
    .onUpdate((e) => {
      // Clamped at 0: the sheet is anchored to the bottom, so pulling up has
      // nowhere to go and rubber-banding there would just look loose.
      translateY.value = Math.max(0, dragStart.value + e.translationY);
    })
    .onEnd((e) => {
      const far = translateY.value > sheetHeight.value * DISMISS_DISTANCE_RATIO;
      if (far || e.velocityY > DISMISS_VELOCITY) {
        runOnJS(dismiss)();
      } else {
        translateY.value = withSpring(0, OPEN_SPRING);
      }
    });

  const sheetAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Scrim fades in step with the sheet, so the backdrop always reads as
  // attached to it rather than as a separate layer that snaps on and off.
  const scrimAnim = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, sheetHeight.value],
      [1, 0],
      "clamp",
    ),
  }));

  if (!mounted) return null;

  const sheet = (
    <Animated.View
      style={[styles.sheet, sheetStyle, sheetAnim]}
      onLayout={(e) => handleLayout(e.nativeEvent.layout.height)}
    >
      {/* On a scrolling sheet the handle is the only drag surface, so it gets a
          padded hit area of its own rather than being a 4pt-tall target. */}
      {scrollable ? (
        <GestureDetector gesture={pan}>
          <View style={styles.grabZone}>
            <View style={styles.handle} />
          </View>
        </GestureDetector>
      ) : (
        <View style={styles.handle} />
      )}
      {children}
    </Animated.View>
  );

  return (
    <Modal
      visible
      transparent
      // The slide is ours: RN's would fight the drag translation.
      animationType="none"
      onRequestClose={dismiss}
    >
      {/* A Modal is its own view hierarchy, outside the root provider in
          App.tsx, so gesture handler needs a root of its own in here or the
          drag never receives touches on Android. */}
      <GestureHandlerRootView style={styles.flexFill}>
        {/* Lifting the whole stack by the keyboard height keeps each sheet's own
            layout intact - it just has less room to lay out in - which is what
            makes a text field inside a sheet stay visible with no per-sheet
            plumbing. */}
        <View style={[styles.root, { paddingBottom: keyboardHeight }]}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.scrim,
              scrimColor !== undefined && { backgroundColor: scrimColor },
              scrimAnim,
            ]}
            pointerEvents="none"
          />
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismiss}
            accessibilityRole="button"
            accessibilityLabel="Close"
          />
          {scrollable ? (
            sheet
          ) : (
            <GestureDetector gesture={pan}>{sheet}</GestureDetector>
          )}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    flexFill: {
      flex: 1,
    },
    root: {
      flex: 1,
      justifyContent: "flex-end",
    },
    scrim: {
      backgroundColor: Colors.overlay,
    },
    // Base every sheet shares. The caller's own style lands on top of this, so
    // a sheet that wants a different padding or a maxHeight still gets it.
    sheet: {
      maxHeight: "100%",
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
    },
    // The grabber owns the space above the sheet's content, so a converted
    // sheet drops its own paddingTop rather than stacking one on the other.
    handle: {
      width: 36,
      height: 4,
      borderRadius: Radius.xs,
      backgroundColor: Colors.borderStrong,
      alignSelf: "center",
      marginTop: Spacing.sm,
      marginBottom: Spacing.md,
    },
    grabZone: {
      paddingBottom: Spacing.xs,
    },
  });
}
