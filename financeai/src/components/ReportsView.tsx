import React, { useState } from 'react';
import {
  Download,
  Banknote,
  CreditCard,
  RotateCw,
  MoreHorizontal,
  TrendingUp,
  Target,
  Tv,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ReporteAnalisis, UserProfile } from '../types';

interface ReportsViewProps {
  report: ReporteAnalisis;
  userProfile: UserProfile;
  onOpenAnalysisModal?: (report: ReporteAnalisis) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  report,
  userProfile,
  onOpenAnalysisModal,
}) => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('Octubre 2024');
  const [estaExportando, setEstaExportando] = useState(false);
  const [exportacionExitosa, setExportacionExitosa] = useState(false);


  const manejarExportacionPdf = () => {
    setEstaExportando(true);
    setTimeout(() => {
      setEstaExportando(false);
      setExportacionExitosa(true);
      // Trigger browser print to PDF
      window.print();
      setTimeout(() => setExportacionExitosa(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200" id="reports-view-container">
      {/* Header with Title and Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="reports-header">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#191c1d] tracking-tight font-display">
            Informes Financieros
          </h1>
          <p className="text-xs text-[#767586] mt-0.5 font-medium">
            Análisis detallado de tu salud financiera basada en tus parámetros.
          </p>
        </div>

        <button
          id="btn-export-report-pdf"
          onClick={manejarExportacionPdf}
          disabled={estaExportando}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#f8f9fa] text-[#4648d4] border border-[#4648d4] text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98"
        >
          <Download className="w-4 h-4 text-[#4648d4] stroke-[2.2]" />
          <span>{estaExportando ? 'Generando Informe...' : 'Exportar Informe (PDF)'}</span>
        </button>
      </div>

      {/* Top 3 KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="reports-top-kpis">
        {/* Card 1: Ingreso Mensual */}
        <div
          id="kpi-ingreso-mensual"
          className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#767586] uppercase">
              INGRESO MENSUAL
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#e1e0ff] text-[#4648d4] flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4">
            <p className="text-[28px] font-extrabold text-[#191c1d] tracking-tight font-mono-val leading-none">
              ${(userProfile.ingresoMensual || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#fd933d]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>$</span>
          </div>
        </div>

        {/* Card 2: Nivel de Endeudamiento */}
        <div
          id="kpi-nivel-endeudamiento"
          className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#767586] uppercase">
              NIVEL DE ENDEUDAMIENTO
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#ffdcc5] text-[#fd933d] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <p className="text-[28px] font-extrabold text-[#191c1d] tracking-tight font-mono-val leading-none">
              {userProfile.ratioDeuda || 0}%
            </p>
          </div>

          <div>
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-[#f3f4f5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#fd933d] rounded-full transition-all duration-500"
                style={{ width: `${userProfile.ratioDeuda || 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-medium text-[#767586] mt-1.5">
              <span>Actual</span>
              <span>Límite 40%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Frecuencia de Ahorro */}
        <div
          id="kpi-frecuencia-ahorro"
          className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[#767586] uppercase">
              FRECUENCIA DE AHORRO
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f4f3ff] text-[#712ae2] flex items-center justify-center">
              <RotateCw className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4">
            <p className="text-[26px] font-bold text-[#191c1d] tracking-tight font-mono-val leading-none">
              {userProfile.frecuenciaAhorro || 'Mensual'}
            </p>
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-[#eceefe] text-[#4648d4] text-[11px] font-bold rounded-full">
              Consistente
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Distribución de Gastos (Left) + 4 Stats Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="reports-main-analytics">
        {/* Left Column: Distribución de Gastos Card (8 cols) */}
        <div
          id="card-reports-expense-distribution"
          className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
        >
          <div>
            {/* Header with Title and 3-dots */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-bold text-[#191c1d] font-display">
                Distribución de Gastos
              </h3>
              <button className="text-[#767586] hover:text-[#191c1d] p-1 rounded-lg hover:bg-[#f3f4f5] transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Central Content Area with Percentages Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
              {/* Visual Multi-bar representation */}
              <div className="md:col-span-7 space-y-4">
                <div className="h-6 w-full bg-[#f3f4f5] rounded-xl overflow-hidden flex shadow-inner">
                  {report?.distribucionCategorias?.length > 0 ? (
                    report.distribucionCategorias.map((cat, idx) => (
                      <div key={idx} style={{ width: `${cat.porcentaje}%`, backgroundColor: cat.colorHex }} className="h-full transition-all hover:opacity-90" title={`${cat.categoria}: ${cat.porcentaje}%`} />
                    ))
                  ) : (
                    <div style={{ width: '100%' }} className="h-full bg-[#d9dadb] transition-all" title="Sin datos" />
                  )}
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-[#767586] px-1">
                  {report?.distribucionCategorias?.slice(0, 3).map((cat, idx) => (
                    <span key={idx}>{cat.categoria}: ${(cat.monto || 0).toLocaleString('en-US')}</span>
                  ))}
                </div>
              </div>

              {/* Legend List on Right */}
              <div className="md:col-span-5 space-y-3 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-[#f3f4f5] pt-4 md:pt-0">
                {report?.distribucionCategorias?.length > 0 ? (
                  report.distribucionCategorias.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.colorHex }} />
                        <span className="text-xs font-medium text-[#464554]">{cat.categoria}</span>
                      </div>
                      <span className="text-xs font-bold text-[#191c1d] font-mono-val">{cat.porcentaje}%</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#767586]">No hay suficientes datos para graficar</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Sub-categories Bar (Exact as screenshot) */}
          <div className="pt-6 border-t border-[#f3f4f5] flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#464554]">
            {report?.distribucionCategorias?.map((c) => c.categoria).map((cat) => (
              <span key={cat} className="hover:text-[#4648d4] transition-colors cursor-pointer">
                {cat}
              </span>
            )) || <span className="text-[#767586]">Sin datos</span>}
          </div>
        </div>

        {/* Right Column: 4 Compact Metrics Cards in 2x2 Grid (4 cols) */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4" id="reports-secondary-kpis">
          {/* Card 1: Ahorro Total */}
          <div
            id="metric-ahorro-total"
            className="bg-white rounded-2xl p-5 border border-[#e1e3e4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <p className="text-[11px] font-semibold text-[#767586]">
              Ahorro Total
            </p>
            <p className="text-xl font-bold text-[#191c1d] font-mono-val my-2">
              ${(report?.totalGastado || 0).toLocaleString('en-US')}
            </p>
            <div className="flex justify-end text-[#4648d4]">
              <TrendingUp className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          {/* Card 2: Obj. Presupuesto */}
          <div
            id="metric-obj-presupuesto"
            className="bg-white rounded-2xl p-5 border border-[#e1e3e4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <p className="text-[11px] font-semibold text-[#767586]">
              Obj. Presupuesto
            </p>
            <p className="text-xl font-bold text-[#191c1d] font-mono-val my-2">
              ${(userProfile.objetivoPresupuesto || 0).toLocaleString('en-US')}
            </p>
            <div className="flex justify-end text-[#712ae2]">
              <Target className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          {/* Card 3: Suscripciones */}
          <div
            id="metric-suscripciones"
            className="bg-white rounded-2xl p-5 border border-[#e1e3e4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <p className="text-[11px] font-semibold text-[#767586]">
              Suscripciones
            </p>
            <p className="text-xl font-bold text-[#191c1d] font-mono-val my-2">
              {userProfile.suscripciones || 0} Activas
            </p>
            <div className="flex justify-end text-[#fd933d]">
              <Tv className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          {/* Card 4: Fondo Emergencia */}
          <div
            id="metric-fondo-emergencia"
            className="bg-white rounded-2xl p-5 border border-[#e1e3e4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <p className="text-[11px] font-semibold text-[#767586]">
              Fondo Emergencia
            </p>
            <p className="text-xl font-bold text-[#191c1d] font-mono-val my-2">
              ${(userProfile.fondoEmergencia || 0).toLocaleString('en-US')}
            </p>
            <div className="flex justify-end text-[#712ae2]">
              <ShieldCheck className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
