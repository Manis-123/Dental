import { useEffect, useState } from 'react';
import { api } from '../../api';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getAdminOverview();
      setOverview(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!overview) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-banner">{error}</div>;

  const statCards = [
    { label: 'Total Users', value: overview.users, color: '#0d9488', icon: '👥' },
    { label: 'Admins', value: overview.admins, color: '#7c3aed', icon: '👑' },
    { label: 'Staff', value: overview.staff, color: '#2563eb', icon: '🧑‍💼' },
    { label: 'Patients', value: overview.patients, color: '#059669', icon: '🧑‍⚕️' },
    { label: 'Doctors', value: overview.doctors, color: '#0891b2', icon: '👨‍⚕️' },
    { label: 'Appointments', value: overview.appointments, color: '#d97706', icon: '📅' },
    { label: 'Bills', value: overview.bills, color: '#dc2626', icon: '💰' },
    { label: 'Treatments', value: overview.treatments, color: '#8b5cf6', icon: '🏥' },
  ];

  const financialCards = [
    { label: 'Revenue (Paid)', value: `Rs. ${overview.revenue.toLocaleString()}`, color: '#047857', icon: '✅' },
    { label: 'Pending Due', value: `Rs. ${overview.pendingAmount.toLocaleString()}`, color: '#dc2626', icon: '⏳' },
    { label: 'Paid Bills', value: overview.paidBills, color: '#059669', icon: '💳' },
    { label: 'Pending Bills', value: overview.pendingBills, color: '#f59e0b', icon: '📋' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-section">
        <h3>📊 System Statistics</h3>
        <div className="stats-grid admin-stats">
          {statCards.map((card) => (
            <div key={card.label} className="stat-card admin-stat" style={{ borderTopColor: card.color }}>
              <div className="stat-icon">{card.icon}</div>
              <div className="label">{card.label}</div>
              <div className="value">{card.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>💰 Financial Overview</h3>
        <div className="stats-grid admin-stats">
          {financialCards.map((card) => (
            <div key={card.label} className="stat-card admin-stat" style={{ borderTopColor: card.color }}>
              <div className="stat-icon">{card.icon}</div>
              <div className="label">{card.label}</div>
              <div className="value">{card.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="card">
          <h3>📝 Recent Users</h3>
          {overview.recentUsers.length === 0 ? (
            <p className="empty-state">No users yet</p>
          ) : (
            <ul className="admin-list">
              {overview.recentUsers.map((u) => (
                <li key={u._id}>
                  <strong>{u.name}</strong> - {u.email}
                  <span className={`badge badge-${u.role}`}>{u.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>💵 Recent Bills</h3>
          {overview.recentBills.length === 0 ? (
            <p className="empty-state">No bills</p>
          ) : (
            <ul className="admin-list">
              {overview.recentBills.map((b) => (
                <li key={b._id}>
                  <strong>{b.billNumber}</strong> — {b.patient?.name}
                  <span className={`badge badge-${b.status}`}>Rs. {b.total?.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>📅 Today's Summary</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <div className="icon">📅</div>
            <div className="content">
              <div className="label">Today's Appointments</div>
              <div className="value">{overview.todayAppointments}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
