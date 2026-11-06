import React, { useState } from 'react';
import {
  Send,
  Mic,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  Terminal,
  Activity
} from 'lucide-react';
import { ArcReactorCore, CoreStatus } from '../components/ArcReactorCore';
import { ParsedTaskIntent } from '../core/intentParser';
import { REGISTERED_AGENTS } from '../core/agentOrchestrator';

interface OverviewViewProps {
  coreStatus: CoreStatus;
  setCoreStatus: (status: CoreStatus) => void;
  onSendCommand: (cmd: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  lastParsedIntent: ParsedTaskIntent | null;
  activeMissionsCount: number;
  systemMetrics: any;
  ollamaConnected: boolean;
  onOpenProjectWorkspace: (project: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  coreStatus,
  setCoreStatus,
  onSendCommand,
  isListening,
  onToggleListening,
  lastParsedIntent,
  activeMissionsCount,
  systemMetrics,
  ollamaConnected,
  onOpenProjectWorkspace
}) => {
  const [commandInput, setCommandInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    onSendCommand(commandInput);
    setCommandInput('');
  };

  const quickPrompts = [
    { label: "ENVO tahlili va reja", prompt: "ENVO loyihasining hozirgi holatini tahlil qil va yangi reja tuz" },
    { label: "ICSN xavfsizlik auditi", prompt: "ICSN tizimi xavfsizlik auditini o'tkaz va zaifliklarni aniqla" },
    { label: "VERON telemetriya hisoboti", prompt: "VERON apparat va logistika telemetriyasini tekshir" },
    { label: "JARVIS o'z-o'zini diagnostika", prompt: "JARVIS yadro resurslarini va Ollama modellarini sinovdan o'tkaz" }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Top Welcome / Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl hud-glass border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            STARK INDUSTRIES PROTOCOL • PERSONAL OPERATING INTELLIGENCE
          </div>
          <h1 className="text-xl md:text-2xl font-tech font-bold text-white tracking-wide flex items-center gap-2">
            XUSH KELIBSIZ, JANOB <span className="text-cyan-400 hud-glow">JARVIS TIZIMI TAYYOR</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Host: <span className="text-cyan-300">C:\Users\acer\jarvis-project\jarvis-kernel</span> | Intel i7-1355U | 15.7 GB RAM
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-cyan-500/30 text-xs font-mono">
            <div className="text-[10px] text-slate-400">FAOL AGENTLAR</div>
            <div className="text-cyan-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              10 SPECIALIZED SQUADS
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-cyan-500/30 text-xs font-mono">
            <div className="text-[10px] text-slate-400">OLLAMA ENGINE</div>
            <div className={`font-bold flex items-center gap-1 ${ollamaConnected ? 'text-emerald-400' : 'text-cyan-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${ollamaConnected ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
              {ollamaConnected ? 'ONLINE (11434)' : 'STANDBY (READY)'}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Center Section: 3D Holographic Arc Reactor Core & Direct Command Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left / Center: Holographic Core Visualization */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl hud-glass relative min-h-[360px] overflow-hidden">
          {/* Tech decorative grid background */}
          <div className="absolute inset-0 hud-scanline opacity-30 pointer-events-none" />
          <div className="absolute top-3 left-4 text-[10px] font-mono text-cyan-400/60 tracking-wider">
            CORE.TELEMETRY // ARC-REACTOR-MKVII
          </div>
          <div className="absolute top-3 right-4 text-[10px] font-mono text-cyan-400/60 tracking-wider">
            FREQ: 142.8 GHz
          </div>

          {/* 3D Core Canvas */}
          <ArcReactorCore
            status={coreStatus}
            onCoreClick={() => {
              const nextStatus: Record<CoreStatus, CoreStatus> = {
                IDLE: 'LISTENING',
                LISTENING: 'THINKING',
                THINKING: 'SPEAKING',
                SPEAKING: 'EXECUTING',
                EXECUTING: 'IDLE',
                ERROR: 'IDLE',
                OFFLINE: 'IDLE'
              };
              setCoreStatus(nextStatus[coreStatus] || 'IDLE');
            }}
          />

          {/* Core State description */}
          <div className="mt-4 text-center">
            <div className="text-sm font-tech font-semibold text-cyan-300 tracking-wider">
              {coreStatus === 'IDLE' && 'TIZIM SOKIN HOLATDA • BUYRUQ KUTILMOQDA'}
              {coreStatus === 'LISTENING' && 'ESHITILMOQDA • "HEY JARVIS" YOG\'DUSI FAOL'}
              {coreStatus === 'THINKING' && 'TAHLIL QILINMOQDA • STRATEGIYA TUZILMOQDA'}
              {coreStatus === 'SPEAKING' && 'JAVOB BERILMOQDA • OVOZLI ALOQA'}
              {coreStatus === 'EXECUTING' && 'AVTONOM IJRO QILINMOQDA • AGENTLAR ISHDA'}
              {coreStatus === 'ERROR' && 'OGOHLANTIRISH • DIQQAT TALAB QILINADI'}
              {coreStatus === 'OFFLINE' && 'STANDBY • TIZIM KUTISH REJIMIDA'}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              Holatni almashtirish uchun Markaziy Yadroni bosing yoki ovozli buyruq bering
            </div>
          </div>
        </div>

        {/* Right: Direct Command Terminal & Execution Plan */}
        <div className="lg:col-span-6 space-y-4">
          {/* Command Input Box */}
          <div className="p-4 rounded-xl hud-glass border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                INTELLIGENT COMMAND INTERFACE
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                O'zbek / English / Русский
              </span>
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={commandInput}
                onChange={e => setCommandInput(e.target.value)}
                placeholder="Buyruq bering (masalan: 'ENVO loyihasini tahlil qil va reja tuz')..."
                className="w-full pl-4 pr-24 py-3 rounded-lg bg-black/60 border border-cyan-500/30 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={onToggleListening}
                  className={`p-2 rounded-md transition-all ${
                    isListening
                      ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.8)]'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40'
                  }`}
                  title={isListening ? 'Eshitishni to\'xtatish' : 'Ovozli kiritish'}
                  aria-label="Microphone input"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!commandInput.trim()}
                  className="p-2 rounded-md bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold transition-all shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                  title="Buyruqni jo'natish"
                  aria-label="Send command"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendCommand(qp.prompt)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/20 text-cyan-300 hover:text-cyan-200 transition-all text-left flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{qp.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Structured Execution Lifecycle Panel (RECEIVE -> UNDERSTAND -> PLAN -> SELECT TOOLS -> EXECUTE -> VERIFY -> REPORT) */}
          <div className="p-4 rounded-xl hud-glass border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-3">
              <span className="flex items-center gap-1.5 font-bold tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                LIFECYCLE PIPELINE (7 PHASES)
              </span>
              <span className="text-[10px] text-slate-400">
                Target: {lastParsedIntent ? `[${lastParsedIntent.projectId}]` : '[GENERAL]'}
              </span>
            </div>

            <div className="space-y-1.5">
              {(lastParsedIntent?.lifecyclePlan || [
                { phase: 'RECEIVE', title: 'Command Registered', detail: 'Audio/Text stream ready in kernel', completed: true },
                { phase: 'UNDERSTAND', title: 'Intent Classification', detail: 'Zero-latency parsing and safety check', completed: true },
                { phase: 'PLAN', title: 'Decomposition Strategy', detail: 'Resource-aware task plan generated', completed: coreStatus === 'THINKING' || coreStatus === 'EXECUTING' },
                { phase: 'SELECT_TOOLS', title: 'Agent Squad Assignment', detail: 'Allocating Developer, Research & Supervisor', completed: coreStatus === 'EXECUTING' },
                { phase: 'EXECUTE', title: 'Autonomous Execution', detail: 'Subtasks running under memory guardrails', completed: false },
                { phase: 'VERIFY', title: 'Supervisor Verification', detail: 'Consistency and quality validated', completed: false },
                { phase: 'REPORT', title: 'Executive Briefing', detail: 'Synthesized findings ready for Founder', completed: false }
              ]).map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    step.completed
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                      : 'bg-black/30 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {step.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className="font-semibold">{step.phase}:</span>
                    <span className="text-slate-300">{step.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    {step.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Founder Project Matrix: VERON, ICSN, ENVO, JARVIS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-tech font-bold text-cyan-300 tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            FOUNDER ENTERPRISE INITIATIVES
          </div>
          <span className="text-xs font-mono text-slate-400">
            Dedicated Project Memory Partitions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* VERON */}
          <div
            onClick={() => onOpenProjectWorkspace('VERON')}
            className="p-4 rounded-xl hud-glass-interactive cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-tech font-bold text-base text-cyan-300 group-hover:text-cyan-200">
                VERON
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono line-clamp-2 mb-3">
              Aqlli apparat va korporativ logistika infratuzilmasini avtomatlashtirish.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 pt-2 border-t border-cyan-500/20">
              <span>Telemetry: 99.4%</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* ICSN */}
          <div
            onClick={() => onOpenProjectWorkspace('ICSN')}
            className="p-4 rounded-xl hud-glass-interactive cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-tech font-bold text-base text-cyan-300 group-hover:text-cyan-200">
                ICSN
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold">
                SECURED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono line-clamp-2 mb-3">
              Information & Cyber Security Network. Zero-trust protokoli va zaiflik auditi.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 pt-2 border-t border-cyan-500/20">
              <span>Guardrails: ON</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* ENVO */}
          <div
            onClick={() => onOpenProjectWorkspace('ENVO')}
            className="p-4 rounded-xl hud-glass-interactive cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-tech font-bold text-base text-cyan-300 group-hover:text-cyan-200">
                ENVO
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 border border-blue-500/40 text-blue-300 font-semibold">
                MODELING
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono line-clamp-2 mb-3">
              Yashil energetika va atrof-muhit barqarorligini tahlil qilish tizimi.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 pt-2 border-t border-cyan-500/20">
              <span>Optimization: v2.4</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* JARVIS */}
          <div
            onClick={() => onOpenProjectWorkspace('JARVIS')}
            className="p-4 rounded-xl hud-glass-interactive cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-tech font-bold text-base text-cyan-300 group-hover:text-cyan-200">
                JARVIS CORE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 border border-purple-500/40 text-purple-300 font-semibold">
                KERNEL v3.5
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono line-clamp-2 mb-3">
              Avtonom shaxsiy sun'iy intellekt tizimi, xotira va agentlar orkestratsiyasi.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 pt-2 border-t border-cyan-500/20">
              <span>Qwen3 + Qwen2.5</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
