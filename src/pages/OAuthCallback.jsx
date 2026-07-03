import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * The backend's OAuth2LoginSuccessHandler redirects the browser here after
 * Google/GitHub login sets the session cookie. We just need to re-fetch
 * /api/auth/me to pick up the now-authenticated session.
 */
export default function OAuthCallback() {
  const { refresh } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await refresh();
      navigate('/dashboard', { replace: true });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-sub font-mono text-sm animate-pulse">finishing sign-in…</div>
    </div>
  );
}
