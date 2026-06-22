/** Simple, fully-offline emoji-style avatar: a handful of choices serialized
 * as JSON into the Profile.avatar field. */

export interface AvatarConfig {
  gender: 'man' | 'woman' | 'neutral';
  hair: 'short' | 'long' | 'bun' | 'curly' | 'bald';
  hairColor: string;
  skin: string;
  bg: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  gender: 'neutral',
  hair: 'short',
  hairColor: '#3b2417',
  skin: '#f1c27d',
  bg: '#fde68a',
};

export const HAIR_COLORS = [
  '#2b1b0e', // dark brown
  '#6b4423', // brown
  '#c79a3b', // blonde
  '#b3541e', // ginger
  '#8b8b8b', // grey
  '#1f2937', // black
];

export const SKIN_TONES = ['#ffe0bd', '#f1c27d', '#e0ac69', '#c68642', '#8d5524'];

export const BG_COLORS = [
  '#fde68a',
  '#bae6fd',
  '#c7d2fe',
  '#fbcfe8',
  '#a7f3d0',
  '#fed7aa',
];

export const GENDERS: { id: AvatarConfig['gender']; label: string }[] = [
  { id: 'neutral', label: 'Neutro' },
  { id: 'woman', label: 'Mujer' },
  { id: 'man', label: 'Hombre' },
];

export const HAIR_STYLES: { id: AvatarConfig['hair']; label: string }[] = [
  { id: 'short', label: 'Corto' },
  { id: 'long', label: 'Largo' },
  { id: 'bun', label: 'Moño' },
  { id: 'curly', label: 'Rizado' },
  { id: 'bald', label: 'Sin pelo' },
];

export function parseAvatar(raw: string | null | undefined): AvatarConfig {
  if (!raw) return { ...DEFAULT_AVATAR };
  try {
    return { ...DEFAULT_AVATAR, ...(JSON.parse(raw) as Partial<AvatarConfig>) };
  } catch {
    return { ...DEFAULT_AVATAR };
  }
}

export function serializeAvatar(config: AvatarConfig): string {
  return JSON.stringify(config);
}
