import { useState, useRef, useEffect } from 'react';
import API from '../api/axios';

export default function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setLoading(true);

    try {
      const res = await API.post('/chat', { question });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed right-0 top-0 h-full w-96 flex flex-col z-50"
      style={{
        backgroundColor: '#0D0F0E',
        borderLeft: '1px solid #1E2421',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.4)'
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid #1E2421' }}
      >
        <div>
          <p className="font-mono text-sm font-bold" style={{ color: '#4ADE80' }}>
            journal.chat<span className="animate-pulse">_</span>
          </p>
          <p className="font-mono text-xs mt-0.5" style={{ color: '#6B7C6E' }}>
            last 20 entries as context
          </p>
        </div>
        <button
          onClick={onClose}
          className="font-mono text-lg leading-none transition-colors"
          style={{ color: '#6B7C6E' }}
          onMouseEnter={e => e.target.style.color = '#E8EDE9'}
          onMouseLeave={e => e.target.style.color = '#6B7C6E'}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center mt-16 px-4">
            <p className="font-mono text-xs" style={{ color: '#6B7C6E' }}>
              ask anything about your journal
            </p>
            <div className="mt-4 space-y-2">
              {[
                'what did I study last week?',
                'where have I been struggling?',
                'what was my biggest win?'
              ].map(q => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="block w-full text-left font-mono text-xs px-3 py-2 rounded transition-all"
                  style={{
                    backgroundColor: '#141716',
                    color: '#6B7C6E',
                    border: '1px solid #1E2421'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#4ADE80';
                    e.currentTarget.style.color = '#4ADE80';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#1E2421';
                    e.currentTarget.style.color = '#6B7C6E';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-xs text-xs leading-relaxed px-3 py-2 rounded font-mono"
              style={msg.role === 'user'
                ? { backgroundColor: '#166534', color: '#4ADE80', border: '1px solid #166534' }
                : { backgroundColor: '#141716', color: '#E8EDE9', border: '1px solid #1E2421' }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="font-mono text-xs px-3 py-2 rounded"
              style={{ backgroundColor: '#141716', color: '#4ADE80', border: '1px solid #1E2421' }}
            >
              thinking<span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4" style={{ borderTop: '1px solid #1E2421' }}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="ask your journal..."
            className="flex-1 font-mono text-xs px-3 py-2 rounded outline-none transition-all"
            style={{
              backgroundColor: '#141716',
              color: '#E8EDE9',
              border: '1px solid #1E2421',
              caretColor: '#4ADE80'
            }}
            onFocus={e => e.target.style.borderColor = '#4ADE80'}
            onBlur={e => e.target.style.borderColor = '#1E2421'}
          />
          <button
            onClick={send}
            disabled={loading}
            className="font-mono text-xs px-4 py-2 rounded transition-all"
            style={{
              backgroundColor: '#166534',
              color: '#4ADE80',
              border: '1px solid #4ADE80',
              opacity: loading ? 0.5 : 1
            }}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}