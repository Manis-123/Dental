import { useEffect, useState } from 'react';
import { api } from '../api';

const categories = [
  'cleaning',
  'filling',
  'root_canal',
  'extraction',
  'whitening',
  'orthodontics',
  'other',
];

const emptyForm = { name: '', description: '', price: '', duration: '', category: 'other' };

export default function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = () => {
    api.getTreatments().then(setTreatments).catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.createTreatment({
        ...form,
        price: Number(form.price),
        duration: form.duration ? Number(form.duration) : undefined,
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this treatment?')) return;
    try {
      await api.deleteTreatment(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Treatments</h2>
        <p>Dental services and pricing</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div className="card">
        <h3>Add Treatment</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Price (PKR) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Duration (min)</label>
              <input name="duration" type="number" value={form.duration} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group" style={{ margin: '1rem 0' }}>
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Treatment
          </button>
        </form>
      </div>
      <div className="card">
        <h3>All Treatments ({treatments.length})</h3>
        {treatments.length === 0 ? (
          <div className="empty-state">No treatments yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((t) => (
                  <tr key={t._id}>
                    <td>{t.name}</td>
                    <td>{t.category?.replace('_', ' ')}</td>
                    <td>Rs. {t.price?.toLocaleString()}</td>
                    <td>{t.duration ? `${t.duration} min` : '—'}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDelete(t._id)}>
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
