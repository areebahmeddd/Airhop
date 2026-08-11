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
//
// Vendored native binaries (the Arti xcframework) set `version` by hand, since
// npm does not install them.
//
// A package's declared license is the default answer, not the final one: what
// matters is the license of the code that ships in the binary. Where a thin npm
// wrapper links a differently-licensed native library, both are named (see
// react-native-mmkv).

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
  packages: {
    name: string;
    license: string;
    repo: string;
    // Only for entries npm does not install; everything else is looked up.
    version?: string;
  }[];
}[] = [
  {
    category: "Core",
    description:
      "What the app is built on: React and React Native, packaged by Expo.",
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
      "The parts of the phone the app asks for: camera, microphone, location, files, notifications.",
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
        name: "expo-image-manipulator",
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
        name: "expo-navigation-bar",
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
      "What draws the screen: fonts, icons, assets, gestures, animation, SVG and QR codes.",
    packages: [
      {
        name: "@expo-google-fonts/jetbrains-mono",
        license: "MIT AND OFL-1.1",
        repo: "https://github.com/expo/google-fonts",
      },
      {
        name: "@expo/vector-icons",
        license: "MIT",
        repo: "https://github.com/expo/vector-icons",
      },
      {
        name: "expo-asset",
        license: "MIT",
        repo: "https://github.com/expo/expo",
      },
      {
        name: "expo-font",
        license: "MIT",
        repo: "https://github.com/expo/expo",
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
        name: "react-native-worklets",
        license: "MIT",
        repo: "https://github.com/software-mansion/react-native-reanimated/tree/main/packages/react-native-worklets",
      },
    ],
  },
  {
    category: "Cryptography & protocol",
    description:
      "The foundations of encryption and messaging: key exchange, ciphers, hashing, seed phrases, compression, ecash, Nostr.",
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
        name: "@scure/bip39",
        license: "MIT",
        repo: "https://github.com/paulmillr/scure-bip39",
      },
      {
        name: "nostr-tools",
        license: "Unlicense",
        repo: "https://github.com/nbd-wtf/nostr-tools",
      },
      {
        name: "pako",
        license: "MIT AND Zlib",
        repo: "https://github.com/nodeca/pako",
      },
    ],
  },
  {
    category: "Storage & state",
    description:
      "Where data is kept: local storage, secure randomness, native modules, in-memory state.",
    packages: [
      {
        name: "expo-secure-store",
        license: "MIT",
        repo: "https://github.com/expo/expo/tree/main/packages/expo-secure-store",
      },
      {
        name: "react-native-get-random-values",
        license: "MIT",
        repo: "https://github.com/LinusU/react-native-get-random-values",
      },
      {
        // Wrapper is MIT; it links Tencent's MMKV (BSD-3-Clause), which ships
        // in the binary.
        name: "react-native-mmkv",
        license: "MIT AND BSD-3-Clause",
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
  {
    category: "Binaries & frameworks",
    description:
      "Native code committed to this repo and shipped in the app, not installed from npm.",
    packages: [
      {
        // ios/Frameworks/arti.xcframework. iOS only: on Android, Tor goes
        // through Orbot, a separate app. Version read from the crate strings in
        // the binary; re-check when it is re-recorded (verify-vendored.js).
        name: "arti",
        version: "0.38.0",
        license: "MIT OR Apache-2.0",
        repo: "https://gitlab.torproject.org/tpo/core/arti",
      },
    ],
  },
];

export const THIRD_PARTY_LICENSES: LicenseGroup[] = CATALOG.map((group) => ({
  category: group.category,
  description: group.description,
  entries: group.packages.map((p) => ({
    name: p.name,
    version: p.version ?? versionOf(p.name),
    license: p.license,
    repo: p.repo,
  })),
}));
