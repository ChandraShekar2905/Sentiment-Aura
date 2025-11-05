import { useState, useRef } from 'react';

function AudioRecorder({ onTranscriptUpdate, onRecordingStart }) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);

  const startRecording = async () => {
    try {
      setError('');
      
      // Clear text when starting new recording
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

      console.log('Microphone access granted');

      const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
      
      if (!apiKey) {
        throw new Error('Deepgram API key not found in .env file');
      }

      console.log('API key found, connecting to Deepgram...');

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
        console.log('Deepgram WebSocket connected');

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
        console.log('Recording started');
      };

      ws.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          const transcriptText = data.channel?.alternatives?.[0]?.transcript;
          
          if (transcriptText && transcriptText.trim() !== '') {
            console.log('Received transcript:', transcriptText);
            
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
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
      };

      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      setError(error.message);
      alert('Failed to start recording: ' + error.message);
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...');

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
    <div>
      <button 
        onClick={isRecording ? stopRecording : startRecording}
        className={isRecording ? 'recording' : ''}
      >
        {isRecording ? '⏹ Stop Recording' : '🎤 Start Recording'}
      </button>

      {error && (
        <div style={{ color: '#f44336', marginTop: '10px', padding: '10px', background: '#2a2a2a', borderRadius: '6px' }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;