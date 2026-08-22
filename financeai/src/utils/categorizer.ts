import { ExpenseCategory } from '../types';

// Fast heuristic mapping for instantaneous UI response while also supporting server AI API
const KEYWORDS_MAP: Record<ExpenseCategory, string[]> = {
  Vivienda: [
    'alquiler', 'renta', 'hipoteca', 'departamento', 'casa', 'condominio', 'mantenimiento depa',
    'mudanza', 'muebles', 'decoracion', 'reparacion casa', 'habitacion', 'arriendo'
  ],
  Alimentación: [
    'supermercado', 'super', 'comida', 'almuerzo', 'desayuno', 'cena', 'restaurante', 'mercado',
    'frutas', 'verduras', 'carniceria', 'panaderia', 'cafe', 'starbucks', 'ubereats', 'rappi',
    'pedidosya', 'delivery', 'bar', 'pizzeria', 'hamburguesa', 'tacos', 'tienda', 'abarrotes'
  ],
  Transporte: [
    'gasolina', 'combustible', 'uber', 'didi', 'taxi', 'metro', 'bus', 'transporte', 'peaje',
    'estacionamiento', 'parqueadero', 'mecanico', 'taller', 'vuelo', 'aerolinea', 'pasaje', 'bici'
  ],
  Servicios: [
    'luz', 'agua', 'gas', 'internet', 'fibra', 'telefono', 'celular', 'plan movil', 'cable',
    'electricidad', 'energia', 'wifi', 'administracion', 'factura'
  ],
  Salud: [
    'farmacia', 'medicamento', 'medico', 'doctor', 'hospital', 'clinica', 'dentista', 'optica',
    'psicologo', 'terapia', 'vitaminas', 'analisis', 'seguro medico', 'eps'
  ],
  Entretenimiento: [
    'netflix', 'spotify', 'disney', 'hbo', 'max', 'prime', 'cine', 'concierto', 'videojuego',
    'playstation', 'xbox', 'steam', 'suscripcion', 'teatro', 'fiesta', 'salida', 'disco', 'gym',
    'gimnasio', 'youtube'
  ],
  Otros: []
};

export interface CategorizeResult {
  category: ExpenseCategory;
  confidence: number; // 0 to 1
  failed: boolean;
}

export function autoCategorizeDescription(description: string): CategorizeResult {
  if (!description || description.trim().length === 0) {
    return { category: 'Otros', confidence: 0, failed: true };
  }

  const clean = description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Check exact/partial keyword match
  for (const [category, keywords] of Object.entries(KEYWORDS_MAP) as [ExpenseCategory, string[]][]) {
    for (const kw of keywords) {
      const cleanKw = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      // Exact word boundary or includes
      const regex = new RegExp(`\\b${cleanKw}\\b`, 'i');
      if (regex.test(clean) || clean.includes(cleanKw)) {
        return { category, confidence: 0.95, failed: false };
      }
    }
  }

  // If text is totally random numbers or single obscure letters or completely unmatchable
  if (clean.length < 3 || /^[\d\W]+$/.test(clean)) {
    return { category: 'Otros', confidence: 0.1, failed: true };
  }

  // Default fallback if no match found
  return { category: 'Otros', confidence: 0.3, failed: true };
}

export async function requestAiCategorization(description: string): Promise<CategorizeResult> {
  // Return the local categorization directly to prevent silent errors from non-existent endpoints
  return autoCategorizeDescription(description);
}
