import React from "react";
import { useT, type TranslationKey, type TranslationVars } from "./index.ts";

const PLACEHOLDER = /\{(\w+)\}/g;

export function useRichText(
  key: TranslationKey,
  nodes: Record<string, React.ReactNode>,
  vars?: TranslationVars,
): React.ReactNode {
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
