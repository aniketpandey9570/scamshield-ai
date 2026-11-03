import React from 'react';
import { Shield, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ onOpenAbout }) {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-base font-sans">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>ScamShield AI</span>
            </div>
            <p className="text-slate-400 max-w-md">
              "Think Before You Click." Analyze suspicious messages, uncover warning signs, and make safer decisions online.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium text-slate-300">
            <a href="#analyzer-section" className="hover:text-cyan-400 transition-colors">
              Analyzer
            </a>
            <a href="#safety-tips-section" className="hover:text-cyan-400 transition-colors">
              Safety Guidelines
            </a>
            <a href="#history-section" className="hover:text-cyan-400 transition-colors">
              Device History
            </a>
            <button onClick={onOpenAbout} className="hover:text-cyan-400 transition-colors">
              About Project
            </button>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline inline-flex items-center gap-1"
            >
              National Cyber Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Legal & Educational Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed space-y-1">
          <span className="font-bold text-slate-300 block uppercase tracking-wider text-[10px]">
            Academic Project & Decision-Support Disclaimer:
          </span>
          <p>
            ScamShield AI is an educational project and decision-support tool. It is not an official law-enforcement agency, commercial cyber-insurance service, or banking warranty.
            Analyses are probabilistic evaluations of language patterns and fraud heuristics and must not be treated as a legal guarantee that any communication is genuine or malicious.
            In case of actual monetary theft or account compromise, immediately dial the national cyber emergency helpline (1930 in India) or contact your banking branch.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} ScamShield AI — Built for College Technical Demonstration.
          </p>
          <p className="flex items-center gap-1">
            Engineered with React, Vite, Tailwind CSS & FastAPI.
          </p>
        </div>
      </div>
    </footer>
  );
}

