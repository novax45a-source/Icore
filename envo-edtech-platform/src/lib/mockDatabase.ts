/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TeacherProfile,
  TeacherApplication,
  MarketplaceCourse,
  MarketplaceGroup,
  MarketplacePayment,
  TeacherWallet,
  WalletTransaction,
  PayoutRequest,
  IndividualLessonSlot,
  CenterSubscription,
  CenterPayment,
  CenterClass,
  Exam,
  ExamSubmission,
  HomeworkAssignment,
  HomeworkSubmission,
  ParentChild,
  Gender,
  AudiencePreference,
} from './types';
import { calculateMarketplaceSplit } from './commission';
import { evaluateGroupEnrollment } from './groupCapacity';

const STORAGE_KEY = 'envo_platform_state_v2';

export interface SubjectCatalogItem {
  id: string;
  name: string;
  nameEn: string;
  category: 'language' | 'stem' | 'humanities' | 'test_prep';
  description: string;
  activeTeachersCount: number;
}

export interface EnvoPlatformState {
  teacherProfiles: TeacherProfile[];
  teacherApplications: TeacherApplication[];
  marketplaceCourses: MarketplaceCourse[];
  marketplaceGroups: MarketplaceGroup[];
  marketplacePayments: MarketplacePayment[];
  teacherWallets: Record<string, TeacherWallet>;
  walletTransactions: WalletTransaction[];
  payoutRequests: PayoutRequest[];
  lessonSlots: IndividualLessonSlot[];
  centerSubscriptions: CenterSubscription[];
  centerPayments: CenterPayment[];
  centerClasses: CenterClass[];
  exams: Exam[];
  examSubmissions: ExamSubmission[];
  homeworkAssignments: HomeworkAssignment[];
  homeworkSubmissions: HomeworkSubmission[];
  parentChildren: ParentChild[];
  subjectsCatalog: SubjectCatalogItem[];
}

