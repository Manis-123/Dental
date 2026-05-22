import { useLanguage } from '../context/LanguageContext';

export default function RevenueChart({ data = [] }) {
  const { t } = useLanguage();
  const max = Math.max(...data.map((d) => d.revenue), 1);

  if (!data.length || data.every((d) => d.revenue === 0)) {
    return <p className="chart-empty">{t('revenueChartEmpty')}</p>;
  }

  return (
    <div className="revenue-chart">
      <div className="chart-bars">
        {data.map((d) => (
          <div key={`${d.year}-${d.month}`} className="chart-bar-wrap">
            <div
              className="chart-bar"
              style={{ height: `${Math.max(8, (d.revenue / max) * 100)}%` }}
              title={`${d.label}: ${t('rs')} ${d.revenue.toLocaleString()}`}
            />
            <span className="chart-bar-value">
              {d.revenue > 0 ? `${(d.revenue / 1000).toFixed(d.revenue >= 1000 ? 0 : 1)}k` : '—'}
            </span>
            <span className="chart-bar-label">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
