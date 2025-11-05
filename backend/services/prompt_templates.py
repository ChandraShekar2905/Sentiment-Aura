SENTIMENT_PROMPT = """Analyze the sentiment and extract keywords from this text:

"{text}"

Return a JSON object with exactly these fields:
1. sentiment: A float between -1 (very negative) and 1 (very positive)
2. keywords: An array of 3-5 most important words or short phrases
3. sentiment_label: Either "positive", "negative", or "neutral"

Guidelines:
- sentiment should reflect the overall emotional tone
- keywords should be the most meaningful words (exclude filler words)
- sentiment_label should match the sentiment score:
  - positive: sentiment > 0.3
  - negative: sentiment < -0.3
  - neutral: sentiment between -0.3 and 0.3

Example response:
{{
  "sentiment": 0.75,
  "keywords": ["excited", "progress", "achievement"],
  "sentiment_label": "positive"
}}

Your response (JSON only, no explanation):"""
