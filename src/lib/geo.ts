/** Geography helpers for the dashboard map: an equirectangular projection plus
 * a small lookup so any destination resolves to a lat/lng without a network. */

export interface LatLng {
  lat: number;
  lng: number;
}

/** Known coordinates for the curated presets (city-accurate). */
const PLACE_COORDS: Record<string, LatLng> = {
  ibiza: { lat: 38.91, lng: 1.43 },
  santorini: { lat: 36.39, lng: 25.46 },
  lisboa: { lat: 38.72, lng: -9.14 },
  amalfi: { lat: 40.63, lng: 14.6 },
  bali: { lat: -8.34, lng: 115.09 },
  'costa rica': { lat: 9.75, lng: -83.75 },
  mallorca: { lat: 39.57, lng: 2.65 },
  croacia: { lat: 45.1, lng: 15.2 },
};

/** Rough country centroids — fallback when a destination isn't a known place. */
const COUNTRY_CENTROIDS: Record<string, LatLng> = {
  españa: { lat: 40.0, lng: -4.0 },
  espana: { lat: 40.0, lng: -4.0 },
  portugal: { lat: 39.5, lng: -8.0 },
  italia: { lat: 42.8, lng: 12.8 },
  grecia: { lat: 39.0, lng: 22.0 },
  francia: { lat: 46.6, lng: 2.2 },
  indonesia: { lat: -2.5, lng: 118.0 },
  'costa rica': { lat: 9.75, lng: -83.75 },
  croacia: { lat: 45.1, lng: 15.2 },
  méxico: { lat: 23.0, lng: -102.0 },
  mexico: { lat: 23.0, lng: -102.0 },
  'estados unidos': { lat: 39.0, lng: -98.0 },
  eeuu: { lat: 39.0, lng: -98.0 },
  'reino unido': { lat: 54.0, lng: -2.0 },
  alemania: { lat: 51.0, lng: 10.0 },
  marruecos: { lat: 32.0, lng: -6.0 },
  tailandia: { lat: 15.0, lng: 101.0 },
  japón: { lat: 36.0, lng: 138.0 },
  japon: { lat: 36.0, lng: 138.0 },
  brasil: { lat: -10.0, lng: -55.0 },
  argentina: { lat: -34.0, lng: -64.0 },
  egipto: { lat: 27.0, lng: 30.0 },
  turquía: { lat: 39.0, lng: 35.0 },
  turquia: { lat: 39.0, lng: 35.0 },
  países_bajos: { lat: 52.1, lng: 5.3 },
  'países bajos': { lat: 52.1, lng: 5.3 },
  irlanda: { lat: 53.0, lng: -8.0 },
  islandia: { lat: 65.0, lng: -18.0 },
  noruega: { lat: 62.0, lng: 10.0 },
  australia: { lat: -25.0, lng: 133.0 },
};

const norm = (s: string) => s.trim().toLowerCase();

/** Resolve a destination to coordinates from its name, then country. */
export function coordsFor(name: string, country: string): LatLng | null {
  return PLACE_COORDS[norm(name)] ?? COUNTRY_CENTROIDS[norm(country)] ?? null;
}

/**
 * Equirectangular projection to a 0..1 box. `lng` -180..180 → x 0..1,
 * `lat` 90..-90 → y 0..1. Multiply by the SVG width/height to place a point.
 */
export function project(lat: number, lng: number): { x: number; y: number } {
  return { x: (lng + 180) / 360, y: (90 - lat) / 180 };
}
