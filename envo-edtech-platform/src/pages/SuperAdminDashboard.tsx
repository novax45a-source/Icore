import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  TrendingUp,
  X,
  Shield,
  FileCheck,
} from 'lucide-react';
import { useAuth, FOUNDER_EMAIL } from '../context/AuthContext';
import { mockDb } from '../lib/mockDatabase';
import { formatUZS, formatUSD } from '../lib/commission';
import { CenterPayment, TeacherApplication, PayoutRequest } from '../lib/types';
import { EnvoLogo } from '../components/EnvoLogo';

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const dbState = mockDb.getState();

  const [activeTab, setActiveTab] = useState<'lc_payments' | 'verification' | 'financials' | 'users'>('lc_payments');

  // Manual payment review modal state
  const [reviewPayment, setReviewPayment] = useState<CenterPayment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Teacher verification modal state
  const [selectedApp, setSelectedApp] = useState<TeacherApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Handle LC Manual Payment Review (review_manual_payment RPC)
  const handleReviewDecision = (decision: 'approved' | 'rejected') => {
    if (!reviewPayment) return;
    mockDb.reviewManualPayment(
      reviewPayment.id,
      decision === 'approved',
      user?.name || FOUNDER_EMAIL,
      rejectionReason || undefined
    );
    setReviewPayment(null);
    setRejectionReason('');
  };

  // Handle Teacher Application Review
  const handleAppReviewDecision = (decision: 'approved' | 'rejected' | 'additional_documents_required') => {
    if (!selectedApp) return;
    mockDb.reviewTeacherApplication(selectedApp.id, decision, adminNotes || undefined);
    setSelectedApp(null);
    setAdminNotes('');
  };

  // Handle Teacher Payout Request
  const handlePayoutDecision = (reqId: string, decision: 'approved' | 'rejected') => {
    mockDb.reviewPayoutRequest(reqId, decision);
  };

  // Financial calculations
  const totalMarketplaceGross = dbState.marketplacePayments.reduce((acc, p) => acc + p.grossAmountUzs, 0);
  const totalEnvoCommission = dbState.marketplacePayments.reduce((acc, p) => acc + p.envoCommissionUzs, 0);
  const totalTeacherPayouts = dbState.marketplacePayments.reduce((acc, p) => acc + p.teacherShareUzs, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Super Admin Top Header */}
      <div className="bg-gradient-to-r from-[#050B1A] via-[#0A1530] to-[#0B1220] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#1F5BFF]/30">
        <div className="flex items-start sm:items-center gap-5">
          <EnvoLogo size="lg" variant="dark" />
          <div className="border-l border-white/10 pl-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F5BFF]/20 text-[#8EC5FF] text-xs font-semibold mb-2 border border-[#1F5BFF]/30">
              <Shield className="w-3.5 h-3.5 text-[#8EC5FF]" />
              Global Boshqaruv Markazi (Super Admin)
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              ENVO Platforma Nazorati
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Founder: <strong className="text-white">{FOUNDER_EMAIL}</strong> &bull; Ikkala biznes modeli to‘liq integratsiyasi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Tizim Faol &bull; 83%/17% Split Himoyalangan
          </span>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Kutilayotgan LC To‘lovlari</span>
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {dbState.centerPayments.filter((p) => p.status === 'pending').length} ta so‘rov
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Tasdiqlash talab etiladi</p>
        </div>

        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">O‘qituvchilar Verifikatsiyasi</span>
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-[#8EC5FF]" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {dbState.teacherApplications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length} ta ariza
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Hujjatlar & Sertifikatlar</p>
        </div>

        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">ENVO Sof Komissiyasi (17%)</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatUZS(totalEnvoCommission)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Bozor aylanmasidan 17%</p>
        </div>

        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">O‘qituvchilar Ulushi (83%)</span>
            <TrendingUp className="w-4 h-4 text-[#1F5BFF] dark:text-[#8EC5FF]" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {formatUZS(totalTeacherPayouts)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">83% kafolatlangan split</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'lc_payments', label: '1. O‘quv Markazi To‘lovlari (review_manual_payment)' },
          { id: 'verification', label: '2. O‘qituvchilar Verifikatsiyasi' },
          { id: 'financials', label: '3. 17% Komissiya & Pul Yechish' },
          { id: 'users', label: '4. Foydalanuvchilar & Rollar' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition -mb-px whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: LEARNING CENTER PAYMENTS (review_manual_payment RPC) */}
      {activeTab === 'lc_payments' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              O‘quv Markazlari Obuna To‘lovlari Tekshiruvi
            </h2>
            <p className="text-xs text-slate-500">
              LC administratorlari yuborgan bank to‘lov cheklarini ko‘rib chiqish. Tasdiqlanganda
              obuna avtomatik ravishda 30 kunga uzaytiriladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Markaz Nomi</th>
                  <th className="py-3 px-4">Tarif</th>
                  <th className="py-3 px-4">Summa ($)</th>
                  <th className="py-3 px-4">Chek Raqami</th>
                  <th className="py-3 px-4">Sana</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dbState.centerPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{pay.centerName}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{pay.plan}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">{formatUSD(pay.amountUsd)}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{pay.receiptNumber}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(pay.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pay.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pay.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {pay.status === 'completed'
                          ? 'Tasdiqlangan ✓'
                          : pay.status === 'pending'
                          ? 'Kutilmoqda'
                          : 'Rad etilgan'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {pay.status === 'pending' ? (
                        <button
                          onClick={() => setReviewPayment(pay)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                        >
                          Ko‘rib chiqish &rarr;
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Ko‘rib chiqilgan</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TEACHER APPLICATIONS VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Mustaqil O‘qituvchilar Verifikatsiya Navbati
            </h2>
            <p className="text-xs text-slate-500">
              O‘qituvchi arizalari, sertifikatlar (SAT 1400+, CEFR C1/C2, A/A+ fanlar) va yosh tekshiruvi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbState.teacherApplications.map((app) => (
              <div key={app.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{app.legalName}</h3>
                    <p className="text-xs text-slate-500">
                      @{app.nickname} &bull; {app.region} &bull; {app.phone}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      app.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'submitted' || app.status === 'under_review'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>Fanlar: <strong>{app.subjects.join(', ')}</strong></p>
                  <p>Imtihonlar: <strong>{app.examTracks.join(', ') || 'Standart'}</strong></p>
                  <p>Ta’lim: <strong>{app.education}</strong></p>
                  <p>Tajriba: <strong>{app.experienceYears} yil</strong></p>
                  {app.guardianConsentDocUrl && (
                    <p className="text-amber-700 font-semibold">
                      ✓ 16–17 yosh: Vasiy roziligi hujjati ilova qilingan
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {app.certificates.length} ta sertifikat
                  </span>
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                  >
                    Hujjatlarni tekshirish &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FINANCIALS & COMMISSION */}
      {activeTab === 'financials' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Bozor Finanslari & Kartaga Pul Yechish So‘rovlari
            </h2>
            <p className="text-xs text-slate-500">
              Tasdiqlangan qoida: 83% o‘qituvchiga, 17% ENVO platformasiga.
            </p>
          </div>

          {/* Payout requests table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              O‘qituvchilar Payout So‘rovlari (Uzcard / Humo)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">O‘qituvchi</th>
                    <th className="py-2.5 px-4">Summa</th>
                    <th className="py-2.5 px-4">Karta Raqami</th>
                    <th className="py-2.5 px-4">Karta Egasi</th>
                    <th className="py-2.5 px-4">Bank</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dbState.payoutRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="py-3 px-4 font-bold text-slate-900">{req.teacherName}</td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">{formatUZS(req.amountUzs)}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{req.cardNumberMasked}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{req.cardholderName}</td>
                      <td className="py-3 px-4 text-slate-600">{req.bankName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handlePayoutDecision(req.id, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-[11px]"
                            >
                              O‘tkazildi ✓
                            </button>
                            <button
                              onClick={() => handlePayoutDecision(req.id, 'rejected')}
                              className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 text-[11px]"
                            >
                              Rad etish
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Bajarildi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Foydalanuvchilar & Rollar Boshqaruvi
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            Barcha foydalanuvchilar qat’iy ravishda <strong>center</strong>, <strong>independent</strong> yoki <strong>platform</strong> doirasida ajratilgan.
          </div>
        </div>
      )}

      {/* Modal: Review Manual Payment (review_manual_payment RPC) */}
      {reviewPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setReviewPayment(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Manual To‘lovni Ko‘rib Chiqish (review_manual_payment)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Markaz: <strong>{reviewPayment.centerName}</strong> &bull; Tarif: <strong>{reviewPayment.plan} (30 kun)</strong>
            </p>

            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-6">
              <div className="flex justify-between">
                <span>To‘lov summasi:</span>
                <span className="font-extrabold text-slate-900 text-sm">{formatUSD(reviewPayment.amountUsd)}</span>
              </div>
              <div className="flex justify-between">
                <span>Chek / Kvitansiya raqami:</span>
                <span className="font-mono font-bold text-slate-700">{reviewPayment.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>So‘rov yuboruvchi:</span>
                <span>{reviewPayment.requestedBy}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rad etish sababi (faqat rad etilganda):
              </label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Chek rekvizitlari mos kelmadi..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleReviewDecision('approved')}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Tasdiqlash (30 kunga uzaytirish)
              </button>
              <button
                onClick={() => handleReviewDecision('rejected')}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                Rad etish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Review Teacher Application */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              O‘qituvchi Hujjatlarini Tekshirish
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedApp.legalName} (@{selectedApp.nickname}) &bull; {selectedApp.region}
            </p>

            <div className="space-y-3 text-xs mb-6">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold block text-slate-900 mb-1">Fanlar & Malaka:</span>
                <p className="text-slate-600">{selectedApp.subjects.join(', ')} ({selectedApp.examTracks.join(', ')})</p>
                <p className="text-slate-500 mt-1">{selectedApp.education} &bull; {selectedApp.experienceYears} yil tajriba</p>
              </div>

              {selectedApp.certificates.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-900">{c.title}</span>
                    <p className="text-blue-700 text-[11px]">{c.issuer} &bull; Ball: {c.scoreOrGrade}</p>
                  </div>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <FileCheck className="w-4 h-4" />
                    Hujjat tekshirildi
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAppReviewDecision('approved')}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                Tasdiqlash & Bozorda e’lon qilish
              </button>
              <button
                onClick={() => handleAppReviewDecision('rejected')}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
              >
                Rad etish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
