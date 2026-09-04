// Version sub-screen: shows the running version, checks GitHub for a newer
// release on demand, carries the update onto the device, and credits the author
// at the foot of the page.
//
// The check is manual, not automatic: Airhop is offline-first, so a silent
// background request on every visit would be the wrong default. One button
// through the whole path, an honest outcome at every step, and never a spinner
// that hangs forever.
//
// Both platforms ask GitHub what the latest release is. What they do with the
// answer differs, because only one of them may act on it: Android fetches the
// APK and hands it to the system installer, iOS hands off to the App Store.

import {
  APP_STORE_URL,
  APP_VERSION,
  AUTHOR_NAME,
  AUTHOR_URL,
  LATEST_RELEASE_API,
  LATEST_RELEASE_PAGE,
  LICENSE_NAME,
  LICENSE_URL,
} from "@data/app-info";
import { birdForVersion } from "@data/releases";
import Feather from "@expo/vector-icons/Feather";
import { t, useT } from "@i18n";
import { useRichText } from "@i18n/rich-text";
import { useSettingsStore } from "@store/settings-store";
import PrimaryButton from "@ui/components/primary-button";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  TAB_BAR_CLEARANCE,
  useThemeColors,
} from "@ui/theme";
import { File, Paths } from "expo-file-system";
import { getContentUriAsync } from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SettingsScroll,
  SubHeader,
  useSharedStyles,
} from "../settings-primitives";

interface Props {
  onBack: () => void;
}

// iOS has no route but the App Store: an app may not install anything there, so
// an update hands off to the store's own one-tap button.
//
// Android takes the GitHub release, and PLAY_STORE_URL is deliberately not read
// here even once a listing exists. An offline-first app whose users may be
// somewhere a store is blocked, absent, or has removed it cannot depend on that
// store to deliver a fix.
const IOS_STORE_URL = APP_STORE_URL;

// The name the release workflow stages the APK under. Matched by name rather
// than by position so a new asset in the release cannot shift what we fetch.
const APK_ASSET_NAME = "airhop.apk";

// The outcome of a check. "idle" is the resting state before the first tap.
//
// `apkUrl` is null on iOS and on a release carrying no APK, which is what sends
// those two to a link rather than a download.
type CheckState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "latest" }
  | { status: "update"; version: string; url: string; apkUrl: string | null }
  | { status: "tor-blocked" }
  | { status: "error" };

