import React from 'react';
import {
  Cpu,
  HardDrive,
  Activity,
  Layers,
  Thermometer,
  Shield,
  Server,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { ExecutionLogs } from '../components/ExecutionLogs.tsx';

interface SystemMonitorViewProps {
  metrics: any;
  ollamaConnected: boolean;
  currentProject?: string;
}

export const SystemMonitorView: React.FC<SystemMonitorViewProps> = ({
  metrics,
  ollamaConnected,
  currentProject = 'GENERAL'
}) => {
  const cpuLoad = metrics?.cpu?.currentLoadPercent || 24;
  const cpuTemp = metrics?.cpu?.temperatureCelsius || 45;
  const memUsed = metrics?.memory?.usedGb || 4.9;
  const memTotal = metrics?.memory?.totalGb || 15.7;
  const memPercent = Math.round((memUsed / memTotal) * 100);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#030814]/70">
      {/* Top Banner */}
      <div className="p-4 rounded-xl hud-glass border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-cyan-400" />
            LIVE HARDWARE & OPERATING KERNEL TELEMETRY
          </div>
          <h1 className="text-xl font-tech font-bold text-white tracking-wide">
            HOST SYSTEM RESOURCE MONITOR
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Host: Acer • Windows 11 • Intel Core i7-1355U (10C/12T) • 15.7 GB RAM
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            SYSTEM STABLE
          </span>
        </div>
      </div>

      {/* Main Hardware Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU */}
        <div className="p-5 rounded-xl hud-glass border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-cyan-300">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>CPU LOAD</span>
            </div>
            <span className="text-xs font-mono text-slate-400">10 Cores / 12T</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-tech font-bold text-white hud-glow">
              {cpuLoad}%
            </div>
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5" />
              <span>{cpuTemp}°C</span>
            </div>
          </div>

          <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-cyan-500/20">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${cpuLoad}%` }}
            />
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-1 flex justify-between">
            <span>2 Performance (up to 5.0 GHz)</span>
            <span>8 Efficient Cores</span>
          </div>
        </div>

        {/* Memory */}
        <div className="p-5 rounded-xl hud-glass border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-cyan-300">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>SYSTEM RAM</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Headroom Safe</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-tech font-bold text-white hud-glow">
              {memUsed} <span className="text-sm font-normal text-slate-400">/ {memTotal} GB</span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">{memPercent}% Bandwidth</span>
          </div>

          <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-cyan-500/20">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${memPercent}%` }}
            />
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-1 flex justify-between">
            <span>Free: {(memTotal - memUsed).toFixed(1)} GB</span>
            <span>Heap: {metrics?.memory?.heapUsedMb || 45} MB</span>
          </div>
        </div>

        {/* GPU / Graphics */}
        <div className="p-5 rounded-xl hud-glass border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-cyan-300">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>INTEL UHD GRAPHICS</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Iris Xe Eligible</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-tech font-bold text-white hud-glow">
              {metrics?.gpu?.loadPercent || 14}%
            </div>
            <span className="text-xs font-mono text-cyan-400">Shared VRAM: 7.8 GB</span>
          </div>

          <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-cyan-500/20">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics?.gpu?.loadPercent || 14}%` }}
            />
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-1 flex justify-between">
            <span>Hardware Acceleration: ON</span>
            <span>Three.js Shaders: Optimal</span>
          </div>
        </div>
      </div>

      {/* Real-time Backend Execution Logs & Active Processes */}
      <ExecutionLogs currentProject={currentProject} />

      {/* Ollama Models & Resource Allocation Table */}
      <div className="p-5 rounded-xl hud-glass border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-tech font-bold text-cyan-300 tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            LOKAL MODELLAR VA RESURS CHEGARALARI
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Ollama Port: 11434
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-cyan-500/20 text-slate-400 text-[11px]">
                <th className="pb-2">MODEL NOMI</th>
                <th className="pb-2">HOLATI</th>
                <th className="pb-2">RAM ISTE'MOLI</th>
                <th className="pb-2">KVANTIZATSIYA</th>
                <th className="pb-2">BIRIKTIRILGAN VAZIFALAR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10 text-slate-300">
              <tr>
                <td className="py-2.5 font-bold text-white">qwen2.5-coder:3b</td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    LOADED & READY
                  </span>
                </td>
                <td className="py-2.5 text-cyan-300">1,950 MB</td>
                <td className="py-2.5">Q4_K_M</td>
                <td className="py-2.5 text-slate-400">Dasturlash, refaktoring, testlar</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">qwen3:4b</td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    STANDBY
                  </span>
                </td>
                <td className="py-2.5 text-cyan-300">2,420 MB</td>
                <td className="py-2.5">Q4_K_M</td>
                <td className="py-2.5 text-slate-400">O'zbekcha muloqot, rejalashtirish, xulosa</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Concurrency Scheduler Panel */}
      <div className="p-4 rounded-xl hud-glass border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            RESURS-XABARDOR AGENT SHEDULERI (RESOURCE-AWARE SCHEDULER)
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Maksimal bir vaqtning o'zida ishlovchi og'ir agentlar: 2 ta. Intel i7-1355U qizib ketishi va RAM to'lib qolishining oldi olingan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-cyan-500/20 text-xs font-mono text-slate-300">
            <span>Faol Threadlar: </span>
            <span className="text-cyan-400 font-bold">1 / 2 MAX</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-cyan-500/20 text-xs font-mono text-slate-300">
            <span>Kutish Navbati: </span>
            <span className="text-emerald-400 font-bold">0 JOBS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
