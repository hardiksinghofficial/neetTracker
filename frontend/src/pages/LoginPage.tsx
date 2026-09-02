import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { KeyRound, Eye, Zap, User, Users, Lock } from 'lucide-react';
import clsx from 'clsx';

const LoginPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'student' | 'parent'>('student');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) {
      setError(selectedTab === 'student' ? 'Please enter your password' : 'Please enter your parent PIN');
      return;
    }
    setError('');
    const targetMode = selectedTab === 'student' ? 'edit' : 'view';
    const success = await login(code, targetMode);
    if (!success) {
      setError('Incorrect access code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030304] text-slate-100 p-4 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-[#090A0F] rounded-3xl shadow-2xl overflow-hidden p-8 border border-white/5 relative z-10 space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-600/30 mb-4">
            ⚡
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            NEET TRACK <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">2027</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">
            Family Study & Academic Mastery Companion
          </p>
        </div>

        {/* Tab Switcher: Student vs Parent */}
        <div className="grid grid-cols-2 p-1 bg-[#030304] rounded-2xl border border-white/5 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => { setSelectedTab('student'); setError(''); setCode(''); }}
            className={clsx(
              "py-2.5 rounded-xl transition-all flex items-center justify-center gap-2",
              selectedTab === 'student'
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            )}
          >
            <User className="w-3.5 h-3.5" />
            <span>Akarsh (Student)</span>
          </button>
          <button
            type="button"
            onClick={() => { setSelectedTab('parent'); setError(''); setCode(''); }}
            className={clsx(
              "py-2.5 rounded-xl transition-all flex items-center justify-center gap-2",
              selectedTab === 'parent'
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Parent Mode</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {selectedTab === 'student' ? 'Student Password' : 'Parent Access PIN'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={selectedTab === 'student' ? 'Enter password' : 'Enter PIN'}
                className="block w-full pl-11 pr-4 py-3 bg-[#030304] border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 text-sm font-medium outline-none transition-all"
                autoFocus
              />
            </div>
            {error && <p className="mt-2 text-xs font-semibold text-rose-400 pl-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-95"
          >
            {selectedTab === 'student' ? (
              <>
                <Zap className="w-4 h-4 fill-current" /> Sign In as Akarsh Singh
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> Sign In to Parent View
              </>
            )}
          </button>
        </form>

        {/* Feature Highlights Footer */}
        <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-400">
          <div className="p-2 rounded-xl bg-[#030304] border border-white/5">
            📚 NCERT 79+ Ch.
          </div>
          <div className="p-2 rounded-xl bg-[#030304] border border-white/5">
            🏛️ 15 AIIMS & MP
          </div>
          <div className="p-2 rounded-xl bg-[#030304] border border-white/5">
            ⚡ 720 Tests
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
