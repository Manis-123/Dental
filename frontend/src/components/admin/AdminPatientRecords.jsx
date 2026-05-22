import { useEffect, useState } from 'react';
import { api } from '../../api';

export default function AdminPatientRecords() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await api.getPatients();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (id) => {
    if (!confirm('Delete this patient? This action cannot be undone.')) return;
    try {
      await api.deletePatient(id);
      await loadPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);
    return matchesSearch;
  });

  if (loading) return <div className="loading">Loading patients...</div>;

  return (
    <div className="admin-patients">
      <div className="card">
        <h3>🧑‍⚕️ Patient Records</h3>
        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Registered Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    {searchTerm ? 'No patients found matching your search' : 'No patients registered yet'}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, idx) => (
                  <tr key={patient._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{patient.name}</strong>
                    </td>
                    <td>{patient.email || '-'}</td>
                    <td>{patient.phone || '-'}</td>
                    <td>{patient.age || '-'}</td>
                    <td>{patient.gender || '-'}</td>
                    <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeletePatient(patient._id)}
                          title="Delete patient"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>
            Total Patients: <strong>{filteredPatients.length}</strong>
          </p>
        </div>
      </div>

      <div className="card">
        <h3>📊 Patient Statistics</h3>
        <div className="stats-grid admin-stats">
          <div className="stat-card">
            <div className="label">Total Patients</div>
            <div className="value">{patients.length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Male</div>
            <div className="value">{patients.filter((p) => p.gender === 'Male').length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Female</div>
            <div className="value">{patients.filter((p) => p.gender === 'Female').length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Avg Age</div>
            <div className="value">
              {patients.length > 0
                ? Math.round(patients.reduce((sum, p) => sum + (p.age || 0), 0) / patients.length)
                : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
