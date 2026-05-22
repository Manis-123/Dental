import { useState } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    clinic_name: localStorage.getItem('clinic_name') || 'Dental Clinic Management System',
    maintenance_mode: localStorage.getItem('maintenance_mode') === 'true',
    appointment_buffer: localStorage.getItem('appointment_buffer') || '15',
    max_patients_per_day: localStorage.getItem('max_patients_per_day') || '50',
    email_notifications: localStorage.getItem('email_notifications') !== 'false',
    sms_notifications: localStorage.getItem('sms_notifications') !== 'false',
    backup_frequency: localStorage.getItem('backup_frequency') || 'daily',
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    try {
      Object.entries(settings).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          localStorage.setItem(key, value.toString());
        } else {
          localStorage.setItem(key, value);
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setError('');
    } catch (err) {
      setError('Failed to save settings: ' + err.message);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default values?')) {
      setSettings({
        clinic_name: 'Dental Clinic Management System',
        maintenance_mode: false,
        appointment_buffer: '15',
        max_patients_per_day: '50',
        email_notifications: true,
        sms_notifications: true,
        backup_frequency: 'daily',
      });
      localStorage.clear();
    }
  };

  return (
    <div className="admin-settings">
      <div className="card">
        <h3>⚙️ System Settings</h3>

        {error && <div className="error-banner">{error}</div>}
        {saved && <div className="success-banner">✅ Settings saved successfully!</div>}

        <div className="settings-grid">
          <div className="settings-section">
            <h4>🏥 Clinic Information</h4>
            <div className="form-group">
              <label>Clinic Name</label>
              <input
                type="text"
                name="clinic_name"
                value={settings.clinic_name}
                onChange={handleChange}
                placeholder="Your clinic name"
              />
            </div>
          </div>

          <div className="settings-section">
            <h4>🔧 System Configuration</h4>
            <div className="form-group">
              <label>Appointment Buffer Time (minutes)</label>
              <input
                type="number"
                name="appointment_buffer"
                value={settings.appointment_buffer}
                onChange={handleChange}
                min="5"
                max="60"
              />
              <small>Time gap between consecutive appointments</small>
            </div>

            <div className="form-group">
              <label>Max Patients Per Day</label>
              <input
                type="number"
                name="max_patients_per_day"
                value={settings.max_patients_per_day}
                onChange={handleChange}
                min="10"
                max="500"
              />
            </div>

            <div className="form-group">
              <label>Backup Frequency</label>
              <select name="backup_frequency" value={settings.backup_frequency} onChange={handleChange}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h4>🔔 Notifications</h4>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="email_notifications"
                  checked={settings.email_notifications}
                  onChange={handleChange}
                />
                <span>Enable Email Notifications</span>
              </label>
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="sms_notifications"
                  checked={settings.sms_notifications}
                  onChange={handleChange}
                />
                <span>Enable SMS Notifications</span>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h4>🚨 Maintenance Mode</h4>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onChange={handleChange}
                />
                <span>Enable Maintenance Mode (disable for all users)</span>
              </label>
              <small>When enabled, only admins can access the system</small>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            💾 Save Settings
          </button>
          <button className="btn btn-danger" onClick={handleReset}>
            🔄 Reset to Defaults
          </button>
        </div>
      </div>

      <div className="card">
        <h3>📋 System Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Application</label>
            <value>Dental Clinic Management System</value>
          </div>
          <div className="info-item">
            <label>Version</label>
            <value>1.0.0</value>
          </div>
          <div className="info-item">
            <label>API Version</label>
            <value>v1</value>
          </div>
          <div className="info-item">
            <label>Database</label>
            <value>MongoDB</value>
          </div>
          <div className="info-item">
            <label>Last Backup</label>
            <value>{new Date().toLocaleDateString()}</value>
          </div>
          <div className="info-item">
            <label>Status</label>
            <value style={{ color: '#10b981' }}>🟢 Online</value>
          </div>
        </div>
      </div>

      <div className="card warning-card">
        <h3>⚠️ Danger Zone</h3>
        <p>These actions are irreversible. Use with caution.</p>
        <div className="danger-actions">
          <button className="btn btn-danger" disabled title="Not implemented yet">
            🗑️ Delete All Records
          </button>
          <button className="btn btn-danger" disabled title="Not implemented yet">
            💥 Factory Reset
          </button>
        </div>
      </div>
    </div>
  );
}
