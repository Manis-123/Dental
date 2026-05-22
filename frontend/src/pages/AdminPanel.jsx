import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminUserManagement from '../components/admin/AdminUserManagement';
import AdminClinicManagement from '../components/admin/AdminClinicManagement';
import AdminDoctorManagement from '../components/admin/AdminDoctorManagement';
import AdminPatientRecords from '../components/admin/AdminPatientRecords';
import AdminSettings from '../components/admin/AdminSettings';

export default function AdminPanel() {
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div className="loading">Loading admin panel...</div>;

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'users', label: '👥 Users', icon: '👥' },
    { id: 'clinics', label: '🏥 Clinics', icon: '🏥' },
    { id: 'doctors', label: '👨‍⚕️ Doctors', icon: '👨‍⚕️' },
    { id: 'patients', label: '🧑‍⚕️ Patients', icon: '🧑‍⚕️' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
  ];

  return (
    <div className="admin-panel">
      <div className="page-header admin-header">
        <div>
          <span className="admin-badge">ADMIN PANEL</span>
          <h2>System Administration</h2>
          <p>Manage users, clinics, doctors, patients, and system settings</p>
        </div>
        <Link to="/" className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="admin-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`admin-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'dashboard' && <AdminDashboard />}
        {tab === 'users' && <AdminUserManagement />}
        {tab === 'clinics' && <AdminClinicManagement />}
        {tab === 'doctors' && <AdminDoctorManagement />}
        {tab === 'patients' && <AdminPatientRecords />}
        {tab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}
