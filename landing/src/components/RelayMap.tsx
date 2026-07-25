import {
  geoDistance,
  geoNaturalEarth1,
  geoPath,
  type ExtendedFeatureCollection,
  type GeoPermissibleObjects,
} from "d3-geo";
import { useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";
import worldAtlas from "world-atlas/countries-110m.json?url";
import { RELAY_COUNT, RELAY_SITES, type RelaySite } from "../data/relays";

type Topology = Parameters<typeof feature>[0];
type TopologyObject = Parameters<typeof feature>[1];

const WIDTH = 800;
const HEIGHT = 356;
const PADDING = 4;

const ANTARCTICA_ID = "010";

function spanningEdges(sites: readonly RelaySite[]): [number, number][] {
  const count = sites.length;
  if (count < 2) return [];

  const reached = new Array<boolean>(count).fill(false);
  const cost = new Array<number>(count).fill(Infinity);
  const from = new Array<number>(count).fill(0);
  const edges: [number, number][] = [];
  cost[0] = 0;

  for (let step = 0; step < count; step++) {
    let next = -1;
    for (let i = 0; i < count; i++) {
      if (!reached[i] && (next < 0 || cost[i] < cost[next])) next = i;
    }
    reached[next] = true;
    if (step > 0) edges.push([from[next], next]);

    const origin: [number, number] = [sites[next].lng, sites[next].lat];
    for (let i = 0; i < count; i++) {
      if (reached[i]) continue;
      const distance = geoDistance(origin, [sites[i].lng, sites[i].lat]);
      if (distance < cost[i]) {
        cost[i] = distance;
        from[i] = next;
      }
    }
  }

  return edges;
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
  const [land, setLand] = useState<GeoPermissibleObjects[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(worldAtlas)
      .then((res) => res.json())
      .then((topology: Topology) => {
        if (cancelled) return;
        const countries = feature(topology, topology.objects["countries"] as TopologyObject);
        const features = "features" in countries ? countries.features : [countries];
        setLand(features.filter((f) => f.id !== ANTARCTICA_ID) as GeoPermissibleObjects[]);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const map = useMemo(() => {
    if (!land) return null;

    const collection = { type: "FeatureCollection", features: land } as ExtendedFeatureCollection;
    const projection = geoNaturalEarth1().fitExtent(
      [
        [PADDING, PADDING],
        [WIDTH - PADDING, HEIGHT - PADDING],
      ],
      collection,
    );
    const path = geoPath(projection);

    const sites: RelaySite[] = [];
    const points: [number, number][] = [];
    for (const site of RELAY_SITES) {
      const point = projection([site.lng, site.lat]);
      if (!point) continue;
      sites.push(site);
      points.push(point);
    }

    const arcs = spanningEdges(sites).map(([a, b], i) => ({
      d: arcPath(points[a][0], points[a][1], points[b][0], points[b][1]),
      delay: (i % 7) * 0.4,
    }));

    return { countries: land.map((f) => path(f) ?? ""), points, arcs };
  }, [land]);

  return (
    <div className="border-t border-gray-200 px-6 pt-5 pb-3 select-none">
      <p className="mb-2 font-mono text-[9px] font-bold tracking-widest text-gray-500 uppercase">
        &#9679; Nostr bridge &mdash; {RELAY_COUNT} relays across {RELAY_SITES.length} locations
        worldwide
      </p>
      <div style={{ width: "100%", aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: "100%", height: "100%" }}>
          <style>{`
            @keyframes relayArcFlow { to { stroke-dashoffset: -16; } }
            .relay-arc { stroke-dasharray: 3 5; animation: relayArcFlow 2.4s linear infinite; }
          `}</style>
          {map?.countries.map((d, i) => (
            <path key={i} d={d} fill="#e5e7eb" stroke="#fff" strokeWidth={0.5} />
          ))}
          {map?.arcs.map((arc, i) => (
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
          {map?.points.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="#111827" fillOpacity={0.75} />
          ))}
        </svg>
      </div>
    </div>
  );
}
