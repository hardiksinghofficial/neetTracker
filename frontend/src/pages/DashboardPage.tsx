import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Timer, Clock, Award, Heart, Flame, Target, MessageSquare, Send, BookOpen, ArrowRight, TrendingUp, ShieldCheck, Building2 } from 'lucide-react';
import { MOCK_TESTS_DATA, STUDY_ANALYTICS } from '../data/mockData';
import { Link } from 'react-router-dom';
import { StudyHeatmap } from '../components/StudyHeatmap';
import { safeStorage } from '../lib/storage';
import clsx from 'clsx';

const DashboardPage: React.FC = () => {
  const { mode } = useAuth();
  const [daysRemaining, setDaysRemaining] = useState(265);
  const [selectedSender, setSelectedSender] = useState<'Papa' | 'Mummy' | 'Brother' | 'Akarsh'>('Papa');
  const [parentNotes, setParentNotes] = useState(() => {
    return safeStorage.get('neet_parent_encouragement_notes', [
      { id: 1, author: 'Papa', date: 'Yesterday at 9:30 PM', text: 'All the best for your NEET 2027 preparation, Akarsh! Focus on concept clarity in Physics and Chemistry.' },
      { id: 2, author: 'Mummy', date: 'Yesterday', text: 'Consistency is your superpower! Remember to take healthy breaks and stay hydrated 🥛' },
      { id: 3, author: 'Brother', date: '2 days ago', text: 'Keep pushing Bhaiya! MP GMC & AIIMS is within reach 🎯' },
    ]);
  });
  const [newNote, setNewNote] = useState('');

  // Dynamic storage metrics
  const attendanceRecords = useMemo(() => safeStorage.get<any[]>('neet_attendance_records', []), []);
  const ncertChecklist = useMemo(() => safeStorage.get<Record<number, any>>('neet_ncert_chapter_checklist', {}), []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.find(r => r.date === todayStr);
  const todayHours = todayAttendance ? Math.round(todayAttendance.totalDurationHours * 10) / 10 : 0;
  const isStudyingNow = todayAttendance && !todayAttendance.checkOutTime;

  const completedChaptersCount = Object.values(ncertChecklist).filter((c: any) => c.completed).length;
  const syllabusPercent = Math.round((completedChaptersCount / 79) * 100);
  const currentStreak = attendanceRecords.length;

  useEffect(() => {
    // 265 Days countdown set from tomorrow start
    setDaysRemaining(265);
  }, []);

  const handleAddParentNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const authorName = mode === 'edit' && selectedSender === 'Papa' ? 'Akarsh' : selectedSender;
    const updated = [
      { id: Date.now(), author: authorName, date: 'Just now', text: newNote.trim() },
      ...parentNotes,
    ];
    setParentNotes(updated);
    safeStorage.set('neet_parent_encouragement_notes', updated);
    setNewNote('');
  };

  // --- DEDICATED CLEAN & MINIMALIST PARENT EXECUTIVE VIEW ---
  if (mode === 'view') {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Parent Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090A0F] border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  👨‍👩‍👦 PARENT EXECUTIVE DASHBOARD
                </span>
                <span className="text-xs text-slate-400">Student: <strong>Akarsh Singh (General / UR)</strong></span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Akarsh Singh's Daily Study & Progress Summary
              </h1>
            </div>

            <div className="text-right bg-[#030304] px-4 py-2.5 rounded-2xl border border-white/5">
              <div className="text-xs text-slate-400">NEET Exam Countdown</div>
              <div className="text-xl font-black text-indigo-300 font-mono">{daysRemaining} Days Left</div>
            </div>
          </div>

          {/* Quick Status Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#030304] border border-white/5 flex items-center gap-3">
              <div className={clsx("w-3 h-3 rounded-full", isStudyingNow ? "bg-emerald-400 animate-ping" : "bg-slate-500")} />
              <div>
                <div className="text-xs text-slate-400">Current Study Status</div>
                <div className="text-sm font-bold text-white">
                  {isStudyingNow 
                    ? `🟢 In Session (Clocked in ${todayAttendance.checkInTime})` 
                    : todayHours > 0 
                      ? `🏁 Completed Today (${todayHours}h Logged)` 
                      : '⚪ Not Clocked In Yet'}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#030304] border border-white/5 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-xs text-slate-400">Sleep Routine</div>
                <div className="text-sm font-bold text-white">10:00 PM Night Curfew Active</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#030304] border border-white/5 flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-400" />
              <div>
                <div className="text-xs text-slate-400">Consistency Streak</div>
                <div className="text-sm font-bold text-white">{currentStreak} Consecutive Days 🔥</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Vital Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-400">Today's Study Time</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{todayHours} Hours</div>
            <div className="text-xs text-emerald-400 font-semibold">Net deep work (breaks subtracted)</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-400">Weekly Total Study</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{todayHours} Hours</div>
            <div className="text-xs text-indigo-300 font-semibold">Target: 70 Hours/Week</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-400">NCERT Syllabus Done</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{syllabusPercent}%</div>
            <div className="text-xs text-slate-400 font-semibold">{completedChaptersCount} of 79 Chapters Mastered</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-400">Latest Mock Test</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{MOCK_TESTS_DATA[0].totalScore} / 720</div>
            <div className="text-xs text-slate-300 font-semibold">AIR ~{MOCK_TESTS_DATA[0].estimatedAIR} ({MOCK_TESTS_DATA[0].percentile}%)</div>
          </div>
        </div>

        {/* Projected Medical College Allotment Status */}
        <div className="p-6 rounded-3xl bg-[#090A0F] border border-indigo-500/30 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2Icon /> Target Medical College Allotment Status (General / UR)
              </h2>
              <p className="text-xs text-slate-400">Based on current mock test scores & DME MP counseling cutoffs</p>
            </div>
            <Link to="/rank-predictor" className="text-xs font-bold text-indigo-300 hover:underline">
              Full Allotment List →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#030304] border border-emerald-500/40 flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-400 font-bold">MP Rank #1 Govt College</div>
                <div className="text-base font-extrabold text-white mt-0.5">MGM Medical College, Indore</div>
                <div className="text-xs text-slate-400 mt-0.5">UR Cutoff: 638 Marks (AIR ~8,450)</div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 text-xs font-black">
                ✓ 100% Safe Seat (+24 pts)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#030304] border border-indigo-500/40 flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-400 font-bold">Premier Central Institute</div>
                <div className="text-base font-extrabold text-white mt-0.5">AIIMS Bhopal (MP)</div>
                <div className="text-xs text-slate-400 mt-0.5">UR Cutoff: 686 Marks (AIR ~579)</div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 text-xs font-black">
                Target (+24 pts away)
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Study Hours Digest & Encouragement Wall */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simple Clean Table: Daily Breakdown */}
          <div className="p-6 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              This Week's Daily Study Hours Log
            </h3>

            <div className="space-y-2">
              {STUDY_ANALYTICS.weeklyTrends.map((d, i) => {
                const total = Math.round((d.physics + d.chemistry + d.biology) * 10) / 10;
                return (
                  <div key={i} className="p-3 rounded-2xl bg-[#030304] border border-white/5 flex justify-between items-center text-xs">
                    <span className="font-bold text-white w-12">{d.day}</span>
                    <div className="flex gap-3 text-slate-400">
                      <span>Phy: <strong className="text-slate-200">{d.physics}h</strong></span>
                      <span>Chem: <strong className="text-slate-200">{d.chemistry}h</strong></span>
                      <span>Bio: <strong className="text-slate-200">{d.biology}h</strong></span>
                    </div>
                    <span className="font-black text-indigo-300 font-mono">{total} Hours</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leave Encouraging Note for Akarsh */}
          <div className="p-6 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  Leave an Encouraging Note for Akarsh
                </h3>
                <span className="text-xs text-slate-500">{parentNotes.length} Notes</span>
              </div>

              <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1 mb-3">
                {parentNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-2xl bg-[#030304] border border-white/5 text-xs">
                    <div className="flex justify-between items-center text-slate-400 mb-1">
                      <strong className="text-indigo-300">
                        {note.author === 'Papa' ? '👨‍💼 Papa' : note.author === 'Mummy' ? '👩‍💼 Mummy' : note.author === 'Brother' ? '👦 Brother' : '🎓 Akarsh'}
                      </strong>
                      <span className="text-[10px] text-slate-500">{note.date}</span>
                    </div>
                    <p className="text-slate-200">"{note.text}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sender Selection */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                <span>Sending as:</span>
                {(['Papa', 'Mummy', 'Brother'] as const).map((sender) => (
                  <button
                    key={sender}
                    type="button"
                    onClick={() => setSelectedSender(sender)}
                    className={clsx(
                      "px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1",
                      selectedSender === sender
                        ? "bg-indigo-600 text-white font-extrabold shadow-sm"
                        : "bg-[#030304] text-slate-400 hover:text-white border border-white/5"
                    )}
                  >
                    <span>{sender === 'Papa' ? '👨‍💼' : sender === 'Mummy' ? '👩‍💼' : '👦'}</span>
                    <span>{sender}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleAddParentNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={`Write an encouraging note for Akarsh as ${selectedSender}...`}
                  className="flex-1 px-4 py-2.5 bg-[#030304] border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl text-xs flex items-center gap-1 transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Post Note
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 365-Day Glowing Heatmap */}
        <StudyHeatmap />
      </div>
    );
  }

  // --- STUDENT DASHBOARD VIEW ---
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner: Countdown + Target Rank Status */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#090A0F] via-[#0E121B] to-[#0A0D14] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ⚡ NEET 2027 CRACKER (GENERAL / UR)
              </span>
              <span className="text-xs font-bold text-slate-400">
                AIIMS New Delhi & MP State Track
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Keep The Momentum High, Akarsh!
            </h2>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl">
              Currently trending at <strong className="text-indigo-300 font-extrabold">{STUDY_ANALYTICS.estimatedNeetScore} / 720</strong> (Est. AIR ~1,450). Velocity is on pace for Top Govt GMC allotment.
            </p>
          </div>

          {/* Countdown Clock Widget */}
          <div className="flex items-center gap-4 bg-[#030304]/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-lg">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Timer className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tighter font-mono">
                {daysRemaining}
              </div>
              <div className="text-[11px] uppercase tracking-widest font-extrabold text-indigo-300">
                Days to NEET Exam
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S LIVE DAILY STUDY HOURS & ATTENDANCE STATUS */}
      <div className="bg-[#090A0F] p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-[#030304] border border-white/5 text-indigo-400">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-indigo-300 tracking-wider">
                  TODAY'S DAILY STUDY TIME
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Live Attendance
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                8.5 Hours <span className="text-xs text-slate-400 font-semibold font-normal">Studied Today</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Checked in at <strong className="text-white">06:15 AM</strong> • Break deductions auto-subtracted • 10:00 PM Curfew active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <Link
              to="/rank-predictor"
              className="px-4 py-2.5 rounded-2xl bg-[#030304] hover:bg-[#12141D] text-xs font-bold text-indigo-300 border border-indigo-500/30 flex items-center gap-2 transition-all"
            >
              <TrendingUp className="w-4 h-4 text-indigo-400" /> AIR & MP GMC Predictor
            </Link>
            <Link
              to="/ncert-checklist"
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <BookOpen className="w-4 h-4" /> NCERT Checklist <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Syllabus', value: `${STUDY_ANALYTICS.overallSyllabusPercent}%`, sub: '231 / 306 Topics', icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
          { label: 'Active Streak', value: `${STUDY_ANALYTICS.dailyStreak} Days`, sub: 'Personal Best: 24d', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
          { label: 'Weekly Deep Work', value: `${STUDY_ANALYTICS.currentWeekHours}h`, sub: `Target: ${STUDY_ANALYTICS.weeklyTargetHours}h`, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
          { label: 'Latest Mock Score', value: `${MOCK_TESTS_DATA[0].totalScore}`, sub: `AIR ~${MOCK_TESTS_DATA[0].estimatedAIR} (${MOCK_TESTS_DATA[0].percentile}%)`, icon: Award, color: 'text-indigo-300', bg: 'bg-indigo-500/10 border-indigo-500/30' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.08 }} 
            className="bg-[#090A0F] p-5 rounded-3xl border border-white/5 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">{stat.label}</span>
              <div className={`p-2.5 rounded-xl border ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-400 mt-1">{stat.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Middle Section: Study Hours Breakdown Chart & Subject Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 7-Day Multi-Subject Stacked Area Chart */}
        <div className="lg:col-span-2 bg-[#090A0F] p-6 rounded-3xl border border-white/5 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Study Intensity & Subject Hours
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Daily breakdown across Physics, Chemistry, and Biology</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Biology</span>
              <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400" /> Chem</span>
              <span className="flex items-center gap-1 text-indigo-400"><span className="w-2 h-2 rounded-full bg-indigo-400" /> Physics</span>
            </div>
          </div>

          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={STUDY_ANALYTICS.weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="chemGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="physGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#090A0F', borderColor: '#2A2D3D', borderRadius: '1rem', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="biology" stackId="1" stroke="#10B981" fill="url(#bioGrad)" name="Biology" />
                <Area type="monotone" dataKey="chemistry" stackId="1" stroke="#F59E0B" fill="url(#chemGrad)" name="Chemistry" />
                <Area type="monotone" dataKey="physics" stackId="1" stroke="#6366F1" fill="url(#physGrad)" name="Physics" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NCERT Syllabus Breakdown Card */}
        <div className="bg-[#090A0F] p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                NCERT Progress
              </h3>
              <span className="text-xs font-black text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-xl border border-indigo-500/20">
                74% Done
              </span>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Biology (Botany + Zoology)', completed: 32, total: 38, pct: 84, color: 'bg-emerald-500' },
                { name: 'Chemistry (Org + Inorg + Phy)', completed: 22, total: 30, pct: 73, color: 'bg-amber-500' },
                { name: 'Physics (Mechanics + Electrodyn)', completed: 18, total: 29, pct: 62, color: 'bg-indigo-500' },
              ].map((sub, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#030304] border border-white/5">
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                    <span>{sub.name}</span>
                    <span className="text-white">{sub.completed}/{sub.total} Ch ({sub.pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${sub.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link 
            to="/ncert-checklist" 
            className="mt-4 w-full py-3 px-4 rounded-2xl bg-[#030304] hover:bg-[#12141D] text-xs font-bold text-slate-200 border border-white/10 flex items-center justify-center gap-1.5 transition-all text-center"
          >
            Open NCERT Chapter Checklist →
          </Link>
        </div>
      </div>

      {/* Tests Section & Parent Encouragement Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Mock Tests Card */}
        <div className="bg-[#090A0F] p-6 rounded-3xl border border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Latest Test Scores & AIR
            </h3>
            <Link to="/tests" className="text-xs font-bold text-indigo-300 hover:underline">
              View All Tests ({MOCK_TESTS_DATA.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_TESTS_DATA.slice(0, 2).map((test) => (
              <div key={test.id} className="p-4 rounded-2xl bg-[#030304] border border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white text-sm">{test.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{test.date} • {test.timeTakenMinutes} mins taken</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-indigo-300">{test.totalScore} <span className="text-xs text-slate-500">/ 720</span></div>
                    <div className="text-[11px] font-bold text-slate-400">AIR ~{test.estimatedAIR} ({test.percentile}%)</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-[#090A0F] font-semibold text-indigo-300">
                    Phy: {test.physicsScore}/180
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#090A0F] font-semibold text-amber-300">
                    Chem: {test.chemistryScore}/180
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#090A0F] font-semibold text-emerald-300">
                    Bio: {test.biologyScore}/360
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parent Encouragement Wall & Notes */}
        <div className="bg-[#090A0F] p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                Family Encouragement Wall
              </h3>
              <span className="text-xs font-bold text-slate-400">{parentNotes.length} Notes</span>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-3">
              {parentNotes.map((note) => (
                <div key={note.id} className="p-3.5 rounded-2xl bg-[#030304] border border-white/5">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-extrabold text-indigo-300">
                      {note.author === 'Papa' ? '👨‍💼 Papa' : note.author === 'Mummy' ? '👩‍💼 Mummy' : note.author === 'Brother' ? '👦 Brother' : '🎓 Akarsh'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{note.date}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    "{note.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sender Picker & Input */}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
              <span>Author:</span>
              {(['Papa', 'Mummy', 'Brother', 'Akarsh'] as const).map((sender) => (
                <button
                  key={sender}
                  type="button"
                  onClick={() => setSelectedSender(sender)}
                  className={clsx(
                    "px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1",
                    selectedSender === sender
                      ? "bg-indigo-600 text-white font-extrabold shadow-sm"
                      : "bg-[#030304] text-slate-400 hover:text-white border border-white/5"
                  )}
                >
                  <span>{sender === 'Papa' ? '👨‍💼' : sender === 'Mummy' ? '👩‍💼' : sender === 'Brother' ? '👦' : '🎓'}</span>
                  <span>{sender}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleAddParentNote} className="flex gap-2">
              <input 
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={`Post a message as ${selectedSender}...`}
                className="flex-1 px-4 py-2.5 bg-[#030304] border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                Post
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 365-Day Glowing Heatmap */}
      <StudyHeatmap />
    </div>
  );
};

const Building2Icon = () => (
  <Building2 className="w-5 h-5 text-indigo-400" />
);

export default DashboardPage;
