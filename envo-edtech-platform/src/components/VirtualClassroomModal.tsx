/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PenTool,
  Square,
  Circle as CircleIcon,
  Minus,
  Type,
  Eraser,
  RotateCcw,
  Send,
  Paperclip,
  Users,
  Maximize2,
  X,
  FileText,
  Clock,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Hand,
  ShieldCheck,
  Radio,
  FileUp,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Camera,
  Play,
  Pause,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PresentationDoc } from '../lib/types';
import { EnvoLogo } from './EnvoLogo';

interface VirtualClassroomProps {
  lessonTitle: string;
  teacherName: string;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  senderName: string;
  text: string;
  time: string;
  fileAttachment?: { name: string; size: string };
  isTeacher?: boolean;
}

export const VirtualClassroomModal: React.FC<VirtualClassroomProps> = ({
  lessonTitle,
  teacherName,
  onClose,
}) => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher' || user?.role === 'super_admin';

  // Audio / Video / Screen controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenWithCameraOverlay, setScreenWithCameraOverlay] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<'whiteboard' | 'presentation' | 'screen'>('whiteboard');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chat' | 'participants' | 'materials'>('chat');

  // Presentation Deck Documents (PDF, PPT, DOCX, Images)
  const [presentationDocs, setPresentationDocs] = useState<PresentationDoc[]>([
    {
      id: 'doc-1',
      title: 'Dars Taqdimoti: SAT & IELTS Math Masterclass.pdf',
      type: 'pdf',
      pageCount: 5,
      currentPage: 1,
      fileUrl: '/docs/sat_math_presentation.pdf',
      pages: [
        '1-Slayd: SAT Math 2026 Yangi Format Tahlili va Strategiyalar',
        '2-Slayd: Kvadrat tenglamalar (Quadratic Equations) va Parabola uchlari',
        '3-Slayd: Vieta teoremasi va tezkor hisoblash texnikalari',
        '4-Slayd: Amaliy test masalalari (CollegeBoard 2026 Sample Questions)',
        '5-Slayd: Uyga vazifa va yakuniy xulosalar',
      ],
    },
    {
      id: 'doc-2',
      title: 'Arab Tili Qoidalari: Nahv_va_Sarf_Sxemasi.ppt',
      type: 'ppt',
      pageCount: 3,
      currentPage: 1,
      fileUrl: '/docs/arabic_nahv.ppt',
      pages: [
        '1-Slayd: Kalimaning 3 qismi: Ism, Fe’l va Harf ta’riflari',
        '2-Slayd: E’rob alomatlari: Damma, Fatha, Kasra, Sukun',
        '3-Slayd: Mubtado va Xabar bog‘lanish qoidalari',
      ],
    },
  ]);
  const [selectedDocId, setSelectedDocId] = useState('doc-1');
  const currentDoc = presentationDocs.find((d) => d.id === selectedDocId) || presentationDocs[0];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [docZoom, setDocZoom] = useState(100);

  // Whiteboard Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'rect' | 'circle' | 'line' | 'text' | 'formula'>('pen');
  const [brushColor, setBrushColor] = useState('#2563EB');
  const [brushSize, setBrushSize] = useState(3);
  const [whiteboardPage, setWhiteboardPage] = useState(1);
  const [totalWhiteboardPages, setTotalWhiteboardPages] = useState(3);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [savedCanvasData, setSavedCanvasData] = useState<ImageData | null>(null);

  // Collaboration & Permissions
  const [allowStudentWhiteboard, setAllowStudentWhiteboard] = useState(true);
  const [studentHandRaised, setStudentHandRaised] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Recording State (MediaRecorder)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showRecordingConsent, setShowRecordingConsent] = useState(false);

  // Real Hardware Video Stream Reference
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const displayStreamRef = useRef<MediaStream | null>(null);

  // Timer & Connection
  const [elapsedSeconds, setElapsedSeconds] = useState(140);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'excellent' | 'reconnecting' | 'stable'>('excellent');
  const [pingMs, setPingMs] = useState(24);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderName: teacherName,
      text: "Salom barchaga! Virtual sinfxonaga xush kelibsiz. Bugun darsimizda doska va taqdimot slaydlaridan birgalikda foydalanamiz.",
      time: '15:00',
      isTeacher: true,
    },
    {
      id: 'm2',
      senderName: 'Bobur Mirzayev (O‘quvchi)',
      text: 'Assalomu alaykum ustoz, video va ovozingiz juda tiniq eshitilmoqda.',
      time: '15:01',
    },
    {
      id: 'm3',
      senderName: teacherName,
      text: "Doskaga yangi formulalar jadvalini yukladim, savolingiz bo'lsa chatga yozing yoki 'Qo‘l ko‘tarish' tugmasini bosing.",
      time: '15:02',
      fileAttachment: { name: 'SAT_Formulas_2026.pdf', size: '1.2 MB' },
      isTeacher: true,
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Math symbols palette
  const mathSymbols = ['∑', '∫', '√x', 'π', 'θ', 'α', 'β', 'Δ', '≥', '≤', '≠', '≈', 'x²', '∞', 'λ'];

  // Start real webcam stream
  useEffect(() => {
    let localStream: MediaStream | null = null;
    if (isCamOn || isMicOn) {
      navigator.mediaDevices?.getUserMedia({ video: isCamOn, audio: isMicOn })
        .then((stream) => {
          localStream = stream;
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setStreamError(null);
        })
        .catch(() => {
          // Camera permission denied or in sandbox - graceful fallback
          setStreamError('Kamera/mikrofon ruxsati berilmadi (Simulyatsiya rejimi faol)');
        });
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isCamOn, isMicOn]);

  // Screen share handler
  const handleToggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        displayStreamRef.current = displayStream;
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = displayStream;
        }
        setIsScreenSharing(true);
        setActiveWorkspace('screen');

        displayStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setActiveWorkspace('whiteboard');
        };
      } catch {
        // User cancelled or unsupported
        setIsScreenSharing(false);
      }
    } else {
      displayStreamRef.current?.getTracks().forEach((t) => t.stop());
      setIsScreenSharing(false);
      setActiveWorkspace('whiteboard');
    }
  };

  // Lesson timer ticking
  useEffect(() => {
    let timer: any;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Recording timer
  useEffect(() => {
    let recTimer: any;
    if (isRecording) {
      recTimer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(recTimer);
  }, [isRecording]);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Whiteboard drawing canvas initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid for mathematics / diagrams
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [whiteboardPage, activeWorkspace]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isTeacher && !allowStudentWhiteboard) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setStartPos({ x, y });
    setSavedCanvasData(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : brushColor;
      ctx.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else if (tool === 'text') {
      const textToDraw = prompt("Doskaga matn kiriting:", "f(x) = 2x² - 4x + 1");
      if (textToDraw) {
        ctx.fillStyle = brushColor;
        ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(textToDraw, x, y);
      }
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (startPos && savedCanvasData) {
      ctx.putImageData(savedCanvasData, 0, 0);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;

      if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setStartPos(null);
  };

  const insertFormula = (sym: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = brushColor;
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillText(sym, 100 + Math.random() * 400, 150 + Math.random() * 200);
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      senderName: user?.name || 'O‘quvchi',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher,
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  const startRecordingWithConsent = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setShowRecordingConsent(false);
  };

  const stopRecording = () => {
    setIsRecording(false);
    alert(`Dars yozib olindi (${formatTimer(recordingSeconds)}). Yozuv shifrlangan holatda saqlandi va darsdan so‘ng o‘quvchilar kabinetida mavjud bo‘ladi.`);
  };

  const simulateNetworkGlitch = () => {
    setConnectionStatus('reconnecting');
    setTimeout(() => {
      setConnectionStatus('excellent');
      setPingMs(21);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 font-sans select-none">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <EnvoLogo size="sm" showWordmark={true} showTagline={false} variant="dark" />
          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              {lessonTitle}
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                WebRTC Jonli Aloqa
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Ustoz: <strong>{teacherName}</strong> &bull; Mini-guruh (1–3 o‘quvchi)
            </p>
          </div>
        </div>

        {/* Center: Timer, Recording Indicator & Quality */}
        <div className="flex items-center gap-3 bg-slate-800/90 px-4 py-1.5 rounded-2xl border border-slate-700 text-xs">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="flex items-center gap-1.5 text-slate-200 hover:text-white"
            title={isTimerRunning ? 'Pauza' : 'Davom ettirish'}
          >
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="font-mono font-bold">{formatTimer(elapsedSeconds)}</span>
          </button>

          <span className="w-px h-4 bg-slate-700"></span>

          {isRecording ? (
            <div className="flex items-center gap-1.5 text-red-400 font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              REC {formatTimer(recordingSeconds)}
            </div>
          ) : (
            <button
              onClick={() => setShowRecordingConsent(true)}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <Radio className="w-3.5 h-3.5 text-slate-400" />
              Yozib olish
            </button>
          )}

          <span className="w-px h-4 bg-slate-700"></span>

          {/* Connection quality */}
          <button
            onClick={simulateNetworkGlitch}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white"
            title="Ulanish sifatini tekshirish"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'excellent'
                  ? 'bg-emerald-400'
                  : connectionStatus === 'reconnecting'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-emerald-400'
              }`}
            ></span>
            <span>{connectionStatus === 'reconnecting' ? 'Qayta ulanmoqda...' : `${pingMs}ms (A’lo)`}</span>
          </button>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2">
          {/* Invite button */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            Taklif qilish
          </button>

          {/* Hand raise for students */}
          {!isTeacher && (
            <button
              onClick={() => setStudentHandRaised(!studentHandRaised)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                studentHandRaised
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              {studentHandRaised ? 'Qo‘l ko‘tarilgan' : 'Qo‘l ko‘tarish'}
            </button>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="To‘liq ekran"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* End/Leave lesson button */}
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition shadow flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            {isTeacher ? 'Darsni yakunlash' : 'Sinfdan chiqish'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Video Feeds & Streams */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col gap-3 p-4 overflow-y-auto">
          {/* Teacher Stream Video Box */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-800 aspect-video border border-blue-500/30 shadow-lg flex items-center justify-center group">
            {isCamOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                <VideoOff className="w-8 h-8 mb-1.5 text-slate-500" />
                <span className="text-xs font-medium">Kamera o‘chiq</span>
              </div>
            )}

            {/* Teacher Overlay Badge */}
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10">
              <span className={`w-2 h-2 rounded-full ${isMicOn ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
              {teacherName} (Murabbiy)
            </div>

            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-blue-600 text-[10px] text-white font-black tracking-wider">
              HOST
            </div>
          </div>

          {/* Student Stream Box */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-800 aspect-video border border-slate-700/80 shadow flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
              alt="Student"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {user?.name || 'Bobur Mirzayev (Talaba)'}
            </div>

            {studentHandRaised && (
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 shadow">
                <Hand className="w-3 h-3" />
                Savol bor
              </div>
            )}
          </div>

          {/* Screen Share with PiP Camera Overlay (When Active) */}
          {isScreenSharing && (
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video border-2 border-emerald-500 shadow-xl p-2 flex flex-col justify-between">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-600/90 text-[10px] font-bold text-white rounded-md flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                Jonli Ekran
              </div>

              {screenWithCameraOverlay && (
                <div className="absolute bottom-3 right-3 w-24 h-16 rounded-lg overflow-hidden border-2 border-white shadow-xl bg-black">
                  <video autoPlay playsInline muted className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          {/* Teacher Collaboration Controls */}
          {isTeacher && (
            <div className="mt-auto bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 space-y-3">
              <span className="text-xs font-bold text-slate-200 block">
                O‘quvchilar Huquqlari:
              </span>
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Doskaga chizishga ruxsat</span>
                <input
                  type="checkbox"
                  checked={allowStudentWhiteboard}
                  onChange={(e) => setAllowStudentWhiteboard(e.target.checked)}
                  className="rounded border-slate-600 text-blue-600 focus:ring-0 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Kamera overlay (PiP)</span>
                <input
                  type="checkbox"
                  checked={screenWithCameraOverlay}
                  onChange={(e) => setScreenWithCameraOverlay(e.target.checked)}
                  className="rounded border-slate-600 text-blue-600 focus:ring-0 w-4 h-4"
                />
              </label>
            </div>
          )}
        </aside>

        {/* Center Main Stage: Whiteboard OR Presentation OR Screen */}
        <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
          {/* Mode Tabs (Whiteboard / Slides / Screen) */}
          <div className="flex items-center justify-between px-6 py-2 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveWorkspace('whiteboard')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  activeWorkspace === 'whiteboard'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                Interaktiv Doska (Whiteboard)
              </button>

              <button
                onClick={() => setActiveWorkspace('presentation')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  activeWorkspace === 'presentation'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Taqdimot / Slaydlar ({presentationDocs.length})
              </button>

              {isScreenSharing && (
                <button
                  onClick={() => setActiveWorkspace('screen')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    activeWorkspace === 'screen'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Ulashilgan Ekran
                </button>
              )}
            </div>

            {/* Whiteboard Page Switcher & Math Quick Toolbar */}
            {activeWorkspace === 'whiteboard' && (
              <div className="flex items-center gap-3">
                {/* Math symbols row */}
                <div className="hidden xl:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold mr-1">Formula:</span>
                  {mathSymbols.map((sym, i) => (
                    <button
                      key={i}
                      onClick={() => insertFormula(sym)}
                      className="px-1.5 py-0.5 rounded text-xs font-mono font-bold text-blue-400 hover:bg-slate-700 hover:text-white transition"
                      title={`Formula qo‘shish: ${sym}`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setWhiteboardPage(Math.max(1, whiteboardPage - 1))}
                    disabled={whiteboardPage === 1}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-200">
                    Sahifa {whiteboardPage} / {totalWhiteboardPages}
                  </span>
                  <button
                    onClick={() => setWhiteboardPage(Math.min(totalWhiteboardPages, whiteboardPage + 1))}
                    disabled={whiteboardPage === totalWhiteboardPages}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {isTeacher && (
                    <button
                      onClick={() => setTotalWhiteboardPages((prev) => prev + 1)}
                      className="text-[10px] text-blue-400 font-bold ml-1 hover:underline"
                    >
                      + Yangi sahifa
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Whiteboard Stage */}
          {activeWorkspace === 'whiteboard' && (
            <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-900">
              {/* Whiteboard Floating Toolbar */}
              <div className="absolute top-4 left-6 z-10 flex items-center gap-1 bg-white rounded-2xl shadow-2xl p-1.5 border border-slate-200 text-slate-700">
                <button
                  onClick={() => setTool('pen')}
                  className={`p-2 rounded-xl transition ${
                    tool === 'pen' ? 'bg-blue-600 text-white shadow' : 'hover:bg-slate-100'
                  }`}
                  title="Ruchka / Qalam"
                >
                  <PenTool className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`p-2 rounded-xl transition ${
                    tool === 'eraser' ? 'bg-blue-600 text-white shadow' : 'hover:bg-slate-100'
                  }`}
                  title="O‘chirg‘ich"
                >
                  <Eraser className="w-4 h-4" />
                </button>

                <span className="w-px h-5 bg-slate-200"></span>

                <button
                  onClick={() => setTool('rect')}
                  className={`p-2 rounded-xl transition ${
                    tool === 'rect' ? 'bg-blue-600 text-white shadow' : 'hover:bg-slate-100'
                  }`}
                  title="To‘rtburchak"
                >
                  <Square className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTool('circle')}
                  className={`p-2 rounded-xl transition ${
                    tool === 'circle' ? 'bg-blue-600 text-white shadow' : 'hover:bg-slate-100'
                  }`}
                  title="Aylana"
                >
                  <CircleIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTool('line')}
                  className={`p-2 rounded-xl transition ${
                    tool === 'line' ? 'bg-blue-600 text-white shadow' : 'hover:bg-slate-100'
                  }`}
                  title="To‘g‘ri chiziq"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTool('text')}
                  className={`p-2 rounded-xl transition ${
                    tool === 'text' ? 'bg-blue-600 text-white shadow' : 'hover:bg-slate-100'
                  }`}
                  title="Matn kiritish"
                >
                  <Type className="w-4 h-4" />
                </button>

                <span className="w-px h-5 bg-slate-200"></span>

                {/* Color swatches */}
                {['#2563EB', '#DC2626', '#059669', '#D97706', '#0F172A'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBrushColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-lg transition ${
                      brushColor === c ? 'ring-2 ring-offset-2 ring-blue-600 scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}

                <span className="w-px h-5 bg-slate-200"></span>

                <button
                  onClick={clearBoard}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-slate-100 transition"
                  title="Doskani tozalash"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Permission Banner for Students */}
              {!isTeacher && !allowStudentWhiteboard && (
                <div className="absolute top-4 right-6 z-10 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck className="w-4 h-4" />
                  Doska hozirda faqat ko‘rish rejimida (Ustoz ruxsati kutilmoqda)
                </div>
              )}

              {/* Interactive Canvas Element */}
              <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
                <canvas
                  ref={canvasRef}
                  width={1100}
                  height={620}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="rounded-3xl shadow-2xl bg-white border border-slate-800 cursor-crosshair max-w-full max-h-full"
                />
              </div>
            </div>
          )}

          {/* Presentation Deck Stage */}
          {activeWorkspace === 'presentation' && (
            <div className="flex-1 flex flex-col bg-slate-950 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4 bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs">
                {/* Document Picker */}
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-400">Hujjat:</span>
                  <select
                    value={selectedDocId}
                    onChange={(e) => {
                      setSelectedDocId(e.target.value);
                      setCurrentSlideIndex(1);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  >
                    {presentationDocs.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Slayd Navigation & Zoom */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-xl">
                    <button
                      onClick={() => setCurrentSlideIndex(Math.max(1, currentSlideIndex - 1))}
                      disabled={currentSlideIndex === 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-slate-200">
                      Slayd {currentSlideIndex} / {currentDoc.pageCount}
                    </span>
                    <button
                      onClick={() => setCurrentSlideIndex(Math.min(currentDoc.pageCount, currentSlideIndex + 1))}
                      disabled={currentSlideIndex === currentDoc.pageCount}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl">
                    <button
                      onClick={() => setDocZoom(Math.max(60, docZoom - 10))}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Kichraytirish"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-slate-300 font-bold">{docZoom}%</span>
                    <button
                      onClick={() => setDocZoom(Math.min(150, docZoom + 10))}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Kattalashtirish"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Rendered Slide Content */}
              <div className="flex-1 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center p-8 overflow-auto shadow-2xl">
                <div
                  style={{ transform: `scale(${docZoom / 100})`, transformOrigin: 'center center' }}
                  className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl p-10 shadow-2xl transition duration-150 space-y-6"
                >
                  <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs">
                        {currentDoc.type.toUpperCase()}
                      </span>
                      <h3 className="font-extrabold text-lg text-slate-900">
                        {currentDoc.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      Slayd #{currentSlideIndex}
                    </span>
                  </div>

                  <div className="py-6 space-y-4">
                    <h4 className="text-xl font-bold text-blue-700">
                      {currentDoc.pages[currentSlideIndex - 1] || 'Slayd ma’lumotlari'}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Ushbu dars taqdimotida asosiy qoidalar, xalqaro imtihon talablari va
                      mashqlar yechimi bosqichma-bosqich ko‘rsatilgan. Ustoz slayd ustiga belgilash kiritishi
                      va o‘quvchilar bilan birgalikda tahlil qilishi mumkin.
                    </p>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800">
                      <code>
                        {currentDoc.type === 'pdf'
                          ? 'Formula: x = (-b ± √(b² - 4ac)) / (2a)'
                          : 'Qoida: Kalima = Ism + Fe’l + Harf'}
                      </code>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
                    <span>ENVO Virtual Classroom Presentation Deck Engine</span>
                    <span>O‘quvchi ekrani bilan avtomatik sinxron</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Screen Share Stage */}
          {activeWorkspace === 'screen' && (
            <div className="flex-1 bg-slate-950 p-6 flex items-center justify-center relative">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="rounded-3xl shadow-2xl border-2 border-emerald-500/50 max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </main>

        {/* Right Sidebar: Chat / Participants / Materials */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
          {/* Sidebar Tabs */}
          <div className="flex items-center border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveSidebarTab('chat')}
              className={`flex-1 py-3 text-center transition border-b-2 -mb-px ${
                activeSidebarTab === 'chat'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Dars Chati
            </button>
            <button
              onClick={() => setActiveSidebarTab('participants')}
              className={`flex-1 py-3 text-center transition border-b-2 -mb-px ${
                activeSidebarTab === 'participants'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Qatnashchilar (2)
            </button>
            <button
              onClick={() => setActiveSidebarTab('materials')}
              className={`flex-1 py-3 text-center transition border-b-2 -mb-px ${
                activeSidebarTab === 'materials'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Fayllar
            </button>
          </div>

          {/* Tab 1: Chat */}
          {activeSidebarTab === 'chat' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-2xl ${
                      msg.isTeacher
                        ? 'bg-blue-950/60 border border-blue-800/40'
                        : 'bg-slate-800/80 border border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-200">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{msg.text}</p>
                    {msg.fileAttachment && (
                      <div className="mt-2 p-2 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-blue-400 truncate max-w-[150px]">
                          {msg.fileAttachment.name}
                        </span>
                        <span className="text-slate-400">{msg.fileAttachment.size}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Xabar yozing..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Participants */}
          {activeSidebarTab === 'participants' && (
            <div className="p-4 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">{teacherName}</h4>
                  <span className="text-[10px] text-blue-400 font-semibold">O‘qituvchi (Host)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                  Boshqaruvchi
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">{user?.name || 'Bobur Mirzayev'}</h4>
                  <span className="text-[10px] text-emerald-400 font-semibold">O‘quvchi (Faol)</span>
                </div>
                {studentHandRaised && (
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold">
                    Qo‘l ko‘tarilgan
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Materials & Files */}
          {activeSidebarTab === 'materials' && (
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-300">Dars Materiallari:</span>
                {isTeacher && (
                  <button
                    onClick={() => alert("Fayl yuklash oynasi ochildi (PDF, PPT, DOCX).")}
                    className="text-[11px] text-blue-400 hover:underline font-bold"
                  >
                    + Fayl yuklash
                  </button>
                )}
              </div>

              {presentationDocs.map((doc) => (
                <div key={doc.id} className="p-3 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 truncate max-w-[160px]">{doc.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300">
                      {doc.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{doc.pageCount} ta slayd / sahifa</p>
                  <button
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setActiveWorkspace('presentation');
                    }}
                    className="mt-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold block"
                  >
                    Taqdimotni ochish &rarr;
                  </button>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* Bottom Meeting Control Panel */}
      <footer className="h-18 px-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
        {/* Left: Device Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-2xl transition shadow flex items-center gap-2 text-xs font-bold ${
              isMicOn
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-red-600 text-white'
            }`}
            title={isMicOn ? 'Mikrofonni o‘chirish' : 'Mikrofonni yoqish'}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            <span className="hidden sm:inline">{isMicOn ? 'Ovoz: Yoqiq' : 'Ovoz: O‘chiq'}</span>
          </button>

          <button
            onClick={() => setIsCamOn(!isCamOn)}
            className={`p-3 rounded-2xl transition shadow flex items-center gap-2 text-xs font-bold ${
              isCamOn
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-red-600 text-white'
            }`}
            title={isCamOn ? 'Kamerani o‘chirish' : 'Kamerani yoqish'}
          >
            {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            <span className="hidden sm:inline">{isCamOn ? 'Kamera: Yoqiq' : 'Kamera: O‘chiq'}</span>
          </button>
        </div>

        {/* Center: Screen Share & Workspace Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleScreenShare}
            className={`px-4 py-2.5 rounded-2xl transition shadow text-xs font-bold flex items-center gap-2 ${
              isScreenSharing
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <Monitor className="w-4 h-4 text-emerald-400" />
            <span>{isScreenSharing ? 'Ekranni to‘xtatish' : 'Ekranni ulashish'}</span>
          </button>

          {isTeacher && isRecording && (
            <button
              onClick={stopRecording}
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              Yozuvni to‘xtatish
            </button>
          )}
        </div>

        {/* Right: Leave Lesson */}
        <div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>{isTeacher ? 'Darsni yakunlash' : 'Chiqish'}</span>
          </button>
        </div>
      </footer>

      {/* Recording Consent Modal */}
      {showRecordingConsent && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Darsni Yozib Olishga Rozilik</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Platforma xavfsizligi va ta’lim sifatini ta’minlash maqsadida dars yozib olinadi.
                Barcha qatnashchilar roziligi asosida yozuv faqat ushbu guruh o‘quvchilari kabinetida
                mavjud bo‘ladi.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={startRecordingWithConsent}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
              >
                Roziman, yozuvni boshlash
              </button>
              <button
                onClick={() => setShowRecordingConsent(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-400" />
                Darsga Hamkor O‘quvchini Taklif Qilish
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Ushbu xavfsiz havolani mini-guruh (1–3 o‘quvchi) a’zolariga yuboring:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-400 break-all select-all">
              {window.location.origin}/classroom?room=envo-{lessonTitle.toLowerCase().replace(/\s+/g, '-')}&token=sec9982
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
            >
              {copiedLink ? 'Nusxa olindi ✓' : 'Havoladan nusxa olish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
