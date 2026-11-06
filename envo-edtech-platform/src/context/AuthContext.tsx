import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AccountScope, Language } from '../lib/types';
import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';
import { mockDb } from '../lib/mockDatabase';

export const FOUNDER_EMAIL = 'novax45.a@gmail.com';

export const PREVIEW_PERSONAS: Record<string, UserProfile> = {
  student: {
    id: 'student-demo',
    email: 'bobur.student@envo.uz',
    name: 'Bobur Mirzayev (Mustaqil O‘quvchi)',
    role: 'student',
    accountScope: 'independent',
    centerId: null,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  },
  teacher: {
    id: 'teacher-101',
    email: 'jasur.teacher@envo.uz',
    name: 'Jasur Aliyev (Mustaqil O‘qituvchi)',
    role: 'teacher',
    accountScope: 'independent',
    centerId: null,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  lc_admin: {
    id: 'lcadmin-1',
    email: 'admin@registon.uz',
    name: 'Aziz Raximov (Registon LC Admin)',
    role: 'lc_admin',
    accountScope: 'center',
    centerId: 'center-1',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  super_admin: {
    id: 'usr-founder-001',
    email: FOUNDER_EMAIL,
    name: 'Novax (Founder & Super Admin)',
    role: 'super_admin',
    accountScope: 'platform',
    centerId: null,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
};

interface AuthContextType {
  // Authoritative real authenticated identity
  user: UserProfile | null;
  // Effective user (real user or simulated preview persona)
  effectiveUser: UserProfile | null;
  // Isolated preview sandbox controls
  previewMode: boolean;
  previewRole: UserRole | null;
  enterPreview: (role: UserRole) => void;
  exitPreview: () => void;
  
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  activeView: string;
  setActiveView: (view: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real authenticated user: null by default for unauthenticated guests
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('envo_auth_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return null;
  });

  // Isolated Preview Sandbox Mode
  const [previewMode, setPreviewMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('envo_preview_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [previewRole, setPreviewRole] = useState<UserRole | null>(() => {
    try {
      const stored = localStorage.getItem('envo_preview_role');
      if (stored) return stored as UserRole;
    } catch {
      // Ignore
    }
    return previewMode ? 'super_admin' : null;
  });

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('envo_lang');
      if (stored === 'ru' || stored === 'en' || stored === 'uz') return stored;
    } catch {
      // Ignore
    }
    return 'uz';
  });

  // Default active view: dashboard if logged in or previewing, landing page otherwise
  const [activeView, setActiveView] = useState<string>(() => {
    if (user || previewMode) return 'dashboard';
    return 'landing';
  });

  // Persist real authenticated user
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('envo_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('envo_auth_user');
      }
    } catch {
      // Ignore
    }
  }, [user]);

  // Persist preview state
  useEffect(() => {
    try {
      localStorage.setItem('envo_preview_mode', String(previewMode));
      if (previewRole) {
        localStorage.setItem('envo_preview_role', previewRole);
      } else {
        localStorage.removeItem('envo_preview_role');
      }
    } catch {
      // Ignore
    }
  }, [previewMode, previewRole]);

  useEffect(() => {
    try {
      localStorage.setItem('envo_lang', language);
    } catch {
      // Ignore
    }
  }, [language]);

  // Handle Google OAuth check using authoritative Supabase Auth identity
  useEffect(() => {
    if (isLiveSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const email = (session.user.email || '').trim().toLowerCase();
          const isFounder = email === FOUNDER_EMAIL.toLowerCase();

          // Check if user has an existing role registered in profiles
          const dbState = mockDb.getState();
          const existingTeacher = dbState.teacherProfiles.find((t) => t.userId === session.user.id);
          const isApprovedTeacher = Boolean(existingTeacher);

          let resolvedRole: UserRole = 'student';
          let resolvedScope: AccountScope = 'independent';

          if (isFounder) {
            resolvedRole = 'super_admin';
            resolvedScope = 'platform';
          } else if (isApprovedTeacher) {
            resolvedRole = 'teacher';
            resolvedScope = 'independent';
          }

          setUser({
            id: session.user.id,
            email,
            name: session.user.user_metadata?.full_name || (isFounder ? 'Founder (Novax)' : email.split('@')[0]),
            role: resolvedRole,
            accountScope: resolvedScope,
            centerId: null,
            avatarUrl: session.user.user_metadata?.avatar_url,
          });
          setActiveView('dashboard');
        }
      });
    }
  }, []);

  // Public Student Registration: always assigns role 'student' and scope 'independent'
  const registerStudent = async (email: string, _pass: string, name: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanName) {
      return { success: false, error: 'Barcha maydonlarni to‘ldiring.' };
    }

    if (isLiveSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: _pass,
          options: {
            data: { full_name: cleanName, role: 'student' },
          },
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const newStudent: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            name: cleanName,
            role: 'student',
            accountScope: 'independent',
            centerId: null,
          };
          setUser(newStudent);
          setActiveView('dashboard');
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Authoritative student profile
    const newStudent: UserProfile = {
      id: 'std-' + Date.now(),
      email: cleanEmail,
      name: cleanName,
      role: 'student',
      accountScope: 'independent',
      centerId: null,
    };

    setUser(newStudent);
    setActiveView('dashboard');
    return { success: true };
  };

  // Authoritative Login
  const login = async (email: string, _pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isFounder = cleanEmail === FOUNDER_EMAIL.toLowerCase();

    if (isLiveSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: _pass,
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const dbState = mockDb.getState();
          const existingTeacher = dbState.teacherProfiles.find((t) => t.userId === data.user.id);
          
          let role: UserRole = 'student';
          let scope: AccountScope = 'independent';
          if (isFounder) {
            role = 'super_admin';
            scope = 'platform';
          } else if (existingTeacher) {
            role = 'teacher';
            scope = 'independent';
          }

          setUser({
            id: data.user.id,
            email: data.user.email || cleanEmail,
            name: isFounder ? 'Novax (Founder & Super Admin)' : data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            role,
            accountScope: scope,
            centerId: null,
          });
          setActiveView('dashboard');
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Check credentials against authoritative identities
    if (isFounder) {
      setUser(PREVIEW_PERSONAS.super_admin);
      setActiveView('dashboard');
      return { success: true };
    }

    if (cleanEmail.includes('teacher') || cleanEmail.includes('jasur')) {
      setUser(PREVIEW_PERSONAS.teacher);
      setActiveView('dashboard');
      return { success: true };
    }

    if (cleanEmail.includes('admin@registon') || cleanEmail.includes('center')) {
      setUser(PREVIEW_PERSONAS.lc_admin);
      setActiveView('dashboard');
      return { success: true };
    }

    // Standard student user
    setUser({
      id: 'std-' + Date.now(),
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'student',
      accountScope: 'independent',
      centerId: null,
    });
    setActiveView('dashboard');
    return { success: true };
  };

  const loginWithGoogle = async () => {
    if (isLiveSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      return;
    }

    // In offline demo fallback, sign in as student by default unless founder
    setUser({
      id: 'google-usr-' + Date.now(),
      email: 'student.google@envo.uz',
      name: 'Google O‘quvchi',
      role: 'student',
      accountScope: 'independent',
      centerId: null,
    });
    setActiveView('dashboard');
  };

  const logout = async () => {
    if (isLiveSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore
      }
    }
    setUser(null);
    setPreviewMode(false);
    setPreviewRole(null);
    localStorage.removeItem('envo_auth_user');
    localStorage.removeItem('envo_preview_mode');
    localStorage.removeItem('envo_preview_role');
    setActiveView('landing');
  };

  // Preview Sandbox controls: strictly simulated, never alters real user record
  const enterPreview = (role: UserRole) => {
    setPreviewMode(true);
    setPreviewRole(role);
    setActiveView('dashboard');
  };

  const exitPreview = () => {
    setPreviewMode(false);
    setPreviewRole(null);
    if (!user) {
      setActiveView('landing');
    } else {
      setActiveView('dashboard');
    }
  };

  // Compute effective user
  const effectiveUser = previewMode && previewRole
    ? PREVIEW_PERSONAS[previewRole] || user
    : user;

  return (
    <AuthContext.Provider
      value={{
        user,
        effectiveUser,
        previewMode,
        previewRole,
        enterPreview,
        exitPreview,
        language,
        setLanguage,
        login,
        registerStudent,
        loginWithGoogle,
        logout,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
