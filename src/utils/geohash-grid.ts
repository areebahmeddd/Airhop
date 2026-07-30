// Geohash geometry: which cells touch a given cell.
//
// This is what lets "the next neighbourhood over" be a tap rather than a
// geohash somebody has to know. A geohash is a grid by construction, so its
// neighbours are pure arithmetic on the string: no map, no tile server, no API
// key, and nothing that tells a third party which part of the world is being
// looked at. Offline, dependency-free, and correct at the poles and the date
// line, which the classic neighbour lookup tables famously are not.

const ALPHABET = "0123456789bcdefghjkmnpqrstuvwxyz";

export interface GeohashBounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

// The box a geohash covers, and with it the cell's size, which is what the
// neighbour walk steps by. An empty string is the whole world.
export function geohashBounds(gh: string): GeohashBounds {
  let minLat = -90;
  let maxLat = 90;
  let minLon = -180;
  let maxLon = 180;
  let evenBit = true;

  for (const ch of gh.toLowerCase()) {
    const idx = ALPHABET.indexOf(ch);
    if (idx < 0) break;
    for (let bit = 4; bit >= 0; bit--) {
      const on = ((idx >> bit) & 1) === 1;
      if (evenBit) {
        const mid = (minLon + maxLon) / 2;
        if (on) minLon = mid;
        else maxLon = mid;
      } else {
        const mid = (minLat + maxLat) / 2;
        if (on) minLat = mid;
        else maxLat = mid;
      }
      evenBit = !evenBit;
    }
  }
  return { minLat, maxLat, minLon, maxLon };
}

// The centre of a cell, for naming it or pointing relays at it.
export function geohashCenter(gh: string): { lat: number; lon: number } {
  const b = geohashBounds(gh);
  return {
    lat: (b.minLat + b.maxLat) / 2,
    lon: (b.minLon + b.maxLon) / 2,
  };
}

// The eight cells touching this one, and the compass direction of each.
//
// Walking the grid by arithmetic rather than by table: step half a cell past the
// edge in each direction and re-encode at the same precision. It is a few more
// operations than the classic border/neighbour lookup tables, and it cannot get
// the wrap-around at the poles or the date line wrong, which those tables
// famously do.
export const NEIGHBOUR_DIRECTIONS = [
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
] as const;
export type NeighbourDirection = (typeof NEIGHBOUR_DIRECTIONS)[number];

const OFFSETS: Record<NeighbourDirection, [number, number]> = {
  N: [1, 0],
  NE: [1, 1],
  E: [0, 1],
  SE: [-1, 1],
  S: [-1, 0],
  SW: [-1, -1],
  W: [0, -1],
  NW: [1, -1],
};

export function geohashNeighbours(
  gh: string,
): { direction: NeighbourDirection; geohash: string }[] {
  if (gh.length === 0) return [];
  const b = geohashBounds(gh);
  const latStep = b.maxLat - b.minLat;
  const lonStep = b.maxLon - b.minLon;
  const { lat, lon } = geohashCenter(gh);

  const out: { direction: NeighbourDirection; geohash: string }[] = [];
  for (const direction of NEIGHBOUR_DIRECTIONS) {
    const [dLat, dLon] = OFFSETS[direction];
    // Clamp latitude: there is no cell north of the pole, so that neighbour
    // simply does not exist rather than wrapping to nonsense.
    const nextLat = lat + dLat * latStep;
    if (nextLat > 90 || nextLat < -90) continue;
    // Longitude wraps, and the date line is an ordinary edge to a geohash.
    let nextLon = lon + dLon * lonStep;
    if (nextLon > 180) nextLon -= 360;
    if (nextLon < -180) nextLon += 360;
    const neighbour = encodeGeohash(nextLat, nextLon, gh.length);
    if (neighbour !== gh) out.push({ direction, geohash: neighbour });
  }
  return out;
}

// Local copy of the encoder rather than an import from core/nostr/presence:
// that module pulls in the Nostr client stack, and this one is used by the
// picker UI, which must stay free of transport code.
function encodeGeohash(lat: number, lon: number, precision: number): string {
  let minLat = -90;
  let maxLat = 90;
  let minLon = -180;
  let maxLon = 180;
  let hash = "";
  let bits = 0;
  let value = 0;
  let evenBit = true;

  while (hash.length < precision) {
    if (evenBit) {
      const mid = (minLon + maxLon) / 2;
      if (lon >= mid) {
        value = (value << 1) + 1;
        minLon = mid;
      } else {
        value <<= 1;
        maxLon = mid;
      }
    } else {
      const mid = (minLat + maxLat) / 2;
      if (lat >= mid) {
        value = (value << 1) + 1;
        minLat = mid;
      } else {
        value <<= 1;
        maxLat = mid;
      }
    }
    evenBit = !evenBit;
    bits += 1;
    if (bits === 5) {
      hash += ALPHABET[value];
      bits = 0;
      value = 0;
    }
  }
  return hash;
}
