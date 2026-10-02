from pydantic import BaseModel, Field
from typing import List

class URLPredictionResponse(BaseModel):

    url: str = Field(
        ...,
        description="The analyzed target URL",
        examples=["https://example.com"]
    )
    prediction: str = Field(
        ...,
        description="Risk classification label: SAFE, SUSPICIOUS, or DANGER",
        examples=["SAFE"]
    )
    risk_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Phishing risk score from 0 (safest) to 100 (highest risk)",
        examples=[12]
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Model prediction confidence score percentage",
        examples=[98.7]
    )
    indicators: List[str] = Field(
        default_factory=list,
        description="List of human-readable explainability risk indicators",
        examples=[["Uses HTTPS", "Normal URL length"]]
    )
