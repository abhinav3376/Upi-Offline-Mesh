import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authApi } from '../api/client.js';
import AuthShell from '../components/AuthShell.jsx';
import SocialButton from '../components/SocialButton.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Reach your mesh — devices, packets, and the ledger behind them."
    >
      <div className="space-y-3 mb-6">
        <SocialButton provider="google" href={authApi.googleUrl()} />
        <SocialButton provider="github" href={authApi.githubUrl()} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-panelborder" />
        <span className="text-xs text-sub font-mono">or with a password</span>
        <div className="h-px flex-1 bg-panelborder" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-sub mb-1.5">username</label>
          <input
            className="w-full bg-panel border border-panelborder rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="alice@demo"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-sub mb-1.5">password</label>
          <input
            type="password"
            className="w-full bg-panel border border-panelborder rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-mint text-bg font-semibold rounded-lg py-2.5 text-sm hover:shadow-glow transition-shadow disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-sub text-center mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-mint hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
