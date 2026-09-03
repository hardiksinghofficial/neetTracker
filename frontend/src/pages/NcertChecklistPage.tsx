import React, { useState, useMemo, useEffect } from 'react';
import { CheckSquare, Square, RotateCcw, Search, CheckCircle2, FileText, X, Save } from 'lucide-react';
import { NEET_SYLLABUS } from '../data/neetSyllabus';
import { useAuth } from '../context/AuthContext';
import { safeStorage, getCleanInitialChecklist } from '../lib/storage';
import type { ChapterCheckState } from '../lib/storage';
import { syllabusAPI } from '../lib/api';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const DEFAULT_CHAPTER_NOTES: Record<number, string> = {
  101: '⚠️ Pay attention to Least Count formula for Vernier & Screw Gauge (Pitch/Total divisions). Zero error sign convention: +ve error -> subtract, -ve error -> add.',
  103: '⚠️ Trajectory equation y = x tan(θ) - (g x²)/(2 u² cos²(θ)). Maximum horizontal range at 45°, but max height at 90°.',
  201: '⚠️ Periodic Table: Electron gain enthalpy of Chlorine is MORE negative than Fluorine due to small size and inter-electronic repulsions in 2p orbital of F.',
  203: '⚠️ Thermodynamics: For isothermal reversible expansion, W = -2.303 nRT log(V2/V1). Free expansion into vacuum has W = 0 and q = 0.',
  301: '⚠️ Living World: ICBN (plants) & ICZN (animals). Binomial nomenclature: Genus capitalized, specific epithet lowercase. Herbarium sheet size 29 x 41.5 cm.',
  304: '⚠️ Animal Kingdom Table 4.1: Pseudocoelomate is strictly Aschelminthes. Radial symmetry in adult Echinodermata, bilateral in larvae.',
};

