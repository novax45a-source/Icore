import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { AppLanguage, UserRole } from '../../types';
import { IcsnLogo } from '../common/IcsnLogo';
import { Moon, Sun, Globe, Shield, Sparkles, UserCheck, ArrowRight } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAi: () => void;
  showLanding: boolean;
  setShowLanding: (show: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenAi,
  showLanding,
  setShowLanding,
}) => {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchRole(e.target.value as UserRole);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#070B14]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Distinctive New Vector Brand Logo */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setShowLanding(true)}
            className="flex items-center text-left focus:outline-none group"
            title="ICSN Home"
          >
            <IcsnLogo size="sm" />
          </button>
        </div>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => {
              setShowLanding(false);
              setActiveTab('discovery');
            }}
            className={`hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${
              !showLanding && activeTab === 'discovery' ? 'text-sky-400 font-semibold' : ''
            }`}
          >
            {t('nav.discovery')}
          </button>
          <button
            onClick={() => {
              setShowLanding(false);
              setActiveTab('assessment');
            }}
            className={`hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${
              !showLanding && activeTab === 'assessment' ? 'text-sky-400 font-semibold' : ''
            }`}
          >
            {t('nav.assessment')}
          </button>
          <button
            onClick={() => {
              setShowLanding(false);
              setActiveTab('universities');
            }}
            className={`hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${
              !showLanding && activeTab === 'universities' ? 'text-sky-400 font-semibold' : ''
            }`}
          >
            {t('nav.universities')}
          </button>
          <button
            onClick={() => {
              setShowLanding(false);
              setActiveTab('scholarships');
            }}
            className={`hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${
              !showLanding && activeTab === 'scholarships' ? 'text-sky-400 font-semibold' : ''
            }`}
          >
            {t('nav.scholarships')}
          </button>
          <button
            onClick={() => {
              setShowLanding(false);
              setActiveTab('portfolio');
            }}
            className={`hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${
              !showLanding && activeTab === 'portfolio' ? 'text-sky-400 font-semibold' : ''
            }`}
          >
            {t('nav.portfolio')}
          </button>
        </nav>

        {/* Zone 3: Controls & Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* AI Navigator Drawer Trigger */}
          <button
            onClick={onOpenAi}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-all whitespace-nowrap"
            title="Open Dedicated ICSN AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Assistant</span>
          </button>

          {/* Language Switcher */}
          <div className="relative inline-flex items-center">
            <label htmlFor="language-select" className="sr-only">Select language</label>
            <Globe className="w-3.5 h-3.5 absolute left-2 text-slate-400 pointer-events-none" />
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="pl-7 pr-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="uz">UZ</option>
              <option value="ru">RU</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>

          {/* Role Switcher (Safe Dev & Auditing Control) */}
          {isAuthenticated && (
            <div className="hidden xl:inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <label htmlFor="role-select" className="sr-only">Role View</label>
              <select
                id="role-select"
                value={user?.role}
                onChange={handleRoleChange}
                className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="student">Role: Student (Free)</option>
                <option value="partner_school">Role: Partner School</option>
                <option value="partner_scholarship">Role: Scholarship Provider</option>
                <option value="partner_employer">Role: Recruiter / Employer</option>
                <option value="partner_volunteer">Role: Startup / NGO</option>
                <option value="admin">Role: Platform Admin</option>
              </select>
            </div>
          )}

          {/* Auth Button or User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowLanding(false);
                  setActiveTab(user?.role === 'admin' ? 'admin' : user?.role.startsWith('partner_') ? 'partners' : 'overview');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 text-white hover:bg-sky-500 shadow-sm transition-all whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span className="max-w-[100px] truncate">{user?.firstName || 'Dashboard'}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2 py-1.5 transition-colors"
                title="Sign out of ICSN"
              >
                {t('cta.signOut')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-sky-400 transition-colors whitespace-nowrap"
              >
                {t('cta.signIn')}
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-600 to-emerald-600 text-white hover:opacity-95 shadow-sm transition-all whitespace-nowrap"
              >
                <span>{t('cta.getStarted')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
