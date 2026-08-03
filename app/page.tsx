"use client";

import React, { useState } from "react";
import { FormularioAnalisis } from "@/components/FormularioAnalisis";
import { TarjetaDiagnostico } from "@/components/TarjetaDiagnostico";
import { TarjetaRecomendacion } from "@/components/TarjetaRecomendacion";
import { AnalysisResponsePayload } from "@/types/finance";

export default function Home() {
  // CRITICAL: All native useState React logic and handlers preserved completely intact
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponsePayload | null>(null);
  const [computedDebtLevel, setComputedDebtLevel] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const handleAnalysisComplete = (result: AnalysisResponsePayload, debtRatio: number) => {
    setAnalysisResult(result);
    setComputedDebtLevel(debtRatio);
    setBackendError(null);
    setTimeout(() => {
      const resultsElement = document.getElementById("diagnostic-results");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setComputedDebtLevel(null);
    setBackendError(null);
    setIsLoading(false);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex w-full">
      {/* SideNavBar - Exact White Left Sidebar from code.html prototype */}
      <nav className="bg-surface-container-lowest text-primary shadow-md h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col p-[16px] gap-[8px] z-50">
        <div className="mb-[24px] flex flex-col items-center gap-[8px]">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-container p-1">
            <img
              className="w-full h-full object-cover rounded-full"
              alt="Mascota FinanceAI"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYsfCSh-LfL_-5HOboCRAKQCOVShe_NekQTtb2EQlPxa7IKjpaHbtb9jh1n7wv1hRMTzaEJP20wFvEyxSqmjIaNQcUD19teBrSHYyXQjU0yLCm_bGsiY1irsu02Q4etKqXa7bbgZAoukZgJ9WFnPFun-vl23YpwLUG7lQDD3MA0dXkC0FXe0WxYx0Tpwcl4obNRm2oXfCji1njX3yvLauoAF4X6d1vNOn1z7ScX9MyweQjvC3HpGfIfA"
            />
          </div>
          <div className="text-center">
            <h1 className="font-heading text-[24px] leading-[32px] tracking-[-0.01em] font-bold text-primary">
              FinanceAI
            </h1>
            <p className="font-sans text-[12px] leading-[16px] font-semibold text-on-surface-variant">
              El Experto Alentador
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-[8px]">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-[8px] p-[8px] rounded-xl hover:bg-surface-container-high duration-200"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-sans text-[12px] font-semibold">Tablero</span>
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-[8px] p-[8px] rounded-xl hover:bg-surface-container-high duration-200"
          >
            <span className="material-symbols-outlined">trending_up</span>
            <span className="font-sans text-[12px] font-semibold">Inversiones</span>
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-[8px] p-[8px] rounded-xl hover:bg-surface-container-high duration-200"
          >
            <span className="material-symbols-outlined">track_changes</span>
            <span className="font-sans text-[12px] font-semibold">Metas de Ahorro</span>
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="bg-primary-container text-on-primary-container font-bold rounded-xl flex items-center gap-[8px] p-[8px] hover:bg-surface-container-high transition-all duration-200"
          >
            <span className="material-symbols-outlined">bar_chart</span>
            <span className="font-sans text-[12px] font-semibold">Reportes</span>
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-[8px] p-[8px] rounded-xl hover:bg-surface-container-high duration-200"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-sans text-[12px] font-semibold">Configuración</span>
          </a>
        </div>

        <div className="mt-auto flex flex-col gap-[8px]">
          <button
            type="button"
            onClick={() => {
              handleReset();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="bg-gradient-to-r from-primary to-tertiary text-on-primary font-sans text-[12px] font-semibold py-[8px] px-[16px] rounded-full w-full hover:opacity-90 transition-opacity flex justify-center items-center gap-[4px] cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo Análisis
          </button>
          <div className="h-[1px] bg-surface-variant w-full my-[8px]"></div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-[8px] p-[8px] rounded-xl hover:bg-surface-container-high duration-200"
          >
            <span className="material-symbols-outlined">help_outline</span>
            <span className="font-sans text-[12px] font-semibold">Centro de Ayuda</span>
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-[8px] p-[8px] rounded-xl hover:bg-surface-container-high duration-200"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-sans text-[12px] font-semibold">Cerrar Sesión</span>
          </a>
        </div>
      </nav>

      {/* Main Content Wrapper - Official Ultra Light Background from code.html */}
      <div className="flex-1 flex flex-col lg:pl-64 w-full">
        {/* TopAppBar */}
        <header className="bg-surface/80 backdrop-blur-md text-primary h-16 sticky top-0 z-40 shadow-xs flex justify-between items-center px-[24px] w-full border-b border-surface-variant/40">
          <div className="flex items-center gap-[16px] lg:hidden">
            <span className="font-heading text-[24px] font-extrabold text-primary">
              FinanceAI
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-[16px]">
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-full py-[6px] pl-[38px] pr-[12px] text-[14px] text-on-surface focus:ring-2 focus:ring-primary-container focus:border-primary focus:outline-hidden transition-shadow"
              />
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-[24px]">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors font-sans text-[16px] px-[8px] py-[4px] rounded-md font-medium"
            >
              Portafolio
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-primary border-b-2 border-primary pb-1 font-sans text-[16px] px-[8px] py-[4px] hover:bg-surface-container-low transition-colors focus:ring-2 focus:ring-primary-container rounded-md font-bold"
            >
              Perspectivas
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors font-sans text-[16px] px-[8px] py-[4px] rounded-md font-medium"
            >
              Recompensas
            </a>
          </nav>
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              className="p-[6px] rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors focus:ring-2 focus:ring-primary-container cursor-pointer"
              title="Notificaciones"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              type="button"
              className="p-[6px] rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors focus:ring-2 focus:ring-primary-container cursor-pointer"
              title="Perfil de Usuario"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-[16px] md:p-[40px] bg-background w-full max-w-6xl mx-auto">
          <div className="mb-[32px]">
            <h2 className="font-heading text-[28px] leading-[36px] tracking-[-0.02em] font-bold text-on-surface mb-[4px]">
              Nuevo Análisis
            </h2>
            <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant">
              Ingresa tus transacciones recientes para generar un nuevo reporte de perspectivas financieras de Inteligencia Artificial.
            </p>
          </div>

          {/* Backend Reachability Error Notice */}
          {backendError && (
            <div className="mb-[24px] p-[24px] rounded-2xl bg-error-container border border-error/40 text-on-error-container custom-shadow animate-card-enter flex flex-col sm:flex-row items-center justify-between gap-[16px]">
              <div className="flex items-center gap-[16px]">
                <span className="material-symbols-outlined text-[32px] text-error shrink-0">
                  cloud_off
                </span>
                <div>
                  <h4 className="font-sans font-bold text-[16px] text-on-error-container">
                    Aviso de Conectividad con el Servidor Local
                  </h4>
                  <p className="font-sans text-[14px] mt-[4px] leading-relaxed">
                    {backendError}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBackendError(null)}
                className="px-[16px] py-[8px] rounded-xl bg-surface-container-lowest text-on-surface text-[12px] font-bold uppercase tracking-wider hover:bg-surface-container-low transition duration-200 shrink-0 border border-surface-variant shadow-2xs cursor-pointer"
              >
                Entendido
              </button>
            </div>
          )}

          {/* Main Bento-style Layout inside FormularioAnalisis */}
          <FormularioAnalisis
            onAnalysisComplete={handleAnalysisComplete}
            onLoadingChange={setIsLoading}
            onError={setBackendError}
            onReset={handleReset}
            isLoading={isLoading}
          />

          {/* Diagnostic Results Dashboard Section */}
          {analysisResult && (
            <div
              id="diagnostic-results"
              className="mt-[48px] pt-[32px] border-t-2 border-dashed border-surface-variant space-y-[32px] animate-card-enter"
            >
              <div className="text-center space-y-[8px]">
                <span className="inline-flex items-center px-[16px] py-[4px] rounded-full bg-primary-fixed text-on-primary-fixed font-sans text-[12px] font-bold uppercase tracking-wide">
                  Diagnóstico IA Generado
                </span>
                <h3 className="font-heading text-[28px] font-bold text-on-surface">
                  Tu Diagnóstico y Plan de Acción
                </h3>
                <p className="font-sans text-on-surface-variant text-[16px] max-w-2xl mx-auto">
                  Hemos revisado cada uno de tus hábitos y transacciones. Aquí tienes tu evaluación personalizada al estilo de <strong>El Experto Alentador</strong>.
                </p>
              </div>

              <TarjetaDiagnostico
                perfilFinanciero={analysisResult.perfil_financiero}
                probabilidad={analysisResult.probabilidad}
                resumenGastos={analysisResult.resumen_gastos}
                computedDebtLevel={computedDebtLevel !== null ? computedDebtLevel : undefined}
              />

              <TarjetaRecomendacion
                recommendations={analysisResult.recomendaciones}
              />

              <div className="p-[32px] rounded-2xl bg-surface-container-lowest border border-surface-variant text-center space-y-[16px] custom-shadow">
                <h4 className="font-sans font-bold text-[18px] text-primary">
                  ¿Deseas evaluar otro escenario financiero?
                </h4>
                <p className="font-sans text-[14px] text-on-surface-variant max-w-lg mx-auto">
                  Puedes modificar tus transacciones o ajustar tus ingresos en tiempo real en la parte superior, o iniciar desde cero cuando gustes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-[24px] py-[12px] rounded-xl bg-primary hover:bg-tertiary text-on-primary font-sans font-bold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer inline-flex items-center gap-[8px]"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                  <span>Realizar Nueva Evaluación</span>
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer exactly matching code.html */}
        <footer className="bg-surface-container-low py-[16px] mt-[48px] flex flex-col md:flex-row justify-between items-center px-[24px] w-full mt-auto border-t border-surface-variant/60">
          <span className="font-sans text-[16px] font-bold text-on-surface mb-[8px] md:mb-0">
            FinanceAI
          </span>
          <p className="font-sans text-[14px] text-on-surface-variant">
            © {new Date().getFullYear()} FinanceAI - The Encouraging Expert. Tu viaje financiero, gamificado.
          </p>
          <div className="flex gap-[16px] mt-[8px] md:mt-0">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-sans text-[12px] font-semibold text-on-surface-variant hover:text-primary hover:underline transition-all"
            >
              Política de Privacidad
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-sans text-[12px] font-semibold text-on-surface-variant hover:text-primary hover:underline transition-all"
            >
              Términos de Servicio
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-sans text-[12px] font-semibold text-on-surface-variant hover:text-primary hover:underline transition-all"
            >
              Contáctanos
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
