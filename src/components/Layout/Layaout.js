import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/navbar.css'; // Importa los estilos CSS

const Layout = ({ isLoggedIn, handleLogout, children }) => {
  const location = useLocation();

  return (
    <div>
      <nav className="navbar-container">
        <ul className="navbar-nav">
          {!isLoggedIn && location.pathname === '/' && (
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
          )}
          {!isLoggedIn && location.pathname !== '/' && (
            <li className="nav-item">
              <Link to="/" className="nav-link">Inicio</Link>
            </li>
          )}
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/" className="nav-link">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link to="/home" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin" className="nav-link">Administracion</Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
