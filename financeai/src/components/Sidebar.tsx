import React from 'react';
import {
  LayoutGrid,
  BarChart3,
  History,
  User,
  Plus,
  LogOut,
  X
} from 'lucide-react';
import { NavigationTab } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { MASCOTS } from '../assets/mascots';

interface SidebarProps {
  onOpenLogin: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenLogin,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const elementosNavegacion = [
    { id: 'tablero', path: '/', label: 'Dashboard', icon: LayoutGrid },
    { id: 'reportes', path: '/reportes', label: 'Informes', icon: BarChart3 },
    { id: 'historial', path: '/historial', label: 'Historial', icon: History },
    { id: 'perfil', path: '/perfil', label: 'Perfil', icon: User },
  ];

  const manejarClicPestana = (path: string) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const manejarClicNuevoAnalisis = () => {
    navigate('/analisis/nuevo');
    if (onCloseMobile) onCloseMobile();
  };

  const manejarClicLogin = () => {
    onOpenLogin();
    if (onCloseMobile) onCloseMobile();
  };

  const contenidoSidebar = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between mb-8">
          <div
            id="brand-header"
            onClick={() => manejarClicPestana('/')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-full p-1 bg-gradient-to-tr from-[#6063ee] via-[#4648d4] to-[#fd933d] shadow-[0_4px_12px_rgba(70,72,212,0.25)] flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5">
                <img
                  src={MASCOTS.logo}
                  alt="FinanceAI Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <h1 className="text-[20px] font-bold tracking-tight text-[#4648d4] leading-tight font-display">
                FinanceAI
              </h1>
              <p className="text-[12px] font-medium text-[#767586] leading-none">
                El Experto Alentador
              </p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-2 rounded-xl text-[#767586] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5" id="main-navigation-menu">
          {elementosNavegacion.map((item) => {
            const Icon = item.icon;
            const isActive = path === item.path || (item.path === '/perfil' && path === '/configuracion');
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => manejarClicPestana(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${isActive
                    ? 'bg-[#4648d4] text-white shadow-[0_4px_14px_rgba(70,72,212,0.3)] font-semibold'
                    : 'text-[#464554] hover:bg-[#f3f4f5] hover:text-[#191c1d]'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#767586]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-4 pt-4 border-t border-[#f3f4f5]" id="sidebar-footer-actions">
        {/* New Analysis Primary Action */}
        <button
          id="btn-sidebar-new-analysis"
          onClick={manejarClicNuevoAnalisis}
          className="w-full py-2.5 px-4 rounded-xl bg-[#6063ee] hover:bg-[#4648d4] active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(96,99,238,0.35)] transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nuevo Análisis</span>
        </button>

        {/* Utilities */}
        <div className="space-y-1">
          <button
            id="btn-logout"
            onClick={manejarClicLogin}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-[#464554] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
          >
            <LogOut className="w-4 h-4 text-[#767586]" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        id="sidebar-navigation"
        className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-[#e1e3e4] p-5 h-screen sticky top-0 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20"
      >
        {contenidoSidebar}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <aside
            id="sidebar-mobile-drawer"
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white p-5 shadow-2xl z-50 flex flex-col justify-between transform transition-transform duration-300 ease-out animate-in slide-in-from-left"
          >
            {contenidoSidebar}
          </aside>
        </div>
      )}
    </>
  );
};
