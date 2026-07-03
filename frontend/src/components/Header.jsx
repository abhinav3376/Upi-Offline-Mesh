import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const PROVIDER_LABEL = { LOCAL: 'Password', GOOGLE: 'Google', GITHUB: 'GitHub' };

export default function Header({ title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-panelborder flex items-center justify-between px-6">
      <div>
        <h1 className="text-base font-semibold">{title}</h1>
        {subtitle && <p className="text-xs text-sub mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right leading-tight">
          <div className="text-sm font-medium">{user?.name}</div>
          <div className="text-xs text-sub font-mono">
            {PROVIDER_LABEL[user?.provider] || user?.provider}
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-mint/15 border border-mint/30 flex items-center justify-center text-mint text-sm font-semibold">
          {(user?.name || '?').slice(0, 1).toUpperCase()}
        </div>
        <button
          onClick={onLogout}
          className="text-xs font-medium border border-panelborder rounded-lg px-3 py-2 text-sub hover:text-rose-400 hover:border-rose-500/40 transition-colors"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
