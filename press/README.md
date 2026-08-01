# Press

Store screenshots, the feature graphic and icon, social banners, and the listing
copy. Output is in [out/](out/).

```bash
node press/build.mjs                # everything, light and dark
node press/build.mjs --light        # light only
node press/build.mjs --only=social  # one group: screens | social | icon
```

Each image is an HTML page screenshot by headless Chrome at 2x. Pages stay in
`press/.build/` and can be opened in a browser.

## Panels

| #   | Screen                | Headline                          |
| --- | --------------------- | --------------------------------- |
| 01  | Mesh, radar           | Works when the network doesn't    |
| 02  | Direct message thread | Nobody in the middle can read it  |
| 03  | You                   | No sign up. No phone number.      |
| 04  | Chats, channels       | A room for wherever you are       |
| 05  | Wallet                | Send money with no signal         |
| 06  | Globe                 | Bluetooth ends. The mesh doesn't. |

Plus `00-brand`, a centred title card. Optional: lead with it, or open on 01.

Panel 06 has no device. Each dot on the globe is a Nostr relay location from
`landing/src/data/relays.ts`, and the arcs are a minimum spanning tree over
great-circle distance. Re-run [tools/generate-world.mjs](tools/generate-world.mjs)
when that list changes.

Copy lives in [lib/copy.mjs](lib/copy.mjs).

## Output

```text
out/
  screenshots/
    ios/{light,dark}/       1290x2796  App Store
    android/{light,dark}/   1080x1920  Play and F-Droid
  graphics/
    feature-graphic/{light,dark}/
      feature-graphic.png   1024x500   centred mark. Ship this one
      feature-graphic-device.png       alternate, carries a device
    icon-512.png            512x512    Play and F-Droid
  social/{light,dark}/
    og-1200x630.png                    Open Graph, Twitter large card
    x-header-1500x500.png              X profile header
    linkedin-banner-1584x396.png       LinkedIn page banner
    instagram-square-1080x1080.png     Instagram post
    instagram-story-1080x1920.png      Instagram or WhatsApp story
    github-social-1280x640.png         GitHub social preview
```

45 files. Apple takes the 6.9in size and scales it down to smaller iPhones, so
one iOS set covers every device. Play accepts 320px to 3840px on the long edge
at a ratio no wider than 2:1.

Ship one theme. Light is the default; dark is there if you want it.

`supportsTablet` is `false` in `app.json`, so no iPad sizes are produced. Turn
it on and add a 2064x2752 target to `PHONE_TARGETS` in [build.mjs](build.mjs).

F-Droid wants the Android set under fastlane's filenames:

```bash
node press/build.mjs --fastlane=./fastlane/metadata/android
```

## Notes

**The screens are redrawn in HTML, not captured from a device.** The captures
were ~450px wide against the 1290 the App Store wants. If a screen changes
materially in the app, change it here too.

**The wallet panel names `mint.minibits.cash`.** Swap it in
[lib/screens.mjs](lib/screens.mjs) for whichever mint you want shown.

