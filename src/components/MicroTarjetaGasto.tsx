import React from "react";

export interface Transaction {
  id: string;
  descripcion: string;
  valor: number;
}

interface MicroTarjetaGastoProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export const MicroTarjetaGasto: React.FC<MicroTarjetaGastoProps> = ({
  transaction,
  onDelete,
}) => {
  // STRICTLY JetBrains Mono font for financial figures per design specifications
  const formattedValue = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(transaction.valor);

  return (
    <tr className="hover:bg-surface-container-low/60 transition-colors border-b border-surface-variant/50 group">
      <td className="p-[16px] font-sans text-[14px] text-on-surface font-medium">
        {transaction.descripcion}
      </td>
      
      <td className="p-[16px]">
        {/* Semantic category pill badge as defined in code.html table rows */}
        <div className="flex items-center gap-[4px] text-primary bg-primary-fixed/40 w-fit px-[8px] py-[4px] rounded-full shadow-2xs">
          <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider">
            Gasto Habitual
          </span>
        </div>
      </td>
      
      <td className="p-[16px] font-mono text-[18px] font-bold text-on-surface text-right">
        <div className="flex items-center justify-end gap-[12px]">
          <span className="tracking-tight">{formattedValue}</span>
          <button
            type="button"
            onClick={() => onDelete(transaction.id)}
            className="p-[6px] rounded-lg text-outline hover:text-error hover:bg-error-container/40 transition-colors duration-200 focus:outline-hidden focus:ring-1 focus:ring-error cursor-pointer opacity-70 group-hover:opacity-100"
            aria-label={`Eliminar gasto ${transaction.descripcion}`}
            title="Eliminar gasto"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};
