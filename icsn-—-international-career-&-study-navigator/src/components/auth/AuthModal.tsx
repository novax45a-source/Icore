import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IcsnLogo } from '../common/IcsnLogo';
import {
  X,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Compass,
  GraduationCap,
  Award,
  CheckCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  mode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  mode: propMode,
}) => {
  const { login, loginWithGoogle, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify'>(propMode || initialMode);

  // Sync mode if prop changes
  React.useEffect(() => {
    if (propMode) {
      setMode(propMode);
    }
  }, [propMode]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('Uzbekistan');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'login') {
        login(email);
        onClose();
      } else if (mode === 'register') {
        register({
          email,
          firstName,
          lastName,
          country,
          dateOfBirth,
        });
        onClose();
      } else if (mode === 'forgot') {
        setRecoverySent(true);
        setTimeout(() => {
          setRecoverySent(false);
          setMode('login');
        }, 2200);
      }
    }, 400);
  };

  const handleGoogleClick = () => {
    loginWithGoogle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#070B14] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 transition-colors"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Premium Ecosystem Showcase */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#0B1120] to-[#070B14] border-b md:border-b-0 md:border-r border-slate-800/80 p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Lighting Accents */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-6">
            <IcsnLogo size="md" subtitle="" />

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white tracking-tight leading-snug">
                Your Future. <br />
                Your Opportunities. <br />
                <span className="text-sky-400">Your Path.</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your ambition to verified international universities, fully funded grants, and high-impact STEM portfolios.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0 mt-0.5">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">30-Q Discovery Test</h5>
                  <p className="text-[11px] text-slate-400">Algorithmic mapping across 12 multidisciplinary fields.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">18-Factor Matching</h5>
                  <p className="text-[11px] text-slate-400">Verified minimum GPA, IELTS, and living expenses.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">Verified Scholarships</h5>
                  <p className="text-[11px] text-slate-400">Direct application links to official government awards.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Under-18 Privacy Shield Note */}
          <div className="relative pt-6 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Under-18 students receive full private data masking by default.</span>
          </div>
        </div>

        {/* Right Side: Interactive Authentication Form */}
        <div className="w-full md:w-7/12 p-8 flex flex-col justify-center space-y-5 bg-[#070B14]">
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-sky-400">
              {mode === 'login' ? 'Authentication' : mode === 'register' ? 'Free Student Onboarding' : 'Account Recovery'}
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {mode === 'login'
                ? 'Welcome Back'
                : mode === 'register'
                ? 'Start Your Global Journey'
                : 'Reset Your Credentials'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'login'
                ? 'Enter your student email and password to access your navigator.'
                : mode === 'register'
                ? 'Access all 30 questions, match engines, and portfolio tools completely free.'
                : 'Provide your registered email address to receive password recovery instructions.'}
            </p>
          </div>

          {/* Google Sign In Option */}
          {mode !== 'forgot' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleClick}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2.5 shadow-sm"
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
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <div className="flex-1 h-px bg-slate-800" />
                <span>or standard credentials</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Aziz"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Karimov"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Student Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Current Country</label>
                  <input
                    type="text"
                    placeholder="Uzbekistan"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>
            )}

            {recoverySent && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Password recovery instructions dispatched to {email}. Redirecting...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? 'Sign In to Navigator'
                      : mode === 'register'
                      ? 'Create Free Account'
                      : 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switcher */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
            {mode === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="hover:text-slate-200 transition-colors"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                >
                  Create free account
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
              >
                Already have an account? Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
