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
  FileText,
  BarChart3
} from 'lucide-react';
import { UserProfile, ReporteAnalisis } from '../types';
import { getDebtColor } from './SettingsProfileView';
import { getColorForCategory } from '../utils/colorManager';

interface ReportsViewProps {
  report: ReporteAnalisis;
  userProfile: UserProfile;
  analysisHistory?: ReporteAnalisis[];
  onOpenAnalysisModal?: (report: ReporteAnalisis) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  report,
  userProfile,
  analysisHistory,
  onOpenAnalysisModal,
}) => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('Octubre 2024');
  const [estaExportando, setEstaExportando] = useState(false);
  const [exportacionExitosa, setExportacionExitosa] = useState(false);

  const deudas = userProfile.deudaTotal;
  const ingresoMensual = userProfile.ingresoMensual;
  const ratioDeudaCalculado = ingresoMensual > 0 ? Math.round((deudas / ingresoMensual) * 100) : 0;

  const historicalReports = analysisHistory && analysisHistory.length > 0 ? analysisHistory : (report ? [report] : []);
  
  let totalGastadoGeneral = 0;
  const totalCategoriesMap: Record<string, import('../types').DistribucionCategoria> = {};

  historicalReports.forEach(rep => {
    totalGastadoGeneral += rep.totalGastado;
    (rep.distribucionCategorias || []).forEach(cat => {
      if (!totalCategoriesMap[cat.categoria]) {
        totalCategoriesMap[cat.categoria] = { ...cat, monto: 0, porcentaje: 0 };
      }
      totalCategoriesMap[cat.categoria].monto += cat.monto;
    });
  });

  const distribucionCategoriasTotal = Object.values(totalCategoriesMap)
    .filter(cat => cat.monto > 0)
    .map(cat => ({
      ...cat,
      porcentaje: totalGastadoGeneral > 0 ? Math.round((cat.monto / totalGastadoGeneral) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.monto - a.monto);

  const maxMontoCalc = Math.max(...distribucionCategoriasTotal.map(c => c.monto));
  const maxMonto = maxMontoCalc > 0 ? maxMontoCalc : 1;

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
            {report 
              ? (report.mensajeMotivador || 'Análisis detallado de tu salud financiera basada en tus parámetros.')
              : 'Aún no cuentas con un análisis generado. Añade transacciones y genera uno para obtener tu informe.'}
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
              {ratioDeudaCalculado}%
            </p>
          </div>

          <div>
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-[#f3f4f5] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${ratioDeudaCalculado}%`, backgroundColor: getDebtColor(ratioDeudaCalculado) }}
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
              {report?.entradas?.frecuenciaAhorro || userProfile.frecuenciaAhorro || 'Mensual'}
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
          className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col"
        >
          {/* Header with Title and 3-dots */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[#191c1d] font-display">
              Distribución de Gastos
            </h3>
            <button className="text-[#767586] hover:text-[#191c1d] p-1 rounded-lg hover:bg-[#f3f4f5] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-8 flex flex-col">
            <span className="text-xs font-bold text-[#767586] uppercase tracking-wider mb-1">Total del periodo</span>
            <span className="text-[28px] font-extrabold text-[#191c1d] tracking-tight font-mono-val leading-none">
              ${totalGastadoGeneral.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* List of categories */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 space-y-5">
            {distribucionCategoriasTotal.length > 0 ? (
              distribucionCategoriasTotal.map((cat, idx) => (
                <div key={idx} className="flex flex-col space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: cat.colorHex }} />
                      <div>
                        <p className="text-sm font-bold text-[#191c1d] leading-none mb-1.5">{cat.categoria}</p>
                        <p className="text-[11px] font-semibold text-[#767586]">{cat.porcentaje}% del gasto</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#191c1d] font-mono-val">
                      ${cat.monto.toLocaleString('en-US')}
                    </span>
                  </div>
                  {/* Independent Bar */}
                  <div className="w-full h-2 bg-[#f3f4f5] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${Math.max(1, (cat.monto / maxMonto) * 100)}%`,
                        backgroundColor: cat.colorHex
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#f3f4f5] flex items-center justify-center text-[#767586]">
                  <BarChart3 className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-sm font-bold text-[#464554]">Aún no hay gastos registrados.</p>
                <p className="text-xs text-[#767586] max-w-[200px]">Agrega nuevas transacciones y genera un análisis para ver tu distribución.</p>
              </div>
            )}
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
              Ahorro del Último Análisis
            </p>
            <p className="text-xl font-bold text-[#191c1d] font-mono-val my-2">
              ${Math.max(0, ingresoMensual - (historicalReports[0]?.totalGastado || 0)).toLocaleString('en-US')}
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
              ${(report?.entradas?.objetivoPresupuesto ?? userProfile.objetivoPresupuesto).toLocaleString('en-US')}
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
              {report?.entradas?.suscripciones ?? userProfile.suscripciones} Activas
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
              ${(report?.entradas?.fondoEmergencia ?? userProfile.fondoEmergencia).toLocaleString('en-US')}
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
