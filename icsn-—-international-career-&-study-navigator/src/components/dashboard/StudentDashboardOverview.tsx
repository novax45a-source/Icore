import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Award,
  Sparkles,
  ArrowRight,
  Calendar,
  Compass,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface StudentDashboardOverviewProps {
  onNavigateToTab: (tabId: string) => void;
  onOpenAi: () => void;
}

export const StudentDashboardOverview: React.FC<StudentDashboardOverviewProps> = ({
  onNavigateToTab,
  onOpenAi,
}) => {
  const { user } = useAuth();
  const {
    assessmentResult,
    savedUniversities,
    savedScholarships,
    applications,
    universities,
  } = useApp();

  const activeApplications = applications.filter(
    (a) => a.status !== 'Rejected' && a.status !== 'Withdrawn'
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1120] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
              Active Navigator
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">
              {user?.educationLevel || 'Secondary Education'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {user?.firstName || 'Student'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {assessmentResult
              ? `Your recommended focus is in ${assessmentResult.topFields[0]?.name}. You have ${savedScholarships.length} saved scholarships and ${activeApplications.length} active applications.`
              : 'Complete your 30-Question Assessment to generate personalized university matches and scholarship deadlines.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAi}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Navigator</span>
          </button>

          {!assessmentResult ? (
            <button
              onClick={() => onNavigateToTab('assessment')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all"
            >
              <span>Take 30-Q Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => onNavigateToTab('portfolio')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Update Portfolio</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Tiles (Real data, zero fake scoreboard pills) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saved Universities */}
        <div
          onClick={() => onNavigateToTab('universities')}
          className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Saved Universities</span>
            <GraduationCap className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {savedUniversities.length}
          </div>
          <p className="text-[11px] text-slate-400">
            {savedUniversities.length > 0 ? 'Verified admission deadlines' : 'No universities saved yet'}
          </p>
        </div>

        {/* Saved Scholarships */}
        <div
          onClick={() => onNavigateToTab('scholarships')}
          className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Saved Scholarships</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {savedScholarships.length}
          </div>
          <p className="text-[11px] text-slate-400">
            {savedScholarships.length > 0 ? 'Full & partial funding' : 'Explore opportunities'}
          </p>
        </div>

        {/* Active Application Trackers */}
        <div
          onClick={() => onNavigateToTab('applications')}
          className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Trackers</span>
            <Calendar className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {activeApplications.length}
          </div>
          <p className="text-[11px] text-slate-400">
            {activeApplications.length > 0 ? 'Categorized checklist items' : 'Track target portals'}
          </p>
        </div>

        {/* Assessment Profile Readiness */}
        <div
          onClick={() => onNavigateToTab('assessment')}
          className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Assessment Status</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {assessmentResult ? 'Completed' : 'Pending'}
          </div>
          <p className="text-[11px] text-slate-400">
            {assessmentResult ? '18-factor profile matched' : '30 diagnostic questions'}
          </p>
        </div>
      </div>

      {/* Main Grid: Upcoming Deadlines & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Deadlines & Action Plan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold text-white">
                  Upcoming Application & Scholarship Deadlines
                </h2>
              </div>
              <button
                onClick={() => onNavigateToTab('applications')}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline"
              >
                View all
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <AlertCircle className="w-6 h-6 mx-auto text-slate-500" />
                <p>No active university or scholarship applications tracked yet.</p>
                <button
                  onClick={() => onNavigateToTab('universities')}
                  className="text-xs font-semibold text-sky-400 hover:underline"
                >
                  Browse Universities to Add Applications
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-[#111C33] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {app.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{app.institutionName}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Deadline</span>
                        <span className="text-white font-semibold">
                          {app.deadlineDate}
                        </span>
                      </div>
                      <button
                        onClick={() => onNavigateToTab('applications')}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                      >
                        Checklist ({app.checklist?.length || 0})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Next Steps */}
          <div className="p-6 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Recommended High-Impact Next Steps</span>
            </h2>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#111C33] border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-white">
                    Refine Project Descriptions with AI Portfolio Assistant
                  </p>
                  <p className="text-xs text-slate-400">
                    Use our one-click AI tool to quantify results on your technical and extracurricular projects.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTab('portfolio')}
                  className="ml-auto text-xs font-semibold text-sky-400 hover:underline shrink-0"
                >
                  Enhance
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111C33] border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-white">
                    Submit DAAD & Chevening Recommendation Requests
                  </p>
                  <p className="text-xs text-slate-400">
                    Faculty letters of recommendation take 3-4 weeks to obtain. Request drafts early.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTab('scholarships')}
                  className="ml-auto text-xs font-semibold text-emerald-400 hover:underline shrink-0"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Saved University Highlights & Privacy */}
        <div className="space-y-6">
          {/* Saved Universities Preview */}
          <div className="p-6 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">
                Saved Target Institutions
              </h2>
              <button
                onClick={() => onNavigateToTab('universities')}
                className="text-xs font-semibold text-sky-400 hover:underline"
              >
                Browse all
              </button>
            </div>

            <div className="space-y-3">
              {universities
                .filter((u) => savedUniversities.includes(u.id))
                .slice(0, 3)
                .map((uni) => (
                  <div
                    key={uni.id}
                    className="p-3 rounded-xl bg-[#111C33] border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {uni.name}
                      </span>
                      <span className="text-[10px] font-mono text-sky-400 font-semibold">
                        QS #{uni.qsRank}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{uni.country}</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-mono">
                        {uni.tuitionPerYearUsd === 0 ? 'Tuition Free' : `$${uni.tuitionPerYearUsd.toLocaleString()}/yr`}
                      </span>
                    </div>
                  </div>
                ))}
              {savedUniversities.length === 0 && (
                <div className="text-center py-4 text-xs text-slate-500">
                  No universities saved yet.
                </div>
              )}
            </div>
          </div>

          {/* Student Privacy & Consent Shield */}
          <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Student Privacy Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your profile is private by default. Your birth date and contact details are shielded. You decide which sections are visible to verified partner institutions. No public numerical rankings.
            </p>
            <button
              onClick={() => onNavigateToTab('settings')}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline"
            >
              Manage Consent & Privacy Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
