const HISTORY_KEY = 'scamshield_analysis_history';
const PRIVACY_KEY = 'scamshield_privacy_enabled';
const STATS_KEY = 'scamshield_device_stats';

export function isHistoryEnabled() {
  const val = localStorage.getItem(PRIVACY_KEY);
  return val === null ? true : val === 'true';
}

export function setHistoryEnabled(enabled) {
  localStorage.setItem(PRIVACY_KEY, enabled ? 'true' : 'false');
  if (!enabled) {
    clearHistory();
  }
}

export function getLocalHistory() {
  if (!isHistoryEnabled()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveAnalysisToHistory(analysisRecord) {
  // If user opted out of saving history, skip
  if (!isHistoryEnabled()) return;

  try {
    const history = getLocalHistory();
    // Prepend new record, keep up to 25 items
    const updated = [analysisRecord, ...history.filter(item => item.id !== analysisRecord.id)].slice(0, 25);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    updateDeviceStats(analysisRecord);
  } catch (e) {
    console.error('Failed to save history locally:', e);
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function getDeviceStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return {
    totalAnalyzed: 0,
    highOrCriticalCount: 0,
    lowRiskCount: 0,
    averageRiskScore: 0
  };
}

function updateDeviceStats(newRecord) {
  try {
    const current = getDeviceStats();
    const newTotal = current.totalAnalyzed + 1;
    const isHighOrCrit = ['HIGH', 'CRITICAL'].includes(newRecord.risk_level);
    const isLow = newRecord.risk_level === 'LOW';

    const currentTotalScore = current.averageRiskScore * current.totalAnalyzed;
    const newAvg = Math.round((currentTotalScore + newRecord.risk_score) / newTotal);

    const updated = {
      totalAnalyzed: newTotal,
      highOrCriticalCount: current.highOrCriticalCount + (isHighOrCrit ? 1 : 0),
      lowRiskCount: current.lowRiskCount + (isLow ? 1 : 0),
      averageRiskScore: newAvg
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update device stats:', e);
  }
}

export function resetDeviceStats() {
  localStorage.removeItem(STATS_KEY);
}

