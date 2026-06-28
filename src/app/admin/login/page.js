'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, KeyRound } from 'lucide-react';
import styles from '@/styles/admin.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <Lock size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
          Admin Panel
        </div>
        <p className={styles.loginSubtitle}>Sign in to manage your portfolio</p>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className={styles.input}
              placeholder="admin@portfolio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className={styles.loginError}>{error}</div>}

          <button
            type="submit"
            className={`btn btn-primary ${styles.loginBtn}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
