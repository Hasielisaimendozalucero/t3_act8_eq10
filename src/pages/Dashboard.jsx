import Sidebar from '../components/Layout/Sidebar';
import { NAV_ITEMS, DEFAULT_PAGE_SIZE } from '../constants/appConstants';
import Navbar from '../components/Layout/Navbar';
import HomePage from './HomePage';
import StudentsPage from './StudentsPage';
import PlaceholderPage from './PlaceholderPage';
import { useUrlParams } from '../hooks/useUrlParams';
import '../components/Layout/Layout.css';

export default function Dashboard({ user, onLogout }) {
  const [urlParams, updateUrlParams] = useUrlParams();
  const activeView = NAV_ITEMS.some((item) => item.id === urlParams.view) ? urlParams.view : 'inicio';

  const handleNavigate = (viewId) => {
    if (viewId === activeView) return;
    const defaults = viewId === 'alumnos' ? { page: 1, limit: DEFAULT_PAGE_SIZE } : {};
    updateUrlParams({ view: viewId, ...defaults }, { reset: true });
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'alumnos':
        return <StudentsPage urlParams={urlParams} updateUrlParams={updateUrlParams} />;
      case 'materias':
        return <PlaceholderPage title="Materias" />;
      case 'reportes':
        return <PlaceholderPage title="Reportes" />;
      default:
        return <HomePage user={user} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      <div className="main-content">
        <Navbar user={user} onLogout={onLogout} />
        <main className="dashboard-body">{renderActiveView()}</main>
      </div>
    </div>
  );
}
