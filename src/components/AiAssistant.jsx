import { useState, useRef, useEffect, useCallback } from 'react';
import { ttsService } from '../services/tts';

const SUGGESTED_QUESTIONS = [
  'Tell me about your backend experience',
  'Explain your Azure architecture',
  'What projects have you built?',
  'Why should I hire you?',
  'Explain your AI experience',
  'Tell me about production support',
];

export default function AiAssistant() {
  console.log('AiAssistant component rendering');
  useEffect(() => {
    console.log('AiAssistant component mounted successfully');
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [model, setModel] = useState('gemini-2.5-flash');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  
  const voiceEnabledRef = useRef(voiceEnabled);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Cleanup speech recognition and TTS on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      ttsService.stop();
    };
  }, []);

  // Stop TTS if the assistant panel is closed
  useEffect(() => {
    if (!isOpen) {
      ttsService.stop();
      setIsPlayingVoice(false);
      setIsGeneratingVoice(false);
    }
  }, [isOpen]);

  const speakText = useCallback(async (text) => {
    if (!voiceEnabledRef.current) return;

    ttsService.stop();
    setIsPlayingVoice(false);
    setIsGeneratingVoice(true);

    try {
      const base64Wav = await ttsService.generateSpeech(text, model);
      
      if (!voiceEnabledRef.current || !isOpenRef.current) {
        setIsGeneratingVoice(false);
        return;
      }
      
      setIsGeneratingVoice(false);
      setIsPlayingVoice(true);

      ttsService.playAudio(
        base64Wav,
        () => {
          setIsPlayingVoice(false);
        },
        (err) => {
          console.error('TTS playback failed:', err);
          setIsPlayingVoice(false);
        }
      );
    } catch (err) {
      console.error('TTS generation failed:', err);
      setIsGeneratingVoice(false);
    }
  }, [model]);

  const handleNavigate = useCallback((target) => {
    if (!target) return;
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const sendMessage = useCallback(async (text) => {
    const question = text.trim();
    if (!question || isLoading) return;

    const userMsg = { role: 'user', text: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, model }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const aiMsg = { role: 'ai', text: data.answer };
      setMessages((prev) => [...prev, aiMsg]);
      speakText(data.answer);

      if (data.navigationTarget) {
        setTimeout(() => handleNavigate(data.navigationTarget), 800);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: "Sorry, I couldn't connect to the AI service right now. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, speakText, handleNavigate, model]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleChipClick = (question) => {
    sendMessage(question);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Try Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send after voice input
      setTimeout(() => sendMessage(transcript), 200);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const showSuggestions = messages.length === 0;

  return (
    <>
      {/* Floating Action Button */}
      <button
        className={`ai-fab ${isOpen ? 'ai-fab--open' : ''}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        data-cursor={isOpen ? 'Close' : 'Ask AI'}
      >
        <span className="ai-fab-icon">{isOpen ? '✕' : '🎙'}</span>
        {!isOpen && <span className="ai-fab-label">Ask Kavi AI</span>}
      </button>

      {/* Chat Panel */}
      <div className={`ai-chat-panel ${isOpen ? 'ai-chat-panel--open' : ''}`}>
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-info">
            <span className="ai-chat-avatar">KJ</span>
            <div>
              <strong>Kavi AI</strong>
              <small>Portfolio Assistant</small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="ai-model-select"
              data-cursor="Select Model"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemma-4-26b-a4b-it">Gemma 4 26B</option>
            </select>
            {isPlayingVoice && (
              <button
                className="ai-stop-btn"
                onClick={() => {
                  ttsService.stop();
                  setIsPlayingVoice(false);
                }}
                aria-label="Stop speaking"
                title="Stop speaking"
                data-cursor="Stop Speaking"
              >
                ⏹ Stop
              </button>
            )}
            <button
              className={`ai-voice-toggle ${voiceEnabled ? 'ai-voice-toggle--on' : ''}`}
              onClick={() => {
                setVoiceEnabled((v) => {
                  const next = !v;
                  if (!next) {
                    ttsService.stop();
                    setIsPlayingVoice(false);
                    setIsGeneratingVoice(false);
                  }
                  return next;
                });
              }}
              aria-label={voiceEnabled ? 'Disable voice output' : 'Enable voice output'}
              title={voiceEnabled ? 'Voice on' : 'Voice off'}
              data-cursor={voiceEnabled ? 'Mute' : 'Speak Output'}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="ai-chat-messages" data-lenis-prevent>
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="ai-message ai-message--ai">
              <p>
                Hi! I'm <strong>Kavi AI</strong>, Kaviyarasu's portfolio assistant.
                Ask me anything about his skills, projects, or experience!
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`ai-message ai-message--${msg.role}`}>
              <p>{msg.text}</p>
            </div>
          ))}

          {isLoading && (
            <div className="ai-message ai-message--ai">
              <div className="ai-typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {isGeneratingVoice && (
            <div className="ai-message ai-message--ai">
              <div className="ai-voice-generating">
                <span className="ai-voice-loader-dots">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="ai-voice-loader-text">Generating voice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Chips */}
        {showSuggestions && (
          <div className="ai-chips">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button key={q} className="ai-chip" onClick={() => handleChipClick(q)} data-cursor="Ask Kavi">
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form className="ai-input-bar" onSubmit={handleSubmit}>
          <button
            type="button"
            className={`ai-mic-btn ${isListening ? 'ai-mic-btn--active' : ''}`}
            onClick={startListening}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            data-cursor={isListening ? 'Stop Mic' : 'Voice Input'}
          >
            {isListening ? '⏹' : '🎤'}
          </button>
          <input
            ref={inputRef}
            type="text"
            className="ai-input"
            placeholder={isListening ? 'Listening...' : 'Ask me anything...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || isListening}
          />
          <button
            type="submit"
            className="ai-send-btn"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            data-cursor="Send"
          >
            ➤
          </button>
        </form>
      </div>
    </>
  );
}
