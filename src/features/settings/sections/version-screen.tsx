// Version sub-screen: shows the running version, checks GitHub for a newer
// release on demand, and credits the author at the foot of the page.
//
// The check is manual, not automatic: Airhop is offline-first, so a silent
// background request on every visit would be the wrong default. One button,
// four honest outcomes (up to date, update available, offline, unexpected),
// and never a spinner that hangs forever.

import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  APP_VERSION,
  AUTHOR_NAME,
  AUTHOR_URL,
  LATEST_RELEASE_API,
  LATEST_RELEASE_PAGE,
  LICENSE_URL,
} from "../../../data/app-info";
import { birdForVersion } from "../../../data/releases";
import { t, useT } from "../../../i18n";
import { useSettingsStore } from "../../../store/settings-store";
import PrimaryButton from "../../../ui/components/primary-button";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Spacing,
  TAB_BAR_CLEARANCE,
  useThemeColors,
} from "../../../ui/theme";
import { SubHeader, useSharedStyles } from "../shared";

interface Props {
  onBack: () => void;
}

// The outcome of a check. "idle" is the resting state before the first tap.
type CheckState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "latest" }
  | { status: "update"; version: string; url: string }
  | { status: "tor-blocked" }
  | { status: "error" };

// Compares two dotted version strings numerically. Returns a positive number
// if a is newer than b, negative if older, zero if equal. Missing or
// non-numeric segments count as 0, so "1.0" and "1.0.0" compare equal.
function compareVersions(a: string, b: string): number {
  const pa = a.split(".");
  const pb = b.split(".");
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const na = parseInt(pa[i] ?? "0", 10) || 0;
    const nb = parseInt(pb[i] ?? "0", 10) || 0;
    if (na !== nb) return na - nb;
  }
  return 0;
}

