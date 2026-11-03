import React from 'react';
import { ShieldCheck, ShieldAlert, BarChart3, HardDrive } from 'lucide-react';

export default function DeviceStats({ stats, historyCount }) {
  return (
    <div className="mt-8 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 text-slate-300">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Local Device Activity Metrics
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50">
          Private to your browser session (zero cloud tracking)
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            Total Analyzed
          </div>
          <div className="text-2xl font-black text-white">
            {stats.totalAnalyzed || 0}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">On this browser</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-xs text-rose-400/90 flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            High / Critical
          </div>
          <div className="text-2xl font-black text-rose-400">
            {stats.highOrCriticalCount || 0}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">High threat signals</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-xs text-emerald-400/90 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Low Risk Verified
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {stats.lowRiskCount || 0}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">No red flags detected</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-xs text-violet-400/90 flex items-center gap-1.5 mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
            Average Risk Index
          </div>
          <div className="text-2xl font-black text-violet-300">
            {stats.averageRiskScore || 0}
            <span className="text-xs font-normal text-slate-500 ml-1">/ 100</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Weighted device score</div>
        </div>
      </div>
    </div>
  );
}

