// Proximity map for the Mesh tab.
// Peers are placed on distance-calibrated rings based on BLE signal recency.
// Distance is estimated from packet age; once the BLE service exposes RSSI
// that value will replace the recency proxy.
// Compass N is decorative: BLE gives proximity only, not bearing.

import { Feather } from "@expo/vector-icons";
import { useMeshStateStore, type BleBlocker } from "@store/mesh-state-store";
import { REACHABLE_TTL_MS, type NearbyPeer } from "@store/peer-store";
import Avatar from "@ui/components/avatar";
import StatusDot from "@ui/components/status-dot";
import { useReducedMotion } from "@ui/hooks/use-reduced-motion";
import {
  FontSize,
  FontWeight,
  hitSlopFor,
  MaxFontScale,
  Radius,
  Spacing,
  useThemeColors,
} from "@ui/theme";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RelayGlyph from "./relay-glyph";

import { t, useT, useTPlural, type TranslationKey } from "@i18n";
import { resolveDisplayName } from "@utils/peer-display-name";

// What the dial says when there are no peers, per reason.
//
// The banner above the radar carries the button that fixes each of these; this
// is the same fact restated where the user is actually looking. It must never
// say "Scanning..." over a radio that is not scanning, which is what happened for
// every blocker, including those a two-boolean version cannot represent.
function blockerHeadline(blocker: BleBlocker): string {
  switch (blocker) {
    case "none":
      return t("mesh.radar.scanning");
    case "starting":
      return t("mesh.radar.starting");
    case "unsupported":
      return t("mesh.radar.no_bluetooth");
    case "adapter-off":
      return t("mesh.radar.bluetooth_off");
    case "permission-denied":
      return t("mesh.radar.permission_needed");
    case "permission-blocked":
      return t("mesh.radar.blocked");
    case "location-permission":
      return t("mesh.radar.location_permission");
    case "location-services-off":
      return t("mesh.radar.location_off");
  }
}

function blockerHint(blocker: BleBlocker): string {
  switch (blocker) {
    case "none":
      return t("mesh.radar.hint_rings");
    case "starting":
      return t("mesh.radar.hint_checking");
    case "unsupported":
      return t("mesh.radar.hint_internet");
    case "adapter-off":
      return t("mesh.radar.hint_turn_on");
    case "permission-denied":
      return t("mesh.radar.hint_allow");
    case "permission-blocked":
      return t("mesh.radar.hint_allow_settings");
    case "location-permission":
      return t("mesh.radar.hint_location_permission");
    case "location-services-off":
      return t("mesh.radar.hint_android_location");
  }
}

// ---- Types ----

interface Props {
  peers: NearbyPeer[];
  now: number;
  onSelectPeer: (peer: NearbyPeer) => void;
}

// ---- Constants ----

// Ring assignment is signal-based when RSSI is known, and falls back to
// recency when it isn't (a peer heard via a multi-hop relay has no RSSI of its
// own, since we never had a direct radio link to measure).
//
// The rings are deliberately labelled by signal strength rather than distance.
// RSSI is not a distance: it swings tens of dB with orientation, bodies, walls
// and radio, so "~5m" was fiction. Presenting it as signal is both honest and
// what the number actually is.
const RSSI_STRONG = -60; // dBm, roughly same-room
const RSSI_MEDIUM = -80; // dBm, beyond that it's the edge of usable range

// Recency fallback thresholds, used only when RSSI is unavailable.
const RING_THRESHOLDS: [number, number] = [15_000, 45_000]; // ms

// Radii as fraction of half the canvas size (C).
const RING_FR: [number, number, number] = [0.3, 0.54, 0.78];
// Keys, not text: evaluated once at import, so translated strings here would
// freeze in whichever language the app started in.
const RING_LABEL_KEYS: [TranslationKey, TranslationKey, TranslationKey] = [
  "mesh.radar.signal_strong",
  "mesh.radar.signal_medium",
  "mesh.radar.signal_weak",
];

// Cardinal letters as data rather than four near-identical JSX blocks with four
// different hand-tuned offset pairs. Each offset is relative to the canvas
// centre and expressed against the outer ring radius, so the set stays put if
// the ring fractions above are ever retuned.
const COMPASS: {
  label: string;
  top: (r: number) => number;
  left: (r: number) => number;
}[] = [
  { label: "N", top: (r) => -r - 20, left: () => -5 },
  { label: "S", top: (r) => r + 7, left: () => -5 },
  { label: "W", top: () => -8, left: (r) => -r - 16 },
  { label: "E", top: () => -8, left: (r) => r + 6 },
];

