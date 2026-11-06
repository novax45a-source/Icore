import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StudentPortfolio, PortfolioItem } from '../../types';
import {
  FileText,
  Sparkles,
  Share2,
  Printer,
  Lock,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Award,
  HeartHandshake,
  Layers,
  Edit3,
  Loader2,
  X,
} from 'lucide-react';

export const PortfolioBuilderView: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const {
    portfolio,
    updatePortfolioHeadlineAndBio,
    setPortfolioLayoutTheme,
    togglePortfolioPublic,
    addPortfolioItem,
    removePortfolioItem,
    addEducationItem,
    removeEducationItem,
    addSkillItem,
    removeSkillItem,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states for adding items
  const [newProject, setNewProject] = useState({
    title: '',
    role: '',
    dateRange: '',
    description: '',
    link: '',
    tags: '',
  });

  const [newCert, setNewCert] = useState({
    title: '',
    organization: '',
    dateRange: '',
    description: '',
  });

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Technical' as const,
  });

  // AI Assistant Enhancement States
  const [enhancingIndex, setEnhancingIndex] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleAiEnhanceProject = async (itemId: string, title: string, content: string) => {
    setEnhancingIndex(itemId);
    setAiSuggestions([]);

    try {
      const response = await fetch('/api/gemini/portfolio-improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType: 'Project',
          title,
          content,
          language,
        }),
      });

      const data = await response.json();
      if (data.enhancedText) {
        // Find and update item description
        const updatedProjects = portfolio.projects.map((p) =>
          p.id === itemId ? { ...p, description: data.enhancedText } : p
        );
        // Save via direct dispatch or notify
        if (data.suggestions) {
          setAiSuggestions(data.suggestions);
        }
      }
    } catch (err) {
      console.error('Enhance error:', err);
    } finally {
      setEnhancingIndex(null);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    addPortfolioItem('projects', {
      title: newProject.title,
      role: newProject.role,
      dateRange: newProject.dateRange || '2026',
      description: newProject.description,
      link: newProject.link,
      tags: newProject.tags ? newProject.tags.split(',').map((t) => t.trim()) : ['STEM'],
      verified: true,
    });

    setNewProject({ title: '', role: '', dateRange: '', description: '', link: '', tags: '' });
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title.trim()) return;

    addPortfolioItem('certificates', {
      title: newCert.title,
      organization: newCert.organization,
      dateRange: newCert.dateRange || '2026',
      description: newCert.description,
      tags: ['Certified'],
    });

    setNewCert({ title: '', organization: '', dateRange: '', description: '' });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    addSkillItem({
      name: newSkill.name.trim(),
      category: newSkill.category,
    });

    setNewSkill({ name: '', category: 'Technical' });
  };

  const shareableUrl = `https://icsn-navigator.org/p/${user?.id || 'demo'}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header & Theme Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              Priority V1 Feature
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">Verified Academic Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Professional Portfolio Builder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showcase verified STEM projects, Olympiads, and languages with AI impact enhancement.
          </p>
        </div>

        {/* View Mode & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented View Mode */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                activeTab === 'editor'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Live Preview
            </button>
          </div>

          {/* Privacy Toggle */}
          <button
            onClick={togglePortfolioPublic}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              portfolio.isPublic
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Toggle public link visibility"
          >
            {portfolio.isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{portfolio.isPublic ? 'Public Link Active' : 'Private (Default)'}</span>
          </button>

          {/* Share Modal Trigger */}
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Print / Export */}
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Export / Print Portfolio"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layout Theme Selector */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium">Portfolio Theme:</span>
        {(['modern', 'academic', 'creative'] as const).map((thm) => (
          <button
            key={thm}
            onClick={() => setPortfolioLayoutTheme(thm)}
            className={`px-3 py-1 rounded-lg border capitalize transition-colors ${
              portfolio.layoutTheme === thm
                ? 'bg-sky-500/15 border-sky-500 text-sky-400 font-semibold'
                : 'bg-white dark:bg-[#11152A] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {thm === 'modern' ? 'Modern Minimal' : thm === 'academic' ? 'Executive Academic' : 'Creative Tech'}
          </button>
        ))}
      </div>

      {/* Editor View */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Headline & Bio Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-sky-400" />
                <span>Headline & Personal Introduction</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={portfolio.headline}
                    onChange={(e) =>
                      updatePortfolioHeadlineAndBio(e.target.value, portfolio.aboutMe)
                    }
                    placeholder="e.g. Aspiring Robotics & AI Engineer | Olympiad Competitor"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    About Me / Academic Objective
                  </label>
                  <textarea
                    rows={4}
                    value={portfolio.aboutMe}
                    onChange={(e) =>
                      updatePortfolioHeadlineAndBio(portfolio.headline, e.target.value)
                    }
                    placeholder="Describe your primary academic pursuits, motivations, and goals..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0284C7]" />
                  <span>Projects & Research Artifacts ({portfolio.projects.length})</span>
                </h2>
              </div>

              {/* List of existing projects */}
              <div className="space-y-3">
                {portfolio.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 space-y-2 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                          {proj.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          {proj.role && <span>{proj.role}</span>}
                          <span>·</span>
                          <span>{proj.dateRange}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAiEnhanceProject(proj.id, proj.title, proj.description)}
                          disabled={enhancingIndex === proj.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors"
                          title="Improve description clarity with AI"
                        >
                          {enhancingIndex === proj.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          <span>AI Polish</span>
                        </button>

                        <button
                          onClick={() => removePortfolioItem('projects', proj.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {proj.description}
                    </p>

                    {proj.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Project Form */}
              <form onSubmit={handleAddProject} className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Add New Project
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Project Title"
                    className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                  <input
                    type="text"
                    value={newProject.role}
                    onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                    placeholder="Your Role (e.g. Lead Developer)"
                    className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <textarea
                  rows={2}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe measurable impact, technologies used, and outcomes..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    placeholder="Tags (comma-separated, e.g. Python, AI)"
                    className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="url"
                    value={newProject.link}
                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                    placeholder="GitHub or Demo Link"
                    className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#2e5be0] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Skills, Certificates & Education */}
          <div className="space-y-6">
            {/* Skills Box */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Skills & Proficiencies ({portfolio.skills.length})
              </h2>

              <div className="flex flex-wrap gap-1.5">
                {portfolio.skills.map((sk) => (
                  <span
                    key={sk.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <span>{sk.name}</span>
                    <button
                      onClick={() => removeSkillItem(sk.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Skill Form */}
              <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="New skill (e.g. PyTorch)"
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 text-white hover:bg-sky-500 shadow-sm"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Certificates & Honors */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Certificates & Honors ({portfolio.certificates.length})</span>
              </h2>

              <div className="space-y-2.5">
                {portfolio.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{cert.title}</p>
                      <p className="text-[11px] text-slate-500">{cert.organization} · {cert.dateRange}</p>
                    </div>
                    <button
                      onClick={() => removePortfolioItem('certificates', cert.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Cert Form */}
              <form onSubmit={handleAddCert} className="space-y-2 pt-2">
                <input
                  type="text"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  placeholder="Certificate / Award Name"
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={newCert.organization}
                  onChange={(e) => setNewCert({ ...newCert, organization: e.target.value })}
                  placeholder="Issuer (e.g. Harvard CS50, Olympiad Committee)"
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 transition-colors"
                >
                  Add Certificate
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview View */}
      {activeTab === 'preview' && (
        <div
          id="portfolio-printable-area"
          className={`p-8 sm:p-12 rounded-3xl border ${
            portfolio.layoutTheme === 'academic'
              ? 'bg-[#FDFDFD] dark:bg-[#0F1422] border-slate-300 dark:border-slate-700 font-serif'
              : portfolio.layoutTheme === 'creative'
              ? 'bg-gradient-to-br from-[#111C33] to-[#070B14] border-sky-500/40'
              : 'bg-white dark:bg-[#11152A] border-slate-200 dark:border-slate-800'
          } shadow-xl space-y-8`}
        >
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-xs sm:text-sm text-sky-400 font-medium mt-1">
                {portfolio.headline}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                <span>{user?.city}, {user?.country}</span>
                <span>·</span>
                <span>{user?.schoolOrUniversity}</span>
                <span>·</span>
                <span>GPA: {user?.gpa}</span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 font-mono">
              <span className="block">ICSN Verified Student</span>
              <span className="block text-[11px]">Updated {new Date(portfolio.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>

          {/* About Me */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Personal Statement & Objective
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              {portfolio.aboutMe}
            </p>
          </div>

          {/* Education Section */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Education History
            </h2>
            <div className="space-y-2">
              {portfolio.education.map((edu) => (
                <div key={edu.id} className="text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{edu.institution}</span>
                    <span className="font-mono text-slate-400">{edu.startYear} – {edu.endYear}</span>
                  </div>
                  <p>{edu.degree} in {edu.field}</p>
                  {edu.honors && <p className="text-slate-500 text-[11px] mt-0.5">{edu.honors}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Featured Projects & Technical Artifacts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{proj.title}</h3>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0284C7] hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{proj.role} · {proj.dateRange}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {portfolio.skills.map((sk) => (
                  <span
                    key={sk.id}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Languages</h2>
              <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {portfolio.languages.map((l, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{l.language}</span>
                    <span className="font-mono text-slate-400">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#11152A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>Share Student Portfolio</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Anyone with this link can view your academic profile, verified projects, and honors. Your birth date and private contact details remain protected.
            </p>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="flex-1 bg-transparent border-none text-slate-800 dark:text-slate-200 focus:outline-none truncate"
              />
              <button
                onClick={copyShareLink}
                className="px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-500 text-xs font-semibold whitespace-nowrap transition-colors shadow-md shadow-sky-600/20"
              >
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
