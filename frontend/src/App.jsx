import { useState } from 'react';
import axios from 'axios';
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

  return (
    <div className="app">
      <h1>Sentiment Aura</h1>
      
      <div className="card">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze..."
          rows={5}
        />
        
        <button onClick={analyzeText} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {result && (
        <div className="card">
          <h2>Results</h2>
          <p><strong>Sentiment:</strong> {result.sentiment}</p>
          <p><strong>Label:</strong> {result.sentiment_label}</p>
          <p><strong>Keywords:</strong> {result.keywords.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default App;