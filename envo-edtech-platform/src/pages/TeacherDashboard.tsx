import React, { useState } from 'react';
import {
  Users,
  Wallet,
  TrendingUp,
  Video,
  Star,
  Plus,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Calendar,
  X,
  CreditCard,
  FileCheck,
  Award,
  Settings,
  CheckCircle2,
  FileText,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { mockDb } from '../lib/mockDatabase';
import { formatUZS } from '../lib/commission';
import { validateGroupCapacityLimit } from '../lib/groupCapacity';
import { MarketplaceGroup, Exam, HomeworkAssignment, Gender, AudiencePreference } from '../lib/types';
import { AudioTranscriberWidget } from '../components/AudioTranscriberWidget';
import { EnvoLogo } from '../components/EnvoLogo';

interface TeacherDashboardProps {
  onOpenClassroom: (title: string, teacher: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onOpenClassroom }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dbState = mockDb.getState();

  const [activeTab, setActiveTab] = useState<'overview' | 'groups' | 'exams' | 'homework' | 'wallet' | 'settings'>('overview');

  // Teacher profile and wallet
  const teacherId = user?.id || 'teacher-101';
  const profile = dbState.teacherProfiles.find((t) => t.userId === teacherId) || dbState.teacherProfiles[0];
  const wallet = dbState.teacherWallets[profile.userId] || {
    teacherId: profile.userId,
    availableBalanceUzs: 1245000,
    pendingBalanceUzs: 415000,
    totalEarnedUzs: 3735000,
  };

  const myGroups = dbState.marketplaceGroups.filter((g) => g.teacherId === profile.userId);
  const myTransactions = dbState.walletTransactions.filter((tx) => tx.teacherId === profile.userId);
  const myExams = dbState.exams.filter((e) => e.createdBy === profile.userId);
  const myHomework = dbState.homeworkAssignments.filter((h) => h.assignedBy === profile.userId);

  // Settings State (Gender & Audience Preferences)
  const [genderSetting, setGenderSetting] = useState<Gender>(profile.gender || 'male');
  const [audienceSetting, setAudienceSetting] = useState<AudiencePreference>(profile.audiencePreference || 'all');
  const [bioSetting, setBioSetting] = useState(profile.bio);
  const [hourlyRateSetting, setHourlyRateSetting] = useState(profile.hourlyRateUzs);
  const [groupRateSetting, setGroupRateSetting] = useState(profile.groupMonthlyRateUzs);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // New Group Modal
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupSubject, setNewGroupSubject] = useState(profile.subjects[0] || 'Ingliz tili');
  const [newGroupSchedule, setNewGroupSchedule] = useState('Dush-Chor-Juma 18:00');
  const [newGroupCapacity, setNewGroupCapacity] = useState(3);
  const [newGroupFee, setNewGroupFee] = useState(600000);
  const [groupError, setGroupError] = useState<string | null>(null);

  // New Exam Modal
  const [showNewExamModal, setShowNewExamModal] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSubject, setNewExamSubject] = useState(profile.subjects[0] || 'Ingliz tili');
  const [newExamDuration, setNewExamDuration] = useState(45);
  const [newExamPassingScore, setNewExamPassingScore] = useState(70);

  // New Homework Modal
  const [showNewHomeworkModal, setShowNewHomeworkModal] = useState(false);
  const [newHwTitle, setNewHwTitle] = useState('');
  const [newHwDesc, setNewHwDesc] = useState('');
  const [newHwDue, setNewHwDue] = useState('2026-11-12');

  // Withdrawal Request Modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(500000);
  const [withdrawCard, setWithdrawCard] = useState('8600 4522 9102 3341');
  const [withdrawBank, setWithdrawBank] = useState('Kapitalbank');
  const [withdrawHolder, setWithdrawHolder] = useState(profile.fullName.toUpperCase());
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setGroupError(null);

    const capValidation = validateGroupCapacityLimit(newGroupCapacity);
    if (!capValidation.valid) {
      setGroupError(capValidation.error || 'Noto‘g‘ri sig‘im.');
      return;
    }

    const newGroup: MarketplaceGroup = {
      id: 'grp-' + Date.now(),
      teacherId: profile.userId,
      teacherName: profile.fullName,
      courseTitle: newGroupTitle,
      subject: newGroupSubject,
      schedule: newGroupSchedule,
      maxCapacity: newGroupCapacity,
      currentEnrolled: 0,
      monthlyFeeUzs: newGroupFee,
      status: 'open',
    };

    dbState.marketplaceGroups.unshift(newGroup);
    setShowNewGroupModal(false);
    setNewGroupTitle('');
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);

    if (withdrawAmount > wallet.availableBalanceUzs) {
      setWithdrawError('Mavjud balansdan ko‘p mablag‘ yechib bo‘lmaydi.');
      return;
    }

    if (withdrawAmount < 100000) {
      setWithdrawError('Minimal yechish summasi: 100 000 so‘m.');
      return;
    }

    const res = mockDb.requestPayout(
      profile.userId,
      withdrawAmount,
      withdrawCard,
      withdrawBank,
      withdrawHolder
    );

    if (res.success) {
      setWithdrawSuccess(true);
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawSuccess(false);
      }, 1500);
    } else {
      setWithdrawError(res.message || 'Xatolik yuz berdi.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile Header */}
      <div className="bg-white dark:bg-[#0B1220] rounded-3xl border border-slate-200 dark:border-[#1F5BFF]/30 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-[#1F5BFF]/40 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{profile.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1F5BFF]/15 text-[#1F5BFF] dark:text-[#8EC5FF] border border-[#1F5BFF]/30">
                Mustaqil O‘qituvchi
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                83% Sof Ulush
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              @{profile.nickname} &bull; {profile.education}
            </p>
          </div>
        </div>

        {/* Right side: Envo Logo badge & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="hidden lg:block border-r border-slate-200 dark:border-white/10 pr-4">
            <EnvoLogo size="sm" showTagline={false} />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onOpenClassroom('IELTS Intensive Target 7.5+', profile.fullName)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Video className="w-4 h-4" />
              Sinfxonani ochish
            </button>

            <button
              onClick={() => setShowNewGroupModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1F5BFF] hover:bg-blue-600 text-white text-xs font-bold transition shadow-md shadow-[#1F5BFF]/25"
            >
              <Plus className="w-4 h-4" />
              Yangi guruh (1–3 kishi)
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Mavjud Balans (83%)</span>
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {formatUZS(wallet.availableBalanceUzs)}
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="text-[11px] text-[#1F5BFF] dark:text-[#8EC5FF] hover:underline font-bold mt-2 flex items-center gap-1"
          >
            Yechib olish so‘rovi &rarr;
          </button>
        </div>

        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Kutilayotgan To‘lovlar</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {formatUZS(wallet.pendingBalanceUzs)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Dars yakunlanishi bilan tushadi</p>
        </div>

        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Faol Guruhlar (1–3)</span>
            <Users className="w-4 h-4 text-[#1F5BFF] dark:text-[#8EC5FF]" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {myGroups.length} ta guruh
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Kichik guruh formati</p>
        </div>

        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/20 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Jami Ishlangan Daromad</span>
            <Star className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatUZS(wallet.totalEarnedUzs)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">83% o‘qituvchi ulushi</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Umumiy ko‘rinish', icon: Sparkles },
          { id: 'groups', label: 'Mening Guruhlarim (1–3 kishi)', icon: Users },
          { id: 'exams', label: 'Imtihonlar & Testlar', icon: Award },
          { id: 'homework', label: 'Vazifalar & Baholash', icon: BookOpen },
          { id: 'wallet', label: 'Hamyon & Tranzaksiyalar', icon: Wallet },
          { id: 'settings', label: 'Profil & Jins / Auditoriya', icon: Settings },
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
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Upcoming Lessons */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Bugungi Jonli Darslar Jadvali
              </h2>
              <span className="text-xs text-blue-600 font-semibold">WebRTC HD Sinfxona</span>
            </div>

            <div className="space-y-3">
              {myGroups.map((grp) => (
                <div
                  key={grp.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{grp.courseTitle}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {grp.schedule}
                      </span>
                      <span>&bull;</span>
                      <span className="font-semibold text-slate-700">
                        {grp.currentEnrolled}/{grp.maxCapacity} o‘quvchi
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenClassroom(grp.courseTitle, profile.fullName)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Sinfxonaga kirish
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Wallet Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 text-white shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              O‘qituvchi Hamyoni
            </h3>

            <div>
              <span className="text-xs text-slate-400 block">Yechishga tayyor balans:</span>
              <span className="text-2xl font-extrabold text-white">
                {formatUZS(wallet.availableBalanceUzs)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Kutilayotgan mablag‘:</span>
                <span className="text-amber-400 font-semibold">{formatUZS(wallet.pendingBalanceUzs)}</span>
              </div>
              <div className="flex justify-between">
                <span>Komissiya qoidasi:</span>
                <span className="text-emerald-400 font-semibold">83% o‘qituvchiga</span>
              </div>
            </div>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow"
            >
              Kartaga pul yechish (Uzcard / Humo)
            </button>
          </div>
        </div>
      )}

      {/* Tab: Groups */}
      {activeTab === 'groups' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Mening Mini-Guruhlarim (1–3 nafar o‘quvchi)
              </h2>
              <p className="text-xs text-slate-500">
                Har bir guruhda 1 dan 3 tagacha o‘quvchi o‘qishi tizim darajasida kafolatlangan.
              </p>
            </div>
            <button
              onClick={() => setShowNewGroupModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
            >
              + Yangi guruh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGroups.map((grp) => (
              <div key={grp.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{grp.courseTitle}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      grp.currentEnrolled >= grp.maxCapacity
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {grp.currentEnrolled}/{grp.maxCapacity} o‘quvchi
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>Fan: <strong>{grp.subject}</strong></p>
                  <p>Jadval: <strong>{grp.schedule}</strong></p>
                  <p>Oylik to‘lov: <strong className="text-blue-700">{formatUZS(grp.monthlyFeeUzs)}</strong></p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Sizga tushadigan ulush: {formatUZS(Math.round(grp.monthlyFeeUzs * 0.83))} / o‘quvchi
                  </span>
                  <button
                    onClick={() => onOpenClassroom(grp.courseTitle, profile.fullName)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                  >
                    Darsni boshlash
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Wallet & Ledger */}
      {activeTab === 'wallet' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                O‘qituvchi Hamyoni & O‘zgarmas Moliyaviy Daftari (Ledger)
              </h2>
              <p className="text-xs text-slate-500">
                Har bir dars uchun aniq 83% kredit yozuvi va yechib olishlar tarixi.
              </p>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
            >
              Yechib olish
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Sana</th>
                  <th className="py-3 px-4">Tavsif</th>
                  <th className="py-3 px-4">Turi</th>
                  <th className="py-3 px-4">Summa (83%)</th>
                  <th className="py-3 px-4">Yangi Balans</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{tx.description}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Kredit (83%)
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600">
                      +{formatUZS(tx.amountUzs)}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {formatUZS(tx.balanceAfterUzs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Exams & Assessments */}
      {activeTab === 'exams' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Imtihonlar & Sinov Testlari ({myExams.length})
              </h2>
              <p className="text-xs text-slate-500">
                Multiple-choice va yozma savollardan iborat vaqt chegaralangan rasmiy testlar.
              </p>
            </div>
            <button
              onClick={() => setShowNewExamModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Yangi Imtihon Tuzish
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myExams.map((exam) => (
              <div key={exam.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{exam.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {exam.durationMinutes} daqiqa
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>Fan: <strong>{exam.subject}</strong></p>
                  <p>Savollar soni: <strong>{exam.questions.length} ta</strong> &bull; Jami ball: <strong>{exam.totalPoints}</strong></p>
                  <p>O‘tish bali: <strong className="text-emerald-700">{exam.passingPoints}%</strong></p>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    Holat: <strong className="text-emerald-600">Faol</strong>
                  </span>
                  <button
                    onClick={() => alert(`"${exam.title}" tahrirlash oynasi ochildi.`)}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Savollarni ko‘rish &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Student Submissions */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              O‘quvchilar Topshirgan Imtihon Natijalari
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {dbState.examSubmissions.map((sub) => (
                <div key={sub.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{sub.studentName}</h4>
                    <p className="text-slate-500">{sub.examTitle} &bull; {new Date(sub.submittedAt).toLocaleDateString()}</p>
                    <p className="text-emerald-700 font-medium text-[11px] mt-0.5">{sub.teacherFeedback}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-blue-700 block">
                      {sub.percentage}% ({sub.score} ball)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Tekshirilgan ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Homework */}
      {activeTab === 'homework' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Uyga Vazifalar & Tekshirish
              </h2>
              <p className="text-xs text-slate-500">
                Guruhlar uchun vazifalar topshirish, PDF fayllarni tekshirish va baholash.
              </p>
            </div>
            <button
              onClick={() => setShowNewHomeworkModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Yangi Vazifa Berish
            </button>
          </div>

          {/* Active Homework Assignments */}
          <div className="space-y-3">
            {myHomework.map((hw) => (
              <div key={hw.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-xs text-slate-900">{hw.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{hw.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>Guruh: <strong>{hw.className}</strong></span>
                    <span>&bull;</span>
                    <span>Muddati: <strong>{new Date(hw.dueDate).toLocaleDateString()}</strong></span>
                    {hw.attachmentName && (
                      <>
                        <span>&bull;</span>
                        <span className="font-mono text-blue-600">{hw.attachmentName}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 shrink-0 ml-3">
                  100 ballik
                </span>
              </div>
            ))}
          </div>

          {/* Student Submissions to Review */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              O‘quvchilar Topshirgan Vazifalar (Tekshiruv navbati)
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {dbState.homeworkSubmissions.map((sub) => (
                <div key={sub.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900">{sub.studentName}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">{sub.assignmentTitle}</p>
                    <p className="text-slate-700 mt-1 bg-white p-2 rounded-xl border border-slate-200 text-xs">
                      "{sub.content}"
                    </p>
                    {sub.fileName && (
                      <span className="inline-block mt-1 font-mono text-[11px] text-blue-600">
                        Topshirilgan fayl: {sub.fileName} ({sub.fileSize})
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-emerald-700 text-sm block">
                      {sub.score} / {sub.maxScore} ball
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Baholandi ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audio transcription for teacher voice notes / essay reviews */}
          <AudioTranscriberWidget title="O‘qituvchi Ovozli Fikr-Mulohazasini Matnga O‘girish (gemini-3.5-transcribe)" />
        </div>
      )}

      {/* Tab: Settings (Teacher Gender & Audience Preferences) */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Profil, Jins va Guruh Auditoriyasi Sozlamalari
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Platforma sizning tanlovingizga ko‘ra faqat siz belgilagan o‘quvchilar guruhiga ruxsat beradi.
            </p>
          </div>

          {settingsSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Sozlamalar muvaffaqiyatli saqlandi va barcha guruhlarga tatbiq etildi!
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              mockDb.updateTeacherSettings(profile.userId, {
                gender: genderSetting,
                audiencePreference: audienceSetting,
                bio: bioSetting,
                hourlyRateUzs: hourlyRateSetting,
                groupMonthlyRateUzs: groupRateSetting,
              });
              setSettingsSuccess(true);
              setTimeout(() => setSettingsSuccess(false), 2500);
            }}
            className="space-y-5 text-xs"
          >
            {/* Gender Field */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                O‘qituvchi Jinsi:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGenderSetting('female')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    genderSetting === 'female'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>🌸 Ayol (Female)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGenderSetting('male')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    genderSetting === 'male'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>⚡ Erkak (Male)</span>
                </button>
              </div>
            </div>

            {/* Audience Preference */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Guruhlar va Yakka Darslar Auditoriyasi (Audience Preference):
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'all',
                    title: 'Barcha o‘quvchilar (All students)',
                    desc: 'O‘g‘il va qiz bolalar teng ravishda darslarga a’zo bo‘lishi mumkin.',
                  },
                  {
                    id: 'female_only',
                    title: 'Faqat xotin-qizlar va qiz bolalar uchun (Female only)',
                    desc: 'Darslarga faqat ayol / qiz o‘quvchilar qabul qilinadi. Erkak foydalanuvchilar a’zo bo‘la olmaydi.',
                  },
                  {
                    id: 'male_only',
                    title: 'Faqat o‘g‘il bolalar va erkaklar uchun (Male only)',
                    desc: 'Darslarga faqat o‘g‘il bolalar qabul qilinadi.',
                  },
                ].map((aud) => (
                  <label
                    key={aud.id}
                    onClick={() => setAudienceSetting(aud.id as any)}
                    className={`block p-3.5 rounded-2xl border cursor-pointer transition ${
                      audienceSetting === aud.id
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="audience"
                        checked={audienceSetting === aud.id}
                        onChange={() => setAudienceSetting(aud.id as any)}
                        className="text-blue-600 focus:ring-0"
                      />
                      <span className="font-bold text-slate-900">{aud.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-5">{aud.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Profil Tavsifi (Bio)
              </label>
              <textarea
                rows={3}
                value={bioSetting}
                onChange={(e) => setBioSetting(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-300 text-slate-900 font-medium"
              />
            </div>

            {/* Rates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Yakka dars narxi (so‘m/soat):
                </label>
                <input
                  type="number"
                  step="10000"
                  value={hourlyRateSetting}
                  onChange={(e) => setHourlyRateSetting(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mini-guruh narxi (so‘m/oy):
                </label>
                <input
                  type="number"
                  step="10000"
                  value={groupRateSetting}
                  onChange={(e) => setGroupRateSetting(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1F5BFF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-[#1F5BFF]/30 transition"
            >
              Sozlamalarni Saqlash
            </button>
          </form>

          {/* Theme & Visual Appearance */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#1F5BFF]/30">
            <label className="block font-bold text-slate-800 dark:text-slate-100 mb-1">
              Platforma Mavzusi (Theme):
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              ENVO Design 2: To‘q rangli (Premium Dark #050B1A) yoki Yorug‘ rangli rejimni tanlang.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => theme === 'light' && toggleTheme()}
                className={`p-3.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                  theme === 'dark'
                    ? 'border-[#1F5BFF] bg-[#1F5BFF]/20 text-white shadow-xs ring-2 ring-[#1F5BFF]/40'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-[#8EC5FF]" />
                  To‘q Rejim (Dark)
                </span>
                {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-[#8EC5FF]" />}
              </button>

              <button
                type="button"
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`p-3.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                  theme === 'light'
                    ? 'border-[#1F5BFF] bg-blue-50 text-blue-900 shadow-xs ring-2 ring-[#1F5BFF]/20'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Yorug‘ Rejim (Light)
                </span>
                {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Group (Enforcing 1-3 capacity) */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowNewGroupModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Yangi Mini-Guruh Ochish
            </h3>

            {groupError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
                {groupError}
              </div>
            )}

            <form onSubmit={handleCreateGroup} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kurs / Guruh Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  placeholder="IELTS Intensive Speaking & Writing"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fan
                </label>
                <select
                  value={newGroupSubject}
                  onChange={(e) => setNewGroupSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                >
                  {profile.subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dars Jadvali
                </label>
                <input
                  type="text"
                  required
                  value={newGroupSchedule}
                  onChange={(e) => setNewGroupSchedule(e.target.value)}
                  placeholder="Dush-Chor-Juma 18:00"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Maksimal Sig‘im (Qat’iy ravishda 1–3 o‘quvchi) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={newGroupCapacity}
                  onChange={(e) => setNewGroupCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  ENVO standarti: Mini-guruhlarda individual e’tibor uchun maksimal 3 ta o‘rin.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Oylik to‘lov (so‘mda):
                </label>
                <input
                  type="number"
                  step="10000"
                  value={newGroupFee}
                  onChange={(e) => setNewGroupFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow"
              >
                Guruhni yaratish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Withdraw Request */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              Mablag‘ni Kartaga Yechib Olish
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Mavjud balans: <strong>{formatUZS(wallet.availableBalanceUzs)}</strong>
            </p>

            {withdrawSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-center space-y-2">
                <FileCheck className="w-8 h-8 mx-auto" />
                <p className="font-bold text-sm">So‘rov muvaffaqiyatli yuborildi!</p>
                <p className="text-xs">Super Admin tasdiqlagach mablag‘ kartangizga tushadi.</p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
                {withdrawError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 font-medium">
                    {withdrawError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Yechish summasi (so‘m) *
                  </label>
                  <input
                    type="number"
                    min="100000"
                    step="50000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Karta raqami (Uzcard / Humo) *
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawCard}
                    onChange={(e) => setWithdrawCard(e.target.value)}
                    placeholder="8600 **** **** ****"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Bank nomi
                    </label>
                    <input
                      type="text"
                      value={withdrawBank}
                      onChange={(e) => setWithdrawBank(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Karta egasi ismi
                    </label>
                    <input
                      type="text"
                      value={withdrawHolder}
                      onChange={(e) => setWithdrawHolder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow"
                >
                  Yechish so‘rovini tasdiqlash
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: New Exam */}
      {showNewExamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowNewExamModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Yangi Imtihon Tuzish
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newExam: Exam = {
                  id: 'ex-' + Date.now(),
                  title: newExamTitle,
                  subject: newExamSubject,
                  courseTitle: myGroups[0]?.courseTitle || 'Kurs',
                  createdBy: profile.userId,
                  createdByName: profile.fullName,
                  durationMinutes: newExamDuration,
                  passingPoints: newExamPassingScore,
                  totalPoints: 100,
                  scheduleStart: new Date().toISOString(),
                  scheduleEnd: new Date(Date.now() + 86400000 * 14).toISOString(),
                  isPublished: true,
                  createdAt: new Date().toISOString(),
                  questions: [
                    {
                      id: 'q-' + Date.now() + '-1',
                      text: 'Ushbu fanning asosiy qoidasi bo‘yicha to‘g‘ri javobni belgilang:',
                      type: 'multiple_choice',
                      options: ['A varianti (To‘g‘ri)', 'B varianti', 'C varianti', 'D varianti'],
                      correctOptionIndex: 0,
                      points: 50,
                      explanation: 'Asosiy nazariy qoida asosida yechiladi.',
                    },
                    {
                      id: 'q-' + Date.now() + '-2',
                      text: 'Mavzu yuzasidan 3 ta asosiy xulosa va amaliy misol yozing:',
                      type: 'written',
                      points: 50,
                    },
                  ],
                };
                dbState.exams.unshift(newExam);
                setShowNewExamModal(false);
                setNewExamTitle('');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Imtihon Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={newExamTitle}
                  onChange={(e) => setNewExamTitle(e.target.value)}
                  placeholder="SAT Math / Arab Tili Oraliq Nazorat"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fan
                </label>
                <select
                  value={newExamSubject}
                  onChange={(e) => setNewExamSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                >
                  {profile.subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="Arab tili">Arab tili</option>
                  <option value="Nemis tili">Nemis tili</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Vaqti (daqiqa):
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={newExamDuration}
                    onChange={(e) => setNewExamDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    O‘tish bali (%):
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="90"
                    value={newExamPassingScore}
                    onChange={(e) => setNewExamPassingScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow"
              >
                Imtihonni Nashr Qilish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Homework */}
      {showNewHomeworkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowNewHomeworkModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Yangi Uyga Vazifa Berish
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newAssignment: HomeworkAssignment = {
                  id: 'hw-' + Date.now(),
                  title: newHwTitle,
                  description: newHwDesc,
                  subject: profile.subjects[0] || 'Ingliz tili',
                  className: myGroups[0]?.courseTitle || 'Mini-Guruh',
                  assignedBy: profile.userId,
                  assignedByName: profile.fullName,
                  dueDate: newHwDue + 'T23:59:59Z',
                  attachmentName: 'Topshiriq_Materiali.pdf',
                  attachmentSize: '1.5 MB',
                  maxScore: 100,
                  createdAt: new Date().toISOString(),
                };
                dbState.homeworkAssignments.unshift(newAssignment);
                setShowNewHomeworkModal(false);
                setNewHwTitle('');
                setNewHwDesc('');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Vazifa Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={newHwTitle}
                  onChange={(e) => setNewHwTitle(e.target.value)}
                  placeholder="Grammatika: Conditionals test mashqlari"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tavsif & Ko‘rsatmalar *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newHwDesc}
                  onChange={(e) => setNewHwDesc(e.target.value)}
                  placeholder="O‘quvchilar nimalarga e’tibor berishi va qanday formatda topshirishi kerak..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Topshirish Muddati (Deadline) *
                </label>
                <input
                  type="date"
                  required
                  value={newHwDue}
                  onChange={(e) => setNewHwDue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow"
              >
                Vazifani Joylashtirish
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
