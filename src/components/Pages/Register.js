//  ../Pages/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import '../../styles/register.css'; // Importa los estilos CSS

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    pin: '',
    nombre: '',
    apellidos: '',
    pais: '',
    fechaNacimiento: '',
    telefono: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const history = useNavigate();

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/yt/user/register', formData);
      setSuccessMessage('Usuario registrado correctamente,SE HA ENVIADO UN LINK DE CONFIRMACIÓN AL CORREO.');
      setTimeout(() => {
        setSuccessMessage('');
        history('/login'); // Redirige al usuario al login después del registro
      }, 5000); // Oculta el mensaje de éxito después de 5 segundos
    } catch (error)  {
        if (error.response && error.response.data && error.response.data.errors) {
            const errorsArray = error.response.data.errors;
            const errorMessage = errorsArray.map(error => error.msg).join('. ');
            setErrorMessage(errorMessage);
            setTimeout(() => {
                setErrorMessage('');
              }, 5000);
        } else {
            console.error("Error al registrar el usuario:", error);
            setErrorMessage("Error al registrar el usuario. Por favor, inténtalo de nuevo.");
        }
    }
};

  return (
    <div className="register-container">
      <h2 className="register-title">Registro</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input type="text" name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange} required />
        <input type="text" name="pais" placeholder="País" value={formData.pais} onChange={handleChange} required />
        <input type="date" name="fechaNacimiento" placeholder="Fecha de Nacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
        <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />
        <input type="number" name="pin" placeholder="PIN" value={formData.pin} onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="login-link">
        <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
      </div>
    </div>
  );
};

export default Register;
