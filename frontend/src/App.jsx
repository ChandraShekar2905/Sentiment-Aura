import { useState } from 'react';
import axios from 'axios';
import AudioRecorder from './components/AudioRecorder';
import AuraVisualization from './components/AuraVisualization';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/process_text', {
        text: text
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText('');
    setResult(null);
  };

  const handleRecordingStart = () => {
    setText('');
    setResult(null);
  };

  const handleTranscriptUpdate = (transcript) => {
    setText(prev => {
      const newText = prev ? prev + ' ' + transcript : transcript;
      return newText.trim();
    });
  };

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Background Visualization - Behind everything */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <AuraVisualization sentiment={result?.sentiment || 0} />
      </div>

      {/* Centered Content */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 10
      }}>
        <div className="app">
          <h1>Sentiment Aura</h1>
          
          {/* Audio Recording Section */}
          <div className="card">
            <div className="card-header">
              <div className="icon-circle">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1C9 0.447715 8.55228 0 8 0C7.44772 0 7 0.447715 7 1V9C7 9.55228 7.44772 10 8 10C8.55228 10 9 9.55228 9 9V1Z" fill="currentColor"/>
                  <path d="M5 8C5.55228 8 6 8.44772 6 9C6 11.2091 7.79086 13 10 13C12.2091 13 14 11.2091 14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9C16 12.0376 13.7252 14.5701 10.75 14.9378V17C10.75 17.5523 10.3023 18 9.75 18C9.19772 18 8.75 17.5523 8.75 17V14.9378C5.77477 14.5701 3.5 12.0376 3.5 9C3.5 8.44772 3.94772 8 4.5 8H5Z" fill="currentColor"/>
                </svg>
              </div>
              <h2>Voice Input</h2>
            </div>
            <AudioRecorder 
              onTranscriptUpdate={handleTranscriptUpdate}
              onRecordingStart={handleRecordingStart}
            />
          </div>

          {/* Manual Text Input Section */}
          <div className="card">
            <div className="card-header">
              <div className="icon-circle">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 3C2 2.44772 2.44772 2 3 2H15C15.5523 2 16 2.44772 16 3C16 3.55228 15.5523 4 15 4H3C2.44772 4 2 3.55228 2 3Z" fill="currentColor"/>
                  <path d="M2 7C2 6.44772 2.44772 6 3 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8H3C2.44772 8 2 7.55228 2 7Z" fill="currentColor"/>
                  <path d="M3 10C2.44772 10 2 10.4477 2 11C2 11.5523 2.44772 12 3 12H9C9.55228 12 10 11.5523 10 11C10 10.4477 9.55228 10 9 10H3Z" fill="currentColor"/>
                </svg>
              </div>
              <h2>Text Input</h2>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              rows={5}
            />
            
            <div className="button-group">
              <button 
                className="analyze-button"
                onClick={analyzeText} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L10 5.5H14.5L11 8.5L12.5 13L8 10L3.5 13L5 8.5L1.5 5.5H6L8 1Z" fill="currentColor"/>
                    </svg>
                    Analyze
                  </>
                )}
              </button>
              
              <button 
                className="clear-button"
                onClick={clearAll}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="card results-card">
              <div className="card-header">
                <div className="icon-circle">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="5" width="3" height="8" rx="1" fill="currentColor"/>
                    <rect x="7" y="3" width="3" height="12" rx="1" fill="currentColor"/>
                    <rect x="12" y="6" width="3" height="6" rx="1" fill="currentColor"/>
                  </svg>
                </div>
                <h2>Analysis</h2>
              </div>
              
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Sentiment</span>
                  <span className="result-value">{result.sentiment}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Type</span>
                  <span className="result-value sentiment-badge">{result.sentiment_label}</span>
                </div>
              </div>
              
              <div className="keywords-container">
                <span className="result-label">Keywords</span>
                <div className="keywords-list">
                  {result.keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;