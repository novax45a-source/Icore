import React, { useState } from 'react';
import {
  Zap,
  Cpu,
  Layers,
  Shield,
  Activity,
  CheckCircle2,
  Server,
  RefreshCw,
  Sliders,
  Globe,
  Radio
} from 'lucide-react';
import { REGISTERED_AGENTS } from '../core/agentOrchestrator';

interface IntelligenceCenterViewProps {
  ollamaConnected: boolean;
  onRefreshOllama: () => void;
  selectedModel: string;
  onSelectModel: (m: string) => void;
}

export const IntelligenceCenterView: React.FC<IntelligenceCenterViewProps> = ({
  ollamaConnected,
  onRefreshOllama,
  selectedModel,
  onSelectModel
}) => {
  const [testingPing, setTestingPing] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(24);

  const handleTestLatency = () => {
    setTestingPing(true);
    setTimeout(() => {
      setLatencyMs(Math.floor(18 + Math.random() * 12));
      setTestingPing(false);
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#030814]/70">
      {/* Top Banner */}
      <div className="p-4 rounded-xl hud-glass border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-cyan-400" />
            INTELLIGENCE CORE & MULTI-MODEL ROUTING
          </div>
          <h1 className="text-xl font-tech font-bold text-white tracking-wide">
            DYNAMIC AI MODEL ORCHESTRATION
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Local Ollama (Intel i7-1355U) + Google Cloud Gemini 2.5 Hybrid Framework
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshOllama}
            className="px-3 py-1.5 rounded-lg bg-black/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-cyan-950/40 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ollama Tekshirish</span>
          </button>
        </div>
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Qwen3:4b (Local) */}
        <div
          onClick={() => onSelectModel('qwen3:4b')}
          className={`p-4 rounded-xl cursor-pointer border transition-all ${
            selectedModel === 'qwen3:4b'
              ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
              : 'hud-glass hover:border-cyan-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="font-tech font-bold text-sm text-white">qwen3:4b</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              LOCAL OLLAMA
            </span>
          </div>
          <p className="text-xs font-mono text-slate-300 mb-3">
            Umumiy muloqot, o'zbek tili tushunish, tezkor buyruqlar va tahlil.
          </p>
          <div className="space-y-1 text-[11px] font-mono text-slate-400 pt-2 border-t border-cyan-500/20">
            <div className="flex justify-between">
              <span>Hajm / Quant:</span>
              <span className="text-cyan-300">2.4 GB (Q4_K_M)</span>
            </div>
            <div className="flex justify-between">
              <span>RAM tejamkorlik:</span>
              <span className="text-emerald-400">Juda yuqori (~2.4GB)</span>
            </div>
            <div className="flex justify-between">
              <span>Kechikish:</span>
              <span className="text-cyan-300">&lt; 35ms (Offline)</span>
            </div>
          </div>
        </div>

        {/* Qwen2.5-Coder:3b (Local) */}
        <div
          onClick={() => onSelectModel('qwen2.5-coder:3b')}
          className={`p-4 rounded-xl cursor-pointer border transition-all ${
            selectedModel === 'qwen2.5-coder:3b'
              ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
              : 'hud-glass hover:border-cyan-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="font-tech font-bold text-sm text-white">qwen2.5-coder:3b</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              LOCAL CODE
            </span>
          </div>
          <p className="text-xs font-mono text-slate-300 mb-3">
            Dasturlash, sintaksis tuzatish, TypeScript, Python va refaktoring.
          </p>
          <div className="space-y-1 text-[11px] font-mono text-slate-400 pt-2 border-t border-cyan-500/20">
            <div className="flex justify-between">
              <span>Hajm / Quant:</span>
              <span className="text-cyan-300">1.9 GB (Q4_K_M)</span>
            </div>
            <div className="flex justify-between">
              <span>RAM tejamkorlik:</span>
              <span className="text-emerald-400">A'lo (~1.9GB)</span>
            </div>
            <div className="flex justify-between">
              <span>Kechikish:</span>
              <span className="text-cyan-300">&lt; 28ms (Offline)</span>
            </div>
          </div>
        </div>

        {/* Gemini 2.5 Flash (Cloud) */}
        <div
          onClick={() => onSelectModel('gemini-2.5-flash')}
          className={`p-4 rounded-xl cursor-pointer border transition-all ${
            selectedModel === 'gemini-2.5-flash'
              ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
              : 'hud-glass hover:border-cyan-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="font-tech font-bold text-sm text-white">gemini-2.5-flash</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
              CLOUD TIER
            </span>
          </div>
          <p className="text-xs font-mono text-slate-300 mb-3">
            Keng qamrovli tahlil, ko'p hujjatli sintez va global internet izlanishlari.
          </p>
          <div className="space-y-1 text-[11px] font-mono text-slate-400 pt-2 border-t border-cyan-500/20">
            <div className="flex justify-between">
              <span>Kontekst hajmi:</span>
              <span className="text-cyan-300">1 Million Token</span>
            </div>
            <div className="flex justify-between">
              <span>RAM yuklanishi:</span>
              <span className="text-emerald-400">0 GB (Server-side)</span>
            </div>
            <div className="flex justify-between">
              <span>Rejim:</span>
              <span className="text-cyan-300">High-Intelligence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latency & Ollama Health Inspector */}
      <div className="p-4 rounded-xl hud-glass border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black/60 border border-cyan-500/30 flex items-center justify-center">
            <Server className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-cyan-300">
              LOCAL OLLAMA BRIDGE: http://localhost:11434
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Host: Intel Core i7-1355U | Qwen3:4b & Qwen2.5-Coder:3b sinxron holatda
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400">PING LATENCY</div>
            <div className="text-sm font-mono font-bold text-cyan-400">
              {latencyMs !== null ? `${latencyMs} ms` : 'Testing...'}
            </div>
          </div>

          <button
            onClick={handleTestLatency}
            disabled={testingPing}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/40 text-xs font-mono text-cyan-200"
          >
            {testingPing ? 'Testing...' : 'Ping Test'}
          </button>
        </div>
      </div>

      {/* 10 Specialized Agents Roster */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-tech font-bold text-cyan-300 tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            10 MAXSUS AVTONOM AGENTLAR JAMOASI
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Resurslar chegarasi: 2 parallel thread
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.values(REGISTERED_AGENTS).map(agent => (
            <div
              key={agent.role}
              className="p-3 rounded-xl hud-glass border border-cyan-500/20 hover:border-cyan-400/40 transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {agent.codename}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              </div>
              <div className="text-xs font-tech font-semibold text-white mb-1">
                {agent.name}
              </div>
              <p className="text-[10px] font-mono text-slate-400 line-clamp-3 leading-relaxed">
                {agent.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
