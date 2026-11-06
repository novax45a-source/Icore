import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { calculateTalentDevelopmentIndex } from '../../utils/talentIndexEngine';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Compass,
} from 'lucide-react';

interface TalentIndexViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const TalentIndexView: React.FC<TalentIndexViewProps> = ({ onNavigateToTab }) => {
  const { user } = useAuth();
  const { portfolio, assessmentResult } = useApp();

  const talentData = calculateTalentDevelopmentIndex(user || {}, portfolio, assessmentResult);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              Private Student Development Roadmap
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500 font-medium">No Public Rank or Leaderboard</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Talent & Competency Index
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A growth-oriented framework designed to help you self-assess readiness across 5 core pillars.
          </p>
        </div>

        {/* Readiness Tier Display */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-right">
          <span className="text-[11px] text-slate-400 block">Overall Readiness Tier</span>
          <span className="text-lg font-bold text-[#0284C7] dark:text-[#38BDF8]">
            {talentData.overallReadinessTier}
          </span>
          <span className="text-[10px] text-emerald-500 block">
            {talentData.unlockedOpportunitiesCount} target institutions matched
          </span>
        </div>
      </div>

      {/* Philosophy Statement Callout */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <Lock className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900 dark:text-white block">
            The ICSN Development Philosophy: Growth Over Comparison
          </span>
          <span>
            Unlike public exam scoreboards that induce anxiety, the Talent Index belongs exclusively to you. It measures practical competencies, portfolio development, and concrete milestones to maximize your admission and scholarship odds.
          </span>
        </div>
      </div>

      {/* 5 Development Pillars */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Development Pillars & Personalized Milestones
        </h2>

        <div className="space-y-4">
          {talentData.pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {pillar.name}
                  </h3>
                  <span className="text-xs text-slate-400">Pillar Assessment</span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Tier: {pillar.tier}
                  </span>
                  <span className="text-base font-bold text-[#0284C7] dark:text-[#38BDF8]">
                    {pillar.score} / 100
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0284C7] to-[#0284C7]"
                  style={{ width: `${pillar.score}%` }}
                />
              </div>

              {/* Strengths & Next Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Strengths */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800/60">
                  <span className="font-bold text-slate-900 dark:text-white block text-[11px] uppercase tracking-wider text-emerald-500">
                    Demonstrated Competencies
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {pillar.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Milestones */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800/60">
                  <span className="font-bold text-slate-900 dark:text-white block text-[11px] uppercase tracking-wider text-[#0284C7] dark:text-[#38BDF8]">
                    Recommended Growth Actions
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {pillar.recommendedMilestones.map((ms, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                        <span>{ms}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#11152A] to-[#0B1020] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Ready to upgrade your development indicators?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adding verified projects and completing the 30-Question Assessment directly advances your tier.
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab('portfolio')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-sm transition-colors whitespace-nowrap"
        >
          <span>Enhance Portfolio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
