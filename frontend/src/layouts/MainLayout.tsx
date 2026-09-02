import React, { useEffect, useState, useRef, useMemo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Clock, Calendar, FileText, RotateCcw, LogOut, Sun, Moon, Flame, Sparkles, Award, CheckSquare, TrendingUp, Download, Upload, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { STUDY_ANALYTICS } from '../data/mockData';
import { safeStorage } from '../lib/storage';
import clsx from 'clsx';

const MainLayout: React.FC = () => {
  const { mode, toggleMode, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const [showResetModal, setShowResetModal] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const streakCount = useMemo(() => safeStorage.get<any[]>('neet_attendance_records', []).length, []);

  const handleResetAllData = () => {
    safeStorage.resetAllToCleanSlate();
    window.location.href = '/';
  };

  const handleExportData = () => {
    safeStorage.exportBackup();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = safeStorage.importBackup(content);
        if (success) {
          setImportStatus('Backup restored successfully!');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          setImportStatus('Invalid backup file. Please choose a valid JSON file.');
        }
      }
    };
    reader.readAsText(file);
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, badge: null },
    { name: 'NCERT Checklist', path: '/ncert-checklist', icon: CheckSquare, badge: '11 & 12' },
    { name: 'Rank Predictor', path: '/rank-predictor', icon: TrendingUp, badge: 'UR / MP' },
    { name: 'Syllabus', path: '/syllabus', icon: BookOpen, badge: 'Rating' },
    { name: 'Study Notes', path: '/notes', icon: FileText, badge: 'NCERT' },
    { name: 'Daily Log', path: '/daily-log', icon: Clock, badge: 'Live' },
    { name: 'Timetable', path: '/timetable', icon: Calendar, badge: null },
    { name: 'Tests & Errors', path: '/tests', icon: Award, badge: '720' },
    { name: 'Revision Deck', path: '/revision', icon: RotateCcw, badge: 'Deck' },
  ];

  return (
    <div className="flex h-screen bg-[#030304] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Desktop/Tablet */}
      <aside className="hidden md:flex w-72 flex-col bg-[#090A0F] border-r border-white/5 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                  NEET Track
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    2027
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Family Study Companion</p>
              </div>
            </div>
          </div>

          {/* Interactive User Mode Switcher Pill */}
          <button
            type="button"
            onClick={toggleMode}
            title="Click to toggle between Student and Parent View"
            className="mt-4 p-3 w-full rounded-2xl bg-[#030304] hover:bg-[#10131E] border border-white/5 hover:border-indigo-500/40 flex items-center justify-between transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2">
              <div className={clsx("w-2.5 h-2.5 rounded-full", mode === 'edit' ? "bg-indigo-400 animate-pulse" : "bg-emerald-400")} />
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                {mode === 'edit' ? 'Akarsh (Student)' : 'Parent View'}
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#12141D] text-indigo-300 border border-indigo-500/30">
              {mode === 'edit' ? 'Switch Mode' : 'Switch Mode'}
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-150 group",
                  isActive
                    ? "bg-[#141824] text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0E1017]"
                )
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#161A28] text-slate-300 border border-white/5">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#030304] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>{streakCount} Day Streak</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{streakCount * 50} XP</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl bg-[#030304] hover:bg-[#12141D] text-slate-400 hover:text-white transition-colors border border-white/5"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowResetModal(true)}
              className="p-2.5 rounded-xl bg-[#030304] hover:bg-amber-950/40 text-slate-400 hover:text-amber-400 transition-colors border border-white/5"
              title="Reset all study tracker data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#030304] hover:bg-[#12141D] text-indigo-300 text-xs font-bold transition-colors border border-white/5"
              title="Switch between Student and Parent view"
            >
              <span>{mode === 'edit' ? '👨‍👩‍👦 Parent' : '🎓 Akarsh'}</span>
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-xl bg-[#030304] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors border border-white/5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#030304]">
        {/* Top bar for mobile/tablets */}
        <header className="md:hidden p-4 bg-[#090A0F] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">
              N
            </div>
            <span className="font-extrabold text-sm text-white">NEET Track 2027</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              className="px-2.5 py-1.5 rounded-xl bg-[#030304] text-indigo-300 text-xs font-bold border border-indigo-500/30"
            >
              {mode === 'edit' ? '👨‍👩‍👦 Parent' : '🎓 Akarsh'}
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              className="p-2 rounded-xl bg-[#030304] text-indigo-400 text-xs border border-white/5"
              title="Data Vault & Backup"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Page Outlet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Data Backup & Reset Management Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#090A0F] rounded-3xl border border-indigo-500/40 p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Study Data & Backup Vault</h3>
                  <p className="text-xs text-slate-400">Never lose your study notes, streak, or checklist progress.</p>
                </div>
              </div>
              <button
                onClick={() => { setShowResetModal(false); setImportStatus(null); }}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            {importStatus && (
              <div className={clsx(
                "p-3 rounded-2xl text-xs font-bold border flex items-center gap-2",
                importStatus.includes('successfully')
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/40"
                  : "bg-rose-950/40 text-rose-300 border-rose-500/40"
              )}>
                <span>{importStatus}</span>
              </div>
            )}

            {/* 1. Backup & Restore Section */}
            <div className="p-4 rounded-2xl bg-[#030304] border border-white/5 space-y-3">
              <div className="text-xs font-extrabold text-slate-200">📦 Save & Restore Your Progress</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Export a full JSON backup to save on your Google Drive, computer, or Realme tablet. You can restore it anytime on any device.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                >
                  <Download className="w-3.5 h-3.5" /> Export Backup (.json)
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#090A0F] hover:bg-[#12141D] text-slate-200 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-400" /> Restore from File
                </button>
              </div>
            </div>

            {/* 2. Reset All Data Section */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <div className="text-xs font-extrabold text-rose-400 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Clean Slate / Reset All Tracker Data
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Resets active days, ticks, and attendance to a fresh 100% clean state for starting your new NEET 2027 run.
              </p>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleResetAllData}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/20"
                >
                  Yes, Reset to Clean Slate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
