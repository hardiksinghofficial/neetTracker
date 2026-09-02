import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Pin, Trash2, Edit3, Sparkles, BookOpen, Copy, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export interface StudyNote {
  id: number;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Biology';
  chapter: string;
  tag: 'High Yield' | 'Formula / Trick' | 'Common Trap' | 'Quick Summary';
  content: string;
  isPinned: boolean;
  lastUpdated: string;
}

const PRELOADED_NOTES: StudyNote[] = [
  {
    id: 1,
    title: 'Aqueous Phase Basicity Order of Amines (CRITICAL EXAM TRAP)',
    subject: 'Chemistry',
    chapter: 'Amines & Nitrogen Compounds',
    tag: 'Common Trap',
    content: `In aqueous solution, basic strength depends on Inductive effect (+I), Steric hindrance, and Hydration energy combined:\n\n• For Methyl group (-CH3): 2° > 1° > 3° > NH3 (Rule of 213)\n  (CH3)2NH > CH3NH2 > (CH3)3N > NH3\n\n• For Ethyl group (-C2H5): 2° > 3° > 1° > NH3 (Rule of 231)\n  (C2H5)2NH > (C2H5)3N > C2H5NH2 > NH3\n\n• In Gas Phase (only +I effect): 3° > 2° > 1° > NH3`,
    isPinned: true,
    lastUpdated: '2024-05-28',
  },
  {
    id: 2,
    title: 'Lac Operon Molecular Regulation: Real Inducer Secret',
    subject: 'Biology',
    chapter: 'Molecular Basis of Inheritance',
    tag: 'High Yield',
    content: `Key NCERT points frequently asked in Assertion-Reason:\n\n1. The REAL inducer is ALLOLACTOSE (not lactose directly). Beta-galactosidase converts lactose to allolactose.\n2. A very low level of expression of lac operon must be present in the cell all the time, otherwise lactose cannot enter the cell!\n3. Permease increases cell permeability to beta-galactosides.\n4. Regulation by repressor is NEGATIVE regulation. Catabolite activator protein (CAP-cAMP) gives POSITIVE regulation.`,
    isPinned: true,
    lastUpdated: '2024-05-27',
  },
  {
    id: 3,
    title: 'Sign Conventions for Lens & Mirror Formulas',
    subject: 'Physics',
    chapter: 'Ray Optics',
    tag: 'Formula / Trick',
    content: `Always measure distances from the Optical Centre / Pole along principal axis:\n\n• Concave Mirror: f is ALWAYS negative (-f)\n• Convex Mirror: f is ALWAYS positive (+f)\n• Convex Lens: f is ALWAYS positive (+f)\n• Concave Lens: f is ALWAYS negative (-f)\n\n• Real Object: u is ALWAYS negative (-u)\n• Real Image: v is positive (+v for lens, -v for mirror)\n• Magnification: m = -v/u (mirror)  and  m = +v/u (lens)`,
    isPinned: true,
    lastUpdated: '2024-05-26',
  },
  {
    id: 4,
    title: 'Pedigree Chart 4-Step Elimination Strategy',
    subject: 'Biology',
    chapter: 'Principles of Inheritance (Genetics)',
    tag: 'Formula / Trick',
    content: `Step 1: Check if affected children have unaffected parents:\n• YES ➔ Trait is RECESSIVE (skips generations)\n• NO (affected child has at least 1 affected parent) ➔ DOMINANT\n\nStep 2: If Recessive:\n• Affected female has ALL affected sons and father is affected ➔ X-linked Recessive (e.g. Hemophilia, Color Blindness)\n• Criss-cross inheritance missing / unaffected son of affected mother ➔ Autosomal Recessive (e.g. Sickle Cell, Thalassemia, PKU)\n\nStep 3: If Dominant:\n• Affected male transmits to ALL daughters ➔ X-linked Dominant\n• Otherwise ➔ Autosomal Dominant (e.g. Myotonic dystrophy)`,
    isPinned: false,
    lastUpdated: '2024-05-25',
  },
  {
    id: 5,
    title: 'Carnot Engine Efficiency & Common Temperature Traps',
    subject: 'Physics',
    chapter: 'Thermodynamics',
    tag: 'Common Trap',
    content: `Efficiency: η = 1 - (T_sink / T_source) = W / Q_1\n\n⚠️ NEVER compute with Celsius directly! Always convert:\nT (Kelvin) = T (°C) + 273.15\n\nExample Trap:\nIf source is 127°C and sink is 27°C:\nT_source = 400 K, T_sink = 300 K\nη = 1 - 300/400 = 25% (0.25).`,
    isPinned: false,
    lastUpdated: '2024-05-24',
  },
];

