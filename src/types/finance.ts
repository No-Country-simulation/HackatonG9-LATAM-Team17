export interface TransactionPayload {
  descripcion: string;
  valor: number;
}

export interface AnalysisRequestPayload {
  ingreso_mensual: number;
  nivel_endeudamiento: number;
  frecuencia_ahorro: string;
  transacciones: TransactionPayload[];
}

export interface AnalysisResponsePayload {
  perfil_financiero: string;
  probabilidad: number;
  resumen_gastos: Record<string, number>;
  recomendaciones: string[];
}
