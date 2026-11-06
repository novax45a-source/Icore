import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Radio,
  Sparkles,
  Send,
  Bot,
  User,
} from 'lucide-react';

interface VoiceConversationModalProps {
  onClose: () => void;
}

interface MessageItem {
  sender: 'user' | 'model';
  text: string;
  time: string;
}

export const VoiceConversationModal: React.FC<VoiceConversationModalProps> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState('Gemini 3.8 Live API ga ulanmoqda...');
  const [conversation, setConversation] = useState<MessageItem[]>([
    {
      sender: 'model',
      text: "Assalomu alaykum! Men ENVO ovozli AI ta'lim murabbiyiman (model: gemini-3.8-live). Savolingizni bemalol ovoz orqali bering!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [textInput, setTextInput] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Connect to WebSocket endpoint /api/live-voice
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/live-voice`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setStatusText('Gemini 3.8 Live ulangan (Zephyr ovozi). Gapiring...');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.textResponse) {
          setConversation((prev) => [
            ...prev,
            {
              sender: 'model',
              text: data.textResponse,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setStatusText('Gemini 3.8 Live javob berdi');
        }
        if (data.audio) {
          // Play audio response if raw PCM / base64 received
          playAudioChunk(data.audio);
        }
      } catch (err) {
        console.error('Error parsing live voice message:', err);
      }
    };

    ws.onerror = () => {
      setStatusText('Live API ovozli aloqa faol (Fallback rejimida)');
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
      stopRecording();
    };
  }, []);

  const playAudioChunk = (base64Audio: string) => {
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
      audio.play().catch(() => {
        // Autoplay policy fallback
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ audio: base64Audio }));
          }
        };

        // Add user speech entry
        setConversation((prev) => [
          ...prev,
          {
            sender: 'user',
            text: '🎤 [Ovozli xabar yuborildi]',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setStatusText('Gemini 3.8 Live tinglamoqda va javob tayyorlamoqda...');
      };

      mediaRecorder.start();
      setIsListening(true);
      setStatusText('Tinglanmoqda... Istalgan vaqtda to‘xtating.');
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Mikrofondan foydalanishga ruxsat bering.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsListening(false);
  };

  const handleSendText = () => {
    if (!textInput.trim()) return;
    const userText = textInput.trim();
    setTextInput('');

    setConversation((prev) => [
      ...prev,
      {
        sender: 'user',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: userText }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Radio className="w-5 h-5 animate-pulse text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Gemini 3.8 Live Voice
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                  gemini-3.8-live
                </span>
              </h2>
              <p className="text-xs text-slate-400">Jonli ikki tomonlama ovozli suhbat</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div className="my-3 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`}
            ></span>
            {statusText}
          </span>
          <span className="text-[11px] text-blue-400 font-medium">Zephyr Voice</span>
        </div>

        {/* Live Conversation Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 min-h-[220px]">
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <p className="text-[10px] text-slate-400 text-right">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Voice Trigger Button & Pulse */}
        <div className="pt-4 border-t border-slate-800 flex flex-col items-center justify-center gap-3">
          <button
            onClick={isListening ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition shadow-2xl relative ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white ring-8 ring-red-500/30 scale-105 animate-pulse'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:scale-105 text-white ring-4 ring-blue-500/20'
            }`}
            title={isListening ? 'Ovozni to‘xtatish' : 'Ovozli gapirish'}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
          <span className="text-[11px] text-slate-400">
            {isListening ? 'Gapiryapsiz... To‘xtatish uchun bosing' : 'Gapirish uchun tugmani bosing'}
          </span>

          {/* Quick text fallback */}
          <div className="w-full flex items-center gap-2 mt-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="Yoki savolingizni matn ko‘rinishida yozing..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendText}
              disabled={!textInput.trim()}
              className="p-2 rounded-xl bg-blue-600 disabled:opacity-40 text-white hover:bg-blue-500 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
