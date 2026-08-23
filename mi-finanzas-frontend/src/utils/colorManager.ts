// src/utils/colorManager.ts

/**
 * Base premium palette of predefined colors.
 * These are tailored for a modern, glassmorphic UI.
 */
const PALETA_BASE = [
  '#4648d4', // Primary Indigo
  '#fd933d', // Orange
  '#10b981', // Emerald
  '#712ae2', // Purple
  '#38bdf8', // Sky Blue
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
];

// Persistent local cache to ensure consistency across views
const colorCache: Record<string, string> = {
  // Pre-seed some standard categories to guarantee brand consistency
  Vivienda: '#4648d4',
  Alimentación: '#10b981', // Emerald
  Transporte: '#f59e0b', // Amber
  Servicios: '#0ea5e9', // Sky Blue
  Salud: '#ec4899', // Pink
  Entretenimiento: '#8b5cf6', // Purple
  'Gastos Hormiga': '#ef4444', // Red
  Otros: '#94a3b8' // Slate
};

// Start index for dynamically assigning predefined colors
let baseColorIndex = 0;

/**
 * Helper to convert HSL to Hex
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

let lastHue = 0;

/**
 * Returns a unique color for a given category.
 * - If the category already has a color, returns it.
 * - If not, takes the next available color from the predefined palette.
 * - If the predefined palette is exhausted, generates a new distinct color.
 */
export function getColorForCategory(category: string): string {
  const normalizedKey = category.trim();

  // 1. Check cache
  if (colorCache[normalizedKey]) {
    return colorCache[normalizedKey];
  }

  // 2. Try to assign from predefined palette
  // Note: We skip colors already in the cache if possible
  while (baseColorIndex < PALETA_BASE.length) {
    const candidate = PALETA_BASE[baseColorIndex++];
    if (!Object.values(colorCache).includes(candidate)) {
      colorCache[normalizedKey] = candidate;
      return candidate;
    }
  }

  // 3. Fallback: Generate dynamic color using Golden Ratio (137.5 degrees)
  // We use fixed saturation and lightness for a vibrant look
  lastHue = (lastHue + 137.5) % 360;
  const newColor = hslToHex(lastHue, 80, 60);
  
  colorCache[normalizedKey] = newColor;
  return newColor;
}
