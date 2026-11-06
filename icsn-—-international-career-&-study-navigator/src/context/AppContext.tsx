import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ApplicationItem,
  ApplicationTask,
  TaskCategory,
  StudentPortfolio,
  AssessmentResult,
  AppNotification,
  StartupProject,
  PartnerOrganization,
  PortfolioItem,
  University,
  Scholarship,
  CountryProfile,
  KnowledgeGuide,
  JarvisIntegrationConfig,
  ContentDraft,
  AdminAuditLog,
} from '../types';
import { calculateAssessmentResult } from '../utils/assessmentEngine';
import { UNIVERSITIES_DATA } from '../data/universitiesData';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData';
import { COUNTRIES_DATA } from '../data/countriesData';
import { KNOWLEDGE_GUIDES_DATA } from '../data/knowledgeGuidesData';

export const DEFAULT_TASK_CATEGORIES: TaskCategory[] = [
  'Academic & Transcripts',
  'Standardized Tests & Language',
  'Personal Statement & Essays',
  'Recommendations & References',
  'Financial & Scholarships',
  'Visa & Immigration',
  'Portfolio & Projects',
  'General & Relocation',
];

interface AppContextType {
  // Saved items
  savedUniversities: string[];
  toggleSaveUniversity: (id: string) => void;
  isUniversitySaved: (id: string) => boolean;

  savedScholarships: string[];
  toggleSaveScholarship: (id: string) => void;
  isScholarshipSaved: (id: string) => boolean;

  savedOpportunities: string[];
  toggleSaveOpportunity: (id: string) => void;

  savedEvents: string[];
  toggleSaveEvent: (id: string) => void;

  // Applications & Tasks
  applications: ApplicationItem[];
  addApplication: (app: Omit<ApplicationItem, 'id' | 'createdAt'>) => void;
  updateApplicationStatus: (id: string, status: ApplicationItem['status']) => void;
  toggleApplicationChecklistItem: (appId: string, itemId: string) => void;
  addTaskToApplication: (appId: string, task: { label: string; category: TaskCategory; dueDate?: string; notes?: string }) => void;
  deleteTaskFromApplication: (appId: string, taskId: string) => void;
  deleteApplication: (id: string) => void;
  taskCategories: TaskCategory[];

  // Portfolio
  portfolio: StudentPortfolio;
  updatePortfolioHeadlineAndBio: (headline: string, aboutMe: string) => void;
  setPortfolioLayoutTheme: (theme: StudentPortfolio['layoutTheme']) => void;
  togglePortfolioPublic: () => void;
  updatePortfolioItem: (section: 'projects' | 'certificates' | 'achievements' | 'volunteering' | 'internships', id: string, updates: Partial<PortfolioItem>) => void;
  addPortfolioItem: (section: 'projects' | 'certificates' | 'achievements' | 'volunteering' | 'internships', item: Omit<PortfolioItem, 'id'>) => void;
  removePortfolioItem: (section: 'projects' | 'certificates' | 'achievements' | 'volunteering' | 'internships', id: string) => void;
  addEducationItem: (edu: Omit<StudentPortfolio['education'][0], 'id'>) => void;
  removeEducationItem: (id: string) => void;
  addSkillItem: (skill: Omit<StudentPortfolio['skills'][0], 'id'>) => void;
  removeSkillItem: (id: string) => void;

  // 30-Question Assessment
  assessmentAnswers: Record<number, number>;
  saveAssessmentAnswers: (answers: Record<number, number>) => void;
  assessmentResult: AssessmentResult | null;
  submitAssessment: (answers: Record<number, number>) => AssessmentResult;
  retakeAssessment: () => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Startup projects
  startupProjects: StartupProject[];
  addStartupProject: (proj: Omit<StartupProject, 'id' | 'createdAt'>) => void;

  // Partner organizations & Admin Verification
  partnerOrganizations: PartnerOrganization[];
  applyForOrganizationVerification: (org: Omit<PartnerOrganization, 'id' | 'appliedDate' | 'verificationStatus'>) => void;
  verifyOrganization: (id: string, status: 'verified' | 'rejected') => void;

  // Admin Data Management
  universities: University[];
  addUniversity: (univ: Omit<University, 'id' | 'lastVerified'>) => void;
  updateUniversity: (id: string, updates: Partial<University>) => void;
  archiveUniversity: (id: string) => void;

  scholarships: Scholarship[];
  addScholarship: (schol: Omit<Scholarship, 'id' | 'lastCheckedDate'>) => void;
  updateScholarship: (id: string, updates: Partial<Scholarship>) => void;

  countries: CountryProfile[];
  addCountry: (country: Omit<CountryProfile, 'id' | 'lastVerified'>) => void;
  updateCountry: (id: string, updates: Partial<CountryProfile>) => void;

