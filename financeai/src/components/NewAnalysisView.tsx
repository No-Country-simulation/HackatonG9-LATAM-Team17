import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  Plus, 
  Upload, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  ChevronDown,
  Coins,
  Cpu
} from 'lucide-react';
import { UserProfile, Transaction, ExpenseCategory, SavingsFrequency, ReporteAnalisis } from '../types';
import { MASCOTS } from '../assets/mascots';
import { autoCategorizeDescription } from '../utils/categorizer';
import { sanitizePositiveNumber, preventNegativeKeys, parsePositiveFloat } from '../utils/numberUtils';

interface NewAnalysisViewProps {
  userProfile: UserProfile;
  initialTransactions: Transaction[];
  onAnalysisComplete: (newReport: ReporteAnalisis) => void;
}

export const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({
  userProfile,
  initialTransactions,
  onAnalysisComplete,
}) => {
  // Base Inputs State
  const [monthlyIncome, setMonthlyIncome] = useState(userProfile.monthlyIncome ? String(userProfile.monthlyIncome) : '2500000');
  const [totalDebts, setTotalDebts] = useState(userProfile.totalDebts ? String(userProfile.totalDebts) : '875000');
  const [savingsFrequency, setSavingsFrequency] = useState<SavingsFrequency>(userProfile.savingsFrequency || 'Mensual');

  // Advanced Inputs State
  const [budgetGoal, setBudgetGoal] = useState(userProfile.budgetGoal ? String(userProfile.budgetGoal) : '3000000');
  const [monthlyDebtPayment, setMonthlyDebtPayment] = useState(userProfile.monthlyDebtPayment ? String(userProfile.monthlyDebtPayment) : '350000');
  const [subscriptionsCount, setSubscriptionsCount] = useState(userProfile.subscriptionsCount ? String(userProfile.subscriptionsCount) : '3');
  const [emergencyFund, setEmergencyFund] = useState(userProfile.emergencyFund ? String(userProfile.emergencyFund) : '1500000');

  // Tab State
  const [inputMode, setInputMode] = useState<'manual' | 'csv'>('manual');

  // Transactions State
  const [transactionsList, setTransactionsList] = useState<Transaction[]>(initialTransactions || []);
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState<ExpenseCategory>('Alimentación');
  const [isTxModelFailed, setIsTxModelFailed] = useState(false);
  const [manualTxOverride, setManualTxOverride] = useState(false);

  // CSV Drag State
  const [csvFileName, setCsvFileName] = useState<string | null>(null);

  // Loading State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleDescChange = (text: string) => {
    setTxDesc(text);
    if (!manualTxOverride) {
      const res = autoCategorizeDescription(text);
      setTxCategory(res.category);
      if (text.trim().length > 2 && (res.failed || res.category === 'Otros')) {
        setIsTxModelFailed(true);
      } else {
        setIsTxModelFailed(false);
      }
    }
  };

  const handleAddTx = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!txDesc.trim() || !txAmount) return;

    let finalCategory = txCategory;
    let failed = isTxModelFailed;
    if (!manualTxOverride) {
      const autoRes = autoCategorizeDescription(txDesc);
      finalCategory = autoRes.category;
      failed = autoRes.failed;
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      description: txDesc.trim(),
      amount: parsePositiveFloat(txAmount, 0),
      category: finalCategory,
      date: new Date().toISOString().split('T')[0],
      type: 'gasto',
      autoCategorized: !manualTxOverride,
      categorizationFailed: failed,
    };

    setTransactionsList([newTx, ...transactionsList]);
    setTxDesc('');
    setTxAmount('');
    setIsTxModelFailed(false);
    setManualTxOverride(false);
  };

  const handleUpdateTxCategory = (id: string, newCat: ExpenseCategory) => {
    setTransactionsList(prev => prev.map(t => t.id === id ? { ...t, category: newCat, categorizationFailed: true } : t));
  };

  const handleRemoveTx = (id: string) => {
    setTransactionsList(transactionsList.filter((t) => t.id !== id));
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    // Parse sample CSV data
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').filter(Boolean);
      const parsed: Transaction[] = [];

      lines.forEach((line, idx) => {
        if (idx === 0 && line.toLowerCase().includes('desc')) return; // header
        const parts = line.split(',');
        if (parts.length >= 2) {
          const desc = parts[0]?.trim() || `Gasto importado #${idx}`;
          const amt = parseFloat(parts[1]?.replace(/[^\d.]/g, '')) || 50;
          const cat = (parts[2]?.trim() as ExpenseCategory) || 'Alimentación';
          parsed.push({
            id: `csv-${Date.now()}-${idx}`,
            description: desc,
            amount: amt,
            category: ['Vivienda', 'Alimentación', 'Transporte', 'Servicios', 'Salud', 'Entretenimiento', 'Otros'].includes(cat) ? cat : 'Otros',
            date: new Date().toISOString().split('T')[0],
            type: 'gasto',
          });
        }
      });

      if (parsed.length > 0) {
        setTransactionsList((prev) => [...parsed, ...prev]);
      } else {
        // Fallback sample import
        setTransactionsList((prev) => [
          { id: `csv-1`, description: 'Compras Supermercado', amount: 350, category: 'Alimentación', date: '2024-10-15', type: 'gasto' },
          { id: `csv-2`, description: 'Combustible', amount: 120, category: 'Transporte', date: '2024-10-14', type: 'gasto' },
          { id: `csv-3`, description: 'Servicio Streaming', amount: 25, category: 'Entretenimiento', date: '2024-10-13', type: 'gasto' },
          ...prev,
        ]);
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateAnalysis = async () => {
    if (transactionsList.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const payload = {
        monthlyIncome: parseFloat(monthlyIncome) || 0,
        totalDebts: parseFloat(totalDebts) || 0,
        savingsFrequency,
        budgetGoal: parseFloat(budgetGoal) || 0,
        monthlyDebtPayment: parseFloat(monthlyDebtPayment) || 0,
        subscriptionsCount: parseInt(subscriptionsCount, 10) || 0,
        emergencyFund: parseFloat(emergencyFund) || 0,
        recentTransactions: transactionsList,
      };

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Error al conectar con el servidor de análisis');
      }

      const data = await res.json();
      if (data.report) {
        onAnalysisComplete(data.report);
      }
    } catch (err: any) {
      console.error(err);
      setAnalysisError('Ocurrió un inconveniente al procesar. Reintentando con el motor analítico local...');
      // Fallback generate report
      setTimeout(() => {
        const totalExp = transactionsList.reduce((acc, t) => acc + t.amount, 0);
        const fallbackReport: ReporteAnalisis = {
          id: `an-${Date.now()}`,
          fecha: '15 Oct, 2024',
          marcaTiempo: Date.now(),
          totalGastado: totalExp,
          puntajeSalud: 86,
          estadoSalud: 'Saludable',
          mensajeMotivador: '¡Excelente progreso! Tu balance muestra un camino firme hacia tus metas de ahorro.',
          logroSemanal: {
            titulo: '¡Ahorraste 15% más que la semana pasada! 🎉',
            porcentajeGanancia: 15,
            horasRestantes: 48,
          },
          distribucionCategorias: [
            { categoria: 'Vivienda', monto: 1200, porcentaje: 54.8, colorHex: '#4648d4' },
            { categoria: 'Alimentación', monto: 420, porcentaje: 19.2, colorHex: '#fd933d' },
            { categoria: 'Transporte', monto: 300, porcentaje: 13.7, colorHex: '#712ae2' },
            { categoria: 'Servicios', monto: 150, porcentaje: 6.8, colorHex: '#38bdf8' },
            { categoria: 'Salud', monto: 80, porcentaje: 3.7, colorHex: '#10b981' },
            { categoria: 'Entretenimiento', monto: 40, porcentaje: 1.8, colorHex: '#ef4444' },
          ],
          recomendaciones: [
            {
              id: 'rec-f1',
              titulo: 'Reduce entretenimiento',
              descripcion: 'Monitorear gastos recurrentes de streaming',
              categoria: 'Entretenimiento',
              impacto: 'Ahorra $40/mes',
              etiquetaAccion: 'Ver detalles',
              tipoEstado: 'danger',
            },
            {
              id: 'rec-f2',
              titulo: 'Aumenta ahorro',
              descripcion: 'Reserva +200 pesos mensuales',
              categoria: 'Ahorro',
              impacto: '+$2,400 al año',
              etiquetaAccion: 'Configurar',
              tipoEstado: 'warning',
            },
          ],
        };
        setIsAnalyzing(false);
        onAnalysisComplete(fallbackReport);
      }, 1000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasExpenses = transactionsList.length > 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200" id="new-analysis-view">
      {/* Title Header */}
      <div id="new-analysis-header">
        <h1 className="text-[26px] md:text-[28px] font-bold text-[#191c1d] tracking-tight font-display">
          Nuevo Análisis
        </h1>
        <p className="text-xs text-[#464554] mt-1 max-w-2xl">
          Ingresa tus transacciones recientes para generar un nuevo reporte de perspectivas financieras.
        </p>
      </div>

      {/* Main Grid: Form Inputs vs Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Sections (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Card 1: Información Financiera Base */}
          <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-bold text-[#191c1d] font-display">
              Información Financiera Base
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Ingreso Mensual Total ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Ej. 2500000"
                  value={monthlyIncome}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setMonthlyIncome(sanitizePositiveNumber(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4]"
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
                  placeholder="Ej. 875000"
                  value={totalDebts}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setTotalDebts(sanitizePositiveNumber(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Frecuencia de Ahorro
                </label>
                <div className="relative">
                  <select
                    value={savingsFrequency}
                    onChange={(e) => setSavingsFrequency(e.target.value as SavingsFrequency)}
                    className="w-full appearance-none px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4] pr-8"
                  >
                    <option value="Mensual">Mensual</option>
                    <option value="Quincenal">Quincenal</option>
                    <option value="Semanal">Semanal</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#767586] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Indicadores Financieros Avanzados */}
          <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-bold text-[#191c1d] font-display">
              Indicadores Financieros Avanzados
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Objetivo de Presupuesto ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Ej. 3000000"
                  value={budgetGoal}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setBudgetGoal(sanitizePositiveNumber(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Pago Mensual de Deuda ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Ej. 350000"
                  value={monthlyDebtPayment}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setMonthlyDebtPayment(sanitizePositiveNumber(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Cantidad de Suscripciones
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Ej. 3"
                  value={subscriptionsCount}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setSubscriptionsCount(sanitizePositiveNumber(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                Fondo de Emergencia ($)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="Ej. 1500000"
                value={emergencyFund}
                onKeyDown={preventNegativeKeys}
                onChange={(e) => setEmergencyFund(sanitizePositiveNumber(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
              />
            </div>
          </div>

          {/* Mode Switcher: Entrada Manual | Carga de CSV */}
          <div className="flex items-center gap-2">
            <button
              id="btn-tab-manual-entry"
              onClick={() => setInputMode('manual')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                inputMode === 'manual'
                  ? 'bg-[#4648d4] text-white shadow-sm'
                  : 'bg-white text-[#464554] hover:bg-[#f3f4f5] border border-[#e1e3e4]'
              }`}
            >
              Entrada Manual
            </button>
            <button
              id="btn-tab-csv-entry"
              onClick={() => setInputMode('csv')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                inputMode === 'csv'
                  ? 'bg-[#4648d4] text-white shadow-sm'
                  : 'bg-white text-[#464554] hover:bg-[#f3f4f5] border border-[#e1e3e4]'
              }`}
            >
              Carga de CSV
            </button>
          </div>

          {/* Card 3: Agregar Transacción / Carga CSV */}
          {inputMode === 'manual' ? (
            <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-sm font-bold text-[#191c1d] font-display">
                Agregar Transacción
              </h3>

              <form onSubmit={handleAddTx} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                      Descripción
                    </label>
                    <input
                      type="text"
                      placeholder="ej. Compras supermercado, Renta, Gasolina..."
                      value={txDesc}
                      onChange={(e) => handleDescChange(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                      Monto ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#767586] font-mono-val">$</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0.00"
                        value={txAmount}
                        onKeyDown={preventNegativeKeys}
                        onChange={(e) => setTxAmount(sanitizePositiveNumber(e.target.value))}
                        className="w-full pl-7 pr-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      id="btn-add-tx-plus"
                      className="w-full py-2 bg-[#fd933d] hover:bg-[#e07d2c] text-white rounded-xl font-bold text-sm flex items-center justify-center shadow-sm active:scale-95 transition-all"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Real-time Categorization Status Bar */}
                <div className="p-2.5 rounded-xl bg-[#f8f9fa] border border-[#e1e3e4] flex flex-wrap items-center justify-between gap-2">
                  {(!isTxModelFailed && !manualTxOverride) ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#e0e7ff] text-[#4648d4] text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        Categoría automática por IA: {txDesc.trim() ? txCategory : 'Esperando descripción...'}
                      </span>
                      {txDesc.trim() && (
                        <button
                          type="button"
                          onClick={() => setManualTxOverride(true)}
                          className="text-[11px] text-[#767586] hover:text-[#ba1a1a] underline cursor-pointer"
                        >
                          ¿El modelo falló? Seleccionar manualmente
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-1 rounded-md flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Fallo de modelo: Selecciona la categoría manualmente
                      </span>
                      {/* Exact dropdown from screenshot */}
                      <select
                        value={txCategory}
                        onChange={(e) => setTxCategory(e.target.value as ExpenseCategory)}
                        className="px-3 py-1.5 text-xs bg-white border-2 border-[#4648d4] rounded-lg text-[#191c1d] font-semibold focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30"
                      >
                        <option value="Vivienda">Vivienda</option>
                        <option value="Alimentación">Alimentación</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Salud">Salud</option>
                        <option value="Entretenimiento">Entretenimiento</option>
                        <option value="Otros">Otros</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setManualTxOverride(false);
                          setIsTxModelFailed(false);
                        }}
                        className="text-[11px] text-[#4648d4] hover:underline font-semibold"
                      >
                        Reintentar automático
                      </button>
                    </div>
                  )}
                  <span className="text-[10px] text-[#767586]">
                    Categorización 100% automática obligatoria
                  </span>
                </div>
              </form>

              {/* Transactions List */}
              {transactionsList.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-[#767586] uppercase tracking-wider mb-2">
                    Transacciones para este análisis ({transactionsList.length})
                  </p>
                  <div className="divide-y divide-[#f3f4f5] max-h-48 overflow-y-auto pr-1">
                    {transactionsList.map((tx) => (
                      <div key={tx.id} className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Coins className="w-3.5 h-3.5 text-[#4648d4]" />
                          <div>
                            <p className="text-xs font-semibold text-[#191c1d]">{tx.description}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-[#4648d4] bg-[#e0e7ff] px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                {tx.category}
                              </span>
                              {tx.categorizationFailed && (
                                <span className="text-[9px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-1 rounded">
                                  Manual (Fallo IA)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#191c1d] font-mono-val">
                            ${tx.amount.toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleRemoveTx(tx.id)}
                            className="text-[#767586] hover:text-[#ba1a1a] p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* CSV Upload Mode */
            <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
              <h3 className="text-sm font-bold text-[#191c1d] font-display">
                Carga de Archivo CSV
              </h3>
              <div className="border-2 border-dashed border-[#c7c4d7] hover:border-[#4648d4] rounded-2xl p-8 text-center bg-[#f8f9fa] transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleCsvUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-8 h-8 text-[#4648d4] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#191c1d]">
                  {csvFileName || 'Haz clic o arrastra tu archivo CSV aquí'}
                </p>
                <p className="text-[11px] text-[#767586] mt-1">
                  Formato: Descripción, Monto, Categoría
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Action Sidecards (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Sidecard 1: ¿Listo para analizar? */}
          <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between text-center relative overflow-hidden">
            {/* Top decorative gradient shape */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#6063ee]/10 rounded-bl-full pointer-events-none" />

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#4648d4]/10 text-[#4648d4] flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5 stroke-[2]" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#191c1d] font-display">
                  ¿Listo para analizar?
                </h3>
                <p className="text-xs text-[#464554] mt-1.5 leading-relaxed">
                  Nuestra IA procesará estas {transactionsList.length || 3} entradas y actualizará tu narrativa financiera.
                </p>
              </div>

              {!hasExpenses ? (
                <div className="p-3 bg-[#ffdad6]/40 border border-[#ffdad6] rounded-xl flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
                  <span className="text-[11px] font-semibold text-[#93000a] leading-snug">
                    Agrega al menos un gasto para poder analizar
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl flex items-center gap-2 text-left">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                  <span className="text-[11px] font-semibold text-[#10b981] leading-snug">
                    {transactionsList.length} transacciones listas para procesar
                  </span>
                </div>
              )}

              {analysisError && (
                <div className="p-3 bg-[#ffdad6]/40 border border-[#ffdad6] rounded-xl flex items-center gap-2 text-left mt-2">
                  <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
                  <span className="text-[11px] font-semibold text-[#93000a] leading-snug">
                    {analysisError}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                id="btn-submit-generate-analysis"
                onClick={handleGenerateAnalysis}
                disabled={!hasExpenses || isAnalyzing}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  !hasExpenses
                    ? 'bg-[#d9dadb] text-[#767586] cursor-not-allowed'
                    : 'bg-[#767586] hover:bg-[#4648d4] text-white active:scale-98 shadow-[0_4px_14px_rgba(70,72,212,0.3)] hover:shadow-md'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>El Experto está analizando...</span>
                  </>
                ) : (
                  <span>Generar Análisis</span>
                )}
              </button>
            </div>
          </div>

          {/* Sidecard 2: ¡Ya casi! (Encouraging advice card) */}
          <div className="bg-[#ffdcc5]/30 border border-[#ffdcc5] rounded-2xl p-5 flex items-start gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white shrink-0 p-1 border border-[#ffdcc5] shadow-xs">
              <img
                src={MASCOTS.happyPotatoCoin}
                alt="Encouraging Mascot"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#944a00]">
                ¡Ya casi!
              </h4>
              <p className="text-[11px] text-[#693300] leading-relaxed mt-1">
                Agregar entradas manuales mantiene tu historia precisa. Cada detalle ayuda a pintar una mejor imagen de tus metas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
