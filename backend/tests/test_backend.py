import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.schemas import MessageTypeEnum
from app.analyzer import ScamAnalyzer
from app.sample_data import SAMPLE_MESSAGES

def test_samples():
    print("Testing ScamShield AI Backend Rule-Based Analyzer...")
    for sample in SAMPLE_MESSAGES:
        res = ScamAnalyzer.analyze(sample.content, sample.message_type)
        print(f"\n[Test Case] {sample.title}")
        print(f"  Channel: {sample.message_type.value}")
        print(f"  Assigned Risk Level: {res.risk_level} (Score: {res.risk_score}/100)")
        print(f"  Expected Risk: {sample.expected_risk}")
        print(f"  Method: {res.analysis_method}")
        print(f"  Findings count: {len(res.findings)}")
        for f in res.findings:
            print(f"   * [{f.severity}] {f.title}: '{f.evidence}'")
        
        # Verify schema invariants
        assert res.risk_score >= 1 and res.risk_score <= 100, "Score out of bounds"
        if res.risk_score <= 24:
            assert res.risk_level == "LOW"
        elif res.risk_score <= 49:
            assert res.risk_level == "MEDIUM"
        elif res.risk_score <= 74:
            assert res.risk_level == "HIGH"
        else:
            assert res.risk_level == "CRITICAL"

    print("\n✅ All sample test cases passed schema invariants and scoring band assertions!")

if __name__ == "__main__":
    test_samples()
