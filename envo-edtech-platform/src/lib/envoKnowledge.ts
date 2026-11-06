export interface EnvoFeatureArticle {
  id: string;
  category: 'classroom' | 'marketplace' | 'lc_saas' | 'exams' | 'homework' | 'payments' | 'roles' | 'security';
  title: string;
  keywords: string[];
  summary: string;
  details: string[];
  supportedRoles: string[];
  actionPath?: string;
  actionLabel?: string;
}

export const ENVO_KNOWLEDGE_BASE: EnvoFeatureArticle[] = [
  {
    id: 'classroom_webrtc_pip',
    category: 'classroom',
    title: 'Virtual Sinfxona & WebRTC Jonli Video',
    keywords: ['sinf', 'dars', 'kamera', 'mikrofon', 'video', 'webrtc', 'ekran', 'stream'],
    summary: 'ENVO Virtual Sinfxonasi real WebRTC video oqimi, mikrofon, ekran ulashish va Picture-in-Picture kamera overlay imkoniyatlariga ega.',
    details: [
      'Kamera va mikrofon: O‘qituvchi va o‘quvchilar mikrofon va kamerani bir tugma bilan yoqish/o‘chirishlari mumkin.',
      'Ekran ulashish (Screen Share): Brauzerning getDisplayMedia API orqali butun ekran yoki ilova oynasini ko‘rsatish.',
      'Picture-in-Picture: Ekran ulashilgan paytda o‘qituvchi kamerasi ekran ustida miniatyura (PiP overlay) sifatida qoladi.',
      'Dars taymeri va xavfsiz ulanish: Dars vaqti millisekundlarda hisoblanadi va tarmoq uzilsa avtomatik qayta tiklanadi.',
    ],
    supportedRoles: ['teacher', 'student', 'lc_admin'],
    actionPath: 'classroom',
    actionLabel: 'Virtual Sinfxonaga Kirish',
  },
  {
    id: 'classroom_deck_whiteboard',
    category: 'classroom',
    title: 'Taqdimot Decki (PDF/PPT/DOCX) & Interaktiv Doska',
    keywords: ['doska', 'taqdimot', 'pdf', 'ppt', 'formula', 'matematika', 'whiteboard'],
    summary: 'Virtual sinfxonada taqdimot slaydlarini almashtirish va matematik formulalar palitrasiga ega ko‘p sahifali raqamli doska mavjud.',
    details: [
      'Taqdimot slaydlarini boshqarish: PDF, PPTX va rasm slaydlarini kattalashtirish (zoom), sahifalar bo‘ylab oldinga/orqaga o‘tish.',
      'Ko‘p sahifali doska: Yangi doska sahifalarini ochish, qalam, o‘chirg‘ich, chiziqlar va ranglar tanlash.',
      'Matematik formulalar palitrasi: Kvadrat ildiz (sqrt), integral, kasr (a/b), yig‘indi (sum), pi va teta belgilarini bir marta bosish bilan doskaga qo‘shish.',
      'O‘qituvchi ruxsatlari: O‘qituvchi o‘quvchilarga doskada chizish huquqini yoqishi yoki o‘chirib qo‘yishi mumkin.',
      'Darsni yozib olish (Recording): Foydalanuvchilar roziligini olgan holda MediaRecorder orqali darsni audio/video yozib olish.',
    ],
    supportedRoles: ['teacher', 'student'],
  },
  {
    id: 'teacher_audience_gender',
    category: 'marketplace',
    title: 'O‘qituvchi Jinsi & Auditoriya Talablari',
    keywords: ['gender', 'jins', 'ayollar', 'qizlar', 'ogil bolalar', 'auditoriya', 'shariat', 'odob'],
    summary: 'O‘qituvchilar o‘z profillarida jinsi va auditoriya talabini (barcha o‘quvchilar, faqat qizlar/ayollar, faqat o‘g‘il bolalar) belgilaydilar.',
    details: [
      'Auditoriya cheklovi server va mijoz darajasida qat‘iy nazorat qilinadi.',
      'Agar o‘qituvchi "Faqat qizlar/ayollar" auditoriyasini tanlasa, o‘g‘il bola o‘quvchilar guruhga yozila olmaydi va xushmuomala tushuntirish beriladi.',
      'O‘qituvchi buni Shaxsiy Kabinet -> Profil Sozlamalari bo‘limida o‘zgartirishi mumkin.',
    ],
    supportedRoles: ['teacher', 'student'],
    actionPath: 'marketplace',
    actionLabel: 'Repetitorlar Bozorini Ko‘rish',
  },
  {
    id: 'marketplace_commission_split',
    category: 'payments',
    title: 'Mustaqil Repetitorlar Bozor Komissiyasi: 83% / 17%',
    keywords: ['komissiya', '83%', '17%', 'daromad', 'hamyon', 'yechish', 'pul', 'karta', 'humo', 'uzcard'],
    summary: 'ENVO Mustaqil Repetitorlar bozorida har bir dars to‘lovining 83% o‘qituvchiga, 17% esa platforma xizmatiga yo‘naltiriladi.',
    details: [
      'Taqsimot qat‘iy formulada: teacherShare = round(gross * 83 / 100), envoCommission = gross - teacherShare.',
      'O‘qituvchi o‘z hamyonidagi mablag‘ni istalgan Uzcard/Humo kartalariga yechib olish (withdrawal) so‘rovini yuboradi.',
      'Super Admin tekshirib tasdiqlagach, to‘lov o‘tkazib beriladi.',
    ],
    supportedRoles: ['teacher', 'super_admin'],
  },
  {
    id: 'group_capacity_limit',
    category: 'marketplace',
    title: 'Mini-Guruhlar Sig‘imi (1–3 nafar o‘quvchi)',
    keywords: ['guruh', 'sigim', '1-3', 'mini guruh', 'capacity', 'limit', 'oquvchi'],
    summary: 'Mustaqil repetitorlar guruhlari qat‘iy ravishda 1 tadan 3 tagacha o‘quvchi bilan cheklangan (yuqori sifatli shaxsiy e’tibor).',
    details: [
      'Bozordagi har bir guruhga 3 nafardan ortiq o‘quvchi yozilishi bloklanadi.',
      'Guruh to‘lgach uning holati "full" ga o‘tadi.',
      'O‘quv markazlarida esa sinflar 15–20 nafargacha bo‘lishi mumkin.',
    ],
    supportedRoles: ['teacher', 'student', 'super_admin'],
  },
  {
    id: 'lc_saas_model',
    category: 'lc_saas',
    title: 'O‘quv Markazlari SaaS Tizimi & 30 Kunlik Obuna',
    keywords: ['saas', 'markaz', 'registon', 'obuna', 'standart', 'premium', 'pro+', 'tarif', 'lc admin'],
    summary: 'O‘quv markazlari oylik qat‘iy SaaS obunasi orqali boshqariladi (Standard $80, Premium $112, Pro+ $200).',
    details: [
      'LC Admin bank o‘tkazmasi yoki to‘lov chekini tizimga (request_payment) yuklaydi.',
      'Super Admin chekni ko‘rib chiqib review_manual_payment orqali tasdiqlaydi va obuna muddati 30 kunga uzaytiriladi.',
      'LC mijozlaridan hech qanday foiz yoki repetitorlik komissiyasi olinmaydi.',
    ],
    supportedRoles: ['lc_admin', 'super_admin'],
    actionPath: 'center_saas',
    actionLabel: 'Markaz SaaS Boshqaruvi',
  },
  {
    id: 'exams_and_assessments',
    category: 'exams',
    title: 'Onlayn Imtihonlar, Testlar & Avto-Baholash',
    keywords: ['imtihon', 'test', 'savol', 'ball', 'baho', 'natija', 'vaqt', 'taymer', 'exam'],
    summary: 'ENVO ko‘p tanlovli (multiple choice) va yozma savollardan iborat vaqt bilan cheklangan imtihonlarni qo‘llab-quvvatlaydi.',
    details: [
      'O‘qituvchi yangi imtihon, savollar va o‘tish balini belgilaydi.',
      'O‘quvchi ExamRunnerModal orqali teskari hisoblagich (countdown timer) ostida test yechadi.',
      'Test yakunlangach, ballar va o‘tish/yiqilish natijasi darhol ko‘rsatiladi (o‘tganlarga konfetti effekti).',
    ],
    supportedRoles: ['student', 'teacher', 'lc_admin'],
  },
  {
    id: 'homework_and_submissions',
    category: 'homework',
    title: 'Uyga Vazifalar & Audio-Diktant (Gemini 3.5 Transcribe)',
    keywords: ['vazifa', 'uyga vazifa', 'esse', 'topshiriq', 'deadline', 'transcribe', 'ovoz'],
    summary: 'Uyga vazifalarni fayl (PDF/rasm) orqali topshirish va Gemini 3.5 audio transkripsiya yordamida ovozli diktant qilish tizimi.',
    details: [
      'O‘qituvchi topshiriq muddati (deadline) va talablarini e’lon qiladi.',
      'O‘quvchi o‘z yechimini yuklaydi yoki ovozli diktofonga javob berib, uni matnga aylantiradi.',
      'O‘qituvchi baho qo‘yadi va sharh (feedback) yozadi.',
    ],
    supportedRoles: ['student', 'teacher'],
  },
  {
    id: 'parent_multi_child',
    category: 'roles',
    title: 'Ko‘p Farzandli Ota-Onani Boshqarish Portali',
    keywords: ['ota-ona', 'farzand', 'bola', 'davomat', 'baho', 'kvitansiya', 'parent'],
    summary: 'Ota-onalar bir kabinetdan bir nechta farzandlari o‘rtasida almashib, ularning davomati, baholari va to‘lovlarini kuzata oladilar.',
    details: [
      'Farzandni tanlash (masalan, Nodir Toirov va Rayhona Toirova).',
      'Farzandning oylik davomati foizi va har bir darsdagi ustoz izohlari.',
      'Test va imtihon natijalari (IELTS Mock, Nemis tili Start Deutsch).',
      'O‘quv markazi to‘lov holati va kvitansiyasi.',
    ],
    supportedRoles: ['parent', 'lc_admin'],
  },
  {
    id: 'new_subjects_arabic_german',
    category: 'marketplace',
    title: 'Yangi Fanlar: Arab Tili & Nemis Tili',
    keywords: ['arab tili', 'nemis tili', 'tajvid', 'sarf', 'nahv', 'goethe', 'testdaf', 'til'],
    summary: 'ENVO platformasiga to‘liq integratsiyalangan Arab tili va Nemis tili kurslari, malakali ustozlari va guruhlari.',
    details: [
      'Arab tili: Tajvid qoidalari, Sarf va Nahv grammatikasi, qizlar uchun maxsus ayol ustoz guruhlari.',
      'Nemis tili: Goethe-Zertifikat A1-C1, TestDaF, grammatika va so‘zlashuv intensivlari.',
      'Barcha fanlar repetitorlar filtrida va o‘quv markazlari guruhlarida mavjud.',
    ],
    supportedRoles: ['student', 'teacher', 'lc_admin'],
    actionPath: 'marketplace',
    actionLabel: 'Til Kurslarini Qidirish',
  },
  {
    id: 'security_founder_protection',
    category: 'security',
    title: 'Xavfsizlik: Founder (novax45.a@gmail.com) & RLS',
    keywords: ['xavfsizlik', 'founder', 'novax45.a@gmail.com', 'admin', 'rls', 'huquq', 'himoya'],
    summary: 'Super Admin vakolatlari faqat novax45.a@gmail.com Founder akkauntiga va server tomonidan tekshirilgan ma’lumotlarga beriladi.',
    details: [
      'Brauzerda soxta rol tanlash orqali haqiqiy ma’lumotlarga kirish taqiqlangan.',
      'O‘qituvchi arizalari Super Admin tomonidan tasdiqlanmaguncha bozorga chiqmaydi.',
      'Barcha moliyaviy amallar va komissiya hisob-kitoblari serverda tekshiriladi.',
    ],
    supportedRoles: ['super_admin'],
  },
];

export function searchEnvoKnowledge(query: string, userRole?: string): EnvoFeatureArticle[] {
  const q = query.toLowerCase().trim();
  if (!q) return ENVO_KNOWLEDGE_BASE.slice(0, 5);

  const matched = ENVO_KNOWLEDGE_BASE.filter((article) => {
    // Role filter if specified
    if (userRole && !article.supportedRoles.includes(userRole) && !article.supportedRoles.includes('all')) {
      // allow general exploration anyway if directly relevant
    }

    const inTitle = article.title.toLowerCase().includes(q);
    const inSummary = article.summary.toLowerCase().includes(q);
    const inKeywords = article.keywords.some((k) => q.includes(k) || k.includes(q));
    const inDetails = article.details.some((d) => d.toLowerCase().includes(q));

    return inTitle || inSummary || inKeywords || inDetails;
  });

  return matched.length > 0 ? matched : ENVO_KNOWLEDGE_BASE.slice(0, 4);
}
