import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ApplicationItem, TaskCategory } from '../../types';
import {
  FolderKanban,
  List,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  X,
  Tag,
  Filter,
} from 'lucide-react';

const STATUS_COLUMNS: ApplicationItem['status'][] = [
  'Researching',
  'Preparing',
  'Ready to Apply',
  'Submitted',
  'Under Review',
  'Accepted',
];

export const ApplicationTrackerView: React.FC = () => {
  const { user } = useAuth();
  const {
    applications,
    addApplication,
    updateApplicationStatus,
    toggleApplicationChecklistItem,
    addTaskToApplication,
    deleteTaskFromApplication,
    deleteApplication,
    taskCategories,
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // New Application Form State
  const [newTitle, setNewTitle] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newType, setNewType] = useState<ApplicationItem['type']>('University');
  const [newDeadline, setNewDeadline] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [initialTaskLabel, setInitialTaskLabel] = useState('');
  const [initialTaskCategory, setInitialTaskCategory] = useState<TaskCategory>('Academic & Transcripts');

  // Inline Task Addition State (appId -> boolean)
  const [addingTaskForAppId, setAddingTaskForAppId] = useState<string | null>(null);
  const [inlineTaskLabel, setInlineTaskLabel] = useState('');
  const [inlineTaskCategory, setInlineTaskCategory] = useState<TaskCategory>('Personal Statement & Essays');
  const [inlineDueDate, setInlineDueDate] = useState('');

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newInstitution.trim()) return;

    const defaultTasks = [
      {
        id: `task_${Date.now()}_1`,
        label: initialTaskLabel.trim() || 'Submit Official Academic Transcripts',
        isCompleted: false,
        category: initialTaskCategory,
      },
      {
        id: `task_${Date.now()}_2`,
        label: 'IELTS / TOEFL English Score Report',
        isCompleted: false,
        category: 'Standardized Tests & Language' as TaskCategory,
      },
      {
        id: `task_${Date.now()}_3`,
        label: 'Statement of Purpose / Motivation Essay',
        isCompleted: false,
        category: 'Personal Statement & Essays' as TaskCategory,
      },
    ];

    addApplication({
      studentId: user?.id || 'usr_demo',
      title: newTitle.trim(),
      institutionName: newInstitution.trim(),
      type: newType,
      status: 'Researching',
      deadlineDate: newDeadline || '2027-01-15',
      privateNotes: newNotes,
      checklist: defaultTasks,
    });

    setNewTitle('');
    setNewInstitution('');
    setNewDeadline('');
    setNewNotes('');
    setInitialTaskLabel('');
    setShowAddModal(false);
  };

  const handleAddInlineTask = (appId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineTaskLabel.trim()) return;

    addTaskToApplication(appId, {
      label: inlineTaskLabel.trim(),
      category: inlineTaskCategory,
      dueDate: inlineDueDate || undefined,
    });

    setInlineTaskLabel('');
    setInlineDueDate('');
    setAddingTaskForAppId(null);
  };

  // Helper color for categories
  const getCategoryColor = (cat?: TaskCategory) => {
    switch (cat) {
      case 'Academic & Transcripts':
        return 'text-sky-400 bg-sky-950/60 border-sky-800/60';
      case 'Standardized Tests & Language':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'Personal Statement & Essays':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'Recommendations & References':
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60';
      case 'Financial & Scholarships':
        return 'text-teal-400 bg-teal-950/60 border-teal-800/60';
      case 'Visa & Immigration':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
      case 'Portfolio & Projects':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/15 text-sky-500 font-mono">
              Active Application Manager
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">Categorized Task Checklists & Deadlines</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Application Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organize requirements by category: Academic, Testing, Essays, References, Financial, and Visa.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
          <Filter className="w-3.5 h-3.5 text-sky-400" />
          <span>Task Filter:</span>
        </span>
        <button
          onClick={() => setSelectedCategoryFilter('all')}
          className={`px-3 py-1 rounded-lg border shrink-0 transition-colors ${
            selectedCategoryFilter === 'all'
              ? 'bg-sky-500/15 border-sky-500 text-sky-400 font-semibold'
              : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Categories
        </button>
        {taskCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`px-3 py-1 rounded-lg border shrink-0 transition-colors ${
              selectedCategoryFilter === cat
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((columnStatus) => {
            const columnApps = applications.filter((a) => a.status === columnStatus);

            return (
              <div
                key={columnStatus}
                className="rounded-xl bg-slate-100/70 dark:bg-[#0B1120]/80 border border-slate-200 dark:border-slate-800 p-3 space-y-3 flex flex-col min-w-[240px]"
              >
                <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {columnStatus}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {columnApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {columnApps.map((app) => {
                    const filteredTasks = selectedCategoryFilter === 'all'
                      ? app.checklist
                      : app.checklist.filter((t) => t.category === selectedCategoryFilter);

                    const completedChecklist = app.checklist.filter((c) => c.isCompleted).length;
                    const totalChecklist = app.checklist.length;
                    const percentChecklist = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 100;

                    return (
                      <div
                        key={app.id}
                        className="p-3 rounded-lg bg-white dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[10px] font-mono text-sky-400 block font-semibold">
                              {app.type}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                              {app.title}
                            </h4>
                            <p className="text-[11px] text-slate-500">{app.institutionName}</p>
                          </div>
                          <button
                            onClick={() => deleteApplication(app.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Checklist progress */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>Tasks: {completedChecklist}/{totalChecklist}</span>
                            <span>{percentChecklist}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: `${percentChecklist}%` }}
                            />
                          </div>
                        </div>

                        {/* Filtered Tasks Checklist */}
                        <div className="space-y-1.5 pt-1">
                          {filteredTasks.map((task) => (
                            <div
                              key={task.id}
                              className="group flex items-center justify-between text-[11px] p-1.5 rounded bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800/70"
                            >
                              <button
                                onClick={() => toggleApplicationChecklistItem(app.id, task.id)}
                                className="flex items-center gap-1.5 text-left flex-1 min-w-0"
                              >
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    task.isCompleted ? 'text-emerald-500' : 'text-slate-500'
                                  }`}
                                />
                                <span
                                  className={`truncate ${
                                    task.isCompleted
                                      ? 'line-through text-slate-400'
                                      : 'text-slate-800 dark:text-slate-200'
                                  }`}
                                >
                                  {task.label}
                                </span>
                              </button>
                              {task.category && (
                                <span
                                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded border shrink-0 ml-1 ${getCategoryColor(
                                    task.category
                                  )}`}
                                >
                                  {task.category.split('&')[0]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Inline Add Task Form / Trigger */}
                        {addingTaskForAppId === app.id ? (
                          <form
                            onSubmit={(e) => handleAddInlineTask(app.id, e)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-[#0B1120] border border-sky-500/40 space-y-2 text-xs"
                          >
                            <input
                              type="text"
                              value={inlineTaskLabel}
                              onChange={(e) => setInlineTaskLabel(e.target.value)}
                              placeholder="New task description..."
                              className="w-full px-2 py-1 text-[11px] rounded bg-white dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-white"
                              autoFocus
                              required
                            />

                            <div>
                              <label className="text-[10px] text-slate-400 block mb-0.5">Task Category</label>
                              <select
                                value={inlineTaskCategory}
                                onChange={(e) => setInlineTaskCategory(e.target.value as TaskCategory)}
                                className="w-full px-2 py-1 text-[10px] rounded bg-white dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-200"
                              >
                                {taskCategories.map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center justify-end gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => setAddingTaskForAppId(null)}
                                className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-2.5 py-0.5 text-[10px] font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded"
                              >
                                Add Task
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => {
                              setAddingTaskForAppId(app.id);
                              setInlineTaskLabel('');
                            }}
                            className="w-full py-1 text-[10px] text-sky-400 hover:text-sky-300 border border-dashed border-slate-300 dark:border-slate-800 rounded flex items-center justify-center gap-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Categorized Task</span>
                          </button>
                        )}

                        {/* Deadline */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-500" />
                            <span>{app.deadlineDate}</span>
                          </span>
                        </div>

                        {/* Status Select dropdown */}
                        <div className="pt-1">
                          <label htmlFor={`status-select-${app.id}`} className="sr-only">
                            Move Status
                          </label>
                          <select
                            id={`status-select-${app.id}`}
                            value={app.status}
                            onChange={(e) =>
                              updateApplicationStatus(app.id, e.target.value as ApplicationItem['status'])
                            }
                            className="w-full p-1 text-[10px] rounded bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                          >
                            {STATUS_COLUMNS.map((st) => (
                              <option key={st} value={st}>
                                Move: {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {app.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
                        {app.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{app.type}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{app.institutionName}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Deadline: {app.deadlineDate}</span>
                    </span>
                    <button
                      onClick={() => deleteApplication(app.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Categorized Tasks Grid */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Categorized Checklist ({app.checklist.filter((c) => c.isCompleted).length}/{app.checklist.length} Complete)
                    </span>
                    <button
                      onClick={() => {
                        setAddingTaskForAppId(addingTaskForAppId === app.id ? null : app.id);
                        setInlineTaskLabel('');
                      }}
                      className="text-xs text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task</span>
                    </button>
                  </div>

                  {addingTaskForAppId === app.id && (
                    <form
                      onSubmit={(e) => handleAddInlineTask(app.id, e)}
                      className="mb-3 p-3 rounded-xl bg-slate-100 dark:bg-[#0B1120] border border-sky-500/30 grid grid-cols-1 md:grid-cols-4 gap-2 text-xs"
                    >
                      <input
                        type="text"
                        value={inlineTaskLabel}
                        onChange={(e) => setInlineTaskLabel(e.target.value)}
                        placeholder="Task description (e.g. Request transcript from Lyceum)..."
                        className="md:col-span-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-white"
                        required
                      />
                      <select
                        value={inlineTaskCategory}
                        onChange={(e) => setInlineTaskCategory(e.target.value as TaskCategory)}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-200"
                      >
                        {taskCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="flex-1 px-3 py-1.5 rounded-lg font-semibold text-white bg-sky-600 hover:bg-sky-500"
                        >
                          Save Task
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddingTaskForAppId(null)}
                          className="px-2 py-1.5 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {app.checklist.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-colors ${
                          item.isCompleted
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-white dark:bg-[#0B1120] border-slate-200 dark:border-slate-800 text-slate-200'
                        }`}
                      >
                        <button
                          onClick={() => toggleApplicationChecklistItem(app.id, item.id)}
                          className="flex items-center gap-2 min-w-0 flex-1 text-left"
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              item.isCompleted ? 'text-emerald-400' : 'text-slate-500'
                            }`}
                          />
                          <span className={`truncate ${item.isCompleted ? 'line-through text-slate-400' : ''}`}>
                            {item.label}
                          </span>
                        </button>

                        <div className="flex items-center gap-1 shrink-0">
                          {item.category && (
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${getCategoryColor(
                                item.category
                              )}`}
                            >
                              {item.category.split('&')[0]}
                            </span>
                          )}
                          <button
                            onClick={() => deleteTaskFromApplication(app.id, item.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 opacity-60 hover:opacity-100"
                            title="Remove task"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Application Modal with Category Selection */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#0B1120] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-400" />
                <span>Track New Application</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-400 block mb-1">
                  Application Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. B.Sc. Computer Science or Chevening Award"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-400 block mb-1">
                    Institution / Provider
                  </label>
                  <input
                    type="text"
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    placeholder="e.g. TUM or UK Government"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-400 block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ApplicationItem['type'])}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <option value="University">University</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-400 block mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Initial Task with Category Selection Dropdown */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                  Add First Task & Category
                </span>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Task Description</label>
                  <input
                    type="text"
                    value={initialTaskLabel}
                    onChange={(e) => setInitialTaskLabel(e.target.value)}
                    placeholder="e.g. Request Recommendation Letter from Math Teacher"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Task Category (Selection)</label>
                  <select
                    value={initialTaskCategory}
                    onChange={(e) => setInitialTaskCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-200"
                  >
                    {taskCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-400 block mb-1">Private Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notes, professor names, portal passwords hints..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors"
                >
                  Create Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
