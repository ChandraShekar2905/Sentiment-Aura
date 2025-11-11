# Sentiment Aura

**Live AI-Powered Emotion Visualization**

A full-stack web application that performs real-time audio transcription and visualizes emotional sentiment as a beautiful, generative Perlin noise flow field. Built for Memory Machines.

![Sentiment Aura Demo](demo-screenshot.png)

---

## Overview

Sentiment Aura captures your voice, transcribes it in real-time, analyzes the emotional sentiment using AI, and transforms those emotions into a living, breathing visual experience. The Perlin noise visualization dynamically responds to your emotional tone through color, flow patterns, and motion characteristics.

**Live Demo:** [Add your deployed link here]  
**Demo Video:** [Add your video link here]

---

##  Features

###  Real-Time Audio Transcription
- Live speech-to-text using Deepgram WebSocket streaming
- Auto-scrolling transcript display
- <500ms latency from speech to text

###  AI-Powered Sentiment Analysis
- Emotional tone detection using Groq LLaMA 3.3 70B
- Sentiment scoring from -1 (very negative) to +1 (very positive)
- Automatic keyword extraction from speech

###  Generative Perlin Noise Visualization
- 1000-particle flow field animation
- Dynamic color mapping (warm orange for positive, cool blue for negative)
- Flow characteristics respond to emotional intensity:
  - Positive emotions: Slow, calm, smooth waves
  - Negative emotions: Fast, chaotic, turbulent patterns
- Smooth transitions between emotional states

###  Apple-Inspired Liquid Glass UI
- Semi-transparent frosted glass aesthetic
- Clean, minimal interface matching Memory Machines design language
- Smooth micro-animations and hover effects
- Fully responsive design

---

##  Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **p5.js** - Creative coding and visualization
- **Axios** - HTTP client
- **Deepgram SDK** - Real-time speech-to-text
- **Web Audio API** - Microphone capture

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Groq API** - LLM inference for sentiment analysis
- **Pydantic** - Data validation

### External APIs
- **Deepgram** - Real-time transcription service
- **Groq** - AI model inference (LLaMA 3.3 70B)

---

##  Quick Start

### Prerequisites

