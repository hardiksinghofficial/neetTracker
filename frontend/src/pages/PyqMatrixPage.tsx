import React, { useState } from 'react';
import { Search, Sparkles, BarChart2, CheckCircle2 } from 'lucide-react';
import { NEET_PYQ_STATS } from '../data/pyqData';
import clsx from 'clsx';

const PyqMatrixPage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Physics' | 'Chemistry' | 'Biology'>('All');
  const [selectedRoi, setSelectedRoi] = useState<'All' | 'Very High (Must Master)' | 'High ROI'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(1);

  const filteredStats = NEET_PYQ_STATS.filter(stat => {
    if (selectedSubject !== 'All' && stat.subject !== selectedSubject) return false;
    if (selectedRoi !== 'All' && stat.roiRank !== selectedRoi) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchChapter = stat.chapter.toLowerCase().includes(q);
      const matchTopics = stat.mostRepeatedTopics.some(t => t.toLowerCase().includes(q));
      return matchChapter || matchTopics;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                📊 NEET 2018–2024 PYQ INTELLIGENCE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              PYQ Trend & Weightage Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              NTA NEET question pattern analysis across 7 years. Focus on the highest Questions-per-Study-Hour chapters to maximize marks.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#131B2B] px-5 py-3 rounded-2xl border border-slate-700/80">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">80%</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Repeated Concepts</div>
            </div>
            <div className="h-8 w-px bg-slate-700 mx-2" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-400">~680</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Target Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapter or high-yield topic..."
            className="w-full pl-11 pr-4 py-3 bg-[#0D131F] border border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Pills */}
          <div className="flex bg-[#0D131F] p-1 rounded-2xl border border-slate-800 text-xs font-bold">
            {(['All', 'Biology', 'Physics', 'Chemistry'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                className={clsx(
                  "px-3 py-1.5 rounded-xl transition-all",
                  selectedSubject === s ? "bg-emerald-500 text-black shadow-sm font-black" : "text-slate-400 hover:text-white"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* ROI Filter */}
          <button
            onClick={() => setSelectedRoi(selectedRoi === 'All' ? 'Very High (Must Master)' : 'All')}
            className={clsx(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-extrabold transition-all",
              selectedRoi !== 'All' ? "bg-amber-500 text-black border-amber-500 shadow-sm" : "bg-[#0D131F] text-slate-300 border-slate-800 hover:border-slate-700"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Top ROI Chapters
          </button>
        </div>
      </div>

      {/* Matrix Table Cards */}
      <div className="space-y-3">
        {filteredStats.map((stat) => {
          const isExp = expandedRow === stat.id;
          const subjectColor = stat.subject === 'Biology' ? 'text-emerald-400' : stat.subject === 'Chemistry' ? 'text-amber-400' : 'text-cyan-400';

          return (
            <div 
              key={stat.id}
              className="bg-[#0D131F] rounded-3xl border border-slate-800/80 shadow-sm overflow-hidden transition-all hover:border-slate-700"
            >
              <button
                onClick={() => setExpandedRow(isExp ? null : stat.id)}
                className="w-full p-5 sm:p-6 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#131B2B]/40 transition-colors"
              >
                <div className="flex items-start md:items-center gap-4 flex-1">
                  <div className="p-3 rounded-2xl bg-[#131B2B] border border-slate-800 shrink-0">
                    <span className={clsx("font-black text-sm", subjectColor)}>
                      {stat.subject.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-500 font-bold uppercase">
                        Class {stat.classLevel} {stat.subGroup && `• ${stat.subGroup}`}
                      </span>
                      <span className={clsx(
                        "text-[10px] font-black px-2 py-0.5 rounded-md border",
                        stat.roiRank.includes('Very High') ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      )}>
                        ⭐ {stat.roiRank}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                      {stat.chapter}
                    </h3>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-center">
                    <div className="text-xs text-slate-500 font-bold">2024 NEET</div>
                    <div className="text-lg font-black text-white mt-0.5">{stat.lastYearQuestionCount2024} Qs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500 font-bold">7-Yr Total</div>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">{stat.totalQuestionsLast7Yrs} Qs</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-bold">Avg Weightage</div>
                    <div className="text-lg font-black text-amber-400 mt-0.5">~{stat.neetWeightagePercent}%</div>
                  </div>
                </div>
              </button>

              {/* Expanded Breakdown */}
              {isExp && (
                <div className="p-6 border-t border-slate-800/80 bg-[#080C14]/60 space-y-6">
                  {/* Question Type Breakdown */}
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-emerald-400" /> NEET Question Formats Breakdown
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-[#0D131F] border border-slate-800 text-center">
                        <div className="text-xs text-slate-400">Direct NCERT Lines</div>
                        <div className="text-xl font-black text-emerald-400 mt-1">{stat.questionTypes.directNcertPercent}%</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#0D131F] border border-slate-800 text-center">
                        <div className="text-xs text-slate-400">Numerical Calculation</div>
                        <div className="text-xl font-black text-cyan-400 mt-1">{stat.questionTypes.numericalPercent}%</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#0D131F] border border-slate-800 text-center">
                        <div className="text-xs text-slate-400">Assertion-Reason (A/R)</div>
                        <div className="text-xl font-black text-amber-400 mt-1">{stat.questionTypes.assertionReasonPercent}%</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#0D131F] border border-slate-800 text-center">
                        <div className="text-xs text-slate-400">Multi-Statement 1/2</div>
                        <div className="text-xl font-black text-rose-400 mt-1">{stat.questionTypes.multiStatementPercent}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Most Repeated Topics */}
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Guaranteed Recurring Sub-Topics in NEET
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {stat.mostRepeatedTopics.map((topic, i) => (
                        <div key={i} className="px-3 py-1.5 rounded-xl bg-[#131B2B] border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PyqMatrixPage;
