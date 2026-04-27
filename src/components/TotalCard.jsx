import './TotalCard.css';

export default function TotalCard({ totalWatts, load1Watts, load2Watts, load3Watts, loading , load1Name, load2Name, load3Name}) {
  return (
    <div className="total-card" id="total-consumption-card">
      <div className="total-card-inner">
        <div className="total-card-content">
          <div className="total-card-label">
            <span className="total-pulse-dot"></span>
            Total Power Consumption
          </div>
          <div className="total-card-value-row">
            <span className="total-card-number">
              {loading ? '—' : Math.abs(totalWatts).toFixed(2)}
            </span>
            <span className="total-card-unit">W</span>
          </div>
          <p className="total-card-subtitle">Combined load across all channels</p>
        </div>

        <div className="total-card-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-dot" style={{ background: 'var(--load1-color)' }}></span>
            <span className="breakdown-label">{load1Name}</span>
            <span className="breakdown-value">{loading ? '—' : `${Math.abs(load1Watts).toFixed(2)} W`}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-dot" style={{ background: 'var(--load2-color)' }}></span>
            <span className="breakdown-label">{load2Name}</span>
            <span className="breakdown-value">{loading ? '—' : `${Math.abs(load2Watts).toFixed(2)} W`}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-dot" style={{ background: 'var(--load3-color)' }}></span>
            <span className="breakdown-label">{load3Name}</span>
            <span className="breakdown-value">{loading ? '—' : `${Math.abs(load3Watts).toFixed(2)} W`}</span>
          </div>
        </div>
      </div>

      <div className="total-card-glow"></div>
    </div>
  );
}
