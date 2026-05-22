import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SettingsToggles from '../components/SettingsToggles';
import '../styles/login.css';

export default function Login() {
  const { t } = useLanguage();
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const userData = await login(email.trim(), password);
      navigate(userData.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Check email/password and server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <SettingsToggles className="login-settings" />
      <div className="login-container">
        <div className="login-card">
          <div className="login-brand">
            <span className="logo">🦷</span>
            <h1>{t('appName')}</h1>
            <p>{t('clinicSystem')}</p>
          </div>

          <div className="login-content">
            <p className="login-subtitle">Access your dental clinic account</p>

            {error && (
              <div className="error-banner">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>{t('email')}</label>
                <input
                  type="email"
                  placeholder="admin@dentalcare.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label>{t('password')}</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  minLength={6}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    {t('loggingIn')}
                  </>
                ) : (
                  t('login')
                )}
              </button>
            </form>

            <p className="login-register-link">
              {t('newAccount')} <Link to="/register">{t('registerHere')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
