import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0D0F0E' }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-mono text-3xl font-bold" style={{ color: '#4ADE80' }}>
            scribe<span className="animate-pulse">_</span>
          </h1>
          <p className="font-mono text-xs mt-2" style={{ color: '#6B7C6E' }}>
            start logging your journey
          </p>
        </div>

        <div
          className="rounded-lg p-6"
          style={{ backgroundColor: '#141716', border: '1px solid #1E2421' }}
        >
          <p className="font-mono text-sm mb-6" style={{ color: '#E8EDE9' }}>
            create account
          </p>

          {error && (
            <div
              className="font-mono text-xs px-3 py-2 rounded mb-4"
              style={{
                backgroundColor: '#1a0a0a',
                color: '#EF4444',
                border: '1px solid #EF4444'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'name', value: name, set: setName, type: 'text' },
              { label: 'email', value: email, set: setEmail, type: 'email' },
              { label: 'password', value: password, set: setPassword, type: 'password' }
            ].map(({ label, value, set, type }) => (
              <div key={label}>
                <label
                  className="font-mono text-xs block mb-1.5"
                  style={{ color: '#6B7C6E' }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={e => set(e.target.value)}
                  required
                  className="w-full font-mono text-sm px-3 py-2.5 rounded outline-none transition-all"
                  style={{
                    backgroundColor: '#0D0F0E',
                    color: '#E8EDE9',
                    border: '1px solid #1E2421',
                    caretColor: '#4ADE80'
                  }}
                  onFocus={e => e.target.style.borderColor = '#4ADE80'}
                  onBlur={e => e.target.style.borderColor = '#1E2421'}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-mono text-sm py-2.5 rounded transition-all mt-2"
              style={{
                backgroundColor: loading ? '#0D0F0E' : '#166534',
                color: '#4ADE80',
                border: '1px solid #4ADE80',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'creating account...' : '→ create account'}
            </button>
          </form>
        </div>

        <p className="font-mono text-xs text-center mt-4" style={{ color: '#6B7C6E' }}>
          have an account?{' '}
          <Link
            to="/login"
            style={{ color: '#4ADE80' }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >
            login
          </Link>
        </p>
      </div>
    </div>
  );
}