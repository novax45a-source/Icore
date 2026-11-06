import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { StudentOnboarding } from './components/onboarding/StudentOnboarding';
import { StudentDashboardOverview } from './components/dashboard/StudentDashboardOverview';
import { AssessmentView } from './components/assessment/AssessmentView';
import { UniversityMatchingView } from './components/universities/UniversityMatchingView';
import { ScholarshipDiscoveryView } from './components/scholarships/ScholarshipDiscoveryView';
import { ApplicationTrackerView } from './components/applications/ApplicationTrackerView';
import { PortfolioBuilderView } from './components/portfolio/PortfolioBuilderView';
import { MajorDiscoveryView } from './components/majors/MajorDiscoveryView';
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { StartupNetworkView } from './components/startups/StartupNetworkView';
import { EventsView } from './components/events/EventsView';
import { TalentIndexView } from './components/talent/TalentIndexView';
import { PartnerPortalView } from './components/partners/PartnerPortalView';
import { AdminControlCenter } from './components/admin/AdminControlCenter';
import { SettingsAndPrivacyView } from './components/settings/SettingsAndPrivacyView';
import { AiAssistantDrawer } from './components/ai/AiAssistantDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { Menu } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isOnboarded } = useAuth();

  // Query parameter check for autostart testability (from ultra-mode skill)
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return false;
    }
    return !isAuthenticated;
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    mode: 'login',
  });

  // Keep landing state synced with auth
  useEffect(() => {
    if (isAuthenticated && showLanding) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') !== '1') {
        // Can remain on dashboard
      }
    }
  }, [isAuthenticated, showLanding]);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const handleStartAssessment = () => {
    setShowLanding(false);
    setActiveTab('assessment');
  };

  const handleExploreDashboard = (targetTab: string = 'overview') => {
    setShowLanding(false);
    setActiveTab(targetTab);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC] flex flex-col font-sans transition-colors">
      {/* Top Bar (Zone 1: Wordmark, Zone 2: Nav links, Zone 3: Actions) */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onOpenAi={() => setIsAiOpen(true)}
        showLanding={showLanding}
        setShowLanding={setShowLanding}
      />

      {/* Main Content Area */}
      {showLanding ? (
        <main className="flex-1">
          <LandingPage
            onStartAssessment={handleStartAssessment}
            onExploreDashboard={handleExploreDashboard}
            onOpenAuth={handleOpenAuth}
          />
        </main>
      ) : isAuthenticated && !isOnboarded ? (
        <main className="flex-1 bg-slate-50 dark:bg-[#0B1020]">
          <StudentOnboarding
            onFinishOnboarding={() => setActiveTab('overview')}
            onStartAssessment={() => setActiveTab('assessment')}
          />
        </main>
      ) : (
        <div className="flex-1 flex w-full">
          {/* Dashboard Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpenMobile={isMobileSidebarOpen}
            setIsOpenMobile={setIsMobileSidebarOpen}
            onOpenAi={() => setIsAiOpen(true)}
          />

          {/* Main Dashboard Viewport */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50 dark:bg-[#0B1020]">
            {/* Mobile Sidebar Toggle Button */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs"
              >
                <Menu className="w-4 h-4 text-sky-400" />
                <span>Navigation Menu</span>
              </button>
            </div>

            {/* Active Tab Router */}
            {activeTab === 'overview' && (
              <StudentDashboardOverview
                onNavigateToTab={setActiveTab}
                onOpenAi={() => setIsAiOpen(true)}
              />
            )}

            {activeTab === 'assessment' && (
              <AssessmentView onNavigateToTab={setActiveTab} />
            )}

            {activeTab === 'discovery' && (
              <MajorDiscoveryView
                onMatchUniversities={(fieldId) => setActiveTab('universities')}
                onOpenAi={() => setIsAiOpen(true)}
              />
            )}

            {activeTab === 'universities' && <UniversityMatchingView />}

            {activeTab === 'scholarships' && <ScholarshipDiscoveryView />}

            {activeTab === 'applications' && <ApplicationTrackerView />}

            {activeTab === 'portfolio' && <PortfolioBuilderView />}

            {activeTab === 'opportunities' && <OpportunitiesView />}

            {activeTab === 'startups' && <StartupNetworkView />}

            {activeTab === 'events' && <EventsView />}

            {activeTab === 'talent' && <TalentIndexView onNavigateToTab={setActiveTab} />}

            {activeTab === 'partners' && <PartnerPortalView />}

            {activeTab === 'admin' && <AdminControlCenter />}

            {activeTab === 'settings' && <SettingsAndPrivacyView />}
          </main>
        </div>
      )}

      {/* AI Assistant Modal Drawer */}
      <AiAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        mode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
