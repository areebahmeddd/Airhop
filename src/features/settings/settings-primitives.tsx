// Shared building blocks for the settings hub and its sub-screens: the
// bordered-group row list, the back-header and scroll body, and the bottom-sheet
// pattern. One shared StyleSheet so every sub-screen matches pixel-for-pixel.
//
// It also owns the search-highlight plumbing, for the same reason it owns the
// row: search names a row on a screen it does not render.

import Feather from "@expo/vector-icons/Feather";
import { useT } from "@i18n";
import { chevronBack, chevronForward } from "@i18n/layout";
import {
  BUTTON_HEIGHT,
  DISABLED_OPACITY,
  FontFamily,
  FontSize,
  FontWeight,
  HIT_SLOP,
  MIN_TOUCH,
  PRESSED_OPACITY,
  Radius,
  Spacing,
  TAB_BAR_CLEARANCE,
  useThemeColors,
} from "@ui/theme";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  type ScrollViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SettingId } from "./settings-index";

// Circle diameters for the two round shapes in the shared sheet vocabulary: the
// icon medallion at the top of a confirm sheet, and an option row's leading dot.
// Named so their radii cannot drift off centre.
const SHEET_ICON_SIZE = 48;
const OPTION_DOT_SIZE = 34;

// The fixed leading column every row reserves for its icon, with or without
// one, so labels line up down the group.
const SETTING_ICON_WIDTH = 22;

// Where a row's label starts. A group's hairline is inset to exactly this:
// UIKit's separatorInset and Material's divider keyline both align to the
// label, never to the icon.
const ROW_LABEL_INSET = SETTING_ICON_WIDTH + Spacing.base + Spacing.sm;

// One theme-reactive StyleSheet shared by the settings hub and every
// sub-screen, so light/dark mode stays pixel-for-pixel consistent across
// all of them. Call useSharedStyles() inside any component that needs it.
export function useSharedStyles() {
  const Colors = useThemeColors();
  // RN's Modal renders outside the screen's own SafeAreaView, so the bottom
  // sheet's fixed padding alone doesn't clear a device's gesture-nav inset.
  // Taller sheets (e.g. the panic-wipe confirm, which stacks an icon, title,
  // a two-line subtitle, and a button row) can end up with their actions
  // sitting under the system bar. Bake the real inset into `sheet` itself so
  // every bottom sheet stays clear of it.
  const insets = useSafeAreaInsets();
  return useMemo(() => {
    const base = createStyles(Colors);
    return {
      ...base,
      sheet: {
        ...base.sheet,
        paddingBottom: base.sheet.paddingBottom + insets.bottom,
      },
    };
  }, [Colors, insets.bottom]);
}

// ---- Search highlight ----
//
// Two contexts, because the halves have different owners: the hub knows which
// row is wanted and holds it across the screen change, while the scroll view
// that has to move belongs to the screen the result lands on.
const HighlightContext = createContext<SettingId | null>(null);
const RevealContext = createContext<((node: View) => void) | null>(null);

// Long enough to find after the scroll settles, short enough not to read as a
// selection.
const HIGHLIGHT_MS = 2400;

// Space left above a revealed row, so it lands inside the list.
const REVEAL_INSET = Spacing.xl;

