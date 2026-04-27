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

  let cumulative = 0;
  return longestTime.map((val) => {
    cumulative += val;
    return cumulative.toFixed(1);
  });
}

/**
 * Get the start index for the last hour of data.
 * Returns the index from which to slice the arrays to get only the last hour.
 */
function getLastHourStartIndex(timeArray) {
  const oneHourSeconds = 3600; // 1 hour = 3600 seconds
  let cumulativeTime = 0;
  for (let i = timeArray.length - 1; i >= 0; i--) {
    cumulativeTime += timeArray[i] || 0;
    if (cumulativeTime >= oneHourSeconds) {
      return i;
    }
  }
  return 0; // If less than 1 hour of data, return all
}

export default function UsagePage({ loadNames }) {
  const load1 = useLoadData('load1');
  const load2 = useLoadData('load2');
  const load3 = useLoadData('load3');

  const isLoading = load1.loading || load2.loading || load3.loading;
  const names = loadNames || ['Load 1', 'Load 2', 'Load 3'];

  // Get start indices for last hour
  const startIndex1 = getLastHourStartIndex(load1.time);
  const startIndex2 = getLastHourStartIndex(load2.time);
  const startIndex3 = getLastHourStartIndex(load3.time);

  // Slice data to last hour
  const load1Watts = load1.watts.slice(startIndex1);
  const load2Watts = load2.watts.slice(startIndex2);
  const load3Watts = load3.watts.slice(startIndex3);
  const load1Amps = load1.amps.slice(startIndex1);
  const load2Amps = load2.amps.slice(startIndex2);
  const load3Amps = load3.amps.slice(startIndex3);
  const load1Volts = load1.volts.slice(startIndex1);
  const load2Volts = load2.volts.slice(startIndex2);
  const load3Volts = load3.volts.slice(startIndex3);
  const load1EnergyKwh = load1.energyKwh.slice(startIndex1);
  const load2EnergyKwh = load2.energyKwh.slice(startIndex2);
  const load3EnergyKwh = load3.energyKwh.slice(startIndex3);
  const load1Time = load1.time.slice(startIndex1);
  const load2Time = load2.time.slice(startIndex2);
  const load3Time = load3.time.slice(startIndex3);

  // Build time-based labels
  const maxLen = Math.max(load1Watts.length, load2Watts.length, load3Watts.length);
  const timeLabels = buildTimeLabels(
    { time: load1Time },
    { time: load2Time },
    { time: load3Time }
  );
  const labels = timeLabels.length > 0
    ? timeLabels
    : Array.from({ length: maxLen }, (_, i) => `${(i + 1) * 10}s`);

  // Energy (kWh) datasets — primary usage chart
  const energyDatasets = [
    { label: names[0], data: load1EnergyKwh, color: '#00CB73' },
    { label: names[1], data: load2EnergyKwh, color: '#00d4ff' },
    { label: names[2], data: load3EnergyKwh, color: '#5d00ff' },
  ];

  // Power (Watts) datasets
  const wattsDatasets = [
    { label: names[0], data: load1Watts, color: '#00CB73' },
    { label: names[1], data: load2Watts, color: '#00d4ff' },
    { label: names[2], data: load3Watts, color: '#5d00ff' },
  ];

  // Current (Amps) datasets
  const ampsDatasets = [
    { label: names[0], data: load1Amps, color: '#00CB73' },
    { label: names[1], data: load2Amps, color: '#00d4ff' },
    { label: names[2], data: load3Amps, color: '#5d00ff' },
  ];

  // Voltage (Volts) datasets
  const voltsDatasets = [
    { label: names[0], data: load1Volts, color: '#00CB73' },
    { label: names[1], data: load2Volts, color: '#00d4ff' },
    { label: names[2], data: load3Volts, color: '#5d00ff' },
  ];

  // Total energy per load (kWh) - use the latest from sliced data
  const totalEnergyKwh = (load1EnergyKwh[load1EnergyKwh.length - 1] || 0) + 
                         (load2EnergyKwh[load2EnergyKwh.length - 1] || 0) + 
                         (load3EnergyKwh[load3EnergyKwh.length - 1] || 0);

  // Summary stats
  const stats = [
    {
      label: 'Total Energy',
      value: `${totalEnergyKwh.toFixed(3)} kWh`,
      color: 'var(--primary)',
    },
    {
      label: `${names[0]} Peak`,
      value: load1Watts.length > 0 ? `${Math.max(...load1Watts.map(Math.abs)).toFixed(2)} W` : '—',
      color: 'var(--load1-color)',
    },
    {
      label: `${names[1]} Peak`,
      value: load2Watts.length > 0 ? `${Math.max(...load2Watts.map(Math.abs)).toFixed(2)} W` : '—',
      color: 'var(--load2-color)',
    },
    {
      label: `${names[2]} Peak`,
      value: load3Watts.length > 0 ? `${Math.max(...load3Watts.map(Math.abs)).toFixed(2)} W` : '—',
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
            <span className="chart-badge">milliamps</span>
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
                yAxisLabel="Current (mA)"
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
