import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function EntryCard({ entry, onDelete }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this entry?')) return;
    setDeleting(true);
    await API.delete(`/entries/${entry._id}`);
    onDelete(entry._id);
  };

  const date = new Date(entry.createdAt);
  const dateStr = date.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  const timeStr = date.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#141716',
        border: '1px solid #1E2421',
        borderLeft: `3px solid ${hovered ? '#4ADE80' : '#1E2421'}`,
        transition: 'all 0.2s ease'
      }}
      className="rounded-lg p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs" style={{ color: '#4ADE80' }}>
            {dateStr}
          </span>
          <span className="font-mono text-xs" style={{ color: '#6B7C6E' }}>
            {timeStr}
          </span>
        </div>

        <div
          className="flex gap-3 transition-opacity duration-200"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <button
            onClick={() => navigate(`/editor/${entry._id}`)}
            className="font-mono text-xs transition-colors duration-150"
            style={{ color: '#6B7C6E' }}
            onMouseEnter={e => e.target.style.color = '#4ADE80'}
            onMouseLeave={e => e.target.style.color = '#6B7C6E'}
          >
            edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="font-mono text-xs transition-colors duration-150"
            style={{ color: '#6B7C6E' }}
            onMouseEnter={e => e.target.style.color = '#EF4444'}
            onMouseLeave={e => e.target.style.color = '#6B7C6E'}
          >
            {deleting ? '...' : 'delete'}
          </button>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: '#E8EDE9' }}>
        {entry.content}
      </p>

      {entry.aiSummary && (
        <div
          className="rounded p-3 mb-3"
          style={{ backgroundColor: '#0D0F0E', border: '1px solid #1E2421' }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs" style={{ color: '#4ADE80' }}>✦ ai summary</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#6B7C6E' }}>
            {entry.aiSummary}
          </p>
        </div>
      )}

      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {entry.tags.map(tag => (
            <span
              key={tag}
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor: '#0D0F0E',
                color: '#4ADE80',
                border: '1px solid #1E2421'
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}