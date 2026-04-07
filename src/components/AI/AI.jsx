import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useHarStore from '../../store/useHarStore';
import { getAiResponse } from '../../services/api';
import styles from './AI.module.css';

const SUGGESTIONS = [
  'Give me a summary',
  'Show all errors',
  'Find slow requests',
  'Explain the identity flow',
  'Which domains are used?',
];

export default function AI() {
  const isLoaded = useHarStore((s) => s.isLoaded);
  const aiMessages = useHarStore((s) => s.aiMessages);
  const addAiMessage = useHarStore((s) => s.addAiMessage);
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isTyping]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    addAiMessage({ role: 'user', content: msg, timestamp: new Date().toLocaleTimeString() });
    setInput('');
    setIsTyping(true);

    try {
      const response = await getAiResponse(msg);
      addAiMessage({ role: 'ai', content: response, timestamp: new Date().toLocaleTimeString() });
    } catch (err) {
      addAiMessage({
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isLoaded) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🤖</div>
          <h2 className={styles.emptyTitle}>No HAR file loaded</h2>
          <p className={styles.emptyDesc}>Upload a HAR file to chat with the AI assistant</p>
          <button className={styles.emptyBtn} onClick={() => navigate('/')}>Go to Upload</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Assistant</h1>
        <p className={styles.subtitle}>Ask questions about your HAR file analysis</p>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {aiMessages.length === 0 && (
          <div className={styles.message + ' ' + styles.messageAi}>
            👋 Hi! I&apos;m your HAR analysis assistant. Ask me anything about the loaded HAR file — errors, slow requests, auth flow, domains, and more.
          </div>
        )}
        {aiMessages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              msg.role === 'user' ? styles.messageUser : styles.messageAi
            }`}
          >
            {msg.content}
            <div className={styles.messageTime}>{msg.timestamp}</div>
          </div>
        ))}
        {isTyping && (
          <div className={styles.typing}>
            <div className={styles.typingDot} />
            <div className={styles.typingDot} />
            <div className={styles.typingDot} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {aiMessages.length === 0 && (
        <div className={styles.suggestions}>
          {SUGGESTIONS.map((s) => (
            <button key={s} className={styles.suggestionBtn} onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className={styles.inputArea}>
        <input
          className={styles.chatInput}
          type="text"
          placeholder="Ask about errors, latency, domains..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
        />
        <button
          className={styles.sendBtn}
          onClick={() => sendMessage()}
          disabled={isTyping || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
