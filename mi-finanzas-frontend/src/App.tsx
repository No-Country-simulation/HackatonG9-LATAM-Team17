import React, { useState, useEffect } from 'react';
import { LayoutGrid, BarChart3, History, User, Plus, AlertCircle, X } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './components/DashboardView';
import { NewAnalysisView } from './components/NewAnalysisView';
import { SettingsProfileView } from './components/SettingsProfileView';
import { ReportsView } from './components/ReportsView';
import { HistoryView } from './components/HistoryView';
import { LoginModal } from './components/LoginModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AnalysisDetailModal } from './components/AnalysisDetailModal';
import { Footer } from './components/Footer';
import { UserProfile, Transaction, ReporteAnalisis } from './types';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { manejarRespuestaError } from './utils/apiErrors';
import { mapearItemHistorial } from './utils/mapeadores';

function MainApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  let currentTab = 'tablero';
  if (path === '/reportes') currentTab = 'reportes';
  else if (path === '/historial') currentTab = 'historial';
  else if (path === '/perfil' || path === '/configuracion') currentTab = 'perfil';
  else if (path === '/analisis/nuevo') currentTab = 'nuevo-analisis';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  // Modals State
  const [activeReportModal, setActiveReportModal] = useState<ReporteAnalisis | null>(null);

  const [cargandoAuth, setCargandoAuth] = useState(true);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on login
  useEffect(() => {
    if (userProfile?.email) {
      const stored = localStorage.getItem(`mi-salud-financiera_pending_txs_${userProfile.email}`);
      if (stored) {
        try {
          setTransactions(JSON.parse(stored));
        } catch (e) {
          console.error('Error al parsear transacciones de localStorage', e);
        }
      }
    }
  }, [userProfile?.email]);

  // Save transactions to localStorage on change
  useEffect(() => {
    if (userProfile?.email) {
      localStorage.setItem(`mi-salud-financiera_pending_txs_${userProfile.email}`, JSON.stringify(transactions));
    }
  }, [transactions, userProfile?.email]);

  // Current Report State
  const [currentReport, setCurrentReport] = useState<ReporteAnalisis | null>(null);

  // History State
  const [analysisHistory, setAnalysisHistory] = useState<ReporteAnalisis[]>([]);
  const [showSuccessSync, setShowSuccessSync] = useState(false);

  // Initial Data Fetch — scoped al usuario autenticado activo
  useEffect(() => {
    if (!userProfile?.id) {
      setAnalysisHistory([]);
      setCurrentReport(null);
      setCargandoAuth(false);
      return;
    }

    const fetchConManejo = async (url: string) => {
      const res = await fetch(url);
      if (res.status === 401) {
        setUserProfile(null);
        setTransactions([]);
        setAnalysisHistory([]);
        throw new Error('401_UNAUTHORIZED');
      }
      if (!res.ok) {
        const errorInfo = await manejarRespuestaError(res);
        throw new Error(errorInfo.general);
      }
      return res.json();
    };

    Promise.all([
      fetchConManejo(`/api/v1/finanzas/historial/${userProfile.id}`).then(data => {
        const items = data?.content ?? (Array.isArray(data) ? data : []);
        if (items.length > 0) {
          const historialMapeado = items.map(mapearItemHistorial);
          setAnalysisHistory(historialMapeado);
          setCurrentReport(historialMapeado[0]);
        } else {
          setAnalysisHistory([]);
          setCurrentReport(null);
        }
      })
    ]).then(() => {
      setCargandoAuth(false);
    }).catch(e => {
      if (e.message !== '401_UNAUTHORIZED') {
         setErrorGlobal(e.message || 'Error de conexión al cargar datos iniciales');
      }
      setCargandoAuth(false);
    });
  }, [userProfile?.id]);

  // Handlers
  const handleAddTransaction = async (newTx: Partial<Transaction>) => {
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      descripcion: newTx.descripcion || 'Gasto manual',
      monto: newTx.monto || 0,
      categoria: newTx.categoria || 'Otros',
      fecha: new Date().toISOString().split('T')[0],
      tipo: newTx.tipo || 'gasto',
      autoCategorizado: newTx.autoCategorizado !== undefined ? newTx.autoCategorizado : true,
      categorizacionFallida: newTx.categorizacionFallida || false,
    };

    setTransactions([tx, ...transactions]);

    // La creación se mantiene únicamente en memoria (estado de React).
  };

  const handleDeleteTransaction = async (id: string) => {
    const txToDelete = transactions.find(t => t.id === id);
    setTransactions(transactions.filter((t) => t.id !== id));
    
    // El borrado se mantiene únicamente en memoria (estado de React).
  };

  const handleUpdateProfile = async (updated: Partial<UserProfile>, localOnly: boolean = false) => {
    if (!userProfile) return;
    const oldProfile = userProfile;
    setUserProfile((prev) => prev ? ({ ...prev, ...updated }) : prev);
    
    // Si solo actualizamos métricas financieras locales o no hay nombre/email, no enviar al backend
    if (localOnly || (!updated.nombre && !updated.email)) return;
    
    const payload: Partial<UserProfile> = {};
    if (updated.nombre) payload.nombre = updated.nombre;
    if (updated.email) payload.email = updated.email;

    try {
      const res = await fetch(`/api/v1/auth/usuarios/${oldProfile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await manejarRespuestaError(res);
        throw new Error(err.general);
      }
    } catch (e: any) {
      setErrorGlobal(e.message || 'Error al actualizar el perfil en la base de datos');
      setUserProfile(oldProfile); // Rollback visual
      throw e;
    }
  };

  const handleNewAnalysisComplete = (newReport: ReporteAnalisis) => {
    setCurrentReport(newReport);
    setAnalysisHistory([newReport, ...analysisHistory]);
    setTransactions([]); // Vacia el "carrito" de transacciones
    
    if (newReport.entradas?.pagoDeuda && userProfile) {
      const currentDebt = userProfile.deudaTotal || 0;
      const payment = newReport.entradas.pagoDeuda;
      if (payment > 0) {
        const newDebt = Math.max(0, currentDebt - payment);
        handleUpdateProfile({ deudaTotal: newDebt }, true);
      }
    }

    navigate('/');
    setActiveReportModal(newReport);
    
    setShowSuccessSync(true);
    setTimeout(() => {
      setShowSuccessSync(false);
    }, 3000);
  };

  const handleLoginSuccess = (nombre: string, email: string, id?: number) => {
    setUserProfile((prev) => prev ? ({ ...prev, nombre, email, id }) : { id, nombre, email, ingresoMensual: 0, deudaTotal: 0, pagoMensualDeuda: 0, frecuenciaAhorro: 'Mensual', fondoEmergencia: 0, objetivoPresupuesto: 0, suscripciones: 0, ratioDeuda: 0 });
  };

  const handleDeleteAccount = async () => {
    // La eliminación en el backend ya fue procesada exitosamente en SettingsProfileView
    setUserProfile(null);
    setTransactions([]);
    setAnalysisHistory([]);
    navigate('/login');
  };


  if (cargandoAuth) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-700">
          <div className="w-12 h-12 border-4 border-[#4648d4] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#4648d4] font-bold text-sm">Validando sesión...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    if (location.pathname !== '/login') {
      return <Navigate to="/login" replace />;
    }
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <LoginModal
          isOpen={true}
          onClose={() => {}}
          onLoginSuccess={(nombre, email, id) => {
            handleLoginSuccess(nombre, email, id);
            navigate('/');
          }}
        />
      </div>
    );
  }

  const necesitaOnboarding = Boolean(userProfile && (!userProfile.ingresoMensual || userProfile.ingresoMensual <= 0));

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex text-[#191c1d] font-sans antialiased selection:bg-[#4648d4]/20 selection:text-[#4648d4]">
      {errorGlobal && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 shadow-lg flex items-start gap-3 max-w-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">{errorGlobal}</div>
            <button onClick={() => setErrorGlobal(null)} className="text-red-500 hover:text-red-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Sidebar
        onOpenLogin={() => setUserProfile(null)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <OnboardingModal
        isOpen={necesitaOnboarding}
        onComplete={(datos) => {
          handleUpdateProfile({
            ingresoMensual: datos.ingresoMensual,
            deudaTotal: datos.deudaTotal,
            frecuenciaAhorro: datos.frecuenciaAhorro,
          }, true);
          navigate('/analisis/nuevo');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar
          userProfile={userProfile}
          onOpenLogin={() => setUserProfile(null)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={
              <DashboardView
                report={currentReport}
                userProfile={userProfile}
                transactions={transactions}
                analysisHistory={analysisHistory}
                globalError={errorGlobal}
                showSuccessSync={showSuccessSync}
                onAddTransaction={handleAddTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                onNavigateToNewAnalysis={() => navigate('/analisis/nuevo')}
                onOpenAnalysisModal={setActiveReportModal}
              />
            } />
            <Route path="/analisis/nuevo" element={
              <NewAnalysisView
                userProfile={userProfile}
                initialTransactions={transactions}
                onAnalysisComplete={handleNewAnalysisComplete}
              />
            } />
            <Route path="/reportes" element={
              <ReportsView
                report={currentReport}
                userProfile={userProfile}
                analysisHistory={analysisHistory}
                onOpenAnalysisModal={setActiveReportModal}
              />
            } />
            <Route path="/historial" element={
              <HistoryView
                analysisHistory={analysisHistory}
                transactions={transactions}
                onOpenAnalysisModal={setActiveReportModal}
                onNavigateToNewAnalysis={() => navigate('/analisis/nuevo')}
              />
            } />
            <Route path="/perfil" element={
              <SettingsProfileView
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                onDeleteAccount={handleDeleteAccount}
              />
            } />
            <Route path="/configuracion" element={
              <SettingsProfileView
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                onDeleteAccount={handleDeleteAccount}
              />
            } />
          </Routes>
        </main>

        {/* Global Footer */}
        <div className="hidden md:block">
          <Footer />
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav 
          id="mobile-bottom-nav" 
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#e1e3e4] px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
        >
          <button
            id="mobile-nav-tablero"
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'tablero' ? 'text-[#4648d4] font-bold' : 'text-[#767586] hover:text-[#191c1d]'
            }`}
          >
            <LayoutGrid className={`w-4 h-4 ${currentTab === 'tablero' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">Panel</span>
          </button>

          <button
            id="mobile-nav-reportes"
            onClick={() => navigate('/reportes')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'reportes' ? 'text-[#4648d4] font-bold' : 'text-[#767586] hover:text-[#191c1d]'
            }`}
          >
            <BarChart3 className={`w-4 h-4 ${currentTab === 'reportes' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">Informes</span>
          </button>

          {/* Quick Action Center Button */}
          <button
            id="mobile-nav-new-analysis"
            onClick={() => navigate('/analisis/nuevo')}
            className="flex flex-col items-center justify-center -mt-4 bg-[#4648d4] text-white w-11 h-11 rounded-full shadow-[0_4px_16px_rgba(70,72,212,0.4)] active:scale-95 transition-transform"
            title="Nuevo Análisis"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            id="mobile-nav-historial"
            onClick={() => navigate('/historial')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'historial' ? 'text-[#4648d4] font-bold' : 'text-[#767586] hover:text-[#191c1d]'
            }`}
          >
            <History className={`w-4 h-4 ${currentTab === 'historial' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">Historial</span>
          </button>

          <button
            id="mobile-nav-perfil"
            onClick={() => navigate('/perfil')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'perfil' || currentTab === 'configuracion' ? 'text-[#4648d4] font-bold' : 'text-[#767586] hover:text-[#191c1d]'
            }`}
          >
            <User className={`w-4 h-4 ${currentTab === 'perfil' || currentTab === 'configuracion' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">Perfil</span>
          </button>
        </nav>
      </div>

      {/* Analysis Details Modal */}
      <AnalysisDetailModal
        reporte={activeReportModal}
        alCerrar={() => setActiveReportModal(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