  knowledgeGuides: KnowledgeGuide[];
  addKnowledgeGuide: (guide: Omit<KnowledgeGuide, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateKnowledgeGuide: (id: string, updates: Partial<KnowledgeGuide>) => void;
  deleteKnowledgeGuide: (id: string) => void;

  // JARVIS AI Integration & Content Drafts
  jarvisConfig: JarvisIntegrationConfig;
  updateJarvisConfig: (updates: Partial<JarvisIntegrationConfig>) => void;
  testJarvisConnection: () => Promise<{ success: boolean; message: string }>;
  contentDrafts: ContentDraft[];
  addContentDraft: (draft: Omit<ContentDraft, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContentDraft: (id: string, updates: Partial<ContentDraft>) => void;
  publishContentDraft: (draftId: string) => void;
  rejectContentDraft: (draftId: string) => void;

  // Admin Audit Logs
  adminAuditLogs: AdminAuditLog[];
  addAuditLog: (log: Omit<AdminAuditLog, 'id' | 'timestamp'>) => void;
}

const INITIAL_PORTFOLIO: StudentPortfolio = {
  id: 'port_aziz_01',
  studentId: 'usr_student_demo_01',
  isPublic: false,
  layoutTheme: 'modern',
  headline: 'Aspiring Robotics & AI Engineer | Olympiad Competitor',
  aboutMe:
    'Dedicated high school senior with deep passion for autonomous systems, embedded algorithms, and educational technology. Experienced in building micro-controller prototypes, competing in robotics tournaments, and mentoring younger peers.',
  education: [
    {
      id: 'edu_1',
      institution: 'Tashkent Specialized IT Lyceum',
      degree: 'High School Diploma with Computer Science Specialty',
      field: 'Informatics & Applied Mathematics',
      startYear: '2023',
      endYear: '2026',
      gpa: '3.82 / 4.00 (Top 5%)',
      honors: 'National Informatics Olympiad 2nd Degree Award',
    },
  ],
  skills: [
    { id: 'sk_1', name: 'Python (PyTorch, NumPy)', category: 'Technical' },
    { id: 'sk_2', name: 'C++ & Embedded Systems (Arduino/ESP32)', category: 'Technical' },
    { id: 'sk_3', name: 'TypeScript & React Web Development', category: 'Technical' },
    { id: 'sk_4', name: 'Computer Vision (OpenCV)', category: 'Technical' },
    { id: 'sk_5', name: 'English (IELTS 7.5 Academic)', category: 'Languages' },
    { id: 'sk_6', name: 'Uzbek (Native Fluency)', category: 'Languages' },
    { id: 'sk_7', name: 'Russian (Professional Working Fluency)', category: 'Languages' },
    { id: 'sk_8', name: 'Team Leadership & Sprint Planning', category: 'Leadership' },
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'Autonomous Agro-Bot: Soil Moisture & Crop Health Scanner',
      role: 'Lead Hardware & Algorithm Developer',
      dateRange: 'Jan 2026 - May 2026',
      description:
        'Architected a 4-wheel rover using ESP32 microcontrollers and computer vision to survey localized nitrogen/moisture levels in greenhouse beds. Reduced water waste by 34% across 3 prototype test farms.',
      tags: ['Robotics', 'Computer Vision', 'IoT', 'C++'],
      link: 'https://github.com/aziz-karimov/agro-bot-rover',
      verified: true,
    },
    {
      id: 'proj_2',
      title: 'EduMath Peer Tutoring Portal',
      role: 'Full-Stack Developer',
      dateRange: 'Sep 2025 - Dec 2025',
      description:
        'Created a free online question bank and virtual whiteboard for secondary students preparing for regional mathematics competitions. Supported 850+ active monthly student learners.',
      tags: ['TypeScript', 'React', 'Open Education'],
      link: 'https://github.com/aziz-karimov/edumath-hub',
      verified: true,
    },
  ],
  certificates: [
    {
      id: 'cert_1',
      title: 'CS50x: Introduction to Computer Science',
      organization: 'Harvard University / edX',
      dateRange: 'Issued August 2025',
      description: 'Comprehensive study of C, memory pointers, data structures, algorithms, SQL, and web architecture.',
      tags: ['Computer Science', 'Algorithms'],
    },
    {
      id: 'cert_2',
      title: 'IELTS Academic English C1 (Overall Band 7.5)',
      organization: 'British Council / IDP',
      dateRange: 'Issued May 2025',
      description: 'Listening: 8.5, Reading: 8.0, Writing: 7.0, Speaking: 7.0.',
      tags: ['English Proficiency'],
    },
  ],
  achievements: [
    {
      id: 'ach_1',
      title: 'Silver Medalist — National Youth Robotics Olympiad',
      organization: 'Ministry of Digital Technologies',
      dateRange: 'April 2026',
      description: 'Placed 2nd out of 120 national finalist teams in autonomous obstacle maze solving.',
      tags: ['Robotics', 'Competition'],
      verified: true,
    },
  ],
  volunteering: [
    {
      id: 'vol_1',
      title: 'Lead Student Mentor — Code for Tomorrow Club',
      organization: 'Local Community Youth Center',
      dateRange: 'Sep 2024 - Present',
      description: 'Conducting weekly free coding and problem-solving workshops for 25 middle school students.',
      tags: ['Mentorship', 'Youth Education'],
      verified: true,
    },
  ],
  internships: [
    {
      id: 'intern_1',
      title: 'Junior Embedded Firmware Intern',
      organization: 'SmartSens Tech Innovations',
      dateRange: 'June 2025 - August 2025',
      description: 'Wrote unit tests and calibrated sensor readouts for industrial telemetry equipment.',
      tags: ['Embedded Systems', 'C++'],
      verified: true,
    },
  ],
  languages: [
    { language: 'Uzbek', proficiency: 'Native' },
    { language: 'English', proficiency: 'Advanced' },
    { language: 'Russian', proficiency: 'Fluent' },
    { language: 'German', proficiency: 'Intermediate' },
  ],
  externalLinks: [
    { platform: 'GitHub', url: 'https://github.com/aziz-karimov' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/aziz-karimov-robotics' },
  ],
  lastUpdated: '2026-11-01T12:00:00.000Z',
};

const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app_tum_2026',
    studentId: 'usr_student_demo_01',
    title: 'B.Sc. in Informatics Application',
    institutionName: 'Technical University of Munich (TUM)',
    type: 'University',
    programName: 'Informatics (Computer Science)',
    status: 'Preparing',
    deadlineDate: '2026-07-15',
    privateNotes: 'Need to submit Uni-Assist VPD certificate by early June before final TUM portal upload.',
    checklist: [
      { id: 'c1', label: 'Uni-Assist Vorprüfungsdokumentation (VPD)', isCompleted: true, category: 'Academic & Transcripts' },
      { id: 'c2', label: 'Secondary School Lyceum Transcript (Apostilled)', isCompleted: true, category: 'Academic & Transcripts' },
      { id: 'c3', label: 'IELTS Academic Certificate (7.5 verified)', isCompleted: true, category: 'Standardized Tests & Language' },
      { id: 'c4', label: 'Statement of Motivation (German Academic Standards)', isCompleted: false, category: 'Personal Statement & Essays' },
      { id: 'c5', label: 'Europass CV with robotics project references', isCompleted: true, category: 'Portfolio & Projects' },
    ],
    createdAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'app_kaist_2026',
    studentId: 'usr_student_demo_01',
    title: 'KAIST Undergraduate Full Scholarship Admission',
    institutionName: 'KAIST (Korea Advanced Institute of Science and Technology)',
    type: 'Scholarship',
    programName: 'School of Computing / Robotics',
    status: 'Ready to Apply',
    deadlineDate: '2027-01-13',
    privateNotes: 'All STEM recommendation letters received from Math and Physics teachers.',
    checklist: [
      { id: 'k1', label: 'Online Application & Statement of Purpose', isCompleted: true, category: 'Personal Statement & Essays' },
      { id: 'k2', label: 'Recommendation Letter (Physics Instructor)', isCompleted: true, category: 'Recommendations & References' },
      { id: 'k3', label: 'Recommendation Letter (Informatics Coach)', isCompleted: true, category: 'Recommendations & References' },
      { id: 'k4', label: 'Passport & Parent Citizenship Verification', isCompleted: true, category: 'Visa & Immigration' },
      { id: 'k5', label: 'Olympiad Silver Medal Certificate Translation', isCompleted: true, category: 'Academic & Transcripts' },
    ],
    createdAt: '2026-10-01T11:00:00.000Z',
  },
  {
    id: 'app_cern_summer',
    studentId: 'usr_student_demo_01',
    title: 'CERN Summer Student Fellowship',
    institutionName: 'CERN Research Lab',
    type: 'Internship',
    programName: 'Computing & Experimental Software',
    status: 'Researching',
    deadlineDate: '2027-01-31',
    privateNotes: 'Check eligibility requirement on completed university credit hours.',
    checklist: [
      { id: 'cr1', label: 'Academic CV highlighting C++ & Linux experience', isCompleted: false, category: 'Portfolio & Projects' },
      { id: 'cr2', label: 'University Enrollment Verification Letter', isCompleted: false, category: 'Academic & Transcripts' },
      { id: 'cr3', label: 'Motivation Statement on Particle Physics Data', isCompleted: false, category: 'Personal Statement & Essays' },
    ],
    createdAt: '2026-10-20T14:30:00.000Z',
  },
];

