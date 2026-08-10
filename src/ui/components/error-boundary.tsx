// The last line between a JavaScript exception and a dead app.
//
// Release React Native has no red box: an exception during render, or handed to
// ErrorUtils from an async path, terminates the process. Airhop parses
// attacker-supplied bytes off the radio on nearly every path, so "this will
// never throw" is not a plan.
//
// Two entry points, because errors arrive two ways:
//
//   ErrorBoundary              React render, lifecycle and hook errors.
//   installGlobalErrorHandler  everything else - an unawaited rejection, a throw
//                              in a native listener, a setTimeout callback.
//
// The mesh does not live in the React tree: MeshService, the radios and the
// relay pool are module state in services/, and none of it unmounts when this
// screen appears. "Try again" remounts onto a mesh that never stopped.

import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { t } from "../../i18n";
import {
  Colors,
  DarkColors,
  FontSize,
  FontWeight,
  MIN_TOUCH,
  Radius,
  Spacing,
} from "../theme";

type ThemeColors = Record<keyof typeof Colors, string>;

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // console, and nothing else. There is no crash reporter and deliberately
    // never will be: the Privacy screen promises no telemetry, and a stack trace
    // from a messenger is what that promise exists to cover. Dev builds land in
    // Metro, release builds in logcat for whoever holds the phone. The tag is
    // one dotted token so the i18n audit reads it as an identifier.
    console.error("Airhop.ErrorBoundary", error, info.componentStack);
  }

  // Called by the shell when a fatal arrives from outside React, so both paths
  // land on the same screen rather than one of them being invisible.
  showError(error: Error): void {
    if (this.state.error !== null) return;
    this.setState({ error });
  }

  private readonly reset = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    if (this.state.error === null) return this.props.children;
    return <Fallback onRetry={this.reset} />;
  }
}

// Not themed through useThemeColors: that hook reads the settings store, which
// reads MMKV, and the failure this screen exists to survive may be the store. A
// fallback that can throw is not a fallback. useColorScheme has nothing behind
// it but the OS config. The cost is that this screen follows the system rather
// than a manual light/dark override.
function Fallback({ onRetry }: { onRetry: () => void }): React.JSX.Element {
  const C: ThemeColors = useColorScheme() === "dark" ? DarkColors : Colors;
  const styles = createStyles(C);
  const [pressed, setPressed] = React.useState(false);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{t("error.boundary.title")}</Text>
      <Text style={styles.body}>{t("error.boundary.body")}</Text>
      <Pressable
        style={[styles.button, pressed && styles.buttonPressed]}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel={t("error.boundary.retry")}
      >
        <Text style={styles.buttonLabel} numberOfLines={1}>
          {t("error.boundary.retry")}
        </Text>
      </Pressable>
    </View>
  );
}

// Installed once per runtime: Fast Refresh re-runs the effect, and chaining onto
// our own previous handler would stack them for the whole dev session. The
// callback lives beside the flag rather than being captured, so re-installing
// swaps where fatals go instead of leaving a ref to an unmounted boundary.
let handlerInstalled = false;
let deliverFatal: ((error: Error) => void) | null = null;

// Chain onto React Native's global handler so errors React never sees reach the
// same screen. Development is unchanged: the red box is the whole debugging
// surface. In release a fatal is intercepted and not passed on, since the
// default handler's job there is to terminate the process.
export function installGlobalErrorHandler(
  onFatal: (error: Error) => void,
): void {
  deliverFatal = onFatal;
  if (handlerInstalled) return;
  handlerInstalled = true;
  const globalWithErrorUtils = globalThis as unknown as {
    ErrorUtils?: {
      getGlobalHandler():
        ((error: unknown, isFatal?: boolean) => void) | undefined;
      setGlobalHandler(
        handler: (error: unknown, isFatal?: boolean) => void,
      ): void;
    };
  };
  const errorUtils = globalWithErrorUtils.ErrorUtils;
  if (errorUtils === undefined) return;

  const previous = errorUtils.getGlobalHandler();
  errorUtils.setGlobalHandler((error, isFatal) => {
    if (isFatal === true && !__DEV__ && deliverFatal !== null) {
      try {
        deliverFatal(error instanceof Error ? error : new Error(String(error)));
      } catch {
        // The fallback itself failed. Fall through to the default handler,
        // which ends the process - there is genuinely nothing left to try.
        previous?.(error, isFatal);
      }
      return;
    }
    previous?.(error, isFatal);
  });
}

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.xl,
      gap: Spacing.sm,
      backgroundColor: C.bg,
    },
    title: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.semibold,
      color: C.textPrimary,
      textAlign: "center",
    },
    body: {
      fontSize: FontSize.sm,
      color: C.textSecondary,
      textAlign: "center",
      lineHeight: FontSize.sm * 1.6,
    },
    // The PrimaryButton pill, restated rather than imported: that component
    // themes through useThemeColors, which is exactly the store read this screen
    // cannot make. Geometry and type are kept identical to it, so the retry looks
    // like every other CTA in the app.
    button: {
      marginTop: Spacing.md,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md + 2,
      minHeight: MIN_TOUCH,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Radius.full,
      backgroundColor: C.accent,
    },
    buttonPressed: {
      opacity: 0.85,
    },
    buttonLabel: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: C.textInverse,
      letterSpacing: 0.1,
    },
  });
}
