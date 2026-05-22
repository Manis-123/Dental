import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function PatientDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [imgForm, setImgForm] = useState({ caption: '', treatment: '' });
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);

  const load = () => {
    Promise.all([api.getPatientHistory(id), api.getPatientImages(id)])
      .then(([history, imgs]) => {
        setData(history);
        setImages(imgs);
      })
      .catch((e) => setError(e.message));
  };

  useEffect(load, [id]);

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = { caption: imgForm.caption, treatment: imgForm.treatment || undefined };
      if (beforeFile) body.beforeImage = await fileToBase64(beforeFile);
      if (afterFile) body.afterImage = await fileToBase64(afterFile);
      if (!body.beforeImage && !body.afterImage) {
        setError('Add at least one before or after photo');
        return;
      }
      await api.addPatientImage(id, body);
      setImgForm({ caption: '', treatment: '' });
      setBeforeFile(null);
      setAfterFile(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !data) return <div className="error-banner">{error}</div>;
  if (!data) return <div className="loading">Loading...</div>;

  const { patient, appointments, bills } = data;

  return (
    <>
      <div className="page-header">
        <Link to="/patients" className="btn btn-secondary">
          ← Patients
        </Link>
        <h2 style={{ marginTop: '1rem' }}>{patient.name}</h2>
        <p>
          {patient.phone} {patient.email ? `· ${patient.email}` : ''}
        </p>
      </div>
      {error && <div className="error-banner">{error}</div>}

      <div className="detail-grid">
        <div className="card">
          <h3>Patient History — Appointments ({appointments.length})</h3>
          {appointments.length === 0 ? (
            <p className="empty-state">No appointments</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Treatment</th>
                    <th>Status</th>
                    <th>Prescription / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a._id}>
                      <td>{new Date(a.date).toLocaleDateString()}</td>
                      <td>{a.time}</td>
                      <td>{a.doctor?.name}</td>
                      <td>{a.treatment?.name || '—'}</td>
                      <td>{a.status}</td>
                      <td className="notes-cell">
                        {a.prescription && <div><strong>Rx:</strong> {a.prescription}</div>}
                        {a.doctorNotes && <div><strong>Dr:</strong> {a.doctorNotes}</div>}
                        {a.notes && <div>{a.notes}</div>}
                        {!a.prescription && !a.doctorNotes && !a.notes && '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Bills ({bills.length})</h3>
          {bills.length === 0 ? (
            <p className="empty-state">No bills</p>
          ) : (
            <ul className="admin-list">
              {bills.map((b) => (
                <li key={b._id}>
                  <strong>{b.billNumber}</strong>
                  <span>
                    Rs. {b.total?.toLocaleString()} — {b.status} (paid: {b.paidAmount?.toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Treatment Photos (Before / After)</h3>
        <form onSubmit={handleImageSubmit} className="image-upload-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Caption</label>
              <input value={imgForm.caption} onChange={(e) => setImgForm({ ...imgForm, caption: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Before photo</label>
              <input type="file" accept="image/*" onChange={(e) => setBeforeFile(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label>After photo</label>
              <input type="file" accept="image/*" onChange={(e) => setAfterFile(e.target.files[0])} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Upload Photos
          </button>
        </form>
        <div className="image-gallery">
          {images.map((img) => (
            <div key={img._id} className="image-card">
              {img.caption && <p className="image-caption">{img.caption}</p>}
              <div className="image-pair">
                {img.beforeImage && (
                  <div>
                    <span>Before</span>
                    <img src={img.beforeImage} alt="Before" />
                  </div>
                )}
                {img.afterImage && (
                  <div>
                    <span>After</span>
                    <img src={img.afterImage} alt="After" />
                  </div>
                )}
              </div>
              <button className="btn btn-danger" onClick={() => api.deletePatientImage(id, img._id).then(load)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
