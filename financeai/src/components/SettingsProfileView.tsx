import React, { useState } from 'react';
import {
  User,
  Eye,
  EyeOff,
  Check,
  Lock,
  Sliders,
  Trash2,
  AlertTriangle,
  X,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { UserProfile, SavingsFrequency } from '../types';
import { sanitizePositiveNumber, preventNegativeKeys, parsePositiveFloat } from '../utils/numberUtils';
import { MASCOTS } from '../assets/mascots';
import { manejarRespuestaError } from '../utils/apiErrors';

export const getDebtColor = (ratio: number): string => {
  if (ratio < 30) return '#10b981'; // Verde
  if (ratio <= 50) return '#fd933d'; // Naranja
  return '#ba1a1a'; // Rojo
};

interface SettingsProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  onDeleteAccount?: () => void;
}

export const SettingsProfileView: React.FC<SettingsProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onDeleteAccount,
}) => {
  const [modoEdicion, setModoEdicion] = useState(false);

  // Basic info form state
  const [nombreCompleto, setNombreCompleto] = useState(userProfile.nombre);
  const [correo, setCorreo] = useState(userProfile.email);
  const [exitoGuardadoBasico, setExitoGuardadoBasico] = useState(false);
  const [guardandoBasico, setGuardandoBasico] = useState(false);
  const [errorBasico, setErrorBasico] = useState<string | null>(null);

  // Financial profile form state
  const [ingresoTotal, setIngresoTotal] = useState(String(userProfile.ingresoMensual || 0));
  const ratioDeudaCalculado = userProfile.ingresoMensual > 0 ? Math.round((userProfile.deudaTotal / userProfile.ingresoMensual) * 100) : 0;
  const [frecuenciaAhorro, setFrecuenciaAhorro] = useState<SavingsFrequency>(userProfile.frecuenciaAhorro || 'Mensual');
  const [deudasTotales, setDeudasTotales] = useState(String(userProfile.deudasTotales || 0));
  const [exitoGuardadoFinanciero, setExitoGuardadoFinanciero] = useState(false);

  // Delete account modal state
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [textoConfirmacionEliminar, setTextoConfirmacionEliminar] = useState('');
  const [estaEliminando, setEstaEliminando] = useState(false);
  const [avisoEliminado, setAvisoEliminado] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const manejarGuardarBasico = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile.id) {
      setErrorBasico("No se encontró el ID del usuario en la sesión.");
      return;
    }

    setGuardandoBasico(true);
    setErrorBasico(null);

    try {
      const response = await fetch(`/api/v1/auth/usuarios/${userProfile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreCompleto, email: correo }),
      });

      if (!response.ok) {
        const errorData = await manejarRespuestaError(response);
        throw new Error(errorData.general || 'Error al actualizar el perfil');
      }

      await onUpdateProfile({ nombre: nombreCompleto, email: correo }, true); // localOnly = true
      setExitoGuardadoBasico(true);
      setModoEdicion(false);
      setTimeout(() => setExitoGuardadoBasico(false), 2000);
    } catch (error: any) {
      setErrorBasico(error.message);
    } finally {
      setGuardandoBasico(false);
    }
  };



  const manejarConfirmarEliminarCuenta = async () => {
    setEstaEliminando(true);
    setErrorEliminar(null);
    try {
      // Usar ruta relativa manejada por el proxy de Vite en lugar de url absoluta
      const response = await fetch(`/api/v1/auth/eliminar?email=${correo}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAvisoEliminado(true);
        setTimeout(() => {
          setMostrarModalEliminar(false);
          setAvisoEliminado(false);
          setTextoConfirmacionEliminar('');
          if (onDeleteAccount) {
            onDeleteAccount();
          }
        }, 1500);
      } else {
        const errorData = await manejarRespuestaError(response);
        setErrorEliminar(errorData.general);
      }
    } catch (error) {
      setErrorEliminar('Error de red al eliminar la cuenta. Intenta nuevamente.');
    } finally {
      setEstaEliminando(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200" id="profile-view-container">
      {/* Title Header */}
      <div id="profile-header" className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#4648d4]/10 text-[#4648d4] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h1 className="text-[26px] md:text-[28px] font-bold text-[#191c1d] tracking-tight font-display">
              Perfil de Usuario
            </h1>
          </div>
          <p className="text-xs text-[#767586] font-medium ml-10">
            Gestiona tus datos personales y parámetros financieros personalizados.
          </p>
        </div>

      </div>

      {/* Main Grid: 2 Columns for Info & Financial Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Datos Personales y Credenciales */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4648d4] text-white flex items-center justify-center shadow-xs">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#191c1d] font-display">
                    Información Personal
                  </h3>
                  <p className="text-[11px] text-[#767586]">
                    Datos de contacto y cuenta
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:flex px-2.5 py-1 text-[11px] font-semibold text-[#059669] bg-[#10b981]/10 border border-[#10b981]/20 rounded-full items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Activa
                </span>
                <button
                  onClick={() => setModoEdicion(!modoEdicion)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${modoEdicion ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#4648d4]/10 text-[#4648d4] hover:bg-[#4648d4]/20'}`}
                >
                  {modoEdicion ? (
                    <>
                      <X className="w-3.5 h-3.5" />
                      <span>Cancelar</span>
                    </>
                  ) : (
                    <>
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={manejarGuardarBasico} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={nombreCompleto}
                  disabled={!modoEdicion}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/10 transition-all disabled:opacity-60"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="correo"
                  value={correo}
                  disabled={!modoEdicion}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/10 transition-all disabled:opacity-60"
                  required
                />
              </div>



              {errorBasico && (
                <div className="p-3 rounded-xl bg-[#ffdad6]/40 border border-[#ffdad6] text-xs font-bold text-[#ba1a1a] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorBasico}</span>
                </div>
              )}

              {modoEdicion && (
                <button
                  type="submit"
                  disabled={guardandoBasico}
                  className="w-full py-2.5 bg-[#4648d4] hover:bg-[#393bb8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_14px_rgba(70,72,212,0.3)] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {guardandoBasico ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Guardando...</span>
                    </>
                  ) : exitoGuardadoBasico ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Información Guardada!</span>
                    </>
                  ) : (
                    <span>Guardar Cambios Personales</span>
                  )}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Column (7 Cols): Parámetros Financieros */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6063ee]/10 text-[#4648d4] flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#191c1d] font-display">
                    Parámetros Financieros
                  </h3>
                  <p className="text-[11px] text-[#767586]">
                    Configura tus metas, ratios e ingresos base
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-[#4648d4] font-mono-val bg-[#e0e7ff]/70 px-2.5 py-1 rounded-lg">
                ${parsePositiveFloat(ingresoTotal, 0).toLocaleString()}/mes
              </span>
            </div>

            {!userProfile.ingresoMensual || userProfile.ingresoMensual === 0 ? (
              <div className="bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl p-5 text-center space-y-3">
                <div className="w-12 h-12 bg-[#4648d4]/10 text-[#4648d4] rounded-full flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="text-[#191c1d] font-bold text-sm">Sin parámetros configurados</h4>
                <p className="text-[#767586] text-xs">Aún no has generado tu primer análisis financiero. Ve a la sección "Nuevo Análisis" para establecer tu información base.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Nivel de Endeudamiento Slider Estático */}
                <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e1e3e4]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-semibold text-[#464554]">
                      Nivel de Endeudamiento
                    </label>
                    <span className="text-xs font-bold text-[#4648d4] font-mono-val">
                      {ratioDeudaCalculado}%
                    </span>
                  </div>
                  <div className="relative mt-2">
                    <div className="h-1.5 w-full bg-[#f3f4f5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${ratioDeudaCalculado}%`, backgroundColor: getDebtColor(ratioDeudaCalculado) }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-[#767586] uppercase tracking-wider mt-1">
                    <span>0% (Sin deudas)</span>
                    <span>100% (Alto riesgo)</span>
                  </div>
                </div>

                {/* Otros Datos Estáticos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-[#e1e3e4] rounded-xl">
                    <span className="block text-[10px] uppercase font-bold text-[#767586] mb-1">Ingreso Mensual</span>
                    <span className="text-sm font-bold text-[#191c1d] font-mono-val">${(userProfile.ingresoMensual || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="p-4 bg-white border border-[#e1e3e4] rounded-xl">
                    <span className="block text-[10px] uppercase font-bold text-[#767586] mb-1">Deuda Total</span>
                    <span className="text-sm font-bold text-[#ba1a1a] font-mono-val">${(userProfile.deudaTotal || 0).toLocaleString()}</span>
                  </div>

                  <div className="p-4 bg-white border border-[#e1e3e4] rounded-xl sm:col-span-2">
                    <span className="block text-[10px] uppercase font-bold text-[#767586] mb-1">Frecuencia de Ahorro</span>
                    <span className="inline-block mt-1 px-3 py-1 bg-[#4648d4]/10 text-[#4648d4] text-xs font-bold rounded-lg">
                      {userProfile.frecuenciaAhorro || 'No definida'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone: Eliminar Cuenta */}
      <div
        id="danger-zone-delete-account"
        className="bg-white rounded-2xl p-6 border border-[#ffdad6] shadow-[0_4px_20px_rgba(186,26,26,0.03)] space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
            <Trash2 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#ba1a1a] font-display">
              Zona de Peligro: Eliminar Cuenta
            </h3>
            <p className="text-[11px] text-[#767586]">
              Eliminación irreversible de tu perfil y todos los datos asociados
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-[#fff8f7] rounded-xl border border-[#ffdad6]/80 text-xs text-[#464554] space-y-2">
          <div className="flex items-start gap-2 text-[#ba1a1a]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold text-xs">Advertencia irreversible</span>
          </div>
          <p className="text-[11px] text-[#767586] leading-relaxed">
            Al eliminar tu cuenta se borrarán permanentemente tus parámetros configurados, análisis de IA y transacciones registradas.
          </p>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            id="btn-open-delete-account-modal"
            onClick={() => setMostrarModalEliminar(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(186,26,26,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar mi cuenta</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Delete Account */}
      {mostrarModalEliminar && (
        <div
          id="modal-delete-account-overlay"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            id="modal-delete-account-card"
            className="bg-white rounded-3xl max-w-md w-full border border-[#ffdad6] shadow-2xl p-6 relative animate-in zoom-in-95 space-y-5"
          >
            <button
              onClick={() => setMostrarModalEliminar(false)}
              className="absolute top-4 right-4 p-2 text-[#767586] hover:text-[#191c1d] hover:bg-[#f3f4f5] rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-3 pt-2">
              <div className="w-24 h-24 mx-auto flex items-center justify-center">
                <img
                  src={MASCOTS.sadPotatoCoin}
                  alt="Mascota triste confirmación eliminar cuenta"
                  className="w-full h-full object-contain drop-shadow-xs"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-lg font-bold text-[#ba1a1a] font-display">
                ¿Estás completamente seguro?
              </h3>
              <p className="text-xs text-[#767586] leading-relaxed">
                Esta acción es <strong>definitiva</strong>. Para confirmar, escribe <span className="font-bold text-[#ba1a1a] bg-[#ffdad6]/60 px-1.5 py-0.5 rounded font-mono">ELIMINAR</span> a continuación:
              </p>
            </div>

            <div className="space-y-3">
              {errorEliminar && (
                <div className="p-3 rounded-xl bg-[#ffdad6]/40 border border-[#ffdad6] text-xs font-bold text-[#ba1a1a] text-center flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errorEliminar}</span>
                </div>
              )}

              <input
                id="input-delete-confirm-text"
                type="text"
                placeholder="Escribe ELIMINAR para confirmar"
                value={textoConfirmacionEliminar}
                onChange={(e) => setTextoConfirmacionEliminar(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-center font-bold rounded-xl bg-[#f8f9fa] border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#ba1a1a] tracking-wider"
              />

              {avisoEliminado ? (
                <div className="p-3 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 text-xs font-bold text-[#0d9468] text-center flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Tu cuenta ha sido eliminada con éxito.</span>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMostrarModalEliminar(false)}
                    className="flex-1 py-2.5 bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#191c1d] rounded-xl text-xs font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    id="btn-confirm-delete-account-action"
                    disabled={textoConfirmacionEliminar.trim().toUpperCase() !== 'ELIMINAR' || estaEliminando}
                    onClick={manejarConfirmarEliminarCuenta}
                    className="flex-1 py-2.5 bg-[#ba1a1a] hover:bg-[#93000a] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {estaEliminando ? (
                      <span>Eliminando...</span>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar Definitivamente</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
