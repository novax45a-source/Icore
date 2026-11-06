import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StartupProject } from '../../types';
import {
  Rocket,
  Users,
  Plus,
  Send,
  ShieldCheck,
  Tag,
  CheckCircle2,
  X,
  Lock,
} from 'lucide-react';

export const StartupNetworkView: React.FC = () => {
  const { user } = useAuth();
  const { startupProjects, addStartupProject } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProjectForContact, setSelectedProjectForContact] = useState<StartupProject | null>(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [connectSent, setConnectSent] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [field, setField] = useState<StartupProject['field']>('AI');
  const [stage, setStage] = useState<StartupProject['currentStage']>('Prototype in Progress');
  const [neededRoles, setNeededRoles] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) return;

    addStartupProject({
      authorId: user?.id || 'usr_demo',
      authorName: `${user?.firstName || 'Student'} ${user?.lastName || ''}`,
      title: title.trim(),
      tagline: tagline.trim(),
      field,
      currentStage: stage,
      neededRoles: neededRoles.split(',').map((r) => r.trim()).filter((r) => r.length > 0),
      description: description.trim(),
      membersCount: 1,
      contactAllowed: true,
    });

    setTitle('');
    setTagline('');
    setNeededRoles('');
    setDescription('');
    setShowCreateModal(false);
  };

  const handleSendConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectMessage.trim()) return;

    setConnectSent(true);
    setTimeout(() => {
      setConnectSent(false);
      setSelectedProjectForContact(null);
      setConnectMessage('');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#0284C7]/15 text-[#0284C7] dark:text-[#38BDF8]">
              Student Innovation Hub
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">Safe Cross-Border Collaboration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Startup & Co-Founder Network
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Find technical co-founders, join student hackathon teams, and publish open project concepts.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] to-[#0284C7] hover:opacity-95 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Publish Project Concept</span>
        </button>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {startupProjects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {proj.field} · {proj.currentStage}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-[#0284C7] dark:text-[#38BDF8] font-medium">
                    {proj.tagline}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {proj.description}
              </p>

              {/* Roles Needed */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Looking For Collaborators:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.neededRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#0284C7]/10 text-[#0284C7] border border-[#0284C7]/20"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer: Creator info and join trigger */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5" />
                <span>By {proj.authorName} ({proj.membersCount} members)</span>
              </div>

              <button
                onClick={() => setSelectedProjectForContact(proj)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0284C7] text-white hover:bg-[#0369A1] transition-colors"
              >
                <span>Express Interest</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#11152A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-[#0284C7]" />
                <span>Publish Student Project</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Agro-Bot Autonomous Rover"
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  One-Line Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. AI-driven crop disease scanner for smallholder farmers"
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Domain</label>
                  <select
                    value={field}
                    onChange={(e) => setField(e.target.value as StartupProject['field'])}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <option value="AI">AI & Machine Learning</option>
                    <option value="EdTech">Education Technology</option>
                    <option value="Climate">Climate & Clean Energy</option>
                    <option value="Health">Healthcare & Biotech</option>
                    <option value="FinTech">FinTech</option>
                    <option value="Social Impact">Social Impact</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Current Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as StartupProject['currentStage'])}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <option value="Concept / Research">Concept / Research</option>
                    <option value="Prototype in Progress">Prototype in Progress</option>
                    <option value="MVP Launched">MVP Launched</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  Needed Roles (Comma separated)
                </label>
                <input
                  type="text"
                  value={neededRoles}
                  onChange={(e) => setNeededRoles(e.target.value)}
                  placeholder="e.g. Embedded C++ Developer, UI/UX Designer, Agronomist"
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is your mission, target user base, and hackathon roadmap?"
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1]"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Express Interest Safe Messaging Modal */}
      {selectedProjectForContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#11152A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Collaborate on {selectedProjectForContact.title}
              </h3>
              <button
                onClick={() => setSelectedProjectForContact(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Send a message explaining your background and how you would like to contribute. Your email is only shared if the creator accepts your collaboration request.
            </p>

            {connectSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Collaboration inquiry sent successfully to {selectedProjectForContact.authorName}!</span>
              </div>
            ) : (
              <form onSubmit={handleSendConnection} className="space-y-3">
                <textarea
                  rows={3}
                  value={connectMessage}
                  onChange={(e) => setConnectMessage(e.target.value)}
                  placeholder="Hi Aziz, I have 2 years of experience with Python and computer vision and would love to help calibrate your soil scanner..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                  required
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectForContact(null)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1]"
                  >
                    Send Request
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
