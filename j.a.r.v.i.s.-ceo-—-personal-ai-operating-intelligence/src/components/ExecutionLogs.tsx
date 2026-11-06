/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Activity,
  Play,
  Pause,
  Trash2,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Cpu,
  RefreshCw,
  Clock,
  Layers,
  Zap,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  ExecutionLogEntry,
  ActiveProcess,
  LogCategory,
  LogLevel
} from '../core/executionLogger.ts';

interface ExecutionLogsProps {
  currentProject?: string;
}

export const ExecutionLogs: React.FC<ExecutionLogsProps> = ({ currentProject = 'GENERAL' }) => {
  const [logs, setLogs] = useState<ExecutionLogEntry[]>([]);
  const [processes, setProcesses] = useState<ActiveProcess[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    processLogs: 0,
    apiCalls: 0,
    agentActivities: 0,
    errors: 0,
    warnings: 0,
    activeProcessesCount: 0
  });

  const [isPaused, setIsPaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'ALL'>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'STREAM' | 'PROCESSES'>('STREAM');
  const [selectedLog, setSelectedLog] = useState<ExecutionLogEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const streamEndRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
      if (selectedLevel !== 'ALL') params.set('level', selectedLevel);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('limit', '80');

      const res = await fetch(`/api/system/logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setProcesses(data.activeProcesses || []);
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch execution logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedCategory, selectedLevel, searchQuery]);

  // Real-time polling timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      fetchLogs();
    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused, selectedCategory, selectedLevel, searchQuery]);

  useEffect(() => {
    if (autoScroll && activeTab === 'STREAM') {
      streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll, activeTab]);

  const handleClear = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/system/logs/clear', { method: 'POST' });
      await fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulate = async () => {
    try {
      const actions = [
        { action: 'MEMORY_SYNCHRONIZATION', details: 'Vector memory embedded 14 new nodes for ICSN partition', cat: 'AGENT_ACTIVITY' },
        { action: 'QWEN_INFERENCE_CYCLE', details: 'qwen2.5-coder:3b processed AST parsing in 34ms', cat: 'PROCESS' },
        { action: 'RLS_SECURITY_AUDIT', details: 'Verified zero leaks between ICSN and ENVO schemas', cat: 'SECURITY_GATE' },
        { action: 'POST /api/chat', details: 'Inbound Founder voice instruction processed', cat: 'API_CALL' }
      ];
      const random = actions[Math.floor(Math.random() * actions.length)];

      await fetch('/api/system/logs/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: random.cat,
          action: random.action,
          details: random.details,
          level: 'SUCCESS',
          project: currentProject
        })
      });
      await fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryBadge = (category: LogCategory) => {
    switch (category) {
      case 'PROCESS':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'API_CALL':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'AGENT_ACTIVITY':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'SECURITY_GATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'SYSTEM':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'WARN':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'ERROR':
        return <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />;
      case 'INFO':
      default:
        return <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="p-5 rounded-xl hud-glass border border-cyan-500/30 space-y-4">
      {/* Component Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-tech font-bold text-cyan-300 tracking-wider">
              REAL-TIME EXECUTION LOGS & ACTIVE PROCESSES
            </h2>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`} />
              {isPaused ? 'PAUSED' : 'LIVE'}
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Backend state stream: In-flight processes, API requests, and autonomous agent squad dispatches.
          </p>
        </div>

        {/* Tab & Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-black/60 rounded-lg p-0.5 border border-cyan-500/20">
            <button
              onClick={() => setActiveTab('STREAM')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'STREAM'
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Log Stream ({logs.length})
            </button>
            <button
              onClick={() => setActiveTab('PROCESSES')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'PROCESSES'
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Processes ({processes.length})
            </button>
          </div>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
            className="p-1.5 rounded-lg bg-black/50 border border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Trigger Event Simulator */}
          <button
            onClick={handleSimulate}
            title="Simulate Event"
            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate</span>
          </button>

          {/* Refresh */}
          <button
            onClick={fetchLogs}
            title="Manual refresh"
            className="p-1.5 rounded-lg bg-black/50 border border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            disabled={isLoading}
            title="Clear log buffer"
            className="p-1.5 rounded-lg bg-black/50 border border-red-500/30 text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-black/40 border border-cyan-500/10 flex flex-col">
          <span className="text-[10px] text-slate-400">TOTAL LOGS</span>
          <span className="text-sm font-bold text-white">{summary.total}</span>
        </div>
        <div className="p-2 rounded bg-black/40 border border-cyan-500/10 flex flex-col">
          <span className="text-[10px] text-blue-400">PROCESS RUNS</span>
          <span className="text-sm font-bold text-blue-300">{summary.processLogs}</span>
        </div>
        <div className="p-2 rounded bg-black/40 border border-cyan-500/10 flex flex-col">
          <span className="text-[10px] text-cyan-400">API REQUESTS</span>
          <span className="text-sm font-bold text-cyan-300">{summary.apiCalls}</span>
        </div>
        <div className="p-2 rounded bg-black/40 border border-cyan-500/10 flex flex-col">
          <span className="text-[10px] text-purple-400">AGENT ACTIONS</span>
          <span className="text-sm font-bold text-purple-300">{summary.agentActivities}</span>
        </div>
        <div className="p-2 rounded bg-black/40 border border-cyan-500/10 flex flex-col">
          <span className="text-[10px] text-emerald-400">ACTIVE PROCS</span>
          <span className="text-sm font-bold text-emerald-300">{summary.activeProcessesCount}</span>
        </div>
        <div className="p-2 rounded bg-black/40 border border-cyan-500/10 flex flex-col">
          <span className="text-[10px] text-amber-400">ALERTS / WARN</span>
          <span className="text-sm font-bold text-amber-300">{summary.warnings + summary.errors}</span>
        </div>
      </div>

      {/* Filter and Search Toolbar (Stream View Only) */}
      {activeTab === 'STREAM' && (
        <div className="flex flex-col md:flex-row gap-2 pt-1">
          {/* Category Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {(['ALL', 'PROCESS', 'API_CALL', 'AGENT_ACTIVITY', 'SECURITY_GATE', 'SYSTEM'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 bg-black/30 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter logs by action, source, endpoint..."
                className="w-full pl-8 pr-3 py-1 bg-black/60 border border-cyan-500/20 rounded text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Auto-scroll toggle */}
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors ${
                autoScroll
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  : 'bg-black/40 text-slate-500 border-slate-700'
              }`}
            >
              Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      {activeTab === 'STREAM' ? (
        <div className="h-72 overflow-y-auto rounded-lg bg-black/80 border border-cyan-500/20 p-2 font-mono text-xs space-y-1 divide-y divide-cyan-500/5">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-8">
              <Terminal className="w-6 h-6 text-slate-600 mb-2" />
              <span>No execution logs match the selected filter criteria.</span>
            </div>
          ) : (
            logs.map(log => {
              const date = new Date(log.timestamp);
              const timeStr = date.toTimeString().split(' ')[0] + '.' + String(date.getMilliseconds()).padStart(3, '0');

              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="pt-1.5 pb-1 px-2 rounded hover:bg-cyan-950/30 cursor-pointer transition-colors flex items-start gap-2.5 group"
                >
                  <span className="text-[10px] text-slate-500 shrink-0 font-mono pt-0.5">
                    {timeStr}
                  </span>

                  {getLevelIcon(log.level)}

                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] border font-bold uppercase tracking-wider shrink-0 ${getCategoryBadge(
                      log.category
                    )}`}
                  >
                    {log.category}
                  </span>

                  <span className="text-cyan-400 font-bold shrink-0 text-[11px]">
                    [{log.source}]
                  </span>

                  <span className="text-white font-medium shrink-0">
                    {log.action}
                  </span>

                  <span className="text-slate-300 truncate flex-1">
                    — {log.details}
                  </span>

                  {log.project && log.project !== 'GENERAL' && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                      {log.project}
                    </span>
                  )}

                  {log.latencyMs !== undefined && (
                    <span className="text-[10px] text-cyan-400/80 shrink-0">
                      {log.latencyMs}ms
                    </span>
                  )}
                </div>
              );
            })
          )}
          <div ref={streamEndRef} />
        </div>
      ) : (
        /* Active Processes Table */
        <div className="overflow-x-auto rounded-lg bg-black/80 border border-cyan-500/20">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-cyan-500/20 text-slate-400 text-[11px] bg-cyan-950/20">
                <th className="py-2.5 px-3">PID</th>
                <th className="py-2.5 px-3">PROCESS / SERVICE</th>
                <th className="py-2.5 px-3">COMMAND LINE / ROLE</th>
                <th className="py-2.5 px-3">CPU %</th>
                <th className="py-2.5 px-3">RAM (MB)</th>
                <th className="py-2.5 px-3">ASSIGNED CORE</th>
                <th className="py-2.5 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10 text-slate-300">
              {processes.map(proc => (
                <tr key={proc.pid} className="hover:bg-cyan-950/20 transition-colors">
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">{proc.pid}</td>
                  <td className="py-2.5 px-3 text-white font-medium flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{proc.name}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] max-w-xs truncate">
                    {proc.command}
                  </td>
                  <td className="py-2.5 px-3 text-cyan-300">{proc.cpuPercent}%</td>
                  <td className="py-2.5 px-3 text-cyan-300">{proc.memoryMb} MB</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{proc.assignedCore}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] border font-bold ${
                        proc.status === 'RUNNING'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : proc.status === 'WAITING'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-700 text-slate-300 border-slate-600'
                      }`}
                    >
                      {proc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Log Detail Modal / Drawer */}
      {selectedLog && (
        <div className="p-3.5 rounded-lg bg-black/90 border border-cyan-500/40 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">LOG RECORD INSPECTOR:</span>
              <span className="text-white">{selectedLog.id}</span>
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
            >
              Close [ESC]
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-300 text-[11px]">
            <div>
              <span className="text-slate-500 block">TIMESTAMP</span>
              <span>{selectedLog.timestamp}</span>
            </div>
            <div>
              <span className="text-slate-500 block">CATEGORY / LEVEL</span>
              <span>{selectedLog.category} / {selectedLog.level}</span>
            </div>
            <div>
              <span className="text-slate-500 block">SOURCE SUBSYSTEM</span>
              <span className="text-cyan-300">{selectedLog.source}</span>
            </div>
            <div>
              <span className="text-slate-500 block">LATENCY / PROJECT</span>
              <span>{selectedLog.latencyMs ?? 'N/A'}ms • {selectedLog.project || 'GENERAL'}</span>
            </div>
          </div>

          <div className="p-2 rounded bg-black/60 border border-cyan-500/10 text-cyan-200">
            <span className="text-slate-500 block text-[10px] mb-0.5">ACTION & PAYLOAD DETAILS</span>
            <div className="font-bold text-white mb-1">{selectedLog.action}</div>
            <p className="text-slate-300 whitespace-pre-wrap">{selectedLog.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};
