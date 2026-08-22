import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { UserProfile, Transaction, CategoriaGasto, FrecuenciaAhorro, ReporteAnalisis } from '../types';
import { MASCOTS } from '../assets/mascots';
import { autoCategorizeDescription } from '../utils/categorizer';
import { sanitizePositiveNumber, preventNegativeKeys, parsePositiveFloat } from '../utils/numberUtils';
import { manejarRespuestaError } from '../utils/apiErrors';
import { normalizarPerfil } from '../utils/mapeadores';
import { getColorForCategory } from '../utils/colorManager';

interface PropsNewAnalysisView {
  userProfile: UserProfile;
  initialTransactions: Transaction[];
  onAnalysisComplete: (newReport: ReporteAnalisis) => void;
}

export const NewAnalysisView: React.FC<PropsNewAnalysisView> = ({
  userProfile,
  initialTransactions,
  onAnalysisComplete,
}) => {
  const navigate = useNavigate();

  // Base Inputs State
  const [ingresoMensual, setIngresoMensual] = useState('');
  const [deudaTotal, setDeudaTotal] = useState('');
  const [frecuenciaAhorro, setFrecuenciaAhorro] = useState<FrecuenciaAhorro>('Mensual');

  // Advanced Inputs State
  const [objetivoPresupuesto, setObjetivoPresupuesto] = useState('');
  const [pagoMensualDeuda, setPagoMensualDeuda] = useState('');
  const [serviciosSuscripcion, setServiciosSuscripcion] = useState('');
  const [fondoEmergencia, setFondoEmergencia] = useState('');
  const [montoInversion, setMontoInversion] = useState('');

  // Inicializar con datos del perfil (ej. provenientes del Onboarding o análisis previo)
  React.useEffect(() => {
    setIngresoMensual(userProfile.ingresoMensual ? String(userProfile.ingresoMensual) : '');
    setDeudaTotal(userProfile.deudaTotal ? String(userProfile.deudaTotal) : '');
    setFrecuenciaAhorro(userProfile.frecuenciaAhorro || 'Mensual');
    setObjetivoPresupuesto(userProfile.objetivoPresupuesto ? String(userProfile.objetivoPresupuesto) : '');
    setPagoMensualDeuda(userProfile.pagoMensualDeuda ? String(userProfile.pagoMensualDeuda) : '');
    setServiciosSuscripcion(userProfile.suscripciones ? String(userProfile.suscripciones) : '');
    setFondoEmergencia(userProfile.fondoEmergencia ? String(userProfile.fondoEmergencia) : '');
    setMontoInversion('');
  }, [userProfile]);

  // Tab State
  const [modoIngreso, setModoIngreso] = useState<'manual' | 'csv'>('manual');

  // Transactions State
  const [listaTransacciones, setListaTransacciones] = useState<Transaction[]>(initialTransactions || []);
  const [descTx, setDescTx] = useState('');
  const [montoTx, setMontoTx] = useState('');
  const [categoriaTx, setCategoriaTx] = useState<CategoriaGasto>('Alimentación');
  const [falloModeloTx, setFalloModeloTx] = useState(false);
  const [sobrescribirTxManual, setSobrescribirTxManual] = useState(false);

  // CSV Drag State
  const [nombreArchivoCsv, setNombreArchivoCsv] = useState<string | null>(null);

  // Loading State
  // Loading State
  const [estaAnalizando, setEstaAnalizando] = useState(false);
  const [errorAnalisis, setErrorAnalisis] = useState<string | null>(null);
  const [estaClasificando, setEstaClasificando] = useState(false);

  const handleDescChange = (text: string) => {
    setDescTx(text);
  };

  const handleAddTx = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!descTx.trim() || !montoTx) return;

    let finalCategory = categoriaTx;
    let failed = falloModeloTx;

    if (!sobrescribirTxManual) {
      setEstaClasificando(true);
      try {
        const payload = {
          descripcion: descTx.trim(),
          valor: parsePositiveFloat(montoTx, 0),
          fecha_transaccion: new Date().toISOString()
        };
        const res = await fetch('/api/v1/finanzas/clasificar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          // Map backend category to CategoriaGasto
          if (data.resumen_gastos && Object.keys(data.resumen_gastos).length > 0) {
            const returnedCat = Object.keys(data.resumen_gastos)[0];
            const validCategories: CategoriaGasto[] = ['Vivienda', 'Alimentación', 'Transporte', 'Servicios', 'Salud', 'Entretenimiento', 'Otros'];
            if (validCategories.includes(returnedCat as CategoriaGasto)) {
              finalCategory = returnedCat as CategoriaGasto;
            } else {
              // Map unknown categories to 'Otros'
              finalCategory = 'Otros';
            }
            failed = false;
          } else {
            failed = true;
          }
        } else {
          failed = true;
        }
      } catch (err) {
        console.error('Error clasificando transacción', err);
        failed = true;
      } finally {
        setEstaClasificando(false);
      }
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      descripcion: descTx.trim(),
      monto: parsePositiveFloat(montoTx, 0),
      categoria: finalCategory,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'gasto',
      autoCategorizado: !sobrescribirTxManual,
      categorizacionFallida: failed,
    };

    setListaTransacciones([newTx, ...listaTransacciones]);
    setDescTx('');
    setMontoTx('');
    setFalloModeloTx(false);
    setSobrescribirTxManual(false);
  };

  const handleUpdateTxCategory = (id: string, newCat: CategoriaGasto) => {
    setListaTransacciones(prev => prev.map(t => t.id === id ? { ...t, categoria: newCat, categorizacionFallida: true } : t));
  };

  const handleRemoveTx = (id: string) => {
    setListaTransacciones(listaTransacciones.filter((t) => t.id !== id));
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNombreArchivoCsv(file.name);
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
          const cat = (parts[2]?.trim() as CategoriaGasto) || 'Alimentación';
          parsed.push({
            id: `csv-${Date.now()}-${idx}`,
            descripcion: desc,
            monto: amt,
            categoria: ['Vivienda', 'Alimentación', 'Transporte', 'Servicios', 'Salud', 'Entretenimiento', 'Otros'].includes(cat) ? cat : 'Otros',
            fecha: new Date().toISOString().split('T')[0],
            tipo: 'gasto',
          });
        }
      });

      if (parsed.length > 0) {
        setListaTransacciones((prev) => [...parsed, ...prev]);
      } else {
        alert('El archivo CSV no contiene transacciones válidas.');
      }
    };
    reader.readAsText(file);
  };

  const manejarGenerarAnalisis = async () => {
    if (listaTransacciones.length === 0) return;

    if (!objetivoPresupuesto || !fondoEmergencia || !montoInversion || !pagoMensualDeuda || !serviciosSuscripcion) {
      setErrorAnalisis('Por favor, completa todos los Indicadores Financieros Avanzados.');
      return;
    }

    setEstaAnalizando(true);
    setErrorAnalisis(null);

    try {
      const ingresoParseado = parseFloat(ingresoMensual) || 0;
      const deudaParseada = parseFloat(deudaTotal) || 0;
      const nivelEndeudamiento = ingresoParseado > 0 ? Math.round((deudaParseada / ingresoParseado) * 100) : 0;

      const payload = {
        ingreso_mensual: ingresoParseado,
        nivel_endeudamiento: nivelEndeudamiento,
        frecuencia_ahorro: frecuenciaAhorro.toLowerCase(),
        monto_inversion: parseFloat(montoInversion) || 0,
        deuda_total: deudaParseada,
        objetivo_presupuesto: parseFloat(objetivoPresupuesto) || 0,
        pago_mensual_deuda: parseFloat(pagoMensualDeuda) || 0,
        servicios_suscripción: parseInt(serviciosSuscripcion, 10) || 0,
        fondo_emergencia: parseFloat(fondoEmergencia) || 0,
        transacciones: listaTransacciones.map(t => ({
          descripcion: t.descripcion,
          valor: t.monto,
          fecha_transaccion: t.fecha + "T00:00:00.000Z"
        }))
      };

      const res = await fetch('/api/v1/finanzas/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await manejarRespuestaError(res);
        throw new Error(errorData.general);
      }

      const data = await res.json().catch(() => ({}));

      // Calculate totalGastado
      const resumenGastos = data.resumen_gastos || {};
      let totalGastado = 0;
      Object.values(resumenGastos).forEach((val: any) => {
        totalGastado += Number(val) || 0;
      });

      // Calculate distribucionCategorias
      const distribucionCategorias = Object.entries(resumenGastos).map(([categoria, monto]) => {
        const montoNum = Number(monto) || 0;
        const porcentaje = totalGastado > 0 ? (montoNum / totalGastado) * 100 : 0;
        return {
          categoria: categoria as any,
          monto: montoNum,
          porcentaje: Math.round(porcentaje),
          colorHex: getColorForCategory(categoria)
        };
      });

      const recsOriginales = Array.isArray(data.recomendaciones) ? data.recomendaciones : [];
      const recomendaciones = recsOriginales.map((texto: string, idx: number) => ({
        id: `rec-${idx}`,
        titulo: texto.length > 60 ? texto.slice(0, 57) + '...' : texto,
        descripcion: texto,
        categoria: 'General',
        impacto: 'Personalizado',
        etiquetaAccion: 'Ver detalles',
        tipoEstado: 'info' as const
      }));

      const report: ReporteAnalisis = {
        id: `an-${Date.now()}`,
        fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        marcaTiempo: Date.now(),
        totalGastado: totalGastado,
        confianzaModelo: Math.round((data.probabilidad || 0) * 100),
        perfilFinanciero: normalizarPerfil(data.perfil_financiero),
        mensajeMotivador: '¡Aquí tienes tu análisis detallado!',
        distribucionCategorias,
        recomendaciones,
        entradas: {
          ingresoMensual: ingresoParseado,
          deudas: deudaParseada,
          frecuenciaAhorro: frecuenciaAhorro,
          objetivoPresupuesto: parseFloat(objetivoPresupuesto) || 0,
          pagoDeuda: parseFloat(pagoMensualDeuda) || 0,
          suscripciones: parseInt(serviciosSuscripcion, 10) || 0,
          fondoEmergencia: parseFloat(fondoEmergencia) || 0,
          cantidadTransacciones: listaTransacciones.length
        }
      };

      onAnalysisComplete(report);
    } catch (err: any) {
      console.error('Error al generar el análisis financiero:', err);
      setErrorAnalisis(err.message || 'Error de conexión. Intenta nuevamente.');
    } finally {
      setEstaAnalizando(false);
    }
  };

  const hasExpenses = listaTransacciones.length > 0;

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
                  value={ingresoMensual}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setIngresoMensual(sanitizePositiveNumber(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4] disabled:opacity-60 disabled:cursor-not-allowed"
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
                  value={deudaTotal}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setDeudaTotal(sanitizePositiveNumber(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4] disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Frecuencia de Ahorro
                </label>
                <div className="relative">
                  <select
                    value={frecuenciaAhorro}
                    onChange={(e) => setFrecuenciaAhorro(e.target.value as FrecuenciaAhorro)}
                    className="w-full appearance-none px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4] pr-8 disabled:opacity-60 disabled:cursor-not-allowed"
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
                  required
                  placeholder="Ej. 3000000"
                  value={objetivoPresupuesto}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setObjetivoPresupuesto(sanitizePositiveNumber(e.target.value))}
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
                  required
                  placeholder="Ej. 350000"
                  value={pagoMensualDeuda}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setPagoMensualDeuda(sanitizePositiveNumber(e.target.value))}
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
                  required
                  placeholder="Ej. 3"
                  value={serviciosSuscripcion}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setServiciosSuscripcion(sanitizePositiveNumber(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Fondo de Emergencia ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  placeholder="Ej. 1500000"
                  value={fondoEmergencia}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setFondoEmergencia(sanitizePositiveNumber(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Monto de Inversión ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  placeholder="Ej. 500000"
                  value={montoInversion}
                  onKeyDown={preventNegativeKeys}
                  onChange={(e) => setMontoInversion(sanitizePositiveNumber(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
                />
              </div>
            </div>
          </div>

          {/* Mode Switcher: Entrada Manual | Carga de CSV */}
          <div className="flex items-center gap-2">
            <button
              id="btn-tab-manual-entry"
              onClick={() => setModoIngreso('manual')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${modoIngreso === 'manual'
                ? 'bg-[#4648d4] text-white shadow-sm'
                : 'bg-white text-[#464554] hover:bg-[#f3f4f5] border border-[#e1e3e4]'
                }`}
            >
              Entrada Manual
            </button>
            <button
              id="btn-tab-csv-entry"
              onClick={() => setModoIngreso('csv')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${modoIngreso === 'csv'
                ? 'bg-[#4648d4] text-white shadow-sm'
                : 'bg-white text-[#464554] hover:bg-[#f3f4f5] border border-[#e1e3e4]'
                }`}
            >
              Carga de CSV
            </button>
          </div>

          {/* Card 3: Agregar Transacción / Carga CSV */}
          {modoIngreso === 'manual' ? (
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
                      value={descTx}
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
                        value={montoTx}
                        onKeyDown={preventNegativeKeys}
                        onChange={(e) => setMontoTx(sanitizePositiveNumber(e.target.value))}
                        className="w-full pl-7 pr-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      id="btn-add-tx-plus"
                      disabled={estaClasificando}
                      className="w-full py-2 bg-[#fd933d] hover:bg-[#e07d2c] text-white rounded-xl font-bold text-sm flex items-center justify-center shadow-sm active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {estaClasificando ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                      )}
                    </button>
                  </div>
                </div>


              </form>

              {/* Transactions List */}
              {listaTransacciones.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-[#767586] uppercase tracking-wider mb-2">
                    Transacciones para este análisis ({listaTransacciones.length})
                  </p>
                  <div className="divide-y divide-[#f3f4f5] max-h-48 overflow-y-auto pr-1">
                    {listaTransacciones.map((tx) => (
                      <div key={tx.id} className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Coins className="w-3.5 h-3.5 text-[#4648d4]" />
                          <div>
                            <p className="text-xs font-semibold text-[#191c1d]">{tx.descripcion}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-[#4648d4] bg-[#e0e7ff] px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                {tx.categoria}
                              </span>
                              {tx.categorizacionFallida && (
                                <span className="text-[9px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-1 rounded">
                                  Manual (Fallo IA)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#191c1d] font-mono-val">
                            ${tx.monto.toLocaleString()}
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
                  {nombreArchivoCsv || 'Haz clic o arrastra tu archivo CSV aquí'}
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
                  Nuestra IA procesará estas {listaTransacciones.length || 3} entradas y actualizará tu perfil financiero.
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
                    {listaTransacciones.length} transacciones listas para procesar
                  </span>
                </div>
              )}

              {errorAnalisis && (
                <div className="p-3 bg-[#ffdad6]/40 border border-[#ffdad6] rounded-xl flex items-center gap-2 text-left mt-2">
                  <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
                  <span className="text-[11px] font-semibold text-[#93000a] leading-snug">
                    {errorAnalisis}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                id="btn-submit-generate-analysis"
                onClick={manejarGenerarAnalisis}
                disabled={!hasExpenses || estaAnalizando}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${!hasExpenses
                  ? 'bg-[#d9dadb] text-[#767586] cursor-not-allowed'
                  : 'bg-[#767586] hover:bg-[#4648d4] text-white active:scale-98 shadow-[0_4px_14px_rgba(70,72,212,0.3)] hover:shadow-md'
                  }`}
              >
                {estaAnalizando ? (
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
