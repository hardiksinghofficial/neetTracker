import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RotateCcw, Zap } from 'lucide-react';
import { FLASHCARDS_DECK } from '../data/mockData';
import { flashcardsAPI, syllabusAPI } from '../lib/api';
import clsx from 'clsx';

const RevisionPage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Physics' | 'Chemistry' | 'Biology'>('All');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [cardsList, setCardsList] = useState<any[]>(FLASHCARDS_DECK);
  const [dbChapters, setDbChapters] = useState<any[]>([]);

  useEffect(() => {
    flashcardsAPI.getAll().then((dbCards) => {
      if (dbCards && Array.isArray(dbCards) && dbCards.length > 0) {
        setCardsList(dbCards.map((c: any) => ({
          id: c.id,
          subject: c.topic?.chapter?.subject?.name || 'Biology',
          chapter: c.topic?.chapter?.name || 'NCERT Concepts',
          front: c.frontContent,
          back: c.backContent,
          highYield: true,
        })));
      }
    });

    syllabusAPI.getChapters().then((ch) => {
      if (ch && Array.isArray(ch)) {
        setDbChapters(ch);
      }
    });
  }, []);

  const filteredCards = cardsList.filter(c => selectedSubject === 'All' || c.subject === selectedSubject);
  const currentCard = filteredCards[cardIndex % (filteredCards.length || 1)] || FLASHCARDS_DECK[0];

  const handleNextCard = async (confidence: 'Again' | 'Hard' | 'Good' | 'Easy') => {
    setIsFlipped(false);
    setReviewedCount(r => r + 1);
    setSessionXp(x => x + (confidence === 'Easy' ? 15 : 10));

    const quality = confidence === 'Easy' ? 5 : confidence === 'Good' ? 4 : confidence === 'Hard' ? 2 : 1;
    if (currentCard.id) {
      await flashcardsAPI.review(currentCard.id, quality);
    }

    setTimeout(() => {
      setCardIndex((prev) => (prev + 1) % (filteredCards.length || 1));
    }, 250);
  };

  const urgencyBuckets = useMemo(() => {
    const completed = dbChapters.filter(c => c.isCompleted && !c.isRevised);
    if (completed.length === 0) {
      return {
        overdue30: [
          { id: 1, name: 'Cell Cycle & Cell Division', subject: 'Biology', weightage: 6.0, reason: 'High weightage & last studied 34 days ago' },
          { id: 2, name: 'Rotational Motion: Moment of Inertia', subject: 'Physics', weightage: 6.0, reason: 'Frequent errors in Torque calculation' },
        ],
        overdue14: [
          { id: 3, name: 'Chemical Bonding & MOT', subject: 'Chemistry', weightage: 7.5, reason: 'Bond order & magnetic character questions' },
          { id: 4, name: 'Current Electricity: Kirchhoff Laws', subject: 'Physics', weightage: 7.0, reason: 'Complex bridge circuits practice due' },
        ],
        overdue7: [
          { id: 5, name: 'Molecular Genetics: Lac Operon', subject: 'Biology', weightage: 9.0, reason: 'Crucial 4-mark NCERT diagram review' },
          { id: 6, name: 'Aldehydes & Ketones: Name Reactions', subject: 'Chemistry', weightage: 7.5, reason: 'Aldol & Cannizzaro mechanisms' },
        ],
      };
    }
    return {
      overdue30: completed.slice(0, 2).map((c, i) => ({ id: c.id || i, name: c.name, subject: c.subject?.name || 'Biology', weightage: c.weightage || 6.0, reason: 'Completed chapter due for 30d spaced recall' })),
      overdue14: completed.slice(2, 4).map((c, i) => ({ id: c.id || i, name: c.name, subject: c.subject?.name || 'Chemistry', weightage: c.weightage || 7.0, reason: 'High-yield conceptual revision due' })),
      overdue7: completed.slice(4, 6).map((c, i) => ({ id: c.id || i, name: c.name, subject: c.subject?.name || 'Physics', weightage: c.weightage || 5.0, reason: 'Fresh 7d review cycle' })),
    };
  }, [dbChapters]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            Active Recall & Revision Deck
            <span className="text-xs px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-amber-400" /> SM-2 Spaced Repetition
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Master high-yield NCERT facts, formulas, and exception rules using interactive 3D flashcards.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0D131F] px-4 py-2 rounded-2xl border border-slate-800 text-xs font-bold">
          <span className="text-slate-400">Cards Reviewed: <strong className="text-white">{reviewedCount}</strong></span>
          <span className="text-amber-400 font-extrabold">+{sessionXp} XP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3D Interactive Flashcard Deck (lg: 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0D131F] p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-xl flex flex-col justify-between min-h-[460px]">
            {/* Subject Selector and Deck Counter */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex bg-[#131B2B] p-1 rounded-2xl border border-slate-800 text-xs font-bold">
                {(['All', 'Biology', 'Physics', 'Chemistry'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSelectedSubject(s); setCardIndex(0); setIsFlipped(false); }}
                    className={clsx(
                      "px-3 py-1.5 rounded-xl transition-all",
                      selectedSubject === s
                        ? "bg-emerald-500 text-black shadow-sm font-extrabold"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <span className="text-xs font-extrabold text-slate-400 bg-[#131B2B] px-3 py-1.5 rounded-xl border border-slate-800">
                Card {(cardIndex % filteredCards.length) + 1} of {filteredCards.length}
              </span>
            </div>

            {/* 3D Flip Card */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-[#131B2B] hover:bg-[#162135] border border-slate-700/80 cursor-pointer shadow-2xl relative transition-all duration-300 min-h-[260px] select-none text-center"
            >
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={clsx(
                  "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md",
                  currentCard.subject === 'Biology' ? 'bg-emerald-500/20 text-emerald-400' :
                  currentCard.subject === 'Chemistry' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                )}>
                  {currentCard.subject} • {currentCard.chapter}
                </span>
                {currentCard.highYield && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded-md">
                    ⚡ High Yield
                  </span>
                )}
              </div>

              <span className="absolute top-4 right-4 text-xs font-bold text-slate-500">
                {isFlipped ? '💡 ANSWER' : '❓ QUESTION'}
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isFlipped ? 'back' : 'front'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full my-auto"
                >
                  <div className={clsx(
                    "font-bold leading-relaxed whitespace-pre-line text-base sm:text-lg",
                    isFlipped ? "text-emerald-300" : "text-white"
                  )}>
                    {isFlipped ? currentCard.back : currentCard.front}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Tap anywhere to flip
              </div>
            </div>

            {/* Spaced Repetition Buttons */}
            <div className={clsx("grid grid-cols-4 gap-2 pt-6 transition-all", isFlipped ? "opacity-100" : "opacity-40 pointer-events-none")}>
              <button 
                onClick={() => handleNextCard('Again')} 
                className="py-3 px-2 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all text-center"
              >
                Again<br/><span className="text-[10px] text-rose-400/70">&lt; 1 min</span>
              </button>
              <button 
                onClick={() => handleNextCard('Hard')} 
                className="py-3 px-2 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all text-center"
              >
                Hard<br/><span className="text-[10px] text-amber-400/70">2 Days</span>
              </button>
              <button 
                onClick={() => handleNextCard('Good')} 
                className="py-3 px-2 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all text-center"
              >
                Good<br/><span className="text-[10px] text-emerald-400/70">4 Days</span>
              </button>
              <button 
                onClick={() => handleNextCard('Easy')} 
                className="py-3 px-2 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all text-center"
              >
                Easy<br/><span className="text-[10px] text-cyan-400/70">7 Days</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Spaced Repetition Urgency Buckets (lg: 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0D131F] p-6 rounded-3xl border border-slate-800/80 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                Spaced Revision Schedule
              </span>
              <span className="text-xs text-rose-400 font-extrabold bg-rose-500/10 px-2.5 py-0.5 rounded-lg border border-rose-500/20">
                6 High-Yield Due
              </span>
            </h2>

            {/* Overdue 30 Days */}
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" /> Overdue (30+ Days Since Last Study)
              </div>
              {urgencyBuckets.overdue30.map((item: any) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-[#131B2B] border border-rose-950/60 flex justify-between items-start gap-2">
                  <div>
                    <div className="font-bold text-white text-xs">{item.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.reason}</div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                    ~{item.weightage}% Wt.
                  </span>
                </div>
              ))}
            </div>

            {/* Due 14 Days */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Due Soon (14+ Days)
              </div>
              {urgencyBuckets.overdue14.map((item: any) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-[#131B2B] border border-amber-950/60 flex justify-between items-start gap-2">
                  <div>
                    <div className="font-bold text-white text-xs">{item.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.reason}</div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    ~{item.weightage}% Wt.
                  </span>
                </div>
              ))}
            </div>

            {/* Due 7 Days */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Fresh Review (7 Days)
              </div>
              {urgencyBuckets.overdue7.map((item: any) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-[#131B2B] border border-emerald-950/60 flex justify-between items-start gap-2">
                  <div>
                    <div className="font-bold text-white text-xs">{item.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.reason}</div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    ~{item.weightage}% Wt.
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RevisionPage;
