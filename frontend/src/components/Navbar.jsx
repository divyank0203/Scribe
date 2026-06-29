import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: '#0D0F0E', borderBottom: '1px solid #1E2421' }}
      className="px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <Link to="/dashboard" className="flex items-center gap-2">
        <span className="font-mono text-xl font-bold" style={{ color: '#4ADE80' }}>
          scribe<span className="animate-pulse">_</span>
        </span>
      </Link>

      {user && (
        <div className="flex items-center gap-5">
          <span className="font-mono text-xs" style={{ color: '#6B7C6E' }}>
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="font-mono text-xs px-3 py-1.5 rounded transition-all duration-200"
            style={{ color: '#6B7C6E', border: '1px solid #1E2421' }}
            onMouseEnter={e => {
              e.target.style.color = '#EF4444';
              e.target.style.borderColor = '#EF4444';
            }}
            onMouseLeave={e => {
              e.target.style.color = '#6B7C6E';
              e.target.style.borderColor = '#1E2421';
            }}
          >
            logout
          </button>
        </div>
      )}
    </nav>
  );
}