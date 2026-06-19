import React, { useState, useEffect } from 'react';
import { Button, message, Tooltip } from 'antd';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import './VoiceInput.css';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled }) => {
  const { t: tMsg } = useTranslation('messages');

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US'; // Default to English

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      message.success(tMsg('success.save'));
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      if (event.error === 'no-speech') {
        message.warning(tMsg('warning.general'));
      } else if (event.error === 'not-allowed') {
        message.error(tMsg('error.operationFailed'));
      } else {
        message.error(tMsg('error.operationFailed'));
      }
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        message.error(tMsg('error.operationFailed'));
      }
    }
  };

  if (!isSupported) {
    return (
      <Tooltip title="Voice input is not supported in this browser">
        <Button icon={<AudioMutedOutlined />} disabled size="small" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={isListening ? 'Stop listening' : 'Start voice input'}>
      <Button
        icon={<AudioOutlined />}
        onClick={toggleListening}
        disabled={disabled}
        className={`voice-input-button ${isListening ? 'listening' : ''}`}
        size="small"
        type={isListening ? 'primary' : 'default'}
        danger={isListening}
      />
    </Tooltip>
  );
};

export default VoiceInput;
