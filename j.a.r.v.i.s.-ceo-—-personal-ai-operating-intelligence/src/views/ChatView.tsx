import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Volume2,
  VolumeX,
  Trash2,
  Copy,
  Check,
  Cpu,
  Layers,
  Sparkles,
  Bot,
  User,
  Activity,
  Terminal,
  ShieldCheck
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  provider?: string;
  project?: string;
  executionPlan?: {
    phase: string;
    detail: string;
    completed: boolean;
  }[];
}

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => Promise<void>;
  isLoading: boolean;
  selectedModel: string;
  onSelectModel: (m: string) => void;
  selectedProject: string;
  onSelectProject: (p: string) => void;
  language: 'uz' | 'en' | 'ru';
  isListening: boolean;
  onToggleListening: () => void;
  onSpeakText: (text: string) => void;
  onClearHistory: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  selectedModel,
  onSelectModel,
  selectedProject,
  onSelectProject,
  language,
  isListening,
  onToggleListening,
  onSpeakText,
  onClearHistory
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#030814]/70">
      {/* Top Conversation Header */}
      <div className="px-4 py-3 border-b border-cyan-500/20 bg-black/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-tech font-bold text-cyan-300 tracking-wider">
              JARVIS TACTICAL CONVERSATION
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Active Context: <span className="text-cyan-400 font-semibold">{selectedProject}</span> | Language: <span className="uppercase text-cyan-300">{language}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearHistory}
            title="Suhbat tarixini tozalash"
            className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-slate-700/60 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all text-xs font-mono flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tozalash</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-4">
            <div className="w-16 h-16 rounded-full bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Bot className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-tech font-bold text-white tracking-wide">
                J.A.R.V.I.S. TIZIMI TAYYOR
              </h2>
              <p className="text-xs font-mono text-slate-400 max-w-md mt-1">
                Founder buyruqlarini qabul qilishga shay. Savol bering, dasturlash topshirig'ini yuklang yoki loyihalarni boshqaring.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full text-left">
              {[
                { title: 'ENVO loyihasini tahlil qil', desc: 'Rivojlanish rejasi va qolib ketgan ishlarni aniqlash' },
                { title: 'ICSN xavfsizlik auditini o\'tkaz', desc: 'Zero-trust protokoli va zaifliklarni ko\'rish' },
                { title: 'VERON uchun yangi mikroxizmat', desc: 'FastAPI va telemetriya kodini yozish' },
                { title: 'Ollama modellarini tekshir', desc: 'Qwen3 va Qwen2.5-Coder integratsiyasi holati' }
              ].map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(sample.title)}
                  className="p-3 rounded-lg hud-glass-interactive text-left"
                >
                  <div className="text-xs font-tech font-semibold text-cyan-300">
                    {sample.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {sample.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-mono font-bold ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-cyan-950 border border-cyan-400 text-cyan-300'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`flex flex-col space-y-1.5 ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-900/40 border border-blue-500/40 text-blue-100 rounded-tr-none'
                        : 'hud-glass rounded-tl-none border-cyan-500/30 text-slate-200'
                    }`}
                  >
                    {/* Assistant Metadata Header */}
                    {!isUser && (
                      <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-cyan-500/20 text-[10px] font-mono text-cyan-400">
                        <span className="font-bold flex items-center gap-1">
                          <Cpu className="w-3 h-3" />
                          {msg.modelUsed || selectedModel}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">{msg.provider || 'AI Engine'}</span>
                        {msg.project && (
                          <>
                            <span>•</span>
                            <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                              [{msg.project}]
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Content Body */}
                    <div className="whitespace-pre-wrap font-sans text-xs md:text-sm">
                      {msg.content}
                    </div>

                    {/* Execution Lifecycle Preview if present */}
                    {msg.executionPlan && msg.executionPlan.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-cyan-500/20 space-y-1">
                        <div className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          LIFECYCLE VERIFICATION:
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                          {msg.executionPlan.map((step, sIdx) => (
                            <div
                              key={sIdx}
                              className="px-2 py-1 rounded bg-black/40 border border-cyan-500/20 text-slate-300 flex items-center justify-between"
                            >
                              <span className="text-cyan-300">{step.phase}</span>
                              <span className="text-emerald-400 font-bold">OK</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Bottom Action Row */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 px-1">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => onSpeakText(msg.content)}
                          className="hover:text-cyan-400 flex items-center gap-0.5 transition-colors"
                          title="Ovoz bilan o'qish"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Ovoz</span>
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-cyan-400 flex items-center gap-0.5 transition-colors"
                          title="Nusxa olish"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === msg.id ? 'Nusxalandi' : 'Nusxa'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-xl hud-glass text-xs font-mono text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>JARVIS tahlil qilmoqda va modellar orqali ishlamoqda...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Footer */}
      <div className="p-4 bg-black/60 border-t border-cyan-500/20 shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="JARVISga xabar yoki buyruq bering (Shift+Enter yangi qator)..."
            rows={2}
            className="w-full pl-4 pr-24 py-2.5 rounded-lg bg-black/70 border border-cyan-500/30 text-white placeholder-slate-500 font-mono text-xs md:text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.25)] resize-none"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleListening}
              className={`p-2 rounded-md transition-all ${
                isListening
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.8)] animate-pulse'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40'
              }`}
              title={isListening ? 'Eshitishni to\'xtatish' : 'Ovozli yozish'}
              aria-label="Toggle voice input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 rounded-md bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black font-bold transition-all shadow-[0_0_10px_rgba(0,240,255,0.4)]"
              title="Yuborish"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1.5 px-1">
          <span>Tizim: 10 ta maxsus agent jamoasi biriktirilgan</span>
          <span>Shift+Enter yangi qator</span>
        </div>
      </div>
    </div>
  );
};