**Brand rules** are at
[airhop.1mindlabs.org/brand](https://airhop.1mindlabs.org/brand). Source in
`landing/src/pages/BrandPage.tsx`, downloads in `landing/public/brand/`.

| File                               | Holds                                      |
| ---------------------------------- | ------------------------------------------ |
| [lib/copy.mjs](lib/copy.mjs)       | Headlines, subheads, panel order           |
| [lib/screens.mjs](lib/screens.mjs) | The app screens and their CSS              |
| [lib/brand.mjs](lib/brand.mjs)     | Title card, glyph field, icon              |
| [lib/theme.mjs](lib/theme.mjs)     | Colour tokens, mirroring `src/ui/theme.ts` |
| [lib/world.mjs](lib/world.mjs)     | Generated globe geometry, do not hand-edit |
| [build.mjs](build.mjs)             | Canvas sizes, phone geometry, output tree  |

## Listing copy

**Name / title**, 25 of 30

```text
Airhop: Offline Mesh Chat
```

**Subtitle**, Apple, 25 of 30

```text
Message without a network
```

**Short description**, Play, 75 of 80

```text
Private messaging over Bluetooth mesh. No internet, no servers, no accounts.
```

**Promotional text**, Apple, 139 of 170

```text
No towers, no router, no accounts. Airhop passes your messages phone to phone over Bluetooth, so they get through when the network does not.
```

**Keywords**, Apple, 98 of 100

```text
offline,mesh,bluetooth,chat,messenger,private,encrypted,nostr,p2p,ecash,blackout,walkie,no signal
```

**Full description**, both stores, 2097 of 4000

```text
Airhop is a messenger for the moment the network stops.

Phones near you find each other over Bluetooth and form a mesh. Your message
hops through them, up to seven phones deep, and reaches someone you have no
signal to. No towers. No router. No bill. Nothing to sign up for.

WORKS WITH NO INTERNET
Bluetooth mesh is the default path, not a fallback. Everything below works with
the network completely down.

NO ACCOUNT, EVER
Your identity is a key pair made on this phone and stored in the device
keychain. No phone number, no email, no ID. Nothing registers anywhere, so
there is nothing to seize and nothing to leak.

ENCRYPTED END TO END
Direct messages use the Noise XX handshake with Double Ratchet forward secrecy.
The phones relaying your message cannot read it, and an old message stays
protected even if a key leaks later.

ROOMS FOR WHERE YOU ARE
Public channels scoped to your block, your neighbourhood, your city or your
region. When there is internet, they bridge over Nostr relays so a city channel
still works when you are the only person on your street with the app. You can
also read a place you are not in.

PIN A NOTICE THAT OUTLIVES THE CHAT
The bulletin board holds signed notices on your mesh or your area for one to
seven days, with an urgent flag. Someone who walks past an hour later still
gets it.

SEND MONEY WITH NO SIGNAL
Cashu ecash moves device to device over Bluetooth with no connection on either
phone. Top up and cash out over Lightning when you are back online. Optional.

MORE
Live push-to-talk voice over the mesh. Photos, video, files and voice notes.
Store-and-forward, so a nearby phone carries a sealed message until the
recipient is reachable. Tor routing for internet traffic. QR contact exchange.
Panic wipe: triple-tap and every key and message is gone in under a second.
Compatible with bitchat on iOS and Android, on the same mesh, with no setup.

Open source under the MIT licence. No servers, no analytics, no tracking.

Airhop is a work in progress and has not had an external security audit. Do not
rely on it for life-safety or high-risk use.
```

The audit sentence stays in. A reviewer who finds a claim overstated costs more
than a cautious line.

## Upload checklist

App Store Connect

- [ ] `out/screenshots/ios/light/*` in filename order
- [ ] Name, subtitle, keywords, promotional text, description
- [ ] App Privacy: no data collected, no tracking, everything "not collected"
- [ ] Export compliance: non-exempt encryption, open source implementation, so
      the standard exemption applies. Have the repo link ready
- [ ] Review notes: BLE mesh needs two physical devices. A reviewer on one
      device sees an empty Mesh tab

Play Console

- [ ] `out/screenshots/android/light/*` into Phone screenshots
- [ ] `out/graphics/feature-graphic/light/feature-graphic.png`
- [ ] `out/graphics/icon-512.png`
- [ ] Title, short description, full description
- [ ] Data safety: no data collected, no data shared, encrypted in transit
- [ ] Declare nearby-devices and location, and why. Android requires location
      for BLE scanning; it is not used to locate anyone

F-Droid

- [ ] Build with `--fastlane=<path to fastlane/metadata/android>`
- [ ] `en-US/short_description.txt` and `en-US/full_description.txt`
- [ ] F-Droid builds from source, so the listing follows a tagged release

Social

- [ ] `out/social/light/github-social-1280x640.png` into repo Settings, Social
      preview
- [ ] Profile headers on X and LinkedIn from `out/social/light/`
- [ ] Point press at [/brand](https://airhop.1mindlabs.org/brand)

The site's Open Graph image sits at `landing/public/og-preview.png`, where
`landing/index.html` already points. Re-copy it after a rebuild that changes the
card:

```bash
cp press/out/social/light/og-1200x630.png landing/public/og-preview.png
cp press/out/social/light/og-1200x630.png landing/public/brand/airhop-og.png
cp press/out/graphics/icon-512.png landing/public/brand/airhop-mark-512.png
```
