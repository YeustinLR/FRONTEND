import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './components/Pages/Inicio';
import Login from './components/Pages/Login';
import Layout from './components/Layout/Layaout';
import Home from './components/Pages/Home';
import Register from './components/Pages/Register';
import Admin from './components/Pages/Admin';
import Restricted from './components/Pages/RegisterRestricted';
import PlaylistManag from './components/Pages/PlaylistManagment'
import Video from './components/Pages/Videos'
import VideoManagement from './components/Pages/VideoManagment'




const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [restrictedUserId, setRestrictedUserId] = useState(null); // Estado para el ID del usuario restringido



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} setLoggedIn={setLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              isLoggedIn ? (
                <Home restrictedUserId={restrictedUserId} setRestrictedUserId={setRestrictedUserId} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
          path="/admin"
          element={
            isLoggedIn ? (
              <Admin />
            ) : (
              <Navigate to="/login" replace />
            )
          }
          />
          <Route
          path="/restricted"
          element={
            isLoggedIn ? (
              <Restricted />
            ) : (
              <Navigate to="/login" replace />
            )
          }
          />
          <Route
          path="/playlistManag"
          element={
            isLoggedIn ? (
              <PlaylistManag />
            ) : (
              <Navigate to="/login" replace />
            )
          }
          />
          <Route
          path="/video"
          element={
            isLoggedIn ? (
              <Video restrictedUserId={restrictedUserId} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
          />
          <Route
          path="/videoManagment"
          element={
            isLoggedIn ? (
              <VideoManagement/>
            ) : (
              <Navigate to="/login" replace />
            )
          }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
