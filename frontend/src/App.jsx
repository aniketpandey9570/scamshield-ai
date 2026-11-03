import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Analyzer from './components/Analyzer';
import ResultCard from './components/ResultCard';
import DeviceStats from './components/DeviceStats';
import HistorySection from './components/HistorySection';
import SafetyTips from './components/SafetyTips';
import AboutModal from './components/AboutModal';
import Toast from './components/Toast';
import Footer from './components/Footer';

import { checkHealth, fetchSamples, analyzeMessage } from './services/api';
import {
  getLocalHistory,
  saveAnalysisToHistory,
  clearHistory,
  isHistoryEnabled,
  setHistoryEnabled,
  getDeviceStats
} from './utils/storage';

export default function App() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('SMS');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [submittedMessageType, setSubmittedMessageType] = useState('SMS');
  const [image, setImage] = useState(null);
  const [submittedImage, setSubmittedImage] = useState(null);

  const [health, setHealth] = useState(null);
  const [samples, setSamples] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyEnabled, setHistoryEnabledState] = useState(true);
  const [deviceStats, setDeviceStats] = useState({
    totalAnalyzed: 0,
    highOrCriticalCount: 0,
    lowRiskCount: 0,
    averageRiskScore: 0
  });

  const [toast, setToast] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const inputRef = useRef(null);
  const resultRef = useRef(null);

  // Initial load
  useEffect(() => {
    // 1. Health check
    checkHealth().then(data => setHealth(data));

    // 2. Fetch demo samples
    fetchSamples().then(data => setSamples(data));

    // 3. Load local storage states
    setHistoryEnabledState(isHistoryEnabled());
    setHistory(getLocalHistory());
    setDeviceStats(getDeviceStats());
  }, []);

  const showToast = (msg, type = 'info') => {
    setToast({ message: msg, type });
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const data = await analyzeMessage(message, messageType, image?.base64);
      setResult(data);
      setSubmittedMessage(message);
      setSubmittedMessageType(messageType);
      setSubmittedImage(image);

      // Save to local history & update stats
      const historyRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        message: message.trim() || (image ? `[Screenshot: ${image.name}]` : 'Visual inspection'),
        message_type: messageType,
        risk_level: data.risk_level,
        risk_score: data.risk_score,
        analyzed_at: data.analyzed_at || new Date().toISOString(),
        has_image: Boolean(image),
        full_result: data
      };

      saveAnalysisToHistory(historyRecord);
      setHistory(getLocalHistory());
      setDeviceStats(getDeviceStats());

      showToast(`Scan complete: ${data.risk_level} risk detected (${data.risk_score}/100)`, 'success');

      // Scroll smoothly to results
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      showToast(err.message || 'Error executing message analysis', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample) => {
    setMessage(sample.content);
    setMessageType(sample.message_type);
    showToast(`Loaded sample: "${sample.title}"`, 'info');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    setMessage('');
    setImage(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleResetAnalysis = () => {
    setResult(null);
    setSubmittedImage(null);
    handleClear();
    const analyzerEl = document.getElementById('analyzer-section');
    if (analyzerEl) {
      analyzerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectHistoryItem = (item) => {
    setMessage(item.message);
    setMessageType(item.message_type);
    setSubmittedMessage(item.message);
    setSubmittedMessageType(item.message_type);
    setResult(item.full_result || {
      risk_level: item.risk_level,
      risk_score: item.risk_score,
      summary: "Restored from local browser history.",
      findings: [],
      recommended_actions: ["Review previously flagged points."],
      analysis_method: "RESTORED",
      limitations: "Loaded from local storage cache."
    });
    showToast(`Restored past analysis from ${item.message_type}`, 'info');
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    showToast('Local browser history cleared', 'info');
  };

  const handleToggleHistoryEnabled = (enabled) => {
    setHistoryEnabled(enabled);
    setHistoryEnabledState(enabled);
    if (!enabled) {
      setHistory([]);
      showToast('History disabled & wiped for privacy', 'info');
    } else {
      showToast('Local history enabled', 'info');
    }
  };

  const handleNavigate = (target) => {
    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'analyzer') {
      document.getElementById('analyzer-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'safety') {
      document.getElementById('safety-tips-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'history') {
      document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Toast Notification Container */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Navigation Bar */}
      <Navbar
        health={health}
        onOpenAbout={() => setIsAboutOpen(true)}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Section */}
        <Hero
          onScrollToAnalyzer={() => handleNavigate('analyzer')}
        />

        {/* Analyzer Card */}
        <Analyzer
          message={message}
          setMessage={setMessage}
          messageType={messageType}
          setMessageType={setMessageType}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          samples={samples}
          onSelectSample={handleSelectSample}
          onClear={handleClear}
          inputRef={inputRef}
          image={image}
          setImage={setImage}
        />

        {/* Results Panel */}
        <div ref={resultRef}>
          {result && (
            <ResultCard
              result={result}
              submittedMessage={submittedMessage}
              messageType={submittedMessageType}
              submittedImage={submittedImage}
              onReset={handleResetAnalysis}
              onShowToast={showToast}
            />
          )}
        </div>

        {/* Local Device Stats */}
        <DeviceStats
          stats={deviceStats}
          historyCount={history.length}
        />

        {/* Local History Section */}
        <HistorySection
          history={history}
          onSelectHistoryItem={handleSelectHistoryItem}
          onClearHistory={handleClearHistory}
          historyEnabled={historyEnabled}
          onToggleHistoryEnabled={handleToggleHistoryEnabled}
        />

        {/* Safety Guidelines & Incident Emergency Help */}
        <SafetyTips />
      </main>

      {/* About Project Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
      />
    </div>
  );
}

