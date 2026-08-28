import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  const close = () => {
    setOpen(false);
    setMenu(false);
  };

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  const links = [
    { to: '/adopciones', label: 'Adopciones' },
    { to: '/crowdfunding', label: 'Crowdfunding' },
    { to: '/donaciones', label: 'Donaciones' },
    { to: '/mapa', label: 'Mapa' },
    { to: '/fundaciones', label: 'Fundaciones' },
  ];

  return (
    <header className="site-nav">
      <div className="container py-3 d-flex align-items-center justify-content-between gap-3">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark" aria-hidden>🐾</span>
          {APP_NAME}
        </Link>

        <nav className="nav-links d-none d-lg-flex align-items-center">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="d-flex align-items-center gap-2">
          {user ? (
            <>
              <Link to="/notificaciones" className="icon-chip" aria-label="Notificaciones">
                <i className="bi bi-bell" />
                {unreadCount > 0 && <span className="notif-dot">{unreadCount}</span>}
              </Link>
              <div className="position-relative d-none d-md-block">
                <button type="button" className="user-chip" onClick={() => setMenu((v) => !v)}>
                  <span className="avatar">{user.firstName[0]}</span>
                  {user.firstName}
                  <i className="bi bi-chevron-down small" />
                </button>
                {menu && (
                  <div className="dropdown-menu show mt-2 end-0" style={{ display: 'block', minWidth: 200 }}>
                    <Link className="dropdown-item" to="/dashboard" onClick={close}>Mi panel</Link>
                    <Link className="dropdown-item" to="/perfil" onClick={close}>Mi perfil</Link>
                    <Link className="dropdown-item" to="/favoritos" onClick={close}>Favoritos</Link>
                    <Link className="dropdown-item" to="/publicar-mascota" onClick={close}>Publicar mascota</Link>
                    {hasRole('FOUNDATION', 'RESCUER') && (
                      <Link className="dropdown-item" to="/fundacion/dashboard" onClick={close}>Panel fundación</Link>
                    )}
                    {hasRole('ADMIN', 'MODERATOR') && (
                      <Link className="dropdown-item" to="/admin" onClick={close}>Administración</Link>
                    )}
                    <button type="button" className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="d-none d-md-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">Entrar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Crear cuenta</Link>
            </div>
          )}
          <button type="button" className="icon-chip d-lg-none" aria-label="Menú" onClick={() => setOpen((v) => !v)}>
            <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'}`} />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <div className="container">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={close}>{l.label}</NavLink>
          ))}
          {user ? (
            <>
              <NavLink to="/dashboard" onClick={close}>Mi panel</NavLink>
              <NavLink to="/perfil" onClick={close}>Perfil</NavLink>
              <button type="button" className="btn btn-ghost w-100 mt-2" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <div className="d-flex gap-2 mt-2">
              <Link to="/login" className="btn btn-ghost flex-grow-1" onClick={close}>Entrar</Link>
              <Link to="/registro" className="btn btn-primary flex-grow-1" onClick={close}>Registrarse</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
