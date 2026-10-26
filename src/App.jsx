import { useState } from 'react';
import Login from './components/Login/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    // Limpia los parámetros de la URL para que la siguiente sesión empiece en Inicio.
    window.history.replaceState(null, '', window.location.pathname);
    setUser(null);
  };

  // Vista protegida: sin usuario en el estado, solo se puede ver el Login.
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
