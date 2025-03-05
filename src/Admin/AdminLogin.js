import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock } from "react-icons/fa";
import '../Admin/AdminLogin.css';  // Ensure this file exists and contains styles
import sideImage from '../assets/images/DPS.jpeg'; // Replace with the correct path to your image
import { logincontext } from '../App';

function AdminLogin({ setView }) {
  const [login, setLogin] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prevLogin) => ({
      ...prevLogin,
      [name]: value
    }));
  };

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useContext(logincontext)[0];
  const [token, setToken] = useContext(logincontext)[1];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loginUrl = 'http://127.0.0.1:8000/staffportal/admin-login/';
    const credentials = {
      username: login.username,
      password: login.password,
    };

    try {
      const response = await axios.post(loginUrl, credentials);
      if (response.status === 200) {
        setToken(response.data.token);
        setIsAuthenticated(true);
        localStorage.setItem('username', login.username);  // Store the username in localStorage
        navigate('/admindashboard');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setIsAuthenticated(false);
    }
  };

  const handleForgotPassword = () => {
    setView('forgetpasswordstu'); // Change the view to 'forgotpasswordadmin'
  };

  const navigateToSignup = () => {
    navigate('/adminreg');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setToken(null);
    navigate('/admin/login'); // Navigate to login or another page
  };

  return (
    <div className="world-admin-login-container">
      <div className="world-admin-login-box">
        <div className="world-admin-login-header">
          <h2>ADMIN LOGIN</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="world-admin-input-group">
            <FaUser className="world-admin-input-icon" />
            <input
              type="text"
              name="username"
              value={login.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="world-admin-input-group">
            <FaLock className="world-admin-input-icon" />
            <input
              type="password"
              name="password"
              value={login.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="world-admin-options">
            <label>
              <input type="checkbox" /> Remember
            </label>
            <a href="#" onClick={handleForgotPassword} className="world-admin-forgot-password-link">
              Forgot Password
            </a>
          </div>
          <button type="submit" className="world-admin-button">Login</button>
        </form>
        <div className="world-admin-register">
          <p>Don't have an account?</p>
          <a href="#" className="world-admin-register-button" onClick={() => setView('adminreg')}>
            REGISTER HERE
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
