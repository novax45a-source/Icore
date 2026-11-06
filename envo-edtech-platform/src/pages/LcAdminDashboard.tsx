/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Plus,
  BookOpen,
  X,
  Sparkles,
  DollarSign,
  ClipboardList,
} from 'lucide-react';
import { SAAS_PLANS } from '../lib/plans';
import { mockDb } from '../lib/mockDatabase';
import { formatUSD, formatUZS } from '../lib/commission';
import { useAuth } from '../context/AuthContext';
import { EnvoLogo } from '../components/EnvoLogo';

export const LcAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const dbState = mockDb.getState();

  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students' | 'classes' | 'subscription'>('overview');

  const centerId = user?.centerId || 'center-1';
  const centerName = 'Registon O‘quv Markazi';

  const subscription = dbState.centerSubscriptions.find((s) => s.centerId === centerId) || {
    id: 'sub-demo',
    centerId,
    centerName,
    plan: 'Premium' as const,
    status: 'active' as const,
    startDate: '2026-10-15T00:00:00Z',
    endDate: '2026-11-14T00:00:00Z',
  };

  const myPayments = dbState.centerPayments.filter((p) => p.centerId === centerId);

  // Manual payment modal state
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'Standard' | 'Premium' | 'Pro+'>('Premium');
  const [receiptNumber, setReceiptNumber] = useState('REG-LC-' + Math.floor(1000 + Math.random() * 9000));
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // New center class modal
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [className, setClassName] = useState('');
  const [classTeacher, setClassTeacher] = useState('Sherzod Qodirov');
  const [classSchedule, setClassSchedule] = useState('Dush-Chor-Juma 14:00');
  const [classStudentsCount, setClassStudentsCount] = useState(16);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    dbState.centerClasses.push({
      id: 'cls-' + Date.now(),
      centerId,
      name: className,
      teacherName: classTeacher,
      schedule: classSchedule,
      studentCount: classStudentsCount,
    });
    setShowNewClassModal(false);
    setClassName('');
  };

  const handleRequestPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const planObj = SAAS_PLANS.find((p) => p.id === selectedPlan)!;
    const amountUsd = planObj.priceUsd;
    const amountUzs = amountUsd * 12700;

    mockDb.submitCenterPaymentRequest(
      centerId,
      centerName,
      selectedPlan,
      amountUsd,
      amountUzs,
      receiptNumber
    );

    setSubmitSuccess(true);
    setTimeout(() => {
      setShowPayModal(false);
      setSubmitSuccess(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#050B1A] via-[#0A1530] to-[#0B1220] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#1F5BFF]/30">
        <div className="flex items-center gap-4">
          <EnvoLogo size="lg" variant="dark" />
          <div className="border-l border-white/10 pl-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{centerName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1F5BFF]/20 text-[#8EC5FF] border border-[#1F5BFF]/30">
                Markaz Administratori
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Boshqaruv Paneli &bull; Filial: Chilonzor &bull; Markaz ID: {centerId}
            </p>
          </div>
        </div>

        {/* Plan card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-xs w-full md:w-auto flex items-center justify-between gap-6">
          <div>
            <span className="text-slate-400 block text-[11px]">SaaS Obunasi (30 kunlik sikl):</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-extrabold text-[#8EC5FF]">{subscription.plan}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Faol
              </span>
            </div>
            <span className="text-slate-400 text-[10px]">
              Tugash sanasi: {new Date(subscription.endDate).toLocaleDateString()}
            </span>
          </div>

          <button
            onClick={() => {
              setActiveTab('subscription');
              setShowPayModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#1F5BFF] hover:bg-blue-600 text-white font-bold text-xs transition shadow-md shadow-[#1F5BFF]/30"
          >
            Uzaytirish
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Jami O‘quvchilar</span>
            <Users className="w-4 h-4 text-[#1F5BFF] dark:text-[#8EC5FF]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">184 nafar</div>
          <p className="text-[11px] text-slate-400 mt-2">Barcha sinflarda faol</p>
        </div>

        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Markaz O‘qituvchilari</span>
            <GraduationCap className="w-4 h-4 text-[#1F5BFF] dark:text-[#8EC5FF]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">12 nafar</div>
          <p className="text-[11px] text-slate-400 mt-2">Shtatdagi pedagoglar</p>
        </div>

        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Markaz Guruhlari</span>
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{dbState.centerClasses.length} ta sinf</div>
          <p className="text-[11px] text-slate-400 mt-2">15–20 kishilik darslar</p>
        </div>

        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Oylik To‘lovlar</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">96.4%</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2">To‘lov intizomi yuqori</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Umumiy Holat', icon: Sparkles },
          { id: 'classes', label: 'Markaz Guruhlari (Sinflar)', icon: Building2 },
          { id: 'teachers', label: 'O‘qituvchilar', icon: GraduationCap },
          { id: 'students', label: 'O‘quvchilar Bazasi', icon: Users },
          { id: 'subscription', label: 'SaaS Obuna & To‘lov So‘rovi (request_payment)', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap -mb-px ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Markazdagi Faol Sinflar
              </h2>
              <button
                onClick={() => setShowNewClassModal(true)}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                + Yangi sinf qo‘shish
              </button>
            </div>

            <div className="space-y-3">
              {dbState.centerClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{cls.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      O‘qituvchi: {cls.teacherName} &bull; {cls.studentCount} o‘quvchi
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                    {cls.schedule}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              SaaS Obuna To‘lovlari Tarixi
            </h2>
            <div className="space-y-3">
              {myPayments.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{p.plan} Obunasi (30 kun)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-200 text-slate-700">
                        {p.receiptNumber}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      {new Date(p.createdAt).toLocaleDateString()} &bull; So‘rovchi: {p.requestedBy}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-sm block">
                      {formatUSD(p.amountUsd)}
                    </span>
                    <span
                      className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.status === 'completed'
                        ? 'Tasdiqlangan ✓'
                        : p.status === 'pending'
                        ? 'Kutilmoqda'
                        : 'Rad etildi'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Classes */}
      {activeTab === 'classes' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Markaz Guruhlari va Sinflari
              </h2>
              <p className="text-xs text-slate-500">
                Markaz ichidagi guruhlar 15–20 nafar o‘quvchi uchun mo‘ljallangan.
              </p>
            </div>
            <button
              onClick={() => setShowNewClassModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Yangi sinf ochish
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbState.centerClasses.map((cls) => (
              <div key={cls.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{cls.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {cls.studentCount} o‘quvchi
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>O‘qituvchi: <strong>{cls.teacherName}</strong></p>
                  <p>Dars vaqtlari: <strong>{cls.schedule}</strong></p>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-semibold">Davomat: 95%</span>
                  <button className="text-blue-600 hover:underline font-bold">
                    Jurnalni ko‘rish &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Teachers */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Markaz O‘qituvchilari Ro‘yxati
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {[
              { name: 'Sherzod Qodirov', subject: 'General English', classes: 'B1-04, B2-01', phone: '+998 90 123 45 67' },
              { name: 'Kamola Karimova', subject: 'IELTS Preparation', classes: 'IELTS Foundation G-12', phone: '+998 91 987 65 43' },
              { name: 'Dilshod Normatov', subject: 'Matematika DTM', classes: 'Matem-A1', phone: '+998 93 456 78 90' },
            ].map((t, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{t.name}</h3>
                  <p className="text-slate-500">{t.subject} &bull; Guruhlar: {t.classes}</p>
                </div>
                <span className="font-mono text-slate-600">{t.phone}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Students */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Markaz O‘quvchilari & To‘lov Holati
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {[
              { name: 'Nodir Toirov', group: 'IELTS Foundation G-12', parent: 'Murod Toirov (+998 90 111 22 33)', feeStatus: 'To‘langan' },
              { name: 'Malika Sobirova', group: 'General English B1-04', parent: 'Zulayho Sobirova', feeStatus: 'To‘langan' },
              { name: 'Jasur Saidov', group: 'Matem-A1', parent: 'Akbar Saidov', feeStatus: 'Kutilmoqda' },
            ].map((s, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{s.name}</h3>
                  <p className="text-slate-500">Guruh: {s.group} &bull; Ota-onasi: {s.parent}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.feeStatus === 'To‘langan'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {s.feeStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Subscriptions & Payment Request */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              SaaS Tarif Rejalari (30 Kunlik Sikl)
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Standard $80, Premium $112, Pro+ $200. To‘lov so‘rovi yuborilgach Super Admin tasdiqlaydi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SAAS_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-3xl border flex flex-col justify-between ${
                    plan.popular
                      ? 'border-blue-600 bg-blue-50/20 shadow-md ring-2 ring-blue-600/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div>
                    {plan.popular && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white inline-block mb-2">
                        Eng Ommabop
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{plan.description}</p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {formatUSD(plan.priceUsd)}
                      </span>
                      <span className="text-sm line-through text-slate-400">
                        {formatUSD(plan.oldPriceUsd)}
                      </span>
                      <span className="text-xs text-slate-500">/ 30 kun</span>
                    </div>

                    <ul className="mt-6 space-y-2 text-xs text-slate-600">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setShowPayModal(true);
                    }}
                    className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                      subscription.plan === plan.id
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {subscription.plan === plan.id ? 'Hozirgi tarifni uzaytirish' : 'Tarifni tanlash'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Class */}
      {showNewClassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowNewClassModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Yangi Markaz Sinfiga Asos Solish
            </h3>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sinf Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="IELTS Advanced 2026-02"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Biriktirilgan Pedagog
                </label>
                <select
                  value={classTeacher}
                  onChange={(e) => setClassTeacher(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                >
                  <option value="Sherzod Qodirov">Sherzod Qodirov (General English)</option>
                  <option value="Kamola Karimova">Kamola Karimova (IELTS)</option>
                  <option value="Dilshod Normatov">Dilshod Normatov (Matematika)</option>
                  <option value="Malika Qosimova">Ustaza Malika Qosimova (Arab tili / Sarf-Nahv)</option>
                  <option value="Feruza Vohidova">Feruza Vohidova (Nemis tili / Goethe-Zertifikat)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dars Jadvali
                </label>
                <input
                  type="text"
                  required
                  value={classSchedule}
                  onChange={(e) => setClassSchedule(e.target.value)}
                  placeholder="Dush-Chor-Juma 14:00"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  O‘quvchilar soni:
                </label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={classStudentsCount}
                  onChange={(e) => setClassStudentsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow"
              >
                Sinfni saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Request Payment */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowPayModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Obuna To‘lov So‘rovi (request_payment)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Bank o‘tkazmasi orqali to‘lov amalga oshirilgach kvitansiya raqamini yuboring.
            </p>

            {submitSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p className="font-bold text-sm">To‘lov so‘rovi Super Adminga yuborildi!</p>
                <p className="text-xs">
                  Super Admin tekshirib tasdiqlagach, obuna 30 kunga uzaytiriladi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestPayment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tarifni tanlang:
                  </label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="Standard">Standard — $80 / 30 kun</option>
                    <option value="Premium">Premium — $112 / 30 kun</option>
                    <option value="Pro+">Pro+ — $200 / 30 kun</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    To‘lov Cheki / Kvitansiya Raqami *
                  </label>
                  <input
                    type="text"
                    required
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="REG-2026-PAY-1234"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>To‘lov summasi:</span>
                    <span className="font-bold text-slate-900">
                      {formatUSD(SAAS_PLANS.find((p) => p.id === selectedPlan)!.priceUsd)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>So‘mdagi ekvivalenti:</span>
                    <span className="font-bold text-slate-900">
                      ~{formatUZS(SAAS_PLANS.find((p) => p.id === selectedPlan)!.priceUsd * 12700)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow"
                >
                  To‘lov so‘rovini yuborish
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
