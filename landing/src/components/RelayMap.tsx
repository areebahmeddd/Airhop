import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { RELAY_COORDS, RELAY_TOTAL } from "../data/relay-coords";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function RelayMap() {
  return (
    <div className="border-t border-gray-200 px-6 pt-5 pb-3 select-none">
      <p className="mb-2 font-mono text-[9px] font-bold tracking-widest text-gray-400 uppercase">
        &#9679; Nostr bridge &mdash; {RELAY_TOTAL} relays across {RELAY_COORDS.length} locations
        worldwide
      </p>
      {/* Wrap in a fixed-ratio container so the SVG scales correctly at all viewport widths */}
      <div style={{ width: "100%", aspectRatio: "800 / 430" }}>
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 147, center: [0, 0] }}
          width={800}
          height={430}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e5e7eb"
                  stroke="#fff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {RELAY_COORDS.map(([lat, lon], i) => (
            <Marker key={i} coordinates={[lon, lat]}>
              <circle r={3} fill="#111827" fillOpacity={0.75} />
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}
