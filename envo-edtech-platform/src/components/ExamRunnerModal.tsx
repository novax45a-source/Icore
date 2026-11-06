/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Award,
} from 'lucide-react';
import { Exam, ExamSubmission } from '../lib/types';
import { mockDb } from '../lib/mockDatabase';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface ExamRunnerModalProps {
  exam: Exam;
  onClose: () => void;
  onCompleted?: (submission: ExamSubmission) => void;
}

export const ExamRunnerModal: React.FC<ExamRunnerModalProps> = ({
  exam,
  onClose,
  onCompleted,
}) => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ExamSubmission | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleTextAnswerChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  const handleSubmit = () => {
    const studentId = user?.id || 'student-demo';
    const studentName = user?.name || 'Mustaqil O‘quvchi';

    const result = mockDb.submitExam(exam.id, studentId, studentName, answers);
    setSubmissionResult(result);
    setIsSubmitted(true);

    if (result.percentage >= exam.passingPoints) {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // Ignore in tests
      }
    }

    if (onCompleted) {
      onCompleted(result);
    }
  };

  const currentQ = exam.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {exam.subject} &bull; Rasmiy Imtihon
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{exam.title}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
                timeLeftSeconds < 300
                  ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isSubmitted && submissionResult ? (
          // Exam Result Screen
          <div className="py-8 text-center space-y-6 overflow-y-auto">
            <div
              className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center ${
                submissionResult.percentage >= exam.passingPoints
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              <Award className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Imtihon Natijasi: {submissionResult.percentage}%
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                To‘plangan ball: <strong>{submissionResult.score}</strong> / {exam.totalPoints} ball
                (O‘tish bali: {exam.passingPoints} ball)
              </p>
              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${
                  submissionResult.percentage >= exam.passingPoints
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {submissionResult.percentage >= exam.passingPoints ? 'Imtihondan o‘tdi ✓' : 'Qayta topshirish tavsiya etiladi'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-lg mx-auto text-xs text-slate-700 text-left space-y-2">
              <p className="font-bold text-slate-900">Ustoz xulosasi:</p>
              <p className="text-slate-600 leading-relaxed">{submissionResult.teacherFeedback}</p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
            >
              Natijani yopish
            </button>
          </div>
        ) : (
          // Active Exam Question Screen
          <div className="flex-1 flex flex-col justify-between py-6 overflow-y-auto">
            {/* Question Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>
                  Savol {currentQuestionIndex + 1} / {exam.questions.length}
                </span>
                <span>
                  {answeredCount} ta savolga javob berildi
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%` }}
                  className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="my-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {currentQuestionIndex + 1}
                </span>
                <p className="text-base font-semibold text-slate-900 leading-relaxed">
                  {currentQ.text}
                </p>
              </div>

              {/* Multiple Choice Options */}
              {currentQ.type === 'multiple_choice' && currentQ.options && (
                <div className="space-y-2.5 pt-2 pl-10">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = answers[currentQ.id] === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, idx)}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs font-medium transition flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 text-blue-900 ring-2 ring-blue-500/30'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 rounded-lg text-[10px] font-bold flex items-center justify-center ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Written Question Input */}
              {currentQ.type === 'written' && (
                <div className="pt-2 pl-10">
                  <textarea
                    rows={4}
                    value={String(answers[currentQ.id] || '')}
                    onChange={(e) => handleTextAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Batafsil javobingizni shu yerga yozing..."
                    className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    * Yozma javoblar o‘qituvchi tomonidan qo‘shimcha tekshirilib baholanadi.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Question Switcher & Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Oldingi savol
              </button>

              {isLastQuestion ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Imtihonni topshirish
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(exam.questions.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                >
                  Keyingi savol
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
