import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { IcsnLogo } from '../common/IcsnLogo';
import {
  Sparkles,
  ArrowRight,
  Compass,
  GraduationCap,
  Award,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building,
  Briefcase,
  Lock,
  ChevronRight,
} from 'lucide-react';

interface LandingPageProps {
  onStartAssessment: () => void;
  onExploreDashboard: (tab?: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onExploreDashboard,
  onOpenAuth,
}) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32">
        {/* Subtle geometric background illumination */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#0284C7]/20 blur-[120px]" />
          <div className="absolute top-[10%] right-[20%] w-[450px] h-[450px] rounded-full bg-[#10B981]/15 blur-[130px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Prominent Emblem & Wordmark */}
            <div className="flex justify-center pb-2">
              <IcsnLogo size="lg" />
            </div>

            {/* Mission Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1120] border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium">100% Free Core Access for Every Student</span>
              <span className="text-slate-600">·</span>
              <span className="text-sky-400 font-semibold">Verified Global Pathways</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Your Future. <br className="hidden sm:inline" />
              Your Opportunities.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#0284C7]">
                Your Path.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              ICSN is the comprehensive, student-first platform designed to guide you from early academic curiosity to verified international scholarships, elite university matches, and professional portfolio development.
            </p>

            {/* CTA Group */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onStartAssessment}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#0284C7] to-[#0284C7] hover:opacity-95 shadow-lg shadow-[#0284C7]/20 transition-all hover:scale-[1.02]"
              >
                <span>Take 30-Question Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onExploreDashboard('universities')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-200 bg-[#11152A] border border-slate-800 hover:bg-slate-900 transition-colors"
              >
                <span>Explore Universities & Grants</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Admissions Data</span>
              </div>
              <span className="hidden sm:inline text-slate-700">·</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#38BDF8]" />
                <span>Strict Student Privacy Defaults</span>
              </div>
              <span className="hidden sm:inline text-slate-700">·</span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                <span>Server-Side Multilingual AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="py-20 border-y border-slate-800/80 bg-[#11152A]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              A Complete Global Education Ecosystem
            </h2>
            <p className="text-sm text-slate-400">
              Everything an ambitious student needs to research, prepare, track, and showcase their qualifications without expensive agency fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: 30-Question Discovery */}
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 hover:border-[#0284C7]/40 transition-colors flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/15 flex items-center justify-center text-[#0284C7]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                  30-Question Career Discovery Test
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Scientifically structured across 12 distinct dimensions — from quantitative aptitude and study environment preferences to financial boundaries and international language readiness.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">12 Dimensional Areas</span>
                <button
                  onClick={onStartAssessment}
                  className="text-xs font-semibold text-[#0284C7] hover:text-[#38BDF8] inline-flex items-center gap-1"
                >
                  <span>Start Test</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: 18-Factor University Matching */}
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 hover:border-[#0284C7]/40 transition-colors flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/15 flex items-center justify-center text-[#0284C7]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#0284C7] transition-colors">
                  Intelligent University Matching
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluating 18 real admission factors including your current GPA, IELTS/TOEFL scores, tuition ceilings, post-study work visa rights, and campus safety metrics.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">18-Factor Weighted Engine</span>
                <button
                  onClick={() => onExploreDashboard('universities')}
                  className="text-xs font-semibold text-[#0284C7] hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore Matches</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Priority V1 Portfolio Builder */}
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    Professional Portfolio Builder
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                    Priority V1
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Build and export a verified student portfolio covering STEM projects, Olympiads, volunteer initiatives, and language proficiencies with AI-powered resume enhancement.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Exportable & Shareable</span>
                <button
                  onClick={() => onExploreDashboard('portfolio')}
                  className="text-xs font-semibold text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Build Portfolio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 4: Verified Scholarships */}
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 hover:border-amber-500/40 transition-colors flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                  Verified Global Grants & Scholarships
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct access to real government-funded opportunities: DAAD (Germany), Chevening (UK), Fulbright (USA), GKS (South Korea), and Stipendium Hungaricum.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Official Links & Deadlines</span>
                <button
                  onClick={() => onExploreDashboard('scholarships')}
                  className="text-xs font-semibold text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Search Grants</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 5: Application Tracker */}
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 hover:border-[#0284C7]/40 transition-colors flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/15 flex items-center justify-center text-[#0284C7]">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                  Application & Document Tracker
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage application stages from Researching to Submitted. Never miss a deadline with automatic document checklists and countdown timelines.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Document Checklist</span>
                <button
                  onClick={() => onExploreDashboard('applications')}
                  className="text-xs font-semibold text-[#0284C7] hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Tracker</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 6: Startup & Opportunities Network */}
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 hover:border-[#0284C7]/40 transition-colors flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/15 flex items-center justify-center text-[#0284C7]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#0284C7] transition-colors">
                  Opportunities & Startup Network
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect with student co-founders, apply for summer research fellowships at CERN, remote tech internships, and global youth competitions.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Student Innovation Hub</span>
                <button
                  onClick={() => onExploreDashboard('opportunities')}
                  className="text-xs font-semibold text-[#0284C7] hover:underline inline-flex items-center gap-1"
                >
                  <span>Discover Roles</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Navigator Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#11152A] to-[#0B1020] border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/15 border border-[#0284C7]/30 text-xs text-[#38BDF8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multilingual Server-Side Gemini Intelligence</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              An AI Navigator That Knows Admissions Truths
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike generic chatbots, the ICSN AI Navigator distinguishes verified facts from suggestions. It cites actual official university admission websites, highlights application pitfalls, and answers fluently in English, Uzbek, and Russian.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero false admission guarantees — grounded in official requirements.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-click AI Portfolio Polish to quantify project impact and outcomes.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Secure server-side processing with zero client-side key exposure.</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onExploreDashboard('ai_assistant')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] transition-colors"
              >
                <span>Try AI Navigator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Partner Section */}
      <section className="py-16 border-t border-slate-800/80 bg-[#11152A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                For Schools, Scholarship Providers & Employers
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                ICSN is free for students, funded by verified institutional partnerships with schools seeking guidance dashboards, scholarship funds seeking qualified candidates, and ethical recruiters.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onExploreDashboard('partners')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-[#11152A] border border-slate-700 hover:bg-slate-800 transition-colors"
                >
                  <Building className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Explore Partner Portals</span>
                </button>
              </div>
            </div>

            {/* Privacy Card */}
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Student Safety First</span>
              </div>
              <h3 className="text-base font-semibold text-white">Non-Negotiable Privacy Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Student profiles are private by default. Under-18 students have contact information shielded, and employers may only connect through consent-based matchmaking. No student data is ever sold.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 bg-[#0B1020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">ICSN Navigator</span>
            <span>·</span>
            <span>International Career & Study Navigator</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onExploreDashboard('settings')} className="hover:text-slate-300">
              Privacy Policy
            </button>
            <button onClick={() => onExploreDashboard('settings')} className="hover:text-slate-300">
              Student Safety Terms
            </button>
            <button onClick={() => onExploreDashboard('settings')} className="hover:text-slate-300">
              Official Data Sources
            </button>
          </div>

          <div>
            <span>© 2026 ICSN. Built for students worldwide.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
