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
//   5. Terminal punctuation on multi-sentence strings. A string that stops
//      mid-thought reads as truncated text, and runs the two halves together
//      on a screen reader.
//
// These are written against the catalog rather than against English, so they
// keep their value when a second language lands: point CATALOGS at both and
// every rule below applies to both.

import { CATALOGS } from "../index";
import type { LanguageCode } from "../languages";
import { en } from "../locales/en";
import type { Locale } from "../locales/types";
import { PLURAL_CATEGORIES } from "../plurals";
import { PSEUDO_LANGUAGE } from "../pseudo";

// Every catalog that ships, read from the same registry the runtime uses, so a
// language cannot reach a user without passing everything below. A catalog is
// present here only if it compiled, and it compiles only if it is complete.
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

describe("terminal punctuation", () => {
  // The house rule:
  //
  //   Titles, buttons and labels take no full stop. A row subtitle that is one
  //   fragment takes none either. Modal bodies, empty states, and any string
  //   that runs to two or more sentences take one on every sentence, including
  //   the last.
  //
  // Only the last clause is checked, deliberately. Whether a lone string is a
  // fragment or a sentence is a judgment call, and a test that guessed would
  // fire on every modal body and empty state, which are single sentences that
  // correctly end in a stop. So this is one-directional: having started a
  // second sentence, finish it.
  //
  // That shape is unambiguously wrong rather than merely inconsistent. A stop
  // in the middle and none at the end reads as text that got cut off, and a
  // screen reader runs the two halves together as one clause.
  //
  // Ellipsis counts as terminal ("Sending..."), and so does the question mark
  // every confirm title ends with.
  // Sentence-final punctuation is per script, and assuming ASCII here would
  // have failed most of the catalogs this rule is meant to protect. Arabic ends
  // a question with ؟ and Urdu a sentence with ۔; Devanagari uses the danda ।,
  // Amharic ።, Burmese ॥-like ။, and CJK the ideographic 。！？.
  //
  // Two shapes, because the scripts differ in whether a space follows. A
  // space-delimited script needs the whitespace to tell "one sentence, then
  // another" apart from "3.5" and "e.g."; CJK writes no space at all, and its
  // terminators are unambiguous punctuation that never appears inside a number
  // or an abbreviation, so they stand alone.
  //
  // Thai deliberately matches neither. It has no sentence-final punctuation,
  // marking boundaries with spaces instead, so a Thai catalog is never flagged
  // rather than being held to a rule its writing system does not have.
  const SENTENCE_BREAK = /[.!?؟۔।።။]["'”»)]?\s|[。！？]/u;
  // A trailing placeholder is terminated by whatever fills it: "Private channel
  // {name}. {reach}" ends in a stop once `reach` is substituted. Only the final
  // position counts; a placeholder mid-string still needs real punctuation
  // after it.
  const TERMINATED = /([.!?…؟۔।።။。！？]["'”»)]?|\{\w+\})$/u;

  // The pseudolocale is exempt, and only from this rule. It brackets every
  // string so that truncation is visible on screen, which necessarily puts a
  // ⟧ after the full stop. That is the instrument working, not prose that stops
  // mid-thought, and this rule is about prose. Every other rule in this file
  // still applies to it, including the two it could actually break:
  // placeholder parity and protocol tokens carried through verbatim.
  const PROSE = CODES.filter((code) => code !== PSEUDO_LANGUAGE);

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
  // The rule a translator is most likely to get wrong, and the one a type
  // cannot catch: `PluralForms` requires `other` and makes the rest optional,
  // because the set is per-language. So the type accepts a Russian catalog with
  // only `one` and `other`, which reads "5 сообщение" for every count from 5 up.
  //
  // Checked against `PLURAL_CATEGORIES`, which is itself checked against CLDR
  // in plurals.test.ts. So the chain runs: CLDR -> PLURAL_CATEGORIES -> every
  // catalog, with no link taken on trust.
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
  // These strings are not copy. They cross the wire, or an identity is derived
  // from them, so a translated variant is an interop bug rather than a cosmetic
  // one. See docs/spec/ARCHITECTURE.md.
  //
  //   - The transmitted /hug and /slap text. bitchat/ios detects an incoming
  //     emote by matching the English substrings ("hugs <nick>", "slaps <nick>
  //     around") in ChatPublicConversationCoordinator. Localising what is sent
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
  // translate it, and bitchat stops recognising Airhop's emotes.
  const MUST_BE_ABSENT = ["hugs", "slaps", "around a bit with a large trout"];

  // VERBATIM: protocol identifiers that legitimately appear inside translated
  // prose ("Link this area's public #bluetooth chat with..."). They are not
  // forbidden, they are frozen: wherever English uses one, every translation
  // must carry the same token through untouched. A translator who localises
  // "#bluetooth" or "/hug" produces a sentence that names a channel or command
  // that does not exist.
  const MUST_BE_VERBATIM = [
    "#bluetooth",
    "/hug",
    "/slap",
    "/who",
    "/msg",
    "airhop://",
    "npub1",
  ];

  // SURVIVES: proper nouns and cryptosystem names. A weaker rule than VERBATIM
  // on purpose.
  //
  // "Lightning" is the one that will actually be broken. It is a protocol name
  // that is also an ordinary noun in every language on the list, it appears in
  // 24 strings, and a translator working through a spreadsheet will render it
  // as their word for the weather. So will a model. Same shape, lower volume,
  // for "Tor".
  //
  // Exact count parity is the wrong test here. English says "Airhop" 41 times,
  // and a language that drops the subject or repeats it for agreement will
  // legitimately differ. What is never legitimate is the noun disappearing
  // entirely, so the rule is presence, not count: if English names it, the
  // translation names it.
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
// Every other locale sets its own typography and spelling. German quotes with
// „ and “, French with « » around no-break spaces, Japanese with 「 」. A rule
// that forced English's conventions onto them would be wrong in most of the
// catalog, so these are scoped to the source language, where they exist to stop
// 29 translators copying an inconsistency out of the file they work from.
describe("English source conventions", () => {
  it("uses typographic apostrophes and quotes, never straight ones", () => {
    // Apple's HIG, the Microsoft Style Guide and Chicago all specify the
    // typographic forms for interface prose, and the catalog was already
    // written that way in its most-read strings. It was not written that way
    // everywhere: "Couldn’t create your keys" and "Couldn't start the camera"
    // both shipped, which is the same word spelled two ways one screen apart.
    //
    // Ellipsis is not checked here because it never drifted: the catalog is
    // already 29 uses of … and zero of three dots.
    const offenders: string[] = [];
    for (const [key, value] of Object.entries(en.strings)) {
      if (value.includes("'")) offenders.push(`${key}: straight apostrophe`);
      if (value.includes('"')) offenders.push(`${key}: straight quote`);
    }
    expect(offenders).toEqual([]);
  });

  it("spells in US English", () => {
    // US spelling is the house standard, so this is the source language's
    // dictionary rather than a preference. Scoped tightly to words that can
    // plausibly appear in this app's copy: a full British-to-American list
    // would be mostly dead weight.
    //
    // Note "cancellation" keeps its double L in US English and is deliberately
    // absent below, so only the verb forms are caught.
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
  // The property that makes the pseudolocale worth running at all.
  //
  // Its first version padded a flat 40%, which sounded safe and was not: 98
  // German strings came out LONGER than their pseudo counterparts. A screen
  // that passed the pseudolocale could still break in a language that shipped,
  // which makes the instrument worse than having none, because it reports safe.
  //
  // It now pads past the longest shipped translation of each key, so this holds
  // by construction. The test is here because "by construction" stops being
  // true the moment somebody changes the padding, and the failure is silent.
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
    // what a row actually has to hold.
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
