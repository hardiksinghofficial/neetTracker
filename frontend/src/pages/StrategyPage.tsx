import React, { useState } from 'react';
import { Target, Clock, Sparkles, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import clsx from 'clsx';

interface ArQuestion {
  id: number;
  subject: string;
  chapter: string;
  assertion: string;
  reason: string;
  correctOption: 'A' | 'B' | 'C' | 'D'; // A: Both true & R is correct explanation, B: Both true but R is not explanation, C: A true R false, D: A false R true
  explanation: string;
}

const SAMPLE_AR_QUESTIONS: ArQuestion[] = [
  {
    id: 1,
    subject: 'Biology',
    chapter: 'Photosynthesis',
    assertion: 'Photorespiration is a wasteful process in C3 plants and does not produce ATP or NADPH.',
    reason: 'RuBisCO binds with O2 instead of CO2 under high oxygen concentration and high temperature in C3 plants.',
    correctOption: 'A',
    explanation: 'Both Assertion and Reason are correct and Reason correctly explains why photorespiration occurs (RuBisCO oxygenase activity).',
  },
  {
    id: 2,
    subject: 'Chemistry',
    chapter: 'Chemical Bonding',
    assertion: 'The dipole moment of NF3 is less than that of NH3.',
    reason: 'In NH3, the orbital dipole of the lone pair is in the same direction as the resultant dipole of the N-H bonds, whereas in NF3 it opposes the resultant dipole of the N-F bonds.',
    correctOption: 'A',
    explanation: 'In NF3, fluorine is more electronegative than nitrogen, so N-F dipoles point towards F, opposing the lone pair dipole.',
  },
  {
    id: 3,
    subject: 'Physics',
    chapter: 'Semiconductor Electronics',
    assertion: 'A p-type semiconductor has a higher concentration of holes than electrons and is positively charged.',
    reason: 'Holes are created when trivalent impurities like Boron are doped into tetravalent Silicon.',
    correctOption: 'C',
    explanation: 'Assertion is False (p-type semiconductor is electrically NEUTRAL overall!), though trivalent doping creates holes. Option C/D: A is false.',
  },
  {
    id: 4,
    subject: 'Biology',
    chapter: 'Molecular Genetics',
    assertion: 'The genetic code is degenerate.',
    reason: 'Most amino acids are coded by more than one codon.',
    correctOption: 'A',
    explanation: 'Degeneracy means one amino acid can have multiple codons (e.g. Leucine has 6 codons: UUA, UUG, CUU, CUC, CUA, CUG).',
  },
];

const StrategyPage: React.FC = () => {
  const [currentScore, setCurrentScore] = useState(630);
  const [targetScore, setTargetScore] = useState(680);
  const [activeStrategyTab, setActiveStrategyTab] = useState<'gap' | 'blindspots' | 'pacing' | 'ar_drill'>('gap');

  // AR Drill States
  const [arIndex, setArIndex] = useState(0);
  const [selectedArOption, setSelectedArOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showArExplanation, setShowArExplanation] = useState(false);
  const [arScore, setArScore] = useState(0);

  const marksGap = Math.max(0, targetScore - currentScore);
  const questionsNeeded = Math.ceil(marksGap / 4);

  // Blindspots Mock Data
  const blindspotData = [
    {
      chapter: 'Ray Optics (Physics)',
      studentRating: 5,
      mockAccuracy: '58%',
      mistakeCount: 3,
      verdict: '🚨 False Confidence Danger',
      detail: 'You rated this 5-Stars, but made 3 numerical errors in recent mocks. Formula signs need revision.',
      action: 'Practice 20 Lens Maker & Prism questions',
    },
    {
      chapter: 'Chemical Equilibrium (Chemistry)',
      studentRating: 4,
      mockAccuracy: '62%',
      mistakeCount: 2,
      verdict: '🚨 False Confidence Danger',
      detail: 'Buffer pH & Henderson equation errors in last test.',
      action: 'Review Salt Hydrolysis & Ksp formulas',
    },
    {
      chapter: 'Electrochemistry (Chemistry)',
      studentRating: 2,
      mockAccuracy: '94%',
      mistakeCount: 0,
      verdict: '💎 Hidden Strength',
      detail: 'You rated this 2-Stars, but achieved 100% accuracy in the last 3 tests.',
      action: 'Confidence is higher than you think — maintain with weekly flashcards',
    },
  ];

  // Recommended Chapters for Marks Gap Bridge
  const recommendedChapters = [
    { name: 'Semiconductor Electronics & Logic Gates (Physics)', marksPotential: 12, questions: 3, studyHoursNeeded: 4.5, roi: 'Very High' },
    { name: 'Biotechnology: Principles & Processes (Biology)', marksPotential: 16, questions: 4, studyHoursNeeded: 5.0, roi: 'Very High' },
    { name: 'Biomolecules Chemistry & Biology (Combined)', marksPotential: 16, questions: 4, studyHoursNeeded: 4.0, roi: 'Ultra High' },
    { name: 'Coordination Compounds (Chemistry)', marksPotential: 12, questions: 3, studyHoursNeeded: 5.5, roi: 'High' },
  ];

  const handleArAnswer = (opt: 'A' | 'B' | 'C' | 'D') => {
    setSelectedArOption(opt);
    setShowArExplanation(true);
    if (opt === SAMPLE_AR_QUESTIONS[arIndex].correctOption) {
      setArScore(s => s + 4);
    }
  };

  const handleNextAr = () => {
    setSelectedArOption(null);
    setShowArExplanation(false);
    setArIndex(i => (i + 1) % SAMPLE_AR_QUESTIONS.length);
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
                🎯 RANK 1 to 2,000 STRATEGY LAB
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              NEET 680+ Strategy & Marks Bridge
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Bridge your score deficit, eliminate subconscious blindspots, master 200-min time management, and drill modern Assertion-Reason questions.
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0D131F] p-1.5 rounded-3xl border border-slate-800/80">
        {[
          { id: 'gap', label: '🎯 Marks Gap Bridge', icon: Target },
          { id: 'blindspots', label: '🔍 Blindspot Hunter', icon: ShieldAlert },
          { id: 'pacing', label: '⏱️ 200-Min Exam Pacing', icon: Clock },
          { id: 'ar_drill', label: '⚖️ Assertion-Reason Drill', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStrategyTab(tab.id as any)}
            className={clsx(
              "py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all text-center",
              activeStrategyTab === tab.id
                ? "bg-[#131B2B] text-emerald-400 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Marks Gap Bridge */}
      {activeStrategyTab === 'gap' && (
        <div className="space-y-6">
          {/* Interactive Gap Calculator */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              Target Score & Gap Bridge Calculator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Sliders */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                    <span>Current Average Mock Score</span>
                    <strong className="text-white text-sm">{currentScore} / 720</strong>
                  </div>
                  <input
                    type="range"
                    min={450}
                    max={700}
                    value={currentScore}
                    onChange={(e) => setCurrentScore(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                    <span>Target NEET Score</span>
                    <strong className="text-emerald-400 text-sm">{targetScore} / 720</strong>
                  </div>
                  <input
                    type="range"
                    min={600}
                    max={720}
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Gap Summary Card */}
              <div className="p-6 rounded-2xl bg-[#131B2B] border border-emerald-500/30 text-center space-y-1">
                <div className="text-xs font-bold uppercase text-slate-400">Score Gap to Bridge</div>
                <div className="text-4xl font-black text-emerald-400">+{marksGap}</div>
                <div className="text-xs font-semibold text-slate-300">Need ~{questionsNeeded} extra correct questions</div>
              </div>
            </div>
          </div>

          {/* AI Recommended Fastest Chapters */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Fastest High-ROI Chapters to Bridge the +{marksGap} Marks
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Mastering these 4 chapters will yield {recommendedChapters.reduce((a,b)=>a+b.marksPotential, 0)} marks in ~18 hours</p>
              </div>
            </div>

            <div className="space-y-3">
              {recommendedChapters.map((ch, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#131B2B] border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="font-bold text-white text-sm">{ch.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {ch.questions} Questions in NEET • Requires ~{ch.studyHoursNeeded} hrs dedicated study
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      +{ch.marksPotential} Marks
                    </span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300">
                      {ch.roi} ROI
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Blindspot Hunter */}
      {activeStrategyTab === 'blindspots' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300">
            <strong>What is a Blindspot?</strong> A topic you rated with high confidence (4–5 stars) but where you lost marks in recent mock tests due to conceptual gaps or sign traps.
          </div>

          {blindspotData.map((b, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#0D131F] border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className={clsx(
                    "text-xs font-black px-2.5 py-0.5 rounded-md border",
                    b.verdict.includes('Danger') ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  )}>
                    {b.verdict}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{b.chapter}</h3>
                </div>

                <div className="flex gap-4 text-xs font-bold text-right">
                  <div>
                    <span className="text-slate-500 block">Self Rating</span>
                    <span className="text-amber-400">{'★'.repeat(b.studentRating)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mock Accuracy</span>
                    <span className="text-white">{b.mockAccuracy}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mistakes</span>
                    <span className="text-rose-400">{b.mistakeCount} Qs</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#131B2B] p-3.5 rounded-2xl border border-slate-800">
                {b.detail}
              </p>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ArrowRight className="w-4 h-4" />
                Action: {b.action}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. 200-Minute Exam Pacing Simulator */}
      {activeStrategyTab === 'pacing' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              NEET 200-Minute (3 hr 20 min) Golden Time Allocation
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#131B2B] border border-emerald-500/40 text-center space-y-2">
                <div className="text-xs font-extrabold text-emerald-400 uppercase">Phase 1: Biology</div>
                <div className="text-2xl font-black text-white">45 Mins</div>
                <div className="text-xs text-slate-400">90 Questions (0.5 m/Q)</div>
                <div className="text-[11px] text-emerald-300 font-bold bg-emerald-950/60 p-1.5 rounded-xl">Target: 340+ Marks</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#131B2B] border border-amber-500/40 text-center space-y-2">
                <div className="text-xs font-extrabold text-amber-400 uppercase">Phase 2: Chemistry</div>
                <div className="text-2xl font-black text-white">45 Mins</div>
                <div className="text-xs text-slate-400">45 Questions (1.0 m/Q)</div>
                <div className="text-[11px] text-amber-300 font-bold bg-amber-950/60 p-1.5 rounded-xl">Target: 160+ Marks</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#131B2B] border border-cyan-500/40 text-center space-y-2">
                <div className="text-xs font-extrabold text-cyan-400 uppercase">Phase 3: Physics</div>
                <div className="text-2xl font-black text-white">70 Mins</div>
                <div className="text-xs text-slate-400">45 Questions (1.5 m/Q)</div>
                <div className="text-[11px] text-cyan-300 font-bold bg-cyan-950/60 p-1.5 rounded-xl">Target: 160+ Marks</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#131B2B] border border-rose-500/40 text-center space-y-2">
                <div className="text-xs font-extrabold text-rose-400 uppercase">Phase 4: OMR & Review</div>
                <div className="text-2xl font-black text-white">40 Mins</div>
                <div className="text-xs text-slate-400">Bubbling & Flagged Qs</div>
                <div className="text-[11px] text-rose-300 font-bold bg-rose-950/60 p-1.5 rounded-xl">Zero OMR Bubbling Errors</div>
              </div>
            </div>

            {/* Fatigue Warning Tip */}
            <div className="p-4 rounded-2xl bg-[#131B2B] border border-slate-700 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">💡 3-Hour Exam Fatigue Management:</strong>
              Never leave Physics for the very end when mental exhaustion peaks. Starting Biology first locks in 340+ marks in 45 minutes, creating maximum psychological confidence for Physics numerical calculations.
            </div>
          </div>
        </div>
      )}

      {/* 4. Assertion-Reason Drill */}
      {activeStrategyTab === 'ar_drill' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-slate-800 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {SAMPLE_AR_QUESTIONS[arIndex].subject} • {SAMPLE_AR_QUESTIONS[arIndex].chapter}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  Assertion & Reason Mastery Drill (Question {arIndex + 1} of {SAMPLE_AR_QUESTIONS.length})
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                  Score: {arScore} XP
                </span>
              </div>
            </div>

            {/* Assertion & Reason Statements Card */}
            <div className="p-6 rounded-2xl bg-[#131B2B] border border-slate-700 space-y-4">
              <div>
                <strong className="text-emerald-400 block text-xs uppercase tracking-wider mb-1">Assertion (A):</strong>
                <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  "{SAMPLE_AR_QUESTIONS[arIndex].assertion}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/80">
                <strong className="text-cyan-400 block text-xs uppercase tracking-wider mb-1">Reason (R):</strong>
                <p className="text-sm sm:text-base font-bold text-slate-200 leading-relaxed">
                  "{SAMPLE_AR_QUESTIONS[arIndex].reason}"
                </p>
              </div>
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'A', text: 'Both (A) and (R) are true and (R) is the correct explanation of (A).' },
                { key: 'B', text: 'Both (A) and (R) are true but (R) is NOT the correct explanation of (A).' },
                { key: 'C', text: '(A) is true but (R) is false.' },
                { key: 'D', text: '(A) is false but (R) is true.' },
              ].map((opt) => {
                const isSelected = selectedArOption === opt.key;
                const isCorrect = opt.key === SAMPLE_AR_QUESTIONS[arIndex].correctOption;

                return (
                  <button
                    key={opt.key}
                    disabled={showArExplanation}
                    onClick={() => handleArAnswer(opt.key as any)}
                    className={clsx(
                      "p-4 rounded-2xl text-left border transition-all text-xs font-semibold flex items-start gap-3",
                      showArExplanation
                        ? isCorrect
                          ? "bg-emerald-950/60 border-emerald-500 text-emerald-200"
                          : isSelected
                            ? "bg-rose-950/60 border-rose-500 text-rose-200"
                            : "bg-[#131B2B] border-slate-800 text-slate-500"
                        : "bg-[#131B2B] border-slate-800 text-slate-300 hover:bg-[#192338] hover:border-slate-700"
                    )}
                  >
                    <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center font-bold shrink-0">
                      {opt.key}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next */}
            {showArExplanation && (
              <div className="p-4 rounded-2xl bg-[#131B2B] border border-emerald-500/30 space-y-3">
                <div className="text-xs text-slate-200">
                  <strong className="text-emerald-400 block mb-1">Explanation:</strong>
                  {SAMPLE_AR_QUESTIONS[arIndex].explanation}
                </div>
                <button
                  onClick={handleNextAr}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all"
                >
                  Next Question <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyPage;
