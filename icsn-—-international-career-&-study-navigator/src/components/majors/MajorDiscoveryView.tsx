import React, { useState } from 'react';
import { CAREER_AND_MAJOR_FIELDS } from '../../data/careersAndMajors';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { MajorField } from '../../types';
import {
  Compass,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface MajorDiscoveryViewProps {
  onMatchUniversities: (fieldId: string) => void;
  onOpenAi: () => void;
}

export const MajorDiscoveryView: React.FC<MajorDiscoveryViewProps> = ({
  onMatchUniversities,
  onOpenAi,
}) => {
  const { language } = useLanguage();
  const { assessmentResult } = useApp();

  const [selectedField, setSelectedField] = useState<MajorField>(CAREER_AND_MAJOR_FIELDS[0]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#0284C7]/15 text-[#0284C7] dark:text-[#38BDF8]">
              Academic & Career Explorer
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">Curricula, Skills & Pathways</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Career & Major Discovery
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explore international degree requirements, typical responsibilities, and industry sectors.
          </p>
        </div>

        <button
          onClick={onOpenAi}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#0284C7]/15 to-[#0284C7]/15 border border-[#0284C7]/30 text-[#0284C7] dark:text-[#38BDF8] hover:bg-[#0284C7]/25 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Major Advice</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Field Selector List */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            Academic Disciplines ({CAREER_AND_MAJOR_FIELDS.length})
          </span>

          <div className="space-y-1.5">
            {CAREER_AND_MAJOR_FIELDS.map((fld) => {
              const isSelected = selectedField.id === fld.id;
              const isTopAssessmentPick =
                assessmentResult?.topFields?.[0]?.fieldId === fld.id;

              return (
                <button
                  key={fld.id}
                  onClick={() => setSelectedField(fld)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#0284C7]/15 border-[#0284C7] text-[#0284C7] dark:text-white font-bold ring-1 ring-[#0284C7]'
                      : 'bg-white dark:bg-[#11152A] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5 truncate">
                    <p className="truncate font-semibold">{fld.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{fld.category}</p>
                  </div>

                  {isTopAssessmentPick && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 shrink-0">
                      Top Match
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Field Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800/80 pb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                  {selectedField.category}
                </span>
                <button
                  onClick={() => onMatchUniversities(selectedField.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0284C7] text-white hover:bg-[#0369A1] transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Match Universities for this Field</span>
                </button>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedField.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedField.description}
              </p>
            </div>

            {/* Common Responsibilities */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#0284C7]" />
                <span>Typical Daily Responsibilities & Workflows</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedField.commonResponsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Possible University Majors */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#0284C7]" />
                <span>Possible Degree Majors</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedField.possibleMajors.map((maj, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    {maj}
                  </div>
                ))}
              </div>
            </div>

            {/* Useful Skills & Relevant High School Subjects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Useful Skills to Develop
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedField.usefulSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Relevant School Subjects
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedField.relevantSubjects.map((sub, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Opportunities with Salary Range */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Career Opportunities & Market Estimates</span>
              </span>
              <div className="space-y-1.5">
                {selectedField.careerOpportunities.map((career, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  >
                    <span className="text-slate-800 dark:text-slate-200 font-sans font-medium">
                      {career.split('(')[0]}
                    </span>
                    <span className="text-emerald-500 font-semibold text-[11px]">
                      {career.includes('(') ? `(${career.split('(')[1]}` : ''}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 italic">
                *Compensation figures are international industry averages based on verified job boards; individual compensation varies by country, experience, and employer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
