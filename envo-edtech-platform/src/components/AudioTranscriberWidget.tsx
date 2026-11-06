import React, { useState, useRef } from 'react';
import { Mic, MicOff, Copy, Check, FileText, Loader2, Sparkles } from 'lucide-react';

interface AudioTranscriberWidgetProps {
  onTranscribed?: (text: string) => void;
  title?: string;
}

export const AudioTranscriberWidget: React.FC<AudioTranscriberWidgetProps> = ({
  onTranscribed,
  title = "Ovozli Dars Yozuvini Matnga Aylantirish (Audio Transcription)",
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
        await sendAudioToTranscribe(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Mic access error:', err);
      alert('Mikrofonga ruxsat berilmadi.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  const sendAudioToTranscribe = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioData: base64Audio,
            mimeType: blob.type || 'audio/webm',
          }),
        });

        const data = await res.json();
        const text = data.text || '';
        setTranscribedText(text);
        if (onTranscribed) {
          onTranscribed(text);
        }
      };
    } catch (err) {
      console.error('Transcription failed:', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const copyToClipboard = () => {
    if (!transcribedText) return;
    navigator.clipboard.writeText(transcribedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              {title}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
                gemini-3.5-transcribe
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              O‘qituvchi tushuntirishi yoki o‘quvchi javobini bir zumda aniq matnga o‘giring
            </p>
          </div>
        </div>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isTranscribing}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isRecording ? 'Yozishni to‘xtatish' : 'Mikrofon orqali yozish'}</span>
        </button>
      </div>

      {isTranscribing && (
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3 text-xs text-indigo-800">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Gemini 3.5 Transcribe audio yozuvni matnga aylantirmoqda...</span>
        </div>
      )}

      {transcribedText && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Transkripsiya natijasi:
            </span>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-white border border-slate-200 transition"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {isCopied ? 'Nusxalandi!' : 'Nusxa olish'}
            </button>
          </div>

          <p className="text-slate-900 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed font-sans">
            "{transcribedText}"
          </p>
        </div>
      )}
    </div>
  );
};
