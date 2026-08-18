import React, { useState } from 'react';
import { Eye, EyeOff, X, ArrowRight } from 'lucide-react';
import { MASCOTS } from '../assets/mascots';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('alex@example.com');
  const [name, setName] = useState('Alex Doe');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(name, email);
    onClose();
  };

  return (
    <div 
      id="login-modal-overlay"
      className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
    >
      <div 
        id="login-modal-card"
        className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full border border-[#e1e3e4] grid grid-cols-1 md:grid-cols-12 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#767586] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Branding Column (Lavender bg with Mascot) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#eceefe] via-[#f4f3ff] to-[#ffdcc5]/40 p-8 flex flex-col justify-between items-center text-center relative overflow-hidden border-b md:border-b-0 md:border-r border-[#e1e3e4]">
          <div className="w-full flex flex-col items-center">
            {/* Mascot in glowing frame */}
            <div className="relative w-32 h-32 rounded-full p-2 bg-gradient-to-tr from-[#6063ee] via-[#4648d4] to-[#fd933d] shadow-[0_8px_24px_rgba(70,72,212,0.25)] flex items-center justify-center my-6 group">
              <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center p-1">
                <img
                  src={MASCOTS.happyPotatoCoin}
                  alt="FinanceAI Mascot"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#4648d4] font-display">
              FinanceAI
            </h2>
            <p className="text-xs font-semibold text-[#767586] mt-0.5">
              El Experto Alentador
            </p>
          </div>

          <p className="text-xs text-[#464554] mt-6 leading-relaxed max-w-xs font-medium">
            Transforma tus transacciones en decisiones inteligentes.
          </p>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#191c1d] font-display">
              {isRegister ? '¡Crea tu cuenta!' : '¡Bienvenido!'}
            </h3>
            <p className="text-xs text-[#767586] mt-1">
              {isRegister
                ? 'Comienza a transformar tu salud financiera hoy.'
                : 'Por favor ingresa tus detalles para iniciar sesión.'}
            </p>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => {
              onLoginSuccess('Alex Doe (Google)', 'alex.google@example.com');
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-[#e1e3e4] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#191c1d] flex items-center justify-center gap-2.5 transition-all shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-[#e1e3e4]" />
            <span className="px-3 text-[11px] text-[#767586] font-medium uppercase">o</span>
            <div className="flex-1 border-t border-[#e1e3e4]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-semibold text-[#464554] mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="Alex Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4]"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#464554] mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#464554] mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e1e3e4] text-[#191c1d] focus:outline-none focus:border-[#4648d4] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767586] hover:text-[#191c1d]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#464554]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#4648d4] focus:ring-[#4648d4]"
                />
                <span>Recuérdame</span>
              </label>

              <a href="#forgot" className="text-[#4648d4] font-semibold hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#4648d4] hover:bg-[#393bb8] text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_14px_rgba(70,72,212,0.3)] active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
            >
              <span>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-[#767586] mt-5">
            {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#4648d4] font-bold hover:underline"
            >
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
