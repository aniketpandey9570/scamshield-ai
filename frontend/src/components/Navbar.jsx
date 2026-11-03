import React from 'react';
import { Shield, Lock, Activity, Sparkles } from 'lucide-react';

export default function Navbar({
  health,
  onOpenAbout,
  onNavigate
}) {
  const isHealthy = health?.status === 'healthy';
  const isAIMode = health?.analysis_mode === 'AI';

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white font-sans">
                ScamShield<span className="text-cyan-400">.AI</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Think Before You Click
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-cyan-400 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('analyzer')}
            className="hover:text-cyan-400 transition-colors"
          >
            Analyze Message
          </button>
          <button
            onClick={() => onNavigate('safety')}
            className="hover:text-cyan-400 transition-colors"
          >
            Safety Tips
          </button>
          <button
            onClick={() => onNavigate('history')}
            className="hover:text-cyan-400 transition-colors"
          >
            History
          </button>
          <button
            onClick={onOpenAbout}
            className="hover:text-cyan-400 transition-colors"
          >
            About
          </button>
        </nav>

        {/* Status Pill & Privacy First Badge */}
        <div className="flex items-center gap-3">
          {/* Privacy First Badge */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 border border-emerald-500/30 text-emerald-300"
            title="All analysis data remains private. Zero server message logging or persistent cloud storage."
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privacy First</span>
          </div>

          {/* Backend Health Status Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800"
            title={`Status: ${health?.status || 'checking'}, Engine: ${health?.model_name || 'Standard'}`}
          >
            <span className="relative flex h-2 w-2">
              {isHealthy ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              )}
            </span>
            <span className="text-[11px] text-slate-300 hidden sm:inline">
              {isHealthy ? (isAIMode ? 'AI Model Active' : 'Heuristic Engine') : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

