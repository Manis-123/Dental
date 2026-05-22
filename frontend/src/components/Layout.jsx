import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useClinic } from '../context/ClinicContext';
import { api } from '../api';
import TodayNotifications from './TodayNotifications';

const navKeys = [
  { to: '/', key: 'dashboard', icon: '📊' },
  { to: '/patients', key: 'patients', icon: '👤' },
  { to: '/doctors', key: 'doctors', icon: '👨‍⚕️' },
  { to: '/treatments', key: 'treatments', icon: '🦷' },
  { to: '/appointments', key: 'appointments', icon: '📅' },
  { to: '/bills', key: 'bills', icon: '💰' },
  { to: '/inventory', key: null, label: 'Inventory', icon: '📦' },
  { to: '/expenses', key: null, label: 'Expenses', icon: '💸' },
  { to: '/reports', key: null, label: 'Reports', icon: '📈' },
  { to: '/reminders', key: null, label: 'Reminders', icon: '📲' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [todayAppointments, setTodayAppointments] = useState([]);

  const { clinics, clinicId, selectClinic, currentClinic } = useClinic();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    api.getStats().then((s) => setTodayAppointments(s.todayAppointmentsList || [])).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="app-layout">
      {mobileOpen && <button type="button" className="sidebar-overlay" aria-label="Close menu" onClick={closeMobile} />}
      <aside className={`sidebar${isAdmin ? ' sidebar-admin' : ''}${mobileOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="logo">🦷</span>
          <div>
            <h1>{t('appName')}</h1>
            <p>{currentClinic?.name || (isAdmin ? t('adminPanel') : t('clinicManagement'))}</p>
          </div>
        </div>
        {clinics.length > 0 && (
          <div className="clinic-select-wrap">
            <label>Branch</label>
            <select
              value={clinicId}
              onChange={(e) => {
                selectClinic(e.target.value);
                closeMobile();
              }}
            >
              {clinics.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <nav>
          {isAdmin && (
            <>
              <NavLink
                to="/admin"
                onClick={closeMobile}
                className={({ isActive }) => `nav-link nav-admin${isActive ? ' active' : ''}`}
              >
                <span>🛡️</span>
                {t('adminPanel')}
              </NavLink>
              <NavLink
                to="/clinics"
                onClick={closeMobile}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span>🏥</span>
                Branches
              </NavLink>
            </>
          )}
          {navKeys.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={closeMobile}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.key ? t(item.key) : item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className={`user-role role-${user?.role}`}>{user?.role}</span>
          </div>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            {t('logout')}
          </button>
        </div>
      </aside>
      <div className="layout-main">
        <header className="top-bar">
          <button
            type="button"
            className="menu-toggle"
            aria-label={t('menu')}
            onClick={() => setMobileOpen((o) => !o)}
          >
            ☰
          </button>
          <div className="top-bar-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              title={isDark ? t('lightMode') : t('darkMode')}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {todayAppointments.length > 0 && (
              <span className="notif-bell" title={t('todayAlert')}>
                🔔
                <span className="notif-count">{todayAppointments.length}</span>
              </span>
            )}
          </div>
        </header>
        <TodayNotifications appointments={todayAppointments} compact />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