const INITIAL_STARTUP_PROJECTS: StartupProject[] = [
  {
    id: 'st_botanica',
    authorId: 'usr_student_demo_01',
    authorName: 'Aziz Karimov',
    title: 'AgroSense — Autonomous Drone & Rover Micro-Farming Hub',
    tagline: 'Open-hardware IoT and AI computer vision for sustainable arid agriculture',
    field: 'Climate',
    currentStage: 'Prototype in Progress',
    neededRoles: ['Embedded C++ Engineer', 'Mobile App Developer (Flutter/React Native)', 'Agronomy Research Advisor'],
    description:
      'We are building modular field sensors and mini rovers that automate irrigation and detect crop rust before it spreads. Looking for passionate student collaborators for the upcoming NASA Space Apps and global youth hackathons.',
    membersCount: 3,
    contactAllowed: true,
    createdAt: '2026-10-10T12:00:00.000Z',
  },
  {
    id: 'st_medaccess',
    authorId: 'usr_student_malika',
    authorName: 'Malika Saidova',
    title: 'NeuroLens — Accessible Eye Tracking for Paralysis Communication',
    tagline: 'Low-cost webcam software enabling non-verbal patients to communicate using eye blinks',
    field: 'Health',
    currentStage: 'MVP Launched',
    neededRoles: ['UI/UX Designer', 'Machine Learning Vision Specialist', 'Clinical Trial Student Volunteer'],
    description:
      'Using consumer webcams and lightweight computer vision models to convert subtle ocular gestures into synthesised speech. Currently testing with 12 voluntary clinic patients in Central Asia.',
    membersCount: 4,
    contactAllowed: true,
    createdAt: '2026-10-18T15:00:00.000Z',
  },
];

