import { HARARGHE_WOREDAS } from '../data/woredas';
import { WoredaInfo, ZoneName } from '../types';

// Map of common alternate spellings used in field reports
const SPELLING_MAP: Record<string, string> = {
  'badeno': 'Badeno',
  'bedeno': 'Badeno',
  'badano': 'Badeno',
  'haramaya': 'Haramaya',
  'haro maya': 'Haramaya',
  'haromaya': 'Haramaya',
  'deder': 'Dadar',
  'dadar': 'Dadar',
  'golo oda': 'Gola Oda',
  'gola oda': 'Gola Oda',
  'goloda': 'Gola Oda',
  'midega tola': 'Midega Tola',
  'midega': 'Midega Tola',
  'goro gutu': 'Goro Gutu',
  'gorogutu': 'Goro Gutu',
  'goro muti': 'Goro Muti',
  'goromuti': 'Goro Muti',
  'kurfa chele': 'Kurfa Chele',
  'kurfachele': 'Kurfa Chele',
  'meyu muluke': 'Meyu Muluke',
  'meyumuluke': 'Meyu Muluke',
  'malka balo': 'Malka Balo',
  'malkabalo': 'Malka Balo',
  'makanisa oromoo': 'Makanisa Oromoo',
  'makanisa': 'Makanisa Oromoo',
  'oda bultum': 'Oda Bultum',
  'odabultum': 'Oda Bultum',
  'daro lebu': 'Daro Lebu',
  'darolebu': 'Daro Lebu',
  'guba koricha': 'Guba Koricha',
  'gubakoricha': 'Guba Koricha',
  'gumbi bordode': 'Gumbi Bordode',
  'gumbibordode': 'Gumbi Bordode',
  'burqa dhintu': 'Burqa Dhintu',
  'burqadhintu': 'Burqa Dhintu',
  'hawwi gudina': 'Hawwi Gudina',
  'hawwigudina': 'Hawwi Gudina',
  'miesso': 'Mieso',
  'mieso': 'Mieso',
};

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function matchWoreda(inputName: string): WoredaInfo | null {
  if (!inputName) return null;
  const clean = inputName.trim().toLowerCase();

  // 1. Direct dictionary lookup
  if (SPELLING_MAP[clean]) {
    const matchedName = SPELLING_MAP[clean];
    return HARARGHE_WOREDAS.find(w => w.name.toLowerCase() === matchedName.toLowerCase()) || null;
  }

  // 2. Exact case-insensitive match
  const exact = HARARGHE_WOREDAS.find(w => w.name.toLowerCase() === clean);
  if (exact) return exact;

  // 3. Substring match
  const sub = HARARGHE_WOREDAS.find(w => clean.includes(w.name.toLowerCase()) || w.name.toLowerCase().includes(clean));
  if (sub) return sub;

  // 4. Fuzzy Levenshtein (threshold <= 3)
  let bestMatch: WoredaInfo | null = null;
  let minDistance = 999;

  for (const woreda of HARARGHE_WOREDAS) {
    const dist = levenshteinDistance(clean, woreda.name.toLowerCase());
    if (dist < minDistance && dist <= 3) {
      minDistance = dist;
      bestMatch = woreda;
    }
  }

  return bestMatch;
}

export function detectZone(woredaName: string, fallbackZone?: string): ZoneName {
  const matched = matchWoreda(woredaName);
  if (matched) return matched.zone;
  if (fallbackZone && (fallbackZone.toLowerCase().includes('west') || fallbackZone.toLowerCase().includes('w/h') || fallbackZone.toLowerCase().includes('w/hararghe'))) {
    return 'W/H';
  }
  return 'E/H';
}
