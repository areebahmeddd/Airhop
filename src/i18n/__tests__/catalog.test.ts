/**
 * @jest-environment node
 */
// Structural integrity of every translation catalog: what a type cannot cover.
// `tsc` already guarantees key completeness, so none of this re-checks that.
//
//   Emptiness     `""` type-checks and renders as a missing label.
//   Plural shape  Every category but `other` is optional on `PluralForms`, so a
//                 catalog missing the forms its language needs compiles.
//   Placeholders  One nothing fills renders as literal "{peer}" on a lock screen.
//   Frozen text   Some strings cross the wire, so translating them breaks
//                 interop, not layout.
//   Punctuation   A string that stops mid-thought reads as truncated and runs
//                 two halves together on a screen reader.
//
// Written against the registry, not English, so every rule reaches every
// catalog automatically.

import { CATALOGS, pluralTranslatorFor } from "../index";
import type { LanguageCode } from "../languages";
import { en } from "../locales/en";
import type { Locale } from "../locales/types";
import { PLURAL_CATEGORIES } from "../plurals";
import { PSEUDO_LANGUAGE } from "../pseudo";

// Read from the same registry the runtime uses, so a language cannot reach a
// user without passing everything below.
const CODES = Object.keys(CATALOGS) as LanguageCode[];

function catalog(code: LanguageCode): Locale {
  return CATALOGS[code] as Locale;
}

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
}