const NotesPage: React.FC = () => {
  const [notesList, setNotesList] = useState<StudyNote[]>(() => {
    const saved = localStorage.getItem('neet_personal_study_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return PRELOADED_NOTES;
  });

  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Physics' | 'Chemistry' | 'Biology'>('All');
  const [selectedTag, setSelectedTag] = useState<'All' | 'High Yield' | 'Formula / Trick' | 'Common Trap' | 'Quick Summary'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [copiedNoteId, setCopiedNoteId] = useState<number | null>(null);
  const { mode } = useAuth();

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState<'Physics' | 'Chemistry' | 'Biology'>('Biology');
  const [formChapter, setFormChapter] = useState('');
  const [formTag, setFormTag] = useState<'High Yield' | 'Formula / Trick' | 'Common Trap' | 'Quick Summary'>('High Yield');
  const [formContent, setFormContent] = useState('');

  const saveNotes = (newList: StudyNote[]) => {
    setNotesList(newList);
    localStorage.setItem('neet_personal_study_notes', JSON.stringify(newList));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const newNote: StudyNote = {
      id: Date.now(),
      title: formTitle.trim(),
      subject: formSubject,
      chapter: formChapter.trim() || 'General NCERT',
      tag: formTag,
      content: formContent.trim(),
      isPinned: false,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    saveNotes([newNote, ...notesList]);
    setShowAddModal(false);
    setFormTitle('');
    setFormChapter('');
    setFormContent('');
  };

  const handleUpdateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote || !editingNote.title.trim() || !editingNote.content.trim()) return;

    const updated = notesList.map(n => n.id === editingNote.id ? { ...editingNote, lastUpdated: new Date().toISOString().split('T')[0] } : n);
    saveNotes(updated);
    setEditingNote(null);
  };

  const handleDeleteNote = (id: number) => {
    if (window.confirm('Delete this study note?')) {
      saveNotes(notesList.filter(n => n.id !== id));
    }
  };

  const togglePin = (id: number) => {
    const updated = notesList.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
    saveNotes(updated);
  };

  const handleCopyNote = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const filteredNotes = notesList
    .filter(n => {
      if (selectedSubject !== 'All' && n.subject !== selectedSubject) return false;
      if (selectedTag !== 'All' && n.tag !== selectedTag) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.chapter.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const getTagStyle = (tag: StudyNote['tag']) => {
    switch (tag) {
      case 'High Yield': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Formula / Trick': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Common Trap': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                📝 HIGH-YIELD NCERT NOTEBOOK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Personal Study Notes & Formula Traps
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Write and pin high-yield shortcut formulas, exception tricks, and coaching concepts for rapid revision.
            </p>
          </div>

          {mode === 'edit' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              + Create New Note
            </button>
          )}
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
            placeholder="Search notes, formulas, or concepts..."
            className="w-full pl-11 pr-4 py-3 bg-[#0D131F] border border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Selector */}
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

          {/* Tag Selector */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value as any)}
            className="px-3 py-2.5 bg-[#0D131F] border border-slate-800 rounded-2xl text-xs font-bold text-slate-300 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="High Yield">⭐ High Yield</option>
            <option value="Formula / Trick">⚡ Formula / Trick</option>
            <option value="Common Trap">🚨 Common Trap</option>
            <option value="Quick Summary">📑 Quick Summary</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#0D131F] rounded-3xl border border-slate-800 p-6 space-y-2">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No notes match your filters</h3>
            <p className="text-xs text-slate-400">Click '+ Create New Note' to add custom formulas or concept summaries.</p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const tagStyle = getTagStyle(note.tag);

            return (
              <div
                key={note.id}
                className={clsx(
                  "p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 relative group",
                  note.isPinned 
                    ? "bg-[#0E1524] border-emerald-500/40 shadow-lg shadow-emerald-500/5" 
                    : "bg-[#0D131F] border-slate-800/80 hover:border-slate-700"
                )}
              >
                <div>
                  {/* Top Tags & Action Bar */}
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={clsx(
                        "text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase",
                        note.subject === 'Biology' ? 'bg-emerald-500/20 text-emerald-400' :
                        note.subject === 'Chemistry' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                      )}>
                        {note.subject} • {note.chapter}
                      </span>
                      <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-md border", tagStyle)}>
                        {note.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Copy Note Button */}
                      <button
                        onClick={() => handleCopyNote(note.id, `${note.title}\n\n${note.content}`)}
                        className="p-1.5 rounded-lg bg-[#131B2B] text-slate-400 hover:text-white transition-colors"
                        title="Copy note text"
                      >
                        {copiedNoteId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* Pin Button */}
                      {mode === 'edit' && (
                        <button
                          onClick={() => togglePin(note.id)}
                          className={clsx(
                            "p-1.5 rounded-lg transition-colors",
                            note.isPinned ? "bg-emerald-500/20 text-emerald-400" : "bg-[#131B2B] text-slate-500 hover:text-slate-300"
                          )}
                          title={note.isPinned ? "Unpin note" : "Pin note to top"}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Edit Button */}
                      {mode === 'edit' && (
                        <button
                          onClick={() => setEditingNote(note)}
                          className="p-1.5 rounded-lg bg-[#131B2B] text-slate-400 hover:text-white transition-colors"
                          title="Edit note"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete Button */}
                      {mode === 'edit' && (
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1.5 rounded-lg bg-[#131B2B] text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-white mt-1">
                    {note.title}
                  </h3>

                  {/* Content Box */}
                  <div className="mt-3 p-4 rounded-2xl bg-[#080C14]/80 border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex justify-between items-center pt-2 border-t border-slate-800/60">
                  <span>Last updated: {note.lastUpdated}</span>
                  {note.isPinned && <span className="text-emerald-400 font-bold flex items-center gap-1"><Pin className="w-3 h-3" /> Pinned to Top</span>}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Note Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl w-full bg-[#0D131F] rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" /> Create Study Note or Formula Card
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Note Title / Core Concept</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Lens Maker Formula Sign Traps or Aqueous Amine Basicity"
                    className="w-full px-4 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Subject</label>
                    <select
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#131B2B] border border-slate-700 rounded-xl text-white text-xs outline-none"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category Tag</label>
                    <select
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#131B2B] border border-slate-700 rounded-xl text-white text-xs outline-none"
                    >
                      <option value="High Yield">⭐ High Yield</option>
                      <option value="Formula / Trick">⚡ Formula / Trick</option>
                      <option value="Common Trap">🚨 Common Trap</option>
                      <option value="Quick Summary">📑 Quick Summary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Chapter Name</label>
                    <input
                      type="text"
                      value={formChapter}
                      onChange={(e) => setFormChapter(e.target.value)}
                      placeholder="e.g. Ray Optics"
                      className="w-full px-3 py-2 bg-[#131B2B] border border-slate-700 rounded-xl text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Note Content & Formulas</label>
                  <textarea
                    required
                    rows={6}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Enter formulas, key NCERT exceptions, reactions, or coaching mnemonics..."
                    className="w-full px-4 py-3 bg-[#131B2B] border border-slate-700 rounded-2xl text-white font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20">
                    Save Note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Note Modal */}
      <AnimatePresence>
        {editingNote && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl w-full bg-[#0D131F] rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-400" /> Edit Study Note
                </h3>
                <button onClick={() => setEditingNote(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Note Title</label>
                  <input
                    type="text"
                    required
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-white text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Subject</label>
                    <select
                      value={editingNote.subject}
                      onChange={(e) => setEditingNote({ ...editingNote, subject: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#131B2B] border border-slate-700 rounded-xl text-white text-xs outline-none"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category Tag</label>
                    <select
                      value={editingNote.tag}
                      onChange={(e) => setEditingNote({ ...editingNote, tag: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#131B2B] border border-slate-700 rounded-xl text-white text-xs outline-none"
                    >
                      <option value="High Yield">⭐ High Yield</option>
                      <option value="Formula / Trick">⚡ Formula / Trick</option>
                      <option value="Common Trap">🚨 Common Trap</option>
                      <option value="Quick Summary">📑 Quick Summary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Chapter</label>
                    <input
                      type="text"
                      value={editingNote.chapter}
                      onChange={(e) => setEditingNote({ ...editingNote, chapter: e.target.value })}
                      className="w-full px-3 py-2 bg-[#131B2B] border border-slate-700 rounded-xl text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Content</label>
                  <textarea
                    required
                    rows={6}
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    className="w-full px-4 py-3 bg-[#131B2B] border border-slate-700 rounded-2xl text-white font-mono text-xs outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => setEditingNote(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotesPage;
