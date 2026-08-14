// Translating a sentence that has something rendered inside it.
//
// The consent line on the welcome screen is the shape this exists for:
//
//   "By tapping Get started, you agree to our Terms of Service and Privacy Policy."
//
// where two of those spans are tappable links. The tempting version concatenates
// three <Text> fragments, and it is wrong in most languages: German puts the
// verb at the end, Arabic and Persian read the other way, and Japanese has no
// "our ... and ..." to split on. Any translator handed three fragments has to
// translate half a sentence three times and cannot reorder them.
//
// So the whole sentence stays one string with named placeholders, and the
// placeholders are filled with React nodes rather than text. The translator
// moves `{terms}` wherever their language puts it, and the link goes with it.
//
// This is the same idea as react-i18next's <Trans>, minus the HTML-ish tag
// parsing, which is not needed here and is the part that makes <Trans> hard
// to hand to a translator.

import React from "react";
import { useT, type TranslationKey, type TranslationVars } from ".";

const PLACEHOLDER = /\{(\w+)\}/g;

// Renders a translated string with some placeholders filled by React nodes.
//
// Plain-text vars go in `vars` and are substituted as text; node vars go in
// `nodes`. A placeholder with no match is left visible rather than blanked, so
// a missing value shows up in a screenshot instead of reading as a dropped word.
//
// Returns a fragment, so the caller decides the wrapping <Text> and its style.
// Nested <Text> inherits the parent's style on both platforms, which is what
// makes an inline link work at all.
export function useRichText(
  key: TranslationKey,
  nodes: Record<string, React.ReactNode>,
  vars?: TranslationVars,
): React.ReactNode {
  // Read through `useT` rather than the catalog directly: interpolation is done
  // below, node by node, but the subscription and the language binding are the
  // translator's job and should stay in one place.
  const T = useT();
  const template = T(key);
  return React.useMemo(() => {
    const parts: React.ReactNode[] = [];
    let cursor = 0;
    let index = 0;
    for (const match of template.matchAll(PLACEHOLDER)) {
      const name = match[1];
      const at = match.index;
      if (at > cursor) parts.push(template.slice(cursor, at));
      const node = nodes[name];
      const value = vars?.[name];
      if (node !== undefined) {
        parts.push(<React.Fragment key={index}>{node}</React.Fragment>);
      } else if (value !== undefined) {
        parts.push(String(value));
      } else {
        parts.push(match[0]);
      }
      cursor = at + match[0].length;
      index += 1;
    }
    if (cursor < template.length) parts.push(template.slice(cursor));
    return parts;
  }, [template, nodes, vars]);
}
