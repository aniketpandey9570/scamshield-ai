import React from 'react';
import { Shield, ArrowDown, Zap, Search, Lock, AlertTriangle } from 'lucide-react';

export default function Hero({ onScrollToAnalyzer }) {
  return (
    <section className="relative pt-12 pb-16 text-center space-y-8 overflow-hidden">
      {/* Decorative Radial Background Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-violet-500/5 blur-3xl -z-10 rounded-full pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/90 border border-cyan-500/30 text-cyan-400 shadow-md shadow-cyan-950/40">
        <Shield className="w-3.5 h-3.5 text-cyan-400" />
        <span>Cybersecurity Decision-Support Engine</span>
      </div>

      {/* Main Heading */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          One Message Can Change Everything.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
            Check Before You Trust.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          ScamShield AI inspects SMS texts, WhatsApp messages, urgent job offers, and payment links.
          Uncover hidden social engineering tricks and protect your finances in seconds.
        </p>
      </div>

      {/* CTA Button */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={onScrollToAnalyzer}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm tracking-wide shadow-xl shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer group"
        >
          <span>Analyze a Message Now</span>
          <ArrowDown className="w-4 h-4 text-slate-950 transition-transform group-hover:translate-y-0.5" />
        </button>

        <a
          href="#safety-tips-section"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm border border-slate-800 transition-colors"
        >
          <span>Safety Guidelines</span>
        </a>
      </div>

      {/* 3 Feature Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Analysis</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Dual heuristic & AI detection in seconds</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explainable Results</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Exact evidence quotes & reasons why</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Privacy First</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Zero cloud logs or message storage</p>
          </div>
        </div>
      </div>
    </section>
  );
}

