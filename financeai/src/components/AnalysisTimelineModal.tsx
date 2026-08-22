import React from 'react';
import { X, History, ChevronRight, Activity } from 'lucide-react';
import { ReporteAnalisis } from '../types';

interface AnalysisTimelineModalProps {
  history: ReporteAnalisis[];
  isOpen: boolean;
  onClose: () => void;
  onSelectAnalysis: (r: ReporteAnalisis) => void;
}

export const AnalysisTimelineModal: React.FC<AnalysisTimelineModalProps> = ({
  history,
  isOpen,
  onClose,
  onSelectAnalysis,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-[#191c1d]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-[#f8f9fa] rounded-3xl w-full max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-white border-b border-[#e1e3e4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e0e7ff]/60 flex items-center justify-center text-[#4648d4]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#191c1d] font-display">Historial de Reportes</h2>
              <p className="text-xs text-[#767586] mt-0.5">Tus análisis previos organizados por fecha</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f3f4f5] hover:bg-[#e1e3e4] text-[#464554] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-[#767586]">No hay reportes históricos disponibles.</p>
            </div>
          ) : (
            history.map((rep) => {
              const fechaStr = new Date(rep.marcaTiempo).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              
              const isRed = rep.estadoSalud === 'Riesgo';
              const isGreen = rep.estadoSalud === 'Saludable';
              const scoreColor = isRed ? 'text-[#ba1a1a]' : isGreen ? 'text-[#10b981]' : 'text-[#fd933d]';

              return (
                <button
                  key={rep.id}
                  onClick={() => {
                    onSelectAnalysis(rep);
                    onClose();
                  }}
                  className="w-full text-left bg-white p-4 rounded-2xl border border-[#e1e3e4] hover:border-[#6063ee]/40 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-sm font-bold text-[#191c1d] capitalize">{fechaStr}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Activity className={`w-3.5 h-3.5 ${scoreColor}`} />
                      <span className={`text-xs font-semibold ${scoreColor}`}>
                        {rep.puntajeSalud}% - {rep.estadoSalud}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#767586] group-hover:text-[#4648d4] group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
