import { geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { useEffect, useState } from "react";
import { feature } from "topojson-client";
import { RELAY_COORDS, RELAY_TOTAL } from "../data/relay-coords";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WIDTH = 800;
const HEIGHT = 430;

const projection = geoNaturalEarth1()
  .scale(147)
  .translate([WIDTH / 2, HEIGHT / 2]);
const pathGen = geoPath(projection);

export default function RelayMap() {
  const [countryPaths, setCountryPaths] = useState<string[]>([]);

  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((topo: Parameters<typeof feature>[0]) => {
        const countries = feature(topo, topo.objects["countries"] as Parameters<typeof feature>[1]);
        const features = "features" in countries ? countries.features : [countries];
        setCountryPaths(features.map((f: GeoPermissibleObjects) => pathGen(f) ?? ""));
      });
  }, []);

  return (
    <div className="border-t border-gray-200 px-6 pt-5 pb-3 select-none">
      <p className="mb-2 font-mono text-[9px] font-bold tracking-widest text-gray-400 uppercase">
        &#9679; Nostr bridge &mdash; {RELAY_TOTAL} relays across {RELAY_COORDS.length} locations
        worldwide
      </p>
      {/* Wrap in a fixed-ratio container so the SVG scales correctly at all viewport widths */}
      <div style={{ width: "100%", aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: "100%", height: "100%" }}>
          {countryPaths.map((d, i) => (
            <path key={i} d={d} fill="#e5e7eb" stroke="#fff" strokeWidth={0.5} />
          ))}
          {RELAY_COORDS.map(([lat, lon], i) => {
            const point = projection([lon, lat]);
            if (!point) return null;
            return (
              <circle key={i} cx={point[0]} cy={point[1]} r={3} fill="#111827" fillOpacity={0.75} />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
