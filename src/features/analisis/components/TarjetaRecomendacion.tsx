import React from "react";

interface TarjetaRecomendacionProps {
  recommendations: string[];
}

export const TarjetaRecomendacion: React.FC<TarjetaRecomendacionProps> = ({
  recommendations,
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-[24px] animate-card-enter">
      <div className="flex items-center gap-[12px]">
        <div className="p-[10px] rounded-2xl bg-secondary-fixed text-on-secondary-fixed shadow-2xs flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px] text-secondary-container">
            tips_and_updates
          </span>
        </div>
        <div>
          <h3 className="font-heading text-[24px] font-bold text-on-surface">
            Oportunidades de Crecimiento y Optimización
          </h3>
          <p className="font-sans text-[14px] md:text-[16px] text-on-surface-variant">
            Estrategias positivas diseñadas por tu Experto Alentador para impulsar tu progreso financiero paso a paso.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl bg-surface-container-lowest border border-surface-variant p-[24px] custom-shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between interactive-card"
          >
            {/* Warm Coral action accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-secondary-container"></div>

            <div className="flex items-start gap-[16px] mt-[4px]">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed font-mono font-bold text-[14px] shrink-0 shadow-2xs">
                {idx + 1}
              </span>
              <p className="font-sans text-on-surface text-[15px] leading-relaxed font-medium">
                {rec}
              </p>
            </div>

            <div className="mt-[24px] pt-[12px] border-t border-surface-variant/60 flex items-center justify-end text-[12px] text-secondary font-sans font-semibold tracking-wide opacity-85 group-hover:opacity-100 transition-opacity gap-[4px]">
              <span className="material-symbols-outlined text-[16px]">auto_graph</span>
              <span>Impulso Financiero ✨</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
