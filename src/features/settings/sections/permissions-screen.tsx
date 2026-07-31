// Permissions sub-screen: what the OS has granted this app, in one list.
//
// Two things are deliberately NOT true here, because pretending otherwise is
// how a permissions screen becomes a lie:
//
//   * Nothing on this screen can revoke a permission. No mobile OS lets an app
//     hand one back (Android 13+ has revokeSelfPermissionOnKill, but it kills
//     the process to do it, and iOS has no equivalent at all). So switching a
//     granted row off opens system settings, where revoking actually happens,
//     and the switch stays on until the OS says otherwise.
//   * The state is whatever the OS says right now, re-read every time this
//     screen comes forward. A permission changed in system settings takes
//     effect the moment the user comes back, which is the case a cached copy
//     gets wrong.
//
// What each row can do is ask, when the OS is still willing to be asked. Once
// it is not, the only honest action left is to open Settings.

import Feather from "@expo/vector-icons/Feather";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import React, { useCallback, useEffect, useState } from "react";
import {
  AppState,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  hasLocationPermission,
  requestLocationPermission,
} from "../../../services/location-service";
import { getMeshService } from "../../../services/mesh-service";
import { useMeshStateStore } from "../../../store/mesh-state-store";
import { HIT_SLOP } from "../../../ui/theme";
import {
  ensureBlePermissions,
  hasBlePermissions,
} from "../../../utils/ble-permissions";
import {
  GroupDivider,
  SettingRow,
  SettingSwitch,
  SubHeader,
  useSharedStyles,
} from "../shared";

interface Props {
  onBack: () => void;
}

// Every permission Airhop ever asks for, in the order they matter to the mesh.
// `key` is only an identity for React and the state map.
type PermKey =
  | "bluetooth"
  | "location"
  | "notifications"
  | "camera"
  | "photos"
  | "microphone";

// What we know about one permission right now.
//   granted    the OS has said yes
//   askable    not granted, but the OS will still show its prompt
//   blocked    denied for good; only system settings can change it
//   unmanaged  nothing to report on this platform (see the iOS notes below)
type PermState = "granted" | "askable" | "blocked" | "unmanaged";

interface PermMeta {
  key: PermKey;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  // Two halves, in the same order on every row: what Airhop uses it for, then
  // what breaks without it. The second half is a consequence, not a
  // justification: people deciding whether to revoke need to know the cost.
  need: string;
}

const PERMISSIONS: PermMeta[] = [
  {
    key: "bluetooth",
    icon: "bluetooth",
    label: "Bluetooth",
    need: "Finds nearby phones and carries your messages between them. Without it the mesh cannot run.",
  },
  {
    key: "location",
    icon: "map-pin",
    label: "Location",
    need: "Opens the channels for where you are, and on Android it is what lets Bluetooth scan. Without it those channels stay closed. (Airhop does not track your location.)",
  },
  {
    key: "notifications",
    icon: "bell",
    label: "Notifications",
    need: "Tells you about a message that arrives while Airhop is closed. Without it you see it the next time you open the app.",
  },
  {
    key: "camera",
    icon: "camera",
    label: "Camera",
    need: "Scans a contact's QR code, and takes a photo or video to send. Without it you can still send from your library.",
  },
  {
    key: "photos",
    icon: "image",
    label: "Photos",
    need: "Attaches a photo from your library, and saves one you were sent. Without it you can still take one with the camera.",
  },
  {
    key: "microphone",
    icon: "mic",
    label: "Microphone",
    need: "Records a voice note, and carries live voice when you hold the mic. Without it neither can be sent.",
  },
];

// Turn an Expo permission response into our three real states. `canAskAgain`
// is the only thing that separates "not yet" from "not ever without Settings".
function toState(p: { granted: boolean; canAskAgain: boolean }): PermState {
  if (p.granted) return "granted";
  return p.canAskAgain ? "askable" : "blocked";
}

