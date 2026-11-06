import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SCHOLARSHIPS_DATA } from '../../data/scholarshipsData';
import { Scholarship } from '../../types';
import {
  Award,
  Bookmark,
  BookmarkCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  PlusCircle,
  X,
  FileCheck,
} from 'lucide-react';

export const ScholarshipDiscoveryView: React.FC = () => {
  const { user } = useAuth();
  const {
    savedScholarships,
    toggleSaveScholarship,
    isScholarshipSaved,
    addApplication,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedFunding, setSelectedFunding] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const countries = useMemo(() => {
    return ['All', ...Array.from(new Set(SCHOLARSHIPS_DATA.map((s) => s.country)))];
  }, []);

  const filteredScholarships = useMemo(() => {
    return SCHOLARSHIPS_DATA.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.country.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = selectedCountry === 'All' || s.country === selectedCountry;
      const matchesFunding = selectedFunding === 'All' || s.fundingType === selectedFunding;
      const matchesDegree =
        selectedDegree === 'All' || (s.degreeLevels as string[]).includes(selectedDegree);

      return matchesSearch && matchesCountry && matchesFunding && matchesDegree;
    });
  }, [searchTerm, selectedCountry, selectedFunding, selectedDegree]);

  const handleTrackScholarship = (sch: Scholarship) => {
    addApplication({
      studentId: user?.id || 'usr_demo',
      title: `${sch.name} Application`,
      institutionName: sch.provider,
      type: 'Scholarship',
      status: 'Preparing',
      deadlineDate: sch.deadlineDate,
      privateNotes: `Value: $${sch.estimatedValueUsd.toLocaleString()} (${sch.fundingType}). Verification checked: ${sch.lastCheckedDate}`,
      checklist: sch.requiredDocuments.map((doc, idx) => ({
        id: `chk_${idx}`,
        label: doc,
        isCompleted: false,
      })),
    });
    alert(`Scholarship application tracked for ${sch.name}!`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 font-mono">
              100% Verified Government & Merit Programs
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Scholarships & Grant Discovery
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real global grants with verified monthly stipends, full tuition waivers, and official links.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scholarship name or provider..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
            />
          </div>

          {/* Country Selector */}
          <div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  Country: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Funding Type */}
          <div>
            <select
              value={selectedFunding}
              onChange={(e) => setSelectedFunding(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Funding Types</option>
              <option value="Full Funding">Full Funding (100% Tuition + Stipend)</option>
              <option value="Partial Funding">Partial Funding</option>
            </select>
          </div>

          {/* Degree Level */}
          <div>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Degree Levels</option>
              <option value="Bachelor">Bachelor Degree</option>
              <option value="Master">Master Degree</option>
              <option value="PhD">Doctoral / PhD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Scholarships */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScholarships.map((sch) => {
          const isSaved = isScholarshipSaved(sch.id);

          return (
            <div
              key={sch.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
            >
              <div className="space-y-4">
                {/* Header & Save */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {sch.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{sch.provider}</span>
                      <span>·</span>
                      <span>{sch.country}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSaveScholarship(sch.id)}
                    className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                      isSaved
                        ? 'border-amber-500 text-amber-500 bg-amber-500/10'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save scholarship'}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Funding Banner */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">{sch.fundingType}</span>
                    <span className="text-slate-900 dark:text-white">
                      Est. ~${sch.estimatedValueUsd.toLocaleString()} / year
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {sch.fundingDetails}
                  </p>
                </div>

                {/* Eligibility Highlights */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{sch.eligibilityCriteria[0]}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[11px]">
                    <FileCheck className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>Language: {sch.languageRequirements}</span>
                  </div>
                </div>

                {/* Degree Levels & Deadline */}
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1">
                    {sch.degreeLevels.map((lvl, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {lvl}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Deadline: {sch.deadlineDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedScholarship(sch)}
                  className="text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  Full eligibility & documents
                </button>

                <button
                  onClick={() => handleTrackScholarship(sch)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0284C7] text-white hover:bg-[#0369A1] transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Track Application</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scholarship Details Modal */}
      {selectedScholarship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-[#11152A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedScholarship.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedScholarship.provider} · {selectedScholarship.country}
                </p>
              </div>
              <button
                onClick={() => setSelectedScholarship(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedScholarship.description}
            </p>

            {/* Funding Coverage Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Official Funding Coverage ({selectedScholarship.fundingType})
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedScholarship.fundingDetails}
              </p>
            </div>

            {/* Eligibility Criteria */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Eligibility Criteria
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedScholarship.eligibilityCriteria.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Required Application Documents
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedScholarship.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verification Notice */}
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-[#0B1020] text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Verification Status:</span>
                <span className="font-semibold text-emerald-500">
                  {selectedScholarship.verificationStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Checked:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {selectedScholarship.lastCheckedDate}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={selectedScholarship.officialApplicationLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] hover:underline"
              >
                <span>Visit Official Application Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  handleTrackScholarship(selectedScholarship);
                  setSelectedScholarship(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1]"
              >
                Track in Applications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
