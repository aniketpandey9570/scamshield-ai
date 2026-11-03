import React from 'react';

export default function RiskGauge({ score = 10, riskLevel = 'LOW' }) {
  // Angle range: -180 deg to 0 deg (180 deg semicircle)
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));
  // Needle angle from -90 to +90 degrees
  const needleAngle = -90 + (clampedScore / 100) * 180;

  const getColor = (lvl) => {
    switch (lvl) {
      case 'CRITICAL':
        return '#f43f5e'; // rose-500
      case 'HIGH':
        return '#f97316'; // orange-500
      case 'MEDIUM':
        return '#f59e0b'; // amber-500
      case 'LOW':
      default:
        return '#10b981'; // emerald-500
    }
  };

  const activeColor = getColor(riskLevel);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
      <div className="relative w-48 h-28 flex items-end justify-center">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Active colored gradient arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * (clampedScore / 100))}
            className="transition-all duration-1000 ease-out"
          />

          {/* Ticks */}
          <text x="14" y="108" fill="#64748b" fontSize="9" fontWeight="600" textAnchor="middle">0</text>
          <text x="60" y="38" fill="#64748b" fontSize="9" fontWeight="600" textAnchor="middle">25</text>
          <text x="100" y="24" fill="#64748b" fontSize="9" fontWeight="600" textAnchor="middle">50</text>
          <text x="140" y="38" fill="#64748b" fontSize="9" fontWeight="600" textAnchor="middle">75</text>
          <text x="186" y="108" fill="#64748b" fontSize="9" fontWeight="600" textAnchor="middle">100</text>

          {/* Needle pivot and pointer */}
          <g transform={`rotate(${needleAngle} 100 100)`} className="transition-transform duration-1000 ease-out">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke={activeColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#needleGlow)"
            />
            <circle cx="100" cy="100" r="7" fill="#0f172a" stroke={activeColor} strokeWidth="3" />
            <circle cx="100" cy="100" r="3" fill="#ffffff" />
          </g>
        </svg>
      </div>

      <div className="mt-2 text-center">
        <div className="text-3xl font-extrabold tracking-tight" style={{ color: activeColor }}>
          {clampedScore}
          <span className="text-sm font-medium text-slate-400 ml-1">/ 100</span>
        </div>
        <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-0.5">
          Risk Index
        </div>
      </div>
    </div>
  );
}

