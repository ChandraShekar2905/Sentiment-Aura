import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeText = async () => {
    if (!text.trim()) {
      alert('Please enter some text!');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:8000/process_text', {
        text: text
      });
      
      setResult(response.data);
      console.log('Success:', response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🎭 Sentiment Aura - Hello World Test</h1>
      
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something to analyze..."
          rows={4}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '16px',
            borderRadius: '8px',
            border: '2px solid #ddd',
            marginBottom: '1rem'
          }}
        />
        
        <button
          onClick={analyzeText}
          disabled={loading}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '18px',
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>

        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '8px'
          }}>
            ❌ Error: {error}
          </div>
        )}

        {result && (
          <div style={{
            marginTop: '1rem',
            padding: '1.5rem',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            textAlign: 'left'
          }}>
            <h2>📊 Results:</h2>
            <p><strong>Sentiment Score:</strong> {result.sentiment}</p>
            <p><strong>Label:</strong> {result.sentiment_label}</p>
            <p><strong>Keywords:</strong> {result.keywords.join(', ')}</p>
            
            <pre style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#fff',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;