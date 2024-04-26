import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/admin.css"; // Importa el archivo de estilos CSS

const Admin = () => {
  return (
    <div className="admin-container">
      <h2 className="admin-title">Página de Administración</h2>
      <ul>
        <li>
          <Link to="/restricted" className="link-item">CRUD RestrictedUser</Link>
        </li>
        <li>
          <Link to="/PlaylistManag" className="link-item">CRUD PlayLists</Link>
        </li>
        <li>
          <Link to="/videoManagment" className="link-item">CRUD Videos</Link>
        </li>
      </ul>
    </div>
  );
};

export default Admin;
