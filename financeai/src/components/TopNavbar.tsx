import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Award, Sparkles, User, LogOut, CheckCircle2, Menu } from 'lucide-react';
import { TopSubTab, NavigationTab, UserProfile } from '../types';
import { MASCOTS } from '../assets/mascots';

interface TopNavbarProps {
  activeSubTab: TopSubTab;
  onSubTabChange: (subTab: TopSubTab) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  userProfile: UserProfile;
  onOpenLogin: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeSubTab,
  onSubTabChange,
  onNavigateTab,
  userProfile,
  onOpenLogin,
  onToggleMobileMenu,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const subTabs: TopSubTab[] = ['Análisis', 'Informes'];

  const notifications = [
    { id: 1, title: '¡Ahorro cumplido!', time: 'Hace 2 horas', desc: 'Completaste el 15% adicional de tu meta semanal', icon: Award },
    { id: 2, title: 'Consejo del Experto', time: 'Ayer', desc: 'Detectamos 1 suscripción inactiva que podrías pausar', icon: Sparkles },
    { id: 3, title: 'Presupuesto al día', time: 'Hace 3 días', desc: 'Tus gastos de alimentación se mantienen bajo control', icon: CheckCircle2 },
  ];

  return (
    <header 
      id="top-navbar"
      className="h-16 border-b border-[#e1e3e4] bg-white/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
    >
      {/* Mobile Left: Menu Toggle Button & Brand Mini-Badge */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          id="btn-mobile-menu-toggle"
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl text-[#464554] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors active:scale-95"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-5 h-5 text-[#191c1d]" />
        </button>

        <div 
          onClick={() => onNavigateTab('tablero')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full p-0.5 bg-gradient-to-tr from-[#6063ee] to-[#fd933d] flex items-center justify-center shadow-xs">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <img 
                src={MASCOTS.happyPotatoCoin} 
                alt="FinanceAI Mascot" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <span className="font-bold text-sm text-[#4648d4] font-display">
            FinanceAI
          </span>
        </div>
      </div>

      {/* Left / Center Search bar */}
      <div className="hidden sm:block flex-1 max-w-xs md:max-w-md mx-2 md:mx-0">
        <div className="relative">
          <Search className="w-4 h-4 text-[#767586] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-[#f8f9fa] border border-[#e1e3e4] text-[#191c1d] placeholder-[#767586] focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/15 transition-all"
          />
        </div>
      </div>

      {/* Center Tabs: Análisis | Informes (hidden on tiny screens, shown from sm) */}
      <div className="hidden sm:flex items-center gap-1 mx-2 md:mx-4" id="top-subtabs-nav">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              id={`subtab-${tab.toLowerCase()}`}
              onClick={() => {
                onSubTabChange(tab);
                if (tab === 'Análisis') onNavigateTab('tablero');
                if (tab === 'Informes') onNavigateTab('reportes');
              }}
              className={`relative px-3 md:px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 ${
                isActive
                  ? 'text-[#4648d4] bg-[#4648d4]/10 shadow-sm'
                  : 'text-[#464554] hover:text-[#191c1d] hover:bg-[#f3f4f5]'
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#4648d4] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-2 md:gap-3 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className="relative p-2 rounded-full text-[#464554] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div 
              id="notifications-popover"
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#e1e3e4] shadow-[0_12px_32px_rgba(0,0,0,0.12)] p-4 z-50 animate-in fade-in slide-in-from-top-2"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f5]">
                <h4 className="font-semibold text-xs text-[#191c1d] font-display">Notificaciones</h4>
                <span className="text-[10px] text-[#4648d4] font-medium cursor-pointer hover:underline">
                  Marcar como leídas
                </span>
              </div>
              <div className="divide-y divide-[#f3f4f5] mt-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => {
                  const NIcon = n.icon;
                  return (
                    <div key={n.id} className="py-2.5 flex items-start gap-3 hover:bg-[#f8f9fa] rounded-lg px-2 transition-colors">
                      <div className="p-1.5 rounded-lg bg-[#6063ee]/10 text-[#4648d4] shrink-0 mt-0.5">
                        <NIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="text-xs font-semibold text-[#191c1d]">{n.title}</p>
                          <span className="text-[10px] text-[#767586]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#464554] leading-snug mt-0.5">{n.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <button
            id="btn-user-profile-menu"
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full hover:bg-[#f3f4f5] transition-colors border border-transparent hover:border-[#e1e3e4]"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-[#6063ee] to-[#fd933d] p-0.5 shadow-sm">
              <img
                src={MASCOTS.happyPotatoCoin}
                alt={userProfile.name}
                className="w-full h-full rounded-full object-cover bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-semibold text-[#191c1d]">
              {userProfile.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#767586]" />
          </button>

          {/* User Profile Dropdown */}
          {showUserDropdown && (
            <div 
              id="user-profile-dropdown"
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#e1e3e4] shadow-[0_12px_32px_rgba(0,0,0,0.12)] p-2 z-50 animate-in fade-in slide-in-from-top-2"
            >
              <div className="px-3 py-2 border-b border-[#f3f4f5] mb-1">
                <p className="text-xs font-bold text-[#191c1d]">{userProfile.name}</p>
                <p className="text-[11px] text-[#767586] truncate">{userProfile.email}</p>
              </div>
              <button
                onClick={() => {
                  onNavigateTab('perfil');
                  setShowUserDropdown(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#464554] hover:text-[#191c1d] hover:bg-[#f3f4f5] rounded-xl transition-colors font-medium text-left"
              >
                <User className="w-3.5 h-3.5 text-[#767586]" />
                <span>Mi Perfil</span>
              </button>
              <div className="border-t border-[#f3f4f5] my-1" />
              <button
                onClick={() => {
                  onOpenLogin();
                  setShowUserDropdown(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-xl transition-colors font-medium text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
