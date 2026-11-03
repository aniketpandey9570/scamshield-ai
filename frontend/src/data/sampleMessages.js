export const SAMPLE_MESSAGES = [
  {
    id: "bank-otp-urgency",
    title: "Fake Bank KYC & OTP Demand",
    category: "Banking Fraud",
    message_type: "SMS",
    snippet: "Your SBI account will be blocked within 24 hours. Submit your OTP immediately to verify KYC...",
    content: "URGENT: Dear Customer, your State Bank account will be SUSPENDED within 24 hours due to pending KYC verification. To avoid immediate penalty and deactivation, verify your identity now: http://sbi-kyc-verify-portal.example.com/login. Please share the 6-digit OTP received on your mobile to complete reactivation immediately.",
    expected_risk: "CRITICAL",
    key_indicators: [
      "Immediate threat of suspension",
      "Direct demand for OTP / verification code",
      "Suspicious lookalike unverified link",
      "High urgency pressure tactic"
    ]
  },
  {
    id: "job-registration-fee",
    title: "Work-from-Home Job with Advance Fee",
    category: "Employment Scam",
    message_type: "Job or Internship Offer",
    snippet: "Congratulations! You have been selected for Global Tech Remote Assistant. Pay refundable registration deposit...",
    content: "Congratulations! Your resume has been shortlisted for the Remote Data Analyst position at Google Cloud Solutions. Salary: $4,500/month with flexible hours and no prior experience required. To confirm your interview slot and secure your work laptop, please transfer a refundable registration deposit of $150 via UPI or gift card to our HR manager on WhatsApp: +1-555-019-2834 before 5:00 PM today. Offer expires tonight!",
    expected_risk: "HIGH",
    key_indicators: [
      "Upfront refundable deposit for employment",
      "Unrealistic salary with no interview or experience",
      "Payment via gift card or personal WhatsApp",
      "Artificial deadline pressure"
    ]
  },
  {
    id: "lottery-prize-fee",
    title: "Lottery / Prize Claim Demanding Shipping Fee",
    category: "Advance-Fee Fraud",
    message_type: "WhatsApp Message",
    snippet: "You have won 1st prize in Amazon International Mega Draw! Pay processing and clearance fee to dispatch...",
    content: "DEAR WINNER! You have won 1st Prize of $50,000 in the 2026 Amazon International Lucky Customer Draw! Your ticket number is WIN-90821-AZ. To dispatch your certified prize cheque and MacBook Pro, you must deposit a customs clearance and courier handling charge of $85 to our liaison officer. Send money within 12 hours or your prize will be forfeited to the next runner-up. Contact our Telegram: @PrizeClaimsDesk.",
    expected_risk: "CRITICAL",
    key_indicators: [
      "Unsolicited lottery win for a contest never entered",
      "Advance payment demanded to receive prize",
      "Channel hopping to Telegram",
      "Urgent forfeiture threat"
    ]
  },
  {
    id: "legitimate-delivery-alert",
    title: "Legitimate Package Delivery Update",
    category: "Standard Notification",
    message_type: "SMS",
    snippet: "Your package with tracking #BL-892104 has arrived at your local hub and is scheduled for delivery...",
    content: "BlueDart Express: Your order from retail partner (AWB #892104332) has arrived at the regional sorting facility. Estimated delivery is tomorrow between 10:00 AM and 2:00 PM. No payment is required for this prepaid shipment. Track package progress inside the official BlueDart mobile application or visit https://www.example.com/track.",
    expected_risk: "LOW",
    key_indicators: [
      "No pressure or urgency tactics",
      "Explicitly confirms no payment required",
      "References official mobile app",
      "Standard business communication pattern"
    ]
  },
  {
    id: "phishing-account-verification",
    title: "Urgent Security Alert & Fake Reset Link",
    category: "Phishing / Credential Theft",
    message_type: "Email",
    snippet: "Unauthorized sign-in detected from IP 192.0.2.1. Click here within 1 hour to prevent permanent account lock...",
    content: "Subject: Security Notice: Unauthorized Sign-in Attempt Detected\n\nWe detected an unauthorized sign-in attempt to your Microsoft 365 / Outlook account from an unrecognized device in Moscow, Russia (IP: 192.0.2.89). If this was not you, your account may be compromised. You must verify your credentials within 60 minutes or access to your emails will be permanently terminated. Confirm your login password immediately at: http://security-microsoft-reauthorization-portal.example.com/auth Failure to act immediately will result in complete data erasure.",
    expected_risk: "HIGH",
    key_indicators: [
      "Alarmist unauthorized sign-in alert",
      "Coercive 60-minute time limit",
      "Requests login password via external link",
      "Threat of data erasure"
    ]
  },
  {
    id: "remote-access-support",
    title: "Tech Support Impersonation & Remote Control",
    category: "Tech Support Scam",
    message_type: "Other",
    snippet: "Microsoft Certified Support: Trojan horse virus detected on your system. Call toll-free and install AnyDesk...",
    content: "ALERT: Windows Security Center warning. Trojan.Spyware.Win32 detected on your computer! Your personal photos, banking credentials, and social security details are currently being leaked online. Do not turn off your computer. Call Microsoft Certified Technicians immediately at 1-800-555-0144. Our engineer will ask you to install AnyDesk or TeamViewer to remotely remove the infected files and restore your firewall.",
    expected_risk: "CRITICAL",
    key_indicators: [
      "Alarmist fake virus/trojan warning",
      "Demand to install remote-desktop software (AnyDesk)",
      "Fabricated leak of personal and banking information",
      "Direct instruction not to shut down computer"
    ]
  }
];

