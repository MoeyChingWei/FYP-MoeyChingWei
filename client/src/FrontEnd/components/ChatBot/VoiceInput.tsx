import React, { useState, useEffect, useRef } from 'react';
import { Button, message, Tooltip, Badge } from 'antd';
import {
  AudioFilled,
  AudioMutedOutlined,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import './VoiceInput.css';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onRecordingChange?: (recording: boolean) => void;
  disabled?: boolean;
  language?: string; // 'en-US', 'zh-CN', 'zh-TW'
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onRecordingChange,
  disabled,
  language = 'en-US'
}) => {
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const shouldAutoRestartRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 6;

  useEffect(() => {
    onRecordingChange?.(isRecorderOpen);
  }, [isRecorderOpen, onRecordingChange]);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      console.warn('Speech Recognition API not supported in this browser');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true; // Keep listening for continuous speech
    recognitionInstance.interimResults = true; // Show interim results
    recognitionInstance.lang = language;
    recognitionInstance.maxAlternatives = 3; // Provide more alternatives for better accuracy

    console.log('Speech recognition initialized with language:', recognitionInstance.lang);

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setIsInitializing(false);
      setInterimTranscript('');
      console.log('Voice input started');
    };

    recognitionInstance.onresult = (event: any) => {
      let interim = '';
      let final = '';

      // Process all results, not just new ones
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' '; // Add space between sentences
        } else {
          interim += transcript;
        }
      }

      // Show interim results immediately
      if (interim) {
        setInterimTranscript(interim);
        console.log('Interim transcript:', interim);
      }

      // Process final results immediately
      if (final) {
        const trimmedFinal = final.trim();
        console.log('Final transcript:', trimmedFinal);
        setFinalTranscript((prev) => (prev ? `${prev} ${trimmedFinal}` : trimmedFinal));
        setInterimTranscript('');
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsInitializing(false);
      setInterimTranscript('');

      if (event.error === 'no-speech') {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          message.warning(`No speech detected. Retry ${retryCountRef.current}/${maxRetries}...`);
          // Faster auto retry (500ms instead of 1000ms)
          setTimeout(() => {
            if (recognitionInstance && shouldAutoRestartRef.current) {
              try {
                setIsInitializing(true);
                recognitionInstance.start();
              } catch (err) {
                setIsInitializing(false);
                console.error('Auto-retry failed:', err);
              }
            }
          }, 500); // Reduced from 1000ms to 500ms
        } else {
          message.warning('No speech detected yet. Please speak closer to the microphone.');
          retryCountRef.current = 0;
        }
      } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        shouldAutoRestartRef.current = false;
        setIsRecorderOpen(false);
        message.error('Microphone access denied. Please enable microphone permission in browser settings.');
      } else if (event.error === 'aborted') {
        console.log('Voice input aborted.');
      } else if (event.error === 'audio-capture') {
        shouldAutoRestartRef.current = false;
        setIsRecorderOpen(false);
        message.error('No microphone detected. Please connect a microphone.');
      } else if (event.error === 'network') {
        shouldAutoRestartRef.current = false;
        setIsRecorderOpen(false);
        message.error('Network error. Please check your internet connection.');
      } else {
        shouldAutoRestartRef.current = false;
        setIsRecorderOpen(false);
        message.error(`Voice input error: ${event.error}`);
      }
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      setIsInitializing(false);
      console.log('Voice input ended');

      if (shouldAutoRestartRef.current) {
        // Faster restart (250ms instead of 250ms)
        window.setTimeout(() => {
          if (!shouldAutoRestartRef.current) return;

          try {
            setIsInitializing(true);
            recognitionInstance.start();
          } catch (error) {
            setIsInitializing(false);
            console.error('Failed to restart voice recognition:', error);
          }
        }, 200); // Reduced to 200ms for faster response
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        try {
          shouldAutoRestartRef.current = false;
          recognitionInstance.stop();
        } catch (err) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [onTranscript, language]);

  const startRecording = () => {
    if (!recognition) {
      message.error('Voice recognition not initialized');
      return;
    }

    try {
      shouldAutoRestartRef.current = true;
      setIsRecorderOpen(true);
      setIsInitializing(true);
      setInterimTranscript('');
      setFinalTranscript('');
      retryCountRef.current = 0;
      console.log('Starting voice input...');
      recognition.start();
    } catch (error: any) {
      console.error('Failed to start recognition:', error);
      setIsInitializing(false);

      if (error.message && error.message.includes('already started')) {
        setIsRecorderOpen(true);
      } else {
        shouldAutoRestartRef.current = false;
        setIsRecorderOpen(false);
        message.error('Failed to start voice input. Please try again.');
      }
    }
  };

  const stopRecognition = () => {
    if (!recognition) return;

    try {
      recognition.stop();
    } catch (error) {
      // Ignore stop errors when the browser has already ended recognition.
    }
  };

  const cancelRecording = () => {
    shouldAutoRestartRef.current = false;
    stopRecognition();
    setIsRecorderOpen(false);
    setIsListening(false);
    setIsInitializing(false);
    setInterimTranscript('');
    setFinalTranscript('');
    message.info('Voice input cancelled.');
  };

  const confirmRecording = () => {
    const transcript = (finalTranscript || interimTranscript).trim();

    if (!transcript) {
      message.warning('Still listening. Please speak, then press ✓ again.');

      if (!isListening && !isInitializing && recognition) {
        try {
          shouldAutoRestartRef.current = true;
          setIsInitializing(true);
          recognition.start();
        } catch (error) {
          setIsInitializing(false);
          console.error('Failed to restart recognition:', error);
        }
      }

      return;
    }

    shouldAutoRestartRef.current = false;
    stopRecognition();
    setIsRecorderOpen(false);
    setIsListening(false);
    setIsInitializing(false);
    setInterimTranscript('');
    setFinalTranscript('');

    onTranscript(transcript);
    message.success('Voice recorded successfully!');
  };

  if (!isSupported) {
    return (
      <Tooltip title="Voice input is not supported in this browser. Please use Chrome or Edge.">
        <Button
          icon={<AudioMutedOutlined />}
          disabled
          size="large"
          type="text"
          className="voice-input-button"
        />
      </Tooltip>
    );
  }

  const getButtonIcon = () => {
    if (isInitializing) return <LoadingOutlined />;
    if (isListening) return <AudioFilled />;
    return <AudioFilled />;
  };

  const getTooltipTitle = () => {
    if (isInitializing) return 'Initializing...';
    if (isListening) return interimTranscript || 'Listening... Click to stop';
    return 'Start voice input';
  };

  if (isRecorderOpen) {
    const transcriptPreview = (interimTranscript || finalTranscript).trim();

    return (
      <div className="voice-recorder-panel" aria-label="Voice recorder">
        <div className="voice-wave" aria-hidden="true">
          {Array.from({ length: 34 }).map((_, index) => (
            <span key={index} style={{ animationDelay: `${(index % 10) * 0.06}s` }} />
          ))}
        </div>
        <div className="voice-recorder-status" title={transcriptPreview || undefined}>
          {transcriptPreview || (isInitializing ? 'Starting...' : 'Listening...')}
        </div>
        <Tooltip title="Cancel voice input">
          <Button
            type="text"
            shape="circle"
            icon={<CloseOutlined />}
            className="voice-recorder-action cancel"
            onClick={cancelRecording}
          />
        </Tooltip>
        <Tooltip title="Use transcript">
          <Button
            type="text"
            shape="circle"
            icon={<CheckOutlined />}
            className="voice-recorder-action confirm"
            onClick={confirmRecording}
          />
        </Tooltip>
      </div>
    );
  }

  return (
    <Tooltip title={getTooltipTitle()}>
      <Badge dot={isListening} color="#ff4d4f" className="voice-input-badge">
        <Button
          icon={getButtonIcon()}
          onClick={startRecording}
          disabled={disabled || isInitializing}
          className={`voice-input-button ${isListening ? 'listening' : ''} ${isInitializing ? 'initializing' : ''}`}
          size="large"
          type={isListening ? 'primary' : 'text'}
          danger={isListening}
        />
      </Badge>
    </Tooltip>
  );
};

export default VoiceInput;