const INITIAL_PARTNER_ORGS: PartnerOrganization[] = [
  {
    id: 'org_tashkent_it',
    name: 'Tashkent Specialized IT Lyceum',
    type: 'school',
    country: 'Uzbekistan',
    city: 'Tashkent',
    website: 'https://it-lyceum.uz',
    contactEmail: 'admissions@it-lyceum.uz',
    description: 'Premier regional specialized high school preparing gifted youth for international university competitions.',
    verificationStatus: 'verified',
    appliedDate: '2026-08-15',
  },
  {
    id: 'org_eu_youth_network',
    name: 'European Youth Innovation League',
    type: 'startup',
    country: 'Germany',
    city: 'Berlin',
    website: 'https://eyil-europe.org',
    contactEmail: 'partnerships@eyil-europe.org',
    description: 'Venture network offering student internships, hackathon funding, and cross-border incubation.',
    verificationStatus: 'verified',
    appliedDate: '2026-09-02',
  },
  {
    id: 'org_central_scholarships',
    name: 'Eurasia Global Scholars Fund',
    type: 'scholarship',
    country: 'Kazakhstan',
    city: 'Astana',
    website: 'https://eurasia-scholars.org',
    contactEmail: 'info@eurasia-scholars.org',
    description: 'Philanthropic grant foundation funding full undergraduate tuition for Central Asian STEM students.',
    verificationStatus: 'pending',
    appliedDate: '2026-10-28',
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Upcoming Deadline: Chevening Scholarships',
    message: 'Official UK Chevening Scholarship applications close on Nov 4, 2026. Verify your essay submissions.',
    type: 'deadline',
    timestamp: '2026-11-02T09:00:00.000Z',
    isRead: false,
    linkTab: 'scholarships',
  },
  {
    id: 'notif_2',
    title: 'Application Reminder: TUM Vorprüfungsdokumentation',
    message: 'Your Technical University of Munich checklist item (VPD) has been marked completed.',
    type: 'application',
    timestamp: '2026-10-29T14:20:00.000Z',
    isRead: false,
    linkTab: 'applications',
  },
  {
    id: 'notif_3',
    title: 'New Opportunity: CERN Summer Student Programme',
    message: 'Applications are now open for CERN Summer Fellowships in Geneva for STEM students.',
    type: 'opportunity',
    timestamp: '2026-10-25T11:00:00.000Z',
    isRead: true,
    linkTab: 'opportunities',
  },
];

const INITIAL_JARVIS_CONFIG: JarvisIntegrationConfig = {
  endpointUrl: 'https://api.icsn.global/v1/jarvis-gateway',
  connectionStatus: 'not_configured',
  apiKeyMasked: '',
  hasApiKey: false,
  allowedScopes: {
    readUniversities: true,
    researchMissingData: true,
    draftNewProfiles: true,
    draftScholarships: true,
    draftRelocationGuides: true,
    autoPublishApproved: false,
  },
};

const INITIAL_CONTENT_DRAFTS: ContentDraft[] = [
  {
    id: 'draft_ntu_01',
    draftType: 'university',
    title: 'Nanyang Technological University (NTU Singapore) — AI Profile',
    sourceOrganization: 'NTU Singapore Official Admissions',
    sourceUrl: 'https://www.ntu.edu.sg/admissions',
    researchedDate: '2026-11-04',
    verificationStatus: 'verified_official',
    status: 'under_review',
    aiGeneratedBy: 'JARVIS-AI-Assistant',
    adminNotes: 'Verify minimum SAT cutoff requirements for international curriculum.',
    contentData: {
      name: 'Nanyang Technological University (NTU)',
      country: 'Singapore',
      qsRank: 15,
      tuitionUsd: 21500,
      minIelts: 6.5,
      minGpa: 3.75,
      safetyIndex: 96,
      keyPrograms: ['B.Sc. in Data Science & Artificial Intelligence', 'B.Eng. in Computer Engineering'],
      city: 'Singapore',
      livingCostPerMonthUsd: 1400,
    },
    createdAt: '2026-11-04T12:00:00Z',
    updatedAt: '2026-11-04T16:00:00Z',
  },
  {
    id: 'draft_singa_02',
    draftType: 'scholarship',
    title: 'Singapore International Graduate Award (SINGA 2027)',
    sourceOrganization: 'A*STAR Agency for Science, Technology and Research',
    sourceUrl: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies',
    researchedDate: '2026-11-03',
    verificationStatus: 'verified_official',
    status: 'draft',
    aiGeneratedBy: 'JARVIS-AI-Assistant',
    adminNotes: 'Review monthly stipend and health insurance coverage breakdown.',
    contentData: {
      name: 'Singapore International Graduate Award (SINGA)',
      provider: 'A*STAR & Singapore Partner Universities',
      country: 'Singapore',
      coverageType: 'Full Tuition + Stipend',
      stipendMonthlyUsd: 2200,
      deadlineDate: '2027-01-01',
      degreeLevels: ['PhD'],
    },
    createdAt: '2026-11-03T09:30:00Z',
    updatedAt: '2026-11-03T11:00:00Z',
  },
];

