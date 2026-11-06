import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage } from '../types';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  en: {
    'brand.name': 'ICSN',
    'brand.fullName': 'International Career & Study Navigator',
    'brand.tagline': 'Your Future. Your Opportunities. Your Path.',
    'nav.overview': 'Overview',
    'nav.aiAssistant': 'AI Assistant',
    'nav.discovery': 'Career & Major Discovery',
    'nav.assessment': '30-Q Discovery Test',
    'nav.universities': 'University Matching',
    'nav.scholarships': 'Scholarships',
    'nav.applications': 'Application Tracker',
    'nav.portfolio': 'Portfolio Builder',
    'nav.opportunities': 'Opportunities & Internships',
    'nav.startups': 'Startup Network',
    'nav.events': 'Events & Workshops',
    'nav.talentIndex': 'Talent Index',
    'nav.settings': 'Settings & Privacy',
    'nav.partnerDashboard': 'Partner Portal',
    'nav.adminControl': 'Admin Control',
    'cta.getStarted': 'Start Free Journey',
    'cta.signIn': 'Sign In',
    'cta.signOut': 'Sign Out',
    'cta.takeAssessment': 'Take 30-Question Test',
    'status.verified': 'Verified Official Source',
    'status.freeForStudents': '100% Free for Students',
  },
  uz: {
    'brand.name': 'ICSN',
    'brand.fullName': 'Xalqaro Ta\'lim va Kasb Navigatsiya Tizimi',
    'brand.tagline': 'Sizning Kelajagingiz. Sizning Imkoniyatlaringiz. Sizning Yo\'lingiz.',
    'nav.overview': 'Bosh Sahifa',
    'nav.aiAssistant': 'AI Navigator',
    'nav.discovery': 'Kasblar va Yo\'nalishlar',
    'nav.assessment': '30 Savolli Kasbiy Test',
    'nav.universities': 'Universitet Saralash',
    'nav.scholarships': 'Xalqaro Grantlar',
    'nav.applications': 'Hujjatlar Nazorati',
    'nav.portfolio': 'Portfolio Yaratuvchi',
    'nav.opportunities': 'Amaliyot va Vakansiyalar',
    'nav.startups': 'Startap Tarmog\'i',
    'nav.events': 'Tadbirlar va Vebinarlar',
    'nav.talentIndex': 'Rivojlanish Indeksi',
    'nav.settings': 'Sozlamalar va Maxfiylik',
    'nav.partnerDashboard': 'Hamkorlar Portali',
    'nav.adminControl': 'Boshqaruv Paneli',
    'cta.getStarted': 'Bepul Boshlash',
    'cta.signIn': 'Kirish',
    'cta.signOut': 'Chiqish',
    'cta.takeAssessment': '30 Savolli Testni Boshlash',
    'status.verified': 'Rasmiy Tasdiqlangan Manba',
    'status.freeForStudents': 'Talabalar Uchun Mutlaqo Bepul',
  },
  ru: {
    'brand.name': 'ICSN',
    'brand.fullName': 'Международный Навигатор Образования и Карьеры',
    'brand.tagline': 'Ваше будущее. Ваши возможности. Ваш путь.',
    'nav.overview': 'Обзор',
    'nav.aiAssistant': 'AI Навигатор',
    'nav.discovery': 'Выбор профессии и программ',
    'nav.assessment': 'Тест из 30 вопросов',
    'nav.universities': 'Подбор университетов',
    'nav.scholarships': 'Стипендии и гранты',
    'nav.applications': 'Трекер заявок',
    'nav.portfolio': 'Конструктор портфолио',
    'nav.opportunities': 'Стажировки и вакансии',
    'nav.startups': 'Сеть стартапов',
    'nav.events': 'Мероприятия и вебинары',
    'nav.talentIndex': 'Индекс развития',
    'nav.settings': 'Настройки и приватность',
    'nav.partnerDashboard': 'Партнерский портал',
    'nav.adminControl': 'Панель администратора',
    'cta.getStarted': 'Начать бесплатно',
    'cta.signIn': 'Войти',
    'cta.signOut': 'Выйти',
    'cta.takeAssessment': 'Пройти тест из 30 вопросов',
    'status.verified': 'Проверенный источник',
    'status.freeForStudents': 'Бесплатно для студентов',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('icsn_lang');
    if (saved === 'en' || saved === 'uz' || saved === 'ru') return saved;
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('icsn_lang', language);
  }, [language]);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
