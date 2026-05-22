import { useEffect, useState } from 'react';
import { api } from '../../api';

const emptyDoctor = {
  name: '',
  specialization: '',
  phone: '',
  email: '',
  qualifications: '',
};

export default function AdminDoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyDoctor);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await api.getDoctors();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!form.name || !form.specialization) {
        setError('Doctor name and specialization are required');
        return;
      }
      await api.createDoctor(form);
      setForm(emptyDoctor);
      await loadDoctors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!confirm('Delete this doctor? This action cannot be undone.')) return;
    try {
      await api.deleteDoctor(id);
      await loadDoctors();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading doctors...</div>;

  return (
    <div className="admin-doctors">
      <div className="card">
        <h3>➕ Register New Doctor</h3>
        <form onSubmit={handleAddDoctor}>
          {error && <div className="error-banner">{error}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label>Doctor Name *</label>
              <input
                type="text"
                placeholder="Dr. Muhammad Ahmed"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Specialization *</label>
              <input
                type="text"
                placeholder="Endodontist, Orthodontist, etc."
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="doctor@example.com"
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
            <div className="form-group full">
              <label>Qualifications</label>
              <textarea
                placeholder="BDS, FCPS, etc."
                value={form.qualifications}
                onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            ✅ Register Doctor
          </button>
        </form>
      </div>

      <div className="card">
        <h3>👨‍⚕️ All Doctors ({filteredDoctors.length})</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredDoctors.length === 0 ? (
          <p className="empty-state">No doctors registered yet</p>
        ) : (
          <div className="doctors-grid">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card">
                <h4>👨‍⚕️ {doctor.name}</h4>
                <p>
                  <strong>🏥 Specialization:</strong> {doctor.specialization}
                </p>
                {doctor.qualifications && (
                  <p>
                    <strong>📜 Qualifications:</strong> {doctor.qualifications}
                  </p>
                )}
                {doctor.email && (
                  <p>
                    <strong>📧 Email:</strong> {doctor.email}
                  </p>
                )}
                {doctor.phone && (
                  <p>
                    <strong>📞 Phone:</strong> {doctor.phone}
                  </p>
                )}
                <div className="doctor-actions">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteDoctor(doctor._id)}
                  >
                    🗑️ Delete
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