const NcertChecklistPage: React.FC = () => {
  const { mode } = useAuth();
  const [selectedClass, setSelectedClass] = useState<'All' | '11' | '12'>('All');
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Physics' | 'Chemistry' | 'Biology'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Chapter checklist state
  const [checklist, setChecklist] = useState<Record<number, ChapterCheckState>>(() => {
    return safeStorage.get<Record<number, ChapterCheckState>>('neet_ncert_chapter_checklist', getCleanInitialChecklist());
  });

  // Attached Notes per Chapter: chapterId -> string
  const [chapterNotes, setChapterNotes] = useState<Record<number, string>>(() => {
    return safeStorage.get<Record<number, string>>('neet_ncert_chapter_notes', DEFAULT_CHAPTER_NOTES);
  });

  // Active Note Modal
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [noteDraftText, setNoteDraftText] = useState('');

  useEffect(() => {
    syllabusAPI.getChapters().then((dbChapters) => {
      if (dbChapters && Array.isArray(dbChapters) && dbChapters.length > 0) {
        const newChecklist = { ...checklist };
        const newNotes = { ...chapterNotes };
        let hasChanges = false;
        dbChapters.forEach((ch: any) => {
          if (ch.isCompleted !== undefined || ch.isRevised !== undefined) {
            newChecklist[ch.id] = {
              completed: !!ch.isCompleted,
              revised: !!ch.isRevised,
            };
            hasChanges = true;
          }
          if (ch.notes) {
            newNotes[ch.id] = ch.notes;
            hasChanges = true;
          }
        });
        if (hasChanges) {
          setChecklist(newChecklist);
          setChapterNotes(newNotes);
          safeStorage.set('neet_ncert_chapter_checklist', newChecklist);
          safeStorage.set('neet_ncert_chapter_notes', newNotes);
        }
      }
    });
  }, []);

  const saveChecklist = (newChecklist: Record<number, ChapterCheckState>) => {
    setChecklist(newChecklist);
    safeStorage.set('neet_ncert_chapter_checklist', newChecklist);
  };

  const saveChapterNotes = (newNotes: Record<number, string>) => {
    setChapterNotes(newNotes);
    safeStorage.set('neet_ncert_chapter_notes', newNotes);
  };

  const toggleCompleted = (chapterId: number) => {
    if (mode === 'view') return;
    const current = checklist[chapterId] || { completed: false, revised: false };
    const newCompleted = !current.completed;
    const updated = {
      ...checklist,
      [chapterId]: {
        ...current,
        completed: newCompleted,
      },
    };
    saveChecklist(updated);
    syllabusAPI.updateChapter(chapterId, { isCompleted: newCompleted });
  };

  const toggleRevised = (chapterId: number) => {
    if (mode === 'view') return;
    const current = checklist[chapterId] || { completed: false, revised: false };
    const newRevised = !current.revised;
    const updated = {
      ...checklist,
      [chapterId]: {
        ...current,
        revised: newRevised,
      },
    };
    saveChecklist(updated);
    syllabusAPI.updateChapter(chapterId, { isRevised: newRevised });
  };

  const handleOpenNoteEditor = (chapterId: number) => {
    setEditingChapterId(chapterId);
    setNoteDraftText(chapterNotes[chapterId] || '');
  };

  const handleSaveNote = () => {
    if (editingChapterId === null) return;
    const updated = { ...chapterNotes };
    const noteContent = noteDraftText.trim();
    if (noteContent) {
      updated[editingChapterId] = noteContent;
    } else {
      delete updated[editingChapterId];
    }
    saveChapterNotes(updated);
    syllabusAPI.updateChapter(editingChapterId, { notes: noteContent });
    setEditingChapterId(null);
  };

  // Compile all chapters
  const allChapters = useMemo(() => [
    ...NEET_SYLLABUS.Physics.map(c => ({ ...c, subject: 'Physics' as const })),
    ...NEET_SYLLABUS.Chemistry.map(c => ({ ...c, subject: 'Chemistry' as const })),
    ...NEET_SYLLABUS.Biology.map(c => ({ ...c, subject: 'Biology' as const })),
  ], []);

  const filteredChapters = useMemo(() => {
    return allChapters.filter(ch => {
      if (selectedClass !== 'All' && ch.classLevel !== Number(selectedClass)) return false;
      if (selectedSubject !== 'All' && ch.subject !== selectedSubject) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hasNote = (chapterNotes[ch.id] || '').toLowerCase().includes(q);
        return ch.name.toLowerCase().includes(q) || ch.subject.toLowerCase().includes(q) || (ch.subGroup && ch.subGroup.toLowerCase().includes(q)) || hasNote;
      }
      return true;
    });
  }, [allChapters, selectedClass, selectedSubject, searchQuery, chapterNotes]);

  // Overall Metrics
  const totalChaptersCount = allChapters.length;
  const completedChaptersCount = allChapters.filter(c => checklist[c.id]?.completed).length;
  const revisedChaptersCount = allChapters.filter(c => checklist[c.id]?.revised).length;
  const chaptersLeftCount = totalChaptersCount - completedChaptersCount;
  const percentCompleted = Math.round((completedChaptersCount / totalChaptersCount) * 100);
  const percentRevised = Math.round((revisedChaptersCount / totalChaptersCount) * 100);

  // Active editing chapter object
  const activeEditingChapter = allChapters.find(c => c.id === editingChapterId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090A0F] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                📚 NCERT 11 & 12 COMPLETE CHAPTER CHECKLIST
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              NCERT Chapter Master Checklist & Attached Notes
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Tick chapters as Completed & Revised, and attach NCERT formula traps & exception notes directly to every chapter.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#030304] px-5 py-3 rounded-2xl border border-white/5">
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-400 font-mono">{completedChaptersCount} <span className="text-xs text-slate-500 font-bold">/ {totalChaptersCount}</span></div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Chapters Done</div>
            </div>
            <div className="h-8 w-px bg-slate-800 mx-2" />
            <div className="text-center">
              <div className="text-2xl font-black text-rose-400 font-mono">{chaptersLeftCount}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Chapters Left</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Progress Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
            <span>Overall Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{percentCompleted}%</div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">{completedChaptersCount} of {totalChaptersCount} Chapters Done</div>
          <div className="h-2 w-full bg-[#030304] rounded-full mt-3 overflow-hidden border border-white/5">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${percentCompleted}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
            <span>Chapters Revised</span>
            <RotateCcw className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{percentRevised}%</div>
          <div className="text-xs text-indigo-300 font-semibold mt-1">{revisedChaptersCount} Chapters Multi-Revised</div>
          <div className="h-2 w-full bg-[#030304] rounded-full mt-3 overflow-hidden border border-white/5">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${percentRevised}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
            <span>Class 11 Progress</span>
            <span className="text-[10px] font-bold text-indigo-300">Foundation</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {allChapters.filter(c => c.classLevel === 11 && checklist[c.id]?.completed).length} / {allChapters.filter(c => c.classLevel === 11).length}
          </div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Class 11 Chapters Completed</div>
          <div className="h-2 w-full bg-[#030304] rounded-full mt-3 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-indigo-400 rounded-full transition-all" 
              style={{ width: `${Math.round((allChapters.filter(c => c.classLevel === 11 && checklist[c.id]?.completed).length / allChapters.filter(c => c.classLevel === 11).length) * 100)}%` }} 
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
            <span>Class 12 Progress</span>
            <span className="text-[10px] font-bold text-emerald-400">Board & NEET</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {allChapters.filter(c => c.classLevel === 12 && checklist[c.id]?.completed).length} / {allChapters.filter(c => c.classLevel === 12).length}
          </div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Class 12 Chapters Completed</div>
          <div className="h-2 w-full bg-[#030304] rounded-full mt-3 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all" 
              style={{ width: `${Math.round((allChapters.filter(c => c.classLevel === 12 && checklist[c.id]?.completed).length / allChapters.filter(c => c.classLevel === 12).length) * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-3xl bg-[#090A0F] border border-white/5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <div className="flex bg-[#030304] p-1 rounded-2xl border border-white/5 text-xs font-bold">
            {(['All', '11', '12'] as const).map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={clsx(
                  "px-3.5 py-1.5 rounded-xl transition-all",
                  selectedClass === cls ? "bg-indigo-600 text-white font-black" : "text-slate-400 hover:text-white"
                )}
              >
                {cls === 'All' ? 'All Classes' : `Class ${cls}`}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div className="flex bg-[#030304] p-1 rounded-2xl border border-white/5 text-xs font-bold">
            {(['All', 'Physics', 'Chemistry', 'Biology'] as const).map(subj => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={clsx(
                  "px-3.5 py-1.5 rounded-xl transition-all",
                  selectedSubject === subj ? "bg-indigo-600 text-white font-black" : "text-slate-400 hover:text-white"
                )}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters or notes..."
            className="pl-8 pr-3 py-1.5 bg-[#030304] border border-white/5 rounded-xl text-xs text-white placeholder-slate-500 outline-none w-56 sm:w-64"
          />
        </div>
      </div>

      {/* Chapters Checklist Grid */}
      <div className="space-y-3">
        {filteredChapters.map((chapter) => {
          const state = checklist[chapter.id] || { completed: false, revised: false };
          const note = chapterNotes[chapter.id];

          const subjectColor = 
            chapter.subject === 'Physics' ? 'text-indigo-400' :
            chapter.subject === 'Chemistry' ? 'text-amber-400' : 'text-emerald-400';

          return (
            <div
              key={chapter.id}
              className={clsx(
                "p-4 sm:p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3",
                state.completed && state.revised
                  ? "bg-[#04100E] border-emerald-500/30"
                  : state.completed
                    ? "bg-[#090A0F] border-white/10"
                    : "bg-[#030304] border-white/5 opacity-80 hover:opacity-100"
              )}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-start sm:items-center gap-3.5 flex-1">
                  <div className="p-2.5 rounded-2xl bg-[#030304] border border-white/5 shrink-0">
                    <span className={clsx("font-black text-xs", subjectColor)}>
                      {chapter.subject.substring(0, 3).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        Class {chapter.classLevel} {chapter.subGroup && `• ${chapter.subGroup}`}
                      </span>
                      {chapter.isHighYield && (
                        <span className="text-[10px] font-black px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md border border-amber-500/30">
                          ⭐ High Yield (~{chapter.weightage}%)
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-500">
                        {chapter.topics.length} Subtopics
                      </span>
                    </div>

                    <h2 className={clsx(
                      "text-base font-bold mt-1 transition-all",
                      state.completed ? "text-white" : "text-slate-300"
                    )}>
                      {chapter.name}
                    </h2>
                  </div>
                </div>

                {/* Right Side: Checkboxes & Attach Note Button */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {/* Attach Note Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenNoteEditor(chapter.id)}
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition-all",
                      note
                        ? "bg-indigo-950/60 text-indigo-300 border-indigo-500/40"
                        : "bg-[#030304] text-slate-400 border-white/5 hover:text-white"
                    )}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{note ? '📝 View Note' : '+ Attach Note'}</span>
                  </button>

                  {/* 1. Completed Checkbox */}
                  <button
                    type="button"
                    disabled={mode === 'view'}
                    onClick={() => toggleCompleted(chapter.id)}
                    className={clsx(
                      "flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all",
                      state.completed
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm"
                        : "bg-[#030304] text-slate-400 border-white/5 hover:text-white"
                    )}
                  >
                    {state.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                    <span>{state.completed ? '✓ Completed' : 'Mark Done'}</span>
                  </button>

                  {/* 2. Revised Checkbox */}
                  <button
                    type="button"
                    disabled={mode === 'view'}
                    onClick={() => toggleRevised(chapter.id)}
                    className={clsx(
                      "flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all",
                      state.revised
                        ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-sm"
                        : "bg-[#030304] text-slate-400 border-white/5 hover:text-white"
                    )}
                  >
                    {state.revised ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400 stroke-[2.5]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                    <span>{state.revised ? '🔁 Revised' : 'Revise'}</span>
                  </button>
                </div>
              </div>

              {/* Attached Note Preview Strip (if exists) */}
              {note && (
                <div 
                  onClick={() => handleOpenNoteEditor(chapter.id)}
                  className="p-3 rounded-2xl bg-[#030304] border border-indigo-500/30 text-xs text-slate-300 hover:border-indigo-500/60 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-400 shrink-0 font-bold">📝 Attached Trap/Formula:</span>
                    <p className="line-clamp-2 text-slate-300 text-[11px] font-medium">{note}</p>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-400 group-hover:underline shrink-0">Edit Note →</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Attach / Edit Note Modal */}
      {editingChapterId !== null && activeEditingChapter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#090A0F] rounded-3xl border border-indigo-500/40 p-6 shadow-2xl space-y-4 relative">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-black text-indigo-400 uppercase tracking-wider">
                  Class {activeEditingChapter.classLevel} • {activeEditingChapter.subject}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">{activeEditingChapter.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Attach high-yield formula traps, NCERT exceptions & page notes</p>
              </div>
              <button
                onClick={() => setEditingChapterId(null)}
                className="p-2 rounded-xl bg-[#030304] text-slate-400 hover:text-white border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {[
                '⚠️ NCERT Exception Trap:',
                '📐 High-Yield Formula:',
                '📖 Diagram Key Points:',
                '🔥 Recent PYQ Trap:',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setNoteDraftText(prev => prev ? `${prev}\n${preset} ` : `${preset} `)}
                  className="px-2.5 py-1 rounded-lg bg-[#030304] hover:bg-[#12141D] text-slate-300 hover:text-indigo-300 text-[10px] font-bold border border-white/5"
                >
                  + {preset.replace(':', '')}
                </button>
              ))}
            </div>

            <textarea
              rows={6}
              value={noteDraftText}
              onChange={(e) => setNoteDraftText(e.target.value)}
              placeholder="Type or paste high-yield revision formulas, exceptions, or NCERT page references..."
              className="w-full p-4 bg-[#030304] border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
            />

            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <Link
                to="/notes"
                className="text-xs font-bold text-indigo-400 hover:underline"
              >
                Open Full NCERT Notebook →
              </Link>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingChapterId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
                >
                  <Save className="w-4 h-4" /> Save Attached Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NcertChecklistPage;
