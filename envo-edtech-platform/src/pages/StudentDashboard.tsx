import React, { useState } from 'react';
import {
  BookOpen,
  Video,
  Clock,
  Sparkles,
  Search,
  Receipt,
  FileCheck,
  Award,
  User,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { mockDb } from '../lib/mockDatabase';
import { formatUZS } from '../lib/commission';
import { AudioTranscriberWidget } from '../components/AudioTranscriberWidget';
import { ExamRunnerModal } from '../components/ExamRunnerModal';
import { EnvoLogo } from '../components/EnvoLogo';
import { Exam, Gender } from '../lib/types';

interface StudentDashboardProps {
  onOpenClassroom: (title: string, teacher: string) => void;
  onExploreTeachers: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenClassroom,
  onExploreTeachers,
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dbState = mockDb.getState();

  const [activeTab, setActiveTab] = useState<'lessons' | 'groups' | 'exams' | 'homework' | 'payments' | 'profile'>('lessons');
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [studentGender, setStudentGender] = useState<Gender>(user?.gender || 'male');
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Available and submitted exams
  const exams = dbState.exams;
  const submissions = dbState.examSubmissions.filter((s) => s.studentId === (user?.id || 'std-101'));
  const homeworkList = dbState.homeworkAssignments;

  // Enrolled groups and my payments
  const myPayments = dbState.marketplacePayments.filter(
    (p) => p.studentId === (user?.id || 'student-demo') || p.studentName.includes('Bobur')
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Student Welcome Card */}
      <div className="bg-gradient-to-r from-[#050B1A] via-[#0A1530] to-[#0B1220] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#1F5BFF]/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#1F5BFF]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <EnvoLogo size="lg" variant="dark" />
            <div className="border-l border-white/10 pl-4">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1F5BFF]/20 text-[#8EC5FF] border border-[#1F5BFF]/30 inline-block">
                  Mustaqil O‘quvchi Kabineti
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-white border border-white/20 inline-flex items-center gap-1">
                  <User className="w-3 h-3 text-[#8EC5FF]" />
                  {studentGender === 'female' ? "Talaba (Ayol/Qiz)" : "Talaba (Erkak/O‘g‘il bola)"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Xush kelibsiz, {user?.name || 'Bobur Mirzayev'}!
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-lg">
                Bugungi darslaringiz, 1–3 kishilik mini-guruhlar, imtihonlar va vazifalaringiz nazorati.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenClassroom('IELTS Intensive Target 7.5+', 'Jasur Aliyev')}
              className="px-4 py-2.5 rounded-xl bg-[#1F5BFF] hover:bg-blue-600 text-white text-xs font-bold transition shadow-md shadow-[#1F5BFF]/30 flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              Jonli Darsga Kirish
            </button>
            <button
              onClick={onExploreTeachers}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-[#8EC5FF]" />
              Repetitor Topish
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Pills (Mobile-First scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'lessons', label: 'Darslarim & Virtual Sinf', icon: Video },
          { id: 'groups', label: 'Mening Guruhlarim (1–3)', icon: BookOpen },
          { id: 'exams', label: 'Imtihonlar & Testlar', icon: Award },
          { id: 'homework', label: 'Uyga Vazifalar', icon: FileCheck },
          { id: 'payments', label: 'To‘lovlar Tarixi & Cheklar', icon: Receipt },
          { id: 'profile', label: 'Jins & Profil Sozlamalari', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Lessons */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Yaqinlashib Kelayotgan Darslar
            </h2>
            <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              Sinfxona Ochiq
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Teacher"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    IELTS Intensive Writing & Speaking (Mini-Guruh)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ustoz: <strong>Jasur Aliyev</strong> &bull; 1–3 kishilik guruh
                  </p>
                  <p className="text-xs text-blue-600 font-semibold mt-1">
                    Dars vaqti: Dushanba-Chorshanba-Juma 18:00
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenClassroom('IELTS Intensive Target 7.5+', 'Jasur Aliyev')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Video className="w-4 h-4" />
                Sinfxonaga Kirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Groups */}
      {activeTab === 'groups' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            A’zo Bo‘lingan Guruhlar (1–3 o‘quvchi chegarasi)
          </h2>
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">IELTS Intensive 7.5+ Target</h3>
              <p className="text-xs text-slate-500">O‘qituvchi: Jasur Aliyev</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Guruhda 2/3 o‘quvchi (Faol)
              </span>
            </div>
            <button
              onClick={() => onOpenClassroom('IELTS Intensive Target 7.5+', 'Jasur Aliyev')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Darsga o‘tish
            </button>
          </div>
        </div>
      )}

      {/* Tab: Exams & Tests */}
      {activeTab === 'exams' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Mavjud Imtihonlar & Test Sinovlari
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Onlayn testlarni yeching, ballaringizni darhol bilib oling va tahlil qiling.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {exams.length} ta test tayyor
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam) => {
              const submission = submissions.find((s) => s.examId === exam.id);
              return (
                <div
                  key={exam.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {exam.subject}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {exam.durationMinutes} daqiqa
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 mb-1">{exam.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{exam.description}</p>
                    <div className="mt-3 text-xs text-slate-600 space-y-1">
                      <div>O‘qituvchi: <strong>{exam.teacherName}</strong></div>
                      <div>Savollar soni: <strong>{exam.questions.length} ta</strong> &bull; O‘tish bali: {exam.passingScore}%</div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                    {submission ? (
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          submission.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          Natija: {submission.score}% ({submission.passed ? 'O‘tdi ✓' : 'Yiqildi'})
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Topshirilmagan
                      </span>
                    )}

                    <button
                      onClick={() => setActiveExam(exam)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      {submission ? 'Qayta Yechish' : 'Testni Boshlash'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Homework */}
      {activeTab === 'homework' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                Mening Uyga Vazifalarim & Topshiriqlar
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ustozlar tomonidan biriktirilgan vazifalar va yuklangan fayllar.
              </p>
            </div>
          </div>

          {submissionFeedback && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {submissionFeedback}
              </span>
              <button onClick={() => setSubmissionFeedback(null)} className="text-emerald-700 font-bold">
                ✕
              </button>
            </div>
          )}

          <div className="space-y-4">
            {homeworkList.map((hw) => (
              <div
                key={hw.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      {hw.subject}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Muddati: {new Date(hw.dueDate).toLocaleDateString()} 23:59
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{hw.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">{hw.description}</p>
                  <p className="text-xs text-slate-500 mt-1">O‘qituvchi: <strong>{hw.teacherName}</strong></p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      mockDb.submitHomework({
                        assignmentId: hw.id,
                        studentId: user?.id || 'std-101',
                        studentName: user?.name || 'Bobur Mirzayev',
                        content: 'Vazifa PDF va skrinshotlari ilova qilindi.',
                        attachments: ['vazifa_yechimi.pdf'],
                      });
                      setSubmissionFeedback(`"${hw.title}" bo‘yicha topshiriq ustozga muvaffaqiyatli topshirildi!`);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    Fayl Biriktirish & Topshirish
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Gemini 3.5 Audio Transcriber for dictating homework or transcribing audio */}
          <AudioTranscriberWidget title="Ovozli Esse / Dars Javobini Matnga Aylantirish (gemini-3.5-transcribe)" />
        </div>
      )}

      {/* Tab: Payments */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            To‘lovlarim Tarixi & Cheklar
          </h2>

          <div className="space-y-3">
            {myPayments.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{p.itemName}</h3>
                  <p className="text-slate-500 mt-0.5">
                    O‘qituvchi: <strong>{p.teacherName}</strong> &bull; Usul: {p.provider.toUpperCase()}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-slate-900 block text-sm">
                    {formatUZS(p.grossAmountUzs)}
                  </span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    To‘langan ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Profile & Gender Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Talaba Shaxsiy Ma’lumotlari & Jinsi
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ustozlar sizning jinsingizga qarab guruh tanlash talablarini tekshiradilar (masalan, faqat qizlar yoki faqat o‘g‘il bolalar guruhlari).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Talabaning Jinsi (Gender):
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStudentGender('male')}
                  className={`p-3.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                    studentGender === 'male'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Erkak / O‘g‘il bola (Male)</span>
                  {studentGender === 'male' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setStudentGender('female')}
                  className={`p-3.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                    studentGender === 'female'
                      ? 'border-pink-600 bg-pink-50 text-pink-900 shadow-xs ring-2 ring-pink-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Ayol / Qiz bola (Female)</span>
                  {studentGender === 'female' && <CheckCircle2 className="w-4 h-4 text-pink-600" />}
                </button>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 border-t border-slate-200">
              <p>
                Ushbu jins sozlamasi bo‘yicha siz:
              </p>
              <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600">
                {studentGender === 'male' ? (
                  <>
                    <li>Faqat barcha talabalarga ochiq yoki o‘g‘il bolalar uchun mo‘ljallangan guruhlarga yozila olasiz.</li>
                    <li>&ldquo;Faqat qizlar/ayollar&rdquo; auditoriyasi uchun belgilangan darslarga yozilish tizim tomonidan cheklanadi.</li>
                  </>
                ) : (
                  <>
                    <li>Barcha ommaviy darslarga hamda maxsus &ldquo;Faqat qizlar/ayollar uchun&rdquo; guruhlariga erkin yozila olasiz.</li>
                    <li>&ldquo;Faqat o‘g‘il bolalar uchun&rdquo; guruhlariga kirish taqiqlanadi.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Theme & Visual Appearance */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0A1530] border border-slate-200 dark:border-[#1F5BFF]/30 space-y-4 max-w-xl transition-colors">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">
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
        </div>
      )}

      {/* Exam Runner Modal */}
      {activeExam && (
        <ExamRunnerModal
          exam={activeExam}
          onClose={() => setActiveExam(null)}
          onCompleted={() => {
            setActiveExam(null);
          }}
        />
      )}
    </div>
  );
};
