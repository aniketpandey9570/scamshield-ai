import React, { useState } from 'react';
import { Eye, ShieldAlert, Sparkles } from 'lucide-react';

export default function ComparisonView({ message, findings = [] }) {
  const [selectedFinding, setSelectedFinding] = useState(null);

  if (!message) return null;

  // Function to render text with highlighted finding evidences
  // We extract keywords/phrases from findings evidence
  const renderHighlightedMessage = () => {
    if (!findings || findings.length === 0) {
      return <p className="text-slate-300 leading-relaxed font-mono text-sm whitespace-pre-wrap">{message}</p>;
    }

    // Clean evidence strings (remove leading/trailing '...' if present)
    const highlightTargets = findings.map(f => {
      let phrase = f.evidence.replace(/^\.\.\.|\.\.\.$/g, '').trim();
      return {
        raw: phrase,
        finding: f
      };
    }).filter(t => t.raw.length > 3);

    // If no clean phrases could be extracted, return plain
    if (highlightTargets.length === 0) {
      return <p className="text-slate-300 leading-relaxed font-mono text-sm whitespace-pre-wrap">{message}</p>;
    }

    // Split text based on first matching evidence
    let parts = [{ text: message, highlight: null }];

    highlightTargets.forEach(target => {
      let nextParts = [];
      parts.forEach(part => {
        if (part.highlight) {
          nextParts.push(part);
          return;
        }

        const idx = part.text.toLowerCase().indexOf(target.raw.toLowerCase());
        if (idx !== -1) {
          const before = part.text.substring(0, idx);
          const match = part.text.substring(idx, idx + target.raw.length);
          const after = part.text.substring(idx + target.raw.length);

          if (before) nextParts.push({ text: before, highlight: null });
          nextParts.push({ text: match, highlight: target.finding });
          if (after) nextParts.push({ text: after, highlight: null });
        } else {
          nextParts.push(part);
        }
      });
      parts = nextParts;
    });

    return (
      <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
        {parts.map((p, idx) => {
          if (!p.highlight) {
            return <span key={idx}>{p.text}</span>;
          }

          const sevColors = {
            HIGH: 'bg-rose-500/25 text-rose-200 border-b-2 border-rose-500 hover:bg-rose-500/40',
            MEDIUM: 'bg-amber-500/25 text-amber-200 border-b-2 border-amber-500 hover:bg-amber-500/40',
            LOW: 'bg-emerald-500/25 text-emerald-200 border-b-2 border-emerald-500 hover:bg-emerald-500/40'
          };

          const isSelected = selectedFinding?.title === p.highlight.title;

          return (
            <mark
              key={idx}
              onClick={() => setSelectedFinding(p.highlight)}
              title={`Click to view reason: ${p.highlight.title}`}
              className={`cursor-pointer px-1 py-0.5 rounded transition-all duration-150 inline-block mx-0.5 font-medium ${sevColors[p.highlight.severity] || sevColors.MEDIUM} ${isSelected ? 'ring-2 ring-cyan-400 font-bold' : ''}`}
            >
              {p.text}
            </mark>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Interactive Evidence Inspector
          </h4>
        </div>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Click highlighted text to inspect finding
        </span>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 max-h-64 overflow-y-auto">
        {renderHighlightedMessage()}
      </div>

      {selectedFinding && (
        <div className="mt-3 p-3 rounded-xl bg-slate-800/80 border border-cyan-500/30 flex items-start gap-3 animate-fadeIn">
          <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-cyan-300">{selectedFinding.title}</span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-200">
              {selectedFinding.severity}
            </span>
            <p className="text-slate-300 mt-1 leading-normal">{selectedFinding.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