export default function VersionScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const T = useT();
  const shared = useSharedStyles();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [check, setCheck] = useState<CheckState>({ status: "idle" });
  const bird = birdForVersion(APP_VERSION);

  // Easter egg: triple-tap the version hero and the bird flaps its wings with
  // a small hop (a nod to "airhop"). Purely local delight, nothing persists.
  const [birdFrame, setBirdFrame] = useState(0);
  const [hop] = useState(() => new Animated.Value(0));
  const flapping = useRef(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flapTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      if (tapTimer.current) clearTimeout(tapTimer.current);
      flapTimers.current.forEach(clearTimeout);
    };
  }, []);

  function playFlap() {
    if (flapping.current) return;
    flapping.current = true;
    // Two beats: downstroke, glide, downstroke, then settle back to the glide
    // frame. The trailing frame is the settle timer's job, not a fourth entry
    // here, so the swap ends the moment the wings are back up rather than
    // holding a dead frame while the tap stays locked out.
    const frames = [1, 0, 1];
    frames.forEach((f, i) => {
      flapTimers.current.push(setTimeout(() => setBirdFrame(f), i * FLAP_MS));
    });
    flapTimers.current.push(
      setTimeout(() => {
        setBirdFrame(0);
        flapping.current = false;
        flapTimers.current = [];
      }, frames.length * FLAP_MS),
    );
    // The lift rides the two downstrokes and springs back as the wings come
    // up, so the hop and the flap finish together instead of the bird landing
    // mid-beat.
    Animated.sequence([
      Animated.timing(hop, {
        toValue: -10,
        duration: frames.length * FLAP_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(hop, {
        toValue: 0,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function handleHeroTap() {
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapCount.current += 1;
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      playFlap();
      return;
    }
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 450);
  }

  async function checkForUpdates() {
    // On iOS the Tor tunnel only covers nostr-tools WebSockets, so this plain
    // fetch to GitHub would egress over clearnet and reveal the real IP while Tor
    // is on. Skip it rather than leak (same fail-closed choice as the wallet mint
    // gate; the relay directory avoids the problem entirely by being vendored).
    if (Platform.OS === "ios" && useSettingsStore.getState().torEnabled) {
      setCheck({ status: "tor-blocked" });
      return;
    }
    setCheck({ status: "checking" });
    try {
      const res = await fetch(LATEST_RELEASE_API, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!res.ok) {
        setCheck({ status: "error" });
        return;
      }
      const data: { tag_name?: string; html_url?: string } = await res.json();
      const latest = (data.tag_name ?? "").replace(/^v/, "");
      if (!latest) {
        setCheck({ status: "error" });
        return;
      }
      if (compareVersions(latest, APP_VERSION) > 0) {
        setCheck({
          status: "update",
          version: latest,
          url: data.html_url ?? LATEST_RELEASE_PAGE,
        });
      } else {
        setCheck({ status: "latest" });
      }
    } catch {
      // Offline or the request never completed. Treated as "couldn't check",
      // not as an error the user has to reason about.
      setCheck({ status: "error" });
    }
  }

  const checking = check.status === "checking";
  // When a newer release exists, the primary button becomes the download CTA:
  // it opens the release page (notes + downloadable builds). The result line
  // below still links the notes. Reopening the screen resets to a fresh check.
  const update = check.status === "update" ? check : null;

  return (
    <View style={shared.container}>
      <SubHeader title={T("settings.about.version")} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.hero}
          onPress={handleHeroTap}
          accessible={false}
        >
          <Animated.View style={{ transform: [{ translateY: hop }] }}>
            <PixelBird color={Colors.textPrimary} frame={birdFrame} />
          </Animated.View>
          <Text style={styles.wordmark}>airhop</Text>
          <View style={styles.versionBlock}>
            <Text style={styles.version}>
              {T("settings.version.number", { version: APP_VERSION })}
            </Text>
            {bird ? (
              <View style={styles.codenameRow}>
                <Text style={styles.codenameLabel}>
                  {T("settings.version.codename")}
                </Text>
                <Text style={styles.codenameName}>{bird}</Text>
              </View>
            ) : null}
          </View>
        </Pressable>

        <View style={styles.actions}>
          <PrimaryButton
            label={
              update
                ? T("settings.version.download", { version: update.version })
                : checking
                  ? T("settings.version.checking")
                  : T("settings.version.check")
            }
            onPress={() =>
              update ? void Linking.openURL(update.url) : void checkForUpdates()
            }
            disabled={checking}
            accessibilityLabel={
              update
                ? T("settings.version.download_a11y", {
                    version: update.version,
                  })
                : T("settings.version.check")
            }
          />
          <UpdateResult check={check} styles={styles} Colors={Colors} />
        </View>

        <View style={styles.credit}>
          <View style={styles.creditRow}>
            <Text style={styles.creditText}>
              {T("settings.version.made_with")}
            </Text>
            <PixelHeart color={Colors.textPrimary} />
            <Text style={styles.creditText}>by</Text>
            <Text
              style={styles.creditLink}
              onPress={() => void Linking.openURL(AUTHOR_URL)}
              accessibilityRole="link"
              suppressHighlighting
            >
              {AUTHOR_NAME}
            </Text>
          </View>
          <Text style={styles.creditText}>
            {T("settings.version.released_under")}{" "}
            <Text
              style={styles.creditLink}
              onPress={() => void Linking.openURL(LICENSE_URL)}
              accessibilityRole="link"
              suppressHighlighting
            >
              MIT
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// The one line of feedback under the button. Empty until the first check.
function UpdateResult({
  check,
  styles,
  Colors,
}: {
  check: CheckState;
  styles: ReturnType<typeof createStyles>;
  Colors: ReturnType<typeof useThemeColors>;
}): React.JSX.Element | null {
  const T = useT();
  if (check.status === "idle") return null;

  if (check.status === "checking") {
    return (
      <View style={styles.result}>
        <ActivityIndicator size="small" color={Colors.textMuted} />
        <Text style={styles.resultText}>
          {T("settings.version.checking_title")}
        </Text>
      </View>
    );
  }

  if (check.status === "latest") {
    return (
      <View style={styles.result}>
        <Feather name="check-circle" size={16} color={Colors.success} />
        <Text style={styles.resultText}>
          {T("settings.version.up_to_date")}
        </Text>
      </View>
    );
  }

  if (check.status === "update") {
    // The button above is the download CTA; here we just link what's new.
    return (
      <Pressable
        style={styles.result}
        onPress={() => void Linking.openURL(check.url)}
        accessibilityRole="link"
        accessibilityLabel={t("settings.version.notes_a11y", {
          version: check.version,
        })}
      >
        <Feather name="arrow-up-circle" size={16} color={Colors.textPrimary} />
        <Text style={styles.resultText}>
          <Text style={styles.resultLink}>
            {T("settings.version.release_notes")}
          </Text>
        </Text>
      </Pressable>
    );
  }

  if (check.status === "tor-blocked") {
    return (
      <View style={styles.result}>
        <Feather name="shield" size={16} color={Colors.textMuted} />
        <Text style={styles.resultText}>
          {t("settings.version.tor_paused")}
        </Text>
      </View>
    );
  }

  // error
  return (
    <View style={styles.result}>
      <Feather name="wifi-off" size={16} color={Colors.textMuted} />
      <Text style={styles.resultText}>
        {t("settings.version.check_failed")}
      </Text>
    </View>
  );
}

// A small monochrome pixel bird crowning the version hero, drawn in the same
// idiom as the pixel heart below: a grid of square cells, filled ones taking
// the current text color so it reads in both themes. A soaring seabird, a nod
// to the release codename (birds, alphabetical; 1.x is Albatross).
//
// Two frames, both 11x6 so the box never resizes mid-swap: a resting glide
// (wings up) and a downstroke (wings out and down). Alternating them is the
// triple-tap easter egg.
const BIRD_FRAMES = [
  [
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
  ],
];
const BIRD_CELL = 3;
// Milliseconds a wing frame holds. At 110 the beat read as a slideshow; 80 is
// fast enough to look like one motion and still let each frame register.
const FLAP_MS = 80;

function PixelBird({
  color,
  frame,
}: {
  color: string;
  frame: number;
}): React.JSX.Element {
  const pixels = BIRD_FRAMES[frame] ?? BIRD_FRAMES[0];
  return (
    <View style={{ width: pixels[0].length * BIRD_CELL }}>
      {pixels.map((row, y) => (
        <View key={y} style={{ flexDirection: "row" }}>
          {row.map((cell, x) => (
            <View
              key={x}
              style={{
                width: BIRD_CELL,
                height: BIRD_CELL,
                backgroundColor: cell ? color : "transparent",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

// A small black-and-white pixel heart, the same shape as the landing footer's,
// drawn as a grid of square cells so it stays crisp at any density. Filled
// cells take the current text color, so it reads correctly in both themes.
const HEART_PIXELS = [
  [0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
];
const CELL = 2;

function PixelHeart({ color }: { color: string }): React.JSX.Element {
  return (
    <View
      style={{ width: HEART_PIXELS[0].length * CELL }}
      accessibilityLabel="love"
    >
      {HEART_PIXELS.map((row, y) => (
        <View key={y} style={{ flexDirection: "row" }}>
          {row.map((cell, x) => (
            <View
              key={x}
              style={{
                width: CELL,
                height: CELL,
                backgroundColor: cell ? color : "transparent",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    // The credit is pinned to the foot of the page (marginTop auto), so it
    // lands wherever the content ends: without tab-bar clearance it ends up
    // behind the floating pill instead of above it.
    content: {
      flexGrow: 1,
      padding: Spacing.base,
      paddingBottom: TAB_BAR_CLEARANCE,
    },
    hero: {
      alignItems: "center",
      gap: Spacing.sm,
      paddingTop: Spacing["3xl"],
      paddingBottom: Spacing["2xl"],
    },
    wordmark: {
      fontSize: FontSize["2xl"],
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      letterSpacing: -1,
    },
    versionBlock: {
      alignItems: "center",
      gap: Spacing.xs,
    },
    version: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontFamily: FontFamily.mono,
    },
    // The release codename as a labeled value: a small uppercase "Codename"
    // tag beside the name, the same label idiom as the settings section
    // titles. Reads as intentional rather than a stray word.
    codenameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
    },
    codenameLabel: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    codenameName: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
      letterSpacing: 0.2,
    },
    actions: {
      gap: Spacing.base,
    },
    result: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.base,
    },
    resultText: {
      flexShrink: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.5,
      textAlign: "center",
    },
    resultLink: {
      color: Colors.textPrimary,
      textDecorationLine: "underline",
    },
    // Pinned to the foot of the page: flexGrow on the content plus this auto
    // top margin pushes the credit down even when the page is short. Two
    // stacked, centered lines: the heart credit, then the license line.
    credit: {
      marginTop: "auto",
      paddingTop: Spacing["2xl"],
      alignItems: "center",
      gap: Spacing.xs,
    },
    creditRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
    },
    creditText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    creditLink: {
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
      textDecorationLine: "underline",
    },
  });
}
