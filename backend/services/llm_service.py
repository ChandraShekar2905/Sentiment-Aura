from groq import Groq
import json
import logging
from services.prompt_templates import SENTIMENT_PROMPT
from utils.config import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)
        # Updated to current model!
        self.model = "llama-3.3-70b-versatile"
    
    async def analyze_sentiment(self, text: str) -> dict:
        """
        Call Groq API to analyze sentiment and extract keywords.
        
        Args:
            text: The transcript text to analyze
            
        Returns:
            dict with sentiment, keywords, sentiment_label
        """
        try:
            prompt = SENTIMENT_PROMPT.format(text=text)
            
            logger.info(f"Calling LLM with text: {text[:50]}...")
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a sentiment analysis assistant. Return only valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=200,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            logger.info(f"LLM response: {result}")
            
            # Validate and normalize response
            validated = self._validate_response(result)
            return validated
            
        except Exception as e:
            logger.error(f"LLM Error: {str(e)}")
            # Return neutral fallback
            return {
                "sentiment": 0.0,
                "keywords": ["processing", "error"],
                "sentiment_label": "neutral"
            }
    
    def _validate_response(self, result: dict) -> dict:
        """Ensure response has correct structure and types."""
        try:
            sentiment = float(result.get("sentiment", 0))
            # Clamp to [-1, 1]
            sentiment = max(-1.0, min(1.0, sentiment))
            
            keywords = result.get("keywords", [])
            if not isinstance(keywords, list):
                keywords = []
            # Ensure 1-5 keywords
            keywords = [str(k) for k in keywords[:5]]
            if not keywords:
                keywords = ["unknown"]
            
            label = result.get("sentiment_label", "neutral")
            if label not in ["positive", "negative", "neutral"]:
                # Derive from sentiment score
                if sentiment > 0.3:
                    label = "positive"
                elif sentiment < -0.3:
                    label = "negative"
                else:
                    label = "neutral"
            
            return {
                "sentiment": round(sentiment, 2),
                "keywords": keywords,
                "sentiment_label": label
            }
        except Exception as e:
            logger.error(f"Validation error: {str(e)}")
            return {
                "sentiment": 0.0,
                "keywords": ["error"],
                "sentiment_label": "neutral"
            }
