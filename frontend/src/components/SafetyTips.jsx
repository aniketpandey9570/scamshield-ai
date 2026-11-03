import React from 'react';
import {
  ShieldAlert,
  KeyRound,
  Briefcase,
  Gift,
  Building2,
  ExternalLink,
  Globe,
  DownloadCloud,
  Clock,
  PhoneCall,
  Lock,
  FileText,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';

const TIPS = [
  {
    icon: KeyRound,
    title: "Never Share OTPs or PINs",
    desc: "Your bank, delivery agent, or tech provider will never ask for your 6-digit one-time password or ATM PIN over phone, SMS, or WhatsApp.",
    color: "text-rose-400 bg-rose-950/60 border-rose-500/30"
  },
  {
    icon: Briefcase,
    title: "Verify Job Offers Independently",
    desc: "Legitimate corporate recruiters never ask for upfront 'registration fees', 'laptop deposits', or payment through gift cards or Telegram channels.",
    color: "text-amber-400 bg-amber-950/60 border-amber-500/30"
  },
  {
    icon: Gift,
    title: "Reject 'Prize Claim' Fees",
    desc: "If you didn't enter a contest, you didn't win. Genuine lotteries or brand sweepstakes never demand a 'customs fee' or 'courier charge' to deliver winnings.",
    color: "text-violet-400 bg-violet-950/60 border-violet-500/30"
  },
  {
    icon: Building2,
    title: "Call Banks Via Official Numbers",
    desc: "Never dial phone numbers printed inside an alert SMS. Turn over your physical debit card or visit your bank's verified official app to find the helpline.",
    color: "text-cyan-400 bg-cyan-950/60 border-cyan-500/30"
  },
  {
    icon: Globe,
    title: "Inspect Website URLs Closely",
    desc: "Attackers register spoofed domains like `sbi-kyc-verify.top` or use raw IP addresses. Check the exact spelling before entering any password.",
    color: "text-indigo-400 bg-indigo-950/60 border-indigo-500/30"
  },
  {
    icon: DownloadCloud,
    title: "Refuse Remote-Access App Installs",
    desc: "Do not install AnyDesk, TeamViewer, QuickSupport, or third-party APK files at the request of an incoming caller claiming to represent customer care.",
    color: "text-rose-400 bg-rose-950/60 border-rose-500/30"
  },
  {
    icon: Clock,
    title: "Resist Artificial Time Pressure",
    desc: "Phrases like 'Account blocked in 10 minutes' or 'Legal warrant issued' are psychological triggers designed to bypass critical thinking. Take a breath and verify.",
    color: "text-amber-400 bg-amber-950/60 border-amber-500/30"
  },
  {
    icon: Lock,
    title: "Use Multi-Factor Authentication (MFA)",
    desc: "Protect email and financial accounts with authenticator apps (TOTP) rather than SMS where possible to defend against SIM-swap attacks.",
    color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/30"
  },
  {
    icon: PhoneCall,
    title: "Report Suspicious Communications",
    desc: "Forward spam messages to telecom DND authorities and alert cyber defense portals to help protect vulnerable family members and communities.",
    color: "text-cyan-400 bg-cyan-950/60 border-cyan-500/30"
  }
];

export default function SafetyTips() {
  return (
    <section id="safety-tips-section" className="scroll-mt-24 mt-16 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
          <ShieldAlert className="w-3.5 h-3.5" />
          Cyber Hygiene Guidelines
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Essential Rules for Staying Safe Online
        </h2>
        <p className="text-sm text-slate-400">
          Scammers rely on human urgency, fear, and curiosity. Arm yourself with these fundamental digital defense rules.
        </p>
      </div>

      {/* 9 Golden Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TIPS.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 group"
            >
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 ${tip.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {tip.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Emergency Center: "If You Think You've Been Scammed" */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border border-rose-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/80 border border-rose-500/40 text-rose-300">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              Incident Response Checklist
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              If You Think You've Been Scammed
            </h3>
            <p className="text-sm text-slate-400 max-w-2xl">
              Act decisively and quickly. Following these immediate steps can prevent further financial loss and protect your digital identity.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 text-center space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 block">
              National Cybercrime Helpline
            </span>
            <div className="text-3xl font-black text-rose-400 tracking-tight">
              1930
            </div>
            <span className="text-[10px] text-slate-400 block">India Citizen Assistance (Toll-Free)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-white text-base">Sever Communication</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stop replying immediately. Do not send further money, passwords, or personal details regardless of threats.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-rose-400 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-white text-base">Freeze Cards & Bank Accounts</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Call your bank's 24/7 emergency fraud desk immediately. Request to block affected debit/credit cards, UPI IDs, and netbanking.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-white text-base">Change All Compromised Passwords</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              From a separate, secure device, reset credentials for your primary email, cloud storage, social accounts, and banking portals.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-violet-400 font-bold flex items-center justify-center text-sm">
              4
            </div>
            <h4 className="font-bold text-white text-base">Preserve Digital Evidence</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Take unedited full-screen screenshots of messages, transaction reference IDs, UPI transaction notes, email headers, and phone numbers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 font-bold flex items-center justify-center text-sm">
              5
            </div>
            <h4 className="font-bold text-white text-base">Report to National Portal</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In India, lodge a formal complaint at the National Cyber Crime Reporting Portal:
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-semibold ml-1"
              >
                cybercrime.gov.in <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 font-bold flex items-center justify-center text-sm">
              6
            </div>
            <h4 className="font-bold text-white text-base">Uninstall Remote Tools</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you granted remote access via AnyDesk or downloaded an APK, disconnect your device from Wi-Fi immediately and run an antivirus scan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

