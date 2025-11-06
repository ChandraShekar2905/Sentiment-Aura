import { useState, useRef } from 'react';

function AudioRecorder({ onTranscriptUpdate, onRecordingStart }) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);

  const startRecording = async () => {
    try {
      setError('');
      
      if (onRecordingStart) {
        onRecordingStart();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });

      const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
      
      if (!apiKey) {
        throw new Error('Deepgram API key not found in .env file');
      }

      const ws = new WebSocket(
        'wss://api.deepgram.com/v1/listen?' + new URLSearchParams({
          model: 'nova-2',
          language: 'en-US',
          smart_format: 'true',
          interim_results: 'false',
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
            if (onTranscriptUpdate) {
              onTranscriptUpdate(transcriptText);
            }
          }
        } catch (err) {
          console.error('Error parsing transcript:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error');
      };

      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      setError(error.message);
      alert('Failed to start recording: ' + error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    setIsRecording(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button 
        onClick={isRecording ? stopRecording : startRecording}
        className={`record-button ${isRecording ? 'recording' : ''}`}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="6" y="6" width="8" height="8" rx="1.5"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="7"/>
          </svg>
        )}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;