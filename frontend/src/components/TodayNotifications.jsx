import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function TodayNotifications({ appointments = [], compact = false }) {
  const { t } = useLanguage();
  const count = appointments.length;

  if (count === 0) {
    if (compact) return null;
    return (
      <div className="notification-card notification-empty">
        <span className="notification-icon">🔔</span>
        <p>{t('todayAlertNone')}</p>
      </div>
    );
  }

  if (compact) {
    return (
      <Link to="/appointments" className="notification-banner">
        <span className="notification-icon">🔔</span>
        <span>{t('todayAlertCount', { count })}</span>
        <span className="notification-link">{t('viewAll')} →</span>
      </Link>
    );
  }

  return (
    <div className="notification-card">
      <div className="notification-header">
        <span className="notification-icon">🔔</span>
        <h3>{t('todayAlert')}</h3>
        <span className="notification-badge">{count}</span>
        <Link to="/appointments" className="btn btn-secondary btn-sm">
          {t('viewAll')}
        </Link>
      </div>
      <ul className="notification-list">
        {appointments.map((a) => (
          <li key={a._id}>
            <div>
              <strong>{a.patient?.name || '—'}</strong>
              <span className="notification-meta">
                {a.doctor?.name} · {a.time}
              </span>
            </div>
            <span className={`badge badge-${a.status === 'scheduled' ? 'scheduled' : a.status === 'completed' ? 'completed' : 'cancelled'}`}>
              {t(a.status) || a.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
