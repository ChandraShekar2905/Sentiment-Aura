import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import AuraVisualization from './components/AuraVisualization';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [sentiment, setSentiment] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const transcriptRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const analyzeText = async (textToAnalyze) => {
    if (!textToAnalyze?.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/process_text`, {
        text: textToAnalyze
      });
      
      setSentiment(response.data.sentiment);
      setKeywords(response.data.keywords);
      
      setText('');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setTranscript('');
    setKeywords([]);
    setSentiment(0);
    setText('');
  };

  const startRecording = async () => {
    try {
      setTranscript('');
      setKeywords([]);
      setSentiment(0);
      setText('');

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });

      const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
      
      if (!apiKey) {
        throw new Error('Deepgram API key not found');
      }

      const ws = new WebSocket(
        'wss://api.deepgram.com/v1/listen?' + new URLSearchParams({
          model: 'nova-2',
          language: 'en-US',
          smart_format: 'true',
          interim_results: 'true',
        }),
        ['token', apiKey]
      );

      socketRef.current = ws;

      ws.onopen = () => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm'
        });

        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
          }
        };

        mediaRecorder.start(250);
      };

      ws.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          const transcriptText = data.channel?.alternatives?.[0]?.transcript;
          
          if (transcriptText && transcriptText.trim() !== '') {
            setTranscript(prev => {
              if (data.is_final) {
                return prev + ' ' + transcriptText;
              }
              return prev;
            });

            if (data.is_final) {
              analyzeText(transcriptText);
            }
          }
        } catch (err) {
          console.error('Error parsing transcript:', err);
        }
      };

      setIsRecording(true);

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    setIsRecording(false);
  };

  const handleSendText = () => {
    if (!text.trim()) return;
    
    setTranscript(prev => prev ? prev + ' ' + text : text);
    analyzeText(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Background Visualization */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <AuraVisualization sentiment={sentiment} />
      </div>

      {/* Centered Content */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        zIndex: 10
      }}>
        <div className="app">
          <h1>Sentiment Aura</h1>
          
          <div className="main-container">
            {/* Live Transcript Display */}
            {transcript && (
              <div className="transcript-display" ref={transcriptRef}>
                <div className="transcript-label">TRANSCRIPT</div>
                <div className="transcript-text">{transcript}</div>
              </div>
            )}

            {/* Keywords Display */}
            {keywords.length > 0 && (
              <div className="keywords-display">
                <div className="keywords-label">KEY TOPICS</div>
                <div className="keywords-list">
                  {keywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="keyword-tag"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ChatGPT-Style Input */}
            <div className="input-container">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message Sentiment Aura..."
                rows={1}
                disabled={isRecording}
              />
              
              {/* Clear button - shows when there's content */}
              {(transcript || keywords.length > 0) && !isRecording && (
                <button 
                  className="clear-all-button"
                  onClick={clearAll}
                  title="Clear all"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
              
              <button 
                onClick={isRecording ? stopRecording : (text.trim() ? handleSendText : startRecording)}
                className={`input-button ${isRecording ? 'recording' : ''}`}
                disabled={loading}
                title={isRecording ? 'Stop recording' : (text.trim() ? 'Send message' : 'Start recording')}
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : isRecording ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <rect x="6" y="6" width="8" height="8" rx="2"/>
                  </svg>
                ) : text.trim() ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2L9 11" strokeLinecap="round"/>
                    <path d="M18 2L12 18L9 11L2 8L18 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="7.5" y="3" width="5" height="9" rx="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 10C5 12.7614 7.23858 15 10 15C12.7614 15 15 12.7614 15 10" strokeLinecap="round"/>
                    <line x1="10" y1="15" x2="10" y2="18" strokeLinecap="round"/>
                    <line x1="7" y1="18" x2="13" y2="18" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Sentiment Indicator */}
            {sentiment !== 0 && (
              <div className="sentiment-indicator">
                <div className="sentiment-bar">
                  <div 
                    className="sentiment-fill"
                    style={{
                      width: `${Math.abs(sentiment) * 100}%`,
                      background: sentiment > 0 ? 'rgba(52, 199, 89, 0.5)' : 'rgba(255, 59, 48, 0.5)'
                    }}
                  />
                </div>
                <span className="sentiment-value">{sentiment > 0 ? '+' : ''}{sentiment}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;