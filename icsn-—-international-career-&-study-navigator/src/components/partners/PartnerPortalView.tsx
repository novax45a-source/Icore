import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PartnerOrganization } from '../../types';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Users,
  Briefcase,
  Award,
  GraduationCap,
  Clock,
  Plus,
  Lock,
  Search,
  Filter,
} from 'lucide-react';

export const PartnerPortalView: React.FC = () => {
  const { user } = useAuth();
  const { partnerOrganizations, applyForOrganizationVerification } = useApp();

  const [activePartnerTab, setActivePartnerTab] = useState<'school' | 'scholarship' | 'employer' | 'startup'>('school');
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Application form
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<PartnerOrganization['type']>('school');
  const [country, setCountry] = useState('Uzbekistan');
  const [city, setCity] = useState('Tashkent');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !email.trim()) return;

    applyForOrganizationVerification({
      name: orgName.trim(),
      type: orgType,
      country,
      city,
      website: website.trim(),
      contactEmail: email.trim(),
      description: description.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowApplyModal(false);
      setOrgName('');
      setWebsite('');
      setEmail('');
      setDescription('');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#0284C7]/15 text-[#0284C7]">
              Verified Partner Portal
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">Institutional Governance & Talent Discovery</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Institutional Partner Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dedicated portal for accredited secondary schools, universities, scholarship endowments, and vetted employers.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-sm transition-colors whitespace-nowrap"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Apply for Organization Verification</span>
        </button>
      </div>

      {/* Sub-Portal Switcher Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 overflow-x-auto text-xs">
        <button
          onClick={() => setActivePartnerTab('school')}
          className={`flex items-center gap-2 px-3.5 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
            activePartnerTab === 'school'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-[#0284C7]" />
          <span>School / Lyceum Dashboard</span>
        </button>

        <button
          onClick={() => setActivePartnerTab('scholarship')}
          className={`flex items-center gap-2 px-3.5 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
            activePartnerTab === 'scholarship'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Scholarship Provider Dashboard</span>
        </button>

        <button
          onClick={() => setActivePartnerTab('employer')}
          className={`flex items-center gap-2 px-3.5 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
            activePartnerTab === 'employer'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4 text-[#0284C7]" />
          <span>Employer & Recruiter Portal</span>
        </button>

        <button
          onClick={() => setActivePartnerTab('startup')}
          className={`flex items-center gap-2 px-3.5 py-2 font-medium rounded-lg whitespace-nowrap transition-colors ${
            activePartnerTab === 'startup'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-500" />
          <span>Startup & NGO Programs</span>
        </button>
      </div>

      {/* Tab 1: School Dashboard */}
      {activePartnerTab === 'school' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Enrolled Students Guided</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">142</div>
              <p className="text-[11px] text-emerald-500">94% Assessment Completion Rate</p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Total Scholarship Offers Received</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">$1.84M</div>
              <p className="text-[11px] text-slate-500">Across Germany, South Korea & USA</p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Verified Portfolios Active</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">128</div>
              <p className="text-[11px] text-[#0284C7]">Authorized Counselor View</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Institutional Guidance Activities
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span>Cohort 2026: DAAD and GKS Application Deadlines Briefing</span>
                <span className="font-mono text-slate-400">Completed Oct 28</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span>Grade 11 Specialized IT Lyceum Portfolio Polish Sprint</span>
                <span className="font-mono text-emerald-500 font-semibold">Active This Week</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scholarship Provider */}
      {activePartnerTab === 'scholarship' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Active Listing Impressions</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">24,500</div>
              <p className="text-[11px] text-slate-500">Verified student profile reach</p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Eligible Tracked Applicants</span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">312</div>
              <p className="text-[11px] text-emerald-500">Meeting all GPA & language cutoffs</p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Listing Status</span>
              <div className="text-base font-bold text-emerald-500 mt-1">Verified Partner</div>
              <p className="text-[11px] text-slate-500">Official Portal Link Active</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Employer / Recruiter */}
      {activePartnerTab === 'employer' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Consent-Based Candidate Discovery
              </h3>
              <p className="text-xs text-slate-500">
                Only students who explicitly authorized recruitment matching appear in results.
              </p>
            </div>
            <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Strict Privacy Compliance</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Filter Verified Candidates by Competency
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#0284C7]/15 text-[#0284C7] dark:text-[#38BDF8] font-medium">
                Skill: Python / PyTorch
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#0284C7]/15 text-[#0284C7] font-medium">
                Robotics Hardware / C++
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                IELTS Academic 7.5+
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Startup & NGO Programs */}
      {activePartnerTab === 'startup' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Startup & Volunteer Opportunities Management
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Publish hackathons, youth research fellowships, and student startup co-founder openings.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0284C7]"
            >
              Post New Opportunity Listing
            </button>
          </div>
        </div>
      )}

      {/* Verification Request Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#11152A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0284C7]" />
                <span>Apply for Institutional Verification</span>
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verification application received! Platform administrators will review within 2 business days.</span>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    Organization Official Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Tashkent State IT Lyceum or Global Scholars Endowment"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Organization Type</label>
                    <select
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value as PartnerOrganization['type'])}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      <option value="school">School / Lyceum</option>
                      <option value="scholarship">Scholarship Endowment</option>
                      <option value="employer">Employer / Recruiter</option>
                      <option value="startup">Startup / Innovation Lab</option>
                      <option value="volunteer">Volunteer NGO</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Official Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://institution.edu"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">Institutional Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admissions@institution.edu"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Description & Purpose</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your student support or scholarship mission..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1]"
                  >
                    Submit Verification Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
