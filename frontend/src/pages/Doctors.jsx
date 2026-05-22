import { useEffect, useState } from 'react';
import { api } from '../api';

const emptyForm = { name: '', specialization: '', email: '', phone: '', experience: '' };

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = () => {
    api.getDoctors().then(setDoctors).catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.createDoctor({
        ...form,
        experience: form.experience ? Number(form.experience) : undefined,
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this doctor?')) return;
    try {
      await api.deleteDoctor(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Doctors</h2>
        <p>Manage dental specialists and staff</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div className="card">
        <h3>Add Doctor</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Specialization *</label>
              <input name="specialization" value={form.specialization} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Experience (years)</label>
              <input name="experience" type="number" value={form.experience} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Save Doctor
          </button>
        </form>
      </div>
      <div className="card">
        <h3>All Doctors ({doctors.length})</h3>
        {doctors.length === 0 ? (
          <div className="empty-state">No doctors added yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Phone</th>
                  <th>Experience</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d._id}>
                    <td>{d.name}</td>
                    <td>{d.specialization}</td>
                    <td>{d.phone || '—'}</td>
                    <td>{d.experience ? `${d.experience} yrs` : '—'}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDelete(d._id)}>
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
