import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OPPORTUNITIES_DATA } from '../../data/opportunitiesData';
import { Opportunity } from '../../types';
import {
  Briefcase,
  Bookmark,
  BookmarkCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  Globe,
  MapPin,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const OpportunitiesView: React.FC = () => {
  const { savedOpportunities, toggleSaveOpportunity } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyRemote, setOnlyRemote] = useState(false);

  const categories = ['All', 'Internship', 'Remote Work', 'Research', 'Volunteering', 'Competition'];

  const filteredOpportunities = useMemo(() => {
    return OPPORTUNITIES_DATA.filter((opp) => {
      const matchesSearch =
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || opp.category === selectedCategory;
      const matchesRemote = !onlyRemote || opp.isRemote;

      return matchesSearch && matchesCat && matchesRemote;
    });
  }, [searchTerm, selectedCategory, onlyRemote]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              Verified Opportunity Hub
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">Internships, Research & Remote Roles</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Internships & Global Opportunities
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real openings with verified stipends and compensation. No fictional postings.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search roles, skills, or organizations..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
            />
          </div>

          {/* Category Selector */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Remote Toggle */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyRemote}
                onChange={(e) => setOnlyRemote(e.target.checked)}
                className="rounded text-[#0284C7] focus:ring-[#0284C7]"
              />
              <span>Remote / Flexible roles only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpportunities.map((opp) => {
          const isSaved = savedOpportunities.includes(opp.id);

          return (
            <div
              key={opp.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {opp.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{opp.organization}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        {opp.isRemote ? (
                          <>
                            <Globe className="w-3 h-3 text-[#0284C7]" />
                            <span>Remote</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{opp.location}</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSaveOpportunity(opp.id)}
                    className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                      isSaved
                        ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {opp.category}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">
                      {opp.compensation}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                    {opp.description}
                  </p>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {opp.requiredSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Closes: {opp.deadlineDate}</span>
                  </span>
                  <span className="text-slate-400">{opp.verificationStatus}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <a
                  href={opp.officialApplicationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#2e5be0] transition-colors"
                >
                  <span>Apply on Official Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
