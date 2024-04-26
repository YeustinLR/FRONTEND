import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/restrictedUser.css"

const RegisterRestricted = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    pin: '',
    avatar: '',
    edad: '',
  });
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://localhost:5000/api/yt/restrictedUser/read', config);
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios restringidos:", error);
      setErrorMessage("Error al obtener los usuarios restringidos. Por favor, inténtalo de nuevo.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post('http://localhost:5000/api/yt/restrictedUser/register', formData, config);
      setSuccessMessage('Usuario restringido registrado correctamente.');
      fetchUsers(); // Actualizar la lista de usuarios después de crear uno nuevo
      setFormData({
        nombreCompleto: '',
        pin: '',
        avatar: '',
        edad: '',
      });
    } catch (error) {
      console.error("Error al registrar el usuario restringido:", error);
      setErrorMessage("Error al registrar el usuario restringido. Por favor, inténtalo de nuevo.");
    }
  };

  const handleEdit = async (user) => {
    setEditMode(true);
    setEditUserId(user._id);
    setFormData({
      nombreCompleto: user.nombreCompleto,
      pin: user.pin,
      avatar: user.avatar || '',
      edad: user.edad,
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`http://localhost:5000/api/yt/restrictedUser/update/${editUserId}`, formData, config);
      setSuccessMessage('Usuario restringido actualizado correctamente.');
      fetchUsers(); // Actualizar la lista de usuarios después de actualizar uno
      setEditMode(false);
      setEditUserId(null);
      setFormData({
        nombreCompleto: '',
        pin: '',
        avatar: '',
        edad: '',
      });
    } catch (error) {
      console.error("Error al actualizar el usuario restringido:", error);
      setErrorMessage("Error al actualizar el usuario restringido. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/yt/restrictedUser/delete/${userId}`, config);
      setSuccessMessage('Usuario restringido eliminado correctamente.');
      fetchUsers(); // Actualizar la lista de usuarios después de eliminar uno
    } catch (error) {
      console.error("Error al eliminar el usuario restringido:", error);
      setErrorMessage("Error al eliminar el usuario restringido. Por favor, inténtalo de nuevo.");
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditUserId(null);
    setFormData({
      nombreCompleto: '',
      pin: '',
      avatar: '',
      edad: '',
    });
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro de Usuario Restringido</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={editMode ? handleUpdate : handleCreate} className="register-form">
        <input type="text" name="nombreCompleto" placeholder="Nombre Completo" value={formData.nombreCompleto} onChange={handleChange} required />
        <input type="text" name="pin" placeholder="PIN" value={formData.pin} onChange={handleChange} required />
        <input type="text" name="avatar" placeholder="URL del Avatar" value={formData.avatar} onChange={handleChange} />
        <input type="number" name="edad" placeholder="Edad" value={formData.edad} onChange={handleChange} required />
        {editMode ? (
          <div className="edit-buttons">
            <button type="button" onClick={handleCancelEdit}>Cancelar</button>
            <button type="submit">Actualizar Usuario</button>
          </div>
        ) : (
          <button type="submit">Registrar Usuario</button>
        )}
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="user-list">
        <h3>Lista de Usuarios Restringidos</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.nombreCompleto} - {user.edad} años
              <button onClick={() => handleEdit(user)}>Editar</button>
              <button onClick={() => handleDelete(user._id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RegisterRestricted;
