import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Send,
  Trash2,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Mail,
  Smartphone,
  Briefcase,
  ShoppingBag,
  HelpCircle,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  FileText,
  Upload,
  X,
  Camera
} from 'lucide-react';

const MESSAGE_TYPES = [
  { value: 'SMS', label: 'SMS / Text Message', icon: Smartphone },
  { value: 'Email', label: 'Email Communication', icon: Mail },
  { value: 'WhatsApp Message', label: 'WhatsApp / Chat App', icon: MessageSquare },
  { value: 'Job or Internship Offer', label: 'Job or Internship Offer', icon: Briefcase },
  { value: 'Shopping or Payment Offer', label: 'Shopping / Payment Offer', icon: ShoppingBag },
  { value: 'Other', label: 'Other / Social Media', icon: HelpCircle }
];

// Helper to generate a realistic demo screenshot image using HTML5 Canvas
function generateSampleScreenshot(title, alertText) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');

  // Background phone screen
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 600, 360);

  // Status bar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 600, 40);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px Inter, sans-serif';
  ctx.fillText('9:41 AM  •  5G LTE', 20, 25);
  ctx.fillText('🔋 88%', 530, 25);

  // Card bubble
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(30, 65, 540, 260, 16);
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Header banner
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(30, 65, 540, 45, [16, 16, 0, 0]);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px Inter, sans-serif';
  ctx.fillText(`🚨 ${title.toUpperCase()}`, 50, 93);

  // Body text
  ctx.fillStyle = '#f8fafc';
  ctx.font = '14px Inter, sans-serif';

  // Word wrap
  const words = alertText.split(' ');
  let line = '';
  let y = 145;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 480 && n > 0) {
      ctx.fillText(line, 50, y);
      line = words[n] + ' ';
      y += 24;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 50, y);

  // Timestamp
  ctx.fillStyle = '#64748b';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Received today at 9:40 AM • Unverified Sender', 50, 300);

  return canvas.toDataURL('image/png');
}

