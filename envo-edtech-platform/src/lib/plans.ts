/**
 * ENVO Learning Center SaaS Subscription Plans
 *
 * COMMERCIAL PRICING AGREEMENT:
 * - Standard: $80 (was $100)
 * - Premium: $112 (was $132)
 * - Pro+: $200 (was $250)
 *
 * BILLING CYCLE AUDIT NOTE:
 * Historical frontend stated 27 days, whereas live database confirm_payment()
 * extends by INTERVAL '30 days'. In accordance with prompt instructions to preserve
 * the live commercial contract without silent alteration, 30-day duration is
 * authoritative.
 */

export interface SaasPlan {
  id: 'Standard' | 'Premium' | 'Pro+';
  name: string;
  priceUsd: number;
  oldPriceUsd: number;
  durationDays: number;
  description: string;
  popular?: boolean;
  features: string[];
  limits: {
    maxStudents: number;
    maxTeachers: number;
    maxGroups: number;
    storageGb: number;
  };
}

export const SAAS_PLANS: SaasPlan[] = [
  {
    id: 'Standard',
    name: 'Standard',
    priceUsd: 80,
    oldPriceUsd: 100,
    durationDays: 30,
    description: 'Kichik va o‘rta o‘quv markazlari uchun qulay boshlang‘ich yechim.',
    features: [
      '150 tagacha o‘quvchi',
      '8 tagacha o‘qituvchi',
      'Guruhlar va dars jadvali',
      'Uyga vazifalar va baholash',
      'Davomat nazorati',
      'Ota-onalar portali',
      '5 GB xavfsiz fayl saqlash',
    ],
    limits: {
      maxStudents: 150,
      maxTeachers: 8,
      maxGroups: 20,
      storageGb: 5,
    },
  },
  {
    id: 'Premium',
    name: 'Premium',
    priceUsd: 112,
    oldPriceUsd: 132,
    durationDays: 30,
    popular: true,
    description: 'Faol o‘sayotgan o‘quv markazlari uchun to‘liq avtomatizatsiya.',
    features: [
      '500 tagacha o‘quvchi',
      '25 tagacha o‘qituvchi',
      'Cheksiz guruhlar va sinflar',
      'Avtomatlashtirilgan SMS xabarlar',
      'O‘qituvchilar KPI va oylik hisob-kitob',
      'Moliyaviy hisobotlar va eksport',
      'Shaxsiy logotip va brending',
      '20 GB xavfsiz fayl saqlash',
      'Prioritetli 24/7 texnik yordam',
    ],
    limits: {
      maxStudents: 500,
      maxTeachers: 25,
      maxGroups: 100,
      storageGb: 20,
    },
  },
  {
    id: 'Pro+',
    name: 'Pro+',
    priceUsd: 200,
    oldPriceUsd: 250,
    durationDays: 30,
    description: 'Katta ta’lim tarmoqlari va filialli markazlar uchun eksklyuziv imkoniyatlar.',
    features: [
      'Cheksiz o‘quvchilar',
      'Cheksiz o‘qituvchilar',
      'Ko‘p filialli boshqaruv',
      'Virtual sinfxona integratsiyasi',
      'Maxsus o‘quv analitikasi',
      'API va webhook integratsiyalari',
      'Shaxsiy domen ulash',
      '100 GB bulutli xotira',
      'Maxsus menejer xizmati',
    ],
    limits: {
      maxStudents: 999999,
      maxTeachers: 999999,
      maxGroups: 999999,
      storageGb: 100,
    },
  },
];
