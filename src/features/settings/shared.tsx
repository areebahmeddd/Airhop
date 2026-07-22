// Shared building blocks for the settings hub and its sub-screens: the
// bordered-group row list pattern, the back-header used by every drill-in
// screen, and the bottom-sheet modal pattern (handle bar, title, actions).
// One shared StyleSheet so every sub-screen matches pixel-for-pixel.

import Feather from "@expo/vector-icons/Feather";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";

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

// ---- SettingRow: leading icon, label/description, trailing control --------

export interface SettingRowProps {
  icon?: keyof typeof Feather.glyphMap;
  // Escape hatch for the rare row whose icon isn't in Feather's set (e.g. a
  // currency glyph from another icon family). Takes precedence over `icon`.
  iconOverride?: React.ReactNode;
  label: string;
  description?: string;
  control?: React.ReactNode;
}

export function SettingRow({
  icon,
  iconOverride,
  label,
  description,
  control,
}: SettingRowProps): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  return (
    <View style={styles.settingRow}>
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
  const styles = useSharedStyles();
  return (
    <Pressable
      style={styles.settingRow}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        external
          ? `${accessibilityLabel ?? label}, opens outside the app`
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
          <Feather name="chevron-right" size={16} color={Colors.textMuted} />
        )
      )}
    </Pressable>
  );
}

// ---- SettingSwitch: the one switch every settings row uses ----------------

// RN's Switch defaults are tuned for a light canvas, so the palette is set
// here once rather than per row. The thumb stays white in both themes: on
// dark it was reading as a hole punched in the green track, and against the
// off-track it all but vanished. The off-track uses borderStrong so the
// control still has a visible outline sitting on a surface-colored row.
export function SettingSwitch(
  props: React.ComponentProps<typeof Switch>,
): React.JSX.Element {
  const Colors = useThemeColors();
  return (
    <Switch
      trackColor={{ false: Colors.borderStrong, true: Colors.online }}
      thumbColor="#FFFFFF"
      ios_backgroundColor={Colors.borderStrong}
      {...props}
    />
  );
}

export function GroupDivider(): React.JSX.Element {
  const styles = useSharedStyles();
  return <View style={styles.groupDivider} />;
}

// ---- Sub-screen header: back chevron + title, matches message-thread.tsx --

interface SubHeaderProps {
  title: string;
  onBack: () => void;
}

export function SubHeader({
  title,
  onBack,
}: SubHeaderProps): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  return (
    <View style={styles.subHeader}>
      <Pressable
        onPress={onBack}
        style={styles.subHeaderBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
      </Pressable>
      <Text style={styles.subHeaderTitle}>{title}</Text>
      <View style={styles.subHeaderSpacer} />
    </View>
  );
}

// ---- Shared style sheet -----------------------------------------------------

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    content: {
      padding: Spacing.base,
      gap: Spacing.md,
      paddingBottom: Spacing["3xl"],
    },
    // Sub-screen back header
    subHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.base,
      height: 56,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
      backgroundColor: Colors.bg,
    },
    subHeaderBack: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: -Spacing.xs,
    },
    subHeaderTitle: {
      flex: 1,
      fontSize: FontSize.md,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      textAlign: "center",
    },
    // Balances the back button so the title stays visually centered.
    subHeaderSpacer: {
      width: 32,
    },
    // Sections
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
      marginLeft: Spacing.base,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      gap: Spacing.sm,
    },
    settingIcon: {
      width: 22,
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
    settingValue: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontFamily: "monospace",
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
    // Bottom-sheet modal (QR / Status / Wipe / Orbot / Appearance / etc.)
    sheetOverlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      justifyContent: "flex-end",
    },
    sheet: {
      width: "100%",
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.base,
      paddingBottom: Spacing["2xl"],
      alignItems: "center",
      gap: Spacing.md,
    },
    sheetHandle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.borderStrong,
      alignSelf: "center",
      marginBottom: Spacing.xs,
    },
    sheetIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginTop: Spacing.xs,
    },
    sheetTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    sheetSubtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: FontSize.sm * 1.5,
    },
    // Stacked, full-width bounded pill buttons: the primary action solid on
    // top, a plain bordered secondary underneath. Static objects only, no
    // pressed-state style functions, so every sheet's action pair renders
    // the same predictable way.
    sheetActions: {
      width: "100%",
      marginTop: Spacing.xs,
    },
    sheetBtn: {
      width: "100%",
      minHeight: 50,
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
      minHeight: 50,
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
    // Modal option list: one selectable row (icon dot + label/description +
    // check), each row a real bounded box, not just padding on transparent
    // background, so unselected and selected states are both unmistakable.
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
      width: 34,
      height: 34,
      borderRadius: 17,
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
