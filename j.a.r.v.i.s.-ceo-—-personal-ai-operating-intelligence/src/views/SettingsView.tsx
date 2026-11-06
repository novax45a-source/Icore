import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  Volume2,
  Globe,
  User,
  HardDrive,
  Save,
  Check,
  AlertTriangle,
  Lock,
  Cpu
} from 'lucide-react';

interface SettingsViewProps {
  language: 'uz' | 'en' | 'ru';
  onSelectLanguage: (lang: 'uz' | 'en' | 'ru') => void;
  wakeWordActive: boolean;
  onToggleWakeWord: (val: boolean) => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  onSelectLanguage,
  wakeWordActive,
  onToggleWakeWord,
  autoSpeak,
  onToggleAutoSpeak
}) => {
  const [speechRate, setSpeechRate] = useState(1.05);
  const [requireConfirmationForDestructive, setRequireConfirmationForDestructive] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#030814]/70">
      {/* Top Banner */}
      <div className="p-4 rounded-xl hud-glass border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4 text-cyan-400" />
            OPERATING PARAMETERS & SECURITY GUARDRAILS
          </div>
          <h1 className="text-xl font-tech font-bold text-white tracking-wide">
            JARVIS KERNEL CONFIGURATION
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Founder Identity • Voice Intelligence • Security Levels • Local Environment
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saqlandi' : 'Sozlamalarni Saqlash'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Founder Profile & Identity */}
        <div className="p-5 rounded-xl hud-glass border border-cyan-500/20 space-y-4">
          <h2 className="text-xs font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" />
            FOUNDER IDENTIFICATION (ASOSCHI PROFILI)
          </h2>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Founder Email:</label>
              <input
                type="text"
                disabled
                value="princess0481128@gmail.com"
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/20 text-cyan-300 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Tizim nomi (Product Identity):</label>
              <input
                type="text"
                disabled
                value="J.A.R.V.I.S. (Just A Rather Very Intelligent System)"
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/20 text-white font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Asosiy til (Default Language):</label>
              <select
                value={language}
                onChange={e => onSelectLanguage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-300 focus:outline-none"
              >
                <option value="uz">O'zbek tili (Uzbek - Birlamchi)</option>
                <option value="en">English (English)</option>
                <option value="ru">Русский (Russian)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Voice & Acoustic Engine */}
        <div className="p-5 rounded-xl hud-glass border border-cyan-500/20 space-y-4">
          <h2 className="text-xs font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            VOICE INTELLIGENCE & SPEECH SYNTHESIS
          </h2>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-cyan-500/20">
              <div>
                <div className="text-slate-200 font-semibold">Wake-Word faolligi</div>
                <div className="text-[10px] text-slate-400">"Hey JARVIS" yoki "Salom JARVIS" ovozli chaqiruv</div>
              </div>
              <input
                type="checkbox"
                checked={wakeWordActive}
                onChange={e => onToggleWakeWord(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-cyan-500/20">
              <div>
                <div className="text-slate-200 font-semibold">Javoblarni ovoz bilan o'qish</div>
                <div className="text-[10px] text-slate-400">JARVIS matnli javoblarini avtomatik ovozda eshittirish</div>
              </div>
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={e => onToggleAutoSpeak(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Ovoz tezligi (Speech Rate):</span>
                <span className="text-cyan-300 font-bold">{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={speechRate}
                onChange={e => setSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Security & Autonomy Controls */}
        <div className="p-5 rounded-xl hud-glass border border-cyan-500/20 space-y-4">
          <h2 className="text-xs font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4" />
            AUTONOMY & PERMISSION MATRIX (SECTION 18)
          </h2>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-cyan-500/20">
              <div>
                <div className="text-slate-200 font-semibold">Xavfli amallarni tasdiqlash</div>
                <div className="text-[10px] text-slate-400">Fayllarni o'chirish yoki tizim kodlarini o'zgartirishdan oldin Founder roziligini so'rash</div>
              </div>
              <input
                type="checkbox"
                checked={requireConfirmationForDestructive}
                onChange={e => setRequireConfirmationForDestructive(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Avtonom operatsiyalarga ruxsat berilgan:
              </div>
              <div className="text-[10px] text-emerald-400/80">
                Internet qidiruvlari, hujjatlarni tahlil qilish, loyiha xotirasini yangilash, xavfsiz testlarni yurgizish va hisobotlar tayyorlash.
              </div>
            </div>
          </div>
        </div>

        {/* Host Machine Profile */}
        <div className="p-5 rounded-xl hud-glass border border-cyan-500/20 space-y-4">
          <h2 className="text-xs font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            HOST ENVIRONMENT (SECTION 1)
          </h2>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="p-2.5 rounded bg-black/40 border border-cyan-500/10 flex justify-between">
              <span className="text-slate-400">Host Path:</span>
              <span className="text-cyan-300 font-bold">C:\Users\acer\jarvis-project\jarvis-kernel</span>
            </div>

            <div className="p-2.5 rounded bg-black/40 border border-cyan-500/10 flex justify-between">
              <span className="text-slate-400">Protsessor:</span>
              <span className="text-cyan-300">Intel Core i7-1355U (10C/12T)</span>
            </div>

            <div className="p-2.5 rounded bg-black/40 border border-cyan-500/10 flex justify-between">
              <span className="text-slate-400">Operativ xotira (RAM):</span>
              <span className="text-cyan-300">15.7 GB</span>
            </div>

            <div className="p-2.5 rounded bg-black/40 border border-cyan-500/10 flex justify-between">
              <span className="text-slate-400">Lokal AI Modellar:</span>
              <span className="text-emerald-400 font-bold">qwen2.5-coder:3b, qwen3:4b</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 10: Continuous Self-Improvement Engine */}
      <div className="p-5 rounded-xl hud-glass border border-cyan-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cyan-500/20">
          <div>
            <h2 className="text-xs font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              CONTINUOUS SELF-IMPROVEMENT ENGINE (SECTION 10)
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              Avtomatlashtirilgan o'z-o'zini baholash va takomillashtirish takliflari. Xavfsizlik siyosati va ruxsatlar hech qachon o'zgartirilmaydi.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
            EVALUATION CYCLE: ACTIVE
          </span>
        </div>

        {/* 6 Benchmark Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { cat: 'REASONING', score: 94, sub: 'Qwen3 + Gemini' },
            { cat: 'CODE INTEL', score: 92, sub: 'Qwen2.5-Coder' },
            { cat: 'VOICE QUALITY', score: 89, sub: 'Audio Normalization' },
            { cat: 'MEMORY RECALL', score: 96, sub: 'Vector Partitions' },
            { cat: 'SECURITY', score: 99, sub: 'Zero-Trust Gate' },
            { cat: 'HARDWARE EFF', score: 95, sub: 'Intel i7-1355U' }
          ].map((dim, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-black/50 border border-cyan-500/20 text-center">
              <div className="text-[10px] font-mono text-slate-400">{dim.cat}</div>
              <div className="text-xl font-tech font-bold text-cyan-300 mt-0.5">{dim.score}%</div>
              <div className="text-[9px] font-mono text-emerald-400 truncate">{dim.sub}</div>
            </div>
          ))}
        </div>

        {/* Improvement Proposals */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono text-slate-300 font-bold">Takomillashtirish Takliflari (Proposals):</span>
          {[
            {
              id: 'PROP-001',
              title: 'PostgreSQL Database Query Connection Pooling for ICSN & ENVO',
              delta: '+35% query speed on Supabase',
              status: 'APPLIED'
            },
            {
              id: 'PROP-002',
              title: 'Adaptive Quantization Memory Eviction on Ollama Models',
              delta: '+1.95 GB free RAM during non-coding sessions',
              status: 'TESTED_IN_SANDBOX'
            },
            {
              id: 'PROP-003',
              title: 'ICSN Embedded Assistant Scholarship Matching Algorithm v2',
              delta: '+28% matching relevance for student profiles',
              status: 'DRAFTED'
            }
          ].map((prop, pIdx) => (
            <div
              key={pIdx}
              className="p-3 rounded-lg bg-black/40 border border-cyan-500/20 flex items-center justify-between text-xs font-mono"
            >
              <div>
                <div className="text-white font-semibold flex items-center gap-2">
                  <span>{prop.title}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    {prop.id}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Kutilayotgan samara: {prop.delta}</div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  prop.status === 'APPLIED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                {prop.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