// Names the row every screen below points at. `onExpire` must be stable, or the
// timer restarts each render and the highlight never clears.
export function SettingsHighlightProvider({
  id,
  onExpire,
  children,
}: {
  id: SettingId | null;
  onExpire: () => void;
  children: React.ReactNode;
}): React.JSX.Element {
  useEffect(() => {
    if (id === null) return;
    const timer = setTimeout(onExpire, HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [id, onExpire]);
  return (
    <HighlightContext.Provider value={id}>{children}</HighlightContext.Provider>
  );
}

// The scroll body every settings screen puts under its header, and the only
// thing that can scroll a highlighted row into view.
//
// `contentContainerStyle` is excluded: the content box moved onto a real View
// inside, so passing one would be silently ignored. Every other ScrollView prop
// passes through, which is how the hub keeps its scroll-position bookkeeping.
export const SettingsScroll = React.forwardRef<
  ScrollView,
  Omit<ScrollViewProps, "contentContainerStyle"> & {
    children: React.ReactNode;
  }
>(function SettingsScroll({ children, ...scrollProps }, forwardedRef) {
  const styles = useSharedStyles();
  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<View>(null);

  const reveal = useCallback((node: View) => {
    const content = contentRef.current;
    if (content === null) return;
    // Against the content view, not the window: scrollTo wants an offset into
    // the content, which is exactly what this returns.
    node.measureLayout(
      content,
      (_x, y) => {
        scrollRef.current?.scrollTo({
          y: Math.max(0, y - REVEAL_INSET),
          animated: true,
        });
      },
      () => {
        // The row went away between layout and measure. Nothing to scroll to.
      },
    );
  }, []);

  return (
    <RevealContext.Provider value={reveal}>
      <ScrollView
        ref={(node) => {
          scrollRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef !== null) forwardedRef.current = node;
        }}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {/* The content padding rides on a real View rather than
            contentContainerStyle, so rows have an ancestor to measure against.
            Identical box either way. */}
        <View ref={contentRef} style={styles.content} collapsable={false}>
          {children}
        </View>
      </ScrollView>
    </RevealContext.Provider>
  );
});

// Wire one row up to the highlight. Exported as the escape hatch for rows built
// by hand rather than from SettingRow (the panic-wipe row).
export function useSettingHighlight(id: SettingId | undefined): {
  ref: React.RefObject<View | null>;
  active: boolean;
  onLayout: () => void;
} {
  const highlighted = useContext(HighlightContext);
  const reveal = useContext(RevealContext);
  const ref = useRef<View>(null);
  const active = id !== undefined && id === highlighted;

  // From onLayout, not an effect: a measure taken before native layout comes
  // back as zeroes. Once per activation, or a later relayout (a switch flips, a
  // byte count arrives) would yank an already-scrolled list back.
  const revealed = useRef(false);
  useEffect(() => {
    if (!active) revealed.current = false;
  }, [active]);

  const onLayout = useCallback(() => {
    if (!active || revealed.current || reveal === null) return;
    const node = ref.current;
    if (node === null) return;
    revealed.current = true;
    reveal(node);
  }, [active, reveal]);

  return { ref, active, onLayout };
}

// ---- SettingRow: leading icon, label/description, trailing control ----

export interface SettingRowProps {
  // Set on a row settings search can name; also its highlight target.
  id?: SettingId;
  icon?: keyof typeof Feather.glyphMap;
  // Escape hatch for the rare row whose icon isn't in Feather's set (e.g. a
  // currency glyph from another icon family). Takes precedence over `icon`.
  iconOverride?: React.ReactNode;
  label: string;
  description?: string;
  control?: React.ReactNode;
}

export function SettingRow({
  id,
  icon,
  iconOverride,
  label,
  description,
  control,
}: SettingRowProps): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const { ref, active, onLayout } = useSettingHighlight(id);
  return (
    <View
      ref={ref}
      // Only a row search can name pays for a layout callback.
      onLayout={id === undefined ? undefined : onLayout}
      style={[styles.settingRow, active && styles.rowHighlighted]}
    >
      <View style={styles.settingIcon}>
        {iconOverride ??
          (icon && (
            <Feather name={icon} size={18} color={Colors.textSecondary} />
          ))}
      </View>
      <View style={styles.settingLabelGroup}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description ? (
          <Text style={styles.settingDescription}>{description}</Text>
        ) : null}
      </View>
      {control ? <View style={styles.settingControl}>{control}</View> : null}
    </View>
  );
}

