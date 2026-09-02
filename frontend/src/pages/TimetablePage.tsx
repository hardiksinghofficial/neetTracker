import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Calendar as CalendarIcon, Zap, Trash2, Edit3, X, Sparkles, Check } from 'lucide-react';
import type { TimetableEntry } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const AIIMS_ROUTINE_PRESET: TimetableEntry[] = [
  // Monday
  { id: 101, day: 'Mon', time: '06:00 AM - 08:30 AM', subject: 'Physics', title: 'Electrostatics Numericals & HC Verma', duration: 2.5, isCompleted: true },
  { id: 102, day: 'Mon', time: '09:30 AM - 12:00 PM', subject: 'Chemistry', title: 'Coordination Compounds CFT Theory', duration: 2.5, isCompleted: true },
  { id: 103, day: 'Mon', time: '01:30 PM - 04:30 PM', subject: 'Biology', title: 'NCERT Molecular Genetics Line by Line', duration: 3.0, isCompleted: true },
  { id: 104, day: 'Mon', time: '05:30 PM - 07:30 PM', subject: 'Revision', title: 'Previous Year 100 Qs Speed Drill', duration: 2.0, isCompleted: false },
  { id: 105, day: 'Mon', time: '08:30 PM - 10:30 PM', subject: 'Mock Test', title: 'Physics Mini Sectional Test (45 Qs)', duration: 2.0, isCompleted: false },
  // Tuesday
  { id: 201, day: 'Tue', time: '06:00 AM - 08:30 AM', subject: 'Chemistry', title: 'Organic Reaction Mechanisms (Aldol/Cannizzaro)', duration: 2.5, isCompleted: false },
  { id: 202, day: 'Tue', time: '09:30 AM - 12:00 PM', subject: 'Biology', title: 'Human Reproduction & Hormonal Cycle', duration: 2.5, isCompleted: false },
  { id: 203, day: 'Tue', time: '01:30 PM - 04:30 PM', subject: 'Physics', title: 'Ray Optics Lens Maker & Telescope', duration: 3.0, isCompleted: false },
  { id: 204, day: 'Tue', time: '05:30 PM - 07:30 PM', subject: 'Revision', title: 'Chemistry Inorganic Exceptions Flashcards', duration: 2.0, isCompleted: false },
  // Wednesday
  { id: 301, day: 'Wed', time: '06:00 AM - 08:30 AM', subject: 'Biology', title: 'Biotechnology Tools & pBR322 Vector', duration: 2.5, isCompleted: false },
  { id: 302, day: 'Wed', time: '09:30 AM - 12:00 PM', subject: 'Physics', title: 'Current Electricity & Kirchhoff Laws', duration: 2.5, isCompleted: false },
  { id: 303, day: 'Wed', time: '01:30 PM - 04:30 PM', subject: 'Chemistry', title: 'Electrochemistry Nernst Equation Numericals', duration: 3.0, isCompleted: false },
  // Thursday
  { id: 401, day: 'Thu', time: '06:00 AM - 08:30 AM', subject: 'Physics', title: 'Semiconductor Logic Gates & Diodes', duration: 2.5, isCompleted: false },
  { id: 402, day: 'Thu', time: '09:30 AM - 12:00 PM', subject: 'Biology', title: 'Plant Physiology & Photosynthesis ETS', duration: 2.5, isCompleted: false },
  // Friday
  { id: 501, day: 'Fri', time: '06:00 AM - 08:30 AM', subject: 'Chemistry', title: 'GOC Carbocation Stability & Acidity Orders', duration: 2.5, isCompleted: false },
  { id: 502, day: 'Fri', time: '09:30 AM - 12:00 PM', subject: 'Biology', title: 'Ecology & Environment High Yield Facts', duration: 2.5, isCompleted: false },
  // Saturday
  { id: 601, day: 'Sat', time: '09:00 AM - 12:20 PM', subject: 'Mock Test', title: 'FULL LENGTH ALL INDIA MOCK TEST (720 Marks)', duration: 3.33, isCompleted: false },
  { id: 602, day: 'Sat', time: '02:30 PM - 05:30 PM', subject: 'Revision', title: 'Post-Test Detailed Mistake Analysis & Fixes', duration: 3.0, isCompleted: false },
  // Sunday
  { id: 701, day: 'Sun', time: '08:00 AM - 12:00 PM', subject: 'Revision', title: 'Weekly Backlog Clearance & Weak Topic Drills', duration: 4.0, isCompleted: false },
  { id: 702, day: 'Sun', time: '02:00 PM - 05:00 PM', subject: 'Revision', title: 'Formula Bank & Spaced Repetition Flashcards', duration: 3.0, isCompleted: false },
];

