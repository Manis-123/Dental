import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const emptyForm = { name: '', email: '', phone: '', age: '', gender: 'other', address: '', medicalHistory: '' };

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .getPatients()
      .then(setPatients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.createPatient({
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this patient?')) return;
    try {
      await api.deletePatient(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Patients</h2>
        <p>Register and manage clinic patients</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div className="card">
        <h3>Add New Patient</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input name="age" type="number" value={form.age} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input name="address" value={form.address} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Medical History</label>
            <textarea name="medicalHistory" value={form.medicalHistory} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Patient
          </button>
        </form>
      </div>
      <div className="card">
        <h3>All Patients ({patients.length})</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : patients.length === 0 ? (
          <div className="empty-state">No patients yet. Add your first patient above.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.phone}</td>
                    <td>{p.email || '—'}</td>
                    <td>{p.age ?? '—'}</td>
                    <td>{p.gender}</td>
                    <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link to={`/patients/${p._id}`} className="btn btn-secondary btn-sm">
                        History
                      </Link>
                      <button className="btn btn-danger" onClick={() => handleDelete(p._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
