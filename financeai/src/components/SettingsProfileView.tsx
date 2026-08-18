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
  ShieldCheck
} from 'lucide-react';
import { UserProfile, SavingsFrequency } from '../types';
import { sanitizePositiveNumber, preventNegativeKeys, parsePositiveFloat } from '../utils/numberUtils';
import { MASCOTS } from '../assets/mascots';

interface SettingsProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  onDeleteAccount?: () => void;
}

export const SettingsProfileView: React.FC<SettingsProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onDeleteAccount,
}) => {
  // Basic info form state
  const [fullName, setFullName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [currentPassword, setCurrentPassword] = useState('password123');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [savedBasicSuccess, setSavedBasicSuccess] = useState(false);

  // Financial profile form state
  const [incomeTotal, setIncomeTotal] = useState(String(userProfile.monthlyIncome || 5200));
  const [debtRatio, setDebtRatio] = useState(userProfile.debtRatio || 35);
  const [savingsFreq, setSavingsFreq] = useState<SavingsFrequency>(userProfile.savingsFrequency || 'Mensual');
  const [totalDebts, setTotalDebts] = useState(String(userProfile.totalDebts || 875000));
  const [monthlyDebtPay, setMonthlyDebtPay] = useState(String(userProfile.monthlyDebtPayment || 350000));
  const [emergencyFund, setEmergencyFund] = useState(String(userProfile.emergencyFund || 1500000));
  const [savedFinSuccess, setSavedFinSuccess] = useState(false);

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedNotice, setDeletedNotice] = useState(false);

  const handleSaveBasic = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name: fullName, email });
    setSavedBasicSuccess(true);
    setTimeout(() => setSavedBasicSuccess(false), 2000);
  };

  const handleSaveFinancial = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      monthlyIncome: parsePositiveFloat(incomeTotal, 5200),
      debtRatio: Math.max(0, debtRatio),
      savingsFrequency: savingsFreq,
      totalDebts: parsePositiveFloat(totalDebts, 0),
      monthlyDebtPayment: parsePositiveFloat(monthlyDebtPay, 0),
      emergencyFund: parsePositiveFloat(emergencyFund, 0),
    });
    setSavedFinSuccess(true);
    setTimeout(() => setSavedFinSuccess(false), 2000);
  };

  const handleConfirmDeleteAccount = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setDeletedNotice(true);
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeletedNotice(false);
        setDeleteConfirmText('');
        if (onDeleteAccount) {
          onDeleteAccount();
        }
      }, 1500);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200" id="profile-view-container">
      {/* Title Header */}
      <div id="profile-header">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#4648d4]/10 text-[#4648d4] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#191c1d] tracking-tight font-display">
            Perfil de Usuario
          </h1>
        </div>
        <p className="text-xs text-[#767586] font-medium ml-10">
          Gestiona tus datos personales, credenciales de acceso y parámetros financieros personalizados.
        </p>
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

              <span className="px-2.5 py-1 text-[11px] font-semibold text-[#059669] bg-[#10b981]/10 border border-[#10b981]/20 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Activa
              </span>
            </div>

            <form onSubmit={handleSaveBasic} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/10 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/10 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4] pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#767586] hover:text-[#191c1d]"
                  >
                    {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                  Nueva Contraseña (Opcional)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4] pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#767586] hover:text-[#191c1d]"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4648d4] hover:bg-[#393bb8] text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_14px_rgba(70,72,212,0.3)] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {savedBasicSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Información Guardada!</span>
                  </>
                ) : (
                  <span>Guardar Cambios Personales</span>
                )}
              </button>
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
                ${parsePositiveFloat(incomeTotal, 0).toLocaleString()}/mes
              </span>
            </div>

            <form onSubmit={handleSaveFinancial} className="space-y-4">
              {/* Nivel de Endeudamiento Slider */}
              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e1e3e4]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-semibold text-[#464554]">
                    Nivel de Endeudamiento Máximo
                  </label>
                  <span className="text-xs font-bold text-[#4648d4] font-mono-val">
                    {debtRatio}%
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={debtRatio}
                    onChange={(e) => setDebtRatio(Number(e.target.value))}
                    className="w-full accent-[#4648d4] cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#767586] uppercase tracking-wider mt-1">
                  <span>0% (Sin deudas)</span>
                  <span>100% (Alto riesgo)</span>
                </div>
              </div>

              {/* Frecuencia de Ahorro Toggle Pills */}
              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-2">
                  Frecuencia de Ahorro
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Semanal', 'Quincenal', 'Mensual'] as SavingsFrequency[]).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setSavingsFreq(freq)}
                      className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                        savingsFreq === freq
                          ? 'bg-[#4648d4] text-white shadow-sm'
                          : 'bg-[#f3f4f5] text-[#464554] hover:bg-[#e7e8e9]'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ingreso Mensual Total ($) */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                    Ingreso Mensual Total ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#191c1d] font-mono-val">$</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={incomeTotal}
                      onKeyDown={preventNegativeKeys}
                      onChange={(e) => setIncomeTotal(sanitizePositiveNumber(e.target.value))}
                      className="w-full pl-7 pr-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val font-bold focus:outline-none focus:border-[#4648d4]"
                    />
                  </div>
                </div>

                {/* Fondo de Emergencia ($) */}
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

                {/* Valor Total Deudas ($) */}
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
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
                  />
                </div>

                {/* Pago Mensual de Deuda ($) */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#464554] mb-1.5">
                    Pago Mensual de Deuda ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Ej. 350000"
                    value={monthlyDebtPay}
                    onKeyDown={preventNegativeKeys}
                    onChange={(e) => setMonthlyDebtPay(sanitizePositiveNumber(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] font-mono-val focus:outline-none focus:border-[#4648d4]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4648d4] hover:bg-[#393bb8] text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_14px_rgba(70,72,212,0.3)] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {savedFinSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Perfil Financiero Actualizado!</span>
                  </>
                ) : (
                  <span>Guardar Parámetros Financieros</span>
                )}
              </button>
            </form>
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
            onClick={() => setShowDeleteModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(186,26,26,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar mi cuenta</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Delete Account */}
      {showDeleteModal && (
        <div 
          id="modal-delete-account-overlay"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            id="modal-delete-account-card"
            className="bg-white rounded-3xl max-w-md w-full border border-[#ffdad6] shadow-2xl p-6 relative animate-in zoom-in-95 space-y-5"
          >
            <button
              onClick={() => setShowDeleteModal(false)}
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
              <input
                id="input-delete-confirm-text"
                type="text"
                placeholder="Escribe ELIMINAR para confirmar"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-center font-bold rounded-xl bg-[#f8f9fa] border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#ba1a1a] tracking-wider"
              />

              {deletedNotice ? (
                <div className="p-3 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 text-xs font-bold text-[#0d9468] text-center flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Tu cuenta ha sido eliminada con éxito.</span>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2.5 bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#191c1d] rounded-xl text-xs font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    id="btn-confirm-delete-account-action"
                    disabled={deleteConfirmText.trim().toUpperCase() !== 'ELIMINAR' || isDeleting}
                    onClick={handleConfirmDeleteAccount}
                    className="flex-1 py-2.5 bg-[#ba1a1a] hover:bg-[#93000a] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
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
