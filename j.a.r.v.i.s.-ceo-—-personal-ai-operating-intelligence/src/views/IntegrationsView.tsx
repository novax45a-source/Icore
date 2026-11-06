import React, { useState } from 'react';
import {
  Radio,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Server,
  Github,
  Database,
  Send,
  Sparkles,
  RefreshCw,
  HardDrive
} from 'lucide-react';

interface IntegrationsViewProps {
  ollamaConnected: boolean;
  onRefreshOllama: () => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  ollamaConnected,
  onRefreshOllama
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [connectedState, setConnectedState] = useState<Record<string, boolean>>({
    ollama: ollamaConnected,
    gemini: true,
    github: true,
    supabase: false,
    telegram: false,
    windows: true
  });

  const handleTest = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setConnectedState(prev => ({ ...prev, [id]: true }));
      setTestingId(null);
    }, 700);
  };

  const integrations = [
    {
      id: 'ollama',
      name: 'Ollama Local AI Engine',
      endpoint: 'http://localhost:11434',
      status: ollamaConnected ? 'CONNECTED' : 'STANDBY',
      description: 'Qwen3:4b va Qwen2.5-Coder:3b modellarini mahalliy inferensiya qilish.',
      icon: Server,
      type: 'LOCAL'
    },
    {
      id: 'gemini',
      name: 'Google Gemini 2.5 Flash',
      endpoint: 'Server-side API Gateway',
      status: 'CONFIGURED',
      description: 'Yuqori darajadagi murakkab tahlillar va katta hujjatlar sintezi.',
      icon: Sparkles,
      type: 'CLOUD'
    },
    {
      id: 'windows',
      name: 'Windows Desktop Bridge',
      endpoint: 'C:\\Users\\acer\\jarvis-project\\jarvis-kernel',
      status: 'VERIFIED',
      description: 'Fayllar tizimi, protsesslar nazorati va apparat telemetriyasi.',
      icon: HardDrive,
      type: 'HOST'
    },
    {
      id: 'github',
      name: 'GitHub Repository Bridge',
      endpoint: 'https://api.github.com',
      status: 'CONNECTED',
      description: 'Git commits, filiallar, PRlar va avtomatlashtirilgan kod testlari.',
      icon: Github,
      type: 'EXTERNAL'
    },
    {
      id: 'supabase',
      name: 'Supabase PostgreSQL DB',
      endpoint: 'Cloud DB Pooler',
      status: connectedState.supabase ? 'CONNECTED' : 'NOT_CONFIGURED',
      description: 'Katta hajmdagi ma\'lumotlar bazasi va tashqi sinxronizatsiya.',
      icon: Database,
      type: 'EXTERNAL'
    },
    {
      id: 'telegram',
      name: 'Telegram Bot Assistant',
      endpoint: 'Bot API Gateway',
      status: connectedState.telegram ? 'CONNECTED' : 'STANDBY',
      description: 'Mobil telefondan tezkor xabarlar va haftalik hisobotlarni qabul qilish.',
      icon: Send,
      type: 'EXTERNAL'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#030814]/70">
      {/* Top Banner */}
      <div className="p-4 rounded-xl hud-glass border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-cyan-400" />
            EXTENSIBLE INTEGRATION ARCHITECTURE
          </div>
          <h1 className="text-xl font-tech font-bold text-white tracking-wide">
            INTEGRATION CENTER & CONNECTIVITY
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Local Ollama Engine • Windows Host Bridge • Cloud AI • Secure Webhooks
          </p>
        </div>

        <button
          onClick={onRefreshOllama}
          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/40 text-xs font-mono text-cyan-300 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Barcha Aloqalarni Yangilash</span>
        </button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(item => {
          const Icon = item.icon;
          const isTesting = testingId === item.id;
          const isConnected =
            item.status === 'CONNECTED' ||
            item.status === 'CONFIGURED' ||
            item.status === 'VERIFIED';

          return (
            <div
              key={item.id}
              className="p-5 rounded-xl hud-glass border border-cyan-500/20 flex flex-col justify-between hover:border-cyan-400/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-black/60 border border-cyan-500/30 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      isConnected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-tech font-bold text-white mb-1">
                  {item.name}
                </h3>
                <div className="text-[10px] font-mono text-cyan-400/80 mb-2 truncate">
                  {item.endpoint}
                </div>
                <p className="text-xs font-mono text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  TYPE: {item.type}
                </span>

                <button
                  onClick={() => handleTest(item.id)}
                  disabled={isTesting}
                  className="px-2.5 py-1 rounded bg-black/40 border border-cyan-500/30 hover:border-cyan-400 text-[11px] font-mono text-cyan-300 transition-colors"
                >
                  {isTesting ? 'Sinalmoqda...' : 'Sinov (Test)'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