// Where the downloaded APK is in its life. Separate from CheckState because a
// failed download must not discard the check that found the update: the user
// retries the download, not the lookup.
type DownloadState =
  | { status: "idle" }
  | { status: "downloading"; percent: number }
  | { status: "ready"; uri: string }
  | { status: "failed" };

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
  const [download, setDownload] = useState<DownloadState>({ status: "idle" });
  const bird = birdForVersion(APP_VERSION);

  // Fetch the release APK, then hand it to the system installer.
  //
  // Into the cache directory, where the OS may reclaim it: the file is wanted
  // only between the transfer finishing and the installer reading it, and tens
  // of MiB should not outlive the update they carried.
  //
  // Progress is read from the transfer, never eased, because a bar moving on
  // its own over a download this size lies the moment the connection stalls.
  async function downloadAndInstall(apkUrl: string): Promise<void> {
    setDownload({ status: "downloading", percent: 0 });
    try {
      const target = new File(Paths.cache, APK_ASSET_NAME);
      // A part file from an abandoned attempt would otherwise be appended to.
      if (target.exists) target.delete();
      const task = File.createDownloadTask(apkUrl, target, {
        onProgress: ({
          bytesWritten,
          totalBytes,
        }: {
          bytesWritten: number;
          totalBytes: number;
        }) => {
          if (totalBytes <= 0) return;
          setDownload({
            status: "downloading",
            percent: Math.min(
              100,
              Math.round((bytesWritten / totalBytes) * 100),
            ),
          });
        },
      });
      const file = await task.downloadAsync();
      if (file === null) {
        setDownload({ status: "failed" });
        return;
      }
      setDownload({ status: "ready", uri: file.uri });
      // A device with no installer to open is the one case where the file
      // arrived and still nothing can happen, so it reads as a failure.
      if (!(await launchInstaller(file.uri))) {
        setDownload({ status: "failed" });
      }
    } catch {
      setDownload({ status: "failed" });
    }
  }

  // Open the system installer on a downloaded APK.
  //
  // ACTION_VIEW with the archive type, not ACTION_INSTALL_PACKAGE: that one is
  // deprecated from API 29, and this pair resolves to the package installer on
  // every version from our minimum of 26 up.
  //
  // A content:// URI carrying the read grant, since a file:// one handed to
  // another process is refused from Android 7. Everything past that point
  // belongs to the OS: its own confirm dialog, and on 8+ a detour through
  // "Install unknown apps" when that is not yet allowed for Airhop.
  //
  // Returns whether the installer opened, so a device that cannot show one says
  // so rather than leaving a tap with nothing behind it. A cancelled install
  // keeps the file, and the button stays on "Install".
  async function launchInstaller(fileUri: string): Promise<boolean> {
    try {
      const contentUri = await getContentUriAsync(fileUri);
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: contentUri,
        type: "application/vnd.android.package-archive",
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
      });
      return true;
    } catch {
      return false;
    }
  }

  // One translated sentence with the license name substituted in as a tappable
  // node, so a translator can put it wherever their language needs it. The name
  // itself stays English. See i18n/rich-text.tsx.
  const license = useRichText("settings.version.released_under", {
    license: (
      <Text
        style={styles.creditLink}
        onPress={() => void Linking.openURL(LICENSE_URL)}
        accessibilityRole="link"
        suppressHighlighting
      >
        {LICENSE_NAME}
      </Text>
    ),
  });

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
    // A plain fetch that Tor is not carrying reveals the real IP while the
    // switch reads on, so it is skipped rather than leaked - the same
    // fail-closed choice, and predicate, as the wallet mint gate. (The relay
    // directory is vendored and avoids the question.)
    //
    // iOS only, because only there is a fetch outside the tunnel: Tor covers
    // nostr-tools WebSockets and nothing else, so this request would carry the
    // device's IP to GitHub whether or not a circuit is up.
    //
    // Android needs no refusal. The proxy is installed into the HTTP client
    // this fetch is built from, so the check is either inside the tunnel or
    // failing closed, exactly like a relay socket.
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
      const data: {
        tag_name?: string;
        html_url?: string;
        assets?: { name?: string; browser_download_url?: string }[];
      } = await res.json();
      const latest = (data.tag_name ?? "").replace(/^v/, "");
      if (!latest) {
        setCheck({ status: "error" });
        return;
      }
      if (compareVersions(latest, APP_VERSION) > 0) {
        const apk =
          Platform.OS === "android"
            ? (data.assets ?? []).find((a) => a.name === APK_ASSET_NAME)
                ?.browser_download_url
            : undefined;
        // A fresh check invalidates whatever the last one downloaded: that file
        // is the previous release, and installing it would be a downgrade.
        setDownload({ status: "idle" });
        setCheck({
          status: "update",
          version: latest,
          url: data.html_url ?? LATEST_RELEASE_PAGE,
          apkUrl: apk ?? null,
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
  const downloading = download.status === "downloading";

  return (
    <View style={shared.container}>
      <SubHeader title={T("settings.about.version")} onBack={onBack} />
      <SettingsScroll>
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
              downloading
                ? T("settings.version.downloading", {
                    percent: String(
                      download.status === "downloading" ? download.percent : 0,
                    ),
                  })
                : download.status === "ready"
                  ? T("settings.version.install")
                  : update
                    ? T("settings.version.update_to", {
                        version: update.version,
                      })
                    : checking
                      ? T("settings.version.checking")
                      : T("settings.version.check")
            }
            onPress={() => {
              if (downloading) return;
              // A downloaded APK the user backed out of: straight back to the
              // installer, no second download.
              if (download.status === "ready") {
                void launchInstaller(download.uri).then((opened) => {
                  if (!opened) setDownload({ status: "failed" });
                });
                return;
              }
              if (!update) {
                void checkForUpdates();
                return;
              }
              // An APK to fetch means the whole update happens here. Without
              // one, the best this button can do is open the place the user can
              // finish it themselves.
              if (update.apkUrl !== null) {
                void downloadAndInstall(update.apkUrl);
                return;
              }
              void Linking.openURL(
                Platform.OS === "ios" ? IOS_STORE_URL : update.url,
              );
            }}
            disabled={checking || downloading}
            accessibilityLabel={
              update
                ? T("settings.version.update_to_a11y", {
                    version: update.version,
                  })
                : T("settings.version.check")
            }
          />
          {downloading ? (
            <View
              style={styles.progressTrack}
              accessibilityRole="progressbar"
              accessibilityValue={{
                now: download.status === "downloading" ? download.percent : 0,
                min: 0,
                max: 100,
              }}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${download.status === "downloading" ? download.percent : 0}%`,
                  },
                ]}
              />
            </View>
          ) : null}
          {download.status === "failed" ? (
            <View style={styles.result}>
              <Feather name="wifi-off" size={16} color={Colors.textMuted} />
              <Text style={styles.resultText}>
                {T("settings.version.download_failed")}
              </Text>
            </View>
          ) : (
            <UpdateResult check={check} styles={styles} Colors={Colors} />
          )}
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
          <Text style={styles.creditText}>{license}</Text>
        </View>
      </SettingsScroll>
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
    // The number is machine data, "Version {version}" is a sentence around it,
    // and the sentence is what the face renders. Same call as `settingValue`: a
    // value through a catalog key is prose.
    version: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
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
    progressTrack: {
      height: Spacing.xs,
      alignSelf: "stretch",
      marginHorizontal: Spacing.base,
      backgroundColor: Colors.border,
      borderRadius: Radius.xs,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: Colors.textPrimary,
      borderRadius: Radius.xs,
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
