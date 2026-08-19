export type NavigationTab = 
  | 'tablero' 
  | 'reportes' 
  | 'historial'
  | 'perfil'
  | 'configuracion' 
  | 'nuevo-analisis';

export type TopSubTab = 'Análisis' | 'Informes';

export type HealthStatus = 'Saludable' | 'En observación' | 'Observación' | 'Riesgo';
export type EstadoSalud = HealthStatus;

export type SavingsFrequency = 'Semanal' | 'Quincenal' | 'Mensual';
export type FrecuenciaAhorro = SavingsFrequency;

export interface UserProfile {
  name: string;
  email: string;
  monthlyIncome: number;
  totalDebts: number;
  monthlyDebtPayment: number;
  savingsFrequency: SavingsFrequency;
  emergencyFund: number;
  budgetGoal: number;
  subscriptionsCount: number;
  debtRatio: number;
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
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  type: 'gasto' | 'ingreso';
  autoCategorized?: boolean;
  categorizationFailed?: boolean;
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
  logroSemanal: {
    titulo: string;
    porcentajeGanancia: number;
    horasRestantes: number;
  };
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

