// Proximity map for the Mesh tab.
// Peers are placed on distance-calibrated rings based on BLE signal recency.
// Distance is estimated from packet age; once the BLE service exposes RSSI
// that value will replace the recency proxy.
// Compass N is decorative: BLE gives proximity only, not bearing.

import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useMeshStateStore } from "../../store/mesh-state-store";
import { type NearbyPeer } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
import StatusDot from "../../ui/components/status-dot";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { resolveDisplayName } from "../../utils/display-name";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  peers: NearbyPeer[];
  now: number;
  onSelectPeer: (peer: NearbyPeer) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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
const RING_LABELS: [string, string, string] = ["Strong", "Medium", "Weak"];

const AVATAR_SIZE = 34;
const SELF_SIZE = 42;

// Consecutive taps within this window count toward the easter egg.
const TAP_WINDOW_MS = 2500;
const EGG_TAPS = 5;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RadarView({
  peers,
  now,
  onSelectPeer,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [canvasSize, setCanvasSize] = useState(0);
  // "Away" stops the radios, so an empty radar then means paused, not scanning.
  // "Invisible" still scans (it only stops advertising), so it reads as normal.
  const away = useMeshStateStore((s) => s.presenceStatus === "away");

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
  useEffect(() => {
    // Away pauses the radios, so freeze the ambient sonar too: a radar still
    // pulsing while nothing scans would be a lie. The rings collapse to nothing
    // rather than freezing mid-bloom. The center tap keeps its own one-shot
    // wave, so the radar is quiet but still playful.
    if (away) {
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
  }, [ring1, ring2, ring3, waveEpoch, away]);

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
  // This was previously `indexInRing / countInRing`, which meant a peer's
  // position was a function of how many OTHER peers happened to share its ring:
  // anyone joining or leaving made every existing dot jump to a new angle, and
  // the list re-sorts on every announce. Hashing the ID instead keeps each peer
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
        setCanvasSize(Math.min(width - 24, height - 60));
      }}
    >
      {canvasSize > 0 && (
        <>
          {/* ---- Radar canvas ------------------------------------------- */}
          <View
            style={[styles.canvas, { width: canvasSize, height: canvasSize }]}
          >
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

            {/* Static distance guide rings with labels */}
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
                  >
                    {RING_LABELS[i]}
                  </Text>
                </React.Fragment>
              );
            })}

            {/* Cardinal directions: decorative, BLE gives proximity not bearing */}
            <Text
              style={[styles.compassDir, { top: C - outerR - 20, left: C - 5 }]}
            >
              N
            </Text>
            <Text
              style={[styles.compassDir, { top: C + outerR + 7, left: C - 5 }]}
            >
              S
            </Text>
            <Text
              style={[styles.compassDir, { top: C - 8, left: C - outerR - 16 }]}
            >
              W
            </Text>
            <Text
              style={[styles.compassDir, { top: C - 8, left: C + outerR + 6 }]}
            >
              E
            </Text>

            {/* Center dot: local device. Tap to rescan (with a sonar burst). */}
            <Pressable
              style={[
                styles.selfButton,
                { top: C - SELF_SIZE / 2, left: C - SELF_SIZE / 2 },
              ]}
              onPress={handleCenterPress}
              accessibilityRole="button"
              accessibilityLabel="Rescan for nearby peers"
              hitSlop={10}
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

          {/* ---- Status -------------------------------------------------- */}
          <Text style={styles.statusText}>
            {peers.length > 0
              ? `${peers.length} peer${peers.length !== 1 ? "s" : ""} in range`
              : away
                ? "Mesh paused \u00b7 You're away"
                : "Scanning for nearby peers\u2026"}
          </Text>
          <Text style={styles.hintText}>
            {/* Signal strength, NOT distance. RSSI varies by tens of dB with
                orientation, obstacles and radio, so any metre figure derived
                from it would be invented. Ring = signal, and the label says so. */}
            {peers.length > 0
              ? "Ring position reflects signal strength, not distance"
              : away
                ? "Set your status to Online in Profile to discover peers"
                : "Rings show BLE signal strength, not distance"}
          </Text>
        </>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Peer node
// ---------------------------------------------------------------------------

interface PeerNodeProps {
  peer: NearbyPeer;
  top: number;
  left: number;
  now: number;
  onPress: () => void;
}

// Matches peer-list's threshold so the same peer can't read "online" here and
// "offline" there. Previously this dot was hardcoded green for everyone.
const ONLINE_WINDOW_MS = 30_000;

function PeerNode({
  peer,
  top,
  left,
  now,
  onPress,
}: PeerNodeProps): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const username = resolveDisplayName(peer.peerID);
  const isOnline = now - peer.lastSeenMs < ONLINE_WINDOW_MS;
  return (
    <Pressable
      style={[styles.peerNode, { top, left }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View peer ${username}, ${isOnline ? "online" : "recently seen"}`}
    >
      <Avatar username={username} peerID={peer.peerID} size={AVATAR_SIZE} />
      <View style={styles.statusBadge}>
        <StatusDot status={isOnline ? "online" : "offline"} size={7} />
      </View>
      <Text style={styles.peerLabel} numberOfLines={1}>
        {username.split("-")[0]}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

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
    canvas: {
      // width + height set dynamically
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
      fontSize: 10,
      color: Colors.textMuted,
      letterSpacing: 0.2,
    },
    compassDir: {
      position: "absolute",
      fontSize: 10,
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
    peerLabel: {
      fontSize: FontSize.xs - 1,
      color: Colors.textMuted,
      textAlign: "center",
      width: AVATAR_SIZE + 16,
      marginLeft: -8,
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
