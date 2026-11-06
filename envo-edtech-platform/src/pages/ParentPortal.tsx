import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Calendar,
  CreditCard,
  BookOpen,
  Award,
  Phone,
  User,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../lib/mockDatabase';
import { formatUZS } from '../lib/commission';
import { ParentChild } from '../lib/types';

export const ParentPortal: React.FC = () => {
  const { user } = useAuth();
  const dbState = mockDb.getState();

  const [activeTab, setActiveTab] = useState<'attendance' | 'grades' | 'fees'>('attendance');

  // Load children registered to this parent
  const parentChildren: ParentChild[] = dbState.parentChildren.length > 0 ? dbState.parentChildren : [
    {
      id: 'child-1',
      parentId: user?.id || 'par-1',
      name: 'Nodir Toirov',
      gender: 'male',
      centerName: 'Registon O‘quv Markazi',
      groupName: 'IELTS Foundation G-12',
      teacherName: 'Kamola Karimova',
      teacherPhone: '+998 91 987 65 43',
      monthlyFeeUzs: 750000,
      feeStatus: 'paid',
      attendancePercent: 96,
      grades: [
        { subject: 'IELTS Mock Exam #2', score: 'Overall: 7.0', date: '02.11.2026' },
        { subject: 'Grammatika Sinovi', score: '92 / 100', date: '28.10.2026' },
      ],
      attendanceLogs: [
        { date: '04.11.2026', lesson: 'IELTS Writing Task 2 Intro', status: 'Qatnashdi', note: 'Darsda faol, savollarga to‘g‘ri javob berdi' },
        { date: '02.11.2026', lesson: 'Reading Skimming & Scanning', status: 'Qatnashdi', note: 'Uyga vazifani a’lo darajada bajardi' },
        { date: '31.10.2026', lesson: 'Academic Vocabulary', status: 'Qatnashdi', note: 'Yaxshi' },
        { date: '28.10.2026', lesson: 'Grammar in Context', status: 'Sababli', note: 'Ota-ona ogohlantirdi' },
      ],
    },
    {
      id: 'child-2',
      parentId: user?.id || 'par-1',
      name: 'Rayhona Toirova',
      gender: 'female',
      centerName: 'Al-Xorazmiy Academy',
      groupName: 'Nemis tili A2.1 (Start Deutsch)',
      teacherName: 'Feruza Vohidova',
      teacherPhone: '+998 90 234 56 78',
      monthlyFeeUzs: 680000,
      feeStatus: 'paid',
      attendancePercent: 100,
      grades: [
        { subject: 'Goethe A1 Modellsatz', score: '94 / 100 (Sehr Gut)', date: '01.11.2026' },
        { subject: 'Wortschatz & Grammatik', score: '88 / 100', date: '26.10.2026' },
      ],
      attendanceLogs: [
        { date: '04.11.2026', lesson: 'Perfekt mit haben und sein', status: 'Qatnashdi', note: 'Zo‘r o‘zlashtirmoqda' },
        { date: '02.11.2026', lesson: 'Modalverben im Präteritum', status: 'Qatnashdi', note: 'Uy vazifasi to‘liq' },
        { date: '30.10.2026', lesson: 'Hören Teil 1-3 Test', status: 'Qatnashdi', note: 'Aktiv ishtirok' },
      ],
    },
  ];

  const [selectedChildId, setSelectedChildId] = useState<string>(parentChildren[0].id);
  const selectedChild = parentChildren.find((c) => c.id === selectedChildId) || parentChildren[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-indigo-200 mb-2 inline-block">
            Ota-ona Boshqaruv Portali
          </span>
          <h1 className="text-xl sm:text-2xl font-bold">{user?.name || 'Murod Toirov'}</h1>
          <p className="text-slate-300 text-xs mt-1">
            Farzandlaringiz ta’lim jarayoni, davomati, baholari va to‘lovlari monitoringi.
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 text-xs">
          <span className="text-slate-400 block text-[10px]">O‘qituvchi bilan aloqa:</span>
          <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            {selectedChild.teacherName} ({selectedChild.teacherPhone})
          </span>
        </div>
      </div>

      {/* Multi-Child Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <label className="block text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-blue-600" />
          Farzandni tanlang (Ko‘p farzandli ota-onalar tizimi):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {parentChildren.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                selectedChildId === child.id
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  child.gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{child.name}</h4>
                  <p className="text-[11px] text-slate-500">{child.centerName} &bull; {child.groupName}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                (child.attendancePercent ?? 95) >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {child.attendancePercent ?? 95}% Davomat
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: 'attendance', label: 'Davomat Monitoringi', icon: Calendar },
          { id: 'grades', label: 'Baholar & Test Natijalari', icon: Award },
          { id: 'fees', label: 'Markaz To‘lovlari & Kvitansiya', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition -mb-px ${
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

      {/* Tab: Attendance */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {selectedChild.name}ning Oylik Davomati
              </h2>
              <p className="text-xs text-slate-500">{selectedChild.groupName}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {selectedChild.attendancePercent ?? 96}% Qatnashish
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {(selectedChild.attendanceLogs || []).map((d, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{d.lesson}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({d.date})</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">Izoh: {d.note}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    d.status === 'Qatnashdi'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Grades */}
      {activeTab === 'grades' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            {selectedChild.name} — Baholar & Test Sinovlari
          </h2>
          <div className="space-y-3 text-xs">
            {(selectedChild.grades || []).map((g, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">{g.subject}</h3>
                    <span className="text-slate-400 font-mono text-[11px]">({g.date})</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">O‘qituvchi: {selectedChild.teacherName}</p>
                </div>
                <span className="text-sm font-extrabold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                  {g.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Fees */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            {selectedChild.name} — O‘quv Markazi Oylik To‘lovi
          </h2>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-emerald-950">Noyabr 2026 To‘lovi ({selectedChild.centerName})</h3>
              <p className="text-emerald-700 mt-0.5">
                Summa: {formatUZS(selectedChild.monthlyFeeUzs || 750000)} &bull; Holat: To‘langan
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              To‘langan ✓
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
