from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.post("/process_text")
async def process_text(request: TextRequest):
    return {
        "sentiment": 0.5,
        "keywords": ["hello", "world", "test"],
        "sentiment_label": "neutral"
    }

@app.get("/")
async def root():
    return {"message": "Backend is running!"}
