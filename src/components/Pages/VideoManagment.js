import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/videoManag.css"

const VideoManagement = () => {
  const [videos, setVideos] = useState([]);
  const [formData, setFormData] = useState({
    nombreVideo: '',
    urlYoutube: '',
    descripcion: '',
    playlistAsociada: '', // Asegúrate de proporcionar un ID de playlist válido
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editVideoId, setEditVideoId] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/yt/video/read', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(response.data);
    } catch (error) {
      console.error('Error al obtener los videos:', error);
      setErrorMessage('Error al obtener los videos. Por favor, inténtalo de nuevo.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddVideo = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

    await axios.post('http://localhost:5000/api/yt/video/register', formData, config);
      setSuccessMessage('Video creado correctamente.');
      setFormData({
        nombreVideo: '',
        urlYoutube: '',
        descripcion: '',
        playlistAsociada: '',
      });
      fetchVideos();
    } catch (error) {
      console.error('Error al agregar el video:', error);
      setErrorMessage('Error al agregar el video. Por favor, inténtalo de nuevo.');
    }
  };

  const handleEditVideo = (video) => {
    setFormData({
      nombreVideo: video.nombreVideo,
      urlYoutube: video.urlYoutube,
      descripcion: video.descripcion,
      playlistAsociada: video.playlistAsociada,
    });
    setEditVideoId(video._id);
    setIsEditing(true);
  };

  const handleUpdateVideo = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`http://localhost:5000/api/yt/video/update/${editVideoId}`, formData, config);
      setSuccessMessage('Video actualizado correctamente.');
      setFormData({
        nombreVideo: '',
        urlYoutube: '',
        descripcion: '',
        playlistAsociada: '',
      });
      setIsEditing(false);
      setEditVideoId(null);
      fetchVideos();
    } catch (error) {
      console.error('Error al actualizar el video:', error);
      setErrorMessage('Error al actualizar el video. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`http://localhost:5000/api/yt/video/delete/${id}`, config);
      setSuccessMessage('Video eliminado correctamente.');
      fetchVideos();
    } catch (error) {
      console.error('Error al eliminar el video:', error);
      setErrorMessage('Error al eliminar el video. Por favor, inténtalo de nuevo.');
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditVideoId(null);
    setFormData({
      nombreVideo: '',
      urlYoutube: '',
      descripcion: '',
      playlistAsociada: '',
    });
  };
  

  return (
    <div>
      <h2>Administrar Videos</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <h3>{isEditing ? 'Editar Video' : 'Agregar Nuevo Video'}</h3>
      <input type="text" name="nombreVideo" placeholder="Nombre del Video" value={formData.nombreVideo} onChange={handleChange} required />
      <input type="text" name="urlYoutube" placeholder="URL de YouTube" value={formData.urlYoutube} onChange={handleChange} required />
      <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange}></textarea>
      <input type="text" name="playlistAsociada" placeholder="ID de la Playlist Asociada" value={formData.playlistAsociada} onChange={handleChange} required />
      {isEditing ? (
        <div>
          <button onClick={handleUpdateVideo}>Actualizar Video</button>
          <button onClick={handleCancelEdit}>Cancelar Edición</button>
        </div>
      ) : (
        <button onClick={handleAddVideo}>Agregar Video</button>
      )}
      <h3>Lista de Videos</h3>
      <ul>
        {videos.map((video) => (
          <li key={video._id}>
            {video.nombreVideo} - {video.descripcion} - <a href={video.urlYoutube} target="_blank" rel="noopener noreferrer">Ver en YouTube</a>
            <button onClick={() => handleEditVideo(video)}>Editar</button>
            <button onClick={() => handleDeleteVideo(video._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoManagement;
