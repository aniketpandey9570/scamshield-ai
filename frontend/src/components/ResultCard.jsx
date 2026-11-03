import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Download,
  Info,
  CheckCircle,
  Cpu,
  Brain,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import RiskGauge from './RiskGauge';
import ComparisonView from './ComparisonView';
import { copyReportToClipboard, downloadReportAsFile } from '../utils/exportReport';

export default function ResultCard({
  result,
  submittedMessage,
  messageType,
  submittedImage,
  onReset,
  onShowToast
}) {
  const [showComparison, setShowComparison] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  if (!result) return null;

  const handleCopy = async () => {
    try {
      await copyReportToClipboard(result, submittedMessage, messageType);
      setCopied(true);
      if (onShowToast) onShowToast("Analysis report copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      if (onShowToast) onShowToast("Failed to copy report", "error");
    }
  };

  const handleDownload = () => {
    try {
      downloadReportAsFile(result, submittedMessage, messageType);
      if (onShowToast) onShowToast("Report downloaded successfully!", "success");
    } catch (e) {
      if (onShowToast) onShowToast("Failed to download report", "error");
    }
  };

  // Visual treatments per spec:
  // LOW: subtle green, MEDIUM: amber, HIGH: orange, CRITICAL: red
  const riskThemes = {
    LOW: {
      badgeBg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
      glow: 'shadow-emerald-950/20',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      accent: 'text-emerald-400',
      headerGradient: 'from-emerald-900/20 to-transparent'
    },
    MEDIUM: {
      badgeBg: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
      glow: 'shadow-amber-950/20',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      accent: 'text-amber-400',
      headerGradient: 'from-amber-900/20 to-transparent'
    },
    HIGH: {
      badgeBg: 'bg-orange-950/70 border-orange-500/40 text-orange-300',
      glow: 'shadow-orange-950/20',
      icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
      accent: 'text-orange-400',
      headerGradient: 'from-orange-900/20 to-transparent'
    },
    CRITICAL: {
      badgeBg: 'bg-rose-950/70 border-rose-500/40 text-rose-300',
      glow: 'shadow-rose-950/30',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      accent: 'text-rose-400',
      headerGradient: 'from-rose-900/25 to-transparent'
    }
  };

  const currentTheme = riskThemes[result.risk_level] || riskThemes.LOW;

  return (
    <div className={`mt-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden ${currentTheme.glow}`}>
      {/* Top Banner with Risk Level and Action Buttons */}
      <div className={`p-6 sm:p-8 bg-gradient-to-r ${currentTheme.headerGradient} border-b border-slate-800/80`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Risk Level Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold tracking-wide uppercase ${currentTheme.badgeBg}`}>
                {currentTheme.icon}
                <span>{result.risk_level} RISK LEVEL</span>
              </div>

              {/* Engine Badge: Clearly labels AI vs Rule-Based */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                {result.analysis_method === 'AI' ? (
                  <>
                    <Brain className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Model ({result.model_name || 'Gemini'})</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Rule-Based Heuristic Engine</span>
                  </>
                )}
              </div>

              <span className="text-xs text-slate-400 px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700/50">
                Channel: {messageType}
              </span>

              {(submittedImage || result.has_image) && (
                <button
                  type="button"
                  onClick={() => setShowImagePreview(!showImagePreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-950/70 border border-violet-500/40 text-violet-300 hover:bg-violet-900/60 transition-colors"
                >
                  <span>📷 Screenshot Analyzed</span>
                </button>
              )}
            </div>

            {showImagePreview && submittedImage?.base64 && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-violet-500/30 max-w-sm">
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Attached Screenshot:</span>
                  <span className="text-slate-500">{submittedImage.name}</span>
                </div>
                <img
                  src={submittedImage.base64}
                  alt="Analyzed screenshot"
                  className="rounded-xl max-h-48 w-full object-contain bg-slate-900"
                />
              </div>
            )}

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {result.summary}
            </h3>
          </div>

          {/* Risk Gauge Visual Widget */}
          <div className="shrink-0 flex items-center justify-center">
            <RiskGauge score={result.risk_score} riskLevel={result.risk_level} />
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Warning Signs & Evidence List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className={`w-5 h-5 ${currentTheme.accent}`} />
              Detected Warning Signs ({result.findings.length})
            </h4>
            {result.findings.length > 0 && (
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                {showComparison ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showComparison ? 'Hide Evidence View' : 'Show Evidence View'}
              </button>
            )}
          </div>

          {result.findings.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-slate-200">No Obvious Warning Signs Detected</h5>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  No recognizable social engineering threats, credential requests, or coercive pressure tactics were identified in this sample.
                  However, sophisticated scams can closely mirror authentic communications. Always cross-check requests before taking action.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {result.findings.map((finding, idx) => {
                const sevBadge = {
                  HIGH: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
                  MEDIUM: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
                  LOW: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                }[finding.severity] || 'bg-slate-800 text-slate-300 border-slate-700';

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/60 transition-colors border border-slate-800/90 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-700/80 text-xs font-bold flex items-center justify-center text-slate-300">
                          {idx + 1}
                        </span>
                        <h5 className="font-semibold text-slate-100 text-base">
                          {finding.title}
                        </h5>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${sevBadge}`}>
                        {finding.severity} SEVERITY
                      </span>
                    </div>

                    {finding.evidence && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-amber-300/90 leading-relaxed">
                        <span className="text-slate-500 select-none block mb-1 uppercase text-[10px] tracking-wider font-sans font-bold">
                          Quoted Evidence:
                        </span>
                        "{finding.evidence}"
                      </div>
                    )}

                    <div className="text-sm text-slate-300 leading-relaxed flex items-start gap-2 pt-1">
                      <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-200">Why was this flagged? </span>
                        <span>{finding.explanation}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive Comparison View */}
          {showComparison && result.findings.length > 0 && (
            <ComparisonView message={submittedMessage} findings={result.findings} />
          )}
        </div>

        {/* Recommended Actions: "What should you do next?" */}
        <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-cyan-400" />
            What Should You Do Next? (Safer Action Plan)
          </h4>
          <ul className="space-y-3">
            {result.recommended_actions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-200 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Toolbar: Copy, Download, Reset */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 active:scale-95 shadow-sm"
              title="Copy analysis report as formatted Markdown"
            >
              <Copy className="w-4 h-4 text-cyan-400" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Report'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 active:scale-95 shadow-sm"
              title="Download text report file"
            >
              <Download className="w-4 h-4 text-violet-400" />
              <span>Download Report (.txt)</span>
            </button>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analyze Another Message</span>
          </button>
        </div>

        {/* Limitations & Uncertainty Notice */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-1.5">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Decision-Support Notice & Confidence Boundaries:
          </div>
          <p>{result.limitations}</p>
          <p className="text-slate-500 text-[11px] pt-1">
            ScamShield AI does not verify real-time bank databases, identity records, or active domain servers.
            Do not use as sole evidence in formal legal or financial disputes.
          </p>
        </div>
      </div>
    </div>
  );
}

