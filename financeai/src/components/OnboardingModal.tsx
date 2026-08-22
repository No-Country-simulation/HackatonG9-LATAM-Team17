import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { MASCOTS } from '../assets/mascots';
import { FrecuenciaAhorro } from '../types';
import { preventNegativeKeys, sanitizePositiveNumber } from '../utils/numberUtils';

interface PropsOnboardingModal {
  isOpen: boolean;
  onComplete: (datos: { ingresoMensual: number; deudaTotal: number; frecuenciaAhorro: FrecuenciaAhorro }) => void;
}

export const OnboardingModal: React.FC<PropsOnboardingModal> = ({
  isOpen,
  onComplete,
}) => {
  const [ingresoMensual, setIngresoMensual] = useState('');
  const [deudaTotal, setDeudaTotal] = useState('');
  const [frecuenciaAhorro, setFrecuenciaAhorro] = useState<FrecuenciaAhorro>('Mensual');

  if (!isOpen) return null;

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    const ingresoParseado = parseFloat(ingresoMensual);
    const deudaParseada = parseFloat(deudaTotal);
    
    if (isNaN(ingresoParseado) || ingresoParseado <= 0) return;
    if (isNaN(deudaParseada) || deudaParseada < 0) return;

    onComplete({
      ingresoMensual: ingresoParseado,
      deudaTotal: deudaParseada,
      frecuenciaAhorro,
    });
  };

  return (
    <div 
      id="onboarding-modal-overlay"
      className="fixed inset-0 bg-[#f8f9fa]/95 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in-95 duration-500"
    >
      <div 
        id="onboarding-modal-card"
        className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full border border-[#e1e3e4] grid grid-cols-1 md:grid-cols-12 relative"
      >
        {/* Left Branding Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#eceefe] via-[#f4f3ff] to-[#ffdcc5]/40 p-8 flex flex-col justify-between items-center text-center relative overflow-hidden border-b md:border-b-0 md:border-r border-[#e1e3e4]">
          <div className="w-full flex flex-col items-center">
            {/* Mascot in glowing frame */}
            <div className="relative w-32 h-32 rounded-full p-2 bg-gradient-to-tr from-[#6063ee] via-[#4648d4] to-[#fd933d] shadow-[0_8px_24px_rgba(70,72,212,0.25)] flex items-center justify-center my-6 group">
              <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center p-1">
                <img
                  src={MASCOTS.logo}
                  alt="FinanceAI Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#4648d4] font-display">
              Información Base
            </h2>
            <p className="text-xs font-semibold text-[#767586] mt-0.5">
              Paso Requerido
            </p>
          </div>

          <p className="text-xs text-[#464554] mt-6 leading-relaxed max-w-xs font-medium">
            Para ofrecerte análisis precisos y recomendaciones guiadas por IA, necesitamos conocer tu base financiera.
          </p>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#191c1d] font-display">
              ¡Casi listos!
            </h3>
            <p className="text-xs text-[#767586] mt-1">
              Completa tu perfil financiero para empezar a usar la plataforma.
            </p>
          </div>

          <form onSubmit={manejarEnvio} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                Ingreso Mensual Total ($)
              </label>
              <input
                type="number"
                min="0.01"
                step="any"
                required
                placeholder="Ej. 2500000"
                value={ingresoMensual}
                onKeyDown={preventNegativeKeys}
                onChange={(e) => setIngresoMensual(sanitizePositiveNumber(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4] transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                Valor Total Deudas ($)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                placeholder="Ej. 875000"
                value={deudaTotal}
                onKeyDown={preventNegativeKeys}
                onChange={(e) => setDeudaTotal(sanitizePositiveNumber(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4] transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                Frecuencia de Ahorro
              </label>
              <select
                value={frecuenciaAhorro}
                onChange={(e) => setFrecuenciaAhorro(e.target.value as FrecuenciaAhorro)}
                className="w-full appearance-none px-3.5 py-2.5 text-sm rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4] transition-all"
              >
                <option value="Mensual">Mensual</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Semanal">Semanal</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white rounded-xl text-xs font-bold hover:shadow-[0_4px_16px_rgba(70,72,212,0.4)] transition-all flex items-center justify-center gap-2 group mt-2"
            >
              Comenzar
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
