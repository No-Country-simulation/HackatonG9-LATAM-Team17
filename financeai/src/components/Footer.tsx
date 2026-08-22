import React from 'react';
import { MASCOTS } from '../assets/mascots';

export const Footer: React.FC = () => {
  return (
    <footer
      id="app-footer"
      className="mt-auto border-t border-[#e1e3e4] bg-white py-6 px-8 text-xs text-[#767586] flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#6063ee] to-[#fd933d] flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <img
              src={MASCOTS.logo}
              alt="FinanceAI Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <span className="font-bold text-[#4648d4] font-display">FinanceAI</span>
        <span>© 2026 FinanceAI - Tu Viaje Financiero</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 font-medium text-[#464554]">
        <a href="#privacy" className="hover:text-[#4648d4] transition-colors">
          Política de Privacidad
        </a>
        <a href="#terms" className="hover:text-[#4648d4] transition-colors">
          Términos de Servicio
        </a>
        <a href="#faq" className="hover:text-[#4648d4] transition-colors">
          Preguntas Frecuentes
        </a>
      </div>
    </footer>
  );
};
