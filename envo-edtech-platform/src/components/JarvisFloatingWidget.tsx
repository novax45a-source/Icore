import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronRight,
  HelpCircle,
  Compass,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { searchEnvoKnowledge, ENVO_KNOWLEDGE_BASE } from '../lib/envoKnowledge';

interface Message {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    view: string;
  };
}

export const JarvisFloatingWidget: React.FC = () => {
  const { user, language, activeView, setActiveView } = useAuth();
  const { theme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice capabilities
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Generate role-specific welcome text
  const getGreetingForRole = () => {
    const role = user?.role || 'student';
    const name = user?.name ? user.name.split(' ')[0] : 'foydalanuvchi';

    if (language === 'ru') {
      switch (role) {
        case 'teacher':
          return `Здравствуйте, ${name}! Я JARVIS, ваш персональный ИИ-ассистент ENVO. Готов помочь управлять уроками, группами 1–3 учеников и кошельком (83%). Чем могу помочь сегодня?`;
        case 'student':
          return `Привет, ${name}! Я JARVIS. Помогу с вашими уроками, домашними заданиями, тестами и подбором лучших репетиторов.`;
        case 'parent':
          return `Здравствуйте! Я JARVIS. Помогу отслеживать посещаемость, оценки детей и статус оплаты учебного центра.`;
        case 'lc_admin':
          return `Здравствуйте! Я JARVIS. Помогу с управлением группами учебного центра, педагогами, студентами и 30-дневной SaaS подпиской.`;
        case 'super_admin':
          return `Приветствую, Super Admin! Я JARVIS. Аналитика платформы ENVO, модерация заявок учителей и финансовый баланс под контролем.`;
        default:
          return `Здравствуйте! Я JARVIS, ваш персональный ИИ-помощник в ENVO.`;
      }
    } else if (language === 'en') {
      switch (role) {
        case 'teacher':
          return `Hello, ${name}! I am JARVIS, your ENVO personal AI assistant. Ready to help with lesson scheduling, 1–3 student groups, and your 83% earnings wallet. How can I assist you today?`;
        case 'student':
          return `Hello, ${name}! I am JARVIS. I'll help you navigate your courses, homework, timed exams, and finding top verified teachers.`;
        case 'parent':
          return `Hello! I am JARVIS. I'll assist in monitoring your children's attendance, grades, and learning center fees.`;
        case 'lc_admin':
          return `Welcome! I am JARVIS. Ready to assist with center group management, staff rosters, and 30-day SaaS subscription renewal.`;
        case 'super_admin':
          return `Greetings, Super Admin! JARVIS is online. Platform analytics, teacher verifications, and financial controls are ready.`;
        default:
          return `Hello! I am JARVIS, your personal ENVO AI assistant.`;
      }
    } else {
      // Default Uzbek
      switch (role) {
        case 'teacher':
          return `Salom, ${name}! Men JARVIS, ENVO platformasidagi shaxsiy AI yordamchingizman. Bugungi darslaringiz, 1–3 kishilik guruhlaringiz va 83% lik daromad hamyoningizni boshqarishda yordam berishga tayyorman.`;
        case 'student':
          return `Salom, ${name}! Men JARVIS. Darslaringiz, uyga vazifalaringiz, onlayn imtihonlar va eng yaxshi o‘qituvchilarni topishda sizga yordam beraman.`;
        case 'parent':
          return `Salom! Men JARVIS. Farzandlaringizning o‘qishi, dars davomati, baholari va to‘lovlarini kuzatishda yordam beraman.`;
        case 'lc_admin':
          return `Salom! Men JARVIS. Registon o‘quv markazingizni boshqarish, guruhlar, pedagoglar va 30 kunlik SaaS obunasi tahlilida ko‘maklashaman.`;
        case 'super_admin':
          return `Salom, Hurmatli Super Admin! Men JARVIS. ENVO platformasi nazorati, o‘qituvchilar verifikatsiyasi va 17% komissiya tahlilida xizmatingizdaman.`;
        default:
          return `Salom! Men JARVIS, ENVO platformasidagi shaxsiy AI yordamchingizman. Platformadan foydalanishda sizga qanday yordam bera olaman?`;
      }
    }
  };

  // Initial welcome message
  useEffect(() => {
    if (!hasGreeted) {
      const greeting = getGreetingForRole();
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'jarvis',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setHasGreeted(true);
    }
  }, [user?.role, language]);

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'uz-UZ';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  // Text-to-speech speaker
  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'uz-UZ';
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition not supported or permission denied:', err);
      }
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const query = (customText || inputValue).trim();
    if (!query) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Retrieve relevant knowledge based on user query
    const relevantArticles = searchEnvoKnowledge(query, user?.role);
    const knowledgeContext = relevantArticles
      .map((a) => `[Feature: ${a.title}]\nSummary: ${a.summary}\nDetails: ${a.details.join('; ')}`)
      .join('\n\n');

    try {
      const response = await fetch('/api/jarvis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userRole: user?.role || 'student',
          currentView: activeView,
          language,
          userFullName: user?.name || 'Foydalanuvchi',
          relevantKnowledge: knowledgeContext,
        }),
      });

      const data = await response.json();
      const jarvisReplyText = data.text || "Uzr, javobni shakllantirishda xatolik yuz berdi.";

      // Determine navigation action if user asked for a specific module
      let suggestedAction: { label: string; view: string } | undefined;
      const lowerQ = query.toLowerCase();
      if (lowerQ.includes('bozor') || lowerQ.includes('repetitor') || lowerQ.includes('ustoz top')) {
        suggestedAction = { label: 'Bozorga O‘tish (Marketplace)', view: 'marketplace' };
      } else if (lowerQ.includes('markaz') || lowerQ.includes('saas') || lowerQ.includes('obuna')) {
        suggestedAction = { label: 'Markaz SaaS Boshqaruvi', view: 'center_saas' };
      } else if (lowerQ.includes('kabinet') || lowerQ.includes('dashboard') || lowerQ.includes('bosh sahifa')) {
        suggestedAction = { label: 'Shaxsiy Kabinetga O‘tish', view: 'dashboard' };
      }

      const jarvisMsg: Message = {
        id: 'jarvis-' + Date.now(),
        sender: 'jarvis',
        text: jarvisReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction,
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      speakText(jarvisReplyText);
    } catch (err) {
      const fallbackReply: Message = {
        id: 'jarvis-err-' + Date.now(),
        sender: 'jarvis',
        text: "Men ENVO bo‘yicha har qanday savolingizga yordam berishga tayyorman: virtual sinfxona, imtihonlar, to‘lovlar va 83/17% taqsimot tizimi haqida so‘rashingiz mumkin.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  // Contextual suggested questions based on role & view
  const getSuggestedQuestions = () => {
    if (activeView === 'marketplace') {
      return [
        "Repetitorning auditoriya cheklovi (faqat qizlar) nima?",
        "1–3 kishilik guruhlarga qanday yozilish mumkin?",
        "Arab va nemis tili o‘qituvchilarini ko‘rsat",
      ];
    }
    if (user?.role === 'teacher') {
      return [
        "83% lik daromad qanday hisoblanadi?",
        "Doskaga matematik formulalar qanday qo‘yiladi?",
        "Yangi imtihon va test qanday tuziladi?",
      ];
    }
    if (user?.role === 'lc_admin') {
      return [
        "SaaS obunasi qanday uzaytiriladi?",
        "15–20 kishilik sinfga yangi pedagog qanday biriktiriladi?",
      ];
    }
    if (user?.role === 'parent') {
      return [
        "Farzandlarim orasida qanday almashaman?",
        "Oylik to‘lov chekini qayerdan yuklayman?",
      ];
    }
    return [
      "Virtual sinfxona imkoniyatlari qanday?",
      "Vazifani ovozli diktant bilan qanday topshiraman?",
      "To‘lov qanday tasdiqlanadi?",
    ];
  };

  return (
    <>
      {/* Floating Action Button (Always Accessible Across All Views) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Compact prompt pill if closed */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer bg-slate-900/90 hover:bg-slate-900 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xl border border-blue-500/30 flex items-center gap-2 backdrop-blur-md animate-bounce"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>JARVIS AI — Shaxsiy Yordamchi</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition transform hover:scale-105 active:scale-95 border ${
            isOpen
              ? 'bg-slate-800 border-slate-700 text-slate-300'
              : 'bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 border-blue-400/40 ring-4 ring-blue-500/20'
          }`}
          title="JARVIS AI Yordamchi"
          aria-label="JARVIS AI"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
            </div>
          )}
        </button>
      </div>

      {/* Assistant Conversation Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-4 sm:right-6 z-50 rounded-3xl shadow-2xl border transition-all duration-300 flex flex-col overflow-hidden backdrop-blur-xl ${
            isExpanded
              ? 'w-[95vw] sm:w-[680px] h-[85vh] max-h-[800px]'
              : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[80vh]'
          } ${
            theme === 'dark'
              ? 'bg-[#0B1220]/95 border-slate-800 text-slate-100'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-blue-500/10'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                    JARVIS AI
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono">
                      v2.4
                    </span>
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {user?.role ? `${user.role.toUpperCase()} yordamchisi` : 'ENVO Intellekti'}
                  <span className="text-slate-500">&bull;</span>
                  <span className="text-blue-400 text-[10px]">{activeView}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              {/* Speaker mute toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setVoiceEnabled(!voiceEnabled);
                }}
                className={`p-2 rounded-lg hover:bg-slate-700/40 transition ${
                  voiceEnabled ? 'text-blue-400' : 'text-slate-500'
                }`}
                title={voiceEnabled ? "Ovozli o'qish yoqilgan" : "Ovoz o'chirilgan"}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Expand / Minimize */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg hover:bg-slate-700/40 transition hidden sm:block"
                title={isExpanded ? "Kichiklashtirish" : "Kengaytirish"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-700/40 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice Indicator Banner if Speaking */}
          {isSpeaking && (
            <div className="px-4 py-1.5 bg-blue-600/20 border-b border-blue-500/30 flex items-center justify-between text-[11px] text-blue-300 animate-pulse">
              <span className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-blue-400" />
                JARVIS gapirmoqda...
              </span>
              <button
                onClick={stopSpeaking}
                className="text-blue-200 hover:text-white font-bold underline"
              >
                To‘xtatish
              </button>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : theme === 'dark'
                      ? 'bg-slate-800/80 text-slate-100 border border-slate-700/60 rounded-bl-xs'
                      : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Optional Quick Action button */}
                  {m.suggestedAction && (
                    <button
                      onClick={() => {
                        setActiveView(m.suggestedAction!.view);
                        setIsOpen(false);
                      }}
                      className="mt-2.5 px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] flex items-center gap-1.5 transition shadow"
                    >
                      <span>{m.suggestedAction.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-150"></div>
                <span>JARVIS tahlil qilmoqda...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-4 py-2 border-t border-slate-800/60 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            {getSuggestedQuestions().map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-800/50 hover:bg-blue-600/30 text-slate-300 hover:text-blue-200 border border-slate-700/50 text-[11px] font-medium transition flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-blue-400 flex-shrink-0" />
                {q}
              </button>
            ))}
          </div>

          {/* Input & Voice Controls */}
          <div className="p-3.5 border-t border-slate-800/60 bg-slate-900/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl border transition ${
                  isListening
                    ? 'bg-red-500 text-white border-red-400 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title={isListening ? "Ovozni eshitishni to'xtatish" : "Ovoz bilan so'rash (Microphone)"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  isListening
                    ? "Sizni eshityapman, gapiring..."
                    : "JARVISga savol bering (dars, guruh, to‘lov)..."
                }
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
