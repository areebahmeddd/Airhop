import { RELAY_COUNT, RELAY_SITES, type RelaySite } from "@/data/relays";
import {
  geoBounds,
  geoContains,
  geoDistance,
  geoNaturalEarth1,
  geoPath,
  type ExtendedFeature,
  type ExtendedFeatureCollection,
} from "d3-geo";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import worldAtlas from "world-atlas/countries-110m.json?url";

type Topology = Parameters<typeof feature>[0];

const WIDTH = 800;
const HEIGHT = 356;
const PADDING = 4;

const ANTARCTICA_ID = "010";

const DOT_MIN_RADIUS = 1.8;
const DOT_SCALE = 0.5;
const DOT_MAX_RADIUS = 6.5;

const HIT_RADIUS = 9;

function dotRadius(relays: number): number {
  return Math.min(DOT_MAX_RADIUS, DOT_MIN_RADIUS + Math.sqrt(relays) * DOT_SCALE);
}

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

const COUNTRY_LABELS: Record<string, string> = {
  "United States of America": "United States",
};

function createCountryLookup(features: readonly ExtendedFeature[]) {
  let boxes: [[number, number], [number, number]][] | null = null;
  const cache = new Map<string, string>();

  return function countryAt(lng: number, lat: number): string {
    const key = `${lng},${lat}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    if (!boxes) boxes = features.map((f) => geoBounds(f));

    let name = "";
    for (let i = 0; i < features.length; i++) {
      const [[west, south], [east, north]] = boxes[i];
      if (lat < south || lat > north) continue;
      const withinLng = west <= east ? lng >= west && lng <= east : lng >= west || lng <= east;
      if (!withinLng) continue;

      if (geoContains(features[i], [lng, lat])) {
        const label: unknown = features[i].properties?.["name"];
        if (typeof label === "string") name = COUNTRY_LABELS[label] ?? label;
        break;
      }
    }

    cache.set(key, name);
    return name;
  };
}

function formatCoordinates(lat: number, lng: number): string {
  const ns = `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? "N" : "S"}`;
  const ew = `${Math.abs(lng).toFixed(1)}°${lng >= 0 ? "E" : "W"}`;
  return `${ns} ${ew}`;
}

export default function RelayMap() {
  const [land, setLand] = useState<ExtendedFeature[] | null>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(worldAtlas)
      .then((res) => res.json())
      .then((topology: Topology) => {
        if (cancelled) return;
        const countries = feature(topology, topology.objects["countries"]);
        const features = "features" in countries ? countries.features : [countries];
        setLand(features.filter((f) => f.id !== ANTARCTICA_ID));
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
      a,
      b,
    }));

    return { countries: land.map((f) => path(f) ?? ""), sites, points, arcs };
  }, [land]);

  const countryAt = useMemo(() => (land ? createCountryLookup(land) : null), [land]);

  const detail = useMemo(() => {
    if (!map || active === null) return null;
    const site = map.sites[active];
    if (!site) return null;

    return {
      place: countryAt?.(site.lng, site.lat) || formatCoordinates(site.lat, site.lng),
      relays: site.relays,
      hosts: site.hosts.join(", "),
      others: site.relays - site.hosts.length,
    };
  }, [map, active, countryAt]);

  const clear = useCallback(() => setActive(null), []);

  const endHover = useCallback(
    (e: React.PointerEvent<SVGElement>) => {
      if (e.pointerType !== "touch") clear();
    },
    [clear],
  );

  const hits = useRef<(SVGCircleElement | null)[]>([]);

  const step = useCallback(
    (delta: number) => {
      if (!map || map.points.length === 0) return;
      const count = map.points.length;
      const next = active === null ? 0 : (active + delta + count) % count;
      setActive(next);
      hits.current[next]?.focus();
    },
    [map, active],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<SVGSVGElement>) => {
      if (e.key === "Escape") {
        clear();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        step(-1);
      }
    },
    [clear, step],
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<SVGSVGElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget)) clear();
    },
    [clear],
  );

  return (
    <div className="px-6 pt-5 pb-3">
      <p
        className="text-secondary mb-2 h-4 truncate font-mono text-[10px] leading-4 font-bold tracking-widest uppercase"
        aria-live="polite"
        aria-atomic="true"
      >
        <span aria-hidden="true">&#9679;</span>{" "}
        {detail ? (
          <>
            {detail.place} &middot; {detail.relays} {detail.relays === 1 ? "relay" : "relays"}{" "}
            &middot; <span className="normal-case">{detail.hosts}</span>
            {detail.others > 0 ? ` +${detail.others}` : ""}
          </>
        ) : (
          <>
            Nostr bridge &middot; {RELAY_COUNT} relays across {RELAY_SITES.length} locations
            worldwide
          </>
        )}
      </p>

      <div style={{ width: "100%", aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          style={{ width: "100%", height: "100%" }}
          className="select-none"
          role="group"
          aria-label="World map of Nostr relay locations"
          onPointerLeave={endHover}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        >
          <style>{`
            @keyframes relayArcFlow { to { stroke-dashoffset: -16; } }
            .relay-arc { stroke-dasharray: 3 5; animation: relayArcFlow 2.4s linear infinite; }
            .relay-arc, .relay-dot { transition: stroke-opacity 160ms ease-out, fill-opacity 160ms ease-out, r 160ms ease-out; }
            .relay-hit { cursor: pointer; outline: none; }
          `}</style>
          <rect width={WIDTH} height={HEIGHT} fill="transparent" onClick={clear} />

          {map?.countries.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="var(--t-inner)"
              stroke="var(--t-card)"
              strokeWidth={0.5}
              pointerEvents="none"
            />
          ))}

          {map?.arcs.map((arc, i) => (
            <path
              key={i}
              d={arc.d}
              fill="none"
              stroke="var(--t-ink)"
              strokeWidth={1}
              strokeOpacity={
                active === null ? 0.3 : arc.a === active || arc.b === active ? 0.75 : 0.08
              }
              strokeLinecap="round"
              className="relay-arc"
              style={{ animationDelay: `${arc.delay}s` }}
              pointerEvents="none"
            />
          ))}

          {map?.points.map((p, i) => {
            const isActive = i === active;
            const radius = dotRadius(map.sites[i].relays);
            return (
              <circle
                key={i}
                className="relay-dot"
                cx={p[0]}
                cy={p[1]}
                r={isActive ? radius + 1.5 : radius}
                fill="var(--t-ink)"
                fillOpacity={active === null ? 0.75 : isActive ? 1 : 0.25}
                pointerEvents="none"
              />
            );
          })}
          {map && active !== null && map.points[active] ? (
            <circle
              cx={map.points[active][0]}
              cy={map.points[active][1]}
              r={dotRadius(map.sites[active].relays) + 5}
              fill="none"
              stroke="var(--t-ink)"
              strokeWidth={1}
              strokeOpacity={0.5}
              pointerEvents="none"
            />
          ) : null}

          {map?.points.map((p, i) => {
            const site = map.sites[i];
            return (
              <circle
                key={i}
                ref={(el) => {
                  hits.current[i] = el;
                }}
                className="relay-hit"
                cx={p[0]}
                cy={p[1]}
                r={HIT_RADIUS}
                fill="transparent"
                tabIndex={i === (active ?? 0) ? 0 : -1}
                role="button"
                aria-label={`${site.hosts[0]}, ${site.relays} ${
                  site.relays === 1 ? "relay" : "relays"
                }`}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={endHover}
                onFocus={() => setActive(i)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(i);
                }}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
