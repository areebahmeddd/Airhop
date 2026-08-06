# Building Airhop on iOS

> [!WARNING]
> Do not run `expo prebuild`. It regenerates `ios/` and `android/` from the Expo
> template, which does not contain Airhop's native modules, `Info.plist`, or the
> Xcode project. Recover with `git checkout -- ios/ android/`.
>
> `npm run ios` and `npm run android` are safe. They only prebuild when the
> platform directory is missing, and both are committed.

## Requirements

|           |                                                                         |
| --------- | ----------------------------------------------------------------------- |
| macOS     | Sonoma 14.5+                                                            |
| Xcode     | 26+. App Store Connect rejects older builds                             |
| Node      | 22 LTS                                                                  |
| CocoaPods | `brew install cocoapods`                                                |
| iPhone    | iOS 16.4+. The simulator has no Bluetooth, so the mesh cannot run on it |

## Setup

```bash
git clone https://github.com/areebahmeddd/airhop.git
cd airhop
npm ci
npx pod-install
open ios/Airhop.xcworkspace
```

Open the **workspace**, not `Airhop.xcodeproj`. The project alone has no pods
linked and fails with missing headers.

Re-run `npx pod-install` after changing a native dependency. JavaScript changes
do not need it.

## Signing

`DEVELOPMENT_TEAM` is deliberately absent, so the signing team is yours. A red
signing error on first open is expected.

1. **Xcode > Settings > Accounts**, add your Apple ID. A free account runs on
   your own device; a paid account ($99/yr) is needed for TestFlight and the
   App Store.
2. **Airhop target > Signing & Capabilities**, tick **Automatically manage
   signing**, pick your team.
3. Connect an iPhone, unlock it, tap **Trust**.
4. Build (`⌘R`).
5. On the phone: **Settings > General > VPN & Device Management**, trust your
   certificate. Until you do, the app installs but will not launch.

If Xcode says `org.onemindlabs.airhop` is unavailable, change the bundle
identifier locally and do not commit it. Apps signed with a free account stop
launching after 7 days and need reinstalling.

## Running

Start Metro in a separate terminal, then build from Xcode:

```bash
npm start
```

Release builds embed the bundle and do not need Metro:

```bash
npm run ios:release
```

The simulator is fine for UI, theming, localisation, the wallet, and Nostr
location channels. Peer discovery, DMs, and mesh channels need two physical
devices. One iPhone plus one Android exercises the cross-platform path, which is
where most bugs are.

## Two things nothing regenerates

Android derives both of these from `app.json` at build time. iOS cannot, so they
are yours to remember.

**Permission strings.** Adding one to `app.json` does nothing on iOS until it is
also in `ios/Airhop/Info.plist`. iOS does not deny a permission whose usage
string is missing, it terminates the process the moment the API is touched, with
no crash dialog.

**Version.** `MARKETING_VERSION` in the Xcode target must match `expo.version`.
`CURRENT_PROJECT_VERSION` is the build number and stays at 1: Android's
`versionCode` must rise forever, but the iOS build number only has to rise
within one version. Raise it by hand only when uploading the same version twice.

## Permissions

Nothing is requested at launch. Each prompt fires on first use.

| Prompt                       | Fires on                                     | Key                                                    |
| ---------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| Bluetooth                    | first `getRadioState()` at mesh start        | `NSBluetoothAlwaysUsageDescription`                    |
| Local Network                | first MultipeerConnectivity browse/advertise | `NSLocalNetworkUsageDescription` + `NSBonjourServices` |
| Location                     | opening a location channel                   | `NSLocationWhenInUseUsageDescription`                  |
| Camera / Microphone / Photos | QR scan, voice note, attachment              | `NSCamera` / `NSMicrophone` / `NSPhotoLibrary...`      |

iOS never re-prompts once denied. To retest, delete the app or use
**Settings > General > Transfer or Reset iPhone > Reset > Reset Location &
Privacy**.

## What to test on a device

1. First launch. Grant Bluetooth, confirm the radar sweeps without a relaunch.
2. Bluetooth off then on from Control Centre. The device must stay discoverable.
3. Deny Bluetooth. The Mesh tab must say the permission was denied, not that the
   radio is off.
4. Background for a few minutes and return. The mesh should still be up.
5. App switcher mid-conversation. The card must show the Airhop mark, not the
   chat.
6. Two devices: discovery, a DM, and a channel message both ways.

## Troubleshooting

| Symptom                                     | Fix                                                                                                                                                                                                                        |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Missing headers on first build              | You opened `.xcodeproj`. Open `Airhop.xcworkspace`.                                                                                                                                                                        |
| `'AirhopBLE' could not be found` red screen | Source files are not in the target. **Build Phases > Compile Sources** should list 15 files: 13 Airhop modules, `AppDelegate.swift`, and `ExpoModulesProvider.swift`. Drag any missing file in and tick the Airhop target. |
| `Sandbox: bash(...) deny file-write`        | **Build Settings > User Script Sandboxing** to `No`.                                                                                                                                                                       |
| `node: command not found` in a build phase  | Xcode cannot see nvm. Create `ios/.xcode.env.local` with `export NODE_BINARY=$(which node)`.                                                                                                                               |
| Pods out of date after a pull               | `npx pod-install`                                                                                                                                                                                                          |
| No peers on the simulator                   | Expected. Use two devices.                                                                                                                                                                                                 |
| App installs but dies instantly             | Certificate not trusted on the device.                                                                                                                                                                                     |
| App stops launching after a week            | Free account provisioning expired. Rebuild.                                                                                                                                                                                |

## Notes

- Deployment target is 16.4 across `app.json`, `ios/Podfile`,
  `Podfile.properties.json` and the Xcode project.
- `SWIFT_VERSION` is pinned to 5.0. Swift 6 turns on strict concurrency
  checking, which the CoreBluetooth and AVAudioEngine delegates are not
  annotated for.
- `Airhop.entitlements` is empty by design. Background BLE comes from
  `UIBackgroundModes`, not entitlements.
- `PrivacyInfo.xcprivacy` declares no collected data and no tracking.
- `ITSAppUsesNonExemptEncryption` is `false`. Airhop uses only published,
  standard cryptography and its source is public, which is the
  publicly-available exemption. See the comment above the key.
- `NSBonjourServices` declares `_airhop-mesh._tcp`; `MCConst.serviceType` is
  `airhop-mesh`. Both correct: the plist wants the full form,
  MultipeerConnectivity the bare name.
- `NSBluetoothPeripheralUsageDescription` is pre-iOS 13 and unused at this
  deployment target.
- `ios/Frameworks/arti.xcframework` is a prebuilt binary. CI refuses silent
  changes to it.
