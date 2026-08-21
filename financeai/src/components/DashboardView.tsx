import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  RotateCw,
  Eye,
  Clock,
  Plus,
  Receipt,
  CheckCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Trash2,
  Cpu,
  HelpCircle,
  Check
} from 'lucide-react';
import { ReporteAnalisis, UserProfile, Transaction, ExpenseCategory } from '../types';
import { MASCOTS } from '../assets/mascots';
import { autoCategorizeDescription } from '../utils/categorizer';
import { sanitizePositiveNumber, preventNegativeKeys, parsePositiveFloat } from '../utils/numberUtils';


interface DashboardViewProps {
  report: ReporteAnalisis | null;
  userProfile: UserProfile;
  transactions: Transaction[];
  onAddTransaction: (tx: Partial<Transaction>) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
  onNavigateToNewAnalysis: () => void;
  onOpenAnalysisModal: (report: ReporteAnalisis) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  report,
  userProfile,
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  onNavigateToNewAnalysis,
  onOpenAnalysisModal,
}) => {
  const [showSyncBanner, setShowSyncBanner] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);
  const [descripcionRapida, setDescripcionRapida] = useState('');
  const [valorRapido, setValorRapido] = useState('');
  const [categoriaRapida, setCategoriaRapida] = useState<ExpenseCategory>('Alimentación');
  const [modeloFallo, setModeloFallo] = useState(false);
  const [sobreescrituraManualActiva, setSobreescrituraManualActiva] = useState(false);
  const [pestanaActivaTx, setPestanaActivaTx] = useState<'empty-state' | 'tx-list'>('tx-list');
  const [clasificandoAPI, setClasificandoAPI] = useState(false);
  const [recommendations, setRecommendations] = useState(report?.recomendaciones || []);

  useEffect(() => {
    setRecommendations(report?.recomendaciones || []);
  }, [report]);

  // Timer countdown simulation
  const [countdown, setCountdown] = useState({ hours: 48, minutes: 22, seconds: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time automatic categorization as description changes
  const handleDescriptionChange = (text: string) => {
    setDescripcionRapida(text);
    if (!sobreescrituraManualActiva) {
      const result = autoCategorizeDescription(text);
      setCategoriaRapida(result.category);
      // Model is considered failed if description is non-empty and failed or categorizes to Otros
      if (text.trim().length > 2 && (result.failed || result.category === 'Otros')) {
        setModeloFallo(true);
      } else {
        setModeloFallo(false);
      }
    }
  };

  const handleSyncRetry = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncedSuccess(true);
      setTimeout(() => setShowSyncBanner(false), 2500);
    }, 1200);
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcionRapida || !valorRapido) return;

    // Determine category automatically if not manually overridden
    let finalCategory = categoriaRapida;
    let failedStatus = modeloFallo;

    if (!sobreescrituraManualActiva) {
      setClasificandoAPI(true);
      try {
        const response = await fetch(`/api/v1/finanzas/clasificar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            descripcion: descripcionRapida,
            valor: parsePositiveFloat(valorRapido, 0),
            fecha_transaccion: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error('Error al clasificar transacción');
        }

        const data = await response.json();

        if (data.resumen_gastos && Object.keys(data.resumen_gastos).length > 0) {
          finalCategory = Object.keys(data.resumen_gastos)[0] as ExpenseCategory;
          failedStatus = false;
        } else {
          // Fallback if empty
          const autoRes = autoCategorizeDescription(descripcionRapida);
          finalCategory = autoRes.category;
          failedStatus = autoRes.failed;
        }
      } catch (err) {
        console.error('API classification failed, using local fallback:', err);
        const autoRes = autoCategorizeDescription(descripcionRapida);
        finalCategory = autoRes.category;
        failedStatus = autoRes.failed;
      } finally {
        setClasificandoAPI(false);
      }
    }

    try {
      await onAddTransaction({
        descripcion: descripcionRapida,
        monto: parsePositiveFloat(valorRapido, 0),
        categoria: finalCategory,
        tipo: 'gasto',
        autoCategorizado: !sobreescrituraManualActiva,
        categorizacionFallida: failedStatus,
      });

      setDescripcionRapida('');
      setValorRapido('');
      setSobreescrituraManualActiva(false);
      setModeloFallo(false);
      setPestanaActivaTx('tx-list');
    } catch (e) {
      // Error handled by parent toast
    }
  };

  const handleRemoveClick = async (id: string) => {
    try {
      await onDeleteTransaction(id);
    } catch (e) {
      // Error handled by parent toast
    }
  };

  const toggleRecommendationComplete = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, completada: !rec.completada } : rec))
    );
  };

  const statusBadgeConfig = {
    'Saludable': { text: 'Saludable', bg: 'bg-[#10b981]/15', textCol: 'text-[#10b981]', border: 'border-[#10b981]/30' },
    'En observación': { text: 'En observación', bg: 'bg-[#fd933d]/15', textCol: 'text-[#944a00]', border: 'border-[#fd933d]/30' },
    'Observación': { text: 'Observación', bg: 'bg-[#fd933d]/15', textCol: 'text-[#944a00]', border: 'border-[#fd933d]/30' },
    'Riesgo': { text: 'Riesgo', bg: 'bg-[#ba1a1a]/15', textCol: 'text-[#ba1a1a]', border: 'border-[#ba1a1a]/30' },
  };

  const currentStatus = report ? statusBadgeConfig[report.estadoSalud] || statusBadgeConfig['En observación'] : null;

  return (
    <div className="space-y-7 pb-12 animate-in fade-in duration-200" id="dashboard-view-container">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2" id="dashboard-greeting-header">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#191c1d] tracking-tight font-display">
            Hola, {userProfile.nombre.split(' ')[0]}
          </h1>
          <p className="text-xs font-medium text-[#767586] mt-0.5">
            15 de Octubre, 2024
          </p>
        </div>

        <button
          onClick={onNavigateToNewAnalysis}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-[#4648d4] hover:bg-[#393bb8] text-white text-xs font-semibold rounded-full shadow-[0_4px_12px_rgba(70,72,212,0.25)] transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generar Nuevo Análisis</span>
        </button>
      </div>

      {/* Sync Error / Status Banner */}
      {showSyncBanner && (
        <div
          id="sync-alert-banner"
          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${syncedSuccess
              ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
              : 'bg-[#ffdad6]/40 border-[#ffdad6] text-[#191c1d]'
            }`}
        >
          <div className="flex items-center gap-3">
            {syncedSuccess ? (
              <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
            )}
            <div>
              <p className="text-xs font-semibold leading-tight">
                {syncedSuccess ? '¡Sincronización exitosa!' : 'Error de conexión'}
              </p>
              <p className="text-[11px] text-[#464554] mt-0.5 leading-snug">
                {syncedSuccess
                  ? 'Tus datos financieros están actualizados con tu cuenta.'
                  : 'No pudimos sincronizar tus datos más recientes. Por favor, intenta de nuevo más tarde.'}
              </p>
            </div>
          </div>

          {!syncedSuccess && (
            <button
              id="btn-sync-retry"
              onClick={handleSyncRetry}
              disabled={isSyncing}
              className="px-3.5 py-1.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <RotateCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Conectando...' : 'Reintentar'}</span>
            </button>
          )}
        </div>
      )}

      {/* Top 2 Primary Summary Cards: Financial Profile & Weekly Achievement */}
      {!report ? (
        <div className="bg-white rounded-2xl p-10 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-[#e0e7ff]/50 text-[#4648d4] flex items-center justify-center mb-2">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-[#191c1d] font-display">¡Genera tu primer análisis!</h2>
          <p className="text-sm text-[#767586] max-w-md">La inteligencia artificial necesita que agregues algunas transacciones y generes un análisis para brindarte recomendaciones, puntaje de salud y distribución de gastos.</p>
          <button
            onClick={onNavigateToNewAnalysis}
            className="mt-2 px-6 py-2.5 bg-[#4648d4] hover:bg-[#393bb8] text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            Comenzar ahora
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="dashboard-top-cards">
            {/* Card 1: Perfil Financiero */}
            <div
              id="card-financial-profile"
              className="lg:col-span-12 bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden group hover:border-[#6063ee]/40 transition-all"
            >
              <div className="flex-1 min-w-0 z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold tracking-wider text-[#767586] uppercase">
                      PERFIL FINANCIERO
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentStatus?.bg} ${currentStatus?.textCol} ${currentStatus?.border}`}>
                      <Eye className="w-3 h-3" />
                      {currentStatus?.text}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-[40px] md:text-[44px] font-extrabold text-[#191c1d] tracking-tight font-display leading-none">
                    {report.puntajeSalud}%
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#767586] mt-1">
                  Probabilidad de mejora financiera
                </p>

                <p className="text-xs font-bold text-[#944a00] mt-3 leading-relaxed">
                  <span>{report.mensajeMotivador || '¡Vamos a mejorar tu salud financiera! 💪'}</span>
                </p>
              </div>

              {/* Mascot placement */}
              <div className="self-end sm:self-center shrink-0 w-28 h-28 md:w-32 md:h-32 flex items-center justify-center pointer-events-none transition-transform group-hover:scale-105">
                <img
                  src={MASCOTS.happyPotatoCoin}
                  alt="Mascot Potato Coin"
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(253,147,61,0.25)]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>


          </div>

          {/* Distribución de Gastos (6 Cards Grid) */}
          <div id="section-expense-distribution" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#191c1d] font-display">
                Distribución de Gastos
              </h2>
              <span className="text-xs text-[#767586] font-medium">
                Mes actual
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {report.distribucionCategorias.map((cat) => (
                <div
                  key={cat.categoria}
                  id={`card-cat-${cat.categoria.toLowerCase()}`}
                  className="bg-white rounded-xl p-4 border border-[#e1e3e4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#6063ee]/30 transition-all"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#464554]">
                      {cat.categoria}
                    </p>
                    <p className="text-base font-bold text-[#191c1d] font-mono-val mt-1">
                      ${cat.monto.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-3">
                    {/* Progress bar */}
                    <div className="h-1.5 w-full bg-[#f3f4f5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(8, cat.porcentaje * 2))}%`,
                          backgroundColor: cat.colorHex,
                        }}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-[#767586] text-right mt-1 font-mono-val">
                      {cat.porcentaje}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Empty State / Transactions List Section */}
      <div
        id="section-transactions"
        className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#f3f4f5]">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#4648d4]" />
            <h3 className="text-sm font-bold text-[#191c1d] font-display">
              Registro de Transacciones
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPestanaActivaTx(pestanaActivaTx === 'empty-state' ? 'tx-list' : 'empty-state')}
              className="text-xs font-medium text-[#767586] hover:text-[#4648d4] px-2.5 py-1 rounded-lg hover:bg-[#f3f4f5] transition-colors"
            >
              {pestanaActivaTx === 'empty-state' ? 'Ver transacciones registradas' : 'Ver estado sin vincular'}
            </button>
          </div>
        </div>

        {pestanaActivaTx === 'empty-state' ? (
          /* Empty state exactly matching screenshot */
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-[#f3f4f5] flex items-center justify-center text-[#464554] mb-3">
              <Receipt className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-xs font-bold text-[#191c1d]">
              No hay gastos registrados aún
            </p>
            <p className="text-[11px] text-[#767586] mt-0.5 max-w-sm">
              Tus gastos aparecerán aquí una vez que vincules una cuenta o agregues transacciones manuales.
            </p>
            <button
              onClick={() => setPestanaActivaTx('tx-list')}
              className="mt-4 px-4 py-1.5 bg-[#f3f4f5] hover:bg-[#e1e3e4] text-[#191c1d] rounded-full text-xs font-semibold transition-all"
            >
              Cargar datos locales
            </button>
          </div>
        ) : (
          /* Populated transactions with quick add bar */
          <div className="mt-4 space-y-4">
            {/* Quick Add Inline Form */}
            <form onSubmit={handleQuickAdd} className="bg-[#f8f9fa] p-3 rounded-xl border border-[#e1e3e4] space-y-2.5">
              <div className="flex flex-wrap gap-2.5 items-center">
                <input
                  type="text"
                  placeholder="Descripción del gasto (ej. Supermercado, Alquiler, Gasolina)..."
                  value={descripcionRapida}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  className="flex-1 min-w-[180px] px-3 py-1.5 text-xs bg-white border border-[#e1e3e4] rounded-lg text-[#191c1d] focus:outline-none focus:border-[#4648d4]"
                />
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Monto ($)"
                  value={valorRapido}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setValorRapido(sanitizePositiveNumber(e.target.value))}
                  className="w-24 px-3 py-1.5 text-xs bg-white border border-[#e1e3e4] rounded-lg text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
                />

                {/* Categorization display: Automatic by default, Select only on Model Failure / Override */}
                {(!modeloFallo && !sobreescrituraManualActiva) ? (
                  <div className="flex items-center gap-1.5 bg-[#e0e7ff]/60 border border-[#c7d2fe] px-2.5 py-1.5 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 text-[#4648d4] animate-pulse" />
                    <span className="text-xs font-semibold text-[#4648d4]">
                      {descripcionRapida.trim() ? `IA: ${categoriaRapida}` : 'Categorización automática'}
                    </span>
                    {descripcionRapida.trim() && (
                      <button
                        type="button"
                        onClick={() => setSobreescrituraManualActiva(true)}
                        className="text-[10px] text-[#767586] hover:text-[#ba1a1a] underline ml-1 cursor-pointer"
                        title="Seleccionar manualmente si el modelo falló"
                      >
                        ¿Falló?
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#ba1a1a] bg-[#ffdad6]/60 px-2 py-1 rounded-md border border-[#ffdad6] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Fallo de IA
                    </span>
                    {/* The exact dropdown from user request */}
                    <select
                      value={categoriaRapida}
                      onChange={(e) => setCategoriaRapida(e.target.value as ExpenseCategory)}
                      className="px-3 py-1.5 text-xs bg-white border-2 border-[#4648d4] rounded-lg text-[#191c1d] font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30"
                    >
                      <option value="Vivienda">Vivienda</option>
                      <option value="Alimentación">Alimentación</option>
                      <option value="Transporte">Transporte</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Salud">Salud</option>
                      <option value="Entretenimiento">Entretenimiento</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={clasificandoAPI}
                  className={`px-3.5 py-1.5 ${clasificandoAPI ? 'bg-[#e07d2c] opacity-80' : 'bg-[#fd933d] hover:bg-[#e07d2c]'} text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm shrink-0`}
                >
                  {clasificandoAPI ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Clasificando...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sub-helper notice */}
              <div className="flex items-center justify-between text-[11px] text-[#767586] px-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#4648d4]" />
                  La categorización es automática por IA. La selección manual solo se habilita si el modelo falla.
                </span>
                {(modeloFallo || sobreescrituraManualActiva) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSobreescrituraManualActiva(false);
                      setModeloFallo(false);
                    }}
                    className="text-[#4648d4] hover:underline font-semibold"
                  >
                    Reintentar detección automática
                  </button>
                )}
              </div>
            </form>

            <div className="divide-y divide-[#f3f4f5] max-h-60 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs font-semibold text-[#767586]">No tienes transacciones registradas.</p>
                  <p className="text-[10px] text-[#767586] mt-1">Utiliza el formulario de arriba para agregar tus primeros gastos.</p>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="py-2.5 flex items-center justify-between px-2 hover:bg-[#f8f9fa] rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#4648d4]" />
                      <div>
                        <p className="text-xs font-semibold text-[#191c1d]">{tx.descripcion}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-medium text-[#4648d4] bg-[#e0e7ff]/70 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            {tx.categoria}
                          </span>
                          <span className="text-[10px] text-[#767586]">• {tx.fecha}</span>
                          {tx.categorizacionFallida && (
                            <span className="text-[9px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-1 rounded">
                              Fallo Corregido
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#ba1a1a] font-mono-val">
                        -${tx.monto.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleRemoveClick(tx.id)}
                        className="text-[#767586] hover:text-[#ba1a1a] p-1 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recomendaciones del Experto */}
      {report && (
        <div
          id="section-expert-recommendations"
          className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#fd933d] text-base">💡</span>
              <h3 className="text-sm font-bold text-[#191c1d] font-display">
                Recomendaciones del Experto
              </h3>
            </div>
            <button
              onClick={() => onOpenAnalysisModal(report)}
              className="text-xs font-semibold text-[#4648d4] hover:underline flex items-center gap-1"
            >
              <span>Ver reporte completo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recommendations.map((rec) => {
              const isRed = rec.tipoEstado === 'danger' || rec.titulo.toLowerCase().includes('reduce');
              return (
                <div
                  key={rec.id}
                  id={`rec-item-${rec.id}`}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${isRed
                      ? 'bg-[#ffdad6]/25 border-[#ffdad6] hover:border-[#ba1a1a]/40'
                      : 'bg-[#ffdcc5]/20 border-[#ffdcc5] hover:border-[#fd933d]/40'
                    } ${rec.completada ? 'opacity-50 line-through' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleRecommendationComplete(rec.id)}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${rec.completada
                          ? 'bg-[#10b981] border-[#10b981] text-white'
                          : isRed ? 'border-[#ba1a1a]' : 'border-[#fd933d]'
                        }`}
                    >
                      {rec.completada && <CheckCircle className="w-3 h-3" />}
                    </button>

                    <div>
                      <h4 className="text-xs font-bold text-[#191c1d]">
                        {rec.titulo}
                      </h4>
                      <p className="text-[11px] text-[#464554] mt-0.5">
                        {rec.descripcion}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenAnalysisModal(report)}
                    className={`text-xs font-bold hover:underline transition-colors shrink-0 ${isRed ? 'text-[#4648d4]' : 'text-[#4648d4]'
                      }`}
                  >
                    {rec.etiquetaAccion || 'Ver detalles'}
                  </button>
                </div>
              );
            })}

            {recommendations.length === 0 && (
              <div className="p-3 bg-[#f8f9fa] rounded-xl border border-dashed border-[#e1e3e4] text-center">
                <p className="text-xs text-[#767586] font-medium">
                  No hay recomendaciones nuevas en este momento.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
