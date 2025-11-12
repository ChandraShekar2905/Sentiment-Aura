# Sentiment Aura

**Live AI-Powered Emotion Visualization**

A full-stack web application that performs real-time audio transcription and visualizes emotional sentiment as a beautiful, generative Perlin noise flow field. Built for Memory Machines.

![Sentiment Aura Demo](demo-screenshot.png)
---

## Live Demo

**Application:** https://cs2905.com  
**Backend API:** https://api.cs2905.com  
**GitHub Repository:** [https://github.com/ChandraShekar2905/Sentiment-Aura]  


---

## Overview

Sentiment Aura captures your voice, transcribes it in real-time, analyzes the emotional sentiment using AI, and transforms those emotions into a living, breathing visual experience. The Perlin noise visualization dynamically responds to your emotional tone through color, flow patterns, and motion characteristics.

**Try it now:** Visit https://cs2905.com, click the microphone, and speak naturally. Watch how your emotions transform into visual art in real-time.

---

## Features

### Real-Time Audio Transcription
- Live speech-to-text using Deepgram WebSocket streaming
- Auto-scrolling transcript display
- <500ms latency from speech to text

### AI-Powered Sentiment Analysis
- Emotional tone detection using Groq LLaMA 3.3 70B
- Sentiment scoring from -1 (very negative) to +1 (very positive)
- Automatic keyword extraction from speech

### Generative Perlin Noise Visualization
- 2500-particle flow field animation running at 50-60 FPS
- Dynamic color mapping (warm orange/yellow for positive, cool blue for negative)
- Flow characteristics respond to emotional intensity:
  - **Positive emotions:** Slow, calm, smooth waves (0.5x speed)
  - **Negative emotions:** Fast, chaotic, turbulent patterns (1.6x speed)
- Smooth transitions between emotional states using linear interpolation

### Apple-Inspired Liquid Glass UI
- Semi-transparent frosted glass aesthetic
- Clean, minimal interface matching Memory Machines design language
- Smooth micro-animations and staggered keyword fade-ins
- Fully responsive design

---

## Tech Stack

### Frontend
- **React 18** - UI framework with hooks
- **Vite** - Build tool and dev server
- **p5.js** - Creative coding and visualization engine
- **Axios** - HTTP client for API calls
- **Deepgram SDK** - Real-time speech-to-text streaming
- **Web Audio API** - Native browser microphone capture

### Backend
- **FastAPI** - Modern Python web framework with automatic OpenAPI docs
- **Uvicorn** - Lightning-fast ASGI server
- **Groq API** - LLM inference for sentiment analysis (LLaMA 3.3 70B)
- **Pydantic** - Data validation and settings management
- **Python 3.12** - Latest Python features

### Deployment & Infrastructure
- **AWS EC2** - Backend hosting (Ubuntu 24.04, t3.micro)
- **AWS S3 + CloudFront** - Frontend hosting with global CDN
- **AWS Route 53** - DNS management
- **Nginx** - Reverse proxy and SSL termination
- **Let's Encrypt** - Free SSL certificates with auto-renewal
- **Systemd** - Backend service management

### External APIs
- **Deepgram** - Real-time transcription service
- **Groq** - Fast AI model inference (LLaMA 3.3 70B)

---

## Quick Start

### Prerequisites

- **Node.js** (v18+)
- **Python** (3.9+)
- **Deepgram API Key** ([Get free $200 credits](https://console.deepgram.com))
- **Groq API Key** ([Free tier available](https://console.groq.com))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sentiment-aura.git
cd sentiment-aura
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Groq API key
nano .env
# GROQ_API_KEY=your_groq_api_key_here
# ALLOWED_ORIGINS=http://localhost:5173
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Deepgram API key
nano .env
# VITE_DEEPGRAM_API_KEY=your_deepgram_api_key_here
# VITE_BACKEND_URL=http://localhost:8000
```

### Running the Application

#### Start Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate
python3 -m uvicorn main:app --reload --port 8000
```

Backend will run at: `http://localhost:8000`  
API docs available at: `http://localhost:8000/docs`

#### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run at: `http://localhost:5173`

Open your browser to `http://localhost:5173` and grant microphone permission when prompted.

---

## How to Use

1. **Click the microphone icon** 🎤 to start recording
2. **Speak naturally** - your words will be transcribed in real-time
3. **Watch the magic happen:**
   - Transcript appears as you speak
   - Sentiment analysis runs automatically
   - Visualization changes color and flow based on your emotional tone
   - Keywords appear showing the main topics detected
4. **Click the stop button** (square icon) to end recording
5. **Click the X button** to clear and start fresh

**Alternative:** Type text manually in the input box and click send (paper airplane icon) to analyze without voice.

---

## Architecture

### System Architecture

```
┌─────────────┐
│   Browser   │
│  (React UI) │
└──────┬──────┘
       │
       ├─── WebSocket ────→ Deepgram API (Transcription)
       │                         ↓
       │                    Transcript
       │                         ↓
       └─── HTTPS/REST ───→ FastAPI Backend (api.cs2905.com)
                                 ↓
                            Groq LLM API (Sentiment Analysis)
                                 ↓
                         {sentiment, keywords}
                                 ↓
                         p5.js Visualization Update
```

### Data Flow

```
User Speech → Microphone Capture → WebSocket Stream → Deepgram
                                                          ↓
                                                     Transcript
                                                          ↓
                                                    React State
                                                          ↓
                                                   POST /process_text
                                                          ↓
                                                  FastAPI Backend
                                                          ↓
                                                Groq LLM (LLaMA 3.3)
                                                          ↓
                                        {sentiment: 0.9, keywords: [...]}
                                                          ↓
                                                    React State Update
                                                          ↓
                                            p5.js Visualization Responds:
                                            - Color interpolation
                                            - Speed adjustment
                                            - Flow pattern changes
```

### Component Structure

```
sentiment-aura/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Main application logic
│   │   ├── App.css                    # Liquid glass styling
│   │   └── components/
│   │       └── AuraVisualization.jsx  # p5.js Perlin noise engine
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── main.py                        # FastAPI application & routes
│   ├── services/
│   │   ├── llm_service.py            # Groq API integration
│   │   └── prompt_templates.py        # Engineered prompts
│   ├── models/
│   │   └── schemas.py                 # Pydantic request/response models
│   ├── utils/
│   │   └── config.py                  # Environment configuration
│   ├── .env.example
│   └── requirements.txt
│
└── README.md
```

---

## Visualization Design

### Sentiment → Visual Parameter Mapping

The Perlin noise visualization responds to emotional sentiment through multiple parameters that change simultaneously:

| Sentiment Score | Color (RGB) | Flow Pattern | Particle Speed | Noise Scale | Visual Character |
|-----------------|-------------|--------------|----------------|-------------|------------------|
| **+0.9 to +1.0** | Yellow (255,210,80) | Large smooth waves | 0.5x SLOW | 0.003 | Calm, peaceful, warm glow |
| **+0.5 to +0.8** | Orange (250,150,70) | Gentle flowing | 0.7x Slower | 0.004 | Content, pleasant |
| **-0.2 to +0.2** | Purple (140,140,160) | Balanced patterns | 1.0x Normal | 0.005 | Neutral, steady |
| **-0.5 to -0.3** | Blue (100,120,200) | Turbulent swirls | 1.3x Faster | 0.008 | Agitated, restless |
| **-0.9 to -0.6** | Deep Blue (70,100,180) | Chaotic, rapid | 1.6x FAST | 0.012 | Distressed, turbulent |

### Technical Implementation

**Perlin Noise Engine:**
- **3D Noise Field:** (x, y, time) creates organic, continuous patterns
- **2500 Particles:** Each follows force vectors from the noise field
- **Grid-based Forces:** Flow field calculated on a grid (width/20 × height/20)
- **Smooth Interpolation:** All parameters (color, speed, noise) transition gradually
- **Trail Effect:** Semi-transparent background creates motion trails
- **Edge Wrapping:** Particles wrap around screen edges for infinite flow

**Performance Optimizations:**
- Particle count balanced for 50-60 FPS
- Efficient force calculation using grid
- Optimized stroke rendering
- No memory leaks (proper p5.js cleanup)

---

## Key Technical Achievements

### 1. Full-Stack Orchestration
- Seamless integration of React frontend, Python backend, and multiple external APIs
- Real-time WebSocket communication for audio streaming (250ms chunks)
- RESTful API for sentiment analysis with <600ms response time
- Efficient state management using React hooks
- CORS configuration for secure cross-origin requests

### 2. Real-Time Audio Pipeline
- Web Audio API for browser microphone capture
- WebSocket streaming to Deepgram (no file upload needed)
- Interim and final transcript handling
- Automatic sentiment analysis on sentence completion
- Error handling for microphone permissions

### 3. AI Integration & Prompt Engineering
- Groq LLaMA 3.3 70B model for fast inference
- Carefully engineered prompts for consistent sentiment scores
- Keyword extraction using NLP techniques
- Fallback handling for API failures
- Rate limit management

### 4. Data-Driven Generative Art
- Abstract sentiment data mapped to multiple visual parameters:
  - **Color:** RGB interpolation based on sentiment
  - **Noise Scale:** Controls flow smoothness (0.003 to 0.012)
  - **Noise Strength:** Pattern complexity (1 to 7)
  - **Speed Multiplier:** Particle velocity (0.5x to 1.6x)
  - **Stroke Weight:** Line thickness for visual emphasis
  - **Background Alpha:** Trail persistence effect
- Smooth transitions using linear interpolation to avoid jarring changes
- Perlin noise creates organic, natural-looking patterns

### 5. Production-Ready Deployment
- **AWS EC2:** Backend hosted on Ubuntu 24.04 with systemd service
- **Nginx:** Reverse proxy with SSL termination
- **Let's Encrypt:** Auto-renewing SSL certificates
- **AWS S3 + CloudFront:** Frontend with global CDN distribution
- **Route 53:** Professional DNS management
- **Monitoring:** Health check endpoint for uptime monitoring

### 6. UI/UX Polish
- **Liquid Glass Design:** Frosted backdrop blur, semi-transparent layers
- **Micro-animations:** Keywords fade in with 0.1s staggered delay
- **Smooth Color Transitions:** Color interpolation at 10% per frame
- **Auto-scrolling Transcript:** Always shows latest content
- **Loading States:** Visual feedback during processing
- **Error Handling:** Graceful fallbacks with user-friendly messages
- **Accessibility:** ARIA labels, keyboard navigation support

---

## API Documentation

### Backend Endpoints

#### `POST /process_text`
Analyze sentiment and extract keywords from text.

**Request:**
```json
{
  "text": "I'm so excited about this project!"
}
```

**Response:**
```json
{
  "sentiment": 0.9,
  "keywords": ["excited", "project"],
  "sentiment_label": "positive"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request body
- `500` - Internal server error

#### `GET /health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "llm_service": "connected"
}
```

#### `GET /docs`
Interactive API documentation (Swagger UI).

Access at: https://api.cs2905.com/docs

---

## Design Decisions & Rationale

### Why Perlin Noise?

Perlin noise creates **organic, natural-looking patterns** that feel alive and emotional - perfect for representing human sentiment. Unlike pure random noise:
- Produces smooth, continuous variations
- Feels natural to human perception
- Allows for controllable complexity
- Creates beautiful, hypnotic flow patterns

Kenneth Perlin won an Academy Award for this technique used in CGI!

### Why Speed Variation Based on Sentiment?

Grounded in **emotional psychology research:**
- **Positive emotions** correlate with calmness, peace, and slower perception of time
- **Negative emotions** correlate with agitation, anxiety, and racing thoughts
- **Color psychology:** Warm colors (yellow/orange) = happiness; Cool colors (blue) = sadness

The slow flow for happiness and fast flow for distress **mirrors these psychological states**, creating an intuitive emotional resonance.

### Why Liquid Glass UI?

The semi-transparent frosted glass aesthetic:
- **Allows visualization to remain visible** - UI doesn't obscure the art
- **Creates depth and layering** - Modern, premium feel
- **Matches Memory Machines' brand** - Clean, futuristic, sophisticated
- **Maintains readability** - Sufficient contrast without being opaque
- **Apple-inspired** - Draws from industry-leading design language

### Why Real-Time vs Batch Processing?

Real-time provides:
- **Immediate feedback loop** - Users see results as they speak
- **Natural interaction** - Feels like a conversation, not a tool
- **Continuous engagement** - Visualization evolves dynamically
- **Lower latency** - No waiting for analysis to complete

---

## Testing & Validation

### Manual Testing Checklist

**Functionality:**
- [x] Microphone permission request works
- [x] Audio transcription appears in real-time (<500ms latency)
- [x] Sentiment analysis completes in <2 seconds
- [x] Visualization color changes with sentiment
- [x] Particle speed varies correctly (slow for positive, fast for negative)
- [x] Keywords fade in gracefully with staggered animation
- [x] Clear button removes all content and resets state
- [x] Text input works as alternative to voice
- [x] Send button triggers analysis correctly

**Browser Compatibility:**
- [x] Chrome/Chromium (primary testing)
- [x] Firefox
- [x] Safari (requires HTTPS for microphone)
- [x] Edge

**Performance:**
- [x] Maintains 50-60 FPS with 2500 particles
- [x] No memory leaks over extended use
- [x] No browser crashes or freezes
- [x] Responsive on various screen sizes

### Performance Metrics

Measured on MacBook Pro M1:

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Transcription Latency | <500ms | ~300ms | ✅ Excellent |
| Backend Response Time | <1000ms | 300-600ms | ✅ Excellent |
| Visualization FPS | 50-60 | 55-60 | ✅ Optimal |
| End-to-End Latency | <2s | ~1.5s | ✅ Great |
| Memory Usage | Stable | Stable | ✅ No leaks |

---

## Environment Variables

### Frontend (.env)

```bash
# Deepgram API Key for speech-to-text
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key_here

# Backend API URL
VITE_BACKEND_URL=http://localhost:8000  # Development
# VITE_BACKEND_URL=https://api.cs2905.com  # Production
```

### Backend (.env)

```bash
# Groq API Key for LLM inference
GROQ_API_KEY=your_groq_api_key_here

# CORS allowed origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,https://cs2905.com,https://www.cs2905.com
```

**Security Note:** Never commit `.env` files to version control. Always use `.env.example` as a template.

---

## Known Limitations

1. **HTTPS Required in Production:** Deepgram requires HTTPS for microphone access (localhost OK for development)
2. **Browser Support:** Requires Web Audio API and WebSocket support (all modern browsers)
3. **API Rate Limits:** 
   - Groq free tier: 30 requests/minute
   - Deepgram: $200 free credits (~22 hours of audio)
4. **Microphone Permission:** User must grant permission for voice input
5. **Language Support:** Currently English only (Deepgram supports many languages)
6. **Mobile Optimization:** Designed primarily for desktop (mobile support possible)

---

## Future Enhancements

**Near-term:**
- [ ] Session history - Save and replay past conversations
- [ ] Export functionality - Download transcript as text file
- [ ] Sentiment graphing - Real-time line chart of sentiment over time
- [ ] Multiple visualization modes - Switch between different generative patterns

**Long-term:**
- [ ] Multi-language support - Transcription and analysis in multiple languages
- [ ] Mobile-responsive touch controls - Full mobile optimization
- [ ] User authentication - Save profiles and history
- [ ] Sentiment trend analysis - Track emotional patterns over days/weeks
- [ ] API usage dashboard - Monitor Deepgram and Groq usage
- [ ] Custom color themes - User-defined color palettes
- [ ] Social sharing - Share sentiment visualizations

---

## Cost Breakdown

**Monthly operational costs** (post-free tier):

| Service | Cost | Notes |
|---------|------|-------|
| AWS EC2 (t3.micro) | $0 - $7.50 | Free tier: 750 hours/month for 12 months |
| AWS S3 Storage | ~$0.50 | First 5 GB free |
| CloudFront CDN | $0 - $2 | First 1 TB free |
| Route 53 Hosted Zone | $0.50 | Per hosted zone |
| Groq API | $0 | Free tier (30 req/min) |
| Deepgram | $0 | $200 free credits |
| **Total** | **$1 - $10/month** | Mostly covered by AWS free tier |

---

## Acknowledgments

- **Memory Machines** - For the opportunity and inspiring project brief
- **Deepgram** - Excellent real-time transcription API with generous free credits
- **Groq** - Lightning-fast LLM inference
- **p5.js Community** - Creative coding inspiration and resources
- **Perlin Noise Resources:**
  - [The Coding Train - Perlin Noise Flow Field](https://www.youtube.com/watch?v=BjoM9oKOAKY)
  - [Sighack's Perlin Noise Tutorial](https://sighack.com/post/getting-creative-with-perlin-noise-fields)
  - Kenneth Perlin's original paper

---

## 📄 License

MIT License - See LICENSE file for details

Copyright (c) 2025 Chandra Shekar Reddy

---

## Author

**Chandra Shekar Reddy Kusukunthla**  
Full-Stack Developer | AI Enthusiast | Northeastern University

- **Email:** kusukunthla.c@northeastern.edu
- **GitHub:** [ChandraShekar2905](https://github.com/ChandraShekar2905)
- **LinkedIn:** [Chandra Shekar K](https://www.linkedin.com/in/chandrashekarreddykusukunthla/)
- **Portfolio:** [Add your portfolio link]

---

## Contributing

This is a portfolio project for Memory Machines, but feedback and suggestions are always welcome! Feel free to:
- Open an issue for bugs or feature requests
- Reach out directly via email
- Connect on LinkedIn

---

**Built with ❤️ for Memory Machines**

*Transforming emotions into art, one voice at a time.*