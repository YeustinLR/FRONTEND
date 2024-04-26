import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/login.css'; // Importa los estilos CSS

const Login = ({ setLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    verificationCode: '', // Nuevo estado para el código de verificación SMS
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showVerification, setShowVerification] = useState(false); // Estado para mostrar el formulario de verificación
  const history = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/yt/user/login', formData);
      localStorage.setItem('token', response.data.token);
      setShowVerification(true); // Mostrar el formulario de verificación después del inicio de sesión
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response.data.error);
      setErrorMessage('Datos incorrectos, vuelve a intentarlo.');
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Obtener el token JWT del LocalStorage
      const response = await axios.post('http://localhost:5000/api/yt/user/verify', {
        verificationCode: formData.verificationCode,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token JWT en la cabecera de la solicitud
        },
      });
      localStorage.setItem('token', response.data.token);
      setLoggedIn(true);
      history('/home'); // Redirige a la página principal después de la verificación exitosa
    } catch (error) {
      console.error('Error al verificar código SMS:', error.response.data.error);
      setErrorMessage('Código SMS incorrecto, vuelve a intentarlo.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {!showVerification ? (
        <form onSubmit={handleLogin} className="login-form">
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
          <button type="submit">Iniciar sesión</button>
        </form>
      ) : (
        <form onSubmit={handleVerification} className="login-form">
          <input type="text" name="verificationCode" placeholder="Código SMS" value={formData.verificationCode} onChange={handleChange} required />
          <button type="submit">Verificar</button>
        </form>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="login-link">
        <p>No tienes cuenta? <a href="/register">Regístrate</a></p>
      </div>
    </div>
  );
};

export default Login;
