export function formatReportText(result, submittedMessage, messageType) {
  const timestamp = result.analyzed_at ? new Date(result.analyzed_at).toLocaleString() : new Date().toLocaleString();

  const findingsText = result.findings.length > 0
    ? result.findings.map((f, i) => (
      `  [Finding #${i + 1}] ${f.title} (Severity: ${f.severity})\n` +
      `  - Evidence: "${f.evidence}"\n` +
      `  - Why Suspicious: ${f.explanation}\n`
    )).join('\n')
    : "  No specific high-risk indicators detected. Exercise standard vigilance.\n";

  const actionsText = result.recommended_actions.length > 0
    ? result.recommended_actions.map((a, i) => `  ${i + 1}. ${a}`).join('\n')
    : "  1. Verify independently through official channels.";

  return `======================================================================
SCAMSHIELD AI — CYBERSECURITY RISK EVALUATION REPORT
======================================================================
Generated: ${timestamp}
Channel: ${messageType}
Engine Method: ${result.analysis_method} (${result.model_name || 'Standard Engine'})

----------------------------------------------------------------------
OVERALL RISK VERDICT
----------------------------------------------------------------------
Risk Level: ${result.risk_level}
Risk Score: ${result.risk_score} / 100
Summary:    ${result.summary}

----------------------------------------------------------------------
SUBMITTED MESSAGE EXCERPT
----------------------------------------------------------------------
${submittedMessage}

----------------------------------------------------------------------
DETECTED WARNING SIGNS & EVIDENCE
----------------------------------------------------------------------
${findingsText}
----------------------------------------------------------------------
RECOMMENDED SAFER ACTIONS
----------------------------------------------------------------------
${actionsText}

----------------------------------------------------------------------
LIMITATIONS & LEGAL DISCLAIMER
----------------------------------------------------------------------
${result.limitations}

DISCLAIMER: ScamShield AI is an educational decision-support tool. It
does not guarantee that an analyzed message is safe or fraudulent.
In emergency situations, contact local cyber authorities (in India: 1930
or https://cybercrime.gov.in).
======================================================================`;
}

export async function copyReportToClipboard(result, submittedMessage, messageType) {
  const text = formatReportText(result, submittedMessage, messageType);
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for non-https or older browser context
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }
}

export function downloadReportAsFile(result, submittedMessage, messageType) {
  const text = formatReportText(result, submittedMessage, messageType);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  link.download = `ScamShield_Report_${result.risk_level}_${dateStr}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

