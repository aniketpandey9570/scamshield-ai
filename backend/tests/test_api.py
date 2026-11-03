import asyncio
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from httpx import AsyncClient, ASGITransport
from app.main import app
from app.schemas import MessageTypeEnum

async def run_fastapi_tests():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test 1: Health endpoint
        health_resp = await client.get("/api/health")
        assert health_resp.status_code == 200, f"Health check failed: {health_resp.text}"
        health_data = health_resp.json()
        print("Health check response:", health_data)
        assert health_data["status"] == "healthy"
        assert health_data["analysis_mode"] in ["AI", "RULE_BASED"]

        # Test 2: Samples endpoint
        samples_resp = await client.get("/api/samples")
        assert samples_resp.status_code == 200
        samples_data = samples_resp.json()
        print(f"Loaded {len(samples_data)} sample messages.")
        assert len(samples_data) >= 5

        # Test 3: Analyze endpoint with suspicious message
        suspicious_payload = {
            "message": "Urgent: Send your OTP to 99999 or your account will be blocked within 10 minutes!",
            "message_type": MessageTypeEnum.SMS.value
        }
        analyze_resp = await client.post("/api/analyze", json=suspicious_payload)
        assert analyze_resp.status_code == 200
        analyze_data = analyze_resp.json()
        print("\nAnalyze result for suspicious message:")
        print(f"  Risk level: {analyze_data['risk_level']}")
        print(f"  Risk score: {analyze_data['risk_score']}")
        print(f"  Findings: {len(analyze_data['findings'])}")
        assert analyze_data["risk_level"] in ["HIGH", "CRITICAL"]

        # Test 4: Analyze clean message
        clean_payload = {
            "message": "Hey Mom, will be home around 7 PM for dinner. See you soon!",
            "message_type": MessageTypeEnum.OTHER.value
        }
        clean_resp = await client.post("/api/analyze", json=clean_payload)
        assert clean_resp.status_code == 200
        clean_data = clean_resp.json()
        print("\nAnalyze result for clean message:")
        print(f"  Risk level: {clean_data['risk_level']}")
        print(f"  Risk score: {clean_data['risk_score']}")
        assert clean_data["risk_level"] == "LOW"
        assert clean_data["risk_score"] > 0

        # Test 5: Validation error for too short message
        invalid_payload = {
            "message": "hi",
            "message_type": MessageTypeEnum.SMS.value
        }
        inv_resp = await client.post("/api/analyze", json=invalid_payload)
        assert inv_resp.status_code == 422 or inv_resp.status_code == 400
        print("\nValidation rejection for short input: HTTP", inv_resp.status_code)

        # Test 6: Image upload payload
        image_payload = {
            "message": "Attached screenshot of a suspicious message.",
            "message_type": MessageTypeEnum.WHATSAPP.value,
            "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        }
        img_resp = await client.post("/api/analyze", json=image_payload)
        assert img_resp.status_code == 200
        img_data = img_resp.json()
        print("\nAnalyze result for image upload:")
        print(f"  Risk level: {img_data['risk_level']}")
        print(f"  Has image: {img_data.get('has_image')}")
        assert img_data.get("has_image") is True

    print("\n✅ All FastAPI API integration tests passed successfully!")

if __name__ == "__main__":
    asyncio.run(run_fastapi_tests())
