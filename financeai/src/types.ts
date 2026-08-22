export type NavigationTab = 
  | 'tablero' 
  | 'reportes' 
  | 'historial'
  | 'perfil'
  | 'configuracion' 
  | 'nuevo-analisis';

export type TopSubTab = 'Dashboard' | 'Informes';

export type HealthStatus = 'Crítico' | 'En riesgo' | 'En observación' | 'Estable' | 'Saludable' | 'Excelente';
export type EstadoSalud = HealthStatus;

export type SavingsFrequency = 'Semanal' | 'Quincenal' | 'Mensual';
export type FrecuenciaAhorro = SavingsFrequency;

export interface UserProfile {
  id?: number;
  nombre: string;
  email: string;
  ingresoMensual: number;
  deudaTotal: number;
  pagoMensualDeuda: number;
  frecuenciaAhorro: SavingsFrequency;
  fondoEmergencia: number;
  objetivoPresupuesto: number;
  suscripciones: number;
  ratioDeuda: number;
}

export type ExpenseCategory = 
  | 'Vivienda'
  | 'Alimentación'
  | 'Transporte'
  | 'Servicios'
  | 'Salud'
  | 'Entretenimiento'
  | 'Otros';
export type CategoriaGasto = ExpenseCategory;

export interface Transaction {
  id: string;
  descripcion: string;
  monto: number;
  categoria: ExpenseCategory;
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
  puntajeSalud: number;
  estadoSalud: EstadoSalud;
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

