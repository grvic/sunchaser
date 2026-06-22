/** Curated quick-pick destinations so the demo fills with life in one click. */
export interface DestinationPreset {
  name: string;
  country: string;
  emoji: string;
  imageUrl: string;
  estimatedBudget: number;
}

const img = (seed: string) =>
  `https://picsum.photos/seed/sunchaser-${seed}/800/600`;

export const DESTINATION_PRESETS: DestinationPreset[] = [
  { name: 'Ibiza', country: 'España', emoji: '🏖️', imageUrl: img('ibiza'), estimatedBudget: 750 },
  { name: 'Santorini', country: 'Grecia', emoji: '🌅', imageUrl: img('santorini'), estimatedBudget: 1100 },
  { name: 'Lisboa', country: 'Portugal', emoji: '🚋', imageUrl: img('lisboa'), estimatedBudget: 600 },
  { name: 'Amalfi', country: 'Italia', emoji: '🍋', imageUrl: img('amalfi'), estimatedBudget: 1300 },
  { name: 'Bali', country: 'Indonesia', emoji: '🌴', imageUrl: img('bali'), estimatedBudget: 1600 },
  { name: 'Costa Rica', country: 'Costa Rica', emoji: '🦥', imageUrl: img('costarica'), estimatedBudget: 1800 },
  { name: 'Mallorca', country: 'España', emoji: '⛵', imageUrl: img('mallorca'), estimatedBudget: 700 },
  { name: 'Croacia', country: 'Croacia', emoji: '🛶', imageUrl: img('croacia'), estimatedBudget: 900 },
];

export const GROUP_THEMES: { id: string; label: string; emoji: string }[] = [
  { id: 'friends', label: 'Amigos', emoji: '🍹' },
  { id: 'family', label: 'Familia', emoji: '🏡' },
  { id: 'couple', label: 'Pareja', emoji: '💞' },
  { id: 'crew', label: 'Cuadrilla', emoji: '🎉' },
];
