import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { useAuth, FOUNDER_EMAIL } from '../context/AuthContext';
import { EnvoLogo } from '../components/EnvoLogo';

export const AuthPage: React.FC = () => {
  const { login, registerStudent, loginWithGoogle, setActiveView } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Kirishda xatolik yuz berdi.');
        }
      } else {
        // Authoritative Student registration by default
        const res = await registerStudent(email, password, fullName);
        if (!res.success) {
          setErrorMessage(res.error || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillFounderEmail = () => {
    setEmail(FOUNDER_EMAIL);
    setPassword('founder_secure_pass_123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-[#0B1220] rounded-3xl border border-slate-200 dark:border-[#1F5BFF]/30 p-8 shadow-2xl transition-colors">
        <div className="flex flex-col items-center text-center mb-6">
          <EnvoLogo size="lg" showTagline={true} className="mb-4" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {mode === 'login' ? 'ENVO Platformasiga Kirish' : 'O‘quvchi Sifatida Ro‘yxatdan O‘tish'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Learning Center SaaS & Independent Teacher Marketplace
          </p>
        </div>

        {/* Quick Founder Credential Helper for Authorized Testing */}
        <div className="p-3 mb-6 rounded-2xl bg-[#1F5BFF]/10 dark:bg-[#1F5BFF]/20 border border-[#1F5BFF]/30 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#1F5BFF] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-slate-900 dark:text-white">Founder & Super Admin Kirish:</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              <strong>{FOUNDER_EMAIL}</strong> orqali kirilganda global platforma nazorat kabineti ochiladi.
            </p>
            <button
              type="button"
              onClick={fillFounderEmail}
              className="text-[11px] font-bold text-[#1F5BFF] dark:text-[#8EC5FF] underline mt-1 block"
            >
              Ushbu pochtani to‘ldirish &rarr;
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition shadow-xs mb-4"
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
          Google orqali davom etish
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white dark:bg-[#0B1220] px-2 text-slate-400 font-semibold">yoki email orqali</span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-4">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              mode === 'login' ? 'bg-white dark:bg-[#050B1A] text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Kirish
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              mode === 'register' ? 'bg-white dark:bg-[#050B1A] text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Ro‘yxatdan o‘tish
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">To‘liq ism (F.I.SH.) *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Bobur Mirzayev"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-[#1F5BFF]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email manzil *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="misol@envo.uz"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-[#1F5BFF]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parol *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-[#1F5BFF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-[#1F5BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-[#1F5BFF]/30 transition disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Yuklanmoqda...' : mode === 'login' ? 'Hisobga kirish' : 'O‘quvchi hisobini ochish'}
          </button>
        </form>

        {/* Dedicated Separate Flows for Prospective Teachers and Learning Centers */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#050B1A] border border-slate-200 dark:border-[#1F5BFF]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">
                  O‘qituvchi bo‘lib ishlashni xohlaysizmi?
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  83% daromad &bull; Verifikatsiyadan o‘tish lozim
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('teacher_application')}
              className="text-[11px] font-bold text-[#1F5BFF] dark:text-[#8EC5FF] flex items-center gap-1 hover:underline"
            >
              Ariza topshirish &rarr;
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#050B1A] border border-slate-200 dark:border-[#1F5BFF]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">
                  O‘quv Markazingizni ulamoqchimisiz?
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  SaaS tizimi &bull; 30 kunlik obuna modeli
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('center_saas')}
              className="text-[11px] font-bold text-[#1F5BFF] dark:text-[#8EC5FF] flex items-center gap-1 hover:underline"
            >
              Markazni ulash &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
