import { useLoadData } from '../hooks/useLoadData';
import Header from './Header';
import TotalCard from './TotalCard';
import LoadCard from './LoadCard';
import LoadChart from './LoadChart';
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

export default function HomePage() {
  const load1 = useLoadData('load11');
  const load2 = useLoadData('load2');
  const load3 = useLoadData('load3');

  const isLoading = load1.loading || load2.loading || load3.loading;
  const totalWatts = load1.latestWatts + load2.latestWatts + load3.latestWatts;

  // Build time-based chart labels
  const chartLabels = buildTimeLabels(load1, load2, load3);

  // Fallback if no time data
  const maxLen = Math.max(load1.watts.length, load2.watts.length, load3.watts.length);
  const labels = chartLabels.length > 0
    ? chartLabels
    : Array.from({ length: maxLen }, (_, i) => `${(i + 1) * 10}s`);

  const chartDatasets = [
    { label: 'Load 1 (kWh)', data: load1.energyKwh, color: '#00CB73' },
    { label: 'Load 2 (kWh)', data: load2.energyKwh, color: '#00d4ff' },
    { label: 'Load 3 (kWh)', data: load3.energyKwh, color: '#ff6b6b' },
  ];

  // If all energy_kWh values are 0, fall back to watts chart as it has meaningful data
  const allEnergyZero = [...load1.energyKwh, ...load2.energyKwh, ...load3.energyKwh].every(v => v === 0);

  const fallbackDatasets = [
    { label: 'Load 1 (W)', data: load1.watts, color: '#00CB73' },
    { label: 'Load 2 (W)', data: load2.watts, color: '#00d4ff' },
    { label: 'Load 3 (W)', data: load3.watts, color: '#ff6b6b' },
  ];

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
        <div className="load-cards-grid">
          <LoadCard
            name="Load 1"
            watts={load1.latestWatts}
            amps={load1.latestAmps}
            volts={load1.latestVolts}
            color="var(--load1-color)"
            loading={load1.loading}
          />
          <LoadCard
            name="Load 2"
            watts={load2.latestWatts}
            amps={load2.latestAmps}
            volts={load2.latestVolts}
            color="var(--load2-color)"
            loading={load2.loading}
          />
          <LoadCard
            name="Load 3"
            watts={load3.latestWatts}
            amps={load3.latestAmps}
            volts={load3.latestVolts}
            color="var(--load3-color)"
            loading={load3.loading}
          />
        </div>
      </section>

      <section className="overview-chart-section">
        <h2 className="section-title">
          {allEnergyZero ? 'Power Overview' : 'Energy Consumption'}
        </h2>
        <div className="chart-card">
          {isLoading ? (
            <div className="chart-loading">Loading chart data...</div>
          ) : (
            <LoadChart
              datasets={allEnergyZero ? fallbackDatasets : chartDatasets}
              labels={labels}
              title=""
              height={300}
              yAxisLabel={allEnergyZero ? 'Power (W)' : 'Energy (kWh)'}
              xAxisLabel="Time"
            />
          )}
        </div>
      </section>
    </div>
  );
}
