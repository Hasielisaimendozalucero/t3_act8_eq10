import './Pages.css';

// Vista simulada para las opciones del menú que no forman parte del alcance de la actividad.
export default function PlaceholderPage({ title }) {
  return (
    <section>
      <h1 className="page-heading">{title}</h1>
      <div className="status-box">Esta sección está en construcción.</div>
    </section>
  );
}
