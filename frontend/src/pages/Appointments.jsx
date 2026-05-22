import { useEffect, useState } from 'react';
import { api } from '../api';

const emptyForm = {
  patient: '',
  doctor: '',
  treatment: '',
  date: '',
  time: '',
  status: 'scheduled',
  notes: '',
  prescription: '',
  doctorNotes: '',
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [reminderMsg, setReminderMsg] = useState('');

  const load = () => {
    Promise.all([api.getAppointments(), api.getPatients(), api.getDoctors(), api.getTreatments()])
      .then(([a, p, d, t]) => {
        setAppointments(a);
        setPatients(p);
        setDoctors(d);
        setTreatments(t);
      })
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener('clinic-changed', h);
    return () => window.removeEventListener('clinic-changed', h);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.createAppointment({
        ...form,
        patient: form.patient,
        doctor: form.doctor,
        treatment: form.treatment || undefined,
        date: new Date(form.date).toISOString(),
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await api.updateAppointment(id, { status });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReminder = async (id) => {
    try {
      const r = await api.sendReminder(id);
      setReminderMsg(r.mock ? 'Mock reminder saved' : 'Reminder sent!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditNotes = async (a) => {
    const prescription = window.prompt('Prescription:', a.prescription || '');
    if (prescription === null) return;
    const doctorNotes = window.prompt('Doctor notes:', a.doctorNotes || '');
    if (doctorNotes === null) return;
    try {
      await api.updateAppointment(a._id, { prescription, doctorNotes });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    try {
      await api.deleteAppointment(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const statusClass = (s) => `badge badge-${s === 'scheduled' ? 'scheduled' : s === 'completed' ? 'completed' : 'cancelled'}`;

  return (
    <>
      <div className="page-header">
        <h2>Appointments</h2>
        <p>Book and manage patient visits</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {reminderMsg && <div className="success-banner">{reminderMsg}</div>}
      <div className="card">
        <h3>Book Appointment</h3>
        {patients.length === 0 || doctors.length === 0 ? (
          <div className="empty-state">
            Pehle kam az kam ek patient aur ek doctor add karein.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Patient *</label>
                <select name="patient" value={form.patient} onChange={handleChange} required>
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — {p.phone}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Doctor *</label>
                <select name="doctor" value={form.doctor} onChange={handleChange} required>
                  <option value="">Select doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Treatment</label>
                <select name="treatment" value={form.treatment} onChange={handleChange}>
                  <option value="">Optional</option>
                  {treatments.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} — Rs. {t.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input name="time" placeholder="e.g. 10:00 AM" value={form.time} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Prescription</label>
              <textarea name="prescription" value={form.prescription} onChange={handleChange} placeholder="Medicines, dosage..." />
            </div>
            <div className="form-group">
              <label>Doctor notes</label>
              <textarea name="doctorNotes" value={form.doctorNotes} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ margin: '1rem 0' }}>
              <label>General notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary">
              Book Appointment
            </button>
          </form>
        )}
      </div>
      <div className="card">
        <h3>All Appointments ({appointments.length})</h3>
        {appointments.length === 0 ? (
          <div className="empty-state">No appointments scheduled.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Treatment</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Rx / Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td>{a.patient?.name}</td>
                    <td>{a.doctor?.name}</td>
                    <td>{a.treatment?.name || '—'}</td>
                    <td>{formatDate(a.date)}</td>
                    <td>{a.time}</td>
                    <td className="notes-cell">
                      {a.prescription
                        ? `Rx: ${a.prescription.length > 40 ? `${a.prescription.slice(0, 40)}…` : a.prescription}`
                        : '—'}
                      <button type="button" className="btn-link" onClick={() => handleEditNotes(a)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <span className={statusClass(a.status)}>{a.status}</span>
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {a.status === 'scheduled' && (
                        <>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleReminder(a._id)}>
                            Remind
                          </button>
                          <button className="btn btn-primary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleStatus(a._id, 'completed')}>
                            Done
                          </button>
                          <button className="btn btn-danger" onClick={() => handleStatus(a._id, 'cancelled')}>
                            Cancel
                          </button>
                        </>
                      )}
                      <button className="btn btn-danger" onClick={() => handleDelete(a._id)}>
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
