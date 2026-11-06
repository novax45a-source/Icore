import React, { useState } from 'react';
import {
  Globe,
  LogOut,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  Search,
  Sun,
  Moon,
  Eye,
  X,
  Shield,
  User,
  Users,
} from 'lucide-react';
import { useAuth, FOUNDER_EMAIL, PREVIEW_PERSONAS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Language, UserRole } from '../lib/types';
import { t } from '../lib/localization';
import { EnvoLogo } from './EnvoLogo';

interface NavbarProps {
  onOpenClassroomDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenClassroomDemo }) => {
  const {
    effectiveUser,
    previewMode,
    previewRole,
    enterPreview,
    exitPreview,
    language,
    setLanguage,
    logout,
    activeView,
    setActiveView,
  } = useAuth();
  
  const { theme, toggleTheme } = useTheme();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const roleBadgeMap: Record<UserRole, { label: string; color: string }> = {
    student: { label: 'Mustaqil O‘quvchi', color: 'bg-blue-500/15 text-[#1F5BFF] dark:text-[#8EC5FF] border-[#1F5BFF]/30' },
    teacher: { label: 'Mustaqil O‘qituvchi', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
    lc_admin: { label: 'Markaz Admini', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30' },
    super_admin: { label: 'Super Admin', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
    parent: { label: 'Ota-ona', color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' },
  };

  return (
    <>
      {/* Top Banner when in Isolated Preview Sandbox Mode */}
      {previewMode && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md z-50">
          <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1">
            <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black uppercase tracking-wider">
              Preview Sandbox
            </span>
            <span>
              Simulyatsiya qilingan ko‘rinish: <strong>{previewRole ? roleBadgeMap[previewRole]?.label : 'Demo'}</strong>.
              Bu ko‘rinish faqat interfeysni sinash uchun bo‘lib, real foydalanuvchi hisobingizga yoki ma’lumotlar bazasiga ta’sir qilmaydi.
            </span>
          </div>
          <button
            onClick={exitPreview}
            className="px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 text-white text-[11px] font-bold transition flex items-center gap-1.5 ml-3"
          >
            <X className="w-3.5 h-3.5" />
            Sinovdan chiqish
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1F5BFF]/20 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Official Brand Logo & Main Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            <EnvoLogo
              size="md"
              onClick={() => setActiveView('landing')}
            />

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveView('marketplace')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  activeView === 'marketplace'
                    ? 'bg-blue-50 dark:bg-[#1F5BFF]/20 text-[#1F5BFF] dark:text-[#8EC5FF] font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Search className="w-4 h-4" />
                {t('exploreMarketplace', language)}
              </button>

              <button
                onClick={() => setActiveView('center_saas')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  activeView === 'center_saas'
                    ? 'bg-blue-50 dark:bg-[#1F5BFF]/20 text-[#1F5BFF] dark:text-[#8EC5FF] font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
                {t('centerSaaS', language)}
              </button>

              <button
                onClick={() => setActiveView('teacher_application')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  activeView === 'teacher_application'
                    ? 'bg-blue-50 dark:bg-[#1F5BFF]/20 text-[#1F5BFF] dark:text-[#8EC5FF] font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                {t('becomeTeacher', language)}
              </button>

              {onOpenClassroomDemo && (
                <button
                  onClick={onOpenClassroomDemo}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/50 transition flex items-center gap-1.5 ml-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  Virtual Sinfxona
                </button>
              )}
            </nav>
          </div>

          {/* Right Controls: Theme, Language, Isolated Preview Launcher, User Account */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle (Design 2: Premium Dark & Light Mode) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#1F5BFF]/25 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={theme === 'dark' ? "Yorug' rejimga o'tish (Light Mode)" : "Qorong'i rejimga o'tish (Design 2: Premium Dark)"}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1F5BFF]" />}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1F5BFF]/25 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                {language.toUpperCase()}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#0B1220] rounded-xl shadow-xl border border-slate-100 dark:border-[#1F5BFF]/30 py-1 z-50 animate-in fade-in">
                  {[
                    { code: 'uz', label: "O'zbekcha" },
                    { code: 'ru', label: 'Русский' },
                    { code: 'en', label: 'English' },
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code as Language);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        language === item.code ? 'text-[#1F5BFF] dark:text-[#8EC5FF] font-bold bg-blue-50/50 dark:bg-blue-900/30' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.label}
                      {language === item.code && <span className="w-1.5 h-1.5 rounded-full bg-[#1F5BFF]"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Isolated Preview Sandbox Button (Only for simulation, completely separated from real accounts) */}
            <button
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1F5BFF]/10 hover:bg-slate-200 dark:hover:bg-[#1F5BFF]/20 border border-slate-200 dark:border-[#1F5BFF]/30 text-xs font-medium text-slate-700 dark:text-[#8EC5FF] transition"
              title="Ko‘rgazmali Sinov Rejimi"
            >
              <Eye className="w-3.5 h-3.5 text-[#1F5BFF] dark:text-[#8EC5FF]" />
              <span className="hidden lg:inline">Ko‘rgazmali Demo</span>
            </button>

            {/* Authoritative User Identity or Auth CTAs */}
            {effectiveUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-white/10">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                    {effectiveUser.name}
                  </span>
                  <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold border ${roleBadgeMap[effectiveUser.role]?.color || 'bg-slate-100 text-slate-700'}`}>
                    {roleBadgeMap[effectiveUser.role]?.label || effectiveUser.role}
                  </span>
                </div>

                <button
                  onClick={() => setActiveView('dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F5BFF] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kabinetim</span>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  title={t('logout', language)}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-white/10">
                <button
                  onClick={() => setActiveView('auth')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1F5BFF] hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-[#1F5BFF]/25 transition"
                >
                  {t('login', language)}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Dedicated Preview Sandbox Modal (Zero Account Mutation) */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B1220] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-[#1F5BFF]/30 relative animate-in fade-in space-y-4">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[11px] font-bold border border-amber-500/30 mb-2">
                <Eye className="w-3.5 h-3.5" />
                Izolyatsiyalangan Sinov Sandbox
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ko‘rgazmali Interfeysni Sinash
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ushbu bo‘lim faqat tizim imkoniyatlarini sinab ko‘rish uchun simulyatsiya bo‘lib, real ma’lumotlar bazasiga yoki haqiqiy foydalanuvchi hisobingizga ta’sir qilmaydi.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  enterPreview('student');
                  setShowPreviewModal(false);
                }}
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/25 hover:border-[#1F5BFF] text-left transition flex items-center justify-between group bg-slate-50 dark:bg-[#050B1A]"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#1F5BFF]">
                    Mustaqil O‘quvchi (Student Sandbox)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Bobur Mirzayev &bull; Mini-guruhlar, imtihonlar, to‘lov cheklari
                  </p>
                </div>
                <GraduationCap className="w-4 h-4 text-[#1F5BFF]" />
              </button>

              <button
                onClick={() => {
                  enterPreview('teacher');
                  setShowPreviewModal(false);
                }}
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/25 hover:border-[#1F5BFF] text-left transition flex items-center justify-between group bg-slate-50 dark:bg-[#050B1A]"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-500">
                    Mustaqil O‘qituvchi (Teacher Sandbox)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Jasur Aliyev &bull; 83% Hamyon, 1–3 kishilik guruhlar, dars jadvali
                  </p>
                </div>
                <Users className="w-4 h-4 text-emerald-500" />
              </button>

              <button
                onClick={() => {
                  enterPreview('lc_admin');
                  setShowPreviewModal(false);
                }}
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/25 hover:border-[#1F5BFF] text-left transition flex items-center justify-between group bg-slate-50 dark:bg-[#050B1A]"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-purple-500">
                    O‘quv Markazi Admini (LC Admin Sandbox)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Registon LC &bull; 30 kunlik SaaS obuna, sinflar, filial boshqaruvi
                  </p>
                </div>
                <Building2 className="w-4 h-4 text-purple-500" />
              </button>

              <button
                onClick={() => {
                  enterPreview('super_admin');
                  setShowPreviewModal(false);
                }}
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/25 hover:border-[#1F5BFF] text-left transition flex items-center justify-between group bg-slate-50 dark:bg-[#050B1A]"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-500">
                    Global Nazorat (Super Admin Sandbox)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {FOUNDER_EMAIL} &bull; Verifikatsiyalar, 17% komissiya, LC to‘lovlari
                  </p>
                </div>
                <Shield className="w-4 h-4 text-amber-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
