// Third-party package licenses, snapshotted from each dependency's own
// package.json at the version pinned in this repo's package.json.
// Regenerate by reading node_modules/<pkg>/package.json "license" fields
// whenever dependencies change.

export interface LicenseEntry {
  name: string;
  version: string;
  license: string;
}

export const THIRD_PARTY_LICENSES: LicenseEntry[] = [
  { name: "@cashu/cashu-ts", version: "4.7.1", license: "MIT" },
  { name: "@expo/vector-icons", version: "15.1.1", license: "MIT" },
  { name: "@noble/ciphers", version: "2.2.0", license: "MIT" },
  { name: "@noble/curves", version: "2.2.0", license: "MIT" },
  { name: "@noble/hashes", version: "2.2.0", license: "MIT" },
  { name: "expo", version: "57.0.6", license: "MIT" },
  { name: "expo-audio", version: "57.0.2", license: "MIT" },
  { name: "expo-build-properties", version: "57.0.5", license: "MIT" },
  { name: "expo-clipboard", version: "57.0.1", license: "MIT" },
  { name: "expo-document-picker", version: "57.0.1", license: "MIT" },
  { name: "expo-file-system", version: "57.0.1", license: "MIT" },
  { name: "expo-image-picker", version: "57.0.5", license: "MIT" },
  { name: "expo-status-bar", version: "57.0.1", license: "MIT" },
  { name: "expo-system-ui", version: "57.0.1", license: "MIT" },
  { name: "nativewind", version: "4.2.6", license: "MIT" },
  { name: "nostr-tools", version: "2.23.12", license: "Unlicense" },
  { name: "react", version: "19.2.7", license: "MIT" },
  { name: "react-native", version: "0.86.0", license: "MIT" },
  {
    name: "react-native-encrypted-storage",
    version: "4.0.3",
    license: "MIT",
  },
  { name: "react-native-gesture-handler", version: "2.32.0", license: "MIT" },
  {
    name: "react-native-get-random-values",
    version: "2.0.0",
    license: "MIT",
  },
  { name: "react-native-mmkv", version: "4.3.2", license: "MIT" },
  { name: "react-native-nitro-modules", version: "0.36.1", license: "MIT" },
  { name: "react-native-qrcode-svg", version: "6.3.21", license: "MIT" },
  { name: "react-native-reanimated", version: "4.5.2", license: "MIT" },
  {
    name: "react-native-safe-area-context",
    version: "5.8.0",
    license: "MIT",
  },
  { name: "react-native-svg", version: "15.15.4", license: "MIT" },
  { name: "react-native-vision-camera", version: "5.1.0", license: "MIT" },
  { name: "zustand", version: "5.0.14", license: "MIT" },
];
