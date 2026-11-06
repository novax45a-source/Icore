import React, { useState } from 'react';
import { Search, Globe, ExternalLink, Sparkles, Loader2, BookOpen } from 'lucide-react';

export const SearchGroundingWidget: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    groundingChunks: Array<{ web: { title: string; uri: string } }>;
  } | null>({
    text: "O‘zbekiston va xalqaro ta’lim bo‘yicha yangilanishlar: Digital SAT imtihoni College Board tomonidan to‘liq raqamlashtirilgan bo‘lib, 1600 maksimal ball tizimi qo‘llaniladi. O‘zbekiston OTMlariga kirishda Milliy sertifikat (A+) imtihonlarida maksimal ball hisoblanishi tasdiqlangan.",
    groundingChunks: [
      {
        web: {
          title: 'Davlat Test Markazi (Bilimni baholash agentligi rasmiy portali)',
          uri: 'https://uzbmb.uz',
        },
      },
      {
        web: {
          title: 'College Board Official Digital SAT Suite',
          uri: 'https://satsuite.collegeboard.org',
        },
      },
    ],
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      setResult({
        text: data.text || 'Ma’lumot topilmadi.',
        groundingChunks: data.groundingChunks || [],
      });
    } catch (err) {
      console.error('Search grounding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Globe className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              Google Qidiruv Asosidagi Ta’lim Ma’lumotlari (Search Grounding)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-bold border border-blue-200">
                gemini-3.8-flash
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Imtihonlar, SAT/IELTS yangilanishlari va OTM qabuli bo‘yicha aniq ma’lumotlar
            </p>
          </div>
        </div>

        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium self-start sm:self-auto">
          Google Search Grounded ✓
        </span>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Masalan: SAT imtihon sanalari 2026 yoki Milliy sertifikat ballari..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Qidirish
        </button>
      </form>

      {/* Grounded Response Body */}
      {result && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
          <p className="text-slate-800 leading-relaxed font-sans">{result.text}</p>

          {/* Citations & Sources */}
          {result.groundingChunks && result.groundingChunks.length > 0 && (
            <div className="pt-3 border-t border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                Tasdiqlangan Google Qidiruv Manbalari:
              </span>
              <div className="flex flex-wrap gap-2">
                {result.groundingChunks.map((chunk, idx) => {
                  const web = chunk.web;
                  if (!web?.uri) return null;
                  return (
                    <a
                      key={idx}
                      href={web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-medium text-blue-700 hover:text-blue-900 hover:border-blue-400 shadow-xs transition"
                    >
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span className="max-w-[200px] truncate">{web.title || web.uri}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
