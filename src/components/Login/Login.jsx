import { useState } from 'react';
import { loginUser } from '../../api/authService';
import './Login.css';

function validateLoginFields(username, password) {
  const errors = {};
  if (!username.trim()) errors.username = 'Escribe tu usuario o correo.';
  if (!password.trim()) errors.password = 'Escribe tu contraseña.';
  return errors;
}

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación antes de hacer la petición
    const validationErrors = validateLoginFields(username, password);
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setError('Por favor llena todos los campos.');
      return;
    }

    try {
      setLoading(true);
      const userData = await loginUser(username, password);
      onLoginSuccess(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Panel Izquierdo */}
      <div className="login-banner">
        <div className="banner-center">
          <div className="academic-cap-icon">🎓</div>
          <h1 className="brand-title">EduControl</h1>
          <p className="brand-description">
            Sistema de control escolar para consultar y administrar la información de los alumnos.
          </p>
        </div>
      </div>

      {/* Panel Derecho */}
      <div className="login-form-container">
        <div className="login-card">
          <h2>Iniciar sesión</h2>
          <p className="login-subtitle">Ingresa tus datos para continuar</p>

          {error && <div className="error-banner" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-username">Usuario o correo</label>
              <div className={`input-wrapper ${fieldErrors.username ? 'has-error' : ''}`}>
                <span className="input-icon">👤</span>
                <input
                  id="login-username"
                  type="text"
                  placeholder="usuario o correo@ejemplo.com"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setFieldErrors((current) => ({ ...current, username: undefined }));
                  }}
                />
              </div>
              {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Contraseña</label>
              <div className={`input-wrapper ${fieldErrors.password ? 'has-error' : ''}`}>
                <span className="input-icon">🔒</span>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((current) => ({ ...current, password: undefined }));
                  }}
                />
              </div>
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
