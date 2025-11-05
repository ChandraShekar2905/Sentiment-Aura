from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import TextRequest, SentimentResponse, ErrorResponse
from services.llm_service import LLMService
from utils.config import settings
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sentiment Aura API",
    description="Real-time sentiment analysis for live transcripts",
    version="1.0.0"
)

# CORS
allowed_origins = settings.allowed_origins.split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM service
llm_service = LLMService()

@app.get("/")
async def root():
    return {
        "message": "Sentiment Aura API with Real AI",
        "status": "running",
        "version": "1.0.0",
        "ai_powered": True
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "llm_service": "connected"
    }

@app.post(
    "/process_text",
    response_model=SentimentResponse,
    responses={
        500: {"model": ErrorResponse}
    }
)
async def process_text(request: TextRequest):
    """
    Analyze sentiment and extract keywords from text using AI.
    
    - **text**: The transcript text to analyze (1-500 characters)
    
    Returns sentiment score, keywords, and sentiment label.
    """
    try:
        logger.info(f"Processing text: {request.text[:50]}...")
        
        # THIS IS THE KEY CHANGE - Now using real AI!
        result = await llm_service.analyze_sentiment(request.text)
        
        logger.info(
            f"Result: sentiment={result['sentiment']}, "
            f"keywords={result['keywords']}, "
            f"label={result['sentiment_label']}"
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error processing text: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing text: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
