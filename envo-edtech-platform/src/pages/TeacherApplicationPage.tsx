import React, { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Shield,
  Award,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateTeacherAge, validateExamTrackScore, UZBEKISTAN_CORE_SUBJECTS } from '../lib/teacherVerification';
import { mockDb } from '../lib/mockDatabase';
import { CertificateDoc } from '../lib/types';

export const TeacherApplicationPage: React.FC = () => {
  const { user } = useAuth();

  const [legalName, setLegalName] = useState(user?.name || '');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('+998 90 ');
  const [dateOfBirth, setDateOfBirth] = useState('2002-06-15');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [region, setRegion] = useState('Toshkent shahri');
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);

  // Selected subjects and exam tracks
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Ingliz tili']);
  const [selectedExams, setSelectedExams] = useState<string[]>(['IELTS']);

  // Certificates list
  const [certificates, setCertificates] = useState<CertificateDoc[]>([
    {
      id: 'cert-1',
      title: 'IELTS Academic Official Certificate',
      issuer: 'British Council / IDP',
      scoreOrGrade: '8.0 (Listening: 8.5, Reading: 8.5)',
      fileUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=500&q=80',
      verified: true,
    },
  ]);

  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertScore, setNewCertScore] = useState('');

  // Documents
  const [identityUploaded, setIdentityUploaded] = useState(true);
  const [guardianConsentUploaded, setGuardianConsentUploaded] = useState(false);

  // Status after submission
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Age validation evaluation
  const ageValidation = validateTeacherAge(dateOfBirth, guardianConsentUploaded);

  const toggleSubject = (sub: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const toggleExam = (ex: string) => {
    setSelectedExams((prev) =>
      prev.includes(ex) ? prev.filter((e) => e !== ex) : [...prev, ex]
    );
  };

  const handleAddCert = () => {
    if (!newCertTitle || !newCertScore) return;

    // Check score validation for exam tracks
    if (newCertTitle.toUpperCase().includes('SAT')) {
      const v = validateExamTrackScore('SAT', newCertScore);
      if (!v.valid) {
        alert(v.reason);
        return;
      }
    }

    setCertificates((prev) => [
      ...prev,
      {
        id: 'cert-' + Date.now(),
        title: newCertTitle,
        issuer: newCertIssuer || 'Rasmiy Tashkilot',
        scoreOrGrade: newCertScore,
        fileUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=500&q=80',
        verified: false,
      },
    ]);
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertScore('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate Age Rules
    const ageCheck = validateTeacherAge(dateOfBirth, guardianConsentUploaded);
    if (!ageCheck.eligible) {
      setFormError(ageCheck.reason || 'Yosh talablariga javob bermaysiz.');
      return;
    }

    if (!legalName.trim() || !nickname.trim() || !phone.trim() || !bio.trim()) {
      setFormError('Iltimos, barcha majburiy maydonlarni to‘ldiring.');
      return;
    }

    if (selectedSubjects.length === 0) {
      setFormError('Kamida bitta fan tanlang.');
      return;
    }

    if (certificates.length === 0) {
      setFormError('O‘qituvchi bo‘lib ishlash uchun kamida 1 ta tasdiqlovchi sertifikat yuklashingiz shart.');
      return;
    }

    // Submit to mock database
    mockDb.submitTeacherApplication({
      userId: user?.id || 'usr-applicant-' + Date.now(),
      legalName,
      nickname,
      email: user?.email || 'applicant@envo.uz',
      phone,
      dateOfBirth,
      gender,
      region,
      bio,
      education,
      experienceYears,
      subjects: selectedSubjects,
      examTracks: selectedExams,
      certificates,
      identityDocUrl: identityUploaded
        ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80'
        : undefined,
      guardianConsentDocUrl: ageCheck.requiresGuardianConsent
        ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80'
        : undefined,
    });

    setSubmittedSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Mustaqil O‘qituvchilar Verifikatsiyasi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            ENVO Platformasida Rasmiy O‘qituvchi Bo‘ling
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Har bir darsdan <strong className="text-white">83% daromad</strong> oling. 1–3 kishilik guruhlar,
            o‘z dars jadvalingiz va o‘rnatilgan virtual sinfxonadan foydalaning.
          </p>
        </div>
      </div>

      {submittedSuccess ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg animate-in fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Arizangiz muvaffaqiyatli qabul qilindi!
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mb-6">
            Arizangiz Super Admin moderatorlari tomonidan tekshirilmoqda. Sertifikatlar va
            shaxsingiz tasdiqlangach, profilingiz ommaviy bozorda e’lon qilinadi va guruh ochishingiz mumkin bo‘ladi.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold">
            Status: Ko‘rib chiqilmoqda (Under Review)
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
          {formError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Personal Info */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
              Shaxsiy ma’lumotlar & Yosh tekshiruvi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  To‘liq qonuniy ism-sharifingiz (Pasport bo‘yicha) *
                </label>
                <input
                  type="text"
                  required
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="Jasur Aliyev"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ommaviy taxallus (Nickname) *
                </label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Jasur_IELTS_Tutor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">O‘quvchilar ko‘radigan ommaviy nom.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tug‘ilgan sana (Minimal yosh: 16) *
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                {/* Age Rule Feedback */}
                <div className="mt-1.5 text-xs">
                  {ageValidation.age < 16 ? (
                    <span className="text-red-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Yosh: {ageValidation.age} yosh (Rad etiladi: kamida 16 yosh bo‘lish shart)
                    </span>
                  ) : ageValidation.requiresGuardianConsent ? (
                    <span className="text-amber-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Yosh: {ageValidation.age} yosh (16–17 yosh: Ota-ona / vasiy roziligi talab etiladi)
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Yosh: {ageValidation.age} yosh (Talabga mos)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefon raqam *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hudud *
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option>Toshkent shahri</option>
                  <option>Toshkent viloyati</option>
                  <option>Samarqand</option>
                  <option>Buxoro</option>
                  <option>Farg‘ona</option>
                  <option>Andijon</option>
                  <option>Namangan</option>
                  <option>Qashqadaryo</option>
                  <option>Surxondaryo</option>
                  <option>Xorazm</option>
                  <option>Navoiy</option>
                  <option>Jizzax</option>
                  <option>Sirdaryo</option>
                  <option>Qoraqalpog‘iston Respublikasi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jins
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      className="accent-blue-600"
                    />
                    Erkak
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      className="accent-blue-600"
                    />
                    Ayol
                  </label>
                </div>
              </div>
            </div>

            {/* 16-17 Guardian Consent Upload Notice */}
            {ageValidation.requiresGuardianConsent && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      Ota-ona / Qonuniy vasiy roziligi hujjati talab etiladi
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      16–17 yoshdagi o‘qituvchilar mustaqil dars berishi uchun ota-ona imzosi
                      va shaxsini tasdiqlovchi hujjat ilova qilinishi shart.
                    </p>
                    <label className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold cursor-pointer hover:bg-amber-700 transition">
                      <Upload className="w-3.5 h-3.5" />
                      {guardianConsentUploaded ? 'Vasiylik hujjati yuklandi ✓' : 'Rozilik xatini yuklash'}
                      <input
                        type="file"
                        className="hidden"
                        onChange={() => setGuardianConsentUploaded(true)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Qualifications & Subjects */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
              Fanlar, Malaka & Imtihon yo‘nalishlari
            </h3>

            {/* Core Uzbek Subjects */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                O‘zbekiston maktab fanlari (A/A+ milliy sertifikat talab etiladi):
              </label>
              <div className="flex flex-wrap gap-2">
                {UZBEKISTAN_CORE_SUBJECTS.map((sub) => (
                  <button
                    type="button"
                    key={sub}
                    onClick={() => toggleSubject(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                      selectedSubjects.includes(sub)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Tracks */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Xalqaro imtihon yo‘nalishlari:
              </label>
              <div className="flex flex-wrap gap-2">
                {['IELTS', 'SAT', 'CEFR C1', 'CEFR C2', 'TOEFL'].map((ex) => (
                  <button
                    type="button"
                    key={ex}
                    onClick={() => toggleExam(ex)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                      selectedExams.includes(ex)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ta’lim muassasasi & Mutaxassislik *
                </label>
                <input
                  type="text"
                  required
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="O‘zbekiston Milliy Universiteti, Matematika"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dars berish tajribasi (yil) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                O‘qituvchi biografiyasi & Dars berish metodikasi *
              </label>
              <textarea
                rows={3}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="O‘zingiz, dars uslubingiz va o‘quvchilaringiz erishgan yutuqlar haqida yozing..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Verified Certificates */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</span>
              Sertifikatlar & Hujjatlarni yuklash
            </h3>

            {/* List of Certificates */}
            <div className="space-y-2 mb-4">
              {certificates.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-semibold text-slate-900">{c.title}</span>
                      <span className="text-slate-500 ml-2">({c.scoreOrGrade}) &bull; {c.issuer}</span>
                    </div>
                  </div>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" />
                    Biriktirilgan
                  </span>
                </div>
              ))}
            </div>

            {/* Add new certificate */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Sertifikat nomi (masalan: SAT 1520, Ona tili A+)
                </label>
                <input
                  type="text"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                  placeholder="Official SAT Report"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ball / Daraja (SAT kamida 1400)
                </label>
                <input
                  type="text"
                  value={newCertScore}
                  onChange={(e) => setNewCertScore(e.target.value)}
                  placeholder="1480"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                >
                  + Sertifikat qo‘shish
                </button>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              * Shaxsiy guvohnoma ma’lumotlari hech qachon ommaga chiqarilmaydi.
            </p>
            <button
              type="submit"
              disabled={!ageValidation.eligible}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold shadow-md transition"
            >
              Arizani tekshirishga yuborish
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
