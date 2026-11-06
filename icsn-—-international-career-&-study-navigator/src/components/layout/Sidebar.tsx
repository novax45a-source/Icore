import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Sparkles,
  Compass,
  CheckCircle2,
  GraduationCap,
  Award,
  FileText,
  Briefcase,
  Rocket,
  Calendar,
  TrendingUp,
  Settings,
  Building2,
  ShieldAlert,
  FolderKanban,
  Bell,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenAi: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  onOpenAi,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { applications, notifications } = useApp();

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const studentNavItems = [
    { id: 'overview', label: t('nav.overview'), icon: LayoutDashboard },
    { id: 'ai_assistant', label: t('nav.aiAssistant'), icon: Sparkles, badge: 'AI', isAi: true },
    { id: 'assessment', label: t('nav.assessment'), icon: CheckCircle2 },
    { id: 'discovery', label: t('nav.discovery'), icon: Compass },
    { id: 'universities', label: t('nav.universities'), icon: GraduationCap },
    { id: 'scholarships', label: t('nav.scholarships'), icon: Award },
    {
      id: 'applications',
      label: t('nav.applications'),
      icon: FolderKanban,
      count: applications.length,
    },
    { id: 'portfolio', label: t('nav.portfolio'), icon: FileText, highlight: true },
    { id: 'opportunities', label: t('nav.opportunities'), icon: Briefcase },
    { id: 'startups', label: t('nav.startups'), icon: Rocket },
    { id: 'events', label: t('nav.events'), icon: Calendar },
    { id: 'talent', label: t('nav.talentIndex'), icon: TrendingUp },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  const handleTabClick = (tabId: string, isAi?: boolean) => {
    if (isAi) {
      onOpenAi();
    } else {
      setActiveTab(tabId);
    }
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070B14] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Role Indicator Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800/90 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Account Type
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/20 text-sky-400 font-mono">
                {user?.role === 'admin'
                  ? 'Administrator'
                  : user?.role.startsWith('partner_')
                  ? 'Verified Partner'
                  : 'Student (Free)'}
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest Explorer'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user?.schoolOrUniversity || user?.city || 'Global Student'}
            </p>
          </div>

          {/* Student Navigation Group */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Student Navigation
            </div>
            <nav className="space-y-1">
              {studentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id, item.isAi)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
                      isActive
                        ? 'bg-sky-500/15 text-sky-400 font-semibold border-l-2 border-sky-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0B1120] hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-sky-400'
                            : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.highlight && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                          Priority
                        </span>
                      )}
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/15 border border-sky-500/20 text-sky-400">
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && item.count > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Institutional & Admin Portal Navigation */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Management & Partners
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => handleTabClick('partners')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
                  activeTab === 'partners'
                    ? 'bg-sky-500/15 text-sky-400 font-semibold border-l-2 border-sky-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0B1120] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Building2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                  <span className="truncate">{t('nav.partnerDashboard')}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Verified</span>
              </button>

              <button
                onClick={() => handleTabClick('admin')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
                  activeTab === 'admin'
                    ? 'bg-rose-500/15 text-rose-400 font-semibold border-l-2 border-rose-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0B1120] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                  <span className="truncate">{t('nav.adminControl')}</span>
                </div>
                <span className="text-[10px] text-sky-400 font-mono">Secure</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer with Notification status */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0B1120]">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-slate-400" />
              <span>Notifications</span>
            </div>
            {unreadNotificationsCount > 0 ? (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                {unreadNotificationsCount} new
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">All read</span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
