// Third-party package licenses.
//
// Versions are NOT hardcoded here: they are read from this repo's own
// package.json at build time, so the list can never drift from what's
// actually pinned. The curated-by-hand parts are the package name, its
// license, its repository URL, and which group it belongs to (none of which
// live in the root package.json, and none of which drift the way a version
// does).
//
// To add a package: drop it in the right group below with its license and
// repo. Its version is picked up automatically. When you change a dependency,
// re-check its license field (node_modules/<pkg>/package.json).

import pkg from "../../package.json";

export interface LicenseEntry {
  name: string;
  version: string;
  license: string;
  repo: string;
}

export interface LicenseGroup {
  category: string;
  description: string;
  entries: LicenseEntry[];
}

const DEPENDENCIES = pkg.dependencies as Record<string, string>;

// Strips the range prefix ("^1.2.3" / "~1.2.3" -> "1.2.3") so the screen
// shows a bare version. Falls back to "n/a" if a listed package somehow isn't
// a dependency (e.g. renamed and not yet removed from this file).
function versionOf(name: string): string {
  const range = DEPENDENCIES[name];
  return range ? range.replace(/^[\^~]/, "") : "n/a";
}

// Curated catalog: name, license, and repo, grouped by role and kept
// alphabetical within each group. Each group opens with a one-line plain
// summary of what its packages are for. Versions are filled in from
// package.json by the mapping below.
const CATALOG: {
  category: string;
  description: string;
  packages: { name: string; license: string; repo: string }[];
}[] = [
  {
    category: "Core",
    description:
      "The framework the app is built on: React and React Native, run and packaged by Expo.",
    packages: [
      { name: "expo", license: "MIT", repo: "https://github.com/expo/expo" },
      {
        name: "react",
        license: "MIT",
        repo: "https://github.com/facebook/react",
      },
      {
        name: "react-native",
        license: "MIT",
        repo: "https://github.com/facebook/react-native",
      },
    ],
  },
  {
    category: "Device features",
    description:
      "Access to device hardware and system features like the camera, microphone, location, notifications, clipboard, and files.",
    packages: [
      {
        name: "expo-audio",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-build-properties",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-camera",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-clipboard",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-document-picker",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-file-system",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-haptics",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-image-picker",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-location",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-media-library",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-notifications",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-screen-capture",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-sharing",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-status-bar",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-system-ui",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-video",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
    ],
  },
  {
    category: "UI & rendering",
    description:
      "What draws the interface: icons, styling, gestures, animation, SVG and QR rendering, and the camera preview.",
    packages: [
      {
        name: "@expo/vector-icons",
        license: "MIT",
        repo: "https://github.com/expo/vector-icons",
      },
      {
        name: "nativewind",
        license: "MIT",
        repo: "https://github.com/nativewind/nativewind",
      },
      {
        name: "react-native-gesture-handler",
        license: "MIT",
        repo: "https://github.com/software-mansion/react-native-gesture-handler",
      },
      {
        name: "react-native-qrcode-svg",
        license: "MIT",
        repo: "https://github.com/Expensify/react-native-qrcode-svg",
      },
      {
        name: "react-native-reanimated",
        license: "MIT",
        repo: "https://github.com/software-mansion/react-native-reanimated",
      },
      {
        name: "react-native-safe-area-context",
        license: "MIT",
        repo: "https://github.com/AppAndFlow/react-native-safe-area-context",
      },
      {
        name: "react-native-svg",
        license: "MIT",
        repo: "https://github.com/software-mansion/react-native-svg",
      },
      {
        name: "react-native-vision-camera",
        license: "MIT",
        repo: "https://github.com/mrousavy/react-native-vision-camera",
      },
    ],
  },
  {
    category: "Cryptography & protocol",
    description:
      "The building blocks for encryption and messaging: key exchange, ciphers, hashing, ecash tokens, and Nostr support.",
    packages: [
      {
        name: "@cashu/cashu-ts",
        license: "MIT",
        repo: "https://github.com/cashubtc/cashu-ts",
      },
      {
        name: "@noble/ciphers",
        license: "MIT",
        repo: "https://github.com/paulmillr/noble-ciphers",
      },
      {
        name: "@noble/curves",
        license: "MIT",
        repo: "https://github.com/paulmillr/noble-curves",
      },
      {
        name: "@noble/hashes",
        license: "MIT",
        repo: "https://github.com/paulmillr/noble-hashes",
      },
      {
        name: "nostr-tools",
        license: "Unlicense",
        repo: "https://github.com/nbd-wtf/nostr-tools",
      },
    ],
  },
  {
    category: "Storage & state",
    description:
      "Storing data and managing state: secure and fast local storage, secure randomness, native modules, and in-memory state.",
    packages: [
      {
        name: "react-native-encrypted-storage",
        license: "MIT",
        repo: "https://github.com/emeraldsanto/react-native-encrypted-storage",
      },
      {
        name: "react-native-get-random-values",
        license: "MIT",
        repo: "https://github.com/LinusU/react-native-get-random-values",
      },
      {
        name: "react-native-mmkv",
        license: "MIT",
        repo: "https://github.com/mrousavy/react-native-mmkv",
      },
      {
        name: "react-native-nitro-modules",
        license: "MIT",
        repo: "https://github.com/mrousavy/nitro",
      },
      {
        name: "zustand",
        license: "MIT",
        repo: "https://github.com/pmndrs/zustand",
      },
    ],
  },
];

export const THIRD_PARTY_LICENSES: LicenseGroup[] = CATALOG.map((group) => ({
  category: group.category,
  description: group.description,
  entries: group.packages.map((p) => ({
    name: p.name,
    version: versionOf(p.name),
    license: p.license,
    repo: p.repo,
  })),
}));
