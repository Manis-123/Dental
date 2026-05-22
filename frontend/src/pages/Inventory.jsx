import { useEffect, useState } from 'react';
import { api } from '../api';

const empty = { name: '', sku: '', quantity: '', unit: 'pcs', minStock: 5, costPerUnit: '' };

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  const load = () => api.getInventory().then(setItems).catch((e) => setError(e.message));

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener('clinic-changed', h);
    return () => window.removeEventListener('clinic-changed', h);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createInventory({
        ...form,
        quantity: Number(form.quantity),
        minStock: Number(form.minStock),
        costPerUnit: form.costPerUnit ? Number(form.costPerUnit) : 0,
      });
      setForm(empty);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Inventory</h2>
        <p>Dental materials & stock</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div className="card">
        <h3>Add Item</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Min stock alert</label>
              <input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Cost/unit (Rs.)</label>
              <input type="number" value={form.costPerUnit} onChange={(e) => setForm({ ...form, costPerUnit: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      </div>
      <div className="card">
        <h3>Stock ({items.length})</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Min</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i._id} className={i.quantity <= i.minStock ? 'row-low-stock' : ''}>
                  <td>{i.name}</td>
                  <td>{i.sku || '—'}</td>
                  <td>
                    {i.quantity} {i.unit}
                  </td>
                  <td>{i.minStock}</td>
                  <td>{i.quantity <= i.minStock ? <span className="badge badge-cancelled">Low</span> : 'OK'}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => api.deleteInventory(i._id).then(load)}>
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
