import React from 'react';
import {
  Activity,
  Cpu,
  Layers,
  Terminal,
  Shield,
  Database,
  Briefcase,
  Sliders,
  Radio,
  Sparkles,
  Zap,
  Network,
  GraduationCap,
  BookOpen
} from 'lucide-react';

export type WorkspaceTab =
  | 'OVERVIEW'
  | 'CHAT'
  | 'MISSIONS'
  | 'DEV_STUDIO'
  | 'ECOSYSTEM'
  | 'ICSN_CONTROL'
  | 'ENVO_CONTROL'
  | 'INTELLIGENCE'
  | 'MEMORY'
  | 'CEO'
  | 'SYSTEM'
  | 'INTEGRATIONS'
  | 'SETTINGS';

interface NavigationSidebarProps {
  currentTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  activeMissionCount: number;
  ollamaConnected: boolean;
  isSpeaking: boolean;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentTab,
  onSelectTab,
  activeMissionCount,
  ollamaConnected,
  isSpeaking
}) => {
  const navItems: { id: WorkspaceTab; label: string; sub: string; icon: any; badge?: string }[] = [
    { id: 'OVERVIEW', label: 'Command HUD', sub: 'Boshqaruv markazi', icon: Activity },
    { id: 'CHAT', label: 'JARVIS Chat', sub: 'Intelligent muloqot', icon: Sparkles },
    { id: 'MISSIONS', label: 'Mission Control', sub: 'Topshiriqlar', icon: Layers, badge: activeMissionCount > 0 ? `${activeMissionCount}` : undefined },
    { id: 'DEV_STUDIO', label: 'Dev Studio', sub: 'Dasturlash va kod', icon: Terminal },
    { id: 'ECOSYSTEM', label: 'Ecosystem Manager', sub: 'ICSN & ENVO Onboarding', icon: Network },
    { id: 'ICSN_CONTROL', label: 'ICSN Control', sub: 'Navigator & Supabase DB', icon: GraduationCap },
    { id: 'ENVO_CONTROL', label: 'ENVO Control', sub: 'Mentor AI & Center DB', icon: BookOpen },
    { id: 'INTELLIGENCE', label: 'Intelligence Core', sub: 'Modellar va marshrut', icon: Zap },
    { id: 'MEMORY', label: 'Memory Center', sub: 'Xotira va bilimlar', icon: Database },
    { id: 'CEO', label: 'CEO Workspace', sub: 'VERON • ICSN • ENVO', icon: Briefcase },
    { id: 'SYSTEM', label: 'System Monitor', sub: 'i7-1355U / 15.7GB RAM', icon: Cpu },
    { id: 'INTEGRATIONS', label: 'Integrations', sub: 'Ollama • Gemini • Git', icon: Radio },
    { id: 'SETTINGS', label: 'Settings & Security', sub: 'Sozlamalar & profil', icon: Sliders }
  ];

  return (
    <aside className="w-64 h-full flex flex-col bg-[#040914]/90 border-r border-cyan-500/20 backdrop-blur-md select-none shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <span className="text-cyan-400 font-tech font-bold text-sm tracking-wider">J</span>
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${ollamaConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'}`} />
          </div>
          <div>
            <div className="font-tech text-base font-bold text-cyan-300 tracking-widest flex items-center gap-1.5">
              J.A.R.V.I.S.
              <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-900/60 border border-cyan-400/40 text-cyan-200">
                CEO
              </span>
            </div>
            <div className="text-[10px] text-cyan-500/80 font-mono tracking-wider">
              OPERATING INTELLIGENCE
            </div>
          </div>
        </div>
      </div>

      {/* Host Kernel Badge */}
      <div className="px-4 py-2 bg-black/40 border-b border-cyan-500/10 text-[10px] font-mono text-cyan-400/70 flex items-center justify-between">
        <span className="truncate" title="C:\Users\acer\jarvis-project\jarvis-kernel">
          HOST: jarvis-kernel
        </span>
        <span className="text-emerald-400 font-semibold">VERIFIED</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-950/70 border border-cyan-400/60 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/30 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold tracking-wide truncate">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    {item.sub}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 border border-cyan-400/50 text-cyan-300">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Telemetry Mini-Card */}
      <div className="p-3 border-t border-cyan-500/20 bg-black/50 text-[11px] font-mono">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span>AI ENGINE:</span>
          <span className="text-cyan-400 font-semibold">
            {ollamaConnected ? 'OLLAMA LOCAL' : 'HYBRID KERNEL'}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span>VOICE STATE:</span>
          <span className={isSpeaking ? 'text-emerald-400 font-bold animate-pulse' : 'text-slate-400'}>
            {isSpeaking ? 'SPEAKING' : 'READY'}
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
          <div className="bg-cyan-400 h-full w-2/3 animate-pulse" />
        </div>
      </div>
    </aside>
  );
};
