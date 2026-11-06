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
} from 'lucide-react';
import { SAAS_PLANS } from '../lib/plans';
import { mockDb } from '../lib/mockDatabase';
import { formatUSD, formatUZS } from '../lib/commission';

export const CenterWorkspace: React.FC = () => {
  const dbState = mockDb.getState();

  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'subscription' | 'homework'>('overview');

  // Center record
  const centerId = 'center-1';
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

  // Submit Manual Payment State (request_payment RPC)
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'Standard' | 'Premium' | 'Pro+'>('Premium');
  const [receiptNumber, setReceiptNumber] = useState('REG-' + Math.floor(1000 + Math.random() * 9000));
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleRequestPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const planObj = SAAS_PLANS.find((p) => p.id === selectedPlan)!;
    const amountUsd = planObj.priceUsd;
    const amountUzs = amountUsd * 12700; // current exchange rate approx

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
      {/* Center SaaS Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-md">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{centerName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                LC SaaS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Toshkent sh., Chilonzor filiali &bull; ID: {centerId}
            </p>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full md:w-auto">
          <div>
            <span className="text-[11px] text-slate-400 block">Joriy SaaS Tarifi (30 kun):</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <span className="text-blue-600 font-extrabold">{subscription.plan}</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-emerald-600 font-semibold text-xs">Faol (30 kunlik sikl)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Muddati: {new Date(subscription.endDate).toLocaleDateString()} gacha
            </p>
          </div>

          <button
            onClick={() => setShowPayModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs whitespace-nowrap"
          >
            Obunani uzaytirish
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Jami O‘quvchilar</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">184 nafar</div>
          <p className="text-[11px] text-slate-400 mt-2">Markaz o‘quvchilari bazasi</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">O‘qituvchilar</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">12 pedagog</div>
          <p className="text-[11px] text-slate-400 mt-2">Shtatdagi murabbiylar</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Guruhlar / Sinflar</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">14 ta guruh</div>
          <p className="text-[11px] text-slate-400 mt-2">Dars jadvallari faol</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Uyga Vazifalar</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">28 ta topshiriq</div>
          <p className="text-[11px] text-slate-400 mt-2">Ota-onalar xabardor</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Umumiy Markaz Boshqaruvi' },
          { id: 'classes', label: 'Markaz Guruhlari & Sinflar' },
          { id: 'subscription', label: 'Tariflar & To‘lov So‘rovi (request_payment)' },
          { id: 'homework', label: 'Uyga Vazifalar & Ota-onalar' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition -mb-px ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview & Classes */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Markazdagi Faol Sinflar
              </h2>
              <span className="text-xs text-blue-600 font-semibold">+ Yangi sinf</span>
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
                      Ustoz: {cls.teacherName} &bull; {cls.studentCount} o‘quvchi
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
              O‘quv Markazi Obuna Tarixi
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

      {/* Tab: Subscriptions */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              SaaS Tarif Rejalari (30 Kunlik Sikl)
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Tasdiqlangan narxlar: Standard $80, Premium $112, Pro+ $200.
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

      {/* Modal: Request Payment (request_payment RPC) */}
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
              Bank o‘tkazmasi orqali to‘lov qilgach, chek raqamini yuboring.
            </p>

            {submitSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p className="font-bold text-sm">To‘lov so‘rovi Super Adminga yuborildi!</p>
                <p className="text-xs">
                  Super Admin ko‘rib chiqib tasdiqlagach, obuna avtomatik 30 kunga uzaytiriladi.
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
