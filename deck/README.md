# Deck

The pitch deck, generated rather than drawn. Output is
[out/airhop-deck.pptx](out/): ten slides that carry the argument, three appendix
slides that carry the detail, speaker notes on every one.

```bash
cd deck && npm install
npm run screens   # device shots, once, needs Chrome or Edge
npm run build     # writes out/airhop-deck.pptx, then checks it
npm run preview   # renders the built file back to PNG so you can look at it
```

Flags:

```bash
node build.mjs --core                 # the ten slides, no appendix
node build.mjs --anim                 # fade transitions and entrance builds
node build.mjs --out=../somewhere.pptx
DECK_MONO="JetBrains Mono" node build.mjs
```

## The deck

| #   | Slide            | What it argues                                                  |
| --- | ---------------- | --------------------------------------------------------------- |
| 01  | Cover            | What this is, in one line                                       |
| 02  | The problem      | The network fails, often, everywhere                            |
| 03  | Demand           | When it fails, people install this category the same day        |
| 04  | Landscape        | Offline, hardware free and open is a short list                 |
| 05  | The product      | It exists, it shipped, here are the screens and the store links |
| 06  | How it works     | Discover, relay, reach further                                  |
| 07  | Security         | Written against a hostile stranger, and tested by attacking it  |
| 08  | The wedge        | It speaks bitchat's protocol, so it starts with a mesh to join  |
| 09  | Market and model | Sized from events, and nearly free to serve                     |
| 10  | The ask          | Two audits, a device lab, distribution, contributors            |
| A1  | Architecture     | One TypeScript core, two thin native radios                     |
| A2  | Roadmap          | Six versions done, ten written down                             |
| A3  | Risks            | What could stop this, with the mitigation attached              |

The appendix is numbered separately so nobody reads "12 of 13" and wonders what
they missed. Present the ten; open the appendix when someone asks.

## Why a generator

Copy, numbers and layout are three files a person edits, and one command
produces the file. Change a number once and the slide, the source line and the
speaker note under it all follow. Nothing drifts because somebody dragged a text
box.

## Layout

| Path                                                 | Holds                                                            |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| [SCRIPT.md](SCRIPT.md)                               | What to say out loud. Two minutes fifty, plus a sixty-second cut |
| [lib/content.mjs](lib/content.mjs)                   | Every word, number, link and speaker note                        |
| [lib/tokens.mjs](lib/tokens.mjs)                     | Colour, type scale, grid. Light half of `landing/src/index.css`  |
| [lib/draw.mjs](lib/draw.mjs)                         | Cards, chips, leader labels, stat tiles, tables, links           |
| [lib/slides.mjs](lib/slides.mjs)                     | One function per slide, in order                                 |
| [lib/motion.mjs](lib/motion.mjs)                     | Transitions and builds, and the zip repack                       |
| [tools/render-screens.mjs](tools/render-screens.mjs) | Device screens, straight from the `press/` renderer              |
| [tools/preview.mjs](tools/preview.mjs)               | Renders the built `.pptx` back to PNG, by reading the file       |
| [tools/check.mjs](tools/check.mjs)                   | Canvas size, shapes on canvas, notes, timing consistency         |

## Design

Same language as `landing/` and `press/`: monochrome, hairline borders, one card
radius, JetBrains Mono for machine data and Segoe UI for prose, a numeral and a
rule beside every label, no shadows, and no colour that is not carrying meaning.
Blue appears where the landing uses it, for the Nostr relay, and nowhere else.

There are no charts. Every figure here is a single value, and a single value has
no shape to plot, so they are set as type in a stat tile instead.

## Links

Thirty of them, and they all resolve. Every project in the comparison table
links to its own site, every source line links to the report it cites, the store
row links to the four places the app can be downloaded, the compatibility strip
links to `PROTOCOLS.md`, and each appendix slide links to the document it
summarises. A number nobody can check is a number nobody should believe.

## Fonts

Segoe UI ships with Windows and matches `press/build.mjs`. JetBrains Mono is the
brand mono face but ships with the app and the site rather than with the OS, so
the deck defaults to Consolas, which is installed anywhere PowerPoint is. Install
JetBrains Mono on the presenting machine and rebuild with `DECK_MONO` to get the
real face.

## Motion

Off by default. A deck that animates is a deck that fights the presenter, and a
build that half-plays on someone else's PowerPoint is worse than no build at all.

`--anim` turns it on. PptxGenJS writes no animation, so `lib/motion.mjs` opens
the finished file and patches each slide with a fade transition and a staggered
fade-in of the content groups. Chrome is never animated: the eyebrow, title and
subhead are on screen the moment the slide is. `tools/check.mjs` then fails the
build on a duplicate timing id, an effect pointing at a shape that is not on the
slide, or the two elements landing in the wrong order.

`lib/motion.mjs` also repacks the zip on every build. PptxGenJS ignores its own
`compression` flag whenever an outputType is given, so without the repack every
part ships stored and the file is roughly twice the size.

## Numbers

External figures carry a short source on the slide, a link to the report, and
the full citation in the speaker notes. Internal figures are countable here:

| Figure | Where it comes from                                       |
| ------ | --------------------------------------------------------- |
| 189    | source files under `src/`, tests and mocks excluded       |
| 125    | `*.test.ts` files under `src/`                            |
| 1,526  | keys in `src/i18n/locales/en.ts`                          |
| 398    | rows in `assets/data/nostr_relays.csv`                    |
| 70+    | scenario IDs across `src/services/__tests__/sim/`         |
| 17     | findings in the security review in `docs/dev/PROGRESS.md` |

Recount them before a version bump. A stale number in a pitch is worse than no
number.
