import './Header.css';

export default function Header({ title, subtitle }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="page-header" id="page-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
      <div className="header-right">
        <div className="header-datetime">
          <span className="header-date">{dateStr}</span>
          <span className="header-time">{timeStr}</span>
        </div>
        <div className="header-status-badge">
          <span className="status-indicator"></span>
          <span>Connected</span>
        </div>
      </div>
    </header>
  );
}
