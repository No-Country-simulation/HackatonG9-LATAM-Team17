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
import { NavigationTab, TopSubTab, UserProfile, Transaction, AnalysisReport } from './types';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('tablero');
  const [activeSubTab, setActiveSubTab] = useState<TopSubTab>('Análisis');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeReportModal, setActiveReportModal] = useState<AnalysisReport | null>(null);

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
  const [currentReport, setCurrentReport] = useState<AnalysisReport>({
    id: 'an-init',
    date: '15 Oct, 2024',
    timestamp: Date.now(),
    totalSpent: 2190,
    healthScore: 82,
    status: 'En observación',
    encouragingMessage: '¡Vamos a mejorar tu salud financiera! 💪',
    weeklyAchievement: {
      title: '¡Ahorraste 15% más que la semana pasada! 🎉',
      percentageGain: 15,
      hoursLeft: 48,
    },
    categoryDistribution: [
      { category: 'Vivienda', amount: 1200, percentage: 26.7, color: '#4648d4' },
      { category: 'Alimentación', amount: 420, percentage: 9.3, color: '#fd933d' },
      { category: 'Transporte', amount: 300, percentage: 6.7, color: '#712ae2' },
      { category: 'Servicios', amount: 150, percentage: 3.3, color: '#38bdf8' },
      { category: 'Salud', amount: 80, percentage: 1.8, color: '#10b981' },
      { category: 'Entretenimiento', amount: 40, percentage: 0.9, color: '#ef4444' },
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Reduce entretenimiento',
        description: 'Monitorear gastos recurrentes de streaming',
        category: 'Entretenimiento',
        impact: 'Ahorra $40/mes',
        actionLabel: 'Ver detalles',
        statusType: 'danger',
      },
      {
        id: 'rec-2',
        title: 'Aumenta ahorro',
        description: 'Reserva +200 pesos mensuales',
        category: 'Ahorro',
        impact: '+$2,400 al año',
        actionLabel: 'Configurar',
        statusType: 'warning',
      },
    ],
  });

  // History State
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisReport[]>([
    {
      id: 'an-1',
      date: '24 Oct, 2023',
      timestamp: 1698144000000,
      totalSpent: 12450,
      healthScore: 92,
      status: 'Saludable',
      encouragingMessage: '¡Excelente disciplina! Has mantenido tus gastos esenciales controlados.',
      weeklyAchievement: {
        title: '¡Ahorraste 18% más que el mes anterior!',
        percentageGain: 18,
        hoursLeft: 36,
      },
      categoryDistribution: [
        { category: 'Vivienda', amount: 1200, percentage: 26.7, color: '#4648d4' },
        { category: 'Alimentación', amount: 420, percentage: 9.3, color: '#fd933d' },
        { category: 'Transporte', amount: 300, percentage: 6.7, color: '#712ae2' },
      ],
      recommendations: [
        {
          id: 'rec-1',
          title: 'Mantén el hábito de ahorro',
          description: 'Aporta consistentemente a tu fondo para crear un colchón de seguridad.',
          category: 'Ahorro',
          impact: '+$4,800 a largo plazo',
          actionLabel: 'Ver reportes',
          statusType: 'success',
        },
      ],
    },
    {
      id: 'an-2',
      date: '15 Sep, 2023',
      timestamp: 1694774400000,
      totalSpent: 11200,
      healthScore: 82,
      status: 'En observación',
      encouragingMessage: '¡Vamos a mejorar tu salud financiera! Pequeños ajustes marcarán la diferencia.',
      weeklyAchievement: {
        title: '¡Ahorraste 15% más que la semana pasada!',
        percentageGain: 15,
        hoursLeft: 48,
      },
      categoryDistribution: [
        { category: 'Vivienda', amount: 1200, percentage: 26.7, color: '#4648d4' },
        { category: 'Alimentación', amount: 420, percentage: 9.3, color: '#fd933d' },
      ],
      recommendations: [
        {
          id: 'rec-2',
          title: 'Reduce entretenimiento',
          description: 'Monitorear gastos recurrentes de streaming',
          category: 'Entretenimiento',
          impact: 'Ahorra $40/mes',
          actionLabel: 'Ver detalles',
          statusType: 'danger',
        },
      ],
    },
    {
      id: 'an-3',
      date: '02 Ago, 2023',
      timestamp: 1690972800000,
      totalSpent: 14800,
      healthScore: 68,
      status: 'Riesgo',
      encouragingMessage: 'No te desanimes, ¡cada paso cuenta! Ajustando el plan volverás a la senda verde.',
      weeklyAchievement: {
        title: 'Fondo de emergencia iniciado con éxito',
        percentageGain: 8,
        hoursLeft: 72,
      },
      categoryDistribution: [
        { category: 'Vivienda', amount: 1200, percentage: 25.0, color: '#4648d4' },
      ],
      recommendations: [
        {
          id: 'rec-4',
          title: 'Refinancia deudas',
          description: 'Consolida tus pasivos para reducir el costo financiero.',
          category: 'Deudas',
          impact: 'Reduce 12% intereses',
          actionLabel: 'Plan de pago',
          statusType: 'danger',
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

  const handleNewAnalysisComplete = (newReport: AnalysisReport) => {
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
        report={activeReportModal}
        onClose={() => setActiveReportModal(null)}
      />
    </div>
  );
}
