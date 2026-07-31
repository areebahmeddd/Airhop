/**
 * @jest-environment node
 */
// Runtime behaviour: interpolation, plural selection, and the layout-direction
// flag.

import { getLanguage, t, tPlural, useT, useTPlural } from "../index";
import { DEFAULT_LANGUAGE, isRTL, LANGUAGE_ORDER } from "../languages";

describe("language table", () => {
  it("lists exactly the languages that have a complete catalog", () => {
    // The table is the gate: a language reaches a user by being listed here,
    // and it can be listed only once its catalog compiles.
    expect(LANGUAGE_ORDER).toEqual(["en"]);
    expect(getLanguage()).toBe(DEFAULT_LANGUAGE);
    expect(isRTL("en")).toBe(false);
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
});

describe("translator identity", () => {
  it("is stable, so components memoized on it do not re-render", () => {
    // The hooks read a constant while there is one language. Components pass
    // `T` in dependency arrays; a fresh identity per render would defeat every
    // one of them.
    expect(useT()).toBe(useT());
    expect(useTPlural()).toBe(useTPlural());
  });

  it("reports the language it is bound to", () => {
    expect(useT().language).toBe("en");
  });
});
