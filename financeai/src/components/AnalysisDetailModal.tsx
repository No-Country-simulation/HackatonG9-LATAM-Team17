import React from 'react';
import { X, Sparkles, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { AnalysisReport } from '../types';
import { MASCOTS } from '../assets/mascots';

interface AnalysisDetailModalProps {
  report: AnalysisReport | null;
  onClose: () => void;
}

export const AnalysisDetailModal: React.FC<AnalysisDetailModalProps> = ({
  report,
  onClose,
}) => {
  if (!report) return null;

  return (
    <div 
      id="analysis-detail-modal"
      className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border border-[#e1e3e4] max-h-[90vh] flex flex-col">
        {/* Modal Header with vibrant header */}
        <div className="bg-gradient-to-r from-[#4648d4] via-[#6063ee] to-[#712ae2] text-white p-6 relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md p-1 flex items-center justify-center shrink-0">
              <img
                src={report.healthScore >= 80 ? MASCOTS.happyPotatoCoin : MASCOTS.catWorriedEmpty}
                alt="Status Mascot"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffdcc5]">
                REPORTE DEL EXPERTO ALENTADOR • {report.date}
              </span>
              <h2 className="text-xl font-bold text-white font-display">
                Salud Financiera: {report.healthScore}% ({report.status})
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Narrative Summary */}
          <div className="bg-[#ffdcc5]/25 border border-[#ffdcc5] rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-[#944a00] font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Mensaje del Coach</span>
            </div>
            <p className="text-xs text-[#693300] leading-relaxed font-medium">
              "{report.encouragingMessage}"
            </p>
            {report.aiNarrative && (
              <p className="text-[11px] text-[#767586] leading-relaxed mt-1">
                {report.aiNarrative}
              </p>
            )}
          </div>

          {/* Breakdown Distribution */}
          <div>
            <h4 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-3">
              Desglose de Gastos Analizados (Total: ${report.totalSpent.toLocaleString()})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {report.categoryDistribution.map((c) => (
                <div key={c.category} className="p-3 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4]">
                  <p className="text-[11px] text-[#767586] font-medium">{c.category}</p>
                  <p className="text-sm font-bold text-[#191c1d] font-mono-val mt-0.5">
                    ${c.amount.toLocaleString()} ({c.percentage}%)
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider">
              Recomendaciones y Plan de Acción
            </h4>
            {report.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-[#e1e3e4] hover:border-[#4648d4]/40 transition-all flex items-start justify-between gap-3 bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-[#10b981]/15 text-[#10b981] mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#191c1d]">{rec.title}</h5>
                    <p className="text-[11px] text-[#464554] mt-0.5">{rec.description}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-[#4648d4] bg-[#4648d4]/10 px-2 py-0.5 rounded-full">
                      Impacto: {rec.impact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f8f9fa] border-t border-[#e1e3e4] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#4648d4] hover:bg-[#393bb8] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Entendido, ¡a por ello!
          </button>
        </div>
      </div>
    </div>
  );
};
