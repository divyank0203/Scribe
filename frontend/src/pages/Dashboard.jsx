import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import EntryCard from '../components/EntryCard';
import ChatPanel from '../components/ChatPanel';

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [digest, setDigest] = useState('');
  const [digestLoading, setDigestLoading] = useState(false);
  const [showDigest, setShowDigest] = useState(false);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/entries')
      .then(res => setEntries(res.data))
      .finally(() => setEntriesLoading(false));
  }, []);

  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    const dates = entries.map(e => new Date(e.createdAt).toDateString());
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (dates.includes(d.toDateString())) {
        streak++;
      } else if (i > 0) break;
    }
    return streak;
  };

  const thisWeekCount = entries.filter(e => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(e.createdAt) >= weekAgo;
  }).length;

  const getDigest = async () => {
    setDigestLoading(true);
    setShowDigest(true);
    setDigest('');
    try {
      const res = await API.get('/entries/digest');
      setDigest(res.data.digest);
    } catch {
      setDigest('Could not generate digest. Try again.');
    } finally {
      setDigestLoading(false);
    }
  };

  const stats = [
    { label: 'day streak', value: calculateStreak() },
    { label: 'total entries', value: entries.length },
    { label: 'this week', value: thisWeekCount }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0F0E' }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg p-4 text-center"
              style={{ backgroundColor: '#141716', border: '1px solid #1E2421' }}
            >
              <p className="font-mono text-3xl font-bold" style={{ color: '#4ADE80' }}>
                {value}
              </p>
              <p className="font-mono text-xs mt-1" style={{ color: '#6B7C6E' }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => navigate('/editor')}
            className="font-mono text-sm px-4 py-2 rounded transition-all"
            style={{
              backgroundColor: '#166534',
              color: '#4ADE80',
              border: '1px solid #4ADE80'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#14532d'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#166534'}
          >
            + new entry
          </button>

          <button
            onClick={getDigest}
            className="font-mono text-sm px-4 py-2 rounded transition-all"
            style={{
              backgroundColor: '#0D0F0E',
              color: '#6B7C6E',
              border: '1px solid #1E2421'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#E8EDE9';
              e.currentTarget.style.borderColor = '#6B7C6E';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#6B7C6E';
              e.currentTarget.style.borderColor = '#1E2421';
            }}
          >
            weekly digest
          </button>

          <button
            onClick={() => setShowChat(true)}
            className="font-mono text-sm px-4 py-2 rounded transition-all ml-auto"
            style={{
              backgroundColor: '#0D0F0E',
              color: '#6B7C6E',
              border: '1px solid #1E2421'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#4ADE80';
              e.currentTarget.style.borderColor = '#4ADE80';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#6B7C6E';
              e.currentTarget.style.borderColor = '#1E2421';
            }}
          >
            ✦ chat with journal
          </button>
        </div>

        {/* Digest */}
        {showDigest && (
          <div
            className="rounded-lg p-5 mb-6"
            style={{ backgroundColor: '#141716', border: '1px solid #1E2421' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs" style={{ color: '#4ADE80' }}>
                ✦ weekly digest
              </span>
              <button
                onClick={() => setShowDigest(false)}
                className="font-mono text-lg leading-none"
                style={{ color: '#6B7C6E' }}
              >
                ×
              </button>
            </div>
            {digestLoading
              ? (
                <p className="font-mono text-xs" style={{ color: '#6B7C6E' }}>
                  generating<span className="animate-pulse">...</span>
                </p>
              )
              : (
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: '#E8EDE9' }}
                >
                  {digest}
                </p>
              )
            }
          </div>
        )}

        {/* Entries */}
        <div>
          <p className="font-mono text-xs mb-4" style={{ color: '#6B7C6E' }}>
            entries ({entries.length})
          </p>

          {entriesLoading ? (
            <div className="text-center py-20">
              <p className="font-mono text-xs" style={{ color: '#6B7C6E' }}>
                loading<span className="animate-pulse">...</span>
              </p>
            </div>
          ) : entries.length === 0 ? (
            <div
              className="text-center py-20 rounded-lg"
              style={{ border: '1px dashed #1E2421' }}
            >
              <p className="font-mono text-sm" style={{ color: '#6B7C6E' }}>
                no entries yet
              </p>
              <p className="font-mono text-xs mt-2" style={{ color: '#1E2421' }}>
                what did you work on today?
              </p>
              <button
                onClick={() => navigate('/editor')}
                className="font-mono text-xs mt-4 px-4 py-2 rounded transition-all"
                style={{
                  color: '#4ADE80',
                  border: '1px solid #1E2421'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4ADE80'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1E2421'}
              >
                write first entry
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map(entry => (
                <EntryCard
                  key={entry._id}
                  entry={entry}
                  onDelete={id => setEntries(prev => prev.filter(e => e._id !== id))}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showChat && <ChatPanel onClose={() => setShowChat(false)} />}
    </div>
  );
}