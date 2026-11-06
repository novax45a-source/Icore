/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  Users,
  Video,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AudioTranscriberWidget } from '../components/AudioTranscriberWidget';

interface CenterTeacherDashboardProps {
  onOpenClassroom: (title: string, teacher: string) => void;
}

export const CenterTeacherDashboard: React.FC<CenterTeacherDashboardProps> = ({
  onOpenClassroom,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'classes' | 'attendance' | 'homework'>('classes');

  const classes = [
    {
      id: 'c-1',
      name: 'General English Intermediate B1-04',
      schedule: 'Dush-Chor-Juma 14:00',
      studentsCount: 16,
      room: 'Xona 204 (Chilonzor)',
      attendanceRate: 94,
    },
    {
      id: 'c-2',
      name: 'Grammar & Vocabulary Upper-Intermediate B2-01',
      schedule: 'Sesh-Pay-Shan 10:00',
      studentsCount: 18,
      room: 'Xona 102 (Chilonzor)',
      attendanceRate: 96,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-700 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user?.name || 'Sherzod Qodirov'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                Markaz O‘qituvchisi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Registon O‘quv Markazi &bull; Center Teacher Scope &bull; Shtatdagi pedagog
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenClassroom('General English Intermediate B1-04', user?.name || 'Sherzod Qodirov')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          Jonli Sinfxonani Ochish
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: 'classes', label: 'Biriktirilgan Sinflarim', icon: Building2 },
          { id: 'attendance', label: 'Davomat Jurnali', icon: CheckCircle2 },
          { id: 'homework', label: 'Uyga Vazifalar & Baholash', icon: BookOpen },
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

      {/* Tab: Classes */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-bold text-base text-slate-900">{cls.name}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {cls.schedule}
                  </span>
                  <span>&bull;</span>
                  <span className="font-semibold text-slate-700">
                    {cls.studentsCount} nafar o‘quvchi
                  </span>
                  <span>&bull;</span>
                  <span>{cls.room}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  Davomat: {cls.attendanceRate}%
                </span>
                <button
                  onClick={() => onOpenClassroom(cls.name, user?.name || 'Sherzod Qodirov')}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
                >
                  Sinfxonaga kirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Attendance */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Bugungi Davomat Qaydi (General English B1-04)
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {[
              { name: 'Nodir Toirov', present: true, note: 'Faol qatnashdi' },
              { name: 'Malika Sobirova', present: true, note: 'Uyga vazifani topshirdi' },
              { name: 'Otabek Yunusov', present: false, note: 'Sababli (kasal)' },
              { name: 'Sevara Karimova', present: true, note: 'Muntazam davomat' },
            ].map((st, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{st.name}</h3>
                  <p className="text-slate-500">{st.note}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    st.present
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {st.present ? 'Bor (Keldi)' : 'Yo‘q (Kelmadi)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Homework */}
      {activeTab === 'homework' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900">
            Uyga Vazifa Yuborish & O‘quvchi Esse Baholash
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            Markaz o‘quvchilari uchun hafta yakuniy topshiriqlari joylashtirildi.
          </div>
          <AudioTranscriberWidget title="Ovozli Baho va Fikr Yozib Qoldirish (gemini-3.5-transcribe)" />
        </div>
      )}
    </div>
  );
};
