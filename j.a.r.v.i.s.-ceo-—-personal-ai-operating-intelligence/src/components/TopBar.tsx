import React from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldAlert,
  Globe,
  Cpu,
  FolderGit2
} from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';
import { CoreStatus } from './ArcReactorCore';

interface TopBarProps {
  coreStatus: CoreStatus;
  selectedProject: string;
  onSelectProject: (proj: string) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  language: 'uz' | 'en' | 'ru';
  onSelectLanguage: (lang: 'uz' | 'en' | 'ru') => void;
  isListening: boolean;
  onToggleListening: () => void;
  isSpeaking: boolean;
  onToggleMute: () => void;
  isMuted: boolean;
  onEmergencyStop: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  coreStatus,
  selectedProject,
  onSelectProject,
  selectedModel,
  onSelectModel,
  language,
  onSelectLanguage,
  isListening,
  onToggleListening,
  isSpeaking,
  onToggleMute,
  isMuted,
  onEmergencyStop
}) => {
  const projects = ['GENERAL', 'VERON', 'ICSN', 'ENVO', 'JARVIS'];

  return (
    <header className="h-16 px-4 bg-[#050c18]/80 border-b border-cyan-500/20 backdrop-blur-md flex items-center justify-between gap-4 z-20 shrink-0">
      {/* Left: Project Context Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/40 border border-cyan-500/20 text-xs font-mono">
          <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">PROJECT:</span>
          <select
            value={selectedProject}
            onChange={e => onSelectProject(e.target.value)}
            className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer"
            aria-label="Active Project"
          >
            {projects.map(p => (
              <option key={p} value={p} className="bg-slate-900 text-cyan-200">
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Model Route Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/40 border border-cyan-500/20 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">MODEL:</span>
          <select
            value={selectedModel}
            onChange={e => onSelectModel(e.target.value)}
            className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer"
            aria-label="Selected Model"
          >
            <option value="auto" className="bg-slate-900 text-cyan-200">
              Auto-Route (Smart)
            </option>
            <option value="qwen3:4b" className="bg-slate-900 text-cyan-200">
              Qwen3:4b (Local)
            </option>
            <option value="qwen2.5-coder:3b" className="bg-slate-900 text-cyan-200">
              Qwen2.5-Coder:3b (Local)
            </option>
            <option value="gemini-2.5-flash" className="bg-slate-900 text-cyan-200">
              Gemini 2.5 Flash (Cloud)
            </option>
          </select>
        </div>
      </div>

      {/* Middle: Audio Waveform Visualizer */}
      <div className="hidden md:flex items-center gap-3">
        <AudioWaveform isActive={isListening} isSpeaking={isSpeaking} barsCount={24} />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Language selector */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 border border-cyan-500/20 text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          {(['uz', 'en', 'ru'] as const).map(l => (
            <button
              key={l}
              onClick={() => onSelectLanguage(l)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                language === l
                  ? 'bg-cyan-500 text-black font-extrabold shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Mute Voice button */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Ovozni yoqish' : 'Ovozni o\'chirish'}
          className="p-2 rounded-lg bg-black/40 border border-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
          aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Microphone Voice Toggle */}
        <button
          onClick={onToggleListening}
          title={isListening ? 'Eshitishni to\'xtatish' : 'Ovozli buyruq ("Hey JARVIS")'}
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-mono font-semibold transition-all ${
            isListening
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.5)] animate-pulse'
              : 'bg-black/40 border-cyan-500/30 text-slate-300 hover:border-cyan-400 hover:text-cyan-300'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice recognition'}
        >
          {isListening ? (
            <>
              <Mic className="w-3.5 h-3.5 text-cyan-300" />
              <span>LISTENING</span>
            </>
          ) : (
            <>
              <MicOff className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">VOICE</span>
            </>
          )}
        </button>

        {/* Emergency Stop Button */}
        <button
          onClick={onEmergencyStop}
          title="Emergency Stop / Barcha agentlarni to'xtatish"
          className="px-2.5 py-1.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-900/60 hover:text-red-200 transition-all text-xs font-mono flex items-center gap-1"
          aria-label="Emergency Stop"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">HALT</span>
        </button>
      </div>
    </header>
  );
};
