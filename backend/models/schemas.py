from pydantic import BaseModel, Field
from typing import List

class TextRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "I'm so excited about this project!"
            }
        }

class SentimentResponse(BaseModel):
    sentiment: float = Field(..., ge=-1, le=1)
    keywords: List[str] = Field(..., min_length=1, max_length=5)
    sentiment_label: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "sentiment": 0.85,
                "keywords": ["excited", "project"],
                "sentiment_label": "positive"
            }
        }

class ErrorResponse(BaseModel):
    detail: str
    error_code: str
