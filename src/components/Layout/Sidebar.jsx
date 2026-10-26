import { NAV_ITEMS } from '../../constants/appConstants';
import './Layout.css';

export default function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-icon">📖</span>
        <span className="sidebar-title">EduControl</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
