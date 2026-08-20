// Send one place to one person.
//
// A confirmation step rather than a one-tap send, because what is handed over
// is where the user is standing. The sheet states the two things the design
// promises: a single point, and no further updates.
//
// See core/mesh/wire/location-pin.ts for why one-shot is the whole feature.

import { Feather } from "@expo/vector-icons";
import { useT } from "@i18n";
import { rejected, succeeded } from "@platform/haptics";
import {
  getCoarseLocation,
  requestLocationPermission,
} from "@services/location-service";
import { getMeshService } from "@services/mesh-service";
import BottomSheet from "@ui/components/bottom-sheet";
import {
  FontSize,
  FontWeight,
  MIN_TOUCH,
  Radius,
  Spacing,
  useThemeColors,
} from "@ui/theme";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  // The mesh peer to send to. A per-cell geohash pseudonym is never offered
  // this, so this is always a 16-hex peer ID.
  peerID: string;
  displayName: string;
}

// `failed-fix` and `failed-send` are separate because the remedies differ: one
// is a permission or a sky, the other is a peer who is not reachable.
type Phase = "confirm" | "sending" | "failed-fix" | "failed-send";

export default function SendLocationSheet({
  visible,
  onClose,
  peerID,
  displayName,
}: Props): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [phase, setPhase] = useState<Phase>("confirm");
  // Bumped on close, so an answer landing after the sheet is dismissed is
  // discarded rather than writing a failure the next open would show for an
  // attempt that was never made.
  const attemptRef = useRef(0);

  function close(): void {
    attemptRef.current += 1;
    setPhase("confirm");
    onClose();
  }

  async function handleSend(): Promise<void> {
    const attempt = attemptRef.current;
    const stale = (): boolean => attemptRef.current !== attempt;
    setPhase("sending");

    // Asked at the moment it is needed, as the geohash channels do. Someone
    // who never sends a pin is never prompted.
    const granted = await requestLocationPermission();
    if (stale()) return;
    if (!granted) {
      rejected();
      setPhase("failed-fix");
      return;
    }
    const coords = await getCoarseLocation();
    if (stale()) return;
    if (coords === null) {
      rejected();
      setPhase("failed-fix");
      return;
    }

    const sent = getMeshService()?.sendLocationPin(peerID, {
      lat: coords.lat,
      lng: coords.lng,
      takenAtMs: Date.now(),
    });
    // Null means no session carried it. A pin is not queued, so this is a real
    // failure with an explanation rather than a pending clock over something
    // that would arrive stale.
    if (sent === null || sent === undefined) {
      rejected();
      setPhase("failed-send");
      return;
    }
    succeeded();
    close();
  }

  return (
    <BottomSheet visible={visible} onClose={close}>
      <View style={styles.body}>
        <View style={styles.icon}>
          <Feather name="map-pin" size={22} color={Colors.accent} />
        </View>

        {phase === "sending" ? (
          <>
            <Text style={styles.title}>{T("chat.location.finding")}</Text>
            <ActivityIndicator color={Colors.textMuted} />
          </>
        ) : phase === "failed-fix" ? (
          <>
            <Text style={styles.title}>{T("chat.location.no_location")}</Text>
            <Text style={styles.sub}>
              {T("chat.location.no_location_body")}
            </Text>
            <Pressable
              style={styles.primary}
              onPress={() => setPhase("confirm")}
              accessibilityRole="button"
            >
              <Text style={styles.primaryText}>{T("common.ok")}</Text>
            </Pressable>
          </>
        ) : phase === "failed-send" ? (
          <>
            <Text style={styles.title}>{T("chat.location.not_delivered")}</Text>
            <Text style={styles.sub}>
              {T("chat.location.not_delivered_body", { name: displayName })}
            </Text>
            <Pressable
              style={styles.primary}
              onPress={close}
              accessibilityRole="button"
            >
              <Text style={styles.primaryText}>{T("common.ok")}</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.title}>{T("chat.location.send_title")}</Text>
            {/* Stated before the tap rather than after. */}
            <Text style={styles.sub}>
              {T("chat.location.send_body", { name: displayName })}
            </Text>
            <Pressable
              style={styles.primary}
              onPress={() => void handleSend()}
              accessibilityRole="button"
              accessibilityLabel={T("chat.location.send")}
            >
              <Text style={styles.primaryText}>{T("chat.location.send")}</Text>
            </Pressable>
            <Pressable
              onPress={close}
              accessibilityRole="button"
              accessibilityLabel={T("common.cancel")}
            >
              <Text style={styles.secondary}>{T("common.cancel")}</Text>
            </Pressable>
          </>
        )}
      </View>
    </BottomSheet>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    body: {
      alignItems: "center",
      gap: Spacing.md,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.lg,
    },
    icon: {
      width: 48,
      height: 48,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.surface,
    },
    title: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      textAlign: "center",
    },
    sub: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: FontSize.sm * 1.45,
    },
    primary: {
      minWidth: 200,
      minHeight: MIN_TOUCH,
      marginTop: Spacing.xs,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textInverse,
    },
    secondary: {
      fontSize: FontSize.base,
      color: Colors.textMuted,
      paddingVertical: Spacing.sm,
    },
  });
}
