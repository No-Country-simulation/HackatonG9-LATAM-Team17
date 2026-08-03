"use client";

import React, { useState } from "react";
import { SeccionIngresoGastos } from "@/components/SeccionIngresoGastos";
import { Transaction } from "@/components/MicroTarjetaGasto";
import { AnalysisRequestPayload, AnalysisResponsePayload } from "@/types/finance";

interface FormularioAnalisisProps {
  onAnalysisComplete: (result: AnalysisResponsePayload, computedDebtLevel: number) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (errorMsg: string | null) => void;
  onReset: () => void;
  isLoading: boolean;
}

export const FormularioAnalisis: React.FC<FormularioAnalisisProps> = ({
  onAnalysisComplete,
  onLoadingChange,
  onError,
  onReset,
  isLoading,
}) => {
  // CRITICAL: ALL React state logic, computations, and validations kept 100% intact
  const [ingresoMensual, setIngresoMensual] = useState<string>("");
  const [valorDeuda, setValorDeuda] = useState<string>("");
  const [frecuenciaAhorro, setFrecuenciaAhorro] = useState<string>("MENSUAL");
  const [transacciones, setTransacciones] = useState<Transaction[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddTransaction = (descripcion: string, valor: number) => {
    const newTx: Transaction = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      descripcion,
      valor,
    };
    setTransacciones((prev) => [...prev, newTx]);
    if (validationError) setValidationError(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransacciones((prev) => prev.filter((tx) => tx.id !== id));
  };

  const handleResetAll = () => {
    setIngresoMensual("");
    setValorDeuda("");
    setFrecuenciaAhorro("MENSUAL");
    setTransacciones([]);
    setValidationError(null);
    onReset();
  };

  const handleSubmitAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);

    const ingresoNum = parseFloat(ingresoMensual.replace(/[^0-9.]/g, ""));
    if (isNaN(ingresoNum) || ingresoNum <= 0) {
      setValidationError(
        "Para conocer tu potencial de ahorro y realizar el diagnóstico, tu ingreso mensual debe ser un monto positivo mayor a $0."
      );
      return;
    }

    const deudaNum = valorDeuda ? parseFloat(valorDeuda.replace(/[^0-9.]/g, "")) : 0;
    if (isNaN(deudaNum) || deudaNum < 0) {
      setValidationError(
        "Por favor verifica el valor de tus deudas actuales; debe ser $0 o un monto positivo."
      );
      return;
    }

    if (!frecuenciaAhorro || frecuenciaAhorro.trim() === "") {
      setValidationError(
        "Selecciona una frecuencia de ahorro para brindarte recomendaciones alineadas con tus hábitos financieros."
      );
      return;
    }

    if (transacciones.length === 0) {
      setValidationError(
        "Para un análisis completo y certero, por favor registra al menos un gasto habitual en tu lista de transacciones antes de continuar."
      );
      return;
    }

    setValidationError(null);
    onLoadingChange(true);

    const nivelEndeudamiento = Math.round((deudaNum / ingresoNum) * 100);

    const payload: AnalysisRequestPayload = {
      ingreso_mensual: ingresoNum,
      nivel_endeudamiento: nivelEndeudamiento,
      frecuencia_ahorro: frecuenciaAhorro,
      transacciones: transacciones.map((tx) => ({
        descripcion: tx.descripcion,
        valor: tx.valor,
      })),
    };

    try {
      const res = await fetch("http://localhost:8080/api/v1/finanzas/analizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`El servidor respondió con el estado HTTP ${res.status}`);
      }

      const data: AnalysisResponsePayload = await res.json();
      onAnalysisComplete(data, nivelEndeudamiento);
    } catch (err) {
      onError(
        "No logramos conectar con el motor de Inteligencia Artificial en el servidor local (http://localhost:8080). Por favor verifica que tu servicio en Spring Boot esté en ejecución e inténtalo nuevamente. ¡Tus datos en pantalla se conservan!"
      );
    } finally {
      onLoadingChange(false);
    }
  };

  const liveIncome = parseFloat(ingresoMensual) || 0;
  const liveDebt = parseFloat(valorDeuda) || 0;
  const computedDebtRatio = liveIncome > 0 ? Math.round((liveDebt / liveIncome) * 100) : null;

  return (
    /* Bento-style Layout exactly matching code.html grid */
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px]">
      {/* Main Form Area (8 columns) */}
      <div className="lg:col-span-8 flex flex-col gap-[32px]">
        {/* Manual entry indicator badge */}
        <div className="bg-surface-container-lowest rounded-xl p-[4px] inline-flex w-fit custom-shadow border border-surface-variant/50">
          <div className="px-[16px] py-[8px] bg-primary-container text-on-primary-container font-sans text-[12px] font-semibold rounded-lg flex items-center gap-[6px]">
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>Entrada Manual</span>
          </div>
        </div>

        {/* Base Financial Info Control Card styled as Level 1 Card from DESIGN.md */}
        <div className="bg-surface-container-lowest rounded-2xl p-[24px] custom-shadow border border-surface-variant interactive-card transition-all">
          <h3 className="font-sans text-[18px] font-bold text-on-surface mb-[8px] flex items-center gap-[8px]">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            <span>Información Financiera Base</span>
          </h3>
          <p className="text-[14px] text-on-surface-variant mb-[24px] font-sans">
            Compartir esta información nos permite entender tu panorama y preparar estrategias alentadoras para alcanzar tus objetivos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            {/* Monthly Income Control */}
            <div>
              <label
                htmlFor="ingreso-mensual"
                className="block font-sans text-[12px] font-semibold text-on-surface-variant mb-[4px]"
              >
                Ingreso Mensual Total ($) *
              </label>
              <input
                id="ingreso-mensual"
                type="number"
                step="any"
                placeholder="Ej. 2500000"
                value={ingresoMensual}
                onChange={(e) => {
                  setIngresoMensual(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                disabled={isLoading}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-[8px] px-[16px] font-mono text-[18px] font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all duration-200"
              />
            </div>

            {/* Total Debt Value Control */}
            <div>
              <label
                htmlFor="valor-deuda"
                className="block font-sans text-[12px] font-semibold text-on-surface-variant mb-[4px]"
              >
                Valor Total Deudas ($)
              </label>
              <div className="relative">
                <input
                  id="valor-deuda"
                  type="number"
                  step="any"
                  placeholder="Ej. 875000"
                  value={valorDeuda}
                  onChange={(e) => {
                    setValorDeuda(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  disabled={isLoading}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg py-[8px] px-[16px] font-mono text-[18px] font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all duration-200"
                />
                {computedDebtRatio !== null && (
                  <span
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-primary-fixed text-on-primary-fixed font-mono text-[11px] font-bold rounded-md shadow-2xs"
                    title="Nivel de endeudamiento calculado"
                  >
                    {computedDebtRatio}% deuda
                  </span>
                )}
              </div>
            </div>

            {/* Saving Frequency Control */}
            <div>
              <label
                htmlFor="frecuencia-ahorro"
                className="block font-sans text-[12px] font-semibold text-on-surface-variant mb-[4px]"
              >
                Frecuencia de Ahorro *
              </label>
              <select
                id="frecuencia-ahorro"
                value={frecuenciaAhorro}
                onChange={(e) => {
                  setFrecuenciaAhorro(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                disabled={isLoading}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-[8px] px-[16px] font-sans text-[14px] font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all duration-200"
              >
                <option value="MENSUAL">Mensual</option>
                <option value="QUINCENAL">Quincenal</option>
                <option value="SEMANAL">Semanal</option>
                <option value="ANUAL">Anual / Ocasional</option>
                <option value="NUNCA">Todavía no ahorro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expense Entry Card & Transactions Table Integration */}
        <SeccionIngresoGastos
          transactions={transacciones}
          onAddTransaction={handleAddTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </div>

      {/* Side Panel (Actions & Insights Snippets in Column 4) */}
      <div className="lg:col-span-4 flex flex-col gap-[32px]">
        {/* Action Card exactly from code.html lines 367-378 */}
        <div className="bg-surface-container-lowest rounded-2xl p-[24px] custom-shadow border border-surface-variant flex flex-col items-center text-center gap-[16px] relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-fixed rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 z-0"></div>
          
          <div className="relative z-10 w-full flex flex-col items-center">
            <span className="material-symbols-outlined text-[48px] text-primary mb-[8px]">
              magic_button
            </span>
            <h3 className="font-sans text-[18px] font-bold text-on-surface mb-[4px]">
              ¿Listo para analizar?
            </h3>
            <p className="font-sans text-[14px] text-on-surface-variant mb-[24px] leading-relaxed">
              Nuestra IA procesará {transacciones.length > 0 ? `estas ${transacciones.length} entradas` : "tus registros"} y actualizará tu narrativa financiera.
            </p>

            {/* Submission Validation Error Alert */}
            {validationError && (
              <div className="mb-[16px] p-[12px] w-full rounded-xl bg-error-container border border-error/40 text-on-error-container font-sans text-[13px] text-left flex items-start gap-[8px] shadow-xs animate-card-enter">
                <span className="material-symbols-outlined text-error text-[20px] shrink-0">
                  error
                </span>
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="button"
              id="generateBtn"
              onClick={handleSubmitAnalysis}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-tertiary text-on-primary font-sans text-[16px] font-bold py-[16px] px-[24px] rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex justify-center items-center gap-[8px] relative overflow-hidden cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="btn-text">Procesando IA...</span>
                  <span className="material-symbols-outlined spinner animate-spin">progress_activity</span>
                </>
              ) : (
                <>
                  <span className="btn-text">Generar Análisis</span>
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetAll}
              disabled={isLoading && (ingresoMensual === "" && transacciones.length === 0)}
              className="mt-[12px] w-full py-[10px] px-[16px] rounded-xl border border-outline-variant/60 hover:bg-surface-container-low text-on-surface-variant font-sans text-[13px] font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              Limpiar y Reiniciar Datos
            </button>
          </div>
        </div>

        {/* Motivational Snippet from code.html lines 380-388 */}
        <div className="bg-gradient-to-br from-secondary-fixed to-surface-bright rounded-2xl p-[24px] custom-shadow flex gap-[16px] items-start border border-secondary-fixed-dim/30">
          <div className="w-12 h-12 shrink-0 bg-surface-container-lowest rounded-full p-2 custom-shadow flex items-center justify-center">
            <img
              className="w-full h-full object-contain"
              alt="Mascota motivacional FinanceAI"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2_Z8Uqc6jbkJ_6QnGD-LcFV38is0zeaUWBykUo1PmhgebSAD9PhA6cxf7Hzl6WIX17gB105XaeClYpuFCzzgpfLakNn7-B1GambXhZpfA8pygnKWt0CqESunGzJEYJ1ohzEPMp1PrqupAWUH6LwM-x_kBH83uVTQbChL8yJXSZNctu33VdCy19rqbSt1SEa9Hx7QQC7_Z1XBo8BRsZ_C47x9m1CP89mef3t4y86qhtAjuRHgMg4WpRQ"
            />
          </div>
          <div>
            <p className="font-sans text-[16px] font-bold text-on-secondary-container mb-[4px]">
              ¡Ya casi!
            </p>
            <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant">
              Agregar entradas manuales mantiene tu historia precisa. Cada detalle ayuda a pintar una mejor imagen de tus metas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
