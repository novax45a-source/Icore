import React, { useState } from 'react';
import {
  Database,
  Search,
  Plus,
  Trash2,
  Tag,
  ShieldCheck,
  Calendar,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import { MemoryEntry, MemoryCategory } from '../core/memoryStore';

interface MemoryCenterViewProps {
  memories: MemoryEntry[];
  onAddMemory: (entry: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryCenterView: React.FC<MemoryCenterViewProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Memory Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('PROJECT');
  const [newProject, setNewProject] = useState<'VERON' | 'ICSN' | 'ENVO' | 'JARVIS'>('ENVO');
  const [newTags, setNewTags] = useState('envo, clean-energy');

  const filteredMemories = memories.filter(m => {
    if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
    if (selectedProject !== 'ALL' && m.project !== selectedProject) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddMemory({
      category: newCategory,
      project: newCategory === 'PROJECT' ? newProject : undefined,
      title: newTitle,
      content: newContent,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      confidence: 0.98,
      source: 'Founder Verified Input'
    });

    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#030814]/70">
      {/* Top Banner */}
      <div className="p-4 rounded-xl hud-glass border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-cyan-400" />
            SYNAPSE MEMORY & KNOWLEDGE CENTER
          </div>
          <h1 className="text-xl font-tech font-bold text-white tracking-wide">
            PERSISTENT SEMANTIC VECTOR MEMORY
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Founder Preferences • Isolated Project Knowledge (VERON, ICSN, ENVO, JARVIS)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Xotira Qo'shish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Xotiralar bo'ylab qidiruv (mavzu, matn, teglar)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-xs font-mono text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 focus:outline-none"
        >
          <option value="ALL">Barcha Kategoriyalar</option>
          <option value="LONG_TERM">Uzoq Muddatli (Long-Term)</option>
          <option value="PROJECT">Loyiha Xotirasi (Project)</option>
          <option value="KNOWLEDGE_BASE">Bilimlar Bazasi (Knowledge)</option>
          <option value="SHORT_TERM">Qisqa Muddatli (Short-Term)</option>
        </select>

        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          className="px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 focus:outline-none"
        >
          <option value="ALL">Barcha Loyihalar</option>
          <option value="VERON">VERON</option>
          <option value="ICSN">ICSN</option>
          <option value="ENVO">ENVO</option>
          <option value="JARVIS">JARVIS</option>
        </select>
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.map(entry => (
          <div
            key={entry.id}
            className="p-4 rounded-xl hud-glass border border-cyan-500/20 hover:border-cyan-400/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 font-bold">
                    {entry.category}
                  </span>
                  {entry.project && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-400/30 text-blue-300 font-bold">
                      [{entry.project}]
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    {(entry.confidence * 100).toFixed(0)}% Ishonch
                  </span>
                  <button
                    onClick={() => onDeleteMemory(entry.id)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h2 className="text-sm font-tech font-bold text-white mb-1.5">
                {entry.title}
              </h2>

              <p className="text-xs font-mono text-slate-300 leading-relaxed mb-3">
                {entry.content}
              </p>
            </div>

            <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div className="flex flex-wrap gap-1">
                {entry.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="shrink-0">{entry.source}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl hud-glass border border-cyan-400/50 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="text-base font-tech font-bold text-white tracking-wide flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                YANGI XOTIRA YOZISh
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Xotira sarlavhasi:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Masalan: ENVO Quyosh mikrotarmoq spetsifikatsiyasi"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Xotira mazmuni (Faktlar / Bilim):</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Ushbu ma'lumot kelajakdagi barcha tahlil va topshiriqlarda kontekst sifatida saqlanadi..."
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Kategoriya:</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-300 focus:outline-none"
                  >
                    <option value="PROJECT">PROJECT (Loyiha)</option>
                    <option value="LONG_TERM">LONG_TERM (Doimiy)</option>
                    <option value="KNOWLEDGE_BASE">KNOWLEDGE_BASE</option>
                    <option value="SHORT_TERM">SHORT_TERM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Loyiha partitsiyasi:</label>
                  <select
                    value={newProject}
                    onChange={e => setNewProject(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-300 focus:outline-none"
                  >
                    <option value="VERON">VERON</option>
                    <option value="ICSN">ICSN</option>
                    <option value="ENVO">ENVO</option>
                    <option value="JARVIS">JARVIS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Teglar (vergul bilan):</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="envo, microgrid, clean-energy"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-black/40 border border-slate-700 text-slate-300 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
