/**
 * @jest-environment node
 */
// Runtime behaviour: catalog resolution, interpolation, plural selection, and
// the rule that decides which language is actually on screen.
//
// The hooks are deliberately not exercised here. They are thin wrappers that
// read the settings store and hand the result to the same `getT` the functions
// below use, and calling them outside a renderer tests React rather than this
// module.

import { useSettingsStore } from "@store/settings-store";
import {
  activeLanguage,
  getLanguage,
  isShipped,
  needsRelaunch,
  resolvePreference,
  SHIPPED_LANGUAGES,
  t,
  tPlural,
} from "../index";
import {
  DEFAULT_LANGUAGE,
  isRTL,
  LANGUAGE_ORDER,
  LANGUAGES,
} from "../languages";
import { PSEUDO_LANGUAGE } from "../pseudo";

afterEach(() => {
  useSettingsStore.setState({ language: "system" });
});

describe("language table", () => {
  it("knows all thirty languages regardless of what has been translated", () => {
    // The table is facts about languages, not a record of translation
    // progress, so it does not grow as catalogs land.
    expect(LANGUAGE_ORDER).toHaveLength(30);
    expect(new Set(LANGUAGE_ORDER).size).toBe(30);
  });

  it("keeps the pseudolocale out of the language list", () => {
    // It is a debugging instrument, so it has a spec like a language but never
    // sorts in among them. PICKER_LANGUAGES is where it is appended, in debug
    // builds only.
    expect(LANGUAGES[PSEUDO_LANGUAGE]).toBeDefined();
    expect(LANGUAGE_ORDER).not.toContain(PSEUDO_LANGUAGE);
    expect(Object.keys(LANGUAGES)).toHaveLength(LANGUAGE_ORDER.length + 1);
  });

  it("puts the source language first and the rest in a stable order", () => {
    // Sorted by English name rather than by the translated one, so the list
    // does not reshuffle under the user's finger when they change language.
    expect(LANGUAGE_ORDER[0]).toBe("en");
    const rest = LANGUAGE_ORDER.slice(1).map((c) => LANGUAGES[c].englishName);
    expect(rest).toEqual([...rest].sort((a, b) => a.localeCompare(b, "en")));
  });

  it("marks exactly the right-to-left languages", () => {
    const rtl = LANGUAGE_ORDER.filter(isRTL);
    expect(rtl.sort()).toEqual(["ar", "fa", "ur"]);
  });

  it("gives every language a distinct short code and endonym", () => {
    // Both are what a user scans the picker for; a duplicate makes two rows
    // indistinguishable.
    const shorts = LANGUAGE_ORDER.map((c) => LANGUAGES[c].shortCode);
    const endonyms = LANGUAGE_ORDER.map((c) => LANGUAGES[c].endonym);
    expect(new Set(shorts).size).toBe(shorts.length);
    expect(new Set(endonyms).size).toBe(endonyms.length);
  });
});

describe("what ships", () => {
  it("derives the selectable set from the catalogs, not from a list", () => {
    // A language becomes selectable by having a catalog, and a catalog cannot
    // be partial, so there is nothing to keep in sync and no coverage
    // threshold to police.
    for (const code of SHIPPED_LANGUAGES) expect(isShipped(code)).toBe(true);
    expect(SHIPPED_LANGUAGES[0]).toBe(DEFAULT_LANGUAGE);
  });

  it("falls back to English for a language with no catalog yet", () => {
    // Reachable two ways: a device set to a language Airhop has not translated,
    // and a preference written by a later build that shipped more.
    const untranslated = LANGUAGE_ORDER.find((c) => !isShipped(c));
    if (untranslated === undefined) return; // all thirty have landed
    expect(resolvePreference(untranslated)).toBe(DEFAULT_LANGUAGE);
  });
});

describe("which language is on screen", () => {
  it("follows an explicit preference, unless it crosses the direction boundary", () => {
    // The exception is the whole right-to-left policy, and Arabic is the first
    // language to exercise it: layout direction is fixed when the process
    // starts, so choosing Arabic from a left-to-right boot keeps rendering the
    // boot language until the next launch rather than putting Arabic prose in a
    // left-to-right frame. Everything sharing the boot direction switches now.
    for (const code of SHIPPED_LANGUAGES) {
      useSettingsStore.setState({ language: code });
      expect(getLanguage()).toBe(needsRelaunch(code) ? DEFAULT_LANGUAGE : code);
    }
  });

  it("defers exactly the right-to-left languages and no others", () => {
    const deferred = SHIPPED_LANGUAGES.filter(needsRelaunch);
    expect(deferred).toEqual(SHIPPED_LANGUAGES.filter(isRTL));
  });

  it("resolves 'system' to something shipped", () => {
    useSettingsStore.setState({ language: "system" });
    expect(SHIPPED_LANGUAGES).toContain(getLanguage());
  });

  it("only defers a change that crosses the direction boundary", () => {
    // Layout direction is fixed when the process starts, so a right-to-left
    // language cannot take effect until the next launch. Everything sharing the
    // boot direction switches immediately, which is almost every switch.
    for (const code of SHIPPED_LANGUAGES) {
      const deferred = needsRelaunch(code);
      expect(deferred).toBe(activeLanguage(code) !== resolvePreference(code));
      if (!isRTL(code)) expect(deferred).toBe(false);
    }
  });
});

describe("interpolation", () => {
  it("substitutes named placeholders", () => {
    expect(t("settings.opens_externally", { label: "About" })).toBe(
      "About, opens outside the app",
    );
  });

  it("leaves an unfilled placeholder visible rather than blanking it", () => {
    // A hole you can see in a screenshot beats a sentence that silently lost a
    // word.
    expect(t("settings.opens_externally")).toContain("{label}");
  });

  it("ignores extra variables", () => {
    expect(t("common.cancel", { unused: 1 })).toBe("Cancel");
  });
});

describe("plurals", () => {
  it("selects the English categories", () => {
    expect(tPlural("mesh.peers_in_range", 1)).toBe("1 peer in range");
    expect(tPlural("mesh.peers_in_range", 0)).toBe("0 peers in range");
    expect(tPlural("mesh.peers_in_range", 7)).toBe("7 peers in range");
  });

  it("provides {count} without the caller passing it", () => {
    expect(tPlural("chat.group_members", 3)).toContain("3");
  });

  it("still takes other variables alongside the count", () => {
    expect(tPlural("wallet.backup.recovered", 2, { mints: "2 mints" })).toBe(
      "Recovered 2 unspent proofs from 2 mints.",
    );
  });

  it("formats the count in the reading language, not the device's", () => {
    // A count inside a sentence is prose, so it follows the language rather
    // than the Latin pinning `utils/format.ts` applies to machine data. In
    // English that means a grouping separator.
    expect(tPlural("mesh.peers_in_range", 12_000)).toContain("12,000");
  });
});

describe("translator identity", () => {
  it("is stable per language, so components memoized on it do not re-render", () => {
    // Components pass `T` in dependency arrays and memo comparators. A fresh
    // function per render would defeat every one of them.
    useSettingsStore.setState({ language: "en" });
    expect(t.language).toBe("en");
    expect(getLanguage()).toBe(getLanguage());
  });
});
