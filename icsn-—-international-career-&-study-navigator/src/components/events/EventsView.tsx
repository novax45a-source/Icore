import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EVENTS_DATA } from '../../data/eventsData';
import { GlobalEvent } from '../../types';
import {
  Calendar,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ShieldCheck,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { savedEvents, toggleSaveEvent, addPortfolioItem } = useApp();
  const [filterType, setFilterType] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const filteredEvents = EVENTS_DATA.filter((e) => {
    return filterType === 'All' || e.category === filterType;
  });

  const handleRegister = (evt: GlobalEvent) => {
    if (!registeredEvents.includes(evt.id)) {
      setRegisteredEvents((prev) => [...prev, evt.id]);
      // Also offer to record event in portfolio
      addPortfolioItem('volunteering', {
        title: `Attendee / Participant — ${evt.title}`,
        organization: evt.organizer,
        dateRange: evt.eventDate,
        description: `Participated in ${evt.title} focused on ${evt.topics.join(', ')}.`,
        tags: evt.topics,
        verified: true,
      });
      alert(`Registered for ${evt.title}! Added to your portfolio timeline.`);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#0284C7]/15 text-[#0284C7]">
              Official Educational Sessions
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">Admissions Webinars & Hackathons</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Global Events & Workshops
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Meet university admission deans, attend DAAD scholarship masterclasses, and compete in youth hackathons.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        {['All', 'Education Fair', 'Webinar', 'Hackathon', 'Workshop'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              filterType === cat
                ? 'bg-[#0284C7] text-white font-semibold'
                : 'bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => {
          const isSaved = savedEvents.includes(evt.id);
          const isRegistered = registeredEvents.includes(evt.id);

          return (
            <div
              key={evt.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#11152A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {evt.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-500">{evt.organizer}</p>
                  </div>

                  <button
                    onClick={() => toggleSaveEvent(evt.id)}
                    className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                      isSaved
                        ? 'border-[#0284C7] text-[#0284C7] bg-[#0284C7]/10'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {evt.description}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-1">
                  {evt.topics.map((top, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {top}
                    </span>
                  ))}
                </div>

                {/* Timing */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>{evt.eventDate}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>{evt.timeString}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <a
                  href={evt.registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  <span>Official Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleRegister(evt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isRegistered
                      ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
                      : 'bg-[#0284C7] text-white hover:bg-[#0369A1]'
                  }`}
                >
                  {isRegistered ? 'Registered & Added to Portfolio' : 'Register Interest'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
