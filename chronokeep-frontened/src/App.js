import React, { useState, useEffect } from 'react';
import './App.css';

const API = 'http://localhost:5001/api';

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [unlockAt, setUnlockAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch entries
  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch(`${API}/entries`, {
        headers: { Authorization: token },
      })
        .then(res => res.json())
        .then(setEntries)
        .catch(() => setError('Failed to fetch entries.'))
        .finally(() => setLoading(false));
    }
  }, [token]);

  // Register or login
  const handleAuth = async (type) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (type === 'login' && res.ok) {
        const data = await res.json();
        setToken(data.token);
      } else if (type === 'register' && res.ok) {
        alert('Registered! Now log in.');
      } else {
        setError('Invalid Username or Password.');
      }
    } catch {
      setError('Could not connect to server.');
    }
    setLoading(false);
  };

  // Create entry
  const handleCreate = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ content, unlockAt }),
      });
      if (!res.ok) throw new Error();
      setContent('');
      setUnlockAt('');
      // Refresh entries
      const entriesRes = await fetch(`${API}/entries`, {
        headers: { Authorization: token },
      });
      setEntries(await entriesRes.json());
    } catch {
      setError('Failed to create entry.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken('');
    setUsername('');
    setPassword('');
    setEntries([]);
    setContent('');
    setUnlockAt('');
    setError('');
  };

  const refreshEntries = () => {
    setLoading(true);
    fetch(`${API}/entries`, {
      headers: { Authorization: token },
    })
      .then(res => res.json())
      .then(setEntries)
      .catch(() => setError('Failed to fetch entries.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="ck-root">
      <div className="ck-main-card">
        {/* Sidebar */}
        <div className="ck-sidebar">
          <div className="ck-logo">ChronoKeep</div>
          {token && (
            <button className="ck-btn ck-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
        {/* Main Content */}
        <div className="ck-content-area">
          {!token ? (
            <form
              className="ck-login-form"
              onSubmit={e => {
                e.preventDefault();
                handleAuth('login');
              }}
            >
              <h2>Login to your Journal</h2>
              {error && <div className="ck-error">{error}</div>}
              <input
                className="ck-input"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <input
                className="ck-input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
              <div className="ck-btn-row">
                <button className="ck-btn" type="submit" disabled={loading}>
                  Login
                </button>
                <button
                  className="ck-btn"
                  type="button"
                  onClick={() => handleAuth('register')}
                  disabled={loading}
                >
                  Register
                </button>
              </div>
              {loading && <div className="ck-loading">Loading...</div>}
            </form>
          ) : (
            <>
              <div className="ck-header">
                <h1>Welcome Back!</h1>
              </div>
              {error && <div className="ck-error">{error}</div>}
              <form
                className="ck-entry-form"
                onSubmit={e => {
                  e.preventDefault();
                  handleCreate();
                }}
              >
                <label htmlFor="entry-content">New Journal Entry</label>
                <textarea
                  id="entry-content"
                  className="ck-textarea"
                  placeholder="Write your entry..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  disabled={loading}
                  required
                />
                <label htmlFor="entry-unlock">Unlock At</label>
                <input
                  id="entry-unlock"
                  className="ck-input"
                  type="datetime-local"
                  value={unlockAt}
                  onChange={e => setUnlockAt(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  className="ck-btn"
                  type="submit"
                  disabled={loading || !content || !unlockAt}
                >
                  Create Entry
                </button>
              </form>
              <div className="ck-entries-section">
                <div className="ck-entries-header">
                  <h2>Your Entries</h2>
                  <button
                    className="ck-btn"
                    onClick={refreshEntries}
                    disabled={loading}
                  >
                    Refresh
                  </button>
                </div>
                {loading ? (
                  <div className="ck-loading">Loading...</div>
                ) : (
                  <ul className="ck-entries">
                    {entries.length === 0 && (
                      <li className="ck-empty">No entries yet.</li>
                    )}
                    {entries.map(e => (
                      <li
                        key={e._id}
                        className={`ck-entry ${e.locked ? 'ck-locked' : 'ck-unlocked'}`}
                      >
                        <span className="ck-lock">
                          {e.locked ? '🔒' : '📝'}
                        </span>
                        <span className="ck-content">{e.content}</span>
                        <span className="ck-date">
                          Unlocks: {new Date(e.unlockAt).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
