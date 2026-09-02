import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Plus, ChevronDown, ChevronRight, FileText, TrendingUp, XCircle, Award, Edit3, Trash2, X, Printer, Search, CheckSquare, Square, BookOpen } from 'lucide-react';
import { MOCK_TESTS_DATA } from '../data/mockData';
import type { MockTest } from '../data/mockData';
import { NEET_SYLLABUS } from '../data/neetSyllabus';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

// Compile all 79+ NCERT Chapters across Physics, Chemistry, Biology
const ALL_NCERT_CHAPTERS = [
  ...NEET_SYLLABUS.Physics.map(c => ({ id: c.id, name: c.name, subject: 'Physics' as const, classLevel: c.classLevel, weightage: c.weightage })),
  ...NEET_SYLLABUS.Chemistry.map(c => ({ id: c.id, name: c.name, subject: 'Chemistry' as const, classLevel: c.classLevel, weightage: c.weightage })),
  ...NEET_SYLLABUS.Biology.map(c => ({ id: c.id, name: c.name, subject: 'Biology' as const, classLevel: c.classLevel, weightage: c.weightage })),
];

const TestsPage: React.FC = () => {
  const [testsList, setTestsList] = useState<MockTest[]>(() => {
    const saved = localStorage.getItem('neet_mock_tests_list');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return parsed.map((t: MockTest) => ({ ...t, maxScore: 720 }));
      } catch (e) {}
    }
    return MOCK_TESTS_DATA.map(t => ({ ...t, maxScore: 720 }));
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedTest, setExpandedTest] = useState<number | null>(1);
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);
  const [reportingTest, setReportingTest] = useState<MockTest | null>(null);
  const { mode } = useAuth();

  // Test Form States
  const [testName, setTestName] = useState('');
  const [correct, setCorrect] = useState(160);
  const [wrong, setWrong] = useState(12);
  const [unattempted, setUnattempted] = useState(8);
  const [timeTaken, setTimeTaken] = useState(180);
  const [phyScore, setPhyScore] = useState(155);
  const [chemScore, setChemScore] = useState(160);
  const [bioScore, setBioScore] = useState(335);

  // NCERT Chapter Selection States for Test Entry
  const [selectedChapterNames, setSelectedChapterNames] = useState<string[]>([
    'Ray Optics and Optical Instruments',
    'Chemical Bonding and Molecular Structure',
    'Molecular Basis of Inheritance',
  ]);
  const [chapterSearchQuery, setChapterSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<'All' | 'Physics' | 'Chemistry' | 'Biology'>('All');
  const [filterClass, setFilterClass] = useState<'All' | '11' | '12'>('All');

  const saveTests = (newList: MockTest[]) => {
    const standardized = newList.map(t => ({ ...t, maxScore: 720 }));
    setTestsList(standardized);
    localStorage.setItem('neet_mock_tests_list', JSON.stringify(standardized));
  };

  // Score is ALWAYS out of 720
  const calculatedScore = (correct * 4) - (wrong * 1);

  const toggleChapterSelection = (chapterName: string) => {
    if (selectedChapterNames.includes(chapterName)) {
      setSelectedChapterNames(selectedChapterNames.filter(name => name !== chapterName));
    } else {
      setSelectedChapterNames([...selectedChapterNames, chapterName]);
    }
  };

  const selectAllChapters = () => {
    setSelectedChapterNames(ALL_NCERT_CHAPTERS.map(c => c.name));
  };

  const clearAllChapters = () => {
    setSelectedChapterNames([]);
  };

  const filteredNcertChapters = ALL_NCERT_CHAPTERS.filter(ch => {
    if (filterSubject !== 'All' && ch.subject !== filterSubject) return false;
    if (filterClass !== 'All' && ch.classLevel !== Number(filterClass)) return false;
    if (chapterSearchQuery.trim()) {
      const q = chapterSearchQuery.toLowerCase();
      return ch.name.toLowerCase().includes(q) || ch.subject.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const totalScore720 = Math.min(720, Math.max(0, (correct * 4) - (wrong * 1)));
    const computedAccuracy = Math.round((correct / (correct + wrong || 1)) * 1000) / 10;
    const computedAIR = Math.max(120, Math.round(150000 * Math.pow((720 - totalScore720) / 720, 3.2)));
    const computedPercentile = Math.min(99.99, Math.round((totalScore720 / 720) * 100 * 100) / 100);

    const newTest: MockTest = {
      id: Date.now(),
      name: testName,
      date: new Date().toISOString().split('T')[0],
      type: selectedChapterNames.length === ALL_NCERT_CHAPTERS.length ? 'Full Mock (720)' : `${selectedChapterNames.length} Chapters Test (720)`,
      totalScore: totalScore720,
      maxScore: 720, // ALWAYS OUT OF 720
      physicsScore: phyScore,
      chemistryScore: chemScore,
      biologyScore: bioScore,
      correctAnswers: correct,
      wrongAnswers: wrong,
      unattempted: unattempted,
      timeTakenMinutes: timeTaken,
      estimatedAIR: computedAIR,
      percentile: computedPercentile,
      accuracy: computedAccuracy,
      mistakes: [
        { 
          questionNo: 18, 
          subject: 'Physics', 
          topic: selectedChapterNames[0] || 'NCERT Concepts', 
          type: 'Calculation Error', 
          note: 'Formula application sign convention check' 
        },
      ],
    };

    saveTests([newTest, ...testsList]);
    setShowAddForm(false);
    setTestName('');
  };

  const handleUpdateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;

    const newTotal720 = Math.min(720, Math.max(0, (editingTest.correctAnswers * 4) - (editingTest.wrongAnswers * 1)));
    const newAccuracy = Math.round((editingTest.correctAnswers / (editingTest.correctAnswers + editingTest.wrongAnswers || 1)) * 1000) / 10;
    const newPercentile = Math.min(99.99, Math.round((newTotal720 / 720) * 100 * 100) / 100);
    const newAIR = Math.max(120, Math.round(150000 * Math.pow((720 - newTotal720) / 720, 3.2)));

    const updated = testsList.map(t => {
      if (t.id === editingTest.id) {
        return {
          ...editingTest,
          totalScore: newTotal720,
          maxScore: 720,
          accuracy: newAccuracy,
          percentile: newPercentile,
          estimatedAIR: newAIR,
        };
      }
      return t;
    });

    saveTests(updated);
    setEditingTest(null);
  };

  const handleDeleteTest = (id: number) => {
    if (window.confirm('Delete this mock test log?')) {
      const updated = testsList.filter(t => t.id !== id);
      saveTests(updated);
    }
  };

  const chartData = [...testsList].reverse().map((t, idx) => ({
    name: `Test #${idx + 1}`,
    score: t.totalScore,
    air: t.estimatedAIR,
    percentile: t.percentile,
    physics: t.physicsScore,
    chemistry: t.chemistryScore,
    biology: t.biologyScore,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
              🎯 Standardized /720 Marking Scheme
            </span>
          </div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            Mock Tests & Error Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Log mock tests scored out of 720 marks and tag any tested NCERT chapters across Class 11 and 12.
          </p>
        </div>

        {mode === 'edit' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            {showAddForm ? 'Cancel Entry' : '+ Log Test Result (/720)'}
          </button>
        )}
      </div>

      {/* Test Entry Form Slide / Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddTest} className="p-6 sm:p-8 rounded-3xl bg-[#0D131F] border border-emerald-500/40 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" /> Enter Test Details (Scored out of 720)
                  </h2>
                  <p className="text-xs text-slate-400">Select which NCERT chapters were tested and enter question counts</p>
                </div>
                <div className="text-right bg-[#131B2B] px-5 py-2.5 rounded-2xl border border-emerald-500/40">
                  <span className="text-xs text-slate-400 font-semibold">Total Calculated Score: </span>
                  <strong className="text-2xl font-black text-emerald-400 ml-1">{calculatedScore} / 720</strong>
                </div>
              </div>

              {/* NCERT Chapters Selector Section */}
              <div className="space-y-3 p-5 rounded-3xl bg-[#080C14] border border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                      Select Tested NCERT Chapters ({selectedChapterNames.length} Selected)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllChapters}
                      className="px-2.5 py-1 rounded-lg bg-[#131B2B] text-[11px] font-bold text-emerald-400 border border-slate-700 hover:bg-[#192338]"
                    >
                      ✓ Select All (Full Syllabus)
                    </button>
                    <button
                      type="button"
                      onClick={clearAllChapters}
                      className="px-2.5 py-1 rounded-lg bg-[#131B2B] text-[11px] font-bold text-slate-400 border border-slate-700 hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Chapter Filters & Search */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="relative sm:col-span-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={chapterSearchQuery}
                      onChange={(e) => setChapterSearchQuery(e.target.value)}
                      placeholder="Search NCERT chapters..."
                      className="w-full pl-9 pr-3 py-2 bg-[#131B2B] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  <div className="flex bg-[#131B2B] p-1 rounded-xl border border-slate-800 text-xs font-bold">
                    {(['All', 'Physics', 'Chemistry', 'Biology'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFilterSubject(s)}
                        className={clsx(
                          "px-2.5 py-1 rounded-lg transition-all flex-1 text-center text-[11px]",
                          filterSubject === s ? "bg-emerald-500 text-black font-black" : "text-slate-400 hover:text-white"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="flex bg-[#131B2B] p-1 rounded-xl border border-slate-800 text-xs font-bold">
                    {(['All', '11', '12'] as const).map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFilterClass(c)}
                        className={clsx(
                          "px-2.5 py-1 rounded-lg transition-all flex-1 text-center text-[11px]",
                          filterClass === c ? "bg-cyan-500 text-black font-black" : "text-slate-400 hover:text-white"
                        )}
                      >
                        {c === 'All' ? 'All Classes' : `Class ${c}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scrollable NCERT Chapters Multi-Select Grid (All 79+ Chapters) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                  {filteredNcertChapters.map((ch) => {
                    const isSelected = selectedChapterNames.includes(ch.name);
                    const subjColor = ch.subject === 'Biology' ? 'text-emerald-400' : ch.subject === 'Chemistry' ? 'text-amber-400' : 'text-cyan-400';

                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => toggleChapterSelection(ch.name)}
                        className={clsx(
                          "p-2.5 rounded-xl text-left border text-xs font-medium flex items-center justify-between transition-all",
                          isSelected
                            ? "bg-[#14221E] border-emerald-500/60 text-white shadow-sm"
                            : "bg-[#0D131F] border-slate-800/80 text-slate-400 hover:text-slate-200"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isSelected ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          )}
                          <span className="truncate">{ch.name}</span>
                        </div>
                        <span className={clsx("text-[10px] font-black uppercase shrink-0 ml-1.5", subjColor)}>
                          {ch.subject.substring(0, 3)} {ch.classLevel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Test Name & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Test Name / Series</label>
                  <input
                    type="text"
                    required
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="e.g. Allen Grand Mock #08 or Optics + Coordination Test"
                    className="w-full px-4 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Time Taken (Mins)</label>
                  <input
                    type="number"
                    value={timeTaken}
                    onChange={(e) => setTimeTaken(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Questions Correct / Wrong / Unattempted */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#131B2B] border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1">Correct (+4)</label>
                  <input
                    type="number"
                    value={correct}
                    onChange={(e) => setCorrect(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0D131F] border border-slate-700 rounded-xl text-sm text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-400 mb-1">Wrong (-1)</label>
                  <input
                    type="number"
                    value={wrong}
                    onChange={(e) => setWrong(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0D131F] border border-slate-700 rounded-xl text-sm text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Unattempted (0)</label>
                  <input
                    type="number"
                    value={unattempted}
                    onChange={(e) => setUnattempted(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0D131F] border border-slate-700 rounded-xl text-sm text-white font-bold"
                  />
                </div>
              </div>

              {/* Subject Breakdown (/180, /180, /360 = /720) */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#131B2B] border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-cyan-400 mb-1">Physics (/180)</label>
                  <input
                    type="number"
                    max={180}
                    value={phyScore}
                    onChange={(e) => setPhyScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0D131F] border border-slate-700 rounded-xl text-sm text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">Chemistry (/180)</label>
                  <input
                    type="number"
                    max={180}
                    value={chemScore}
                    onChange={(e) => setChemScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0D131F] border border-slate-700 rounded-xl text-sm text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1">Biology (/360)</label>
                  <input
                    type="number"
                    max={360}
                    value={bioScore}
                    onChange={(e) => setBioScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0D131F] border border-slate-700 rounded-xl text-sm text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Save Result (/720)
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Chart Banner */}
      <div className="p-6 rounded-3xl bg-[#0D131F] border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Score Progression & Benchmark Trend (/720)
            </h2>
            <p className="text-xs text-slate-400">Historical performance across all {testsList.length} test submissions</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#172238" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
              <YAxis domain={[500, 720]} stroke="#64748B" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0D131F', borderColor: '#334155', borderRadius: '1rem', color: '#fff', fontSize: '12px' }} 
              />
              <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3.5} dot={{ fill: '#10B981', r: 5 }} name="Total Score (/720)" />
              <Line type="monotone" dataKey="physics" stroke="#06B6D4" strokeWidth={2} dot={{ fill: '#06B6D4', r: 3 }} name="Physics (/180)" />
              <Line type="monotone" dataKey="chemistry" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 3 }} name="Chemistry (/180)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Test Records List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center justify-between">
          <span>Test History & Error Logs</span>
          <span className="text-xs font-semibold text-slate-400">{testsList.length} Tests Logged (All Out of 720)</span>
        </h2>

        {testsList.map((test) => {
          const isExp = expandedTest === test.id;

          return (
            <div
              key={test.id}
              className="bg-[#0D131F] rounded-3xl border border-slate-800/80 shadow-sm overflow-hidden transition-all hover:border-slate-700"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start md:items-center gap-3.5 flex-1">
                  <div className="p-3 rounded-2xl bg-[#131B2B] border border-slate-800 text-emerald-400 font-black text-sm shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-400 font-bold">{test.date}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {test.type}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#131B2B] text-slate-300">
                        Acc: {test.accuracy}%
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                      {test.name}
                    </h3>
                  </div>
                </div>

                {/* Metrics + Action Buttons */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400">
                      {test.totalScore} <span className="text-xs text-slate-500 font-bold">/ 720</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      AIR ~{test.estimatedAIR} ({test.percentile}%)
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Report Button */}
                    <button
                      onClick={() => setReportingTest(test)}
                      className="px-3 py-2 rounded-xl bg-[#131B2B] hover:bg-[#192338] text-xs font-bold text-emerald-400 border border-slate-800 transition-colors"
                      title="View Detailed Report"
                    >
                      Report
                    </button>

                    {/* Edit Test Button */}
                    {mode === 'edit' && (
                      <button
                        onClick={() => setEditingTest(test)}
                        className="p-2 rounded-xl bg-[#131B2B] hover:bg-[#192338] text-slate-400 hover:text-white border border-slate-800 transition-colors"
                        title="Edit Test Data"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Test Button */}
                    {mode === 'edit' && (
                      <button
                        onClick={() => handleDeleteTest(test.id)}
                        className="p-2 rounded-xl bg-[#131B2B] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                        title="Delete Test"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedTest(isExp ? null : test.id)}
                      className="p-2 rounded-xl bg-[#131B2B] text-slate-400 hover:text-white"
                    >
                      {isExp ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Breakdown & Mistakes */}
              {isExp && (
                <div className="p-6 border-t border-slate-800/80 bg-[#080C14]/60 space-y-5">
                  {/* Breakdown Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-[#0D131F] border border-slate-800 text-center">
                      <div className="text-xs text-cyan-400 font-bold">Physics</div>
                      <div className="text-lg font-black text-white mt-1">{test.physicsScore} / 180</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#0D131F] border border-slate-800 text-center">
                      <div className="text-xs text-amber-400 font-bold">Chemistry</div>
                      <div className="text-lg font-black text-white mt-1">{test.chemistryScore} / 180</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#0D131F] border border-slate-800 text-center">
                      <div className="text-xs text-emerald-400 font-bold">Biology</div>
                      <div className="text-lg font-black text-white mt-1">{test.biologyScore} / 360</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#0D131F] border border-slate-800 text-center">
                      <div className="text-xs text-slate-400 font-bold">Questions Breakdown</div>
                      <div className="text-xs font-extrabold text-white mt-1">
                        🟢 {test.correctAnswers} | 🔴 {test.wrongAnswers} | ⚪ {test.unattempted}
                      </div>
                    </div>
                  </div>

                  {/* Mistake Log */}
                  {test.mistakes && test.mistakes.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2.5 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Root-Cause Mistake Log
                      </h4>
                      <div className="space-y-2">
                        {test.mistakes.map((m, idx) => (
                          <div key={idx} className="p-3 rounded-2xl bg-[#131B2B] border border-slate-800 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <strong className="text-white">Q.{m.questionNo} [{m.subject} - {m.topic}]: </strong>
                              <span className="text-slate-300">{m.note}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold shrink-0">
                              {m.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Test Modal */}
      <AnimatePresence>
        {editingTest && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg w-full bg-[#0D131F] rounded-3xl border border-emerald-500/40 p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-400" /> Edit Test Result & Auto-Recalculate (/720)
                </h3>
                <button onClick={() => setEditingTest(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateTest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Test Name</label>
                  <input
                    type="text"
                    value={editingTest.name}
                    onChange={(e) => setEditingTest({ ...editingTest, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#131B2B] border border-slate-700 rounded-xl text-white text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 mb-1">Correct (+4)</label>
                    <input
                      type="number"
                      value={editingTest.correctAnswers}
                      onChange={(e) => setEditingTest({ ...editingTest, correctAnswers: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#131B2B] border border-slate-700 rounded-xl text-white text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-rose-400 mb-1">Wrong (-1)</label>
                    <input
                      type="number"
                      value={editingTest.wrongAnswers}
                      onChange={(e) => setEditingTest({ ...editingTest, wrongAnswers: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#131B2B] border border-slate-700 rounded-xl text-white text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Unattempted</label>
                    <input
                      type="number"
                      value={editingTest.unattempted}
                      onChange={(e) => setEditingTest({ ...editingTest, unattempted: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#131B2B] border border-slate-700 rounded-xl text-white text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#131B2B] border border-slate-800 text-center">
                  <div className="text-xs text-slate-400">Recalculated Score:</div>
                  <div className="text-2xl font-black text-emerald-400">
                    {(editingTest.correctAnswers * 4) - (editingTest.wrongAnswers * 1)} / 720
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => setEditingTest(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20">
                    Save Changes (/720)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Test Performance Report Modal */}
      <AnimatePresence>
        {reportingTest && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-[#0D131F] rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {reportingTest.type} • {reportingTest.date}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">{reportingTest.name}</h3>
                </div>
                <button onClick={() => setReportingTest(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Report KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#131B2B] border border-slate-800 text-center">
                  <div className="text-xs text-slate-400">Total Score</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">{reportingTest.totalScore} / 720</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#131B2B] border border-slate-800 text-center">
                  <div className="text-xs text-slate-400">Estimated AIR</div>
                  <div className="text-2xl font-black text-white mt-1">~{reportingTest.estimatedAIR}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#131B2B] border border-slate-800 text-center">
                  <div className="text-xs text-slate-400">Accuracy</div>
                  <div className="text-2xl font-black text-cyan-400 mt-1">{reportingTest.accuracy}%</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#131B2B] border border-slate-800 text-center">
                  <div className="text-xs text-slate-400">Speed (Mins/Q)</div>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    {Math.round((reportingTest.timeTakenMinutes / (reportingTest.correctAnswers + reportingTest.wrongAnswers || 1)) * 100) / 100}m
                  </div>
                </div>
              </div>

              {/* Questions Breakdown */}
              <div className="p-4 rounded-2xl bg-[#131B2B] border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Question Breakdown</h4>
                <div className="flex gap-4 text-xs font-bold">
                  <span className="text-emerald-400">✓ {reportingTest.correctAnswers} Correct (+{reportingTest.correctAnswers * 4} Marks)</span>
                  <span className="text-rose-400">✗ {reportingTest.wrongAnswers} Wrong (-{reportingTest.wrongAnswers} Penalty)</span>
                  <span className="text-slate-400">⚪ {reportingTest.unattempted} Unattempted</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-[#131B2B] hover:bg-[#192338] text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                >
                  <Printer className="w-4 h-4" /> Print Report Card
                </button>
                <button
                  onClick={() => setReportingTest(null)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs"
                >
                  Close Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestsPage;
