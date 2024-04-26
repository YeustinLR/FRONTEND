import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/video.css';

const Video = ({ restrictedUserId }) => {
  const [playlistData, setPlaylistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/yt/playlist/video/${restrictedUserId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setPlaylistData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos de la playlist y videos:', error);
        setError('Error al obtener datos de la playlist y videos');
        setLoading(false);
      }
    };

    fetchPlaylistData();
  }, [restrictedUserId]);

  if (loading) {
    return <div className="video-container">Cargando...</div>;
  }

  if (error) {
    return <div className="video-container">Error: {error}</div>;
  }

  if (playlistData.length === 0) {
    return <div className="video-container">No se encontraron playlists o videos asociados.</div>;
  }

  return (
    <div className="video-container">
      <h1 className="video-title">Playlists y Videos Asociados</h1>
      {playlistData.map((playlist) => (
        <div key={playlist._id} className="playlist-item">
          <h2>{playlist.nombrePlaylist}</h2>
          <ul className="video-list">
            {playlist.videos.map((video) => (
              <li key={video._id} className="video-item">
                <h3>{video.nombreVideo}</h3>
                <p>{video.descripcion}</p>
                <a
                  href={video.urlYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-link"
                >
                  Ver en YouTube
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Video;
