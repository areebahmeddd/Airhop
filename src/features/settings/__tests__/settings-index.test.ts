/**
 * @jest-environment node
 */
// The search index is hand-written, so this is what stops it drifting from the
// screens it describes. A renamed row or a mistargeted entry both fail silently
// at runtime, so both are checked here by reading the screens' source.

import { SETTINGS_INDEX, type SettingsEntry } from "../settings-index";

// Declared rather than pulled in via @types/node, as conformance.test.ts does:
// the app ships with no Node type dependency, and one readFileSync in a test is
// not a reason to add one.
declare const __dirname: string;
declare function require(id: string): unknown;

interface NodeFs {
  readFileSync(path: string, encoding: string): string;
}
interface NodePath {
  join(...parts: string[]): string;
}
const fs = require("fs") as NodeFs;
const path = require("path") as NodePath;

const SETTINGS_DIR = path.join(__dirname, "..");

// Where each destination's rows are rendered. The hub's own rows are split
// across it and the connectivity group it embeds.
const SOURCE_FILES: Record<string, string[]> = {
  root: ["profile-screen.tsx", "connectivity-group.tsx"],
  general: ["sections/general-screen.tsx"],
  security: ["sections/security-screen.tsx"],
  network: ["sections/network-screen.tsx"],
  tor: ["sections/tor-screen.tsx"],
  permissions: ["sections/permissions-screen.tsx"],
  storage: ["sections/storage-screen.tsx"],
  diagnostics: ["sections/diagnostics-screen.tsx"],
  help: ["sections/help-screen.tsx"],
  support: ["sections/support-screen.tsx"],
  about: ["sections/about-screen.tsx"],
  version: ["sections/version-screen.tsx"],
  licenses: ["sections/licenses-screen.tsx"],
  // Terms and Privacy are the same component twice, told apart by a prop.
  terms: ["sections/legal-doc-screen.tsx"],
  privacy: ["sections/legal-doc-screen.tsx"],
};

function sourceOf(view: string): string {
  const files = SOURCE_FILES[view];
  if (files === undefined) throw new Error(`no source mapped for view ${view}`);
  return files
    .map((f) => fs.readFileSync(path.join(SETTINGS_DIR, f), "utf8"))
    .join("\n");
}

// A screen or sheet entry's own row is drawn by whatever navigates to it: Terms
// under Help, Version under About, the sheets on the hub.
const SECTION_VIEW: Record<string, string> = {
  "nav.tab.profile": "root",
  "settings.section.appearance": "root",
  "settings.section.help": "help",
  "settings.section.about": "about",
};

const ENTRIES: readonly SettingsEntry[] = SETTINGS_INDEX;

describe("settings index", () => {
  it("gives every entry a unique key", () => {
    const keys = ENTRIES.map((e) => e.key);
    expect(keys).toEqual([...new Set(keys)]);
  });

  it("points every row entry at a row that carries its id", () => {
    const missing: string[] = [];
    for (const entry of ENTRIES) {
      if (entry.target.kind !== "row") continue;
      if (!sourceOf(entry.target.view).includes(`"${entry.target.id}"`)) {
        missing.push(`${entry.key} -> ${entry.target.view}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("names a label the destination still renders", () => {
    const missing: string[] = [];
    for (const entry of ENTRIES) {
      // A row's label is on the screen it points at; everything else is
      // labelled by the screen its section names.
      const view =
        entry.target.kind === "row"
          ? entry.target.view
          : SECTION_VIEW[entry.sectionKey];
      if (view === undefined) {
        throw new Error(`no section source mapped for ${entry.sectionKey}`);
      }
      const source = sourceOf(view);
      if (!source.includes(`"${entry.labelKey}"`)) {
        missing.push(`${entry.key}: ${entry.labelKey}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
