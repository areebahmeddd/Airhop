# Store metadata

This directory contains the app store listing used for App Store, Google Play, and Zapstore.

Keeping the metadata in the repository makes changes reviewable, versioned, and
keeps both store listings in sync.

- **App Store** does not. When publishing a release, copy the contents of
  these files into the App Store Connect instead of editing the listing manually.
- **Google Play** does not. When publishing a release, copy the contents of
  these files into the Play Console instead of editing the listing manually.
- **Zapstore** does not. When publishing a release, copy the contents of
  these files into the Zapstore listing instead of editing it manually.

## Directory layout

```text
fastlane/metadata/android/en-US/
├── title.txt                # App title (30 characters on Play)
├── short_description.txt    # Short description (80 characters max)
├── full_description.txt     # Full description (4000 characters max)
└── changelogs/
    └── <versionCode>.txt    # One file per release (500 characters max)
```

## Changelog files

Changelog filenames use the Android **`versionCode`**, not the user-facing
version name.

The `versionCode` is calculated in `android/app/build.gradle` as:

```text
major * 10000 + minor * 100 + patch
```

Examples:

| Version  | `versionCode` | Changelog file |
| -------- | ------------- | -------------- |
| `v0.9.9` | 909           | `909.txt`      |
| `v1.0.0` | 10000         | `10000.txt`    |
| `v1.2.3` | 10203         | `10203.txt`    |
| `v2.5.1` | 20501         | `20501.txt`    |

## Adding a new language

To add another language:

1. Copy the `en-US` directory to the new locale (for example `de-DE` or `fr-FR`).
2. Translate each file in the new directory.

These files contain **store listing copy only**. The app's interface strings are
maintained separately under `src/i18n/`, since marketing copy and in-app text
are translated independently.
