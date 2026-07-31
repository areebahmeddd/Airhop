/**
 * @jest-environment node
 */
// Structural integrity of the translation catalog.
//
// Key completeness is already guaranteed by the type system (every locale is
// annotated `Strings`, which is `Record<TranslationKey, string>` derived from
// en.ts), so these tests deliberately do NOT re-check what `tsc` checks. They
// cover what a type cannot:
//
//   1. Emptiness. `""` type-checks and renders as a missing label.
//   2. Plural shape. English has exactly one/other, and the runtime's plural
//      selection is written against that. A key with a stray `few` would be
//      dead weight nothing selects.
//   3. Placeholder sanity. A placeholder nothing will fill renders as literal
//      "{peer}" on someone's lock screen.
//   4. The do-not-translate list. Some strings cross the wire or derive an
//      identity, and translating them breaks interop rather than the layout.
//
// These are written against the catalog rather than against English, so they
// keep their value when a second language lands: point CATALOGS at both and
// every rule below applies to both.

import { en } from "../locales/en";
import type { Locale } from "../locales/types";

const CATALOGS: Record<string, Locale> = { en };
const CODES = Object.keys(CATALOGS);

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
}

describe.each(CODES)("%s", (code) => {
  const locale = CATALOGS[code];

  it("has no empty strings", () => {
    const empty = Object.entries(locale.strings)
      .filter(([, value]) => value.trim().length === 0)
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });

  it("uses the same placeholders as English in every string", () => {
    // The interpolation contract: `{amount}` in English must survive into every
    // translation, in any position, or the value silently never appears. Order
    // is not checked on purpose: reordering is exactly what translators need to
    // be free to do, and why placeholders are named rather than positional.
    const mismatched: string[] = [];
    for (const [key, source] of Object.entries(en.strings)) {
      const expected = placeholders(source);
      const actual = placeholders(locale.strings[key as never]);
      if (expected.join(",") !== actual.join(",")) {
        mismatched.push(
          `${key}: expected [${expected.join(", ")}], got [${actual.join(", ")}]`,
        );
      }
    }
    expect(mismatched).toEqual([]);
  });

  it("invents no placeholders in any plural form", () => {
    // Deliberately a subset rule, not the exact-match rule used for plain
    // strings above. A singular form may legitimately drop the count: English
    // itself says "Someone nearby" for one and "{count} people nearby" for the
    // rest, and other languages inline the number in different forms again.
    //
    // What is never legitimate is a placeholder nothing will fill. `count` is
    // always allowed because tPlural injects it whether or not the caller
    // passes it.
    const invented: string[] = [];
    for (const [key, forms] of Object.entries(en.plurals)) {
      const allowed = new Set(["count"]);
      for (const value of Object.values(forms)) {
        for (const name of placeholders(value)) allowed.add(name);
      }
      for (const [category, value] of Object.entries(
        locale.plurals[key as never] as Record<string, string>,
      )) {
        for (const name of placeholders(value)) {
          if (!allowed.has(name))
            invented.push(`${key}.${category}: {${name}}`);
        }
      }
    }
    expect(invented).toEqual([]);
  });
});

describe("English plural categories", () => {
  it("are exactly one and other", () => {
    // English is the language the runtime's `count === 1` rule is written for.
    // A key carrying `few` or `many` would be a form nothing ever selects, and
    // a key missing `one` would read "1 peers in range".
    for (const [key, forms] of Object.entries(en.plurals)) {
      expect([key, Object.keys(forms).sort()]).toEqual([key, ["one", "other"]]);
    }
  });
});

describe("do not translate", () => {
  // These strings are not copy. They cross the wire, or an identity is derived
  // from them, so a translated variant is an interop bug rather than a cosmetic
  // one. See docs/spec/ARCHITECTURE.md.
  //
  //   - The transmitted /hug and /slap text. bitchat/ios detects an incoming
  //     emote by matching the English substrings ("hugs <nick>", "slaps <nick>
  //     around") in ChatPublicConversationCoordinator. Localising what we send
  //     means bitchat stops recognising it. Note bitchat is itself fully
  //     localised and still keeps these as English literals, for this reason.
  //   - Slash command tokens. The hint that describes a command is translated;
  //     the token the parser matches is not.
  //   - The public mesh channel name.
  //
  // Two different rules, and the difference matters.
  //
  // ABSENT: the emote verbs Airhop transmits. These must never reach the
  // catalog at all, because the moment one is translatable somebody will
  // translate it, and bitchat will stop recognising our emotes.
  const MUST_BE_ABSENT = ["hugs", "slaps", "around a bit with a large trout"];

  // VERBATIM: protocol identifiers that legitimately appear inside translated
  // prose ("Link this area's public #bluetooth chat with..."). They are not
  // forbidden, they are frozen: wherever English uses one, every translation
  // must carry the same token through untouched. A translator who localises
  // "#bluetooth" or "/hug" produces a sentence that names a channel or command
  // that does not exist.
  const MUST_BE_VERBATIM = ["#bluetooth", "/hug", "/slap", "/who", "/msg"];

  it.each(CODES)("%s does not translate the emote verbs", (code) => {
    const offenders: string[] = [];
    for (const [key, value] of Object.entries(CATALOGS[code].strings)) {
      for (const word of MUST_BE_ABSENT) {
        if (new RegExp(`(^|\\s)${word}(\\s|$)`).test(value)) {
          offenders.push(`${key}: ${word}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it.each(CODES)("%s carries protocol identifiers through verbatim", (code) => {
    const offenders: string[] = [];
    for (const [key, source] of Object.entries(en.strings)) {
      const translated: string = CATALOGS[code].strings[key as never];
      for (const token of MUST_BE_VERBATIM) {
        const inEnglish = source.split(token).length - 1;
        const inTranslation = translated.split(token).length - 1;
        if (inEnglish !== inTranslation) {
          offenders.push(
            `${key}: expected ${String(inEnglish)}x "${token}", got ${String(inTranslation)}`,
          );
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
