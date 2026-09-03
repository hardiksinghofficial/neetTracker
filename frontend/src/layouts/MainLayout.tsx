import React, { useEffect, useState, useMemo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Clock, Calendar, FileText, RotateCcw, LogOut, Sun, Moon, Flame, Sparkles, Award, CheckSquare, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { safeStorage } from '../lib/storage';
import { healthAPI } from '../lib/api';
import clsx from 'clsx';

const MainLayout: React.FC = () => {
  const { mode, logout } = useAuth();
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true;
  });

  useEffect(() => {
    // Check backend health on mount
    healthAPI.check().then((res) => {
      setIsBackendConnected(res.connected);
    });
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const streakCount = useMemo(() => safeStorage.get<any[]>('neet_attendance_records', []).length, []);

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

          {/* Authenticated User Role Badge (Non-interactive) */}
          <div className="mt-4 p-3 w-full rounded-2xl bg-[#030304] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={clsx("w-2.5 h-2.5 rounded-full", mode === 'edit' ? "bg-indigo-400 animate-pulse" : "bg-emerald-400")} />
              <span className="text-xs font-bold text-slate-200">
                {mode === 'edit' ? '🎓 Akarsh (Student)' : '👨‍👩‍👦 Parent View'}
              </span>
            </div>
            <span className={clsx(
              "text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border",
              mode === 'edit' 
                ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30" 
                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
            )}>
              {mode === 'edit' ? 'Active' : 'Executive'}
            </span>
          </div>

          {/* Cloud Sync / DB Connection Indicator */}
          <div className="mt-2 px-3 py-1.5 rounded-xl bg-[#090A10] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={clsx("w-2 h-2 rounded-full", isBackendConnected === true ? "bg-emerald-400 animate-pulse" : isBackendConnected === false ? "bg-amber-400" : "bg-slate-500")} />
              <span className="text-[11px] font-semibold text-slate-300">
                {isBackendConnected === true ? 'Neon Cloud Sync' : isBackendConnected === false ? 'Local Safe Vault' : 'Checking Cloud...'}
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-500 uppercase">
              {isBackendConnected === true ? 'Connected' : 'Offline'}
            </span>
          </div>
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
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#030304] hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 text-xs font-bold transition-colors border border-white/5"
              title="Sign Out / Switch Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
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
            <span className="px-2.5 py-1 rounded-xl bg-[#030304] text-slate-300 text-xs font-bold border border-white/10">
              {mode === 'edit' ? '🎓 Akarsh' : '👨‍👩‍👦 Parent'}
            </span>
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-[#030304] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs border border-white/5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Page Outlet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
