import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES_DATA } from '../../data/universitiesData';
import { rankUniversitiesForStudent } from '../../utils/matchingEngine';
import { University, UniversityMatch } from '../../types';
import {
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Search,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Columns,
  X,
  Clock,
  DollarSign,
  Globe,
} from 'lucide-react';

export const UniversityMatchingView: React.FC = () => {
  const { user } = useAuth();
  const {
    savedUniversities,
    toggleSaveUniversity,
    isUniversitySaved,
    addApplication,
    assessmentResult,
  } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedField, setSelectedField] = useState('All');
  const [maxTuition, setMaxTuition] = useState<number>(50000);
  const [onlyHalalFriendly, setOnlyHalalFriendly] = useState(false);

  // Modals state
  const [selectedUniForDetails, setSelectedUniForDetails] = useState<UniversityMatch | null>(null);
  const [compareList, setCompareList] = useState<University[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Compute matched universities using 18-factor engine
  const matchedUniversities = useMemo(() => {
    return rankUniversitiesForStudent(UNIVERSITIES_DATA, user || {}, assessmentResult);
  }, [user, assessmentResult]);

  // Available filter options
  const countries = useMemo(() => {
    return ['All', ...Array.from(new Set(UNIVERSITIES_DATA.map((u) => u.country)))];
  }, []);

  // Filtered results
  const filteredUniversities = useMemo(() => {
    return matchedUniversities.filter((item) => {
      const uni = item.university;
      const matchesSearch =
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.programs.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCountry = selectedCountry === 'All' || uni.country === selectedCountry;
      const matchesField = selectedField === 'All' || uni.academicFields.includes(selectedField);
      const matchesTuition = uni.tuitionPerYearUsd <= maxTuition || uni.tuitionPerYearUsd === 0;
      const matchesHalal = !onlyHalalFriendly || uni.hasHalalOptions;

      return matchesSearch && matchesCountry && matchesField && matchesTuition && matchesHalal;
    });
  }, [matchedUniversities, searchTerm, selectedCountry, selectedField, maxTuition, onlyHalalFriendly]);

  const toggleCompare = (uni: University) => {
    if (compareList.some((c) => c.id === uni.id)) {
      setCompareList((prev) => prev.filter((c) => c.id !== uni.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 universities simultaneously.');
        return;
      }
      setCompareList((prev) => [...prev, uni]);
    }
  };

  const handleStartApplication = (uni: University) => {
    addApplication({
      studentId: user?.id || 'usr_demo',
      title: `${uni.name} Degree Application`,
      institutionName: uni.name,
      type: 'University',
      programName: uni.programs[0] || 'Undergraduate Degree',
      status: 'Researching',
      deadlineDate: uni.applicationDeadlines[0]?.deadlineDate || '2027-01-15',
      privateNotes: `Target admission based on profile match. Verification source: ${uni.source}`,
      checklist: uni.requiredDocuments.map((doc, idx) => ({
        id: `chk_${idx}`,
        label: doc,
        isCompleted: false,
      })),
    });
    alert(`Application for ${uni.name} created in your Application Tracker!`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#0284C7]/15 text-[#0284C7]">
              18-Factor Weighted Match
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">Official Institutional Data</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Intelligent University Matching
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Evaluating your GPA ({user?.gpa || 3.4}), language scores (IELTS {user?.ieltsScore || 6.5}), and financial targets.
          </p>
        </div>

        {/* Compare Trigger */}
        {compareList.length > 0 && (
          <button
            onClick={() => setShowCompareModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-sm transition-all"
          >
            <Columns className="w-4 h-4" />
            <span>Compare ({compareList.length}) Selected</span>
          </button>
        )}
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
              placeholder="Search university or program..."
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

          {/* Academic Discipline */}
          <div>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Disciplines</option>
              <option value="field_cs_ai">Computer Science & AI</option>
              <option value="field_eng_mech">Robotics & Engineering</option>
              <option value="field_biz_econ">Business & Economics</option>
              <option value="field_med_bio">Medicine & Life Sciences</option>
              <option value="field_climate_energy">Clean Energy & Climate</option>
            </select>
          </div>

          {/* Max Budget Slider */}
          <div className="flex flex-col justify-center text-xs">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>Max Tuition:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ${maxTuition.toLocaleString()}/yr
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="2000"
              value={maxTuition}
              onChange={(e) => setMaxTuition(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-[#0284C7]"
            />
          </div>
        </div>
      </div>

      {/* Results Count & Explanation Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
        <span>Showing {filteredUniversities.length} matched institutions</span>
        <span className="text-[11px] text-slate-400">
          Match % denotes profile alignment, not guaranteed admission.
        </span>
      </div>

      {/* University Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUniversities.map(({ university: uni, fitCategory, fitScore, matchReasons, missingQualifications }) => {
          const isSaved = isUniversitySaved(uni.id);
          const isCompared = compareList.some((c) => c.id === uni.id);

          return (
            <div
              key={uni.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
            >
              <div className="space-y-4">
                {/* Card Top: Rank, Match Category & Save */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {uni.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        QS #{uni.qsRank}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{uni.city}, {uni.country}</span>
                      <span>·</span>
                      <span>Safety: {uni.safetyIndex}/100</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleSaveUniversity(uni.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'border-[#0284C7] text-[#0284C7] bg-[#0284C7]/10'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save university'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Match Category Badge (Unboxed text with border status) */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        fitCategory === 'Strong Profile Match'
                          ? 'text-emerald-500'
                          : fitCategory === 'Good Match'
                          ? 'text-[#0284C7]'
                          : fitCategory === 'Potential Match'
                          ? 'text-amber-500'
                          : 'text-slate-400'
                      }`}
                    >
                      {fitCategory}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {fitScore}% Fit
                    </span>
                  </div>

                  {/* Primary match reason */}
                  {matchReasons[0] && (
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{matchReasons[0]}</span>
                    </div>
                  )}

                  {/* Missing qualification warning if any */}
                  {missingQualifications[0] && (
                    <div className="flex items-start gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 pt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{missingQualifications[0]}</span>
                    </div>
                  )}
                </div>

                {/* Academic Programs Sample */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Programs
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {uni.programs.slice(0, 2).map((prog, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Admission & Cost Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800/60 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Min GPA</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {uni.admissionRequirements.gpaMin}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Min IELTS</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {uni.admissionRequirements.ieltsMin}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Tuition</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {uni.tuitionPerYearUsd === 0 ? 'Free' : `$${(uni.tuitionPerYearUsd / 1000).toFixed(0)}k`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedUniForDetails({ university: uni, fitCategory, fitScore, matchReasons, missingQualifications })}
                  className="text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  View full requirements
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompare(uni)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isCompared
                        ? 'bg-[#0284C7] text-white border-[#0284C7]'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isCompared ? 'Comparing' : 'Compare'}
                  </button>

                  <button
                    onClick={() => handleStartApplication(uni)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0284C7] text-white hover:bg-[#2b5be0] transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Track</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* University Detail Modal */}
      {selectedUniForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-[#11152A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedUniForDetails.university.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedUniForDetails.university.city}, {selectedUniForDetails.university.country} · QS Rank #{selectedUniForDetails.university.qsRank}
                </p>
              </div>
              <button
                onClick={() => setSelectedUniForDetails(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedUniForDetails.university.description}
            </p>

            {/* Admission Thresholds */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">GPA Minimum</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {selectedUniForDetails.university.admissionRequirements.gpaMin}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">IELTS Minimum</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {selectedUniForDetails.university.admissionRequirements.ieltsMin}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Annual Tuition</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  ${selectedUniForDetails.university.tuitionPerYearUsd.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Living Cost / Mo</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  ~${selectedUniForDetails.university.livingCostPerMonthUsd.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Required Application Documents
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedUniForDetails.university.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verification Metadata */}
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-[#0B1020] text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Verification Source:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {selectedUniForDetails.university.source}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Verified Date:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {selectedUniForDetails.university.lastVerified}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={selectedUniForDetails.university.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline"
              >
                <span>Visit Official Admissions Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  handleStartApplication(selectedUniForDetails.university);
                  setSelectedUniForDetails(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1]"
              >
                Add to Application Tracker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl bg-white dark:bg-[#11152A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Columns className="w-5 h-5 text-[#0284C7]" />
                <span>Side-by-Side University Comparison</span>
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 font-semibold text-slate-400">Metric</th>
                    {compareList.map((uni) => (
                      <th key={uni.id} className="p-3 font-bold text-slate-900 dark:text-white min-w-[200px]">
                        {uni.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  <tr>
                    <td className="p-3 text-slate-400 font-sans">Country</td>
                    {compareList.map((uni) => (
                      <td key={uni.id} className="p-3 text-slate-800 dark:text-slate-200">{uni.country}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-sans">QS World Rank</td>
                    {compareList.map((uni) => (
                      <td key={uni.id} className="p-3 text-slate-800 dark:text-slate-200">#{uni.qsRank}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-sans">Annual Tuition</td>
                    {compareList.map((uni) => (
                      <td key={uni.id} className="p-3 text-slate-800 dark:text-slate-200">
                        {uni.tuitionPerYearUsd === 0 ? 'Free' : `$${uni.tuitionPerYearUsd.toLocaleString()}`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-sans">Est. Monthly Living Cost</td>
                    {compareList.map((uni) => (
                      <td key={uni.id} className="p-3 text-slate-800 dark:text-slate-200">${uni.livingCostPerMonthUsd}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-sans">Minimum GPA</td>
                    {compareList.map((uni) => (
                      <td key={uni.id} className="p-3 text-slate-800 dark:text-slate-200">{uni.admissionRequirements.gpaMin}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-sans">Minimum IELTS</td>
                    {compareList.map((uni) => (
                      <td key={uni.id} className="p-3 text-slate-800 dark:text-slate-200">{uni.admissionRequirements.ieltsMin}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-sans">Safety Index</td>
                    {compareList.map((uni) => (
                      <td key={uni.id} className="p-3 text-slate-800 dark:text-slate-200">{uni.safetyIndex} / 100</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
