export interface Transaccion {
  id?: number;
  descripcion: string;
  valor: number;
  fecha_transaccion: string;
}

export interface AnalysisRequestPayload {
  ingreso_mensual: number;
  nivel_endeudamiento: number;
  frecuencia_ahorro: string;
  monto_inversion: number;
  deuda_total: number;
  objetivo_presupuesto: number;
  pago_mensual_deuda: number;
  servicios_suscripcion: number;
  fondo_emergencia: number;
}

export interface AnalysisResponsePayload {
  perfil_financiero: string;
  probabilidad: number;
  resumen_gastos: Record<string, number>;
  recomendaciones: string[];
}
