/** Curated quick-pick destinations so the demo fills with life in one click. */
export interface DestinationPreset {
  name: string;
  country: string;
  emoji: string;
  estimatedBudget: number;
  lat: number;
  lng: number;
}

export const DESTINATION_PRESETS: DestinationPreset[] = [
  { name: 'Ibiza', country: 'España', emoji: '🏖️', estimatedBudget: 750, lat: 38.91, lng: 1.43 },
  { name: 'Santorini', country: 'Grecia', emoji: '🌅', estimatedBudget: 1100, lat: 36.39, lng: 25.46 },
  { name: 'Lisboa', country: 'Portugal', emoji: '🚋', estimatedBudget: 600, lat: 38.72, lng: -9.14 },
  { name: 'Amalfi', country: 'Italia', emoji: '🍋', estimatedBudget: 1300, lat: 40.63, lng: 14.6 },
  { name: 'Bali', country: 'Indonesia', emoji: '🌴', estimatedBudget: 1600, lat: -8.34, lng: 115.09 },
  { name: 'Costa Rica', country: 'Costa Rica', emoji: '🦥', estimatedBudget: 1800, lat: 9.75, lng: -83.75 },
  { name: 'Mallorca', country: 'España', emoji: '⛵', estimatedBudget: 700, lat: 39.57, lng: 2.65 },
  { name: 'Croacia', country: 'Croacia', emoji: '🛶', estimatedBudget: 900, lat: 45.1, lng: 15.2 },
];

export const GROUP_THEMES: { id: string; label: string; emoji: string }[] = [
  { id: 'friends', label: 'Amigos', emoji: '🍹' },
  { id: 'family', label: 'Familia', emoji: '🏡' },
  { id: 'couple', label: 'Pareja', emoji: '💞' },
  { id: 'crew', label: 'Cuadrilla', emoji: '🎉' },
];
