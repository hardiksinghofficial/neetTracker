import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Star, Sparkles, Search, CheckCircle2, Clock, RotateCcw, Circle, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { safeStorage, getCleanInitialSyllabus } from '../lib/storage';
import type { ExtendedSyllabus } from '../lib/storage';
import type { Topic } from '../data/neetSyllabus';
import { syllabusAPI } from '../lib/api';
import clsx from 'clsx';

const SyllabusPage: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<'Physics' | 'Chemistry' | 'Biology'>('Physics');
  const [activeClass, setActiveClass] = useState<'all' | '11' | '12'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | 'low' | 'unrated'>('all');
  const [highYieldOnly, setHighYieldOnly] = useState(false);
  const [biologyGroup, setBiologyGroup] = useState<'all' | 'Botany' | 'Zoology'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({});
  const [newTopicInputs, setNewTopicInputs] = useState<Record<number, string>>({});
  const { mode } = useAuth();

  // Load syllabus from safeStorage or clean 0% default
  const [syllabusData, setSyllabusData] = useState<ExtendedSyllabus>(() => {
    return safeStorage.get<ExtendedSyllabus>('neet_custom_syllabus_v3', getCleanInitialSyllabus());
  });

  useEffect(() => {
    syllabusAPI.getChapters().then((dbChapters) => {
      if (dbChapters && Array.isArray(dbChapters) && dbChapters.length > 0) {
        const updated = { ...syllabusData };
        let hasChanges = false;
        ['Physics', 'Chemistry', 'Biology'].forEach((subj) => {
          updated[subj as 'Physics' | 'Chemistry' | 'Biology'].forEach(c => {
            const dbMatch = dbChapters.find((dbc: any) => dbc.id === c.id || dbc.name === c.name);
            if (dbMatch) {
              if (dbMatch.rating !== undefined && dbMatch.rating !== null) {
                c.rating = dbMatch.rating;
                hasChanges = true;
              }
              if (dbMatch.isCompleted !== undefined && dbMatch.isCompleted !== null) {
                c.isCompleted = !!dbMatch.isCompleted;
                hasChanges = true;
              }
              if (dbMatch.isRevised !== undefined && dbMatch.isRevised !== null) {
                c.isRevised = !!dbMatch.isRevised;
                hasChanges = true;
              }
            }
          });
        });
        if (hasChanges) {
          setSyllabusData(updated);
          safeStorage.set('neet_custom_syllabus_v3', updated);
        }
      }
    });
  }, []);

  const saveProgress = (newData: ExtendedSyllabus) => {
    setSyllabusData(newData);
    safeStorage.set('neet_custom_syllabus_v3', newData);
  };

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    syllabusData[activeSubject].forEach(c => { allExpanded[c.id] = true; });
    setExpandedChapters(allExpanded);
  };

  const collapseAll = () => {
    setExpandedChapters({});
  };

  // Update Chapter-level Star Rating (1 to 5)
  const updateChapterRating = (chapterId: number, rating: number) => {
    if (mode === 'view') return;
    const updated = { ...syllabusData };
    const chapters = updated[activeSubject];
    const ch = chapters.find(c => c.id === chapterId);
    if (ch) {
      ch.rating = rating;
      saveProgress(updated);
      syllabusAPI.updateChapter(chapterId, { rating });
    }
  };

  // Toggle Chapter-level Completed Status
  const toggleChapterCompletion = (chapterId: number) => {
    if (mode === 'view') return;
    const updated = { ...syllabusData };
    const chapters = updated[activeSubject];
    const ch = chapters.find(c => c.id === chapterId);
    if (ch) {
      ch.isCompleted = !ch.isCompleted;
      if (ch.isCompleted) {
        ch.topics.forEach(t => { if (t.status === 'Not Started') t.status = 'Completed'; });
      }
      saveProgress(updated);
      syllabusAPI.updateChapter(chapterId, { isCompleted: ch.isCompleted });
    }
  };

  // Toggle Chapter-level Revision Status
  const toggleChapterRevision = (chapterId: number) => {
    if (mode === 'view') return;
    const updated = { ...syllabusData };
    const chapters = updated[activeSubject];
    const ch = chapters.find(c => c.id === chapterId);
    if (ch) {
      ch.isRevised = !ch.isRevised;
      saveProgress(updated);
      syllabusAPI.updateChapter(chapterId, { isRevised: ch.isRevised });
    }
  };

  // Update Subtopic Status
  const updateTopicStatus = (chapterId: number, topicId: number, newStatus: Topic['status']) => {
    if (mode === 'view') return;
    const updated = { ...syllabusData };
    const chapters = updated[activeSubject];
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter) {
      const topic = chapter.topics.find(t => t.id === topicId);
      if (topic) {
        topic.status = newStatus;
        if (newStatus === 'Completed' || newStatus === 'Revised') {
          topic.lastStudied = new Date().toISOString().split('T')[0];
        }
        chapter.isCompleted = chapter.topics.every(t => t.status === 'Completed' || t.status === 'Revised');
        saveProgress(updated);
      }
    }
  };

  // Update Subtopic Star Rating
  const updateTopicConfidence = (chapterId: number, topicId: number, rating: number) => {
    if (mode === 'view') return;
    const updated = { ...syllabusData };
    const chapters = updated[activeSubject];
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter) {
      const topic = chapter.topics.find(t => t.id === topicId);
      if (topic) {
        topic.confidence = rating;
        // Recalculate chapter average rating
        const avg = Math.round(chapter.topics.reduce((acc, t) => acc + (t.confidence || 0), 0) / chapter.topics.length);
        chapter.rating = avg;
        saveProgress(updated);
      }
    }
  };

  // Add Custom Subtopic into a Chapter
  const handleAddSubTopic = (chapterId: number, e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    const name = (newTopicInputs[chapterId] || '').trim();
    if (!name) return;

    const updated = { ...syllabusData };
    const chapters = updated[activeSubject];
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter) {
      const newTopic: Topic = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name,
        status: 'Not Started',
        confidence: 3,
        lastStudied: null,
      };
      chapter.topics.push(newTopic);
      saveProgress(updated);
      setNewTopicInputs(prev => ({ ...prev, [chapterId]: '' }));
    }
  };

  // Delete Custom Subtopic
  const handleDeleteTopic = (chapterId: number, topicId: number) => {
    if (mode === 'view') return;
    const updated = { ...syllabusData };
    const chapters = updated[activeSubject];
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter) {
      chapter.topics = chapter.topics.filter(t => t.id !== topicId);
      saveProgress(updated);
    }
  };

  // Filtered Chapters
  const filteredChapters = useMemo(() => {
    return syllabusData[activeSubject].filter(ch => {
      if (activeClass !== 'all' && ch.classLevel !== Number(activeClass)) return false;
      if (highYieldOnly && !ch.isHighYield) return false;
      if (activeSubject === 'Biology' && biologyGroup !== 'all' && ch.subGroup !== biologyGroup) return false;
      if (ratingFilter === '5' && (ch.rating || 0) < 5) return false;
      if (ratingFilter === 'low' && (ch.rating || 0) > 2) return false;
      if (ratingFilter === 'unrated' && (ch.rating || 0) !== 0) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchChapter = ch.name.toLowerCase().includes(q);
        const matchTopic = ch.topics.some(t => t.name.toLowerCase().includes(q));
        return matchChapter || matchTopic;
      }
      return true;
    });
  }, [syllabusData, activeSubject, activeClass, highYieldOnly, biologyGroup, ratingFilter, searchQuery]);

  // Subject Analytics
  const allCurrentSubjectChapters = syllabusData[activeSubject];
  const totalChaptersCount = allCurrentSubjectChapters.length;
  const completedChaptersCount = allCurrentSubjectChapters.filter(c => c.isCompleted).length;
  const revisedChaptersCount = allCurrentSubjectChapters.filter(c => c.isRevised).length;
  const class11Chapters = allCurrentSubjectChapters.filter(c => c.classLevel === 11);
  const class12Chapters = allCurrentSubjectChapters.filter(c => c.classLevel === 12);
  const class11Done = class11Chapters.filter(c => c.isCompleted).length;
  const class12Done = class12Chapters.filter(c => c.isCompleted).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090A0F] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                📚 NCERT CLASS 11 & 12 MASTER SYLLABUS
              </span>
              <span className="text-xs text-slate-400 font-semibold">Chapter-Wise & Subtopics Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              NEET Detailed Syllabus & Confidence Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Track all 79+ NCERT chapters class-wise, rate your conceptual mastery (1–5 ⭐), and add custom subtopics & revision goals.
            </p>
          </div>

          <div className="flex bg-[#030304] p-1 rounded-2xl border border-white/5 text-xs font-bold">
            {(['Physics', 'Chemistry', 'Biology'] as const).map(subj => (
              <button
                key={subj}
                onClick={() => { setActiveSubject(subj); setExpandedChapters({}); }}
                className={clsx(
                  "px-4 py-2 rounded-xl transition-all",
                  activeSubject === subj ? "bg-indigo-600 text-white font-black shadow-md" : "text-slate-400 hover:text-white"
                )}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Class 11 vs Class 12 Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>Overall {activeSubject} Mastery</span>
            <span className="text-white font-mono">{completedChaptersCount}/{totalChaptersCount} Ch ({Math.round((completedChaptersCount / (totalChaptersCount || 1)) * 100)}%)</span>
          </div>
          <div className="h-2 w-full bg-[#030304] rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.round((completedChaptersCount / (totalChaptersCount || 1)) * 100)}%` }} 
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
            <span>{revisedChaptersCount} Chapters Revised</span>
            <span>{totalChaptersCount - completedChaptersCount} Left</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>Class 11 {activeSubject}</span>
            <span className="text-indigo-300 font-mono">{class11Done}/{class11Chapters.length} Chapters</span>
          </div>
          <div className="h-2 w-full bg-[#030304] rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-indigo-400 rounded-full transition-all duration-500" 
              style={{ width: `${Math.round((class11Done / (class11Chapters.length || 1)) * 100)}%` }} 
            />
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            {Math.round((class11Done / (class11Chapters.length || 1)) * 100)}% Class 11 Foundation Completed
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>Class 12 {activeSubject}</span>
            <span className="text-emerald-400 font-mono">{class12Done}/{class12Chapters.length} Chapters</span>
          </div>
          <div className="h-2 w-full bg-[#030304] rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.round((class12Done / (class12Chapters.length || 1)) * 100)}%` }} 
            />
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            {Math.round((class12Done / (class12Chapters.length || 1)) * 100)}% Class 12 Boards & NEET Ready
          </div>
        </div>
      </div>

      {/* Control Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-[#090A0F] border border-white/5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <div className="flex bg-[#030304] p-1 rounded-2xl border border-white/5 text-xs font-bold">
            {[
              { id: 'all', label: 'All Classes' },
              { id: '11', label: 'Class 11 Only' },
              { id: '12', label: 'Class 12 Only' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveClass(tab.id as any)}
                className={clsx(
                  "px-3 py-1.5 rounded-xl transition-all",
                  activeClass === tab.id ? "bg-indigo-600 text-white font-black" : "text-slate-400 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Biology Subgroup */}
          {activeSubject === 'Biology' && (
            <div className="flex bg-[#030304] p-1 rounded-2xl border border-white/5 text-xs font-bold">
              {[
                { id: 'all', label: 'All Bio' },
                { id: 'Botany', label: '🌿 Botany' },
                { id: 'Zoology', label: '🧬 Zoology' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setBiologyGroup(tab.id as any)}
                  className={clsx(
                    "px-3 py-1.5 rounded-xl transition-all",
                    biologyGroup === tab.id ? "bg-indigo-600 text-white font-black" : "text-slate-400 hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Rating Filter */}
          <div className="flex bg-[#030304] p-1 rounded-2xl border border-white/5 text-xs font-bold">
            {[
              { id: 'all', label: 'All Ratings' },
              { id: '5', label: '⭐⭐⭐⭐⭐ (5⭐)' },
              { id: 'low', label: '⚠️ Needs Work (1-2⭐)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRatingFilter(tab.id as any)}
                className={clsx(
                  "px-3 py-1.5 rounded-xl transition-all",
                  ratingFilter === tab.id ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* High Yield Switch */}
          <button
            onClick={() => setHighYieldOnly(!highYieldOnly)}
            className={clsx(
              "px-3 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5",
              highYieldOnly ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-[#030304] text-slate-400 border-white/5 hover:text-white"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> High-Yield Only
          </button>
        </div>

        {/* Search & Expand Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapter or topic..."
              className="pl-8 pr-3 py-1.5 bg-[#030304] border border-white/5 rounded-xl text-xs text-white placeholder-slate-500 outline-none w-44 sm:w-56"
            />
          </div>

          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-xl bg-[#030304] hover:bg-[#12141D] text-slate-300 text-xs font-bold border border-white/5"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-xl bg-[#030304] hover:bg-[#12141D] text-slate-300 text-xs font-bold border border-white/5"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Chapters List */}
      <div className="space-y-3.5">
        {filteredChapters.map((ch) => {
          const isExpanded = !!expandedChapters[ch.id];
          const completedTopics = ch.topics.filter(t => t.status === 'Completed' || t.status === 'Revised').length;
          const chapterPercent = ch.topics.length ? Math.round((completedTopics / ch.topics.length) * 100) : 0;
          const currentRating = ch.rating || 0;

          return (
            <div
              key={ch.id}
              className={clsx(
                "rounded-3xl border transition-all overflow-hidden",
                ch.isCompleted
                  ? "bg-[#04100E] border-emerald-500/30"
                  : "bg-[#090A0F] border-white/5 hover:border-white/10"
              )}
            >
              {/* Chapter Header Row */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleChapter(ch.id)}
                    className="p-2 rounded-xl bg-[#030304] hover:bg-[#12141D] text-slate-400 hover:text-white border border-white/5 shrink-0 mt-0.5"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={clsx(
                        "text-[10px] font-extrabold px-2 py-0.5 rounded-md border",
                        ch.classLevel === 11 ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30" : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                      )}>
                        Class {ch.classLevel}
                      </span>
                      {ch.subGroup && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          {ch.subGroup}
                        </span>
                      )}
                      {ch.isHighYield && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> High-Yield ({ch.weightage}%)
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-500">
                        {ch.topics.length} Subtopics
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-white">
                      {ch.name}
                    </h2>
                  </div>
                </div>

                {/* Right Side: Chapter Rating, Progress & Quick Ticks */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                  {/* Star Rating (1 to 5) */}
                  <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Concept Rating</span>
                    <div className="flex items-center gap-1 bg-[#030304] px-2.5 py-1 rounded-xl border border-white/5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          disabled={mode === 'view'}
                          onClick={() => updateChapterRating(ch.id, star)}
                          className="hover:scale-125 transition-transform"
                          title={`Rate ${star} Stars`}
                        >
                          <Star
                            className={clsx(
                              "w-3.5 h-3.5 transition-colors",
                              star <= currentRating ? "text-amber-400 fill-amber-400" : "text-slate-600"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Checkbox Ticks: Completed & Revised */}
                  <div className="flex items-center gap-2">
                    <button
                      disabled={mode === 'view'}
                      onClick={() => toggleChapterCompletion(ch.id)}
                      className={clsx(
                        "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5",
                        ch.isCompleted
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                          : "bg-[#030304] text-slate-400 border-white/5 hover:text-white"
                      )}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {ch.isCompleted ? 'Done' : 'Mark Done'}
                    </button>

                    <button
                      disabled={mode === 'view'}
                      onClick={() => toggleChapterRevision(ch.id)}
                      className={clsx(
                        "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5",
                        ch.isRevised
                          ? "bg-indigo-950/60 text-indigo-300 border-indigo-500/40"
                          : "bg-[#030304] text-slate-400 border-white/5 hover:text-white"
                      )}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {ch.isRevised ? 'Revised' : 'Revise'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Subtopics Tray & Add Subtopic Engine */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 bg-[#030304] p-4 sm:p-6 space-y-3"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 pb-2 border-b border-white/5">
                      <span>Subtopics & Learning Objectives ({completedTopics}/{ch.topics.length} Completed)</span>
                      <span>Progress: {chapterPercent}%</span>
                    </div>

                    <div className="space-y-2">
                      {ch.topics.map((t) => (
                        <div
                          key={t.id}
                          className="p-3 rounded-2xl bg-[#090A0F] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5"
                        >
                          <div className="flex items-center gap-2.5">
                            <button
                              disabled={mode === 'view'}
                              onClick={() => updateTopicStatus(ch.id, t.id, t.status === 'Completed' ? 'Not Started' : 'Completed')}
                              className="shrink-0"
                            >
                              {t.status === 'Completed' || t.status === 'Revised' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                              ) : t.status === 'In Progress' ? (
                                <Clock className="w-4 h-4 text-indigo-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-600" />
                              )}
                            </button>
                            <span className={clsx(
                              "text-xs font-semibold",
                              t.status === 'Completed' || t.status === 'Revised' ? "text-slate-200 line-through opacity-80" : "text-white"
                            )}>
                              {t.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            {/* Subtopic Rating */}
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  disabled={mode === 'view'}
                                  onClick={() => updateTopicConfidence(ch.id, t.id, star)}
                                  className="hover:scale-125 transition-transform"
                                >
                                  <Star
                                    className={clsx(
                                      "w-3 h-3 transition-colors",
                                      star <= (t.confidence || 0) ? "text-amber-400 fill-amber-400" : "text-slate-700"
                                    )}
                                  />
                                </button>
                              ))}
                            </div>

                            {/* Status Selector */}
                            {mode !== 'view' && (
                              <select
                                value={t.status}
                                onChange={(e) => updateTopicStatus(ch.id, t.id, e.target.value as any)}
                                className="bg-[#030304] border border-white/10 rounded-xl px-2.5 py-1 text-[11px] font-bold text-slate-300 outline-none"
                              >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Revised">Revised</option>
                              </select>
                            )}

                            {/* Delete custom topic */}
                            {mode !== 'view' && (
                              <button
                                onClick={() => handleDeleteTopic(ch.id, t.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20"
                                title="Delete subtopic"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add Custom Subtopic Form */}
                      {mode !== 'view' && (
                        <form
                          onSubmit={(e) => handleAddSubTopic(ch.id, e)}
                          className="flex gap-2 pt-2"
                        >
                          <input
                            type="text"
                            value={newTopicInputs[ch.id] || ''}
                            onChange={(e) => setNewTopicInputs(prev => ({ ...prev, [ch.id]: e.target.value }))}
                            placeholder="Add new subtopic (e.g. Solve 50 NCERT numericals)..."
                            className="flex-1 px-4 py-2 bg-[#090A0F] border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl text-xs flex items-center gap-1 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SyllabusPage;
