// Turning two coordinates into something a person can act on.
//
// There is no map, by decision. Tiles are an HTTP call to somebody's server on
// every pan: a fingerprint, a dependency, and a grey square in exactly the
// conditions this app exists for. Opening the pin in a maps app stays available
// as a handoff the user chooses, which is a different thing.

const EARTH_RADIUS_M = 6_371_000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export interface Point {
  lat: number;
  lng: number;
}

// Great-circle distance in metres.
//
// Haversine, as in geo-relay.ts, kept separate because that one answers in
// kilometres for sorting a list and this one in metres for a label.
export function distanceMeters(from: Point, to: Point): number {
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(a)));
}

// Initial bearing in degrees clockwise from true north.
//
// True north, not magnetic, and not where the phone is pointing. The arrow is
// drawn against north on the card: a compass heading would need a subscription
// and would swing while somebody reads it.
export function bearingDegrees(from: Point, to: Point): number {
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const dLng = toRad(to.lng - from.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// The eight-point compass label for a bearing.
//
// Eight rather than sixteen: "north-east" is a direction somebody walks in,
// "east-north-east" is one they have to think about. The arrow already carries
// the precision the extra words would.
export type CompassPoint = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

const COMPASS: readonly CompassPoint[] = [
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w",
  "nw",
];

export function compassPoint(bearing: number): CompassPoint {
  const normalized = ((bearing % 360) + 360) % 360;
  // +22.5 so each sector is centred on its label rather than starting at it.
  return COMPASS[Math.floor((normalized + 22.5) / 45) % 8] as CompassPoint;
}

// Round a distance to a precision the reading supports.
//
// A phone fix is good to tens of metres, so "183 m" spends three digits on one
// digit of truth and reads as authority the number does not have. 10 m under a
// kilometre, a tenth of a kilometre above it.
//
// Value and unit rather than a string, so the caller formats through the i18n
// number formatter instead of concatenating here.
export function roundedDistance(meters: number): {
  value: number;
  unit: "m" | "km";
} {
  if (meters < 1000) {
    return { value: Math.max(0, Math.round(meters / 10) * 10), unit: "m" };
  }
  return { value: Math.round(meters / 100) / 10, unit: "km" };
}
