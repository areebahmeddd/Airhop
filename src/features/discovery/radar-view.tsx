// Proximity map for the Mesh tab.
// Peers are placed on distance-calibrated rings based on BLE signal recency.
// Distance is estimated from packet age; once the BLE service exposes RSSI
// that value will replace the recency proxy.
// Compass N is decorative: BLE gives proximity only, not bearing.

import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { type NearbyPeer } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
import StatusDot from "../../ui/components/status-dot";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";

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

// Recency thresholds map to distance rings.
// Inner ring = seen within last 15 s (strong / very close).
// Middle ring = 15–45 s (present but less active).
// Outer ring  = 45–60 s (edge of range or quieter device).
const RING_THRESHOLDS: [number, number] = [15_000, 45_000]; // ms

// Radii as fraction of half the canvas size (C).
const RING_FR: [number, number, number] = [0.3, 0.54, 0.78];
const RING_LABELS: [string, string, string] = ["~5m", "~15m", "~30m"];

const AVATAR_SIZE = 34;
const SELF_SIZE = 42;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RadarView({
  peers,
  now,
  onSelectPeer,
}: Props): React.JSX.Element {
  const [canvasSize, setCanvasSize] = useState(0);

  const [ring1] = useState(() => new Animated.Value(0));
  const [ring2] = useState(() => new Animated.Value(0));
  const [ring3] = useState(() => new Animated.Value(0));

  const C = canvasSize / 2;

  // Staggered sonar pulse: three expanding rings at the outer boundary.
  useEffect(() => {
    function pulse(
      val: Animated.Value,
      delay: number,
    ): Animated.CompositeAnimation {
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
  }, [ring1, ring2, ring3]);

  // Bucket peers by recency into the three rings.
  const byRing: [NearbyPeer[], NearbyPeer[], NearbyPeer[]] = [[], [], []];
  for (const peer of peers) {
    const age = now - peer.lastSeenMs;
    if (age < RING_THRESHOLDS[0]) byRing[0].push(peer);
    else if (age < RING_THRESHOLDS[1]) byRing[1].push(peer);
    else byRing[2].push(peer);
  }

  function peerPos(
    ringIndex: 0 | 1 | 2,
    indexInRing: number,
    countInRing: number,
  ): { top: number; left: number } {
    const r = C * RING_FR[ringIndex];
    const angle =
      (indexInRing / Math.max(countInRing, 1)) * 2 * Math.PI - Math.PI / 2;
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

            {/* Center dot: local device */}
            <View
              style={[
                styles.selfDot,
                { top: C - SELF_SIZE / 2, left: C - SELF_SIZE / 2 },
              ]}
            >
              <Feather name="radio" size={14} color={Colors.textInverse} />
            </View>

            {/* Peer nodes distributed across their distance ring */}
            {(byRing as NearbyPeer[][]).map((group, ri) =>
              group.map((peer, pi) => {
                const pos = peerPos(ri as 0 | 1 | 2, pi, group.length);
                return (
                  <PeerNode
                    key={peer.peerID}
                    peer={peer}
                    top={pos.top}
                    left={pos.left}
                    onPress={() => onSelectPeer(peer)}
                  />
                );
              }),
            )}
          </View>

          {/* ---- Status -------------------------------------------------- */}
          <Text style={styles.statusText}>
            {peers.length === 0
              ? "Scanning for nearby peers\u2026"
              : `${peers.length} peer${peers.length !== 1 ? "s" : ""} in range`}
          </Text>
          <Text style={styles.hintText}>
            {peers.length === 0
              ? "Position ring shows estimated BLE distance"
              : "Distance estimated from BLE signal strength"}
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
  onPress: () => void;
}

function PeerNode({
  peer,
  top,
  left,
  onPress,
}: PeerNodeProps): React.JSX.Element {
  const username = peerIDToUsername(peer.peerID);
  return (
    <Pressable
      style={[styles.peerNode, { top, left }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View peer ${username}`}
    >
      <Avatar username={username} peerID={peer.peerID} size={AVATAR_SIZE} />
      <View style={styles.statusBadge}>
        <StatusDot status="online" size={7} />
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

const styles = StyleSheet.create({
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
  guideRing: {
    position: "absolute",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
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
  selfDot: {
    position: "absolute",
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
