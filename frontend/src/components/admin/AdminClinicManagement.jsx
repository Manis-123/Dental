import { useEffect, useState } from 'react';
import { api } from '../../api';

const emptyClinic = {
  name: '',
  address: '',
  phone: '',
  email: '',
  city: '',
  country: '',
};

export default function AdminClinicManagement() {
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState(emptyClinic);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = async () => {
    try {
      setLoading(true);
      const data = await api.getClinics();
      setClinics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClinic = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!form.name || !form.address) {
        setError('Clinic name and address are required');
        return;
      }
      if (editingId) {
        await api.updateClinic(editingId, form);
        setEditingId(null);
      } else {
        await api.createClinic(form);
      }
      setForm(emptyClinic);
      await loadClinics();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (clinic) => {
    setForm(clinic);
    setEditingId(clinic._id);
  };

  const handleCancel = () => {
    setForm(emptyClinic);
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading clinics...</div>;

  return (
    <div className="admin-clinics">
      <div className="card">
        <h3>{editingId ? '✏️ Edit Clinic' : '➕ Add New Clinic'}</h3>
        <form onSubmit={handleAddClinic}>
          {error && <div className="error-banner">{error}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label>Clinic Name *</label>
              <input
                type="text"
                placeholder="ABC Dental Clinic"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="clinic@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="+92-xxx-xxxxxxx"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                placeholder="Karachi"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                placeholder="Pakistan"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group full">
            <label>Address *</label>
            <textarea
              placeholder="Complete clinic address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? '💾 Update Clinic' : '✅ Add Clinic'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>🏥 All Clinics ({clinics.length})</h3>
        {clinics.length === 0 ? (
          <p className="empty-state">No clinics registered yet</p>
        ) : (
          <div className="clinics-grid">
            {clinics.map((clinic) => (
              <div key={clinic._id} className="clinic-card">
                <h4>{clinic.name}</h4>
                <p>
                  <strong>📍 Address:</strong> {clinic.address}
                </p>
                {clinic.city && (
                  <p>
                    <strong>🏙️ City:</strong> {clinic.city}
                  </p>
                )}
                {clinic.country && (
                  <p>
                    <strong>🌍 Country:</strong> {clinic.country}
                  </p>
                )}
                {clinic.email && (
                  <p>
                    <strong>📧 Email:</strong> {clinic.email}
                  </p>
                )}
                {clinic.phone && (
                  <p>
                    <strong>📞 Phone:</strong> {clinic.phone}
                  </p>
                )}
                <div className="clinic-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => handleEdit(clinic)}>
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
