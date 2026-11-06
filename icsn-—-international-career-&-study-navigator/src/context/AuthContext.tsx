import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  loginWithGoogle: () => void;
  register: (data: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  switchRole: (newRole: UserRole) => void;
  isOnboarded: boolean;
  completeOnboarding: (onboardingData: Partial<UserProfile>) => void;
}

const DEFAULT_STUDENT_PROFILE: UserProfile = {
  id: 'usr_student_demo_01',
  email: 'student@icsn-navigator.org',
  role: 'student',
  firstName: 'Aziz',
  lastName: 'Karimov',
  country: 'Uzbekistan',
  city: 'Tashkent',
  dateOfBirth: '2007-04-12',
  isMinor: false, // 19 years old in 2026
  educationLevel: 'High School Senior / Pre-University',
  gradeOrYear: 'Grade 11 / Year 12',
  schoolOrUniversity: 'Tashkent Specialized IT Lyceum',
  preferredLanguage: 'en',
  interests: ['field_cs_ai', 'field_eng_mech'],
  educationGoals: 'Secure full merit scholarship for undergraduate studies in Computer Science & Robotics in Germany or South Korea.',
  careerGoals: 'Lead autonomous robotics and AI engineering teams, building scalable open systems.',
  gpa: 3.82,
  ieltsScore: 7.5,
  toeflScore: 102,
  targetBudgetUsd: 6000,
  targetCountries: ['Germany', 'South Korea', 'Singapore'],
  guardianConsentGranted: true,
  privacySettings: {
    profilePublic: false, // Private by default as required
    allowCandidateSearchByVerifiedPartners: true, // Controlled consent-based discovery
    hideContactDetails: true,
    sharePortfolioSections: {
      bio: true,
      education: true,
      projects: true,
      skills: true,
      certificates: true,
    },
  },
  createdAt: '2026-09-01T08:00:00.000Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('icsn_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_STUDENT_PROFILE;
      }
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('icsn_onboarded') !== 'false';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('icsn_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('icsn_user_profile');
    }
  }, [user]);

  const login = (email: string, role: UserRole = 'student') => {
    const isSpecialAdmin = email.toLowerCase().includes('admin');
    const isSpecialPartner = email.toLowerCase().includes('partner');

    const determinedRole: UserRole = isSpecialAdmin ? 'admin' : isSpecialPartner ? 'partner_school' : role;

    const loggedInUser: UserProfile = {
      ...DEFAULT_STUDENT_PROFILE,
      id: `usr_${Date.now()}`,
      email,
      role: determinedRole,
      firstName: email.split('@')[0],
      lastName: 'User',
    };
    setUser(loggedInUser);
    setIsOnboarded(true);
    localStorage.setItem('icsn_onboarded', 'true');
  };

  const loginWithGoogle = () => {
    // Simulated Google OAuth mapping to clean authenticated identity
    const googleUser: UserProfile = {
      ...DEFAULT_STUDENT_PROFILE,
      id: 'usr_google_auth_7816',
      email: 'buddy210.k@gmail.com',
      firstName: 'Authenticated',
      lastName: 'Student',
      role: 'student',
    };
    setUser(googleUser);
    setIsOnboarded(true);
    localStorage.setItem('icsn_onboarded', 'true');
  };

  const register = (data: Partial<UserProfile>) => {
    const birthDate = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    let isUnder18 = false;
    if (birthDate) {
      const ageDiffMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      isUnder18 = age < 18;
    }

    const newUser: UserProfile = {
      ...DEFAULT_STUDENT_PROFILE,
      id: `usr_${Date.now()}`,
      role: 'student', // All normal public registrations are Student
      email: data.email || 'student@icsn-navigator.org',
      firstName: data.firstName || 'New',
      lastName: data.lastName || 'Student',
      country: data.country || 'Uzbekistan',
      city: data.city || 'Tashkent',
      dateOfBirth: data.dateOfBirth,
      isMinor: isUnder18,
      educationLevel: data.educationLevel || 'Secondary School',
      gradeOrYear: data.gradeOrYear || 'Final Year',
      schoolOrUniversity: data.schoolOrUniversity || '',
      preferredLanguage: data.preferredLanguage || 'en',
      interests: data.interests || [],
      educationGoals: data.educationGoals || '',
      careerGoals: data.careerGoals || '',
      privacySettings: {
        profilePublic: false,
        allowCandidateSearchByVerifiedPartners: !isUnder18, // Minor protective default
        hideContactDetails: true,
        sharePortfolioSections: {
          bio: true,
          education: true,
          projects: true,
          skills: true,
          certificates: true,
        },
      },
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setIsOnboarded(false);
    localStorage.setItem('icsn_onboarded', 'false');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('icsn_user_profile');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...data,
      };
    });
  };

  const switchRole = (newRole: UserRole) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        role: newRole,
      };
    });
  };

  const completeOnboarding = (onboardingData: Partial<UserProfile>) => {
    updateProfile(onboardingData);
    setIsOnboarded(true);
    localStorage.setItem('icsn_onboarded', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        switchRole,
        isOnboarded,
        completeOnboarding,
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
