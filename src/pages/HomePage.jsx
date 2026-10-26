import './Pages.css';

export default function HomePage({ user, onNavigate }) {
  return (
    <section>
      <p className="page-kicker">Inicio</p>
      <h1 className="welcome-text">Bienvenido, {user.firstName}</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Alumnos inscritos</span>
          <span className="metric-value">1,248</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Materias</span>
          <span className="metric-value">64</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Docentes</span>
          <span className="metric-value">52</span>
        </div>
      </div>

      <div className="action-banner">
        <div>
          <h3>Lista de alumnos</h3>
          <p>Consulta, filtra y busca la información de todos los alumnos registrados.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => onNavigate('alumnos')}>
          Ver alumnos
        </button>
      </div>
    </section>
  );
}
