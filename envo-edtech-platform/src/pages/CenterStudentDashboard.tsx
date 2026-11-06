/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Clock,
  Video,
  FileCheck,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AudioTranscriberWidget } from '../components/AudioTranscriberWidget';

interface CenterStudentDashboardProps {
  onOpenClassroom: (title: string, teacher: string) => void;
}

export const CenterStudentDashboard: React.FC<CenterStudentDashboardProps> = ({
  onOpenClassroom,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'schedule' | 'homework' | 'fees'>('schedule');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-blue-100 mb-2 inline-block">
            O‘quv Markazi O‘quvchisi
          </span>
          <h1 className="text-xl sm:text-2xl font-bold">{user?.name || 'Nodir Toirov'}</h1>
          <p className="text-blue-100 text-xs mt-1">
            Registon O‘quv Markazi &bull; Guruh: IELTS Foundation G-12
          </p>
        </div>

        <button
          onClick={() => onOpenClassroom('IELTS Foundation G-12', 'Kamola Karimova')}
          className="px-5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 transition shadow flex items-center gap-2"
        >
          <Video className="w-4 h-4 text-blue-600" />
          Sinfxonaga Kirish
        </button>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Dars Jadvali:</span>
          <span className="font-bold text-slate-900 text-sm">Sesh-Pay-Shan 16:00</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Ustoz:</span>
          <span className="font-bold text-slate-900 text-sm">Kamola Karimova</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Oylik Davomat:</span>
          <span className="font-bold text-emerald-600 text-sm">96% (Faol)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: 'schedule', label: 'Dars Jadvali & Xonalar', icon: Calendar },
          { id: 'homework', label: 'Uyga Vazifalarim', icon: FileCheck },
          { id: 'fees', label: 'To‘lov Holati', icon: CreditCard },
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

      {/* Tab: Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Haftalik Darslarim
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">IELTS Foundation G-12 (Writing & Reading)</h3>
                <p className="text-slate-500 mt-0.5">Xona: 301-auditoriya &bull; O‘qituvchi: Kamola Karimova</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold">
                Bugun 16:00
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Homework */}
      {activeTab === 'homework' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900">
            Uyga Vazifalar va Topshiriqlar
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-slate-900">Unit 4: Environment & Technology Vocabulary</h3>
              <p className="text-slate-500">Muddati: Ertaga 16:00 gacha</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
              Topshirilgan (92/100)
            </span>
          </div>

          <AudioTranscriberWidget title="Uyga Vazifani Ovoz bilan Yozish (gemini-3.5-transcribe)" />
        </div>
      )}

      {/* Tab: Fees */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Markaz Oylik Kurs To‘lovi
          </h2>
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-emerald-900">Noyabr 2026 oylik to‘lovi</h3>
              <p className="text-emerald-700 mt-0.5">Summa: 750 000 UZS &bull; Kvitansiya: REG-ST-8821</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold">
              To‘langan ✓
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
