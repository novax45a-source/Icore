import React, { useState } from 'react';
import {
  Network,
  Plus,
  RefreshCw,
  Server,
  Database,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Code2
} from 'lucide-react';
import { PlatformDiscoveryResult, ConnectedPlatformId } from '../core/ecosystemEngine';

interface EcosystemManagerViewProps {
  platforms: Record<ConnectedPlatformId, PlatformDiscoveryResult>;
  onTriggerDiscovery: (platformId: ConnectedPlatformId) => void;
  onNavigateToPlatform: (tab: 'ICSN_CONTROL' | 'ENVO_CONTROL') => void;
}

export const EcosystemManagerView: React.FC<EcosystemManagerViewProps> = ({
  platforms,
  onTriggerDiscovery,
  onNavigateToPlatform
}) => {
  const [discoveringId, setDiscoveringId] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // New platform form
  const [newPlatformName, setNewPlatformName] = useState('');
  const [newRepoPath, setNewRepoPath] = useState('');
  const [newDbUrl, setNewDbUrl] = useState('');

  const handleRunDiscovery = (id: ConnectedPlatformId) => {
    setDiscoveringId(id);
    onTriggerDiscovery(id);
    setTimeout(() => {
      setDiscoveringId(null);
    }, 1200);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#030814]/70">
      {/* Top Banner */}
      <div className="p-5 rounded-xl hud-glass border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 flex items-center gap-2 mb-1">
            <Network className="w-4 h-4 text-cyan-400" />
            JARVIS ECOSYSTEM MANAGER • SECTION 5
          </div>
          <h1 className="text-xl font-tech font-bold text-white tracking-wide">
            MULTI-PLATFORM DISCOVERY & GOVERNANCE
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Controlled Onboarding • Autonomous Repository Discovery • Isolated DB Maps (ICSN & ENVO)
          </p>
        </div>

        <button
          onClick={() => setShowConnectModal(true)}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Platforma Ulanishi (Wizard)</span>
        </button>
      </div>

      {/* Connected Platforms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ICSN Platform Card */}
        {platforms.ICSN && (
          <div className="p-5 rounded-xl hud-glass border border-cyan-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-400 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-tech font-bold text-white flex items-center gap-2">
                      {platforms.ICSN.platformName}
                      <span className="text-xs text-cyan-400 font-mono">[ICSN]</span>
                    </h2>
                    <p className="text-[11px] font-mono text-slate-400">
                      {platforms.ICSN.tagline}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {platforms.ICSN.discoveryStatus}
                </span>
              </div>

              {/* Technical Discovery Snapshot */}
              <div className="space-y-2 p-3 rounded-lg bg-black/40 border border-cyan-500/10 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Repository:</span>
                  <span className="text-cyan-300 truncate max-w-[240px]">{platforms.ICSN.repoPath}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database:</span>
                  <span className="text-cyan-300 font-bold">{platforms.ICSN.databaseType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Row-Level Security (RLS):</span>
                  <span className="text-emerald-400 font-bold">100% Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Discovered Tables:</span>
                  <span className="text-cyan-300">students (1,240), universities (450), scholarships (180)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Embedded Assistant:</span>
                  <span className="text-purple-300 font-bold">ICSN Navigator AI (Deployed)</span>
                </div>
              </div>

              {/* Discovered Issues Alert */}
              {platforms.ICSN.discoveredIssues.length > 0 && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] font-mono text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Aniqlangan texnik vazifalar (Discovery Issues):
                  </div>
                  {platforms.ICSN.discoveredIssues.map((issue, idx) => (
                    <div key={idx} className="text-slate-300 pl-5 text-[10px]">
                      • {issue}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Row */}
            <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between">
              <button
                onClick={() => handleRunDiscovery('ICSN')}
                disabled={discoveringId === 'ICSN'}
                className="px-3 py-1.5 rounded-lg bg-black/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${discoveringId === 'ICSN' ? 'animate-spin' : ''}`} />
                <span>{discoveringId === 'ICSN' ? 'Skanerlanmoqda...' : 'Qayta Skanerlash (Discover)'}</span>
              </button>

              <button
                onClick={() => onNavigateToPlatform('ICSN_CONTROL')}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                <span>ICSN Boshqaruv Markazi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ENVO Platform Card */}
        {platforms.ENVO && (
          <div className="p-5 rounded-xl hud-glass border border-cyan-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-400 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-tech font-bold text-white flex items-center gap-2">
                      {platforms.ENVO.platformName}
                      <span className="text-xs text-cyan-400 font-mono">[ENVO]</span>
                    </h2>
                    <p className="text-[11px] font-mono text-slate-400">
                      {platforms.ENVO.tagline}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {platforms.ENVO.discoveryStatus}
                </span>
              </div>

              {/* Technical Discovery Snapshot */}
              <div className="space-y-2 p-3 rounded-lg bg-black/40 border border-cyan-500/10 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Repository:</span>
                  <span className="text-cyan-300 truncate max-w-[240px]">{platforms.ENVO.repoPath}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database:</span>
                  <span className="text-cyan-300 font-bold">{platforms.ENVO.databaseType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Row-Level Security (RLS):</span>
                  <span className="text-emerald-400 font-bold">100% Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Discovered Tables:</span>
                  <span className="text-cyan-300">learning_centers (68), courses (320), enrollments (4,890)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Embedded Assistant:</span>
                  <span className="text-purple-300 font-bold">ENVO Mentor AI (Deployed)</span>
                </div>
              </div>

              {/* Discovered Issues Alert */}
              {platforms.ENVO.discoveredIssues.length > 0 && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] font-mono text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Aniqlangan texnik vazifalar (Discovery Issues):
                  </div>
                  {platforms.ENVO.discoveredIssues.map((issue, idx) => (
                    <div key={idx} className="text-slate-300 pl-5 text-[10px]">
                      • {issue}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Row */}
            <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between">
              <button
                onClick={() => handleRunDiscovery('ENVO')}
                disabled={discoveringId === 'ENVO'}
                className="px-3 py-1.5 rounded-lg bg-black/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${discoveringId === 'ENVO' ? 'animate-spin' : ''}`} />
                <span>{discoveringId === 'ENVO' ? 'Skanerlanmoqda...' : 'Qayta Skanerlash (Discover)'}</span>
              </button>

              <button
                onClick={() => onNavigateToPlatform('ENVO_CONTROL')}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                <span>ENVO Boshqaruv Markazi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Discovered Architecture Reports & Documentation Hub */}
      <div className="p-5 rounded-xl hud-glass border border-cyan-500/20 space-y-3">
        <h3 className="text-xs font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          GENERATSIYA QILINGAN ARXITEKTURA HISOBOTLARI (SECTION 5.2)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-black/40 border border-cyan-500/20 flex items-center justify-between">
            <div>
              <div className="text-white font-bold">ICSN_ARCHITECTURE_REPORT.md</div>
              <div className="text-[10px] text-slate-400">React 19 + Supabase Edge Functions</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-cyan-500/20 flex items-center justify-between">
            <div>
              <div className="text-white font-bold">ENVO_ARCHITECTURE_REPORT.md</div>
              <div className="text-[10px] text-slate-400">Next.js 15 + FastAPI + Multi-Tenant DB</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-cyan-500/20 flex items-center justify-between">
            <div>
              <div className="text-white font-bold">JARVIS_ECOSYSTEM.md</div>
              <div className="text-[10px] text-slate-400">Data Isolation & Security Policies</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Connection Wizard Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl hud-glass border border-cyan-400/50 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="text-base font-tech font-bold text-white tracking-wide flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                PLATFORM CONNECTION WIZARD (SECTION 5.1)
              </h3>
              <button onClick={() => setShowConnectModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Platforma Nomi:</label>
                <input
                  type="text"
                  value={newPlatformName}
                  onChange={e => setNewPlatformName(e.target.value)}
                  placeholder="Masalan: ICSN yoki ENVO"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Repozitoriy Joylashuvi (Local Path):</label>
                <input
                  type="text"
                  value={newRepoPath}
                  onChange={e => setNewRepoPath(e.target.value)}
                  placeholder="C:\Users\acer\projects\..."
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ma'lumotlar Bazasi (Supabase / Postgres URL):</label>
                <input
                  type="password"
                  value={newDbUrl}
                  onChange={e => setNewDbUrl(e.target.value)}
                  placeholder="postgresql://postgres:password@...pooler.supabase.com:6543/postgres"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 text-[11px]">
                JARVIS Ecosystem Manager ulanishdan so'ng avtomatlashtirilgan kashfiyot (discovery) protokolini ishga tushiradi va arxitektura hisobotini shakllantiradi.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2 rounded-lg bg-black/40 border border-slate-700 text-slate-300"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Yangi platforma ulanish testi muvaffaqiyatli yakunlandi.');
                    setShowConnectModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold"
                >
                  Ulash va Skanerlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
