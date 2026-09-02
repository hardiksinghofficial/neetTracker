import React, { useState, useMemo } from 'react';
import { Calendar, Zap, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export interface DayLog {
  date: string;
  dayName: string;
  month: string;
  monthIndex: number;
  hours: number;
  isMilestone: boolean; // crosses 3 hours
  topicsCovered: string[];
}

interface MonthGroup {
  monthName: string;
  weeks: DayLog[][]; // Array of 7-day arrays for this month
}

export const StudyHeatmap: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<DayLog | null>(null);

  // Group days into 12 distinct month blocks with gaps
  const { monthGroups, allDays } = useMemo(() => {
    const today = new Date();
    const months: MonthGroup[] = [];
    const flatDays: DayLog[] = [];

    // Load actual attendance records if any
    let storedAttendance: any[] = [];
    try {
      const saved = localStorage.getItem('neet_attendance_records');
      if (saved) storedAttendance = JSON.parse(saved);
    } catch (e) {}

    // 12 Months: starting 11 months ago up to current month
    for (let mOffset = 11; mOffset >= 0; mOffset--) {
      const targetMonthDate = new Date(today.getFullYear(), today.getMonth() - mOffset, 1);
      const year = targetMonthDate.getFullYear();
      const month = targetMonthDate.getMonth();
      const monthName = targetMonthDate.toLocaleDateString('en-US', { month: 'short' });
      
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const monthDays: DayLog[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const dateStr = d.toISOString().split('T')[0];

        let hours = 0;
        let topicsCovered: string[] = [];

        // Check if user clocked attendance on this day
        const record = storedAttendance.find(r => r.date === dateStr);
        if (record && record.totalDurationHours) {
          hours = Math.round(record.totalDurationHours * 10) / 10;
          topicsCovered = ['Daily Clocked Attendance Session'];
        }

        const isMilestone = hours >= 3.0;

        const dayObj: DayLog = {
          date: dateStr,
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          month: monthName,
          monthIndex: month,
          hours,
          isMilestone,
          topicsCovered,
        };

        monthDays.push(dayObj);
        flatDays.push(dayObj);
      }

      // Chunk monthDays into columns of 7 days
      const weeksForMonth: DayLog[][] = [];
      let currentWeek: DayLog[] = [];

      // Align first day of month to day of week (0 = Sunday, 1 = Monday...)
      const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
      for (let pad = 0; pad < firstDayOfWeek; pad++) {
        currentWeek.push({
          date: '',
          dayName: '',
          month: monthName,
          monthIndex: month,
          hours: 0,
          isMilestone: false,
          topicsCovered: [],
        });
      }

      for (const d of monthDays) {
        currentWeek.push(d);
        if (currentWeek.length === 7) {
          weeksForMonth.push(currentWeek);
          currentWeek = [];
        }
      }

      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          currentWeek.push({
            date: '',
            dayName: '',
            month: monthName,
            monthIndex: month,
            hours: 0,
            isMilestone: false,
            topicsCovered: [],
          });
        }
        weeksForMonth.push(currentWeek);
      }

      months.push({
        monthName,
        weeks: weeksForMonth,
      });
    }

    return { monthGroups: months, allDays: flatDays };
  }, []);

  // Subtle, tasteful, eye-friendly color logic
  const getHeatmapColor = (day: DayLog) => {
    if (!day.date) return 'opacity-0 pointer-events-none'; // empty padding
    if (day.hours === 0) {
      // Unstudied days: clean, non-glowing dark cell
      return 'bg-[#090C14] border border-white/5 hover:border-indigo-500/50';
    }
    if (day.hours < 3.0) {
      // Under 3 hours: subtle dark forest green, no glow
      return 'bg-[#064E3B]/70 border border-emerald-900/60';
    }
    if (day.hours < 6.0) {
      // 3 to 6 Hours: Crisp emerald with subtle soft shadow (not overly glowing)
      return 'bg-[#10B981] border border-emerald-400/40 shadow-[0_0_6px_rgba(16,185,129,0.35)]';
    }
    if (day.hours < 9.0) {
      // 6 to 9 Hours: Rich vibrant emerald with neat refined border
      return 'bg-[#059669] border border-emerald-300/50 shadow-[0_0_7px_rgba(5,150,105,0.4)]';
    }
    // 9+ Hours: Clean solid peak focus
    return 'bg-[#34D399] border border-white/40 shadow-[0_0_8px_rgba(52,211,153,0.45)]';
  };

  const totalActiveDays = allDays.filter(d => d.hours > 0).length;
  const milestoneDaysCount = allDays.filter(d => d.isMilestone).length;
  const totalHoursLogged = Math.round(allDays.reduce((acc, d) => acc + d.hours, 0) * 10) / 10;
  const currentStreak = totalActiveDays > 0 ? totalActiveDays : 0;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#090A0F] border border-white/5 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" /> 3h+ STUDY MILESTONE
            </span>
            <span className="text-xs text-slate-400 font-semibold">{milestoneDaysCount} Target Days ($\ge$ 3.0 Hours)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-indigo-400" />
            LeetCode-Style Yearly Study Submissions & Heatmap
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Month-by-month grid with clean gaps between months. Only days with <strong>3+ hours of study</strong> are marked with the focus badge.
          </p>
        </div>

        {/* Subtle Legend */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-[#030304] px-4 py-2 rounded-2xl border border-white/5">
          <span className="text-[11px] text-slate-500">Less</span>
          <span className="w-3 h-3 rounded-[3px] bg-[#090C14] border border-white/5" title="0 Hours (Blank)" />
          <span className="w-3 h-3 rounded-[3px] bg-[#064E3B]/70 border border-emerald-900" title="<3 Hours (Basic)" />
          <span className="w-3 h-3 rounded-[3px] bg-[#10B981] border border-emerald-400/40 shadow-[0_0_6px_rgba(16,185,129,0.35)]" title="3-6 Hours (3h+ Milestone)" />
          <span className="w-3 h-3 rounded-[3px] bg-[#059669] border border-emerald-300/50 shadow-[0_0_7px_rgba(5,150,105,0.4)]" title="6-9 Hours" />
          <span className="w-3 h-3 rounded-[3px] bg-[#34D399] border border-white/40 shadow-[0_0_8px_rgba(52,211,153,0.45)]" title="9+ Hours" />
          <span className="text-[11px] text-emerald-400 font-extrabold">3h+ Marked</span>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#030304] border border-white/5 text-center">
          <div className="text-xs text-slate-400">Total Active Days</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">{totalActiveDays} <span className="text-xs text-slate-500">Days</span></div>
          <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Fresh 2027 Run</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#030304] border border-white/5 text-center">
          <div className="text-xs text-slate-400">3h+ Milestone Days</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{milestoneDaysCount} Days</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Crossed 3.0h Study Goal</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#030304] border border-white/5 text-center">
          <div className="text-xs text-slate-400">Total Hours Logged</div>
          <div className="text-2xl font-black text-indigo-300 mt-1 font-mono">{totalHoursLogged} hrs</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Pure focus time</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#030304] border border-white/5 text-center">
          <div className="text-xs text-slate-400">Current Streak</div>
          <div className="text-2xl font-black text-orange-400 mt-1 font-mono">{currentStreak} Days 🔥</div>
          <div className="text-[10px] text-orange-400/80 font-bold mt-0.5">Streak Tracker</div>
        </div>
      </div>

      {/* LeetCode Month-Wise Grid with Gaps Between Months */}
      <div className="overflow-x-auto pt-2 pb-2">
        <div className="flex gap-4 min-w-[820px] p-4 rounded-2xl bg-[#030304] border border-white/5">
          {/* Day of week labels */}
          <div className="flex flex-col justify-between text-[10px] font-bold text-slate-500 pr-2 pt-6 pb-0.5 select-none shrink-0">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
            <span>Sun</span>
          </div>

          {/* Month Blocks Container */}
          <div className="flex gap-4 flex-1">
            {monthGroups.map((group, mIdx) => (
              <div key={mIdx} className="flex flex-col gap-1.5 shrink-0">
                {/* Month Name Header */}
                <div className="text-[11px] font-extrabold text-slate-400 text-center pb-1">
                  {group.monthName}
                </div>

                {/* Weeks in this Month */}
                <div className="flex gap-1.5">
                  {group.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1.5">
                      {week.map((day, dIdx) => (
                        <button
                          key={dIdx}
                          disabled={!day.date}
                          onClick={() => day.date && setSelectedDay(day)}
                          title={day.date ? `${day.hours} hrs on ${day.date} (${day.dayName}) ${day.isMilestone ? '✓ (3h+ Milestone)' : ''}` : ''}
                          className={clsx(
                            "w-3 h-3 rounded-[3px] transition-all cursor-pointer",
                            day.date && "hover:scale-150 hover:z-20",
                            getHeatmapColor(day)
                          )}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Day Inspector */}
      {selectedDay && (
        <div className="p-4 rounded-2xl bg-[#030304] border border-indigo-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-300">📅 {selectedDay.date} ({selectedDay.dayName})</span>
              {selectedDay.isMilestone ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> 3h+ Target Crossed
                </span>
              ) : selectedDay.hours > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                  Under 3 Hours
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/60 text-slate-500">
                  No Study Session Logged
                </span>
              )}
            </div>
            <div className="text-lg font-black text-white mt-0.5 font-mono">
              {selectedDay.hours} Hours Studied
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {selectedDay.topicsCovered.length > 0 
                ? `Topics: ${selectedDay.topicsCovered.join(' • ')}`
                : 'Log a study session in Daily Attendance to mark this day!'}
            </div>
          </div>

          <button
            onClick={() => setSelectedDay(null)}
            className="px-3 py-1.5 rounded-xl bg-[#090A0F] hover:bg-[#12141D] text-slate-400 hover:text-white text-xs font-bold border border-white/5"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyHeatmap;
