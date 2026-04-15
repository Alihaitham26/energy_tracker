import { useLoadData } from '../hooks/useLoadData';
import Header from './Header';
import LoadChart from './LoadChart';
import './UsagePage.css';

/**
 * Build cumulative time labels (same logic as HomePage).
 */
function buildTimeLabels(load1, load2, load3) {
  const maxLen = Math.max(load1.time.length, load2.time.length, load3.time.length);
  if (maxLen === 0) return [];

  const longestTime = [load1, load2, load3].reduce(
    (best, l) => (l.time.length > best.time.length ? l : best)
  ).time;

  return longestTime.map((val) => String(val));
}

export default function UsagePage({ loadNames }) {
  const load1 = useLoadData('load11');
  const load2 = useLoadData('load2');
  const load3 = useLoadData('load3');

  const isLoading = load1.loading || load2.loading || load3.loading;
  const names = loadNames || ['Load 1', 'Load 2', 'Load 3'];

  // Build time-based labels
  const maxLen = Math.max(load1.watts.length, load2.watts.length, load3.watts.length);
  const timeLabels = buildTimeLabels(load1, load2, load3);
  const labels = timeLabels.length > 0
    ? timeLabels
    : Array.from({ length: maxLen }, (_, i) => `${(i + 1) * 10}s`);

  // Energy (kWh) datasets — primary usage chart
  const energyDatasets = [
    { label: names[0], data: load1.energyKwh, color: '#00CB73' },
    { label: names[1], data: load2.energyKwh, color: '#00d4ff' },
    { label: names[2], data: load3.energyKwh, color: '#5d00ff' },
  ];

  // Power (Watts) datasets
  const wattsDatasets = [
    { label: names[0], data: load1.watts, color: '#00CB73' },
    { label: names[1], data: load2.watts, color: '#00d4ff' },
    { label: names[2], data: load3.watts, color: '#5d00ff' },
  ];

  // Current (Amps) datasets
  const ampsDatasets = [
    { label: names[0], data: load1.amps, color: '#00CB73' },
    { label: names[1], data: load2.amps, color: '#00d4ff' },
    { label: names[2], data: load3.amps, color: '#5d00ff' },
  ];

  // Voltage (Volts) datasets
  const voltsDatasets = [
    { label: names[0], data: load1.volts, color: '#00CB73' },
    { label: names[1], data: load2.volts, color: '#00d4ff' },
    { label: names[2], data: load3.volts, color: '#5d00ff' },
  ];

  // Total energy per load (kWh)
  const totalEnergyKwh = load1.totalEnergy + load2.totalEnergy + load3.totalEnergy;

  // Summary stats
  const stats = [
    {
      label: 'Total Energy',
      value: `${totalEnergyKwh.toFixed(3)} kWh`,
      color: 'var(--primary)',
    },
    {
      label: `${names[0]} Peak`,
      value: load1.watts.length > 0 ? `${Math.max(...load1.watts.map(Math.abs)).toFixed(2)} W` : '—',
      color: 'var(--load1-color)',
    },
    {
      label: `${names[1]} Peak`,
      value: load2.watts.length > 0 ? `${Math.max(...load2.watts.map(Math.abs)).toFixed(2)} W` : '—',
      color: 'var(--load2-color)',
    },
    {
      label: `${names[2]} Peak`,
      value: load3.watts.length > 0 ? `${Math.max(...load3.watts.map(Math.abs)).toFixed(2)} W` : '—',
      color: 'var(--load3-color)',
    },
  ];

  return (
    <div className="usage-page" id="usage-page">
      <Header title="Usage History" subtitle="Historical energy consumption across all loads" />

      {/* Stats bar */}
      <div className="usage-stats-row">
        {stats.map((stat) => (
          <div className="usage-stat-card" key={stat.label}>
            <span className="usage-stat-label">{stat.label}</span>
            <span className="usage-stat-value" style={{ color: stat.color }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Power load curve (Watts) */}
      <section className="usage-chart-section">
        <div className="usage-chart-header">
          <h2 className="section-title">Power Load Curve</h2>
          <span className="chart-badge">Watts</span>
        </div>
        <div className="usage-chart-card">
          {isLoading ? (
            <div className="chart-loading">Loading historical data...</div>
          ) : (
            <LoadChart
              datasets={wattsDatasets}
              labels={labels}
              title=""
              height={340}
              yAxisLabel="Power (W)"
              xAxisLabel="Time"
            />
          )}
        </div>
      </section>

      {/* Secondary charts row */}
      <div className="usage-secondary-charts">
        <section className="usage-chart-section">
          <div className="usage-chart-header">
            <h2 className="section-title">Current Draw</h2>
            <span className="chart-badge">Amps</span>
          </div>
          <div className="usage-chart-card">
            {isLoading ? (
              <div className="chart-loading">Loading...</div>
            ) : (
              <LoadChart
                datasets={ampsDatasets}
                labels={labels}
                title=""
                height={280}
                yAxisLabel="Current (A)"
                xAxisLabel="Time"
              />
            )}
          </div>
        </section>

        <section className="usage-chart-section">
          <div className="usage-chart-header">
            <h2 className="section-title">Voltage</h2>
            <span className="chart-badge">Volts</span>
          </div>
          <div className="usage-chart-card">
            {isLoading ? (
              <div className="chart-loading">Loading...</div>
            ) : (
              <LoadChart
                datasets={voltsDatasets}
                labels={labels}
                title=""
                height={280}
                yAxisLabel="Voltage (V)"
                xAxisLabel="Time"
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
