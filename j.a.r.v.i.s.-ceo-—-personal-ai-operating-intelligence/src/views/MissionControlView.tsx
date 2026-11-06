import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  Search,
  Filter,
  Check,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { AgentRole, REGISTERED_AGENTS } from '../core/agentOrchestrator';

export type MissionStatus =
  | 'PENDING'
  | 'PLANNING'
  | 'RUNNING'
  | 'APPROVAL_REQUIRED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface MissionStep {
  id: string;
  title: string;
  detail: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  agent: AgentRole;
}

export interface MissionItem {
  id: string;
  title: string;
  description: string;
  project: 'VERON' | 'ICSN' | 'ENVO' | 'JARVIS' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: MissionStatus;
  progressPercent: number;
  leadAgent: AgentRole;
  supportingAgents: AgentRole[];
  steps: MissionStep[];
  logs: string[];
  createdAt: string;
  updatedAt: string;
}

interface MissionControlViewProps {
  missions: MissionItem[];
  onDispatchMission: (newMission: Omit<MissionItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateMissionStatus: (id: string, status: MissionStatus) => void;
  onApproveMission: (id: string) => void;
}

export const MissionControlView: React.FC<MissionControlViewProps> = ({
  missions,
  onDispatchMission,
  onUpdateMissionStatus,
  onApproveMission
}) => {
  const [selectedMissionId, setSelectedMissionId] = useState<string>(missions[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMissionModal, setShowNewMissionModal] = useState(false);

  // New mission form fields
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProject, setNewProject] = useState<'VERON' | 'ICSN' | 'ENVO' | 'JARVIS' | 'GENERAL'>('ENVO');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [newLeadAgent, setNewLeadAgent] = useState<AgentRole>('DEVELOPER');

  const filteredMissions = missions.filter(m => {
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.project.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedMission = missions.find(m => m.id === selectedMissionId) || filteredMissions[0];

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onDispatchMission({
      title: newTitle,
      description: newDesc || 'Founder topshirig\'i asosida yaratildi.',
      project: newProject,
      priority: newPriority,
      status: 'PLANNING',
      progressPercent: 15,
      leadAgent: newLeadAgent,
      supportingAgents: ['TESTING', 'SECURITY', 'SUPERVISOR'],
      steps: [
        { id: 's-1', title: 'Scope Analysis', detail: 'Founder parametrlarini o\'rganish', status: 'COMPLETED', agent: 'PLANNING' },
        { id: 's-2', title: 'Resource Allocation', detail: 'Intel i7-1355U threadlarini sozlash', status: 'RUNNING', agent: newLeadAgent },
        { id: 's-3', title: 'Quality Verification', detail: 'Supervisor Agent tekshiruvi', status: 'PENDING', agent: 'SUPERVISOR' }
      ],
      logs: [
        `[${new Date().toLocaleTimeString()}] Topshiriq yaratildi va rejalashtirish fazasiga o'tkazildi.`,
        `[${new Date().toLocaleTimeString()}] Mas'ul agent: ${newLeadAgent} tayinlandi.`
      ]
    });

    setNewTitle('');
    setNewDesc('');
    setShowNewMissionModal(false);
  };

  const getStatusBadge = (status: MissionStatus) => {
    switch (status) {
      case 'RUNNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold animate-pulse">RUNNING</span>;
      case 'PLANNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40">PLANNING</span>;
      case 'APPROVAL_REQUIRED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">APPROVAL REQ</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">COMPLETED</span>;
      case 'FAILED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/40">FAILED</span>;
      case 'CANCELLED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-700/50 text-slate-400">CANCELLED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">PENDING</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#030814]/70">
      {/* Left Column: Mission Directory */}
      <div className="w-full md:w-80 lg:w-96 border-r border-cyan-500/20 flex flex-col h-full bg-black/40 shrink-0">
        <div className="p-4 border-b border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-tech font-bold text-cyan-300 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              MISSION CONTROL
            </h2>
            <button
              onClick={() => setShowNewMissionModal(true)}
              className="px-2.5 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(0,240,255,0.4)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Qidiruv..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/60 border border-cyan-500/30 text-xs font-mono text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2 py-1.5 rounded-lg bg-black/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 focus:outline-none"
            >
              <option value="ALL">Barchasi</option>
              <option value="RUNNING">Running</option>
              <option value="PLANNING">Planning</option>
              <option value="APPROVAL_REQUIRED">Approval</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Mission List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredMissions.map(m => {
            const isSelected = selectedMission?.id === m.id;

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMissionId(m.id)}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'hud-glass hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 font-bold">
                    [{m.project}]
                  </span>
                  {getStatusBadge(m.status)}
                </div>

                <div className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
                  {m.title}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Mas'ul: {m.leadAgent}</span>
                  <span className="text-cyan-400 font-bold">{m.progressPercent}%</span>
                </div>

                <div className="w-full bg-black/60 rounded-full h-1 mt-2 overflow-hidden border border-cyan-500/20">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${m.progressPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Mission Details & Execution Logs */}
      {selectedMission ? (
        <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Mission Header */}
          <div className="p-5 rounded-xl hud-glass border border-cyan-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <span className="font-bold">MISSION ID: {selectedMission.id}</span>
                  <span>•</span>
                  <span>PROJECT: [{selectedMission.project}]</span>
                  <span>•</span>
                  <span className="text-amber-400">PRIORITY: {selectedMission.priority}</span>
                </div>
                <h1 className="text-lg md:text-xl font-tech font-bold text-white tracking-wide">
                  {selectedMission.title}
                </h1>
                <p className="text-xs font-mono text-slate-300 mt-1 max-w-2xl">
                  {selectedMission.description}
                </p>
              </div>

              {/* Status & Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedMission.status === 'APPROVAL_REQUIRED' && (
                  <button
                    onClick={() => onApproveMission(selectedMission.id)}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                  >
                    <Check className="w-4 h-4" />
                    <span>TASDIQLASH (APPROVE)</span>
                  </button>
                )}

                {selectedMission.status === 'RUNNING' && (
                  <button
                    onClick={() => onUpdateMissionStatus(selectedMission.id, 'PENDING')}
                    className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 hover:bg-amber-900/60 text-xs font-mono flex items-center gap-1"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pauza</span>
                  </button>
                )}

                {selectedMission.status !== 'RUNNING' && selectedMission.status !== 'COMPLETED' && (
                  <button
                    onClick={() => onUpdateMissionStatus(selectedMission.id, 'RUNNING')}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-900/60 text-xs font-mono flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Ishga tushirish</span>
                  </button>
                )}

                <button
                  onClick={() => onUpdateMissionStatus(selectedMission.id, 'CANCELLED')}
                  className="px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-900/50 text-xs font-mono flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Bekor qilish</span>
                </button>
              </div>
            </div>

            {/* Assigned Agent Squad Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-2">
              <div className="p-2.5 rounded-lg bg-black/40 border border-cyan-500/20">
                <div className="text-[10px] font-mono text-slate-400">LEAD AGENT</div>
                <div className="text-xs font-tech font-bold text-cyan-300 mt-0.5">
                  {selectedMission.leadAgent}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {REGISTERED_AGENTS[selectedMission.leadAgent]?.codename}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-cyan-500/20">
                <div className="text-[10px] font-mono text-slate-400">SUPPORT SQUAD</div>
                <div className="text-xs font-tech font-bold text-cyan-300 mt-0.5 truncate">
                  {selectedMission.supportingAgents.join(', ')}
                </div>
                <div className="text-[10px] font-mono text-slate-500">Resource: 2 Threads Max</div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-cyan-500/20">
                <div className="text-[10px] font-mono text-slate-400">PROGRESS</div>
                <div className="text-xs font-tech font-bold text-cyan-300 mt-0.5">
                  {selectedMission.progressPercent}%
                </div>
                <div className="text-[10px] font-mono text-emerald-400">On Track</div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-cyan-500/20">
                <div className="text-[10px] font-mono text-slate-400">CURRENT STATUS</div>
                <div className="text-xs font-tech font-bold text-cyan-300 mt-0.5">
                  {selectedMission.status}
                </div>
                <div className="text-[10px] font-mono text-slate-500">Host Verified</div>
              </div>
            </div>
          </div>

          {/* Execution Steps */}
          <div className="p-5 rounded-xl hud-glass border border-cyan-500/20">
            <h3 className="text-xs font-mono font-bold text-cyan-400 tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              IJRO BOSQICHLARI (STEPS)
            </h3>

            <div className="space-y-2">
              {selectedMission.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border flex items-center justify-between text-xs font-mono ${
                    step.status === 'COMPLETED'
                      ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200'
                      : step.status === 'RUNNING'
                      ? 'bg-blue-950/40 border-blue-400/50 text-blue-100 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                      : 'bg-black/30 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-black/50 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px] text-cyan-400">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-200">{step.title}</div>
                      <div className="text-[10px] text-slate-400">{step.detail}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Agent: {step.agent}
                    </span>
                    {step.status === 'COMPLETED' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {step.status === 'RUNNING' && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                    {step.status === 'PENDING' && (
                      <Clock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Execution Logs */}
          <div className="p-4 rounded-xl hud-glass border border-cyan-500/20">
            <h3 className="text-xs font-mono font-bold text-cyan-400 tracking-wider mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              AVTONOM LOGLAR OQIMI (AUDIT LOGS)
            </h3>
            <div className="p-3 rounded-lg bg-black/70 border border-cyan-500/20 font-mono text-[11px] text-cyan-300 space-y-1 max-h-48 overflow-y-auto">
              {selectedMission.logs.map((log, lIdx) => (
                <div key={lIdx} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs">
          Topshiriq tanlanmagan
        </div>
      )}

      {/* New Mission Dispatch Modal */}
      {showNewMissionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl hud-glass border border-cyan-400/50 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="text-base font-tech font-bold text-white tracking-wide flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                YANGI MISSIYA YARATISH
              </h3>
              <button
                onClick={() => setShowNewMissionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMission} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Topshiriq nomi:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Masalan: ENVO loyihasi uchun API yaratish"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Batafsil tavsif:</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Vazifa maqsadi, talablar va kutilayotgan natijalar..."
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Loyiha:</label>
                  <select
                    value={newProject}
                    onChange={e => setNewProject(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-300 focus:outline-none"
                  >
                    <option value="VERON">VERON</option>
                    <option value="ICSN">ICSN</option>
                    <option value="ENVO">ENVO</option>
                    <option value="JARVIS">JARVIS</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Muhimlik (Priority):</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-300 focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Bosh Mas'ul Agent (Lead Agent):</label>
                <select
                  value={newLeadAgent}
                  onChange={e => setNewLeadAgent(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-300 focus:outline-none"
                >
                  {Object.values(REGISTERED_AGENTS).map(agent => (
                    <option key={agent.role} value={agent.role}>
                      {agent.name} ({agent.codename})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setShowNewMissionModal(false)}
                  className="px-4 py-2 rounded-lg bg-black/40 border border-slate-700 text-slate-300 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  Yaratish va Ishga tushirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
