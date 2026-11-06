import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Bot,
  User,
  ShieldCheck,
  Globe,
  Loader2,
} from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { assessmentResult } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        role: 'model',
        content:
          language === 'uz'
            ? `Assalomu alaykum, ${user?.firstName || 'talaba'}! Men ICSN Xalqaro Ta'lim va Karyera AI Navigatoriman. Qaysi universitetlar, grantlar yoki ta'lim yo'nalishlari bo'yicha maslahat kerak?`
            : language === 'ru'
            ? `Здравствуйте, ${user?.firstName || 'студент'}! Я официальный AI Навигатор ICSN. Чем могу помочь: выбор вуза, поиск стипендий или проверка требований?`
            : `Hello, ${user?.firstName || 'Student'}! I am your ICSN AI Navigator. How can I help you explore university admissions, verified scholarships, or career pathways today?`,
      },
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'Compare Computer Science in Germany vs South Korea',
    'What are the key requirements for DAAD Master Scholarships?',
    'How do I calculate Uni-Assist VPD for German admissions?',
    'What projects strengthen my international robotics portfolio?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const studentContext = {
        name: user?.firstName || 'Student',
        educationLevel: user?.educationLevel,
        interests: user?.interests,
        targetCountries: user?.targetCountries,
        recommendedMajors: assessmentResult?.recommendedMajors,
      };

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          studentContext,
          language,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content: 'I was unable to complete this query at the moment. Please try again.',
          },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content:
            'Connection issue communicating with the AI service. Please verify your network.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'model',
        content: 'Conversation reset. What education or career topic would you like to explore?',
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg h-full bg-white dark:bg-[#0B1020] border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#111C33]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  ICSN AI Navigator
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400">
                  Free
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Verified admissions & scholarship guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white'
                    : 'bg-[#111C33] text-sky-400 border border-slate-800'
                }`}
              >
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-xs shadow-md shadow-sky-600/20'
                    : 'bg-slate-100 dark:bg-[#111C33] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-xs'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Analyzing admissions databases...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts & Input Area */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C33]/60 space-y-3">
          {/* Quick Prompts Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp)}
                className="px-2.5 py-1 rounded-md bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-sky-500 hover:text-sky-400 whitespace-nowrap shrink-0 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about universities, scholarships, requirements..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2 rounded-xl bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-md shadow-sky-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Official sources referenced</span>
            </span>
            <span>Always verify deadlines on official portals</span>
          </div>
        </div>
      </div>
    </div>
  );
};
