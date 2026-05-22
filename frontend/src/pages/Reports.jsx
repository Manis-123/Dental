import { useEffect, useState } from 'react';
import { api } from '../api';
import { downloadCSV, printReport } from '../utils/exportReport';

export default function Reports() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api
      .getMonthlyReport(year, month)
      .then(setReport)
      .catch((e) => setError(e.message));
  };

  useEffect(load, [year, month]);

  useEffect(() => {
    const h = () => load();
    window.addEventListener('clinic-changed', h);
    return () => window.removeEventListener('clinic-changed', h);
  }, [year, month]);

  const exportBillsCSV = () => {
    if (!report?.bills?.length) return;
    downloadCSV(
      `bills-${year}-${month}.csv`,
      report.bills.map((b) => ({
        billNumber: b.billNumber,
        patient: b.patient?.name,
        total: b.total,
        paid: b.paidAmount,
        status: b.status,
        date: new Date(b.createdAt).toLocaleDateString(),
      }))
    );
  };

  const exportPendingCSV = () => {
    if (!report?.pendingBills?.length) return;
    downloadCSV(
      `pending-${year}-${month}.csv`,
      report.pendingBills.map((b) => ({
        billNumber: b.billNumber,
        patient: b.patient?.name,
        total: b.total,
        due: b.total - (b.paidAmount || 0),
        status: b.status,
      }))
    );
  };

  const printPDF = () => {
    if (!report) return;
    const html = `
      <div class="summary">
        <div><strong>Revenue</strong><br>Rs. ${report.revenue.toLocaleString()}</div>
        <div><strong>Pending</strong><br>Rs. ${report.pendingAmount.toLocaleString()}</div>
        <div><strong>Expenses</strong><br>Rs. ${report.totalExpenses.toLocaleString()}</div>
        <div><strong>Profit</strong><br>Rs. ${report.profit.toLocaleString()}</div>
      </div>
      <h2>Paid Bills</h2>
      <table><tr><th>Bill</th><th>Patient</th><th>Total</th><th>Status</th></tr>
      ${report.bills
        .filter((b) => b.status === 'paid')
        .map((b) => `<tr><td>${b.billNumber}</td><td>${b.patient?.name}</td><td>${b.total}</td><td>${b.status}</td></tr>`)
        .join('')}</table>
      <h2>Pending Bills</h2>
      <table><tr><th>Bill</th><th>Patient</th><th>Due</th></tr>
      ${report.pendingBills
        .map((b) => `<tr><td>${b.billNumber}</td><td>${b.patient?.name}</td><td>${b.total - (b.paidAmount || 0)}</td></tr>`)
        .join('')}</table>`;
    printReport(`Monthly Report ${month}/${year}`, html);
  };

  return (
    <>
      <div className="page-header">
        <h2>Reports</h2>
        <p>Monthly revenue, pending bills — Excel (CSV) / PDF print</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div className="card">
        <div className="form-grid" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label>Year</label>
            <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Month</label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString('en', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!report ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="stats-grid" style={{ marginBottom: '1rem' }}>
              <div className="stat-card">
                <div className="label">Revenue</div>
                <div className="value">Rs. {report.revenue.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="label">Pending</div>
                <div className="value">Rs. {report.pendingAmount.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="label">Expenses</div>
                <div className="value">Rs. {report.totalExpenses.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="label">Profit</div>
                <div className="value">Rs. {report.profit.toLocaleString()}</div>
              </div>
            </div>
            <div className="quick-actions-row">
              <button type="button" className="btn btn-primary" onClick={exportBillsCSV}>
                Export Bills CSV
              </button>
              <button type="button" className="btn btn-primary" onClick={exportPendingCSV}>
                Export Pending CSV
              </button>
              <button type="button" className="btn btn-secondary" onClick={printPDF}>
                Print / PDF Report
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
