import './Sidebar.css';

export default function Sidebar({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '⚡' },
    { id: 'usage', label: 'Usage', icon: '📊' },
  ];

  return (
    <nav className="sidebar" id="sidebar-nav">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <span className="brand-icon">⬡</span>
        </div>
        <h1 className="brand-title">BMO</h1>
        <p className="brand-subtitle">Energy Monitor</p>
      </div>

      <div className="sidebar-divider"></div>

      <ul className="sidebar-menu">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              id={`nav-${item.id}`}
              className={`sidebar-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-text">{item.label}</span>
              {currentPage === item.id && <span className="active-indicator"></span>}
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <div className="connection-status">
          <span className="status-dot"></span>
          <span className="status-text">Live</span>
        </div>
      </div>
    </nav>
  );
}