export default function Analyzer({
  message,
  setMessage,
  messageType,
  setMessageType,
  onAnalyze,
  isLoading,
  samples = [],
  onSelectSample,
  onClear,
  inputRef,
  image,
  setImage
}) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'image'
  const [validationError, setValidationError] = useState('');
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const loadingSteps = [
    "Analyzing semantic structure & syntax...",
    "Scanning for credential harvesting & OTP requests...",
    "Evaluating urgency & coercive intimidation tactics...",
    "Checking advance-fee & unrealistic compensation lures...",
    "Formulating explainable risk assessment..."
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex(prev => (prev + 1) % loadingSteps.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const charCount = message.length;
  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
  const isNearLimit = charCount > 8000;
  const isOverLimit = charCount > 10000;

  const handleFileUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationError('Image size must be less than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage({
        base64: e.target.result,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      });
      setValidationError('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleLoadSampleScreenshot = (type) => {
    if (type === 'bank') {
      const dataUrl = generateSampleScreenshot(
        'Urgent Bank KYC Notice',
        'State Bank Alert: Your account is blocked due to unverified KYC. Immediately visit http://sbi-kyc-verify-portal.example.com to enter your OTP and verify login.'
      );
      setImage({
        base64: dataUrl,
        name: 'sample_bank_kyc_alert.png',
        size: '42.0 KB'
      });
      setMessage('State Bank Alert: Your account is blocked due to unverified KYC. Immediately visit http://sbi-kyc-verify-portal.example.com to enter your OTP and verify login.');
      setMessageType('SMS');
      setActiveTab('image');
      setValidationError('');
    } else if (type === 'job') {
      const dataUrl = generateSampleScreenshot(
        'Selected for Work-From-Home Job',
        'Congratulations! You are shortlisted for Data Entry. Salary ₹45,000/month. Pay ₹999 refundable registration fee immediately on WhatsApp to confirm slot.'
      );
      setImage({
        base64: dataUrl,
        name: 'sample_job_offer_scam.png',
        size: '45.0 KB'
      });
      setMessage('Selected for job. Pay ₹999 refundable registration fee immediately on WhatsApp.');
      setMessageType('Job or Internship Offer');
      setActiveTab('image');
      setValidationError('');
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    const hasText = message.trim().length >= 3;
    const hasImg = Boolean(image && image.base64);

    if (!hasText && !hasImg) {
      setValidationError(activeTab === 'image'
        ? 'Please upload a picture/screenshot or paste visible text from the image.'
        : 'Please paste or type a message before analyzing.');
      return;
    }

    if (isOverLimit) {
      setValidationError('Message exceeds maximum limit of 10,000 characters.');
      return;
    }

    setValidationError('');
    onAnalyze();
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClearAll = () => {
    onClear();
    if (setImage) setImage(null);
    setValidationError('');
  };

  return (
    <div id="analyzer-section" className="scroll-mt-24 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
      {/* Decorative top ambient light */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-5 h-5" />
            </span>
            Message & Screenshot Risk Analyzer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evaluate text messages, WhatsApp screenshots, emails, or job flyers for fraud signals.
          </p>
        </div>

        {/* Message Type Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="message-type-select" className="text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0">
            Channel:
          </label>
          <div className="relative">
            <select
              id="message-type-select"
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              disabled={isLoading}
              className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer hover:border-slate-600 disabled:opacity-50"
            >
              {MESSAGE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs: Text vs Picture / Screenshot */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab('text');
            setValidationError('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'text'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Paste Text Message</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('image');
            setValidationError('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'image'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Upload Picture / Screenshot</span>
          {image && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
        </button>
      </div>

      {/* Tab 1: Text Mode Sample Bar */}
      {activeTab === 'text' && (
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Try a Sample:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {samples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  onSelectSample(sample);
                  setValidationError('');
                }}
                disabled={isLoading}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 hover:text-cyan-300 text-slate-300 border border-slate-700/80 transition-all active:scale-95 disabled:opacity-50"
                title={sample.title}
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Picture / Screenshot Upload Section */}
      {activeTab === 'image' && (
        <div className="mb-4 space-y-3">
          {/* Sample Screenshots Quick Bar */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Demo Screenshots:
            </span>
            <button
              type="button"
              onClick={() => handleLoadSampleScreenshot('bank')}
              disabled={isLoading}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              📱 Fake Bank Alert Screenshot
            </button>
            <button
              type="button"
              onClick={() => handleLoadSampleScreenshot('job')}
              disabled={isLoading}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              💼 Work-From-Home Job Flyer
            </button>
          </div>

          {/* Upload Dropzone */}
          {!image ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-950/30'
                  : 'border-slate-700 hover:border-slate-500 bg-slate-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-200">
                  Click to browse or drag & drop screenshot
                </p>
                <p className="text-xs text-slate-500">
                  Supports PNG, JPG, JPEG, WEBP (up to 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={image.base64}
                  alt="Uploaded screenshot preview"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-200 truncate">{image.name}</div>
                  <div className="text-xs text-slate-400">{image.size}</div>
                  <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mt-0.5">
                    Ready for visual scam inspection
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImage(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Text / Context Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            ref={inputRef}
            rows={activeTab === 'image' ? 3 : 7}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (validationError) setValidationError('');
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={
              activeTab === 'image'
                ? "Optional accompanying notes or transcribed text from the image (e.g., 'Received this on WhatsApp from an unknown number')."
                : "Paste suspicious SMS, email body, WhatsApp text, or job offer here (e.g., 'URGENT: Your account has been suspended. Click here to submit your OTP...'). Never paste real banking passwords or active personal credentials."
            }
            className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-sm sm:text-base font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 transition-all resize-y leading-relaxed disabled:opacity-50"
          />

          {/* Active Cyber Scanning Overlay Animation */}
          {isLoading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 border border-cyan-500/50 overflow-hidden">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
              
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 flex items-center justify-center animate-ping absolute" />
                <div className="w-16 h-16 rounded-full border border-cyan-500 bg-cyan-950/60 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
              </div>

              <div className="text-center space-y-1 z-10">
                <div className="text-base font-bold text-white flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  {image ? 'Analyzing Screenshot & Visual Fraud Cues' : 'Analyzing Message Security Vectors'}
                </div>
                <p className="text-xs font-mono text-cyan-300">
                  {loadingSteps[loadingStepIndex]}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Live Counters and Validation Alert */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-400">
            <span className={isOverLimit ? 'text-rose-400 font-bold' : isNearLimit ? 'text-amber-400 font-medium' : ''}>
              {charCount.toLocaleString()} / 10,000 chars
            </span>
            <span>{wordCount} words</span>
            {image && (
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> 1 Picture Attached
              </span>
            )}
            <span className="hidden sm:inline text-slate-500">
              Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-mono">Ctrl+Enter</kbd>
            </span>
          </div>

          {validationError && (
            <div className="flex items-center gap-1.5 text-rose-400 font-medium text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleClearAll}
            disabled={isLoading || (!message && !image && !validationError)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || (!message.trim() && !image)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Running Scan...</span>
              </>
            ) : (
              <>
                {image ? <Camera className="w-4 h-4 text-slate-950" /> : <Shield className="w-4 h-4 text-slate-950" />}
                <span>{image ? 'Analyze Picture / Screenshot' : 'Analyze Message'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
