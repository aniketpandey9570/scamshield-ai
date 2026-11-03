import React from 'react';
import { X, ShieldCheck, Cpu, Brain, Lock, ExternalLink, Award } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Award className="w-3.5 h-3.5" />
            Academic Capstone & Demonstration
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            About ScamShield AI
          </h2>
          <p className="text-sm text-slate-400">
            An explainable decision-support assistant designed to combat digital social engineering and financial fraud.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Cpu className="w-4 h-4" />
              Dual-Engine Intelligent Architecture
            </div>
            <p className="text-xs text-slate-400">
              ScamShield AI utilizes a resilient dual-tier architecture. If an AI API key is configured in the environment, modern LLMs provide semantic nuance. If no key is set or the network is offline, ScamShield seamlessly falls back to an expert-crafted deterministic heuristic engine that evaluates urgency tactics, credential harvesting, upfront fee demands, and deceptive domain patterns.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Lock className="w-4 h-4" />
              Privacy-First & Zero Server Retention
            </div>
            <p className="text-xs text-slate-400">
              User privacy is paramount. Submitted messages are never stored in a backend database or retained in persistent server logs. Analysis history and metrics are stored strictly inside your browser's local storage and can be completely wiped with a single click.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-violet-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              Ethical & Explainable AI Standards
            </div>
            <p className="text-xs text-slate-400">
              Unlike opaque black-box classifiers, ScamShield AI extracts exact verbatim evidence quotes from the submitted message and explains *why* each phrase is suspicious. It delivers a calibrated risk score (1–100) and actionable safety steps rather than making false claims of absolute mathematical certainty.
            </p>
          </div>
        </div>

        {/* Presentation Note */}
        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 space-y-1">
          <span className="font-bold block">Demonstration Ready:</span>
          <p className="text-slate-300">
            Created for collegiate demonstration. Test it live using any of the built-in demo scenarios (fake bank KYC, job recruitment fee, lottery shipping scam, tech support trojan, or legitimate delivery alert).
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