const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log_01',
    action: 'Accreditation Review Approved',
    entityType: 'partner',
    target: 'Tashkent Specialized IT Lyceum',
    performedBy: 'SecOps-Admin',
    role: 'admin',
    timestamp: '2026-11-04 14:20 UTC',
    details: 'Verified accreditation credentials and school official contact domain.',
  },
  {
    id: 'log_02',
    action: 'Admissions Data Verification Scan',
    entityType: 'university',
    target: 'Universities (8) & Scholarships (8) Admissions Index',
    performedBy: 'System Integrity Daemon',
    role: 'system_policy',
    timestamp: '2026-11-04 02:00 UTC',
    details: 'Verified official source URLs and deadline validity dates.',
  },
  {
    id: 'log_03',
    action: 'Minor Privacy Shield Enforcement',
    entityType: 'security',
    target: 'Under-18 Protected Records Masking',
    performedBy: 'Compliance Officer',
    role: 'system_policy',
    timestamp: '2026-11-03 18:45 UTC',
    details: 'Confirmed 100% of student accounts under 18 have phone and birth date shielded.',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Saved items
  const [savedUniversities, setSavedUniversities] = useState<string[]>(() => {
    const saved = localStorage.getItem('icsn_saved_unis');
    return saved ? JSON.parse(saved) : ['uni_tum', 'uni_kaist'];
  });

  const [savedScholarships, setSavedScholarships] = useState<string[]>(() => {
    const saved = localStorage.getItem('icsn_saved_schols');
    return saved ? JSON.parse(saved) : ['sch_daad_germany', 'sch_gks_korea'];
  });

  const [savedOpportunities, setSavedOpportunities] = useState<string[]>(() => {
    const saved = localStorage.getItem('icsn_saved_opps');
    return saved ? JSON.parse(saved) : ['opp_cern_summer'];
  });

  const [savedEvents, setSavedEvents] = useState<string[]>(() => {
    const saved = localStorage.getItem('icsn_saved_events');
    return saved ? JSON.parse(saved) : ['evt_daad_fair_2026'];
  });

  // Applications
  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    const saved = localStorage.getItem('icsn_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // Portfolio
  const [portfolio, setPortfolio] = useState<StudentPortfolio>(() => {
    const saved = localStorage.getItem('icsn_portfolio');
    return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
  });

  // Assessment
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('icsn_assessment_answers');
    return saved ? JSON.parse(saved) : {};
  });

  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(() => {
    const saved = localStorage.getItem('icsn_assessment_result');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default initial assessment result to power initial student dashboard recommendations
    const sampleTechAnswers: Record<number, number> = {};
    for (let i = 1; i <= 30; i++) sampleTechAnswers[i] = 0;
    return calculateAssessmentResult(sampleTechAnswers);
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('icsn_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Startup projects
  const [startupProjects, setStartupProjects] = useState<StartupProject[]>(() => {
    const saved = localStorage.getItem('icsn_startups');
    return saved ? JSON.parse(saved) : INITIAL_STARTUP_PROJECTS;
  });

  // Partner organizations
  const [partnerOrganizations, setPartnerOrganizations] = useState<PartnerOrganization[]>(() => {
    const saved = localStorage.getItem('icsn_partner_orgs');
    return saved ? JSON.parse(saved) : INITIAL_PARTNER_ORGS;
  });

  // Admin Collections
  const [universities, setUniversities] = useState<University[]>(() => {
    const saved = localStorage.getItem('icsn_universities');
    return saved ? JSON.parse(saved) : UNIVERSITIES_DATA;
  });

  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    const saved = localStorage.getItem('icsn_scholarships');
    return saved ? JSON.parse(saved) : SCHOLARSHIPS_DATA;
  });

  const [countries, setCountries] = useState<CountryProfile[]>(() => {
    const saved = localStorage.getItem('icsn_countries');
    return saved ? JSON.parse(saved) : COUNTRIES_DATA;
  });

  const [knowledgeGuides, setKnowledgeGuides] = useState<KnowledgeGuide[]>(() => {
    const saved = localStorage.getItem('icsn_knowledge_guides');
    return saved ? JSON.parse(saved) : KNOWLEDGE_GUIDES_DATA;
  });

  const [jarvisConfig, setJarvisConfig] = useState<JarvisIntegrationConfig>(() => {
    const saved = localStorage.getItem('icsn_jarvis_config');
    return saved ? JSON.parse(saved) : INITIAL_JARVIS_CONFIG;
  });

  const [contentDrafts, setContentDrafts] = useState<ContentDraft[]>(() => {
    const saved = localStorage.getItem('icsn_content_drafts');
    return saved ? JSON.parse(saved) : INITIAL_CONTENT_DRAFTS;
  });

  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLog[]>(() => {
    const saved = localStorage.getItem('icsn_admin_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('icsn_saved_unis', JSON.stringify(savedUniversities));
  }, [savedUniversities]);

  useEffect(() => {
    localStorage.setItem('icsn_saved_schols', JSON.stringify(savedScholarships));
  }, [savedScholarships]);

  useEffect(() => {
    localStorage.setItem('icsn_saved_opps', JSON.stringify(savedOpportunities));
  }, [savedOpportunities]);

  useEffect(() => {
    localStorage.setItem('icsn_saved_events', JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    localStorage.setItem('icsn_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('icsn_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('icsn_assessment_answers', JSON.stringify(assessmentAnswers));
  }, [assessmentAnswers]);

  useEffect(() => {
    if (assessmentResult) {
      localStorage.setItem('icsn_assessment_result', JSON.stringify(assessmentResult));
    }
  }, [assessmentResult]);

  useEffect(() => {
    localStorage.setItem('icsn_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('icsn_startups', JSON.stringify(startupProjects));
  }, [startupProjects]);

  useEffect(() => {
    localStorage.setItem('icsn_partner_orgs', JSON.stringify(partnerOrganizations));
  }, [partnerOrganizations]);

  useEffect(() => {
    localStorage.setItem('icsn_universities', JSON.stringify(universities));
  }, [universities]);

  useEffect(() => {
    localStorage.setItem('icsn_scholarships', JSON.stringify(scholarships));
  }, [scholarships]);

  useEffect(() => {
    localStorage.setItem('icsn_countries', JSON.stringify(countries));
  }, [countries]);

  useEffect(() => {
    localStorage.setItem('icsn_knowledge_guides', JSON.stringify(knowledgeGuides));
  }, [knowledgeGuides]);

  useEffect(() => {
    localStorage.setItem('icsn_jarvis_config', JSON.stringify(jarvisConfig));
  }, [jarvisConfig]);

  useEffect(() => {
    localStorage.setItem('icsn_content_drafts', JSON.stringify(contentDrafts));
  }, [contentDrafts]);

  useEffect(() => {
    localStorage.setItem('icsn_admin_audit_logs', JSON.stringify(adminAuditLogs));
  }, [adminAuditLogs]);

  // Handler helpers
  const toggleSaveUniversity = (id: string) => {
    setSavedUniversities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isUniversitySaved = (id: string) => savedUniversities.includes(id);

  const toggleSaveScholarship = (id: string) => {
    setSavedScholarships((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isScholarshipSaved = (id: string) => savedScholarships.includes(id);

  const toggleSaveOpportunity = (id: string) => {
    setSavedOpportunities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSaveEvent = (id: string) => {
    setSavedEvents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addApplication = (appData: Omit<ApplicationItem, 'id' | 'createdAt'>) => {
    const newApp: ApplicationItem = {
      ...appData,
      id: `app_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  const updateApplicationStatus = (id: string, status: ApplicationItem['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  const toggleApplicationChecklistItem = (appId: string, itemId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          checklist: app.checklist.map((item) =>
            item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
          ),
        };
      })
    );
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const addTaskToApplication = (
    appId: string,
    task: { label: string; category: TaskCategory; dueDate?: string; notes?: string }
  ) => {
    const newTask: ApplicationTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      label: task.label,
      isCompleted: false,
      category: task.category,
      dueDate: task.dueDate,
      notes: task.notes,
    };
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, checklist: [...app.checklist, newTask] }
          : app
      )
    );
    addAuditLog({
      action: 'Task Added',
      entityType: 'program',
      target: task.label,
      performedBy: 'Student User',
      role: 'admin',
      details: `Category: ${task.category}`,
    });
  };

  const deleteTaskFromApplication = (appId: string, taskId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, checklist: app.checklist.filter((t) => t.id !== taskId) }
          : app
      )
    );
  };

  // Portfolio handlers
  const updatePortfolioHeadlineAndBio = (headline: string, aboutMe: string) => {
    setPortfolio((prev) => ({
      ...prev,
      headline,
      aboutMe,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const setPortfolioLayoutTheme = (theme: StudentPortfolio['layoutTheme']) => {
    setPortfolio((prev) => ({ ...prev, layoutTheme: theme }));
  };

  const togglePortfolioPublic = () => {
    setPortfolio((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const addPortfolioItem = (
    section: 'projects' | 'certificates' | 'achievements' | 'volunteering' | 'internships',
    item: Omit<PortfolioItem, 'id'>
  ) => {
    const newItem: PortfolioItem = { ...item, id: `item_${Date.now()}` };
    setPortfolio((prev) => ({
      ...prev,
      [section]: [newItem, ...prev[section]],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updatePortfolioItem = (
    section: 'projects' | 'certificates' | 'achievements' | 'volunteering' | 'internships',
    id: string,
    updates: Partial<PortfolioItem>
  ) => {
    setPortfolio((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => (item.id === id ? { ...item, ...updates } : item)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const removePortfolioItem = (
    section: 'projects' | 'certificates' | 'achievements' | 'volunteering' | 'internships',
    id: string
  ) => {
    setPortfolio((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const addEducationItem = (edu: Omit<StudentPortfolio['education'][0], 'id'>) => {
    const newEdu = { ...edu, id: `edu_${Date.now()}` };
    setPortfolio((prev) => ({
      ...prev,
      education: [newEdu, ...prev.education],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const removeEducationItem = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const addSkillItem = (skill: Omit<StudentPortfolio['skills'][0], 'id'>) => {
    const newSkill = { ...skill, id: `sk_${Date.now()}` };
    setPortfolio((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const removeSkillItem = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  };

  // Assessment handlers
  const saveAssessmentAnswers = (answers: Record<number, number>) => {
    setAssessmentAnswers(answers);
  };

  const submitAssessment = (answers: Record<number, number>) => {
    const result = calculateAssessmentResult(answers);
    setAssessmentAnswers(answers);
    setAssessmentResult(result);
    return result;
  };

  const retakeAssessment = () => {
    setAssessmentAnswers({});
    // Keep last result until new submission
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Startup projects
  const addStartupProject = (proj: Omit<StartupProject, 'id' | 'createdAt'>) => {
    const newProj: StartupProject = {
      ...proj,
      id: `st_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStartupProjects((prev) => [newProj, ...prev]);
  };

  // Partner organizations
  const applyForOrganizationVerification = (
    org: Omit<PartnerOrganization, 'id' | 'appliedDate' | 'verificationStatus'>
  ) => {
    const newOrg: PartnerOrganization = {
      ...org,
      id: `org_${Date.now()}`,
      verificationStatus: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setPartnerOrganizations((prev) => [newOrg, ...prev]);
  };

  const verifyOrganization = (id: string, status: 'verified' | 'rejected') => {
    setPartnerOrganizations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, verificationStatus: status } : o))
    );
  };

  // Admin University Handlers
  const addUniversity = (univData: Omit<University, 'id' | 'lastVerified'>) => {
    const newUniv: University = {
      ...univData,
      id: `uni_${Date.now()}`,
      lastVerified: new Date().toISOString().split('T')[0],
    };
    setUniversities((prev) => [newUniv, ...prev]);
    addAuditLog({
      action: 'University Created',
      entityType: 'university',
      target: newUniv.name,
      performedBy: 'Admin Authority',
      role: 'admin',
      details: `Created new profile for ${newUniv.country}`,
    });
  };

  const updateUniversity = (id: string, updates: Partial<University>) => {
    setUniversities((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates, lastVerified: new Date().toISOString().split('T')[0] } : u))
    );
    addAuditLog({
      action: 'University Updated',
      entityType: 'university',
      target: id,
      performedBy: 'Admin Authority',
      role: 'admin',
    });
  };

  const archiveUniversity = (id: string) => {
    setUniversities((prev) => prev.filter((u) => u.id !== id));
    addAuditLog({
      action: 'University Archived',
      entityType: 'university',
      target: id,
      performedBy: 'Admin Authority',
      role: 'admin',
    });
  };

  // Admin Scholarship Handlers
  const addScholarship = (scholData: Omit<Scholarship, 'id' | 'lastCheckedDate'>) => {
    const newSchol: Scholarship = {
      ...scholData,
      id: `sch_${Date.now()}`,
      lastCheckedDate: new Date().toISOString().split('T')[0],
    };
    setScholarships((prev) => [newSchol, ...prev]);
    addAuditLog({
      action: 'Scholarship Created',
      entityType: 'scholarship',
      target: newSchol.name,
      performedBy: 'Admin Authority',
      role: 'admin',
    });
  };

  const updateScholarship = (id: string, updates: Partial<Scholarship>) => {
    setScholarships((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, lastCheckedDate: new Date().toISOString().split('T')[0] } : s))
    );
  };

  // Admin Country Handlers
  const addCountry = (countryData: Omit<CountryProfile, 'id' | 'lastVerified'>) => {
    const newCountry: CountryProfile = {
      ...countryData,
      id: `cnt_${Date.now()}`,
      lastVerified: new Date().toISOString().split('T')[0],
    };
    setCountries((prev) => [newCountry, ...prev]);
    addAuditLog({
      action: 'Country Profile Created',
      entityType: 'country',
      target: newCountry.name,
      performedBy: 'Admin Authority',
      role: 'admin',
    });
  };

  const updateCountry = (id: string, updates: Partial<CountryProfile>) => {
    setCountries((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, lastVerified: new Date().toISOString().split('T')[0] } : c))
    );
  };

  // Knowledge Guides Handlers
  const addKnowledgeGuide = (guideData: Omit<KnowledgeGuide, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newGuide: KnowledgeGuide = {
      ...guideData,
      id: `guide_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setKnowledgeGuides((prev) => [newGuide, ...prev]);
    addAuditLog({
      action: 'Guide Created',
      entityType: 'guide',
      target: newGuide.title,
      performedBy: 'Admin Authority',
      role: 'admin',
    });
  };

  const updateKnowledgeGuide = (id: string, updates: Partial<KnowledgeGuide>) => {
    setKnowledgeGuides((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g))
    );
  };

  const deleteKnowledgeGuide = (id: string) => {
    setKnowledgeGuides((prev) => prev.filter((g) => g.id !== id));
  };

  // JARVIS AI Integration Handlers
  const updateJarvisConfig = (updates: Partial<JarvisIntegrationConfig>) => {
    setJarvisConfig((prev) => ({ ...prev, ...updates }));
    addAuditLog({
      action: 'JARVIS Config Updated',
      entityType: 'jarvis_integration',
      target: 'Integration Gateway',
      performedBy: 'Admin Authority',
      role: 'admin',
    });
  };

  const testJarvisConnection = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/admin/jarvis/status');
      const data = await res.json();
      const status = data.configured ? 'connected' : 'disconnected';
      setJarvisConfig((prev) => ({
        ...prev,
        connectionStatus: status,
        lastHealthCheck: new Date().toISOString(),
      }));
      addAuditLog({
        action: 'JARVIS Connection Ping',
        entityType: 'jarvis_integration',
        target: 'JARVIS Gateway',
        performedBy: 'System Diagnostic',
        role: 'system_policy',
        details: `Result: ${status}`,
      });
      return {
        success: data.configured,
        message: data.configured ? 'Connected to AI Gateway successfully' : 'Gateway endpoint reachable; pending central CEO handshake',
      };
    } catch {
      setJarvisConfig((prev) => ({ ...prev, connectionStatus: 'disconnected' }));
      return { success: false, message: 'Gateway unreachable or offline' };
    }
  };

  // Content Drafts Handlers
  const addContentDraft = (draftData: Omit<ContentDraft, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newDraft: ContentDraft = {
      ...draftData,
      id: `draft_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setContentDrafts((prev) => [newDraft, ...prev]);
    addAuditLog({
      action: 'Content Draft Created',
      entityType: 'guide',
      target: newDraft.title,
      performedBy: draftData.aiGeneratedBy,
      role: draftData.aiGeneratedBy === 'JARVIS-AI-Assistant' ? 'jarvis_agent' : 'admin',
      details: `Type: ${newDraft.draftType}`,
    });
  };

  const updateContentDraft = (id: string, updates: Partial<ContentDraft>) => {
    setContentDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d))
    );
  };

  const publishContentDraft = (draftId: string) => {
    const draft = contentDrafts.find((d) => d.id === draftId);
    if (!draft) return;

    if (draft.draftType === 'university' && draft.contentData) {
      const u = draft.contentData;
      addUniversity({
        name: u.name || draft.title,
        city: u.city || 'Global',
        country: u.country || 'International',
        qsRank: u.qsRank || 99,
        safetyIndex: u.safetyIndex || 90,
        hasHalalOptions: true,
        tuitionPerYearUsd: u.tuitionUsd || 10000,
        livingCostPerMonthUsd: u.livingCostPerMonthUsd || 1200,
        availableScholarships: ['Merit Grant'],
        programs: u.keyPrograms || ['Computer Science'],
        academicFields: ['Computer Science & AI'],
        admissionRequirements: {
          gpaMin: u.minGpa || 3.3,
          ieltsMin: u.minIelts || 6.5,
          toeflMin: 85,
        },
        officialWebsite: draft.sourceUrl || 'https://university.edu',
        source: draft.sourceOrganization || 'Official Admissions',
        applicationDeadlines: [{ intake: 'Fall 2027', deadlineDate: '2027-01-15', status: 'Open' }],
        requiredDocuments: ['Transcripts', 'IELTS', 'SOP'],
        description: `Verified international academic program at ${u.name || draft.title}.`,
      });
    }

    setContentDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, status: 'published', updatedAt: new Date().toISOString() } : d))
    );

    addAuditLog({
      action: 'Draft Published to Live',
      entityType: draft.draftType as any,
      target: draft.title,
      performedBy: 'Admin Authority',
      role: 'admin',
      details: 'Human review completed and approved for live student catalog.',
    });
  };

  const rejectContentDraft = (draftId: string) => {
    setContentDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, status: 'rejected', updatedAt: new Date().toISOString() } : d))
    );
    addAuditLog({
      action: 'Draft Rejected',
      entityType: 'guide',
      target: draftId,
      performedBy: 'Admin Authority',
      role: 'admin',
    });
  };

  // Admin Audit Logs
  const addAuditLog = (logData: Omit<AdminAuditLog, 'id' | 'timestamp'>) => {
    const newLog: AdminAuditLog = {
      ...logData,
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
    };
    setAdminAuditLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  return (
    <AppContext.Provider
      value={{
        savedUniversities,
        toggleSaveUniversity,
        isUniversitySaved,
        savedScholarships,
        toggleSaveScholarship,
        isScholarshipSaved,
        savedOpportunities,
        toggleSaveOpportunity,
        savedEvents,
        toggleSaveEvent,
        applications,
        addApplication,
        updateApplicationStatus,
        toggleApplicationChecklistItem,
        addTaskToApplication,
        deleteTaskFromApplication,
        deleteApplication,
        taskCategories: DEFAULT_TASK_CATEGORIES,
        portfolio,
        updatePortfolioHeadlineAndBio,
        setPortfolioLayoutTheme,
        togglePortfolioPublic,
        updatePortfolioItem,
        addPortfolioItem,
        removePortfolioItem,
        addEducationItem,
        removeEducationItem,
        addSkillItem,
        removeSkillItem,
        assessmentAnswers,
        saveAssessmentAnswers,
        assessmentResult,
        submitAssessment,
        retakeAssessment,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        startupProjects,
        addStartupProject,
        partnerOrganizations,
        applyForOrganizationVerification,
        verifyOrganization,
        universities,
        addUniversity,
        updateUniversity,
        archiveUniversity,
        scholarships,
        addScholarship,
        updateScholarship,
        countries,
        addCountry,
        updateCountry,
        knowledgeGuides,
        addKnowledgeGuide,
        updateKnowledgeGuide,
        deleteKnowledgeGuide,
        jarvisConfig,
        updateJarvisConfig,
        testJarvisConnection,
        contentDrafts,
        addContentDraft,
        updateContentDraft,
        publishContentDraft,
        rejectContentDraft,
        adminAuditLogs,
        addAuditLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
