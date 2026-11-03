import sys
import os
import unittest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.schemas import MessageTypeEnum
from app.analyzer import ScamAnalyzer

class TestFalsePositivesAndEdgeCases(unittest.TestCase):
    """
    Automated regression test suite verifying false-positive mitigation,
    accurate contextual scoring, and threat vector classification.
    """

    def test_case_a_normal_delivery_update(self):
        """Case A: Normal delivery update with 'shipped', 'delivered', 'business days', 'shopping'."""
        text = "Hi! Your order has been shipped and will be delivered within 2–3 business days. Thank you for shopping with us!"
        result = ScamAnalyzer.analyze(text, MessageTypeEnum.SMS)
        
        self.assertEqual(result.risk_level, "LOW", f"Expected LOW for normal delivery, got {result.risk_level} (Score: {result.risk_score})")
        self.assertLessEqual(result.risk_score, 24, f"Score should be in LOW band (0-24), got {result.risk_score}")
        self.assertEqual(len(result.findings), 0, f"Expected 0 findings for clean message, found: {[f.title for f in result.findings]}")
        self.assertIn("No obvious warning signs were detected", result.summary)

    def test_case_b_normal_appointment_reminder(self):
        """Case B: Normal appointment reminder."""
        text = "Your appointment is confirmed for tomorrow at 10 AM. We look forward to seeing you."
        result = ScamAnalyzer.analyze(text, MessageTypeEnum.OTHER)
        
        self.assertEqual(result.risk_level, "LOW", f"Expected LOW for appointment reminder, got {result.risk_level}")
        self.assertLessEqual(result.risk_score, 24)
        self.assertEqual(len(result.findings), 0)
        self.assertIn("No obvious warning signs were detected", result.summary)

    def test_case_c_suspicious_job_offer(self):
        """Case C: Suspicious job offer with upfront fee (₹999 registration fee)."""
        text = "You are selected for a job. Pay ₹999 as a registration fee immediately to confirm your position."
        result = ScamAnalyzer.analyze(text, MessageTypeEnum.JOB_OFFER)
        
        self.assertIn(result.risk_level, ["HIGH", "CRITICAL"], f"Expected HIGH or CRITICAL for upfront job fee, got {result.risk_level} (Score: {result.risk_score})")
        self.assertGreaterEqual(result.risk_score, 50)
        self.assertTrue(any("Upfront Fee" in f.title for f in result.findings), "Should detect upfront registration fee")

    def test_case_d_suspicious_otp_request(self):
        """Case D: Suspicious OTP and PIN request with suspension threat."""
        text = "Your bank account will be blocked. Send your OTP and ATM PIN immediately."
        result = ScamAnalyzer.analyze(text, MessageTypeEnum.SMS)
        
        self.assertIn(result.risk_level, ["HIGH", "CRITICAL"], f"Expected HIGH or CRITICAL for OTP solicitation, got {result.risk_level} (Score: {result.risk_score})")
        self.assertGreaterEqual(result.risk_score, 75)
        self.assertTrue(any("Secret Credentials" in f.title for f in result.findings), "Should detect OTP/PIN credential solicitation")
        self.assertTrue(any("Urgency & Coercive Pressure" in f.title for f in result.findings), "Should detect account blocked threat")

    def test_case_e_uncertain_message(self):
        """Case E: Uncertain message without threats or credential demands."""
        text = "Please contact our support team regarding your account."
        result = ScamAnalyzer.analyze(text, MessageTypeEnum.OTHER)
        
        self.assertEqual(result.risk_level, "LOW", f"Expected LOW for general support message, got {result.risk_level} (Score: {result.risk_score})")
        self.assertLessEqual(result.risk_score, 24)
        self.assertEqual(len(result.findings), 0)
        self.assertIn("No obvious warning signs were detected", result.summary)

if __name__ == "__main__":
    unittest.main()

