import { useEffect, useState } from 'react';
import { api } from '../api';

const emptyItem = { treatment: '', name: '', quantity: 1, unitPrice: '' };

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState({
    patient: '',
    discount: 0,
    paidAmount: 0,
    paymentMethod: 'cash',
    notes: '',
    items: [{ ...emptyItem }],
  });
  const [error, setError] = useState('');
  const [payModal, setPayModal] = useState(null);
  const [payAmount, setPayAmount] = useState('');

  const load = () => {
    Promise.all([api.getBills(), api.getPatients(), api.getTreatments()])
      .then(([b, p, t]) => {
        setBills(b);
        setPatients(p);
        setTreatments(t);
      })
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const addItem = () => setForm({ ...form, items: [...form.items, { ...emptyItem }] });

  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    if (field === 'treatment' && value) {
      const t = treatments.find((x) => x._id === value);
      if (t) {
        items[index].name = t.name;
        items[index].unitPrice = t.price;
      }
    }
    setForm({ ...form, items });
  };

  const removeItem = (index) => {
    if (form.items.length === 1) return;
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const calcPreview = () => {
    const subtotal = form.items.reduce((s, i) => s + (Number(i.quantity) || 1) * (Number(i.unitPrice) || 0), 0);
    const total = Math.max(0, subtotal - (Number(form.discount) || 0));
    return { subtotal, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validItems = form.items.filter((i) => i.name && i.unitPrice);
    if (!form.patient || validItems.length === 0) {
      setError('Patient aur kam az kam ek item zaroori hai');
      return;
    }
    try {
      await api.createBill({
        patient: form.patient,
        items: validItems.map((i) => ({
          treatment: i.treatment || undefined,
          name: i.name,
          quantity: Number(i.quantity) || 1,
          unitPrice: Number(i.unitPrice),
        })),
        discount: Number(form.discount) || 0,
        paidAmount: Number(form.paidAmount) || 0,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      });
      setForm({
        patient: '',
        discount: 0,
        paidAmount: 0,
        paymentMethod: 'cash',
        notes: '',
        items: [{ ...emptyItem }],
      });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePayment = async () => {
    if (!payModal) return;
    const add = Number(payAmount);
    if (!add || add <= 0) return;
    const newPaid = (payModal.paidAmount || 0) + add;
    try {
      await api.updateBill(payModal._id, {
        paidAmount: newPaid,
        paymentMethod: payModal.paymentMethod || 'cash',
      });
      setPayModal(null);
      setPayAmount('');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this bill?')) return;
    try {
      await api.deleteBill(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const { subtotal, total } = calcPreview();
  const statusClass = (s) =>
    `badge badge-${s === 'paid' ? 'completed' : s === 'partial' ? 'scheduled' : 'cancelled'}`;

  return (
    <>
      <div className="page-header">
        <h2>Patient Bills</h2>
        <p>Create bills, record payments, track pending amounts</p>
      </div>
      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <h3>Create New Bill</h3>
        {patients.length === 0 ? (
          <div className="empty-state">Pehle patient add karein.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Patient *</label>
                <select
                  value={form.patient}
                  onChange={(e) => setForm({ ...form, patient: e.target.value })}
                  required
                >
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — {p.phone}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Discount (PKR)</label>
                <input
                  type="number"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Paid Amount (PKR)</label>
                <input
                  type="number"
                  value={form.paidAmount}
                  onChange={(e) => setForm({ ...form, paidAmount: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="online">Online</option>
                </select>
              </div>
            </div>

            <h4 style={{ margin: '1rem 0 0.75rem', color: 'var(--primary-dark)' }}>Bill Items</h4>
            {form.items.map((item, idx) => (
              <div key={idx} className="bill-item-row">
                <div className="form-group">
                  <label>Treatment</label>
                  <select
                    value={item.treatment}
                    onChange={(e) => updateItem(idx, 'treatment', e.target.value)}
                  >
                    <option value="">Custom / Manual</option>
                    {treatments.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} — Rs. {t.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Unit Price *</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                    required
                  />
                </div>
                {form.items.length > 1 && (
                  <button type="button" className="btn btn-danger" onClick={() => removeItem(idx)}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addItem} style={{ marginBottom: '1rem' }}>
              + Add Item
            </button>

            <div className="bill-summary">
              <span>Subtotal: Rs. {subtotal.toLocaleString()}</span>
              <span>Total: Rs. {total.toLocaleString()}</span>
              <span>Due: Rs. {Math.max(0, total - (Number(form.paidAmount) || 0)).toLocaleString()}</span>
            </div>

            <div className="form-group" style={{ margin: '1rem 0' }}>
              <label>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Bill
            </button>
          </form>
        )}
      </div>

      <div className="card">
        <h3>All Bills ({bills.length})</h3>
        {bills.length === 0 ? (
          <div className="empty-state">No bills yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bill #</th>
                  <th>Patient</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => {
                  const due = b.total - (b.paidAmount || 0);
                  return (
                    <tr key={b._id}>
                      <td>{b.billNumber}</td>
                      <td>{b.patient?.name}</td>
                      <td>Rs. {b.total?.toLocaleString()}</td>
                      <td>Rs. {(b.paidAmount || 0).toLocaleString()}</td>
                      <td>Rs. {due.toLocaleString()}</td>
                      <td>
                        <span className={statusClass(b.status)}>{b.status}</span>
                      </td>
                      <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {b.status !== 'paid' && (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => {
                              setPayModal(b);
                              setPayAmount(String(due));
                            }}
                          >
                            Pay
                          </button>
                        )}
                        <button className="btn btn-danger" onClick={() => handleDelete(b._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {payModal && (
        <div className="modal-overlay" onClick={() => setPayModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Record Payment</h3>
            <p>
              Bill: <strong>{payModal.billNumber}</strong> — {payModal.patient?.name}
            </p>
            <p>
              Due: Rs. {(payModal.total - (payModal.paidAmount || 0)).toLocaleString()}
            </p>
            <div className="form-group">
              <label>Amount (PKR)</label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={handlePayment}>
                Save Payment
              </button>
              <button className="btn btn-secondary" onClick={() => setPayModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
