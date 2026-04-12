import './LoadCard.css';

export default function LoadCard({ name, watts, amps, volts, color, loading }) {
  const colorVar = color || 'var(--primary)';
  const isPositive = watts > 0;

  return (
    <div
      className={`load-card ${loading ? 'loading' : ''}`}
      id={`load-card-${name.toLowerCase().replace(/\s/g, '-')}`}
      style={{ '--card-accent': colorVar }}
    >
      <div className="load-card-header">
        <div className="load-card-dot" style={{ background: colorVar }}></div>
        <span className="load-card-name">{name}</span>
      </div>

      <div className="load-card-value">
        <span className="load-card-number">
          {loading ? '—' : Math.abs(watts).toFixed(2)}
        </span>
        <span className="load-card-unit">W</span>
      </div>

      <div className="load-card-metrics">
        <div className="load-card-metric">
          <span className="metric-label">Current</span>
          <span className="metric-value">
            {loading ? '—' : `${Math.abs(amps).toFixed(2)} A`}
          </span>
        </div>
        <div className="load-card-divider"></div>
        <div className="load-card-metric">
          <span className="metric-label">Voltage</span>
          <span className="metric-value">
            {loading ? '—' : `${Math.abs(volts).toFixed(2)} V`}
          </span>
        </div>
      </div>

      {!loading && (
        <div className={`load-card-status ${isPositive ? 'active' : 'idle'}`}>
          <span className="status-dot-sm"></span>
          {isPositive ? 'Active' : 'Idle'}
        </div>
      )}
    </div>
  );
}
