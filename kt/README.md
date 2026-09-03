# KT: the Airhop maintainer manual

A 51 chapter static site explaining Airhop from bits on a wire upward. Written
to be read by someone with no background at all, and to be usable as reference
by someone who maintains the codebase.

## Opening it

No build step, no dependencies, no server needed.

```bash
open KT/index.html            # macOS
start KT/index.html           # Windows
xdg-open KT/index.html        # Linux
```

Or serve it, if you prefer a real origin:

```bash
npx serve KT
```

## What is in it

| Part                      | Chapters | Covers                                                                                |
| ------------------------- | -------- | ------------------------------------------------------------------------------------- |
| Orientation               | 00 to 03 | What Airhop is, the repository map, every user flow                                   |
| Foundations               | 04 to 06 | Networking from nothing, what a key is, why AES and RSA lost                          |
| The physical layer        | 07 to 08 | Radio from first principles, Bluetooth Low Energy                                     |
| The protocol              | 09 to 15 | Wire format, fragmentation, routing, sync, courier, queues, the mesh service          |
| Cryptography and identity | 16 to 21 | Primitives, Noise, forward secrecy, protocols compared, identity, contacts            |
| Rooms and places          | 22 to 23 | Four kinds of room, the bulletin board, geohash and location                          |
| The internet layer        | 24 to 27 | Nostr, Tor, bridges and pluggable transports, gateway and bridge                      |
| Media and transports      | 28 to 31 | Transport selection, the LAN transport, files and media, live voice                   |
| Money                     | 32 to 34 | Cashu ecash, wallet operations, custody and the nutzap flow                           |
| The device                | 35 to 42 | Storage and wipe, platform, permissions, power and radiation, build, i18n, UI, design |
| Adversaries and proof     | 43 to 45 | Threat model, testing and simulation, scale and chaos                                 |
| The wider world           | 46 to 48 | Airhop vs bitchat, LoRa and hardware, Fediverse and AT Protocol                       |
| Verdict                   | 49 to 50 | Engineering review, glossary and drills                                               |

The teaching chapters all follow the same shape: in plain words, the problem,
how it works with a diagram, the numbers and why those values, the files that
implement it, what breaks it, what removing it would cost, alternatives, and
drills. Four are reference instead, and are shaped for their job: 02 walks the
file tree, 03 walks the flows, 49 is findings in severity order, 50 is the
glossary and the drill set.

## Where to start

- **No background at all:** read in order, and do not skip part 1. Chapters 04
  to 06 build networking and cryptography from nothing; everything after them
  assumes it.
- **Already an engineer:** 01, 02, 09, 11, 15, 17, 43, 49.
- **Preparing to answer questions:** 50 is a glossary plus drills with model
  answers, grouped by who is asking.
- **Deciding what to work on next:** 49 is the engineering review, with findings
  in severity order and a recommended sequence.

## Easy to miss

| Question                                             | Chapter |
| ---------------------------------------------------- | ------- |
| What is mDNS, and how does it differ from DNS        | 04      |
| Why is peer-to-peer hard over the internet           | 04      |
| What is a public key, physically                     | 05      |
| Why ChaCha20 and not AES, why not RSA                | 06      |
| When does a carried envelope wake up and move        | 13      |
| Peer registry against link registry                  | 14      |
| Why is `mesh-service.ts` 6,349 lines                 | 15      |
| Signal vs MLS vs Bramble vs Scuttlebutt              | 19      |
| What is in a contact QR, and what a share code is    | 21      |
| How does the bulletin board work                     | 22      |
| How does the location feature work                   | 23      |
| How Tor is embedded, and why it cannot leak          | 25      |
| What obfs4 and Snowflake do, and when to use each    | 26      |
| Why the LAN transport is off by default              | 29      |
| Exactly which Cashu NUTs are used, and which are not | 32      |
| How Lightning works, and where the mint sits in it   | 32      |
| Is this a custodial wallet                           | 34      |
| When is each OS permission asked for                 | 37      |
| How the battery policy decides how hard to scan      | 38      |
| Is constant Bluetooth a health question              | 38      |
| How the Rust and Go binaries are built and pinned    | 39      |
| What do knip, Metro and vendor.lock.json do          | 39      |
| What does `scripts/` contain and why                 | 39      |
| What is in `courier-test-vectors.json`               | 39      |
| Why every spacing, radius and colour is what it is   | 42      |
| Which apps the interface borrows conventions from    | 42      |

## Editing it

- One file per chapter. Plain HTML, no framework.
- `assets/kt.css` is the whole stylesheet. Monochrome tokens, light and dark.
- `assets/kt.js` holds `KT_MANIFEST`, the single list of chapters. Adding a
  chapter means one entry there plus one HTML file; the sidebar, the previous
  and next links, and the index cards all build from it.
- Renumbering means renaming files, updating cross-links, and updating the
  `<title>`, meta description and `.kt-kicker` in each file. Scriptable, and
  easy to get wrong by hand.
- House style, matching the rest of the project: no em dashes, plain words,
  claims sourced to a file or marked as judgement.

## Status of the content

Written against the codebase at v1.0.x. Where the repository's own
documentation and the code disagree, this manual follows the code and says so.
Those discrepancies are collected in chapter 49.
