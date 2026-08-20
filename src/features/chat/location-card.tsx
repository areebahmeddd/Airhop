// A place, rendered inside a message bubble.
//
// No map, by design. Tiles are an HTTP call to somebody's server: a
// fingerprint, a dependency, and a grey square in exactly the conditions this
// app exists for. What a person in a crowd needs is a direction and a distance,
// which is what this draws.
//
// The arrow points against true north marked on the card, not against how the
// phone is held: a compass heading would need a subscription and would swing
// while it is read. "Open in Maps" is a handoff the user chooses.

import { Feather } from "@expo/vector-icons";
import { t, useT } from "@i18n";
import {
  getCoarseLocation,
  hasLocationPermission,
} from "@services/location-service";
import type { ChatMessage } from "@store/chat-store";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "@ui/theme";
import { formatListTimestamp } from "@utils/format";
import {
  bearingDegrees,
  compassPoint,
  distanceMeters,
  roundedDistance,
  type Point,
} from "@utils/geo";
import React, { useEffect, useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

type Pin = NonNullable<ChatMessage["locationPin"]>;

// Keyed the way `compassPoint` names them, so this is a lookup rather than a
// switch that can fall out of step with the eight points.
const DIRECTION_KEYS = {
  n: "chat.location.direction.n",
  ne: "chat.location.direction.ne",
  e: "chat.location.direction.e",
  se: "chat.location.direction.se",
  s: "chat.location.direction.s",
  sw: "chat.location.direction.sw",
  w: "chat.location.direction.w",
  nw: "chat.location.direction.nw",
} as const;

export default function LocationCard({
  pin,
  isMine,
}: {
  pin: Pin;
  isMine: boolean;
}): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  // Where the reader is, for the arrow. Null until it resolves, and null for
  // good without a location grant.
  const [here, setHere] = useState<Point | null>(null);

  // Read once per card, and only against an existing grant. Never prompts:
  // somebody else's pin is theirs to read, not a reason to raise a permission
  // dialog, and the card says what is missing instead. `getCoarseLocation`
  // caches for five minutes, so several cards in a thread cost one fix.
  useEffect(() => {
    let alive = true;
    void (async () => {
      if (!(await hasLocationPermission())) return;
      const coords = await getCoarseLocation();
      if (alive && coords !== null) setHere(coords);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const relative = useMemo(() => {
    if (here === null) return null;
    const target: Point = { lat: pin.lat, lng: pin.lng };
    const meters = distanceMeters(here, target);
    return {
      bearing: bearingDegrees(here, target),
      direction: compassPoint(bearingDegrees(here, target)),
      ...roundedDistance(meters),
    };
  }, [here, pin.lat, pin.lng]);

  // A geo: URI is the one link every maps app on both platforms answers, so it
  // opens whichever the user has chosen rather than naming one.
  function openInMaps(): void {
    void Linking.openURL(`geo:${pin.lat},${pin.lng}?q=${pin.lat},${pin.lng}`);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {/* A ring with a north mark and an arrow rotated to the bearing, so
            the drawing carries the same fact the words do. */}
        <View style={styles.dial}>
          <Text style={styles.northMark}>N</Text>
          <View
            style={[
              styles.arrow,
              relative !== null
                ? { transform: [{ rotate: `${relative.bearing}deg` }] }
                : null,
            ]}
          >
            <Feather
              name={relative !== null ? "arrow-up" : "map-pin"}
              size={18}
              color={Colors.accent}
            />
          </View>
        </View>

        <View style={styles.text}>
          <Text style={styles.title}>{T("chat.location.title")}</Text>
          {relative !== null ? (
            <Text style={styles.distance}>
              {t("chat.location.away", {
                distance: `${String(relative.value)} ${relative.unit}`,
                direction: t(DIRECTION_KEYS[relative.direction]),
              })}
            </Text>
          ) : (
            // No fix of our own, so nothing to measure from. Said plainly
            // rather than drawn as an arrow pointing nowhere.
            <Text style={styles.muted}>{T("chat.location.no_fix")}</Text>
          )}
          {/* The age of the fix, not of the message. A pin that waited in a
              composer is older than it looks, and a distance to a stale point
              is the one way this card can mislead. */}
          <Text style={styles.muted}>
            {t("chat.location.taken", {
              ago: formatListTimestamp(pin.takenAtMs),
            })}
          </Text>
        </View>
      </View>

      {/* Both sides: checking what you sent is as reasonable as opening what
          you were sent. */}
      <Pressable
        style={styles.action}
        onPress={openInMaps}
        accessibilityRole="button"
        accessibilityLabel={T("chat.location.open_maps")}
      >
        <Feather name="external-link" size={13} color={Colors.accent} />
        <Text style={[styles.actionText, isMine ? styles.actionMine : null]}>
          {T("chat.location.open_maps")}
        </Text>
      </Pressable>
    </View>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    card: {
      minWidth: 200,
      gap: Spacing.sm,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
    },
    dial: {
      width: 44,
      height: 44,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    northMark: {
      position: "absolute",
      top: 2,
      fontFamily: FontFamily.mono,
      fontSize: 8,
      color: Colors.textMuted,
    },
    arrow: {
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      flex: 1,
      gap: 1,
    },
    title: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.medium,
      color: Colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    distance: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    muted: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    action: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      paddingTop: Spacing.xs,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
    },
    actionText: {
      fontSize: FontSize.sm,
      color: Colors.accent,
    },
    // On our own bubble the accent is the background, so the link takes the
    // foreground colour rather than disappearing into it.
    actionMine: {
      color: Colors.textInverse,
    },
  });
}
