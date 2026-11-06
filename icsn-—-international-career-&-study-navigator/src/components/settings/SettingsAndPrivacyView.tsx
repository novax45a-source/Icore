import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AppLanguage } from '../../types';
import {
  Settings,
  Shield,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  User,
  Globe,
  AlertTriangle,
} from 'lucide-react';

export const SettingsAndPrivacyView: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [country, setCountry] = useState(user?.country || 'Uzbekistan');
  const [city, setCity] = useState(user?.city || 'Tashkent');
  const [school, setSchool] = useState(user?.schoolOrUniversity || '');
  const [gpa, setGpa] = useState(user?.gpa || 3.8);
  const [ielts, setIelts] = useState(user?.ieltsScore || 7.5);
  const [budget, setBudget] = useState(user?.targetBudgetUsd || 8000);

  // Privacy toggles
  const [profilePublic, setProfilePublic] = useState(user?.privacySettings.profilePublic || false);
  const [allowPartnerSearch, setAllowPartnerSearch] = useState(
    user?.privacySettings.allowCandidateSearchByVerifiedPartners ?? true
  );
  const [hideContactDetails, setHideContactDetails] = useState(
    user?.privacySettings.hideContactDetails ?? true
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      country,
      city,
      schoolOrUniversity: school,
      gpa: Number(gpa),
      ieltsScore: Number(ielts),
      targetBudgetUsd: Number(budget),
      preferredLanguage: language,
      privacySettings: {
        profilePublic,
        allowCandidateSearchByVerifiedPartners: allowPartnerSearch,
        hideContactDetails,
        sharePortfolioSections: user?.privacySettings.sharePortfolioSections || {
          bio: true,
          education: true,
          projects: true,
          skills: true,
          certificates: true,
        },
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `icsn_student_data_${user?.id || 'profile'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your ICSN profile? All saved items, applications, and portfolio items will be erased.')) {
      logout();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
              Security & Privacy Center
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Profile & Privacy Controls
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control how your educational credentials and contact details are handled.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Academic Profile Details */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-sky-400" />
            <span>Academic Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">City / Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Current School / Lyceum</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Cumulative GPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={gpa}
                onChange={(e) => setGpa(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">IELTS Academic Score</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={ielts}
                onChange={(e) => setIelts(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Max Annual Budget ($)</label>
              <input
                type="number"
                step="500"
                min="0"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Privacy & Minor Protection */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Privacy & Protective Defaults</span>
          </h2>

          <div className="space-y-3">
            <label className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hideContactDetails}
                onChange={(e) => setHideContactDetails(e.target.checked)}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Shield Personal Contact Details (Active Protection)
                </span>
                <span className="text-[11px] text-slate-500">
                  Your email, phone number, and date of birth will never appear on public portfolios or untrusted external queries.
                </span>
              </div>
            </label>

            <label className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowPartnerSearch}
                onChange={(e) => setAllowPartnerSearch(e.target.checked)}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Consent to Verified Partner Discovery
                </span>
                <span className="text-[11px] text-slate-500">
                  Allows accredited scholarship foundations and universities to contact you regarding eligible funded spots.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs text-emerald-500 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile preferences updated successfully!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Danger & Export Zone */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Data Export & Account Closure
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div>
            <span className="text-xs font-semibold text-slate-900 dark:text-white block">
              Download Your Student Records
            </span>
            <span className="text-[11px] text-slate-500">
              Export all your portfolio artifacts, test responses, and saved lists in machine-readable JSON format.
            </span>
          </div>

          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data (JSON)</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-xs font-semibold text-rose-500 block">
              Close Student Account
            </span>
            <span className="text-[11px] text-slate-500">
              Irreversibly remove all your saved profile data and applications from ICSN.
            </span>
          </div>

          <button
            onClick={handleDeleteAccount}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
