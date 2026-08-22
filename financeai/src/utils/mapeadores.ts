import { ReporteAnalisis, DistribucionCategoria, Recomendacion, CategoriaGasto, PerfilFinanciero } from '../types';

/**
 * Anti-Corruption Layer: normaliza la denominación cruda del backend
 * (ej. "Observación", "Riesgo", "riesgo") a los valores oficiales
 * del tipo PerfilFinanciero de TypeScript.
 *
 * Esta función debe usarse en CADA punto de entrada de datos al frontend.
 */
export function normalizarPerfil(crudo: string | undefined | null): PerfilFinanciero {
  const mapa: Record<string, PerfilFinanciero> = {
    'excelente': 'Excelente',
    'saludable': 'Saludable',
    'estable': 'Estable',
    'en observación': 'En observación',
    'en observacion': 'En observación',
    'observación': 'En observación',
    'observacion': 'En observación',
    'en riesgo': 'En riesgo',
    'riesgo': 'En riesgo',
    'crítico': 'Crítico',
    'critico': 'Crítico',
  };
  return mapa[(crudo || '').trim().toLowerCase()] ?? 'En observación';
}

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

import { getColorForCategory } from './colorManager';

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
      colorHex: getColorForCategory(nombreCategoria),
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

  // --- Confianza de Modelo (derivado de probabilidad) ---
  const confianzaModelo = Math.round((dto.probabilidad || 0) * 100);

  // --- Perfil Financiero (normalizado) ---
  const perfilFinanciero = normalizarPerfil(dto.perfil_financiero);

  // --- Mensaje motivador ---
  const mensajesMotivadores: Record<string, string> = {
    Excelente: '¡Finanzas impecables! Eres un ejemplo a seguir. 🌟',
    Saludable: '¡Excelente disciplina financiera! Sigue así, vas por buen camino. 💪',
    Estable: 'Tus finanzas están bajo control. Con un empujoncito llegarás lejos. 📈',
    'En observación': '¡Vamos a mejorar tu perfil! Pequeños ajustes hacen gran diferencia. 🚀',
    'En riesgo': 'Estás a tiempo de corregir el rumbo. Prioriza pagar deudas y reducir gastos. ⚠️',
    Crítico: 'Es hora de tomar medidas urgentes. ¡Busca ayuda financiera y reestructura tus gastos! 🆘',
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
    confianzaModelo,
    perfilFinanciero,
    mensajeMotivador: mensajesMotivadores[perfilFinanciero] ?? mensajesMotivadores['En observación'],
    distribucionCategorias,
    recomendaciones,
    narrativaIa: `Tu perfil financiero ha sido clasificado como "${perfilFinanciero}" con una confianza de IA del ${confianzaModelo}%.`,
  };
}

// --- Diccionario compartido de mensajes motivadores ---
const mensajesMotivadoresGlobal: Record<string, string> = {
  Excelente: '¡Finanzas impecables! Eres un ejemplo a seguir. 🌟',
  Saludable: '¡Excelente disciplina financiera! Sigue así, vas por buen camino. 💪',
  Estable: 'Tus finanzas están bajo control. Con un empujoncito llegarás lejos. 📈',
  'En observación': '¡Vamos a mejorar tu perfil! Pequeños ajustes hacen gran diferencia. 🚀',
  'En riesgo': 'Estás a tiempo de corregir el rumbo. Prioriza pagar deudas y reducir gastos. ⚠️',
  Crítico: 'Es hora de tomar medidas urgentes. ¡Busca ayuda financiera y reestructura tus gastos! 🆘',
};

/**
 * Mapea un ítem crudo del historial devuelto por el backend
 * (GET /api/v1/finanzas/historial → content[]) a la interfaz
 * enriquecida ReporteAnalisis consumida por todos los componentes.
 *
 * Tareas cubiertas: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */
export function mapearItemHistorial(item: any): ReporteAnalisis {
  // 1.2 — totalGastado desde transacciones
  const totalGastado = (item.transacciones || []).reduce(
    (suma: number, tx: any) => suma + (tx.valor || 0),
    0,
  );

  // 1.3 — perfilFinanciero normalizado
  const perfilFinanciero = normalizarPerfil(item.perfilFinanciero);

  // Cálculo del gasto mayor para inyectar contexto
  const maxTx = (item.transacciones || []).reduce(
    (max: any, tx: any) => (!max || (tx.valor || 0) > (max.valor || 0) ? tx : max),
    null
  );

  // 1.4 — recomendaciones: string[] → Recomendacion[]
  const recomendaciones: Recomendacion[] = (item.recomendaciones || []).map(
    (texto: string, indice: number) => ({
      id: `rec-hist-${item.id ?? Date.now()}-${indice + 1}`,
      titulo: texto.length > 60 ? texto.slice(0, 57) + '...' : texto,
      descripcion: texto,
      categoria: 'General',
      impacto: inferirImpacto(texto),
      etiquetaAccion: 'Ver detalles',
      tipoEstado: inferirTipoEstado(texto),
      contextoExtra: maxTx && maxTx.valor > 0 
        ? `💸 Gasto mayor registrado: $${maxTx.valor.toLocaleString()} en ${maxTx.descripcion}`
        : undefined
    }),
  );

  // 1.6 — distribucionCategorias reconstruida desde transacciones (Ruta A)
  const agrupado: Record<string, number> = {};
  (item.transacciones || []).forEach((tx: any) => {
    // Intentamos extraer la categoría de la transacción. Si no viene, usamos 'Otros'
    const catName = tx.categoria || tx.categoriaGasto || 'Otros';
    agrupado[catName] = (agrupado[catName] || 0) + (tx.valor || tx.monto || 0);
  });

  const distribucionCategorias: DistribucionCategoria[] = Object.entries(agrupado)
    .filter(([, monto]) => monto > 0) // Excluir si el valor es 0
    .map(([nombre, monto]) => ({
      categoria: (nombre || 'Otros') as CategoriaGasto,
      monto,
      porcentaje: totalGastado > 0 ? Math.round((monto / totalGastado) * 1000) / 10 : 0,
      colorHex: getColorForCategory(nombre),
    }));

  const marcaTiempo = item.fechaAnalisis
    ? new Date(item.fechaAnalisis).getTime()
    : Date.now();

  const fecha = item.fechaAnalisis
    ? new Date(item.fechaAnalisis).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toISOString().split('T')[0];

  return {
    id: item.id?.toString() || `hist-${Date.now()}`,
    fecha,
    marcaTiempo,
    totalGastado,
    confianzaModelo: item.probabilidad ? Math.round(item.probabilidad * 100) : 0,
    perfilFinanciero,
    // 1.5 — mensajeMotivador derivado del perfil
    mensajeMotivador: mensajesMotivadoresGlobal[perfilFinanciero] ?? mensajesMotivadoresGlobal['En observación'],
    distribucionCategorias,
    recomendaciones,
    narrativaIa: `Análisis histórico — Perfil: "${perfilFinanciero}".`,
  };
}
