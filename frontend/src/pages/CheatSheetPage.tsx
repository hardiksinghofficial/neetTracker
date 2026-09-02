import React, { useState } from 'react';
import { Search, AlertTriangle, Atom, FlaskConical, Dna, Copy, Check } from 'lucide-react';
import { PHYSICS_FORMULAS, INORGANIC_EXCEPTIONS, ORGANIC_REAGENTS, BIOLOGY_NCERT_NUMBERS } from '../data/cheatSheetData';
import clsx from 'clsx';

const CheatSheetPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'physics' | 'inorganic' | 'organic' | 'biology'>('physics');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPhysics = PHYSICS_FORMULAS.filter(f => 
    !searchQuery.trim() || f.topic.toLowerCase().includes(searchQuery.toLowerCase()) || f.chapter.toLowerCase().includes(searchQuery.toLowerCase()) || f.formula.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInorganic = INORGANIC_EXCEPTIONS.filter(e => 
    !searchQuery.trim() || e.category.toLowerCase().includes(searchQuery.toLowerCase()) || e.exception.toLowerCase().includes(searchQuery.toLowerCase()) || e.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrganic = ORGANIC_REAGENTS.filter(r => 
    !searchQuery.trim() || r.reagentName.toLowerCase().includes(searchQuery.toLowerCase()) || r.specificFunction.toLowerCase().includes(searchQuery.toLowerCase()) || r.exampleReaction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBio = BIOLOGY_NCERT_NUMBERS.filter(b => 
    !searchQuery.trim() || b.parameter.toLowerCase().includes(searchQuery.toLowerCase()) || b.valueWithUnit.toLowerCase().includes(searchQuery.toLowerCase()) || b.chapter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ⚡ 10-MIN RAPID REVISION BANK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Formulas & NCERT Exceptions Bank
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              High-yield physics formulas with units, inorganic periodic exceptions, organic reagents, and critical NCERT biology values.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0D131F] p-1.5 rounded-3xl border border-slate-800/80">
        {[
          { id: 'physics', label: '⚛️ Physics Formulas', icon: Atom },
          { id: 'inorganic', label: '🧪 Inorganic Exceptions', icon: FlaskConical },
          { id: 'organic', label: '⚗️ Organic Reagents', icon: FlaskConical },
          { id: 'biology', label: '🧬 Biology NCERT Numbers', icon: Dna },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); }}
            className={clsx(
              "py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all text-center",
              activeTab === tab.id
                ? "bg-[#131B2B] text-emerald-400 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search in ${activeTab}...`}
          className="w-full pl-11 pr-4 py-3 bg-[#0D131F] border border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-500 outline-none"
        />
      </div>

      {/* Content Area */}
      {/* 1. Physics Formulas */}
      {activeTab === 'physics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPhysics.map((f) => (
            <div key={f.id} className="p-6 rounded-3xl bg-[#0D131F] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{f.chapter}</span>
                  <button 
                    onClick={() => handleCopy(f.id, f.formula)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                    title="Copy Formula"
                  >
                    {copiedId === f.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <h3 className="font-extrabold text-white text-base mb-3">{f.topic}</h3>
                
                {/* Highlighted Formula Block */}
                <div className="p-3.5 rounded-2xl bg-[#131B2B] border border-cyan-500/30 text-cyan-300 font-mono font-bold text-sm sm:text-base text-center my-2">
                  {f.formula}
                </div>

                <div className="text-xs text-slate-400 mt-2 space-y-1">
                  <div><strong>Variables:</strong> {f.variables}</div>
                  <div><strong>SI Units:</strong> {f.units}</div>
                </div>
              </div>

              {/* Trap Tip */}
              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 leading-relaxed">
                <strong className="text-rose-400 flex items-center gap-1 mb-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> NEET Exam Trap:
                </strong>
                {f.neetTrapTip}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Inorganic Exceptions */}
      {activeTab === 'inorganic' && (
        <div className="space-y-4">
          {filteredInorganic.map((e) => (
            <div key={e.id} className="p-6 rounded-3xl bg-[#0D131F] border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{e.category}</span>
                  <h3 className="font-extrabold text-white text-base mt-0.5">{e.rule}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#131B2B] border border-slate-700 text-slate-400">
                  {e.ncertReference}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs sm:text-sm font-bold text-amber-300">
                🚨 NCERT Exception: {e.exception}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#131B2B] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block mb-0.5">💡 Scientific Reason (Asked in Assertion-Reason):</strong>
                {e.reason}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Organic Reagents */}
      {activeTab === 'organic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrganic.map((r) => (
            <div key={r.id} className="p-6 rounded-3xl bg-[#0D131F] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{r.formula}</span>
                </div>
                <h3 className="font-extrabold text-white text-lg mb-2">{r.reagentName}</h3>

                <div className="p-3 rounded-2xl bg-[#131B2B] border border-slate-800 text-xs text-slate-200 mb-3">
                  <strong className="text-emerald-400 block mb-0.5">Reaction Role:</strong>
                  {r.specificFunction}
                </div>

                <div className="p-3 rounded-2xl bg-[#080C14] border border-slate-800 text-xs text-amber-300 font-mono">
                  {r.exampleReaction}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300">
                <strong className="text-rose-400 block mb-0.5">⚠️ Exam Note:</strong>
                {r.examTrapNote}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Biology NCERT Numbers */}
      {activeTab === 'biology' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredBio.map((b) => (
            <div key={b.id} className="p-5 rounded-3xl bg-[#0D131F] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{b.chapter}</span>
                <h3 className="font-bold text-white text-sm mt-0.5">{b.parameter}</h3>
              </div>

              <div className="p-3 rounded-2xl bg-[#131B2B] border border-emerald-500/30 text-emerald-300 font-mono font-black text-base text-center">
                {b.valueWithUnit}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {b.context}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheatSheetPage;
