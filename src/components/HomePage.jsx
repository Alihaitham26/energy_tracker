import { useLoadData } from '../hooks/useLoadData';
import Header from './Header';
import TotalCard from './TotalCard';
import LoadCard from './LoadCard';
import LoadChart from './LoadChart';
import { calculateEgyptElectricityBill } from '../electricty-bills';
import './HomePage.css';

/**
 * Build cumulative time labels from the time arrays.
 * Each time value represents the interval (in seconds) between readings.
 * We compute cumulative elapsed time and format as "Xs" or "Xm Ys".
 */
function buildTimeLabels(load1, load2, load3) {
  const maxLen = Math.max(load1.time.length, load2.time.length, load3.time.length);
  if (maxLen === 0) return [];

  const longestTime = [load1, load2, load3].reduce(
    (best, l) => (l.time.length > best.time.length ? l : best)
  ).time;

  return longestTime.map((val) => String(val));
}

export default function HomePage({ loadNames, onChangeLoadName }) {
  const load1 = useLoadData('load11');
  const load2 = useLoadData('load2');
  const load3 = useLoadData('load3');

  const isLoading = load1.loading || load2.loading || load3.loading;
  const totalWatts = load1.latestWatts + load2.latestWatts + load3.latestWatts;
  const names = loadNames || ['Load 1', 'Load 2', 'Load 3'];
  const getName = (index) => names[index] || `Load ${index + 1}`;

  // Build time-based chart labels
  const chartLabels = buildTimeLabels(load1, load2, load3);

  // Fallback if no time data
  const maxLen = Math.max(load1.watts.length, load2.watts.length, load3.watts.length);
  const labels = chartLabels.length > 0
    ? chartLabels
    : Array.from({ length: maxLen }, (_, i) => `${(i + 1) * 10}s`);

  const chartDatasets = [
    { label: `${getName(0)} (kWh)`, data: load1.energyKwh, color: '#00CB73' },
    { label: `${getName(1)} (kWh)`, data: load2.energyKwh, color: '#00d4ff' },
    { label: `${getName(2)} (kWh)`, data: load3.energyKwh, color: '#ff6b6b' },
  ];

  // If all energy_kWh values are 0, fall back to watts chart as it has meaningful data
  const allEnergyZero = [...load1.energyKwh, ...load2.energyKwh, ...load3.energyKwh].every(v => v === 0);

  const fallbackDatasets = [
    { label: `${getName(0)} (W)`, data: load1.watts, color: '#00CB73' },
    { label: `${getName(1)} (W)`, data: load2.watts, color: '#00d4ff' },
    { label: `${getName(2)} (W)`, data: load3.watts, color: '#ff6b6b' },
  ];

  // Total power over time
  const totalPowerData = load1.watts.map((w, i) => w + (load2.watts[i] || 0) + (load3.watts[i] || 0));
  const totalPowerDataset = [
    { label: 'Total Power (W)', data: totalPowerData, color: '#ff9500' },
  ];

  const totalEnergyNow = load1.totalEnergy + load2.totalEnergy + load3.totalEnergy;
  const elapsedSeconds = Math.max(
    load1.time.reduce((sum, value) => sum + (value || 0), 0),
    load2.time.reduce((sum, value) => sum + (value || 0), 0),
    load3.time.reduce((sum, value) => sum + (value || 0), 0),
  );

  const secondsPerMonth = 30 * 24 * 3600;
  const monthlyEnergyEstimate = elapsedSeconds > 0
    ? totalEnergyNow * secondsPerMonth / elapsedSeconds
    : 0;

  const billNow = calculateEgyptElectricityBill(totalEnergyNow);
  const billMonthly = elapsedSeconds > 0
    ? calculateEgyptElectricityBill(monthlyEnergyEstimate)
    : null;

  return (
    <div className="home-page" id="home-page">
      <Header title="Dashboard" subtitle="Real-time energy monitoring overview" />

      <TotalCard
        totalWatts={totalWatts}
        load1Watts={load1.latestWatts}
        load2Watts={load2.latestWatts}
        load3Watts={load3.latestWatts}
        loading={isLoading}
      />

      <section className="load-cards-section">
        <h2 className="section-title">Individual Loads</h2>

        <div className="load-name-inputs">
          {names.map((name, index) => (
            <label className="load-name-input" key={`load-name-${index}`}>
              <span>{`Load ${index + 1} Name`}</span>
              <input
                className="load-name-field"
                type="text"
                value={name}
                onChange={(event) => onChangeLoadName?.(index, event.target.value)}
                placeholder={`Load ${index + 1}`}
              />
            </label>
          ))}
        </div>

        <div className="load-cards-grid">
          <LoadCard
            name={getName(0)}
            watts={load1.latestWatts}
            amps={load1.latestAmps}
            volts={load1.latestVolts}
            color="var(--load1-color)"
            loading={load1.loading}
          />
          <LoadCard
            name={getName(1)}
            watts={load2.latestWatts}
            amps={load2.latestAmps}
            volts={load2.latestVolts}
            color="var(--load2-color)"
            loading={load2.loading}
          />
          <LoadCard
            name={getName(2)}
            watts={load3.latestWatts}
            amps={load3.latestAmps}
            volts={load3.latestVolts}
            color="var(--load3-color)"
            loading={load3.loading}
          />
        </div>
      </section>

      <section className="home-bill-section">
        <h2 className="section-title">Estimated Electricity Bill</h2>
        <div className="bill-card">
          <div className="bill-card-header">
            <span className="bill-card-title">Current bill estimate</span>
            <span className="bill-note">Based on recorded kWh and a 30-day projection</span>
          </div>

          <div className="bill-card-grid">
            <div className="bill-stat">
              <span className="bill-label">Recorded energy</span>
              <span className="bill-value">
                {isLoading ? '—' : `${totalEnergyNow.toFixed(3)} kWh`}
              </span>
            </div>
            <div className="bill-stat">
              <span className="bill-label">Elapsed time</span>
              <span className="bill-value">
                {elapsedSeconds > 0 ? `${elapsedSeconds.toLocaleString()} s` : '—'}
              </span>
            </div>
            <div className="bill-stat">
              <span className="bill-label">Current bill</span>
              <span className="bill-value">
                {isLoading ? '—' : `${billNow.totalCost.toFixed(2)} EGP`}
              </span>
            </div>
            <div className="bill-stat">
              <span className="bill-label">Projected monthly bill</span>
              <span className="bill-value">
                {isLoading || !billMonthly ? '—' : `${billMonthly.totalCost.toFixed(2)} EGP`}
              </span>
            </div>
          </div>

          <div className="bill-summary">
            <span>Projected monthly cost assumes current usage rate continues for 30 days.</span>
          </div>
        </div>
      </section>

      <section className="total-power-chart-section">
        <h2 className="section-title">Total Power Consumption</h2>
        <div className="chart-card">
          {isLoading ? (
            <div className="chart-loading">Loading chart data...</div>
          ) : (
            <LoadChart
              datasets={totalPowerDataset}
              labels={labels}
              title=""
              height={300}
              yAxisLabel="Power (W)"
              xAxisLabel="Time"
            />
          )}
        </div>
      </section>

    </div>
  );
}
