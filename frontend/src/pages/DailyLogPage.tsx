import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, Flame, Sparkles, Plus, Clock, LogIn, LogOut as LogOutIcon, Moon, Coffee, ShieldCheck } from 'lucide-react';
import { StudyHeatmap } from '../components/StudyHeatmap';
import { safeStorage } from '../lib/storage';
import { attendanceAPI } from '../lib/api';
import type { CheckInOutRecord } from '../lib/storage';
import clsx from 'clsx';

const DailyLogPage: React.FC = () => {
  const [durationPreset, setDurationPreset] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [distractions, setDistractions] = useState(0);
  const [distractionNotes, setDistractionNotes] = useState<string[]>([]);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [showXpCelebration, setShowXpCelebration] = useState(false);
  const [curfewAlert, setCurfewAlert] = useState(false);

  // Live Current Time Clock & Live Break Elapsed Clock
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());
  const [currentTimeStr, setCurrentTimeStr] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Daily Check-In & Check-Out States
  const [attendanceRecords, setAttendanceRecords] = useState<CheckInOutRecord[]>(() => {
    return safeStorage.get<CheckInOutRecord[]>('neet_attendance_records', []);
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceRecords.find(r => r.date === todayStr);

  // Fetch live records from backend DB on load
  useEffect(() => {
    attendanceAPI.getAll().then((dbLogs) => {
      if (dbLogs && Array.isArray(dbLogs) && dbLogs.length > 0) {
        const formatted: CheckInOutRecord[] = dbLogs.map((l: any) => ({
          id: l.id || new Date(l.date).getTime(),
          date: typeof l.date === 'string' ? l.date.split('T')[0] : new Date(l.date).toISOString().split('T')[0],
          checkInTimestamp: l.checkInTimestamp || (l.checkInTime ? new Date(`${l.date.split('T')[0]} ${l.checkInTime}`).getTime() : null),
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
    });
  }, []);

  const saveAttendance = (records: CheckInOutRecord[], recordToSync?: CheckInOutRecord) => {
    setAttendanceRecords(records);
    safeStorage.set('neet_attendance_records', records);
    if (recordToSync) {
      attendanceAPI.createOrUpdate({
        date: recordToSync.date,
        hoursStudied: recordToSync.totalDurationHours,
        checkInTime: recordToSync.checkInTime,
        checkInTimestamp: recordToSync.checkInTimestamp || undefined,
        checkOutTime: recordToSync.checkOutTime,
        checkOutTimestamp: recordToSync.checkOutTimestamp || undefined,
        isOnBreak: recordToSync.isOnBreak,
        currentBreakStartTime: recordToSync.currentBreakStartTime || undefined,
        totalBreakSeconds: recordToSync.totalBreakSeconds,
        totalDurationHours: recordToSync.totalDurationHours,
        mood: recordToSync.mood,
        reflection: recordToSync.reflection,
      });
    }
  };

  // Live Timer Tick (Updates every second & checks 10:00 PM curfew)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setNowTimestamp(now.getTime());
      setCurrentTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      // 10:00 PM Auto Checkout Curfew Check (Hour >= 22)
      if (now.getHours() >= 22) {
        setAttendanceRecords(prev => {
          const rec = prev.find(r => r.date === todayStr);
          if (rec && !rec.checkOutTime) {
            setCurfewAlert(true);
            const closeTime = '10:00 PM';
            const closeTimestamp = now.getTime();
            let finalBreakSecs = rec.totalBreakSeconds;
            if (rec.isOnBreak && rec.currentBreakStartTime) {
              finalBreakSecs += Math.floor((closeTimestamp - rec.currentBreakStartTime) / 1000);
            }
            const grossSecs = Math.max(0, Math.floor((closeTimestamp - rec.checkInTimestamp) / 1000));
            const netSecs = Math.max(0, grossSecs - finalBreakSecs);
            const netHours = Math.round((netSecs / 3600) * 10) / 10;

            const updatedRec = {
              ...rec,
              checkOutTimestamp: closeTimestamp,
              checkOutTime: closeTime,
              isOnBreak: false,
              currentBreakStartTime: null,
              totalBreakSeconds: finalBreakSecs,
              totalDurationHours: netHours,
              reflection: 'Auto-completed at 10:00 PM Night Curfew for optimal sleep & memory retention.',
            };
            const updated = prev.map(r => r.date === todayStr ? updatedRec : r);
            saveAttendance(updated, updatedRec);
            return updated;
          }
          return prev;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [todayStr]);

  // STAMPED REAL-TIME CLOCK IN (Stored immediately in DB)
  const handleDirectRealtimeClockIn = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newRecord: CheckInOutRecord = {
      id: Date.now(),
      date: todayStr,
      checkInTimestamp: now.getTime(),
      checkInTime: formattedTime,
      checkOutTimestamp: null,
      checkOutTime: null,
      isOnBreak: false,
      currentBreakStartTime: null,
      totalBreakSeconds: 0,
      totalDurationHours: 0,
      mood: '⚡ Highly Focused',
      reflection: '',
    };
    const nextRecords = [newRecord, ...attendanceRecords.filter(r => r.date !== todayStr)];
    saveAttendance(nextRecords, newRecord);
  };

  // BREAK TOGGLE: Starts Break or Resumes Study (Stored immediately in DB)
  const handleToggleBreak = () => {
    if (!todayRecord || todayRecord.checkOutTime) return;
    const now = Date.now();
    let updatedRec: CheckInOutRecord;

    if (!todayRecord.isOnBreak) {
      // START BREAK
      updatedRec = {
        ...todayRecord,
        isOnBreak: true,
        currentBreakStartTime: now,
      };
    } else {
      // END BREAK
      const breakDurationSeconds = todayRecord.currentBreakStartTime 
        ? Math.floor((now - todayRecord.currentBreakStartTime) / 1000) 
        : 0;
      const accumulatedBreaks = todayRecord.totalBreakSeconds + breakDurationSeconds;

      updatedRec = {
        ...todayRecord,
        isOnBreak: false,
        currentBreakStartTime: null,
        totalBreakSeconds: accumulatedBreaks,
      };
    }
    const nextRecords = attendanceRecords.map(r => r.date === todayStr ? updatedRec : r);
    saveAttendance(nextRecords, updatedRec);
  };

  // STAMPED REAL-TIME CLOCK OUT (Calculates net hours & stored in DB)
  const handleDirectRealtimeClockOut = () => {
    if (!todayRecord) return;
    const now = new Date();
    const closeTimestamp = now.getTime();
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let finalBreakSecs = todayRecord.totalBreakSeconds;
    if (todayRecord.isOnBreak && todayRecord.currentBreakStartTime) {
      finalBreakSecs += Math.floor((closeTimestamp - todayRecord.currentBreakStartTime) / 1000);
    }

    const grossSeconds = Math.max(0, Math.floor((closeTimestamp - todayRecord.checkInTimestamp) / 1000));
    const netStudySeconds = Math.max(0, grossSeconds - finalBreakSecs);
    const netHours = Math.round((netStudySeconds / 3600) * 10) / 10;

    const updatedRec: CheckInOutRecord = {
      ...todayRecord,
      checkOutTimestamp: closeTimestamp,
      checkOutTime: formattedTime,
      isOnBreak: false,
      currentBreakStartTime: null,
      totalBreakSeconds: finalBreakSecs,
      totalDurationHours: netHours,
      reflection: 'Productive day of deep work completed.',
    };

    const nextRecords = attendanceRecords.map(r => r.date === todayStr ? updatedRec : r);
    saveAttendance(nextRecords, updatedRec);
    setEarnedXp(x => x + 100);
    setShowXpCelebration(true);
    setTimeout(() => setShowXpCelebration(false), 3000);
  };

  // Calculate Live Dynamic Durations
  const getLiveStats = () => {
    if (!todayRecord) return { grossStr: '0h 0m', breakStr: '0m', netStr: '0.0h', liveBreakActiveSec: 0 };
    
    const endTimestamp = todayRecord.checkOutTimestamp || nowTimestamp;
    const grossSeconds = Math.max(0, Math.floor((endTimestamp - todayRecord.checkInTimestamp) / 1000));

    let liveBreakSecs = todayRecord.totalBreakSeconds;
    let currentActiveBreak = 0;
    if (todayRecord.isOnBreak && todayRecord.currentBreakStartTime) {
      currentActiveBreak = Math.max(0, Math.floor((nowTimestamp - todayRecord.currentBreakStartTime) / 1000));
      liveBreakSecs += currentActiveBreak;
    }

    const netSeconds = Math.max(0, grossSeconds - liveBreakSecs);
    const grossHours = Math.floor(grossSeconds / 3600);
    const grossMins = Math.floor((grossSeconds % 3600) / 60);

    const breakMins = Math.floor(liveBreakSecs / 60);
    const netHoursDecimal = (Math.round((netSeconds / 3600) * 10) / 10).toFixed(1);

    return {
      grossStr: `${grossHours}h ${grossMins}m`,
      breakStr: `${breakMins} mins`,
      netStr: `${netHoursDecimal} Hours`,
      liveBreakActiveSec: currentActiveBreak,
    };
  };

  const liveStats = getLiveStats();

  const currentStreak = attendanceRecords.filter(r => (r.totalDurationHours > 0 || r.checkInTimestamp)).length;

  const [selectedTopicsToday, setSelectedTopicsToday] = useState<string[]>(() => {
    return safeStorage.get<string[]>('neet_today_topics_mastered', []);
  });
  const [newTopicInput, setNewTopicInput] = useState('');

  // Deep Work Focus Countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setCompletedPomodoros(p => p + 1);
      setEarnedXp(x => x + 50);
      setShowXpCelebration(true);
      setTimeout(() => setShowXpCelebration(false), 3000);
      setTimeLeft(durationPreset * 60);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeLeft, durationPreset]);

  const handlePresetChange = (mins: number) => {
    setDurationPreset(mins);
    if (!isActive) {
      setTimeLeft(mins * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durationPreset * 60);
  };

  const logDistractionReason = (reason: string) => {
    setDistractions(d => d + 1);
    setDistractionNotes(prev => [reason, ...prev.slice(0, 4)]);
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicInput.trim()) return;
    const updated = [...selectedTopicsToday, newTopicInput.trim()];
    setSelectedTopicsToday(updated);
    safeStorage.set('neet_today_topics_mastered', updated);
    setNewTopicInput('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 10:00 PM Curfew Alert */}
      {curfewAlert && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Moon className="w-5 h-5 text-amber-400 shrink-0" />
            <span><strong>10:00 PM Sleep Curfew Reached:</strong> Today's study session has been auto-wrapped. Rest well for memory consolidation!</span>
          </div>
          <button onClick={() => setCurfewAlert(false)} className="text-amber-400 font-bold p-1">✕</button>
        </div>
      )}

      {/* Top Header & Automated Real-Time Check-In / Break / Check-Out Tracker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
              🕒 Real-Time Clock: {currentTimeStr}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Automatic Clock Timestamping Active
            </span>
          </div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            Daily Attendance & Break Tracker
            <span className="text-xs px-3 py-1 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 font-extrabold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-orange-400" /> {currentStreak}-Day Streak
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Strict real-time clock-in/out. Track rest intervals with the Break button — break time is automatically subtracted from total study hours.
          </p>
        </div>

        {/* Real-time Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!todayRecord ? (
            <button
              onClick={handleDirectRealtimeClockIn}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <LogIn className="w-4 h-4" /> ⚡ Clock In Now ({currentTimeStr.split(' ')[0]})
            </button>
          ) : !todayRecord.checkOutTime ? (
            <div className="flex flex-wrap gap-2">
              {/* Take Break Button */}
              <button
                onClick={handleToggleBreak}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all active:scale-95",
                  todayRecord.isOnBreak
                    ? "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20 animate-pulse"
                    : "bg-[#131B2B] hover:bg-[#192338] text-amber-300 border border-amber-500/40"
                )}
              >
                <Coffee className="w-4 h-4" />
                {todayRecord.isOnBreak ? '▶️ End Break & Resume Study' : '☕ Take a Break'}
              </button>

              {/* Clock Out Button */}
              <button
                onClick={handleDirectRealtimeClockOut}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-extrabold text-xs transition-all hover:scale-105 active:scale-95"
              >
                <LogOutIcon className="w-4 h-4" /> 🏁 Clock Out ({currentTimeStr.split(' ')[0]})
              </button>
            </div>
          ) : (
            <div className="px-5 py-2.5 rounded-2xl bg-[#0D131F] border border-emerald-500/40 text-emerald-300 font-extrabold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Day Complete ({todayRecord.checkInTime} – {todayRecord.checkOutTime})
            </div>
          )}
        </div>
      </div>

      {/* TODAY'S ATTENDANCE, BREAKS & NET STUDY HOURS BREAKDOWN */}
      {todayRecord && (
        <div className="p-6 rounded-3xl bg-[#0D131F] border border-emerald-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#131B2B] border border-slate-800 text-emerald-400 font-black text-xs">
                TODAY'S METRICS
              </div>
              <div className="text-xs text-slate-300 font-bold">
                Clocked In: <strong className="text-white">{todayRecord.checkInTime}</strong> • 
                Clocked Out: <strong className="text-white">{todayRecord.checkOutTime || (todayRecord.isOnBreak ? '⏸️ ON BREAK' : '⚡ STUDYING')}</strong>
              </div>
            </div>

            {todayRecord.isOnBreak && (
              <div className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Coffee className="w-3.5 h-3.5" /> Break Running ({Math.floor(liveStats.liveBreakActiveSec / 60)}m {liveStats.liveBreakActiveSec % 60}s)
              </div>
            )}
          </div>

          {/* 3 Calculated Metrics: Gross Time - Break Time = Net Study Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-[#131B2B] border border-slate-800">
              <div className="text-xs font-bold text-slate-400">1. Total Time Elapsed</div>
              <div className="text-2xl font-black text-white mt-1">{liveStats.grossStr}</div>
              <div className="text-[10px] text-slate-500">Since clock-in at {todayRecord.checkInTime}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#131B2B] border border-amber-500/30">
              <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
                <Coffee className="w-3.5 h-3.5" /> 2. Total Break Time Deducted
              </div>
              <div className="text-2xl font-black text-amber-400 mt-1">-{liveStats.breakStr}</div>
              <div className="text-[10px] text-slate-500">Subtracted from daily total</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#14221E] border border-emerald-500/50 shadow-md">
              <div className="text-xs font-bold text-emerald-400">3. Net Deep Work Study Time</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{liveStats.netStr}</div>
              <div className="text-[10px] text-emerald-300/70 font-semibold">Actual pure focus hours</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Pomodoro Engine & Today's Deep Work Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Obsidian Glowing Pomodoro Timer */}
        <div className="bg-[#0D131F] p-8 rounded-3xl border border-slate-800/80 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
          <AnimatePresence>
            {showXpCelebration && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: -20, scale: 1.1 }}
                exit={{ opacity: 0 }}
                className="absolute top-6 px-4 py-2 rounded-2xl bg-amber-500 text-black font-black text-sm flex items-center gap-1.5 shadow-xl shadow-amber-500/30 z-20"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                +50 XP Earned! Session Complete 🎯
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 mb-6">
            <div className="text-left">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Pure Deep Focus Timer
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{completedPomodoros} Sessions Finished Today (+{earnedXp} XP)</p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#030304] p-1 rounded-2xl border border-white/5">
              <span className="text-[11px] text-slate-500 font-bold px-2">Preset:</span>
              {[25, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handlePresetChange(mins)}
                  className={clsx(
                    "px-3 py-1 rounded-xl text-xs font-extrabold transition-all",
                    durationPreset === mins
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* SVG Circular Progress Ring */}
          <div className="relative w-64 h-64 mb-6">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <circle cx="128" cy="128" r="115" className="stroke-slate-800/80" strokeWidth="10" fill="none" />
              <motion.circle 
                cx="128" cy="128" r="115" 
                className="stroke-indigo-500" 
                strokeWidth="10" fill="none" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 115}
                strokeDashoffset={2 * Math.PI * 115 * (1 - timeLeft / (durationPreset * 60))}
                transition={{ duration: 0.5, ease: "linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white tracking-tight font-mono">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs font-extrabold text-indigo-300 mt-2 uppercase tracking-widest flex items-center gap-1.5">
                {isActive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    Focus Session Active
                  </>
                ) : (
                  'Ready'
                )}
              </span>
            </div>
          </div>

          {/* Controls: Play/Pause/Reset */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTimer}
              className="px-8 py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-black text-base shadow-xl transition-all hover:scale-105 active:scale-95 bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
            >
              {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              {isActive ? 'Pause Focus' : 'Start Focus Session'}
            </button>
            <button 
              onClick={resetTimer}
              className="p-4 rounded-2xl bg-[#030304] text-slate-300 hover:bg-[#12141D] border border-white/10 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          
          {/* Distraction Logger */}
          <div className="mt-6 w-full pt-5 border-t border-white/5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2.5">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" /> Quick Distraction Logger
                </span>
                <span>Logged: {distractions}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {['Phone / Social', 'Daydreaming', 'Family / Noise', 'Fatigue / Slump'].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => logDistractionReason(reason)}
                    className="px-3 py-1.5 rounded-xl bg-[#131B2B] hover:bg-amber-950/40 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/30 text-[11px] font-medium transition-colors"
                  >
                    + {reason}
                  </button>
                ))}
              </div>
              {distractionNotes.length > 0 && (
                <div className="mt-2 text-[10px] text-slate-500">
                  Recent: {distractionNotes.join(', ')}
                </div>
              )}
            </div>
        </div>

        {/* Today's Study Progress & Topics Covered Panel */}
        <div className="space-y-6">
          <div className="bg-[#0D131F] p-6 rounded-3xl border border-slate-800/80 shadow-sm">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Today's Total Deep Work</span>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                {liveStats.netStr} Logged Today
              </span>
            </h2>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-[#131B2B] border border-slate-800">
                <div className="text-xs font-bold text-emerald-400">Net Study</div>
                <div className="text-xl font-black text-white mt-1">{liveStats.netStr}</div>
                <div className="text-[10px] text-slate-500">Pure focus time</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#131B2B] border border-slate-800">
                <div className="text-xs font-bold text-amber-400">Total Breaks</div>
                <div className="text-xl font-black text-white mt-1">{liveStats.breakStr}</div>
                <div className="text-[10px] text-slate-500">Rest intervals</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#131B2B] border border-slate-800">
                <div className="text-xs font-bold text-indigo-400">Focus Sprints</div>
                <div className="text-xl font-black text-white mt-1">{completedPomodoros}</div>
                <div className="text-[10px] text-slate-500">Finished today</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0D131F] p-6 rounded-3xl border border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Topics Mastered Today</span>
              <span className="text-xs text-emerald-400 font-bold">{selectedTopicsToday.length} Topics</span>
            </h3>

            <div className="space-y-2">
              {selectedTopicsToday.map((topic, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#131B2B] border border-slate-800 text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-slate-200">{topic}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">✓ Done</span>
                </div>
              ))}

              <form onSubmit={handleAddTopic} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newTopicInput}
                  onChange={(e) => setNewTopicInput(e.target.value)}
                  placeholder="Add custom studied topic..."
                  className="flex-1 px-4 py-2.5 bg-[#131B2B] border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl text-xs flex items-center gap-1 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 365-Day Glowing Heatmap */}
      <StudyHeatmap />
    </div>
  );
};

export default DailyLogPage;