function getInitialState(): EnvoPlatformState {
  const teacherId1 = 'teacher-101';
  const teacherId2 = 'teacher-102';
  const teacherId3 = 'teacher-103';
  const teacherId4 = 'teacher-104'; // Arabic Language Expert (Female Only)
  const teacherId5 = 'teacher-105'; // German Language Expert

  return {
    subjectsCatalog: [
      { id: 'ingliz_tili', name: 'Ingliz tili', nameEn: 'English Language', category: 'language', description: 'General English, IELTS, TOEFL, Speaking Club', activeTeachersCount: 8 },
      { id: 'arab_tili', name: 'Arab tili', nameEn: 'Arabic Language', category: 'language', description: 'Tajvid, Nahv, Sarf, So‘zlashuv va CEFR arab tili', activeTeachersCount: 4 },
      { id: 'nemis_tili', name: 'Nemis tili', nameEn: 'German Language', category: 'language', description: 'Goethe-Zertifikat A1-C1, TestDaF, Ausbildung tayyorgarligi', activeTeachersCount: 5 },
      { id: 'matematika', name: 'Matematika', nameEn: 'Mathematics', category: 'stem', description: 'DTM, Milliy Sertifikat, SAT Math va Olimpiada masalalari', activeTeachersCount: 7 },
      { id: 'ona_tili', name: 'Ona tili', nameEn: 'Uzbek Language', category: 'humanities', description: 'Grammatika, adabiyot tahlili va insho yozish', activeTeachersCount: 3 },
      { id: 'fizika', name: 'Fizika', nameEn: 'Physics', category: 'stem', description: 'Mexanika, termodinamika, elektrodinamika va DTM', activeTeachersCount: 3 },
      { id: 'kimyo', name: 'Kimyo', nameEn: 'Chemistry', category: 'stem', description: 'Tibbiyot universitetlari va xalqaro olimpiadalar', activeTeachersCount: 2 },
      { id: 'biologiya', name: 'Biologiya', nameEn: 'Biology', category: 'stem', description: 'Anatomiya, genetika, botanika va DTM biologiya', activeTeachersCount: 2 },
      { id: 'tarix', name: 'Tarix', nameEn: 'History', category: 'humanities', description: 'O‘zbekiston va Jahon tarixi testlari', activeTeachersCount: 2 },
      { id: 'sat_prep', name: 'SAT (Math & Verbal)', nameEn: 'SAT Prep', category: 'test_prep', description: 'Digital SAT 1500+ tayyorgarlik kursi', activeTeachersCount: 4 },
    ],

    teacherProfiles: [
      {
        id: 'tp-1',
        userId: teacherId1,
        nickname: 'Jasur_IELTS_SAT',
        fullName: 'Jasur Aliyev',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: 'Cambridge CELTA & CEFR C2 sohibi. 7 yillik tajribaga ega xalqaro imtihonlar bo‘yicha ekspert. O‘quvchilarim o‘rtacha IELTS 7.5+ va SAT 1480+ natija ko‘rsatishadi.',
        subjects: ['Ingliz tili', 'SAT Verbal', 'IELTS Writing'],
        examTracks: ['IELTS', 'SAT', 'CEFR C2'],
        experienceYears: 7,
        verified: true,
        rating: 4.96,
        reviewCount: 42,
        hourlyRateUzs: 200000,
        groupMonthlyRateUzs: 650000,
        isSponsored: true,
        region: 'Toshkent',
        gender: 'male',
        audiencePreference: 'all',
        age: 28,
        education: "O'zbekiston Davlat Jahon Tillari Universiteti (Magistratura)",
        badges: ['Top Rated', 'Verified SAT 1520', 'CEFR C2'],
      },
      {
        id: 'tp-2',
        userId: teacherId2,
        nickname: 'Nilufar_OnaTili',
        fullName: 'Nilufar Karimova',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        bio: 'Ona tili va adabiyot fanidan A+ milliy sertifikat sohibasi. DTM va Prezident maktablari imtihonlariga individual yondashuv asosida 1–3 kishilik guruhlarda tayyorlayman.',
        subjects: ['Ona tili', 'Adabiyot'],
        examTracks: ['Milliy Sertifikat A+', 'DTM'],
        experienceYears: 5,
        verified: true,
        rating: 4.92,
        reviewCount: 31,
        hourlyRateUzs: 160000,
        groupMonthlyRateUzs: 480000,
        isSponsored: false,
        region: 'Samarqand',
        gender: 'female',
        audiencePreference: 'all',
        age: 26,
        education: 'SamDU Filologiya fakulteti',
        badges: ['Milliy Sertifikat A+', 'Olimpiada murabbiyi'],
      },
      {
        id: 'tp-3',
        userId: teacherId3,
        nickname: 'Dilshod_Math',
        fullName: 'Dilshod Umarov',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        bio: 'Matematika fani bo‘yicha oliy toifali pedagog. SAT Math bo‘yicha 800/800 ball olgan. Faqat o‘g‘il bolalar guruhi uchun chuqurlashtirilgan mashg‘ulotlar o‘tadi.',
        subjects: ['Matematika', 'SAT Math', 'Fizika'],
        examTracks: ['SAT', 'Milliy Sertifikat A+'],
        experienceYears: 8,
        verified: true,
        rating: 4.98,
        reviewCount: 56,
        hourlyRateUzs: 220000,
        groupMonthlyRateUzs: 700000,
        isSponsored: false,
        region: 'Toshkent',
        gender: 'male',
        audiencePreference: 'male_only',
        age: 31,
        education: 'O‘zMU Matematika fakulteti',
        badges: ['SAT Math 800', 'Top Mentor'],
      },
      {
        id: 'tp-4',
        userId: teacherId4,
        nickname: 'Ustaza_Malika_Arabic',
        fullName: 'Malika Qosimova',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        bio: 'Qohira Al-Azhar universiteti bitiruvchisi. Arab tili grammatikasi (Nahv, Sarf) va Tajvid qoidalari bo‘yicha xalqaro ijoza sohibasi. Darslar qat’iy ravishda faqat xotin-qizlar va qiz bolalar uchun o‘tiladi.',
        subjects: ['Arab tili', 'Tajvid', 'Nahv va Sarf'],
        examTracks: ['Al-Azhar Ijoza', 'CEFR C1 Arab tili'],
        experienceYears: 6,
        verified: true,
        rating: 5.0,
        reviewCount: 38,
        hourlyRateUzs: 180000,
        groupMonthlyRateUzs: 550000,
        isSponsored: true,
        region: 'Toshkent',
        gender: 'female',
        audiencePreference: 'female_only',
        age: 29,
        education: 'Al-Azhar Universiteti (Misr), Islomshunoslik fakulteti',
        badges: ['Al-Azhar Ijoza', 'Faqat Ayollar Uchun', 'CEFR C1'],
      },
      {
        id: 'tp-5',
        userId: teacherId5,
        nickname: 'Feruza_Deutsch',
        fullName: 'Feruza Vohidova',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        bio: 'Geydelberg universiteti (Germaniya) bitiruvchisi, Goethe-Zertifikat C2 (Großes Deutsches Sprachdiplom) egasi. Nemis tilida erkin so‘zlashuv va Germaniyaga viza imtihonlariga tayyorlayman.',
        subjects: ['Nemis tili', 'Goethe B1-B2', 'TestDaF'],
        examTracks: ['Goethe C2', 'TestDaF TDN 5'],
        experienceYears: 7,
        verified: true,
        rating: 4.95,
        reviewCount: 29,
        hourlyRateUzs: 210000,
        groupMonthlyRateUzs: 600000,
        isSponsored: false,
        region: 'Toshkent',
        gender: 'female',
        audiencePreference: 'all',
        age: 30,
        education: 'Heidelberg Universität (Germaniya), Germanistika',
        badges: ['Goethe C2', 'TestDaF Expert'],
      },
    ],

    teacherApplications: [],

    marketplaceCourses: [
      {
        id: 'c-1',
        teacherId: teacherId1,
        title: 'Digital SAT Verbal & Reading Intensive',
        description: 'SAT 1450+ maqsad qilganlar uchun modul asosidagi kichik guruh mashg‘ulotlari.',
        subject: 'SAT Verbal',
        examTrack: 'SAT',
        level: 'Advanced',
        priceUzs: 650000,
        durationWeeks: 8,
        learningObjectives: ['Desanitizing reading passages', 'Vocabulary in context', 'Grammar conventions'],
        groups: [],
      },
      {
        id: 'c-2',
        teacherId: teacherId4,
        title: 'Arab Tili: Boshlang‘ichdan Ravon So‘zlashuvgacha (Faqat Qizlar)',
        description: 'Ayollar va qizlar uchun arab tili grammatikasi, to‘g‘ri talaffuz va boy so‘z boyligi.',
        subject: 'Arab tili',
        examTrack: 'CEFR C1 Arab tili',
        level: 'Beginner-Intermediate',
        priceUzs: 550000,
        durationWeeks: 12,
        learningObjectives: ['Harflar va maxrajlar', 'Nahv va Sarf qoidalari', 'Kundalik dialoglar'],
        groups: [],
      },
      {
        id: 'c-3',
        teacherId: teacherId5,
        title: 'Nemis Tili Goethe-Zertifikat B1/B2 Intensiv',
        description: 'Germaniyada o‘qish yoki ishlash (Ausbildung) niyatida bo‘lganlar uchun maxsus kurs.',
        subject: 'Nemis tili',
        examTrack: 'Goethe B1-B2',
        level: 'Intermediate',
        priceUzs: 600000,
        durationWeeks: 10,
        learningObjectives: ['Hören & Lesen strategiyalari', 'Schreiben insho tahlili', 'Sprechen simulyatsiyalari'],
        groups: [],
      },
    ],

    marketplaceGroups: [
      {
        id: 'grp-001',
        teacherId: teacherId1,
        teacherName: 'Jasur Aliyev',
        courseTitle: 'Digital SAT Verbal (Mini-Guruh)',
        subject: 'SAT Verbal',
        schedule: 'Dush-Chor-Juma 18:00',
        maxCapacity: 3,
        currentEnrolled: 2,
        monthlyFeeUzs: 650000,
        status: 'open',
        audiencePreference: 'all',
      },
      {
        id: 'grp-002',
        teacherId: teacherId4,
        teacherName: 'Malika Qosimova',
        courseTitle: 'Arab Tili: Nahv & So‘zlashuv (Faqat Ayollar)',
        subject: 'Arab tili',
        schedule: 'Sesh-Pay-Shan 10:00',
        maxCapacity: 3,
        currentEnrolled: 1,
        monthlyFeeUzs: 550000,
        status: 'open',
        audiencePreference: 'female_only',
      },
      {
        id: 'grp-003',
        teacherId: teacherId5,
        teacherName: 'Feruza Vohidova',
        courseTitle: 'Nemis Tili B1 Goethe Prep',
        subject: 'Nemis tili',
        schedule: 'Dush-Chor-Juma 16:30',
        maxCapacity: 3,
        currentEnrolled: 2,
        monthlyFeeUzs: 600000,
        status: 'open',
        audiencePreference: 'all',
      },
      {
        id: 'grp-004',
        teacherId: teacherId3,
        teacherName: 'Dilshod Umarov',
        courseTitle: 'SAT Math 800 Club (Faqat Yigitlar)',
        subject: 'Matematika',
        schedule: 'Sesh-Pay-Shan 19:00',
        maxCapacity: 3,
        currentEnrolled: 3,
        monthlyFeeUzs: 700000,
        status: 'full',
        audiencePreference: 'male_only',
      },
    ],

    marketplacePayments: [
      {
        id: 'pay-seed-1',
        studentId: 'student-demo',
        studentName: 'Bobur Mirzayev',
        teacherId: teacherId1,
        teacherName: 'Jasur Aliyev',
        itemType: 'group_enrollment',
        itemName: 'Digital SAT Verbal (Mini-Guruh)',
        grossAmountUzs: 650000,
        teacherShareUzs: 539500, // 83%
        envoCommissionUzs: 110500, // 17%
        providerFeeUzs: 0,
        provider: 'uzcard',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],

    teacherWallets: {
      [teacherId1]: {
        teacherId: teacherId1,
        availableBalanceUzs: 1079000,
        pendingBalanceUzs: 539500,
        totalEarnedUzs: 4316000,
      },
      [teacherId4]: {
        teacherId: teacherId4,
        availableBalanceUzs: 456500,
        pendingBalanceUzs: 0,
        totalEarnedUzs: 1826000,
      },
      [teacherId5]: {
        teacherId: teacherId5,
        availableBalanceUzs: 996000,
        pendingBalanceUzs: 498000,
        totalEarnedUzs: 2988000,
      },
    },

    walletTransactions: [
      {
        id: 'wtx-1',
        teacherId: teacherId1,
        paymentId: 'pay-seed-1',
        type: 'lesson_credit',
        amountUzs: 539500,
        balanceAfterUzs: 1079000,
        description: 'Guruh to‘lovi ulushi (83%): Digital SAT Verbal',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],

    payoutRequests: [],

    lessonSlots: [
      {
        id: 'slot-1',
        teacherId: teacherId1,
        teacherName: 'Jasur Aliyev',
        subject: 'IELTS Speaking Mock',
        startTime: new Date(Date.now() + 7200000).toISOString(),
        endTime: new Date(Date.now() + 10800000).toISOString(),
        priceUzs: 200000,
        status: 'available',
      },
      {
        id: 'slot-2',
        teacherId: teacherId4,
        teacherName: 'Malika Qosimova',
        subject: 'Arab tili Yakka Dars (Faqat Qizlar)',
        startTime: new Date(Date.now() + 14400000).toISOString(),
        endTime: new Date(Date.now() + 18000000).toISOString(),
        priceUzs: 180000,
        status: 'available',
      },
      {
        id: 'slot-3',
        teacherId: teacherId5,
        teacherName: 'Feruza Vohidova',
        subject: 'Nemis tili Konsultatsiya & Sprechen',
        startTime: new Date(Date.now() + 21600000).toISOString(),
        endTime: new Date(Date.now() + 25200000).toISOString(),
        priceUzs: 210000,
        status: 'available',
      },
    ],

    centerSubscriptions: [
      {
        id: 'sub-demo',
        centerId: 'center-1',
        centerName: 'Registon O‘quv Markazi',
        plan: 'Premium',
        status: 'active',
        startDate: '2026-10-15T00:00:00Z',
        endDate: '2026-11-14T00:00:00Z',
      },
    ],

    centerPayments: [
      {
        id: 'cp-1',
        centerId: 'center-1',
        centerName: 'Registon O‘quv Markazi',
        plan: 'Premium',
        amountUsd: 112,
        amountUzs: 1422400,
        status: 'pending',
        receiptNumber: 'REG-2026-1102-PAY',
        requestedBy: 'Aziz Raximov (LC Admin)',
        createdAt: '2026-11-03T10:14:00Z',
      },
      {
        id: 'cp-2',
        centerId: 'center-2',
        centerName: 'Al-Xorazmiy Academy',
        plan: 'Standard',
        amountUsd: 80,
        amountUzs: 1016000,
        status: 'completed',
        receiptNumber: 'XOR-2026-1005-PAY',
        requestedBy: 'Bobur Saidov (Admin)',
        reviewedBy: 'Novax (Super Admin)',
        createdAt: '2026-10-05T09:30:00Z',
      },
    ],

    centerClasses: [
      {
        id: 'cls-1',
        centerId: 'center-1',
        name: 'General English Intermediate B1-04',
        teacherName: 'Sherzod Qodirov',
        studentCount: 16,
        schedule: 'Dush-Chor-Juma 14:00',
      },
      {
        id: 'cls-2',
        centerId: 'center-1',
        name: 'IELTS Foundation G-12',
        teacherName: 'Kamola Karimova',
        studentCount: 14,
        schedule: 'Sesh-Pay-Shan 16:00',
      },
      {
        id: 'cls-3',
        centerId: 'center-1',
        name: 'Nemis Tili A2-01 (Ausbildung)',
        teacherName: 'Feruza Vohidova',
        studentCount: 15,
        schedule: 'Dush-Chor-Juma 16:00',
      },
      {
        id: 'cls-4',
        centerId: 'center-1',
        name: 'Arab Tili Tajvid va Qiroat',
        teacherName: 'Malika Qosimova',
        studentCount: 12,
        schedule: 'Sesh-Pay-Shan 11:00',
      },
    ],

    // Assessments & Exams
    exams: [
      {
        id: 'ex-1',
        title: 'SAT Math Diagnostic Assessment #1',
        subject: 'Matematika',
        courseTitle: 'SAT Math 800 Club',
        createdBy: teacherId3,
        createdByName: 'Dilshod Umarov',
        durationMinutes: 30,
        passingPoints: 70,
        totalPoints: 100,
        scheduleStart: '2026-11-01T00:00:00Z',
        scheduleEnd: '2026-11-15T23:59:59Z',
        isPublished: true,
        createdAt: '2026-11-01T12:00:00Z',
        questions: [
          {
            id: 'q1',
            text: 'If 3x + 7 = 22, what is the value of 6x - 2?',
            type: 'multiple_choice',
            options: ['28', '30', '32', '34'],
            correctOptionIndex: 0,
            points: 20,
            explanation: '3x = 15 => x = 5. Therefore 6(5) - 2 = 28.',
          },
          {
            id: 'q2',
            text: 'What is the sum of the solutions to x² - 8x + 12 = 0?',
            type: 'multiple_choice',
            options: ['4', '6', '8', '12'],
            correctOptionIndex: 2,
            points: 20,
            explanation: 'By Vieta formula: -b/a = -(-8)/1 = 8.',
          },
          {
            id: 'q3',
            text: 'If f(x) = 2x² - 3 and g(x) = x + 4, what is the value of f(g(2))?',
            type: 'multiple_choice',
            options: ['69', '66', '33', '15'],
            correctOptionIndex: 0,
            points: 20,
            explanation: 'g(2) = 6. f(6) = 2(36) - 3 = 72 - 3 = 69.',
          },
          {
            id: 'q4',
            text: 'Explain the difference between linear growth and exponential growth in 2 sentences.',
            type: 'written',
            points: 40,
            explanation: 'Linear growth increases by a constant difference, while exponential growth increases by a constant multiplier.',
          },
        ],
      },
      {
        id: 'ex-2',
        title: 'Arab Tili: Nahv va Sarf Oraliq Imtihoni',
        subject: 'Arab tili',
        courseTitle: 'Arab Tili: Nahv & So‘zlashuv',
        createdBy: teacherId4,
        createdByName: 'Malika Qosimova',
        durationMinutes: 40,
        passingPoints: 75,
        totalPoints: 100,
        scheduleStart: '2026-11-02T00:00:00Z',
        scheduleEnd: '2026-11-20T23:59:59Z',
        isPublished: true,
        createdAt: '2026-11-02T10:00:00Z',
        questions: [
          {
            id: 'aq1',
            text: 'Arab tilida kalima (so‘z) nechta turga bo‘linadi?',
            type: 'multiple_choice',
            options: ['2 turga: Ism va Fe’l', '3 turga: Ism, Fe’l va Harf', '4 turga: Ism, Sifat, Fe’l, Zarf', '5 turga'],
            correctOptionIndex: 1,
            points: 25,
            explanation: 'Kalima 3 qismdan iborat: Ism, Fe’l va Harf.',
          },
          {
            id: 'aq2',
            text: 'Mubtado va Xabar qaysi e’rob holatida bo‘ladi?',
            type: 'multiple_choice',
            options: ['Marfu’ (Damma bilan)', 'Mansub (Fatha bilan)', 'Majrur (Kasra bilan)', 'Majzum (Sukun bilan)'],
            correctOptionIndex: 0,
            points: 25,
            explanation: 'Mubtado va Xabar har doim marfu’ bo‘ladi.',
          },
          {
            id: 'aq3',
            text: 'Jumla ismiya va Jumla fe’liya orasidagi farqni misollar bilan tushuntirib bering.',
            type: 'written',
            points: 50,
          },
        ],
      },
      {
        id: 'ex-3',
        title: 'Goethe-Zertifikat B1 Nemis Tili Testi',
        subject: 'Nemis tili',
        courseTitle: 'Nemis Tili B1 Goethe Prep',
        createdBy: teacherId5,
        createdByName: 'Feruza Vohidova',
        durationMinutes: 35,
        passingPoints: 60,
        totalPoints: 100,
        scheduleStart: '2026-11-03T00:00:00Z',
        scheduleEnd: '2026-11-25T23:59:59Z',
        isPublished: true,
        createdAt: '2026-11-03T14:00:00Z',
        questions: [
          {
            id: 'gq1',
            text: 'Welches Verb passt: "Ich ___ gestern nach Berlin gefahren."',
            type: 'multiple_choice',
            options: ['habe', 'bin', 'werde', 'hatte'],
            correctOptionIndex: 1,
            points: 25,
            explanation: 'Bewegungsverben mit Richtungsänderung bilden das Perfekt mit "sein".',
          },
          {
            id: 'gq2',
            text: 'Ergänzen Sie: "Ich freue mich ___ Ihren Besuch!"',
            type: 'multiple_choice',
            options: ['auf', 'über', 'an', 'mit'],
            correctOptionIndex: 0,
            points: 25,
            explanation: 'Sich freuen auf + Akk. für zukünftige Ereignisse.',
          },
          {
            id: 'gq3',
            text: 'Schreiben Sie eine kurze Nachricht an Ihren Freund: Sie können heute nicht kommen.',
            type: 'written',
            points: 50,
          },
        ],
      },
    ],

    examSubmissions: [
      {
        id: 'sub-ex-1',
        examId: 'ex-1',
        examTitle: 'SAT Math Diagnostic Assessment #1',
        subject: 'Matematika',
        studentId: 'student-demo',
        studentName: 'Bobur Mirzayev',
        answers: {
          q1: 0,
          q2: 2,
          q3: 0,
          q4: 'Linear growth adds a fixed value every period, whereas exponential growth multiplies by a ratio.',
        },
        score: 95,
        percentage: 95,
        status: 'graded',
        teacherFeedback: 'Barakalla! Barcha masalalar va Vieta qoidasi to‘g‘ri qo‘llanilgan.',
        submittedAt: '2026-11-03T16:20:00Z',
      },
    ],

    // Homework System
    homeworkAssignments: [
      {
        id: 'hw-1',
        title: 'SAT Practice Test 4: Section 2 Math No-Calculator',
        description: 'Rasmiy CollegeBoard to‘plamidan 20 ta masalani ishlab, yechimlari bilan PDF formatda yuklang.',
        subject: 'SAT Math',
        className: 'SAT Math 800 Club',
        assignedBy: teacherId3,
        assignedByName: 'Dilshod Umarov',
        dueDate: '2026-11-08T23:59:59Z',
        attachmentName: 'SAT_Test_4_Section_2.pdf',
        attachmentSize: '2.1 MB',
        maxScore: 100,
        createdAt: '2026-11-04T08:00:00Z',
      },
      {
        id: 'hw-2',
        title: 'Arab Tili: Fe’l tuslanishi va 10 ta jumlani tahlil qilish',
        description: 'Mubtado va xabarga oid 10 ta gap tuzing va e’roblarini ko‘rsating.',
        subject: 'Arab tili',
        className: 'Arab Tili: Nahv & So‘zlashuv',
        assignedBy: teacherId4,
        assignedByName: 'Malika Qosimova',
        dueDate: '2026-11-09T18:00:00Z',
        attachmentName: 'Nahv_Mashqlar_Dars_4.pdf',
        attachmentSize: '1.2 MB',
        maxScore: 100,
        createdAt: '2026-11-04T09:00:00Z',
      },
      {
        id: 'hw-3',
        title: 'Nemis Tili: B1 Brief Schreiben (Wohnungssuche)',
        description: 'Kvartira egasiga rasmiy xat yozing (kamida 80 ta so‘z).',
        subject: 'Nemis tili',
        className: 'Nemis Tili B1 Goethe Prep',
        assignedBy: teacherId5,
        assignedByName: 'Feruza Vohidova',
        dueDate: '2026-11-07T20:00:00Z',
        attachmentName: 'B1_Schreiben_Thema_3.pdf',
        attachmentSize: '850 KB',
        maxScore: 100,
        createdAt: '2026-11-03T11:00:00Z',
      },
    ],

    homeworkSubmissions: [
      {
        id: 'hw-sub-1',
        assignmentId: 'hw-1',
        assignmentTitle: 'SAT Practice Test 4: Section 2 Math No-Calculator',
        studentId: 'student-demo',
        studentName: 'Bobur Mirzayev',
        content: 'Barcha 20 ta masala to‘liq yechildi. 18-masalada muqobil usuldan foydalanildi.',
        fileName: 'Bobur_Mirzayev_SAT_Math_Test4.pdf',
        fileSize: '3.4 MB',
        score: 96,
        maxScore: 100,
        teacherFeedback: 'Ajoyib natija! Geometriya burchaklari tahlili benuqson.',
        status: 'graded',
        submittedAt: '2026-11-03T17:45:00Z',
      },
    ],

    // Multi-Child Parent Portal Support
    parentChildren: [
      {
        id: 'child-1',
        name: 'Nodir Toirov',
        gender: 'male',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
        centerName: 'Registon O‘quv Markazi',
        groupName: 'IELTS Foundation G-12',
        teacherName: 'Kamola Karimova',
        attendanceRate: 96,
        recentGrade: '92/100 (IELTS Mock)',
        feeStatus: 'paid',
        feeAmountUzs: 750000,
      },
      {
        id: 'child-2',
        name: 'Rayhona Toirova',
        gender: 'female',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        centerName: 'Al-Xorazmiy Academy',
        groupName: 'Nemis Tili A2-01 (Ausbildung)',
        teacherName: 'Feruza Vohidova',
        attendanceRate: 98,
        recentGrade: '95/100 (Grammatika testi)',
        feeStatus: 'paid',
        feeAmountUzs: 650000,
      },
    ],
  };
}

class MockDatabase {
  private state: EnvoPlatformState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): EnvoPlatformState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return getInitialState();
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore
    }
  }

  public getState(): EnvoPlatformState {
    return this.state;
  }

  // Audience matching eligibility helper
  public checkAudienceEligibility(
    teacherAudience: AudiencePreference = 'all',
    studentGender: Gender = 'male'
  ): { allowed: boolean; reason?: string } {
    if (teacherAudience === 'all') {
      return { allowed: true };
    }
    if (teacherAudience === 'female_only') {
      if (studentGender === 'female') return { allowed: true };
      return {
        allowed: false,
        reason: 'Bu ustoz qat’iy ravishda faqat xotin-qizlar va qiz bolalar uchun dars beradi. Erkak o‘quvchilar ro‘yxatdan o‘ta olmaydi.',
      };
    }
    if (teacherAudience === 'male_only') {
      if (studentGender === 'male') return { allowed: true };
      return {
        allowed: false,
        reason: 'Bu ustoz qat’iy ravishda faqat o‘g‘il bolalar / erkaklar uchun dars beradi. Ayol o‘quvchilar ro‘yxatdan o‘ta olmaydi.',
      };
    }
    return { allowed: true };
  }

  // Submit an exam by a student
  public submitExam(
    examId: string,
    studentId: string,
    studentName: string,
    answers: Record<string, string | number>
  ): ExamSubmission {
    const exam = this.state.exams.find((e) => e.id === examId);
    let autoScore = 0;
    let totalPoints = exam ? exam.totalPoints : 100;

    if (exam) {
      exam.questions.forEach((q) => {
        if (q.type === 'multiple_choice' && q.correctOptionIndex !== undefined) {
          const studentAns = Number(answers[q.id]);
          if (studentAns === q.correctOptionIndex) {
            autoScore += q.points;
          }
        } else if (q.type === 'written') {
          // Written questions start with baseline partial points pending teacher grading
          if (String(answers[q.id] || '').length > 10) {
            autoScore += Math.round(q.points * 0.8);
          }
        }
      });
    }

    const percentage = Math.min(100, Math.round((autoScore / totalPoints) * 100));

    const submission: ExamSubmission = {
      id: 'sub-' + Date.now(),
      examId,
      examTitle: exam ? exam.title : 'Imtihon',
      subject: exam ? exam.subject : 'Fan',
      studentId,
      studentName,
      answers,
      score: autoScore,
      percentage,
      status: 'graded',
      teacherFeedback: percentage >= 70 ? 'Muvaffaqiyatli topshirildi!' : 'Qayta tayyorgarlik tavsiya etiladi.',
      submittedAt: new Date().toISOString(),
    };

    this.state.examSubmissions.unshift(submission);
    this.saveState();
    return submission;
  }

  // Submit homework
  public submitHomework(
    assignmentIdOrData: string | { assignmentId: string; studentId: string; studentName: string; content: string; attachments?: string[] },
    studentId?: string,
    studentName?: string,
    content?: string,
    fileName: string = 'Topshiriq_Javobi.pdf'
  ): HomeworkSubmission {
    let aid: string;
    let sid: string;
    let sname: string;
    let cnt: string;
    let fname: string;

    if (typeof assignmentIdOrData === 'object') {
      aid = assignmentIdOrData.assignmentId;
      sid = assignmentIdOrData.studentId;
      sname = assignmentIdOrData.studentName;
      cnt = assignmentIdOrData.content;
      fname = assignmentIdOrData.attachments?.[0] || 'Topshiriq_Javobi.pdf';
    } else {
      aid = assignmentIdOrData;
      sid = studentId || 'std-101';
      sname = studentName || 'O‘quvchi';
      cnt = content || '';
      fname = fileName;
    }

    const assignment = this.state.homeworkAssignments.find((a) => a.id === aid);
    const submission: HomeworkSubmission = {
      id: 'hw-sub-' + Date.now(),
      assignmentId: aid,
      assignmentTitle: assignment ? assignment.title : 'Topshiriq',
      studentId: sid,
      studentName: sname,
      content: cnt,
      fileName: fname,
      fileSize: '1.8 MB',
      maxScore: assignment ? assignment.maxScore : 100,
      score: 92,
      teacherFeedback: 'Vazifa qabul qilindi va tekshirildi.',
      status: 'graded',
      submittedAt: new Date().toISOString(),
    };

    this.state.homeworkSubmissions.unshift(submission);
    this.saveState();
    return submission;
  }

  // Update teacher settings
  public updateTeacherSettings(
    teacherUserId: string,
    updates: {
      gender?: Gender;
      audiencePreference?: AudiencePreference;
      bio?: string;
      hourlyRateUzs?: number;
      groupMonthlyRateUzs?: number;
    }
  ): void {
    const profile = this.state.teacherProfiles.find((t) => t.userId === teacherUserId);
    if (profile) {
      if (updates.gender) profile.gender = updates.gender;
      if (updates.audiencePreference) profile.audiencePreference = updates.audiencePreference;
      if (updates.bio) profile.bio = updates.bio;
      if (updates.hourlyRateUzs) profile.hourlyRateUzs = updates.hourlyRateUzs;
      if (updates.groupMonthlyRateUzs) profile.groupMonthlyRateUzs = updates.groupMonthlyRateUzs;
      this.saveState();
    }
  }

  // Add / manage subject
  public addSubject(name: string, nameEn: string, category: 'language' | 'stem' | 'humanities' | 'test_prep', description: string): void {
    const id = name.toLowerCase().replace(/\s+/g, '_');
    this.state.subjectsCatalog.push({
      id,
      name,
      nameEn,
      category,
      description,
      activeTeachersCount: 1,
    });
    this.saveState();
  }

  // Existing methods preserved
  public reviewManualPayment(paymentId: string, approved: boolean, reviewedBy: string, rejectionReason?: string) {
    const payment = this.state.centerPayments.find((p) => p.id === paymentId);
    if (!payment) return { success: false, message: 'Payment not found' };

    payment.status = approved ? 'completed' : 'rejected';
    payment.reviewedBy = reviewedBy;
    if (!approved && rejectionReason) {
      payment.rejectionReason = rejectionReason;
    }

    if (approved) {
      let sub = this.state.centerSubscriptions.find((s) => s.centerId === payment.centerId);
      if (sub) {
        sub.status = 'active';
        sub.plan = payment.plan;
        const currentEnd = new Date(sub.endDate) > new Date() ? new Date(sub.endDate) : new Date();
        currentEnd.setDate(currentEnd.getDate() + 30);
        sub.endDate = currentEnd.toISOString();
      }
    }

    this.saveState();
    return { success: true };
  }

  public enrollInGroup(groupId: string, studentId: string) {
    const group = this.state.marketplaceGroups.find((g) => g.id === groupId);
    if (!group) return { success: false, error: 'Group not found' };

    const check = evaluateGroupEnrollment(group.currentEnrolled, group.maxCapacity);
    if (!check.canEnroll) return { success: false, error: check.errorMessage };

    group.currentEnrolled += 1;
    if (group.currentEnrolled >= group.maxCapacity) {
      group.status = 'full';
    }

    this.saveState();
    return { success: true, currentEnrolled: group.currentEnrolled };
  }

  public processPayment(
    studentId: string,
    studentName: string,
    teacherId: string,
    itemType: 'group_enrollment' | 'individual_lesson',
    itemName: string,
    grossAmountUzs: number,
    provider: 'uzcard' | 'humo' | 'visa' | 'mastercard'
  ) {
    const split = calculateMarketplaceSplit(grossAmountUzs);
    const teacher = this.state.teacherProfiles.find((t) => t.userId === teacherId);

    const payment: MarketplacePayment = {
      id: 'pay-' + Date.now(),
      studentId,
      studentName,
      teacherId,
      teacherName: teacher ? teacher.fullName : 'Ustoz',
      itemType,
      itemName,
      grossAmountUzs: split.grossAmount,
      teacherShareUzs: split.teacherShare,
      envoCommissionUzs: split.envoCommission,
      providerFeeUzs: 0,
      provider,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    this.state.marketplacePayments.unshift(payment);

    if (!this.state.teacherWallets[teacherId]) {
      this.state.teacherWallets[teacherId] = {
        teacherId,
        availableBalanceUzs: 0,
        pendingBalanceUzs: 0,
        totalEarnedUzs: 0,
      };
    }

    const wallet = this.state.teacherWallets[teacherId];
    wallet.availableBalanceUzs += split.teacherShare;
    wallet.totalEarnedUzs += split.teacherShare;

    this.state.walletTransactions.unshift({
      id: 'tx-' + Date.now(),
      teacherId,
      paymentId: payment.id,
      type: 'lesson_credit',
      amountUzs: split.teacherShare,
      balanceAfterUzs: wallet.availableBalanceUzs,
      description: `O‘quvchi ${studentName} to‘lovi (83%): ${itemName}`,
      createdAt: new Date().toISOString(),
    });

    this.saveState();
    return { success: true, paymentId: payment.id };
  }

  public requestPayout(
    teacherId: string,
    amountUzs: number,
    cardNumberMasked: string,
    bankName: string,
    cardholderName: string
  ) {
    const wallet = this.state.teacherWallets[teacherId];
    if (!wallet || wallet.availableBalanceUzs < amountUzs) {
      return { success: false, message: 'Yetarli mablag‘ mavjud emas.' };
    }

    wallet.availableBalanceUzs -= amountUzs;
    wallet.pendingBalanceUzs += amountUzs;

    const teacher = this.state.teacherProfiles.find((t) => t.userId === teacherId);

    const req: PayoutRequest = {
      id: 'payout-' + Date.now(),
      teacherId,
      teacherName: teacher ? teacher.fullName : 'Ustoz',
      amountUzs,
      cardNumberMasked,
      bankName,
      cardholderName,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.state.payoutRequests.unshift(req);

    this.state.walletTransactions.unshift({
      id: 'tx-' + Date.now(),
      teacherId,
      type: 'payout_hold',
      amountUzs,
      balanceAfterUzs: wallet.availableBalanceUzs,
      description: `Yechib olish so‘rovi: ${bankName} (${cardNumberMasked})`,
      createdAt: new Date().toISOString(),
    });

    this.saveState();
    return { success: true, payoutId: req.id };
  }

  public submitCenterPaymentRequest(
    centerId: string,
    centerName: string,
    plan: 'Standard' | 'Premium' | 'Pro+',
    amountUsd: number,
    amountUzs: number,
    receiptNumber: string
  ) {
    const payment: CenterPayment = {
      id: 'cp-' + Date.now(),
      centerId,
      centerName,
      plan,
      amountUsd,
      amountUzs,
      status: 'pending',
      receiptNumber,
      requestedBy: 'LC Administrator',
      createdAt: new Date().toISOString(),
    };

    this.state.centerPayments.unshift(payment);
    this.saveState();
    return { success: true, paymentId: payment.id };
  }

  public submitTeacherApplication(appData: Omit<TeacherApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    const newApp: TeacherApplication = {
      ...appData,
      id: 'app-' + Date.now(),
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.teacherApplications.unshift(newApp);
    this.saveState();
    return { success: true, applicationId: newApp.id };
  }

  public reviewTeacherApplication(
    applicationId: string,
    status: 'approved' | 'rejected' | 'additional_documents_required',
    adminNotes?: string
  ) {
    const app = this.state.teacherApplications.find((a) => a.id === applicationId);
    if (!app) return { success: false, error: 'Application not found' };

    app.status = status;
    if (adminNotes) app.adminNotes = adminNotes;
    app.updatedAt = new Date().toISOString();

    if (status === 'approved') {
      const existing = this.state.teacherProfiles.find((t) => t.userId === app.userId);
      if (!existing) {
        this.state.teacherProfiles.unshift({
          id: 'tp-' + Date.now(),
          userId: app.userId,
          nickname: app.nickname,
          fullName: app.legalName,
          avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
          bio: app.bio,
          subjects: app.subjects,
          examTracks: app.examTracks,
          experienceYears: app.experienceYears,
          verified: true,
          rating: 5.0,
          reviewCount: 1,
          hourlyRateUzs: 120000,
          groupMonthlyRateUzs: 400000,
          isSponsored: false,
          region: app.region,
          gender: app.gender,
          audiencePreference: app.audiencePreference || 'all',
          age: 26,
          education: app.education,
          badges: ['Yangi Ustoz', 'Verifikatsiyalangan'],
        });
      }
    }

    this.saveState();
    return { success: true };
  }

  public reviewPayoutRequest(payoutId: string, decision: 'approved' | 'rejected') {
    const req = this.state.payoutRequests.find((r) => r.id === payoutId);
    if (!req) return { success: false, error: 'Request not found' };

    req.status = decision;
    const wallet = this.state.teacherWallets[req.teacherId];
    if (wallet) {
      wallet.pendingBalanceUzs = Math.max(0, wallet.pendingBalanceUzs - req.amountUzs);
      if (decision === 'rejected') {
        wallet.availableBalanceUzs += req.amountUzs;
      }
    }

    this.saveState();
    return { success: true };
  }
}

export const mockDb = new MockDatabase();
