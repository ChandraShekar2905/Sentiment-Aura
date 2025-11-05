import { useState, useRef, useEffect } from 'react';
import { createClient } from '@deepgram/sdk';

function AudioRecorder({ onTranscript, onFinalTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
  const deepgramRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });

      // Initialize Deepgram
      const deepgram = createClient(import.meta.env.VITE_DEEPGRAM_API_KEY);
      deepgramRef.current = deepgram;

      // Create WebSocket connection to Deepgram
      const connection = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        interim_results: true,
      });

      socketRef.current = connection;

      // Handle incoming transcripts
      connection.on('open', () => {
        console.log('Deepgram connection opened');
        
        // Setup MediaRecorder to send audio
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm'
        });

        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        });

        mediaRecorder.start(250); // Send data every 250ms
      });

      connection.on('transcript', (data) => {
        const transcriptText = data.channel.alternatives[0].transcript;
        
        if (transcriptText && transcriptText.trim() !== '') {
          setTranscript(prev => {
            const newTranscript = data.is_final 
              ? prev + ' ' + transcriptText 
              : prev + ' ' + transcriptText;
            return newTranscript;
          });

          // Call callback for display
          if (onTranscript) {
            onTranscript(transcriptText, data.is_final);
          }

          // If final transcript, trigger sentiment analysis
          if (data.is_final && onFinalTranscript) {
            onFinalTranscript(transcriptText);
          }
        }
      });

      connection.on('error', (error) => {
        console.error('Deepgram error:', error);
      });

      connection.on('close', () => {
        console.log('Deepgram connection closed');
      });

      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to access microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (socketRef.current) {
      socketRef.current.finish();
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

      {transcript && (
        <div className="transcript">
          <h3>Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;