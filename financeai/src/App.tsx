import React, { useState, useEffect } from 'react';
import { LayoutGrid, BarChart3, History, User, Plus } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './components/DashboardView';
import { NewAnalysisView } from './components/NewAnalysisView';
import { SettingsProfileView } from './components/SettingsProfileView';
import { ReportsView } from './components/ReportsView';
import { HistoryView } from './components/HistoryView';
import { LoginModal } from './components/LoginModal';
import { AnalysisDetailModal } from './components/AnalysisDetailModal';
import { Footer } from './components/Footer';
import { NavigationTab, TopSubTab, UserProfile, Transaction, ReporteAnalisis } from './types';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('tablero');
  const [activeSubTab, setActiveSubTab] = useState<TopSubTab>('Análisis');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeReportModal, setActiveReportModal] = useState<ReporteAnalisis | null>(null);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Doe',
    email: 'alex@example.com',
    monthlyIncome: 5200,
    totalDebts: 875000,
    monthlyDebtPayment: 350000,
    savingsFrequency: 'Mensual',
    emergencyFund: 1500000,
    budgetGoal: 3000000,
    subscriptionsCount: 3,
    debtRatio: 35,
  });

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx-1', description: 'Alquiler de departamento', amount: 1200, category: 'Vivienda', date: '2024-10-14', type: 'gasto' },
    { id: 'tx-2', description: 'Supermercado semanal', amount: 420, category: 'Alimentación', date: '2024-10-13', type: 'gasto' },
    { id: 'tx-3', description: 'Gasolina y transporte público', amount: 300, category: 'Transporte', date: '2024-10-12', type: 'gasto' },
    { id: 'tx-4', description: 'Luz, agua e internet fibra', amount: 150, category: 'Servicios', date: '2024-10-10', type: 'gasto' },
    { id: 'tx-5', description: 'Farmacia y vitaminas', amount: 80, category: 'Salud', date: '2024-10-09', type: 'gasto' },
    { id: 'tx-6', description: 'Suscripciones streaming y cine', amount: 40, category: 'Entretenimiento', date: '2024-10-08', type: 'gasto' },
  ]);

  // Current Report State
  const [currentReport, setCurrentReport] = useState<ReporteAnalisis>({
    id: 'an-init',
    fecha: '15 Oct, 2024',
    marcaTiempo: Date.now(),
    totalGastado: 2190,
    puntajeSalud: 82,
    estadoSalud: 'En observación',
    mensajeMotivador: '¡Vamos a mejorar tu salud financiera! 💪',
    logroSemanal: {
      titulo: '¡Ahorraste 15% más que la semana pasada! 🎉',
      porcentajeGanancia: 15,
      horasRestantes: 48,
    },
    distribucionCategorias: [
      { categoria: 'Vivienda', monto: 1200, porcentaje: 26.7, colorHex: '#4648d4' },
      { categoria: 'Alimentación', monto: 420, porcentaje: 9.3, colorHex: '#fd933d' },
      { categoria: 'Transporte', monto: 300, porcentaje: 6.7, colorHex: '#712ae2' },
      { categoria: 'Servicios', monto: 150, porcentaje: 3.3, colorHex: '#38bdf8' },
      { categoria: 'Salud', monto: 80, porcentaje: 1.8, colorHex: '#10b981' },
      { categoria: 'Entretenimiento', monto: 40, porcentaje: 0.9, colorHex: '#ef4444' },
    ],
    recomendaciones: [
      {
        id: 'rec-1',
        titulo: 'Reduce entretenimiento',
        descripcion: 'Monitorear gastos recurrentes de streaming',
        categoria: 'Entretenimiento',
        impacto: 'Ahorra $40/mes',
        etiquetaAccion: 'Ver detalles',
        tipoEstado: 'danger',
      },
      {
        id: 'rec-2',
        titulo: 'Aumenta ahorro',
        descripcion: 'Reserva +200 pesos mensuales',
        categoria: 'Ahorro',
        impacto: '+$2,400 al año',
        etiquetaAccion: 'Configurar',
        tipoEstado: 'warning',
      },
    ],
  });

  // History State
  const [analysisHistory, setAnalysisHistory] = useState<ReporteAnalisis[]>([
    {
      id: 'an-1',
      fecha: '24 Oct, 2023',
      marcaTiempo: 1698144000000,
      totalGastado: 12450,
      puntajeSalud: 92,
      estadoSalud: 'Saludable',
      mensajeMotivador: '¡Excelente disciplina! Has mantenido tus gastos esenciales controlados.',
      logroSemanal: {
        titulo: '¡Ahorraste 18% más que el mes anterior!',
        porcentajeGanancia: 18,
        horasRestantes: 36,
      },
      distribucionCategorias: [
        { categoria: 'Vivienda', monto: 1200, porcentaje: 26.7, colorHex: '#4648d4' },
        { categoria: 'Alimentación', monto: 420, porcentaje: 9.3, colorHex: '#fd933d' },
        { categoria: 'Transporte', monto: 300, porcentaje: 6.7, colorHex: '#712ae2' },
      ],
      recomendaciones: [
        {
          id: 'rec-1',
          titulo: 'Mantén el hábito de ahorro',
          descripcion: 'Aporta consistentemente a tu fondo para crear un colchón de seguridad.',
          categoria: 'Ahorro',
          impacto: '+$4,800 a largo plazo',
          etiquetaAccion: 'Ver reportes',
          tipoEstado: 'success',
        },
      ],
    },
    {
      id: 'an-2',
      fecha: '15 Sep, 2023',
      marcaTiempo: 1694774400000,
      totalGastado: 11200,
      puntajeSalud: 82,
      estadoSalud: 'En observación',
      mensajeMotivador: '¡Vamos a mejorar tu salud financiera! Pequeños ajustes marcarán la diferencia.',
      logroSemanal: {
        titulo: '¡Ahorraste 15% más que la semana pasada!',
        porcentajeGanancia: 15,
        horasRestantes: 48,
      },
      distribucionCategorias: [
        { categoria: 'Vivienda', monto: 1200, porcentaje: 26.7, colorHex: '#4648d4' },
        { categoria: 'Alimentación', monto: 420, porcentaje: 9.3, colorHex: '#fd933d' },
      ],
      recomendaciones: [
        {
          id: 'rec-2',
          titulo: 'Reduce entretenimiento',
          descripcion: 'Monitorear gastos recurrentes de streaming',
          categoria: 'Entretenimiento',
          impacto: 'Ahorra $40/mes',
          etiquetaAccion: 'Ver detalles',
          tipoEstado: 'danger',
        },
      ],
    },
    {
      id: 'an-3',
      fecha: '02 Ago, 2023',
      marcaTiempo: 1690972800000,
      totalGastado: 14800,
      puntajeSalud: 68,
      estadoSalud: 'Riesgo',
      mensajeMotivador: 'No te desanimes, ¡cada paso cuenta! Ajustando el plan volverás a la senda verde.',
      logroSemanal: {
        titulo: 'Fondo de emergencia iniciado con éxito',
        porcentajeGanancia: 8,
        horasRestantes: 72,
      },
      distribucionCategorias: [
        { categoria: 'Vivienda', monto: 1200, porcentaje: 25.0, colorHex: '#4648d4' },
      ],
      recomendaciones: [
        {
          id: 'rec-4',
          titulo: 'Refinancia deudas',
          descripcion: 'Consolida tus pasivos para reducir el costo financiero.',
          categoria: 'Deudas',
          impacto: 'Reduce 12% intereses',
          etiquetaAccion: 'Plan de pago',
          tipoEstado: 'danger',
        },
      ],
    },
  ]);

  // Initial Data Fetch
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUserProfile(data);
      })
      .catch(() => {});

    fetch('/api/transactions')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setTransactions(data);
      })
      .catch(() => {});

    fetch('/api/history')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setAnalysisHistory(data);
          setCurrentReport(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  // Handlers
  const handleAddTransaction = (newTx: Partial<Transaction>) => {
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      description: newTx.description || 'Gasto manual',
      amount: newTx.amount || 0,
      category: newTx.category || 'Otros',
      date: new Date().toISOString().split('T')[0],
      type: newTx.type || 'gasto',
      autoCategorized: newTx.autoCategorized !== undefined ? newTx.autoCategorized : true,
      categorizationFailed: newTx.categorizationFailed || false,
    };

    setTransactions([tx, ...transactions]);

    fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx),
    }).catch(() => {});
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    fetch(`/api/transactions/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
    fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const handleNewAnalysisComplete = (newReport: ReporteAnalisis) => {
    setCurrentReport(newReport);
    setAnalysisHistory([newReport, ...analysisHistory]);
    setCurrentTab('tablero');
    setActiveSubTab('Análisis');
    setActiveReportModal(newReport);
  };

  const handleLoginSuccess = (name: string, email: string) => {
    setUserProfile((prev) => ({ ...prev, name, email }));
  };

  const handleDeleteAccount = () => {
    const defaultProfile: UserProfile = {
      name: 'Usuario',
      email: '',
      monthlyIncome: 0,
      totalDebts: 0,
      monthlyDebtPayment: 0,
      savingsFrequency: 'Mensual',
      emergencyFund: 0,
      budgetGoal: 0,
      subscriptionsCount: 0,
      debtRatio: 0,
    };
    setUserProfile(defaultProfile);
    setTransactions([]);
    setAnalysisHistory([]);
    fetch('/api/account', { method: 'DELETE' }).catch(() => {});
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex text-[#191c1d] font-sans antialiased selection:bg-[#4648d4]/20 selection:text-[#4648d4]">
      {/* Sidebar: Persistent on Desktop, Slide-over Drawer on Mobile */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === 'tablero') setActiveSubTab('Análisis');
          if (tab === 'reportes') setActiveSubTab('Informes');
        }}
        onNewAnalysis={() => setCurrentTab('nuevo-analisis')}
        onOpenLogin={() => setShowLoginModal(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar
          activeSubTab={activeSubTab}
          onSubTabChange={setActiveSubTab}
          onNavigateTab={setCurrentTab}
          userProfile={userProfile}
          onOpenLogin={() => setShowLoginModal(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          {currentTab === 'tablero' && (
            <DashboardView
              report={currentReport}
              userProfile={userProfile}
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onNavigateToNewAnalysis={() => setCurrentTab('nuevo-analisis')}
              onOpenAnalysisModal={setActiveReportModal}
            />
          )}

          {currentTab === 'nuevo-analisis' && (
            <NewAnalysisView
              userProfile={userProfile}
              initialTransactions={transactions}
              onAnalysisComplete={handleNewAnalysisComplete}
            />
          )}

          {currentTab === 'reportes' && (
            <ReportsView
              report={currentReport}
              userProfile={userProfile}
              onOpenAnalysisModal={setActiveReportModal}
            />
          )}

          {currentTab === 'historial' && (
            <HistoryView
              analysisHistory={analysisHistory}
              onOpenAnalysisModal={setActiveReportModal}
              onNavigateToNewAnalysis={() => setCurrentTab('nuevo-analisis')}
            />
          )}

          {(currentTab === 'perfil' || currentTab === 'configuracion') && (
            <SettingsProfileView
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onDeleteAccount={handleDeleteAccount}
            />
          )}
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
            onClick={() => {
              setCurrentTab('tablero');
              setActiveSubTab('Análisis');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'tablero' ? 'text-[#4648d4] font-bold' : 'text-[#767586] hover:text-[#191c1d]'
            }`}
          >
            <LayoutGrid className={`w-4 h-4 ${currentTab === 'tablero' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">Panel</span>
          </button>

          <button
            id="mobile-nav-reportes"
            onClick={() => {
              setCurrentTab('reportes');
              setActiveSubTab('Informes');
            }}
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
            onClick={() => setCurrentTab('nuevo-analisis')}
            className="flex flex-col items-center justify-center -mt-4 bg-[#4648d4] text-white w-11 h-11 rounded-full shadow-[0_4px_16px_rgba(70,72,212,0.4)] active:scale-95 transition-transform"
            title="Nuevo Análisis"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            id="mobile-nav-historial"
            onClick={() => setCurrentTab('historial')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'historial' ? 'text-[#4648d4] font-bold' : 'text-[#767586] hover:text-[#191c1d]'
            }`}
          >
            <History className={`w-4 h-4 ${currentTab === 'historial' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">Historial</span>
          </button>

          <button
            id="mobile-nav-perfil"
            onClick={() => setCurrentTab('perfil')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'perfil' || currentTab === 'configuracion' ? 'text-[#4648d4] font-bold' : 'text-[#767586] hover:text-[#191c1d]'
            }`}
          >
            <User className={`w-4 h-4 ${currentTab === 'perfil' || currentTab === 'configuracion' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">Perfil</span>
          </button>
        </nav>
      </div>

      {/* Login & Auth Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Analysis Details Modal */}
      <AnalysisDetailModal
        reporte={activeReportModal}
        alCerrar={() => setActiveReportModal(null)}
      />
    </div>
  );
}
