"use client";

import React, { useState, useEffect } from "react";
import { SeccionIngresoGastos } from "@/features/transacciones/components/SeccionIngresoGastos";
import { AnalysisRequestPayload, AnalysisResponsePayload, Transaccion } from "@/types/finance";

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
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // V2: New financial indicator states — defaults to empty string; parsed to float/int before dispatch
  const [montoInversion, setMontoInversion] = useState<string>("");
  const [objetivoPresupuesto, setObjetivoPresupuesto] = useState<string>("");
  const [pagoMensualDeuda, setPagoMensualDeuda] = useState<string>("");
  const [serviciosSuscripcion, setServiciosSuscripcion] = useState<string>("");
  const [fondoEmergencia, setFondoEmergencia] = useState<string>("");

  useEffect(() => {
    const fetchTransactions = async () => {
      onLoadingChange(true);
      try {
        const res = await fetch("http://localhost:8080/api/v1/transacciones/usuario/USR-1001");
        if (res.ok) {
          const data = await res.json();
          setTransacciones(data);
        } else {
          onError("No logramos cargar tus gastos previos del servidor.");
        }
      } catch (error) {
        onError("Error de red al intentar cargar tus gastos iniciales.");
      } finally {
        onLoadingChange(false);
      }
    };
    fetchTransactions();
  }, [onError, onLoadingChange]);

  const handleAddTransaction = async (descripcion: string, valor: number, fechaTransaccion: string) => {
    onLoadingChange(true);
    try {
      // Backend contract requires snake_case and specific properties
      const payload = {
        usuario_id: "USR-1001",
        descripcion: descripcion,
        monto: valor,
        tipo: "EGRESO",
        categoria: null,
        fecha_transaccion: fechaTransaccion
      };
      
      const res = await fetch("http://localhost:8080/api/v1/transacciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.status === 201 || res.ok) {
        const data = await res.json();
        // Map backend response back to our Transaccion UI interface
        const newTx: Transaccion = {
          id: data.id,
          descripcion: data.descripcion,
          valor: data.monto !== undefined ? data.monto : (data.valor || valor),
          fecha_transaccion: data.fecha_transaccion || fechaTransaccion
        };
        setTransacciones((prev) => [...prev, newTx]);
        if (validationError) setValidationError(null);
      } else {
        onError("Hubo un error al guardar el gasto en la nube.");
      }
    } catch (err) {
      onError("No logramos conectar con el servidor para guardar tu gasto.");
    } finally {
      onLoadingChange(false);
    }
  };

  const handleDeleteTransaction = async (id: number | string) => {
    onLoadingChange(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/transacciones/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTransacciones((prev) => prev.filter((tx) => String(tx.id) !== String(id)));
      } else {
        onError("Hubo un error al eliminar el gasto.");
      }
    } catch (err) {
      onError("Error de red al intentar eliminar el gasto.");
    } finally {
      onLoadingChange(false);
    }
  };

  const handleResetAll = () => {
    setIngresoMensual("");
    setValorDeuda("");
    setFrecuenciaAhorro("MENSUAL");
    setTransacciones([]);
    setValidationError(null);
    // V2: also clear new fields
    setMontoInversion("");
    setObjetivoPresupuesto("");
    setPagoMensualDeuda("");
    setServiciosSuscripcion("");
    setFondoEmergencia("");
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

    setValidationError(null);
    onLoadingChange(true);

    const nivelEndeudamiento = Math.round((deudaNum / ingresoNum) * 100);

    // V2: Safe numeric conversions — missing/empty fields default to 0 per appV2.js spec
    const montoInversionNum = montoInversion ? parseFloat(montoInversion.replace(/[^0-9.]/g, "")) : 0;
    const objetivoPresupuestoNum = objetivoPresupuesto ? parseFloat(objetivoPresupuesto.replace(/[^0-9.]/g, "")) : 0;
    const pagoMensualDeudaNum = pagoMensualDeuda ? parseFloat(pagoMensualDeuda.replace(/[^0-9.]/g, "")) : 0;
    // servicios_suscripcion is an integer count (e.g. number of subscriptions)
    const serviciosSuscripcionNum = serviciosSuscripcion ? parseInt(serviciosSuscripcion.replace(/[^0-9]/g, ""), 10) : 0;
    const fondoEmergenciaNum = fondoEmergencia ? parseFloat(fondoEmergencia.replace(/[^0-9.]/g, "")) : 0;

    const payload: AnalysisRequestPayload = {
      ingreso_mensual: ingresoNum,
      nivel_endeudamiento: nivelEndeudamiento,
      frecuencia_ahorro: frecuenciaAhorro,
      monto_inversion: isNaN(montoInversionNum) ? 0 : montoInversionNum,
      deuda_total: deudaNum,
      objetivo_presupuesto: isNaN(objetivoPresupuestoNum) ? 0 : objetivoPresupuestoNum,
      pago_mensual_deuda: isNaN(pagoMensualDeudaNum) ? 0 : pagoMensualDeudaNum,
      servicios_suscripcion: isNaN(serviciosSuscripcionNum) ? 0 : serviciosSuscripcionNum,
      fondo_emergencia: isNaN(fondoEmergenciaNum) ? 0 : fondoEmergenciaNum,
    };

    try {
      const res = await fetch("http://localhost:8080/api/v1/analisis/perfil/USR-1001", {
        method: "POST",
        headers: {
          "Accept": "application/json",
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

        {/* V2: Advanced Financial Indicators Card — same Level 1 style as base card */}
        <div className="bg-surface-container-lowest rounded-2xl p-[24px] custom-shadow border border-surface-variant interactive-card transition-all">
          <h3 className="font-sans text-[18px] font-bold text-on-surface mb-[8px] flex items-center gap-[8px]">
            <span className="material-symbols-outlined text-primary">monitoring</span>
            <span>Indicadores Financieros Avanzados</span>
          </h3>
          <p className="text-[14px] text-on-surface-variant mb-[24px] font-sans">
            Estos datos complementan tu perfil para que el motor de IA genere un diagnóstico más preciso y recomendaciones personalizadas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">

            {/* Monto de Inversión */}
            <div>
              <label
                htmlFor="monto-inversion"
                className="block font-sans text-[12px] font-semibold text-on-surface-variant mb-[4px]"
              >
                Monto de Inversión ($)
              </label>
              <input
                id="monto-inversion"
                type="number"
                step="any"
                min="0"
                placeholder="Ej. 200000"
                value={montoInversion}
                onChange={(e) => {
                  setMontoInversion(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                disabled={isLoading}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-[8px] px-[16px] font-mono text-[18px] font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all duration-200"
              />
            </div>

            {/* Objetivo de Presupuesto */}
            <div>
              <label
                htmlFor="objetivo-presupuesto"
                className="block font-sans text-[12px] font-semibold text-on-surface-variant mb-[4px]"
              >
                Objetivo de Presupuesto ($)
              </label>
              <input
                id="objetivo-presupuesto"
                type="number"
                step="any"
                min="0"
                placeholder="Ej. 3000000"
                value={objetivoPresupuesto}
                onChange={(e) => {
                  setObjetivoPresupuesto(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                disabled={isLoading}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-[8px] px-[16px] font-mono text-[18px] font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all duration-200"
              />
            </div>

            {/* Pago Mensual de Deuda */}
            <div>
              <label
                htmlFor="pago-mensual-deuda"
                className="block font-sans text-[12px] font-semibold text-on-surface-variant mb-[4px]"
              >
                Pago Mensual de Deuda ($)
              </label>
              <input
                id="pago-mensual-deuda"
                type="number"
                step="any"
                min="0"
                placeholder="Ej. 350000"
                value={pagoMensualDeuda}
                onChange={(e) => {
                  setPagoMensualDeuda(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                disabled={isLoading}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-[8px] px-[16px] font-mono text-[18px] font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all duration-200"
              />
            </div>

            {/* Servicios / Suscripciones — integer count */}
            <div>
              <label
                htmlFor="servicios-suscripcion"
                className="block font-sans text-[12px] font-semibold text-on-surface-variant mb-[4px]"
              >
                Cantidad de Suscripciones
              </label>
              <input
                id="servicios-suscripcion"
                type="number"
                step="1"
                min="0"
                placeholder="Ej. 3"
                value={serviciosSuscripcion}
                onChange={(e) => {
                  setServiciosSuscripcion(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                disabled={isLoading}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-[8px] px-[16px] font-sans text-[18px] font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all duration-200"
              />
            </div>

            {/* Fondo de Emergencia — spans full width on 2-col grid */}
            <div className="md:col-span-2">
              <label
                htmlFor="fondo-emergencia"
                className="block font-sans text-[12px] font-semibold text-on-surface-variant mb-[4px]"
              >
                Fondo de Emergencia ($)
              </label>
              <input
                id="fondo-emergencia"
                type="number"
                step="any"
                min="0"
                placeholder="Ej. 1500000"
                value={fondoEmergencia}
                onChange={(e) => {
                  setFondoEmergencia(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                disabled={isLoading}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-[8px] px-[16px] font-mono text-[18px] font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all duration-200"
              />
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
