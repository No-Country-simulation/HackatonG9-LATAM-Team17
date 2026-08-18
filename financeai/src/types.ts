export type NavigationTab = 
  | 'tablero' 
  | 'reportes' 
  | 'historial'
  | 'perfil'
  | 'configuracion' 
  | 'nuevo-analisis';

export type TopSubTab = 'Análisis' | 'Informes';

export type HealthStatus = 'Saludable' | 'En observación' | 'Observación' | 'Riesgo';

export type SavingsFrequency = 'Semanal' | 'Quincenal' | 'Mensual';

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

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: string;
  actionLabel: string;
  completed?: boolean;
  statusType?: 'danger' | 'warning' | 'info' | 'success';
}

export interface AnalysisReport {
  id: string;
  date: string;
  timestamp: number;
  totalSpent: number;
  healthScore: number;
  status: HealthStatus;
  encouragingMessage: string;
  weeklyAchievement: {
    title: string;
    percentageGain: number;
    hoursLeft: number;
  };
  categoryDistribution: {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
    color: string;
  }[];
  recommendations: Recommendation[];
  aiNarrative?: string;
  inputs?: {
    income: number;
    debts: number;
    savingsFreq: SavingsFrequency;
    budgetGoal: number;
    debtPayment: number;
    subscriptions: number;
    emergencyFund: number;
    transactionsCount: number;
  };
}