- **Node.js** (v18+)
- **Python** (3.9+)
- **Deepgram API Key** ([Get free credits](https://console.deepgram.com))
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

# Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Groq API key
# GROQ_API_KEY=your_groq_api_key_here
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Deepgram API key
# VITE_DEEPGRAM_API_KEY=your_deepgram_api_key_here
# VITE_BACKEND_URL=http://localhost:8000
```

### Running the Application

#### Start Backend (Terminal 1)

```bash
cd backend
python3 -m uvicorn main:app --reload --port 8000
```

Backend will run at: `http://localhost:8000`

#### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run at: `http://localhost:5173`

Open your browser to `http://localhost:5173` and grant microphone permission when prompted.

---

## 📖 How to Use

1. **Click the microphone icon** to start recording
2. **Speak naturally** - your words will be transcribed in real-time
3. **Stop recording** - sentiment analysis runs automatically
4. **Watch the visualization** change color and flow based on your emotional tone
5. **Keywords appear** showing the main topics detected
6. **Clear** to start a new recording

Or type text manually and click the send button to analyze without voice.

---

## 🏗️ Architecture

### Data Flow

```
User Speech → Microphone Capture → Deepgram (Transcription)
                                         ↓
                                    Transcript
                                         ↓
                                    React State
                                         ↓
                                   Backend API
                                         ↓
                                  Groq LLM (Analysis)
                                         ↓
                            Sentiment + Keywords
                                         ↓
                            p5.js Visualization Update
```

### Component Structure

```
frontend/
├── src/
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Liquid glass styling
│   └── components/
│       └── AuraVisualization.jsx  # p5.js Perlin noise visualization
│
backend/
├── main.py                        # FastAPI application
├── services/
│   ├── llm_service.py            # Groq API integration
│   └── prompt_templates.py        # Prompt engineering
├── models/
│   └── schemas.py                 # Pydantic models
└── utils/
    └── config.py                  # Configuration management
```

---

## Visualization Design

### Sentiment Mapping

The Perlin noise visualization responds to emotional sentiment through multiple parameters:

| Sentiment | Color | Flow Pattern | Particle Speed | Visual Character |
|-----------|-------|--------------|----------------|------------------|
| +0.9 | Bright Yellow | Large smooth waves | Slow (0.5x) | Calm, peaceful, warm |
| +0.5 | Orange | Gentle flowing | Slower (0.7x) | Content, pleasant |
| 0.0 | Purple/Gray | Balanced patterns | Normal (1x) | Neutral, steady |
| -0.5 | Blue | Turbulent | Faster (1.3x) | Agitated, restless |
| -0.9 | Deep Blue | Very chaotic | Fast (1.6x) | Distressed, turbulent |

### Technical Implementation

- **Perlin Noise Field**: 3D noise (x, y, time) creates organic, flowing patterns
- **1000 Particles**: Follow force vectors calculated from noise field
- **Smooth Interpolation**: All parameters transition gradually using linear interpolation
- **Performance**: Optimized to maintain 50-60 FPS on modern hardware

---

## Key Features Demonstrated

### Full-Stack Orchestration
- Seamless integration of React frontend, Python backend, and multiple external APIs
- Real-time WebSocket communication for audio streaming
- RESTful API for sentiment analysis
- Efficient state management and data flow

### Data-Driven Visualization
- Abstract sentiment data mapped to multiple visual parameters:
  - Color hue and saturation
  - Noise scale (flow smoothness)
  - Noise strength (pattern complexity)
  - Particle velocity
  - Stroke weight
  - Background opacity

### Frontend Polish
- Smooth color transitions using color interpolation
- Keywords fade in with staggered animations
- Liquid glass UI with backdrop blur effects
- Responsive hover and focus states
- Accessibility considerations (ARIA labels, keyboard navigation)

### Async Management & Error Handling
- WebSocket reconnection logic
- Graceful API failure handling with fallback responses
- Loading states and user feedback
- Microphone permission error handling

---

## API Endpoints

### Backend API

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

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "llm_service": "connected"
}
```

---

##  Design Decisions

### Why Perlin Noise?

Perlin noise creates organic, natural-looking patterns that feel alive and emotional - perfect for representing human sentiment. Unlike random noise, it produces smooth, continuous variations that our brains perceive as natural and beautiful.

### Why Speed Variation?

Emotional psychology research shows:
- **Positive emotions** correlate with calmness, peace, and slower perception of time
- **Negative emotions** correlate with agitation, anxiety, and racing thoughts

The slow flow for happiness and fast flow for distress mirrors these psychological states.

### Why Liquid Glass UI?

The semi-transparent aesthetic:
- Allows the visualization to remain visible and integrated
- Creates a premium, modern feel matching Memory Machines' brand
- Provides depth and layering
- Maintains readability while feeling futuristic

---

##  Testing

### Manual Testing Checklist

- [ ] Microphone permission request works
- [ ] Audio transcription appears in real-time
- [ ] Sentiment analysis completes in <2 seconds
- [ ] Visualization color changes with sentiment
- [ ] Particle speed varies correctly
- [ ] Keywords fade in gracefully
- [ ] Clear button removes all content
- [ ] Works in Chrome, Firefox, Safari
- [ ] No memory leaks or crashes

### Performance Metrics

- **Transcription Latency:** <500ms
- **Backend Response Time:** ~300-600ms
- **Visualization FPS:** 50-60 FPS
- **Total End-to-End Latency:** <2 seconds

---

##  Environment Variables

### Frontend (.env)

```bash
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key
VITE_BACKEND_URL=http://localhost:8000
```

### Backend (.env)

```bash
GROQ_API_KEY=your_groq_api_key
ALLOWED_ORIGINS=http://localhost:5173
```

**Never commit `.env` files to version control!**

---

## Known Limitations

- Deepgram requires HTTPS in production (localhost OK for development)
- Browser must support Web Audio API and WebSocket
- Groq free tier has rate limits (30 requests/minute)
- Microphone permission required for voice input

---

##  Future Enhancements

- [ ] Save and replay session history
- [ ] Export transcript as text file
- [ ] Multi-language support
- [ ] Mobile-responsive touch controls
- [ ] Additional visualization modes
- [ ] Real-time sentiment graphing
- [ ] User authentication and profiles
- [ ] Sentiment trend analysis over time

---

## Acknowledgments

- **Memory Machines** - For the opportunity and project brief
- **Deepgram** - Real-time transcription API
- **Groq** - Fast LLM inference
- **p5.js Community** - Creative coding inspiration
- **Perlin Noise Resources** - [Sighack's excellent tutorial](https://sighack.com/post/getting-creative-with-perlin-noise-fields)

---

##  License

MIT License - See LICENSE file for details

---

## Author

**Chandra Shekar Reddy**  
Full-Stack Developer | AI Enthusiast

- Email: kusukunthla.c@northeastern.edu
- GitHub: [ChandraShekar2905](https://github.com/ChandraShekar2905)
- LinkedIn: [Chandra Shekar K](https://www.linkedin.com/in/chandrashekarreddykusukunthla/)

---

## Contributing

This is a portfolio project, but feedback and suggestions are welcome! Feel free to open an issue or reach out directly.

---

**Built with ❤️ for Memory Machines**