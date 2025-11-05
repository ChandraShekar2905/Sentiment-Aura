import { useState } from 'react';
import axios from 'axios';
import AudioRecorder from './components/AudioRecorder';
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
      // Don't clear text here - keep it visible with results
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
    // Clear text when starting a new recording
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
    <div className="app">
      <h1>Sentiment Aura</h1>
      
      {/* Audio Recording Section */}
      <div className="card">
        <h2>🎤 Voice Analysis</h2>
        <AudioRecorder 
          onTranscriptUpdate={handleTranscriptUpdate}
          onRecordingStart={handleRecordingStart}
        />
      </div>

      {/* Manual Text Input Section */}
      <div className="card">
        <h2>✍️ Text Analysis</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Or type text to analyze..."
          rows={5}
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={analyzeText} 
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
          
          <button 
            onClick={clearAll}
            style={{ 
              flex: 0.3,
              background: '#666'
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="card">
          <h2>📊 Results</h2>
          <p><strong>Sentiment:</strong> {result.sentiment}</p>
          <p><strong>Label:</strong> {result.sentiment_label}</p>
          <p><strong>Keywords:</strong> {result.keywords.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default App;