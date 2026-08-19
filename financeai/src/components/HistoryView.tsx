import React, { useState, useMemo } from 'react';
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
  Activity
} from 'lucide-react';
import { ReporteAnalisis, HealthStatus } from '../types';
import { MASCOTS } from '../assets/mascots';

interface HistoryViewProps {
  analysisHistory: ReporteAnalisis[];
  onOpenAnalysisModal: (report: ReporteAnalisis) => void;
  onNavigateToNewAnalysis: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  analysisHistory,
  onOpenAnalysisModal,
  onNavigateToNewAnalysis,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | HealthStatus>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score-high' | 'score-low'>('newest');

  // Filtered & Sorted list
  const filteredHistory = useMemo(() => {
    return analysisHistory
      .filter((item) => {
        // Status filter
        if (statusFilter !== 'all') {
          const itemStatusNorm = item.estadoSalud === 'Observación' ? 'En observación' : item.estadoSalud;
          const filterNorm = statusFilter === 'Observación' ? 'En observación' : statusFilter;
          if (itemStatusNorm !== filterNorm) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesDate = item.fecha.toLowerCase().includes(q);
          const matchesMsg = item.mensajeMotivador?.toLowerCase().includes(q) || false;
          const matchesStatus = item.estadoSalud.toLowerCase().includes(q);
          return matchesDate || matchesMsg || matchesStatus;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.marcaTiempo - a.marcaTiempo;
        if (sortBy === 'oldest') return a.marcaTiempo - b.marcaTiempo;
        if (sortBy === 'score-high') return b.puntajeSalud - a.puntajeSalud;
        if (sortBy === 'score-low') return a.puntajeSalud - b.puntajeSalud;
        return 0;
      });
  }, [analysisHistory, statusFilter, searchQuery, sortBy]);

  // Statistics calculation
  const stats = useMemo(() => {
    if (analysisHistory.length === 0) return { count: 0, avgScore: 0, avgSpent: 0 };
    const totalScore = analysisHistory.reduce((acc, curr) => acc + curr.puntajeSalud, 0);
    const totalSpent = analysisHistory.reduce((acc, curr) => acc + curr.totalGastado, 0);
    return {
      count: analysisHistory.length,
      avgScore: Math.round(totalScore / analysisHistory.length),
      avgSpent: Math.round(totalSpent / analysisHistory.length),
    };
  }, [analysisHistory]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Saludable':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#10b981]/10 text-[#059669] border border-[#10b981]/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Saludable
          </span>
        );
      case 'En observación':
      case 'Observación':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fd933d]/10 text-[#d97706] border border-[#fd933d]/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            En observación
          </span>
        );
      case 'Riesgo':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ef4444]/10 text-[#dc2626] border border-[#ef4444]/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Riesgo
          </span>
        );
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="history-stats-bar">
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#6063ee]/10 text-[#4648d4] flex items-center justify-center shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#767586] uppercase tracking-wider">
              TOTAL ANÁLISIS
            </p>
            <p className="text-2xl font-extrabold text-[#191c1d] font-display">
              {stats.count} <span className="text-xs font-normal text-[#767586]">registros</span>
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
              {stats.avgScore}% <span className="text-xs font-normal text-[#059669] font-medium">promedio</span>
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
              ${stats.avgSpent.toLocaleString()}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#f8f9fa] border border-[#e1e3e4] text-[#191c1d] placeholder-[#767586] focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/10 transition-all"
          />
        </div>

        {/* Filters and Sorter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-[#f8f9fa] p-1 rounded-xl border border-[#e1e3e4]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-[#4648d4] shadow-xs'
                  : 'text-[#767586] hover:text-[#191c1d]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('Saludable')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'Saludable'
                  ? 'bg-[#10b981] text-white shadow-xs'
                  : 'text-[#767586] hover:text-[#191c1d]'
              }`}
            >
              Saludable
            </button>
            <button
              onClick={() => setStatusFilter('En observación')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'En observación'
                  ? 'bg-[#fd933d] text-white shadow-xs'
                  : 'text-[#767586] hover:text-[#191c1d]'
              }`}
            >
              En observación
            </button>
            <button
              onClick={() => setStatusFilter('Riesgo')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'Riesgo'
                  ? 'bg-[#ef4444] text-white shadow-xs'
                  : 'text-[#767586] hover:text-[#191c1d]'
              }`}
            >
              Riesgo
            </button>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              id="history-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
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
      {filteredHistory.length === 0 ? (
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
              {searchQuery || statusFilter !== 'all'
                ? 'No hay análisis que coincidan con los criterios de búsqueda aplicados.'
                : 'Aún no has generado ningún análisis financiero. ¡Inicia uno nuevo para que la IA evalúe tu perfil!'}
            </p>
          </div>
          {searchQuery || statusFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
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
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              id={`history-card-${item.id}`}
              className="bg-white rounded-2xl p-5 border border-[#e1e3e4] hover:border-[#6063ee]/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#f8f9fa] group-hover:bg-[#e0e7ff]/60 text-[#4648d4] flex flex-col items-center justify-center shrink-0 border border-[#e1e3e4] group-hover:border-[#6063ee]/30 transition-colors">
                  <BarChart2 className="w-5 h-5" />
                  <span className="text-[9px] font-bold mt-0.5">{item.puntajeSalud}%</span>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-sm font-bold text-[#191c1d] font-display flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#767586]" />
                      {item.fecha}
                    </span>
                    {getStatusBadge(item.estadoSalud)}
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
