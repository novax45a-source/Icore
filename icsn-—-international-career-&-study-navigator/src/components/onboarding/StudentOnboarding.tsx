import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  Shield,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface StudentOnboardingProps {
  onFinishOnboarding: () => void;
  onStartAssessment: () => void;
}

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({
  onFinishOnboarding,
  onStartAssessment,
}) => {
  const { user, completeOnboarding } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState<number>(1);

  // Onboarding Form States
  const [educationLevel, setEducationLevel] = useState(
    user?.educationLevel || 'High School / Secondary'
  );
  const [gradeOrYear, setGradeOrYear] = useState(user?.gradeOrYear || 'Final Year');
  const [school, setSchool] = useState(user?.schoolOrUniversity || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests || ['field_cs_ai']
  );
  const [targetCountries, setTargetCountries] = useState<string[]>(
    user?.targetCountries || ['Germany', 'South Korea']
  );
  const [targetBudget, setTargetBudget] = useState<number>(user?.targetBudgetUsd || 8000);
  const [educationGoals, setEducationGoals] = useState(
    user?.educationGoals || 'Secure a merit scholarship at a top technical university'
  );

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCountry = (country: string) => {
    setTargetCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      completeOnboarding({
        educationLevel,
        gradeOrYear,
        schoolOrUniversity: school,
        interests: selectedInterests,
        targetCountries,
        targetBudgetUsd: targetBudget,
        educationGoals,
      });
      onFinishOnboarding();
    }
  };

  const handleCompleteAndTakeTest = () => {
    completeOnboarding({
      educationLevel,
      gradeOrYear,
      schoolOrUniversity: school,
      interests: selectedInterests,
      targetCountries,
      targetBudgetUsd: targetBudget,
      educationGoals,
    });
    onStartAssessment();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-[#11152A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-6 shadow-xl">
        {/* Progress header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0284C7] dark:text-[#38BDF8] uppercase tracking-wider">
              Step {step} of 3
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">Personalizing Your Roadmap</span>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {step === 1 ? 'Academic Background' : step === 2 ? 'Interests & Targets' : 'Goals & Discovery'}
          </span>
        </div>

        {/* Step 1: Academic Background */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Tell us about your current studies
              </h2>
              <p className="text-xs text-slate-500">
                Helps us identify eligible admission paths and scholarship qualifications.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  Current Education Level
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="High School / Secondary">High School / Lyceum / Secondary School</option>
                  <option value="Undergraduate Student">Currently Enrolled Undergraduate (Bachelor)</option>
                  <option value="Bachelor Graduate">Graduated with Bachelor’s Degree</option>
                  <option value="Master Student">Master’s or Doctoral Researcher</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  Current Grade / Academic Year
                </label>
                <input
                  type="text"
                  value={gradeOrYear}
                  onChange={(e) => setGradeOrYear(e.target.value)}
                  placeholder="e.g. Grade 11, Year 12, or Senior Year"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  School, Lyceum, or University (Optional)
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. Tashkent Specialized IT Lyceum"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {user?.isMinor && (
                <div className="p-3 rounded-xl bg-[#0284C7]/10 border border-[#0284C7]/30 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>
                    Under-18 Protection Active: Your date of birth and private contact details are shielded from public view by default.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Interests & Target Countries */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                What fields & countries interest you?
              </h2>
              <p className="text-xs text-slate-500">
                You can always modify these in your profile or take the 30-Question Assessment to discover new fields.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-2">
                  Select Areas of Academic Interest
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'field_cs_ai', label: 'Computer Science & AI' },
                    { id: 'field_eng_mech', label: 'Robotics & Engineering' },
                    { id: 'field_biz_econ', label: 'Business & Economics' },
                    { id: 'field_med_bio', label: 'Biomedicine & Healthcare' },
                    { id: 'field_climate_energy', label: 'Climate & Renewable Energy' },
                    { id: 'field_design_media', label: 'Product Design & Architecture' },
                  ].map((field) => (
                    <button
                      type="button"
                      key={field.id}
                      onClick={() => toggleInterest(field.id)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                        selectedInterests.includes(field.id)
                          ? 'bg-[#0284C7]/15 border-[#0284C7] text-[#0284C7] dark:text-[#38BDF8]'
                          : 'bg-slate-50 dark:bg-[#0B1020] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {field.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-2">
                  Preferred Target Study Destinations
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['Germany', 'South Korea', 'Singapore', 'Canada', 'United Kingdom', 'Switzerland', 'Netherlands', 'Turkey'].map(
                    (c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => toggleCountry(c)}
                        className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                          targetCountries.includes(c)
                            ? 'bg-[#0284C7]/15 border-[#0284C7] text-[#0284C7]'
                            : 'bg-slate-50 dark:bg-[#0B1020] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {c}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Goals & 30-Question Assessment Offer */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Final Step: Education & Career Goals
              </h2>
              <p className="text-xs text-slate-500">
                Your goals help our AI Navigator recommend specific scholarship milestones.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  Primary Educational & Career Goal
                </label>
                <textarea
                  rows={3}
                  value={educationGoals}
                  onChange={(e) => setEducationGoals(e.target.value)}
                  placeholder="e.g. Win a full scholarship for Computer Science and join an autonomous robotics research team..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* 30-Question Assessment Invitation Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0284C7]/15 to-[#0284C7]/15 border border-[#0284C7]/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0284C7]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Unlock Personalized Major & University Matches
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our comprehensive 30-question assessment scores your quantitative problem-solving style, preferred study destination, and financial requirements.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCompleteAndTakeTest}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] to-[#0284C7] hover:opacity-95 shadow-sm"
                  >
                    <span>Complete & Start 30-Question Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-sm transition-colors"
          >
            <span>{step === 3 ? 'Go to Student Dashboard' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