// A pressable variant of SettingRow for rows that navigate or open a link.
// `chevron` defaults to true (drill-in affordance); pass false for rows that
// already show their own trailing control (e.g. a value or a switch).
// `external` swaps that chevron for an outgoing-arrow glyph, marking rows
// that leave the app (browser, mail client, GitHub) rather than navigate
// to another in-app screen.
export function SettingLinkRow({
  id,
  icon,
  iconOverride,
  label,
  description,
  control,
  onPress,
  chevron = true,
  external = false,
  accessibilityLabel,
}: SettingRowProps & {
  onPress: () => void;
  chevron?: boolean;
  external?: boolean;
  accessibilityLabel?: string;
}): React.JSX.Element {
  const Colors = useThemeColors();
  const T = useT();
  const styles = useSharedStyles();
  const { ref, active, onLayout } = useSettingHighlight(id);
  return (
    <Pressable
      ref={ref}
      onLayout={id === undefined ? undefined : onLayout}
      style={({ pressed }) => [
        styles.settingRow,
        active && styles.rowHighlighted,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        external
          ? T("settings.opens_externally", {
              label: accessibilityLabel ?? label,
            })
          : (accessibilityLabel ?? label)
      }
    >
      <View style={styles.settingIcon}>
        {iconOverride ??
          (icon && (
            <Feather name={icon} size={18} color={Colors.textSecondary} />
          ))}
      </View>
      <View style={styles.settingLabelGroup}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description ? (
          <Text style={styles.settingDescription}>{description}</Text>
        ) : null}
      </View>
      {control ? <View style={styles.settingControl}>{control}</View> : null}
      {external ? (
        <Feather name="arrow-up-right" size={15} color={Colors.textMuted} />
      ) : (
        chevron && (
          <Feather name={chevronForward} size={16} color={Colors.textMuted} />
        )
      )}
    </Pressable>
  );
}

// ---- SettingSwitch: the one switch every settings row uses ----

// RN's Switch defaults are tuned for a light canvas, so the palette is set
// here once rather than per row. The thumb stays white in both themes: on
// dark it was reading as a hole punched in the green track, and against the
// off-track it all but vanished. The off-track uses borderStrong so the
// control still has a visible outline sitting on a surface-colored row.
// A disabled switch is dimmed rather than recolored: it still reads as on or
// off at a glance, just plainly not yours to change. RN greys the control
// inconsistently across platforms, so the opacity is set here.
export function SettingSwitch({
  style,
  ...props
}: React.ComponentProps<typeof Switch>): React.JSX.Element {
  const Colors = useThemeColors();
  return (
    <Switch
      trackColor={{ false: Colors.borderStrong, true: Colors.online }}
      thumbColor="#FFFFFF"
      ios_backgroundColor={Colors.borderStrong}
      style={[props.disabled === true && { opacity: DISABLED_OPACITY }, style]}
      {...props}
    />
  );
}

export function GroupDivider(): React.JSX.Element {
  const styles = useSharedStyles();
  return <View style={styles.groupDivider} />;
}

// ---- Sub-screen header: back chevron + title, matches message-thread.tsx ----

interface SubHeaderProps {
  title: string;
  onBack: () => void;
}

export function SubHeader({
  title,
  onBack,
}: SubHeaderProps): React.JSX.Element {
  const Colors = useThemeColors();
  const T = useT();
  const styles = useSharedStyles();
  return (
    <View style={styles.subHeader}>
      <Pressable
        onPress={onBack}
        style={styles.subHeaderBack}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={T("settings.back")}
      >
        <Feather name={chevronBack} size={24} color={Colors.textPrimary} />
      </Pressable>
      {/* The screen's name, so a screen reader announces where the drill-in
          landed. Twelve sub-screens share this header and none of them was
          exposing a heading. */}
      <Text style={styles.subHeaderTitle} accessibilityRole="header">
        {title}
      </Text>
      <View style={styles.subHeaderSpacer} />
    </View>
  );
}

