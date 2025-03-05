import React, { useState, useContext } from 'react';
import './StaffLogin.css';  // Ensure you create this file for custom styles
import sideImage from '../assets/staff.jpeg'; // Replace with the actual path to your image
import { useNavigate } from 'react-router-dom';
import { logincontext } from '../App';
import axios from 'axios';

function StaffLogin({ setView }) {
  const [Login, setLogin] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const navigate = useNavigate();
  const [[isAuthenticated, setIsAuthenticated], [token, setToken]] = useContext(logincontext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...Login,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginUrl = 'http://127.0.0.1:8000/staffportal/staff-login/';
    const credentials = {
      username: Login.username,
      password: Login.password,
    };

    try {
      const response = await axios.post(loginUrl, credentials);
      if (response.status === 200) {
        const token = response.data['token'];
        localStorage.setItem('authToken', token); // Store token in localStorage
        setToken(token);
        setIsAuthenticated(true);
        navigate('/staffdashboard'); // Redirect to homepage after successful login
      } else {
        setIsAuthenticated(false);
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setIsAuthenticated(false);
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    setView('forgetpasswordstu'); // Change the view to 'forgotpassword'
  };

  return (
    <div className="staffLogin-container">
      <div className="staffLogin-left-side">
        <img src={sideImage} alt="Illustration" className="staffLogin-side-image" />
      </div>
      <div className="staffLogin-right-side">
        <form className="staffLogin-sign-in-form" onSubmit={handleSubmit}>
          <h2 className='staffLogin-head'>Sign In</h2>
          <div className="staffLogin-form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="staffLogin-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="staffLogin-form-group">
            <button type="submit" className="staffLogin-sign-in-button">Sign In</button>
          </div>
          <div className='staffLogin-forgot-password'>
            <a href="#" onClick={handleForgotPassword} className="staffLogin-forgot-password-link">Forgot Password?</a>
          </div>
          {errorMessage && (
            <div className="staffLogin-error-message">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default StaffLogin;
