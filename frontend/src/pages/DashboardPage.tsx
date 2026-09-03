import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Timer, Clock, Award, Heart, Flame, Target, MessageSquare, Send, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StudyHeatmap } from '../components/StudyHeatmap';
import { safeStorage } from '../lib/storage';
import { attendanceAPI, parentNotesAPI, testsAPI } from '../lib/api';
import clsx from 'clsx';

interface ParentNoteItem {
  id: number;
  author: string;
  date: string;
  text: string;
}

const DashboardPage: React.FC = () => {
  const { mode } = useAuth();
  const [daysRemaining, setDaysRemaining] = useState(265);
  const [selectedSender, setSelectedSender] = useState<'Papa' | 'Mummy' | 'Brother' | 'Akarsh'>('Papa');
  const [newNote, setNewNote] = useState('');
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());

  // Attendance Records from DB & LocalStorage Cache
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>(() => {
    return safeStorage.get<any[]>('neet_attendance_records', []);
  });

  // Parent Notes from DB & LocalStorage Cache
  const [parentNotes, setParentNotes] = useState<ParentNoteItem[]>(() => {
    return safeStorage.get<ParentNoteItem[]>('neet_parent_encouragement_notes', [
      { id: 1, author: 'Papa', date: 'Welcome', text: 'All the best for your NEET 2027 preparation, Akarsh! Focus on concept clarity and consistent daily deep work.' },
    ]);
  });

  // Mock Tests from DB & LocalStorage Cache
  const [mockTests, setMockTests] = useState<any[]>(() => {
    return safeStorage.get<any[]>('neet_mock_tests_list', []);
  });

  const ncertChecklist = useMemo(() => safeStorage.get<Record<number, any>>('neet_ncert_chapter_checklist', {}), []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.find(r => r.date === todayStr);

  // Sync with DB function
  const fetchLiveData = useCallback(async () => {
    try {
      // 1. Fetch Today Attendance & All Attendance
      const dbLogs = await attendanceAPI.getAll();
      if (dbLogs && Array.isArray(dbLogs)) {
        const formatted = dbLogs.map((l: any) => ({
          id: l.id || new Date(l.date).getTime(),
          date: typeof l.date === 'string' ? l.date.split('T')[0] : new Date(l.date).toISOString().split('T')[0],
          checkInTimestamp: l.checkInTimestamp || (l.checkInTime ? new Date(`${typeof l.date === 'string' ? l.date.split('T')[0] : new Date(l.date).toISOString().split('T')[0]} ${l.checkInTime}`).getTime() : null),
          checkInTime: l.checkInTime || '',
          checkOutTimestamp: l.checkOutTimestamp || null,
          checkOutTime: l.checkOutTime || null,
          isOnBreak: !!l.isOnBreak,
          currentBreakStartTime: l.currentBreakStartTime || null,
          totalBreakSeconds: l.totalBreakSeconds || 0,
          totalDurationHours: l.totalDurationHours || l.hoursStudied || 0,
          mood: l.mood || '⚡ Highly Focused',
          reflection: l.reflection || l.notes || '',
        }));
        setAttendanceRecords(formatted);
        safeStorage.set('neet_attendance_records', formatted);
      }

      // 2. Fetch Parent Notes from DB
      const dbNotes = await parentNotesAPI.getAll();
      if (dbNotes && Array.isArray(dbNotes) && dbNotes.length > 0) {
        const formattedNotes: ParentNoteItem[] = dbNotes.map((n: any) => ({
          id: n.id,
          author: n.author || 'Papa',
          date: n.date ? new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
          text: n.message || n.text || '',
        }));
        setParentNotes(formattedNotes);
        safeStorage.set('neet_parent_encouragement_notes', formattedNotes);
      }

      // 3. Fetch Mock Tests from DB
      const dbTests = await testsAPI.getAll();
      if (dbTests && Array.isArray(dbTests) && dbTests.length > 0) {
        setMockTests(dbTests);
        safeStorage.set('neet_mock_tests_list', dbTests);
      }
    } catch (e) {
      console.warn('Live sync fallback to local storage:', e);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    // Poll DB every 5 seconds so Parent & Student views update live in real-time
    const pollInterval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(pollInterval);
  }, [fetchLiveData]);

  // Live Timer Tick for 1-second real-time precision calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Live Real-time Study Durations
  const getLiveSessionMetrics = () => {
    if (!todayAttendance || !todayAttendance.checkInTime) {
      return {
        status: 'not_started' as const,
        statusLabel: '⚪ Not Clocked In Yet Today',
        hoursDecimal: 0,
        timeFormatted: '0h 0m',
        breakFormatted: '0m',
        isStudying: false,
        isOnBreak: false,
      };
    }

    if (todayAttendance.checkOutTime) {
      const finalHours = Math.round((todayAttendance.totalDurationHours || todayAttendance.hoursStudied || 0) * 10) / 10;
      const breakMins = Math.floor((todayAttendance.totalBreakSeconds || 0) / 60);
      return {
        status: 'completed' as const,
        statusLabel: `🏁 Completed Today (${todayAttendance.checkInTime} – ${todayAttendance.checkOutTime})`,
        hoursDecimal: finalHours,
        timeFormatted: `${finalHours} Hours`,
        breakFormatted: `${breakMins} mins`,
        isStudying: false,
        isOnBreak: false,
      };
    }

    // Active session (either studying live or on break)
    const curfewDate = new Date();
    curfewDate.setHours(22, 0, 0, 0);
    const curfewTimestamp = curfewDate.getTime();
    const isCurfewReached = nowTimestamp >= curfewTimestamp;
    const endTimestamp = isCurfewReached ? curfewTimestamp : nowTimestamp;
    const grossSeconds = Math.max(0, Math.floor((endTimestamp - todayAttendance.checkInTimestamp) / 1000));

    let liveBreakSecs = todayAttendance.totalBreakSeconds || 0;
    if (todayAttendance.isOnBreak && todayAttendance.currentBreakStartTime) {
      const breakEnd = isCurfewReached ? curfewTimestamp : nowTimestamp;
      liveBreakSecs += Math.max(0, Math.floor((breakEnd - todayAttendance.currentBreakStartTime) / 1000));
    }

    const netSeconds = Math.max(0, grossSeconds - liveBreakSecs);
    const netHours = Math.floor(netSeconds / 3600);
    const netMins = Math.floor((netSeconds % 3600) / 60);
    const netSecs = netSeconds % 60;
    const netHoursDecimal = Math.round((netSeconds / 3600) * 10) / 10;
    const breakMins = Math.floor(liveBreakSecs / 60);

    if (isCurfewReached) {
      return {
        status: 'completed' as const,
        statusLabel: `🏁 Completed Today (${todayAttendance.checkInTime} – 10:00 PM Auto-Curfew)`,
        hoursDecimal: netHoursDecimal,
        timeFormatted: `${netHoursDecimal} Hours`,
        breakFormatted: `${breakMins} mins`,
        isStudying: false,
        isOnBreak: false,
      };
    }

    if (todayAttendance.isOnBreak) {
      return {
        status: 'on_break' as const,
        statusLabel: `☕ On Break (Clocked in ${todayAttendance.checkInTime})`,
        hoursDecimal: netHoursDecimal,
        timeFormatted: `${netHours}h ${netMins}m ${netSecs}s`,
        breakFormatted: `${breakMins} mins`,
        isStudying: false,
        isOnBreak: true,
      };
    }

    return {
      status: 'studying' as const,
      statusLabel: `🟢 Studying Live (Clocked in ${todayAttendance.checkInTime})`,
      hoursDecimal: netHoursDecimal,
      timeFormatted: `${netHours}h ${netMins}m ${netSecs}s`,
      breakFormatted: `${breakMins} mins`,
      isStudying: true,
      isOnBreak: false,
    };
  };

  const liveSession = getLiveSessionMetrics();

  const completedChaptersCount = Object.values(ncertChecklist).filter((c: any) => c.completed).length;
  const syllabusPercent = Math.round((completedChaptersCount / 79) * 100);
  const currentStreak = attendanceRecords.filter(r => (r.totalDurationHours > 0 || r.checkInTimestamp)).length;

  // Weekly study hours calculated directly from real database logs
  const weeklyStudyHours = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentLogs = attendanceRecords.filter(r => new Date(r.date) >= sevenDaysAgo);
    const sum = recentLogs.reduce((acc, r) => acc + (r.totalDurationHours || r.hoursStudied || 0), 0);
    return Math.round(sum * 10) / 10;
  }, [attendanceRecords]);

  // Latest mock test from real data
  const latestMock = mockTests.length > 0 ? mockTests[0] : null;

  useEffect(() => {
    setDaysRemaining(265);
  }, []);

  const handleAddParentNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const authorName = mode === 'edit' && selectedSender === 'Papa' ? 'Akarsh' : selectedSender;
    const noteText = newNote.trim();

    // 1. Optimistically update state
    const newEntry: ParentNoteItem = {
      id: Date.now(),
      author: authorName,
      date: 'Just now',
      text: noteText,
    };
    const updated = [newEntry, ...parentNotes];
    setParentNotes(updated);
    safeStorage.set('neet_parent_encouragement_notes', updated);
    setNewNote('');

    // 2. Persist to DB
    await parentNotesAPI.create({ author: authorName, message: noteText });
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

          {/* Real-Time Live Status Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={clsx(
              "p-3.5 rounded-2xl border flex items-center gap-3 transition-all",
              liveSession.isStudying 
                ? "bg-emerald-950/30 border-emerald-500/40" 
                : liveSession.isOnBreak 
                  ? "bg-amber-950/30 border-amber-500/40" 
                  : "bg-[#030304] border-white/5"
            )}>
              <div className={clsx(
                "w-3 h-3 rounded-full",
                liveSession.isStudying ? "bg-emerald-400 animate-ping" : liveSession.isOnBreak ? "bg-amber-400 animate-pulse" : "bg-slate-500"
              )} />
              <div>
                <div className="text-xs text-slate-400">Current Study Status</div>
                <div className="text-sm font-bold text-white">
                  {liveSession.statusLabel}
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

        {/* 4 Core Vital Performance Metrics - Calculated from Real DB Data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#090A0F] border border-emerald-500/30 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> Today's Live Study Time
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {liveSession.timeFormatted}
            </div>
            <div className="text-xs text-slate-400 font-semibold">
              {liveSession.isStudying ? '🟢 Ticking in real-time' : 'Breaks automatically deducted'}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-400">Past 7 Days Total</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{weeklyStudyHours} Hours</div>
            <div className="text-xs text-indigo-300 font-semibold">Logged in Database</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-400">NCERT Syllabus Done</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{syllabusPercent}%</div>
            <div className="text-xs text-slate-400 font-semibold">{completedChaptersCount} of 79 Chapters Mastered</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-400">Latest Mock Test</div>
            {latestMock ? (
              <>
                <div className="text-2xl sm:text-3xl font-black text-indigo-300 font-mono">{latestMock.totalScore} / 720</div>
                <div className="text-xs text-slate-300 font-semibold">{latestMock.name}</div>
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-slate-400 font-mono mt-1">No Tests Logged</div>
                <div className="text-xs text-slate-500 font-semibold">Scored out of 720</div>
              </>
            )}
          </div>
        </div>

        {/* Real Daily Study Hours Digest & Encouragement Wall */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simple Clean Table: Real Daily Breakdown from Database */}
          <div className="p-6 rounded-3xl bg-[#090A0F] border border-white/5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Recent Daily Study Log (Database)
              </span>
              <span className="text-xs text-slate-400">{attendanceRecords.length} Total Logs</span>
            </h3>

            {attendanceRecords.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {attendanceRecords.slice(0, 7).map((rec, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#030304] border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white">{rec.date}</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {rec.checkInTime ? `Clock: ${rec.checkInTime} – ${rec.checkOutTime || 'Active'}` : 'Recorded Session'}
                      </div>
                    </div>
                    <span className="font-black text-emerald-400 font-mono">
                      {(rec.totalDurationHours || rec.hoursStudied || 0).toFixed(1)} Hours
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-[#030304] border border-white/5">
                No previous daily logs found. As Akarsh clocks in and studies, daily entries will be logged automatically here in the database.
              </div>
            )}
          </div>

          {/* Leave Encouraging Note for Akarsh (Directly Persisted to DB) */}
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
      {/* Top Banner: Countdown */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#090A0F] via-[#0E121B] to-[#0A0D14] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ⚡ NEET 2027 TARGET
              </span>
              <span className="text-xs font-bold text-slate-400">
                Akarsh Singh • Study & Mastery Dashboard
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Keep The Momentum High, Akarsh!
            </h2>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl">
              Stay consistent with deep focus sessions, NCERT line-by-line revision, and active mock testing.
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

      {/* TODAY'S REAL-TIME LIVE DAILY STUDY TIME & ATTENDANCE STATUS */}
      <div className="bg-[#090A0F] p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={clsx(
              "p-4 rounded-2xl border",
              liveSession.isStudying ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400" : "bg-[#030304] border-white/5 text-indigo-400"
            )}>
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-indigo-300 tracking-wider">
                  TODAY'S STUDY SESSION
                </span>
                <span className={clsx(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                  liveSession.isStudying 
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse"
                    : liveSession.isOnBreak
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                )}>
                  {liveSession.isStudying ? '🟢 Studying Live' : liveSession.isOnBreak ? '☕ On Break' : liveSession.status === 'completed' ? '🏁 Completed' : '⚪ Ready'}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                {liveSession.timeFormatted} <span className="text-xs text-slate-400 font-semibold font-normal">Studied Today</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {todayAttendance && todayAttendance.checkInTime 
                  ? `Checked in at ${todayAttendance.checkInTime} • Breaks: ${liveSession.breakFormatted} deducted • 10:00 PM Curfew active`
                  : 'Click Clock In on the Daily Log page to start tracking today’s study session.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <Link
              to="/daily-log"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Clock className="w-4 h-4" /> Go To Daily Clock-In
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
          { label: 'NCERT Progress', value: `${syllabusPercent}%`, sub: `${completedChaptersCount} / 79 Chapters`, icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
          { label: 'Active Streak', value: `${currentStreak} Days`, sub: 'Logged in DB', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
          { label: 'Past 7 Days Study', value: `${weeklyStudyHours}h`, sub: 'Calculated from logs', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
          { label: 'Latest Test Score', value: latestMock ? `${latestMock.totalScore} / 720` : 'None', sub: latestMock ? `AIR ~${latestMock.estimatedAIR || 'N/A'}` : 'Log on Tests page', icon: Award, color: 'text-indigo-300', bg: 'bg-indigo-500/10 border-indigo-500/30' },
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

      {/* Tests Section & Parent Encouragement Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Mock Tests Card */}
        <div className="bg-[#090A0F] p-6 rounded-3xl border border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Latest Test Scores & Errors
            </h3>
            <Link to="/tests" className="text-xs font-bold text-indigo-300 hover:underline">
              View All Tests ({mockTests.length}) →
            </Link>
          </div>

          {mockTests.length > 0 ? (
            <div className="space-y-3">
              {mockTests.slice(0, 2).map((test) => (
                <div key={test.id} className="p-4 rounded-2xl bg-[#030304] border border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white text-sm">{test.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{test.date} • {test.timeTakenMinutes || 180} mins</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-indigo-300">{test.totalScore} <span className="text-xs text-slate-500">/ 720</span></div>
                      <div className="text-[11px] font-bold text-slate-400">AIR ~{test.estimatedAIR || 'N/A'} ({test.percentile || 0}%)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5 text-center text-xs">
                    <div className="p-1.5 rounded-lg bg-[#090A0F] font-semibold text-indigo-300">
                      Phy: {test.physicsScore || 0}/180
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#090A0F] font-semibold text-amber-300">
                      Chem: {test.chemistryScore || 0}/180
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#090A0F] font-semibold text-emerald-300">
                      Bio: {test.biologyScore || 0}/360
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-[#030304] border border-white/5 space-y-2">
              <p>No tests logged yet.</p>
              <Link to="/tests" className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs">
                + Log Your First Mock Test (/720)
              </Link>
            </div>
          )}
        </div>

        {/* Family Encouragement Wall & Notes (Persisted to DB) */}
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

export default DashboardPage;
