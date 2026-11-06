import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ASSESSMENT_QUESTIONS } from '../../data/assessmentQuestions';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  GraduationCap,
  Briefcase,
  Compass,
  Globe,
  Award,
  BookOpen,
} from 'lucide-react';

interface AssessmentViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({ onNavigateToTab }) => {
  const { language } = useLanguage();
  const {
    assessmentAnswers,
    saveAssessmentAnswers,
    assessmentResult,
    submitAssessment,
    retakeAssessment,
  } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [localAnswers, setLocalAnswers] = useState<Record<number, number>>(assessmentAnswers);
  const [viewingResult, setViewingResult] = useState<boolean>(Boolean(assessmentResult));

  const currentQ = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const answeredCount = Object.keys(localAnswers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    const updated = { ...localAnswers, [questionId]: optionIndex };
    setLocalAnswers(updated);
    saveAssessmentAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Finish test
      submitAssessment(localAnswers);
      setViewingResult(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    retakeAssessment();
    setLocalAnswers({});
    setCurrentQuestionIndex(0);
    setViewingResult(false);
  };

  // If viewing completed results
  if (viewingResult && assessmentResult) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto pb-12">
        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#11152A] to-[#0B1020] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>30-Question Assessment Completed</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-400">
                  {new Date(assessmentResult.completedAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Your Academic & Career Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {assessmentResult.answersImpactSummary}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </button>
              <button
                onClick={() => onNavigateToTab('universities')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-sm transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Match Universities</span>
              </button>
            </div>
          </div>
        </div>

        {/* Top 3 Recommended Fields */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#0284C7]" />
            <span>Top Recommended Academic Fields</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assessmentResult.topFields.map((field, idx) => (
              <div
                key={field.fieldId}
                className="p-5 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      #{idx + 1} Match
                    </span>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#0284C7]/15 text-[#0284C7] dark:text-[#38BDF8]">
                      {field.matchPercent}% Alignment
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {field.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {field.explanation}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => onNavigateToTab('discovery')}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Explore field curricula</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recommended Majors */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <GraduationCap className="w-4 h-4 text-[#0284C7]" />
              <span>Recommended University Majors</span>
            </div>
            <ul className="space-y-2.5">
              {assessmentResult.recommendedMajors.map((major, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-100 dark:border-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <span>{major}</span>
                  <span className="text-[11px] text-slate-400 font-mono">Top Pick</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Career Directions */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <span>Potential Career Directions</span>
            </div>
            <ul className="space-y-2.5">
              {assessmentResult.careerDirections.map((career, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-100 dark:border-slate-800/60 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <span>{career}</span>
                  <span className="text-[11px] text-emerald-500 font-mono">High Demand</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Destinations */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Globe className="w-4 h-4 text-amber-500" />
              <span>Recommended Study Destinations</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {assessmentResult.recommendedDestinations.map((dest, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-100 dark:border-slate-800/60"
                >
                  <p className="font-semibold text-slate-900 dark:text-white">{dest}</p>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Strong post-study work visa permissions, extensive research institutes, and scholarship programs.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>High-Impact Learning Activities</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {assessmentResult.suggestedLearningActivities.map((act, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Question Flow Interface
  const qCategory =
    language === 'uz'
      ? currentQ.categoryUz
      : language === 'ru'
      ? currentQ.categoryRu
      : currentQ.category;
  const qText =
    language === 'uz'
      ? currentQ.questionUz
      : language === 'ru'
      ? currentQ.questionRu
      : currentQ.question;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Progress & Category Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-sky-400">{qCategory}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-mono">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          <span className="text-slate-500 font-mono">{progressPercent}% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Selector Numbers (1-30) */}
        <div className="flex flex-wrap gap-1 pt-2">
          {ASSESSMENT_QUESTIONS.map((q, idx) => {
            const isAnswered = localAnswers[q.id] !== undefined;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-7 h-7 rounded-md text-[11px] font-mono font-medium transition-all ${
                  isCurrent
                    ? 'bg-sky-600 text-white ring-2 ring-sky-500/40 shadow-sm'
                    : isAnswered
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-[#111C33] text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title={`Jump to Question ${q.id}`}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
          {qText}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = localAnswers[currentQ.id] === optIdx;
            const optLabel =
              language === 'uz' ? opt.textUz : language === 'ru' ? opt.textRu : opt.text;

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500 text-slate-900 dark:text-white ring-1 ring-sky-500'
                    : 'bg-slate-50 dark:bg-[#0B1120] border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-sky-500 bg-sky-500 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-transparent'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="leading-relaxed">{optLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={localAnswers[currentQ.id] === undefined}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-sky-600/20"
          >
            <span>
              {currentQuestionIndex === totalQuestions - 1 ? 'Complete & View Roadmap' : 'Next Question'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
