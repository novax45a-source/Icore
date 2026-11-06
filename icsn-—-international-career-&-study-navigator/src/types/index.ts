export type UserRole =
  | 'student'
  | 'partner_school'
  | 'partner_scholarship'
  | 'partner_employer'
  | 'partner_volunteer'
  | 'admin';

export type AppLanguage = 'en' | 'uz' | 'ru';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  dateOfBirth?: string;
  isMinor: boolean;
  educationLevel: string;
  gradeOrYear: string;
  schoolOrUniversity?: string;
  preferredLanguage: AppLanguage;
  interests: string[];
  educationGoals: string;
  careerGoals: string;
  gpa?: number;
  ieltsScore?: number;
  toeflScore?: number;
  targetBudgetUsd?: number;
  targetCountries: string[];
  guardianConsentGranted?: boolean;
  privacySettings: {
    profilePublic: boolean;
    allowCandidateSearchByVerifiedPartners: boolean;
    hideContactDetails: boolean;
    sharePortfolioSections: {
      bio: boolean;
      education: boolean;
      projects: boolean;
      skills: boolean;
      certificates: boolean;
    };
  };
  createdAt: string;
}

export interface AssessmentQuestion {
  id: number;
  category: string;
  categoryUz: string;
  categoryRu: string;
  question: string;
  questionUz: string;
  questionRu: string;
  description?: string;
  options: {
    text: string;
    textUz: string;
    textRu: string;
    scoreTags: Record<string, number>;
  }[];
}

export interface AssessmentResult {
  completedAt: string;
  answers: Record<number, number>;
  topFields: {
    fieldId: string;
    name: string;
    score: number;
    matchPercent: number;
    explanation: string;
  }[];
  recommendedMajors: string[];
  careerDirections: string[];
  recommendedDestinations: string[];
  keySkillsToDevelop: string[];
  suggestedLearningActivities: string[];
  answersImpactSummary: string;
}

export interface MajorField {
  id: string;
  name: string;
  nameUz: string;
  nameRu: string;
  category: string;
  description: string;
  commonResponsibilities: string[];
  usefulSkills: string[];
  relevantSubjects: string[];
  possibleMajors: string[];
  careerOpportunities: string[];
  relatedEducationalPathways: string[];
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  qsRank: number;
  programs: string[];
  academicFields: string[];
  admissionRequirements: {
    gpaMin: number;
    ieltsMin: number;
    toeflMin: number;
    satRequirement?: string;
    additionalTests?: string;
  };
  tuitionPerYearUsd: number;
  livingCostPerMonthUsd: number;
  availableScholarships: string[];
  applicationDeadlines: {
    intake: string;
    deadlineDate: string;
    status: 'Open' | 'Approaching' | 'Closed';
  }[];
  requiredDocuments: string[];
  officialWebsite: string;
  source: string;
  lastVerified: string;
  hasHalalOptions: boolean;
  safetyIndex: number;
  description: string;
}

export interface UniversityMatch {
  university: University;
  fitCategory: 'Strong Profile Match' | 'Good Match' | 'Potential Match' | 'Requires Further Preparation';
  fitScore: number;
  matchReasons: string[];
  missingQualifications: string[];
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  country: string;
  academicFields: string[];
  degreeLevels: ('Bachelor' | 'Master' | 'PhD' | 'Postdoc')[];
  fundingType: 'Full Funding' | 'Partial Funding' | 'Tuition Waiver' | 'Monthly Stipend';
  fundingDetails: string;
  estimatedValueUsd: number;
  eligibilityCriteria: string[];
  nationalityRestrictions: string;
  languageRequirements: string;
  deadlineDate: string;
  requiredDocuments: string[];
  officialApplicationLink: string;
  verificationStatus: 'Verified' | 'Pending Confirmation';
  lastCheckedDate: string;
  description: string;
}

export type TaskCategory =
  | 'Academic & Transcripts'
  | 'Standardized Tests & Language'
  | 'Personal Statement & Essays'
  | 'Recommendations & References'
  | 'Financial & Scholarships'
  | 'Visa & Immigration'
  | 'Portfolio & Projects'
  | 'General & Relocation';

export interface ApplicationTask {
  id: string;
  label: string;
  isCompleted: boolean;
  category?: TaskCategory;
  dueDate?: string;
  notes?: string;
}

export interface ApplicationItem {
  id: string;
  studentId: string;
  title: string;
  institutionName: string;
  type: 'University' | 'Scholarship' | 'Internship';
  programName?: string;
  status:
    | 'Researching'
    | 'Preparing'
    | 'Ready to Apply'
    | 'Submitted'
    | 'Under Review'
    | 'Interview'
    | 'Accepted'
    | 'Rejected'
    | 'Waitlisted'
    | 'Withdrawn';
  deadlineDate: string;
  submissionDate?: string;
  interviewDate?: string;
  privateNotes: string;
  checklist: ApplicationTask[];
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  role?: string;
  organization?: string;
  dateRange: string;
  description: string;
  link?: string;
  tags: string[];
  verified?: boolean;
}