export default function PermissionsScreen({
  onBack,
}: Props): React.JSX.Element {
  const styles = useSharedStyles();
  const [states, setStates] = useState<Record<PermKey, PermState>>({
    bluetooth: "unmanaged",
    location: "unmanaged",
    notifications: "unmanaged",
    camera: "unmanaged",
    photos: "unmanaged",
    microphone: "unmanaged",
  });

  // Read every permission from the OS. Each is wrapped: a module that throws
  // (an unsupported platform, a permission not declared in this build) must
  // leave the row unknown rather than take the screen down with it.
  const refresh = useCallback(async (): Promise<void> => {
    const read = async (fn: () => Promise<PermState>): Promise<PermState> => {
      try {
        return await fn();
      } catch {
        return "unmanaged";
      }
    };

    const [bluetooth, location, notifications, camera, photos, microphone] =
      await Promise.all([
        read(async () =>
          // iOS has no queryable Bluetooth permission from JS: CoreBluetooth
          // prompts on first use and the answer lives in the system settings.
          // Reporting "unmanaged" there is honest; Android can really answer.
          Platform.OS === "android"
            ? (await hasBlePermissions())
              ? "granted"
              : "askable"
            : "unmanaged",
        ),
        read(async () =>
          (await hasLocationPermission()) ? "granted" : "askable",
        ),
        read(async () => toState(await Notifications.getPermissionsAsync())),
        read(async () => toState(await Camera.getCameraPermissionsAsync())),
        read(async () => toState(await MediaLibrary.getPermissionsAsync(true))),
        read(async () => toState(await Camera.getMicrophonePermissionsAsync())),
      ]);

    setStates({
      bluetooth,
      location,
      notifications,
      camera,
      photos,
      microphone,
    });
  }, []);

  // On mount, and again whenever the app comes back to the foreground. That
  // second one is the whole point: the user leaves for system settings, changes
  // something, and comes back expecting this list to agree with what they did.
  useEffect(() => {
    // Deferred a tick so the first read lands as an ordinary async update
    // rather than a setState inside the effect body.
    const first = setTimeout(() => void refresh(), 0);
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "active") void refresh();
    });
    return () => {
      clearTimeout(first);
      sub.remove();
    };
  }, [refresh]);

  // Ask for one permission. Only reachable from an "askable" row, so this never
  // fires a prompt the OS would silently swallow.
  async function request(key: PermKey): Promise<void> {
    try {
      switch (key) {
        case "bluetooth": {
          const result = await ensureBlePermissions();
          // Whether the refusal is permanent is only knowable from the request
          // itself, so it has to be recorded wherever a request happens - not
          // only on the startup path. Missing it here would leave a stale
          // "blocked" over a permission the user has since granted.
          useMeshStateStore
            .getState()
            .setBlePermissionBlocked(result.blockedForever);
          // Everything else is left to the radio controller. A grant is not the
          // same as a working radio - Bluetooth may still be off, and on Android
          // the stack honours a fresh grant a moment after the app can see it -
          // and the controller is the one place that knows how to tell those
          // apart.
          getMeshService()?.retryRadios();
          break;
        }
        case "location": {
          const granted = await requestLocationPermission();
          useMeshStateStore.getState().setLocationGranted(granted);
          break;
        }
        case "notifications":
          await Notifications.requestPermissionsAsync();
          break;
        case "camera":
          await Camera.requestCameraPermissionsAsync();
          break;
        case "photos":
          await MediaLibrary.requestPermissionsAsync(true);
          break;
        case "microphone":
          await Camera.requestMicrophonePermissionsAsync();
          break;
      }
    } catch {
      // A prompt that could not be shown leaves the row exactly as it was; the
      // refresh below re-reads the truth either way.
    }
    await refresh();
  }

  // The trailing control for a row: one switch, reading the OS state.
  //
  // Switching on is the only move that happens in-app, and only from "askable".
  // Every other direction lands in system settings, because that is the only
  // place the OS lets a grant change. The switch is controlled by `states`, so
  // it snaps back the moment it is let go and only moves once the OS agrees,
  // which is what makes it honest rather than decorative.
  function action(key: PermKey, state: PermState): React.ReactNode {
    // iOS Bluetooth: nothing to read, so nothing to show but the way out.
    if (state === "unmanaged") {
      return (
        <Pressable
          onPress={() => void Linking.openSettings()}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Open system settings to change this permission"
        >
          <Text style={styles.settingValue}>System</Text>
        </Pressable>
      );
    }
    return (
      <SettingSwitch
        value={state === "granted"}
        onValueChange={() =>
          state === "askable" ? void request(key) : void Linking.openSettings()
        }
        accessibilityLabel={
          state === "askable"
            ? "Allow this permission"
            : "Open system settings to change this permission"
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <SubHeader title="Permissions" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            {PERMISSIONS.map((perm, index) => (
              <React.Fragment key={perm.key}>
                {index > 0 && <GroupDivider />}
                <SettingRow
                  icon={perm.icon}
                  label={perm.label}
                  description={perm.need}
                  control={action(perm.key, states[perm.key])}
                />
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
