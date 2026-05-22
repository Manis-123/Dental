import { useState } from 'react';
import { api } from '../api';
import { useClinic } from '../context/ClinicContext';

const empty = { name: '', address: '', phone: '', email: '' };

export default function Clinics() {
  const { clinics, refreshClinics } = useClinic();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createClinic(form);
      setForm(empty);
      refreshClinics();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Clinic Branches</h2>
        <p>Multiple clinics / branches manage karein</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div className="card">
        <h3>Add Branch</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Add Branch
          </button>
        </form>
      </div>
      <div className="card">
        <h3>All Branches ({clinics.length})</h3>
        <ul className="admin-list">
          {clinics.map((c) => (
            <li key={c._id}>
              <strong>{c.name}</strong>
              <span>{c.address || c.phone || '—'}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
