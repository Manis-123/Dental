import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import RevenueChart from '../components/RevenueChart';
import TodayNotifications from '../components/TodayNotifications';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getStats()
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <>
        <div className="page-header">
          <h2>{t('dashboard')}</h2>
        </div>
        <div className="error-banner">
          {t('backendError')} ({error})
        </div>
      </>
    );
  }

  if (!stats) return <div className="loading">{t('loading')}</div>;

  const cards = [
    { label: t('totalPatients'), value: stats.patients, link: '/patients' },
    { label: t('doctors'), value: stats.doctors, link: '/doctors' },
    { label: t('treatments'), value: stats.treatments, link: '/treatments' },
    { label: t('todaysAppointments'), value: stats.todayAppointments, link: '/appointments' },
    { label: t('totalBills'), value: stats.totalBills, link: '/bills' },
    { label: t('pendingBills'), value: stats.pendingBills, link: '/bills' },
    { label: t('paidBills'), value: stats.paidBills, link: '/bills' },
    {
      label: t('revenuePaid'),
      value: `${t('rs')} ${(stats.revenue || 0).toLocaleString()}`,
      link: '/bills',
    },
  ];

  return (
    <>
      <div className="page-header">
        <h2>{t('dashboard')}</h2>
        <p>{t('dashboardSubtitle')}</p>
        {user?.role === 'admin' && (
          <Link to="/admin" className="btn btn-primary" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
            🛡️ {t('openAdminPanel')}
          </Link>
        )}
      </div>

      <TodayNotifications appointments={stats.todayAppointmentsList || []} />

      <div className="dashboard-grid">
        <div className="card chart-card">
          <h3>{t('revenueChart')}</h3>
          <RevenueChart data={stats.revenueChart || []} />
        </div>
        <div className="stats-grid dashboard-stats">
          {cards.map((c) => (
            <Link key={c.label} to={c.link} className="stat-card" style={{ textDecoration: 'none' }}>
              <div className="label">{c.label}</div>
              <div className="value">{c.value}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>{t('quickActions')}</h3>
        <p className="text-muted" style={{ marginBottom: '1rem' }}>
          {t('quickActionsHint')}
        </p>
        <div className="quick-actions-row">
          <Link to="/patients" className="btn btn-primary">
            {t('addPatient')}
          </Link>
          <Link to="/appointments" className="btn btn-primary">
            {t('bookAppointment')}
          </Link>
          <Link to="/treatments" className="btn btn-primary">
            {t('addTreatment')}
          </Link>
          <Link to="/bills" className="btn btn-primary">
            {t('createBill')}
          </Link>
        </div>
      </div>
    </>
  );
}
