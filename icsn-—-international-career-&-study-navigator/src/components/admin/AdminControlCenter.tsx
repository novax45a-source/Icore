import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  University,
  Scholarship,
  CountryProfile,
  KnowledgeGuide,
  ContentDraft,
  ContentDraftType,
  ContentDraftStatus,
} from '../../types';
import {
  ShieldCheck,
  Building2,
  Award,
  Globe2,
  FileText,
  Sparkles,
  Bot,
  Activity,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Edit3,
  Trash2,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
  Send,
  Eye,
  Check,
} from 'lucide-react';

export const AdminControlCenter: React.FC = () => {
  const { user } = useAuth();
  const {
    universities,
    scholarships,
    countries,
    knowledgeGuides,
    jarvisConfig,
    contentDrafts,
    adminAuditLogs,
    partnerOrganizations,
    applications,
    verifyOrganization,
    addUniversity,
    updateUniversity,
    deleteUniversity,
    addScholarship,
    updateScholarship,
    deleteScholarship,
    addCountry,
    updateCountry,
    addKnowledgeGuide,
    updateKnowledgeGuide,
    addContentDraft,
    approveAndPublishDraft,
    rejectDraft,
    testJarvisConnection,
  } = useApp();

  type AdminTab = 'overview' | 'universities' | 'countries' | 'scholarships' | 'guides' | 'jarvis' | 'partners' | 'audit';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');

  // University Modal State
  const [isUniModalOpen, setIsUniModalOpen] = useState(false);
  const [editingUni, setEditingUni] = useState<University | null>(null);
  const [uniName, setUniName] = useState('');
  const [uniCountry, setUniCountry] = useState('');
  const [uniCity, setUniCity] = useState('');
  const [uniQsRank, setUniQsRank] = useState(50);
  const [uniTuition, setUniTuition] = useState(15000);
  const [uniLivingCost, setUniLivingCost] = useState(1200);
  const [uniGpaMin, setUniGpaMin] = useState(3.5);
  const [uniIeltsMin, setUniIeltsMin] = useState(6.5);
  const [uniWebsite, setUniWebsite] = useState('');
  const [uniDescription, setUniDescription] = useState('');

  // Scholarship Modal State
  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [schName, setSchName] = useState('');
  const [schProvider, setSchProvider] = useState('');
  const [schCountry, setSchCountry] = useState('Global');
  const [schFundingType, setSchFundingType] = useState<'Full Funding' | 'Partial Funding' | 'Tuition Waiver' | 'Monthly Stipend'>('Full Funding');
  const [schEstimatedValue, setSchEstimatedValue] = useState(24000);
  const [schDeadline, setSchDeadline] = useState('2027-04-15');
  const [schOfficialLink, setSchOfficialLink] = useState('');
  const [schDescription, setSchDescription] = useState('');

  // Country Modal State
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryProfile | null>(null);
  const [ctyName, setCtyName] = useState('');
  const [ctyCode, setCtyCode] = useState('');
  const [ctyRegion, setCtyRegion] = useState<'Europe' | 'North America' | 'Asia-Pacific' | 'Middle East' | 'Latin America'>('Europe');
  const [ctyLivingMin, setCtyLivingMin] = useState(800);
  const [ctyLivingMax, setCtyLivingMax] = useState(1500);
  const [ctyWorkMonths, setCtyWorkMonths] = useState(18);
  const [ctyVisaOverview, setCtyVisaOverview] = useState('');
  const [ctyImmigrationPortal, setCtyImmigrationPortal] = useState('');

  // Guide Modal State
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<KnowledgeGuide | null>(null);
  const [guideTitle, setGuideTitle] = useState('');
  const [guideCategory, setGuideCategory] = useState<
    'Visa & Immigration' | 'Relocation & Housing' | 'Finances & Budgeting' | 'Standardized Testing' | 'Application Essays' | 'Career & Work Rights'
  >('Visa & Immigration');
  const [guideSummary, setGuideSummary] = useState('');
  const [guideMarkdown, setGuideMarkdown] = useState('');

  // JARVIS AI Content Assistant State
  const [jarvisDraftType, setJarvisDraftType] = useState<ContentDraftType>('university');
  const [jarvisPrompt, setJarvisPrompt] = useState('');
  const [jarvisTargetEntity, setJarvisTargetEntity] = useState('');
  const [isJarvisGenerating, setIsJarvisGenerating] = useState(false);
  const [jarvisMessage, setJarvisMessage] = useState<string | null>(null);
  const [inspectingDraft, setInspectingDraft] = useState<ContentDraft | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Stats calculation
  const pendingDraftsCount = contentDrafts.filter(d => d.status === 'under_review' || d.status === 'draft').length;
  const pendingOrgCount = partnerOrganizations.filter(o => o.verificationStatus === 'pending').length;

  // Handlers for University
  const handleOpenAddUni = () => {
    setEditingUni(null);
    setUniName('');
    setUniCountry('');
    setUniCity('');
    setUniQsRank(50);
    setUniTuition(15000);
    setUniLivingCost(1200);
    setUniGpaMin(3.5);
    setUniIeltsMin(6.5);
    setUniWebsite('');
    setUniDescription('');
    setIsUniModalOpen(true);
  };

  const handleEditUni = (uni: University) => {
    setEditingUni(uni);
    setUniName(uni.name);
    setUniCountry(uni.country);
    setUniCity(uni.city);
    setUniQsRank(uni.qsRank);
    setUniTuition(uni.tuitionPerYearUsd);
    setUniLivingCost(uni.livingCostPerMonthUsd);
    setUniGpaMin(uni.admissionRequirements.gpaMin);
    setUniIeltsMin(uni.admissionRequirements.ieltsMin);
    setUniWebsite(uni.officialWebsite);
    setUniDescription(uni.description);
    setIsUniModalOpen(true);
  };

  const handleSaveUni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniName || !uniCountry) return;

    if (editingUni) {
      updateUniversity(editingUni.id, {
        name: uniName,
        country: uniCountry,
        city: uniCity,
        qsRank: uniQsRank,
        tuitionPerYearUsd: uniTuition,
        livingCostPerMonthUsd: uniLivingCost,
        officialWebsite: uniWebsite,
        description: uniDescription,
        admissionRequirements: {
          ...editingUni.admissionRequirements,
          gpaMin: uniGpaMin,
          ieltsMin: uniIeltsMin,
        },
      });
    } else {
      addUniversity({
        id: `uni-${Date.now()}`,
        name: uniName,
        country: uniCountry,
        city: uniCity || 'Central',
        qsRank: uniQsRank || 100,
        tuitionPerYearUsd: uniTuition || 15000,
        livingCostPerMonthUsd: uniLivingCost || 1200,
        academicFields: ['Engineering', 'Computer Science'],
        programs: ['Computer Science & Artificial Intelligence', 'Applied Engineering'],
        admissionRequirements: {
          gpaMin: uniGpaMin,
          ieltsMin: uniIeltsMin,
          toeflMin: 90,
          satRequirement: 'Optional',
        },
        availableScholarships: ['Merit Scholarship', 'International Grant'],
        applicationDeadlines: [
          { intake: 'Fall 2027', deadlineDate: '2027-01-15', status: 'Open' },
        ],
        requiredDocuments: ['Official Transcript', 'Statement of Purpose', 'Two Recommendation Letters'],
        officialWebsite: uniWebsite || 'https://example.edu',
        source: 'Official Institutional Admission Portal',
        lastVerified: new Date().toISOString().split('T')[0],
        hasHalalOptions: true,
        safetyIndex: 9.0,
        description: uniDescription || 'World-class academic and research institution.',
      });
    }
    setIsUniModalOpen(false);
  };

  // Handlers for Scholarship
  const handleOpenAddScholarship = () => {
    setEditingScholarship(null);
    setSchName('');
    setSchProvider('');
    setSchCountry('Global');
    setSchFundingType('Full Funding');
    setSchEstimatedValue(24000);
    setSchDeadline('2027-04-15');
    setSchOfficialLink('');
    setSchDescription('');
    setIsScholarshipModalOpen(true);
  };

  const handleEditScholarship = (s: Scholarship) => {
    setEditingScholarship(s);
    setSchName(s.name);
    setSchProvider(s.provider);
    setSchCountry(s.country);
    setSchFundingType(s.fundingType);
    setSchEstimatedValue(s.estimatedValueUsd);
    setSchDeadline(s.deadlineDate);
    setSchOfficialLink(s.officialApplicationLink);
    setSchDescription(s.description);
    setIsScholarshipModalOpen(true);
  };

  const handleSaveScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schName || !schProvider) return;

    if (editingScholarship) {
      updateScholarship(editingScholarship.id, {
        name: schName,
        provider: schProvider,
        country: schCountry,
        fundingType: schFundingType,
        estimatedValueUsd: schEstimatedValue,
        deadlineDate: schDeadline,
        officialApplicationLink: schOfficialLink,
        description: schDescription,
      });
    } else {
      addScholarship({
        id: `sch-${Date.now()}`,
        name: schName,
        provider: schProvider,
        country: schCountry,
        academicFields: ['STEM', 'Humanities', 'Business'],
        degreeLevels: ['Bachelor', 'Master'],
        fundingType: schFundingType,
        fundingDetails: 'Tuition support and monthly living stipend',
        estimatedValueUsd: schEstimatedValue,
        eligibilityCriteria: ['High academic standing', 'Minimum IELTS 6.5 or equivalent'],
        nationalityRestrictions: 'International applicants eligible',
        languageRequirements: 'IELTS 6.5 or TOEFL 90',
        deadlineDate: schDeadline,
        requiredDocuments: ['Application Form', 'Transcripts', 'Essays', 'Recommendation Letters'],
        officialApplicationLink: schOfficialLink || 'https://official-scholarship.org',
        verificationStatus: 'Verified',
        lastCheckedDate: new Date().toISOString().split('T')[0],
        description: schDescription || 'Comprehensive international education scholarship award.',
      });
    }
    setIsScholarshipModalOpen(false);
  };

  // Handlers for Country
  const handleOpenAddCountry = () => {
    setEditingCountry(null);
    setCtyName('');
    setCtyCode('');
    setCtyRegion('Europe');
    setCtyLivingMin(800);
    setCtyLivingMax(1500);
    setCtyWorkMonths(18);
    setCtyVisaOverview('');
    setCtyImmigrationPortal('');
    setIsCountryModalOpen(true);
  };

  const handleEditCountry = (c: CountryProfile) => {
    setEditingCountry(c);
    setCtyName(c.name);
    setCtyCode(c.code);
    setCtyRegion(c.region);
    setCtyLivingMin(c.estimatedLivingCostMinUsd);
    setCtyLivingMax(c.estimatedLivingCostMaxUsd);
    setCtyWorkMonths(c.postStudyWorkDurationMonths);
    setCtyVisaOverview(c.studentVisaOverview);
    setCtyImmigrationPortal(c.officialImmigrationPortal);
    setIsCountryModalOpen(true);
  };

  const handleSaveCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctyName) return;

    if (editingCountry) {
      updateCountry(editingCountry.id, {
        name: ctyName,
        code: ctyCode,
        region: ctyRegion,
        estimatedLivingCostMinUsd: ctyLivingMin,
        estimatedLivingCostMaxUsd: ctyLivingMax,
        postStudyWorkDurationMonths: ctyWorkMonths,
        studentVisaOverview: ctyVisaOverview,
        officialImmigrationPortal: ctyImmigrationPortal,
      });
    } else {
      addCountry({
        id: `cty-${Date.now()}`,
        name: ctyName,
        code: ctyCode || ctyName.slice(0, 2).toUpperCase(),
        region: ctyRegion,
        cities: ['Capital Metro', 'University Center'],
        educationSystemOverview: 'High-standard tertiary research universities and technical colleges.',
        studentVisaOverview: ctyVisaOverview || 'National student visa with evidence of financial sufficiency.',
        visaRequirements: ['Admission Letter', 'Proof of Financial Resources', 'Health Insurance'],
        estimatedLivingCostMinUsd: ctyLivingMin,
        estimatedLivingCostMaxUsd: ctyLivingMax,
        postStudyWorkVisaAllowed: true,
        postStudyWorkDurationMonths: ctyWorkMonths,
        housingGuidance: 'University student dormitories and private shared apartments (WGs).',
        transportGuidance: 'Discounted semester transit pass for all enrolled tertiary students.',
        healthInsuranceRequirement: 'Compulsory statutory student health coverage.',
        officialImmigrationPortal: ctyImmigrationPortal || 'https://immigration.gov',
        officialEducationPortal: 'https://study-abroad.gov',
        lastVerified: new Date().toISOString().split('T')[0],
        status: 'published',
      });
    }
    setIsCountryModalOpen(false);
  };

  // Handlers for Knowledge Guides
  const handleOpenAddGuide = () => {
    setEditingGuide(null);
    setGuideTitle('');
    setGuideCategory('Visa & Immigration');
    setGuideSummary('');
    setGuideMarkdown('');
    setIsGuideModalOpen(true);
  };

  const handleEditGuide = (g: KnowledgeGuide) => {
    setEditingGuide(g);
    setGuideTitle(g.title);
    setGuideCategory(g.category);
    setGuideSummary(g.summary);
    setGuideMarkdown(g.contentMarkdown);
    setIsGuideModalOpen(true);
  };

  const handleSaveGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideTitle) return;

    if (editingGuide) {
      updateKnowledgeGuide(editingGuide.id, {
        title: guideTitle,
        category: guideCategory,
        summary: guideSummary,
        contentMarkdown: guideMarkdown,
        updatedAt: new Date().toISOString(),
      });
    } else {
      addKnowledgeGuide({
        id: `guide-${Date.now()}`,
        title: guideTitle,
        slug: guideTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: guideCategory,
        summary: guideSummary || 'Essential relocation and study guidance.',
        contentMarkdown: guideMarkdown || '# Overview\n\nVerified guidance for international students.',
        targetCountries: ['Global'],
        officialSourceLinks: [{ title: 'Official Authority Portal', url: 'https://gov.edu' }],
        lastVerifiedDate: new Date().toISOString().split('T')[0],
        isPublished: true,
        author: 'ICSN Editorial Board',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setIsGuideModalOpen(false);
  };

  // JARVIS AI Content Generation Trigger
  const handleGenerateJarvisDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jarvisPrompt) return;

    setIsJarvisGenerating(true);
    setJarvisMessage(null);

    try {
      const res = await fetch('/api/admin/jarvis/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftType: jarvisDraftType,
          prompt: jarvisPrompt,
          targetEntity: jarvisTargetEntity || undefined,
        }),
      });

      const data = await res.json();
      if (data.draft) {
        const newDraft: ContentDraft = {
          id: data.draft.id || `draft-${Date.now()}`,
          draftType: jarvisDraftType,
          title: data.draft.title || `${jarvisTargetEntity || jarvisDraftType} Draft`,
          sourceOrganization: 'JARVIS Autonomous AI Gateway',
          sourceUrl: data.draft.sourceUrls?.[0] || 'https://official-portal.edu',
          researchedDate: new Date().toISOString().split('T')[0],
          verificationStatus: 'verified_official',
          status: 'under_review',
          contentData: data.draft.structuredPayload || {},
          aiGeneratedBy: 'JARVIS-AI-Assistant',
          adminNotes: data.draft.verificationNotes || 'Awaiting administrator review.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        addContentDraft(newDraft);
        setJarvisPrompt('');
        setJarvisTargetEntity('');
        setJarvisMessage(`JARVIS draft generated: "${newDraft.title}". Ready for your review.`);
        setInspectingDraft(newDraft);
      } else {
        setJarvisMessage(data.error || 'Failed to generate draft.');
      }
    } catch (err: any) {
      setJarvisMessage(err.message || 'Error communicating with JARVIS AI Gateway.');
    } finally {
      setIsJarvisGenerating(false);
    }
  };

  const handlePingJarvis = async () => {
    setIsTestingConnection(true);
    await testJarvisConnection();
    setIsTestingConnection(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-[#0B1120] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              ICSN Global Administration System
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Authority Node
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ICSN Admin & Intelligence Ecosystem
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Manage university databases, country relocation directives, scholarship records, and review autonomous educational research drafts generated by the JARVIS CEO Gateway before publishing live to students.
          </p>
        </div>

        {/* JARVIS Gateway Quick Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#111C33] border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-sky-400" />
              <span className="font-semibold text-white">JARVIS Gateway</span>
              <span className={`w-2 h-2 rounded-full ${jarvisConfig.connectionStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
              Status: {jarvisConfig.connectionStatus} · Scopes: Active
            </div>
          </div>
          <button
            onClick={handlePingJarvis}
            disabled={isTestingConnection}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-sky-600/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
            <span>Ping Node</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Ribbon (Real Reactive Data) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Universities</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{universities.length}</div>
          <span className="text-[10px] text-emerald-400">100% verified</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Scholarships</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{scholarships.length}</div>
          <span className="text-[10px] text-slate-400">Active opportunities</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Countries</span>
            <Globe2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{countries.length}</div>
          <span className="text-[10px] text-slate-400">Visa & costs charted</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Knowledge Guides</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{knowledgeGuides.length}</div>
          <span className="text-[10px] text-slate-400">Verified SOPs & Visas</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending AI Drafts</span>
            <Bot className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{pendingDraftsCount}</div>
          <span className="text-[10px] text-amber-400/80">Requires approval</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Student Apps</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{applications.length}</div>
          <span className="text-[10px] text-slate-400">Active trackers</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-xl bg-[#0B1120] border border-slate-800 text-xs">
        {[
          { id: 'overview', label: 'Ecosystem Overview', icon: Activity },
          { id: 'universities', label: `Universities (${universities.length})`, icon: Building2 },
          { id: 'countries', label: `Countries (${countries.length})`, icon: Globe2 },
          { id: 'scholarships', label: `Scholarships (${scholarships.length})`, icon: Award },
          { id: 'guides', label: `Relocation Guides (${knowledgeGuides.length})`, icon: FileText },
          { id: 'jarvis', label: `JARVIS AI Assistant (${pendingDraftsCount})`, icon: Bot },
          { id: 'partners', label: `Partner Reviews (${pendingOrgCount})`, icon: ShieldCheck },
          { id: 'audit', label: 'Audit Logs', icon: Clock },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-3.5 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB: ECOSYSTEM OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Panel */}
            <div className="p-6 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-400" />
                <span>Quick Record Creation</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add authoritative verified records directly into the live ICSN catalog without touching codebase files.
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={handleOpenAddUni}
                  className="p-3 rounded-xl bg-[#111C33] border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/80 text-left transition-all group"
                >
                  <Building2 className="w-4 h-4 text-sky-400 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-white">Add University</div>
                  <div className="text-[10px] text-slate-400">Programs, ranks, fees</div>
                </button>
                <button
                  onClick={handleOpenAddScholarship}
                  className="p-3 rounded-xl bg-[#111C33] border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 text-left transition-all group"
                >
                  <Award className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-white">Add Scholarship</div>
                  <div className="text-[10px] text-slate-400">Stipends, deadlines</div>
                </button>
                <button
                  onClick={handleOpenAddCountry}
                  className="p-3 rounded-xl bg-[#111C33] border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/80 text-left transition-all group"
                >
                  <Globe2 className="w-4 h-4 text-sky-400 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-white">Add Country</div>
                  <div className="text-[10px] text-slate-400">Visa, living budgets</div>
                </button>
                <button
                  onClick={handleOpenAddGuide}
                  className="p-3 rounded-xl bg-[#111C33] border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 text-left transition-all group"
                >
                  <FileText className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-semibold text-white">Add Guide</div>
                  <div className="text-[10px] text-slate-400">Blocked accounts, SOP</div>
                </button>
              </div>
            </div>

            {/* JARVIS Autonomous Research Station */}
            <div className="p-6 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">JARVIS AI Autonomous Content Assistant</h2>
                    <p className="text-xs text-slate-400">Natural language educational researcher with human review gateway</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('jarvis')}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
                >
                  <span>Open Full AI Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleGenerateJarvisDraft} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Target Entity Name</label>
                    <input
                      type="text"
                      placeholder="e.g. EPFL Lausanne or MEXT"
                      value={jarvisTargetEntity}
                      onChange={e => setJarvisTargetEntity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Draft Type</label>
                    <select
                      value={jarvisDraftType}
                      onChange={e => setJarvisDraftType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="university">University Profile</option>
                      <option value="scholarship">Scholarship Opportunity</option>
                      <option value="country_guide">Country Relocation Profile</option>
                      <option value="relocation_article">Relocation/Visa Guide</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Execution Mode</label>
                    <div className="px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
                      <span className="font-mono text-emerald-400">Review Before Live</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Research Prompt / Instructions</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Research tuition fees, GPA requirements, IELTS minimums, and official application portals..."
                      value={jarvisPrompt}
                      onChange={e => setJarvisPrompt(e.target.value)}
                      className="w-full pl-3 pr-24 py-2.5 rounded-xl bg-[#111C33] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="submit"
                      disabled={isJarvisGenerating || !jarvisPrompt.trim()}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      {isJarvisGenerating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Drafting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {jarvisMessage && (
                <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 text-xs text-sky-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{jarvisMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pending Drafts Notice */}
          {pendingDraftsCount > 0 && (
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {pendingDraftsCount} Autonomous Content Draft{pendingDraftsCount > 1 ? 's' : ''} Awaiting Human Review
                  </h3>
                  <p className="text-xs text-slate-400">
                    JARVIS has generated structured education data. Review verification sources and click approve to publish to student views.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('jarvis')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shrink-0"
              >
                Review Drafts Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB: UNIVERSITIES MANAGEMENT ================= */}
      {activeTab === 'universities' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search universities by name, country, or city..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B1120] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              onClick={handleOpenAddUni}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-md shadow-sky-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add University</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities
              .filter(u =>
                searchQuery
                  ? u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.city.toLowerCase().includes(searchQuery.toLowerCase())
                  : true
              )
              .map(uni => (
                <div
                  key={uni.id}
                  className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold">
                          QS Rank #{uni.qsRank}
                        </span>
                        <h3 className="text-sm font-bold text-white">{uni.name}</h3>
                        <p className="text-xs text-slate-400">{uni.city}, {uni.country}</p>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        ${uni.tuitionPerYearUsd?.toLocaleString() || '15,000'}/yr
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400">
                      <div><strong className="text-slate-300">Min GPA:</strong> {uni.admissionRequirements?.gpaMin || '3.5'} · <strong className="text-slate-300">IELTS:</strong> {uni.admissionRequirements?.ieltsMin || '6.5'}</div>
                      <div><strong className="text-slate-300">Living:</strong> ~${uni.livingCostPerMonthUsd}/mo</div>
                      <div><strong className="text-slate-300">Verified:</strong> <span className="font-mono text-[11px] text-slate-500">{uni.lastVerified}</span></div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {uni.programs?.slice(0, 3).map((p, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <a
                      href={uni.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Official Portal</span>
                    </a>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditUni(uni)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Edit university"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteUniversity(uni.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-200 hover:bg-rose-900/60 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= TAB: COUNTRIES MANAGEMENT ================= */}
      {activeTab === 'countries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Study Destinations & Visa Profiles</h2>
            <button
              onClick={handleOpenAddCountry}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-sky-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Country Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {countries.map(c => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-semibold">{c.code}</span>
                      <h3 className="text-sm font-bold text-white">{c.name}</h3>
                      <span className="text-xs text-slate-500 font-mono">({c.region})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Cities: {c.cities?.join(', ') || 'Metropolitan Centers'}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditCountry(c)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#111C33] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Monthly Living Costs</span>
                    <span className="font-semibold text-emerald-400 font-mono">
                      ${c.estimatedLivingCostMinUsd} - ${c.estimatedLivingCostMaxUsd}/mo
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#111C33] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Post-Study Work Rights</span>
                    <span className="font-semibold text-sky-400 font-mono">
                      {c.postStudyWorkDurationMonths} Months
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div><strong className="text-slate-300">Visa Overview:</strong></div>
                  <p className="line-clamp-2 text-slate-400">{c.studentVisaOverview}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[10px]">Updated: {c.lastVerified}</span>
                  <a
                    href={c.officialImmigrationPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
                  >
                    <span>Immigration Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: SCHOLARSHIPS MANAGEMENT ================= */}
      {activeTab === 'scholarships' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Verified Scholarship Records</h2>
            <button
              onClick={handleOpenAddScholarship}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Scholarship</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scholarships.map(s => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                        {s.fundingType}
                      </span>
                      <h3 className="text-sm font-bold text-white">{s.name}</h3>
                      <p className="text-xs text-slate-400">{s.provider} · {s.country}</p>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shrink-0">
                      ${s.estimatedValueUsd?.toLocaleString() || '20,000'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400">
                    <div><strong className="text-slate-300">Deadline:</strong> <span className="font-mono text-amber-400">{s.deadlineDate}</span></div>
                    <div><strong className="text-slate-300">Criteria:</strong> {s.eligibilityCriteria?.join(', ')}</div>
                    <div><strong className="text-slate-300">Verified:</strong> <span className="font-mono text-slate-500">{s.lastCheckedDate}</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={s.officialApplicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Apply / Source</span>
                  </a>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditScholarship(s)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteScholarship(s.id)}
                      className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: RELOCATION GUIDES ================= */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Relocation & Study Preparation Guides</h2>
            <button
              onClick={handleOpenAddGuide}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-sky-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Knowledge Guide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledgeGuides.map(g => (
              <div
                key={g.id}
                className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold">
                      {g.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{g.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{g.summary}</p>
                  </div>
                  <button
                    onClick={() => handleEditGuide(g)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#111C33] border border-slate-800 text-xs text-slate-300 max-h-24 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-xs">{g.contentMarkdown.slice(0, 200)}...</pre>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono text-[10px]">
                  <span>Last verified: {g.lastVerifiedDate}</span>
                  <span className="text-emerald-400 font-sans">Official Sources Linked: {g.officialSourceLinks?.length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: JARVIS AI CONTROL CENTER ================= */}
      {activeTab === 'jarvis' && (
        <div className="space-y-6">
          {/* Gateway Status & Configuration Bar */}
          <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-sky-400" />
                  <h2 className="text-base font-bold text-white">JARVIS CEO Autonomous AI Gateway</h2>
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-xs font-mono font-semibold">
                    v2.4-gateway
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Autonomous educational research agent node with scoped permissions and strict human-in-the-loop review.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePingJarvis}
                  disabled={isTestingConnection}
                  className="px-3.5 py-1.5 rounded-xl bg-[#111C33] hover:bg-slate-800 text-xs font-medium text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                  <span>Test Connection</span>
                </button>
                <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{jarvisConfig.connectionStatus.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Scoped Permissions Controls */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block mb-2">Authorized JARVIS Scopes:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {Object.entries(jarvisConfig.allowedScopes).map(([scopeKey, isAllowed]) => (
                  <span
                    key={scopeKey}
                    className="px-2.5 py-1 rounded-lg bg-[#111C33] text-sky-300 border border-slate-700/80 font-mono text-[11px] flex items-center gap-1"
                  >
                    <Check className={`w-3 h-3 ${isAllowed ? 'text-emerald-400' : 'text-slate-500'}`} />
                    {scopeKey}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Research & Draft Station */}
          <div className="p-6 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Prompt JARVIS Autonomous Education Researcher</span>
            </h3>

            <form onSubmit={handleGenerateJarvisDraft} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Entity Name / Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., University of Melbourne, DAAD Scholarship, Singapore Student Pass"
                    value={jarvisTargetEntity}
                    onChange={e => setJarvisTargetEntity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111C33] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Target Resource Type</label>
                  <select
                    value={jarvisDraftType}
                    onChange={e => setJarvisDraftType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111C33] border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="university">University Profile</option>
                    <option value="scholarship">Scholarship Listing</option>
                    <option value="country_guide">Country Relocation Profile</option>
                    <option value="relocation_article">Relocation / SOP Preparation Guide</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Detailed Research Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Specify particular fields, programs, target intake years (e.g. 2026/2027), language criteria, and verified sources to cite..."
                  value={jarvisPrompt}
                  onChange={e => setJarvisPrompt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111C33] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  All JARVIS outputs are held in review status until you click &quot;Approve &amp; Publish&quot;.
                </span>
                <button
                  type="submit"
                  disabled={isJarvisGenerating || !jarvisPrompt.trim()}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-sky-600/20 disabled:opacity-50"
                >
                  {isJarvisGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Draft...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Execute Research Draft</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Pending Drafts Review Queue */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Autonomous Content Drafts Workspace ({contentDrafts.length})</span>
              <span className="text-xs text-amber-400 font-mono">{pendingDraftsCount} Pending Human Approval</span>
            </h3>

            <div className="space-y-3">
              {contentDrafts.map(draft => (
                <div
                  key={draft.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    draft.status === 'under_review' || draft.status === 'draft'
                      ? 'bg-[#0B1120] border-amber-500/40'
                      : draft.status === 'published' || draft.status === 'approved'
                      ? 'bg-[#0B1120]/70 border-emerald-500/30 opacity-80'
                      : 'bg-[#0B1120]/50 border-rose-500/20 opacity-60'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{draft.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 uppercase font-semibold">
                          {draft.draftType}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                            draft.status === 'under_review' || draft.status === 'draft'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : draft.status === 'published' || draft.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {draft.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400">{draft.adminNotes}</p>

                      <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500 font-mono">
                        <span>Generated by: {draft.aiGeneratedBy}</span>
                        <span>·</span>
                        <span>Date: {draft.researchedDate}</span>
                        <span>·</span>
                        <span>Source: {draft.sourceUrl || 'Official Authority'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setInspectingDraft(draft)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>Inspect Payload</span>
                      </button>

                      {(draft.status === 'under_review' || draft.status === 'draft') && (
                        <>
                          <button
                            onClick={() => approveAndPublishDraft(draft.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Publish</span>
                          </button>
                          <button
                            onClick={() => rejectDraft(draft.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: PARTNER ACCREDITATION REVIEWS ================= */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Institutional & Partner Accreditation Reviews</h2>
            <span className="text-xs text-amber-400 font-mono">{pendingOrgCount} Pending Applications</span>
          </div>

          <div className="space-y-3">
            {partnerOrganizations.map(org => (
              <div
                key={org.id}
                className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{org.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        org.verificationStatus === 'verified'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : org.verificationStatus === 'pending'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {org.verificationStatus.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">
                      {org.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {org.city}, {org.country} · {org.contactEmail} · Applied: {org.appliedDate}
                  </p>
                  <p className="text-xs text-slate-300 max-w-2xl">{org.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {org.verificationStatus === 'pending' ? (
                    <>
                      <button
                        onClick={() => verifyOrganization(org.id, 'verified')}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accredit Partner</span>
                      </button>
                      <button
                        onClick={() => verifyOrganization(org.id, 'rejected')}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">Review Concluded</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: AUDIT LOGS ================= */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Immutable System & Privacy Audit Trail</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">{adminAuditLogs.length} Records</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Every administrative alteration, JARVIS AI content draft generation, publication to live databases, and minor privacy validation is chronologically logged with operator attribution.
          </p>

          <div className="divide-y divide-slate-800 text-xs font-mono">
            {adminAuditLogs.map(log => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300">
                      {log.target}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans block">{log.details}</span>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-sky-400 block font-semibold">{log.performedBy}</span>
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT UNIVERSITY ================= */}
      {isUniModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingUni ? 'Edit University Record' : 'Add Verified University'}
              </h3>
              <button
                onClick={() => setIsUniModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUni} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">University Name *</label>
                  <input
                    type="text"
                    required
                    value={uniName}
                    onChange={e => setUniName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={uniCountry}
                    onChange={e => setUniCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={uniCity}
                    onChange={e => setUniCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">QS World Ranking</label>
                  <input
                    type="number"
                    value={uniQsRank}
                    onChange={e => setUniQsRank(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tuition Per Year (USD)</label>
                  <input
                    type="number"
                    value={uniTuition}
                    onChange={e => setUniTuition(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Monthly Living Cost (USD)</label>
                  <input
                    type="number"
                    value={uniLivingCost}
                    onChange={e => setUniLivingCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Min GPA (e.g. 3.5)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={uniGpaMin}
                    onChange={e => setUniGpaMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Min IELTS (e.g. 6.5)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={uniIeltsMin}
                    onChange={e => setUniIeltsMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Official Website URL</label>
                <input
                  type="url"
                  value={uniWebsite}
                  onChange={e => setUniWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description & Key Highlights</label>
                <textarea
                  rows={2}
                  value={uniDescription}
                  onChange={e => setUniDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUniModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md shadow-sky-600/20"
                >
                  Save University Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT SCHOLARSHIP ================= */}
      {isScholarshipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingScholarship ? 'Edit Scholarship' : 'Add Verified Scholarship'}
              </h3>
              <button
                onClick={() => setIsScholarshipModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveScholarship} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Scholarship Name *</label>
                <input
                  type="text"
                  required
                  value={schName}
                  onChange={e => setSchName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Provider *</label>
                  <input
                    type="text"
                    required
                    value={schProvider}
                    onChange={e => setSchProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Host Country</label>
                  <input
                    type="text"
                    value={schCountry}
                    onChange={e => setSchCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Funding Type</label>
                  <select
                    value={schFundingType}
                    onChange={e => setSchFundingType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  >
                    <option value="Full Funding">Full Funding</option>
                    <option value="Partial Funding">Partial Funding</option>
                    <option value="Tuition Waiver">Tuition Waiver</option>
                    <option value="Monthly Stipend">Monthly Stipend</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Estimated Value (USD)</label>
                  <input
                    type="number"
                    value={schEstimatedValue}
                    onChange={e => setSchEstimatedValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={schDeadline}
                    onChange={e => setSchDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Official Application URL</label>
                  <input
                    type="url"
                    value={schOfficialLink}
                    onChange={e => setSchOfficialLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={schDescription}
                  onChange={e => setSchDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScholarshipModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT COUNTRY ================= */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingCountry ? 'Edit Country Profile' : 'Add Destination Country'}
              </h3>
              <button
                onClick={() => setIsCountryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCountry} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-slate-400 block mb-1">Country Name *</label>
                  <input
                    type="text"
                    required
                    value={ctyName}
                    onChange={e => setCtyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">ISO Code (e.g. DE)</label>
                  <input
                    type="text"
                    value={ctyCode}
                    onChange={e => setCtyCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white uppercase text-center font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Region</label>
                  <select
                    value={ctyRegion}
                    onChange={e => setCtyRegion(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  >
                    <option value="Europe">Europe</option>
                    <option value="North America">North America</option>
                    <option value="Asia-Pacific">Asia-Pacific</option>
                    <option value="Middle East">Middle East</option>
                    <option value="Latin America">Latin America</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Post-Study Work (Months)</label>
                  <input
                    type="number"
                    value={ctyWorkMonths}
                    onChange={e => setCtyWorkMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Living Cost Min ($)</label>
                  <input
                    type="number"
                    value={ctyLivingMin}
                    onChange={e => setCtyLivingMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Living Cost Max ($)</label>
                  <input
                    type="number"
                    value={ctyLivingMax}
                    onChange={e => setCtyLivingMax(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Visa Overview & Regulations</label>
                <textarea
                  rows={2}
                  value={ctyVisaOverview}
                  onChange={e => setCtyVisaOverview(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white resize-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Official Immigration Portal URL</label>
                <input
                  type="url"
                  value={ctyImmigrationPortal}
                  onChange={e => setCtyImmigrationPortal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCountryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  Save Country
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT GUIDE ================= */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingGuide ? 'Edit Knowledge Guide' : 'Add Relocation / Prep Guide'}
              </h3>
              <button
                onClick={() => setIsGuideModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGuide} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Guide Title *</label>
                <input
                  type="text"
                  required
                  value={guideTitle}
                  onChange={e => setGuideTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={guideCategory}
                  onChange={e => setGuideCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white"
                >
                  <option value="Visa & Immigration">Visa & Immigration</option>
                  <option value="Relocation & Housing">Relocation & Housing</option>
                  <option value="Finances & Budgeting">Finances & Budgeting</option>
                  <option value="Standardized Testing">Standardized Testing</option>
                  <option value="Application Essays">Application Essays</option>
                  <option value="Career & Work Rights">Career & Work Rights</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Summary</label>
                <textarea
                  rows={2}
                  value={guideSummary}
                  onChange={e => setGuideSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white resize-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Markdown Body</label>
                <textarea
                  rows={4}
                  value={guideMarkdown}
                  onChange={e => setGuideMarkdown(e.target.value)}
                  placeholder="# Steps\n\n1. Check eligibility..."
                  className="w-full px-3 py-2 rounded-xl bg-[#111C33] border border-slate-700 text-white font-mono text-[11px] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGuideModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  Save Guide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: INSPECT JARVIS DRAFT PAYLOAD ================= */}
      {inspectingDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-sky-400 font-semibold">
                  {inspectingDraft.draftType} Draft Payload
                </span>
                <h3 className="text-base font-bold text-white">{inspectingDraft.title}</h3>
              </div>
              <button
                onClick={() => setInspectingDraft(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-300 block mb-1">Verification Source:</span>
                {inspectingDraft.sourceUrl ? (
                  <a
                    href={inspectingDraft.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{inspectingDraft.sourceUrl}</span>
                  </a>
                ) : (
                  <span className="text-slate-500">Official Portal</span>
                )}
              </div>

              <div>
                <span className="font-semibold text-slate-300 block mb-1">Structured JSON Data:</span>
                <pre className="p-3 rounded-xl bg-[#070B14] border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-64">
                  {JSON.stringify(inspectingDraft.contentData, null, 2)}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 text-slate-300">
                <span className="font-semibold text-sky-400 block mb-0.5">Auditor Verification Note:</span>
                {inspectingDraft.adminNotes || 'Structured by JARVIS Autonomous AI Gateway node.'}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setInspectingDraft(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                Close Inspector
              </button>

              {(inspectingDraft.status === 'under_review' || inspectingDraft.status === 'draft') && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      rejectDraft(inspectingDraft.id);
                      setInspectingDraft(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      approveAndPublishDraft(inspectingDraft.id);
                      setInspectingDraft(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Publish Live</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
