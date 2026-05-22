import { useEffect, useState } from 'react';
import { api } from '../api';

const empty = { title: '', amount: '', category: 'other', date: '', description: '' };

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ ...empty, date: new Date().toISOString().slice(0, 10) });
  const [error, setError] = useState('');

  const load = () => api.getExpenses().then(setExpenses).catch((e) => setError(e.message));

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener('clinic-changed', h);
    return () => window.removeEventListener('clinic-changed', h);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createExpense({ ...form, amount: Number(form.amount), date: new Date(form.date).toISOString() });
      setForm({ ...empty, date: new Date().toISOString().slice(0, 10) });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <div className="page-header">
        <h2>Expenses</h2>
        <p>Clinic kharcha track — total: Rs. {total.toLocaleString()}</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div className="card">
        <h3>Add Expense</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Amount (Rs.) *</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="rent">Rent</option>
                <option value="salary">Salary</option>
                <option value="supplies">Supplies</option>
                <option value="utilities">Utilities</option>
                <option value="equipment">Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Expense
          </button>
        </form>
      </div>
      <div className="card">
        <h3>All Expenses</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e._id}>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                  <td>{e.title}</td>
                  <td>{e.category}</td>
                  <td>Rs. {e.amount.toLocaleString()}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => api.deleteExpense(e._id).then(load)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
