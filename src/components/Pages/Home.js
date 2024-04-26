import React, { useState, useEffect } from "react";
import '../../styles/home.css'; // Importa los estilos CSS
import { useNavigate } from 'react-router-dom';

// Define el objeto avatarImages con las rutas de las imágenes
const avatarImages = {
  "1": "/imagen/avatar1.jpg",
  "2": "/imagen/avatar2.png",
  "3": "/imagen/avatar3.png",
  // Agrega más valores según sea necesario
};

const Home = ({ restrictedUserId, setRestrictedUserId }) => {
  const [restrictedUsers, setRestrictedUsers] = useState([]);
  const history = useNavigate();


  useEffect(() => {
    const getRestrictedUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query {
                restrictedUsers {
                  id
                  nombreCompleto
                  pin
                  avatar
                  edad
                  usuarioPrincipal
                }
              }
            `,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setRestrictedUsers(data.data.restrictedUsers);
        } else {
          console.error(
            "Error al obtener datos de usuarios restringidos:",
            data.errors
          );
        }
      } catch (error) {
        console.error("Error al obtener datos de usuarios restringidos:", error);
      }
    };

    getRestrictedUsers();
  }, []);

  const handlePinInput = (user) => {
    const pinInput = prompt(`Ingresa el pin para ${user.nombreCompleto}:`);
    if (pinInput === user.pin) {
      setRestrictedUserId(user.id);
      history('/video');
      console.log("Pin del usuario:", user.id); // Actualizar el ID del usuario restringido
      console.log('Pin correcto. Mostrar pantalla adicional.');
    } else {
      alert('Pin incorrecto. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="restricted-users-container">
      <h2 className="restricted-users-title">Lista de Usuarios Restringidos</h2>
      <ul className="restricted-users-list">
        {restrictedUsers.map((user) => (
          <li key={user.id} className="restricted-user-item">
            <img src={avatarImages[user.avatar]} alt={user.nombreCompleto} />
            <strong>{user.nombreCompleto}</strong>
            <br />
            Edad: {user.edad} años
            <br />
            <button onClick={() => handlePinInput(user)}>Ingresar Pin</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
