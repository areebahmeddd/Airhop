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

import { useT } from "@i18n";
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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { useKeyboardHeight } from "../hooks/use-keyboard";
import { Duration, Radius, Spacing, useThemeColors } from "../theme";

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

// How long after a slide-out should have finished before the sheet unmounts
// itself regardless of what the animation reported.
//
// The Modal used to be unmounted ONLY from withTiming's completion callback,
// which runs on the UI thread. That thread stops producing frames the moment
// the activity is paused, and a paused activity is the single most common thing
// to happen immediately after a sheet closes: the permission primer's Continue
// button resolves startMeshWithPermissions, which opens the OS permission
// dialog on the next tick. The animation was left mid-flight, the callback
// never fired with `finished: true`, and `mounted` stayed true forever.
//
// A React Native Modal is its own window and captures every touch in it, so
// what the user was left holding was the whole app behind a scrim that ate
// every tap - an unresponsive tab bar under a grey sheet, indistinguishable
// from a hang. It survived returning to the app, because nothing re-drove the
// animation.
//
// JS timers keep running while the activity is paused, which is exactly why the
// backstop lives here rather than in another animation callback. The grace is
// generous because beating the animation would cut a healthy close short.
const CLOSE_FALLBACK_MS = CLOSE_TIMING.duration + 200;

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
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const { height: screenHeight } = useWindowDimensions();
  const keyboardHeight = useKeyboardHeight();
  // Read here rather than relied on from a SafeAreaView: the sheet renders
  // inside a Modal, which is a separate view hierarchy that inherits none of
  // the root provider's padding. See the note where this is applied.
  const insets = useSafeAreaInsets();

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
  // The unmount backstop described at CLOSE_FALLBACK_MS.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // How many times the parent has asked for this sheet to be on screen: once on
  // mount if it mounts open, then once per false -> true edge of `visible`.
  const presentation = useRef(0);
  // The presentation a slide-out belongs to. finishClose completes only the
  // presentation it was started for, so a sheet asked for again mid-close is
  // left alone rather than torn down by the previous close.
  //
  // This used to be a plain "is `visible` still true?" test, which is only
  // correct for callers that DRIVE the prop. Every caller that mounts the sheet
  // conditionally passes a constant `visible` instead - channel info, the
  // message action sheet, the add-members picker, the token scanner - and there
  // the prop is true for the sheet's entire life. So a dismissal the user
  // performed (backdrop tap, drag, system back) found `visible` still true,
  // returned early, and never ran setMounted(false) or onClose().
  //
  // The sheet slid off screen and the scrim faded out, so it looked closed. What
  // was actually left behind was a transparent Modal - its own window, covering
  // the app, capturing every touch - so the tab bar and everything under it went
  // dead with nothing on screen to explain why. Comparing presentations instead
  // asks the question that was always meant: "has the parent asked for me AGAIN
  // since this close began?", which a constant `visible` correctly answers no.
  const closingPresentation = useRef(-1);
  // Whether this presentation has already been closed out, so the slower of the
  // animation callback and the timer does nothing.
  const closedRef = useRef(false);
  // True from the moment a slide-out starts until the sheet unmounts. The
  // contents keep rendering while they fly away, and without this a row tapped
  // during those 300ms still fires its action - so a backdrop tap could close
  // the sheet and then a second tap on the same spot could hit whatever was
  // underneath the finger. A closing sheet accepts no more input.
  const [closing, setClosing] = useState(false);

  function clearCloseTimer(): void {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function finishClose(): void {
    clearCloseTimer();
    // Asked for again while the slide-out was in flight. The effect below has
    // already sprung the sheet back up, so completing the close would unmount a
    // sheet the parent is currently asking for.
    if (presentation.current !== closingPresentation.current) return;
    // Whichever of the animation callback and the backstop timer arrives
    // second must not run onClose a second time: several callers reset state
    // in it, and a few of them are not idempotent.
    if (closedRef.current) return;
    closedRef.current = true;
    openedRef.current = false;
    translateY.value = screenHeight;
    setMounted(false);
    setClosing(false);
    if (userDismissedRef.current) onClose();
  }

  // Slide out, then hand control back to the parent.
  function slideOut(byUser: boolean): void {
    // Already on the way out: a second backdrop tap or back press mid-close must
    // not restart the animation from where it has got to, which reads as the
    // sheet stuttering.
    if (closingPresentation.current === presentation.current) return;
    userDismissedRef.current = byUser;
    closingPresentation.current = presentation.current;
    setClosing(true);
    Keyboard.dismiss();
    translateY.value = withTiming(sheetHeight.value, CLOSE_TIMING, (done) => {
      if (done) scheduleOnRN(finishClose);
    });
    // Unmount on a JS timer whichever way the animation goes. finishClose is
    // idempotent, so whichever of the two arrives first wins and the other is a
    // no-op.
    clearCloseTimer();
    closeTimer.current = setTimeout(finishClose, CLOSE_FALLBACK_MS);
  }

  // Every dismissal the user performs - drag, backdrop tap, system back.
  function dismiss(): void {
    slideOut(true);
  }

  useEffect(() => {
    if (visible) {
      // A pending slide-out is now stale, and its backstop must not fire into
      // the presentation this open is starting.
      clearCloseTimer();
      closedRef.current = false;
      // A new presentation, which is what tells a slide-out still in flight
      // that it is closing something the parent has since asked for again.
      presentation.current += 1;
      // Mounting in response to the parent opening us, and cancelling any
      // "on the way out" left by the close this open interrupted. Not derived
      // state: the unmount is deferred until the slide-out finishes, so neither
      // can be the same value as `visible`.
      /* eslint-disable react-hooks/set-state-in-effect */
      setMounted(true);
      setClosing(false);
      /* eslint-enable react-hooks/set-state-in-effect */
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

  // A sheet torn down by its parent mid-close must not leave a timer holding a
  // handle to this component.
  useEffect(() => clearCloseTimer, []);

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
        scheduleOnRN(dismiss);
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
            plumbing.

            The bottom inset is the same idea for the navigation bar. A Modal is
            its own view hierarchy and inherits none of the root
            SafeAreaProvider padding. Gesture navigation hid this; on
            three-button navigation the 48dp bar covered the author-note sheet's
            OK button, where the system consumes the touch.

            max, not sum: the keyboard covers the navigation bar, so adding the
            two would leave a nav-bar-high gap above the keyboard. */}
        <View
          style={[
            styles.root,
            { paddingBottom: Math.max(keyboardHeight, insets.bottom) },
          ]}
          // See `closing`: the sheet is still on screen while it slides away,
          // and a row tapped in that window would run an action for a sheet the
          // user has already dismissed.
          pointerEvents={closing ? "none" : "auto"}
        >
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
            accessibilityLabel={T("common.close")}
          />
          {scrollable ? (
            sheet
          ) : (
            <GestureDetector gesture={pan}>{sheet}</GestureDetector>
          )}
          {/* A Modal is its own window, so the app-root cover does not reach in
              here. Every sheet in the app is this component, so one mount
              covers all of them. */}
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