export interface StudentPortfolio {
  id: string;
  studentId: string;
  isPublic: boolean;
  layoutTheme: 'modern' | 'academic' | 'creative';
  headline: string;
  aboutMe: string;
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    gpa?: string;
    honors?: string;
  }[];
  skills: {
    id: string;
    name: string;
    category: 'Technical' | 'Languages' | 'Leadership' | 'Creative';
  }[];
  projects: PortfolioItem[];
  certificates: PortfolioItem[];
  achievements: PortfolioItem[];
  volunteering: PortfolioItem[];
  internships: PortfolioItem[];
  languages: {
    language: string;
    proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Elementary';
  }[];
  externalLinks: {
    platform: string;
    url: string;
  }[];
  lastUpdated: string;
}

export interface Opportunity {
  id: string;
  organization: string;
  organizationType: 'Enterprise' | 'Startup' | 'NGO' | 'Academic Center' | 'Research Lab';
  title: string;
  category: 'Internship' | 'Entry-Level' | 'Remote Work' | 'Volunteering' | 'Research' | 'Competition';
  location: string;
  isRemote: boolean;
  compensation: string;
  deadlineDate: string;
  eligibility: string;
  requiredSkills: string[];
  description: string;
  officialApplicationLink: string;
  verificationStatus: 'Verified Partner' | 'Public Listing';
  lastUpdated: string;
}

export interface StartupProject {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  tagline: string;
  field: string;
  currentStage: 'Concept / Research' | 'Prototype in Progress' | 'MVP Launched';
  neededRoles: string[];
  description: string;
  membersCount: number;
  contactAllowed: boolean;
  createdAt: string;
}

export interface GlobalEvent {
  id: string;
  title: string;
  organizer: string;
  category: 'Education Fair' | 'Webinar' | 'Hackathon' | 'Conference' | 'Workshop';
  eventDate: string;
  timeString: string;
  isOnline: boolean;
  location?: string;
  description: string;
  topics: string[];
  registrationUrl: string;
  verified: boolean;
}

export interface PartnerOrganization {
  id: string;
  name: string;
  type: 'school' | 'scholarship' | 'employer' | 'volunteer' | 'startup';
  country: string;
  city: string;
  website: string;
  contactEmail: string;
  description: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  appliedDate: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'application' | 'opportunity' | 'portfolio' | 'security';
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface CountryProfile {
  id: string;
  code: string;
  name: string;
  region: 'Europe' | 'North America' | 'Asia-Pacific' | 'Middle East' | 'Latin America';
  cities: string[];
  educationSystemOverview: string;
  studentVisaOverview: string;
  visaRequirements: string[];
  estimatedLivingCostMinUsd: number;
  estimatedLivingCostMaxUsd: number;
  postStudyWorkVisaAllowed: boolean;
  postStudyWorkDurationMonths: number;
  housingGuidance: string;
  transportGuidance: string;
  healthInsuranceRequirement: string;
  officialImmigrationPortal: string;
  officialEducationPortal: string;
  lastVerified: string;
  status: 'published' | 'draft' | 'archived';
}

export interface StudyProgram {
  id: string;
  universityId: string;
  universityName: string;
  title: string;
  degreeLevel: 'Bachelor' | 'Master' | 'PhD' | 'Diploma' | 'Certificate';
  field: string;
  durationYears: number;
  languageOfInstruction: string[];
  annualTuitionUsd: number;
  minGpa: number;
  minIelts: number;
  minToefl?: number;
  intakes: string[];
  applicationDeadline: string;
  curriculumOverview: string;
  careerOutcomes: string[];
  scholarshipAvailable: boolean;
  status: 'active' | 'archived';
  lastVerified: string;
}

export interface KnowledgeGuide {
  id: string;
  title: string;
  slug: string;
  category:
    | 'Visa & Immigration'
    | 'Relocation & Housing'
    | 'Finances & Budgeting'
    | 'Standardized Testing'
    | 'Application Essays'
    | 'Career & Work Rights';
  summary: string;
  contentMarkdown: string;
  targetCountries: string[];
  officialSourceLinks: { title: string; url: string }[];
  lastVerifiedDate: string;
  isPublished: boolean;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export type JarvisConnectionStatus = 'connected' | 'disconnected' | 'not_configured';

export interface JarvisIntegrationConfig {
  endpointUrl: string;
  connectionStatus: JarvisConnectionStatus;
  apiKeyMasked: string;
  hasApiKey: boolean;
  lastHealthCheck?: string;
  allowedScopes: {
    readUniversities: boolean;
    researchMissingData: boolean;
    draftNewProfiles: boolean;
    draftScholarships: boolean;
    draftRelocationGuides: boolean;
    autoPublishApproved: boolean;
  };
}

export type ContentDraftType =
  | 'university'
  | 'scholarship'
  | 'country_guide'
  | 'study_program'
  | 'relocation_article';

export type ContentDraftStatus = 'draft' | 'under_review' | 'approved' | 'rejected' | 'published';

export interface ContentDraft {
  id: string;
  draftType: ContentDraftType;
  title: string;
  sourceOrganization?: string;
  sourceUrl?: string;
  researchedDate: string;
  verificationStatus: 'verified_official' | 'pending_verification' | 'unverified';
  status: ContentDraftStatus;
  contentData: Record<string, any>;
  aiGeneratedBy: 'JARVIS-AI-Assistant' | 'Human-Admin';
  adminNotes?: string;
  publishedRecordId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  entityType:
    | 'university'
    | 'scholarship'
    | 'country'
    | 'program'
    | 'guide'
    | 'partner'
    | 'jarvis_integration'
    | 'security';
  target: string;
  performedBy: string;
  role: 'admin' | 'jarvis_agent' | 'system_policy';
  timestamp: string;
  details?: string;
}