// ---- Shared style sheet ----

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    content: {
      padding: Spacing.base,
      gap: Spacing.md,
      paddingBottom: TAB_BAR_CLEARANCE,
    },
    subHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.base,
      // minHeight, so a wrapped title at large system font is not clipped.
      // Shared by every settings sub-screen.
      minHeight: 56,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
      backgroundColor: Colors.bg,
    },
    subHeaderBack: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      marginStart: -Spacing.xs,
    },
    subHeaderTitle: {
      flex: 1,
      fontSize: FontSize.md,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      textAlign: "center",
    },
    // Mirrors subHeaderBack, negative margin included, or the title's flex box
    // is asymmetric and its centred text lands 2pt off centre.
    subHeaderSpacer: {
      width: 32,
      marginEnd: -Spacing.xs,
    },
    section: {
      gap: Spacing.sm,
      marginTop: Spacing.sm,
    },
    sectionTitle: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      paddingHorizontal: Spacing.xs,
    },
    settingsGroup: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      overflow: "hidden",
    },
    groupDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginStart: ROW_LABEL_INSET,
    },
    // A row with a description is comfortably past the touch floor already; one
    // without (a bare label plus a switch, which is most of Network and General)
    // came to ~39pt. The minimum only ever affects those.
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      minHeight: MIN_TOUCH,
      gap: Spacing.sm,
    },
    // Shared by the settings rows and the grouped option lists.
    rowPressed: {
      backgroundColor: Colors.surfacePressed,
    },
    // The row a search result pointed at, lit for a beat once scrolled into
    // view. Same raised fill a selected option row wears.
    rowHighlighted: {
      backgroundColor: Colors.surfaceRaised,
    },
    settingIcon: {
      width: SETTING_ICON_WIDTH,
      flexShrink: 0,
    },
    settingLabelGroup: {
      flex: 1,
      gap: 2,
    },
    settingLabel: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
    },
    settingDescription: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      lineHeight: FontSize.xs * 1.5,
    },
    // The trailing value on a settings row, in the prose face by default.
    //
    // Most of what sits here is words rather than data ("Grant", "High",
    // "7 days"), and JetBrains Mono covers three of the thirteen scripts Airhop
    // ships. Prose by default means a value added later cannot land in a face
    // with no glyphs for it unless somebody chooses to put it there.
    settingValue: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    // For the rows whose value really is machine data: a version, a byte count,
    // a peer tally, an SPDX identifier. Digits are pinned to Latin everywhere
    // (see `@utils/format`), so tabular figures are the whole point here.
    settingValueMono: {
      fontFamily: FontFamily.mono,
    },
    settingValueMuted: {
      opacity: DISABLED_OPACITY,
    },
    settingControl: {
      flexShrink: 0,
    },
    alwaysOn: {
      fontSize: FontSize.sm,
      color: Colors.online,
      fontWeight: FontWeight.medium,
    },
    comingSoon: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontWeight: FontWeight.medium,
    },
    sheet: {
      width: "100%",
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing["2xl"],
      alignItems: "center",
      gap: Spacing.md,
    },
    sheetIconWrap: {
      width: SHEET_ICON_SIZE,
      height: SHEET_ICON_SIZE,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginTop: Spacing.xs,
    },
    sheetTitle: {
      alignSelf: "stretch",
      textAlign: "auto",
      fontSize: FontSize.md,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    sheetSubtitle: {
      alignSelf: "stretch",
      textAlign: "auto",
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: FontSize.sm * 1.5,
    },
    sheetActions: {
      width: "100%",
      marginTop: Spacing.xs,
    },
    sheetBtn: {
      width: "100%",
      minHeight: BUTTON_HEIGHT,
      marginTop: Spacing.sm,
      paddingVertical: Spacing.md,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: Colors.borderStrong,
      backgroundColor: Colors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center",
    },
    sheetBtnPrimary: {
      width: "100%",
      minHeight: BUTTON_HEIGHT,
      paddingVertical: Spacing.md,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    sheetBtnText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    sheetBtnTextPrimary: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
    },
    // Applied by the screens that use the pair: the styles live here, the
    // Pressables do not.
    sheetBtnPressed: {
      backgroundColor: Colors.surfacePressed,
    },
    sheetBtnPrimaryPressed: {
      opacity: PRESSED_OPACITY,
    },
    // A sheet whose option list is longer than the sheet. The language picker
    // ships with ten entries and targets thirty, so it scrolls from the start
    sheetScroll: {
      width: "100%",
      maxHeight: 380,
    },
    // Grouped modal option list: one bounded box holding every choice, rows
    // separated by hairlines rather than each row carrying its own border.
    // Selection reads from the check plus a raised row background.
    optionGroup: {
      width: "100%",
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      overflow: "hidden",
    },
    optionRowGrouped: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      minHeight: 60,
    },
    optionRowGroupedSelected: {
      backgroundColor: Colors.surfaceRaised,
    },
    optionList: {
      width: "100%",
      gap: Spacing.sm,
    },
    optionRow: {
      minHeight: 60,
      justifyContent: "center",
      padding: Spacing.sm,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceRaised,
    },
    optionRowSelected: {
      borderColor: Colors.textPrimary,
      backgroundColor: Colors.surface,
    },
    optionRowInner: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
    },
    optionDot: {
      width: OPTION_DOT_SIZE,
      height: OPTION_DOT_SIZE,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    optionText: {
      flex: 1,
      gap: 2,
    },
    optionLabel: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    optionDescription: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      lineHeight: FontSize.xs * 1.4,
    },
  });
}
