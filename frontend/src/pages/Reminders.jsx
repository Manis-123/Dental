import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Reminders() {
  const [tomorrow, setTomorrow] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const load = () => {
    Promise.all([api.getTomorrowReminders(), api.getReminderLogs()])
      .then(([t, l]) => {
        setTomorrow(t);
        setLogs(l);
      })
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener('clinic-changed', h);
    return () => window.removeEventListener('clinic-changed', h);
  }, []);

  const sendAll = async () => {
    setSending(true);
    setMsg('');
    try {
      const r = await api.sendTomorrowReminders('whatsapp');
      setMsg(`Sent ${r.sent} reminder(s). ${r.results?.[0]?.mock ? '(Mock mode — add Twilio keys in backend .env)' : ''}`);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const sendOne = async (id) => {
    try {
      const r = await api.sendReminder(id);
      setMsg(r.mock ? 'Mock reminder saved (configure Twilio for real SMS/WhatsApp)' : 'Reminder sent!');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Appointment Reminders</h2>
        <p>SMS / WhatsApp — kal ki appointments yaad dilayein</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {msg && <div className="success-banner">{msg}</div>}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h3>Tomorrow ({tomorrow.length})</h3>
          <button type="button" className="btn btn-primary" onClick={sendAll} disabled={sending || tomorrow.length === 0}>
            {sending ? 'Sending...' : 'Send All WhatsApp Reminders'}
          </button>
        </div>
        {tomorrow.length === 0 ? (
          <p className="empty-state">No scheduled appointments for tomorrow</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tomorrow.map((a) => (
                  <tr key={a._id}>
                    <td>{a.patient?.name}</td>
                    <td>{a.patient?.phone}</td>
                    <td>{a.doctor?.name}</td>
                    <td>{a.time}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => sendOne(a._id)}>
                        Send
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-muted" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
          Real WhatsApp: set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM in backend .env
        </p>
      </div>
      <div className="card">
        <h3>Recent Reminder Logs</h3>
        <ul className="admin-list">
          {logs.slice(0, 10).map((l) => (
            <li key={l._id}>
              <span>
                {l.patientPhone} — {l.channel} — {l.status}
              </span>
              <span>{new Date(l.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
