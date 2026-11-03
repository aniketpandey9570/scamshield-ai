from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Literal
from enum import Enum

class MessageTypeEnum(str, Enum):
    SMS = "SMS"
    EMAIL = "Email"
    WHATSAPP = "WhatsApp Message"
    JOB_OFFER = "Job or Internship Offer"
    SHOPPING_OFFER = "Shopping or Payment Offer"
    OTHER = "Other"

class Finding(BaseModel):
    title: str = Field(..., description="Short title describing the warning sign")
    evidence: str = Field(..., description="Short quote or evidence extracted from the message or image")
    explanation: str = Field(..., description="Clear explanation of why this pattern is suspicious")
    severity: Literal["LOW", "MEDIUM", "HIGH"] = Field(..., description="Severity of this specific indicator")

class AnalyzeRequest(BaseModel):
    message: Optional[str] = Field(default="", max_length=15000, description="The message text or accompanying description to analyze")
    message_type: MessageTypeEnum = Field(default=MessageTypeEnum.OTHER, description="Contextual message channel/type")
    image_base64: Optional[str] = Field(default=None, description="Optional base64-encoded image or screenshot for visual fraud inspection")

    @model_validator(mode="after")
    def validate_has_content(self):
        msg = (self.message or "").strip()
        has_image = bool(self.image_base64 and len(self.image_base64) > 30)

        if not msg and not has_image:
            raise ValueError("Please provide either message text or upload a screenshot/image to analyze.")
        
        if msg and len(msg) < 3 and not has_image:
            raise ValueError("Message text must contain at least 3 characters.")

        return self

class AnalyzeResponse(BaseModel):
    risk_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    risk_score: int = Field(..., ge=1, le=100, description="Calculated risk score between 1 and 100")
    summary: str
    findings: List[Finding]
    recommended_actions: List[str]
    analysis_method: Literal["AI", "RULE_BASED", "RESTORED"]
    limitations: str
    model_name: Optional[str] = None
    analyzed_at: Optional[str] = None
    has_image: bool = Field(default=False, description="Whether an image screenshot was analyzed as part of this request")

class HealthResponse(BaseModel):
    status: str
    analysis_mode: Literal["AI", "RULE_BASED"]
    provider_configured: bool
    configured_provider: Optional[str] = None
    model_name: Optional[str] = None
    version: str = "1.1.0"
    image_analysis_supported: bool = True

class SampleMessage(BaseModel):
    id: str
    title: str
    category: str
    message_type: MessageTypeEnum
    snippet: str
    content: str
    expected_risk: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    key_indicators: List[str]
    sample_image_url: Optional[str] = None
