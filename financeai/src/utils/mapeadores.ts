import { ReporteAnalisis, DistribucionCategoria, Recomendacion, CategoriaGasto } from '../types';

/**
 * Estructura cruda del DTO que retorna el backend desde
 * POST /api/v1/finanzas/analizar (AnalisisOutputDTO)
 */
export interface AnalisisOutputDTO {
  perfil_financiero: string;
  probabilidad: number;
  resumen_gastos: Record<string, number>;
  recomendaciones: string[];
}

/**
 * Mapa de colores predeterminados por categoría reconocida.
 * Cualquier categoría no listada recibirá el color por defecto.
 */
const COLORES_CATEGORIA: Record<string, string> = {
  Vivienda: '#4648d4',
  Alimentación: '#fd933d',
  Alimentacion: '#fd933d',
  Transporte: '#712ae2',
  Servicios: '#38bdf8',
  Salud: '#10b981',
  Entretenimiento: '#ef4444',
  Ocio: '#ef4444',
  Otros: '#a3a3a3',
};

const COLOR_POR_DEFECTO = '#e1e3e4';

/**
 * Infiere un tipoEstado para una recomendación basándose en
 * palabras clave presentes en el texto.
 */
function inferirTipoEstado(texto: string): 'danger' | 'warning' | 'info' | 'success' {
  const textoMin = texto.toLowerCase();
  if (textoMin.includes('reduce') || textoMin.includes('elimina') || textoMin.includes('evita')) {
    return 'warning';
  }
  if (textoMin.includes('riesgo') || textoMin.includes('deuda') || textoMin.includes('peligro')) {
    return 'danger';
  }
  if (textoMin.includes('ahorra') || textoMin.includes('aumenta') || textoMin.includes('mantén') || textoMin.includes('manten')) {
    return 'success';
  }
  return 'info';
}

/**
 * Infiere un nivel de impacto textual basándose en el contenido
 * de la recomendación.
 */
function inferirImpacto(texto: string): string {
  const textoMin = texto.toLowerCase();
  if (textoMin.includes('reduce') || textoMin.includes('elimina')) {
    return 'Alto';
  }
  if (textoMin.includes('ahorra') || textoMin.includes('aumenta')) {
    return 'Medio';
  }
  return 'Moderado';
}

/**
 * Mapea la respuesta cruda del backend (AnalisisOutputDTO) a la
 * interfaz enriquecida que consume el frontend (ReporteAnalisis).
 *
 * Genera localmente: colores, porcentajes, objetos de recomendación,
 * puntaje de salud y mensaje motivador.
 */
export function mapearAnalisisOutputDTO(
  dto: AnalisisOutputDTO,
  idReporte?: string,
): ReporteAnalisis {
  // --- Distribución de categorías ---
  const entradasGastos = Object.entries(dto.resumen_gastos);
  const totalGastado = entradasGastos.reduce((suma, [, monto]) => suma + monto, 0);

  const distribucionCategorias: DistribucionCategoria[] = entradasGastos.map(
    ([nombreCategoria, monto]) => ({
      categoria: (nombreCategoria as CategoriaGasto) || 'Otros',
      monto,
      porcentaje: totalGastado > 0 ? Math.round((monto / totalGastado) * 1000) / 10 : 0,
      colorHex: COLORES_CATEGORIA[nombreCategoria] ?? COLOR_POR_DEFECTO,
    }),
  );

  // --- Recomendaciones ---
  const recomendaciones: Recomendacion[] = dto.recomendaciones.map(
    (texto, indice) => ({
      id: `rec-${indice + 1}`,
      titulo: texto.length > 60 ? texto.slice(0, 57) + '...' : texto,
      descripcion: texto,
      categoria: 'General',
      impacto: inferirImpacto(texto),
      etiquetaAccion: 'Ver detalles',
      tipoEstado: inferirTipoEstado(texto),
    }),
  );

  // --- Puntaje de salud (derivado de probabilidad) ---
  const puntajeSalud = Math.round(dto.probabilidad * 100);

  // --- Estado de salud ---
  let estadoSalud: ReporteAnalisis['estadoSalud'];
  if (puntajeSalud >= 85) {
    estadoSalud = 'Saludable';
  } else if (puntajeSalud >= 60) {
    estadoSalud = 'En observación';
  } else {
    estadoSalud = 'Riesgo';
  }

  // --- Mensaje motivador ---
  const mensajesMotivadores: Record<string, string> = {
    Saludable: '¡Excelente disciplina financiera! Sigue así, vas por buen camino. 💪',
    'En observación': '¡Vamos a mejorar tu salud financiera! Pequeños ajustes hacen gran diferencia. 🚀',
    Riesgo: 'No te desanimes, ¡cada paso cuenta! Con el plan adecuado volverás a la senda verde. 🌱',
  };

  return {
    id: idReporte ?? `an-${Date.now()}`,
    fecha: new Date().toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    marcaTiempo: Date.now(),
    totalGastado,
    puntajeSalud,
    estadoSalud,
    mensajeMotivador: mensajesMotivadores[estadoSalud] ?? mensajesMotivadores['En observación'],
    logroSemanal: {
      titulo: `Perfil financiero: ${dto.perfil_financiero}`,
      porcentajeGanancia: puntajeSalud,
      horasRestantes: 48,
    },
    distribucionCategorias,
    recomendaciones,
    narrativaIa: `Tu perfil financiero ha sido clasificado como "${dto.perfil_financiero}" con una probabilidad del ${puntajeSalud}%.`,
  };
}
