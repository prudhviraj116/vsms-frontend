import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import '../Students/ClassVideostudent.css';
import { logincontext } from '../App';

const VideoApp = ({ setView }) => {
  const [date, setDate] = useState('');
  const [videos, setVideos] = useState([]);
  const [showVideos, setShowVideos] = useState(false);
  const [[isAuthenticated, setIsAuthenticated], [token, setToken]] = useContext(logincontext);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve profile data from localStorage if available
        const storedProfile = JSON.parse(localStorage.getItem('profile'));
        if (storedProfile) {
          setProfile(storedProfile);
        } else if (isAuthenticated && token) {
          // Fetch the user profile from the API if not in localStorage
          const profileResp = await axios.get('http://127.0.0.1:8000/studentportal/view_loginuser_profile/', {
            headers: { 'Authorization': 'token ' + token }
          });
          setProfile(profileResp.data);
          localStorage.setItem('profile', JSON.stringify(profileResp.data));
        }

        // Retrieve date and videos from localStorage if available
        const savedDate = localStorage.getItem('date');
        const savedVideos = localStorage.getItem('videos');
        if (savedDate) {
          setDate(savedDate);
        }
        if (savedVideos) {
          setVideos(JSON.parse(savedVideos));
          setShowVideos(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error.response ? error.response.data : error.message);
      }
    };

    fetchData();
  }, [isAuthenticated, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchVideos(); // Fetch videos based on user input
  };

  const handleBackToForm = () => {
    setShowVideos(false);
  };

  const fetchVideos = async () => {
    try {
      console.log('Fetching videos with:', { date, batch: profile.batch });

      if (!date || !profile.batch) {
        console.error('Date or batch parameter is missing.');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/studentportal/daily_video', {
        params: {
          date: date,
          batch: profile.batch,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log('API Response:', response.data);
        setVideos(response.data);
        localStorage.setItem('videos', JSON.stringify(response.data)); // Store data in localStorage
        setShowVideos(true);
        localStorage.setItem('date', date); // Store date in localStorage
      } else {
        console.error('Unexpected response status:', response.status);
        setShowVideos(false);
      }
    } catch (error) {
      console.error('Error fetching videos:', error.response ? error.response.data : error.message);
      setShowVideos(false); // Optionally hide video list if an error occurs
    }
  };

  return (
    <div className="video-app">
      {!showVideos && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={profile.batch || ''}
            onChange={(e) => setBatchNumber(e.target.value)}
            placeholder='Enter Batch Number'
            hidden
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {showVideos && (
        <div className="video-list">
          <div className="fas fa-arrow-left back-arrow-video" onClick={handleBackToForm}></div>
          <ul>
            {videos.length > 0 ? (
              videos.map((video) => (
                <li key={video.id} className="video-item">
                  <h2>{video.title}</h2>
                  <p>{new Date(video.upload_date).toLocaleDateString()} | Batch: {video.batch}</p>
                  <video controls className="video-player">
                    <source src={`http://127.0.0.1:8000${video.video_file}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </li>
              ))
            ) : (
              <p>No videos found for the selected batch and date.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VideoApp;