const AVATAR_SIZE = 34;
const SELF_SIZE = 42;

// Smallest dial worth drawing. The canvas is normally sized to the shorter axis
// of the space it is given, but in landscape (or a split view) that axis can
// fall to almost nothing, and the `canvasSize > 0` guard below then rendered a
// completely blank Mesh tab. Flooring it means the dial stays legible and the
// screen keeps saying something.
const MIN_CANVAS = 180;

// And a ceiling, for the opposite failure. Android 16 stopped honouring an
// orientation lock above 600dp and Android 17 removed the opt-out, so a
// foldable inner screen hands this view ~850dp. Sized to the shorter axis the
// dial grew to ~640dp and pushed the caption behind the tab bar. A phone gives
// ~390dp, so the cap is inert there. Caught on a Pixel 10 Pro Fold; large
// screens want a real adaptive layout, and this is the floor until then.
const MAX_CANVAS = 420;

// Consecutive taps within this window count toward the easter egg.
const TAP_WINDOW_MS = 2500;
const EGG_TAPS = 5;

// ---- Component ----

// Memoised, because its props are now stable.
//
// The radar re-buckets every peer into rings and re-lays out every dot on each
// render. peer-list passes a memoised `peers` array and a `now` that ticks once
// a second, so without this the radar redid all of that whenever anything else
// on the screen changed.
function RadarView({ peers, now, onSelectPeer }: Props): React.JSX.Element {
  const T = useT();
  const TP = useTPlural();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [canvasSize, setCanvasSize] = useState(0);
  // "Away" stops the radios, so an empty radar then means paused, not scanning.
  // "Invisible" still scans (it only stops advertising), so it reads as normal.
  const away = useMeshStateStore((s) => s.presenceStatus === "away");
  // One value, so the dial and its caption can never disagree about whether a
  // scan is running - which they could when this was two booleans and the
  // reasons the radios might be down numbered more than two.
  const blocker = useMeshStateStore((s) => s.bleBlocker);
  // An endlessly expanding ring is the textbook vestibular trigger, and it
  // carries nothing the status line below the dial does not already say in
  // words. So under "reduce motion" the sweep does not run at all (WCAG 2.3.3)
  // and the centre tap answers with a haptic instead of a wave.
  const reducedMotion = useReducedMotion();
  // The sonar means "a scan is running". It sweeps when one is, and stops when
  // one is not, whichever of the three reasons applies. Anything else is the
  // screen claiming to look for peers while the radio sits idle.
  const scanning = !away && blocker === "none";

  const [ring1] = useState(() => new Animated.Value(0));
  const [ring2] = useState(() => new Animated.Value(0));
  const [ring3] = useState(() => new Animated.Value(0));
  // A one-shot wave fired when the user taps the center to rescan.
  const [manualWave] = useState(() => new Animated.Value(0));
  // Center dot press feedback: a small dip, no overshoot.
  const [selfScale] = useState(() => new Animated.Value(1));
  // Bumped by the easter egg to restart the ambient sonar loop from scratch.
  const [waveEpoch, setWaveEpoch] = useState(0);

  // Consecutive rapid center taps, for the easter egg. Reset after a pause.
  const tapCountRef = useRef(0);
  const tapResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Handles for the tap animations, so a fast second tap cancels the first
  // rather than leaving two timings fighting over the same Animated.Value.
  const waveAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const dotAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  const C = canvasSize / 2;

  // Tap the center device for a single sonar wave. Deliberately cosmetic: BLE
  // scanning runs continuously once started and peers arrive on announce
  // events, so a manual rescan would find nothing a moment's wait would not.
  // Five taps in quick succession regenerate the ambient waves.
  function handleCenterPress(): void {
    if (reducedMotion) {
      // The wave is the whole feedback for this tap, so with motion off the
      // touch still has to land somewhere. A selection tick is the quietest
      // acknowledgement the OS offers, which suits an action that is
      // deliberately cosmetic anyway.
      void Haptics.selectionAsync().catch(() => {});
      return;
    }
    waveAnimRef.current?.stop();
    manualWave.setValue(0);
    waveAnimRef.current = Animated.timing(manualWave, {
      toValue: 1,
      duration: 1100,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    waveAnimRef.current.start();

    dotAnimRef.current?.stop();
    dotAnimRef.current = Animated.sequence([
      Animated.timing(selfScale, {
        toValue: 0.92,
        duration: 110,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(selfScale, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    dotAnimRef.current.start();

    tapCountRef.current += 1;
    if (tapResetRef.current !== null) clearTimeout(tapResetRef.current);
    tapResetRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, TAP_WINDOW_MS);
    if (tapCountRef.current >= EGG_TAPS) {
      tapCountRef.current = 0;
      // Easter egg: no pop, no flurry. The three ambient waves simply start
      // over from the center, so the radar quietly re-blooms. Restarting the
      // loop by epoch keeps a single owner of the ring values, which is what
      // stops a second egg mid-flight from running two loops at once.
      setWaveEpoch((n) => n + 1);
    }
  }

  // Staggered sonar pulse: three expanding rings at the outer boundary.
  // Re-runs when waveEpoch changes, tearing the old loop down first.
  // Nothing is scanning, so nothing sweeps. The rings are collapsed to zero
  // rather than left frozen mid-bloom: a stalled half-drawn ring reads as the
  // app having hung, an empty dial reads as switched off, which is the truth.
  // The line under the radar says which of the three reasons it is, and the
  // centre tap keeps its own one-shot wave so the screen still answers a touch.
  useEffect(() => {
    if (!scanning || reducedMotion) {
      ring1.setValue(0);
      ring2.setValue(0);
      ring3.setValue(0);
      return;
    }
    function pulse(
      val: Animated.Value,
      delay: number,
    ): Animated.CompositeAnimation {
      val.setValue(0);
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration: 2800,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );
    }
    const anim = Animated.parallel([
      pulse(ring1, 0),
      pulse(ring2, 900),
      pulse(ring3, 1800),
    ]);
    anim.start();
    return () => anim.stop();
  }, [ring1, ring2, ring3, waveEpoch, scanning, reducedMotion]);

  // Unmounting mid-tap must not leave a timer or an animation callback holding
  // a handle to this component.
  useEffect(() => {
    return () => {
      if (tapResetRef.current !== null) clearTimeout(tapResetRef.current);
      tapResetRef.current = null;
      waveAnimRef.current?.stop();
      dotAnimRef.current?.stop();
    };
  }, []);

  // Bucket peers into rings by signal strength, falling back to recency.
  const byRing: [NearbyPeer[], NearbyPeer[], NearbyPeer[]] = [[], [], []];
  for (const peer of peers) {
    if (peer.rssi !== undefined) {
      if (peer.rssi >= RSSI_STRONG) byRing[0].push(peer);
      else if (peer.rssi >= RSSI_MEDIUM) byRing[1].push(peer);
      else byRing[2].push(peer);
    } else {
      const age = now - peer.lastSeenMs;
      if (age < RING_THRESHOLDS[0]) byRing[0].push(peer);
      else if (age < RING_THRESHOLDS[1]) byRing[1].push(peer);
      else byRing[2].push(peer);
    }
  }

  // Stable angle derived from the peer ID.
  //
  // Not `indexInRing / countInRing`, which makes a peer's position a function of
  // how many OTHER peers share its ring: anyone joining or leaving sends every
  // existing dot to a new angle, and the list re-sorts on every announce. Hashing
  // the ID instead keeps each peer
  // parked in one spot for as long as it's visible.
  function peerAngle(peerID: string): number {
    let hash = 0;
    for (let i = 0; i < peerID.length; i++) {
      hash = (hash * 31 + peerID.charCodeAt(i)) >>> 0;
    }
    return ((hash % 360) / 360) * 2 * Math.PI - Math.PI / 2;
  }

  function peerPos(
    ringIndex: 0 | 1 | 2,
    peerID: string,
  ): { top: number; left: number } {
    const r = C * RING_FR[ringIndex];
    const angle = peerAngle(peerID);
    return {
      top: C + Math.sin(angle) * r - AVATAR_SIZE / 2,
      left: C + Math.cos(angle) * r - AVATAR_SIZE / 2,
    };
  }

  const pulseStyle = (val: Animated.Value) => ({
    opacity: val.interpolate({
      inputRange: [0, 0.15, 1],
      outputRange: [0, 0.28, 0],
    }),
    transform: [
      {
        scale: val.interpolate({
          inputRange: [0, 1],
          outputRange: [0.05, 1],
        }),
      },
    ],
  });

  // Outer ring absolute radius in px (for pulse ring and compass placement).
  const outerR = C * RING_FR[2];

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setCanvasSize(
          Math.max(MIN_CANVAS, Math.min(width - 24, height - 60, MAX_CANVAS)),
        );
      }}
    >
      {canvasSize > 0 && (
        <>
          {/* ---- Radar canvas -------------------------------------------
              The rings, the compass and the sweep are one picture of "who is
              around me", and none of it means anything read out piece by piece:
              a screen reader was stepping through four unlabelled compass
              letters and three ring names before reaching a peer. The canvas is
              therefore hidden as a whole and the individual peers and the centre
              button opt back in below, which leaves a screen reader with
              exactly the actionable elements plus the status line. */}
          <View style={{ width: canvasSize, height: canvasSize }}>
            {/* Pulse rings: expand from center to outer ring boundary */}
            {([ring1, ring2, ring3] as Animated.Value[]).map((val, i) => {
              const d = outerR * 2;
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.pulseRing,
                    {
                      width: d,
                      height: d,
                      borderRadius: outerR,
                      top: C - outerR,
                      left: C - outerR,
                    },
                    pulseStyle(val),
                  ]}
                />
              );
            })}

            {/* Manual sonar wave: one calm ring on center tap, no overshoot. */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.manualWave,
                {
                  width: outerR * 2,
                  height: outerR * 2,
                  borderRadius: outerR,
                  top: C - outerR,
                  left: C - outerR,
                  opacity: manualWave.interpolate({
                    inputRange: [0, 0.15, 1],
                    outputRange: [0, 0.34, 0],
                  }),
                  transform: [
                    {
                      scale: manualWave.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.06, 1],
                      }),
                    },
                  ],
                },
              ]}
            />

            {/* Static distance guide rings with labels, and the cardinal
                letters. Both are chart furniture: the rings are named in the
                hint line under the dial and the compass is decorative (BLE
                gives proximity, never bearing), so neither is worth a screen
                reader stop. Capped font scaling because they are absolutely
                positioned against the ring geometry and cannot reflow. */}
            <View
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
              importantForAccessibility="no-hide-descendants"
              accessibilityElementsHidden
            >
              {RING_FR.map((fr, i) => {
                const r = C * fr;
                const d = r * 2;
                return (
                  <React.Fragment key={i}>
                    <View
                      style={[
                        styles.guideRing,
                        {
                          width: d,
                          height: d,
                          borderRadius: r,
                          top: C - r,
                          left: C - r,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.ringLabel,
                        { top: C - r + 5, left: C + r * 0.48 },
                      ]}
                      maxFontSizeMultiplier={MaxFontScale.badge}
                    >
                      {T(RING_LABEL_KEYS[i])}
                    </Text>
                  </React.Fragment>
                );
              })}

              {COMPASS.map(({ label, top, left }) => (
                <Text
                  key={label}
                  style={[
                    styles.compassDir,
                    { top: C + top(outerR), left: C + left(outerR) },
                  ]}
                  maxFontSizeMultiplier={MaxFontScale.badge}
                >
                  {label}
                </Text>
              ))}
            </View>

            {/* Center dot: local device. Tap to rescan (with a sonar burst). */}
            <Pressable
              style={[
                styles.selfButton,
                { top: C - SELF_SIZE / 2, left: C - SELF_SIZE / 2 },
              ]}
              onPress={handleCenterPress}
              accessibilityRole="button"
              accessibilityLabel={T("mesh.radar.you_center")}
              // The label must not promise a rescan. There is none: BLE scanning
              // runs continuously and peers arrive on announce events, as the
              // comment on handleCenterPress says. Naming it "rescan" tells a
              // screen reader user the one control on this
              // screen would fetch peers, and it never did.
              accessibilityHint={T("mesh.radar.sonar_hint")}
              hitSlop={hitSlopFor(SELF_SIZE)}
            >
              <Animated.View
                style={[styles.selfDot, { transform: [{ scale: selfScale }] }]}
              >
                <Feather name="radio" size={14} color={Colors.textInverse} />
              </Animated.View>
            </Pressable>

            {/* Peer nodes placed on their signal-strength ring */}
            {(byRing as NearbyPeer[][]).map((group, ri) =>
              group.map((peer) => {
                const pos = peerPos(ri as 0 | 1 | 2, peer.peerID);
                return (
                  <PeerNode
                    key={peer.peerID}
                    peer={peer}
                    top={pos.top}
                    left={pos.left}
                    now={now}
                    onPress={() => onSelectPeer(peer)}
                  />
                );
              }),
            )}
          </View>

          {/* ---- Status --------------------------------------------------
              One live region around both lines, so switching Bluetooth off or
              being denied the permission is announced when it happens rather
              than only if the user happens to swipe back down here. Two
              separate Texts were also two separate stops reading one sentence
              in halves. */}
          <View style={styles.status} accessibilityLiveRegion="polite">
            <Text style={styles.statusText}>
              {peers.length > 0
                ? TP("mesh.peers_in_range", peers.length)
                : away
                  ? T("mesh.radar.paused")
                  : blockerHeadline(blocker)}
            </Text>
            <Text style={styles.hintText}>
              {/* Signal strength, NOT distance. RSSI varies by tens of dB with
                orientation, obstacles and radio, so any metre figure derived
                from it would be invented. Ring = signal, and the label says so. */}
              {peers.length > 0
                ? T("mesh.radar.ring_hint")
                : away
                  ? T("mesh.radar.set_online")
                  : blockerHint(blocker)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

// ---- Peer node ----

interface PeerNodeProps {
  peer: NearbyPeer;
  top: number;
  left: number;
  now: number;
  onPress: () => void;
}

// Presence comes from peer-store's REACHABLE_TTL_MS so the same peer cannot read
// "online" here and "offline" in the peer list. This dot had its own 30s
// literal, half the store's window, so a peer heard from 45s ago went grey on
// the dial while the list still showed green.

function PeerNode({
  peer,
  top,
  left,
  now,
  onPress,
}: PeerNodeProps): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const username = resolveDisplayName(peer.peerID);
  const isOnline = now - peer.lastSeenMs < REACHABLE_TTL_MS;
  return (
    <Pressable
      style={[styles.peerNode, { top, left }]}
      onPress={onPress}
      // The node draws at 34pt so a dial full of peers stays readable; the slop
      // brings the target to the 44pt floor without moving anything.
      hitSlop={hitSlopFor(AVATAR_SIZE)}
      accessibilityRole="button"
      // The glyph is what tells a sighted user this is equipment, so the label
      // has to say it too or the dial reads as one more person.
      accessibilityLabel={`${username}${peer.isInfrastructure === true ? `, ${T("mesh.peer.relay")}` : ""}, ${isOnline ? T("mesh.radar.in_range") : T("mesh.radar.recently_seen")}`}
      accessibilityHint={T("mesh.radar.peer_hint")}
    >
      {peer.isInfrastructure === true ? (
        <RelayGlyph size={AVATAR_SIZE} />
      ) : (
        <Avatar username={username} peerID={peer.peerID} size={AVATAR_SIZE} />
      )}
      <View style={styles.statusBadge}>
        <StatusDot status={isOnline ? "online" : "offline"} size={7} />
      </View>
      <Text
        style={styles.peerLabel}
        numberOfLines={1}
        maxFontSizeMultiplier={MaxFontScale.badge}
      >
        {username.split("-")[0]}
      </Text>
    </Pressable>
  );
}

export default React.memo(RadarView);

// ---- Styles ----

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.bg,
      gap: Spacing.sm,
      paddingBottom: Spacing.xl,
    },
    pulseRing: {
      position: "absolute",
      borderWidth: 1.5,
      borderColor: Colors.accent,
    },
    manualWave: {
      position: "absolute",
      borderWidth: 1.5,
      borderColor: Colors.accent,
    },
    guideRing: {
      position: "absolute",
      borderWidth: 1,
      borderColor: Colors.borderStrong,
    },
    ringLabel: {
      position: "absolute",
      fontSize: FontSize["2xs"],
      color: Colors.textMuted,
      letterSpacing: 0.2,
    },
    compassDir: {
      position: "absolute",
      fontSize: FontSize["2xs"],
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      letterSpacing: 0.5,
    },
    selfButton: {
      position: "absolute",
      width: SELF_SIZE,
      height: SELF_SIZE,
    },
    selfDot: {
      width: SELF_SIZE,
      height: SELF_SIZE,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: Colors.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    peerNode: {
      position: "absolute",
      width: AVATAR_SIZE,
      alignItems: "center",
      gap: 2,
    },
    statusBadge: {
      position: "absolute",
      top: AVATAR_SIZE - 9,
      left: AVATAR_SIZE - 9,
      backgroundColor: Colors.bg,
      borderRadius: Radius.full,
      padding: 1,
    },
    // Physical marginLeft on purpose, and it must stay physical.
    //
    // The radar is a polar plot of where people actually are, so it never
    // mirrors: north stays north in every language. Everything positioned
    // inside it is therefore positioned in screen space, including this label,
    // which is 16pt wider than the avatar it names and pulled back by half that
    // to sit centred over it. A logical marginStart would flip in Arabic and
    // push every name 8pt off its peer.
    peerLabel: {
      fontSize: FontSize["2xs"],
      color: Colors.textMuted,
      textAlign: "center",
      width: AVATAR_SIZE + 16,
      marginLeft: -8,
    },
    status: {
      alignSelf: "stretch",
      gap: Spacing.xs,
      paddingHorizontal: Spacing.base,
    },
    statusText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      textAlign: "center",
      letterSpacing: 0.1,
    },
    hintText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      textAlign: "center",
      letterSpacing: 0.1,
    },
  });
}
