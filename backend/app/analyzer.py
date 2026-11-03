import re
from typing import List, Dict, Any, Tuple
from datetime import datetime, timezone
from app.schemas import Finding, AnalyzeResponse, MessageTypeEnum

class ScamAnalyzer:
    """
    ScamShield AI Rule-Based Detection Engine.
    Employs contextual heuristic evaluation, multi-signal compounding,
    strict word boundary safeguards, and context-aware scoring to minimize false positives.
    """

    # 1. High Urgency & Coercive Pressure (Threats + Artificial Panic)
    # Note: Ordinary shipping or business windows ("within 2-3 business days", "within 30 days") are explicitly excluded.
    COERCIVE_THREAT_PATTERNS = [
        (
            r"\b(account|service|access|card|sim|mobile)\s+(will be|is|has been)\s*(suspended|blocked|deactivated|terminated|disabled|locked)\b",
            "Threat of account or service suspension",
            "HIGH"
        ),
        (
            r"\b(arrest warrant|police complaint|court notice|legal action will be taken|customs seizure)\b",
            "Intimidation using law enforcement or legal threats",
            "HIGH"
        ),
        (
            r"\b(last warning|final notice|immediate penalty|penalty fee will apply)\b",
            "Coercive pressure using punitive intimidation",
            "MEDIUM"
        ),
        (
            r"\b(immediately|right now|urgently|without delay|act fast)\b",
            "Artificial urgency demand",
            "MEDIUM"
        ),
        (
            r"\b(within|in next)\s+(10|15|20|30|60|[1-9])\s*(mins?|minutes?|hours?|hrs?)\b",
            "Unusually tight deadline constraint designed to provoke hasty action",
            "MEDIUM"
        ),
        (
            r"\b(offer expires (today|tonight)|only \d+ (spots|slots|gifts) left|claim (today|now))\b",
            "Artificial scarcity pressure",
            "LOW"
        )
    ]

    # 2. Secret Credentials & Authentication Tokens (Must be explicit requests/solicitations, with \b word boundaries)
    CREDENTIAL_SOLICITATION_PATTERNS = [
        (
            r"\b(send|share|enter|submit|provide|verify|give|disclose|reply with|forward)\b.*?\b(otp|one[- ]time[- ]password|pin|atm pin|cvv|cvc|netbanking password|login password|secret key)\b",
            "Direct solicitation of one-time password, PIN, or confidential credentials",
            "HIGH"
        ),
        (
            r"\b(share|send)\s+(your|the)?\s*(otp|one[- ]time[- ]password|atm pin|cvv|secret code)\b",
            "Direct instruction to transmit authentication tokens",
            "HIGH"
        ),
        (
            r"\b(atm pin|card cvv|cvv code|cvc code|netbanking password)\b",
            "Mention of highly sensitive banking PIN or CVV credentials",
            "HIGH"
        ),
        (
            r"\b(verify|confirm)\s+(your)?\s*(login password|credentials|bank details|card number)\b",
            "Request to verify confidential authentication credentials",
            "HIGH"
        ),
        (
            r"\b(aadhaar|pan card|ssn|social security number)\b.*?\b(details|copy|number|photo)\b",
            "Collection of national identity card or tax identifier",
            "MEDIUM"
        )
    ]

    # 3. Advance Fee / Upfront Payments & Unrealistic Financial Lures
    ADVANCE_FEE_PATTERNS = [
        (
            r"\b(pay|deposit|transfer|send)\s+(?:[₹$€£]|rs\.?|inr)?\s*\d+\s*(?:as|for|towards)?\s*(?:a\s*)?(registration|processing|interview|courier|clearance|customs|activation|security|laptop)\s*(fee|charge|deposit|amount)\b",
            "Requirement to pay an upfront fee for job, interview, or prize clearance",
            "HIGH"
        ),
        (
            r"\b(registration|processing|interview|clearance|customs)\s*(fee|charge|deposit)\s*(?:of)?\s*(?:[₹$€£]|rs\.?|inr)?\s*\d+\b",
            "Specific advance fee required prior to receiving service or employment",
            "HIGH"
        ),
        (
            r"\b(refundable deposit|pay (?:[₹$€£]|rs\.?|inr)?\s*\d+ before|deposit (?:[₹$€£]|rs\.?|inr)?\s*\d+ to (confirm|receive|secure))\b",
            "Advance deposit prerequisite for job placement or prize disbursement",
            "HIGH"
        ),
        (
            r"\b(guaranteed (returns|income|profit)|earn (?:[₹$€£]|rs\.?|inr)?\s*\d+/(day|week|month)|earn lakhs|100% risk[- ]free)\b",
            "Unrealistic financial guarantees or implausible earning promises",
            "HIGH"
        ),
        (
            r"\b(you (have )?won|selected for (lottery|mega draw|cash prize|jackpot)|congratulations.*winner)\b",
            "Unsolicited lottery or prize claim notification",
            "HIGH"
        )
    ]

    # 4. Remote Desktop Software & Dangerous App Sideloading
    REMOTE_ACCESS_PATTERNS = [
        (
            r"\b(install|download)\b.*?\b(anydesk|teamviewer|quicksupport|ultraviewer|zoho assist|screen share)\b",
            "Request to install remote desktop control or screen-sharing application",
            "HIGH"
        ),
        (
            r"\b(\.apk|download (app|file|software) from link|enable unknown sources)\b",
            "Instruction to sideload unauthorized Android APK or executable",
            "HIGH"
        )
    ]

    # 5. Suspicious Links & Deceptive URLs
    SUSPICIOUS_LINK_PATTERNS = [
        (
            r"https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(/[\w\.\-/]*)?",
            "Raw numeric IP address URL used instead of a registered domain",
            "HIGH"
        ),
        (
            r"https?://[a-zA-Z0-9\.\-]+\.(xyz|top|work|click|club|loan|win|gq|cf|ml|tk|fit|download|su|ru)(/[\w\.\-/]*)?",
            "Utilizes high-risk, low-reputation top-level domain (TLD)",
            "HIGH"
        ),
        (
            r"https?://([a-zA-Z0-9\-]+\-){2,}[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}",
            "Deceptive hyphenated domain structure mimicking well-known brands",
            "MEDIUM"
        ),
        (
            r"http://[a-zA-Z0-9\.\-]+",
            "Insecure unencrypted HTTP protocol used for sensitive communication",
            "LOW"
        )
    ]

    # 6. Channel Redirection & Unusual Payment Methods
    CHANNEL_HOPPING_PATTERNS = [
        (
            r"\b(contact|message|chat with|reach out).*(on whatsapp|via telegram|telegram manager|@\w+)\b",
            "Attempt to divert user to private, unmonitored messaging channels",
            "MEDIUM"
        ),
        (
            r"\b(pay via|send money through|buy)\s*(gift card|google play card|apple card|steam card|crypto|usdt|bitcoin)\b",
            "Demands irreversible or non-refundable payment method",
            "HIGH"
        ),
        (
            r"\b(personal upi|send money to upi id|scan (this|the) qr code to receive)\b",
            "Requests peer-to-peer payment or fraudulent reverse-QR claim",
            "MEDIUM"
        )
    ]

    # 7. Brand / Institution Impersonation (Contextual check: only flags if accompanied by suspicious vectors)
    AUTHORITY_NAMES = [
        r"\b(sbi|state bank|hdfc|icici|axis bank|chase|wells fargo|bank of america|barclays|hsbc)\b",
        r"\b(microsoft|google cloud|apple support|amazon|netflix|paypal)\b",
        r"\b(income tax department|rbi|reserve bank|irs|social security administration)\b"
    ]

    @classmethod
    def analyze(cls, text: str, message_type: MessageTypeEnum) -> AnalyzeResponse:
        clean_text = text.strip()
        lower_text = clean_text.lower()
        findings: List[Finding] = []

        # Helper to extract verbatim snippet around match
        def extract_evidence(match_obj) -> str:
            start = max(0, match_obj.start() - 15)
            end = min(len(clean_text), match_obj.end() + 15)
            snippet = clean_text[start:end].replace("\n", " ").strip()
            if start > 0:
                snippet = "..." + snippet
            if end < len(clean_text):
                snippet = snippet + "..."
            return snippet

        # Filter out false-positive security advice (e.g. "Never share your OTP with anyone")
        has_security_warning = bool(re.search(r"\b(never|do not|don't)\s+(share|give|disclose)\b.*?\b(otp|pin|password)\b", lower_text))

        # Check for standard legitimate business communications
        # If the message is a standard delivery, appointment, or polite order confirmation without threats/fees
        is_standard_shipping = bool(re.search(
            r"\b(order has been shipped|delivered within \d+([–\-]\d+)?\s*(business )?days?|scheduled for delivery|thank you for shopping|appointment is confirmed)\b",
            lower_text
        ))

        # 1. Credential Check (Highest Severity)
        credential_found = False
        if not has_security_warning:
            for pattern, explanation, sev in cls.CREDENTIAL_SOLICITATION_PATTERNS:
                match = re.search(pattern, lower_text)
                if match:
                    evidence = extract_evidence(match)
                    findings.append(Finding(
                        title="Direct Request for Secret Credentials / OTP",
                        evidence=evidence,
                        explanation=f"{explanation}. Legitimate institutions never ask you to disclose OTPs, PINs, or passwords over text or email.",
                        severity=sev
                    ))
                    credential_found = True
                    break

        # 2. Advance Fee / Job Registration Check
        financial_found = False
        for pattern, explanation, sev in cls.ADVANCE_FEE_PATTERNS:
            match = re.search(pattern, lower_text)
            if match:
                evidence = extract_evidence(match)
                is_upfront_fee = "fee" in match.group(0) or "deposit" in match.group(0) or "pay" in match.group(0)
                title = "Upfront Fee Requirement" if is_upfront_fee else "Unrealistic Prize or Earnings Claim"
                findings.append(Finding(
                    title=title,
                    evidence=evidence,
                    explanation=f"{explanation}. Legitimate employers never charge candidates for job placement or equipment, and real lotteries never require shipping fees to receive winnings.",
                    severity=sev
                ))
                financial_found = True
                break

        # 3. Coercive Threat & Urgency Check
        urgency_found = False
        for pattern, explanation, sev in cls.COERCIVE_THREAT_PATTERNS:
            match = re.search(pattern, lower_text)
            if match:
                # Discard match if it's merely a standard delivery window or shipping notice
                if is_standard_shipping and ("within" in match.group(0) or "immediately" not in match.group(0)) and not credential_found and not financial_found:
                    continue

                # If it's a standalone "immediately" or "within 24 hours" without threats, advance fees, or credential demands,
                # do not flag it by itself to prevent false alarms on benign messages like "Please call me immediately"
                is_isolated_urgency = ("immediately" in match.group(0) or "urgently" in match.group(0)) and not credential_found and not financial_found
                if is_isolated_urgency and not any(re.search(p, lower_text) for p, _, _ in cls.COERCIVE_THREAT_PATTERNS[:2]):
                    continue

                evidence = extract_evidence(match)
                findings.append(Finding(
                    title="Urgency & Coercive Pressure Tactic",
                    evidence=evidence,
                    explanation=f"{explanation}. Scammers deliberately create fake emergencies or deadlines to provoke impulsive decisions without verifying facts.",
                    severity=sev
                ))
                urgency_found = True
                break

        # 4. Remote Access Tools & Malicious Software
        remote_found = False
        for pattern, explanation, sev in cls.REMOTE_ACCESS_PATTERNS:
            match = re.search(pattern, lower_text)
            if match:
                evidence = extract_evidence(match)
                findings.append(Finding(
                    title="Suspicious Remote Access / App Installation",
                    evidence=evidence,
                    explanation=f"{explanation}. Remote screen control tools allow attackers to hijack devices, access banking apps, and read verification SMS codes without user consent.",
                    severity=sev
                ))
                remote_found = True
                break

        # 5. Suspicious Links & Deceptive URLs
        link_found = False
        for pattern, explanation, sev in cls.SUSPICIOUS_LINK_PATTERNS:
            match = re.search(pattern, lower_text)
            if match:
                evidence = extract_evidence(match)
                is_high_threat = ".xyz" in match.group(0) or re.search(r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", match.group(0))
                findings.append(Finding(
                    title="Suspicious Link or Deceptive Domain Structure",
                    evidence=evidence,
                    explanation=f"{explanation}. Attackers use lookalike URLs, insecure hosts, or temporary domain extensions to host spoofed authentication portals.",
                    severity="HIGH" if is_high_threat else "MEDIUM"
                ))
                link_found = True
                break

        # 6. Channel Redirection & Unusual Payment Methods
        channel_hopping_found = False
        for pattern, explanation, sev in cls.CHANNEL_HOPPING_PATTERNS:
            match = re.search(pattern, lower_text)
            if match:
                evidence = extract_evidence(match)
                findings.append(Finding(
                    title="Private Channel Hopping or Irreversible Payment",
                    evidence=evidence,
                    explanation=f"{explanation}. Diverting communications to Telegram/WhatsApp or demanding gift cards/direct transfers bypasses standard consumer safeguards.",
                    severity=sev
                ))
                channel_hopping_found = True
                break

        # 7. Authority / Brand Impersonation (Contextual check: only flags if accompanied by suspicious vectors)
        if credential_found or financial_found or urgency_found or link_found or remote_found:
            for pattern in cls.AUTHORITY_NAMES:
                match = re.search(pattern, lower_text)
                if match:
                    evidence = extract_evidence(match)
                    findings.append(Finding(
                        title="Potential Authority / Brand Impersonation",
                        evidence=evidence,
                        explanation=f"Claims affiliation with '{match.group(0).upper()}'. Phishers frequently impersonate trusted financial institutions, technology brands, and government departments to induce blind trust.",
                        severity="MEDIUM"
                    ))
                    break

        # -------------------------------------------------------------
        # CONTEXTUAL SCORING LOGIC
        # -------------------------------------------------------------
        # Scoring Bands:
        # 0–24: LOW
        # 25–49: MEDIUM
        # 50–74: HIGH
        # 75–100: CRITICAL

        if not findings:
            final_score = 12
            risk_level = "LOW"
            summary = "No obvious warning signs were detected. This does not guarantee that the message is legitimate."
            recommended_actions = [
                "Verify the sender's identity using known, official channels if the content involves accounts or money.",
                "Inspect any embedded links manually before clicking.",
                "Remember that professional scammers can craft convincing, clean-looking messages."
            ]
        else:
            # Base score derived from findings
            score = 15
            for f in findings:
                if f.severity == "HIGH":
                    score += 35
                elif f.severity == "MEDIUM":
                    score += 20
                else:
                    score += 10

            # Meaningful Combinations (Requirement 3):
            # 1. OTP / Password Request + Coercive Urgency -> CRITICAL (85-98)
            if credential_found and urgency_found:
                score = max(score, 90)

            # 2. OTP Request in SMS or Banking context -> CRITICAL (85-98)
            elif credential_found:
                score = max(score, 85)

            # 3. Upfront Fee in Job Offer / Prize -> HIGH or CRITICAL (78-85)
            if financial_found and (urgency_found or channel_hopping_found or message_type == MessageTypeEnum.JOB_OFFER):
                score = max(score, 80)
            elif financial_found:
                score = max(score, 70)

            # 4. Remote Desktop / APK Software Demand -> CRITICAL (85-98)
            if remote_found:
                score = max(score, 88)

            # 5. Suspicious Link + Urgency -> HIGH (65-75)
            if link_found and urgency_found:
                score = max(score, 68)

            # Ensure bounds
            final_score = max(10, min(98, score))

            # Assign strict risk band
            if final_score <= 24:
                risk_level = "LOW"
            elif final_score <= 49:
                risk_level = "MEDIUM"
            elif final_score <= 74:
                risk_level = "HIGH"
            else:
                risk_level = "CRITICAL"

            finding_titles = ", ".join([f.title.lower() for f in findings[:2]])
            if risk_level == "CRITICAL":
                summary = f"Severe threat indicators detected, including {finding_titles}. Do not interact, reply, or transfer funds."
            elif risk_level == "HIGH":
                summary = f"High-risk message containing multiple suspicious patterns such as {finding_titles}."
            else:
                summary = f"Moderate caution warranted due to potential warning signals ({finding_titles})."

            recommended_actions = cls._generate_actions(findings, risk_level)

        limitations = (
            "Rule-based heuristic analysis evaluates known fraud patterns, linguistic coercion, and request characteristics. "
            "It cannot verify backend servers or validate sender identities in real-time."
        )

        return AnalyzeResponse(
            risk_level=risk_level,
            risk_score=final_score,
            summary=summary,
            findings=findings,
            recommended_actions=recommended_actions,
            analysis_method="RULE_BASED",
            limitations=limitations,
            model_name="Heuristic Pattern Engine v1.1 (Context-Aware)",
            analyzed_at=datetime.now(timezone.utc).isoformat()
        )

    @staticmethod
    def _generate_actions(findings: List[Finding], risk_level: str) -> List[str]:
        actions = []
        titles = [f.title for f in findings]

        if any("Secret Credentials" in t for t in titles):
            actions.append("NEVER disclose OTPs, PINs, or passwords to anyone, even if they claim to be bank officials.")
            actions.append("If you already shared an OTP or password, contact your bank's fraud helpline immediately to freeze your account.")

        if any("Upfront Fee" in t for t in titles):
            actions.append("Refuse any advance payment or deposit requirement. Legitimate employers never charge candidates for job placement.")

        if any("Suspicious Link" in t for t in titles):
            actions.append("Do NOT tap or open the provided link. Manually open your browser and navigate to the verified official portal.")

        if any("Remote Access" in t for t in titles):
            actions.append("Do NOT install AnyDesk, TeamViewer, or unauthorized APK files requested by unknown parties.")

        if any("Authority / Brand" in t for t in titles):
            actions.append("Cross-check this communication by calling the organization's verified contact number listed on their official website.")

        if not actions:
            actions.append("Refrain from taking hurried action. Verify the message via a secondary reliable channel.")
            actions.append("Do not click links or call numbers provided inside the suspicious text.")

        if risk_level in ["HIGH", "CRITICAL"]:
            actions.append("Block the sender and report the message on the official cybercrime portal (e.g., cybercrime.gov.in / helpline 1930 in India).")

        return actions[:5]
