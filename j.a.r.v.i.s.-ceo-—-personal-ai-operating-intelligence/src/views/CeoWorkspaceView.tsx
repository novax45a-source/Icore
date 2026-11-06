import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  TrendingUp,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  Send
} from 'lucide-react';

interface CeoWorkspaceViewProps {
  onDispatchTask: (prompt: string) => void;
}

export const CeoWorkspaceView: React.FC<CeoWorkspaceViewProps> = ({ onDispatchTask }) => {
  const [activeProject, setActiveProject] = useState<'VERON' | 'ICSN' | 'ENVO' | 'JARVIS'>('ENVO');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState<string | null>(null);

  const projectDetails: Record<
    'VERON' | 'ICSN' | 'ENVO' | 'JARVIS',
    {
      title: string;
      tagline: string;
      status: string;
      milestones: { title: string; deadline: string; status: 'DONE' | 'IN_PROGRESS' | 'PLANNED' }[];
      kpis: { label: string; value: string; trend: string }[];
      risks: { risk: string; severity: 'LOW' | 'MED' | 'HIGH'; mitigation: string }[];
    }
  > = {
    ENVO: {
      title: 'ENVO — Clean Energy & Sustainability Grid',
      tagline: 'Sun\'iy intellekt asosida qayta tiklanuvchi energiya sarfini optimallashtirish',
      status: 'PHASE 2: PILOT DEPLOYMENT',
      milestones: [
        { title: 'Mikrotarmoq telemetriya tahlili', deadline: '2026 Q4', status: 'DONE' },
        { title: 'Ollama Qwen asosida optimallashtirish algoritmi', deadline: '2027 Q1', status: 'IN_PROGRESS' },
        { title: 'Katta korxonalarda sinovdan o\'tkazish', deadline: '2027 Q2', status: 'PLANNED' }
      ],
      kpis: [
        { label: 'Energiya tejash darajasi', value: '23.8%', trend: '+4.2%' },
        { label: 'CO2 emissiyasi kamayishi', value: '180 T/yil', trend: '+12%' },
        { label: 'Simulyatsiya aniqligi', value: '96.4%', trend: '+1.5%' }
      ],
      risks: [
        { risk: 'Mahalliy tarmoq sensorlarining kechikishi', severity: 'MED', mitigation: 'Edge-node xotira keshini joriy qilish' },
        { risk: 'Quyosh panellari ob-havo tebranishlari', severity: 'LOW', mitigation: 'Prognozlovchi AI modelini ulash' }
      ]
    },
    VERON: {
      title: 'VERON — Smart Hardware & Autonomous Logistics',
      tagline: 'Korporativ logistika va apparat ta\'minotini avtonom boshqaruv tizimi',
      status: 'PHASE 3: SCALE & TELEMETRY',
      milestones: [
        { title: 'IoT sensorlari arxitekturasi', deadline: '2026 Q3', status: 'DONE' },
        { title: 'Real-time marshrutlash mikroxizmati', deadline: '2026 Q4', status: 'IN_PROGRESS' },
        { title: 'Global ta\'minot zanjiri integratsiyasi', deadline: '2027 Q2', status: 'PLANNED' }
      ],
      kpis: [
        { label: 'Yetkazib berish vaqti qisqarishi', value: '31.5%', trend: '+8.1%' },
        { label: 'Uskunalar ish vaqti (Uptime)', value: '99.85%', trend: 'Barqaror' },
        { label: 'Xarajatlarni qisqartirish', value: '18.2%', trend: '+3.0%' }
      ],
      risks: [
        { risk: 'Apparat komponentlari yetishmovchiligi', severity: 'HIGH', mitigation: 'Zaxira ta\'minotchilar bazasi' }
      ]
    },
    ICSN: {
      title: 'ICSN — Cyber Security & Zero-Trust Protocol',
      tagline: 'Kiberxavfsizlik, shifrlangan tarmoqlar va perimetr mudofaasi',
      status: 'PHASE 4: AUDIT & ENFORCEMENT',
      milestones: [
        { title: 'Zero-Trust autentifikatsiya moduli', deadline: '2026 Q3', status: 'DONE' },
        { title: 'Avtomatlashtirilgan zaiflik skaneri', deadline: '2026 Q4', status: 'DONE' },
        { title: 'Kriptografik agent aloqa protokoli', deadline: '2027 Q1', status: 'IN_PROGRESS' }
      ],
      kpis: [
        { label: 'Bloklangan tahdidlar', value: '1,420+', trend: '100% zararsiz' },
        { label: 'Audit o\'tish koeffitsienti', value: '98.9%', trend: '+2.1%' },
        { label: 'Shifrlash tezligi', value: '4.8 Gbps', trend: 'Ultra-fast' }
      ],
      risks: [
        { risk: 'Noma\'lum 0-day zaifliklar', severity: 'HIGH', mitigation: 'Sun\'iy intellekt anomaliya detektori' }
      ]
    },
    JARVIS: {
      title: 'J.A.R.V.I.S. — Personal Operating Intelligence',
      tagline: 'Yadro intellekti, 10 ta avtonom agent jamoasi va Founder yordamchisi',
      status: 'CORE OPERATIONAL (IRON CORE v3.5)',
      milestones: [
        { title: 'Ollama Qwen3 va Qwen2.5-Coder integratsiyasi', deadline: '2026 Q4', status: 'DONE' },
        { title: 'Cinematic 3D Arc Reactor HUD & Ovozli boshqaruv', deadline: '2026 Q4', status: 'DONE' },
        { title: 'Tauri Desktop Windows chuqur integratsiyasi', deadline: '2027 Q1', status: 'IN_PROGRESS' }
      ],
      kpis: [
        { label: 'Vazifalarni avtonom bajarish', value: '94.2%', trend: '+5.0%' },
        { label: 'RAM iste\'moli (i7-1355U)', value: '3.1 GB', trend: 'Optimal' },
        { label: 'Javob berish tezligi', value: '280 ms', trend: 'High Speed' }
      ],
      risks: [
        { risk: 'Lokal xotira haddan tashqari to\'lishi', severity: 'LOW', mitigation: 'ChromaDB avtomatlashtirilgan tozalash' }
      ]
    }
  };

  const currentInfo = projectDetails[activeProject];

  const handleGenerateWeeklyReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setWeeklyReport(
        `J.A.R.V.I.S. CEO — HAFTALIK IJROCHI HISOBOT (EXECUTIVE BRIEFING)\nSana: 2026-11-05 | Boshqaruvchi: Founder (princess0481128@gmail.com)\n\n` +
          `1. [ENVO]: Mikrotarmoq tahlil algoritmlari 96.4% aniqlikda ishlamoqda. Ollama Qwen integratsiyasi orqali mahalliy energiya tejash 23.8% ga yetdi.\n` +
          `2. [ICSN]: Zero-Trust perimetri 100% himoyalangan. O'tgan haftada 140 dan ortiq avtomatlashtirilgan zaiflik sinovlari muvaffaqiyatli yakunlandi.\n` +
          `3. [VERON]: Apparat sensorlari telemetriyasi 99.85% barqarorlikni ko'rsatmoqda. Real-time marshrutlash moduli sinovda.\n` +
          `4. [JARVIS]: Tizim yadrosi to'liq stabil. 10 ta agent jamoasi faol va yangi topshiriqlarni qabul qilishga shay.\n\nXulosa: Barcha loyihalar rejaga muvofiq harakatlanmoqda. Hal etilmagan xavf omillari mavjud emas.`
      );
      setGeneratingReport(false);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#030814]/70">
      {/* Top Banner */}
      <div className="p-5 rounded-xl hud-glass border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            FOUNDER & CEO COMMAND SUITE
          </div>
          <h1 className="text-xl font-tech font-bold text-white tracking-wide">
            ENTERPRISE STRATEGY & ROADMAP ORCHESTRATION
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Founder Portfolio: VERON • ICSN • ENVO • JARVIS
          </p>
        </div>

        <button
          onClick={handleGenerateWeeklyReport}
          disabled={generatingReport}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          <Sparkles className="w-4 h-4" />
          <span>{generatingReport ? 'Hisobot tayyorlanmoqda...' : 'Haftalik Hisobot Tuzish'}</span>
        </button>
      </div>

      {/* Project Selector Tabs */}
      <div className="flex border-b border-cyan-500/20 gap-2">
        {(['ENVO', 'VERON', 'ICSN', 'JARVIS'] as const).map(proj => (
          <button
            key={proj}
            onClick={() => setActiveProject(proj)}
            className={`px-4 py-2.5 font-tech text-sm font-bold tracking-wider transition-all border-b-2 ${
              activeProject === proj
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40 shadow-[0_4px_12px_rgba(0,240,255,0.2)]'
                : 'border-transparent text-slate-400 hover:text-cyan-400'
            }`}
          >
            {proj}
          </button>
        ))}
      </div>

      {/* Project Info Header */}
      <div className="p-5 rounded-xl hud-glass border border-cyan-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-lg font-tech font-bold text-white tracking-wide">
              {currentInfo.title}
            </h2>
            <p className="text-xs font-mono text-cyan-300/90 mt-0.5">
              {currentInfo.tagline}
            </p>
          </div>
          <span className="px-3 py-1 rounded-md text-xs font-mono bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-bold self-start md:self-auto">
            {currentInfo.status}
          </span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-cyan-500/20">
          {currentInfo.kpis.map((kpi, kIdx) => (
            <div key={kIdx} className="p-3 rounded-lg bg-black/40 border border-cyan-500/20">
              <div className="text-[10px] font-mono text-slate-400">{kpi.label}</div>
              <div className="text-base font-tech font-bold text-cyan-400 mt-0.5">
                {kpi.value}
              </div>
              <div className="text-[10px] font-mono text-emerald-400">{kpi.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Roadmaps & Milestones */}
        <div className="lg:col-span-7 p-5 rounded-xl hud-glass border border-cyan-500/20 space-y-3">
          <h3 className="text-xs font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            STRATEGIK BOSQICHLAR (ROADMAP MILESTONES)
          </h3>

          <div className="space-y-2">
            {currentInfo.milestones.map((ms, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-black/40 border border-cyan-500/20 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2.5">
                  {ms.status === 'DONE' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {ms.status === 'IN_PROGRESS' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                  {ms.status === 'PLANNED' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  )}
                  <span className="text-slate-200">{ms.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[10px]">{ms.deadline}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      ms.status === 'DONE'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : ms.status === 'IN_PROGRESS'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {ms.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              onDispatchTask(`[${activeProject}] loyihasining navbatdagi bosqichini rejalashtir va tahlil qil`)
            }
            className="w-full py-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>JARVISga Yangi Bosqichni Rejalashtirishni Topshirish</span>
          </button>
        </div>

        {/* Right: Risk Matrix */}
        <div className="lg:col-span-5 p-5 rounded-xl hud-glass border border-cyan-500/20 space-y-3">
          <h3 className="text-xs font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            XAVF VA XATARLAR MATRITSIYASI (RISK MATRIX)
          </h3>

          <div className="space-y-2">
            {currentInfo.risks.map((riskItem, rIdx) => (
              <div
                key={rIdx}
                className="p-3 rounded-lg bg-black/40 border border-cyan-500/20 space-y-1 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-semibold">{riskItem.risk}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      riskItem.severity === 'HIGH'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : riskItem.severity === 'MED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {riskItem.severity}
                  </span>
                </div>
                <div className="text-[10px] text-cyan-400">
                  Oldini olish: {riskItem.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Weekly Executive Report Card if generated */}
      {weeklyReport && (
        <div className="p-5 rounded-xl hud-glass border border-cyan-400/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-tech font-bold text-cyan-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              HAFTALIK IJROCHI HISOBOT // TAYYOR
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(weeklyReport);
                alert("Hisobot nusxalandi!");
              }}
              className="px-3 py-1 rounded bg-black/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-cyan-200"
            >
              Nusxa olish
            </button>
          </div>

          <pre className="p-4 rounded-lg bg-black/80 border border-cyan-500/20 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
            {weeklyReport}
          </pre>
        </div>
      )}
    </div>
  );
};
