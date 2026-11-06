import React, { useState } from 'react';
import {
  Search,
  Star,
  ShieldCheck,
  Users,
  Calendar,
  Clock,
  Sparkles,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../lib/mockDatabase';
import { TeacherProfile, MarketplaceGroup, IndividualLessonSlot } from '../lib/types';
import { formatUZS, calculateMarketplaceSplit } from '../lib/commission';
import { SearchGroundingWidget } from '../components/SearchGroundingWidget';
import { EnvoLogo } from '../components/EnvoLogo';
import confetti from 'canvas-confetti';

interface MarketplacePageProps {
  onOpenClassroom: (title: string, teacher: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onOpenClassroom }) => {
  const { user } = useAuth();
  const dbState = mockDb.getState();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTeacherGender, setSelectedTeacherGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedAudiencePref, setSelectedAudiencePref] = useState<'all' | 'female_only' | 'male_only'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [audienceAlert, setAudienceAlert] = useState<string | null>(null);

  // Selected Profile for details modal
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);

  // Checkout Modal State
  const [checkoutTarget, setCheckoutTarget] = useState<{
    type: 'group' | 'slot';
    group?: MarketplaceGroup;
    slot?: IndividualLessonSlot;
    priceUzs: number;
    title: string;
    teacherId: string;
    teacherName: string;
    audiencePreference?: 'all' | 'male_only' | 'female_only';
  } | null>(null);

  const [paymentProvider, setPaymentProvider] = useState<'uzcard' | 'humo' | 'visa' | 'mastercard'>('uzcard');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // User's gender (default to male for demo student, can be toggled)
  const currentStudentGender = user?.gender || 'male';

  // Filter teachers
  const filteredTeachers = dbState.teacherProfiles.filter((t) => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.examTracks.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject = selectedSubject === 'all' || t.subjects.includes(selectedSubject);
    const matchesExam = selectedExam === 'all' || t.examTracks.includes(selectedExam);
    const matchesRegion = selectedRegion === 'all' || t.region === selectedRegion;
    const matchesVerified = !verifiedOnly || t.verified;
    const matchesGender = selectedTeacherGender === 'all' || t.gender === selectedTeacherGender;
    const matchesAudience = selectedAudiencePref === 'all' || t.audiencePreference === selectedAudiencePref;

    return matchesSearch && matchesSubject && matchesExam && matchesRegion && matchesVerified && matchesGender && matchesAudience;
  });

  const handleEnrollClick = (group: MarketplaceGroup) => {
    const teacher = dbState.teacherProfiles.find((t) => t.userId === group.teacherId);
    const audiencePref = group.audiencePreference || teacher?.audiencePreference || 'all';

    // Verify student-teacher audience eligibility
    const check = mockDb.checkAudienceEligibility(audiencePref, currentStudentGender);
    if (!check.allowed) {
      setAudienceAlert(check.reason || 'Auditoriya talabiga mos kelmaysiz.');
      return;
    }

    setCheckoutTarget({
      type: 'group',
      group,
      priceUzs: group.monthlyFeeUzs,
      title: `${group.courseTitle} (1–3 kishilik guruh)`,
      teacherId: group.teacherId,
      teacherName: group.teacherName,
      audiencePreference: audiencePref,
    });
    setPaymentDone(false);
  };

  const handleBookSlotClick = (slot: IndividualLessonSlot) => {
    const teacher = dbState.teacherProfiles.find((t) => t.userId === slot.teacherId);
    const audiencePref = teacher?.audiencePreference || 'all';

    const check = mockDb.checkAudienceEligibility(audiencePref, currentStudentGender);
    if (!check.allowed) {
      setAudienceAlert(check.reason || 'Auditoriya talabiga mos kelmaysiz.');
      return;
    }

    setCheckoutTarget({
      type: 'slot',
      slot,
      priceUzs: slot.priceUzs,
      title: `${slot.subject} (Yakka 1-on-1 dars)`,
      teacherId: slot.teacherId,
      teacherName: slot.teacherName,
      audiencePreference: audiencePref,
    });
    setPaymentDone(false);
  };

  const executePayment = () => {
    if (!checkoutTarget) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      // Execute 83% / 17% split in database
      mockDb.processPayment(
        user?.id || 'student-demo',
        user?.name || 'Mustaqil O‘quvchi',
        checkoutTarget.teacherId,
        checkoutTarget.type === 'group' ? 'group_enrollment' : 'individual_lesson',
        checkoutTarget.title,
        checkoutTarget.priceUzs,
        paymentProvider
      );

      // If group enrollment, increment count transactionally
      if (checkoutTarget.type === 'group' && checkoutTarget.group) {
        mockDb.enrollInGroup(checkoutTarget.group.id, user?.id || 'student-demo');
      }

      setIsProcessingPayment(false);
      setPaymentDone(true);

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // Ignore in test
      }
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search & Hero Header */}
      <div className="bg-gradient-to-r from-[#050B1A] via-[#0A1530] to-[#0B1220] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-[#1F5BFF]/30">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#1F5BFF]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <EnvoLogo size="md" variant="dark" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F5BFF]/15 text-[#8EC5FF] text-xs font-semibold border border-[#1F5BFF]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#8EC5FF]" />
              1–3 Kishilik Mini-Guruhlar va 83% Sof Split
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            O‘zbekistonning Eng Saralangan Repetitorlari
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            IELTS 8.0+, SAT 1500+ va fanlar bo‘yicha A+ darajali sertifikatlangan o‘qituvchilar bilan
            kichik guruhlarda sifatli ta’lim oling.
          </p>

          {/* Search Input */}
          <div className="relative flex items-center max-w-2xl bg-white dark:bg-[#050B1A] rounded-2xl shadow-2xl p-1.5 border border-slate-200 dark:border-[#1F5BFF]/40">
            <Search className="w-5 h-5 text-slate-400 dark:text-[#8EC5FF] ml-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="O‘qituvchi ismi, fani (SAT, IELTS, Matematika, Nemis tili, Arab tili...)"
              className="w-full px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white mr-2">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Audience Mismatch Alert Banner/Modal */}
      {audienceAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Auditoriya Mosligi Cheklovi
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {audienceAlert}
              </p>
            </div>
            <button
              onClick={() => setAudienceAlert(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Tushundim
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-[#1F5BFF]/30 p-4 shadow-xs flex flex-wrap items-center gap-3 transition-colors">
        {/* Subject Filter with Arabic & German */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-[#1F5BFF]/30 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-[#050B1A] focus:outline-none"
        >
          <option value="all">Barcha fanlar</option>
          <option value="Arab tili">Arab tili (Tajvid, Nahv)</option>
          <option value="Nemis tili">Nemis tili (Goethe, TestDaF)</option>
          <option value="Ingliz tili">Ingliz tili (IELTS, CEFR)</option>
          <option value="Matematika">Matematika (DTM, SAT)</option>
          <option value="Ona tili">Ona tili va Adabiyot</option>
          <option value="Fizika">Fizika</option>
          <option value="SAT Verbal">SAT Verbal</option>
          <option value="SAT Math">SAT Math</option>
        </select>

        {/* Teacher Gender Filter */}
        <select
          value={selectedTeacherGender}
          onChange={(e) => setSelectedTeacherGender(e.target.value as any)}
          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-[#1F5BFF]/30 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-[#050B1A] focus:outline-none"
        >
          <option value="all">Ustoz jinsi: Barchasi</option>
          <option value="female">Ayol ustozlar (Female)</option>
          <option value="male">Erkak ustozlar (Male)</option>
        </select>

        {/* Teacher Audience Preference Filter */}
        <select
          value={selectedAudiencePref}
          onChange={(e) => setSelectedAudiencePref(e.target.value as any)}
          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-[#1F5BFF]/30 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-[#050B1A] focus:outline-none"
        >
          <option value="all">Guruh auditoriyasi: Barchasi</option>
          <option value="female_only">Faqat ayollar / qizlar uchun</option>
          <option value="male_only">Faqat o‘g‘il bolalar uchun</option>
        </select>

        {/* Exam Track */}
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
        >
          <option value="all">Barcha imtihonlar</option>
          <option value="IELTS">IELTS</option>
          <option value="SAT">SAT</option>
          <option value="CEFR C1 Arab tili">CEFR Arab tili</option>
          <option value="Goethe B1-B2">Goethe Nemis tili</option>
          <option value="CEFR C2">CEFR C2</option>
          <option value="Milliy Sertifikat A+">Milliy Sertifikat A+</option>
        </select>

        {/* Region */}
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
        >
          <option value="all">Barcha hududlar</option>
          <option value="Toshkent">Toshkent</option>
          <option value="Samarqand">Samarqand</option>
          <option value="Farg‘ona">Farg‘ona</option>
        </select>

        {/* Verified checkbox */}
        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
          />
          Faqat tasdiqlanganlar (Verified)
        </label>
      </div>

      {/* Google Search Grounding with gemini-3.8-flash for live exam & curriculum intelligence */}
      <SearchGroundingWidget />

      {/* Teachers Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Topilgan O‘qituvchilar ({filteredTeachers.length})
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Har bir guruhda qat’iy 1–3 nafar o‘quvchi chegarasi &bull; Gender & Auditoriya filtrlari faol
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white dark:bg-[#0B1220] rounded-3xl border border-slate-200/90 dark:border-[#1F5BFF]/30 shadow-sm hover:shadow-xl hover:border-[#1F5BFF] transition overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-6">
                {/* Header with Avatar, Badges & Verification */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={teacher.avatarUrl}
                      alt={teacher.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-[#1F5BFF]/40 shadow-sm"
                    />
                    {teacher.verified && (
                      <span className="absolute -bottom-1 -right-1 p-1 bg-[#1F5BFF] text-white rounded-full shadow" title="Tasdiqlangan o‘qituvchi">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                        {teacher.fullName}
                      </h3>
                      {teacher.isSponsored && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          PROMO
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{teacher.nickname}</p>
                      <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {teacher.gender === 'female' ? 'Ayol ustoz' : 'Erkak ustoz'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {teacher.rating.toFixed(2)}
                      </span>
                      <span className="text-slate-400">({teacher.reviewCount} sharh)</span>
                      <span className="text-slate-400">&bull;</span>
                      <span>{teacher.experienceYears} yil tajriba</span>
                    </div>
                  </div>
                </div>

                {/* Audience Preference Badge */}
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      teacher.audiencePreference === 'female_only'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : teacher.audiencePreference === 'male_only'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {teacher.audiencePreference === 'female_only'
                      ? '🌸 Faqat qizlar / ayollar uchun'
                      : teacher.audiencePreference === 'male_only'
                      ? '⚡ Faqat o‘g‘il bolalar uchun'
                      : '👥 Barcha o‘quvchilar uchun'}
                  </span>
                </div>

                {/* Badges / Exam Tracks */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {teacher.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {b}
                    </span>
                  ))}
                  {teacher.examTracks.map((ex, i) => (
                    <span
                      key={'ex-' + i}
                      className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {ex}
                    </span>
                  ))}
                </div>

                {/* Short Bio */}
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {teacher.bio}
                </p>

                {/* Rates */}
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Yakka dars:</span>
                    <span className="font-bold text-slate-900">
                      {formatUZS(teacher.hourlyRateUzs)}
                    </span>
                    <span className="text-slate-400 text-[10px]"> / soat</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Mini-guruh (1–3 kishi):</span>
                    <span className="font-bold text-blue-700">
                      {formatUZS(teacher.groupMonthlyRateUzs)}
                    </span>
                    <span className="text-slate-400 text-[10px]"> / oy</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Profilni ko‘rish
                </button>
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="py-2 px-3.5 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
                >
                  Darsga yozilish
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Groups Section (Highlighting strict 1-3 capacity rule) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Faol Mini-Guruhlar (1–3 Kishi Qat’iy Invariant)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Har bir guruhda maksimal 3 nafar o‘quvchi o‘rganadi. Race-condition himoyasi bilan.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            Jonli qabul
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dbState.marketplaceGroups.map((group) => {
            const slotsLeft = Math.max(0, group.maxCapacity - group.currentEnrolled);
            const isFull = slotsLeft === 0;

            return (
              <div
                key={group.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 transition bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{group.courseTitle}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Ustoz: <strong className="text-slate-700">{group.teacherName}</strong>
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        isFull
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isFull ? 'Guruh to‘lgan' : `${slotsLeft} ta bo‘sh joy`}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {group.schedule}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      Sig‘im: {group.currentEnrolled}/{group.maxCapacity} o‘quvchi
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Oylik to‘lov:</span>
                    <span className="text-sm font-extrabold text-blue-700">
                      {formatUZS(group.monthlyFeeUzs)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleEnrollClick(group)}
                    disabled={isFull}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition"
                  >
                    {isFull ? 'Qabul yopilgan' : 'A’zo bo‘lish'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available 1-on-1 Lesson Slots */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Yakka (1-on-1) Dars Uchun Bo‘sh Vaqtlar
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          O‘qituvchi bilan yakkama-yakka dars va individual konsultatsiya bron qilish.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dbState.lessonSlots.map((slot) => {
            const isBooked = slot.status === 'booked';
            return (
              <div
                key={slot.id}
                className={`p-4 rounded-2xl border transition ${
                  isBooked ? 'bg-slate-50 border-slate-200' : 'bg-white border-blue-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-900">{slot.subject}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isBooked ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {isBooked ? 'Band qilingan' : 'Bo‘sh vaqt'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-1">
                  Ustoz: <span className="font-semibold">{slot.teacherName}</span>
                </p>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Bugun, 15:00 – 16:00
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-900">
                    {formatUZS(slot.priceUzs)}
                  </span>
                  {isBooked ? (
                    <button
                      onClick={() => onOpenClassroom(slot.subject, slot.teacherName)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1"
                    >
                      Sinfxonaga kirish
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookSlotClick(slot)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition"
                    >
                      Bron qilish
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teacher Profile Drawer / Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedTeacher(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <img
                src={selectedTeacher.avatarUrl}
                alt={selectedTeacher.fullName}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {selectedTeacher.fullName}
                  {selectedTeacher.verified && (
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  )}
                </h3>
                <p className="text-xs text-slate-500">@{selectedTeacher.nickname} &bull; {selectedTeacher.region}</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {selectedTeacher.rating.toFixed(2)}
                  </span>
                  <span className="text-slate-400">({selectedTeacher.reviewCount} baho)</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-700 font-medium">{selectedTeacher.experienceYears} yil o‘qituvchilik tajribasi</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Ma’lumoti & Muassasa:</h4>
                <p className="text-slate-600">{selectedTeacher.education}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Metodika & O‘qituvchi haqida:</h4>
                <p className="leading-relaxed text-slate-600">{selectedTeacher.bio}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Fanlar & Xalqaro Imtihonlar:</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedTeacher.subjects.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold">
                      {s}
                    </span>
                  ))}
                  {selectedTeacher.examTracks.map((ex, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Guruh oylik to‘lovi:</span>
                  <span className="text-base font-extrabold text-blue-700">
                    {formatUZS(selectedTeacher.groupMonthlyRateUzs)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const group = dbState.marketplaceGroups.find((g) => g.teacherId === selectedTeacher.userId);
                    if (group) {
                      setSelectedTeacher(null);
                      handleEnrollClick(group);
                    } else {
                      alert("Hozirda bu o'qituvchining yangi guruhi rejalashtirilmoqda.");
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                >
                  Guruhiga yozilish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal with Transparent 83% / 17% Commission Formula */}
      {checkoutTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setCheckoutTarget(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {paymentDone ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  To‘lov Muvaffaqiyatli Amalga Oshirildi!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Siz muvaffaqiyatli guruhga a’zo bo‘ldingiz. O‘qituvchi hisobiga 83% ulush
                  avtomatik tarzda o‘tkazildi. Dars vaqti Virtual Sinfxonada kutamiz!
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setCheckoutTarget(null);
                      onOpenClassroom(checkoutTarget.title, checkoutTarget.teacherName);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Sinfxonaga o‘tish
                  </button>
                  <button
                    onClick={() => setCheckoutTarget(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Xavfsiz To‘lov & Komissiya Taqsimoti
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  {checkoutTarget.title} &bull; Ustoz: <strong>{checkoutTarget.teacherName}</strong>
                </p>

                {/* 83% / 17% Commission Breakdown */}
                {(() => {
                  const split = calculateMarketplaceSplit(checkoutTarget.priceUzs);
                  return (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-slate-700">
                        <span>Jami to‘lov summasi:</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {formatUZS(split.grossAmount)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-emerald-700 font-medium pt-2 border-t border-slate-200">
                        <span>O‘qituvchi ulushi (83%):</span>
                        <span className="font-bold">{formatUZS(split.teacherShare)}</span>
                      </div>

                      <div className="flex items-center justify-between text-blue-700 font-medium">
                        <span>ENVO platforma xizmati (17%):</span>
                        <span className="font-bold">{formatUZS(split.envoCommission)}</span>
                      </div>

                      <p className="text-[10px] text-slate-400 italic pt-1">
                        * Shaffof komissiya qoidasi: To‘lov to‘g‘ridan-to‘g‘ri o‘qituvchining
                        virtual hamyoniga o‘tkaziladi.
                      </p>
                    </div>
                  );
                })()}

                {/* Payment Provider Selection */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    To‘lov usulini tanlang:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'uzcard', label: 'Uzcard' },
                      { id: 'humo', label: 'Humo' },
                      { id: 'visa', label: 'Visa' },
                      { id: 'mastercard', label: 'Mastercard' },
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setPaymentProvider(p.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          paymentProvider === p.id
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card input mockup */}
                <div className="space-y-3 mb-6">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Karta raqami:
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={paymentProvider === 'uzcard' ? '8600 45** **** 3218' : '9860 12** **** 7490'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono text-slate-700"
                    />
                  </div>
                </div>

                <button
                  onClick={executePayment}
                  disabled={isProcessingPayment}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    'To‘lov qayta ishlanmoqda...'
                  ) : (
                    <>
                      <span>To‘lovni tasdiqlash</span>
                      <span>({formatUZS(checkoutTarget.priceUzs)})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
