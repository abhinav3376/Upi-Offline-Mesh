export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include', // send/receive the session cookie cross-origin
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let body = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    const message = (body && body.error) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, data) => request(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
};

export const authApi = {
  signup: (name, username, password) => api.post('/api/auth/signup', { name, username, password }),
  login: (username, password) => api.post('/api/auth/login', { username, password }),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
  googleUrl: () => `${API_BASE}/oauth2/authorization/google`,
  githubUrl: () => `${API_BASE}/oauth2/authorization/github`,
};

export const meshApi = {
  serverKey: () => api.get('/api/server-key'),
  state: () => api.get('/api/mesh/state'),
  gossip: () => api.post('/api/mesh/gossip'),
  flush: () => api.post('/api/mesh/flush'),
  reset: () => api.post('/api/mesh/reset'),
  demoSend: (payload) => api.post('/api/demo/send', payload),
  accounts: () => api.get('/api/accounts'),
  transactions: () => api.get('/api/transactions'),
};
