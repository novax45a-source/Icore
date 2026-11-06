import React, { useState } from 'react';
import {
  GraduationCap,
  Database,
  Bot,
  Play,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Terminal,
  Search,
  Check,
  Lock
} from 'lucide-react';
import { DatabaseOperationLevel } from '../core/ecosystemEngine';

interface IcsnControlViewProps {
  onDispatchChatCommand: (cmd: string) => void;
}

export const IcsnControlView: React.FC<IcsnControlViewProps> = ({ onDispatchChatCommand }) => {
  const [activeTab, setActiveTab] = useState<'DATABASE' | 'ASSISTANT' | 'MIGRATIONS'>('DATABASE');
  const [sqlInput, setSqlInput] = useState('SELECT full_name, target_country, gpa FROM students LIMIT 5;');
  const [selectedLevel, setSelectedLevel] = useState<DatabaseOperationLevel>('LEVEL_1_READ');
  const [founderApproval, setFounderApproval] = useState(false);
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Embedded Assistant State
  const [assistantModel, setAssistantModel] = useState('qwen3:4b');
  const [assistantStatus, setAssistantStatus] = useState<'ACTIVE' | 'STANDBY' | 'PAUSED'>('ACTIVE');

  const handleExecuteQuery = async () => {
    setIsExecuting(true);
    setQueryError(null);
    try {
      const res = await fetch('/api/ecosystem/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platformId: 'ICSN',
          sql: sqlInput,
          level: selectedLevel,
          isFounderApproved: founderApproval
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setQueryError(data.reason || data.error || 'So\'rov rad etildi');
        setQueryResults(null);
      } else {
        setQueryResults(data.rows);
      }
    } catch (err: any) {
      setQueryError(err.message || 'Tarmoq xatosi');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#030814]/70">
      {/* Top Banner */}
      <div className="p-5 rounded-xl hud-glass border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-mono text-cyan-400 tracking-wider flex items-center gap-2 mb-0.5">
              <span>CONNECTED ECOSYSTEM PLATFORM</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">100% RLS ENFORCED</span>
            </div>
            <h1 className="text-xl font-tech font-bold text-white tracking-wide">
              ICSN — INTERNATIONAL CAREER & STUDY NAVIGATOR
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Host: <span className="text-cyan-300">C:\Users\acer\projects\icsn-platform</span> | Supabase PostgreSQL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDispatchChatCommand("ICSN platformasi xavfsizlik va zaiflik auditini o'tkaz")}
            className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Sparkles className="w-4 h-4" />
            <span>JARVIS Auditini Ishga Tushirish</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-cyan-500/20 gap-2">
        <button
          onClick={() => setActiveTab('DATABASE')}
          className={`px-4 py-2.5 font-tech text-xs font-bold tracking-wider transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'DATABASE'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
              : 'border-transparent text-slate-400 hover:text-cyan-400'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>DATABASE INTELLIGENCE (LEVEL 1-4)</span>
        </button>

        <button
          onClick={() => setActiveTab('ASSISTANT')}
          className={`px-4 py-2.5 font-tech text-xs font-bold tracking-wider transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'ASSISTANT'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
              : 'border-transparent text-slate-400 hover:text-cyan-400'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>EMBEDDED ICSN ASSISTANT (NAVIGATOR AI)</span>
        </button>

        <button
          onClick={() => setActiveTab('MIGRATIONS')}
          className={`px-4 py-2.5 font-tech text-xs font-bold tracking-wider transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'MIGRATIONS'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
              : 'border-transparent text-slate-400 hover:text-cyan-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>SCHEMAS & MIGRATION QUEUE</span>
        </button>
      </div>

      {/* View Content */}
      {activeTab === 'DATABASE' && (
        <div className="space-y-4">
          {/* Query Console Card */}
          <div className="p-5 rounded-xl hud-glass border border-cyan-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20 text-xs font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Database className="w-4 h-4 text-cyan-400" />
                SUPABASE SQL QUERY RUNNER
              </span>

              {/* Operation Level Selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">OPERATION LEVEL:</span>
                <select
                  value={selectedLevel}
                  onChange={e => setSelectedLevel(e.target.value as DatabaseOperationLevel)}
                  className="px-2.5 py-1 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 font-bold focus:outline-none"
                >
                  <option value="LEVEL_1_READ">LEVEL 1 — READ (Auton.)</option>
                  <option value="LEVEL_2_PREPARE">LEVEL 2 — PREPARE (Draft)</option>
                  <option value="LEVEL_3_TEST">LEVEL 3 — TEST (Staging)</option>
                  <option value="LEVEL_4_PRODUCTION">LEVEL 4 — PRODUCTION (Strict)</option>
                </select>
              </div>
            </div>

            {/* SQL Input Area */}
            <div className="space-y-2">
              <textarea
                value={sqlInput}
                onChange={e => setSqlInput(e.target.value)}
                rows={3}
                placeholder="SQL so'rovi kiriting..."
                className="w-full p-3 rounded-lg bg-black/70 border border-cyan-500/30 font-mono text-xs text-cyan-200 focus:outline-none focus:border-cyan-400"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                {/* Level 4 Founder Approval Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="icsnFounderApproval"
                    checked={founderApproval}
                    onChange={e => setFounderApproval(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                  <label htmlFor="icsnFounderApproval" className="text-slate-300 cursor-pointer flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Founder Approval for Production (Zaxira tasdiqlangan)</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSqlInput('SELECT * FROM scholarships ORDER BY deadline ASC LIMIT 5;')}
                    className="px-2 py-1 rounded bg-black/40 border border-slate-700 text-[11px] text-slate-400 hover:text-cyan-300"
                  >
                    Preset: Scholarships
                  </button>
                  <button
                    onClick={handleExecuteQuery}
                    disabled={isExecuting}
                    className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isExecuting ? 'Bajarilmoqda...' : 'So\'rovni Ishlatish'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Error or Safety Rejection Output */}
            {queryError && (
              <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/40 text-red-300 text-xs font-mono flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <div>
                  <div className="font-bold">Xavfsizlik eshigi rad etdi (Security Gate Refusal):</div>
                  <div>{queryError}</div>
                </div>
              </div>
            )}

            {/* Result Table Output */}
            {queryResults && (
              <div className="pt-2">
                <div className="text-xs font-mono text-cyan-400 mb-2 flex items-center justify-between">
                  <span>NATIJALAR ({queryResults.length} ta yozuv):</span>
                  <span className="text-emerald-400 font-bold">Status: OK</span>
                </div>
                <div className="overflow-x-auto p-3 rounded-lg bg-black/80 border border-cyan-500/20 font-mono text-xs">
                  <pre className="text-slate-200">
                    <code>{JSON.stringify(queryResults, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded Assistant View */}
      {activeTab === 'ASSISTANT' && (
        <div className="p-5 rounded-xl hud-glass border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div>
              <h2 className="text-base font-tech font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                ICSN NAVIGATOR AI (EMBEDDED ASSISTANT)
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Talabalar bilan muloqot qiluvchi ajratilgan mustaqil sun'iy intellekt moduli.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {assistantStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-lg bg-black/40 border border-cyan-500/20 space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Biriktirilgan Model:</label>
                <select
                  value={assistantModel}
                  onChange={e => setAssistantModel(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 font-bold"
                >
                  <option value="qwen3:4b">qwen3:4b (Local Ollama - Fast & Private)</option>
                  <option value="qwen2.5-coder:3b">qwen2.5-coder:3b (Local Ollama)</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Cloud AI)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ma'lumotlar Chegarasi (Section 7.4):</label>
                <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 text-[11px]">
                  ✓ ENVO yoki Founder xususiy ma'lumotlariga kirish to'liq cheklangan.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-cyan-500/20 space-y-2">
              <span className="text-slate-400 font-bold">Ruxsat Berilgan Asboblar:</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5 text-cyan-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>search_universities (Global reytinglar)</span>
                </li>
                <li className="flex items-center gap-1.5 text-cyan-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>calculate_scholarship_match (Grant kalkulyatori)</span>
                </li>
                <li className="flex items-center gap-1.5 text-cyan-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>draft_sop_outline (Motivatsion xatlar)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Migrations View */}
      {activeTab === 'MIGRATIONS' && (
        <div className="p-5 rounded-xl hud-glass border border-cyan-500/30 space-y-3">
          <h2 className="text-sm font-tech font-bold text-cyan-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            DISCOVERED DATABASE SCHEMAS & PROPOSED MIGRATIONS
          </h2>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-black/40 border border-cyan-500/20 flex items-center justify-between">
              <div>
                <span className="text-white font-bold">Migration 001_add_scholarship_deadline_idx.sql</span>
                <div className="text-[10px] text-slate-400">CREATE INDEX idx_scholarships_deadline ON scholarships(deadline ASC);</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                LEVEL 2 PREPARED
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
