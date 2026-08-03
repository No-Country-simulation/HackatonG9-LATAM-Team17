"use client";

import React, { useState } from "react";
import { MicroTarjetaGasto, Transaction } from "@/components/MicroTarjetaGasto";

interface SeccionIngresoGastosProps {
  transactions: Transaction[];
  onAddTransaction: (descripcion: string, valor: number) => void;
  onDeleteTransaction: (id: string) => void;
}

export const SeccionIngresoGastos: React.FC<SeccionIngresoGastosProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  // CRITICAL: All traditional React state conditional validations preserved intact
  const [descripcion, setDescripcion] = useState("");
  const [valor, setValor] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion || descripcion.trim() === "") {
      setErrorMsg(
        "Por favor ingresa un nombre para tu gasto y da el primer paso hacia una mayor claridad financiera."
      );
      return;
    }

    if (descripcion.length > 25) {
      setErrorMsg(
        "¡Mantengamos tus registros ágiles! La descripción debe tener como máximo 25 caracteres para facilitar tu lectura."
      );
      return;
    }

    const valorNumerico = parseFloat(valor.replace(/[^0-9.]/g, ""));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setErrorMsg(
        "Para un diagnóstico riguroso y certero, el monto del gasto debe ser un número positivo mayor a 0."
      );
      return;
    }

    setErrorMsg(null);
    onAddTransaction(descripcion.trim(), valorNumerico);
    setDescripcion("");
    setValor("");
  };

  // Calculate Total for footer summary strictly from transactions state
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.valor, 0);
  const formattedTotal = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalAmount);

  return (
    <div className="flex flex-col gap-[32px]">
      {/* Input Card exactly from code.html lines 286-306 */}
      <div className="bg-surface-container-lowest rounded-2xl p-[24px] custom-shadow border border-surface-variant interactive-card transition-all">
        <h3 className="font-sans text-[18px] font-bold text-on-surface mb-[16px] flex items-center gap-[8px]">
          <span className="material-symbols-outlined text-secondary-container">add_circle</span>
          <span>Agregar Transacción</span>
        </h3>

        <form onSubmit={handleAddExpense} className="space-y-[16px]">
          <div className="flex flex-col md:flex-row gap-[16px] items-end">
            <div className="flex-1 w-full">
              <label
                htmlFor="desc-input"
                className="block font-sans text-[12px] font-semibold text-on-surface-variant mb-[4px]"
              >
                Descripción
              </label>
              <input
                id="desc-input"
                type="text"
                placeholder="ej. Compras de la semana"
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-[8px] px-[16px] text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all"
              />
            </div>

            <div className="w-full md:w-40">
              <label
                htmlFor="val-input"
                className="block font-sans text-[12px] font-semibold text-on-surface-variant mb-[4px]"
              >
                Monto
              </label>
              <div className="relative">
                <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant font-mono text-[18px] font-bold">
                  $
                </span>
                <input
                  id="val-input"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={valor}
                  onChange={(e) => {
                    setValor(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg py-[8px] pl-8 pr-[12px] text-[18px] font-mono font-bold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-secondary-container text-on-secondary-container p-[8px] rounded-lg hover:opacity-90 transition-opacity w-full md:w-auto flex justify-center items-center h-[42px] px-[16px] shrink-0 cursor-pointer shadow-xs font-sans font-semibold text-[14px] md:w-[50px]"
              title="Agregar transacción"
            >
              <span className="material-symbols-outlined text-[24px]">add</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-[12px] rounded-xl bg-error-container border border-error/30 text-on-error-container text-[13px] font-sans font-medium flex items-start gap-[8px] animate-card-enter">
              <span className="material-symbols-outlined text-error text-[18px] shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}
        </form>
      </div>

      {/* Transactions Table Card exactly from code.html lines 307-362 */}
      <div className="bg-surface-container-lowest rounded-2xl custom-shadow border border-surface-variant overflow-hidden">
        <div className="p-[24px] border-b border-surface-variant flex justify-between items-center bg-surface-bright">
          <h3 className="font-sans text-[16px] font-bold text-on-surface">
            Entradas Actuales
          </h3>
          <span className="bg-primary-fixed text-on-primary-fixed font-sans text-[12px] font-semibold px-[8px] py-[4px] rounded-full">
            {transactions.length} Elemento{transactions.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-surface-variant">
                <th className="p-[16px] font-sans text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Descripción
                </th>
                <th className="p-[16px] font-sans text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider w-40">
                  Categoría
                </th>
                <th className="p-[16px] font-sans text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider text-right w-44">
                  Monto / Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-[32px] text-center text-on-surface-variant font-sans text-[14px] italic">
                    No has registrado transacciones aún. ¡Agrega tu primer gasto arriba para armar tu reporte!
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <MicroTarjetaGasto
                    key={tx.id}
                    transaction={tx}
                    onDelete={onDeleteTransaction}
                  />
                ))
              )}
            </tbody>
            {transactions.length > 0 && (
              <tfoot>
                <tr className="bg-surface-container-low border-t-2 border-surface-variant">
                  <td className="p-[16px] font-sans text-[16px] font-bold text-on-surface-variant text-right" colSpan={2}>
                    Total Evaluado
                  </td>
                  <td className="p-[16px] font-mono text-[20px] font-bold text-primary text-right pr-[50px]">
                    {formattedTotal}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
