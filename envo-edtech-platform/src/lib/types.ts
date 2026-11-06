/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'super_admin' | 'lc_admin' | 'teacher' | 'student' | 'parent';
export type AccountScope = 'center' | 'independent' | 'platform';
export type Language = 'uz' | 'ru' | 'en';
export type Gender = 'male' | 'female';
export type AudiencePreference = 'all' | 'male_only' | 'female_only';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accountScope: AccountScope;
  centerId?: string | null;
  avatarUrl?: string;
  phone?: string;
  gender?: Gender;
  audiencePreference?: AudiencePreference;
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'additional_documents_required'
  | 'approved'
  | 'rejected'
  | 'suspended';

export interface CertificateDoc {
  id: string;
  title: string;
  issuer: string;
  scoreOrGrade: string;
  fileUrl?: string;
  verified?: boolean;
}

export interface TeacherApplication {
  id: string;
  userId: string;
  legalName: string;
  nickname: string;
  email: string;
  phone: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: Gender;
  audiencePreference?: AudiencePreference;
  region: string;
  bio: string;
  education: string;
  experienceYears: number;
  subjects: string[];
  examTracks: string[];
  certificates: CertificateDoc[];
  identityDocUrl?: string;
  guardianConsentDocUrl?: string;
  status: ApplicationStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  nickname: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  subjects: string[];
  examTracks: string[];
  experienceYears: number;
  verified: boolean;
  rating: number;
  reviewCount: number;
  hourlyRateUzs: number;
  groupMonthlyRateUzs: number;
  isSponsored: boolean;
  region: string;
  gender: Gender;
  audiencePreference: AudiencePreference;
  age: number;
  education: string;
  badges: string[];
}

export interface MarketplaceGroup {
  id: string;
  teacherId: string;
  teacherName: string;
  courseTitle: string;
  subject: string;
  schedule: string;
  maxCapacity: number; // 1 to 3
  currentEnrolled: number;
  monthlyFeeUzs: number;
  status: 'open' | 'full' | 'in_progress' | 'completed';
  audiencePreference?: AudiencePreference;
}

export interface MarketplaceCourse {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  subject: string;
  examTrack?: string;
  level: string;
  priceUzs: number;
  durationWeeks: number;
  learningObjectives: string[];
  groups: MarketplaceGroup[];
}

export interface IndividualLessonSlot {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId?: string;
  studentName?: string;
  subject: string;
  startTime: string; // ISO
  endTime: string; // ISO
  priceUzs: number;
  status: 'available' | 'booked' | 'completed' | 'cancelled';
  meetingLink?: string;
}

export interface MarketplacePayment {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  itemType: 'group_enrollment' | 'individual_lesson' | 'sponsored_boost';
  itemName: string;
  grossAmountUzs: number;
  teacherShareUzs: number; // 83%
  envoCommissionUzs: number; // 17%
  providerFeeUzs: number;
  provider: 'uzcard' | 'humo' | 'visa' | 'mastercard' | 'payme' | 'click';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
}

export interface TeacherWallet {
  teacherId: string;
  availableBalanceUzs: number;
  pendingBalanceUzs: number;
  totalEarnedUzs: number;
}

export interface WalletTransaction {
  id: string;
  teacherId: string;
  paymentId?: string;
  type: 'lesson_credit' | 'payout_hold' | 'payout_settled' | 'refund_debit';
  amountUzs: number;
  balanceAfterUzs: number;
  description: string;
  createdAt: string;
}

export interface PayoutRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  amountUzs: number;
  cardNumberMasked: string;
  bankName: string;
  cardholderName: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  adminNotes?: string;
  createdAt: string;
}

// Learning Center SaaS Types
export interface CenterSubscription {
  id: string;
  centerId: string;
  centerName: string;
  plan: 'Standard' | 'Premium' | 'Pro+';
  status: 'active' | 'expired' | 'pending_renewal';
  startDate: string;
  endDate: string; // Extended in 30-day intervals
}

export interface CenterPayment {
  id: string;
  centerId: string;
  centerName: string;
  plan: 'Standard' | 'Premium' | 'Pro+';
  amountUsd: number;
  amountUzs: number;
  status: 'pending' | 'completed' | 'rejected';
  receiptUrl?: string;
  receiptNumber?: string;
  requestedBy: string;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface CenterClass {
  id: string;
  centerId: string;
  name: string;
  teacherName: string;
  studentCount: number;
  schedule: string;
}

// Assessment & Exam Types
export interface ExamQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'written';
  options?: string[];
  correctOptionIndex?: number;
  points: number;
  explanation?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  description?: string;
  courseTitle?: string;
  teacherName?: string;
  centerId?: string | null;
  createdBy: string;
  createdByName: string;
  durationMinutes: number;
  passingPoints: number;
  passingScore?: number;
  totalPoints: number;
  questions: ExamQuestion[];
  scheduleStart: string;
  scheduleEnd: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  subject: string;
  studentId: string;
  studentName: string;
  answers: Record<string, string | number>;
  score: number;
  percentage: number;
  passed?: boolean;
  status: 'submitted' | 'graded';
  teacherFeedback?: string;
  submittedAt: string;
}

// Homework Assignment & Submission
export interface HomeworkAssignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  className: string;
  teacherName?: string;
  centerId?: string | null;
  assignedBy: string;
  assignedByName: string;
  dueDate: string;
  attachmentName?: string;
  attachmentSize?: string;
  maxScore: number;
  createdAt: string;
}

export interface HomeworkSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  content: string;
  fileName?: string;
  fileSize?: string;
  score?: number;
  maxScore: number;
  teacherFeedback?: string;
  status: 'submitted' | 'graded' | 'resubmit_requested';
  submittedAt: string;
}

// Multi-Child Support for Parent Portal
export interface ParentChild {
  id: string;
  parentId?: string;
  name: string;
  gender: Gender;
  avatarUrl?: string;
  centerName: string;
  groupName: string;
  teacherName: string;
  teacherPhone?: string;
  attendanceRate?: number;
  attendancePercent?: number;
  recentGrade?: string;
  feeStatus: 'paid' | 'pending' | 'due';
  feeAmountUzs?: number;
  monthlyFeeUzs?: number;
  grades?: Array<{ subject: string; score: string; date: string }>;
  attendanceLogs?: Array<{ date: string; lesson: string; status: string; note: string }>;
}

// Virtual Classroom Presentation Document
export interface PresentationDoc {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'docx' | 'image';
  pageCount: number;
  currentPage: number;
  fileUrl: string;
  pages: string[]; // text or preview slides
}
