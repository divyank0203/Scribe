import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function Editor() {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [existingEntry, setExistingEntry] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      API.get('/entries').then(res => {
        const found = res.data.find(e => e._id === id);
        if (found) {
          setExistingEntry(found);
          setContent(found.content);
          setCharCount(found.content.length);
          setTags(found.tags?.join(', ') || '');
        }
      });
    }
  }, [id]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  const save = async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (id) {
        await API.put(`/entries/${id}`, { content, tags: tagArray });
      } else {
        await API.post('/entries', { content, tags: tagArray });
      }
      navigate('/dashboard');
    } catch {
      setSaving(false);
    }
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0F0E' }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="font-mono text-xs transition-colors"
            style={{ color: '#6B7C6E' }}
            onMouseEnter={e => e.target.style.color = '#E8EDE9'}
            onMouseLeave={e => e.target.style.color = '#6B7C6E'}
          >
            ← back
          </button>
          <span className="font-mono text-xs" style={{ color: '#6B7C6E' }}>
            {id ? 'editing entry' : today}
          </span>
        </div>

        {/* Editor */}
        <div
          className="rounded-lg overflow-hidden mb-4"
          style={{ border: '1px solid #1E2421' }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{
              backgroundColor: '#141716',
              borderBottom: '1px solid #1E2421'
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#EF4444' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#4ADE80' }} />
            <span className="font-mono text-xs ml-2" style={{ color: '#6B7C6E' }}>
              entry.md
            </span>
          </div>

          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="what did you work on today? what clicked? what didn't?"
            className="w-full text-sm leading-relaxed resize-none outline-none p-5"
            style={{
              backgroundColor: '#0D0F0E',
              color: '#E8EDE9',
              minHeight: '280px',
              caretColor: '#4ADE80',
              fontFamily: 'Inter, sans-serif'
            }}
          />

          <div
            className="flex items-center justify-between px-4 py-2"
            style={{
              backgroundColor: '#141716',
              borderTop: '1px solid #1E2421'
            }}
          >
            <span className="font-mono text-xs" style={{ color: '#1E2421' }}>
              ai summary generated on save
            </span>
            <span className="font-mono text-xs" style={{ color: '#6B7C6E' }}>
              {charCount} chars
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="tags: DSA, React, System Design..."
            className="w-full font-mono text-xs px-4 py-2.5 rounded outline-none transition-all"
            style={{
              backgroundColor: '#141716',
              color: '#E8EDE9',
              border: '1px solid #1E2421',
              caretColor: '#4ADE80'
            }}
            onFocus={e => e.target.style.borderColor = '#4ADE80'}
            onBlur={e => e.target.style.borderColor = '#1E2421'}
          />
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={saving || !content.trim()}
            className="font-mono text-sm px-6 py-2.5 rounded transition-all"
            style={{
              backgroundColor: saving || !content.trim() ? '#0D0F0E' : '#166534',
              color: '#4ADE80',
              border: '1px solid #4ADE80',
              opacity: saving || !content.trim() ? 0.4 : 1
            }}
          >
            {saving ? 'saving...' : '→ save entry'}
          </button>
        </div>

        {/* Previous Summary */}
        {existingEntry?.aiSummary && (
          <div
            className="mt-8 rounded-lg p-4"
            style={{ backgroundColor: '#141716', border: '1px solid #1E2421' }}
          >
            <p className="font-mono text-xs mb-2" style={{ color: '#4ADE80' }}>
              ✦ previous ai summary
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7C6E' }}>
              {existingEntry.aiSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}