describe.each(CODES)("%s", (code) => {
  const locale = catalog(code);

  it("has no empty strings", () => {
    const empty = Object.entries(locale.strings)
      .filter(([, value]) => value.trim().length === 0)
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });

  it("uses the same placeholders as English in every string", () => {
    // The interpolation contract: `{amount}` in English must survive into every
    // translation, in any position, or the value silently never appears. Order
    // goes unchecked: reordering is exactly what translators need to
    // be free to do, and why placeholders are named, never positional.
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

describe("terminal punctuation", () => {
  // House rule: titles, buttons, labels and one-fragment subtitles take no full
  // stop; modal bodies, empty states and anything running to two or more
  // sentences take one on every sentence, the last included.
  //
  // Only that last clause is checked. Whether a lone string is a fragment or a
  // sentence is a judgment call, so the rule is one-directional: having started
  // a second sentence, finish it. Ellipsis and a question mark both count.
  //
  // Two shapes, because scripts differ on whether a space follows a terminator.
  // A space-delimited one needs the whitespace to tell a sentence break from
  // "1.5" and "e.g."; CJK writes no space and its terminators never appear
  // inside a number. Thai is exempt: it has no sentence-final punctuation at
  // all, and the stops it does write are abbreviation markers.
  const SENTENCE_BREAK = /[.!?؟۔।።။]["'”»)]?\s|[。！？]/u;
  // A trailing placeholder is terminated by whatever fills it. Only the final
  // position counts; one mid-string still needs real punctuation after it.
  const TERMINATED = /([.!?…؟۔।።။。！？]["'”»)]?|\{\w+\})$/u;

  const PROSE = CODES.filter(
    (code) => code !== PSEUDO_LANGUAGE && code !== "th",
  );

  it.each(PROSE)("%s finishes every sentence it starts", (code) => {
    const unfinished: string[] = [];
    const strings: Record<string, string> = {
      ...catalog(code).strings,
      // Plural forms are prose too, and `wallet.backup.already_spent` is the
      // longest string in the catalog.
      ...Object.fromEntries(
        Object.entries(catalog(code).plurals).flatMap(([key, forms]) =>
          Object.entries(forms)
            .filter((form): form is [string, string] => form[1] !== undefined)
            .map(([category, value]) => [`${key}.${category}`, value]),
        ),
      ),
    };
    for (const [key, value] of Object.entries(strings)) {
      if (SENTENCE_BREAK.test(value) && !TERMINATED.test(value)) {
        unfinished.push(`${key}: "${value}"`);
      }
    }
    expect(unfinished).toEqual([]);
  });
});

describe("plural categories", () => {
  // A type cannot catch this: `PluralForms` requires `other` and makes the rest
  // optional, because the set is per-language. The type therefore accepts a
  // Russian catalog with only `one` and `other`, which reads "5 сообщение" from
  // five up. Checked against `PLURAL_CATEGORIES`, which plurals.test.ts checks
  // against CLDR.
  it.each(CODES)("%s supplies exactly the forms its language uses", (code) => {
    const expected = [...PLURAL_CATEGORIES[code]].sort();
    const wrong: string[] = [];
    for (const [key, forms] of Object.entries(catalog(code).plurals)) {
      const actual = Object.keys(forms).sort();
      if (actual.join(",") !== expected.join(",")) {
        wrong.push(
          `${key}: expected [${expected.join(", ")}], got [${actual.join(", ")}]`,
        );
      }
    }
    expect(wrong).toEqual([]);
  });

  it("English is one and other, which the source catalog is written for", () => {
    for (const [key, forms] of Object.entries(en.plurals)) {
      expect([key, Object.keys(forms).sort()]).toEqual([key, ["one", "other"]]);
    }
  });
});

describe("do not translate", () => {
  // These strings are not copy: they cross the wire, or an identity derives from
  // them, so a translated variant is an interop bug. bitchat/ios matches an
  // incoming emote by its English substring, and is itself fully localised while
  // still keeping these as English literals. See docs/spec/ARCHITECTURE.md.
  //
  // Two rules, and the difference matters.
  //
  // ABSENT: never reaches the catalog at all, because the moment one is
  // translatable somebody translates it.
  const MUST_BE_ABSENT = ["hugs", "slaps", "around a bit with a large trout"];

  // VERBATIM: protocol identifiers that legitimately sit inside translated prose.
  // Not forbidden, frozen. Localising "#bluetooth" or "/hug" produces a sentence
  // naming a channel or command that does not exist.
  const MUST_BE_VERBATIM = [
    "#bluetooth",
    "/hug",
    "/slap",
    "/who",
    "/msg",
    "airhop://",
    "npub1",
  ];

  // SURVIVES: proper nouns, and weaker than VERBATIM. "Lightning" and
  // "Tor" are ordinary words in most of these languages and get translated
  // unless a rule stops it. Presence, not count, since a language may drop or
  // repeat a noun for agreement. The noun disappearing never is legitimate.
  const MUST_SURVIVE = [
    "Airhop",
    "bitchat",
    "Nostr",
    "Cashu",
    "Lightning",
    "Tor",
    "GitHub",
    "Ed25519",
    "X25519",
  ];

  it.each(CODES)("%s does not translate the emote verbs", (code) => {
    const offenders: string[] = [];
    for (const [key, value] of Object.entries(catalog(code).strings)) {
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
      const translated: string = catalog(code).strings[key as never];
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

  it.each(CODES)("%s keeps proper nouns untranslated", (code) => {
    const offenders: string[] = [];
    for (const [key, source] of Object.entries(en.strings)) {
      const translated: string = catalog(code).strings[key as never];
      for (const token of MUST_SURVIVE) {
        // Word-boundary so "Tor" does not match inside "Torch", and
        // case-sensitive so it does not match "tor" inside a translated word.
        const boundary = new RegExp(`\\b${token}\\b`);
        if (boundary.test(source) && !boundary.test(translated)) {
          offenders.push(`${key}: "${token}" did not survive`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

// The rules below apply to English alone.
//
// Every other locale sets its own typography and spelling: German quotes with „
// and “, French with « », Japanese with 「 」. Forcing English's conventions onto
// them would be wrong in most of the catalog, so these are scoped to the source
// language, where they stop a translator copying an inconsistency out of the
// file they work from.
describe("English source conventions", () => {
  it("uses typographic apostrophes and quotes, never straight ones", () => {
    // Apple's HIG, the Microsoft Style Guide and Chicago all specify the
    // typographic forms for interface prose. Ellipsis is not checked because it
    // never drifted; the apostrophe did, one screen apart.
    const offenders: string[] = [];
    for (const [key, value] of Object.entries(en.strings)) {
      if (value.includes("'")) offenders.push(`${key}: straight apostrophe`);
      if (value.includes('"')) offenders.push(`${key}: straight quote`);
    }
    expect(offenders).toEqual([]);
  });

  it("spells in US English", () => {
    // The source language's dictionary, not a preference, scoped to words
    // that can plausibly appear in this app's copy. "cancellation" keeps its
    // double L in US English and is left out, so only the verb forms
    // are caught.
    const BRITISH: Record<string, string> = {
      cancelled: "canceled",
      cancelling: "canceling",
      centre: "center",
      centres: "centers",
      centred: "centered",
      colour: "color",
      colours: "colors",
      behaviour: "behavior",
      favourite: "favorite",
      neighbour: "neighbor",
      neighbourhood: "neighborhood",
      licence: "license",
      defence: "defense",
      organise: "organize",
      organised: "organized",
      organisation: "organization",
      recognise: "recognize",
      recognised: "recognized",
      authorise: "authorize",
      authorised: "authorized",
      synchronise: "synchronize",
      synchronised: "synchronized",
      customise: "customize",
      customised: "customized",
      minimise: "minimize",
      maximise: "maximize",
      optimise: "optimize",
      initialise: "initialize",
      analyse: "analyze",
      labelled: "labeled",
      labelling: "labeling",
      signalled: "signaled",
      dialled: "dialed",
      travelling: "traveling",
      fulfil: "fulfill",
      instalment: "installment",
      grey: "gray",
      greyed: "grayed",
      catalogue: "catalog",
      dialogue: "dialog",
      programme: "program",
      judgement: "judgment",
      acknowledgement: "acknowledgment",
      whilst: "while",
      amongst: "among",
      learnt: "learned",
      spelt: "spelled",
      metre: "meter",
      metres: "meters",
      // Kept out on purpose: the catalog measures distance in metric ("~100m",
      // "roughly 10 to 100 meters") and that stays. US English here means
      // spelling and grammar, not a US measurement locale. Every user outside
      // one country, and the protocol documentation, are metric.
    };
    const offenders: string[] = [];
    // Widened to `string` before iterating: `en.plurals` carries literal types,
    // which a [string, string] predicate cannot narrow to.
    const plurals: Record<
      string,
      Record<string, string | undefined>
    > = en.plurals;
    const strings: Record<string, string> = {
      ...en.strings,
      ...Object.fromEntries(
        Object.entries(plurals).flatMap(([key, forms]) =>
          Object.entries(forms)
            .filter((form): form is [string, string] => form[1] !== undefined)
            .map(([category, value]) => [`${key}.${category}`, value]),
        ),
      ),
    };
    for (const [key, value] of Object.entries(strings)) {
      for (const [british, american] of Object.entries(BRITISH)) {
        if (new RegExp(`\\b${british}\\b`, "i").test(value)) {
          offenders.push(`${key}: "${british}" should be "${american}"`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("the pseudolocale bounds every real translation", () => {
  // A screen that passes the pseudolocale must not break in a language that
  // ships, so its padding has to exceed the longest real translation of every
  // key. That holds by construction, and stops holding silently the moment
  // somebody changes the padding.
  const REAL = CODES.filter((code) => code !== PSEUDO_LANGUAGE);

  it("is at least as long as the longest real string, key by key", () => {
    const pseudo = CATALOGS[PSEUDO_LANGUAGE];
    if (pseudo === undefined) return; // release build, nothing to check
    const short: string[] = [];
    for (const key of Object.keys(en.strings) as (keyof typeof en.strings)[]) {
      const longest = Math.max(
        ...REAL.map((code) => catalog(code).strings[key].length),
      );
      if (pseudo.strings[key].length < longest) {
        short.push(`${key}: pseudo ${pseudo.strings[key].length} < ${longest}`);
      }
    }
    expect(short).toEqual([]);
  });

  it("is at least as long as the widest real plural form", () => {
    // Compared across every category rather than the matching one: Arabic's
    // `many` runs far longer than English's `other`, and the widest form is
    // what a row has to hold.
    const pseudo = CATALOGS[PSEUDO_LANGUAGE];
    if (pseudo === undefined) return;
    const short: string[] = [];
    for (const key of Object.keys(en.plurals) as (keyof typeof en.plurals)[]) {
      const longest = Math.max(
        ...REAL.flatMap((code) =>
          Object.values(catalog(code).plurals[key]).map(
            (form) => (form as string | undefined)?.length ?? 0,
          ),
        ),
      );
      const widestPseudo = Math.max(
        ...Object.values(pseudo.plurals[key]).map(
          (form) => (form as string | undefined)?.length ?? 0,
        ),
      );
      if (widestPseudo < longest) {
        short.push(`${key}: pseudo ${widestPseudo} < ${longest}`);
      }
    }
    expect(short).toEqual([]);
  });
});

// One digit system across the whole app.
//
// `@utils/format` pins machine data to `latn` and `formatCount` pins prose
// counts the same way, so a catalog writing its own numerals is the one thing
// left that could disagree with the number beside it: an undo-send picker
// listing "۲ ثانیه" above a rendered "5 ثانیه".
//
// Both halves are checked, because a bare locale resolves to `beng` for Bengali,
// `mymr` for Burmese and `arabext` for Persian.
describe("numerals", () => {
  const NON_LATIN_DIGIT =
    /[\u0660-\u0669\u06F0-\u06F9\u0966-\u096F\u09E6-\u09EF\u0BE6-\u0BEF\u0E50-\u0E59\u1040-\u1049\u1369-\u1371\uFF10-\uFF19]/u;

  for (const code of CODES) {
    it(`${code} writes numbers in the digits the app renders`, () => {
      const stray: string[] = [];
      for (const [key, value] of Object.entries(catalog(code).strings)) {
        const found = NON_LATIN_DIGIT.exec(value);
        if (found !== null) stray.push(`${key}: "${found[0]}"`);
      }
      expect(stray).toEqual([]);
    });
  }

  // Rendered rather than reasoned about, so an ICU upgrade that moves the
  // numbering system fails here.
  const PLURAL_KEYS = Object.keys(en.plurals) as (keyof typeof en.plurals)[];

  for (const code of CODES) {
    it(`${code} renders plural counts in the same digits`, () => {
      const stray: string[] = [];
      for (const key of PLURAL_KEYS) {
        // Reaches every category the shipped languages use, Arabic's six and
        // the Romance round million included.
        for (const count of [0, 1, 2, 5, 11, 21, 101, 1000, 1_000_000]) {
          const rendered = pluralTranslatorFor(code)(key, count);
          const found = NON_LATIN_DIGIT.exec(rendered);
          if (found !== null) {
            stray.push(`${key} @ ${String(count)}: "${found[0]}"`);
          }
        }
      }
      expect(stray).toEqual([]);
    });
  }
});

// Typographic consistency per locale, deliberately not a house style.
//
// English, French, Italian, Dutch and Ukrainian all write the typographic
// apostrophe by their own conventions. Malagasy, Turkish, Filipino and Swahili
// write the straight one, and in Swahili it is a letter rather than punctuation:
// the apostrophe in "ng'ombe" spells a sound.
//
// What is always wrong is one catalog using both.
describe("apostrophes", () => {
  it.each(CODES)("%s does not mix straight and typographic", (code) => {
    const locale = catalog(code);
    const all = [
      ...Object.values(locale.strings),
      ...Object.values(locale.plurals).flatMap((forms) =>
        Object.values(forms).filter((v): v is string => v !== undefined),
      ),
    ].join(" ");
    const straight = all.includes("'");
    const typographic = all.includes("’");
    expect([code, straight && typographic]).toEqual([code, false]);
  });
});