const TimetablePage: React.FC = () => {
  const [scheduleList, setScheduleList] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem('neet_custom_timetable');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return AIIMS_ROUTINE_PRESET;
  });

  const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>('Mon');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const { mode } = useAuth();

  // New Block Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<'Physics' | 'Chemistry' | 'Biology' | 'Mock Test' | 'Revision'>('Physics');
  const [newTimeSlot, setNewTimeSlot] = useState('06:00 AM - 08:30 AM');
  const [newDuration, setNewDuration] = useState(2.5);

  const saveSchedule = (newList: TimetableEntry[]) => {
    setScheduleList(newList);
    localStorage.setItem('neet_custom_timetable', JSON.stringify(newList));
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || mode === 'view') return;

    const newEntry: TimetableEntry = {
      id: Date.now(),
      day: selectedDay,
      subject: newSubject,
      title: newTitle.trim(),
      time: newTimeSlot,
      duration: newDuration,
      isCompleted: false,
    };

    saveSchedule([...scheduleList, newEntry]);
    setNewTitle('');
    setShowAddForm(false);
  };

  const handleUpdateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry || mode === 'view') return;

    const updated = scheduleList.map(item => item.id === editingEntry.id ? editingEntry : item);
    saveSchedule(updated);
    setEditingEntry(null);
  };

  const handleDeleteSlot = (id: number) => {
    if (mode === 'view') return;
    const updated = scheduleList.filter(item => item.id !== id);
    saveSchedule(updated);
  };

  const toggleComplete = (id: number) => {
    if (mode === 'view') return;
    const updated = scheduleList.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    saveSchedule(updated);
  };

  const handleApplyPreset = () => {
    if (window.confirm('Reset timetable to the 70h/Week AIIMS Topper Routine?')) {
      saveSchedule(AIIMS_ROUTINE_PRESET);
    }
  };

  const daySchedule = scheduleList.filter(item => item.day === selectedDay);
  const totalDayHours = Math.round(daySchedule.reduce((acc, item) => acc + (item.duration || 0), 0) * 10) / 10;
  const completedDayHours = Math.round(daySchedule.filter(i => i.isCompleted).reduce((acc, item) => acc + (item.duration || 0), 0) * 10) / 10;

  const getSubjectColor = (subject: TimetableEntry['subject']) => {
    switch (subject) {
      case 'Biology':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
        };
      case 'Chemistry':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400',
        };
      case 'Physics':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          dot: 'bg-cyan-400',
        };
      case 'Mock Test':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-400',
        };
      default:
        return {
          bg: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
          dot: 'bg-teal-400',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            Custom Study Routine
            <span className="text-xs px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" /> Fully Editable Schedule
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Edit your daily timetable, adjust time slots, check off completed sessions, and maintain study discipline.
          </p>
        </div>

        {mode === 'edit' && (
          <div className="flex gap-2">
            <button
              onClick={handleApplyPreset}
              className="px-4 py-2.5 rounded-2xl bg-[#0D131F] hover:bg-[#131B2B] text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> AIIMS Routine Preset
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? 'Cancel Slot' : '+ Add Study Block'}
            </button>
          </div>
        )}
      </div>

      {/* Add Slot Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddSlot} className="p-6 rounded-3xl bg-[#0D131F] border border-emerald-500/40 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <CalendarIcon className="w-5 h-5 text-emerald-400" /> Schedule Study Block for {selectedDay}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Task / Topic Description</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Organic Chemistry Mechanism Practice"
                    className="w-full px-4 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject Track</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mock Test">Mock Test</option>
                    <option value="Revision">Revision</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Time Range</label>
                  <input
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="e.g. 06:00 AM - 08:30 AM"
                    className="w-full px-4 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Duration (Hours)</label>
                  <input
                    type="number"
                    min={0.5}
                    max={8}
                    step={0.5}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Confirm Block
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day Selector Pills */}
      <div className="flex bg-[#0D131F] p-1.5 rounded-3xl border border-slate-800/80 justify-between gap-1 overflow-x-auto">
        {DAYS.map((day) => {
          const isAct = selectedDay === day;
          const count = scheduleList.filter(item => item.day === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={clsx(
                "flex-1 py-3 px-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 min-w-[75px]",
                isAct
                  ? "bg-[#131B2B] text-emerald-400 border border-emerald-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <span>{day}</span>
              <span className={clsx(
                "text-[10px] px-2 py-0.5 rounded-full font-bold",
                isAct ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Header & Summary */}
      <div className="p-5 rounded-3xl bg-[#0D131F] border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{selectedDay} Routine</span>
            <span className="text-xs text-slate-400 font-semibold">• {daySchedule.length} Study Blocks</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {completedDayHours} of {totalDayHours} Hours Completed ({totalDayHours ? Math.round((completedDayHours / totalDayHours) * 100) : 0}%)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400">Total Planned</div>
            <div className="text-lg font-black text-emerald-400">{totalDayHours} Hours</div>
          </div>
        </div>
      </div>

      {/* Day Schedule Timeline Blocks */}
      <div className="space-y-3">
        {daySchedule.length === 0 ? (
          <div className="text-center py-16 bg-[#0D131F] rounded-3xl border border-slate-800 p-6 space-y-2">
            <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No study blocks planned for {selectedDay}</h3>
            <p className="text-xs text-slate-400">Click '+ Add Study Block' to customize your schedule.</p>
          </div>
        ) : (
          daySchedule.map((entry) => {
            const subjectStyles = getSubjectColor(entry.subject);

            return (
              <div
                key={entry.id}
                className={clsx(
                  "p-5 rounded-3xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
                  entry.isCompleted
                    ? "bg-[#0A0E18] border-slate-800/60 opacity-65"
                    : "bg-[#0D131F] border-slate-800 hover:border-slate-700"
                )}
              >
                <div className="flex items-start sm:items-center gap-3.5 flex-1">
                  {/* Mark Done Button */}
                  {mode === 'edit' && (
                    <button
                      onClick={() => toggleComplete(entry.id)}
                      className={clsx(
                        "w-7 h-7 rounded-xl flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 border",
                        entry.isCompleted
                          ? "bg-emerald-500 text-black border-emerald-400"
                          : "bg-[#131B2B] text-transparent border-slate-700 hover:border-emerald-400"
                      )}
                      title="Toggle Completed"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={clsx("text-xs font-bold px-2.5 py-0.5 rounded-lg border", subjectStyles.bg)}>
                        {entry.subject}
                      </span>
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> {entry.time} ({entry.duration}h)
                      </span>
                    </div>

                    <h3 className={clsx(
                      "text-base font-bold mt-1.5 transition-all",
                      entry.isCompleted ? "line-through text-slate-400" : "text-white"
                    )}>
                      {entry.title}
                    </h3>
                  </div>
                </div>

                {/* Actions: Edit & Delete */}
                {mode === 'edit' && (
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setEditingEntry(entry)}
                      className="p-2 rounded-xl bg-[#131B2B] hover:bg-[#192338] text-slate-400 hover:text-white border border-slate-800 transition-colors"
                      title="Edit Block"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlot(entry.id)}
                      className="p-2 rounded-xl bg-[#131B2B] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                      title="Delete Block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Edit Slot Modal */}
      <AnimatePresence>
        {editingEntry && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full bg-[#0D131F] rounded-3xl border border-emerald-500/40 p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Edit Study Block</h3>
                <button onClick={() => setEditingEntry(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSlot} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Task Title</label>
                  <input
                    type="text"
                    required
                    value={editingEntry.title}
                    onChange={(e) => setEditingEntry({ ...editingEntry, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Subject</label>
                    <select
                      value={editingEntry.subject}
                      onChange={(e) => setEditingEntry({ ...editingEntry, subject: e.target.value as any })}
                      className="w-full px-3 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-white text-xs outline-none"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Mock Test">Mock Test</option>
                      <option value="Revision">Revision</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Duration (Hours)</label>
                    <input
                      type="number"
                      min={0.5}
                      max={8}
                      step={0.5}
                      value={editingEntry.duration}
                      onChange={(e) => setEditingEntry({ ...editingEntry, duration: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Time Range</label>
                  <input
                    type="text"
                    value={editingEntry.time}
                    onChange={(e) => setEditingEntry({ ...editingEntry, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#131B2B] border border-slate-700 rounded-2xl text-white text-sm outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingEntry(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20"
                  >
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

export default TimetablePage;
