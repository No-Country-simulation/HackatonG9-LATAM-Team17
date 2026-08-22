import React, { useState, useMemo, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  BarChart2,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Plus,
  ArrowUpDown,
  DollarSign,
  Activity,
  Receipt
} from 'lucide-react';
import { ReporteAnalisis, HealthStatus } from '../types';
import { MASCOTS } from '../assets/mascots';

interface HistoryViewProps {
  analysisHistory: ReporteAnalisis[];
  onOpenAnalysisModal: (report: ReporteAnalisis) => void;
  onNavigateToNewAnalysis: () => void;
  transactions?: import('../types').Transaction[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  analysisHistory,
  onOpenAnalysisModal,
  onNavigateToNewAnalysis,
  transactions = [],
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroPerfil, setFiltroPerfil] = useState<'all' | HealthStatus>('all');
  const [ordenarPor, setOrdenarPor] = useState<'newest' | 'oldest' | 'score-high' | 'score-low'>('newest');

  const [historialLocal, setHistorialLocal] = useState<ReporteAnalisis[]>(analysisHistory);

  // Sincronizar historialLocal cuando App.tsx actualice el prop (ej. análisis nuevo generado en sesión)
  useEffect(() => {
    setHistorialLocal(analysisHistory);
  }, [analysisHistory]);

  // Filtered & Sorted list
  const historialFiltrado = useMemo(() => {
    const mappedTransactions: ReporteAnalisis[] = transactions.map((tx) => ({
      id: tx.id,
      fecha: tx.fecha,
      marcaTiempo: new Date(tx.fecha).getTime(),
      confianzaModelo: 0,
      perfilFinanciero: 'En observación' as HealthStatus,
      mensajeMotivador: 'Transacción: ' + tx.descripcion,
      totalGastado: tx.monto,
      distribucionCategorias: [{
        categoria: tx.categoria,
        monto: tx.monto,
        porcentaje: 100,
        colorHex: '#4648d4'
      }],
      recomendaciones: []
    }));

    const historialCombinado = [...historialLocal, ...mappedTransactions];

    return historialCombinado
      .filter((item) => {
        // Status filter
        if (filtroPerfil !== 'all') {
          if (item.perfilFinanciero !== filtroPerfil) return false;
        }

        // Search query
        if (busqueda.trim()) {
          const q = busqueda.toLowerCase();
          const matchesDate = item.fecha.toLowerCase().includes(q);
          const matchesMsg = item.mensajeMotivador?.toLowerCase().includes(q) || false;
          const matchesStatus = item.perfilFinanciero.toLowerCase().includes(q);
          return matchesDate || matchesMsg || matchesStatus;
        }

        return true;
      })
      .sort((a, b) => {
        if (ordenarPor === 'newest') return b.marcaTiempo - a.marcaTiempo;
        if (ordenarPor === 'oldest') return a.marcaTiempo - b.marcaTiempo;
        if (ordenarPor === 'score-high') return (b.confianzaModelo ?? (b as any).puntajeSalud) - (a.confianzaModelo ?? (a as any).puntajeSalud);
        if (ordenarPor === 'score-low') return (a.confianzaModelo ?? (a as any).puntajeSalud) - (b.confianzaModelo ?? (b as any).puntajeSalud);
        return 0;
      });
  }, [historialLocal, busqueda, filtroPerfil, ordenarPor, transactions]);

  // Statistics calculation
  const estadisticas = useMemo(() => {
    if (historialLocal.length === 0) return { count: 0, avgScore: 0, avgSpent: 0 };
    
    const weights: Record<string, number> = {
      Excelente: 100,
      Saludable: 80,
      Estable: 60,
      'En observación': 40,
      'En riesgo': 20,
      Crítico: 0
    };

    const puntajeTotal = historialLocal.reduce((acc, curr) => acc + (weights[curr.perfilFinanciero ?? (curr as any).estadoSalud] ?? 40), 0);
    const gastoTotal = historialLocal.reduce((acc, curr) => acc + curr.totalGastado, 0);
    return {
      count: historialLocal.length,
      avgScore: Math.round(puntajeTotal / historialLocal.length),
      avgSpent: Math.round(gastoTotal / historialLocal.length),
    };
  }, [historialLocal]);

