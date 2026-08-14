import React from "react";

interface TarjetaDiagnosticoProps {
  perfilFinanciero: string;
  probabilidad: number;
  resumenGastos?: Record<string, number>;
  computedDebtLevel?: number;
}

export const TarjetaDiagnostico: React.FC<TarjetaDiagnosticoProps> = ({
  perfilFinanciero,
  probabilidad,
  resumenGastos,
  computedDebtLevel,
}) => {
  const percentage = Math.round(probabilidad <= 1 ? probabilidad * 100 : probabilidad);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
    }).format(val);

  return (
    <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl p-[24px] md:p-[32px] custom-shadow transition-all duration-300 animate-card-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] border-b border-surface-variant pb-[24px]">
        <div>
          <span className="inline-flex items-center gap-[4px] px-[12px] py-[4px] rounded-full bg-primary-fixed text-on-primary-fixed font-sans text-[12px] font-bold uppercase mb-[12px]">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Diagnóstico IA - The Encouraging Expert</span>
          </span>
          {/* User Profile in Plus Jakarta Sans font */}
          <h3 className="font-heading text-[24px] md:text-[32px] font-bold text-on-surface tracking-tight">
            {perfilFinanciero}
          </h3>
        </div>

        <div className="flex flex-col items-start md:items-end bg-primary-fixed/30 px-[24px] py-[16px] rounded-2xl border border-primary/20">
          <span className="font-sans text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-[2px]">
            Certeza del Análisis
          </span>
          {/* Evaluation probability in JetBrains Mono font */}
          <span className="font-mono font-bold text-[36px] md:text-[44px] text-primary">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="pt-[24px] grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        {computedDebtLevel !== undefined && (
          <div className="bg-surface-bright rounded-2xl p-[20px] border border-surface-variant shadow-2xs flex flex-col justify-between">
            <div>
              <span className="block font-sans text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-[8px] flex items-center gap-[6px]">
                <span className="material-symbols-outlined text-[18px] text-primary">credit_card</span>
                <span>Nivel de Endeudamiento Evaluado</span>
              </span>
              <span className="font-mono text-[32px] font-bold text-on-surface">
                {computedDebtLevel}%
              </span>
            </div>
            <p className="font-sans text-[14px] text-on-surface-variant mt-[16px] leading-relaxed">
              Conocer este porcentaje es un paso determinante. Cada decisión consciente orientada a gestionar tus deudas potencia tu bienestar y libertad financiera a largo plazo.
            </p>
          </div>
        )}

        {resumenGastos && Object.keys(resumenGastos).length > 0 && (
          <div className="bg-surface-bright rounded-2xl p-[20px] border border-surface-variant shadow-2xs flex flex-col justify-between">
            <div>
              <span className="block font-sans text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-[12px] flex items-center gap-[6px]">
                <span className="material-symbols-outlined text-[18px] text-primary">pie_chart</span>
                <span>Resumen de Gastos Evaluados</span>
              </span>
              <div className="space-y-[10px] max-h-48 overflow-y-auto pr-2">
                {Object.entries(resumenGastos).map(([categoria, monto]) => (
                  <div key={categoria} className="flex items-center justify-between text-[14px] sm:text-[15px] border-b border-surface-variant/60 pb-[8px] last:border-0 last:pb-0">
                    <span className="font-sans font-medium text-on-surface">{categoria}</span>
                    <span className="font-mono font-bold text-primary">
                      {formatCurrency(monto)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="font-sans text-[12px] text-on-surface-variant mt-[12px] italic">
              * Montos evaluados según el reporte emitido por el motor inteligente de Spring Boot.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
