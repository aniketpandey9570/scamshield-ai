import React from 'react';
import { History, Trash2, ArrowUpRight, ShieldCheck, ShieldAlert, AlertTriangle, EyeOff, Shield } from 'lucide-react';

export default function HistorySection({
  history = [],
  onSelectHistoryItem,
  onClearHistory,
  historyEnabled,
  onToggleHistoryEnabled
}) {
  const getBadge = (lvl) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'text-rose-300 bg-rose-950/80 border-rose-500/40';
      case 'HIGH':
        return 'text-orange-300 bg-orange-950/80 border-orange-500/40';
      case 'MEDIUM':
        return 'text-amber-300 bg-amber-950/80 border-amber-500/40';
      case 'LOW':
      default:
        return 'text-emerald-300 bg-emerald-950/80 border-emerald-500/40';
    }
  };

  return (
    <div id="history-section" className="scroll-mt-24 mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
            <History className="w-5 h-5 text-cyan-400" />
            Recent Device Analysis History
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Saved exclusively inside your browser's local storage. Not sent to any external server.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Privacy Switch: Enable / Disable Local History */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={historyEnabled}
              onChange={(e) => onToggleHistoryEnabled(e.target.checked)}
              className="rounded bg-slate-900 border-slate-600 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Store history on this device</span>
          </label>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 text-xs font-medium border border-slate-700 transition-all"
              title="Permanently remove all local history records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {!historyEnabled ? (
        <div className="p-8 text-center rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
          <EyeOff className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-300">Local History is Disabled</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You have selected maximum privacy mode. No past message snippets or risk assessments are being retained on this browser.
          </p>
        </div>
      ) : history.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
          <Shield className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-300">No Past Analyses Recorded Yet</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When you evaluate a suspicious SMS, email, or chat, your private local assessment record will appear here for easy comparison.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadge(item.risk_level)}`}>
                    {item.risk_level} ({item.risk_score}/100)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {item.analyzed_at ? new Date(item.analyzed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {item.message_type}
                </div>

                <p className="text-xs text-slate-400 font-mono line-clamp-3 leading-relaxed">
                  "{item.message}"
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 group-hover:text-cyan-300 font-medium">
                <span>Reopen Result</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

