import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { TeacherApplicationPage } from './pages/TeacherApplicationPage';
import { CenterWorkspace } from './pages/CenterWorkspace';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { LcAdminDashboard } from './pages/LcAdminDashboard';
import { CenterTeacherDashboard } from './pages/CenterTeacherDashboard';
import { CenterStudentDashboard } from './pages/CenterStudentDashboard';
import { ParentPortal } from './pages/ParentPortal';
import { VirtualClassroomModal } from './components/VirtualClassroomModal';
import { VoiceConversationModal } from './components/VoiceConversationModal';
import { JarvisFloatingWidget } from './components/JarvisFloatingWidget';
import { EnvoLogo } from './components/EnvoLogo';
import { Building2, GraduationCap, Users } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, effectiveUser, activeView, setActiveView } = useAuth();

  // Classroom modal state
  const [classroomData, setClassroomData] = useState<{
    isOpen: boolean;
    title: string;
    teacher: string;
  }>({
    isOpen: false,
    title: 'IELTS Writing & Speaking (Mini-Guruh)',
    teacher: 'Jasur Aliyev',
  });

  // Voice Conversation Modal state (gemini-3.8-live)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  React.useEffect(() => {
    (window as any).openLiveVoiceModal = () => setIsVoiceModalOpen(true);
  }, []);

  const openClassroom = (title: string, teacher: string) => {
    setClassroomData({
      isOpen: true,
      title,
      teacher,
    });
  };

  // Determine which dashboard to render based on user role and account_scope
  const renderDashboardByScope = () => {
    if (!effectiveUser) {
      return <LandingPage onOpenClassroomDemo={() => openClassroom('IELTS Target 7.5+', 'Jasur Aliyev')} />;
    }

    // 1. Super Admin (Locked strictly to founder novax45.a@gmail.com or authorized admin)
    if (effectiveUser.role === 'super_admin') {
      return <SuperAdminDashboard />;
    }

    // 2. Learning Center Administrator (Business Model A)
    if (effectiveUser.role === 'lc_admin') {
      return <LcAdminDashboard />;
    }

    // 3. Independent Teacher (Business Model B)
    if (effectiveUser.role === 'teacher' && effectiveUser.accountScope === 'independent') {
      return <TeacherDashboard onOpenClassroom={openClassroom} />;
    }

    // 4. Learning Center Teacher (Business Model A)
    if (effectiveUser.role === 'teacher' && effectiveUser.accountScope === 'center') {
      return <CenterTeacherDashboard onOpenClassroom={openClassroom} />;
    }

    // 5. Independent Student (Business Model B Mobile-First)
    if (effectiveUser.role === 'student' && effectiveUser.accountScope === 'independent') {
      return (
        <StudentDashboard
          onOpenClassroom={openClassroom}
          onExploreTeachers={() => setActiveView('marketplace')}
        />
      );
    }

    // 6. Learning Center Student (Business Model A)
    if (effectiveUser.role === 'student' && effectiveUser.accountScope === 'center') {
      return <CenterStudentDashboard onOpenClassroom={openClassroom} />;
    }

    // 7. Parent Portal (Business Model A)
    if (effectiveUser.role === 'parent') {
      return <ParentPortal />;
    }

    return <LandingPage onOpenClassroomDemo={() => openClassroom('IELTS Target 7.5+', 'Jasur Aliyev')} />;
  };

  const { theme } = useTheme();

  return (
    <div className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#070B12] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      <div>
        <Navbar onOpenClassroomDemo={() => openClassroom('Demo Virtual Sinfxona', 'Jasur Aliyev')} />

        <main className="pb-12">
          {activeView === 'landing' && (
            <LandingPage onOpenClassroomDemo={() => openClassroom('Demo Virtual Sinfxona', 'Jasur Aliyev')} />
          )}

          {activeView === 'marketplace' && (
            <MarketplacePage onOpenClassroom={openClassroom} />
          )}

          {activeView === 'teacher_application' && (
            <TeacherApplicationPage />
          )}

          {activeView === 'center_saas' && (
            <CenterWorkspace />
          )}

          {activeView === 'auth' && (
            <AuthPage />
          )}

          {activeView === 'dashboard' && renderDashboardByScope()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <EnvoLogo size="sm" showTagline={true} />
            <span className="hidden md:inline text-slate-500">&bull;</span>
            <span className="hidden md:inline text-slate-400">Learning Center SaaS & Independent Marketplace</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Toshkent, O‘zbekiston</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-medium">83% / 17% Split Himoyalangan</span>
          </div>
        </div>
      </footer>

      {/* Fullscreen Virtual Classroom Modal */}
      {classroomData.isOpen && (
        <VirtualClassroomModal
          lessonTitle={classroomData.title}
          teacherName={classroomData.teacher}
          onClose={() => setClassroomData((prev) => ({ ...prev, isOpen: false }))}
        />
      )}

      {/* Gemini 3.8 Live Voice Conversation Modal */}
      {isVoiceModalOpen && (
        <VoiceConversationModal onClose={() => setIsVoiceModalOpen(false)} />
      )}

      {/* Floating JARVIS AI Assistant Widget (Universal Access Across All Views) */}
      <JarvisFloatingWidget />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
