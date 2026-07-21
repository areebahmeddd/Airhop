import { geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const RELAYS_CSV_URL =
  "https://raw.githubusercontent.com/areebahmeddd/Airhop/main/assets/data/relays.csv";

const WIDTH = 800;
const HEIGHT = 430;

const projection = geoNaturalEarth1()
  .scale(147)
  .translate([WIDTH / 2, HEIGHT / 2]);
const pathGen = geoPath(projection);

function parseRelaysCsv(text: string): [number, number][] {
  const lines = text.trim().split("\n");
  return lines
    .slice(1)
    .map((line): [number, number] => {
      const cols = line.split(",");
      return [parseFloat(cols[cols.length - 2]), parseFloat(cols[cols.length - 1])];
    })
    .filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon));
}

function dedupeLocations(coords: [number, number][]): [number, number][] {
  const seen = new Set<string>();
  const unique: [number, number][] = [];
  for (const [lat, lon] of coords) {
    const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push([lat, lon]);
    }
  }
  return unique;
}

function arcPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  let perpX = -dy / len;
  let perpY = dx / len;
  if (perpY > 0) {
    perpX = -perpX;
    perpY = -perpY;
  }
  const bow = len * 0.16;
  const cx = (x1 + x2) / 2 + perpX * bow;
  const cy = (y1 + y2) / 2 + perpY * bow;
  return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
}

export default function RelayMap() {
  const [countryPaths, setCountryPaths] = useState<string[]>([]);
  const [relayTotal, setRelayTotal] = useState<number | null>(null);
  const [locations, setLocations] = useState<[number, number][]>([]);

  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((topo: Parameters<typeof feature>[0]) => {
        const countries = feature(topo, topo.objects["countries"] as Parameters<typeof feature>[1]);
        const features = "features" in countries ? countries.features : [countries];
        setCountryPaths(features.map((f: GeoPermissibleObjects) => pathGen(f) ?? ""));
      })
      .catch(() => {});

    fetch(RELAYS_CSV_URL)
      .then((r) => r.text())
      .then((text) => {
        const coords = parseRelaysCsv(text);
        setRelayTotal(coords.length);
        setLocations(dedupeLocations(coords));
      })
      .catch(() => {});
  }, []);

  const points = useMemo(
    () =>
      locations
        .map(([lat, lon]) => projection([lon, lat]))
        .filter((p): p is [number, number] => p !== null),
    [locations],
  );

  const arcs = useMemo(() => {
    if (points.length < 2) return [];
    const sorted = [...points].sort((a, b) => a[0] - b[0]);
    const result: { d: string; delay: number }[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const a = sorted[i - 1];
      const b = sorted[i];
      result.push({ d: arcPath(a[0], a[1], b[0], b[1]), delay: (i % 7) * 0.4 });
    }
    return result;
  }, [points]);

  return (
    <div className="border-t border-gray-200 px-6 pt-5 pb-3 select-none">
      <p className="mb-2 font-mono text-[9px] font-bold tracking-widest text-gray-500 uppercase">
        &#9679; Nostr bridge &mdash; {relayTotal ?? "…"} relays across {locations.length || "…"}{" "}
        locations worldwide
      </p>
      <div style={{ width: "100%", aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: "100%", height: "100%" }}>
          <style>{`
            @keyframes relayArcFlow { to { stroke-dashoffset: -16; } }
            .relay-arc { stroke-dasharray: 3 5; animation: relayArcFlow 2.4s linear infinite; }
          `}</style>
          {countryPaths.map((d, i) => (
            <path key={i} d={d} fill="#e5e7eb" stroke="#fff" strokeWidth={0.5} />
          ))}
          {arcs.map((arc, i) => (
            <path
              key={i}
              d={arc.d}
              fill="none"
              stroke="#111827"
              strokeWidth={1}
              strokeOpacity={0.3}
              strokeLinecap="round"
              className="relay-arc"
              style={{ animationDelay: `${arc.delay}s` }}
            />
          ))}
          {points.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="#111827" fillOpacity={0.75} />
          ))}
        </svg>
      </div>
    </div>
  );
}
