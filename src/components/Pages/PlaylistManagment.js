import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/playlistManagment.css"

const PlaylistManagement = () => {
  const [playlistsWithVideos, setPlaylistsWithVideos] = useState([]);
  const [formData, setFormData] = useState({
    nombrePlaylist: '',
    perfilesAsociados: '',
  });
  const [restrictedUsers, setRestrictedUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showVideos, setShowVideos] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editPlaylistId, setEditPlaylistId] = useState(null);

  useEffect(() => {
    fetchPlaylistsAndVideos();
    fetchRestrictedUsers();
  }, []);

  const fetchPlaylistsAndVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://localhost:5000/api/yt/playlist/videoplaylist', config);
      setPlaylistsWithVideos(response.data);
    } catch (error) {
      console.error("Error al obtener las playlists y videos:", error);
      setErrorMessage("Error al obtener las playlists y videos. Por favor, inténtalo de nuevo.");
    }
  };

  const fetchRestrictedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://localhost:5000/api/yt/restrictedUser/read', config);
      setRestrictedUsers(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios restringidos:", error);
      setErrorMessage("Error al obtener los usuarios restringidos. Por favor, inténtalo de nuevo.");
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'perfilesAsociados') {
      // Convertir la cadena de perfiles separados por comas en un array
      const perfiles = e.target.value.split(',').map((perfil) => perfil.trim());
      setFormData({ ...formData, [e.target.name]: perfiles });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleAddPlaylist = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Crear un objeto con los datos de la playlist
      const playlistData = {
        nombrePlaylist: formData.nombrePlaylist,
        perfilesAsociados: [formData.perfilesAsociados], // Asegúrate de envolver el ID en un array
      };
      await axios.post('http://localhost:5000/api/yt/playlist/register', playlistData, config);
      setSuccessMessage('Playlist creada correctamente.');
      setFormData({
        nombrePlaylist: '',
        perfilesAsociados: '',
      });
      fetchPlaylistsAndVideos(); // Actualizar la lista de playlists después de agregar una nueva
    } catch (error) {
      console.error("Error al agregar la playlist:", error);
      setErrorMessage("Error al agregar la playlist. Por favor, inténtalo de nuevo.");
    }
  };

  const handleUpdatePlaylist = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // Crear un objeto con los datos actualizados de la playlist
    const updatedPlaylistData = {
      nombrePlaylist: formData.nombrePlaylist,
      perfilesAsociados: [formData.perfilesAsociados], // Asegúrate de envolver el ID en un array
    };
    await axios.put(`http://localhost:5000/api/yt/playlist/update/${editPlaylistId}`, updatedPlaylistData, config);
    setSuccessMessage('Playlist actualizada correctamente.');
    setFormData({
      nombrePlaylist: '',
      perfilesAsociados: '',
    });
    setIsEditing(false);
    setEditPlaylistId(null);
    fetchPlaylistsAndVideos(); // Actualizar la lista de playlists después de actualizar una
  } catch (error) {
    console.error("Error al actualizar la playlist:", error);
    setErrorMessage("Error al actualizar la playlist. Por favor, inténtalo de nuevo.");
  }
};


  const handleUpdatePlaylistProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`http://localhost:5000/api/yt/playlist/update/${editPlaylistId}`, {
        perfilesAsociados: formData.perfilesAsociados,
      }, config);
      setSuccessMessage('Perfiles de la playlist actualizados correctamente.');
      setIsEditing(false);
      setEditPlaylistId(null);
      fetchPlaylistsAndVideos(); // Actualizar la lista de playlists después de actualizar los perfiles
    } catch (error) {
      console.error("Error al actualizar los perfiles de la playlist:", error);
      setErrorMessage("Error al actualizar los perfiles de la playlist. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDeletePlaylist = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/yt/playlist/delete/${id}`, config);
      setSuccessMessage('Playlist eliminada correctamente.');
      fetchPlaylistsAndVideos(); // Actualizar la lista de playlists después de eliminar una
    } catch (error) {
      console.error("Error al eliminar la playlist:", error);
      setErrorMessage("Error al eliminar la playlist. Por favor, inténtalo de nuevo.");
    }
  };

  const showVideosForPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    setShowVideos(true);
  };

  const editPlaylist = (playlist) => {
    console.log('Playlist seleccionada:', playlist);
    const perfiles = Array.isArray(playlist.perfilesAsociados) ? playlist.perfilesAsociados.join(',') : '';
    console.log('Perfiles asociados:', perfiles);
    
    setFormData({
      nombrePlaylist: playlist.nombrePlaylist,
      perfilesAsociados: perfiles,
    });
    setEditPlaylistId(playlist._id);
    setIsEditing(true);
  };
  

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditPlaylistId(null);
    setFormData({
      nombrePlaylist: '',
      perfilesAsociados: '',
    });
  };
  return (
    <div className="playlist-management">
      <h2>Playlists</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <ul>
        {playlistsWithVideos.map((playlistWithVideos) => (
          <li key={playlistWithVideos._id} className="playlist-item">
            <div className="playlist-info">
              <span className="playlist-name">Nombre: {playlistWithVideos.nombrePlaylist}</span>
              <span className="playlist-profiles">ID Perfil: {playlistWithVideos.perfilesAsociados.join(' ')}</span>
              <span className="playlist-videos">Videos: {playlistWithVideos.videos.length}</span>
            </div>
            <div className="playlist-buttons">
              <button className="delete-button" onClick={() => handleDeletePlaylist(playlistWithVideos._id)}>Eliminar</button>
              <button className="view-button" onClick={() => showVideosForPlaylist(playlistWithVideos)}>Ver Videos</button>
              <button className="edit-button" onClick={() => editPlaylist(playlistWithVideos)}>Editar</button>
            </div>
          </li>
        ))}
      </ul>
      {showVideos && (
        <div>
          <h3>Videos de la Playlist: {currentPlaylist.nombrePlaylist}</h3>
          <ul>
            {currentPlaylist.videos.map((video) => (
              <li key={video._id}>
                {video.nombreVideo} - {video.descripcion} <a href={video.urlYoutube} target="_blank" rel="noopener noreferrer">Ver en YouTube</a>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowVideos(false)}>Ocultar Videos</button>
        </div>
      )}
      <h3>{isEditing ? 'Editar Playlist' : 'Agregar Nueva Playlist'}</h3>
      <input className="playlist-input" type="text" name="nombrePlaylist" placeholder="Nombre Playlist" value={formData.nombrePlaylist} onChange={handleChange} required />
      <input className="playlist-input" type="text" name="perfilesAsociados" placeholder="Perfiles Asociados (separados por comas)" value={formData.perfilesAsociados} onChange={handleChange} required />
      {isEditing ? (
        <div className="edit-buttons">
          <button className="cancel-button" type="button" onClick={handleCancelEdit}>Cancelar</button>
          <button className="update-button" type="button" onClick={handleUpdatePlaylist}>Actualizar Nombre de Playlist</button>
          <button className="update-button" type="button" onClick={handleUpdatePlaylistProfiles}>Actualizar Perfiles Asociados</button>
        </div>
      ) : (
        <button className="add-button" type="button" onClick={handleAddPlaylist}>Agregar Playlist</button>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
export default PlaylistManagement;