  const obtenerInsigniaSalud = (status: string) => {
    switch (status) {
      case 'Excelente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#10b981]/20 text-[#047857] border border-[#10b981]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Excelente
          </span>
        );
      case 'Saludable':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#10b981]/10 text-[#059669] border border-[#10b981]/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Saludable
          </span>
        );
      case 'Estable':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3b82f6]/10 text-[#2563eb] border border-[#3b82f6]/20">
            <Activity className="w-3.5 h-3.5" />
            Estable
          </span>
        );
      case 'En observación':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f59e0b]/10 text-[#d97706] border border-[#f59e0b]/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            En observación
          </span>
        );
      case 'En riesgo':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ef4444]/10 text-[#dc2626] border border-[#ef4444]/20">
            <AlertCircle className="w-3.5 h-3.5" />
            En riesgo
          </span>
        );
      case 'Crítico':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#991b1b]/10 text-[#7f1d1d] border border-[#991b1b]/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Crítico
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200" id="history-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="history-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#4648d4]/10 text-[#4648d4] flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <h1 className="text-[26px] md:text-[28px] font-bold text-[#191c1d] tracking-tight font-display">
              Historial de Análisis
            </h1>
          </div>
          <p className="text-xs text-[#767586] font-medium ml-10">
            Consulta el registro histórico y la evolución de todos tus análisis financieros generados por IA.
          </p>
        </div>

        <button
          id="btn-history-new-analysis"
          onClick={onNavigateToNewAnalysis}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#4648d4] hover:bg-[#393bb8] text-white text-xs font-bold rounded-xl shadow-[0_4px_14px_rgba(70,72,212,0.3)] active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nuevo Análisis</span>
        </button>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="history-estadisticas-bar">
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#6063ee]/10 text-[#4648d4] flex items-center justify-center shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#767586] uppercase tracking-wider">
              TOTAL ANÁLISIS
            </p>
            <p className="text-2xl font-extrabold text-[#191c1d] font-display">
              {estadisticas.count} <span className="text-xs font-normal text-[#767586]">registros</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 text-[#059669] flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#767586] uppercase tracking-wider">
              SALUD PROMEDIO
            </p>
            <p className="text-2xl font-extrabold text-[#191c1d] font-display">
              {estadisticas.avgScore}% <span className="text-xs font-normal text-[#059669] font-medium">promedio</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#fd933d]/10 text-[#d97706] flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#767586] uppercase tracking-wider">
              GASTO PROMEDIO
            </p>
            <p className="text-2xl font-extrabold text-[#191c1d] font-mono-val">
              ${estadisticas.avgSpent.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3" id="history-filters">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#767586] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="history-search-input"
            type="text"
            placeholder="Buscar por fecha, estado o mensaje..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#f8f9fa] border border-[#e1e3e4] text-[#191c1d] placeholder-[#767586] focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/10 transition-all"
          />
        </div>

        {/* Filters and Sorter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-[#f8f9fa] p-1 rounded-xl border border-[#e1e3e4] overflow-x-auto max-w-full">
            <button
              onClick={() => setFiltroPerfil('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filtroPerfil === 'all'
                  ? 'bg-white text-[#4648d4] shadow-xs'
                  : 'text-[#767586] hover:text-[#191c1d]'
                }`}
            >Todos</button>
            <button
              onClick={() => setFiltroPerfil('Excelente')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filtroPerfil === 'Excelente'
                  ? 'bg-[#047857] text-white shadow-xs'
                  : 'text-[#767586] hover:text-[#191c1d]'
                }`}
            >Excelente</button>
            <button
              onClick={() => setFiltroPerfil('Saludable')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filtroPerfil === 'Saludable'
                  ? 'bg-[#10b981] text-white shadow-xs'
                  : 'text-[#767586] hover:text-[#191c1d]'
                }`}
            >Saludable</button>
            <button
              onClick={() => setFiltroPerfil('Estable')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filtroPerfil === 'Estable'
                  ? 'bg-[#3b82f6] text-white shadow-xs'
                  : 'text-[#767586] hover:text-[#191c1d]'
                }`}
            >Estable</button>
            <button
              onClick={() => setFiltroPerfil('En observación')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filtroPerfil === 'En observación'
                  ? 'bg-[#f59e0b] text-white shadow-xs'
                  : 'text-[#767586] hover:text-[#191c1d]'
                }`}
            >En observación</button>
            <button
              onClick={() => setFiltroPerfil('En riesgo')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filtroPerfil === 'En riesgo'
                  ? 'bg-[#ef4444] text-white shadow-xs'
                  : 'text-[#767586] hover:text-[#191c1d]'
                }`}
            >En riesgo</button>
            <button
              onClick={() => setFiltroPerfil('Crítico')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filtroPerfil === 'Crítico'
                  ? 'bg-[#991b1b] text-white shadow-xs'
                  : 'text-[#767586] hover:text-[#191c1d]'
                }`}
            >Crítico</button>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              id="history-sort-select"
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value as any)}
              className="py-1.5 pl-3 pr-8 text-xs font-semibold rounded-xl bg-[#f8f9fa] border border-[#e1e3e4] text-[#464554] focus:outline-none focus:border-[#4648d4] cursor-pointer"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="score-high">Mayor puntaje</option>
              <option value="score-low">Menor puntaje</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Items List */}
      {historialFiltrado.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#e1e3e4] text-center space-y-4 shadow-sm" id="history-empty-state">
          <div className="w-24 h-24 mx-auto flex items-center justify-center">
            <img
              src={MASCOTS.happyPotatoCoin}
              alt="Mascot Empty History"
              className="w-full h-full object-contain drop-shadow-xs"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-[#191c1d] font-display">
              No se encontraron registros
            </h3>
            <p className="text-xs text-[#767586] leading-relaxed">
              {busqueda || filtroPerfil !== 'all'
                ? 'No hay análisis que coincidan con los criterios de búsqueda aplicados.'
                : 'Aún no has generado ningún análisis financiero. ¡Inicia uno nuevo para que la IA evalúe tu perfil!'}
            </p>
          </div>
          {busqueda || filtroPerfil !== 'all' ? (
            <button
              onClick={() => {
                setBusqueda('');
                setFiltroPerfil('all');
              }}
              className="px-4 py-2 bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#191c1d] text-xs font-semibold rounded-xl transition-all"
            >
              Limpiar filtros
            </button>
          ) : (
            <button
              onClick={onNavigateToNewAnalysis}
              className="px-5 py-2.5 bg-[#4648d4] hover:bg-[#393bb8] text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Realizar mi primer análisis</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3" id="history-items-grid">
          {historialFiltrado.map((item) => (
            <div
              key={item.id}
              id={`history-card-${item.id}`}
              className="bg-white rounded-2xl p-5 border border-[#e1e3e4] hover:border-[#6063ee]/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#f8f9fa] group-hover:bg-[#e0e7ff]/60 text-[#4648d4] flex flex-col items-center justify-center shrink-0 border border-[#e1e3e4] group-hover:border-[#6063ee]/30 transition-colors">
                  {item.confianzaModelo === 0 ? (
                    <Receipt className="w-5 h-5" />
                  ) : (
                    <>
                      <BarChart2 className="w-4 h-4 mb-0.5" />
                      <span className="text-[8px] font-bold leading-tight text-center">IA:<br/>{item.confianzaModelo}%</span>
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-sm font-bold text-[#191c1d] font-display flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#767586]" />
                      {item.fecha}
                    </span>
                    {obtenerInsigniaSalud(item.perfilFinanciero)}
                    <span className="text-xs font-bold text-[#4648d4] font-mono-val bg-[#e0e7ff]/60 px-2.5 py-0.5 rounded-full">
                      ${item.totalGastado.toLocaleString()} evaluados
                    </span>
                  </div>

                  {item.mensajeMotivador && (
                    <p className="text-xs text-[#464554] font-medium line-clamp-2 leading-relaxed">
                      💡 {item.mensajeMotivador}
                    </p>
                  )}

                  {/* Summary tags */}
                  {item.recomendaciones && item.recomendaciones.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-[#767586]">
                        {item.recomendaciones.length} {item.recomendaciones.length === 1 ? 'recomendación detectada' : 'recomendaciones detectadas'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Action Button */}
              <div className="flex items-center justify-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#f3f4f5]">
                <button
                  id={`btn-open-report-${item.id}`}
                  onClick={() => onOpenAnalysisModal(item)}
                  className="w-full md:w-auto px-4 py-2.5 bg-[#f8f9fa] hover:bg-[#4648d4] text-[#191c1d] hover:text-white border border-[#e1e3e4] hover:border-transparent rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Ver reporte completo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
