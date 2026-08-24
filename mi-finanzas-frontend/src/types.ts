export type NavigationTab = 
  | 'tablero' 
  | 'reportes' 
  | 'historial'
  | 'perfil'
  | 'configuracion' 
  | 'nuevo-analisis';

export type TopSubTab = 'Dashboard' | 'Informes';

export type HealthStatus = 'Crítico' | 'En riesgo' | 'En observación' | 'Estable' | 'Saludable' | 'Excelente';
export type PerfilFinanciero = HealthStatus;

export type FrecuenciaAhorro = 'Semanal' | 'Quincenal' | 'Mensual';

export interface UserProfile {
  id?: number;
  nombre: string;
  email: string;
  ingresoMensual: number;
  deudaTotal: number;
  pagoMensualDeuda: number;
  frecuenciaAhorro: FrecuenciaAhorro;
  fondoEmergencia: number;
  objetivoPresupuesto: number;
  suscripciones: number;
  ratioDeuda: number;
}

export type CategoriaGasto = 
  | 'Vivienda'
  | 'Alimentación'
  | 'Transporte'
  | 'Servicios'
  | 'Salud'
  | 'Entretenimiento'
  | 'Otros';


export interface Transaction {
  id: string;
  descripcion: string;
  monto: number;
  categoria: CategoriaGasto;
  fecha: string;
  tipo: 'gasto' | 'ingreso';
  autoCategorizado?: boolean;
  categorizacionFallida?: boolean;
}

export interface Recomendacion {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  impacto: string;
  etiquetaAccion: string;
  completada?: boolean;
  tipoEstado?: 'danger' | 'warning' | 'info' | 'success';
  contextoExtra?: string;
}

export interface DistribucionCategoria {
  categoria: CategoriaGasto;
  monto: number;
  porcentaje: number;
  colorHex: string;
}

export interface ReporteAnalisis {
  id: string;
  fecha: string;
  marcaTiempo: number;
  totalGastado: number;
  confianzaModelo: number;
  perfilFinanciero: PerfilFinanciero;
  mensajeMotivador: string;

  distribucionCategorias: DistribucionCategoria[];
  recomendaciones: Recomendacion[];
  narrativaIa?: string;
  entradas?: {
    ingresoMensual: number;
    deudas: number;
    frecuenciaAhorro: FrecuenciaAhorro;
    objetivoPresupuesto: number;
    pagoDeuda: number;
    suscripciones: number;
    fondoEmergencia: number;
    cantidadTransacciones: number;
  };
}

