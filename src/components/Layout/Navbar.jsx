import { useState } from 'react';
import './Layout.css';

export default function Navbar({ user, onLogout }) {
  const [imageFailed, setImageFailed] = useState(false);
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username;
  const initials = fullName.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="navbar">
      <div className="user-profile">
        {user.image && !imageFailed ? (
          <img src={user.image} alt={`Foto de ${fullName}`} className="user-avatar" onError={() => setImageFailed(true)} />
        ) : (
          <div className="user-avatar user-avatar-fallback">{initials}</div>
        )}
        <div className="user-info">
          <span className="user-name">{fullName}</span>
          <span className="user-role">@{user.username}</span>
        </div>
        <button type="button" onClick={onLogout} className="logout-btn">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
