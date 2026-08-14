// Motion. PptxGenJS writes no transitions and no animations, so both are added
// to the finished file here: unzip, patch each ppt/slides/slideN.xml, rezip.
//
// Two things are injected, in the order CT_Slide requires (cSld, clrMapOvr,
// transition, timing):
//
//   <p:transition>  one fade between slides, the same everywhere
//   <p:timing>      a staggered fade-in of the groups drawn on the slide
//
// The build is deliberately conservative. Every effect sits in one click group,
// as a parallel child with an explicit millisecond delay, rather than relying on
// after-previous chaining. Parallel plus a delay is unambiguous, so the worst
// case if a renderer ignores the auto-start condition is one click to play the
// whole build, never a broken file.
//
// Pass --no-anim to build.mjs to skip all of it.

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const SLIDE_RE = /^ppt\/slides\/slide(\d+)\.xml$/;
const SHAPE_RE = /<p:cNvPr\s+id="(\d+)"\s+name="([^"]*)"/g;

// Entrance fade, PowerPoint preset 10.
const PRESET_ID = 10;

function loadZip() {
  try {
    return require("jszip");
  } catch {
    return null;
  }
}

// Chrome is never animated. A slide whose title waits for a click reads as
// broken on any renderer that ignores the auto-start condition, and the header
// is what the room orients on while the body arrives.
const STATIC = new Set([
  "bg",
  "mark",
  "head",
  "title",
  "sub",
  "chips",
  "links",
  "foot",
  "src",
]);

// PptxGenJS ignores its own `compression` flag whenever an outputType is given:
// that branch calls generateAsync({ type }) and drops the option, so every part
// is stored uncompressed. Re-zipping once is worth roughly half the file, and a
// deck of hairlines and dot fields is mostly repetitive XML.
export async function repack(buffer) {
  const JSZip = loadZip();
  if (!JSZip) return buffer;
  const zip = await JSZip.loadAsync(buffer);
  return await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });
}

// Shapes drawn inside the same group() call share a name prefix. Groups appear
// in draw order, which is the order they should reveal in.
function groupsOf(xml) {
  const order = [];
  const byName = new Map();
  for (const [, id, name] of xml.matchAll(SHAPE_RE)) {
    const hash = name.indexOf("#");
    if (hash < 1) continue;
    const key = name.slice(0, hash);
    if (STATIC.has(key)) continue;
    if (!byName.has(key)) {
      byName.set(key, []);
      order.push(key);
    }
    byName.get(key).push(id);
  }
  return order.map((key) => ({ key, ids: byName.get(key) }));
}

function effect(spid, delay, dur, ids) {
  const a = ids.next();
  const b = ids.next();
  const c = ids.next();
  return `<p:par><p:cTn id="${a}" fill="hold" nodeType="withEffect"><p:stCondLst><p:cond delay="${delay}"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${b}" presetID="${PRESET_ID}" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="withEffect"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:set><p:cBhvr><p:cTn id="${c}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set><p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${ids.next()}" dur="${dur}"/><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`;
}

function timing(groups, { step, dur, delay }) {
  let next = 3;
  const ids = { next: () => next++ };

  const effects = [];
  const builds = [];
  groups.forEach((group, i) => {
    const at = delay + i * step;
    group.ids.forEach((spid) => {
      effects.push(effect(spid, at, dur, ids));
      builds.push(`<p:bldP spid="${spid}" grpId="0"/>`);
    });
  });

  return (
    `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot">` +
    `<p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq">` +
    `<p:childTnLst>${effects.join("")}</p:childTnLst>` +
    `</p:cTn>` +
    `<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>` +
    `<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>` +
    `</p:seq></p:childTnLst></p:cTn></p:par></p:tnLst>` +
    `<p:bldLst>${builds.join("")}</p:bldLst></p:timing>`
  );
}

// One quiet fade. Anything with a direction reads as a template.
const TRANSITION = `<p:transition spd="med"><p:fade/></p:transition>`;

export async function animate(
  buffer,
  { step = 140, dur = 420, delay = 120, maxGroups = 12 } = {},
) {
  const JSZip = loadZip();
  if (!JSZip) {
    return {
      buffer,
      applied: 0,
      skipped: "jszip not resolvable, animations left out",
    };
  }

  const zip = await JSZip.loadAsync(buffer);
  const names = Object.keys(zip.files).filter((n) => SLIDE_RE.test(n));
  names.sort(
    (a, b) => Number(a.match(SLIDE_RE)[1]) - Number(b.match(SLIDE_RE)[1]),
  );

  let applied = 0;
  for (const name of names) {
    const xml = await zip.file(name).async("string");
    if (xml.includes("<p:transition") || xml.includes("<p:timing")) continue;

    const groups = groupsOf(xml).slice(0, maxGroups);
    const patch =
      TRANSITION + (groups.length ? timing(groups, { step, dur, delay }) : "");
    const next = xml.replace("</p:sld>", `${patch}</p:sld>`);
    if (next === xml) continue;

    zip.file(name, next);
    applied += 1;
  }

  const out = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  return { buffer: out, applied };
}

// Structural self-check. Catches the two ways a hand-written timing tree breaks
// a deck: a duplicate node id, or an effect pointed at a shape that is not on
// the slide. Runs on the patched file, before it is written to disk.
export async function verify(buffer) {
  const JSZip = loadZip();
  if (!JSZip)
    return {
      ok: true,
      checked: 0,
      note: "jszip unavailable, nothing to check",
    };

  const zip = await JSZip.loadAsync(buffer);
  const names = Object.keys(zip.files).filter((n) => SLIDE_RE.test(n));
  const problems = [];
  let checked = 0;

  for (const name of names) {
    const xml = await zip.file(name).async("string");
    if (!xml.includes("<p:timing")) continue;
    checked += 1;

    const shapeIds = new Set([...xml.matchAll(SHAPE_RE)].map(([, id]) => id));
    const timingXml = xml.slice(xml.indexOf("<p:timing"));

    const nodeIds = [...timingXml.matchAll(/<p:cTn id="(\d+)"/g)].map(
      ([, id]) => id,
    );
    if (new Set(nodeIds).size !== nodeIds.length)
      problems.push(`${name}: duplicate cTn id`);

    for (const [, spid] of timingXml.matchAll(/<p:spTgt spid="(\d+)"/g)) {
      if (!shapeIds.has(spid))
        problems.push(`${name}: spTgt ${spid} is not on the slide`);
    }

    const opens = (timingXml.match(/<p:par>/g) || []).length;
    const closes = (timingXml.match(/<\/p:par>/g) || []).length;
    if (opens !== closes)
      problems.push(
        `${name}: unbalanced p:par (${opens} open, ${closes} close)`,
      );

    if (xml.indexOf("<p:transition") > xml.indexOf("<p:timing")) {
      problems.push(`${name}: transition must precede timing`);
    }
  }

  return { ok: problems.length === 0, checked, problems };
}
