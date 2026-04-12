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

export default function UsagePage() {
  const load1 = useLoadData('load11');
  const load2 = useLoadData('load2');
  const load3 = useLoadData('load3');

  const isLoading = load1.loading || load2.loading || load3.loading;

  // Build time-based labels
  const maxLen = Math.max(load1.watts.length, load2.watts.length, load3.watts.length);
  const timeLabels = buildTimeLabels(load1, load2, load3);
  const labels = timeLabels.length > 0
    ? timeLabels
    : Array.from({ length: maxLen }, (_, i) => `${(i + 1) * 10}s`);

  // Energy (kWh) datasets — primary usage chart
  const energyDatasets = [
    { label: 'Load 1', data: load1.energyKwh, color: '#00CB73' },
    { label: 'Load 2', data: load2.energyKwh, color: '#00d4ff' },
    { label: 'Load 3', data: load3.energyKwh, color: '#ff6b6b' },
  ];

  // Power (Watts) datasets
  const wattsDatasets = [
    { label: 'Load 1', data: load1.watts, color: '#00CB73' },
    { label: 'Load 2', data: load2.watts, color: '#00d4ff' },
    { label: 'Load 3', data: load3.watts, color: '#ff6b6b' },
  ];

  // Current (Amps) datasets
  const ampsDatasets = [
    { label: 'Load 1', data: load1.amps, color: '#00CB73' },
    { label: 'Load 2', data: load2.amps, color: '#00d4ff' },
    { label: 'Load 3', data: load3.amps, color: '#ff6b6b' },
  ];

  // Voltage (Volts) datasets
  const voltsDatasets = [
    { label: 'Load 1', data: load1.volts, color: '#00CB73' },
    { label: 'Load 2', data: load2.volts, color: '#00d4ff' },
    { label: 'Load 3', data: load3.volts, color: '#ff6b6b' },
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
      label: 'Load 1 Peak',
      value: load1.watts.length > 0 ? `${Math.max(...load1.watts.map(Math.abs)).toFixed(2)} W` : '—',
      color: 'var(--load1-color)',
    },
    {
      label: 'Load 2 Peak',
      value: load2.watts.length > 0 ? `${Math.max(...load2.watts.map(Math.abs)).toFixed(2)} W` : '—',
      color: 'var(--load2-color)',
    },
    {
      label: 'Load 3 Peak',
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

      {/* Energy consumption chart (kWh) */}
      <section className="usage-chart-section">
        <div className="usage-chart-header">
          <h2 className="section-title">Energy Consumption</h2>
          <span className="chart-badge">kWh</span>
        </div>
        <div className="usage-chart-card">
          {isLoading ? (
            <div className="chart-loading">Loading historical data...</div>
          ) : (
            <LoadChart
              datasets={energyDatasets}
              labels={labels}
              title=""
              height={340}
              yAxisLabel="Energy (kWh)"
              xAxisLabel="Time"
            />
          )}
        </div>
      </section>

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
