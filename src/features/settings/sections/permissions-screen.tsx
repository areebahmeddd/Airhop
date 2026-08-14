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
import {
  ensureBlePermissions,
  hasBlePermissions,
} from "@platform/ble-permissions";
import {
  locationPermissionState,
  requestLocationPermission,
} from "@services/location-service";
import { getMeshService } from "@services/mesh-service";
import { useMeshStateStore } from "@store/mesh-state-store";
import { HIT_SLOP } from "@ui/theme";
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
  GroupDivider,
  SettingRow,
  SettingSwitch,
  SubHeader,
  useSharedStyles,
} from "../shared";

import { useT, type TranslationKey } from "@i18n";
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
  labelKey: TranslationKey;
  // Two halves, in the same order on every row: what Airhop uses it for, then
  // what breaks without it. The second half is a consequence, not a
  // justification: people deciding whether to revoke need to know the cost.
  // Both halves live in one key so a translator can join or reorder them.
  needKey: TranslationKey;
}

const PERMISSIONS: PermMeta[] = [
  {
    key: "bluetooth",
    icon: "bluetooth",
    labelKey: "settings.permissions.bluetooth",
    needKey: "settings.permissions.bluetooth_desc",
  },
  {
    key: "location",
    icon: "map-pin",
    labelKey: "settings.permissions.location",
    needKey: "settings.permissions.location_desc",
  },
  {
    key: "notifications",
    icon: "bell",
    labelKey: "settings.permissions.notifications",
    needKey: "settings.permissions.notifications_desc",
  },
  {
    key: "camera",
    icon: "camera",
    labelKey: "settings.permissions.camera",
    needKey: "settings.permissions.camera_desc",
  },
  {
    key: "photos",
    icon: "image",
    labelKey: "settings.permissions.photos",
    needKey: "settings.permissions.photos_desc",
  },
  {
    key: "microphone",
    icon: "mic",
    labelKey: "settings.permissions.microphone",
    needKey: "settings.permissions.microphone_desc",
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
  const T = useT();
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
        read(async () => {
          // iOS has no queryable Bluetooth permission from JS: CoreBluetooth
          // prompts on first use and the answer lives in the system settings.
          // Reporting "unmanaged" there is honest; Android can really answer.
          if (Platform.OS !== "android") return "unmanaged";
          if (await hasBlePermissions()) return "granted";
          // Android cannot be asked whether a denial is permanent without an
          // Activity, so the answer comes from the last request that WAS made -
          // the store flag the mesh banner already reads. Without it this row
          // could only ever say "askable", and offered an Allow that the OS
          // silently swallows for someone who has refused twice.
          return useMeshStateStore.getState().blePermissionBlocked
            ? "blocked"
            : "askable";
        }),
        read(async () => toState(await locationPermissionState())),
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
          // Android 11 and below asks for ACCESS_FINE_LOCATION here, because
          // that is the permission the mesh needs there. The same grant is what
          // the location channels run on, so record it and act on it rather than
          // leaving the two branches each doing half of what the other needs.
          if (result.granted && result.locationRequired) {
            useMeshStateStore.getState().setLocationGranted(true);
            getMeshService()?.refreshGeoChannels();
          }
          break;
        }
        case "location": {
          const granted = await requestLocationPermission();
          useMeshStateStore.getState().setLocationGranted(granted);
          // Re-resolve the location channels, exactly as the startup path does
          // after the same grant. Without it the grant was recorded and nothing
          // acted on it, so #block and its neighbours stayed empty until the
          // next app resume - which reads as the permission not having worked.
          if (granted) {
            getMeshService()?.refreshGeoChannels();
            // Android 11 and below: the permission the mesh waits on IS
            // location, so granting it here can unblock the radios as well.
            // Harmless above API 31, where the reconciler finds nothing to do.
            getMeshService()?.retryRadios();
          }
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
          onPress={() => void Linking.openSettings().catch(() => undefined)}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={T("settings.permissions.open_settings")}
        >
          <Text style={styles.settingValue}>
            {T("settings.permissions.system")}
          </Text>
        </Pressable>
      );
    }
    return (
      <SettingSwitch
        value={state === "granted"}
        onValueChange={() =>
          state === "askable"
            ? void request(key)
            : void Linking.openSettings().catch(() => undefined)
        }
        accessibilityLabel={
          state === "askable"
            ? T("settings.permissions.allow")
            : T("settings.permissions.open_settings")
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <SubHeader title={T("settings.section.permissions")} onBack={onBack} />
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
                  label={T(perm.labelKey)}
                  description={T(perm.needKey)}
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
